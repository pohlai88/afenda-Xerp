# Slice 2 Implementation Detail — Config and Runtime Boundary

## 1) Slice identity

- Slice ID: `Slice 2`
- Slice name: `Config and runtime boundary`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

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
- `types/theme.ts`
- `types/studio.ts`
- root public boundary files for explicit config/runtime exports

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
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: taxonomy, public exports, style governance, and runtime boundary tests pass | `packages/shadcn-studio-v2/src/__tests__/runtime-boundary.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: config/runtime TypeScript resolves | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS: package emits public boundary files | `packages/shadcn-studio-v2/dist` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Runtime concerns mistakenly remain in config files | Medium / High | `runtime-boundary.test.ts` blocks React/browser APIs in `configs/` | V2 migration squad | Mitigated |
| Client runtime leaks into neutral/server exports | Medium / High | `runtime-boundary.test.ts` verifies provider/toggle stay on `clients.ts` only | V2 migration squad | Mitigated |

## 8) Open questions / assumptions

- Assumption: `configs/` remains environment-neutral through this slice.
- Assumption: theme runtime behavior is represented only by provider, hook, and shared component files.
- Decision: `ThemeToggle` is client public API through `clients.ts`, not neutral or server public API.
- Decision: `ThemeProvider` and `useTheme` are client public API through `clients.ts`, not config exports.

## 9) Exit checklist

- Verified: config/runtime separation implemented with file-level ownership.
- Verified: legacy runtime concepts mapped to explicit V2 equivalents.
- Verified: required gates evidence attached and clean.

## 10) Implementation summary

- Static config lives in `configs/theme-config.ts` and `configs/studio-config.ts`.
- Serializable type contracts live in `types/theme.ts` and `types/studio.ts`.
- Client runtime lives in `contexts/ThemeProvider.tsx`, `hooks/use-theme.ts`, and `components/shared/ThemeToggle.tsx`.
- Neutral and server exports expose config/types only.
- Client exports expose `ThemeProvider`, `useTheme`, and `ThemeToggle`.

## 11) Handoff summary

- Completion recommendation: `Go for Slice 3A kickoff`
- Blocker: `None`
- Next slice dependency to start: `Slice 3A`

## 12) Post-verification stabilization review

- Review result: `PASS`
- Config remains static and environment-neutral.
- Runtime state remains in `contexts/`, `hooks/`, and `components/shared/`.
- Neutral and server surfaces remain free from client runtime providers.
- Slice 3A entry condition is satisfied.
