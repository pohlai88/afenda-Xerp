# Architecture Document Boundary Contract

Cross-validation rules for **Domain North Star** ↔ **Architecture Blueprint** ↔ **PAS**. Agents and authors must not duplicate content across these documents.

← Templates: [north-star-template.md](north-star-template.md) · [blueprint-template.md](blueprint-template.md) · [pas-template.md](pas-template.md) · [pas-slice-template.md](pas-slice-template.md) · [doc-evidence-standard.md](doc-evidence-standard.md) · [adr-constitution.md](adr-constitution.md)

---

## Governance stack

```text
Architecture Constitution (Platform NS + ADR Constitution)
        │
        ├── ADR (T0 accepted decisions)
        ├── Platform North Star
        ├── Domain North Star
        ├── Architecture Blueprint
        ├── PAS
        ├── Slice
        └── Code
```

Full ADR rules: [adr-constitution.md](adr-constitution.md)

---

## Single source of truth

| Topic | Owner document | Section | Never duplicate in |
| --- | --- | --- | --- |
| Domain philosophy (immutable) | Domain North Star | §1 | Blueprint, PAS |
| Business identity (mission, definition) | Domain North Star | §2 | Blueprint |
| Enterprise vocabulary (business terms) | Domain North Star | §3 | PAS-004 atoms without NS row · Blueprint |
| Permanent capabilities (EFR) | Domain North Star | §4 | Blueprint (map only) |
| Domain principles | Domain North Star | §5 | Blueprint, PAS |
| Enterprise outcomes + KPI targets | Domain North Star | §6 | Blueprint metrics tables |
| Business events (domain vocabulary) | Domain North Star | §7 | PAS §4 event type names without NS row |
| Entity lifecycles (business states) | Domain North Star | §8 | PAS state machines without NS row |
| Business boundary (owns / never owns) | Domain North Star | §9 | Blueprint, PAS §2 |
| Cross-domain dependencies (business) | Domain North Star | §9 | Blueprint §5 package consumers |
| Enterprise risks | Domain North Star | §10 | PAS §0 without NS trace |
| Domain quality attributes (NFR intent) | Domain North Star | §11 | PAS §13 gate commands |
| Evidence register + decision log | Domain North Star | §12 | Blueprint §4.1 duplication |
| Governance and evolution | Domain North Star | §14–§15 | Blueprint |
| Capability → box map | Domain North Star | §13 | Blueprint §4 registry columns |
| **Blueprint box name** (architectural identity) | Blueprint | §4 | Inventing box in PAS without §4 row |
| **`@afenda/*` workspace/npm name** | `package-registry.data.ts` | PKG-* row | Duplicating full PKG table in Blueprint prose |
| Registry PKG link in Blueprint | Blueprint | §4 `Registry PKG` column | Inventing npm name without registry row |
| Layer assignments | Blueprint | §3–§4 | North Star §1–§12 |
| Architecture decision matrix | Blueprint | §3.1 | Ad-hoc split/merge judgment |
| Canonical dependency categories | Blueprint | §3.2 | Untagged cross-box edges |
| Why separate (per box) | Blueprint | §4 · §3.1 outcome | North Star §1–§12 |
| Box owns / never owns (architectural) | Blueprint | §4.2 | PAS §2 essay · Domain NS §9 paste |
| Change impact (box evolution) | Blueprint | §4.3 | Silent box merge/split |
| Cross-box composition (conceptual) | Blueprint | §5.1 | Runtime API diagrams · import graphs |
| Box status (`live` / `planned` / `blocked`) | Blueprint | §4, §8 | North Star |
| Consumer discovery | Blueprint | §5 | PAS metadata (declare here first) |
| PAS IDs and inventory | Blueprint | §10–§11 | North Star |
| Slice counts and build order | PAS §12, §10 | — | North Star, Blueprint (inventory sync only) |
| PAS creation gate (6 conditions) | Blueprint | §7 | North Star (link only) |
| Blueprint → PAS handoff | Blueprint | §9 | North Star |
| Authority surfaces and contracts | PAS | §4 (type + stability) | North Star, Blueprint |
| PAS architectural dependencies | PAS | §3.4 | Blueprint §5.1 without declaration |
| Contract / surface classification | PAS | §4 | Ad-hoc reviews |
| ADR lifecycle | ADR Constitution | — | Untraceable ADR edits |
| Gate commands | PAS; Platform NS §13 (platform) | §13 | Blueprint, North Star |
| PAS §1 package definition | PAS | §1 (distill) | Domain NS §1–§2 prose paste |
| Slice catalog + sequence | PAS | §12, §10 | North Star; Blueprint counts sync only |
| Skill mirror | PAS tier-2 skill | SKILL.md | Full PAS body in skill |
| Slice session scope | Slice handoff | 9 fields | PAS §4 full spec · Blueprint tables |
| Slice session DoD | Slice | `## DoD` table | PAS §11 verbatim copy |
| Slice proof of delivery | Slice + Completion Report | DoD Pass + fields 7–9 | "Tests will prove it" without paths |
| PAS package acceptance | PAS | §11 criteria + §11.6 maturity exit | Empty §11.x headers |
| Session evidence wrapper | `/afenda-coding-session` | §11 Completion Report | Replacing slice DoD table |
| Business source citations | Domain North Star | §4–§5, §9 Source + §12 register | Unsupported capability claims |
| **Enterprise Feature Requirements (EFR)** | Domain North Star | §4–§5, §9 battle-proven ✓ rows | Assumptions as enterprise requirements |
| **Enterprise Acceptance Criteria (EAC)** | Domain NS §16 · PAS §11 · Slice DoD | Gate + upstream EFR trace | EAC without gate or parent EFR |
| Architectural source citations | Blueprint | §4 Source + §4.1 register | Unsupported box claims |
| Decision reasoning log | Domain North Star | §12.2 | Re-debating in Blueprint prose |
| Decomposition chain diagram | Platform NS or Domain NS | §14.3 | Repeat full rules in Blueprint |
| Traceability chain | Each doc | §14 / §15 | Identical diagram in all docs |

---

## Capability → box mapping (the only overlap allowed)

Domain North Star may list:

```text
Capability A → see Blueprint §4 box "[BOX NAME]"
```

Blueprint §2 may list:

```text
North Star §4 Capability A → §4 box "[BOX NAME]"
```

**Do not** copy `why separate`, `Registry PKG`, `PAS-[NNN]`, or `Status` into North Star.

---

## Authority Escalation Matrix

> When a change spans documents — **escalate to the authority owner first**. Do not patch downstream without upstream amendment.

| Question / change | Authority | Document / actor |
| --- | --- | --- |
| Change **business meaning** (EFR, vocabulary, events) | Domain North Star owner | Domain NS §1–§12 · [doc-evidence-standard.md](doc-evidence-standard.md) |
| New **business capability** | Domain North Star → Blueprint | §4 EFR then §13 box map |
| **Split / merge Blueprint box** | Blueprint steward + ADR | Blueprint §3.1 · §4.3 · [adr-constitution.md](adr-constitution.md) |
| **New package** (registry PKG) | Blueprint + `@foundation-registry-owner` | §4 box · registry row · PAS |
| **Add authority surface** | PAS package owner | PAS §4 · Blueprint review if boundary shifts |
| **New contract** (non-breaking) | PAS owner | PAS §4 + §8 |
| **Breaking contract** | ADR + PAS owner | [adr-constitution.md](adr-constitution.md) · PAS §11 |
| **Modify implementation** | Slice author | Slice handoff · one PAS §4 surface |
| **Emergency production deviation** | ADR + Architecture Authority | Retroactive ADR ≤5 business days |
| **Registry lane promotion** | `@foundation-registry-owner` | Not PAS or slice alone |
| **SKILL / reference sync** | Generated from PAS | [pas-template.md](pas-template.md) — PAS is SSOT |

---

## Change Classification Matrix

> Every change type maps to **required artifacts** before merge.

| Change | Requires |
| --- | --- |
| New **business capability** | Domain North Star §4 EFR + §12 evidence → Blueprint §4 box |
| New **Blueprint box** | §3.1 matrix · §4.2 · §4.3 · Domain NS §13 · registry PKG if new workspace |
| **Box split / merge** | ADR · Blueprint §4.3 · Domain NS §13 · PAS/slice migration plan |
| **Package/npm rename only** | Registry + PAS metadata — box name unchanged |
| New **PAS** | Blueprint §7 gate · PAS doc · §12 slice plan · generated SKILL |
| New **authority surface** | PAS §4 row (type + stability) · Blueprint review if §4.2 affected |
| New **contract** (additive) | PAS §4 + §8 update · slice if implementation |
| **Breaking contract** | ADR · PAS §4 + §11 · migration slice · gates |
| New **slice** | PAS §12 row · 9-field handoff · DoD table |
| **Implementation only** | Slice · no upstream doc change unless scope dispute |
| **SKILL refresh** | Regenerate from PAS — not manual drift edit |
| **Supersede architectural decision** | New ADR · update T0 citations downstream |

---

## Sync on change (not duplication)

| Event | Update |
| --- | --- |
| New business capability | Domain North Star §4 first → then Blueprint §4 box |
| New vocabulary term | Domain North Star §3 first → PAS-004 atom promotion |
| New business event | Domain North Star §7 first → PAS §4 event surface |
| New cross-domain dependency | Domain North Star §9 first → Blueprint §5 integration |
| New Blueprint box | Domain North Star §4 + §13 → §3.1 matrix → §4 + §4.2 + §4.3 → registry PKG |
| Box split / merge | §4.3 + ADR → Domain NS §13 → PAS/slices |
| Package/npm rename only | `package-registry` + PAS metadata — **box name unchanged** |
| New PAS | Blueprint §10 row → PAS doc → PAS §12 slice count |
| Slice delivered | PAS §12 → Blueprint §10 `Live slices / Total slices` only |
| Business meaning change | Domain North Star → then Blueprint if boxes change |

---

## Conflict checks before merge

**Domain North Star:**

- [ ] §1–§12 contain no `@afenda/*` package names
- [ ] §1–§12 contain no `PAS-[NNN]` IDs
- [ ] §1–§12 contain no slice counts or build order
- [ ] §13 capability map links to Blueprint box names only (no PAS column)
- [ ] No PAS inventory table (Blueprint §10 is canonical)
- [ ] §1 Philosophy present and distinct from §2 Mission
- [ ] §3 Enterprise Vocabulary — core terms for §4 and §7
- [ ] §4 EFR rows include capability maturity tier
- [ ] §6 outcomes distinct from §4 capabilities
- [ ] §7 events and §8 lifecycles present at Production+
- [ ] §9 cross-domain dependencies name domains only — not packages
- [ ] §4–§5, §9 every EFR row has **✓ battle-proven** Source + Reasoning per [doc-evidence-standard.md](doc-evidence-standard.md)
- [ ] **Zero ✗ assumptions** in EFR rows at Production+ maturity
- [ ] §12 Evidence Register + §12.2 Decision log complete for target maturity

**Architecture Blueprint:**

- [ ] §1–§8 contain no business mission, principles, or domain boundary prose
- [ ] §2 links to North Star §4 — does not restate capabilities as paragraphs
- [ ] §4 `why separate` is technical/package rationale — not a copy of North Star §9 bullets
- [ ] No duplicate PAS inventory (§10 and §11 serve different purposes: counts vs maturity)
- [ ] No slice ordering (PAS §10 owns sequence)
- [ ] §3.1 decision matrix outcome in every §4 Reasoning row
- [ ] §4.2 responsibility matrix complete for live boxes
- [ ] §4.3 impact rows for new/split/merged/changed boxes
- [ ] §5.1 composition uses box names only — no API/runtime detail
- [ ] §5 consumers tagged with §3.2 dependency category
- [ ] Box name authority in §4 — PKG links registry (no dual SSOT for npm names)
- [ ] §8 blockers cite T0 ADR + Reasoning

**PAS (package authority standard):**

- [ ] §1 is one package paragraph — not Domain North Star §2 mission copy
- [ ] §2 is one enforceable boundary — not business boundary essay from NS §9
- [ ] `Consumers` ⊆ Blueprint §5 declared consumers
- [ ] §12 is only slice catalog edit surface; Blueprint §10 syncs counts only
- [ ] §3.4 architectural dependencies declared — align with Blueprint §5.1
- [ ] §4 every surface has **Contract type** + **Stability** level
- [ ] §13 owns gate commands — not duplicated in Blueprint or North Star
- [ ] SKILL generated from PAS (or regen checklist pass) — not divergent manual copy

**Slice (executional handoff):**

- [ ] `Position` line present with Blueprint box name
- [ ] Handoff has exactly 9 fields; Phase 0 uses fields 1–6 only
- [ ] Field 3 is complete file list — one package tree for Implementation
- [ ] Field 6 gates are real `pnpm` scripts from PAS §13 (+ slice-specific)
- [ ] Purpose does not duplicate PAS §4 specification
- [ ] On Delivered: PAS §12 + metadata + Blueprint §10 sync per pas-template
- [ ] Slice `## DoD` has ≥3 rows; field 7 cites row numbers; field 8 maps each row
- [ ] PAS §11 subsections use Criteria tables — no empty §11.x headers

---

## Read order (no conflict)

```text
Platform North Star → Domain North Star §1–§12 → Blueprint §1–§8 → PAS → Slice
```

Agent execution tables live in **Blueprint §13** and **PAS §0–§13** — not in North Star §13–§19.

---

## Vibe-coding quality chain (enterprise output)

Agents produce enterprise-quality code only when each layer does its job — no layer skipped.

```text
Domain North Star §1–§12     business architecture locked (authoring)
        ↓
Blueprint §4 + §3.1 + §7 + §10     box + PAS exist; §4.2 defined; status permits work
        ↓
PAS §0 + §4 + §12           contracts + slice catalog + prerequisites
        ↓
Slice 9-field handoff       one session scope (/afenda-coding-session Phase 0)
        ↓
Code + PAS §13 gates        evidence, not aspiration
```

| Failure mode | Symptom | Fix at |
| --- | --- | --- |
| Scope invented in code | Agent debates business meaning mid-slice | Domain North Star §4–§9 |
| Vocabulary drift | Term invented in PAS without §3 row | Domain North Star §3 |
| Event surface without NS event | PAS §4 names event not in §7 | Domain North Star §7 |
| Phantom package | `@afenda/*` import with no box | Blueprint §4 |
| PAS without box | PAS doc with empty `Blueprint box` | Blueprint §7 gate |
| Big-bang slice | One slice spans whole PAS | PAS §12 decomposition |
| Gate skipped | "Looks right" with no `pnpm` output | PAS §13 + §11 Completion Report |
| Inventory drift | Blueprint §10 counts stale | Sync from PAS §12 on slice close |
| Slice scope creep | Field 3 grows mid-session | Split slice in PAS §12 |
| Handoff-less coding | Phase 0 invented | Author slice 9 fields + DoD first |
| DoD without gates | "Tests pass" with no command/path | Named test file or `pnpm` in Gate column |
| Delivered with open DoD | Status Delivered but DoD row failed | Reopen slice or fix before sync |
| Uncited domain claim | Capability/boundary with no Source | Add §8 register entry + Reasoning |
| Uncited blueprint box | §4 row without Source/Reasoning | Complete per doc-evidence-standard |
| **Assumption as EFR** | "Enterprise requires …" without ✓ source | ADR / standard / knowledge atom or remove |
| Box merge without §4.3 | Silent architectural drift | §4.3 + ADR before merge |
| PKG invented in Blueprint | npm name without registry row | `@foundation-registry-owner` |
| Conceptual gap | No §5.1 composition for multi-box domain | Add §5.1 edges |
| **EAC without EFR parent** | PAS §11 or slice DoD with no upstream trace | Cite Domain NS §12 D# or §4 capability |
| Breaking change without ADR | Contract changed silently | [adr-constitution.md](adr-constitution.md) |
| SKILL drift | SKILL contradicts PAS §2/§4 | Regenerate from PAS |
| Wrong escalation | Package split in slice only | Authority Escalation Matrix |

**North Star in implement mode:** coding agents read §1–§12 only when resolving a **business scope dispute** — not for every slice.

**Blueprint in implement mode:** resolve **box name** from slice Position line · **PKG** from registry — not from inventing names in Phase 0.
