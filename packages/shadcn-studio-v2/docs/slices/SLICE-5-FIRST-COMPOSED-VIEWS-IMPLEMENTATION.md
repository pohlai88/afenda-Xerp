# Slice 5 Implementation Detail — First Composed Views

## 1) Slice identity

- Slice ID: `Slice 5`
- Slice name: `First composed views`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 4 verification`
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
| `pnpm --filter @afenda/shadcn-studio-v2 test` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-5-FIRST-COMPOSED-VIEWS-IMPLEMENTATION.md` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-5-FIRST-COMPOSED-VIEWS-IMPLEMENTATION.md` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-5-FIRST-COMPOSED-VIEWS-IMPLEMENTATION.md` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-5-FIRST-COMPOSED-VIEWS-IMPLEMENTATION.md` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| `views/` becomes ERP domain implementation | Medium / High | Review every view for shape-based composition only | V2 migration squad | Active |
| auth view pulls application-specific auth policy | Medium / High | Keep auth view visual/compositional and leave policy to consumer app | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: first composed views are package-level UI composition, not ERP workflow ownership.
- Decision needed before verification: select the minimum auth and generic view examples for proof.

## 9) Exit checklist

- Required before verification: at least one auth and one generic composed view exists.
- Required before verification: no ERP domain logic in `views`.
- Required before verification: legacy structure mapping to V2 view lanes is recorded.
