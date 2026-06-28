# `@afenda/metadata-ui`

**Architecture layer:** Metadata (rank 3)  
**Lifecycle:** Active  
**Registry ID:** PKG-012  
**Runtime depends on:** `@afenda/ui-composition` only

## What this package is

`@afenda/metadata-ui` is the **Metadata UI implementation layer**. It consumes governed contracts from `@afenda/ui-composition` and implements renderers, surfaces, layouts, sections, states, diagnostics, and registry resolution.

This package is **implementation**, not authority. Vocabulary and governance live in `@afenda/ui-composition`.

## Monorepo rules

| Rule | Status |
| --- | --- |
| Import via package name only (`@afenda/ui-composition`, not deep paths) | Enforced in source |
| Public surface is `index.ts`, `client.ts`, `server.ts` only | `package.json#exports` |
| No imports from `@afenda/appshell`, `@afenda/permissions`, `@afenda/database` | `runtime.contract.ts` |
| Internal deps use `workspace:*` | `package.json` |
| Layer: Metadata — may import Platform + Design only when declared | Currently `@afenda/ui-composition` only |

Verification:

```bash
pnpm --filter @afenda/metadata-ui test:run
pnpm --filter @afenda/architecture-authority test:run
```

## Relationship to `@afenda/ui-composition`

```
@afenda/ui-composition ──▶ @afenda/metadata-ui
  (vocabulary)         (rendering implementation)
```

Do not merge the packages. Do not redefine governed metadata arrays locally.

## Entry points

| Import path | Purpose |
| --- | --- |
| `@afenda/metadata-ui` | Shared kernel: contracts, runtime, registry, renderers, fixtures |
| `@afenda/metadata-ui/client` | Interactive components, diagnostics UI, client fixtures |
| `@afenda/metadata-ui/server` | RSC-safe surfaces, layouts, sections, states |

### Action handling: server vs client

**`@afenda/metadata-ui/server`** — surfaces render **static action chrome** for RSC. Link actions use `href`; button actions render without click handlers.

**`@afenda/metadata-ui/client`** — use `MetadataActionBar` with `onAction` for interactive button/destructive actions. Wire `onActionResult` to surface `{ ok: false, code, userMessage }` from your Server Action — metadata-ui never executes server actions or permission checks.

```tsx
import { MetadataPageSurface } from "@afenda/metadata-ui/server";

"use client";
import { MetadataActionBar } from "@afenda/metadata-ui/client";
import {
  createMetadataActionFailure,
  type MetadataActionHandler,
} from "@afenda/metadata-ui";
import { deleteOrderAction } from "@/app/actions/orders";

const handleAction: MetadataActionHandler = async (action, context) => {
  if (action.key === "delete-order") {
    return deleteOrderAction({ orderId: context.targetId ?? "" });
  }
  return createMetadataActionFailure(
    action.key,
    "NOT_FOUND",
    "Unknown action."
  );
};

export function OrdersActionBar({ actions, orderId }) {
  return (
    <MetadataActionBar
      actions={actions}
      onAction={(action, ctx) =>
        handleAction(action, { ...ctx, targetId: orderId })
      }
      onActionResult={(result) => {
        if (!result.ok) {
          // toast, inline alert, etc.
        }
      }}
    />
  );
}
```

Server Actions invoked from `onAction` must follow the server-action-security checklist: re-verify session inside the action, validate with Zod, check resource ownership, return shaped `{ ok, code, userMessage }`, never throw to the client.

## Public API (current)

### Package contract

```typescript
import { metadataUiContract, PACKAGE_NAME } from "@afenda/metadata-ui";
```

### Renderer registry

```typescript
import {
  createMetadataRendererRegistry,
  defaultMetadataRenderers,
  resolveMetadataRenderer,
} from "@afenda/metadata-ui";
```

### Render context and presentation

```typescript
import {
  createMetadataUiRenderContext,
  resolveVisibility,
  resolvePresentationMode,
} from "@afenda/metadata-ui";
```

### Server composition

```typescript
import {
  MetadataPageSurface,
  MetadataLayout,
  ListSection,
  MetadataLoadingState,
} from "@afenda/metadata-ui/server";
```

### Client interactivity

```typescript
import {
  MetadataActionBar,
  MetadataDiagnosticsPanel,
  TabsLayout,
} from "@afenda/metadata-ui/client";
```

## Installation

```bash
pnpm add @afenda/metadata-ui --workspace
```

Import responsive chrome once in the app or Storybook entry CSS:

```css
@import "@afenda/metadata-ui/afenda-metadata-ui.css";
```

Layouts use **container queries** on `.metadata-container` roots — they adapt to their parent width, not only the viewport. Action controls meet **44×44px** touch targets; hover styles apply only under `@media (hover: hover)`.

## Commands

```bash
pnpm --filter @afenda/metadata-ui typecheck
pnpm --filter @afenda/metadata-ui test
pnpm --filter @afenda/metadata-ui build
```

## CSS

**Authority:** `@afenda/metadata-ui` owns all `.metadata-*` structural classes.
**Property namespace:** `--metadata-*` (no `--afenda-*`, `--color-*`, or `--spacing-*` definitions).
**Cascade layer:** `components` — assigned at import via `layer(components)` (file is intentionally unlayered).

Full authority model and decision tree: [docs/architecture/css-authority.md](../../docs/architecture/css-authority.md).
Manifest: `src/styles/css-manifest.ts`. Governance: `pnpm check:css-governance`.

### CSS entrypoints

| Export | Purpose |
|---|---|
| `./styles.css` | Production structural classes (`.metadata-*`) |
| `./fixtures.css` | Storybook/fixture classes (`.metadata-fixture-*`) — **not for app globals** |

### Rules

- All production classes use `.metadata-` prefix.
- Fixture classes (`metadata-fixture-*`) live in `src/fixtures/metadata-ui-fixtures.css` only.
- `styles.css` must not contain any `.metadata-fixture-*` selectors.
- `fixtures.css` is `productionSafe: false` — do not import it in `apps/erp/globals.css`.

## Governance rules

| AI may | AI may not |
| --- | --- |
| Implement renderers consuming `@afenda/ui-composition` contracts | Define new metadata authority domains |
| Register renderers via `createMetadataRendererRegistry` | Redefine governed metadata vocabulary arrays |
| Add fixtures and composition components | Import `@afenda/permissions` or execute permission checks |
| Use `@afenda/ui` when adopted (add explicit `package.json` dependency first) | Rely on hoisted phantom dependencies |
