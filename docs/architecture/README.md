# Architecture Documentation

**Constitution entry point for TIP-001 — Architecture Authority.**

Human-readable architecture governance for the Afenda ERP platform. These documents are the **approved source of truth** that precede the machine-readable `@afenda/architecture-authority` package.

---

## Source-of-Truth Flow

```text
docs/architecture/              ← human truth (this directory)
        ↓
docs/adr/                       ← constitutional decisions
        ↓
packages/architecture-authority ← machine contracts + validators (TIP-001C+)
        ↓
CI quality gates                ← automated enforcement (TIP-001E+)
```

Governance hierarchy:

```text
Documentation  >  Decisions  >  Code  >  Enforcement
```

This order prevents AI-generated architecture drift.

---

## Constitutional Hierarchy

When artifacts disagree, authority resolves in this order (highest wins):

```text
ADR
  >
Registry (docs/architecture/)
  >
Machine Contract (packages/architecture-authority)
  >
Validator (TIP-001D)
  >
CI Gate (TIP-001E)
```

Example: if a validator permits an edge but ADR-0003 forbids it, **ADR wins**. Update the validator and registry; do not override the ADR informally.

---

## Core Principle

**Docs lead; code enforces.**

```text
Registry change first
    ↓
ADR approval
    ↓
Implementation
```

Never: implementation first, documentation later. This principle is normative in ADR-0000.

---

## Governance Scope

**Architecture Authority governs:**

- Package creation, ownership, layers, dependencies, lifecycle
- Architecture exceptions (ADR-0005)
- Registry-first architecture (unlisted packages prohibited at enforcement)
- Layer evolution and ownership transfer

**Architecture Authority does not govern:**

- ERP business rules
- UI implementation details
- Feature implementation
- Domain behavior (domain authorities own business truth at TIP-013+)

---

## Registry Files

| Document | Purpose |
|----------|---------|
| [`architecture-authority-baseline.md`](architecture-authority-baseline.md) | **Architecture Baseline Report** — fingerprint `ARCH-BASELINE-2026-06-20-v1` |
| [`package-registry.md`](package-registry.md) | Every workspace package (PKG-001–018, PKG-R01–R05) |
| [`ownership-registry.md`](ownership-registry.md) | Single owner, rights, escalation |
| [`dependency-registry.md`](dependency-registry.md) | Approved runtime dependencies |
| [`layer-registry.md`](layer-registry.md) | Layer assignments and cross-layer rules |
| [`package-lifecycle.md`](package-lifecycle.md) | Birth, merge, split, deprecate, retire, restore |

---

## Rules

| Rule | Reference |
|------|-----------|
| No package may exist without ownership | ARCH-001 |
| No dependency may exist without approval | ARCH-003 |
| No package lifecycle change without ADR | ARCH-009 |
| No exception may exist without expiry | ADR-0005 |
| Docs lead; code enforces | ADR-0000 |
| Unlisted packages prohibited at enforcement | TIP-001E |

---

## TIP-001 Sub-deliverables

| TIP | Deliverable | Status |
|-----|-------------|--------|
| TIP-001A | Architecture Baseline Discovery | **COMPLETE** |
| TIP-001B | ADR Constitution (ADR-0000–0006) | **COMPLETE** |
| TIP-001C | Authority Package | **COMPLETE** |
| TIP-001D | Validation Engine | **COMPLETE** |
| TIP-001E | CI Integration | **COMPLETE** |
| TIP-001F | Reporting & Drift | **COMPLETE** |
| TIP-001G | Package Lifecycle Governance | **COMPLETE** |
| TIP-001 | Closeout | **COMPLETE** |

### Constitutional readiness

| Area | Status |
|------|--------|
| Package Registry | Ready |
| Dependency Registry | Ready |
| Layer Registry | Ready |
| Lifecycle Governance | Ready |
| Ownership Registry | Ready |
| ADR Constitution | Ready (ADR-0000–0006 Accepted) |
| Machine Enforcement | **Active** — `quality:architecture`, `quality:architecture-drift` |

---

## TIP-001C — Six First-Class Contracts

Do **not** build one monolithic `ArchitectureMap`. Model each registry as a separate contract. Validators compose; they do not monolith.

```text
ArchitectureAuthority
    ├── PackageContract      ← package-registry.md
    ├── OwnershipContract    ← ownership-registry.md
    ├── LayerContract        ← layer-registry.md
    ├── DependencyContract   ← dependency-registry.md
    ├── LifecycleContract    ← package-lifecycle.md
    └── ExceptionContract    ← ADR-0005; not nested inside Dependency
```

Example validators (TIP-001D):

```text
validateRegistry()      → PackageContract
validateOwnership()     → OwnershipContract
validateLayers()        → LayerContract
validateDependencies()  → DependencyContract
validateLifecycle()     → LifecycleContract
validateExceptions()    → ExceptionContract
```

`ExceptionContract` is first-class because exceptions may cover ownership, layer, dependency, or lifecycle — not only dependencies.

Scales from 17 packages today to 50–100+ without a single giant object.

---

## ADR Constitution (TIP-001B)

| ADR | Title |
|-----|-------|
| [ADR-0000](../adr/ADR-0000-architecture-constitution.md) | Architecture Constitution |
| [ADR-0001](../adr/ADR-0001-phase-1-foundation-redefinition.md) | Phase 1 Foundation Redefinition |
| [ADR-0002](../adr/ADR-0002-layer-governance.md) | Layer Governance |
| [ADR-0003](../adr/ADR-0003-dependency-governance.md) | Dependency Governance |
| [ADR-0004](../adr/ADR-0004-ownership-governance.md) | Ownership Governance |
| [ADR-0005](../adr/ADR-0005-exception-governance.md) | Exception Governance |
| [ADR-0006](../adr/ADR-0006-package-lifecycle-governance.md) | Package Lifecycle Governance |

ADR-0000 through ADR-0006 are **Accepted**. `@afenda/architecture-authority` is implemented and enforced in CI.

See [`docs/adr/README.md`](../adr/README.md).
