---
name: afenda-test
description: Thin wrapper spawning afenda-test-engineer with TDD and test-coverage skills. Use for test strategy, coverage gaps, or Prove-It analysis on a change.
disable-model-invocation: true
---

# Afenda Test (`/afenda-test`)

Thin orchestrator for test-focused review. Single persona — not a full ship fan-out.

## When to use

- User asks what tests are missing
- Prove-It analysis for a bug
- Coverage gap review before merge

## Workflow

### 1. Determine scope

```bash
git diff --name-only
git diff
```

### 2. Mandatory skill context

Main agent or subagent must Read:

1. `.cursor/skills/vendor/agent-skills/skills/test-driven-development/SKILL.md`
2. `.cursor/skills/test-coverage/SKILL.md`
3. `AGENTS.md` Testing section

### 3. Spawn one persona

Single Task:

- Prompt from `.cursor/agents/afenda-test-engineer.md`
- `readonly: true`
- Include diff + instruction to apply Prove-It and coverage gap analysis

### 4. Output

Post test engineer report verbatim. Optionally run package tests from `VERIFICATION.md` if user requests verification:

```bash
pnpm --filter @afenda/<package> test:run
```

## Rules

1. One persona — `afenda-test-engineer`
2. Do not spawn other personas from this command
3. For full pre-merge verdict, use `/afenda-ship`

## Composition

- **Invoke directly when:** `/afenda-test` or test/coverage questions on current change
- **Do not invoke from:** personas or implementer agents mid-edit
