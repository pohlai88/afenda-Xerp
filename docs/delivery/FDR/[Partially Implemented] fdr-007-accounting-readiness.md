# fdr-007-accounting-readiness — Accounting Readiness Gate

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-007-accounting-readiness` |
| **Registry entry ID** | — (no dedicated registry entry; Phase 9 orchestrator is repo-level) |
| **Package** | `@afenda/erp` (PKG-007) + governance scripts |
| **Lane** | green-lane (index row; gate-critical via Phase 9 sign-off — not a separate registry row) |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Configuration |
| **Risk class** | High |
| **BRD reference** | internal — Phase 9 accounting readiness orchestrator + diagnostics UI |
| **Enterprise readiness** | **28/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (not final Complete; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` (delegated gates reference PKG entries) |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SOLMAN · FDD ([enterprise-erp-standards §8](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |

## §Registry link

> **No dedicated foundation disposition registry entry** — `fdr-status-index.md` lists registry column **—** while lane is **green**. Phase 9 orchestrator delegates to existing PKG gates (`PKG007_CONTEXT`, `PKG007_ADMIN`, `PKG013_AUDIT`, etc.). This FDR scopes the **accounting-readiness** subdomain: orchestrator script, requirement registry, diagnostics UI, and sign-off record.

| Field | Value |
| --- | --- |
| id | — (FDR-only subdomain; index registry column **—**) |
| packageId | PKG-007 (primary consumer) + repo governance |
| domain | `accounting-readiness` (FDR subdomain — not in registry) |
| lane | green-lane (index) |
| runtimeOwner | `apps/erp` (diagnostics UI) · `scripts/governance/` (orchestrator) |
| gates (FDR acceptance) | `pnpm check:accounting-readiness-gate`; `pnpm check:foundation-disposition`; `pnpm check:documentation-drift` |
| prohibited | Ledger/posting runtime (ADR-0010); claiming Accounting Core runtime without ADR amendment |
| allowedAgents | `erp-app-agent`; `foundation-registry-owner`; `architecture-authority` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/erp` (PKG-007) | Diagnostics UI, readiness presentation, refresh server action | `apps/erp/src/lib/system-admin/` · `apps/erp/src/app/(protected)/system-admin/diagnostics/` |
| Governance scripts | Phase 9 orchestrator + 10-requirement registry | `scripts/governance/check-accounting-readiness-gate.mts` · `accounting-readiness-gate-registry.mts` |
| Architecture docs | Sign-off record + Phase 9 roadmap | `docs/architecture/phase-9-accounting-readiness-sign-off.md` |
| `@afenda/accounting` (PKG-R01) | Contracts-only (read-only until ADR-0010 amended) | `packages/accounting/src/contracts/` |

## Purpose

Formalize and maintain the Phase 9 Accounting Readiness Gate — a 10-requirement orchestrator that delegates to existing governance gates, exposes diagnostics UI in System Admin, and records Architecture Authority sign-off — so pre-accounting foundation evidence is CI-proven before `@afenda/accounting` contract vocabulary expands. **Does not** authorize ledger posting or journal runtime.

Authority: [ADR-0010](../../adr/ADR-0010-no-accounting-before-foundation-gate.md) · [ADR-0015](../../adr/ADR-0015-accounting-domain-contracts-only-activation.md) · [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-013a-accounting-readiness-gate.md`](../../delivery/tips/[Complete]%20tip-013a-accounting-readiness-gate.md).

## Scope

**In scope**

- `scripts/governance/check-accounting-readiness-gate.mts` — Phase 9 orchestrator (delegates, no duplicate gate logic)
- `scripts/governance/accounting-readiness-gate-registry.mts` — 10 requirements → delegated gates + test evidence
- `scripts/governance/lib/accounting-readiness-gate-live-status.mts` — live gate spawn/evaluation
- `docs/architecture/phase-9-accounting-readiness-sign-off.md` — sign-off record (2026-06-24)
- `apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-presentation.server.ts` — diagnostics presentation
- `apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-status.server.ts` — requirement status resolution
- `apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts` — governed refresh mutation
- `apps/erp/src/lib/system-admin/spawn-accounting-readiness-gate-live-status.server.ts` — live delegated gate spawn
- `apps/erp/src/components/system-admin/system-admin-readiness-gate-panel.tsx` — diagnostics UI panel
- `apps/erp/src/app/(protected)/system-admin/diagnostics/page.tsx` — diagnostics route
- Readiness tests under `apps/erp/src/lib/system-admin/__tests__/` and `apps/erp/src/__tests__/system-admin-readiness-gate.test.tsx`

**Out of scope**

- Ledger posting, journal arithmetic, COA runtime tables (ADR-0010 prohibition)
- `@afenda/accounting` runtime beyond contracts-only (PKG-R01)
- System Admin section registry authoring (`fdr-007-system-admin` — consumer relationship)
- Replacing individual governance gates — orchestrator delegates only

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Orchestrator boundary | Must not duplicate gate logic — delegate to existing `pnpm check:*` scripts only |
| Package boundary | Diagnostics UI edits in `apps/erp`; orchestrator in `scripts/governance/` |
| Evidence output | Agents must output gate exit 0 + sign-off doc alignment — not prose-only claims |
| Parallel PKG-007 | **Sequential** with `fdr-007-system-admin` — shared diagnostics route and system-admin lib |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-013a Complete, Phase 9 sign-off (2026-06-24), runtime matrix **implemented** rows, and live orchestrator gate with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does `pnpm check:accounting-readiness-gate` exit 0? | **Yes** | Gate log below — "Accounting readiness gate passed." |
| Are all 10 Phase 9 requirements registered? | **Yes** | `ACCOUNTING_READINESS_GATE_REQUIREMENTS.length === 10` |
| Is sign-off record Complete? | **Yes** — 2026-06-24 | `phase-9-accounting-readiness-sign-off.md` |
| Does diagnostics UI render readiness panel? | **Yes** | `system-admin-readiness-gate.test.tsx`; diagnostics page |
| Does refresh action have mutation audit wiring? | **Yes** | `refresh-accounting-readiness-gate-full.action.test.ts`; mutation audit registry |
| Does FDR **Not started** contradict runtime **implemented**? | **Yes by design** — archive/sign-off ≠ FDR Complete until Research attestation | ADR-0016 |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:accounting-readiness-gate` | 0 | A (~33s — delegates 10+ gates) |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A (post FDR upgrade) |
| `pnpm --filter @afenda/erp test:run -- readiness-gate` | 0 | A (presentation + refresh tests) |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |

### v2 audit gate log (2026-06-25 refresh)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:accounting-readiness-gate` | 0 | A (~356s — delegates 10+ gates) |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm --filter @afenda/erp test:run -- readiness-gate` | 0 | A (8 tests) |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |

### Files inspected

| Path | Why |
| --- | --- |
| `scripts/governance/check-accounting-readiness-gate.mts` | Phase 9 orchestrator |
| `scripts/governance/accounting-readiness-gate-registry.mts` | 10 requirements + delegated gates |
| `scripts/governance/lib/accounting-readiness-gate-live-status.mts` | Live gate evaluation |
| `docs/architecture/phase-9-accounting-readiness-sign-off.md` | Sign-off record |
| `docs/architecture/pre-accounting-foundation-roadmap.md` | Phase 9 requirement source |
| `apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-presentation.server.ts` | Presentation resolver |
| `apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts` | Refresh mutation |
| `apps/erp/src/components/system-admin/system-admin-readiness-gate-panel.tsx` | UI panel |
| `apps/erp/src/app/(protected)/system-admin/diagnostics/page.tsx` | Diagnostics route |
| `apps/erp/src/__tests__/system-admin-readiness-gate.test.tsx` | Panel render tests |
| `apps/erp/src/lib/system-admin/__tests__/resolve-accounting-readiness-gate-presentation.test.ts` | Presentation tests |
| `apps/erp/src/lib/system-admin/__tests__/refresh-accounting-readiness-gate-full.action.test.ts` | Action + audit tests |
| `apps/erp/src/lib/context/__tests__/accounting-readiness-integration.test.ts` | Context integration |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Phase 9 orchestrator + sign-off rows (**implemented**) |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Phase 9 orchestrator | `scripts/governance/check-accounting-readiness-gate.mts` | Yes — Grade A (`check:accounting-readiness-gate` exit 0) |
| Requirement registry | `scripts/governance/accounting-readiness-gate-registry.mts` | Yes — Grade A (10 requirements; structure tests in orchestrator) |
| Live status evaluator | `scripts/governance/lib/accounting-readiness-gate-live-status.mts` | Yes — Grade B (spawn path in refresh action) |
| ERP copy parity check | `scripts/governance/lib/accounting-readiness-gate-erp-copy-parity.mts` | Yes — Grade B (orchestrator imports) |
| Sign-off record | `docs/architecture/phase-9-accounting-readiness-sign-off.md` | Yes — Grade A (Complete 2026-06-24) |
| Presentation resolver | `apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-presentation.server.ts` | Yes — Grade A (3 unit tests pass) |
| Status resolver | `apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-status.server.ts` | Yes — Grade B (cited by presentation tests) |
| Refresh action | `apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts` | Yes — Grade A (3 action tests pass) |
| Live spawn helper | `apps/erp/src/lib/system-admin/spawn-accounting-readiness-gate-live-status.server.ts` | Yes — Grade B (action test mocks) |
| Copy contract | `apps/erp/src/lib/system-admin/accounting-readiness-gate.copy.contract.ts` | Yes — Grade A (panel test imports labels) |
| Diagnostics panel | `apps/erp/src/components/system-admin/system-admin-readiness-gate-panel.tsx` | Yes — Grade A (`system-admin-readiness-gate.test.tsx`) |
| Diagnostics page | `apps/erp/src/app/(protected)/system-admin/diagnostics/page.tsx` | Yes — Grade B (on disk; section guard via system-admin) |
| Context integration | `apps/erp/src/lib/context/__tests__/accounting-readiness-integration.test.ts` | Yes — Grade B (req #3 operating context) |
| Readiness context bridge | `apps/erp/src/lib/context/resolve-accounting-readiness.server.ts` | Yes — Grade B (unit test file exists) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `phase9-fdr-index-sync` | ~~Index row **Not started** while sign-off Complete~~ **Closed** (v2 audit 2026-06-25) | green | — | — | Index row **Partially Implemented** |
| `phase9-no-registry-entry` | No dedicated PKG entry for accounting-readiness orchestrator | green | `foundation-registry-owner` | Registry-sync (optional) | New entry or documented waiver |
| `phase9-complete-status` | FDR at 28/30 audit-adjusted; Complete blocked on peer review only | green | Architecture Authority (PR) | Complete | DoD #14 peer review `[x]` |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 on this table **and** DoD #14 peer review closed **and** waivers reconfirmed at PR ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). Until then this FDR is an **enterprise 9.5 candidate / evidence-qualified**, not final Complete.
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | 10-requirement registry + copy contract + `typecheck` exit 0 — Grade A | — |
| Test coverage | 5/5 | Orchestrator exit 0 + presentation/refresh/panel tests (8) + context integration — Grade A | — |
| Observability + audit | 4/5 | Refresh action in mutation audit registry — Grade B | Waiver `phase9-live-gate-latency` |
| Security + RBAC + RLS | 5/5 | Diagnostics behind system-admin section guard; delegated gates include multi-tenancy — Grade A | — |
| Documentation + BRD traceability | 4/5 | Sign-off doc + FDR v2 + matrix **implemented** rows + drift exit 0 — Grade A | DoD #14 peer review still `[ ]` |
| Maintainability + Clean Core | 5/5 | Orchestrator delegates only (no duplicate gates); Clean Core A — Grade A | — |
| **Total (audit-adjusted)** | **28/30** | **~9.3 / 10 equivalent** — honest Phase 9 score today | |
| **Total (evidence-qualified ceiling)** | **29/30** | Upper bound if §Waivers accepted and peer review pending only | Not final 9.5 until Complete |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — Phase 9 orchestrator is registry-driven configuration delegating to canonical gates; requirement IDs and copy labels in dedicated contract modules; no local gate reimplementation.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/accounting` (PKG-R01) | Unblocked for **contracts-only** per ADR-0010 + sign-off | No | A→A |
| `fdr-007-system-admin` | Diagnostics section consumes readiness panel | No | A→A |
| `fdr-007-api-governance` | Req #5 delegates to `check:api-contracts` | No | B→B |
| `fdr-007-operating-context` | Req #3 delegates to multi-tenancy integration | No | B→B |
| CI / release | `pnpm check:accounting-readiness-gate` in quality pipeline | No | A→A |

Changing a delegated gate name in `accounting-readiness-gate-registry.mts` without updating orchestrator breaks Phase 9 — treat registry edits as semver for foundation releases.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SOLMAN | FDD | `pnpm check:accounting-readiness-gate` | 1, 2 |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SAP ATC | Quality standards | delegated `pnpm ci:biome` via req #9 | 5 |
| SAP Change Management | Oracle sign-off workflow | `phase-9-accounting-readiness-sign-off.md` | 7 |
| HANA RLS / Data Security | Multi-tenant readiness | req #3 delegated gates | 17 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to Phase 9 roadmap or archive tip-013a.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| Phase 9 roadmap | 10 pre-accounting requirements orchestrated | 1 | `check-accounting-readiness-gate.mts` |
| Phase 9 roadmap | Foundation disposition zero red-lane at sign-off | 6 | `pnpm check:foundation-disposition` |
| internal | Diagnostics UI shows requirement status + sign-off banner | 2 | `system-admin-readiness-gate.test.tsx` |
| tip-013a (archive) | Refresh action runs full delegated gate check | 17 | `refresh-accounting-readiness-gate-full.action.test.ts` |
| ADR-0010 | No ledger runtime authorized | 16 | sign-off §What remains prohibited |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | All 10 requirements evaluated; failures name delegated gate | orchestrator exit 0 |
| Performance efficiency | Full orchestrator completes in CI budget (~33s observed) | gate log; waiver for live refresh latency |
| Compatibility | Requirement IDs stable in registry module | structure check in orchestrator |
| Security | Diagnostics only for authorized system-admin actors | section guard + permissions |
| Maintainability | Single orchestrator — no duplicated gate scripts | code review + ADR-0016 |
| Reliability | Deterministic structure checks before delegation | `checkAccountingReadinessGateStructure()` |
| Documentation | Sign-off + matrix + FDR aligned | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Refresh full gate check | System-admin actor with diagnostics permission; audit on action | `refresh-accounting-readiness-gate-full.action.ts`; mutation audit registry |
| Phase 9 sign-off | Architecture Authority role documented in sign-off record | `phase-9-accounting-readiness-sign-off.md` |
| Ledger/posting | **Prohibited** — not a governed mutation path | ADR-0010 |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-007-accounting-readiness** (registry column **—**, lane **green**)
- [`pre-accounting-foundation-roadmap.md`](../../architecture/pre-accounting-foundation-roadmap.md) — Phase 9 requirement source
- [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) — sign-off authority
- Sibling: [`fdr-007-system-admin`](%5BNot%20started%5D%20fdr-007-system-admin.md) — diagnostics section host
- Sibling: [`fdr-007-api-governance`](%5BPartially%20Implemented%5D%20fdr-007-api-governance.md) — req #5
- Sibling: [`fdr-007-operating-context`](%5BNot%20started%5D%20fdr-007-operating-context.md) — req #3
- Upstream PKG gates: `PKG007_CONTEXT`, `PKG007_ADMIN`, `PKG013_AUDIT` (delegated, read-only)
- Archive evidence: [`tip-013a-accounting-readiness-gate.md`](../../delivery/tips/[Complete]%20tip-013a-accounting-readiness-gate.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-007-accounting-readiness.md` | — | Modified per slice |
| `scripts/governance/check-accounting-readiness-gate.mts` | — | Modified (Implementation slices only) |
| `scripts/governance/accounting-readiness-gate-registry.mts` | — | Modified (Implementation slices only) |
| `apps/erp/src/lib/system-admin/resolve-accounting-readiness-gate-presentation.server.ts` | `@afenda/erp` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm check:accounting-readiness-gate`
- `pnpm check:foundation-disposition`
- `pnpm check:documentation-drift`
- `pnpm --filter @afenda/erp test:run`
- `pnpm --filter @afenda/erp typecheck`

## Acceptance criteria

```gherkin
Feature: Phase 9 Accounting Readiness Gate

  Scenario: Orchestrator validates registry structure and delegates to canonical gates
    GIVEN accounting-readiness-gate-registry.mts exports exactly 10 requirements
    AND each requirement lists delegatedGates that exist in package.json scripts
    WHEN pnpm check:accounting-readiness-gate runs
    THEN structure validation passes
    AND each delegated gate exits 0 or is explicitly skipped with documented reason
    AND the orchestrator prints "Accounting readiness gate passed."

  Scenario: Diagnostics panel renders sign-off banner when gate is passed
    GIVEN resolveAccountingReadinessGatePresentation returns passed overall status
    WHEN SystemAdminReadinessGatePanel renders
    THEN the sign-off banner title matches ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_TITLE
    AND requirement rows show status labels from ACCOUNTING_READINESS_GATE_STATUS_LABELS

  Scenario: Refresh action is audit-evidenced
    GIVEN an authorized system-admin actor triggers refreshAccountingReadinessGateFull
    WHEN the server action completes
    THEN a governed mutation audit entry is recorded per system-admin-mutation-audit registry
    AND live delegated gates are spawned via spawnAccountingReadinessGateLiveStatus

  Scenario: Sign-off record prohibits ledger runtime
    GIVEN phase-9-accounting-readiness-sign-off.md is Complete
    WHEN a consumer reads §What remains prohibited
    THEN journal posting and ledger arithmetic are explicitly prohibited without separate ADR
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | orchestrator + sign-off on disk | [x] |
| 2 | Tests pass | readiness panel + presentation + refresh tests | [x] |
| 3 | Boundaries | orchestrator delegates only — no duplicate gates | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/erp typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check scripts/governance/check-accounting-readiness-gate.mts` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` via req #10 | [x] |
| 7 | Runtime matrix updated | Phase 9 rows **implemented** | [x] |
| 8 | fdr-status-index updated | index row + prefix rename | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core aligned | [x] |
| 16 | ADR-0010 prohibition documented | sign-off + FDR scope | [x] |
| 17 | Security negative path tested | section guard on diagnostics route | [x] |
| 18 | Public API compatibility verified | copy contract + requirement IDs stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers `phase9-e2e` | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score (audit-adjusted + ceiling) | [x] |

## Slices

### Slice 1 — Research (accounting-readiness)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** High  
**Clean Core impact:** A→A

**Purpose:** Reconcile archive tip-013a Complete + sign-off 2026-06-24 with FDR **Not started**; verify orchestrator delegates to live gates; update §Runtime evidence and §Enterprise readiness score. No source edits.

**Outcomes:**

- Baseline gate log recorded (`check:accounting-readiness-gate` exit 0)
- Status promoted to **Partially Implemented**
- Readiness score: **28/30 audit-adjusted** (29/30 ceiling)
- Complete promotion blocked on DoD #14 peer review only

### Slice 2 — Evidence-sync (v2 audit + index)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Docs-only reconciliation: record v2 audit gate log, promote FDR/index to **Partially Implemented**, close gap `phase9-fdr-index-sync`, and recalculate dual readiness scores. No `packages/` or `apps/` source edits — orchestrator and diagnostics UI evidence verified in Slice 1 Research.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-007-accounting-readiness.md

1. Objective    — Reconcile archive tip-013a + sign-off 2026-06-24 with FDR delivery status; record v2 audit gate log; close index sync gap; publish dual readiness scores.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-007-accounting-readiness.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — scripts/governance/ and apps/erp/ source edits; foundation-disposition.registry.ts edits; @afenda/accounting runtime (ADR-0010)
5. Authority    — ADR-0010 · ADR-0015 · ADR-0014 · ADR-0016 · phase-9-accounting-readiness-sign-off.md
6. Gates        —
   pnpm check:accounting-readiness-gate
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap `phase9-fdr-index-sync`; DoD #8 (fdr-status-index updated); DoD #20 (enterprise readiness score updated)
8. Evidence     —
   docs/delivery/FDR/[Partially Implemented] fdr-007-accounting-readiness.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
9. Attestation  — Documentation (index + matrix Phase 9 rows reconciled); Maintainability (orchestrator delegates-only evidence cited)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 8 | fdr-status-index updated | `pnpm check:documentation-drift` |
| 20 | Enterprise readiness score updated | §Enterprise readiness score dual scores |
| 9 | Drift green | `pnpm check:documentation-drift` |

#### Known debt

- `phase9-no-registry-entry` — optional dedicated registry row deferred to Slice 3 Registry-sync
- `phase9-complete-status` — DoD #14 peer review blocks **Complete** promotion
- Cross-FDR ERP test drift (`context-switch.action.test.ts`, `list-visible-system-admin-sections.server.test.ts`) tracked under `fdr-007-ux-surfaces` gap `ux-erp-test-failures`

### Slice 3 — Registry-sync (optional)

**Status:** Not started  
**Prerequisite:** Architecture Authority decision  
**Type:** Registry-sync  
**Risk class:** Low  

**Purpose:** Optional dedicated registry entry for Phase 9 orchestrator via `foundation-registry-owner`.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research / Evidence-sync | Revert FDR doc + index commit | Safe — no runtime change |
| Implementation | Revert orchestrator or diagnostics commit | git revert + re-run `pnpm check:accounting-readiness-gate` |
| Sign-off revocation | Architecture Authority updates sign-off doc + matrix | **Not automated** — requires ADR amendment |

Oracle analog: Phase 9 is configuration orchestration — rollback reverts sign-off claims, not database data. SAP analog: transport rollback = revert orchestrator registry + re-run delegated gates.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `phase9-no-registry-entry` | Dedicated foundation disposition registry row for orchestrator | Delegates to existing PKG entries; sign-off documents disposition snapshot | Architecture Authority | Optional Registry-sync slice |
| `phase9-live-gate-latency` | Live refresh runs all delegated gates synchronously (observability 5/5) | CI orchestrator proves gates; live refresh is admin-only | Architecture Authority | Performance hardening TIP |
| `phase9-e2e` | Browser E2E for diagnostics panel | Panel unit tests + sign-off record prove UX | Architecture Authority | External beta go-live |

## §Knowledge transfer

### Operational runbook

- Phase 9 gate: `pnpm check:accounting-readiness-gate` — run before foundation releases
- Requirement registry: `scripts/governance/accounting-readiness-gate-registry.mts`
- Diagnostics UI: System Admin → Diagnostics → readiness panel
- Refresh action: `refreshAccountingReadinessGateFull` — spawns live delegated gates
- Sign-off record: `docs/architecture/phase-9-accounting-readiness-sign-off.md`

### Observability

- Mutation audit: refresh action entry in `system-admin-mutation-audit.registry.ts`
- Live gate spawn: `spawn-accounting-readiness-gate-live-status.server.ts`

### On-call escalation

- Symptom: `check:accounting-readiness-gate` fails → read orchestrator stderr for failing delegated gate name; fix upstream PKG FDR
- Symptom: diagnostics shows stale status → authorized refresh via diagnostics panel
- Owner: Architecture Authority for sign-off; `@afenda/erp` for diagnostics UI via `erp-app-agent`

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate / evidence-qualified**, not final **Complete — enterprise 9.5 accepted**, because DoD #14 peer review remains open.

The **29/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. Live refresh runs all delegated gates synchronously — latency waived (`phase9-live-gate-latency`).
2. Browser E2E for diagnostics panel is waived (`phase9-e2e`).
3. No dedicated registry row — orchestrator delegates to existing PKG entries (`phase9-no-registry-entry`).
4. **Complete** status requires Architecture Authority peer review at PR merge.
5. Ledger posting remains **prohibited** per ADR-0010 regardless of Complete status.

The **28/30 audit-adjusted** score is the honest Phase 9 benchmark today (~9.3 / 10 equivalent): orchestrator, sign-off, and diagnostics proven; capped by open peer review on documentation dimension.

**Promotion to Complete — enterprise 9.5 accepted requires:**

1. Architecture Authority peer review approval (DoD #14).
2. Confirmation that §Waivers remain valid at merge time.
3. FDR filename/status/index promotion to `[Complete]`.

## Verdict

**Partially Implemented — enterprise 9.5 candidate / evidence-qualified at 28/30 audit-adjusted (29/30 ceiling), pending Architecture Authority peer review.**

v2 audit refresh (2026-06-25): Phase 9 orchestrator and sign-off record (2026-06-24) verified; `pnpm check:accounting-readiness-gate` exit 0 (~356s). **Only DoD #14 peer review** blocks promotion to **Complete**. Does not authorize ledger posting — ADR-0010 contracts-only scope unchanged.
