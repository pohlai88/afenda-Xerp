# TIP-007A — Feature Manifest & Module Governance

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Authority status** | **Accepted** — Architecture Authority slice under TIP-007 (2026-06-23) |
| **Runtime evidence** | `apps/erp/src/lib/modules/generate-module-routes.ts` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 7 — Feature Manifest and Module Governance |
| **Remaining gap** | — |

## Purpose

Establish a single governed pipeline:

```text
feature manifest → capability registry → route registry → AppShell nav → RBAC visibility → module placeholder page
```

Adding an ERP module must require a manifest entry only — no ad-hoc route strings in AppShell or ERP app code.

ADR-0013 authority: Foundation Phase 7 gate — adding a module requires manifest entry only.

## Scope

**In scope**

- Single feature source registry in `@afenda/entitlements`
- Domain / module / capability map driving navigation and routes
- Governed nav generation in `@afenda/appshell` from manifest + RBAC
- Module placeholder routes generated from manifest (shell only — no domain logic)
- Direct route access denial when RBAC lacks module permission (403)
- Manifest drift tests
- RBAC-aware dashboard widget registry alignment (read path only)

**Out of scope**

- Business domain logic in module placeholders
- `@afenda/accounting` or PKG-R01–R05 packages (ADR-0010)
- Real entitlement billing enforcement (TIP-039)
- System Admin module configuration UI ([TIP-013](../delivery/tips/[Complete] tip-013-system-admin-control-plane.md))

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| FeatureManifestContract | `packages/entitlements/src/evaluation/feature-manifest.ts` | Yes — Slice 1 |
| Module manifest registry | `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | Yes — Slice 1 |
| Module capability bindings | `packages/entitlements/src/evaluation/module-manifest-capability-registry.ts` | Yes — Slice 1 |
| Route registry from manifest | `packages/entitlements/src/evaluation/module-route-manifest.ts` | Yes — Slice 1 |
| Manifest drift tests | `packages/entitlements/src/__tests__/feature-manifest-drift.test.ts` | Yes — Slice 1 |
| AppShell nav from manifest | `packages/appshell/src/navigation/build-nav-from-manifest.ts` | Yes — Slice 2 |
| Module placeholder pages | `apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx` | Yes — Slice 3 |
| Module route guard | `apps/erp/src/lib/modules/guard-module-route.server.ts` | Yes — Slice 3 |
| ERP manifest nav wiring | `apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts` | Yes — Slice 3 |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/entitlements` (PKG-006) | Feature manifest source, capability evaluation |
| `@afenda/appshell` (PKG-001) | Navigation projection from manifest + permissions |
| `@afenda/permissions` (PKG-014) | RBAC filter on nav items and route guards |
| `@afenda/erp` (PKG-007) | Module placeholder routes wired from manifest |

## Depends on

- TIP-006 AppShell Authority (partial) — nav contracts
- TIP-007 ERP Platform Authority (partial)
- TIP-010 Identity & Authorization (partial)
- TIP-UI-05 ERP App Surfaces (partial) — placeholder route surfaces

## Blocks

- Foundation Phase 7 gate
- Foundation Phase 9 requirement #7 — manifest-driven navigation test
- TIP-UI-05 module placeholder closeout

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `packages/entitlements/src/evaluation/feature-manifest.registry.ts` | `@afenda/entitlements` | Integration | **New** | Platform Authority |
| `packages/entitlements/src/evaluation/module-route-manifest.ts` | `@afenda/entitlements` | Integration | **New** | Platform Authority |
| `packages/entitlements/src/evaluation/module-manifest-capability-registry.ts` | `@afenda/entitlements` | Integration | **New** (Slice 1) | Platform Authority |
| `packages/appshell/src/navigation/build-nav-from-manifest.ts` | `@afenda/appshell` | ERPSpine | **New** | ERP Spine Authority (TIP-006) |
| `packages/entitlements/src/__tests__/feature-manifest-drift.test.ts` | `@afenda/entitlements` | Integration | **New** | — |
| `packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx` | `@afenda/appshell` | ERPSpine | **New** | — |
| `apps/erp/src/lib/modules/generate-module-routes.ts` | `@afenda/erp` | Application | **New** | Application Authority |
| `apps/erp/src/lib/modules/guard-module-route.server.ts` | `@afenda/erp` | Application | **New** | Application Authority |

## Acceptance gate

- `pnpm --filter @afenda/entitlements test:run`
- `pnpm --filter @afenda/appshell test:run`
- `pnpm --filter @afenda/erp test:run`
- `pnpm ui:guard:scan`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN the feature manifest includes module HRM
AND   the user is signed in under Tenant A
AND   the user has RBAC permission for HRM module access
WHEN  the AppShell navigation renders
THEN  HRM appears in the navigation
AND   no ad-hoc string literals for module IDs exist outside governed unions

GIVEN the feature manifest includes module HRM
AND   the user is signed in under Tenant A
AND   the user does NOT have RBAC permission for HRM module access
WHEN  the AppShell navigation renders
THEN  HRM is hidden
AND   direct route access to the HRM placeholder returns 403 Forbidden
AND   an audit event records the denial with actor and correlation ID

GIVEN a developer adds a new module entry to the manifest only
WHEN  generate-module-routes materializes routes
THEN  a placeholder page exists without hand-editing route strings in apps/erp
AND   the surface contains no business domain logic

GIVEN Phase 9 Accounting Readiness Gate has NOT passed
WHEN  the manifest references module accounting
THEN  the accounting route renders a shell placeholder only
AND   no ledger, journal, or posting logic is introduced
```

### Acceptance criteria proof

| Scenario | Proof |
| --- | --- |
| HRM visible in nav (RBAC granted) | `packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx`; `apps/erp/src/lib/modules/__tests__/resolve-manifest-navigation.server.test.ts`; `apps/erp/e2e/feature-manifest-navigation.spec.ts` |
| No ad-hoc module route strings in ERP | `apps/erp/src/lib/modules/__tests__/feature-manifest-acceptance.test.ts` |
| HRM hidden + 403 on direct route | `resolve-manifest-navigation.server.test.ts`; `apps/erp/e2e/feature-manifest-navigation.spec.ts` (workspace reader) |
| Audit on denial (actor + correlation ID) | `apps/erp/src/lib/modules/__tests__/guard-module-route.audit.test.ts` |
| Manifest-only route materialization | `generate-module-routes.test.ts`; `feature-manifest-acceptance.test.ts`; dynamic `(protected)/modules/[moduleId]/page.tsx` |
| Accounting shell placeholder only | `feature-manifest-acceptance.test.ts`; `apps/erp/e2e/feature-manifest-navigation.spec.ts` |

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Manifest + capability + route registry files exist | Deliverables table paths | [x] |
| 2 | Nav builder + route guard exist | File paths | [x] |
| 3 | Drift + nav tests pass | `pnpm --filter @afenda/entitlements test:run` | [x] |
| 4 | AppShell nav tests pass | `pnpm --filter @afenda/appshell test:run` | [x] |
| 5 | UI guard clean | `pnpm ui:guard:scan` | [x] |
| 6 | Boundaries clean | `pnpm quality:boundaries` | [x] |
| 7 | Typecheck clean | `pnpm --filter @afenda/entitlements typecheck` | [x] |
| 8 | Biome clean | `pnpm ci:biome` | [x] |
| 9 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] |
| 10 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] |
| 11 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 12 | Completion report posted | afenda-coding-session §11 | [x] |

## Handoff to implementation

> **Mandatory before code edits.** Three slices — dependency order: entitlements → appshell → erp.

### Slice 1 — Manifest + capability registry (`@afenda/entitlements`)

**Status:** Delivered (uncommitted)  
**Prerequisite:** TIP-010A runtime evidence row `apps/erp/src/server/api/contracts/` = `implemented` in `afenda-runtime-truth-matrix.md` (no prior TIP-007A slice)

#### Design (internal-guide)

- `evaluation/capability-registry.ts` already owns TIP-008 entitlement-evaluation capabilities — do **not** overwrite; add `module-manifest-capability-registry.ts` for module→permission→evaluation-capability bindings.
- `feature-manifest.registry.ts` is the single source for governed `ErpModuleId`, labels, routes, permission keys, and entitlement requirements; `module-route-manifest.ts` is a serializable route projection only.
- Permission keys use `@afenda/database` `createPermissionKey` at definition time (shape-safe); drift tests assert optional capability keys exist in the evaluation registry.
- `feature-manifest.ts` keeps `FeatureManifestContract` + `featureManifests` as a backward-compatible projection from the registry (no duplicate catalog).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-007a-feature-manifest-governance.md

1. Objective    — Establish governed ERP module manifest, module→permission capability bindings, route projection, and drift tests in @afenda/entitlements without touching AppShell or ERP wiring.
2. Allowed layer— packages/entitlements/src/evaluation/
3. Files        — packages/entitlements/src/evaluation/feature-manifest.registry.ts (New)
                  packages/entitlements/src/evaluation/module-manifest-capability-registry.ts (New)
                  packages/entitlements/src/evaluation/module-route-manifest.ts (New)
                  packages/entitlements/src/evaluation/feature-manifest.ts (Modified)
                  packages/entitlements/src/index.ts (Modified)
                  packages/entitlements/src/__tests__/feature-manifest-drift.test.ts (New)
                  docs/delivery/tips/[Partially Implemented] tip-007a-feature-manifest-governance.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting module logic, ledger/journal/COA/posting, packages/ui, packages/appshell, apps/erp, ADR-0010 Accounting Core packages, overwriting evaluation/capability-registry.ts, ad-hoc nav/route strings outside governed unions
5. Authority    — ADR-0013 Phase 7 — Platform Authority (entitlements)
6. Gates        — pnpm --filter @afenda/entitlements typecheck
                  pnpm --filter @afenda/entitlements test:run
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 1 | Manifest + capability + route registry files exist | `pnpm --filter @afenda/entitlements test:run` |
| 3 | Drift tests pass | `pnpm --filter @afenda/entitlements test:run` |
| 7 | Typecheck clean | `pnpm --filter @afenda/entitlements typecheck` |
| 8 | Biome clean | `pnpm ci:biome` |
| 9 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 10 | TIP status index updated | `pnpm check:documentation-drift` |
| 11 | Drift guard passes | `pnpm check:documentation-drift` |

#### Known debt

- AppShell nav and ERP route guards deferred to Slices 2–3; permission keys are shape-validated only (not cross-checked against `@afenda/permissions` PERMISSION_REGISTRY until appshell/erp consume the manifest).

### Slice 2 — Nav from manifest (`@afenda/appshell`)

**Status:** Delivered (uncommitted)  
**Prerequisite:** Slice 1 runtime evidence row `packages/entitlements/src/evaluation/feature-manifest.registry.ts` = `partially-implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- `@afenda/appshell` must **not** import `@afenda/entitlements` or `@afenda/permissions` (architecture boundary) — manifest rows and granted permission keys are injected by the ERP host at the server boundary.
- `ManifestModuleId` mirrors `@afenda/entitlements` `ErpModuleId`; drift is enforced in tests via a fixed union + fixture alignment, not a runtime cross-package import.
- `buildManifestNavigation` returns `AppShellNavItemSerializable[]` (JSON-safe); `hydrateManifestNavigation` resolves icons at the client boundary via existing `resolveAppShellNavIcon`.
- RBAC visibility: include a module nav item only when `grantedPermissionKeys.has(entry.permissionKey)`.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-007a-feature-manifest-governance.md

1. Objective    — Project manifest module rows + granted permission keys into governed, RBAC-filtered AppShell navigation items without importing entitlements or permissions packages.
2. Allowed layer— packages/appshell/src/navigation/
3. Files        — packages/appshell/src/navigation/build-nav-from-manifest.ts (New)
                  packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx (New)
                  packages/appshell/src/index.ts (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-007a-feature-manifest-governance.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — className on @afenda/ui primitives, packages/ui edits, apps/erp module routes, @afenda/accounting, ledger/journal/COA/posting, ADR-0010 Accounting Core packages, importing @afenda/entitlements or @afenda/permissions into appshell runtime deps
5. Authority    — ADR-0013 Phase 7 — ERP Spine Authority (TIP-006 navigation projection)
6. Gates        — pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/appshell test:run
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 2 | Nav builder exists | `pnpm --filter @afenda/appshell test:run` |
| 4 | AppShell nav tests pass | `pnpm --filter @afenda/appshell test:run` |
| 5 | UI guard clean | `pnpm ui:guard:scan` |
| 6 | Boundaries clean | `pnpm quality:boundaries` |
| 7 | Typecheck clean | `pnpm --filter @afenda/appshell typecheck` |
| 8 | Biome clean | `pnpm ci:biome` |
| 9 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 10 | TIP status index updated | `pnpm check:documentation-drift` |
| 11 | Drift guard passes | `pnpm check:documentation-drift` |

#### Known debt

- Permission keys are matched via `@afenda/permissions` `checkPermission` in ERP wiring (Slice 3).

### Slice 3 — ERP module routes + guard (`@afenda/erp`)

**Status:** Delivered (uncommitted)  

#### Design (internal-guide)

- Add approved `@afenda/erp` → `@afenda/entitlements` dependency edge; `generate-module-routes.ts` reads canonical manifest/route projection only (no ad-hoc path strings).
- Single dynamic route `(protected)/modules/[moduleId]/page.tsx` materializes all manifest modules; adding a manifest entry requires no hand-edited route files.
- `guard-module-route.server.ts` uses `@afenda/permissions` `checkPermission` + operating context; denial emits ERP audit/log with correlation ID (acceptance gherkin).
- `resolve-manifest-navigation.server.ts` bridges entitlements manifest → appshell `buildHydratedManifestNavigation` in protected layout (closes Slice 2 known debt).
- Placeholder pages use `AppShellMain` shell copy only — no accounting/ledger logic (ADR-0010).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-007a-feature-manifest-governance.md

1. Objective    — Materialize manifest-driven module placeholder routes with RBAC guards, audit on denial, and protected-layout nav wiring from entitlements + permissions.
2. Allowed layer— apps/erp/src/lib/modules/
3. Files        — apps/erp/src/lib/modules/generate-module-routes.ts (New)
                  apps/erp/src/lib/modules/guard-module-route.server.ts (New)
                  apps/erp/src/lib/modules/resolve-manifest-navigation.server.ts (New)
                  apps/erp/src/lib/modules/__tests__/generate-module-routes.test.ts (New)
                  apps/erp/src/lib/modules/__tests__/guard-module-route.server.test.ts (New)
                  apps/erp/src/app/(protected)/modules/[moduleId]/page.tsx (New)
                  apps/erp/src/app/(protected)/layout.tsx (Modified)
                  apps/erp/package.json (Modified)
                  packages/architecture-authority/src/data/dependency-registry.data.ts (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-007a-feature-manifest-governance.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, ledger/journal/COA/posting, packages/ui edits, packages/appshell edits, ADR-0010 Accounting Core packages, inline tenant lookups, ad-hoc module route strings outside manifest
5. Authority    — ADR-0013 Phase 7 — Application Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 2 | Nav builder + route guard exist | `pnpm --filter @afenda/erp test:run` |
| 9 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 10 | TIP status index updated | `pnpm check:documentation-drift` |
| 11 | Drift guard passes | `pnpm check:documentation-drift` |
| 12 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- ~~Full acceptance gherkin E2E (nav render + 403 in browser) deferred to manual/Playwright pass~~ — covered by `apps/erp/e2e/feature-manifest-navigation.spec.ts` (admin + workspace reader fixtures).
- Module-specific placeholder UX polish remains TIP-UI-05 scope.

## Verdict

**Complete** — Manifest → capability → route → nav → RBAC guard → placeholder pipeline is implemented across `@afenda/entitlements`, `@afenda/appshell`, and `@afenda/erp`. E2E browser proof and module UX polish remain TIP-UI-05 / Playwright follow-up.
