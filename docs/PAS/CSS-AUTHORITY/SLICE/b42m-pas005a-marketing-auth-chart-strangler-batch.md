# Slice B42m ÔÇö Marketing / Auth / Chart Strangler Batch (PAS-005A ┬º14)

**Prerequisite:** B42l delivered ÔÇö wrapper registry ÔëÑ38 entries; bridge-index placeholder paths for hero/chart/statistics/auth parity rows

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö replaces bridge-index placeholder wrapperPaths with real strangler files; auth remains afenda-only (ERP governed auth-shell)

**Clean Core impact:** AÔåÆA ÔÇö marketing/chart/statistics bridge delegates where Governed UI safe; auth wrappers wire governed auth-shell, not MCP login/error blocks

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42m-pas005a-marketing-auth-chart-strangler-batch.md

1. Objective    ÔÇö Replace presentation-mcp-wrapper.registry bridge-index placeholder wrapperPaths with real files under presentation/wrappers/ for hero, auth (afenda-only), chart earning report, and statistics orders/sales overview; update studio-block-parity.registry wrapperPath rows; preserve @afenda/appshell public exports.
2. Allowed layerÔÇö packages/appshell/src/presentation/wrappers/** ┬À packages/appshell/src/__tests__/** ┬À packages/shadcn-studio/src/registry/studio-block-parity.registry.ts ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42m-*.md ┬À docs/PAS/pas-status-index.md ┬À docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (┬º14 row) ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42l-pas005a-studio-css-consolidation.md (deferred section)
3. Files        ÔÇö marketing/hero-section-01.wrapper.tsx ┬À auth/login-page-04.wrapper.tsx ┬À auth/error-page-02.wrapper.tsx ┬À dashboard/chart-earning-report.wrapper.tsx ┬À statistics/orders-progress-card.wrapper.tsx ┬À statistics/sales-overview-card.wrapper.tsx ┬À presentation-mcp-wrapper.registry.ts ┬À studio-block-parity.registry.ts ┬À presentation-mcp-wrapper.registry.test.ts ┬À presentation-mcp-wrapper-b42m.test.ts ┬À shadcn-studio-bridge.test.ts ┬À slice doc ┬À pas-status-index ┬À PAS-005A ┬º14 ┬À b42l deferred
4. Prohibited   ÔÇö foundation-disposition.registry.ts ┬À replace auth-shell with MCP login/error blocks in ERP ┬À copy MCP TSX into appshell ┬À remove afenda-appshell-studio.css ┬À break AppShellAuthLoginPage04 / AppShellAuthErrorPage02 public exports from auth-shell/index.ts
5. Authority    ÔÇö PAS-005A ┬À ADR-0017 ┬À Governed UI consumer rules ┬À B42i/B42k strangler registry ┬À auth-shell promotion pipeline
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       ÔÇö Six strangler wrapper files ┬À registry + parity wrapperPath retarget ┬À B42m test proving on-disk paths ┬À bridge-index placeholder elimination ┬À PAS-005A ┬º14 B42m row ┬À pas-status-index Delivered
8. Evidence     ÔÇö presentation-mcp-wrapper-b42m.test.ts ┬À presentation-mcp-wrapper.registry.test.ts (entryCount 40 ┬À delegatingCount ÔëÑ 8) ┬À shadcn-studio-bridge.test.ts ┬À all gates pasted in Completion Report
9. Attestation  ÔÇö Bridge-index placeholder closure ┬À Auth afenda-only wiring ┬À Marketing/chart/statistics delegating strangler ┬À Gate evidence
```

## B42m scope

| Public export / registry key | MCP block | Bridge twin | Wrapper status | Rationale |
| --- | --- | --- | --- | --- |
| `AppShellPresentationHeroSection01` | `hero-section-01` | `AppShellPresentationHeroSection01` | delegating | Zero-prop MCP hero; Governed UI safe delegate |
| `AppShellAuthLoginPage04` | `login-page-04` | `AppShellPresentationLoginPage04` | afenda-only | ERP governed auth-shell; MCP twin for parity only |
| `AppShellAuthErrorPage02` | `error-page-02` | `AppShellPresentationAuthErrorPage02` | afenda-only | Same ÔÇö AuthShellErrorSurface |
| `AppShellPresentationChartEarningReport` | `chart-component-02` | `AppShellPresentationChartEarningReport` | delegating | Prop-driven pass-through; no ERP governed shell required |
| `AppShellPresentationStatisticsOrdersProgressCard` | `statistics-component-09` | `AppShellPresentationStatisticsOrdersProgressCard` | delegating | Optional className only |
| `AppShellPresentationStatisticsSalesOverviewCard` | `statistics-component-06` | `AppShellPresentationStatisticsSalesOverviewCard` | delegating | Optional className only |
| `AppShellDashboardRevenueChart` | `chart-component-01` | `AppShellPresentationChartSalesMetrics` | governed-compose | Existing thin re-export via revenue-chart.wrapper.tsx ÔÇö unchanged |

## DoD

- [x] Slice doc with 9-field handoff
- [x] Six new wrapper files under presentation/wrappers/
- [x] No bridge-index placeholder wrapperPaths in presentation-mcp-wrapper.registry.ts
- [x] studio-block-parity.registry.ts wrapperPath for hero, login, error-page-02, chart-component-02, statistics orders/sales
- [x] Auth public exports unchanged from auth-shell/index.ts
- [x] presentation-mcp-wrapper-b42m.test.ts + registry test updates
- [x] All gates run with evidence
