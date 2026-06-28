# Slice B42k ÔÇö Statistics MCP A11y Parity + Delegating Flip (PAS-005A ┬º14)

**Prerequisite:** B42j delivered ÔÇö wrapper expansion; statistics cards blocked on a11y article/footnote contract

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö flips four zero-prop statistics wrappers from governed-compose to delegating after MCP a11y parity

**Clean Core impact:** AÔåÆA ÔÇö MCP blocks gain semantic article/footnote structure; appshell delegates to bridge without duplicate governed TSX

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42k-pas005a-statistics-a11y-delegating-flip.md

1. Objective    ÔÇö Add article/footnote a11y to MCP statistics blocks; flip StatisticsRevenueCard, StatisticsActivityCard, StatisticsLeadsCard, StatisticsProfileTrafficCard wrappers to delegating; refactor appshell a11y test to aria-based lookup.
2. Allowed layerÔÇö packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-*.tsx ┬À packages/shadcn-studio/src/__tests__/** ┬À packages/appshell/src/presentation/wrappers/statistics-*-card.wrapper.tsx ┬À packages/appshell/src/presentation/wrappers/create-presentation-mcp-wrapper.tsx ┬À packages/appshell/src/presentation/wrappers/presentation-mcp-wrapper.registry.ts ┬À packages/appshell/src/__tests__/app-shell-statistics-metric-cards.test.tsx ┬À packages/appshell/src/__tests__/presentation-mcp-wrapper.registry.test.ts ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42k-*.md ┬À docs/PAS/pas-status-index.md ┬À docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (┬º14 row) ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42j-pas005a-wrapper-expansion-delegating-flip.md (deferred section)
3. Files        ÔÇö statistics-revenue-card.tsx ┬À statistics-activity-card.tsx ┬À statistics-leads-card.tsx ┬À statistics-profile-traffic-card.tsx ┬À statistics-metric-a11y.contract.test.ts ┬À four statistics wrappers ┬À create-presentation-mcp-wrapper.tsx ┬À presentation-mcp-wrapper.registry.ts ┬À app-shell-statistics-metric-cards.test.tsx ┬À presentation-mcp-wrapper.registry.test.ts ┬À slice doc ┬À pas-status-index ┬À PAS-005A ┬º14 ┬À b42j deferred
4. Prohibited   ÔÇö foundation-disposition.registry.ts ┬À break @afenda/appshell public exports ┬À StatisticsLineTrendsCard delegating flip ┬À remove afenda-appshell-studio.css ┬À copy MCP TSX into appshell ┬À replace account-settings implementations
5. Authority    ÔÇö PAS-005A ┬À ADR-0017 ┬À WCAG article/footnote pattern ┬À B42i/B42j wrapper strangler
6. Gates        ÔÇö
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       ÔÇö MCP article aria-labelledby ┬À amount aria-describedby Ôåö change id ┬À delegating flip for four statistics cards ┬À aria-based appshell test ┬À shadcn-studio a11y contract test ┬À factory delegating-only support
8. Evidence     ÔÇö statistics-metric-a11y.contract.test.ts ┬À app-shell-statistics-metric-cards.test.tsx ┬À presentation-mcp-wrapper.registry.test.ts (delegatingCount ÔëÑ 4) ┬À ui:guard:scan
9. Attestation  ÔÇö MCP a11y parity ┬À Delegating flip ┬À Test refactor ┬À Gate evidence
```

## B42k scope

| Public export | MCP block | Bridge twin | Post-B42k status |
| --- | --- | --- | --- |
| `StatisticsRevenueCard` | `statistics-component-01` / `statistics-revenue-card` | `AppShellPresentationStatisticsRevenueCard` | delegating |
| `StatisticsActivityCard` | `statistics-component-10` | `AppShellPresentationStatisticsActivityCard` | delegating |
| `StatisticsLeadsCard` | `statistics-component-10` | `AppShellPresentationStatisticsLeadsCard` | delegating |
| `StatisticsProfileTrafficCard` | `statistics-component-10` | `AppShellPresentationStatisticsProfileTrafficCard` | delegating |
| `StatisticsLineTrendsCard` | `statistics-component-21` | `AppShellPresentationStatisticsLineTrendsCard` | governed-compose (prop-driven) |

## Copy alignment (article accessible name + footnote text)

| Card | Title (sentence case) | Amount | Change footnote |
| --- | --- | --- | --- |
| Revenue | Revenue growth | $3,234 | +15% |
| Activity | Activity | 82% | +38% |
| Leads | Generated leads | 4,350 | +18.2% |
| Profile traffic | Average profile traffic | 2.84k | +15% |

## DoD

- [x] Slice doc with 9-field handoff
- [x] MCP blocks: `<article aria-labelledby>` + `aria-describedby` / footnote `id`
- [x] `statistics-metric-a11y.contract.test.ts` in shadcn-studio
- [x] Appshell test uses aria-describedby (not CSS value-stack)
- [x] Four wrappers flipped to delegating; factory supports delegating-only
- [x] StatisticsLineTrendsCard remains governed-compose
- [x] All gates run with evidence
