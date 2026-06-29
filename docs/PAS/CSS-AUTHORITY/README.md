# RETIRED — PAS-005 CSS Authority Family (ADR-0027)

| Field | Value |
| --- | --- |
| **Status** | **Retired for ERP frontend** — do not execute slices or gates |
| **Superseded by** | [PAS-006 Presentation](../PRESENTATION/README.md) · [ADR-0027](../../adr/ADR-0027-frontend-presentation-reset.md) |
| **Lane boundaries** | [DEVELOPMENT-LANE-BOUNDARIES.md](../DEVELOPMENT-LANE-BOUNDARIES.md) |

> **One sentence:** This folder is **historical audit material** for the pre-ADR-0027 CSS strangler track — it is not a parallel development lane alongside Kernel (PAS-001) or Presentation (PAS-006).

---

## Do not use for active ERP work

| Instead of | Use |
| --- | --- |
| PAS-005 · `@afenda/css-authority` · `css-authority` skill | **PAS-006A** · `@afenda/shadcn-studio` · `shadcn-studio` skill |
| PAS-005A B38–B42p slice handoffs | **PAS-006** `P06-*` handoffs under [`PRESENTATION/SLICE/`](../PRESENTATION/SLICE/) |
| PAS-005B design-system retirement slices | **ADR-0027** — legacy packages deleted; stock shadcn/studio chain |

**Agent hard stop:** If Phase 0 allowed paths include `packages/css-authority/**` or `docs/PAS/CSS-AUTHORITY/SLICE/b*.md` for ERP delivery, **stop** — reroute to [`PRESENTATION/README.md`](../PRESENTATION/README.md).

---

## Archived standard (historical text only)

Full PAS-005 standard text (pre-ADR-0027) lives at [`docs/_retired/legacy-css-authority/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md`](../../_retired/legacy-css-authority/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md) — **do not execute**; use for audit and lineage only.

---

## What remains in this folder

| Content | Purpose |
| --- | --- |
| `PAS-005*.md` | Historical standard text — reference only |
| `SLICE/b*.md` | Historical handoffs — **do not execute** |
| `SLICE/css-authority-slice-catalog.md` | Historical build order — see [`pas-status-index.md`](../pas-status-index.md) **Historical / archived** sections |

---

## Active documentation chain (ERP presentation)

[Presentation North Star](../../NORTHSTAR/shadcn-studio-presentation-north-star.md) → [Presentation Blueprint](../../BLUEPRINT/shadcn-studio-presentation-blueprint.md) → [PRESENTATION/README.md](../PRESENTATION/README.md) → [PAS-006](../PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md).
