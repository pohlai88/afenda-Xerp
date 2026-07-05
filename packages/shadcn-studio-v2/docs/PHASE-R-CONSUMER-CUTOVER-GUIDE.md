# Phase R Consumer Cutover Guide

## Scope

This guide defines the post-slice release/cutover phase for
`@afenda/shadcn-studio-v2`.

All package-local slices (`Slice 0` through `Slice 9`) are verified. Phase R is
the first phase that may move beyond package-local proof and start real consumer
cutover work.

`Bridging-R` is the required gate immediately before this guide becomes
executable.

Phase R is a migration guide for engineers and release owners.

It enables one decision and one action:

- decision: whether a real consumer is ready to cut over from legacy
  `@afenda/shadcn-studio` to `@afenda/shadcn-studio-v2`
- action: execute one controlled consumer cutover with validation and rollback

## Preconditions

All of the following must already be true before Phase R starts:

- `Slice 0` through `Slice 9` remain `verified` in `ROADMAP.md`
- `BRIDGING-R-PHASE-R-READINESS.md` is cleared with concrete evidence
- package-local verification passes:
  - `pnpm --filter @afenda/shadcn-studio-v2 test`
  - `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
  - `pnpm --filter @afenda/shadcn-studio-v2 build`
  - `pnpm exec biome ci packages/shadcn-studio-v2`
- `MIGRATION-MAP.md` reflects package-local replacement proof
- `LEGACY-RETIREMENT-PLAN.md` still treats deletion authority as not granted
- a release owner names one real consumer target

## Compatibility / breaking changes

Phase R is the first executable phase allowed to touch real consumers.

Compatibility notes:

- consumers must import from public V2 entrypoints only:
  - `@afenda/shadcn-studio-v2`
  - `@afenda/shadcn-studio-v2/clients`
  - `@afenda/shadcn-studio-v2/server`
  - `@afenda/shadcn-studio-v2/metadata`
- deep imports into `components/`, `views/`, `contexts/`, or `metadata/*` remain
  prohibited
- legacy package removal is still out of scope until cutover proof and rollback
  proof both exist

Potential breaking areas to validate in the real consumer:

- CSS loading and package `dist` consumption
- client/runtime behavior of `ThemeProvider` and `ThemeToggle`
- public export compatibility for primitives, layout, views, and metadata
- storybook/fixture proof matching the real consumer structure

Phase R must not be treated as directly executable from slice completion alone.
`Slice 9 verified` is necessary but not sufficient; `Bridging-R` clearance is
also required.

## Step-by-step migration

### 1. Select one consumer surface

Choose one real consumer only.

Required selection attributes:

- current owner
- route or app surface
- legacy import paths in use
- expected V2 entrypoint replacements
- rollback owner

### 2. Freeze cutover scope

Do not expand the first cutover into a broad migration batch.

Allowed first-cut scope:

- one route, page, or bounded feature surface
- public import replacement only
- no legacy deletion

### 3. Replace imports through V2 boundaries

Replace legacy imports with V2 public entrypoints only.

Do not:

- deep-import from V2 internals
- move unrelated feature logic while performing the cutover
- mix consumer cutover with root governance repair

### 4. Validate runtime behavior in the real consumer

Confirm:

- styles render correctly from package exports
- theme behavior still resolves correctly
- composed views and metadata behave as expected
- no server/client boundary regressions are introduced

### 5. Record cutover proof

Update:

- `MIGRATION-MAP.md` with real-consumer proof status
- `LEGACY-RETIREMENT-PLAN.md` if a lane can advance beyond package-local proof
- release/cutover notes owned by the release owner

### 6. Keep rollback ready

Before declaring success, document:

- legacy import fallback
- exact files or packages changed
- owner approval to revert quickly if runtime proof fails

## Validation

Minimum Phase R validation:

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

Additional required validation outside this package:

- target-consumer typecheck
- target-consumer build
- target-consumer runtime validation
- CSS/runtime confirmation in the real app surface
- rollback rehearsal or explicit rollback verification

## Rollback

Rollback immediately if any of the following occurs:

- public V2 imports cannot satisfy the real consumer boundary
- CSS or theme behavior regresses in the target consumer
- runtime client/server behavior changes unexpectedly
- metadata bindings or view composition do not hold in the real consumer

Rollback action:

1. revert the consumer import replacements
2. restore legacy package usage
3. record the failure mode and missing upstream proof
4. keep legacy lanes at `retirement-candidate`, not `retired`

## Communication notes

Phase R requires explicit coordination across:

- release owner
- target consumer owner
- package maintainer for `@afenda/shadcn-studio-v2`

Required communication artifacts:

- chosen consumer scope
- cutover window
- validation owner
- rollback owner
- post-cutover decision: continue, pause, or revert

## Assumptions and unknowns

Assumptions:

- package-local slice proof remains stable while Phase R starts
- the first real consumer can be isolated without broad migration

Unknowns:

- which real consumer is selected first
- whether compatibility shims or codemods are required
- whether the real consumer reveals missing CSS/runtime proof not visible in the
  package-local pilot

## Related docs

- `ROADMAP.md`
- `BRIDGING-R-PHASE-R-READINESS.md`
- `MIGRATION-MAP.md`
- `LEGACY-RETIREMENT-PLAN.md`
- `slices/SLICE-8-CONSUMER-PILOT-IMPLEMENTATION.md`
- `slices/SLICE-9-LEGACY-RETIREMENT-IMPLEMENTATION.md`
