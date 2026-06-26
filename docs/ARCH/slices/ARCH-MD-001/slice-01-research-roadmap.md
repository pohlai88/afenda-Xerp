# ARCH-MD-001 Slice 1 — Master Data Enterprise Research & Roadmap

| Field | Value |
| --- | --- |
| **Parent ARCH** | [`[Partially Implemented] ARCH-MD-001-master-data-enterprise.md`](../../%5BPartially%20Implemented%5D%20ARCH-MD-001-master-data-enterprise.md) |
| **Prerequisite** | — |
| **Slice** | 1 |
| **Status** | **Delivered** (2026-06-26) |
| **Type** | Research |
| **Risk class** | Low |
| **Clean Core impact** | A→A (docs-only) |

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-MD-001/slice-01-research-roadmap.md

1. Objective    — Author docs-only ARCH-MD-001 research and enterprise roadmap for business master data; establish P0–P3 classification, business key policy, domain sequence, and Gherkin acceptance model. No runtime implementation.
2. Allowed layer— docs-only: docs/ARCH/, docs/ARCH/slices/ARCH-MD-001/
3. Files        —
   docs/ARCH/[Partially Implemented] ARCH-MD-001-master-data-enterprise.md
   docs/ARCH/slices/ARCH-MD-001/slice-01-research-roadmap.md
   docs/ARCH/slices/ARCH-MD-001/slice-index.md
   docs/ARCH/arch-status-index.md
4. Prohibited   — packages/**; apps/**; foundation-disposition.registry.ts; packages/master-data; packages/inventory; Drizzle schemas; API routes; UI; accounting runtime (ADR-0010); Viet-ERP code copy
5. Authority    — ARCH-TEMPLATE.md · fdr-010-master-data-authority · TIP-008B archive · dependency-registry.md · ARCH-API-001 · ARCH-API-002
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm check:business-master-data-scaffold
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
   pnpm quality:boundaries
7. Closes       — ARCH-MD-001 research slice; architecture acceptance for master data roadmap (runtime still not started)
8. Evidence     —
   packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts
   packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts
   Gate log in ARCH-MD-001 §15 Slice 1
9. Attestation  — Documentation · BRD traceability · Boundary (no package edits)
```

## Acceptance

- [x] ARCH-MD-001 fills all 19 sections per `write-arch-slice` / `ARCH-TEMPLATE.md`
- [x] Status explicitly states **architecture accepted; runtime master data not started**
- [x] §5.5 Master Data Business Key Policy present
- [x] P0/P1/P2/P3 table covers all capabilities
- [x] Viet-ERP comparison bounded (patterns yes, hub topology no)
- [x] Central `@afenda/master-data` explicitly prohibited
- [x] Domain sequence: inventory → CRM → procurement → HRM
- [x] Waiver carry-forward from fdr-010 documented
- [x] Research gate log with exit codes
- [x] `arch-status-index.md` row added

## Notes

- Supplier natural key field in kernel authority is `vendorCode` (not `supplierCode`).
- Product natural key is `sku` (`tenant_catalog` scope).
- Employee natural key is `employeeNumber` (not `employeeNo`).
