# Multi-Tenancy Reference

> This is the deep-technical companion to [SKILL.md](SKILL.md).
> Glossary: [`docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md`](../../../../docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md).

---

## Full schema relationships (current + planned)

```
tenants (id, slug, name, status)
  │
  ├── [planned Foundation phase 08] entity_groups (id, tenant_id, slug, display_name, parent_entity_id, status)
  │     │
  │     └── [planned Foundation phase 08] legal_entity_ownership (
  │           id, entity_group_id,
  │           parent_entity_id → companies.id,
  │           child_entity_id  → companies.id,
  │           ownership_percentage, voting_percentage,
  │           control_type, relationship_type,
  │           consolidation_method,
  │           effective_from, effective_to
  │         )
  │
  ├── companies (id, tenant_id, [entity_group_id planned], slug, legal_name,
  │              display_name, registration_number, tax_id,
  │              base_currency, country_code, status)
  │     │
  │     └── organizations (id, tenant_id, company_id, parent_organization_id,
  │                         slug, name, type, status)
  │           types: company_root | branch | department | team
  │
  ├── roles (id, tenant_id nullable, key, name, scope, status)
  │
  └── memberships (id, tenant_id, company_id, organization_id,
                    user_id, role_id, scope_type, status)
        scope_types: tenant | company | organization
        [planned] entity_group | project
```

All primary keys: UUID v4, database-generated via `defaultRandom()`.
All governed FK columns use named helpers from `ids.ts` (`tenantIdRef()`, `companyIdRef()`, etc.).

---

## Unique constraint summary

| Table | Unique constraint |
|-------|-------------------|
| `tenants` | `slug` (global) |
| `companies` | `(tenant_id, slug)` |
| `companies` | `(tenant_id, country_code, registration_number)` where `registration_number IS NOT NULL` |
| `organizations` | `(company_id, slug)` |
| `roles` | `key` where `tenant_id IS NULL`; `(tenant_id, key)` otherwise |
| `memberships` | Partial indexes per scope (see below) |
| [planned] `entity_groups` | `(tenant_id, slug)` |
| [planned] `legal_entity_ownership` | `(entity_group_id, parent_entity_id, child_entity_id, effective_from)` |

**Membership partial unique indexes:**

```sql
-- tenant scope
UNIQUE (user_id, tenant_id, role_id) WHERE scope_type = 'tenant'
-- company scope
UNIQUE (user_id, tenant_id, company_id, role_id) WHERE scope_type = 'company'
-- organization scope
UNIQUE (user_id, tenant_id, organization_id, role_id) WHERE scope_type = 'organization'
```

---

## Foreign key `ON DELETE` policies

| FK | Policy | Reason |
|----|--------|--------|
| `companies.tenant_id → tenants.id` | `RESTRICT` | Archive tenant before companies |
| `companies.entity_group_id → entity_groups.id` | `RESTRICT` (planned) | Archive group before unlinking |
| `organizations.tenant_id → tenants.id` | `RESTRICT` | |
| `organizations.company_id → companies.id` | `RESTRICT` | Archive company before orgs |
| `organizations.parent_organization_id → organizations.id` | `SET NULL` | Tree reparenting on delete |
| `memberships.tenant_id` | `RESTRICT` | |
| `memberships.company_id` | `RESTRICT` | |
| `memberships.organization_id` | `RESTRICT` | |
| `memberships.user_id → users.id` | `CASCADE` | Delete user removes all grants |
| `memberships.role_id → roles.id` | `RESTRICT` | |
| `legal_entity_ownership.entity_group_id` | `RESTRICT` (planned) | |
| `legal_entity_ownership.parent_entity_id → companies.id` | `RESTRICT` (planned) | |
| `legal_entity_ownership.child_entity_id → companies.id` | `RESTRICT` (planned) | |

---

## Company (Legal Entity) — current schema fields

```ts
// packages/database/src/schema/company.schema.ts
companies: {
  id: CompanyId,                  // UUID v4
  tenantId: TenantId,             // FK → tenants.id RESTRICT
  // entityGroupId: EntityGroupId | null,  ← add in Foundation phase 08
  slug: varchar(128),             // unique per tenant
  legalName: varchar(255),        // registered statutory name
  displayName: varchar(255),      // UI label
  registrationNumber: varchar(128) | null,
  taxId: varchar(128) | null,
  baseCurrency: char(3),          // ISO 4217 — e.g. "VND", "USD", "AUD"
  countryCode: char(2),           // ISO 3166-1 alpha-2
  status: "active" | "suspended" | "archived",
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

**Planned fields (Foundation phase 08):**
- `entityGroupId` — nullable FK to `entity_groups.id`
- `companyType` — discriminator: `standalone | holding | subsidiary | associate | joint_venture | minority`

---

## Entity Group — planned schema (Foundation phase 08)

```ts
// Planned: packages/database/src/schema/entity-group.schema.ts
entity_groups: {
  id: EntityGroupId,
  tenantId: TenantId,
  slug: varchar(128),              // unique per tenant
  displayName: varchar(255),
  parentEntityId: CompanyId | null, // the holding company, if one exists
  status: "active" | "suspended" | "archived",
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

Service functions to add alongside `entity_groups` table:
- `insertEntityGroup(input, audit)` 
- `updateEntityGroup(entityGroupId, input, audit)`
- `archiveEntityGroup(entityGroupId, audit)`

---

## Ownership Interest — planned schema (Foundation phase 08)

```ts
// Planned: packages/database/src/schema/legal-entity-ownership.schema.ts
legal_entity_ownership: {
  id: OwnershipInterestId,
  entityGroupId: EntityGroupId,
  parentEntityId: CompanyId,
  childEntityId: CompanyId,
  ownershipPercentage: numeric(5,2),    // 0.00–100.00
  votingPercentage: numeric(5,2),
  controlType: "full_control" | "joint_control" | "significant_influence" | "passive",
  relationshipType: "subsidiary" | "associate" | "joint_venture"
                  | "minority_interest" | "non_controlling_interest",
  consolidationMethod: "full" | "proportional" | "equity" | "cost" | "none",
  effectiveFrom: date,
  effectiveTo: date | null,
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

**Validation rules:**
- `parentEntityId !== childEntityId` (no self-ownership)
- Both entities must belong to the same `tenantId` (via `entityGroupId`)
- `ownershipPercentage + votingPercentage` each ≤ 100
- Only one active ownership record per `(parentEntityId, childEntityId)` pair at any effective date

---

## Organization Unit — current schema

```ts
// packages/database/src/schema/organization.schema.ts
organizations: {
  id: OrganizationId,
  tenantId: TenantId,
  companyId: CompanyId,
  parentOrganizationId: OrganizationId | null,
  slug: varchar(128),              // unique per company
  name: varchar(255),
  type: "company_root" | "branch" | "department" | "team",
  status: "active" | "suspended" | "archived",
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

**Mapping organization types to business structures:**

| `type` | Business structures it represents now |
|--------|---------------------------------------|
| `company_root` | The single root of the legal entity's org tree |
| `branch` | Branch, regional office, retail outlet, farm, factory, warehouse |
| `department` | Functional department, cost center, division |
| `team` | Execution team, project team (temporary) |

A `siteType` discriminator (e.g., `"farm" | "factory" | "warehouse" | "outlet"`) should be added as
a metadata column in a future TIP to allow differentiated reporting without changing the type enum.

---

## Audit context required for all governed writes

```ts
interface TenantAuditContext {
  actorType: AuditActorType;  // "user" | "system" | "service" | "integration" | "cron" | "import"
  actorUserId?: string | null;
  correlationId: string;
  ipAddress?: string | null;
  source?: "app" | "api" | "system";
  userAgent?: string | null;
}
```

Every service function writes an audit event to `audit_events` automatically.

---

## Organization tree operations

```ts
import {
  insertOrganization,
  updateOrganization,
  deleteOrganization,
} from "@afenda/database";

// Create root org (one per company)
await insertOrganization({
  input: {
    tenantId, companyId,
    slug: "hq",
    name: "Headquarters",
    type: "company_root",
    parentOrganizationId: null,
  },
  audit,
});

// Branch / physical site
await insertOrganization({
  input: {
    tenantId, companyId,
    slug: "factory-bien-hoa",
    name: "Biên Hòa Factory",
    type: "branch",        // use "branch" for physical sites until siteType is added
    parentOrganizationId: rootOrgId,
  },
  audit,
});

// Team under a department
await insertOrganization({
  input: {
    tenantId, companyId,
    slug: "picking-team",
    name: "Warehouse Picking Team",
    type: "team",
    parentOrganizationId: warehouseDeptOrgId,
  },
  audit,
});
```

`deleteOrganization` fails with `OrganizationHasChildrenError` if the node has active children.
`updateOrganization` with `parentOrganizationId` runs cycle detection via `assertNoOrganizationCycle()`.

---

## Membership service operations

```ts
import {
  insertMembership,
  updateMembership,
  deactivateMembership,
} from "@afenda/database";

// Tenant-wide role (e.g., Tenant Admin sees all companies)
await insertMembership({
  input: {
    tenantId, userId, roleId,
    scopeType: "tenant",
    companyId: null,
    organizationId: null,
  },
  audit,
});

// Legal Entity (company) role (e.g., Company CFO)
await insertMembership({
  input: {
    tenantId, userId, roleId,
    scopeType: "company",
    companyId,
    organizationId: null,
  },
  audit,
});

// Org Unit / Team role (e.g., Branch Manager, Team Lead)
await insertMembership({
  input: {
    tenantId, userId, roleId,
    scopeType: "organization",
    companyId,
    organizationId: branchOrgId,
  },
  audit,
});
```

---

## RLS Grant — derivation chain

Every data access is guarded by a two-layer check:

```
Request arrives (tenantId in header, companyId + orgId in body/URL)
  │
  ├─ Layer 1: Application-level (requirePermission)
  │    ├─ Resolve actor: actorFromAuthSession(session)
  │    ├─ Resolve memberships: resolveScopedMembership(actor, context)
  │    ├─ Check permission key: PERMISSION_REGISTRY.<domain>.<action>
  │    └─ Check active policies: policyEngine.evaluate(actor, context, permissionKey)
  │         ↓ deny → log audit event → return denial code
  │         ↓ allow → proceed
  │
  └─ Layer 2: Database-level (Supabase RLS)
       ├─ tenant_id = auth.jwt()->>'tenant_id'   [on every governed table]
       ├─ company_id IN (SELECT company_id FROM memberships WHERE user_id = auth.uid())
       └─ status != 'archived' / 'suspended'     [lifecycle guard]
```

**Denial codes from application layer:**

| Code | Meaning |
|------|---------|
| `PERMISSION_DENIED` | User lacks the required permission key for this context |
| `POLICY_DENIED` | Policy engine denied (e.g., approval pending, time-lock) |
| `SCOPE_MISMATCH` | Membership scope does not match the requested context dimensions |
| `ENTITY_SUSPENDED` | Tenant, Company, or Org is suspended or archived |

---

## Future planned RLS scopes (Foundation phase 08 / Foundation phase 30)

| Scope | `scopeType` value | FK column added | Grants access to |
|-------|-------------------|-----------------|-----------------|
| Entity Group | `entity_group` | `entityGroupId` | All Legal Entities in the group |
| Project | `project` | `projectId` | Records scoped to that project |

These require schema migrations (new FK columns on `memberships`) and service function updates.

---

## Consolidation Scope — authority model (Foundation phase 08)

When implemented, consolidation scope resolution will be:

```ts
// Planned: packages/database/src/entity-group/consolidation-scope.service.ts

type ConsolidationScopeInput = {
  entityGroupId: string;
  reportingDate: Date;
};

type ConsolidationScopeEntry = {
  companyId: string;
  consolidationMethod: "full" | "proportional" | "equity" | "cost" | "none";
  ownershipPercentage: number;
  votingPercentage: number;
  controlType: string;
};

// Returns the set of entities in scope at the reporting date
async function resolveConsolidationScope(
  input: ConsolidationScopeInput
): Promise<ConsolidationScopeEntry[]>;
```

This function **only resolves which entities are in scope and how** — it does not perform any
accounting arithmetic. Consolidation eliminations and minority interest calculations are Phase 2+.

---

## Tenant subdomain routing — context header flow

```
Browser: https://acme.afenda.app/invoices
  └─ Vercel Edge → proxy() extracts "acme" → sets x-tenant-slug header
       └─ Next.js Server Component reads headers()["x-tenant-slug"] → "acme"
            └─ DB: SELECT id FROM tenants WHERE slug = 'acme' → tenantId
                 └─ tenantId passed to requirePermission() context
```

```ts
import { getTenantBySlug, isTenantOperational } from "@afenda/database";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
  const slug = (await headers()).get("x-tenant-slug");
  if (!slug) notFound();

  const tenant = await getTenantBySlug(slug);
  if (!tenant || !isTenantOperational(tenant)) notFound();

  return (
    <TenantProvider tenantId={tenant.id} tenantSlug={slug}>
      {children}
    </TenantProvider>
  );
}
```

---

## Multi-company and multi-group per tenant

- A Tenant may contain multiple standalone companies **or** one/more Entity Groups.
- Entity Groups aggregate companies with defined Ownership Interests.
- A `scopeType: "tenant"` membership grants access across ALL companies in the tenant.
- A `scopeType: "company"` membership restricts to one Legal Entity.
- Group-level access (planned): `scopeType: "entity_group"` grants access to all member Legal Entities.

---

## Multi-book support

Each Legal Entity (`companies` row) has its own `baseCurrency` and `countryCode`.
Accounting books (chart of accounts, journal, GL) are scoped to `companyId`.
Cross-entity intercompany transactions require explicit entries in each entity's own book.

---

## Platform-wide seed catalog roles

| Key | Scope | Permissions |
|-----|-------|-------------|
| `platform.system.admin` | `platform` | All `system_admin.*` permissions |
| `tenant.admin` *(dev/test only)* | `tenant` | All platform permissions |

Production tenants define their own roles via `insertRole()`.

---

## Entitlement type reference

| Type | Purpose |
|------|---------|
| `module` | Feature module on/off gate (e.g., `accounting`, `hr`) |
| `feature` | Sub-feature within a module |
| `usage_limit` | Metered cap (invoice count, users, storage) |
| `localization` | Locale / currency packs |
| `deployment` | Deployment-tier capability |
| `support` | SLA level |
| `security` | Security add-ons (SSO, MFA enforcement) |
| `beta` | Beta feature access |

---

## Workspace fixture seed flow

```
bootstrapLocal(db)
  └─ seedDev(db)
       ├─ seedPlatformBaseline()   ← roles, permissions catalog
       └─ seedDevWorkspace()       ← DEV_WORKSPACE_FIXTURE tenant/company/org/user/membership
```

Run locally: `pnpm db:bootstrap`.
Preview: `bootstrapPreview(db)` seeds `PREVIEW_WORKSPACE_FIXTURE` for Vercel preview deployments.
