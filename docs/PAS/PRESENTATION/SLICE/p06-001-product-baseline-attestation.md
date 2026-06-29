# Slice P06-001 — Product Baseline Attestation (PAS-006A)

> **Position:** Slice `1 of 10` in PAS-006 family · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** ADR-0027 frontend presentation reset · legacy B38–B42f delivered

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync

**Risk class:** Low

**Clean Core impact:** A→A — attestation only; maps legacy PAS-005A closure to P06 family

## Purpose

Attest PAS-006A product baseline (theme, CSS dist, MCP seed, Storybook lab, ERP globals) as **Delivered** under the PAS-006 family slice catalog. Does not reopen legacy B38–B42p execution paths.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-001-product-baseline-attestation.md

1. Objective    — Record P06-001 Delivered status; map legacy B38–B42f evidence to PAS-006A.
2. Allowed layer— docs/PAS/PRESENTATION/** · docs/PAS/pas-status-index.md · Presentation Blueprint §10
3. Files        —
   docs/PAS/PRESENTATION/SLICE/p06-001-product-baseline-attestation.md
   docs/PAS/PRESENTATION/SLICE/presentation-slice-catalog.md
   docs/PAS/pas-status-index.md
4. Prohibited   — packages/shadcn-studio runtime edits · legacy PAS-005A re-execution · kernel imports in studio
5. Authority    — PAS-006A · ADR-0027 · Presentation Blueprint §10.1
6. Gates        —
   pnpm check:documentation-drift
   Manual review — product baseline evidence paths
7. Closes       — Closes DoD #1–#3 · PAS-006A P06-001 catalog row
8. Evidence     —
   packages/shadcn-studio/src/index.ts
   apps/erp/src/app/globals.css
   apps/storybook/stories/shadcn-studio-*.stories.tsx
9. Attestation  — Documentation · Governance
```

## Rules frozen

1. Legacy B38–B42p slices remain historical — do not re-execute for ERP.
2. P06-001 does not claim Enterprise Accepted — only product baseline.

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Slice catalog lists P06-001 Delivered | Manual review — PAS-006A §12 | PAS-006A product baseline |
| 2 | pas-status-index references PAS-006 family | `pnpm check:documentation-drift` | Blueprint §10 |
| 3 | Runtime evidence paths exist on disk | Manual review — file paths | ADR-0027 |

**Field 8 evidence map:**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | docs/PAS/PRESENTATION/SLICE/presentation-slice-catalog.md |
| 2 | docs/PAS/pas-status-index.md |
| 3 | packages/shadcn-studio/src/styles/shadcn-studio.css |
