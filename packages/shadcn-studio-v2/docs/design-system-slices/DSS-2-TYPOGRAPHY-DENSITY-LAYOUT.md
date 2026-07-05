# DSS-2 — Typography, Density, and Layout Rules

## Slice metadata

| Field | Value |
| --- | --- |
| Slice ID | `DSS-2` |
| Name | Typography, density, and layout rules |
| Primary owner | V2 design-system maintainer |
| Claim target | `component-ready` for layout rule usage |
| Depends on | `DSS-1`, `DESIGN-SYSTEM-GUIDELINE.md` |
| Output status | layout rules implemented without token drift |

## Purpose

Implement the visual grammar for enterprise ERP surfaces: Geist typography, compact-but-readable density, stable grid behavior, and predictable layout hierarchy.

This slice turns design direction into component and view constraints without creating a new runtime.

## In scope

- Typography use in reusable V2 components and views.
- Density decisions for shell, cards, tables, forms, and widgets.
- Layout stability for grids, panels, and responsive bands.
- Documentation or tests that prove the rules are not accidental.

## Out of scope

- Adding new font families.
- Global CSS typography resets outside the approved CSS surface.
- Marketing hero layouts.
- App-specific layout behavior.
- Visual redesign of unrelated consumers.

## Required inputs

- `docs/DESIGN-SYSTEM-GUIDELINE.md`
- `src/components/**`
- `src/views/**`
- Storybook or visual proof target if the slice changes rendered layout.

## Implementation tasks

1. Confirm Geist Sans remains the UI baseline.
2. Confirm Geist Mono or tabular figures are used for IDs, timestamps, and comparable numbers where applicable.
3. Confirm body, table, and control text remain readable at compact density.
4. Confirm layout uses stable grid tracks, min/max widths, or responsive constraints where dynamic content can shift layout.
5. Confirm page sections are not styled as nested decorative cards.
6. Add evidence for dense, empty, and content-heavy states where layout can break.

## Evidence required

- File-level typography review.
- Density review for every changed component/view.
- Layout stability proof through test, story, screenshot, or documented visual acceptance.
- Accessibility note for readable text and focus order.

## Acceptance gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

## Failure modes

- Importing a reference font.
- Using viewport-scaled font sizes.
- Hiding layout issues with overflow clipping.
- Adding decorative cards around page sections.
- Optimizing density by making body text too small.

## Completion handoff

Record:

- Components/views reviewed:
- Typography decisions:
- Density decisions:
- Layout stability proof:
- Accessibility proof:
- Commands run:
- Claim level reached:
- Remaining blockers:
