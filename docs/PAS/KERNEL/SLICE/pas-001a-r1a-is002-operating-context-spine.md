# Slice PAS-001A-R1a — IS-002 Operating Context Assembly Spine

> **Position:** Slice `R1a of R1d` in PAS-001A rebuild · Blueprint box: **ERP Integration Spine**

**Prerequisite:** B71 Delivered (IS-001 live) · B111 Delivered (tenant lifecycle bridge) · ADR-0027 PAS-006 skeleton present

**Status:** Delivered

**Type:** Implementation

**Risk class:** High — restores canonical ERP assembly path removed by ADR-0027

**Clean Core impact:** B→A — `apps/erp` regains full `OperatingContext` assembly; kernel unchanged

## Authority decision (kernel-authority)

PAS-001A-R1a rebuilds **IS-002 Operating Context Assembly** on the ADR-0027 skeleton.

| Layer | R1a role |
| --- | --- |
| `@afenda/kernel` | **Consumer only** — branded `OperatingContext` shapes, projection helpers; **no new vocabulary** |
| `@afenda/permissions` | **IS-001 unchanged** — parse/assert grant-scope wire; ERP calls `resolvePermissionScopeContext` |
| `apps/erp` | **Runtime owner** — canonical resolver spine + integration registry |
| PAS-006 presentation | **Out of scope** — receives context in R1b layout wiring entry only |

**Kernel hard stops (R1a):**

- No `packages/kernel/src/**` edits unless blocked — escalate PAS-001 amendment slice
- No kernel permission-scope wire ingress
- No parallel `TenantContext` / grant vocabulary in ERP
- ERP **translates** validated facts into kernel-branded context — does not redefine vocabulary

**Ingress chain (INV-001 · INV-003):**

```text
untrusted request
  → @afenda/permissions parse/assert (IS-001)
  → ERP brandPermissionScopeContextFromUnknownWire (kernel projection)
  → ERP resolve-consolidation-scope / tenant-domain / session bridge
  → OperatingContext (kernel-branded shape)
  → single export: resolveOperatingContext* spine
```

## Purpose

Restore full `CONTEXT_INTEGRATION_WIRING` + auth bridge registries in `context-integration-registry.ts`, implement canonical `resolve-operating-context.server.ts` spine (headers + grant scope + DB session), and upgrade `check:erp-operating-context-spine` from B111 slim mode to **full IS-002** verification.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-r1a-is002-operating-context-spine.md

1. Objective    — Re-deliver IS-002 operating-context assembly spine on ADR-0027 ERP skeleton with machine-enforced integration registry.
2. Allowed layer— apps/erp/src/lib/context/** · scripts/governance/check-erp-operating-context-spine.mts · apps/erp/src/lib/context/__tests__/** · docs/PAS/KERNEL/**
3. Files        —
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/context/resolve-operating-context.server.ts
   apps/erp/src/lib/context/resolve-operating-context-from-headers.server.ts
   apps/erp/src/lib/context/resolve-grant-scope.server.ts
   apps/erp/src/lib/context/resolve-consolidation-scope.server.ts
   apps/erp/src/lib/context/build-operating-context-from-database.server.ts
   apps/erp/src/lib/context/brand-permission-scope-context.server.ts
   apps/erp/src/lib/context/operating-context-resolver-registry.ts
   apps/erp/src/lib/context/__tests__/operating-context-spine.integration.test.ts
   scripts/governance/check-erp-operating-context-spine.mts
   docs/PAS/KERNEL/SLICE/pas-001a-r1a-is002-operating-context-spine.md
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md
4. Prohibited   — packages/kernel/src/** · new kernel exports · bypass Permissions parser for grant scope · @afenda/appshell restore · foundation-disposition.registry.ts
5. Authority    — PAS-001A §2.1–§2.3 · IS-002 · INV-001–INV-003 · kernel-authority · multi-tenancy-erp Step 8
6. Gates        —
   pnpm check:erp-operating-context-spine
   pnpm check:permission-scope-permissions-surface
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm quality:boundaries
7. Closes       — PAS-001A §6.1 rows 3 · 4 · 6 · 7 · 8 (partial) · IS-002 target registry
8. Evidence     —
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/context/resolve-operating-context.server.ts
   scripts/governance/check-erp-operating-context-spine.mts
9. Attestation  — Integration · Test · Governance
```

## Target integration registry (machine authority)

Restore in `context-integration-registry.ts` (adapt pre-reset B72 + B110 + B111):

| Constant | Purpose | Notes |
| --- | --- | --- |
| `CONTEXT_INTEGRATION_WIRING` | IS-002 spine delegates | **Replace** legacy AppShell entry with PAS-006 protected layout adapter |
| `AUTH_SESSION_BRIDGE_WIRING` | Session → operating context bridge | Auth session ingress at ERP trust boundary |
| `AUTH_ACTOR_BRIDGE_WIRING` | B110 protected-path actor resolver | Canonical `resolveProtectedPathActor` chain |
| `TENANT_LIFECYCLE_BRIDGE_WIRING` | B111 — **retain** | Already live (3 entries) |

### CONTEXT_INTEGRATION_WIRING (PAS-006 adapted target)

| id | step | module (target) | delegate |
| --- | --- | --- | --- |
| `protected-api-routes` | Wire protected API routes | `server/api/runtime/create-api-handler.ts` | `assertRoutePermission` |
| `protected-server-actions` | Wire protected server actions | `lib/server-actions/resolve-action-operating-context.server.ts` | `resolveActionOperatingContext` |
| `permission-checks` | Feed resolved context into permission checks | `lib/api/authorize-api-route.ts` | `checkPermission` |
| `presentation-shell-context` | Pass allowed contexts to PAS-006 protected shell | `app/(protected)/layout.tsx` | `toPresentationShellOperatingContext` *(new adapter — not @afenda/appshell)* |
| `context-switch` | Validate context switch server-side | `lib/context/context-switch.action.ts` | `switchOperatingContextAction` |
| `operating-context-spine` | Canonical assembly entry | `lib/context/resolve-operating-context.server.ts` | `resolveOperatingContext` |

B72 gate MUST verify every row: module exists · delegate exported · no forbidden deep imports.

## PAS-001A-R1a MUST rules

1. Every protected assembly path MUST call the canonical spine — no forked local scope models (INV-001).
2. Grant scope MUST enter through `@afenda/permissions` parser/assert — never kernel wire ingress (INV-002 · INV-003).
3. `resolve-operating-context.server.ts` MUST export the single canonical `resolveOperatingContext` used by R1b/R1c consumers.
4. Registry constants MUST be declared in `context-integration-registry.ts` — not duplicated in governance scripts only.
5. `TENANT_LIFECYCLE_BRIDGE_WIRING` MUST remain green — R1a extends, does not replace B111.
6. No `@afenda/kernel` vocabulary expansion — stop → PAS-001 amendment if new words required.
7. Integration tests MUST prove spine success + fail-closed paths (missing session, denied membership).
8. B72 gate MUST fail when any wiring delegate is missing or registry id duplicates.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Full `CONTEXT_INTEGRATION_WIRING` + auth bridges declared and wired | `pnpm check:erp-operating-context-spine` |
| 2 | Canonical `resolveOperatingContext` spine with integration tests | `operating-context-spine.integration.test.ts` |
| 3 | Permissions ingress unchanged (IS-001) | `pnpm check:permission-scope-permissions-surface` |
| 4 | No kernel package edits | `pnpm quality:boundaries` |

**Field 8 evidence map (post-delivery):**

| DoD # | Evidence path |
| --- | --- |
| 1 | `apps/erp/src/lib/context/context-integration-registry.ts` |
| 2 | `apps/erp/src/lib/context/resolve-operating-context.server.ts` |
| 3 | Gate output in R1d attestation |
| 4 | `pnpm quality:boundaries` output |

## Out of scope

| Item | Owner slice |
| --- | --- |
| Protected route middleware / layout enforcement | PAS-001A-R1b |
| Metadata block render / hydration | PAS-001A-R1c |
| §6 matrix 10/10 re-close | PAS-001A-R1d |
| OpenAPI contract changes | Separate API track — not R1a |

## Related

- [B72](./b72-erp-operating-context-spine-gate.md) · [B111](./b111-tenant-lifecycle-extension-consumer-attestation.md) · [B110](./b110-auth-actor-protected-path-attestation.md)
- [PAS-001A §2.3](../PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md)
