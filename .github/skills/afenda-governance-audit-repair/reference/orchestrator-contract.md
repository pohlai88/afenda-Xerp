# Orchestrator contract — governance-audit-repair

For `@afenda-orchestrator` when `Batch type: governance-audit-repair`.

See `.cursor/skills/afenda-governance-audit-repair/SKILL.md` for full loop.

## Required fields

```text
Batch type     : governance-audit-repair
Scope          : explicit paths
Max iterations : 3
Repair mode    : auto-repair | audit-only-first
```

## Loop

`afenda-governance-auditor` (readonly) → cluster → `afenda-governed-implementer` → gates → re-audit

Stop when auditor verdict PASS or iteration cap.

---

For **PAS kernel audit catalogs** (PAS-001A/B AUD-XX slices), use batch type `pas-kernel-audit-catalog` instead:

`.cursor/skills/pas-kernel-audit-orchestrator/reference/orchestrator-contract.md`
