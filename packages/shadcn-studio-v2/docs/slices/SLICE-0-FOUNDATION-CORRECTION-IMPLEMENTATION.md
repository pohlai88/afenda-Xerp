# Slice 0 Implementation Detail — Foundation Correction

## 1) Slice identity

- Slice ID: `Slice 0`
- Slice name: `Foundation correction`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists
- Stop premature migration by stabilizing the package scaffold and authority signals before any behavior changes.

### Slice-level acceptance criteria
- Scaffold and taxonomy are corrected for V2.
- Legacy drift is removed from root/public/config/taxonomy surfaces.
- Authority docs and package structure are aligned before functional work starts.

## 3) Scope boundaries

### In scope
- `packages/shadcn-studio-v2/src` root names
- root public files alignment
- Level 2 taxonomy alignment
- forbidden legacy path names cleanup
- `tsconfig` alias/path sanity
- package and Vitest config consistency
- taxonomy/test consistency in docs

### Out of scope
- new component implementation
- theme implementation
- consumer migration
- public API feature work beyond scaffold boundary

### Anti-goals
- Do not start component runtime, CSS, or migration behavior here.
- Do not defer drift repair to later slices.

## 4) Dependencies and sequence gates

- Predecessor slice: `None (starting slice)`
- Dependencies:
  - Taxonomy authority files under this package
  - `TAXONOMY.md`
  - `ROADMAP.md`
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate B: naming`
  - `Gate E: typecheck and config resolution`

## 5) Implementation plan

### Structure changes
- `src/` root names: re-check for `v2` aligned directory and namespace naming.
- public root files: verify only sanctioned surfaces remain before expansion.
- config files: remove stale aliases, verify no legacy stems remain.
- docs/test surfaces: align taxonomy mentions to source reality and ensure `__tests__` is treated as test exception only.

### Export and boundary work
- Keep implementation strictly scaffold-level.
- Do not add root export barrels during this slice.

## 6) Test and verification commands

- `pnpm check:foundation-disposition`
- `pnpm check:legacy-delivery-terminology`
- `pnpm quality:boundaries`
- `pnpm quality:exports`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test:taxonomy` | PASS: 7 tests passed | `packages/shadcn-studio-v2/src/__tests__/taxonomy.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: 2 files, 11 tests passed | `packages/shadcn-studio-v2/src/__tests__` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: TypeScript config resolves with no emit | `packages/shadcn-studio-v2/tsconfig.json` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Legacy names remain embedded in non-surface files | Medium / High | Taxonomy gate walks `src` and rejects forbidden structural names | V2 migration squad | Mitigated |

## 8) Open questions / assumptions

- `__tests__` exception usage is verified by taxonomy tests as a test harness convention, not architecture.
- No package-specific exception is required for Slice 0 completion.

## 9) Exit checklist

- Verified: in-scope scaffold drift remediated for root names, forbidden names, aliases, and config resolution.
- Verified: `Gate A`, `Gate B`, and `Gate E` evidence captured.
- Verified: no component, CSS, view, metadata, or migration behavior added.
- Verified: ROADMAP tracking row advanced to `verified`.
- Verified: handoff report prepared for Slice 0 closure.

## 10) Handoff summary

- Completion recommendation: `Go for Slice 0.5 boundary verification`
- Blocker: `None`
- Next slice dependency to start: `Slice 0.5`
