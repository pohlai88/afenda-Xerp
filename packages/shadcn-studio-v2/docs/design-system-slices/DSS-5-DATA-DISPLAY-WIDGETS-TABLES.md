# DSS-5 — Data Display, Widgets, Charts, and Tables

## Slice metadata

| Field | Value |
| --- | --- |
| Slice ID | `DSS-5` |
| Name | Data display, widgets, charts, and tables |
| Primary owner | V2 data-surface maintainer |
| Claim target | `component-ready` for reusable data surfaces |
| Depends on | `DSS-1`, `DSS-3`, `DSS-4` where shell composition is involved |
| Output status | data surfaces are readable, accessible, and token-safe |

## Purpose

Implement ERP data-display patterns that support operator decisions instead of decorative dashboard output.

This slice covers metric widgets, summary blocks, charts, and table-heavy surfaces.

## In scope

- `views/widgets/*`
- `views/datatables/*` after taxonomy-confirmed implementation need.
- Table primitive behavior that blocks data-surface quality.
- Chart token usage through `chart-1` to `chart-5`.

## Out of scope

- Analytics engine selection.
- Business calculations.
- Database queries.
- Custom chart token families.
- Decorative visualizations without labels.

## Required inputs

- `docs/DESIGN-SYSTEM-GUIDELINE.md`
- `docs/TAXONOMY.md`
- `docs/MIGRATION-MAP.md`
- Existing widget/table tests.
- Visual proof target for dense and empty states.

## Implementation tasks

1. Confirm every data surface has a registered taxonomy destination.
2. Confirm data surfaces use canonical tokens and `chart-1` through `chart-5` only.
3. Confirm numbers use tabular or mono treatment where comparison matters.
4. Confirm charts include labels, tooltips, legends, or adjacent text.
5. Confirm tables include loading, empty, error, focus, pagination, and filtering behavior where applicable.
6. Confirm color is not the only information channel.
7. Confirm no business logic enters V2 presentation components.

## Evidence required

- Data-surface checklist for default, dense, empty, loading, and error states.
- Chart semantic labeling proof.
- Table keyboard/focus proof where table behavior is interactive.
- Drift guard proof for no hardcoded hex or token sprawl.

## Acceptance gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

## Failure modes

- Chart meaning depends only on color.
- Widget displays a number without label/context.
- Data table lacks empty/error state.
- V2 component owns ERP calculation logic.
- New chart colors bypass canonical chart tokens.

## Completion handoff

Record:

- Data surfaces reviewed:
- Chart token proof:
- Table state proof:
- Accessibility proof:
- Visual/story/test proof:
- Business-logic boundary proof:
- Commands run:
- Claim level reached:
- Remaining blockers:
