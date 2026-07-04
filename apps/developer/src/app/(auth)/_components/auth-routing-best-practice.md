# Developer Auth Route Scaffolding (Pre-Wiring)

Purpose
- Define production-style explicit auth route targets in the sandbox before wiring.
- Keep catch-all routing as a controlled fixture fallback only.
- Enforce Next.js App Router + Afenda parity standards in the route lab.
- Use exactly one SSOT for route identity, metadata, and lane mapping: `src/lib/auth/auth-fixtures.ts`.

Scope
- App: apps/developer
- Segment: src/app/(auth)
- SSOT source: src/lib/auth/auth-fixtures.ts

## Best-practice checks before wiring any new route

1. Route shape
- Use explicit page route files for production-auth paths.
- Keep [...authRoute] for fixture fallback or unknown lab cases only.

2. Rendering policy
- Keep auth segment request-time rendered via force-dynamic at segment layout.
- Avoid static params generation for auth pages.

3. Metadata and contracts
- Route metadata must be derived from one source (auth fixture metadata factory).
- Route ownership must map to one fixture entry (`surfaceId` + `path`).

4. Component wiring
- Use the matching shadcn-studio auth-shell page component per fixture path purpose.
- Do not mix fixture card UI and production shell UI in the same explicit route.

5. Safety and observability
- Preserve data-auth-* attributes for smoke checks and diagnostics.
- Unknown route paths must resolve to not-found behavior.

## Wiring sequence (recommended)

1. sign-up
2. forgot-password
3. reset-password (+ success)
4. verify-email surfaces
5. invite surfaces
6. passkey/sso surfaces
7. mfa/otp/security/error surfaces

After each wiring step
- Run: pnpm --filter @afenda/developer typecheck
- Run: smoke tests for / and auth segment
- Confirm no behavior drift in existing fixture-only routes
