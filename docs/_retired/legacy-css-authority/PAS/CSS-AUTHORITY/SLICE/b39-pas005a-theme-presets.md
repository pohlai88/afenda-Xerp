# Slice B39 — Theme Presets + ThemeCustomizer (PAS-005A §4.2—§4.3)

**Prerequisite:** B38 delivered — `@afenda/shadcn-studio` package scaffold exists; MCP cwd retargeted

**Status:** Delivered (2026-06-28)

**Type:** Implementation

**Risk class:** Medium — client runtime + React dependencies in standalone package

**Clean Core impact:** AÔåÆA — presentation runtime only; no Afenda imports

## Purpose

Port the admin-template theme preset system into `@afenda/shadcn-studio`: `theme-presets.ts` (12 named presets + `default`), `theme-config.ts`, `settings-context.tsx` (preset application on `<html>`), and `ThemeCustomizer.tsx`. Reference pattern from `_reference/shadcn-nextjs-admincn-admin-template-1.0.0/` — read-only; do not import `_reference` at runtime.

## Handoff block

```
Handoff from: docs/PAS/CSS-AUTHORITY/SLICE/b39-pas005a-theme-presets.md

1. Objective    — Port 12 theme presets + default, SettingsProvider preset application, and ThemeCustomizer UI into @afenda/shadcn-studio with typed preset slugs and fail-closed invalid slug handling.
2. Allowed layer— packages/shadcn-studio/** · docs/PAS/CSS-AUTHORITY/SLICE/b39-pas005a-theme-presets.md · docs/PAS/pas-status-index.md · docs/PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md (runtime_status sync)
3. Files        —
   packages/shadcn-studio/package.json
   packages/shadcn-studio/src/theme/theme-presets.ts
   packages/shadcn-studio/src/theme/theme-config.ts
   packages/shadcn-studio/src/theme/theme-preset.contract.ts
   packages/shadcn-studio/src/theme/settings-context.tsx
   packages/shadcn-studio/src/theme/ThemeCustomizer.tsx
   packages/shadcn-studio/src/index.ts
   packages/shadcn-studio/src/__tests__/theme-presets.test.ts
   packages/shadcn-studio/src/__tests__/theme-preset-runtime.test.tsx
   docs/PAS/CSS-AUTHORITY/SLICE/b39-pas005a-theme-presets.md
   docs/PAS/pas-status-index.md
4. Prohibited   — @afenda/css-authority; @afenda/ui; @afenda/appshell; apps/erp; _reference runtime imports; packages/appshell/src/shadcn-studio/** migration
5. Authority    — PAS-005A §4.2 · §4.3 · §8 · ADR-0017
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
   pnpm --filter @afenda/shadcn-studio build
   pnpm quality:boundaries
7. Closes       — PAS-005A theme preset surface Target ÔåÆ Current; B39 proposed ÔåÆ delivered
8. Evidence     —
   packages/shadcn-studio/src/theme/theme-presets.ts
   packages/shadcn-studio/src/theme/settings-context.tsx
   packages/shadcn-studio/src/__tests__/theme-presets.test.ts
9. Attestation  — Contract · Runtime · Test · Documentation
```

## Rules frozen

1. Preset slugs are `as const` union — no free-form strings in public API
2. `default` preset removes inline overrides; named presets inject full maps
3. Invalid preset slug rejects — no silent fallback to `default` unless caller explicitly selects `default`
4. Phase 1 remains Afenda-free

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | 12 presets + default exported with typed slugs | `pnpm --filter @afenda/shadcn-studio test:run` |
| 2 | SettingsProvider applies/removes CSS vars | `theme-preset-runtime.test.tsx` |
| 3 | ThemeCustomizer renders without Afenda imports | typecheck |
| 4 | Boundary gate passes | `pnpm quality:boundaries` |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Theme preset registry | Yes — Slice B39 | `packages/shadcn-studio/src/theme/theme-presets.ts` |
| Runtime preset application | Yes — Slice B39 | `packages/shadcn-studio/src/theme/settings-context.tsx` |
