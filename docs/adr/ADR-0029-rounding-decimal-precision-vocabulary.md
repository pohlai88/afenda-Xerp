# ADR-0029 — Rounding Mode and Decimal Precision Kernel Vocabulary

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-30 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |
| **Amends** | [PAS-001 §4.5](PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) (Localization / Global Format surface) |

---

## Context

Finance, Inventory, and Reporting domains reference platform-level rounding mode and decimal precision codes, but these terms were not yet kernel-owned vocabulary (PAS-001-AUD-13 gap **G-AUD13-02**). Without governed codes, consumers risk divergent string literals and incompatible wire payloads across ERP modules.

Kernel must own **words only** — rounding execution and decimal formatting remain in domain packages and ERP presentation layers per Kernel NS §9.

Slice [B112](../PAS/KERNEL/SLICE/b112-rounding-decimal-precision-vocabulary-amendment.md) implements this ADR.

---

## Decision

### 1. Kernel-owned vocabulary (codes only)

| Primitive | Wire shape | Governed values |
| --- | --- | --- |
| `RoundingMode` | `{ mode: string }` | `half_up`, `half_even`, `down`, `up`, `half_down` |
| `DecimalPrecision` | `{ scale: number }` | Integer scale `0`–`18` inclusive |

Each primitive ships the standard PAS-001 wire triad: `*.contract.ts` · `*.assert.ts` · `*.parser.ts` under `packages/kernel/src/context/`.

### 2. Prohibited in kernel

- Rounding arithmetic or banker's rounding execution
- `Intl`, `NumberFormat`, or locale-driven formatting
- Persisting company-selected rounding/precision in kernel (ERP consumer slice)

### 3. Consumer ownership

| Concern | Owner |
| --- | --- |
| Rounding mode / decimal precision **codes** | `@afenda/kernel` |
| Company / legal-entity selected mode and scale | ERP settings (PAS-001A consumer track) |
| Amount rounding **execution** | Finance / domain packages |
| UI display precision | ERP / reporting presentation (PAS-006) |

### 4. Gates

- `pnpm check:kernel-context-wire-triad`
- `pnpm check:kernel-zero-runtime-deps`
- `pnpm --filter @afenda/kernel test:run`

---

## Consequences

- B112 moves from Planned to Delivered; slice catalog count increases by one `b*.md` handoff.
- ERP localization and company settings slices may import kernel parsers at trust boundaries without redefining literals.
- Future breaking changes to governed tokens require a new ADR + PAS-001 amendment.

---

## References

- [PAS-001 Kernel Vocabulary Authority](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)
- [B112 handoff](../PAS/KERNEL/SLICE/b112-rounding-decimal-precision-vocabulary-amendment.md)
- [Kernel NS §3.1](../NORTHSTAR/kernel-north-star.md)
