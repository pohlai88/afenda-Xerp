# Platform Architecture Authority Blueprint

| Field | Value |
| --- | --- |
| **Document class** | `architecture_blueprint` |
| **Document role** | `domain_architecture_box_map` |
| **Architectural identity** | **Blueprint Box name** (§4) — permanent |
| **Workspace mapping** | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) — `@afenda/*` npm name |
| **Scope** | Platform Architecture Authority — registry-first package, layer, ownership, dependency, and disposition truth |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) · [Platform Architecture Authority North Star](../NORTHSTAR/architecture-authority-north-star.md) |
| **Platform rollup** | [Afenda Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) § Governance family |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0004](../adr/ADR-0004-ownership-governance.md) · [ADR-0014](../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0020](../adr/ADR-0020-master-data-authority-consolidation.md) · [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) |
| **Derived documents** | PAS-002 · PAS-002A · `@afenda/architecture-authority` package tree |
| **Maturity** | Enterprise |
| **Runtime stance** | Documentation only — references registries; does not duplicate PKG tables |
| **Total PAS at maturity** | `2` (PAS-002 charter · PAS-002A enterprise extension) |
| **Live PAS today** | `2` |
| **Planned PAS** | `0` |
| **Does not confer** | Business domain meaning, contracts, slice handoffs, registry row edits, acceptance gate execution |
| **Machine registry** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) · `PKGR02_ARCHITECTURE_AUTHORITY` |
| **Quality target** | Enterprise **10 / 10** |
| **Evidence standard** | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| **Last reviewed** | 2026-06-29 |
| **Next document** | [PAS-002](../PAS/PAS-002-ARCHITECTURE-AUTHORITY.md) · [PAS-002A](../PAS/PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) |

> **One sentence:** One Platform-layer **Architecture authority** box owns six registry classes, composite architecture gates, and governance-consumer proof — wired end-to-end from constitutional laws through Domain North Star, PAS, package surfaces, CI gates, and every workspace package that asks *"Is this allowed?"*

---

# 0. Agent Quick Path

**Read order:** [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → [Platform NS](../architecture/afenda-platform-north-star.md) → [Domain NS §1–§12](../NORTHSTAR/architecture-authority-north-star.md) → **this document** → [PAS-002](../PAS/PAS-002-ARCHITECTURE-AUTHORITY.md) → [PAS-002A](../PAS/PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) → Slice → Code.

**This document answers:**

- What **Blueprint box** governs platform architecture authority and **why it is one box** (§3.1)
- How **six registry classes** (Domain NS §3.1) compose inside the box (§5.1)
- **Full-stack integration** from laws → NS → Blueprint → PAS → package → gates → consumers (§5.2–§5.4)
- Box **owns / never owns** (§4.2) · change impact (§4.3) · PAS handoff (§9)

**This document never answers:**

- Business mission or governance invariants in prose (Domain NS §1–§12)
- PAS §4 contract types · slice order · gate command definitions (PAS §10–§13)
- PKG inventory tables (link registries only)

**Hard stops:**

- Do not create a workspace package without §4 **Architecture authority** box row
- Do not split registry classes into separate Blueprint boxes without §3.1 matrix + ADR + §4.3
- Do not author PAS without §7 gate satisfied
- Do not implement from Blueprint alone — read target PAS §4 surface + slice handoff

**Chain rule:** Constitutional Laws → Platform NS → Domain NS → **Domain Blueprint (this doc)** → Platform Blueprint rollup → PAS → Slice → Code

---

# 1. Blueprint Purpose

Before authoring or extending Architecture Authority PAS slices, answer from **this document only**:

1. **What** Blueprint box is in scope? → **Architecture authority** (§4)
2. **Why separate** from Kernel, Enterprise Knowledge, AI governance, and ERP apps? → §4 Reasoning · §3.1 matrix
3. **Which layer**? → Platform (§3)
4. **What does the box own / never own**? → §4.2
5. **Who consumes** registry truth and through which dependency category? → §5 · §5.3
6. **Which PAS**? → PAS-002 (charter) · PAS-002A (Enterprise Accepted extension)
7. **Registry PKG**? → `PKG-019` → `@afenda/architecture-authority`

Business **why the authority domain exists:** [Domain NS §1](../NORTHSTAR/architecture-authority-north-star.md) — do not copy here.

---

# 2. Upstream Traceability

| Upstream | Link | This Blueprint uses |
| --- | --- | --- |
| Platform Constitutional Laws | LAW 2 · LAW 3 · LAW 7 · LAW 8 · LAW 9 | Registry-first · ownership · descriptive governance · kernel adjacency |
| Platform North Star | §4 Platform governance | Parent capability expectation |
| Domain North Star | §4 capabilities · §13 map · §9 dependencies · §10 risks · §11 quality · §12 D# | Box parent · Decision IDs |
| Platform Blueprint | Governance family row | Rollup — not duplicate §4 |
| ADRs | As cited | Blockers §8 · Reasoning sources |

**Capability → box rule:** Domain NS §13 maps all ten §4 capabilities to **Architecture authority** — one box, multiple internal registry surfaces (§5.1).

| Domain NS §4 capability | Blueprint §4 box | Domain NS Decision ID |
| --- | --- | --- |
| Canonical package inventory | **Architecture authority** | D1 |
| Layer dependency discipline | **Architecture authority** | D1 |
| Ownership accountability | **Architecture authority** | D1 |
| Dependency boundary enforcement | **Architecture authority** | D1 |
| Approved exception registry | **Architecture authority** | D1 |
| Foundation delivery disposition | **Architecture authority** | D1 |
| Business entity reservation map | **Architecture authority** | D1 · D2 |
| Architecture quality attestation | **Architecture authority** | D1 |
| Kernel adjacency discipline | **Architecture authority** | D2 |
| Governance consumer proof | **Architecture authority** | D3 |

---

# 3. Layer Map

| Layer | Blueprint intent for this domain |
| --- | --- |
| **Platform** | **Architecture authority** — governance root; registries + validators; contracts-only |
| **Foundation** | Consumes registry truth when declaring packages — does not own architecture SSOT |
| **Application** | Consumes gates via CI — never imports architecture authority at ERP request time |

**Dependency rule:** Architecture authority stays **below** Application and UI layers. Compile-time upward imports from foundation into application/UI are defects ([Domain NS §5 P3](../NORTHSTAR/architecture-authority-north-star.md)).

Machine assignments: [`layer-registry.data.ts`](../../packages/architecture-authority/src/data/layer-registry.data.ts).

---

# 3.1 Architecture Decision Matrix

> Run **before** adding or splitting §4 rows. Outcome recorded in §4 Reasoning.

| Question | Architecture authority (this domain) | Result |
| --- | --- | --- |
| Different **business capability** (Domain NS §4 EFR)? | All ten capabilities serve one constitutional authority domain | **Single box** |
| Different **lifecycle** (Domain NS §8)? | Package lifecycle (§8.1) vs disposition (§8.2) are orthogonal **tracks inside one box** — not separate deployables | **Single box** — dual lifecycle in §5.1 |
| Different **ownership**? | One Architecture Authority steward for all registry classes | **Single box** |
| **Independent deployment** candidate? | One `@afenda/architecture-authority` workspace package | **Single box** |
| Separate **regulatory responsibility**? | Governance metadata — not LoB regulation | **Single box** |
| Shared **kernel / platform** service? | Platform-layer governance root | **Platform box** |
| Different **PAS maturity** train? | PAS-002A extends PAS-002 — derived extension, same box | **Single box** · two PAS docs |
| §3.1 passes but only **technical** split of registry files? | Registry modules are PAS §4 surfaces — not architectural boxes | **Insufficient alone** |

**Workflow:** Domain NS EFR exists → matrix → **one §4 row** → §4.2 · §5.1 internal decomposition → PAS-002 §4.1–§4.12 surfaces.

---

# 3.2 Canonical Dependency Categories

| Category | Architecture authority usage |
| --- | --- |
| **Compile-time** | Consumer packages import `@afenda/architecture-authority` root or `/surface` only — no deep paths |
| **Runtime** | **None at ERP request time** — `contracts-only` stance permanent (Domain NS P8) |
| **Metadata** | Disposition registry rows reference PAS paths, evidence files, gate names |
| **Configuration** | Layer and dependency matrices are static registry data — not tenant flags |
| **Knowledge** | Lists `@afenda/enterprise-knowledge` in package registry — does not store atoms |

---

# 4. Blueprint Boxes

### Box → workspace authority chain

```text
Blueprint Box: Architecture authority (this document §4)
        ↓
package-registry.data.ts — PKG-019 → @afenda/architecture-authority
        ↓
foundation-disposition.registry.ts — PKGR02_ARCHITECTURE_AUTHORITY
        ↓
packages/architecture-authority/
```

| Blueprint box | Layer | Registry PKG | Why separate | Source | Reasoning (Because → Therefore) | Status | Governing PAS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Architecture authority** | Platform | `PKG-019` → `@afenda/architecture-authority` | Registry-first governance must not merge into Kernel identity, Enterprise Knowledge atoms, ERP apps, or CI scripts as duplicate SSOT | [T0 ADR-0026] [T0 ADR-0014] [T1 Domain NS §4] [T1 Domain NS §12 D1] ✓ | **Because** undocumentable package topology causes agent sprawl and untestable layer inversion (Domain NS §1). **Because** six registry classes (Domain NS §3.1) share one ownership and one contracts-only package. **Therefore** one Platform box owns all registry surfaces; Kernel owns identity wire semantics only (D2); PAS-002/002A govern implementation. | **live** | PAS-002 · PAS-002A |

**Sibling box (platform scope — not owned by this domain blueprint):**

| Blueprint box | Relationship | Category |
| --- | --- | --- |
| **AI governance** | Depends on architecture authority for package rules; separate PAS when authored | Compile-time consumer · Platform sibling |

Rollup: [Platform Blueprint — Governance family](../architecture/afenda-architecture-blueprint.md).

---

# 4.1 Blueprint Evidence Register

| ID | Source | Tier | Justifies | Link |
| --- | --- | --- | --- | --- |
| B1 | ADR-0026 | T0 | Blueprint + NS chain | [`docs/adr/ADR-0026`](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| B2 | ADR-0014 | T0 | Disposition registry box surface | [`docs/adr/ADR-0014`](../adr/ADR-0014-foundation-disposition-registry.md) |
| B3 | ADR-0020 | T0 | Reservation registry (§4.10) | [`docs/adr/ADR-0020`](../adr/ADR-0020-master-data-authority-consolidation.md) |
| B4 | ADR-0021 | T0 | Kernel adjacency — no ID duplication | [`docs/adr/ADR-0021`](../adr/ADR-0021-canonical-enterprise-identity.md) |
| B5 | Domain NS §12 D1–D3 | T1 | Capability → box map | [`architecture-authority-north-star.md`](../NORTHSTAR/architecture-authority-north-star.md) |
| B6 | PKG-019 · PKGR02 | T4 | Live status sync | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) |
| B7 | Runtime truth | T5 | B1–B27 · B38–B42 delivered | [`pas-status-index.md`](../PAS/pas-status-index.md) |

---

# 4.2 Box Responsibility Matrix

| Blueprint box | Owns (architectural) | Never owns (explicit exclusions) | Domain NS trace |
| --- | --- | --- | --- |
| **Architecture authority** | Package registry · Layer registry · Ownership registry · Disposition registry · Dependency/boundary rules · Exception registry · Reservation map (metadata) · Lifecycle registry · Surface index · Workspace discovery · Composite architecture gates · Governance consumer proof contracts | Kernel identity parsers/wire asserts · Business master data records · Enterprise Knowledge atoms · Authorization evaluation · Accounting posting · UI rendering · Database migrations · ERP request-time governance execution | §4 all capabilities · §9.1 · §9.2 |

**Never-owns targets (name siblings):** **Kernel** (identity) · **Enterprise Knowledge** (atoms) · **Authorization** (permissions runtime) · **Visual Token Authority** · all **LoB domain** runtimes · **apps/erp** (delivery only consumes gates).

---

# 4.3 Change Impact Matrix

| If this box changes… | PAS impacted | Domain NS | Registry PKG | Primary gates / tests | ADR required |
| --- | --- | --- | --- | --- | --- |
| **Architecture authority** | PAS-002 · PAS-002A · all §12 slice rows | §4 · §13 · §12 register | `PKG-019` · `PKGR02` | `pnpm quality:architecture` · `pnpm check:foundation-disposition` · PAS-002A §13.2–§13.3 | Yes if split/merge or new registry class SSOT |
| New registry surface in box | PAS-002 §4 amendment slice | §3.1 taxonomy if new class | Unchanged PKG | `pnpm check:architecture-authority-surface` | No if additive surface |
| Box split (hypothetical) | Retire/merge PAS · migrate slices | Amend §13 · §4 capabilities | New PKG via registry owner | Full regression | **Yes** |
| Package/npm rename only | PAS metadata | — | Registry update — **box name unchanged** | Registry parity gates | No |

---

# 5. Composition and Consumers

```text
Architecture authority
        │
        ├──► @afenda/kernel (reservation read · no identity duplication)
        ├──► @afenda/ai-governance (compile-time dependency)
        ├──► All registered @afenda/* packages (registry membership)
        ├──► scripts/quality/** · scripts/governance/** (gate runners)
        ├──► docs/architecture/*.md (derived human views — not SSOT)
        └──► Agent skills (architecture-authority · foundation-registry-owner)
```

| Blueprint box | Declared consumers | Dependency category | Notes |
| --- | --- | --- | --- |
| **Architecture authority** | `@afenda/kernel` · `@afenda/ai-governance` · `@afenda/design-system` · `@afenda/ui` · `@afenda/appshell` · `@afenda/ui-composition` · `@afenda/metadata-ui` · `apps/erp` · `scripts/governance/**` · `scripts/quality/**` | Compile-time · Metadata · Knowledge | PAS **Consumers** ⊆ this list |

---

# 5.1 Cross-box Composition — Registry Surfaces (Internal)

> **Conceptual only** — maps Domain NS §3.1 six registry classes to PAS §4 surfaces inside **Architecture authority**. Not separate Blueprint boxes.

```text
Platform Architecture Authority (one box)
        │
        ├─ Package registry ──────────── PAS §4.1 · validate-registry
        ├─ Layer registry ────────────── PAS §4.2 · validate-layers
        ├─ Ownership registry ────────── PAS §4.3 · validate-ownership
        ├─ Disposition registry ──────── PAS §4.4 · validate-foundation-disposition
        ├─ Boundary rules + Dependency ─ PAS §4.5 · §4.8 · validate-dependencies · validate-cycles
        ├─ Exception registry ────────── PAS §4.6 · validate-exceptions
        ├─ Lifecycle registry ────────── PAS §4.9 · validate-lifecycle
        ├─ Reservation map (ADR-0020) ── PAS §4.10 · BMD policies
        ├─ Surface registry ──────────── PAS §4.11 · agent/CI index
        ├─ Workspace discovery ───────── PAS §4.12 · filesystem parity
        └─ Architecture gates ────────── PAS §4.7 · validate-architecture (composite)
```

| Upstream surface | Downstream surface | Relationship | Domain NS §7 event | Category |
| --- | --- | --- | --- | --- |
| Package registry | Layer registry | package → layer assignment | Package registered | Metadata |
| Package registry | Ownership registry | package → owner | Ownership attested | Metadata |
| Package registry | Disposition registry | package → delivery lane | Disposition advanced | Metadata |
| Layer registry | Boundary rules | layer → allowed edges | Layer violation detected | Compile-time |
| Exception registry | Boundary rules | ADR waiver → edge override | Exception granted | Metadata |
| Reservation map | Kernel | domain ownership metadata only | Reservation declared | Knowledge |
| All registries | Architecture gates | evidence → CI attestation | Governance attestation completed | Compile-time |
| Architecture gates | All workspace packages | merge-time proof | Architecture drift detected | Compile-time |

---

# 5.2 Full-Stack End-to-End Integration Chain

> **Mandatory integration path** — every layer must link; no skipped hop for governed work.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONSTITUTION                                                                 │
│ Platform Constitutional Laws (LAW 2 · 3 · 7 · 8 · 9)                        │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ BUSINESS AUTHORITY                                                           │
│ Domain North Star §1–§12 (EFR · invariants · six registry classes §3.1)     │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ARCHITECTURAL MAP                                                            │
│ Domain Blueprint (this doc) §4 box · §5.1 surfaces · §4.2 boundaries        │
│ Platform Blueprint rollup (Governance family)                                │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PACKAGE AUTHORITY                                                            │
│ PAS-002 §4.1–§4.12 surfaces · PAS-002A B38–B42 enterprise gates             │
│ Generated skill: .cursor/skills/architecture-authority/SKILL.md             │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ IMPLEMENTATION                                                               │
│ packages/architecture-authority/src/                                         │
│   data/* · validators/* · surface/* · policy/* · workspace/*               │
│ Slices B1–B27 (PAS-002) · B38–B42 (PAS-002A) — Delivered                    │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ CI / GATE PLANE (contracts-only — not ERP runtime)                           │
│ pnpm quality:architecture · architecture:cycles · architecture:drift         │
│ pnpm check:foundation-disposition · check:architecture-* (002A family)       │
│ pnpm check:documentation-drift                                               │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONSUMERS (read-only registry truth)                                         │
│ Every @afenda/* package · apps/erp · governance scripts · agents           │
│ Scaffold: pnpm scaffold:package · foundation-registry-owner                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Integration invariants (E2E):**

| # | Invariant | Enforced at |
| --- | --- | --- |
| E1 | No package ships without registry row | Package registry + validate-registry |
| E2 | No upward layer leak | Layer registry + validate-forbidden-dependencies |
| E3 | No governance root imports governed runtime | PAS §3.3 · consumer proof gate (B40) |
| E4 | No kernel identity duplication in authority package | Kernel non-duplication gate (B38) |
| E5 | Disposition truth matches delivery evidence | Disposition completeness gate (B41) |
| E6 | Docs claim only what registries prove | documentation-drift + architecture:drift |
| E7 | Agents read surface registry before inferring structure | PAS §4.11 · check:architecture-authority-surface |

---

# 5.3 Governance Consumer Integration Map

| Consumer class | Integration surface | Import rule | Proof gate |
| --- | --- | --- | --- |
| **Foundation packages** | Root barrel · registry readers | `@afenda/architecture-authority` or `/surface` | B40 consumer proof |
| **Platform Kernel** | Reservation registry read · package registry listing | No BMD in kernel (ADR-0020) | B38 kernel non-duplication |
| **CI scripts** | Validators · composite gate | Local imports from package — not duplicated rules | `pnpm quality:architecture` |
| **Disposition subagents** | `foundation-disposition.registry.ts` | Edits via `foundation-registry-owner` only | `pnpm check:foundation-disposition` |
| **Documentation drift agent** | NS · Blueprint · PAS · registry parity | Read-only cross-check | `pnpm check:documentation-drift` |
| **Coding agents** | Skill + slice handoff + §0 quick path | Phase 0 from slice — not Blueprint prose | `/afenda-coding-session` |
| **Scaffold tooling** | `pnpm scaffold:package` | Registry row before filesystem | Architecture + disposition gates |

---

# 5.4 Documentation and Registry Sync Chain

```text
Domain NS §3.1 registry taxonomy (business names)
        ↓
Domain Blueprint §5.1 (architectural surfaces — this doc)
        ↓
PAS-002 §4.1–§4.12 (contract types + stability)
        ↓
packages/architecture-authority/src/data/*.ts (machine SSOT)
        ↓
docs/architecture/*.md (derived human views — package-registry.md · layer-registry.md · …)
        ↓
pnpm architecture:drift · pnpm check:documentation-drift
```

| Event | Update order |
| --- | --- |
| New business registry class meaning | Domain NS §3.1 first → this Blueprint §5.1 → PAS §4 → data module |
| New package | §4 box exists → registry owner → package-registry → disposition row → docs derived views |
| Slice delivered | PAS §12 → pas-status-index → Platform Blueprint §10 counts → PKGR02 evidence |
| Enterprise Accepted promotion | PAS-002A B42 → foundation-registry-owner promotes `PKGR02` authority |

---

# 6. Domain Grouping

### Platform governance family

```text
Platform layer
├── Architecture authority  ← this domain blueprint (live)
├── Kernel                  ← identity wire (adjacent — not owned)
├── Enterprise Knowledge    ← atoms (listed in package registry only)
└── AI governance           ← sibling consumer
```

**Domain gate:** None — box status **live** · `PKGR02` green-lane · Enterprise Accepted via PAS-002A.

---

# 7. PAS Creation Gate

PAS-002 and PAS-002A **satisfy** all conditions:

1. Box **Architecture authority** exists in §4 ✓
2. §3.1 matrix recorded in §4 Reasoning ✓
3. §4.2 responsibility row exists ✓
4. Layer Platform declared ✓
5. **Why separate** documented ✓
6. Registry PKG `PKG-019` linked ✓
7. Status **live** ✓
8. PAS numbers assigned (002 · 002A) ✓
9. Required ADRs exist ✓
10. §4.3 impact row exists ✓

No new PAS until a **new Blueprint box** passes §3.1 (none planned).

---

# 8. Blocked and Retired Boxes

| Blueprint box | Status | Blocker | Required before proceeding |
| --- | --- | --- | --- |
| — | — | None in this domain scope | — |

Accounting runtime and other LoB boxes are **out of scope** — see [Platform Blueprint](../architecture/afenda-architecture-blueprint.md).

---

# 9. Blueprint → PAS Handoff Contract

| §4 field | Pre-fills PAS |
| --- | --- |
| **Blueprint box** | `Architecture authority` — metadata on PAS-002 · PAS-002A |
| Registry PKG | `@afenda/architecture-authority` · `PKG-019` |
| Layer | Platform |
| Why separate | §4 Reasoning distill → PAS §1–§2 |
| §4.2 Owns / never owns | PAS §2 boundary sentence |
| Status | **live** · Enterprise Accepted ceiling (PAS-002A) |
| Governing PAS | PAS-002 · PAS-002A |
| §5 consumers | PAS metadata `Consumers` |
| §5.1 surfaces | PAS §4.1–§4.12 catalog |
| §5.2 E2E chain | PAS §0 agent path · skill extract |
| §8 blocker | None |

**Workflow:** Define (§4) → Plan (PAS §4 + §12) → Build (slice B1–B42 delivered) → Ship (§10 sync) ✓

---

# 10. PAS Inventory

**Total PAS at maturity: 2**

| PAS | Title | Blueprint box | Live / Total slices | Status |
| --- | --- | --- | --- | --- |
| PAS-002 | Architecture Authority Standard | **Architecture authority** | 27 / 27 | Live — MVP Authority closed |
| PAS-002A | Architecture Authority Enterprise Hardening | **Architecture authority** | 5 / 5 | Live — Enterprise Accepted |

> Sync from [`pas-status-index.md`](../PAS/pas-status-index.md) on every slice close. B1–B27 = PAS-002 · B38–B42 = PAS-002A.

---

# 11. PAS Maturity Rollup (read-only)

| Blueprint box | Registry PKG | PAS | Maturity |
| --- | --- | --- | --- |
| **Architecture authority** | `PKG-019` · `@afenda/architecture-authority` | PAS-002 | MVP Authority (closed) |
| **Architecture authority** | `PKG-019` · `@afenda/architecture-authority` | PAS-002A | Enterprise Accepted |

Disposition authority on `PKGR02`: **PAS-002A** (promoted 2026-06-28).

---

# 12. How to Add a Blueprint Box (This Domain)

This domain is **closed at one box**. To add a sibling:

1. Confirm change is not satisfiable as new PAS §4 surface inside **Architecture authority** (§5.1)
2. Run §3.1 matrix on Domain NS §4 capability
3. Amend Domain NS §13 → Platform Blueprint → this document if domain-scoped
4. ADR + `@foundation-registry-owner` if new PKG
5. §7 gate → new PAS

---

# 13. Agent Execution Rules

## Vibe-coding entry checklist

- [ ] Target box **Architecture authority** in §4
- [ ] §3.1 matrix outcome in §4 Reasoning
- [ ] §4.2 responsibility row exists
- [ ] Box status **live** — not blocked
- [ ] §10 lists PAS-002 or PAS-002A for the slice
- [ ] PAS maturity permits coding (Enterprise Accepted — yes)
- [ ] Slice handoff exists with complete **9 fields**
- [ ] `/afenda-coding-session` Phase 0 from slice
- [ ] `architecture-authority` skill loaded; `kernel-authority` on BMD/identity-adjacent slices

## Runtime chain (implement mode)

```text
§4 Architecture authority + live status
        ↓
§10 PAS-002 / PAS-002A · target §4 surface
        ↓
Slice 9-field handoff → Phase 0
        ↓
Implement in packages/architecture-authority/src/
        ↓
PAS §13 + PAS-002A §13.2–§13.3 gates → Delivered
        ↓
Sync §10 · pas-status-index · PKGR02 evidence · documentation-drift
```

## E2E integration checklist (before claiming delivery)

- [ ] Domain NS §4 capability traced to §4 box
- [ ] §5.1 surface maps to PAS §4 row with implementation path
- [ ] Registry data module updated (or disposition via registry owner)
- [ ] Validator wired in composite gate if new rule
- [ ] Surface registry (`§4.11`) updated
- [ ] Consumer proof still passes (no deep imports)
- [ ] Derived docs drift gates pass

---

# 14. Required Reviews and References

## Before accepting

- [ ] §4 box traces to Domain NS §4 + §13 with Decision IDs
- [ ] §3.1 matrix outcome in §4 Reasoning
- [ ] §4.2 complete for live box
- [ ] §4.3 impact row present
- [ ] §5.1 matches six registry classes + PAS §4.8–§4.12
- [ ] §5.2 full-stack chain documented
- [ ] §5.3 consumers ⊆ PAS metadata
- [ ] §5.4 sync chain documented
- [ ] §4.1 Evidence Register populated
- [ ] No Domain NS §1–§12 prose duplicated
- [ ] No gate commands duplicated from PAS §13
- [ ] [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) passes
- [ ] [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) Enterprise bar met

## References

| Document | Role |
| --- | --- |
| Domain North Star | [`architecture-authority-north-star.md`](../NORTHSTAR/architecture-authority-north-star.md) |
| Platform Blueprint | [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) |
| PAS-002 | [`PAS-002-ARCHITECTURE-AUTHORITY.md`](../PAS/PAS-002-ARCHITECTURE-AUTHORITY.md) |
| PAS-002A | [`PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md`](../PAS/PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) |
| Package tree | [`PAS-002-ARCHITECTURE-TREE.md`](../../packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md) |
| Surface registry | [`architecture-authority-surface-registry.ts`](../../packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts) |

---

# 15. Final Doctrine

This Blueprint owns **one Platform box — Architecture authority** — its internal registry composition (§5.1), **full-stack integration** from constitutional laws to consumer packages (§5.2–§5.4), and PAS-002 / PAS-002A governance.

| Identity | Owner | Changes when |
| --- | --- | --- |
| **Blueprint Box name** | This document §4 | ADR + §4.3 split/merge only |
| **`@afenda/architecture-authority`** | `package-registry.data.ts` | Registry owner — box unchanged |
| **`PKGR02` disposition** | `foundation-disposition.registry.ts` | `foundation-registry-owner` |

Domain North Star owns **business meaning** of registry classes and governance invariants. PAS owns **contracts, slices, gates**. Machine registries own **runtime truth**.

Business meaning change → Domain NS first. New surface in box → PAS §4 + §5.1. Package rename → registry first.
