# Enterprise Knowledge PAS Family

| Field | Value |
| --- | --- |
| **Scope** | Platform Enterprise Knowledge — one Blueprint box |
| **Upstream** | [Enterprise Knowledge North Star](../../NORTHSTAR/enterprise-knowledge-north-star.md) · [Enterprise Knowledge Blueprint](../../BLUEPRINT/enterprise-knowledge-blueprint.md) |
| **Slice SSOT** | [`SLICE/`](SLICE/README.md) — individual handoffs B24–B54 |
| **Maturity** | Production Candidate (PAS-004C B38–B48 closed · 58/58); operational closure in PAS-004D |
| **Last reviewed** | 2026-06-29 |

> **One sentence:** Five PAS documents govern accepted business meaning, JSON authority, kernel consumer proof, semantic model, and operational closure — with slice handoffs in `ENTERPRISE-KNOWLEDGE/SLICE/` and runtime proof in `@afenda/enterprise-knowledge`.

---

## Constitutional chain

```text
Platform North Star
  → Enterprise Knowledge North Star (docs/NORTHSTAR/)
  → Enterprise Knowledge Blueprint (docs/BLUEPRINT/)
  → Enterprise Knowledge PAS family (this folder)
  → Slice SSOT (docs/PAS/ENTERPRISE-KNOWLEDGE/SLICE/)
  → Code (packages/enterprise-knowledge, consumer packages)
```

**Doctrine:** Kernel owns wire shape; Enterprise Knowledge owns accepted meaning; Architecture Authority lists packages only — never Knowledge Atoms.

---

## Family index

| PAS ID | Document | Blueprint box | Package | Maturity | Slices |
| --- | --- | --- | --- | --- | --- |
| **PAS-004** | [PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) | Enterprise knowledge | `@afenda/enterprise-knowledge` | MVP Authority (charter) | B24 (superseded by 004A) |
| **PAS-004A** | [PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) | Enterprise knowledge | `@afenda/enterprise-knowledge` | Production Candidate | B24–B32 closed |
| **PAS-004B** | [PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) | Enterprise knowledge | `@afenda/enterprise-knowledge` | Enterprise Accepted | B33–B37 closed |
| **PAS-004C** | [PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md](PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) | Enterprise knowledge | `@afenda/enterprise-knowledge` | Production Candidate | B38–B48 closed |
| **PAS-004D** | [PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md](PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md) | Enterprise knowledge | `@afenda/enterprise-knowledge` | Proposed | B49–B54 |

**Agent skill:** `enterprise-knowledge` · `.cursor/skills/enterprise-knowledge/SKILL.md`

**Representation:** [`glossary.md`](glossary.md) — synced human view; registry wins · `pnpm check:glossary-knowledge-sync`

---

## Agent read order

```text
1. Enterprise Knowledge North Star §1–§12 (scope dispute only)
2. Enterprise Knowledge Blueprint §4 · §5.1 · §5.2
3. This README — pick PAS by rollout phase
4. Composed PAS §0 (always)
5. [Slice catalog](SLICE/enterprise-knowledge-slice-catalog.md) — build order / closure
6. Individual handoff: SLICE/b<N>-*.md → /afenda-coding-session Phase 0
```

| Work type | Start here |
| --- | --- |
| Constitutional charter · technology-free §1–§4 | PAS-004 §0 |
| JSON authority · corpus · glossary parity | PAS-004A §0 |
| Kernel mapping · consumer proof · EA attestation | PAS-004B §0 |
| Semantic model · consumer projections | PAS-004C §0 |
| Mirror sync · legacy retirement · corpus depth | PAS-004D §0 |

---

## Hard stops (family-wide)

- Glossary is a **representation** — Knowledge Atoms in `atoms.json` are SSOT.
- Do not store atoms in `@afenda/architecture-authority` or `@afenda/kernel`.
- Promote vocabulary from Domain NS §3 via SYNC — do not invent atoms without NS row.
- PKGR04 disposition edits → `foundation-registry-owner` only.

---

## Maintenance

| Event | Update |
| --- | --- |
| New §4 capability (Domain NS) | Domain NS → Blueprint → PAS amendment → SLICE handoff |
| Slice close | [SLICE/enterprise-knowledge-slice-catalog.md](SLICE/enterprise-knowledge-slice-catalog.md) · [pas-status-index.md](../pas-status-index.md) · PAS §12 |
| SKILL regen | `.cursor/skills/enterprise-knowledge/SKILL.md` (SYNC intent) |
| Platform inventory | [Platform Blueprint](../../BLUEPRINT/kernel-blueprint.md) — Knowledge family |

**Redirect tombstones:** [PAS-004](../PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) · [PAS-004A](../PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) · [PAS-004B](../PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) · [PAS-004C](../PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) · [PAS-004D](../PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md) — backwards-compatible links at `docs/PAS/` root.
