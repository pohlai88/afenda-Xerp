# Slice B42f ÔÇö Dashboard/Shell MCP Batch + Appshell Bridge Expansion (PAS-005A ┬º11.4)

**Prerequisite:** B42e delivered ÔÇö account-settings 01ÔÇô07 + dashboard widget batch (~27% parity)

**Status:** Delivered (2026-06-28) ÔÇö extended dashboard/shell parity + full appshell bridge re-exports; **legacy delete still blocked**

**Type:** Implementation

**Risk class:** Medium ÔÇö MCP install + expanded `@afenda/appshell` public bridge surface

**Clean Core impact:** AÔåÆA ÔÇö MCP re-seed + strangler bridge only; no legacy TSX migration

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42f-pas005a-dashboard-shell-bridge-expansion.md

1. Objective    ÔÇö Install remaining dashboard/shell MCP blocks; register shell chrome parity for B42c surfaces; expand appshell bridge re-exports for account-settings + dashboard blocks.
2. Allowed layerÔÇö packages/shadcn-studio/** ┬À packages/appshell/src/shadcn-studio-bridge/** ┬À packages/appshell/src/index.ts (bridge export only) ┬À packages/appshell/src/__tests__/shadcn-studio-bridge.test.ts ┬À docs/PAS/**
3. Files        ÔÇö (see Completion Report)
4. Prohibited   ÔÇö DELETE packages/appshell/src/shadcn-studio/** ┬À Migrate/copy legacy TSX ┬À foundation-disposition.registry.ts ┬À Governed UI className strip
5. Authority    ÔÇö PAS-005A ┬º11.4 ┬À ADR-0017 ┬À B42b inventory ┬À PKGR05A
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run -- shadcn-studio-bridge
   pnpm quality:boundaries
7. Closes       ÔÇö B42f dashboard/shell MCP gap; appshell consumer path to account-settings + extended dashboard MCP blocks
8. Evidence     ÔÇö MCP batch command in ┬ºMCP batch; studio-block-parity.registry.ts; shadcn-studio-bridge/index.ts
9. Attestation  ÔÇö Inventory ┬À Bridge ┬À Build ┬À Documentation
```

## MCP batch (executed)

| Category | Registry ids |
| --- | --- |
| Dashboard statistics | `statistics-component-03`, `-06`, `-07`, `-10`, `-16`, `-21` |
| Charts | `chart-component-02` |
| Widgets | `widget-component-06` |
| Auth error | `error-page-02` |

**Install cwd:** `packages/shadcn-studio` ┬À **Flags:** `-y -o`

## Parity snapshot (post-B42f)

| Metric | Value |
| --- | ---: |
| Legacy production blocks | 63 |
| Registry tracked MCP surfaces | **36** |
| Parity (registry entries / legacy) | **~57%** |
| **Delete blocked** | **Yes** |

Shell chrome entries (B42c surfaces, B42f registry): `dialog-search`, `dropdown-notification`, `dropdown-language`, `dropdown-profile`, `dialog-activity`.

## Bridge exports

`@afenda/appshell` re-exports all live MCP blocks via `shadcn-studio-bridge` with `AppShellPresentation*` names (account-settings 01ÔÇô07, dashboard statistics, widgets, auth error, parity registry).

## Remaining (B42g+)

- Residual legacy blocks (module chrome, context switcher, account-settings content panels counted separately in B42b)
- Legacy delete when `computeStudioBlockParitySummary().deleteBlocked === false`
- Governed UI className strip on MCP blocks (deferred)

## DoD

- [x] Dashboard/shell MCP batch installed
- [x] Parity registry expanded (~57%)
- [x] Appshell bridge expanded + tests
- [x] typecheck + test:run + build gates
- [ ] Legacy tree delete (deferred)
