# ADR-0002 — Layer Governance

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Packages must belong to exactly one architectural layer (ARCH-002). Cross-layer dependencies cause ERP decay when design, metadata, or foundation packages depend on domains or applications.

TIP-001A documented the layer model in [`layer-registry.md`](../architecture/layer-registry.md).

---

## Decision

1. **Eight layers** — Platform, Design, Foundation, Metadata, Integration, ERPSpine, Domain, Application — as defined in the layer registry.

2. **Dependency legality** is determined by the **Allowed Cross-Layer Dependency Matrix**, not rank numbers alone.

3. **Same-layer rules** apply per layer (Platform/Foundation acyclic; Design prefer dependency-free; Domain inter-domain forbidden without ADR).

4. **Layer evolution** — new layers and package layer moves require ADR, dependency impact assessment, and ownership sign-off.

5. **Machine enforcement** — `validateLayers()` and `validateForbiddenDependencies()` in TIP-001D consume `LayerContract`.

---

## Consequences

### Positive

- Validators can be generated directly from the matrix
- Metadata cannot own business rules; Design cannot depend on ERP modules

### Negative

- Layer disputes require Architecture Authority escalation

---

## Acceptance Gate

- [`layer-registry.md`](../architecture/layer-registry.md) aligned with this ADR
- Zero layer violations against proposed model at baseline
- `LayerContract` implemented in TIP-001C

---

## References

- [layer-registry.md](../architecture/layer-registry.md)
- [ADR-0000](ADR-0000-architecture-constitution.md)
