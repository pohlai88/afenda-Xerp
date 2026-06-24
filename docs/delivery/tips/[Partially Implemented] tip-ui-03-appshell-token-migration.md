# TIP-UI-03 — AppShell Token Migration

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **Authority status** | Runtime delivered — closeout pending TIP-UI-05 ERP shell sign-off (TIP-006 contracts Complete) |
| **Runtime evidence** | `packages/appshell/src/styles/afenda-appshell.css`, `packages/appshell/src/__tests__/css-manifest.test.ts` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 4 — UI Implementation ([`pre-accounting-foundation-roadmap.md`](../../architecture/pre-accounting-foundation-roadmap.md) Phase 6 — Design, UI, AppShell, and Metadata UI Governance; TIP-UI-03 row) |
| **Remaining gap** | Production ERP ApplicationShell integration + visual regression sign-off (TIP-UI-05) |

## Purpose

Migrate `@afenda/appshell` from legacy CSS Modules and hardcoded color values to a single governed, token-aligned shell stylesheet (`afenda-appshell.css`) that consumes `@afenda/design-system` / `@afenda/ui` CSS custom properties via `var()` — eliminating color drift between shell chrome and governed `@afenda/ui` primitives.

TIP-004 authority: AppShell is a **consumer** layer — shell structural classes live in `afenda-appshell.css`; primitives remain in `@afenda/ui` with zero consumer `className`.

## Scope

**In scope**

- Single shell CSS entrypoint (`afenda-appshell.css`) replacing `app-shell.module.css`
- CSS manifest registration and budget enforcement (one CSS file per package)
- Token consumption via upstream import order (`afenda-ui.css` → `afenda-appshell.css`)
- Shell-scoped custom properties under `--app-shell-*` namespace only
- CSS manifest + governance tests (no hex, no token redefinition, no `@theme inline`)
- Downstream import wiring in ERP `globals.css`, Storybook preview, and metadata-ui craft preview
- Visual regression baseline via existing AppShell render/story tests

**Out of scope**

- Rewriting shell components in Tailwind utility-first style (optional follow-up)
- AppShell authority contracts (TIP-006 Complete — out of scope for this TIP)
- Production ApplicationShell wiring in ERP protected layout (TIP-UI-05)
- New nav modules, manifest routes, or business domain pages
- Editing `@afenda/design-system` token registry or `@afenda/ui` primitive internals

## Runtime evidence (2026-06-24)

| Artifact | Path | Proven |
| --- | --- | --- |
| Token-aligned shell CSS | `packages/appshell/src/styles/afenda-appshell.css` | Yes — Slice 1 |
| Legacy CSS Modules removed | `app-shell.module.css` | Yes — absent (grep) |
| CSS manifest | `packages/appshell/src/styles/css-manifest.ts` | Yes — Slice 1 |
| CSS manifest tests | `packages/appshell/src/__tests__/css-manifest.test.ts` | Yes — Slice 1 |
| Package export + sideEffects | `packages/appshell/package.json` → `./afenda-appshell.css` | Yes — Slice 1 |
| ERP globals import order | `apps/erp/src/app/globals.css` | Yes — Slice 1 |
| Storybook preview import | `apps/storybook/.storybook/preview.css` | Yes — Slice 1 |
| CSS governance (no raw hex) | `scripts/css/check-css-governance.mts` Rule R15 | Yes — Slice 1 |
| Dropdown/sheet presentation guards | `packages/appshell/src/__tests__/app-shell-dropdown-drift.test.ts` | Yes — Slice 1 |
| AppShell render/story baselines | `packages/appshell/src/__tests__/app-shell*.test.tsx` | Partial — Slice 2 |
| Production ApplicationShell in ERP | `apps/erp/src/app/(protected)/layout.tsx` | **No** — TIP-UI-05 |
| TIP-006 authority contracts | `packages/appshell/src/contracts/` | **Yes** — TIP-006 Complete |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/appshell` (PKG-001) | Shell structural CSS, CSS manifest, export map |
| `@afenda/design-system` (PKG-003) | Upstream token authority (`tokens.css` / `afenda-ui.css` chain) |
| `@afenda/ui` (PKG-004) | CSS manifest validation types; primitive layer |
| `@afenda/erp` (PKG-007) | Downstream consumer — `globals.css` import order |

## Depends on

- TIP-006 AppShell Authority (Complete) — shell ownership + frozen contracts
- TIP-UI-01 CSS Pipeline ✅ — `tokens.css` + ERP `globals.css` foundation
- TIP-UI-02 Component Library ✅ — governed `@afenda/ui` primitives shell consumes

## Blocks

- TIP-UI-05 ERP App Surfaces — visual consistency + production shell integration
- Foundation Phase 6 gate — AppShell production integration in `(protected)` layout

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `packages/appshell/src/styles/afenda-appshell.css` | `@afenda/appshell` | ERPSpine | **Delivered** (Slice 1) | TIP-006 / TIP-004 consumption |
| `packages/appshell/src/styles/css-manifest.ts` | `@afenda/appshell` | ERPSpine | **Delivered** (Slice 1) | — |
| `packages/appshell/src/__tests__/css-manifest.test.ts` | `@afenda/appshell` | ERPSpine | **Delivered** (Slice 1) | — |
| `packages/appshell/package.json` | `@afenda/appshell` | ERPSpine | **Delivered** (Slice 1) — `./afenda-appshell.css` export | — |
| `apps/erp/src/app/globals.css` | `@afenda/erp` | Application | **Delivered** (Slice 1) — import order | Application Authority |
| `apps/storybook/.storybook/preview.css` | `@afenda/storybook` | Application | **Delivered** (Slice 1) | — |
| `scripts/css/css-registry.mts` | repo root | Platform | **Delivered** (Slice 1) | — |
| Visual regression + ERP shell closeout | `@afenda/appshell`, `@afenda/erp` | ERPSpine / Application | **Remaining** (Slice 2) | TIP-UI-05 |

## Acceptance gate

- `pnpm --filter @afenda/appshell test:run`
- `pnpm --filter @afenda/appshell typecheck`
- `pnpm check:css-governance`
- `pnpm ui:guard:scan`
- `pnpm quality:boundaries`
- `pnpm ci:biome`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN afenda-appshell.css is the sole CSS source file owned by @afenda/appshell
WHEN  css-manifest tests and check:css-governance run
THEN  no app-shell.module.css or secondary shell CSS files exist under packages/appshell/src
AND   the CSS budget allows at most one source file (afenda-appshell.css)
AND   package.json exports ./afenda-appshell.css with matching sideEffects

GIVEN afenda-appshell.css consumes design-system tokens via upstream import order
WHEN  the shell CSS source is scanned
THEN  no hardcoded hex color values (#rgb, #rrggbb, #rrggbbaa) appear in shell CSS sources
AND   no --afenda-* token definitions are declared in afenda-appshell.css
AND   no @theme inline block is present in afenda-appshell.css
AND   shell-scoped custom properties use the --app-shell-* namespace only

GIVEN apps/erp globals.css follows the documented CSS authority import order
WHEN  the protected ERP layout renders AppShell chrome
THEN  @import "@afenda/appshell/afenda-appshell.css" appears after @afenda/ui/afenda-ui.css
AND   shell chrome resolves colors from design-system tokens (not local hex)

GIVEN AppShell blocks render in Storybook or Vitest with governed @afenda/ui primitives
WHEN  visual regression / render tests execute
THEN  layout chrome matches established baseline tests
AND   no consumer className appears on @afenda/ui primitives (TIP-004 Gate D/F)

GIVEN TIP-006 authority contracts are frozen
AND   TIP-UI-05 wires ApplicationShell in apps/erp (protected) layout
WHEN  a signed-in user loads the production ERP dashboard
THEN  the full governed shell renders with token-aligned chrome
AND   TIP-UI-03 may be marked Complete
```

### Acceptance criteria proof

| Scenario | Proof |
| --- | --- |
| Single shell CSS file + manifest | `packages/appshell/src/__tests__/css-manifest.test.ts`; `packages/appshell/src/styles/css-manifest.ts` |
| No legacy CSS Modules | Grep — `app-shell.module.css` absent |
| No hex in shell CSS | `css-manifest.test.ts`; `scripts/css/check-css-governance.mts` Rule R15 |
| No --afenda-* definitions in shell | `css-manifest.test.ts` (`contains no --afenda-* token definitions`) |
| ERP import order | `apps/erp/src/app/globals.css`; `scripts/governance/__tests__/check-downstream-integration.test.ts` |
| Storybook composition | `apps/storybook/.storybook/preview.css` |
| Render/story baselines | `packages/appshell/src/__tests__/app-shell.render.test.tsx`; `app-shell.stories.test.tsx` |
| TIP-004 consumption | `packages/appshell/src/__tests__/governed-ui-consumption.test.ts`; `pnpm ui:guard:scan` |
| Production ERP shell | **Gap** — `apps/erp/src/app/(protected)/layout.tsx` (TIP-UI-05) |
| TIP-006 contract freeze | **Yes** — `packages/appshell/src/contracts/` (TIP-006 Complete) |

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | `afenda-appshell.css` replaces legacy CSS Modules | Grep + deliverables table | [x] |
| 2 | CSS manifest registered with correct namespaces | `css-manifest.test.ts` | [x] |
| 3 | Package export + sideEffects aligned | `css-manifest.test.ts` | [x] |
| 4 | No hex / raw color in shell CSS | `css-manifest.test.ts`; `pnpm check:css-governance` | [x] |
| 5 | No --afenda-* token redefinition in shell | `css-manifest.test.ts` | [x] |
| 6 | ERP + Storybook import shell CSS in correct order | `globals.css`; downstream integration test | [x] |
| 7 | AppShell CSS budget enforced (1 file) | `css-manifest.test.ts` APPSHELL_CSS_BUDGET | [x] |
| 8 | AppShell tests pass | `pnpm --filter @afenda/appshell test:run` | [x] |
| 9 | UI guard clean on consumer paths | `pnpm ui:guard:scan` | [x] |
| 10 | Boundaries clean | `pnpm quality:boundaries` | [x] |
| 11 | Biome clean | `pnpm ci:biome` | [x] |
| 12 | Visual regression baselines signed off in ERP context | AppShell render tests + Storybook preview smoke | [ ] |
| 13 | TIP-006 authority contracts frozen | `packages/appshell/src/contracts/` | [x] |
| 14 | Production ApplicationShell wired (TIP-UI-05) | `apps/erp` protected layout | [ ] |
| 15 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] |
| 16 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] |
| 17 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 18 | Completion report posted | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Mandatory before code edits.** Two slices — dependency order: appshell token CSS → visual regression + ERP closeout.

### Slice 1 — Token-aligned shell CSS (`@afenda/appshell`)

**Status:** Delivered  
**Prerequisite:** TIP-UI-01 Complete (`apps/erp/src/app/globals.css` + `tokens.css`); TIP-UI-02 Complete (`@afenda/ui` P0 components)

#### Design (internal-guide)

- Replace legacy `app-shell.module.css` with a **single** export-based stylesheet: `src/styles/afenda-appshell.css`.
- Shell defines layout geometry and `--app-shell-*` bridge variables only; color, typography, and elevation consume upstream tokens via `var(--z-index-*)`, `var(--afenda-*)`, or shadcn bridge variables from `afenda-ui.css`.
- Register manifest in `css-manifest.ts` with `classNamespace: "app-shell-"`, `propertyNamespace: "--app-shell-"`, `maxSourceFiles: 1`.
- Downstream import order per [`css-authority.md`](../../architecture/css-authority.md): Tailwind → `@afenda/ui/afenda-ui.css` → `@afenda/appshell/afenda-appshell.css` → optional metadata-ui.
- Do **not** add `@theme inline`, `--afenda-*` definitions, or hardcoded hex/rgb/hsl/oklch in shell CSS — enforced by `css-manifest.test.ts` and `check-css-governance` Rule R15.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-03-appshell-token-migration.md

1. Objective    — Deliver single token-aligned afenda-appshell.css with CSS manifest, tests, and downstream import wiring; remove legacy CSS Modules approach.
2. Allowed layer— packages/appshell/src/styles/, packages/appshell/src/__tests__/
3. Files        — packages/appshell/src/styles/afenda-appshell.css (New/Modified)
                  packages/appshell/src/styles/css-manifest.ts (New)
                  packages/appshell/src/__tests__/css-manifest.test.ts (New)
                  packages/appshell/package.json (Modified)
                  apps/erp/src/app/globals.css (Modified — import order)
                  apps/storybook/.storybook/preview.css (Modified)
                  scripts/css/css-registry.mts (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-ui-03-appshell-token-migration.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/ui primitive edits, packages/design-system token registry edits, className on @afenda/ui in appshell consumers, second CSS file under appshell/src, @afenda/accounting, ledger/journal/COA/posting (ADR-0010), TIP-006 contract files (separate TIP)
5. Authority    — TIP-004 consumption policy; TIP-006 ERP Spine CSS ownership; css-authority.md import order
6. Gates        — pnpm --filter @afenda/appshell typecheck
                  pnpm --filter @afenda/appshell test:run
                  pnpm check:css-governance
                  pnpm ui:guard:scan
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 1 | `afenda-appshell.css` replaces legacy CSS Modules | Grep |
| 2 | CSS manifest registered | `pnpm --filter @afenda/appshell test:run` |
| 3 | Package export + sideEffects aligned | `pnpm --filter @afenda/appshell test:run` |
| 4 | No hex / raw color in shell CSS | `pnpm check:css-governance` |
| 5 | No --afenda-* token redefinition | `pnpm --filter @afenda/appshell test:run` |
| 6 | ERP + Storybook import order | downstream integration test |
| 7 | CSS budget (1 file) | `pnpm --filter @afenda/appshell test:run` |
| 8 | AppShell tests pass | `pnpm --filter @afenda/appshell test:run` |
| 9 | UI guard clean | `pnpm ui:guard:scan` |
| 10 | Boundaries clean | `pnpm quality:boundaries` |
| 11 | Biome clean | `pnpm ci:biome` |
| 15 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 16 | TIP status index updated | `pnpm check:documentation-drift` |
| 17 | Drift guard passes | `pnpm check:documentation-drift` |

#### Known debt

- Visual regression sign-off in production ERP context deferred to Slice 2 (requires TIP-UI-05 ApplicationShell wiring).
- TIP-006 authority contracts frozen (Complete) — Slice 2 unblocked on contract gate; ERP shell sign-off remains TIP-UI-05.

### Slice 2 — Visual regression + ERP integration closeout

**Status:** Not started  
**Prerequisite:** Slice 1 runtime evidence row `packages/appshell/src/styles/afenda-appshell.css` = `partially-implemented` in `afenda-runtime-truth-matrix.md`; TIP-006 Complete; TIP-UI-05 ApplicationShell wiring available

#### Design (internal-guide)

- Run AppShell render/story tests as visual regression baseline; extend only when ERP-specific chrome gaps appear (protected layout, manifest nav).
- Coordinate with TIP-UI-05: wire `ApplicationShell` in `apps/erp/src/app/(protected)/layout.tsx` using existing `afenda-appshell.css` — **no new shell CSS files**.
- Confirm token alignment end-to-end: ERP dashboard, dropdown panels, sidebar, and dashboard widgets render without hex drift when composed with `@afenda/ui` in production import order.
- Do not mark TIP-UI-03 Complete until TIP-UI-05 production shell sign-off is evidenced.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-ui-03-appshell-token-migration.md

1. Objective    — Close TIP-UI-03 with visual regression sign-off in ERP production shell context after TIP-UI-05 ApplicationShell wiring.
2. Allowed layer— apps/erp/src/app/(protected)/, packages/appshell/src/__tests__/ (regression tests only)
3. Files        — apps/erp/src/app/(protected)/layout.tsx (Modified — TIP-UI-05 coordination)
                  packages/appshell/src/__tests__/app-shell.render.test.tsx (Modified — if ERP gaps found)
                  docs/delivery/tips/[Partially Implemented] tip-ui-03-appshell-token-migration.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — new CSS files under packages/appshell, packages/ui edits, packages/design-system token edits, className on @afenda/ui primitives, @afenda/accounting (ADR-0010), implementing TIP-006 contracts in this slice
5. Authority    — TIP-006 ERP Spine Authority (contract gate); TIP-UI-05 Application Authority (layout wiring)
6. Gates        — pnpm --filter @afenda/appshell test:run
                  pnpm --filter @afenda/erp test:run
                  pnpm check:css-governance
                  pnpm ui:guard:scan
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 12 | Visual regression baselines signed off | `pnpm --filter @afenda/appshell test:run` + ERP smoke |
| 13 | TIP-006 authority contracts frozen | TIP-006 Complete (external) |
| 14 | Production ApplicationShell wired | TIP-UI-05 DoD (coordinated) |
| 18 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- Slice 2 is **blocked** on TIP-UI-05 production `(protected)` layout until that TIP advances.
- Optional Tailwind utility migration for shell blocks remains out of scope.

## Verdict

**Partially Implemented** — Token migration is delivered: legacy `app-shell.module.css` is gone, `afenda-appshell.css` is the sole governed shell stylesheet, CSS manifest tests and governance gates enforce no hex drift, and ERP/Storybook import order is correct. Closeout remains blocked on TIP-UI-05 production ERP ApplicationShell sign-off (Slice 2).
