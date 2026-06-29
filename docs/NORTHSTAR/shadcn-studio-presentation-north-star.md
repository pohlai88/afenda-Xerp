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
| **Last reviewed** | 2026-06-29 |
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
| **Presentation block** | A reusable composed UI pattern (dashboard card, settings section, auth form) approved for ERP import | Business workflow step or domain entity | ADR-0017 MCP blocks (T0) ✓ | `planned` |
| **Theme surface** | The governed visual contract — color, density, radius, typography tokens — applied across operator surfaces | Functional currency or locale setting | Design-system practice (T3) ✓ | `planned` |
| **Presentation inventory** | The catalog of staged and accepted blocks and patterns — the inspectable owner of what may ship | Feature backlog or Jira epic list | ADR-0027 sole chain (T0) ✓ | `planned` |
| **Surface acceptance** | Recorded proof that a block meets consistency, accessibility, and composition rules before production wiring | Code review approval alone | WCAG + enterprise QA (T3) ✓ | `planned` |
| **Visual composition chain** | Ordered layering of theme surface, utility styling, and component primitives at ERP globals | Business process orchestration | PAS-006 CSS doctrine (T5) | `planned` |
| **Presentation lab** | Isolated environment where blocks render for verification before ERP routes adopt them | Production tenant sandbox | Storybook role (T5) | `planned` |
| **Dual-stack presentation** | Forbidden parallel UI pipelines (governed-ui + appshell + metadata-ui + css-authority) | A/B testing two themes | ADR-0027 retired stacks (T0) ✓ | `planned` |
| **Design delivery acceleration** | Vendor MCP-assisted block generation under Afenda inventory governance | Ungoverned copy-paste from design tools | ADR-0017 (T0) ✓ | `planned` |
| **Serializable presentation contract** | Theme preset or registry entry expressible as JSON-safe data at package boundaries | Runtime React component tree | PAS-006 public rules (T5) | `planned` |

## 3.1 Presentation hierarchy

Four layers — do not collapse:

```text
Theme surface              (visual tokens · density · brand)
        │
        ▼
Presentation primitives    (buttons · inputs · tables — stock shadcn layer)
        │
        ▼
Presentation block         (composed enterprise pattern — inventory unit)
        │
        ▼
Operator surface           (ERP route · workflow screen · error state)
```

**Rule:** Blocks import primitives and theme — operator surfaces import blocks. Business domains never fork primitives locally without inventory amendment.

## 3.2 Visual composition chain (business view)

```text
Theme surface published
        │
        ▼
Utility styling layer applied (Tailwind v4)
        │
        ▼
Component primitive layer applied (shadcn)
        │
        ▼
Block renders in presentation lab
        │
        ▼
Surface acceptance recorded
        │
        ▼
Operator surface wired in ERP
```

**Rule:** Order matters — theme before utilities before primitives. Reordering breaks operator consistency (§5 P3).

---

# 4. Domain Capability Model

Permanent business capabilities (EFR). Each row maps to Blueprint §4 in §13 — not to packages or PAS here.

| Capability | Tier | Maturity target | EFR summary | Source (✓) | Reasoning (Because → Therefore) | Review by |
| --- | --- | --- | --- | --- | --- | --- |
| **Unified presentation inventory** | Core | Production | One catalog owns staged and accepted blocks | ADR-0027 (T0) ✓ | **Because** parallel stacks hid ownership · **Therefore** inventory is constitutional | Production |
| **Theme surface governance** | Core | Production | Published theme presets compose deterministically at ERP globals | Design-system practice (T3) ✓ | **Because** token drift breaks multi-module UX · **Therefore** one theme surface owner | Production |
| **Visual composition chain** | Core | Production | Theme → utilities → primitives order is fixed and inspectable | PAS-006 CSS doctrine (T5) | **Because** CSS order bugs are silent · **Therefore** composition is a named capability | Production |
| **Surface acceptance before wiring** | Core | Production | Blocks prove in presentation lab before ERP routes adopt them | WCAG + QA (T3) ✓ | **Because** production is too late for first accessibility audit · **Therefore** lab acceptance is mandatory | Production |
| **Design delivery acceleration** | Advanced | Production | Vendor MCP installs into governed inventory — not ad-hoc app folders | ADR-0017 (T0) ✓ | **Because** ERP delivery speed requires vendor blocks · **Therefore** acceleration must feed inventory | Production |
| **Serializable boundary contracts** | Advanced | Production | Theme presets and registry entries are JSON-safe at boundaries | PAS-006 public rules (T5) | **Because** non-serializable contracts break agents and tooling · **Therefore** boundaries stay data, not runtime graphs | Production |
| **Legacy stack retirement** | Core | Enterprise | Dual-stack presentation debugging is forbidden post-reset | ADR-0027 (T0) ✓ | **Because** retired stacks recreate drift · **Therefore** retirement is a permanent capability | Enterprise |
| **Metadata workspace surfaces (greenfield)** | Advanced | MVP | Future metadata-driven UI rebuilds on this domain — not retired metadata-ui | ADR-0027 §5 (T0) ✓ | **Because** metadata UX will return · **Therefore** greenfield path is declared early | MVP |

**Capability maturity key:** Idea · MVP · Production · Enterprise

---

# 5. Domain Principles

| # | Principle | Source (✓) | Reasoning (Because → Therefore) |
| --- | --- | --- | --- |
| P1 | **One visual owner** | ADR-0027 (T0) ✓ | **Because** dual stacks duplicate enforcement · **Therefore** ERP has one presentation chain |
| P2 | **Presentation renders; domains decide** | LAW K6 · Kernel NS (T1) ✓ | **Because** UI must not embed business meaning · **Therefore** labels defer to Enterprise Knowledge |
| P3 | **Composition order is constitutional** | PAS-006 CSS doctrine (T5) | **Because** CSS cascade is implicit logic · **Therefore** visual composition chain is explicit |
| P4 | **Accept before wire** | WCAG (T3) ✓ | **Because** retro-fitting a11y is expensive · **Therefore** presentation lab precedes ERP routes |
| P5 | **Inventory inspectability** | ADR-0027 (T0) ✓ | **Because** agents and auditors need truth · **Therefore** block registry is a first-class artifact |
| P6 | **Acceleration under governance** | ADR-0017 (T0) ✓ | **Because** MCP speed without inventory creates forks · **Therefore** vendor installs land in presentation product only |
| P7 | **Accessibility is non-negotiable** | WCAG 2.x (T3) ✓ | **Because** ERP excludes operators when surfaces fail a11y · **Therefore** acceptance includes accessibility contract |
| P8 | **No business logic in presentation** | Platform layering (T1) ✓ | **Because** posting rules in UI create untestable coupling · **Therefore** presentation stays visual |

## 5.1 Domain invariants

| # | Invariant |
| --- | --- |
| I1 | No production operator surface imports from a retired presentation stack without new ADR. |
| I2 | Every production-wired block has a recorded surface acceptance event or explicit grandfather ADR. |
| I3 | Theme surface changes propagate through the composition chain — not ad-hoc per-route CSS overrides for primitives. |
| I4 | Presentation inventory entries must be discoverable without reading application route source. |
| I5 | Business meaning on operator surfaces cites Enterprise Knowledge — presentation does not invent authoritative labels. |

---

# 6. Enterprise Outcomes and KPIs

## 6.1 Outcome statements

| Outcome | Business description | Source (✓) | Reasoning |
| --- | --- | --- | --- |
| **Visual consistency** | Operators experience one density, token set, and interaction language across modules | SAP Fiori (T3) ✓ | **Because** inconsistency increases training cost · **Therefore** unified theme is an outcome |
| **Delivery inspectability** | Any agent or auditor can list accepted blocks without spelunking app folders | ADR-0027 (T0) ✓ | **Because** vibe-coding scales only with visible inventory · **Therefore** inspectability is an outcome |
| **Accessibility baseline** | Core operator flows meet WCAG-oriented acceptance before production | WCAG (T3) ✓ | **Because** compliance and inclusion are enterprise requirements · **Therefore** a11y is outcome, not nice-to-have |
| **Reset stability** | No regression to dual-stack presentation debugging | ADR-0027 (T0) ✓ | **Because** reset cost was high · **Therefore** stability is measured outcome |

## 6.2 Success metrics (permanent KPI targets)

| KPI | Target | Measurement context | Source (✓) | Review by |
| --- | --- | --- | --- | --- |
| **Dual-stack incidents** | 0 in production | Dependency and disposition conformance per release | ADR-0027 (T0) ✓ | Enterprise |
| **Production-wired blocks without acceptance** | 0 (post-stabilization) | Inventory vs ERP import audit | §8 lifecycle (T1) | Production |
| **Theme composition drift** | 0 unauthorized globals chains | CSS composition review | PAS-006 (T5) | Production |
| **Critical a11y regressions on accepted blocks** | 0 open at release | Presentation lab + contract tests | WCAG (T3) ✓ | Production |

---

# 7. Business Events

Events the presentation domain **names** — not React lifecycle hooks or queue topics.

| Event (business vocabulary) | Meaning | Typical trigger | Related vocabulary (§3) |
| --- | --- | --- | --- |
| **Block staged** | New MCP or manual block entered inventory awaiting acceptance | Vendor install or internal composition | Presentation block · Presentation inventory |
| **Block accepted** | Block passed surface acceptance — may wire to ERP | Lab verification green | Surface acceptance · Presentation lab |
| **Block rejected** | Block failed acceptance — must not wire to production | A11y or composition failure | Surface acceptance |
| **Theme surface published** | New or updated theme preset available for composition chain | Design steward approval | Theme surface |
| **Theme surface superseded** | Older preset retired for new work | Brand or density change | Theme surface |
| **Operator surface wired** | ERP route adopts an accepted block | Feature delivery milestone | Operator surface |
| **Presentation stack retired** | Legacy UI pipeline declared historical | ADR acceptance | Dual-stack presentation |
| **Inventory parity gap detected** | Registry shows block without lab story or export | Governance audit | Presentation inventory |

Dispatch, routing, and HTTP transport belong outside this domain.

---

# 8. Entity Lifecycles

Business-state progression — not React component state or database enums.

### 8.1 Presentation block

```text
Draft → Staged → Accepted → Production wired → Deprecated → Retired
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Draft | Block exists locally — not in governed inventory | Generator output | Staged |
| Staged | Listed in inventory — awaiting acceptance | Inventory commit | Accepted or Rejected |
| Accepted | Passed surface acceptance — eligible for ERP | Lab verification | Production wired |
| Production wired | Used on live operator surface | Route adoption | Deprecated |
| Deprecated | New work must not adopt; existing use grandfathered | Superseding block or ADR | Retired |
| Retired | Removed from inventory and exports | Migration complete | — |

### 8.2 Theme surface preset

```text
Proposed → Published → Active → Superseded
```

| State | Business meaning | Entry condition | Exit to |
| --- | --- | --- | --- |
| Proposed | Theme draft under review | Design change request | Published |
| Published | Available in theme surface catalog | Steward approval | Active |
| Active | Default or selectable preset in production | ERP theme selection | Superseded |
| Superseded | Historical — new work uses successor preset | New publication | — |

### 8.3 Operator surface (business view)

```text
Specified → Block selected → Accepted block wired → Operator validated → In production use
```

| Source (✓) | Reasoning |
| --- | --- |
| ADR-0027 delivery chain (T0) ✓ | **Because** ERP rebuilds feature UI block-by-block · **Therefore** lifecycle preserves acceptance gate |

---

# 9. Domain Boundary

## 9.1 This domain owns (business)

- Operator visual consistency across ERP modules
- Presentation inventory — staged and accepted blocks
- Theme surface publication and composition order
- Surface acceptance criteria (including accessibility baseline)
- Design delivery acceleration **into** inventory — not into ad-hoc app forks
- Serializable presentation contracts at Design boundaries
- Retirement doctrine for legacy presentation stacks

## 9.2 This domain never owns (business)

> Reference **domains**, not package names.

| Exclusion | Owning domain / rationale | Source (✓) | Reasoning |
| --- | --- | --- | --- |
| Accepted business term meaning | Enterprise Knowledge | LAW K6 (T0) ✓ | **Because** meaning ≠ rendering · **Therefore** labels defer to Knowledge |
| Cross-package wire vocabulary | Platform Kernel | Kernel NS (T1) ✓ | **Because** shape ≠ surface · **Therefore** kernel stays vocabulary-only |
| Permission decisions | Authorization | Platform NS (T1) ✓ | **Because** UI hides ≠ authorization · **Therefore** evaluation stays outside presentation |
| Business workflow outcomes | Accounting · Inventory · HRM · CRM runtimes | Domain LoB NS | **Because** posting is not painting · **Therefore** workflows stay in domain runtimes |
| Metadata schema authority | Metadata domain | Platform NS (T1) | **Because** schema ≠ screen · **Therefore** metadata-ui revival forbidden without greenfield on this domain |
| Session and identity proof | Identity & Access | Platform NS (T1) ✓ | **Because** login state is not a block · **Therefore** auth stays Identity domain |
| Correlation and audit transport | Observability · Execution | Platform NS (T1) | **Because** tracing is not CSS · **Therefore** instrumentation stays platform ops |

## 9.3 Cross-domain dependencies (business domains only)

| Depends on (domain) | Dependency type | Business reason | Source (✓) |
| --- | --- | --- | --- |
| **Platform constitution** | Governance | ADR-0027 declares sole presentation chain | ADR-0027 (T0) ✓ |
| **Enterprise Knowledge** | Label meaning | Operator labels cite accepted atoms — not invented in blocks | LAW K6 (T0) ✓ |
| **Architecture Authority** | Structure | Disposition and dependency registries enforce single owner | ADR-0026 (T0) ✓ |

| Provides to (domain) | What flows | Related §7 event |
| --- | --- | --- |
| **Application delivery (ERP)** | Accepted blocks · theme surface · composition chain | Operator surface wired |
| **All ERP business domains** | Consistent operator surfaces for LoB workflows | Block accepted |
| **Agent orchestration** | Inspectable inventory for vibe-coding delivery | Block staged |

Package and API mapping belongs in [Presentation Blueprint](../BLUEPRINT/shadcn-studio-presentation-blueprint.md) §5.

## 9.4 Orthogonal platform questions

```text
Platform Kernel           → What does the platform say? (wire shape)
Enterprise Knowledge      → What does the enterprise mean? (accepted truth)
Architecture Authority      → What is allowed? (structure · disposition)
shadcn/studio Presentation  → What do operators see? (visual truth)
```

**Rule:** Presentation must not absorb kernel, knowledge, or authorization questions.

---

# 10. Enterprise Risks

| Risk | Business impact | Mitigation principle (business) | Source (✓) | Blueprint/PAS handoff |
| --- | --- | --- | --- | --- |
| **Dual-stack presentation** | Duplicate debugging · inconsistent UX | One visual owner · P1 · I1 | ADR-0027 (T0) ✓ | Blueprint §8 retired boxes |
| **Theme drift** | Modules look like different products | Composition chain · P3 · I3 | Design-system (T3) ✓ | PAS-006 CSS |
| **Ungoverned MCP forks** | Blocks live in app folders bypassing inventory | Acceleration under governance · P6 | ADR-0017 (T0) ✓ | shadcn-studio SKILL |
| **Business logic in UI** | Untestable coupling · audit failure | Presentation renders only · P8 | Platform layering (T1) | Blueprint §4.2 |
| **Accessibility debt** | Compliance failure · operator exclusion | Accept before wire · P4 · P7 | WCAG (T3) ✓ | Block contract tests |
| **Inventory opacity** | Agents rebuild existing blocks | Inspectability · P5 · I4 | ADR-0027 (T0) ✓ | Block registry |
| **Meaning invented in UI** | Glossary drift · integration errors | Defer labels to Knowledge · P2 · I5 | LAW K6 (T0) ✓ | ERP wiring layer |

---

# 11. Quality Attributes

| Attribute | Domain expectation | Why it matters | Target (business language) | Source (✓) |
| --- | --- | --- | --- | --- |
| **Consistency** | One theme and block language across modules | Visual trust · training cost | Zero dual-stack presentation paths | ADR-0027 (T0) ✓ |
| **Accessibility** | Accepted blocks meet WCAG-oriented baseline | Inclusion · compliance | 0 critical a11y regressions on accepted blocks | WCAG (T3) ✓ |
| **Inspectability** | Inventory lists all production-eligible blocks | Agent-safe delivery | 100% wired blocks trace to acceptance | §6 KPI |
| **Maintainability** | Theme changes propagate through composition chain | Reduce per-route overrides | Single composition entry | PAS-006 (T5) |
| **Delivery velocity** | MCP acceleration without inventory forks | ERP rebuild speed | Vendor installs land in inventory only | ADR-0017 (T0) ✓ |

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
| E6 | WCAG 2.x | T3 | ✓ | Accessibility principles · P4 · P7 | W3C WCAG |
| E7 | PAS-006 doctrine | T5 | ✓ | Composition · serializable contracts | [PAS-006](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) |
| E8 | Enterprise ERP UX patterns | T3 | ✓ | Unified operator experience | SAP Fiori · Oracle Redwood (industry) |

## 12.2 Decision Reasoning Log

| Decision ID | Claim | Because | Source (E#) | Therefore | Review by |
| --- | --- | --- | --- | --- | --- |
| D1 | One presentation owner post-reset | Parallel stacks duplicated enforcement | E1 | Blueprint declares single Design box | Enterprise |
| D2 | MCP installs into inventory — not app tree | Ungoverned forks bypass acceptance | E2, E1 | Presentation lab precedes ERP wire | Production |
| D3 | Presentation never owns business meaning | Types and labels differ | E5 | ERP wiring cites Knowledge atoms | Production |
| D4 | Metadata workspace is greenfield | Retired metadata-ui must not return | E1 | Future slice under PAS-006 | MVP |
| D5 | Accept before wire | Production a11y retrofit is costly | E6 | §8 block lifecycle includes acceptance | Production |

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
| Unified presentation inventory | Core | shadcn/studio Presentation |
| Theme surface governance | Core | shadcn/studio Presentation |
| Visual composition chain | Core | shadcn/studio Presentation |
| Surface acceptance before wiring | Core | shadcn/studio Presentation |
| Design delivery acceleration | Advanced | shadcn/studio Presentation |
| Serializable boundary contracts | Advanced | shadcn/studio Presentation |
| Legacy stack retirement | Core | shadcn/studio Presentation (+ Blueprint §8 retired rows) |
| Metadata workspace surfaces (greenfield) | Advanced | shadcn/studio Presentation (future) |

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
| **Last reviewed** | 2026-06-29 |

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
- Accept before wire — no production block without acceptance path (P4 · D5)
- Presentation renders meaning owned elsewhere (P2 · D3)
- Vendor acceleration feeds inventory — never bypasses it (P6 · D2)

---

# 15. Domain Evolution

**May evolve here:** new §4 capabilities (e.g. tenant white-label theme) · §6 outcome targets · §7 events · vocabulary (§3)

**Must not evolve here:** runtime rules (PAS) · slice order · registry rows · MCP command sequences (SKILL)

**Long-term direction:**

- Core → Production: complete block inventory for ERP skeleton surfaces (auth, settings, admin, errors)
- Advanced: metadata workspace greenfield on presentation inventory (D4)
- Enterprise: tenant-scoped theme surfaces without forking composition chain

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

**shadcn/studio Presentation covenant:** Operators deserve one consistent, accessible, inspectable visual language across Afenda ERP. Vendor acceleration feeds a governed inventory — never a fork. Presentation renders what Enterprise Knowledge means and Platform Kernel shapes at boundaries — it never owns business truth, permission outcomes, or domain workflow state.

§1–§12 define **what operator visual truth means in enterprise business architecture**.

§13 bridges to Blueprint — **box names only**.

PAS-006 defines **how to build**.

If operator UX doctrine changes, amend §1–§12 — then Blueprint.

If packages or MCP wiring change, amend Blueprint or PAS — **not** §1–§12 unless business meaning changed.

> **May belong here:** §1–§12 with Source + Reasoning · §12 Evidence · §13 capability→box · §14–§18 governance.

> **Belongs in Blueprint:** packages, layers, consumers, retired PKG rows, PAS inventory.

> **Belongs in PAS-006:** contracts, CSS rules, gates, public export surfaces.

> **Belongs in shadcn-studio SKILL:** MCP workflows, install cwd, toolbar commands.
