# TIP-007A — Feature Manifest & Module Governance

| Field | Value |
| --- | --- |
| **Status** | Not started |
| **Authority status** | **Accepted** — Architecture Authority slice under TIP-007 (2026-06-23) |
| **Runtime evidence** | `packages/entitlements/src/evaluation/feature-manifest.ts` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 7 — Feature Manifest and Module Governance |
| **Remaining gap** | No manifest → capability → route → nav → placeholder pipeline |

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
- System Admin module configuration UI ([TIP-013](../delivery/tips/[Not started] tip-013-system-admin-control-plane.md))

## Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| FeatureManifestContract | `packages/entitlements/src/evaluation/feature-manifest.ts` | Partial — contract + static catalog |
| Capability registry | — | **No** |
| Route registry from manifest | — | **No** |
| AppShell nav from manifest | — | **No** |
| Module placeholder pages | — | **No** |
| Manifest drift tests | — | **No** |

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
| `packages/entitlements/src/evaluation/capability-registry.ts` | `@afenda/entitlements` | Integration | **New** | Platform Authority |
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

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Manifest + capability + route registry files exist | Deliverables table paths | [ ] |
| 2 | Nav builder + route guard exist | File paths | [ ] |
| 3 | Drift + nav tests pass | `pnpm --filter @afenda/entitlements test:run` | [ ] |
| 4 | AppShell nav tests pass | `pnpm --filter @afenda/appshell test:run` | [ ] |
| 5 | UI guard clean | `pnpm ui:guard:scan` | [ ] |
| 6 | Boundaries clean | `pnpm quality:boundaries` | [ ] |
| 7 | Typecheck clean | `pnpm --filter @afenda/entitlements typecheck` | [ ] |
| 8 | Biome clean | `pnpm ci:biome` | [ ] |
| 9 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [ ] |
| 10 | TIP status index updated | `docs/delivery/tip-status-index.md` | [ ] |
| 11 | Drift guard passes | `pnpm check:documentation-drift` | [ ] |
| 12 | Completion report posted | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Mandatory before code edits.** Three slices — dependency order: entitlements → appshell → erp.

### Slice 1 — Manifest + capability registry (`@afenda/entitlements`)

```
Handoff from: docs/delivery/tips/[Not started] tip-007a-feature-manifest-governance.md (Slice 1)

1. Objective    — Add feature-manifest.registry, capability-registry, module-route-manifest, and drift tests.
2. Allowed layer— packages/entitlements/src/evaluation/
3. Files        — packages/entitlements/src/evaluation/feature-manifest.registry.ts (New)
                  packages/entitlements/src/evaluation/capability-registry.ts (New)
                  packages/entitlements/src/evaluation/module-route-manifest.ts (New)
                  packages/entitlements/src/__tests__/feature-manifest-drift.test.ts (New)
4. Prohibited   — @afenda/accounting module logic, packages/ui, ad-hoc nav strings in erp/appshell
5. Authority    — ADR-0013 Phase 7 — Platform Authority (entitlements)
6. Gates        — pnpm --filter @afenda/entitlements typecheck
                  pnpm --filter @afenda/entitlements test:run
                  pnpm quality:boundaries
```

### Slice 2 — Nav from manifest (`@afenda/appshell`)

```
Handoff from: docs/delivery/tips/[Not started] tip-007a-feature-manifest-governance.md (Slice 2)

1. Objective    — Build AppShell nav from manifest + RBAC; add interaction/render tests.
2. Allowed layer— packages/appshell/src/navigation/
3. Files        — packages/appshell/src/navigation/build-nav-from-manifest.ts (New)
                  packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx (New)
4. Prohibited   — className on @afenda/ui primitives, packages/ui edits, accounting routes
5. Authority    — ADR-0013 Phase 7 — ERP Spine Authority
6. Gates        — pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/appshell test:run
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
```

**Prerequisite:** Slice 1 merged. TIP-006 nav contracts frozen or Architecture approval for contract extension.

### Slice 3 — ERP module routes + guard (`@afenda/erp`)

```
Handoff from: docs/delivery/tips/[Not started] tip-007a-feature-manifest-governance.md (Slice 3)

1. Objective    — Generate placeholder module routes from manifest; enforce 403 on direct access without permission.
2. Allowed layer— apps/erp/src/lib/modules/
3. Files        — apps/erp/src/lib/modules/generate-module-routes.ts (New)
                  apps/erp/src/lib/modules/guard-module-route.server.ts (New)
4. Prohibited   — @afenda/accounting, business domain data, inline tenant lookups
5. Authority    — ADR-0013 Phase 7 — Application Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm check:documentation-drift
```

**Prerequisite:** Slices 1–2 merged.

## Verdict

**Not started** — `FeatureManifestContract` and static catalog exist; manifest-driven navigation, route registry, and RBAC-gated placeholders are not implemented.
