# shadcn/studio Presentation North Star

| Field | Value |
| --- | --- |
| **Document class** | `domain_north_star` |
| **Document role** | `domain_root_specification` |
| **Domain** | shadcn/studio Presentation — governed ERP frontend visual truth |
| **Domain type** | Design substrate domain *(operator surfaces — not business LoB runtime)* |
| **Constitutional question** | *How do operators experience Afenda consistently and inspectably?* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) |
| **Derived document** | [Presentation Blueprint](../BLUEPRINT/shadcn-studio-presentation-blueprint.md) · [Platform Blueprint rollup](../architecture/afenda-architecture-blueprint.md) |
| **Authority ADR** | [ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) · [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) (MCP vendor approval) |
| **Maturity** | Production Candidate — **not yet Enterprise Accepted** (frontend production-chain doctrine added 2026-06-29) |
| **Runtime stance** | Documentation only |
| **Does not confer** | Package boundaries, PAS authority, contracts, runtime authority, implementation, slices |
| **Quality target** | Enterprise **10 / 10** |
| **Evidence standard** | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| **Last reviewed** | 2026-06-29 (frontend production-chain extension — ACPA · relational inventory · acceptance gates) |
| **Package / PAS inventory** | See [Presentation Blueprint](../BLUEPRINT/shadcn-studio-presentation-blueprint.md) — not declared here |
| **Next document** | [Presentation Blueprint](../BLUEPRINT/shadcn-studio-presentation-blueprint.md) |

> **One sentence:** shadcn/studio is Afenda’s **governed frontend manufacturing system** — blocks are imported, structurally normalized, stabilized, ACPA-verified, theme-bound, metadata-bound, accepted, and only then customized or wired into operator surfaces.

> **Manufacturing system, not decoration layer:** Vendor acceleration supplies raw material. Afenda governance turns stock blocks into **enterprise production UI** through a stabilization-first chain — independent of ledger posting, permission evaluation, or accepted enterprise meaning.

---

## Document layers (constitutional)

```text
LAYER A — Business architecture (§1–§12)     philosophy → evidence
LAYER B — Implementation bridge (§13)        capability → Blueprint box names only
LAYER C — Governance & acceptance (§14–§19)  authority · evolution · EAC · sync
```

| Layer | Sections | Agent implement mode |
| --- | --- | --- |
| **A — Business** | §1–§12 | Read on **business scope dispute** or UX doctrine questions |
| **B — Bridge** | §13 | Blueprint authors only |
| **C — Governance** | §14–§19 | Authors and `/afenda-review` |

---

# 0. Agent Quick Path

**Read order:** [Platform North Star](../architecture/afenda-platform-north-star.md) → this document §1–§12 → [Presentation Blueprint](../BLUEPRINT/shadcn-studio-presentation-blueprint.md) → Presentation PAS → Slice → Code.

**This document answers:** why shadcn/studio is a governed frontend production chain; what relational inventory structure scales ERP modules; how stabilization precedes customization; how metadata-driven surfaces compose; how ACPA acceptance gates production wiring.

**This document never answers:** package paths, MCP install commands, CSS dist sync, gate commands, or slice order.

**Chain rule:** Platform North Star → Presentation North Star → Presentation Blueprint → PAS → Slice → Code

**Hard stops (business scope):**

- Presentation renders surfaces — it does **not** define accepted business meaning (Enterprise Knowledge domain).
- Presentation composes visual patterns — it does **not** evaluate permissions or resolve operating scope (Authorization · Platform Kernel domains).
- Do not operate dual-stack presentation pipelines — one visual owner after ADR-0027 reset.
- Do not treat vendor-generated blocks as production-ready — raw MCP output is **Imported**, not Accepted (§8.1).
- Do not customize unstable blocks — **stabilize before customize** (§3.5 · P9 · I6).
- Metadata-driven composition is a **core scalability path** — not an optional future (§3.6).
- **ACPA** is the primary acceptance profile for operator surfaces; **WCAG 2.2 AA** is the mandatory floor for Authorization-adjacent surfaces only (§3.7).

**Skill routing ([using-afenda-skills](../../.cursor/skills/using-afenda-skills/SKILL.md)):** ERP UI/CSS work → `shadcn-studio` + PAS-006 · kernel boundary → `kernel-authority` · CSS dist → `package-css-dist-sync`.

**Implement mode rule:** Phase 0 six lines come from the **slice 9-field handoff** — not from this document.

---

# 1. Domain Philosophy

Enterprise ERP operators spend most of their working day inside **operator surfaces** — lists, forms, dashboards, settings, and error states. When every team ships UI through a different primitive stack, token registry, or promotion pipeline, operators experience inconsistent density, broken accessibility, and visual drift that erodes trust faster than incorrect business logic hidden behind a polished screen.

Parallel presentation stacks also destroy **delivery inspectability**: no one can answer which block is approved, which theme is active, or whether a surface was verified before production wiring. Vendor-accelerated design generation (MCP-assisted blocks) increases throughput only when a **single governed inventory** absorbs new patterns — not when each feature team forks its own component layer.

The shadcn/studio Presentation domain exists because **operator visual truth must be one permanent, inspectable manufacturing system** — not a folder of copied components. Vendor blocks enter as raw material; Afenda normalizes structure, proves accessibility under **ACPA**, binds theme and metadata contracts, records acceptance evidence, and only then permits ERP wiring or surface-specific customization.

**Source:** ADR-0027 (T0) ✓ · Platform NS visual-truth intent (T1) ✓ · ADR-0017 MCP vendor approval (T0) ✓ · Afenda ACPA contrast profile (T5)

| Source | Reasoning (Because → Therefore) |
| --- | --- |
| ADR-0027 `[T0]` ✓ | **Because** parallel governed-ui stacks exceeded operational cost · **Therefore** one presentation owner is constitutional for ERP |
| SAP Fiori / Oracle Redwood patterns `[T3]` ✓ | **Because** enterprise ERPs standardize operator experience at platform level · **Therefore** Afenda declares Design substrate separate from domain LoB runtime |
| Afenda ACPA profile `[T5]` ✓ | **Because** dense ERP UI needs stricter contrast and visualization semantics than generic checks alone · **Therefore** ACPA is the primary block acceptance profile |
| WCAG 2.2 AA `[T3]` ✓ | **Because** Authorization-adjacent surfaces carry legal and security exposure · **Therefore** sign-in, MFA, and access-denial flows require explicit WCAG AA floor |

---

# 2. Domain Identity

## Mission

Govern how Afenda runs a **stabilization-first frontend production chain** — importing vendor blocks, normalizing relational inventory structure, proving **ACPA** acceptance (and **WCAG 2.2 AA** on Authorization-adjacent surfaces), binding theme and metadata contracts, and recording acceptance evidence before ERP wiring or customization.

| Source | Reasoning |
| --- | --- |
| ADR-0027 `[T0]` ✓ | **Because** reset removed parallel stacks · **Therefore** mission is unification under one visual owner |
| Presentation NS §1 `[T1]` | **Because** operators judge ERP quality visually first · **Therefore** mission prioritizes consistency and inspectability |

## Definition

**shadcn/studio Presentation is:** the permanent Design-domain **frontend manufacturing system** for operator visual truth — governing which composed patterns may ship, how relational inventory scales across modules, how raw vendor blocks become accepted production UI, and how metadata contracts drive repeatable surfaces without per-module redesign.

**Describe:** governed production chain · relational presentation inventory · stabilization-first pipeline · ACPA acceptance · metadata-driven surface composition · theme surface binding

**Do not describe:** npm packages · MCP servers · CSS file paths · App Router routes · Storybook config · gate command strings

**What shadcn/studio Presentation is not:** business meaning authority, permission evaluation, ledger posting, metadata schema design, or tenant provisioning execution.

## Success (capability gain)

When fully realized, Afenda gains **one inspectable frontend production line** where any operator surface traces through relational inventory layers to an **Acceptance Record**, an active theme surface, and optional metadata binding — without dual-stack debugging, ungoverned Tailwind forks, or raw MCP blocks wired directly to routes.

| Source | Reasoning |
| --- | --- |
| Platform NS §4 visual-truth row `[T1]` | **Because** platform declares visual truth as authority surface · **Therefore** success is singular ownership |
| ADR-0027 consequences `[T0]` ✓ | **Because** reset traded short-term feature UI for long-term determinism · **Therefore** success includes smaller, provable presentation surface |

---

# 3. Enterprise Vocabulary

Business meanings — canonical input for Enterprise Knowledge promotion. Do not invent competing labels in PAS without amending this section.

| Term | Business meaning | Not confused with | Source (✓) | PAS-004 atom |
| --- | --- | --- | --- | --- |
| **Operator surface** | Any screen, panel, dialog, or persistent chrome an ERP user interacts with to perform work | API endpoint or database table | Platform ERP UX (T1) | `planned` |
| **Theme preset** | Named published bundle of visual tokens (color, density, radius, typography, motion) consumed by blocks | Functional currency or locale setting | Theme surface practice (T3) ✓ | `planned` |
| **Presentation primitive** | Base interactive control with accessibility semantics (button, input, table shell) | Domain entity or API resource | shadcn primitive layer (T5) | `planned` |
| **Primitive variant** | Visual and density expression of a primitive without changing its accessibility role | Business workflow variant | Design-system variants (T3) ✓ | `planned` |
| **Presentation block** | Composed reusable ERP pattern (dashboard card, settings section, datatable) — inventory unit | Business workflow step | ADR-0017 MCP blocks (T0) ✓ | `planned` |
| **Block slot** | Named layout region inside a block where content, actions, or metadata-bound widgets attach | Database column | Compositional UI pattern (T3) ✓ | `planned` |
| **Block data contract** | Serializable description of data a block expects at boundaries (fields, columns, actions) | Database schema or ORM model | PAS-006 serializable rules (T5) | `planned` |
| **Metadata binding** | Mapping from metadata field definitions to block slots and render behavior | Permission evaluation outcome | Metadata-driven UI (T1) | `planned` |
| **Surface template** | Screen-level composition of one or more accepted blocks and slots for a workflow class | Single route implementation | App Shell pattern (T3) ✓ | `planned` |
| **Presentation inventory** | Relational catalog of presets, primitives, variants, blocks, slots, contracts, templates, and acceptance records | Feature backlog | ADR-0027 sole chain (T0) ✓ | `planned` |
| **Acceptance record** | Documented proof that a block met stabilization, ACPA, and lifecycle gates before production wiring | Informal code review | §3.7 acceptance criteria (T1) | `planned` |
| **ACPA** | Afenda Contrast and Presentation Accessibility — governed operator-surface profile (contrast, focus, motion, chart/KPI visualization semantics) stricter than generic WCAG spot-checks | WCAG AA alone | Afenda token profile (T5) ✓ | `planned` |
| **Authorization-adjacent surface** | Sign-in, MFA, session expiry, access-denied, and permission-denial operator flows | Authorization policy evaluation | Identity UX (T3) ✓ | `planned` |
| **Surface acceptance** | Lifecycle transition backed by Acceptance Record — block may wire to ERP | Code review approval alone | §3.7 · §8.1 (T1) | `planned` |
| **Stabilization-first pipeline** | Rule that stock blocks normalize, prove behavior/a11y, bind theme, bind metadata, and accept before customization | Design-then-code ad hoc | §3.5 (T1) | `planned` |
| **Block lab** | Storybook environment where individual presentation blocks render for ACPA verification before ERP routes adopt them | Route lab · production tenant sandbox | P06-012 Delivered · `apps/storybook` :6006 (T5) | `planned` |
| **Route lab** | Developer sandbox where full operator chrome and multi-block screens prototype Afenda page law before ERP spine wiring | Block lab (single-block only) · production ERP | ADR-0039 · P06-013 docs Delivered · P06-014+ app Planned · `apps/developer` :3002 (T5) | `planned` |
| **Design delivery acceleration** | Vendor MCP-assisted block generation into inventory intake — not into app folders | Ungoverned copy-paste | ADR-0017 (T0) ✓ | `planned` |

## 3.1 Relational presentation inventory

Scalable ERP UI requires **relational structure**, not a flat block list:

```text
Theme Preset
        │ owns visual tokens
        ▼
Presentation Primitive
        │ owns base behavior + accessibility semantics
        ▼
Primitive Variant
        │ owns visual meaning (density · emphasis)
        ▼
Presentation Block
        │ owns composed reusable pattern
        ▼
Block Slot
        │ owns layout positions + replaceable regions
        ▼
Block Data Contract
        │ owns serializable data expectations
        ▼
Metadata Binding (where applicable)
        │ owns field-to-slot mapping
        ▼
Surface Template
        │ owns screen-level composition
        ▼
Operator Surface
        │ owns route/workflow usage
        ▼
Acceptance Record
        │ proves QA/a11y/governance before production
```

| Inventory layer | Owns (business) | Never owns |
| --- | --- | --- |
| **Theme preset** | Visual tokens · density · motion preference dimensions | Business labels or permission rules |
| **Primitive** | Role, keyboard semantics, focus behavior | Domain validation logic |
| **Variant** | Visual expression of primitive | New accessibility role |
| **Block** | Composed pattern + slot map | Posting or approval decisions |
| **Slot** | Replaceable regions | Arbitrary app-local JSX forks |
| **Block data contract** | Serializable field/column/action shape | Database persistence |
| **Metadata binding** | Display mapping from metadata definitions | Metadata schema authority |
| **Surface template** | Screen composition recipe | Workflow orchestration |
| **Operator surface** | Production route/workflow attachment | Parallel primitive stack |
| **Acceptance record** | Evidence of stabilization and ACPA (or WCAG AA for auth-adjacent) | Informal team memory |

**Rule:** Operator surfaces compose upward through this chain — they do not skip to raw vendor blocks.

## 3.2 Visual composition chain (business view)

```text
Theme preset published
        │
        ▼
Tailwind utility layer (token-boosted — no primitive redefinition)
        │
        ▼
Presentation primitive layer (shadcn)
        │
        ▼
Block renders in presentation lab
        │
        ▼
Acceptance record created
        │
        ▼
Operator surface wired in ERP
```

**Rule:** Order matters — theme before utilities before primitives. Tailwind may **enhance** accepted theme surfaces; it must not redefine primitive meaning, accessibility semantics, or block structure (I8).

## 3.3 Governed frontend production chain

shadcn/studio Presentation is not visual decoration. It is Afenda’s **governed frontend manufacturing system** for operator surfaces.

Every reusable ERP surface pattern must move through:

```text
Stock shadcn/studio block imported
        │
        ▼
Structural normalization
        │
        ▼
Primitive and slot stabilization
        │
        ▼
Accessibility and interaction verification (ACPA · WCAG AA if auth-adjacent)
        │
        ▼
Tailwind theme-surface binding
        │
        ▼
Metadata contract binding (where applicable)
        │
        ▼
Presentation inventory acceptance
        │
        ▼
ERP operator surface wiring
        │
        ▼
Customization under accepted boundaries
```

**Rule:** Customization is forbidden before stabilization. Afenda first proves block structure, slots, accessibility behavior, responsive states, empty/loading/error/forbidden states, and metadata compatibility. Only after acceptance may ERP-specific customization occur.

**Reasoning:** Because vendor-generated blocks accelerate delivery but do not automatically provide enterprise consistency, accessibility, metadata compatibility, or maintainability, Afenda treats shadcn/studio output as **raw material entering a production chain** — not as production-ready application UI.

## 3.4 Stabilization-first pipeline stages

| Stage | Business activity | Exit criterion (business) |
| --- | --- | --- |
| **1 — Import** | Stock shadcn/studio or manual block enters inventory intake | Block listed as Imported |
| **2 — Stabilize** | Behavior, keyboard flow, focus order, responsive and state surfaces verified | Stabilized lifecycle state |
| **3 — Normalize** | Structure, slots, exports, naming aligned to Afenda inventory rules | Normalized lifecycle state |
| **4 — Theme-bind** | Block consumes theme preset and Tailwind token rules without local drift | Theme-bound lifecycle state |
| **5 — Metadata-bind** | Block renders from metadata contracts where surface class requires it | Metadata-bound lifecycle state |
| **6 — Accept** | Acceptance Record created; block eligible for ERP wiring | Accepted lifecycle state |
| **7 — Customize** | ERP-specific variation within accepted boundaries | Customized lifecycle state (optional) |

**Principle:** Afenda does not customize unstable blocks. Afenda stabilizes stock shadcn/studio blocks first, then applies theme, metadata, and ERP-specific composition after acceptance.

## 3.5 Metadata-driven surface composition

Metadata-driven UI is a **core scalability path** — how HRM, CRM, Inventory, Accounting, System Admin, and future modules scale without hand-building every screen.

Metadata describes (meaning and display intent — schema authority lives outside this domain):

- field label and help text (via Enterprise Knowledge representations)
- field type and display density
- required/optional and validation message presentation
- permission visibility hints (render only — evaluation elsewhere)
- workflow state presentation
- table column behavior
- empty, loading, error, and forbidden states
- action availability presentation

Presentation blocks render:

- forms · tables · cards · filters · dashboard panels · approval panels · settings sections

**Composition chain:**

```text
Metadata contract
        │
        ▼
Surface template (accepted blocks + slots)
        │
        ▼
Operator surface
```

**Rule:** Prefer **Metadata contract → Surface template → Operator surface** over per-module manual UI rebuilds. Route-local primitive forks are forbidden unless inventory amendment records the exception.

## 3.6 Surface acceptance criteria (lifecycle gates)

A block **cannot** transition to **Accepted** unless all applicable rows pass. Implementation gates live in PAS-006; these are **business lifecycle conditions**.

| # | Criterion | Applies when |
| --- | --- | --- |
| 1 | Presentation lab story or equivalent lab proof exists | Always |
| 2 | Keyboard navigation and focus order verified | Always |
| 3 | Screen reader labels and roles verified | Always |
| 4 | **ACPA** contrast profile satisfied (body, muted, accent, chart/KPI semantics) | All operator surfaces |
| 5 | Responsive breakpoints and density modes verified | Always |
| 6 | Empty, loading, error, and forbidden states verified | Always |
| 7 | No embedded business logic or permission evaluation | Always |
| 8 | No route-local primitive fork bypassing inventory | Always |
| 9 | Metadata contract binding verified | Metadata-capable block classes |
| 10 | **WCAG 2.2 AA** floor verified in addition to ACPA | Authorization-adjacent surfaces only |

**ACPA vs WCAG AA split:**

| Profile | Scope | Business reason |
| --- | --- | --- |
| **ACPA** (primary) | All accepted ERP operator blocks — dashboards, admin, LoB lists/forms, settings | Dense ERP UI needs governed contrast, visualization, focus, and motion semantics beyond spot checks |
| **WCAG 2.2 AA** (mandatory floor) | Sign-in, MFA, recovery, session expiry, access denied, security review surfaces | Authorization-adjacent flows carry highest compliance and exclusion risk |

**Rule:** ACPA does not replace WCAG AA on Authorization-adjacent surfaces — both apply there. Elsewhere, ACPA is the governing acceptance profile.

# 4. Domain Capability Model

Permanent business capabilities (EFR). Each row maps to Blueprint §4 in §13 — not to packages or PAS here.

| Capability | Tier | Maturity target | EFR summary | Source (✓) | Reasoning (Because → Therefore) | Review by |
| --- | --- | --- | --- | --- | --- | --- |
| **Relational presentation inventory** | Core | Production | Presets, primitives, variants, blocks, slots, contracts, templates, acceptance records | ADR-0027 (T0) ✓ | **Because** flat block lists do not scale LoB modules · **Therefore** inventory is relational | Production |
| **Stabilization-first block pipeline** | Core | Production | Stock blocks normalize, ACPA-verify, theme-bind, metadata-bind, accept before customize | ADR-0017 · ADR-0027 · ACPA (T5) ✓ | **Because** raw generated blocks are not enterprise-ready · **Therefore** stabilization precedes customization | Production |
| **Governed frontend production chain** | Core | Production | Import → normalize → stabilize → theme → metadata → accept → wire → customize | ADR-0027 (T0) ✓ | **Because** speed without chain creates forks · **Therefore** manufacturing doctrine is constitutional | Production |
| **ACPA surface acceptance** | Core | Production | Operator blocks prove ACPA before Accepted state | ACPA profile (T5) ✓ | **Because** dense ERP UI needs governed contrast and viz semantics · **Therefore** ACPA is primary profile | Production |
| **Authorization-adjacent WCAG AA floor** | Core | Production | Auth flows prove WCAG 2.2 AA in addition to ACPA | WCAG 2.2 (T3) ✓ | **Because** sign-in/MFA exclusion is unacceptable · **Therefore** AA is mandatory on auth surfaces | Production |
| **Theme surface governance** | Core | Production | Theme presets compose deterministically; Tailwind boosts tokens without primitive drift | Design-system (T3) ✓ | **Because** token drift breaks multi-module UX · **Therefore** one theme owner | Production |
| **Metadata-driven surface composition** | Core | Production | Metadata contracts drive templates — not per-module manual rebuilds | Platform metadata intent (T1) | **Because** ERP module count scales faster than design headcount · **Therefore** metadata binding is core | Production |
| **Visual composition chain** | Core | Production | Theme → utilities → primitives order fixed and inspectable | PAS-006 doctrine (T5) | **Because** CSS order bugs are silent · **Therefore** composition is explicit | Production |
| **Design delivery acceleration** | Advanced | Production | MCP installs into inventory intake — never app tree | ADR-0017 (T0) ✓ | **Because** ERP needs vendor speed · **Therefore** acceleration feeds production chain | Production |
| **Serializable boundary contracts** | Advanced | Production | Presets, registry entries, block data contracts JSON-safe | PAS-006 (T5) | **Because** agents and metadata tooling need wire-safe data · **Therefore** boundaries stay serializable | Production |
| **Legacy stack retirement** | Core | Enterprise | Dual-stack presentation debugging forbidden | ADR-0027 (T0) ✓ | **Because** retired stacks recreate drift · **Therefore** retirement is permanent | Enterprise |

**Capability maturity key:** Idea · MVP · Production · Enterprise

---

# 5. Domain Principles

| # | Principle | Source (✓) | Reasoning (Because → Therefore) |
| --- | --- | --- | --- |
| P1 | **One visual owner** | ADR-0027 (T0) ✓ | **Because** dual stacks duplicate enforcement · **Therefore** ERP has one presentation chain |
| P2 | **Presentation renders; domains decide** | LAW K6 · Kernel NS (T1) ✓ | **Because** UI must not embed business meaning · **Therefore** labels defer to Enterprise Knowledge |
| P3 | **Composition order is constitutional** | PAS-006 CSS doctrine (T5) | **Because** CSS cascade is implicit logic · **Therefore** visual composition chain is explicit |
| P4 | **Accept before wire** | ACPA · §3.7 (T1) | **Because** retro-fitting a11y is expensive · **Therefore** Acceptance Record precedes ERP routes |
| P5 | **Inventory inspectability** | ADR-0027 (T0) ✓ | **Because** agents and auditors need truth · **Therefore** relational inventory is first-class |
| P6 | **Acceleration under governance** | ADR-0017 (T0) ✓ | **Because** MCP speed without inventory creates forks · **Therefore** vendor installs land in intake only |
| P7 | **ACPA is the operator acceptance profile** | ACPA profile (T5) ✓ | **Because** ERP density breaks generic contrast · **Therefore** ACPA governs block acceptance |
| P8 | **No business logic in presentation** | Platform layering (T1) ✓ | **Because** posting rules in UI create untestable coupling · **Therefore** presentation stays visual |
| P9 | **Stabilize before customize** | ADR-0017 · ADR-0027 · ACPA · PAS-006 | **Because** custom styling on unstable blocks creates inaccessible forks · **Therefore** stock blocks normalize, test, theme-bind, metadata-bind, and accept before ERP customization |
| P10 | **Metadata scales surfaces** | Platform metadata intent (T1) | **Because** module count exceeds manual UI capacity · **Therefore** metadata contracts drive templates before route hardcoding |
| P11 | **WCAG AA on auth-adjacent only** | WCAG 2.2 (T3) ✓ | **Because** Authorization flows carry highest exclusion risk · **Therefore** WCAG AA is mandatory floor there; ACPA governs elsewhere |

## 5.1 Domain invariants

| # | Invariant |
| --- | --- |
| I1 | No production operator surface imports from a retired presentation stack without new ADR. |
| I2 | Every production-wired block has an **Acceptance Record** or explicit grandfather ADR. |
| I3 | Theme surface changes propagate through the composition chain — not ad-hoc per-route CSS overrides for primitives. |
| I4 | Presentation inventory entries must be discoverable without reading application route source. |
| I5 | Business meaning on operator surfaces cites Enterprise Knowledge — presentation does not invent authoritative labels. |
| I6 | No shadcn/studio block may receive ERP-specific customization before structural, ACPA, responsive, and theme-surface stabilization. |
| I7 | Metadata-capable surfaces must bind through metadata contracts before route-specific hardcoding is allowed. |
| I8 | Tailwind utility usage may enhance accepted theme surfaces, but must not redefine primitive meaning, accessibility semantics, or block structure. |
| I9 | Authorization-adjacent surfaces must satisfy WCAG 2.2 AA floor in addition to applicable ACPA criteria. |

---

# 6. Enterprise Outcomes and KPIs

## 6.1 Outcome statements

| Outcome | Business description | Source (✓) | Reasoning |
| --- | --- | --- | --- |
| **Manufacturing inspectability** | Any agent traces operator surface → template → block → Acceptance Record | ADR-0027 (T0) ✓ | **Because** production chain must be auditable · **Therefore** relational inventory is outcome |
| **ACPA conformance** | Accepted blocks meet ACPA profile before production wiring | ACPA (T5) ✓ | **Because** ERP density needs governed contrast/viz · **Therefore** ACPA is measured outcome |
| **Auth surface inclusion** | Authorization-adjacent flows meet WCAG 2.2 AA floor | WCAG 2.2 (T3) ✓ | **Because** auth exclusion is catastrophic · **Therefore** AA is explicit outcome |
| **Metadata scalability** | Increasing share of LoB surfaces compose from metadata contracts | Platform scale (T1) | **Because** manual UI does not scale modules · **Therefore** metadata composition is outcome |
| **Reset stability** | No regression to dual-stack presentation debugging | ADR-0027 (T0) ✓ | **Because** reset cost was high · **Therefore** stability is measured |

## 6.2 Success metrics (permanent KPI targets)

| KPI | Target | Measurement context | Source (✓) | Review by |
| --- | --- | --- | --- | --- |
| **Blocks without Acceptance Record** | 0 in production (post-stabilization) | Inventory vs ERP import audit | §8.1 · §3.7 (T1) | Production |
| **ACPA regressions on accepted blocks** | 0 open at release | Presentation lab + contract tests | ACPA (T5) ✓ | Production |
| **Auth-adjacent surfaces below WCAG AA** | 0 at release | Authorization surface audit | WCAG 2.2 (T3) ✓ | Enterprise |
| **Metadata-capable surfaces hardcoded without contract** | 0 (post-core rollout) | Template vs route audit | §3.5 · I7 (T1) | Production |
| **Theme composition drift** | 0 unauthorized globals chains | CSS composition review | PAS-006 (T5) | Production |
| **Dual-stack incidents** | 0 in production | Disposition conformance | ADR-0027 (T0) ✓ | Enterprise |

---

# 7. Business Events

Events the presentation domain **names** — not React lifecycle hooks or queue topics.

| Event (business vocabulary) | Meaning | Typical trigger | Related vocabulary (§3) |
| --- | --- | --- | --- |
| **Block imported** | Stock shadcn/studio block entered inventory intake | Vendor install | Stabilization-first pipeline |
| **Block normalized** | Structure, slots, exports aligned to inventory rules | Structural review | Block slot · Block data contract |
| **Block stabilized** | Behavior, keyboard, responsive, and state surfaces verified | QA verification | Presentation lab |
| **Block theme-bound** | Block consumes theme preset without token drift | Theme review | Theme preset |
| **Block metadata-bound** | Block renders from metadata contract | Metadata review | Metadata binding |
| **Acceptance record created** | Block met §3.7 criteria — may transition to Accepted | ACPA / WCAG AA verification | Acceptance record |
| **Block rejected** | Block failed acceptance — must not wire to production | Failed §3.7 criterion | Surface acceptance |
| **Block accepted** | Block passed acceptance — eligible for ERP wiring | Acceptance record | Presentation inventory |
| **Operator surface wired** | ERP route adopts accepted block or surface template | Feature delivery | Operator surface |
| **Block customized** | ERP-specific variation applied within accepted boundaries | Surface-specific need | Stabilization-first pipeline stage 7 |
| **Theme preset published** | New theme surface available for composition chain | Design steward approval | Theme preset |
| **Inventory parity gap detected** | Registry row missing lab proof, contract, or acceptance | Governance audit | Relational presentation inventory |

Dispatch, routing, and HTTP transport belong outside this domain.

---

# 8. Entity Lifecycles

Business-state progression — not React component state or database enums.

### 8.1 Presentation block

```text
Imported → Normalized → Stabilized → Theme-bound → Metadata-bound → Accepted → Production wired → Customized → Deprecated → Retired
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Imported | Stock shadcn/studio or manual block enters inventory intake | Vendor generation or internal creation | Normalized |
| Normalized | Structure, slots, exports, naming aligned to inventory rules | Structural review | Stabilized |
| Stabilized | Primitive behavior, keyboard flow, focus order, responsive behavior, empty/loading/error/forbidden states verified | QA and ACPA verification (WCAG AA if auth-adjacent) | Theme-bound |
| Theme-bound | Block consumes theme preset and Tailwind rules without local token drift | Theme review | Metadata-bound |
| Metadata-bound | Block renders from metadata contracts where applicable; N/A blocks skip with recorded waiver | Metadata binding review | Accepted |
| Accepted | Acceptance Record created — block may wire to ERP | All applicable §3.7 criteria pass | Production wired |
| Production wired | Used on live operator surface | Route or template adoption | Customized or Deprecated |
| Customized | ERP-specific variation within accepted boundaries | Surface-specific requirement | Deprecated |
| Deprecated | New work must not adopt; existing use grandfathered | Superseding block or ADR | Retired |
| Retired | Removed from inventory and exports | Migration complete | — |

**Hard gate:** Transition to **Accepted** requires **Acceptance Record** satisfying §3.7. No lifecycle state may skip **Stabilized** or **Theme-bound** to reach Accepted.

### 8.2 Acceptance record

```text
Criteria checklist opened → Lab proof attached → ACPA verified → WCAG AA verified (if auth-adjacent) → Metadata binding verified (if applicable) → Record sealed → Block may become Accepted
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Open | Acceptance review started for block at Metadata-bound or later | Stabilization complete | Evidence attached |
| Evidence attached | Lab story, keyboard, focus, responsive, state proofs linked | Presentation lab | Profile verified |
| Profile verified | ACPA satisfied; WCAG AA satisfied when auth-adjacent | Verification complete | Sealed |
| Sealed | Immutable acceptance evidence — block may enter Accepted | Steward attestation | — |

### 8.3 Theme preset

```text
Proposed → Published → Active → Superseded
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Proposed | Theme draft under review | Design change request | Published |
| Published | Available in theme surface catalog | Steward approval | Active |
| Active | Default or selectable preset in production | ERP theme selection | Superseded |
| Superseded | Historical — new work uses successor preset | New publication | — |

### 8.4 Operator surface (business view)

```text
Specified → Surface template selected → Accepted blocks bound → Metadata contract bound (if applicable) → Operator validated → In production use
```

| Source (✓) | Reasoning |
| --- | --- |
| ADR-0027 delivery chain (T0) ✓ | **Because** ERP rebuilds feature UI block-by-block · **Therefore** lifecycle preserves acceptance gate |

---

# 9. Domain Boundary

## 9.1 This domain owns (business)

- Governed **frontend manufacturing system** — import through acceptance (§3.3)
- **Relational presentation inventory** — presets through Acceptance Records (§3.1)
- **Stabilization-first pipeline** — customize only after accept (§3.4 · P9)
- **ACPA** as primary operator-surface acceptance profile (§3.6)
- **WCAG 2.2 AA floor** on Authorization-adjacent surfaces (§3.6 · P11)
- **Metadata-driven surface composition** as core scalability path (§3.5 · P10)
- Theme preset publication and Tailwind token-boost strategy within composition chain
- Surface template composition for repeatable LoB screens

## 9.2 This domain never owns (business)

> Reference **domains**, not package names.

| Exclusion | Owning domain / rationale | Source (✓) | Reasoning |
| --- | --- | --- | --- |
| Accepted business term meaning | Enterprise Knowledge | LAW K6 (T0) ✓ | **Because** meaning ≠ rendering · **Therefore** labels defer to Knowledge |
| Cross-package wire vocabulary | Platform Kernel | Kernel NS (T1) ✓ | **Because** shape ≠ surface · **Therefore** kernel stays vocabulary-only |
| Permission decisions | Authorization | Platform NS (T1) ✓ | **Because** UI hides ≠ authorization · **Therefore** evaluation stays outside presentation |
| Business workflow outcomes | Accounting · Inventory · HRM · CRM runtimes | Domain LoB NS | **Because** posting is not painting · **Therefore** workflows stay in domain runtimes |
| Metadata schema authority | Metadata domain | Platform NS (T1) | **Because** schema ≠ rendering · **Therefore** presentation binds metadata — does not own schema |
| Session and identity proof | Identity & Access | Platform NS (T1) ✓ | **Because** login state is not a block · **Therefore** auth stays Identity domain (presentation supplies WCAG AA-verified surfaces only) |
| Correlation and audit transport | Observability · Execution | Platform NS (T1) | **Because** tracing is not CSS · **Therefore** instrumentation stays platform ops |

## 9.3 Cross-domain dependencies (business domains only)

| Depends on (domain) | Dependency type | Business reason | Source (✓) |
| --- | --- | --- | --- |
| **Platform constitution** | Governance | ADR-0027 declares sole presentation chain | ADR-0027 (T0) ✓ |
| **Enterprise Knowledge** | Label meaning | Operator labels cite accepted atoms — not invented in blocks | LAW K6 (T0) ✓ |
| **Architecture Authority** | Structure | Disposition and dependency registries enforce single owner | ADR-0026 (T0) ✓ |

| Provides to (domain) | What flows | Related §7 event |
| --- | --- | --- |
| **Application delivery (ERP)** | Accepted blocks · surface templates · theme presets · Acceptance Records | Operator surface wired |
| **All ERP business domains** | Metadata-driven templates scaling LoB UI | Block metadata-bound |
| **Authorization (adjacent UX)** | WCAG AA-verified sign-in/MFA/denial surfaces | Acceptance record created |
| **Agent orchestration** | Inspectable production chain for vibe-coding | Block accepted |

Package and API mapping belongs in [Presentation Blueprint](../BLUEPRINT/shadcn-studio-presentation-blueprint.md) §5.

## 9.4 Orthogonal platform questions

```text
Platform Kernel           → What does the platform say? (wire shape)
Enterprise Knowledge      → What does the enterprise mean? (accepted truth)
Architecture Authority      → What is allowed? (structure · disposition)
shadcn/studio Presentation  → How do operators see? (governed visual manufacturing)
```

**Rule:** Presentation must not absorb kernel, knowledge, or authorization questions.

---

# 10. Enterprise Risks

| Risk | Business impact | Mitigation principle (business) | Source (✓) | Blueprint/PAS handoff |
| --- | --- | --- | --- | --- |
| **Dual-stack presentation** | Duplicate debugging · inconsistent UX | One visual owner · P1 · I1 | ADR-0027 (T0) ✓ | Blueprint §8 |
| **Theme drift** | Modules look like different products | Composition chain · P3 · I3 · I8 | Design-system (T5) | PAS-006 CSS |
| **Premature customization** | Inaccessible untraceable forks | Stabilize before customize · P9 · I6 | ADR-0017 · ACPA (T5) | §8.1 lifecycle |
| **ACPA regression** | Dense UI unreadable · chart misread | ACPA profile on acceptance · P7 | ACPA (T5) ✓ | §3.7 criteria |
| **Auth surface exclusion** | Legal/security exposure on sign-in/MFA | WCAG AA floor · P11 · I9 | WCAG 2.2 (T3) ✓ | Auth block class |
| **Metadata hardcoding** | LoB UI does not scale | Metadata binds first · P10 · I7 | Platform scale (T1) | §3.5 |
| **Ungoverned Tailwind forks** | Primitive semantics drift | Tailwind boosts theme only · I8 | Composition chain (T5) | PAS-006 |
| **Ungoverned MCP forks** | Blocks bypass inventory | Acceleration under governance · P6 | ADR-0017 (T0) ✓ | Production chain §3.3 |
| **Business logic in UI** | Untestable coupling | Presentation renders only · P8 | Platform layering (T1) | Blueprint §4.2 |
| **Inventory opacity** | Agents rebuild blocks | Relational inventory · P5 · I4 | ADR-0027 (T0) ✓ | §3.1 |
| **Meaning invented in UI** | Glossary drift | Defer to Knowledge · P2 · I5 | LAW K6 (T0) ✓ | Metadata labels |

---

# 11. Quality Attributes

| Attribute | Domain expectation | Why it matters | Target (business language) | Source (✓) |
| --- | --- | --- | --- | --- |
| **ACPA conformance** | Primary profile for operator blocks — contrast, focus, motion, chart/KPI viz | Dense ERP readability | 0 ACPA regressions on accepted blocks | ACPA (T5) ✓ |
| **Auth accessibility** | WCAG 2.2 AA floor on Authorization-adjacent surfaces | Highest exclusion risk | 0 auth surfaces below AA at release | WCAG 2.2 (T3) ✓ |
| **Manufacturing traceability** | Every wired block traces to Acceptance Record | Agent-safe delivery | 100% production blocks with sealed record | §6 KPI |
| **Metadata scalability** | LoB surfaces compose from contracts | Module growth | Increasing metadata-bound template share | §3.5 |
| **Maintainability** | Theme via composition chain; Tailwind token-boost only | No primitive drift | Single composition entry · I8 enforced | PAS-006 (T5) |
| **Delivery velocity** | MCP into inventory intake | Rebuild speed | 0 app-folder MCP installs | ADR-0017 (T0) ✓ |

**Handoff:** Blueprint §4 `Reasoning` may cite §11 + §10 risk. PAS implements measurable gates.

---

# 12. Domain Evidence

## 12.1 Evidence Register

| ID | Source | Tier | Class | What it justifies | Link |
| --- | --- | --- | --- | --- | --- |
| E1 | ADR-0027 | T0 | ✓ | Sole presentation chain · retired stacks | [`ADR-0027`](../adr/ADR-0027-frontend-presentation-reset.md) |
| E2 | ADR-0017 | T0 | ✓ | MCP vendor · design acceleration | [`ADR-0017`](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) |
| E3 | ADR-0026 | T0 | ✓ | North Star → Blueprint hierarchy | [`ADR-0026`](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| E4 | Platform NS §4 | T1 | ✓ | Visual truth at platform scope | [Platform NS](../architecture/afenda-platform-north-star.md) |
| E5 | LAW K6 | T0 | ✓ | Shape ≠ meaning · P2 · I5 | [Knowledge Constitutional Laws](../CONSTITUTION/knowledge-constitutional-laws.md) |
| E6 | WCAG 2.2 | T3 | ✓ | Authorization-adjacent AA floor · P11 · I9 | W3C WCAG |
| E7 | Afenda ACPA profile | T5 | ✓ | Primary operator acceptance · P7 · §3.7 | Afenda token / contrast profile |
| E8 | PAS-006 doctrine | T5 | ✓ | Composition · serializable contracts | [PAS-006](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) |
| E9 | Enterprise ERP UX patterns | T3 | ✓ | Unified operator experience | SAP Fiori · Oracle Redwood (industry) |

## 12.2 Decision Reasoning Log

| Decision ID | Claim | Because | Source (E#) | Therefore | Review by |
| --- | --- | --- | --- | --- | --- |
| D1 | One presentation owner post-reset | Parallel stacks duplicated enforcement | E1 | Blueprint declares single Design box | Enterprise |
| D2 | MCP installs into inventory — not app tree | Ungoverned forks bypass acceptance | E2, E1 | Presentation lab precedes ERP wire | Production |
| D3 | Presentation never owns business meaning | Types and labels differ | E5 | ERP wiring cites Knowledge atoms | Production |
| D4 | Metadata composition is core scalability | Module count exceeds manual UI | E4 | §3.5 · P10 · I7 | Production |
| D5 | ACPA primary; WCAG AA on auth-adjacent | Dense UI vs auth exclusion risk | E7, E6 | §3.7 split profile | Production |
| D6 | Stabilize before customize | Raw MCP blocks fail enterprise bar | E2, E7 | §3.4 · §8.1 · P9 · I6 | Production |
| D7 | Relational inventory required | Flat lists do not scale LoB | E1 | §3.1 inventory model | Enterprise |
| D8 | Acceptance Record is hard gate | Principles alone are not executable | E7, E6 | §3.7 · §8.2 | Enterprise |

## 12.3 Evidence lifecycle obligations

| Document maturity | Required evidence action |
| --- | --- |
| **Idea → MVP** | §1 Philosophy + §4 core EFR have Source; §12.1 started |
| **MVP → Production** | All §4–§5 rows ✓ · §3 core terms · §12.2 complete |
| **Production → Enterprise** | Full register · §7 events · §8 lifecycles · §16 EAC pass |
| **Any amendment** | Update Source, Reasoning, `Last reviewed`, Decision log |

---

# 13. Capability → Blueprint Traceability

| Capability (§4) | Maturity tier | Blueprint box (see Blueprint §4) |
| --- | --- | --- |
| Relational presentation inventory | Core | shadcn/studio Presentation |
| Stabilization-first block pipeline | Core | shadcn/studio Presentation |
| Governed frontend production chain | Core | shadcn/studio Presentation |
| ACPA surface acceptance | Core | shadcn/studio Presentation |
| Authorization-adjacent WCAG AA floor | Core | shadcn/studio Presentation |
| Theme surface governance | Core | shadcn/studio Presentation |
| Metadata-driven surface composition | Core | shadcn/studio Presentation |
| Visual composition chain | Core | shadcn/studio Presentation |
| Design delivery acceleration | Advanced | shadcn/studio Presentation |
| Serializable boundary contracts | Advanced | shadcn/studio Presentation |
| Legacy stack retirement | Core | shadcn/studio Presentation (+ Blueprint §8) |

**When a capability needs a new box:** amend §4 → add §13 row → add Blueprint §4 row → satisfy Blueprint §7 → author PAS.

**Agent execution:** [Presentation Blueprint §13](../BLUEPRINT/shadcn-studio-presentation-blueprint.md) · [Platform North Star §7–§9](../architecture/afenda-platform-north-star.md)

---

# 14. Domain Governance

## 14.1 Governance model

| Model | Definition |
| --- | --- |
| **Ownership** | Design / Presentation authority steward |
| **Change model** | Amend when operator UX doctrine or capability model changes — not when one block ships |
| **Approval model** | Domain owner reviews §12 Source + Reasoning deltas |
| **Acceptance model** | See §16 EAC |
| **Evidence standard** | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| **Last reviewed** | 2026-06-29 (frontend production-chain extension) |

## 14.2 Domain authority model

| Level | Owns |
| --- | --- |
| **Domain North Star** | §1–§12 business architecture |
| **Architecture Blueprint** | Packages, layers, why separate, PAS inventory, consumers |
| **PAS** | Contracts, authority surfaces, slice catalog, gates |
| **Slice** | One implementation unit |
| **Code** | Implements the Slice |

## 14.3 Decomposition chain

```text
Presentation North Star §1–§12 (business architecture)
        ↓
Presentation Blueprint — packages, layers, PAS inventory
        ↓
PAS-006 — contracts, surfaces, gates
        ↓
Slice → Code
```

**Amendment rule:** Business meaning changes → this document first. Package boundaries → Blueprint first.

## 14.4 Domain business invariants

- One visual owner — no dual-stack presentation (P1 · I1 · D1)
- Stabilize before customize — no Accepted without Stabilized + Theme-bound (P9 · I6 · D6)
- ACPA governs operator blocks; WCAG AA governs Authorization-adjacent surfaces (P7 · P11 · D5)
- Acceptance Record is hard gate — not principles alone (D8 · §3.7 · §8.2)
- Metadata binds before route hardcoding (P10 · I7 · D4)

---

# 15. Domain Evolution

**May evolve here:** new §4 capabilities (e.g. tenant white-label theme) · §6 outcome targets · §7 events · vocabulary (§3)

**Must not evolve here:** runtime rules (PAS) · slice order · registry rows · MCP command sequences (SKILL)

**Long-term direction:**

- **Production:** relational inventory populated for skeleton ERP surfaces; Acceptance Records sealed under ACPA; auth-adjacent blocks under WCAG AA
- **Enterprise:** metadata-driven surface templates dominate LoB module delivery; zero production blocks without Acceptance Records
- **Enterprise:** tenant-scoped theme presets without forking composition chain or primitive semantics

---

# 16. Enterprise Acceptance Criteria (EAC)

| Criterion | Gate | Traces to |
| --- | --- | --- |
| §1 Philosophy immutable and cited ✓ | Manual review — domain owner | §1 · E1 |
| §2 Identity complete | Manual review | §2 |
| §3 Enterprise Vocabulary — core terms defined | Manual review + PAS-004 promotion plan | §3 |
| §4 EFR complete — Production+ rows ✓ | Evidence audit | §4 · §12 |
| §5 Principles cited | Manual review | §5 |
| §6 Outcomes + KPIs declared | Manual review | §6 |
| §7 Business Events listed | Manual review | §7 |
| §8 Entity Lifecycles — block + theme | Manual review | §8 |
| §9 Boundaries + cross-domain dependencies | Manual review | §9 |
| §10 Risks — Core capabilities mitigated | Manual review | §10 |
| §11 Quality attributes declared | Manual review | §11 |
| §12 Evidence Register + Decision log complete | Manual review | §12 |
| §13 maps every §4 capability to Blueprint box | Manual review + Blueprint exists | §13 |
| §1–§12 contain no package names or PAS IDs | [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) | Hygiene |
| Blueprint/PAS authorable without redefining domain | Manual review | Full §1–§12 |

---

# 17. Document Sync Obligations

| Change in this document | Then update |
| --- | --- |
| New §4 capability | §13 row · Blueprint §4 box |
| New §3 vocabulary term | PAS-004 atom promotion slice |
| New §7 event | Blueprint integration planning · PAS event surface |
| Boundary / dependency change (§9) | Blueprint §5 consumers |
| Risk or quality change (§10–§11) | Blueprint §4 Reasoning · PAS §0 |
| Business meaning stable; implementation only | Blueprint or PAS — **not** this document |

---

# 18. Required Reviews and References

## Before accepting this document

- [ ] §1–§12 complete; no package names or PAS IDs in §1–§12
- [ ] §13 traces every §4 capability to **shadcn/studio Presentation**
- [ ] No PAS inventory or gate commands in this file
- [ ] [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) passes
- [ ] [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) — EFR cited ✓

## Derived documents

**Produces:** [Presentation Blueprint](../BLUEPRINT/shadcn-studio-presentation-blueprint.md)

**Never produces:** PAS · slices · contracts · code

## References

| Document | Role |
| --- | --- |
| Platform North Star | [`afenda-platform-north-star.md`](../architecture/afenda-platform-north-star.md) |
| Presentation Blueprint | [`shadcn-studio-presentation-blueprint.md`](../BLUEPRINT/shadcn-studio-presentation-blueprint.md) |
| ADR-0027 | [`ADR-0027-frontend-presentation-reset.md`](../adr/ADR-0027-frontend-presentation-reset.md) |
| ADR-0017 | [`ADR-0017-shadcn-studio-ui-delivery-acceleration.md`](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) |
| North Star template | [`north-star-template.md`](../../.cursor/skills/kernel-authority/reference/north-star-template.md) |
| Boundary contract | [`doc-boundary-contract.md`](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) |
| using-afenda-skills | [`.cursor/skills/using-afenda-skills/SKILL.md`](../../.cursor/skills/using-afenda-skills/SKILL.md) |

---

# 19. Final Doctrine

**shadcn/studio Presentation covenant:** shadcn/studio gives Afenda speed; Afenda governance gives it enterprise quality. Raw vendor blocks are not production UI. They become production UI only after relational normalization, stabilization, **ACPA** verification (**WCAG 2.2 AA** on Authorization-adjacent surfaces), theme binding, metadata binding where applicable, and a sealed **Acceptance Record**. Customization is a privilege of accepted blocks — not a shortcut around the manufacturing chain.

§1–§12 define **what the governed frontend production system means in enterprise business architecture**.

§13 bridges to Blueprint — **box names only**.

PAS-006 and the shadcn-studio skill define **how to build and gate**.

If operator UX or manufacturing doctrine changes, amend §1–§12 — then Blueprint.

If packages, acceptance schemas, or MCP wiring change, amend Blueprint or PAS — **not** §1–§12 unless business meaning changed.

> **May belong here:** §1–§12 with Source + Reasoning · §12 Evidence · §13 capability→box · §14–§18 governance.

> **Belongs in Blueprint:** packages, layers, consumers, retired rows, PAS inventory.

> **Belongs in PAS-006:** boundary sentence, CSS rules, Acceptance Record wire schema, §13 gates.

> **Belongs in shadcn-studio SKILL:** MCP workflows, install cwd, toolbar commands.
