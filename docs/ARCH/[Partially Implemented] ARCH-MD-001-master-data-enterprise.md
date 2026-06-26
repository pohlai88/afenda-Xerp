# ARCH-MD-001 — Master Data Enterprise Architecture

> **Template:** [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · **Index:** [`arch-status-index.md`](arch-status-index.md) · **Paired FDR:** [`fdr-010-master-data-authority`](../delivery/FDR/[Partially%20Implemented]%20fdr-010-master-data-authority.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-MD-001 |
| **Work ID** | ARCH-MD-001 · paired `fdr-010-master-data-authority` + future domain FDRs (PKG-R02–R05) |
| **Title** | Master Data Enterprise Architecture |
| **Status** | **Partially Implemented — architecture accepted, runtime not started** |
| **Package** | PKG-010 · `@afenda/kernel` (authority) + reserved PKG-R02–R05 (runtime deferred) |
| **Runtime owner (authority)** | `packages/kernel/src/contracts/business-master-data/` |
| **Lane** | green-lane (authority) · amber-lane (domain runtime + MDG-style workflows) |
| **Clean Core target** | A (authority) → B (domain extensions) |
| **Enterprise score target** | 29/30 at domain-runtime Complete; authority today 27/30 audit-adjusted ([fdr-010](../delivery/FDR/[Partially%20Implemented]%20fdr-010-master-data-authority.md)) |

> **Status clarification:** This ARCH establishes **authority, production classification, domain sequence, business key policy, and acceptance model**. It does **not** mean runtime master data (CRUD schemas, APIs, UI) exists. Kernel business master data remains `authority_only` until domain FDRs deliver PKG-R02–R05 runtime.

---

# 1. Execution instruction

You are executing an enterprise architecture delivery slice for Afenda business master data.

Produce implementation and evidence that meets architecture authority, runtime truth, package ownership, Clean Core boundaries, enterprise acceptance criteria, automated gate proof, and documentation sync.

**Slice 1 (this document) is docs-only research and roadmap.** Do not implement runtime schemas, APIs, services, UI, packages, or database migrations in Slice 1.

```text
/write-arch /architecture-authority

Execute ARCH-MD-001 Slice N from docs/ARCH/slices/ARCH-MD-001/slice-index.md.

Copy the 9-field handoff block from the slice file.
Run gates from handoff §6 before claiming delivered.
One slice per coding session.
```

---

# 2. Target item

| Field | Value |
| --- | --- |
| Work ID | ARCH-MD-001 |
| Title | Master Data Enterprise Architecture |
| Status | Partially Implemented — architecture accepted, runtime not started |
| Package | `@afenda/kernel` (authority) · reserved `@afenda/inventory`, `@afenda/crm`, `@afenda/procurement`, `@afenda/hrm` |
| Registry entry ID | PKG010_KERNEL (master-data-authority subdomain) |
| Runtime owner | `packages/kernel/src/contracts/business-master-data/` |
| Lane | green-lane (authority) / amber-lane (domain runtime) |
| Risk class | Low (authority) / Medium (domain runtime) |
| Change class | Governance / Research (Slice 1) |
| Clean Core target | A → B |
| Enterprise score target | 29/30 enterprise 9.5 (domain runtime Complete); not claimable on authority-only evidence |

---

# 3. Authority chain

Read in this order before touching code:

```text
1. docs/ARCH/arch-status-index.md
2. docs/ARCH/ARCH-MD-001-master-data-enterprise.md (this document)
3. docs/delivery/fdr-status-index.md — fdr-010-master-data-authority
4. packages/architecture-authority/src/data/foundation-disposition.registry.ts — PKG010_KERNEL
5. packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts
6. packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts
7. packages/kernel/src/contracts/business-master-data/business-master-data-scaffold.policy.ts
8. docs/architecture/afenda-runtime-truth-matrix.md — TIP-008B row
9. docs/architecture/dependency-registry.md — Business Master Data Authority table
10. docs/architecture/pre-accounting-foundation-roadmap.md
11. docs/ARCH/[Complete] ARCH-API-001-governed-rest-api.md
12. docs/ARCH/ARCH-API-002-openapi-internal-v1-catalog.md
13. docs/delivery/FDR/[Partially Implemented] fdr-010-master-data-authority.md
14. Archive: docs/delivery/tips/[Complete] tip-008-master-data-authority.md
```

---

# 4. Problem statement

## Current risk / gap

```text
Afenda business master data is authority-only: five frozen entities (customer, supplier,
product, employee, warehouse) have kernel registry entries, wire reference contracts, and
import/scaffold policies — but no domain-owned Drizzle schemas, governed CRUD APIs,
admin UI, or audit on MD mutations.

Business modules (inventory, CRM, procurement, HRM) and pre-accounting AP/AR cannot
safely reference operational master records. Ad-hoc tables in apps/erp would violate
TIP-008B ownership and business-master-data-scaffold.policy.ts.
```

## Business / architecture impact

```text
- Blocks PKG-R02–R05 domain packages and downstream stock, sales, procurement, and HR flows.
- Pre-accounting foundation roadmap lists AP/AR as depending on reserved domain packages.
- Without explicit business key policy, future teams will conflate UUID id, natural code,
  wire reference, slug, and external integration IDs — causing cross-domain drift.
- A central @afenda/master-data hub would violate Clean Core domain ownership and become
  a dumping ground for entity-specific logic.
```

---

# 5. Architecture requirement

## 5.1 Ownership

| Concern | Owner | Allowed path |
| --- | --- | --- |
| Authority registry + wire refs | `@afenda/kernel` (PKG-010) | `packages/kernel/src/contracts/business-master-data/` |
| Product + Warehouse runtime | `@afenda/database` + `apps/erp` (Inventory domain) | `packages/database/src/product/` · `packages/database/src/warehouse/` · ERP internal v1 API |
| Customer runtime | `@afenda/crm` (PKG-R04) | `packages/crm/` |
| Supplier runtime | `@afenda/procurement` (PKG-R05) | `packages/procurement/` |
| Employee runtime | `@afenda/hrm` (PKG-R03) | `packages/hrm/` |
| Governed REST routes | `@afenda/erp` | `apps/erp/src/app/api/internal/v1/**` |
| Drizzle persistence | `@afenda/database` | `packages/database/src/schema/` (domain tables via domain FDR) |
| Tests | Owning domain package + kernel | `packages/*/src/__tests__/` |
| Documentation | `docs/ARCH`, `docs/delivery/FDR` | This ARCH + paired FDRs |
| Scaffold guard | `scripts/governance` | `check-business-master-data-scaffold.mts` |

Kernel owns **identity contracts and authority registry**, not business CRUD.

## 5.2 Boundary rules

1. **Domain owner versus physical owner** — Business Master Data belongs to its business domain (Inventory, CRM, HRM, Procurement, Accounting). Physical persistence and CRUD live in `@afenda/database`; API routes and UI composition live in `apps/erp`. Kernel owns Platform Reference Data and thin cross-domain wire references only (ADR-0020).
2. **No duplicate ownership claims** — One domain owner per entity type in `BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY`; `reservedPackageId` names the persistence owner (`@afenda/database` for implemented inventory entities), not a ceremonial domain package.
3. Cross-domain references use kernel **wire references** (`CustomerWireReference`, etc.) — not duplicated ID shapes.
4. Natural keys and identity scopes follow `BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY` — no local redefinition.
5. Governed APIs use Zod contracts + OpenAPI export ([ARCH-API-002](ARCH-API-002-openapi-internal-v1-catalog.md)) — no ad-hoc route strings.
6. RBAC via `@afenda/permissions`; tenant/company RLS via `@afenda/database` patterns.
7. Mutations emit audit events via PKG-013 observability patterns.
8. Kernel registry entries remain `authority_only` for wire contracts until a domain FDR explicitly promotes additional runtime in database + ERP (not via empty npm packages).
9. Viet-ERP **behavior patterns** (CRUD traits, change history, bulk, soft delete) may be reused in domain services — **not** Viet-ERP central-hub topology or `packages/<domain>` ceremony packages (ADR-0020).

## 5.3 Prohibited actions

```text
- create packages/master-data or @afenda/master-data central hub
- implement business master data CRUD in @afenda/kernel
- duplicate BUSINESS_MASTER_DATA_ENTITY_IDS or authority registry outside kernel
- scaffold packages/crm, packages/hrm, packages/procurement without ADR + registry promotion
- recreate packages/inventory or packages/accounting ceremony packages (ADR-0020)
- bypass business-master-data-scaffold.policy.ts forbidden package dirs
- add MD persistence in apps/erp without @afenda/database domain ownership
- implement accounting runtime or ledger tables (ADR-0010)
- copy Viet-ERP @vierp/master-data package topology or NATS sync engine verbatim
- mark enterprise 9.5 Complete on authority-only evidence
- use prohibited timeline vocabulary without P0/P1/P2/P3 classification
```

## 5.4 Production classification vocabulary

| Capability | Bucket | Notes |
| --- | --- | --- |
| Kernel authority registry + wire refs (5 entities) | **P0 — delivered (authority)** | TIP-008B / fdr-010 |
| Domain-owned Drizzle schema + RLS per entity | **P0 — production mandatory** | Per domain FDR |
| Natural-key uniqueness per §5.5 | **P0 — production mandatory** | DB unique indexes + API validation |
| Governed `/api/internal/v1/**` CRUD | **P0 — production mandatory** | ARCH-API-001 envelope |
| Zod + OpenAPI registration | **P0 — production mandatory** | `pnpm sync:openapi` |
| RBAC on MD routes | **P0 — production mandatory** | PERMISSION_REGISTRY |
| Audit on create/update/delete | **P0 — production mandatory** | PKG-013 |
| Wire-reference compatibility tests | **P0 — production mandatory** | Import kernel branded IDs |
| Registry promotion PKG-R02–R05 | **P0 — production mandatory** | `foundation-registry-owner` + ADR |
| Change request / approval workflow | **P1 — production hardening** | Mandatory for enterprise 9.5 across MD unless waived |
| Duplicate detection on natural keys | **P1 — production hardening** | Per company/tenant scope |
| Bulk import with partial-failure envelope | **P1 — production hardening** | Pattern from Viet-ERP bulk ops |
| Field-level change history | **P1 — production hardening** | Pattern from Viet-ERP ChangeRecord |
| MD admin UI | **P1 — production hardening** | Governed UI (TIP-004) |
| fdr-010 Slice 2 evidence-sync + peer review | **P1 — production hardening** | DoD #14 |
| Central `@afenda/master-data` hub | **P2 — excluded** | Requires separate ARCH/FDR approval |
| MDG multi-system golden-record replication | **P2 — excluded** | Not in current production release scope |
| Asset / Document entities | **P2 — excluded** | TBD in kernel; ADR required |
| UOM / unit conversion master | **P2 — excluded** | Inventory ADR scope |
| Best-record calculation / advanced matching | **P3 — enhancement backlog** | Post-9.5 |
| External MDM connector (SAP ADM analog) | **P3 — enhancement backlog** | Post-9.5 |
| AI-assisted data quality scoring | **P3 — enhancement backlog** | Post-9.5 |

**P1 policy:** First domain runtime may ship with P0 only. Enterprise **9.5 accepted across master data** requires P1 closure or explicit bounded waivers with expiry.

## 5.5 Master Data Business Key Policy

Prevent drift between internal UUID, human natural key, cross-domain wire shape, and external integration IDs.

### Identifier roles

| Identifier kind | Purpose | Storage | Cross-domain use |
| --- | --- | --- | --- |
| **Database UUID** | Internal primary key (`id`) | Domain table PK | Never as sole business reference in contracts |
| **Business natural key** | Human/ERP code per §5.5.1 | Domain column; unique per scope | User-facing search; duplicate detection |
| **Wire reference** | Cross-package reference shape | Kernel contract only | JSON-serializable; includes branded ID strings + natural key field |
| **External reference** | Imported system ID (Lark, legacy ERP, EDI) | Optional `externalRef` / `sourceSystem` columns on domain tables | Integration only; not a substitute for natural key |

**Rules:**

1. Domain tables MUST use UUID `id` as PK (Drizzle `defaultRandom()`).
2. Natural key columns MUST match kernel `naturalKeyField` names in authority registry.
3. Wire references MUST be buildable from domain rows without ad-hoc field renaming.
4. `slug` is for URL/routing (tenant, company) — **not** a substitute for business natural keys on MD entities.
5. External refs are optional metadata; uniqueness constraints apply to natural keys, not external refs.

### 5.5.1 Required natural keys (kernel authority)

| Entity | Natural key field | Identity scope | Uniqueness rule |
| --- | --- | --- | --- |
| Customer | `customerCode` | tenant + company | External customer code unique per company |
| Supplier | `vendorCode` | tenant + company | Vendor code unique per company |
| Product | `sku` | tenant catalog | SKU unique per tenant catalog |
| Employee | `employeeNumber` | tenant + company | Employee number unique per company |
| Warehouse | `warehouseCode` | tenant + company | Warehouse code unique per company |

**Authority source:** `BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY` in [`business-master-data-authority.contract.ts`](../../packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts).

**Wire reference fields:** [`business-master-data-id-boundary.contract.ts`](../../packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts) — e.g. `CustomerWireReference` includes `tenantId`, `companyId`, `customerId`, `customerCode`.

---

# 6. Required implementation scope

## 6.1 Slice 1 — In scope (delivered)

- This ARCH document
- [`docs/ARCH/slices/ARCH-MD-001/`](slices/ARCH-MD-001/) slice index + Slice 1 handoff
- [`arch-status-index.md`](arch-status-index.md) registration

## 6.2 Runtime — Out of scope until domain FDRs

```text
- packages/inventory, packages/crm, packages/procurement, packages/hrm
- Drizzle schemas for customer, supplier, product, employee, warehouse
- /api/internal/v1 master data routes
- MD admin UI surfaces
- Accounting-linked MD (ADR-0010)
```

## 6.3 Legacy Viet-ERP comparison (reference only)

Legacy: `C:\JackProject\afenda-bolt\Viet-ERP\packages\master-data` (`@vierp/master-data`).

| Aspect | Viet-ERP | Afenda decision |
| --- | --- | --- |
| Topology | Monolithic central MD hub | **Reject** — domain-owned packages |
| CRUD base service | `BaseMasterDataService` — list/get/create/update/soft-delete/bulk | **Salvage pattern** into domain services |
| Change tracking | `ChangeRecord` field-level diff | **P1** — domain audit/history tables |
| Sync | NATS JetStream module→MD handlers | **P2/P3** — governed domain events when event contract exists |
| Conflict resolution | Version LWW in base service | **P1** — prefer change-request workflow over silent LWW |
| API | Generic `createEntityRoutes('customer')` | **Reject** — governed Zod + OpenAPI per route |
| Identity | Mostly `tenantId` only | **Afenda stricter** — tenant+company vs tenant_catalog |

```text
Reuse Viet-ERP behavior patterns.
Do not reuse Viet-ERP package topology.
```

## 6.4 Enterprise benchmark (SAP MDG / Oracle Product Hub)

| Enterprise control | Afenda mapping |
| --- | --- |
| Golden record / single trusted version | P0 natural-key uniqueness + wire refs at domain persistence |
| Change request workflow | P1 approval before publish |
| Validation at entry | P0 Zod + server-side rules |
| Duplicate detection / matching | P1 fuzzy match on natural keys |
| Mass processing | P1 bulk import with error envelope |
| Audit trail | P0 PKG-013 on mutations |
| Hub replication to client systems | P2 excluded |
| Best record calculation (COMPLETENESS/RECENCY) | P3 post-9.5 |

References: [SAP MDG S/4HANA FAQ](https://pages.community.sap.com/topics/master-data-governance/s4hana-faq) · [SAP MDG product](https://www.sap.com/products/data-cloud/master-data-governance.html)

## 6.5 OSS reference (GitHub)

| System | Relevance |
| --- | --- |
| [frappe/erpnext](https://github.com/frappe/erpnext) | DocType-per-entity; module apps — analog to domain packages |
| [odoo/odoo](https://github.com/odoo/odoo) | Shared partner/product models — analog to kernel wire refs |
| VTEX skills (`vtex-io-masterdata-strategy`, `masterdata-storage-strategy`) | SaaS catalog storage/index patterns for high-volume SKU |

## 6.6 Domain implementation sequence

```text
1. ARCH-MD-001 research doc                    ← Slice 1 (this document)
2. Update ARCH index
3. Read-only gates (research appendix)
4. fdr-010 Slice 2 evidence-sync              ← docs-only; PKG010 dist prerequisite
5. ADR + registry promotion for PKG-R02         ← @afenda/inventory
6. fdr-r02-inventory FDR                      ← product + warehouse runtime
7. Product + warehouse runtime slice
8. PKG-R04 CRM — customer
9. PKG-R05 procurement — supplier
10. PKG-R03 HRM — employee
```

**Inventory first:** Product + Warehouse share `@afenda/inventory` (PKG-R02) and unblock stock, procurement, sales, and accounting references per [`pre-accounting-foundation-roadmap.md`](../architecture/pre-accounting-foundation-roadmap.md).

## Expected files touched (future slices)

| File | Package | Change type | Required? |
| --- | --- | --- | --- |
| `packages/inventory/**` | `@afenda/inventory` | new | After ADR |
| `packages/database/src/schema/product.schema.ts` | `@afenda/database` | new | Domain FDR |
| `apps/erp/src/server/api/contracts/**` | `@afenda/erp` | modified | P0 API routes |
| `foundation-disposition.registry.ts` | architecture-authority | modified | Registry owner only |

---

# 7. Enterprise acceptance criteria

```gherkin
Feature: Business master data authority (kernel)

  Scenario: Core five MD entities registered with authority_only status
    GIVEN BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY
    WHEN business-master-data-authority.contract.test.ts runs
    THEN exactly five unique entity ids are registered
    AND each entry has runtimeStatus "authority_only"
    AND each reservedPackageId starts with "@afenda/"

  Scenario: Wire reference contracts exist for each core entity
    GIVEN getBusinessMasterDataAuthority for customer, supplier, product, employee, warehouse
    WHEN kernelContractPath is resolved
    THEN business-master-data-id-boundary.contract.ts exports the cited wire reference type

  Scenario: TBD entities excluded from governed core registry
    GIVEN TBD_BUSINESS_MASTER_DATA_ENTITIES (asset, document)
    WHEN isBusinessMasterDataEntityId is called for each TBD entityId
    THEN the result is false

  Scenario: Import boundary rejects illegal MD package topology
    GIVEN business-master-data-scaffold.policy.ts forbidden dirs
    WHEN pnpm check:business-master-data-scaffold runs
    THEN packages/crm, packages/inventory, packages/hrm, packages/procurement do not exist on disk

Feature: Business master data runtime (domain — not started)

  Scenario: Natural key denial on duplicate customerCode
    GIVEN an existing customer with customerCode "C-001" in company A
    WHEN a create request uses customerCode "C-001" in the same company
    THEN validation fails with a governed API error envelope
    AND no duplicate row is persisted
    AND an audit event is not emitted for success

  Scenario: Cross-package boundary — CRM cannot own Product schema
    GIVEN @afenda/crm package
    WHEN product table or ProductService is defined in CRM
    THEN import-boundary / architecture gate fails

  Scenario: OpenAPI drift protection for new MD routes
    GIVEN a new internal.v1 master data route registered in API_CONTRACTS
    WHEN pnpm sync:openapi and pnpm check:openapi-drift run
    THEN afenda-internal-v1.openapi.json includes the operation
    AND CI fails if snapshot is stale

  Scenario: Audit coverage on governed MD mutation
    GIVEN a successful product update via internal API
    WHEN the mutation completes
    THEN an audit event is recorded per PKG-013 registry
    AND the event includes tenant scope and actor identity
```

---

# 8. Enterprise quality benchmark

Target: **29/30 enterprise 9.5** at domain-runtime Complete; **no dimension below 4/5**.

| Phase | Contract | Tests | Observability | Security | Docs | Maintainability | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **Today (authority only)** | 5 | 5 | 4 (waived read-path) | 5 | 4 | 4 | **27/30 audit** |
| **Authority Complete (fdr-010)** | 5 | 5 | 4 | 5 | 5 | 5 | **29/30 ceiling** |
| **First domain (inventory P0)** | 5 | 4 | 5 | 5 | 4 | 5 | **28/30 foundation** |
| **All entities + P1 workflow** | 5 | 5 | 5 | 5 | 5 | 5 | **29/30 enterprise 9.5** |

Do not inflate scores. Authority-only evidence cannot claim enterprise 9.5 Complete.

---

# 9. Non-functional requirements

| Characteristic | Requirement | Verification |
| --- | --- | --- |
| Functional suitability | Five entities with identity scope + natural key metadata | Kernel authority tests |
| Security | RBAC + RLS on domain mutations; import boundary | Permission tests + RLS gates |
| Compatibility | Wire refs stable; public kernel exports unchanged | Typecheck + drift tests |
| Reliability | Deterministic registry lookups | Frozen const registry tests |
| Maintainability | No central MD hub; domain ownership | Scaffold policy + boundaries |
| Performance | O(1) authority lookup; paginated list APIs | Code review + load tests (P1) |
| Observability | Audit on mutations (domain); waived on wire read (authority) | PKG-013 + waivers |
| Documentation | ARCH + FDR + matrix aligned | `pnpm check:documentation-drift` |

---

# 10. Required gates

## Authority / research gates (Slice 1)

```bash
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm check:business-master-data-scaffold
pnpm check:foundation-disposition
pnpm check:documentation-drift
pnpm quality:boundaries
```

## Domain runtime gates (future slices)

```bash
pnpm --filter @afenda/inventory typecheck
pnpm --filter @afenda/inventory test:run
pnpm check:api-contracts
pnpm sync:openapi
pnpm check:openapi-drift
pnpm check:database-tenant-rls-coverage
pnpm quality:erp-observability
pnpm ui:guard
```

| Gate | Exit (2026-06-26 Slice 1) | Result |
| --- | ---: | --- |
| `pnpm --filter @afenda/kernel typecheck` | 0 | Pass |
| `pnpm --filter @afenda/kernel test:run` | 0 | Pass (76 tests; MD subdomain 14) |
| `pnpm check:business-master-data-scaffold` | 0 | Pass |
| `pnpm check:foundation-disposition` | 0 | Pass |
| `pnpm quality:boundaries` | 0 | Pass |
| `pnpm check:documentation-drift` | 0 | Pass |
| `pnpm check:documentation-drift` | 0 | Pass |

---

# 11. Definition of Done

| # | Criterion | Evidence | Status |
| --- | --- | --- | --- |
| 1 | ARCH-MD-001 authored with all sections | This file | [x] |
| 2 | P0/P1/P2/P3 classification complete | §5.4 | [x] |
| 3 | Business key policy documented | §5.5 | [x] |
| 4 | Viet-ERP comparison bounded | §6.3 | [x] |
| 5 | Domain sequence documented | §6.6 | [x] |
| 6 | Gherkin acceptance criteria | §7 | [x] |
| 7 | Enterprise score roadmap (no inflation) | §8 | [x] |
| 8 | Waiver carry-forward | §13 | [x] |
| 9 | Slice 1 handoff + index | `slices/ARCH-MD-001/` | [x] |
| 10 | arch-status-index row | §ARCH register | [x] |
| 11 | Research gate log | §15 Slice 1 | [x] |
| 12 | Central MD hub prohibited | §5.3 | [x] |
| 13 | Runtime MD schemas/APIs/UI | Domain FDR evidence | [ ] |
| 14 | fdr-010 Slice 2 evidence-sync | Paired FDR | [x] |
| 15 | PKG-R02 ADR + registry | foundation-registry-owner | [x] ADR-0019 · PKGR02_INVENTORY (2026-06-26) |
| 16 | Inventory product+warehouse runtime | fdr-r02-inventory | [x] Slice 1 — schemas + contracts (2026-06-26) |
| 17 | CRM customer runtime | Domain FDR | [ ] |
| 18 | Procurement supplier runtime | Domain FDR | [ ] |
| 19 | HRM employee runtime | Domain FDR | [ ] |
| 20 | Enterprise 9.5 across MD (P1) | Score table + waivers | [ ] |

---

# 12. Impact analysis

| Consumer | Import surface | Breaking change? | Required action |
| --- | --- | --- | --- |
| Future `@afenda/inventory` | `ProductWireReference`, `WarehouseWireReference` | No | Implement schemas per §5.5 |
| Future `@afenda/crm` | `CustomerWireReference` | No | Same |
| Future `@afenda/procurement` | `SupplierWireReference` | No | Same |
| Future `@afenda/hrm` | `EmployeeWireReference` | No | Same |
| `@afenda/erp` API layer | New internal.v1 MD contracts | No (additive) | Register in API_CONTRACTS |
| Accounting (PKG-R01) | Wire refs for AP/AR parties | No | Blocked until ADR-0010 + domain MD |

```text
Breaking change: No (Slice 1 docs-only)
Migration required: No
Runtime risk: Low (Slice 1)
Rollback safe: Yes (git revert doc commit)
```

---

# 13. Waiver policy

Inherited from [`fdr-010-master-data-authority`](../delivery/FDR/[Partially%20Implemented]%20fdr-010-master-data-authority.md):

| Waiver ID | Requirement waived | Reason | Expiry / revisit |
| --- | --- | --- | --- |
| `md-authority-observability` | Audit on MD wire reference read | Authority-only contracts | Domain MD FDRs |
| `md-authority-e2e` | Browser E2E for MD authority | 14 kernel subdomain tests | External beta go-live |
| `md-authority-domain-runtime` | Full MD persistence in kernel | Explicit authority_only design | PKG-R02–R05 FDRs |

No waiver may hide broken P0 runtime once domain slices begin.

---

# 14. Rollback strategy

| Change area | Rollback method | Risk |
| --- | --- | --- |
| ARCH-MD-001 doc | `git revert` doc commit | Low |
| arch-status-index row | Revert index commit | Low |
| Domain packages (future) | Revert package + schema migration | Medium |
| Kernel authority registry | Revert + re-run kernel tests | Medium |

Preserve: registry authority, package boundaries, public API compatibility, documentation truth.

---

# 15. Slice delivery notes

## Slice 1 — Research & roadmap (2026-06-26)

**Status:** Delivered  
**Type:** Research (docs-only)  
**Handoff:** [`slices/ARCH-MD-001/slice-01-research-roadmap.md`](slices/ARCH-MD-001/slice-01-research-roadmap.md)

**Outcomes:**

- ARCH-MD-001 authored; status **Partially Implemented — architecture accepted, runtime not started**
- P0/P1/P2/P3 table + §5.5 Business Key Policy
- Viet-ERP comparison + SAP MDG mapping
- Domain sequence locked: inventory → CRM → procurement → HRM

**Gate log (2026-06-26):**

| Gate | Exit |
| --- | ---: |
| `pnpm --filter @afenda/kernel typecheck` | 0 |
| `pnpm --filter @afenda/kernel test:run` | 0 |
| `pnpm check:business-master-data-scaffold` | 0 |
| `pnpm check:foundation-disposition` | 0 |
| `pnpm quality:boundaries` | 0 |

**Authority evidence paths:**

- `packages/kernel/src/contracts/business-master-data/business-master-data-authority.contract.ts`
- `packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts`
- `packages/kernel/src/contracts/business-master-data/business-master-data-scaffold.policy.ts`
- `scripts/governance/check-business-master-data-scaffold.mts`

## Slice 2 — FDR evidence sync (2026-06-26)

**Status:** Delivered  
**Type:** Evidence-sync (docs-only)  
**Handoff:** [`slices/ARCH-MD-001/slice-02-fdr-evidence-sync.md`](slices/ARCH-MD-001/slice-02-fdr-evidence-sync.md)

**Outcomes:**

- Unblocked by fdr-010-context-contracts Slice 2 (`ensureKernelDistFresh` in surface gate)
- fdr-010-master-data-authority Maintainability 5/5; audit-adjusted 28/30
- Runtime matrix TIP-008B row updated
- **Runtime master data still not started**

**Gate log:** same as Slice 1 plus `pnpm quality:kernel-context-surface` exit 0

---

# 16. Implementation slices

| Slice | Document | Type | Status | Package / layer |
| ---: | --- | --- | --- | --- |
| 1 | [slice-01-research-roadmap.md](slices/ARCH-MD-001/slice-01-research-roadmap.md) | Research | **Delivered** | docs/ARCH |
| 2 | [slice-02-fdr-evidence-sync.md](slices/ARCH-MD-001/slice-02-fdr-evidence-sync.md) | Evidence-sync | **Delivered** | docs/FDR |
| 3 | — | ADR + registry | Not started | architecture-authority |
| 4 | — | Domain FDR | Not started | `@afenda/inventory` |
| 5+ | — | Runtime | Not started | PKG-R02–R05 |

Full index: [`slices/ARCH-MD-001/slice-index.md`](slices/ARCH-MD-001/slice-index.md)

---

# 17. Promotion rule

Do not promote ARCH-MD-001 to **Complete** until:

```text
- All five entities have domain-owned runtime (schemas, API, audit) OR
  explicit P2 exclusion with separate ARCH/FDR for remaining entities
- P0 capabilities closed for in-scope entities
- P1 capabilities closed or waived for enterprise 9.5 claim
- Required gates exit 0
- Runtime matrix + fdr-status-index synchronized
```

Allowed status labels for this ARCH:

```text
Partially Implemented — architecture accepted, runtime not started   ← current (Slice 1)
Partially Implemented — domain runtime in progress
Complete — foundation acceptable (P0 only, P1 waivers documented)
Complete — enterprise 9.5 accepted
Blocked
```

**Slice 1 does not promote to Complete.**

---

# 18. Required output from IDE / agent

After each slice, post:

```markdown
## Completion report

### Status
<Partially Implemented — architecture accepted, runtime not started / etc.>

### Files changed
- `<path>` — <summary>

### Architecture requirements satisfied
- <requirement> — <evidence>

### Gates
| Gate | Exit | Result |
| --- | ---: | --- |

### Enterprise readiness
<score>/30 — <reason>

### Remaining gaps
- Domain runtime not started (expected after Slice 1)

### Promotion recommendation
Cannot promote to Complete — runtime MD not implemented
```

---

# 19. Command to execute

```text
Execute ARCH-MD-001 Slice 2 or next slice from docs/ARCH/slices/ARCH-MD-001/slice-index.md.

Do not expand scope beyond the slice handoff.
Do not create packages/inventory until Slice 3 ADR + registry promotion.
Do not mark enterprise 9.5 Complete on authority-only evidence.

Recommended next slice (not ARCH):
  fdr-010-master-data-authority Slice 2 — evidence-sync (docs-only)
  Prerequisite: fdr-010-context-contracts PKG010 dist gate green
```
