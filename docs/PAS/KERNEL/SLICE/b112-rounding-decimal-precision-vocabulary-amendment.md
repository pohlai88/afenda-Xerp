# Slice B112 — RoundingMode / DecimalPrecision Vocabulary Amendment (PAS-001 §4.5)

> **Position:** Amendment slice (planned) · Blueprint box: `Kernel Vocabulary` · closes G-AUD13-02

**Prerequisite:** PAS-001-AUD-13 Delivered · ERP localization ingress attestation (AUD-13 consumer gap) Delivered

**Status:** Planned — **do not implement kernel primitives until ADR-0029 is accepted**

**Type:** Vocabulary amendment (kernel contracts only — no formatting runtime)

**Risk class:** Medium — cross-domain Finance / Inventory / Reporting alignment

## Authority decision (kernel-authority)

| Claim | Allowed after B112 execution |
| --- | --- |
| `RoundingMode` kernel primitive | **Only after ADR-0029 + wire triad + gates** |
| `DecimalPrecision` kernel primitive | **Only after ADR-0029 + wire triad + gates** |
| Kernel performs rounding at runtime | **Never** |
| Kernel formats decimals at runtime | **Never** |
| ERP stores rounding/precision codes on company settings | **Consumer work — separate PAS-001A slice after B112** |

## Purpose

Close PAS-001-AUD-13 gap **G-AUD13-02**: platform-level rounding mode and decimal precision are referenced by Finance, Inventory, and Reporting domains but are not yet kernel-owned vocabulary brands. B112 adds **codes only** — execution stays in ERP / domain packages.

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b112-rounding-decimal-precision-vocabulary-amendment.md

1. Objective    — Add RoundingMode + DecimalPrecision kernel primitive contracts, wire triads, parser delegates, and zero-runtime-deps gates; amend PAS-001 §4.5 vocabulary table.
2. Allowed layer— packages/kernel/src/context/rounding-mode.contract.ts · packages/kernel/src/context/decimal-precision.contract.ts · packages/kernel/src/context/localization-context.contract.ts (shape extension only if ADR-0029 mandates) · docs/adr/ADR-0029-rounding-decimal-precision-vocabulary.md · docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md · scripts/governance/check-kernel-context-wire-triad.mts
3. Files        —
   packages/kernel/src/context/rounding-mode.contract.ts
   packages/kernel/src/context/decimal-precision.contract.ts
   packages/kernel/src/context/__tests__/rounding-mode.contract.test.ts
   packages/kernel/src/context/__tests__/decimal-precision.contract.test.ts
   docs/adr/ADR-0029-rounding-decimal-precision-vocabulary.md
   docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md
   docs/PAS/KERNEL/SLICE/b112-rounding-decimal-precision-vocabulary-amendment.md
4. Prohibited   — Intl/NumberFormat usage in kernel · rounding arithmetic in kernel · ERP persistence without separate consumer attestation slice · foundation-disposition.registry.ts (delegate registry-owner)
5. Authority    — PAS-001 §4.5 · PAS-001-AUD-13 · kernel-authority · ADR-0029 (required before code)
6. Gates        —
   pnpm check:kernel-zero-runtime-deps
   pnpm check:kernel-context-wire-triad
   pnpm --filter @afenda/kernel test:run
   pnpm check:documentation-drift
7. Closes       — G-AUD13-02 (RoundingMode / DecimalPrecision platform primitives)
8. Evidence     — kernel contract tests · ADR-0029 · PAS-001 §4.5 amendment row
9. Attestation  — Contract · Gate · Documentation
```

## Proposed primitive shapes (draft — ADR-0029 finalizes)

```ts
type RoundingMode = Brand<
  "HALF_UP" | "HALF_EVEN" | "DOWN" | "UP" | "HALF_DOWN",
  "RoundingMode"
>;

type DecimalPrecision = Brand<number, "DecimalPrecision">; // scale 0–18, validated at ingress
```

## Proposed ownership (unchanged from PAS-001 §4.5 spirit)

| Concern | Owner |
| --- | --- |
| Rounding mode / decimal precision **codes** | Kernel |
| Selected rounding mode for company | Company / legal entity settings (ERP) |
| Rounding **execution** on amounts | Finance / domain packages |
| Display precision for UI | ERP / reporting layer |

## DoD (when executed)

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | ADR-0029 accepted before any kernel code | docs/adr/ADR-0029-*.md status Accepted |
| 2 | assert → parse → brand wire triads for both primitives | `pnpm check:kernel-context-wire-triad` |
| 3 | Zero runtime deps preserved | `pnpm check:kernel-zero-runtime-deps` |
| 4 | PAS-001 §4.5 vocabulary table updated | `pnpm check:documentation-drift` |
| 5 | ERP consumer attestation for company settings persistence | Separate follow-on slice (mirror AUD-13 ingress pattern) |

## Follow-on (not B112)

After B112 delivers kernel vocabulary:

- ERP ingress gate extending `ERP_LOCALIZATION_INGRESS_WIRING` or sibling registry for company rounding/precision persistence
- Finance domain wire catalog entries in PAS-001B (if new domain codes required)
