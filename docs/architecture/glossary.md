# Afenda ERP — Architecture Glossary

> **Authority:** This glossary is the canonical vocabulary for all platform, domain, and UI design decisions.
> When a term here conflicts with informal usage elsewhere, this document wins.
> Revision: 2026-06-22 | TIP-007 / TIP-008 scope.

---

## Tenant

**SaaS/customer boundary. Root security and subscription boundary.**

A Tenant is the top-level isolation unit on the Afenda platform. Every entity, user, and configuration record belongs to exactly one Tenant. The Tenant owns:

- Platform subscription, commercial plan, and entitlement grants
- Security isolation — no data from Tenant A is ever visible to Tenant B
- The slug namespace for all child records (`company.slug` is unique per Tenant)
- Authentication boundary — Better Auth sessions are resolved against a platform user; Tenant context is injected from the request (subdomain header `x-tenant-slug`), never from the session

**A Tenant may contain one or many Entity Groups, or companies that are not part of a group.**

**Must not be confused with legal entity/company.** A Tenant is an operational SaaS customer account; a legal entity is a registered statutory body.

**Lifecycle:** `active | suspended | archived`. Never hard-delete.

**Schema:** `tenants` table — `packages/database/src/schema/tenant.schema.ts`

---

## Entity Group

**Corporate group structure under a Tenant. May represent a holding group.**

An Entity Group is the corporate umbrella that ties related Legal Entities (companies) together under a single Tenant. It:

- Owns group-level reporting, intercompany reconciliation, and future consolidation scope
- Contains one or more Legal Entities with defined Ownership Interests between them
- May be modelled as a holding company or simply a grouping label (non-legal)
- Has an optional designated "group parent" Legal Entity (the holding company) that anchors the consolidation tree

**When no group structure is needed**, a Tenant may have only standalone Legal Entities without an Entity Group wrapper.

**Must not be confused with Legal Entity.** An Entity Group is a corporate umbrella — not a statutory company with its own tax identity unless designated as the group parent (`parentEntityId`).

**Must not be confused with Organization Unit.** Entity Groups sit above Legal Entities; branches and departments live inside companies.

**Schema status:** Authority foundation — `entity_groups` table implemented (TIP-008). Do not implement consolidation accounting logic yet; only prepare the authority model.

**Example corporate structures an Entity Group can represent:**
- Holding company + subsidiaries
- Parent company + joint ventures + associates
- Franchise group with minority-interest outlets

---

## Legal Entity / Company

**Registered statutory company. Owns accounting books, tax identity, fiscal calendar, reporting currency, and statutory obligations.**

A Legal Entity (mapped to `companies` in the schema) is a real-world registered business entity. It:

- Has a unique legal name, tax registration number, jurisdiction code, and reporting currency
- Owns one or more accounting books (chart of accounts, fiscal calendar, general ledger)
- Holds statutory obligations — VAT/GST reporting, corporate tax, statutory filings
- Is the boundary for accounts payable, accounts receivable, payroll, and cost allocation
- Contains a tree of Organization Units beneath it

**Relationship types between Legal Entities** (captured via Ownership Interest):

| Type | Description |
|------|-------------|
| `parent` | The controlling entity in the group |
| `subsidiary` | Majority-owned (>50% voting) — fully consolidated |
| `associate` | Significant influence (20–50%) — equity method |
| `joint_venture` | Jointly controlled — proportional or equity method |
| `minority_interest` | Less than 20% — cost method; non-controlling |
| `non_controlling_interest` | Minority owner in an entity the group controls |

**Must not be treated as a generic organization unit.** An Organization Unit (branch, department, warehouse) lives inside a Legal Entity — it is not a peer of it.

**Must not be confused with Entity Group.** A Legal Entity exists independently of group membership; standalone companies may have no Entity Group.

**Schema:** `companies` table — `packages/database/src/schema/company.schema.ts`

---

## Ownership Interest

**Relationship between Legal Entities. Captures control, economics, and consolidation treatment.**

An Ownership Interest record links a parent (investor) Legal Entity to a child/investee Legal Entity and captures:

| Field | Description |
|-------|-------------|
| `parentEntityId` | The investing/controlling Legal Entity |
| `childEntityId` | The investee/subsidiary/associate Legal Entity |
| `ownershipPercentage` | Economic ownership (0–100%) |
| `votingPercentage` | Voting rights (may differ from economic %) |
| `controlType` | `full_control | joint_control | significant_influence | passive` |
| `relationshipType` | `subsidiary | associate | joint_venture | minority_interest | non_controlling_interest` |
| `effectiveFrom` | Date the relationship became effective |
| `effectiveTo` | Date the relationship ended (nullable = current) |
| `consolidationMethod` | `full | proportional | equity | cost | none` |
| `entityGroupId` | The Entity Group this ownership belongs to |

**Why it matters:**
- Determines which entities are in scope for consolidated financial statements
- Drives RLS grants — a group CFO sees all subsidiary books; a subsidiary accountant sees only their own
- Required for intercompany elimination, minority interest disclosure, and equity method accounting

**Must not be confused with Membership.** Ownership Interest links Legal Entities for control and economics — not user access grants.

**Must not be confused with Organization Unit.** Ownership is between companies, not operational org tree nodes.

**Schema status:** Authority foundation — `legal_entity_ownership` table implemented (TIP-008).
Do not implement consolidation accounting logic in the current slice; only prepare the authority model.

---

## Organization Unit

**Operational structure inside a Legal Entity or group.**

An Organization Unit is an operational node in the operating tree beneath a Legal Entity. Examples:

- **Branch** — regional or geographic business unit
- **Department** — functional unit (finance, operations, HR)
- **Site / Farm / Factory / Warehouse** — physical production or storage facility
- **Retail outlet** — customer-facing store
- **Cost center** — accounting allocation point

Organization Units form a tree (`parentOrganizationId`). Cycles are prevented by `assertNoOrganizationCycle()`.

**Used for:**
- Operations and workflow routing (a purchase order is raised at a branch)
- Access scope — a branch manager sees only their branch's records
- Reporting segments (by org unit)

**Must not replace Legal Entity/Company.** A factory is an Organization Unit, not a separate legal entity (unless it is independently incorporated).

**Schema:** `organizations` table with `type` enum: `company_root | branch | department | team`
`packages/database/src/schema/organization.schema.ts`

---

## Team

**People group used for task and workflow execution.**

A Team is a named group of platform users assembled for a specific operational or project purpose. It:

- Belongs to a Tenant and may be optionally scoped to a Legal Entity, Organization Unit, Project, or Workspace
- Has a defined set of Members, each with a team-level role
- Is the execution unit for workflow tasks, approvals, and assignments
- Is not the same as an Organization Unit — a Team may be cross-department or cross-entity

**Must not be confused with Tenant or Legal Entity.** A Team is an execution grouping of people; it does not own accounting books, tax identity, or statutory filings.

**Examples:** "Invoice approval team", "Warehouse picking team", "ERP implementation project team"

**Current mapping:** Teams are currently modelled as `organizations.type = "team"` within the Organization tree.
A dedicated `teams` table is planned for TIP-030 (Project Management) to allow cross-entity and cross-org-unit teams.

**RLS scope:** A user's Team membership grants access to the tasks, documents, and records assigned to that Team within the allowed Legal Entity and Organization Unit boundary.

---

## Project

**Scoped initiative, job, or project.**

A Project is a bounded initiative with its own budget, timeline, tasks, approvals, and accounting dimension. It:

- May belong to a Legal Entity, an Organization Unit, a Team, or span multiple entities (cross-entity program)
- Has its own lifecycle: `draft | active | on_hold | completed | cancelled`
- Is the future dimension for project accounting (cost allocation, WIP, project P&L)
- Drives task assignments, approval workflows, and budget consumption tracking

**Examples:** "Factory expansion Phase 2", "Q3 product launch", "New customer onboarding"

**Schema status:** Planned for TIP-030 (Project Management, Phase 3). Do not create `projects` table before TIP-030 is approved.

**Must not be confused with Team or Organization Unit.** A Project is a bounded initiative with budget and lifecycle — not a permanent org structure or people roster.

**RLS scope:** A user with a Project role (e.g., `project.manager`) may access all records tagged to that Project within the allowed Legal Entity boundary.

---

## Workspace

**User-facing ERP operating area. Derived from allowed context.**

A Workspace is the active operational context a user is working in. It is derived at runtime from:

- The authenticated user's active Membership scope
- The Tenant (from `x-tenant-slug` header)
- The selected Legal Entity / Company
- The selected Organization Unit (optional)
- The selected Project (optional)

A Workspace is **not a database table** — it is a resolved context object assembled from the above authorities.

**Does not own legal or security authority.** A Workspace simply reflects the user's currently active scope; it does not grant any permissions by itself.

**Must not be confused with Tenant, Legal Entity, or Surface.** Workspace is assembled runtime context — not a persisted authority tier or UI module identifier.

**Used for:** UI context (which company, branch, and project is the user currently operating within), breadcrumb and navigation state, default values on new records.

---

## Surface

**Current page, module, or screen. Used for metadata and UI runtime context.**

A Surface identifies which page or module section the user is viewing. It is used by:

- The Metadata Authority (`@afenda/metadata`) to resolve which layout, columns, and actions to render
- Feature flag evaluation (a feature may be enabled on one surface but not another)
- Analytics and error reporting (correlate errors to a specific ERP screen)

A Surface is **not a database entity** — it is a runtime string identifier (e.g., `"accounting.journal.list"`, `"inventory.warehouse.detail"`).

**Must not be confused with Workspace.** A Surface identifies which UI module or screen is active; Workspace is the user's resolved operating context.

**Must not be confused with Tenant or Legal Entity.** Surface is a metadata module identifier — not a security or statutory boundary.

**Format:** `<domain>.<module>.<view>` — always lowercase, dot-separated.

---

## RLS Grant

**Database-level or application-level access scope. Must be derived from authority model. Must fail closed.**

An RLS Grant represents the specific set of records a user is authorized to read, write, or modify. In Afenda:

**Application-level RLS** is enforced by the permission engine in `@afenda/permissions`:
- `requirePermission()` checks actor + permission key + scope context
- Denial codes: `PERMISSION_DENIED | POLICY_DENIED | SCOPE_MISMATCH | ENTITY_SUSPENDED`
- All denials are logged as audit events

**Database-level RLS** uses Supabase Postgres Row Level Security:
- Policies are derived from the JWT claims injected by Better Auth
- Tables with `tenantId` column have a policy `tenantId = auth.jwt()->>'tenant_id'`
- Legal Entity isolation: `companyId IN (select company_id from memberships where user_id = auth.uid())`

**RLS Grant must be derived from all applicable dimensions:**

| Dimension | Authority source |
|-----------|-----------------|
| Tenant | `x-tenant-slug` header → resolved `tenantId` |
| Entity Group | entity group membership (group-level role) |
| Legal Entity | active company membership scope |
| Organization Unit | active org membership scope |
| Team | team membership record |
| Project | project role assignment |
| Role | `roles` + `role_permissions` tables |
| Permission | `permissions` table + `requirePermission()` |

**Must fail closed:** If any required context is missing, unresolved, or suspended, access is denied — never assumed.

**Must not be confused with Membership.** RLS Grant is the derived access outcome; Membership is the user-role-scope record that feeds grant resolution.

---

## Consolidation Scope

**Future accounting/reporting boundary. Authority model prepared now; accounting logic deferred to Phase 2+.**

A Consolidation Scope defines which Legal Entities are included in a consolidated set of financial statements and what method applies for each. It is derived from:

| Input | Description |
|-------|-------------|
| Entity Group | The reporting group (holding company + all investees) |
| Legal Entities | Specific entities in scope for this consolidation run |
| Ownership Interests | Percentage, voting rights, and control type per entity pair |
| Control type | `full_control` → full consolidation; `joint_control` → proportional; `significant_influence` → equity method |
| Consolidation method | `full | proportional | equity | cost | none` per entity |
| Effective dates | Only ownership interests active at the reporting date are included |

**Phase boundary:**
- **Now (Phase 1 / TIP-008):** Prepare the authority model — Entity Group, Legal Entity, and Ownership Interest tables. Data is captured; no arithmetic is run.
- **Phase 2 (TIP-013+):** Consolidation arithmetic — elimination entries, minority interest calculation, currency translation.

**Do not implement consolidation accounting logic in this slice.**

**Resolver status (TIP-008A Slice 1–2):** `deriveConsolidationScopeContext` in `packages/kernel/src/context/consolidation-scope-resolution.server.ts` derives scope metadata from effective-dated ownership interests. Duplicate investees use `CONSOLIDATION_SCOPE_INVESTEE_DEDUP_POLICY` (`last_wins_by_input_order`). ERP wiring: `apps/erp/src/lib/context/resolve-consolidation-scope.server.ts`.

**Must not be confused with Entity Group.** Consolidation Scope is a derived reporting boundary at a point in time — not the corporate group definition itself.

---

## Business Master Data (TIP-008B)

**Operational business records — distinct from enterprise hierarchy (Tenant, Entity Group, Legal Entity).**

Business master data entities are governed **party and catalog records** used by domain packages. They reference Legal Entity / company scope where noted but are **not** statutory company definitions.

| Term | Owning domain | Reserved package | Identity scope |
| --- | --- | --- | --- |
| **Customer** | CRM Authority | `@afenda/crm` (PKG-R04) | Tenant + company; external customer code unique per company |
| **Supplier** | Procurement Authority | `@afenda/procurement` (PKG-R05) | Tenant + company; vendor code unique per company |
| **Product** | Inventory Authority | `@afenda/inventory` (PKG-R02) | Tenant; SKU unique per tenant catalog |
| **Employee** | HRM Authority | `@afenda/hrm` (PKG-R03) | Tenant + company; employee number unique per company |
| **Warehouse** | Inventory Authority | `@afenda/inventory` (PKG-R02) | Tenant + company; warehouse code unique per company |

**TBD (future ADR — do not scaffold packages):** Asset (Platform / TPM), Document (Platform document service). **Project** defers to TIP-030 PM domain.

**Must not be confused with Legal Entity / Company.** A Customer is a business party; a Legal Entity is a registered statutory body. A Warehouse is a storage location inside a company; it is not an Organization Unit type unless explicitly mapped in domain TIPs.

**Runtime status:** **Complete (authority only)** — frozen kernel registry + wire reference contracts in `@afenda/kernel`; no `@afenda/crm`, `@afenda/inventory`, `@afenda/hrm`, or `@afenda/procurement` package schemas until domain TIPs.

---

## Mapping to Implementation Status

| Concept | Schema table | Status |
|---------|-------------|--------|
| Tenant | `tenants` | Implemented |
| Entity Group | `entity_groups` | Authority foundation — schema + services (TIP-008) |
| Legal Entity / Company | `companies` | Implemented |
| Ownership Interest | `legal_entity_ownership` | Authority foundation — schema + services (TIP-008) |
| Organization Unit | `organizations` | Implemented (types: `branch`, `department`, `company_root`, `team`) |
| Team | `organizations` (`type = "team"`) | Partial — dedicated table planned TIP-030 |
| Project | — | **Planned — TIP-030** |
| Workspace | Runtime context only | N/A — derived |
| Surface | Runtime string ID | N/A — metadata config |
| RLS Grant | `memberships` + Supabase RLS | Implemented (application-level); DB-level in progress |
| Consolidation Scope | Derived from `entity_groups` + `legal_entity_ownership` | **Implemented (scope metadata only)** — `consolidation-scope-resolution.server.ts` + ERP resolver (TIP-008A) |
| Customer | — (PKG-R04 `@afenda/crm`) | **Authority only** — kernel wire contracts (TIP-008B) |
| Supplier | — (PKG-R05 `@afenda/procurement`) | **Authority only** — kernel wire contracts (TIP-008B) |
| Product | — (PKG-R02 `@afenda/inventory`) | **Authority only** — kernel wire contracts (TIP-008B) |
| Employee | — (PKG-R03 `@afenda/hrm`) | **Authority only** — kernel wire contracts (TIP-008B) |
| Warehouse | — (PKG-R02 `@afenda/inventory`) | **Authority only** — kernel wire contracts (TIP-008B) |

---

*Last updated: 2026-06-24 — TIP-008A consolidation resolver + TIP-008B business master data authority map.*
