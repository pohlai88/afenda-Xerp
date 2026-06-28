# ADR-0026 — Platform North Star and Architecture Blueprint

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-29 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |
| **Amends** | [ADR-0000](ADR-0000-architecture-constitution.md) §1 (constitutional hierarchy — discovery order) |

---

## Context

Afenda's Package Authority Standards (PAS) already contain package definition, boundaries, slice catalogs, implementation sequences, gates, and doctrine. No intermediate document is required between PAS and code.

However, PAS documents **standardize** packages — they must not **discover** them. Evidence: [PAS-003](../PAS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) lists consumers such as `@afenda/consolidation`, `@afenda/intercompany`, `@afenda/tax`, and `@afenda/finance` that do not appear in [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) or [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts). Agents and implementers therefore lack an authoritative forward-looking decomposition that explains **why** each package exists and **what capability** it presents before a PAS is authored.

Machine registries answer **what exists today** (census). They do not express platform-level **why**, planned domain decomposition, or capability intent. The master plan (`_afenda-erp-master-plan.llms.md`) mixed vision with delivery roadmap and is demoted to roadmap-only per this ADR.

ADR-0000 §7 requires an Accepted ADR to amend the authority hierarchy.

---

## Decision

### 1. Two distinct authority orders

**Conflict resolution** (unchanged — ADR supreme):

```text
ADR
  >
Foundation Disposition Registry
  >
docs/PAS/
  >
Package Registry (PKG-*)
  >
Runtime Truth Matrix
  >
pre-accounting-foundation-roadmap (historical)
  >
master plan narrative (roadmap only)
```

North Star and Architecture Blueprint are **intent and discovery context**. They never override an ADR, registry row, PAS boundary, or runtime evidence.

**Discovery / lifecycle order** (new):

```text
Platform North Star
  >
Architecture Blueprint
  >
ADR (optional — cross-cutting decisions only)
  >
PAS (per-package authority + §12 Slice Catalog)
  >
Slice (docs/PAS/slice/*.md — work order; Slice N of M declared per slice)
  >
Code
```

### 2. New canonical documents

| Document | Location | Role |
| --- | --- | --- |
| Platform North Star | [`afenda-platform-north-star.md`](../architecture/afenda-platform-north-star.md) | Root platform spec (§0–§15): platform **why**, boundary, authority surface catalog, PAS catalog, documentation rules, agent chain, templates index |
| Architecture Blueprint | [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) | Forward-looking package/domain decomposition + **why each exists** + total PAS count + PAS inventory table |

### 3. Blueprint rules

- Blueprint **references** machine registries ([`package-registry.md`](../architecture/package-registry.md), [`layer-registry.md`](../architecture/layer-registry.md), [`dependency-registry.md`](../architecture/dependency-registry.md), [`foundation-disposition.md`](../architecture/foundation-disposition.md)) — it must **not** duplicate registry rows (documentation-drift gates).
- Blueprint may declare **planned** packages/domains not yet in the package registry; promotion to PKG-* requires ADR + `foundation-registry-owner`.
- Every Blueprint box that becomes a governed package must eventually map to **one PAS**. PAS Slice Catalog (§12) remains inside PAS — no FDR or IPS layer is reintroduced.
- A PAS **Consumers** field may list only packages declared in the Blueprint (live or planned with explicit status).
- Blueprint metadata must declare `Total PAS at maturity`, `Live PAS today`, and `Planned PAS` counts. The **PAS Inventory** table in the Blueprint is updated on every new PAS and on every slice close.

### 4. ADR optional below Blueprint

Most packages do not require an ADR before PAS authoring. ADRs remain mandatory for cross-cutting constitutional changes, registry material changes, and gates such as ADR-0010 (accounting runtime block).

### 5. Master plan demotion

[`_afenda-erp-master-plan.llms.md`](../architecture/_afenda-erp-master-plan.llms.md) is **roadmap and LLM operating rules only**. Platform vision moves to Platform North Star; package/domain decomposition moves to Architecture Blueprint.

### 6. PAS discovery step

Before assigning a new `PAS-NNN`, the package or domain must appear in the Architecture Blueprint with status, layer, and capability rationale.

### 7. Agent execution rule

Coding agents must read in this order: **North Star §0 → Blueprint → cited ADRs → target PAS §0 → target Slice**. Agents must not create packages, consumers, PAS documents, or runtime code unless the authority is Blueprint-declared and PAS maturity permits.

Canonical text: [North Star §0](../architecture/afenda-platform-north-star.md#0-agent-quick-path) and [Blueprint § Agent execution rule](../architecture/afenda-architecture-blueprint.md#agent-execution-rule).

### 8. Documentation doctrine

| Layer | Owns |
| --- | --- |
| **North Star** | WHY — platform definition, authority surface catalog, documentation rules |
| **Architecture Blueprint** | WHAT EXISTS — packages, domains, feature map, total PAS count |
| **ADR** | WHY a major architectural decision was chosen |
| **PAS** | Feature specification — what to build, rules, slice catalog, acceptance criteria |
| **Slice** | Work order — build this one piece; declares `Slice N of M` position |
| **Code** | Implements the Slice; nothing more |

No document may duplicate the authority of the document above or below it. PAS creation requires the six-condition gate in Architecture Blueprint § PAS creation gate. Slice creation requires a PAS with a declared §12 Slice Catalog entry.

### 9. Reusable templates

Four fill-in templates exist to make the chain repeatable:

| Template | Location | Use when |
| --- | --- | --- |
| `north-star-template.md` | `.cursor/skills/kernel-authority/reference/north-star-template.md` | Authoring a domain-level North Star |
| `blueprint-template.md` | `.cursor/skills/kernel-authority/reference/blueprint-template.md` | Authoring or extending a Blueprint |
| `pas-doc-template.md` | `.cursor/skills/kernel-authority/reference/pas-doc-template.md` | Authoring any PAS |
| `pas-slice-template.md` | `.cursor/skills/kernel-authority/reference/pas-slice-template.md` | Authoring any Slice |

Template index: `.cursor/skills/kernel-authority/reference/pas-template.md`

---

## Consequences

### Positive

- PAS is discovered from declared decomposition — no phantom consumers
- Single platform North Star distinct from per-PAS §1 North Star
- Registries remain machine truth; Blueprint adds narrative WHY without drift duplication
- Lifecycle simplifies to North Star → Blueprint → PAS → Slice → Code
- Four reusable fill-in templates make the chain repeatable for any new domain or feature

### Negative / trade-offs

- Two new documents require maintenance when domain strategy changes
- Blueprint planned rows must be reconciled when packages are promoted or retired
- Existing PAS consumer lists may need Blueprint cross-reference updates

---

## Acceptance Gate

- [x] ADR-0026 status = Accepted
- [x] [`afenda-platform-north-star.md`](../architecture/afenda-platform-north-star.md) published (§0–§15 format)
- [x] [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) published (PAS Inventory table + Total PAS counts)
- [x] [`docs/architecture/README.md`](../architecture/README.md) reflects discovery order
- [x] [`docs/PAS/README.md`](../PAS/README.md) step 0 references Blueprint
- [x] [`foundation-delivery-authority.md`](../architecture/foundation-delivery-authority.md) notes discovery order
- [x] [`AGENTS.md`](../../AGENTS.md) read-order updated
- [x] Four reusable templates created (§9 above)
- [x] `pas-doc-template.md` upgraded with `Blueprint box` + `Total slices planned` + `Delivered slices` fields
- [x] `pas-slice-template.md` upgraded with `Slice N of M` position declaration
- [x] `pnpm check:documentation-drift` passes

---

## References

- [ADR-0000](ADR-0000-architecture-constitution.md) — Architecture Constitution
- [PAS-003](../PAS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) — phantom consumer evidence
- [foundation-delivery-authority.md](../architecture/foundation-delivery-authority.md)
- [docs/PAS/README.md](../PAS/README.md)
