# TIP-006 — AppShell Authority

| Field | Value |
| --- | --- |
| **Status** | **Complete** |
| **Authority status** | Frozen — ADR-0001 AppShell authority contracts + public API alignment delivered |
| **Runtime evidence** | `packages/appshell/` — 93 `.tsx`, `src/contracts/`, `src/styles/afenda-appshell.css`, shadcn-studio blocks, dashboard canvas, 305 tests |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 1 — Platform Authority Contracts ([`pre-accounting-foundation-roadmap.md`](../../architecture/pre-accounting-foundation-roadmap.md) — Foundation Phase 1 Architecture Authority) |
| **Remaining gap** | None for TIP-006 scope — production ERP shell polish (TIP-012 / TIP-UI-03) tracked separately |

## Purpose

Freeze AppShell governance before further shell UI work and before business domains expand. TIP-006 defines ownership for navigation, workspace context, command center, and shell layout — without building new ERP modules.

ADR-0001 authority:

> **Acceptance Gate:** AppShell architecture is frozen.

ADR-0001 deliverables: AppShell Contract, Navigation Contract, Context Contract, Command Center Contract — defining navigation ownership, shell ownership, workspace ownership, context ownership, and command ownership.

## Scope

**In scope**

- AppShell authority contract (`appshell-authority.contract.ts`)
- Navigation contract (nav item ownership, permission metadata, manifest projection types)
- Context contract (tenant / company / organization workspace switching — consume-only surface)
- Command center contract (search / command palette slot ownership)
- Contract tests under `packages/appshell/src/contracts/__tests__/`
- Alignment of existing shell types (`app-shell.types.ts`, navigation builder, context registry) with frozen contracts
- Delivery evidence and acceptance tests for contracts

**Out of scope**

- New ERP business modules
- Metadata UI renderers (TIP-UI-04)
- Token migration closeout (TIP-UI-03) — tracked separately; `afenda-appshell.css` runtime partial
- Permission engine implementation (TIP-010)
- Production ERP `(protected)` layout shell wiring (TIP-012)
- `@afenda/accounting` or PKG-R01–R05 packages (ADR-0010)

## Runtime evidence (2026-06-24)

| Artifact | Path | Proven |
| --- | --- | --- |
| Shell CSS (token-aligned) | `packages/appshell/src/styles/afenda-appshell.css` | Yes |
| Application shell root | `packages/appshell/src/app-shell.tsx` | Yes |
| Shell types (operating context + identity) | `packages/appshell/src/app-shell.types.ts` | **Yes — Slice 3** (re-exports `contracts/context.contract.ts`) |
| Governed UI blocks (shadcn-studio) | `packages/appshell/src/shadcn-studio/blocks/` (39 block files) | Yes |
| Context surface registry | `packages/appshell/src/context/appshell-context-surface-registry.ts` | **Yes — Slice 3** (re-exports `contracts/context.contract.ts`) |
| Manifest nav builder (TIP-007A Slice 2) | `packages/appshell/src/navigation/build-nav-from-manifest.ts` | Yes |
| Nav builder tests | `packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx` | Yes |
| Dashboard canvas + widget contracts | `packages/appshell/src/dashboard/app-shell-dashboard-canvas.client.tsx`, `dashboard-layout.contract.ts`, `dashboard-widget.contract.ts` | Yes — dashboard scoped only |
| Package tests | `packages/appshell/src/__tests__/` (43 test files) | Yes |
| Package public API | `packages/appshell/src/index.ts` | **Yes — Slice 3** (authority contracts exported) |
| Authority contracts directory | `packages/appshell/src/contracts/` | **Yes — Slice 1** |
| Contract test suite | `packages/appshell/src/contracts/__tests__/` | **Yes — Slice 2** |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/appshell` (PKG-001) | AppShell authority contracts + shell implementation (ERPSpine) |

## Depends on

- TIP-001 Architecture Authority (Complete) — layer and dependency enforcement
- TIP-003 Design System Authority (partial) — token and primitive ownership
- TIP-004 Design System Contracts (partial) — governed UI consumption (zero `className` on `@afenda/ui`)

## Blocks

- Foundation Phase 1 gate — TIP-006/007/008A contracts frozen ([`pre-accounting-foundation-roadmap.md`](../../architecture/pre-accounting-foundation-roadmap.md))
- TIP-UI-03 AppShell Token Migration (closeout)
- TIP-012 ERP Operating Spine (shell context integration in `(protected)` layout)
- TIP-007A Feature Manifest (nav builder delivered; authority contracts frozen)

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `packages/appshell/src/styles/afenda-appshell.css` | `@afenda/appshell` | ERPSpine | **Modified** | ERP Spine Authority |
| `packages/appshell/src/app-shell.tsx` | `@afenda/appshell` | ERPSpine | **Modified** | ERP Spine Authority |
| `packages/appshell/src/app-shell.types.ts` | `@afenda/appshell` | ERPSpine | **Modified** | ERP Spine Authority |
| `packages/appshell/src/shadcn-studio/blocks/` | `@afenda/appshell` | ERPSpine | **Modified** | ERP Spine Authority (TIP-004) |
| `packages/appshell/src/context/appshell-context-surface-registry.ts` | `@afenda/appshell` | ERPSpine | **Modified** | ERP Spine Authority |
| `packages/appshell/src/navigation/build-nav-from-manifest.ts` | `@afenda/appshell` | ERPSpine | **New** (TIP-007A Slice 2) | ERP Spine Authority |
| `packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx` | `@afenda/appshell` | ERPSpine | **New** | — |
| `packages/appshell/src/dashboard/dashboard-layout.contract.ts` | `@afenda/appshell` | ERPSpine | **Modified** | ERP Spine Authority |
| `packages/appshell/src/dashboard/dashboard-widget.contract.ts` | `@afenda/appshell` | ERPSpine | **Modified** | ERP Spine Authority |
| `packages/appshell/src/contracts/appshell-authority.contract.ts` | `@afenda/appshell` | ERPSpine | **New** (Slice 1) | ERP Spine Authority |
| `packages/appshell/src/contracts/navigation.contract.ts` | `@afenda/appshell` | ERPSpine | **New** (Slice 1) | ERP Spine Authority |
| `packages/appshell/src/contracts/context.contract.ts` | `@afenda/appshell` | ERPSpine | **New** (Slice 1) | ERP Spine Authority |
| `packages/appshell/src/contracts/command-center.contract.ts` | `@afenda/appshell` | ERPSpine | **New** (Slice 1) | ERP Spine Authority |
| `packages/appshell/src/contracts/__tests__/appshell-authority.contract.test.ts` | `@afenda/appshell` | ERPSpine | **New** (Slice 2) | — |
| `packages/appshell/src/contracts/__tests__/navigation.contract.test.ts` | `@afenda/appshell` | ERPSpine | **New** (Slice 2) | — |
| `packages/appshell/src/contracts/__tests__/context.contract.test.ts` | `@afenda/appshell` | ERPSpine | **New** (Slice 2) | — |
| `packages/appshell/src/contracts/__tests__/command-center.contract.test.ts` | `@afenda/appshell` | ERPSpine | **New** (Slice 2) | — |
| `packages/appshell/src/index.ts` | `@afenda/appshell` | ERPSpine | Modified (Slice 3) | ERP Spine Authority |

## Acceptance gate

- `pnpm --filter @afenda/appshell typecheck`
- `pnpm --filter @afenda/appshell test:run`
- `pnpm ui:guard:scan`
- `pnpm quality:boundaries`
- `pnpm ci:biome`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN the AppShell authority contracts are registered under packages/appshell/src/contracts/
WHEN a developer adds a new nav item kind, context field, or command-center action type
THEN the change requires a contract update and contract test
AND no ad-hoc string literals for nav IDs or shell slot names exist outside governed unions

GIVEN the navigation contract defines ManifestModuleId and AppShellNavItemSerializable shapes
WHEN buildManifestNavigation projects manifest rows with granted permission keys
THEN nav items include only modules the actor may access
AND the builder does not import @afenda/entitlements or @afenda/permissions at runtime

GIVEN the context contract enforces consume-context-only
WHEN AppShell renders tenant, legal entity, or workspace chrome
THEN shell components receive pre-resolved serializable labels from the host
AND AppShell never resolves tenant, grant, or database authority

GIVEN the command center contract defines governed slot and trigger ownership
WHEN the header command-center region renders
THEN search and command palette behavior is owned by the contract type
AND host wiring passes actions through contract-defined props only

GIVEN Foundation Phase 1 gate requires TIP-006 contracts frozen
WHEN pnpm --filter @afenda/appshell test:run completes
THEN all contract tests pass
AND afenda-runtime-truth-matrix AppShell row shows authority contracts proven
```

### Acceptance criteria proof

| Scenario | Proof |
| --- | --- |
| Shell CSS + blocks render | `packages/appshell/src/__tests__/app-shell.render.test.tsx`; `packages/appshell/src/__tests__/css-manifest.test.ts` |
| Governed UI consumption (TIP-004) | `packages/appshell/src/__tests__/governed-ui-consumption.test.ts`; `pnpm ui:guard:scan` |
| Manifest nav RBAC projection | `packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx` |
| Context consume-only surface | `packages/appshell/src/__tests__/appshell-context-surface-registry.test.ts` |
| Dashboard widget contracts | `packages/appshell/src/__tests__/dashboard-layout.test.ts`; `packages/appshell/src/__tests__/dashboard-widget-render-context.test.ts` |
| Authority contracts frozen | **Yes — Slice 1** — `packages/appshell/src/contracts/` |
| Phase 1 gate contract tests | **Yes — Slice 2** — `packages/appshell/src/contracts/__tests__/` |
| Public API authority exports | **Yes — Slice 3** — `packages/appshell/src/index.ts` re-exports `contracts/` |

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Shell CSS + core components exist | Runtime evidence table | [x] |
| 2 | shadcn-studio blocks + dashboard canvas exist | `packages/appshell/src/shadcn-studio/blocks/`; `packages/appshell/src/dashboard/` | [x] |
| 3 | Manifest nav builder exists (TIP-007A) | `build-nav-from-manifest.ts` + tests | [x] |
| 4 | Context surface registry exists | `appshell-context-surface-registry.ts` | [x] |
| 5 | Four authority contract files under `contracts/` | Deliverables table paths | [x] |
| 6 | Contract tests pass | `pnpm --filter @afenda/appshell test:run` | [x] |
| 7 | Existing shell types aligned to frozen contracts | Contract test assertions + type exports | [x] |
| 8 | UI guard clean | `pnpm ui:guard:scan` | [x] |
| 9 | Boundaries clean | `pnpm quality:boundaries` | [x] |
| 10 | Typecheck clean | `pnpm --filter @afenda/appshell typecheck` | [x] |
| 11 | Biome clean | `pnpm ci:biome` | [x] |
| 12 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] |
| 13 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] |
| 14 | Drift guard passes post-freeze | `pnpm check:documentation-drift` | [x] |
| 15 | Completion report posted | afenda-coding-session §11 | [x] |

## Handoff to implementation

> **Mandatory before code edits.** Three slices — dependency order: contracts freeze → contract tests → public API alignment.

### Slice 1 — Authority contracts freeze (`@afenda/appshell`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** TIP-001 Complete; TIP-004 governed UI policy operational (`pnpm ui:guard:scan` passing)

#### Design (internal-guide)

- Create `packages/appshell/src/contracts/` as the **single authority surface** for shell governance — dashboard-scoped contracts in `dashboard/*.contract.ts` remain but must re-export or extend frozen authority types where overlapping.
- `appshell-authority.contract.ts` owns shell slot names, chrome regions, and `ApplicationShellGovernedComponents` registry shapes — no runtime React imports.
- `navigation.contract.ts` consolidates `AppShellNavItemSerializable`, `ManifestModuleId`, and permission metadata types currently split across `build-nav-from-manifest.ts` and `shadcn-studio/data/app-shell.data.ts`.
- `context.contract.ts` freezes `ApplicationShellOperatingContext`, `ApplicationShellIdentity`, and consume-only rules from `appshell-context-surface-registry.ts`.
- `command-center.contract.ts` owns header command-center slot props (search dialog trigger, palette action descriptors) — align with `app-shell-header.tsx` and `app-shell-search-dialog.tsx`.
- Contracts are **serializable TypeScript types + const unions only** — no `@afenda/entitlements`, `@afenda/permissions`, or `@afenda/database` runtime imports in `@afenda/appshell`.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-006-appshell-authority.md

1. Objective    — Freeze AppShell authority, navigation, context, and command-center contracts under packages/appshell/src/contracts/ per ADR-0001 without changing shell UI behavior.
2. Allowed layer— packages/appshell/src/contracts/
3. Files        — packages/appshell/src/contracts/appshell-authority.contract.ts (New)
                  packages/appshell/src/contracts/navigation.contract.ts (New)
                  packages/appshell/src/contracts/context.contract.ts (New)
                  packages/appshell/src/contracts/command-center.contract.ts (New)
                  packages/appshell/src/contracts/index.ts (New)
                  docs/delivery/tips/[Partially Implemented] tip-006-appshell-authority.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/ui edits, apps/erp layout wiring, @afenda/accounting, ledger/journal/COA/posting, ADR-0010 Accounting Core packages, importing @afenda/entitlements or @afenda/permissions into appshell runtime deps, className on @afenda/ui primitives
5. Authority    — ADR-0001 Phase 1 — ERP Spine Authority (PKG-001)
6. Gates        — pnpm --filter @afenda/appshell typecheck
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 5 | Four authority contract files under `contracts/` | File paths exist |
| 12 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 13 | TIP status index updated | `pnpm check:documentation-drift` |

#### Known debt

- Existing types in `app-shell.types.ts`, `build-nav-from-manifest.ts`, and `appshell-context-surface-registry.ts` remain source-of-truth for runtime until Slice 3 re-exports from contracts.

### Slice 2 — Contract tests (`@afenda/appshell`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 1 runtime evidence row `packages/appshell/src/contracts/` = `partially-implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- One test file per contract asserting: governed union completeness, no duplicate type definitions outside contracts, and snapshot of exported contract symbols.
- Navigation contract tests assert `ManifestModuleId` alignment with `@afenda/entitlements` `ErpModuleId` via **fixture union** (no runtime cross-package import in appshell).
- Context contract tests assert `APPSHELL_CONTEXT_SURFACE_RULE` and consumption module paths match registry.
- Command center contract tests assert header slot prop shapes match `app-shell-header.tsx` usage.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-006-appshell-authority.md

1. Objective    — Add contract test suite proving frozen authority types, union governance, and alignment with existing shell implementation.
2. Allowed layer— packages/appshell/src/contracts/__tests__/
3. Files        — packages/appshell/src/contracts/__tests__/appshell-authority.contract.test.ts (New)
                  packages/appshell/src/contracts/__tests__/navigation.contract.test.ts (New)
                  packages/appshell/src/contracts/__tests__/context.contract.test.ts (New)
                  packages/appshell/src/contracts/__tests__/command-center.contract.test.ts (New)
                  docs/delivery/tips/[Partially Implemented] tip-006-appshell-authority.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — packages/ui edits, apps/erp, @afenda/accounting, ADR-0010 Accounting Core packages, runtime imports of entitlements/permissions into appshell
5. Authority    — ADR-0001 Phase 1 — ERP Spine Authority (PKG-001)
6. Gates        — pnpm --filter @afenda/appshell test:run
                  pnpm --filter @afenda/appshell typecheck
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 6 | Contract tests pass | `pnpm --filter @afenda/appshell test:run` |
| 7 | Existing shell types aligned to frozen contracts | `pnpm --filter @afenda/appshell test:run` |
| 8 | UI guard clean | `pnpm ui:guard:scan` |
| 9 | Boundaries clean | `pnpm quality:boundaries` |
| 10 | Typecheck clean | `pnpm --filter @afenda/appshell typecheck` |
| 11 | Biome clean | `pnpm ci:biome` |
| 14 | Drift guard passes | `pnpm check:documentation-drift` |

#### Known debt

- ERP production shell wiring and Phase 6 token migration closeout remain TIP-012 / TIP-UI-03 scope.

### Slice 3 — Public API alignment (`@afenda/appshell`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 2 contract tests green

#### Design (internal-guide)

- Re-export frozen contract types from `packages/appshell/src/index.ts` as the canonical public API.
- Refactor `app-shell.types.ts`, `build-nav-from-manifest.ts`, and `appshell-context-surface-registry.ts` to import types from `contracts/` — behavior unchanged, types centralized.
- Update `navigation/__tests__/build-nav-from-manifest.test.tsx` and context registry tests to import from contracts.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-006-appshell-authority.md

1. Objective    — Align existing shell implementation types with frozen contracts and export authority surface from package index.
2. Allowed layer— packages/appshell/src/ (contracts consumers only — no UI behavior changes)
3. Files        — packages/appshell/src/index.ts (Modified)
                  packages/appshell/src/app-shell.types.ts (Modified)
                  packages/appshell/src/navigation/build-nav-from-manifest.ts (Modified)
                  packages/appshell/src/context/appshell-context-surface-registry.ts (Modified)
                  packages/appshell/src/shadcn-studio/data/app-shell.data.ts (Modified — type re-exports only)
                  docs/delivery/tips/[Complete] tip-006-appshell-authority.md (Modified — status promotion)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/ui edits, apps/erp, visual/CSS changes, @afenda/accounting, ADR-0010 Accounting Core packages, new shell features
5. Authority    — ADR-0001 Phase 1 — ERP Spine Authority (PKG-001)
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
| 7 | Existing shell types aligned to frozen contracts | `pnpm --filter @afenda/appshell test:run` |
| 12 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 13 | TIP status index updated | `pnpm check:documentation-drift` |
| 14 | Drift guard passes | `pnpm check:documentation-drift` |
| 15 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- Production ERP `(protected)` ApplicationShell integration — TIP-012.
- Full token migration sign-off — TIP-UI-03 (Slice 2 blocked on TIP-UI-05 only).

### Slice 4 — Post-completion drift hardening (`@afenda/appshell`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 3 delivered; `packages/appshell/` = `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Add compile-time + runtime drift guards proving package index and runtime shims re-export contract constants by reference (not copies).
- Consolidate duplicate assignability helpers into `contracts/__tests__/type-assignability.ts`.
- Sync downstream docs that still referenced TIP-006 as Partial (roadmap, master plan, TIP-UI-03, drift registry).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Complete] tip-006-appshell-authority.md

1. Objective    — Harden TIP-006 post-completion by adding public API drift guards and syncing stale cross-doc references to Complete status without changing shell behavior.
2. Allowed layer— packages/appshell/src/contracts/__tests__/
3. Files        — packages/appshell/src/contracts/__tests__/type-assignability.ts (New)
                  packages/appshell/src/contracts/__tests__/contract-public-api-drift.test.ts (New)
                  packages/appshell/src/contracts/__tests__/navigation.contract.test.ts (Modified)
                  packages/appshell/src/contracts/__tests__/context.contract.test.ts (Modified)
                  docs/delivery/tips/[Complete] tip-006-appshell-authority.md (Modified)
                  docs/architecture/pre-accounting-foundation-roadmap.md (Modified)
                  docs/architecture/_afenda-erp-master-plan.llms.md (Modified)
                  docs/architecture/afenda-documentation-drift-audit.md (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-ui-03-appshell-token-migration.md (Modified)
                  scripts/governance/documentation-drift-registry.mts (Modified)
4. Prohibited   — packages/ui edits, apps/erp layout wiring, visual/CSS changes, @afenda/accounting, ledger/journal/COA/posting, ADR-0010 Accounting Core packages, new shell features
5. Authority    — ADR-0001 Phase 1 — ERP Spine Authority (PKG-001)
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
| 14 | Drift guard passes post-freeze | `pnpm check:documentation-drift` |

#### Known debt

- ERP production shell wiring — TIP-012 / TIP-UI-05.
- Repo-wide `pnpm ci:biome` debt outside `@afenda/appshell` touched paths.

## Verdict

**Complete** — AppShell authority frozen under `packages/appshell/src/contracts/` (Slices 1–2), runtime types centralized via contract re-exports (Slice 3), public API drift guards and cross-doc sync (Slice 4), and authority surface exported from `@afenda/appshell` package index. Phase 1 AppShell gate satisfied; ERP production polish remains TIP-012 / TIP-UI-03 / TIP-UI-05 scope.
