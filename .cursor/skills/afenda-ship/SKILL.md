---
name: afenda-ship
description: Pre-merge go/no-go orchestrator. Parallel fan-out to four Afenda review personas, merge findings, run Afenda gates with shell evidence, produce Ship Decision template.
disable-model-invocation: true
---

# Afenda Ship (`/afenda-ship`)

Fan-out orchestrator adapted from vendor `/ship` with Afenda governance auditor and gate matrix.

Read `.cursor/skills/vendor/agent-skills/skills/shipping-and-launch/SKILL.md` for launch checklist context.

## Skip fan-out rule

Run fan-out **unless all** are true:

- ≤2 files changed
- <50 lines diff
- No auth, payments, data access, or config/env paths touched

Otherwise default to parallel fan-out.

## Phase A — Parallel fan-out

Spawn **four** Task calls **in a single assistant turn** (parallel):

| Task | Persona prompt source |
| --- | --- |
| 1 | `.cursor/agents/afenda-code-reviewer.md` |
| 2 | `.cursor/agents/afenda-security-auditor.md` |
| 3 | `.cursor/agents/afenda-test-engineer.md` |
| 4 | `.cursor/agents/afenda-governance-auditor.md` |

Each Task:

- `readonly: true`
- Receives full diff / changed file list
- Must Read persona mandatory skills before reporting

**Optional fifth spawn** (same turn if UI-heavy diff):

- If diff touches `apps/erp/**`, `packages/ui/**`, or `*.css` → spawn Task with `enterprise-frontend-audit` skill attached (performance/UX section only)

Constraints:

- Subagents cannot spawn subagents
- Personas do not call each other

## Phase B — Merge in main agent

1. Deduplicate Critical/Important across four reports (same issue → one line, cite all personas)
2. Run Afenda gates from `.cursor/skills/afenda-coding-session/VERIFICATION.md` for changed paths — **shell evidence required**

Minimum by changed paths:

| Changed paths | Run |
| --- | --- |
| `packages/ui/**` | `pnpm --filter @afenda/ui check:governance` + test:run |
| `packages/appshell/**` | `pnpm ui:guard:scan` + appshell test:run |
| `apps/erp/**` | `pnpm --filter @afenda/erp typecheck` + test:run |
| `packages/database/**` | database typecheck + test:run |
| Any TS | `pnpm typecheck` |
| Any file | `pnpm ci:biome` |
| CSS package sources | `pnpm sync:package-css-dist` + `pnpm check:package-css-dist-sync` |

Additional when applicable:

- CSS/visual: `pnpm ui:guard:scan`
- Docs/PAS/matrix: `pnpm check:documentation-drift`
- CSP allowlist: `pnpm check:csp-third-party`
- Wide scope: `pnpm check`

3. Promote any persona Critical to blocker; cross-reference security + code review findings

## Phase C — Decision template

```markdown
## Ship Decision: GO | NO-GO

### Blockers (persona + file:line)
- [...]

### Recommended fixes
- [...]

### Afenda gates (command → PASS/FAIL)
- `pnpm ...` → PASS/FAIL

### Rollback plan
- Trigger: [...]
- Steps: [...]
- RTO: [...]

### Full specialist reports (append)
- afenda-code-reviewer: [...]
- afenda-security-auditor: [...]
- afenda-test-engineer: [...]
- afenda-governance-auditor: [...]
```

## Rules

1. Phase A personas run in parallel — never sequentially
2. Critical finding → default NO-GO unless user explicitly accepts risk
3. Rollback plan mandatory before GO
4. Gate claims require actual command output — no "should pass"

## Composition

- **Invoke directly when:** user runs `/afenda-ship` or asks for go/no-go before merge
- **Do not invoke from:** personas
- **Not for:** PAS parallel implementation batches — use `@afenda-orchestrator` + `/afenda-batch`

---

## Verification

Ship command complete only when:

1. Four persona Tasks spawned in **one parallel turn** (unless skip fan-out rule applies)
2. Merge deduplicates Critical/Important across reports
3. Afenda gates from `VERIFICATION.md` run with **Shell evidence** for changed paths
4. Ship Decision template posted with GO | NO-GO, blockers, rollback plan, and gate table

Hard fail: sequential persona spawn; gate PASS claimed without output; GO with unresolved Critical findings.
