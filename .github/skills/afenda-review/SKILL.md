---
name: afenda-review
description: Pre-merge single-perspective code review. Spawns afenda-code-reviewer on the current diff or PR. User entry point — not a persona router.
disable-model-invocation: true
---

# Afenda Review (`/afenda-review`)

Single-persona slash command for pre-merge code review. Adapted from vendor `/review` pattern.

## When to use

- User wants one staff-engineer review before merge
- Change is focused; full `/afenda-ship` fan-out is optional

## Workflow

### 1. Determine scope

```bash
git diff --name-only
git diff
# Or PR context from user / gh pr diff
```

Identify changed paths for gate recommendations in the reviewer report.

### 2. Spawn one persona (single Task)

Spawn **one** Task in this turn:

- **subagent_type:** use prompt loaded from `.cursor/agents/afenda-code-reviewer.md`
- **readonly:** `true`
- **Prompt must include:**
  - Full diff or file list
  - Instruction to Read mandatory skills listed in persona
  - Output using persona template verbatim

Do not spawn multiple personas. For multi-perspective review, use `/afenda-ship`.

### 3. Merge

Trivial — post the reviewer report verbatim to the user. No synthesis required.

## Rules

1. One persona only — `afenda-code-reviewer`
2. Personas do not call personas
3. Reviewer recommends gates; main agent may run them if user asks — not required for `/afenda-review`

## Composition

- **Invoke directly when:** user runs `/afenda-review` or asks for pre-merge review (single lens)
- **Do not invoke from:** personas or other skills
- **Prefer `/afenda-ship` when:** auth, payments, data access, config, or blast radius is non-trivial

---

## Verification

Review command complete when:

1. Scope determined (`git diff` or PR context)
2. Single `afenda-code-reviewer` Task spawned with `readonly: true`
3. Reviewer report posted verbatim to user

Optional (if user requests): run gates recommended in reviewer report with Shell evidence.
