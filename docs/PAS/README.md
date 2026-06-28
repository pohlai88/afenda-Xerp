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

## Index

| Standard | Package | Layer | Maturity |
|---|---|---|---|
| [PAS-001](PAS-001-KERNEL-AUTHORITY-STANDARD.md) | `@afenda/kernel` | Platform | Enterprise Accepted |
| [PAS-001A](PAS-001A-KERNEL-ERP-PRODUCTION-INTEGRATION-STANDARD.md) | `apps/erp` (kernel consumer) | Application | Production Candidate (B71–B75 delivered 2026-06-29; derived from PAS-001) |
| [PAS-002](PAS-002-ARCHITECTURE-AUTHORITY.md) | `@afenda/architecture-authority` | Platform | MVP Authority |
| [PAS-002A](PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) | `@afenda/architecture-authority` | Platform | Enterprise Accepted (B38–B42 delivered) |
| [PAS-003](PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md) | `@afenda/accounting-standards` | Foundation | Production Candidate |
| [PAS-004](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) | `@afenda/enterprise-knowledge` | Platform | MVP Authority (constitutional charter) |
| [PAS-004A](PAS-004A-ENTERPRISE-KNOWLEDGE-PLATFORM-STANDARD.md) | `@afenda/enterprise-knowledge` | Platform | Production Candidate (post-MVP rollout; derived from PAS-004) |
| [PAS-004B](PAS-004B-ENTERPRISE-KNOWLEDGE-KERNEL-CONSUMER-STANDARD.md) | `@afenda/enterprise-knowledge` | Platform | Enterprise Accepted (B33–B37; scorecard 40/40; derived from PAS-004A) |
| [PAS-004C](PAS-004C-ENTERPRISE-KNOWLEDGE-SEMANTIC-MODEL-STANDARD.md) | `@afenda/enterprise-knowledge` | Platform | Production Candidate — B38–B48 delivered; scorecard 58/58; derived from PAS-004B |
| [PAS-005](PAS-005-CSS-AUTHORITY-STANDARD.md) | `@afenda/css-authority` | Design | MVP Authority — B26–B37 delivered; 605-token registry; runtime cutover live |
| [PAS-005A](PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) | `@afenda/shadcn-studio` | Design / Presentation | MVP Authority — B38–B42p delivered; strangler sequence complete; derived from PAS-005 |

Package-local annotated trees:

- Kernel: [`packages/kernel/PAS-001-KERNEL-TREE.md`](../../packages/kernel/PAS-001-KERNEL-TREE.md)
- Architecture authority: [`packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md`](../../packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md)

Slice closure registry: [`pas-status-index.md`](pas-status-index.md)

---

## Agent skill entrypoints

Each PAS has a corresponding Cursor agent skill for IDE-optimized enforcement:

| PAS | Agent Skill |
|---|---|
| PAS-001 | `.cursor/skills/kernel-authority/SKILL.md` |
| PAS-001A | `.cursor/skills/kernel-authority/SKILL.md` + `multi-tenancy-erp` |
| PAS-002 | `.cursor/skills/architecture-authority/SKILL.md` |
| PAS-003 | `.cursor/skills/accounting-standards-authority/SKILL.md` |
| PAS-004 | `.cursor/skills/enterprise-knowledge/SKILL.md` |
| PAS-005 | `.cursor/skills/css-authority/SKILL.md` |
| PAS-005A | `.cursor/skills/shadcn-studio-authority/SKILL.md` |
| Accessibility (cross-PAS) | `.cursor/skills/afenda-accessibility/SKILL.md` |

Appendix (temporary borrow refs): [PAS-003 Appendix A](PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md#appendix-a--borrow-reference-inventory-temporary)

---

## How to add a new PAS

1. Assign the next `PAS-NNN` number from the index above.
2. Copy templates from `.cursor/skills/kernel-authority/reference/pas-template.md` (index) and the split files `pas-doc-template.md`, `pas-skill-template.md`, `pas-slice-template.md`, `pas-reference-templates.md`.
3. Create `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`.
4. Register it in the index table above.
5. Create the corresponding Cursor skill under `.cursor/skills/<package-name>-authority/SKILL.md`.
6. Add a tombstone pointer in `packages/<package-name>/` if the package is in the monorepo.
