# TIP-030 — Project Membership Scope + Execution Tables

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Authority status** | **Accepted** — ADR-0001 Phase 2 multi-tenancy; master plan v5 §13 Project Management domain (foundation slice only) |
| **Runtime evidence** | `packages/database/src/schema/project.schema.ts`, `packages/database/src/schema/team.schema.ts`, `packages/permissions/src/scope/grant-scope-resolution.ts`, migration `20260624120000_project_team_foundation.sql` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Phase 2 — Multi-tenancy execution scope (closes TIP-007/012 DoD #14) |
| **Remaining gap** | PM task/budget domain logic; org `type=team` migration |

## Purpose

Deliver dedicated `projects` and `teams` authority tables and activate `project` membership scope in the permissions RLS pipeline — without PM task, budget, or accounting logic.

ADR-0001 authority: execution-tier membership grants bound to projects; Database Authority owns persistence; Permission Authority owns scope matching.

Closes [`tip-007-012`]([Partially%20Implemented]%20tip-007-012-enterprise-group-operating-context.md) DoD #14 (`project` membership scope active in RLS).

## Scope

**In scope**

| Requirement | Deliverable |
| --- | --- |
| `projects` table | `packages/database/src/schema/project.schema.ts` + service |
| `teams` table | `packages/database/src/schema/team.schema.ts` + service |
| `project` membership scope | enum + `memberships.project_id` + RLS matching |
| `team` membership scope | enum + `memberships.team_id` + RLS matching (Slice 2) |
| Permissions alignment | `@afenda/permissions` `MembershipContract.projectId` + `teamId` |
| ERP grant-scope wiring | `resolve-grant-scope.server.ts` passes `projectId` + `teamId` |

**Out of scope**

- PM tasks, budgets, approvals, Gantt (master plan TIP-030 domain)
- Accounting Core, journal/ledger/posting (ADR-0010)

## Deliverables

| File | Package | Layer | New / Modified |
| --- | --- | --- | --- |
| `packages/database/src/schema/project.schema.ts` | `@afenda/database` | Database | New |
| `packages/database/src/schema/team.schema.ts` | `@afenda/database` | Database | New |
| `packages/database/src/project/project.contract.ts` | `@afenda/database` | Database | Modified |
| `packages/database/src/project/project.service.ts` | `@afenda/database` | Database | New |
| `packages/database/src/team/team.contract.ts` | `@afenda/database` | Database | New |
| `packages/database/src/team/team.service.ts` | `@afenda/database` | Database | New |
| `packages/database/src/membership/membership.contract.ts` | `@afenda/database` | Database | Modified |
| `packages/database/src/membership/membership.service.ts` | `@afenda/database` | Database | Modified |
| `packages/database/src/schema/membership.schema.ts` | `@afenda/database` | Database | Modified |
| `packages/database/src/rls/rls-grant.contract.ts` | `@afenda/database` | Database | Modified |
| `packages/database/src/migrations/*project_team_foundation*` | `@afenda/database` | Database | New |
| `packages/permissions/src/scope/membership.contract.ts` | `@afenda/permissions` | Permission | Modified |
| `packages/permissions/src/scope/grant-scope-resolution.ts` | `@afenda/permissions` | Permission | Modified |
| `packages/permissions/src/scope/membership-resolution.ts` | `@afenda/permissions` | Permission | Modified |
| `packages/permissions/src/database/contract-mappers.ts` | `@afenda/permissions` | Permission | Modified |
| `packages/permissions/src/permissions-scope-grants-registry.ts` | `@afenda/permissions` | Permission | Modified |
| `packages/permissions/src/__tests__/project-membership-scope.test.ts` | `@afenda/permissions` | Permission | New |
| `apps/erp/src/lib/context/resolve-grant-scope.server.ts` | `@afenda/erp` | Application | Modified |

## Acceptance gate

- `pnpm quality:migrations`
- `pnpm --filter @afenda/database typecheck`
- `pnpm --filter @afenda/permissions typecheck`
- `pnpm --filter @afenda/database test:run`
- `pnpm --filter @afenda/permissions test:run`
- `pnpm check:permissions-scope-grants-surface`
- `pnpm check:multi-tenancy-operating-context-resolver`
- `pnpm check:documentation-drift`

## Definition of Done

| # | Criterion | Verification | Status |
| --- | --- | --- | --- |
| 1 | `projects` table + governed writes | `pnpm --filter @afenda/database test:run` | [x] |
| 2 | `teams` table + governed writes | `pnpm --filter @afenda/database test:run` | [x] |
| 3 | `project` membership scope in RLS | `pnpm check:permissions-scope-grants-surface` | [x] |
| 4 | TIP-007/012 DoD #14 closed | `pnpm check:documentation-drift` | [x] |
| 5 | `team` membership scope | Slice 2 | [x] |

## Handoff to implementation

### Slice 1 — Project tables + `project` membership scope

**Status:** Delivered  
**Prerequisite:** TIP-007/012 Slice A delivered — `entity_group` scope `implemented` in runtime matrix

#### Design (internal-guide)

- `projects` and `teams` are tenant-scoped authority tables — slug unique per tenant; governed insert/update only.
- `project` membership scope persists `memberships.project_id` — no `companyId`/`organizationId` on row (mirrors `entity_group`).
- Extend `membershipMatchesGrantScope` with `projectId` dimension — fail closed on mismatch.
- Narrowness order: `tenant < entity_group < company < organization < project`.
- Kernel `ProjectContext` / `TeamContext` remain serializable; database rows are source of truth post-Slice 1.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-030-project-membership-scope.md

1. Objective    — Add projects and teams authority tables and activate project membership scope in database RLS contracts and permissions engine; wire ERP grant-scope resolver without PM domain logic.
2. Allowed layer— packages/database/src/project/, packages/database/src/team/, packages/database/src/membership/, packages/database/src/rls/, packages/database/src/schema/, packages/permissions/src/scope/
3. Files        — packages/database/src/database.types.ts (Modified)
                  packages/database/src/ids.ts (Modified)
                  packages/database/src/schema/project.schema.ts (New)
                  packages/database/src/schema/team.schema.ts (New)
                  packages/database/src/schema/membership.schema.ts (Modified)
                  packages/database/src/schema/index.ts (Modified)
                  packages/database/src/project/project.contract.ts (Modified)
                  packages/database/src/project/project.service.ts (New)
                  packages/database/src/project/index.ts (Modified)
                  packages/database/src/team/team.contract.ts (New)
                  packages/database/src/team/team.service.ts (New)
                  packages/database/src/team/index.ts (Modified)
                  packages/database/src/membership/membership.contract.ts (Modified)
                  packages/database/src/membership/membership.service.ts (Modified)
                  packages/database/src/rls/rls-grant.contract.ts (Modified)
                  packages/database/src/__tests__/membership.contract.test.ts (Modified)
                  packages/database/src/__tests__/rls-grant.contract.test.ts (Modified)
                  packages/database/src/migrations/20260624120000_project_team_foundation.sql (New)
                  packages/database/src/migrations/migration-governance.contract.ts (Modified)
                  packages/database/src/migrations/meta/_journal.json (Modified)
                  packages/permissions/src/scope/membership.contract.ts (Modified)
                  packages/permissions/src/scope/grant-scope-resolution.ts (Modified)
                  packages/permissions/src/scope/membership-resolution.ts (Modified)
                  packages/permissions/src/database/contract-mappers.ts (Modified)
                  packages/permissions/src/permissions-scope-grants-registry.ts (Modified)
                  packages/permissions/src/__tests__/permissions-scope-grants-registry.test.ts (Modified)
                  packages/permissions/src/__tests__/project-membership-scope.test.ts (New)
                  apps/erp/src/lib/context/resolve-grant-scope.server.ts (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-030-project-membership-scope.md (Modified)
                  docs/delivery/tips/[Complete] tip-007-012-enterprise-group-operating-context.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — PM tasks/budgets/approvals, team membership scope (Slice 2), consolidation arithmetic, journal/ledger/posting/COA, @afenda/accounting (ADR-0010), packages/ui, packages/appshell edits
5. Authority    — ADR-0001 Phase 2 — Database Authority + Permission Authority + multi-tenancy.md
6. Gates        — pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/permissions typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/permissions test:run
                  pnpm check:permissions-scope-grants-surface
                  pnpm quality:migrations
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | `projects` table + governed writes | `pnpm --filter @afenda/database test:run` |
| 2 | `teams` table + governed writes | `pnpm --filter @afenda/database test:run` |
| 3 | `project` membership scope in RLS | `pnpm check:permissions-scope-grants-surface` |
| 4 | TIP-007/012 DoD #14 closed | `pnpm check:documentation-drift` |

#### Known debt

- `organizations.type=team` rows remain until migration slice.

### Slice 2 — `team` membership scope

**Status:** Delivered  
**Prerequisite:** Slice 1 runtime evidence — `project` scope `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- `team` membership scope persists `memberships.team_id` — mirrors `project` (no company/org columns on row).
- Extend `membershipMatchesGrantScope` with `teamId` dimension — fail closed on mismatch.
- Narrowness order: `tenant < entity_group < company < organization < project < team` (team narrowest execution tier).
- Migration `20260624140000_team_membership_scope`; Supabase tenant RLS completion in `20260624150000_tenant_rls_completion` (TIP-007/012 DoD #16).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-030-project-membership-scope.md

1. Objective    — Activate team membership scope in database RLS contracts and permissions engine; wire ERP grant-scope resolver with teamId context dimension.
2. Allowed layer— packages/database/src/membership/, packages/database/src/rls/, packages/database/src/schema/, packages/permissions/src/scope/
3. Files        — (delivered — see git history)
4. Prohibited   — PM domain logic, journal/ledger/posting/COA, @afenda/accounting (ADR-0010)
5. Authority    — ADR-0001 Phase 2 — Database Authority + Permission Authority
6. Gates        — pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/permissions test:run
                  pnpm check:permissions-scope-grants-surface
                  pnpm quality:migrations
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 5 | `team` membership scope | `pnpm check:permissions-scope-grants-surface` |

## Verdict

**Complete** — Slices 1–2 delivered (`projects`/`teams` tables + `project` and `team` membership scopes). PM domain logic remains out of scope.
