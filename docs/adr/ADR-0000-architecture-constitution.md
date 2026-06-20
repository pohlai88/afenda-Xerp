# ADR-0000 — Architecture Constitution

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Afenda ERP is developed with AI-assisted implementation. The largest project risk is architectural entropy — not coding quality. Without a written constitution, packages, dependencies, ownership, and layers drift as implementation precedes governance.

TIP-001A froze baseline reality in `docs/architecture/`. This ADR establishes the meta-rules that govern all other architecture ADRs and registries.

---

## Decision

### 1. Constitutional hierarchy

When artifacts disagree, authority resolves in order:

```text
ADR  >  Registry  >  Machine Contract  >  Validator  >  CI Gate
```

### 2. Core principle: docs lead; code enforces

```text
Registry change  →  ADR approval  →  Implementation  →  Enforcement
```

Implementation must not precede documented governance.

### 3. Registry-first architecture

Once TIP-001E is active, unlisted workspace packages are prohibited. Every package must appear in [`package-registry.md`](../architecture/package-registry.md).

### 4. Steady state vs change

| Governance | Governs |
|------------|---------|
| Ownership, layers, dependencies | What architecture **is** |
| Lifecycle | How architecture **evolves** |

### 5. Six first-class contracts (TIP-001C)

`@afenda/architecture-authority` shall implement separate contracts — not one monolithic map:

- `PackageContract`
- `OwnershipContract`
- `LayerContract`
- `DependencyContract`
- `LifecycleContract`
- `ExceptionContract`

Validators compose across contracts.

### 6. Governance scope

**In scope:** package creation, ownership, layers, dependencies, lifecycle, exceptions, registry evolution.

**Out of scope:** ERP business rules, UI implementation, feature logic, domain behavior.

### 7. Amendment process

Material changes to hierarchy, scope, or core principle require a new Accepted ADR amending ADR-0000.

---

## Consequences

### Positive

- Single entry point for architecture supremacy rules
- AI agents have explicit ordering: document before code
- Dispute resolution when validator and ADR conflict

### Negative

- Additional process before new packages and exceptions
- Registry maintenance overhead

---

## Acceptance Gate

- ADR-0000 status = Accepted
- [`docs/architecture/README.md`](../architecture/README.md) reflects hierarchy and scope
- TIP-001B ADR set (0001–0006) Accepted before TIP-001C begins

---

## References

- [docs/architecture/README.md](../architecture/README.md)
- [ADR-0001](ADR-0001-phase-1-foundation-redefinition.md) — Phase 1 Foundation Redefinition
