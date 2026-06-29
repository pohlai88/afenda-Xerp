# shadcn/studio Presentation Architecture Blueprint

| Field | Value |
| --- | --- |
| **Document class** | `architecture_blueprint` |
| **Document role** | `domain_architecture_box_map` |
| **Architectural identity** | **Blueprint Box name** (§4) — permanent |
| **Workspace mapping** | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) — `@afenda/*` npm name |
| **Scope** | shadcn/studio Presentation — ERP frontend visual truth |
| **Parent** | [Platform North Star](../architecture/afenda-platform-north-star.md) · [Presentation North Star](../NORTHSTAR/shadcn-studio-presentation-north-star.md) |
| **Platform rollup** | [Afenda Architecture Blueprint](../architecture/afenda-architecture-blueprint.md) § Design system (ERP frontend) |
| **Constitutional ADR** | [ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) |
| **MCP vendor ADR** | [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) — retained; install target changed |
| **Derived documents** | [PAS-006](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · `@afenda/shadcn-studio` |
| **Maturity** | Production Candidate |
| **Runtime stance** | Documentation only — references registries; does not duplicate PKG tables |
| **Total PAS at maturity** | `1` (PAS-006) |
| **Live PAS today** | `1` |
| **Planned PAS** | `0` |
| **Does not confer** | Business meaning, kernel vocabulary, permission evaluation, metadata workspace UI, accounting runtime |
| **Machine registry** | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) · `PKGR05A_SHADCN_STUDIO` |
| **Quality target** | Enterprise **10 / 10** |
| **Evidence standard** | [doc-evidence-standard.md](../../.cursor/skills/kernel-authority/reference/doc-evidence-standard.md) |
| **Last reviewed** | 2026-06-29 |
| **Next document** | [PAS-006](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · [shadcn-studio SKILL](../../.cursor/skills/shadcn-studio/SKILL.md) |

> **One sentence:** One **Design-layer shadcn/studio Presentation** box owns MCP-installed blocks, theme surface, and CSS export — consumed by ERP and Storybook only — with legacy governed-ui, appshell, metadata-ui, and css-authority boxes **retired** per ADR-0027.

---

# 0. Agent Quick Path

**Read order:** [Presentation North Star §4](../NORTHSTAR/shadcn-studio-presentation-north-star.md) → [ADR-0027](../adr/ADR-0027-frontend-presentation-reset.md) → **this document** → [PAS-006 §0](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) → [shadcn-studio SKILL](../../.cursor/skills/shadcn-studio/SKILL.md) → Slice (when authored) → Code.

**This document answers:**

- What **Blueprint box** owns ERP frontend presentation (not kernel vocabulary or business meaning)
- Why presentation is **one box** separate from Platform kernel, Enterprise Knowledge, and Application integration spine
- How **MCP → shadcn-studio → apps** composes (§5 · §5.1)
- Box **owns / never owns** (§4.2) · kernel boundary (§4.2 · §5.1)
- Registry PKG, dependency categories, and retired boxes (§4 · §8)

**This document never answers:**

- Block implementation detail, theme preset schemas, or gate commands (PAS-006)
- MCP workflow step sequence (`.cursor/rules/shadcn-studio.instructions.mdc` · shadcn-studio SKILL)
- Kernel branded IDs, operating context, or permission vocabulary ([PAS-001](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md))
- Enterprise term acceptance or atom promotion ([PAS-004](../PAS/ENTERPRISE-KNOWLEDGE/PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md))

**Hard stops:**

- Do not restore `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, or `@afenda/css-authority` without a new ADR
- Do not add `@afenda/kernel` runtime imports to `@afenda/shadcn-studio` (`do-not-import-kernel-runtime`)
- Do not run retired gates: `pnpm ui:guard*`, legacy css-authority checks, appshell promotion pipeline
- Do not implement from Blueprint alone — read PAS-006 + slice handoff when slices exist
- Presentation renders meaning — **Kernel owns shape; Enterprise Knowledge owns meaning** (do not embed business vocabulary in presentation contracts)

**Chain rule:** ADR-0027 → Presentation North Star → **Domain Blueprint (this doc)** → Platform Blueprint rollup → PAS-006 → Slice → Code

**Skill routing ([using-afenda-skills](../../.cursor/skills/using-afenda-skills/SKILL.md)):**

| Task | Entry |
| --- | --- |
| MCP install / blocks / theme | [shadcn-studio SKILL](../../.cursor/skills/shadcn-studio/SKILL.md) |
| CSS dist sync | [package-css-dist-sync SKILL](../../.cursor/skills/package-css-dist-sync/SKILL.md) |
| Kernel boundary questions | [kernel-authority SKILL](../../.cursor/skills/kernel-authority/SKILL.md) — presentation is **outside** kernel |
| Registry lane edits | `@foundation-registry-owner` |

---

# 1. Blueprint Purpose

Before authoring or extending presentation work, answer from **this document only**:

1. **What** Blueprint box? → **shadcn/studio Presentation** (§4)
2. **Why separate** from kernel, metadata-ui, appshell, css-authority? → §3.1 · §4 Reasoning · ADR-0027
3. **Which layer**? → Design (§3)
4. **What does the box own / never owns**? → §4.2
5. **Who consumes**? → `apps/erp`, `apps/storybook` (§5)
6. **Which PAS**? → PAS-006
7. **Registry PKG**? → `PKG-026` → `@afenda/shadcn-studio`

Business **why single presentation owner:** [Presentation North Star §1](../NORTHSTAR/shadcn-studio-presentation-north-star.md) — do not copy here.

---

# 2. Upstream Traceability

| Upstream | Link | This Blueprint uses |
| --- | --- | --- |
| Platform North Star | §4 Design / Application surfaces | Platform scope confirmation |
| Presentation North Star | §4 capabilities · success signals | Box justification |
| ADR-0027 | Frontend presentation reset | Constitutional sole chain |
| ADR-0017 | MCP vendor approval | Install cwd and MCP servers |
| ADR-0026 | Blueprint document class | This document structure |

| Presentation NS capability | Blueprint §4 box | NS signal |
| --- | --- | --- |
| Blocks live in shadcn-studio | shadcn/studio Presentation | Capability 1 |
| Composable CSS chain | shadcn/studio Presentation | Capability 2 |
| Storybook proves blocks | shadcn/studio Presentation (consumer: Storybook) | Capability 3 |
| Serializable boundary contracts | shadcn/studio Presentation | Capability 5 |

---

# 3. Layer Map

| Layer | Blueprint boxes in scope | Role |
| --- | --- | --- |
| **Design** | shadcn/studio Presentation | Visual truth — blocks, theme, CSS export |
| **Application** | `apps/erp`, `apps/storybook` | Delivery — compose presentation; ERP also wires auth/database/observability |
| **Platform** | `@afenda/kernel` (adjacent, not imported) | Vocabulary and wire contracts — consumed by ERP integration spine, **not** by shadcn-studio |

Presentation sits in the **Design** layer. ERP is **Application** and may import Design + Platform packages independently.

**Dependency rule:** `@afenda/shadcn-studio` has **zero** approved runtime package dependencies ([`dependency-registry.data.ts`](../../packages/architecture-authority/src/data/dependency-registry.data.ts)).

---

## 3.1 Architecture Decision Matrix

| Question | If Yes | If No |
| --- | --- | --- |
| Different business capability? | New box | Same box |
| Different lifecycle / maturity gate? | New box | Same box |
| Different ownership team? | New box | Same box |
| Independent deployment unit? | Candidate split | Same box |
| Shared platform vocabulary only? | Platform layer (kernel) | Design layer |
| Visual / rendering surface only? | shadcn/studio Presentation | Not kernel |
| Consumer wiring proof only? | ERP Integration Spine (PAS-001A) | Not presentation box |

**Applied decisions:**

| Decision | Outcome | Reasoning |
| --- | --- | --- |
| Merge ui + appshell + css-authority + metadata-ui? | **No — retired** | ADR-0027 deleted parallel stacks; single MCP-fed owner |
| Split Storybook into its own presentation box? | **No** | Storybook is Application lab; consumes same Design box |
| Import kernel into shadcn-studio? | **No** | Presentation renders; kernel defines cross-package vocabulary ([kernel-authority](../../.cursor/skills/kernel-authority/SKILL.md)) |
| Metadata workspace on deleted metadata-ui? | **No — greenfield later** | Future metadata surfaces rebuild on shadcn-studio under PAS-006 |

---

## 3.2 Canonical Dependency Categories

| Category | Presentation box uses | Example |
| --- | --- | --- |
| **Compile-time** | ERP/Storybook import blocks and CSS from `@afenda/shadcn-studio` | `import { HeroSection01Block } from "@afenda/shadcn-studio"` |
| **Runtime (integration)** | ERP assembles auth + database + observability separately | `@afenda/erp` approved runtime list |
| **Metadata** | Future metadata UI consumes kernel wire + knowledge atoms — not embedded in presentation package | Greenfield slice (not live) |
| **Configuration** | Foundation disposition lane + CSS dist policy | `PKGR05A_SHADCN_STUDIO` |
| **Knowledge** | ERP labels cite PAS-004 atoms — presentation does not own meaning | Read-only at app wiring layer |

---

# 4. Blueprint Boxes

### Box → workspace authority chain

```text
Blueprint Box name: shadcn/studio Presentation (this document §4)
        ↓
package-registry.data.ts PKG-026 → @afenda/shadcn-studio
        ↓
foundation-disposition.registry.ts PKGR05A_SHADCN_STUDIO (green-lane)
        ↓
packages/shadcn-studio/ filesystem
```

| Blueprint box | Layer | Registry PKG | Why separate | Source | Reasoning (Because → Therefore) | Status | Governing PAS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **shadcn/studio Presentation** | Design | `PKG-026` → `@afenda/shadcn-studio` | Sole ERP visual owner after ADR-0027 reset | ADR-0027 · ADR-0017 · Presentation NS | **Because** parallel governed-ui stacks duplicated CSS enforcement and drifted from MCP delivery, **Therefore** one Design box owns MCP install targets, theme, blocks, and CSS export. | **live** | PAS-006 |

---

## 4.1 Blueprint Evidence Register

| ID | Source | Tier | Justifies | Link |
| --- | --- | --- | --- | --- |
| B1 | ADR-0027 | T0 | Sole presentation chain · retired packages | [`docs/adr/ADR-0027-frontend-presentation-reset.md`](../adr/ADR-0027-frontend-presentation-reset.md) |
| B2 | ADR-0017 | T0 | MCP vendor approval · install cwd | [`docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md`](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) |
| B3 | Presentation North Star | T1 | Capability expectations | [`docs/NORTHSTAR/shadcn-studio-presentation-north-star.md`](../NORTHSTAR/shadcn-studio-presentation-north-star.md) |
| B4 | PKG-026 / layer Design | T4 | Layer assignment | [`package-registry.data.ts`](../../packages/architecture-authority/src/data/package-registry.data.ts) |
| B5 | PKGR05A disposition | T5 | green-lane · gates · prohibited | [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts) |
| B6 | ERP globals.css | T5 | Three-layer CSS composition | [`apps/erp/src/app/globals.css`](../../apps/erp/src/app/globals.css) |

---

## 4.2 Box Responsibility Matrix

| Blueprint box | Owns (architectural) | Never owns (explicit exclusions) | Trace |
| --- | --- | --- | --- |
| **shadcn/studio Presentation** | MCP install targets (`packages/shadcn-studio` cwd) · stock primitives · blocks · theme presets · `shadcn-studio.css` export · block registry parity · Storybook lab parameters | Kernel branded IDs and context resolution · permission evaluation · database schema · business workflows · metadata workspace semantics · accounting posting · legacy `@afenda/ui` / appshell / metadata-ui / css-authority pipelines · `ui:guard*` enforcement | Presentation NS §4 · PAS-006 scope |

**Kernel boundary (PAS-001 doctrine):**

```text
@afenda/kernel          → cross-package vocabulary (shape)
@afenda/enterprise-knowledge → accepted business meaning
@afenda/shadcn-studio   → rendering surfaces (presentation)
apps/erp                → composes all three at Application layer
```

`PKGR05A_SHADCN_STUDIO` prohibited includes `do-not-import-kernel-runtime` and `do-not-import-legacy-ui-or-appshell`.

---

## 4.3 Change Impact Matrix

| If this box changes… | PAS impacted | Registry PKG | Primary gates / tests | ADR required |
| --- | --- | --- | --- | --- |
| **shadcn/studio Presentation** | PAS-006 | `PKG-026` | `pnpm --filter @afenda/shadcn-studio typecheck` · `test:run` · `build` · `pnpm --filter @afenda/erp typecheck` · `pnpm sync:package-css-dist` · `pnpm check:package-css-dist-sync` · `pnpm quality:boundaries` | ADR-0027 amendment if chain changes |
| **New presentation box** | New PAS + §10 row | New PKG via registry owner | Architecture + disposition gates | Yes |
| **Restore retired UI package** | Retired PAS-005 family | Archive-lane PKG | — | **Yes — mandatory** |

---

# 5. Composition and Consumers

```mermaid
flowchart LR
  MCP["shadcn/studio MCP\n+ shadcn CLI"] --> SS["@afenda/shadcn-studio\nDesign layer"]
  SS --> ERP["apps/erp\nApplication"]
  SS --> SB["apps/storybook\nApplication"]
  AUTH["@afenda/auth"] --> ERP
  DB["@afenda/database"] --> ERP
  OBS["@afenda/observability"] --> ERP
  KERNEL["@afenda/kernel"] -.->|"PAS-001A spine\n(not via shadcn-studio)"| ERP
```

| Blueprint box | Declared consumers | Dependency category (§3.2) | Notes |
| --- | --- | --- | --- |
| **shadcn/studio Presentation** | `apps/erp` · `apps/storybook` | Compile-time | PAS-006 **Consumers** ⊆ this list |
| **ERP Application** | End users | Runtime | Approved runtime: auth, database, observability, shadcn-studio |

**Approved runtime edges** (machine truth — link only):

- `@afenda/erp` → `@afenda/shadcn-studio`
- `@afenda/storybook` → `@afenda/shadcn-studio`
- `@afenda/shadcn-studio` → *(none)*

Source: [`dependency-registry.data.ts`](../../packages/architecture-authority/src/data/dependency-registry.data.ts)

---

## 5.1 Cross-box Composition

**Presentation delivery chain (conceptual):**

```text
shadcn/studio MCP + CLI (vendor)
        ↓ install cwd: packages/shadcn-studio
shadcn/studio Presentation box
        ├── src/components/ui/        (primitives)
        ├── src/components/shadcn-studio/blocks/  (blocks)
        ├── src/theme/                (presets · customizer)
        └── src/styles/shadcn-studio.css → dist/
        ↓ compile-time import
apps/storybook  (block verification lab)
apps/erp        (product shell + routes)
        ↓ parallel (not through shadcn-studio)
ERP Integration Spine (PAS-001A) + kernel vocabulary
```

| Upstream box | Downstream box | Relationship (conceptual) | Category (§3.2) |
| --- | --- | --- | --- |
| shadcn/studio MCP | shadcn/studio Presentation | feeds install artifacts | Configuration |
| shadcn/studio Presentation | ERP Application | supplies blocks + CSS | Compile-time |
| shadcn/studio Presentation | Storybook Application | supplies blocks for lab stories | Compile-time |
| Kernel Vocabulary | ERP Application | supplies wire context (not presentation) | Compile-time |
| Enterprise knowledge | ERP Application | supplies accepted labels (representations) | Knowledge |

**ERP CSS composition** (PAS-006 three-layer import — order matters):

```txt
apps/erp/src/app/globals.css
  1. @import "@afenda/shadcn-studio/shadcn-studio.css"   ← theme + @custom-variant (unlayered)
  2. @import "tailwindcss"
  3. @import "shadcn/tailwind.css"
```

Dist sync (single policy target):

```txt
packages/shadcn-studio/src/styles/shadcn-studio.css
  → packages/shadcn-studio/dist/shadcn-studio.css
```

Source: [`package-css-dist-policy.mjs`](../../scripts/governance/package-css-dist-policy.mjs) · [`apps/erp/src/app/globals.css`](../../apps/erp/src/app/globals.css)

**MCP install doctrine:**

```text
MCP install (packages/shadcn-studio cwd)
  → @afenda/shadcn-studio/src/blocks|components/ui/
  → import in apps/erp
  → pnpm --filter @afenda/shadcn-studio typecheck
  → pnpm --filter @afenda/erp typecheck && build
```

---

# 6. Filesystem Map (reference paths)

| Surface | Path | Role |
| --- | --- | --- |
| Public barrel | `packages/shadcn-studio/src/index.ts` | Block exports · theme · registry |
| Primitives | `packages/shadcn-studio/src/components/ui/` | shadcn CLI targets |
| Blocks | `packages/shadcn-studio/src/components/shadcn-studio/blocks/` | MCP-installed blocks |
| Theme | `packages/shadcn-studio/src/theme/theme-presets.ts` | JSON-serializable presets |
| Block registry | `packages/shadcn-studio/src/registry/studio-block-parity.registry.ts` | Parity inventory |
| CSS source | `packages/shadcn-studio/src/styles/shadcn-studio.css` | Authoring surface |
| CSS dist | `packages/shadcn-studio/dist/shadcn-studio.css` | App import target |
| ERP globals | `apps/erp/src/app/globals.css` | Composition entry |
| Storybook stories | `apps/storybook/stories/shadcn-studio-*.stories.tsx` | Block verification |
| MCP config | `.cursor/mcp.json` · `shadcn-studio.config.json` | Agent install paths |
| Agent skill | `.cursor/skills/shadcn-studio/SKILL.md` | Operational workflow |

---

# 7. PAS Creation Gate

PAS-006 exists and satisfies §7 for the live box. Before **any new** presentation box:

1. Box exists in §4 (box name — not PKG alone)
2. §3.1 Architecture Decision Matrix recorded in §4 Reasoning
3. §4.2 Box Responsibility row exists
4. Layer declared (Design)
5. **Why separate** in §4 (matrix outcome)
6. Registry PKG linked or `planned` via `@foundation-registry-owner`
7. Status is `live`, `planned`, or `blocked` (not `retired`)
8. PAS number from [PAS index](../PAS/README.md)
9. Required ADR exists (§8 if blocked)
10. §4.3 impact row exists when box is new, split, merged, or layer-changed

---

# 8. Blocked and Retired Boxes

| Blueprint box | Registry PKG | Status | Blocker / retire ADR | Required before proceeding |
| --- | --- | --- | --- | --- |
| Governed UI primitives | `@afenda/ui` | **retired** | ADR-0027 | New ADR + Blueprint amendment to recreate |
| ERP shell (legacy) | `@afenda/appshell` | **retired** | ADR-0027 | Same |
| Metadata UI (legacy) | `@afenda/metadata-ui` | **retired** | ADR-0027 | Greenfield on shadcn-studio instead |
| UI composition (legacy) | `@afenda/ui-composition` | **retired** | ADR-0027 | Same |
| CSS authority (legacy) | `@afenda/css-authority` · `PKGR05_CSS_AUTHORITY` | **retired** | ADR-0027 | Theme surface lives in shadcn-studio |
| Design system (legacy) | `@afenda/design-system` · `PKGR05B_DESIGN_RETIREMENT` | **retired** | ADR-0025 · ADR-0027 | Do not recreate package |
| Metadata workspace UI | — | **planned / greenfield** | Presentation NS non-goal until PAS-006 slice | Author slice under PAS-006 |

Disposition: `archive-lane` for retired PKG rows in [`foundation-disposition.registry.ts`](../../packages/architecture-authority/src/data/foundation-disposition.registry.ts).

---

# 9. Blueprint → PAS Handoff Contract

| §4 field | Pre-fills PAS-006 |
| --- | --- |
| Blueprint box name | Metadata `Blueprint box` — **shadcn/studio Presentation** |
| Registry PKG | `@afenda/shadcn-studio` |
| Layer | Design |
| §4.2 Owns / never owns | PAS §2 boundary distill |
| §5 consumers | Metadata `Consumers`: `apps/erp`, `apps/storybook` |
| §8 retired boxes | PAS §0 hard stops · agent prohibited list |

PAS owns: CSS authority detail · public contract rules · §13 gates. Blueprint does not duplicate gate commands.

---

# 10. PAS Inventory

**Total PAS at maturity: 1**

| PAS | Title | Blueprint box (§4) | Live / Total slices | Status |
| --- | --- | --- | --- | --- |
| PAS-006 | shadcn-studio Frontend Standard | shadcn/studio Presentation | — / — | **Active** · Production Candidate |

Retired: PAS-005 family merged into PAS-006 per ADR-0027.

---

# 11. PAS Maturity Rollup (read-only)

| Blueprint box | Registry PKG | PAS | Maturity |
| --- | --- | --- | --- |
| shadcn/studio Presentation | `PKG-026` → `@afenda/shadcn-studio` | PAS-006 | Production Candidate |

---

# 12. How to Add Presentation Scope

1. Confirm capability in [Presentation North Star](../NORTHSTAR/shadcn-studio-presentation-north-star.md) — or amend NS first
2. Run **§3.1 Architecture Decision Matrix** — default: extend existing box, not new box
3. For MCP blocks: follow [shadcn-studio SKILL](../../.cursor/skills/shadcn-studio/SKILL.md) install cwd `packages/shadcn-studio`
4. Add Storybook story before ERP route wiring (Presentation NS capability 3)
5. Sync CSS dist after theme/CSS edits: `pnpm sync:package-css-dist -- --package @afenda/shadcn-studio`
6. Run PAS-006 §0 gates before claiming done
7. New **/ **box** (rare): §7 gate → ADR → `@foundation-registry-owner` → PAS

---

# 13. Agent Execution Rules

## Vibe-coding entry checklist

- [ ] Target box **shadcn/studio Presentation** has §4 row · status **live**
- [ ] §4.2 responsibility understood — no kernel imports in shadcn-studio
- [ ] PAS-006 loaded · maturity permits coding
- [ ] [shadcn-studio SKILL](../../.cursor/skills/shadcn-studio/SKILL.md) loaded for MCP/UI work
- [ ] [package-css-dist-sync SKILL](../../.cursor/skills/package-css-dist-sync/SKILL.md) when editing `src/styles/`
- [ ] `/afenda-coding-session` Phase 0 from slice when slice exists — not invented from Blueprint prose

## Agent decision matrix

| Question | If yes → |
| --- | --- |
| MCP block install or theme work? | shadcn-studio SKILL · cwd `packages/shadcn-studio` |
| CSS source edited? | sync dist + `pnpm check:package-css-dist-sync` |
| Kernel ID or OperatingContext in presentation package? | **Stop** — kernel-authority · move to ERP spine or kernel |
| Restore appshell/ui/css-authority? | **Stop** — ADR-0027 · §8 retired |
| Registry lane change? | `@foundation-registry-owner` |
| Business label / term authority? | enterprise-knowledge PAS-004 — not presentation box |

## Runtime chain (implement mode)

```text
§4 box live + PAS-006 §0
        ↓
shadcn-studio SKILL (MCP) or direct package edit
        ↓
Storybook verification (when block-level)
        ↓
ERP import + globals.css unchanged unless CSS chain intentional
        ↓
PAS-006 gates → disposition check
```

---

# 14. Required Reviews and References

## Before accepting Blueprint amendments

- [ ] §4 box traces to Presentation North Star capabilities
- [ ] §3.1 matrix outcome in §4 Reasoning
- [ ] §4.2 responsibility complete · kernel boundary explicit
- [ ] §5 consumers match `dependency-registry.data.ts`
- [ ] No PKG table duplication — registry links only
- [ ] Retired boxes listed in §8 with ADR citations
- [ ] No gate commands duplicated from PAS-006 §13

## References

| Document | Role |
| --- | --- |
| Presentation North Star | [`shadcn-studio-presentation-north-star.md`](../NORTHSTAR/shadcn-studio-presentation-north-star.md) |
| Constitutional ADR | [`ADR-0027-frontend-presentation-reset.md`](../adr/ADR-0027-frontend-presentation-reset.md) |
| MCP vendor ADR | [`ADR-0017-shadcn-studio-ui-delivery-acceleration.md`](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) |
| PAS-006 | [`PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md`](../PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) |
| Platform Blueprint rollup | [`afenda-architecture-blueprint.md`](../architecture/afenda-architecture-blueprint.md) |
| Blueprint template | [`.cursor/skills/kernel-authority/reference/blueprint-template.md`](../../.cursor/skills/kernel-authority/reference/blueprint-template.md) |
| shadcn-studio SKILL | [`.cursor/skills/shadcn-studio/SKILL.md`](../../.cursor/skills/shadcn-studio/SKILL.md) |
| kernel-authority SKILL | [`.cursor/skills/kernel-authority/SKILL.md`](../../.cursor/skills/kernel-authority/SKILL.md) |
| package-css-dist-sync SKILL | [`.cursor/skills/package-css-dist-sync/SKILL.md`](../../.cursor/skills/package-css-dist-sync/SKILL.md) |

---

# 15. Final Doctrine

This Blueprint owns **what presentation box exists, why it is separate from kernel and retired UI stacks, how MCP → shadcn-studio → apps composes, what the box owns, and which PAS governs it**.

| Identity | Owner | Changes when |
| --- | --- | --- |
| **Blueprint Box name** | This document §4 | Architectural split/merge (ADR + §4.3) |
| **`@afenda/shadcn-studio`** | `package-registry.data.ts` PKG-026 | Rename/scaffold — box unchanged |
| **Lane / disposition** | `foundation-disposition.registry.ts` PKGR05A | `@foundation-registry-owner` |

Presentation North Star owns **capability expectations**. PAS-006 owns **contracts and gates**. Kernel and Enterprise Knowledge own **shape and meaning** — ERP composes them at the Application layer.

> **May belong here:** §3.1 matrix · §4 boxes + §4.1–§4.3 · §5 + §5.1 composition · §8 retired boxes · §9 handoff · §10 inventory.

> **Belongs in PAS-006:** boundary sentence, CSS rules, public contract detail, §13 gates.

> **Belongs in shadcn-studio SKILL:** MCP workflows, toolbar commands, pro-block install scripts.
