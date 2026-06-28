# Platform Kernel Architecture Blueprint

| Field | Value |
| --- | --- |
| **Document class** | `architecture_blueprint` |
| **Document role** | `architecture_box_map` |
| **Architectural identity** | Blueprint Box name (§4) |
| **Workspace mapping** | [`package-registry.data.ts`](../packages/architecture-authority/src/data/package-registry.data.ts) |
| **Scope** | Platform Kernel — vocabulary, catalog, consumer integration |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) · [Kernel North Star](../NORTHSTAR/kernel-north-star.md) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Maturity** | Enterprise Accepted — reverse-engineered from accepted PAS authority |
| **Runtime stance** | Documentation only — references registries |
| **Total PAS at maturity** | 3 root PAS (PAS-001, PAS-001A, PAS-001B) |
| **Live PAS today** | 3 |
| **Quality target** | Enterprise **10 / 10** |
| **Last reviewed** | 2026-06-29 |
| **Next document** | [KERNEL PAS](../PAS/KERNEL/README.md) |

> **One sentence:** Three Blueprint boxes — **Kernel Vocabulary**, **Kernel Domain Vocabulary Catalog**, and **ERP Integration Spine** — decompose platform substrate language from ERP consumer integration proof so full-stack wiring cannot break silently.

---

# 0. Agent Quick Path

**Read order:** [Kernel North Star](../NORTHSTAR/kernel-north-star.md) §13 → this §3.3 (concept map) · §3.4 (vocabulary ownership) → §4 → [KERNEL PAS](../PAS/KERNEL/README.md) → Slice → Code.

**Hard stops:**

- Do not add resolver/database/auth logic to `@afenda/kernel`
- Do not claim Production Candidate integration without PAS-001A attestation
- Do not fork `OperatingContext` or permission scope in ERP or metadata packages
- Do not implement from Blueprint alone — PAS + slice handoff required

---

# 1. Blueprint Purpose

This Blueprint maps [Kernel North Star](../NORTHSTAR/kernel-north-star.md) §4 capabilities to architectural boxes and PAS documents. It is the **integration map** that prevents full-stack breakage between vocabulary (PAS-001), catalog (PAS-001B), and consumer proof (PAS-001A).

**Naming note:** The third box is **ERP Integration Spine** (Application integration layer) — not "Kernel ERP Integration Spine". It **consumes** kernel substrate; it is not part of the kernel platform layer.

---

# 2. Upstream Traceability

| Upstream | Link | This Blueprint uses |
| --- | --- | --- |
| Platform North Star | §4 Kernel & identity surface | Platform scope confirmation |
| Kernel North Star | §4 capabilities · §13 map · §9 dependencies · §10 risks | Box justification |
| ADR-0021–0023 | Identity | Kernel Vocabulary box |
| ADR-0011 | Multi-level company | Operating context hierarchy |
| ADR-0020 | Master data consolidation | Catalog box separation |

| Kernel NS §4 capability | Blueprint §4 box | NS Decision ID |
| --- | --- | --- |
| Shared enterprise identity | Kernel Vocabulary | D1 (E1, E2) |
| Operating scope hierarchy | Kernel Vocabulary | D1 |
| Execution traceability | Kernel Vocabulary | D1 |
| Result and error vocabulary | Kernel Vocabulary | D1 |
| Policy decision vocabulary | Kernel Vocabulary | D1 |
| Domain event envelope | Kernel Vocabulary | D1 |
| Minimal async context frame | Kernel Vocabulary | D1 |
| ERP domain wire catalog | Kernel Domain Vocabulary Catalog | D1 (E4, E7) |
| Consumer integration proof | ERP Integration Spine | D1 (E6) |

---

# 3. Layer Map

| Layer | Kernel boxes | Role |
| --- | --- | --- |
| **Platform** | Kernel Vocabulary · Kernel Domain Vocabulary Catalog | Zero-dependency contracts and ERP wire catalog |
| **Application integration** | ERP Integration Spine | Proves ERP + permissions + metadata **consume** kernel language correctly — not part of platform substrate |

Kernel boxes sit **below** Identity, Persistence, and Authorization — and **above** domain runtimes.

---

## 3.1 Architecture Decision Matrix

Use before adding, splitting, or merging a Blueprint box.

| Question | If Yes | If No |
| --- | --- | --- |
| Different business capability? | New box | Same box |
| Different lifecycle / maturity gate? | New box | Same box |
| Different ownership team? | New box | Same box |
| Independent deployment unit? | Candidate split | Same box |
| Separate regulatory responsibility? | New box | Same box |
| Shared platform vocabulary only? | Kernel Vocabulary layer | Domain layer |
| Consumer wiring proof only? | Integration Spine box | Not in kernel package |
| Catalog of domain wire terms only? | Catalog box (same workspace subpath) | Not separate runtime |

**Applied decisions:**

| Decision | Outcome | Reasoning |
| --- | --- | --- |
| Split Catalog from Core Vocabulary? | **Yes — Catalog box** | ERP domain terms evolve on PAS-001B cadence; core identity/context on PAS-001 |
| Split Integration Spine? | **Yes — ERP Integration Spine box** | PAS-001A proves consumers without reopening PAS-001 vocabulary; spine is **application integration**, not kernel substrate |
| Merge kernel into ERP app? | **No** | Violates zero-dependency substrate · P1 |

---

## 3.2 Canonical Dependency Categories

| Category | Kernel boxes use | Example |
| --- | --- | --- |
| **Compile-time** | TypeScript contracts imported by consumers | `@afenda/kernel` branded IDs |
| **Runtime (integration)** | ERP spine assembles kernel + permissions shapes | `resolve-operating-context.server.ts` |
| **Metadata** | Context passed to metadata authorization bridge | B74 wiring |
| **Configuration** | Registry lanes · disposition | `foundation-disposition.registry.ts` |
| **Knowledge** | Wire term ↔ atom alignment | PAS-004 consumes meaning; kernel retains wire shapes only |

---

## 3.3 Kernel concept dependency map

Conceptual layering only — **no runtime, APIs, package names, or implementation**. Shows how platform substrate concepts depend on each other before ERP wire terms and consumer proof.

```text
Enterprise Identity
        │
        ▼
Operating Context          ← hierarchy of scope boundaries
        │
        ├──► Permission Scope Vocabulary ──► (grant-scope words only; evaluation outside kernel)
        │
        ▼
Execution Context          ← correlation · execution attempt · actor reference
        │
        ├──► Result / Error Vocabulary
        │
        ▼
Domain Event Envelope      ← what happened (shape only; dispatch outside kernel)
        │
        ▼
Async Context Frame        ← minimal propagation contract (optional runtime primitive)
        │
        ▼
ERP Wire Vocabulary        ← domain business labels at wire layer (Catalog box)
        │
        ▼
Consumer Integration Proof ← ERP Integration Spine (PAS-001A — not substrate)
```

**Reading rule:** Downward arrows are **conceptual dependency** (later concepts assume earlier vocabulary). **ERP Integration Spine** is proof that consumers wire the stack — it is not a concept inside Kernel Vocabulary.

**Source:** PAS-001 §4.1 · §4.3 · §4.4 · §4.10 · §4.11 · PAS-001B catalog · PAS-001A §2.1

---

## 3.4 Vocabulary ownership map

Distinguishes **platform wire-safe language** (kernel substrate) from **enterprise business meaning** (Enterprise Knowledge). Reinforces: kernel owns **wire-safe structures**; PAS-004 owns **accepted business semantics**.

| Vocabulary | Owner | Blueprint box | Meaning authority |
| --- | --- | --- | --- |
| **Identity** | Kernel | Kernel Vocabulary | Platform + ADR-0021–0023 |
| **Operating scope** | Kernel | Kernel Vocabulary | Platform + ADR-0011 |
| **Execution trace** | Kernel | Kernel Vocabulary | PAS-001 §4.3 |
| **Result / error** | Kernel | Kernel Vocabulary | PAS-001 §4.2 |
| **Permission scope words** | Kernel | Kernel Vocabulary | PAS-001 §8 *(evaluation: `@afenda/permissions`)* |
| **Event envelope** | Kernel | Kernel Vocabulary | PAS-001 §4.10 |
| **Async context frame** | Kernel | Kernel Vocabulary | PAS-001 §4.11 |
| **ERP wire terms** | Kernel catalog | Kernel Domain Vocabulary Catalog | Wire shape: PAS-001B · Business label trace: Domain NS §3 |
| **Business meaning** | Enterprise Knowledge | *(PAS-004 — outside kernel boxes)* | `@afenda/enterprise-knowledge` atoms |
| **Integration proof** | ERP application layer | ERP Integration Spine | PAS-001A §2.1 · B71–B75 *(consumes kernel — not substrate)* |

**Hard rule:** Do not store contested business definitions in kernel contracts. Promote meaning to Enterprise Knowledge; retain wire-safe enum/shape in Catalog box only after NS + knowledge alignment.

---

# 4. Blueprint Box Registry

## 4.1 Box summary

| Blueprint box | Registry PKG | Layer | Status | PAS | Why separate |
| --- | --- | --- | --- | --- | --- |
| **Kernel Vocabulary** | `@afenda/kernel` | Platform | **live** | PAS-001 | Core cross-package language — identity, context, errors, events |
| **Kernel Domain Vocabulary Catalog** | `@afenda/kernel` (`erp-domain/*`) | Platform | **live** | PAS-001B | ERP wire terms scale independently of core kernel closure |
| **ERP Integration Spine** | `apps/erp` + consumer packages | Application integration | **live** | PAS-001A | Vocabulary closure ≠ production wiring proof; **consumes** kernel — not substrate |

---

## 4.2 Box Responsibility Matrix

| Blueprint box | Owns (architectural) | Never owns |
| --- | --- | --- |
| **Kernel Vocabulary** | Branded IDs · execution/operating context shapes · result/error vocabulary · permission *words* · event envelope · async context frame contract · decision matrix | DB schema · auth sessions · permission evaluation · API routes · UI · business workflows · formatting · posting |
| **Kernel Domain Vocabulary Catalog** | ERP domain wire enums/contracts under `erp-domain/*` · domain ID branded types at wire layer | Ledger posting · domain services · master-data rows · operational workflows |
| **ERP Integration Spine** | Resolver spine · context integration registry · untrusted field rejection · AppShell/metadata context bridge **proof** | New kernel vocabulary · kernel parsers for permission wire ingress · duplicate scope models · **any claim to be platform substrate** |

---

## 4.3 Change Impact Matrix

| If this box changes… | PAS | Domains | Packages | Tests / gates | ADR |
| --- | --- | --- | --- | --- | --- |
| **Kernel Vocabulary** | PAS-001 amendment | All platform + domain consumers | `@afenda/kernel` · all importers | `quality:kernel-*` · `check:kernel-*` | Identity / context ADRs if breaking |
| **Kernel Domain Vocabulary Catalog** | PAS-001B slice | ERP domains using wire terms | `@afenda/kernel/erp-domain/*` | `check:accounting-domain-contracts` · domain vocab tests | ADR-0020 lineage |
| **ERP Integration Spine** | PAS-001A slice | ERP surfaces · metadata · AppShell | `apps/erp` · `@afenda/permissions` · `@afenda/appshell` · `@afenda/metadata-ui` | `check:erp-operating-context-spine` · permission surface gate | ADR-0011 · ADR-0014 |

---

# 5. Consumers

## 5.1 Cross-box composition (conceptual — full stack)

End-to-end integration chain to avoid broken system. **Not runtime API diagram** — architectural ownership.

```text
External client (browser / API / job)
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│  ERP Integration Spine (PAS-001A)                        │
│  apps/erp — tenant hint → grant scope resolve → assemble OC   │
└───────────────────────────┬───────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────────┐
│ Authorization │   │ Kernel        │   │ Persistence       │
│ permissions   │   │ Vocabulary    │   │ database          │
│ parse/assert  │   │ branded OC    │   │ tenant/entity rows│
│ grant scope   │   │ IDs · errors  │   │                   │
└───────────────┘   └───────┬───────┘   └───────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ Kernel Domain         │
                │ Vocabulary Catalog    │
                │ erp-domain wire terms │
                └───────────┬───────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────────┐
│ AppShell      │   │ Metadata UI   │   │ Domain runtimes   │
│ shell context │   │ auth bridge   │   │ (future PAS)      │
└───────────────┘   └───────────────┘   └───────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ Observability         │
                │ audit via kernel      │
                │ event envelope vocab  │
                └───────────────────────┘
```

### Integration spine (delivered — PAS-001A)

```text
HTTP / Server Action / RSC
  → apps/erp tenant-domain.server.ts
  → apps/erp resolve-grant-scope.server.ts
  → @afenda/permissions parse*/assert*     ← wire ingress owner
  → apps/erp brandPermissionScopeFromWire  ← @afenda/kernel projection
  → apps/erp resolve-consolidation-scope
  → OperatingContext (kernel branded shape)
  → authorize-api-route / AppShell / metadata-workspace
```

**Broken-system anti-patterns this prevents:**

| Failure | Symptom | Guard |
| --- | --- | --- |
| Parallel scope model in ERP | Inconsistent authorization | `check:erp-operating-context-spine` |
| Parser in kernel for permissions | Circular deps · wrong owner | `wireIngress: false` on kernel projection |
| Resolver in kernel | Platform core imports DB/auth | PAS-001 §5 prohibited ownership |
| Metadata local scope fork | UI actions bypass ERP spine | B74 metadata bridge gate |
| Catalog term without NS/Knowledge | Business meaning drift | PAS-004 + NS §3 alignment |
| Vocabulary change without integration retest | Production ignores new shapes | PAS-001A attestation on consumer change |

---

## 5.2 Declared consumers (by box)

| Consumer | Consumes box | Integration category |
| --- | --- | --- |
| `@afenda/permissions` | Kernel Vocabulary + Spine | Runtime — parse owner; kernel projection |
| `@afenda/auth` | Kernel Vocabulary | Compile-time — actor IDs |
| `@afenda/database` | Kernel Vocabulary | Runtime — stores rows referenced by IDs |
| `@afenda/observability` | Kernel Vocabulary | Runtime — correlation + envelope |
| `@afenda/appshell` | Spine output | Runtime — branded operating context |
| `@afenda/metadata-ui` | Spine output | Runtime — authorization bridge |
| `@afenda/enterprise-knowledge` | Catalog alignment | Knowledge — meaning vs wire shape |
| All domain packages | Vocabulary + Catalog | Compile-time wire imports |
| `apps/erp` | All three boxes | Integration spine owner |

---

# 6. Blocked and Planned

| Item | Status | Gate |
| --- | --- | --- |
| New enterprise ID families (customer, supplier, …) | **planned** | Domain PAS slices per PAS-001 §4.1.6 |
| `FiscalCalendarId` / `FiscalPeriodId` promotion | **blocked** | Finance ADR |
| Ledger/posting in kernel | **blocked** | ADR-0010 · PKGR01 disposition |
| PAS-001 vocabulary reopen | **closed** | Amendment slice only |

---

# 7. PAS Creation Gate

Before authoring a new kernel-scoped PAS:

1. Box exists in §4 with §3.1 matrix outcome recorded
2. Kernel North Star §4 capability mapped in §2
3. No duplicate ownership with Platform Blueprint row
4. Parent PAS identified (001 / 001A / 001B)
5. Consumer list declared in §5
6. Registry lane owner assigned (`foundation-registry-owner` for disposition)

---

# 8. Blueprint → PAS Handoff

| Blueprint box | Root PAS (composed) | Legacy archive | Agent skill |
| --- | --- | --- | --- |
| Kernel Vocabulary | [PAS-001](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) | [legacy PAS-001](../PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md) | `kernel-authority` |
| Kernel Domain Vocabulary Catalog | [PAS-001B](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | [legacy PAS-001B](../PAS/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md) | `kernel-authority` |
| ERP Integration Spine | [PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | [legacy PAS-001A](../PAS/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md) | `kernel-authority` + `multi-tenancy-erp` |

**Handoff fields for PAS authors:**

```text
Upstream: Kernel North Star §4 capability row + this §4 box name
Boundary: §4.2 owns/never owns — distill into PAS §2
Surfaces: PAS §4 with Contract type + Stability
Integration: PAS-001A spine for any consumer-facing slice
Gates: PAS §13.1 — must include drift + boundary gates
```

---

# 9. PAS Inventory

| PAS ID | Title | Box | Maturity | Slices | Composed | Legacy |
| --- | --- | --- | --- | --- | --- | --- |
| PAS-001 | Kernel Vocabulary Authority | Kernel Vocabulary | Enterprise Accepted | B49–B70 closed | [KERNEL/PAS-001](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) | [PAS-001](../PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md) |
| PAS-001A | ERP Integration Spine | ERP Integration Spine | Production Candidate | B71–B75 closed | [KERNEL/PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | [PAS-001A](../PAS/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md) |
| PAS-001B | ERP Wire Vocabulary Catalog | Domain Catalog | Enterprise Accepted · `catalog_authority` role | B76–B106 closed | [KERNEL/PAS-001B](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | [PAS-001B](../PAS/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md) |

**Live / Total slices:** 3 / 3 PAS · all slice catalogs closed at current maturity

---

# 10. Platform Blueprint Cross-Reference

This scoped Blueprint **extends** — does not replace — [Platform Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) § Platform families · Kernel & context row.

| Platform Blueprint row | Kernel Blueprint box |
| --- | --- |
| Kernel & context · `@afenda/kernel` | Kernel Vocabulary + Domain Catalog |
| (integration — apps/erp) | ERP Integration Spine |

When Platform Blueprint and this document diverge, **Platform Blueprint + ADR-0026 wins** for PKG inventory; **this document wins** for kernel integration decomposition detail.

---

# 11. Evidence Register

| ID | Box decision | Source class | Tier | Reference (exact anchor) |
| --- | --- | --- | --- | --- |
| B1 | Three-box decomposition | ✓ | T5 | Kernel NS §13 · PAS-001 · PAS-001A · PAS-001B closure |
| B2 | ERP Integration Spine separate from vocabulary | ✓ | T5 | [PAS-001A](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) §1.1 · §2.1 |
| B3 | Catalog separate from core vocabulary | ✓ | T0/T5 | [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) §Decision · [PAS-001B](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) §0 |
| B4 | Full-stack gate set | ✓ | T5 | PAS-001 §14.1 · PAS-001A §0 required gates |
| B5 | Concept dependency ordering | ✓ | T5 | PAS-001 §4.1 · §4.3 · §4.4 · §4.10 · §4.11 |
| B6 | Wire vs business meaning split | ✓ | T1/T5 | Kernel NS §3.1–§3.2 · PAS-004 boundary · §3.4 above |

**Provenance:** **Enterprise Accepted — reverse-engineered from accepted PAS authority** (2026-06-29). Amend via `/afenda-doc-lifecycle` AUTHOR intent.

---

# 12. Agent Implementation Sequence

For any kernel-related coding agent:

```text
1. Read Kernel North Star §1–§12 (scope dispute only)
2. Read this Blueprint §4 box + §5.1 composition
3. Read [PAS-001 §0](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md#0-agent-quick-path) (always) — vocabulary boundary closed
4. If consumer/integration work → [PAS-001A §0](../PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md#0-agent-quick-path) + spine registry
5. If erp-domain wire term (**KV-***) → [PAS-001B](../PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md)
6. Read [Kernel Slice catalog](../PAS/KERNEL/SLICE/kernel-slice-catalog.md) — build order + handoff link
7. Read legacy slice 9-field handoff in `docs/PAS/slice/`
8. /afenda-coding-session Phase 0 + /coding-consistency-bundle
9. Implement one PAS §4 surface per slice
10. Run PAS §13 gates + integration gates (§5.1 table)
11. SYNC: update runtime matrix · SKILL checksum if PAS changed · SLICE catalog on amendment
```

**Never skip step 4 for ERP context work** — vocabulary correctness without spine proof still breaks production.

---

# 13. Maintenance

| Event | Update |
| --- | --- |
| PAS-001 amendment | §4.3 impact row · Platform Blueprint · SKILL regen |
| New consumer package | §5.1 + §5.2 · PAS-001A extension if spine touch |
| New ERP domain wire module | §4 Catalog box · PAS-001B slice |
| Slice close | PAS §12 · §9 inventory · Blueprint §10 counts |
| NS capability change | Kernel NS §4 + §13 · this §2 trace table · §3.3 concept map |

**Last reviewed:** 2026-06-29 · **Maturity:** Enterprise Accepted (reverse-engineered)
