# Slice B72 — ERP Operating Context Spine Gate (PAS-001A §2.3 · IS-002)

> **Position:** Slice `2 of 5` in PAS-001A · Blueprint box: `ERP Integration Spine`

**Prerequisite:** B71 Delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — governance gate for ERP integration registry

## Purpose

Add `check:erp-operating-context-spine` gate verifying CONTEXT_INTEGRATION_WIRING and AUTH_SESSION_BRIDGE_WIRING entries in context-integration-registry.ts are wired in source.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b72-erp-operating-context-spine-gate.md

1. Objective    — Machine-enforce ERP operating-context integration registry wiring.
2. Allowed layer— scripts/governance/check-erp-operating-context-spine.mts · apps/erp/src/lib/context/**
3. Files        —
   scripts/governance/check-erp-operating-context-spine.mts
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/context/__tests__/context-integration-registry.test.ts
   docs/PAS/KERNEL/SLICE/b72-erp-operating-context-spine-gate.md
4. Prohibited   — Kernel contract changes · resolver shortcuts bypassing resolveOperatingContextFromHeaders
5. Authority    — PAS-001A §2.3 · IS-002 · multi-tenancy Step 8
6. Gates        —
   pnpm check:erp-operating-context-spine
   pnpm check:erp-context-surface *(archived — superseded by spine gate + quality:boundaries post ADR-0027)*
   pnpm --filter @afenda/erp test:run
7. Closes       — Closes DoD #1–#3 · IS-002 integration spine
8. Evidence     —
   scripts/governance/check-erp-operating-context-spine.mts
   apps/erp/src/lib/context/context-integration-registry.ts
   Gate output archived in B75 attestation
9. Attestation  — Governance · Test · Documentation
```

## Rules frozen

1. Each registry module path resolves under apps/erp/src/.
2. Each delegate symbol exported from declared module.
3. Forbidden import patterns from check-erp-context-surface.mts rejected.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Gate fails on missing module/delegate | pnpm check:erp-operating-context-spine | PAS-001A §2.3 IS-002 |
| 2 | Gate passes on mainline registry | pnpm check:erp-operating-context-spine | PAS-001A §6 acceptance matrix row 2 |
| 3 | ERP context surface gate green | pnpm check:erp-context-surface *(archived)* · `check:erp-operating-context-spine` + `quality:boundaries` *(active)* | PAS-001A §13 baseline |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | scripts/governance/check-erp-operating-context-spine.mts |
| 2 | apps/erp/src/lib/context/context-integration-registry.ts |
| 3 | Gate output archived in B75 attestation |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| IS-002 spine gate | Yes — B72 | `scripts/governance/check-erp-operating-context-spine.mts` |

