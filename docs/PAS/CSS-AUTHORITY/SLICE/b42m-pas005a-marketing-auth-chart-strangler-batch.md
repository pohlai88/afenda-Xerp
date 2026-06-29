# Slice B42m — Marketing / Auth / Chart Strangler Batch (PAS-005A §14)

**Prerequisite:** B42l delivered — wrapper registry ÔëÑ38 entries; bridge-index placeholder paths for hero/chart/statistics/auth parity rows

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — replaces bridge-index placeholder wrapperPaths with real strangler files; auth remains afenda-only (ERP governed auth-shell)

**Clean Core impact:** AÔåÆA — marketing/chart/statistics bridge delegates where Governed UI safe; auth wrappers wire governed auth-shell, not MCP login/error blocks

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42m-pas005a-marketing-auth-chart-strangler-batch.md

1. Objective    — Replace presentation-mcp-wrapper.registry bridge-index placeholder wrapperPaths with real files under presentation/wrappers/ for hero, auth (afenda-only), chart earning report, and statistics orders/sales overview; update studio-block-parity.registry wrapperPath rows; preserve @afenda/appshell public exports.
2. Allowed layer— packages/appshell/src/presentation/wrappers/** · packages/appshell/src/__tests__/** · packages/shadcn-studio/src/registry/studio-block-parity.registry.ts · docs/PAS/CSS-AUTHORITY/SLICE/b42m-*.md · docs/PAS/pas-status-index.md · docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (§14 row) · docs/PAS/CSS-AUTHORITY/SLICE/b42l-pas005a-studio-css-consolidation.md (deferred section)
3. Files        — marketing/hero-section-01.wrapper.tsx · auth/login-page-04.wrapper.tsx · auth/error-page-02.wrapper.tsx · dashboard/chart-earning-report.wrapper.tsx · statistics/orders-progress-card.wrapper.tsx · statistics/sales-overview-card.wrapper.tsx · presentation-mcp-wrapper.registry.ts · studio-block-parity.registry.ts · presentation-mcp-wrapper.registry.test.ts · presentation-mcp-wrapper-b42m.test.ts · shadcn-studio-bridge.test.ts · slice doc · pas-status-index · PAS-005A §14 · b42l deferred
4. Prohibited   — foundation-disposition.registry.ts · replace auth-shell with MCP login/error blocks in ERP · copy MCP TSX into appshell · remove afenda-appshell-studio.css · break AppShellAuthLoginPage04 / AppShellAuthErrorPage02 public exports from auth-shell/index.ts
5. Authority    — PAS-005A · ADR-0017 · Governed UI consumer rules · B42i/B42k strangler registry · auth-shell promotion pipeline
6. Gates        —
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       — Six strangler wrapper files · registry + parity wrapperPath retarget · B42m test proving on-disk paths · bridge-index placeholder elimination · PAS-005A §14 B42m row · pas-status-index Delivered
8. Evidence     — presentation-mcp-wrapper-b42m.test.ts · presentation-mcp-wrapper.registry.test.ts (entryCount 40 · delegatingCount ÔëÑ 8) · shadcn-studio-bridge.test.ts · all gates pasted in Completion Report
9. Attestation  — Bridge-index placeholder closure · Auth afenda-only wiring · Marketing/chart/statistics delegating strangler · Gate evidence
```

## B42m scope

| Public export / registry key | MCP block | Bridge twin | Wrapper status | Rationale |
| --- | --- | --- | --- | --- |
| `AppShellPresentationHeroSection01` | `hero-section-01` | `AppShellPresentationHeroSection01` | delegating | Zero-prop MCP hero; Governed UI safe delegate |
| `AppShellAuthLoginPage04` | `login-page-04` | `AppShellPresentationLoginPage04` | afenda-only | ERP governed auth-shell; MCP twin for parity only |
| `AppShellAuthErrorPage02` | `error-page-02` | `AppShellPresentationAuthErrorPage02` | afenda-only | Same — AuthShellErrorSurface |
| `AppShellPresentationChartEarningReport` | `chart-component-02` | `AppShellPresentationChartEarningReport` | delegating | Prop-driven pass-through; no ERP governed shell required |
| `AppShellPresentationStatisticsOrdersProgressCard` | `statistics-component-09` | `AppShellPresentationStatisticsOrdersProgressCard` | delegating | Optional className only |
| `AppShellPresentationStatisticsSalesOverviewCard` | `statistics-component-06` | `AppShellPresentationStatisticsSalesOverviewCard` | delegating | Optional className only |
| `AppShellDashboardRevenueChart` | `chart-component-01` | `AppShellPresentationChartSalesMetrics` | governed-compose | Existing thin re-export via revenue-chart.wrapper.tsx — unchanged |

## DoD

- [x] Slice doc with 9-field handoff
- [x] Six new wrapper files under presentation/wrappers/
- [x] No bridge-index placeholder wrapperPaths in presentation-mcp-wrapper.registry.ts
- [x] studio-block-parity.registry.ts wrapperPath for hero, login, error-page-02, chart-component-02, statistics orders/sales
- [x] Auth public exports unchanged from auth-shell/index.ts
- [x] presentation-mcp-wrapper-b42m.test.ts + registry test updates
- [x] All gates run with evidence
