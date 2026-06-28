# Slice B77 — ERP Domain Layout Gate (PAS-001B §4.1)

> **Position:** Slice `2 of 31` in PAS-001B · Blueprint box: `ERP Wire Vocabulary Catalog`

**Prerequisite:** B76 Delivered

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — layout contract + gate

## Purpose

Deliver erp-domain-layout.contract.ts and check:erp-domain-layout gate enforcing module folder maturity and KV-* registry parity.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b77-erp-domain-layout-gate.md

1. Objective    — Machine-enforce ERP domain layout contract for catalog modules.
2. Allowed layer— packages/kernel/src/erp-domain/erp-domain-layout.contract.ts · scripts/governance/check-erp-domain-layout.mts
3. Files        —
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   scripts/governance/check-erp-domain-layout.mts
   docs/PAS/KERNEL/SLICE/b77-erp-domain-layout-gate.md
4. Prohibited   — Promoting module maturity without slice · @afenda/database
5. Authority    — PAS-001B §4.1 · kernel-authority
6. Gates        —
   pnpm check:erp-domain-layout
   pnpm --filter @afenda/kernel typecheck
7. Closes       — Closes DoD #1–#3 · layout gate
8. Evidence     —
   packages/kernel/src/erp-domain/erp-domain-layout.contract.ts
   scripts/governance/check-erp-domain-layout.mts
   Gate output archived
9. Attestation  — Contract · Governance · Test
```

## Rules frozen

1. Layout contract is single registry for module maturity and KV ids.
2. Gate fails when folder exists without layout row or vice versa.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Layout gate passes | pnpm check:erp-domain-layout | PAS-001B §4.1 |
| 2 | Kernel typecheck green | pnpm --filter @afenda/kernel typecheck | PAS-001B §11 |
| 3 | Composed slice SSOT published | file read | PAS-001B §12 |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | packages/kernel/src/erp-domain/erp-domain-layout.contract.ts |
| 2 | scripts/governance/check-erp-domain-layout.mts |
| 3 | Gate output archived |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| ERP domain layout gate | Yes — B77 | `scripts/governance/check-erp-domain-layout.mts` |

