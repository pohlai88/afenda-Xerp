# PAS-001C — ERP Module Foundation Standard

> **PAS family:** [ERP-MODULES](../ERP-MODULES/README.md) · implements [ERP Module Runtime North Star](../../NORTHSTAR/erp-module-runtime-north-star.md) · Blueprint: [erp-module-runtime-blueprint](../../BLUEPRINT/erp-module-runtime-blueprint.md)

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-001C |
| **Document title** | ERP Module Foundation Standard |
| **Document class** | `platform_authority_standard` |
| **Document role** | `erp_module_foundation_governance` |
| **Blueprint box** | **ERP Module Runtime Foundation** |
| **Registry lane** | `PKGR01C_ERP_MODULE_FOUNDATION` |
| **Package** | `@afenda/erp-module-foundation` · `PKG-027` |
| **Parent** | [ERP Module Runtime North Star](../../NORTHSTAR/erp-module-runtime-north-star.md) |
| **Implementation SSOT** | [erp-runtime-module-foundation.template.md](../ERP-MODULES/erp-runtime-module-foundation.template.md) |
| **Maturity** | Production Candidate — helper package **~8.6–8.8/10** · 9.5 requires live LoB adoption |
| **Authority status** | `foundation_authority` — define*/assert* helpers; zero runtime deps |
| **Fingerprint** | `ERP_MODULE_FOUNDATION-2026-06-30-v4` |
| **Upstream** | Module Foundation NS · [Kernel PAS-001A](PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) · [PAS-001B](PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) |
| **Last reviewed** | 2026-06-30 |

> **One sentence:** Every LoB ERP module must declare governed identity, ownership, knowledge alignment, integration-spine consumption, permission and audit binding, metadata surfaces, persistence boundary, and readiness evidence through `@afenda/erp-module-foundation` factories — before operational runtime behavior is authorized.

> **Canonical location:** `docs/PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md`

---

# 0. Agent Quick Path

**Read order:** [Module Foundation NS §1–§12](../../NORTHSTAR/erp-module-runtime-north-star.md) → [Blueprint §4](../../BLUEPRINT/erp-module-runtime-blueprint.md) → **this document §1–§4** → [template](../ERP-MODULES/erp-runtime-module-foundation.template.md) → slice handoff → [erp-module-foundation-authority skill](../../.cursor/skills/erp-module-foundation-authority/SKILL.md) → Code.

**Doctrine:**

```text
Kernel owns wire words.
Enterprise Knowledge owns meaning.
erp-module-foundation owns delivery shape.
LoB runtime owns behavior.
ERP app owns ingress.
```

**Hard stops:**

- Do not add business logic, resolvers, or permission evaluation to this package
- Do not import `@afenda/kernel` at runtime in domain modules through prohibited patterns — kernel is vocabulary only
- Do not create LoB folders without `defineErpRuntimeModule` + PAS slice authority
- Do not mark procurement (or any LoB) operational from reference bundle alone — wire-phase ≠ runtime

---

# 1. Derivation and Scope

## 1.1 Why this PAS exists

[ERP Module Runtime North Star](../../NORTHSTAR/erp-module-runtime-north-star.md) defines **permanent module delivery architecture**. PAS-001C owns the **platform helper package and gates** that prove identity-before-filesystem, spine-before-service, and readiness-before-operational promotion.

## 1.2 In scope / out of scope

| In scope (PAS-001C) | Out of scope |
| --- | --- |
| Module identity and registry factories | LoB posting rules, approval workflows |
| Foundation bundle shape and serialization | Database migrations execution |
| Knowledge map status vocabulary | Enterprise Knowledge atom authorship |
| Context spine **consumer declaration** | Operating context **assembly** (PAS-001A) |
| Permission **binding** parity | Permission **evaluation** |
| Audit map and outbox **classification** | Audit/outbox **dispatch** |
| Metadata surface **binding** shape | UI rendering (PAS-006) |
| Readiness matrix and report renderers | Business use case implementation |
| Governance gate scripts | Kernel wire vocabulary amendment |

## 1.3 Package boundary

| Package | Owns |
| --- | --- |
| `@afenda/erp-module-foundation` | Foundation factories, validators, reference bundles, report renderers |
| `packages/features/erp-modules/src/{slug}/` | LoB runtime scaffold (future — per Blueprint path law) |
| `@afenda/kernel/erp-domain/{module}` | Wire vocabulary only (PAS-001B) |
| `@afenda/{lob}` | Domain runtime behavior when authorized |

---

# 2. One-Sentence Boundary

**Owns:** Cross-LoB module foundation shape — identity, ownership rows, knowledge map, spine consumer contract, permission binding, policy declaration, audit map, event catalog, outbox contract, metadata binding, database boundary declaration, readiness matrix, registry uniqueness, status ladder enforcement.

**Never owns:** Wire vocabulary, business glossary atoms, operating context assembly, permission outcomes, persistence queries, HTTP handlers, UI components, event workers, or LoB business rules.

---

# 3. Architectural Dependencies

| Depends on | Required for |
| --- | --- |
| PAS-001B KV catalog | `kvId` binding · wire key parity |
| PAS-001A ERP Integration Spine | Context spine consumer doctrine |
| PAS-004 Enterprise Knowledge | Knowledge map statuses |
| PAS-006 Presentation | Metadata binding consumer proof |
| Architecture Authority registry | `PKGR01C` lane · package disposition |

| Provides to | What flows |
| --- | --- |
| All LoB runtime packages | Foundation bundle contract + gates |
| Governance scripts | Composite `check:erp-module-foundation` |
| Agent orchestration | Unambiguous slice handoff surface |

---

# 4. Authority Surfaces

| Surface | Factory / validator | Stability |
| --- | --- | --- |
| Module identity | `defineErpRuntimeModule` | stable |
| Module registry | `defineErpRuntimeModuleRegistry` · `assertErpRuntimeModuleRegistry` | stable |
| KV catalog parity | `assertRuntimeModuleKvCatalogParityForModule` | stable |
| Runtime contract | `defineModuleRuntimeContract` | stable |
| Ownership | `defineModuleOwnership` | stable |
| Knowledge map | `defineModuleKnowledgeMap` | stable |
| Context spine consumer | `defineModuleContextSpineConsumer` | stable |
| Permission binding | `defineModulePermissionBinding` | stable |
| Policy | `defineModulePolicy` | stable |
| Audit map | `defineModuleAuditMap` | stable |
| Event catalog | `defineModuleEventCatalog` | stable |
| Outbox contract | `defineModuleOutboxContract` | stable |
| Metadata binding | `defineModuleMetadataBinding` | stable |
| Database boundary | `defineModuleDatabaseBoundary` | stable |
| Operation catalog | `defineModuleOperationCatalog` | stable |
| Readiness matrix | `defineModuleReadiness` · `listRequiredReadinessDimensions` | stable |
| Readiness assertion | `assertModuleReadiness` · `assertModuleRuntimeCompleteness` | stable |
| Status ladder | `assertModuleStatusRequirements` | stable |
| Bundle I/O | `serializeErpModuleFoundationBundle` · `parseAndValidateErpModuleFoundationBundle` | stable |
| Reports | `renderModuleReadinessReport` · `renderModuleRegistryReadinessReport` | stable |

**Vocabulary types (exported):** `KnowledgeStatus`, `ErpRuntimeModuleStatus`, `ErpRuntimeModuleLifecycle`, `ReadinessDimension`, `OutboxRequirement`, `PermissionParityMode`, `ContextRequirement`, `MetadataRouteKind`.

**Reference bundle (wire-phase exemplar):** `PROCUREMENT_FOUNDATION_BUNDLE` — proves factory usage; **not** procurement operational readiness.

---

# 5. Status Ladder

```text
wire_only → foundation_authorized → foundation_verified → runtime_authorized → runtime_verified
(+ blocked, deprecated, contracts_only, foundation_planned)
```

Enforced by `assertModuleStatusRequirements()` with evidence path validation per status.

---

# 6. Readiness Dimensions

Required dimensions (default matrix):

| Dimension | Meaning |
| --- | --- |
| authority | Module identity + KV binding |
| registry | Cross-module registry uniqueness |
| knowledge | Knowledge map completeness |
| ownership | One owner per surface |
| database | Persistence boundary declared |
| contextSpine | PAS-001A consumer attestation |
| permissions | Permission binding parity |
| audit | Audit map completeness |
| outbox | Outbox requirement classified |
| metadata | Metadata surfaces bound |
| ui | Protected surface declarations |
| tests | Integration test evidence paths |
| gates | Governance gates green |

---

# 7. Path Law

**Default LoB runtime scaffold:**

```text
packages/features/erp-modules/src/{module-slug}/
```

**Foundation helper package (this PAS):**

```text
packages/erp-module-foundation/
```

Legacy `packages/{module}/` placeholders in early drafts are **superseded** — see [template §2](../ERP-MODULES/erp-runtime-module-foundation.template.md).

---

# 8. Contract Stability

| Change class | Requires |
| --- | --- |
| Additive factory field | PAS-001C amendment · tests · fingerprint bump |
| New readiness dimension | NS §4 EFR · PAS §6 · template §3.11 · new gate |
| Breaking bundle shape | ADR · migration slice · fingerprint major bump |
| New reference bundle | Slice handoff · gate evidence only |

---

# 9. Prohibited Dependencies

`@afenda/erp-module-foundation` must not depend on:

- `@afenda/kernel` (runtime import — vocabulary consumed at LoB layer only)
- `@afenda/database`, `@afenda/architecture-authority`
- Retired presentation packages (`@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, …)

Enforced by `check:erp-module-no-kernel-runtime-leak`.

---

# 10. Slice Catalog

| Slice ID | Title | Status |
| --- | --- | --- |
| ERP-MOD-FDN-001 | Foundation package scaffold | Delivered (historical) |
| ERP-MOD-FDN-002 | Governance gate registry | Delivered (historical) |
| ERP-MOD-FDN-003 | Foundation authority — factories + composite gates | **Delivered** 2026-06-30 |
| ERP-PROC-FDN-001 | Procurement runtime authority boundary | **Delivered** 2026-06-30 — [handoff](../ERP-MODULES/SLICE/erp-proc-fdn-001-runtime-authority-boundary.md) |

Procurement LoB slices: [ERP-MODULES/SLICE/README.md](../ERP-MODULES/SLICE/README.md) — handoff file required; gap report is not an authorized catalog.

**Next platform slice:** none — horizontal LoB slices consume PAS-001C.

---

# 11. Enterprise Acceptance Criteria (PAS)

| Criterion | Gate / review | Traces to |
| --- | --- | --- |
| Package exports all §4 surfaces | `pnpm --filter @afenda/erp-module-foundation typecheck` | §4 |
| Unit tests cover factories and assertions | `pnpm --filter @afenda/erp-module-foundation test:run` | §4 |
| Composite foundation gate green | `pnpm check:erp-module-foundation` | §13 |
| Registry lane disposition aligned | `pnpm check:foundation-disposition` | PKGR01C |
| No prohibited dependencies | `check:erp-module-no-kernel-runtime-leak` | §9 |
| Reference bundle validates | `procurement-reference-bundle.test.ts` | §4 reference |
| Template cross-linked | Manual review | [template](../ERP-MODULES/erp-runtime-module-foundation.template.md) |
| Blueprint box declared | Manual review | [Blueprint §4](../../BLUEPRINT/erp-module-runtime-blueprint.md) |
| Honest maturity label | Manual review | ~8.6–8.8 helper; 9.5 needs LoB adoption |

---

# 12. Skill Mirror

| Tier | Path |
| --- | --- |
| Agent skill | [.cursor/skills/erp-module-foundation-authority/SKILL.md](../../.cursor/skills/erp-module-foundation-authority/SKILL.md) |

Regenerate skill from this PAS on material amendment — do not drift-edit skill alone.

---

# 13. Gate Commands

**Composite:**

```bash
pnpm check:erp-module-foundation
pnpm quality:erp-module-foundation
```

**Sub-gates:**

```bash
pnpm check:erp-module-ownership
pnpm check:erp-module-knowledge-alignment
pnpm check:erp-module-context-spine-consumer
pnpm check:erp-module-permission-binding
pnpm check:erp-module-audit-outbox
pnpm check:erp-module-metadata-binding
pnpm check:erp-module-database-boundary
pnpm check:erp-module-no-kernel-runtime-leak
pnpm check:erp-module-readiness
pnpm check:erp-module-registry-readiness
```

**Package gates:**

```bash
pnpm --filter @afenda/erp-module-foundation typecheck
pnpm --filter @afenda/erp-module-foundation test:run
```

---

# 14. Document Sync

| Change in PAS-001C | Then update |
| --- | --- |
| New §4 surface | Package export · gate · skill · template section |
| New gate | Blueprint §4.4 · registry disposition knownGates |
| Fingerprint bump | README · pas-status-index |
| Reference bundle change | Gap report · procurement readiness scaffold |

**Last synced with:** `@afenda/erp-module-foundation` · Blueprint (2026-06-30) · Module Foundation NS
