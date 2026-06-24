# TIP-032 — Implementation Documentation (Fumadocs)

| Field | Value |
| --- | --- |
| **Status** | Complete |
| **Authority status** | **Accepted** — Architecture Authority parallel-track delivery TIP (2026-06-24); promoted from master plan v5 §13 |
| **Runtime evidence** | `apps/docs/vercel.json`, `apps/docs/next.config.ts`, `docs/delivery/support/fumadocs-docs-app-deploy.md` |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Foundation phase** | Post-foundation parallel track (master plan Phase 3 — does **not** gate Phases 0–9) |
| **Remaining gap** | Production docs domain DNS assignment in Vercel dashboard (operator step — see Slice 5.1 support doc) |
| **Architecture** | [`docs-app-architecture.md`](../../architecture/docs-app-architecture.md) |

## Purpose

Deliver a standalone Fumadocs-powered documentation site in `@afenda/docs` so engineers can author and publish implementation guides on port **3001**, with automated build/typecheck/test gates, **without coupling to ERP foundation runtime slices**.

ADR-0001 / ADR-0013 authority: Application-layer delivery surfaces are owned by Application Authority. This TIP is explicitly **parallel** to Foundation Phases 0–9 and must not block TIP-007A, TIP-013, or accounting gate work.

## Scope

**In scope**

- Fumadocs MDX pipeline in `apps/docs/`
- Docs-local Tailwind v4 styling
- `/docs` route tree with sidebar navigation
- Seed MDX pages (getting started, monorepo map, contributing)
- Fumadocs MDX component library — **reference blocks in `packages/ui` + Storybook**; copy into `apps/docs` manually (Slice 5, no import)
- CI gates: `typecheck`, `test:run`, `build`
- Remove unused `transpilePackages` entries until workspace deps are approved
- Runtime matrix + tip-status-index sync when slices land

**Out of scope**

- Migrating governance markdown (`docs/architecture/`, `docs/adr/`, `docs/delivery/tips/`) into Fumadocs
- `@afenda/ui`, `@afenda/appshell`, or `@afenda/design-system` runtime imports in `@afenda/docs` (boundary stays zero workspace deps)
- `@afenda/ui` or `@afenda/appshell` in Fumadocs **layout shell** (sidebar, search, TOC)
- ERP auth, CSP nonce pipeline, multi-tenancy, RBAC, audit, or database access
- Public OpenAPI reference generation (**TIP-031** — separate future TIP)
- Accounting or System Admin documentation (**TIP-013+**, **TIP-014+**)
- `@afenda/accounting` package or ledger schemas (ADR-0010)

## Runtime evidence (2026-06-24)

| Artifact | Path | Proven |
| --- | --- | --- |
| Fumadocs MDX config | `apps/docs/source.config.ts` | Yes — Slice 1 |
| MDX home content | `apps/docs/content/docs/index.mdx`, `meta.json` | Yes — Slice 1 |
| Docs source loader | `apps/docs/src/lib/source.ts`, `layout.shared.ts` | Yes — Slice 1 |
| Docs route tree | `apps/docs/src/app/docs/[[...slug]]/page.tsx`, `layout.tsx` | Yes — Slice 1 |
| Root redirect | `apps/docs/src/app/page.tsx` → `/docs` | Yes — Slice 1 |
| Route smoke tests | `apps/docs/src/__tests__/docs-routes.test.tsx` | Yes — Slice 1 |
| Production build | `pnpm --filter @afenda/docs build` | Yes — Slice 1 |
| CI build gate in quality matrix | root `package.json` `quality:docs`, `.github/workflows/ci.yml` Gate 4c | Yes — Slice 2 |
| Afenda token + editorial prose theme | `apps/docs/src/app/globals.css`, `src/lib/docs-fonts.ts` | Yes — Slice 3 |
| Editorial shell palette | `apps/docs/src/app/docs-editorial-palette.css`, `docs-editorial-palette.contract.ts` | Yes — Slice 3.5 / 3.6 / 3.8 |
| Seed content sections | `apps/docs/content/docs/getting-started/`, `monorepo-map/`, `contributing/` | Yes — Slice 4 |
| Afenda Docs reference blocks | `packages/ui/src/components/afenda-docs/` + Storybook **Afenda Docs** category | Yes — Slice 5 |
| Deploy target | `apps/docs/vercel.json`, `docs/delivery/support/fumadocs-docs-app-deploy.md` | Yes — Slice 6 |
| MDX blocks in docs app | `apps/docs/src/components/blocks/`, `mdx.tsx` registry | Yes — Slice 5.1 |

## Package ownership

| Package | Role |
| --- | --- |
| `@afenda/docs` (PKG-005) | Fumadocs app, MDX content, docs routes, tests, deploy config |

## Depends on

- TIP-001 Architecture Authority — package registry lists PKG-005
- TIP-009 CI/CD — Turborepo task pipeline (`build`, `typecheck`, `test:run`)
- [`docs-app-architecture.md`](../../architecture/docs-app-architecture.md) — boundary baseline (2026-06-24)

**Does not depend on:** TIP-007A, TIP-012, TIP-013, or any foundation spine slice.

## Blocks

- TIP-031 Public API & OpenAPI docs — generated reference needs a published docs host (optional consumer of this app)
- Developer onboarding at scale — engineers lack a browsable guide until Slice 4 lands

## Deliverables

| File | Package | Layer | New / Modified | Boundary approval |
| --- | --- | --- | --- | --- |
| `docs/architecture/docs-app-architecture.md` | — | Architecture | **Delivered** | Architecture Authority |
| `apps/docs/source.config.ts` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/content/docs/index.mdx` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/content/docs/meta.json` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/src/lib/source.ts` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/src/lib/layout.shared.ts` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/src/components/mdx.tsx` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/src/app/docs/[[...slug]]/page.tsx` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/src/app/docs/layout.tsx` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/src/app/globals.css` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/postcss.config.mjs` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/package.json` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/next.config.ts` | `@afenda/docs` | Application | **Delivered** (Slice 1) | Remove unused `transpilePackages` |
| `apps/docs/tsconfig.json` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/src/__tests__/docs-routes.test.tsx` | `@afenda/docs` | Application | **Delivered** (Slice 1) | — |
| `apps/docs/src/app/page.tsx` | `@afenda/docs` | Application | **Delivered** (Slice 1) | Redirect to `/docs` |
| Root quality script wiring | repo root | Platform | **Delivered** (Slice 2) | `quality:docs`, `check:docs`, CI Gate 4c |
| Afenda token + editorial theme | `@afenda/docs` | Application | **Delivered** (Slice 3) | Prose typography + brand accent; Source Serif 4 + Source Sans 3 |
| Editorial shell palette | `@afenda/docs` | Application | **Delivered** (Slice 3.5) | Porcelain/graphite chrome; search/hover/select neutrals |
| MDX component library | `packages/ui/src/components/afenda-docs/` + Storybook | **Delivered** (Slice 5) | Reference blocks + stories; copy to `apps/docs` — no `@afenda/docs` import |

## Acceptance gate

- Fumadocs dev server serves `/docs` — manual smoke on port 3001
- `pnpm --filter @afenda/docs typecheck`
- `pnpm --filter @afenda/docs test:run`
- `pnpm --filter @afenda/docs build`
- `pnpm quality:boundaries` — no new unapproved `@afenda/*` edges from `@afenda/docs` unless registry updated
- `pnpm ci:biome`
- `pnpm check:documentation-drift`

## Acceptance criteria

```gherkin
GIVEN the developer has run pnpm install at the monorepo root
WHEN  the developer runs pnpm --filter @afenda/docs dev
THEN  the docs app listens on port 3001
AND   navigating to /docs renders the Fumadocs home page from MDX content

GIVEN apps/docs/content/docs/getting-started/index.mdx exists
WHEN  a developer opens /docs/getting-started in the browser
THEN  the page renders with sidebar navigation from meta.json
AND   no request is made to @afenda/erp or @afenda/database

GIVEN a CI worker runs pnpm --filter @afenda/docs build
WHEN  the build completes
THEN  the Next.js production build succeeds without type errors
AND   no @afenda/erp imports appear in the docs app bundle

GIVEN apps/docs has no approved @afenda/* runtime dependencies
WHEN  pnpm quality:boundaries runs
THEN  @afenda/docs reports zero outbound workspace runtime dependencies
AND   the dependency registry row for @afenda/docs remains empty

GIVEN governance documentation lives under docs/ at repo root
WHEN  a contributor adds a Fumadocs page under apps/docs/content/docs/
THEN  the page does not duplicate ADR or registry content verbatim
AND   cross-links to repo paths are used instead of copy-paste mirrors
```

## Definition of Done

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Architecture baseline published | `docs/architecture/docs-app-architecture.md` | [x] |
| 2 | Fumadocs scaffold + MDX home | `apps/docs/source.config.ts`, `content/docs/index.mdx` | [x] |
| 3 | `/docs` route renders MDX | `apps/docs/src/app/docs/` | [x] |
| 4 | Route smoke test passes | `pnpm --filter @afenda/docs test:run` | [x] |
| 5 | TypeScript strict | `pnpm --filter @afenda/docs typecheck` | [x] |
| 6 | Production build passes | `pnpm --filter @afenda/docs build` | [x] |
| 7 | CI build gate wired | root quality script (Slice 2) | [x] |
| 8 | Boundaries clean | `pnpm quality:boundaries` | [x] |
| 9 | Biome clean | `pnpm exec biome ci apps/docs` | [x] |
| 10 | Runtime matrix updated | `docs/architecture/afenda-runtime-truth-matrix.md` | [x] |
| 11 | TIP status index updated | `docs/delivery/tip-status-index.md` | [x] |
| 12 | Drift guard passes | `pnpm check:documentation-drift` | [x] |
| 13 | No accounting logic | ADR-0010 compliance | [x] |
| 14 | Completion report posted | afenda-coding-session §11 | [x] |
| 15 | Deploy target configured (isolated Vercel project) | `pnpm --filter @afenda/docs build` + `apps/docs/vercel.json` | [x] |

## Slices

### Slice 1 — Fumadocs scaffold (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** None — parallel track; no upstream matrix row required.

#### Design (internal-guide)

- Use Fumadocs MDX (`fumadocs-mdx` + `createMDX`) with content in `apps/docs/content/docs/` per [`docs-app-architecture.md`](../../architecture/docs-app-architecture.md).
- Import generated collections via `collections/server` alias → `.source/*`; run `fumadocs-mdx` before typecheck/test/build.
- Docs-local Tailwind v4 + Fumadocs neutral preset — no `@afenda/design-system` in this slice.
- Home route redirects to `/docs`; remove unused `transpilePackages` from `next.config.ts`.
- Replace placeholder `workspace.test.ts` with `docs-routes.test.tsx` (layout + redirect smoke).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md

1. Objective    — Scaffold Fumadocs MDX in apps/docs with /docs routes, Tailwind v4, MDX home page, and root redirect to /docs.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/source.config.ts (New)
                  apps/docs/content/docs/index.mdx (New)
                  apps/docs/content/docs/meta.json (New)
                  apps/docs/src/lib/source.ts (New)
                  apps/docs/src/lib/layout.shared.tsx (New)
                  apps/docs/src/components/mdx.tsx (New)
                  apps/docs/src/app/docs/[[...slug]]/page.tsx (New)
                  apps/docs/src/app/docs/layout.tsx (New)
                  apps/docs/src/app/globals.css (New)
                  apps/docs/postcss.config.mjs (New)
                  apps/docs/package.json (Modified)
                  apps/docs/next.config.ts (Modified)
                  apps/docs/tsconfig.json (Modified)
                  apps/docs/src/app/layout.tsx (Modified)
                  apps/docs/src/app/page.tsx (Modified)
                  apps/docs/src/__tests__/docs-routes.test.tsx (New)
                  apps/docs/src/__tests__/workspace.test.ts (Deleted)
                  docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — @afenda/erp, packages/database, packages/ui, packages/appshell
                  @afenda/accounting, governance doc migration into Fumadocs (ADR-0010)
                  Adding @afenda/* workspace runtime deps without registry update
                  root package.json CI wiring (Slice 2)
5. Authority    — ADR-0001 Application Authority — docs-app-architecture.md
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm --filter @afenda/docs build
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 2 | Fumadocs scaffold + MDX home | `pnpm --filter @afenda/docs build` |
| 3 | `/docs` route renders MDX | `pnpm --filter @afenda/docs build` |
| 4 | Route smoke test passes | `pnpm --filter @afenda/docs test:run` |
| 5 | TypeScript strict | `pnpm --filter @afenda/docs typecheck` |
| 6 | Production build passes | `pnpm --filter @afenda/docs build` |
| 8 | Boundaries clean | `pnpm quality:boundaries` |
| 9 | Biome clean | `pnpm ci:biome` |
| 10 | Runtime matrix updated | file path proof |
| 12 | Drift guard passes | `pnpm check:documentation-drift` |

#### Known debt

- Search API route (`app/api/search/route.ts`) deferred — optional enhancement post-scaffold.
- Afenda token theming deferred to Slice 3.
- CI quality matrix wiring deferred to Slice 2.

### Slice 2 — CI automation (repo root + `@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 1 runtime evidence — `apps/docs/` Fumadocs scaffold = `partially-implemented` in `afenda-runtime-truth-matrix.md` (Slice 1 delivered).

#### Design (internal-guide)

- Add root `quality:docs` and mirror `check:docs`, both delegating to `pnpm --filter @afenda/docs build` (same pattern as `storybook:build` / `check:erp-observability`).
- Append `pnpm quality:docs` to the root `quality` aggregator so `pnpm ci` and local pre-PR runs fail on docs regressions.
- Add **Gate 4c · docs build** to `.github/workflows/ci.yml` after Storybook build — always runs `pnpm quality:docs` (not turbo-affected) so shared dependency drift cannot skip the docs app.
- Register `quality:docs`, `check:docs`, and the CI command in `scripts/quality/check-release-gates.mjs` (TIP-009 self-check integrity).
- No `@afenda/docs` TypeScript changes — build gate only.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md

1. Objective    — Add automated docs build to CI/quality matrix so apps/docs build fails PRs on regression.
2. Allowed layer— repo root (package.json, CI workflow, release-gate script only)
3. Files        — package.json (Modified — quality:docs, check:docs, quality aggregator)
                  .github/workflows/ci.yml (Modified — Gate 4c quality:docs)
                  scripts/quality/check-release-gates.mjs (Modified — register quality:docs)
                  docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — apps/docs/** source edits; ERP CI changes unrelated to docs; @afenda/accounting (ADR-0010)
                  packages/ui, packages/appshell, @afenda/erp
5. Authority    — ADR-0001 Application Authority — TIP-009 CI/CD
6. Gates        — pnpm quality:docs
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 7 | CI build gate wired | `pnpm quality:docs` |

#### Known debt

- Docs build on PR via turbo `--affected` remains supplementary; Gate 4c always runs explicit `quality:docs`.
- Seed content, theming, deploy deferred to Slices 3–5.

### Slice 3 — Afenda token + editorial prose theme (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 2 runtime evidence — CI build gate = `Yes — Slice 2` in TIP runtime evidence table.

#### Design (internal-guide)

- **Hybrid model:** keep Fumadocs product shell (sidebar, TOC, search); apply editorial typography and warm palette **inside prose only** — not magazine-layout chrome.
- Import editorial fonts via `next/font/google`; prose accent uses docs-pinned OKLCH in `docs-editorial-palette.css` (Slice 3.6 — no `@afenda/design-system` import).
- Load **Source Serif 4** (display) + **Source Sans 3** (body) via `next/font/google` in `src/lib/docs-fonts.ts`; apply CSS variables on `<html>`.
- Editorial prose rules on `.nd-page .prose`: `max-width: 65ch`, `line-height: 1.7`, serif headings, accent link hovers, blockquote accent rule; honor `prefers-reduced-motion`.
- `ensure:design-system-css` removed in Slice 3.6 — docs shell no longer depends on design-system build.
- No `@afenda/ui`, no `className` on Fumadocs primitives, no ERP `globals.css` import.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md

1. Objective    — Apply Afenda design tokens and scoped editorial prose typography to the Fumadocs docs shell without @afenda/ui consumption.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/src/app/globals.css (Modified)
                  apps/docs/src/app/layout.tsx (Modified)
                  apps/docs/src/lib/docs-fonts.ts (New)
                  apps/docs/package.json (Modified)
                  apps/docs/src/__tests__/docs-theme.test.ts (New)
                  docs/architecture/dependency-registry.md (Modified — dev-only exempt row)
                  docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — packages/ui, packages/appshell, @afenda/erp, @afenda/ui primitives
                  Magazine-layout shell redesign; className on Fumadocs UI components
                  @afenda/accounting (ADR-0010); runtime @afenda/design-system dependency
                  Slice 4 seed content (deferred)
5. Authority    — ADR-0001 — Design Authority (token import only)
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm --filter @afenda/docs build
                  pnpm quality:boundaries
                  pnpm exec biome ci apps/docs
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | Afenda token + editorial theme (Slice 3 deliverable) | `pnpm --filter @afenda/docs build` |

#### Known debt

- Seed content (getting-started, monorepo-map, contributing) **deferred** — Slice 4 not in this session.
- Full magazine hero / drop caps deferred until Slice 4 content exists.
- Manual browser dark-mode smoke recommended after major brand token changes (automated CSS contracts in `docs-theme.test.ts`).

### Slice 3.5 — Editorial shell palette (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 3 runtime evidence — Afenda token + editorial prose theme delivered.

#### Design (internal-guide)

- **Two-tier model:** docs-owned `--docs-editorial-*` warm neutrals for Fumadocs shell; Afenda brand accent **prose-only** via `--docs-editorial-prose-accent`.
- **Fix token role conflict:** `--color-fd-primary` / `--color-fd-accent` map to search surface + hover lift (Fumadocs intent), not ERP action brand blue.
- **Editorial palette:** light ivory canvas `oklch(0.98 0.01 85)`; dark ink charcoal; accent restricted to links/blockquotes.
- Override `.dark #nd-sidebar` Fumadocs HSL hardcodes with editorial neutrals.
- Contract: `docs-editorial-palette.contract.ts` + `docs-editorial-palette.css`.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md

1. Objective    — Apply docs editorial shell palette; fix Fumadocs chrome hover/search/select token conflicts; keep Afenda brand accent prose-only.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/src/app/docs-editorial-palette.css (New)
                  apps/docs/src/app/globals.css (Modified)
                  apps/docs/src/lib/docs-editorial-palette.contract.ts (New)
                  apps/docs/src/__tests__/docs-theme.test.ts (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md (Modified)
4. Prohibited   — packages/ui, packages/appshell, @afenda/erp, @afenda/ui primitives
                  ERP design-system token edits; className on Fumadocs UI components
                  @afenda/accounting (ADR-0010); Slice 4 seed content
5. Authority    — ADR-0001 — Application Authority
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm --filter @afenda/docs build
                  pnpm quality:boundaries
                  pnpm exec biome ci apps/docs
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | Editorial shell palette + contrast-safe chrome (Slice 3.5) | `pnpm --filter @afenda/docs test:run` |

#### Known debt

- Browser visual smoke for search kbd chips after deploy preview.
- Slice 4 seed content still deferred.

### Slice 3.6 — Fumadocs-native shell CSS (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 3.5 runtime evidence — editorial shell palette delivered.

#### Design (internal-guide)

- **Fumadocs-native shell:** keep `fumadocs-ui/css/neutral.css` + `preset.css`; assign warm editorial OKLCH directly to `--color-fd-*` via `@theme inline`.
- **No ERP token bridge:** remove `@afenda/design-system` CSS import and `ensure:design-system-css` script; zero `@afenda/*` workspace deps restored.
- **fd-primary = neutral shell text** (not brand blue); active sidebar nav uses explicit `[data-active="true"]` prose-accent wash.
- **Prose brand:** pinned Afenda primary OKLCH in `--docs-editorial-prose-accent` (docs-owned literals, not `--afenda-*` aliases).
- Search/kbd chrome overrides retained on `[data-search-full]`.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md

1. Objective    — Consolidate docs shell CSS to Fumadocs-native fd tokens; remove Afenda design-system token bridge; keep brand accent prose-only.
2. Allowed layer— apps/docs/ + docs/architecture/dependency-registry.md
3. Files        — apps/docs/src/app/docs-editorial-palette.css (Modified)
                  apps/docs/src/app/globals.css (Modified)
                  apps/docs/src/lib/docs-editorial-palette.contract.ts (Modified)
                  apps/docs/src/__tests__/docs-theme.test.ts (Modified)
                  apps/docs/package.json (Modified)
                  apps/docs/scripts/ensure-design-system-css.mjs (Deleted)
                  docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md (Modified)
                  docs/architecture/dependency-registry.md (Modified)
4. Prohibited   — packages/ui, @afenda/erp, ERP design-system token edits, className on Fumadocs UI
5. Authority    — ADR-0001 — Application Authority / afenda-fumadocs §7
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm --filter @afenda/docs build
                  pnpm quality:boundaries
                  pnpm exec biome ci apps/docs
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | Fumadocs-native shell CSS without Afenda token bridge (Slice 3.6) | `pnpm --filter @afenda/docs test:run` |

#### Known debt

- Full Fumadocs CSS vendor fork deferred — revisit only if upstream fd utility regressions recur on upgrade.
- Slice 4 seed content still deferred.

### Slice 3.7 — Editorial palette coherence (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 3.6 runtime evidence — Fumadocs-native fd bridge delivered.

#### Design (internal-guide)

- Dark shell canvas uses ink charcoal hue **40** (not warm brown hue 85).
- Sidebar active item uses **neutral surface-hover only** — no brand accent wash.
- Brand blue (H254) scoped to `.nd-page .prose` links and blockquote rule in `globals.css`.

#### Known debt

- Full `docs-editorial-design` skill baseline (layout width, ACPA focus ring, dark prose accent, contract parity test) deferred to Slice 3.8.

### Slice 3.8 — docs-editorial-design full pass (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 3.6 / 3.7 runtime evidence — `apps/docs/src/app/docs-editorial-palette.css` editorial shell = delivered in `afenda-runtime-truth-matrix.md`

#### Design (internal-guide)

- Align all `--docs-editorial-*` OKLCH literals to `docs-editorial-design` skill pinned baseline (light ivory H85, dark ink H40, prose accent H254 light + dark overrides).
- Add Fumadocs layout width (`--fd-layout-width: 1400px`), global `:focus-visible` ring, and reduced-motion guards per ACPA §8.
- Expand TypeScript contract with `docsEditorialPrimitiveNames` and a CSS ↔ TS parity test (skill §9).
- Keep Fumadocs-native shell: `@theme inline` fd bridge only; no ERP tokens; no `className` on layout primitives; search/kbd/sidebar selectors unchanged in intent.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md

1. Objective    — Full docs editorial redesign per docs-editorial-design skill: pinned OKLCH baseline, ACPA focus/layout, dark prose accent, CSS ↔ TS contract parity, shell monochrome + prose-only accent.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/src/app/docs-editorial-palette.css (Modified)
                  apps/docs/src/app/globals.css (Modified)
                  apps/docs/src/lib/docs-editorial-palette.contract.ts (Modified)
                  apps/docs/src/__tests__/docs-theme.test.ts (Modified)
                  .cursor/skills/docs-editorial-design/PALETTE-REFERENCE.md (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — @afenda/erp, packages/ui, packages/appshell, @afenda/design-system CSS import
                  @afenda/accounting, Accounting Core (ADR-0010)
                  className on Fumadocs UI layout primitives
                  brand accent in sidebar / nav / TOC / search / breadcrumbs
5. Authority    — ADR-0001 — Application Authority / docs-editorial-design skill / TIP-032 Slice 3
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm --filter @afenda/docs build
                  pnpm quality:boundaries
                  pnpm exec biome ci apps/docs
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | Editorial shell palette + ACPA chrome (Slice 3.8 — docs-editorial-design baseline) | `pnpm --filter @afenda/docs test:run` |

#### Known debt

- Browser visual smoke on deploy preview (search kbd, TOC, mobile sidebar).
- Slice 4 seed content still deferred.

### Slice 3.9 — Porcelain material palette (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 3.8 — docs-editorial-design baseline delivered.

#### Design (internal-guide)

- Replace warm ivory H85 canvas with **porcelain H95** material model (canvas / rail / paper / surface-active).
- Replace flat achromatic dark with **graphite H260** layering — rail recessed, paper elevated, canvas main plane.
- Fumadocs fd bridge: `--color-fd-card` / `--color-fd-popover` → `paper`; sidebar `#nd-sidebar` → `rail` + `surface-active` for active nav.
- Search: paper surface, subtle light box-shadow, kbd chip styling.
- Prose hierarchy: 66ch max, clamp h1/h2, lead paragraph muted — hierarchy without shell accent.
- Skill + `PALETTE-REFERENCE.md` synced; no H85 ivory or H40 warm-grey defaults.

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | Porcelain/graphite editorial material palette + sidebar rail depth | `pnpm --filter @afenda/docs test:run` |

#### Known debt

- True editorial landing composition deferred to Slice 4 (sparse home page limits visual score).
- Browser visual smoke recommended after hard refresh on dev preview.

### Slice 4 — Seed content + TypeScript hygiene (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 3.9 runtime evidence — porcelain/graphite editorial palette delivered in `afenda-runtime-truth-matrix.md` (`@afenda/docs` row = partially-implemented, Slices 1–3.9).

#### Design (internal-guide)

- Add three seed sections per `docs-app-architecture.md` content model: **getting-started**, **monorepo-map**, **contributing** — each with `meta.json` + `index.mdx`; getting-started adds `installation.mdx` and `dev-setup.mdx` subpages.
- Upgrade home `index.mdx` to editorial landing composition: lead paragraph, section cards with internal `/docs/...` links, cross-links to repo-root governance paths (no verbatim ADR/registry copy).
- Introduce `docs-nav.contract.ts` — serializable, boundary-safe registry of seed page slugs for test parity (no runtime `@afenda/*` imports).
- Add `source.test.ts` smoke: `source.getPage` resolves home + each seed slug after `generate:source`.
- Normalize exports: keep `docs-page.ts` as single page-resolution authority; no duplicate slug helpers.
- Remove any stale test stubs; ensure all public TS contracts are JSON-serializable where exported for tests.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md

1. Objective    — Deliver TIP-032 seed MDX sections (getting-started, monorepo-map, contributing) with sidebar navigation, editorial home landing, and strict TypeScript contract tests for content discoverability.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/content/docs/index.mdx (Modified)
                  apps/docs/content/docs/meta.json (Modified)
                  apps/docs/content/docs/getting-started/meta.json (New)
                  apps/docs/content/docs/getting-started/index.mdx (New)
                  apps/docs/content/docs/getting-started/installation.mdx (New)
                  apps/docs/content/docs/getting-started/dev-setup.mdx (New)
                  apps/docs/content/docs/monorepo-map/meta.json (New)
                  apps/docs/content/docs/monorepo-map/index.mdx (New)
                  apps/docs/content/docs/contributing/meta.json (New)
                  apps/docs/content/docs/contributing/index.mdx (New)
                  apps/docs/src/lib/docs-nav.contract.ts (New)
                  apps/docs/src/__tests__/source.test.ts (New)
                  apps/docs/src/__tests__/docs-content.test.ts (New)
                  docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — Verbatim copy of docs/architecture registries, docs/adr/, or docs/delivery/tips/ into MDX
                  @afenda/erp, packages/database, packages/ui, packages/appshell imports
                  @afenda/accounting, Accounting Core (ADR-0010)
                  className on Fumadocs UI layout primitives
                  ERP design-system token bridge; new @afenda/* runtime deps without registry PR
5. Authority    — ADR-0001 Application Authority — docs-app-architecture.md / TIP-032 / afenda-fumadocs §2–§5
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm --filter @afenda/docs build
                  pnpm quality:boundaries
                  pnpm exec biome ci apps/docs
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | Seed content sections reachable via sidebar | `pnpm --filter @afenda/docs build` |
| — | Acceptance criteria: `/docs/getting-started` renders without ERP deps | `pnpm --filter @afenda/docs build` |
| 14 | Completion report posted | afenda-coding-session §11 |

#### Known debt

- Deploy target remains Slice 6.
- OpenAPI reference integration deferred to TIP-031.

### Slice 5 — Afenda Docs reference blocks (`packages/ui` + Storybook)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 4 runtime evidence — seed content sections = `Yes — Slice 4` in TIP runtime evidence table.

#### Design (internal-guide)

**Simplest path — strict `@afenda/docs` boundary preserved.**

`@afenda/docs` keeps **zero** `@afenda/*` runtime workspace dependencies. No dependency-registry change. No import from docs → ui.

**Instead:** build a **reference catalog** in `@afenda/ui`, preview in Storybook, **copy source** into `apps/docs` when a block is chosen.

```text
packages/ui/src/components/afenda-docs/     ← reference blocks (compose governed primitives)
├── README.md                               ← copy workflow + token swap guide
├── afenda-docs-preview.css                 ← Storybook preview tokens (porcelain-like)
├── docs-guide-card-grid.tsx
├── docs-guide-card-grid.stories.tsx        ← Storybook title: Afenda Docs / …
├── docs-feature-strip.tsx
├── docs-feature-strip.stories.tsx
├── docs-steps-panel.tsx
└── docs-steps-panel.stories.tsx

apps/docs/                                  ← NO import from @afenda/ui
└── (manual) copy chosen block → src/components/blocks/ + swap CSS to --docs-editorial-*
```

**Why `packages/ui` (not `apps/docs` first)**

| Benefit | Detail |
| ------- | ------ |
| Storybook preview | Pick blocks visually before copying |
| govern-primitive | Compositions use `@afenda/ui` Card/Badge/etc. with zero `className` on primitives |
| afenda-ui-quality | Full Phase 3–5 normalization in ui layer |
| shadcn-studio `/cui` `/iui` `/rui` | Generate/adapt in `afenda-docs/` — **not** `packages/appshell/` |
| Docs boundary | Copy-paste adoption — no runtime edge |

**Export policy:** Do **not** add `afenda-docs/*` to the main `@afenda/ui` public barrel (`src/index.ts`). Reference-only folder. Storybook discovers co-located `*.stories.tsx`.

**shadcn-studio workflow (docs category)**

1. `/iui` or `/cui` — collect layout inspiration (card grid, feature strip, steps)
2. Implement in `packages/ui/src/components/afenda-docs/` composing governed primitives
3. `/rui` — refine in place before Storybook sign-off
4. **Do not** move docs blocks to `packages/appshell/src/shadcn-studio/blocks/`

**Quality gates (ui layer)**

- **govern-primitive consumer rules** on compositions — zero `className` on governed primitives
- **afenda-ui-quality** Phase 3–5 — semantic wrapper classes in `afenda-docs-preview.css`
- `pnpm --filter @afenda/ui check:governance`
- `pnpm ui:guard:scan`

**Copy workflow (document in `afenda-docs/README.md`)**

1. Open Storybook → **Afenda Docs** category → choose variant
2. Copy component file(s) to `apps/docs/src/components/blocks/`
3. Copy CSS semantics; replace preview vars with `--docs-editorial-*` in `docs-editorial-blocks.css`
4. Register in `apps/docs/src/components/mdx.tsx` + Fumadocs upstream components (`Cards`, `Steps`, …)
5. Verify `pnpm quality:boundaries` — `@afenda/docs` still has zero `@afenda/*` runtime deps

**Slice 5 does not require** copying blocks into `apps/docs` — follow-up manual step (or optional Slice 5.1).

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md

1. Objective    — Create Afenda Docs reference block catalog in packages/ui (Storybook Afenda Docs category) from shadcn-studio /cui /iui layouts; govern compositions; document copy-to-apps/docs workflow without adding @afenda/docs runtime imports.
2. Allowed layer— packages/ui/src/components/afenda-docs/
3. Files        — packages/ui/src/components/afenda-docs/README.md (New)
                  packages/ui/src/components/afenda-docs/afenda-docs-preview.css (New)
                  packages/ui/src/components/afenda-docs/docs-guide-card-grid.tsx (New)
                  packages/ui/src/components/afenda-docs/docs-guide-card-grid.stories.tsx (New)
                  packages/ui/src/components/afenda-docs/docs-feature-strip.tsx (New)
                  packages/ui/src/components/afenda-docs/docs-feature-strip.stories.tsx (New)
                  packages/ui/src/components/afenda-docs/docs-steps-panel.tsx (New)
                  packages/ui/src/components/afenda-docs/docs-steps-panel.stories.tsx (New)
                  packages/ui/src/__tests__/governance/afenda-docs-composition.test.ts (New)
                  packages/ui/src/__tests__/primitive-boundary.test.ts (Modified — afenda-docs folder policy)
                  docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — Adding @afenda/docs → @afenda/ui to dependency-registry.md
                  Runtime import from apps/docs to @afenda/ui
                  Exporting afenda-docs from packages/ui/src/index.ts main barrel
                  Installing docs blocks to packages/appshell/ for Fumadocs delivery
                  className on governed primitives inside afenda-docs compositions
                  @afenda/erp, packages/database changes
                  @afenda/accounting, Accounting Core (ADR-0010)
5. Authority    — ADR-0001 Design Authority / TIP-004 composition rules / docs-editorial-design (token swap on copy) / shadcn-studio + govern-primitive + afenda-ui-quality
6. Gates        — pnpm --filter @afenda/ui typecheck
                  pnpm --filter @afenda/ui test:run
                  pnpm --filter @afenda/ui check:governance
                  pnpm ui:guard:scan
                  pnpm --filter @afenda/storybook typecheck
                  pnpm quality:boundaries
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | Afenda Docs reference blocks visible in Storybook | `pnpm --filter @afenda/storybook typecheck` |
| — | Compositions pass governance (no className on primitives) | `pnpm ui:guard:scan` |
| — | `@afenda/docs` boundary unchanged (zero runtime deps) | `pnpm quality:boundaries` |

#### Known debt

- Blocks not copied into `apps/docs` until author picks variants (manual or future Slice 5.1).
- shadcn-studio Pro `/iui` may need license env from `.env.secret` for MCP collection.
- Deploy target deferred to Slice 6.

### Slice 6 — Deploy target (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 5 runtime evidence — Afenda Docs reference blocks in Storybook (`packages/ui/src/components/afenda-docs/`).

Separate Vercel project for `@afenda/docs`. No shared ERP secrets. TypeScript graph module cleanup and `source.getPage` loader tests included.

#### Design (internal-guide)

- **Isolated Vercel project** — Root Directory `apps/docs`; monorepo install/build via `vercel.json`
- **`outputFileTracingRoot`** — monorepo root in `next.config.ts` for reliable workspace tracing on Vercel
- **Graph types** — shared `docs-graph.types.ts`; `build-graph.ts` uses `InferPageType` via `DocsPage` (no cast)
- **Optional PR preview** — `preview-docs.yml` + `VERCEL_PROJECT_ID_DOCS` (skips when unset)
- **shadcn-studio N/A** — Slice 6 is deploy/typing only; MDX blocks remain Slice 5 / optional 5.1

#### Handoff block

```
Handoff from: docs/delivery/tips/[Complete] tip-032-implementation-documentation.md

1. Objective    — Configure separate preview/production deploy for @afenda/docs with no ERP secret coupling; harden graph/source TypeScript contracts.
2. Allowed layer— apps/docs/ + docs/delivery/support/
3. Files        — apps/docs/vercel.json (New)
                  apps/docs/.env.example (New)
                  apps/docs/next.config.ts (Modified)
                  apps/docs/src/lib/docs-graph.types.ts (New)
                  apps/docs/src/lib/build-graph.ts (Modified)
                  apps/docs/src/components/graph-view.tsx (Modified)
                  apps/docs/src/components/mdx.tsx (Modified)
                  apps/docs/src/components/site-graph-view.tsx (Deleted)
                  apps/docs/src/__tests__/build-graph.test.ts (New)
                  apps/docs/src/__tests__/docs-page.test.ts (Modified)
                  apps/docs/src/__tests__/seed-page-registry.test.ts (Renamed from source.test.ts)
                  .github/workflows/preview-docs.yml (New)
                  docs/delivery/support/fumadocs-docs-app-deploy.md (New)
                  docs/architecture/docs-app-architecture.md (Modified)
                  docs/delivery/tips/[Complete] tip-032-implementation-documentation.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — Shared auth env with ERP; @afenda/database
                  packages/ui, packages/appshell (Slice 5 scope)
                  @afenda/accounting, Accounting Core (ADR-0010)
5. Authority    — ADR-0001 Application Authority
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm --filter @afenda/docs build
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| 15 | Deploy target configured | `pnpm --filter @afenda/docs build` |

#### Known debt

- Production domain DNS — assign `docs.afenda.app` (or chosen hostname) in Vercel dashboard; canonical URL recorded in support doc (Slice 5.1).
- `VERCEL_PROJECT_ID_DOCS` GitHub secret — optional until docs PR previews are required.

### Slice 5.1 — MDX editorial blocks copy + production domain (`@afenda/docs`)

**Status:** Delivered (2026-06-24)  
**Prerequisite:** Slice 6 runtime evidence — deploy config = `Yes — Slice 6` in TIP runtime evidence table; Afenda Docs reference blocks in `packages/ui/src/components/afenda-docs/` = `Yes — Slice 5`.

#### Design (internal-guide)

- **Boundary:** Copy Afenda Docs reference blocks into `apps/docs/src/components/blocks/` as **plain HTML + editorial CSS** — zero `@afenda/ui` imports; `@afenda/docs` keeps zero `@afenda/*` runtime workspace deps.
- **CSS:** Derive `apps/docs/src/app/docs-editorial-blocks.css` from `_storybook/afenda-docs/afenda-docs-preview.css`; swap `--docs-preview-*` → `--docs-editorial-*` per `afenda-docs/README.md`.
- **Interactive blocks:** Accordion and tabs use native HTML / local state — not `@afenda/ui` Accordion/Tabs (slot CSS differs).
- **MDX registry:** Register copied blocks in `mdx.tsx` alongside upstream fumadocs-ui components.
- **Production domain:** Document canonical URL (`https://docs.afenda.app`), Vercel custom-domain steps, and DNS checklist in `fumadocs-docs-app-deploy.md` — no ERP secret coupling.
- **shadcn-studio N/A for copy** — reference blocks already delivered in Slice 5; this slice is adoption only.

#### Handoff block

```
Handoff from: docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md

1. Objective    — Copy Afenda Docs editorial blocks from packages/ui reference catalog into apps/docs with editorial token CSS and MDX registration; document production docs domain provisioning without adding @afenda/* runtime imports.
2. Allowed layer— apps/docs/
3. Files        — apps/docs/src/app/docs-editorial-blocks.css (New)
                  apps/docs/src/app/globals.css (Modified)
                  apps/docs/src/components/blocks/docs-block.types.ts (New)
                  apps/docs/src/components/blocks/docs-guide-card-grid.tsx (New)
                  apps/docs/src/components/blocks/docs-feature-strip.tsx (New)
                  apps/docs/src/components/blocks/docs-steps-panel.tsx (New)
                  apps/docs/src/components/blocks/docs-callout.tsx (New)
                  apps/docs/src/components/blocks/docs-announcement-bar.tsx (New)
                  apps/docs/src/components/blocks/docs-accordion-panel.tsx (New)
                  apps/docs/src/components/blocks/docs-code-panel.tsx (New)
                  apps/docs/src/components/blocks/docs-file-tree.tsx (New)
                  apps/docs/src/components/blocks/docs-inline-toc.tsx (New)
                  apps/docs/src/components/blocks/docs-tabbed-panel.tsx (New)
                  apps/docs/src/components/blocks/docs-prop-table.tsx (New)
                  apps/docs/src/components/blocks/index.ts (New)
                  apps/docs/src/components/mdx.tsx (Modified)
                  apps/docs/package.json (Modified — lucide-react only)
                  apps/docs/src/__tests__/docs-editorial-blocks.test.tsx (New)
                  docs/delivery/support/fumadocs-docs-app-deploy.md (Modified)
                  docs/delivery/tips/[Partially Implemented] tip-032-implementation-documentation.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
                  docs/delivery/tip-status-index.md (Modified)
4. Prohibited   — Runtime import from apps/docs to @afenda/ui or dependency-registry change
                  packages/ui, packages/appshell (Slice 5 reference scope)
                  className on any @afenda/ui primitive (N/A — no ui imports)
                  @afenda/erp, packages/database, shared ERP auth env
                  @afenda/accounting, Accounting Core (ADR-0010)
5. Authority    — ADR-0001 Application Authority / docs-app-architecture.md / docs-editorial-design token swap
6. Gates        — pnpm --filter @afenda/docs typecheck
                  pnpm --filter @afenda/docs test:run
                  pnpm --filter @afenda/docs build
                  pnpm quality:boundaries
                  pnpm ci:biome
                  pnpm check:documentation-drift
```

#### DoD rows this slice closes

| # | Criterion | Gate |
|---|-----------|------|
| — | MDX editorial blocks registered in docs app | `pnpm --filter @afenda/docs test:run` |
| — | `@afenda/docs` boundary unchanged (zero runtime deps) | `pnpm quality:boundaries` |
| — | Production domain documented | `pnpm check:documentation-drift` |

#### Known debt

- Live DNS for `docs.afenda.app` requires Vercel dashboard operator action after deploy project exists.
- `VERCEL_PROJECT_ID_DOCS` remains optional for PR previews.

---

## Handoff to implementation

> **Mandatory before code edits.** Implement one slice per session. This track is parallel to foundation — do not defer TIP-013 for docs work.

### Slice 1 — Fumadocs scaffold

See **§Slices → Slice 1** above for the canonical handoff block (includes §9 documentation sync files).

### Slice 2 — CI automation

See **§Slices → Slice 2** above for the canonical handoff block (includes CI workflow + release-gate registration).

### Slice 3 — Afenda token + editorial prose theme

See **§Slices → Slice 3** above for the canonical handoff block.

### Slice 4 — Seed content + TypeScript hygiene

See **§Slices → Slice 4** above for the canonical handoff block (includes §9 documentation sync files).

### Slice 5 — Afenda Docs reference blocks (`packages/ui`)

See **§Slices → Slice 5** above. Storybook catalog in `packages/ui/src/components/afenda-docs/`; copy to `apps/docs` manually — no import, no registry change.

### Slice 6 — Deploy target

See **§Slices → Slice 6** above for the canonical handoff block.

### Slice 5.1 — MDX editorial blocks copy + production domain

See **§Slices → Slice 5.1** above for the canonical handoff block.

## Verdict

Slices 1–6 and 5.1 delivered. **TIP Complete.** Live DNS for `docs.afenda.app` remains Vercel dashboard operator debt.
