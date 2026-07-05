# Slice 3A Implementation Detail — Primitive Baseline

## 1) Slice identity

- Slice ID: `Slice 3A`
- Slice name: `Primitive baseline`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

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
- `lib/cn.ts` class merge helper required by primitive implementation
- explicit public exports for the verified primitive baseline

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

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: primitive baseline tests cover primitive lane placement, token variants, semantic render output, slot serialization, and quarantine isolation | `packages/shadcn-studio-v2/src/__tests__/primitive-baseline.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: primitive components and public declarations resolve | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS: package emits primitive public declarations | `packages/shadcn-studio-v2/dist` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS: primitive implementation, tests, and docs are format/lint clean | `packages/shadcn-studio-v2` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Primitive scope expansion before boundary verification | Medium / High | `primitive-baseline.test.ts` locks Slice 3A to `Button`, `Card`, and `Badge` | V2 migration squad | Mitigated |
| Quarantine leaks into public exports | Low / High | primitive baseline test scans public surfaces for quarantine exports | V2 migration squad | Mitigated |

## 8) Open questions / assumptions

- Assumption: `Button`, `Card`, and `Badge` are the complete baseline primitive set for first promotion.
- Assumption: any imported primitive that requires local adaptation starts in `components/quarantine/`.
- Decision: Storybook evidence remains optional for Slice 3A because the slice proves primitive structure, typing, and export safety only.
- Decision: primitives are server-safe React components unless a future primitive requires client runtime.

## 9) Exit checklist

- Verified: baseline primitive set added in `components/ui/`.
- Verified: no page-level or ERP logic in primitives.
- Verified: quarantine items do not appear in public exports.

## 10) Implementation summary

- Added `Button`, `Card`, and `Badge` under `components/ui/`.
- Added `cn` under `lib/` as the minimal package-local class merge helper.
- Exported verified primitives through neutral and client public surfaces only.
- Kept server surface config/type-only.
- Added primitive baseline governance tests.

## 11) Handoff summary

- Completion recommendation: `Go for Slice 3B kickoff`
- Blocker: `None`
- Next slice dependency to start: `Slice 3B`

## 12) Post-verification Stabilization Review

- Review result: `PASS`
- Primitive ownership is serialized through stable `data-slot` markers.
- Primitive class variants remain token-based and aligned to the V2 taxonomy.
- Primitive render output is proven through semantic SSR markup for `Button`, `Badge`, and `Card`.
- Public exports remain explicit from `@afenda/shadcn-studio-v2`.
- Quarantine and reference assets remain isolated from the public API.
- Slice 3B entry condition remains satisfied by prior scoped verification.
