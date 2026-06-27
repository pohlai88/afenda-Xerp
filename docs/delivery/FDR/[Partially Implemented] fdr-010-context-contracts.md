# fdr-010-context-contracts — Context Contracts

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-010-context-contracts` |
| **Registry entry ID** | `PKG010_KERNEL` |
| **Package** | `@afenda/kernel` (PKG-010) |
| **Lane** | green-lane |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Medium |
| **BRD reference** | internal — operating-context contract barrel |
| **Enterprise readiness** | **27/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (not final Complete; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | Platform namespace · Integration contracts · multi-tenancy authority |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `operating-context-contracts`; this FDR scopes the **context-contracts** subdomain on the same `PKG010_KERNEL` entry.

| Field | Value |
| --- | --- |
| id | `PKG010_KERNEL` |
| packageId | PKG-010 |
| domain | `operating-context-contracts` (FDR subdomain: `context-contracts`) |
| lane | green-lane |
| runtimeOwner | `packages/kernel` |
| gates | `pnpm --filter @afenda/kernel typecheck`; `pnpm quality:kernel-context-surface` |
| prohibited | `do-not-create-accounting-package`; `do-not-implement-resolver-in-kernel` |
| allowedAgents | `kernel-context-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/kernel` (PKG-010) | Operating-context contract barrel + consolidation scope resolver | `packages/kernel/src/context/` |
| `@afenda/appshell` (PKG-001) | Consumer — AppShell display contracts (read-only in Research) | `packages/appshell/src/` |
| `@afenda/permissions` (PKG-014) | Consumer — permission scope vocabulary (read-only) | `packages/permissions/src/` |
| `apps/erp` (PKG-007) | Consumer — operating-context resolution (read-only) | `apps/erp/src/lib/context/` |

## Purpose

Lock and maintain the governed operating-context contract surface — tenant through consolidation scope — exported from `@afenda/kernel` with no resolver implementation in kernel beyond consolidation scope metadata (`deriveConsolidationScopeContext`).

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-007-erp-platform-authority.md`](../../delivery/tips/[Complete]%20tip-007-erp-platform-authority.md) (context slices) · [`multi-tenancy.md`](../../architecture/multi-tenancy.md) (Step 4 hierarchy).

## Scope

**In scope**

- `packages/kernel/src/context/` — 10 required modules in `KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES` + support modules
- `packages/kernel/src/context/index.ts` — public context barrel
- `packages/kernel/src/index.ts` — root re-exports for operating-context types
- Context registry drift tests (`context-registry.test.ts`) and subdomain contract tests
- `quality:kernel-context-surface` governance gate alignment

**Out of scope**

- Operating-context **resolver** in kernel (prohibited — lives in `apps/erp`)
- Platform entity authority registry (`fdr-010-platform-authority`)
- Business master data wire contracts (`fdr-010-master-data-authority`)
- Accounting runtime (ADR-0010)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `packages/kernel/src/context/` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate `KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES` outside `context-registry.ts` |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-010 | **Sequential** with `fdr-010-platform-authority` and `fdr-010-master-data-authority` — same `runtimeOwner`; orchestrator serializes |
| Implementation blocked until | Research Slice 1 complete |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled runtime matrix **implemented** (Kernel Execution Context row) with FDR **Not started**; mapped 10 required context modules + 76 package tests.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Does `context-registry.ts` list all multi-tenancy required modules? | **Yes** — 10 required modules with on-disk files | `context-registry.test.ts` (8 tests pass) |
| Is public barrel complete? | **Yes** — `context/index.ts` exports all required primary types | `quality:kernel-context-surface` export substring checks (when dist fresh) |
| Resolver prohibited in kernel? | **Yes** — only `deriveConsolidationScopeContext` (scope metadata); no tenant/session resolver | registry `prohibited`; `consolidation-scope-resolution.server.ts` |
| Do context gates pass? | **Partial** — `typecheck` ✓; `test:run` ✓ (76); `quality:kernel-context-surface` ✗ (stale/missing `dist/`) | Gate log below |
| Archive tip-007 alignment? | **Yes** — platform entities map to context contracts cited in platform registry | `platform-entity-authority.contract.test.ts` cross-check |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/kernel typecheck` | 0 | A |
| `pnpm --filter @afenda/kernel test:run` | 0 | A (76 tests, 19 files) |
| `pnpm quality:kernel-context-surface` | 1 | — (stale/missing `dist/index.d.ts`; gap `kernel-context-dist-freshness`) |
| `pnpm exec biome check packages/kernel` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A (post-FDR upgrade) |

### v2 FDR audit gate log (2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/kernel typecheck` | 0 | A |
| `pnpm --filter @afenda/kernel test:run` | 0 | A (76 tests, 19 files) |
| `pnpm quality:kernel-context-surface` | 1 | — (`dist/index.d.ts` older than `src/index.ts`; gap `kernel-context-dist-freshness`) |

### Files inspected

| Path | Why |
| --- | --- |
| `packages/kernel/src/context/context-registry.ts` | 10 required module authority |
| `packages/kernel/src/context/index.ts` | Public context barrel |
| `packages/kernel/src/context/operating-context.contract.ts` | Composed operating context |
| `packages/kernel/src/context/consolidation-scope-resolution.server.ts` | Allowed scope resolver |
| `packages/kernel/src/context/untrusted-client-authority.contract.ts` | Client authority guard |
| `packages/kernel/src/__tests__/context-registry.test.ts` | Registry drift (8 tests) |
| `packages/kernel/src/__tests__/accounting-readiness.contract.test.ts` | Readiness stub contracts (11 tests) |
| `packages/kernel/src/__tests__/hierarchy-id-boundary.test.ts` | Branded-id trust (8 tests) |
| `scripts/governance/check-kernel-context-surface.mts` | Surface gate rules |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Kernel Execution Context row |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Context registry | `packages/kernel/src/context/context-registry.ts` | Yes — Grade A (`context-registry.test.ts` 8 tests) |
| Context barrel | `packages/kernel/src/context/index.ts` | Yes — Grade B (barrel + import scan in surface gate) |
| Root exports | `packages/kernel/src/index.ts` | Yes — Grade B (`index.test.ts`) |
| Operating context | `packages/kernel/src/context/operating-context.contract.ts` | Yes — Grade B (registry + type exports) |
| Consolidation resolver | `packages/kernel/src/context/consolidation-scope-resolution.ts` | Yes — Grade A (`consolidation-scope-resolution.test.ts` 5 tests) |
| Untrusted client guard | `packages/kernel/src/context/untrusted-client-authority.contract.ts` | Yes — Grade A (`untrusted-client-authority.contract.test.ts` 4 tests) |
| Hierarchy id boundary | `packages/kernel/src/context/hierarchy-id-boundary.contract.ts` | Yes — Grade A (`hierarchy-id-boundary.test.ts` 8 tests) |
| Accounting readiness stub | `packages/kernel/src/context/accounting-readiness.contract.ts` | Yes — Grade A (`accounting-readiness.contract.test.ts` 11 tests) |
| Surface governance gate | `scripts/governance/check-kernel-context-surface.mts` | Yes — Grade A (`quality:kernel-context-surface` exit 0; Slice 2 2026-06-26) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `context-contracts-complete-status` | FDR at 28/30 audit-adjusted (29/30 ceiling); Complete blocked on peer review | green | Architecture Authority (PR) | Complete | DoD #14 peer review `[x]`; rename to `[Complete]` |
| `pas-uomcode-primitive` | UomCode blocked on PAS approval | amber | Architecture Authority | 6 | Explicit approval + brand export |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 on this table **and** DoD #14 peer review closed **and** waivers reconfirmed at PR ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). Until then this FDR is an **enterprise 9.5 candidate / evidence-qualified**, not final Complete.
>
> Score 0–5 per dimension (integers only in table). Every point maps to gate exit 0, test path, or explicit §Waivers row. Where waivers or open DoD rows cap a dimension, the **audit-adjusted** score is used for the honest total.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 — Grade A | — |
| Test coverage | 5/5 | `test:run` exit 0 (106 tests) + context-focused suites — Grade A | E2E browser waived (`context-contracts-e2e`) |
| Observability + audit | 4/5 | Contract read path; no audit on context projection — Grade B | Waiver `context-contracts-observability-read-path` |
| Security + RBAC + RLS | 5/5 | `untrusted-client-authority.contract.test.ts` + `permission-scope-context` exports — Grade A | — |
| Documentation + BRD traceability | 4/5 | FDR v2 + index + matrix + `check:documentation-drift` — Grade A | DoD #14 peer review still `[ ]` |
| Maintainability + Clean Core | 5/5 | Clean Core A; `quality:kernel-context-surface` exit 0 — Grade A | Slice 2 `ensureKernelDistFresh` (2026-06-26) |
| **Total (audit-adjusted)** | **28/30** | **~9.3 / 10 equivalent** — dist gate closed; peer review pending | |
| **Total (evidence-qualified ceiling)** | **29/30** | Upper bound if dist gate green, §Waivers accepted, peer review pending only | Not final 9.5 until Complete |

Target at Complete: **29/30** per enterprise 9.5 benchmark ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — operating-context contracts are registry-driven serializable types; consolidation scope resolver is bounded metadata-only; no consumer-side authority duplication.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` | `OperatingContext`, context types, `deriveConsolidationScopeContext`, `toLegalEntityContext` brand at trust boundary | Compile-time only (Slice 13: `CurrencyCode`/`CountryCode` on `LegalEntityContext`; runtime JSON unchanged) | A→B (bounded — loader brands at boundary) |
| `@afenda/appshell` | `ApplicationShellContextSwitchTarget`, display helpers | No | A→A |
| `@afenda/permissions` | `PermissionScopeContext`, grant scope types | No | A→A |
| `@afenda/auth` | Context types via kernel barrel (scan root) | No | A→A |
| `@afenda/execution` | `ExecutionContext` (sibling contract in root index) | No | A→A |

**ERP giant compatibility (Research confirmed):**

- **Module scale:** 10 required context modules align with `docs/architecture/multi-tenancy.md` Step 4 hierarchy.
- **Deep import prohibition:** `check-kernel-context-surface.mts` scans ERP, appshell, permissions, auth, execution for forbidden `@afenda/kernel/src/` paths.
- **Resolver boundary:** Tenant/session resolution stays in ERP; kernel exports contracts + consolidation scope derivation only.

Upstream consumers scan: `apps/erp/src`, `packages/appshell/src`, `packages/permissions/src`, `packages/auth/src`, `packages/execution/src`.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| Platform namespace | Integration contracts | `pnpm quality:kernel-context-surface` | 1 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| ATC | Quality standards | `pnpm ci:biome` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/kernel typecheck` | 4 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive evidence.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | 10 required context modules exist and export primary types | 1 | `context-registry.test.ts` |
| internal | Public barrel forbids deep imports from consumers | 16 | `quality:kernel-context-surface` |
| internal | Untrusted client authority fields rejected at wire boundary | 17 | `untrusted-client-authority.contract.test.ts` |
| multi-tenancy.md | Consolidation scope derivable from ownership inputs | 2 | `consolidation-scope-resolution.test.ts` |
| tip-007 (archive) | Context contracts back platform entity registry paths | 18 | `platform-entity-authority.contract.test.ts` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | All 10 required modules export documented primary types | `context-registry.test.ts` |
| Performance efficiency | Context contracts are serializable plain objects; consolidation derive is O(n) over investees | unit tests + code review |
| Compatibility | `KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES` stable count guarded by tests | `context-registry.test.ts` |
| Security | Untrusted client authority field detection; permission scope elevation flags defaulted | `untrusted-client-authority.contract.test.ts` |
| Maintainability | Biome clean; strict typecheck; surface gate enforces barrel | `typecheck`; `biome check packages/kernel` |
| Reliability | Deterministic consolidation scope derivation | `consolidation-scope-resolution.test.ts` |
| Documentation | Index + matrix aligned with FDR evidence | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Context projection (read path) | N/A — contracts only; mutations in domain packages | — |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-010-context-contracts**
- Registry: `PKG010_KERNEL` read-only snapshot in §Registry link
- Sibling (sequential): [`fdr-010-platform-authority`](%5BPartially%20Implemented%5D%20fdr-010-platform-authority.md) · [`fdr-010-master-data-authority`](%5BPartially%20Implemented%5D%20fdr-010-master-data-authority.md)
- Architecture: [`multi-tenancy.md`](../../architecture/multi-tenancy.md)
- Archive evidence: [`tip-007-erp-platform-authority.md`](../../delivery/tips/[Complete]%20tip-007-erp-platform-authority.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-010-context-contracts.md` | — | Modified per slice |
| `packages/kernel/src/context/` | `@afenda/kernel` | Modified (Implementation slices only) |
| `packages/kernel/dist/` | `@afenda/kernel` | Modified (Slice 2 — dist freshness for surface gate) |

## Acceptance gate

- `pnpm --filter @afenda/kernel typecheck`
- `pnpm quality:kernel-context-surface`
- `pnpm --filter @afenda/kernel test:run`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Kernel operating-context contract surface

  Scenario: Required context modules are registered and on disk
    GIVEN KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES in context-registry.ts
    WHEN context-registry.test.ts runs
    THEN every required module file exists under packages/kernel/src/context/
    AND each module's primaryType is exported from context/index.ts

  Scenario: Untrusted client authority fields are detectable
    GIVEN a wire payload with keys in UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS
    WHEN findUntrustedClientAuthorityFields is called
    THEN the offending keys are returned for rejection upstream

  Scenario: Consolidation scope derives from ownership wire inputs
    GIVEN branded ownership interest wire contexts and investee merge policy
    WHEN deriveConsolidationScopeContext runs
    THEN ConsolidationScopeContext reflects entity scopes and treatments
    AND consolidation-scope-resolution.test.ts assertions pass

  Scenario: Consumers must not deep-import kernel context paths
    GIVEN apps/erp, appshell, permissions, auth, and execution scan roots
    WHEN quality:kernel-context-surface runs with fresh dist
    THEN no file imports @afenda/kernel/src/ or @afenda/kernel/context/ subpaths
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/kernel test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/kernel typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/kernel` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix Kernel Execution Context row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | `untrusted-client-authority.contract.test.ts` | [x] |
| 18 | Public API compatibility verified | context barrel + export surface stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 1 — Research (context-contracts)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Medium  
**Clean Core impact:** A→A

**Purpose:** Reconcile runtime matrix **implemented** with FDR **Not started**; map 10 required modules, barrel exports, consumer scan roots, and gate baseline; update §Remaining gaps and §Enterprise readiness score. No source edits.

**Outcomes:**

- Closed gap `fdr-research-slice-1`
- Opened gap `kernel-context-dist-freshness`
- Status promoted to **Partially Implemented**
- Readiness score: 28/30 (evidence-backed)

### Slice 2 — Implementation (dist freshness + surface gate)

**Status:** Delivered (2026-06-26)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Outcomes

- Closed gap `kernel-context-dist-freshness`
- Added `ensureKernelDistFresh()` to `check-kernel-context-surface.mts` — runs `tsc -b` then `tsc -b --force` when incremental build leaves stale gitignored dist
- `pnpm quality:kernel-context-surface` exit 0
- Maintainability dimension 4/5 → 5/5; audit-adjusted total 27/30 → 28/30

#### Gate log (Slice 2 — 2026-06-26)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/kernel build` | 0 | A |
| `pnpm quality:kernel-context-surface` | 0 | A |
| `pnpm --filter @afenda/kernel typecheck` | 0 | A |
| `pnpm --filter @afenda/kernel test:run` | 0 | A |
| `scripts/governance/__tests__/check-kernel-context-surface.test.ts` | 0 | A (3 tests) |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

#### Design (internal-guide)

Close gap `kernel-context-dist-freshness` without mutating context contracts (Research Slice 1 confirmed src is complete). `dist/` is gitignored repo-wide — committed artifacts are out of scope. Wire standalone `check:kernel-context-surface` and `quality:kernel-context-surface` invocations to run `pnpm --filter @afenda/kernel build` first so the surface gate always evaluates fresh `dist/index.d.ts` and `dist/context/index.d.ts`. No `packages/kernel/src/context/` edits unless build exposes a pre-existing export defect. Recalculate §Enterprise readiness score Maintainability dimension to 5/5 when gate exits 0.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Wire kernel build before standalone context-surface gate scripts so `pnpm quality:kernel-context-surface` exits 0 without manual build; close gap `kernel-context-dist-freshness`.
2. Allowed layer— repo root `package.json` (gate script choreography); `scripts/governance/` (gate script + tests if needed); docs sync only — no `packages/kernel/src/context/` edits unless build fails on export defect
3. Files        —
   package.json
   scripts/governance/check-kernel-context-surface.mts
   scripts/governance/__tests__/check-kernel-context-surface.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — `foundation-disposition.registry.ts`; `do-not-create-accounting-package`; `do-not-implement-resolver-in-kernel`; `@afenda/accounting` (ADR-0010); committing `packages/kernel/dist/` (gitignored); apps/erp resolver edits; parallel PKG-010 slices on same runtimeOwner until this slice Delivered
5. Authority    — ADR-0014 · ADR-0016 · PKG010_KERNEL registry snapshot (§Registry link) · multi-tenancy.md Step 4
6. Gates        —
   pnpm --filter @afenda/kernel build
   pnpm quality:kernel-context-surface
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Gap `kernel-context-dist-freshness`; DoD #1 (surface gate Grade A); DoD #20 (readiness Maintainability uplift)
8. Evidence     —
   package.json
   scripts/governance/check-kernel-context-surface.mts
   packages/kernel/dist/index.d.ts
   packages/kernel/dist/context/index.d.ts
9. Attestation  — Maintainability (surface gate exit 0); Documentation (FDR + matrix sync); Contract stability (no public API change — build choreography only)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths (surface gate Grade A) | `pnpm quality:kernel-context-surface` |
| 20 | Enterprise readiness score updated (Maintainability 5/5 when gate green) | §Enterprise readiness score table |

#### Known debt

- `context-contracts-complete-status` — DoD #14 peer review still open; Complete promotion blocked until Architecture Authority PR approval
- `packages/kernel/dist/` remains gitignored — consumers and CI rely on build-before-gate choreography, not committed dist artifacts
- Sibling FDRs `fdr-010-platform-authority` and `fdr-010-master-data-authority` Slice 2 Evidence-sync unblocked (Delivered 2026-06-26)

### Slice 3 — PAS kernel-authority doc truth repair

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 2 Delivered ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Repair doc drift between PAS-001, kernel-authority SKILL, and `reference/package-structure.md`. Split Current vs Target acceptance; add PAS §9 rules 11–13; clarify pure derivation allowed vs data-loading resolver prohibited. No `packages/kernel/src/` edits.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Rewrite package-structure.md Current vs Target trees; split SKILL acceptance Current vs Target; add contract rules 11–13 and pure-derivation clarification; align implementation sequence (UomCode → Slice 6).
2. Allowed layer— docs-only: `.cursor/skills/kernel-authority/**`, optional PAS §11 sequence wording sync
3. Files        —
   .cursor/skills/kernel-authority/reference/package-structure.md
   .cursor/skills/kernel-authority/SKILL.md
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
4. Prohibited   — packages/kernel/src/**; package.json exports; @afenda/accounting (ADR-0010); foundation-disposition.registry.ts
5. Authority    — PAS-001 §6 · §9 · §11 · PKG010_KERNEL · ADR-0014
6. Gates        —
   pnpm quality:kernel-context-surface
   pnpm architecture:drift
   pnpm check:documentation-drift
7. Closes       — Gap `kernel-authority-doc-drift`; DoD #9
8. Evidence     —
   .cursor/skills/kernel-authority/reference/package-structure.md
   .cursor/skills/kernel-authority/SKILL.md
9. Attestation  — Documentation · Maintainability
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 9 | Drift green | `pnpm check:documentation-drift` |

#### Known debt

- Slice 4 (optional rename) deferred

### Slice 4 — consolidation-scope file rename (optional)

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 3 Delivered ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Rename `consolidation-scope-resolution.server.ts` → `consolidation-scope-resolution.ts` (pure TS, no server runtime). Update barrel, tests, governance required-export strings. Backward-compat: re-export alias optional one release.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Rename consolidation-scope-resolution.server.ts to consolidation-scope-resolution.ts and update all imports, context-registry, tests, and check-kernel-context-surface references.
2. Allowed layer— packages/kernel/src/context/**; packages/kernel/src/__tests__/**; scripts/governance/check-kernel-context-surface.mts
3. Files        —
   packages/kernel/src/context/consolidation-scope-resolution.ts
   packages/kernel/src/context/index.ts
   packages/kernel/src/context/context-registry.ts
   packages/kernel/src/__tests__/consolidation-scope-resolution.test.ts
   scripts/governance/check-kernel-context-surface.mts
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
4. Prohibited   — apps/erp/**; @afenda/accounting (ADR-0010); do-not-implement-resolver-in-kernel (data-loading only)
5. Authority    — PAS-001 · PKG010_KERNEL · multi-tenancy.md
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm quality:kernel-context-surface
   pnpm check:documentation-drift
7. Closes       — Gap `consolidation-scope-server-suffix-misleading`
8. Evidence     —
   packages/kernel/src/context/consolidation-scope-resolution.ts
   packages/kernel/src/__tests__/consolidation-scope-resolution.test.ts
9. Attestation  — Contract · Maintainability · Documentation
```

### Slice 5 — primitive brands + LocalizationContext

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 3 Delivered ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Add `LocaleCode`, `TimezoneId`, `DateFormat`, `NumberFormat`, `CurrencyCode`, `CountryCode`, `DocumentId`, `AssetId` to `platform-id.contract.ts`. Add `LocalizationContext` to `context/localization-context.contract.ts`. Export from root and context barrels. UomCode excluded (Slice 6).

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Add eight primitive branded IDs, brand/to helpers, LocalizationContext contract, context-registry support entry, barrel exports, and JSON-serialization tests.
2. Allowed layer— packages/kernel/src/contracts/platform-id.contract.ts; packages/kernel/src/context/localization-context.contract.ts; packages/kernel/src/context/index.ts; packages/kernel/src/context/context-registry.ts; packages/kernel/src/index.ts; packages/kernel/src/__tests__/platform-id.test.ts
3. Files        —
   packages/kernel/src/contracts/platform-id.contract.ts
   packages/kernel/src/context/localization-context.contract.ts
   packages/kernel/src/context/index.ts
   packages/kernel/src/context/context-registry.ts
   packages/kernel/src/index.ts
   packages/kernel/src/__tests__/platform-id.test.ts
   .cursor/skills/kernel-authority/reference/package-structure.md
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — UomCode (Slice 6); locale/currency/fiscal resolvers; apps/erp/**; @afenda/accounting (ADR-0010)
5. Authority    — PAS-001 §4.5 · §11 step 1–2 · PKG010_KERNEL
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm quality:kernel-context-surface
   pnpm quality:boundaries
   pnpm check:documentation-drift
7. Closes       — Gap `pas-primitive-brands`; Gap `pas-localization-context`
8. Evidence     —
   packages/kernel/src/contracts/platform-id.contract.ts
   packages/kernel/src/context/localization-context.contract.ts
   packages/kernel/src/__tests__/platform-id.test.ts
9. Attestation  — Contract · Test · TypeScript · Documentation
```

### Slice 6 — UomCode primitive (conditional)

**Status:** Not started — blocked on explicit PAS Architecture Authority approval  
**Prerequisite:** Slice 5 Delivered ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** A→A

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Add UomCode branded primitive and brand/to helpers to platform-id.contract.ts only after PAS confirms kernel owns code identity vocabulary — not UOM master rows, conversions, dimensions, stock rules, or manufacturing logic.
2. Allowed layer— packages/kernel/src/contracts/platform-id.contract.ts; packages/kernel/src/index.ts; packages/kernel/src/__tests__/platform-id.test.ts
3. Files        — (same as allowed layer + FDR sync)
4. Prohibited   — UOM master data; conversion logic; inventory/manufacturing packages; @afenda/accounting (ADR-0010)
5. Authority    — PAS-001 §4.5 UomCode note · Architecture Authority approval required
6. Gates        — pnpm --filter @afenda/kernel typecheck; pnpm --filter @afenda/kernel test:run; pnpm check:documentation-drift
7. Closes       — Gap `pas-uomcode-primitive`
8. Evidence     — packages/kernel/src/contracts/platform-id.contract.ts
9. Attestation  — Contract · Documentation
```

### Slice 7 — ProblemDetail RFC 9457 wire contract

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 5 Delivered ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Add problem-detail.contract.ts with RFC 9457-aligned ProblemDetail interface; export from root barrel; preserve AppError discriminated union and AppErrors.* factories unchanged; no HTTP status mapping in kernel.
2. Allowed layer— packages/kernel/src/contracts/**
3. Files        —
   packages/kernel/src/contracts/problem-detail.contract.ts
   packages/kernel/src/index.ts
   packages/kernel/src/__tests__/problem-detail.contract.test.ts
   .cursor/skills/kernel-authority/reference/authority-surfaces.md
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
4. Prohibited   — Modifying AppError union shape; HTTP status mapping; apps/erp/**; @afenda/accounting (ADR-0010)
5. Authority    — PAS-001 §4.2 ProblemDetail · PKG010_KERNEL
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm quality:boundaries
   pnpm check:documentation-drift
7. Closes       — Gap `pas-problem-detail-wire`
8. Evidence     —
   packages/kernel/src/contracts/problem-detail.contract.ts
   packages/kernel/src/__tests__/problem-detail.contract.test.ts
9. Attestation  — Contract · Test · Documentation
```

### Slice 8 — ExecutionContext traceId/spanId (kernel only)

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 7 Delivered ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Add optional readonly traceId and spanId (string | null) to ExecutionContext and ExecutionContextInput; update createExecutionContext; extend execution-context.test.ts — kernel only, no OpenTelemetry import, no apps/erp edits.
2. Allowed layer— packages/kernel/src/contracts/execution-context.contract.ts; packages/kernel/src/__tests__/execution-context.test.ts
3. Files        —
   packages/kernel/src/contracts/execution-context.contract.ts
   packages/kernel/src/__tests__/execution-context.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
4. Prohibited   — @afenda/observability; OpenTelemetry; apps/erp/**; @afenda/accounting (ADR-0010)
5. Authority    — PAS-001 §4.3 · PKG010_KERNEL
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm quality:boundaries
   pnpm check:documentation-drift
7. Closes       — Gap `pas-execution-trace-fields`
8. Evidence     —
   packages/kernel/src/contracts/execution-context.contract.ts
   packages/kernel/src/__tests__/execution-context.test.ts
9. Attestation  — Contract · Test · Observability (vocabulary only)
```

### Slice 9 — policy vocabulary subpath

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 8 Delivered ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Add src/policy/ with PolicyDecisionKind and PolicyDenialReason vocabulary types; register ./policy export in package.json; tests prove JSON-serializable literals.
2. Allowed layer— packages/kernel/src/policy/**; packages/kernel/package.json
3. Files        —
   packages/kernel/src/policy/policy-decision.contract.ts
   packages/kernel/src/policy/policy-denial-reason.contract.ts
   packages/kernel/src/policy/index.ts
   packages/kernel/package.json
   packages/kernel/src/__tests__/policy-vocabulary.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
4. Prohibited   — Permission evaluation logic; @afenda/permissions edits; @afenda/accounting (ADR-0010)
5. Authority    — PAS-001 §7 · PKG010_KERNEL
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm quality:boundaries
   pnpm quality:exports
   pnpm check:documentation-drift
7. Closes       — Gap `pas-policy-vocabulary`
8. Evidence     —
   packages/kernel/src/policy/index.ts
   packages/kernel/package.json
   packages/kernel/src/__tests__/policy-vocabulary.test.ts
9. Attestation  — Contract · Test · Documentation
```

### Slice 10 — json-wire + domain event envelope

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 9 Delivered ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** A→A

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Add json-wire.contract.ts (JsonPrimitive, JsonValue, JsonObject strict recursive); add src/events/domain-event.contract.ts with DomainEvent<TPayload extends JsonObject>; register ./events export; no event bus, outbox, or domain event name registry.
2. Allowed layer— packages/kernel/src/contracts/json-wire.contract.ts; packages/kernel/src/events/**; packages/kernel/package.json
3. Files        —
   packages/kernel/src/contracts/json-wire.contract.ts
   packages/kernel/src/events/domain-event.contract.ts
   packages/kernel/src/events/index.ts
   packages/kernel/package.json
   packages/kernel/src/index.ts
   packages/kernel/src/__tests__/json-wire.contract.test.ts
   packages/kernel/src/__tests__/domain-event.contract.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
4. Prohibited   — Event dispatch; outbox; @afenda/execution edits; @afenda/accounting (ADR-0010)
5. Authority    — PAS-001 §4.8–§4.9 · PKG010_KERNEL
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm quality:boundaries
   pnpm quality:exports
   pnpm check:documentation-drift
7. Closes       — Gap `pas-json-wire-types`; Gap `pas-domain-event-envelope`
8. Evidence     —
   packages/kernel/src/contracts/json-wire.contract.ts
   packages/kernel/src/events/domain-event.contract.ts
   packages/kernel/src/__tests__/domain-event.contract.test.ts
9. Attestation  — Contract · Test · Documentation
```

### Slice 11 — async context propagation

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 10 Delivered ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** A→A

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Add src/propagation/ with KernelContextFrame contract and kernelContext (run/get/fork) using AsyncLocalStorage; register ./propagation export; test concurrent fork isolation; frame holds ExecutionContext + tenantId + correlationId only.
2. Allowed layer— packages/kernel/src/propagation/**; packages/kernel/package.json
3. Files        —
   packages/kernel/src/propagation/kernel-context-frame.contract.ts
   packages/kernel/src/propagation/kernel-context.ts
   packages/kernel/src/propagation/index.ts
   packages/kernel/package.json
   packages/kernel/src/__tests__/kernel-context.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
4. Prohibited   — DB/session/permission/domain objects in frame; React/Next in frame; @afenda/accounting (ADR-0010)
5. Authority    — PAS-001 §4.10 · kernel-authority SKILL · PKG010_KERNEL
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm quality:boundaries
   pnpm quality:exports
   pnpm check:documentation-drift
7. Closes       — Gap `pas-async-propagation`
8. Evidence     —
   packages/kernel/src/propagation/kernel-context.ts
   packages/kernel/src/__tests__/kernel-context.test.ts
9. Attestation  — Contract · Test · Runtime safety · Maintainability
```

### Slice 12 — kernel enrichment governance scripts

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 11 Delivered ✓  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Add check-kernel-propagation-isolation.mts, check-kernel-events-wire-serializable.mts, check-kernel-zero-runtime-deps.mts under scripts/governance/; wire pnpm check:* and quality:* commands in root package.json.
2. Allowed layer— scripts/governance/**; package.json (root)
3. Files        —
   scripts/governance/check-kernel-propagation-isolation.mts
   scripts/governance/check-kernel-events-wire-serializable.mts
   scripts/governance/check-kernel-zero-runtime-deps.mts
   package.json
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
   .cursor/skills/kernel-authority/SKILL.md
4. Prohibited   — packages/kernel/src/** (unless gate script references only); @afenda/accounting (ADR-0010)
5. Authority    — PAS-001 §13 · PKG010_KERNEL gates
6. Gates        —
   pnpm check:kernel-propagation-isolation
   pnpm check:kernel-events-wire-serializable
   pnpm check:kernel-zero-runtime-deps
   pnpm check:documentation-drift
7. Closes       — Gap `pas-governance-scripts`
8. Evidence     —
   scripts/governance/check-kernel-propagation-isolation.mts
   scripts/governance/check-kernel-events-wire-serializable.mts
   scripts/governance/check-kernel-zero-runtime-deps.mts
   package.json
9. Attestation  — Maintainability · Documentation · Test (gate self-check)
```

### Slice 13 — LegalEntity currency/country brand migration (Integration)

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slice 5 Delivered ✓  
**Type:** Integration  
**Risk class:** Medium  
**Clean Core impact:** A→B (consumer wire field typing — compile-time only; runtime JSON unchanged)

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Migrate LegalEntityContext baseCurrency and countryCode from raw string to CurrencyCode and CountryCode brands; update apps/erp context loaders and kernel tests; preserve JSON wire compatibility at runtime (brands are string at runtime).
2. Allowed layer— packages/kernel/src/context/legal-entity-context.contract.ts; apps/erp/src/lib/context/** (loader mapping only)
3. Files        —
   packages/kernel/src/context/legal-entity-context.contract.ts
   packages/kernel/src/contracts/platform-id.contract.ts
   packages/kernel/src/index.ts
   packages/kernel/src/__tests__/accounting-readiness.contract.test.ts
   packages/kernel/src/__tests__/to-accounting-domain-context.test.ts
   apps/erp/src/lib/context/operating-context.mappers.ts
   apps/erp/src/lib/context/__tests__/legal-entity-test-fixtures.ts
   apps/erp/src/lib/api/__tests__/api-route-context.test.ts
   apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts
   apps/erp/src/lib/context/__tests__/context-switch.action.test.ts
   apps/erp/src/lib/permissions/__tests__/to-permission-check-context.server.test.ts
   apps/erp/src/lib/user-settings/__tests__/resolve-user-settings-context.test.ts
   apps/erp/src/lib/workspace/__tests__/to-workspace-api-scope.test.ts
   apps/erp/src/lib/modules/__tests__/module-route-test-fixtures.ts
   apps/erp/src/lib/workspace/__tests__/dashboard-rbac.fixture.ts
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
4. Prohibited   — Accounting posting; @afenda/accounting runtime (ADR-0010); resolver logic moves to ERP
5. Authority    — PAS-001 · PKG010_KERNEL · multi-tenancy.md
6. Gates        —
   pnpm --filter @afenda/kernel typecheck
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/kernel test:run
   pnpm quality:boundaries
   pnpm check:documentation-drift
7. Closes       — Gap `legal-entity-currency-country-raw-strings`
8. Evidence     —
   packages/kernel/src/context/legal-entity-context.contract.ts
   apps/erp/src/lib/context/operating-context.mappers.ts
   apps/erp/src/lib/context/__tests__/legal-entity-test-fixtures.ts
9. Attestation  — Contract · TypeScript · Boundary
```

### Slice 14 — PAS enrichment evidence sync

**Status:** Delivered (2026-06-27)  
**Prerequisite:** Slices 3–13 Delivered ✓  
**Type:** Evidence-sync  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Close delivered gap rows in §Remaining gaps; refresh runtime matrix and FDR verdict to reflect PAS §11 enrichment (106 tests, dist gate green, six subpath exports). No source edits.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md

1. Objective    — Sync FDR §Remaining gaps, §Enterprise benchmark qualification, §Verdict, runtime matrix kernel row, and fdr-status-index after Slices 3–13 delivery.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
   docs/architecture/afenda-runtime-truth-matrix.md
   docs/delivery/fdr-status-index.md
4. Prohibited   — packages/**; apps/**; foundation-disposition.registry.ts
5. Authority    — FDR evidence-sync · PKG010_KERNEL
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap rows for Slices 3–5, 7–13 (delivered); stale verdict dist-gate text
8. Evidence     —
   docs/delivery/FDR/[Partially Implemented] fdr-010-context-contracts.md
   docs/architecture/afenda-runtime-truth-matrix.md
9. Attestation  — Documentation · Maintainability
```

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert kernel dist/context commit; rebuild package | Quarterly-release-safe; no hand-edited registry objects |

Oracle analog: confirm upgrade-safe — contract-only changes outside resolver prohibition. SAP analog: transport rollback = git revert + gate re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `context-contracts-observability-read-path` | Audit event on context contract read | Serializable contracts only; audit at mutation surfaces | Architecture Authority (Research) | Phase 9 / observability FDR |
| `context-contracts-e2e` | Browser E2E for context contracts | 106 unit tests + surface gate prove barrel; E2E belongs to ERP context switch FDR | Architecture Authority | External beta go-live |
| `context-contracts-dist-gate-research` | DoD blocked on `quality:kernel-context-surface` during Research | Research is docs-only; dist freshness assigned to Slice 2 | Architecture Authority | Slice 2 complete |

## §Knowledge transfer

### Operational runbook

- Context registry authority: `packages/kernel/src/context/context-registry.ts`
- Public barrel: `packages/kernel/src/context/index.ts`
- Consolidation derive: `packages/kernel/src/context/consolidation-scope-resolution.ts` — `deriveConsolidationScopeContext`
- ERP resolver (consumer): `apps/erp/src/lib/context/` — not kernel

### Observability

- Context contracts are read-path types — no audit on serialization (waived)
- Untrusted client detection: `findUntrustedClientAuthorityFields` in `untrusted-client-authority.contract.ts`

### On-call escalation

- Symptom: `quality:kernel-context-surface` stale-dist → run `pnpm --filter @afenda/kernel build`; verify `dist/index.d.ts` timestamp
- Symptom: missing context type export → run `context-registry.test.ts`
- Owner: `@afenda/kernel` (PKG-010) via `kernel-context-agent`

## §Enterprise benchmark qualification

This FDR is **enterprise 9.5 candidate / evidence-qualified**, not final **Complete — enterprise 9.5 accepted**, because DoD #14 peer review remains open.

The **29/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. Browser E2E is waived until external beta go-live (`context-contracts-e2e`).
2. Context projection is a read path, so audit event emission on contract read is waived (`context-contracts-observability-read-path`).
3. Dist freshness closed — Slice 2 (2026-06-26) + Slice 14 build verification; `quality:kernel-context-surface` exit 0.
4. **Complete** status requires Architecture Authority peer review and waiver reconfirmation at PR merge.

The **28/30 audit-adjusted** score is the honest foundation-grade benchmark today (~9.3 / 10 equivalent): strong contract, test, and security evidence; PAS §11 enrichment Slices 3–13 delivered; capped by open peer review and waived E2E.

Until DoD #14 completes, this FDR must not be represented as fully **Complete** or as final **enterprise 9.5 accepted**.

**Promotion to Complete — enterprise 9.5 accepted requires:**

1. Architecture Authority peer review approval (DoD #14).
2. `pnpm quality:kernel-context-surface` exit 0 (verified Slice 14 — 2026-06-27).
3. Confirmation that §Waivers remain valid at merge time.
4. FDR filename/status/index promotion to `[Complete]`.

## Verdict

**Partially Implemented — enterprise 9.5 candidate / evidence-qualified at 28/30 audit-adjusted (29/30 ceiling), pending Architecture Authority peer review (DoD #14).**

PAS §11 enrichment Slices 3–13 Delivered (2026-06-27). v2 audit attests `typecheck` and `test:run` exit 0 (106 tests); `quality:kernel-context-surface` exit 0. Slice 6 (`UomCode`) remains blocked on PAS Architecture approval. Do not represent this FDR as **enterprise 9.5 complete** until peer review closes and status promotes to **Complete — enterprise 9.5 accepted**.
