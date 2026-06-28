# PAS-005A — shadcn/studio Presentation Authority Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-005A |
| **Document class** | `package_authority_standard` |
| **Document role** | `post_mvp_rollout` |
| **Canonical filename** | `PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md` |
| **Parent PAS** | [PAS-005 — CSS Authority](PAS-005-CSS-AUTHORITY-STANDARD.md) |
| **Package** | `@afenda/shadcn-studio` |
| **Layer** | Design / Presentation |
| **Package role** | Standalone shadcn/studio product — theme surface, preset runtime, MCP seed path, governed blocks and primitives |
| **Runtime stance** | `presentation-runtime` (theme preset application, settings persistence, lab verification) |
| **Registry lane** | `green-lane` — `PKGR05A_SHADCN_STUDIO` · PKG-026 |
| **Package owner** | Design Authority |
| **Agent skill** | `shadcn-studio-authority` · `.cursor/skills/shadcn-studio-authority/SKILL.md` |
| **Maturity** | MVP Authority (`mvp_authority`) |
| **Authority status** | `accepted_for_boundary` |
| **Implementation status** | `implemented` (Phase 1) |
| **Evidence level** | `presentation-runtime` |
| **Runtime status** | B42p delivered — delegating-flip policy registry (68 rows); zero new flips; strangler sequence complete |
| **Remaining slices** | none — strangler complete; optional ERP feature delegating per block when a11y parity lands |
| **Consumers** | `apps/storybook` (lab), `apps/erp` (post B42 only), `@afenda/appshell` (transitional re-export until cutover) |
| **Change model** | `serialized-slices` |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **ADR prerequisites** | [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) (Accepted) |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/shadcn-studio typecheck` |
| 2 | `pnpm --filter @afenda/shadcn-studio test:run` |
| 3 | `pnpm --filter @afenda/shadcn-studio build` |
| 4 | `pnpm check:foundation-disposition` |
| 5 | `pnpm quality:boundaries` |

> **Maturity is part of authority.**
> MVP Authority permits package scaffold, theme preset contracts, MCP install cwd, and lab verification. It does **not** permit claiming Enterprise Accepted, deleting `@afenda/appshell` legacy studio paths, or wiring ERP runtime until B42 integration gates pass.

> **Derived from PAS-005.** PAS-005 owns the **CSS-TOKEN registry**, Afenda token bridge, consumption gates (R23–R30), and `afenda-ui.css` runtime cutover. PAS-005A owns the **shadcn/studio presentation product** — vendored shadcn theme surface, runtime theme presets, ThemeCustomizer, MCP seed pipeline, and governed block/primitive inventory. Integration between the two is a **deferred slice (B42)**, not a prerequisite for Phase 1 standalone delivery.

> **Canonical location:** `docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md`
> **Package-local pointer:** `packages/shadcn-studio/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md` (create with package scaffold)

---

# 0. Agent Quick Path

> Read this section first for IDE/agent work. Full detail in §1–§15. Execution adapter: `.cursor/skills/shadcn-studio-authority/SKILL.md` (target)

**Boundary:** `@afenda/shadcn-studio` owns **shadcn/studio theme surface, preset vocabulary, runtime preset application, MCP install targets, and governed presentation blocks/primitives**; it never owns CSS-TOKEN registry authority, Afenda `--afenda-*` token decisions, ERP route wiring, AppShell chrome authority, permission evaluation, or business domain behavior.

**Hard stops (summary):**

- **Prohibited imports (Phase 1):** `@afenda/css-authority`, `@afenda/design-system`, `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, `apps/erp`, `@afenda/kernel` business resolvers
- **Must never own:** CSS-TOKEN-* registry edits, `--afenda-*` token source, Governed UI primitive governance, AppShell shell chrome blocks, ERP data fetching, legacy appshell studio migration

**Required gates:** see §13.1

**Slice entrypoint:** [`docs/PAS/slice/b38-pas005a-scaffold.md`](slice/b38-pas005a-scaffold.md) · Planner: `pas-slice-planner` · Session: `/afenda-coding-session`

**Registry:** `PKGR05A_SHADCN_STUDIO` — **green-lane** in `foundation-disposition.registry.ts` (PKG-026)

**Phase 1 rule:** Build the standalone product **Afenda-free**. Do not wire `@afenda/css-authority` or ERP globals until B42.

---

# 1. Package Definition

`@afenda/shadcn-studio` is the **presentation-layer product** derived from [PAS-005](PAS-005-CSS-AUTHORITY-STANDARD.md). Where PAS-005 defines *what CSS tokens mean* and how Afenda consumes them at runtime, PAS-005A defines *how shadcn/studio themes, presets, primitives, and blocks are authored, installed, switched, and verified* as a cohesive package.

Phase 1 delivers a **standalone shadcn/studio stack** with no dependency on Afenda governance packages. Phase 2 (slice B42+) integrates the product into Afenda ERP: retarget MCP promotion, map presets to css-authority bridge, relocate governed blocks to `packages/appshell/src/presentation/` (legacy `shadcn-studio/` path deleted in B42h), and wire ERP via governed exports and bridge.

> **What this package answers:** Which shadcn CSS variables constitute the base theme? Which named presets exist? How does runtime preset switching work? Where do MCP-installed primitives and blocks live? How is the product verified in lab/Storybook?

> **What it must not answer:** What is the canonical Afenda token for `--surface-elevated`? Which ERP route renders this block? Does the user have permission? What is the accounting posting rule?

Constitutional delivery acceleration remains [ADR-0017](../adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md). ADR-0017 promotion targets point at `@afenda/shadcn-studio` for MCP seed; governed Afenda blocks live under `packages/appshell/src/presentation/` (B42h).

---

# 2. One-Sentence Boundary

**`@afenda/shadcn-studio` owns shadcn/studio theme surface, preset vocabulary, runtime preset application, MCP install targets, and governed presentation blocks/primitives; it never owns CSS-TOKEN registry authority, Afenda token bridge decisions, AppShell chrome, ERP wiring, or business behavior.**

---

# 3. Dependency Rules

## 3.1 Allowed (Phase 1 — standalone)

| Dependency class | Examples | Notes |
| --- | --- | --- |
| React / Next.js (lab app only) | `react`, `next`, `next-themes` | Lab app under `apps/` or package dev harness — not ERP |
| shadcn ecosystem | `@radix-ui/*`, `class-variance-authority`, `tailwind-merge`, `lucide-react` | Standard shadcn stack |
| Tailwind v4 | `@tailwindcss/postcss`, `tailwindcss` | Theme via CSS variables |
| MCP / CLI install artifacts | `@ss-components/*`, `@ss-blocks/*`, `@ss-themes/*` | Installed into package tree per §4.4 |
| Reference catalog (read-only) | `_reference/shadcn-nextjs-admincn-admin-template-1.0.0/` | **Never import into runtime** — port patterns only |

## 3.2 Prohibited imports (Phase 1)

```
@afenda/css-authority   @afenda/design-system   @afenda/ui
@afenda/appshell        @afenda/metadata-ui     @afenda/kernel
@afenda/permissions     @afenda/database        apps/erp
```

Phase 1 agents must not add these imports "for convenience." B42 defines the integration boundary.

## 3.3 Prohibited imports (Phase 2 — B42 integration only)

When B42 opens, `@afenda/shadcn-studio` may import `@afenda/css-authority` **CSS dist exports only** (no TS registry mutation from this package). It must still not import `@afenda/ui` primitives into studio block source without a dedicated governance slice.

## 3.4 Import rule

Use relative imports inside `packages/shadcn-studio/src/**`. Never `from "@afenda/shadcn-studio"` inside the package. Cross-package consumers import the public barrel only after B42 documents exports.

---

# 4. Authority Surfaces

## 4.1 Base theme CSS (`shadcn-studio.css`)

**Authority:** PAS-005 §4.1 (shadcn theme vocabulary) — **derived, not duplicated**

**Implementation (target):** `packages/shadcn-studio/src/styles/shadcn-studio.css`

**Slice gate:** B38 scaffold + B40 MCP `install-theme`

The base theme defines standard shadcn CSS variables (`--background`, `--foreground`, `--primary`, …) in `:root` and `.dark`. In Phase 1 this file is **standalone** — not generated from css-authority JSON. On B42, variables must **align** with PAS-005 vendored shadcn theme (`packages/css-authority/src/theme/shadcn-theme.css`) without forking semantics.

**Status:** Delivered (B38 scaffold — standalone base theme stub)

## 4.2 Theme preset registry (`theme-presets.ts`)

**Authority:** PAS-005A (new surface)

**Implementation (target):** `packages/shadcn-studio/src/theme/theme-presets.ts`

**Reference pattern:** `_reference/.../src/utils/theme-presets.ts` — 12 named presets + `default`

| Preset slug | Role |
| --- | --- |
| `default` | No inline overrides — falls back to base `shadcn-studio.css` |
| `caffeine`, `claude`, `corporate`, `ghibli-studio`, `marvel`, `material-design`, `modern-minimal`, `nature`, `perplexity`, `slack`, `pastel-dreams` | Full light/dark oklch variable maps |

Preset slugs are **stable public vocabulary**. Adding or renaming a slug requires a slice handoff and semver note in package changelog.

**Status:** Target

## 4.3 Runtime settings + preset application

**Authority:** PAS-005A · ADR-0017 §2 (adapted for standalone lab)

**Implementation (target):**

| Module | Responsibility |
| --- | --- |
| `settings-context.tsx` | Applies preset via `document.documentElement.style.setProperty('--*', …)`; persists settings (cookie or localStorage in lab) |
| `theme-config.ts` | Default preset, radius, font, scale |
| `ThemeCustomizer.tsx` | UI for preset, mode (light/dark/system), radius, font, layout toggles |

**Runtime rules:**

- `default` preset **removes** inline overrides (restores base CSS)
- Named presets **inject** complete variable maps on `<html>`
- `next-themes` handles color mode; preset handles palette within mode
- No silent fallback to a corporate Afenda theme in Phase 1

**Status:** Target

## 4.4 MCP install pipeline

**Authority:** ADR-0017 §1–§2 · PAS-005A §9

**Canonical install cwd (target):** `packages/shadcn-studio`

| MCP workflow | Delivers | Target path |
| --- | --- | --- |
| `install-theme` | Theme + cssVars | `src/styles/` merge into base theme |
| `/rui` collect → install | `@ss-components/*` | `src/components/ui/` |
| `/cui` collect → install | `@ss-blocks/*` | `src/blocks/` |

**Collection rule (ADR-0017 / shadcn-studio MCP):** Collect **all** selected items before any install command. Do not interleave `get-component-content` during collection.

**Credentials:** `.env.secret` → `SHADCN_STUDIO_ACCOUNT_EMAIL`, `SHADCN_STUDIO_LICENSE_KEY` — never committed.

**Config files (retarget on B38):**

- `.cursor/mcp/shadcn-studio.mjs`
- `shadcn-studio.config.json`
- `packages/shadcn-studio/components.json`

**Status:** Delivered — cwd retargeted to `packages/shadcn-studio` (B38)

## 4.5 Primitives inventory (`components/ui/`)

**Authority:** PAS-005A · shadcn standard primitives

**Implementation (target):** `packages/shadcn-studio/src/components/ui/**`

MCP `/rui` seeds Radix-based primitives. Phase 1 uses **stock shadcn className patterns** — Governed UI governed props are **out of scope** until B42.

**Status:** Target

## 4.6 Blocks inventory (`blocks/`)

**Authority:** PAS-005A · ADR-0017 block catalog

**Implementation (target):** `packages/shadcn-studio/src/blocks/**`

MCP `/cui` seeds Pro blocks. Each block requires Storybook story + test before B41 close.

**Legacy rule:** Do **not** migrate from deleted `packages/appshell/src/shadcn-studio/` path. Re-seed via MCP into `@afenda/shadcn-studio`; governed Afenda blocks live under `packages/appshell/src/presentation/` (B42h relocation).

**Status:** Target

## 4.7 Lab verification harness

**Authority:** PAS-005A §11

**Implementation (target):** `apps/storybook` stories importing `@afenda/shadcn-studio` **or** package-local Storybook — decision in B41 handoff

Minimum proof:

- ThemeCustomizer switches all 12 presets in light and dark
- Representative primitive renders (`Button`, `Card`, `DataTable`)
- At least one MCP-seeded block story

**Status:** Target

## 4.8 Afenda integration bridge (deferred — B42)

**Authority:** PAS-005 §4 + PAS-005A §10

**Not Phase 1.** B42 owns:

- Import chain: `afenda-ui.css` → shadcn-studio theme alignment
- Map `--app-shell-studio-*` bridge (today in appshell CSS) to css-authority domain sync
- Retarget ADR-0017 promotion pipeline terminus (`@afenda/shadcn-studio`)
- Relocate governed blocks to `packages/appshell/src/presentation/` — legacy `shadcn-studio/` path deleted (B42h); **`afenda-appshell-studio.css` retained**
- Enable `pnpm ui:guard` on promoted blocks

**Status:** Delivered — B42 integration bridge + B42h legacy path delete + B42i wrapper strangler (Phase 1)

---

# 5. What This Package Must Never Own

- **CSS-TOKEN-* registry** or `packages/css-authority/src/data/**` JSON authority — PAS-005 only
- **`--afenda-*` token source** or design-system variant/recipe registries — `@afenda/design-system`
- **Foundation phase 04 governed primitive policy** on `@afenda/ui` — separate governance slice
- **AppShell chrome** (`application-shell`, `dashboard-shell`, `dashboard-sidebar`) — `@afenda/appshell` / Foundation phase 06
- **ERP routes, server actions, data fetching** — `apps/erp`
- **Legacy studio migration** — do not copy deleted `shadcn-studio/` TSX; re-seed via MCP; governed blocks under `presentation/`
- **Direct `_reference/` runtime imports** — read-only catalog
- **Permission, tenant, or execution context resolution**
- **New npm dependencies** without ADR-0003 / dependency-registry entry (applies from B40 onward)

---

# 6. Package Structure Standard

## 6.1 Target tree

```text
packages/shadcn-studio/
├── PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md   # pointer only
├── components.json                                    # shadcn CLI + MCP registry
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                                       # public exports (expand on B42)
│   ├── styles/
│   │   └── shadcn-studio.css                          # base theme
│   ├── theme/
│   │   ├── theme-presets.ts                           # preset vocabulary
│   │   ├── theme-config.ts                            # defaults
│   │   ├── settings-context.tsx                       # runtime application
│   │   └── ThemeCustomizer.tsx                        # lab UI
│   ├── components/
│   │   └── ui/                                        # @ss-components seed
│   └── blocks/                                        # @ss-blocks seed
└── src/__tests__/                                     # preset + CSS contract tests
```

## 6.2 `package.json` exports (target)

```json
{
  "exports": {
    "./shadcn-studio.css": "./dist/shadcn-studio.css",
    ".": "./dist/index.js"
  }
}
```

Dist sync follows [`package-css-dist-sync`](../../.cursor/rules/package-css-dist-sync.mdc) once CSS sources exist.

**Status:** Partial — B38 scaffold delivered; dist CSS copy on build

---

# 7. Decision Matrix

| Question | If yes → | In `@afenda/shadcn-studio`? |
| --- | --- | --- |
| Is it a shadcn CSS variable or preset palette? | Theme / preset surface | **Yes** |
| Is it runtime preset switching or ThemeCustomizer UI? | Presentation runtime | **Yes** |
| Is it an MCP-installed primitive or block? | Inventory under `components/ui` or `blocks` | **Yes** |
| Is it a CSS-TOKEN-* registry entry? | Authority JSON | **No** — PAS-005 |
| Is it an `--afenda-*` semantic token? | Afenda extension | **No** — PAS-005 / design-system |
| Is it `--app-shell-*` geometry? | AppShell chrome | **No** — `@afenda/appshell` |
| Is it Governed UI governed primitive props? | UI governance | **No** — `@afenda/ui` (B42+ only) |
| Is it ERP route wiring or server data? | Application layer | **No** — `apps/erp` |
| Is it copying from `_reference/` into runtime? | Prohibited bypass | **No** — port patterns only |
| Is it migrating legacy appshell studio files? | Wrong approach | **No** — re-seed via MCP; delete legacy |
| Is it lab/Storybook verification of presets? | Product proof | **Yes** |
| Is it css-authority consumption gate R23–R30? | PAS-005 governance | **No** — until B42 alignment slice |

---

# 8. Contract Rules

1. TypeScript strict mode in all package TS
2. Preset slugs are `as const` union types — no free-form strings in public API
3. Theme preset maps use `readonly` properties
4. Settings wire shape (cookie/localStorage) must be JSON-serializable
5. No side effects on import — preset application only in client runtime providers
6. No hidden Afenda tenant or brand fallbacks in Phase 1
7. CSS variable names must match shadcn standard vocabulary (same names PAS-005 vendored theme uses)
8. No duplicate CSS-TOKEN registry in this package
9. Block/primitive files retain MCP provenance comment header until normalized in B42
10. Public exports documented before B42 ERP wiring

---

# 9. Runtime Rules

Runtime code is allowed in `@afenda/shadcn-studio` when **all** are true:

1. Supports theme preset application or settings persistence
2. No database, auth, or permission access
3. No Afenda package imports in Phase 1
4. Tested in lab/Storybook
5. Fails closed on invalid preset slug (reject, do not silently use `default` unless explicitly requested)

**Approved runtime primitives (Phase 1):**

| Primitive | Module | Purpose |
| --- | --- | --- |
| Preset application | `settings-context.tsx` | Apply/remove CSS variables on `<html>` |
| Settings persistence | `settings-context.tsx` | Lab cookie/localStorage |
| Theme mode | `next-themes` integration | light/dark/system |

**Not approved in Phase 1:** ERP cookie names, tenant theme resolution, css-authority bridge loaders

---

# 10. Implementation Sequence

Execute slices in order. Do not start B42 until B41 lab gates pass.

| Step | Slice | Deliverable |
| --- | --- | --- |
| 1 | **B38** | Package scaffold, `components.json`, MCP cwd retarget, tombstone pointer, registry proposal |
| 2 | **B39** | Port theme preset system from `_reference` (13 presets + SettingsProvider + ThemeCustomizer) |
| 3 | **B40** | MCP seed: `install-theme`, `/rui` primitives, `/cui` starter blocks |
| 4 | **B41** | Lab/Storybook verification — all presets × modes |
| 5 | **B42** | Afenda integration — css-authority alignment, ADR-0017 retarget, delete appshell legacy, `ui:guard` |

**Do not add in Phase 1:**

- `@afenda/css-authority` imports
- `STUDIO-PATTERN-MAP` normalization (B42)
- `afenda-appshell-studio.css` bridge
- ERP block wiring

---

# 11. Enterprise Acceptance Criteria

## 11.1 Architecture

| Criterion | Phase 1 (B41) | Target (B42+) |
| --- | --- | --- |
| Standalone package with zero Afenda imports | Required | Maintained until B42 |
| MCP cwd = `packages/shadcn-studio` | Required | Required |
| Legacy appshell studio untouched | Required | Deleted after B42 parity |
| PAS-005 CSS-TOKEN registry unchanged | Required | Required |

## 11.2 Presentation

| Criterion | Required |
| --- | --- |
| 12 named presets + `default` render in lab | Yes |
| ThemeCustomizer switches preset without full page reload | Yes |
| light/dark/system modes work per preset | Yes |
| Base `shadcn-studio.css` loads without preset overrides | Yes |

## 11.3 MCP seed

| Criterion | Required |
| --- | --- |
| At least 5 primitives from `/rui` | Yes (B40) |
| At least 2 blocks from `/cui` | Yes (B40) |
| Collection-before-install rule documented in slice proof | Yes |

## 11.4 Governance (B42 only)

| Criterion | Required |
| --- | --- |
| ADR-0017 promotion terminus updated | B42 |
| css-authority shadcn theme parity check | B42 |
| `pnpm ui:guard` on integrated blocks | B42 |
| Registry lane `PKGR05A_SHADCN_STUDIO` promoted | B42 |

---

# 12. Relationship to PAS-005

| Concern | PAS-005 (`@afenda/css-authority`) | PAS-005A (`@afenda/shadcn-studio`) |
| --- | --- | --- |
| CSS-TOKEN registry | **Owns** | Must not edit |
| Vendored shadcn theme file | **Owns** (`shadcn-theme.css`) | **Derives** aligned copy in Phase 1; **syncs** on B42 |
| Afenda extension tokens | **Owns** (`--afenda-*`) | Out of scope Phase 1 |
| Theme preset runtime | Does not own | **Owns** |
| ThemeCustomizer UI | Does not own | **Owns** |
| MCP install target | Indirect (via appshell/ui today) | **Owns** (B38+) |
| Consumption gates R23–R30 | **Owns** | N/A until B42 |
| ERP runtime import | `afenda-ui.css` | Lab only until B42 |

**Doctrine:** PAS-005 owns the **words** (token registry). PAS-005A owns the **presentation product** (theme experience + studio inventory). B42 owns the **bridge** between them.

---

# 13. Required Gates

## 13.1 Package gates (from B38)

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/shadcn-studio build
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio   # when CSS exists
pnpm check:package-css-dist-sync                                  # when CSS exists
```

## 13.2 Workspace gates

```bash
pnpm check:foundation-disposition
pnpm quality:boundaries
pnpm architecture:drift
```

## 13.3 Integration gates (B42 only)

```bash
pnpm check:css-authority-conformance
pnpm check:css-visual-regression
pnpm ui:guard:scan
pnpm ui:guard
```

---

# 14. Slice Sequence

| Slice | Scope | Status |
| --- | --- | --- |
| B38 | [Package scaffold + MCP retarget](slice/b38-pas005a-scaffold.md) | Delivered |
| B39 | [Theme presets + SettingsProvider + ThemeCustomizer](slice/b39-pas005a-theme-presets.md) | Delivered |
| B40 | [MCP seed — theme, primitives, blocks](slice/b40-pas005a-mcp-seed.md) | Delivered (manual seed equivalent) |
| B41 | Lab / Storybook verification | Delivered |
| B42 | Afenda integration — css-authority bridge, ADR-0017 retarget, metadata-ui hook, bridge + legacy path delete | **Delivered** — legacy delete in B42h; Phase 1 wrappers in B42i — [`slice/b42-pas005a-afenda-integration.md`](slice/b42-pas005a-afenda-integration.md) |
| B42b | Legacy parity inventory + delete planning | **Delivered (planning)** — **Superseded** by B42h execution — [`slice/b42b-pas005a-legacy-delete-planning.md`](slice/b42b-pas005a-legacy-delete-planning.md) |
| B42c | MCP live re-seed — replace B40 placeholders | **Delivered** — [`slice/b42c-pas005a-mcp-live-reseed.md`](slice/b42c-pas005a-mcp-live-reseed.md) |
| B42d | Appshell re-export bridge + parity registry | **Delivered** — [`slice/b42d-pas005a-appshell-reexport-bridge.md`](slice/b42d-pas005a-appshell-reexport-bridge.md) |
| B42e | Extended `/cui` batch — account-settings + dashboard | **Delivered** — [`slice/b42e-pas005a-extended-cui-batch.md`](slice/b42e-pas005a-extended-cui-batch.md) |
| B42f | Dashboard/shell bridge expansion | **Delivered** — [`slice/b42f-pas005a-dashboard-shell-bridge-expansion.md`](slice/b42f-pas005a-dashboard-shell-bridge-expansion.md) |
| B42g | Residual shell/content parity — delete gate open | **Delivered** — [`slice/b42g-pas005a-residual-shell-content-parity.md`](slice/b42g-pas005a-residual-shell-content-parity.md) |
| B42h | Legacy tree delete — `presentation/` relocation | **Delivered** — [`slice/b42h-pas005a-legacy-tree-delete.md`](slice/b42h-pas005a-legacy-tree-delete.md) |
| B42i | MCP wrapper strangler — Phase 1 statistics/shell/dashboard | **Delivered** — [`slice/b42i-pas005a-mcp-wrapper-strangler.md`](slice/b42i-pas005a-mcp-wrapper-strangler.md) |
| B42j | Wrapper expansion + delegating flip + MCP className policy | **Delivered** — [`slice/b42j-pas005a-wrapper-expansion-delegating-flip.md`](slice/b42j-pas005a-wrapper-expansion-delegating-flip.md) |
| B42k | Statistics MCP a11y parity + delegating flip | **Delivered** — [`slice/b42k-pas005a-statistics-a11y-delegating-flip.md`](slice/b42k-pas005a-statistics-a11y-delegating-flip.md) |
| B42l | afenda-appshell-studio.css consolidation | **Delivered** — [`slice/b42l-pas005a-studio-css-consolidation.md`](slice/b42l-pas005a-studio-css-consolidation.md) |
| B42m | Marketing/auth/chart/statistics strangler batch | **Delivered** — [`slice/b42m-pas005a-marketing-auth-chart-strangler-batch.md`](slice/b42m-pas005a-marketing-auth-chart-strangler-batch.md) |
| B42n | Account-settings content strangler batch | **Delivered** — [`slice/b42n-pas005a-account-settings-content-strangler-batch.md`](slice/b42n-pas005a-account-settings-content-strangler-batch.md) |
| B42o | Residual parity wrapperPath closure | **Delivered** — [`slice/b42o-pas005a-residual-parity-wrapper-closure.md`](slice/b42o-pas005a-residual-parity-wrapper-closure.md) |
| B42p | Governed UI policy closure + delegating-flip maintenance | **Delivered** — [`slice/b42p-pas005a-tip004-delegating-flip-policy-closure.md`](slice/b42p-pas005a-tip004-delegating-flip-policy-closure.md) |

**Next sequence item:** none — strangler complete; optional ERP feature delegating per block when a11y parity lands

---

# 15. Doctrine

PAS-005 defined Afenda's CSS token constitution. PAS-005A defines the **shadcn/studio product** that designers and agents install, preset, and verify — without dragging ERP governance into Phase 1.

> If it is a theme preset, MCP install target, or studio block inventory → it belongs in `@afenda/shadcn-studio`.
> If it is a CSS-TOKEN registry fact or Afenda semantic token → it belongs in `@afenda/css-authority`.
> If it decides ERP behavior, shell chrome, or permissions → it belongs elsewhere.

Build the product first. Bridge to Afenda second. Delete legacy — never migrate it.

---

## Appendix A — Reference catalog (read-only)

| Artifact | Path | Use |
| --- | --- | --- |
| Admin template v1.0.0 | `_reference/shadcn-nextjs-admincn-admin-template-1.0.0/` | Theme preset port source |
| Theme presets | `.../src/utils/theme-presets.ts` | 12 presets + default |
| Settings provider | `.../src/contexts/settingsContext.tsx` | Runtime application pattern |
| ThemeCustomizer | `.../src/components/layout/ThemeCustomizer.tsx` | Lab UI pattern |
| MCP server | `.cursor/mcp/shadcn-studio.mjs` | Install automation |
| ADR-0017 | `docs/adr/ADR-0017-*.md` | Delivery acceleration constitution |

**Temporary borrow inventory** — retire when B39–B40 slice handoffs absorb all references.
