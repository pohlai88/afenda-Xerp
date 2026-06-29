# Slice PAS-001A-R1b — Protected App Router Shell + Grant-Scope Gate

> **Position:** Slice `R1b of R1d` in PAS-001A rebuild · Blueprint box: **ERP Integration Spine** + **PAS-006 consumer**

**Prerequisite:** PAS-001A-R1a Proposed → Delivered (IS-002 spine live)

**Status:** Proposed

**Type:** Implementation

**Risk class:** High — auth boundary + every protected RSC/API path

**Clean Core impact:** B→A — protected App Router tree enforces single operating-context ingress

## Authority decision (kernel-authority)

R1b proves **INV-001** at the App Router boundary: every protected HTTP/RSC path passes exactly one `OperatingContext` assembly via the ERP spine (R1a).

| Layer | R1b role |
| --- | --- |
| `@afenda/kernel` | **None** — consume branded context only |
| `@afenda/permissions` | Grant-scope facts consumed by ERP `checkPermission` |
| `apps/erp` | Middleware/layout/registries + `authorize-api-route` pattern |
| PAS-006 | Protected layout chrome — **not** permission evaluation |

**Not kernel · Not OpenAPI:** Route protection is **ERP App Router runtime** — not HTTP OpenAPI contract design. New internal API routes may add contract rows separately; R1b does not own OpenAPI schema authority.

## Purpose

Wire protected App Router shell (middleware + `(protected)/layout` + surface registries) so grant-scope checks and actor resolution use R1a spine output — companion to B110 auth-actor attestation on PAS-006 skeleton.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-r1b-protected-app-router-shell.md

1. Objective    — Enforce protected-route operating-context ingress + grant-scope gate across App Router and internal API handlers.
2. Allowed layer— apps/erp/src/app/(protected)/** · apps/erp/src/proxy.ts · apps/erp/src/lib/auth/** · apps/erp/src/lib/api/** · apps/erp/src/lib/context/** · apps/erp/src/lib/modules/** · scripts/governance/**
3. Files        —
   apps/erp/src/proxy.ts
   apps/erp/src/app/(protected)/layout.tsx
   apps/erp/src/lib/context/operating-context-protected-surface.registry.ts
   apps/erp/src/lib/auth/auth-protected-surface.registry.ts
   apps/erp/src/lib/auth/resolve-protected-path-actor.server.ts
   apps/erp/src/lib/api/authorize-api-route.ts
   apps/erp/src/lib/api/resolve-api-route-operating-context.ts
   apps/erp/src/lib/modules/guard-module-route.server.ts
   apps/erp/src/lib/context/to-presentation-shell-operating-context.ts
   apps/erp/src/lib/context/__tests__/operating-context-protected-surface.registry.test.ts
   apps/erp/src/__tests__/operating-context-rsc-bridge.integration.test.ts
   apps/erp/src/__tests__/auth-session-bridge.integration.test.ts
   scripts/governance/check-erp-auth-actor-protected-path-attestation.mts
   docs/PAS/KERNEL/SLICE/pas-001a-r1b-protected-app-router-shell.md
4. Prohibited   — packages/kernel/src/** · permission evaluation in kernel · @afenda/appshell · @afenda/metadata-ui · raw session.userId on protected paths · foundation-dis disposition.registry.ts
5. Authority    — PAS-001A §2.4 · INV-001 · INV-005 · B110 · kernel-authority · multi-tenancy-erp
6. Gates        —
   pnpm check:erp-auth-actor-protected-path-attestation
   pnpm check:erp-operating-context-spine
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm quality:boundaries
7. Closes       — Protected App Router presence · PAS-001A §6.1 row 4 (runtime ingress) · B110-R1 companion on skeleton
8. Evidence     —
   apps/erp/src/lib/context/operating-context-protected-surface.registry.ts
   apps/erp/src/lib/api/authorize-api-route.ts
   apps/erp/src/app/(protected)/layout.tsx
9. Attestation  — Security · Integration · Test · Governance
```

## Protected surface model

```text
Request
  → proxy.ts / middleware (session + tenant hints)
  → resolveOperatingContext (R1a spine)
  → resolveProtectedPathActor (B110)
  → authorize-api-route.checkPermission (API)
  → OR RSC page via operating-context-protected-surface.registry
  → PAS-006 protected layout (presentation shell context adapter)
```

### Registries (machine-enforced)

| Registry | Enforces |
| --- | --- |
| `operating-context-protected-surface.registry.ts` | Every `(protected)/**` page declares spine delegate |
| `auth-protected-surface.registry.ts` | Auth-adjacent paths use canonical actor resolver |
| `AUTH_SESSION_BRIDGE_WIRING` | Session bridge modules (R1a registry) |
| `AUTH_ACTOR_BRIDGE_WIRING` | Actor resolver modules (R1a registry) |

## PAS-001A-R1b MUST rules

1. No protected RSC page may resolve tenant/company/org IDs from untrusted client input without spine (INV-003).
2. Internal API routes MUST use `createApiHandler` + `authorize-api-route` pattern wired in R1a registry.
3. `(protected)/layout.tsx` MUST receive branded operating context via adapter — not rebuild scope locally.
4. `resolveProtectedPathActor` MUST be the only canonical actor ingress on protected paths (B110).
5. Module routes (`modules/[moduleId]`) MUST use `guard-module-route.server.ts` with spine output.
6. Presentation layout MUST NOT evaluate permissions — ERP spine + permissions only.
7. Auth-adjacent surfaces MUST remain WCAG AA compliant (PAS-006C gates unchanged).
8. Gate `check:erp-auth-actor-protected-path-attestation` MUST pass on skeleton tree.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Protected surface registries cover `(protected)/**` tree | `operating-context-protected-surface.registry.test.ts` |
| 2 | Auth actor attestation green | `pnpm check:erp-auth-actor-protected-path-attestation` |
| 3 | RSC + session bridge integration tests green | `operating-context-rsc-bridge.integration.test.ts` |
| 4 | Spine registry still green after layout wiring | `pnpm check:erp-operating-context-spine` |

## Out of scope

| Item | Owner slice |
| --- | --- |
| Metadata workspace block render | PAS-001A-R1c |
| DOM slot marker hydration | P06-008-R2 (presentation) |
| Production Candidate re-close | PAS-001A-R1d |

## Related

- [PAS-001A-R1a](./pas-001a-r1a-is002-operating-context-spine.md) · [B110](./b110-auth-actor-protected-path-attestation.md)
- [ADR-0027](../../../adr/ADR-0027-frontend-presentation-reset.md)
