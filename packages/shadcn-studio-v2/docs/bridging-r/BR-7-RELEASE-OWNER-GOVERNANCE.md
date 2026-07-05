# BR-7 Implementation Detail - Release-Owner Governance

## 1) Slice identity

- Slice ID: `BR-7`
- Slice name: `Release-owner governance`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists

- Define the explicit go/no-go checkpoint that authorizes `Phase R` execution.

### Slice-level acceptance criteria

- A release owner is recorded.
- The go/no-go checkpoint is recorded.
- Approval timing and proof location are recorded.
- Legacy deletion remains explicitly out of scope until post-cutover review.

## 3) Scope boundaries

### In scope

- release-owner record
- go/no-go checkpoint definition
- approval artifact location
- deletion scope protection

### Out of scope

- performing production deletion
- broad release management beyond first cutover authorization
- substituting engineering confidence for formal approval

### Anti-goals

- do not treat technical readiness as authorization by itself

## 4) Dependencies and sequence gates

- Predecessor slice: `BR-6`
- Dependencies on external teams, packages, or tasks:
  - `release owner`
  - `consumer owner`
  - `rollback owner`
- Required gates before merge:
  - named release owner
  - explicit go/no-go checkpoint
  - approval proof location

## 5) Implementation plan

### Current bridge status

| Dimension | Status | Evidence |
| --- | --- | --- |
| Documentation synchronization | `green` | governance slice is parent-linked, indexed, and test-covered |
| Execution readiness | `green` | release owner, checkpoint, and approval artifact are now recorded in repo docs |
| Remaining gap | `none - reviewed` | governance is complete for the bounded consumer surface |

### Governance method

1. Name the release owner of record.
2. Define the checkpoint at which `Phase R` may start.
3. Record the approval artifact location.
4. Confirm that rollback owner and validation owner are already recorded.
5. Restate that legacy deletion remains outside the `Bridging-R` scope.

### Current repo evidence

- `ADR-0039` records `Architecture Authority` as the owner of the route-lab ADR
- `docs/bridging-r/evidence/README.md` records the bounded release-owner
  approval artifact
- `BR-5` and `BR-6` now record the validation and rollback owners used by the
  approval

### Agent execution rule

- If approval exists only informally, keep this slice blocked.
- If no release owner is named, do not allow `Phase R` to start.

### Approval record

| Field | Current value |
| --- | --- |
| Release owner | `Architecture Authority` |
| Go / no-go checkpoint | `Bridging-R exit after BR-2 through BR-6 evidence is complete and consumer gates are green` |
| Approval artifact location | `docs/bridging-r/evidence/README.md` |
| Related validation owner | `@afenda/developer route-lab owner` |
| Related rollback owner | `@afenda/developer route-lab owner` |
| Governance status | `verified - bounded Phase R start is approved for @afenda/developer /dashboard/sales` |

### Recommended child steps

1. `BR-7A` record the release owner explicitly.
2. `BR-7B` define the go/no-go checkpoint as the exit of `Bridging-R`, not a
   package-local build event.
3. `BR-7C` bind the approval to one reviewable artifact.
4. `BR-7D` confirm legacy deletion remains out of scope.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | keep governance-language alignment and parent gate assertions passing | `src/__tests__/roadmap-doc-alignment.test.ts`; `src/__tests__/legacy-retirement.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | package-local integrity | `tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | package build proof | `dist/` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | formatting and lint proof | package root |

## 7) Evidence log

- Parent readiness gate: `docs/BRIDGING-R-PHASE-R-READINESS.md`
- Retirement boundary: `docs/LEGACY-RETIREMENT-PLAN.md`
- Cutover execution guide: `docs/PHASE-R-CONSUMER-CUTOVER-GUIDE.md`

## 8) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| technical team assumes implicit approval is enough | Medium / High | require explicit release-owner record and checkpoint | Release owner | Active |
| governance scope drifts into deletion planning too early | Medium / High | restate deletion out of scope in every approval doc | V2 migration squad | Active |

## 9) Open questions / assumptions

- Assumption: release-owner approval will be stored in a reviewable artifact
  linked from the bridge docs.
- Decision needed: whether the approval artifact should live in the parent
  bridge document, a handoff note, or another repo-local review record.

## 10) Exit checklist

- [x] Release owner is named.
- [x] Go/no-go checkpoint is defined.
- [x] Approval proof location is recorded.
- [x] Legacy deletion is still explicitly out of scope.

## 11) Handoff summary

- Completion recommendation: `go` only when `Bridging-R` can point to explicit
  release authorization inputs.
- If `no-go`, blocker is missing owner or missing approval record.
- Next slice dependency to start: `Phase R`
