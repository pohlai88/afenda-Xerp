# fdr-007-api-governance — Slice index

> Parent: [`[Partially Implemented] fdr-007-api-governance.md`](../../%5BPartially%20Implemented%5D%20fdr-007-api-governance.md) · Registry: `PKG007_CONTEXT` · Runtime owner: `apps/erp`

| Slice | Title | Status | Type |
| ---: | --- | --- | --- |
| 1 | Research (api-governance) | **Delivered** (2026-06-25) | Research |
| 2 | Contract registry hardening | **Delivered** (Evidence-sync 2026-06-27) | Evidence-sync (reclassified from Implementation) |
| 3 | Contract closeout | Not started | Implementation |
| 4 | Registry-sync (gate registration) | **Delivered** (2026-06-26) | Registry-sync |

**Verification gates (Slice 2 Evidence-sync):** `pnpm check:api-contracts` · `pnpm check:documentation-drift` · `pnpm --filter @afenda/erp test:run -- api-contract-registry api-handler-boundary`

**Open Complete blocker:** DoD #14 peer review (`api-complete-status` partial — evidence only until Architecture Authority PR)
