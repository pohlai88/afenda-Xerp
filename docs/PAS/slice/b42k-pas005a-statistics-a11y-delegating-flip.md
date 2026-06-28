# Slice B42k — Statistics MCP A11y Parity + Delegating Flip (PAS-005A §14)

**Prerequisite:** B42j delivered — wrapper expansion; statistics cards blocked on a11y article/footnote contract

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — flips four zero-prop statistics wrappers from governed-compose to delegating after MCP a11y parity

**Clean Core impact:** A→A — MCP blocks gain semantic article/footnote structure; appshell delegates to bridge without duplicate governed TSX

## Handoff block

```
Handoff from: docs/PAS/slice/b42k-pas005a-statistics-a11y-delegating-flip.md

1. Objective    — Add article/footnote a11y to MCP statistics blocks; flip StatisticsRevenueCard, StatisticsActivityCard, StatisticsLeadsCard, StatisticsProfileTrafficCard wrappers to delegating; refactor appshell a11y test to aria-based lookup.
2. Allowed layer— packages/shadcn-studio/src/components/shadcn-studio/blocks/statistics-*.tsx · packages/shadcn-studio/src/__tests__/** · packages/appshell/src/presentation/wrappers/statistics-*-card.wrapper.tsx · packages/appshell/src/presentation/wrappers/create-presentation-mcp-wrapper.tsx · packages/appshell/src/presentation/wrappers/presentation-mcp-wrapper.registry.ts · packages/appshell/src/__tests__/app-shell-statistics-metric-cards.test.tsx · packages/appshell/src/__tests__/presentation-mcp-wrapper.registry.test.ts · docs/PAS/slice/b42k-*.md · docs/PAS/pas-status-index.md · docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (§14 row) · docs/PAS/slice/b42j-pas005a-wrapper-expansion-delegating-flip.md (deferred section)
3. Files        — statistics-revenue-card.tsx · statistics-activity-card.tsx · statistics-leads-card.tsx · statistics-profile-traffic-card.tsx · statistics-metric-a11y.contract.test.ts · four statistics wrappers · create-presentation-mcp-wrapper.tsx · presentation-mcp-wrapper.registry.ts · app-shell-statistics-metric-cards.test.tsx · presentation-mcp-wrapper.registry.test.ts · slice doc · pas-status-index · PAS-005A §14 · b42j deferred
4. Prohibited   — foundation-disposition.registry.ts · break @afenda/appshell public exports · StatisticsLineTrendsCard delegating flip · remove afenda-appshell-studio.css · copy MCP TSX into appshell · replace account-settings implementations
5. Authority    — PAS-005A · ADR-0017 · WCAG article/footnote pattern · B42i/B42j wrapper strangler
6. Gates        —
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       — MCP article aria-labelledby · amount aria-describedby ↔ change id · delegating flip for four statistics cards · aria-based appshell test · shadcn-studio a11y contract test · factory delegating-only support
8. Evidence     — statistics-metric-a11y.contract.test.ts · app-shell-statistics-metric-cards.test.tsx · presentation-mcp-wrapper.registry.test.ts (delegatingCount ≥ 4) · ui:guard:scan
9. Attestation  — MCP a11y parity · Delegating flip · Test refactor · Gate evidence
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
