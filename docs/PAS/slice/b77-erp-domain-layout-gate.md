# Slice B77 — ERP Domain Layout Contract + Meta Gate

**Status:** Delivered (2026-06-28)

**Objective:** Extend `erp-domain-layout.contract.ts` with full 28-slug catalog, maturity map, LoB metadata; add `pnpm check:erp-domain-layout`; register `PKGR01B_ERP_DOMAIN_CATALOG`.

**Authority:** PAS-001B §2–§7 · Rule 1 enforcement

**Prerequisite:** B76 Delivered

---

## Handoff (paste into Phase 0)

| Field | Value |
| --- | --- |
| **Slice** | B77 |
| **PAS** | PAS-001B |
| **Objective** | Layout contract + catalog-only folder prohibition gate + PKGR01B registry row |
| **Allowed layer** | `packages/kernel/src/erp-domain/erp-domain-layout.contract.ts`, `scripts/governance/check-erp-domain-layout.mts`, `package.json`, `foundation-disposition.registry.ts` |
| **Prohibited** | New module folders beyond existing `accounting/`; batch scaffolds; business-reference ID promotion |
| **Files (expected)** | layout contract, gate script, package.json script, registry row, gate test |
| **Authority** | kernel-authority · foundation-registry-owner pattern for PKGR01B |
| **Gates** | `pnpm check:erp-domain-layout`, `pnpm check:accounting-domain-contracts`, `pnpm --filter @afenda/kernel typecheck`, `pnpm check:foundation-disposition` |

---

## Rule 1 verification

Gate must fail when any `catalog-only` slug has `packages/kernel/src/erp-domain/{slug}/` on disk.

Gate must pass when only `accounting/` exists and `package.json` exports ⊆ delivered modules.

## Failure matrix (§7.1)

Hardened gate enforces all 10 conditions documented in [PAS-001B §7.1](../PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md#71-checkerp-domain-layout-failure-matrix). Exported constant: `ERP_DOMAIN_LAYOUT_GATE_FAILURE_MATRIX` in `check-erp-domain-layout.mts`.

---

## Closure artifacts

- [x] `erp-domain-layout.contract.ts` — 28 slugs, maturity, metadata, scope definitions, external runtime refs
- [x] `scripts/governance/check-erp-domain-layout.mts` — 10-point failure matrix
- [x] `pnpm check:erp-domain-layout` in root `package.json`
- [x] `PKGR01B_ERP_DOMAIN_CATALOG` in `foundation-disposition.registry.ts`
- [x] Gate test under `scripts/governance/__tests__/`
