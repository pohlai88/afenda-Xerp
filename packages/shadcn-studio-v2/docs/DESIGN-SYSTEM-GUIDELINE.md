# Afenda Studio V2 Design System Guideline

## Document mode

- Primary mode: `internal-guide`
- Audience: engineers, design-system maintainers, route-lab owners, and release owners
- Source of truth: local repo authority, `_reference` evidence, shadcn/ui, Tailwind CSS, and Geist guidance
- Lifecycle state: `active`
- Action enabled: implement and review V2 presentation work without creating a second design-system runtime

## Purpose

This document defines the complete production design-system guideline for `@afenda/shadcn-studio-v2`.

It exists to make one thing unambiguous:

```txt
Afenda Studio V2 is an enterprise ERP presentation system.
It may learn from editorial and AdminCN references.
It must not copy their runtime code, token sprawl, or app-only structure.
```

Enterprise quality here means durable visual output, predictable interfaces, accessibility, real cutover proof, and maintainable boundaries. It does not mean a complicated process, broad abstractions, or speculative component factories.

The design-system law is:

```txt
No reference becomes runtime.
No theme creates new token families.
No component becomes public without proof.
No route consumes internals.
No visual idea bypasses taxonomy.
No migration is complete without consumer cutover.
```

## Authority stack

Follow this order when decisions conflict:

1. `docs/TAXONOMY.md` for V2 structure and naming.
2. `docs/ROADMAP.md`, `docs/MIGRATION-MAP.md`, and `docs/COMPONENT-PRE-MIGRATION.md` for migration and cutover sequencing.
3. This guideline for design-system output quality and reference adoption.
4. `_reference/CreateEditorialLayout` as editorial concept evidence only.
5. `_reference/shadcn-nextjs-admincn-admin-template-1.0.0` as AdminCN concept evidence only.
6. shadcn/ui, Tailwind CSS, and Geist guidance for upstream framework behavior.

References are never runtime authority. A useful reference pattern becomes implementation only after taxonomy, migration ledger, export boundary, and consumer proof agree.

## Design direction

The V2 visual direction is:

```txt
quiet enterprise editorial
data-dense ERP operator surfaces
precise Geist typography
shadcn-compatible semantic tokens
AdminCN-grade shell ergonomics
reference-pack traceability
```

Use restraint. The UI should feel serious, legible, and fast under long operator sessions. It should not look like a landing page, theme playground, portfolio template, or decorative dashboard demo.

### Borrow from CreateEditorialLayout

Borrow:

- traceability path: `source reference -> curated artifact -> studio target -> Storybook target -> ERP consumer`
- editorial hierarchy for evidence-heavy reading surfaces
- diagnostic review language for contrast, density, keyboard, focus, and motion
- promotion states: `already-covered`, `ERP-compose-only`, `promote-to-studio`, `reject`

Do not borrow:

- JSX
- CSS
- token names
- primitive names
- runtime folder structure
- reference-only claims as implementation approval

### Borrow from AdminCN

Borrow:

- shell ergonomics: sidebar, header, command menu, user/profile affordances, notification affordances
- compact and full layout modes as product concepts
- collapsible navigation and active route semantics
- dashboard widget density, table-heavy surfaces, charts, form pages, settings pages, auth pages, error pages, and empty states as coverage inventory
- `components.json` posture: shadcn-compatible, TypeScript, RSC-aware, CSS variables enabled, Lucide icons

Do not borrow:

- fake APIs or app route handlers
- cookie-driven theme authority as a V2 default
- theme preset sprawl
- extra token families such as shadow or brand families unless separately governed
- app-only folders such as `apps`, `pages`, `fake-db`, or reference-specific `views/dashboards`

## Token and CSS doctrine

V2 uses canonical shadcn tokens only. Brand identity lives in token values, theme selection, density, and composition, not in new token families.

Canonical token families are:

- surface tokens: `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`
- action tokens: `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`
- structure tokens: `muted`, `muted-foreground`, `border`, `input`, `ring`, `radius`
- chart tokens: `chart-1` through `chart-5`
- shell tokens: `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`

Forbidden token patterns:

- `--brand-*`
- `--afenda-*`
- `--surface-*`
- `--luxury-*`
- near-canonical variants such as `--primary-2`, `--background-alt`, `--card-secondary`, or `--muted-2`
- raw reference palette names copied from AdminCN theme presets

### CSS files

V2 CSS remains intentionally small:

- `src/styles/shadcn-default.css` is the canonical base token layer.
- `src/styles/swiss-noir.css` is an editorial monochrome additive theme.
- `src/styles/verdant-noir.css` is an editorial green-noir additive theme.

Theme files may override only tokens declared by `shadcn-default.css`. They must use scoped selectors such as `[data-theme="swiss-noir"]`; they must not redefine `:root`, `.dark`, component selectors, layout selectors, or app-specific selectors.

Do not rename the active theme layer during Bridging-R or Phase R. `swiss-noir` and `verdant-noir` are the active named themes. Names such as `ledger-noir` are future theme candidates only; they must not become files, exports, or consumer selectors until they pass the theme promotion gate in this document and the taxonomy, migration map, package export, Storybook proof, and consumer proof all agree.

### Consumer import order

Consumers that compose V2 must keep the shadcn/Tailwind import chain stable:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@afenda/shadcn-studio-v2/shadcn-default.css";
```

Named V2 themes are optional additive imports after the base V2 CSS export:

```css
@import "@afenda/shadcn-studio-v2/themes/swiss-noir.css";
@import "@afenda/shadcn-studio-v2/themes/verdant-noir.css";
```

Do not import CSS from V2 internals such as `src/styles/*`. Package-exported CSS entrypoints are the only allowed style imports.

## Typography

The Afenda V2 typography baseline is Geist.

- Geist Sans: UI text, navigation, headings, controls, tables, forms, dialogs.
- Geist Mono: numbers, IDs, timestamps, environment keys, code, short machine-readable metadata, tabular financial values.
- Geist Pixel: not part of V2 ERP runtime unless a later decision limits it to one decorative display moment outside operator workflows.

Rules:

- Use restrained weights: `font-medium` and `font-semibold` should carry most hierarchy.
- Use tabular or mono figures for dense numeric comparison.
- Do not introduce additional font families from AdminCN, editorial references, or design tools.
- Do not use tight negative tracking as a global style. Use `tracking-tight` only where the local component already uses it intentionally.
- Body and table text must remain readable during long sessions; do not optimize density by pushing body text below usable size.

## Layout and density

The default product density is compact but not cramped.

Supported concepts:

- `compact`: default for ERP operator workflows, dashboards, tables, and repeated use.
- `comfortable`: allowed for form-heavy workflows, review pages, empty states, and onboarding-style surfaces.
- `full`: allowed for wide analytic canvases and document review surfaces where horizontal comparison matters.

Rules:

- Prefer stable grid tracks, known min/max widths, and predictable responsive bands.
- Keep page sections unframed; use cards for repeated items, panels, tools, and modals.
- Do not nest cards inside cards unless the inner unit is a true repeated sub-item with its own semantic role.
- Sidebars and headers must preserve navigation landmarks, active state, and keyboard traversal.
- Dense dashboards should prioritize scan order: page title, status/context, primary metrics, work queues, detail panels.
- Data tables must preserve row readability, focus visibility, loading/empty/error states, and keyboard access.

## Component coverage model

V2 must cover production ERP surfaces, not just a route-lab MVP.

Coverage families:

| Family | V2 home | Required quality |
| --- | --- | --- |
| Primitives | `components/ui` | accessible states, token-based styling, stable API |
| Shell chrome | `components/layout` | sidebar, topbar, command/navigation affordances, active state |
| Shared helpers | `components/shared` | reusable runtime-adjacent pieces such as theme controls |
| Auth presentation | `views/auth` | identity-adjacent presentation only; no auth authority |
| Page surfaces | `views/pages` | generic operator page frames and evidence-reading layouts |
| Widgets | `views/widgets` | metric, chart, and summary blocks with semantic labels |
| Data tables | `views/datatables` once approved | filters, search, pagination, density, empty/error/loading states |
| Forms | `views/forms` once approved | labels, validation, grouping, sticky actions where useful |
| Dialogs | `views/dialogs` once approved | focus management, escape routes, destructive confirmation |
| Settings | `views/settings` once approved | grouped settings, clear state, no local token authority |
| Metadata | `metadata/*` | JSON-safe contracts and registries only |

Do not create every folder just because it is listed. Add folders only when `TAXONOMY.md` permits the structure and the implementation slice needs it.

## Interaction, states, and motion

Enterprise polish is state completeness.

Every reusable surface must account for:

- default
- hover
- focus-visible
- pressed or selected
- disabled
- loading
- empty
- error
- permission-denied or unavailable where applicable
- light, dark, and selected named theme behavior

A reusable surface is incomplete if any applicable state above is absent, even when the default screenshot is visually acceptable.

Motion rules:

- Prefer no motion for dense operational views.
- Use subtle transitions for state continuity only.
- Use transform and opacity when motion is needed.
- Keep transition durations in the 150-300ms range.
- Respect `prefers-reduced-motion`.
- Do not use decorative parallax, large animation choreography, animated backgrounds, or motion that delays operator action.

## Accessibility and enterprise quality bar

V2 surfaces are production-ready only when they meet these conditions:

- semantic HTML is preserved
- icon-only controls have labels
- visible labels exist for form controls
- focus rings are visible and token-based
- keyboard navigation works through menus, dialogs, tables, and shell chrome
- color is not the only information channel
- normal text reaches WCAG AA contrast in supported themes
- dense table and metric text remains legible in light and dark modes
- images and meaningful visual evidence have useful alt text
- loading and error states are announced or semantically discoverable when they affect the workflow

## Charts and data display

Charts are supporting evidence, not decoration.

Rules:

- Use `chart-1` through `chart-5` tokens only.
- Provide labels, tooltips, legends, or adjacent text so meaning does not depend on color alone.
- Use Geist Mono or tabular figures for comparable values.
- Prefer simple line, area, bar, progress, and summary charts before complex visualizations.
- Avoid visual effects that obscure exact values, axis labels, or comparison points.

## Public API and import policy

Consumers may import only public V2 entrypoints:

- `@afenda/shadcn-studio-v2`
- `@afenda/shadcn-studio-v2/clients`
- `@afenda/shadcn-studio-v2/server`
- `@afenda/shadcn-studio-v2/metadata`
- `@afenda/shadcn-studio-v2/theme`
- package-exported CSS files

Forbidden:

- deep imports from `components/*`, `views/*`, `contexts/*`, `metadata/*`, or `styles/*`
- imports from `_reference/*`
- imports from legacy `packages/shadcn-studio/src`
- restoring legacy folder names such as `components-ui`, `components-layouts`, `components-auth-shell`, `theme-runtime`, `meta-contracts`, `blocks`, `sections`, `features`, or `domains`

## Reference adoption workflow

Use this workflow when a future contributor wants to borrow an editorial or AdminCN idea:

1. Identify the reference source and the user-facing problem it solves.
2. Classify the idea as `already-covered`, `ERP-compose-only`, `promote-to-studio`, or `reject`.
3. Confirm the target V2 taxonomy location or keep the idea reference-only.
4. Add or update the migration ledger before implementation when a V1 or reference-derived unit is involved.
5. Define Storybook or consumer proof before public export.
6. Implement only through V2 structure and public boundary rules.
7. Validate package gates and one real consumer path before claiming enterprise readiness.

## Hard gates

Use these gates as the non-negotiable review checklist for V2 design-system work. They are intentionally small: each gate blocks drift without creating a second process.

### Theme promotion gate

Before adding any new named theme:

- theme name is recorded in `TAXONOMY.md`
- reason and user-facing problem are recorded
- token override diff is reviewed
- no new token family is introduced
- theme file is scoped and additive only
- Storybook theme-switch proof exists
- one real consumer proof exists
- rollback path is known

If any row is missing, keep the theme as reference-only. Do not create `ledger-noir.css`, `phantom-noir.css`, `executive-noir.css`, `audit-noir.css`, `erp-dark.css`, or similar theme files by taste alone.

### Reference adoption gate

Before borrowing from CreateEditorialLayout, AdminCN, or another reference pack:

- source reference is named
- user-facing problem is stated
- idea is classified as `already-covered`, `ERP-compose-only`, `promote-to-studio`, or `reject`
- V2 taxonomy target is confirmed
- no JSX is copied
- no CSS is copied
- no token is copied
- no folder structure is copied
- Storybook or consumer proof is defined before public export

Reference adoption is translation, not import.

### Public export gate

Before exporting anything from `@afenda/shadcn-studio-v2`:

- exported unit belongs to an allowed taxonomy location
- prop API is stable enough for consumers
- implementation does not import reference code
- implementation does not import legacy `packages/shadcn-studio`
- implementation does not require app-only runtime state
- CSS comes only from package-exported entrypoints
- consumer import path is tested

An internal V2 component can exist without being public. Public export means consumer contract.

### Component completeness gate

Every reusable primitive, shell unit, widget, or view surface must have:

- typed props
- semantic variants only
- slot or structure markers where the local component contract requires them
- accessible name where needed
- focus-visible state
- disabled state
- loading state when action-based
- empty, error, and unavailable states where data or permission can remove the happy path
- light, dark, and named-theme behavior
- no hardcoded hex values
- no copied reference CSS
- no app-specific behavior
- Storybook, Vitest, or real consumer proof

Do not accept a surface that is only a pretty screenshot, only a route-lab demo, only a theme toggle, or only a copied AdminCN/editorial mood.

### Consumer cutover gate

Do not claim production readiness after package tests alone.

| Claim | Required proof |
| --- | --- |
| `implemented` | Package source exists and builds locally. |
| `component-ready` | Storybook or unit proof covers the reusable surface. |
| `package-ready` | Package test, typecheck, build, and Biome gates pass. |
| `consumer-ready` | One real app imports and renders the public V2 entrypoint. |
| `production-ready` | Consumer route, accessibility, rollback, and visual/state proof all pass. |

Legacy retirement is a separate decision. A V2 component or theme proving itself in one consumer route does not authorize broad deletion.

## Production readiness checklist

Before a V2 surface is considered production-ready, confirm:

- the destination is registered in `TAXONOMY.md`
- public exports match the declared intent
- CSS uses canonical tokens only
- no reference code or reference tokens are imported
- Geist typography remains the baseline
- shell, forms, dialogs, tables, and widgets pass the component completeness gate where applicable
- accessibility concerns are reviewed
- Storybook, Vitest, or consumer proof exists
- rollback is known for consumer cutover
- legacy retirement is not implied by migration success

Use this rule for final review:

```txt
If it is not in taxonomy,
not in the migration ledger when migration is involved,
not exported publicly when consumers need it,
not token-safe,
not accessible,
not tested,
and not proven in a consumer route,
then it is not enterprise-ready.
```

## Verification commands

Run these after changing V2 design-system docs, CSS, exports, or components:

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

For real consumer cutover, add the selected consumer gates from `PHASE-R-CONSUMER-CUTOVER-GUIDE.md`.

## Related docs

- `AGENTS.md`
- `docs/TAXONOMY.md`
- `docs/ROADMAP.md`
- `docs/MIGRATION-MAP.md`
- `docs/COMPONENT-PRE-MIGRATION.md`
- `docs/BRIDGING-R-PHASE-R-READINESS.md`
- `docs/PHASE-R-CONSUMER-CUTOVER-GUIDE.md`
- `_reference/CreateEditorialLayout/README.md`
- `_reference/CreateEditorialLayout/reference/08-traceability-registry.md`
- `_reference/shadcn-nextjs-admincn-admin-template-1.0.0/shadcn-nextjs-admincn-admin-template-1.0.0/components.json`
- shadcn/ui theming documentation
- Tailwind CSS v4 `@theme` documentation
- Geist font guidance
