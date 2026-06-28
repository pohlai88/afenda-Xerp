# Slice B42j — Wrapper Expansion + Delegating Flip (PAS-005A §14)

**Prerequisite:** B42i delivered — Phase 1 statistics/shell/dashboard wrapper infrastructure

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — expands strangler registry; delegating flip only where a11y/tests permit

**Clean Core impact:** A→A — shell chrome and dashboard wrappers stay governed-compose for ERP injection; MCP lab blocks retain stock shadcn className

## Handoff block

```
Handoff from: docs/PAS/slice/b42j-pas005a-wrapper-expansion-delegating-flip.md

1. Objective    — Expand presentation/wrappers for shell chrome + remaining bridge-backed dashboard blocks; register account-settings MCP twin mapping without replacing domain shells; document MCP className policy in shadcn-studio tests; flip to delegating only where bridge + tests + ui:guard permit.
2. Allowed layer— packages/appshell/src/presentation/** · packages/appshell/src/shadcn-studio-bridge/** · packages/appshell/src/app-shell-header.tsx · packages/appshell/src/__tests__/** · packages/shadcn-studio/src/index.ts · packages/shadcn-studio/src/registry/** · packages/shadcn-studio/src/__tests__/** · docs/PAS/slice/b42j-*.md · docs/PAS/pas-status-index.md · docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (§14 row) · docs/PAS/slice/b42i-pas005a-mcp-wrapper-strangler.md (deferred section)
3. Files        — presentation/wrappers/** (shell chrome + dashboard) · presentation/blocks thin re-exports · presentation-mcp-wrapper.registry.ts · shadcn-studio-bridge/index.ts · shadcn-studio index.ts (shell bridge exports) · studio-block-parity.registry.ts · mcp-presentation-classname-policy.test.ts · slice doc · pas-status-index · PAS-005A §14 · b42i deferred
4. Prohibited   — foundation-disposition.registry.ts · break @afenda/appshell public exports · remove afenda-appshell-studio.css · copy MCP TSX into appshell · replace AppShellAccountSettings01-07 implementations
5. Authority    — PAS-005A · ADR-0017 · TIP-004 consumer rules (appshell only) · B42 parity registry
6. Gates        —
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm quality:boundaries
   pnpm ui:guard:scan
7. Closes       — Shell chrome wrappers · dashboard KPI/sparkline/readiness wrappers · account-settings registry mapping · MCP className policy test · delegating flip evidence · parity wrapperPath · B42j slice doc
8. Evidence     — presentation-mcp-wrapper.registry.test.ts · appshell tests · mcp-presentation-classname-policy.test.ts · ui:guard:scan · delegating flip test run
9. Attestation  — Wrapper expansion · TIP-004 MCP lab policy · Delegating flip criteria · Gate evidence
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
| `AppShellAccountSettings01`–`07` | `account-settings-0N` | `AppShellPresentationAccountSettings0N` | afenda-only | Domain injection shells — mapping only |
| `StatisticsRevenueCard` et al. | various | bridge twins | governed-compose | a11y article/footnote tests block delegating |

## Delegating flip criteria

Flip `governed-compose` → `delegating` only when ALL hold:

- Bridge export resolves in `shadcn-studio-bridge`
- Appshell tests pass after flip
- `pnpm ui:guard:scan` clean

**B42j outcome:** Statistics cards retain `governed-compose` — a11y article/footnote contract tests fail on raw MCP delegate.

## Deferred (post-B42j — closed in B42k/B42l)

- ~~Full delegating flip for statistics cards after MCP a11y parity~~ — closed in B42k
- ~~`afenda-appshell-studio.css` consolidation~~ — closed in B42l
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
