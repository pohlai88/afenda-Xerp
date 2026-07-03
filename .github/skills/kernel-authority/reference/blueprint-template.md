# [SCOPE] Architecture Blueprint

> **Purpose**
>
> The Architecture Blueprint is the **architectural map** between North Star capabilities and PAS feature specs.
>
> It declares **what Blueprint boxes exist**, **why each is separate**, **how they compose**, and **which PAS governs each box**.
>
> **Blueprint Box** is the permanent architectural identity. Workspace `@afenda/*` names are derived from [`package-registry`](../../packages/architecture-authority/src/data/package-registry.data.ts) — not invented in prose here.
>
> It never defines business mission, domain principles, business boundaries, contracts, slice ordering, or gate commands.

> Fill-in template. Replace `[PLACEHOLDER]`. Delete instruction lines (lines beginning with `>`).
> **Architectural map:** §1–§8 · **Decision & composition:** §3.1–§3.2, §4.2–§4.3, §5.1 · **Evidence:** §4, §4.1, §8 · **PAS handoff:** §9–§12 · **Agent rules:** §0, §13.
> Cross-document rules: [doc-boundary-contract.md](doc-boundary-contract.md) · [doc-evidence-standard.md](doc-evidence-standard.md)

| Field | Value |
| --- | --- |
| **Document class** | `architecture_blueprint` |
| **Document role** | `architecture_box_map` |
| **Architectural identity** | **Blueprint Box name** (§4) — permanent |
| **Workspace mapping** | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) — `@afenda/*` npm name |
| **Scope** | `[SCOPE]` — e.g. Afenda Platform, Accounting domain |
| **Parent** | [Platform North Star](../../docs/NORTHSTAR/kernel-north-star.md) · Domain North Star §4 (if domain-scoped) |
| **Authority ADR** | [ADR-0026](../../docs/adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Derived documents** | One root PAS per Blueprint box |
| **Maturity** | Idea / MVP / Production / Enterprise |
| **Runtime stance** | Documentation only — references registries; does not duplicate PKG tables |
| **Total PAS at maturity** | `[N]` root PAS · `[M]` total (derived extensions) |
| **Live PAS today** | `[N]` |
| **Planned PAS** | `[N]` |
| **Does not confer** | Business domain meaning, contracts, slice handoffs, registry rows, acceptance gates |
| **Machine registry** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) |
| **Quality target** | Enterprise **10 / 10** |
| **Evidence standard** | [doc-evidence-standard.md](doc-evidence-standard.md) |
| **Last reviewed** | `[YYYY-MM-DD]` — update on every §4 amendment |
| **Next document** | PAS-[NNN] per box |

> **One sentence:** [What Blueprint boxes exist, why separate, how they compose conceptually, which PAS governs each box — not why the business domain exists.]

---

# 0. Agent Quick Path

> Package/PAS map in §4–§12. Business meaning → [Domain North Star](north-star-template.md) §1–§12 ([boundary contract](doc-boundary-contract.md)).

## Read order

1. [Platform North Star](../../docs/NORTHSTAR/kernel-north-star.md)
2. [Domain North Star §4](../../docs/PAS/) — if domain-scoped; capabilities only
3. This document §4 — Blueprint box for your package
4. Target PAS — never implement from Blueprint alone
5. Target Slice
6. Implement

## This document answers

- What **Blueprint boxes** exist and **why separate** (repeatable §3.1 test — not judgment alone)
- Layer per box · **dependency category** (§3.2) · conceptual composition (§5.1)
- Box **owns / never owns** (§4.2) · change impact (§4.3)
- PAS ID per box · box status · PAS inventory counts
- Registry PKG link per box — workspace name derived, not architectural authority

## This document never answers

- Why the business domain exists (Domain North Star §1)
- Business capabilities in prose (Domain North Star §4 — link only)
- Business boundary owns/never-owns (Domain North Star §9)
- Domain principles (Domain North Star §5)
- Business events, lifecycles, vocabulary (Domain North Star §3, §7, §8)
- PAS §2 boundary sentence · PAS §4 contracts · slice order (PAS §10–§12) · gates (PAS §13)

## Hard stops

- Do not create a workspace package without a §4 **Blueprint box**
- Do not invent `@afenda/*` names in Blueprint prose — link **Registry PKG** only
- Do not split or merge boxes without §3.1 decision matrix + §4.3 impact review
- Do not author PAS without §7 gate satisfied
- Do not implement `blocked` boxes until §8 gate clears
- Do not list PAS **Consumers** undeclared in §5
- Do not restate Domain North Star §4 as paragraphs — link and map only
- Do not duplicate PKG-* tables — use registries

**Chain rule:** Platform North Star → Domain North Star → Blueprint → PAS → Slice → Code

---

# 1. Blueprint Purpose

Before authoring PAS, answer from **this document only**:

1. **What** Blueprint box is in scope? (§4 — box name is authority)
2. **Why separate** — did §3.1 decision matrix justify a new box? (§4 Reasoning)
3. **Which layer**? (§3–§4)
4. **What does the box own / never own**? (§4.2)
5. **Who consumes**? (§5)
6. **Which PAS**? (§4, §10)
7. **Registry PKG** for workspace path? (link — [`package-registry`](../../packages/architecture-authority/src/data/package-registry.data.ts))

Business **why the domain exists:** [Domain North Star §1](north-star-template.md) — do not copy here.

---

# 2. Upstream Traceability

> Link upward. **Do not restate** North Star capability prose.

| Upstream | Link | This Blueprint uses |
| --- | --- | --- |
| Platform North Star | §4 authority surfaces | Platform-wide boxes |
| Domain North Star | §4 capabilities · §13 capability→box map · §9 dependencies · §10 risks · §11 quality | Domain boxes only |
| ADRs | As cited | Blockers in §8 |

**Capability → box rule:** Every §4 box traces to one Domain North Star §4 capability (or Platform NS §4 at platform scope). One capability may yield multiple boxes when §4 **why separate** is explicit. Box Reasoning may cite Domain NS §10 risk and §11 quality attribute.

| Domain NS §4 capability | Blueprint §4 box | Domain NS Decision ID |
| --- | --- | --- |
| [From Domain North Star §13 — copy names only] | `[BOX NAME]` | D1, D2, … |

> **Do not duplicate** capability descriptions — names, Decision IDs, and links only ([doc-boundary-contract.md](doc-boundary-contract.md)).

---

# 3. Layer Map

> Machine truth: [`layer-registry.md`](../../packages/architecture-authority/src/data/layer-registry.data.ts). Narrative intent only.

| Layer | Blueprint intent |
| --- | --- |
| **Platform** | Shared truth — kernel, permissions, governance |
| **Design** | Visual truth — CSS, UI primitives |
| **Foundation** | Cross-domain infrastructure — execution, standards |
| **Metadata** | Metadata contracts and metadata UI |
| **Integration** | Entitlements, feature flags |
| **ERPSpine** | Shell — navigation, layout |
| **Domain** | LoB runtime packages |
| **Application** | Delivery — ERP, docs, Storybook |

**Dependency rule:** Lower layers may not import from higher layers (compile-time — see §3.2).

---

# 3.1 Architecture Decision Matrix

> **Repeatable test** for creating, splitting, or merging Blueprint boxes. Run **before** adding a §4 row or changing `why separate`.
> If any **If Yes → New box** row applies and boxes are merged → **stop** — amend via ADR + §4.3 impact review.

| Question | If **Yes** | If **No** | Notes |
| --- | --- | --- | --- |
| Different **business capability** (Domain NS §4 EFR)? | **New box** | Stay together | Capability parent must exist in Domain NS first |
| Different **lifecycle** (Domain NS §8 entity lifecycle)? | **New box** | Same box | e.g. Journal vs Period Close |
| Different **ownership** (team / domain steward)? | **New box** | Same box | Organizational boundary |
| **Independent deployment** candidate? | **New box** (candidate) | Merge | May stay `planned` until split justified |
| Separate **regulatory responsibility**? | **New box** | Same box | Cite T3 standard in Reasoning |
| Shared **kernel / platform** service? | **Platform layer** box | **Domain layer** box | Not a domain LoB box |
| Different **PAS maturity** or release train? | Consider split | Same box | Document in §4.3 |
| §3.1 passes but only **technical** split? | **Insufficient alone** | — | Need ≥1 business/architectural Yes above |

**Workflow:** Domain NS EFR exists → run matrix → record result in §4 **Reasoning** → add §4.2 responsibility → add §4.3 impact row → registry PKG via `@foundation-registry-owner` if new workspace package.

---

# 3.2 Canonical Dependency Categories

> Not every dependency is the same. Classify every cross-box edge in §5 and §5.1 with one primary category.
> Layer direction (§3) governs **compile-time**; other categories have separate rules in PAS §4.

| Category | Meaning | Allowed direction | Enforced by |
| --- | --- | --- | --- |
| **Compile-time** | TypeScript import / package dependency | Lower layer → higher forbidden | `pnpm quality:architecture` |
| **Runtime** | Process, service, or job invocation at execution | Declared consumer + PAS §4 surface | PAS §4 · integration tests |
| **Metadata** | Schema, field, or taxonomy reference | Metadata → Domain contract read | Metadata PAS · kernel wire |
| **Configuration** | Tenant flag, entitlement, feature toggle | Integration → consumer read | `@afenda/integration` PAS |
| **Knowledge** | Enterprise term, standard, or glossary atom | Read-only reference to PAS-004 | `pnpm check:knowledge-conformance` |

**Rules:**

- **Compile-time** violations are hard stops — no exceptions without ADR.
- **Runtime** dependencies must appear in §5 consumers **or** §5.1 composition with category noted.
- **Knowledge** dependencies cite Domain NS §3 term or PAS-004 atom — not ad-hoc strings.
- When unsure, default to **Compile-time** (strictest) until PAS §4 clarifies.

---

# 4. Blueprint Boxes

> **Canonical edit surface for architectural identity.** **Blueprint Box name** is permanent authority in this document.
> **Registry PKG** links workspace/npm mapping — [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) is SSOT for `@afenda/*`; Blueprint links, does not duplicate full PKG tables.
>
> Every row requires **§3.1 matrix passed** + battle-proven upstream EFR + **Source + Reasoning** ([doc-evidence-standard.md](doc-evidence-standard.md)).

### Box → workspace authority chain

```text
Blueprint Box name (this document §4 — architectural authority)
        ↓
package-registry.data.ts (PKG-* → @afenda/* npm name)
        ↓
foundation-disposition.registry.ts (lane · runtimeOwner)
        ↓
packages/<owner>/ filesystem
```

| Action | Update |
| --- | --- |
| **Package rename** (npm/workspace) | Registry + PAS metadata — **box name unchanged** |
| **Architectural split/merge** | ADR + §3.1 + §4.3 + box row change + Domain NS §13 |
| **New workspace package** | §4 box first → `@foundation-registry-owner` → registry row |

| Blueprint box | Layer | Registry PKG | Why separate | Source | Reasoning (Because → Therefore) | Status | Governing PAS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **[BOX 1]** | [layer] | `PKG…` → `@afenda/…` | [One sentence — §3.1 result] | `[T0–T6]` · Domain NS D# | **Because** … **Therefore** … | live / planned / blocked / retired | PAS-[NNN] |
| **[BOX 2]** | | | | | | | |

**Status:**

| Status | Meaning |
| --- | --- |
| **live** | Box + registry PKG + PAS path active |
| **planned** | Box declared; registry PKG may be `planned` |
| **blocked** | ADR-gated — see §8 |
| **retired** | Historical — do not recreate without ADR |

> **`why separate`** = outcome of §3.1 matrix — not judgment alone. **Domain boundary** = Domain North Star §9 — different question.
> **`Source`** must cite Domain NS §4 **EFR** (T1 ✓) and ADR (T0) when blocked. Assumptions (✗) never justify a new box.

---

# 4.1 Blueprint Evidence Register

> Architectural sources for this Blueprint scope. Link only — no ADR duplication.

| ID | Source | Tier | Justifies | Link |
| --- | --- | --- | --- | --- |
| B1 | [ADR-XXXX] | T0 | Box split / blocker | [`docs/adr/…`](../../docs/adr/) |
| B2 | [Domain NS §12 E#] | T1 | Business capability / risk parent | [Domain North Star](north-star-template.md) |
| B3 | [layer-registry / PKG row] | T4 | Layer assignment sync | [`layer-registry.md`](../../packages/architecture-authority/src/data/layer-registry.data.ts) |
| B4 | [runtime-truth-matrix row] | T5 | `live` vs `planned` status | [`afenda-runtime-truth-matrix.md`](../../docs/PAS/pas-status-index.md) |

---

# 4.2 Box Responsibility Matrix

> **Architectural owns / never owns** per box — prevents boundary drift. Distinct from Domain NS §9 (business domain boundary).
> PAS §2 boundary sentence **distills** from this matrix — do not paste verbatim.

| Blueprint box | Owns (architectural) | Never owns (explicit exclusions) | Domain NS trace |
| --- | --- | --- | --- |
| **[BOX — e.g. Ledger]** | journal persistence · balance calculation | tax · reporting · budgeting | §4 EFR · §9 |
| **[BOX 2]** | | | |
| **[BOX 3]** | | | |

**Examples (replace with scope-specific rows):**

| Box | Owns | Never owns |
| --- | --- | --- |
| **Accounting Standards** | rules validation · standard interpretation contracts | posting runtime · ledger persistence |
| **Posting Runtime** | post · validate · emit journal events | standard rule authoring · tax filing |

> **Rule:** Every **live** box must have §4.2 row before Production PAS maturity. **Never owns** must name sibling **box names** or **business domains** — not vague "other stuff".

---

# 4.3 Change Impact Matrix

> When a Blueprint box changes, trace blast radius **before** merge. Required for box split, merge, rename of architectural meaning, or layer change.
> Package **npm rename** alone → registry + PAS metadata only (see §4 authority chain).

| If this box changes… | PAS impacted | Domain NS | Registry PKG | Primary gates / tests | ADR required |
| --- | --- | --- | --- | --- | --- |
| **[BOX 1]** | PAS-[NNN] · slices §12 rows | §4 EFR · §13 map | `PKG…` | `pnpm --filter @afenda/…` · `<test paths>` | [ADR-XXXX or none] |
| **[BOX 2]** | | | | | |
| **Any new box** | New PAS + §10 row | §13 new row | New PKG via registry owner | Architecture + disposition gates | Yes if split |
| **Box merge** | Retire PAS · migrate slices | Amend §4 · §13 | Retire PKG or consolidate | Full regression per §4.3 row | Yes |
| **Layer change** | PAS §3 imports · consumers | — | May unchanged | `pnpm quality:architecture` | Yes |

**Workflow on change:**

```text
Proposed change
        ↓
§3.1 matrix (split/merge?) + §4.3 row filled
        ↓
ADR if architectural
        ↓
Domain NS §13 (if EFR/box map affected)
        ↓
§4 · §4.2 · §5.1 · PAS · registry · slices
        ↓
Gates in §4.3 column pass
```

---

# 5. Composition and Consumers

> **Runtime / compile-time consumer declaration.** Pair with §5.1 conceptual composition. Tag primary **dependency category** (§3.2).

```text
[BOX upstream] ──► [BOX consumer-a]
              └──► apps/erp
```

| Blueprint box | Declared consumers | Dependency category (§3.2) | Notes |
| --- | --- | --- | --- |
| [BOX NAME] | `[BOX]` · `@afenda/[pkg]` · `apps/erp` | Compile-time / Runtime / … | PAS **Consumers** ⊆ this list |

---

# 5.1 Cross-box Composition

> **Conceptual architecture only** — not runtime APIs, queues, or import graphs. Makes reviews and §4.2 boundary checks easier.
> Use **box names** from §4 only. Tag §3.2 category when the edge implies a real dependency.

### [DOMAIN or scope name]

**Within-domain composition (example — replace):**

```text
Accounting (domain)
        ↓
Journal
        ↓
Posting
        ↓
Ledger
        ↓
Financial Statement
```

**Cross-domain composition (example — replace):**

```text
CRM
        ↓
Customer
        ↓
Sales
        ↓
Invoice (event)
        ↓
Accounting
```

| Upstream box | Downstream box | Relationship (conceptual) | Domain NS §7 event (if any) | Category (§3.2) |
| --- | --- | --- | --- | --- |
| [BOX A] | [BOX B] | [feeds / governs / validates] | [Event name] | Runtime / Knowledge / … |
| [BOX B] | [BOX C] | | | |

> **Rule:** Every row in §5.1 must have matching §4 boxes. Cross-domain edges must align with Domain NS §9 dependencies. Do not draw API or `import` lines here — PAS §4 owns wire detail.

---

# 6. Domain Grouping (optional)

> Visual grouping only. **Do not duplicate §4 rows** — reference box names.

### [DOMAIN NAME]

```text
[ASCII diagram — box names from §4 only]
```

**Domain gate:** [Blocked box + ADR — link §8]

---

# 7. PAS Creation Gate

Stop if any condition fails ([doc-boundary-contract.md](doc-boundary-contract.md)).

1. Box exists in §4 (**box name** — not registry PKG alone)
2. §3.1 Architecture Decision Matrix recorded in §4 Reasoning
3. §4.2 Box Responsibility row exists for this box
4. Layer declared (§3–§4)
5. **Why separate** in §4 (matrix outcome — one sentence)
6. Registry PKG linked or `planned` with registry owner ticket
7. Status is `live`, `planned`, or `blocked` (not `retired`)
8. PAS number from [PAS index](../../docs/PAS/README.md)
9. Required ADR exists (§8 if blocked)
10. §4.3 impact row exists when box is new, split, merged, or layer-changed

---

# 8. Blocked and Retired Boxes

> Blockers must cite **T0 ADR** + explicit unblock condition. Reasoning required.

| Blueprint box | Status | Blocker (Source) | Required before proceeding | Reasoning |
| --- | --- | --- | --- | --- |
| [BOX] | blocked | [ADR-XXXX] `[T0]` | [Condition] | **Because** … **Therefore** … |
| [BOX] | retired | [ADR-XXXX] `[T0]` | Blueprint + ADR to recreate | **Because** … **Therefore** … |

---

# 9. Blueprint → PAS Handoff Contract

> Pre-fills PAS metadata from §4 rows. PAS sections Blueprint **does not** author: §2 boundary distill · §4 surfaces · §7 matrix · §10 sequence · §12 slice catalog · §13 gates.

| §4 field | Pre-fills PAS |
| --- | --- |
| **Blueprint box** (name) | Metadata `Blueprint box` — **architectural authority** |
| Registry PKG | Metadata `Package` — resolve `@afenda/*` from registry, not invented |
| Layer | Metadata `Layer`; §3 imports |
| Why separate | §1–§2 seed (distill — matrix outcome) |
| §4.2 Owns / never owns | PAS §2 boundary distill |
| Status | Maturity ceiling; §0 hard stops |
| Governing PAS | PAS ID |
| §5 consumers | Metadata `Consumers` |
| §8 blocker | Slice **Prerequisite** |

**Workflow:** Define (§4 box) → Plan (PAS §4 + §12) → Build (slice) → Ship (sync §10 slice counts only)

---

# 10. PAS Inventory

> **Canonical PAS count and slice progress.** Update on PAS create and slice close. §11 is read-only rollup — edit §4 and this table only.

**Total PAS at maturity: [N]**

| PAS | Title | Blueprint box (§4) | Live / Total slices | Status |
| --- | --- | --- | --- | --- |
| PAS-[NNN] | [Title] | [Box name] | [X / Y] | Live / Planned / Blocked |

> Sync `Live / Total slices` from PAS §12 on every slice close. Domain North Star does **not** carry this table.

---

# 11. PAS Maturity Rollup (read-only)

> **Derived view** — do not edit independently. Source: §4 + §10 + PAS index.

| Blueprint box | Registry PKG | PAS | Maturity |
| --- | --- | --- | --- |
| [From §4 box name] | [From §4 PKG link] | [From §4] | [From PAS index] |

---

# 12. How to Add a Blueprint Box

1. Capability exists in Domain North Star §4 (or Platform NS §4)
2. Run **§3.1 Architecture Decision Matrix** — record in §4 Reasoning
3. Add Domain North Star §13 capability→**box name**
4. Add §4 row: **box name**, layer, registry PKG link, **why separate**, status `planned`
5. Add **§4.2** owns / never owns
6. Add **§4.3** change impact row
7. Add **§5.1** composition edges if not isolated box
8. Add §5 consumers with §3.2 category
9. ADR + `@foundation-registry-owner` if new registry PKG
10. Satisfy §7 → assign PAS → [pas-doc-template.md](pas-doc-template.md)
11. Add §10 inventory row when PAS is authored

---

# 13. Agent Execution Rules

> **Primary vibe-coding entry for package/PAS work.** Domain business meaning → [Domain North Star §1–§12](north-star-template.md). Platform-wide rules → [Platform North Star §7–§9](../../docs/NORTHSTAR/kernel-north-star.md).

## Vibe-coding entry checklist (before any code edit)

- [ ] Target **Blueprint box** has a row in §4 (resolve PKG from registry — not box-less package)
- [ ] §3.1 matrix outcome recorded in §4 Reasoning
- [ ] §4.2 responsibility row exists for target box
- [ ] Box status is `live` or `planned` — not `blocked` or `retired` (check §8)
- [ ] §10 lists the governing PAS for that box
- [ ] PAS maturity permits coding (not **Idea** — see [PAS maturity labels](pas-doc-template.md))
- [ ] Slice handoff exists in `docs/PAS/KERNEL/SLICE/` with complete **9 fields**
- [ ] `/afenda-coding-session` Phase 0 pasted from slice — not invented from Blueprint prose
- [ ] Package authority skill loaded (e.g. `.cursor/skills/<pkg>-authority/SKILL.md`) when present

## Agent decision matrix (package scope)

| Question | If yes → |
| --- | --- |
| Is this a new **business** capability? | [Domain North Star §4](north-star-template.md) first — not §4 |
| Is this a new **Blueprint box**? | §3.1 matrix → §12 workflow → §7 gate → PAS — not code first |
| Is this only a **package/npm rename**? | Registry + PAS metadata — **box name unchanged** · update §4.3 |
| Should two boxes **merge**? | ADR + §3.1 + §4.3 + Domain NS §13 — not ad-hoc import |
| Does §4 box already exist; need behavior spec? | Author or read **PAS §4** — Blueprint is not the spec |
| Is the box `blocked` in §8? | **Stop** — fulfill ADR/prerequisite before PAS or slices |
| Is this a discrete implementation unit? | PAS §12 slice + 9-field handoff → `/afenda-coding-session` |
| Is PAS maturity **Idea** or **Deprecated**? | **Stop** — no new implementation |
| Is this a registry lane promotion? | `@foundation-registry-owner` — not ad-hoc registry edits |

## Blueprint → slice handoff (Phase 0 fields)

| Slice handoff field | Source in this document |
| --- | --- |
| **2. Allowed layer** | §4 `Registry PKG` → registry path + §4 `Layer` |
| **4. Prohibited** | Registry `prohibited[]` + PAS §5 + slice-specific |
| **5. Authority** | §4 `Governing PAS` + PAS § cited in slice |
| **6. Gates** | PAS §13 — not declared here |

Fields **1, 3, 7, 8, 9** come from the slice file only.

## Runtime chain (implement mode)

```text
§4 box + status OK
        ↓
§10 PAS exists · maturity permits coding
        ↓
PAS §0 + §4 surface for this slice
        ↓
Slice 9-field handoff → Phase 0 (/afenda-coding-session)
        ↓
Implement → PAS §13 gates → mark Delivered
        ↓
Sync §10 Live/Total slices from PAS §12
```

**Must not:** create undeclared packages · duplicate Domain NS §4 prose · use Blueprint as PAS §4 substitute · skip slice handoff

## Enterprise 10 / 10 (this document)

| Bar | Evidence |
| --- | --- |
| Every §4 box traces upstream | §2 capability map + Domain NS Decision ID |
| §3.1 matrix recorded per box | §4 Reasoning cites matrix outcome |
| §4.2 responsibility complete | Every live box has owns / never owns |
| §4.3 impact rows for changes | Split/merge/layer change traced |
| §5.1 conceptual composition | Reviewable architecture — not API dump |
| §3.2 dependency categories | §5 / §5.1 edges tagged |
| Box vs PKG authority clear | Box name in §4 · PKG in registry only |
| Every box has Source + Reasoning | [doc-evidence-standard.md](doc-evidence-standard.md) |
| §4.1 Evidence Register complete | B# rows link to ADR / Domain NS / registries |
| Blockers cite T0 ADR | §8 Reasoning column |
| PAS inventory accurate | §10 synced on every slice close |
| No business prose duplicated | [doc-boundary-contract.md](doc-boundary-contract.md) |
| Phantom consumers prevented | §5 declared before PAS **Consumers** metadata |

---

# 14. Required Reviews and References

## Before accepting

- [ ] Every §4 box traces to Domain NS §4 or Platform NS §4 with Decision ID
- [ ] §3.1 matrix outcome in every §4 Reasoning row
- [ ] §4.2 Box Responsibility Matrix complete for all live boxes
- [ ] §4.3 Change Impact rows for new/split/merged boxes
- [ ] §5.1 Cross-box Composition matches §4 box set
- [ ] §5 consumers tagged with §3.2 dependency category
- [ ] **Box name** is architectural authority — PKG links registry, not dual SSOT
- [ ] Every §4 row has **Source** + **Reasoning** — not `why separate` alone
- [ ] §4.1 Evidence Register populated for this scope
- [ ] §8 blockers cite T0 ADR + Reasoning
- [ ] §4 **why separate** is package rationale — not pasted from NS §9
- [ ] No business mission, principles, or domain boundary prose
- [ ] No slice ordering · no gate commands · no PKG table duplication
- [ ] §10 is only PAS inventory edit surface; §11 matches §4+§10
- [ ] [doc-boundary-contract.md](doc-boundary-contract.md) checklist passes
- [ ] [doc-evidence-standard.md](doc-evidence-standard.md) lifecycle bar for target maturity

## Explicit non-content

PKG / layer / dependency / disposition tables · contracts · slice handoffs · build order · `pas-status-index` roadmaps

## References

| Document | Role |
| --- | --- |
| Domain North Star template | [`north-star-template.md`](north-star-template.md) |
| Evidence standard | [`doc-evidence-standard.md`](doc-evidence-standard.md) |
| ADR Constitution | [`adr-constitution.md`](adr-constitution.md) |
| Boundary contract | [`doc-boundary-contract.md`](doc-boundary-contract.md) |
| PAS doc template | [`pas-doc-template.md`](pas-doc-template.md) |
| Platform North Star | [`afenda-platform-north-star.md`](../../docs/NORTHSTAR/kernel-north-star.md) |

---

# 15. Final Doctrine

This Blueprint owns **what Blueprint boxes exist, why separate (§3.1), how they compose (§5.1), what each owns (§4.2), and which PAS governs each box**.

**Authority split:**

| Identity | Owner | Changes when |
| --- | --- | --- |
| **Blueprint Box name** | This document §4 | Architectural split/merge (ADR + §4.3) |
| **`@afenda/*` npm / workspace** | `package-registry.data.ts` | Rename, scaffold — box unchanged |
| **Lane / disposition** | `foundation-disposition.registry.ts` | `@foundation-registry-owner` |

Domain North Star owns **business architecture** — never duplicate here.

PAS owns **contracts and slices**. Sync slice counts to §10 only.

Business meaning change → Domain North Star first. Box change → this Blueprint + §4.3 first. Package rename → registry first.

> **May belong here:** §3.1 matrix · §3.2 dependency categories · §4 boxes + §4.1–§4.3 · §5 + §5.1 composition · §9 handoff · §10 inventory · §8 blockers.

> **Belongs in Domain North Star:** philosophy, vocabulary, capabilities, principles, outcomes, events, lifecycles, boundaries, risks, quality attributes ([doc-boundary-contract.md](doc-boundary-contract.md)).

> **Belongs in package registry:** `@afenda/*` name · workspace path · PKG-* row detail — Blueprint links only.

> **Belongs in PAS:** boundary sentence, §4 surfaces, §10–§12 sequence and catalog, §13 gates.
