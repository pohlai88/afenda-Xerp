# Afenda Auth (`@afenda/auth`)

Better Auth foundation for Afenda ERP (TIP-004).

## Responsibilities

- Application-owned sign-in, sign-out, and session retrieval
- Drizzle-backed auth tables on Supabase Postgres
- Normalized `AfendaAuthSession` contract for TIP-005 authorization
- Auth audit events (`audit_events` module `auth`)

## Out of scope

- Tenant/company/organization permission enforcement (TIP-005)
- Supabase Auth as identity provider
- Business modules

## Environment

| Variable | Location | Purpose |
|----------|----------|---------|
| `BETTER_AUTH_URL` | `.env.config` | ERP public origin (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | `.env.secret` | Cookie signing secret (≥32 chars) |
| `DATABASE_URL` / Supabase builders | `.env.secret` / `.env.config` | Postgres for Better Auth tables |

Run `pnpm env:sync` after editing sources.

## Client imports

Browser/client components must import from `@afenda/auth/client` (not the root package) to avoid bundling server-only database code.

```typescript
import { signIn, signOut, useSession } from "@afenda/auth/client";
```

## Server identity mapping

Use `toAfendaAuthIdentity(session)` before passing identity into AppShell or other UI boundaries.

## ERP wiring

- API: `apps/erp/src/app/api/auth/[...all]/route.ts`
- Protected shell: `apps/erp/src/app/(protected)/layout.tsx`
- Sign-in: `apps/erp/src/app/(auth)/sign-in/page.tsx`
- Server guard: `apps/erp/src/lib/auth/require-session.ts`

## Provider decision

See [docs/auth-provider-decision.md](./docs/auth-provider-decision.md).
