# Runtime Authority Runtime Parity P5 Hardening

## Status

Implemented — runtime-parity slice P5 is active.

## Objective

Formalize a **demo-safe** tenant/auth/OperatingContext/BFF authority model for
`apps/developer` with an explicit ERP promotion boundary, without importing
Better Auth, kernel spine, database, or platform BFF routes.

## Why

The route-lab audit tracked runtime authority as pending work. ADR-0039
requires the sandbox to prove ERP-parity frontend composition while **excluding**
live auth, operating-context spine, and BFF integration. P5 closes that gap by
governing the demo fixture ingress and documenting the promotion target.

## Allowed Scope

- `apps/developer/src/lib/lab/lab-runtime-authority-policy.ts`
- `apps/developer/src/lib/lab/lab-runtime-authority-registry.ts`
- `apps/developer/src/lib/lab/lab-bff-route-registry.ts`
- `apps/developer/src/lib/lab/resolve-lab-shell-operating-context.server.ts`
- `apps/developer/src/lib/lab/lab-demo-context.ts`
- `apps/developer/src/app/(lab)/layout.tsx`
- `apps/developer/src/lib/lab/route-surface-registry.ts` (`runtimeAuthoritySeam`)
- `apps/developer/scripts/check-route-lab-governance.mjs`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`

## Out of Scope

- `apps/erp/**` wiring changes
- `@afenda/auth`, `@afenda/kernel`, `@afenda/database`, `@afenda/server` imports
- `api/internal/v1/**` BFF handlers
- Better Auth session flows or protected-route redirects
- live tenant subdomain resolution

## Constraints

- `(lab)/layout.tsx` must resolve operating context through
  `resolveLabShellOperatingContext()` — not direct fixture imports.
- Authority kind remains `demo-fixture` per [ADR-0044](../../../../docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md) (Accepted).
- BFF allowlist stays empty; only `api/lab/v1/health` remains under P1.
- ERP promotion path: `apps/erp/src/lib/context/to-shell-operating-context-wire.ts`.

## Required Deliverables

- runtime authority policy + registry
- empty BFF route registry with governance enforcement
- cached server resolver for AppShell operating-context wire
- `runtimeAuthoritySeam` metadata on route surface registry
- Vitest policy/resolver proof
- audit update marking P5 accepted

## Verification

- `node apps/developer/scripts/check-route-lab-governance.mjs`
- `pnpm --dir apps/developer test src/lib/lab/__tests__/lab-runtime-authority.test.ts src/lib/lab/__tests__/resolve-lab-shell-operating-context.test.ts`
- `pnpm --dir apps/developer typecheck`

## Done Means

- P5 runtime authority moves from Pending to Pass in the route-lab audit
- route-lab shell receives demo-safe operating context through governed ingress
- guarded runtime packages and ERP BFF routes remain blocked with test evidence

## Related Docs

- [ADR-0039](../../../../docs/adr/ADR-0039-developer-presentation-sandbox.md)
- [ADR-0044](../../../../docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md)
- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`
- `apps/developer/src/app/(lab)/MIDDLEWARE_REQUEST_POLICY_RUNTIME_PARITY_P4_HARDENING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
