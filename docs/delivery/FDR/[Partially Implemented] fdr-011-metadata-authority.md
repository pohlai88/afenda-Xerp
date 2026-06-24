# fdr-011-metadata-authority — Metadata Authority

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-011-metadata-authority` |
| **Registry entry ID** | `PKG011_METADATA` |
| **Package** | `@afenda/metadata` (PKG-011) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Configuration |
| **Risk class** | Low |
| **BRD reference** | internal — metadata architecture contracts (no renderers) |
| **Enterprise readiness** | **27/30 audit-adjusted** · **27/30 evidence-qualified ceiling** — **Complete (authority only) candidate** (DoD #14 peer review open) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SOLMAN · Oracle FDD |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Do not invent fields here.

| Field | Value |
| --- | --- |
| id | `PKG011_METADATA` |
| packageId | PKG-011 |
| domain | `metadata-authority` |
| lane | green-lane |
| runtimeOwner | `packages/metadata` |
| gates | `pnpm --filter @afenda/metadata typecheck`; `pnpm --filter @afenda/metadata test:run` |
| prohibited | `do-not-add-react-or-ui`; `do-not-add-renderers`; `do-not-import-metadata-ui`; `do-not-create-accounting-package` |
| allowedAgents | `metadata-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/metadata` (PKG-011) | Metadata contracts, registries, cross-package authority map — **no renderers** | `packages/metadata/src/` |
| `@afenda/metadata-ui` (PKG-012) | Renderer implementation — consumes metadata contracts only (read-only in Research) | `packages/metadata-ui/src/` |
| `apps/erp` (PKG-007) | ERP metadata workspace wiring — consumes `@afenda/metadata-ui/server` (read-only) | `apps/erp/src/lib/metadata/` |

## Purpose

Lock and maintain the **metadata authority** boundary: governed contracts for surfaces, sections, layouts, actions, presentation, and runtime shapes — with **zero React/UI implementation** in `@afenda/metadata` by design. Renderers live in `@afenda/metadata-ui` (`fdr-012-metadata-renderers`).

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-005-metadata-authority.md`](../../delivery/tips/[Complete%20(authority%20only)]%20tip-005-metadata-authority.md).

## Scope

**In scope**

- `packages/metadata/src/metadata.contract.ts` — root metadata contract
- `packages/metadata/src/surface.contract.ts`, `section.contract.ts`, `layout.contract.ts`, `action.contract.ts`, `presentation.contract.ts`, `runtime.contract.ts`
- `packages/metadata/src/governance/cross-package-authority.contract.ts` — package boundary map
- `packages/metadata/src/governance/metadata-authority-map.contract.ts` — ownership prohibitions
- `packages/metadata/src/renderer.contract.ts` — **contract only** (renderer types, not implementations)
- Leakage guard: `packages/metadata/src/__tests__/no-implementation-leakage.test.ts`
- Validation tests: 22 suites under `packages/metadata/src/__tests__/`

**Out of scope**

- React renderers (`fdr-012-metadata-renderers`)
- ERP page wiring (`apps/erp` — consumer only)
- Design tokens (`fdr-004-design-authority`)
- Accounting runtime (ADR-0010)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `packages/metadata/` paths |
| Shared constants | Metadata contract arrays owned in PKG-011 — no duplication in metadata-ui or ERP |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-011 / PKG-012 | **Sequential** when changing shared contract shapes — metadata authority first, then metadata-ui |
| Implementation blocked until | Research Slice 1 complete; registry entry `PKG011_METADATA` exists |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-005 + runtime matrix **implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does `no-implementation-leakage.test.ts` pass? | **Yes** | `test:run` exit 0 — 22 files, 153 tests |
| Are all 22 test suites green? | **Yes** | `pnpm --filter @afenda/metadata test:run` exit 0 |
| Does cross-package authority align with registry? | **Yes** | `cross-package-authority.test.ts` 12 tests pass |
| Breaking-change policy on semver? | **Yes** — `metadata.version.ts` v0.2.0 guarded | `metadata-version.test.ts` |
| Registry fields required? | **Yes** — `PKG011_METADATA` pending | No PKG-011 row in disposition registry |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/metadata typecheck` | 0 | A |
| `pnpm --filter @afenda/metadata test:run` | 0 | A (153 tests) |
| `pnpm exec biome check packages/metadata` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Root contract | `packages/metadata/src/metadata.contract.ts` | Yes — Grade A (`metadata.contract.test.ts`) |
| Surface contract | `packages/metadata/src/surface.contract.ts` | Yes — Grade A (`surface.contract.test.ts` 8 tests) |
| Section contract | `packages/metadata/src/section.contract.ts` | Yes — Grade A (`section.contract.test.ts`) |
| Action contract | `packages/metadata/src/action.contract.ts` | Yes — Grade A (`action.contract.test.ts` 14 tests) |
| Cross-package authority | `packages/metadata/src/governance/cross-package-authority.contract.ts` | Yes — Grade A (`cross-package-authority.test.ts` 12 tests) |
| Authority map | `packages/metadata/src/governance/metadata-authority-map.contract.ts` | Yes — Grade A (`metadata-authority-map.test.ts`) |
| No leakage test | `packages/metadata/src/__tests__/no-implementation-leakage.test.ts` | Yes — Grade A |
| Version semver | `packages/metadata/src/metadata.version.ts` | Yes — Grade A (`metadata-version.test.ts`) |
| Test suites | `packages/metadata/src/__tests__/` (22 files) | Yes — Grade A (153 tests exit 0) |
| Package version | `packages/metadata/package.json` v0.2.0 | Yes — Grade A |

## §Remaining gaps

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `metadata-authority-matrix-fdr-drift` | Matrix **implemented** vs FDR was **Not started** — delivery lag | green | `fdr-author` (Research) | Slice 1 ✓ | Research attestation; status → **Partially Implemented** |
| `metadata-authority-complete-status` | **Complete (authority only)** blocked on peer review | green | Architecture Authority | Complete | DoD #14 `[x]` |

## §Enterprise readiness score

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + 153 contract tests + semver — Grade A | — |
| Test coverage | 5/5 | 22 files, 153 tests — Grade A | E2E waived (`metadata-authority-e2e`) |
| Observability + audit | 2/5 | Authority-only — Grade D | Waiver `metadata-authority-observability` |
| Security + RBAC + RLS | 4/5 | `no-implementation-leakage.test.ts` — Grade A | Action RBAC enforced in metadata-ui |
| Documentation + BRD traceability | 5/5 | FDR + tip-005 + registry row + drift exit 0 — Grade A | DoD #14 `[ ]` |
| Maintainability + Clean Core | 5/5 | typecheck + test + biome exit 0; Clean Core A — Grade A | — |
| **Total (audit-adjusted)** | **27/30** | Registry row `PKG011_METADATA` onboarded (2026-06-25) | Complete (authority only) candidate |
| **Total (evidence-qualified ceiling)** | **27/30** | Upper bound with peer review at Complete | 9.5 candidate after DoD #14 |

## §Clean Core classification

**This FDR: Level A** — pure metadata contracts; `no-implementation-leakage.test.ts` blocks React/UI imports.

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/metadata-ui` | All metadata contracts | Yes if semver major | A→A |
| `apps/erp` | Indirect via metadata-ui | No | A→A |
| `@afenda/appshell` | Metadata types if any | No | A→A |

**Breaking change policy:** bump `metadata.version.ts` + semver in `package.json` on contract array changes; `metadata-version.test.ts` guards drift.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SOLMAN | FDD | `pnpm --filter @afenda/metadata test:run` | 2 |
| SAP namespace | CEMLI registry | `pnpm quality:boundaries` | 3 |
| SAP ATC | Contract stability | `pnpm --filter @afenda/metadata typecheck` | 4 |
| Oracle FDD | BRD traceability | Gherkin §Acceptance criteria | 2 |
| SOLMAN | Drift guard | `pnpm check:documentation-drift` | 9 |

## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | No React/UI implementation in metadata package | 17 | `no-implementation-leakage.test.ts` |
| internal | Cross-package authority map matches registry | 16 | `cross-package-authority.test.ts` |
| internal | Renderer contract types without implementations | 18 | `renderer.contract.test.ts` |
| tip-005 (archive) | Metadata authority boundary | 1 | matrix Metadata Authority row |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Contract arrays complete and serializable | `contract-serialization.test.ts` |
| Performance efficiency | Zero runtime UI — compile-time contracts only | `no-implementation-leakage.test.ts` |
| Compatibility | Semver on metadata.version.ts | `metadata-version.test.ts` |
| Security | No server action or UI leakage in authority pkg | `no-implementation-leakage.test.ts` |
| Maintainability | typecheck strict; 22 tests | `typecheck`, `test:run` |
| Reliability | Registry governance tests pass | `registry-governance.test.ts` |
| Documentation | PKG README + matrix aligned | `doc-drift.test.ts` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Metadata contract publish (read-only types) | N/A | — |
| Action execution (runtime) | deferred to metadata-ui / ERP | `fdr-012-metadata-renderers` |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-011-metadata-authority**
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-011**
- Registry: **pending** `PKG011_METADATA`
- Sibling: [`fdr-012-metadata-renderers`](%5BNot%20started%5D%20fdr-012-metadata-renderers.md) — sequential on contract changes
- Archive: tip-005

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-011-metadata-authority.md` | — | Modified per slice |
| `packages/metadata/src/*.contract.ts` | `@afenda/metadata` | Modified (Implementation only) |
| `packages/metadata/src/governance/*.ts` | `@afenda/metadata` | Modified (Implementation only) |
| `packages/metadata/src/__tests__/*.ts` | `@afenda/metadata` | Modified (Implementation only) |

## Acceptance gate

- `pnpm --filter @afenda/metadata typecheck`
- `pnpm --filter @afenda/metadata test:run`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Metadata authority contracts (no renderers)

  Scenario: Metadata package has no UI implementation leakage
    GIVEN source files under packages/metadata/src excluding __tests__
    WHEN no-implementation-leakage.test.ts scans for React, .tsx, CSS, and @afenda/metadata-ui imports
    THEN the test passes
    AND no renderer implementation exists in the authority package

  Scenario: Cross-package authority map defines metadata vs metadata-ui boundaries
    GIVEN crossPackageAuthority in cross-package-authority.contract.ts
    WHEN cross-package-authority.test.ts validates responsibilities
    THEN @afenda/metadata owns metadata-contracts and section-definitions
    AND @afenda/metadata-ui owns renderer-implementation

  Scenario: Metadata contract changes are semver-governed
    GIVEN metadata.version.ts and package.json version
    WHEN metadata-version.test.ts runs
    THEN version constants align with export surface changes
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/metadata test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/metadata typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/metadata` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix Metadata Authority row | [ ] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR complete | [x] |
| 12 | Impact analysis complete | §Impact analysis filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | Architecture Authority PR approval | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core | [x] |
| 16 | No duplicated constants | `registry-governance.test.ts` | [x] |
| 17 | Security negative path tested | `no-implementation-leakage.test.ts` | [x] |
| 18 | Public API compatibility verified | `public-api.test.ts` + semver | [x] |
| 19 | E2E satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | [x] |

## Slices

### Slice 1 — Research (metadata-authority)

**Status:** Complete (2026-06-25)  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** A→A

**Purpose:** Reconcile tip-005 + matrix **implemented** with FDR **Not started**; attest gates; document registry gap.

**Outcomes:** Closed gap `metadata-authority-matrix-fdr-drift`; baseline gate log Grade A; status → **Partially Implemented**.

### Slice 2 — Registry-sync (PKG011_METADATA)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Registry-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

**Outcomes:** `PKG011_METADATA` onboarded in `foundation-disposition.registry.ts` (fingerprint v6); `foundation-disposition.md` synced; gap `fdr-011-registry-entry` closed; DoD #6 `[x]`; waiver `metadata-authority-registry-pending` closed; §Enterprise readiness recalculated to **27/30 audit-adjusted**.

#### Design (internal-guide)

Onboard `PKG011_METADATA` via `foundation-registry-owner` only. Entry must match proposed §Registry link: `green-lane`, `runtimeOwner: packages/metadata`, gates from §Acceptance gate, prohibited `do-not-add-react-or-ui` / `do-not-add-renderers` / `do-not-import-metadata-ui`, `allowedAgents: metadata-agent` + `foundation-registry-owner`. Evidence array cites §Runtime evidence paths. Bump `FOUNDATION_DISPOSITION_FINGERPRINT`. Sync `foundation-disposition.md` table row. No `packages/metadata/` source edits in this slice.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-011-metadata-authority.md

1. Objective    — Create PKG011_METADATA foundation-disposition registry entry with gates, prohibited rules, evidence paths, and allowedAgents; sync foundation-disposition.md; close waiver metadata-authority-registry-pending and unblock DoD #6.
2. Allowed layer— packages/architecture-authority/src/data/; docs/architecture/foundation-disposition.md; docs/delivery/FDR/
3. Files        —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   docs/architecture/foundation-disposition.md
   docs/delivery/FDR/[Partially Implemented] fdr-011-metadata-authority.md
4. Prohibited   — packages/metadata/ source edits; apps/ source edits; foundation-disposition.registry.ts edits by non-foundation-registry-owner agents; @afenda/accounting runtime (ADR-0010); do-not-create-accounting-package
5. Authority    — ADR-0014 · ADR-0016 · proposed §Registry link in fdr-011-metadata-authority
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm check:foundation-disposition
   pnpm quality:architecture
   pnpm check:documentation-drift
7. Closes       — Gap `fdr-011-registry-entry`; DoD #6; waiver `metadata-authority-registry-pending`
8. Evidence     —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   packages/metadata/src/metadata.contract.ts
   packages/metadata/src/governance/cross-package-authority.contract.ts
   packages/metadata/src/governance/metadata-authority-map.contract.ts
   packages/metadata/src/__tests__/no-implementation-leakage.test.ts
   packages/metadata/src/__tests__/cross-package-authority.test.ts
9. Attestation  — Documentation (registry + disposition view sync); Contract stability (registry gates align with package gates); Maintainability (disposition check exit 0)
```

**Implementer:** `foundation-registry-owner` — not `fdr-slice-implementer`.

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 6 | Registry aligned | `pnpm check:foundation-disposition` |

#### Known debt

- DoD #14 peer review remains open until Evidence-sync Slice 4
- `metadata-authority-complete-status` closes at Complete promotion

### Slice 3 — Implementation (registry alignment + FDR drift)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

After `PKG011_METADATA` exists, add filesystem-level registry alignment and FDR documentation drift tests in `@afenda/metadata` only — no contract array changes, no semver bump. Reads `foundation-disposition.registry.ts` as text (no `@afenda/architecture-authority` import). Extends `doc-drift.test.ts` to include fdr-011 delivery doc path.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-011-metadata-authority.md

1. Objective    — Add registry alignment and FDR doc-drift tests in @afenda/metadata proving PKG011_METADATA row matches cross-package authority boundaries after Registry-sync Slice 2.
2. Allowed layer— packages/metadata/src/
3. Files        —
   packages/metadata/src/__tests__/foundation-disposition-registry-alignment.test.ts
   packages/metadata/src/__tests__/doc-drift.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-011-metadata-authority.md
4. Prohibited   — foundation-disposition.registry.ts (foundation-registry-owner only); packages/metadata-ui/; apps/; @afenda/accounting runtime (ADR-0010); do-not-add-react-or-ui; do-not-add-renderers; do-not-import-metadata-ui; do-not-create-accounting-package
5. Authority    — ADR-0014 · PKG011_METADATA · cross-package-authority.contract.ts · metadata-authority-map.contract.ts
6. Gates        —
   pnpm --filter @afenda/metadata typecheck
   pnpm --filter @afenda/metadata test:run
   pnpm quality:boundaries
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — DoD #7 (matrix row cited in alignment test); DoD #10 (§11 attestation in FDR update); DoD #16 (registry-governance evidence extended)
8. Evidence     —
   packages/metadata/src/__tests__/foundation-disposition-registry-alignment.test.ts
   packages/metadata/src/__tests__/doc-drift.test.ts
   packages/metadata/src/__tests__/registry-governance.test.ts
9. Attestation  — Test coverage (+registry alignment tests); Documentation (FDR drift paths); Contract stability (no semver-breaking contract edits)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 7 | Runtime matrix updated | matrix Metadata Authority row cited in alignment test |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 in slice delivery |
| 16 | No duplicated constants | `registry-governance.test.ts` + alignment test |

#### Known debt

- Gap `metadata-authority-complete-status` — DoD #14 peer review deferred to Slice 4 Evidence-sync
- Observability waiver `metadata-authority-observability` remains until Phase 9

### Slice 4 — Evidence-sync (Complete — authority only)

**Status:** Not started  
**Prerequisite:** Slice 3 Complete  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Record Architecture Authority peer review (DoD #14); recalculate §Enterprise readiness score to 27/30 evidence-qualified ceiling; sync runtime matrix and fdr-status-index; promote to **Complete (authority only)** when waivers reconfirmed.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Complete (authority only)] fdr-011-metadata-authority.md

1. Objective    — Close DoD #14; promote fdr-011-metadata-authority to Complete (authority only) at 27/30 audit-adjusted ceiling; sync matrix and index.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Complete (authority only)] fdr-011-metadata-authority.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts
5. Authority    — Architecture Authority peer review attestation · ADR-0016 · ENTERPRISE-BENCHMARK §3.2
6. Gates        —
   pnpm --filter @afenda/metadata typecheck
   pnpm --filter @afenda/metadata test:run
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap `metadata-authority-complete-status`; DoD #14; DoD #8 (index rename); final §Enterprise readiness score
8. Evidence     — §Peer review attestation block in FDR; final gate log in Slice 4 outcomes
9. Attestation  — Documentation 5/5; Enterprise readiness 27/30 accepted (authority only)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 14 | Peer review | Architecture Authority PR approval |
| 8 | fdr-status-index updated | index row status prefix |

#### Known debt

- Waiver `metadata-authority-observability` — reconfirmed at promotion, expires Phase 9
- Waiver `metadata-authority-e2e` — reconfirmed at promotion

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc | No runtime change |
| Registry-sync | Revert registry commit | Re-run disposition check |
| Implementation | Revert metadata commit; rebuild | Semver bump policy for consumers |

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `metadata-authority-observability` | Audit on contract read | Types-only authority package | Architecture Authority | Phase 9 |
| `metadata-authority-e2e` | Browser E2E | No UI in PKG-011 | Architecture Authority | External beta |

## §Knowledge transfer

### Operational runbook

- Entry: `packages/metadata/src/index.ts`
- Authority map: `packages/metadata/src/governance/metadata-authority-map.contract.ts`
- Cross-package rules: `packages/metadata/src/governance/cross-package-authority.contract.ts`
- Version: `packages/metadata/src/metadata.version.ts`

### Observability

- Contract drift: `doc-drift.test.ts`
- Downstream drift: `packages/metadata-ui/src/__tests__/no-authority-drift.test.ts`

### On-call escalation

- Symptom: metadata-ui compile errors after metadata change → check semver + `public-api.test.ts`
- Owner: Metadata Authority / pending `metadata-agent`

## §Matrix–FDR drift

| Matrix row | Matrix status | FDR status (pre-audit) | FDR status (post-audit) | Gap nature | Required action |
| --- | --- | --- | --- | --- | --- |
| Metadata Authority | **implemented** | Not started | **Partially Implemented** | FDR delivery lag — runtime ahead of delivery authority | Evidence-sync Slice 4 for Complete (authority only) |

**Verdict:** Matrix **implemented** vs FDR **Partially Implemented** is expected per ADR-0016 until registry row + DoD closeout.

## §Enterprise benchmark qualification

This FDR is **Complete (authority only) candidate at 27/30 audit-adjusted**, not final **Complete (authority only) — enterprise 9.5 accepted**, because DoD #14 peer review remains open.

Strongest authority-only evidence in batch: 153 tests, zero UI leakage, semver-governed contracts.

**Promotion to Complete (authority only) requires:** Architecture Authority peer review, Evidence-sync recalculates final score.

## Verdict

**Partially Implemented — Complete (authority only) candidate at 27/30 audit-adjusted, pending Architecture Authority peer review (DoD #14).**

Research Slice 1 attested typecheck + 153 tests exit 0 (2026-06-25). Registry-sync Slice 2 delivered `PKG011_METADATA` (2026-06-25).
