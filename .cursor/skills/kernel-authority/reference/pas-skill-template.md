# PAS Skill Template

Copy to `.cursor/skills/<package-name>-authority/SKILL.md`.

← Index: [pas-template.md](pas-template.md) · Example: [kernel-authority/SKILL.md](../../SKILL.md)

**Token budget:** SKILL.md target **≤350 lines**. TypeScript shapes → `reference/authority-surfaces.md`. Folder trees → `reference/package-structure.md`. Ultra-light fallback → `reference/quick-ref.md`.

**Duplication rule:** Copy §2 boundary, §7 decision matrix, §3.2 + §5 hard stops, and Phase 0 **verbatim** into SKILL — do not use `[From PAS §X]` placeholders in committed skills.

---

## Copy block — SKILL.md

~~~markdown
---
name: <package-name>-authority
description: Enforces the @afenda/<name> boundary: <one sentence with 3 trigger keywords — e.g. branded IDs, contracts, zero-dependency>.
disable-model-invocation: false
---

# @afenda/<name> — Authority Skill (PAS-NNN)

## PAS rollout status (mirror header — sync on slice close)

| Field | Value |
| --- | --- |
| **Runtime status** | `<paste runtime_status from PAS YAML>` |
| **Remaining slices** | `<paste remaining_slices — or `none`>` |

> Canonical: `docs/PAS/PAS-NNN-*.md` frontmatter + header · Closure registry: [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md)

---

## Boundary (one sentence)

<Paste §2 verbatim — bold key owns / never owns terms>

---

## When to use this skill

Apply this skill when touching:

- `packages/<package-name>/**`
- any `@afenda/<name>` import
- `<key-contract-path-1>`
- `<key-contract-path-2>`
- any cross-package <domain> boundary question

---

## Decision matrix

> Can this belong in <package-name>?

| Question | If yes → | In <package>? |
| --- | --- | --- |
| <question 1> | <outcome> | **Yes** / **No** |
| <question 2> | <outcome> | **Yes** / **No** |
| … | … | … |

Minimum eight rows — duplicate full §7 table from PAS.

---

## Hard stops

### Prohibited imports — never add these to <package-name>

```
<package>  <package>  <framework>
<one line per group — copy §3.2>
```

### <Package> must never own

```
<responsibility line 1>
<responsibility line 2>
…
```

### Documentation-only slices

When the task is **explicitly documentation or skill maintenance only**, add:

```
Do not modify packages/<package-name>/src/**
Do not change package exports
Do not mark any runtime capability complete
```

For implementation slices, the Phase 0 contract governs scope — not this list.

---

## Phase 0 — <package-name> change contract

Before editing any <package-name> file, state these six lines:

```
1. Objective       — the exact change, in one sentence
2. Allowed layer   — packages/<package-name> only
3. Files to change — explicit list
4. Prohibited      — packages/apps that must not be touched
5. Authority       — <Package Owner> (PAS-NNN)
6. Gates           — pnpm --filter @afenda/<name> typecheck
                     pnpm --filter @afenda/<name> test:run
                     (+ relevant gates from Required gates below)
```

If a slice handoff exists, paste the 9-field block from `docs/PAS/slice/<file>.md` into Phase 0 first.

---

## Required read order

1. This file (SKILL.md) — boundary, hard stops, Phase 0
2. [reference/quick-ref.md](reference/quick-ref.md) — optional ultra-light recap
3. [reference/authority-surfaces.md](reference/authority-surfaces.md) — TypeScript shapes
4. [reference/package-structure.md](reference/package-structure.md) — folder tree, exports
5. [docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md](../../../docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md) — §0 Agent Quick Path only unless slice cites deeper sections
6. Target slice under `docs/PAS/slice/` — 9-field handoff when implementing

**Slice gate:** <ADR or prerequisite sentence if any>

---

## Authority surface summary

| Surface | Owns | Does not own |
| --- | --- | --- |
| <surface> | <owns> | <does not own> |

Full TypeScript shapes → [reference/authority-surfaces.md](reference/authority-surfaces.md)

---

## Contract rules (checklist)

Before any contract is merged:

- [ ] TypeScript strict mode
- [ ] <package-specific import rule>
- [ ] JSON-serializable where used across boundaries
- [ ] Branded IDs for cross-package identifiers
- [ ] All object properties are `readonly`
- [ ] No untyped `string` for governed IDs
- [ ] No hidden business logic
- [ ] No side effects during import

---

## Surface anti-patterns

The boundary gate may not catch locally defined forbidden behavior. Flag these when found in source.

| Anti-pattern | Example | Violation | Correct home |
| --- | --- | --- | --- |
| <pattern> | `<symbol>()` | PAS §X | `@afenda/<owner>` |

### Quick decision test

Before adding a function to <package-name>, pass all three:

```
1. Does it load, fetch, or resolve data?         → No  (if Yes → wrong package)
2. Does it format, render, or compose UI text?   → No  (if Yes → wrong package)
3. Does it make a business decision or fallback? → No  (if Yes → domain owner)
```

---

## Runtime rules

<Package> runtime code is only allowed when **all** are true:

1. <rule>
2. <rule>

**Currently approved runtime primitive(s):** <list or "none — contracts only">

---

## Implementation sequence

When adding new content, follow PAS §10 order:

```
1. <step>
2. <step>
```

Do not add <deferred items> in <package-name>.

---

## Required gates

```bash
pnpm --filter @afenda/<name> typecheck
pnpm --filter @afenda/<name> test:run
# copy §13.1 required gates from PAS
```

Recommended (when applicable):

```bash
# copy §13.2 from PAS
```

---

## Acceptance criteria

### Current (must pass today)

| Category | Check | Required |
| --- | --- | --- |
| Architecture | <check> | Pass |
| Type safety | <check> | Pass |
| Governance | <check> | Pass |

### Target (slice-gated — not enforced until implemented)

| Category | Check | Slice |
| --- | --- | --- |
| <category> | <check> | <slice id> |

---

## Doctrine

<Paste §15 one paragraph + when-in-doubt blockquote from PAS>

<Optional closing lines: words / decisions / behavior>
~~~

---

## Reference files to create alongside SKILL.md

| File | Purpose |
| --- | --- |
| `reference/quick-ref.md` | [pas-reference-templates.md](pas-reference-templates.md) |
| `reference/authority-surfaces.md` | TS shapes with Status labels |
| `reference/package-structure.md` | Current vs Target tree + exports |
