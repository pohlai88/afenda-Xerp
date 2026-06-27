---
name: coding-consistency-bundle
description: Mandatory skill bundle for Afenda implementer agents — afenda-coding-session, architecture-authority, pas-slice-planner, TypeScript discipline, and repo coding standards. Read before any file edit when invoked via afenda-governed-implementer, fdr-slice-implementer, foundation-registry-owner, or PAS slice batches.
disable-model-invocation: false
---

# Coding Consistency Bundle

Single entrypoint for implementer agents. **Read this table before any file edit.**

| # | Skill | Path | When required |
| --- | --- | --- | --- |
| 1 | afenda-coding-session | `.cursor/skills/afenda-coding-session/SKILL.md` | **Always** — Phase 0, §0.1 hard stops, §11 Completion Report |
| 2 | Verification gates | `.cursor/skills/afenda-coding-session/VERIFICATION.md` | **Always** — changed-files → gate matrix |
| 3 | TypeScript patterns | `.cursor/skills/afenda-coding-session/PATTERNS.md` | **Always** — branded IDs, `satisfies`, discriminated unions |
| 4 | architecture-authority | `.cursor/skills/architecture-authority/SKILL.md` | `packages/architecture-authority/**`, registries, `pnpm quality:architecture` |
| 5 | pas-slice-planner | `.cursor/skills/pas-slice-planner/SKILL.md` | PAS slice handoffs — validate 9-field block before coding |
| 6 | Repo Ultracite standards | `AGENTS.md` (repo root) | **Always** — formatting, React, testing, security |
| 7 | kernel-authority | `.cursor/skills/kernel-authority/SKILL.md` | `packages/kernel/**` only |

**Orchestrators** (`fdr-orchestrator`, parent agents launching parallel slices) must paste this bundle into every implementer prompt.

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

When handoff is under `docs/PAS/slice/`:

1. Read target slice doc — all **9 handoff fields** must be present
2. Read parent PAS (`docs/PAS/PAS-NNN-*.md`) §0 Agent Quick Path only unless slice cites a section
3. `git diff --name-only` ⊆ handoff Field 3 before Completion Report
4. Registry mutations → delegate `foundation-registry-owner` only

---

## Domain skills (read when handoff cites them)

| Domain | Skill path |
| --- | --- |
| Enterprise SAP/Oracle gates | `.cursor/skills/enterprise-erp-standards/SKILL.md` |
| UI primitive authoring | `.cursor/skills/govern-primitive/SKILL.md` |
| Package CSS dist | `.cursor/skills/package-css-dist-sync/SKILL.md` |
| Drizzle migrations | `.cursor/skills/afenda-drizzle-migration/SKILL.md` |
| Multi-tenancy | `.cursor/skills/multi-tenancy-erp/SKILL.md` |

If a required authority file is missing, stop with a **Blocker Report** — do not improvise.
