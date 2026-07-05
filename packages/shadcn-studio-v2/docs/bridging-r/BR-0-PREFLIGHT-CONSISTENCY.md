# BR-0 Implementation Detail - Preflight Consistency

## 1) Slice identity

- Slice ID: `BR-0`
- Slice name: `Preflight consistency`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists

- Establish the `Bridging-R` execution contract before any backlog slice work is
  performed.
- Prove that the parent guide, child guides, indexes, and package-local tests
  agree on the same bridge sequence.

### Slice-level acceptance criteria

- `BRIDGING-R-PHASE-R-READINESS.md` is the parent gate.
- `bridging-r/README.md` indexes every bridge implementation document.
- `BR-0.1` exists as the synchronization and gap-analysis authority.
- package-local tests prove the bridge structure exists and remains aligned.

## 3) Scope boundaries

### In scope

- bridge-document entry sequencing
- package-local index synchronization
- package-local verification commands
- preflight status capture

### Out of scope

- consumer selection
- enterprise acceptance evidence completion
- cutover execution

### Anti-goals

- do not treat preflight completion as evidence that `Phase R` may start

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 9`
- Dependencies on external teams, packages, or tasks:
  - `none - package-local documentation preflight`
- Required gates before merge:
  - `README.md` link alignment
  - `SLICE-IMPLEMENTATION-INDEX.md` link alignment
  - `roadmap-doc-alignment.test.ts` coverage for the bridge tree

## 5) Implementation plan

### Current bridge status

| Dimension | Status | Evidence |
| --- | --- | --- |
| Documentation synchronization | `green` | parent guide, bridge index, and test coverage are aligned |
| Execution readiness | `green` | preflight checks are complete and package-local gates passed |
| Remaining gap | `none - reviewed` | preflight package is complete inside package-local scope |

### Architecture/structure changes

- `docs/BRIDGING-R-PHASE-R-READINESS.md` -> declare `BR-0` and `BR-0.1` as
  required before executing `BR-1` through `BR-7`
- `docs/bridging-r/README.md` -> add complete bridge execution order
- `src/__tests__/roadmap-doc-alignment.test.ts` -> verify the full bridge tree

### Preflight procedure

1. Confirm `Slice 0` through `Slice 9` remain verified.
2. Confirm `Bridging-R` is linked from the root docs index and slice index.
3. Confirm every bridge implementation document exists.
4. Confirm the bridge tree includes:
   - `BR-0` preflight
   - `BR-0.1` synchronization and gap analysis
   - `BR-1` through `BR-7`
5. Run package-local tests and formatting gates.

### Preflight status

| Check | Result | Evidence |
| --- | --- | --- |
| Parent bridge guide present | PASS | `docs/BRIDGING-R-PHASE-R-READINESS.md` |
| Bridge implementation index present | PASS | `docs/bridging-r/README.md` |
| `BR-0` present | PASS | `docs/bridging-r/BR-0-PREFLIGHT-CONSISTENCY.md` |
| `BR-0.1` present | PASS | `docs/bridging-r/BR-0-1-SYNCHRONIZATION-AND-GAP-ANALYSIS.md` |
| `BR-1` through `BR-7` present | PASS | `docs/bridging-r/` |
| Alignment test coverage present | PASS | `src/__tests__/roadmap-doc-alignment.test.ts` |

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | verify bridge-tree alignment and preflight coverage | `src/__tests__/roadmap-doc-alignment.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | ensure test/doc support remains type-safe | `tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | ensure package declarations remain stable | `dist/` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | enforce formatting/lint consistency | package root |

## 7) Evidence log

- Parent gate: `docs/BRIDGING-R-PHASE-R-READINESS.md`
- Bridge index: `docs/bridging-r/README.md`
- Alignment proof: `src/__tests__/roadmap-doc-alignment.test.ts`

## 8) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| bridge docs drift before backlog execution starts | Medium / High | require preflight and test enforcement | V2 migration squad | Active |
| contributors skip `BR-0.1` and treat child docs as isolated | Medium / Medium | define execution order in the bridge index | V2 migration squad | Active |

## 9) Open questions / assumptions

- Assumption: package-local preflight is the correct boundary before any
  external cutover planning begins.
- Decision needed: none for this slice; it is structural and package-local.

## 10) Exit checklist

- [x] Parent and child bridge docs are linked.
- [x] `BR-0.1` exists and is indexed.
- [x] Alignment tests cover the bridge tree.
- [x] Package-local verification commands are green.

## 11) Handoff summary

- Completion recommendation: `go`
- If `no-go`, blocker is missing bridge-tree synchronization.
- Next slice dependency to start: `BR-0.1`
