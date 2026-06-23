# TIP-UI-04 — Metadata-UI Renderers

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Runtime evidence** | Section renderers, surfaces, layouts, actions — 44+ `.tsx` files |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Remaining gap** | Production ERP pages wired to metadata renderers |

## Purpose

Implement React renderers in `@afenda/metadata-ui` for metadata-driven ERP surfaces.

## Scope

**In scope**

- List, Form, Stat, Chart, Detail, Audit section renderers
- Surface and layout composition
- Action bar renderers
- Wire renderers to `@afenda/ui` and `@afenda/metadata` contracts
- Register renderers in default renderer registry

**Out of scope**

- Business domain data fetching
- Permission engine (TIP-010) — renderers accept visibility resolution as input
- Accounting / inventory logic

## Runtime evidence (2026-06-23)

| Deliverable | Path | Proven |
| --- | --- | --- |
| Default section renderers | `packages/metadata-ui/src/renderers/default-section-renderers.tsx` | Yes |
| List / Form / Stat / Chart sections | `packages/metadata-ui/src/sections/` | Yes |
| Metadata surface | `packages/metadata-ui/src/surfaces/metadata-surface.tsx` | Yes |
| Layout renderer | `packages/metadata-ui/src/layouts/metadata-layout.tsx` | Yes |
| Action bar | `packages/metadata-ui/src/actions/` | Yes |
| Tests | `packages/metadata-ui/src/__tests__/` | Yes |
| ERP production metadata pages | `apps/erp/src/app/` | **No** |

## Depends on

- TIP-005 Metadata Authority ✅
- TIP-UI-02 Component Library ✅

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

## Acceptance criteria

```gherkin
GIVEN a governed MetadataSurfaceContract for a list view
WHEN ListSection renderer renders with sample data
THEN columns match metadata definitions
AND actions respect MetadataVisibilityResolution input
AND components come from @afenda/ui only
AND at least one ERP page uses the renderer in production routing
```

## Verdict

**Partially Implemented** — renderers and tests exist in `@afenda/metadata-ui`; ERP production wiring remains.
