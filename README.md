# Wikireadia — Full Release

Wikireadia is a private, organization-first wiki platform built with Next.js, TypeScript and Supabase.

## Important

This repository is intended to be **closed source/private**.

Never commit a real `SUPABASE_SERVICE_ROLE_KEY`. Keep production secrets in your deployment provider.

## Stack

- Next.js App Router
- TypeScript / TSX
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Vercel deployment
- Markdown wiki content
- Organization roles: owner / admin / editor / member

## Setup

1. Create a private Supabase project.
2. Run `supabase/migrations/001_initial.sql` in the Supabase SQL editor.
3. Fill `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Install:

```bash
npm install
```

5. Run:

```bash
npm run dev
```

## Permission model

Members can read organization content. Only `owner`, `admin`, and `editor` can create/update/delete wikis.

The important protection is **Supabase RLS**, not merely hiding an Edit button in the UI.

## GitHub

Keep the repository private. Do not commit real credentials.

The included `.env` contains blank placeholders so the project is immediately configured for environment variables without exposing a secret.
