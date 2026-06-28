# PAS Template — Package Authority Standard

> **Purpose**
>
> This index governs **Package Authority Standards (PAS)** — the canonical feature specs agents implement from.
>
> PAS defines **package boundary, contracts, authority surfaces, slice catalog, and gates**.
>
> PAS never defines business domain meaning, Blueprint boxes, or platform-wide architecture.

Reusable **three-tier** templates for PAS under `docs/PAS/`.

← Back to [SKILL.md](../SKILL.md) · Index: [docs/PAS/README.md](../../../../docs/PAS/README.md)

Cross-document rules: [doc-boundary-contract.md](doc-boundary-contract.md) · [adr-constitution.md](adr-constitution.md) · Upstream: [blueprint-template.md](blueprint-template.md) §9

---

## Three-tier architecture

| Tier | Artifact | Purpose | Agent load |
| --- | --- | --- | --- |
| **1 — Canonical (SSOT)** | `docs/PAS/PAS-NNN-*.md` | Audit trail, contracts, surfaces, slice catalog, acceptance | Routine edits: PAS §0 + cited § only |
| **2 — Agent skill** | `.cursor/skills/<pkg>-authority/SKILL.md` | Default IDE entrypoint; Phase 0 + hard stops | Medium — target ≤350 lines · **generated from PAS** |
| **3 — Reference** | `.cursor/skills/<pkg>-authority/reference/*.md` | TS shapes, trees, quick-ref | On demand · **generated or synced from PAS §4/§6** |

```text
PAS (canonical)
        ↓ generate / regen
SKILL + reference/*.md
        ↓
IDE agents
```

**Governance rule unchanged:** agents obey PAS authority — only the **maintenance model** changes (generation vs manual copy).

**Implement mode:** SKILL → slice 9-field handoff → `/afenda-coding-session` Phase 0 → code → PAS §13 gates.

---

## Authority Escalation Matrix

> Full matrix: [doc-boundary-contract.md](doc-boundary-contract.md#authority-escalation-matrix). Summary for PAS authors:

| Question | Authority |
| --- | --- |
| Change business meaning | Domain North Star |
| Split / merge Blueprint box | Blueprint + ADR |
| Add authority surface | PAS (+ Blueprint if §4.2 shifts) |
| New contract (additive) | PAS §4 |
| Breaking contract | ADR + PAS |
| Modify implementation | Slice |
| Emergency production deviation | ADR + Architecture Authority |
| Registry lane | `@foundation-registry-owner` |

---

## Change Classification Matrix

> Full matrix: [doc-boundary-contract.md](doc-boundary-contract.md#change-classification-matrix).

| Change | Requires |
| --- | --- |
| New business capability | Domain North Star |
| New Blueprint box | Blueprint §3.1 · §4.2 · §4.3 |
| New package (registry PKG) | Blueprint + PAS |
| New authority surface | PAS §4 (type + stability) · Blueprint review |
| New contract | PAS update |
| Breaking contract | ADR + PAS |
| Implementation only | Slice |
| SKILL refresh | Regenerate from PAS |

---

## Document boundary (PAS owns vs must not duplicate)

| Topic | Owner | PAS section | Never duplicate in PAS |
| --- | --- | --- | --- |
| Business mission / domain meaning | Domain North Star | — | §1 (distill package role only) |
| Business capabilities (prose) | Domain North Star §4 | — | §1 |
| Domain principles | Domain North Star §4 | — | §15 only as package doctrine |
| Business boundary owns/never-owns | Domain North Star §9 | — | §2 (one enforceable package sentence) |
| PAS architectural dependencies | **PAS** | §3.4 | Blueprint §5.1 without row |
| Contract type + surface stability | **PAS** | §4 | Unclassified surfaces |
| Package existence, layer, why separate | Blueprint §4 | Metadata pre-fill | §1 long-form restatement |
| Box status, blockers | Blueprint §4, §8 | §0 hard stops (link) | Full ADR prose |
| Consumer list | Blueprint §5 | Metadata `Consumers` | Undeclared consumers |
| PAS inventory counts | Blueprint §10 | Sync on slice close | Second inventory table |
| Authority surfaces + contracts | **PAS** | §4 | Blueprint, North Star |
| Slice catalog + prerequisites | **PAS** | §12 | Blueprint, North Star |
| Implementation sequence | **PAS** | §10 | Blueprint |
| Gate commands | **PAS** | §13 | Blueprint, North Star |

**§1 rule:** One paragraph on **what this package owns technically** — distilled from Blueprint `why separate`, not copied from Domain North Star §1.

---

## Vibe-coding modes

| Mode | Read | Output |
| --- | --- | --- |
| **Author PAS** | Blueprint §4 row + §9 handoff · [pas-doc-template.md](pas-doc-template.md) | PAS doc + skill scaffold + §12 slice plan |
| **Implement slice** | SKILL §0 → slice handoff 9 fields → PAS §4 surface cited in slice | Code + §13 gates + §11 Completion Report |
| **Close slice** | PAS §12 row · slice DoD | Update PAS header · skill · `pas-status-index` · Blueprint §10 counts |

**Implement mode rule:** Phase 0 comes from **slice handoff**, not from reading the full PAS or Blueprint.

**Enterprise 10 / 10 (PAS):** §2 boundary enforced · §3.4 dependencies declared · §4 surfaces typed + stability · §13 gates pass · §11 EAC met · SKILL synced from PAS · no upstream duplication.

---

## PAS maturity labels

Canonical maturity table — [pas-doc-template.md](pas-doc-template.md) links here; do not maintain a second copy with different wording.

| Label | Meaning | Can be coded? | Can be treated as authority? |
| --- | --- | ---: | ---: |
| **Idea** | Directional concept only | No | No |
| **MVP Authority** | Boundary + package skeleton | Limited | Partial |
| **Production Candidate** | Implementable with gates and tests | Yes | Yes, after gates |
| **Enterprise Accepted** | Fully gated, documented, drift-protected | Yes | Yes |
| **Deprecated / Superseded** | Retired | No new work | Historical only |

**YAML `maturity` values:** `idea` · `mvp_authority` · `production_candidate` · `enterprise_accepted` · `deprecated` · `superseded`

**Companion frontmatter** (required when maturity > Idea):

```yaml
maturity: production_candidate
authority_status: <see pas-doc-template metadata table>
implementation_status: not_started | partial | implemented
evidence_level: concept | runtime_partial | runtime_proven
runtime_status: <one sentence — live runtime truth>
remaining_slices: []   # "B<N> — slug (next)" or none — sync on every slice close
```

**Header visibility:** `runtime_status` + `remaining_slices` in YAML **and** metadata table **and** SKILL `## PAS rollout status` **and** [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md).

**Living examples:** PAS-001 Enterprise Accepted · PAS-002 MVP Authority · PAS-003 Production Candidate

Optional **Appendix A** (temporary borrow inventory): [pas-doc-template.md §16](pas-doc-template.md) — not Enterprise Accepted authority.

---

## Upstream pre-checks (before authoring PAS)

Stop if any check fails. Full gate: [Blueprint §7](blueprint-template.md).

| Step | Confirm |
| --- | --- |
| 0a | Feature/capability in [Platform North Star §4](../../../../docs/architecture/afenda-platform-north-star.md) or [Domain North Star §4](north-star-template.md) |
| 0b | Blueprint §4 box with layer + **why separate** + status |
| 0c | [Blueprint §7 PAS creation gate](blueprint-template.md) — all conditions |
| 0d | Domain North Star §13 capability→box name if domain-scoped |
| 0e | [doc-boundary-contract.md](doc-boundary-contract.md) — no upstream prose pasted into PAS §1 |
| 0f | Breaking or Constitutional surface changes have Accepted ADR ([adr-constitution.md](adr-constitution.md)) |

---

## Blueprint → PAS metadata (pre-fill from §4)

From [Blueprint §9 handoff contract](blueprint-template.md). Do not re-debate these in PAS authoring.

| Blueprint §4 field | PAS metadata / section |
| --- | --- |
| **Blueprint box** (name) | `Blueprint box` — architectural authority |
| Registry PKG | `Package` — resolve `@afenda/*` from [`package-registry`](../../packages/architecture-authority/src/data/package-registry.data.ts) |
| Layer | `Layer` · §3.1 Allowed |
| Why separate | §1 + §2 seed (distill — §3.1 matrix outcome) |
| §4.2 owns / never owns | §2 boundary sentence distill |
| Status | Maturity ceiling · §0 hard stops |
| Governing PAS | `PAS ID` |
| §5 consumers | `Consumers` (Blueprint-declared only) |
| §8 blocker | §0 · slice Prerequisites |

---

## Authoring workflow

1. Assign `PAS-NNN` from [docs/PAS/README.md](../../../../docs/PAS/README.md).
2. Copy [pas-doc-template.md](pas-doc-template.md) → `docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md`.
3. Pre-fill metadata from Blueprint §4 ([handoff table above](#blueprint--pas-metadata-pre-fill-from-4)).
4. Declare `Total slices planned` in metadata + §12 at authoring time.
5. **Generate** skill from PAS — [PAS → SKILL generation model](#pas--skill-generation-model) · bootstrap from [pas-skill-template.md](pas-skill-template.md) until automation exists
6. Generate or sync [pas-reference-templates.md](pas-reference-templates.md) scaffolds from PAS §4/§6
7. First Implementation slice: [pas-slice-template.md](pas-slice-template.md) — `Position: Slice N of Total · Blueprint box: <name>`.
8. Register in [docs/PAS/README.md](../../../../docs/PAS/README.md).
9. Add row to [Blueprint §10 PAS Inventory](../../../../docs/architecture/afenda-architecture-blueprint.md).
10. Tombstone pointer in `packages/<package-name>/` (pointer-only).
11. Run [publish validation checklist](#publish-validation-checklist).

**Do not** commit `<placeholders>`.

---

## Implement workflow (vibe-coding entry)

Before any code edit:

- [ ] Blueprint §4 box status permits work (`live` or `planned`; not `blocked`)
- [ ] PAS maturity is not **Idea** or **Deprecated**
- [ ] Target slice exists in PAS §12 with **Prerequisite** satisfied
- [ ] Slice handoff has validated [9 fields](pas-slice-template.md#handoff-validation-before-commit)
- [ ] Load `<package>-authority` SKILL — not full PAS unless slice cites sections
- [ ] Announce `/afenda-coding-session` · paste handoff into Phase 0

```text
SKILL §0 (boundary, hard stops)
        ↓
Slice 9-field handoff → Phase 0
        ↓
PAS §4 surface for this slice only
        ↓
Implement → PAS §13 gates → §11 Completion Report
```

**One slice = one PAS §4 surface (or declared subset)** — not whole PAS in one session.

---

## Slice close sync (mandatory)

On every slice **Delivered**:

| Update | Location |
| --- | --- |
| Slice row status + date | PAS §12 |
| `Delivered slices` · `Remaining slices` | PAS metadata table |
| `runtime_status` if runtime changed | PAS metadata + YAML + **regenerate SKILL** |
| Continuation queue | [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md) |
| `Live / Total slices` | [Blueprint §10](blueprint-template.md) only — not Domain North Star |

---

## Template files

| File | Copy target | Use when |
| --- | --- | --- |
| [north-star-template.md](north-star-template.md) | `docs/architecture/<domain>-north-star.md` | Domain business spec before Blueprint |
| [blueprint-template.md](blueprint-template.md) | `docs/architecture/<scope>-blueprint.md` | Package map before PAS |
| [doc-boundary-contract.md](doc-boundary-contract.md) | (reference) | North Star ↔ Blueprint ↔ PAS boundaries |
| [doc-evidence-standard.md](doc-evidence-standard.md) | (reference) | Source tiers, Reasoning format, lifecycle evidence bars |
| [adr-constitution.md](adr-constitution.md) | (reference) | ADR lifecycle, supersession, traceability |
| [pas-doc-template.md](pas-doc-template.md) | `docs/PAS/PAS-NNN-*.md` | Authoring PAS body |
| [pas-skill-template.md](pas-skill-template.md) | `.cursor/skills/<pkg>-authority/SKILL.md` | Agent skill adapter |
| [pas-slice-template.md](pas-slice-template.md) | `docs/PAS/CSS-AUTHORITY/SLICE/*.md` | Slice handoff |
| [pas-reference-templates.md](pas-reference-templates.md) | `reference/*.md` | TS shapes, trees |
| [adr-constitution.md](adr-constitution.md) | (reference) | ADR lifecycle · supersession · traceability |

**Living example:** [kernel-authority/SKILL.md](../SKILL.md) · [PAS-001](../../../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)

**Legacy:** PAS-001 uses §13 Slice Catalog and §14–§16 gates/doctrine. New PAS: §8 Contract Rules through §15 Doctrine; §12 Slice Catalog.

---

## Naming conventions

| Artifact | Convention | Example |
| --- | --- | --- |
| PAS doc | `PAS-NNN-<PACKAGE-NAME-UPPERCASE>-AUTHORITY-STANDARD.md` | `PAS-002-ARCHITECTURE-AUTHORITY-STANDARD.md` |
| Skill directory | `<package-name>-authority/` | `kernel-authority/` |
| Slice file | `b<N>-<pas-section>-<slug>.md` | `b16-4-authority-surface.md` |
| Prohibited companion | `<slice-base>-prohibited.md` | `b5-prohibited.md` |

---

## Tombstone pointer (packages/*)

Pointer-only — no canonical PAS content in packages:

~~~markdown
# PAS-NNN — <Package Name> Authority Standard (pointer)

Canonical: [docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md](../../docs/PAS/PAS-NNN-<PACKAGE-NAME>-AUTHORITY-STANDARD.md)

Agent skill: [.cursor/skills/<package-name>-authority/SKILL.md](../../.cursor/skills/<package-name>-authority/SKILL.md)
~~~

---

## IDE vibe-coding rules

1. **SKILL first** — full PAS only when slice cites specific sections.
2. **PAS is SSOT** — edit PAS first · regenerate SKILL (do not manually drift SKILL).
3. **SKILL ≤350 lines** — TS shapes → `reference/authority-surfaces.md`.
4. **9-field handoffs** — every Implementation slice; validate before commit.
5. **Status labels** on reference surfaces: `Current` | `Target` | `Deprecated`.
6. **Maturity gates coding** — Idea/Deprecated = stop.
7. **No upstream paste** — §1 is package role, not Domain North Star §2 copy.
8. **Escalate** cross-document changes via [Authority Escalation Matrix](doc-boundary-contract.md#authority-escalation-matrix).

---

## PAS → SKILL generation model

> **Target state:** SKILL and `reference/*` are **generated artifacts** — not manually synchronized copies.
> Until repo automation lands, use the **regeneration checklist** below after every PAS amend.

### Generation flow

```text
docs/PAS/PAS-NNN-*.md  (SSOT — edit here)
        ↓
extract blocks (see table)
        ↓
.cursor/skills/<pkg>-authority/SKILL.md
        ↓
.cursor/skills/<pkg>-authority/reference/*.md
        ↓
IDE / agents
```

### Extract map (PAS → SKILL)

| PAS source | SKILL destination | Notes |
| --- | --- | --- |
| Metadata + YAML | `## PAS rollout status` | runtime_status · remaining_slices |
| §2 | `## Boundary` | verbatim |
| §3.2 + §5 | `## Hard stops` | fenced lists |
| §3.4 | `## Architectural dependencies` | summary table (optional in SKILL) |
| §7 | `## Decision matrix` | full table |
| §4 summary | `## Authority surface summary` | type + stability columns |
| §8 | `## Contract rules` | checklist |
| §13.1 | `## Required gates` | bash block |
| §15 | `## Doctrine` | verbatim |
| — | `## Phase 0` | package paths · gates from §13 |
| §4 shapes | `reference/authority-surfaces.md` | one section per surface |
| §6 | `reference/package-structure.md` | Current vs Target |
| All extracted rows | `## Sync checksum` | Update **Last synced** per touched source · same commit as PAS |

### Regeneration checklist (until CI generator)

After **any** PAS amend touching §2, §3, §4, §7, §8, §13, or §15:

- [ ] Re-run extract map · update SKILL + references
- [ ] Update **`## Sync checksum`** dates for every touched source row ([pas-skill-template.md](pas-skill-template.md))
- [ ] Same-commit rule: PAS + SKILL land together when extracted sections changed
- [ ] SKILL ≤350 lines
- [ ] No `[From PAS §X]` placeholders in committed SKILL
- [ ] `pnpm check:documentation-drift` if wired for PAS/skill pairs

### Bootstrap (new PAS only)

1. Author full PAS from [pas-doc-template.md](pas-doc-template.md)
2. Copy [pas-skill-template.md](pas-skill-template.md) skeleton once
3. **Populate from PAS** via extract map — not incremental manual edits thereafter

**Future automation (recommended):** `pnpm generate:pas-skill --filter PAS-NNN` in CI on PAS path changes — single source of truth preserved.

---

## Publish validation checklist

**Upstream**

- [ ] Platform NS §4 or Domain NS §4 capability confirmed
- [ ] Blueprint §4 box + §7 gate satisfied
- [ ] Blueprint §10 inventory row added
- [ ] [doc-boundary-contract.md](doc-boundary-contract.md) PAS checks pass

**PAS document**

- [ ] Metadata: `Blueprint box`, `Package`, `Layer`, `Consumers` from Blueprint §4–§5
- [ ] `Total slices planned` in metadata + §12 (same number)
- [ ] YAML + header: maturity, `runtime_status`, `remaining_slices`
- [ ] §0 Agent Quick Path present
- [ ] §2 boundary ≤2 sentences — package scope, not business mission essay
- [ ] §3.4 architectural dependencies — ≥1 row · aligns with Blueprint §5.1
- [ ] §4 one section per authority surface · **Contract type** + **Stability** on each
- [ ] §4 Constitutional/Stable surfaces cite ADR when required
- [ ] §12 row per slice
- [ ] §7 matrix ≥8 rows with explicit **Yes** / **No**
- [ ] §11 Enterprise Acceptance: every §11.x has criteria + gate column — no empty subsections
- [ ] §13 gates resolve to real `pnpm` commands

**Skill + references**

- [ ] SKILL ≤350 lines · no placeholders
- [ ] SKILL **matches PAS** per [extract map](#extract-map-pas--skill) — regenerated after PAS amend
- [ ] **`## Sync checksum`** present · dates current for every extracted section
- [ ] `reference/authority-surfaces.md` — Status + Contract type + Stability per surface
- [ ] Registered in [docs/PAS/README.md](../../../../docs/PAS/README.md)
- [ ] Registry lane in §0 + YAML (`registry_lane` or `pending` + owner)
- [ ] Tombstone pointer-only in `packages/<pkg>/`

**First slice**

- [ ] Complete 9-field handoff per [pas-slice-template.md](pas-slice-template.md)
- [ ] `Position: Slice 1 of <Total> · Blueprint box: <name>`
- [ ] Slice `## DoD` table has ≥3 rows; each row has verifiable Gate

---

## Skill sync (PAS → SKILL) — legacy manual map

> **Prefer [generation model](#pas--skill-generation-model).** Use this table only when regenerating manually.

| PAS | SKILL |
| --- | --- |
| §2 | Boundary |
| §3.2 + §5 | Hard stops (fenced) |
| §3.4 | Architectural dependencies (summary) |
| §7 | Decision matrix |
| §4 | Authority surface summary + reference/authority-surfaces.md |
| §8 | Contract rules |
| §13.1 | Required gates |
| §15 | Doctrine |
| — | Phase 0 six-line block (package paths) |
| — | Surface anti-patterns (from §4 lessons) |

---

## Definition of Done (DoD) — three layers (EFR → EAC)

| Layer | Document | Role | Battle-proven rule |
| --- | --- | --- | --- |
| **EFR** | Domain North Star §4–§5, §9 | Permanent enterprise feature requirements | ✓ sources only at Production+ |
| **PAS §11 EAC** | PAS doc §11 | Package acceptance | Gate + trace to EFR |
| **Slice DoD EAC** | Slice `## DoD` | Session acceptance | Gate + trace to PAS §11.x |
| **Completion Report** | `/afenda-coding-session` §11 | Session proof | Gates run · field 7–9 |

```text
Battle-proven EFR (Domain NS §4–§5, §9)
        ↓
PAS §11 EAC (package — criteria + gates)
        ↓
Slice DoD EAC (session — decomposed from §11)
        ↓
Completion Report + gate exit 0
```

**Rules:**

- Slice DoD rows must be **narrower** than PAS §11 — one surface or one deliverable per slice.
- Field **7. Closes** must cite slice DoD row `#` numbers or PAS §11 subsection IDs — never vague text.
- Field **8. Evidence** must list a path for **every** slice DoD row (or explicit `N/A — docs-only`).
- **No new EFR in slices or PAS §1** — business meaning changes → Domain North Star first.
- PAS §11 empty subsection headers are **not acceptable** in committed PAS docs.
- A slice marked **Delivered** with any DoD row unmet is a governance violation.

**Authoring:** Define PAS §11 EAC when authoring PAS. Define slice DoD EAC when authoring each slice. See [pas-doc-template.md §11](pas-doc-template.md), [pas-slice-template.md § DoD](pas-slice-template.md), [doc-evidence-standard.md](doc-evidence-standard.md).

---

## Enterprise acceptance (PAS-level 10 / 10)

| Bar | Evidence |
| --- | --- |
| Boundary enforceable | §2 one sentence; §7 matrix blocks drift |
| Surfaces complete | §4 typed + stability · §3.4 dependencies · Blueprint alignment |
| SKILL synced | Generated/regenerated from PAS · **Sync checksum** dates current |
| Slices serialized | §12 prerequisites honored; one package per Implementation slice |
| Gates real | §13 output in Completion Report |
| PAS §11 complete | Every §11.x row has criterion + gate + **EFR trace** — no empty headers · no ✗ assumptions |
| Slice DoD complete | Every Implementation slice has ≥3 DoD rows with gates |
| Inventory honest | §12 ↔ metadata ↔ Blueprint §10 ↔ `pas-status-index` |
| No doc duplication | §1 ≠ Domain NS; `Consumers` ⊆ Blueprint §5 |
