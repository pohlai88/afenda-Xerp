# Slice B54 — Project Wire Triad (PAS-001 §4.11)

> **Position:** Slice `6 of 12` in PAS-001 · Blueprint box: `Kernel Vocabulary`

**Prerequisite:** B52 Delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — wire triad at ERP mapper trust boundary

## Purpose

Deliver project context wire triad for project-scoped operating context.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b54-kernel-project-wire-triad.md

1. Objective    — Deliver project context wire triad for project-scoped operating context
2. Allowed layer— packages/kernel/src/context/** · apps/erp/src/lib/context/** · docs/PAS/KERNEL/SLICE/**
3. Files        —
   docs/PAS/KERNEL/SLICE/b54-kernel-project-wire-triad.md
   packages/kernel/src/context/project-context.parser.ts
   apps/erp/src/lib/context/operating-context.mappers.ts
4. Prohibited   — foundation-disposition.registry.ts · schema migrations · packages/ui · shadcn-studio
5. Authority    — PAS-001 §4.11 · ADR-0021/0022 · kernel-authority
6. Gates        —
   pnpm check:kernel-context-surface
   pnpm --filter @afenda/kernel test:run
   pnpm --filter @afenda/erp typecheck
7. Closes       — Closes DoD #1–#3 · Project Wire Triad
8. Evidence     —
   packages/kernel/src/context/project-context.parser.ts
   apps/erp/src/lib/context/operating-context.mappers.ts
   docs/PAS/KERNEL/SLICE/b54-kernel-project-wire-triad.md
9. Attestation  — Contract · Test · Governance
```

## Rules frozen

1. Wire triad uses contract/assert/parser — branded ids only after parse*.
2. ERP maps lookup enterpriseId at mapper boundary; uuid PK retained for FK ops.
3. Kernel owns shape; ERP owns resolver; database owns persistence.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Wire triad registered and tested | pnpm check:kernel-context-surface | PAS-001 §4.11 · Kernel NS wire EFR |
| 2 | ERP mapper branding tests pass | operating-context.mappers.test.ts | ADR-0022 split-ID |
| 3 | Composed handoff SSOT published | file read | PAS-001 §12 · pas-slice-template author validation |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/kernel/src/context/project-context.parser.ts |
| 2 | apps/erp/src/lib/context/operating-context.mappers.ts |
| 3 | docs/PAS/KERNEL/SLICE/b54-kernel-project-wire-triad.md |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Project Wire Triad | Yes — B54 | `packages/kernel/src/context/project-context.parser.ts` |

