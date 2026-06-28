# Multi-Tenancy Architecture — `@afenda/database` + `apps/erp`

> Glossary: all capitalized terms (Tenant, Legal Entity, Entity Group, etc.) are defined in
> [`docs/architecture/glossary.md`](../../../../docs/architecture/glossary.md).

---

## Domain hierarchy — 7-tier authority model

```
Platform            (global — no tenant boundary)
  └─ Tenant         SaaS/subscription boundary; hard isolation; slug globally unique
       └─ Entity Group   Corporate group / holding structure (Foundation phase 08 foundation)
            └─ Legal Entity / Company   Statutory body; owns accounting books + tax identity
                 └─ Organization Unit   Operating tree: branch, dept, site, factory, warehouse
                      └─ Team / Project   Execution units (current: org.type=team; Project planned Foundation phase 30)
                           └─ Membership  User-role-scope grant bound to one of these tiers
```

**Relationship between tiers:**

| Tier | Contains | Authority |
|------|----------|-----------|
| Tenant | Entity Groups + standalone Legal Entities | SaaS isolation + subscription |
| Entity Group | Multiple Legal Entities + Ownership Interests | Group reporting + consolidation scope |
| Legal Entity | Org Units + accounting books + tax registrations | Statutory + financial authority |
| Organization Unit | Sub-org units (tree) + Teams | Operational scope |
| Team | Members + tasks + workflow | Execution scope |
| Project | Tasks + budget + approvals | Initiative scope |
| Membership | Role + scope FK → any tier above | Access grant |

---

## Implementation status by concept

| Concept | DB table | Status |
|---------|----------|--------|
| Tenant | `tenants` | Implemented |
| Entity Group | `entity_groups` | Implemented (Foundation phase 08 foundation) |
| Legal Entity / Company | `companies` | Implemented |
| Ownership Interest | `legal_entity_ownership` | Implemented (Foundation phase 08 foundation) |
| Organization Unit | `organizations` | Implemented |
| Team | `organizations` (`type = "team"`) | Partial — dedicated table Foundation phase 30 |
| Project | — | **Planned — Foundation phase 30** |
| Workspace | Runtime context | N/A — derived |
| Surface | Runtime string ID | N/A — metadata config |
| RLS Grant (app-level) | `memberships` + permission engine | Implemented |
| RLS Grant (DB-level) | Supabase RLS policies | In progress |
| Consolidation Scope | Derived from ownership model | **Planned — Foundation phase 08** |

---

## Slug format

All slugs use `assertPlatformSlug()` → `normalizePlatformSlug()`:
- Lowercase kebab-case: `[a-z0-9]+(?:-[a-z0-9]+)*`
- Max 128 characters
- Normalizes: trims, lowercases, `\s/_` → `-`, strips non-alphanumeric
- Uniqueness: Tenant slug global; Company slug unique per Tenant; Org slug unique per Company

```ts
import { assertPlatformSlug, normalizePlatformSlug } from "@afenda/database";

const slug = normalizePlatformSlug("Acme Corp Pty Ltd");  // "acme-corp-pty-ltd"
assertPlatformSlug(slug);  // throws InvalidPlatformSlugError if malformed
```

---

## Lifecycle statuses

All top-level entities share `active | suspended | archived`:

| Status | Tenant effect | Company effect | Org effect |
|--------|--------------|----------------|------------|
| `active` | Normal access | Normal access | Normal |
| `suspended` | Auth blocked | Blocked + RLS closed | Blocked |
| `archived` | Auth blocked | Blocked + soft-deleted | Soft-deleted equivalent |

`isTenantOperational(tenant)` returns `true` only for `active` Tenants.

**Golden rules:**

| Entity | Rule |
|--------|------|
| Tenant | Never hard-delete. Archive only. |
| Legal Entity (Company) | Never hard-delete. Archive only. |
| Entity Group | Never hard-delete. Archive only. |
| Organization Unit | Never hard-delete. Soft-delete only via `deleteOrganization()`. |
| Membership | Never hard-delete. Deactivate only. |
| Role | Key + tenantId + scope are immutable after create. |

---

## Legal Entity / Company — the financial authority boundary

`companies` is the statutory entity. It owns:

```ts
// Key fields in companies table
{
  id: CompanyId,
  tenantId: TenantId,
  entityGroupId: EntityGroupId | null,    // planned Foundation phase 08
  slug: string,                            // unique per tenant
  legalName: string,
  displayName: string,
  countryCode: string,
  baseCurrency: string,
  taxId: string | null,
  registrationNumber: string | null,
  status: "active" | "suspended" | "archived",
  // future: fiscalCalendarId, reportingCurrencyId
}
```

**Company structures the model must support:**

| Structure | Implementation |
|-----------|---------------|
| Holding company | A Legal Entity with `entityGroup.parentEntityId` pointing to it |
| Parent company | A Legal Entity with subsidiary Ownership Interests |
| Subsidiary | Legal Entity with `ownershipInterest.controlType = "full_control"` |
| Associate | Legal Entity with `controlType = "significant_influence"` (20–50%) |
| Joint venture | Legal Entity with `controlType = "joint_control"` |
| Minority-interest | Legal Entity with `ownershipPercentage < 20%` |
| Branch | `organizations.type = "branch"` inside a Legal Entity |

---

## Entity Group (Foundation phase 08 foundation)

Entity Group sits between Tenant and Company:

```ts
// Planned schema shape
entity_groups: {
  id: EntityGroupId,
  tenantId: TenantId,
  slug: string,                    // unique per tenant
  displayName: string,
  parentEntityId: CompanyId | null, // the holding company, if one exists
  status: "active" | "suspended" | "archived",
  createdAt: Date,
}
```

Access patterns that will change when Entity Groups are implemented:
- Group-level roles will span all subsidiary Legal Entities
- Consolidation scope resolution will start from `entity_groups.parentEntityId`
- `insertCompany()` will accept optional `entityGroupId`

---

## Ownership Interest (Foundation phase 08 foundation)

```ts
// Planned schema shape
legal_entity_ownership: {
  id: OwnershipInterestId,
  entityGroupId: EntityGroupId,
  parentEntityId: CompanyId,
  childEntityId: CompanyId,
  ownershipPercentage: number,       // 0–100
  votingPercentage: number,          // 0–100; may differ from economic %
  controlType: "full_control" | "joint_control" | "significant_influence" | "passive",
  relationshipType: "subsidiary" | "associate" | "joint_venture" | "minority_interest" | "non_controlling_interest",
  consolidationMethod: "full" | "proportional" | "equity" | "cost" | "none",
  effectiveFrom: Date,
  effectiveTo: Date | null,          // null = current
}
```

---

## Organization Unit types

`OrganizationType` — `organizations.type`:

| Value | Meaning |
|-------|---------|
| `company_root` | Root node for a Legal Entity (one per company) |
| `branch` | Regional / geographic business unit |
| `department` | Functional unit (default on create) |
| `team` | Execution-level team (maps to "Team" in the glossary) |

**Physical sites** (farm, factory, warehouse, outlet) use `type = "branch"` until a dedicated
`site_type` discriminator is added in a future TIP. Add `metadata` or a `siteType` column when
the business context requires differentiation.

`parentOrganizationId` is nullable. Cycle prevention via `assertNoOrganizationCycle()` before insert/update.

---

## Membership scopes

```ts
type MembershipScopeType = "tenant" | "company" | "organization";
```

| `scopeType` | `companyId` | `organizationId` | Intended level |
|-------------|-------------|------------------|----------------|
| `tenant` | `null` | `null` | Tenant-wide (e.g., platform admin) |
| `company` | required | `null` | Legal Entity scope (e.g., company CFO) |
| `organization` | required | required | Org Unit / Team scope |

Future planned membership scopes (Foundation phase 08 / Foundation phase 30):

| `scopeType` | FK added | Grants access to |
|-------------|----------|-----------------|
| `entity_group` | `entityGroupId` | All Legal Entities in the group |
| `project` | `projectId` | Project-scoped records only |

`assertMembershipScopeShape()` enforces FK nullability — mismatched shape throws `MembershipScopeValidationError`.

**Scope resolution:** `resolveScopedMembership()` walks tenant → company → organization, returning the narrowest matching active membership.

---

## RLS Grant — how access is derived

**Must fail closed.** If any required dimension is missing or suspended, deny — never assume.

### Application-level (active today)

```ts
// Server Action pattern — all dimensions must be resolved
import { requirePermission, PERMISSION_REGISTRY,
  createProductionAuthorizationDataSources } from "@afenda/permissions";
import { actorFromAuthSession } from "@afenda/permissions";
import { resolveActionSession } from "@/lib/server-actions/resolve-action-session";
import { failServerAction } from "@/lib/server-actions/fail-server-action";

export async function postJournalAction(input: {
  tenantId: string;
  companyId: string;
  organizationId?: string;
  journalId: string;
}) {
  const session = await resolveActionSession();
  if (!session.ok) return failServerAction(session.error);

  const { permission } = createProductionAuthorizationDataSources();
  await requirePermission({
    actor: actorFromAuthSession(session.session),
    context: {
      tenantId: input.tenantId,
      companyId: input.companyId,
      organizationId: input.organizationId ?? null,
    },
    permissionKey: PERMISSION_REGISTRY.accounting.journal.post,
  }, permission);

  // mutate — only reached if permission granted
}
```

The `tenantId` always comes from the client workspace (URL param, cookie, or context provider) — **never** from the session.

### Database-level (Supabase RLS — in progress)

Postgres RLS policies must be applied to all tables with a `tenant_id` column:

```sql
-- Tenant isolation
CREATE POLICY tenant_isolation ON companies
  USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Legal Entity isolation — user must have active membership for the company
CREATE POLICY company_membership ON companies
  USING (
    id IN (
      SELECT company_id FROM memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
    OR scope_type = 'tenant'  -- tenant-wide role sees all companies
  );
```

**RLS Grant dimensions (all must be satisfied):**

| Dimension | Source |
|-----------|--------|
| Tenant | `x-tenant-slug` header → `tenantId` |
| Entity Group | group-level role membership (planned) |
| Legal Entity | active `company`-scoped membership |
| Organization Unit | active `organization`-scoped membership |
| Team | team membership record (planned) |
| Project | project role assignment (planned) |
| Role | `roles` + `role_permissions` |
| Permission key | `requirePermission()` check |

---

## Consolidation Scope — authority stub (Foundation phase 08)

**Do not implement any consolidation arithmetic.** Only prepare the authority model.

The consolidation scope for a reporting run is derived as:

```
Entity Group
  → Legal Entities (via ownership interests effective at reporting date)
    → filter by controlType + ownershipPercentage
      → assign consolidationMethod per entity
        → Consolidation Scope record
```

When Foundation phase 08 is implemented, `consolidation_scopes` will be a view or materialized table
computed from `entity_groups` + `legal_entity_ownership` at a specific `reportingDate`.

---

## Write governance — use service functions

Never write directly to governed tables. Use the service layer from `@afenda/database`:

| Entity | Create | Update | Deactivate/Archive |
|--------|--------|--------|--------------------|
| Tenant | `insertTenant(input)` | `updateTenant(tenantId, input)` | `archiveTenant(tenantId, input)` |
| Company | `insertCompany(input)` | `updateCompany(companyId, input)` | via `updateCompany` (status patch) |
| Organization | `insertOrganization(input)` | `updateOrganization(orgId, input)` | `deleteOrganization(orgId, input)` |
| Membership | `insertMembership(input)` | `updateMembership(id, input)` | `deactivateMembership(id, input)` |

Every service call takes an `audit` context: `{ actorType, actorUserId, correlationId, source }`.

Entity Group and Ownership Interest services will follow the same pattern when Foundation phase 08 is delivered.

---

## Tenant subdomain URL routing

Extract the tenant slug from the hostname and inject as `x-tenant-slug` header in `src/proxy.ts`:

```ts
export function resolveTenantSlugFromHostname(
  hostname: string,
  baseDomain = process.env["NEXT_PUBLIC_BASE_DOMAIN"] ?? "afenda.app"
): string | null {
  const host = hostname.split(":")[0] ?? "";
  if (!host.endsWith(`.${baseDomain}`)) return null;
  const sub = host.slice(0, host.length - baseDomain.length - 1);
  if (!sub || ["www", "app", "api"].includes(sub)) return null;
  return sub;
}
```

Read in Server Components:

```ts
import { headers } from "next/headers";
const tenantSlug = (await headers()).get("x-tenant-slug");
```

**Vercel:** Wildcard CNAME `*.afenda.app → cname.vercel-dns.com` + wildcard domain in project settings.

---

## Workspace and Surface — runtime context

**Workspace** is not a database table. It is the resolved runtime context assembled per request:

```ts
type WorkspaceContext = {
  tenantId: string;
  companyId: string;           // selected Legal Entity
  organizationId?: string;     // selected Org Unit (optional)
  projectId?: string;          // selected Project (optional, Foundation phase 30)
  userId: string;
  // derived — never trust from session
};
```

**Surface** is a dot-separated module path string for metadata and feature flag resolution:

```ts
// Examples
"accounting.journal.list"
"inventory.warehouse.detail"
"hrm.payroll.run"
```

Neither Workspace nor Surface owns any security authority — they are input into `requirePermission()`.

---

## Entitlements and commercial plans

Tenant-level feature gating:

```ts
import { provisionTenantEntitlements } from "@afenda/database";

await provisionTenantEntitlements({
  tenantId,
  planTemplateId: "pro",  // "basic" | "pro" | "enterprise" | "beta"
  correlationId,
  audit: { actorType: "system", correlationId, source: "system" },
});
```

Plans materialize into `entitlement_grants` and `usage_limit_counters`.
Scopes: `global | tenant | company | environment`.

---

## Feature flags and rollouts

`FeatureFlagRollout`: `off | internal | beta | limited | on`
`KillSwitchSeverity`: `standard | urgent | critical`

Load via `entitlement-load.service.ts` / `rollout-load.service.ts`. Never hardcode feature availability.

---

## Workspace fixtures (dev/preview/demo)

| Fixture | Tenant slug | Company slug | Org slug |
|---------|-------------|--------------|----------|
| `DEV_WORKSPACE_FIXTURE` | `dev-local` | `dev-company` | `dev-hq` |
| `PREVIEW_WORKSPACE_FIXTURE` | `preview` | `preview-company` | `preview-hq` |
| `DEMO_WORKSPACE_FIXTURE` | `demo` | `demo-company` | `demo-hq` |

Seeded via `bootstrapLocal()` / `bootstrapPreview()`. Demo blocked in production by `assertBootstrapAllowed()`.

---

## Forbidden patterns

```ts
// ❌ Direct table insert — bypasses audit and constraint validation
await db.insert(tenants).values({ slug, name, status: "active" });

// ❌ Reading tenantId from the auth session — session has no tenant fields
const tenantId = session.user.tenantId;

// ❌ Hardcoded tenant slug in application code
if (context.tenantId === "dev-local") { /* skip validation */ }

// ❌ Hard-delete of governed entities
await db.delete(tenants).where(eq(tenants.id, id));

// ❌ Organization cycle — parent set to self or ancestor
await updateOrganization(id, { parentOrganizationId: id }, audit);

// ❌ Treating Organization Unit as a Legal Entity
// Organization Units do not own accounting books or tax registrations

// ❌ Implementing consolidation arithmetic before consolidation scope is approved for production use
// Authority model tables exist; arithmetic remains out of scope

// ❌ Trusting WorkspaceContext from client payload without re-resolving membership
// Always re-resolve tenantId/companyId from request headers + active membership server-side
```

---

## Additional resources

- **Glossary:** [`docs/architecture/glossary.md`](../../../../docs/architecture/glossary.md)
- **Schema reference:** [reference.md](reference.md)
- **Master plan (ERP roadmap):** [`docs/architecture/_afenda-erp-master-plan.llms.md`](../../../../docs/architecture/_afenda-erp-master-plan.llms.md)
- Tenant service: `packages/database/src/tenant/tenant.service.ts`
- Organization contract: `packages/database/src/organization/organization.contract.ts`
- Membership contract: `packages/database/src/membership/membership.contract.ts`
- Slugs: `packages/database/src/platform-slug.ts`
- Types & enums: `packages/database/src/database.types.ts`
- IDs: `packages/database/src/ids.ts`
