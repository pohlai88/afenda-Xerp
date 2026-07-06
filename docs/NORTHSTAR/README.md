# Domain North Star Index

Canonical **domain-scoped** North Star documents reverse-engineered from accepted PAS families. These sit between the [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md), the [Platform North Star](../architecture/afenda-platform-north-star.md), and the [Platform Architecture Blueprint](../architecture/afenda-architecture-blueprint.md).

## Platform domain North Stars

Five constitutional platform domains — orthogonal concerns with minimal overlap:

| Domain | North Star | Constitutional question | PAS family | Maturity |
| --- | --- | --- | --- | --- |
| Platform Kernel | [kernel-north-star.md](kernel-north-star.md) | *How does the platform communicate?* | PAS-001 · PAS-001A · PAS-001B | Enterprise Accepted |
| Platform Architecture Authority | [architecture-authority-north-star.md](architecture-authority-north-star.md) | *What is allowed?* | PAS-002 · PAS-002A | Enterprise Accepted |
| Enterprise Knowledge | [enterprise-knowledge-north-star.md](enterprise-knowledge-north-star.md) | *How does truth become accepted?* | PAS-004 · PAS-004A–004D | Production Candidate (9.95/10) |
| Accounting Standards Authority | [accounting-standards-north-star.md](accounting-standards-north-star.md) | *Which external accounting authority applies?* | PAS-003 | Production Candidate (9.8/10) |
| ERP Presentation | [shadcn-studio-presentation-north-star.md](shadcn-studio-presentation-north-star.md) | *How does ERP visual identity stay consistent?* | PAS-006 · PAS-006A–006D | Active — PAS-005 retired (ADR-0027) |

**Note:** PAS-005 CSS Authority is **retired for ERP** (ADR-0027). [css-authority-north-star.md](css-authority-north-star.md) redirects to Presentation North Star; Blueprint box uses **PAS-006** / `@afenda/shadcn-studio` as today's primary web representation.

## Presentation-adjunct North Stars

Scoped lab doctrine under [ERP Presentation North Star](shadcn-studio-presentation-north-star.md) — not separate constitutional domains.

| Concern | North Star | Constitutional question | Authority | Maturity |
| --- | --- | --- | --- | --- |
| Developer Route Lab | [developer-sandbox-north-star.md](developer-sandbox-north-star.md) | *How do we prototype full operator surfaces before ERP auth and spine wiring?* | [ADR-0039](../adr/ADR-0039-developer-presentation-sandbox.md) · [PAS-006E](../PAS/PRESENTATION/PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md) | P06-013 docs Delivered · app Planned |

**Read order — Route lab:** Presentation North Star §3 (Block lab vs Route lab) → developer-sandbox North Star → [developer-sandbox Blueprint](../BLUEPRINT/developer-sandbox-blueprint.md) → PAS-006E → P06-014+ handoffs.

## Cross-cutting platform North Stars

HTTP contract governance spans Kernel integration spine, Platform API Contract family, Architecture Authority disposition, and ERP runtime wiring — it is **not** a sixth constitutional domain orthogonal to the five rows above. It is indexed here as a **cross-cutting integration North Star** so discovery order stays explicit without diluting domain boundaries.

| Concern | North Star | Constitutional question | Authority | Blueprint / template | Maturity |
| --- | --- | --- | --- | --- | --- |
| Platform API Contract | [api-contract-north-star.md](api-contract-north-star.md) | *How does the platform expose governed, auditable API contracts across styles?* | [ADR-0030](../adr/ADR-0030-erp-rest-api-contract-standard.md) | [api-contract-blueprint.md](../BLUEPRINT/api-contract-blueprint.md) | Enterprise **10 / 10** |
| ERP Runtime Module Foundation | [erp-module-runtime-north-star.md](erp-module-runtime-north-star.md) | *How does every line-of-business capability enter production with provable authority, ownership alignment, and integration discipline?* | [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) | [Blueprint](../BLUEPRINT/erp-module-runtime-blueprint.md) · [template](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) | Production Candidate **9.2/10** |
| Full-Stack Integration | [full-stack-integration-north-star.md](full-stack-integration-north-star.md) | *How does the platform keep frontend, API, domain, and UI configuration aligned and materialized?* | FSI track · [pas-status-index § FSI](../PAS/pas-status-index.md) | [full-stack-integration-blueprint.md](../BLUEPRINT/full-stack-integration-blueprint.md) | Active — FSI-S10 delivered |

**Read order — Full-Stack Integration:** after Platform Kernel and sibling cross-cutting NS when touching registry materialization, lab promotion, or Integration Map dashboard.

**Read order — API Contract:** after Platform Kernel North Star when touching API exposure, internal v1 REST, OpenAPI publication, or PAS-API-REST-001 R3 slices.

**Read order — Module Foundation:** after Platform Kernel North Star and ERP Integration Spine doctrine when scaffolding LoB module runtime, readiness attestation, or `packages/features/erp-modules/src/{module-slug}/` foundation slices. Procurement (`KV-PROC`) is the reference exemplar.

## Line-of-business domain North Stars

LoB business meaning — orthogonal to module foundation delivery:

| Domain | North Star | Constitutional question | Maturity |
| --- | --- | --- | --- |
| Procurement | [procurement-north-star.md](procurement-north-star.md) | *How does Afenda govern requisitioning, sourcing, ordering, and supplier accountability?* | Production Candidate (draft) · runtime blocked |

**Read order — Procurement:** after Module Foundation NS when touching PO/requisition/supplier business meaning; pair with [gap report](../PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md).

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

**Last updated:** 2026-07-02
