---
name: afenda-governance-audit-repair
description: >
  Closed-loop governance audit and repair. Runs afenda-governance-auditor (read-only),
  clusters identical violations, fixes gaps via coding-consistency-bundle and
  afenda-governed-implementer, re-audits until PASS or iteration cap. Use when
  fixing governance gaps, boundary violations, registry drift, PAS alignment, or when
  @afenda-orchestrator runs a governance-audit-repair batch until the audit completes.
disable-model-invocation: true
---

# Afenda Governance Audit Repair (`/afenda-governance-audit-repair`)

Closed-loop orchestrator: **audit → cluster → repair → gates → re-audit** until governance PASS or iteration cap.

Composes:

| Layer | Entry | Role |
| --- | --- | --- |
| Audit | `.cursor/agents/afenda-governance-auditor.md` | Read-only findings |
| Repair | `.cursor/skills/coding-consistency-bundle/SKILL.md` + `@afenda-governed-implementer` | File fixes with Phase 0 + §11 |
| Batch control | `@afenda-orchestrator` | Multi-cluster parallel repair + loop until PASS |
| Catalog audit | `/pas-kernel-audit-orchestrator` | PAS-001 / 001A / 001B AUD-XX wave orchestration |

Personas do not call personas. The **user**, this skill, or `@afenda-orchestrator` orchestrates phases.

---

## Operator announcement

First user-visible line when this skill is active:

```txt
THE AGENT IS USING AFENDA GOVERNANCE AUDIT REPAIR.
```

Repair turns additionally require the bundle line **before any file edit**:

```txt
THE AGENT IS USING CODING CONSISTENY BUNDLE..
```

---

## When to use

- Governance audit found Critical/Important items that need code or doc fixes
- Repeated identical boundary violations across many files (import pollution, parallel registries, local resolvers)
- PAS/registry alignment repair after `pas-prohibited-surface-scan` or `pas-codebase-bridge`
- User asks to **audit and fix** governance gaps (not read-only `/afenda-ship` review only)
- `@afenda-orchestrator` batch type `governance-audit-repair` — run until audit PASS

## When NOT to use

- Pre-merge go/no-go only → `/afenda-ship` (no repair loop)
- Read-only platform assessment → `enterprise-architecture-audit`
- Registry lane promotion → `@foundation-registry-owner` (serialized, not parallel with implementation)
- Accounting Core runtime → blocked until ADR-0010 + amended `PKGR01_ACCOUNTING`

---

## Phase 0 — scope contract (before audit)

State all six lines before Phase A:

```text
1. Objective       — governance audit + repair until PASS (or iteration cap)
2. Scope           — explicit paths (packages/apps/docs) or "changed diff since <ref>"
3. Max iterations  — default 3; stop and report PARTIAL if still FAIL
4. Repair mode     — auto-repair clusters | audit-only first (wait for proceed)
5. Authority       — afenda-governance-auditor + coding-consistency-bundle + foundation-disposition.registry.ts
6. Gates           — from audit Recommended gates + VERIFICATION.md for changed paths
```

If scope is missing, infer smallest safe scope from user diff or `@`-mentioned paths and state it.

---

## Mandatory reads (before Phase A)

| # | Resource | Path |
| --- | --- | --- |
| 1 | Governance auditor persona | `.cursor/agents/afenda-governance-auditor.md` |
| 2 | Implementer bundle | `.cursor/skills/coding-consistency-bundle/SKILL.md` |
| 3 | Architecture authority | `.cursor/skills/architecture-authority/SKILL.md` |
| 4 | Cross-boundary scan | `.cursor/skills/platform-cross-boundary-anti-pattern-scan/SKILL.md` |
| 5 | Enterprise ERP gates | `.cursor/skills/enterprise-erp-standards/SKILL.md` |
| 6 | Registry (when scope touches packages) | `packages/architecture-authority/src/data/foundation-disposition.registry.ts` |
| 7 | Orchestrator contract (batch mode) | [reference/orchestrator-contract.md](reference/orchestrator-contract.md) |

---

## Phase A — Governance audit (read-only)

Spawn **one** Task in the current turn:

```text
Task → afenda-governance-auditor
  readonly: true
  prompt: full scope paths + "Apply Afenda Governance Audit output template"
```

The auditor **must** Read its mandatory skills before reporting.

Parse the report into a **Finding Register** (one row per distinct `file:line` or registry entry):

| ID | Severity | Location | Violation signature | Authority cite | Required fix |
| --- | --- | --- | --- | --- | --- |
| F001 | Critical | `path:line` | `<normalized pattern>` | PAS/ADR/registry | `<fix action>` |

**Verdict FAIL** with zero Critical rows still may have Important items — repair those in auto-repair mode unless user chose audit-only.

If user chose **audit-only first**, stop after Phase A + Finding Register. Wait for **proceed** before Phase B.

---

## Phase B — Cluster identical findings

Group findings that share the **same repair recipe** into repair clusters.

Cluster key (all must match):

1. **Violation signature** — same anti-pattern class (e.g. `consumer-owned-contract`, `unauthorized-cross-import`, `parallel-registry`)
2. **Required fix pattern** — same mechanical change (e.g. "delete local enum; import from `@afenda/kernel`")
3. **Authority cite** — same PAS section / ADR / registry rule
4. **Runtime owner** — same `foundation-disposition.registry.ts` entry (for orchestrator conflict check)

Do **not** merge clusters when:

- Fix touches `foundation-disposition.registry.ts` → dedicated **Registry-sync** slot via `@foundation-registry-owner`
- Fix touches shared index/matrix → dedicated **Evidence-sync** slot
- Clusters would share a file path → serialize into one cluster or sequential phases
- Red/amber lane lacks enterprise gate from `enterprise-erp-standards §3`

Template: [reference/repair-cluster-template.md](reference/repair-cluster-template.md)

Output **Repair Cluster Manifest**:

| Cluster | Signature | Files (exact paths) | Owner agent | Parallel OK? |
| --- | --- | --- | --- | --- |
| C1 | `unauthorized-cross-import` | `pkg/a.ts`, `pkg/b.ts` | afenda-governed-implementer | YES if disjoint runtimeOwner |

---

## Phase C — Repair execution

For each cluster, invoke `@afenda-governed-implementer` with:

1. Full **coding-consistency-bundle** read list (paste bundle table from SKILL.md)
2. Cluster manifest row (exact Field 3 file list — no globs)
3. Finding IDs covered (F001, F002, …)
4. Prohibited: registry edits unless slot is `foundation-registry-owner`

**Parallel launch:** spawn all eligible implementer Tasks **in one turn** when clusters have:

- Disjoint file paths
- Disjoint `runtimeOwner` (or docs-only Research)
- No shared registry entry
- No registry-sync overlap

**Serialize** when orchestrator hard stops #6–#11 would trigger (see orchestrator-contract).

Each implementer must post §11 Completion Report. Parent merges into **Repair Round Summary**.

---

## Phase D — Gates (shell evidence required)

Run de-duplicated gates from:

1. Auditor **Recommended gates** section
2. `.cursor/skills/afenda-coding-session/VERIFICATION.md` for union of changed paths

Minimum when packages touched:

```bash
pnpm quality:boundaries          # or pnpm quality:architecture when registry-adjacent
pnpm check:foundation-disposition # when disposition paths changed
pnpm check:documentation-drift   # when docs/PAS/matrix changed
pnpm ci:biome                    # any file change
```

Paste **command → PASS/FAIL** output. No gate claims without Shell evidence.

---

## Phase E — Re-audit loop

1. Re-run Phase A (governance auditor) on **same scope**
2. Compare Finding Register to prior round:
   - **Resolved** — finding ID absent or downgraded with evidence
   - **Open** — still Critical/Important
   - **New** — not in prior register (regression or expanded scope)
3. Decision:

| Condition | Action |
| --- | --- |
| Verdict **PASS** | Emit Completion Summary → **DONE** |
| Verdict **FAIL**, iterations remain | Phase B–E with **Open + New** findings only |
| Verdict **FAIL**, iteration cap hit | Emit Completion Summary → **PARTIAL** + repair queue |
| New Critical regression | Stop parallel work; fix regression before next batch |

Default **max iterations: 3**. User may override in Phase 0.

---

## Completion Summary template

```markdown
## Governance Audit Repair — COMPLETE | PARTIAL | BLOCKED

| Field | Value |
| --- | --- |
| Scope | `<paths>` |
| Rounds completed | N / max |
| Final audit verdict | PASS / FAIL |
| Clusters repaired | N |
| Files changed | `<union paths>` |
| Gates | `<command → result>` |
| Registry mutations | None / via foundation-registry-owner |

### Round history

| Round | Audit verdict | Clusters | Gates | Open findings |
| --- | --- | --- | --- | --- |
| 1 | FAIL | C1, C2 | … | F003, F007 |

### Remaining open findings

| ID | Severity | Location | Blocker reason |
| --- | --- | --- | --- |
| F003 | Critical | … | Requires ADR / registry-owner |

### Repair queue

| Owner | Item | Reason |
| --- | --- | --- |
| foundation-registry-owner | PKG-NNN lane | Registry-sync required |
```

---

## Direct invocation (single agent)

When user runs `/afenda-governance-audit-repair` without `@afenda-orchestrator`:

1. Post operator announcement + Phase 0
2. Execute Phases A → E in sequence within iteration cap
3. Use Task tool for auditor (readonly) and implementers (parallel when safe)
4. Main agent merges reports — does not skip bundle preflight on its own edits if it repairs directly; prefer `@afenda-governed-implementer` for multi-file clusters

**Prefer implementer delegation** when cluster touches ≥3 files or spans packages.

---

## Orchestrator integration

`@afenda-orchestrator` may run this skill as batch type **`governance-audit-repair`** until final audit PASS.

Orchestrator:

- Reads this skill + [reference/orchestrator-contract.md](reference/orchestrator-contract.md)
- Does **not** edit source files
- Loops: audit Task → cluster manifest → parallel implementer Tasks → gates → re-audit
- Stops on hard stops; emits Batch Repair Report
- Produces Batch Completion Summary when PASS or iteration cap

Invocation example:

```text
@afenda-orchestrator
Batch type: governance-audit-repair
Scope: packages/kernel/**, packages/permissions/**
Max iterations: 3
Note: Run /afenda-governance-audit-repair until governance auditor PASS.
```

Full contract: [reference/orchestrator-contract.md](reference/orchestrator-contract.md)

---

## Hard stops

Stop and emit **Blocker Report** (no repair) when:

1. Finding requires `foundation-disposition.registry.ts` change but no `foundation-registry-owner` slot scheduled
2. Accounting runtime touched without ADR authority
3. Two repair clusters share a file path (merge or serialize)
4. Implementer starts without coding-consistency-bundle preflight receipt
5. Audit scope ambiguous and user did not confirm inferred scope
6. Critical finding has no mechanical fix (ADR/process only) — queue to user, do not guess

---

## Composition

| Intent | Entry |
| --- | --- |
| Audit + fix loop (direct) | `/afenda-governance-audit-repair` |
| PAS-001 / 001A / 001B catalog audit (AUD-XX) | `/pas-kernel-audit-orchestrator` |
| Multi-cluster batch until PASS | `@afenda-orchestrator` + batch type `governance-audit-repair` |
| Catalog audit batch | `@afenda-orchestrator` + batch type `pas-kernel-audit-catalog` |
| Read-only governance review | `@afenda-governance-auditor` or `/afenda-ship` fan-out |
| Prohibited surface inventory | `pas-prohibited-surface-scan` then this skill for fixes |
| Registry lane edit | `@foundation-registry-owner` (serialized) |

---

## Verification

Skill execution complete only when:

1. Phase 0 posted before Phase A
2. Governance auditor spawned with `readonly: true` at least once per round
3. Identical findings clustered — no one-file-one-agent sprawl for same signature
4. Repairs used coding-consistency-bundle + §11 evidence (or foundation-registry-owner for registry)
5. Gates run with Shell output for changed paths
6. Re-audit performed until **PASS** or iteration cap documented
7. Completion Summary posted with round history and repair queue

Hard fail: file edit before bundle preflight; parallel clusters sharing file path; registry edit by implementer; gate PASS without output.
