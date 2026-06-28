# Slice B42e ÔÇö Extended `/cui` Batch: Account Settings + Dashboard (PAS-005A ┬º11.4)

**Prerequisite:** B42d delivered ÔÇö appshell re-export bridge + parity registry

**Status:** Delivered (2026-06-28) ÔÇö account-settings 01ÔÇô07 + dashboard widget/chart/datatable batch; **legacy delete still blocked**

**Type:** Implementation

**Risk class:** Medium ÔÇö large MCP install (+54 files, new npm deps)

**Clean Core impact:** AÔåÆA ÔÇö MCP re-seed only; no legacy TSX migration

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42e-pas005a-extended-cui-batch.md

1. Objective    ÔÇö Extended MCP /cui batch: install account-settings 01ÔÇô07 + dashboard surfaces (chart, stats, datatable, widgets); expand parity registry; strict TS fixes; legacy delete remains blocked.
2. Allowed layerÔÇö packages/shadcn-studio/** ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42e-pas005a-extended-cui-batch.md ┬À docs/PAS/pas-status-index.md
3. Files        ÔÇö
   packages/shadcn-studio/src/components/shadcn-studio/blocks/**
   packages/shadcn-studio/src/components/ui/**
   packages/shadcn-studio/src/hooks/use-pagination.ts
   packages/shadcn-studio/package.json
   packages/shadcn-studio/src/index.ts
   packages/shadcn-studio/src/registry/studio-block-parity.registry.ts
   packages/shadcn-studio/src/__tests__/mcp-seed-inventory.test.ts
   packages/shadcn-studio/src/__tests__/studio-block-parity.registry.test.ts
   packages/shadcn-studio/src/__tests__/package-scaffold.test.ts
   docs/PAS/CSS-AUTHORITY/SLICE/b42e-pas005a-extended-cui-batch.md
   docs/PAS/pas-status-index.md
4. Prohibited   ÔÇö DELETE packages/appshell/src/shadcn-studio/** ┬À Migrate/copy legacy TSX ┬À packages/appshell/** ┬À foundation-disposition.registry.ts ┬À Governed UI className strip
5. Authority    ÔÇö PAS-005A ┬º11.4 ┬À ADR-0017 ┬À B42b inventory ┬À PKGR05A prohibited do-not-migrate-appshell-studio-tsx
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/shadcn-studio build
   pnpm quality:boundaries
7. Closes       ÔÇö B42b account-settings + dashboard category MCP gap; parity registry expansion
8. Evidence     ÔÇö
   MCP install: account-settings-01..07, chart-component-01, statistics-component-02, datatable-component-05, widget-component-01/03/14
   packages/shadcn-studio/src/registry/studio-block-parity.registry.ts
9. Attestation  ÔÇö Inventory ┬À Build ┬À MCP provenance ┬À Documentation
```

## MCP batch (executed)

| Category | Registry ids | Install path |
| --- | --- | --- |
| Account settings | `@ss-blocks/account-settings-01` ÔÇª `-07` | `blocks/account-settings-*/` |
| Revenue chart | `@ss-blocks/chart-component-01` | `blocks/chart-sales-metrics.tsx` |
| Statistics | `@ss-blocks/statistics-component-02` | `blocks/statistics-card-02.tsx` |
| Invoice table | `@ss-blocks/datatable-component-05` | `blocks/datatable-invoice.tsx` |
| Dashboard widgets | `@ss-blocks/widget-component-01`, `-03`, `-14` | `blocks/widget-*.tsx` |

**Install cwd:** `packages/shadcn-studio` ┬À **Flags:** `-y -o`

## Parity snapshot (post-B42e)

| Metric | Value |
| --- | ---: |
| Legacy production blocks | 63 |
| Registry tracked MCP surfaces | 17 |
| Parity (registry entries / legacy) | ~27% |
| **Delete blocked** | **Yes** |

## Remaining (B42f+)

- Additional dashboard `/cui` batches (KPI, sparkline, regional sales, shell chrome)
- Appshell bridge re-exports for account-settings blocks
- Legacy delete when `computeStudioBlockParitySummary().deleteBlocked === false`

## DoD

- [x] Account-settings 01ÔÇô07 MCP installed
- [x] Dashboard batch (chart + stats + datatable + 3 widgets)
- [x] Parity registry expanded (17 entries)
- [x] Strict TS fixes (dropdown, sonner, pagination, next peer)
- [x] typecheck + test:run + build gates
- [ ] Legacy tree delete (deferred ÔÇö parity < 100%)
