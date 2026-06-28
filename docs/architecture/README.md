# Architecture Documentation

**Constitution entry point for Foundation phase 01 — Architecture Authority.**

Parent index: [`docs/README.md`](../README.md)

Human-readable architecture governance for the Afenda ERP platform. These documents are the **approved source of truth** that precede the machine-readable `@afenda/architecture-authority` package.

Package implementation handoffs live in [`docs/PAS/`](../PAS/README.md) — not in this directory.

---

## Source-of-Truth Flow

**Discovery / lifecycle order** ([ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md)):

```text
afenda-platform-north-star.md   ← platform why + capability expectations
        ↓
afenda-architecture-blueprint.md ← package/domain decomposition (discover PAS from here)
        ↓
docs/adr/                       ← cross-cutting decisions (optional per package)
        ↓
docs/PAS/                       ← package authority standards + slice handoffs
        ↓
Code
```

**Conflict resolution** (when artifacts disagree):

```text
ADR  >  Foundation Disposition Registry  >  docs/PAS/  >  docs/architecture/*-registry.md  >  packages/architecture-authority  >  CI gates
```

North Star and Architecture Blueprint are **intent context** — they do not override ADRs or registries.

**Machine enforcement chain:**

```text
docs/architecture/*-registry.md  →  packages/architecture-authority  →  CI quality gates
```

---

## AI agents — read in this order

1. [`afenda-platform-north-star.md`](afenda-platform-north-star.md) — platform why + capability expectations (ADR-0026)
2. [`afenda-architecture-blueprint.md`](afenda-architecture-blueprint.md) — discover packages/domains before PAS
3. [`../PAS/README.md`](../PAS/README.md) — PAS index and canonical location rules
4. [`foundation-delivery-authority.md`](foundation-delivery-authority.md) — PAS workflow (ADR-0014)
5. [`foundation-disposition.md`](foundation-disposition.md) — registry human view + lanes
6. [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) — runtime evidence (ADR-0009)
7. [`package-registry.md`](package-registry.md) — PKG-* inventory (machine census)
8. [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) — Phases 0–9 historical gate record (complete)
9. [`_afenda-erp-master-plan.llms.md`](_afenda-erp-master-plan.llms.md) v5 — roadmap and LLM rules only (not vision authority)
10. ADR-0009–0015 (Accepted) · [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md)

---

## Document index

| Document | Purpose |
|----------|---------|
| [`afenda-platform-north-star.md`](afenda-platform-north-star.md) | Platform why + capability expectations (ADR-0026) |
| [`afenda-architecture-blueprint.md`](afenda-architecture-blueprint.md) | Package/domain decomposition — discover PAS from here |
| [`foundation-delivery-authority.md`](foundation-delivery-authority.md) | PAS implementation workflow |
| [`foundation-disposition.md`](foundation-disposition.md) | Read-only disposition registry view |
| [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) | Evidence-backed foundation status |
| [`afenda-documentation-drift-audit.md`](afenda-documentation-drift-audit.md) | 2026-06-24 drift audit (historical) |
| [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) | Phase 0–9 gate record — do not extend |
| [`_afenda-erp-master-plan.llms.md`](_afenda-erp-master-plan.llms.md) | LLM roadmap and operating rules (vision → North Star) |
| [`glossary.md`](glossary.md) | Canonical multi-tenancy vocabulary |
| [`multi-tenancy.md`](multi-tenancy.md) | Operating-context implementation guide + gate evidence |
| [`phase-9-accounting-readiness-sign-off.md`](phase-9-accounting-readiness-sign-off.md) | Accounting readiness gate sign-off |
| [`authentication-ecosystem.md`](authentication-ecosystem.md) | Auth routes, lanes, shell ownership |
| [`docs-app-architecture.md`](docs-app-architecture.md) | `@afenda/docs` boundaries |
| [`css-authority.md`](css-authority.md) | CSS ownership and import rules |
| [`app-ui-component-adaptation-guide.md`](app-ui-component-adaptation-guide.md) | shadcn/studio promotion (ADR-0017) |
| [`afenda-rest-api-governance.md`](afenda-rest-api-governance.md) | Internal REST/OpenAPI governance |
| [`monorepo-feature-inventory.md`](monorepo-feature-inventory.md) | Apps, routes, packages — gap inventory |
| [`identity/`](identity/canonical-enterprise-id-constitution.md) | Enterprise ID constitution (ADR-0021–0023; PAS-001 companion) |

**Enforcement:** `pnpm check:documentation-drift` · `pnpm check:foundation-disposition` · `pnpm quality:architecture`

**Retired (2026-06-27):** `foundation-phase-delivery-tip-proposal.md`, `repo-housekeeping-inventory.md`, `fumadocs-feature-gap-audit.md` — removed; legacy ARCH/delivery trees superseded by PAS.

---

## Registry files

| Document | Purpose |
|----------|---------|
| [`architecture-authority-baseline.md`](architecture-authority-baseline.md) | Architecture baseline report + fingerprint |
| [`package-registry.md`](package-registry.md) | Workspace package inventory |
| [`ownership-registry.md`](ownership-registry.md) | Single owner, rights, escalation |
| [`dependency-registry.md`](dependency-registry.md) | Approved runtime dependencies |
| [`layer-registry.md`](layer-registry.md) | Layer assignments and cross-layer rules |
| [`package-lifecycle.md`](package-lifecycle.md) | Birth, merge, split, deprecate, retire |
| [`dependency-snapshot.json`](dependency-snapshot.json) | Machine fingerprint sync |

Regenerate architecture report JSON: `pnpm architecture:report` → `architecture-report.json` (generated output).

---

## ADR constitution (Foundation phase 01)

| ADR | Title |
|-----|-------|
| [ADR-0000](../adr/ADR-0000-architecture-constitution.md) | Architecture Constitution |
| [ADR-0001](../adr/ADR-0001-phase-1-foundation-redefinition.md) | Phase 1 Foundation Redefinition |
| [ADR-0002](../adr/ADR-0002-layer-governance.md) | Layer Governance |
| [ADR-0003](../adr/ADR-0003-dependency-governance.md) | Dependency Governance |
| [ADR-0004](../adr/ADR-0004-ownership-governance.md) | Ownership Governance |
| [ADR-0005](../adr/ADR-0005-exception-governance.md) | Exception Governance |
| [ADR-0006](../adr/ADR-0006-package-lifecycle-governance.md) | Package Lifecycle Governance |

See [`docs/adr/README.md`](../adr/README.md) for the full ADR index.

---

## Foundation phase 01 — six first-class contracts

```text
ArchitectureAuthority
    ├── PackageContract      ← package-registry.md
    ├── OwnershipContract    ← ownership-registry.md
    ├── LayerContract        ← layer-registry.md
    ├── DependencyContract   ← dependency-registry.md
    ├── LifecycleContract    ← package-lifecycle.md
    └── ExceptionContract    ← ADR-0005
```
