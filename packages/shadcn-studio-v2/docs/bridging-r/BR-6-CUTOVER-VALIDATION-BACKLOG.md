# BR-6 Implementation Detail - Cutover Validation Backlog

## 1) Slice identity

- Slice ID: `BR-6`
- Slice name: `Cutover validation backlog`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists

- Define the out-of-package validation that must succeed before a real consumer
  switch is allowed.

### Slice-level acceptance criteria

- The required consumer-side validations are explicitly listed.
- Each validation has an owner and proof target.
- Rollback rehearsal or explicit rollback verification is required, not implied.

## 3) Scope boundaries

### In scope

- validation definition
- ownership definition
- runtime/CSS/build/typecheck/rollback proof requirements

### Out of scope

- executing consumer-side remediation
- approving a cutover without evidence
- broad release orchestration

### Anti-goals

- do not substitute package-local tests for real consumer validation

## 4) Dependencies and sequence gates

- Predecessor slice: `BR-5`
- Dependencies on external teams, packages, or tasks:
  - `consumer owner`
  - `validation owner`
  - `rollback owner`
- Required gates before merge:
  - all required validation categories documented
  - each category mapped to proof and owner

## 5) Implementation plan

### Current bridge status

| Dimension | Status | Evidence |
| --- | --- | --- |
| Documentation synchronization | `green` | validation slice is parent-linked and indexed |
| Execution readiness | `green` | consumer-side commands, runtime proof, CSS proof, and rollback verification are now recorded |
| Remaining gap | `none - reviewed` | validation record is complete for the bounded consumer surface |

### Validation categories

- target consumer typecheck
- target consumer build
- runtime verification
- CSS verification
- rollback rehearsal or explicit rollback verification

### Current repo evidence

- Candidate consumer commands already exist in `apps/developer/package.json`
- Candidate route is `/dashboard/sales`
- Route-lab blueprint already treats `3002` as the verification surface for the
  developer app

### Agent execution method

1. Use the selected consumer from `BR-5`.
2. Record the exact command or verification action for each category.
3. Define what counts as pass/fail.
4. Record the artifact location for each result.
5. Keep `Phase R` blocked until each category has an executable plan.

### Failure handling rule

- If any category cannot yet be expressed as a concrete command, route, or test
  action, this slice remains blocked.

### Validation record

| Validation category | Owner | Command / action | Artifact | Status |
| --- | --- | --- | --- | --- |
| Target consumer typecheck | `@afenda/developer route-lab owner` | `pnpm --filter @afenda/developer typecheck` | `docs/bridging-r/evidence/README.md` | `passed` |
| Target consumer build | `@afenda/developer route-lab owner` | `pnpm --filter @afenda/developer build` | `docs/bridging-r/evidence/README.md` | `passed` |
| Runtime verification | `@afenda/developer route-lab owner` | `$env:PLAYWRIGHT_PORT='3006'; pnpm --filter @afenda/developer test:e2e:smoke` | `docs/bridging-r/evidence/README.md` | `passed` |
| CSS verification | `@afenda/developer route-lab owner` | `apps/developer/src/app/globals.css` import order plus `sales-route-cutover.spec.ts` screenshot capture | `docs/bridging-r/evidence/README.md`; `docs/bridging-r/evidence/br-6-sales-route-cutover.png` | `passed` |
| Rollback rehearsal / verification | `@afenda/developer route-lab owner` | explicit rollback verification over the bounded V2 import surface | `docs/bridging-r/evidence/README.md` | `verified` |

### Recommended child steps

1. `BR-6A` freeze the exact consumer-side commands.
2. `BR-6B` define runtime and CSS proof expectations for `/dashboard/sales`.
3. `BR-6C` define rollback proof as a real verification step.
4. `BR-6D` attach artifacts once the validations run.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | keeps package-local docs/tests stable while validation docs evolve | `src/__tests__/roadmap-doc-alignment.test.ts` |
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
| validation plan remains package-centric instead of consumer-centric | High / High | require out-of-package proof for every category | Validation owner | Active |
| rollback is documented but never rehearsed or reviewed | Medium / High | require rollback owner and explicit rollback proof | Rollback owner | Active |

## 9) Open questions / assumptions

- Assumption: `@afenda/developer` can provide the first out-of-package proof
  without ERP-only dependencies.
- Decision needed: whether rollback proof must be executed as a rehearsal or may
  begin as an explicit reviewed verification record.

## 10) Exit checklist

- [x] All validation categories are defined.
- [x] Each category has an owner.
- [x] Each category has a proof target.
- [x] Rollback verification is explicit.

## 11) Handoff summary

- Completion recommendation: `go` only when cutover validation is concrete
  enough to execute during `Phase R`.
- If `no-go`, blocker is missing consumer-side proof design.
- Next slice dependency to start: `BR-7`
