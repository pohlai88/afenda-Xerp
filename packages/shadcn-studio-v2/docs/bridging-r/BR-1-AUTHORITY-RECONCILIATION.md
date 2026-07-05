# BR-1 Implementation Detail - Authority Reconciliation

## 1) Slice identity

- Slice ID: `BR-1`
- Slice name: `Authority reconciliation`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists

- Normalize the status authority chain before any real cutover planning starts.
- Remove contradictory wording that allows `retirement-candidate` before
  `enterprise-accepted`.

### Slice-level acceptance criteria

- `COMPONENT-PRE-MIGRATION.md`, `MIGRATION-MAP.md`, `ROADMAP.md`,
  `PHASE-R-CONSUMER-CUTOVER-GUIDE.md`, and `LEGACY-RETIREMENT-PLAN.md` all use
  the same status rule.
- No migration doc implies that `pilot-proven` alone is sufficient for
  `retirement-candidate`.
- The authoritative chain reads: `migrated` -> `pilot-proven` ->
  `enterprise-accepted` -> `retirement-candidate`.

## 3) Scope boundaries

### In scope

- status-language normalization in package-local docs
- doc-alignment tests that enforce the rule
- migration-map row correction where status wording conflicts with authority

### Out of scope

- real consumer cutover execution
- ERP or legacy package source mutation
- release-owner approval collection

### Anti-goals

- do not upgrade a component or lane to `enterprise-accepted` in this slice
- do not create placeholder approvals to satisfy wording alignment

## 4) Dependencies and sequence gates

- Predecessor slice: `Bridging-R parent gate creation`
- Dependencies on external teams, packages, or tasks:
  - `none - package-local documentation slice`
- Required gates before merge:
  - authority wording proof across the canonical docs
  - package-local doc-alignment tests

## 5) Implementation plan

### Current bridge status

| Dimension | Status | Evidence |
| --- | --- | --- |
| Documentation synchronization | `green` | parent/index links and alignment tests are in place |
| Execution readiness | `green` | authority wording is normalized and enforced across package-local docs/tests |
| Remaining gap | `none - reviewed` | `BR-1` is complete inside package-local scope |

### Architecture/structure changes

- `docs/BRIDGING-R-PHASE-R-READINESS.md` -> keep parent rule explicit
- `docs/MIGRATION-MAP.md` -> normalize status language and lane state
- `docs/ROADMAP.md` -> position `Bridging-R` before `Phase R`
- `docs/PHASE-R-CONSUMER-CUTOVER-GUIDE.md` -> state that Phase R is blocked
  until `Bridging-R` clears
- `docs/LEGACY-RETIREMENT-PLAN.md` -> block retirement language before
  enterprise acceptance

### Behavioral changes

- IDE agents must treat the component pre-migration chain as the controlling
  status authority.
- Any doc update that proposes `retirement-candidate` must cite
  `enterprise-accepted` evidence first.

### Agent execution method

1. Read `COMPONENT-PRE-MIGRATION.md` and phase documents `PHASE-5` through
   `PHASE-7`.
2. Extract the authoritative status transitions.
3. Audit each downstream migration/cutover/retirement doc for conflicting
   status language.
4. Rewrite conflicting language without widening scope.
5. Add or update tests that enforce the normalized chain.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | verify doc-alignment and retirement wording enforcement | `src/__tests__/roadmap-doc-alignment.test.ts`; `src/__tests__/legacy-retirement.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | ensure docs/test helper changes stay type-safe | `tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | ensure package declarations remain stable | `dist/` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | enforce normalized formatting and lint quality | package root |

## 7) Evidence log

- Authority source: `docs/COMPONENT-PRE-MIGRATION.md`
- Phase authority detail:
  - `docs/component-pre-migration/PHASE-5-CONTROLLED-PILOT-INTEGRATION.md`
  - `docs/component-pre-migration/PHASE-6-ENTERPRISE-ACCEPTANCE.md`
  - `docs/component-pre-migration/PHASE-7-RELEASE-CUTOVER-RETIREMENT-REVIEW.md`
- Alignment proof: `src/__tests__/roadmap-doc-alignment.test.ts`
- Retirement-language proof: `src/__tests__/legacy-retirement.test.ts`

## 8) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| a later doc reintroduces shortcut status wording | Medium / High | keep alignment tests authoritative | V2 migration squad | Active |
| agents confuse lane-level and component-level status transitions | Medium / Medium | repeat the chain in parent and child docs | V2 migration squad | Active |

## 9) Open questions / assumptions

- Assumption: the package-local component pre-migration chain is the highest
  authority for controlled migration statuses.
- Decision needed: whether future lane-level summaries should ever use
  `enterprise-accepted` directly or remain component-row derived.

## 10) Exit checklist

- [ ] Conflicting status wording removed from all package-local migration docs.
- [ ] Alignment tests enforce the normalized chain.
- [ ] `Bridging-R` remains the gate before `Phase R`.
- [ ] No doc still implies pilot proof is enough for retirement review.

## 11) Handoff summary

- Completion recommendation: `go` only when all affected docs and tests use the
  same status chain.
- If `no-go`, blocker is unresolved authority drift.
- Next slice dependency to start: `BR-2`
