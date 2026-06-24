# fdr-018-ui-consumption — UI Consumption (TIP-004)

| Field | Value |
| --- | --- |
| **Status** | Not started |
| **FDR ID** | `fdr-018-ui-consumption` |
| **Registry entry ID** | `PKG018_UI` |
| **Package** | `@afenda/ui` (PKG-018) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Configuration |
| **Risk class** | Low |
| **BRD reference** | internal — TIP-004 consumer rules |
| **Enterprise readiness** | **24/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate blocked** (FDR Research pending; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SAP Fiori UX · Oracle Fusion UX · TIP-004 policy |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `governed-primitives`; this FDR scopes the **ui-consumption** subdomain (TIP-004 consumer layer) on the same `PKG018_UI` entry at **green-lane**.

| Field | Value |
| --- | --- |
| id | `PKG018_UI` |
| packageId | PKG-018 |
| domain | `governed-primitives` (FDR subdomain: `ui-consumption`) |
| lane | green-lane (FDR scope — consumption enforcement; registry entry amber for primitive authoring) |
| runtimeOwner | `packages/ui` (author) + consumer paths: `packages/appshell/`, `packages/metadata-ui/`, `apps/erp/` |
| gates | `pnpm ui:guard:scan`; `pnpm --filter @afenda/appshell check:governance`; `pnpm --filter @afenda/erp test:run` (Gate C subset) |
| prohibited | `do-not-add-classname-on-afenda-ui-primitives` (consumers); `do-not-create-stock-props-wrappers` |
| allowedAgents | `ui-primitive-agent`; `appshell-agent`; `erp-app-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/ui` (PKG-018) | Author layer — primitives only (read-only in this FDR) | `packages/ui/src/components/` |
| `@afenda/appshell` (PKG-001) | Primary TIP-004 consumer | `packages/appshell/src/` |
| `@afenda/metadata-ui` | Metadata renderer consumer | `packages/metadata-ui/src/` |
| `apps/erp` (PKG-007) | ERP consumer + Gate F | `apps/erp/src/` |
| Governance scripts | ui-guard enforcement | `scripts/governance/ui-guard.mjs`, `governed-ui-consumption.mjs` |

## Purpose

Lock and maintain TIP-004 **consumer-layer** rules — zero `className` on `@afenda/ui` primitives in appshell, metadata-ui, and erp; governed props via `@afenda/ui/governance`; shell chrome on plain HTML only — enforced by `pnpm ui:guard` Gates B–F and in-process policy scans.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Canonical policy: [`docs/governance/tip-004-policy.md`](../../governance/tip-004-policy.md).

Archive input (not implementation authority): [`tip-004-ui-consumption.md`](../../delivery/tips/[Complete]%20tip-004-ui-consumption.md).

Sibling FDR: [`fdr-018-governed-primitives`](%5BNot%20started%5D%20fdr-018-governed-primitives.md) — author layer (amber-lane).

## Scope

**In scope**

- `scripts/governance/ui-guard.mjs` — Gates A–G bundle (consumer focus: B–F)
- `scripts/governance/governed-ui-consumption.mjs` — in-process className/governance policy
- `scripts/governance/react-erp-policy.mjs` — Gate F ERP quality
- Consumer static tests: `packages/appshell/src/__tests__/governed-ui-consumption.test.ts`
- Policy docs: `docs/governance/tip-004-policy.md`, `docs/governance/ui-guard.md`
- AGENTS.md Governed UI section + `.cursor/rules/governed-ui-consumption.mdc`

**Out of scope**

- Primitive authoring / `resolvePrimitiveGovernance()` (`fdr-018-governed-primitives`)
- Design system token authority (`fdr-004-design-authority`)
- shadcn-studio block merge workflow (covered by policy, not this FDR's runtimeOwner)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `PKG018_UI` |
| Package boundary | Consumption fixes in consumer packages only — not `@afenda/ui/components/` unless author FDR |
| Shared constants | Policy source is `governed-ui-consumption.mjs` — no duplicate policy in tests |
| Evidence output | `pnpm ui:guard:scan` exit 0 required — not prose-only claims |
| Parallel PKG-018 | **Sequential** with `fdr-018-governed-primitives` — same registry entry; orchestrator serializes |
| Implementation blocked until | Research Slice 1 reconciles archive tip-004 Complete vs FDR Not started |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 = Research only — no consumer source edits unless slice authorizes.  
> Runtime matrix marks **UI Consumption (TIP-004) implemented** — reconcile with FDR **Not started**.

### Discovery questions

| Question | Expected output |
| --- | --- |
| Do ui-guard Gates B–F exit 0 today? | Baseline gate log |
| Are all consumer TSX files scanned by Gate D? | Scan scope table |
| Does archive tip-004 match current script paths? | Drift reconciliation |
| Any className violations in appshell/erp/metadata-ui? | Violation count (expect 0) |

### Files to inspect

| Path | Why |
| --- | --- |
| `scripts/governance/ui-guard.mjs` | Gate orchestration |
| `scripts/governance/governed-ui-consumption.mjs` | Policy single source |
| `packages/appshell/src/__tests__/governed-ui-consumption.test.ts` | In-process mirror test |
| `docs/governance/tip-004-policy.md` | Canonical policy |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | UI Consumption row |
| Archive [`tip-004-ui-consumption.md`](../../delivery/tips/[Complete]%20tip-004-ui-consumption.md) | Historical evidence |

### Skills to read

- `govern-primitive` — consumer checklist (8 items)
- `enterprise-erp-standards` — Fiori/Fusion UX mapping

### Matrix reconciliation (manifest-nav v2 audit — 2026-06-25)

| Matrix row | Matrix status | FDR status | Reconciliation |
| --- | --- | --- | --- |
| UI Consumption (TIP-004) | **implemented** | Not started | `ui:guard:scan` exit 0 (243 files); FDR delivery attestation pending — matrix status unchanged |

### Baseline gate log (manifest-nav v2 audit — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm ui:guard:scan` | 0 | A (243 files clean) |
| `pnpm --filter @afenda/appshell check:governance` | 0 | A (56 tests) |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| ui-guard bundle | `scripts/governance/ui-guard.mjs` | Yes — Grade B (matrix **implemented**) |
| Consumption policy | `scripts/governance/governed-ui-consumption.mjs` | Yes — Grade B (shared with tests) |
| TIP-004 policy | `docs/governance/tip-004-policy.md` | Yes — Grade A (canonical active doc) |
| Appshell consumption test | `packages/appshell/src/__tests__/governed-ui-consumption.test.ts` | Yes — Grade B (static scan mirror) |
| ERP react policy | `scripts/governance/react-erp-policy.mjs` | Yes — Grade B (Gate F) |
| Fast scan gate | `pnpm ui:guard:scan` | Yes — Grade A (exit 0; 243 files — manifest-nav v2 audit 2026-06-25) |
| Archive tip-004 | `docs/delivery/tips/[Complete] tip-004-ui-consumption.md` | Yes — Grade B (archive only) |

## §Remaining gaps

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `fdr-research-slice-1` | FDR Not started — archive Complete not reconciled | green | fdr-slice-implementer | Slice 1 | Baseline gate log + status promotion |
| `ui-consumption-gate-log` | Full `pnpm ui:guard` bundle log not in FDR | green | Research Slice 1 | Slice 1 | §Research baseline table includes full bundle |
| `ui-consumption-fdr-primitives-seq` | Sequential coordination with fdr-018-governed-primitives | amber | fdr-orchestrator | Ongoing | No parallel PKG-018 edits |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 **and** DoD #14 peer review **and** FDR status promotion from Research.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | Policy module + tip-004-policy.md + `ui:guard:scan` exit 0 — Grade A | — |
| Test coverage | 5/5 | governed-ui-consumption.test.ts (56) + ui:guard Gate D — Grade A | Full `pnpm ui:guard` bundle pending |
| Observability + audit | 3/5 | Gate failure output + fix hints — Grade C | No runtime audit on static scan |
| Security + RBAC + RLS | 4/5 | Consumer className ban — Grade B | N/A for RBAC |
| Documentation + BRD traceability | 4/5 | tip-004-policy + AGENTS.md + FDR — Grade A | DoD #14 open |
| Maintainability + Clean Core | 3/5 | Clean Core A consumer rules — Grade B | Ongoing enforcement as blocks land |
| **Total (audit-adjusted)** | **24/30** | **~8.0 / 10** — green-lane honest score | |
| **Total (evidence-qualified ceiling)** | **29/30** | After full ui:guard bundle + peer review | Not final 9.5 |

## §Clean Core classification

**This FDR: Level A** — consumers compose via governed props only; no parallel design vocabulary; policy enforced at CI boundary.

**Rule: green-lane consumption FDR must remain Clean Core A.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/appshell` | `@afenda/ui`, `@afenda/ui/governance` | No | A→A |
| `@afenda/metadata-ui` | `@afenda/ui` primitives | No | A→A |
| `apps/erp` | `@afenda/ui` + Gate F rules | No | A→A |
| New shadcn blocks | Must strip className before merge | Yes if policy violated | A→D if violated |

Consumer scan: any new `.tsx` in appshell/metadata-ui/erp importing `@afenda/ui` triggers Gate D scan on PR.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| Fiori UX | Fusion UX | `pnpm ui:guard:scan` | 1 |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SAP namespace | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm --filter @afenda/appshell check:governance` | 4 |

## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Zero className on @afenda/ui in consumers | 17 | `pnpm ui:guard:scan` |
| internal | @afenda/ui/governance import when @afenda/ui used | 16 | governed-ui-consumption.test.ts |
| tip-004 (archive) | ui-guard Gates B–F enforcement | 1 | `pnpm ui:guard` |
| tip-004-policy | Two-layer author vs consumer distinction | 15 | tip-004-policy.md |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Consumers render governed UI without className overrides | Gate D scan |
| Performance efficiency | `ui:guard:scan` completes in under 2s locally | Gate D `--scan-only` |
| Compatibility | Policy applies to appshell, metadata-ui, erp consistently | ui-guard scope |
| Security | No arbitrary class injection on governed primitives | governed-ui-consumption.mjs |
| Maintainability | Single policy module shared by script + test | import parity test |
| Usability | Fix hints on violation (`--fix-hint`) | ui-guard CLI |
| Documentation | tip-004-policy canonical; AGENTS.md aligned | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| UI consumption policy change | Architecture Authority + Design Authority review | PR approval DoD #14 |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-018-ui-consumption**
- Registry: `PKG018_UI` read-only snapshot in §Registry link
- Sibling: [`fdr-018-governed-primitives`](%5BNot%20started%5D%20fdr-018-governed-primitives.md) — sequential, same registry entry
- Canonical policy: [`tip-004-policy.md`](../../governance/tip-004-policy.md)
- Archive: [`tip-004-ui-consumption.md`](../../delivery/tips/[Complete]%20tip-004-ui-consumption.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-018-ui-consumption.md` | — | Modified per slice |
| `scripts/governance/ui-guard.mjs` | — | Modified (Implementation slices only) |
| `scripts/governance/governed-ui-consumption.mjs` | — | Modified (Implementation slices only) |
| Consumer `__tests__/governed-ui-consumption.test.ts` | appshell | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm ui:guard:scan`
- `pnpm ui:guard` (full bundle before Complete)
- `pnpm --filter @afenda/appshell check:governance`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: TIP-004 governed UI consumption

  Scenario: Consumer TSX files pass in-process className policy scan
    GIVEN a consumer package file under packages/appshell, packages/metadata-ui, or apps/erp
    AND the file imports a component from @afenda/ui
    WHEN Gate D scan runs via pnpm ui:guard:scan
    THEN no className prop is present on @afenda/ui primitive JSX elements
    AND @afenda/ui/governance is imported when @afenda/ui is used

  Scenario: Appshell governance gate passes
    GIVEN the @afenda/appshell consumer layer
    WHEN pnpm --filter @afenda/appshell check:governance runs
    THEN exit code is 0
    AND governed-ui-consumption.test.ts passes

  Scenario: New shadcn block merge strips consumer className violations
    GIVEN a shadcn-studio block merged into appshell or erp
    WHEN ui-guard runs before PR merge
    THEN Gate D reports zero violations
    OR the PR is blocked until className is removed from governed components
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | ui-guard + policy paths | [ ] |
| 2 | Tests pass | governed-ui-consumption.test.ts + ui-guard | [ ] |
| 3 | Boundaries | `pnpm quality:boundaries` | [ ] |
| 4 | TypeScript strict | consumer packages typecheck | [ ] |
| 5 | Biome clean | governance scripts + consumers | [ ] |
| 6 | Registry aligned | PKG018_UI + green-lane FDR scope | [ ] |
| 7 | Runtime matrix updated | UI Consumption row | [ ] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [ ] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR complete | [x] |
| 12 | Impact analysis complete | §Impact analysis filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | Architecture Authority PR approval | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core | [x] |
| 16 | No duplicated policy / parallel authority | single governed-ui-consumption.mjs | [ ] |
| 17 | Security negative path tested | className violation detected in test | [ ] |
| 18 | Public API compatibility verified | consumer import pattern stable | [ ] |
| 19 | E2E requirement satisfied or waived | static scan sufficient — §Waivers | [ ] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | [x] |

## Slices

### Slice 1 — Research (ui-consumption baseline)

**Status:** Not started  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Reconcile archive tip-004 **Complete** + runtime matrix **implemented** UI Consumption row with FDR **Not started** status. Capture ui-guard baseline gate log (scan + full bundle read-only), document Gate D scan scope (243 files), confirm zero className violations in consumer paths, and produce initial §Enterprise readiness score — **no governance script or consumer source edits**.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Not started] fdr-018-ui-consumption.md

1. Objective    — Reconcile tip-004 archive + runtime matrix with FDR status; capture ui-guard baseline gate log and Gate D scan scope; produce readiness score for Slice 2 unblock.
2. Allowed layer— docs-only (`docs/delivery/FDR/`, `docs/delivery/fdr-status-index.md`, `docs/architecture/afenda-runtime-truth-matrix.md`)
3. Files        —
   docs/delivery/FDR/[Not started] fdr-018-ui-consumption.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — `packages/` source edits; `apps/` source edits; `scripts/` source edits; `foundation-disposition.registry.ts`; `do-not-add-classname-on-afenda-ui-primitives`; `do-not-create-stock-props-wrappers`
5. Authority    — ADR-0014 · ADR-0016 · PKG018_UI registry snapshot (§Registry link) · [`tip-004-policy.md`](../../governance/tip-004-policy.md)
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
   pnpm quality:boundaries
   pnpm ui:guard:scan (read-only baseline — report exit code and file count)
   pnpm ui:guard (read-only baseline — report exit code per gate letter A–G)
   pnpm --filter @afenda/appshell check:governance (read-only baseline — report exit code)
7. Closes       — Gap `fdr-research-slice-1`; Gap `ui-consumption-gate-log`; DoD #1, #7, #8, #20 (initial score)
8. Evidence     —
   scripts/governance/ui-guard.mjs
   scripts/governance/governed-ui-consumption.mjs
   scripts/governance/react-erp-policy.mjs
   packages/appshell/src/__tests__/governed-ui-consumption.test.ts
   docs/governance/tip-004-policy.md
   docs/governance/ui-guard.md
9. Attestation  — Documentation (FDR gate log Grade A); Security discovery (Gate D zero violations Grade A); Test coverage baseline (appshell governance 56 tests Grade A)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | ui-guard + policy paths |
| 7 | Runtime matrix updated | UI Consumption row |
| 8 | fdr-status-index updated | index row |
| 20 | Enterprise readiness score updated | §Enterprise readiness score initial (24/30 audit-adjusted) |

#### Known debt

- `ui-consumption-fdr-primitives-seq` — sequential with `fdr-018-governed-primitives` on `PKG018_UI`
- Full `pnpm ui:guard` bundle log required before Complete — scan-only verified 2026-06-25
- Gate F warning mode waiver `ui-consumption-gate-f-warning` — ERP `--strict` deferred
- Browser E2E waived (`ui-consumption-e2e-dod19`) until external beta go-live

### Slice 2 — Implementation (consumption enforcement closeout)

**Status:** Not started  
**Prerequisite:** Slice 1 Complete  
**Type:** Implementation  
**Risk class:** Low  

**Purpose:** Close any consumer violations or policy drift found in Research; achieve green-lane maintain target.

### Slice 3 — Evidence-sync (enterprise score)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Evidence-sync  

**Purpose:** Recalculate §Enterprise readiness score; sync matrix + index if status promotes.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe |
| Implementation | Revert governance script or consumer fix commit | Git revert + `pnpm ui:guard:scan` |
| Policy tightening | Revert policy module; restore prior gate behaviour | Architecture Authority approval required |

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `ui-consumption-e2e-dod19` | Browser E2E for className scan | Static Gate D + unit mirror sufficient | Architecture Authority | External beta go-live |
| `ui-consumption-gate-f-warning` | Gate F hard failure | Default warning mode unless `--strict` | Architecture Authority | ERP quality batch |

## §Knowledge transfer

### Operational runbook

- Fast local check: `pnpm ui:guard:scan` (Gate D only, sub-2s)
- Full bundle: `pnpm ui:guard` before merge
- Fix hints: `pnpm ui:guard:fix-hint` or `--fix-hint` flag
- Policy source: `scripts/governance/governed-ui-consumption.mjs`
- Consumer rule: zero `className` on `@afenda/ui` — shell chrome on plain HTML wrappers

### Observability

- CI failure: ui-guard exit 1 — read gate letter in stdout (A–G)
- Pre-commit: Cursor hook runs governed-ui scan on consumer paths

### On-call escalation

- Symptom: ui-guard fails after shadcn merge → strip className from governed components; run `--fix-hint`
- Symptom: false positive on layout wrapper → verify plain HTML vs @afenda/ui primitive
- Owner: Design Authority + appshell-agent for consumer fixes

## §Enterprise benchmark qualification

This FDR is **Not started — enterprise 9.5 candidate blocked**, not final **Complete — enterprise 9.5 accepted**, because FDR Research Slice 1 has not formally reconciled archive tip-004 **Complete** with FDR delivery status.

The **29/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. Browser E2E waived until external beta go-live (`ui-consumption-e2e-dod19`).
2. Gate F remains warning mode unless `--strict` (`ui-consumption-gate-f-warning`).
3. Full `pnpm ui:guard` bundle exit 0 recorded at Research closeout (scan-only verified **2026-06-25**).
4. **Complete** status requires Architecture Authority peer review (DoD #14).

The **24/30 audit-adjusted** score reflects strong consumption enforcement evidence: `ui:guard:scan` exit 0 (243 files), appshell governance test exit 0 — capped by open FDR Research attestation and DoD #14.

Until Research Slice 1 closes, this FDR must not be represented as **Partially Implemented** despite matrix **implemented** status.

## Verdict

**Not started — enterprise 9.5 FDR at 24/30 audit-adjusted (29/30 ceiling), pending Research Slice 1.**

Manifest-nav v2 audit (2026-06-25): `ui:guard:scan` exit 0; appshell `check:governance` exit 0. Runtime matrix and archive tip-004 mark UI Consumption **implemented**, but FDR delivery has not reconciled that evidence. Green-lane scope: maintain enforcement as new blocks land. Sequential with `fdr-018-governed-primitives` on `PKG018_UI`.
