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
| [ADR-0027](ADR-0027-frontend-presentation-reset.md) | Frontend Presentation Reset | Accepted |
| [ADR-0028](ADR-0028-business-reference-document-asset-promotion.md) | Business Reference Document and Asset Authority Promotion | Accepted |
| [ADR-0029](ADR-0029-rounding-decimal-precision-vocabulary.md) | Rounding Mode and Decimal Precision Kernel Vocabulary | Accepted |
| [ADR-0030](ADR-0030-erp-rest-api-contract-standard.md) | ERP REST API Contract Standard | Accepted |
| [ADR-0031](ADR-0031-procurement-runtime-authority-boundary.md) | Procurement Runtime Authority Boundary (PKG-R05) | Accepted |
| [ADR-0032](ADR-0032-fiscal-domain-id-authority.md) | Fiscal Domain ID Authority (Calendar and Period) | Accepted |
| [ADR-0033](ADR-0033-service-actor-s2s-token-verification-deferred.md) | Service Actor S2S Token Verification Deferred | Accepted |
| [ADR-0034](ADR-0034-service-actor-production-policy-attestation.md) | Service Actor Production Policy Attestation | Accepted |
| [ADR-0035](ADR-0035-internal-v1-service-actor-bearer-verification.md) | Internal v1 Service Actor Bearer Verification | Accepted |
| [ADR-0036](ADR-0036-machine-s2s-production-activation.md) | Machine S2S Production Activation | Accepted |
| [ADR-0037](ADR-0037-shadcn-studio-src-layered-structure.md) | shadcn-studio src Layered Structure (historical v1) | Accepted |
| [ADR-0038](ADR-0038-shadcn-studio-prefixed-folder-layout.md) | shadcn-studio Prefixed Folder Layout (historical v1) | Accepted |
| [ADR-0039](ADR-0039-developer-presentation-sandbox.md) | Developer Presentation Sandbox | Accepted |
| [ADR-0040](ADR-0040-promote-shadcn-studio-v2-and-deprecate-legacy.md) | Promote shadcn-studio-v2 and Deprecate Legacy shadcn-studio | Accepted |
| [ADR-0041](ADR-0041-headless-workspaceboard-widget-grid.md) | Headless WorkspaceBoard Widget Grid | Accepted |
| [ADR-0042](ADR-0042-workspaceboard-drag-resize-runtime.md) | WorkspaceBoard Drag/Resize Runtime | Accepted |
| [ADR-0043](ADR-0043-erp-datatable-headless-composer.md) | ERP Datatable Headless Composer | Accepted |
| [ADR-0044](ADR-0044-developer-route-lab-runtime-authority-boundary.md) | Developer Route Lab Runtime Authority Boundary | Accepted |

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
