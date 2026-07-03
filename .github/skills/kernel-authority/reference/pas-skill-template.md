# PAS Skill Template

Bootstrap skeleton for `.cursor/skills/<package-name>-authority/SKILL.md`.

← Index: [pas-template.md](pas-template.md) · Example: [kernel-authority/SKILL.md](../../SKILL.md)

---

## Maintenance model (read first)

**PAS is SSOT.** This SKILL is a **generated artifact** — not a second canonical document.

```text
docs/PAS/PAS-NNN-*.md
        ↓ extract (manual checklist or future pnpm generate:pas-skill)
SKILL.md + reference/*.md
        ↓
IDE agents
```

| Rule | Action |
| --- | --- |
| PAS §2/§3/§4/§7/§8/§13/§15 changes | Regenerate SKILL — do not edit SKILL alone |
| New surface | Update PAS §4 first · regen `reference/authority-surfaces.md` |
| Slice close | Sync `## PAS rollout status` from PAS metadata/YAML |
| **Same-commit rule** | If any extracted PAS section changes, update SKILL + **Sync checksum** in the **same commit** |

Full extract map: [pas-template.md § PAS → SKILL generation model](pas-template.md#pas--skill-generation-model)

**Token budget:** SKILL.md target **≤350 lines**. TypeScript shapes → `reference/authority-surfaces.md`. Folder trees → `reference/package-structure.md`.

---

## Copy block — SKILL.md (bootstrap once, then regenerate from PAS)

~~~markdown
---
name: <package-name>-authority
description: Enforces the @afenda/<name> boundary: <one sentence with 3 trigger keywords — e.g. branded IDs, contracts, zero-dependency>.
disable-model-invocation: false
---

# @afenda/<name> — Authority Skill (PAS-NNN)

> **Generated from:** `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md` · Regenerate on PAS amend — do not drift manually.

## PAS rollout status (sync from PAS header/YAML on slice close)

| Field | Value |
| --- | --- |
| **Runtime status** | `<from PAS metadata>` |
| **Remaining slices** | `<from PAS metadata — or none>` |

> Canonical: PAS §0 · Closure: [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md)

---

## Sync checksum

> **Drift guard.** Update every **Last synced** date when regenerating from PAS. If any listed PAS section changes, this SKILL must be updated in the **same commit**.

| Source | Last synced |
| --- | --- |
| PAS §2 Boundary | `YYYY-MM-DD` |
| PAS §7 Decision matrix | `YYYY-MM-DD` |
| PAS §3.2 + §5 Hard stops | `YYYY-MM-DD` |
| PAS §13.1 Gates | `YYYY-MM-DD` |
| PAS §15 Doctrine | `YYYY-MM-DD` |
| PAS §3.4 Dependencies (summary) | `YYYY-MM-DD` |
| PAS §4 Surfaces → `reference/authority-surfaces.md` | `YYYY-MM-DD` |
| PAS §6 Structure → `reference/package-structure.md` | `YYYY-MM-DD` |

---

## Boundary (from PAS §2)

<Paste §2 verbatim — bold key owns / never owns terms>

---

## When to use this skill

Apply this skill when touching:

- `packages/<package-name>/**`
- any `@afenda/<name>` import
- `<key-contract-path-1>`
- `<key-contract-path-2>`
- any cross-package <domain> boundary question

**Escalation:** [Authority Escalation Matrix](../../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md#authority-escalation-matrix)

---

## Architectural dependencies (from PAS §3.4 — summary)

| Depends on | Required for |
| --- | --- |
| Kernel | <summary> |
| Metadata | <summary> |
| Permissions | <summary> |
| Observability | <summary> |

Full table → PAS §3.4

---

## Decision matrix (from PAS §7)

| Question | If yes → | In <package>? |
| --- | --- | --- |
| <question 1> | <outcome> | **Yes** / **No** |
| … | … | … |

Minimum eight rows — extract full §7 table from PAS.

---

## Hard stops (from PAS §3.2 + §5)

### Prohibited imports

```
<extract §3.2>
```

### Must never own

```
<extract §5>
```

### Documentation-only slices

When the task is **explicitly documentation or skill maintenance only**:

```
Do not modify packages/<package-name>/src/**
Do not change package exports
Do not mark any runtime capability complete
Regenerate SKILL from PAS when PAS changed
```

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
                     (+ gates from PAS §13.1)
```

**Implementation work:** a validated slice handoff is **mandatory**. Paste the 9-field block from `docs/PAS/CSS-AUTHORITY/SLICE/<file>.md` into Phase 0 before any code edit — do not invent scope from SKILL or PAS prose alone.

Documentation-only slices (skill regen, PAS edit) may use the six-line block above without a slice file.

---

## Required read order

1. This file (SKILL.md) — boundary, hard stops, Phase 0
2. [reference/quick-ref.md](reference/quick-ref.md) — optional ultra-light recap
3. [reference/authority-surfaces.md](reference/authority-surfaces.md) — TypeScript shapes · type · stability
4. [reference/package-structure.md](reference/package-structure.md) — folder tree, exports
5. PAS §0 Agent Quick Path — deeper sections only when slice cites them
6. Target slice — 9-field handoff when implementing

**Slice gate:** <from PAS §0 / §12 prerequisite>

---

## Authority surface summary (from PAS §4)

| Surface | Contract type | Stability | Owns | Does not own |
| --- | --- | --- | --- | --- |
| <surface> | Domain / Identity / … | Stable / … | <owns> | <does not own> |

Full shapes → [reference/authority-surfaces.md](reference/authority-surfaces.md)

---

## Contract rules (from PAS §8)

- [ ] TypeScript strict mode
- [ ] <package-specific import rule>
- [ ] JSON-serializable where used across boundaries
- [ ] Branded IDs for cross-package identifiers
- [ ] All object properties are `readonly`
- [ ] Every surface has Contract type + Stability in PAS §4
- [ ] Breaking Stable/Constitutional surfaces → ADR first

---

## Surface anti-patterns

| Anti-pattern | Example | Violation | Correct home |
| --- | --- | --- | --- |
| <pattern> | `<symbol>()` | PAS §X | `@afenda/<owner>` |

### Quick decision test

```
1. Does it load, fetch, or resolve data?         → No  (if Yes → wrong package)
2. Does it format, render, or compose UI text?   → No  (if Yes → wrong package)
3. Does it make a business decision or fallback? → No  (if Yes → domain owner)
```

---

## Runtime rules (from PAS §9)

<Package> runtime code is only allowed when **all** are true:

1. <rule>
2. <rule>

**Currently approved runtime primitive(s):** <from PAS §9>

---

## Implementation sequence (from PAS §10)

```
1. <step>
2. <step>
```

---

## Required gates (from PAS §13.1)

```bash
pnpm --filter @afenda/<name> typecheck
pnpm --filter @afenda/<name> test:run
# extract remaining §13.1 gates
```

---

## Doctrine (from PAS §15)

<Paste §15 from PAS>

---

## Canonical PAS

[docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md](../../../docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md)
~~~

---

## Reference files (generate from PAS)

| File | PAS source | Purpose |
| --- | --- | --- |
| `reference/quick-ref.md` | §2 · §3.2 · §5 · §13.1 | [pas-reference-templates.md](pas-reference-templates.md) |
| `reference/authority-surfaces.md` | §4 per surface | TS shapes · type · stability |
| `reference/package-structure.md` | §6 | Current vs Target tree + exports |

**Do not** maintain reference files independently of PAS — regenerate together with SKILL.
