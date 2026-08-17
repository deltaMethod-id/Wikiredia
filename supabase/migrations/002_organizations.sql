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
