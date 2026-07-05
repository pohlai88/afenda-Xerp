# shadcn-studio-v2 Migration Map

## Purpose

This document records how legacy `packages/shadcn-studio` structure translates into `packages/shadcn-studio-v2`.

Use this file during Slice 8 and Slice 9 work. Do not migrate by memory or by direct folder copying.

## Status Vocabulary

Use only these statuses:

- `pending`
- `approved-for-migration`
- `migrated`
- `pilot-proven`
- `enterprise-accepted`
- `retirement-candidate`
- `replaced`
- `quarantined`
- `retired`
- `blocked`

## Translation Rule

Legacy names are not valid in V2 by default.

Every migrated unit must:

- map into registered V2 taxonomy
- keep the public export boundary intact
- preserve CSS and runtime boundary rules
- prove the destination slice is ready before movement begins

Component migration must also pass `COMPONENT-PRE-MIGRATION.md`.

No V1 component may be copied, moved, rewritten, recreated, exported, or used by
a consumer until a component ledger row exists in this file.

## Migration Table

| Legacy path | V2 destination | Status | Notes |
| --- | --- | --- | --- |
| `components-ui` | `components/ui` | `pilot-proven` | Pilot proves governed primitive consumption through `clients.ts`; enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |
| `components-assets` | `assets` or `components/assets` | `pilot-proven` | Pilot proves component-coupled asset consumption through `IconMark`; enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |
| `components-quarantine` | `components/quarantine` | `quarantined` | Quarantine remains non-public and has V2 README governance. |
| `components-app-shell` | `components/layout` or `views/*` | `pilot-proven` | Pilot proves reusable layout chrome through `PageSurface` and layout components; enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |
| `components-auth-shell` | `views/auth` | `pilot-proven` | Pilot proves auth composition through `AuthShell`; enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |
| `components-layouts` | `views/*` | `pilot-proven` | Pilot proves page/widget view composition by shape; enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |
| `theme-config` | `configs` | `migrated` | Static theme/studio config is available and tested, but enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |
| `theme-runtime` | `contexts` plus `components/shared` plus `hooks` | `pilot-proven` | Pilot proves `ThemeProvider` and `ThemeToggle` through `clients.ts`; enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |
| `meta-contracts` | `metadata/contracts` | `migrated` | JSON-safe metadata contracts exist through `metadata.ts`, but enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |
| `meta-registry` | `metadata/registries` | `migrated` | Slice 6 registry remains metadata-only and serializable, but enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |
| `meta-gates` | `metadata/gates` | `migrated` | Slice 6 gates validate metadata shapes without UI coupling, but enterprise acceptance and `Bridging-R` proof are still required before any `retirement-candidate` status. |

## Component Ledger

Use this table before any component-level movement. Every row must be complete
before status may move from `pending` to `approved-for-migration`.

Allowed classifications:

```txt
primitive
layout
shared
asset
view
quarantine
reference-only
replaced
retired
```

Allowed export intents:

```txt
private-internal
public-neutral
public-client
public-server
public-metadata
css-export
not-exported
```

Allowed statuses:

```txt
pending
approved-for-migration
migrated
pilot-proven
enterprise-accepted
retirement-candidate
quarantined
replaced
retired
blocked
```

Allowed API strategies:

```txt
preserve
narrow
rename
replace
new
```

| V1 path | Purpose | Classification | V2 destination | Action | API strategy | Consumer impact | Export intent | CSS/token dependency | Runtime dependency | Metadata dependency | Reference dependency | A11y concern | Storybook target | Visual proof target | Test target | Rollback note | Enterprise evidence record | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `components-ui/Button.tsx` | Button primitive | `primitive` | `components/ui/Button.tsx` | migrate | `preserve` | existing primitive consumers should not require prop remapping during pilot | `public-client` | canonical shadcn tokens | client-safe interaction only | none | none | keyboard, focus, disabled state | Button stories | default, disabled, loading, focus, theme states | primitive/component migration tests | keep V1 Button until release-owner cutover passes | package-local pilot proof is complete; enterprise cutover proof still pending | `pilot-proven` |
| `components-ui/card.tsx` | Card primitive family used by the route-lab sales route | `primitive` | `components/ui/Card.tsx` | migrate | `preserve` | candidate first-cutover consumer already relies on `Card`, `CardHeader`, `CardTitle`, `CardDescription`, and `CardContent` | `public-client` | canonical shadcn tokens via `shadcn-default.css` | client-safe composition only | none | none | heading order, semantic grouping, contrast | Card stories | developer route-lab `/dashboard/sales` parity | primitive/component migration tests plus route-lab validation | keep V1 Card contract until release-owner retirement review | bounded real-consumer proof exists in `apps/developer` plus `docs/bridging-r/evidence/README.md` | `enterprise-accepted` |
| `components-layouts/statistics-revenue-card.tsx` | Revenue summary block used on the route-lab sales dashboard | `view` | `views/widgets` or equivalent public block export | replace | `preserve` | candidate first-cutover route currently imports `StatisticsRevenueCardBlock` from the legacy root package | `public-client` | canonical shadcn tokens via `shadcn-default.css` | client-safe block composition | none | none | chart labeling and semantic summary text | revenue block stories | developer route-lab `/dashboard/sales` parity | block migration tests plus route-lab validation | keep legacy block export until release-owner retirement review | bounded real-consumer proof exists in `apps/developer` plus `docs/bridging-r/evidence/README.md` | `enterprise-accepted` |
| `components-layouts/statistics-sales-overview-card.tsx` | Sales overview block used on the route-lab sales dashboard | `view` | `views/widgets` or equivalent public block export | replace | `preserve` | candidate first-cutover route currently imports `StatisticsSalesOverviewCardBlock` from the legacy root package | `public-client` | canonical shadcn tokens via `shadcn-default.css` | client-safe block composition | none | none | chart labeling and progress semantics | sales overview stories | developer route-lab `/dashboard/sales` parity | block migration tests plus route-lab validation | keep legacy block export until release-owner retirement review | bounded real-consumer proof exists in `apps/developer` plus `docs/bridging-r/evidence/README.md` | `enterprise-accepted` |
| `components-app-shell/admincn-shell.tsx` | Operator shell chrome used by the route-lab layout | `layout` | `components/layout/AdmincnShell.tsx` | replace | `preserve` | bounded first-cutover consumer now routes shell composition through V2 `AdmincnShell` | `public-client` | canonical shadcn tokens via `shadcn-default.css` | client shell runtime and nav chrome | none | none | nav landmark, theme toggle, shell heading structure | shell stories | route-lab shell parity | layout/shared tests plus route-lab validation | keep legacy shell available for rollback until release-owner retirement review | bounded real-consumer proof exists in `apps/developer` plus `docs/bridging-r/evidence/README.md` | `enterprise-accepted` |
| `components-app-shell/admincn-nav.tsx` | Primary navigation chrome used by the route-lab shell | `layout` | `components/layout/AdmincnNav.tsx` | replace | `preserve` | bounded first-cutover consumer now routes primary navigation through V2 `AdmincnNav` | `public-client` | canonical shadcn tokens via `shadcn-default.css` | client shell navigation runtime | none | none | navigation landmark and active-state semantics | shell stories | route-lab shell parity | layout/shared tests plus route-lab validation | keep legacy navigation surface available for rollback until release-owner retirement review | bounded real-consumer proof exists in `apps/developer` plus `docs/bridging-r/evidence/README.md` | `enterprise-accepted` |
| `meta-contracts/app-shell.contract.ts` | Navigation wire contract used by route-lab shell config | `shared` | `types/studio.ts` or equivalent public contract export | replace | `preserve` | bounded first-cutover consumer now imports `AppShellNavGroupWire` from V2 | `public-client` | none | nav-shell runtime contract | none | none | nav semantics and active-state labeling | shell contract stories | route-lab shell parity | contract tests plus route-lab validation | keep legacy contract import available for rollback until release-owner retirement review | bounded real-consumer proof exists in `apps/developer` plus `docs/bridging-r/evidence/README.md` | `enterprise-accepted` |
| `theme-runtime/theme-runtime.erp-providers.tsx` | Provider surface used by route-lab root layout | `shared` | `contexts/ThemeProvider.tsx` plus `./theme` export or approved equivalent | replace | `preserve` | bounded first-cutover consumer now imports `ErpPresentationProviders` from `@afenda/shadcn-studio-v2/theme` | `public-client` | depends on `shadcn-default.css` ordering | client runtime theme provider | none | none | theme toggle, hydration, and color-scheme behavior | theme/provider stories | route-lab root render parity | runtime/provider tests plus route-lab validation | keep legacy theme runtime contract available for rollback until release-owner retirement review | bounded real-consumer proof exists in `apps/developer` plus `docs/bridging-r/evidence/README.md` | `enterprise-accepted` |
| `styles/shadcn-default.css` | Canonical package CSS contract for route-lab and ERP consumers | `shared` | `src/styles/shadcn-default.css` plus `./shadcn-default.css` export | migrate | `preserve` | bounded first-cutover consumer now imports the V2 package CSS path directly in app globals | `css-export` | source of canonical tokens | none | none | none | token preview stories | route-lab and ERP CSS parity | export/build validation plus consumer CSS verification | keep legacy CSS import path available for rollback until release-owner retirement review | bounded real-consumer proof exists in `apps/developer` plus `docs/bridging-r/evidence/README.md` | `enterprise-accepted` |

## Enterprise Evidence Record

Record this evidence once a component moves beyond package-local migration proof.

```md
## Enterprise Evidence Record

- Package build proof:
- Package typecheck proof:
- Package test proof:
- Biome proof:
- Public export proof:
- Forbidden import proof:
- API compatibility proof:
- Consumer impact proof:
- CSS loading proof:
- Runtime client/server proof:
- Accessibility proof:
- Storybook/visual proof:
- Metadata safety proof:
- Pilot consumer:
- Pilot route/page:
- Rollback proof:
- Release owner:
- Enterprise acceptance status:
```

`retirement-candidate` may be recorded only after the relevant row or lane is
`enterprise-accepted`.

## Update Rule

When a row changes status:

- update the status in this file
- keep the destination aligned with `TAXONOMY.md`
- do not remove the legacy row until retirement proof exists
- do not move component code before the component ledger row exists

## Related Documents

- `ROADMAP.md`
- `TAXONOMY.md`
- `COMPONENT-PRE-MIGRATION.md`
- `../AGENTS.md`
