# Slice 6 Implementation Detail — Metadata Lane

## 1) Slice identity

- Slice ID: `Slice 6`
- Slice name: `Metadata lane`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
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
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: metadata tests prove JSON-safe descriptors, deterministic builders, runtime validation gates, registry serializability, and metadata boundary isolation | `packages/shadcn-studio-v2/src/__tests__/metadata-lane.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: metadata contracts, builders, gates, and registry declarations resolve | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS: package emits verified metadata declarations | `packages/shadcn-studio-v2/dist` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS: metadata implementation, tests, and docs are format/lint clean | `packages/shadcn-studio-v2` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| metadata contracts become generic package utilities | Medium / High | Review each metadata export for metadata-only purpose before merge | V2 migration squad | Active |
| metadata builders leak runtime UI assumptions | Low / Medium | Keep builders contract-focused and validate through metadata binding check | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: metadata remains isolated behind `metadata.ts`.
- Decision: the first metadata registry set is limited to auth, page, and widget view ownership.

## 9) Implementation summary

- Added explicit metadata contracts for auth, page, and widget descriptors.
- Added deterministic metadata builders returning plain serializable objects.
- Added runtime validation gates for known metadata shapes.
- Added metadata lane registry entries for `auth`, `page`, and `widget`.
- Kept `metadata.ts` isolated from React, components, and views.

## 10) Exit checklist

- Verified: metadata folders and contracts are complete and aligned.
- Verified: `metadata.ts` includes metadata symbols only.
- Verified: metadata lane is isolated before public API hardening.

## 11) Post-verification stabilization review

- Review result: `PASS`
- Metadata descriptors remain JSON-safe and serialization-stable.
- Builders remain deterministic and contract-scoped.
- Validation gates reject unknown metadata shapes without importing UI concerns.
- Slice 7 entry condition is satisfied from verified metadata isolation.

## 12) Slice 7 Preparation Note

- Slice 7 may harden `index.ts`, `clients.ts`, `server.ts`, and `metadata.ts` only.
- Slice 7 must not add new features or use public boundary changes as a path to widen package scope.
- Boundary proof must stay package-local and explicit by surface.
