# PAS-001 — Kernel Authority Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-001 |
| **Document class** | `package_authority_standard` |
| **Document role** | `kernel_platform_authority` |
| **Canonical filename** | `PAS-001-KERNEL-AUTHORITY-STANDARD.md` |
| **Package** | `@afenda/kernel` |
| **Layer** | Platform |
| **Package role** | Zero-dependency platform vocabulary and execution context substrate |
| **Runtime stance** | Contracts-first; no database, no HTTP, no auth runtime, no UI runtime |
| **Registry lane** | `@afenda/kernel` (packages/kernel); `PKGR01_ACCOUNTING` (erp-domain/accounting subpath) |
| **Package owner** | Platform Authority |
| **Agent skill** | `kernel-authority` · `.cursor/skills/kernel-authority/SKILL.md` |
| **Maturity** | Enterprise Accepted (`enterprise_accepted`) |
| **Authority status** | `enterprise_accepted` |
| **Implementation status** | `implemented` |
| **Evidence level** | `runtime_proven` |
| **Runtime status** | Enterprise Accepted — kernel contracts, §13 catalog + B49–B70 closure delivered, runtime gates operational |
| **Remaining slices** | none — B70 Delivered ([`slice/b70-kernel-test-import-hygiene.md`](slice/b70-kernel-test-import-hygiene.md)) |
| **Consumers** | `@afenda/auth`, `@afenda/permissions`, `@afenda/execution`, `@afenda/observability`, `@afenda/appshell`, `apps/erp`, future governed domain packages |
| **Change model** | Serialized kernel slices only |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **ADR prerequisites** | ADR-0021, ADR-0022, ADR-0023 |
| **Continuation PAS** | [PAS-001A](PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md) — consumer integration (B71–B75 closed) · [PAS-001B](PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md) — ERP domain vocabulary catalog (B76–B77) |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/kernel typecheck` |
| 2 | `pnpm --filter @afenda/kernel test:run` |
| 3 | `pnpm quality:kernel-context-surface` |
| 4 | `pnpm check:kernel-context-wire-triad` |
| 5 | `pnpm check:kernel-identity-governance` |
| 6 | `pnpm check:kernel-zero-runtime-deps` |
| 7 | `pnpm check:accounting-domain-contracts` |
| 8 | `pnpm check:foundation-disposition` |
| 9 | `pnpm quality:boundaries` |
| 10 | `pnpm architecture:cycles` |
| 11 | `pnpm architecture:drift` |

> **Maturity is part of authority.**
> PAS-001 is fully implemented, gated, documented, and drift-protected. Kernel contracts, slice catalog, and runtime gates may be treated as enterprise authority.

> **Canonical location:** `docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md`
> **Package-local tree map:** `packages/kernel/PAS-001-KERNEL-TREE.md`

---

# 0. Agent Quick Path

> Read this section first for IDE/agent work. Full detail in §1–§16. Execution adapter: `.cursor/skills/kernel-authority/SKILL.md`

**Boundary:** The kernel defines **cross-package facts, branded vocabulary, wire-safe contracts, and execution context primitives**; it never implements **business behavior, persistence, transport, rendering, formatting, authorization evaluation, accounting logic, or external integration**. (§2)

**Hard stops (summary):**

- **Prohibited imports:** `@afenda/database`, `@afenda/auth`, `@afenda/permissions`, `@afenda/execution`, `@afenda/observability`, `@afenda/appshell`, `apps/erp`, Drizzle, Better Auth, Next.js, React, Zod, HTTP/DB/cloud SDKs (§3.2)
- **Must never own:** database schema/migrations/clients, auth sessions, permission evaluation, API routes, React/UI, domain workflows, cron/queues, accounting posting/ledger, domain operational workflows (§5)

**Required gates:** see §14.1

**Slice entrypoint:** `docs/PAS/slice/` · [`pas-status-index.md`](pas-status-index.md) (§13 catalog + B49–B70 closure) · Planner: `pas-slice-planner` · Session: `/afenda-coding-session`

**Registry:** `@afenda/kernel` → `packages/kernel` in `foundation-disposition.registry.ts`; accounting vocabulary → `PKGR01_ACCOUNTING` at `@afenda/kernel/erp-domain/accounting`

**Enterprise knowledge boundary:** Accepted business meaning, Knowledge Atoms, domains, and acceptance chains → [PAS-004](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) / `@afenda/enterprise-knowledge`. Kernel retains wire shapes only — never duplicate meaning authority.

**Identity slice gate:** Kernel identity runtime (Slice B) starts only after ADR-0021, ADR-0022, and ADR-0023 are **Accepted** (§4.1)

**Closure waivers (B67 — do not treat as missing implementation):** `FiscalCalendarId` / `FiscalPeriodId` quarantined on `@afenda/kernel/erp-domain/accounting` until Finance ADR; planned additive `AppErrorCode` values deferred; `PermissionScopeContext` kernel slot documented in drift registry (`refactorStatus: completed`).

---

# 1. Package Definition

`@afenda/kernel` is the lowest shared Platform package in Afenda ERP.

It defines the shared vocabulary that platform, foundation, application, and future domain packages may depend on.

The kernel answers:

> What is this thing?

It must not answer:

> How do I load it, persist it, authorize it, render it, calculate it, format it, or execute it?

The kernel owns identity, context shape, correlation, result/error vocabulary, lifecycle vocabulary, policy decision vocabulary, domain-event envelope vocabulary, authority registries, wire-safe primitives, and the minimal async context propagation substrate.

The kernel does not own business workflows, database queries, HTTP routes, UI behavior, rendering, user preference resolution, domain services, integration SDKs, or application composition.

---

# 2. One-Sentence Boundary

The kernel defines **cross-package facts, branded vocabulary, wire-safe contracts, and execution context primitives**; it never implements **business behavior, persistence, transport, rendering, formatting, authorization evaluation, accounting logic, or external integration**.

---

# 3. Dependency Rules

## 3.1 Allowed

The kernel may use:

* TypeScript types
* TypeScript helper functions
* Built-in JavaScript / Node.js primitives
* Branded IDs
* Frozen registries
* Pure value constructors
* Pure validation helpers
* JSON-serializable contracts
* A minimal async context propagation adapter, only if it remains dependency-free and does not carry app/domain runtime objects

## 3.2 Prohibited imports

The kernel must not import:

* `@afenda/database`
* `@afenda/auth`
* `@afenda/permissions`
* `@afenda/execution`
* `@afenda/observability`
* `@afenda/appshell`
* `apps/erp`
* Drizzle
* Better Auth
* Next.js
* React
* Zod
* HTTP clients
* Database clients
* Cloud SDKs
* External runtime libraries

## 3.3 Import rule

Kernel may import from itself only.

If a kernel contract appears to need a database, HTTP, auth, permission, UI, observability, or execution import, the contract is in the wrong package or the boundary is incorrectly designed.

---

# 4. Authority Surfaces

The kernel owns the following authority surfaces.

---

## 4.1 Canonical Enterprise Identity

**Authority:** [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) · [ADR-0022](../adr/ADR-0022-postgres-split-id-persistence-model.md) · [ADR-0023](../adr/ADR-0023-tenant-human-reference-numbering.md)

**Architecture:** [`docs/architecture/identity/`](../architecture/identity/canonical-enterprise-id-constitution.md)

**Implementation:** `packages/kernel/src/identity/` (Slice B) · Database: `packages/database/src/ids/` (Slice C; interim: `packages/database/src/ids.ts`)

Kernel owns the **constitution** for cross-package enterprise identifiers. Domain packages own master data and tenant human reference numbers — not canonical ID generation.

**Slice gate:** Slice B (Kernel runtime) may start only after ADR-0021, ADR-0022, and ADR-0023 are **Accepted**.

### 4.1.1 Three-layer identity stack

Afenda uses a three-layer identity model.

| Layer | Example | Owner | Used for |
| --- | --- | --- | --- |
| Internal PK | `018f9f8c-9f1a-7c2b-9c20-…` (`id uuid`, UUID v7) | `@afenda/database` | PK, FKs, joins, RLS |
| Canonical enterprise ID | `cus_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD` | `@afenda/kernel` + DB CHECK | API, audit, events, cross-package wire |
| Tenant human reference | `EMP-000123`, `CUST-000456`, `SKU-001` | Domain / System Admin | Admin UX — not Kernel IDs |

**Rule:** Kernel governs immutable system identity. Tenants govern human administrative numbers. Human numbers are business reference numbers, not canonical Kernel IDs.

**Enterprise boundary:** No unchecked string may become a canonical enterprise ID. `Brand<T, B>` nominal typing and `brandRequiredId(...)` are low-level brand utilities only — they do not satisfy this boundary. Trust boundaries must use family `parse*` functions (see §4.1.7).

This section is the **identity constitution** for Afenda ERP. All Kernel identity runtime, database CHECK constraints, API ingress, audit/event payloads, and governance guardrails derive from it.

### 4.1.2 Module location

Single source: `packages/kernel/src/identity/`

Target nested layout (Slice B). Live under `packages/kernel/src/identity/` — no flat root `.ts` files except `index.ts`.

```text
packages/kernel/src/identity/
├── index.ts
├── brand/                    # Brand<T,B> nominal typing only
├── canonical/                # format, parser, validator, generator, fixtures
├── registry/                 # ID_FAMILIES, prefix, owner, generation metadata
├── families/                 # TenantId, EmployeeId, … by category
│   ├── index.ts              # public re-export barrel
│   ├── define-enterprise-family.ts
│   ├── tenant-hierarchy-id.contract.ts
│   ├── identity-access-id.contract.ts
│   ├── audit-execution-id.contract.ts
│   ├── enterprise-hierarchy-id.contract.ts
│   └── business-reference-id.contract.ts
├── primitives/               # LocaleCode, CurrencyCode, … (not prefix_ulid)
├── tenant-human-reference/   # scope/policy classification — no generation
├── postgres/                 # CHECK expectation contracts (not migrations)
├── wire/                     # API/event ingress parse + serialize
└── governance/               # prohibited patterns, promotion hooks
```

| Folder | Purpose |
|--------|---------|
| `brand/` | Lowest-level `Brand<T,B>` — not a full ID contract |
| `canonical/` | `<prefix>_<ulid_body>` pattern, parser, validator, generator |
| `registry/` | Central ID constitution — prefix, type name, owner, `generates` |
| `families/` | Family-specific exported types and `parse*` / `create*` — one contract file per PAS category (§4.1.4) |
| `primitives/` | ISO/BCP47 codes — separate from enterprise ID parser |
| `tenant-human-reference/` | Human number scope/policy — Kernel does not generate |
| `postgres/` | Database CHECK expectations aligned with ADR-0022 |
| `wire/` | Parse-at-boundary rules for API, events, imports |
| `governance/` | Drift-prevention contracts for governance scripts |

Prohibited: duplicate `platform-id*.ts` paths, external `ulid` npm dependency in kernel, second branding pattern, human number generation in Kernel.

### 4.1.3 Canonical format

Canonical enterprise IDs must use the following format:

```txt
<prefix>_<ulid_body>
```

Where:

- `prefix` is exactly 3 lowercase letters from `ID_FAMILIES`
- `_` is the required separator
- `ulid_body` is exactly 26 Crockford base32 characters

The allowed ULID body character set is:

```txt
[0-9A-HJKMNP-TV-Z]{26}
```

Examples:

```txt
ten_01ARZ3NDEKTSV4RRFFQ69G5FAV
prd_01ARZ3NDEKTSV4RRFFQ69G5FBV
cus_01ARZ3NDEKTSV4RRFFQ69G5FCV
```

Canonical validation pattern (format tier only):

```txt
^[a-z]{3}_[0-9A-HJKMNP-TV-Z]{26}$
```

This regex is **necessary but not sufficient**. Prefix membership in `ID_FAMILIES` is enforced at the registry tier (§4.1.4).

Family validation rule:

The prefix must match the requested ID family **and** be registered in `ID_FAMILIES`.

Example:

- `parseProductId("prd_01ARZ3NDEKTSV4RRFFQ69G5FBV")` = pass
- `parseProductId("cus_01ARZ3NDEKTSV4RRFFQ69G5FCV")` = fail (wrong family prefix)
- `parseProductId("abc_01ARZ3NDEKTSV4RRFFQ69G5FAV")` = fail (unregistered prefix — format regex alone would pass)

Unchecked strings cannot become canonical enterprise IDs. Generic `brandRequiredId(...)` helpers do not satisfy this boundary — trust boundaries must use family `parse*` functions (see §4.1.7).

### 4.1.4 Enterprise ID families

Afenda canonical enterprise IDs are limited to the following **22 approved families**. This table is the Kernel ID constitution — runtime code, Postgres CHECK constraints, parsers, and governance gates must derive prefix authority from `ID_FAMILIES` in `packages/kernel/src/identity/registry/id-family.registry.ts`, not from the generic format regex alone.

| Category | Family | Prefix |
| --- | --- | --- |
| Tenant hierarchy | Tenant | `ten` |
| Tenant hierarchy | EntityGroup | `egp` |
| Tenant hierarchy | Company | `cmp` |
| Tenant hierarchy | Organization | `org` |
| Tenant hierarchy | Team | `tea` |
| Tenant hierarchy | Project | `prj` |
| Identity & access | User | `usr` |
| Identity & access | Role | `rol` |
| Identity & access | Membership | `mem` |
| Identity & access | Permission | `per` |
| Identity & access | Policy | `pol` |
| Audit & execution | AuditEvent | `aud` |
| Audit & execution | Execution | `exe` |
| Audit & execution | Correlation | `cor` |
| Enterprise hierarchy | OwnershipInterest | `own` |
| Business reference | Customer | `cus` |
| Business reference | Supplier | `sup` |
| Business reference | Product | `prd` |
| Business reference | Employee | `emp` |
| Business reference | Warehouse | `whs` |
| Business reference | Document | `doc` |
| Business reference | Asset | `ast` |

**Rules:**

1. The approved ID family registry is `ID_FAMILIES` in `packages/kernel/src/identity/registry/id-family.registry.ts`.
2. Every canonical enterprise ID prefix must be exactly three lowercase letters.
3. Every prefix must be globally unique across `ID_FAMILIES`.
4. Unknown prefixes are invalid even if the full string matches the canonical ID regex (for example `abc_01ARZ3NDEKTSV4RRFFQ69G5FAV`).
5. Family-specific parsers must reject IDs with the wrong family prefix.
6. Tenant human references such as `EMP-000123`, `CUST-000456`, and `SKU-001` are not canonical enterprise IDs (see §4.1.13).
7. No unchecked string may become a canonical enterprise ID — trust boundaries use family `parse*` (see §4.1.7).

A canonical enterprise ID is valid only when **all three** hold:

1. It matches `<prefix>_<ulid_body>` (§4.1.3).
2. The prefix exists in `ID_FAMILIES` / `ENTERPRISE_ID_FAMILY_PREFIX_AUTHORITY`.
3. The prefix matches the requested family parser.

#### Category summary

| Category | Count | Registry keys |
| --- | ---: | --- |
| Tenant hierarchy | 6 | `tenant`, `entityGroup`, `company`, `organization`, `team`, `project` |
| Identity & access | 5 | `user`, `role`, `membership`, `permission`, `policy` |
| Audit & execution | 3 | `auditEvent`, `execution`, `correlation` |
| Enterprise hierarchy | 1 | `ownershipInterest` |
| Business reference | 7 | `customer`, `supplier`, `product`, `employee`, `warehouse`, `document`, `asset` |
| **Total** | **22** | — |

#### Family contract files (Slice B3 Action 5)

Each PAS category maps to exactly one contract file under `packages/kernel/src/identity/families/`. Governance gate `check:kernel-identity-surface` enforces per-family exports in the mapped file.

| Category | Contract file | Families |
| --- | --- | --- |
| Tenant hierarchy | `tenant-hierarchy-id.contract.ts` | 6 |
| Identity & access | `identity-access-id.contract.ts` | 5 |
| Audit & execution | `audit-execution-id.contract.ts` | 3 |
| Enterprise hierarchy | `enterprise-hierarchy-id.contract.ts` | 1 |
| Business reference | `business-reference-id.contract.ts` | 7 |

Public import surface: `@afenda/kernel` root barrel or `identity/families/index.ts`. Category files are implementation partitions — consumers must not deep-import them outside kernel tests and platform authority path metadata.

#### Record ownership (business-reference families)

| Family | `recordOwner` (domain lifecycle) |
| --- | --- |
| Customer | `crm-sales` |
| Supplier | `procurement` |
| Product | `product-inventory` |
| Employee | `hrm` |
| Warehouse | `inventory-warehouse` |
| Document | `document-management` |
| Asset | `asset-management` |
| OwnershipInterest | `enterprise-structure` |

`owner` on every row is `kernel` (ID contract authority). `recordOwner` identifies the package or domain that owns record lifecycle where business ownership matters.

#### Two-tier validation

Canonical ID validation is **two-tier**. Both tiers must pass at trust boundaries.

| Tier | Question | Mechanism |
| --- | --- | --- |
| **Format** (§4.1.3) | Does the string match `<prefix>_<ulid_body>`? | `CANONICAL_ID_PATTERN` — `[a-z]{3}_[0-9A-HJKMNP-TV-Z]{26}` |
| **Registry** (this section) | Is the prefix a registered family in `ID_FAMILIES`? | Family `parse*` / family-specific CHECK — prefix must match the requested family |

**Rule:** A canonical enterprise ID prefix must come from `ID_FAMILIES`. Unknown prefixes are invalid even when the string matches the generic format regex.

Example — format pass, registry fail:

```txt
abc_01ARZ3NDEKTSV4RRFFQ69G5FAV
```

- `isCanonicalEnterpriseId("abc_…")` → **pass** (generic regex only — diagnostic / UI pre-check)
- `parseProductId("abc_…")` → **fail** (prefix not registered for Product)
- `parseCanonicalId("abc_…", "product")` → **fail** (wrong prefix)
- Postgres `enterprise_id` CHECK on `products` → **fail** (family CHECK requires `prd_` prefix)

Trust boundaries (API ingress, audit replay, cross-package wire) must use family `parse*` when the expected family is known. When the family is unknown at ingress, use `parseRegisteredCanonicalEnterpriseId` or `parseWireRegisteredCanonicalId` — never the generic regex or `isCanonicalEnterpriseId` alone.

#### Registry hardening API (Slice B3)

| Helper | Use |
| --- | --- |
| `REGISTERED_ENTERPRISE_ID_PREFIXES` | Frozen 22-prefix list derived from `ID_FAMILIES` |
| `ENTERPRISE_ID_PREFIX_TO_FAMILY` | Prefix → registry family key lookup |
| `isRegisteredEnterpriseIdPrefix(prefix)` | Registry tier — is this a legal prefix? |
| `extractCanonicalEnterpriseIdPrefix(value)` | Parse prefix from a canonical ID string |
| `resolveEnterpriseIdFamilyFromPrefix(prefix)` | Prefix → `EnterpriseIdFamily` or null |
| `isRegisteredCanonicalEnterpriseId(value)` | Format tier **and** registry tier |
| `parseRegisteredCanonicalEnterpriseId(value)` | Family-unknown ingress — resolves family then parses |
| `parseWireRegisteredCanonicalId(value)` | Wire alias for family-unknown ingress |

**Prohibited at trust boundaries:** accepting `isCanonicalEnterpriseId` as sufficient proof of a valid enterprise ID.

#### Enterprise alignment (SAP / FMCG benchmark)

The 22 families mirror the **platform-floor nouns** that global FMCG enterprises (Unilever, Nestlé, and similar SAP S/4HANA deployments) maintain as master data and organizational structure — without importing SAP object codes or fiscal-domain IDs onto the Kernel floor.

| Afenda family | Typical SAP S/4HANA analogue | Notes |
| --- | --- | --- |
| Tenant | Client | Top-level corporate group / SaaS isolation boundary |
| EntityGroup | Consolidation / group reporting unit | Optional hierarchy above company code |
| Company | Company code | Smallest legal-entity unit for external financial statements |
| Organization | Sales org / purchasing org / plant maintenance org | Functional org slice within a company |
| Team | Purchasing group / internal responsibility team | Buyer or operational team — not a legal entity |
| Project | PS/WBS project | Cross-functional initiative or capital project |
| User | SAP user / business user | Distinct from Better Auth login subject (§4.1.11) |
| Role | Authorization role | RBAC role definition |
| Membership | User–org assignment | Scoped membership, not the user record itself |
| Permission / Policy | Auth object / policy rule | Fine-grained capability and policy artifacts |
| AuditEvent / Execution / Correlation | Application log / job run / trace id | Cross-cutting observability — not master data |
| OwnershipInterest | Legal-entity ownership / consolidation share | Enterprise hierarchy link between legal entities |
| Customer / Supplier | Business partner (customer / vendor role) | S/4 BP is role-based; Afenda splits wire IDs by role |
| Product | Material master | SKU/material at client or plant level in SAP; Afenda uses tenant human `sku` for display numbers (§4.1.13) |
| Employee | Employee master | HR master — distinct from ERP user |
| Warehouse | Plant + storage location | Operational logistics site; SAP splits plant vs storage location — Afenda models warehouse as one platform entity |
| Document | FI/SD/MM document header | Posted or draft business document |
| Asset | Fixed asset (FI-AA) | Capitalized asset register |

**Intentionally deferred to domain ADRs (not in the 22):** fiscal calendar/period IDs, G/L account, cost center, profit center, BOM/routing, batch/lot/serial, purchase order, sales order, and other transactional or accounting-domain identifiers. See §4.1.6.

#### Persistence and event-only families

| Family | Platform table (when live) | Persistence status |
| --- | --- | --- |
| Tenant … Policy (16 families) | See `PLATFORM_ENTITY_TABLE_REGISTRY` | Live schema for platform spine |
| Correlation | — | Event-only — no entity table; wire and audit payloads only |
| Customer, Supplier, Employee, Document, Asset | `customers`, `suppliers`, `employees`, `documents`, `assets` | Deferred — registry + parser live; domain PAS slice owns schema promotion |

Database CHECK constraints use **family-specific** patterns (`^prd_[0-9A-HJKMNP-TV-Z]{26}$`), not the generic `[a-z]{3}_` regex. Parity gate: `pnpm check:enterprise-id-db-parity`.

### 4.1.5 Primitive references (7)

Separate from enterprise ID parser — ISO/BCP47 patterns, not `prefix_ulid`:

`LocaleCode`, `TimezoneId`, `DateFormat`, `NumberFormat`, `CurrencyCode`, `CountryCode`, `UomCode`

### 4.1.6 Forbidden platform-floor IDs

Not approved at this stage:

* `FiscalCalendarId`
* `FiscalPeriodId`

These belong to Finance / Accounting domain contracts unless a future ADR promotes them.

### 4.1.7 Trust boundaries

Wire JSON payloads keep plain `string` IDs. **Trust boundaries** must use `parse*` (throws on invalid prefix/body) — not unchecked casts.

```ts
// Approved at API ingress
const tenantId = parseTenantId(params.tenantId);

// Prohibited in apps/erp and domain packages
const tenantId = wire as TenantId;
const tenantId = brandTenantId(untrusted); // brand* calls parse internally but prefer explicit parse*
```

`brand*` / `to*` remain thin wrappers for transitional compatibility; new code uses `parse*` / `create*`.

### 4.1.8 Validation rules

Family `parse*` functions enforce §4.1.3 at trust boundaries. Parser rejects:

1. Wrong prefix (`cus_…` passed to `parseTenantId`)
2. Invalid body length or charset
3. Empty or whitespace-only values

### 4.1.9 Audit and events dual-field model

Audit and outbox payloads carry **both** canonical and internal keys where entity identity is recorded:

| Field | Use |
|-------|-----|
| `entityId` / `tenantId` | Human evidence, API replay, cross-package wire (`ten_…`, `cus_…`) |
| `entityPk` / `tenantPk` | DB joins, internal reconciliation (`uuid`) |

### 4.1.10 API ingress (§4.1.13)

1. Parse canonical ID at route/query boundary via `parse*`
2. Resolve tenant once: `parseTenantId(wire)` → lookup `tenants.enterprise_id` → uuid for session/RLS
3. Never parse `ten_*` inside RLS policies — RLS uses `tenant_id uuid`

### 4.1.11 Better Auth boundary

Better Auth `auth_user.id` is OAuth/login identity. ERP `users.id` (uuid PK) maps to Kernel `usr_*` enterprise ID. Do not force merge of auth subject ids with ERP actor ids.

### 4.1.12 PostgreSQL persistence model

Kernel canonical enterprise IDs are **not** PostgreSQL primary keys.

Afenda uses a split-ID persistence model:

1. `id uuid` is the internal PostgreSQL primary key (UUID v7 default via `uuid_generate_v7()`).
2. Foreign keys reference internal UUID primary keys only.
3. `enterprise_id text` stores the Kernel-governed canonical enterprise ID.
4. `enterprise_id` must be `unique`, `not null` (after backfill), and protected by a family-specific `CHECK` constraint.
5. API, audit, events, logs, imports, exports, and cross-package wire contracts use `enterprise_id`.
6. Joins, foreign keys, RLS policies, and internal relational integrity use UUID keys.

Example:

```sql
id uuid primary key default uuid_generate_v7(),
enterprise_id text not null unique
  check (enterprise_id ~ '^cus_[0-9A-HJKMNP-TV-Z]{26}$')
```

Column naming: generic `enterprise_id` on every governed entity table. Relational FK columns stay explicit uuid refs (`orders.customer_id uuid → customers.id`).

**Prohibited:** text canonical ID as PK; FK to `enterprise_id`; separate prefix column; RLS on canonical string parsing.

Database helpers (`packages/database/src/ids.ts`):

| Helper | Meaning |
|--------|---------|
| `primaryId()` | `uuid PK default uuid_generate_v7()` |
| `enterpriseIdColumn(family)` | `text` column for canonical ID |
| `entityRefId(name)` | `uuid` FK column — never references `enterprise_id` |

CHECK patterns are duplicated in `@afenda/database` and validated against kernel via `pnpm check:enterprise-id-db-parity`.

**ULID body minting:** Production write paths inject `@afenda/database` `generateUlidBody()` through a `CanonicalIdBodyGenerator` adapter at the `apps/erp` composition root. Kernel does not mint production IDs without an injected generator. Authority: [ADR-0024](../adr/ADR-0024-canonical-id-body-generation.md).

### 4.1.13 Tenant-defined human reference numbers (Slice F — domain PAS slices)

Kernel canonical IDs do **not** replace tenant human reference numbers. Authority: [ADR-0023](../adr/ADR-0023-tenant-human-reference-numbering.md).

| Entity | Human column | Example | Uniqueness | Owner |
|--------|--------------|---------|------------|-------|
| Employee | `employee_no` | `EMP-000123` | `unique (tenant_id, employee_no)` | HRM / System Admin |
| Customer | `customer_no` | `CUST-000456` | `unique (tenant_id, customer_no)` | CRM / Sales |
| Supplier | `supplier_no` | `SUP-000789` | `unique (tenant_id, supplier_no)` | Procurement |
| Product | `sku` | `LETTUCE-ROMAINE-001` | `unique (tenant_id, sku)` | Product / Inventory |
| Asset | `asset_no` | `FA-2026-00001` | `unique (tenant_id, asset_no)` | Asset / Finance |
| Document | `document_type`, `document_no` | `INV-2026-000001` | `unique (tenant_id, document_type, document_no)` | Finance / Operations |
| Warehouse | `warehouse_code` | `WH-KL-01` | `unique (tenant_id, warehouse_code)` | Inventory |

Formats may be tenant-configurable within domain policy bounds. Human numbers are **never** PK, FK, or RLS boundaries.

**Prohibited:** Kernel `createEmployeeNo()` (or any human-number generator); human numbers in cross-package wire contracts; global unique on human number alone; RLS on human number patterns.

Sequence strategy: `tenant_number_sequences` with `FOR UPDATE` in short transactions — domain PAS slice scope, not Kernel.

### 4.1.14 Promotion checklist (§4.1.16)

Before promoting a new ID family to platform floor:

1. ADR or PAS amendment records family, prefix, and owner
2. Entry added to `ID_FAMILIES` with `parseFunction`, `createFunction` (if `generates: true`), wire normalizer
3. Kernel tests: valid, invalid, wrong-prefix, wrong-body, round-trip, registry parity
4. `pnpm check:kernel-identity-governance` green (bundle: prefix uniqueness, parser/generator parity, forbidden fiscal IDs, no unsafe casts, no local type defs, database enterprise-id contract, tenant human reference uniqueness, FK uuid-only, RLS uuid tenant-only)
5. If persisted: `enterprise_id` column + CHECK + UNIQUE on entity table; register in `platform-entity-table-registry.ts`; `pnpm check:database-enterprise-id-contract` green
6. ERP/API ingress uses `parse*` — `pnpm check:no-unsafe-id-casts` green
7. Forbidden fiscal IDs remain off platform floor

Rule:

> Any ID crossing package boundaries must be registered in `ID_FAMILIES`, parsed at trust boundaries, and — when persisted — stored in `enterprise_id text` with uuid PK/FK unchanged.

---

## 4.2 Result and Error Vocabulary

Kernel owns the canonical fallible result shape.

```ts
type Result<TValue, TError> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: TError };
```

Kernel owns the base `AppError` vocabulary.

Current base error codes:

```ts
type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";
```

Planned additive error codes, requiring a dedicated kernel error-contract slice before use:

```ts
type PlannedAppErrorCode =
  | "RATE_LIMIT_EXCEEDED"
  | "SERVICE_UNAVAILABLE"
  | "TIMEOUT"
  | "PAYMENT_REQUIRED";
```

Rules:

* Preserve the current `AppError` discriminated-union style.
* Preserve the current `AppErrors.*` factory style.
* Do not replace current `userMessage` semantics with a generic `{ code, message, details }` shape.
* Kernel owns error vocabulary.
* API governance owns HTTP status mapping.

### ProblemDetail

Kernel may define a versioned `ProblemDetail` wire shape aligned to RFC 9457.

Rules:

* `ProblemDetail` is a wire contract.
* `ProblemDetail` must not replace `AppError`.
* HTTP status mapping belongs to API governance.
* Kernel may define the shape; API layer decides when/how it is returned.

---

## 4.3 Execution Context

Kernel owns the canonical `ExecutionContext` shape.

Required concepts:

* `executionId`
* `correlationId`
* `source`
* `startedAt`
* `actorId`
* `tenantId`
* `companyId`
* `organizationId`

Approved additive fields:

* `traceId?: string | null`
* `spanId?: string | null`

Rules:

* `correlationId` follows a request, event, job, action, or execution chain.
* `executionId` identifies one execution attempt.
* `traceId` and `spanId` are plain strings.
* Kernel must not import OpenTelemetry.
* Observability may enrich trace/span behavior outside kernel.
* Kernel must follow the current `ExecutionContextSource` vocabulary until a dedicated compatibility slice changes it.
* Do not replace current execution source values from documentation examples.

Current source truth for `ExecutionContextSource`:

```ts
"api" | "cron" | "event" | "manual" | "system" | "outbox" | "job"
```

---

## 4.4 Operating Context

Kernel owns the operating context hierarchy and contract vocabulary.

Canonical hierarchy:

```text
Tenant
→ EntityGroup
→ LegalEntity / Company
→ OwnershipInterest
→ OrganizationUnit
→ Team
→ Project
→ Workspace
→ Surface
→ Workflow
→ PermissionScope
→ ConsolidationScope
→ AccountingReadiness
```

Rules:

* Tenant is the SaaS and security boundary.
* Entity group is the corporate group boundary.
* Legal entity / company is the statutory boundary.
* Ownership interest is enterprise-hierarchy and consolidation-readiness metadata.
* Organization unit is the operational boundary.
* Team and project are execution scopes.
* Workspace, surface, and workflow are runtime/UI context scopes.
* Permission scope is the grant boundary.
* Consolidation scope is accounting-readiness metadata only.
* Accounting readiness is a gate signal, not accounting runtime.

### Wire context module triad (recommended standard)

Every context shape that accepts **wire input** (API payloads, events, imports, session replay) must use three sibling modules — no guessing, no silent branding:

```text
packages/kernel/src/context/
├── <name>-context.contract.ts   # Internal branded context + Wire* wire context types
├── <name>-context.assert.ts     # Reject invalid wire values before branding (fail closed)
└── <name>-context.parser.ts     # parse*Wire* → branded context via identity parse* only
```

| Module | Owns | Must not |
| --- | --- | --- |
| `*.contract.ts` | `FooContext` (branded), `WireFooContext` (plain JSON-safe fields), compile-time wire-serializable guards | Call `parse*` at import time; load or resolve data |
| `*.assert.ts` | Structural checks on wire input (required keys, enum membership, non-empty strings, date format) before any brand is applied | Apply brands; import ERP/database |
| `*.parser.ts` | `parseFooContext(wire): FooContext` using `parseTenantId`, `parseLocaleCode`, etc. from `@afenda/kernel/identity` | Silent fallback; `as TenantId` casts; default tenant/company/org |

**Ingress flow (mandatory mental model):**

```text
bad data enters wire
  → assert rejects (throws / Result error — no brand created)
  → parser applies identity parse* at trust boundary
  → branded context exists only after validation
  → downstream modules cannot accidentally consume sick context
```

**Rules:**

1. Branded context types are **outputs** of parsers — never inputs from untrusted wire without parsing.
2. Wire interfaces use plain `string` (or JSON primitives) for ids and codes; internal context uses branded types from `identity/`.
3. Parsers delegate id/code validation to existing `parse*` / `to*` helpers — do not duplicate regex or family rules in context modules.
4. Assert modules may be compile-time only (e.g. `AssertJsonSerializable`) **or** runtime guards — both belong in `*.assert.ts`, not mixed into contract barrels.
5. Serialize functions (`serializeFooContext`) live in `*.parser.ts` alongside parse (mirror: `localization-context` today).

**Reference implementation:** `localization-context.{contract,assert,parser}.ts` — wire ingress triad (PAS §4.4 rule 14).

**Contexts without wire ingress** (shape-only slots filled by ERP resolvers) may remain contract-only when no JSON boundary exists. **`LegalEntityContext`** uses the wire triad when ingress is required; ERP DB resolvers map persisted rows via `parse*` at the trusted mapper boundary (`operating-context.mappers.ts`).

Ownership split:

| Concern                    | Owner                   |
| -------------------------- | ----------------------- |
| Operating context shape    | Kernel                  |
| Operating context resolver | `apps/erp`              |
| Persistence                | `@afenda/database`      |
| Permission evaluation      | `@afenda/permissions`   |
| Audit writing              | `@afenda/observability` |
| Runtime execution          | `@afenda/execution`     |

Kernel owns the shape. It must not load, infer, resolve, persist, authorize, audit, or render the context.

**ERP resolver modules (PAS §4.4 — not kernel):**

```text
apps/erp/src/lib/context/
├── consolidation-scope-resolution.server.ts      # deriveConsolidationScopeContext
├── consolidation-scope-investee-merge.policy.ts    # investee dedup policy
├── runtime-module-path.server.ts                 # normalizeRuntimeModulePath
├── surface-context.resolution.server.ts          # parseSurfaceId / toSurfaceContext
└── workflow-context.resolution.server.ts         # parseWorkflowId / toWorkflowContext
```

**Completed kernel relocations (see `kernel-boundary-drift.registry.ts`):** untrusted-client authority, accounting bridge projection (ERP `apps/erp/src/lib/context/accounting-readiness.projection.ts`), accounting vocabulary from `contracts/accounting-domain/` → `erp-domain/accounting/`, consolidation scope derivation, runtime surface/workflow parsers.

---

## 4.5 Localization and Global Format Vocabulary

Kernel owns the global localization and formatting vocabulary required by all ERP modules.

The purpose is to prevent Finance, Warehouse, HRM, Inventory, Sales, Procurement, Reporting, and future domain modules from inventing incompatible date, time, timezone, and number-format contracts.

Kernel may define these primitive branded types:

```ts
type LocaleCode = Brand<string, "LocaleCode">;
type TimezoneId = Brand<string, "TimezoneId">;
type DateFormat = Brand<string, "DateFormat">;
type NumberFormat = Brand<string, "NumberFormat">;
type CurrencyCode = Brand<string, "CurrencyCode">;
type CountryCode = Brand<string, "CountryCode">;
type UomCode = Brand<string, "UomCode">;
```

Kernel may define this shared localization context shape:

```ts
interface LocalizationContext {
  readonly localeCode: LocaleCode;
  readonly timezoneId: TimezoneId;
  readonly dateFormat: DateFormat;
  readonly numberFormat: NumberFormat;
}
```

Rules:

* Kernel owns the vocabulary and context shape.
* Kernel does not decide the selected locale, timezone, date format, or number format.
* Kernel does not format dates or numbers at runtime.
* Kernel does not parse user-entered dates.
* Kernel does not localize UI labels.
* Kernel does not own translation files.
* Kernel does not own country master rows.
* Kernel does not own statutory country rules.
* Kernel does not own fiscal calendar, fiscal year, fiscal period, period status, period close policy, or financial reporting cycle.
* Kernel does not own functional currency, base currency, reporting currency, exchange-rate policy, or currency conversion.
* Kernel does not own UOM conversion rules or UOM master rows.

`TimezoneId` values must follow the IANA Timezone Database (tzdata) identifier format — for example `"America/New_York"` or `"Europe/Amsterdam"`. UTC offsets such as `"+07:00"` are not timezone identifiers and must not be used as `TimezoneId` values. This distinction matters for DST, statutory deadlines, and audit timestamps in multi-country deployments.

`UomCode` is a global primitive shared across Inventory, Procurement, Manufacturing, Finance, and Reporting — analogous to `CurrencyCode`. It is not inventory behavior; it is a cross-package unit-of-measure code brand (SAP `MSEHI`, Oracle `UOM_CODE`).

Correct ownership:

| Concern                               | Owner                                    |
| ------------------------------------- | ---------------------------------------- |
| Localization vocabulary               | Kernel                                   |
| Localization context shape            | Kernel                                   |
| User selected locale/timezone/format  | ERP / user settings                      |
| Company default locale/timezone       | Company/legal entity settings            |
| Warehouse/location timezone           | Warehouse/location master                |
| Date/number formatting implementation | ERP / UI / reporting layer               |
| Translation files                     | ERP / UI / localization package          |
| Fiscal calendar and fiscal periods    | Finance / Accounting                     |
| Functional currency                   | Finance / legal entity master            |
| Base/reporting currency               | Finance / consolidation/reporting        |
| Currency conversion                   | Finance / Accounting                     |
| UOM master rows and conversion rules  | Inventory / reference-data owner         |
| Country master rows                   | Database / governed reference-data owner |
| Statutory country rules               | Legal/compliance/domain owner            |

---

## 4.6 Platform Entity Authority

Kernel owns the authority registry for platform-level entities.

Examples:

* Tenant
* Entity group
* Legal entity / company
* Ownership interest
* Organization unit
* Team
* Project
* User
* Membership
* Role
* Permission
* Policy
* Audit event

The registry must define:

* Entity ID
* Owning contract path
* Persistence owner
* Authorization consumer
* Audit owner
* Runtime status

Rules:

* Registry is authority only.
* Registry must not query the database.
* Registry must not generate migrations.
* Registry must not perform authorization checks.
* Registry must not perform audit writes.

---

## 4.7 Business Reference Identity Authority

Kernel may define cross-package reference IDs and ownership registry entries for business records.

Examples:

* Customer reference identity
* Supplier reference identity
* Product reference identity
* Employee reference identity
* Warehouse reference identity
* Document reference identity
* Asset reference identity

Rules:

* Kernel owns only the reference identity vocabulary.
* Kernel may document the owning runtime package/app/domain.
* Kernel does not own the business record.
* Kernel does not own business validation.
* Kernel does not own business lifecycle.
* Kernel does not own import/export behavior.
* Kernel does not own CRUD.
* Kernel does not own UI.
* Kernel does not own persistence.

Correct ownership:

| Concern                                  | Owner                            |
| ---------------------------------------- | -------------------------------- |
| `CustomerId` reference identity          | Kernel                           |
| Customer behavior/profile/workflow       | CRM/Sales owner when activated   |
| `SupplierId` reference identity          | Kernel                           |
| Supplier behavior/profile/workflow       | Procurement owner when activated |
| `ProductId` reference identity           | Kernel                           |
| Product behavior/catalog/stock meaning   | Inventory/Product owner          |
| `EmployeeId` reference identity          | Kernel                           |
| Employee profile/payroll/HR workflow     | HRM owner                        |
| `WarehouseId` reference identity         | Kernel                           |
| Warehouse operation/stock movement       | Inventory/Warehouse owner        |
| `DocumentId` reference identity          | Kernel if cross-package          |
| Document behavior/storage/workflow       | Document/storage/workflow owner  |
| `AssetId` reference identity             | Kernel if cross-package          |
| Asset lifecycle/depreciation/maintenance | Fixed asset/domain owner         |

Rename guidance:

> Prefer "Business Reference Identity Authority" over "Business Master Data Authority" when describing the kernel surface. Kernel does not own business master data runtime.

Business Partner convergence (MNC ERP standard):

> SAP S/4HANA and Oracle EBS unify Customer and Supplier into a single Business Partner entity. The current `CustomerId` / `SupplierId` split is correct for now. When a unified business-partner domain package is activated, introduce `BusinessPartnerId` through an approved kernel slice — do not invent a third parallel pattern.

---

## 4.8 Accounting Domain Vocabulary

Kernel may own accounting vocabulary only while accounting runtime is not activated and only as contracts.

Allowed:

* Account type vocabulary
* Posting status vocabulary
* Fiscal period state vocabulary if already part of the approved erp-domain accounting vocabulary
* Journal document type vocabulary
* Accounting permission key vocabulary
* Accounting wire context
* Accounting branded IDs already approved in `erp-domain/accounting/` contracts
* Consolidation method vocabulary if contract-only
* Chart-of-account structure vocabulary if contract-only

Prohibited:

* Journal posting service
* Ledger service
* Trial balance calculation
* Consolidation elimination logic
* Accounting database runtime
* Accounting package recreation
* Financial statement generation
* Fiscal calendar setup/runtime
* Period close workflow
* Currency conversion logic

Rule:

> Kernel may describe accounting words. It must not execute accounting.

---

## 4.9 Policy Decision Vocabulary

Kernel may own generic policy decision vocabulary.

Example:

```ts
type PolicyDecisionKind = "allow" | "deny" | "gate" | "defer";
```

Example denial reasons:

```ts
type PolicyDenialReason =
  | "unauthorized"
  | "forbidden"
  | "rate_limited"
  | "quota_exceeded"
  | "feature_disabled"
  | "plan_required"
  | "context_required"
  | "tenant_suspended"
  | "outside_scope";
```

Rules:

* Kernel owns vocabulary.
* `@afenda/permissions` owns policy evaluation.
* `@afenda/entitlements` owns commercial plan and capability evaluation.
* API governance owns HTTP mapping.
* ERP owns route/action enforcement.
* Database owns role/permission persistence.

---

## 4.10 Domain Event Envelope

Kernel may own the generic event envelope.

Example:

```ts
interface DomainEvent<TPayload extends JsonObject = JsonObject> {
  readonly eventId: string;
  readonly eventName: string;
  readonly schemaVersion: number;
  readonly tenantId: TenantId | null;
  readonly correlationId: CorrelationId;
  readonly causationId: string | null;
  readonly occurredAt: string;
  readonly payload: TPayload;
}
```

Rules:

* Kernel owns envelope and metadata vocabulary.
* Kernel does not own event dispatch.
* Kernel does not own outbox publishing.
* Kernel does not own retry.
* Kernel does not own scheduling.
* Kernel does not own business event payloads unless separately approved as cross-package contracts.
* `@afenda/execution` owns dispatch, jobs, retry, outbox processing, and scheduling.
* `@afenda/database` owns persisted outbox rows.
* Domain modules own event names and payload contracts when activated.

JSON safety requirement:

```ts
type JsonPrimitive = string | number | boolean | null;

type JsonValue =
  | JsonPrimitive
  | JsonObject
  | readonly JsonValue[];

interface JsonObject {
  readonly [key: string]: JsonValue;
}
```

Do not use `Record<string, unknown>` as the event payload bound for wire-safe contracts.

---

## 4.11 Async Context Propagation

Kernel may own a minimal async context propagation primitive.

Approved API:

```ts
kernelContext.run(frame, fn);
kernelContext.get();
kernelContext.fork(overrides, fn);
```

Approved frame:

```ts
interface KernelContextFrame {
  readonly executionContext: ExecutionContext;
  readonly tenantId: TenantId | null;
  readonly correlationId: CorrelationId;
}
```

Rules:

* `run()` starts an isolated frame.
* `get()` returns the current frame or `null`.
* `fork()` shallow-clones the current frame and applies overrides.
* `fork()` is required for safe parallel work.
* No shared mutable frame must leak across `Promise.all()`.
* No database transaction belongs in kernel context.
* No request object belongs in kernel context.
* No session object belongs in kernel context.
* No permission result belongs in kernel context.
* No React/Next object belongs in kernel context.
* No Finance/HRM/Inventory/CRM/Procurement context belongs in kernel context.

This is the only approved runtime primitive in kernel.

Implementation rule:

* Kernel may provide a dependency-free implementation only if the package remains zero runtime dependency and tests prove isolation.
* If implementation risk becomes unclear, kernel should export the contract first and let the platform composition layer bind the runtime.

---

# 5. What This Package Must Never Own

Kernel must never own:

* Database schema
* Database migrations
* Database clients
* RLS SQL policies
* Auth sessions
* Auth cookies
* Auth providers
* Permission evaluation
* Feature flag evaluation
* Entitlement evaluation
* API route handlers
* Server actions
* React components
* UI primitives
* App shell navigation behavior
* Domain workflows
* Business services
* Integration SDKs
* External API clients
* Cron jobs
* Queue workers
* Outbox publishing
* Fiscal calendar setup
* Fiscal period close workflow
* Functional currency decisions
* Reporting currency decisions
* Currency conversion
* Accounting posting
* Ledger calculation
* Consolidation elimination
* Inventory stock movement logic
* HRM payroll logic
* CRM pipeline logic
* Procurement approval logic
* Translation files
* Date/number formatting implementation
* Country statutory rules
* UOM conversion rules

**Runtime authority:** `packages/kernel/src/governance/kernel-prohibited-ownership.contract.ts` — `KERNEL_PROHIBITED_OWNERSHIP_CONCERNS`, `KERNEL_PROHIBITED_OWNERSHIP_POLICY`. Gate: `pnpm check:kernel-prohibited-ownership`.

---

# 6. Package Structure Standard

## 6.1 Current package structure

The current package structure is source truth. Do not rewrite it from greenfield examples.

**Runtime authority:** `packages/kernel/src/contracts/kernel-package-layout.contract.ts` — `KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL`, `KERNEL_PACKAGE_LAYOUT_POLICY`. Gate: `pnpm check:kernel-package-structure`.

**Detailed annotated tree:** `packages/kernel/PAS-001-KERNEL-TREE.md` (drift markers, §4.4 module list). **Drift registry:** `packages/kernel/src/governance/kernel-boundary-drift.registry.ts`.

Current public areas include:

```text
packages/kernel/
├── PAS-001-KERNEL-TREE.md
├── package.json
├── tsconfig.json
├── tsconfig.vitest.json
├── vitest.config.ts
└── src/
    ├── index.ts
    ├── contracts/
    │   ├── result.contract.ts
    │   ├── app-error.contract.ts
    │   ├── problem-detail.contract.ts
    │   ├── json-wire.contract.ts
    │   ├── execution-context.contract.ts
    │   ├── execution-context.policy.contract.ts
    │   ├── kernel-package-layout.contract.ts
    │   └── platform/
    ├── context/                          # operating-context shapes (§4.4)
    ├── erp-domain/                       # ERP domain vocabulary modules (§4.8)
    │   ├── erp-domain-layout.contract.ts
    │   └── accounting/                   # @afenda/kernel/erp-domain/accounting
    ├── governance/
    ├── identity/
    ├── permission/
    ├── propagation/
    ├── events/
    ├── policy/
    └── __tests__/
```

**Three-way kernel split:** `context/` = operating-context shapes (§4.4); `contracts/` = platform wire vocabulary only (result, execution context, platform entity map); `erp-domain/{module}/` = ERP domain vocabulary template (`accounting/` first — §4.8). Do not place ERP domain modules under `contracts/`.

## 6.2 Target package structure after approved slices

Delivered areas (`identity/`, `governance/`, `permission/`, `propagation/`, `events/`, `policy/`, `problem-detail.contract.ts`, `localization-context.contract.ts`) are **current** — do not list them as future targets.

Target additions must only appear after a new approved implementation slice:

```text
packages/kernel/
└── src/
    └── (no pending PAS §6.2 folder additions — register new folders in kernel-package-layout.contract.ts after slice delivery)
```

Do not add:

```text
context/currency-context.contract.ts
context/fiscal-calendar-context.contract.ts
```

Currency code belongs in branded primitive vocabulary. Currency decision context belongs to Finance / Legal Entity / Accounting.

Fiscal calendar belongs to Finance / Accounting.

## 6.3 Current public exports

PAS §6.4 baseline (eight keys — root plus seven subpaths; delivered B3–B16):

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./context": {
      "types": "./dist/context/index.d.ts",
      "import": "./dist/context/index.js",
      "default": "./dist/context/index.js"
    },
    "./erp-domain/accounting": {
      "types": "./dist/erp-domain/accounting/index.d.ts",
      "import": "./dist/erp-domain/accounting/index.js",
      "default": "./dist/erp-domain/accounting/index.js"
    },
    "./propagation": {
      "types": "./dist/propagation/index.d.ts",
      "import": "./dist/propagation/index.js",
      "default": "./dist/propagation/index.js"
    },
    "./events": {
      "types": "./dist/events/index.d.ts",
      "import": "./dist/events/index.js",
      "default": "./dist/events/index.js"
    },
    "./policy": {
      "types": "./dist/policy/index.d.ts",
      "import": "./dist/policy/index.js",
      "default": "./dist/policy/index.js"
    },
    "./permission": {
      "types": "./dist/permission/index.d.ts",
      "import": "./dist/permission/index.js",
      "default": "./dist/permission/index.js"
    },
    "./governance": {
      "types": "./dist/governance/index.d.ts",
      "import": "./dist/governance/index.js",
      "default": "./dist/governance/index.js"
    }
  }
}
```

Additional subpaths require a serialized slice and PAS §6.4 governance update before consumer import. `./permission` (B16-8) and `./governance` (B16-5) are part of the delivered baseline as of B18.

## 6.4 Public export governance (delivered)

PAS §6.4 subpaths are **delivered** for the eight-key baseline above. Runtime matched since B16 slice (`docs/PAS/slice/b16-6.2-package-structure.md`).

Additive policy for future subpaths:

* Root export (`.`) is stable public vocabulary.
* Subpath exports group authority surfaces.
* No deep imports from consumers.
* Every new subpath requires tests (`subpath-exports.test.ts` + boundary coverage).
* Every new subpath requires package export registration and `kernel-package-layout.contract.ts` update before consumer import.
* Every new subpath requires boundary governance (`pnpm quality:boundaries`).
* Current exports must not be removed during additive slices.
* Unified gate: `pnpm check:kernel-subpath-exports` validates the §6.4 eight-key baseline against `package.json` and layout contract.

---

# 7. Decision Matrix

| Question                                                      | If yes                                          | Belongs in kernel? |
| ------------------------------------------------------------- | ----------------------------------------------- | ------------------ |
| Is it an ID crossing package boundaries?                      | Branded ID                                      | Yes                |
| Is it a primitive localization/format code crossing packages? | Branded primitive or localization context shape | Yes                |
| Is it a UOM code crossing packages?                           | Branded `UomCode` primitive                     | Yes                |
| Is it date/number formatting implementation?                  | Rendering/application behavior                  | No                 |
| Is it selected locale/timezone/date-format value?             | User/company/location setting                   | No                 |
| Is it functional/base/reporting currency decision?            | Finance/accounting/legal-entity configuration   | No                 |
| Is it fiscal calendar or fiscal period behavior?              | Finance/accounting configuration                | No                 |
| Is it a database table or query?                              | Persistence                                     | No                 |
| Is it a resolver that loads real data?                        | Application/database behavior                   | No                 |
| Is it a permission decision word?                             | Shared vocabulary                               | Yes                |
| Is it actual permission evaluation?                           | Runtime logic                                   | No                 |
| Is it a lifecycle state used across packages?                 | Shared vocabulary                               | Yes                |
| Is it a business process?                                     | Domain behavior                                 | No                 |
| Is it a wire-safe event envelope?                             | Shared integration vocabulary                   | Yes                |
| Is it event dispatch or retry?                                | Execution runtime                               | No                 |
| Is it accounting vocabulary?                                  | Cross-domain contract                           | Yes                |
| Is it ledger/posting/calculation?                             | Accounting runtime                              | No                 |
| Is it country/UOM master-row ownership?                       | Reference-data/domain persistence               | No                 |
| Is it a cross-package business record reference ID?           | Business reference identity                     | Yes, as ID only    |
| Is it required by only one package?                           | Local concern                                   | No                 |

**Runtime authority:** `packages/kernel/src/governance/kernel-decision-matrix.contract.ts` — `KERNEL_DECISION_MATRIX_ROWS`, `KERNEL_DECISION_MATRIX_POLICY`. Gate: `pnpm check:kernel-decision-matrix`.

---

# 8. Permission Model Standard

Kernel may define the permission vocabulary pattern:

```text
permission = module × action × scope
```

Recommended action vocabulary:

```text
create, read, update, delete, approve, export, import, manage, assign, revoke
```

Recommended scope vocabulary:

```text
tenant, entity_group, legal_entity, organization_unit, team, project, own_data, assigned, global
```

Rules:

* Kernel may define vocabulary.
* `@afenda/permissions` owns registry and checks.
* Database owns role/permission storage.
* ERP owns route/action enforcement.
* API governance owns HTTP error mapping.

---

# 9. Contract Rules

Every kernel contract must satisfy:

1. TypeScript strict mode.
2. No project-internal imports except within kernel.
3. JSON-serializable wire shape where used across boundaries.
4. Branded IDs for cross-package identifiers.
5. `readonly` object properties.
6. Explicit `null` for absent runtime context.
7. No silent fallback to tenant/company/org.
8. No untyped `string` for governed IDs.
9. No hidden business logic.
10. No side effects during import.
11. No duplicated current-source contract pattern.
12. No greenfield replacement of existing brand or error helpers.
13. No source-incompatible example stubs in canonical docs.
14. **Wire context triad** — contexts with wire ingress use `*.contract.ts`, `*.assert.ts`, and `*.parser.ts`; branded context only after validation (see §4.4).

**Runtime authority:** `packages/kernel/src/governance/kernel-contract-rules.policy.ts` — `KERNEL_CONTRACT_RULES`, `KERNEL_CONTRACT_RULES_POLICY`. Gates: `pnpm check:kernel-context-wire-triad` (B69 Delivered) · `pnpm check:kernel-contract-rules`.

---

# 10. Runtime Rules

Kernel runtime code is allowed only when all are true:

1. It has zero external dependencies.
2. It does not access database, HTTP, filesystem, auth, permission engine, observability sink, UI runtime, or environment secrets.
3. It supports cross-package execution safety.
4. It is tested for isolation.
5. It fails closed.
6. It has no application-specific behavior.
7. It carries only kernel-approved context frame fields.

Currently approved runtime primitive:

```text
Async context propagation only.
```

Everything else must remain contracts, pure helpers, or registries.

**Runtime authority:** Registry: `packages/kernel/src/governance/kernel-runtime-rules.contract.ts` · Gate: `pnpm check:kernel-runtime-rules` · Approved primitive: `packages/kernel/src/propagation/` (`kernelContext.run`, `kernelContext.get`, `kernelContext.fork`).

---

# 11. Implementation Sequence

Recommended sequence for new kernel additions:

1. Add primitive brands: `LocaleCode`, `TimezoneId`, `DateFormat`, `NumberFormat`, `CurrencyCode`, `CountryCode`, `UomCode`, `DocumentId`, `AssetId`.
2. Add `LocalizationContext` shape.
3. Enrich `AppError` through current `AppError` / `AppErrors.*` style.
4. Add RFC 9457-aligned `ProblemDetail` wire contract.
5. Add optional `traceId` and `spanId` to `ExecutionContext`.
6. Add generic lifecycle / approval / document-state vocabulary only if cross-package and non-domain-specific.
7. Add policy decision vocabulary.
8. Add strict JSON-safe wire utility types.
9. Add async context propagation.
10. Add domain event envelope.
11. Add governance scripts for propagation isolation, event wire serializability, and zero runtime dependencies.

Do not add in kernel:

* `FiscalCalendarContext`
* `CurrencyContext`
* fiscal period state outside already-approved erp-domain accounting vocabulary
* fiscal year start month
* period open/close/lock runtime status
* functional/base/reporting currency decisions
* currency conversion
* locale resolver
* formatting implementation

---

# 12. Enterprise Acceptance Criteria

A kernel change is accepted only when all criteria pass.

## 12.1 Architecture

* Kernel remains Platform layer.
* Kernel has zero runtime package dependencies.
* Kernel does not import database/auth/permissions/execution/app packages.
* Kernel does not duplicate domain packages.
* Kernel does not implement application resolvers.
* Kernel does not own domain setup decisions.

## 12.2 Type Safety

* New IDs are branded.
* New contracts use `readonly`.
* New contracts are exported from the correct barrel.
* New wire contracts are JSON-serializable.
* No raw string identifiers cross package boundaries without branding.
* Existing source patterns are preserved unless a dedicated migration slice approves a change.

## 12.3 Governance

* Package exports are updated only when new subpaths are implemented.
* Context registry is updated when context contracts change.
* Authority registry is updated when authority surface changes.
* Tests cover every new contract.
* Boundary checks pass.
* Typecheck passes.
* Kernel test suite passes.
* Architecture authority checks pass.

## 12.4 Runtime Safety

* Async propagation does not leak context between concurrent operations.
* `fork()` creates an isolated child frame.
* Missing context returns `null` or a typed failure.
* No fallback tenant/company/org is invented.
* Runtime frame carries no domain/app/database/session/request objects.

## 12.5 ERP Readiness

* Multi-tenant context remains explicit.
* Multi-company and entity-group context remain explicit.
* Ownership interest and consolidation scope remain metadata only.
* Accounting vocabulary remains contracts only.
* Business reference identities remain reference-only in kernel.
* Localization context is vocabulary/shape only; actual selection and formatting happen outside kernel.

---

# 13. Slice Catalog

Index of kernel implementation slices under `docs/PAS/slice/`. Handoff format: 9 fields — see [pas-slice-template.md](../../.cursor/skills/kernel-authority/reference/pas-slice-template.md).

Slice naming: `b<N>-<pas-section>-<slug>.md` · optional companion: `<file>-prohibited.md` (example: [b5-prohibited.md](slice/b5-prohibited.md)).

| Slice file | ID | PAS § | Status | Type | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| [b2-4.1.2-module-location.md](slice/b2-4.1.2-module-location.md) | B2 | §4.1.2 | Delivered | Implementation | Constitutional baseline (§4.1.1) |
| [b3-4.1.1-three-layer-stack.md](slice/b3-4.1.1-three-layer-stack.md) | B3 | §4.1.1 | Delivered | Implementation | None |
| [b5.md](slice/b5.md) | B5 | §4.1.5 | Delivered | Implementation | B4 primitive references |
| [b5a-4.1.6-forbidden-platform-floor.md](slice/b5a-4.1.6-forbidden-platform-floor.md) | B5a | §4.1.6 | Delivered | Implementation | B4 |
| [b6-4.17.md](slice/b6-4.17.md) | B6 | §4.1.7 | Delivered | Implementation | B5 |
| [b7-4.1.8.md](slice/b7-4.1.8.md) | B7 | §4.1.8 | Delivered | Implementation | B6 |
| [b8-4.1.9-audit.md](slice/b8-4.1.9-audit.md) | B8 | §4.1.9 | Delivered | Implementation | B7 |
| [b8a-4.1.9-consumer.md](slice/b8a-4.1.9-consumer.md) | B8a | §4.1.9 | Delivered | Implementation | B8 |
| [b9-4.1.11-auth.md](slice/b9-4.1.11-auth.md) | B9 | §4.1.11 | Delivered | Implementation | B8 |
| [b10-4.1.10-api-ingress.md](slice/b10-4.1.10-api-ingress.md) | B10 | §4.1.10 | Delivered | Implementation | B8 |
| [b11-4.1.13-tenant-human-reference-policy.md](slice/b11-4.1.13-tenant-human-reference-policy.md) | B11 | §4.1.13 | Delivered | Implementation | B5 |
| [b11-4.1.14-promotion-checklist.md](slice/b11-4.1.14-promotion-checklist.md) | B11 | §4.1.14 | Delivered | Implementation | B9 |
| [b12-4.1.12-postgres-persistence.md](slice/b12-4.1.12-postgres-persistence.md) | B12 | §4.1.12 | Delivered | Implementation | B8 |
| [b13-4.1.3-canonical-format-quality.md](slice/b13-4.1.3-canonical-format-quality.md) | B13 | §4.1.3 | Delivered | Implementation | B7 |
| [b14-4.5-localization.md](slice/b14-4.5-localization.md) | B14 | §4.5 | Delivered | Implementation | B4 |
| [b15-4.3-execution-context.md](slice/b15-4.3-execution-context.md) | B15 | §4.3 | Delivered | Implementation | B3 |
| [b15-4.6-platform-entity-authority.md](slice/b15-4.6-platform-entity-authority.md) | B15 | §4.6 | Delivered | Implementation | B3 |
| [b15-4.7-business-reference-identity.md](slice/b15-4.7-business-reference-identity.md) | B15 | §4.7 | Delivered | Implementation | B4 |
| [b15-4.8-accounting-domain-vocabulary.md](slice/b15-4.8-accounting-domain-vocabulary.md) | B15 | §4.8 | Delivered | Implementation | B5a |
| [b15-4.9-policy-decision-vocabulary.md](slice/b15-4.9-policy-decision-vocabulary.md) | B15 | §4.9 | Delivered | Implementation | B14 |
| [b16-4.2-result-error-vocabulary-quality.md](slice/b16-4.2-result-error-vocabulary-quality.md) | B16 | §4.2 | Delivered | Implementation | B3 |
| [b16-5-kernel-prohibited-ownership.md](slice/b16-5-kernel-prohibited-ownership.md) | B16 | §5 | Delivered | Implementation | B3 |
| [b16-6.2-package-structure.md](slice/b16-6.2-package-structure.md) | B16 | §6.2 | Delivered | Implementation | B15-4.3 |
| [b16-7-decision-matrix.md](slice/b16-7-decision-matrix.md) | B16-7 | §7 | Delivered | Implementation | B16-5 |
| [b16-8-permission-model-standard.md](slice/b16-8-permission-model-standard.md) | B16-8 | §8 | Delivered | Implementation | B15-4.9 |
| [b16-9-kernel-contract-rules.md](slice/b16-9-kernel-contract-rules.md) | B16 | §9 | Delivered | Implementation | B16-5 |
| [b16-10-runtime-rules.md](slice/b16-10-runtime-rules.md) | B16 | §10 | Delivered | Implementation | Propagation runtime |
| [b17-11-implementation-sequence.md](slice/b17-11-implementation-sequence.md) | B17 | §11 | Delivered | Implementation | B16-6.2 |
| [b18-6.3-public-exports-parity.md](slice/b18-6.3-public-exports-parity.md) | B18 | §6.3 | Delivered | Evidence-sync | B16-6.2 |
| [b49-kernel-tenant-wire-triad.md](slice/b49-kernel-tenant-wire-triad.md) | B49 | §4.4 | Delivered | Evidence-sync | Tenant wire triad runtime + ADR-0022 ERP split-ID |
| [b50-kernel-company-org-wire-triad.md](slice/b50-kernel-company-org-wire-triad.md) | B50 | §4.4 | Delivered | Implementation | B49 |
| [b51-kernel-parent-org-wire.md](slice/b51-kernel-parent-org-wire.md) | B51 | §4.4 | Delivered | Implementation | B50 |
| [b52-kernel-full-hierarchy-wire-closure.md](slice/b52-kernel-full-hierarchy-wire-closure.md) | B52 | §4.4 | Delivered | Implementation | B51 |
| [b53-kernel-propagation-frame-wire.md](slice/b53-kernel-propagation-frame-wire.md) | B53 | §4.11 | Delivered | Implementation | B16 §10 |
| [b54-kernel-project-wire-triad.md](slice/b54-kernel-project-wire-triad.md) | B54 | §4.11 | Delivered | Implementation | B52 |
| [b55-kernel-policy-wire-triad.md](slice/b55-kernel-policy-wire-triad.md) | B55 | §4.9 | Delivered | Implementation | B15-4.9 |
| [b57-kernel-permission-wire-triad.md](slice/b57-kernel-permission-wire-triad.md) | B57 | §8 | Delivered | Implementation | B55 |
| [b67-pas001-doc-attestation-closure.md](slice/b67-pas001-doc-attestation-closure.md) | B67 | §14 | Delivered | Evidence-sync | B57 |
| [b68-hierarchy-id-boundary-wire-triad.md](slice/b68-hierarchy-id-boundary-wire-triad.md) | B68 | §4.4 | Delivered | Implementation | B67 |
| [b69-kernel-context-wire-triad-gate.md](slice/b69-kernel-context-wire-triad-gate.md) | B69 | §9 | Delivered | Implementation | B68 |
| [b70-kernel-test-import-hygiene.md](slice/b70-kernel-test-import-hygiene.md) | B70 | §3.3 | Delivered | Implementation | B69 |

**Planning artifacts (not formal slice handoffs):** `b4.md`, `b7-4.1.9.md` — superseded by delivered slices above.

**Kernel extension vs generic PAS template:** §8 Permission Model Standard is kernel-specific; generic PAS docs use §8 Contract Rules. Kernel §9–§12 map to template §8–§11.

---

# 14. Required Gates

## 14.1 Required

Run these before accepting any kernel package change:

```bash
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm quality:kernel-context-surface
pnpm check:kernel-context-wire-triad
pnpm check:kernel-identity-governance
pnpm check:kernel-zero-runtime-deps
pnpm check:accounting-domain-contracts
pnpm check:foundation-disposition
pnpm quality:boundaries
pnpm architecture:cycles
pnpm architecture:drift
```

## 14.2 Recommended

Recommended gates after relevant slices exist:

```bash
pnpm check:kernel-propagation-isolation
pnpm check:kernel-events-wire-serializable
```

## 14.3 Promotion rules

* Recommended gates must not be required in CI until implemented.
* Once implemented, recommended gates become required for affected slices.
* Missing future gates must not block current source-only cleanup.

---

# 15. Reusable Package Guardrail Template

See [PAS README](README.md) for how to create a new PAS.

Reusable template index:

```text
.cursor/skills/kernel-authority/reference/pas-template.md
```

Split copy blocks: `pas-doc-template.md`, `pas-skill-template.md`, `pas-slice-template.md`, `pas-reference-templates.md`.

New PAS files should live under:

```text
docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md
```

Each package authority standard should have:

* one canonical PAS document
* one optional agent skill adapter
* one optional package-local tombstone pointer
* no duplicated long-form authority document outside `docs/PAS/`

---

# 16. Final Kernel Doctrine

The kernel is not a dumping ground for shared code.

The kernel is the smallest possible stable language that lets Afenda ERP agree on identity, hierarchy, localization vocabulary, execution context, correlation, errors, lifecycle, policy decision vocabulary, event envelope, and cross-package references.

When in doubt:

> If it describes a cross-package fact or primitive vocabulary, it may belong in kernel.
> If it decides, loads, calculates, formats, evaluates, renders, persists, or executes, it belongs outside kernel.

The kernel owns the words.
The owner package owns the decision.
The runtime layer owns the behavior.
