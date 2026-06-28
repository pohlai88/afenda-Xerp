# Package Authority Standards (PAS)

`docs/PAS/` is the **canonical, authoritative location** for all Package Authority Standards in the Afenda ERP monorepo.

---

## What is a PAS?

A **Package Authority Standard (PAS)** is a governance document that defines:

- What a package **owns** (authority surfaces, contracts, vocabulary)
- What a package **must never own** (prohibited responsibilities)
- The **dependency rules** (allowed and prohibited imports)
- The **contract rules** (type safety, branding, serialization)
- The **required gates** (quality commands that must pass before any change is accepted)
- A **decision matrix** for boundary questions

PAS documents are human-readable long-form standards. Each package that crosses a governance threshold gets a PAS.

---

## PAS maturity labels

Every PAS carries a **maturity label**. Maturity is part of authority — agents must not treat a lower label as enterprise truth.

| Label | Meaning | Can be coded? | Can be treated as authority? |
| --- | --- | ---: | ---: |
| **Idea** | Directional concept only | No | No |
| **MVP Authority** | Enough to reserve boundary and start package skeleton | Limited | Partial |
| **Production Candidate** | Implementable with gates, tests, and known owners | Yes | Yes, after gates |
| **Enterprise Accepted** | Fully implemented, gated, documented, and drift-protected | Yes | Yes |
| **Deprecated / Superseded** | Replaced or retired | No new work | Historical only |
| **Retirement Candidate** | Controlled deprecation/supersession standard (e.g. PAS-005B) | Planning + gated slices only | Yes, after ADR + readiness gate |

Template source: [`.cursor/skills/kernel-authority/reference/pas-template.md`](../../.cursor/skills/kernel-authority/reference/pas-template.md)

---

## PAS header fields (continuation queue)

Every PAS above **Idea** maturity carries two **continuation fields** in the **PAS authority metadata table** (immediately after the document title):

| Field | Purpose |
| --- | --- |
| **Runtime status** | One factual sentence — what is **live** today (packages, gates, registries, cutovers) |
| **Remaining slices** | Ordered queue of work to continue; `none` when the planned sequence is closed; `(proposed)` when no handoff file exists yet |

**Sync surfaces on every slice close:**

1. PAS doc — metadata table + required-gates table + maturity blockquote
2. Package authority skill — `## PAS rollout status` section
3. [`pas-status-index.md`](pas-status-index.md) — section table + next sequence item

Agents should read **`runtime_status`** + **`remaining_slices`** first when resuming PAS work.

---

## Numbering convention

| Format | Meaning |
|---|---|
| `PAS-001` | First package authority standard |
| `PAS-NNN` | Sequentially assigned, never reused |
| `PAS-NNNA` | Derived extension standard (e.g. PAS-001A ERP integration, PAS-004B kernel consumer) — does not amend parent §1–§16 unless explicit amendment slice |

Numbering is assigned when a package is promoted to Platform or Foundation layer, or when its boundary requires formal governance.

---

## Canonical location rule

> **All PAS long-form documents live here — `docs/PAS/` — and nowhere else.**

- Do not place canonical PAS content in `packages/*/` source directories.
- Do not place canonical PAS content in `docs/architecture/` (architecture docs are a separate layer).
- Do not duplicate PAS long-form content in `.cursor/skills/` — skills are execution adapters, not canonical standards.

Package-local files (`packages/*/PAS-NNN-*.md`) are **tombstone pointers only** — they exist for backwards compatibility with older links and contain no canonical content.

---

## Domain folder layout

Each governed domain owns a **nested folder** under `docs/PAS/` — same pattern as [`KERNEL/`](KERNEL/README.md):

```text
docs/PAS/
├── README.md                    ← this index
├── pas-status-index.md          ← slice closure registry
└── <DOMAIN-FOLDER>/
    ├── README.md                ← family index + agent read order
    ├── PAS-NNN-*.md             ← canonical long-form PAS documents
    ├── archive/                 ← optional (kernel only today)
    └── SLICE/
        ├── README.md            ← slice family SSOT pointer
        ├── *-slice-catalog.md   ← build order / closure table
        └── b<N>-*.md            ← one handoff per slice
```

| Domain folder | PAS IDs | Slice catalog |
| --- | --- | --- |
| [`KERNEL/`](KERNEL/README.md) | PAS-001 · PAS-001A · PAS-001B | [`kernel-slice-catalog.md`](KERNEL/SLICE/kernel-slice-catalog.md) |
| [`ARCHITECTURE-AUTHORITY/`](ARCHITECTURE-AUTHORITY/README.md) | PAS-002 · PAS-002A | [`architecture-authority-slice-catalog.md`](ARCHITECTURE-AUTHORITY/SLICE/architecture-authority-slice-catalog.md) |
| [`ACCOUNTING-STANDARDS/`](ACCOUNTING-STANDARDS/README.md) | PAS-003 | [`accounting-slice-catalog.md`](ACCOUNTING-STANDARDS/SLICE/accounting-slice-catalog.md) |
| [`ENTERPRISE-KNOWLEDGE/`](ENTERPRISE-KNOWLEDGE/README.md) | PAS-004–PAS-004D | [`enterprise-knowledge-slice-catalog.md`](ENTERPRISE-KNOWLEDGE/SLICE/enterprise-knowledge-slice-catalog.md) |
| [`CSS-AUTHORITY/`](CSS-AUTHORITY/README.md) | PAS-005 · PAS-005A · PAS-005B | [`css-authority-slice-catalog.md`](CSS-AUTHORITY/SLICE/css-authority-slice-catalog.md) |

**Legacy:** flat `docs/PAS/slice/` was removed — slice handoffs live only under `<DOMAIN-FOLDER>/SLICE/`.

---

## Index

| Standard | Package | Layer | Maturity |
|---|---|---|---|
| [PAS-001](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) | `@afenda/kernel` | Platform | Enterprise Accepted |
| [PAS-001A](KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | `apps/erp` (kernel consumer) | Application | Production Candidate (B71–B75 delivered 2026-06-29) |
| [PAS-001B](KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | `@afenda/kernel` (`erp-domain/`) | Platform | Catalog Authority (B76–B106 delivered; 28/28 vocabulary modules) |
| [PAS-002](ARCHITECTURE-AUTHORITY/PAS-002-ARCHITECTURE-AUTHORITY.md) | `@afenda/architecture-authority` | Platform | MVP Authority |
| [PAS-002A](ARCHITECTURE-AUTHORITY/PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) | `@afenda/architecture-authority` | Platform | Enterprise Accepted (B38–B42 delivered) |
| [PAS-003](ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) | `@afenda/accounting-standards` | Foundation | Production Candidate |
| [PAS-004](ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) | `@afenda/enterprise-knowledge` | Platform | MVP Authority (constitutional charter) |
| [PAS-004A](ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) | `@afenda/enterprise-knowledge` | Platform | Production Candidate (post-MVP rollout; derived from PAS-004) |
| [PAS-004B](ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) | `@afenda/enterprise-knowledge` | Platform | Enterprise Accepted (B33–B37; scorecard 40/40; derived from PAS-004A) |
| [PAS-004C](ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) | `@afenda/enterprise-knowledge` | Platform | Production Candidate — B38–B48 delivered; scorecard 58/58; derived from PAS-004B |
| [PAS-004D](ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md) | `@afenda/enterprise-knowledge` | Platform | Proposed — B49–B54; mirror sync, legacy retirement, corpus depth; derived from PAS-004C |
| [PAS-005](CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md) | `@afenda/css-authority` | Design | MVP Authority — B26–B37 delivered; 605-token registry; runtime cutover live |
| [PAS-005A](CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) | `@afenda/shadcn-studio` | Design / Presentation | MVP Authority — B38–B42p delivered; strangler sequence complete; derived from PAS-005 |
| [PAS-005B](CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md) | `@afenda/design-system` (retiring) | Design / Deprecation | Retirement Candidate — B43 delivered; B44 readiness gate next; derived from PAS-005 + PAS-005A |

Package-local annotated trees:

- Kernel: [`packages/kernel/PAS-001-KERNEL-TREE.md`](../../packages/kernel/PAS-001-KERNEL-TREE.md)
- Architecture authority: [`packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md`](../../packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md)

Slice closure registry: [`pas-status-index.md`](pas-status-index.md)

### Kernel PAS family (composed governance layer)

Platform Kernel chain SSOT: [`KERNEL/README.md`](KERNEL/README.md) · slices: [`KERNEL/SLICE/`](KERNEL/SLICE/README.md) · implementation archive: [`KERNEL/archive/`](KERNEL/archive/README.md).

| Composed SSOT | Archive (§4–§16 detail) |
| --- | --- |
| [KERNEL/PAS-001](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) | [archive/PAS-001](KERNEL/archive/PAS-001-KERNEL-AUTHORITY-STANDARD.md) |
| [KERNEL/PAS-001A](KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | [archive/PAS-001A](KERNEL/archive/PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md) |
| [KERNEL/PAS-001B](KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | [archive/PAS-001B](KERNEL/archive/PAS-001B-KERNEL-ERP-DOMAIN-VOCABULARY-STANDARD.md) |

Agent read order: [Kernel North Star](../NORTHSTAR/kernel-north-star.md) → [Kernel Blueprint](../BLUEPRINT/kernel-blueprint.md) → [KERNEL/README.md](KERNEL/README.md) → [KERNEL/SLICE/README.md](KERNEL/SLICE/README.md).

### Accounting Standards PAS family (composed governance layer)

Accounting Standards chain SSOT: [`ACCOUNTING-STANDARDS/README.md`](ACCOUNTING-STANDARDS/README.md) · slices: [`ACCOUNTING-STANDARDS/SLICE/`](ACCOUNTING-STANDARDS/SLICE/README.md) · catalog: [`accounting-slice-catalog.md`](ACCOUNTING-STANDARDS/SLICE/accounting-slice-catalog.md).

| Composed SSOT | Package |
| --- | --- |
| [ACCOUNTING-STANDARDS/PAS-003](ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) | `@afenda/accounting-standards` |

Agent read order: [Accounting Standards North Star](../NORTHSTAR/accounting-standards-north-star.md) → [Accounting Standards Blueprint](../BLUEPRINT/accounting-standards-blueprint.md) → [ACCOUNTING-STANDARDS/README.md](ACCOUNTING-STANDARDS/README.md) → [ACCOUNTING-STANDARDS/SLICE/README.md](ACCOUNTING-STANDARDS/SLICE/README.md).

### Architecture Authority PAS family (composed governance layer)

Architecture Authority chain SSOT: [`ARCHITECTURE-AUTHORITY/README.md`](ARCHITECTURE-AUTHORITY/README.md) · slices: [`ARCHITECTURE-AUTHORITY/SLICE/`](ARCHITECTURE-AUTHORITY/SLICE/README.md) · catalog: [`architecture-authority-slice-catalog.md`](ARCHITECTURE-AUTHORITY/SLICE/architecture-authority-slice-catalog.md).

| Composed SSOT | Package |
| --- | --- |
| [ARCHITECTURE-AUTHORITY/PAS-002](ARCHITECTURE-AUTHORITY/PAS-002-ARCHITECTURE-AUTHORITY.md) | `@afenda/architecture-authority` |
| [ARCHITECTURE-AUTHORITY/PAS-002A](ARCHITECTURE-AUTHORITY/PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) | `@afenda/architecture-authority` |

Agent read order: [Architecture Authority North Star](../NORTHSTAR/architecture-authority-north-star.md) → [Architecture Authority Blueprint](../BLUEPRINT/architecture-authority-blueprint.md) → [ARCHITECTURE-AUTHORITY/README.md](ARCHITECTURE-AUTHORITY/README.md) → [ARCHITECTURE-AUTHORITY/SLICE/README.md](ARCHITECTURE-AUTHORITY/SLICE/README.md).

Package-local annotated tree: [`packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md`](../../packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md)

### CSS Authority PAS family (composed governance layer)

Design Token Authority chain SSOT: [`CSS-AUTHORITY/README.md`](CSS-AUTHORITY/README.md) · slices: [`CSS-AUTHORITY/SLICE/`](CSS-AUTHORITY/SLICE/README.md) · catalog: [`css-authority-slice-catalog.md`](CSS-AUTHORITY/SLICE/css-authority-slice-catalog.md).

| Composed SSOT | Package |
| --- | --- |
| [CSS-AUTHORITY/PAS-005](CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md) | `@afenda/css-authority` |
| [CSS-AUTHORITY/PAS-005A](CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) | `@afenda/shadcn-studio` |
| [CSS-AUTHORITY/PAS-005B](CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md) | `@afenda/design-system` (retiring) |

Agent read order: [Design Token Authority North Star](../NORTHSTAR/css-authority-north-star.md) → [CSS Authority Blueprint](../BLUEPRINT/css-authority-blueprint.md) → [CSS-AUTHORITY/README.md](CSS-AUTHORITY/README.md) → [CSS-AUTHORITY/SLICE/README.md](CSS-AUTHORITY/SLICE/README.md).

### Enterprise Knowledge PAS family (composed governance layer)

Enterprise Knowledge chain SSOT: [`ENTERPRISE-KNOWLEDGE/README.md`](ENTERPRISE-KNOWLEDGE/README.md) · slices: [`ENTERPRISE-KNOWLEDGE/SLICE/`](ENTERPRISE-KNOWLEDGE/SLICE/README.md) · catalog: [`enterprise-knowledge-slice-catalog.md`](ENTERPRISE-KNOWLEDGE/SLICE/enterprise-knowledge-slice-catalog.md).

| Composed SSOT | Package |
| --- | --- |
| [ENTERPRISE-KNOWLEDGE/PAS-004](ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) | `@afenda/enterprise-knowledge` |
| [ENTERPRISE-KNOWLEDGE/PAS-004A](ENTERPRISE-KNOWLEDGE/PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) | `@afenda/enterprise-knowledge` |
| [ENTERPRISE-KNOWLEDGE/PAS-004B](ENTERPRISE-KNOWLEDGE/PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) | `@afenda/enterprise-knowledge` |
| [ENTERPRISE-KNOWLEDGE/PAS-004C](ENTERPRISE-KNOWLEDGE/PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) | `@afenda/enterprise-knowledge` |
| [ENTERPRISE-KNOWLEDGE/PAS-004D](ENTERPRISE-KNOWLEDGE/PAS-004D-ENTERPRISE-KNOWLEDGE-OPERATIONAL-CLOSURE-STANDARD.md) | `@afenda/enterprise-knowledge` |

Agent read order: [Enterprise Knowledge North Star](../NORTHSTAR/enterprise-knowledge-north-star.md) → [Enterprise Knowledge Blueprint](../BLUEPRINT/enterprise-knowledge-blueprint.md) → [ENTERPRISE-KNOWLEDGE/README.md](ENTERPRISE-KNOWLEDGE/README.md) → [ENTERPRISE-KNOWLEDGE/SLICE/README.md](ENTERPRISE-KNOWLEDGE/SLICE/README.md).

---

## Agent skill entrypoints

Each PAS has a corresponding Cursor agent skill for IDE-optimized enforcement:

| PAS | Agent Skill |
|---|---|
| PAS-001 | `.cursor/skills/kernel-authority/SKILL.md` |
| PAS-001A | `.cursor/skills/kernel-authority/SKILL.md` + `multi-tenancy-erp` |
| PAS-001B | `.cursor/skills/kernel-authority/SKILL.md` |
| PAS-002 | `.cursor/skills/architecture-authority/SKILL.md` |
| PAS-003 | `.cursor/skills/accounting-standards-authority/SKILL.md` |
| PAS-004 | `.cursor/skills/enterprise-knowledge/SKILL.md` |
| PAS-005 | `.cursor/skills/css-authority/SKILL.md` |
| PAS-005A | `.cursor/skills/shadcn-studio-authority/SKILL.md` |
| PAS-005B | `.cursor/skills/css-authority/SKILL.md` + `.cursor/skills/shadcn-studio-authority/SKILL.md` |
| Accessibility (cross-PAS) | `.cursor/skills/afenda-accessibility/SKILL.md` |

Appendix (temporary borrow refs): [PAS-003 Appendix A](ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md#appendix-a--borrow-reference-inventory-temporary)

---

## How to add a new PAS

0. Confirm the package or domain authority appears in [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) with status, layer, and **why separate** ([ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md)).
1. Assign the next `PAS-NNN` number from the index above.
2. Copy templates from `.cursor/skills/kernel-authority/reference/pas-template.md` (index) and the split files `pas-doc-template.md`, `pas-skill-template.md`, `pas-slice-template.md`, `pas-reference-templates.md`.
3. Create or reuse a domain folder: `docs/PAS/<DOMAIN-FOLDER>/` with `README.md`, canonical `PAS-NNN-*.md`, and `SLICE/` (catalog + handoffs). Mirror [`KERNEL/`](KERNEL/README.md) layout.
4. Register it in the index table and domain folder table above.
5. Create the corresponding Cursor skill under `.cursor/skills/<package-name>-authority/SKILL.md`.
6. Add a tombstone pointer in `packages/<package-name>/` if the package is in the monorepo.
