# Slice B112 — RoundingMode / DecimalPrecision Vocabulary Amendment (PAS-001 §4.5)

> **Position:** Amendment slice · Blueprint box: `Kernel Vocabulary` · closes G-AUD13-02

**Prerequisite:** PAS-001-AUD-13 Delivered · ERP localization ingress attestation (AUD-13 consumer gap) Delivered · [ADR-0029](../../adr/ADR-0029-rounding-decimal-precision-vocabulary.md) Accepted

**Status:** Delivered (2026-06-30)

**Type:** Vocabulary amendment (kernel contracts only — no formatting runtime)

**Risk class:** Medium — cross-domain Finance / Inventory / Reporting alignment

## Authority decision (kernel-authority)

| Claim | Allowed after B112 execution |
| --- | --- |
| `RoundingMode` kernel primitive | **Yes — ADR-0029 + wire triad + gates** |
| `DecimalPrecision` kernel primitive | **Yes — ADR-0029 + wire triad + gates** |
| Kernel performs rounding at runtime | **Never** |
| Kernel formats decimals at runtime | **Never** |
| ERP stores rounding/precision codes on company settings | **Consumer work — separate PAS-001A slice after B112** |

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b112-rounding-decimal-precision-vocabulary-amendment.md

1. Objective    — Add RoundingMode + DecimalPrecision kernel primitive contracts, wire triads, parser delegates, and zero-runtime-deps gates; amend PAS-001 §4.5 vocabulary table.
2. Allowed layer— packages/kernel/src/context/rounding-mode.* · packages/kernel/src/context/decimal-precision.* · docs/adr/ADR-0029-rounding-decimal-precision-vocabulary.md · docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md · scripts/governance/check-kernel-context-wire-triad.mts
3. Files        —
   packages/kernel/src/context/rounding-mode.contract.ts
   packages/kernel/src/context/rounding-mode.assert.ts
   packages/kernel/src/context/rounding-mode.parser.ts
   packages/kernel/src/context/decimal-precision.contract.ts
   packages/kernel/src/context/decimal-precision.assert.ts
   packages/kernel/src/context/decimal-precision.parser.ts
   packages/kernel/src/context/__tests__/rounding-mode.contract.test.ts
   packages/kernel/src/context/__tests__/decimal-precision.contract.test.ts
   docs/adr/ADR-0029-rounding-decimal-precision-vocabulary.md
4. Prohibited   — Intl/NumberFormat usage in kernel · rounding arithmetic in kernel · ERP persistence without separate consumer attestation slice · foundation-disposition.registry.ts (delegate registry-owner)
5. Authority    — PAS-001 §4.5 · PAS-001-AUD-13 · kernel-authority · ADR-0029
6. Gates        —
   pnpm check:kernel-zero-runtime-deps
   pnpm check:kernel-context-wire-triad
   pnpm --filter @afenda/kernel test:run
   pnpm check:documentation-drift
7. Closes       — G-AUD13-02 (RoundingMode / DecimalPrecision platform primitives)
8. Evidence     — kernel contract tests · ADR-0029 · PAS-001 §4.5 amendment row
9. Attestation  — Contract · Gate · Documentation
```

## DoD (delivered)

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | ADR-0029 accepted before kernel code | docs/adr/ADR-0029-*.md status Accepted |
| 2 | assert → parse wire triads for both primitives | `pnpm check:kernel-context-wire-triad` |
| 3 | Zero runtime deps preserved | `pnpm check:kernel-zero-runtime-deps` |
| 4 | Contract tests green | `pnpm --filter @afenda/kernel test:run` |
