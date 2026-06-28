# Knowledge Constitutional Laws

| Field | Value |
| --- | --- |
| **Document class** | `domain_constitution` |
| **Document role** | `immutable_knowledge_laws` |
| **Parent** | [Platform Constitutional Laws](platform-constitutional-laws.md) |
| **Child documents** | [Enterprise Knowledge North Star](../NORTHSTAR/enterprise-knowledge-north-star.md) · PAS-004 family · all Domain NS §3 promotion paths |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Maturity** | Production Candidate |
| **Last reviewed** | 2026-06-29 |

> **One sentence:** Eight permanent laws governing how Afenda determines accepted meaning — cited by every glossary, UI label, AI context, and PAS vocabulary row.

---

# Purpose

These laws govern **epistemology** — how the platform knows — not wire shapes, package topology, or external accounting authority. They supplement [Platform Constitutional Laws](platform-constitutional-laws.md); they do not replace them.

When PAS-004, a Domain North Star, or a glossary repeats one of these laws, it should **link here**.

---

# The Eight Laws

## LAW K1 — Acceptance creates authority

Knowledge becomes authoritative through **acceptance** — not through storage, documentation volume, or AI generation.

**Therefore:** Atoms without complete acceptance chains remain non-binding; existence of text is insufficient.

*Primary home:* Enterprise Knowledge North Star · P1

---

## LAW K2 — Representations never own meaning

Glossary pages, UI labels, AI copy, and documentation are **representations**. They consume Knowledge Atoms — they do not define them.

**Therefore:** When representation and registry diverge, **registry wins** until a sync slice updates the representation.

*Primary home:* Enterprise Knowledge North Star · P6 · §3.1 hierarchy

---

## LAW K3 — Evidence precedes reasoning

Acceptance claims must cite durable evidence artifacts before structured reasoning is evaluated.

**Therefore:** Evidence nodes are first-class; reasoning without evidence is incomplete.

*Primary home:* Enterprise Knowledge North Star · P3 · acceptance graph

---

## LAW K4 — Reasoning precedes acceptance

An accepting authority records **why** meaning was accepted — structured reasoning, not prose memory.

**Therefore:** Flat reasoning strings do not satisfy recoverable decision requirements.

*Primary home:* Enterprise Knowledge North Star · P2

---

## LAW K5 — Meaning evolves; representations synchronize

Supersession preserves lineage. Representations track atoms — they are not overwritten in place without sync.

**Therefore:** `supersededBy` and temporal scope are mandatory at Production+; never silent overwrite of historical meaning.

*Primary home:* Enterprise Knowledge North Star · §8 · I8

---

## LAW K6 — Kernel owns shape; Knowledge owns meaning

Wire contracts carry serializable shapes. Knowledge Atoms carry accepted business meaning. Neither owns the other.

**Therefore:** Implementation mapping links atoms to kernel references — never duplicates parsers or conflates types with definitions.

*Primary home:* Enterprise Knowledge North Star · P9 · Platform Kernel North Star · hard stop

---

## LAW K7 — One meaning, many representations

A single Knowledge Atom may surface in glossary, metadata labels, UI copy, and AI context — all as derived views.

**Therefore:** Promotion pipeline is one atom → many representations — not many local definitions.

*Primary home:* Enterprise Knowledge North Star · §8.5 promotion pipeline

---

## LAW K8 — Acceptance preserves lineage; never overwrite history

Historical meaning remains queryable. Superseded atoms are not deleted — they enter historical epistemic status with explicit lineage.

**Therefore:** Audit and replay ask *"What was accepted on date Y?"* — always answerable.

*Primary home:* Enterprise Knowledge North Star · §3.3 epistemic status · temporal scope

---

# Constitutional promotion pipeline

Every future glossary **must** derive from this chain — constitutional, not optional:

```text
Domain North Star §3 (vocabulary row)
        │
        ▼
Knowledge Promotion (SYNC slice)
        │
        ▼
Knowledge Concept (abstract — optional anchor)
        │
        ▼
Knowledge Atom (accepted meaning)
        │
        ├─► Glossary (representation)
        ├─► UI / metadata labels (representation)
        ├─► AI / copilot context (representation)
        └─► Documentation views (representation)
```

**Rule:** Terms are not invented in PAS, glossary, or UI without a Domain NS §3 row or explicit `proposed` atom.

---

# Platform meaning among four orthogonal domains

| Domain | Constitutional question |
| --- | --- |
| **Platform Kernel** | *How does the platform communicate?* (shape) |
| **Platform Architecture Authority** | *How is the platform structured?* (structure) |
| **Enterprise Knowledge** | *How does accepted meaning become truth?* (meaning) |
| **Accounting Standards Authority** | *Which external accounting authority applies?* (external authority) |

These four domains **must not overlap**. Knowledge owns meaning — not wire shapes, package registries, or IFRS citation chains.

---

# Amendment rule

Amend only by ADR + Enterprise Knowledge domain owner review. PAS-004 charter §1–§4 amendments require alignment with these laws.

---

# References

| Document | Role |
| --- | --- |
| [Enterprise Knowledge North Star](../NORTHSTAR/enterprise-knowledge-north-star.md) | Full domain specification |
| [Platform Constitutional Laws](platform-constitutional-laws.md) | Platform-wide laws (LAW 1 · LAW 4 · LAW 10) |
| [PAS-004 charter](../PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) | Implementation charter |
