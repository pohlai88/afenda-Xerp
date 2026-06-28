# Slice B52 — Kernel Full Hierarchy Wire Closure (ADR-0022)

**Prerequisite:** Slice B51 — Kernel Parent Organization Wire (`b51-kernel-parent-org-wire.md`, `Status: Delivered`)

**Status:** Delivered

**Type:** Implementation

**Risk class:** Medium — ERP/database mapper boundary; no schema migration

**Clean Core impact:** A→A — lookup SELECT join enrichment; branded IDs on kernel surface only; uuid PK retained for FK ops

---

## Objective

Close remaining ADR-0022 hierarchy wire gaps after B49–B51. Kernel wire triads already exist in `context-registry.ts` — this slice wires **ownership interest** enterprise IDs at the ERP/database mapper boundary.

1. `findOwnershipInterestsByEntityGroup` joins `enterprise_id` for ownership row, tenant, entity group, parent company, and child company.
2. `OwnershipInterestLookupRow` exposes enterprise IDs for wire; uuid PKs retained for internal FK ops.
3. `toOwnershipInterestContext` maps enterprise IDs → `parseUnknownOwnershipInterestContext` (`own_*`, `ten_*`, `egp_*`, `cmp_*`).
4. **Team wire** — org-backed path documented: `toTeamContext` from branded `OrganizationUnitContext` is correct (`org_*` as `TeamAuthorityId`).
5. **Project** — explicitly deferred until Foundation phase 30 resolver (`verifyProjectSelection` rejects hints); no project lookup in this slice.

---

## DoD

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | Ownership interest lookup joins enterprise IDs | `ownership-interest-lookup.service.ts` |
| 2 | Lookup row exposes wire enterprise IDs | `ownership-interest.contract.ts`, typecheck |
| 3 | Mapper brands all hierarchy IDs | `to-ownership-interest-context.test.ts` |
| 4 | Split-ID test — uuid PKs vs branded kernel surface | `to-ownership-interest-context.test.ts` |
| 5 | FK ops unchanged — uuid `tenantId` + `entityGroupId` filter | `load-operating-context-ownership-interests.server.ts` |
| 6 | Team org-backed wire documented + tested | `operating-context.mappers.test.ts` |
| 7 | Project deferred — no lookup implementation | this doc §Objective |
| 8 | All acceptance gates pass | typecheck + tests |

---

## Handoff block

```
1. Objective    — Wire ADR-0022 ownership-interest enterprise_id at ERP/database mapper boundary; document team org-backed path; defer project until Foundation phase 30.
2. Allowed layer— packages/database/src/ownership-interest/**; apps/erp/src/lib/context/**; docs/PAS/
3. Files        — ownership-interest-lookup.service.ts (MODIFY)
                  ownership-interest.contract.ts (MODIFY)
                  public-api.ts (MODIFY — export lookup type)
                  to-ownership-interest-context.ts (MODIFY)
                  to-ownership-interest-context.test.ts (MODIFY)
                  operating-context.mappers.test.ts (MODIFY — team test)
                  ownership-interest.contract.test.ts (MODIFY)
                  b52-kernel-full-hierarchy-wire-closure.md (CREATE)
                  pas-status-index.md, PAS-001 header (MODIFY)
4. Prohibited   — schema migrations; project lookup / toProjectContext; parse*Id uuid widening; foundation-disposition.registry.ts; kernel triad changes
5. Authority    — ADR-0021 branded IDs · ADR-0022 split-ID · PAS-001 §4.4 wire triad · B49–B51 mirror
6. Gates        — pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/kernel typecheck
                  pnpm --filter @afenda/database test:run (ownership + consolidation)
                  pnpm --filter @afenda/erp test:run (context + mapper)
7. Closes       — ADR-0022 full hierarchy wire at ERP boundary (ownership interest slot)
8. Evidence     — split-ID mapper test; lookup join SELECT; FK uuid filter preserved; team org-backed test; gates pass
9. Attestation  — Afenda Governed Implementer — Enterprise 9.5+/10
```

---

## Deferred — Project wire (Foundation phase 30)

Project selection remains blocked at the kernel boundary until Foundation phase 30 delivers a canonical project resolver. `verifyProjectSelection` rejects project hints; **no** `findProjects*` lookup or `toProjectContext` in B52.

---

## Drift prevention

| Rule | Result |
|------|--------|
| No prohibited boundary crossed | Pass |
| No schema migration | Pass |
| No parse*Id uuid widening | Pass |
| Branded IDs only on kernel surface | Pass |
| uuid PK for FK ops | Pass |
| Project lookup not implemented | Pass |
