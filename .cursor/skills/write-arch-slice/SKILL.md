---
name: write-arch-slice
description: Authors and validates enterprise ARCH delivery documents and their per-slice handoff files for the Afenda ERP monorepo. Use when the user asks to write a new ARCH document, add a slice to an existing ARCH, update slice status, or author a slice-index. Understands the ARCH-TEMPLATE.md format, the 19-section ARCH file structure, the 9-field slice handoff block, and the arch-status-index.md catalog rules.
---

# Write ARCH Slice

Authors production-ready ARCH delivery documents and per-slice handoff files following the Afenda enterprise architecture standard.

## Authority chain — read before authoring

```text
1. docs/ARCH/arch-status-index.md         — catalog rules, domain codes, filename rules
2. docs/ARCH/ARCH-TEMPLATE.md             — 17-section ARCH template (source of truth for structure)
3. docs/delivery/fdr-status-index.md      — paired FDR registry
4. docs/architecture/afenda-runtime-truth-matrix.md
5. packages/architecture-authority/src/data/foundation-disposition.registry.ts
6. Reference: docs/ARCH/[Complete] ARCH-AUTH-001-enterprise-authentication.md
7. Reference: docs/ARCH/[Complete] ARCH-AUTH-002-auth-shell.md
```

---

## Document types

| Type | Path | When |
|------|------|------|
| Main ARCH file | `docs/ARCH/[status] ARCH-<DOMAIN>-<NNN>-<slug>.md` | New feature/capability delivery |
| Slice handoff | `docs/ARCH/slices/ARCH-<DOMAIN>-<NNN>/slice-<NN>-<slug>.md` | One executable implementation unit |
| Slice index | `docs/ARCH/slices/ARCH-<DOMAIN>-<NNN>/slice-index.md` | Catalogue of all slices for an ARCH |

---

## ARCH file structure (19 sections)

Write sections in this exact order. All are required.

```text
§1  Execution instruction     — who executes, what evidence standard, paste-ready agent command
§2  Target item               — metadata table (Work ID, title, status, package, lane, score target)
§3  Authority chain           — numbered read-order list; domain-specific files first
§4  Problem statement         — current risk/gap + business/architecture impact
§5  Architecture requirement  — §5.1 Ownership table · §5.2 Boundary rules · §5.3 Prohibited actions
                                §5.4 Production classification vocabulary (P0/P1/P2/P3 table)
§6  Required implementation scope — §6.x named sections; contracts/CSS/integration/a11y/security
§7  Enterprise acceptance criteria — Gherkin: primary, negative, drift, consumer scenarios
§8  Enterprise quality benchmark  — 6 dimensions × 5-pt scale; target 29/30
§9  Non-functional requirements   — 8-row table (suitability, security, compat, reliability…)
§10 Required gates            — exact pnpm commands + gate report table
§11 Definition of Done        — 20-row checklist
§12 Impact analysis           — consumer table + 4-line risk summary
§13 Waiver policy             — waiver table; "No waiver may hide broken P0 runtime"
§14 Rollback strategy         — change-area table; preserve list
§15 Slice N delivery notes    — one section per delivered slice (add as slices close)
§16 Implementation slices     — ordered table linking to slice docs
§17 Promotion rule            — text block + allowed status labels
§18 Required output from IDE / agent — report template
§19 Command to execute        — paste-ready execution block
```

---

## Slice handoff file structure

Each slice file = `slice-<NN>-<slug>.md`. Required sections:

```text
1. Header table — Parent ARCH / Prerequisite slice / Slice N / Status / Type / Risk / Clean Core
2. Handoff block (fenced code block, 9 fields — see below)
3. Acceptance — checkbox list
4. Notes — implementation hints, cross-references
```

### The 9-field handoff block (mandatory format)

```
Handoff from: docs/ARCH/slices/<ARCH-ID>/slice-<NN>-<slug>.md

1. Objective    — one or two sentences; what this slice delivers
2. Allowed layer— exact package path(s) only; e.g. packages/appshell/src/auth-shell/**
3. Files        — explicit list of files to create or modify
4. Prohibited   — packages/paths off limits for this slice
5. Authority    — parent ARCH sections + any cross-referenced ADRs/skills
6. Gates        — exact pnpm commands to run (copy from parent §10)
7. Closes       — which P0/P1 gap this slice closes
8. Evidence     — what runtime proof must exist after the slice
9. Attestation  — comma-separated quality dimensions: Contract · TypeScript · Boundary · etc.
```

---

## Domain codes and ID format

| Domain | Meaning |
|--------|---------|
| `AUTH` | Identity, auth surfaces, auth shell |
| `ADMIN` | System admin control plane |
| `USER` | Signed-in user settings |
| `DOCS` | Fumadocs documentation site |
| `SUPA` | Supabase platform/Postgres |
| `EMAIL` | Resend transactional email |
| `TEST` | Monorepo test pyramid |

**Work ID:** `ARCH-<DOMAIN>-<NNN>` (three-digit sequence per domain: `001`, `002`…)  
**Filename:** `[Status] ARCH-<DOMAIN>-<NNN>-<kebab-slug>.md`  
**Status prefix values:** `[Not started]` · `[Partially Implemented]` · `[Complete]` · `[Blocked]`

---

## Production classification vocabulary (P0–P3)

Every capability, gap, or exclusion **must** use one of these — not informal timeline words.

| Bucket | Meaning |
|--------|---------|
| **P0 — Production mandatory** | Must be closed before enterprise production |
| **P1 — Production hardening** | Should close for 9.5 unless formally waived |
| **P2 — Excluded from current release** | Not in scope; requires separate ARCH/FDR approval |
| **P3 — Enhancement backlog** | Post-9.5 only |

**Prohibited in any ARCH/slice doc:** `future`, `defer`, `optional later`, `v2 maybe`, `when needed`, `TBD later`, `nice to have later`.

**Required wording for P2 exclusions:**
```
Not in current production release scope.
Requires separate ARCH/FDR approval before implementation.
No runtime code may be added under this capability in this work item.
```

---

## Enterprise quality benchmark targets

| Dimension | Target |
|-----------|--------|
| Contract stability | 5/5 |
| Test coverage | 5/5 |
| Observability + audit | 4/5 minimum |
| Security + RBAC + RLS | 5/5 |
| Documentation + BRD traceability | 5/5 |
| Maintainability + Clean Core | 5/5 |

Minimum score: **28/30** (foundation acceptable). Enterprise 9.5: **29/30, no dimension below 4/5**.

---

## Authoring workflow

### Phase 1 — Gather

Read the authority chain (listed above). Confirm:
- Domain code and next sequence number from `arch-status-index.md`
- Paired FDR ID from `fdr-status-index.md`
- Registry entry from `foundation-disposition.registry.ts`
- Lane from the registry (`green-lane / amber-lane / red-lane / blue-lane`)

### Phase 2 — Write main ARCH file

1. Filename: `[Not started] ARCH-<DOMAIN>-<NNN>-<slug>.md`
2. Fill all 19 sections. Never skip a section — use `—` or `None` if not applicable.
3. §5.1 Ownership table must name the allowed path for every concern.
4. §5.3 Prohibited actions must list the template defaults plus domain-specific prohibitions.
5. §5.4 must classify every in-scope and out-of-scope capability as P0/P1/P2/P3.
6. §7 must have at minimum: primary path, negative/security path, drift protection, consumer compatibility.
7. §11 DoD must have exactly 20 rows.
8. §16 slice table links to files that may not yet exist — that is expected.

### Phase 3 — Write slice files

For each slice in §16:

1. Create `docs/ARCH/slices/ARCH-<DOMAIN>-<NNN>/slice-<NN>-<slug>.md`
2. Write the header table (parent link must use URL-encoded brackets if filename has them)
3. Write the 9-field handoff block in a fenced code block (no markdown inside the block)
4. Write the acceptance checklist (checkbox list matching the slice objective)
5. Add implementation notes and cross-references

Write `slice-index.md` last — it lists all slices with status, type, and linked doc.

### Phase 4 — Register

Update `docs/ARCH/arch-status-index.md`:
- Add a row to the ARCH register table
- Set status to `Not started` unless slices are already delivered

---

## Key conventions from real examples

**ARCH-AUTH-002 pattern (use as reference):**
- `§1` includes a paste-ready agent command block with skill shortcuts (`/auth-shell /afenda-ui-quality …`)
- `§2` repeats the target item table from the header for executor context
- `§3` includes an ownership boundary comparison table (ARCH-X vs ARCH-Y) when related ARCHes exist
- `§6` uses numbered subsections (`§6.1`, `§6.2`…) for large scope; includes code blocks for contract shapes
- `§15+` each delivered slice gets its own section inside the main ARCH file with internal implementation map
- `§16` slice table links to individual slice docs; use `Not started` until delivered

**Slice handoff pattern (use ARCH-AUTH-002 Slice 2 as reference):**
- Field 1 (Objective) names every export/component being created — no vague "implement the feature"
- Field 2 (Allowed layer) is a single path pattern — not multiple packages
- Field 3 (Files) is an explicit newline-separated file list, indented under the field label
- Field 6 (Gates) copies exact commands from parent §10 — no paraphrasing
- Field 9 (Attestation) uses the standard dimensions: `Contract · TypeScript · Boundary`

---

## Quality checks before finalizing

- [ ] All 19 sections present in main ARCH file
- [ ] No P2/P3 capability labeled with prohibited vocabulary
- [ ] §5.4 accounts for every out-of-scope capability with a P-bucket
- [ ] §7 has at least 4 Gherkin scenarios
- [ ] §11 has exactly 20 DoD rows
- [ ] Every slice in §16 links to a file under `docs/ARCH/slices/ARCH-<DOMAIN>-<NNN>/`
- [ ] Slice handoff block has all 9 fields
- [ ] Acceptance checklist is concrete and checkable (not "implement well")
- [ ] `arch-status-index.md` row added
- [ ] Filename status prefix matches §2 Status field

---

## Reference files

- Template: `docs/ARCH/ARCH-TEMPLATE.md`
- Real example (Complete): `docs/ARCH/[Complete] ARCH-AUTH-002-auth-shell.md`
- Real example (Complete): `docs/ARCH/[Complete] ARCH-AUTH-001-enterprise-authentication.md`
- Slice example: `docs/ARCH/slices/ARCH-AUTH-002/slice-02-package-contracts-components.md`
- Index: `docs/ARCH/arch-status-index.md`
