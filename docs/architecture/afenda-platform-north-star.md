# Afenda Platform North Star

| Field | Value |
| --- | --- |
| **Document class** | `platform_north_star` |
| **Authority** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Canonical location** | `docs/architecture/afenda-platform-north-star.md` |
| **Distinct from** | Per-PAS `§1 North Star` (package-scoped intent inside each PAS) |
| **Does not confer** | Package boundaries, registry rows, or implementation authority |

> **One sentence:** Afenda is a governed, multi-tenant enterprise ERP platform where documentation leads, machines enforce, and every contested business meaning has a traceable acceptance chain — built for AI-assisted delivery without architectural entropy.

---

## What Afenda is

Afenda is an enterprise resource planning platform for organizations that operate across legal entities, currencies, and regulatory contexts. It is designed for **governed, evidence-backed implementation** — especially with AI agents — so that platform truth (identity, permissions, knowledge, standards, UI, and domain behavior) remains coherent as the system grows.

Afenda is not a collection of apps and packages. It is a **layered platform** where each package owns a narrow authority surface, consumers import meaning instead of re-deriving it, and platform delivery is accepted only when the relevant PAS slice, gates, and runtime evidence agree — not when informal documentation exists.

---

## Agent execution rule

A coding agent must read documents in this order:

1. `afenda-platform-north-star.md`
2. `afenda-architecture-blueprint.md`
3. Relevant ADRs only when cited by the Blueprint or PAS
4. Target PAS
5. Target PAS slice

The agent must not create packages, consumers, PAS documents, or runtime code unless the package/domain authority is declared in the Blueprint and permitted by PAS maturity.

---

## Documentation doctrine

| Layer | Owns |
| --- | --- |
| **North Star** | WHY |
| **Architecture Blueprint** | WHAT EXISTS |
| **ADR** | WHY a major architecture decision was chosen |
| **PAS** | Package authority and slices |
| **Code** | Implements only the approved PAS slice |

No document may duplicate the authority of the document above or below it.

---

## Enterprise philosophy

These principles are platform-level. They apply before any single PAS or feature.

1. **Docs lead; code enforces** — Registry and PAS changes precede implementation; CI gates prove alignment ([ADR-0000](../adr/ADR-0000-architecture-constitution.md)).
2. **Knowledge is a governed asset** — Authoritative meaning comes from acceptance, evidence, and traceable evolution ([PAS-004](../PAS/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md)), not from wikis or ad hoc labels.
3. **Registry-first architecture** — Every workspace package is declared, layered, owned, and dependency-bound before it ships ([PAS-002](../PAS/PAS-002-ARCHITECTURE-AUTHORITY.md)).
4. **Evidence-backed status** — "Complete" requires file, test, or gate proof ([ADR-0012](../adr/ADR-0012-documentation-evidence-backed.md)); aspiration is not authority.
5. **Honesty over aspiration** — Maturity labels, lifecycle states, and runtime status must not overstate delivery.
6. **Serialized slices** — Large packages close through ordered PAS slices with gates, not big-bang refactors.
7. **AI as implementer, not architect** — Agents execute from PAS and Blueprint; they do not invent package ecosystems.

---

## Capability expectations

What the **platform** is expected to present to operators, finance teams, and implementers — durable outcomes, not a feature backlog.

| Capability area | Platform expectation |
| --- | --- |
| **Identity & tenancy** | Every action runs in a resolved operating context (tenant, company, scope) with canonical enterprise IDs and auditable actor resolution. |
| **Authorization** | Permissions are centralized, scope-aware, and never redefined in consumer packages. |
| **Enterprise knowledge** | Contested terms and invariants have discoverable Knowledge Atoms with acceptance chains consumable by UI, docs, and agents. |
| **Financial standards** | IFRS/MFRS/SFRS/GAAP references are versioned, cited, and available as deterministic validation before sensitive accounting workflows — not as hidden judgment. |
| **Accounting & group reporting** | Journal posting, consolidation, intercompany, tax, and management reporting are **separate authorities** that compose — not one monolithic "accounting module." |
| **Master data & domains** | Inventory, procurement, HRM, CRM, and future domains each own their runtime while sharing kernel vocabulary and platform services. |
| **Metadata-driven UX** | Business surfaces are composed from metadata authority and governed UI primitives — not one-off screens per module. |
| **Observability & audit** | Governed mutations emit structured audit evidence; diagnostics are correlation-safe. |
| **Design & presentation** | Visual truth flows from CSS authority and governed UI; consumers do not fork tokens or primitives locally. |
| **Delivery surfaces** | ERP, docs, and Storybook are applications that **consume** platform authority — they do not own domain rules. |

These expectations inform the [Architecture Blueprint](afenda-architecture-blueprint.md). Each row eventually maps to one or more packages and PAS documents.

---

## Long-term direction

- **Foundation-first ERP** — Platform, kernel, knowledge, standards, metadata, and shell stabilize before domain runtime expands (see ADR-0010 accounting gate).
- **Composable domain packages** — Business domains are separate packages with explicit boundaries, not folders inside `apps/erp`.
- **Standards-backed finance** — Regulatory and reporting standards are first-class authority packages, not comments in posting code.
- **Semantic platform** — Enterprise meaning, kernel wire shapes, and UI labels stay aligned through knowledge conformance gates.
- **AI-native governance** — Skills, PAS, registries, and gates exist so agents can implement safely at scale.

---

## Explicit non-goals

Afenda North Star is **not**:

- A product roadmap or sprint plan (see [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) and [`pas-status-index.md`](../PAS/pas-status-index.md))
- A package boundary specification (see Architecture Blueprint + PAS)
- A substitute for ADRs on cross-cutting decisions
- A tenant-specific or vertical-SaaS configuration catalog
- A promise that every capability row above is implemented today (see [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md))

---

## Authority note

| This document answers | This document does not answer |
| --- | --- |
| Why Afenda exists | Which package owns a specific contract |
| What the platform should feel like at maturity | How to implement a slice |
| Platform-wide first principles | Registry row values (machine registries) |
| Capability expectations across domains | Whether a gate passes today |

When North Star and a PAS §1 North Star differ in scope, **both apply** at their respective levels — platform vs package.

---

## Related documents

| Document | Relationship |
| --- | --- |
| [afenda-architecture-blueprint.md](afenda-architecture-blueprint.md) | What packages/domains exist and why |
| [docs/PAS/README.md](../PAS/README.md) | Per-package authority |
| [ADR-0000](../adr/ADR-0000-architecture-constitution.md) | Conflict-resolution hierarchy |
| [_afenda-erp-master-plan.llms.md](_afenda-erp-master-plan.llms.md) | Roadmap and LLM rules only (not vision authority) |
