# Slice 8 Implementation Detail — Consumer Pilot and Migration Bridge

## 1) Slice identity

- Slice ID: `Slice 8`
- Slice name: `Consumer pilot and migration bridge`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 7 verification`
- Actual completion date: `Not completed`
- Current status: `not-started`

## 2) Strategic objective

### Why this slice exists
- Validate V2 with a narrow, real consumer path before broad migration.

### Slice-level acceptance criteria
- One pilot consumer path proves primitives, theme loading, shared/layout, and one composed view.
- Pilot mapping uses V2 structure (not legacy copy-paste).

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

- `pnpm --filter @afenda/erp test:run`
- `pnpm --filter @afenda/erp build`
- `pnpm check:erp-module-ownership`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/erp build` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-8-CONSUMER-PILOT-IMPLEMENTATION.md` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| pilot expands into broad migration | Medium / High | Freeze pilot scope to one consumer path until gate evidence passes | V2 migration squad | Active |
| pilot uses legacy structure instead of V2 translation | Medium / High | Require `MIGRATION-MAP.md` before/after mapping before verification | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: the first pilot will exercise primitives, theme loading, shared/layout parts, and one composed view.
- Decision needed before verification: select the exact pilot consumer path and owner.

## 9) Exit checklist

- Required before verification: pilot path migrated through V2 translation.
- Required before verification: no broad cutover performed for unrelated surfaces.
- Required before verification: evidence supports go/no-go decision for legacy retirement planning.
