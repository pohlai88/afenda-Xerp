# Slice B42p — TIP-004 Policy Closure + Delegating Flip Maintenance (PAS-005A §14)

**Prerequisite:** B42o delivered — zero parity wrapperPath gaps; 8 delegating + 21 governed-compose strangler entries stable

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Low — policy registry + test expansion; no wrapper status flips (dashboard/shell blocked by tests)

**Clean Core impact:** A→A — documents delegating-flip rationale; MCP lab className policy unchanged; strangler complete

## Handoff block

```
Handoff from: docs/PAS/slice/b42p-pas005a-tip004-delegating-flip-policy-closure.md

1. Objective    — Create serializable delegating-flip policy registry; expand TIP-004 MCP className policy tests for delegating bridge inventory; evaluate flip attempts (expect none); add appshell policy test; close PAS-005A strangler sequence in docs.
2. Allowed layer— packages/appshell/src/presentation/wrappers/presentation-mcp-delegating-flip-policy.registry.ts · packages/appshell/src/__tests__/presentation-mcp-delegating-flip-policy.test.ts · packages/shadcn-studio/src/__tests__/mcp-presentation-classname-policy.test.ts · docs/PAS/slice/b42p-*.md · docs/PAS/pas-status-index.md · docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (§14 row)
3. Files        — presentation-mcp-delegating-flip-policy.registry.ts · presentation-mcp-delegating-flip-policy.test.ts · mcp-presentation-classname-policy.test.ts · slice doc · pas-status-index · PAS-005A §14
4. Prohibited   — foundation-disposition.registry.ts · break dashboard/shell/account-settings tests · mass MCP className removal (lab product policy allows stock shadcn)
5. Authority    — PAS-005A · TIP-004 consumer rules · ADR-0017 · B42i/B42k strangler registry
6. Gates        —
   pnpm --filter @afenda/shadcn-studio build
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell test:run
   pnpm ui:guard:scan
   pnpm quality:boundaries
7. Closes       — Delegating-flip policy registry (68 rows) · flipBlockedBy on 21 governed-compose entries · delegating className inventory test · no new flips (test evidence) · PAS-005A §14 B42p row · pas-status-index strangler complete
8. Evidence     — presentation-mcp-delegating-flip-policy.test.ts · mcp-presentation-classname-policy.test.ts (B42p describe) · all gates pasted in Completion Report
9. Attestation  — Policy registry JSON-serializable · Zero new flips · MCP lab className boundary preserved · Gate evidence
```

## B42p scope

| Category | Count | B42p action |
| --- | ---: | --- |
| Delegating (main registry) | 8 | Policy rationale: 4 × mcp-a11y-parity, 4 × shell-chrome-governed (B42m thin bridge) |
| Governed-compose | 21 | flipBlockedBy cites blocking test files — no flip attempted |
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
- [x] `presentation-mcp-delegating-flip-policy.registry.ts` — 68 merged rows
- [x] `presentation-mcp-delegating-flip-policy.test.ts` — JSON, flipBlockedBy, delegatingCount sync
- [x] `mcp-presentation-classname-policy.test.ts` — delegating bridge inventory (8) uses `@/components/ui`
- [x] No new delegating flips — targetStatus === currentStatus for all rows
- [x] PAS-005A §14 B42p row + pas-status-index strangler complete
- [x] All gates run with evidence
