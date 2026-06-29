# Design Token Authority Blueprint

| Field | Value |
| --- | --- |
| **Document class** | `architecture_blueprint` |
| **Document role** | `domain_architecture_box_map` |
| **Architectural identity** | **Blueprint Box name** (§4) — permanent |
| **Workspace mapping** | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) — `@afenda/*` npm name |
| **Scope** | Design Token Authority — governed visual design tokens independent of rendering technology |
| **Domain NS filename** | [`css-authority-north-star.md`](../NORTHSTAR/css-authority-north-star.md) *(Design Token Authority)* |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) · [Design Token Authority North Star](../NORTHSTAR/css-authority-north-star.md) |
| **Platform rollup** | [Afenda Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) § Design system family |
| **Authority ADR** | [ADR-0026](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) · [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) · [ADR-0025](../adr/ADR-0025-design-system-retirement.md) |
| **Derived documents** | PAS-005 family · `@afenda/css-authority` package |
| **Maturity** | Production Candidate |
| **Runtime stance** | Documentation only — references registries; does not duplicate token tables |
| **Total PAS at maturity** | `3` (PAS-005 · PAS-005A · PAS-005B retirement) |
| **Live PAS today** | `3` |
| **Planned PAS** | `0` (cross-renderer PAS — future Domain NS amendment) |
| **Does not confer** | Token JSON schemas, gate commands, variant/recipe TS, slice handoffs |
| **Machine registry** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) · `PKGR05_CSS_AUTHORITY` |
| **Quality target** | Enterprise **10 / 10** (Enterprise Accepted blocked on Domain NS §15) |
| **Evidence standard** | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| **Constitutional laws** | [Visual Token Constitutional Laws](../CONSTITUTION/visual-token-constitutional-laws.md) — V1–V8 |
| **Last reviewed** | 2026-06-29 (NS gap-closure sync) |
| **Next document** | [PAS-005](../PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md) |

> **One sentence:** One Design-layer **CSS authority** box implements today's **CSS platform representation** of Design Token Authority — authority JSON → generator → `CSS-TOKEN-*` registry → consumption gates → runtime CSS — wired end-to-end from constitutional visual truth through Domain North Star, PAS-005, presentation consumers, and visual regression proof; token **meaning** stays renderer-agnostic (P9).

> **Box naming note:** Blueprint box **CSS authority** is today's implementation name for the Design Token Authority domain. Cross-renderer PAS may warrant a renamed box per Domain NS §15 — not silent expansion inside `@afenda/css-authority`.

---

# 0. Agent Quick Path

**Read order:** [Platform Constitutional Laws](../CONSTITUTION/platform-constitutional-laws.md) → [Visual Token Constitutional Laws](../CONSTITUTION/visual-token-constitutional-laws.md) → [Platform NS](../architecture/afenda-platform-north-star.md) → [Domain NS §1–§12](../NORTHSTAR/css-authority-north-star.md) → **this document** → [PAS-005](../PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md) → Slice → Code.

**This document answers:**

- What **Blueprint box** owns design token truth for **CSS representation today** (§4)
- Why tokens ≠ Governed UI recipes ≠ UI primitives ≠ shadcn/studio blocks (§3.1)
- How **visual meaning → token → CSS** and theme hierarchy + **dimensions** compose (§5.1 · §5.5 · §5.6)
- **Full-stack integration** from ADR-0017 → authority JSON → gates → import chain → baselines (§5.2–§5.4)
- Sibling boxes: **shadcn/studio presentation** · **design system retirement** (§4 · §6)

**This document never answers:**

- Authority JSON field specs · R23–R30 rule detail · generator internals (PAS-005)
- Domain philosophy prose (Domain NS §1–§12)
- Component variant/recipe registries (design-system / ui)

**Hard stops:**

- Design tokens ≠ component behavior (Domain NS P6)
- Never hand-edit generated registry (Domain NS I1)
- CSS is one renderer — not constitutional definition of visual meaning (P9)
- Do not implement from Blueprint alone — read PAS-005 + slice handoff

**Chain rule:** Platform NS → Design Token Authority NS → **Domain Blueprint (this doc)** → Platform Blueprint rollup → PAS-005 family → Slice → Code

---

# 1. Blueprint Purpose

Before authoring or extending CSS Authority PAS slices, answer from **this document only**:

1. **What** primary Blueprint box? → **CSS authority** (§4)
2. **Why separate** from UI primitives, design-system recipes, shadcn/studio blocks? → §3.1 · §4 Reasoning
3. **Which layer**? → Design (§3)
4. **What does the box own / never own**? → §4.2
5. **Who consumes** governed CSS tokens? → §5 · §5.3
6. **Which PAS**? → PAS-005 (primary) · PAS-005A/005B (siblings)
7. **Registry PKG**? → `PKG-025` → `@afenda/css-authority`

Business **why visual tokens are constitutional:** [Domain NS §1](../NORTHSTAR/css-authority-north-star.md) — do not copy here.

---

# 2. Upstream Traceability

| Upstream | Link | This Blueprint uses |
| --- | --- | --- |
| Platform North Star | §2 Visual truth | Parent capability |
| Domain North Star | §4 · §13 · §3.1–§3.9 · §5.2–§5.3 · §12 E1–E10 | Box parent · taxonomy · theme · modes · integrity |
| Platform Blueprint | Design system family | Rollup · sibling boxes |
| ADR-0017 | shadcn/studio acceleration | Vendored theme · delivery pipeline |
| ADR-0025 | Design system retirement | PAS-005B · strangler context |
| WCAG / DTCG (T3) | Accessibility · token model reference | Color/typography policy |

| Domain NS §4 capability | Blueprint §4 box | Notes |
| --- | --- | --- |
| Renderer-agnostic token meaning | **CSS authority** | Meaning in NS/PAS; CSS is representation |
| Token taxonomy | **CSS authority** | `category` facet on `CSS-TOKEN-*` |
| Theme inheritance hierarchy | **CSS authority** · **ERP shell** (surface namespace) | appshell.json authority source |
| Theme dimensions (modes) | **CSS authority** | color · density · motion · contrast |
| Token tier + alias graph | **CSS authority** | reference → semantic → component |
| Accessibility token contract | **CSS authority** | §3.7 semantic pairs · inverse tokens |
| Surface adaptation | **CSS authority** · **ERP shell** | §3.9 web · email · PDF · RTL |
| Authority sources ≠ registry | **CSS authority** | JSON → generator |
| Namespace ownership | **CSS authority** | Owner field + prohibited overlap |
| Consumption proof chain | **CSS authority** | R23–R30 + visual regression |
| CSS platform representation | **CSS authority** · **UI primitives** (consumer) | `afenda-ui.css` import chain |
| Vendored base theme | **CSS authority** | shadcn-theme.json |
| Strangler cutover | **CSS authority** · **Design system retirement** | B29–B30 · PAS-005B |
| Visual regression contract | **CSS authority** | B33 · B37 |
| Cross-renderer mapping | **CSS authority** (future) | §3.3 · §15 — optional second representation |
| Automated contrast validation | **CSS authority** (future gate) | NS §3.7 · D5 — PAS slice when implemented |
| Design-tool representation sync | **CSS authority** (future) | NS §7 design export event · D6 |
| Design asset expansion | *(future box)* | §9.4 — not PAS-005 v1 |
| Tenant / brand theming | *(future workflow)* | NS §9.6 — bounded override; no runtime until PAS slice |

---

# 3. Layer Map

| Layer | Blueprint intent for this domain |
| --- | --- |
| **Design** | **CSS authority** — token authority + generated CSS (primary box) |
| **Design** | **shadcn/studio presentation** (sibling) — derived presentation · MCP · blocks |
| **Design** | **UI primitives** (`@afenda/ui`) — consumer; no token authority |
| **ERPSpine** | **ERP shell** — surface namespace tokens via authority JSON; consumer CSS |
| **Application** | **apps/erp** · **apps/storybook** — import chain · visual baselines |

**Dependency rule:** `@afenda/css-authority` has zero runtime deps. `@afenda/ui` → `@afenda/css-authority` (CSS only).

---

# 3.1 Architecture Decision Matrix

> Run **before** adding or splitting §4 rows.

| Question | Design Token Authority / CSS | Result |
| --- | --- | --- |
| Different **business capability**? | Token meaning + CSS representation vs presentation delivery vs UI behavior | **Split boxes** where below |
| Same **token spine** + **CSS renderer**? | One package `@afenda/css-authority` | **CSS authority** box |
| **Governed UI variant/recipe** behavior? | Not a color variable | **Separate** — `@afenda/design-system` (retiring) |
| **React primitive** behavior? | Not token authority | **Separate consumer** — `@afenda/ui` |
| **shadcn/studio blocks** + MCP delivery? | ADR-0017 product acceleration | **Separate box** — shadcn/studio presentation |
| **Legacy monolith retirement**? | Strangler doctrine — not token SSOT | **Separate track** — PAS-005B |
| **Icons/illustrations/motion assets**? | Future Design Asset Authority | **Future box** — NS §9.4 |
| **PDF/email/native renderer**? | Same token meaning · new representation | **Future PAS/box** — NS §15 |
| **Tenant theme publish**? | NS §9.6 bounded override | **Future PAS slice** — not css-authority v1 expansion |
| **Contrast CI gate**? | NS §3.7 proof model | **Future PAS-005 slice** — constitutional in NS; gate not live |
| §3.1 technical-only split of JSON files? | Authority domains inside one package | **Insufficient alone** — stays in CSS authority |

**Workflow:** Domain NS EFR → matrix → **CSS authority** primary row → sibling rows in §4 · §6 → PAS-005 handoff.

---

# 3.2 Canonical Dependency Categories

| Category | CSS authority usage |
| --- | --- |
| **Compile-time** | Consumers import CSS bundles — not TS token registries from generated output for authority edits |
| **Runtime** | CSS custom properties at render — no token authority at ERP request-time business logic |
| **Metadata** | `CSS-TOKEN-*` identity · lifecycle · owner in generated registry |
| **Configuration** | Theme layers via namespace JSON domains |
| **Knowledge** | Orthogonal — ERP **semantic colors** are tokens; business **term meaning** is Enterprise Knowledge |

---

# 4. Blueprint Boxes

### Primary box → workspace authority chain

```text
Blueprint Box: CSS authority (this document §4 — primary)
        ↓
package-registry.data.ts — PKG-025 → @afenda/css-authority
        ↓
foundation-disposition.registry.ts — PKGR05_CSS_AUTHORITY
        ↓
packages/css-authority/
```

| Blueprint box | Layer | Registry PKG | Why separate | Source | Reasoning (Because → Therefore) | Status | Governing PAS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **CSS authority** | Design | `PKG-025` → `@afenda/css-authority` | Visual design tokens need SSOT independent of component behavior, Governed UI recipes, and ad-hoc CSS in apps | [T0 ADR-0017] [T1 Platform NS §2] [T1 Domain NS §4] [T1 Domain NS §12 E2] ✓ | **Because** ungoverned CSS causes theme drift and accessibility regressions across ERP surfaces (Domain NS §1). **Because** token **meaning** is renderer-agnostic but **today's representation is CSS** (P9). **Therefore** one Design box owns authority JSON, generator, registry, and consumption gates; consumers import CSS only. | **live** | PAS-005 |

**Sibling boxes (design family — platform scope):**

| Blueprint box | Package | Layer | Status | Relationship |
| --- | --- | --- | --- | --- |
| **shadcn/studio presentation** | `@afenda/shadcn-studio` | Design | live | Derived presentation from PAS-005 · ADR-0017 · PAS-005A |
| **UI primitives** | `@afenda/ui` | Design | live | Primary CSS consumer · `afenda-ui.css` cutover |
| **ERP shell** | `@afenda/appshell` | ERPSpine | live | Surface namespace tokens · `--app-shell-*` in authority JSON |
| **Design system retirement** | `@afenda/design-system` | Design | retiring | Legacy Governed UI TS + CSS shim · PAS-005B · not token SSOT |

**Future (NS §9.4 · §15):** Design Asset Authority box · cross-renderer representation PAS — require Domain NS + new §4 row.

---

# 4.1 Blueprint Evidence Register

| ID | Source | Tier | Justifies | Link |
| --- | --- | --- | --- | --- |
| B1 | ADR-0017 | T0 | Token authority + shadcn delivery | [`docs/adr/ADR-0017`](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) |
| B2 | ADR-0026 | T0 | Blueprint design family | [`docs/adr/ADR-0026`](../adr/ADR-0026-platform-north-star-and-architecture-blueprint.md) |
| B3 | Domain NS §12 E1–E10 · V1–V8 | T1 | Constitutional + laws + implementation split | [`css-authority-north-star.md`](../NORTHSTAR/css-authority-north-star.md) · [`visual-token-constitutional-laws.md`](../CONSTITUTION/visual-token-constitutional-laws.md) |
| B4 | PAS-005 B26–B37 | T5 | 605-token registry · gates live | [`PAS-005`](../PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md) |
| B5 | PKG-025 · PKGR05 | T4 | amber-lane · MVP delivered | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) |
| B6 | governed-ui-policy | T1 | Tokens ≠ recipes | [`.cursor/rules/governed-ui-consumption.mdc`](../../.cursor/rules/governed-ui-consumption.mdc) |

---

# 4.2 Box Responsibility Matrix

| Blueprint box | Owns (architectural) | Never owns (explicit exclusions) | Domain NS trace |
| --- | --- | --- | --- |
| **CSS authority** | Design token identity · taxonomy · **token tier** · **alias graph** · theme layer + **theme dimension** placement · **accessibility token contract** (constitutional) · **surface adaptation** vocabulary · authority JSON sources · generator contract · `CSS-TOKEN-*` registry · vendored shadcn theme · Afenda extension CSS · namespace rules · consumption validation · CSS platform representation · strangler cutover vocabulary · **override precedence** (NS §5.3) | Governed UI variant/recipe/state TS · React primitive behavior · AppShell block TSX · ERP business logic · accepted business term meaning · wire contracts · hand-edited generated registry · icons/illustrations (v1) · **tenant theme runtime** (future — NS §9.6) | §4 · §9.1 · §9.2 · §9.6 |

**Never-owns targets:** **UI primitives** (behavior) · **design-system** (recipes — retiring) · **shadcn/studio** (block delivery) · **Enterprise Knowledge** (meaning) · **Kernel** (shape).

---

# 4.3 Change Impact Matrix

| If this box changes… | PAS impacted | Domain NS | Registry PKG | Primary gates / tests | ADR required |
| --- | --- | --- | --- | --- | --- |
| **CSS authority** | PAS-005 · §11 slices | §4 · §13 | `PKG-025` | `pnpm check:css-governance` · `check:css-authority-consumption` · `check:css-visual-regression` | Yes if split/merge or renderer model change |
| New token / namespace | PAS-005 slice | §3.1 category | Unchanged | conformance + consumption + regen | No |
| Generator contract change | PAS-005 §6 | — | Unchanged | build + all css gates | No if additive |
| Cross-renderer mapping | New PAS + possible box rename | §3.3 · §3.9 · §15 | May unchanged | New representation gates | **Yes** |
| Theme dimension extended | PAS-005 slice | §3.4 · §5.2 D3 | Unchanged | bridge-sync · visual regression | No if additive |
| Contrast gate added | PAS-005 slice | §3.7 · D5 | Unchanged | new `check:*` when authored | No |
| Tenant theme workflow | New PAS + ADR | §9.6 | May new PKG | tenant publish gates | **Yes** |
| Design asset class (icons…) | New Domain NS + box | §9.4 | New PKG | — | **Yes** |

---

# 5. Composition and Consumers

```text
Design Token Authority (domain)
        │
        ▼
CSS authority (primary box — PAS-005)
        │
        ├──► @afenda/ui (afenda-ui.css import chain)
        ├──► @afenda/appshell (surface namespace CSS)
        ├──► @afenda/metadata-ui (composed CSS)
        ├──► apps/erp (globals.css)
        ├──► apps/storybook (visual baselines)
        └──► @afenda/shadcn-studio (presentation sibling — PAS-005A)
```

| Blueprint box | Declared consumers | Dependency category | Notes |
| --- | --- | --- | --- |
| **CSS authority** | `@afenda/ui` · `@afenda/appshell` · `@afenda/metadata-ui` · `apps/erp` · `apps/storybook` | Compile-time (CSS imports) | PAS **Consumers** ⊆ this list |

---

# 5.1 Cross-box Composition — Token Surfaces (Internal)

> Maps Domain NS §3.1–§3.9 and §5.2–§5.3 to PAS-005 authority domains inside **CSS authority**.

```text
CSS authority (one box — multiple authority JSON domains)
        │
        ├─ Visual meaning (NS §3.3) ─────── token identity + semantic category
        ├─ Taxonomy (NS §3.1) ───────────── CSS-TOKEN category facet
        ├─ Token tier (NS §3.5) ─────────── reference → semantic → component
        ├─ Alias / composite (NS §3.6) ── parentId lineage · DTCG-aligned refs
        ├─ Theme hierarchy (NS §3.2) ────── vendor → platform → brand → surface layers
        │     ├─ shadcn-theme.json         (vendor base)
        │     ├─ afenda-extensions.json    (platform base · ERP status · charts)
        │     ├─ appshell.json             (surface — ERP shell namespace)
        │     └─ auth-editorial.json       (surface — auth editorial)
        ├─ Theme dimensions (NS §3.4) ───── color · density · motion · contrast
        │     └─ afenda-runtime-bridge.css (dark variant · data-afenda-density hooks)
        ├─ Accessibility contract (NS §3.7) semantic pairs · inverse · high-contrast (constitutional)
        ├─ Surface adaptation (NS §3.9) ─── web ERP primary · shell · docs · email/PDF future
        ├─ Integrity dimensions (NS §5.2) ─ D1–D8 profile at Production+
        ├─ Override precedence (NS §5.3) ─ accessibility > semantic > brand > vendor
        ├─ Authority sources (P1) ─────── human-edited JSON only
        ├─ Generated registry ─────────── css-authority-registry.* (generator)
        ├─ Consumption proof ────────────── R23–R30 · domain-sync · bridge-sync
        └─ CSS bundle ───────────────────── afenda-css-authority.css → consumers
```

| Upstream | Downstream | Relationship | Domain NS §7 event | Category |
| --- | --- | --- | --- | --- |
| Authority JSON amended | Registry regenerated | sources → generator | Registry regenerated | Metadata |
| Registry row | Consumption gate | token known + lifecycle OK | Consumption violation detected | Compile-time |
| CSS bundle | UI import chain | tokens → runtime | Token registered | Runtime (CSS) |
| Semantic token | Reference/primitive | tier alias (§3.5) | — | Metadata |
| Theme dimension value set | Mode CSS hooks | layer × dimension (§3.4) | Theme dimension extended | Runtime (CSS) |
| Semantic color pair | Contrast proof (future) | §3.7 constitutional | Contrast violation detected | Metadata |
| CSS authority | UI primitives | CSS import | Cutover completed | Compile-time |
| CSS authority | ERP shell | surface namespace | Theme layer override declared | Metadata |
| CSS authority | shadcn/studio | presentation theme bridge | — | Compile-time |
| Design export | Authority JSON (future) | parity check | Design export reconciled | Metadata |

---

# 5.2 Full-Stack End-to-End Integration Chain

> **Mandatory path** — authority sources through proof, not registry alone (P8).

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONSTITUTION + ADR                                                           │
│ Platform NS §2 Visual truth · ADR-0017 · ADR-0025 (retirement context)       │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ BUSINESS AUTHORITY                                                           │
│ Design Token Authority North Star §1–§12 (meaning · taxonomy · theme · modes · a11y · P9) │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ARCHITECTURAL MAP                                                            │
│ Domain Blueprint (this doc) §4 CSS authority + design siblings §6            │
│ Platform Blueprint — Design system family rollup                             │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PACKAGE AUTHORITY                                                            │
│ PAS-005 (CSS representation) · PAS-005A (presentation) · PAS-005B (retire)   │
│ Skill: .cursor/skills/css-authority/SKILL.md                                  │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ IMPLEMENTATION                                                               │
│ packages/css-authority/src/authorities/*.json                                │
│   → pnpm generate:css-authority-registry                                     │
│   → src/generated/* · css/afenda-css-authority.css                           │
│ Slices B26–B37 delivered (605 tokens)                                        │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ CI / CONSUMPTION PLANE                                                       │
│ check:css-authority-conformance · consumption · domain-sync · bridge-sync    │
│ check:css-governance (R23–R30) · check:css-visual-regression                 │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ RUNTIME CSS IMPORT CHAIN (live — PAS-005 §9)                                 │
│ tailwind → @afenda/ui/afenda-ui.css → css-authority bundle → appshell → erp  │
│ Storybook composed spot-check · docs pixel baselines (B37)                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Platform domain placement (NS §9.5):**

| Domain | Question |
| --- | --- |
| **Kernel** | *What does the platform say?* |
| **Enterprise Knowledge** | *What is accepted meaning?* |
| **Architecture Authority** | *What is allowed?* |
| **Accounting Standards** | *Which external standard applies?* |
| **Design Token Authority** | *How does visual identity stay consistent?* |

**Integration invariants (E2E):**

| # | Invariant | Enforced at |
| --- | --- | --- |
| E1 | No hand-editing generated registry | I1 · CI regen check |
| E2 | Unknown tokens fail closed | P2 · R23–R30 |
| E3 | Tokens ≠ component recipes | P6 · prohibited overlap §10 |
| E4 | Token meaning independent of CSS syntax | P9 · NS §3.3 |
| E5 | Theme overrides respect namespace ownership | P3 · P10 · domain-sync |
| E6 | Consumption proof before Production+ claim | I6 · visual regression |
| E7 | Strangler — no big-bang design-system delete | P5 · PAS-005B |
| E8 | Theme dimensions governed — not ad-hoc mode CSS | NS §3.4 · I8 · bridge-sync |
| E9 | Alias lineage valid at Stable | NS §3.6 · I9 · parentId policy |
| E10 | Override precedence when sources conflict | NS §5.3 |

---

# 5.3 Consumer Integration Map

| Consumer | Integration surface | Import / usage | Proof gate |
| --- | --- | --- | --- |
| **@afenda/ui** | `afenda-ui.css` | Tokens + css-authority bundle (B29 cutover) | bridge-sync · visual contract |
| **@afenda/appshell** | `afenda-appshell.css` | `--app-shell-*` registered tokens | domain-sync · consumption |
| **@afenda/metadata-ui** | Composed CSS | No local token authority | css-governance scan |
| **apps/erp** | `globals.css` | Import chain only — no token SSOT | consumption · boundaries |
| **apps/storybook** | Composed governance stories | Visual spot-check | B37 pixel baselines |
| **@afenda/shadcn-studio** | Theme bridge (sibling PAS-005A) | Presentation — not duplicate registry | PAS-005A gates |
| **@afenda/design-system** | Legacy shim `afenda-tokens.css` | Strangler only — retiring | PAS-005B readiness |
| **Agents / MCP** | css-authority skill + `CSS-TOKEN-*` IDs | Add tokens via authority JSON workflow | conformance |

---

# 5.4 Documentation and Registry Sync Chain

```text
Domain NS §3.1 taxonomy · §3.2 theme · §3.3–§3.9 representation · modes · surfaces
        ↓
Domain NS §5.2 integrity · §5.3 precedence
        ↓
Domain Blueprint §5.1 (this doc)
        ↓
PAS-005 §4–§10
        ↓
packages/css-authority/src/authorities/*.json (SSOT)
        ↓
generate:css-authority-registry → generated registry + CSS + bridge (modes)
        ↓
docs/architecture/css-authority.md (derived operational view — not SSOT)
        ↓
pnpm check:css-* · pnpm check:documentation-drift
```

| Event | Update order |
| --- | --- |
| New design token | Domain NS category + tier rules → authority JSON → regen → gates → consumers |
| New theme dimension value | NS §3.4 → bridge/runtime CSS → visual regression |
| Contrast failure | NS §3.7 event → remediate or exemption → optional future contrast gate |
| New namespace domain | PAS-005 §10 prohibited overlap check → JSON domain file |
| Tenant theme (future) | NS §9.6 → ADR → PAS slice → publish workflow |
| Slice delivered | PAS §11 → pas-status-index → Platform Blueprint §10 |
| shadcn theme upgrade | Regen shadcn-theme.json from CLI → generator → gates |
| Enterprise Accepted | Domain NS §15 criteria → disposition promotion |

---

# 5.5 Cross-Platform Representation Model (E2E)

> Domain NS §3.3 — constitutional chain independent of today's CSS implementation.

```text
Visual Meaning          ("danger feedback surface" — semantic intent)
        │
        ▼
Design Token            (CSS-TOKEN identity · taxonomy · theme layer · lifecycle)
        │
        ▼
Platform Representation
        ├─► CSS custom properties     ← LIVE (PAS-005 · this blueprint)
        ├─► PDF fill / stroke         ← FUTURE (§15 optional pilot)
        ├─► Email inline styles       ← FUTURE
        ├─► iOS / Android assets      ← FUTURE
        └─► Figma / design-tool sync  ← FUTURE
```

**Rule:** New representations map to **existing token identity** — they do not redefine visual meaning (I4). Surface subsets per NS §3.9.

---

# 5.6 Theme Dimensions and Surface Adaptation (E2E)

> Domain NS §3.4 · §3.9 — orthogonal to §3.2 inheritance layers.

| Dimension | Live CSS representation | Proof today | NS exit / future |
| --- | --- | --- | --- |
| **Color mode** | `.dark` variant · `color-scheme` in bridge CSS | visual regression | high-contrast mode — constitutional §3.7 |
| **Density mode** | `[data-afenda-density]` compact/default/comfortable | bridge-sync · erp grids | mode parity KPI §6 |
| **Motion preference** | reduced-motion hooks (partial) | manual review | full governed set — PAS slice |
| **Contrast mode** | not automated | — | D5 contrast gate — future PAS |

| Surface | Blueprint consumer / proof | Token subset |
| --- | --- | --- |
| **Web ERP** | `apps/erp` · consumption gates | Full spine |
| **Shell / auth** | `@afenda/appshell` · auth-editorial JSON | Surface namespace |
| **Docs / Storybook** | B37 pixel baselines | Same spine as ERP |
| **Email / PDF** | *(future representation PAS)* | §3.9 semantic subset only |
| **Partner embed** | *(future)* | Inherit parent color mode — NS §3.9 |

**Tenant theming (NS §9.6):** constitutional vocabulary only — no Blueprint runtime box until ADR + PAS slice.

---

# 6. Domain Grouping

### Design system family

```text
Design layer
├── CSS authority              ← primary token box (PAS-005) · LIVE
├── shadcn/studio presentation ← derived delivery (PAS-005A) · LIVE
├── UI primitives              ← consumer (@afenda/ui)
└── Design system retirement   ← legacy strangler (PAS-005B) · RETIRING

ERPSpine layer
└── ERP shell                  ← surface namespace consumer
```

Rollup: [Platform Blueprint — Design system family](../architecture/afenda-architecture-blueprint.md).

---

# 7. PAS Creation Gate

PAS-005 **satisfies** all conditions:

1. Box **CSS authority** in §4 ✓
2. §3.1 matrix in §4 Reasoning ✓
3. §4.2 responsibility row ✓
4. Layer Design ✓
5. **Why separate** documented ✓
6. Registry PKG `PKG-025` linked ✓
7. Status **live** ✓
8. PAS-005 assigned ✓
9. ADR-0017 ✓
10. §4.3 impact row ✓

PAS-005A (sibling box) and PAS-005B (retirement) satisfy §7 for their own §4 rows in Platform Blueprint.

---

# 8. Blocked and Retired Boxes

| Blueprint box | Status | Blocker / notes |
| --- | --- | --- |
| **Design system** (legacy monolith) | retiring | PAS-005B · ADR-0025 — CSS shim remains v1 |
| **Design Asset Authority** | planned | NS §9.4 — icons/illustrations not in PAS-005 v1 |

**CSS authority** status: **live** · MVP delivered B26–B37.

---

# 9. Blueprint → PAS Handoff Contract

| §4 field | Pre-fills PAS |
| --- | --- |
| **Blueprint box** | `CSS authority` |
| Registry PKG | `@afenda/css-authority` · `PKG-025` |
| Layer | Design |
| Why separate | §4 Reasoning → PAS-005 §1–§2 |
| §4.2 Owns / never owns | PAS-005 §0 · §10 prohibited overlap |
| Status | live · MVP Authority delivered |
| Governing PAS | PAS-005 (primary) |
| §5 consumers | PAS metadata `Consumers` |
| §5.1 surfaces | PAS-005 §4–§7 · authority JSON table §5 |
| §5.5 representation | PAS-005 §1 P9 cross-link to Domain NS |
| NS §3.4–§3.9 · §5.2–§5.3 | PAS-005 §1 domain alignment paragraph |
| NS §15 exit criteria | Production Candidate / Enterprise attestation |

**PAS family roles:**

| PAS | Box | Role |
| --- | --- | --- |
| PAS-005 | **CSS authority** | Token authority · CSS representation · gates |
| PAS-005A | **shadcn/studio presentation** | ADR-0017 delivery · theme · MCP · blocks |
| PAS-005B | **Design system retirement** | Legacy strangler · readiness · delete gate |

---

# 10. PAS Inventory

**Total PAS at maturity: 3** (primary box + siblings in design family)

| PAS | Title | Blueprint box | Live / Total slices | Status |
| --- | --- | --- | --- | --- |
| PAS-005 | CSS Authority Standard | **CSS authority** | 12 / 12 (B26–B37) | MVP Authority — delivered |
| PAS-005A | shadcn/studio Presentation | **shadcn/studio presentation** | B38–B42p delivered | MVP Authority — closed |
| PAS-005B | Design System Retirement | **Design system retirement** | 1 / 7 (B43+) | Retirement Candidate |

> Primary domain box inventory: **PAS-005** on **CSS authority**. Sync Platform Blueprint §10 for family rollup.

---

# 11. PAS Maturity Rollup (read-only)

| Blueprint box | Registry PKG | PAS | Maturity |
| --- | --- | --- | --- |
| **CSS authority** | `PKG-025` | PAS-005 | MVP Authority (delivered) |
| **shadcn/studio presentation** | `PKG-026` | PAS-005A | MVP Authority |
| **Design system retirement** | legacy PKG | PAS-005B | Retirement Candidate |

Disposition: `PKGR05_CSS_AUTHORITY` · amber-lane · authority PAS-005.

---

# 12. How to Add a Blueprint Box (This Domain)

**Token + CSS representation today:** extend **CSS authority** only — authority JSON + PAS-005 slice.

**New asset class (icons, motion files):** Domain NS §9.4 amendment → new box → new PAS — not silent expansion in css-authority.

**New renderer (PDF, email):** Domain NS §15 → cross-renderer mapping → may warrant box rename per NS note — ADR required.

**New presentation product:** likely **shadcn/studio** or app layer — not css-authority token SSOT.

---

# 13. Agent Execution Rules

## Vibe-coding entry checklist

- [ ] Target box **CSS authority** in §4 (or sibling PAS-005A/005B if scoped)
- [ ] §3.1 matrix — tokens vs recipes vs UI behavior
- [ ] §4.2 responsibility row exists
- [ ] Box status **live**
- [ ] PAS-005 maturity permits token work
- [ ] Slice handoff for B26+ family
- [ ] `/afenda-coding-session` Phase 0 from slice
- [ ] `css-authority` skill · `ui-consistency-bundle` when touching consumers

## Runtime chain (implement mode)

```text
§4 CSS authority + live
        ↓
Edit authorities/*.json (never generated output)
        ↓
pnpm generate:css-authority-registry + build
        ↓
PAS-005 §13 gates (conformance · consumption · visual regression)
        ↓
Verify import chain (ui → erp → storybook)
        ↓
Sync pas-status-index · disposition evidence
```

## E2E integration checklist (before claiming token delivery)

- [ ] Domain NS §3.1 category + §3.5 tier on token
- [ ] Domain NS §3.4 mode applicable if color/density token
- [ ] §5.2 integrity D1–D4 satisfied before Stable claim
- [ ] Authority JSON domain file correct owner
- [ ] Registry regenerated — not hand-edited
- [ ] Consumption gates pass
- [ ] No new token authority in ui/appshell/erp
- [ ] Visual regression / contract green if representation changed
- [ ] P9 — meaning documented as renderer-agnostic in commit/slice notes

---

# 14. Required Reviews and References

## Before accepting

- [ ] §4 primary box traces to Domain NS §4 + §13
- [ ] §3.1 separates CSS authority · UI · design-system · shadcn/studio
- [ ] §4.2 complete · §4.3 present
- [ ] §5.1 maps taxonomy · theme · **modes · tiers · alias · a11y · surfaces**
- [ ] §5.2 full-stack chain + platform domain table
- [ ] §5.6 theme dimensions + surface adaptation documented
- [ ] §5.3 consumers match Platform Blueprint
- [ ] §5.5 cross-platform model documented
- [ ] Visual Token Laws V1–V8 linked in §0 read order
- [ ] Constitutional vs implementation evidence split (NS §12.1 vs §12.2)
- [ ] [doc-boundary-contract.md](../../.cursor/skills/kernel-authority/reference/doc-boundary-contract.md) passes

## References

| Document | Role |
| --- | --- |
| Domain North Star | [`css-authority-north-star.md`](../NORTHSTAR/css-authority-north-star.md) |
| Visual Token Laws | [`visual-token-constitutional-laws.md`](../CONSTITUTION/visual-token-constitutional-laws.md) |
| Platform Blueprint | [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) |
| PAS-005 | [`PAS-005-CSS-AUTHORITY-STANDARD.md`](../PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md) |
| PAS-005A | [`PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md`](../PAS/CSS-AUTHORITY/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) |
| PAS-005B | [`PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md`](../PAS/CSS-AUTHORITY/PAS-005B-DESIGN-SYSTEM-RETIREMENT-STANDARD.md) |
| Operational derived view | [`css-authority.md`](../architecture/css-authority.md) |
| Enterprise Knowledge Blueprint | [`enterprise-knowledge-blueprint.md`](enterprise-knowledge-blueprint.md) |

---

# 15. Final Doctrine

This Blueprint owns **CSS authority** as today's **Design Token Authority** implementation box — authority sources, generator, registry, consumption proof, and CSS representation — plus **documented sibling boxes** in the design family (§6).

| Identity | Owner | Changes when |
| --- | --- | --- |
| **Blueprint Box name** | This document §4 (`CSS authority` today) | ADR if renamed for cross-renderer PAS |
| **`@afenda/css-authority`** | `package-registry.data.ts` | Registry update — box unchanged |
| **`PKGR05` disposition** | `foundation-disposition.registry.ts` | `foundation-registry-owner` |

Domain North Star owns **renderer-agnostic visual meaning**, theme hierarchy, **dimensions**, **tiers**, **accessibility contract**, and **surface adaptation** rules. PAS-005 owns **CSS representation contracts and gates**. Generated registry is **never** SSOT — authority JSON is.

Token meaning change → Domain NS first. New CSS token → authority JSON + regen + gates. Component recipe → **design-system/ui** — not here.

**Visual meaning → design token → platform representation → consumption proof** — the full stack ends at green gates and visual baselines, not at registry row count alone.
