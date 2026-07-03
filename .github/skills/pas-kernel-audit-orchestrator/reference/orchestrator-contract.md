# Orchestrator contract — pas-kernel-audit-catalog

For `@afenda-orchestrator` when `Batch type: pas-kernel-audit-catalog` (or legacy `pas-001a-audit-catalog`).

Skill authority: `.cursor/skills/pas-kernel-audit-orchestrator/SKILL.md`

---

## Required invocation fields

```text
Batch type     : pas-kernel-audit-catalog
Audit catalog  : docs/PAS/KERNEL/audit/PAS-001.md | PAS-001{A|B}.md
Authority PAS  : <parent PAS standard path>
Max iterations : 3
Repair mode    : auto-repair | audit-only-first
Note           : optional
```

PAS implementation slots **not required**.

---

## Orchestrator role

- Read wave plan from `pas-kernel-audit-orchestrator/reference/catalogs/`
- Emit pre-flight: catalog exists, PAS-ID resolved, checkpoint new/resume
- **Do not edit source files**
- Loop per wave:
  1. Parent runs gate preflight when wave plan says so
  2. Parallel readonly audit Tasks (≤4)
  3. Merge verdict matrix
  4. Cluster findings
  5. Parallel implementer Tasks when clusters disjoint
  6. Gates (parent shell)
  7. Checkpoint write
- Final AUD (AUD-30 / AUD-25) last

---

## Skip hard stops

For catalog batches only, skip orchestrator hard stops **#1–#3** (CSS-AUTHORITY slice handoffs).

All other hard stops apply when repair clusters touch shared files.

---

## Implementer launch rule

Every implementer prompt **must** include:

1. Full coding-consistency-bundle read list
2. Repair cluster handoff block
3. PAS-specific authority skills (see catalog-registry.md)

---

## Stop conditions

| Condition | Batch status |
| --- | --- |
| Final AUD Pass + all hard blockers Pass | COMPLETE |
| Iteration cap with open Fail | PARTIAL |
| Empty catalog / missing authority | BLOCKED |
| Registry conflict without owner slot | BLOCKED |

---

## Batch Completion Summary (required)

```markdown
## PAS Kernel Audit Catalog — COMPLETE | PARTIAL | BLOCKED

| Field | Value |
| --- | --- |
| PAS ID | PAS-001B |
| Waves completed | W1–W9 |
| Repair rounds | N / max |
| Final confidence | score from AUD-30 |
| Gates | command → PASS/FAIL |
| Checkpoint | .cursor/audit/checkpoints/PAS-001B.json |

### Verdict matrix summary
| Fail | Conditional | Pass | N/A |
| --- | --- | --- | --- |
| n | n | n | n |

### Open repair queue
| Cluster | AUDs | Owner |
```
