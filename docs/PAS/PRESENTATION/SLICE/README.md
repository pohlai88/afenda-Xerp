# Presentation slice SSOT (PAS-006 family)

| Field | Value |
| --- | --- |
| **Authority** | [Presentation PAS family](../README.md) |
| **Catalog** | [presentation-slice-catalog.md](presentation-slice-catalog.md) |
| **Status index** | [pas-status-index.md](../../pas-status-index.md#pas-006-shadcnstudio-frontend-standard--active) |
| **Legacy (retired path)** | B38–B42p under `docs/PAS/CSS-AUTHORITY/SLICE/` — archived; mapped to P06-001 only |

---

## Naming

| Pattern | Meaning |
| --- | --- |
| `P06-NNN` | Presentation PAS-006 family slice |
| `p06-NNN-*.md` | Handoff filename (lowercase) |

Do not execute legacy PAS-005A slices for ERP frontend — ADR-0027 retired that chain.

---

## Handoff location

```text
docs/PAS/PRESENTATION/SLICE/p06-NNN-<slug>.md
```

Each handoff uses the **9-field** template per `/afenda-coding-session` and `pas-slice-template.md`.

---

## Read order

1. [Presentation Blueprint §10](../../../BLUEPRINT/shadcn-studio-presentation-blueprint.md#10-pas-inventory) — PAS + slice counts
2. [presentation-slice-catalog.md](presentation-slice-catalog.md) — sequence and prerequisites
3. Target PAS §12 (slice catalog mirror)
4. Individual `p06-*.md` handoff
