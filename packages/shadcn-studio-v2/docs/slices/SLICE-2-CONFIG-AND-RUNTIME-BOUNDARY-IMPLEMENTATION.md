# Slice 2 Implementation Detail — Config and Runtime Boundary

## 1) Slice identity

- Slice ID: `Slice 2`
- Slice name: `Config and runtime boundary`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 1 verification`
- Actual completion date: `Not completed`
- Current status: `in-progress`

## 2) Strategic objective

### Why this slice exists
- Separate static configuration from React runtime state/providers before introducing broader behavior.

### Slice-level acceptance criteria
- `configs/` contains environment-neutral static config.
- `contexts/`, `hooks/`, and `components/shared/` hold runtime concerns.
- Legacy runtime concepts are translated into explicit V2 files.

## 3) Scope boundaries

### In scope
- `configs/theme-config.ts`
- `configs/studio-config.ts`
- `contexts/ThemeProvider.tsx`
- `components/shared/ThemeToggle.tsx`
- `hooks/use-theme.ts`

### Out of scope
- primitive/component implementation
- import surface migration
- legacy package consumption changes

### Anti-goals
- No React runtime behavior in static config files.
- No non-theme runtime providers in `configs/`.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 1`
- Dependencies:
  - V2 theme boundaries and export scaffolding remain stable
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate B: naming`
  - `Gate D: export boundary`
  - `Gate E: typecheck and config resolution`

## 5) Implementation plan

### Structure changes
- Introduce or normalize explicit theme/studio config files under `configs`.
- Keep context/provider code in `contexts` and hook usage in `hooks`.
- Consolidate legacy theme-runtime translation points into explicit V2 equivalents.

### Export and boundary work
- Ensure no React provider or hook is exported through config-only surfaces.

## 6) Test and verification commands

- `pnpm quality:boundaries`
- `pnpm quality:exports`
- `pnpm quality:architecture`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm quality:boundaries` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-2-CONFIG-AND-RUNTIME-BOUNDARY-IMPLEMENTATION.md` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Runtime concerns mistakenly remain in config files | Medium / High | Folder-level ownership checks before merge | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: `configs/` remains environment-neutral through this slice.
- Assumption: theme runtime behavior is represented only by provider, hook, and shared component files.
- Decision needed before verification: confirm whether `ThemeToggle` is public API or internal shared helper.

## 9) Exit checklist

- Required before verification: config/runtime separation implemented with file-level ownership.
- Required before verification: legacy runtime concepts mapped to explicit V2 equivalents.
- Required before verification: required gates evidence attached and clean.
