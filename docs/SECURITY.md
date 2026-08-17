# Security Notes

- Keep this GitHub repository private.
- Never commit a real Supabase service-role key.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` through client components.
- RLS is the source of truth for database authorization.
- Keep editor controls server-authorized as well as UI-protected.
- Rotate keys immediately if a secret is accidentally committed.
