/tip-007 /tip-012 /multi-company /entity-group /holding-company /subsidiary /minority-interest /rls /consolidation /tenant-subdomain /operating-context /enterprise-hardening

> **Historical planning doc (pre-ADR-0027):** References `@afenda/appshell`, `@afenda/metadata-ui`, and PAS-005-era UI lanes. **Do not execute** from this file — use composed [PAS-001A](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md), [PAS-006](../PRESENTATION/README.md), and [DEVELOPMENT-LANE-BOUNDARIES.md](../DEVELOPMENT-LANE-BOUNDARIES.md) for current lanes.

Implement the Afenda ERP Enterprise Group Operating Context foundation for multi-tenancy, multi-level companies, holding companies, subsidiaries, associates, minority-interest entities, organization units, teams, projects, RLS grants, and future accounting consolidation.

Target quality:

* Enterprise implementation quality: 9.5 / 10
* Enterprise architecture quality: 9.5 / 10
* Enterprise security quality: 9.5 / 10
* Accounting-readiness quality: 9.5 / 10
* Output quality must include glossary, enterprise feature requirements, package/file locations, dependency decisions, do's, prohibitions, acceptance criteria, verification evidence, rollout, rollback, and remaining risks.

Repository context:

* Monorepo: pnpm + Turborepo
* App: `apps/erp`
* Framework: Next.js App Router
* API style: REST/OpenAPI first
* Auth: `@afenda/auth`
* Authorization: `@afenda/permissions`
* Kernel / execution context: `@afenda/kernel`
* Database: `@afenda/database`
* Observability: `@afenda/observability`
* Architecture enforcement: `@afenda/architecture-authority`
* UI shell: `@afenda/appshell`
* Metadata UI: `@afenda/metadata-ui`
* Governance source order: ADR > architecture registries > PAS slice docs > master plan
* Phase: Foundation phase 07 ERP Platform Authority and Foundation phase 12 ERP Operating Spine
* Do not start Foundation phase 13 accounting implementation.
* Do not implement journals, ledger posting, consolidation eliminations, or accounting business logic yet.

Primary objective:
Create a governed full-stack operating context foundation that explicitly supports enterprise group structures: tenant, entity group, legal entity/company, ownership interest, subsidiary, associate/minority-interest company, organization unit, team, project, workspace, tenant subdomain URL routing, RLS grant scoping, permission checks, audit context, and future accounting consolidation.

Core principle:
Afenda ERP must serve multi-level corporate groups, not only single-company SaaS tenants.

The model must support:

* Holding companies
* Parent companies
* Subsidiaries
* Associates
* Joint ventures
* Minority-interest companies
* Branches
* Departments
* Farms / factories / warehouses / outlets
* Teams
* Projects
* Multi-book / future accounting consolidation scope
* RLS and permission grants by tenant, entity group, legal entity, organization unit, team, project, and role

Mandatory glossary:
Create or update a glossary document, preferably:

* `docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md`
  or if the repo already has a glossary, update the existing one.

The glossary must define these terms clearly:

1. Tenant

   * SaaS/customer boundary.
   * Root security and subscription boundary.
   * May contain one or many entity groups.
   * Must not be confused with legal entity/company.

2. Entity Group

   * Corporate group structure under a tenant.
   * May represent a holding group.
   * Owns group-level reporting and future consolidation scope.
   * Contains multiple legal entities/companies.

3. Legal Entity / Company

   * Registered statutory company.
   * Owns accounting books, tax identity, fiscal calendar, reporting currency, and statutory obligations.
   * Can be parent, subsidiary, associate, joint venture, or minority-interest entity.
   * Must not be treated as a generic organization unit.

4. Ownership Interest

   * Relationship between legal entities.
   * Captures parent entity, child/investee entity, ownership percentage, voting percentage, control type, effective dates, and consolidation treatment.
   * Supports subsidiary, associate, joint venture, minority interest, and non-controlling interest.
   * Required for future consolidation and RLS/grant logic.

5. Organization Unit

   * Operational structure inside a legal entity or group.
   * Examples: branch, department, site, farm, factory, warehouse, retail outlet, cost center.
   * Used for operations, reporting, access scope, and workflow routing.
   * Does not replace legal entity/company.

6. Team

   * People group used for task/workflow execution.
   * Belongs to a tenant and may be scoped to legal entity, organization unit, project, or workspace.

7. Project

   * Scoped initiative/job/project.
   * May belong to legal entity, organization unit, team, or cross-entity program.
   * Used for future project accounting, budgets, tasks, and approvals.

8. Workspace

   * User-facing ERP operating area.
   * Derived from allowed context.
   * Does not own legal/security authority.

9. Surface

   * Current page/module/screen.
   * Used for metadata/UI runtime context.

10. RLS Grant

* Database-level or application-level access scope.
* Must be derived from tenant, legal entity, organization unit, team, project, role, and permission.
* Must fail closed.

11. Consolidation Scope

* Future accounting/reporting boundary.
* Derived from entity group, legal entities, ownership interests, control type, ownership percentage, effective dates, and consolidation method.
* Do not implement accounting consolidation logic in this slice; only prepare the authority model.

Enterprise feature requirements:

1. Enterprise group hierarchy
   Implement or formalize this hierarchy:

   tenant
   → entity group
   → legal entity / company
   → ownership interest
   → organization unit
   → team
   → project
   → workspace
   → surface
   → workflow

   Rules:

   * Tenant is the SaaS/security boundary.
   * Entity group represents corporate group/holding structure.
   * Legal entity/company represents statutory accounting entity.
   * Organization unit represents operational subdivision.
   * Team/project are execution scopes.
   * Workspace/surface are UI/runtime scopes.
   * Do not collapse these into one generic `organization`.

2. Legal entity / company authority
   Legal entity/company must support:

   * tenantId
   * entityGroupId
   * legalName
   * displayName
   * registrationNumber
   * taxRegistrationNumber if applicable
   * countryCode
   * baseCurrency
   * fiscalCalendarId or placeholder reference
   * status: active/inactive/archived
   * companyType:

     * holding
     * parent
     * subsidiary
     * associate
     * joint_venture
     * minority_interest
     * branch_entity if legally applicable
     * standalone
   * effective dates where applicable

3. Ownership interest authority
   Ownership interest must support:

   * tenantId
   * entityGroupId
   * parentLegalEntityId
   * investeeLegalEntityId
   * ownershipPercentage
   * votingPercentage
   * controlType:

     * control
     * significant_influence
     * joint_control
     * passive_investment
   * consolidationTreatment:

     * full_consolidation
     * equity_method
     * proportionate_consolidation
     * fair_value_or_cost
     * excluded
   * nonControllingInterestApplicable
   * effectiveFrom
   * effectiveTo
   * status

   Do not implement accounting consolidation entries yet.
   Only prepare the governed structure.

4. Organization unit authority
   Organization unit must support:

   * tenantId
   * legalEntityId
   * parentOrganizationUnitId optional
   * organizationUnitType:

     * branch
     * department
     * site
     * farm
     * factory
     * warehouse
     * retail_outlet
     * cost_center
     * shared_service
     * operating_unit
   * status
   * effective dates if needed

5. RLS and grant scoping
   Design access scope model for:

   * tenant-level grant
   * entity group-level grant
   * legal entity/company-level grant
   * organization unit-level grant
   * team-level grant
   * project-level grant
   * platform-admin grant
   * cross-company grant
   * consolidation-view grant

   Requirements:

   * Access must fail closed.
   * Legal entity grants must not automatically allow sibling entities.
   * Tenant admin must not automatically mean all company access unless explicitly granted.
   * Group/consolidation access must be explicit.
   * Cross-company access must be explicit.
   * Minority-interest company access must be explicit.
   * Future RLS policy must be able to filter by tenantId and legalEntityId at minimum.
   * Application permission checks must receive resolved scope.

6. Tenant subdomain URL routing
   Support:

   * `{tenantSlug}.afenda.app`
   * `{tenantSlug}.localhost`
   * documented fallback route if needed:

     * `/t/{tenantSlug}`
     * `/o/{organizationSlug}` only for organization workspace, not tenant authority

   Rules:

   * Tenant slug resolves tenant only.
   * Tenant subdomain must not imply legal entity selection.
   * After tenant resolution, selected/default entity group and legal entity must be resolved server-side.
   * Unknown tenant fails safely.
   * Reserved subdomains rejected.

7. Operating context resolver
   Implement server-side context resolver that resolves:

   * tenant
   * actor
   * entity group
   * legal entity/company
   * organization unit
   * team
   * project
   * workspace
   * permission scope
   * correlation ID

   Resolver must:

   * verify tenant is active
   * verify actor membership
   * verify legal entity belongs to tenant/entity group
   * verify organization unit belongs to legal entity
   * verify team/project scope
   * verify selected context is allowed
   * fail closed
   * return typed result
   * log safely

8. API and Server Action integration
   Protected API routes and Server Actions must use resolved operating context.
   They must not trust:

   * tenantId from body
   * entityGroupId from body
   * legalEntityId/companyId from body
   * organizationUnitId from body
   * teamId from body
   * projectId from body

   Client-provided IDs may only be treated as requested selection and must be verified server-side.

9. AppShell context integration
   AppShell must display:

   * tenant
   * entity group
   * legal entity/company
   * organization unit
   * workspace

   AppShell must not own context authority.
   It consumes server-resolved allowed context options.
   Context switching must call a server action/API that verifies membership and grant scope.

10. Accounting-readiness
    This slice must prepare for future accounting consolidation, but not implement accounting.
    Required future-proof fields:

* entity group
* legal entity
* ownership interest
* consolidation treatment
* reporting currency / base currency
* effective dates
* legal entity status
* organization unit / cost-center relationship if already governed

Prohibited:

* no journal posting
* no ledger
* no consolidation eliminations
* no accounting reports
* no Foundation phase 13 work

Package and file locations:

Glossary:

* `docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md`

Kernel package:

* `packages/kernel/src/**`
* Suggested:

  * `packages/kernel/src/context/tenant-context.contract.ts`
  * `packages/kernel/src/context/entity-group-context.contract.ts`
  * `packages/kernel/src/context/legal-entity-context.contract.ts`
  * `packages/kernel/src/context/ownership-interest-context.contract.ts`
  * `packages/kernel/src/context/organization-unit-context.contract.ts`
  * `packages/kernel/src/context/team-context.contract.ts`
  * `packages/kernel/src/context/project-context.contract.ts`
  * `packages/kernel/src/context/operating-context.contract.ts`
  * `packages/kernel/src/context/permission-scope-context.contract.ts`
  * `packages/kernel/src/context/consolidation-scope-context.contract.ts`
  * `packages/kernel/src/context/index.ts`

Database package:

* `packages/database/src/**`
* Suggested only if missing:

  * `packages/database/src/tenant/**`
  * `packages/database/src/entity-group/**`
  * `packages/database/src/legal-entity/**`
  * `packages/database/src/ownership-interest/**`
  * `packages/database/src/organization-unit/**`
  * `packages/database/src/team/**`
  * `packages/database/src/project/**`
  * `packages/database/src/grant-scope/**`
  * `packages/database/src/tenant-domain/**`

ERP app:

* `apps/erp/src/proxy.ts`
* `apps/erp/src/middleware.ts`
* `apps/erp/src/lib/context/**`
* Suggested:

  * `apps/erp/src/lib/context/tenant-domain.server.ts`
  * `apps/erp/src/lib/context/resolve-operating-context.server.ts`
  * `apps/erp/src/lib/context/resolve-legal-entity-context.server.ts`
  * `apps/erp/src/lib/context/resolve-grant-scope.server.ts`
  * `apps/erp/src/lib/context/context-errors.ts`
  * `apps/erp/src/lib/context/context-switch.action.ts`
* `apps/erp/src/lib/api/**`
* `apps/erp/src/app/api/**/route.ts`
* `apps/erp/src/app/**`

Permissions:

* `packages/permissions/src/**`
* Suggested only if existing architecture supports:

  * `packages/permissions/src/scope/**`
  * `packages/permissions/src/grants/**`

AppShell:

* `packages/appshell/src/**`
* AppShell consumes context only.
* AppShell must not resolve tenant/database authority.

Observability:

* `packages/observability/src/**`

Architecture authority:

* `packages/architecture-authority/src/data/package-registry.data.ts`
* `packages/architecture-authority/src/data/dependency-registry.data.ts`
* `packages/architecture-authority/src/data/layer-registry.data.ts`
* `packages/architecture-authority/**`

Delivery evidence:

* `docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md`
* `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md`

Dependency rules:

* `@afenda/kernel` owns serializable context contracts.
* `@afenda/database` owns persistence and query adapters.
* `apps/erp` owns Next.js request/context integration.
* `@afenda/permissions` owns permission and grant decisions.
* `@afenda/observability` owns logging/audit evidence.
* `@afenda/appshell` owns display and context-switch UI only.
* `@afenda/appshell` must not depend on `@afenda/database`.
* `@afenda/kernel` must not depend on Next.js or React.
* `apps/erp` must not duplicate permission engine.
* No deep imports.
* No unapproved dependencies.
* If `apps/erp → @afenda/kernel` or other edges fail architecture checks, fix registry specifically or stop and report.

Do's:

* Do create/update glossary first.
* Do separate Tenant, Entity Group, Legal Entity, Organization Unit, Team, Project.
* Do model ownership interest explicitly.
* Do prepare consolidation scope without implementing accounting.
* Do keep tenant subdomain as tenant resolver only.
* Do verify selected legal entity server-side.
* Do verify organization unit belongs to legal entity.
* Do verify grant scope.
* Do fail closed.
* Do preserve CSP nonce pipeline.
* Do preserve RBAC.
* Do preserve correlation ID.
* Do add tests.
* Do produce delivery evidence.
* Do run full quality gates.

Prohibitions:

* Do not call legal entity “organization.”
* Do not use organization as replacement for company.
* Do not treat tenant as company.
* Do not treat tenant admin as automatic all-company access unless explicitly governed.
* Do not allow sibling company access without explicit grant.
* Do not trust client-provided company/legalEntity/entityGroup/org IDs.
* Do not implement accounting journals, ledgers, reports, or consolidation entries.
* Do not start Foundation phase 13.
* Do not add business modules.
* Do not weaken RLS/RBAC/CSP.
* Do not use `any`.
* Do not deep import.
* Do not silence architecture checks.
* Do not leave TODOs as completion.

Implementation sequence:

Step 1 — Glossary first

* Create/update `docs/PAS/ENTERPRISE-KNOWLEDGE/glossary.md`.
* Explicitly define:

  * Tenant
  * Entity Group
  * Legal Entity / Company
  * Ownership Interest
  * Organization Unit
  * Team
  * Project
  * Workspace
  * Surface
  * RLS Grant
  * Consolidation Scope
* Add “do not confuse” notes.


Step 2 — Existing-state audit

* Audit existing schemas for tenant/company/org/team/project.
* Audit existing kernel context.
* Audit existing permission/grant model.
* Audit existing AppShell context model.
* Audit existing tenant subdomain/proxy/middleware.
* Audit API/server actions using company/org IDs.
* Output table before modifying.


Step 3 — Authority design

* Confirm package ownership.
* Confirm dependency edges.
* Confirm which contracts belong in kernel.
* Confirm which persistence belongs in database.
* Confirm what apps/erp owns.

Step 4 — Context contracts

* Add or update serializable kernel contracts:

  * TenantContext
  * EntityGroupContext
  * LegalEntityContext
  * OwnershipInterestContext
  * OrganizationUnitContext
  * TeamContext
  * ProjectContext
  * PermissionScopeContext
  * ConsolidationScopeContext
  * OperatingContext
* Ensure public export maps are updated.

Step 5 — Persistence and lookup

* Use existing tables if they exist.
* Add only missing foundation tables if appropriate.
* Add tenant domain lookup.
* Add legal entity and ownership interest support if missing.
* Add indexes and unique constraints:

  * tenant slug/domain
  * entity group under tenant
  * legal entity under tenant/entity group
  * ownership parent/investee/effective date
  * organization unit under legal entity
* Do not create accounting tables.

Step 6 — Tenant URL resolver

* Parse host safely.
* Reject reserved subdomains.
* Resolve tenant slug.
* Do not select company from subdomain.
* Preserve CSP/correlation/auth middleware behavior.

Step 7 — Operating context resolver

* Resolve tenant.
* Resolve actor.
* Resolve entity group.
* Resolve legal entity/company.
* Resolve organization unit/team/project if selected.
* Verify membership and grant.
* Return typed result.
* Fail closed.

Step 8 — API/action/AppShell integration

* Wire protected API routes.
* Wire protected server actions.
* Feed resolved context into permission checks.
* Pass allowed contexts to AppShell.
* Validate context switch server-side.

Step 9 — Tests
Add tests for:

* glossary/contract snapshots if repo supports
* tenant slug parsing
* reserved subdomain rejection
* unknown tenant rejection
* entity group resolution
* legal entity resolution
* ownership interest validation
* legal entity sibling access denied
* minority-interest access requires explicit grant
* organization unit must belong to selected legal entity
* tenant admin does not automatically grant all-company access unless explicitly governed
* consolidation-view grant is explicit
* client-provided legalEntityId spoofing rejected
* API route uses resolved operating context
* server action uses resolved operating context
* AppShell context switch validates server-side
* CSP/RBAC/correlation regression

Step 10 — Documentation and verification

* Create delivery doc under `docs/PAS/KERNEL/SLICE/` (e.g. tenant-lifecycle / operating-context attestation handoffs)
* Run:

  * `pnpm typecheck`
  * `pnpm test:run`
  * `pnpm build`
  * `pnpm quality`

Enterprise acceptance criteria:

Glossary acceptance:

* Tenant, entity group, legal entity/company, ownership interest, organization unit, team, project are explicitly defined.
* Company/legal entity is not confused with organization.
* Tenant is not confused with company.
* Organization unit is not treated as statutory entity.
* Consolidation scope is documented but not implemented as accounting logic.

Functional acceptance:

* Tenant resolves from subdomain.
* Tenant subdomain does not imply company selection.
* Entity group can contain multiple legal entities.
* Legal entity belongs to tenant/entity group.
* Ownership interest can represent subsidiary, associate, joint venture, minority interest.
* Organization unit belongs to legal entity.
* Actor context resolves to allowed legal entity/org scope.
* AppShell displays resolved tenant/entity group/legal entity/org context.
* Context switch is validated server-side.

Security/RLS acceptance:

* Tenant boundary fails closed.
* Legal entity boundary fails closed.
* Sibling company access denied without explicit grant.
* Minority-interest entity access requires explicit grant.
* Cross-company access requires explicit grant.
* Consolidation-view access requires explicit grant.
* Client-provided context IDs are treated as untrusted.
* Permission checks use resolved scope.
* Logs do not leak secrets.
* Correlation ID is preserved.

Accounting-readiness acceptance:

* Entity group exists as future consolidation root.
* Legal entity/company has accounting-ready identity fields.
* Ownership interest supports percentage, control type, consolidation treatment, and effective dates.
* Consolidation scope is prepared as context/contract only.
* No accounting journal/ledger/consolidation business logic is implemented.

Architecture acceptance:

* Kernel owns contracts.
* Database owns persistence.
* ERP app owns Next.js integration.
* Permissions owns grants/checks.
* AppShell consumes context.
* No deep imports.
* No unapproved dependency.
* No business domain created.
* No Foundation phase 13 started.

Testing acceptance:

* Tenant/domain tests pass.
* Entity group/legal entity tests pass.
* Ownership interest tests pass.
* Grant scope tests pass.
* Spoofing tests pass.
* AppShell context switch tests pass where applicable.
* CSP/RBAC/correlation regression tests pass.
* Existing tests still pass.

Verification acceptance:

* `pnpm typecheck` passes.
* `pnpm test:run` passes.
* `pnpm build` passes.
* `pnpm quality` passes.
* If a failure is unrelated/pre-existing, document exact blocker and prove this slice’s checks pass.

Expected final output format:

1. Executive summary
2. Glossary added/updated
3. Existing-state audit
4. Enterprise feature requirements delivered
5. Enterprise group hierarchy
6. Tenant subdomain strategy
7. Legal entity and ownership model
8. RLS/grant scope model
9. Accounting-consolidation readiness
10. Package and file changes
11. Dependency decisions
12. Security behavior
13. API/action/AppShell integration
14. Tests added or updated
15. Verification results
16. Rollout plan
17. Rollback plan
18. Remaining gaps
19. Enterprise acceptance criteria checklist
20. Final score:

    * Glossary clarity: x / 10
    * Multi-company model quality: x / 10
    * RLS/grant readiness: x / 10
    * Accounting-consolidation readiness: x / 10
    * Security quality: x / 10
    * Architecture quality: x / 10
    * Test quality: x / 10
    * Documentation quality: x / 10
    * Overall enterprise score: x / 10
