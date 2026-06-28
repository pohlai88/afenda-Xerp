# Visual Token Constitutional Laws

| Field | Value |
| --- | --- |
| **Document class** | `domain_constitution` |
| **Document role** | `immutable_visual_token_laws` |
| **Parent** | [Platform Constitutional Laws](platform-constitutional-laws.md) |
| **Child documents** | [Design Token Authority North Star](../NORTHSTAR/css-authority-north-star.md) · CSS Authority PAS family · all token authority JSON sources |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) |
| **Maturity** | Production Candidate |
| **Last reviewed** | 2026-06-29 |

> **One sentence:** Eight permanent laws governing how Afenda owns visual design token meaning — cited by every theme override, CSS representation, design export, and consumption gate.

---

# Purpose

These laws govern **visual identity substrate** — how the platform presents consistently — not component behavior, business meaning, or wire shapes. They supplement [Platform Constitutional Laws](platform-constitutional-laws.md); they do not replace them.

When the Design Token Authority North Star, Blueprint, or PAS repeats one of these laws, it should **link here**.

---

# The Eight Laws

## LAW V1 — Meaning before syntax

Visual meaning is constitutional; runtime syntax is a **representation**.

**Therefore:** Token identity and semantic intent survive renames of CSS custom properties, PDF fills, or email inline styles.

*Primary home:* Design Token Authority North Star · P9 · §3.3

---

## LAW V2 — Authority sources own truth; registry proves compilation

Human-edited authority records declare token truth. Generated registries are compiled output — never edited in place.

**Therefore:** Drift between source and registry is a governance defect, not a merge conflict to resolve by hand.

*Primary home:* Design Token Authority North Star · P1 · I1

---

## LAW V3 — Modes are governed dimensions, not ad-hoc overrides

Color mode, density mode, motion preference, and high-contrast accessibility are **theme dimensions** with governed token value sets — not per-component CSS exceptions.

**Therefore:** A token's meaning is stable across modes; only its representation values change per mode.

*Primary home:* Design Token Authority North Star · §3.4

---

## LAW V4 — Semantic context is binding

A token's role (surface, text, border, feedback, chart) constrains where it may be consumed — appearance-matched substitution across modes is prohibited.

**Therefore:** Consumers must reference tokens by semantic role, not by visual similarity in one theme.

*Primary home:* Design Token Authority North Star · §3.7 · §3.8

---

## LAW V5 — Accessibility is proven, not intended

Color and typography tokens that carry user-facing semantics must satisfy declared contrast and readability policy with **evidence** — not prose intent alone.

**Therefore:** Production+ semantic color tokens require contrast proof or explicit exemption with accepting authority.

*Primary home:* Design Token Authority North Star · §3.7 · I7

---

## LAW V6 — Aliases preserve design relationships

Token references (aliases) link semantic tokens to primitives and composites. Tools and gates must preserve reference graphs — not flatten to raw values at authority time.

**Therefore:** Parent lineage is traceable; broken alias chains block promotion to Stable.

*Primary home:* Design Token Authority North Star · §3.6

---

## LAW V7 — Tenant override cannot fracture the spine

Multi-tenant and sub-brand theming may override only within declared theme layers and namespaces. Unregistered tokens and undeclared layers are forbidden.

**Therefore:** Published tenant themes are bounded, reviewable, and reversible — they do not fork parallel token vocabularies.

*Primary home:* Design Token Authority North Star · §9.6 · P10

---

## LAW V8 — Tokens never own behavior

Visual tokens govern appearance values. Governed UI variants, recipes, interaction states, and component choreography live in the Design System domain.

**Therefore:** Token authority sources never encode component behavior, layout recipes, or ERP workflow semantics.

*Primary home:* Design Token Authority North Star · P6 · I5

---

# Constitutional token chain

Every governed visual decision follows this chain — constitutional, not optional:

```text
Visual meaning (semantic intent)
        │
        ▼
Design token (identity · tier · taxonomy · theme layer · mode)
        │
        ▼
Platform representation (CSS today · PDF · email · design-tool export tomorrow)
        │
        ▼
Consumption proof (gates · baselines · contrast evidence)
```

**Rule:** Representations consume token meaning — they do not redefine it ([LAW V1](../CONSTITUTION/visual-token-constitutional-laws.md)).

---

# Platform presentation among orthogonal domains

| Domain | Constitutional question |
| --- | --- |
| **Platform Kernel** | *What does the platform say?* (wire shape) |
| **Enterprise Knowledge** | *What is accepted meaning?* (business truth) |
| **Platform Architecture Authority** | *What is allowed?* (structure) |
| **Accounting Standards Authority** | *Which external standard applies?* (citation) |
| **Design Token Authority** | *How does visual identity stay consistent?* (presentation substrate) |

Design Token Authority owns **visual presentation values** — not business term definitions, package registries, or component behavior.

---

# Amendment rule

Amend only by ADR + Design Token Authority domain owner review. PAS and authority JSON amendments require alignment with these laws.

---

# References

| Document | Role |
| --- | --- |
| [Design Token Authority North Star](../NORTHSTAR/css-authority-north-star.md) | Full domain specification |
| [Platform Constitutional Laws](platform-constitutional-laws.md) | Platform-wide laws (LAW 2 · registry-before-runtime) |
| [Design Token Authority Blueprint](../BLUEPRINT/css-authority-blueprint.md) | CSS representation box map |
| [governed-ui-policy.md](../governance/governed-ui-policy.md) | Tokens ≠ recipes boundary |
