---
name: pas-slice-planner
description: Discovers live docs/PAS/KERNEL/SLICE/*.md kernel handoffs, reads PAS-001 parent authority and target slice handoff, validates prohibitions and prerequisites, then produces a section-by-section /afenda-coding-session execution plan. Each step is announced and rendered before the next begins. Use for planning or reviewing PAS-001 kernel identity slices. This skill does NOT edit files; series is detected from the live folder, not hardcoded.
paths:
  - docs/PAS/**
  - packages/architecture-authority/**
disable-model-invocation: true
---

# PAS Slice Planner

## Planner boundary (read this first — non-negotiable)

This skill is **read-only**.

It must NOT:
- edit source files, docs, tests, registries, or migrations
- run pnpm commands
- write code
- perform implementation

It MAY:
- discover slice files
- read authority
- validate handoff completeness
- identify hard stops
- produce a numbered, section-by-section implementation plan
- produce a paste-ready `/afenda-coding-session` command

**Implementation belongs to `/afenda-coding-session` or `afenda-governed-implementer`.**

---

## Sequencing rule (critical — do not skip)

**Every step must be announced and its output rendered completely before the next step begins.**

Do this before every step:

```
─── STEP N: <step title> ───────────────────────────────────────
```

Then produce that step's output in full.
Then advance to step N+1.

Never collapse two steps into one block.
Never skip a step because the answer "seems obvious."
Never advance without rendering the separator line.

---

## Output modes

When the user invokes this skill, detect or ask for the mode:

| Keyword | Mode | Output |
|---------|------|--------|
| `plan` (default) | Full plan | All steps 0–7 in sequence |
| `review` | Review only | Steps 0–2 + hard-stops + gap table only |
| `command` | Paste-ready only | Steps 0–1 + §7 paste command only |
| `batch` | All undelivered slices | Step 0 index + one full plan per unblocked slice |

If no keyword is given, use `plan` mode.

---

## Step 0 — Discover the live folder

**Announce:** `─── STEP 0: DISCOVER LIVE SLICE FOLDER ───`

Glob `docs/PAS/KERNEL/SLICE/b*.md` and build this discovery index:

| File | Slice ID | Type | Status | Prerequisite | Has `-prohibited.md` | Handoff complete (9 fields)? | Gates listed? |
|------|----------|------|--------|--------------|----------------------|------------------------------|---------------|
| b4.md | B4 | Implementation | Delivered | B3 | yes | yes | yes |
| b5.md | B5 | Implementation | Delivered | B4 | yes | yes | yes |
| … | … | … | … | … | … | … | … |

Rules for filling the table:
- **Status** — read from the `**Status:**` line inside the file; never infer from file name
- **Type** — read from the `**Type:**` line; one of Research / Implementation / Registry-sync / Evidence-sync
- **Prerequisite** — read from the `**Prerequisite:**` line; never assume
- **Handoff complete** — count the numbered fields inside the `Handoff block` code fence; must equal exactly 9
- **Gates listed** — check Handoff field 6 for at least one `pnpm` command

After rendering the table, identify the target slice (named by user or next unblocked `Not started` row) and confirm: **"Proceeding to plan Slice <ID>."**

---

## Step 1 — Required reads (do not skip any)

**Announce:** `─── STEP 1: REQUIRED READS ───`

Read each source in order and confirm each is found before moving to the next:

```
1. docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md     — sections cited by Handoff field 5
2. docs/PAS/KERNEL/SLICE/<target>.md                         — handoff block, rules frozen, DoD
3. docs/PAS/KERNEL/SLICE/<target>-prohibited.md              — extra prohibitions (confirm absent if not found)
4. .cursor/skills/kernel-authority/SKILL.md           — kernel boundary + hard stops
5. packages/kernel/src/identity/                      — current runtime state (file listing only)
```

After each read, output one line:
```
✓ Read: <filename> — <key fact extracted>
```

Do not advance to Step 2 until all five confirmations are printed.

---

## Step 2 — Execution contract extraction

**Announce:** `─── STEP 2: EXECUTION CONTRACT ───`

Announce: **"I'm preparing the afenda-coding-session execution contract before implementation."**

Extract all 9 fields verbatim from the Handoff block in the slice doc:

| Field | Source | Value (verbatim) |
|-------|--------|------------------|
| 1. Objective | Handoff field 1 | … |
| 2. Allowed layer | Handoff field 2 | … |
| 3. Files | Handoff field 3 | … |
| 4. Prohibited | Handoff field 4 + extras from -prohibited.md | … |
| 5. Authority | Handoff field 5 | … |
| 6. Gates | Handoff field 6 | … |
| 7. Closes | Handoff field 7 | … |
| 8. Evidence | Handoff field 8 | … |
| 9. Attestation | Handoff field 9 | … |

**Missing field rule:** If any of the 9 fields is absent from the slice doc, do not infer it from surrounding prose. Go directly to Step 8 (hard stop) and stop.

---

## Step 3 — Slice classification

**Announce:** `─── STEP 3: SLICE CLASSIFICATION ───`

| Field | Value (read from slice doc) |
|-------|-----------------------------|
| Slice ID | from file name |
| Type | Research / Implementation / Registry-sync / Evidence-sync |
| Risk class | Low / Medium / High |
| Clean Core impact | A→A / A→B (justify drop) |
| Status | Not started / In progress / Delivered |
| Prerequisite | prior slice ID + evidence state |
| Prerequisite met? | Yes / No — read status from discovery index |

If prerequisite is not `Delivered` → go to Step 8.

---

## Step 4 — Authority section mapping

**Announce:** `─── STEP 4: AUTHORITY SECTION MAPPING ───`

Map every PAS section referenced in Handoff field 5 to:

| PAS Section | Title (from PAS doc) | Kernel path governed | Frozen rules count |
|-------------|----------------------|----------------------|--------------------|
| §N.N.N | (read verbatim) | `packages/kernel/src/identity/…` | N |

Then list the frozen rules from the slice doc by number. Quote them verbatim — do not paraphrase.

---

## Step 5 — File plan and dependency order

**Announce:** `─── STEP 5: FILE PLAN AND DEPENDENCY ORDER ───`

### 5.1 — File plan

Group every file from Handoff field 3 by operation:

```
CREATE   <path>   — <single reason>
MODIFY   <path>   — <single reason>
DELETE   <path>   — <single reason>
```

One reason per line. If a file has two reasons, split it into two rows.

### 5.2 — Dependency order

Order §5.1 files so upstream contracts are always done before consumers:

```
Step 1 → brand / type contracts       (no imports from this slice)
Step 2 → validation / guard helpers
Step 3 → individual contracts          (import step 1–2)
Step 4 → registry or aggregate file   (import step 3)
Step 5 → barrel index                 (import step 4)
Step 6 → governance / gate scripts    (import registry)
Step 7 → tests                        (import barrels + governance)
Step 8 → doc sync                     (status, evidence, runtime matrix, PAS runtime_status + remaining_slices, skill mirror, pas-status-index)
```

Flag any circular import risk. Name the mitigation for each.

---

## Step 6 — Anti-drift checklist and test plan

**Announce:** `─── STEP 6: ANTI-DRIFT CHECKLIST AND TEST PLAN ───`

### 6.1 — Anti-drift checklist

Answer Pass / Fail / N/A for each row before touching any file:

| Rule | Status |
|------|--------|
| No prohibited entry (Handoff field 4) crossed | |
| No primitive rows enter `ID_FAMILIES` | |
| No enterprise-parser import in primitive files | |
| No external npm dependency added to kernel | |
| No DB migration file touched | |
| No `apps/erp` file touched | |
| No accounting runtime touched | |
| Each file has exactly one stated reason | |
| Wire normalizer compile-time coverage maintained | |
| Misclassification guards present where parse is new | |
| No whitespace-trim-only parse without format validation | |
| PascalCase used in error message labels (not camelCase) | |

Any Fail row → go to Step 8. Do not proceed.

### 6.2 — Test plan

Read every DoD row from the slice doc. For each:

| DoD # | Criterion | Test file | Required assertions |
|-------|-----------|-----------|---------------------|
| 1 | (verbatim from slice) | `<pkg>/__tests__/*.test.ts` | happy path + error path |

For any contract that parses values, always add:
- Valid input accepted
- Invalid format rejected
- Misclassified input (enterprise ID string passed as primitive) rejected
- Empty / whitespace-only rejected

---

## Step 7 — Gate sequence and paste command

**Announce:** `─── STEP 7: GATE SEQUENCE AND PASTE COMMAND ───`

### 7.1 — Gate sequence

Run in this exact order. Do not skip ahead. Gates come from Handoff field 6:

```bash
pnpm --filter <pkg> typecheck          # type correctness first
pnpm --filter <pkg> test:run           # unit tests (use test:run; note substitution if different)
pnpm check:kernel-identity-surface     # registry parity gate
pnpm quality:boundaries                # cross-package boundary check
pnpm quality:architecture              # architecture fingerprint
pnpm check:documentation-drift        # when doc status or runtime matrix changes
```

If a gate command does not yet exist in the repo, state: `MISSING — slice must create this gate or record a waiver in Handoff field 6.`

### 7.2 — Paste-ready command

Produce this block that can be pasted directly to start `/afenda-coding-session`:

```
Execute Slice <ID> — <short title>.

Handoff from: docs/PAS/KERNEL/SLICE/<file>.md

1. Objective    — <Handoff field 1>
2. Allowed layer— <Handoff field 2>
3. Files        — <Handoff field 3, one per line>
4. Prohibited   — <Handoff field 4>
5. Authority    — <Handoff field 5>
6. Gates        — <Handoff field 6, one per line>
7. Closes       — <Handoff field 7>
8. Evidence     — <Handoff field 8>
9. Attestation  — <Handoff field 9>

Run gates in this order:
<one gate per line from §7.1>
```

---

## Step 8 — Hard stops

**Announce:** `─── STEP 8: HARD STOP ───`

Stop and return a repair report if any of these are true:

1. `docs/PAS/KERNEL/SLICE/` folder is empty or does not exist.
2. Target slice file does not exist.
3. Handoff block has fewer than 9 fields (or any field is blank).
4. A Handoff field was inferred from prose — inference is not allowed; read verbatim or stop.
5. Slice type is `Research` but Handoff field 3 includes `packages/` or `apps/` paths.
6. Slice touches `ID_FAMILIES` but role is not `foundation-registry-owner`.
7. An upstream contract required by the slice does not exist in the repo.
8. Prerequisite slice status is not `Delivered`.
9. A required gate in Handoff field 6 does not exist in the repo and no waiver is recorded.

Repair report format:

```
Cannot plan Slice <ID>.

Hard stop triggered: <condition number and text>

Required repair:
- <file / action needed to resolve>

Do not invoke afenda-coding-session until repaired.
```

---

## Step 4 (batch mode only) — Multi-slice batch

When the user requests `batch` mode:

1. Run Step 0 and build the full discovery index.
2. Filter rows where Status ≠ `Delivered`.
3. Check prerequisites — a slice whose prerequisite is `Not started` is blocked; label it `BLOCKED`.
4. For each unblocked slice, run Steps 1–7 in full, separated by:

```
══════════════════════════════════════════════════
 SLICE <ID>
══════════════════════════════════════════════════
```

5. Do not merge plans across slices. Each slice has its own execution contract.
6. After all slices, output a summary table:

| Slice | Blocked? | Reason if blocked | Steps complete |
|-------|----------|-------------------|----------------|

---

## Completion report template (paste after all gates pass)

This is the template the implementer uses — it is produced by `/afenda-coding-session`, not by this planner:

```md
## Completion Report — Slice <ID>

### Objective
<verbatim from Handoff field 1>

### Files changed
| File | Operation | Reason |
|------|-----------|--------|
| … | CREATE/MODIFY/DELETE | … |

### Architecture authority
<Handoff field 5>

### Drift prevention proof
| Rule | Result |
|------|--------|
| No prohibited boundary crossed | Pass |
| No parallel registry created | Pass |
| No unauthorized package import | Pass |
| No raw `any` | Pass |
| No unsafe cast | Pass |
| No hand-edited migration | Pass |
| No dead code shipped | Pass |
| Wire normalizer coverage maintained | Pass |

### Gates run
<one gate result per line, from Handoff field 6>

### Known gaps
<Handoff field 7 remaining / none>
```

---

## Reference (read only when needed)

- Kernel identity layout: `docs/PAS/KERNEL/identity/canonical-enterprise-id-constitution.md`
- Runtime truth: `docs/PAS/pas-status-index.md`
- Kernel authority: `.cursor/skills/kernel-authority/SKILL.md`
- Coding session standard: `.cursor/skills/afenda-coding-session/SKILL.md`
- Slice handoff standard: `.cursor/skills/kernel-authority/reference/pas-slice-template.md`
