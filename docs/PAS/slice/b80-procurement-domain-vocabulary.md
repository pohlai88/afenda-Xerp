# Slice B80 — Procurement Domain Vocabulary Promotion

**Status:** Delivered (2026-06-28)

**Objective:** Promote `procurement` from catalog-only to `delivered` under PAS-001B Rule 3 — one module, one slice. Scaffold contracts-only vocabulary in `packages/kernel/src/erp-domain/procurement/` mirroring `inventory/` pattern; wire `check:procurement-domain-contracts` and package subpath export.

**Authority:** PAS-001B §2 · Rule 2 (no SupplierId/ProductId duplication)

**Prerequisite:** B76–B79 Delivered

---

## Handoff (paste into Phase 0)

| Field | Value |
| --- | --- |
| **Slice** | B80 |
| **PAS** | PAS-001B |
| **Objective** | Deliver procurement kernel vocabulary module (contracts-only) |
| **Allowed layer** | `packages/kernel/src/erp-domain/procurement/**`, layout contract, governance gates, `packages/kernel/package.json`, PAS docs |
| **Prohibited** | PO posting runtime, Drizzle, `@afenda/database`, `packages/procurement` scaffold, other module folders |
| **Files (expected)** | procurement module (14-file pattern), `check-procurement-domain-contracts`, layout maturity update, B80 handoff |
| **Authority** | kernel-authority · PAS-001B §2 |
| **Gates** | `pnpm check:procurement-domain-contracts`, `pnpm check:erp-domain-layout`, `pnpm --filter @afenda/kernel typecheck`, `pnpm check:foundation-disposition` |

---

## Closure artifacts

- [x] `erp-domain/procurement/` — authority, ids, 4 closed vocabularies, registry, policy, wire context, permissions, audit, index, test
- [x] `procurement` maturity → `delivered` in layout contract
- [x] `@afenda/kernel/erp-domain/procurement` package.json subpath
- [x] `pnpm check:procurement-domain-contracts`
- [x] PKGR01B gates include procurement domain gate
