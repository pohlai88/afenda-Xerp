# ADR-004: Application-Owned Authentication with Better Auth

## Status

Accepted — Governed UI

## Context

Afenda ERP requires authentication that:

- Lives inside the application boundary (not a Supabase-coupled identity product)
- Supports governed sessions, audit events, and future SSO/MFA/passkey expansion
- Integrates with Afenda's tenant/company/organization **permission engine** (Foundation phase 05) without embedding authorization in the auth layer
- Remains portable across managed cloud, self-hosted, and enterprise deployment models

Supabase is retained as the **Postgres platform** (Foundation phase 03). Supabase Auth is **not** the primary identity provider.

## Decision

Use **Better Auth** with:

- Drizzle ORM adapter against Supabase Postgres (`user`, `session`, `account`, `verification` tables)
- Next.js App Router integration (`/api/auth/[...all]`, `nextCookies` plugin)
- `@afenda/auth` package for session contracts, audit hooks, and extension points
- Platform `users` table (Foundation phase 03) remains separate from Better Auth `user` until Foundation phase 05 links identity

## Consequences

### Positive

- ERP-contract-first auth; no Supabase JWT/RLS coupling for application identity
- Drizzle-owned migrations for auth tables alongside platform schema
- Normalized `AfendaAuthSession` exposes only safe fields to AppShell and server helpers
- Auth audit events land in platform `audit_events`

### Negative / trade-offs

- Two user concepts initially: Better Auth `user` vs platform `users` (bridged in Foundation phase 05)
- Middleware uses cookie presence for redirects; server layouts/actions must call `requireSession`
- Better Auth env (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`) required in addition to database URL

## Alternatives considered

| Option | Why not primary |
|--------|-----------------|
| Supabase Auth | Couples identity to Supabase JWT/RLS; weaker ERP portability |

Legacy Supabase JWT debug remains at `/api/integrations/supabase/claims` for infrastructure diagnostics only — not ERP identity.
| NextAuth / Auth.js | Not selected; Better Auth chosen for extension model and Drizzle-first fit |
| Clerk / Auth0 | External SaaS; not application-boundary-first |
| Custom JWT | Reinvents session rotation, credential storage, and audit hooks |

## Rollback

1. Revert `@afenda/auth` integration and ERP `(protected)` route group
2. Drop auth tables migration (forward-fix only — do not run destructive reset on shared DB)
3. Restore prior middleware if needed

## References

- [Better Auth Next.js integration](https://better-auth.com/docs/integrations/next)
- [Better Auth Drizzle adapter](https://better-auth.com/docs/adapters/drizzle)
- Foundation phase 03 `@afenda/database` platform schema
