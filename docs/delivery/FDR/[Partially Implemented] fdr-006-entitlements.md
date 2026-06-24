# fdr-006-entitlements — Entitlements Authority

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-006-entitlements` |
| **Registry entry ID** | `PKG006_ENTITLEMENTS` |
| **Package** | `@afenda/entitlements` (PKG-006) |
| **Lane** | green-lane _(planned — registry onboarding required)_ |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Medium |
| **BRD reference** | internal — entitlement evaluation authority |
| **Enterprise readiness** | **22/30 audit-adjusted** · **26/30 evidence-qualified ceiling** — not enterprise 9.5 qualified until registry onboarded (see §Enterprise benchmark qualification) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SAP Authorization Objects · Oracle RBAC policies · SAP GRC SoD |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Registry `domain` is `entitlements`; sibling subdomain `feature-manifest` is scoped by [`fdr-006-feature-manifest`](%5BPartially%20Implemented%5D%20fdr-006-feature-manifest.md).

| Field | Value |
| --- | --- |
| id | `PKG006_ENTITLEMENTS` |
| packageId | PKG-006 |
| domain | `entitlements` |
| lane | green-lane |
| runtimeOwner | `packages/entitlements` |
| gates | `pnpm --filter @afenda/entitlements typecheck`; `pnpm --filter @afenda/entitlements test:run`; `pnpm --filter @afenda/entitlements check:governance` |
| prohibited | `do-not-create-accounting-package`; `do-not-duplicate-manifest-module-ids-outside-registry` |
| allowedAgents | `foundation-registry-owner`; `fdr-slice-implementer` |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/entitlements` (PKG-006) | Entitlement evaluation, capability decisions, limits, flags, beta, kill switches, localization, cache, provisioning mappers | `packages/entitlements/src/evaluation/` · `packages/entitlements/src/contracts/` |
| `@afenda/database` (PKG-003) | Permission key shape authority (upstream) | `packages/database/src/seeds/platform-permissions.catalog.ts` |
| `@afenda/erp` (PKG-007) | Consumer — manifest routes and nav (read-only in this FDR) | `apps/erp/src/lib/modules/` |
| `@afenda/appshell` (PKG-001) | Consumer — nav projection from manifest (read-only) | `packages/appshell/src/navigation/` |

## Purpose

Lock and maintain the governed **entitlement evaluation authority** in `@afenda/entitlements` — contracts, resolution engines, capability evaluation with audit evidence, usage limits, feature flags, beta access, kill switches, localization gates, evaluation cache, and database/rollout provisioning mappers — so consumers never duplicate entitlement logic locally.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): TIP-008 entitlement contracts (historical); manifest subdomain evidence in [`tip-007a-feature-manifest-governance.md`](../../delivery/tips/[Complete]%20tip-007a-feature-manifest-governance.md) scoped to [`fdr-006-feature-manifest`](%5BPartially%20Implemented%5D%20fdr-006-feature-manifest.md).

## Scope

**In scope**

- `packages/entitlements/src/contracts/` — entitlement, decision, audit, flag, limit, beta, kill-switch, localization, export contracts
- `packages/entitlements/src/evaluation/entitlement-engine.ts` — tenant/company/environment scoped resolution
- `packages/entitlements/src/evaluation/capability-evaluation.ts` — `evaluateCapability` with denial audit evidence
- `packages/entitlements/src/evaluation/capability-registry.ts` — capability definitions and entitlement key bindings
- `packages/entitlements/src/flags/` — feature flag and kill-switch engines + policy
- `packages/entitlements/src/limits/` — usage limit engine and service
- `packages/entitlements/src/beta/` — beta access engine and service
- `packages/entitlements/src/localization/` — localization engine and service
- `packages/entitlements/src/cache/` — evaluation cache (memory + Upstash)
- `packages/entitlements/src/provisioning/` — database and rollout bundle mappers
- `packages/entitlements/src/audit/entitlement-audit.ts` — audit event builder
- Governance tests under `packages/entitlements/src/__tests__/`

**Out of scope**

- ERP module manifest registry authoring (`fdr-006-feature-manifest`)
- AppShell nav projection (`fdr-001-manifest-nav`)
- Accounting entitlement rules and `@afenda/accounting` runtime (ADR-0010)
- Billing/plan enforcement UI (future BRD)
- `@afenda/feature-flags` package disposition (`fdr-009-rollout-flags` — separate PKG-009)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate capability keys, entitlement keys, or module IDs outside PKG-006 authority files |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-006 | **Sequential** with `fdr-006-feature-manifest` — same `runtimeOwner`; FDR doc authoring may batch (sibling exception); implementation slices must not run in parallel on `packages/entitlements` |
| Implementation blocked until | `PKG006_ENTITLEMENTS` registry row onboarded; Research Slice 1 complete |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25 audit re-run). Research reconciled runtime matrix **implemented** with FDR delivery evidence grades; registry onboarding remains Slice 0.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| What runtime evidence exists for `@afenda/entitlements`? | **Yes** — 48 source files; public barrel in `index.ts`; 52 unit tests pass (2 live cache tests skipped) | `pnpm --filter @afenda/entitlements test:run` exit 0 |
| Which registry row is required? | **`PKG006_ENTITLEMENTS`** with domain `entitlements`, lane `green-lane`, gates as §Registry link | Not in `foundation-disposition.registry.ts` — gap `entitlements-registry-entry` |
| Does evaluation produce audit evidence on denial? | **Yes** — `evaluateCapability` returns `audit` on `not_entitled`, `limit_exceeded`, `beta_required`, etc. | `index.test.ts` denial assertions |
| Are tenant/company/environment scopes enforced? | **Yes** — `resolveEntitlement` filters by scope in `entitlement-engine.ts` | `entitlement-engine.ts`; `index.test.ts` |
| What blocks FDR status promotion? | Registry entry missing; peer review (DoD #14) | §Remaining gaps; §Enterprise benchmark qualification |
| Relationship to feature-manifest subdomain? | Manifest registry files live in same package but owned by **`fdr-006-feature-manifest`** | `feature-manifest.registry.ts` — sibling FDR |

### Files to inspect

| Path | Why |
| --- | --- |
| `packages/entitlements/src/index.ts` | Public export surface (TIP-008 barrel) |
| `packages/entitlements/src/evaluation/entitlement-engine.ts` | Core entitlement resolution |
| `packages/entitlements/src/evaluation/capability-evaluation.ts` | Capability decision + audit |
| `packages/entitlements/src/evaluation/capability-registry.ts` | Capability → entitlement key map |
| `packages/entitlements/src/contracts/` | Contract stability authority |
| `packages/entitlements/src/__tests__/index.test.ts` | Governance gate (7 tests) |
| `packages/entitlements/src/cache/evaluation-cache.ts` | Performance / cache NFR |
| `packages/entitlements/src/provisioning/database-bundle.mapper.ts` | DB bundle → evaluation data |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | `@afenda/entitlements` package row |

### Baseline gate log (Research Slice 1 — 2026-06-25 audit re-run)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/entitlements typecheck` | 0 | A |
| `pnpm --filter @afenda/entitlements test:run` | 0 | A (52 tests) |
| `pnpm --filter @afenda/entitlements check:governance` | 0 | A (7 governance tests) |
| `pnpm exec biome check packages/entitlements` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm ci:biome` (repo-wide) | not run | — (PKG-scoped biome exit 0; monorepo hygiene deferred) |

## Runtime evidence (2026-06-25)

| Artifact | Path | Proven |
| --- | --- | --- |
| Public package barrel | `packages/entitlements/src/index.ts` | Yes — Grade A (`check:governance` exit 0) |
| Entitlement contracts | `packages/entitlements/src/contracts/entitlement.contract.ts` | Yes — Grade B (file + contract existence test) |
| Entitlement engine | `packages/entitlements/src/evaluation/entitlement-engine.ts` | Yes — Grade B (`index.test.ts` resolution tests) |
| Capability evaluation | `packages/entitlements/src/evaluation/capability-evaluation.ts` | Yes — Grade A (denial + allow paths in `index.test.ts`) |
| Capability registry | `packages/entitlements/src/evaluation/capability-registry.ts` | Yes — Grade B (deterministic registry test) |
| Feature flag engine | `packages/entitlements/src/flags/feature-flag-engine.ts` | Yes — Grade B (`index.test.ts`) |
| Kill switch engine | `packages/entitlements/src/flags/kill-switch-engine.ts` | Yes — Grade B (`index.test.ts` kill_switch_active) |
| Usage limit engine | `packages/entitlements/src/limits/usage-limit-engine.ts` | Yes — Grade B (`index.test.ts` limit_exceeded) |
| Beta access | `packages/entitlements/src/beta/beta-access-engine.ts` | Yes — Grade B (`index.test.ts` beta_required) |
| Localization engine | `packages/entitlements/src/localization/localization-engine.ts` | Yes — Grade B (`index.test.ts` localization_required) |
| Audit builder | `packages/entitlements/src/audit/entitlement-audit.ts` | Yes — Grade B (audit object shape in denial test) |
| Evaluation cache | `packages/entitlements/src/cache/evaluation-cache.ts` | Yes — Grade A (`evaluation-cache.test.ts` 3 tests) |
| DB bundle mapper | `packages/entitlements/src/provisioning/database-bundle.mapper.ts` | Yes — Grade A (`database-bundle.mapper.test.ts`) |
| Rollout mapper | `packages/entitlements/src/provisioning/rollout-bundle.mapper.ts` | Yes — Grade A (`rollout-bundle.mapper.test.ts`) |
| Tier fixtures | `packages/entitlements/src/fixtures/tier-fixtures.ts` | Yes — Grade A (`tier-fixtures.test.ts` 27 tests) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| ~~`entitlements-registry-entry`~~ | ~~No `PKG006_ENTITLEMENTS` row in foundation disposition registry~~ | green | `foundation-registry-owner` | **Closed 2026-06-25** | Registry-sync Slice 0 |
| `entitlements-fdr-research-slice-1` | ~~FDR Research Slice 1 not formally executed~~ **Closed** (2026-06-25 audit) | green | fdr-author | — | Research attestation + Partially Implemented promotion |
| `entitlements-consumer-integration` | ERP runtime consumes manifest exports; full entitlement evaluation wiring in ERP not tracked here | green | PKG-007 FDR chain | Post registry | Consumer integration tests cited in matrix |
| `entitlements-peer-review` | DoD #14 peer review not recorded | green | Architecture Authority | Complete | PR approval evidence |

## §Matrix drift gaps

> Reconciles FDR delivery status vs [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md).

| Matrix row | Matrix status | FDR status (post-audit) | Gap | Close condition |
| --- | --- | --- | --- | --- |
| Entitlements evaluation | **implemented** | **Partially Implemented** 26/30 audit-adjusted | DoD #14 peer review; ERP consumer wiring | Evidence-sync / peer review |
| Feature Manifest (upstream) | **implemented** | sibling `fdr-006-feature-manifest` Partially Implemented | Same PKG-006 registry gap | Registry-sync Slice 0 on both FDRs |

## §Enterprise readiness score

> **Registry-sync Slice 0 (2026-06-25):** `PKG006_ENTITLEMENTS` onboarded; hard cap lifted — **26/30 audit-adjusted**. Final **Complete** blocked on DoD #14 peer review ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).
>
> Score 0–5 per dimension (integers only). Every point maps to gate exit 0, test path, or explicit §Waivers row.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + 10 required contract files in `index.test.ts` — Grade A | — |
| Test coverage | 5/5 | `test:run` exit 0 (52 tests) + `check:governance` (7 tests) — Grade A | — |
| Observability + audit | 4/5 | `evaluateCapability` denial audit in `index.test.ts`; `createEntitlementAuditEvent` — Grade B | ERP consumer wiring out of PKG-006 scope |
| Security + RBAC + RLS | 4/5 | Denial paths (`not_entitled`, `kill_switch_active`, `limit_exceeded`); tenant scope in engine — Grade B | ERP RBAC wiring tracked under PKG-007 |
| Documentation + BRD traceability | 5/5 | FDR + registry row + index + drift exit 0 — Grade A | DoD #14 peer review `[ ]` |
| Maintainability + Clean Core | 5/5 | Registry row + PKG gates exit 0; Clean Core B — Grade A | Slice 0 registry onboarded |
| **Total (audit-adjusted)** | **26/30** | **~8.7 / 10 equivalent** — registry hard cap lifted | DoD #14 peer review pending |
| **Total (evidence-qualified ceiling)** | **26/30** | Matches audit-adjusted; peer review pending | Not 9.5 until ≥29/30 |

## §Clean Core classification

| Level | Meaning | Allowed for red-lane / gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — evaluation authority at `@afenda/entitlements` package boundary; public contracts exported via stable barrel; capability keys centralized in `capability-registry.ts`.

**Rule: red-lane or gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` | `listErpModuleManifests`, manifest types (manifest subdomain) | No | B→B |
| `@afenda/appshell` | Manifest types via entitlements (nav) | No | B→B |
| `@afenda/database` | `createPermissionKey` (upstream only) | No | B→B |
| Future ERP services | `evaluateCapability`, `resolveEntitlement`, cache factories | TBD | B→B |

**CEMLI classification:** Extension — new registry-driven evaluation surface; no modification of `@afenda/database` schema in this FDR.

Upstream consumers scan: ERP imports manifest exports from `@afenda/entitlements`; broader evaluation API is exported but not yet wired as primary ERP gate in matrix evidence.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SAP Authorization Objects | Oracle RBAC policies | `pnpm --filter @afenda/entitlements test:run` | 2 |
| SAP GRC SoD | Oracle role segregation | §SoD evidence + denial tests | 17 |
| SOLMAN | FDD testable AC | Gherkin §Acceptance criteria | 2 |
| SAP namespace / dependency governance | CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| ATC | Quality standards | `pnpm exec biome check packages/entitlements` | 5 |
| SAP ATC type safety | Oracle FDD contract stability | `pnpm --filter @afenda/entitlements typecheck` | 4 |

## §BRD traceability

> No orphan AC rows. Every acceptance criterion maps to internal requirement or archive input.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Entitlement resolution respects tenant/company/environment scope | 2 | `index.test.ts` |
| internal | Capability evaluation denies missing entitlements with audit evidence | 17 | `index.test.ts` |
| internal | Usage limits, beta, localization, and kill switches block capability access | 2 | `index.test.ts` |
| internal | Public contract surface stable (TIP-008 barrel) | 18 | `check:governance` |
| internal | Evaluation cache deterministic keying | 11 | `evaluation-cache.test.ts` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | `evaluateCapability` returns governed decision results for all blocking conditions | `index.test.ts` (7 tests) |
| Performance efficiency | Evaluation cache reduces repeat lookups; memory cache tested | `evaluation-cache.test.ts`; optional Upstash live tests skipped |
| Compatibility | JSON-safe capability registry; no plan-name drift in source | `index.test.ts` capability + drift tests |
| Security | Denial paths emit audit evidence; scoped entitlement lookup | `index.test.ts` denial assertions |
| Maintainability | Strict typecheck; governance gate on public exports | `typecheck` + `check:governance` exit 0 |
| Reliability | Deterministic capability registry and tier fixtures | `tier-fixtures.test.ts` (27 tests) |
| Documentation | FDR + index aligned when registry onboarded | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| Entitlement evaluation (read/decision path) | N/A — decision engine; mutations live in provisioning consumers | — |
| Kill switch activation (future ERP admin) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |
| Domain mutations (general) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-006-entitlements**
- Registry: `PKG006_ENTITLEMENTS` _(pending)_ — **blocks Complete**
- Sibling: [`fdr-006-feature-manifest`](%5BPartially%20Implemented%5D%20fdr-006-feature-manifest.md) — sequential on same `runtimeOwner`
- Upstream: `@afenda/database` permission key authority
- Downstream consumer: [`fdr-001-manifest-nav`](%5BPartially%20Implemented%5D%20fdr-001-manifest-nav.md) — reads manifest exports only
- Archive input: TIP-008 contracts (historical)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-006-entitlements.md` | — | Modified per slice |
| `packages/architecture-authority/src/data/foundation-disposition.registry.ts` | `@afenda/architecture-authority` | Modified (**Registry-sync** — `foundation-registry-owner` only) |
| `packages/entitlements/src/evaluation/*.ts` | `@afenda/entitlements` | Modified (Implementation slices only) |
| `packages/entitlements/src/contracts/*.ts` | `@afenda/entitlements` | Modified (Implementation slices only) |
| `packages/entitlements/src/__tests__/*.ts` | `@afenda/entitlements` | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm --filter @afenda/entitlements typecheck`
- `pnpm --filter @afenda/entitlements test:run`
- `pnpm --filter @afenda/entitlements check:governance`
- `pnpm quality:boundaries`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`

## Acceptance criteria

```gherkin
Feature: Governed entitlement evaluation authority

  Scenario: Scoped entitlement resolves enabled for matching tenant
    GIVEN entitlements include key "module.accounting.enabled" scoped to tenant "tenant_afenda"
    AND lookup context tenantId is "tenant_afenda"
    WHEN resolveEntitlement is called for "module.accounting.enabled"
    THEN enabled is true
    AND matching entitlement contract is returned

  Scenario: Missing entitlement denies capability with audit evidence
    GIVEN the actor context is resolved with tenantId "tenant_afenda"
    AND entitlements list is empty
    WHEN evaluateCapability is called for capabilityKey "accounting"
    THEN result is "not_entitled"
    AND audit evidence includes tenantId and correlationId

  Scenario: Kill switch blocks capability even when entitled
    GIVEN entitlements grant module.ai_copilot.enabled
    AND kill switch "module.ai_copilot.kill_switch" is active
    WHEN evaluateCapability is called for capabilityKey "aiCopilot"
    THEN result is "kill_switch_active"

  Scenario: Usage limit exceeded blocks capability
    GIVEN beta and entitlement prerequisites are satisfied for aiCopilot
    AND usage limit "ai.tokens.monthly" is at maximum
    WHEN evaluateCapability is called for capabilityKey "aiCopilot"
    THEN result is "limit_exceeded"

  Scenario: Public contract surface remains stable
    GIVEN required TIP-008 contract files exist under packages/entitlements/src/contracts/
    WHEN check:governance runs index.test.ts
    THEN PACKAGE_NAME is "@afenda/entitlements"
    AND entitlementTypes and entitlementDecisionResults match governed literals
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + tests | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/entitlements test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/entitlements typecheck` | [x] |
| 5 | Biome clean | `pnpm exec biome check packages/entitlements` | [x] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix `@afenda/entitlements` row | [ ] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [ ] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | registry + capability-registry.ts | [ ] |
| 17 | Security negative path tested | denial tests in `index.test.ts` | [x] |
| 18 | Public API compatibility verified | `check:governance` + barrel exports | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score table complete | [x] |

## Slices

### Slice 0 — Registry-sync (PKG006_ENTITLEMENTS onboarding)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Registry-sync  
**Risk class:** Low  
**Clean Core impact:** B→B

#### Design (internal-guide)

Onboard `PKG006_ENTITLEMENTS` row on PKG-006 via `foundation-registry-owner` only. Research Slice 1 attested evaluation authority across `packages/entitlements` — registry row must mirror §Registry link (domain `entitlements`, green-lane, gates incl. `check:governance`, prohibited, evidence paths). Lifts ENTERPRISE-BENCHMARK §3.1 hard cap from 22/30 audit-adjusted. **Combined** with `fdr-006-feature-manifest` Slice 0 in single registry-owner commit (2026-06-25).

**Outcomes (delivered 2026-06-25):**

- `PKG006_ENTITLEMENTS` row added to `foundation-disposition.registry.ts`
- `foundation-disposition.md` synced; fdr-status-index + matrix updated
- Gap `entitlements-registry-entry` closed; DoD #6 `[x]`
- Audit-adjusted readiness lifted to **26/30**

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-006-entitlements.md

1. Objective    — Add PKG006_ENTITLEMENTS row to foundation disposition registry with gates, prohibited rules, allowedAgents, and runtime evidence paths; sync disposition view, matrix entitlements row, and fdr-status-index registry column so DoD #6 passes and audit-adjusted readiness cap lifts above 22/30.
2. Allowed layer— packages/architecture-authority/src/data/; docs/architecture/foundation-disposition.md; docs/delivery/FDR/; docs/delivery/fdr-status-index.md; docs/architecture/afenda-runtime-truth-matrix.md
3. Files        —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   docs/architecture/foundation-disposition.md
   docs/delivery/FDR/[Partially Implemented] fdr-006-entitlements.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/entitlements/ source edits; apps/ edits; foundation-disposition.registry.ts edits by non-owner agents; do-not-create-accounting-package; PKGR01_ACCOUNTING paths (ADR-0010); do-not-duplicate-manifest-module-ids-outside-registry; editing feature-manifest.registry.ts (sibling fdr-006-feature-manifest authority)
5. Authority    — ADR-0014 · ADR-0016 · §Registry link proposed snapshot (PKG006_ENTITLEMENTS)
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm check:foundation-disposition
   pnpm quality:architecture
   pnpm check:documentation-drift
7. Closes       — Gap entitlements-registry-entry; DoD #6; partial entitlements-peer-review (registry prerequisite only — DoD #14 remains open)
8. Evidence     —
   packages/entitlements/src/index.ts
   packages/entitlements/src/evaluation/entitlement-engine.ts
   packages/entitlements/src/evaluation/capability-evaluation.ts
   packages/entitlements/src/evaluation/capability-registry.ts
   packages/entitlements/src/__tests__/index.test.ts
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
9. Attestation  — Documentation (registry row + matrix/index synced); Maintainability (disposition hard cap lifted — ENTERPRISE-BENCHMARK §3.1); Contract stability (registry gates include check:governance per §Acceptance gate)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 6 | Registry aligned | `pnpm check:foundation-disposition` |

#### Known debt

- `entitlements-peer-review` — DoD #14 Architecture Authority PR approval deferred to Complete promotion
- `entitlements-consumer-integration` — ERP evaluation wiring remains PKG-007 FDR chain; out of Slice 0 scope
- `fdr-006-feature-manifest` Slice 0 registry commit must merge first or serialize — shared `foundation-disposition.registry.ts`
- Slice 2 (Implementation closeout) blocked until this slice Delivered

### Slice 1 — Research (entitlements authority)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Medium  
**Clean Core impact:** B→B

**Purpose:** Formalize Research attestation; reconcile runtime matrix **implemented** vs FDR **Not started**; run baseline gates; update §Remaining gaps, §Matrix drift gaps, and dual readiness scores. No source edits.

**Outcomes:**

- Closed gap `entitlements-fdr-research-slice-1`
- Status promoted to **Partially Implemented**
- Readiness: **22/30 audit-adjusted**, **26/30 evidence-qualified ceiling**
- Slice 0 (Registry-sync) remains critical path before ceiling applies

### Slice 2 — Implementation (evaluation closeout)

**Status:** Not started  
**Prerequisite:** Slice 0 + Slice 1 Complete  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** B→B

**Purpose:** Close open DoD rows (boundaries, biome, matrix, drift); ERP consumer integration evidence if in scope.

**Expected deliverables:** DoD rows 3, 5, 6, 7, 9, 10, 16 marked `[x]` with gate paths.

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Registry-sync | Revert registry commit via `foundation-registry-owner` | Safe — restore prior disposition snapshot |
| Research | Revert FDR doc commit | Safe — no runtime change |
| Implementation | Revert entitlements package commit; rebuild | Quarterly-release-safe; no hand-edited DB objects |

Oracle analog: confirm upgrade-safe — evaluation logic changes are package-versioned. SAP analog: transport rollback = git revert + gate re-run.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `entitlements-e2e` | Browser E2E for entitlement evaluation | Unit + governance tests prove decision engine; ERP E2E tracked under PKG-007 | Architecture Authority | External beta go-live |
| ~~`entitlements-registry-hard-cap`~~ | ~~Enterprise 9.5 (29/30) until registry row exists~~ | ENTERPRISE-BENCHMARK §3.1 hard fail | Architecture Authority | **Closed 2026-06-25** | `PKG006_ENTITLEMENTS` onboarded Slice 0 |

## §Knowledge transfer

### Operational runbook

- Public entry: `packages/entitlements/src/index.ts` — import `evaluateCapability`, `resolveEntitlement`, `entitlement`, cache factories
- Capability authority: `packages/entitlements/src/evaluation/capability-registry.ts`
- Decision engine: `packages/entitlements/src/evaluation/capability-evaluation.ts`
- Scope rules: `packages/entitlements/src/evaluation/entitlement-engine.ts`
- Tier test fixtures: `packages/entitlements/src/fixtures/tier-fixtures.ts`

### Observability

- Denial audit shape: `createEntitlementAuditEvent` in `packages/entitlements/src/audit/entitlement-audit.ts`
- Correlation: pass `correlationId` into `evaluateCapability` input
- Cache probe: `evaluation-cache.test.ts`; Upstash live tests optional (`upstash-evaluation-cache.live.test.ts` skipped in CI)

### On-call escalation

- Symptom: capability wrongly allowed → verify entitlement list + scope in `resolveEntitlement`; run `index.test.ts`
- Symptom: cache stale decisions → bypass with fresh evaluator or flush cache key via `buildEvaluationCacheKey`
- Owner: `@afenda/entitlements` (PKG-006) pending registry `allowedAgents`

## §Enterprise benchmark qualification

This FDR is **Partially Implemented with evidence-qualified ceiling at 26/30**, not **Complete — enterprise 9.5 accepted**, because:

1. **`PKG006_ENTITLEMENTS` registry row is missing** — hard-caps audit-adjusted score at **22/30** per [ENTERPRISE-BENCHMARK.md §3.1](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md).
2. **DoD #14 peer review** remains open.
3. **Matrix row is implemented** but FDR delivery authority lagged — closed for Research; registry sync still pending.

The **26/30 evidence-qualified ceiling** applies only when:

1. `foundation-registry-owner` completes Registry-sync Slice 0.
2. §Waivers remain valid at merge time.
3. No dimension falls below 4/5 (current dimension scores support this).

**Promotion to Complete — enterprise 9.5 accepted requires:** registry onboarded, total ≥29/30, DoD #14 closed, matrix + index synced.

## Verdict

**Partially Implemented — 26/30 audit-adjusted (26/30 ceiling), pending DoD #14 peer review.**

Research Slice 1 complete (2026-06-25). Registry-sync Slice 0 complete (2026-06-25): `PKG006_ENTITLEMENTS` onboarded; hard cap lifted; DoD #6 closed. Runtime quality supports **26/30** audit-adjusted. Evidence-sync and peer review remain before Complete promotion.
