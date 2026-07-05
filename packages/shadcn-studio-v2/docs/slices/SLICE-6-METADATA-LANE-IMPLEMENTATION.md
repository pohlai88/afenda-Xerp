# Slice 6 Implementation Detail — Metadata Lane

## 1) Slice identity

- Slice ID: `Slice 6`
- Slice name: `Metadata lane`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 5 verification`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists
- Keep metadata as a first-class isolated lane with explicit exports and minimal cross-boundary bleed.

### Slice-level acceptance criteria
- Folders under `metadata/` and exports in `metadata.ts` are complete and isolated.
- Metadata contracts/stores do not become general utility plumbing.

## V2-only guardrail

V2-local verification only. Do not run or repair root governance, legacy studio, ERP, database, or architecture-authority gates during this slice.
## 3) Scope boundaries

### In scope
- `metadata/builders/`
- `metadata/contracts/`
- `metadata/gates/`
- `metadata/registries/`
- `metadata.ts` boundary exports

### Out of scope
- views and primitive implementation
- core export map work beyond metadata surface

### Anti-goals
- Do not move unrelated package utility logic into metadata contracts/gates.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 5`
- Dependencies:
  - first composed views are in place
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate B: naming`
  - `Gate D (metadata boundary)`

## 5) Implementation plan

### Structure changes
- Build metadata contracts and registries in V2 lane names.
- Keep runtime/builders split from general package utilities.
- Ensure `metadata.ts` exports metadata lane only.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-6-METADATA-LANE-HANDOFF.md` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-6-METADATA-LANE-HANDOFF.md` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-6-METADATA-LANE-HANDOFF.md` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-6-METADATA-LANE-HANDOFF.md` |
## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| metadata contracts become generic package utilities | Medium / High | Review each metadata export for metadata-only purpose before merge | V2 migration squad | Active |
| metadata builders leak runtime UI assumptions | Low / Medium | Keep builders contract-focused and validate through metadata binding check | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: metadata remains isolated behind `metadata.ts`.
- Decision needed before verification: confirm which metadata registries are required for the first public API hardening pass.

## 9) Exit checklist

- Required before verification: metadata folders and contracts are complete and aligned.
- Required before verification: `metadata.ts` includes only metadata symbols.
- Required before verification: metadata lane verified before public API hardening.
