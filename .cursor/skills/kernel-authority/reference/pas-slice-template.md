# PAS Slice Template

> **Purpose**
>
> The slice is the **last executional document** in the documentation chain — the agent's work order for one session.
>
> It defines **exactly what to change**, **where**, **under which authority**, and **how to prove delivery**.
>
> It never re-specifies business meaning, package maps, or full PAS contracts.

Copy to `docs/PAS/slice/<bN>-<pas-section>-<slug>.md` (platform PAS legacy path).

**Kernel family (PAS-001 / 001A / 001B):** copy to `docs/PAS/KERNEL/SLICE/<bN>-<pas-section>-<slug>.md` — SSOT. Do not author new kernel closure slices under `docs/PAS/slice/` (legacy archive only).

← Index: [pas-template.md](pas-template.md) · Boundaries: [doc-boundary-contract.md](doc-boundary-contract.md)

Optional companion: `<same-base>-prohibited.md` — extra prohibitions (`pas-slice-planner` reads both).

---

## Document boundary (slice owns vs must not duplicate)

| Topic | Owner | Never duplicate in slice |
| --- | --- | --- |
| Business domain meaning | Domain North Star | Purpose paragraph essay |
| Package map, box status | Blueprint §4, §8 | Full box table |
| PAS boundary, §4 surface spec | PAS | Full contract prose — cite § only |
| Slice catalog row | PAS §12 | Whole catalog |
| Gate script list (canonical) | PAS §13 | Invent ad-hoc gates not in field 6 |
| **Session scope** | **Slice handoff 9 fields** | — |
| **Files touched this session** | **Slice field 3** | — |
| **Proof of delivery** | **Slice DoD + fields 7–9** | — |

**Rule:** Slice ** cites** PAS §4 — it does not **replace** PAS §4.

---

## Vibe-coding modes

| Mode | Who | Read | Output |
| --- | --- | --- | --- |
| **Author slice** | Planner / PAS author | PAS §4 surface · §12 row · Blueprint §4 | Slice file + optional `-prohibited.md` |
| **Implement** | Coding agent | SKILL §0 → **9-field handoff** → PAS §4 cited section | Code + gate output |
| **Deliver** | Same agent at session end | DoD table · fields 7–9 | Status `Delivered` + [pas-template slice close sync](pas-template.md#slice-close-sync-mandatory) |

**Implement mode:** Announce `/afenda-coding-session` · paste fields **1–6** into Phase 0 · use fields **7–9** in §11 Completion Report.

---

## Upstream field sources (authoring)

Fill the slice from upstream — do not invent scope.

| Slice element | Source |
| --- | --- |
| `Position: … Blueprint box:` | Blueprint §4 box name · PAS §12 `N of Total` |
| **Prerequisite** | PAS §12 prior row · Blueprint §8 blocker · ADR acceptance |
| **Type** | PAS §12 column |
| Field 2 **Allowed layer** | Blueprint §4 package path · registry `runtimeOwner` |
| Field 4 **Prohibited** | Registry `prohibited[]` + PAS §5 + slice-specific |
| Field 5 **Authority** | `PAS-NNN §X` + skill name + ADR if cited |
| Field 6 **Gates** | PAS §13.1 minimum + slice-specific (real `pnpm` scripts) |
| Field 7 **Closes** | PAS §11 gap · §12 DoD intent · known gap IDs |
| Field 8 **Evidence** | Concrete paths after delivery — not promises |
| Field 9 **Attestation** | Dimensions touched: Contract · Test · Governance · Observability · Security · Documentation · Maintainability |

---

## Phase 0 mapping (`/afenda-coding-session`)

Slice **9 fields** · Phase 0 uses **6 lines** at session start · fields **7–9** close the session.

| Phase 0 line (afenda-coding-session) | Slice handoff field |
| --- | --- |
| 1. Objective | **1. Objective** |
| 2. Allowed layer | **2. Allowed layer** |
| 3. Files to change | **3. Files** |
| 4. Prohibited | **4. Prohibited** |
| 5. Authority | **5. Authority** |
| 6. Acceptance gates | **6. Gates** |
| §11 Completion Report — closes | **7. Closes** |
| §11 Completion Report — evidence | **8. Evidence** |
| §11 Completion Report — attestation | **9. Attestation** |

**Hard stops (implement mode):**

- No handoff block → **stop** — author slice first
- Slice `## DoD` missing or <3 rows on Implementation slice → **stop**
- Any DoD row without verifiable Gate column → **stop**
- Field 3 spans multiple `packages/<owner>/` trees on Implementation slice → **stop** — split slice
- Field 6 has no resolvable `pnpm` command → **stop**
- Field 8 missing path for a DoD row → **stop** before marking Delivered
- Blueprint §4 status `blocked` → **stop** — see Prerequisite
- PAS maturity **Idea** or **Deprecated** → **stop**
- Re-litigating business scope → Domain North Star — not slice Purpose essay

---

## Slice DoD (session-level EAC)

> **Slice DoD = session EAC** — proves one session. **PAS §11 = package EAC** — proves the whole package. Do not duplicate PAS §11 verbatim — decompose it.
> Every DoD row must **trace to battle-proven upstream EFR** via PAS §11.x — not invent new enterprise requirements ([doc-evidence-standard.md](doc-evidence-standard.md)).

### Required table (every Implementation slice)

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | <one verifiable outcome for this slice> | `<test file>` or `pnpm ...` |
| 2 | <next outcome> | `<gate>` |
| 3 | <next outcome> | `<gate>` |

**Minimum rows by Type:**

| Type | Min DoD rows | Gate rule |
| --- | ---: | --- |
| **Implementation** | 3 | ≥2 rows use `pnpm` or named test file |
| **Research** | 2 | May use `Manual review — <owner>` |
| **Registry-sync** | 3 | Must include disposition/drift gate |
| **Evidence-sync** | 2 | Must include doc path + review gate |

**Authoring rules:**

1. Each **Criterion** is testable in one session — not "implement entire PAS".
2. Each **Gate** must be executable or a named artifact — never "tests pass" without path/command.
3. Field **7. Closes** lists DoD row numbers: e.g. `Closes DoD #1–#4; PAS §11.3 governance sync`.
4. Field **8. Evidence** lists one path per DoD row (same order) — file, test, or doc path.
5. **Completion Report** §11 must show each DoD row Pass/Fail with gate output.

**Mapping to PAS §11:**

```text
Slice DoD row #2  →  contributes to PAS §11.2 Type Safety
Slice Delivered   →  PAS §12 row updated
All slices done   →  PAS §11.6 maturity exit criteria evaluated
```

---

## Copy block — slice document

~~~markdown
# Slice <ID> — <Title> (PAS-NNN §<section>)

> **Position:** Slice `<N> of <Total>` in PAS-NNN · Blueprint box: `<Box name from Blueprint §4>`

**Prerequisite:** <prior slice Delivered, ADR acceptance, or Blueprint §8 gate cleared>

**Status:** Not started | Delivered (<YYYY-MM-DD>)

**Type:** Research | Implementation | Registry-sync | Evidence-sync

**Risk class:** Low | Medium | High

**Clean Core impact:** A→A | A→B (justify if drop)

## Purpose

<One paragraph: what this slice proves or changes. Implementation = one package only. Cite PAS § — do not re-author the full surface.>

## Handoff block

```
Handoff from: docs/PAS/slice/<filename>.md

1. Objective    — <one sentence; verifiable outcome>
2. Allowed layer— <packages/<owner>/ or docs-only for Research/Evidence-sync>
3. Files        —
   <one path per line; every file the implementer will touch including tests>
4. Prohibited   — <registry prohibited[] + PAS §5 + slice-specific>
5. Authority    — <PAS-NNN §X · ADR-XXXX if applicable · <pkg>-authority skill>
6. Gates        —
   pnpm --filter @afenda/<name> typecheck
   pnpm --filter @afenda/<name> test:run
   <additional gates from PAS §13 — must resolve to real scripts>
7. Closes       — <DoD row #s e.g. "Closes DoD #1–#5" + PAS §11.x if applicable>
8. Evidence     —
   <one path per DoD row — same order as ## DoD table>
9. Attestation  — <Contract · Test · Governance · … — match DoD dimensions touched>
```

## Rules frozen

1. <Rule that must not drift during this session>
2. <Rule>
3. …

## DoD

> Session-level **EAC**. Mark slice **Delivered** only when every row passes. No ✗ assumptions — each row traces to PAS §11.x or Domain NS EFR.

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | <verifiable outcome — one surface or deliverable> | `<test path>` or `pnpm ...` | PAS §11.x · Domain NS §4 EFR |
| 2 | <outcome> | `<gate>` | |
| 3 | <outcome> | `<gate>` | |
| 4 | <add rows — Implementation slices typically 3–9 rows> | `<gate>` | |

**Field 8 evidence map (author fills after table):**

| DoD # | Evidence path after delivery |
| --- | --- |
| 1 | `<path>` |
| 2 | `<path>` |
| 3 | `<path>` |

## Runtime evidence

| Capability | Proven | Evidence path |
| --- | --- | --- |
| <capability from PAS §4 surface> | No — Slice <ID> | `<path after delivery>` |
~~~

---

## Type-specific rules

| Type | Field 2 | Field 3 | Code |
| --- | --- | --- | --- |
| **Implementation** | One `packages/<owner>/` (or declared app path) | That tree + tests + slice/PAS sync docs | Required |
| **Research** | `docs-only` unless waiver | `docs/**`, `.cursor/**` only by default | No `packages/**` unless listed |
| **Registry-sync** | `packages/architecture-authority` or owner in handoff | Registry + disposition sync files | Per registry owner skill |
| **Evidence-sync** | As declared | Runtime matrix, PAS metadata, status index | Docs + gate output paths |

---

## Copy block — prohibited companion (optional)

~~~markdown
# Slice <ID> — Prohibited (companion)

**Parent:** [`<filename>.md`](<filename>.md)

## Additional prohibitions

- <not covered by registry or PAS §5>
- …

## Documentation-only override

When Type is Research or Evidence-sync:

- Do not modify `packages/**` or `apps/**` unless explicitly listed in handoff field 3
~~~

---

## Author validation (before merge)

- [ ] Row exists in parent PAS §12 with matching ID, Type, Prerequisite
- [ ] `Position` line: `Slice N of Total in PAS-NNN · Blueprint box: <name>`
- [ ] Exactly **9** numbered fields in Handoff fence
- [ ] **`## DoD` table:** ≥3 rows (Implementation) · every row has `#`, Criterion, Gate, **Traces to EFR/EAC**
- [ ] Field 7 cites DoD row numbers (e.g. `Closes DoD #1–#4`)
- [ ] Field 8 lists one evidence path per DoD row
- [ ] Field 3 lists every file (tests, scripts, PAS/slice sync paths)
- [ ] Field 6 has ≥1 resolvable `pnpm` command
- [ ] Field 7 names specific gaps — not vague
- [ ] Field 8 lists paths — not narrative
- [ ] Implementation: field 3 = one `packages/<owner>/` tree
- [ ] No duplicate of PAS §4 full specification
- [ ] [doc-boundary-contract.md](doc-boundary-contract.md) slice checks pass

---

## Implement validation (before code edit)

- [ ] Prerequisite satisfied (prior slice Delivered or ADR gate cleared)
- [ ] SKILL loaded for package authority
- [ ] Phase 0 six lines pasted from handoff fields 1–6
- [ ] Only field 3 files will be edited

---

## Deliver validation (before marking Delivered)

- [ ] **Every DoD row Pass** — gate output captured in Completion Report
- [ ] Field 8 paths exist on disk and match DoD row count
- [ ] All field 6 gates run — output in Completion Report
- [ ] Completion Report drift table all Pass (or escalated)
- [ ] Runtime evidence table updated if applicable
- [ ] Status → `Delivered (<YYYY-MM-DD>)`
- [ ] Run [pas-template slice close sync](pas-template.md#slice-close-sync-mandatory): PAS §12 · metadata · skill · `pas-status-index` · Blueprint §10

---

## Enterprise 9.5 / 10 (slice-level)

| Bar | Evidence |
| --- | --- |
| DoD complete | ≥3 rows; every Gate executed; Completion Report Pass per row |
| Scope is one session | Field 3 file list complete; one package per Implementation slice |
| Authority traceable | Field 5 cites PAS § + skill; Position cites Blueprint box |
| Proof not aspiration | Field 8 paths exist; field 6 gates executed |
| Catalog honest | PAS §12 row status matches slice Status |
| No upstream re-authoring | Purpose ≤1 paragraph; no PAS §4 duplicate |

---

## Naming

| Artifact | Pattern | Example |
| --- | --- | --- |
| Slice file | `b<N>-<pas-section>-<slug>.md` | `b16-10-runtime-rules.md` |
| Prohibited companion | `<base>-prohibited.md` | `b5-prohibited.md` |
| Slice ID | `B<N>` matching filename | `B16` |

**Living example:** [b16-10-runtime-rules.md](../../../../docs/PAS/slice/b16-10-runtime-rules.md) (add `Position` line if missing in older slices).

---

## Final doctrine

The slice is the **only** document an implement agent needs to scope a session.

North Star and Blueprint set **context** — not session scope.

PAS sets **contracts** — the slice cites one § surface.

If scope grows beyond field 3 → **stop** and split a new slice in PAS §12.

If business meaning is wrong → amend upstream docs — do not expand slice Purpose into a spec rewrite.

> **May belong here:** 9-field handoff · Rules frozen · DoD · Runtime evidence · Status.

> **Belongs in PAS:** full §4 surface spec · §13 canonical gate list · §12 full catalog.

> **Belongs upstream:** business meaning · package map · inventory counts (sync on Deliver only).
