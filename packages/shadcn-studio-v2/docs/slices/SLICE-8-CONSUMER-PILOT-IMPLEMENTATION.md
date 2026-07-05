# Slice 8 Implementation Detail — Consumer Pilot and Migration Bridge

## 1) Slice identity

- Slice ID: `Slice 8`
- Slice name: `Consumer pilot and migration bridge`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists
- Validate V2 with a narrow, real consumer path before broad migration.

### Slice-level acceptance criteria
- One pilot consumer path proves primitives, theme loading, shared/layout, and one composed view.
- Pilot mapping uses V2 structure (not legacy copy-paste).

## V2-only guardrail

V2-local verification only. Do not run or repair root governance, legacy studio, ERP, database, or architecture-authority gates during this slice.
## 3) Scope boundaries

### In scope
- One chosen pilot route/path
- migration translation updates required for that path
- pilot import + runtime import check evidence

### Out of scope
- broad legacy migration
- unrelated consumer surfaces

### Anti-goals
- do not scale migration before pilot proves proof.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 7`
- Dependencies:
  - stable public API surfaces
- Required gates before merge:
  - `Gate D: export boundary`
  - `Gate E: typecheck and config resolution`
  - `Gate G: pilot import check`

## 5) Implementation plan

### Pilot execution
- Select single consumer surface and migrate by translation.
- Capture before/after mapping in `MIGRATION-MAP.md`.
- Keep `packages/shadcn-studio` active until proof is approved.

### Verification
- Import checks for pilot path with build/test evidence.
- Validate theme + composition behavior in pilot.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: pilot tests prove rendering through public client/metadata surfaces, metadata serializability, and no deep-import bypass of V2 entrypoints | `packages/shadcn-studio-v2/src/__tests__/consumer-pilot.test.tsx` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: pilot fixture resolves through public entrypoints only | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS: package emits verified pilot-facing declarations | `packages/shadcn-studio-v2/dist` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS: consumer pilot implementation, tests, and docs are format/lint clean | `packages/shadcn-studio-v2` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| pilot expands into broad migration | Medium / High | Freeze pilot scope to one consumer path until gate evidence passes | V2 migration squad | Active |
| pilot uses legacy structure instead of V2 translation | Medium / High | Require `MIGRATION-MAP.md` before/after mapping before verification | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: the first pilot will exercise primitives, theme loading, shared/layout parts, and one composed view.
- Decision: the package-local pilot is `src/storybook/fixtures/consumer-pilot.tsx`.

## 9) Implementation summary

- Added a package-local pilot fixture at `src/storybook/fixtures/consumer-pilot.tsx`.
- Kept pilot imports constrained to `../../clients` and `../../metadata`.
- Verified that the pilot renders composed views, layout/shared parts, primitive outputs, and metadata together.
- Updated migration tracking to reflect translated pilot proof without touching legacy studio or ERP.

## 10) Exit checklist

- Verified: pilot path is translated through V2 entrypoints only.
- Verified: no broad cutover was performed for unrelated surfaces.
- Verified: evidence supports Slice 9 retirement planning without approving deletion.

## 11) Post-verification stabilization review

- Review result: `PASS`
- Pilot proof stays package-local and does not bypass public boundaries.
- Metadata remains serializable when exercised through the pilot.
- Legacy studio remains untouched by Slice 8.
- Slice 9 entry condition is satisfied from verified V2-only pilot proof.

## 12) Slice 9 Preparation Note

- Slice 9 may update retirement planning records from V2 evidence only.
- Slice 9 must not perform ad hoc legacy deletion outside `MIGRATION-MAP.md`.
- Replacement proof must remain explicit before any retirement status advances.
