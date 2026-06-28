# Vendor Skill Evaluation Rubric

Temporary eval copy at `.cursor/skills/vendor/agent-skills/` (cloned from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)). Score each skill 1–5 before Phase 7 cleanup.

## Rubric

| Criterion | Keep in Afenda if… |
| --- | --- |
| **Overlap** | No Afenda skill already covers it (e.g. `afenda-coding-session` ≈ incremental-implementation + Phase 0) |
| **Governance fit** | Does not conflict with PAS/kernel/registry authority |
| **Token cost** | Referenced on-demand, not always-loaded |
| **Evidence** | Adds verification steps missing from Afenda skills |

**Decision values:** `keep` | `merge` | `drop` | `pending eval`

---

## Skill inventory

| Skill | Overlap (1–5) | Governance (1–5) | Token (1–5) | Evidence (1–5) | Decision | Reason |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| api-and-interface-design | — | — | — | — | pending eval | — |
| browser-testing-with-devtools | — | — | — | — | pending eval | — |
| ci-cd-and-automation | — | — | — | — | pending eval | — |
| code-review-and-quality | — | — | — | — | pending eval | — |
| code-simplification | — | — | — | — | pending eval | — |
| context-engineering | — | — | — | — | pending eval | — |
| debugging-and-error-recovery | — | — | — | — | pending eval | — |
| deprecation-and-migration | — | — | — | — | pending eval | — |
| documentation-and-adrs | — | — | — | — | pending eval | — |
| doubt-driven-development | — | — | — | — | pending eval | — |
| frontend-ui-engineering | — | — | — | — | pending eval | Likely drop — superseded by `ui-consistency-bundle` + `enterprise-frontend-audit` |
| git-workflow-and-versioning | — | — | — | — | pending eval | — |
| idea-refine | — | — | — | — | pending eval | — |
| incremental-implementation | — | — | — | — | pending eval | Likely merge — overlaps `afenda-coding-session` |
| interview-me | — | — | — | — | pending eval | — |
| observability-and-instrumentation | — | — | — | — | pending eval | — |
| performance-optimization | — | — | — | — | pending eval | — |
| planning-and-task-breakdown | — | — | — | — | pending eval | — |
| security-and-hardening | — | — | — | — | pending eval | — |
| shipping-and-launch | — | — | — | — | pending eval | — |
| source-driven-development | — | — | — | — | pending eval | — |
| spec-driven-development | — | — | — | — | pending eval | — |
| test-driven-development | — | — | — | — | pending eval | Likely merge — enhance `test-coverage` |
| using-agent-skills | — | — | — | — | pending eval | Superseded by `using-afenda-skills` |

## Expected outcomes (Phase 7 — deferred)

- **Keep/adapt:** `code-review-and-quality`, `security-and-hardening`, `test-driven-development`, `shipping-and-launch`, `using-agent-skills` (content → `using-afenda-skills`), `orchestration-patterns.md`
- **Likely drop:** `frontend-ui-engineering`
- **Merge:** vendor TDD → native `test-coverage`
