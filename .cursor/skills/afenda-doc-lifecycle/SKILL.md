---
name: afenda-doc-lifecycle
description: >
  Routes Afenda governance documentation through AUTHOR, AUDIT, or SYNC intents
  for Domain North Star, Architecture Blueprint, PAS, ADR, and Slice artifacts.
  Covers EFR/EAC evidence audit, NS→Blueprint→PAS→Code chain alignment, drift
  detection, PAS→SKILL regeneration, and documentation CI gates. Use when
  authoring, reviewing, or syncing governance docs; when the user mentions doc
  lifecycle, EFR/EAC, chain alignment, documentation drift, or SKILL regen from PAS.
  Invoke with /afenda-doc-lifecycle.
disable-model-invocation: true
paths:
  - docs/**
  - .cursor/skills/kernel-authority/**
  - .cursor/skills/*-authority/**
---

# Afenda Doc Lifecycle Bundle

Single entrypoint for governance documentation — Domain North Star, Architecture Blueprint, PAS, ADR, Slice, and PAS→SKILL sync.

## Overview

Applies the agent-skills lifecycle to constitutional documentation work. Three intents replace five overlapping modes: **AUTHOR** (write), **AUDIT** (evidence + alignment + drift), **SYNC** (artifact regeneration). Context loading is Phase 0 — not a separate mode.

## When to use

- Authoring or amending Domain NS, Blueprint, PAS, ADR, or Slice
- Auditing EFR/EAC evidence quality or maturity bars
- Chain alignment scan (NS → Blueprint → PAS → Code)
- Documentation drift vs codebase or runtime truth
- Regenerating `<package>-authority/SKILL.md` from PAS
- Promoting vocabulary to PAS-004 or wiring doc CI gates

## When NOT to use

- Reader MDX in `apps/docs/` only → `afenda-docs-writing`
- Code implementation → `coding-consistency-bundle`
- UI/CSS/visual changes → `ui-consistency-bundle`
- Quick read-only lookup with no doc edit → skip Phase 0; no bundle preflight required

---

## Mandatory preflight (before any doc edit)

**When attached, invoked, or named:** the **first user-visible line** must be exactly:

```txt
THE AGENT IS USING AFENDA DOC LIFECYCLE BUNDLE..
```

No preamble. No edits before this line and the preflight receipt.

### Preflight order

1. Output the announcement line above.
2. `Read` this file (`.cursor/skills/afenda-doc-lifecycle/SKILL.md`).
3. Identify intent (§ Intent decision tree) — `Read` the matching reference file.
4. `Read` every applicable row from the bundle table below.
5. `Read` every skill the user **attached or named** in the message.
6. Post **Preflight Receipt** — [reference/preflight-receipt.md](reference/preflight-receipt.md).
7. Announce: `I'm using afenda-doc-lifecycle — stating the doc execution contract before edits.`
8. Post **Phase 0** — all six lines (§ Phase 0).

**Only then** edit governance documentation files.

If preflight was skipped: paste [reference/hard-stop.md](reference/hard-stop.md) and restart.

Read-only context loads may skip steps 6–8.

---

## Bundle table

**Read applicable rows before any doc edit.**

| # | Resource | Path | When required |
| --- | --- | --- | --- |
| 1 | Bundle entry | `.cursor/skills/afenda-doc-lifecycle/SKILL.md` | **Always** |
| 2 | AUTHOR guide | `.cursor/skills/afenda-doc-lifecycle/reference/doc-types.md` | AUTHOR intent |
| 3 | AUDIT guide | `.cursor/skills/afenda-doc-lifecycle/reference/doc-audit.md` | AUDIT intent |
| 4 | SYNC guide | `.cursor/skills/afenda-doc-lifecycle/reference/doc-sync.md` | SYNC intent |
| 5 | Boundary contract | `.cursor/skills/kernel-authority/reference/doc-boundary-contract.md` | AUTHOR or AUDIT |
| 6 | Evidence standard | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` | AUTHOR or AUDIT |
| 7 | pas-codebase-bridge | `.cursor/skills/pas-codebase-bridge/SKILL.md` | AUDIT + PAS↔code |
| 8 | pas-prohibited-surface-scan | `.cursor/skills/pas-prohibited-surface-scan/SKILL.md` | AUDIT + unclaimed code |
| 9 | enterprise-knowledge | `.cursor/skills/enterprise-knowledge/SKILL.md` | SYNC + vocab |
| 10 | pas-slice-planner | `.cursor/skills/pas-slice-planner/SKILL.md` | AUTHOR + slice |
| 11 | architecture-authority | `.cursor/skills/architecture-authority/SKILL.md` | AUDIT + Blueprint/PAS boundary |

**User-named skills override narrow "when" cells.**

If a required upstream doc or template is missing → **Blocker Report** only; do not improvise.

---

## Intent decision tree

```
Doc task arrives
  │
  ├── Write / amend NS · Blueprint · PAS · ADR · Slice? → AUTHOR
  ├── Audit evidence · quality · gap · drift?           → AUDIT
  └── Regen SKILL · promote vocab · wire CI gate?       → SYNC
```

| Intent | Reference | Agent-skills sequence |
| --- | --- | --- |
| **AUTHOR** | [doc-types.md](reference/doc-types.md) | vendor `spec-driven-development` → vendor `source-driven-development` → vendor `incremental-implementation` → vendor `documentation-and-adrs` (ADR) |
| **AUDIT** | [doc-audit.md](reference/doc-audit.md) | vendor `code-review-and-quality` → vendor `doubt-driven-development` → chain alignment → `pas-codebase-bridge` |
| **SYNC** | [doc-sync.md](reference/doc-sync.md) | `enterprise-knowledge` · vendor `ci-cd-and-automation` pattern |

---

## Phase 0 (same shape as `/afenda-coding-session`)

```txt
1. Objective        — one sentence: what doc, what operation, which §§
2. Allowed layer    — NS | Blueprint | PAS | ADR | Slice | Reader-docs
3. Files to change  — explicit list
4. Prohibited       — doc types / topics off limits
5. Authority        — template under kernel-authority/reference/*
6. Mode + Acceptance — AUTHOR | AUDIT | SYNC + "done" definition
```

Field 6 replaces coding-session `Acceptance gates` — same six-line shape.

Constitutional stack and cross-doc rules: `.cursor/skills/kernel-authority/reference/doc-boundary-contract.md` · `doc-evidence-standard.md` · `adr-constitution.md`

---

## AUTHOR workflow (summary)

Full rules: [reference/doc-types.md](reference/doc-types.md)

1. Confirm doc type and template.
2. Load upstream doc (Platform NS → Domain NS → Blueprint → PAS).
3. Write **one § at a time**; verify before next §.
4. Every EFR row: Source ✓ at maturity bar.

**Done when:** EFR sources ✓ · NS §1 before §4+ · no implementation in NS/BP · boundary contract clean.

---

## AUDIT workflow (summary)

Full procedures: [reference/doc-audit.md](reference/doc-audit.md)

1. Evidence audit (✓/△/✗) · boundary checklist · chain alignment.
2. PAS↔code → `pas-codebase-bridge`; unclaimed code → `pas-prohibited-surface-scan`.
3. vendor `doubt-driven-development` on EFR ≥ Production.

**Output required** — alignment table (not prose only):

```markdown
| Layer | Item | Status | Gap/Risk | Recommended action |
| --- | --- | --- | --- | --- |
| NS→Blueprint | … | Orphan | … | … |
| Blueprint→PAS | … | Gap | … | … |
| PAS→Code | … | Drift | … | … |
| Code→PAS | … | Unclaimed | … | … |
```

**Done when:** table complete · every gap has action · doubt-driven on Production+ EFR.

---

## SYNC workflow (summary)

Full procedures: [reference/doc-sync.md](reference/doc-sync.md)

- **SKILL regen:** PAS extract map → update Sync checksum · same commit
- **Vocab:** `enterprise-knowledge` · NS §3 → PAS-004 atom
- **CI gates:** map PAS §13.1 → existing `pnpm check:*` scripts
- **Inventory:** slice close → Blueprint §10 from PAS §12

**Done when:** checksum current · `pnpm check:documentation-drift` passes · PAS-004 registered if promoted.

---

## Hard stops

- No doc edit without preflight receipt + Phase 0
- No EFR without Source ✓ at required maturity bar
- No Blueprint §4 row without §3.1 matrix in Reasoning
- No PAS §4 surface without Contract type + Stability
- AUDIT must produce alignment table — not prose only
- SKILL regen must update Sync checksum in same commit as PAS
- Never paste full PAS into SKILL

---

## Red flags

| Thought | Reality |
| --- | --- |
| "READ is a mode" | Context load is Phase 0 pre-step |
| "This is too small for preflight" | Any governance doc edit needs receipt |
| "I'll audit in prose" | AUDIT requires alignment table |
| "I'll sync SKILL later" | Same commit as PAS or Blocker Report |
| "Enterprises require…" without T0–T3 | Assumption — not EFR at Production+ |

---

## Verification

Before ending any documentation turn:

1. Preflight announcement + receipt posted **before** first doc edit
2. Phase 0 (six lines) posted for edit/audit turns
3. Intent verification checklist passed (AUTHOR / AUDIT / SYNC above)
4. Doc Lifecycle Completion Report posted (§ Completion report)
5. Gates run with Shell output when not read-only — paste results

Hard fail: edit before preflight; skill claimed without `Read` in same turn; AUDIT without table; gate claimed without command output.

---

## Completion report

```txt
## Doc Lifecycle Completion Report
1. Objective — [one sentence]
2. Files changed — [list]
3. Intent — AUTHOR | AUDIT | SYNC
4. Authority followed — [template paths]
5. Verification — [checklist pass/fail]
6. Gates run — [pnpm commands or "read-only — none"]
7. Known gaps — [or "none"]
```

---

## Additional resources

- AUTHOR: [reference/doc-types.md](reference/doc-types.md)
- AUDIT: [reference/doc-audit.md](reference/doc-audit.md)
- SYNC: [reference/doc-sync.md](reference/doc-sync.md)
- Preflight receipt: [reference/preflight-receipt.md](reference/preflight-receipt.md)
- Hard stop: [reference/hard-stop.md](reference/hard-stop.md)
- Skill discovery: [using-afenda-skills](../using-afenda-skills/SKILL.md)
