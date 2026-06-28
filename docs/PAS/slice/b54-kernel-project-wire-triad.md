# Slice B54 — Kernel Project Wire Triad (PAS-001 §4.11 / Foundation phase 30)

**Prerequisite:** B49–B52 operating-context hierarchy wire · Foundation phase 30 project schema + write path

**Status:** Delivered — 2026-06-28

**Type:** Implementation — database lookup + ERP mapper + resolver integration

**Risk class:** Medium — closes last operating-context slot deferred in B52

**Clean Core impact:** A→A — read-only lookup; ADR-0022 enterprise-id branding at ERP trust boundary

## Purpose

Close the remaining **−0.2 Enterprise Quality Score** gap from B52 by wiring project resolution end-to-end:

1. **`findProject*`** — `@afenda/database` lookup with company/org enterprise-id joins
2. **`toProjectContext`** — ERP mapper via `parseUnknownProjectContext` (ADR-0022)
3. **Resolver integration** — `resolveOperatingContext` resolves slug/id hints, verifies scope, sets `project` + `workspace.projectId`

## Handoff block

```
Handoff from: docs/PAS/slice/b54-kernel-project-wire-triad.md

1. Objective    — Wire Foundation phase 30 project lookup + ERP toProjectContext + operating-context resolver; replace verifyProjectSelection stub; add projectSlug selection hint.
2. Allowed layer— packages/database/src/project/** · apps/erp/src/lib/context/** · packages/kernel/src/context/operating-context.contract.ts (selection + error codes only) · docs/PAS/slice/b54-kernel-project-wire-triad.md · docs/PAS/pas-status-index.md
3. Files        — project-lookup.service.ts · project/index.ts · public-api.ts · persistence-lookup-registry.ts · to-project-context.ts · resolve-operating-context.server.ts · operating-context.resolution.contract.ts · context-errors.ts · selection schema · API route headers · tests · slice doc · pas-status-index B54 row
4. Prohibited   — schema migrations · foundation-disposition.registry.ts · parseProjectId uuid acceptance
5. Authority    — PAS-001 · ADR-0022 split-ID · Foundation phase 30 project schema
6. Gates        — pnpm check:kernel-context-surface · pnpm --filter @afenda/database typecheck · pnpm --filter @afenda/kernel typecheck · pnpm --filter @afenda/erp typecheck · ERP context tests
7. Closes       — Full hierarchy wire for all resolved operating-context slots (10/10)
8. Evidence     — packages/database/src/project/project-lookup.service.ts · apps/erp/src/lib/context/to-project-context.ts · apps/erp/src/lib/context/resolve-operating-context.server.ts
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. FK filters use uuid PKs (`tenantRow.id`, `companyPk`, `organizationId`); kernel wire uses enterprise IDs (`prj_*`, `cmp_*`, `org_*`).
2. Client slug hints via `projectSlug`; API also accepts `x-afenda-project-id` (enterprise id or uuid PK) and `x-afenda-project-slug`.
3. Only `active` projects are operational — draft/on_hold/completed/cancelled fail closed with `PROJECT_NOT_OPERATIONAL`.
4. `workspace.projectId` stores uuid PK for grant-scope membership matching; `OperatingContext.project.projectId` is branded `ProjectId`.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | `ProjectLookupRow` with company/org enterprise joins | typecheck |
| 2 | `findProjectByTenantAndSlug` / `findProjectById` / `findProjectByEnterpriseId` | typecheck |
| 3 | Lookup registry entries | persistence-lookup-registry.ts |
| 4 | `toProjectContext` brands at ERP boundary | unit test |
| 5 | `verifyProjectBoundary` replaces stub | unit test |
| 6 | Resolver sets `project` + `workspace.projectId` | operating-context.test.ts |
| 7 | `projectSlug` on `OperatingContextSelection` | kernel typecheck |
| 8 | `PROJECT_NOT_FOUND` / `PROJECT_NOT_OPERATIONAL` error codes | kernel typecheck |
| 9 | Public API exports | database public-api |
| 10 | Zero schema migrations | no migration files |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| Project lookup adapters | Yes — B54 | `packages/database/src/project/project-lookup.service.ts` |
| ERP project mapper | Yes — B54 | `apps/erp/src/lib/context/to-project-context.ts` |
| Operating-context resolver wire | Yes — B54 | `apps/erp/src/lib/context/resolve-operating-context.server.ts` |
| Scope boundary verification | Yes — B54 | `apps/erp/src/lib/context/operating-context.resolution.contract.ts` |

## Related slices

| Slice | Relationship |
| --- | --- |
| B49–B51 | Tenant/company/org wire triads — same ADR-0022 pattern |
| B52 | Deferred project slot — closed by B54 |
| B53 | Propagation frame wire — parallel kernel hardening |
