# Bridging-R Evidence Record

## Scope

- Consumer: `@afenda/developer`
- Bounded surface: `/dashboard/sales`
- Evidence date: `2026-07-05`
- Bridge outcome: `Bridging-R` cleared for one bounded real consumer surface

## Ownership record

| Role | Record | Source |
| --- | --- | --- |
| Owner of record | `@afenda/developer` route-lab owner | `PAS-006E` boundary: `@afenda/developer` owns route lab pages, lab loaders, static fixtures, nav/theme config |
| Validation owner | `@afenda/developer` route-lab owner | consumer-owned scripts and Playwright runtime proof in `apps/developer` |
| Rollback owner | `@afenda/developer` route-lab owner | rollback is bounded to the same consumer-owned import surface |
| Release owner | `Architecture Authority` | `ADR-0039` owner |

## Approval record

`Architecture Authority` approves `Phase R` start for the bounded consumer
surface `@afenda/developer` -> `/dashboard/sales` after review of the evidence
below on `2026-07-05`.

Scope protection:

- approval applies to the bounded route-lab surface only
- ERP consumer mutation remains out of scope
- legacy deletion remains out of scope until post-cutover review

## Technical evidence

| Evidence field | Artifact / command | Result |
| --- | --- | --- |
| Public export proof | `packages/shadcn-studio-v2/package.json` exports `.`, `./theme`, and `./shadcn-default.css` | `verified` |
| Package proof | `pnpm --filter @afenda/shadcn-studio-v2 test` | `passed` |
| Package proof | `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | `passed` |
| Package proof | `pnpm --filter @afenda/shadcn-studio-v2 build` | `passed` |
| Package proof | `pnpm exec biome ci packages/shadcn-studio-v2` | `passed` |
| Consumer clean-state proof | `pnpm --filter @afenda/developer clean` | `passed` |
| Consumer typecheck proof | `pnpm --filter @afenda/developer typecheck` | `passed` |
| Consumer build proof | `pnpm --filter @afenda/developer build` | `passed` |
| Consumer runtime proof | `$env:PLAYWRIGHT_PORT='3006'; pnpm --filter @afenda/developer test:e2e:smoke` | `passed` |
| Consumer cutover proof | `$env:PLAYWRIGHT_PORT='3004'; pnpm --filter @afenda/developer test:e2e:cutover:sales` | `passed` |
| Visual proof | [br-6-sales-route-cutover.png](/C:/JackProject/afenda-bolt/afenda-Xerp/packages/shadcn-studio-v2/docs/bridging-r/evidence/br-6-sales-route-cutover.png) | `captured` |

## Consumer contract evidence

| Contract | Live proof |
| --- | --- |
| Theme runtime | `apps/developer/src/app/layout.tsx` imports `@afenda/shadcn-studio-v2/theme` |
| CSS entrypoint | `apps/developer/src/app/globals.css` imports `@afenda/shadcn-studio-v2/shadcn-default.css` |
| Shell contract | `apps/developer/src/app/(lab)/_components/lab-shell.client.tsx` imports `AdmincnShell` and shell wire types from V2 |
| Sales route surface | `apps/developer/src/app/(lab)/dashboard/sales/page.tsx` and `_components/sales-overview-panel.tsx` import `Card`, `StatisticsRevenueCardBlock`, and `StatisticsSalesOverviewCardBlock` from V2 |

CSS order verified in `apps/developer/src/app/globals.css`:

`tailwindcss` -> `tw-animate-css` -> `shadcn/tailwind.css` ->
`@afenda/shadcn-studio-v2/shadcn-default.css`

## Accessibility and visual proof

`apps/developer/src/app/__tests__/sales-route-cutover.spec.ts` verifies:

- page-level `h1` visibility for `/dashboard/sales`
- shell `h2` visibility for `Afenda Route Lab`
- primary navigation landmark visibility
- canonical route marker and promotion-note content
- non-empty CSS variable resolution for `--background`, `--card`, and
  `--sidebar`

The same test writes the route screenshot artifact:

- [br-6-sales-route-cutover.png](/C:/JackProject/afenda-bolt/afenda-Xerp/packages/shadcn-studio-v2/docs/bridging-r/evidence/br-6-sales-route-cutover.png)

## Rollback verification

Rollback is explicitly verified as bounded and reversible because only the
following consumer touchpoints moved to V2:

- `apps/developer/src/app/layout.tsx`
- `apps/developer/src/app/globals.css`
- `apps/developer/src/config/nav-config.ts`
- `apps/developer/src/lib/lab/contracts.ts`
- `apps/developer/src/app/(lab)/_components/lab-shell.client.tsx`
- `apps/developer/src/app/(lab)/dashboard/sales/page.tsx`
- `apps/developer/src/app/(lab)/dashboard/sales/_components/sales-overview-panel.tsx`

Legacy `@afenda/shadcn-studio` imports remain available in the same app for
non-selected surfaces, which preserves a direct rollback target without ERP
mutation.

Rollback command set:

1. restore the listed files to legacy `@afenda/shadcn-studio` import paths
2. run `pnpm --filter @afenda/developer clean`
3. run `pnpm --filter @afenda/developer typecheck`
4. run `pnpm --filter @afenda/developer build`
5. run `$env:PLAYWRIGHT_PORT='<fresh-port>'; pnpm --filter @afenda/developer test:e2e:smoke`
