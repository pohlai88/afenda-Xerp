# Slice B50 — Kernel Company/Org/Entity-Group Wire Triad (ADR-0022)

**Prerequisite:** Slice B49 — Kernel Tenant Wire Triad (`b49-kernel-tenant-wire-triad.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Medium — ERP mapper boundary; no schema migration

**Clean Core impact:** A→A — lookup SELECT + join enrichment; branded IDs on kernel surface only; uuid PK retained for FK ops

---

## Objective

Complete ADR-0022 split-ID wire triad for company, organization unit, and entity group at the ERP mapper boundary — mirroring B49 tenant pattern (`enterpriseId` on lookup rows; `parse*Id` on kernel surface; uuid PK for internal FK comparisons).

1. `CompanyLookupRow.enterpriseId` + SELECT; `toLegalEntityContext` uses `parseCompanyId(row.enterpriseId)`.
2. `OrganizationLookupRow.enterpriseId` + `companyEnterpriseId` (join `companies.enterprise_id`); `toOrganizationUnitContext` brands both.
3. `EntityGroupLookupRow.enterpriseId` + `parentLegalEntityEnterpriseId` (left join parent company); `toEntityGroupContext` brands both.
4. Resolvers continue uuid PK FK comparisons via `companyPk` / `row.id`.

---

## DoD

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | Company wire — branded `companyId` from `enterpriseId` | `operating-context.mappers.test.ts` |
| 2 | Organization wire — branded org + company IDs | `operating-context.mappers.test.ts` |
| 3 | Entity group wire — branded group + parent company IDs | `operating-context.mappers.test.ts` |
| 4 | FK ops unchanged — uuid PK for DB comparisons | `resolve-operating-context.server.ts`, resolver tests |
| 5 | Pre-auth server actions exempt from operating context binding | `pre-auth-server-action.exempt.ts`, integration test 55/55 |
| 6 | Appshell import resolves in vitest | `context-switch.action.test.ts` |
| 7 | All acceptance gates pass | Typecheck + ERP context tests |

---

## Handoff block

```
1. Objective    — Wire ADR-0022 company/org/entity-group enterprise_id at ERP mapper boundary; keep uuid PK for FK ops; pre-auth action exempt registry; B18 PAS status closure sync.
2. Allowed layer— packages/database/src/workspace/workspace-lookup.service.ts; apps/erp/src/lib/context/**; apps/erp/src/__tests__/operating-context-integration.test.ts; docs/PAS/
3. Files        — workspace-lookup.service.ts (MODIFY)
                  operating-context.mappers.ts (MODIFY)
                  resolve-operating-context.server.ts (MODIFY)
                  resolve-legal-entity-context.server.ts (MODIFY)
                  operating-context.mappers.test.ts (MODIFY)
                  resolve-legal-entity-context.test.ts (MODIFY)
                  operating-context.test.ts (MODIFY)
                  to-shell-operating-context.ts (MODIFY)
                  pre-auth-server-action.exempt.ts (CREATE)
                  operating-context-integration.test.ts (MODIFY)
                  b50-kernel-company-org-wire-triad.md (CREATE)
                  pas-status-index.md, PAS-001 header, kernel-authority skill header (MODIFY)
4. Prohibited   — foundation-disposition.registry.ts; schema migrations; parseCompanyId uuid widening; resolveActionOperatingContext on pre-auth actions; packages/ui; shadcn-studio
5. Authority    — ADR-0021 branded IDs · ADR-0022 split-ID · PAS-001 §4.4 wire triad · B49 tenant mirror
6. Gates        — pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/metadata-ui typecheck
                  pnpm --filter @afenda/erp test:run (context + integration)
7. Closes       — ADR-0022 company/org/entity-group hierarchy wire at ERP boundary
8. Evidence     — mapper tests pass; FK uuid comparisons preserved; integration 55/55; B18 remaining slices = none
9. Attestation  — Afenda Governed Implementer — Enterprise 9.5+/10
```

---

## Drift prevention

| Rule | Result |
|------|--------|
| No prohibited boundary crossed | Pass |
| No parallel registry created | Pass |
| No schema migration | Pass |
| No parseCompanyId uuid widening | Pass |
| Branded IDs only on kernel surface | Pass |
| uuid PK for FK ops | Pass |
