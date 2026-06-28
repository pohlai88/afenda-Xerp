# Slice B106 — Foundation ERP Domain Scaffold Standardization

**Status:** Delivered (2026-06-28)

**Objective:** Close structural drift between hand-built foundation modules (`accounting`, `inventory`) and the governed scaffold pattern used for B80–B105. Re-scaffold from `erp-domain-foundation-module-specs.mts` while preserving ADR-0020 cross-refs, legacy registry IDs (`PKG-R01`, `PKGR02_INVENTORY`), and PAS-001 §4.1.6 fiscal ID quarantine.

**Authority:** PAS-001B §2 · Rule 2 · ADR-0020

**Prerequisite:** B76–B105 Delivered

---

## Handoff (paste into Phase 0)

| Field | Value |
| --- | --- |
| **Slice** | B106 |
| **PAS** | PAS-001B |
| **Objective** | Re-scaffold `accounting` + `inventory` to match catalog scaffold contract |
| **Allowed layer** | `packages/kernel/src/erp-domain/accounting/**`, `packages/kernel/src/erp-domain/inventory/**`, `scripts/governance/erp-domain-foundation-module-specs.mts`, `scripts/governance/scaffold-foundation-erp-domain-modules.mts`, `docs/PAS/**`, `.cursor/skills/kernel-authority/**` |
| **Prohibited** | `@afenda/database` schema; ERP routes; posting services; batch re-scaffold of B81+ modules |
| **Files (expected)** | 27 module files regenerated; foundation specs; doc sync |
| **Authority** | PAS-001B · kernel-authority · ADR-0020 |
| **Gates** | `pnpm check:erp-domain-layout`, `pnpm check:erp-domain-delivered-vocabulary`, `pnpm check:accounting-domain-contracts`, `pnpm check:inventory-domain-contracts`, `pnpm --filter @afenda/kernel typecheck`, `pnpm --filter @afenda/kernel test:run src/erp-domain`, `pnpm check:foundation-disposition`, `pnpm check:documentation-drift` |

---

## Drift resolved

| Aspect | Before (hand-built) | After (scaffold) |
| --- | --- | --- |
| Authority | No `*_AUTHORITY_PAS` | `ACCOUNTING_AUTHORITY_PAS` / `INVENTORY_AUTHORITY_PAS` = `"PAS-001B"` |
| Vocabulary registry ID | `PAS-001-4.8` / `PAS-001B-4.8` | `PAS-001B-4.8-ACCOUNTING` / `PAS-001B-4.8-INVENTORY` |
| Policy gate | Per-module legacy gates only | Unified `pnpm check:erp-domain-delivered-vocabulary` + legacy gates retained |
| Scaffold tooling | None for foundation | `scaffold-foundation-erp-domain-modules.mts` |

## Preserved invariants

- `ACCOUNTING_REGISTRY_ID` = `PKG-R01`; `INVENTORY_REGISTRY_ID` = `PKGR02_INVENTORY`
- `ACCOUNTING_AUTHORITY_ADR` / `INVENTORY_AUTHORITY_ADR` = `ADR-0020`
- `ACCOUNTING_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS` (`FiscalCalendarId`, `FiscalPeriodId`)
- Accounting permission key transform (`fiscalPeriod` → `fiscal_period_{action}`)
- Domain wire contexts (accounting: `LegalEntityCompanyType`; inventory: `ValuationMethod`)

## Closure artifacts

- [x] Foundation specs: `scripts/governance/erp-domain-foundation-module-specs.mts`
- [x] Re-scaffold runner: `scripts/governance/scaffold-foundation-erp-domain-modules.mts`
- [x] Module trees regenerated under `erp-domain/accounting/` and `erp-domain/inventory/`
- [x] Gates green (layout, unified vocabulary, legacy domain gates, typecheck, 178 erp-domain tests)
- [x] PAS-001B doc + pas-status-index + runtime matrix + kernel-authority skill synced

## Re-run (idempotent)

```bash
npx tsx scripts/governance/scaffold-foundation-erp-domain-modules.mts
```
