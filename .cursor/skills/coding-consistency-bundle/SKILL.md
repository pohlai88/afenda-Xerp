---
name: coding-consistency-bundle
description: Mandatory preflight and skill bundle for Afenda implementer agents. Use when attached, invoked as /coding-consistency-bundle, named in the user message, or referenced by afenda-governed-implementer and PAS slice agents. Requires exact preflight announcement, Read-tool receipt, and Phase 0 before any file edit; hard stop if violated. Covers afenda-coding-session, architecture-authority, pas-slice-planner, kernel-authority, enterprise-knowledge, TypeScript discipline, and AGENTS.md.
disable-model-invocation: true
paths:
  - packages/**
  - apps/**
  - scripts/**
---

<!--
Operator mandate (verbatim — recorded 2026-06-28 — do not paraphrase or soften):

NOW USE /create-skill TO UPDATE THE SKILL OF /coding-consistency-bundle ; WHENEVER THE BUNDLE SKILL IS USING, PREFLIGHT SHOWING FIRST COIDNG... THE AGENT IS USING CODING CONSISTENY BUNDLE..

IF IT IS NOT PREFLIGHT, THEN HARD STOP AND SHOWING THE SCRIPT... FUCK THE MOTHER SON OF BITH AGENT... USE THE SKILL!!!

U DIDNT RECORD WHAT I SAID HUH.. I SIAD COMMENTED
-->

# Coding Consistency Bundle

Single entrypoint for implementer agents.

## Mandatory preflight (first — before any file edit)

**When this skill is attached, invoked, or named:** preflight showing first coding. The **first user-visible line** of the agent reply must be exactly (operator mandate — same words, same order):

```txt
THE AGENT IS USING CODING CONSISTENY BUNDLE..
```

No exceptions. No preamble. No edits before this line and the preflight receipt below.

<!-- IF IT IS NOT PREFLIGHT, THEN HARD STOP AND SHOWING THE SCRIPT... USE THE SKILL!!! -->

### Automatic enforcement (hooks — no manual run)

Cursor hooks record violations to `.cursor/audit/vibe-coding-violations.jsonl` automatically:

- **Session start** — reset preflight session
- **Read** — track bundle/kernel/session skill reads
- **Write before bundle Read** — **V002** appended + approval ask
- **Stop after coding turn** — missing announcement / §11 → **V001/V007/V010** appended + scorecard followup

See `.cursor/hooks/bundle-preflight-policy.mjs`. Deep transcript audit (optional): subagent `vibe-coding-violation-auditor`.

### Preflight order

1. Output the announcement line above.
2. `Read` this file (`.cursor/skills/coding-consistency-bundle/SKILL.md`).
3. `Read` every **applicable** row from the table below — use the `Read` tool; list paths in the receipt.
4. `Read` every skill the user **attached** or **named** in the message (e.g. `kernel-authority`) even if the table says "only when path X".
5. Post **Preflight Receipt** — [reference/preflight-receipt.md](reference/preflight-receipt.md).
6. Announce: `I'm using afenda-coding-session — stating the execution contract before edits.`
7. Post **Phase 0** — all six lines from afenda-coding-session §0.

**Only then** may the agent use Write / StrReplace / EditNotebook / Delete on repo files.

If the user required read-only preflight, stop after Phase 0 until they say **proceed**.

### Hard stop

If the agent edited files, claimed a skill, or claimed gates **before** steps 1–5 (and Phase 0 when coding):

- **Stop immediately.** Do not continue edits in that turn.
- Paste the hard-stop script from [reference/hard-stop.md](reference/hard-stop.md).
- Restart from step 1 in the next reply.

Claiming "I used skill X" without a `Read` on that path **in the same turn** counts as a preflight violation.

---

## Bundle table

**Read applicable rows before any file edit.**

| # | Skill | Path | When required |
| --- | --- | --- | --- |
| 1 | afenda-coding-session | `.cursor/skills/afenda-coding-session/SKILL.md` | **Always** — Phase 0, §0.1 hard stops, §11 Completion Report |
| 2 | Verification gates | `.cursor/skills/afenda-coding-session/VERIFICATION.md` | **Always** — changed-files → gate matrix |
| 3 | TypeScript patterns | `.cursor/skills/afenda-coding-session/PATTERNS.md` | **Always** — branded IDs, `satisfies`, discriminated unions |
| 4 | architecture-authority | `.cursor/skills/architecture-authority/SKILL.md` | `packages/architecture-authority/**`, registries, `pnpm quality:architecture` |
| 5 | pas-slice-planner | `.cursor/skills/pas-slice-planner/SKILL.md` | PAS slice handoffs — validate 9-field block before coding |
| 6 | Repo Ultracite standards | `AGENTS.md` (repo root) | **Always** — formatting, React, testing, security |
| 7 | kernel-authority | `.cursor/skills/kernel-authority/SKILL.md` | `packages/kernel/**` **or user names it** **or** PAS/kernel wire boundary (e.g. PAS-004 `implementationMapping`) |
| 8 | enterprise-knowledge | `.cursor/skills/enterprise-knowledge/SKILL.md` | `packages/enterprise-knowledge/**`, PAS-004 slices, Knowledge Atom registry |

**User-named skills override narrow "when" cells** — if the user says `kernel-authority`, row 7 is required regardless of path.

**Orchestrators** (`afenda-orchestrator`, parent agents launching parallel slices) must paste this bundle into every implementer prompt.

---

## TypeScript discipline (`typescript-advanced-types` equivalent)

Apply on every TypeScript edit:

```txt
Banned: any · unsafe as · non-null ! · @ts-ignore · stringly-typed status
Required: unknown + narrowing · type guards · discriminated unions · satisfies · as const (literals only) · branded IDs at trust boundaries · exhaustive switch
Advanced: generics with constraints · conditional/mapped types at contract boundaries only — not drive-by abstraction
```

Prefer `PATTERNS.md` over inventing local type utilities.

---

## Coding standards (`coding-standards` equivalent)

From `AGENTS.md` — non-negotiable on every edit:

- Minimal diff; match surrounding conventions
- `const` by default; optional chaining / nullish coalescing
- No `console.log`, `debugger`, or dead code shipped
- Tests: assertions inside `it()`; `@afenda/testing/react` + `setupUser` (not `fireEvent`) for interactions
- Security: validate input; no `eval`; `rel="noopener"` on external links

---

## PAS slice implementer add-on

When handoff is under `docs/PAS/<DOMAIN-FOLDER>/SLICE/` (e.g. `docs/PAS/KERNEL/SLICE/`):

1. Read target slice doc — all **9 handoff fields** must be present
2. Read parent PAS (`docs/PAS/PAS-NNN-*.md`) §0 Agent Quick Path only unless slice cites a section
3. `git diff --name-only` ⊆ handoff Field 3 before Completion Report
4. Registry mutations → delegate `foundation-registry-owner` only

---

## Domain skills (read when handoff cites them)

| Domain | Skill path |
| --- | --- |
| Enterprise knowledge (PAS-004) | `.cursor/skills/enterprise-knowledge/SKILL.md` |
| Enterprise SAP/Oracle gates | `.cursor/skills/enterprise-erp-standards/SKILL.md` |
| shadcn/studio ERP frontend (PAS-006) | `.cursor/skills/shadcn-studio/SKILL.md` |
| Primitive 2-file contracts (components-ui/*) | `.cursor/skills/afenda-primitive-contract/SKILL.md` + mismatch + react-best-practices-bridge + react-testing-patterns-bridge |
| ERP React/TS surface quality (B/A/T) | `.cursor/skills/afenda-react-surface-quality/SKILL.md` |
| ERP presentation quality composer | `.cursor/skills/afenda-presentation-quality/SKILL.md` |
| ERP Tailwind / Phase 1 CSS | `.cursor/skills/afenda-tailwind/SKILL.md` |
| Package CSS dist | `.cursor/skills/package-css-dist-sync/SKILL.md` |
| Drizzle migrations | `.cursor/skills/afenda-drizzle-migration/SKILL.md` |
| Multi-tenancy | `.cursor/skills/multi-tenancy-erp/SKILL.md` |

If a required authority file is missing, stop with a **Blocker Report** — do not improvise.

---

## References

- Preflight receipt template: [reference/preflight-receipt.md](reference/preflight-receipt.md)
- Hard-stop script: [reference/hard-stop.md](reference/hard-stop.md)
- Violation audit subagent: [../../agents/vibe-coding-violation-auditor.md](../../agents/vibe-coding-violation-auditor.md) — counts vibe-coding violations; appends [../../audit/vibe-coding-violations.jsonl](../../audit/vibe-coding-violations.jsonl)

---

## Verification

Before ending any implementer coding turn:

1. Preflight announcement + receipt posted **before** first file edit
2. Phase 0 (six lines) and Completion Report (§11) posted with drift-prevention table
3. Gates from [afenda-coding-session/VERIFICATION.md](../afenda-coding-session/VERIFICATION.md) run for changed paths — **paste Shell output**
4. No unresolved drift-prevention **Fail** rows

Hard fail: edit before preflight; skill claimed without `Read` in same turn; gate claimed without command output.
