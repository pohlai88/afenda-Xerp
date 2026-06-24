# TIP-008 — Master Data Authority

| Field | Value |
| --- | --- |
| **Status** | **Partially Implemented** (split scope — do not mark Complete until both features pass) |
| **Authority status** | **Accepted** — ADR-0011 multi-level company model is foundational (2026-06-23) |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 1 — Architecture Authority |
| **Remaining gap** | TIP-008A consolidation scope resolver (non-accounting); TIP-008B business master data authority map |

This TIP is split into two features under one delivery document. **Do not mark TIP-008 Complete until TIP-008A and TIP-008B each pass their gates.**

| Feature | Status | Runtime evidence | Remaining gap |
| --- | --- | --- | --- |
| **TIP-008A** — Enterprise Hierarchy Authority | **Partially Implemented** | Entity group + ownership schemas, kernel context contracts, consolidation stub | Consolidation scope resolver (non-accounting) + formal sign-off |
| **TIP-008B** — Business Master Data Authority | **Not started** | — | Customer, Product, Employee, Warehouse ownership map (no implementations) |

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
| **Status** | **Partially Implemented** |
| **Foundation phase** | Phase 1 — Architecture Authority |
| **ADR** | ADR-0011 — multi-level company model is foundational |
| **Delivery evidence** | [`tip-007-012-enterprise-group-operating-context.md`](tip-007-012-enterprise-group-operating-context.md) |
| **Remaining gap** | Consolidation scope resolver (non-accounting) + formal TIP-008A sign-off checklist |

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
| Consolidation scope stub | `packages/kernel/src/context/consolidation-scope-resolution.stub.ts` | Partial — authority stub only |
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
| `packages/kernel/src/context/consolidation-scope-resolution.server.ts` | `@afenda/kernel` | Platform | **New** | **Pending — Slice 1** |
| `apps/erp/src/lib/context/resolve-consolidation-scope.server.ts` | `@afenda/erp` | Application | **New** | **Pending — Slice 1** |
| `packages/kernel/src/__tests__/consolidation-scope-resolution.test.ts` | `@afenda/kernel` | Platform | **New** | **Pending — Slice 1** |

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
| Effective-dated scope derivation (stub) | `packages/kernel/src/__tests__/accounting-readiness.contract.test.ts`; `context-registry.test.ts` |
| No consolidation arithmetic | Stub JSDoc + absence of accounting packages; ADR-0010 gate |
| Entity group schema invariants | `packages/database/src/__tests__/entity-group.contract.test.ts` |
| Ownership interest schema invariants | `packages/database/src/__tests__/ownership-interest.contract.test.ts` |
| ERP resolver wiring from DB | **Pending — Slice 1** |
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
| A7 | Production consolidation scope resolver (non-accounting) | `consolidation-scope-resolution.server.ts` + tests | [ ] |
| A8 | ERP operating context wires resolver | `resolve-consolidation-scope.server.ts` + integration test | [ ] |
| A9 | ADR-0011 acceptance gate rows for hierarchy contexts | `pnpm check:documentation-drift` | [ ] |

---

## Feature: TIP-008B — Business Master Data Authority

| Field | Value |
| --- | --- |
| **Status** | **Not started** |
| **Foundation phase** | Phase 1 — Architecture Authority |
| **Runtime evidence** | None — no Customer, Product, Employee, Warehouse canonical contracts |
| **Remaining gap** | Authority ownership map draft (documentation only) |

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
| Customer | CRM Authority | `@afenda/crm` (PKG-R03) | Tenant + company; external customer code unique per company |
| Supplier | Procurement Authority | `@afenda/procurement` (PKG-R04) | Tenant + company; vendor code unique per company |
| Product | Inventory Authority | `@afenda/inventory` (PKG-R02) | Tenant; SKU unique per tenant catalog |
| Employee | HRM Authority | `@afenda/hrm` (PKG-R05) | Tenant + company; employee number unique per company |
| Warehouse | Inventory Authority | `@afenda/inventory` (PKG-R02) | Tenant + company; warehouse code unique per company |
| Asset | Platform / TPM | TBD via ADR | — |
| Project | PM domain | TIP-030 | — |
| Document | Platform document service | TBD via ADR | — |

### Deliverables (008B)

| File | Package | Layer | New / Modified | Status |
| --- | --- | --- | --- | --- |
| `docs/delivery/tips/[Partially Implemented] tip-008-master-data-authority.md` §008B | Architecture Authority | Delivery | **Modified** | **Pending — Slice 1** |
| `docs/architecture/dependency-registry.md` (master data ownership rows) | Architecture Authority | Registry | **Modified** | **Pending — Slice 1** |
| `docs/architecture/glossary.md` (business entity terms) | Architecture Authority | Registry | **Modified** | **Pending — Slice 1** |

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
| B1 | Customer, Product, Employee, Warehouse ownership assigned | This document § Planned authority map | [ ] |
| B2 | Identity scope rules documented per core entity | This document + glossary | [ ] |
| B3 | TBD entities flagged (Asset, Document) | This document | [ ] |
| B4 | Dependency registry updated | `pnpm check:documentation-drift` | [ ] |
| B5 | No business master data runtime introduced | Runtime matrix; package inventory | [x] |
| B6 | Phase 1 gate evidence row updated | `tip-status-index.md` via drift guard | [ ] |

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
| 3 | 008A consolidation scope resolver (non-accounting) | 008A DoD A7–A8 | [ ] |
| 4 | 008A ADR-0011 hierarchy gate rows | 008A DoD A9 | [ ] |
| 5 | 008B authority map drafted for core entities | 008B DoD B1–B2 | [ ] |
| 6 | 008B registry + glossary aligned | 008B DoD B4 | [ ] |
| 7 | No consolidation arithmetic before ADR-0010 | ADR-0010 gate; stub contract tests | [x] |
| 8 | No business master data runtime | 008B DoD B5 | [x] |
| 9 | Runtime matrix updated | `pnpm check:documentation-drift` | [ ] |
| 10 | TIP status index updated | `pnpm check:documentation-drift` | [ ] |
| 11 | Drift guard passes | `pnpm check:documentation-drift` | [ ] |
| 12 | Completion report posted | afenda-coding-session §11 | [ ] |

## Handoff to implementation

> **Mandatory before code edits.** Two features — dependency order: 008A Slice 1 (resolver) may proceed independently; 008B Slice 1 (authority map) is documentation-only and may run in parallel.

### Slice 1 — Consolidation scope resolver (008A)

**Status:** Not started  
**Prerequisite:** TIP-007/012 runtime evidence row `packages/database/src/schema/entity-group.schema.ts` = `partially-implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- `consolidation-scope-resolution.stub.ts` is the authority reference implementation — promote logic to `consolidation-scope-resolution.server.ts` without adding eliminations, NCI, or posting behavior.
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
- Permission scope grants for subsidiary vs group roles deferred to Phase 3 RBAC proof (ADR-0011 acceptance gate).

### Slice 1 — Business master data authority map (008B)

**Status:** Not started  
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

## Verdict

| Feature | Verdict |
| --- | --- |
| **TIP-008 (overall)** | **Partially Implemented** — 008A hierarchy foundation delivered; resolver + sign-off remain |
| **TIP-008A** Enterprise hierarchy | **Partially Implemented** — schemas, services, kernel contracts, and consolidation stub proven; production resolver pending |
| **TIP-008B** Business master data | **Not started** — planned ownership map only; no runtime |

**Phase 1 gate dependency:** TIP-008A contracts frozen (after Slice 1 resolver) + TIP-008B authority map drafted (Slice 1 documentation).
