# Slice B49 — Kernel Tenant Wire Triad (PAS-001 §4.4)

> **Position:** Slice `1 of 12` in PAS-001 · Blueprint box: `Kernel Vocabulary`

**Prerequisite:** ADR-0022 tenant wire · B16 operating-context baseline

**Status:** Delivered (2026-06-28)

**Type:** Evidence-sync

**Risk class:** Low

**Clean Core impact:** A→A — documents delivered triad; consumer typing collateral only

## Purpose

Close PAS-001 §4.4 tenant operating-context wire ingress: registry promotion, wire triad, ADR-0022 ERP split-ID branding, and PAS-004C consumer projection typing collateral.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b49-kernel-tenant-wire-triad.md

1. Objective    — Document delivered tenant wire triad; sync PAS-001 status; verify tenant triad + consumer typecheck gates green.
2. Allowed layer— docs/PAS/** · packages/enterprise-knowledge/src/projection/** · apps/erp OpenAPI meta (TS4111 only)
3. Files        —
   docs/PAS/KERNEL/SLICE/b49-kernel-tenant-wire-triad.md
   packages/kernel/src/context/tenant-context.contract.ts
   packages/kernel/src/context/context-registry.ts
   apps/erp/src/lib/context/operating-context.mappers.ts
   packages/enterprise-knowledge/src/projection/knowledge-consumer.projection.ts
4. Prohibited   — packages/kernel runtime triad edits (pre-delivered) · foundation-disposition.registry.ts · packages/ui
5. Authority    — PAS-001 §4.4 · ADR-0021/0022 · kernel-authority
6. Gates        —
   pnpm check:kernel-context-surface
   pnpm --filter @afenda/kernel test:run
   pnpm --filter @afenda/erp typecheck
7. Closes       — Closes DoD #1–#4 · tenant wire triad documentation
8. Evidence     —
   packages/kernel/src/context/tenant-context.parser.ts
   packages/kernel/src/context/context-registry.ts
   apps/erp/src/lib/context/operating-context.mappers.ts
   packages/enterprise-knowledge/src/projection/knowledge-consumer.projection.ts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Tenant wire uses contract/assert/parser triad — no branded ids without parse*.
2. ERP maps TenantLookupRow.enterpriseId → parseUnknownTenantContext.
3. Kernel owns shape; ERP owns resolver; database owns persistence.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | B49 composed slice + PAS sync | file read | PAS-001 §4.4 · Kernel NS EFR tenant wire |
| 2 | Tenant triad registered wireIngress | pnpm check:kernel-context-surface | PAS-001 §11 governance |
| 3 | ERP enterpriseId branding path | operating-context tests | ADR-0022 split-ID |
| 4 | Consumer projection overloads typecheck | pnpm --filter @afenda/erp typecheck | PAS-004C consumer projection |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/kernel/src/context/tenant-context.parser.ts |
| 2 | packages/kernel/src/context/context-registry.ts |
| 3 | apps/erp/src/lib/context/operating-context.mappers.ts |
| 4 | packages/enterprise-knowledge/src/projection/knowledge-consumer.projection.ts |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Tenant wire triad | Yes — B49 | `packages/kernel/src/context/tenant-context.*.ts` |

