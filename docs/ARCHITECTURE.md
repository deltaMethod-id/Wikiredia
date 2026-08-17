# Architecture

## Frontend

Next.js App Router handles pages and Server Components.

## Authentication

Supabase Auth manages users and sessions.

## Authorization

Organization membership is stored in `organization_members`.

Roles:

- owner — full organization control
- admin — administrative editing access
- editor — wiki editing access
- member — read access

## Data security

Supabase Row Level Security is enabled on all application tables.

The application never trusts a client-side role flag for authorization.

## Wiki revisions

Every update creates a row in `wiki_revisions` before the current wiki content is replaced.
