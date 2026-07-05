# Bridging-R Phase R Readiness Guide

## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | `migration` |
| Audience | engineers and release owners |
| Source of truth | mixed repo docs and current package state |
| Lifecycle state | rewrite / maintenance |
| Action enabled | decide whether `Phase R` may start |
| Scope | post-slice readiness only; no real consumer cutover execution |

## Purpose

`Bridging-R` is the gate between verified package-local slices and executable
`Phase R` cutover.

It exists because `Slice 0` through `Slice 9` prove package-local readiness, but
they do not yet prove that one real consumer may safely switch from
`@afenda/shadcn-studio` to `@afenda/shadcn-studio-v2`.

This document enables one decision:

- whether the backlog required before `Phase R` has been completed with concrete
  evidence

This document does not authorize:

- ERP or external consumer mutation
- legacy package deletion
- broad migration rollout
- treating package-local pilot proof as enterprise cutover proof

## Architectural placement

The required execution order is:

1. `Slice 0` through `Slice 9` remain `verified`
2. `BR-0` preflight consistency is `verified`
3. `BR-0.1` synchronization and gap analysis is `verified`
4. `Bridging-R` backlog is completed and recorded
5. `Phase R` starts for one named real consumer
6. post-cutover retirement review may happen later

The authority rule for this bridge is:

- `pilot-proven` is package-local or pilot-level evidence
- `enterprise-accepted` is required before any component or lane may become
  `retirement-candidate`
- `retirement-candidate` does not authorize deletion; it only authorizes
  release-owner cutover review after enterprise acceptance

## Current verdict

`Phase R` may now start for one bounded real-consumer surface.

The package has verified local slices and a verified `Bridging-R` structure,
and the bridge backlog is now closed for `@afenda/developer` ->
`/dashboard/sales`.

Current state by bridge slice:

| Slice | State | Why it is not yet fully closed |
| --- | --- | --- |
| `BR-1` | `verified` | authority wording is normalized and package-local tests enforce it |
| `BR-2` | `verified` | enterprise evidence is concrete and repo-local |
| `BR-3` | `verified` | the first-cutover surface is frozen and represented in the ledger |
| `BR-4` | `verified` | the V2 CSS/theme contract is exported and validated in a real consumer |
| `BR-5` | `verified` | the consumer, route, and ownership roles are recorded |
| `BR-6` | `verified` | consumer validation commands, smoke proof, and screenshot artifacts are attached |
| `BR-7` | `verified` | release-owner approval is recorded in repo evidence |

Current repo-backed control notes:

- the bounded bridge proof is recorded in `docs/bridging-r/evidence/README.md`
- the selected real-consumer surface is limited to `@afenda/developer` ->
  `/dashboard/sales`
- ERP consumer mutation and legacy deletion both remain out of scope for this
  bridge record

## Bridge architecture

`Bridging-R` is a migration authority, not a single work item.

Use it as a parent architecture for smaller documentation slices:

1. `BR-0` and `BR-0.1` keep the bridge structurally correct
2. `BR-1` fixes authority drift
3. `BR-2` through `BR-7` convert structural readiness into executable cutover
   readiness
4. `PHASE-R-CONSUMER-CUTOVER-GUIDE.md` becomes executable only after every
   bridge slice is `verified`

Each `BR-*` slice should be developed like a package-local implementation slice:

- one bounded objective
- one evidence set
- one ordered method
- one exit gate
- one downstream effect on `Phase R`

## Delivery slices by backlog

This table is the planning format IDE agents should follow.

| Bridge slice | Recommended child steps | Primary outputs |
| --- | --- | --- |
| `BR-1` | `BR-1A authority source audit` -> `BR-1B wording normalization` -> `BR-1C doc-alignment enforcement` | authoritative status chain across package docs/tests |
| `BR-2` | `BR-2A evidence source capture` -> `BR-2B technical proof population` -> `BR-2C UX/rollback proof population` -> `BR-2D approval input attachment` | concrete enterprise evidence record for the first cutover surface |
| `BR-3` | `BR-3A consumer import inventory` -> `BR-3B ledger row creation` -> `BR-3C status normalization` -> `BR-3D cutover-surface freeze` | migration ledger expanded to the first real consumer surface |
| `BR-4` | `BR-4A current contract capture` -> `BR-4B V1/V2 export diff` -> `BR-4C target contract decision` -> `BR-4D export verification` | explicit CSS/theme/export contract for the selected consumer |
| `BR-5` | `BR-5A candidate scan` -> `BR-5B bounded route selection` -> `BR-5C ownership completion` -> `BR-5D selection publication` | one named first consumer with route and owners |
| `BR-6` | `BR-6A command inventory` -> `BR-6B runtime/CSS proof plan` -> `BR-6C rollback verification plan` -> `BR-6D artifact attachment` | consumer-side validation record with executable proof |
| `BR-7` | `BR-7A release-owner record` -> `BR-7B go/no-go checkpoint definition` -> `BR-7C approval artifact binding` -> `BR-7D scope-protection review` | explicit authorization checkpoint for starting `Phase R` |

## Bridging-R backlog

### BR-0 Preflight consistency

Goal: prove that the bridge package is structurally ready before backlog
execution begins.

Required evidence:

- parent bridge guide is linked and current
- bridge implementation index is linked and current
- `BR-0.1` exists as the synchronization authority
- package-local alignment tests cover the bridge tree

Implementation guide:

- `bridging-r/BR-0-PREFLIGHT-CONSISTENCY.md`

### BR-0.1 Synchronization and gap analysis

Goal: keep every bridge slice synchronized and explicitly separate documentation
health from execution-readiness health.

Required evidence:

- one synchronization matrix covers `BR-0` through `BR-7`
- one gap-analysis table records current state for every bridge slice
- documentation synchronization can be evaluated as `green` when package-local
  proof exists

Implementation guide:

- `bridging-r/BR-0-1-SYNCHRONIZATION-AND-GAP-ANALYSIS.md`

### BR-1 Authority reconciliation

Goal: make one rule authoritative for when `retirement-candidate` is allowed.

Required rule:

- only `enterprise-accepted` components or lanes may become
  `retirement-candidate`

Required work:

- remove any wording that treats `pilot-proven` as sufficient for
  `retirement-candidate`
- keep `COMPONENT-PRE-MIGRATION.md` and phase docs as the controlling status
  chain
- update related migration docs so they all reflect the same status rule

Required evidence:

- `ROADMAP.md` states that `Bridging-R` must clear before `Phase R`
- `MIGRATION-MAP.md` no longer marks package-local pilot lanes as
  `retirement-candidate`
- `PHASE-R-CONSUMER-CUTOVER-GUIDE.md` states that execution begins only after
  `Bridging-R` is cleared
- `LEGACY-RETIREMENT-PLAN.md` keeps deletion and retirement after enterprise
  acceptance and release-owner review

Implementation guide:

- `bridging-r/BR-1-AUTHORITY-RECONCILIATION.md`

Implementation method for IDE agents:

- `BR-1A authority source audit`
  - read `COMPONENT-PRE-MIGRATION.md` plus `PHASE-5` through `PHASE-7`
  - extract the only valid status chain:
    `migrated` -> `pilot-proven` -> `enterprise-accepted` -> `retirement-candidate`
- `BR-1B wording normalization`
  - update `ROADMAP.md`, `MIGRATION-MAP.md`,
    `PHASE-R-CONSUMER-CUTOVER-GUIDE.md`, and `LEGACY-RETIREMENT-PLAN.md`
  - remove any wording that implies `pilot-proven` alone permits retirement
- `BR-1C doc-alignment enforcement`
  - keep package-local tests asserting the same rule across the affected docs

Exit gate:

- authority wording is consistent in docs and tests
- no doc positions `Phase R` as executable directly after slice completion

### BR-2 Enterprise acceptance backlog

Goal: convert package-local pilot proof into concrete enterprise acceptance
evidence.

Required evidence for the first cutover surface:

- public export proof
- API compatibility proof
- CSS loading proof
- runtime client/server proof
- accessibility proof
- visual proof
- rollback proof
- release-owner approval

Rules:

- each proof item must contain a concrete artifact, command result, owner, or
  location
- placeholder text such as `TBD`, `later`, `to be validated`, or empty labels
  does not satisfy this backlog

Implementation guide:

- `bridging-r/BR-2-ENTERPRISE-ACCEPTANCE-EVIDENCE.md`

Current repo evidence:

- `apps/developer` provides the named consumer and runnable
  `typecheck`, `build`, `test:e2e:smoke`, and `test:e2e:cutover:sales`
  commands
- `apps/developer/src/app/(lab)/dashboard/sales/page.tsx` is the bounded
  cutover route
- `docs/bridging-r/evidence/README.md` records export, API, CSS, runtime,
  accessibility, visual, rollback, and approval proof

Implementation method for IDE agents:

- `BR-2A evidence source capture`
  - bind the selected consumer and route from `BR-5`
  - bind the current public contracts from `apps/developer`,
    `apps/erp`, and legacy `@afenda/shadcn-studio`
- `BR-2B technical proof population`
  - record public export proof
  - record API compatibility proof
  - record CSS loading proof
  - record runtime client/server proof
- `BR-2C UX and rollback proof population`
  - record accessibility proof
  - record visual proof
  - record rollback proof
- `BR-2D approval input attachment`
  - attach the release-owner checkpoint from `BR-7`
  - reject placeholder evidence

Exit gate:

- every evidence field points to a command, artifact, or explicit approval
- no `TBD`, `later`, or equivalent placeholder text remains

### BR-3 Ledger completion backlog

Goal: expand the migration ledger beyond one component row so the first real
consumer cutover has declared scope.

Required work:

- identify the actual public surface for the first real consumer
- add ledger rows for every component, view, layout part, shared helper, and
  metadata surface required by that consumer
- record the required status target for each row before `Phase R`

Minimum first-cutover ledger expectation:

- all directly imported primitives used by the chosen consumer
- all layout/shared surfaces used by the chosen consumer
- any composed views or metadata surfaces imported through public boundaries
- CSS entrypoints or theme-loading surfaces if they are part of consumer setup

Status rule:

- rows required by the chosen consumer must be at least `pilot-proven`
- rows that need release-owner retirement review must be
  `enterprise-accepted` before they may become `retirement-candidate`

Implementation guide:

- `bridging-r/BR-3-LEDGER-COMPLETION-AND-FIRST-CUTOVER-SURFACE.md`

Current repo evidence:

- `apps/developer/src/app/layout.tsx` now depends on
  `@afenda/shadcn-studio-v2/theme`
- `apps/developer/src/app/globals.css` now depends on
  `@afenda/shadcn-studio-v2/shadcn-default.css`
- `apps/developer/src/config/nav-config.ts` now depends on
  `AppShellNavGroupWire` from V2
- `apps/developer/src/app/(lab)/dashboard/sales/_components/sales-overview-panel.tsx`
  now depends on the V2 dashboard blocks
- `apps/developer/src/app/(lab)/dashboard/sales/page.tsx` now depends on the
  V2 `Card` primitive family

Implementation method for IDE agents:

- `BR-3A consumer import inventory`
  - scan the selected consumer route, root layout, route layout, config, and
    global CSS
  - list every package touchpoint used by that route surface
- `BR-3B ledger row creation`
  - add one ledger row per required touchpoint
  - include primitives, composed blocks, theme/runtime entrypoints, metadata
    contracts, and CSS exports
- `BR-3C status normalization`
  - mark rows `pilot-proven`, `blocked`, or `enterprise-accepted` according to
    evidence reality
  - do not skip stages for missing V2 exports
- `BR-3D cutover-surface freeze`
  - freeze the first-cutover surface so later rows do not silently expand the
    migration blast radius

Exit gate:

- the ledger covers the complete selected consumer surface
- every required touchpoint has a row and a truthful status

### BR-4 CSS and export readiness backlog

Goal: decide and prove the CSS/runtime loading contract that the real consumer
will use.

Current package-state concern:

- the package export contract is complete, and the bounded real consumer now
  validates it in live code

Required work:

- choose the real-consumer CSS entrypoint strategy
- document whether CSS is loaded through package-exported files, app-owned
  imports, or another governed entrypoint
- if package-exported CSS is required, make that export explicit and verify it
  before `Phase R`

Required evidence:

- import path or entrypoint name
- consumer-side usage example
- package export proof if applicable
- CSS ordering proof
- fallback/rollback behavior if CSS loading fails

Implementation guide:

- `bridging-r/BR-4-CSS-AND-EXPORT-READINESS.md`

Current repo evidence:

- V2 exports `.`, `./clients`, `./server`, `./metadata`, `./theme`, and
  `./shadcn-default.css`
- `apps/developer` now imports `@afenda/shadcn-studio-v2/theme`
- `apps/developer` now imports `@afenda/shadcn-studio-v2/shadcn-default.css`
- the consumer-side validation and screenshot artifact are recorded in
  `docs/bridging-r/evidence/README.md`

Implementation method for IDE agents:

- `BR-4A current contract capture`
  - record the live V1 consumer contract from real apps
  - record the exact CSS ordering:
    `tailwindcss` -> `tw-animate-css` -> `shadcn/tailwind.css` -> package CSS
- `BR-4B V1/V2 export diff`
  - compare the legacy package `exports` map with the V2 `exports` map
  - compare expected `dist` CSS artifacts with V2 build outputs
- `BR-4C target contract decision`
  - decide whether V2 must expose `./theme` and `./shadcn-default.css`
  - document the contract in migration docs before any consumer switch
- `BR-4D export verification`
  - keep `Phase R` blocked until the selected contract is both present and
    verified

Exit gate:

- the selected consumer can describe one governed CSS/theme import contract
- V2 exports match that contract, or the slice remains blocked

### BR-5 Real consumer selection backlog

Goal: record one real consumer before any cutover planning starts.

Required selection fields:

- named target consumer
- owning team or owner of record
- route, page, or bounded surface
- rollback owner
- validation owner

Hard rule:

- `Phase R` may not start until this selection is written down in repo docs

Implementation guide:

- `bridging-r/BR-5-REAL-CONSUMER-SELECTION.md`

Current repo evidence:

- `@afenda/developer` is the named consumer of record
- `/dashboard/sales` is the bounded first-cutover surface
- ownership roles are recorded in `docs/bridging-r/evidence/README.md`

Implementation method for IDE agents:

- `BR-5A candidate scan`
  - compare `apps/developer` with `apps/erp` and reject broad first-cut choices
- `BR-5B bounded route selection`
  - select one route or surface, not a whole app
  - recommended candidate today:
    `@afenda/developer` -> `/dashboard/sales`
- `BR-5C ownership completion`
  - record owner of record, validation owner, and rollback owner
  - if repo docs do not prove them, leave the selection open instead of
    inventing names
- `BR-5D selection publication`
  - write the selection into the bridge docs and align the ledger to it

Exit gate:

- one consumer and one bounded route are recorded
- owner, validation, and rollback fields are explicit

### BR-6 Cutover validation backlog

Goal: define the out-of-package proof that must exist before a switch is
allowed.

Required validation:

- target consumer typecheck
- target consumer build
- runtime verification
- CSS verification
- rollback rehearsal or explicit rollback verification

Validation rule:

- proof must be out-of-package, not just package-local fixture proof

Implementation guide:

- `bridging-r/BR-6-CUTOVER-VALIDATION-BACKLOG.md`

Current repo evidence:

- `apps/developer/package.json` now exposes:
  `pnpm --filter @afenda/developer typecheck`,
  `pnpm --filter @afenda/developer build`,
  `pnpm --filter @afenda/developer test:e2e:smoke`, and
  `pnpm --filter @afenda/developer test:e2e:cutover:sales`
- runtime, CSS, and visual artifacts are recorded in
  `docs/bridging-r/evidence/README.md`

Implementation method for IDE agents:

- `BR-6A command inventory`
  - record the consumer-side typecheck, build, and smoke commands
- `BR-6B runtime and CSS proof plan`
  - record the exact route and expected CSS/theme behavior to verify
- `BR-6C rollback verification plan`
  - define how to prove the consumer can return to the legacy package contract
    if V2 fails
- `BR-6D artifact attachment`
  - link command outputs, screenshots, or review artifacts once they exist

Exit gate:

- every validation category has a concrete action and artifact location
- rollback verification is explicit, not implied

### BR-7 Release-owner governance backlog

Goal: make the go/no-go checkpoint explicit before consumer switch.

Required work:

- record a release owner
- record the go/no-go checkpoint
- record approval timing and proof location

Scope protection:

- legacy deletion remains out of scope until after successful cutover review

Implementation guide:

- `bridging-r/BR-7-RELEASE-OWNER-GOVERNANCE.md`

Current repo evidence:

- `ADR-0039` records `Architecture Authority` as the release owner
- `docs/bridging-r/evidence/README.md` records the go/no-go approval artifact

Implementation method for IDE agents:

- `BR-7A release-owner record`
  - identify the release owner of record for the first cutover decision
- `BR-7B go/no-go checkpoint definition`
  - define the exact checkpoint at which `Phase R` may start
- `BR-7C approval artifact binding`
  - record where the approval lives and which backlog evidence it references
- `BR-7D scope-protection review`
  - restate that legacy deletion stays out of scope until after successful
    cutover review

Exit gate:

- `Phase R` start is tied to an explicit approval artifact
- governance does not widen into deletion planning

## Readiness checklist

`Bridging-R` is complete only when every item below is true:

- `BR-0` and `BR-0.1` remain `verified`
- `BR-1` through `BR-7` each have concrete evidence
- one real consumer is named
- the first cutover surface is fully represented in the migration ledger
- `retirement-candidate` appears only after `enterprise-accepted`
- CSS/export strategy is explicit and verified
- rollback ownership and release-owner approval are recorded

If all items are true, `Phase R` may start for the bounded consumer surface.

## Implementation-document build-up model

Use `Bridging-R` as the architectural parent for smaller readiness documents.

Recommended pattern:

- keep this file as the summary gate and decision document
- keep one child implementation document per backlog slice
- use the child doc to track evidence, execution order, and exit gate for that
  slice
- current child implementation index: `bridging-r/README.md`
- each child doc should record:
  - objective
  - authority/source docs
  - current repo evidence
  - recommended child steps
  - exact backlog item addressed
  - evidence to gather
  - exit condition
  - downstream effect on `Phase R`

This prevents `Phase R` from becoming a mixed planning/execution document.

## Relationship to Phase R

`PHASE-R-CONSUMER-CUTOVER-GUIDE.md` remains valid, but it is executable only
after this bridge is cleared.

Interpretation rule:

- `Bridging-R` answers: "are we allowed to start cutover work yet?"
- `Phase R` answers: "how do we execute the cutover once start is authorized?"

## Related docs

- `README.md`
- `ROADMAP.md`
- `MIGRATION-MAP.md`
- `COMPONENT-PRE-MIGRATION.md`
- `PHASE-R-CONSUMER-CUTOVER-GUIDE.md`
- `LEGACY-RETIREMENT-PLAN.md`
- `bridging-r/README.md`
- `bridging-r/BR-0-PREFLIGHT-CONSISTENCY.md`
- `bridging-r/BR-0-1-SYNCHRONIZATION-AND-GAP-ANALYSIS.md`
- `bridging-r/evidence/README.md`
- `slices/SLICE-IMPLEMENTATION-INDEX.md`
