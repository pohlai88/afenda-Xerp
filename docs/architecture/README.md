# Architecture Documentation

**Constitution entry point for TIP-001 — Architecture Authority.**

Parent index: [`docs/README.md`](../README.md)

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

## LLM development compass

**AI agents — read in this order:**

1. [`foundation-delivery-authority.md`](foundation-delivery-authority.md) — **FDR workflow** (ADR-0014) — foundation + package implementation
2. [`foundation-disposition.md`](foundation-disposition.md) — FDR human view + lane vocabulary
3. [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) — runtime evidence (ADR-0009)
4. [`package-registry.md`](package-registry.md) — PKG-* inventory
5. [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) — Phases 0–9 historical narrative (complete)
6. [`../delivery/tip-status-index.md`](../delivery/tip-status-index.md) — **TIP archive index** (historical evidence only)
7. [`_afenda-erp-master-plan.llms.md`](_afenda-erp-master-plan.llms.md) v5 — narrative compass
8. ADR-0009–0015 (Accepted)

| Document | Purpose |
|----------|---------|
| [`foundation-delivery-authority.md`](foundation-delivery-authority.md) | **Active implementation authority** — FDR workflow; supersedes new TIP handoffs for foundation/packages |
| [`foundation-disposition.md`](foundation-disposition.md) | Read-only FDR view synced from registry |
| [`_afenda-erp-master-plan.llms.md`](_afenda-erp-master-plan.llms.md) | **v5.0.0** — Strategic compass. Narrative only; ADRs and FDR win on conflict. |
| [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) | Phase 0–9 gate record (complete); maintain only |
| [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) | Evidence-backed status of all foundation areas (ADR-0009). |
| [`afenda-documentation-drift-audit.md`](afenda-documentation-drift-audit.md) | 2026-06-24 drift audit — authority chain refresh. |
| [`../delivery/tip-status-index.md`](../delivery/tip-status-index.md) | TIP **archive** — delivered evidence; not new work authority |
| [`foundation-phase-delivery-tip-proposal.md`](foundation-phase-delivery-tip-proposal.md) | **Obsolete** — do not implement |
| [`glossary.md`](glossary.md) | Canonical vocabulary — tenant, company, entity group, ownership interest, workspace, etc. |
| [`multi-tenancy.md`](multi-tenancy.md) | Multi-tenancy operating-context implementation guide. |
| [`ARCH-AUTH-001-enterprise-authentication.md`](../ARCH/%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) | **Enterprise auth architecture** — PKG-002 final feature requirements, AC, DoD, UI block map · index: [`arch-status-index.md`](../ARCH/arch-status-index.md) |
| [`docs-app-architecture.md`](docs-app-architecture.md) | **`@afenda/docs`** — Fumadocs app boundaries, content model, isolation from ERP runtime (TIP-032). |

**Foundation ADRs (Accepted):** ADR-0009 Runtime Truth · ADR-0010 No Accounting Before Gate · ADR-0011 Multi-level Company Model · ADR-0012 Evidence-backed Docs · ADR-0013 TIP Roadmap (phase narrative; handoffs superseded by ADR-0014) · **ADR-0014 FDR** · ADR-0015 Accounting Contracts-Only

**Enforcement:** `pnpm check:documentation-drift` · `pnpm quality:documentation-drift` (in `pnpm quality`)

**Missing directories (recorded):** `docs/tip/`, `docs/roadmap/` do not exist. TIPs live in `docs/PAS/slice/[status] tip-*.md`.

---

## Registry Files

| Document | Purpose |
|----------|---------|
| [`architecture-authority-baseline.md`](architecture-authority-baseline.md) | **Architecture Baseline Report** — fingerprint `ARCH-BASELINE-2026-06-23-v2` |
| [`package-registry.md`](package-registry.md) | Every workspace package (PKG-001–020, PKG-R01–R05) — pairs with FDR entries |
| [`monorepo-feature-inventory.md`](monorepo-feature-inventory.md) | **Feature inventory + gap analysis** — apps, routes, packages, critical/essential gaps (validated against filesystem) |
| [`foundation-disposition.md`](foundation-disposition.md) | FDR read-only view (ADR-0014) |
| [`foundation-delivery-authority.md`](foundation-delivery-authority.md) | FDR implementation workflow |
| [`ownership-registry.md`](ownership-registry.md) | Single owner, rights, escalation |
| [`dependency-registry.md`](dependency-registry.md) | Approved runtime dependencies |
| [`layer-registry.md`](layer-registry.md) | Layer assignments and cross-layer rules |
| [`package-lifecycle.md`](package-lifecycle.md) | Birth, merge, split, deprecate, retire, restore |

Domain-specific architecture authorities live in [`../ARCH/`](../ARCH/README.md) (e.g. ARCH-AUTH-001 for `@afenda/auth`).

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
