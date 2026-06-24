# TIP-008 — Master Data Authority

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** (split scope — do not mark Complete until both features pass) |
| **Authority status** | **Accepted** — ADR-0011 multi-level company model is foundational (2026-06-23) |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 1 — Architecture Authority |
| **Remaining gap** | TIP-008B runtime contracts deferred to domain TIPs; overall TIP Complete blocked until both feature gates pass |

This TIP is split into two features under one delivery document. **Do not mark TIP-008 Complete until TIP-008A and TIP-008B each pass their gates.**

| Feature | Status | Runtime evidence | Remaining gap |
| --- | --- | --- | --- |
| **TIP-008A** — Enterprise Hierarchy Authority | **Complete** | All DoD A1–A9 + sign-off checklist S1–S7 (Slice 5) | None — maintain only |
| **TIP-008B** — Business Master Data Authority | **Partially Implemented** | Authority map in glossary + dependency registry | Runtime contracts deferred to domain TIPs |

## Purpose

Establish governed master data authority before business domain packages (PKG-R01–R05) or Accounting Core (ADR-0010).

**TIP-008A** freezes the enterprise hierarchy model — entity groups, legal entities, ownership interests, and consolidation scope boundaries — so RBAC, RLS, and future accounting inherit correct dimensions without destructive migration.

**TIP-008B** freezes canonical ownership for ERP **business** master data entities (Customer, Product, Employee, Warehouse, and reserved peers) so no domain package duplicates definitions across accounting, inventory, HRM, and CRM.

ADR-0011 authority: multi-level company / holding / subsidiary / minority interest model is a **pre-accounting foundation requirement**, not an accounting-domain afterthought.

## Scope

**In scope (overall)**

- Enterprise hierarchy authority contracts and persistence (008A)
- Consolidation scope derivation — **scope only, no arithmetic** before ADR-0010 gate (008A)
- Business master data authority contract map and identity rules (008B — documentation only)
- Kernel operating-context registry alignment
- Contract tests and documentation drift alignment

**Out of scope (overall)**

- Consolidation accounting logic (eliminations, NCI, equity method postings) — blocked until ADR-0010
- Business master data database migrations or domain services (008B)
- Domain package creation (PKG-R01–R05)
- UI surfaces for master data administration (TIP-UI-04/05)
- Accounting Core contracts (TIP-013+)

## Package ownership

| Package | Role | Feature |
| --- | --- | --- |
| `@afenda/database` (PKG-002) | Entity group + ownership interest schemas, services, contract tests | 008A |
| `@afenda/kernel` (PKG-003) | Entity group, ownership interest, consolidation scope context contracts | 008A |
| `@afenda/erp` (PKG-007) | Operating-context resolver wiring for consolidation scope | 008A |
| Architecture Authority | Business master data ownership map (delivery doc + registry) | 008B |

## Depends on

- TIP-001 Architecture Authority (Complete)
- TIP-007 ERP Platform Authority (partial) — platform entity vocabulary
- TIP-007/012 Enterprise Group Operating Context (partial) — multi-tenancy slice + hierarchy delivery evidence

## Blocks

- Foundation Phase 1 gate — TIP-008A contracts frozen + TIP-008B authority map drafted
- TIP-013 Accounting Core Contracts (master data references)
- All domain package creation (PKG-R01–R05)
- Permission scope grants for group vs subsidiary roles (ADR-0011 acceptance gate)

---

## Feature: TIP-008A — Enterprise Hierarchy Authority

| Field | Value |
| --- | --- |
| **Status** | **Complete** |
| **Foundation phase** | Phase 1 — Architecture Authority |
| **ADR** | ADR-0011 — multi-level company model is foundational |
| **Delivery evidence** | [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md) |
| **Remaining gap** | None — consolidation arithmetic correctly deferred to ADR-0010 |

### Purpose (008A)

Freeze the authority model for corporate groups, legal entities, and ownership interests. Capture consolidation **scope** (reporting boundary and treatment metadata) without consolidation **arithmetic**.

### Scope (008A)

**In scope**

- `entity_groups` and `legal_entity_ownership` persistence
- Kernel context contracts: `EntityGroupContext`, `OwnershipInterestContext`, `ConsolidationScopeContext`
- Non-accounting consolidation scope derivation from effective-dated ownership interests
- Contract tests for schema + context surfaces
- ERP operating-context integration for consolidation scope (read path)

**Out of scope**

- Eliminations, NCI calculations, equity method postings
- Group-level membership scope enforcement (registry stub only — see TIP-007/012)
- Business master data entities (008B)

### Runtime evidence (2026-06-23)

| Artifact | Path | Proven |
| --- | --- | --- |
| Entity groups schema | `packages/database/src/schema/entity-group.schema.ts` | Yes |
| Entity group service + contract | `packages/database/src/entity-group/` | Yes |
| Entity group contract tests | `packages/database/src/__tests__/entity-group.contract.test.ts` | Yes |
| Ownership interest schema | `packages/database/src/schema/legal-entity-ownership.schema.ts` | Yes |
| Ownership interest service + contract | `packages/database/src/ownership-interest/` | Yes |
| Ownership interest contract tests | `packages/database/src/__tests__/ownership-interest.contract.test.ts` | Yes |
| EntityGroupContext | `packages/kernel/src/context/entity-group-context.contract.ts` | Yes |
| OwnershipInterestContext | `packages/kernel/src/context/ownership-interest-context.contract.ts` | Yes |
| ConsolidationScopeContext | `packages/kernel/src/context/consolidation-scope-context.contract.ts` | Yes |
| Consolidation scope stub | `packages/kernel/src/context/consolidation-scope-resolution.stub.ts` | Yes — delegates to server |
| Consolidation scope resolver | `packages/kernel/src/context/consolidation-scope-resolution.server.ts` | Yes |
| ERP consolidation scope wiring | `apps/erp/src/lib/context/resolve-consolidation-scope.server.ts` | Yes |
| Context registry | `packages/kernel/src/context/context-registry.ts` | Yes |
| Stub contract tests | `packages/kernel/src/__tests__/accounting-readiness.contract.test.ts`, `context-registry.test.ts` | Yes |
| Consolidation arithmetic | — | **Correctly absent** (ADR-0010) |

### Requirements (008A)

1. Entity group and ownership interest tables persist tenant-scoped hierarchy data with effective dating.
2. Kernel context contracts are serializable, registry-listed, and exported from the public barrel.
3. Consolidation scope assigns per-investee `ConsolidationTreatment` from effective ownership interests — **no eliminations or arithmetic**.
4. ERP operating context resolver can derive `ConsolidationScopeContext` from persisted ownership data (non-accounting read path).
5. Contract tests prove schema invariants and context derivation without consolidation math.
6. Glossary and runtime matrix reflect 008A partial status — no "Not started" over-claim.

### Deliverables (008A)

| File | Package | Layer | New / Modified | Status |
| --- | --- | --- | --- | --- |
| `packages/database/src/schema/entity-group.schema.ts` | `@afenda/database` | Platform | **New** | Delivered |
| `packages/database/src/schema/legal-entity-ownership.schema.ts` | `@afenda/database` | Platform | **New** | Delivered |
| `packages/database/src/entity-group/` | `@afenda/database` | Platform | **New** | Delivered |
| `packages/database/src/ownership-interest/` | `@afenda/database` | Platform | **New** | Delivered |
| `packages/database/src/__tests__/entity-group.contract.test.ts` | `@afenda/database` | Platform | **New** | Delivered |
| `packages/database/src/__tests__/ownership-interest.contract.test.ts` | `@afenda/database` | Platform | **New** | Delivered |
| `packages/kernel/src/context/entity-group-context.contract.ts` | `@afenda/kernel` | Platform | **New** | Delivered |
| `packages/kernel/src/context/ownership-interest-context.contract.ts` | `@afenda/kernel` | Platform | **New** | Delivered |
| `packages/kernel/src/context/consolidation-scope-context.contract.ts` | `@afenda/kernel` | Platform | **New** | Delivered |
| `packages/kernel/src/context/consolidation-scope-resolution.stub.ts` | `@afenda/kernel` | Platform | **New** (stub) | Delivered |
| `packages/kernel/src/context/consolidation-scope-resolution.server.ts` | `@afenda/kernel` | Platform | **New** | Delivered |
| `apps/erp/src/lib/context/resolve-consolidation-scope.server.ts` | `@afenda/erp` | Application | **New** | Delivered |
| `packages/kernel/src/__tests__/consolidation-scope-resolution.test.ts` | `@afenda/kernel` | Platform | **New** | Delivered |

### Acceptance criteria (008A)

```gherkin
GIVEN an entity group with two effective-dated ownership interests
AND   one interest is inactive on the reporting date
WHEN  consolidation scope is derived for that reporting date
THEN  only effective interests appear in ConsolidationScopeContext.legalEntities
AND   each entry carries consolidationTreatment and ownershipPercentage
AND   no elimination, NCI, or posting logic runs

GIVEN a tenant with persisted entity group and ownership interest rows
WHEN  the ERP operating context resolver runs on a protected route
THEN  ConsolidationScopeContext is populated from database-backed ownership data
AND   derivation uses the governed resolver — not ad-hoc inline logic in apps/erp

GIVEN ADR-0010 Accounting Readiness Gate has NOT passed
WHEN  consolidation scope is resolved
THEN  only scope metadata is returned
AND   no journal, ledger, or consolidation arithmetic modules are introduced

GIVEN entity group and ownership interest schemas
WHEN  contract tests run
THEN  schema invariants and effective-dating rules pass
AND   kernel context registry includes all three hierarchy context modules
```

### Acceptance criteria proof (008A)

| Scenario | Proof |
| --- | --- |
| Effective-dated scope derivation | `packages/kernel/src/__tests__/consolidation-scope-resolution.test.ts`; `accounting-readiness.contract.test.ts`; `context-registry.test.ts` |
| No consolidation arithmetic | Stub JSDoc + absence of accounting packages; ADR-0010 gate |
| Entity group schema invariants | `packages/database/src/__tests__/entity-group.contract.test.ts` |
| Ownership interest schema invariants | `packages/database/src/__tests__/ownership-interest.contract.test.ts` |
| ERP resolver wiring from DB | `apps/erp/src/lib/context/__tests__/resolve-consolidation-scope.server.test.ts`; `accounting-readiness-integration.test.ts` |
| Context registry completeness | `packages/kernel/src/__tests__/context-registry.test.ts` |

### Definition of Done — subset (008A)

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| A1 | Entity group schema + service exist | Deliverables table | [x] |
| A2 | Ownership interest schema + service exist | Deliverables table | [x] |
| A3 | Kernel hierarchy context contracts registered | `context-registry.test.ts` | [x] |
| A4 | Consolidation scope stub derives treatment without arithmetic | `accounting-readiness.contract.test.ts` | [x] |
| A5 | Database contract tests pass | `pnpm --filter @afenda/database test:run` | [x] |
| A6 | Kernel context tests pass | `pnpm --filter @afenda/kernel test:run` | [x] |
| A7 | Production consolidation scope resolver (non-accounting) | `consolidation-scope-resolution.server.ts` + tests | [x] |
| A8 | ERP operating context wires resolver | `resolve-consolidation-scope.server.ts` + integration test | [x] |
| A9 | ADR-0011 acceptance gate rows for hierarchy contexts | `pnpm check:documentation-drift` + ADR-0011 §Acceptance Gate | [x] |

---

## Feature: TIP-008B — Business Master Data Authority

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** |
| **Foundation phase** | Phase 1 — Architecture Authority |
| **Runtime evidence** | Authority map — glossary §Business Master Data + dependency registry |
| **Remaining gap** | Runtime contracts deferred to domain TIPs after Phase 1 gate |

### Purpose (008B)

Establish canonical ownership for ERP **business** master data entities before any business domain package is created. Prevents duplicate Customer, Product, Employee, and Warehouse definitions across accounting, inventory, HRM, and CRM.

### Scope (008B)

**In scope**

- Master data authority contract map (this document §008B + registry alignment)
- Canonical entity ownership (create, read, approve, audit) — **documentation only**
- Identity rules (keys, uniqueness, tenant/company scope) — **documentation only**
- Reserved domain package alignment (PKG-R01–R05)

**Out of scope**

- Domain implementation (TIP-013+)
- Database migrations for business master data tables
- UI surfaces (TIP-UI-04/05)
- Runtime services, APIs, or kernel context modules for business entities

### Requirements (008B)

1. Every listed business master data entity has a single owning domain authority and reserved package ID.
2. Identity rules document tenant/company scope, natural keys, and cross-reference constraints.
3. No `@afenda/crm`, `@afenda/inventory`, `@afenda/hrm`, or `@afenda/procurement` packages are created under 008B.
4. Ownership map is referenced by TIP-007 platform authority map and blocks domain package scaffolding until accepted.
5. TBD entities (Asset, Document) are explicitly flagged for future ADR — not silently assigned.

### Planned authority map (008B)

| Entity | Owning domain (planned) | Reserved package | Identity scope (planned) |
| --- | --- | --- | --- |
| Customer | CRM Authority | `@afenda/crm` (PKG-R04) | Tenant + company; external customer code unique per company |
| Supplier | Procurement Authority | `@afenda/procurement` (PKG-R05) | Tenant + company; vendor code unique per company |
| Product | Inventory Authority | `@afenda/inventory` (PKG-R02) | Tenant; SKU unique per tenant catalog |
| Employee | HRM Authority | `@afenda/hrm` (PKG-R03) | Tenant + company; employee number unique per company |
| Warehouse | Inventory Authority | `@afenda/inventory` (PKG-R02) | Tenant + company; warehouse code unique per company |
| Asset | Platform / TPM | TBD via ADR | — |
| Project | PM domain | TIP-030 | — |
| Document | Platform document service | TBD via ADR | — |

### Deliverables (008B)

| File | Package | Layer | New / Modified | Status |
| --- | --- | --- | --- | --- |
| `docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md` §008B | Architecture Authority | Delivery | **Modified** | Delivered |
| `docs/architecture/dependency-registry.md` (master data ownership rows) | Architecture Authority | Registry | **Modified** | Delivered |
| `docs/architecture/glossary.md` (business entity terms) | Architecture Authority | Registry | **Modified** | Delivered |

### Acceptance criteria (008B)

```gherkin
GIVEN the business master data authority map is drafted
WHEN  Architecture Authority reviews TIP-008B Slice 1
THEN  Customer, Product, Employee, and Warehouse each have one owning domain
AND   no duplicate ownership claims exist across PKG-R01–R05
AND   TBD entities are explicitly marked — not silently implemented

GIVEN TIP-008B Slice 1 is accepted
WHEN  a developer searches for Customer authority
THEN  this document and glossary terms resolve to CRM Authority → @afenda/crm
AND   no runtime Customer schema or service exists yet

GIVEN Phase 1 gate criteria
WHEN  TIP-008B authority map is drafted
THEN  dependency registry reflects reserved package ownership
AND   no business master data migrations are introduced
```

### Acceptance criteria proof (008B)

| Scenario | Proof |
| --- | --- |
| Four core entities mapped | This document § Planned authority map |
| No runtime business master data | Absence of CRM/inventory/HRM schemas; runtime matrix |
| Registry alignment | `docs/architecture/dependency-registry.md` (Slice 1) |
| Drift guard | `pnpm check:documentation-drift` |

### Definition of Done — subset (008B)

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| B1 | Customer, Product, Employee, Warehouse ownership assigned | This document § Planned authority map | [x] |
| B2 | Identity scope rules documented per core entity | This document + glossary | [x] |
| B3 | TBD entities flagged (Asset, Document) | This document | [x] |
| B4 | Dependency registry updated | `pnpm check:documentation-drift` | [x] |
| B5 | No business master data runtime introduced | Runtime matrix; package inventory | [x] |
| B6 | Phase 1 gate evidence row updated | `tip-status-index.md` via drift guard | [x] |

---

## Acceptance gate (overall)

- `pnpm --filter @afenda/database test:run`
- `pnpm --filter @afenda/kernel test:run`
- `pnpm --filter @afenda/erp test:run` (after 008A Slice 1)
- `pnpm quality:kernel-context-surface`
- `pnpm quality:boundaries`
- `pnpm check:multi-tenancy-enterprise-acceptance` (ADR-0011)
- `pnpm check:documentation-drift`

## Definition of Done (overall)

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | 008A entity group + ownership schemas delivered | 008A DoD A1–A2 | [x] |
| 2 | 008A kernel context contracts registered | 008A DoD A3 | [x] |
| 3 | 008A consolidation scope resolver (non-accounting) | 008A DoD A7–A8 | [x] |
| 4 | 008A ADR-0011 hierarchy gate rows | 008A DoD A9 | [x] |
| 5 | 008B authority map drafted for core entities | 008B DoD B1–B2 | [x] |
| 6 | 008B registry + glossary aligned | 008B DoD B4 | [x] |
| 7 | No consolidation arithmetic before ADR-0010 | ADR-0010 gate; stub contract tests | [x] |
| 8 | No business master data runtime | 008B DoD B5 | [x] |
| 9 | Runtime matrix updated | `pnpm check:documentation-drift` | [x] |
| 10 | TIP status index updated | `pnpm check:documentation-drift` | [x] |
| 11 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 12 | Completion report posted | afenda-coding-session §11 | [x] |

## Handoff to implementation

> **Mandatory before code edits.** Two features — dependency order: 008A Slice 1 (resolver) may proceed independently; 008B Slice 1 (authority map) is documentation-only and may run in parallel.

### Slice 1 — Consolidation scope resolver (008A)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** TIP-007/012 runtime evidence row `packages/database/src/schema/entity-group.schema.ts` = `partially-implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- `consolidation-scope-resolution.server.ts` is the canonical pure resolver; `consolidation-scope-resolution.stub.ts` re-exports for registry gate compatibility — no eliminations, NCI, or posting behavior.
- Resolver input comes from `@afenda/database` ownership-interest lookup services — not inline SQL in `apps/erp`.
- `deriveConsolidationScopeContext` remains pure; ERP wiring loads ownership interests and calls the governed function at the operating-context boundary.
- Consolidation arithmetic stays **blocked** until ADR-0010; JSDoc and tests must assert scope-only behavior.
- Do **not** overwrite `packages/entitlements/src/evaluation/capability-registry.ts` TIP-008 entitlement-evaluation capabilities.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md

1. Objective    — Replace consolidation scope stub with governed non-accounting resolver wired from database ownership interests into ERP operating context.
2. Allowed layer— packages/kernel/src/context/
                  packages/database/src/ownership-interest/ (read helpers only)
                  apps/erp/src/lib/context/
3. Files        — packages/kernel/src/context/consolidation-scope-resolution.server.ts (New)
                  packages/kernel/src/context/consolidation-scope-resolution.stub.ts (Modified — delegate or deprecate)
                  packages/kernel/src/context/index.ts (Modified)
                  packages/kernel/src/__tests__/consolidation-scope-resolution.test.ts (New)
                  apps/erp/src/lib/context/resolve-consolidation-scope.server.ts (New)
                  apps/erp/src/lib/context/__tests__/resolve-consolidation-scope.server.test.ts (New)
                  apps/erp/src/lib/context/resolve-operating-context.server.ts (Modified — delegate to resolveConsolidationScope)
                  apps/erp/src/lib/context/__tests__/accounting-readiness-integration.test.ts (Modified — wiring assertions)
                  docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, ledger/journal/COA/posting, consolidation eliminations/NCI arithmetic, ADR-0010 Accounting Core packages, business master data schemas (008B), packages/ui edits, overwriting evaluation/capability-registry.ts
5. Authority    — ADR-0011 — Platform Authority (kernel + database) + Application Authority (ERP resolver wiring)
6. Gates        — pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/kernel test:run
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/erp test:run
                  pnpm quality:kernel-context-surface
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| A7 | Production consolidation scope resolver | `pnpm --filter @afenda/kernel test:run` |
| A8 | ERP operating context wires resolver | `pnpm --filter @afenda/erp test:run` |
| 3 | Overall DoD — resolver delivered | Above gates |
| 9 | Runtime matrix updated | `pnpm check:documentation-drift` |
| 10 | TIP status index updated | `pnpm check:documentation-drift` |
| 11 | Drift guard passes | `pnpm check:documentation-drift` |

#### Known debt

- Group-level membership scope enforcement remains TIP-007/012 follow-on.
- Permission scope grants for subsidiary vs group roles deferred to Phase 3 RBAC proof (ADR-0011 acceptance gate row — sole remaining unchecked item).

### Slice 2 — Consolidation scope hardening (008A)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** 008A Slice 1 delivered — `consolidation-scope-resolution.server.ts` exists

#### Design (internal-guide)

- Extract explicit investee dedup policy to `consolidation-scope-investee-merge.policy.ts` with `CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY` (`last_wins_by_input_order`).
- Kernel internal imports use `.server.ts` — stub remains registry-compatible re-export only.
- Add accounting-readiness guard tests on consolidation resolver modules (no ledger/journal/accounting package references).
- Close ADR-0011 §Acceptance Gate documentation rows where evidence exists; permission-scope proof remains Phase 3.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md

1. Objective    — Harden consolidation scope resolver with explicit investee dedup policy, eliminate stub/server import drift, and close ADR-0011 hierarchy gate documentation rows.
2. Allowed layer— packages/kernel/src/context/
                  docs/architecture/
                  docs/adr/
                  docs/delivery/
3. Files        — packages/kernel/src/context/consolidation-scope-investee-merge.policy.ts (New)
                  packages/kernel/src/context/consolidation-scope-resolution.server.ts (Modified)
                  packages/kernel/src/context/consolidation-scope-resolution.stub.ts (Modified)
                  packages/kernel/src/context/consolidation-scope-context.contract.ts (Modified)
                  packages/kernel/src/context/accounting-readiness.contract.ts (Modified)
                  packages/kernel/src/context/context-registry.ts (Modified)
                  packages/kernel/src/context/index.ts (Modified)
                  packages/kernel/src/__tests__/consolidation-scope-resolution.test.ts (Modified)
                  docs/adr/ADR-0011-multi-level-company-model-foundational.md (Modified)
                  docs/architecture/glossary.md (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, ledger/journal/COA/posting, consolidation eliminations/NCI arithmetic, ADR-0010 Accounting Core packages, business master data runtime (008B), packages/ui edits
5. Authority    — ADR-0011 — Platform Authority (kernel consolidation scope)
6. Gates        — pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/kernel test:run
                  pnpm quality:kernel-context-surface
                  pnpm check:multi-tenancy-enterprise-acceptance
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| A9 | ADR-0011 acceptance gate rows for hierarchy contexts | `pnpm check:documentation-drift` |
| 4 | Overall DoD — ADR-0011 hierarchy gate rows | Above gates |

#### Known debt

- ADR-0011 permission-scope row closed via TIP-010 Slice 2 (`authorize-api-route.test.ts` + `entity-group-membership-scope.test.ts`).

### Slice 3 — ADR-0011 permission-scope evidence sync (008A)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** TIP-010 Slice 2 delivered — [`tip-010-api-rbac-wiring.md`]([Complete] tip-010-api-rbac-wiring.md)

#### Design (internal-guide)

- Documentation-only cross-link: TIP-008A ADR-0011 acceptance gate closes when TIP-010 proves entity_group vs subsidiary denial at API boundary.
- No new runtime packages — evidence lives in `@afenda/permissions` scope tests + `@afenda/erp` `authorizeApiRoute` tests.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md

1. Objective    — Close ADR-0011 permission-scope acceptance row with TIP-010 entity_group vs subsidiary API boundary test evidence and sync tip-008 / runtime matrix gaps.
2. Allowed layer— apps/erp/src/lib/api/__tests/
                  docs/adr/
                  docs/delivery/
                  docs/architecture/
3. Files        — apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts (Modified)
                  docs/adr/ADR-0011-multi-level-company-model-foundational.md (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md (Modified)
                  docs/delivery/tips/[Complete] tip-010-api-rbac-wiring.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, ledger/journal/COA/posting, packages/ui edits, new permission keys outside PERMISSION_REGISTRY, bypassing authorizeApiRoute
5. Authority    — ADR-0011 — Platform Authority + Permission Authority (TIP-010)
6. Gates        — pnpm --filter @afenda/erp test:run
                  pnpm --filter @afenda/permissions test:run
                  pnpm check:multi-tenancy-enterprise-acceptance
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| A9 | ADR-0011 acceptance gate — permission-scope proof | `pnpm check:multi-tenancy-enterprise-acceptance` |
| 4 | Overall DoD — ADR-0011 hierarchy gate rows | Above gates |

#### Known debt

- None for ADR-0011 acceptance gate — all six rows checked.

### Slice 1 — Business master data authority map (008B)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** None — documentation-only; may run parallel to 008A Slice 1

#### Design (internal-guide)

- Deliverable is **documentation and registry alignment only** — no schemas, services, or packages.
- Core four entities (Customer, Product, Employee, Warehouse) must have single owning domain; Supplier included for procurement boundary clarity.
- Asset and Document remain TBD — flag for future ADR, do not scaffold packages.
- Update glossary with business entity terms cross-referencing enterprise hierarchy vocabulary (008A) without conflating legal entity with business party records.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md

1. Objective    — Draft and accept business master data authority ownership map for Customer, Product, Employee, Warehouse (and Supplier) with identity rules — documentation only.
2. Allowed layer— docs/delivery/tips/
                  docs/architecture/
3. Files        — docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md (Modified)
                  docs/architecture/dependency-registry.md (Modified)
                  docs/architecture/glossary.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — packages/database migrations, domain packages (PKG-R01–R05), kernel context modules for business entities, apps/erp routes, ADR-0010 Accounting Core packages, runtime Customer/Product/Employee/Warehouse services
5. Authority    — Architecture Authority — master data ownership map
6. Gates        — pnpm check:documentation-drift
                  Architecture Authority review (manual)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| B1 | Core entity ownership assigned | Manual review + drift guard |
| B2 | Identity scope rules documented | Manual review |
| B4 | Dependency registry updated | `pnpm check:documentation-drift` |
| 5 | Overall DoD — authority map drafted | Manual review |
| 6 | Overall DoD — registry aligned | `pnpm check:documentation-drift` |
| 10 | TIP status index updated | `pnpm check:documentation-drift` |
| 11 | Drift guard passes | `pnpm check:documentation-drift` |

#### Known debt

- Asset and Document ownership requires future ADR before package scaffolding.
- Runtime contracts for business master data deferred to domain TIPs after Phase 1 gate.

### Slice 4 — Hierarchy RBAC hardening + status guard (008A)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 3 delivered — ADR-0011 acceptance gate closed

#### Design (internal-guide)

- Wire verified operating-context hierarchy dimensions (`entityGroupId`, `projectId`, `teamId`) into API authorization context — entity_group grants require group id, not company id alone.
- Add **positive** entity_group + subsidiary-in-group authorization at API boundary (pairs with Slice 3 denial test).
- Prove route permission matrix has **zero orphan entries** — derived exclusively from `API_CONTRACTS`.
- Add **Status guard** section — overall TIP must remain `[Partially Implemented]` until 008B runtime exists or Architecture Authority accepts authority-only closeout.
- 008A formal sign-off checklist documents remaining 008A-only gap without renaming overall TIP to Complete.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md

1. Objective    — Harden ADR-0011 hierarchy RBAC with entity_group subsidiary success path, anti-drift matrix parity test, and TIP-008 status guard preventing premature Complete.
2. Allowed layer— apps/erp/src/lib/api/
                  docs/delivery/tips/
                  docs/architecture/
3. Files        — apps/erp/src/lib/api/authorize-api-route.ts (Modified)
                  apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts (Modified)
                  apps/erp/src/lib/api/__tests__/api-route-permissions.test.ts (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, ledger/journal/COA/posting, hand-maintained permission maps outside API_CONTRACTS, marking TIP-008 Complete, packages/ui edits, 008B runtime schemas
5. Authority    — ADR-0011 — Platform Authority + Permission Authority (TIP-010 cross-evidence)
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm check:multi-tenancy-enterprise-acceptance
                  pnpm exec biome ci apps/erp/src/lib/api/authorize-api-route.ts apps/erp/src/lib/api/__tests__/authorize-api-route.test.ts apps/erp/src/lib/api/__tests__/api-route-permissions.test.ts
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | 008A formal sign-off checklist documented | Manual review |
| — | Status guard prevents premature Complete | `pnpm check:documentation-drift` |

#### Known debt

- 008B runtime contracts remain deferred — overall TIP stays Partially Implemented by design.

## Status guard (do not mark Complete prematurely)

| Gate | Required evidence | Blocks overall Complete |
| --- | --- | --- |
| **008A runtime** | A1–A9 all `[x]`; consolidation resolver + ADR-0011 closed | No — 008A may sign off independently |
| **008B runtime** | Domain package contracts OR explicit authority-only ADR | **Yes** — no `@afenda/crm` / inventory / hrm runtime yet |
| **Filename prefix** | `[Partially Implemented]` until both features pass gates | Drift guard fails on premature rename |
| **Permission matrix** | Derived from `API_CONTRACTS` only — no hand-maintained map | `api-route-permissions.test.ts` |

**Rule:** Do not rename this file to `[Complete]` until 008B runtime evidence exists or Architecture Authority publishes an authority-only closeout ADR for 008B.

## TIP-008A formal sign-off checklist

| # | Criterion | Evidence | Status |
|---|-----------|----------|--------|
| S1 | Entity group + ownership schemas | Deliverables + contract tests | [x] |
| S2 | Kernel hierarchy contexts registered | `context-registry.test.ts` | [x] |
| S3 | Consolidation scope resolver (non-accounting) | `consolidation-scope-resolution.server.ts` | [x] |
| S4 | ERP consolidation scope wiring | `resolve-consolidation-scope.server.ts` | [x] |
| S5 | ADR-0011 acceptance gate (6/6) | `ADR-0011-multi-level-company-model-foundational.md` | [x] |
| S6 | Entity_group subsidiary RBAC (deny + allow) | `authorize-api-route.test.ts` | [x] |
| S7 | Route matrix anti-drift | `api-route-permissions.test.ts` | [x] |

**008A sign-off:** **Complete** (2026-06-24, Slice 5). Does **not** imply overall TIP-008 Complete.

### Slice 5 — 008A formal sign-off + authorization context boundary (008A)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 4 delivered — entity_group subsidiary allow/deny RBAC + status guard

#### Design (internal-guide)

- Extract `toAuthorizationContextFromOperatingContext` to `api-route-context.ts` alongside `toAuthorizationContextInput` — single boundary module for API RBAC scope mapping.
- Unit-test hierarchy dimension mapping (`entityGroupId`, `projectId`, `teamId`) independently of `authorizeApiRoute` integration path.
- Mark **TIP-008A** feature Complete in feature table and runtime matrix; **overall TIP-008 filename stays `[Partially Implemented]`** until 008B runtime exists.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md

1. Objective    — Complete TIP-008A formal sign-off by normalizing API authorization context boundary module with unit tests and syncing docs while keeping overall TIP-008 Partially Implemented for 008B.
2. Allowed layer— apps/erp/src/lib/api/
                  docs/delivery/tips/
                  docs/architecture/
3. Files        — apps/erp/src/lib/api/api-route-context.ts (Modified)
                  apps/erp/src/lib/api/authorize-api-route.ts (Modified)
                  apps/erp/src/lib/api/__tests__/api-route-context.test.ts (New)
                  docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/accounting, ledger/journal/COA/posting, renaming overall TIP-008 to Complete, 008B runtime schemas, packages/ui edits
5. Authority    — ADR-0011 — Platform Authority + Permission Authority
6. Gates        — pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm check:multi-tenancy-enterprise-acceptance
                  pnpm exec biome ci apps/erp/src/lib/api/api-route-context.ts apps/erp/src/lib/api/authorize-api-route.ts apps/erp/src/lib/api/__tests__/api-route-context.test.ts
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | 008A formal sign-off | Manual review + gates above |
| — | Overall TIP remains Partially Implemented | Status guard + filename prefix |

#### Known debt

- 008B runtime contracts remain deferred — overall TIP stays Partially Implemented by design.
- Repo-wide `pnpm ci:biome` failures remain pre-existing outside slice scope.

### Slice 6 — Hierarchy context TypeScript boundary hardening (008A)

**Status:** Delivered  
**Prerequisite:** Slice 5 delivered — `packages/kernel/src/context/consolidation-scope-resolution.server.ts` = `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Keep **wire/JSON context interfaces** (`OwnershipInterestContext`, `ConsolidationScopeContext`, `EntityGroupContext`) as plain `string` id fields — serializable and backward compatible at rest.
- Brand IDs **only at resolver trust boundaries**: `DeriveConsolidationScopeInput` accepts `string | BrandedId` via existing `brand*` helpers; resolver internals use branded types where narrowing adds safety.
- Add missing `OwnershipInterestId` brand + `brandOwnershipInterestId` / `toOwnershipInterestId` and `toEntityGroupId` to close platform-id asymmetry.
- Canonical vocabulary: **`childLegalEntityId`** (kernel + DB authority record). Database `OwnershipInterestAuthorityRecord` exposes `childLegalEntityId` as primary; retain `investeeLegalEntityId` as deprecated read alias (same value) until domain TIPs remove it.
- Add `hierarchy-id-boundary.contract.ts` — single module for hierarchy id branding, wire-format types, and `assertHierarchyContextJsonSerializable` compile-time guard (no runtime overhead).
- ERP `toOwnershipInterestContext` maps from canonical `childLegalEntityId` (fallback to deprecated alias).
- Fix blocking `@afenda/database` typecheck drift: remove or restore `AuditValidationError` export in `public-api.ts` (minimal fix only — no audit behavior change).
- No consolidation arithmetic; no branded ID migration on unrelated context modules (tenant, legal entity, etc.) in this slice.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md

1. Objective    — Harden TIP-008A hierarchy TypeScript boundaries with branded-id trust inputs, serializability guards, canonical childLegalEntityId naming, and missing platform-id helpers without changing resolver behavior.
2. Allowed layer— packages/kernel/src/contracts/
                  packages/kernel/src/context/
                  packages/database/src/ownership-interest/
                  packages/database/src/public-api.ts (AuditValidationError export fix only)
                  apps/erp/src/lib/context/
3. Files        — packages/kernel/src/contracts/platform-id.contract.ts (Modified)
                  packages/kernel/src/context/hierarchy-id-boundary.contract.ts (New)
                  packages/kernel/src/context/ownership-interest-context.contract.ts (Modified)
                  packages/kernel/src/context/consolidation-scope-context.contract.ts (Modified)
                  packages/kernel/src/context/consolidation-scope-resolution.server.ts (Modified)
                  packages/kernel/src/context/index.ts (Modified)
                  packages/kernel/src/__tests__/hierarchy-id-boundary.test.ts (New)
                  packages/kernel/src/__tests__/consolidation-scope-resolution.test.ts (Modified)
                  packages/kernel/src/__tests__/context-registry.test.ts (Modified)
                  packages/database/src/ownership-interest/ownership-interest.contract.ts (Modified)
                  packages/database/src/__tests__/ownership-interest.contract.test.ts (Modified)
                  packages/database/src/public-api.ts (Modified — AuditValidationError export fix)
                  apps/erp/src/lib/context/to-ownership-interest-context.ts (Modified)
                  apps/erp/src/lib/context/__tests__/to-ownership-interest-context.test.ts (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — @afenda/accounting, ledger/journal/COA/posting, consolidation eliminations/NCI arithmetic, ADR-0010 Accounting Core packages, business master data runtime (008B), packages/ui edits, branded-id migration on non-hierarchy context modules, renaming overall TIP-008 to Complete
5. Authority    — ADR-0011 — Platform Authority (kernel hierarchy contracts + database ownership interest read model)
6. Gates        — pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/kernel test:run
                  pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/erp test:run
                  pnpm quality:kernel-context-surface
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | Hierarchy contracts boundary-safe + serializable | `pnpm --filter @afenda/kernel test:run` |
| — | Canonical childLegalEntityId across DB → kernel boundary | `pnpm --filter @afenda/database test:run` |
| A5 | Database contract tests pass | `pnpm --filter @afenda/database test:run` |
| A6 | Kernel context tests pass | `pnpm --filter @afenda/kernel test:run` |

#### Known debt

- Full branded-id migration for tenant/legal-entity context modules deferred to platform-wide batch (outside 008A).
- `investeeLegalEntityId` deprecated alias remains until domain package TIPs scaffold CRM/inventory/HRM.
- 008B runtime contracts remain deferred — overall TIP stays Partially Implemented by design.

## Verdict

| Feature | Verdict |
| --- | --- |
| **TIP-008 (overall)** | **Partially Implemented** — 008A Complete; 008B has no runtime — **do not rename to Complete** |
| **TIP-008A** Enterprise hierarchy | **Complete** — all DoD A1–A9 + sign-off checklist S1–S7 |
| **TIP-008B** Business master data | **Partially Implemented** — authority map only; runtime deferred |

**Phase 1 gate dependency:** 008A delivered + 008B authority map delivered. Overall TIP Complete blocked on 008B runtime or explicit authority-only ADR.
