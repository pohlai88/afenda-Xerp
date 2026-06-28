# PAS Template — Package Authority Standard

Reusable **three-tier** templates for Package Authority Standards under `docs/PAS/`.

← Back to [SKILL.md](../SKILL.md) · Index: [docs/PAS/README.md](../../../../docs/PAS/README.md)

---

## Three-tier architecture

| Tier | Artifact | Purpose | Agent load |
| --- | --- | --- | --- |
| **1 — Canonical** | `docs/PAS/PAS-NNN-*.md` | Audit trail, ADR traceability, enterprise acceptance | High — read §0 only for routine edits |
| **2 — Agent skill** | `.cursor/skills/<pkg>-authority/SKILL.md` | Default IDE entrypoint; Phase 0 + hard stops | Medium — target ≤350 lines |
| **3 — Reference** | `.cursor/skills/<pkg>-authority/reference/*.md` | TS shapes, trees, ultra-light quick-ref | On demand |

Implementation work flows through **slice handoffs** (`docs/PAS/slice/*.md`) with **9 fields** pasted into `/afenda-coding-session` Phase 0.

---

## PAS maturity labels

Every PAS carries a **maturity label** in YAML frontmatter (`maturity`) and in the document header. Maturity is part of authority — agents must not treat a lower label as enterprise truth.

| Label | Meaning | Can be coded? | Can be treated as authority? |
| --- | --- | ---: | ---: |
| **Idea** | Directional concept only | No | No |
| **MVP Authority** | Enough to reserve boundary and start package skeleton | Limited | Partial |
| **Production Candidate** | Implementable with gates, tests, and known owners | Yes | Yes, after gates |
| **Enterprise Accepted** | Fully implemented, gated, documented, and drift-protected | Yes | Yes |
| **Deprecated / Superseded** | Replaced or retired | No new work | Historical only |

**YAML `maturity` values** (machine-readable):

| Label | `maturity` value |
| --- | --- |
| Idea | `idea` |
| MVP Authority | `mvp_authority` |
| Production Candidate | `production_candidate` |
| Enterprise Accepted | `enterprise_accepted` |
| Deprecated / Superseded | `deprecated` or `superseded` |

**Companion frontmatter fields** (required when maturity is above Idea):

```yaml
maturity: mvp_authority | production_candidate | enterprise_accepted
authority_status: <see pas-doc-template.md>
implementation_status: not_started | partial | implemented
evidence_level: concept | runtime_partial | runtime_proven
runtime_status: <one sentence — what is live at runtime today>
remaining_slices: []   # or list of "B<N> — slug (proposed|next)" — update on every slice close
```

**Header visibility rule:** `runtime_status` and `remaining_slices` must appear in **both** YAML frontmatter **and** the markdown header block (below evidence level) so agents see continuation work without scrolling. Mirror the same values in the package authority **SKILL.md** `## PAS rollout status` section. Sync with [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md) when closing slices.

**Living examples:**

| PAS | Label |
| --- | --- |
| PAS-001 | Enterprise Accepted |
| PAS-002 | MVP Authority |
| PAS-003 | Production Candidate (+ [Appendix A borrow inventory](../../../docs/PAS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md#appendix-a--borrow-reference-inventory-temporary) — temporary) |

Optional **Appendix A — Borrow reference inventory (temporary)** for PAS docs with prior art: see [pas-doc-template.md §16](pas-doc-template.md#16-appendix--borrow-reference-inventory-optional-temporary). Not Enterprise Accepted authority; retire when slice handoffs absorb references.

---

## How to use

1. Assign the next `PAS-NNN` number from [docs/PAS/README.md](../../../../docs/PAS/README.md).
2. Copy from [pas-doc-template.md](pas-doc-template.md) → create `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`.
3. Copy from [pas-skill-template.md](pas-skill-template.md) → create `.cursor/skills/<package-name>-authority/SKILL.md`.
4. Copy reference scaffolds from [pas-reference-templates.md](pas-reference-templates.md).
5. Copy from [pas-slice-template.md](pas-slice-template.md) when authoring the first implementation slice.
6. Register the PAS in `docs/PAS/README.md`.
7. Add a tombstone pointer in `packages/<package-name>/` (pointer-only — see below).
8. Run the [publish validation checklist](#publish-validation-checklist).

**Do not** leave `<placeholders>` in committed docs or skills.

---

## Template files

| File | Copy target |
| --- | --- |
| [pas-doc-template.md](pas-doc-template.md) | `docs/PAS/PAS-NNN-*.md` |
| [pas-skill-template.md](pas-skill-template.md) | `.cursor/skills/<pkg>-authority/SKILL.md` |
| [pas-slice-template.md](pas-slice-template.md) | `docs/PAS/slice/*.md` |
| [pas-reference-templates.md](pas-reference-templates.md) | `reference/quick-ref.md`, `authority-surfaces.md`, `package-structure.md` |

**Living example:** [kernel-authority/SKILL.md](../SKILL.md) · [PAS-001](../../../../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md)

**Legacy note:** PAS-001 includes §8 Permission Model (kernel extension), §13 Slice Catalog, and §14–§16 gates / guardrail / doctrine. Generic new PAS docs follow §8 Contract Rules through §15 Doctrine.

---

## Naming conventions

| Artifact | Convention | Example |
| --- | --- | --- |
| PAS doc | `PAS-NNN-<PACKAGE-NAME-UPPERCASE>-AUTHORITY-STANDARD.md` | `PAS-002-DATABASE-AUTHORITY-STANDARD.md` |
| Skill directory | `<package-name>-authority/` | `database-authority/` |
| Skill name (frontmatter) | `<package-name>-authority` | `database-authority` |
| Tombstone file | Same filename as PAS doc | `PAS-002-DATABASE-AUTHORITY-STANDARD.md` |
| Slice file | `b<N>-<pas-section>-<slug>.md` | `b16-10-runtime-rules.md` |
| Prohibited companion | `<slice-base>-prohibited.md` | `b5-prohibited.md` |

---

## Tombstone pointer (packages/*)

Canonical content lives only in `docs/PAS/`. Package-local files are **pointer-only**:

~~~markdown
# PAS-NNN — <Package Name> Authority Standard (pointer)

Canonical: [docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md](../../docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md)

Agent skill: [.cursor/skills/<package-name>-authority/SKILL.md](../../.cursor/skills/<package-name>-authority/SKILL.md)

Do not duplicate long-form authority content in this file.
~~~

---

## IDE vibe-coding rules

1. **Agents load SKILL first**, not the full PAS — unless a slice handoff cites specific PAS sections.
2. **Duplicate high-signal blocks** in SKILL (boundary, matrix, hard stops, Phase 0) — never `[From PAS §X]` placeholders in committed skills.
3. **SKILL ≤350 lines** — move TypeScript shapes to `reference/authority-surfaces.md`.
4. **YAML frontmatter** on new PAS docs — enables `pas-slice-planner` and registry cross-checks.
5. **9-field handoffs** for every Implementation slice — field names in [pas-slice-template.md](pas-slice-template.md).
6. **Status labels** on every reference surface: `Current` | `Target` | `Deprecated`.

---

## Publish validation checklist

Before merging a new PAS + skill:

- [ ] YAML frontmatter complete; no placeholders in committed PAS doc
- [ ] **Maturity label** set in YAML + §header block (see [PAS maturity labels](#pas-maturity-labels))
- [ ] **`runtime_status` + `remaining_slices`** in YAML, header block, matching skill, and [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md)
- [ ] §0 Agent Quick Path present in PAS doc
- [ ] §2 boundary ≤2 sentences
- [ ] §7 decision matrix has ≥8 rows with explicit Yes/No answers
- [ ] §13 gates resolve to real `pnpm` scripts (or waiver documented in slice/FDR)
- [ ] SKILL.md ≤350 lines; no `[From PAS §X]` placeholders remain
- [ ] SKILL duplicates matrix + hard stops + Phase 0 (not link-only)
- [ ] `reference/authority-surfaces.md` uses Status labels on every surface
- [ ] Registered in [docs/PAS/README.md](../../../../docs/PAS/README.md) index
- [ ] Registry lane noted in §0 and YAML (`registry_lane` or `pending` with owner)
- [ ] Tombstone pointer in `packages/<pkg>/` is pointer-only (no canonical content)
- [ ] First implementation slice has complete 9-field handoff per [pas-slice-template.md](pas-slice-template.md)

---

## Skill duplication checklist (PAS → SKILL)

When authoring the skill from a completed PAS, verify these blocks are **copied verbatim**, not linked:

| PAS section | SKILL section |
| --- | --- |
| §2 | Boundary |
| §3.2 + §5 | Hard stops (fenced) |
| §7 | Decision matrix (full table) |
| §8 | Contract rules (checkboxes) |
| §13.1 | Required gates |
| §15 | Doctrine |
| — | Phase 0 six-line block (package-specific paths) |
| — | Surface anti-patterns table (from code review / §4 lessons) |
