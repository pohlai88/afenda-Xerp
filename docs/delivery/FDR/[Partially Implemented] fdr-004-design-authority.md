# fdr-004-design-authority — Design Authority

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-004-design-authority` |
| **Registry entry ID** | **pending** — `foundation-registry-owner` must create entry (proposed: `PKG004_DESIGN`) |
| **Package** | `@afenda/design-system` (PKG-004) |
| **Lane** | blue-lane (proposed — authority-only maintain; matrix: **partially-implemented**) |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Configuration |
| **Risk class** | Low |
| **BRD reference** | internal — design tokens, recipes, governance contracts (no runtime UI) |
| **Enterprise readiness** | **22/30 audit-adjusted** · **26/30 evidence-qualified ceiling** — enterprise **9.5 candidate blocked** (registry pending; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | Fiori theme · Fusion theme · SAP namespace (dependency-registry) |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). **No typed registry row exists yet** for PKG-004; values below are proposed from [`package-registry.md`](../../architecture/package-registry.md) and runtime inspection. Do not treat as registry authority until `foundation-registry-owner` promotes an entry.

| Field | Value |
| --- | --- |
| id | **pending** (`PKG004_DESIGN` proposed) |
| packageId | PKG-004 |
| domain | `design-authority` |
| lane | blue-lane (proposed) |
| runtimeOwner | `packages/design-system` |
| gates | `pnpm --filter @afenda/design-system typecheck`; `pnpm --filter @afenda/design-system test:run`; `pnpm --filter @afenda/design-system check:all` |
| prohibited | `do-not-add-runtime-ui`; `do-not-import-react-or-radix`; `do-not-duplicate-token-authority-in-consumers` |
| allowedAgents | `design-system-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/design-system` (PKG-004) | Token registry, recipe contracts, CSS manifest generation — **authority only, no runtime UI** | `packages/design-system/src/` |
| `@afenda/ui` (PKG-018) | Governed React primitives — consumes tokens/recipes (read-only in Research) | `packages/ui/src/components/` |
| `@afenda/metadata-ui` (PKG-012) | Metadata renderers — consumes `metadata-ui.recipe.ts` (read-only in Research) | `packages/metadata-ui/src/` |

## Purpose

Lock and maintain the **authority-only** design-system boundary: Afenda-prefixed tokens, variant/recipe registries, governance scripts, and CSS manifest generation — with **zero runtime React UI** in `@afenda/design-system` by design. Primitives and components live in `@afenda/ui`; consumers import contracts and generated CSS only.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-003-design-system-authority.md`](../../delivery/tips/[Complete%20(authority%20only)]%20tip-003-design-system-authority.md) · [`tip-004-design-system-contracts.md`](../../delivery/tips/[Complete%20(authority%20only)]%20tip-004-design-system-contracts.md).

## Scope

**In scope**

- `packages/design-system/src/registries/token.registry.ts` — canonical Afenda token authority
- `packages/design-system/src/registries/recipe.registry.ts` — recipe contracts (incl. `metadata-ui.recipe.ts`)
- `packages/design-system/src/contracts/design-system-authority.contract.ts` — authority boundary contract
- Governance scripts: `check-no-runtime-ui.ts`, `check-no-duplicate-authority.ts`, `check-public-api.ts`, `check-governance.ts`
- CSS generation: `scripts/generate-tokens-css.ts`, `src/css/css-manifest.ts`
- Contract and registry tests under `packages/design-system/src/__tests__/` (12 suites)

**Out of scope**

- React component implementations (owned by `@afenda/ui`, `fdr-018-governed-primitives`)
- ERP or AppShell layout wiring (`fdr-001-shell-composition`)
- Metadata renderer implementation (`fdr-012-metadata-renderers`)
- Accounting runtime (ADR-0010)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `packages/design-system/` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate token names, recipe IDs, or variant keys outside design-system registries |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-004 | **Sequential** with `fdr-018-governed-primitives` when touching `@afenda/ui` consumption contracts |
| Implementation blocked until | Research Slice 1 complete; registry entry `PKG004_DESIGN` exists |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled archive tip-003/004 + runtime matrix **partially-implemented** with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does `check-no-runtime-ui.ts` exit 0 today? | **Yes** — `check:all` governance 5/5 pass incl. `check:no-runtime-ui` | `pnpm --filter @afenda/design-system check:all` exit 0 |
| Are all test suites green under `test:run`? | **Yes** — 13 files, 97 tests pass | `pnpm --filter @afenda/design-system test:run` exit 0 |
| Which downstream packages import authority vs duplicate? | **@afenda/ui**, **@afenda/metadata-ui** consume recipes; `no-local-recipe-authority.test.ts` passes | metadata-ui boundary test Grade A |
| Registry row required? | **Yes** — `PKG004_DESIGN` pending; hard-fail §3.1 cap applies | `foundation-disposition.registry.ts` — no PKG-004 row |
| Does `pnpm check:foundation-disposition` pass? | **Yes** — PASS (2026-06-25); waiver `design-authority-registry-pending` for DoD #6 until row lands | exit 0 |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/design-system typecheck` | 0 | A |
| `pnpm --filter @afenda/design-system test:run` | 0 | A (97 tests) |
| `pnpm --filter @afenda/design-system check:all` | 0 | A (5/5 governance) |
| `pnpm exec biome check packages/design-system` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

### Files inspected

| Path | Why |
| --- | --- |
| `packages/design-system/src/index.ts` | Public export surface + `designSystemContract` |
| `packages/design-system/src/registries/token.registry.ts` | Token authority |
| `packages/design-system/src/registries/recipe.registry.ts` | Recipe authority |
| `packages/design-system/src/scripts/check-no-runtime-ui.ts` | No-runtime-UI gate |
| `packages/design-system/src/scripts/check-governance.ts` | Aggregated governance runner |
| `packages/design-system/src/__tests__/boundary.test.ts` | Package boundary proof |
| `packages/design-system/src/__tests__/public-api.test.ts` | Export surface stability |
| `packages/metadata-ui/src/__tests__/no-local-recipe-authority.test.ts` | Downstream recipe non-duplication |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Design System row |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Design system contract | `packages/design-system/src/index.ts` | Yes — Grade A (`index.test.ts` 35 tests) |
| Token registry | `packages/design-system/src/registries/token.registry.ts` | Yes — Grade A (`token-registry.test.ts`) |
| Recipe registry | `packages/design-system/src/registries/recipe.registry.ts` | Yes — Grade A (`recipe-registry.test.ts`) |
| Authority contract | `packages/design-system/src/contracts/design-system-authority.contract.ts` | Yes — Grade A (`design-system-contracts.test.ts` 8 tests) |
| No-runtime-UI script | `packages/design-system/src/scripts/check-no-runtime-ui.ts` | Yes — Grade A (`check:all` exit 0) |
| Governance aggregator | `packages/design-system/src/scripts/check-governance.ts` | Yes — Grade A (5/5 pass) |
| CSS manifest | `packages/design-system/src/css/css-manifest.ts` | Yes — Grade A (`css-manifest.test.ts` 12 tests) |
| Contrast validation | `packages/design-system/src/scripts/check-contrast.ts` | Yes — Grade A (`contrast.test.ts`) |
| Test suites | `packages/design-system/src/__tests__/` (13 files) | Yes — Grade A (`test:run` exit 0, 97 tests) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `fdr-004-registry-entry` | No typed row in `foundation-disposition.registry.ts` for PKG-004 | blue | `foundation-registry-owner` | Registry-sync | Entry `PKG004_DESIGN` created; §Registry link id populated |
| `design-authority-matrix-fdr-drift` | Matrix **partially-implemented** vs FDR was **Not started** — delivery lag | blue | `fdr-author` (Research) | Slice 1 ✓ | Research attestation recorded; status → **Partially Implemented** |
| `design-authority-complete-status` | Promotion to **Complete (authority only)** blocked on registry + peer review | blue | Architecture Authority | Complete | DoD #14 `[x]`; registry row live |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** requires registry entry, 29/30 on this table, DoD #14 peer review, and waivers reconfirmed ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). **Hard fail:** missing registry entry caps total at **22/30** (§3.1).
>
> Until Research Slice 1 completes, scores reflect file-path evidence only — not attested gate exit 0.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + `public-api.test.ts` + 97 tests — Grade A | — |
| Test coverage | 4/5 | `test:run` exit 0 (97 tests, 13 files) — Grade A | E2E waived (`design-authority-e2e`) |
| Observability + audit | 2/5 | Authority-only package — no governed mutations — Grade D | Waiver `design-authority-observability` |
| Security + RBAC + RLS | 5/5 | `check:no-runtime-ui` + `boundary.test.ts` attested — Grade A | No RBAC surface by design |
| Documentation + BRD traceability | 3/5 | FDR + index + matrix + `check:documentation-drift` exit 0 — Grade A | Registry entry missing; DoD #14 `[ ]` |
| Maintainability + Clean Core | 5/5 | `typecheck` + `test:run` + `check:all` + PKG biome exit 0; Clean Core A — Grade A | — |
| **Total (audit-adjusted)** | **22/30** | **Registry hard-fail §3.1 cap** — raw 24/30 | Honest foundation-grade score |
| **Total (evidence-qualified ceiling)** | **26/30** | Upper bound with `PKG004_DESIGN` + waivers + peer review pending | Not 9.5 until Complete |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — pure token/recipe authority; `check-no-runtime-ui.ts` enforces no React UI; public exports governed by `publicExportContract`.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `@afenda/ui` | Token CSS paths, recipe types | No | A→A |
| `@afenda/metadata-ui` | `metadata-ui.recipe.ts` via design-system recipes | No | A→A |
| `@afenda/appshell` | Design tokens / density (if any) | No | A→A |
| `apps/erp` | Indirect via `@afenda/ui` | No | A→A |

**Upstream consumers scan:** `@afenda/ui`, `@afenda/metadata-ui`, and dependency-registry edges to `packages/design-system`. No package should define parallel token registries (`no-local-recipe-authority` test in metadata-ui).

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| Fiori theme | Fusion theme | `pnpm --filter @afenda/design-system check:contrast` | 17 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/design-system typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |

## §BRD traceability

> No orphan AC rows. Archive tip-003/004 map to internal requirements.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | No runtime UI in design-system package | 17 | `check-no-runtime-ui.ts` |
| internal | Token registry is single authority for Afenda-prefixed tokens | 18 | `token-registry.test.ts` |
| internal | Public export surface matches `publicExportContract` | 18 | `public-api.test.ts` |
| tip-003 (archive) | Design authority boundary enforced | 1 | `boundary.test.ts` |
| tip-004 (archive) | Recipe contracts consumable without duplication | 16 | `no-local-recipe-authority.test.ts` (metadata-ui) |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Tokens/recipes export matches contract; no UI leakage | `index.test.ts`, `check-no-runtime-ui.ts` |
| Performance efficiency | CSS generation is build-time only; no runtime React in PKG-004 | `check-no-runtime-ui.ts` |
| Compatibility | Public API stable; semver on `@afenda/design-system` | `public-api.test.ts` |
| Security | No executable UI attack surface in authority package | `boundary.test.ts` |
| Maintainability | Biome clean; strict typecheck; governance scripts | `typecheck` + `check:all` |
| Reliability | Deterministic token CSS from registry | `token-css-variable.test.ts` |
| Usability (downstream) | Contrast ratios meet accessibility policy | `contrast.test.ts` |
| Documentation | Index + matrix aligned with FDR evidence | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Token/recipe authority (read-only exports) | N/A — no governed mutation in PKG-004 | — |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-004-design-authority**
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-004**
- Registry: **pending** `PKG004_DESIGN` — blocks Implementation until created
- Downstream validation: `fdr-012-metadata-renderers` consumes recipes (read-only coupling)
- Archive evidence: tip-003, tip-004 (authority only)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-004-design-authority.md` | — | Modified per slice |
| `packages/design-system/src/registries/*.ts` | `@afenda/design-system` | Modified (Implementation slices only) |
| `packages/design-system/src/contracts/*.ts` | `@afenda/design-system` | Modified (Implementation slices only) |
| `packages/design-system/src/scripts/check-*.ts` | `@afenda/design-system` | Modified (Implementation slices only) |
| `packages/design-system/src/__tests__/*.ts` | `@afenda/design-system` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm --filter @afenda/design-system typecheck`
- `pnpm --filter @afenda/design-system test:run`
- `pnpm --filter @afenda/design-system check:all`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Design-system authority boundary (no runtime UI)

  Scenario: Package contains no runtime React UI
    GIVEN the design-system source tree under packages/design-system/src
    WHEN check-no-runtime-ui.ts scans for .tsx files, React imports, and prohibited CSS
    THEN the script exits 0
    AND no component implementation files exist in the authority package

  Scenario: Token registry is the single source of Afenda-prefixed tokens
    GIVEN AFENDA_TOKEN_REGISTRY in token.registry.ts
    WHEN a consumer imports designSystemContract from @afenda/design-system
    THEN token keys match the registry contract
    AND token-registry.test.ts passes

  Scenario: Public export surface matches governed contract
    GIVEN publicExportContract in export-surface.ts
    WHEN public-api.test.ts validates the package barrel
    THEN no undeclared deep imports are required by consumers
    AND export surface remains backward compatible
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/design-system test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/design-system typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/design-system` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [ ] |
| 7 | Runtime matrix updated | matrix Design System row | [ ] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core aligned | [x] |
| 16 | No duplicated constants / parallel authority | `check-no-duplicate-authority.ts` | [x] |
| 17 | Security negative path tested | `check-no-runtime-ui.ts` exit 0 | [x] |
| 18 | Public API compatibility verified | `public-api.test.ts` | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | [x] |

## Slices

### Slice 1 — Research (design-authority)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** A→A

**Purpose:** Reconcile archive tip-003/004 + runtime matrix **partially-implemented** with FDR **Not started**; attest gates; document registry gap `fdr-004-registry-entry`.

**Outcomes:** Closed gaps `design-authority-matrix-fdr-drift`; baseline gate log Grade A; status → **Partially Implemented**.

### Slice 2 — Registry-sync (PKG004_DESIGN)

**Status:** Not started  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Registry-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Create typed registry entry `PKG004_DESIGN` via `foundation-registry-owner` only. Research Slice 1 attested authority-only boundary at `packages/design-system` — registry row must mirror §Registry link (domain `design-authority`, blue-lane, gates incl. `check:all`, prohibited no-runtime-ui rules, evidence paths). Closes waiver `design-authority-registry-pending` and lifts ENTERPRISE-BENCHMARK §3.1 hard cap from 22/30 audit-adjusted. Slice 3 (Implementation) blocked until Delivered.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-004-design-authority.md

1. Objective    — Add PKG004_DESIGN row to foundation disposition registry with gates, prohibited rules, allowedAgents, and runtime evidence paths; sync disposition view, matrix Design System row, and fdr-status-index registry column so DoD #6 passes and audit-adjusted readiness cap lifts above 22/30.
2. Allowed layer— packages/architecture-authority/src/data/; docs/architecture/foundation-disposition.md; docs/delivery/FDR/; docs/delivery/fdr-status-index.md; docs/architecture/afenda-runtime-truth-matrix.md
3. Files        —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   docs/architecture/foundation-disposition.md
   docs/delivery/FDR/[Partially Implemented] fdr-004-design-authority.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/design-system/ source edits; packages/ui/ edits; apps/ edits; foundation-disposition.registry.ts edits by non-owner agents; do-not-create-accounting-package; do-not-add-runtime-ui; do-not-import-react-or-radix; do-not-duplicate-token-authority-in-consumers
5. Authority    — ADR-0014 · ADR-0016 · §Registry link proposed snapshot (PKG004_DESIGN) · archive tip-003/004 (evidence only)
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm check:foundation-disposition
   pnpm quality:architecture
   pnpm check:documentation-drift
7. Closes       — Gap fdr-004-registry-entry; waiver design-authority-registry-pending; DoD #6; partial design-authority-complete-status (registry prerequisite — DoD #14 and DoD #7 remain for Slice 3)
8. Evidence     —
   packages/design-system/src/index.ts
   packages/design-system/src/registries/token.registry.ts
   packages/design-system/src/registries/recipe.registry.ts
   packages/design-system/src/contracts/design-system-authority.contract.ts
   packages/design-system/src/scripts/check-no-runtime-ui.ts
   packages/design-system/src/__tests__/boundary.test.ts
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
9. Attestation  — Documentation (registry row + matrix/index synced); Maintainability (disposition hard cap lifted — ENTERPRISE-BENCHMARK §3.1); Security (registry prohibited enforces no-runtime-ui boundary)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 6 | Registry aligned | `pnpm check:foundation-disposition` |

#### Known debt

- `design-authority-complete-status` — DoD #14 peer review and DoD #7 matrix sync deferred to Slice 3 Implementation / Evidence-sync
- `design-authority-observability` — observability dimension 2/5 waived per §Waivers
- Slice 3 (Implementation authority maintenance) blocked until this slice Delivered

### Slice 3 — Implementation (authority maintenance)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Implementation  
**Risk class:** Low  

**Purpose:** Close any bounded gaps from Research; attestation gates; target **Complete (authority only)** when DoD rows pass.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Registry-sync | Revert registry commit via `foundation-registry-owner` | Re-run `pnpm check:foundation-disposition` |
| Implementation | Revert design-system commit; rebuild package | Quarterly-release-safe; token CSS regenerates from registry |

Oracle analog: confirm upgrade-safe — no internal object modifications outside `runtimeOwner`. SAP analog: transport rollback = git revert + gate re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `design-authority-observability` | Audit event on token/recipe read (ISO observability 4/5) | Authority package exports contracts only; no governed mutations | Architecture Authority | Phase 9 / observability FDR |
| `design-authority-e2e` | Browser E2E for design-system | No runtime UI by design; unit + governance scripts prove boundary | Architecture Authority | External beta go-live |
| `design-authority-registry-pending` | DoD #6 until registry row exists | PKG-004 in package-registry but not yet in disposition registry | Architecture Authority | Close when `PKG004_DESIGN` lands |

## §Knowledge transfer

### Operational runbook

- Package entry: `packages/design-system/src/index.ts` — `designSystemContract`
- Token authority: `packages/design-system/src/registries/token.registry.ts`
- Recipe authority: `packages/design-system/src/registries/recipe.registry.ts`
- Build CSS: `pnpm --filter @afenda/design-system build` (runs `generate-tokens-css.ts`)
- Governance: `pnpm --filter @afenda/design-system check:all`

### Observability

- No audit events — authority-only read/export path (waived — see §Waivers)
- Contrast failures: `pnpm --filter @afenda/design-system check:contrast`
- Downstream drift: `packages/metadata-ui/src/__tests__/no-local-recipe-authority.test.ts`

### On-call escalation

- Symptom: consumer token mismatch → run `token-registry.test.ts` and verify CSS rebuild
- Symptom: accidental `.tsx` in design-system → run `check-no-runtime-ui.ts`
- Owner: Design Authority / `design-system-agent` (pending registry)

## §Matrix–FDR drift

| Matrix row | Matrix status | FDR status (pre-audit) | FDR status (post-audit) | Gap nature | Required action |
| --- | --- | --- | --- | --- | --- |
| Design System | **partially-implemented** | Not started | **Partially Implemented** | FDR delivery lag — runtime ahead of delivery authority | Registry-sync Slice 2; Evidence-sync for Complete (authority only) |

**Verdict:** Matrix **partially-implemented** vs FDR **Partially Implemented** is expected per ADR-0016 until registry row + DoD closeout — not a runtime contradiction.

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate blocked at 22/30 audit-adjusted (26/30 ceiling)**, not final **Complete (authority only) — enterprise 9.5 accepted**, because `PKG004_DESIGN` registry row and DoD #14 peer review remain open.

The **26/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. Observability waived for authority-only read path (`design-authority-observability`).
2. Browser E2E waived — no runtime UI by design (`design-authority-e2e`).
3. DoD #6 waived until registry row lands (`design-authority-registry-pending`).
4. **Complete (authority only)** requires Architecture Authority peer review (DoD #14).

The **22/30 audit-adjusted** score reflects ENTERPRISE-BENCHMARK §3.1 registry hard-fail cap despite strong gate attestation (97 tests, 5/5 governance).

**Promotion to Complete (authority only) requires:**

1. `foundation-registry-owner` creates `PKG004_DESIGN`.
2. Architecture Authority peer review (DoD #14).
3. Evidence-sync recalculates to 26/30+ with waivers reconfirmed.

## Verdict

**Partially Implemented — enterprise 9.5 candidate blocked at 22/30 audit-adjusted (26/30 ceiling), pending `PKG004_DESIGN` registry row and Architecture Authority peer review.**

Research Slice 1 attested all package gates exit 0 (2026-06-25). Runtime matrix **partially-implemented** reconciled. Do not represent as enterprise 9.5 complete until registry sync and peer review close.
