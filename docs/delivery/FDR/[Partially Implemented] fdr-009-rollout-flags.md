# fdr-009-rollout-flags — Rollout Flags

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-009-rollout-flags` |
| **Registry entry ID** | `PKG009_FEATURE_FLAGS` |
| **Package** | `@afenda/feature-flags` (PKG-009) |
| **Lane** | blue-lane |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Low |
| **BRD reference** | internal — deployment rollout + kill-switch evaluation |
| **Enterprise readiness** | **29/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise **9.5 candidate** (DoD #14 peer review open; see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | Transport variants · Oracle Profiles |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts).

| Field | Value |
| --- | --- |
| id | `PKG009_FEATURE_FLAGS` |
| packageId | PKG-009 |
| domain | `rollout-flags` |
| lane | blue-lane |
| runtimeOwner | `packages/feature-flags` |
| gates | `pnpm --filter @afenda/feature-flags typecheck` |
| prohibited | `do-not-create-accounting-package`; `do-not-mark-required-before-accounting`; `do-not-depend-on-feature-flags-in-gate-critical-paths` |
| allowedAgents | `feature-flags-agent`; `foundation-registry-owner` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/feature-flags` (PKG-009) | Rollout evaluation facade — gradual rollout, kill switches, structured `FlagDecision` | `packages/feature-flags/src/` |
| `@afenda/entitlements` (PKG-006) | Upstream contract + resolver authority (`resolveFeatureFlag`, `resolveKillSwitch`) | `packages/entitlements/src/flags/feature-flag-engine.ts` |
| `@afenda/database` (PKG-003) | Platform rollout persistence — catalog seed, load/sync services | `packages/database/src/entitlement/rollout-*.ts`; `packages/database/src/seeds/platform-rollout.catalog.ts` |
| `apps/erp` (PKG-007) | ERP request hydration + feature gating consumer (**not wired — gap**) | `apps/erp/src/lib/` (target: `resolve-rollout-flags.server.ts` — Slice 2) |

## Purpose

Lock and maintain the governed deployment-rollout evaluation pipeline — platform rollout catalog → entitlements contracts → `@afenda/feature-flags` evaluation facade → ERP request hydration — so feature rollout, tenant/company allowlists, environment gates, and kill-switch incident response are evaluated through one public package surface without duplicating flag logic in ERP routes or gate-critical paths.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Registry rule: flags are **blue-lane incubation** — [`PKG009_FEATURE_FLAGS`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) prohibits depending on feature flags in gate-critical paths until blue→green promotion.

## Scope

**In scope**

- `packages/feature-flags/src/flag-evaluation.ts` — `evaluateFlag`, `evaluateAll`, `isEnabled`, `isEnabledStrict`
- `packages/feature-flags/src/flags/feature-flag.service.ts` — TIP-008 spec APIs `featureFlag`, `evaluateFeatureFlag`
- `packages/feature-flags/src/kill-switch/kill-switch.service.ts` — `killSwitch` boolean shorthand
- Contract surfaces under `packages/feature-flags/src/contracts/` — `FlagDecision`, audit shape, context
- `packages/feature-flags/src/__tests__/flag-evaluation.test.ts` — denial paths + kill-switch supremacy
- ERP rollout resolver wiring (Slice 2) and Evidence-sync closeout (Slice 3)

**Out of scope**

- Commercial entitlement evaluation (`fdr-006-entitlements`) — separate from deployment rollout
- Gate-critical path dependency on flags (registry prohibited until green promotion)
- Accounting runtime (ADR-0010)
- System Admin UI for flag authoring (future operator surface — not PKG-009)
- New database migrations without persistence FDR alignment (`fdr-003-persistence`)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice Field 3 |
| Shared constants | Flag keys and kill-switch keys owned in `platform-rollout.catalog.ts` + entitlements contracts — no duplicate catalogs in ERP |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-009 | **Sequential** with any other agent touching `packages/entitlements/src/flags/` unless orchestrator serializes |
| ERP wiring | ERP slice may import `@afenda/feature-flags` only after dependency-registry row verified — no direct entitlements flag-engine imports from `apps/erp` |
| Implementation blocked until | Research Slice 1 complete ✓; ERP integration map documented below |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled runtime matrix **partially-implemented** with FDR delivery evidence grades. **Real gap is ERP wiring, not package existence.**

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| What runtime evidence exists for `@afenda/feature-flags`? | **Yes** — evaluation facade, kill-switch service, contracts, 24 unit tests | `flag-evaluation.test.ts`; gates exit 0 |
| Does evaluation cover tenant, company, environment, rollout, kill-switch? | **Yes** — 7 denial reasons + kill-switch supremacy tested | `flag-evaluation.test.ts` (24 tests) |
| Which ERP paths should hydrate rollout and call facade? | **Mapped** — target `apps/erp/src/lib/rollout/resolve-rollout-flags.server.ts`; load via `loadPlatformRolloutBundle` → `mapPlatformRolloutToEvaluationData` → `evaluateFeatureFlag` | Zero `@afenda/feature-flags` imports in `apps/erp` today (grep confirmed) |
| Is `fdr-006-entitlements` hard prerequisite? | **No for Slice 2** — entitlements flag-engine + mapper tests live; waiver `rollout-flags-fdr-006-prereq` | §Waivers |
| Do registry gates need `test:run`? | **Deferred** — `test:run` exit 0 proven; registry lists `typecheck` only; waiver `rollout-flags-test-gate-defer` | Slice 3 or `foundation-registry-owner` |

### Matrix reconciliation (Slice 1)

| Source | Prior state | Reconciled state (2026-06-25) |
| --- | --- | --- |
| Runtime matrix Feature Flags row | **partially-implemented**; matrix previously undersold package strength | **Confirmed** — 24 tests + evaluation facade + kill-switch service proven at PKG-009 |
| FDR status | **Not started** | **Partially Implemented** — package evidence attested; ERP wiring remains open |
| Primary gap | Unclear package vs ERP boundary | **ERP wiring only** — zero `apps/erp` imports of `@afenda/feature-flags`; persistence + entitlements upstream live |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/feature-flags typecheck` | 0 | A |
| `pnpm --filter @afenda/feature-flags test:run` | 0 | A (24 tests) |
| `pnpm exec biome check packages/feature-flags` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| ERP `@afenda/feature-flags` import scan | 0 matches | E (expected — wiring gap) |

### Files inspected

| Path | Why |
| --- | --- |
| `packages/feature-flags/src/index.ts` | Public export surface |
| `packages/feature-flags/src/flag-evaluation.ts` | Core evaluation + bulk `evaluateAll` |
| `packages/feature-flags/src/flags/feature-flag.service.ts` | Spec-required `featureFlag` / `evaluateFeatureFlag` |
| `packages/feature-flags/src/kill-switch/kill-switch.service.ts` | Kill-switch shorthand |
| `packages/feature-flags/src/contracts/` | `FlagDecision`, audit, context contracts |
| `packages/feature-flags/src/__tests__/flag-evaluation.test.ts` | Denial + kill-switch tests (24) |
| `packages/entitlements/src/flags/feature-flag-engine.ts` | Upstream resolver authority |
| `packages/entitlements/src/provisioning/rollout-bundle.mapper.ts` | DB bundle → evaluation contracts |
| `packages/database/src/seeds/platform-rollout.catalog.ts` | Platform catalog (7 flags, 8 kill switches) |
| `packages/database/src/entitlement/rollout-load.service.ts` | Postgres load path |
| `apps/erp/src/` | Zero `@afenda/feature-flags` imports confirmed |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | Feature Flags row |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Public barrel | `packages/feature-flags/src/index.ts` | Yes — Grade A (`typecheck` exit 0) |
| Flag evaluation | `packages/feature-flags/src/flag-evaluation.ts` | Yes — Grade A (24 tests exit 0) |
| Feature flag service | `packages/feature-flags/src/flags/feature-flag.service.ts` | Yes — Grade B (exported; covered by evaluation tests) |
| Kill-switch service | `packages/feature-flags/src/kill-switch/kill-switch.service.ts` | Yes — Grade B (kill-switch supremacy tests) |
| FlagDecision contract | `packages/feature-flags/src/contracts/feature-flag-decision.contract.ts` | Yes — Grade B (7 denial reasons + discriminated union tests) |
| Audit contract | `packages/feature-flags/src/contracts/feature-flag-audit.contract.ts` | Partial — Grade C (type only; no ERP emission) |
| Evaluation tests | `packages/feature-flags/src/__tests__/flag-evaluation.test.ts` | Yes — Grade A (24 tests exit 0) |
| Upstream flag engine | `packages/entitlements/src/flags/feature-flag-engine.ts` | Yes — Grade B (resolver authority; fail-open / strict policies) |
| Rollout bundle mapper | `packages/entitlements/src/provisioning/rollout-bundle.mapper.ts` | Yes — Grade B (`rollout-bundle.mapper.test.ts`) |
| Platform catalog | `packages/database/src/seeds/platform-rollout.catalog.ts` | Yes — Grade B (7 flags, 8 kill switches; catalog tests) |
| Rollout load service | `packages/database/src/entitlement/rollout-load.service.ts` | Yes — Grade C (persistence path; no ERP load proof) |
| ERP consumer wiring | `apps/erp/src/lib/rollout/resolve-rollout-flags.server.ts` | Yes — Grade A (integration test exit 0) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `feature-flags-erp-wiring` | ~~No ERP import of `@afenda/feature-flags`; rollout bundle not hydrated on request~~ **Closed Slice 2 (2026-06-25)** | blue | `fdr-slice-implementer` (Implementation) | Slice 2 | ERP resolver at `apps/erp/src/lib/rollout/resolve-rollout-flags.server.ts` loads bundle via `loadPlatformRolloutBundle` + calls `evaluateFeatureFlag`; integration test exit 0 |
| `feature-flags-audit-emission` | `FeatureFlagAuditContract` defined but no governed audit emission on denial | blue | `fdr-slice-implementer` or observability FDR | Slice 2 / sibling | Audit event on structured denial or waiver in §Waivers |
| `feature-flags-complete-status` | Promotion to **Complete** blocked on DoD #14 peer review only | blue | Architecture Authority (PR) | Complete | DoD #14 `[x]`; rename to `[Complete]` after PR merge |
| `feature-flags-test-gate-registry` | Registry `gates` lists `typecheck` only — **`test:run` proven** in Slice 3 gate log; registry edit deferred | blue | `foundation-registry-owner` (optional) | Complete | Waiver `rollout-flags-test-gate-defer` affirmed Slice 3 — `test:run` exit 0 (24 tests) |
| `feature-flags-e2e` | No browser proof for flag-gated UX | blue | — | §Waivers | Waiver or E2E before Complete |

## §Enterprise readiness score

> **Slice 3 Evidence-sync (2026-06-25):** ERP wiring closed Slice 2; gate log re-run attests **29/30 audit-adjusted**. Waiver `rollout-flags-test-gate-defer` **affirmed** — `test:run` exit 0 proven; registry `gates[]` edit optional via `foundation-registry-owner`. Final **Complete** blocked on DoD #14 peer review only.
>
> Score 0–5 per dimension (integers only in table). Every point maps to gate exit 0, test path, or explicit §Waivers row.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `FlagDecision` discriminated union + ERP facade import + `typecheck` exit 0 — Grade A | ERP resolver proven Slice 2 |
| Test coverage | 5/5 | 24 PKG tests + 3 ERP integration tests exit 0 — Grade A | Slice 3 gate log re-run |
| Observability + audit | 4/5 | `FeatureFlagAuditContract` + waiver `rollout-flags-audit-read-path` — Grade B | Read-path audit emission deferred |
| Security + RBAC + RLS | 5/5 | Tenant/company allowlist + kill-switch supremacy + ERP integration denial — Grade A | ERP resolver wired Slice 2 |
| Documentation + BRD traceability | 5/5 | FDR + index + matrix + `check:documentation-drift` exit 0 — Grade A | DoD #14 blocks Complete prefix only |
| Maintainability + Clean Core | 5/5 | PKG: `typecheck` + `test:run` + boundaries + foundation-disposition exit 0 — Grade A | Waiver `rollout-flags-test-gate-defer` — test:run proven, registry optional |
| **Total (audit-adjusted)** | **29/30** | **Enterprise 9.5 candidate** (9.7 / 10 equivalent) | Peer review (DoD #14) pending |
| **Total (evidence-qualified ceiling)** | **29/30** | Matches audit-adjusted — waivers bounded | Not final Complete until DoD #14 |

### Slice 3 gate log (Evidence-sync — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/feature-flags typecheck` | 0 | A |
| `pnpm --filter @afenda/feature-flags test:run` | 0 | A (24 tests) |
| `pnpm --filter @afenda/erp test:run -- resolve-rollout-flags` | 0 | A (3 integration tests) |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |

> **Waiver affirmation:** `rollout-flags-test-gate-defer` — registry `gates[]` lists `typecheck` only; `test:run` exit 0 attested above. Optional registry promotion via `foundation-registry-owner`; not required for 29/30 audit-adjusted score.

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — rollout evaluation at approved `@afenda/feature-flags` Integration boundary; contracts flow from `@afenda/entitlements`; catalog keys owned in `platform-rollout.catalog.ts`; ERP must consume facade not duplicate evaluators.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` | _(none today)_ → target `evaluateFeatureFlag`, `evaluateAll`, `isEnabledStrict` | No | B→B |
| `@afenda/entitlements` | Upstream — feature-flags re-exports resolvers | No | B→B |
| `@afenda/database` | `loadPlatformRolloutBundle`, `PlatformRolloutBundle` | No | B→B |
| `@afenda/ai-governance` | Architecture test workspace only | No | B→B |

**ERP giant compatibility (Research confirmed):**

- **SAP transport variants:** `rollout` states (`on`, `off`, `limited`, `beta`) + per-environment allowlists mirror transport layering; tenant and company allowlists support phased tenant rollout without code deploy.
- **Oracle Profiles:** Flag `enabled` + `rollout` + environment list analogous to profile option hierarchy; kill switches mirror emergency profile disable for incident response.
- **Kill-switch supremacy:** Armed kill switch blocks flag regardless of tenant — matches global incident override; 8 kill switches registered including `module.accounting.kill_switch` (inactive by default).
- **Fail-open vs fail-closed:** `isEnabled` / `featureFlag` fail-open for gradual rollout; `isEnabledStrict` / `resolveFeatureFlagStrict` fail-closed for security-sensitive paths — ERP must choose per surface.
- **Bulk hydration:** `evaluateAll` is O(n) over catalog — suitable for request-start hydration when ERP wires bundle load (7 flags today; scales to hundreds without per-flag round trips).
- **Persistence path:** `platform-rollout.catalog.ts` → `rollout-sync.service.ts` → Postgres → `rollout-load.service.ts` → `mapPlatformRolloutToEvaluationData` — ERP should not read Postgres rollout tables directly.
- **Gate-critical prohibition:** Registry `do-not-depend-on-feature-flags-in-gate-critical-paths` — accounting readiness, auth, RLS gates must not branch on flags until green promotion.
- **Integration proof gap:** Zero `apps/erp` imports of `@afenda/feature-flags` — blue-lane incubation intact; Slice 2 closes `feature-flags-erp-wiring`.

Upstream consumers scan: no production package imports `@afenda/feature-flags` today except architecture-authority test fixtures. ERP wiring is the primary Slice 2 consumer.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| Transport variants | Oracle Profiles | `pnpm --filter @afenda/feature-flags typecheck` | 4 |
| SOLMAN | FDD testable AC | `pnpm check:documentation-drift` | 9 |
| ATC | Quality standards | `pnpm exec biome check packages/feature-flags` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/feature-flags test:run` | 2 |
| Oracle FDD BRD traceability | SAP Blueprint AC chain | Gherkin §Acceptance criteria | 2 |
| Dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or runtime evidence.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Flag allowed when enabled, rollout on, environment match, allowlists pass | 2 | `flag-evaluation.test.ts` |
| internal | Kill switch blocks flag when armed | 17 | `flag-evaluation.test.ts` |
| internal | Structured denial reason on `evaluateFeatureFlag` | 2 | `flag-evaluation.test.ts` |
| internal | Fail-open `isEnabled` for missing flag | 18 | `flag-evaluation.test.ts` |
| internal | Fail-closed `isEnabledStrict` for missing flag | 17 | `flag-evaluation.test.ts` |
| internal | Platform catalog keys unique; kill-switch keys registered | 1 | `rollout-catalog.test.ts` |
| internal | ERP hydrates rollout and evaluates via `@afenda/feature-flags` | 1 | ERP integration test (Slice 2) |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Evaluation returns correct `FlagDecision` for all 7 denial/allow paths | `flag-evaluation.test.ts` (24 tests pass) |
| Performance efficiency | `evaluateAll` O(n) synchronous — suitable for request-start hydration | code review + unit tests |
| Compatibility | `FeatureFlagContract` single source in entitlements; feature-flags re-exports | `typecheck` exit 0 |
| Security | Tenant/company allowlists; kill-switch supremacy; strict mode for sensitive paths | denial tests in `flag-evaluation.test.ts` |
| Maintainability | Biome clean; strict typecheck; 0 `any` in flag paths | `pnpm exec biome check packages/feature-flags` exit 0; `typecheck` |
| Reliability | Deterministic evaluation — same flags + context → same decision | unit tests |
| Documentation | Index + matrix aligned with FDR evidence | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Flag evaluation (read path) | N/A — evaluation is read-only | — |
| Kill-switch activation (operator) | SoD waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |
| Platform rollout catalog sync | Operator + DB write — future System Admin / ops runbook | `rollout-sync.service.ts` (not ERP-governed mutation audit yet) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-009-rollout-flags**
- Registry: `PKG009_FEATURE_FLAGS` read-only snapshot in §Registry link
- [`package-registry.md`](../../architecture/package-registry.md) **PKG-009**
- Upstream contracts: `@afenda/entitlements` flag engine — **waived** for Slice 2 (see §Waivers)
- Persistence: `@afenda/database` rollout catalog + load path (live — align with `fdr-003-persistence` if migrations change)
- Context: operating-context tenant/company IDs for `FeatureFlagContext` — [`fdr-007-operating-context`](%5BPartially%20Implemented%5D%20fdr-007-operating-context.md) (read-only consumer)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-009-rollout-flags.md` | — | Modified per slice |
| `packages/feature-flags/src/flag-evaluation.ts` | `@afenda/feature-flags` | Modified (Implementation slices only) |
| `packages/feature-flags/src/flags/feature-flag.service.ts` | `@afenda/feature-flags` | Modified (Implementation slices only) |
| `packages/feature-flags/src/__tests__/flag-evaluation.test.ts` | `@afenda/feature-flags` | Modified (Implementation slices only) |
| `apps/erp/src/lib/rollout/resolve-rollout-flags.server.ts` | `@afenda/erp` | New (Slice 2 only) |

## Acceptance gate

- `pnpm --filter @afenda/feature-flags typecheck`
- `pnpm --filter @afenda/feature-flags test:run`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`
- `pnpm exec biome check packages/feature-flags`

## Acceptance criteria

```gherkin
Feature: Deployment rollout flag evaluation

  Scenario: Flag allowed when rollout rules pass
    GIVEN a FeatureFlagContract with enabled true and rollout not "off"
    AND the kill switch for the flag is inactive or absent
    AND the evaluation context environment is listed in flag.environments
    AND tenantId is in tenantAllowlist when the allowlist is non-empty
    AND companyId is in companyAllowlist when the allowlist is non-empty
    WHEN evaluateFeatureFlag is called with the flag set and kill switches
    THEN the FlagDecision is allowed
    AND the decision includes the matching FeatureFlagContract

  Scenario: Kill switch blocks flag regardless of tenant
    GIVEN a globally enabled flag with an armed kill switch
    WHEN evaluateFlag is called for any tenant and company in production
    THEN the FlagDecision is denied with reason "kill_switch_active"

  Scenario: Tenant not in allowlist is denied
    GIVEN a flag with rollout "limited" and tenantAllowlist ["tenant_a"]
    AND the evaluation context tenantId is "tenant_other"
    WHEN evaluateFlag is called
    THEN the FlagDecision is denied with reason "tenant_excluded"

  Scenario: Fail-open boolean shorthand for gradual rollout
    GIVEN no FeatureFlagContract exists for key "new_surface"
    WHEN isEnabled is called
    THEN the result is true

  Scenario: Fail-closed boolean shorthand for security paths
    GIVEN no FeatureFlagContract exists for key "new_surface"
    WHEN isEnabledStrict is called
    THEN the result is false

  Scenario: ERP evaluates via @afenda/feature-flags facade
    GIVEN the platform rollout bundle is loaded for the tenant context
    AND operating context resolves tenantId and companyId
    WHEN the ERP rollout resolver hydrates flags and kill switches
    THEN evaluation uses @afenda/feature-flags not entitlements flag-engine directly
    AND denied flags do not expose gated module routes or server actions
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/feature-flags test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/feature-flags typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/feature-flags` (PKG scope) | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix Feature Flags row reconciled | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | denial tests in `flag-evaluation.test.ts` | [x] |
| 18 | Public API compatibility verified | `index.ts` export surface stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score (audit-adjusted + ceiling) | [x] |

## Slices

### Slice 1 — Research (rollout-flags)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** B→B

**Purpose:** Reconcile runtime matrix **partially-implemented** with FDR **Not started**; map database catalog → entitlements mapper → feature-flags facade → ERP target wiring; run full §Acceptance gate commands; update §Remaining gaps, §Runtime evidence, and §Enterprise readiness score. No source edits.

**Outcomes:**

- Closed gap `feature-flags-research-slice-1`
- Closed gap `rollout-flags-fdr-006-prereq` via §Waivers
- Status promoted to **Partially Implemented**
- Matrix reconciliation: package proven (24 tests); **real gap is ERP wiring**
- Readiness score: **22/30 audit-adjusted** (**27/30 evidence-qualified ceiling**)
- Slice 2 unblocked with ERP integration map (`apps/erp/src/lib/rollout/resolve-rollout-flags.server.ts`)

### Slice 2 — Implementation (ERP rollout wiring)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Implementation (Integration — PKG-007 consumer + PKG-009 facade import)  
**Risk class:** Low  
**Clean Core impact:** B→B

#### Design (internal-guide)

Add the governed ERP rollout resolver at `apps/erp/src/lib/rollout/resolve-rollout-flags.server.ts` that hydrates the platform rollout bundle on request and evaluates flags exclusively through `@afenda/feature-flags` — never `@afenda/entitlements` `feature-flag-engine` directly. Pipeline: `loadPlatformRolloutBundle` (`@afenda/database`) → `mapPlatformRolloutToEvaluationData` (`@afenda/entitlements` mapper only) → `evaluateFeatureFlag` / `evaluateAll` (`@afenda/feature-flags`). Build `FeatureFlagContext` from `OperatingContext` (`tenantId`, `companyId`, deployment environment). Register the approved dependency edge `@afenda/erp` → `@afenda/feature-flags` before merge so `quality:boundaries` passes. Integration test proves hydration + facade evaluation + denial path without gate-critical coupling (accounting readiness, auth, RLS remain flag-independent per registry prohibition). Route-level gating (`guard-module-route`) is out of scope — resolver-only; audit emission deferred via existing waiver unless denial logging is added without expanding scope.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-009-rollout-flags.md

1. Objective    — Wire ERP rollout resolver that loads platform bundle and evaluates flags via @afenda/feature-flags facade with integration test proof; register approved ERP→feature-flags dependency edge.
2. Allowed layer— apps/erp/src/lib/rollout/; apps/erp/package.json; packages/architecture-authority/src/data/dependency-registry.data.ts
3. Files        —
   apps/erp/package.json
   apps/erp/src/lib/rollout/resolve-rollout-flags.server.ts
   apps/erp/src/lib/rollout/__tests__/resolve-rollout-flags.integration.test.ts
   packages/architecture-authority/src/data/dependency-registry.data.ts
   docs/architecture/dependency-registry.md
   docs/architecture/dependency-snapshot.json
   docs/delivery/FDR/[Partially Implemented] fdr-009-rollout-flags.md
4. Prohibited   — packages/feature-flags/src/ edits; direct @afenda/entitlements feature-flag-engine imports from apps/erp; foundation-disposition.registry.ts; do-not-create-accounting-package; do-not-mark-required-before-accounting; do-not-depend-on-feature-flags-in-gate-critical-paths (accounting readiness, auth, RLS); gate-critical route wiring
5. Authority    — ADR-0014 · ADR-0016 · PKG009_FEATURE_FLAGS · PKG-007 ERP consumer · dependency-registry Approved edge
6. Gates        —
   pnpm --filter @afenda/feature-flags typecheck
   pnpm --filter @afenda/feature-flags test:run
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm quality:boundaries
   pnpm check:documentation-drift
7. Closes       — Gap `feature-flags-erp-wiring`; DoD #1 (ERP consumer runtime evidence row); DoD #3 (boundaries — ERP→feature-flags edge); BRD internal AC "ERP hydrates rollout and evaluates via @afenda/feature-flags"
8. Evidence     —
   apps/erp/src/lib/rollout/resolve-rollout-flags.server.ts
   apps/erp/src/lib/rollout/__tests__/resolve-rollout-flags.integration.test.ts
   apps/erp/package.json
   packages/architecture-authority/src/data/dependency-registry.data.ts
9. Attestation  — Contract stability (ERP imports facade not entitlements engine); Test coverage (+ ERP integration test); Security (tenant/company/environment context from OperatingContext); Documentation (FDR §Runtime evidence ERP row + dependency-registry sync)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths — ERP consumer wiring | `resolve-rollout-flags.integration.test.ts` exit 0 |
| 3 | Boundaries — approved `@afenda/erp` → `@afenda/feature-flags` edge | `pnpm quality:boundaries` |
| 2 | PKG-009 tests remain green (no regression) | `pnpm --filter @afenda/feature-flags test:run` |

#### Known debt

- `feature-flags-audit-emission` — affirm waiver `rollout-flags-audit-read-path` or add denial-only logging in resolver (no scope expansion to observability FDR)
- `feature-flags-complete-status` — DoD #14 peer review still open until PR merge
- `feature-flags-test-gate-registry` — registry `test:run` gate deferred to Slice 3 (`rollout-flags-test-gate-defer`)
- `feature-flags-e2e` — waived until external beta go-live (`rollout-flags-e2e`)
- Route-level flag gating (`guard-module-route`, module nav filtering) not wired — resolver-only; future slice or UX FDR

### Slice 3 — Evidence-sync (29/30 closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 2 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  

**Purpose:** Recalculate §Enterprise readiness score to **29/30 audit-adjusted**; sync FDR evidence with Slice 3 gate log; affirm waiver `rollout-flags-test-gate-defer` (`test:run` proven); sync matrix Feature Flags row + fdr-status-index. **Do not** rename to `[Complete]` — DoD #14 peer review still open.

**Outcomes:**

- Slice 3 gate log attests feature-flags typecheck/test:run, ERP rollout integration tests, documentation-drift, foundation-disposition — all exit 0
- Readiness promoted: **29/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — enterprise 9.5 candidate
- Waiver `rollout-flags-test-gate-defer` affirmed — `test:run` exit 0 (24 tests); registry edit optional
- Matrix Feature Flags row reconciled (ERP wiring closed; package + consumer proven)
- fdr-status-index row synced (29/30, Partially Implemented)
- Complete prefix promotion deferred to DoD #14 peer review at PR merge

### Slice 4 — Evidence-sync (Complete — enterprise 9.5 accepted)

**Status:** Not started  
**Prerequisite:** Slice 3 Complete ✓  
**Type:** Evidence-sync  
**Risk class:** Low  

**Purpose:** Record Architecture Authority peer review (DoD #14); reconfirm §Waivers (`rollout-flags-fdr-006-prereq`, `rollout-flags-audit-read-path`, `rollout-flags-e2e`, `rollout-flags-test-gate-defer`); promote to **Complete — enterprise 9.5 accepted**; sync index and runtime matrix Feature Flags row.

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-009-rollout-flags.md

1. Objective    — Close DoD #14; promote fdr-009-rollout-flags to Complete — enterprise 9.5 accepted at 29/30.
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-009-rollout-flags.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/; apps/; foundation-disposition.registry.ts; do-not-create-accounting-package; do-not-mark-required-before-accounting; do-not-depend-on-feature-flags-in-gate-critical-paths
5. Authority    — Architecture Authority peer review attestation · ADR-0014 · ADR-0016 · PKG009_FEATURE_FLAGS
6. Gates        —
   pnpm --filter @afenda/feature-flags typecheck
   pnpm --filter @afenda/feature-flags test:run
   pnpm --filter @afenda/erp test:run -- resolve-rollout-flags
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — Gap feature-flags-complete-status; DoD #14; DoD #7; DoD #8 (index)
8. Evidence     — §Peer review attestation; final gate log in FDR Slice 4 section
9. Attestation  — Documentation 5/5; Enterprise readiness 29/30 accepted
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 14 | Peer review | Architecture Authority PR approval |
| 7 | Runtime matrix updated | matrix Feature Flags row → Complete |
| 8 | fdr-status-index updated | index row → Complete |

#### Known debt

- `feature-flags-audit-emission` — `FeatureFlagAuditContract` defined; governed audit emission on denial deferred per `rollout-flags-audit-read-path`
- `feature-flags-test-gate-registry` — registry `gates[]` lists `typecheck` only; waiver `rollout-flags-test-gate-defer` affirmed; optional `foundation-registry-owner` edit
- `feature-flags-e2e` — browser E2E waived per `rollout-flags-e2e` until external beta
- Route-level flag gating (`guard-module-route`, module nav filtering) not wired — resolver-only

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert ERP resolver + feature-flags commit; ERP falls back to no flag gating | Quarterly-release-safe; git revert + gate re-run |
| Catalog sync | Re-run `rollout-sync.service` from seed catalog | SAP transport rollback analog = restore catalog seed + sync |

Oracle analog: confirm upgrade-safe — ERP wiring is additive facade import; no hand-edited Postgres objects outside governed sync. SAP analog: transport rollback = git revert + disable ERP resolver call sites.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `rollout-flags-fdr-006-prereq` | Hard block on `fdr-006-entitlements` before Slice 2 | Entitlements `feature-flag-engine.ts` + mapper tests live; contracts stable | Architecture Authority (Research attestation) | Revisit when `fdr-006-entitlements` FDR starts |
| `rollout-flags-audit-read-path` | Audit event on every flag evaluation | Evaluation is read path; audit on denial only tracked as gap | Architecture Authority | Phase 9 / observability FDR |
| `rollout-flags-e2e` | Browser E2E for flag-gated UX | No flag UI surface in ERP yet; unit + integration tests prove eval | Architecture Authority | External beta go-live |
| `rollout-flags-test-gate-defer` | Registry `gates` includes `test:run` before Complete | **`test:run` exit 0 proven** Slice 3 gate log (24 tests); registry edit optional | Architecture Authority | **Affirmed Slice 3 (2026-06-25)** — optional `foundation-registry-owner` |

## §Knowledge transfer

### Operational runbook

- Evaluation entry: `packages/feature-flags/src/flags/feature-flag.service.ts` — `evaluateFeatureFlag(input)` for structured decisions; `featureFlag(key, flags, context)` for boolean gates
- Bulk hydration: `evaluateAll(flags, killSwitches, context)` in `flag-evaluation.ts`
- Strict security paths: `isEnabledStrict` / `resolveFeatureFlagStrict` — fail-closed when flag missing
- Catalog authority: `packages/database/src/seeds/platform-rollout.catalog.ts` — 7 flags, 8 kill switches
- Load path: `loadPlatformRolloutBundle` → `mapPlatformRolloutToEvaluationData`
- ERP target (Slice 2): `apps/erp/src/lib/rollout/resolve-rollout-flags.server.ts`
- Incident response: arm kill switch in `platform_kill_switches` (operator) — evaluation returns `kill_switch_active` immediately

### Observability

- Audit contract: `packages/feature-flags/src/contracts/feature-flag-audit.contract.ts` — emission not wired (gap)
- Denial reasons: `FlagDenialReason` union — use in logs when `evaluateFeatureFlag` returns `allowed: false`
- Correlation: pass `correlationId` into audit contract when emission added

### On-call escalation

- Symptom: feature visible but should be rolled off → check flag `enabled`, `rollout`, environment list, tenant/company allowlists
- Symptom: feature missing after deploy → check kill switch active state for flag's `killSwitchKey`
- Symptom: inconsistent ERP vs package behaviour → confirm ERP imports `@afenda/feature-flags` not entitlements engine directly
- Owner: `@afenda/feature-flags` (PKG-009) via `feature-flags-agent`

## §Enterprise benchmark qualification

This FDR is an **enterprise 9.5 candidate** at **29/30 audit-adjusted** (Slice 3 Evidence-sync 2026-06-25). Final **Complete — enterprise 9.5 accepted** blocked on DoD #14 peer review only.

The **29/30 evidence-qualified ceiling** is accepted under these bounded assumptions:

1. Browser E2E waived until external beta go-live (`rollout-flags-e2e`).
2. Flag evaluation is a read path — audit emission on every evaluation waived (`rollout-flags-audit-read-path`); observability at 4/5.
3. ~~Registry `test:run` gate addition deferred~~ — **`test:run` exit 0 proven** Slice 3; waiver `rollout-flags-test-gate-defer` **affirmed**; registry edit optional.
4. ~~ERP wiring (`feature-flags-erp-wiring`)~~ — **closed Slice 2** (2026-06-25).

**Promotion to Complete — enterprise 9.5 accepted requires:** DoD #14 peer review `[x]`; rename FDR prefix to `[Complete]`; §Waivers reconfirmed at PR merge.

## Verdict

**Partially Implemented — enterprise 9.5 candidate at 29/30 audit-adjusted (29/30 ceiling), pending Architecture Authority peer review (DoD #14).**

Slice 1 Research **Complete** (2026-06-25). Slice 2 ERP rollout resolver **Complete**. Slice 3 Evidence-sync **Complete** (2026-06-25): PKG-009 + ERP integration gates exit 0; waiver `rollout-flags-test-gate-defer` affirmed. Do not rename to `[Complete]` until DoD #14 peer review closes at PR merge.
