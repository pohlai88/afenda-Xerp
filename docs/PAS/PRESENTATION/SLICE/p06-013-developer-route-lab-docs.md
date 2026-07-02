# Slice P06-013 — Developer Route Lab Docs (PAS-006E)

> **Position:** Slice `13` in PAS-006 family · Blueprint box: **Developer Route Lab**

**Prerequisite:** P06-012 Delivered · ADR-0027 presentation chain live

**Status:** Delivered (2026-07-02)

**Type:** Documentation only — no `apps/developer` code

**Risk class:** Low

**Clean Core impact:** B→B — presentation lab doctrine only; no kernel or accounting runtime

## Purpose

Establish constitutional and PAS authority for the **Developer Route Lab** (`@afenda/developer`, port **3002**) before application scaffold — ADR-0039, adjunct North Star, Blueprint, PAS-006E with frontend layout annex, reference borrow map, and slice handoffs P06-014–P06-016.

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-013-developer-route-lab-docs.md

1. Objective    — P06-013 docs: ADR-0039 Accepted + NS amend + adjunct NS + Blueprint + PAS-006E + borrow map + lane/index/skill updates. NO apps/developer code.
2. Allowed layer— docs/adr/** · docs/NORTHSTAR/** · docs/BLUEPRINT/** · docs/PAS/PRESENTATION/** · docs/PAS/pas-status-index.md · docs/PAS/DEVELOPMENT-LANE-BOUNDARIES.md · .cursor/skills/afenda-nextjs-best-practice/SKILL.md
3. Files        —
   docs/adr/ADR-0039-developer-presentation-sandbox.md
   docs/NORTHSTAR/shadcn-studio-presentation-north-star.md (§3 glossary)
   docs/NORTHSTAR/developer-sandbox-north-star.md
   docs/NORTHSTAR/README.md
   docs/BLUEPRINT/developer-sandbox-blueprint.md
   docs/BLUEPRINT/shadcn-studio-presentation-blueprint.md (sibling link)
   docs/PAS/PRESENTATION/PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md
   docs/PAS/PRESENTATION/SLICE/reference-borrow-map.md
   docs/PAS/PRESENTATION/SLICE/p06-013-developer-route-lab-docs.md
   docs/PAS/PRESENTATION/SLICE/p06-014-developer-app-scaffold.md
   docs/PAS/PRESENTATION/SLICE/p06-015-dashboard-compositions.md
   docs/PAS/PRESENTATION/SLICE/p06-016-admin-list-theme-smoke.md
   docs/PAS/PRESENTATION/SLICE/presentation-slice-catalog.md
   docs/PAS/pas-status-index.md
   docs/PAS/DEVELOPMENT-LANE-BOUNDARIES.md
   docs/PAS/PRESENTATION/README.md
   .cursor/skills/afenda-nextjs-best-practice/SKILL.md
4. Prohibited   — apps/developer/** · foundation-disposition.registry.ts · PAS-007 domain
5. Authority    — ADR-0039 · PAS-006E · Presentation NS · developer-sandbox NS/Blueprint
6. Gates        —
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
7. Closes       — P06-013 acceptance gate checklist (ADR-0039) · PAS-006E charter · route lab slice queue
8. Evidence     — ADR-0039 Status Accepted · catalog rows P06-013 Delivered · P06-014+ Planned
9. Attestation  — Documentation · PAS index · lane boundaries
```

## Delivery criteria

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | ADR-0039 Accepted 2026-07-02 | `docs/adr/ADR-0039-developer-presentation-sandbox.md` |
| 2 | NS §3 Block lab vs Route lab | `shadcn-studio-presentation-north-star.md` |
| 3 | Adjunct NS ~8 sections | `developer-sandbox-north-star.md` |
| 4 | Blueprint + sibling link | `developer-sandbox-blueprint.md` · Presentation Blueprint |
| 5 | PAS-006E + layout annex | `PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md` §7 |
| 6 | Borrow map v1 routes | `reference-borrow-map.md` |
| 7 | Handoffs P06-014–016 Planned | SLICE handoff files |
| 8 | Catalog + pas-status-index | P06-013 Delivered |
| 9 | DEVELOPMENT-LANE three consumers | storybook · developer · erp |
| 10 | afenda-nextjs port 3002 row | SKILL multi-app table |
| 11 | documentation-drift gate | Shell output |
| 12 | foundation-disposition gate | Shell output (no registry edit) |

## Out of scope (follow-on)

| Track | Owner | Notes |
| --- | --- | --- |
| Registry `@afenda/developer` lab-lane | `@foundation-registry-owner` | After ADR-0039 Accepted |
| App scaffold | P06-014 | Gate: P06-013 checklist + registry row |
| Playwright smoke :3002 | P06-016 | Advisory CI |

## Related

- [ADR-0039](../../../adr/ADR-0039-developer-presentation-sandbox.md)
- [PAS-006E](../PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md)
- [P06-014](./p06-014-developer-app-scaffold.md)
- [P06-012](./p06-012-storybook-enterprise-lab.md) — Block lab delivered
