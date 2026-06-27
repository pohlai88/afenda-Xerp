---
name: write-tip-slice
description: Authors a single TIP slice handoff block and writes the matching §Slice N section into the TIP delivery doc. Use when a TIP exists but a specific slice has no handoff block, or when the existing block is incomplete (missing files, missing gates, missing DoD projections). Bridges write-tip (doc authority) and tip-slice-implementer (executor). Invoke with /write-tip-slice TIP-NNN Slice N.
disable-model-invocation: true
---

# write-tip-slice — TIP Slice Authoring

> **Archive only (2026-06-25).** Use [`write-fdr-slice`](../write-fdr-slice/SKILL.md) for all new foundation/package slices. This skill applies only to **repairing or extending archive TIP handoffs** for already-delivered TIPs under `docs/PAS/slice/`.
>
> This skill produces **one slice block** that `tip-slice-implementer` can execute without modification.
> Read `write-tip` first for TIP-level vocabulary, status rules, and boundary table.

---

## 0 · When to use this skill

| Trigger | Condition |
|---------|-----------|
| `/write-tip-slice TIP-NNN Slice N` | TIP exists; slice has no handoff block or block is incomplete |
| Repair request from tip-slice-implementer | Implementer reports "missing file in §3 Files", "test file not listed", or "§9 files absent" |
| After Slice N delivery | To mark DoD rows `[x]` and draft Slice N+1 handoff |

**Do not** use to author a whole TIP from scratch — that is `write-tip`. Do not use to implement code — that is `tip-slice-implementer`.

---

## 1 · Pre-flight reads (mandatory, in order)

```
1. docs/PAS/README.md         — confirm TIP in §Canonical delivery TIPs; check §Runtime implementation sequence
2. docs/architecture/afenda-runtime-truth-matrix.md — upstream evidence; row must show implemented, not partial
3. docs/PAS/slice/[status] tip-NNN-*.md  — target TIP; read Purpose, Scope, Deliverables, Acceptance gate, existing slices
4. ADRs cited in TIP Purpose                 — never claim "no pending decision" without reading
5. docs/architecture/package-registry.md     — exact package names and PKG-NNN codes
```

If the TIP doc has no `## Deliverables` table, stop — run `/write-tip TIP-NNN` first.

---

## 2 · Slice discovery

Before writing, answer:

```
TIP ID:
Slice number to write:
Last slice delivered (or "none"):
Prerequisite slice runtime evidence path:
Deliverables table rows this slice covers:
Owning package (from package-registry.md):
Allowed layer path (packages/<pkg>/src/):
```

Rules:
- Slice numbers are sequential. Do not skip.
- If Slice N-1 has no runtime evidence in the truth matrix, stop — state which matrix row must read `implemented` before Slice N can start.
- Do not assign slice numbers not in the TIP. If the TIP has no slice plan, create a minimal one (Slice 1 through completion) and confirm with the user before writing.

---

## 3 · File list derivation

Derive `§3 Files` from the TIP Deliverables table for this slice's rows only.

**Always include §9 documentation sync files when the slice changes runtime evidence:**

```
docs/PAS/slice/[status] tip-NNN-<title>.md   (Modified — DoD checkboxes, runtime evidence row, slice status)
docs/architecture/afenda-runtime-truth-matrix.md (Modified — row for this slice's package)
docs/PAS/README.md                (Modified — only if TIP status changes)
```

**TIP filename rename** — include only if this slice changes overall TIP status (e.g. `Partially Implemented` → `Complete`).

**Gates derivation** — use this table:

| Slice touches | Required gate |
|---------------|--------------|
| Any TypeScript | `pnpm --filter <pkg> typecheck` |
| Tests | `pnpm --filter <pkg> test:run` |
| Cross-package imports | `pnpm quality:boundaries` |
| UI primitives | `pnpm ui:guard:scan` |
| Any TS/TSX | `pnpm ci:biome` |
| Drizzle schema or migration | `pnpm quality:migrations` |
| Status/evidence change | `pnpm check:documentation-drift` |

---

## 4 · Handoff block format

Produce exactly this fenced block. Every field is required. Do not add fields. Do not omit fields.

```
Handoff from: docs/PAS/slice/[status] tip-NNN-<title>.md

1. Objective    — <TIP Purpose paragraph compressed to one sentence for this slice only>
2. Allowed layer— <single package path, e.g. packages/execution/src/>
3. Files        — <one file per line: path (New | Modified)>
                  <include §9 doc sync files when slice changes runtime evidence>
4. Prohibited   — <TIP Out-of-scope items + ADR-0010 blocked packages>
                  <packages/ui, packages/appshell unless this slice explicitly owns them>
                  <Accounting Core, @afenda/accounting, ledger/journal/COA/posting>
5. Authority    — <ADR-NNNN — authority name cited in TIP Purpose>
6. Gates        — <one pnpm command per line from §3 derivation table>
```

**Validation rules before finalizing:**
- §3 Files must list every file the implementer will touch (including tests and §9 docs).
- §4 Prohibited must include `@afenda/accounting` and ADR-0010 until Phase 9.
- §6 Gates must include `pnpm check:documentation-drift` whenever §9 files are in §3.
- Objective must not describe work outside this slice.

---

## 5 · Slice section template

Add or update this section in the TIP doc under `## Handoff to implementation`:

````markdown
### Slice N — <short title>

**Status:** Not started  
**Prerequisite:** Slice N-1 runtime evidence row `packages/<pkg>/src/` = `implemented` in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- <key design decision 1 — one bullet per decision, not per file>
- <key design decision 2>
- <dependency injection pattern if applicable>

#### Handoff block

```
Handoff from: docs/PAS/slice/[status] tip-NNN-<title>.md
1. Objective    — ...
2. Allowed layer— ...
3. Files        — ...
4. Prohibited   — ...
5. Authority    — ...
6. Gates        — ...
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| N | <row text from TIP §Definition of Done> | `pnpm ...` |

#### Known debt

- <any known limitation scoped to this slice — none if none>
````

Preserve existing slices. Only add or update the slice being authored.

---

## 6 · DoD update (post-delivery)

When marking a delivered slice:

1. Change `**Status:** Not started` → `**Status:** Delivered (commit: <sha>)`
2. Mark DoD rows `[x]` for every criterion this slice proved.
3. Update `## Runtime evidence` table — set `Proven` to `Yes — Slice N`.
4. Update `## Verdict` — advance remaining gap sentence.
5. Run `pnpm check:documentation-drift`.

Do not mark future slice DoD rows. Do not change overall TIP status to `Complete` unless all DoD rows are `[x]`.

---

## 7 · Quality checklist (before committing)

```
[ ] Handoff block has exactly 6 fields, no extras
[ ] §3 Files includes every file the implementer will touch
[ ] §3 Files includes §9 sync docs when runtime evidence changes
[ ] §4 Prohibited includes @afenda/accounting + ADR-0010 note
[ ] §6 Gates includes pnpm check:documentation-drift
[ ] Slice section is under ## Handoff to implementation
[ ] Prerequisite is machine-readable (matrix row = implemented)
[ ] No future slice DoD rows marked [x]
[ ] No accounting logic, ledger/journal/COA mentioned in files or objective
[ ] pnpm check:documentation-drift passes
```

---

## 8 · Relationship to other skills

| Skill | Relationship |
|-------|-------------|
| `write-tip` | Upstream authority — TIP-level doc structure, status vocabulary, boundary table, ADR chain |
| `tip-slice-implementer` | Downstream executor — reads the handoff block this skill produces |
| `afenda-coding-session` | Runtime discipline layer — governs code during execution |

**Dependency is linear:**
```
write-tip (TIP doc) → write-tip-slice (slice handoff) → tip-slice-implementer (execute)
```

Do not skip `write-tip-slice` by manually typing a handoff block in chat — the §7 checklist is designed to catch the gaps that caused implementation blockers in production.
