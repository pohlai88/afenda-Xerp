# Slice B42i ÔÇö MCP Wrapper Strangler (PAS-005A ┬º14)

**Prerequisite:** B42h delivered ÔÇö legacy `shadcn-studio/` tree deleted; governed blocks under `presentation/`

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium ÔÇö public API preserved; internal presentation paths retargeted through wrapper registry

**Clean Core impact:** AÔåÆA ÔÇö strangler wrappers delegate to MCP bridge where Governed UI safe; governed-compose retained for ERP injection slots and a11y contracts

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42i-pas005a-mcp-wrapper-strangler.md

1. Objective    ÔÇö Introduce thin governed MCP wrapper infrastructure under presentation/wrappers/; refactor Phase 1 statistics cards, shell chrome, and dashboard widget paths to wrappers; update parity registry wrapperPath; preserve @afenda/appshell public exports and Governed UI consumer rules.
2. Allowed layerÔÇö packages/appshell/src/presentation/** ┬À packages/appshell/src/shadcn-studio-bridge/** ┬À packages/appshell/src/index.ts (re-export paths only) ┬À packages/appshell/src/__tests__/** ┬À packages/shadcn-studio/src/registry/** (parity status/wrapperPath only) ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42i-*.md ┬À docs/PAS/pas-status-index.md ┬À docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (┬º14 row only)
3. Files        ÔÇö presentation/wrappers/** ┬À Phase 1 block thin re-exports ┬À dashboard-widget-registry.tsx ┬À dashboard-metric-widget-definitions.tsx ┬À presentation-mcp-wrapper.registry.test.ts ┬À studio-block-parity.registry.ts (wrapperPath) ┬À slice doc ┬À pas-status-index ┬À PAS-005A ┬º14
4. Prohibited   ÔÇö foundation-disposition.registry.ts ┬À copy MCP TSX into appshell ┬À remove Governed UI governance ┬À break public exports ┬À metadata-ui contract expansion ┬À afenda-appshell-studio.css delete
5. Authority    ÔÇö PAS-005A ┬À ADR-0017 ┬À Governed UI consumer rules ┬À B42 parity registry
6. Gates        ÔÇö
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       ÔÇö Wrapper registry + create helper ┬À Phase 1 statistics/shell/dashboard wrappers ┬À parity registry wrapperPath ┬À B42i slice doc ┬À pas-status-index Delivered
8. Evidence     ÔÇö presentation-mcp-wrapper.registry.test.ts ┬À appshell 68+ tests ┬À ui:guard:scan ┬À parity registry JSON-serializable
9. Attestation  ÔÇö Wrapper infrastructure ┬À Phase 1 strangler ┬À Backward compatibility ┬À Gate evidence
```

## Phase 1 wrapper scope

| Public export | Bridge twin | Wrapper status | Rationale |
| --- | --- | --- | --- |
| `StatisticsRevenueCard` | `AppShellPresentationStatisticsRevenueCard` | governed-compose | Governed UI a11y article/footnote contract |
| `StatisticsActivityCard` | `AppShellPresentationStatisticsActivityCard` | governed-compose | Same |
| `StatisticsLeadsCard` | `AppShellPresentationStatisticsLeadsCard` | governed-compose | Same |
| `StatisticsProfileTrafficCard` | `AppShellPresentationStatisticsProfileTrafficCard` | governed-compose | Same |
| `StatisticsLineTrendsCard` | `AppShellPresentationStatisticsLineTrendsCard` | governed-compose | Prop-driven series a11y |
| `AppShellMenuTrigger` | `AppShellPresentationMenuTrigger` | governed-compose | Governed UI data-sidebar/aria-expanded |
| `AppShellSidebarUserDropdown` | `AppShellPresentationSidebarUserDropdown` | governed-compose | Domain props + governed dropdown |
| Dashboard metric/widget paths | Various `AppShellPresentation*` | governed-compose | ERP injection slots preserved |

## Deferred (post-B42i ÔÇö closed in B42j)

- ~~Foundation phase 04 className strip on MCP blocks (enables pure `delegating` status)~~ ÔÇö MCP lab policy test added in B42j; appshell consumer rules unchanged
- Full strangler of remaining ~58 blocks ÔåÆ B42j expanded shell chrome + dashboard KPI/sparkline/readiness
- `PKGR05A` green-lane promotion via foundation-registry-owner
- ~~`afenda-appshell-studio.css` consolidation~~ ÔÇö closed in B42l
- ~~Delegating flip for statistics cards ÔÇö blocked by a11y article/footnote tests (see B42j)~~ ÔÇö closed in B42k

## DoD

- [x] Slice doc with 9-field handoff
- [x] `presentation-mcp-wrapper.registry.ts` JSON-serializable
- [x] Phase 1 statistics + shell chrome wrappers
- [x] Dashboard widget registry wired through wrappers
- [x] Parity registry `wrapperPath` for Phase 1 entries
- [x] All appshell tests pass
- [x] Gates run with evidence
