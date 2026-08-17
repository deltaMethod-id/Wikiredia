create extension if not exists pgcrypto;

create type public.member_role as enum ('owner', 'admin', 'editor', 'member');
create type public.wiki_visibility as enum ('public', 'organization', 'private');

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role public.member_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.wikis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  slug text not null,
  title text not null,
  summary text not null default '',
  content text not null default '',
  visibility public.wiki_visibility not null default 'organization',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.wiki_revisions (
  id uuid primary key default gen_random_uuid(),
  wiki_id uuid references public.wikis(id) on delete cascade,
  editor_id uuid references auth.users(id) on delete set null,
  title text not null,
  summary text not null default '',
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists wikis_org_idx on public.wikis(organization_id);
create index if not exists wikis_updated_idx on public.wikis(updated_at desc);
create index if not exists members_user_idx on public.organization_members(user_id);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.wikis enable row level security;
alter table public.wiki_revisions enable row level security;

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = org_id and user_id = auth.uid()
  );
$$;

create or replace function public.org_role(org_id uuid)
returns public.member_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.organization_members
  where organization_id = org_id and user_id = auth.uid()
  limit 1;
$$;

create or replace function public.can_edit_org(org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.org_role(org_id) in ('owner','admin','editor');
$$;

create policy "members can read organizations"
on public.organizations for select
using (public.is_org_member(id));

create policy "members can read membership"
on public.organization_members for select
using (public.is_org_member(organization_id) or user_id = auth.uid());

create policy "members can read wikis"
on public.wikis for select
using (
  visibility = 'public'
  or public.is_org_member(organization_id)
);

create policy "editors can insert wikis"
on public.wikis for insert
with check (
  public.can_edit_org(organization_id)
  and author_id = auth.uid()
);

create policy "editors can update wikis"
on public.wikis for update
using (public.can_edit_org(organization_id))
with check (public.can_edit_org(organization_id));

create policy "editors can delete wikis"
on public.wikis for delete
using (public.can_edit_org(organization_id));

create policy "editors can create revisions"
on public.wiki_revisions for insert
with check (
  editor_id = auth.uid()
  and exists (
    select 1 from public.wikis w
    where w.id = wiki_id and public.can_edit_org(w.organization_id)
  )
);

create policy "members can read revisions"
on public.wiki_revisions for select
using (
  exists (
    select 1 from public.wikis w
    where w.id = wiki_id and public.is_org_member(w.organization_id)
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists organizations_updated_at on public.organizations;
create trigger organizations_updated_at
before update on public.organizations
for each row execute procedure public.set_updated_at();

drop trigger if exists wikis_updated_at on public.wikis;
create trigger wikis_updated_at
before update on public.wikis
for each row execute procedure public.set_updated_at();
