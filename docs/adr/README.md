# Architecture Decision Records (ADR)

Constitutional decisions for the Afenda ERP platform. ADRs sit between human registries and machine enforcement.

## Hierarchy

```text
ADR  >  Registry  >  Machine Contract  >  Validator  >  CI Gate
```

See [`docs/PAS/README.md`](../PAS/README.md).

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-0000](ADR-0000-architecture-constitution.md) | Architecture Constitution | Accepted |
| [ADR-0001](ADR-0001-phase-1-foundation-redefinition.md) | Phase 1 Foundation Redefinition | Accepted |
| [ADR-0002](ADR-0002-layer-governance.md) | Layer Governance | Accepted |
| [ADR-0003](ADR-0003-dependency-governance.md) | Dependency Governance | Accepted |
| [ADR-0004](ADR-0004-ownership-governance.md) | Ownership Governance | Accepted |
| [ADR-0005](ADR-0005-exception-governance.md) | Exception Governance | Accepted |
| [ADR-0006](ADR-0006-package-lifecycle-governance.md) | Package Lifecycle Governance | Accepted |
| [ADR-0007](ADR-0007-ai-development-governance.md) | AI Development Governance | Accepted |
| [ADR-0008](ADR-0008-react19-ref-as-prop-ui-author-layer.md) | React 19 Ref-as-Prop in `@afenda/ui` Author Layer | Proposed |
| [ADR-0009](ADR-0009-runtime-truth-before-roadmap.md) | Runtime Truth Before Roadmap | Accepted |
| [ADR-0010](ADR-0010-no-accounting-before-foundation-gate.md) | No Accounting Coding Before Pre-accounting Foundation Gate | Accepted |
| [ADR-0011](ADR-0011-multi-level-company-model-foundational.md) | Multi-level Company / Holding / Subsidiary / Minor Interest Model Is Foundational | Accepted |
| [ADR-0012](ADR-0012-documentation-evidence-backed.md) | Documentation Must Be Evidence-backed by Runtime | Accepted |
| [ADR-0013](ADR-0013-tip-roadmap-delivery-authority.md) | TIP Roadmap Is the Delivery Authority (phase narrative; PAS supersedes handoffs) | Accepted |
| [ADR-0014](ADR-0014-foundation-disposition-registry.md) | Foundation Disposition Registry | Accepted |
| [ADR-0015](ADR-0015-accounting-domain-contracts-only-activation.md) | Accounting Domain Contracts-Only Activation (PKG-R01) | Accepted |
| [ADR-0016](ADR-0016-fdr-delivery-authority.md) | PAS slice Authority (partially superseded by PAS 2026-06-28) | Accepted |
| [ADR-0017](ADR-0017-shadcn-studio-ui-delivery-acceleration.md) | shadcn/studio UI Delivery Acceleration | Proposed |
| [ADR-0018](ADR-0018-authentication-architecture.md) | Authentication Architecture | Accepted |
| [ADR-0019](ADR-0019-inventory-domain-master-data-activation.md) | Inventory Domain Master Data Activation | Accepted |
| [ADR-0020](ADR-0020-master-data-authority-consolidation.md) | Master Data Authority Consolidation | Accepted |
| [ADR-0021](ADR-0021-canonical-enterprise-identity.md) | Canonical Enterprise ID Constitution | Accepted |
| [ADR-0022](ADR-0022-postgres-split-id-persistence-model.md) | PostgreSQL Split-ID Persistence Model | Accepted |
| [ADR-0023](ADR-0023-tenant-human-reference-numbering.md) | Tenant Human Reference Numbering | Accepted |
| [ADR-0024](ADR-0024-canonical-id-body-generation.md) | Canonical ID Body Generation (Composition-Root Minting) | Accepted |
| [ADR-0025](ADR-0025-design-system-retirement.md) | Design System Retirement | Accepted |
| [ADR-0026](ADR-0026-platform-north-star-and-architecture-blueprint.md) | Platform North Star and Architecture Blueprint | Accepted |

## Process

1. **Propose** — draft ADR from [ADR-template.md](ADR-template.md)
2. **Review** — Architecture Authority + affected owner domains
3. **Accept** — status → Accepted; update registries if material
4. **Implement** — machine contracts and validators (Foundation phase 01+)
5. **Enforce** — CI gates (Foundation phase 01+)

## Rules

- New architectural patterns require an Accepted ADR (ARCH-009).
- Registry changes for material governance require ADR backing.
- Exceptions require ADR-0005 and an entry in `ExceptionContract` (Foundation phase 01).
- No exception may exist without expiry.

## Related

- [PAS delivery authority](../PAS/README.md)
- [Foundation disposition view](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts)

- Baseline: [`packages/architecture-authority/src/contracts/architecture-authority-version.ts`](../PAS/architecture-authority-baseline.md)
- Documentation index: [`docs/README.md`](../README.md)
- Pre-accounting roadmap: [`pre-accounting-foundation-roadmap.md`](../PAS/pre-accounting-foundation-roadmap.md)
- Runtime truth: [`afenda-runtime-truth-matrix.md`](../PAS/pas-status-index.md)
- Fingerprint: `ARCH-BASELINE-2026-06-23-v2` (Foundation phase 00 documentation authority closeout)
