# Documentation Evidence & Citation Standard

Cross-cutting rules for **Domain North Star** and **Architecture Blueprint** — and downstream PAS/slice traceability.

← [doc-boundary-contract.md](doc-boundary-contract.md) · [adr-constitution.md](adr-constitution.md) · [north-star-template.md](north-star-template.md) · [blueprint-template.md](blueprint-template.md)

---

## Principle

**No unsupported claim.** Every permanent statement in North Star §1–§12 and every Blueprint §4 box must cite an **accepted source** and record **why** the claim is stable across the domain lifecycle.

**Battle-proven only for enterprise.** At Production and Enterprise maturity, permanent requirements and acceptance criteria must be **battle-proven** — not assumptions dressed as enterprise need.

| Term | Abbrev | Meaning |
| --- | --- | --- |
| **Enterprise Feature Requirement** | **EFR** | A permanent capability, principle, or boundary in Domain North Star §4–§5, §9 that downstream Blueprint/PAS must implement |
| **Enterprise Acceptance Criteria** | **EAC** | A testable acceptance row in Domain NS §16, PAS §11, or slice `## DoD` that proves an EFR or architectural decision is met |

**Hard rule:** EFR and EAC rows cite **battle-proven** sources only. Assumptions may exist in **Idea** drafts — they must not ship as enterprise authority.

Aspiration without citation is not authority. Agent inference is not battle-proven. Agents must not implement from uncited business or package decisions.

---

## Battle-proven vs assumption (essential)

| Class | Symbol | May justify EFR? | May justify EAC? | Lifecycle |
| --- | --- | --- | --- | --- |
| **Battle-proven** | ✓ | Yes — Production+ | Yes — always | Permanent until amended via ADR or North Star |
| **Hypothesis** | △ | Idea / MVP only | Slice draft only | Must upgrade before Production |
| **Assumption** | ✗ | **Never** at Production+ | **Never** | Remove or replace with battle-proven source |

### What counts as battle-proven

A source is **battle-proven** when it meets **at least one** of:

| # | Battle-proven evidence | Tier | Example |
| --- | --- | --- | --- |
| 1 | **Accepted ADR** with recorded decision | T0 | `ADR-0026` accepted · `ADR-0010` hierarchy |
| 2 | **Upstream North Star decision** at Production+ with §12 register | T1 | Platform NS §4 · Domain NS §12.2 D# + E# |
| 3 | **Accepted enterprise knowledge atom** | T2 | `@afenda/enterprise-knowledge` · PAS-004 |
| 4 | **External standard / regulation** with section citation | T3 | IFRS · MFRS · ISO/IEC 25010 clause |
| 5 | **Industry ERP delivery discipline** with explicit mapping | T3+ | [enterprise-erp-standards](../../enterprise-erp-standards/SKILL.md) §2 gate row |
| 6 | **Live runtime proof** (status only — not permanent *why*) | T5 | `afenda-runtime-truth-matrix.md` `live` row |
| 7 | **Executable gate** (EAC only — proves implementation) | Gate | Named `pnpm` script exit 0 · named test file pass |

**EAC-specific:** A gate proves **implementation** of an EFR — it does not invent the EFR. Every EAC row must trace upward to a battle-proven EFR or Blueprint decision (see [Downstream handoff](#downstream-handoff-pas--slice)).

### What is NOT battle-proven (assumptions — hard stop)

| Assumption pattern | Why rejected |
| --- | --- |
| "Enterprises require …" with no ADR, standard, or knowledge atom | Opinion masquerading as EFR |
| Agent-invented business rule in North Star or PAS | Vibe-coding — not authority |
| T4 registry row alone ("package exists therefore we need it") | Describes **what is** — not **why it must be** |
| T6 expert review without expiry or upgrade path | Interim hypothesis — not permanent EFR |
| Duplicate Reasoning with empty or circular Source | Assumption loop |
| Slice author scope creep in Purpose / DoD | Session opinion — not domain EFR |
| "Best practice" or "industry standard" without section or gate mapping | Unverifiable claim |

**At Enterprise maturity:** zero ✗ assumptions in §4–§5, §9 EFR rows and zero ✗ in §16 / PAS §11 / slice DoD EAC rows.

---

## Source tiers (use in order of strength)

| Tier | Source type | Example | May justify |
| --- | --- | --- | --- |
| **T0** | Accepted ADR | `ADR-0026`, `ADR-0010` | Irreversible architecture, blockers, hierarchy — see [adr-constitution.md](adr-constitution.md) |
| **T1** | Platform / Domain North Star | Platform NS §4 · Domain NS §4 EFR | Business capabilities, domain boundaries |
| **T2** | Enterprise knowledge | `@afenda/enterprise-knowledge` atom, PAS-004 | Contested business terms — derived from NS §3 |
| **T3** | External standard / regulation | IFRS, MFRS, SFRS citation | Domain principles, compliance boundaries |
| **T4** | Machine registry (reference only) | `foundation-disposition.registry.ts`, `package-registry` | What exists today — not why |
| **T5** | Runtime truth matrix | `afenda-runtime-truth-matrix.md` | Live vs planned evidence |
| **T6** | Domain expert review | Named owner + date | Interim until ADR or knowledge atom exists |

**Rules:**

- **T0–T3** justify permanent North Star and Blueprint decisions — **battle-proven** for EFR.
- **T4–T5** justify status and sync — never replace **why** prose alone; T5 alone never creates a new EFR.
- **T6** is **hypothesis (△)** only — expires at next maturity promotion; must upgrade to T0–T3 or be removed.
- **Gate** proves EAC — must trace to battle-proven EFR upstream; gate alone never creates business meaning.

---

## EFR and EAC authoring rules

### Enterprise Feature Requirements (EFR) — Domain North Star

| Location | EFR content | Battle-proven bar |
| --- | --- | --- |
| §1 Philosophy | Immutable domain purpose | T0–T3 only at Production+ |
| §4 Capability rows | Permanent business capabilities | Each row: Source ✓ + Reasoning + maturity tier |
| §5 Principles | Non-negotiable domain rules | T0–T3 only at Production+ |
| §9 Boundary owns / never owns | Permanent responsibility split | T0–T3; cite owning domain or standard |
| §10 Risks | Business risks mitigated by architecture | T0–T3; link §4 Core capabilities |
| §12.2 Decision log | Architectural handoff to Blueprint | Every D# links to E# register entries |

**Non-EFR but required at Production+:** §3 Vocabulary · §6 Outcomes/KPIs · §7 Events · §8 Lifecycles · §11 Quality attributes — each row still requires Source ✓ or explicit △ with upgrade path.

**EFR test:** *Could an auditor reject this as unverified opinion?* If yes — not battle-proven. Add ADR, standard section, or knowledge atom.

### Enterprise Acceptance Criteria (EAC) — proof layers

| Layer | Document | EAC proves | Must trace to |
| --- | --- | --- | --- |
| Business doc complete | Domain NS §16 | North Star authoring quality | Battle-proven EFR coverage in §4–§5, §9 |
| Package complete | PAS §11 | Whole PAS maturity | Domain NS EFR + Blueprint §4 box |
| Session complete | Slice `## DoD` | One implementation unit | PAS §11 subsection + cited §4 surface |

**EAC test:** Every criterion has a **Gate** column (`pnpm`, test file, or named reviewer) **and** cites upstream EFR/D# or PAS §11.x — never standalone assumption.

---

## Citation format

Use inline or table **Source** column:

```text
[T0 ADR-0026 §Decision 2]
[T1 Domain NS §4 Capability A]
[T1 Domain NS §1 Philosophy]
[T1 Platform NS §4 Accounting standards]
[T2 PAS-004 / atom:posting-status]
[T3 IFRS 18 §X — presentation]
[T4 PKGR03_ACCOUNTING_STANDARDS — live]
[T6 Domain owner review 2026-06-29]
```

Multiple sources: list strongest first. Conflicting sources → **stop** — resolve via ADR before merge.

---

## Reasoning format (required for permanent decisions)

Every capability (North Star §4), boundary item (§9), risk (§10), and Blueprint box (§4) must include a **Reasoning** field using:

```text
Claim     — <what we assert is permanently true — EFR statement>
Because   — <business or architectural rationale in one sentence>
Source    — <T0–T6 citation — must be ✓ battle-proven for Production+ EFR>
Therefore — <what downstream docs may assume>
Review by — <maturity gate when re-validated: MVP | Production | Enterprise>
Provenance — <EFR | EAC | architectural-only — EAC must cite parent EFR/D#>
```

**Example (EFR — capability):**

```text
Claim: Afenda must permanently validate standards before posting.
Because: Regulatory ERP requires evidence-backed rules, not ad-hoc posting logic.
Source: [T3 IFRS/MFRS framework] [T1 Platform NS §4 Accounting standards] ✓
Therefore: Standards authority is separate from posting runtime (Blueprint box split).
Review by: Enterprise
Provenance: EFR
```

**Example (EAC — PAS §11 row):**

```text
Claim: Public accounting contracts are readonly and branded-ID safe.
Because: EFR D1 requires cross-package identifier integrity at posting boundary.
Source: [T0 ADR-0010] [Domain NS §12 D1] ✓
Therefore: typecheck + contract tests must pass before slice Delivered.
Review by: Production
Provenance: EAC → EFR D1 · Gate: pnpm --filter @afenda/kernel test:run
```

---

## Lifecycle quality gates (domain-wide)

| Lifecycle stage | North Star evidence bar | Blueprint evidence bar |
| --- | --- | --- |
| **Idea** | §1 Philosophy + §4 capabilities with ≥1 T1/T3 source each; △ hypotheses allowed if marked | Not required |
| **MVP** | §9 boundaries cited · §12 Evidence Register started; no ✗ assumptions in committed §4 rows | §4 every box has Source + Reasoning |
| **Production** | Full §12 register · **all EFR rows battle-proven (✓)** · §3 vocabulary · §7 events · §8 lifecycles | §4 + §8 blockers cite T0 ADR · §2 maps to Domain NS §13 |
| **Enterprise** | §16 EAC pass · register reviewed ≤12 months · **zero ✗ assumptions** | §10 inventory synced · §14 citation checklist pass |

**Promotion rule:** Idea → MVP may carry △ hypotheses. MVP → Production **requires** every §4–§5, §9 EFR row upgraded to ✓ battle-proven — assumptions (✗) must be removed or replaced via ADR/standard/knowledge atom.

**On every amendment:** update Source + Reasoning + `Last reviewed` date — do not silent-edit claims. Downgrade of source class (✓ → △ or ✗) triggers maturity review.

---

## Anti-patterns (hard stops)

| Anti-pattern | Fix |
| --- | --- |
| Capability with no Source | Add citation or remove capability |
| **EFR stated as assumption (✗)** | ADR, T3 standard, T2 knowledge atom, or remove row |
| **EAC without upstream EFR trace** | Cite Domain NS §12 D# / §4 capability / PAS §11 parent |
| **"Enterprise requires …" without battle-proven source** | Same as assumption — upgrade source or demote maturity |
| Blueprint box with no Domain NS §4 / Platform NS §4 parent | Add upstream EFR first |
| `why separate` without Because/Source | Complete Reasoning block with ✓ source |
| Duplicate registry tables in prose | Link T4 only — not EFR justification |
| Agent-invented business rule in North Star | ADR or Domain owner T6 △ with expiry — not ✓ |
| Stale T6 review past maturity gate | Re-review or upgrade to T0–T3 |
| Gate passes but EFR uncited | EAC proves implementation — add parent EFR to Provenance |

---

## Downstream handoff (PAS / slice)

| Upstream claim | PAS cites | Slice cites |
| --- | --- | --- |
| Domain NS §4 **EFR** capability | PAS §1 one paragraph — **not new EFR** | — |
| Domain NS §3 vocabulary term | PAS-004 atom — **not redefinition** | — |
| Domain NS §7 business event | PAS §4 event surface name | — |
| Domain NS §12.2 D# decision | PAS §0 hard stop if applicable | Prerequisite |
| Blueprint §4 box + why separate | Metadata `Blueprint box` | Position line |
| Blueprint §8 ADR blocker | PAS §0 hard stop | Slice Prerequisite |
| PAS §11 **EAC** criterion | — | Slice DoD row + Gate column |

PAS and slices **implement** battle-proven EFR — they do not invent enterprise requirements. Slice DoD and PAS §11 are **EAC** — they prove cited EFR; they do not re-argue North Star/Blueprint reasoning without a new ADR or North Star amendment.

**Chain:**

```text
Battle-proven EFR (Domain NS §4–§5, §9, ✓ sources)
        ↓
Blueprint §4 architectural Reasoning (traces to §12 D# · §10 risk · §11 quality)
        ↓
PAS §11 EAC (criteria + gates, traces to EFR)
        ↓
Slice DoD EAC (session proof, traces to PAS §11.x)
        ↓
Gate exit 0 → Delivered
```
