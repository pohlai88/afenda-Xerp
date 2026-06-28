# Slice B42j ÔÇö Wrapper Expansion + Delegating Flip (PAS-005A ┬º14)

**Prerequisite:** B42i delivered ÔÇö Phase 1 statistics/shell/dashboard wrapper infrastructure

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö expands strangler registry; delegating flip only where a11y/tests permit

**Clean Core impact:** AÔåÆA ÔÇö shell chrome and dashboard wrappers stay governed-compose for ERP injection; MCP lab blocks retain stock shadcn className

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42j-pas005a-wrapper-expansion-delegating-flip.md

1. Objective    ÔÇö Expand presentation/wrappers for shell chrome + remaining bridge-backed dashboard blocks; register account-settings MCP twin mapping without replacing domain shells; document MCP className policy in shadcn-studio tests; flip to delegating only where bridge + tests + ui:guard permit.
2. Allowed layerÔÇö packages/appshell/src/presentation/** ┬À packages/appshell/src/shadcn-studio-bridge/** ┬À packages/appshell/src/app-shell-header.tsx ┬À packages/appshell/src/__tests__/** ┬À packages/shadcn-studio/src/index.ts ┬À packages/shadcn-studio/src/registry/** ┬À packages/shadcn-studio/src/__tests__/** ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42j-*.md ┬À docs/PAS/pas-status-index.md ┬À docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (┬º14 row) ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42i-pas005a-mcp-wrapper-strangler.md (deferred section)
3. Files        ÔÇö presentation/wrappers/** (shell chrome + dashboard) ┬À presentation/blocks thin re-exports ┬À presentation-mcp-wrapper.registry.ts ┬À shadcn-studio-bridge/index.ts ┬À shadcn-studio index.ts (shell bridge exports) ┬À studio-block-parity.registry.ts ┬À mcp-presentation-classname-policy.test.ts ┬À slice doc ┬À pas-status-index ┬À PAS-005A ┬º14 ┬À b42i deferred
4. Prohibited   ÔÇö foundation-disposition.registry.ts ┬À break @afenda/appshell public exports ┬À remove afenda-appshell-studio.css ┬À copy MCP TSX into appshell ┬À replace AppShellAccountSettings01-07 implementations
5. Authority    ÔÇö PAS-005A ┬À ADR-0017 ┬À Governed UI consumer rules (appshell only) ┬À B42 parity registry
6. Gates        ÔÇö
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       ÔÇö Shell chrome wrappers ┬À dashboard KPI/sparkline/readiness wrappers ┬À account-settings registry mapping ┬À MCP className policy test ┬À delegating flip evidence ┬À parity wrapperPath ┬À B42j slice doc
8. Evidence     ÔÇö presentation-mcp-wrapper.registry.test.ts ┬À appshell tests ┬À mcp-presentation-classname-policy.test.ts ┬À ui:guard:scan ┬À delegating flip test run
9. Attestation  ÔÇö Wrapper expansion ┬À Governed UI MCP lab policy ┬À Delegating flip criteria ┬À Gate evidence
```

## B42j wrapper scope

| Public export | MCP block id | Bridge twin | Wrapper status | Rationale |
| --- | --- | --- | --- | --- |
| `AppShellSearchDialog` | `application-shell-02` | `AppShellPresentationSearchDialog` | governed-compose | ERP search data injection + a11y |
| `AppShellNotificationDropdown` | `application-shell-02` | `AppShellPresentationNotificationDropdown` | governed-compose | Domain notification tabs/items |
| `AppShellLanguageDropdown` | `application-shell-02` | `AppShellPresentationLanguageDropdown` | governed-compose | Locale list injection |
| `AppShellProfileDropdown` | `application-shell-02` | `AppShellPresentationProfileDropdown` | governed-compose | Profile menu groups |
| `AppShellActivityDialog` | `application-shell-02` | `AppShellPresentationActivityDialog` | governed-compose | Activity feed injection |
| `AppShellDashboardKpiStat` | `statistics-component-03` | `AppShellPresentationStatisticsCard03` | governed-compose | Prop-driven KPI + icon |
| `AppShellDashboardSparklineStat` | `statistics-component-16` | `AppShellPresentationStatisticsTrendCard` | governed-compose | Chart a11y contract |
| `SystemAdminReadinessGateMetrics` | `statistics-component-03` | `AppShellPresentationStatisticsCard03` | governed-compose | Readiness gate live status |
| `AppShellAccountSettings01`ÔÇô`07` | `account-settings-0N` | `AppShellPresentationAccountSettings0N` | afenda-only | Domain injection shells ÔÇö mapping only |
| `StatisticsRevenueCard` et al. | various | bridge twins | governed-compose | a11y article/footnote tests block delegating |

## Delegating flip criteria

Flip `governed-compose` ÔåÆ `delegating` only when ALL hold:

- Bridge export resolves in `shadcn-studio-bridge`
- Appshell tests pass after flip
- `pnpm ui:guard:scan` clean

**B42j outcome:** Statistics cards retain `governed-compose` ÔÇö a11y article/footnote contract tests fail on raw MCP delegate.

## Deferred (post-B42j ÔÇö closed in B42k/B42l)

- ~~Full delegating flip for statistics cards after MCP a11y parity~~ ÔÇö closed in B42k
- ~~`afenda-appshell-studio.css` consolidation~~ ÔÇö closed in B42l
- Remaining ~50 block stranglers
- `PKGR05A` green-lane promotion via foundation-registry-owner

## DoD

- [x] Slice doc with 9-field handoff
- [x] Shell chrome wrappers + thin block re-exports
- [x] Dashboard KPI/sparkline/readiness wrappers
- [x] Account-settings registry mapping (no impl replacement)
- [x] MCP className policy test in shadcn-studio
- [x] Delegating flip attempted with evidence
- [x] Parity registry wrapperPath updates
- [x] All gates run with evidence
