# Slice B71 — Permission Scope Permissions Parser Owner (PAS-001A §2.2 · IS-001)

> **Position:** Slice `1 of 5` in PAS-001A · Blueprint box: `ERP Integration Spine`

**Prerequisite:** PAS-001 Enterprise Accepted (B70 Delivered)

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** High

**Clean Core impact:** A→B — parser moves to permissions package; kernel projection-only (justified)

## Purpose

Close IS-001 permission-scope ownership split per PAS-001A §2.2: wire assert/parse live in @afenda/permissions; kernel retains branded projection only for OperatingContext.permissionScope.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b71-permission-scope-permissions-parser.md

1. Objective    — Attest permission-scope wire triad in @afenda/permissions; remove kernel parser; add governance gate.
2. Allowed layer— packages/permissions/src/scope/** · packages/kernel/src/context/permission-scope-context.projection.ts · apps/erp/src/lib/context/** · scripts/governance/**
3. Files        —
   packages/permissions/src/scope/permission-scope-context.parser.ts
   packages/kernel/src/context/permission-scope-context.projection.ts
   scripts/governance/check-permission-scope-permissions-surface.mts
   docs/PAS/KERNEL/SLICE/b71-permission-scope-permissions-parser.md
4. Prohibited   — New kernel resolver logic · @afenda/kernel importing @afenda/permissions · ERP-local permission vocabulary
5. Authority    — PAS-001A §2.2 · IS-001 · kernel-authority
6. Gates        —
   pnpm --filter @afenda/permissions test:run
   pnpm --filter @afenda/kernel test:run
   pnpm check:permission-scope-permissions-surface
   pnpm quality:kernel-context-surface
7. Closes       — Closes DoD #1–#4 · IS-001 · INV-001
8. Evidence     —
   packages/permissions/src/scope/permission-scope-context.parser.ts
   packages/kernel/src/context/permission-scope-context.projection.ts
   scripts/governance/check-permission-scope-permissions-surface.mts
   Gate output archived in B75 attestation
9. Attestation  — Contract · Test · Governance · Security
```

## Rules frozen

1. Permission-scope wire assert/parse only in @afenda/permissions.
2. Kernel brandPermissionScopeContextFromWire is projection-only.
3. ERP assembly imports permissions parser then kernel projection.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | No permission-scope parser under kernel | pnpm check:permission-scope-permissions-surface | PAS-001A §2.2 IS-001 |
| 2 | Permissions exports assert + parser | pnpm --filter @afenda/permissions test:run | PAS-001A §4.2 runtime ingress |
| 3 | ERP typecheck with spine wiring | pnpm --filter @afenda/erp typecheck | Kernel Blueprint §4 ERP Integration Spine |
| 4 | Context surface gates green | pnpm quality:kernel-context-surface | PAS-001A §13 baseline |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/permissions/src/scope/permission-scope-context.parser.ts |
| 2 | packages/kernel/src/context/permission-scope-context.projection.ts |
| 3 | scripts/governance/check-permission-scope-permissions-surface.mts |
| 4 | Gate output archived in B75 attestation |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| IS-001 permissions-owned parser | Yes — B71 | `packages/permissions/src/scope/permission-scope-context.parser.ts` |

