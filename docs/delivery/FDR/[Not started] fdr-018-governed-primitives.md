# fdr-018-governed-primitives — Governed Primitives

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented (Research Slice 1 ✓) |
| **FDR ID** | `fdr-018-governed-primitives` |
| **Registry entry ID** | `PKG018_UI` |
| **Package** | `@afenda/ui` (PKG-018) |
| **Lane** | amber-lane |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Medium |
| **BRD reference** | internal — TIP-004 primitive governance + ADR-0008 deferral |
| **Enterprise readiness** | **21/30 audit-adjusted** · **28/30 evidence-qualified ceiling** — enterprise **9.5 candidate blocked** (Research + test debt; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | Fiori UX · Fusion UX |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `governed-primitives`; sibling FDR `fdr-018-ui-consumption` scopes consumer rules on the same `PKG018_UI` entry.

| Field | Value |
| --- | --- |
| id | `PKG018_UI` |
| packageId | PKG-018 |
| domain | `governed-primitives` |
| lane | amber-lane |
| runtimeOwner | `packages/ui` |
| gates | `pnpm --filter @afenda/ui typecheck`; `pnpm ui:guard:scan` |
| prohibited | `do-not-create-accounting-package`; `do-not-migrate-forwardref-before-adr-0008-accepted` |
| allowedAgents | `ui-primitive-agent`; `foundation-registry-owner`; `fdr-slice-implementer` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/ui` (PKG-018) | Governed primitive registry, resolver, recipe maps, className policy | `packages/ui/src/governance/` |
| `@afenda/design-system` (PKG-004) | Token/recipe authority upstream (read-only in Research) | `packages/design-system/` |
| `@afenda/appshell` (PKG-001) | Consumer — zero className on primitives (read-only; see `fdr-018-ui-consumption`) | `packages/appshell/` |
| `apps/erp` (PKG-007) | Consumer — governed UI consumption (read-only) | `apps/erp/` |

## Purpose

Lock and maintain the governed UI primitive author layer — component registry → `resolvePrimitiveGovernance()` → layout-only className policy — so design-system tokens and recipes flow through a single resolver without consumer-side `className` overrides or unauthorized forwardRef migration before ADR-0008 acceptance.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md) · [ADR-0008](../../adr/ADR-0008-react19-ref-as-prop-ui-author-layer.md) (ref-as-prop migration deferred).

Archive input (not implementation authority): [`tip-004-ui-consumption.md`](../../delivery/tips/[Complete]%20tip-004-ui-consumption.md) · [`tip-ui-06-react19-ref-as-prop.md`](../../delivery/tips/[Blocked]%20tip-ui-06-react19-ref-as-prop.md).

## Scope

**In scope**

- `packages/ui/src/governance/primitive-governance.ts` — canonical `resolvePrimitiveGovernance()` resolver
- `packages/ui/src/governance/primitive-registry.ts` — `GOVERNED_PRIMITIVE_REGISTRY` authority
- `packages/ui/src/governance/class-name-guard.ts` — layout-only className enforcement
- `packages/ui/src/governance/recipe.ts`, `recipe-maps.ts`, `authority-recipe-maps.ts` — governed recipe resolution
- Governance tests under `packages/ui/src/__tests__/governance/`
- FDR-aligned reconciliation of archive tip-004 + matrix claims vs FDR **Not started** status
- ADR-0008 forwardRef → ref-as-prop batch **deferred** per registry prohibited rule

**Out of scope**

- Consumer-side className policy (`fdr-018-ui-consumption`, TIP-004 consumer layer)
- Shell layout composition (`fdr-001-shell-composition`)
- forwardRef migration batch before ADR-0008 Accepted (`do-not-migrate-forwardref-before-adr-0008-accepted`)
- Accounting runtime (ADR-0010)
- Editing shadcn stock defaults in `packages/design-system/components/ui/` for app-only polish

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate primitive registry entries outside `primitive-registry.ts` |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-018 | **Sequential** with `fdr-018-ui-consumption` — same registry entry; orchestrator serializes |
| Parallel PKG-001 | **Sequential** with `fdr-001-shell-composition` when touching shared UI governance gates |
| ADR-0008 gate | No forwardRef migration until ADR-0008 Accepted — hard stop |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 = Research only — no `packages/` or `apps/` edits.  
> TIP archive / runtime matrix may show prior work — that is **not** FDR delivery status until Research reconciles evidence grades.

### Discovery questions

| Question | Expected answer source |
| --- | --- |
| Does `resolvePrimitiveGovernance()` cover all exported governed components? | `primitive-registry.ts` vs `packages/ui/src/components/` |
| Do governance tests pass under strict runtime? | `pnpm --filter @afenda/ui test:run`; `AFENDA_GOVERNANCE_RUNTIME=strict` |
| Is ADR-0008 still blocking forwardRef batch? | [ADR-0008](../../adr/ADR-0008-react19-ref-as-prop-ui-author-layer.md) status |
| Does `pnpm ui:guard:scan` exit 0 for author layer? | ui-guard Gate D scan |
| Which components lack recipe coverage? | `recipe-coverage.ts`; `recipe-coverage` tests |

### Files to inspect

| Path | Why |
| --- | --- |
| `packages/ui/src/governance/primitive-governance.ts` | Core resolver |
| `packages/ui/src/governance/primitive-registry.ts` | Registry authority |
| `packages/ui/src/governance/class-name-guard.ts` | className policy |
| `packages/ui/src/governance/primitive-contract.ts` | Input/output contracts |
| `packages/ui/src/__tests__/governance/primitive-governance.test.ts` | Resolver behaviour |
| `packages/ui/src/__tests__/governance/class-name.test.ts` | Layout-only policy |
| `packages/ui/src/__tests__/primitive-registry.test.ts` | Registry drift guards |
| `packages/ui/src/__tests__/governance/recipe-coverage.test.ts` | Recipe completeness |
| `docs/governance/tip-004-policy.md` | Canonical TIP-004 policy |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | `@afenda/ui` row |

### Skills to read

- `enterprise-erp-standards` — §8 `governed-primitives` controls (Fiori / Fusion UX)
- `govern-primitive` — author-layer className rules
- `write-fdr` — 25-section template; no handoff blocks in §Slices

### Matrix reconciliation (Research Slice 1 — 2026-06-25)

| Matrix row | Matrix status | FDR status | Reconciliation |
| --- | --- | --- | --- |
| UI Primitives | **implemented** | Partially Implemented (Research ✓) | Runtime **implemented** unchanged — 58 registry entries + resolver + recipes exist; FDR delivery now attested at **21/30** with documented test debt (8 failures) and ADR-0008 deferral |
| TIP-004B (archive Complete) | **implemented** | Partially Implemented | Archive is evidence only ([`tip-004-policy.md`](../../governance/tip-004-policy.md)); FDR owns delivery grades — waiver `ui-fdr-archive-authority` closes on this reconciliation |

### Registry → resolver → recipe coverage map (Research Slice 1)

| Layer | Path | Coverage | Grade |
| --- | --- | --- | --- |
| Registry | `primitive-registry.ts` → `GOVERNED_PRIMITIVE_REGISTRY` | **58/58** governed components; `STOCK_SHADCN_PENDING` empty | A |
| Resolver | `primitive-governance.ts` → `resolvePrimitiveGovernance()` | All registered primitives; strict runtime throws on unknown component / invalid slot | A (`typecheck` exit 0) |
| className guard | `class-name-guard.ts` → `guardClassName` | Layout-only policy at author boundary; negative paths in `class-name.test.ts` pass | B |
| Recipe axes | `recipe-coverage.ts` → `GOVERNED_RECIPE_VARIANT_AXES` | **10** recipe names aligned with design-system registry | A (`recipe-coverage.test.ts` pass) |
| Recipe maps | `recipe-maps.ts` / `authority-recipe-maps.ts` | Per-primitive slot + variant class maps wired via registry `slotClassNames*` | B |
| Public export | `resolve-primitive-governance.ts` re-export | `@afenda/ui/governance` barrel stable | B |

**Known resolver/registry drift (Slice 2):** `Spinner` passes `slotKey: size` but registry entry lacks `dataSlotByKey` for size keys — resolver requires `dataSlotByKey` when `slotKey` is set (`primitive-governance.ts` L207–214) despite `spinnerSlotClassNamesByKey` defining `sm`/`xl` class maps.

### ADR-0008 forwardRef blocker attestation (Research Slice 1)

| Check | Result |
| --- | --- |
| ADR status | **Proposed** — not Accepted ([ADR-0008](../../adr/ADR-0008-react19-ref-as-prop-ui-author-layer.md)) |
| Registry prohibited | `do-not-migrate-forwardref-before-adr-0008-accepted` active on `PKG018_UI` |
| Runtime state | ~58 author-layer components retain `React.forwardRef`; consumer API unchanged |
| Slice 3 | **Blocked** until ADR Accepted + registry rule lifted |
| Waiver | `ui-adr-0008-ref-as-prop` — maintainability capped at 2/5 audit-adjusted |

### Test failure root-cause taxonomy (8 failures — `test:run` exit 1)

| # | Test file | Test name | Root cause | Slice 2 fix vector |
| ---: | --- | --- | --- | --- |
| 1 | `dropdown-menu.test.tsx` | does not leak trigger layout classes onto Button when asChild | Controlled `open` menu: a11y tree exposes `menu` named "Actions" (from `aria-label`) but no `button` role with that name — assertion/query drift under open state | Adjust test query or test without forced `open` |
| 2–7 | `spinner.test.tsx` | 6 governance tests (render, data attrs, ref, a11y, loading state) | `slotKey: size` (default `sm`) triggers `dataSlotByKey` lookup; Spinner registry has `slotClassNamesByKey` but **no** `dataSlotByKey` → TIP-004B violation in strict runtime | Add `dataSlotByKey` size map to Spinner registry entry **or** resolver leaf-control exception |
| 8 | `spinner.test.tsx` | applies governed size variant on root | Same as #2–7 — explicit `size="xl"` slotKey | Same as #2–7 |

Governance unit tests (`primitive-governance.test.ts`, `class-name.test.ts`, `primitive-registry.test.ts`, `recipe-coverage.test.ts`) **pass** — debt is component-level only.

### Baseline gate log (Research Slice 1 — 2026-06-25, fdr-slice-implementer)

| Gate | Exit | Grade | Notes |
| --- | ---: | --- | --- |
| `pnpm check:documentation-drift` | 0 | A | |
| `pnpm check:foundation-disposition` | 0 | A | |
| `pnpm quality:boundaries` | 0 | A | 22 workspaces |
| `pnpm --filter @afenda/ui typecheck` | 0 | A | read-only baseline |
| `pnpm --filter @afenda/ui test:run` | 1 | C | **8 failed / 2817 passed / 2825 total**; 2 files |
| `pnpm ui:guard:scan` | 0 | A | 243 files clean |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Governance resolver | `packages/ui/src/governance/primitive-governance.ts` | Yes — Grade A (`typecheck` exit 0) |
| Resolver re-export | `packages/ui/src/governance/resolve-primitive-governance.ts` | Yes — Grade B |
| Primitive registry | `packages/ui/src/governance/primitive-registry.ts` | Yes — Grade B |
| className guard | `packages/ui/src/governance/class-name-guard.ts` | Yes — Grade B |
| Governance tests | `packages/ui/src/__tests__/governance/primitive-governance.test.ts` | Partial — Grade C (`test:run` exit 1; 8 failures) |
| Registry tests | `packages/ui/src/__tests__/primitive-registry.test.ts` | Partial — Grade C (included in test:run debt) |
| Component library | `packages/ui/src/components/` (58 components per matrix) | Yes — Grade B (matrix cites) |
| ui-guard scan | `scripts/governance/governed-ui-consumption.mjs` | Yes — Grade A (`ui:guard:scan` exit 0) |
| ADR-0008 ref-as-prop | — | Blocked — forwardRef batch deferred |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `fdr-research-slice-1` | ~~FDR delivery not started — reconcile matrix evidence with FDR grades~~ | amber | `ui-primitive-agent` | Slice 1 | **Closed** — Research Slice 1 ✓ (2026-06-25) |
| `ui-adr-0008-ref-as-prop` | ADR-0008 ref-as-prop batch blocked | amber | Architecture Authority | Post-ADR-0008 | ADR-0008 Accepted; registry prohibited rule lifted |
| `ui-fdr-gate-attestation` | ~~PKG-018 gates partially recorded — `test:run` exit 1~~ | amber | `ui-primitive-agent` | Slice 1 | **Closed** — baseline gate log attested; `test:run` exit 1 documented with root-cause taxonomy |
| `ui-test-run-debt` | 8 failing tests in `@afenda/ui test:run` (manifest-nav v2 audit) | amber | `ui-primitive-agent` | Slice 2 | All PKG-018 tests exit 0 |
| `ui-fdr-status-promotion` | ~~Status remains Not started until Research closes gaps~~ | amber | Architecture Authority | Slice 1 | **Closed** — FDR promoted to Partially Implemented (Research ✓) |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 on this table **and** DoD #14 peer review **and** ADR-0008 path resolved or waived ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). Until then this FDR is an **enterprise 9.5 candidate blocked**, not final Complete.
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row. Where open test debt or ADR-0008 caps a dimension, the **audit-adjusted** score is used.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + `primitive-contract.ts` — Grade A | — |
| Test coverage | 3/5 | `test:run` exit 1 (8 failed / 2817 passed / 2825) — Grade C | Downgraded from matrix claim; Spinner `dataSlotByKey` + DropdownMenu a11y — fix in Slice 2 |
| Observability + audit | 3/5 | Author layer read path — Grade C; waiver `ui-governance-observability-read-path` | — |
| Security + RBAC + RLS | 4/5 | `class-name-guard.ts` + unknown-component tests — Grade B | — |
| Documentation + BRD traceability | 4/5 | FDR + TIP-004 policy + `check:documentation-drift` exit 0 — Grade A | DoD #14 open |
| Maintainability + Clean Core | 2/5 | Clean Core B; ADR-0008 forwardRef debt + test debt — Grade C | Waiver `ui-adr-0008-ref-as-prop` |
| **Total (audit-adjusted)** | **21/30** | **~7.0 / 10** — honest Not started score | |
| **Total (evidence-qualified ceiling)** | **28/30** | After test debt + Research closeout + ADR-0008 waiver path | Not final 9.5 |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — primitive governance at approved `@afenda/ui` author boundary; registry entries owned in `primitive-registry.ts`; recipes sourced from design-system authority maps.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/appshell` | `@afenda/ui`, `@afenda/ui/governance` | No | B→B |
| `@afenda/metadata-ui` | Governed primitives for metadata renderers | No | B→B |
| `apps/erp` | `@afenda/ui` primitives via consumer rules | No | B→B |
| `apps/storybook` | Component stories + governance stories | No | B→B |

**ERP giant compatibility (Research to confirm):**

- **Component scale:** 58 components per matrix; registry must list every governed export.
- **Recipe coverage:** `recipe-coverage.ts` guards missing recipe maps before release.
- **Strict runtime:** Governance violations throw under `AFENDA_GOVERNANCE_RUNTIME=strict` in CI.
- **ADR-0008:** forwardRef retention is documented debt — no silent React 19 migration.

Upstream consumers scan: `@afenda/appshell`, `@afenda/metadata-ui`, `apps/erp` import `@afenda/ui` public barrel only. No consumer may import `packages/ui/src/governance/` internals except via `@afenda/ui/governance`.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| Fiori UX | Fusion UX | `pnpm ui:guard:scan` | 2 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/ui typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive tip-004.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Governed components resolve via registry + recipe only | 2 | `primitive-governance.test.ts` |
| internal | Non-layout className rejected at author boundary | 17 | `class-name.test.ts` |
| internal | Unknown component name fails governance guard | 17 | `primitive-governance.test.ts` |
| tip-004 (archive) | Primitive registry matches exported components | 18 | `primitive-registry.test.ts` |
| ADR-0008 | forwardRef batch deferred until ADR Accepted | 19 | §Waivers |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Resolver returns recipe + layout className for registered primitives | `primitive-governance.test.ts` |
| Performance efficiency | Resolver is synchronous O(1) registry lookup per call | unit test + code review |
| Compatibility | Recipe maps align with design-system tokens | `design-system-consumption.test.ts` |
| Usability / accessibility | Accessibility requirements per primitive in registry | `accessibility.test.ts` |
| Security | className guard blocks arbitrary styling at author layer | `class-name-guard.ts` + tests |
| Maintainability | Strict typecheck; biome clean; recipe coverage gate | `typecheck`; `recipe-coverage.test.ts` |
| Documentation | Index + matrix + TIP-004 policy aligned | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Primitive registry edit (author layer) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |
| UI render (read path) | N/A — no governed mutation in resolver | — |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-018-governed-primitives**
- Registry: `PKG018_UI` read-only snapshot in §Registry link
- Sibling: [`fdr-018-ui-consumption`](%5BNot%20started%5D%20fdr-018-ui-consumption.md) — sequential, same registry entry
- Sibling: [`fdr-001-shell-composition`](%5BNot%20started%5D%20fdr-001-shell-composition.md) — sequential when touching shared UI gates
- Upstream: `@afenda/design-system` token/recipe authority (PKG-004)
- Blocker: [ADR-0008](../../adr/ADR-0008-react19-ref-as-prop-ui-author-layer.md) — forwardRef migration
- Policy: [`docs/governance/tip-004-policy.md`](../../governance/tip-004-policy.md)
- Archive evidence: [`tip-004-ui-consumption.md`](../../delivery/tips/[Complete]%20tip-004-ui-consumption.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-018-governed-primitives.md` | — | Modified per slice |
| `packages/ui/src/governance/primitive-governance.ts` | `@afenda/ui` | Modified (Implementation slices only) |
| `packages/ui/src/governance/primitive-registry.ts` | `@afenda/ui` | Modified (Implementation slices only) |
| `packages/ui/src/governance/class-name-guard.ts` | `@afenda/ui` | Modified (Implementation slices only) |
| `packages/ui/src/__tests__/governance/primitive-governance.test.ts` | `@afenda/ui` | Modified (Implementation slices only) |
| `packages/ui/src/__tests__/governance/recipe-coverage.test.ts` | `@afenda/ui` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm --filter @afenda/ui typecheck`
- `pnpm --filter @afenda/ui test:run`
- `pnpm ui:guard:scan`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Governed UI primitive author layer

  Scenario: Registered primitive resolves governance output
    GIVEN a component name registered in GOVERNED_PRIMITIVE_REGISTRY
    AND valid PrimitiveGovernanceInput with allowed layout className
    WHEN resolvePrimitiveGovernance is called
    THEN the result includes resolved recipe classNames
    AND layout className passes assertAllowedLayoutClassName
    AND slot roles match the primitive definition

  Scenario: Unknown component name triggers governance violation
    GIVEN a component name not in GOVERNED_PRIMITIVE_REGISTRY
    WHEN resolvePrimitiveGovernance is called under strict runtime
    THEN governance enforcement throws with TIP-004B violation message
    AND no className output is returned

  Scenario: Non-layout className is rejected at author boundary
    GIVEN a governed Button primitive
    AND caller supplies a non-layout utility className (e.g. color override)
    WHEN className guard evaluates the input
    THEN the non-layout class is rejected
    AND only layout-permitted tokens remain

  Scenario: forwardRef migration remains blocked before ADR-0008
    GIVEN registry prohibited rule do-not-migrate-forwardref-before-adr-0008-accepted
    WHEN an agent attempts batch forwardRef removal
    THEN implementation is blocked until ADR-0008 Accepted
    AND gap ui-adr-0008-ref-as-prop remains tracked in §Remaining gaps
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/ui test:run` | [ ] |
| 3 | Boundaries | `pnpm quality:boundaries` | [ ] |
| 4 | TypeScript strict | `pnpm --filter @afenda/ui typecheck` | [ ] |
| 5 | Biome clean | `pnpm exec biome check packages/ui` | [ ] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [ ] |
| 7 | Runtime matrix updated | matrix `@afenda/ui` row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [ ] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [ ] |
| 17 | Security negative path tested | unknown component + className rejection tests | [ ] |
| 18 | Public API compatibility verified | `@afenda/ui` + `@afenda/ui/governance` export surface stable | [ ] |
| 19 | E2E requirement satisfied or waived | §Waivers (ADR-0008) | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 1 — Research (governed-primitives baseline)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Medium  
**Clean Core impact:** B→B

#### Design (internal-guide)

Reconcile archive tip-004 + runtime matrix **implemented** UI Primitives row with FDR **Not started** status. Map `GOVERNED_PRIMITIVE_REGISTRY` → `resolvePrimitiveGovernance()` → recipe coverage; run PKG-018 baseline gates (read-only); confirm ADR-0008 forwardRef blocker; document 8 failing tests root-cause taxonomy; update §Runtime evidence grades and §Enterprise readiness score — **no `packages/ui` or consumer edits**.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Not started] fdr-018-governed-primitives.md

1. Objective    — Reconcile tip-004 archive + runtime matrix with FDR status; map primitive registry→resolver→recipe coverage; produce baseline gate log, ADR-0008 blocker attestation, and readiness score for Slice 2 unblock.
2. Allowed layer— docs-only (`docs/delivery/FDR/`, `docs/delivery/fdr-status-index.md`, `docs/architecture/afenda-runtime-truth-matrix.md`)
3. Files        —
   docs/delivery/FDR/[Not started] fdr-018-governed-primitives.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — `packages/` source edits; `apps/` source edits; `foundation-disposition.registry.ts`; `do-not-create-accounting-package`; `do-not-migrate-forwardref-before-adr-0008-accepted`
5. Authority    — ADR-0014 · ADR-0016 · ADR-0008 (deferral) · PKG018_UI registry snapshot (§Registry link) · [`tip-004-policy.md`](../../governance/tip-004-policy.md)
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
   pnpm quality:boundaries
   pnpm --filter @afenda/ui typecheck (read-only baseline — report exit code)
   pnpm --filter @afenda/ui test:run (read-only baseline — report exit code and failure count)
   pnpm ui:guard:scan (read-only baseline — report exit code)
7. Closes       — Gap `fdr-research-slice-1`; Gap `ui-fdr-gate-attestation`; DoD #1, #7, #8, #20 (initial score)
8. Evidence     —
   packages/ui/src/governance/primitive-governance.ts
   packages/ui/src/governance/primitive-registry.ts
   packages/ui/src/governance/class-name-guard.ts
   packages/ui/src/governance/recipe-coverage.ts
   packages/ui/src/__tests__/governance/primitive-governance.test.ts
   packages/ui/src/__tests__/governance/class-name.test.ts
   packages/ui/src/__tests__/primitive-registry.test.ts
   packages/ui/src/__tests__/governance/recipe-coverage.test.ts
9. Attestation  — Documentation (FDR evidence table Grade A); Contract stability discovery (typecheck Grade A); Test coverage baseline (test:run exit 1 — 8 failures documented); Security discovery (class-name-guard paths Grade B)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row |
| 7 | Runtime matrix updated | matrix `@afenda/ui` row |
| 8 | fdr-status-index updated | index row |
| 20 | Enterprise readiness score updated | §Enterprise readiness score initial (21/30 audit-adjusted) |

#### Known debt

- `ui-test-run-debt` (8 failures) deferred to Slice 2 Implementation — blocks DoD #2
- `ui-adr-0008-ref-as-prop` blocks Slice 3 until ADR-0008 Accepted — waiver active
- Sequential with `fdr-018-ui-consumption` on `PKG018_UI` — orchestrator must serialize
- Status promotion to **Partially Implemented** requires gate attestation complete even if `test:run` exit 1

### Slice 2 — Implementation (governance closeout)

**Status:** Not started  
**Prerequisite:** Slice 1 Complete  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** B→B

**Purpose:** Close PKG-018 gate blockers from Research; fill recipe coverage gaps; achieve enterprise 9.5 (29/30) where ADR-0008 waiver permits.

**Expected deliverables / gaps to close:**

- Any fixes in `packages/ui/src/governance/` per Research findings
- Full acceptance gates exit 0
- Enterprise readiness target: **29/30** (maintainability may remain 4/5 with ADR-0008 waiver)

### Slice 3 — ADR-0008 migration (deferred)

**Status:** Blocked  
**Prerequisite:** ADR-0008 Accepted  
**Type:** Implementation  
**Risk class:** High  
**Clean Core impact:** B→A (target)

**Purpose:** Execute ref-as-prop batch across governed primitives once ADR-0008 lifts registry prohibited rule.

**Expected deliverables / gaps to close:**

- Close gap `ui-adr-0008-ref-as-prop`
- Remove waiver `ui-adr-0008-ref-as-prop`
- Re-run full acceptance gates

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert `@afenda/ui` governance commit; rebuild package | Quarterly-release-safe; git revert + gate re-run |
| ADR-0008 migration | Revert ref-as-prop batch commit; restore forwardRef signatures | ADR rollback procedure per ADR-0008 |

Oracle analog: confirm upgrade-safe — no consumer className policy changes without `fdr-018-ui-consumption` coordination. SAP analog: transport rollback = git revert + `ui:guard:scan` + `test:run`.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `ui-adr-0008-ref-as-prop` | forwardRef → ref-as-prop batch | ADR-0008 not Accepted; registry prohibited rule active | Architecture Authority | ADR-0008 Accepted |
| `ui-governance-observability-read-path` | Audit event on primitive resolve | Author resolver is synchronous read/render path | Architecture Authority | Phase 9 / observability FDR |
| `ui-fdr-archive-authority` | FDR status lags archive tip-004 Complete | Matrix cites 58 components + 68+ tests; FDR delivery starts at Research | Architecture Authority | **Closed** — Research Slice 1 reconciliation complete |

## §Knowledge transfer

### Operational runbook

- Resolver entry: `packages/ui/src/governance/primitive-governance.ts` — `resolvePrimitiveGovernance(input)`
- Public re-export: `packages/ui/src/governance/resolve-primitive-governance.ts`
- Registry authority: `packages/ui/src/governance/primitive-registry.ts` — `GOVERNED_PRIMITIVE_REGISTRY`
- className policy: `packages/ui/src/governance/class-name-guard.ts` — `guardClassName`
- Recipe resolution: `packages/ui/src/governance/recipe.ts`
- Coverage gate: `packages/ui/src/governance/recipe-coverage.ts`
- Policy doc: [`docs/governance/tip-004-policy.md`](../../governance/tip-004-policy.md)

### Observability

- Governance violations log via `enforceGovernance` in strict runtime (`dev-env.ts`)
- Consumer audit: deferred to `fdr-018-ui-consumption` + `fdr-013-audit-coverage`
- ui-guard scan: `pnpm ui:guard:scan` (Gate D sub-2s local check)

### On-call escalation

- Symptom: TIP-004B violation in dev → check component registered in `primitive-registry.ts`; run `primitive-governance.test.ts`
- Symptom: recipe missing for new primitive → run `recipe-coverage.test.ts`; update `recipe-maps.ts`
- Symptom: consumer className on primitive → fix in consumer (`fdr-018-ui-consumption`), not author layer
- Owner: `@afenda/ui` (PKG-018) via `ui-primitive-agent`

## §Enterprise benchmark qualification

This FDR is **Partially Implemented — enterprise 9.5 candidate blocked**, not final **Complete — enterprise 9.5 accepted**, because `@afenda/ui test:run` exits **1** (8 failures — Slice 2 debt) and ADR-0008 blocks forwardRef migration (Slice 3 deferred). Research Slice 1 **complete** (2026-06-25).

The **28/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. All PKG-018 tests exit 0 after Implementation Slice 2 closes gap `ui-test-run-debt`.
2. ADR-0008 forwardRef batch remains deferred with waiver `ui-adr-0008-ref-as-prop` (maintainability may cap at 4/5).
3. Read-path observability on primitive resolve remains waived (`ui-governance-observability-read-path`).
4. **Complete** status requires Architecture Authority peer review (DoD #14).

The **21/30 audit-adjusted** score is the honest benchmark after Research Slice 1: `typecheck` and `ui:guard:scan` exit 0; test coverage downgraded after gate re-run with documented root-cause taxonomy.

Research Slice 1 is complete. Status promotion to **Partially Implemented** is attested. Enterprise 9.5 qualification remains blocked until Slice 2 closes `ui-test-run-debt`.

## Verdict

**Partially Implemented — enterprise 9.5 structure at 21/30 audit-adjusted (28/30 ceiling).** Research Slice 1 complete (2026-06-25): `typecheck` and `ui:guard:scan` exit 0; `test:run` exit 1 (8 failures — Spinner `dataSlotByKey` drift + DropdownMenu a11y query). ADR-0008 blocks forwardRef migration (Slice 3 deferred). Slice 2 unblocked for governance closeout.
