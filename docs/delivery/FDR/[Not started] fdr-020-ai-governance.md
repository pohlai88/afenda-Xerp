# fdr-020-ai-governance — AI Governance

| Field | Value |
| --- | --- |
| **Status** | Not started |
| **FDR ID** | `fdr-020-ai-governance` |
| **Registry entry ID** | `—` (pending `foundation-registry-owner`; package active in [`package-registry.md`](../../architecture/package-registry.md)) |
| **Package** | `@afenda/ai-governance` (PKG-020) |
| **Lane** | blue-lane (platform governance — pending registry onboarding) |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | internal — AI-assisted development governance (ADR-0007) |
| **Enterprise readiness** | **22/30 audit-adjusted** · **28/30 evidence-qualified ceiling** — enterprise **9.5 candidate blocked** (registry + test fix pending; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` (entry pending) |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SOLMAN · SAP CEMLI · Oracle FDD · SAP namespace |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). **PKG-020 has no foundation-disposition entry yet** — onboard via `foundation-registry-owner`.

| Field | Value |
| --- | --- |
| id | `—` (target: `PKG020_AI_GOVERNANCE` or Architecture Authority assignment) |
| packageId | PKG-020 |
| domain | `ai-governance` |
| lane | blue-lane (proposed — platform governance) |
| runtimeOwner | `packages/ai-governance` |
| gates | `pnpm quality:ai-governance`; `pnpm --filter @afenda/ai-governance typecheck`; `pnpm --filter @afenda/ai-governance test:run` |
| prohibited | `do-not-duplicate-architecture-registry`; `do-not-add-erp-feature-code-in-governance-package` (proposed) |
| allowedAgents | `foundation-registry-owner`; fdr-slice-implementer (pending registry) |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/ai-governance` (PKG-020) | AI change validators, scope contracts, drift/suppression scans | `packages/ai-governance/src/` |
| `@afenda/architecture-authority` (PKG-019) | Upstream registry truth for AI-001/AI-002 delegation (read-only) | `packages/architecture-authority/src/` |
| Root scripts | CI scope + baseline orchestration | `scripts/quality/check-ai-governance.mjs` |
| Policy docs | Human-readable invariants | `docs/ai/ai-development-governance.md` |

## Purpose

Lock and maintain machine-enforced AI-assisted development governance — PR scope contracts (`.tip-scope.json`), AI invariants AI-001 through AI-010, baseline and scope validation modes, and CI integration — so AI agents cannot bypass architecture authority, introduce unscoped changes, or add unsafe suppressions without ADR-backed expansion.

Authority: [ADR-0007](../../adr/ADR-0007-ai-development-governance.md) · [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-001-architecture-authority.md`](../../delivery/tips/[Complete]%20tip-001-architecture-authority.md) (TIP-002 section) · [`docs/ai/ai-development-governance.md`](../../ai/ai-development-governance.md).

## Scope

**In scope**

- `packages/ai-governance/src/validators/` — `validateAiGovernance`, boundaries, change gates, drift, prompts
- `packages/ai-governance/src/contracts/` — change, boundary, drift, review contracts
- `packages/ai-governance/src/policies/` — invariant policies AI-001 through AI-010
- `packages/ai-governance/src/reports/ai-governance-report.ts` — structured validation output
- Tests: `validate-ai-governance.test.ts`, `glob.test.ts`
- Gates: `pnpm quality:ai-governance` (baseline + `--scope .tip-scope.json` on PRs)
- Policy surface: `docs/ai/` aligned with ADR-0007

**Out of scope**

- Runtime AI inference in ERP or production LLM endpoints
- Parallel architecture registries (delegates to `@afenda/architecture-authority`)
- Accounting runtime (ADR-0010)
- Registry authoring (`foundation-registry-owner` only)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `packages/ai-governance/**` per slice Field 3 |
| Shared constants | AI invariants owned in contracts/policies — no duplicate AI-00x rules in scripts |
| Evidence output | Gate exit 0 + test paths required — not prose-only claims |
| Parallel PKG-020 | **Serial** with PKG-019 architecture gate changes that alter workspace discovery |
| Implementation blocked until | Research Slice 1 complete; PKG-020 registry entry onboarded |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 = Research only — no validator logic edits unless a later Implementation slice authorizes.  
> Runtime matrix marks **AI Governance implemented** — reconcile with FDR **Not started**.

### Discovery questions

| Question | Expected output |
| --- | --- |
| Does `pnpm quality:ai-governance` exit 0 in baseline mode? | Baseline gate log |
| Does `pnpm --filter @afenda/ai-governance test:run` exit 0? | Test count + failure analysis |
| Which AI invariant tests cover negative paths (AI-004, AI-010)? | Test matrix |
| Is PKG-020 disposition entry required before Complete? | Registry-sync plan |
| Does scope mode with `.tip-scope.json` pass on a sample PR? | Scope gate log |

### Files to inspect

| Path | Why |
| --- | --- |
| `packages/ai-governance/src/validators/validate-ai-governance.ts` | Orchestrator entry point |
| `packages/ai-governance/src/__tests__/validate-ai-governance.test.ts` | Invariant coverage (10 tests) |
| `scripts/quality/check-ai-governance.mjs` | Root CI gate (baseline + scope) |
| `docs/ai/ai-development-governance.md` | Human invariant table |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | AI Governance row |
| [ADR-0007](../../adr/ADR-0007-ai-development-governance.md) | Acceptance gate authority |

### Skills to read

- `enterprise-erp-standards` — §2 gate mapping, §8 domain controls, §10 Clean Core
- `write-fdr` — registry-first discipline

### ADR-0007 + matrix reconciliation (Research Slice 1 — 2026-06-25)

| Authority | Status | Reconciliation |
| --- | --- | --- |
| [ADR-0007](../../adr/ADR-0007-ai-development-governance.md) | **Accepted** | Package, invariants, CI gates, and `.tip-scope.json` contract match runtime — no ADR drift |
| Runtime matrix AI Governance row | **implemented** | Baseline + scope CI gates exit 0; package exists with validators + tests |
| FDR delivery status | **Not started** (Research Slice 1 ✓) | Runtime precedes FDR evidence — matrix **implemented** is correct; FDR remains **Not started** until registry onboard (Slice 2), test fix (Slice 3), and Evidence-sync (Slice 4) |

**Rule:** Do not downgrade matrix to **partial** while baseline CI passes. Do not promote FDR to **Partially Implemented** until Slice 2 registry entry exists and Slice 3 closes `ai-gov-test-tip002-pass`.

### Baseline + scope gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade | Notes |
| --- | ---: | --- | --- |
| `pnpm check:documentation-drift` | 0 | A | `documentation-drift-guard-is-canonical-stale-marker-enforcement` |
| `pnpm check:foundation-disposition` | 0 | A | Registry PASS (PKG-020 entry still absent — expected) |
| `pnpm quality:boundaries` | 0 | A | 22 workspaces checked |
| `pnpm quality:ai-governance` | 0 | A | Baseline; fingerprint `AI-GOV-BASELINE-2026-06-20-v1` |
| `pnpm quality:ai-governance -- --scope .tip-scope.json` | 0 | A | Scope mode; same fingerprint — closes `ai-gov-scope-pr-proof` |
| `pnpm --filter @afenda/ai-governance typecheck` | 0 | A | `tsc -b` + vitest tsconfig |
| `pnpm --filter @afenda/ai-governance test:run` | 1 | C | 38 passed / 39 total — 1 TIP-002-shaped pass failure |
| `pnpm quality:architecture` | 0 | A | Delegated AI-001/AI-002; fingerprint `ARCH-BASELINE-2026-06-23-v2`; 22 workspaces |

### TIP-002-shaped pass test — root cause (escalated to Slice 3)

| Field | Value |
| --- | --- |
| Test | `validate-ai-governance.test.ts` → `"passes for a valid TIP-002-shaped change"` |
| Assertion | `expect(result.ok).toBe(true)` — received `false` |
| Primary invariant | **AI-001** (delegated registry gate) |
| Mechanism | `validateAiChangeGates` → `validateArchitectureDelegation` → `validateArchitecture(context.workspaces)` runs on the **full** `baselineWorkspaces()` mock even in **scope** mode |
| Registry gap | Mock fixture omits `@afenda/accounting` (`PKGR01_ACCOUNTING`, `filesystemRequired: true` since fdr-r01 onboarding) — `validateRegistry` emits *registered package missing from filesystem* |
| Secondary risk | Mock dependency edges may drift from `package-registry.data.ts` → additional **AI-002** failures if fixture expanded without syncing approved edges |
| Production CI | Unaffected — `check-ai-governance.mjs` discovers real workspaces (22 packages incl. accounting); baseline + scope gates exit 0 |
| Slice 3 fix | Add `@afenda/accounting` to `baselineWorkspaces()` **or** import canonical workspace discovery from `@afenda/architecture-authority`; re-run `test:run` until exit 0 |

### AI invariant test coverage matrix (Research Slice 1)

| Invariant | Negative path tested | Pass path tested | Test file |
| --- | --- | --- | --- |
| AI-001 | ✓ unregistered package | — (blocked by fixture gap) | `validate-ai-governance.test.ts` |
| AI-002 | ✓ unapproved dependency | — (delegated; baseline CI covers) | same |
| AI-003 | ✓ forbidden directory suffix | — | same |
| AI-004 | ✓ out-of-scope file; ✓ empty manifest fields via prompts | ✓ scope paths in TIP-002 scenario (subsumed by failing pass test) | same + `validate-ai-prompts.ts` |
| AI-004-SCOPE | ✓ broad glob without `scopeExpansionAdr` | — | same + `glob.test.ts` |
| AI-005 | — | — | `validate-ai-boundaries.ts` only |
| AI-006 | ✓ private import | ✓ declared + wildcard export subpaths | same |
| AI-007 | — | ✓ non-empty `adr` in `baseScope()` | prompts validator (implicit in pass test) |
| AI-008 | — | ✓ paired test file in TIP-002 scenario | `validateTestCoverage` (implicit in pass test) |
| AI-009 | — | — | `validateDeletions` only |
| AI-010 | ✓ `@ts-ignore` on changed line | — | same + `validate-ai-drift.ts` |

**Security discovery (Grade B):** AI-004 denial (out-of-scope path) and AI-010 denial (unsafe suppression on changed line) have explicit negative unit tests. AI-004-SCOPE broad-glob denial covered. DoD #17 remains open until Slice 3 pass test proves combined happy path.

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Package root | `packages/ai-governance/` | Yes — Grade B (matrix **implemented**) |
| Public API | `packages/ai-governance/src/index.ts` | Yes — Grade B (curated exports) |
| Governance orchestrator | `packages/ai-governance/src/validators/validate-ai-governance.ts` | Yes — Grade B (9/10 unit scenarios pass) |
| Invariant tests | `packages/ai-governance/src/__tests__/validate-ai-governance.test.ts` | Partial — Grade C (1 failed: TIP-002-shaped pass — manifest-nav v2 audit confirmed) |
| Glob utilities | `packages/ai-governance/src/__tests__/glob.test.ts` | Yes — Grade A (29 tests pass) |
| CI baseline gate | `pnpm quality:ai-governance` | Yes — Grade A (exit 0; fingerprint `AI-GOV-BASELINE-2026-06-20-v1`) |
| TypeScript strict | `pnpm --filter @afenda/ai-governance typecheck` | Yes — Grade A (exit 0) |
| Policy docs | `docs/ai/ai-development-governance.md` | Yes — Grade B (ADR-0007 aligned) |
| Foundation disposition entry | `foundation-disposition.registry.ts` | No — Grade E (PKG-020 missing) |

## §Remaining gaps

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| ~~`fdr-research-slice-1`~~ | ~~FDR Not started — archive TIP-002 / matrix not reconciled~~ | blue | fdr-slice-implementer | Slice 1 | **Closed** — baseline + scope gate logs; ADR/matrix reconciliation; readiness score |
| `pkg020-registry-onboard` | PKG-020 lacks foundation-disposition entry | blue | `foundation-registry-owner` | Slice 2 | `PKG020_*` entry with gates |
| `ai-gov-test-tip002-pass` | `validate-ai-governance.test.ts` TIP-002-shaped pass scenario fails — **AI-001 fixture missing `@afenda/accounting`** | blue | Implementation Slice 3 | Slice 3 | `test:run` exit 0 |
| ~~`ai-gov-scope-pr-proof`~~ | ~~Scope mode exit log not captured in FDR evidence~~ | blue | Research Slice 1 | Slice 1 | **Closed** — scope mode exit 0 (2026-06-25) |

## §Enterprise readiness score

> **Hard cap:** Missing registry entry limits rating to **22/30 maximum** per ENTERPRISE-BENCHMARK §3.1 until `foundation-registry-owner` onboards PKG-020.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + typed contracts — Grade A | — |
| Test coverage | 3/5 | 38/39 tests pass; 1 failure — Grade B | DoD #2 blocked until fix |
| Observability + audit | 3/5 | `buildAiGovernanceReport` + CI gate — Grade B | No production audit events |
| Security + RBAC + RLS | 4/5 | AI-004 scope + AI-010 suppression + AI-006 export paths — Grade B | N/A for tenant RLS (tooling package) |
| Documentation + BRD traceability | 4/5 | `docs/ai/` + FDR + `check:documentation-drift` exit 0 — Grade A | Research open |
| Maintainability + Clean Core | 4/5 | Clean Core A; delegates AI-001/002 to architecture-authority — Grade A | Registry entry pending |
| **Total (audit-adjusted)** | **22/30** | Hard cap — missing registry entry (ENTERPRISE-BENCHMARK §3.1) | |
| **Total (evidence-qualified ceiling)** | **28/30** | After registry + test fix + Research + peer review | Not final 9.5 |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level A** — validators delegate architecture truth to `@afenda/architecture-authority`; AI invariants are contract-owned; no parallel package registry.

**Rule: governance tooling must remain Clean Core A.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| CI / `pnpm quality` | `quality:ai-governance` script | Yes if validator rules tighten | A→A |
| All PR authors | `.tip-scope.json` scope contract | Yes if scope validation fails | A→A |
| `@afenda/architecture-authority` | Workspace discovery + export maps (read) | No | A→A |
| Agent tooling | Validators via built `dist/` | Yes if public API changes | A→A |

**ERP giant compatibility:**

- **Scale:** Baseline mode scans all workspace source files; scope mode validates only PR diff — O(changed files) per CI run.
- **Integration proof:** `quality:ai-governance` in root `pnpm quality`, CI, preview verification, release verification per ADR-0007.
- **Delegation:** AI-001/AI-002 do not duplicate dependency registry — single architecture authority.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SAP namespace | CEMLI extension registry | `pnpm quality:architecture` (delegated AI-001) | 3 |
| SAP ATC | Oracle FDD contract stability | `pnpm --filter @afenda/ai-governance typecheck` | 4 |
| SOLMAN | Documentation drift | `pnpm check:documentation-drift` | 9 |
| Oracle SoD | Change scope enforcement | `pnpm quality:ai-governance -- --scope .tip-scope.json` | 17 |

## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | AI invariants AI-001 through AI-010 enforced | 2 | `pnpm --filter @afenda/ai-governance test:run` |
| internal | Baseline governance scan passes in CI | 1 | `pnpm quality:ai-governance` |
| internal | PR changes stay within declared scope | 17 | scope mode gate |
| ADR-0007 | Package builds, tests, and quality gate pass | 1, 2 | ADR acceptance gate |
| tip-001 (archive) | TIP-002 AI governance spine active | 18 | validate-ai-governance exports |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Validators reject out-of-scope, unapproved deps, unsafe suppressions | validate-ai-governance.test.ts |
| Performance efficiency | Baseline scan completes within CI budget | quality chain timing |
| Compatibility | Fingerprint bumps coordinated with policy changes | `AI_GOVERNANCE_FINGERPRINT` |
| Security | Scope expansion requires ADR-backed `scopeExpansionAdr` | AI-004-SCOPE tests |
| Maintainability | Single package authority; delegates registry checks | Clean Core A |
| Reliability | Deterministic validation for same inputs | unit tests |
| Documentation | `docs/ai/` + FDR aligned with runtime | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Validator rule tightening | Architecture Authority PR approval | DoD #14 |
| Scope expansion (broad globs) | ADR Accepted + `scopeExpansionAdr` in manifest | AI-004-SCOPE validator |
| Foundation disposition edit | `foundation-registry-owner` only | registry PR review |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-020-ai-governance**
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-020**
- [ADR-0007](../../adr/ADR-0007-ai-development-governance.md) — primary domain authority
- Upstream: `@afenda/architecture-authority` (PKG-019) for AI-001/AI-002 delegation
- Registry entry: `foundation-registry-owner` (blocks Complete)
- Archive: [`tip-001-architecture-authority.md`](../../delivery/tips/[Complete]%20tip-001-architecture-authority.md) (TIP-002 section)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-020-ai-governance.md` | — | Modified per slice |
| `packages/ai-governance/src/**` | `@afenda/ai-governance` | Modified (Implementation slices only) |
| `docs/ai/**` | — | Modified (Evidence-sync if policy drift) |
| `foundation-disposition.registry.ts` | PKG-020 | Modified by `foundation-registry-owner` only |

## Acceptance gate

- `pnpm --filter @afenda/ai-governance typecheck`
- `pnpm --filter @afenda/ai-governance test:run`
- `pnpm quality:ai-governance`
- `pnpm quality:ai-governance -- --scope .tip-scope.json` (PR scope proof)
- `pnpm quality:architecture` (delegated invariant dependency)
- `pnpm check:foundation-disposition`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
Feature: AI-assisted development governance

  Scenario: Baseline governance scan passes
    GIVEN all workspace packages are discoverable via @afenda/architecture-authority
    WHEN pnpm quality:ai-governance runs in baseline mode
    THEN exit code is 0
    AND fingerprint AI-GOV-BASELINE-2026-06-20-v1 is reported
    AND no AI-001 through AI-010 violations are emitted

  Scenario: PR scope contract blocks out-of-scope file changes
    GIVEN a .tip-scope.json manifest with allowedPaths and forbiddenPaths
    AND git diff includes a file outside allowedPaths
    WHEN pnpm quality:ai-governance runs with --scope .tip-scope.json
    THEN exit code is non-zero
    AND violation AI-004 is reported for the out-of-scope path

  Scenario: New unsafe suppressions on changed lines are rejected
    GIVEN scope mode with changed lines containing a new biome-ignore or eslint-disable
    WHEN validateAiGovernance runs with changedLines populated
    THEN result.ok is false
    AND violation AI-010 references the changed line

  Scenario: Architecture delegation avoids duplicate registry authority
    GIVEN AI-001 unregistered package detection
    WHEN validateAiBoundaries delegates to architecture-authority workspace rules
    THEN no parallel package registry exists in @afenda/ai-governance
    AND architecture-authority remains single source of truth
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | validators + CI script | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/ai-governance test:run` | [ ] |
| 3 | Boundaries | `pnpm quality:architecture` (delegated) | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/ai-governance typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/ai-governance` | [ ] |
| 6 | Registry aligned | PKG-020 disposition entry valid | [ ] |
| 7 | Runtime matrix updated | AI Governance row reconciled | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [ ] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR complete | [x] |
| 12 | Impact analysis complete | §Impact analysis filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | Architecture Authority PR approval | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core | [x] |
| 16 | No duplicated registry constants | delegates to architecture-authority | [ ] |
| 17 | Security negative path tested | AI-004 + AI-010 denial tests | [ ] |
| 18 | Public API compatibility verified | `@afenda/ai-governance` exports stable | [ ] |
| 19 | E2E requirement satisfied or waived | N/A — CI validators | [ ] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | [x] |

## Slices

### Slice 1 — Research (ai-governance baseline)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** A→A

#### Design (internal-guide)

Reconcile runtime matrix **implemented** AI Governance row + ADR-0007 **Accepted** with FDR **Not started** status. Capture baseline and scope-mode gate logs (read-only), document TIP-002-shaped pass test failure root cause, map AI-001 through AI-010 test coverage matrix, and produce initial §Enterprise readiness score — **no validator or policy source edits**.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Not started] fdr-020-ai-governance.md

1. Objective    — Reconcile ADR-0007 + runtime matrix with FDR status; capture baseline and scope gate logs; document TIP-002-shaped test failure root cause; produce readiness score for Slice 2 unblock.
2. Allowed layer— docs-only (`docs/delivery/FDR/`, `docs/delivery/fdr-status-index.md`, `docs/architecture/afenda-runtime-truth-matrix.md`)
3. Files        —
   docs/delivery/FDR/[Not started] fdr-020-ai-governance.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — `packages/` source edits; `apps/` source edits; `scripts/` source edits; `foundation-disposition.registry.ts`; `do-not-duplicate-architecture-registry`; `do-not-add-erp-feature-code-in-governance-package`
5. Authority    — ADR-0007 · ADR-0014 · ADR-0016 · [`docs/ai/ai-development-governance.md`](../../ai/ai-development-governance.md)
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
   pnpm quality:boundaries
   pnpm quality:ai-governance (read-only baseline — report exit code and fingerprint)
   pnpm quality:ai-governance -- --scope .tip-scope.json (read-only baseline — report exit code)
   pnpm --filter @afenda/ai-governance typecheck (read-only baseline — report exit code)
   pnpm --filter @afenda/ai-governance test:run (read-only baseline — report exit code and failure scenario)
   pnpm quality:architecture (read-only baseline — delegated AI-001/002 — report exit code)
7. Closes       — Gap `fdr-research-slice-1`; Gap `ai-gov-scope-pr-proof`; DoD #1, #7, #8, #20 (initial score); escalate Gap `ai-gov-test-tip002-pass` to Slice 3
8. Evidence     —
   packages/ai-governance/src/validators/validate-ai-governance.ts
   packages/ai-governance/src/__tests__/validate-ai-governance.test.ts
   packages/ai-governance/src/__tests__/glob.test.ts
   scripts/quality/check-ai-governance.mjs
   docs/ai/ai-development-governance.md
   .tip-scope.json
9. Attestation  — Documentation (FDR gate log Grade A); Contract stability (typecheck Grade A); Test coverage baseline (38/39 pass — 1 TIP-002 failure documented); Security discovery (AI-004/AI-010 negative paths Grade B)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | validators + CI script |
| 7 | Runtime matrix updated | AI Governance row |
| 8 | fdr-status-index updated | index row |
| 20 | Enterprise readiness score updated | §Enterprise readiness score initial (22/30 audit-adjusted — hard cap) |

#### Known debt

- `ai-gov-test-tip002-pass` deferred to Slice 3 Implementation — blocks DoD #2
- `pkg020-registry-onboard` deferred to Slice 2 Registry-sync
- Hard cap 22/30 until PKG-020 disposition entry (ENTERPRISE-BENCHMARK §3.1)
- Serial with PKG-019 architecture gate changes that alter workspace discovery

### Slice 2 — Registry-sync (PKG-020 entry)

**Status:** Not started  
**Prerequisite:** Slice 1 Complete  
**Type:** Registry-sync  
**Risk class:** Low  

**Purpose:** Onboard `PKG020_AI_GOVERNANCE` via `foundation-registry-owner` with gates aligned to §Acceptance gate.

### Slice 3 — Implementation (validator closeout)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Implementation  
**Risk class:** Low  
**Clean Core impact:** A→A

**Purpose:** Fix failing TIP-002-shaped pass test; ensure `test:run` exit 0; no ERP feature code.

### Slice 4 — Evidence-sync (FDR + matrix)

**Status:** Not started  
**Prerequisite:** Slice 3 Complete  
**Type:** Evidence-sync  

**Purpose:** Recalculate §Enterprise readiness score; sync FDR evidence with gate output; update matrix row if proven.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Registry-sync | Revert registry commit via `foundation-registry-owner` | Fingerprint reversal |
| Implementation | Revert validator/test commit | Git revert + `pnpm quality:ai-governance` |
| Scope manifest | Restore prior `.tip-scope.json` | ADR if broadening scope |

Oracle analog: confirm upgrade-safe — no ERP runtime objects modified. SAP analog: transport rollback = git revert + quality chain re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| _(none yet)_ | — | — | — | — |

## §Knowledge transfer

### Operational runbook

- Baseline scan: `pnpm quality:ai-governance`
- PR scope validation: `pnpm quality:ai-governance -- --scope .tip-scope.json`
- Package tests: `pnpm --filter @afenda/ai-governance test:run`
- Invariant reference: `docs/ai/ai-development-governance.md`
- Scope manifest: `.tip-scope.json` at repo root (required per PR per ADR-0007)

### Observability

- CI failure on `quality:ai-governance` blocks merge
- Structured report: `buildAiGovernanceReport()` in validation output
- Fingerprint: `AI_GOVERNANCE_FINGERPRINT` in `ai-drift.contract.ts`

### On-call escalation

- Symptom: scope gate fails unexpectedly → verify `.tip-scope.json` allowedPaths cover all changed files
- Symptom: AI-010 false positive → check changed-line mode vs baseline mode
- Symptom: AI-001/002 failure → fix in architecture-authority registries, not local duplicates
- Owner: Architecture Authority / PKG-020

## §Enterprise benchmark qualification

This FDR is **Not started — enterprise 9.5 candidate blocked**, not final **Complete — enterprise 9.5 accepted**, because PKG-020 lacks a foundation-disposition entry and `test:run` exits **1** (TIP-002-shaped pass scenario).

The **28/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. `foundation-registry-owner` onboards `PKG020_AI_GOVERNANCE` with gates aligned to §Acceptance gate.
2. Implementation Slice 3 fixes gap `ai-gov-test-tip002-pass` — `test:run` exit 0.
3. Baseline `quality:ai-governance` remains exit 0 (verified **2026-06-25** — Grade A).
4. **Complete** status requires Architecture Authority peer review (DoD #14).

The **22/30 audit-adjusted** score reflects strong baseline CI evidence capped by missing registry entry (hard cap 22/30 per ENTERPRISE-BENCHMARK §3.1) and one failing unit test.

Until Research Slice 1 closes and the failing test is fixed, this FDR must not be represented as **Partially Implemented** despite matrix **implemented** status.

## Verdict

**Not started — enterprise 9.5 FDR at 22/30 audit-adjusted (28/30 ceiling). Research Slice 1 ✓ complete; Slice 2 registry onboard and Slice 3 test fix remain blockers.**

Research Slice 1 (2026-06-25): all Field 6 gates captured; baseline + scope `quality:ai-governance` exit 0; `test:run` exit 1 (TIP-002 fixture missing `@afenda/accounting` → AI-001). PKG-020 lacks foundation-disposition entry — hard cap 22/30 until Slice 2.
