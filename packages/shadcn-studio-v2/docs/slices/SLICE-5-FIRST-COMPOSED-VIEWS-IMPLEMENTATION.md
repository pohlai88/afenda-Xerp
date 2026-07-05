# Slice 5 Implementation Detail — First Composed Views

## 1) Slice identity

- Slice ID: `Slice 5`
- Slice name: `First composed views`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists
- Prove V2 composition model using shape-based view taxonomy without embedding ERP business logic.

### Slice-level acceptance criteria
- `views/auth`, `views/pages`, `views/widgets` established.
- Composition law implemented repeatedly from primitives → layout/shared/metadata helpers → views.

## 3) Scope boundaries

### In scope
- `views/auth`
- `views/pages`
- `views/widgets`
- metadata-assisted composition helpers only where needed

### Out of scope
- domain/business workflow implementation
- package API hardening
- migration execution planning

### Anti-goals
- No ERP domain services inside `views/`.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 4`
- Dependencies:
  - `components/ui/` baseline and extension available
  - layout and shared package parts verified
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate B: naming`
  - `Gate D: export boundary`
  - `Gate E: typecheck and config resolution`
  - V2-local verification only; do not run or repair root architecture, legacy studio, ERP, database, or architecture-authority gates during this slice.

## 5) Implementation plan

### Structure changes
- Compose at shape-level, not module-logic level.
- Translate legacy structures:
  - `components-auth-shell` → `views/auth`
  - `components-layouts` → `views/*` as applicable

### Export and boundary work
- Keep `views/` from becoming module-specific or business-specific.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: composed-view tests prove auth, page, and widget lanes render through governed slots without business policy | `packages/shadcn-studio-v2/src/__tests__/composed-views.test.tsx` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: composed-view public contracts resolve | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS: package emits verified view declarations | `packages/shadcn-studio-v2/dist` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS: view implementation, tests, and docs are format/lint clean | `packages/shadcn-studio-v2` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| `views/` becomes ERP domain implementation | Medium / High | Review every view for shape-based composition only | V2 migration squad | Active |
| auth view pulls application-specific auth policy | Medium / High | Keep auth view visual/compositional and leave policy to consumer app | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: first composed views are package-level UI composition, not ERP workflow ownership.
- Decision: the minimum proof set is `AuthShell`, `PageSurface`, and `MetricWidget`.

## 9) Implementation summary

- Added `views/auth/AuthShell.tsx` as the generic auth composition surface.
- Added `views/pages/PageSurface.tsx` as the reusable page composition baseline.
- Added `views/widgets/MetricWidget.tsx` as the first widget composition surface.
- Kept view APIs shape-based and presentational only.
- Exported verified views through neutral and client public surfaces only.

## 10) Exit checklist

- Verified: at least one auth and one generic composed view exists.
- Verified: no ERP domain logic exists in `views`.
- Verified: legacy structure mapping to V2 view lanes is recorded by roadmap and migration map alignment tests.

## 11) Post-verification stabilization review

- Review result: `PASS`
- `AuthShell` remains visual/compositional and owns no auth policy.
- `PageSurface` composes layout parts without introducing route-specific logic.
- `MetricWidget` stays token-driven and presentational.
- Slice 6 entry condition is satisfied from verified primitive, layout/shared, and first composed view lanes.

## 12) Slice 6 Preparation Note

- Slice 6 may start with metadata-only contracts, registries, gates, and builders under `metadata/`.
- Slice 6 must not move view, layout, primitive, ERP workflow, or general utility logic into `metadata/`.
- `metadata.ts` must stay isolated from root, client, and server React surfaces.
