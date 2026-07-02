---
name: afenda-webperf
description: Web performance audit — afenda-shadcn-performance plus vendor performance-optimization checklist. Spawns readonly analysis on UI/runtime changes.
disable-model-invocation: true
---

# Afenda Web Performance (`/afenda-webperf`)

Thin orchestrator for performance review on frontend and docs surfaces.

## When to use

- Diff touches `apps/erp/**`, `apps/docs/**`, `packages/shadcn-studio/**`, or CSS
- User asks for Core Web Vitals / bundle / render performance review

## Workflow

### 1. Determine scope

```bash
git diff --name-only
```

Confirm UI/runtime paths are in scope.

### 2. Mandatory reads

Spawned agent or main agent must Read:

1. `.cursor/skills/afenda-shadcn-performance/SKILL.md` — bundle, lazy-load, RSC boundaries
2. `.cursor/skills/vendor/agent-skills/skills/performance-optimization/SKILL.md` — measure-first workflow
3. `.cursor/references/performance-checklist.md` — CWV targets and anti-patterns
4. `.cursor/skills/afenda-presentation-quality/SKILL.md` — when diff touches ERP presentation surfaces

### 3. Spawn analysis Task

Single Task with `readonly: true`:

- Attach afenda-shadcn-performance criteria
- Apply vendor checklist: measure before optimize, N+1, bundle size, LCP/INP/CLS risks
- Output findings with file:line evidence

Optional gates when studio CSS touched:

```bash
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio
pnpm check:package-css-dist-sync
pnpm --filter @afenda/erp analyze
```

### 4. Output template

```markdown
## Afenda Web Performance Review

**Verdict:** PASS | CONCERNS | FAIL

### Critical
- [file:line] [issue + fix]

### Important
- [...]

### Measurements recommended
- [tool / route / metric]

### Gates
- [command → PASS/FAIL if run]
```

## Rules

1. Measure-first — no speculative micro-optimizations without evidence
2. Cross-check PAS-006 presentation gates if studio blocks or CSS changed
3. Not a substitute for `/afenda-ship` — security and governance still need ship fan-out for production merges

## Composition

- **Invoke directly when:** `/afenda-webperf` or performance questions on UI diff
- **Do not invoke from:** personas

## Verification

Before ending a webperf turn:

1. Mandatory reads completed (afenda-shadcn-performance + vendor checklist)
2. Findings cite file:line or measurement evidence
3. Optional gates pasted when CSS/bundle scope touched
