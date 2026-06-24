# fdr-001-playbook — PKG-001 (@afenda/appshell) orchestration

| Field | Value |
| --- | --- |
| **Package** | PKG-001 · `@afenda/appshell` |
| **Registry entry** | `PKG001_APPSHELL` |
| **FDR IDs** | `fdr-001-shell-composition` · `fdr-001-manifest-nav` |
| **Lane** | amber-lane |
| **Parallel rule** | **Sequential** — same `runtimeOwner` + same registry entry (orchestrator hard stops #6–#7) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) §FDR register rows 1–2 |
| **Cursor commands** | `/fdr-start` · `/fdr-continue` · `/fdr-orchestrate` |

> **Use this playbook** for PKG-001-specific routing decisions (sequential vs phased, upstream dependencies). For the generic sub-agent prompts use the Cursor slash commands `/fdr-start`, `/fdr-continue`, `/fdr-orchestrate`.  
> Per-FDR detail: [shell-composition](%5BNot%20started%5D%20fdr-001-shell-composition.md) · [manifest-nav](%5BPartially%20Implemented%5D%20fdr-001-manifest-nav.md).

---

## Condition matrix

| ID | When to use | First agent | Do not use when |
| --- | --- | --- | --- |
| **A** | **Start from scratch** — FDR status `Not started`, no slice marked Complete | `fdr-author` → `fdr-slice-author` → `fdr-slice-implementer` | Registry row missing and you need `PKG002`-style onboarding (use **E** first) |
| **B** | **Continue** — at least one slice `Complete` or partial work on disk | Analyze stop point → next slice only | All DoD rows `[x]` and gaps closed (use **Maintain** — no slices) |
| **C** | **Repair** — implementer/orchestrator returned repair report | `fdr-slice-author` or `fdr-author` per report | Handoff already complete and gates green |
| **D** | **Evidence-sync only** — code done; index/matrix/score stale | `fdr-slice-author` (Evidence-sync) → `fdr-slice-implementer` | Source code still needs changes |
| **E** | **Registry-sync** — lane promotion, `knownGaps` closure in registry | `foundation-registry-owner` only | Any other agent editing `foundation-disposition.registry.ts` |
| **F** | **Sequential PKG-001 batch** — run both FDR Research slices in order | `fdr-orchestrator` (phased) | Implementation slices on both FDRs same day without serialization |
| **G** | **Blocked** — see §Blocked below | None — fix blocker first | — |

---

## §A — Start from scratch (full pipeline)

**Pre-check:** Both FDR files exist · rows in §FDR register · read `foundation-disposition.registry.ts` `PKG001_APPSHELL`.

### Step A1 — Upgrade FDR doc (if enterprise sections missing)

```text
@fdr-author

Upgrade docs/delivery/FDR/[Not started] fdr-001-shell-composition.md to write-fdr TEMPLATES.md v1.1.
Registry: PKG001_APPSHELL. Lane: amber-lane. Clean Core B.
Reconcile TIP archive (tip-006, tip-ui-05) as legacy evidence only — FDR status remains Not started until Research Slice 1 completes.
Include: §Enterprise readiness score (evidence-backed), 20-row DoD, §Subagent concurrency, Slice 1 placeholder only (no handoff yet).
Update fdr-status-index.md row only if metadata changes.
```

Repeat for manifest-nav:

```text
@fdr-author

Upgrade docs/delivery/FDR/[Complete] fdr-001-manifest-nav.md to write-fdr TEMPLATES.md v1.1.
Registry: PKG001_APPSHELL. Domain: manifest-nav. Lane: amber-lane.
Legacy TIP: tip-007a-feature-manifest-governance.md (archive only).
Include full enterprise sections + Slice 1 placeholder.
```

### Step A2 — Author Slice 1 handoffs

```text
@fdr-slice-author

Author Slice 1 for fdr-001-shell-composition.
Type: Research. Docs-only Field 3. Complete 9-field handoff per write-fdr-slice SKILL.md.
```

```text
@fdr-slice-author

Author Slice 1 for fdr-001-manifest-nav.
Type: Research. Docs-only Field 3. Complete 9-field handoff per write-fdr-slice SKILL.md.
```

### Step A3 — Execute Research (one FDR per session)

```text
@fdr-slice-implementer

Implement Slice 1 from:
docs/delivery/FDR/[Not started] fdr-001-shell-composition.md

Copy the complete 9-field handoff block from ### Slice 1 — Research (shell-composition).
One slice only. Diff containment: git diff --name-only ⊆ handoff Field 3.
```

```text
@fdr-slice-implementer

Implement Slice 1 from:
docs/delivery/FDR/[Complete] fdr-001-manifest-nav.md

Copy the complete 9-field handoff block from ### Slice 1 — Research (manifest-nav).
One slice only.
```

### Step A4 — Implementation slices (after Research)

> **Superseded (2026-06-25):** Do not author new slices for bulk `appshell-studio-normalization`. New shadcn/studio blocks use [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../../.cursor/skills/afenda-shadcn-components/SKILL.md) per-block — not an FDR upgrade track.

```text
@fdr-slice-author

Author Slice 2 for fdr-001-shell-composition.
Type: Implementation. runtimeOwner: packages/appshell only.
One package only. Field 3 must list every file including tests — no globs.
Closes gap: shell-composition-complete-status (DoD #14 peer review only — studio normalization closed).
```

```text
@fdr-slice-implementer

Implement Slice 2 from fdr-001-shell-composition — paste 9-field handoff from FDR ## Slices.
```

Manifest-nav Implementation **depends on** `fdr-006-feature-manifest` evidence — complete that FDR or confirm entitlements pipeline in Research before Slice 2.

### Step A5 — Closeout

```text
@fdr-slice-author

Author Evidence-sync slice for fdr-001-shell-composition.
Field 3: fdr-status-index.md, afenda-runtime-truth-matrix.md, FDR doc only.
Closes DoD rows for drift, matrix, readiness score.
```

```text
@documentation-drift

Sync FDR status, fdr-status-index, runtime matrix after PKG-001 slice batch.
Scope: fdr-001-shell-composition, fdr-001-manifest-nav.
```

Amber lane promotion → **Condition E** (`foundation-registry-owner`).

---

## §B — Continue from where it stopped

### Step B1 — Analyze stop point (paste in any agent chat or run yourself)

```text
Read docs/delivery/FDR/fdr-001-playbook.md and both PKG-001 FDR docs.

For each FDR (shell-composition, manifest-nav):
1. List every slice Status in ## Slices (Not started | In progress | Complete).
2. List §Remaining gaps still open.
3. List Definition of Done rows still [ ].
4. Compare Runtime evidence table vs afenda-runtime-truth-matrix.md PKG-001 AppShell row.
5. Output: NEXT_SLICE = <fdr-id> Slice <N> + Type (Research | Implementation | Evidence-sync).

Do not implement. Analysis only.
```

### Step B2 — Continue next slice

```text
@fdr-slice-author

Author NEXT_SLICE from analysis above for PKG-001.
If handoff incomplete: repair only the failing fields.
```

```text
@fdr-slice-implementer

Implement NEXT_SLICE — paste 9-field handoff from the FDR ## Slices section.
One slice only. Post afenda-coding-session §11 Completion Report with N/30 attestation.
```

If analysis shows **only docs drift** → use **Condition D** instead.

---

## §C — Repair (orchestrator / implementer blocked)

```text
@fdr-slice-author

REPAIR REPORT:
<paste Batch Repair Report or implementer hard stop>

Target FDR: fdr-001-<domain>.
Fix Field 3 paths (no globs), add missing Fields 7–9, or split Implementation slice to one package.
```

If missing FDR sections:

```text
@fdr-author

Repair fdr-001-<domain> per fdr-slice-author repair report. Do not author implementation handoffs — delegate to fdr-slice-author after.
```

---

## §D — Evidence-sync only

```text
@fdr-slice-author

Author Evidence-sync slice for fdr-001-shell-composition (or manifest-nav).
Field 3 exact paths only:
- docs/delivery/FDR/[<status>] fdr-001-<domain>.md
- docs/delivery/fdr-status-index.md
- docs/architecture/afenda-runtime-truth-matrix.md
No packages/ or apps/ paths.
```

```text
@fdr-slice-implementer

Execute Evidence-sync slice — paste 9-field handoff. Gates: pnpm check:documentation-drift; pnpm check:foundation-disposition.
```

---

## §E — Registry-sync (amber → green)

```text
@foundation-registry-owner

Registry-sync for PKG001_APPSHELL after fdr-001-shell-composition and fdr-001-manifest-nav DoD evidence complete.
Lane target: green-lane (if §Remaining gaps closed in both FDRs).
Serialize: no parallel Implementation on PKG-001 during this invocation.
Gates: pnpm check:foundation-disposition.
```

---

## §F — Sequential orchestrator (both FDRs, phased)

**Not parallel** — orchestrator runs Phase 1 then Phase 2 (shared `runtimeOwner` + shared index/matrix serialization).

```text
@fdr-orchestrator

PKG-001 sequential phased batch — NOT parallel.

Phase 1 (Slot A):
- FDR: fdr-001-shell-composition
- Slice: 1
- Type: Research
- Prerequisite: 9-field handoff complete in FDR ## Slices

Phase 2 (Slot B) — launch only after Phase 1 §11 PASS:
- FDR: fdr-001-manifest-nav
- Slice: 1
- Type: Research

Rules:
- Same runtimeOwner (packages/appshell) → hard stop #6 applies → sequential only
- Only ONE slot may touch fdr-status-index.md and afenda-runtime-truth-matrix.md per phase
- If either handoff uses globs or incomplete 9 fields → BLOCK and queue fdr-slice-author repair

Produce batch manifest with Conflict status per slot before launch.
After both phases: combined diff containment + consolidated gates:
pnpm --filter @afenda/appshell typecheck
pnpm --filter @afenda/appshell check:governance
pnpm check:documentation-drift
pnpm check:foundation-disposition

Delegate each slot to fdr-slice-implementer with ONE handoff each.
```

---

## §G — Blocked (do not invoke implementer)

| Blocker | Resolution |
| --- | --- |
| Accounting ledger/posting runtime | ADR-0010 + Accounting FDR — §Do not start yet |
| `fdr-018-governed-primitives` UI primitive batch | ADR-0008 — sequential Amber-UI track |
| `fdr-006-entitlements` not researched | manifest-nav Implementation Slice 2+ blocked |
| Handoff Field 3 uses globs or directories | `fdr-slice-author` repair |
| Two agents same file path | `fdr-orchestrator` serialize or split Evidence-sync |
| Registry edit needed mid-Implementation | `foundation-registry-owner` first, then continue |

---

## Recommended slice order (PKG-001)

| Order | FDR | Slice | Type | Notes |
| ---: | --- | ---: | --- | --- |
| 1 | fdr-001-shell-composition | 1 | Research | Reconcile archive vs FDR Not started |
| 2 | fdr-001-manifest-nav | 1 | Research | Map `packages/appshell/src/navigation/` + entitlements |
| 3 | fdr-001-shell-composition | 2 | Implementation | Amber closeout / studio normalization |
| 4 | fdr-006-feature-manifest | * | * | Upstream for manifest-nav Implementation |
| 5 | fdr-001-manifest-nav | 2 | Implementation | Nav from manifest — after Step 4 |
| 6 | both | Evidence-sync | Evidence-sync | Index + matrix + scores |
| 7 | PKG001_APPSHELL | Registry-sync | `foundation-registry-owner` | After gaps closed |

---

## Quick gate reference

```bash
pnpm --filter @afenda/appshell typecheck
pnpm --filter @afenda/appshell check:governance
pnpm --filter @afenda/appshell test:run
pnpm check:documentation-drift
pnpm check:foundation-disposition
pnpm ci:biome
```

---

## Verdict

**Playbook authority** for PKG-001 sub-agent routing. FDR docs hold the slice handoff blocks; this file holds **PKG-001-specific conditions + orchestrator prompts**. Use generic commands `/fdr-start`, `/fdr-continue`, `/fdr-orchestrate` in Cursor — then specify the FDR ID when prompted.
