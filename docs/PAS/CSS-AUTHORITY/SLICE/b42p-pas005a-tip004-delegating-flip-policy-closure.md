# Slice B42p ÔÇö Governed UI Policy Closure + Delegating Flip Maintenance (PAS-005A ┬º14)

**Prerequisite:** B42o delivered ÔÇö zero parity wrapperPath gaps; 8 delegating + 21 governed-compose strangler entries stable

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Low ÔÇö policy registry + test expansion; no wrapper status flips (dashboard/shell blocked by tests)

**Clean Core impact:** AÔåÆA ÔÇö documents delegating-flip rationale; MCP lab className policy unchanged; strangler complete

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b42p-pas005a-tip004-delegating-flip-policy-closure.md

1. Objective    ÔÇö Create serializable delegating-flip policy registry; expand Governed UI MCP className policy tests for delegating bridge inventory; evaluate flip attempts (expect none); add appshell policy test; close PAS-005A strangler sequence in docs.
2. Allowed layerÔÇö packages/appshell/src/presentation/wrappers/presentation-mcp-delegating-flip-policy.registry.ts ┬À packages/appshell/src/__tests__/presentation-mcp-delegating-flip-policy.test.ts ┬À packages/shadcn-studio/src/__tests__/mcp-presentation-classname-policy.test.ts ┬À docs/PAS/CSS-AUTHORITY/SLICE/b42p-*.md ┬À docs/PAS/pas-status-index.md ┬À docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (┬º14 row)
3. Files        ÔÇö presentation-mcp-delegating-flip-policy.registry.ts ┬À presentation-mcp-delegating-flip-policy.test.ts ┬À mcp-presentation-classname-policy.test.ts ┬À slice doc ┬À pas-status-index ┬À PAS-005A ┬º14
4. Prohibited   ÔÇö foundation-disposition.registry.ts ┬À break dashboard/shell/account-settings tests ┬À mass MCP className removal (lab product policy allows stock shadcn)
5. Authority    ÔÇö PAS-005A ┬À Governed UI consumer rules ┬À ADR-0017 ┬À B42i/B42k strangler registry
6. Gates        ÔÇö
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm ui:guard:scan
   pnpm quality:boundaries
7. Closes       ÔÇö Delegating-flip policy registry (68 rows) ┬À flipBlockedBy on 21 governed-compose entries ┬À delegating className inventory test ┬À no new flips (test evidence) ┬À PAS-005A ┬º14 B42p row ┬À pas-status-index strangler complete
8. Evidence     ÔÇö presentation-mcp-delegating-flip-policy.test.ts ┬À mcp-presentation-classname-policy.test.ts (B42p describe) ┬À all gates pasted in Completion Report
9. Attestation  ÔÇö Policy registry JSON-serializable ┬À Zero new flips ┬À MCP lab className boundary preserved ┬À Gate evidence
```

## B42p scope

| Category | Count | B42p action |
| --- | ---: | --- |
| Delegating (main registry) | 8 | Policy rationale: 4 ├ù mcp-a11y-parity, 4 ├ù shell-chrome-governed (B42m thin bridge) |
| Governed-compose | 21 | flipBlockedBy cites blocking test files ÔÇö no flip attempted |
| Afenda-only (merged) | 39 | afenda-domain-shell rationale |
| New flips | 0 | Dashboard KPI/sparkline/revenue chart a11y tests block flip |

## Flip evaluation (post-B42p)

| Entry class | Flip attempted | Result | Evidence |
| --- | --- | --- | --- |
| StatisticsLineTrendsCard | No | Remains governed-compose | Prop-driven + app-shell-statistics-metric-cards.test.tsx |
| Dashboard widgets (KPI, sparkline, revenue chart) | No | Remains governed-compose | app-shell-dashboard-chart-a11y.test.tsx, app-shell-dashboard-kpi-stat.test.tsx |
| Shell chrome (menu trigger, dropdowns, search) | No | Remains governed-compose | ERP injection + dedicated shell tests |
| B42m thin delegating (hero, orders, sales, chart earning) | No reverse flip | Remains delegating | Zero-prop bridge safe; optional MCP article a11y deferred |

## DoD

- [x] Slice doc with 9-field handoff
- [x] `presentation-mcp-delegating-flip-policy.registry.ts` ÔÇö 68 merged rows
- [x] `presentation-mcp-delegating-flip-policy.test.ts` ÔÇö JSON, flipBlockedBy, delegatingCount sync
- [x] `mcp-presentation-classname-policy.test.ts` ÔÇö delegating bridge inventory (8) uses `@/components/ui`
- [x] No new delegating flips ÔÇö targetStatus === currentStatus for all rows
- [x] PAS-005A ┬º14 B42p row + pas-status-index strangler complete
- [x] All gates run with evidence
