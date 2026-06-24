# TIP-UI-05 — ERP App Surfaces

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **Authority status** | **Accepted** — Foundation Phase 6 UI delivery TIP |
| **Runtime evidence** | `apps/erp/src/app/globals.css`, `(auth)/sign-in/sign-in-form.tsx`, `(protected)/layout.tsx`, `(protected)/modules/[moduleId]/page.tsx` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 6 — Design, UI, AppShell, and Metadata UI Governance |
| **Remaining gap** | ApplicationShell production polish; metadata-driven ERP pages; per-module UX; governed loading/error boundaries |

## Purpose

Close the ERP application surface layer so authenticated users experience a governed, token-aligned shell across auth, dashboard, manifest module placeholders, and System Admin — with zero inline layout/color hacks and TIP-004 consumption rules on every production route.

**Post TIP-007A:** Module placeholders are manifest-driven at `/modules/[moduleId]` (for example `/modules/manufacturing`, `/modules/hrm`). They are **not** missing legacy top-level routes such as `/manufacturing`. TIP-UI-05 finishes UX polish, metadata wiring, and boundary surfaces on top of that pipeline.

ADR-0013 authority: Foundation Phase 6 gate — ERP surfaces use design-system tokens, `@afenda/ui` primitives, and AppShell production integration.

## Scope

**In scope**

- `globals.css` composition in ERP root layout (tokens, UI, AppShell, metadata-ui CSS)
- Auth pages using `@afenda/ui` with governed button props
- Protected dashboard using `AppShell` + `AppShellMain` + dashboard canvas
- Manifest module placeholder UX at `(protected)/modules/[moduleId]/page.tsx` (shell copy only — route materialization is TIP-007A)
- System Admin surfaces delivered under TIP-013 (evidence cross-reference only)
- Route `loading.tsx` and `error.tsx` using `@afenda/ui` Skeleton and Alert (or governed equivalents)
- At least one production ERP page wired to `@afenda/metadata-ui` renderers (coordinates with TIP-UI-04)
- Per-module placeholder polish (governed empty states, consistent `AppShellMain` patterns)

**Out of scope**

- Feature manifest registry, route generation, or RBAC guards (TIP-007A — **Complete**)
- Business domain logic, real accounting/inventory data
- Accounting Core packages and ledger/journal/posting (ADR-0010)
- AppShell authority contract freeze (TIP-006)
- System Admin MVP delivery (TIP-013 — **Complete**)

## Runtime evidence (2026-06-24)

| Artifact | Path | Proven |
| --- | --- | --- |
| CSS pipeline composition | `apps/erp/src/app/globals.css` | Yes — `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui` imports |
| Root layout CSS import | `apps/erp/src/app/layout.tsx` | Yes |
| Sign-in with `@afenda/ui` | `apps/erp/src/app/(auth)/sign-in/sign-in-form.tsx` | Yes — `Button`, `Input`, `Label`, `mapStockButtonProps` |
| Sign-in page | `apps/erp/src/app/(auth)/sign-in/page.tsx` | Yes |
| Protected dashboard | `apps/erp/src/app/(protected)/page.tsx` | Yes — partial (text loading state, no metadata renderer) |
| Dashboard canvas client | `apps/erp/src/components/protected-workspace-dashboard.client.tsx` | Yes — partial |
| ApplicationShell in production | `apps/erp/src/app/(protected)/layout.tsx` | Yes — partial (wired; TIP-006 contract polish open) |
| Manifest module placeholders | `apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx` | Yes — **TIP-007A Slice 3** |
| Module route guard | `apps/erp/src/lib/modules/guard-module-route.server.ts` | Yes — TIP-007A |
| Manifest nav wiring | `apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts` | Yes — TIP-007A |
| Module route paths | `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | Yes — `/modules/{moduleId}` union |
| System Admin surfaces | `apps/erp/src/app/(protected)/system-admin/` | Yes — TIP-013 Complete |
| Protected loading boundary | `apps/erp/src/app/(protected)/loading.tsx` | Partial — plain text, no Skeleton |
| Protected error boundary | `apps/erp/src/app/(protected)/error.tsx` | Partial — `RouteSegmentError`, no Alert primitive |
| Auth error boundary | `apps/erp/src/app/(auth)/error.tsx` | Partial — same pattern |
| Metadata-ui in production pages | `apps/erp/src/app/(protected)/` | **No** — dev harness only (`governance-integration-harness.tsx`) |
| E2E manifest nav + placeholder | `apps/erp/e2e/feature-manifest-navigation.spec.ts` | Yes — `/modules/hrm`, sidebar HRM link |
| Legacy inline-styled auth | — | **Obsolete claim** — superseded by governed sign-in |

> **Stale claim retired:** Module placeholder routes are **not missing**. TIP-007A delivers a single dynamic route; manifest entries map to `/modules/manufacturing`, `/modules/inventory`, `/modules/sales`, `/modules/accounting`, `/modules/hrm`, `/modules/mrp`, `/modules/ai_copilot`, and `/modules/workspace` — not hand-edited `/manufacturing` files.

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/erp` (PKG-007) | Production routes, layouts, loading/error boundaries, page wiring |
| `@afenda/appshell` (PKG-001) | `AppShell`, `AppShellMain`, dashboard canvas (consumed — no edits unless TIP-006 escalates) |
| `@afenda/ui` (PKG-002) | Primitives for auth, boundaries, and page chrome |
| `@afenda/metadata-ui` (PKG-004) | Metadata-driven page renderers (consumed — renderer work stays TIP-UI-04) |
| `@afenda/entitlements` (PKG-006) | Manifest route paths (read-only — TIP-007A authority) |

## Depends on

- TIP-UI-02 Component Library — **Complete**
- TIP-UI-03 AppShell Token Migration — **Partial** (token CSS done; TIP-006 closeout open)
- TIP-UI-04 Metadata-UI Renderers — **Partial** (renderers exist; ERP production wiring open)
- TIP-007A Feature Manifest & Module Governance — **Complete**
- TIP-010 Identity & Authorization (API RBAC) — **Partial**
- TIP-006 AppShell Authority — **Partial** (contract freeze; non-blocking for surface polish)
- TIP-013 System Admin Control Plane — **Complete** (admin surfaces evidence; not a TIP-UI-05 deliverable)

## Blocks

- Foundation Phase 6 gate ([`pre-accounting-foundation-roadmap.md`](../../architecture/pre-accounting-foundation-roadmap.md) §Foundation Phase 6)
- Demo-ready ERP shell for stakeholders
- TIP-UI-04 production wiring proof (at least one metadata-driven ERP page)
- TIP-022 Dashboard v1 (Phase 2 — downstream)

## Deliverables

| File | Package | Layer | New / Modified | Status |
| --- | --- | --- | --- | --- |
| `apps/erp/src/app/globals.css` | `@afenda/erp` | Application | Modified | Implemented |
| `apps/erp/src/app/layout.tsx` | `@afenda/erp` | Application | Existing | Implemented |
| `apps/erp/src/app/(auth)/sign-in/sign-in-form.tsx` | `@afenda/erp` | Application | Existing | Implemented |
| `apps/erp/src/app/(auth)/sign-in/page.tsx` | `@afenda/erp` | Application | Existing | Implemented |
| `apps/erp/src/app/(protected)/layout.tsx` | `@afenda/erp` | Application | Modified (TIP-007A) | Partial — polish |
| `apps/erp/src/app/(protected)/page.tsx` | `@afenda/erp` | Application | Existing | Partial |
| `apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx` | `@afenda/erp` | Application | New (TIP-007A) | Implemented — UX polish open |
| `apps/erp/src/components/protected-workspace-dashboard.client.tsx` | `@afenda/erp` | Application | Existing | Partial |
| `apps/erp/src/app/(protected)/loading.tsx` | `@afenda/erp` | Application | Modified | Partial — Skeleton |
| `apps/erp/src/app/(protected)/error.tsx` | `@afenda/erp` | Application | Modified | Partial — Alert |
| `apps/erp/src/app/(auth)/error.tsx` | `@afenda/erp` | Application | Existing | Partial — Alert |
| `apps/erp/src/app/loading.tsx` | `@afenda/erp` | Application | Modified | Partial |
| `apps/erp/src/app/error.tsx` | `@afenda/erp` | Application | Existing | Partial |
| `apps/erp/src/components/route-segment-error.tsx` | `@afenda/erp` | Application | Modified | Partial — migrate to `@afenda/ui` Alert |
| Metadata-driven production page | `@afenda/erp` | Application | **New** | **Not started** |
| Per-module placeholder UX components | `@afenda/erp` | Application | **New** | **Not started** |
| `apps/erp/e2e/feature-manifest-navigation.spec.ts` | `@afenda/erp` | Application | Existing (TIP-007A) | Implemented |

## Acceptance gate

- `pnpm --filter @afenda/erp typecheck`
- `pnpm --filter @afenda/erp test:run`
- `pnpm ui:guard:scan`
- `pnpm quality:boundaries`
- `pnpm ci:biome`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN a signed-in user with RBAC access to module manufacturing
WHEN they navigate to /modules/manufacturing from manifest-driven sidebar nav
THEN the page renders a governed AppShellMain placeholder
AND the response is not 404
AND no inline style objects are used for layout or color

GIVEN a signed-in user without RBAC access to module manufacturing
WHEN they navigate directly to /modules/manufacturing
THEN the server returns 403 Forbidden
AND an audit event records the denial (TIP-007A guard — regression must hold)

GIVEN the ERP auth sign-in surface
WHEN an unauthenticated user opens /sign-in
THEN form controls render from @afenda/ui
AND submit uses mapStockButtonProps governance
AND no legacy inline-styled inputs remain

GIVEN the protected ERP layout
WHEN any authenticated workspace page loads
THEN ApplicationShell wraps the page with identity, optional context switcher, and manifest navigation
AND globals.css composes design-system, UI, AppShell, and metadata-ui CSS in governed order

GIVEN a protected route segment is loading or throws
WHEN loading.tsx or error.tsx renders
THEN Skeleton (loading) or Alert (error) from @afenda/ui is used
AND boundaries remain accessible (aria-busy, role="alert")

GIVEN a governed MetadataSurfaceContract exists in @afenda/metadata-ui
WHEN at least one production ERP page under apps/erp/src/app/(protected)/ renders it
THEN columns and actions match metadata definitions
AND components come from @afenda/ui only (TIP-004 consumption)

GIVEN Phase 9 Accounting Readiness Gate has NOT passed
WHEN /modules/accounting renders
THEN the surface remains a shell placeholder only
AND no ledger, journal, or posting UI is introduced
```

### Acceptance criteria proof

| Scenario | Proof |
| --- | --- |
| Manifest module placeholder (RBAC granted) | `apps/erp/e2e/feature-manifest-navigation.spec.ts`; `apps/erp/src/lib/modules/__tests__/feature-manifest-acceptance.test.ts` |
| 403 on direct route (RBAC denied) | `apps/erp/src/lib/modules/__tests__/guard-module-route.audit.test.ts`; e2e workspace-reader fixture |
| Sign-in uses `@afenda/ui` | `apps/erp/src/app/(auth)/sign-in/sign-in-form.tsx`; `pnpm ui:guard:scan` |
| ApplicationShell in production layout | `apps/erp/src/app/(protected)/layout.tsx`; `apps/erp/src/components/__tests__/appshell-canvas-harness.test.tsx` |
| CSS pipeline | `apps/erp/src/app/globals.css`; `apps/erp/src/__tests__/governance-integration.test.tsx` |
| Governed loading/error boundaries | **Open** — `loading.tsx` / `error.tsx` + interaction tests |
| Metadata-driven production page | **Open** — TIP-UI-04 + new ERP page test |
| Accounting shell placeholder only | `feature-manifest-acceptance.test.ts`; e2e accounting placeholder test |
| System Admin surfaces (regression) | `apps/erp/src/__tests__/system-admin-acceptance.test.ts` (TIP-013) |

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | `globals.css` composes governed CSS stack | File path + governance-integration test | [x] |
| 2 | Auth pages use `@afenda/ui` | `sign-in-form.tsx`; `pnpm ui:guard:scan` | [x] |
| 3 | Protected layout wraps `AppShell` with manifest nav | `(protected)/layout.tsx` | [x] |
| 4 | Manifest module placeholders render at `/modules/[moduleId]` | TIP-007A page + e2e | [x] |
| 5 | Protected dashboard uses governed shell components | `(protected)/page.tsx` | [x] |
| 6 | Loading boundaries use `@afenda/ui` Skeleton | `(protected)/loading.tsx` + tests | [ ] |
| 7 | Error boundaries use `@afenda/ui` Alert | `error.tsx` files + tests | [ ] |
| 8 | At least one metadata-driven production ERP page | New page + metadata-ui test | [ ] |
| 9 | Per-module placeholder UX polish (empty states) | Module page + visual/e2e proof | [ ] |
| 10 | No inline style objects on production surfaces | `pnpm ui:guard:scan` | [x] |
| 11 | ERP tests pass | `pnpm --filter @afenda/erp test:run` | [x] |
| 12 | UI guard clean on consumer changes | `pnpm ui:guard:scan` | [x] |
| 13 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [ ] |
| 14 | TIP status index updated | `docs/delivery/tip-status-index.md` | [ ] |
| 15 | Drift guard passes | `pnpm check:documentation-drift` | [ ] |
| 16 | Completion report posted | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Mandatory before code edits.** Three slices — dependency order: boundaries → shell polish → metadata + module UX.

### Slice 1 — Governed loading and error boundaries (`@afenda/erp`)

**Status:** Not started  
**Prerequisite:** TIP-UI-02 Complete; `@afenda/ui` Skeleton and Alert exported

#### Design (internal-guide)

- Replace plain-text loading fallbacks with `@afenda/ui` `Skeleton` patterns in `(protected)/loading.tsx`, root `loading.tsx`, and dashboard client loading state.
- Migrate `RouteSegmentError` to compose `@afenda/ui` `Alert` + governed `Button` for reset — keep observability hook (`reportClientError`) intact.
- Preserve `aria-busy`, `aria-live`, and `role="alert"` semantics; no `className` on `@afenda/ui` primitives (TIP-004).
- Do **not** change manifest routes or guards (TIP-007A regression surface).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Replace plain-text ERP loading/error boundaries with governed @afenda/ui Skeleton and Alert surfaces across protected and auth segments.
2. Allowed layer— apps/erp/src/app/(protected)/, apps/erp/src/app/(auth)/, apps/erp/src/app/, apps/erp/src/components/route-segment-error.tsx
3. Files        — apps/erp/src/app/(protected)/loading.tsx (Modified)
                  apps/erp/src/app/loading.tsx (Modified)
                  apps/erp/src/app/(protected)/error.tsx (Modified)
                  apps/erp/src/app/(auth)/error.tsx (Modified)
                  apps/erp/src/app/error.tsx (Modified)
                  apps/erp/src/components/route-segment-error.tsx (Modified)
                  apps/erp/src/components/protected-workspace-dashboard.client.tsx (Modified)
                  apps/erp/src/__tests__/route-segment-error.test.tsx (New)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
4. Prohibited   — packages/ui edits, packages/appshell edits, manifest/registry changes, @afenda/accounting, ledger/journal/posting, className on @afenda/ui primitives
5. Authority    — ADR-0013 Phase 6 — Application Authority (TIP-004 consumption)
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 6 | Loading boundaries use Skeleton | `pnpm --filter @afenda/erp test:run` |
| 7 | Error boundaries use Alert | `pnpm --filter @afenda/erp test:run` |

### Slice 2 — ApplicationShell production polish (`@afenda/erp`)

**Status:** Not started  
**Prerequisite:** Slice 1 delivered; TIP-007A Complete (manifest nav in layout)

#### Design (internal-guide)

- Harden `(protected)/layout.tsx` and dashboard client for production polish: consistent `AppShellMain` titling, governed empty/error copy, remove dev-harness-only assumptions.
- Align workspace dashboard loading with Slice 1 Skeleton pattern.
- Verify manifest navigation renders for seeded dev fixtures (regression only — no nav logic changes in `@afenda/appshell`).
- System Admin routes under `(protected)/system-admin/` are TIP-013 — touch only for visual consistency, not new admin features.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Polish production ApplicationShell integration: dashboard loading states, AppShellMain copy consistency, and governed workspace home UX without changing manifest or RBAC pipelines.
2. Allowed layer— apps/erp/src/app/(protected)/, apps/erp/src/components/
3. Files        — apps/erp/src/app/(protected)/page.tsx (Modified)
                  apps/erp/src/app/(protected)/layout.tsx (Modified)
                  apps/erp/src/components/protected-workspace-dashboard.client.tsx (Modified)
                  apps/erp/src/components/__tests__/appshell-canvas-harness.test.tsx (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
4. Prohibited   — packages/appshell contract freeze work (TIP-006), packages/ui edits, manifest/registry edits, system-admin API mutations, @afenda/accounting
5. Authority    — ADR-0013 Phase 6 — Application Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 5 | Protected dashboard uses governed shell components | `pnpm --filter @afenda/erp test:run` |
| 9 | Per-module placeholder UX polish (partial — dashboard half) | visual review + tests |

### Slice 3 — Metadata-driven page + module placeholder UX (`@afenda/erp`)

**Status:** Not started  
**Prerequisite:** TIP-UI-04 renderers proven in `@afenda/metadata-ui`; Slice 2 delivered

#### Design (internal-guide)

- Add one production ERP page under `(protected)/` that renders a governed metadata surface (list or detail) using `@afenda/metadata-ui/server` entry — not dev harness routes.
- Enhance `(protected)/modules/[moduleId]/page.tsx` with governed empty-state pattern (TIP-004 — shell HTML chrome only, no className on primitives).
- Coordinate contract imports from `@afenda/metadata` only; no renderer logic in the app layer.
- Accounting module page must remain placeholder-only (ADR-0010).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Wire one metadata-driven production ERP page and polish manifest module placeholder UX with governed empty states.
2. Allowed layer— apps/erp/src/app/(protected)/, apps/erp/src/components/
3. Files        — apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx (Modified)
                  apps/erp/src/app/(protected)/<metadata-demo>/page.tsx (New)
                  apps/erp/src/components/module-placeholder-empty-state.tsx (New)
                  apps/erp/src/__tests__/metadata-production-page.test.tsx (New)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/metadata-ui renderer implementations (TIP-UI-04), packages/ui edits, manifest/registry edits, @afenda/accounting domain logic, hand-edited /manufacturing routes
5. Authority    — ADR-0013 Phase 6 — Application Authority + Metadata UI consumption
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 8 | Metadata-driven production ERP page | `pnpm --filter @afenda/erp test:run` |
| 9 | Per-module placeholder UX polish | e2e + unit tests |
| 13 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 14 | TIP status index updated | `pnpm check:documentation-drift` |
| 15 | Drift guard passes | `pnpm check:documentation-drift` |
| 16 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- Full `pnpm ui:guard` gates A–F sign-off may remain blocked on TIP-006 contract freeze — document in completion report if Phase 6 gate checklist item stays open.
- TIP-010 continuation for RBAC on all server actions is orthogonal — do not expand scope in this TIP.

## Verdict

**Partially Implemented** — CSS pipeline, governed auth, production `AppShell` wiring, manifest module placeholders (`/modules/[moduleId]` via TIP-007A), protected dashboard, and System Admin surfaces (TIP-013) are runtime-proven. Remaining work: governed loading/error boundaries, ApplicationShell production polish, at least one metadata-driven ERP page (with TIP-UI-04), and per-module placeholder UX. **Retired stale claim:** module placeholder routes are not missing — they are manifest-driven, not legacy `/manufacturing` paths.
