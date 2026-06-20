# TIP-UI-04 — Metadata-UI Renderers

Status: **Not started**

## Purpose

Implement actual React renderers in `@afenda/metadata-ui`. Today the package exports contracts, registries, and schema validators only — no UI. This TIP delivers metadata-driven ERP surfaces.

## Scope

**In scope**

- `ListSurfaceRenderer` — data table from column metadata
- `FormSurfaceRenderer` — form from field metadata
- `PanelSurfaceRenderer` — read-only detail panel
- `ActionBarRenderer` — permission-scoped action buttons
- Wire renderers to `@afenda/ui` components and `@afenda/metadata` contracts
- Register renderers in `defaultMetadataRenderers`

**Out of scope**

- Business domain data fetching
- Permission engine (TIP-010) — renderers accept visibility resolution as input
- Accounting / inventory logic

## Depends on

- TIP-005 Metadata Authority
- TIP-UI-02 Component Library

## Blocks

- TIP-UI-05 ERP App Surfaces (metadata-driven pages)
- TIP-022 Dashboard v1 (Phase 2)

## Package boundaries

```text
@afenda/metadata        ← authority contracts (no React)
@afenda/ui              ← primitives (Button, Table, Form, Card)
@afenda/metadata-ui     ← renderers (this TIP)
apps/erp                ← consumes renderers; no renderer logic in app
```

## TypeScript requirements

- Renderer props: explicit interfaces referencing metadata contract types
- No `any` in renderer resolution pipeline
- Serializable metadata input; React nodes only in renderer output layer
- Permission visibility passed in — renderers do not call auth directly

## Deliverables (planned)

```text
packages/metadata-ui/src/renderers/
  list-surface-renderer.tsx
  form-surface-renderer.tsx
  panel-surface-renderer.tsx
  action-bar-renderer.tsx
  index.ts
```

## Acceptance criteria

```gherkin
GIVEN a governed MetadataSurfaceContract for a list view
WHEN ListSurfaceRenderer renders with sample data
THEN columns match metadata definitions
AND actions respect MetadataVisibilityResolution input
AND components come from @afenda/ui only
```

## Verdict

Not started — contracts exist; zero React renderer implementations.
