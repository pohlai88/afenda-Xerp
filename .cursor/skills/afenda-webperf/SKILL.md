---
name: afenda-webperf
description: Web performance audit — enterprise-frontend-audit performance section plus vendor performance-optimization checklist. Spawns readonly analysis on UI/runtime changes.
disable-model-invocation: true
---

# Afenda Web Performance (`/afenda-webperf`)

Thin orchestrator for performance review on frontend and docs surfaces.

## When to use

- Diff touches `apps/erp/**`, `apps/docs/**`, `packages/ui/**`, `packages/appshell/**`, or CSS
- User asks for Core Web Vitals / bundle / render performance review

## Workflow

### 1. Determine scope

```bash
git diff --name-only
```

Confirm UI/runtime paths are in scope.

### 2. Mandatory reads

Spawned agent or main agent must Read:

1. `.cursor/skills/enterprise-frontend-audit/SKILL.md` — performance section
2. `.cursor/skills/enterprise-frontend-audit/reference/performance.md`
3. `.cursor/skills/vendor/agent-skills/skills/performance-optimization/SKILL.md` — measure-first workflow
4. `.cursor/references/performance-checklist.md` — CWV targets and anti-patterns

### 3. Spawn analysis Task

Single Task with `readonly: true`:

- Attach enterprise-frontend-audit performance criteria
- Apply vendor checklist: measure before optimize, N+1, bundle size, LCP/INP/CLS risks
- Output findings with file:line evidence

Optional gates when CSS authority touched:

```bash
pnpm check:css-visual-regression
pnpm ui:guard:scan
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
2. Cross-check PAS-005 CSS authority if token/runtime bridge changed
3. Not a substitute for `/afenda-ship` — security and governance still need ship fan-out for production merges

## Composition

- **Invoke directly when:** `/afenda-webperf` or performance questions on UI diff
- **Do not invoke from:** personas
- **May combine with:** `/afenda-ship` optional fifth spawn for UI-heavy PRs

---

## Verification

Webperf command complete when:

1. Mandatory reads completed (enterprise-frontend-audit performance + vendor checklist)
2. Analysis Task output uses PASS | CONCERNS | FAIL template with file:line evidence
3. Measurements recommended section lists concrete tools/routes (measure-first — no speculative fixes)

Optional gates run with Shell evidence when CSS authority touched.
