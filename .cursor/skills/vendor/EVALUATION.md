# Vendor Skill Evaluation

Evaluated **2026-06-28** against native `.cursor/skills/` (see [NATIVE-EVALUATION.md](../NATIVE-EVALUATION.md)).

Source: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) at `.cursor/skills/vendor/agent-skills/`.

## Rubric (1–5)

| Criterion | Meaning |
| --- | --- |
| **Overlap** | 5 = fully duplicated by Afenda native skill |
| **Governance** | 5 = fits PAS/kernel/registry; 1 = conflicts with Afenda authority |
| **Token** | 5 = safe as on-demand reference (not always-loaded) |
| **Evidence** | 5 = adds verification steps missing from native skills |

**Decision values:** `keep` | `merge` | `drop`

---

## Summary

| Decision | Count | Action |
| --- | ---: | --- |
| **keep** | 10 | Retain under `vendor/agent-skills/skills/` until promoted or repointed |
| **merge** | 7 | Fold into native skill, then drop vendor copy |
| **drop** | 7 | Delete vendor copy (no merge needed) |

**References:** 2 promoted to [`.cursor/references/`](../../references/) · 5 drop after merge · 1 duplicate (`orchestration-patterns.md` already native)

**Vendor agents (4):** all **drop** — superseded by `afenda-*` personas.

---

## Skill inventory (scored)

| Skill | Overlap | Gov | Token | Evidence | Decision | Native counterpart | Reason |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| api-and-interface-design | 3 | 3 | 4 | 3 | **merge** | `api-contract`, `afenda-openapi` | Generic REST design; Afenda governed envelopes win |
| browser-testing-with-devtools | 2 | 4 | 4 | 4 | **keep** | `ui-consistency-bundle` dom-inspector, next-devtools MCP | Runtime DevTools workflow not native |
| ci-cd-and-automation | 2 | 2 | 3 | 2 | **drop** | `monorepo-discipline`, `VERIFICATION.md`, CI | Generic npm/eslint vs pnpm/turbo/biome |
| code-review-and-quality | 3 | 4 | 3 | 4 | **keep** | `afenda-code-reviewer`, `/afenda-review` | Wired mandatory read; five-axis depth |
| code-simplification | 2 | 4 | 4 | 3 | **merge** | `afenda-code-reviewer`, `AGENTS.md` | Chesterton's Fence → review skill notes |
| context-engineering | 2 | 3 | 4 | 2 | **drop** | `using-afenda-skills`, `.cursor/rules/` | Superseded by Afenda rules + bundles |
| debugging-and-error-recovery | 2 | 4 | 4 | 4 | **merge** | `error-handling`, `afenda-coding-session` | Triage checklist → native error-handling |
| deprecation-and-migration | 1 | 4 | 4 | 4 | **keep** | `pas-slice-planner` rollback partial, `afenda-drizzle-migration` | No native general deprecation lifecycle |
| documentation-and-adrs | 3 | 2 | 4 | 2 | **drop** | `pas-slice-planner`, `docs/adr/` | Conflicts with PAS/PAS authority |
| doubt-driven-development | 1 | 5 | 4 | 5 | **keep** | none | Adversarial fresh-context review; unique |
| frontend-ui-engineering | 5 | 1 | 2 | 1 | **drop** | `ui-consistency-bundle`, `enterprise-frontend-audit` | Conflicts Foundation phase 04/PAS-005 |
| git-workflow-and-versioning | 3 | 4 | 4 | 3 | **drop** | user git rules, `afenda-coding-session` | Covered by commit rules + Phase 0 |
| idea-refine | 1 | 4 | 4 | 3 | **keep** | none | Pre-PAS ideation; planner assumes handoff |
| incremental-implementation | 4 | 5 | 3 | 2 | **merge** | `afenda-coding-session`, `agent-multi-file.mdc` | Vertical slices in Phase 0/1 |
| interview-me | 1 | 5 | 4 | 4 | **keep** | none | Intent extraction before spec/PAS |
| observability-and-instrumentation | 4 | 5 | 3 | 3 | **merge** | `observability-usage`, `pino-erp-logger` | RED/USE/on-call → native observability |
| performance-optimization | 3 | 4 | 3 | 4 | **keep** | `/afenda-webperf`, enterprise-frontend-audit | Wired in webperf command |
| planning-and-task-breakdown | 4 | 5 | 4 | 3 | **merge** | `pas-slice-planner`, `pas-slice-planner` | PAS handoffs supersede generic planning |
| security-and-hardening | 3 | 4 | 3 | 4 | **keep** | `afenda-security-auditor`, `csp-third-party`, `rbac-erp` | Wired mandatory read |
| shipping-and-launch | 3 | 3 | 3 | 3 | **keep** | `/afenda-ship`, `enterprise-erp-standards` | Launch checklist context for ship |
| source-driven-development | 3 | 5 | 4 | 3 | **merge** | `afenda-coding-session`, Next.js MCP rules | Cite-from-docs policy already in rules |
| spec-driven-development | 4 | 2 | 3 | 2 | **drop** | `pas-slice-planner`, `pas-slice-planner` | Generic spec vs PAS/PAS chain |
| test-driven-development | 3 | 5 | 3 | 4 | **keep** | `afenda-test-engineer`, `test-coverage`, `/afenda-test` | Prove-It / red-green wired |
| using-agent-skills | 5 | 3 | 2 | 1 | **drop** | `using-afenda-skills` | Fully superseded |

---

## Active wiring (do not drop until repointed)

| Native artifact | Vendor skill path |
| --- | --- |
| `afenda-code-reviewer` | `skills/code-review-and-quality/SKILL.md` |
| `afenda-security-auditor` | `skills/security-and-hardening/SKILL.md` |
| `afenda-test-engineer`, `/afenda-test` | `skills/test-driven-development/SKILL.md` |
| `/afenda-ship` | `skills/shipping-and-launch/SKILL.md` |
| `/afenda-webperf` | `skills/performance-optimization/SKILL.md` |

---

## References evaluation

| File | Decision | Native target |
| --- | --- | --- |
| orchestration-patterns.md | **drop** (vendor) | [`.cursor/references/orchestration-patterns.md`](../../references/orchestration-patterns.md) |
| definition-of-done.md | **merge** | `afenda-coding-session` §11 Completion Report |
| testing-patterns.md | **drop** | `test-coverage`, `AGENTS.md` Testing |
| security-checklist.md | **keep** | [`.cursor/references/security-checklist.md`](../../references/security-checklist.md) ✅ promoted |
| performance-checklist.md | **keep** | [`.cursor/references/performance-checklist.md`](../../references/performance-checklist.md) ✅ promoted |
| accessibility-checklist.md | **drop** | `enterprise-frontend-audit/reference/ux.md` |
| observability-checklist.md | **merge** | `observability-usage`, `pino-erp-logger` |

---

## Vendor agents

| Agent | Decision | Native |
| --- | --- | --- |
| code-reviewer.md | **drop** | `afenda-code-reviewer` |
| security-auditor.md | **drop** | `afenda-security-auditor` |
| test-engineer.md | **drop** | `afenda-test-engineer` |
| web-performance-auditor.md | **drop** | `/afenda-webperf` + `enterprise-frontend-audit` |

---

## Merge plan (Phase 7b — not yet executed)

| Vendor skill | Merge into |
| --- | --- |
| api-and-interface-design | `api-contract/SKILL.md` §design principles |
| code-simplification | `afenda-code-reviewer` or `code-review-and-quality` keep ref |
| debugging-and-error-recovery | `error-handling/SKILL.md` |
| incremental-implementation | `afenda-coding-session/SKILL.md` §slices (already implicit) |
| observability-and-instrumentation | `observability-usage` + `pino-erp-logger` |
| planning-and-task-breakdown | `pas-slice-planner/SKILL.md` |
| source-driven-development | `afenda-coding-session` + `agent-discipline.mdc` note |

---

## Cleanup plan (Phase 7c — after merges + repoint)

1. Promote **keep** skills to `.cursor/skills/vendor-keep/<name>/` OR copy into native tree with `vendor/` attribution header.
2. Repoint persona mandatory-read paths if vendor tree removed.
3. Delete `.cursor/skills/vendor/agent-skills-src/` (git clone) — keep only evaluated copies or none.
4. Delete **drop** skill folders under `vendor/agent-skills/skills/`.
5. Run grep: zero references to deleted paths.

**Estimated vendor tree after cleanup:** ~10 skill folders + 0 duplicate agents + 0 duplicate references.

---

## Optional vendor skills (keep, not yet wired)

Invoke on demand via paths in `using-afenda-skills`:

| Skill | When |
| --- | --- |
| `interview-me` | Underspecified request; extract intent before PAS |
| `idea-refine` | Rough concept before `pas-slice-planner` |
| `doubt-driven-development` | High-stakes / unfamiliar code; adversarial review |
| `deprecation-and-migration` | Sunsetting features, compulsory deprecation |
| `browser-testing-with-devtools` | Browser runtime debugging with DevTools MCP |
