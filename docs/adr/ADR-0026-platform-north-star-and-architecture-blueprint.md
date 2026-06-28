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
PAS (per-package authority + Slice Catalog)
  >
Code
```

### 2. New canonical documents

| Document | Location | Role |
| --- | --- | --- |
| Platform North Star | [`afenda-platform-north-star.md`](../architecture/afenda-platform-north-star.md) | Platform **why** + capability expectations (not feature-level) |
| Architecture Blueprint | [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) | Forward-looking package/domain decomposition + **why each exists** |

### 3. Blueprint rules

- Blueprint **references** machine registries ([`package-registry.md`](../architecture/package-registry.md), [`layer-registry.md`](../architecture/layer-registry.md), [`dependency-registry.md`](../architecture/dependency-registry.md), [`foundation-disposition.md`](../architecture/foundation-disposition.md)) — it must **not** duplicate registry rows (documentation-drift gates).
- Blueprint may declare **planned** packages/domains not yet in the package registry; promotion to PKG-* requires ADR + `foundation-registry-owner`.
- Every Blueprint box that becomes a governed package must eventually map to **one PAS**. PAS Slice Catalog (§12) remains inside PAS — no FDR or IPS layer is reintroduced.
- A PAS **Consumers** field may list only packages declared in the Blueprint (live or planned with explicit status).

### 4. ADR optional below Blueprint

Most packages do not require an ADR before PAS authoring. ADRs remain mandatory for cross-cutting constitutional changes, registry material changes, and gates such as ADR-0010 (accounting runtime block).

### 5. Master plan demotion

[`_afenda-erp-master-plan.llms.md`](../architecture/_afenda-erp-master-plan.llms.md) is **roadmap and LLM operating rules only**. Platform vision moves to Platform North Star; package/domain decomposition moves to Architecture Blueprint.

### 6. PAS discovery step

Before assigning a new `PAS-NNN`, the package or domain must appear in the Architecture Blueprint with status, layer, and capability rationale.

### 7. Agent execution rule

Coding agents must read: North Star → Blueprint → cited ADRs → target PAS → target PAS slice. Agents must not create packages, consumers, PAS documents, or runtime code unless the authority is Blueprint-declared and PAS maturity permits. Canonical text: both architecture documents § Agent execution rule.

### 8. Documentation doctrine

| Layer | Owns |
| --- | --- |
| North Star | WHY |
| Architecture Blueprint | WHAT EXISTS |
| ADR | WHY a major architecture decision was chosen |
| PAS | Package authority and slices |
| Code | Approved PAS slice only |

No document may duplicate authority above or below it. PAS creation requires the six-condition gate in Architecture Blueprint § PAS creation gate.

---

## Consequences

### Positive

- PAS is discovered from declared decomposition — no phantom consumers
- Single platform North Star distinct from per-PAS §1 North Star
- Registries remain machine truth; Blueprint adds narrative WHY without drift duplication
- Lifecycle simplifies to North Star → Blueprint → PAS → Code

### Negative / trade-offs

- Two new documents require maintenance when domain strategy changes
- Blueprint planned rows must be reconciled when packages are promoted or retired
- Existing PAS consumer lists may need Blueprint cross-reference updates

---

## Acceptance Gate

- ADR-0026 status = Accepted
- [`afenda-platform-north-star.md`](../architecture/afenda-platform-north-star.md) published
- [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) published
- [`docs/architecture/README.md`](../architecture/README.md) reflects discovery order
- [`docs/PAS/README.md`](../PAS/README.md) step 0 references Blueprint
- [`foundation-delivery-authority.md`](../architecture/foundation-delivery-authority.md) notes discovery order
- [`AGENTS.md`](../../AGENTS.md) read-order updated
- `pnpm check:documentation-drift` passes

---

## References

- [ADR-0000](ADR-0000-architecture-constitution.md) — Architecture Constitution
- [PAS-003](../PAS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) — phantom consumer evidence
- [foundation-delivery-authority.md](../architecture/foundation-delivery-authority.md)
- [docs/PAS/README.md](../PAS/README.md)
