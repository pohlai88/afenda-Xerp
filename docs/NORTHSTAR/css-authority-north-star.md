# Design Token Authority North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | Design Token Authority — governed visual design tokens independent of rendering technology |
| **Domain type** | Design substrate domain *(tokens and visual identity — not component behavior or business rules)* |
| **Constitutional question** | *How does the platform present visual identity consistently across surfaces and renderers?* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Derived document** | [Design Token Authority Blueprint](../BLUEPRINT/css-authority-blueprint.md) · [Platform Blueprint rollup](../architecture/afenda-architecture-blueprint.md) |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) |
| **Maturity** | Production Candidate — peer-reviewed 2026-06-29 (9.6/10) |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** (Enterprise Accepted blocked on §15 exit criteria) |
| **Evidence standard** | `.cursor/skills/kernel-authority/reference/doc-evidence-standard.md` |
| **Last reviewed** | 2026-06-29 |
| **Blueprint box** | **CSS authority** *(today's primary renderer — PAS-005)* |
| **Next document** | [Design Token Authority Blueprint](../BLUEPRINT/css-authority-blueprint.md) |

> **One sentence:** Every governed visual design token must have stable identity, authoritative source, theme placement, lifecycle, and consumption proof — rendered through CSS today and through other platform representations tomorrow without redefining visual meaning.

> **Technology independence:** The constitutional concern is **visual design tokens** — color, spacing, typography, motion, and semantic feedback — not CSS custom properties alone. CSS is the **current platform representation**; email, PDF, native mobile, and design-tool sync are future representations of the same token truth.

---

# 0. Agent Quick Path

**Read order:** [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → Platform NS → this document §1–§12 → [Design Token Authority Blueprint](../BLUEPRINT/css-authority-blueprint.md) → CSS Authority PAS family (PAS-005) → Slice → Code.

**This document answers:** why design token authority exists forever, how tokens differ from behavior, how theme inheritance works, and how cross-platform rendering relates to one token spine.

**This document never answers:** variant/recipe registries, React primitive props, gate commands, or generator file paths.

**Chain rule:** Platform North Star → Design Token Authority North Star → Design Token Authority Blueprint → PAS → Slice → Code

**Hard stops (business scope):**

- Design tokens ≠ component behavior — Governed UI recipes and variants live elsewhere.
- Authority sources are SSOT — generated registry is never hand-edited.
- CSS is one renderer — not the constitutional definition of visual meaning (P9).
- Legacy design-system CSS is strangler-deprecated — not deleted in v1 while Governed UI TS remains.

---

# 1. Domain Philosophy

Enterprise ERP interfaces span web, documentation, email, Storybook, and future native surfaces. Without governed **visual design tokens**, each team introduces ad-hoc colors and spacing, theme drift spreads silently, accessibility regressions ship undetected, and agents paste raw values that bypass design policy.

Visual consistency is **operational reliability**: operators recognize status semantics across modules; auditors expect stable presentation evidence; multi-tenant branding must not fracture the token spine.

The Design Token Authority domain exists because **visual meaning must be constitutional** — registered with stable identity, sourced from authority records, placed in an explicit theme hierarchy, and proven by consumption gates — **independent of whether today's renderer is CSS, tomorrow's is PDF, or next year's is Figma sync**.

CSS custom properties are the **current implementation** of design tokens on the web stack. They are not the eternal definition of the domain.

**Source:** Platform NS §2 Visual truth · ADR-0017 · W3C Design Tokens Community Group model (T3 △) · peer review 2026-06-29

---

# 2. Domain Identity

| Field | Definition |
| --- | --- |
| **Mission** | Govern visual design token truth — identity, taxonomy, theme inheritance, lifecycle, namespace ownership, and consumption proof — with CSS as the first platform representation. |
| **Success definition** | Zero unregistered tokens in governed paths; authority sources and registry stay in sync; theme overrides respect inheritance hierarchy; visual regression contracts pass; tokens remain renderer-agnostic in meaning. |
| **Scope** | Design token identity · taxonomy · theme hierarchy · authority sources · generated registry · vendored base theme · platform extensions · namespace ownership · lifecycle · consumption proof · cross-platform representation model · strangler cutover. |
| **Out of scope** | Icons · illustrations · motion choreography · component behavior · variant/recipe TS registries (v1) · ERP business logic · tenant-authored theme editors (future — gated). |

---

# 3. Enterprise Vocabulary

| Term | Enterprise meaning |
| --- | --- |
| **Design token** | A named visual design decision (color, spacing, typography, …) with stable identity — renderer-agnostic in meaning. |
| **Visual meaning** | The semantic intent of a token (e.g. "danger feedback surface") — independent of CSS syntax. |
| **Platform representation** | How a token renders on a target (CSS custom property, iOS asset, PDF color, email inline style). |
| **Token identity** | Stable traceability ID — survives renames of runtime syntax. |
| **Authority source** | Human-edited record declaring token truth — never generated output. |
| **Generated registry** | Machine compilation of authority sources — regen on change only. |
| **Token taxonomy** | Category classification — color, typography, spacing, … (§3.1). |
| **Theme layer** | Position in inheritance hierarchy — vendor through component (§3.2). |
| **Token owner** | Architectural owner permitted to define tokens in a namespace. |
| **Consumption proof** | Gates proving registry → runtime use → visual baseline — not registry alone. |
| **Strangler cutover** | Legacy CSS deprecated via import redirection until retirement gate clears. |

## 3.1 Token taxonomy

Not all tokens are the same **category**. Taxonomy drives governance rules, accessibility checks, and consumer expectations:

| Category | Examples | Governance note |
| --- | --- | --- |
| **Color** | Surface, text, border, chart series | Contrast/accessibility policy |
| **Typography** | Font family, size, weight, line height | Readability standards |
| **Spacing** | Gap, padding, density scale | Layout consistency |
| **Radius** | Border radius, corner tokens | Component harmony |
| **Elevation** | Shadow, z-index layers | Depth semantics |
| **Motion** | Duration, easing | Reduced-motion policy |
| **Layout** | Breakpoints, container widths | Responsive behavior inputs |
| **Semantic** | Success, warning, danger, info | ERP operational recognition |

**Rule:** Semantic tokens reference primitive tokens where possible — semantic meaning is stable; primitives may evolve.

## 3.2 Theme inheritance hierarchy

Tokens inherit through explicit layers — overrides only downward:

```text
Vendor base          (third-party default theme — e.g. shadcn)
        │
        ▼
Platform base        (Afenda extensions — density, charts, ERP status)
        │
        ▼
Brand                (group / product brand palette)
        │
        ▼
Tenant               (tenant-specific overrides — future, gated)
        │
        ▼
Surface              (shell, auth editorial, appshell namespaces)
        │
        ▼
Component            (component-scoped overrides — discouraged; recipe layer preferred)
```

**Rule:** Lower layers may override upper only within declared namespace ownership. Component-level raw token overrides are a smell — prefer Governed UI recipes for behavior-linked styling.

## 3.3 Cross-platform representation model

Constitutional chain — mirrors Kernel (shape) and Knowledge (meaning):

```text
Visual Meaning          (semantic intent — "danger surface")
        │
        ▼
Design Token            (governed identity + taxonomy + theme layer)
        │
        ▼
Platform Representation (CSS today · PDF · email · iOS · Android · Figma sync tomorrow)
```

**Example:** Token `semantic.feedback.danger.surface` renders as `--destructive` in CSS today; the **same token** may map to a PDF fill color or email table bgcolor later — meaning unchanged, representation swapped.

**Current implementation:** CSS custom properties via PAS-005 CSS Authority package and Blueprint **CSS authority** box.

**Source:** CSS Authority PAS §4–§8 (T5) · peer review 2026-06-29

---

# 4. Capability Model

| Capability | Maturity | EFR summary | Source |
| --- | --- | --- | --- |
| **Renderer-agnostic token meaning** | Production | Visual meaning defined independent of CSS syntax | §3.3 · P9 |
| **Token taxonomy** | Production | Eight category classes with governance notes | §3.1 |
| **Theme inheritance hierarchy** | Production | Vendor → platform → brand → tenant → surface → component | §3.2 |
| **Stable token identity** | Enterprise | Traceable ID, owner, category, lifecycle | PAS-005 §4 |
| **Authority sources ≠ registry** | Enterprise | JSON sources SSOT; generator produces registry | PAS-005 §5–§6 |
| **Namespace ownership** | Production | Shell, editorial, extension prefixes governed | PAS-005 §5 · §10 |
| **Consumption proof chain** | Enterprise | Registry → consumption gates → visual baseline | PAS-005 §7 · B28+ |
| **CSS platform representation** | Production | Primary web renderer — 605-token registry delivered | PAS-005 MVP |
| **Vendored base theme** | Production | Third-party theme captured and regen-upgradeable | ADR-0017 |
| **Strangler cutover** | Production | Legacy monolith → shim → authority CSS | PAS-005 B29–B30 |
| **Visual regression contract** | Production | Import chain + pixel baselines | PAS-005 B33 · B37 |
| **Cross-renderer mapping** | Advanced | Non-CSS representations of same tokens | §15 exit — future |
| **Design asset expansion** | Idea | Icons, illustrations, motion assets under Design Asset Authority | §9.4 |

---

# 5. Domain Principles

| # | Principle | Because | Therefore |
| --- | --- | --- | --- |
| P1 | **Registry ≠ authority** | Generated files drift untraceably | Edit sources; regen registry |
| P2 | **Fail fast on unknown tokens** | Ad-hoc values bypass governance | Consumption gates block unregistered use |
| P3 | **Owner namespaces** | Cross-package pollution breaks theming | Each owner defines permitted prefixes only |
| P4 | **Lifecycle honesty** | Experimental tokens in production erode trust | Lifecycle gates enforce allowed use |
| P5 | **Strangler not big-bang** | Big-bang breaks Governed UI coexistence | Cutover via imports; gated retirement |
| P6 | **Tokens ≠ behavior** | Variant meaning is not a color variable | Design Token Authority ≠ Governed UI recipes |
| P7 | **Vendor theme is vendored** | Third-party defaults upgrade through regen | Vendored vars not silently hand-edited |
| P8 | **Consumption proof, not registry alone** | Registry without proof is aspiration | Gates + visual baselines required |
| P9 | **Visual meaning is independent of rendering technology** | CSS is one renderer — not eternal truth | Token meaning stable; representations swappable |
| P10 | **Theme inherits downward** | Undeclared overrides fracture brand spine | §3.2 hierarchy enforced by namespace rules |

## 5.1 Domain invariants

| # | Invariant |
| --- | --- |
| I1 | No hand-editing of generated token registry output. |
| I2 | Every governed token has identity, category, owner, and lifecycle. |
| I3 | Semantic tokens must not embed raw hex in component packages — reference governed tokens. |
| I4 | CSS representation today does not redefine token meaning for future renderers. |
| I5 | Component behavior and recipes never live in token authority sources. |
| I6 | Consumption proof (gates + baselines) required before claiming Production+ token delivery. |
| I7 | Accessibility-sensitive categories (color, typography) respect contrast policy intent. |

**Platform consistency:**

| Domain | Owns |
| --- | --- |
| **Kernel** | Wire shape |
| **Enterprise Knowledge** | Accepted meaning |
| **Architecture Authority** | Structure / registry |
| **Accounting Standards Authority** | External citation |
| **Design Token Authority** | Visual design tokens / rendering identity |

---

# 6. Enterprise Outcomes and KPIs

| Outcome | Target | Measures |
| --- | --- | --- |
| **Token singularity** | Zero unregistered tokens in governed paths | Consumption gates |
| **Taxonomy coverage** | 100% Production+ tokens have category | Registry audit |
| **Theme hierarchy compliance** | Overrides only in declared layers/namespaces | Namespace gates |
| **Cross-surface consistency** | ERP, shell, docs share token spine | Visual regression |
| **Renderer independence** | Token definitions cite visual meaning — not CSS-only names | NS hygiene review |
| **Agent-safe styling** | Agents add tokens via authority workflow only | CSS authority skill |

---

# 7. Business Events

| Event (business vocabulary) | Meaning |
| --- | --- |
| **Token registered** | New design token entered authority with identity and taxonomy |
| **Token lifecycle advanced** | Token moved toward stable or deprecated |
| **Registry regenerated** | Authority sources compiled to registry |
| **Theme layer override declared** | Brand, tenant, or surface layer tokens added in namespace |
| **Consumption violation detected** | Unknown or unauthorized token use found |
| **Visual baseline verified** | Representation matched regression contract |
| **Cutover completed** | Primary consumer uses authority bundle over legacy shim |
| **Representation mapped** | New platform renderer linked to existing token (future) |

---

# 8. Entity Lifecycles

## 8.1 Design token

```text
Experimental → Preview → Accepted → Stable → Deprecated → Removed
```

## 8.2 Authority source

```text
Created → Active → Amended (regen required) → Superseded by domain split
```

## 8.3 CSS platform representation (current)

```text
Legacy monolith → Shim import → Authority CSS bundle → Retirement gated → Removed
```

## 8.4 Future cross-renderer mapping

```text
Token stable → Representation registered (CSS) → Additional renderer mapped → Representations sync from same authority
```

---

# 9. Boundary and Dependencies

## 9.1 This domain owns (business)

- Visual design token meaning, identity, taxonomy, and lifecycle
- Theme inheritance hierarchy and namespace ownership rules
- Authority sources, generation contract, and consumption proof policy
- CSS as **first** platform representation (not exclusive constitutional scope)
- Strangler cutover and visual regression contract vocabulary

## 9.2 This domain never owns (business)

- Governed UI variant/recipe/state behavior (Design System v1)
- React primitive component behavior (UI primitives)
- AppShell block composition (ERP shell)
- ERP business rules and workflow logic
- Accepted business term meaning (Enterprise Knowledge)
- Wire contracts (Platform Kernel)

## 9.3 Cross-domain dependencies

| Depends on | Required for |
| --- | --- |
| **Platform Architecture Authority** | Package registration · namespace discipline |
| **Platform NS visual truth** | Declared platform capability |
| **ADR-0017** | shadcn/studio delivery acceleration |
| **Accessibility standards** | Color/typography policy intent (WCAG contrast guidance — T3) |
| **Design System (Governed UI)** | Coexistence during v1 — tokens ≠ recipes |

| Provides to (domain) | What flows |
| --- | --- |
| **Presentation stack** | Governed tokens · CSS representation today |
| **ERP shell / metadata UI** | Surface-layer namespace tokens |
| **Agent UI delivery** | Traceable token IDs and add workflow |
| **Future renderers** | Token spine for PDF, email, native (when mapped) |

## 9.4 Future evolution — Design Asset Authority

Today this domain governs **tokens only** — intentionally scoped for PAS-005 MVP. Future **Design Asset Authority** may extend the same constitutional pattern to:

```text
Tokens (this domain — live)
Icons (future)
Illustrations (future)
Typography files (future)
Motion presets (future)
```

**Rule:** New asset classes require Domain NS amendment + Blueprint box + PAS — not silent expansion inside CSS authority package.

## 9.5 Platform domain placement

Design Token Authority is the **presentation identity** domain — orthogonal to language, meaning, structure, and external accounting citation:

| Domain | Question |
| --- | --- |
| **Kernel** | *What does the platform say?* |
| **Enterprise Knowledge** | *What is accepted meaning?* |
| **Architecture Authority** | *What is allowed?* |
| **Accounting Standards Authority** | *Which external standard applies?* |
| **Design Token Authority** | *How does visual identity stay consistent?* |

---

# 10. Enterprise Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **CSS-only constitutional model** | Future renderers fork parallel token sets | P9 · §3.3 cross-platform model |
| **Token sprawl** | Inconsistent visuals | Consumption fail-fast |
| **Theme hierarchy collapse** | Undeclared overrides everywhere | §3.2 · namespace gates |
| **Behavior/token collapse** | Recipes in raw CSS | P6 · separate Design System |
| **Hand-edited registry** | Source/runtime drift | P1 · I1 |
| **Implementation-as-constitution** | 605 tokens mistaken for eternal law | §12 constitutional vs implementation evidence |
| **Accessibility regression** | Contrast failures in production | Taxonomy + semantic color policy |
| **False Enterprise claim** | MVP presented as full retirement | §15 exit criteria |

---

# 11. Quality Attributes

| Attribute | Expectation |
| --- | --- |
| **Renderer independence** | Token meaning stable across representations |
| **Traceability** | Identity + authority source + theme layer |
| **Determinism** | Regeneration idempotent from sources |
| **Fail-closed consumption** | Unknown tokens block merge |
| **Accessibility intent** | Color/typography categories support contrast policy |
| **Maintainability** | Strangler path — no big-bang rewrite |
| **Honest maturity** | Production Candidate until cross-renderer proof optional |

---

# 12. Domain Evidence

## 12.1 Constitutional evidence (T0–T3)

Permanent claims justifying the domain — dominant in this register:

| ID | Claim | Tier | Reference |
| --- | --- | --- | --- |
| E1 | Platform declares visual truth as platform-owned capability | T1 | [Platform NS](../architecture/afenda-platform-north-star.md) §2 |
| E2 | Governed UI delivery acceleration requires centralized token authority | T0 | [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) |
| E3 | Design token as architectural concept (renderer-agnostic decisions) | T3 | W3C Design Tokens Community Group format (reference model) |
| E4 | Accessibility requires governed color/text semantics | T3 | WCAG 2.x contrast principles (color category policy) |
| E5 | Tokens separate from component behavior | T1 | [governed-ui-policy.md](../governance/governed-ui-policy.md) · ADR-0017 pipeline |
| E6 | Registry-before-runtime applies to visual identity | T1 | [LAW 2](../CONSTITUTION/platform-constitutional-laws.md) · consumption proof |
| E7 | Blueprint design-system family declares token authority box | T1 | Architecture Blueprint · CSS authority row |

## 12.2 Implementation evidence (T5 — delivery proof, not constitutional SSOT)

| ID | Claim | Tier | Reference |
| --- | --- | --- | --- |
| I1 | CSS Authority PAS constitutional sentence | T5 | PAS-005 preamble |
| I2 | Authority JSON → generator → registry pipeline | T5 | PAS-005 §5–§6 |
| I3 | MVP slice sequence B26–B37 delivered | T5 | PAS-005 §11 |
| I4 | Web CSS representation — 605-token registry | T5 | PAS-005 runtime status |
| I5 | Consumption gates R23–R30 operational | T5 | PAS-005 §7 · §13 |

## 12.3 Peer review decisions

| ID | Claim | Status | Reference |
| --- | --- | --- | --- |
| D1 | Elevate philosophy from CSS to design tokens | ✓ | Peer review 2026-06-29 · §1 · P9 |
| D2 | Theme inheritance hierarchy | △ | §3.2 — enforce in PAS namespaces |
| D3 | Cross-platform representation model | △ | §3.3 — CSS first; others future |
| D4 | Token taxonomy constitutional | △ | §3.1 — category on all Production+ tokens |

**Provenance:** Production Candidate — peer-reviewed 9.6/10 (2026-06-29). Implementation evidence (I4) supports delivery — does not alone justify Enterprise Accepted.

---

# 13. Blueprint Mapping

Capability → Blueprint box names only. Detail: [Design Token Authority Blueprint](../BLUEPRINT/css-authority-blueprint.md) §4 · [Platform Blueprint rollup](../architecture/afenda-architecture-blueprint.md).

| §4 Capability | Blueprint box |
| --- | --- |
| Renderer-agnostic token meaning | **CSS authority** *(PAS-005 — primary CSS representation)* |
| Token taxonomy | **CSS authority** |
| Theme inheritance hierarchy | **CSS authority** · **ERP shell** (surface layer) |
| Authority sources ≠ registry | **CSS authority** |
| Consumption proof chain | **CSS authority** |
| CSS platform representation | **CSS authority** · **UI primitives** (consumer) |
| Visual regression contract | **CSS authority** |
| Cross-renderer mapping | **CSS authority** (future) · new box if non-CSS PAS |

---

# 14. Governance

| Question | Authority |
| --- | --- |
| Change token constitutional model | This North Star + ADR |
| Add token / namespace / category | PAS-005 authority JSON + regen + gates |
| Add theme layer override | Namespace rules + §3.2 compliance |
| Add non-CSS representation | Domain NS amendment + Blueprint + PAS |
| Expand to Design Asset Authority | New Domain NS + Blueprint box — §9.4 |
| Promote to Enterprise Accepted | §15 exit criteria |

## 14.5 Design token decision matrix

| Question / change | Authority owner |
| --- | --- |
| New **design token** meaning | Design Token Authority · authority JSON |
| New **CSS custom property** (web) | PAS-005 · consumption gates |
| **Component variant/recipe** | Design System Governed UI — not tokens |
| **Semantic ERP color** (danger/success) | Token authority · semantic category |
| **Tenant brand override** | Theme layer · tenant (future, gated) |
| **Raw hex in component** | Prohibited — use governed token |
| **Figma/PDF/email renderer** | Cross-renderer mapping · future PAS |
| **Icon/illustration asset** | Design Asset Authority (future) — not PAS-005 v1 |

---

# 15. Sync and Enterprise Accepted path

| Downstream | Sync rule |
| --- | --- |
| Design Token Authority Blueprint §4 | Maps to **CSS authority** box (today's CSS representation) |
| Platform Blueprint | Design system family rollup |
| CSS Authority PAS family | Implements CSS representation of this domain |
| `docs/architecture/css-authority.md` | Operational derived view — not SSOT |

## Enterprise Accepted exit criteria

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | Token taxonomy on all Production+ tokens | §3.1 category facet |
| 2 | Theme hierarchy enforced in namespaces | §3.2 gate coverage |
| 3 | P9 documented in PAS charter — CSS as representation | PAS-005 §1 cross-link |
| 4 | Constitutional evidence E1–E7 cited in PAS | Doc parity |
| 5 | Consumption proof + visual regression green | I5 |
| 6 | Design-system CSS retirement gate evaluated | PAS-005B readiness |
| 7 | Peer review △ items (D2–D4) closed | Evidence register ✓ |
| 8 | Optional: second platform representation pilot | PDF or email token map |

**Last synced with PAS:** PAS-005 MVP B26–B37 closed · **Maturity:** Production Candidate (9.6/10 peer review) · **Note:** Blueprint box remains **CSS authority** until cross-renderer PAS warrants rename
