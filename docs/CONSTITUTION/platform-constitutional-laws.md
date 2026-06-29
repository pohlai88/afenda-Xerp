# Platform Constitutional Laws

| Field | Value |
| --- | --- |
| **Document class** | `platform_constitution` |
| **Document role** | `immutable_platform_laws` |
| **Parent** | None — supreme platform principles |
| **Child documents** | [Platform North Star](../PAS/afenda-platform-north-star.md) · [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) · all Domain North Stars · all Blueprints · all PAS |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| **Maturity** | Enterprise Accepted |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package ownership, contracts, implementation authority |
| **Last reviewed** | 2026-06-29 |

> **One sentence:** Ten permanent laws that every Afenda document, package, and agent must obey — stated once here, referenced everywhere else.

---

# Purpose

These laws are **not** a North Star, Blueprint, or PAS. They are the shortest constitutional layer: principles so fundamental that downstream documents **cite** them instead of restating them.

When a Domain North Star, Blueprint, or PAS repeats one of these laws in prose, it should link here — not re-debate it.

---

# The Ten Laws

## LAW 1 — Meaning before implementation

Business meaning must be accepted and documented before code implements it.

**Therefore:** Domain North Star §1–§12 precedes Blueprint boxes; contested terms require Enterprise Knowledge acceptance — not local invention.

---

## LAW 2 — Registry before runtime

What exists architecturally must be registered before it executes in production.

**Therefore:** No package ships without registry row, layer assignment, and ownership; governance records truth — runtime consumes it.

*Primary home:* [Platform Architecture Authority North Star](../NORTHSTAR/architecture-authority-north-star.md) · P1

---

## LAW 3 — One owner per responsibility

Every architectural responsibility has exactly one accountable authority.

**Therefore:** Package ownership is explicit; boundary changes require identifiable approver; shared ownership without authority is a defect.

*Primary home:* Platform Architecture Authority North Star · P4 · Governance Invariants

---

## LAW 4 — Vocabulary before behavior

Shared words must be agreed before modules implement behavior that depends on them.

**Therefore:** Platform Kernel owns primitive wire vocabulary; Enterprise Knowledge owns accepted business meaning; domain runtimes must not fork parallel definitions.

*Primary home:* [Platform Kernel North Star](../NORTHSTAR/kernel-north-star.md) · P5

---

## LAW 5 — Contracts before implementation

Authority surfaces and contracts are declared before slices implement them.

**Therefore:** PAS §4 precedes code; breaking changes require ADR; slices implement one declared surface — not inferred scope.

---

## LAW 6 — Behavior belongs to runtime owners

Governance and vocabulary packages never execute business or product behavior at request time.

**Therefore:** Architecture authority is contracts-only; standards authority validates — it does not post; kernel carries words — it does not resolve business state.

*Primary home:* Platform Architecture Authority North Star · P8 · P9

---

## LAW 7 — Governance records truth; runtime executes truth

The registry describes what is allowed. Runtime packages perform what is permitted within those boundaries.

**Therefore:** CI gates prove registry parity; ERP request paths do not embed governance logic; drift between registry and filesystem is a defect.

*Primary home:* Platform Architecture Authority North Star · P9

---

## LAW 8 — Kernel owns identity semantics; governance owns reservations

Enterprise identity wire behavior lives in Platform Kernel. Architecture authority records which domain **reserves** which entity families — never parsers, brands, or asserts.

**Therefore:** No ID format or parser logic in architecture authority; business entity reservation map is governance metadata only.

*Primary home:* Platform Architecture Authority North Star · P7 · Platform Kernel North Star · hard stop

---

## LAW 9 — Architecture must be discoverable before it is executable

Contributors and agents must know where a change belongs before they implement it.

**Therefore:** Governance Decision Matrix and Blueprint §3.1 Architecture Decision Matrix are mandatory routing — not optional guidance.

*Primary home:* Platform Architecture Authority North Star · §14.5 · [Architecture Blueprint](../BLUEPRINT/kernel-blueprint.md) §3.1

---

## LAW 10 — Every architectural decision must be traceable to accepted evidence

Permanent claims require battle-proven sources — not assumptions dressed as requirements.

**Therefore:** Domain North Star §12 Evidence Register; ADR for T0 decisions; PAS §11 EAC traces upstream EFR; zero ✗ assumptions at Production+ maturity.

*Primary home:* [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md)

---

# Constitutional stack

```text
Platform Constitutional Laws (this document)
        │
        ├── Knowledge Constitutional Laws (epistemology — K1–K8)
        │
        ▼
Platform North Star
        │
        ├──────────────────┬──────────────────┐
        ▼                  ▼                  ▼
Platform Kernel NS   Enterprise Knowledge NS   Platform Architecture Authority NS
 (language / shape)    (meaning / truth)         (structure / registry)
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
              Accounting Standards Authority NS
                   (external authority consumption)
        │
        ▼
Architecture Blueprint → PAS → Slice → Code
```

---

# Amendment rule

These laws change only by **ADR + platform owner review**. Domain North Stars, Blueprints, and PAS documents **reference** laws — they do not silently amend them.

If a proposed change contradicts a law, escalate: amend the law (rare) or redesign the change (usual).

---

# References

| Document | Role |
| --- | --- |
| [Platform North Star](../PAS/afenda-platform-north-star.md) | Platform philosophy and capability direction |
| [Platform Architecture Authority North Star](../NORTHSTAR/architecture-authority-north-star.md) | Governance constitutional domain |
| [Platform Kernel North Star](../NORTHSTAR/kernel-north-star.md) | Vocabulary constitutional domain |
| [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) | Cross-document SSOT rules |
| [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) | Evidence tiers and EFR rules |
