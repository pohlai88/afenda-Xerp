# fdr-021-storybook — Storybook

| Field | Value |
| --- | --- |
| **Status** | Not started |
| **FDR ID** | `fdr-021-storybook` |
| **Registry entry ID** | `—` (pending `foundation-registry-owner`; package active in [`package-registry.md`](../../architecture/package-registry.md)) |
| **Package** | `@afenda/storybook` (PKG-021) |
| **Lane** | blue-lane (visual gate application — pending registry onboarding) |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | internal — visual gate for UI, appshell, metadata-ui |
| **Enterprise readiness** | **18/30 audit-adjusted** · **27/30 evidence-qualified ceiling** — enterprise **9.5 candidate blocked** (registry + test runner + a11y debt pending) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` (entry pending) |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SAP Fiori UX · Oracle Fusion UX · SOLMAN |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). **PKG-021 has no foundation-disposition entry yet** — onboard via `foundation-registry-owner`.

| Field | Value |
| --- | --- |
| id | `—` (target: `PKG021_STORYBOOK` or Architecture Authority assignment) |
| packageId | PKG-021 |
| domain | `storybook` |
| lane | blue-lane (proposed — visual gate application) |
| runtimeOwner | `apps/storybook` |
| gates | `pnpm --filter @afenda/storybook typecheck`; `pnpm --filter @afenda/storybook test:storybook:run` |
| prohibited | `do-not-add-classname-on-afenda-ui-primitives-in-stories`; `do-not-ship-storybook-static-as-erp-runtime` (proposed) |
| allowedAgents | `foundation-registry-owner`; fdr-slice-implementer (pending registry) |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/storybook` (PKG-021) | Storybook app, test runner, composed integration stories | `apps/storybook/` |
| `@afenda/ui` (PKG-004) | Primitive stories (colocated `*.stories.tsx`) | `packages/ui/src/components/` |
| `@afenda/appshell` (PKG-001) | AppShell block stories | `packages/appshell/src/` |
| `@afenda/metadata-ui` (PKG-012) | Metadata renderer stories | `packages/metadata-ui/src/` |
| Story generator | Co-located story discovery | `scripts/storybook/generate.mjs` |

## Purpose

Lock and maintain the governed visual gate delivery surface — Storybook 10 + Vitest browser test runner across `@afenda/ui`, `@afenda/appshell`, and `@afenda/metadata-ui` — so UI governance, accessibility, and cross-package composition are proven before ERP consumption without shipping Storybook as production runtime.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-ui-03-appshell-token-migration.md`](../../delivery/tips/[Complete]%20tip-ui-03-appshell-token-migration.md) · [`tip-ui-05-erp-app-surfaces.md`](../../delivery/tips/[Complete]%20tip-ui-05-erp-app-surfaces.md) · [`tip-032-implementation-documentation.md`](../../delivery/tips/[Complete]%20tip-032-implementation-documentation.md) (Slice 5 Storybook blocks).

## Scope

**In scope**

- `apps/storybook/.storybook/` — main, preview, vitest setup, global CSS imports
- `apps/storybook/stories/` — composed integration stories (e.g. governance-integration-composed)
- `apps/storybook/vitest.storybook.config.ts` — browser test runner project
- Colocated `*.stories.tsx` under `packages/ui`, `packages/appshell`, `packages/metadata-ui` (consumed by Storybook)
- `scripts/storybook/generate.mjs` — story discovery/generation (`prestorybook`)
- Gates: `pnpm --filter @afenda/storybook typecheck`, `test:storybook:run`
- Addons: a11y, docs, vitest, MCP (dev-only)

**Out of scope**

- Production ERP routes (`apps/erp`)
- Design token authority (`packages/design-system` — authority-only)
- Primitive governance changes in `@afenda/ui` (separate FDRs)
- Accounting runtime (ADR-0010)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Storybook app edits in `apps/storybook/**`; colocated stories follow owning package slice |
| Shared constants | No duplicate governance maps in Storybook — consume package exports only |
| Evidence output | Gate exit 0 + story test paths — not prose-only claims |
| Parallel PKG-021 | **Serial** with `fdr-018-governed-primitives` / `fdr-018-ui-consumption` when same story files change |
| Implementation blocked until | Research Slice 1 complete; PKG-021 registry entry onboarded |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 = Research only — no story fixes unless a later Implementation slice authorizes.  
> Runtime matrix marks **Storybook implemented** — reconcile with FDR **Not started** and failing test runner.

### Discovery questions

| Question | Expected output |
| --- | --- |
| Does `pnpm --filter @afenda/storybook test:storybook:run` exit 0? | Failure taxonomy (a11y vs import vs interaction) |
| Which stories fail axe checks (recharts, badge contrast, native-select)? | Gap list with owning package |
| Does metadata-ui `./styles.css` import resolve in Vitest browser project? | Vite alias/fix plan |
| Is PKG-021 disposition entry required before Complete? | Registry-sync plan |
| Does `pnpm --filter @afenda/storybook typecheck` exit 0? | Gate log |

### Files to inspect

| Path | Why |
| --- | --- |
| `apps/storybook/.storybook/main.ts` | Story globs + framework config |
| `apps/storybook/.storybook/preview.tsx` | Global decorators + CSS pipeline |
| `apps/storybook/vitest.storybook.config.ts` | Browser test runner |
| `apps/storybook/stories/governance-integration-composed.stories.tsx` | Cross-package composition proof |
| `packages/metadata-ui/src/metadata-ui-composed.stories.tsx` | `./styles.css` import failure |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Storybook row |

### Skills to read

- `enterprise-erp-standards` — Fiori UX / Fusion UX mapping (§2)
- `afenda-storybook` — story conventions
- `write-fdr` — registry-first discipline

### Matrix reconciliation (Research Slice 1 — 2026-06-25)

| Matrix row | Matrix status | FDR status | Reconciliation |
| --- | --- | --- | --- |
| Storybook | **implemented** | Not started (Research Slice 1 ✓) | Runtime exists (app + colocated stories); FDR delivery **Not started** until registry onboard (Slice 2) + runner green (Slice 3). Matrix **implemented** = filesystem + typecheck + story inventory — not runner exit 0. |

**Archive tip alignment (read-only — not implementation authority):**

| Archive TIP | Storybook evidence | Research Slice 1 status |
| --- | --- | --- |
| tip-ui-03 | `apps/storybook/.storybook/preview.css` shell token import | **Aligned** — preview CSS path exists; runner a11y debt does not invalidate tip-ui-03 Complete |
| tip-ui-05 | AppShell dashboard/chart blocks + stepper normalization | **Partial** — appshell dashboard canvas/recharts stories fail `aria-hidden-focus`; stepper stories fail `aria-required-children` |
| tip-032 Slice 5 | Afenda Docs reference blocks in `packages/ui/.../afenda-docs/` | **Partial** — 8 afenda-docs story files with axe failures (contrast + scroll-area); blocks visible in Storybook dev |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade | Notes |
| --- | ---: | --- | --- |
| `pnpm check:documentation-drift` | 0 | A | Run 2026-06-25 |
| `pnpm check:foundation-disposition` | 0 | A | Run 2026-06-25 |
| `pnpm --filter @afenda/storybook typecheck` | 0 | A | Run 2026-06-25 |
| `pnpm ui:guard:scan` | 0 | A | 243 consumer/story files clean (TIP-004 upstream) |
| `pnpm --filter @afenda/storybook test:storybook:run` | 1 | C | 113 test files · 76 failed · 37 passed · 400/1860 tests failed · 326s |

### Failure taxonomy (`test:storybook:run` — Research Slice 1)

> Classifies open gaps `storybook-test-runner-red`, `storybook-metadata-styles-import`, `storybook-a11y-debt`. Fix/waive deferred to Implementation Slice 3.

| Taxonomy | Count (indicative) | Owning package / path | Gap ID | Representative axe / error |
| --- | ---: | --- | --- | --- |
| **Import resolve** | 3 failed suites (all tests blocked) | `@afenda/metadata-ui` — `metadata-dashboard-fixture`, `metadata-page-fixture`, `metadata-ui-composed` | `storybook-metadata-styles-import` | Vite: `Failed to resolve import "./styles.css"` |
| **Fixture / runtime** | 1 failed suite | `@afenda/appshell` — `statistics-line-trends-card.stories.tsx` | `storybook-test-runner-red` | `Missing line trends card fixture: Revenue` |
| **A11y — recharts aria-hidden-focus** | ~62 failed tests · 10 story files | `@afenda/appshell` — dashboard canvas, shell, chart blocks | `storybook-a11y-debt` | axe `aria-hidden-focus` on Recharts wrapper SVG |
| **A11y — badge color-contrast** | ~17 failed tests | `@afenda/ui` — `badge.stories.tsx` | `storybook-a11y-debt` | axe `color-contrast` on secondary/destructive badge variants |
| **A11y — native-select accessible name** | 4 failed tests (+ 2 in select reference) | `@afenda/ui` — `native-select.stories.tsx`, `select.stories.tsx` | `storybook-a11y-debt` | axe `select-name` — `<select>` without associated label |
| **A11y — stepper tablist structure** | 2 failed tests | `@afenda/ui` — `_storybook/stepper/stepper.stories.tsx` | `storybook-a11y-debt` | axe `aria-required-children` / `aria-required-parent` |
| **A11y — primitive story debt (other)** | ~330 failed tests · 59 story files | `@afenda/ui` — slider, progress, combobox, input-otp, select, scroll-area, afenda-docs, etc. | `storybook-a11y-debt` | Mixed axe rules (contrast, scrollable-region, button-name, …) |
| **A11y — metadata-ui partial** | 5 failed tests · 2 story files | `@afenda/metadata-ui` — `metadata-layouts`, `metadata-ui-raw` | `storybook-a11y-debt` | axe violations after import succeeds |
| **Composed integration** | 2 failed tests | `apps/storybook` — `governance-integration-composed.stories.tsx` | `storybook-a11y-debt` | axe on cross-package shell + metadata surface |

**Package rollup (failed tests):** `@afenda/ui` ~330 · `@afenda/appshell` ~62 · `@afenda/metadata-ui` ~5 (+ 3 import-blocked suites) · `apps/storybook` composed 2 · **total 400**.

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Storybook app | `apps/storybook/` | Yes — Grade B (matrix **implemented**) |
| Storybook config | `apps/storybook/.storybook/main.ts` | Yes — Grade B |
| Preview + CSS pipeline | `apps/storybook/.storybook/preview.tsx`, `preview.css` | Yes — Grade B |
| Composed integration story | `apps/storybook/stories/governance-integration-composed.stories.tsx` | Yes — Grade C (file exists; runner status partial) |
| TypeScript strict | `pnpm --filter @afenda/storybook typecheck` | Yes — Grade A (exit 0) |
| Vitest story tests | `pnpm --filter @afenda/storybook test:storybook:run` | Partial — Grade C (exit 1 · 400/1860 failed · taxonomy §Research Slice 1) |
| UI colocated stories | `packages/ui/src/components/**/*.stories.tsx` | Partial — Grade B (many pass; native-select a11y failures) |
| AppShell stories | `packages/appshell/src/**/*.stories.tsx` | Partial — Grade C (dashboard canvas recharts a11y failures) |
| Metadata-ui stories | `packages/metadata-ui/src/**/*.stories.tsx` | Partial — Grade C (`./styles.css` resolve errors in runner) |
| Foundation disposition entry | `foundation-disposition.registry.ts` | No — Grade E (PKG-021 missing) |

## §Remaining gaps

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `pkg021-registry-onboard` | PKG-021 lacks foundation-disposition entry | blue | `foundation-registry-owner` | Slice 2 | `PKG021_*` entry |
| `storybook-test-runner-red` | `test:storybook:run` exit 1 — 400/1860 tests failed (Research Slice 1 taxonomy) | blue | Implementation Slice 3 | Slice 3 | Gate exit 0 |
| `storybook-metadata-styles-import` | 3 metadata-ui suites blocked — Vite `./styles.css` resolve | blue | `@afenda/metadata-ui` or Slice 3 | Slice 3 | Import resolves in Vitest |
| `storybook-a11y-debt` | ~397 axe test failures across ui/appshell/metadata-ui/composed (taxonomy §Research) | blue | Owning packages + Slice 3 | Slice 3 | Waived or fixed per story |

## §Enterprise readiness score

> **Hard cap:** Missing registry entry + red test runner limits rating to **22/30 maximum** per ENTERPRISE-BENCHMARK §3.1; current audit score lower due to open test/a11y debt.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 4/5 | `typecheck` exit 0 — Grade A | Story import errors in runner |
| Test coverage | 2/5 | Vitest browser runner partial pass — Grade C | Many story failures |
| Observability + audit | 2/5 | Visual gate only; addon-a11y reports — Grade C | No production telemetry |
| Security + RBAC + RLS | 3/5 | Governance + a11y stories exist — Grade C | a11y violations open |
| Documentation + BRD traceability | 4/5 | Archive tips + FDR + failure taxonomy — Grade A (Research Slice 1) | Slice 1 closed 2026-06-25 |
| Maintainability + Clean Core | 3/5 | Clean Core B (composed app consuming packages) — Grade B | Cross-package story debt |
| **Total (audit-adjusted)** | **18/30** | Honest **Not started** score (~6.0 / 10) | Research Slice 1 ✓ |
| **Total (evidence-qualified ceiling)** | **27/30** | After registry + runner green + a11y close/waive + peer review | Not final 9.5 |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — Storybook is an application-layer visual gate consuming `@afenda/ui`, `@afenda/appshell`, and `@afenda/metadata-ui` via public exports; stories must not redefine primitive governance.

**Rule: visual gate apps should remain Clean Core B — consume, do not author primitives.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/ui` | Colocated stories + CSS imports | No | B→B |
| `@afenda/appshell` | Dashboard/shell stories | No | B→B |
| `@afenda/metadata-ui` | Renderer fixture stories | Yes if `./styles.css` path breaks | B→B |
| `@afenda/docs` | Reference blocks also in Storybook (tip-032) | No | B→B |
| CI / designers | `storybook dev` / `test:storybook:run` | Yes if runner fails | B→B |

**ERP giant compatibility:**

- **Module scale:** Stories span 58+ UI primitives, appshell blocks, metadata renderers — runner scales with colocated story count.
- **Nav chrome:** Composed story proves ApplicationShell + MetadataPageSurface integration without ERP route wiring.
- **Governance proof:** `pnpm ui:guard` remains authoritative for consumer className rules; Storybook proves visual/a11y regressions.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SAP Fiori UX | Oracle Fusion UX | `pnpm --filter @afenda/storybook test:storybook:run` (a11y addon) | 2 |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SAP ATC | Type safety | `pnpm --filter @afenda/storybook typecheck` | 4 |
| SOLMAN | Documentation drift | `pnpm check:documentation-drift` | 9 |
| Governed UI | TIP-004 consumer rules | `pnpm ui:guard` (upstream packages) | 17 |

## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Storybook test runner executes colocated package stories | 2 | `test:storybook:run` |
| internal | Cross-package governance composition renders | 1 | governance-integration-composed.stories.tsx |
| internal | TypeScript strict for Storybook project | 4 | `typecheck` |
| tip-ui-03 (archive) | AppShell token/CSS preview in Storybook | 18 | preview.css imports |
| tip-032 (archive) | Afenda Docs reference blocks visible in Storybook | 18 | ui afenda-docs stories |
| tip-ui-05 (archive) | UI Gate A stepper storybook normalization | 17 | ui stepper stories |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Stories render governed components with canonical props | story smoke tests |
| Performance efficiency | Test runner completes within CI budget | vitest.storybook.config timing |
| Compatibility | Storybook 10 + Vitest browser addon aligned | package.json versions |
| Security | No production secrets in story fixtures | code review |
| Usability / accessibility | axe addon reports zero violations on governance stories | a11y interaction tests |
| Maintainability | `pnpm generate` keeps story index current | prestorybook hook |
| Documentation | FDR + matrix + archive tips aligned | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Storybook config change affecting all stories | Architecture Authority or UI Governance review | DoD #14 |
| Primitive governance change via stories | Prohibited — stories consume `@afenda/ui` only | TIP-004 policy |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-021-storybook**
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-021**
- Upstream: `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, `@afenda/design-system` (tokens/CSS)
- Related: `fdr-018-governed-primitives`, `fdr-018-ui-consumption`, `fdr-001-shell-composition`
- Registry entry: `foundation-registry-owner` (blocks Complete)
- Archive: tip-ui-03, tip-ui-05, tip-032 (Storybook slices)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-021-storybook.md` | — | Modified per slice |
| `apps/storybook/**` | `@afenda/storybook` | Modified (Implementation slices) |
| Colocated `*.stories.tsx` | ui / appshell / metadata-ui | Modified (owning package slices) |
| `scripts/storybook/generate.mjs` | root scripts | Modified if discovery rules change |
| `foundation-disposition.registry.ts` | PKG-021 | Modified by `foundation-registry-owner` only |

## Acceptance gate

- `pnpm --filter @afenda/storybook typecheck`
- `pnpm --filter @afenda/storybook test:storybook:run`
- `pnpm --filter @afenda/storybook storybook:build` (static build proof — optional waiver)
- `pnpm ui:guard` (upstream governed UI)
- `pnpm check:foundation-disposition`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
Feature: Storybook visual gate for governed UI

  Scenario: Storybook project typechecks cleanly
    GIVEN apps/storybook/tsconfig.storybook.json configuration
    WHEN pnpm --filter @afenda/storybook typecheck runs
    THEN exit code is 0

  Scenario: Vitest browser test runner executes colocated stories
    GIVEN story files under packages/ui, packages/appshell, and packages/metadata-ui
    AND apps/storybook vitest.storybook.config.ts browser project
    WHEN pnpm --filter @afenda/storybook test:storybook:run runs
    THEN exit code is 0
    AND governance integration composed story passes interaction tests

  Scenario: Accessibility addon reports no violations on governance stories
    GIVEN @storybook/addon-a11y is enabled in preview
    WHEN governance stories run axe checks via test runner
    THEN expect(received).toHaveNoViolations passes
    OR explicit waiver documents known upstream primitive debt

  Scenario: Cross-package composition uses public exports only
    GIVEN governance-integration-composed.stories.tsx
    WHEN ApplicationShell and MetadataPageSurface are imported
    THEN imports use @afenda/appshell and @afenda/metadata-ui/server public paths
    AND no className is applied to @afenda/ui primitives in the story
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | storybook app + colocated stories | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/storybook test:storybook:run` | [ ] |
| 3 | Boundaries | `pnpm ui:guard` (upstream) | [ ] |
| 4 | TypeScript strict | `pnpm --filter @afenda/storybook typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check apps/storybook` | [ ] |
| 6 | Registry aligned | PKG-021 disposition entry valid | [ ] |
| 7 | Runtime matrix updated | Storybook row reconciled | [x] |
| 8 | fdr-status-index updated | index row + gate `test:storybook:run` | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR complete | [x] |
| 12 | Impact analysis complete | §Impact analysis filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | Architecture Authority PR approval | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core | [x] |
| 16 | No duplicated constants / parallel authority | stories consume package exports | [ ] |
| 17 | Security negative path tested | a11y denial scenarios or waivers | [ ] |
| 18 | Public API compatibility verified | no story-only exports in packages | [ ] |
| 19 | E2E requirement satisfied or waived | browser runner satisfies visual gate | [ ] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | [x] |

## Slices

### Slice 1 — Research (storybook baseline)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** B→B

#### Design (internal-guide)

Reconcile runtime matrix **implemented** Storybook row with FDR **Not started** status. Run read-only baseline gates; classify `test:storybook:run` failures by taxonomy (import vs a11y vs interaction) and owning package; document metadata-ui `./styles.css` resolve errors and axe debt; align fdr-status-index gate naming (`test:storybook:run` not `test:run`); produce initial §Enterprise readiness score — **no story or config source edits**.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Not started] fdr-021-storybook.md

1. Objective    — Reconcile runtime matrix + archive tips with FDR status; classify test:storybook:run failure taxonomy; capture baseline gate log; align index gate naming; produce readiness score for Slice 2 unblock.
2. Allowed layer— docs-only (`docs/delivery/FDR/`, `docs/delivery/fdr-status-index.md`, `docs/architecture/afenda-runtime-truth-matrix.md`)
3. Files        —
   docs/delivery/FDR/[Not started] fdr-021-storybook.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — `packages/` source edits; `apps/` source edits; `scripts/` source edits; `foundation-disposition.registry.ts`; `do-not-add-classname-on-afenda-ui-primitives-in-stories`; `do-not-ship-storybook-static-as-erp-runtime`
5. Authority    — ADR-0014 · ADR-0016 · [`package-registry.md`](../../architecture/package-registry.md) PKG-021 · archive tip-ui-03 / tip-ui-05 / tip-032
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
   pnpm --filter @afenda/storybook typecheck (read-only baseline — report exit code)
   pnpm --filter @afenda/storybook test:storybook:run (read-only baseline — report exit code and failure taxonomy by package)
   pnpm ui:guard:scan (read-only baseline — upstream TIP-004 consumer context — report exit code)
7. Closes       — Gap `fdr-research-slice-1`; Gap `storybook-index-gate-drift` (index gate name alignment); DoD #1, #7, #8, #20 (initial score); failure taxonomy for `storybook-test-runner-red`, `storybook-metadata-styles-import`, `storybook-a11y-debt`
8. Evidence     —
   apps/storybook/.storybook/main.ts
   apps/storybook/.storybook/preview.tsx
   apps/storybook/vitest.storybook.config.ts
   apps/storybook/stories/governance-integration-composed.stories.tsx
   packages/metadata-ui/src/metadata-ui-composed.stories.tsx
   packages/ui/src/components/**/*.stories.tsx
   packages/appshell/src/**/*.stories.tsx
9. Attestation  — Documentation (FDR failure taxonomy Grade A); Contract stability (typecheck Grade A baseline); Test coverage baseline (runner exit non-zero — taxonomy Grade C)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | storybook app + colocated stories |
| 7 | Runtime matrix updated | Storybook row |
| 8 | fdr-status-index updated | index row + gate name `test:storybook:run` |
| 20 | Enterprise readiness score updated | §Enterprise readiness score initial (17/30 audit-adjusted) |

#### Known debt

- `storybook-test-runner-red` deferred to Slice 3 Implementation
- `storybook-metadata-styles-import` and `storybook-a11y-debt` — taxonomy only in Slice 1; fix/waive in Slice 3
- `pkg021-registry-onboard` deferred to Slice 2 Registry-sync
- Serial with `fdr-018-governed-primitives` / `fdr-018-ui-consumption` when same story files change
- Hard cap 22/30 until PKG-021 disposition entry (ENTERPRISE-BENCHMARK §3.1)

### Slice 2 — Registry-sync (PKG-021 entry)

**Status:** Not started  
**Prerequisite:** Slice 1 Complete  
**Type:** Registry-sync  
**Risk class:** Low  

**Purpose:** Onboard `PKG021_STORYBOOK` via `foundation-registry-owner` with gates `typecheck` + `test:storybook:run`.

### Slice 3 — Implementation (visual gate closeout)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** B→B

**Purpose:** Fix `./styles.css` resolve errors; close or waive axe failures with owning-package coordination; achieve `test:storybook:run` exit 0.

### Slice 4 — Evidence-sync (FDR + index + matrix)

**Status:** Not started  
**Prerequisite:** Slice 3 Complete  
**Type:** Evidence-sync  

**Purpose:** Recalculate §Enterprise readiness score; sync fdr-status-index gate column; update matrix row if proven.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Registry-sync | Revert registry commit via `foundation-registry-owner` | Fingerprint reversal |
| Implementation | Revert story/config commits per owning package | Git revert + `test:storybook:run` |
| Static build | Remove `storybook-static` artifact | `pnpm --filter @afenda/storybook clean` |

Oracle analog: Storybook is dev/visual gate only — rollback does not affect ERP production routes. SAP analog: transport rollback = git revert + visual gate re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| _(none yet)_ | — | — | — | — |

## §Knowledge transfer

### Operational runbook

- Dev server: `pnpm --filter @afenda/storybook storybook` (port 6006; runs `generate` first)
- Test runner: `pnpm --filter @afenda/storybook test:storybook:run`
- Typecheck: `pnpm --filter @afenda/storybook typecheck`
- Story generation: `pnpm --filter @afenda/storybook generate`
- Colocated stories: edit in owning package (`packages/ui`, etc.) — Storybook discovers via main.ts globs

### Observability

- a11y violations: Storybook interactions panel + `@storybook/addon-a11y` output
- CI: wire `test:storybook:run` when runner green (currently local gate)
- Composed proof: `apps/storybook/stories/governance-integration-composed.stories.tsx`

### On-call escalation

- Symptom: `./styles.css` import failure in metadata-ui stories → verify file exists or alias in vitest config
- Symptom: mass a11y failures after recharts upgrade → check upstream primitive + waiver process
- Symptom: story missing after package add → run `pnpm --filter @afenda/storybook generate`
- Owner: Application Authority / PKG-021

## §Enterprise benchmark qualification

This FDR is **Not started — enterprise 9.5 blocked**, not an enterprise 9.5 candidate, because Research Slice 1, PKG-021 registry onboarding, and red `test:storybook:run` debt remain open.

The **27/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. `foundation-registry-owner` onboards `PKG021_STORYBOOK`.
2. `test:storybook:run` exits 0 or axe failures are explicitly waived per story.
3. `typecheck` remains exit 0 (verified **2026-06-25** — Grade A).
4. **Complete** status requires Architecture Authority peer review (DoD #14).

The **18/30 audit-adjusted** score is the honest benchmark today: typecheck green; failure taxonomy Grade A; capped by missing registry entry, red test runner, and a11y/import debt tracked in §Remaining gaps.

Research Slice 1 closed 2026-06-25 — failure taxonomy captured; FDR remains **Not started** until Slice 2 registry onboard + Slice 3 runner green.

## Verdict

**Not started — Research Slice 1 ✓ · 18/30 audit-adjusted (27/30 ceiling) · PKG-021 registry onboarding (Slice 2) and test runner closeout (Slice 3) pending.**
