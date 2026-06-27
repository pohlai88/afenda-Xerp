# PAS Template — Package Authority Standard

Reusable template for all future Package Authority Standards under `docs/PAS/`.

← Back to [SKILL.md](../SKILL.md) | Index: [docs/PAS/README.md](../../../../docs/PAS/README.md)

---

## How to use this template

1. Assign the next `PAS-NNN` number from `docs/PAS/README.md`.
2. Copy the markdown block below.
3. Create `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`.
4. Fill in all fields. Do not leave placeholders in a committed doc.
5. Register the new PAS in the index table in `docs/PAS/README.md`.
6. Create the corresponding Cursor skill: `.cursor/skills/<package-name>-authority/SKILL.md`.
7. Add a tombstone pointer in `packages/<package-name>/` if the package exists in the monorepo.

---

## Template

```markdown
# PAS-NNN — <Package Name> Authority Standard

> **Agent skill entrypoint:** `.cursor/skills/<package-name>-authority/SKILL.md`
> **Canonical location:** `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`
> **Package-local pointer:** `packages/<package-name>/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`

| Field             | Value                                           |
| ----------------- | ----------------------------------------------- |
| Package           | `<package-name>`                                |
| Layer             | `<Platform / Foundation / Application / UI>`    |
| Package role      | `<one sentence>`                                |
| Runtime stance    | `<contracts-only / runtime / composition / UI>` |
| Package owner     | `<Platform Authority / etc.>`                   |
| Consumer packages | `<list>`                                        |
| Change model      | `<serialized slices / open>`                    |
| Quality target    | Enterprise 9.5 / 10                             |

---

# 1. Package Definition

What this package is. One paragraph.

---

# 2. One-Sentence Boundary

The shortest enforceable boundary sentence.

---

# 3. Dependency Rules

## Allowed

What the package may import.

## Prohibited

What the package must not import.

---

# 4. Authority Surfaces

What this package owns. One section per surface.

## 4.1 <Surface Name>

Description. TypeScript shape if applicable.

---

# 5. What This Package Must Never Own

Bullet list of prohibited responsibilities.

---

# 6. Package Structure Standard

Folder tree and `package.json` exports block.

---

# 7. Decision Matrix

| Question | If yes | Belongs here? |
|---|---|---|
| ... | ... | Yes / No |

---

# 8. Contract Rules

Numbered list. Minimum: strict mode, readonly, branded IDs, JSON-serializable, no side effects on import.

---

# 9. Runtime Rules

When runtime code is allowed (if any).

---

# 10. Implementation Sequence

Recommended order for new additions.

---

# 11. Enterprise Acceptance Criteria

## Architecture
## Type Safety
## Governance
## Runtime Safety
## ERP Readiness (if applicable)

---

# 12. Required Gates

```bash
pnpm --filter <package-name> typecheck
pnpm --filter <package-name> test:run
# + any package-specific gates
```

---

# 13. Change Workflow

How future changes are proposed, implemented, reviewed, and accepted.

---

# 14. Doctrine

One paragraph. What this package is. What it is not.
```

---

## Skill template

After creating the PAS doc, create the corresponding Cursor skill.

Minimum SKILL.md structure:

```markdown
---
name: <package-name>-authority
description: Enforces the <package-name> boundary: <one sentence>.
disable-model-invocation: false
---

# <Package Name> — Authority Skill (PAS-NNN)

## Boundary

<One sentence from §2 of PAS>

## When to use this skill

Apply when touching:
- `packages/<package-name>/**`
- `@afenda/<package-name>` imports
- [key contracts/files]

## Decision matrix

[From PAS §7 — same table]

## Hard stops

[From PAS §3 + §5]

## Phase 0 — <package-name> change contract

[Six-line block]

## Required read order

1. This file
2. reference/authority-surfaces.md
3. reference/package-structure.md
4. docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md

## Authority surface summary

[Table from PAS §4]

## Contract rules

[Checklist from PAS §8]

## Required gates

[Bash block from PAS §12]

## Acceptance criteria

[Pass/fail table from PAS §11]

## Doctrine

[From PAS §14]
```

---

## Naming conventions

| Artifact | Convention | Example |
|---|---|---|
| PAS doc | `PAS-NNN-<PACKAGE-NAME-UPPERCASE>-AUTHORITY-STANDARD.md` | `PAS-002-DATABASE-AUTHORITY-STANDARD.md` |
| Skill directory | `<package-name>-authority/` | `database-authority/` |
| Skill name in frontmatter | `<package-name>-authority` | `database-authority` |
| Tombstone file | Same filename as PAS doc | `PAS-002-DATABASE-AUTHORITY-STANDARD.md` |
