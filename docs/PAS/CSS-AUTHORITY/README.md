# CSS Authority PAS Family — Composed Governance Layer

| Field | Value |
| --- | --- |
| **Scope** | Design Token Authority — CSS platform representation + presentation siblings |
| **Upstream** | [Design Token Authority North Star](../../NORTHSTAR/css-authority-north-star.md) · [Visual Token Constitutional Laws](../../CONSTITUTION/visual-token-constitutional-laws.md) · [CSS Authority Blueprint](../../BLUEPRINT/css-authority-blueprint.md) |
| **Slice SSOT** | [`SLICE/`](SLICE/README.md) — individual handoffs · legacy `docs/PAS/slice/b*-pas005*` **tombstoned** (redirects to this folder) |
| **Maturity** | MVP Authority (PAS-005 · PAS-005A) · Retirement Candidate (PAS-005B) |
| **Last reviewed** | 2026-06-29 |

> **One sentence:** Three PAS documents govern CSS token authority, shadcn/studio presentation, and design-system retirement — with slice handoffs in `CSS-AUTHORITY/SLICE/` and constitutional meaning in the Domain North Star.

---

## Constitutional chain

```text
Platform North Star
  → Design Token Authority North Star (docs/NORTHSTAR/)
  → CSS Authority Blueprint (docs/BLUEPRINT/)
  → CSS Authority PAS family (this folder)
  → CSS Authority Slice SSOT (docs/PAS/CSS-AUTHORITY/SLICE/)
  → Code (@afenda/css-authority, @afenda/shadcn-studio, …)
```

**Doctrine:** Token **meaning** is renderer-agnostic (P9); **CSS custom properties** are today's representation. Tokens ≠ Governed UI recipes ≠ UI primitive behavior.

---

## Family index

| PAS ID | Document | Blueprint box | Package | Maturity | Slices |
| --- | --- | --- | --- | --- | --- |
| **PAS-005** | [PAS-005-CSS-AUTHORITY-STANDARD.md](PAS-005-CSS-AUTHORITY-STANDARD.md) | **CSS authority** | `@afenda/css-authority` | MVP Authority — delivered | B27–B37 (B26 scaffold — no handoff file) |
| **PAS-005A** | [PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md](PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) | **shadcn/studio presentation** | `@afenda/shadcn-studio` | MVP Authority — closed | B38–B42p |
| **PAS-005B** | [PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md](PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md) | **Design system retirement** | `@afenda/design-system` (retiring) | Retirement Candidate | B43 delivered · B44+ proposed |

**Agent skills:** `css-authority` · `shadcn-studio-authority` · `ui-consistency-bundle` (consumers)

---

## Agent read order

```text
1. Design Token Authority North Star §1–§12 (scope dispute only)
2. CSS Authority Blueprint §4 · §5.1 · §5.6
3. This README — pick PAS by Blueprint box
4. Composed PAS §0 (always)
5. [CSS Authority slice catalog](SLICE/css-authority-slice-catalog.md) — build order
6. Individual handoff: docs/PAS/CSS-AUTHORITY/SLICE/b<N>-*.md → /afenda-coding-session Phase 0
```

| Work type | Start here |
| --- | --- |
| CSS token / registry / gates | PAS-005 §0 |
| shadcn/studio presentation / MCP | PAS-005A §0 |
| Design-system retirement | PAS-005B §0 |

---

## Hard stops (family-wide)

- Design tokens ≠ component behavior — Governed UI recipes stay in `@afenda/design-system` / `@afenda/ui`.
- Never hand-edit generated `css-authority-registry.*` — authority JSON + generator only.
- CSS is one renderer — not constitutional definition of visual meaning (P9 · [LAW V1](../../CONSTITUTION/visual-token-constitutional-laws.md)).
- Do not expand icons/illustrations inside PAS-005 — Design Asset Authority requires new Domain NS + Blueprint box (§9.4).

---

## Maintenance

| Event | Update |
| --- | --- |
| New token capability | Domain NS §4 → Blueprint §4 → PAS-005 → authority JSON |
| Slice close | [SLICE/css-authority-slice-catalog.md](SLICE/css-authority-slice-catalog.md) · composed PAS §11 · [`pas-status-index.md`](../pas-status-index.md) |
| SKILL regen | `.cursor/skills/css-authority/SKILL.md` from PAS-005 extract map (SYNC intent) |
| Platform inventory | [Platform Blueprint](../../architecture/afenda-architecture-blueprint.md) — Design system family |
