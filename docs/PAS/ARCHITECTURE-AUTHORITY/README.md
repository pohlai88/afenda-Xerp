# Architecture Authority PAS Family

| Field | Value |
| --- | --- |
| **Scope** | Platform Architecture Authority — one Blueprint box |
| **Upstream** | [Architecture Authority North Star](../../NORTHSTAR/architecture-authority-north-star.md) · [Architecture Authority Blueprint](../../BLUEPRINT/architecture-authority-blueprint.md) |
| **Slice SSOT** | [`SLICE/`](SLICE/README.md) — individual handoffs B1–B27 · B38–B42 |
| **Maturity** | Enterprise Accepted (PAS-002A B38–B42 closed) |
| **Last reviewed** | 2026-06-29 |

> **One sentence:** Two PAS documents govern registry-first package/layer/ownership/dependency/disposition truth — with slice handoffs in `ARCHITECTURE-AUTHORITY/SLICE/` and runtime proof in `@afenda/architecture-authority`.

---

## Constitutional chain

```text
Platform North Star
  → Architecture Authority North Star (docs/NORTHSTAR/)
  → Architecture Authority Blueprint (docs/BLUEPRINT/)
  → Architecture Authority PAS family (this folder)
  → Slice SSOT (docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/)
  → Code (packages/architecture-authority, scripts/governance/**)
```

**Doctrine:** Structure is not meaning and structure is not shape — registries record *what is allowed*; Kernel owns wire shape; Enterprise Knowledge owns accepted meaning.

---

## Family index

| PAS ID | Document | Blueprint box | Package | Maturity | Slices |
| --- | --- | --- | --- | --- | --- |
| **PAS-002** | [PAS-002-ARCHITECTURE-AUTHORITY.md](PAS-002-ARCHITECTURE-AUTHORITY.md) | Architecture authority | `@afenda/architecture-authority` | MVP Authority (closed) | B1–B27 |
| **PAS-002A** | [PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md](PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) | Architecture authority | `@afenda/architecture-authority` | Enterprise Accepted | B38–B42 |

**Agent skill:** `architecture-authority` · `.cursor/skills/architecture-authority/SKILL.md`

**Planned (Domain NS §15 · △ E11–E15):** Extension boundary · surface attestation · golden-path scaffold · target-state · system membership · reference patterns — in-box PAS amendment slices; no new Blueprint box.

---

## Agent read order

```text
1. Architecture Authority North Star §1–§12 (scope dispute only)
2. Architecture Authority Blueprint §4 · §5.1 · §5.2
3. This README — pick PAS-002 or PAS-002A
4. Composed PAS §0 (always)
5. [Slice catalog](SLICE/architecture-authority-slice-catalog.md) — build order / closure
6. Individual handoff: SLICE/b<N>-*.md → /afenda-coding-session Phase 0
```

| Work type | Start here |
| --- | --- |
| Registry / layer / ownership / dependency / drift | PAS-002 §0 |
| Enterprise Accepted gates · kernel non-duplication · consumer proof | PAS-002A §0 + `kernel-authority` |

---

## Hard stops (family-wide)

- `contracts-only` runtime stance is **permanent** — no ERP request-time governance execution.
- Do not duplicate Kernel identity parsers, wire asserts, or ID families in architecture-authority.
- Do not store Knowledge Atoms in architecture-authority — list packages only ([PAS-004](../ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)).
- Registry class SSOT is per Domain NS §3.1 — do not merge registries in prose or data.
- Disposition registry edits → `foundation-registry-owner` only.

---

## Maintenance

| Event | Update |
| --- | --- |
| New §4 capability (Domain NS) | Domain NS → Blueprint → PAS amendment → SLICE handoff |
| Slice close | [SLICE/architecture-authority-slice-catalog.md](SLICE/architecture-authority-slice-catalog.md) · [pas-status-index.md](../pas-status-index.md) · PAS §12 |
| SKILL regen | `.cursor/skills/architecture-authority/SKILL.md` (SYNC intent) |
| Platform inventory | [Platform Blueprint](../../architecture/afenda-architecture-blueprint.md) — Governance family |
