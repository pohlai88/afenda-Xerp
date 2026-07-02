# shadcn/studio Presentation PAS Family

| Field | Value |
| --- | --- |
| **Scope** | Design layer — one Blueprint box · `@afenda/shadcn-studio` |
| **Upstream** | [Presentation North Star](../../NORTHSTAR/shadcn-studio-presentation-north-star.md) · [Presentation Blueprint](../../BLUEPRINT/shadcn-studio-presentation-blueprint.md) |
| **Slice SSOT** | [`SLICE/`](SLICE/README.md) — handoffs `P06-001` … |
| **Lane boundaries** | [DEVELOPMENT-LANE-BOUNDARIES.md](../DEVELOPMENT-LANE-BOUNDARIES.md) |
| **Maturity** | **Enterprise Accepted** — PKGR05A promoted (P06-010) |
| **Last reviewed** | 2026-07-02 |

> **One sentence:** Five PAS documents govern frontend manufacturing doctrine, presentation product runtime, relational inventory & production pipeline, ACPA/WCAG acceptance, and metadata-driven surfaces — with slice handoffs in `PRESENTATION/SLICE/` and runtime in `@afenda/shadcn-studio`.

---

## Constitutional chain

```text
Platform North Star
  → Presentation North Star (docs/NORTHSTAR/)
  → Presentation Blueprint (docs/BLUEPRINT/)
  → PAS-006 family (this folder)
  → Slice SSOT (docs/PAS/PRESENTATION/SLICE/)
  → Code (packages/shadcn-studio, apps/erp, apps/storybook)
```

**Doctrine:** shadcn/studio is a **governed frontend manufacturing system** — raw MCP blocks stabilize before customize. Kernel owns shape; Enterprise Knowledge owns meaning; presentation owns operator visual truth.

---

## Family index

| PAS ID | Document | Role | Maturity | Slices |
| --- | --- | --- | --- | --- |
| **PAS-006** | [PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md](PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) | Constitutional charter · manufacturing doctrine | MVP Authority (charter) | — (superseded by 006A–006D for implementation) |
| **PAS-006A** | [PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md](PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) | Presentation product — theme, CSS, MCP, exports | Production Candidate | P06-001 **Delivered** |
| **PAS-006B** | [PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md](PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) | Relational inventory · lifecycle · slots · contracts | Production Candidate | P06-002–P06-004 **Delivered** |
| **PAS-006C** | [PAS-006C-SURFACE-ACCEPTANCE-ACPA-STANDARD.md](PAS-006C-SURFACE-ACCEPTANCE-ACPA-STANDARD.md) | Acceptance Record · ACPA · auth WCAG AA | Production Candidate | P06-005–P06-007 **Delivered** |
| **PAS-006D** | [PAS-006D-METADATA-DRIVEN-SURFACES-STANDARD.md](PAS-006D-METADATA-DRIVEN-SURFACES-STANDARD.md) | Metadata binding · surface templates · DOM slot markers | Production Candidate | P06-008–P06-009 · P06-008-R1/R2 **Delivered** |
| **PAS-006E** | [PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md](PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md) | Developer route lab — full-screen UX prototype · port 3002 | Planned (docs Delivered) | P06-013 **Delivered** · P06-014–P06-016 Planned |

**Runtime authority today:** PAS-006 family P06-001–P06-013 + P06-008-R1/R2 delivered. Route lab app **P06-014+ Planned**.

**Agent skill:** `shadcn-studio` · `.cursor/skills/shadcn-studio/SKILL.md`

---

## Agent read order

```text
1. Presentation North Star §1–§12 (scope dispute only)
2. Presentation Blueprint §4 · §5.2 · §5.3 · §10
3. This README — pick PAS by work type
4. Target PAS §0
5. [Slice catalog](SLICE/presentation-slice-catalog.md)
6. Individual handoff: SLICE/p06-*.md → /afenda-coding-session Phase 0
```

| Work type | Start here |
| --- | --- |
| Doctrine · manufacturing chain · NS alignment | PAS-006 §0 |
| Theme · CSS · MCP install · block exports | PAS-006A §0 |
| Registry · slots · lifecycle · block data contracts | PAS-006B §0 |
| Acceptance Record · ACPA · auth WCAG AA gates | PAS-006C §0 |
| Metadata binding · surface templates | PAS-006D §0 |
| Route lab · developer sandbox · port 3002 | PAS-006E §0 · [ADR-0039](../../adr/ADR-0039-developer-presentation-sandbox.md) |

---

## Hard stops (family-wide)

- Do not import `@afenda/kernel` into `@afenda/shadcn-studio`.
- Do not restore `@afenda/ui`, appshell, metadata-ui, `@afenda/css-authority` without ADR.
- Do not execute PAS-005 / `css-authority` skill for ERP — retired; see [DEVELOPMENT-LANE-BOUNDARIES.md](../DEVELOPMENT-LANE-BOUNDARIES.md).
- Do not wire raw MCP blocks to ERP routes without Acceptance Record (NS §3.7 · PAS-006C).
- Do not customize blocks before **Stabilized** + **Theme-bound** lifecycle states (NS §8.1 · PAS-006B).
- PKGR05A disposition edits → `foundation-registry-owner` only.

---

## Maintenance

| Event | Update |
| --- | --- |
| New NS §4 capability | NS → Blueprint §10 → PAS amendment → SLICE handoff |
| Slice delivered | PAS metadata · skill mirror · [`pas-status-index.md`](../pas-status-index.md) · Blueprint §10 |
| New PAS extension | Blueprint §10 first → author PAS → SLICE catalog row |
