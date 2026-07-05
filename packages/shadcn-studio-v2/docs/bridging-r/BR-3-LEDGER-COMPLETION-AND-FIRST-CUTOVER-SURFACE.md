# BR-3 Implementation Detail - Ledger Completion and First-Cutover Surface

## 1) Slice identity

- Slice ID: `BR-3`
- Slice name: `Ledger completion and first-cutover surface`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists

- Expand the migration ledger from a single `Button` row into the actual public
  surface required for the first real consumer.

### Slice-level acceptance criteria

- The first-cutover surface is named and bounded.
- Every public surface used by that consumer has a ledger row.
- Each row has status, export intent, dependencies, proof targets, and rollback
  notes.

## 3) Scope boundaries

### In scope

- ledger expansion for the first chosen consumer surface
- row completion for primitives, layout/shared parts, views, metadata, and CSS
  touchpoints used by that surface
- status normalization for those rows

### Out of scope

- broad ledger population for every future consumer
- actual code migration in external consumers
- legacy deletion

### Anti-goals

- do not add speculative rows unrelated to the first consumer just to inflate
  coverage

## 4) Dependencies and sequence gates

- Predecessor slice: `BR-2`
- Dependencies on external teams, packages, or tasks:
  - `BR-5 real consumer selection`
- Required gates before merge:
  - named consumer surface
  - complete row coverage for that surface
  - status and evidence fields aligned with authority chain

## 5) Implementation plan

### Current bridge status

| Dimension | Status | Evidence |
| --- | --- | --- |
| Documentation synchronization | `green` | bridge index and parent guide point to this slice |
| Execution readiness | `green` | the first real-consumer surface is bounded, recorded, and represented in the ledger |
| Remaining gap | `none - reviewed` | first-cutover surface coverage is complete for the bounded consumer |

### Architecture/structure changes

- `docs/MIGRATION-MAP.md` -> expand component ledger rows
- `docs/BRIDGING-R-PHASE-R-READINESS.md` -> keep first-cutover ledger backlog
  visible

### Current repo evidence

- Candidate consumer route:
  `apps/developer/src/app/(lab)/dashboard/sales/page.tsx`
- Candidate route-local imports:
  - `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
  - `StatisticsRevenueCardBlock`
  - `StatisticsSalesOverviewCardBlock`
- Candidate app-level imports:
  - `ErpPresentationProviders` from `@afenda/shadcn-studio/theme`
  - `AppShellNavGroupWire` from `@afenda/shadcn-studio`
  - `@afenda/shadcn-studio/shadcn-default.css`

### Row-completion method

For each imported or configured surface in the chosen consumer:

1. record the V1 path
2. record the V2 destination
3. classify the surface
4. set export intent
5. capture CSS, runtime, metadata, and accessibility dependencies
6. assign proof targets
7. record rollback notes
8. set the current status without skipping authority stages

### Coverage rule

The ledger must include all of the following if they are part of the chosen
surface:

- directly imported primitives
- layout and shared components
- composed views
- metadata helpers or contracts
- theme/CSS loading surfaces
- package entrypoints used by the consumer

### Execution worksheet

| Consumer surface item | Required V2 touchpoint | Ledger row present | Status target | Gap status |
| --- | --- | --- | --- | --- |
| `Card` primitive family | `components/ui/Card.tsx` + root export | `yes` | `pilot-proven` | `ready for evidence review` |
| `StatisticsRevenueCardBlock` | `views/widgets/StatisticsRevenueCardBlock.tsx` + root export | `yes` | `enterprise-accepted` | `verified` |
| `StatisticsSalesOverviewCardBlock` | `views/widgets/StatisticsSalesOverviewCardBlock.tsx` + root export | `yes` | `enterprise-accepted` | `verified` |
| `ErpPresentationProviders` | `./theme` export | `yes` | `enterprise-accepted` | `verified` |
| `AppShellNavGroupWire` | public type export | `yes` | `enterprise-accepted` | `verified` |
| `shadcn-default.css` | public CSS export | `yes` | `enterprise-accepted` | `verified` |

### Recommended child steps

1. `BR-3A` inventory route-level imports from the candidate consumer.
2. `BR-3B` inventory app-level setup touchpoints that the route depends on.
3. `BR-3C` create or update one ledger row per touchpoint.
4. `BR-3D` freeze the first-cutover scope so later bridge work does not widen
   silently.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | verify ledger-related tests and migration-doc assertions | `src/__tests__/legacy-retirement.test.ts`; `src/__tests__/roadmap-doc-alignment.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | ensure no support-code regressions | `tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | maintain package declaration integrity | `dist/` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | lint and format verification | package root |

## 7) Evidence log

- Ledger authority: `docs/MIGRATION-MAP.md`
- Parent readiness gate: `docs/BRIDGING-R-PHASE-R-READINESS.md`
- Package-local pilot reference: `src/storybook/fixtures/consumer-pilot.tsx`

## 8) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| first consumer uses more surfaces than the ledger records | High / High | derive rows from actual imports and setup points | V2 migration squad | Active |
| ledger statuses drift from evidence reality | Medium / High | require proof field review before status changes | V2 migration squad | Active |

## 9) Open questions / assumptions

- Assumption: the first-cutover ledger should remain intentionally narrow and
  stay centered on one bounded route.
- Decision needed: whether route-level shell contracts should appear as
  component rows or as a separate contract ledger subsection.

## 10) Exit checklist

- [x] First real consumer surface is identified.
- [x] Ledger coverage matches every V2 touchpoint for that surface.
- [x] Status fields do not skip authority stages.
- [x] Rollback notes exist for each in-scope row.

## 11) Handoff summary

- Completion recommendation: `go` only when the ledger is complete enough to
  support cutover validation planning.
- If `no-go`, blocker is incomplete or inaccurate surface coverage.
- Next slice dependency to start: `BR-4`
