# ERP Module Runtime Foundation Architecture Blueprint

| Field | Value |
| --- | --- |
| **Document class** | `architecture_blueprint` |
| **Document role** | `domain_architecture_box_map` |
| **Architectural identity** | Blueprint box — **ERP Module Runtime Foundation** |
| **Workspace mapping** | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) — `@afenda/erp-module-foundation` · `PKGR01C_ERP_MODULE_FOUNDATION` · `PKG-027` |
| **Scope** | Governed LoB module delivery — identity, ownership, integration consumer proof, readiness attestation |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) · [ERP Module Runtime North Star](../NORTHSTAR/erp-module-runtime-north-star.md) |
| **Platform rollup** | [Kernel Blueprint](kernel-blueprint.md) §2 cross-cutting row |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) · [ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) · [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) |
| **Derived documents** | [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) · [ERP-MODULES template](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) · [`ERP-MODULES/template/`](../PAS/ERP-MODULES/template/) · [Procurement Blueprint](procurement-blueprint.md) · [Procurement gap report](../PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md) · [OSS benchmark review](../PAS/ERP-MODULES/PROCUREMENT/procurement-oss-benchmark-review.md) |
| **Maturity** | Production Candidate — document **9.0 / 10**; procurement exemplar **not delivered** |
| **Runtime maturity** | `foundation_authority` — `@afenda/erp-module-foundation` helpers + composite gates live |
| **Runtime stance** | Documentation only — references registries and governance scripts |
| **Total PAS at maturity** | PAS-001C + per-LoB runtime foundation PAS under `docs/PAS/ERP-MODULES/{MODULE}/` |
| **Live PAS today** | PAS-001C (platform foundation) |
| **Does not confer** | LoB business meaning, North Star EFR, slice handoff execution |
| **Quality target** | Enterprise **9.5 / 10** (after procurement readiness report) |
| **Evidence standard** | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| **Last reviewed** | 2026-06-30 |
| **Next document** | [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) · [ERP-PROC-FDN-001](../PAS/ERP-MODULES/SLICE/erp-proc-fdn-001-runtime-authority-boundary.md) |

> **One sentence:** **ERP Module Runtime Foundation** owns repeatable platform helpers and gates that prove every LoB module declares identity, consumes the integration spine, binds permissions and audit vocabulary, and attests readiness before operational promotion — LoB business rules remain in domain North Stars and runtime packages.

---

# 0. Agent Quick Path

**Read order:** [ERP Module Runtime North Star §1–§12](../NORTHSTAR/erp-module-runtime-north-star.md) → **this document** → [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) → [template](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) → slice handoff → Code.

**This document answers:**

- Which **Blueprint box** owns module foundation authority vs LoB runtime
- **Package path law**, registry PKG, and gate commands
- PAS inventory and consumer map for module scaffolds

**This document never answers:**

- Business mission or LoB entity definitions (Domain North Star §1–§12)
- TypeScript contract field shapes (PAS §4)
- Slice session scope (9-field handoff)

**Hard stops:**

- Do not create LoB module folders without governed module identity and PAS slice authority
- Do not add resolver, formatting, or permission evaluation to `@afenda/kernel`
- Do not scaffold default top-level per-LoB root packages — use ERP feature-family path law
- Do not implement from Blueprint alone — PAS-001C + slice handoff required

**Chain rule:** Module Foundation NS §1–§12 → **this Blueprint** → PAS-001C → slice → Code

---

# 1. Blueprint Purpose

Before scaffolding or extending LoB module runtime, answer from **this document only**:

1. **What box?** → **ERP Module Runtime Foundation** (§4)
2. **Why separate from Kernel Vocabulary?** → Kernel owns wire words; foundation owns module delivery proof ([Kernel Blueprint](kernel-blueprint.md) §3.1)
3. **Why separate from LoB runtime?** → Procurement/Inventory business rules are domain-owned — foundation is cross-LoB delivery pattern
4. **Which package?** → `@afenda/erp-module-foundation` (helpers) · future LoB runtime under `packages/features/erp-modules/src/{slug}/`
5. **Which gates?** → §4.4 gate inventory
6. **Which slice?** → PAS-001C §10 · [ERP-MODULES/SLICE](../PAS/ERP-MODULES/SLICE/README.md)

Business **why** module foundation exists: [North Star §1](../NORTHSTAR/erp-module-runtime-north-star.md) — do not copy here.

---

# 2. Upstream Traceability

| Upstream | Link | This Blueprint uses |
| --- | --- | --- |
| ADR-0026 | Domain NS before PAS | T0 hierarchy |
| ADR-0020 | Master data / wire consolidation | Modules consume, not redefine |
| ADR-0027 | Presentation reset | Metadata binding consumer proof |
| ADR-0021 | Enterprise identity | Persistence boundary templates |
| Module Foundation NS | §4 capabilities · §13 box map | Capability → box justification |
| Kernel Blueprint | ERP Integration Spine · Catalog | Consumer and wire providers |

| North Star §4 capability | Blueprint §4 box | Notes |
| --- | --- | --- |
| Governed module identity | ERP Module Runtime Foundation | `defineErpRuntimeModule` |
| Explicit ownership separation | ERP Module Runtime Foundation | `defineModuleOwnership` |
| Knowledge alignment discipline | ERP Module Runtime Foundation · Enterprise Knowledge | Meaning in PAS-004 |
| Operating context spine consumption | ERP Integration Spine (provider) · **ERP Module Runtime Foundation** (consumer proof) | PAS-001A |
| Permission vocabulary binding | ERP Module Runtime Foundation · Authorization | Declare keys only |
| Module policy declaration | ERP Module Runtime Foundation | `defineModulePolicy` |
| Audit traceability mapping | ERP Module Runtime Foundation | `defineModuleAuditMap` |
| Event catalog and outbox classification | ERP Module Runtime Foundation · Execution | Dispatch owner external |
| Metadata-governed presentation binding | ERP Module Runtime Foundation · Presentation (PAS-006) | `defineModuleMetadataBinding` |
| Persistence boundary discipline | ERP Module Runtime Foundation · Persistence | Schema templates |
| Readiness attestation | ERP Module Runtime Foundation | `assertModuleReadiness` |
| Scalable module architecture | ERP Module Runtime Foundation · Architecture Authority | Path law §4.5 |
| Protected ingress flow invariant | ERP Integration Spine · ERP Application Ingress | Flow proof in `apps/erp` |
| Cross-domain dependency declaration | ERP Module Runtime Foundation · target LoB box | Runtime contract |

---

# 3. Layer Map

| Layer | Owner | Module foundation role |
| --- | --- | --- |
| **Platform vocabulary** | Kernel Vocabulary · PAS-001B catalog | Wire keys, audit words, event envelope |
| **Platform delivery** | ERP Module Runtime Foundation | Module identity, readiness, foundation bundles |
| **Application integration** | ERP Integration Spine | Operating context assembly |
| **LoB runtime** | `@afenda/{lob}` or features-package slug | Business behavior — consumes foundation |
| **Persistence** | `@afenda/database` | Schema execution — modules declare boundary |
| **Ingress** | `apps/erp` | Protected routes and metadata binding |

---

# 4. Blueprint Box — ERP Module Runtime Foundation

| Field | Value |
| --- | --- |
| **Box name** | **ERP Module Runtime Foundation** |
| **Registry PKG** | `@afenda/erp-module-foundation` · `PKGR01C_ERP_MODULE_FOUNDATION` |
| **PAS** | [PAS-001C](../PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md) |
| **Status** | `live` — foundation authority delivered (ERP-MOD-FDN-003) |
| **Skill mirror** | [erp-module-foundation-authority](../../.cursor/skills/erp-module-foundation-authority/SKILL.md) |

## 4.1 Why this box is separate

**Because** every LoB team otherwise reinvents integration, vocabulary binding, and readiness checks · **Therefore** one platform package provides `define*` / `assert*` factories and governance gates before any module serves protected work.

**Because** kernel must stay zero business runtime · **Therefore** module foundation lives outside `@afenda/kernel` — consuming wire catalog, never amending it.

## 4.2 Box owns (architectural)

- Module identity and registry definitions (`defineErpRuntimeModule`, `defineErpRuntimeModuleRegistry`)
- Foundation bundle shape — ownership, knowledge map, context spine consumer, permission binding, audit map, event catalog, outbox, metadata binding, readiness matrix
- Status ladder enforcement (`assertModuleStatusRequirements`)
- Readiness and registry readiness reports (`renderModuleReadinessReport`, `renderModuleRegistryReadinessReport`)
- Reference procurement foundation bundle (wire-phase exemplar only)
- Composite governance gates (`check:erp-module-*`)
- Implementation template SSOT: [`erp-runtime-module-foundation.template.md`](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) (canonical) · [`ERP-MODULES/template/`](../PAS/ERP-MODULES/template/) (template family folder — tombstone redirect)

## 4.3 Box never owns (architectural)

- LoB business meaning (Procurement NS, Enterprise Knowledge)
- Wire vocabulary amendment (Kernel / PAS-001B)
- Operating context assembly (PAS-001A ERP Integration Spine)
- Permission evaluation · database queries · UI rendering · event dispatch
- Top-level per-LoB root packages by default (path law §4.5)

## 4.4 Gate inventory

**Composite:**

| Gate | Purpose |
| --- | --- |
| `pnpm check:erp-module-foundation` | Runs all sub-gates below |
| `pnpm quality:erp-module-foundation` | Quality composite for CI |

**Sub-gates (PAS-001C §13):**

| Gate | Purpose |
| --- | --- |
| `pnpm check:erp-module-ownership` | One owner per responsibility surface |
| `pnpm check:erp-module-knowledge-alignment` | Knowledge map statuses enforced |
| `pnpm check:erp-module-context-spine-consumer` | Spine consumption declared |
| `pnpm check:erp-module-permission-binding` | Permission parity modes |
| `pnpm check:erp-module-audit-outbox` | Audit map + outbox contract |
| `pnpm check:erp-module-metadata-binding` | Metadata surface declarations |
| `pnpm check:erp-module-database-boundary` | Persistence boundary templates |
| `pnpm check:erp-module-no-kernel-runtime-leak` | Prohibited deps + no kernel runtime leak |
| `pnpm check:erp-module-readiness` | Readiness matrix completeness |
| `pnpm check:erp-module-registry-readiness` | Cross-module registry uniqueness |

**Package gates:**

| Gate | Purpose |
| --- | --- |
| `pnpm --filter @afenda/erp-module-foundation typecheck` | Type safety |
| `pnpm --filter @afenda/erp-module-foundation test:run` | Unit tests |

## 4.5 Path law (authoritative)

**Default LoB runtime scaffold (operational — when authorized):**

```text
packages/features/erp-modules/src/{module-slug}/
```

- One ERP feature-family package — no default top-level `packages/procurement/`, `packages/inventory/`, etc.
- Exception requires ADR + Blueprint amendment
- Reference exemplar: `procurement` (`KV-PROC`) — foundation bundle wire-phase only today

**Registry reservation path (governance — live today):**

| Field | Value |
| --- | --- |
| Package name | `@afenda/procurement` (PKG-R05) |
| Reserved path | `packages/procurement` — **must not exist on disk** until authorized slice |
| Authority | [ADR-0031 §6](../adr/ADR-0031-procurement-runtime-authority-boundary.md) |

The registry `runtimeOwner` path (`packages/procurement`) is the **governance reservation identifier** derived from package name. It is **not** the operational filesystem target. Operational scaffold uses the features-package path above unless a future ADR amends this section.

**Foundation helper package (live today):**

```text
packages/erp-module-foundation/
```

## 4.6 Runtime evidence appendix

| Path | Role |
| --- | --- |
| [`docs/PAS/ERP-MODULES/erp-runtime-module-foundation.template.md`](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) | Implementation template SSOT (§1–§8) |
| [`docs/PAS/ERP-MODULES/template/`](../PAS/ERP-MODULES/template/) | Template family folder — tombstone → canonical SSOT |
| `packages/erp-module-foundation/src/define-*.ts` | Foundation factories |
| `packages/erp-module-foundation/src/assert-*.ts` | Fail-closed validators |
| `packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts` | KV-PROC reference bundle |
| `scripts/governance/check-erp-module-*.mts` | Sub-gate scripts |
| `scripts/governance/erp-module-foundation-registry.mts` | Gate registry constants |

## 4.7 Source register

| ID | Claim | Tier | Status | Reference |
| --- | --- | --- | --- | --- |
| B1 | Module foundation is platform delivery domain | T1 | Accepted | [Module Foundation NS §2](../NORTHSTAR/erp-module-runtime-north-star.md) |
| B2 | Features-package path law for LoB scaffolds | T1 | Accepted via NS §0.1 + this §4.5 | [NS E9](../NORTHSTAR/erp-module-runtime-north-star.md) |
| B3 | Foundation helper package live with composite gates | T5 | Delivered | `@afenda/erp-module-foundation` · ERP-MOD-FDN-003 |
| B4 | Procurement reference bundle wire-phase only | T5 | Delivered scaffold | `PROCUREMENT_FOUNDATION_BUNDLE` |
| B5 | Procurement business runtime | T5 | **Not delivered** | [Gap report](../PAS/ERP-MODULES/PROCUREMENT/procurement-foundation-gap-report.md) · ERP-PROC-FDN-001 Delivered |

---

# 5. Consumer Map

| Consumer box | Relationship |
| --- | --- |
| **ERP Integration Spine** | Provides operating context — modules must consume, not reconstruct |
| **Kernel Domain Vocabulary Catalog** | Provides KV IDs and wire keys |
| **Enterprise Knowledge** | Provides accepted meaning before semantic runtime |
| **Authorization** | Evaluates permissions — modules declare keys |
| **Persistence** | Owns schema execution — modules declare boundary |
| **Presentation (PAS-006)** | Owns UI primitives — modules bind metadata |
| **Execution** | Owns dispatch/retry — modules classify outbox requirement |
| **Procurement / Inventory / …** | LoB runtime boxes — repeat foundation pattern under path law |

---

# 6. PAS Creation Gate (Blueprint §7)

PAS-001C is **authorable** when all six conditions hold:

| # | Condition | Status |
| --- | --- | --- |
| 1 | Domain NS §4 EFR maps to this box | ✓ [NS §13](../NORTHSTAR/erp-module-runtime-north-star.md) |
| 2 | Blueprint §4.2 owns / never owns declared | ✓ this document |
| 3 | Registry PKG row exists | ✓ `PKGR01C` |
| 4 | Implementation template SSOT exists | ✓ [ERP-MODULES template](../PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) |
| 5 | At least one gate script registered | ✓ `check:erp-module-foundation` |
| 6 | Slice catalog planned | ✓ PAS-001C §10 · ERP-MODULES/SLICE |

---

# 7. Blueprint → PAS Handoff

| Blueprint artifact | PAS artifact |
| --- | --- |
| Box name **ERP Module Runtime Foundation** | PAS-001C title and §1 package role |
| §4.4 gate inventory | PAS-001C §13 |
| §4.5 path law | Template §2 · PAS-001C §6 |
| §4.6 runtime paths | PAS-001C §4 authority surfaces |
| §5 consumers | PAS-001C §3.4 dependencies |

**Next slice after ERP-PROC-FDN-001:** **TBD** — handoff must be authored before listing ([ERP-MODULES/SLICE](../PAS/ERP-MODULES/SLICE/README.md)).

---

# 8. Document Sync

| Change | Then update |
| --- | --- |
| New readiness dimension in NS §4 | PAS-001C §4 · template §3.11 · gate script |
| Path law change | ADR · this §4.5 · NS §0.1 pointer · template §2 |
| New LoB exemplar | ERP-MODULES/{MODULE}/ · slice catalog |
| Procurement operational | NS §12.4 · readiness report · B5 status |

**Last synced with:** Module Foundation NS (2026-06-30) · `@afenda/erp-module-foundation` fingerprint `ERP_MODULE_FOUNDATION-2026-06-30-v4`
