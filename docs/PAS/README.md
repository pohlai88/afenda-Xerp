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

## Numbering convention

| Format | Meaning |
|---|---|
| `PAS-001` | First package authority standard |
| `PAS-NNN` | Sequentially assigned, never reused |

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

| Standard | Package | Layer | Status |
|---|---|---|---|
| [PAS-001](PAS-001-KERNEL-AUTHORITY-STANDARD.md) | `@afenda/kernel` | Platform | Active |

---

## Agent skill entrypoints

Each PAS has a corresponding Cursor agent skill for IDE-optimized enforcement:

| PAS | Agent Skill |
|---|---|
| PAS-001 | `.cursor/skills/kernel-authority/SKILL.md` |

---

## How to add a new PAS

1. Assign the next `PAS-NNN` number from the index above.
2. Copy the template from `.cursor/skills/kernel-authority/reference/pas-template.md`.
3. Create `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`.
4. Register it in the index table above.
5. Create the corresponding Cursor skill under `.cursor/skills/<package-name>-authority/SKILL.md`.
6. Add a tombstone pointer in `packages/<package-name>/` if the package is in the monorepo.
