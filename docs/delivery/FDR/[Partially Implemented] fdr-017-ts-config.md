# fdr-017-ts-config — TypeScript Config

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-017-ts-config` |
| **Registry entry ID** | `PKG017_TS_CONFIG` |
| **Package** | `@afenda/typescript-config` (PKG-017) |
| **Lane** | blue-lane (tooling — `PKG017_TS_CONFIG`) |
| **Clean Core level** | A ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Configuration |
| **Risk class** | Low |
| **BRD reference** | internal — shared TS compiler presets |
| **Enterprise readiness** | **23/30 audit-adjusted** · **23/30 evidence-qualified ceiling** — enterprise **9.5 blocked** (e2e tsconfig drift; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` (`PKG017_TS_CONFIG`) |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SAP ATC · Oracle quality standards · ISO 25010 maintainability |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). **PKG-017 is `active-exempt`:** exempt from layer-dependency enforcement only; remains registered and owned per [`package-registry.md`](../../architecture/package-registry.md).

| Field | Value |
| --- | --- |
| id | `PKG017_TS_CONFIG` |
| packageId | PKG-017 |
| domain | `ts-config` |
| lane | blue-lane |
| runtimeOwner | `packages/typescript-config` |
| gates | `pnpm typecheck`, `pnpm quality:boundaries` |
| prohibited | `do-not-inherit-baseurl-from-typescript-config-package`, `do-not-enforce-layer-dependency-on-typescript-config`, `do-not-create-accounting-package` |
| allowedAgents | `foundation-registry-owner`, `fdr-slice-implementer` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/typescript-config` (PKG-017) | Shared TS JSON presets (strict, Next.js, React library, paths) | `packages/typescript-config/*.json` |
| All active packages/apps | Consumers extend presets via local `tsconfig.json` | `**/tsconfig.json` (read-only in Research) |

## Purpose

Lock and maintain shared TypeScript compiler presets for the Afenda monorepo — strict mode baselines, Next.js app configs, React library configs, and path-mapping templates — so every package inherits consistent compiler discipline without duplicating `compilerOptions`.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

**`active-exempt` rule:** PKG-017 is exempt from layer-dependency graph enforcement only; it is not exempt from ownership, documentation, or FDR delivery.

## Scope

**In scope**

- `packages/typescript-config/base.json` — shared strict baseline
- `packages/typescript-config/strict-*.json` — strict variants (node, next, react-library, final)
- `packages/typescript-config/nextjs.json`, `node.json`, `react-library.json`
- `packages/typescript-config/paths-app.json`, `paths-package.json` — **copy** `compilerOptions` into local tsconfig (baseUrl must be local)
- `packages/typescript-config/test.json` — vitest/tsconfig test preset
- Consumer `extends` wiring audit (Research)

**Out of scope**

- Runtime business logic
- Per-package path alias values (owned locally)
- ESLint/Biome config (separate governance)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may create `PKG017_*` registry entry |
| Package boundary | Implementation agent may edit only `packages/typescript-config/` JSON presets |
| Shared constants | No agent may duplicate strict compiler flags outside typescript-config |
| Evidence output | Agents must output gate exit 0 from `pnpm typecheck` — not prose-only claims |
| Parallel PKG-017 | **Sequential** with `fdr-016-test-utilities` when touching shared tsconfig paths |
| Implementation blocked until | Research Slice 1 complete; registry entry onboarded ✓; Slice 3 for e2e drift |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 = Research only — no preset JSON edits unless slice authorizes.  
> Runtime matrix lists `@afenda/typescript-config` as **Config** export map — verify all active packages extend correct preset.

### Discovery questions

| Question | Expected output |
| --- | --- |
| Which presets do active packages extend? | Consumer extends audit table |
| Are any packages using non-strict compiler options? | Drift report |
| Is `baseUrl` correctly local in every consumer? | paths-app/paths-package compliance check |
| Which registry row is required? | `PKG017_*` entry proposal |

### Files to inspect

| Path | Why |
| --- | --- |
| `packages/typescript-config/*.json` | Preset authority |
| `packages/typescript-config/package.json` | Exports map + baseUrl documentation |
| `**/tsconfig.json` (sample) | Consumer extends patterns |
| [`package-registry.md`](../../architecture/package-registry.md) | `active-exempt` definition |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | PKG-017 inventory row |

### Skills to read

- `enterprise-erp-standards` — §10 Clean Core for tooling packages
- `write-fdr` — 25-section template

### Matrix reconciliation (Research Slice 1 — 2026-06-25)

| Matrix row | Matrix status | FDR status | Reconciliation |
| --- | --- | --- | --- |
| TypeScript config | **implemented** | Partially Implemented | Research Slice 1 complete; consumer audit Grade A; registry onboarding deferred Slice 2 |

### Consumer extends audit (Research Slice 1 — 2026-06-25)

All **22 active workspaces** from [`package-registry.md`](../../architecture/package-registry.md) inspected (read-only). Primary `tsconfig.json` (or app-equivalent) per package:

| Registry ID | Package | Primary config | Extends preset | `baseUrl` local | Strict flags duplicated? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| PKG-001 | `@afenda/appshell` | `tsconfig.json` | `strict-react-library.json` | Yes (`.`) | No | — |
| PKG-002 | `@afenda/auth` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-003 | `@afenda/database` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-004 | `@afenda/design-system` | `tsconfig.json` | `strict-react-library.json` | N/A | No | — |
| PKG-005 | `@afenda/docs` | `tsconfig.json` | `nextjs.json` | Yes (`.`) | No | paths copied locally |
| PKG-006 | `@afenda/entitlements` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-007 | `@afenda/erp` | `tsconfig.json` | `nextjs.json` | Yes (`.`) | No | paths copied locally |
| PKG-021 | `@afenda/storybook` | `tsconfig.storybook.json` | `base.json` | Yes (`.`) | Partial | No root `tsconfig.json`; uses `base.json` not `strict-next.json`; `exactOptionalPropertyTypes: false` local override |
| PKG-008 | `@afenda/execution` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-009 | `@afenda/feature-flags` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-010 | `@afenda/kernel` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-011 | `@afenda/metadata` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-012 | `@afenda/metadata-ui` | `tsconfig.json` | `strict-react-library.json` | N/A | No | stories chain via `ui/tsconfig.stories.json` |
| PKG-013 | `@afenda/observability` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-014 | `@afenda/permissions` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-015 | `@afenda/storage` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-016 | `@afenda/testing` | `tsconfig.json` | `strict-react-library.json` | N/A | No | — |
| PKG-017 | `@afenda/typescript-config` | — | authority | N/A | N/A | **active-exempt**; 11 JSON presets; no consumer |
| PKG-018 | `@afenda/ui` | `tsconfig.lib.json` | `strict-react-library.json` | Yes (`.`) | No | `tsconfig.json` chains to lib |
| PKG-019 | `@afenda/architecture-authority` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-020 | `@afenda/ai-governance` | `tsconfig.json` | `strict-node.json` | N/A | No | — |
| PKG-R01 | `@afenda/accounting` | `tsconfig.json` | `strict-node.json` | N/A | No | — |

**Auxiliary configs (non-primary, documented debt):**

| Config | Extends | Drift |
| --- | --- | --- |
| `apps/erp/tsconfig.playwright.json` | `base.json` | Acceptable — Playwright auxiliary |
| `apps/erp/e2e/tsconfig.json` | *(none — standalone)* | **Debt** — local `strict: true` only; no `@afenda/typescript-config` extends (Slice 3 candidate) |
| `packages/ui/tsconfig.stories.json` | `base.json` | Acceptable — Storybook path map; `baseUrl` local |
| `packages/*/tsconfig.vitest.json` | chains primary | Acceptable — inherits governed preset via primary |

**Preset adoption summary:** 21/21 consumers extend `@afenda/typescript-config` on primary config. 1 auxiliary config (`e2e/tsconfig.json`) is standalone — tracked as implementation debt, not blocking Research closeout.

**`active-exempt` rule (PKG-017):** Exempt from layer-dependency enforcement only; remains registered, owned, and documented per [`package-registry.md`](../../architecture/package-registry.md) §Active Registry. Confirmed by `pnpm quality:boundaries` (22 workspaces, exit 0).

**Registry row proposal (Slice 2):** `PKG017_TS_CONFIG` · domain `ts-config` · lane blue · runtimeOwner `packages/typescript-config` · prohibited `do-not-inherit-baseurl-from-typescript-config-package` · gates `pnpm typecheck`.

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm typecheck` | 0 | A |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Package root | `packages/typescript-config/` | Yes — Grade B (matrix inventory) |
| Base preset | `packages/typescript-config/base.json` | Yes — Grade B (widely extended) |
| Strict presets | `packages/typescript-config/strict-*.json` | Yes — Grade B (file exists) |
| Paths templates | `paths-app.json`, `paths-package.json` | Yes — Grade B (documented copy-only) |
| Monorepo typecheck | `pnpm typecheck` | Yes — Grade A (exit 0; Research Slice 1 2026-06-25) |
| Consumer wiring | `packages/*/tsconfig.json` | Yes — Grade A (Research Slice 1 consumer table) |

## §Remaining gaps

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `ts-config-e2e-drift` | `apps/erp/e2e/tsconfig.json` does not extend governed preset | blue | Slice 3 Implementation | Slice 3 | Extend `base.json` or document waiver |

## §Enterprise readiness score

> **Note:** Registry onboarding complete (Slice 2). Remaining score ceiling driven by no PKG unit tests and open e2e tsconfig drift.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | 11 JSON presets + `pnpm typecheck` exit 0 — Grade A | Config-only; aggregate typecheck verified |
| Test coverage | 3/5 | No PKG unit tests; consumer `pnpm typecheck` exit 0 — Grade B | No dedicated PKG-017 test suite |
| Observability + audit | 1/5 | Tooling package — no runtime observability — Grade D | N/A |
| Security + RBAC + RLS | 2/5 | Compiler config only — Grade C | N/A |
| Documentation + BRD traceability | 5/5 | FDR §Research consumer table + `PKG017_TS_CONFIG` registry row — Grade A | Registry onboarded Slice 2 (2026-06-25) |
| Maintainability + Clean Core | 5/5 | Clean Core A; single preset authority; consumer audit — Grade A | 21/21 primary configs governed |
| **Total (audit-adjusted)** | **23/30** | Honest **Partially Implemented** score (~7.7 / 10) | Registry cap lifted |
| **Total (evidence-qualified ceiling)** | **23/30** | Matches audit-adjusted; e2e drift remains | Not final 9.5 |

## §Clean Core classification

**This FDR: Level A** — JSON configuration presets with no runtime logic; consumers extend locally without copying authority constants into business packages.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| All `packages/*` | `"extends": "@afenda/typescript-config/..."` | Yes if strict flags change | A→A |
| `apps/erp`, `apps/storybook`, `apps/docs` | strict-next / paths-app | Yes if paths template changes | A→A |
| `@afenda/testing` | test.json / strict presets | No | A→A |

Breaking-change policy: any strict flag tightening requires Architecture Authority review and coordinated consumer PR.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SAP ATC | Quality standards | `pnpm typecheck` | 4 |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SOLMAN | FDD documentation | `pnpm check:documentation-drift` | 9 |

## §BRD traceability

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | All active packages extend @afenda/typescript-config presets | 18 | Research consumer audit |
| internal | baseUrl is local in each consumer tsconfig | 16 | paths template compliance |
| internal | Monorepo typecheck exits 0 | 4 | `pnpm typecheck` |
| package-registry | active-exempt documented and enforced | 6 | `pnpm check:foundation-disposition` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Presets enable strict TS across package types | consumer extends audit |
| Compatibility | Presets work with Next.js 15+, React 19, Vitest | apps/erp + packages/ui typecheck |
| Maintainability | Single preset authority; no duplicated strict flags | `packages/typescript-config/` only |
| Reliability | Typecheck aggregate green on main | `pnpm typecheck` |
| Documentation | active-exempt rule in package-registry | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| TS preset changes | Architecture Authority review for strict flag changes | PR approval (DoD #14) |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-017-ts-config**
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-017** (`active-exempt`)
- Registry onboarding: `foundation-registry-owner`
- Downstream: all packages consuming presets (read-only audit)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-017-ts-config.md` | — | Modified per slice |
| `packages/typescript-config/*.json` | `@afenda/typescript-config` | Modified (Implementation slices only) |
| `foundation-disposition.registry.ts` | — | Modified by `foundation-registry-owner` only |

## Acceptance gate

- `pnpm typecheck`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`
- `pnpm quality:boundaries`

## Acceptance criteria

```gherkin
Feature: Shared TypeScript compiler presets

  Scenario: Active packages extend governed presets
    GIVEN an active package listed in package-registry.md
    WHEN its tsconfig.json is inspected
    THEN extends references @afenda/typescript-config preset
    AND strict compiler options are not duplicated locally

  Scenario: Path mapping uses local baseUrl
    GIVEN a package using paths-package.json or paths-app.json template
    WHEN compilerOptions.paths is configured
    THEN baseUrl is set in the local tsconfig.json
    AND baseUrl is not inherited from @afenda/typescript-config package root

  Scenario: Monorepo typecheck aggregate passes
    GIVEN all active packages and apps
    WHEN pnpm typecheck runs at repository root
    THEN exit code is 0
    AND no package uses ad-hoc non-strict compiler overrides without waiver
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | preset files + matrix row | [x] |
| 2 | Tests pass | consumer `pnpm typecheck` (no PKG unit tests) | [ ] |
| 3 | Boundaries | `pnpm quality:boundaries` | [ ] |
| 4 | TypeScript strict | `pnpm typecheck` | [ ] |
| 5 | Biome clean | N/A for JSON-only package — waived in §Waivers | [ ] |
| 6 | Registry aligned | PKG-017 entry + active-exempt documented | [x] |
| 7 | Runtime matrix updated | matrix PKG-017 row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [ ] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR complete | [x] |
| 12 | Impact analysis complete | §Impact analysis filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority | [ ] |
| 15 | Clean Core level declared | metadata + §Clean Core | [x] |
| 16 | No duplicated strict flags | consumer audit | [x] |
| 17 | Security negative path tested | N/A — tooling; waived | [ ] |
| 18 | Public API compatibility verified | exports map stable | [ ] |
| 19 | E2E requirement satisfied or waived | N/A — tooling | [ ] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score | [x] |

## Slices

### Slice 1 — Research (ts-config baseline)

**Status:** Complete  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** A→A  
**Completed:** 2026-06-25

#### Design (internal-guide)

Reconcile runtime matrix **implemented** TypeScript config row with FDR **Not started** status. Audit which active packages extend `@afenda/typescript-config` presets, verify `baseUrl` is local per `paths-app.json` / `paths-package.json` copy-only rule, document `active-exempt` enforcement from [`package-registry.md`](../../architecture/package-registry.md), and produce baseline gate log plus initial §Enterprise readiness score — **no preset JSON or consumer tsconfig edits**.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Not started] fdr-017-ts-config.md

1. Objective    — Reconcile runtime matrix + package-registry active-exempt rule with FDR status; audit consumer extends wiring across active packages; produce baseline gate log, §Research consumer table, and readiness score for Slice 2 unblock.
2. Allowed layer— docs-only (`docs/delivery/FDR/`, `docs/delivery/fdr-status-index.md`, `docs/architecture/afenda-runtime-truth-matrix.md`)
3. Files        —
   docs/delivery/FDR/[Not started] fdr-017-ts-config.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — `packages/` source edits; `apps/` source edits; `foundation-disposition.registry.ts`; `do-not-inherit-baseurl-from-typescript-config-package`; `do-not-create-accounting-package`
5. Authority    — ADR-0014 · ADR-0016 · [`package-registry.md`](../../architecture/package-registry.md) PKG-017 active-exempt rule
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
   pnpm quality:boundaries
   pnpm typecheck (read-only baseline — report exit code)
7. Closes       — Gap `fdr-research-slice-1`; Gap `ts-config-consumer-audit`; DoD #1, #7, #8, #16 (audit table), #20 (initial score)
8. Evidence     —
   packages/typescript-config/base.json
   packages/typescript-config/strict-*.json
   packages/typescript-config/paths-app.json
   packages/typescript-config/paths-package.json
   packages/typescript-config/package.json
9. Attestation  — Documentation (FDR §Research consumer table Grade A); Contract stability discovery (aggregate typecheck Grade A baseline); Maintainability (active-exempt rule documented)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | preset files + matrix row |
| 7 | Runtime matrix updated | matrix PKG-017 row |
| 8 | fdr-status-index updated | index row |
| 16 | No duplicated strict flags | consumer extends audit table |
| 20 | Enterprise readiness score updated | §Enterprise readiness score initial (18/30 audit-adjusted) |

#### Known debt

- `pkg017-registry-onboard` deferred to Slice 2 Registry-sync — `foundation-registry-owner` only
- No PKG-017 unit tests — consumer `pnpm typecheck` is acceptance proxy (DoD #2)
- Registry hard cap 22/30 until `PKG017_*` entry onboarded

### Slice 2 — Registry-sync (PKG-017 onboard)

**Status:** Delivered (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Registry-sync  

**Outcomes:** `PKG017_TS_CONFIG` onboarded in `foundation-disposition.registry.ts` (fingerprint v9); `foundation-disposition.md` synced; gap `pkg017-registry-onboard` closed; DoD #6 `[x]`; §Enterprise readiness recalculated to **23/30 audit-adjusted**.

**Purpose:** Onboard `PKG017_TS_CONFIG` entry with active-exempt documented in prohibited/gates fields.

### Slice 3 — Implementation (preset closeout)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Implementation  

**Purpose:** Close any preset drift found in Research; coordinate consumer updates if strict flags change.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe |
| Implementation | Revert preset JSON + consumer tsconfig commits | Git revert + `pnpm typecheck` |

Preset changes are upgrade-safe when strict flags only tighten with coordinated consumer fixes.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `ts-config-biome-dod5` | DoD #5 Biome clean for JSON-only package | No TS source in PKG-017 | Architecture Authority | Permanent for tooling JSON |
| `ts-config-security-dod17` | DoD #17 security negative path | Compiler config has no RBAC surface | Architecture Authority | Permanent |

## §Knowledge transfer

### Operational runbook

- Preset authority: `packages/typescript-config/*.json`
- Adding a new package: extend `strict-node.json` or `strict-react-library.json`; copy paths template locally
- **Never** set `baseUrl` in shared preset — copy from `paths-package.json` into local tsconfig

### Observability

- Failure signal: `pnpm typecheck` failure in CI
- Diagnosis: identify failing package filter; check `extends` chain

### On-call escalation

- Symptom: widespread typecheck failure after preset change → revert preset commit; file Architecture Authority review
- Owner: Platform Authority / PKG-017 (`PKG017_TS_CONFIG`)

## §Enterprise benchmark qualification

This FDR is **Partially Implemented — enterprise 9.5 blocked**, not an enterprise 9.5 candidate, because e2e tsconfig drift (Slice 3) remains open.

The **23/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. ~~`foundation-registry-owner` onboards `PKG017_*` with `active-exempt` documented.~~ **Done — 2026-06-25 (`PKG017_TS_CONFIG`).**
2. ~~Research Slice 1 completes consumer `extends` audit across active packages.~~ **Done — 2026-06-25 (Grade A consumer table).**
3. Monorepo `pnpm typecheck` remains exit 0 at Research closeout (verified **2026-06-25** — Grade A).

The **23/30 audit-adjusted** score is the honest benchmark today: strong preset authority, aggregate typecheck proof, completed consumer audit, and registry row onboarded; capped by no PKG unit tests and open e2e tsconfig drift.

Research Slice 1 is complete. Registry-sync Slice 2 is complete (2026-06-25). Slice 3 e2e drift closeout is the next unblock.

**Remaining for Complete status:**

1. ~~`PKG017_TS_CONFIG` foundation-disposition entry onboarded (Slice 2).~~ **Done — 2026-06-25.**
2. Close `ts-config-e2e-drift` in Slice 3 or via waiver.

## Verdict

**Partially Implemented — Registry-sync Slice 2 complete (23/30 audit-adjusted). Slice 3 e2e tsconfig drift closeout is the next unblock.**

PKG-017 is **active-exempt** from layer-dependency enforcement. E2e tsconfig drift closeout remains before Complete.
