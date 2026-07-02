# Developer Sandbox North Star (Route Lab)

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star_adjunct` |
| **Document role** | `presentation_lab_specification` |
| **Domain** | Developer Route Lab — full-screen operator UX prototyping |
| **Parent** | [shadcn/studio Presentation North Star](shadcn-studio-presentation-north-star.md) |
| **Authority ADR** | [ADR-0039](../adr/ADR-0039-developer-presentation-sandbox.md) |
| **Derived document** | [Developer Sandbox Blueprint](../BLUEPRINT/developer-sandbox-blueprint.md) |
| **Maturity** | Production Candidate (docs) — app scaffold Planned (P06-014) |
| **Runtime stance** | Documentation only until P06-014 |
| **Last reviewed** | 2026-07-02 |

> **One sentence:** The Developer Route Lab lets Afenda prototype **full operator surfaces** — chrome, navigation, multi-block dashboards, and settings — using Afenda frontend law and `@afenda/shadcn-studio`, without ERP auth or integration spine, so accepted UX promotes mechanically to production routes.

---

# 1. Domain Philosophy

Block lab (Storybook) proves individual presentation blocks under ACPA. Production ERP requires auth, operating context, and APIs. Teams need a **middle layer** where dashboard density, nav grouping, datatable lists, and theme settings compose as **real routes** — shaped like future ERP — before spine wiring.

The route lab **borrows reference visuals** from the gitignored AdminCN template (ADR-0017) but **rejects reference structure** (`src/views/`, auth pages, MCP shell blocks). Speed without Afenda page law creates promotion debt.

**Source:** ADR-0039 (T0) ✓ · Presentation NS Block/Route lab split (T1) ✓ · ADR-0017 Appendix A (T0) ✓

---

# 2. Domain Identity

## Mission

Provide an isolated **route lab** application that consumes PAS-006 presentation product only, prototypes operator chrome and multi-block screens on port **3002**, and feeds ERP visually after acceptance — never substituting for kernel, API, or spine authority.

## Definition

**Developer Route Lab is:** the Application-layer sandbox where full-screen operator UX is composed with **the same frontend law as ERP production** — thin RSC pages, route-colocated components, AppShell chrome, segment boundaries — using static lab fixtures instead of auth and integration spine.

**Do not describe:** npm scripts, port env vars, gate commands, or slice IDs in business sections.

## Success

When realized, designers and implementers validate **screen-level** UX (not just blocks) in under a minute locally; promotion to ERP remaps loaders and `_components/` without restructuring folders.

---

# 3. Enterprise Vocabulary

| Term | Business meaning | Not confused with | Source |
| --- | --- | --- | --- |
| **Block lab** | Storybook environment for single-block verification | Route lab | Presentation NS §3 · P06-012 |
| **Route lab** | Developer app for full operator chrome + multi-block routes | Production ERP | ADR-0039 |
| **Reference borrow** | Visual UX inspiration from gitignored AdminCN template | Runtime import | ADR-0017 Appendix A |
| **Lab demo context** | Static fixture stand-in for page data — not tenant scope | OperatingContext | PAS-006E |
| **Promotion chain** | Accepted sandbox UX → ERP route with spine wiring | Direct copy-paste of auth | ADR-0039 |

---

# 4. Three-Layer Lab Model

| Layer | App | Port | Proves |
| --- | --- | --- | --- |
| Block lab | `apps/storybook` | 6006 | Block ACPA · theme · isolation |
| **Route lab** | **`apps/developer`** | **3002** | Shell · nav · multi-block screens |
| Production | `apps/erp` | 3000 | Auth · spine · APIs · tenant context |

**Rule:** Route lab sits between block acceptance and ERP wiring — not a fourth presentation owner.

---

# 5. Domain Principles

| # | Principle | Reasoning |
| --- | --- | --- |
| **P0** | **ERP production parity** — same Next.js frontend bar; auth/spine/BFF/deploy only exclusions | Lab is not a excuse for weaker page law |
| P1 | **Borrow visuals; build Afenda structure** | Reference `src/views/` does not promote to ERP |
| P2 | **Presentation only** | No kernel, API, or spine in sandbox |
| P3 | **No production deploy** | Lab-lane; hard-fail without `AFENDA_DEVELOPER_SANDBOX` in production |
| P4 | **No `_reference` runtime** | Gitignored mirror is read-only inspiration |
| P5 | **Feeds ERP visually** | Loaders and components remap — not parallel UI stack |
| P6 | **Demo banner always** | Operators must never confuse lab with production |

---

# 6. Domain Boundary

## Owns (business)

- Full-screen operator UX prototyping doctrine
- v1 route borrow map (Adapt routes only)
- Frontend layout annex (thin page · loader · `_components/`)
- Promotion intent to ERP operator surfaces

## Never owns

- Kernel vocabulary · operating context resolution
- Platform API / BFF contracts
- Better Auth · session · permission evaluation
- Business meaning (Enterprise Knowledge)
- Block inventory or Acceptance Records (PAS-006B/C in `@afenda/shadcn-studio`)

---

# 7. Entity Lifecycle (Route Lab Screen)

```text
Borrow mapped → Scaffolded in route lab → Visually reviewed → Accepted for ERP promotion → Wired in ERP with spine
```

| State | Meaning |
| --- | --- |
| Borrow mapped | Listed in reference-borrow-map with Adapt decision |
| Scaffolded | Route exists in `apps/developer` with lab fixtures |
| Visually reviewed | Stakeholder sign-off on density/nav/theme |
| ERP promotion queued | Separate PAS-001A / ERP slice — not automatic |

---

# 8. Capability → Blueprint Traceability

| Capability | Blueprint box |
| --- | --- |
| Route lab application | Developer Route Lab |
| PAS-006 consumption | shadcn/studio Presentation (upstream) |
| ERP promotion target | ERP Application (downstream) |

**Next document:** [Developer Sandbox Blueprint](../BLUEPRINT/developer-sandbox-blueprint.md) · [PAS-006E](../PAS/PRESENTATION/PAS-006E-DEVELOPER-ROUTE-LAB-STANDARD.md)

---

## References

| Document | Role |
| --- | --- |
| [Presentation North Star](shadcn-studio-presentation-north-star.md) | Parent domain |
| [ADR-0039](../adr/ADR-0039-developer-presentation-sandbox.md) | Constitutional decision |
| [reference-borrow-map.md](../PAS/PRESENTATION/SLICE/reference-borrow-map.md) | v1 routes |
| [afenda-nextjs-best-practice SKILL](../../.cursor/skills/afenda-nextjs-best-practice/SKILL.md) | Page law |
