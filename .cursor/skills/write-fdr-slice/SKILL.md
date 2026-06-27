---
name: write-fdr-slice
description: Authors execution-grade FDR slice handoff blocks (9-field format) for fdr-slice-implementer. Enforces hard stops, one-package-per-slice rule, concurrency locks, 4 slice types, and score update rules. Use when an FDR exists and a slice needs a handoff block, a Research slice is missing, or an existing block is incomplete. Invoke with /write-fdr-slice fdr-NNN Slice N.
disable-model-invocation: true
---

# write-fdr-slice — FDR Slice Authoring (Enterprise 9.5)

> Produces **one slice block** that `fdr-slice-implementer` executes without modification.
> The block must be complete enough that the implementer cannot improvise.
> Read `write-fdr` first for FDR vocabulary, status rules, and §Research requirements.

---

## 0 · When to use

| Trigger | Condition |
| --- | --- |
| `/write-fdr-slice fdr-NNN Slice N` | FDR exists; slice needs handoff or block is incomplete |
| Repair from fdr-slice-implementer | Missing file in §3 Files, gates, or DoD rows |
| After Slice N delivery | Mark DoD `[x]`; draft Slice N+1; update readiness score |

**Do not** author a whole FDR — use `write-fdr`. **Do not** implement code — use `fdr-slice-implementer`.

---

## 0.1 · Hard stops

Stop immediately and return a **repair report** (see §9) if any of these are true:

1. Target FDR does not exist in `docs/delivery/FDR/`.
2. FDR is not listed in `docs/delivery/fdr-status-index.md`.
3. Registry entry ID in FDR does not exist in `foundation-disposition.registry.ts`.
4. `runtimeOwner` is missing from the registry entry.
5. FDR has no Deliverables table.
6. Slice number is not sequential (gap or duplicate).
7. Slice touches registry but implementer role is not `foundation-registry-owner`.
8. Research slice includes `packages/` or `apps/` source edits in §3 Files.
9. Gate-critical / red-lane slice has no test gate in §6 Gates.
10. Public API/export change has no compatibility declaration in §Impact analysis.

Do not invoke `fdr-slice-implementer` until all hard stops are resolved.

---

## 1 · Pre-flight reads (mandatory, in order)

```
1. docs/delivery/fdr-status-index.md          — confirm FDR in §FDR catalog
2. foundation-disposition.registry.ts          — registry entry: runtimeOwner, gates, prohibited, allowedAgents
3. enterprise-erp-standards/SKILL.md §2+§8+§10–§13 — controls, Clean Core, NFR, SoD
4. docs/architecture/afenda-runtime-truth-matrix.md — upstream evidence state
5. docs/delivery/FDR/[status] fdr-NNN-*.md    — target FDR: Purpose, Scope, Deliverables, Slices
6. ADRs cited in FDR Purpose
7. docs/architecture/package-registry.md      — PKG-NNN codes
```

---

## 2 · Slice discovery

Fill this table before writing the slice. It is the audit record for the handoff.

| Field | Value |
| --- | --- |
| FDR doc | `docs/delivery/FDR/[status] fdr-NNN-<slug>.md` |
| FDR ID | `fdr-NNN-<slug>` |
| Registry entry ID | `<PKGxxx_DOMAIN>` from `foundation-disposition.registry.ts` |
| Slice number | N |
| Previous slice status | Delivered / Not started / Missing |
| Slice type | Research / Implementation / Registry-sync / Evidence-sync |
| Risk class | Low / Medium / High |
| Clean Core impact | A→A / A→B / B→B / etc. (drop = red flag; justify in §Impact analysis) |
| Runtime owner | `<runtimeOwner path from registry>` |
| Owning package | `@afenda/<pkg>` |
| Deliverables rows covered | `<row ids or file paths from FDR §Deliverables>` |
| Remaining gaps closed | `<gap IDs from FDR §Remaining gaps>` |
| Enterprise gates touched | G0–G10 list |

### Slice types

| Type | Meaning | Source edit allowed? |
| --- | --- | --- |
| `Research` | Discovery only; docs-only edits | No |
| `Implementation` | Runtime/package/app source change | Yes — runtimeOwner paths only |
| `Registry-sync` | Registry mutation by `foundation-registry-owner` | Registry paths only |
| `Evidence-sync` | Runtime matrix/FDR/index/readiness score sync post-implementation | Docs only |

### Slice rules

- Slice 1 on `Not started` FDRs must be **Research** unless Architecture Authority waives.
- Sequential slice numbers — do not skip.
- Registry-sync slices: delegate to `foundation-registry-owner`; list in handoff §4 Prohibited for implementer.
- **Implementation slices touch only one runtimeOwner/package.** Cross-package work must be split unless the FDR explicitly classifies the slice as Integration and lists all affected package owners in §Impact analysis.

### PAS §4.1.16 — enterprise ID promotion checklist (when slice adds/persists IDs)

Include in Implementation slice DoD when touching Kernel identity or `enterprise_id` columns:

1. ADR/PAS records family, prefix, and owner
2. `ID_FAMILIES` registry entry with parse/create (if generated) and wire normalizer
3. Kernel tests: valid, invalid, wrong-prefix, wrong-body, round-trip
4. `pnpm check:kernel-identity-surface` green
5. If persisted: `enterprise_id` + CHECK + UNIQUE; `pnpm check:enterprise-id-db-parity` green
6. ERP/API ingress uses `parse*` — `pnpm check:erp-enterprise-id-casts` green
7. Forbidden fiscal IDs remain off platform floor

---

## 3 · File list derivation

**Always include sync files when slice changes runtime evidence or status:**

```
docs/delivery/FDR/[status] fdr-NNN-<title>.md    (Modified)
docs/architecture/afenda-runtime-truth-matrix.md  (Modified — if evidence changes)
docs/delivery/fdr-status-index.md                 (Modified — if status changes)
docs/architecture/foundation-disposition.md        (Modified — if lane changes; via registry-owner)
```

**Research / Evidence-sync slices:** docs only — no `packages/` or `apps/` edits.

### Gates derivation

| Slice touches | Required gate |
| --- | --- |
| Any package source | `pnpm --filter <pkg> typecheck` |
| Tests | `pnpm --filter <pkg> test:run` |
| UI consumer | `pnpm ui:guard:scan` |
| Database schema | `pnpm quality:migrations` |
| Any FDR work | `pnpm check:foundation-disposition` |
| Foundation registry | `pnpm check:foundation-disposition` + `pnpm quality:architecture` |
| Doc/status change | `pnpm check:documentation-drift` |
| Runtime matrix | `pnpm check:documentation-drift` |
| Red/amber lane | enterprise-erp-standards §3 full subset |
| NFR change (perf/reliability) | FDR §NFR section updated |
| Public exports / API surface | `pnpm quality:exports` or backward-compat declaration + semver tag |
| Auth / RBAC / RLS / audit / context | Security-negative test path required |
| Clean Core level drop | Architecture Authority peer review required before merge |

**If a required gate command does not exist yet**, the slice must either:
1. Create the gate script as part of the slice deliverables, or
2. Record an explicit waiver in FDR §Waivers with owner, reason, and expiry.

---

## 4 · Handoff block format (9 fields — all required)

```
Handoff from: docs/delivery/FDR/[status] fdr-NNN-<slug>.md

1. Objective    — <one sentence; no vague language>
2. Allowed layer— <runtimeOwner path or "docs-only" for Research/Evidence-sync>
3. Files        — <one path per line; every file the implementer will touch>
4. Prohibited   — <prohibited[] from registry + slice-specific>
5. Authority    — <ADR + registry authority field>
6. Gates        — <pnpm commands, one per line; must resolve hard stop §0.1 rule 9>
7. Closes       — <Gap IDs from §Remaining gaps + DoD row numbers>
8. Evidence     — <expected runtime evidence paths after delivery>
9. Attestation  — <Contract/Test/Observability/Security/Documentation/Maintainability — which dimensions change>
```

**Validation before finalising:**
- §3 Files must list every file the implementer will touch (including tests and sync docs).
- §4 Prohibited must include `@afenda/accounting` + ADR-0010 until Phase 9.
- §6 Gates must include `pnpm check:documentation-drift` whenever sync docs are in §3.
- §7 Closes must reference specific gap IDs — not "various gaps".
- §8 Evidence must be file paths — not "tests will prove it".

---

## 5 · Slice section template (write into FDR doc)

```markdown
### Slice N — <short title>

**Status:** Not started | Delivered (<date>)
**Prerequisite:** Slice N-1 runtime evidence row = `implemented` in runtime matrix
**Type:** Research | Implementation | Registry-sync | Evidence-sync
**Risk class:** Low | Medium | High
**Clean Core impact:** A→A | A→B (justify if drop)

#### Design (internal-guide)

<What this slice proves, changes, or discovers. One package only for Implementation slices.>

#### Handoff block

```
Handoff from: docs/delivery/FDR/[status] fdr-NNN-<slug>.md

1. Objective    — ...
2. Allowed layer— ...
3. Files        — ...
4. Prohibited   — ...
5. Authority    — ...
6. Gates        — ...
7. Closes       — ...
8. Evidence     — ...
9. Attestation  — ...
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| N | <criterion> | `pnpm ...` |

#### Known debt

- <deferred item with ADR reference or explicit waiver>
```

---

## 6 · DoD update + readiness score (post-delivery)

After `fdr-slice-implementer` completes:

1. Mark DoD rows `[x]` in FDR doc — only rows with runtime evidence.
2. Update §Remaining gaps (close gap IDs or add new discovered gaps).
3. Update runtime evidence table — set Proven = `Yes — Slice N`.
4. Rename `[status]` prefix if overall FDR status changed.
5. Sync `fdr-status-index` row.
6. If Evidence-sync slice: update §Enterprise readiness score table in FDR.
7. **Recalculate §Enterprise readiness score** when the slice changes evidence, tests, security, observability, documentation, or Clean Core level.
8. Do not increase a dimension score unless the new evidence grade supports it (see `ENTERPRISE-BENCHMARK.md §3.2`).
9. If score changes, record the evidence path beside the changed dimension.

---

## 7 · Quality checklist

- [ ] All hard stops in §0.1 checked — none triggered, or repair report issued
- [ ] Slice discovery table filled (§2)
- [ ] Handoff has exactly 9 fields; no fields omitted
- [ ] §3 Files includes every file the implementer will touch (including tests + sync docs)
- [ ] Research / Evidence-sync slice has no `packages/` or `apps/` paths in §3
- [ ] Each DoD row maps to an enterprise-erp-standards §2 gate
- [ ] Registry edits assigned to `foundation-registry-owner`, not implementer
- [ ] `fdr-status-index` updated in same PR if status changes
- [ ] Risk class declared; High-risk slice has peer-review evidence path
- [ ] Clean Core level impact assessed; drop justified in §Impact analysis
- [ ] Backward compatibility declared for any public API surface change
- [ ] No other active slice owns the same registry entry, runtimeOwner, or deliverable files
- [ ] If parallel execution planned, `fdr-orchestrator` assigned non-overlapping files

---

## 7 · PAS §4.1 promotion checklist (identity-bearing slices)

When an FDR slice adds or promotes a platform entity table, tenant human reference column, or kernel ID family export, the handoff **must** include this checklist in §6 Gates or §Definition of Done:

```markdown
### PAS §4.1 promotion checklist

- [ ] Kernel family registered in `packages/kernel/src/identity/id-family.registry.ts` (Architecture Authority approval for new prefix)
- [ ] `parse*` / `create*` exports present; `check:kernel-identity-surface` pass
- [ ] Drizzle schema uses `primaryId()`, `enterpriseIdColumn(family)`, `enterpriseIdFormatCheck`
- [ ] Row registered in `packages/database/src/ids/platform-entity-table-registry.ts` (`live` or `deferred`)
- [ ] Tenant human reference (if any) uses `tenantHumanReferenceColumn` + `unique (tenant_id, column)` in `tenant-human-reference-registry.ts`
- [ ] Migration generated via `pnpm db:generate` — no SQL-concat backfill; entry in `migration-governance.contract.ts`
- [ ] FK columns reference uuid PK only — `check:fk-uuid-only` pass
- [ ] RLS uses uuid `tenant_id` only — `check:rls-uuid-tenant-only` pass
- [ ] No fiscal IDs on platform floor — `check:forbidden-platform-ids` pass
- [ ] ERP/API ingress parses at boundary — `check:no-unsafe-id-casts` pass
- [ ] Full bundle: `pnpm check:kernel-identity-governance`
```

**Prohibited:** text PK rollout · FK to `enterprise_id` · unregistered ID family · fiscal IDs on platform floor · tenant human number as API canonical ID without explicit tenant context.

---

## 8 · fdr-orchestrator batch rule

`fdr-orchestrator` may batch only slices with **all** of the following:

- Different `runtimeOwner` paths.
- Different `registry entry IDs`.
- No overlapping deliverable files.
- No shared migration files.
- No shared constants or registry keys.
- No shared status/index write — unless assigned exclusively to an Evidence-sync slice.

Violating any condition creates file-collision risk across concurrent subagents.

---

## 9 · Repair report format

When slice authoring cannot proceed due to a hard stop, output this — do not guess:

```text
Cannot author Slice N for fdr-NNN.

Hard stop triggered:
- <hard stop condition from §0.1, numbered>

Required repair:
- <file / path / action needed to resolve>

Do not invoke fdr-slice-implementer until repaired.
```

---

## 10 · Relationship to other skills/agents

| Artifact | Role |
| --- | --- |
| `write-fdr` | Whole FDR doc + §Research scaffold |
| `write-fdr-slice` | One slice handoff (this skill) |
| `fdr-slice-implementer` | Executes one slice |
| `fdr-orchestrator` | Parallel slice batches — see §8 batch rule |
| `foundation-registry-owner` | Registry mutations only |
| `enterprise-erp-standards` | SAP/Oracle gate mapping + Clean Core levels |
| `ENTERPRISE-BENCHMARK.md` | 30-pt scoring, evidence grades, hard fail rules |
| `write-tip-slice` | Archive only — historical TIP repair |
