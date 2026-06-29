# shadcn/studio Presentation PAS Family

| Field | Value |
| --- | --- |
| **Scope** | Design layer — one Blueprint box · `@afenda/shadcn-studio` |
| **Upstream** | [Presentation North Star](../../NORTHSTAR/shadcn-studio-presentation-north-star.md) · [Presentation Blueprint](../../BLUEPRINT/shadcn-studio-presentation-blueprint.md) |
| **Slice SSOT** | [`SLICE/`](SLICE/README.md) — handoffs `P06-001` … |
| **Maturity** | Production Candidate — **not yet Enterprise Accepted** |
| **Last reviewed** | 2026-06-29 |

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
| **PAS-006A** | [PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md](PAS-006A-SHADCN-STUDIO-PRODUCT-STANDARD.md) | Presentation product — theme, CSS, MCP, exports | Production Candidate | P06-001 delivered (legacy B38–B42f) |
| **PAS-006B** | [PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md](PAS-006B-INVENTORY-PRODUCTION-PIPELINE-STANDARD.md) | Relational inventory · lifecycle · slots · contracts | Proposed | P06-002–P06-004 (proposed) |
| **PAS-006C** | [PAS-006C-SURFACE-ACCEPTANCE-ACPA-STANDARD.md](PAS-006C-SURFACE-ACCEPTANCE-ACPA-STANDARD.md) | Acceptance Record · ACPA · auth WCAG AA | Proposed | P06-005–P06-007 (proposed) |
| **PAS-006D** | [PAS-006D-METADATA-DRIVEN-SURFACES-STANDARD.md](PAS-006D-METADATA-DRIVEN-SURFACES-STANDARD.md) | Metadata binding · surface templates | Proposed | P06-008–P06-009 (proposed) |

**Agent skill:** `shadcn-studio` · `.cursor/skills/shadcn-studio/SKILL.md`

**Runtime authority today:** PAS-006A (product baseline live). PAS-006B–006D are **required** before Enterprise Accepted attestation (P06-010).

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

---

## Hard stops (family-wide)

- Do not import `@afenda/kernel` into `@afenda/shadcn-studio`.
- Do not restore `@afenda/ui`, appshell, metadata-ui, css-authority without ADR.
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
