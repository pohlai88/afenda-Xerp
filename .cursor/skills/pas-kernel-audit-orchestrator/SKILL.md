---
name: pas-kernel-audit-orchestrator
description: >
  Orchestrates PAS kernel audit catalogs (AUD-XX slices): wave-parallel readonly audit,
  verdict merge, identical-finding repair clusters, consolidated gates, checkpoint resume.
  Use for docs/PAS/KERNEL/audit/PAS-001.md, PAS-001A.md, PAS-001B.md, @afenda-orchestrator batch type
  pas-kernel-audit-catalog, or /pas-kernel-audit-orchestrator.
disable-model-invocation: true
---

# PAS Kernel Audit Orchestrator (`/pas-kernel-audit-orchestrator`)

Wave-parallel **audit → merge → cluster → repair → gates → checkpoint → re-audit** for KERNEL PAS audit catalogs.

Composes:

| Layer | Entry | Role |
| --- | --- | --- |
| Orchestration | This skill + parent agent | Waves, merge, gates, checkpoints |
| Audit worker | `@pas-kernel-audit-worker` or `explore` readonly | One AUD-XX per Task |
| Repair | `/afenda-governance-audit-repair` Phases B–E | Cluster + `@afenda-governed-implementer` |
| Batch control | `@afenda-orchestrator` | `pas-kernel-audit-catalog` batch type |

Personas do not call personas. The **user** or parent agent orchestrates phases.

---

## Operator announcement

```txt
THE AGENT IS USING PAS KERNEL AUDIT ORCHESTRATOR.
```

---

## When to use

- Full-development verification of PAS-001 (25 AUD), PAS-001A (25 AUD), or PAS-001B (30 AUD) audit catalogs
- `@afenda-orchestrator` batch type `pas-kernel-audit-catalog` (or legacy `pas-001a-audit-catalog`)
- Resume interrupted audit from checkpoint

## When NOT to use

- Generic boundary scan without catalog → `@afenda-governance-auditor` + `/afenda-governance-audit-repair`
- PAS slice implementation → `@afenda-governed-implementer` + slice handoff
- Pre-merge go/no-go only → `/afenda-ship`

---

## Phase 0 — scope contract (before audit)

```text
1. Objective       — catalog audit + repair until final AUD PASS (or iteration cap)
2. Audit catalog   — docs/PAS/KERNEL/audit/PAS-001.md or PAS-001{A|B}.md (must be non-empty)
3. Authority PAS   — parent PAS standard path (from catalog-registry)
4. Wave plan       — reference/catalogs/PAS-001-waves.md or PAS-001{A|B}-waves.md
5. Max iterations  — default 3 repair rounds after full audit pass
6. Repair mode     — auto-repair | audit-only-first
7. Checkpoint      — new | resume:.cursor/audit/checkpoints/<PAS-ID>.json
8. Gates           — parent runs gate bundle once per wave that needs shell evidence
```

**Hard stop:** empty audit catalog → Blocker Report.

---

## Mandatory reads (parent agent)

| # | Resource | Path |
| --- | --- | --- |
| 1 | Catalog registry | [reference/catalog-registry.md](reference/catalog-registry.md) |
| 2 | Wave plan | [reference/catalogs/PAS-001-waves.md](reference/catalogs/PAS-001-waves.md) or PAS-001A / PAS-001B |
| 3 | Audit worker prompt | [reference/audit-worker-prompt.md](reference/audit-worker-prompt.md) |
| 4 | Repair clustering | `/afenda-governance-audit-repair` + [reference/repair-cluster-handoff.md](reference/repair-cluster-handoff.md) |
| 5 | Checkpoint schema | [reference/checkpoint-schema.md](reference/checkpoint-schema.md) |
| 6 | Orchestrator contract | [reference/orchestrator-contract.md](reference/orchestrator-contract.md) |

---

## Phase A — Wave audit (readonly)

For each wave in the wave plan:

1. **Parent runs gate preflight** when wave requires shell evidence (paste stdout into worker prompts).
2. Spawn **≤4 parallel** Task workers — **one AUD-XX per Task**.
3. Worker type: `@pas-kernel-audit-worker` or `explore` with `readonly: true`.
4. Prompt must include:
   - Single AUD section extracted from catalog (not full 1300-line file)
   - Authority PAS §0 quick path
   - Required Audit Output Format from catalog
   - Pasted gate output when applicable
5. **Do not** re-run an AUD-ID already marked Pass in checkpoint.

Worker output schema only:

```markdown
## PAS-001X-AUD-XX — <Slice Name>
Verdict: Pass | Conditional Pass | Fail | Not Applicable
Evidence inspected: …
Findings: …
Risks: …
Required remediation: …
Final note: …
```

---

## Phase B — Merge verdict matrix

Update catalog verdict matrix + checkpoint file:

| AUD-ID | Verdict | Cluster candidate |
| --- | --- | --- |
| AUD-01 | Conditional Pass | C-doc-status-drift |

Rules:

- Merge identical remediation into one cluster before repair
- Separate **doc-drift** clusters from **code/boundary** clusters
- Final confidence AUD (AUD-25 / AUD-30) runs **after** all other AUDs complete

---

## Phase C — Repair (delegate)

Follow `/afenda-governance-audit-repair` Phases B–E:

- Cluster by violation signature + mechanical fix + authority cite
- `@afenda-governed-implementer` per cluster with `coding-consistency-bundle` + cluster handoff
- **PAS-001 repairs:** add `kernel-authority` + `architecture-authority`; add `multi-tenancy-erp` when context/tenant attestation clusters
- **PAS-001B repairs:** add `kernel-authority` + `architecture-authority` (not `multi-tenancy-erp` unless spine touched)
- **PAS-001A repairs:** add `kernel-authority` + `multi-tenancy-erp` for spine/context

Serialize: registry → `@foundation-registry-owner`; shared index/matrix → `documentation-drift`.

---

## Phase D — Gates (parent shell only)

Subagents **never** run gates. Parent runs de-duplicated bundle from catalog-registry, pastes evidence.

**PAS-001 minimum:**

```bash
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm quality:kernel-context-surface
pnpm check:kernel-context-wire-triad
pnpm check:kernel-identity-governance
pnpm check:kernel-zero-runtime-deps
pnpm check:accounting-domain-contracts
pnpm check:foundation-disposition
pnpm quality:boundaries
pnpm architecture:cycles
pnpm architecture:drift
pnpm check:kernel-effective-dating-consumer-attestation
pnpm check:erp-auth-actor-protected-path-attestation
pnpm check:erp-tenant-lifecycle-extension-consumer-attestation
pnpm check:documentation-drift
```

**PAS-001B minimum:**

```bash
pnpm check:erp-domain-layout
pnpm check:erp-domain-delivered-vocabulary
pnpm check:accounting-domain-contracts
pnpm check:inventory-domain-contracts
pnpm check:procurement-domain-contracts
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm check:foundation-disposition
pnpm check:documentation-drift
pnpm quality:boundaries
```

---

## Phase E — Checkpoint + loop

Write [checkpoint schema](reference/checkpoint-schema.md) after each wave.

| Condition | Action |
| --- | --- |
| All AUD Pass + final AUD Pass | DONE — emit Completion Summary |
| Conditional/Fail + iterations remain | Repair clusters → re-audit affected waves only |
| Iteration cap | PARTIAL + repair queue |

---

## Direct invocation

```text
/pas-kernel-audit-orchestrator

Audit catalog : docs/PAS/KERNEL/audit/PAS-001.md
Authority PAS   : docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md
Repair mode     : audit-only-first
Checkpoint      : new
```

PAS-001A / PAS-001B example:

```text
/pas-kernel-audit-orchestrator

Audit catalog : docs/PAS/KERNEL/audit/PAS-001B.md
Authority PAS   : docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md
Repair mode     : audit-only-first
Checkpoint      : new
```

---

## Orchestrator invocation

```text
@afenda-orchestrator

Batch type     : pas-kernel-audit-catalog
Audit catalog  : docs/PAS/KERNEL/audit/PAS-001B.md
Authority PAS    : docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md
Max iterations   : 3
Repair mode      : auto-repair
Note             : Follow pas-kernel-audit-orchestrator PAS-001B wave plan
```

Legacy alias: `pas-001a-audit-catalog` → same skill, PAS-001A wave plan.

Skip orchestrator hard stops #1–#3 (CSS-AUTHORITY slice handoffs) for catalog batches.

---

## Performance rules (non-negotiable)

1. One AUD per Task — narrow prompt with injected AUD section
2. Max 4 parallel workers per wave
3. Parent runs gates once; workers cite pasted output
4. Merge before repair — one implementer per cluster
5. Checkpoint after every wave — no duplicate AUD runs
6. Audit workers readonly; repair only via governed implementer + bundle

---

## Hard stops

1. Empty audit catalog
2. Second audit Task for same AUD-ID in same checkpoint round
3. Repair before wave merge complete
4. Implementer without bundle preflight
5. Final confidence AUD before prerequisite AUDs complete
6. Registry edit by implementer (use `foundation-registry-owner`)

---

## Verification

Complete when:

1. Phase 0 posted
2. All AUD slots have verdict (not TBD)
3. Final confidence AUD emitted with score
4. Gates run with shell evidence
5. Checkpoint file written
6. Completion Summary with verdict matrix + repair queue

---

## Additional resources

- [catalog-registry.md](reference/catalog-registry.md)
- [PAS-001 waves](reference/catalogs/PAS-001-waves.md)
- [PAS-001B waves](reference/catalogs/PAS-001B-waves.md)
- [PAS-001A waves](reference/catalogs/PAS-001A-waves.md)
- [audit-worker-prompt.md](reference/audit-worker-prompt.md)
- [orchestrator-contract.md](reference/orchestrator-contract.md)
