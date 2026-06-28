# Afenda Platform North Star

| Field | Value |
| --- | --- |
| **Document class** | `platform_north_star` |
| **Document role** | Root specification — platform scope |
| **Authority** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Canonical location** | `docs/architecture/afenda-platform-north-star.md` |
| **Distinct from** | Per-PAS `§1 North Star` (package-scoped intent inside each PAS) |
| **Does not confer** | Package boundaries, registry rows, or implementation authority |
| **Next document** | [Architecture Blueprint](afenda-architecture-blueprint.md) |

> **One sentence:** Afenda is a governed, multi-tenant enterprise ERP platform where you write a feature spec once and any vibe-coding agent can build it — correctly, consistently, forever.

---

# 0. Agent Quick Path

> Read this section first. Full detail in §1–§15.

**What this document is:** The root specification for the entire Afenda platform. Every PAS, Blueprint, and Slice derives from this document. Nothing is above it.

**Reading order for an agent starting a new feature:**

1. This document — understand the platform and find the relevant §4 authority surface
2. [Architecture Blueprint](afenda-architecture-blueprint.md) — find the package/domain box for your feature
3. Target PAS — read the full specification for that package
4. Target Slice — read the exact work order
5. Implement

**Hard stops:**

- Do not build a feature that has no §4 authority surface declared here
- Do not create a PAS for a package not declared in the Blueprint
- Do not implement a slice until the PAS maturity permits it
- Do not bypass this chain: North Star → Blueprint → PAS → Slice → Code

**Required reading before any implementation:** §4 (find which authority surface owns your feature) → §12 (find which PAS owns that surface) → Blueprint → PAS.

---

# 1. Platform Definition

Afenda is an enterprise resource planning platform for organizations that operate across legal entities, currencies, and regulatory contexts.

**What Afenda is:** A layered platform where each feature area owns a narrow authority surface, every feature spec is written once in a PAS, and any vibe-coding agent can read that PAS and build the feature — correctly, consistently, without asking the author again.

**What Afenda is not:** A collection of apps glued together. Each piece of Afenda is governed — its spec lives in a PAS, its rules in registries, its gates in CI. Informal documentation does not count.

> **This document answers:** "What is Afenda and what is it expected to do?"
>
> **This document does not answer:** "Which package owns a specific contract?" (see Architecture Blueprint + PAS)

---

# 2. Platform Boundary

**Afenda owns:**

- Platform-wide identity, permissions, and tenant isolation
- All canonical enterprise wire contracts (IDs, contexts, vocabularies)
- The accepted meaning of every contested business term (via Enterprise Knowledge)
- Versioned financial-standard rules (via Accounting Standards)
- Visual truth — tokens, primitives, UI contracts
- All ERP domain runtime: accounting, consolidation, inventory, HRM, CRM, procurement
- Documentation governance: every feature spec lives in a PAS

**Afenda never owns:**

- Customer-specific business policy or country-specific implementation rules
- Deployment configuration (cloud provider, infrastructure topology)
- Tenant-editable or customer-editable knowledge stores
- Free-form AI advice without registry-backed evidence
- Features that are not declared in this document's §4 authority surfaces and §12 catalog

---

# 3. Platform Architecture

## 3.1 First principles

1. **Write once, build forever** — a feature spec written in a PAS never needs to be re-explained to an agent.
2. **Docs lead; machines enforce** — spec changes precede code; CI gates prove alignment.
3. **Registry-first** — every package is declared, layered, and dependency-bound before implementation.
4. **Evidence-backed status** — "complete" requires file, test, or gate proof; aspiration is not authority.
5. **Honesty over aspiration** — maturity labels and runtime status must not overstate delivery.
6. **Serialized slices** — features are built through ordered slices with gates, not big-bang implementation.
7. **AI as implementer, not architect** — agents execute from PAS specs; they do not invent feature designs.

## 3.2 Platform dependencies

| Dependency | Type | Purpose |
| --- | --- | --- |
| PostgreSQL (Neon) | Database | Multi-tenant data persistence with RLS |
| Next.js | Runtime | ERP and docs delivery surfaces |
| Better Auth | Identity | Authentication and session management |
| Trigger.dev | Execution | Durable jobs and workflow orchestration |
| Cloudflare R2 | Storage | Tenant-scoped object storage |
| Tailwind v4 + shadcn/ui | UI framework | Governed component primitives |

---

# 4. Platform Authority Surfaces

Each row is a feature area. Each feature area has one governing PAS. When you want to build something, find it here first.

| Feature area | What it specifies | Governing PAS | Status |
| --- | --- | --- | --- |
| **Platform governance** | Which packages exist, layer rules, dependency boundaries | PAS-002 | Live |
| **Kernel & identity** | Canonical IDs, operating contexts, ERP domain vocabulary | PAS-001, PAS-001A, PAS-001B | Live |
| **Enterprise knowledge** | Accepted meaning of contested business terms | PAS-004 … PAS-004D | Live |
| **Accounting standards** | IFRS/MFRS/SFRS rules, validation before posting | PAS-003 | Live (B1+ pending) |
| **CSS & design tokens** | Visual tokens, CSS authority registry | PAS-005 | Live |
| **UI primitives & presentation** | Governed component primitives, shadcn/studio integration | PAS-005A | Live |
| **Accounting runtime** | Journal posting, ledger, chart of accounts | PAS-006+ | Blocked (ADR-0010) |
| **Consolidation** | Group consolidation calculations | Planned | Planned |
| **Intercompany** | IC pricing, eliminations, matching | Planned | Planned |
| **Tax** | Tax computation and filing workflows | Planned | Planned |
| **Finance / management** | Management reporting, finance ops | Planned | Planned |
| **Financial reporting** | Financial statement generation | Planned | Planned |
| **Inventory** | Master data, stock, movements | ADR-0019 + PAS-001B vocab | Live |
| **Procurement** | Source-to-pay | Planned | Planned |
| **HRM** | People operations | Planned | Planned |
| **CRM** | Customer lifecycle | Planned | Planned |

---

# 5. Platform Responsibilities

**Afenda platform never owns:**

- Customer-defined business rules not declared in a PAS
- Country-specific statutory filing logic (Tax PAS will govern approved implementations)
- Tenant-editable knowledge stores or custom terminology overrides
- Free-form AI accounting judgment without registry evidence
- Features delivered outside the North Star → Blueprint → PAS → Slice chain
- UI screens built without a governing PAS and Slice
- Packages created without a Blueprint box and PAS

---

# 6. Platform Structure

The complete documentation hierarchy. Each level derives from the one above it.

```text
afenda-platform-north-star.md   ← root spec; this document
        ↓
afenda-architecture-blueprint.md ← feature map; which packages/domains exist
        ↓
ADR (when a cross-cutting decision is needed)
        ↓
PAS-NNN  ← feature spec; one per package/domain
        ↓
docs/PAS/CSS-AUTHORITY/SLICE/bN-*.md  ← work order; one per implementation unit
        ↓
Code (packages/** + apps/**)
        ↓
Tests + CI gates
        ↓
Acceptance
```

**Rules:**

- Each level may only be authored after the level above it exists.
- Nothing skips a level.
- Code that is not traceable to a Slice is not governed.

---

# 7. Platform Decision Matrix

When you have a feature idea or implementation request, use this table to decide what to create.

| Question | If yes → |
| --- | --- |
| Is this platform-wide behavior that applies to all features? | Update §4 or §5 of this document |
| Is this a new package/domain that does not exist in the Blueprint? | Add a Blueprint box first, then create a PAS |
| Does this package already have a PAS? | Go to the PAS — do not re-author |
| Is this a new feature area inside an existing package? | Add a §4 surface to the existing PAS |
| Is this a discrete implementation unit inside an existing PAS? | Create a Slice |
| Does this require an irreversible or cross-cutting architectural decision? | Write an ADR before the PAS |
| Is this a customer-specific rule or configuration? | Does not belong in Afenda — see §5 |
| Is this a feature without a §4 authority surface? | Stop — add the surface first |

---

# 8. Documentation Rules

## 8.1 Doctrine

| Layer | Owns |
| --- | --- |
| **North Star** | WHY + what the platform is expected to do |
| **Architecture Blueprint** | WHAT EXISTS — packages, domains, feature map |
| **ADR** | WHY a major architectural decision was made |
| **PAS** | Feature specification — what to build, rules, acceptance |
| **Slice** | Work order — build this specific piece right now |
| **Code** | Implements the Slice; nothing more |

No document may duplicate the authority of the document above or below it.

## 8.2 Structural rules

1. Every feature area has exactly one root PAS.
2. Every root PAS derives from one Blueprint authority surface.
3. Every Slice derives from one PAS.
4. Code never bypasses a Slice.
5. A Slice never bypasses its PAS.
6. A PAS never bypasses the Blueprint.
7. The Blueprint never bypasses this North Star.
8. A PAS may have derived extensions (`PAS-NNNA`) without amending the root.

## 8.3 Spec completeness rule

A feature spec (PAS) is complete only when:
- Boundary is one enforceable sentence
- All authority surfaces are declared in §4
- Total slice count is declared in §12
- All required gates pass

---

# 9. Runtime Rules

How the documentation chain reaches running software:

```text
North Star §4 identifies the feature area
        ↓
Blueprint identifies the package/domain
        ↓
PAS §4 specifies what the feature does and its rules
        ↓
PAS §12 Slice Catalog lists every implementation unit
        ↓
Slice handoff block (9 fields) is the agent's work order
        ↓
Agent implements exactly the Slice; no more, no less
        ↓
Required gates run (typecheck + test:run + domain gates)
        ↓
PAS §11 acceptance criteria are verified
        ↓
Slice is marked Delivered; PAS remaining_slices is updated
```

An agent that skips any step in this chain is not governed and will produce drift.

---

# 10. Development Sequence

## 10.1 To build a new platform feature area

1. Confirm the feature area is in §4 above (add it if not)
2. Add a Blueprint box (status: planned, layer, why separate)
3. Write ADR if the decision is cross-cutting or irreversible
4. Author PAS — write the spec: boundary, authority surfaces, rules, slices
5. Plan slices — use `pas-slice-planner`; declare total slice count in PAS §12
6. Execute slices in order — each slice is one agent session
7. Verify gates after each slice
8. When all slices pass: PAS reaches Enterprise Accepted maturity

## 10.2 Long-term platform direction

- **Foundation-first ERP** — platform, kernel, knowledge, standards stabilize before domain runtime expands
- **Composable domain packages** — each business domain is a separate PAS-governed package
- **Standards-backed finance** — IFRS/MFRS/SFRS rules are first-class PAS-governed authority
- **Semantic platform** — enterprise meaning, kernel wire shapes, and UI labels stay aligned through gates
- **AI-native delivery** — skills, PAS, registries, and gates exist so agents build correctly at scale

---

# 11. Enterprise Acceptance

The platform architecture is accepted when:

| Criterion | Gate |
| --- | --- |
| Every §4 authority surface has a PAS (live or declared planned with Blueprint box) | `pnpm check:documentation-drift` |
| No package exists without a Blueprint box and disposition registry entry | `pnpm check:foundation-disposition` |
| No PAS lists a consumer package absent from the Blueprint | `pnpm check:documentation-drift` |
| All live PAS gates pass | Per-PAS required gates |
| Blueprint PAS inventory count matches PAS index | Manual review |
| North Star §12 catalog matches Blueprint traceability table | Manual review |

---

# 12. Platform Authority Catalog

The complete list of PAS families by layer. Every § 4 surface maps to one row here.

**Current live:** 5 root PAS · 14 total documents (including derived extensions)
**Planned:** 9 additional root PAS
**Total at platform maturity:** ~15 root PAS · ~25+ total documents

| Layer | Feature area | Package | PAS | Status |
| --- | --- | --- | --- | --- |
| Platform | Platform governance & registries | `@afenda/architecture-authority` | PAS-002, PAS-002A | Live |
| Platform | Kernel contracts & ERP vocabulary | `@afenda/kernel` | PAS-001, PAS-001A, PAS-001B | Live |
| Platform | Enterprise knowledge | `@afenda/enterprise-knowledge` | PAS-004 … PAS-004D | Live |
| Design | CSS authority & design tokens | `@afenda/css-authority` | PAS-005 | Live |
| Design | UI primitives & presentation | `@afenda/ui` / `@afenda/shadcn-studio` | PAS-005A, PAS-005B | Live |
| Foundation | Accounting standards authority | `@afenda/accounting-standards` | PAS-003 | Live (B1+ pending) |
| Domain | Accounting runtime (posting, ledger) | `@afenda/accounting` | PAS-006+ | Blocked |
| Domain | Consolidation | `@afenda/consolidation` | Planned | Planned |
| Domain | Intercompany | `@afenda/intercompany` | Planned | Planned |
| Domain | Tax | `@afenda/tax` | Planned | Planned |
| Domain | Finance / management reporting | `@afenda/finance` | Planned | Planned |
| Domain | Financial reporting (statements) | `@afenda/reporting` | Planned | Planned |
| Domain | Inventory | `@afenda/database` + kernel vocab | ADR-0019 + PAS-001B | Live |
| Domain | Procurement | `@afenda/procurement` | Planned | Planned |
| Domain | HRM | `@afenda/hrm` | Planned | Planned |
| Domain | CRM | `@afenda/crm` | Planned | Planned |

Packages governed by ADRs and registries today (auth, database, permissions, appshell, observability) will receive PAS documents when their boundary complexity crosses the governance threshold.

---

# 13. Required Platform Gates

Run these to verify the documentation chain is intact:

```bash
pnpm check:documentation-drift      # no stale markers or undeclared references
pnpm check:foundation-disposition   # all packages have registry entries
pnpm quality:architecture           # layer/dependency/ownership rules
pnpm architecture:cycles            # no circular dependencies
pnpm architecture:drift             # no undeclared packages
```

A North Star update that causes any gate to fail must be corrected before merging.

---

# 14. Reusable Architecture Templates

Use these fill-in templates when authoring new documents in this chain.

| Template | Location | Use when |
| --- | --- | --- |
| `north-star-template.md` | `.cursor/skills/kernel-authority/reference/north-star-template.md` | Starting a domain-level North Star (e.g. Accounting North Star) |
| `blueprint-template.md` | `.cursor/skills/kernel-authority/reference/blueprint-template.md` | Authoring or extending the Architecture Blueprint |
| `pas-doc-template.md` | `.cursor/skills/kernel-authority/reference/pas-doc-template.md` | Authoring any PAS document |
| `pas-slice-template.md` | `.cursor/skills/kernel-authority/reference/pas-slice-template.md` | Writing any Slice handoff |

Template index: `.cursor/skills/kernel-authority/reference/pas-template.md`

---

# 15. Final Doctrine

Afenda is built on one rule: **write the spec once, build forever**.

Every feature area has exactly one PAS. Every PAS has exactly one set of slices. Every slice is one agent session. No agent may build what is not specified. No spec may be created for what is not declared.

> **This document is the root.** Nothing is above it. Everything derives from it.

> **May belong here:** platform definition, boundary, architecture dependencies, authority surface catalog, documentation rules, platform acceptance criteria, template references.

> **Belongs outside:** package contracts (PAS §4), implementation sequences (PAS §10–§12), registry rows (machine registries), feature roadmaps (pas-status-index.md).
