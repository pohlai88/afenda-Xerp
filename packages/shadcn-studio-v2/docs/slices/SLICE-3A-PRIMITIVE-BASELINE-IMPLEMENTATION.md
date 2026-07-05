# Slice 3A Implementation Detail — Primitive Baseline

## 1) Slice identity

- Slice ID: `Slice 3A`
- Slice name: `Primitive baseline`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 2 verification`
- Actual completion date: `Not completed`
- Current status: `not-started`

## 2) Strategic objective

### Why this slice exists
- Introduce minimal verified primitives as the base lane before composition.

### Slice-level acceptance criteria
- Added primitives: `Button`, `Card`, `Badge`
- Primitives are under `components/ui/`
- Unstable imports remain in quarantine.

## 3) Scope boundaries

### In scope
- `components/ui/` primitives listed above
- `components/quarantine/` handling for unstable or imported work

### Out of scope
- layouts, views, metadata, or pilot migration

### Anti-goals
- Do not import page composition into `components/ui/`.
- Do not promote non-taxonomy names through this slice.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 2`
- Dependencies:
  - config/runtime and export scaffolding stable
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate B: naming`
  - `Gate D: export boundary`
  - `Gate E: typecheck and config resolution`
  - optional Storybook verification if adopted

## 5) Implementation plan

### Structure changes
- Add/translate primitives into `components/ui/`.
- Ensure runtime props and accessibility are consistent with package style.
- Route non-finalized implementations to `components/quarantine/`.

### Export and boundary work
- Root/public exports remain explicit and do not expose quarantine items.

## 6) Test and verification commands

- `pnpm quality:exports`
- `pnpm quality:boundaries`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm quality:exports` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-3A-PRIMITIVE-BASELINE-IMPLEMENTATION.md` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Primitive scope expansion before boundary verification | Medium / High | Strict export review before new primitive add | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: `Button`, `Card`, and `Badge` are the complete baseline primitive set for first promotion.
- Assumption: any imported primitive that requires local adaptation starts in `components/quarantine/`.
- Decision needed before verification: confirm whether Storybook evidence is required for this slice or only optional.

## 9) Exit checklist

- Required before verification: baseline primitive set added in `components/ui/`.
- Required before verification: no page-level or ERP logic in primitives.
- Required before verification: quarantine items do not appear in public exports.
