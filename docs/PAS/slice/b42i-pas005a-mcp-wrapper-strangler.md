# Slice B42i — MCP Wrapper Strangler (PAS-005A §14)

**Prerequisite:** B42h delivered — legacy `shadcn-studio/` tree deleted; governed blocks under `presentation/`

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — public API preserved; internal presentation paths retargeted through wrapper registry

**Clean Core impact:** A→A — strangler wrappers delegate to MCP bridge where Governed UI safe; governed-compose retained for ERP injection slots and a11y contracts

## Handoff block

```
Handoff from: docs/PAS/slice/b42i-pas005a-mcp-wrapper-strangler.md

1. Objective    — Introduce thin governed MCP wrapper infrastructure under presentation/wrappers/; refactor Phase 1 statistics cards, shell chrome, and dashboard widget paths to wrappers; update parity registry wrapperPath; preserve @afenda/appshell public exports and Governed UI consumer rules.
2. Allowed layer— packages/appshell/src/presentation/** · packages/appshell/src/shadcn-studio-bridge/** · packages/appshell/src/index.ts (re-export paths only) · packages/appshell/src/__tests__/** · packages/shadcn-studio/src/registry/** (parity status/wrapperPath only) · docs/PAS/slice/b42i-*.md · docs/PAS/pas-status-index.md · docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (§14 row only)
3. Files        — presentation/wrappers/** · Phase 1 block thin re-exports · dashboard-widget-registry.tsx · dashboard-metric-widget-definitions.tsx · presentation-mcp-wrapper.registry.test.ts · studio-block-parity.registry.ts (wrapperPath) · slice doc · pas-status-index · PAS-005A §14
4. Prohibited   — foundation-disposition.registry.ts · copy MCP TSX into appshell · remove Governed UI governance · break public exports · metadata-ui contract expansion · afenda-appshell-studio.css delete
5. Authority    — PAS-005A · ADR-0017 · Governed UI consumer rules · B42 parity registry
6. Gates        —
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       — Wrapper registry + create helper · Phase 1 statistics/shell/dashboard wrappers · parity registry wrapperPath · B42i slice doc · pas-status-index Delivered
8. Evidence     — presentation-mcp-wrapper.registry.test.ts · appshell 68+ tests · ui:guard:scan · parity registry JSON-serializable
9. Attestation  — Wrapper infrastructure · Phase 1 strangler · Backward compatibility · Gate evidence
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

## Deferred (post-B42i — closed in B42j)

- ~~Foundation phase 04 className strip on MCP blocks (enables pure `delegating` status)~~ — MCP lab policy test added in B42j; appshell consumer rules unchanged
- Full strangler of remaining ~58 blocks → B42j expanded shell chrome + dashboard KPI/sparkline/readiness
- `PKGR05A` green-lane promotion via foundation-registry-owner
- ~~`afenda-appshell-studio.css` consolidation~~ — closed in B42l
- ~~Delegating flip for statistics cards — blocked by a11y article/footnote tests (see B42j)~~ — closed in B42k

## DoD

- [x] Slice doc with 9-field handoff
- [x] `presentation-mcp-wrapper.registry.ts` JSON-serializable
- [x] Phase 1 statistics + shell chrome wrappers
- [x] Dashboard widget registry wired through wrappers
- [x] Parity registry `wrapperPath` for Phase 1 entries
- [x] All appshell tests pass
- [x] Gates run with evidence
