# Domain North Star Index

Canonical **domain-scoped** North Star documents reverse-engineered from accepted PAS families. These sit between the [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md), the [Platform North Star](../architecture/afenda-platform-north-star.md), and the [Architecture Blueprint](../architecture/afenda-architecture-blueprint.md).

## Platform domain North Stars

Five constitutional platform domains — orthogonal concerns with minimal overlap:

| Domain | North Star | Constitutional question | PAS family | Maturity |
| --- | --- | --- | --- | --- |
| Platform Kernel | [kernel-north-star.md](kernel-north-star.md) | *How does the platform communicate?* | PAS-001 · PAS-001A · PAS-001B | Enterprise Accepted |
| Platform Architecture Authority | [architecture-authority-north-star.md](architecture-authority-north-star.md) | *What is allowed?* | PAS-002 · PAS-002A | Enterprise Accepted |
| Enterprise Knowledge | [enterprise-knowledge-north-star.md](enterprise-knowledge-north-star.md) | *How does truth become accepted?* | PAS-004 · PAS-004A–004D | Production Candidate (9.95/10) |
| Accounting Standards Authority | [accounting-standards-north-star.md](accounting-standards-north-star.md) | *Which external accounting authority applies?* | PAS-003 | Production Candidate (9.8/10) |
| Design Token Authority | [css-authority-north-star.md](css-authority-north-star.md) | *How does visual identity stay consistent?* | PAS-005 · PAS-005A · PAS-005B | Production Candidate (9.6/10) |

**Note:** Design Token Authority North Star is technology-independent; Blueprint box remains **CSS authority** (PAS-005) as today's primary web representation.


## Constitutional law layers

| Document | Scope |
| --- | --- |
| [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) | Ten platform-wide laws (LAW 1–10) |
| [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) | Eight epistemology laws (K1–K8) + promotion pipeline |

## Read order

```text
Platform Constitutional Laws
        ↓
Knowledge Constitutional Laws (when touching meaning / glossary / atoms)
        ↓
Platform North Star
        ↓
Domain North Star (this directory) §1–§12
        ↓
Architecture Blueprint §4 box names
        ↓
PAS → Slice → Code
```

## Boundary rules

- §1–§12 in each North Star are **business-facing** — no package npm names, gate commands, or slice counts.
- §13 maps §4 capabilities to **Blueprint box names only**.
- PAS remains SSOT for contracts, surfaces, and gates.
- Recurring platform principles live in Constitutional Laws — cite, do not restate.
- **Promotion pipeline:** Domain NS §3 → Knowledge Atom → glossary/UI/AI — never reverse.

**Template authority:** `.cursor/skills/kernel-authority/reference/north-star-template.md` · **Boundary contract:** `.cursor/skills/kernel-authority/reference/doc-boundary-contract.md`

**Last updated:** 2026-06-29
