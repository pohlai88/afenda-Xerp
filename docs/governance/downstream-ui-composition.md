# Downstream UI Composition

Final integration gate for Afenda design authority flowing through ERP composition.

## Authority flow

```txt
@afenda/design-system   → tokens, recipes, CSS variables, visual policy
@afenda/ui              → governed React primitives + recipe slot resolution
@afenda/metadata        → metadata contracts only (no CSS, no React)
@afenda/metadata-ui     → metadata contracts + UI governance consumption
@afenda/appshell        → UI governance consumption for shell chrome
apps/erp                → composes AppShell + Metadata UI + approved CSS
```

Downstream packages **consume** authority. They do not redefine tokens, recipe maps, or density bridges.

## Dependency graph

```txt
@afenda/design-system
  └─ (no Afenda package dependencies)

@afenda/ui
  └─ may depend on @afenda/design-system

@afenda/metadata
  └─ must not depend on ui, metadata-ui, appshell, or design-system

@afenda/metadata-ui
  └─ may depend on @afenda/metadata, @afenda/ui
  └─ must not depend on @afenda/appshell

@afenda/appshell
  └─ may depend on @afenda/ui
  └─ must not depend on @afenda/metadata-ui or @afenda/metadata

apps/erp
  └─ may depend on all packages above
```

Enforced by `pnpm check:downstream-integration`.

## CSS import order

### ERP production globals (`apps/erp/src/app/globals.css`)

Canonical Tailwind v4 order (this repository’s export paths):

```css
@import "tailwindcss";
@import "@afenda/ui/afenda-ui.css";
@import "@afenda/appshell/afenda-appshell.css";
@import "@afenda/metadata-ui/afenda-metadata-ui.css" layer(components);
@import "shadcn/tailwind.css";
```

Rules:

- UI CSS loads before AppShell and Metadata UI.
- AppShell CSS must not import Metadata UI CSS.
- Metadata UI CSS must not import AppShell CSS.
- **Never** import `@afenda/metadata-ui/fixtures.css` or `@afenda/appshell/fixtures.css` in ERP globals.
- **Never** define `--afenda-*` tokens in `apps/erp`.

### Tailwind v4 vs non-theme-safe fallback

If an app cannot use Tailwind v4 `@theme`, use the non-theme-safe fallback export paths documented in each package manifest:

```css
@import "@afenda/ui/styles.css";
@import "@afenda/appshell/styles.css";
@import "@afenda/metadata-ui/styles.css";
```

This monorepo’s ERP app uses the `@theme`-aware `afenda-*.css` entrypoints.

### Composed Storybook stories

Demo-only stories may import fixture CSS **in the story file only**:

```ts
import "@afenda/ui/afenda-ui.css";
import "@afenda/appshell/afenda-appshell.css";
import "@afenda/metadata-ui/afenda-metadata-ui.css";
// optional demo-only:
import "@afenda/metadata-ui/fixtures.css";
```

Story title: `Governance/Composed ERP Shell` (`apps/storybook/stories/governance-integration-composed.stories.tsx`).

## Density bridge rule

| Layer | DOM attribute | Bridge |
|-------|---------------|--------|
| AppShell root | `data-afenda-density` | `densityToAttribute()` via `@afenda/ui/governance` |
| Metadata UI root | `data-metadata-density` | `resolveMetadataUiDensityAttribute()` in metadata-ui wiring |

Metadata runtime density (`compact` | `default` | `comfortable`) stays contract-only in `@afenda/metadata`. ERP and Storybook must use `metadataRuntimeDensityToGovernedDensity()` from `@afenda/metadata-ui/server` when passing density to AppShell — **no local `standard` → `default` maps**.

## Metadata vs Metadata UI boundary

| Concern | Owner |
|---------|--------|
| Runtime context, density modes, presentation contracts | `@afenda/metadata` |
| React renderers, structural CSS, action hierarchy DOM hooks | `@afenda/metadata-ui` |

Metadata UI imports `@afenda/metadata` for contracts and `@afenda/ui/governance` for slot classes. It must not import `@afenda/appshell`.

## AppShell vs Metadata UI boundary

AppShell owns shell chrome (sidebar, header, footer). Metadata UI owns metadata surfaces inside the main content region. Neither package imports the other.

ERP composes both at the app layer:

```txt
ApplicationShell
  └── MetadataPageSurface
        ├── MetadataLayout
        ├── MetadataSection
        ├── MetadataActionBar (via surface actions)
        ├── MetadataState
        └── MetadataDiagnosticsPanel (when diagnostics enabled)
```

## Fixture CSS prohibition in production

Fixture classes (`metadata-fixture-*`, `app-shell-fixture-*`) exist only for Storybook/demo previews. Production ERP globals and integration routes use structural metadata-ui classes only.

## Integration route

Non-production harness: `/governance-integration`

- `robots: noindex`
- Public route (no auth) for local verification
- Static fixture data only — no database, permissions, or server actions
- Proves AppShell + Metadata UI + governed density + action hierarchy hooks

Implementation: `apps/erp/src/components/governance-integration-harness.tsx`

## AppShell chrome vs dashboard canvas

`ApplicationShell` is **chrome authority only** (sidebar, header, command center, empty `<main data-app-shell-content>` slot). It must not import dashboard modules.

Governed dashboard surfaces live under `packages/appshell/src/dashboard/`:

- `ApplicationShellDashboardDemo` — readonly canvas
- `ApplicationShellDashboardCanvas` — edit/readonly grid with versioned layout, widget registry, and capability resolution
- Protected ERP home (`/`) — primary workspace dashboard via `ProtectedWorkspaceDashboard` inside `AppShellMain`; layout edit mode when the actor has `workspace.dashboard_write`
- Dev harness: `/appshell-canvas` (layout editing, RBAC preview toggles, reset). `/appshell-demo` redirects here (legacy alias).

Protected home loads layout from `GET /api/internal/v1/workspace/dashboard-layout` and persists changes with `PUT` when edit mode is enabled server-side.

## Final acceptance gates

```bash
pnpm check:css-governance
pnpm check:downstream-integration
pnpm --filter @afenda/design-system typecheck test build
pnpm --filter @afenda/ui typecheck test build check:governance
pnpm --filter @afenda/metadata typecheck test build
pnpm --filter @afenda/metadata-ui typecheck test build
pnpm --filter @afenda/appshell typecheck test build
pnpm --filter @afenda/erp typecheck test build
pnpm typecheck
pnpm test:run
pnpm build
pnpm quality
```

All gates must pass before building real ERP feature pages on this composition stack.
