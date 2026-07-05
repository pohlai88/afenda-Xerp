# Slice 4 Implementation Detail — Layout and Shared Package Parts

## 1) Slice identity

- Slice ID: `Slice 4`
- Slice name: `Layout and shared package parts`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists
- Build reusable shell/chrome and cross-cutting runtime parts outside of page composition.

### Slice-level acceptance criteria
- Reusable chrome in `components/layout/`.
- Non-primitive shared parts in `components/shared/`.
- Controlled `components/assets/` usage for coupled assets.

### V2-only guardrail

Slice 4 execution and verification stay inside `packages/shadcn-studio-v2/**`. Do not repair root governance, legacy studio, ERP, database, or architecture-authority drift while executing this slice unless a release owner explicitly changes scope.

## 3) Scope boundaries

### In scope
- `components/layout/`
- `components/shared/`
- `components/assets/`
- quarantine-to-taxonomy promotion process

### Out of scope
- core primitive additions (Slice 3A/3B)
- composed view logic
- business-domain implementation

### Anti-goals
- Do not let layout contain ERP module-specific behavior.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 3B`
- Dependencies:
  - Primitive baseline and extension must be stable
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate B: naming`
  - `Gate D: export boundary`
  - `Gate E: typecheck and config resolution`

## 5) Implementation plan

### Structure changes
- Normalize folder usage and naming for all reusable non-view chrome.
- Document quarantine entries with source, reason, destination, and promotion condition.
- Restrict page composition from landing in `layout`.
- Keep shared runtime-adjacent behavior on the client boundary only.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: layout/shared tests prove governed slots, token-driven class helpers, accessible icon asset behavior, and client-only shared boundary ownership | `packages/shadcn-studio-v2/src/__tests__/layout-shared.test.tsx` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: layout/shared public contracts resolve | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS: package emits verified layout/shared declarations | `packages/shadcn-studio-v2/dist` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS: layout/shared implementation, tests, and docs are format/lint clean | `packages/shadcn-studio-v2` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| `components/layout/` becomes page-composition storage | Medium / High | Require each layout item to prove reusable chrome purpose before promotion | V2 migration squad | Active |
| quarantine entries lose source or promotion context | Medium / Medium | Require source, reason, destination, and promotion condition in every quarantine record | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: layout parts are reusable chrome, not route-specific page structures.
- Decision needed before verification: confirm whether any component-coupled assets require registry entries.
- Entry blocker: None; Slice 3B verification evidence is attached.
- Decision: Slice 4 must not add new primitive components; primitive expansion remains closed after Slice 3B unless a later amendment creates another primitive slice.
- Decision: Slice 4 must consume Slice 3A/3B primitives instead of redefining button, card, badge, alert, field, or table behavior.
- Decision: Slice 4 layout parts may arrange primitives but must not own primitive variants, field validation, table data state, or alert announcement policy.
- Decision: `ThemeToggle` remains the shared runtime-adjacent helper for Slice 4 and stays client-only.

## 9) Entry readiness review

- Slice 3B handoff: `PASS`
- Entry decision: `READY FOR IMPLEMENTATION`
- Required implementation set after unblock:
  - reusable chrome under `components/layout/`
  - reusable non-primitive runtime parts under `components/shared/`
  - component-coupled assets under `components/assets/`
  - quarantine records for held units
- Required first-pass implementation shape:
  - reusable shell/chrome component
  - shared runtime-adjacent helper component
  - quarantine tracking record if imported/reference work is held back
  - layout/shared governance test before export expansion
- Prohibited implementation:
  - page composition
  - ERP business logic
  - new primitive expansion
  - duplicate primitive wrappers
  - primitive accessibility policy overrides
  - metadata execution
  - route-specific layout behavior

## 10) Prepared Kickoff Sequence

1. Add a layout/shared governance test that locks taxonomy placement and export boundaries.
2. Add the smallest reusable layout chrome component under `components/layout/`.
3. Add the smallest shared runtime-adjacent component under `components/shared/` only if it is not already covered by Slice 2.
4. Export only verified layout/shared symbols through the allowed public surfaces.
5. Keep quarantine records document-only until promotion conditions are explicit.

## 11) Exit checklist

- Verified: `components/layout/`, `components/shared/`, and `components/assets/` contain taxonomy-compliant items only.
- Verified: quarantine policy exists and public entrypoints do not export quarantine.
- Verified: `ThemeToggle` is exposed from `clients.ts` only and remains absent from neutral/server surfaces.
- Verified: scoped package gates are attached and clean.

## 12) Implementation summary

- Added reusable chrome under `components/layout/`: `AppShell`, `Sidebar`, and `Topbar`.
- Kept `ThemeToggle` as the shared runtime-adjacent helper under `components/shared/`.
- Added `IconMark` under `components/assets/` as the component-coupled accessible asset baseline.
- Kept quarantine policy document-only through `components/quarantine/README.md`.
- Exported layout/assets from neutral and client surfaces only where appropriate.

## 13) Post-verification stabilization review

- Review result: `PASS`
- Layout APIs remain presentational and token-driven.
- Shared runtime state ownership remains outside the primitive lane and inside the client boundary.
- Assets remain reusable and accessibility-safe.
- Slice 5 entry condition is satisfied from verified primitive, layout, shared, and asset lanes.
