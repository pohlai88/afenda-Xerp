# ADR Constitution

> **Purpose**
>
> Standardizes **Architecture Decision Records** as the constitutional amendment layer for Afenda — lifecycle, ownership, evidence, supersession, and traceability into North Star, Blueprint, PAS, and Slice.

← [doc-boundary-contract.md](doc-boundary-contract.md) · [doc-evidence-standard.md](doc-evidence-standard.md) · [`docs/adr/`](../../docs/adr/)

---

## Position in the governance stack

```text
Architecture Constitution (this document + Platform North Star §7–§9)
        │
        ├── ADR (individual decisions — T0 battle-proven source)
        │
        ├── Platform North Star
        │
        ├── Domain North Star
        │
        ├── Architecture Blueprint
        │
        ├── PAS
        │
        ├── Slice
        │
        └── Code
```

| Layer | Amends when | ADR required? |
| --- | --- | --- |
| Business meaning | Domain North Star §1–§12 | Often — always when irreversible |
| Box split/merge | Blueprint §4 | **Yes** |
| New authority surface | PAS §4 | When cross-package or constitutional |
| Breaking contract | PAS §4 / §8 | **Yes** |
| Emergency production deviation | Runtime + docs | **Yes** — retroactive within 5 business days |

**Rule:** ADRs **record** decisions — they do not replace PAS contracts or Domain North Star EFR. See [Authority Escalation](doc-boundary-contract.md#authority-escalation-matrix) and [Change Classification](doc-boundary-contract.md#change-classification-matrix).

---

## ADR lifecycle

| State | Meaning | May code? |
| --- | --- | --- |
| **Proposed** | Draft under review — not battle-proven | No — hypothesis only |
| **Accepted** | Merged to `docs/adr/` — T0 source | Per linked PAS maturity |
| **Superseded** | Replaced by newer ADR — historical only | Follow successor ADR |
| **Rejected** | Decision not adopted — archive with rationale | No |

**Workflow:**

```text
Problem / escalation trigger
        ↓
Proposed ADR (docs/adr/drafts/ or PR branch)
        ↓
Evidence + alternatives + consequences
        ↓
Review (owners per §Ownership below)
        ↓
Accepted → merge → update downstream traceability (§Traceability)
        ↓
Supersede prior ADR when amended (never silent delete)
```

---

## Ownership

| ADR scope | Primary owner | Required reviewers |
| --- | --- | --- |
| Platform / cross-cutting | Platform architecture | `@foundation-registry-owner` if registry impact |
| Domain business meaning | Domain spec owner | Domain North Star steward |
| Blueprint box split/merge | Blueprint steward | Domain NS owner if EFR affected |
| PAS contract / surface | PAS package owner | Blueprint steward if box boundary changes |
| Security / tenancy | Security + kernel authority | ADR-0010 lineage when applicable |
| Emergency deviation | On-call + architecture authority | Retroactive acceptance mandatory |

**Agent rule:** Agents do **not** accept ADRs — they cite **Accepted** ADRs only ([doc-evidence-standard.md](doc-evidence-standard.md) T0).

---

## Evidence requirements (Accepted ADR)

Every **Accepted** ADR must include:

| Section | Required content |
| --- | --- |
| **Status** | Proposed / Accepted / Superseded / Rejected |
| **Context** | Problem — link Domain NS §10 risk or Blueprint §4.3 impact if applicable |
| **Decision** | What we will do — one clear statement |
| **Because** | Reasoning — aligns with doc-evidence-standard Claim/Because/Therefore |
| **Alternatives considered** | ≥2 options with rejection rationale |
| **Consequences** | Positive, negative, neutral — downstream docs affected |
| **Evidence** | T1–T3 citations supporting the decision — not assumption (✗) |
| **Traceability** | Table: North Star · Blueprint · PAS · Slice · Registry · Gates |
| **Supersedes** | Prior ADR IDs or `none` |

**Battle-proven bar:** Accepted ADR = **T0** for permanent architectural and business-amendment claims.

---

## Review cadence

| Event | Action |
| --- | --- |
| **New Accepted ADR** | Update downstream docs within same PR or linked follow-up |
| **Quarterly** | Architecture authority reviews Accepted ADRs touching red/amber lanes |
| **Maturity promotion** | Confirm no Proposed ADR blocks Domain NS / Blueprint / PAS target maturity |
| **Supersession** | Mark old ADR Superseded · link forward · never delete history |

---

## Supersession rules

1. **Never edit Accepted ADR decisions in place** — supersede with new ADR.
2. Superseded ADR header: `Status: Superseded by ADR-XXXX`.
3. Successor ADR **Supersedes** field lists all replaced IDs.
4. Downstream docs must cite **successor** T0 — not superseded ADR alone.
5. `pnpm check:documentation-drift` must not reference superseded ADR as active authority.

---

## Traceability into downstream documents

When an ADR is **Accepted**, update traceability targets:

| ADR decision type | Update |
| --- | --- |
| Business meaning | Domain North Star §12 Decision log (D#) + affected EFR Source |
| New / split box | Blueprint §4 · §3.1 matrix · §4.2 · §4.3 · Domain NS §13 |
| Blocker cleared | Blueprint §8 · PAS §0 prerequisite |
| New authority surface | PAS §4 row — Contract type + Stability |
| Breaking contract | PAS §8 · PAS §11 EAC · migration slice |
| Registry lane | `@foundation-registry-owner` only |
| Emergency deviation | Runtime truth matrix · PAS `runtime_status` · retroactive ADR |

**Template row (paste in every Accepted ADR):**

| Document | Section / ID | Action |
| --- | --- | --- |
| Domain North Star | §12 D# | [add / amend / none] |
| Blueprint | §4 box `[NAME]` | [add / amend / none] |
| PAS | PAS-NNN §4.x | [add / amend / none] |
| Slice | `docs/PAS/slice/…` | [new slice / none] |
| Registry | PKGR… | [via foundation-registry-owner / none] |
| Gates | `pnpm …` | [new gate / none] |

---

## ADR numbering and location

| Rule | Value |
| --- | --- |
| **Canonical path** | `docs/adr/ADR-NNNN-<slug>.md` |
| **Index** | Link from [`docs/adr/README.md`](../../docs/adr/) or architecture blueprint §8 |
| **Cross-reference format** | `[T0 ADR-NNNN §Decision]` in Source columns |
| **Platform constitutional ADRs** | Cited from [Platform North Star §7–§9](../../docs/architecture/afenda-platform-north-star.md) |

---

## Relationship to other governance artifacts

| Artifact | ADR role |
| --- | --- |
| [doc-evidence-standard.md](doc-evidence-standard.md) | T0 tier definition · battle-proven bar |
| [doc-boundary-contract.md](doc-boundary-contract.md) | Escalation + change classification |
| Domain North Star | EFR/amendments cite T0 ADR in §12 |
| Blueprint §4.3 | Box changes require ADR row |
| PAS §4 Stability = **Constitutional** | Every change requires ADR |
| Slice | May cite ADR as Prerequisite only — does not replace ADR body |

---

## Anti-patterns

| Anti-pattern | Fix |
| --- | --- |
| Code merged with Proposed ADR only | Accept ADR first or revert code |
| Accepted ADR with no downstream traceability | Complete traceability table before merge |
| Silent edit to Accepted ADR | Supersede with new ADR |
| ADR duplicates PAS §4 contract text | ADR decides · PAS specifies |
| "Emergency" without retroactive ADR | Block next release until ADR Accepted |
| Superseded ADR still cited as T0 | Update to successor ADR |

---

## Enterprise acceptance (ADR constitution)

| Criterion | Gate |
| --- | --- |
| Every irreversible platform decision has Accepted ADR | Manual architecture review |
| Every Accepted ADR has traceability table | PR checklist |
| Supersession chain intact | `pnpm check:documentation-drift` |
| Emergency deviations retrofitted ≤5 business days | On-call runbook |
| T0 citations in NS/Blueprint/PAS resolve to Accepted ADR | doc-evidence audit |
