# TIP-UI-05 — ERP App Surfaces

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **Authority status** | **Accepted** — Foundation Phase 6 UI delivery TIP |
| **Runtime evidence** | `apps/erp/src/app/globals.css`, `(auth)/sign-in/sign-in-form.tsx`, `(protected)/layout.tsx`, `(protected)/modules/[moduleId]/page.tsx` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 6 — Design, UI, AppShell, and Metadata UI Governance |
| **Remaining gap** | ApplicationShell production polish; metadata-driven ERP pages; per-module UX |

## Purpose

Close the ERP application surface layer so authenticated users experience a governed, token-aligned shell across auth, dashboard, manifest module placeholders, and System Admin — with zero inline layout/color hacks and TIP-004 consumption rules on every production route.

**Post TIP-007A:** Module placeholders are manifest-driven at `/modules/[moduleId]` (for example `/modules/manufacturing`, `/modules/hrm`). They are **not** missing legacy top-level routes such as `/manufacturing`. TIP-UI-05 finishes UX polish, metadata wiring, and boundary surfaces on top of that pipeline.

ADR-0013 authority: Foundation Phase 6 gate — ERP surfaces use design-system tokens, `@afenda/ui` primitives, and AppShell production integration.

**shadcn/studio adaptation authority:** [`app-ui-component-adaptation-guide.md`](../../architecture/app-ui-component-adaptation-guide.md) — candidate decisions, layer mapping, and visual/coding quality bar. Slices 4–8 implement **Approved** and **Approved with constraints** candidates only. **Rejected** and **Reference only** candidates are documented in §Rejected shadcn/studio patterns — do not implement.

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
| Protected dashboard | `apps/erp/src/app/(protected)/page.tsx` | Yes — `AppShellMain` + `WORKSPACE_HOME_COPY`; governed status resolver |
| Dashboard canvas client | `apps/erp/src/components/protected-workspace-dashboard.client.tsx` | Yes — Skeleton loading, Alert errors, status copy contract |
| ApplicationShell in production | `apps/erp/src/app/(protected)/layout.tsx` | Yes — production providers + manifest nav (Slice 2 polish) |
| Manifest module placeholders | `apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx` | Yes — **TIP-007A Slice 3** + TIP-UI-05 Slice 4 Card empty-state polish |
| Module route guard | `apps/erp/src/lib/modules/guard-module-route.server.ts` | Yes — TIP-007A |
| Manifest nav wiring | `apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts` | Yes — TIP-007A |
| Module route paths | `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | Yes — `/modules/{moduleId}` union |
| System Admin surfaces | `apps/erp/src/app/(protected)/system-admin/` | Yes — TIP-013 Complete |
| Protected loading boundary | `apps/erp/src/app/(protected)/loading.tsx` | Yes — `@afenda/ui` Skeleton; `aria-busy` |
| Protected error boundary | `apps/erp/src/app/(protected)/error.tsx` | Yes — `RouteSegmentError` + `@afenda/ui` Alert |
| Auth error boundary | `apps/erp/src/app/(auth)/error.tsx` | Yes — governed Alert via `RouteSegmentError` |
| Root loading boundary | `apps/erp/src/app/loading.tsx` | Yes — `@afenda/ui` Skeleton |
| Root error boundary | `apps/erp/src/app/error.tsx` | Yes — governed Alert via `RouteSegmentError` |
| Route segment error surface | `apps/erp/src/components/route-segment-error.tsx` | Yes — Alert + `mapStockButtonProps`; `route-segment-error.test.tsx` |
| Metadata-ui in production pages | `apps/erp/src/app/(protected)/metadata-workspace/` | **Yes** — TIP-UI-04 Slice 2 + TIP-UI-05 Slice 3 consolidated test |
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
| `apps/erp/src/components/protected-workspace-dashboard.client.tsx` | `@afenda/erp` | Application | Existing | Implemented — Skeleton loading |
| `apps/erp/src/app/(protected)/loading.tsx` | `@afenda/erp` | Application | Modified | Implemented — Skeleton |
| `apps/erp/src/app/(protected)/error.tsx` | `@afenda/erp` | Application | Modified | Implemented — Alert |
| `apps/erp/src/app/(auth)/error.tsx` | `@afenda/erp` | Application | Existing | Implemented — Alert |
| `apps/erp/src/app/loading.tsx` | `@afenda/erp` | Application | Modified | Implemented — Skeleton |
| `apps/erp/src/app/error.tsx` | `@afenda/erp` | Application | Existing | Implemented — Alert |
| `apps/erp/src/components/route-segment-error.tsx` | `@afenda/erp` | Application | Modified | Implemented — `@afenda/ui` Alert |
| `apps/erp/src/__tests__/route-segment-error.test.tsx` | `@afenda/erp` | Application | New | Implemented |
| Metadata-driven production page | `@afenda/erp` | Application | **New** | **Not started** |
| Per-module placeholder UX components | `@afenda/erp` | Application | **New** | **Not started** |
| Governed empty-state + card-nav surfaces | `@afenda/erp` | Application | **New** | **Implemented** — Slice 4 |
| System Admin form-layout + settings sections | `@afenda/erp` | Application | **New** | **Implemented** — Slice 5 |
| Chart KPI blocks (statistics/charts/widgets) | `@afenda/appshell` | ERPSpine | **New** | **Implemented** — Slice 6 |
| System Admin DataTable surfaces | `@afenda/erp` | Application | **New** | **Implemented** — Slice 7 |
| Invite wizard + admin dialog surfaces | `@afenda/erp` | Application | **New** | **Implemented** — Slice 8 |
| `docs/architecture/dependency-registry.md` | Architecture | Registry | Modified | **Implemented** — Slice 6 |
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
| Governed loading/error boundaries | `route-segment-error.test.tsx`; `loading.tsx` / `error.tsx` |
| Metadata-driven production page | `metadata-production-page.test.tsx`; `/metadata-workspace` route |
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
| 6 | Loading boundaries use `@afenda/ui` Skeleton | `(protected)/loading.tsx` + tests | [x] |
| 7 | Error boundaries use `@afenda/ui` Alert | `error.tsx` files + tests | [x] |
| 8 | At least one metadata-driven production ERP page | New page + metadata-ui test | [x] |
| 9 | Per-module placeholder UX polish (empty states) | Module page + `erp-empty-state.test.tsx` | [x] — Slice 4 Card empty-state |
| 10 | No inline style objects on production surfaces | `pnpm ui:guard:scan` | [x] |
| 11 | ERP tests pass | `pnpm --filter @afenda/erp test:run` | [x] |
| 12 | UI guard clean on consumer changes | `pnpm ui:guard:scan` | [x] |
| 13 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] — Slice 5 form-layout + settings |
| 14 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] — Step 24 delivered |
| 15 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 16 | Completion report posted | afenda-coding-session §11 | [x] |
| 17 | shadcn/studio empty-state + card-nav adapted (Slice 4) | `pnpm ui:guard:scan`; adaptation guide §4.3/§4.6 | [x] |
| 18 | System Admin form-layout + settings adapted (Slice 5) | `pnpm ui:guard:scan`; Server Action proof | [x] |
| 19 | Chart KPI blocks governed in AppShell (Slice 6) | `pnpm ui:guard`; Storybook story | [x] |
| 20 | System Admin DataTable adapted (Slice 7) | `pnpm quality:architecture`; `pnpm ui:guard:scan` | [x] |
| 21 | Invite wizard + admin dialog adapted (Slice 8) | discriminated-union tests; no AppShellActivityDialog duplication | [x] |
| 22 | UI Gate A stepper storybook bridge removed (Slice 10) | `pnpm --filter @afenda/ui check:governance` | [x] |
| 23 | ERP test suite green — server-action + integration (Slice 11) | `pnpm --filter @afenda/erp test:run` | [x] |
| 24 | Invite wizard role radio keyboard association (Slice 12) | `pnpm --filter @afenda/erp test:run` | [x] |

## Handoff to implementation

> **Mandatory before code edits.** Eight slices — dependency order: boundaries → shell polish → metadata + module UX → shadcn/studio adaptation (Slices 4–8).
>
> **Governance skills (all UI slices):** apply [`govern-primitive`](../../../.cursor/skills/govern-primitive/SKILL.md) consumer checklist (8/8) and [`afenda-ui-quality`](../../../.cursor/skills/afenda-ui-quality/SKILL.md) Phases 3–5 before merge. No raw MCP output ships without normalization.

### Slice 1 — Governed loading and error boundaries (`@afenda/erp`)

**Status:** Delivered  
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

**Status:** Delivered  
**Prerequisite:** Slice 1 delivered — governed Skeleton/Alert boundaries in `apps/erp/src/components/route-segment-error.tsx`; TIP-007A Complete (manifest nav in layout)

#### Design (internal-guide)

- Centralize workspace home copy in `workspace-home.copy.contract.ts` (`satisfies` serializable record) — single source for `AppShellMain` title/description and dashboard status strings.
- Add `resolveWorkspaceDashboardStatusCopy` with discriminated-union input (`loading` | `default` | `saved` | `fallback`) — no runtime string concatenation in JSX.
- Harden `ProtectedWorkspaceDashboard`: layout status line (default/saved), governed `Alert` for `errorMessage` (match Slice 1 + `PolicyGateSurface` pattern), expose `updatedAt`/`layoutLoadFallback` from hook.
- Align `protected-home-layout.harness.tsx` with production dashboard surface (Skeleton loading, Alert errors) — integration tests stay valid.
- `(protected)/page.tsx`: consistent `AppShellMain` `contentLabel`/`titleId`; copy from contract only.
- `(protected)/layout.tsx`: polish only — no manifest/nav/RBAC pipeline changes; remove dev-only comments if present.
- System Admin routes are TIP-013 — do not touch in this slice.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Polish production ApplicationShell integration: dashboard loading states, AppShellMain copy consistency, governed workspace home UX, and serializable status-copy contracts without changing manifest or RBAC pipelines.
2. Allowed layer— apps/erp/src/app/(protected)/, apps/erp/src/components/, apps/erp/src/lib/workspace/
3. Files        — apps/erp/src/lib/workspace/workspace-home.copy.contract.ts (New)
                  apps/erp/src/lib/workspace/resolve-workspace-dashboard-status-copy.ts (New)
                  apps/erp/src/lib/workspace/use-protected-workspace-dashboard.client.ts (Modified)
                  apps/erp/src/app/(protected)/page.tsx (Modified)
                  apps/erp/src/app/(protected)/layout.tsx (Modified)
                  apps/erp/src/components/protected-workspace-dashboard.client.tsx (Modified)
                  apps/erp/src/components/__tests__/protected-workspace-dashboard.test.tsx (Modified)
                  apps/erp/src/components/__tests__/protected-home-layout.harness.tsx (Modified)
                  apps/erp/src/components/__tests__/protected-workspace-dashboard.integration.test.tsx (Modified)
                  apps/erp/src/components/__tests__/appshell-canvas-harness.test.tsx (Modified)
                  apps/erp/src/lib/workspace/__tests__/resolve-workspace-dashboard-status-copy.test.ts (New)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — packages/appshell contract freeze work (TIP-006), packages/ui edits, manifest/registry edits, system-admin API mutations, @afenda/accounting, ledger/journal/posting, className on @afenda/ui primitives
5. Authority    — ADR-0013 Phase 6 — Application Authority (TIP-004 consumption)
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

**Status:** Delivered  
**Prerequisite:** Slice 2 delivered — `workspace-home.copy.contract.ts` in runtime evidence; TIP-UI-04 Slice 2 `/metadata-workspace` route exists

#### Design (internal-guide)

- **Do not duplicate** metadata production route — TIP-UI-04 Slice 2 already ships `apps/erp/src/app/(protected)/metadata-workspace/page.tsx`. Slice 3 **closes DoD #8** by consolidating production proof in `metadata-production-page.test.tsx` (re-export or migrate assertions from `metadata-workspace-preview.test.tsx`; delete duplicate if merged).
- Centralize module placeholder copy in `module-placeholder.copy.contract.ts` (`satisfies` serializable record) — preserve `PLACEHOLDER_DOMAIN_COPY` regex in `feature-manifest-acceptance.test.ts`.
- `ModulePlaceholderEmptyState` — composes `ErpEmptyState` (Slice 4 Card + dashed inner wrapper); copy from `module-placeholder.copy.contract.ts`.
- `resolveModulePlaceholderCopy(moduleId, label)` — discriminated union: `accounting` gets ADR-0010 shell-only message variant; all others use standard placeholder copy.
- Module page uses contract-driven `AppShellMain` props + `ModulePlaceholderEmptyState`; no renderer logic in app layer.
- Import metadata contracts from `@afenda/metadata` / consume `@afenda/metadata-ui/server` only on existing metadata-workspace surface — no new metadata-ui package edits.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Close metadata production page DoD with consolidated tests on existing /metadata-workspace route and polish manifest module placeholders with governed empty-state component and serializable copy contracts.
2. Allowed layer— apps/erp/src/app/(protected)/, apps/erp/src/components/, apps/erp/src/lib/modules/, apps/erp/src/lib/metadata/, apps/erp/src/app/globals.css
3. Files        — apps/erp/src/lib/modules/module-placeholder.copy.contract.ts (New)
                  apps/erp/src/lib/modules/resolve-module-placeholder-copy.ts (New)
                  apps/erp/src/components/module-placeholder-empty-state.tsx (New)
                  apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx (Modified)
                  apps/erp/src/app/(protected)/metadata-workspace/page.tsx (Modified — copy from contract if drift)
                  apps/erp/src/app/globals.css (Modified — erp-module-placeholder chrome)
                  apps/erp/src/lib/modules/__tests__/resolve-module-placeholder-copy.test.ts (New)
                  apps/erp/src/components/__tests__/module-placeholder-empty-state.test.tsx (New)
                  apps/erp/src/__tests__/metadata-production-page.test.tsx (New)
                  apps/erp/src/__tests__/metadata-workspace-preview.test.tsx (Modified or Deleted — merge into metadata-production-page.test.tsx)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/metadata-ui renderer implementations (TIP-UI-04), packages/ui edits, manifest/registry edits, @afenda/accounting domain logic, ledger/journal/posting UI, hand-edited /manufacturing routes, className on @afenda/ui primitives
5. Authority    — ADR-0013 Phase 6 — Application Authority + Metadata UI consumption; ADR-0010 accounting shell-only placeholder
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
| 8 | Metadata-driven production ERP page | `pnpm --filter @afenda/erp test:run` |
| 9 | Per-module placeholder UX polish | e2e + unit tests |
| 13 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 14 | TIP status index updated | `pnpm check:documentation-drift` |
| 15 | Drift guard passes | `pnpm check:documentation-drift` |
| 16 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- Full `pnpm ui:guard` gates A–F sign-off may remain blocked on TIP-006 contract freeze — document in completion report if Phase 6 gate checklist item stays open.
- TIP-010 continuation for RBAC on all server actions is orthogonal — do not expand scope in this TIP.

### Slice 4 — shadcn/studio empty-state + card-nav (`@afenda/erp`)

**Status:** Delivered  
**Prerequisite:** Slice 3 delivered — `module-placeholder.copy.contract.ts` + `ModulePlaceholderEmptyState` in runtime evidence; adaptation guide §4.3 + §4.6

#### Design (internal-guide)

- **Upgrade Slice 3 placeholder** — `ModulePlaceholderEmptyState` composes new `ErpEmptyState` (shadcn empty-state-01 synthesis); retire `.erp-module-placeholder` HTML-only chrome in favor of governed `Card` + dashed inner wrapper pattern.
- `ErpEmptyState` — serializable props contract (`satisfies ErpEmptyStateProps`); optional CTA via `mapStockButtonProps` (empty-state-02 pattern); icon from `lucide-react`; **zero** `className` on `@afenda/ui` primitives.
- `ErpCardNavGrid` — card-nav synthesis; nav items from `resolveSystemAdminCardNavItems(visibleSections)` derived from `SYSTEM_ADMIN_SECTIONS` — no hardcoded route arrays.
- Apply `ErpEmptyState` to `(protected)/modules/[moduleId]/page.tsx` (via `ModulePlaceholderEmptyState`) and System Admin scaffold pages `users` + `settings` (read-only zero-data before mutations).
- Optional: render `ErpCardNavGrid` on `settings` page for cross-section navigation when multiple sections visible.
- Layout chrome on plain HTML wrappers + semantic CSS in `globals.css` `@layer components` (`.erp-empty-state`, `.erp-card-nav-grid`).
- afenda-ui-quality Phase 5: one accent color, `prefers-reduced-motion`, visible focus rings.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Adapt shadcn/studio empty-state-01/02 and card-nav patterns into governed ERP surfaces for module placeholders and System Admin scaffolds, upgrading Slice 3 HTML placeholder to Card-based empty state without className on @afenda/ui primitives.
2. Allowed layer— apps/erp/src/app/(protected)/, apps/erp/src/components/, apps/erp/src/lib/modules/, apps/erp/src/lib/system-admin/, apps/erp/src/app/globals.css
3. Files        — apps/erp/src/lib/erp/erp-empty-state.contract.ts (New)
                  apps/erp/src/components/erp-empty-state.tsx (New)
                  apps/erp/src/lib/system-admin/resolve-system-admin-card-nav.ts (New)
                  apps/erp/src/components/erp-card-nav-grid.tsx (New)
                  apps/erp/src/components/module-placeholder-empty-state.tsx (Modified)
                  apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx (Modified)
                  apps/erp/src/app/(protected)/system-admin/users/page.tsx (Modified)
                  apps/erp/src/app/(protected)/system-admin/settings/page.tsx (Modified)
                  apps/erp/src/app/globals.css (Modified)
                  apps/erp/src/components/__tests__/module-placeholder-empty-state.test.tsx (Modified)
                  apps/erp/src/__tests__/erp-empty-state.test.tsx (New)
                  apps/erp/src/__tests__/erp-card-nav-grid.test.tsx (New)
                  apps/erp/src/lib/system-admin/__tests__/resolve-system-admin-card-nav.test.ts (New)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/ui primitive edits, packages/appshell edits, raw shadcn/studio MCP install without normalization, className on @afenda/ui primitives, @afenda/accounting, ledger/journal/posting, application-shell/dashboard-shell/dashboard-sidebar blocks (Rejected), deleting module-placeholder.copy.contract.ts
5. Authority    — ADR-0013 Phase 6 — Application Authority; app-ui-component-adaptation-guide.md §4.3 + §4.6; TIP-004 consumption; ADR-0010 accounting shell-only placeholder
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm ui:guard:hints
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 9 | Per-module placeholder UX polish (empty states) | `pnpm --filter @afenda/erp test:run` |
| 13 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 14 | TIP status index updated | `pnpm check:documentation-drift` |
| 17 | shadcn/studio empty-state + card-nav adapted | `pnpm ui:guard:scan` |

#### Known debt

- Empty-state action dialogs (empty-state-02 dialog trigger) deferred to Slice 8 if invite flow requires modal.
- Settings form-layout (Slice 5) remains separate — this slice only empty-state + card-nav scaffolds.

---

### Slice 5 — shadcn/studio form-layout + account-settings (`@afenda/erp`)

**Status:** Delivered  
**Prerequisite:** Slice 4 delivered — `ErpEmptyState`, `ErpCardNavGrid`, `.erp-settings-context-grid` in runtime evidence; adaptation guide §4.4

#### Design (internal-guide)

- **Replace raw `<dl>` context grid** on settings page with governed form-layout sections; preserve read-only operating-context values as disabled `Input` fields (account-settings pattern).
- Serializable contracts: `system-admin-settings.copy.contract.ts` (section titles/descriptions), `system-admin-settings.schema.ts` (Zod), `resolveSystemAdminSettingsFormValues(operatingContext)` — boundary at server page only.
- `SystemAdminFormSection` — semantic `<section>` + `<h2>` + optional description; field grid chrome in `globals.css` (`.erp-system-admin-form-section`).
- `SystemAdminSettingsForm` — client leaf with `useActionState` + `updateSystemAdminSettingsAction`; **no** react-hook-form; governed `Field`, `FieldLabel`, `Input`, `Label`, `Button` from `@afenda/ui` with zero `className` on primitives.
- Server action validates via Zod + `resolveActionOperatingContext`; returns `ServerActionResult` with scaffold `userMessage` when mutations not wired (no DB writes this slice).
- Keep accounting guard comment on settings page; no COA/journal/ledger fields; preserve `ErpCardNavGrid` from Slice 4.
- Retire redundant `ErpEmptyState` + duplicate readonly `<p>` once form sections render scaffold copy in section descriptions.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Adapt shadcn/studio form-layout and account-settings patterns into governed System Admin settings scaffold with serializable contracts, Zod-validated Server Action, and read-only field rows sourced from operating context.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/, apps/erp/src/components/system-admin/, apps/erp/src/lib/system-admin/, apps/erp/src/lib/server-actions/, apps/erp/src/app/globals.css
3. Files        — apps/erp/src/lib/system-admin/system-admin-settings.copy.contract.ts (New)
                  apps/erp/src/lib/system-admin/system-admin-settings.schema.ts (New)
                  apps/erp/src/lib/system-admin/resolve-system-admin-settings-form-values.ts (New)
                  apps/erp/src/lib/system-admin/update-system-admin-settings.action.ts (New)
                  apps/erp/src/components/system-admin/system-admin-form-section.tsx (New)
                  apps/erp/src/components/system-admin/system-admin-settings-form.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/settings/page.tsx (Modified)
                  apps/erp/src/app/globals.css (Modified)
                  apps/erp/src/lib/system-admin/__tests__/resolve-system-admin-settings-form-values.test.ts (New)
                  apps/erp/src/lib/system-admin/__tests__/update-system-admin-settings.action.test.ts (New)
                  apps/erp/src/__tests__/system-admin-settings-form.test.tsx (New)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/ui edits, packages/metadata-ui renderer work, local permission constants, client-only tenant/context resolvers, className on @afenda/ui primitives, @afenda/accounting, ledger/journal/posting/COA settings fields, actual settings persistence or new API routes
5. Authority    — ADR-0013 Phase 6 — Application Authority; app-ui-component-adaptation-guide.md §4.4; TIP-013 settings scaffold only; existing `ServerActionResult` contract in `server-action-result.ts`
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm ui:guard:hints
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 18 | System Admin form-layout + settings adapted | `pnpm --filter @afenda/erp test:run` |
| 13 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 14 | TIP status index updated | `pnpm check:documentation-drift` |

#### Known debt

- Settings mutations remain scaffold-only until TIP-013 admin API contracts wire persistence (action returns explicit not-implemented message).
- Invite wizard form (Slice 8) reuses `SystemAdminFormSection` pattern — do not over-abstract into packages/ui.

### Slice 6 — Dependency registry + chart KPI blocks (`@afenda/appshell`)

**Status:** Delivered  
**Prerequisite:** Slice 2 delivered; `docs/architecture/dependency-registry.md` updated in this slice before `recharts` install  
**Candidates:** `statistics-component-07`, `statistics-component-08`, `charts-component`, `widgets-component` — **Approved with constraints**

#### Design (internal-guide)

- **Registry first:** add approved edges `@afenda/erp → @afenda/entitlements` (TIP-007A), `@afenda/appshell → recharts` (or `@afenda/erp → recharts` if charts live in ERP only), and third-party `recharts` with ADR-0003 note — then `pnpm quality:architecture` must pass.
- Synthesize statistics/charts/widgets inspiration into **new or extended** blocks under `packages/appshell/src/shadcn-studio/blocks/` — follow `AppShellDashboardKpiStat` pattern (`<article aria-labelledby>`, semantic CSS in `afenda-appshell.css`, zero `className` on `Card`).
- Chart colors: `var(--primary)`, `var(--chart-1)`…`var(--chart-5)` only — no raw OKLCH/hex. `ChartConfig` uses `satisfies ChartConfig`.
- Remove or reduce motion.dev / heavy animation from widgets inspiration (afenda-ui-quality Phase 5).
- Storybook story per new block; do not re-adapt existing 14 blocks listed in adaptation guide §3.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Register recharts dependency, fix missing @afenda/erp→@afenda/entitlements registry edge, and adapt statistics/charts/widgets shadcn/studio patterns into governed AppShell dashboard blocks with Storybook proof.
2. Allowed layer— packages/appshell/src/shadcn-studio/blocks/, packages/appshell/src/afenda-appshell.css, docs/architecture/dependency-registry.md, apps/erp/package.json (recharts dep if ERP-owned)
3. Files        — docs/architecture/dependency-registry.md (Modified)
                  packages/appshell/src/shadcn-studio/blocks/app-shell-dashboard-statistics-sparkline-card.shared.ts (New)
                  packages/appshell/src/shadcn-studio/blocks/app-shell-dashboard-statistics-expense-card.tsx (New)
                  packages/appshell/src/shadcn-studio/blocks/app-shell-dashboard-statistics-income-card.tsx (New)
                  packages/appshell/src/shadcn-studio/blocks/app-shell-dashboard-statistics-expense-card.stories.tsx (New)
                  packages/appshell/src/shadcn-studio/blocks/app-shell-dashboard-statistics-income-card.stories.tsx (New)
                  packages/appshell/src/dashboard/dashboard-metric-widget-definitions.tsx (Modified)
                  packages/appshell/src/__tests__/dashboard-block.stories.test.tsx (Modified)
                  packages/architecture-authority/src/data/dependency-registry.data.ts (Modified)
                  docs/architecture/dependency-snapshot.json (Modified)
                  packages/appshell/src/afenda-appshell.css (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — packages/ui primitive edits without govern-primitive author checklist, raw MCP className on Card/Badge, motion.dev imports, duplicate existing AppShellDashboardKpiStat without variant justification, @afenda/accounting
5. Authority    — ADR-0003 Dependency Governance; ADR-0013 Phase 6; app-ui-component-adaptation-guide.md §4.1; TIP-004 + govern-primitive author layer for any Chart primitive touch
6. Gates        — pnpm quality:architecture
                  pnpm quality:boundaries
                  pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/appshell test:run
                  pnpm --filter @afenda/storybook typecheck
                  pnpm ui:guard
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 19 | Chart KPI blocks governed in AppShell | `pnpm ui:guard` |

#### Known debt

- Full 5-metric grid (statistics-component-08) may ship as follow-on within same slice if timeboxed; minimum deliverable is one income + one expense sparkline card pair.

---

### Slice 7 — shadcn/studio DataTable (`@afenda/erp`)

**Status:** Delivered  
**Prerequisite:** `AdminAuditEventRow` + `listRecentAuditEvents` in runtime evidence (`apps/erp/src/lib/system-admin/list-recent-audit-events.server.ts`); governed `@afenda/ui` `DataTable` exported (`packages/ui/src/components/data-table.tsx`). Register `@tanstack/react-table` for `@afenda/erp` in this slice (Slice 6 recharts registry is orthogonal).  
**Candidates:** `datatable-component-06` — **Approved with constraints** (synthesize via shadcn/studio `/iui` + `/rui`; reference `AppShellDashboardInvoiceTable`, do not duplicate in appshell)

#### Design (internal-guide)

- **Registry first:** add `@afenda/erp → @tanstack/react-table` (ADR-0003; types-only consumer — table chrome from `@afenda/ui` `DataTable`) and `@afenda/erp → @afenda/entitlements` if missing before `pnpm quality:architecture`.
- **Consume** governed `@afenda/ui` `DataTable` + `Table*` primitives — do **not** edit `packages/ui` or add a generic DataTable to ui/appshell.
- Synthesize `datatable-component-06` DNA: sortable column headers (`tabIndex={0}`, Enter/Space, lucide sort icons), client-side sort on server-fetched rows, pagination footer — pattern from `app-shell-dashboard-invoice-table.tsx` without row selection or CSV export.
- `SystemAdminAuditTable` — `"use client"` leaf; `useReactTable` + `DataTable` from `@afenda/ui`; props: `readonly rows: AdminAuditEventRow[]` (boundary-safe, serializable).
- `createSystemAdminAuditColumns()` in `system-admin-audit-table.columns.tsx` — `ColumnDef<AdminAuditEventRow>[]`; `result` column uses governed `Badge` with tone from discriminated `AuditResult`; wrapper `<div className="erp-audit-result-badge">` for layout only.
- Replace raw HTML `<table>` on audit page; zero rows → `ErpEmptyState` (Slice 4) with copy from `system-admin-audit.copy.contract.ts` (`satisfies` record).
- **No** `papaparse` / `xlsx` export; **no** client-side pagination wired to API until TIP-010A cursor params land — client pagination over in-memory server page (limit 50) is acceptable.
- Sortable columns: Time, Module, Result. Target column: plain text + `<code>` in plain HTML wrapper.
- afenda-ui-quality Phase 5: `tabular-nums` on correlation IDs, `prefers-reduced-motion` on sort icon transitions, figure/caption semantics via `AppShellMain` description.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Adapt shadcn/studio datatable-component-06 into a governed System Admin audit list using @tanstack/react-table column defs, @afenda/ui DataTable, and serializable AdminAuditEventRow props — replacing the raw HTML audit table without export libs or className on primitives.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/, apps/erp/src/components/system-admin/, apps/erp/src/lib/system-admin/, apps/erp/src/app/globals.css, docs/architecture/dependency-registry.md
3. Files        — docs/architecture/dependency-registry.md (Modified)
                  apps/erp/package.json (Modified)
                  apps/erp/src/lib/system-admin/system-admin-audit.copy.contract.ts (New)
                  apps/erp/src/components/system-admin/system-admin-audit-table.tsx (New)
                  apps/erp/src/components/system-admin/system-admin-audit-table.columns.tsx (New)
                  apps/erp/src/app/(protected)/system-admin/audit/page.tsx (Modified)
                  apps/erp/src/app/globals.css (Modified)
                  apps/erp/src/__tests__/system-admin-audit-table.test.tsx (New)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/ui edits, packages/appshell block duplication, generic reusable DataTable in packages/ui, papaparse/xlsx, local permission logic in JSX, className on @afenda/ui primitives, @afenda/accounting, ledger/journal/posting UI
5. Authority    — ADR-0003 Dependency Governance; ADR-0013 Phase 6; TIP-013 audit list; TIP-010A pagination contract (deferred API wiring); app-ui-component-adaptation-guide.md §4.2
6. Gates        — pnpm quality:architecture
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm ui:guard:hints
                  pnpm quality:boundaries
                  pnpm check:api-contracts
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 20 | System Admin DataTable adapted | `pnpm quality:architecture`; `pnpm ui:guard:scan` |

#### Known debt

- Server-driven audit pagination (TIP-010A cursor) deferred — table paginates client-side over the initial 50-row server fetch.
- Users list DataTable reuses this pattern in Slice 8 invite wizard context — do not extract to packages until second surface proves reuse.

---

### Slice 9 — Context-switch UX + entity_group expansion (`@afenda/erp`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** TIP-007/012 Slice E delivered — `resolveAllowedContextOptions` expands entity_group memberships

#### Design (internal-guide)

- Serializable `context-switch.copy.contract.ts` — single source for AppShell context switcher labels (default + pending).
- `resolveContextSwitchPresentation` — discriminated presentation (`shouldRender` when targets > 1; pending trigger copy).
- `WorkspaceContextSwitcher` consumes presentation copy; `(protected)/layout.tsx` uses same gate for shell slot wiring.
- No `packages/appshell` contract changes; no `className` on `@afenda/ui` primitives.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Wire governed context-switch UX for entity_group-expanded operating context: serializable copy contracts, presentation resolver, and layout integration without changing AppShell authority contracts.
2. Allowed layer— apps/erp/src/lib/context/, apps/erp/src/components/, apps/erp/src/app/(protected)/
3. Files        — apps/erp/src/lib/context/context-switch.copy.contract.ts (New)
                  apps/erp/src/lib/context/resolve-context-switch-presentation.ts (New)
                  apps/erp/src/lib/context/__tests__/resolve-context-switch-presentation.test.ts (New)
                  apps/erp/src/components/workspace-context-switcher.client.tsx (Modified)
                  apps/erp/src/app/(protected)/layout.tsx (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — packages/ui edits, packages/appshell contract freeze work, manifest/registry edits, @afenda/accounting, ledger/journal/posting, className on @afenda/ui primitives
5. Authority    — ADR-0013 Phase 6 — Application Authority (TIP-004 consumption); TIP-007/012 operating-context resolver
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm check:multi-tenancy-operating-context-resolver
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 5 | Protected dashboard uses governed shell components (context switcher polish) | `pnpm --filter @afenda/erp test:run` |
| 13 | Runtime matrix updated | `pnpm check:documentation-drift` |

#### Known debt

- Slices 10–12 (Gate A stepper, ERP test repair, invite a11y) — **delivered**.

---

### Slice 8 — shadcn/studio multi-step invite + admin dialog (`@afenda/erp`)

**Status:** Delivered  
**Prerequisite:** Slice 5 delivered — `SystemAdminFormSection` + settings scaffold in runtime evidence; adaptation guide §4.5  
**Candidates:** `multi-step-form`, `dashboard-dialog` — **Approved with constraints**

#### Design (internal-guide)

- Step state: discriminated union `type InviteStep = { step: "identity" } | { step: "role"; userId: string } | { step: "confirm"; userId: string; roleId: string }` — no `currentStep: number`.
- Use `Dialog`, `DialogContent`, `DialogHeader`, `Button` from `@afenda/ui` — **must not duplicate** `AppShellActivityDialog` in `packages/appshell/` (extend ERP-local admin dialog instead).
- Submission on confirm step calls governed API `/api/internal/v1/system-admin/users/invite` (TIP-013).
- Client leaf for step transitions; parent Server Component loads roles/memberships.
- afenda-ui-quality: Dialog close returns focus to trigger; loading uses `aria-busy`.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Adapt shadcn/studio multi-step-form and dashboard-dialog patterns into a governed System Admin user-invite wizard without duplicating AppShellActivityDialog or bypassing TIP-013 API contracts.
2. Allowed layer— apps/erp/src/app/(protected)/system-admin/users/, apps/erp/src/components/system-admin/, apps/erp/src/app/globals.css
3. Files        — apps/erp/src/components/system-admin/system-admin-invite-wizard.tsx (New)
                  apps/erp/src/components/system-admin/system-admin-invite-wizard.types.ts (New)
                  apps/erp/src/components/system-admin/system-admin-invite-dialog.tsx (New)
                  apps/erp/src/lib/system-admin/system-admin-invite.copy.contract.ts (New)
                  apps/erp/src/lib/system-admin/list-system-admin-invite-role-options.server.ts (New)
                  apps/erp/src/lib/system-admin/system-admin-invite.client.ts (New)
                  apps/erp/src/app/(protected)/system-admin/users/page.tsx (Modified)
                  apps/erp/src/app/globals.css (Modified)
                  apps/erp/src/lib/erp/erp-empty-state.contract.ts (Modified)
                  apps/erp/src/__tests__/system-admin-invite-wizard.test.tsx (New)
                  apps/erp/src/lib/system-admin/__tests__/system-admin-invite-wizard.types.test.ts (New)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/appshell AppShellActivityDialog duplication, packages/ui edits, boolean step flags, client-only permission checks, className on @afenda/ui primitives, @afenda/accounting
5. Authority    — ADR-0013 Phase 6; TIP-013 invite API; app-ui-component-adaptation-guide.md §4.5
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm ui:guard
                  pnpm check:api-contracts
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 21 | Invite wizard + admin dialog adapted | `pnpm --filter @afenda/erp test:run` |
| 13 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 14 | TIP status index updated | `pnpm check:documentation-drift` |
| 15 | Drift guard passes | `pnpm check:documentation-drift` |
| 16 | Completion report posted | afenda-coding-session §11 |

---

### Slice 10 — UI Gate A stepper storybook normalization (`@afenda/ui`)

**Status:** Delivered  
**Prerequisite:** Slice 8 delivered; `STOCK_SHADCN_PENDING` empty in `primitive-registry.ts`

#### Design (internal-guide)

- Remove `mapStockButtonProps` from `_storybook/stepper` demos — use canonical governed `Button` props (`intent`, `emphasis`, `size`) per `check-design-system-consumption.ts`.
- Storybook-only scope under `packages/ui/src/components/_storybook/stepper/` — no primitive registry changes.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Unblock ui:guard Gate A by migrating stepper storybook demos from mapStockButtonProps to governed Button intent/emphasis props without touching consumer packages.
2. Allowed layer— packages/ui/src/components/_storybook/stepper/
3. Files        — packages/ui/src/components/_storybook/stepper/stepper-vertical-demo.tsx (Modified)
                  packages/ui/src/components/_storybook/stepper/stepper.stories.tsx (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
4. Prohibited   — packages/appshell, apps/erp, STOCK_SHADCN_PENDING registry edits without Architecture approval, @afenda/accounting, className on governed primitives in consumers
5. Authority    — TIP-004 UI Primitive Governance — author layer design-system consumption checker
6. Gates        — pnpm --filter @afenda/ui check:governance
                  pnpm ui:guard
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 22 | UI Gate A stepper storybook bridge removed | `pnpm --filter @afenda/ui check:governance` |

#### Known debt

- None

---

### Slice 11 — ERP test suite repair (`@afenda/erp`)

**Status:** Delivered  
**Prerequisite:** Slices 7–8 delivered

#### Design (internal-guide)

- `server-action-security.test.ts`: accept `export interface ProtectedDemoActionData` — static regex must not require `export type` when interface satisfies serializable boundary.
- `protected-workspace-dashboard.integration.test.tsx`: increase timeout on layout-load test to survive full-suite CI cold start (20s).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Restore full ERP vitest suite green by aligning server-action static contract test with interface export and stabilizing dashboard integration timeout under full-suite load.
2. Allowed layer— apps/erp/src/__tests__/, apps/erp/src/components/__tests__/
3. Files        — apps/erp/src/__tests__/server-action-security.test.ts (Modified)
                  apps/erp/src/components/__tests__/protected-workspace-dashboard.integration.test.tsx (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
4. Prohibited   — packages/ui, packages/appshell, demo-auth-action behavior changes unless test proves defect, @afenda/accounting
5. Authority    — ADR-0013 Phase 6 — Application Authority (server action security contract)
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 23 | ERP test suite green | `pnpm --filter @afenda/erp test:run` |
| 11 | ERP tests pass | `pnpm --filter @afenda/erp test:run` |

#### Known debt

- None

---

### Slice 12 — Invite wizard role radio keyboard association (`@afenda/erp`)

**Status:** Delivered  
**Prerequisite:** Slice 8 delivered — `SystemAdminInviteWizard` in runtime evidence

#### Design (internal-guide)

- Role step wires `htmlFor` + `RadioGroupItem` id — add Vitest proof that `getByLabelText(roleName)` targets the correct radio for keyboard users.
- No `packages/ui` RadioGroup primitive edits.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md

1. Objective    — Prove invite wizard role selection is keyboard-accessible via label-associated RadioGroupItem controls without changing governed primitive source.
2. Allowed layer— apps/erp/src/__tests__/
3. Files        — apps/erp/src/__tests__/system-admin-invite-wizard.test.tsx (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md (Modified)
4. Prohibited   — packages/ui, packages/appshell, className on @afenda/ui primitives, @afenda/accounting
5. Authority    — TIP-004 consumption; afenda-ui-quality Phase 5 accessibility checklist
6. Gates        — pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 24 | Invite wizard role radio keyboard association | `pnpm --filter @afenda/erp test:run` |

#### Known debt

- None

---

## Rejected shadcn/studio patterns (do not implement)

> Source: [`app-ui-component-adaptation-guide.md`](../../architecture/app-ui-component-adaptation-guide.md) §3 + §5. Any implementation PR introducing these patterns must be rejected in review.

| Candidate | Decision | Reason |
|-----------|----------|--------|
| `application-shell`, `dashboard-shell`, `dashboard-sidebar` | **Rejected** | TIP-006 governs all shell chrome — use `@afenda/appshell` `AppShell` |
| `bento-grid` | **Rejected** | Marketing density/structure — wrong for ERP operations |
| All Marketing UI blocks (hero, features, pricing, footer, testimonials, etc.) | **Rejected** | ERP ≠ marketing site |
| All eCommerce blocks (checkout, product-list, shopping-cart, etc.) | **Rejected** | Not in Afenda domain |
| `onboarding-feed` | **Reference only** | Heavy animation; no server rendering path — layout ideas only, no copy |

## Verdict

**Partially Implemented** — Slices 1–12 runtime-proven including chart KPI blocks (6), audit DataTable (7), invite wizard (8), context-switch UX (9), UI Gate A stepper fix (10), ERP test repair (11), and invite role a11y (12). TIP closeout pending final acceptance gate sweep.
