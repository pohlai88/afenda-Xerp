# BR-5 Implementation Detail - Real Consumer Selection

## 1) Slice identity

- Slice ID: `BR-5`
- Slice name: `Real consumer selection`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists

- `Phase R` cannot start without one named real consumer and explicit ownership.

### Slice-level acceptance criteria

- One target consumer is recorded by name.
- One route, page, or bounded surface is recorded.
- Rollback owner and validation owner are recorded.
- The selected consumer is narrow enough for a first cutover.

## 3) Scope boundaries

### In scope

- choosing one consumer target
- recording consumer ownership and validation roles
- defining the first-cut surface boundary

### Out of scope

- migrating multiple consumers
- expanding into enterprise-wide rollout
- performing the actual cutover

### Anti-goals

- do not use a package-local fixture as the real consumer substitute

## 4) Dependencies and sequence gates

- Predecessor slice: `BR-4`
- Dependencies on external teams, packages, or tasks:
  - `consumer owner`
  - `release owner`
- Required gates before merge:
  - target consumer named
  - route or surface named
  - rollback and validation owners named

## 5) Implementation plan

### Current bridge status

| Dimension | Status | Evidence |
| --- | --- | --- |
| Documentation synchronization | `green` | selection method is indexed and parent-linked |
| Execution readiness | `green` | consumer, route, validation owner, and rollback owner are now recorded in repo docs |
| Remaining gap | `none - reviewed` | selection is complete for the bounded first-cutover surface |

### Architecture/structure changes

- `docs/BRIDGING-R-PHASE-R-READINESS.md` -> record selection requirements
- `docs/MIGRATION-MAP.md` -> align ledger rows to the chosen consumer
- optional consumer-selection note in `docs/handoffs/` if the team wants a
  dated decision artifact

### Current repo evidence

- `docs/BLUEPRINT/shadcn-studio-presentation-blueprint.md` identifies three
  real consumers: `apps/storybook`, `apps/developer`, and `apps/erp`
- `ADR-0039` and the developer sandbox blueprint identify `apps/developer` as a
  route-lab app that already consumes the current studio contract
- `apps/developer/src/app/(lab)/dashboard/sales/page.tsx` is the strongest
  bounded first-cutover surface now visible in repo evidence

### Selection method

1. Enumerate candidate consumers that use the smallest meaningful V2 surface.
2. Reject candidates that require broad cross-app refactors.
3. Choose one bounded route or page.
4. Record:
   - consumer name
   - owner of record
   - route/surface
   - validation owner
   - rollback owner
5. Feed the chosen surface into `BR-3`, `BR-4`, and `BR-6`.

### Selection record

| Field | Current value |
| --- | --- |
| Target consumer | `@afenda/developer` |
| Owner of record | `@afenda/developer route-lab owner` |
| Route / bounded surface | `/dashboard/sales` |
| Validation owner | `@afenda/developer route-lab owner` |
| Rollback owner | `@afenda/developer route-lab owner` |
| Selection status | `verified - bounded real-consumer surface selected and recorded` |

### Recommended child steps

1. `BR-5A` compare `apps/developer` and `apps/erp` for first-cutover blast
   radius.
2. `BR-5B` freeze one bounded route, not a whole app.
3. `BR-5C` record owner, validation owner, and rollback owner without
   inventing names.
4. `BR-5D` publish the selection into the ledger and bridge parent.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | confirm doc/test alignment after selection recording | `src/__tests__/roadmap-doc-alignment.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | package-local integrity | `tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | package build proof | `dist/` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | formatting and lint proof | package root |

## 7) Evidence log

- Parent readiness gate: `docs/BRIDGING-R-PHASE-R-READINESS.md`
- Phase R execution guide: `docs/PHASE-R-CONSUMER-CUTOVER-GUIDE.md`
- Migration ledger: `docs/MIGRATION-MAP.md`

## 8) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| selected consumer is too broad for first cutover | Medium / High | enforce one bounded surface rule | V2 migration squad | Active |
| ownership is unclear between teams | Medium / High | require named owner, validator, and rollback owner | Release owner | Active |

## 9) Open questions / assumptions

- Assumption: `@afenda/developer` remains the lowest-blast-radius real consumer
  that still proves real package consumption.
- Decision needed: whether repo governance docs can provide an explicit owner of
  record, or whether that record must be added as a new artifact.

## 10) Exit checklist

- [x] One target consumer is recorded.
- [x] One route or surface is recorded.
- [x] Validation owner is recorded.
- [x] Rollback owner is recorded.
- [x] Selection is narrow enough for first cutover.

## 11) Handoff summary

- Completion recommendation: `go` only when one real consumer is unambiguously
  named.
- If `no-go`, blocker is missing or overly broad consumer selection.
- Next slice dependency to start: `BR-6`
