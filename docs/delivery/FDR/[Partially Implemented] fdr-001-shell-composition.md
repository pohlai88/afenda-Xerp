# fdr-001-shell-composition — Shell Composition

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-001-shell-composition` |
| **Registry entry ID** | `PKG001_APPSHELL` |
| **Package** | `@afenda/appshell` (PKG-001) |
| **Lane** | amber-lane |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Medium |
| **BRD reference** | internal — ERP shell composition authority |
| **Enterprise readiness** | **29/30 audit-adjusted** — enterprise **9.5 candidate** (DoD #14 peer review open; not final Complete; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | Fiori UX · Fusion UX · TIP-004 UI consumption |
| **Playbook** | [`fdr-001-playbook.md`](fdr-001-playbook.md) |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `shell-composition`; this FDR scopes the **shell-composition** subdomain (layout, contracts, governed UI consumption) on the same `PKG001_APPSHELL` entry.

| Field | Value |
| --- | --- |
| id | `PKG001_APPSHELL` |
| packageId | PKG-001 |
| domain | `shell-composition` (FDR subdomain: shell layout + contracts) |
| lane | amber-lane |
| runtimeOwner | `packages/appshell` |
| gates | `pnpm --filter @afenda/appshell typecheck`; `pnpm --filter @afenda/appshell check:governance` |
| prohibited | `do-not-create-accounting-package`; `do-not-add-classname-on-afenda-ui-primitives` |
| allowedAgents | `appshell-agent`; `foundation-registry-owner`; `fdr-slice-implementer` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/appshell` (PKG-001) | Shell contracts, layout chrome, dashboard canvas, governed `@afenda/ui` consumption | `packages/appshell/src/` |
| `@afenda/ui` (PKG-018) | Upstream governed primitives (read-only in Research) | `packages/ui/src/components/` |
| `apps/erp` (PKG-007) | ERP protected layout wiring consumer (read-only in Research) | `apps/erp/src/app/(protected)/` |
| `apps/storybook` (PKG-021) | Visual gate for appshell stories (read-only in Research) | `apps/storybook/` |

## Purpose

Deliver and maintain ERP shell composition authority — contracts, layout wiring, dashboard canvas, and governed `@afenda/ui` consumption in `@afenda/appshell` — so ERP surfaces mount through a single ApplicationShell boundary with TIP-004 compliance and no duplicated chrome authority.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-006-appshell-authority.md`](../../delivery/tips/[Complete]%20tip-006-appshell-authority.md) · [`tip-ui-05-erp-app-surfaces.md`](../../delivery/tips/[Complete]%20tip-ui-05-erp-app-surfaces.md).

## Scope

**In scope**

- Shell authority contracts (`packages/appshell/src/contracts/`) — chrome regions, slots, context surface rules, compile-time drift guards
- ApplicationShell root composition (`packages/appshell/src/app-shell.tsx`, header, sidebar, main, footer)
- Dashboard canvas + widget registry (`packages/appshell/src/dashboard/`)
- Governed UI consumption in appshell blocks (`packages/appshell/src/shadcn-studio/`, `packages/appshell/src/wiring/governance.ts`)
- TIP-004 static policy test (`packages/appshell/src/__tests__/governed-ui-consumption.test.ts`)
- ERP protected layout wiring (`apps/erp/src/app/(protected)/layout.tsx`) and token closeout tests
- FDR-aligned reconciliation of archive tip-006 / tip-ui-05 claims vs current runtime paths

**Out of scope**

- Manifest nav projection (`fdr-001-manifest-nav`)
- UI primitive authoring (`fdr-018-governed-primitives`)
- Entitlements registry authoring (`fdr-006-entitlements`, `fdr-006-feature-manifest`)
- Accounting runtime (ADR-0010)
- Optional Tailwind utility migration for shell blocks (runtime matrix — out of scope)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate chrome regions, slot names, or governed component registries outside `packages/appshell/src/contracts/` |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-001 | **Sequential** with `fdr-001-manifest-nav` — same `runtimeOwner`; orchestrator Phase 1 per [`fdr-001-playbook.md`](fdr-001-playbook.md) §F |
| Implementation blocked until | Research Slice 1 complete ✓; sibling manifest-nav may run in Phase 2 |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-006 / tip-ui-05 + runtime matrix **implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does runtime matrix AppShell row match registry `evidence[]` paths? | **Yes** — both barrels exist and export contract surface; matrix cites 93+ `.tsx`, contracts, governance tests, ERP layout | Registry `evidence[]`; matrix AppShell row |
| Are `packages/appshell/src/contracts/index.ts` and `index.ts` proven with automated tests? | **Yes** — `contract-public-api-drift.test.ts` (3 tests) + `appshell-authority.contract.test.ts` (5 tests) | `test:run` exit 0 |
| What remains for amber → green (`appshell-studio-normalization`)? | **Closed (2026-06-25)** — bulk migration not scheduled; new blocks use [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../../.cursor/skills/afenda-shadcn-components/SKILL.md) per-block pipeline; `studio-legacy-class-guard.test.ts` + `ui:guard` hold regressions | Gap closed via §Waiver `shell-composition-studio-deferral` |
| Does ERP `(protected)/layout.tsx` wiring match tip-ui-05 archive claims? | **Yes** — AppShell + identity + manifest nav + dashboard providers wired | `protected-appshell-token-closeout.test.ts` (2 tests pass) |
| Does `governed-ui-consumption.test.ts` pass and cover all `.tsx` under `src/`? | **Yes** — 56 per-file scans; zero TIP-004 violations | `check:governance` exit 0 |
| Is `@afenda/appshell typecheck` green or blocked by non-shell paths? | **Green** — exit 0 (sibling manifest-nav fixed `governed-ui-consumption.test.ts` optional param) | Gate log below |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/appshell typecheck` | 0 | A |
| `pnpm --filter @afenda/appshell check:governance` | 0 | A (56 tests) |
| `pnpm --filter @afenda/appshell test:run` | 0 | A (362 tests, 52 files) |
| `pnpm exec biome check packages/appshell` | 1 | — (11 fixable attribute-sort errors; Slice 2 or hygiene batch) |
| ERP layout closeout (`protected-appshell-token-closeout.test.ts`) | 0 | A (2 tests) |
| Contract drift suite (`contracts/__tests__/`) | 0 | A (23 tests across 5 files) |

### Files inspected

| Path | Why |
| --- | --- |
| `packages/appshell/src/contracts/` | Authority contracts + drift tests |
| `packages/appshell/src/contracts/appshell-authority.contract.ts` | Chrome regions + slot authority |
| `packages/appshell/src/index.ts` | Public API barrel |
| `packages/appshell/src/app-shell.tsx` | Root shell composition |
| `packages/appshell/src/app-shell-sidebar.tsx` | Nav chrome (manifest-driven pages prop) |
| `packages/appshell/src/dashboard/` | Dashboard canvas + widget registry |
| `packages/appshell/src/shadcn-studio/blocks/` | Governed studio blocks — per-block promotion via `afenda-shadcn-components` skill (no bulk FDR slice) |
| `packages/appshell/src/__tests__/governed-ui-consumption.test.ts` | TIP-004 gate (56 tests) |
| `packages/appshell/src/contracts/__tests__/appshell-authority.contract.test.ts` | Contract drift guards (5 tests) |
| `packages/appshell/src/__tests__/app-shell.render.test.tsx` | Shell composition render proof (13 tests) |
| `apps/erp/src/app/(protected)/layout.tsx` | ERP production wiring |
| `apps/erp/src/__tests__/protected-appshell-token-closeout.test.ts` | TIP-UI-03 closeout (2 tests) |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | AppShell row — **implemented** vs FDR drift |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Contracts barrel | `packages/appshell/src/contracts/index.ts` | Yes — Grade A (`contract-public-api-drift.test.ts`) |
| Package barrel | `packages/appshell/src/index.ts` | Yes — Grade A (`contract-public-api-drift.test.ts`) |
| Authority contract | `packages/appshell/src/contracts/appshell-authority.contract.ts` | Yes — Grade A (5 drift tests pass) |
| Root shell | `packages/appshell/src/app-shell.tsx` | Yes — Grade A (`app-shell.render.test.tsx` 13 tests) |
| Governance test | `packages/appshell/src/__tests__/governed-ui-consumption.test.ts` | Yes — Grade A (`check:governance` exit 0, 57 tests) |
| Module workspace chrome | `packages/appshell/src/shadcn-studio/blocks/app-shell-module-workspace-chrome.tsx` | Yes — Grade A (6 render tests + TIP-004 dedicated regression) |
| Studio legacy guard | `packages/appshell/src/__tests__/studio-legacy-class-guard.test.ts` | Yes — Grade A (2 tests; waiver reconfirmation) |
| Contract drift tests | `packages/appshell/src/contracts/__tests__/` | Yes — Grade A (23 tests across 5 files) |
| ERP protected layout | `apps/erp/src/app/(protected)/layout.tsx` | Yes — Grade B (source + closeout test) |
| ERP token closeout test | `apps/erp/src/__tests__/protected-appshell-token-closeout.test.ts` | Yes — Grade A (2 tests exit 0) |
| Dashboard canvas | `packages/appshell/src/dashboard/app-shell-dashboard-canvas.client.tsx` | Yes — Grade B (`dashboard-canvas-widget.test.tsx`, a11y suite) |
| Studio blocks | `packages/appshell/src/shadcn-studio/blocks/` | Yes — Grade B (render/story tests; new blocks via agent skill pipeline only) |
| Shell main landmark | `packages/appshell/src/app-shell-main.tsx` | Yes — Grade B (`app-shell-main.test.tsx`) |
| Downstream boundary | `packages/appshell/src/__tests__/downstream-governance-wiring.test.ts` | Yes — Grade A (7 tests — no forbidden imports) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `shell-composition-complete-status` | Promotion to **Complete — enterprise 9.5 accepted** blocked on DoD #14 peer review only | amber | Architecture Authority (PR) | Complete | DoD #14 `[x]`; waivers reconfirmed at PR merge; rename to `[Complete]` |
| `shell-composition-e2e` | E2E browser proof optional per runtime matrix | blue | — | §Waivers | Waiver or E2E path before Complete |

> **Closed (Slice 2 — 2026-06-25):** `shell-composition-biome-pkg` (PKG biome exit 0); `appshell-studio-normalization` (§Waiver `shell-composition-studio-deferral` reconfirmed; `studio-legacy-class-guard.test.ts` + `check:governance` exit 0).
>
> **Closed (Slice 3 — 2026-06-25):** `shell-composition-29-closeout` (29/30 audit-adjusted; all §Acceptance gates exit 0); `shell-composition-matrix-fdr-drift` (matrix AppShell row synced — partial; Complete prefix deferred on DoD #14).

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 on this table **and** DoD #14 peer review closed **and** waivers reconfirmed at PR ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). This FDR is an **enterprise 9.5 candidate at 29/30 audit-adjusted** (Slice 3, 2026-06-25) — not final Complete until DoD #14 closes.
>
> Score 0–5 per dimension (integers only in table). Every point maps to gate exit 0, test path, or explicit §Waivers row. Where waivers or open DoD rows cap a dimension, the **audit-adjusted** score is used for the honest total.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + contract drift suite (23 tests) — Grade A | Slice 3 gate log re-run |
| Test coverage | 5/5 | `test:run` exit 0 (368 appshell, 53 files) + ERP layout closeout (2 tests) — Grade A | E2E browser waived (`shell-composition-e2e` affirmed Slice 3) |
| Observability + audit | 4/5 | Read-path shell; ERP layout source inspection — Grade B | Waiver `shell-composition-observability-read-path` affirmed Slice 3 |
| Security + RBAC + RLS | 5/5 | `governed-ui-consumption.test.ts` (57 tests) + TIP-004 policy — Grade A | Slice 3 gate log re-run |
| Documentation + BRD traceability | 5/5 | FDR + index + matrix + `check:documentation-drift` exit 0 — Grade A | DoD #14 peer review still `[ ]`; blocks `[Complete]` prefix only |
| Maintainability + Clean Core | 5/5 | PKG biome + boundaries + foundation-disposition + typecheck/test/governance exit 0 — Grade A | Bulk studio migration superseded by `afenda-shadcn-components` per-block pipeline (`shell-composition-studio-deferral` permanent) |
| **Total (audit-adjusted)** | **29/30** | **~9.7 / 10 equivalent** — enterprise 9.5 candidate | DoD #14 peer review only blocker for Complete |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — shell composition at approved `@afenda/appshell` boundary; chrome regions and slot names owned in `appshell-authority.contract.ts`; governed UI consumption via TIP-004 policy and `wiring/governance.ts`.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` | `AppShell`, `AppShellMain`, `DashboardWidgetRenderContextProvider`, contract types | No | B→B |
| `apps/storybook` | appshell stories + fixtures | No | B→B |
| `@afenda/metadata-ui` | Shell slot composition (read-only consumer) | No | B→B |
| `@afenda/ui` | Upstream — appshell consumes governed primitives only | No | B→B |

**ERP giant compatibility (Research confirmed):**

- **Module scale:** Protected layout composes `AppShell` with manifest-driven `navigationPages` from `resolveManifestNavigationFromOperatingContext` — scales with entitlements module count (8 modules today).
- **Chrome regions:** Four governed regions (`sidebar`, `header`, `main`, `footer`) with slot contracts — ERP pages mount in `AppShellMain` without duplicating chrome.
- **Context switching:** `WorkspaceContextSwitcher` wired in protected layout; operating context bridged via `toApplicationShellOperatingContext`.
- **Dashboard canvas:** Widget registry + layout persistence (`packages/appshell/src/dashboard/`) supports configurable workspace home without shell fork.
- **Studio blocks:** 93+ `.tsx` files under `packages/appshell/` incl. shadcn-studio dashboard blocks — governed in production; new blocks follow `afenda-shadcn-components` skill (no bulk migration FDR).
- **Integration proof:** `protected-appshell-token-closeout.test.ts` validates production layout composition + CSS token order.

Upstream consumers scan: `apps/erp` imports `@afenda/appshell` in protected layout and workspace components. No other packages should import `packages/appshell/src/shadcn-studio/` directly without dependency-registry entry.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| Fiori UX | Fusion UX | `pnpm --filter @afenda/appshell check:governance` | 1 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/appshell typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-006 / tip-ui-05.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Shell mounts without TIP-004 violations | 1 | `check:governance` |
| internal | TypeScript strict on appshell package | 4 | `typecheck` |
| internal | ERP protected layout wires AppShell with identity + context + nav | 1 | `protected-appshell-token-closeout.test.ts` |
| internal | Contract drift guards prevent duplicated chrome authority | 16 | `appshell-authority.contract.test.ts` |
| tip-006 (archive) | Authority contracts + public barrel re-exports | 18 | `contract-public-api-drift.test.ts` |
| tip-ui-05 (archive) | Dashboard canvas + studio blocks in production ERP | 2 | `pnpm --filter @afenda/appshell test:run` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | ApplicationShell composes header, sidebar, main, footer from props | `app-shell.render.test.tsx` (13 tests pass) |
| Performance efficiency | Dashboard charts lazy-loaded (`recharts` client boundary) | code review + dashboard render tests |
| Compatibility | Public barrel exports stable contract surface | `contract-public-api-drift.test.ts` |
| Security | Zero `className` on `@afenda/ui` primitives in appshell blocks | `governed-ui-consumption.test.ts` (56 tests) |
| Maintainability | Biome clean; strict typecheck; 0 `any` in shell paths | `typecheck` exit 0; PKG biome tracked in gap `shell-composition-biome-pkg` |
| Reliability | Deterministic chrome resolution from props | `app-shell.types.test.ts` |
| Documentation | Index + matrix aligned with FDR evidence | `pnpm check:documentation-drift` (Evidence-sync) |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Shell composition (read path) | N/A — no governed mutation in layout render | — |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-001-shell-composition**
- [`fdr-001-playbook.md`](fdr-001-playbook.md) — sub-agent routing (`/fdr-start`, `/fdr-orchestrate` §F Phase 1)
- Registry: `PKG001_APPSHELL` read-only snapshot in §Registry link
- Sibling: [`fdr-001-manifest-nav`](%5BPartially%20Implemented%5D%20fdr-001-manifest-nav.md) — sequential, not parallel (same `runtimeOwner`)
- Upstream: `@afenda/ui` governed primitives (`fdr-018-governed-primitives`) — read-only; no primitive edits in this FDR
- Archive evidence: [`tip-006-appshell-authority.md`](../../delivery/tips/[Complete]%20tip-006-appshell-authority.md) · [`tip-ui-05-erp-app-surfaces.md`](../../delivery/tips/[Complete]%20tip-ui-05-erp-app-surfaces.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-001-shell-composition.md` | — | Modified per slice |
| `packages/appshell/src/contracts/` | `@afenda/appshell` | Modified (Implementation slices only) |
| `packages/appshell/src/app-shell.tsx` | `@afenda/appshell` | Modified (Implementation slices only) |
| `packages/appshell/src/shadcn-studio/blocks/` | `@afenda/appshell` | Modified (Implementation slices only) |
| `packages/appshell/src/__tests__/governed-ui-consumption.test.ts` | `@afenda/appshell` | Modified (Implementation slices only) |
| `apps/erp/src/app/(protected)/layout.tsx` | `apps/erp` | Modified only if listed in slice Field 3 |

## Acceptance gate

- `pnpm --filter @afenda/appshell typecheck`
- `pnpm --filter @afenda/appshell check:governance`
- `pnpm --filter @afenda/appshell test:run`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: ERP shell composition authority

  Scenario: ApplicationShell composes governed chrome regions
    GIVEN ApplicationShellProps with identity, navigationPages, and operating context
    WHEN ApplicationShell renders
    THEN sidebar, header, main, and footer regions mount per APPSHELL_CHROME_REGIONS
    AND no @afenda/ui primitive receives a className prop from appshell blocks

  Scenario: ERP protected layout wires production ApplicationShell
    GIVEN an authenticated linked session with resolved operating context
    WHEN the protected layout renders
    THEN AppShell receives identity from toAfendaAuthIdentity
    AND manifest navigation resolves via resolveManifestNavigationFromOperatingContext
    AND DashboardWidgetRenderContextProvider wraps page content

  Scenario: Contract drift is caught at compile/test time
    GIVEN APPSHELL_CHROME_REGIONS and APPSHELL_MAIN_SLOTS in appshell-authority.contract.ts
    WHEN a developer duplicates slot names outside contracts/
    THEN appshell-authority.contract.test.ts or contract-public-api-drift.test.ts fails

  Scenario: Governed UI consumption policy holds for all appshell TSX
    GIVEN every .tsx file under packages/appshell/src/ (excluding stories and __tests__)
    WHEN governed-ui-consumption.test.ts runs checkGovernedUiConsumption
    THEN zero TIP-004 violations are reported
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/appshell test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/appshell typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/appshell` (PKG scope) | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix AppShell row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | TIP-004 violation detection in governance test | [x] |
| 18 | Public API compatibility verified | barrel exports + contract drift tests | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score (audit-adjusted + ceiling) | [x] |

## Slices

### Slice 1 — Research (shell-composition)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** B→B

**Purpose:** Reconcile archive tip-006 / tip-ui-05 + runtime matrix **implemented** claims with FDR **Not started**; map contracts → shell composition → ERP protected layout; update §Remaining gaps, §Runtime evidence, and §Enterprise readiness score. No source edits.

**Outcomes:**

- Closed gap `fdr-research-slice-1`
- Closed gap `shell-composition-matrix-fdr-drift` (FDR delivery attestation; matrix row sync deferred to Evidence-sync)
- Status promoted to **Partially Implemented**
- Baseline gate log recorded (typecheck, check:governance, test:run exit 0)
- Readiness score: **25/30 audit-adjusted** · **28/30 evidence-qualified ceiling**
- Slice 2 unblocked for amber closeout (biome + studio normalization)

### Slice 2 — Implementation (amber closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓; sibling [`fdr-001-manifest-nav`](%5BComplete%5D%20fdr-001-manifest-nav.md) **Complete — enterprise 9.5 accepted** (2026-06-25) ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** B→B

**Outcomes:**

- Closed gap `shell-composition-biome-pkg` — `pnpm exec biome check packages/appshell` exit 0 (173 files)
- Closed gap `appshell-studio-normalization` — §Waiver `shell-composition-studio-deferral` reconfirmed; `studio-legacy-class-guard.test.ts` (2 tests) + `check:governance` (57 tests) exit 0
- DoD #2, #4, #5, #17 confirmed green at slice delivery
- Navigation paths touched format/`noNegationElse` only — no behavioural delta to manifest projection
- Readiness score: **26/30 audit-adjusted** · **28/30 evidence-qualified ceiling**
- Slice 3 unblocked for Evidence-sync (29/30 closeout)

#### Gate log (Slice 2 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/appshell typecheck` | 0 | A |
| `pnpm --filter @afenda/appshell check:governance` | 0 | A (57 tests) |
| `pnpm --filter @afenda/appshell test:run` | 0 | A (368 tests, 53 files) |
| `pnpm exec biome check packages/appshell` | 0 | A (173 files) |

#### Design (internal-guide)

> **Superseded (2026-06-25):** Bulk studio normalization is **not** a future FDR slice. Gap `appshell-studio-normalization` closed via waiver; new blocks use [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../../.cursor/skills/afenda-shadcn-components/SKILL.md). Historical Slice 2 text retained for audit trail.

Close amber PKG-001 shell-composition debt: **`shell-composition-biome-pkg`** (PKG-scoped Biome exit 0) and **`appshell-studio-normalization`** (confirm waiver or migrate studio blocks per STUDIO-PATTERN-MAP). Same `runtimeOwner` as manifest-nav — **sequential, not parallel**: manifest-nav is **Complete**; this slice must not change nav projection behaviour. Navigation paths in Field 3 are **format/lint-only** PKG biome hygiene post manifest-nav Complete — no edits to `buildHydratedManifestNavigation` logic, RBAC filter, or `navigation.contract.ts`.

Biome baseline (Research Slice 1): 11 fixable errors; re-run 2026-06-25 shows **12 errors** in five files — three shell-composition (`app-shell-module-workspace-chrome.tsx`, its test, `afenda-appshell.css` module-tab rules) plus two manifest-nav paths (format/`noNegationElse` only). Studio normalization: full Tailwind utility migration is **optional** — close via §Waiver `shell-composition-studio-deferral` when `studio-legacy-class-guard.test.ts` and `check:governance` exit 0; do not edit `packages/ui/`.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-001-shell-composition.md

1. Objective    — Close gaps shell-composition-biome-pkg and appshell-studio-normalization: PKG-scoped Biome exit 0, confirm studio normalization waiver with governance guards green, and regression-proof shell composition gates without nav behaviour change.
2. Allowed layer— packages/appshell/src/shadcn-studio/; packages/appshell/src/__tests__/; packages/appshell/src/styles/afenda-appshell.css; packages/appshell/src/app-shell-module-workspace-chrome.stories.tsx; packages/appshell/src/navigation/ (format/lint-only for PKG biome — no behavioural delta)
3. Files        —
   packages/appshell/src/shadcn-studio/blocks/app-shell-module-workspace-chrome.tsx
   packages/appshell/src/__tests__/app-shell-module-workspace-chrome.test.tsx
   packages/appshell/src/app-shell-module-workspace-chrome.stories.tsx
   packages/appshell/src/styles/afenda-appshell.css
   packages/appshell/src/__tests__/governed-ui-consumption.test.ts
   packages/appshell/src/__tests__/studio-legacy-class-guard.test.ts
   packages/appshell/src/navigation/build-nav-from-manifest.ts
   packages/appshell/src/navigation/__tests__/build-nav-from-manifest.test.tsx
   docs/delivery/FDR/[Partially Implemented] fdr-001-shell-composition.md
4. Prohibited   — do-not-create-accounting-package; do-not-add-classname-on-afenda-ui-primitives; foundation-disposition.registry.ts; packages/ui/; apps/erp/; packages/appshell/src/contracts/navigation.contract.ts; behavioural edits to manifest nav projection (hydration, RBAC filter, MANIFEST_MODULE_IDS)
5. Authority    — ADR-0014 · ADR-0016 · TIP-004 governed UI consumption · PKG001_APPSHELL registry snapshot (§Registry link)
6. Gates        —
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell check:governance
   pnpm --filter @afenda/appshell test:run
   pnpm exec biome check packages/appshell
7. Closes       — Gap shell-composition-biome-pkg; Gap appshell-studio-normalization (via waiver reconfirmation or studio block migration); DoD #2; DoD #4; DoD #5; DoD #17
8. Evidence     —
   packages/appshell/src/shadcn-studio/blocks/app-shell-module-workspace-chrome.tsx
   packages/appshell/src/__tests__/app-shell-module-workspace-chrome.test.tsx
   packages/appshell/src/__tests__/governed-ui-consumption.test.ts
   packages/appshell/src/__tests__/studio-legacy-class-guard.test.ts
   packages/appshell/src/styles/afenda-appshell.css
9. Attestation  — Maintainability (PKG Biome exit 0; studio normalization closed or waived); Test coverage (test:run regression); Security (check:governance + studio-legacy-class-guard hold)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 2 | Tests pass | `pnpm --filter @afenda/appshell test:run` |
| 4 | TypeScript strict | `pnpm --filter @afenda/appshell typecheck` |
| 5 | Biome clean | `pnpm exec biome check packages/appshell` |
| 17 | Security negative path tested | `pnpm --filter @afenda/appshell check:governance` |

#### Known debt

- `shell-composition-complete-status` — DoD #14 peer review still open; deferred to Complete promotion
- `shell-composition-29-closeout` — Evidence-sync Slice 3; requires DoD #3, #6, #7, #8, #9 and full §Acceptance gate set
- Navigation paths in Field 3 are PKG biome gate hygiene only — manifest-nav **Complete**; any lint/format touch must preserve manifest-nav Slice 4–5 behaviour (badge/active hydration, sidebar `aria-current`)
- Full shadcn/studio Tailwind utility migration across all `shadcn-studio/blocks/` remains optional if §Waiver `shell-composition-studio-deferral` reconfirmed at slice delivery
- `shell-composition-e2e` — browser E2E waived until external beta (DoD #19 — Slice 3 / Complete)

### Slice 3 — Evidence-sync (29/30 closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 2 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** B→B

**Outcomes:**

- Closed gap `shell-composition-29-closeout` — **29/30 audit-adjusted**; all §Acceptance gate commands exit 0
- Partial close `shell-composition-matrix-fdr-drift` — AppShell matrix row synced to FDR attestation
- Partial close `shell-composition-complete-status` — index + matrix aligned; DoD #14 peer review remains open
- Waivers affirmed: `shell-composition-observability-read-path`, `shell-composition-e2e`, `shell-composition-studio-deferral`
- DoD #3, #6, #7, #8, #9, #10, #16, #19, #20 closed
- Status remains **Partially Implemented** — `[Complete]` prefix deferred on DoD #14

#### Gate log (Slice 3 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/appshell typecheck` | 0 | A |
| `pnpm --filter @afenda/appshell check:governance` | 0 | A (57 tests) |
| `pnpm --filter @afenda/appshell test:run` | 0 | A (368 tests, 53 files) |
| `pnpm exec biome check packages/appshell` | 0 | A (173 files) |
| `pnpm quality:boundaries` | 0 | A (22 workspaces) |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

#### Design (internal-guide)

Docs-only closeout: re-run Slice 2 PKG gates plus full §Acceptance gate set to attest runtime evidence; recalculate §Enterprise readiness score to **29/30 audit-adjusted** (Observability capped 4/5 under waiver `shell-composition-observability-read-path`; peer review remains open — DoD #14). Sync AppShell row in `afenda-runtime-truth-matrix.md` and `fdr-status-index.md` to cite 29/30 + Slice 2 biome/governance attestation + manifest-nav sibling Complete. Record Slice 3 gate log in FDR. Affirm waivers `shell-composition-observability-read-path`, `shell-composition-e2e`, and `shell-composition-studio-deferral` (reconfirmed Slice 2) — no waiver expiry changes. Close gap `shell-composition-29-closeout`; partial close `shell-composition-complete-status` and `shell-composition-matrix-fdr-drift` (matrix/index synced; Complete prefix blocked on DoD #14). Do **not** rename FDR to `[Complete]`.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-001-shell-composition.md

1. Objective    — Re-run PKG gates and full §Acceptance gate set; recalculate readiness to 29/30 audit-adjusted; sync matrix AppShell row + fdr-status-index; add Slice 3 gate log; close gap shell-composition-29-closeout; affirm waivers shell-composition-observability-read-path, shell-composition-e2e, shell-composition-studio-deferral (reconfirmed Slice 2). Do not rename to [Complete] — DoD #14 peer review still open.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-001-shell-composition.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts; packages/ui/; do-not-create-accounting-package; do-not-add-classname-on-afenda-ui-primitives
5. Authority    — ADR-0014 · ADR-0016 · PKG001_APPSHELL (shell-composition subdomain) · TIP-004 governed UI consumption · archive tip-006 / tip-ui-05 (read-only)
6. Gates        —
   pnpm --filter @afenda/appshell typecheck
   pnpm --filter @afenda/appshell check:governance
   pnpm --filter @afenda/appshell test:run
   pnpm exec biome check packages/appshell
   pnpm quality:boundaries
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap shell-composition-29-closeout; Gap shell-composition-matrix-fdr-drift (matrix row sync — partial close); Gap shell-composition-complete-status (matrix/index sync — peer review remains open); DoD #3; DoD #6; DoD #7; DoD #8; DoD #9; DoD #10; DoD #16; DoD #19; DoD #20
8. Evidence     —
   docs/delivery/FDR/[Partially Implemented] fdr-001-shell-composition.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
9. Attestation  — Documentation + BRD traceability (matrix/index sync; drift exit 0); Enterprise readiness 29/30 audit-adjusted confirmed; Test coverage (368 tests + ERP layout closeout re-run); Maintainability (PKG biome + boundaries + foundation-disposition exit 0); Observability (waiver shell-composition-observability-read-path affirmed)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 3 | Boundaries | `pnpm quality:boundaries` |
| 6 | Registry aligned | `pnpm check:foundation-disposition` |
| 7 | Runtime matrix updated | matrix AppShell row in `afenda-runtime-truth-matrix.md` |
| 8 | fdr-status-index updated | index row `fdr-001-shell-composition` |
| 9 | Drift green | `pnpm check:documentation-drift` |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 Completion Report |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` |
| 19 | E2E requirement satisfied or waived | §Waivers `shell-composition-e2e` affirmed |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table + Slice 3 gate log |

#### Known debt

- DoD #14 peer review — Architecture Authority PR approval; blocks `[Complete]` prefix rename
- `shell-composition-complete-status` — partial close at Slice 3; final Complete promotion after DoD #14
- `shell-composition-e2e` — browser E2E waived until external beta go-live; waiver affirmed at Slice 3
- `shell-composition-observability-read-path` — shell layout read path; audit event deferred to Phase 9 / observability FDRs
- `shell-composition-studio-deferral` — bulk Tailwind migration **not scheduled**; per-block promotion via `afenda-shadcn-components` skill; `studio-legacy-class-guard.test.ts` + `ui:guard` hold regressions (permanent policy)

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert appshell / ERP layout commit; rebuild package | Quarterly-release-safe; no hand-edited registry objects |

Oracle analog: confirm upgrade-safe — no internal object modifications outside `runtimeOwner`. SAP analog: transport rollback = git revert + gate re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `shell-composition-observability-read-path` | Audit event on shell layout render (ISO observability 4/5) | Shell composition is synchronous read path; security enforced at route guard + TIP-004 | Architecture Authority (Research attestation) | Phase 9 / ERP observability FDR — **reconfirmed Slice 3 (2026-06-25)** |
| `shell-composition-e2e` | Browser E2E for shell composition | Runtime matrix marks E2E optional; 368 unit/integration tests + ERP layout closeout prove pipeline | Architecture Authority | External beta go-live — **affirmed Slice 3 (2026-06-25)** |
| `shell-composition-studio-deferral` | Bulk shadcn/studio Tailwind utility migration across all blocks | Blocks render in production; new blocks normalized per [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../../.cursor/skills/afenda-shadcn-components/SKILL.md); `studio-legacy-class-guard.test.ts` + `ui:guard` prevent regressions | Architecture Authority | **Permanent** — affirmed Slice 3 (2026-06-25); not an FDR implementation track |

## §Knowledge transfer

### Operational runbook

- Shell entry point: `packages/appshell/src/app-shell.tsx` — `ApplicationShell` / `AppShell`
- Contract authority: `packages/appshell/src/contracts/appshell-authority.contract.ts` — `APPSHELL_CHROME_REGIONS`, slot registries
- Public API: `packages/appshell/src/index.ts`
- ERP wiring: `apps/erp/src/app/(protected)/layout.tsx`
- TIP-004 gate: `pnpm --filter @afenda/appshell check:governance`

### Observability

- Shell composition is a read path — no audit event on layout render (waived — see §Waivers)
- Dashboard mutations may emit audit via ERP workspace API (out of shell FDR scope)
- Integration trace: run `protected-appshell-token-closeout.test.ts` for production layout proof
- **Future (optional):** correlation ID propagation, layout-render diagnostic trace — tracked under observability FDRs

### On-call escalation

- Symptom: TIP-004 violation in appshell block → run `governed-ui-consumption.test.ts`; check `wiring/governance.ts`
- Symptom: shell layout broken after module add → verify manifest nav sibling FDR; run ERP layout test
- Owner: `@afenda/appshell` (PKG-001) via `appshell-agent`

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate** at **29/30 audit-adjusted** because DoD #14 peer review remains open. All §Acceptance gate commands exit 0 (Slice 3 gate log). Waivers reconfirmed at Slice 3.

Accepted score composition (29/30 audit-adjusted):

1. Browser E2E waived until external beta go-live (`shell-composition-e2e`) — Test dimension 5/5 with unit/integration + ERP layout proof.
2. Shell layout read-path observability waived (`shell-composition-observability-read-path`) — Observability 4/5.
3. Studio Tailwind utility migration deferred with regression guard (`shell-composition-studio-deferral`) — Maintainability 5/5 with PKG gates green.
4. Documentation 5/5 — FDR/index/matrix synchronized; DoD #14 blocks `[Complete]` prefix only.

Until DoD #14 is closed, this FDR must not be represented as fully **Complete** or as final **enterprise 9.5 accepted**.

**Promotion to Complete — enterprise 9.5 accepted requires:**

1. Architecture Authority peer review approval (DoD #14).
2. Confirmation that §Waivers remain valid at merge time.
3. All §Acceptance gate commands exit 0 (verified Slice 3).
4. FDR filename/status/index promotion to `[Complete]`.
5. Runtime matrix AppShell row updated to **Complete — enterprise 9.5 accepted** (post peer review).

## Verdict

**Partially Implemented — enterprise 9.5 candidate at 29/30 audit-adjusted (2026-06-25).**

Research Slice 1, Implementation Slice 2, and Evidence-sync Slice 3 are complete. Archive tip-006 / tip-ui-05 claims reconcile with runtime matrix **implemented** evidence: PKG-001 typecheck, governance, test, biome, boundaries, foundation-disposition, and documentation-drift gates exit 0; ERP protected layout closeout passes. Matrix and fdr-status-index synced. **Do not rename to `[Complete]`** until Architecture Authority peer review closes DoD #14.
