# Layer Registry

| Field | Value |
|-------|-------|
| **Status** | Baseline — Pending Sign-off |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **TIP** | TIP-001A — Architecture Baseline Discovery |
| **Fingerprint** | `ARCH-BASELINE-2026-06-20-v1` |
| **Invariant** | ARCH-002 — every package belongs to exactly one layer |

Validation at baseline is against the **proposed model** pending ADR-0002 acceptance.

---

## ADR Traceability

| Rule | Future ADR |
|------|------------|
| Layer model | ADR-0002 |
| Dependency governance | ADR-0003 |
| Ownership governance | ADR-0004 |
| Exception governance | ADR-0005 |
| Package lifecycle | ADR-0006 |

---

## Layer Model

Eight architectural layers. Each layer defines **responsibility**, **owner**, and **rank** (orientation only).

| Rank | Layer | Owns | Owner domain |
|------|-------|------|--------------|
| 1 | **Platform** | Platform truth — data, identity, permissions, observability, governance | Platform Authority / Architecture Authority |
| 2 | **Design** | Visual truth — tokens, primitives, UI contracts | Design Authority |
| 2 | **Foundation** | Shared infrastructure — kernel, storage, execution | Platform Authority |
| 3 | **Metadata** | Rendering truth — metadata-driven UI | Metadata Authority |
| 3 | **Integration** | Cross-cutting integration — entitlements, flags, test utilities | Platform Authority |
| 4 | **ERPSpine** | ERP operating shell — navigation, layout, command center | ERP Spine Authority |
| 5 | **Domain** | Business truth — accounting, inventory, HRM, CRM, procurement | Domain Authority |
| 6 | **Application** | Delivery surfaces — deployable apps | Application Authority |

### Rank vs dependency legality

Rank numbers orient layers from fundamental (1) to delivery (6). **Dependency legality is determined by the Allowed Cross-Layer Dependency Matrix below, not by rank number alone.**

Examples resolved by the matrix (not rank):

- `Foundation → Design` — **Forbidden** (Foundation may depend only on Platform)
- `Integration → Metadata` — **Forbidden** (Integration may depend only on Foundation and Platform)
- `Metadata → Design` — **Allowed** (Metadata may depend on Design and Platform)

Same-rank layers (e.g. Design and Foundation both at rank 2) do not imply cross-layer permission. Always consult the matrix and Same-Layer Dependency Rules.

---

## Package Layer Assignments (active — 21)

| Package | Layer | Rank |
|---------|-------|------|
| `@afenda/architecture-authority` | Platform | 1 |
| `@afenda/ai-governance` | Platform | 1 |
| `@afenda/auth` | Platform | 1 |
| `@afenda/database` | Platform | 1 |
| `@afenda/kernel` | Platform | 1 |
| `@afenda/observability` | Platform | 1 |
| `@afenda/permissions` | Platform | 1 |
| `@afenda/typescript-config` | Platform (tooling) | 1 — exempt from layer-dep enforcement |
| `@afenda/design-system` | Design | 2 |
| `@afenda/ui` | Design | 2 |
| `@afenda/execution` | Foundation | 2 |
| `@afenda/storage` | Foundation | 2 |
| `@afenda/metadata` | Metadata | 3 |
| `@afenda/metadata-ui` | Metadata | 3 |
| `@afenda/entitlements` | Integration | 3 |
| `@afenda/feature-flags` | Integration | 3 |
| `@afenda/testing` | Integration | 3 |
| `@afenda/appshell` | ERPSpine | 4 |
| `@afenda/erp` | Application | 6 |
| `@afenda/docs` | Application | 6 |
| `@afenda/storybook` | Application | 6 |

---

## Allowed Cross-Layer Dependencies

Authoritative matrix for TIP-001D `validateForbiddenDependencies()`.

```text
Application     → ERPSpine, Domain, Metadata, Integration, Foundation, Design, Platform
Domain          → Metadata, Integration, Foundation, Design, Platform
ERPSpine        → Metadata, Integration, Foundation, Design, Platform
Metadata        → Design, Platform
Integration     → Foundation, Platform
Foundation      → Platform
Design          → Platform
Platform        → (none — leaf authority)
```

---

## Forbidden Cross-Layer Dependencies

| From | To | Rule |
|------|-----|------|
| Foundation | Domain | ARCH-008 — foundation may not depend on domains |
| Foundation | Design, Metadata, Integration, ERPSpine, Application | Upward / lateral cross-layer |
| Design | Domain, Application, Metadata, Integration, ERPSpine | Design System must not depend on ERP modules |
| Metadata | Domain | Metadata must not depend on business domains |
| Integration | Design, Metadata, Domain, ERPSpine, Application | Integration depends only on Foundation and Platform |
| Platform | Application, Domain, ERPSpine, Metadata, Integration, Design, Foundation | Platform is leaf authority |
| Domain | Application, ERPSpine | Domains must not depend on apps or spine |
| Any lower layer | Any higher layer | ARCH-005 — no upward dependencies |

---

## Same-Layer Dependency Rules

Same-layer runtime dependencies are **not** automatically permitted. Each layer has explicit rules to prevent platform ball-of-mud drift.

| Layer | Same-layer rule |
|-------|-----------------|
| **Platform** | Allowed but must remain acyclic (`auth` → `database` → `observability` is valid; cycles are not) |
| **Foundation** | Allowed but must remain acyclic |
| **Design** | Prefer dependency-free; same-layer edges require ADR approval |
| **Metadata** | Single package at baseline; future packages require ADR for same-layer deps |
| **Integration** | Allowed through published package contracts only; no private cross-imports |
| **ERPSpine** | Prefer dependency-free; exceptions require ADR |
| **Domain** | **Forbidden between domains** unless ADR approved (see Domain Layer Governance) |
| **Application** | **Forbidden between apps** unless ADR approved |

---

## Domain Layer Governance (reserved)

No domain packages exist at baseline. The following structure is reserved for TIP-013+:

```text
Domain
├─ Accounting      (@afenda/accounting)
├─ HRM             (@afenda/hrm)
├─ CRM             (@afenda/crm)
├─ Inventory       (@afenda/inventory)
└─ Procurement     (@afenda/procurement)
```

**Inter-domain dependencies require ADR approval.** Accounting must not freely depend on HRM, Inventory, or CRM without an documented exception (ADR-0005).

Domain packages may depend on Metadata, Integration, Foundation, Design, and Platform per the cross-layer matrix. They may not depend on Application or ERPSpine.

---

## Layer Evolution Policy

A new layer may only be introduced through an **Accepted ADR**.

A package may not move layers without:

1. ADR approval documenting rationale and impact
2. Dependency impact assessment (consumer and provider edges)
3. Ownership sign-off from both source and target owner domains
4. Registry updates (`package-registry.md`, `layer-registry.md`, `dependency-registry.md`)
5. Fingerprint bump on the baseline report

Casual layer moves (e.g. *"move metadata-ui into Foundation"*, *"move permissions into Domain"*) are **prohibited** without the above process.

---

## Baseline Layer Violations

| Violation | Package | Detail |
|-----------|---------|--------|
| *(none)* | — | No violations detected against the proposed layering model pending ADR approval |

---

## Acceptance

- [x] 100% active packages assigned to exactly one layer (18/18)
- [x] 0 active packages with no layer
- [x] 0 active packages with multiple layers
- [x] 0 layer-rule violations against proposed model
- [x] Planned package layer documented separately
- [x] Same-layer dependency rules documented
- [x] Domain inter-domain rule established before domains exist
- [x] Rank vs matrix legality clarified
- [x] Layer evolution policy documented
- [x] ADR traceability mapped
- [ ] Baseline signed off by Architecture Authority
