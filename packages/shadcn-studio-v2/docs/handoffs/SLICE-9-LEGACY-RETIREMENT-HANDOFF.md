# Slice 9 Handoff — Legacy Retirement Plan

## Status

- Slice ID: `Slice 9`
- Slice name: `Legacy retirement plan`
- Status: `verified`
- Scope: `packages/shadcn-studio-v2/**` only
- Completion date: `2026-07-05`

## Delivered files

- `docs/LEGACY-RETIREMENT-PLAN.md`
- `src/__tests__/legacy-retirement.test.ts`
- `docs/MIGRATION-MAP.md`

## Retirement decision

Slice 9 does not retire or delete legacy code.

It classifies legacy lanes using V2 evidence and records the release-owner gates required before any production cutover or deletion.

## Stabilization completed

- Removed `pending` from migration-map lane dispositions.
- Kept `retired` unused because no release-owner deletion proof exists.
- Added tests that enforce non-pending, allowed migration statuses.
- Added explicit non-destructive retirement plan.

## Verification evidence

- `pnpm --filter @afenda/shadcn-studio-v2 test` — PASS
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck` — PASS
- `pnpm --filter @afenda/shadcn-studio-v2 build` — PASS
- `pnpm exec biome ci packages/shadcn-studio-v2` — PASS

## Next implementation readiness

All planned V2 slices are now implemented and verified at package-local scope.

Any next implementation should be a separately authorized release/cutover slice, not automatic legacy deletion.

## Verdict

Slice 9 is verified. V2 package-local migration implementation is complete; production retirement remains a separate release-owner decision.