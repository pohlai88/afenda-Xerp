# Slice B51 — Kernel Parent Organization Wire (ADR-0022)

**Prerequisite:** Slice B50 — Kernel Company/Org/Entity-Group Wire Triad (`b50-kernel-company-org-wire-triad.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low — lookup SELECT join enrichment; ERP mapper boundary only

**Clean Core impact:** A→A — left join parent org for `enterpriseId`; uuid FK retained for internal ops

---

## Objective

Close B50 residual: `parentOrganizationUnitId` on the kernel surface must use parent org `enterpriseId` (`org_*`), not uuid FK `parentOrganizationId`. Mirror entity-group `parentLegalEntityEnterpriseId` left join pattern.

---

## DoD

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | `OrganizationLookupRow.parentOrganizationEnterpriseId` | typecheck |
| 2 | Self-join `organizations` alias; left join on `parentOrganizationId` | `workspace-lookup.service.ts` |
| 3 | `organizationLookupSelect` + org find queries updated | tests |
| 4 | `toOrganizationUnitContext` maps enterprise ID, not uuid FK | mapper test |
| 5 | `team-lookup.service.ts` join + row shape | typecheck |
| 6 | Child org with parent — branded parent org id | `operating-context.mappers.test.ts` |
| 7 | Collateral ERP fixtures updated | ERP context tests |
| 8 | Acceptance gates pass | typecheck + tests |

---

## Handoff block

```
1. Objective    — Wire parent org enterpriseId on OrganizationLookupRow; map to kernel parentOrganizationUnitId at ERP boundary; mirror B50 entity-group parent join.
2. Allowed layer— packages/database/src/workspace/workspace-lookup.service.ts; packages/database/src/team/team-lookup.service.ts; apps/erp/src/lib/context/**; docs/PAS/
3. Files        — workspace-lookup.service.ts (MODIFY)
                  team-lookup.service.ts (MODIFY)
                  operating-context.mappers.ts (MODIFY)
                  operating-context.mappers.test.ts (MODIFY)
                  operating-context.test.ts (MODIFY)
                  b51-kernel-parent-org-wire.md (CREATE)
                  pas-status-index.md (MODIFY — B51 row only)
4. Prohibited   — foundation-disposition.registry.ts; schema migrations; parseOrganizationId uuid widening
5. Authority    — ADR-0021 branded IDs · ADR-0022 split-ID · PAS-001 §4.4 wire triad · B50 entity-group parent mirror
6. Gates        — pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/erp test:run (context + mapper)
7. Closes       — ADR-0022 parent organization hierarchy wire at ERP boundary
8. Evidence     — mapper test child-with-parent; FK uuid retained on lookup row; gates pass
9. Attestation  — Afenda Governed Implementer — Enterprise 9.5+/10
```

---

## Drift prevention

| Rule | Result |
|------|--------|
| No prohibited boundary crossed | Pass |
| No schema migration | Pass |
| No parseOrganizationId uuid widening | Pass |
| Branded parent org ID on kernel surface only | Pass |
| uuid FK retained on lookup row for internal ops | Pass |
