# DSS-1 — CSS Token and Named-Theme Proof

## Slice metadata

| Field | Value |
| --- | --- |
| Slice ID | `DSS-1` |
| Name | CSS token and named-theme proof |
| Primary owner | V2 design-system maintainer |
| Claim target | `component-ready` for CSS/theme surface |
| Depends on | `DSS-0`, `TAXONOMY.md`, package CSS exports |
| Output status | token-safe CSS and theme proof |

## Purpose

Prove that the CSS layer is stable, canonical, and export-safe before component or consumer work depends on it.

This slice keeps Tailwind v4 and shadcn tokens as the only design-token language in V2.

## In scope

- `src/styles/shadcn-default.css`
- `src/styles/swiss-noir.css`
- `src/styles/verdant-noir.css`
- Package CSS exports in `package.json`.
- Theme behavior evidence for default, Swiss Noir, and Verdant Noir.

## Out of scope

- New named themes.
- New token families.
- Component selector styling inside theme files.
- Consumer-specific CSS overrides.
- Legacy `packages/shadcn-studio` CSS cleanup.

## Required inputs

- `docs/DESIGN-SYSTEM-GUIDELINE.md`
- `docs/TAXONOMY.md`
- `package.json`
- `src/styles/*.css`
- `src/__tests__/style-governance.test.ts`

## Implementation tasks

1. Confirm `shadcn-default.css` owns canonical base tokens.
2. Confirm named theme files are scoped and additive only.
3. Confirm theme files do not define `:root`, `.dark`, component selectors, layout selectors, or route selectors.
4. Confirm package exports expose only approved CSS entrypoints.
5. Confirm no forbidden token families exist.
6. Confirm no future candidate theme file exists.
7. Add or update tests only when current tests do not prove a rule.

## Evidence required

- Token family review result.
- Theme selector review result.
- Package export review result.
- `check:drift` pass.
- Style governance test pass.
- Build pass showing CSS files copy into `dist`.

## Acceptance gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

## Failure modes

- Adding `--brand-*`, `--afenda-*`, `--surface-*`, or `--luxury-*`.
- Adding `ledger-noir.css` or another candidate theme file without promotion proof.
- Styling components inside theme CSS.
- Importing CSS from `src/styles/*` in a consumer.

## Completion handoff

Record:

- CSS files reviewed:
- Token violations found:
- Theme selectors reviewed:
- Package exports reviewed:
- Tests updated:
- Commands run:
- Claim level reached:
- Remaining blockers:
