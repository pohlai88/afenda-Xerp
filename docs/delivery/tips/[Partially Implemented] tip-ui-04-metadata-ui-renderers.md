# TIP-UI-04 — Metadata-UI Renderers

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Authority status** | **Accepted** — Metadata Authority implementation slice under TIP-005 (PKG-012) |
| **Runtime evidence** | `packages/metadata-ui/src/renderers/default-section-renderers.tsx` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 4 UI — Metadata-UI Renderers (`TIP-UI-04`; Phase 6 gate in [`pre-accounting-foundation-roadmap.md`](../../architecture/pre-accounting-foundation-roadmap.md)) |
| **Package** | `@afenda/metadata-ui` (PKG-012) |
| **Remaining gap** | Production ERP pages wired to metadata renderers |

## Purpose

Implement governed React renderers in `@afenda/metadata-ui` (PKG-012) that project `@afenda/metadata` contracts into ERP surfaces using `@afenda/ui` primitives only.

ADR-0012 evidence rule: renderer delivery is proven by file, test, and export paths — not delivery doc claims alone. Slice 1 (package renderers) is runtime-proven; Slice 2 (ERP production wiring) remains open.

## Scope

**In scope**

- List, Form, Stat, Chart, Detail, Audit, and Action section renderers
- Surface composition (`page`, `workspace`, `module`)
- Layout composition (`dashboard`, `grid`, `panel`, `stack`, `tabs`, `wizard`)
- Action bar presentation and handler contracts
- Default renderer registry and resolution runtime
- TIP-004 governed consumption — zero `className` on `@afenda/ui` primitives
- Storybook fixtures and Vitest render/governance tests in `@afenda/metadata-ui`
- At least one production ERP route consuming metadata renderers (Slice 2)

**Out of scope**

- Business domain data fetching or mutation logic in renderers
- Permission engine execution (TIP-010) — renderers accept visibility resolution as input
- Metadata authority contract changes (`@afenda/metadata` — TIP-005 frozen)
- Accounting / inventory / ledger logic (ADR-0010)
- AppShell authority contract freeze (TIP-006)

### Package boundary diagram

```text
@afenda/metadata (PKG-011)          authority contracts — no React, zero deps
        │
        ├──────────────────────────────────┐
        ▼                                  ▼
@afenda/ui (PKG-018)              @afenda/metadata-ui (PKG-012)   ← this TIP
  governed primitives                      │
        │                                  │ imports contracts + primitives only
        └──────────────────────────────────┘
                                           │
                                           ▼
                              @afenda/erp (PKG-007)
                                consumes renderers via @afenda/metadata-ui/server
                                NO renderer implementation in apps/erp
                                NO fixture CSS in production globals.css
```

**Boundary rules**

| Layer | May import | Must not |
| --- | --- | --- |
| `@afenda/metadata` | — | React, `@afenda/ui`, renderers |
| `@afenda/metadata-ui` | `@afenda/metadata`, `@afenda/ui` | ERP app code, database, permissions execution |
| `@afenda/erp` | `@afenda/metadata-ui` (approved edge) | Local renderer copies, `@afenda/metadata-ui/fixtures.css` in production |

## Runtime evidence (2026-06-24)

| Artifact | Path | Proven |
| --- | --- | --- |
| Default section renderers | `packages/metadata-ui/src/renderers/default-section-renderers.tsx` | Yes — Slice 1 |
| Section renderer factory | `packages/metadata-ui/src/renderers/create-section-renderer.tsx` | Yes — Slice 1 |
| List / Form / Stat / Chart / Detail / Audit / Action sections | `packages/metadata-ui/src/sections/index.tsx`, `packages/metadata-ui/src/sections/metadata-section.tsx` | Yes — Slice 1 |
| Metadata surface | `packages/metadata-ui/src/surfaces/metadata-surface.tsx` | Yes — Slice 1 |
| Surface action chrome | `packages/metadata-ui/src/surfaces/metadata-surface-actions.tsx` | Yes — Slice 1 |
| Page / workspace / module surfaces | `packages/metadata-ui/src/surfaces/index.tsx` | Yes — Slice 1 |
| Layout renderer | `packages/metadata-ui/src/layouts/metadata-layout.tsx` | Yes — Slice 1 |
| Dashboard / grid / panel / stack / tabs / wizard layouts | `packages/metadata-ui/src/layouts/index.tsx` | Yes — Slice 1 |
| Action presentation + handler | `packages/metadata-ui/src/actions/metadata-action-presentation.ts`, `packages/metadata-ui/src/actions/metadata-action-handler.ts` | Yes — Slice 1 |
| Default renderer registry | `packages/metadata-ui/src/registry/default-renderer-registry.ts` | Yes — Slice 1 |
| Render context runtime | `packages/metadata-ui/src/runtime/create-metadata-ui-render-context.ts` | Yes — Slice 1 |
| Renderer + section + surface + layout tests | `packages/metadata-ui/src/__tests__/` (34 test files) | Yes — Slice 1 |
| ERP dev harness (non-production) | `apps/erp/src/components/governance-integration-harness.tsx` | Yes — harness only |
| ERP production metadata-driven pages | `apps/erp/src/app/(protected)/` | **No** — Slice 2 |

## Package ownership

| Package | Registry ID | Role |
| --- | --- | --- |
| `@afenda/metadata` | PKG-011 | Authority contracts — surfaces, layouts, sections, renderer vocabulary |
| `@afenda/ui` | PKG-018 | Governed primitives consumed by renderers |
| `@afenda/metadata-ui` | PKG-012 | Renderer implementation, registry, runtime context (this TIP) |
| `@afenda/erp` | PKG-007 | Production host — wires renderers; owns routing and data boundaries |

## Depends on

- [TIP-005 Metadata Authority](./[Complete%20(authority%20only)]%20tip-005-metadata-authority.md) — **Complete**
- [TIP-UI-02 Component Library](./[Complete]%20tip-ui-02-component-library.md) — **Complete**

## Blocks

- [TIP-UI-05 ERP App Surfaces](./[Partially%20Implemented]%20tip-ui-05-erp-app-surfaces.md) — metadata-driven production pages and module placeholder closeout
- TIP-022 Dashboard v1 (Phase 2) — dashboard widget render path requires metadata renderers + ERP wiring
- Foundation Phase 6 gate — "Metadata renderers demonstrated on at least one ERP page" ([`pre-accounting-foundation-roadmap.md`](../../architecture/pre-accounting-foundation-roadmap.md))

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `packages/metadata-ui/src/renderers/default-section-renderers.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/renderers/create-section-renderer.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/sections/index.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/sections/metadata-section.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/surfaces/metadata-surface.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/surfaces/metadata-surface-actions.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/surfaces/index.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/layouts/metadata-layout.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/layouts/index.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/actions/metadata-action-presentation.ts` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/actions/metadata-action-handler.ts` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/registry/default-renderer-registry.ts` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/runtime/create-metadata-ui-render-context.ts` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/index.ts` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | Metadata Authority |
| `packages/metadata-ui/src/__tests__/section-rendering.test.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | — |
| `packages/metadata-ui/src/__tests__/surface-rendering.test.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | — |
| `packages/metadata-ui/src/__tests__/layout-rendering.test.tsx` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | — |
| `packages/metadata-ui/src/__tests__/metadata-ui-boundary.test.ts` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | — |
| `packages/metadata-ui/src/__tests__/ui-governance-wiring.test.ts` | `@afenda/metadata-ui` | Metadata | **Delivered** (Slice 1) | — |
| `apps/erp/src/app/(protected)/` metadata-driven page | `@afenda/erp` | Application | **New** (Slice 2) | Application Authority |

## Acceptance gate

- `pnpm --filter @afenda/metadata-ui test:run`
- `pnpm --filter @afenda/metadata-ui typecheck`
- `pnpm --filter @afenda/erp test:run` (Slice 2 — production wiring proof)
- `pnpm ui:guard:scan`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN TIP-005 metadata authority contracts are frozen in @afenda/metadata
AND   TIP-UI-02 exports governed @afenda/ui primitives
WHEN  defaultMetadataRenderers register in @afenda/metadata-ui
THEN  List, Form, Stat, Chart, Detail, Audit, and Action section types resolve
AND   each renderer composes @afenda/ui primitives with zero className on governed components
AND   pnpm --filter @afenda/metadata-ui test:run passes

GIVEN a governed MetadataSurfaceContract for a list view
AND   a MetadataUiRenderContext with visibility resolution input
WHEN  ListSection renderer renders with sample fixture data
THEN  columns match metadata section definitions
AND   actions respect MetadataVisibilityResolution input
AND   section regions expose data-metadata-section and accessibility landmarks

GIVEN MetadataPageSurface, MetadataLayout, and MetadataSection compose a page surface
WHEN  surface-rendering and layout-rendering tests execute
THEN  page, workspace, and module surface types render without authority drift
AND   layout types dashboard, grid, panel, stack, tabs, and wizard resolve

GIVEN an ERP protected route is designated for metadata demonstration
AND   the route imports from @afenda/metadata-ui/server only
WHEN  a signed-in user navigates to the production page
THEN  at least one metadata-driven list or dashboard section renders
AND   apps/erp does not import @afenda/metadata-ui/fixtures.css
AND   no renderer implementation logic lives under apps/erp/src/components/

GIVEN TIP-UI-04 Slice 1 is complete and Slice 2 is not
WHEN  documentation drift guard runs
THEN  tip-status-index and runtime truth matrix show Partially Implemented
AND   remaining gap explicitly cites ERP production wiring
```

### Acceptance criteria proof

| Scenario | Proof |
| --- | --- |
| Default renderers register all section types | `packages/metadata-ui/src/__tests__/renderers.test.ts`; `packages/metadata-ui/src/__tests__/renderer-registry.test.ts` |
| TIP-004 governed consumption (no className drift) | `packages/metadata-ui/src/__tests__/ui-governance-wiring.test.ts`; `packages/metadata-ui/src/__tests__/no-local-recipe-authority.test.ts` |
| List section columns + visibility | `packages/metadata-ui/src/__tests__/section-rendering.test.tsx` |
| Surface + layout composition | `packages/metadata-ui/src/__tests__/surface-rendering.test.tsx`; `packages/metadata-ui/src/__tests__/layout-rendering.test.tsx` |
| Package boundary discipline | `packages/metadata-ui/src/__tests__/metadata-ui-boundary.test.ts`; `packages/metadata-ui/src/__tests__/no-authority-drift.test.ts` |
| ERP harness (non-production) | `apps/erp/src/components/governance-integration-harness.tsx`; `apps/erp/src/__tests__/governance-integration.test.tsx` |
| ERP production metadata page | **Missing** — Slice 2 deliverable under `apps/erp/src/app/(protected)/` |

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Default section renderers exist for all governed section types | Deliverables table paths | [x] |
| 2 | Surface, layout, and action renderers exist | File paths under `packages/metadata-ui/src/` | [x] |
| 3 | Default renderer registry + resolution runtime exist | `default-renderer-registry.ts`; `create-metadata-ui-render-context.ts` | [x] |
| 4 | Metadata-ui renderer tests pass | `pnpm --filter @afenda/metadata-ui test:run` | [x] |
| 5 | TIP-004 UI guard clean on metadata-ui | `pnpm ui:guard:scan` | [x] |
| 6 | Package boundaries clean | `pnpm quality:boundaries` | [x] |
| 7 | Typecheck clean | `pnpm --filter @afenda/metadata-ui typecheck` | [x] |
| 8 | Biome clean | `pnpm ci:biome` | [x] |
| 9 | At least one ERP production page uses metadata renderers | `apps/erp/src/app/(protected)/` route + test | [ ] |
| 10 | ERP does not import fixture CSS in production | `apps/erp/src/__tests__/governance-integration.test.tsx` | [x] |
| 11 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] |
| 12 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] |
| 13 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 14 | Completion report posted (Slice 2) | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Mandatory before code edits.** Two slices — dependency order: metadata-ui renderers (delivered) → ERP production wiring.

### Slice 1 — Metadata renderers (`@afenda/metadata-ui`)

**Status:** Delivered  
**Prerequisite:** TIP-005 Complete; TIP-UI-02 Complete

#### Design (internal-guide)

- `@afenda/metadata-ui` implements renderers only — never redefines authority vocabulary owned by `@afenda/metadata`.
- Section renderers use `createSectionRenderer` + typed section components; default set exported as `defaultMetadataRenderers`.
- Surfaces delegate to `MetadataSurface`; layouts delegate to `MetadataLayout`; actions split presentation (`metadata-action-presentation.ts`) from handler results (`metadata-action-handler.ts`).
- Public server entry (`@afenda/metadata-ui/server`) exposes render context + composed components for ERP RSC boundaries.
- TIP-004: governed props on `@afenda/ui`; shell chrome on plain HTML wrappers only; `@afenda/ui/governance` import required in consumer files.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-04-metadata-ui-renderers.md

1. Objective    — Deliver governed metadata section, surface, layout, and action renderers in @afenda/metadata-ui with registry, runtime context, tests, and Storybook fixtures; no ERP production wiring.
2. Allowed layer— packages/metadata-ui/src/
3. Files        — packages/metadata-ui/src/renderers/default-section-renderers.tsx (Delivered)
                  packages/metadata-ui/src/renderers/create-section-renderer.tsx (Delivered)
                  packages/metadata-ui/src/sections/ (Delivered)
                  packages/metadata-ui/src/surfaces/ (Delivered)
                  packages/metadata-ui/src/layouts/ (Delivered)
                  packages/metadata-ui/src/actions/ (Delivered)
                  packages/metadata-ui/src/registry/default-renderer-registry.ts (Delivered)
                  packages/metadata-ui/src/runtime/create-metadata-ui-render-context.ts (Delivered)
                  packages/metadata-ui/src/__tests__/ (Delivered)
4. Prohibited   — @afenda/metadata contract edits, apps/erp production pages, packages/ui primitive edits, business domain data fetching, permission engine execution, ADR-0010 Accounting Core, className on @afenda/ui primitives
5. Authority    — TIP-005 Metadata Authority (PKG-012 implementation)
6. Gates        — pnpm --filter @afenda/metadata-ui typecheck
                  pnpm --filter @afenda/metadata-ui test:run
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 1 | Default section renderers exist | `pnpm --filter @afenda/metadata-ui test:run` |
| 2 | Surface, layout, action renderers exist | `pnpm --filter @afenda/metadata-ui test:run` |
| 3 | Registry + resolution runtime exist | `pnpm --filter @afenda/metadata-ui test:run` |
| 4 | Renderer tests pass | `pnpm --filter @afenda/metadata-ui test:run` |
| 5 | UI guard clean | `pnpm ui:guard:scan` |
| 6 | Boundaries clean | `pnpm quality:boundaries` |
| 7 | Typecheck clean | `pnpm --filter @afenda/metadata-ui typecheck` |
| 8 | Biome clean | `pnpm ci:biome` |
| 10 | ERP does not import fixture CSS | `pnpm --filter @afenda/erp test:run` |

#### Known debt

- ERP production routes still use placeholder or bespoke JSX — deferred to Slice 2.
- Dev harness at `governance-integration-harness.tsx` proves integration but is not a production route.

### Slice 2 — ERP production page wiring (`@afenda/erp`)

**Status:** Not started  
**Prerequisite:** Slice 1 runtime evidence row `packages/metadata-ui/src/renderers/default-section-renderers.tsx` = `partially-implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Wire at least one `(protected)` ERP route to compose `MetadataPageSurface` + `MetadataLayout` + section renderers via `@afenda/metadata-ui/server`.
- Build `MetadataUiRenderContext` from ERP operating context + permission visibility resolution at the server boundary — do not execute permissions inside `@afenda/metadata-ui`.
- Prefer manifest-driven module placeholder (`/modules/[moduleId]`) or protected dashboard extension — coordinate with TIP-UI-05 for shell layout consistency.
- Import `@afenda/metadata-ui/afenda-metadata-ui.css` via `apps/erp/src/app/globals.css` only — never `@afenda/metadata-ui/fixtures.css` in production.
- Add route-level test or integration test proving production import path (not dev harness alone).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-04-metadata-ui-renderers.md

1. Objective    — Wire at least one production ERP protected route to metadata renderers via @afenda/metadata-ui/server with server-built render context and governed UI composition.
2. Allowed layer— apps/erp/src/app/(protected)/
                  apps/erp/src/lib/ (metadata render context bridge if needed)
3. Files        — apps/erp/src/app/(protected)/<target-route>/page.tsx (New)
                  apps/erp/src/lib/<metadata-render-bridge>.server.ts (New, if needed)
                  apps/erp/src/__tests__/ (New or Modified — production wiring proof)
                  docs/delivery/tips/[Partially Implemented] tip-ui-04-metadata-ui-renderers.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — Renderer implementation in apps/erp, packages/metadata-ui authority contract edits, packages/ui primitive edits, @afenda/metadata-ui/fixtures.css in production, business domain posting logic, ADR-0010 Accounting Core
5. Authority    — Application Authority (ERP host) + TIP-005 Metadata Authority (consumer)
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 9 | ERP production page uses metadata renderers | `pnpm --filter @afenda/erp test:run` |
| 11 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 12 | TIP status index updated | `pnpm check:documentation-drift` |
| 13 | Drift guard passes | `pnpm check:documentation-drift` |
| 14 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- Full module placeholder UX polish remains TIP-UI-05 scope.
- TIP-022 dashboard widgets depend on Slice 2 + widget render context bridge.

## Verdict

**Partially Implemented** — Slice 1 is delivered: `@afenda/metadata-ui` (PKG-012) exposes default section, surface, layout, and action renderers with registry, runtime context, governance tests, and Storybook fixtures. Slice 2 remains open: no production ERP route under `apps/erp/src/app/(protected)/` yet composes metadata renderers for end users (dev harness only). Close Slice 2 to unblock TIP-UI-05 metadata-driven pages, TIP-022 dashboard v1, and Foundation Phase 6 gate item "Metadata renderers demonstrated on at least one ERP page."
