create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null unique,
  description text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint organizations_name_length
    check (char_length(name) between 2 and 80),

  constraint organizations_slug_length
    check (char_length(slug) between 2 and 60),

  constraint organizations_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  constraint organizations_description_length
    check (
      description is null
      or char_length(description) <= 500
    )
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),

  organization_id uuid not null
    references public.organizations(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  role text not null default 'member',

  created_at timestamptz not null default now(),

  constraint organization_members_role_check
    check (
      role in (
        'owner',
        'admin',
        'editor',
        'member'
      )
    ),

  constraint organization_members_unique_user
    unique (
      organization_id,
      user_id
    )
);

create unique index if not exists
organization_one_owner_idx
on public.organization_members(organization_id)
where role = 'owner';

create index if not exists
organization_members_user_id_idx
on public.organization_members(user_id);

create index if not exists
organization_members_organization_id_idx
on public.organization_members(organization_id);

create index if not exists
organizations_slug_idx
on public.organizations(slug);

alter table public.organizations
enable row level security;

alter table public.organization_members
enable row level security;
create or replace function public.create_organization(
  p_name text,
  p_slug text,
  p_description text default null
)
returns public.organizations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_organization public.organizations;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_name is null
     or char_length(trim(p_name)) < 2
     or char_length(trim(p_name)) > 80 then
    raise exception 'Invalid organization name';
  end if;

  if p_slug is null
     or trim(p_slug) !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then
    raise exception 'Invalid organization slug';
  end if;

  insert into public.organizations (
    name,
    slug,
    description
  )
  values (
    trim(p_name),
    lower(trim(p_slug)),
    nullif(trim(p_description), '')
  )
  returning *
  into v_organization;

  insert into public.organization_members (
    organization_id,
    user_id,
    role
  )
  values (
    v_organization.id,
    v_user_id,
    'owner'
  );

  return v_organization;
end;
$$;

revoke all
on function public.create_organization(text, text, text)
from public;

grant execute
on function public.create_organization(text, text, text)
to authenticated;
create policy "members can view organizations"
on public.organizations
for select
to authenticated
using (
  exists (
    select 1
    from public.organization_members om
    where om.organization_id = organizations.id
      and om.user_id = auth.uid()
  )
);

create policy "admins can update organizations"
on public.organizations
for update
to authenticated
using (
  exists (
    select 1
    from public.organization_members om
    where om.organization_id = organizations.id
      and om.user_id = auth.uid()
      and om.role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1
    from public.organization_members om
    where om.organization_id = organizations.id
      and om.user_id = auth.uid()
      and om.role in ('owner', 'admin')
  )
);

create policy "owners can delete organizations"
on public.organizations
for delete
to authenticated
using (
  exists (
    select 1
    from public.organization_members om
    where om.organization_id = organizations.id
      and om.user_id = auth.uid()
      and om.role = 'owner'
  )
);
create policy "members can view organization members"
on public.organization_members
for select
to authenticated
using (
  exists (
    select 1
    from public.organization_members viewer
    where viewer.organization_id =
      organization_members.organization_id
      and viewer.user_id = auth.uid()
  )
);

create policy "admins can update members"
on public.organization_members
for update
to authenticated
using (
  exists (
    select 1
    from public.organization_members manager
    where manager.organization_id =
      organization_members.organization_id
      and manager.user_id = auth.uid()
      and manager.role in ('owner', 'admin')
  )
)
with check (
  role <> 'owner'
  and exists (
    select 1
    from public.organization_members manager
    where manager.organization_id =
      organization_members.organization_id
      and manager.user_id = auth.uid()
      and manager.role in ('owner', 'admin')
  )
);

create policy "admins can remove members"
on public.organization_members
for delete
to authenticated
using (
  role <> 'owner'
  and exists (
    select 1
    from public.organization_members manager
    where manager.organization_id =
      organization_members.organization_id
      and manager.user_id = auth.uid()
      and manager.role in ('owner', 'admin')
  )
);
