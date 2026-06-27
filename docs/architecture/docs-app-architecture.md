# Docs App Architecture — `@afenda/docs`

| Field | Value |
|-------|-------|
| **Status** | Accepted — architecture baseline for TIP-032 |
| **Date** | 2026-06-24 |
| **Owner** | Application Authority |
| **Package** | `@afenda/docs` (PKG-005) |
| **Delivery TIP** | [`docs-app-architecture.md`](docs-app-architecture.md) (this doc) · deploy runbook [`fumadocs-docs-app-deploy.md`](../governance/support/fumadocs-docs-app-deploy.md) |
| **Runtime matrix** | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) — `@afenda/docs` row |

---

## Purpose

This document defines how Afenda's **documentation delivery application** (`apps/docs`) is structured, isolated from ERP foundation runtime work, and operated independently. It enables engineers to stand up and run a Fumadocs-powered docs site on port **3001** without blocking or coupling to Foundation Phases 0–9 slices.

**Audience:** engineers implementing or maintaining `@afenda/docs`.

**Action enabled:** safe parallel development of the docs app while foundation TIPs (007A, 013, etc.) proceed on the ERP spine.

---

## Design goals

| Goal | Rationale |
|------|-----------|
| **Runtime isolation** | Docs is a read-mostly static site; no tenant DB, auth spine, or outbox |
| **Delivery independence** | Slices in TIP-032 do not modify `@afenda/erp`, kernel, database, or permissions |
| **Single content root** | All published MDX lives under `apps/docs/content/` — not scattered across the monorepo |
| **Governance docs stay in repo** | Architecture, ADR, and delivery TIP markdown remain in `docs/` at repo root |
| **Automated gates** | `build`, `typecheck`, and `test:run` run in CI without starting dev servers |
| **Future OpenAPI hook** | TIP-031 (Public API & OpenAPI) may feed generated reference into this app later |

---

## System structure

```text
┌─────────────────────────────────────────────────────────────────┐
│  Repo root `docs/`                                               │
│  (governance — ADR, architecture registries, delivery TIPs)      │
│  Authority: Architecture / Delivery — NOT rendered by Fumadocs     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  cross-links only (manual / future sync)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  `apps/docs/` — @afenda/docs (Application layer, port 3001)      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ content/docs │  │ Fumadocs MDX │  │ Next.js App Router     │ │
│  │ (MDX pages)  │→ │ source loader│→ │ /docs/* routes         │ │
│  └──────────────┘  └──────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  `apps/erp/` — @afenda/erp (port 3000) — separate deploy target  │
│  Protected runtime spine — MUST NOT depend on @afenda/docs       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Boundaries

### In scope for `@afenda/docs`

| Concern | Location |
|---------|----------|
| Fumadocs MDX content | `apps/docs/content/docs/` |
| Fumadocs config | `apps/docs/source.config.ts` |
| Docs route tree | `apps/docs/src/app/docs/` |
| Source loader | `apps/docs/src/lib/source.ts` |
| App layout / theme shell | `apps/docs/src/app/layout.tsx`, `src/app/docs/layout.tsx` |
| Tailwind v4 (docs-only) | `apps/docs/postcss.config.mjs`, `apps/docs/src/app/globals.css` |
| Tests | `apps/docs/src/__tests__/` |

### Out of scope (owned elsewhere)

| Concern | Owner | Notes |
|---------|-------|-------|
| Architecture registries | `docs/architecture/` | Human truth; update via Architecture Authority |
| Delivery TIP specs | `docs/PAS/slice/` | Evidence artifacts; not auto-synced to Fumadocs |
| ADRs | `docs/adr/` | Constitutional; never overridden by docs app content |
| ERP product UI | `apps/erp/` | No imports from `@afenda/docs` |
| Governed UI primitives | `packages/ui/` | Optional later slice; requires TIP-004 approval |
| Public OpenAPI reference | TIP-031 (future) | Generated artifacts may be consumed by docs app |

### Dependency rules

Per [`dependency-registry.md`](dependency-registry.md), `@afenda/docs` currently has **zero approved `@afenda/*` runtime dependencies**. TIP-032 Slice 1 keeps that boundary.

| Phase | Allowed npm deps | Allowed workspace deps |
|-------|------------------|------------------------|
| Slice 1 (scaffold) | `fumadocs-mdx`, `fumadocs-core`, `fumadocs-ui`, Tailwind v4 | `@afenda/typescript-config` (dev only) |
| Slice 3+ (theming) | — | Docs-owned OKLCH palette in `docs-editorial-palette.css`; zero `@afenda/*` workspace deps (Slice 3.6) |
| Slice 3+ (components) | — | `@afenda/ui` — **requires TIP-004 consumption rules + ui:guard** |

**Hard rule:** `@afenda/erp` MUST NOT depend on `@afenda/docs`. The docs app is a leaf Application package.

---

## Technology stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 16 App Router | Same catalog version as ERP; separate dev port **3001** |
| Docs engine | [Fumadocs](https://fumadocs.dev) | MDX collections via `fumadocs-mdx` |
| React | 19.x | Catalog pin |
| Styling | Tailwind CSS v4 | Docs-local PostCSS; no ERP `globals.css` import |
| Content format | MDX + frontmatter | `meta.json` for sidebar navigation |
| Tests | Vitest + shared `vitest.shared.ts` | Smoke + route render tests |

**Assumption (labeled):** Fumadocs App Router integration follows the upstream `fumadocs-mdx` + `createMDXSource` pattern compatible with Next.js 16. Verify against current Fumadocs docs at implementation time.

---

## Content model

Two documentation surfaces coexist by design:

| Surface | Path | Purpose | Update trigger |
|---------|------|---------|----------------|
| **Governance docs** | `docs/` (repo root) | ADRs, registries, TIPs, drift guard | Architecture / delivery PRs |
| **Published docs site** | `apps/docs/content/docs/` | Developer guides, onboarding, API how-tos | TIP-032 content slices |

**Do not** move governance markdown into Fumadocs in Slice 1. Duplication causes drift (ADR-0012). Cross-link from MDX to GitHub/repo paths when needed.

Initial content categories (TIP-032 Slice 4):

1. **Getting started** — clone, `pnpm install`, run ERP + docs
2. **Monorepo map** — packages, layers, where to edit
3. **Contributing** — afenda-coding-session, TIP handoff workflow

---

## Operations

### Local development

```bash
pnpm --filter @afenda/docs dev    # http://localhost:3001
```

ERP dev (`3000`) is **not** required for docs work.

### CI gates (target state — TIP-032 Slice 2)

| Gate | Command |
|------|---------|
| Typecheck | `pnpm --filter @afenda/docs typecheck` |
| Unit tests | `pnpm --filter @afenda/docs test:run` |
| Production build | `pnpm --filter @afenda/docs build` |
| Boundaries | `pnpm quality:boundaries` |
| Drift | `pnpm check:documentation-drift` |

Cursor stop hook already runs `@afenda/docs typecheck` when `apps/docs` is in scope.

### Deploy (TIP-032 Slice 6)

- Separate Vercel project from `@afenda/erp` — Root Directory `apps/docs`
- No shared env secrets with ERP auth/database
- Config: `apps/docs/vercel.json`, `apps/docs/next.config.ts` (`outputFileTracingRoot`)
- Support doc: [`docs/governance/support/fumadocs-docs-app-deploy.md`](../governance/support/fumadocs-docs-app-deploy.md)
- Optional PR preview: `.github/workflows/preview-docs.yml` + `VERCEL_PROJECT_ID_DOCS`

---

## Failure modes

| Risk | Mitigation |
|------|------------|
| Docs content contradicts governance docs | Keep registries in `docs/`; link — don't copy; run drift guard |
| Accidental `@afenda/erp` → `@afenda/docs` dependency | `pnpm quality:boundaries` fails on unapproved edges |
| Fumadocs upgrade breaks build | Pin versions in catalog or package.json; gate on `build` in CI |
| Premature `@afenda/ui` consumption | Defer to themed slice; enforce `pnpm ui:guard:scan` when added |
| Foundation slice coupling | TIP-032 deliverables limited to `apps/docs/**` until explicit registry expansion |

---

## Relationship to PAS / governance

| Artifact | Role |
|----------|------|
| This document | Architecture boundary + content model (**structural truth**) |
| [`fumadocs-docs-app-deploy.md`](../governance/support/fumadocs-docs-app-deploy.md) | Deploy runbook |
| [`_afenda-erp-master-plan.llms.md`](_afenda-erp-master-plan.llms.md) §13 | Compass — docs app listed as Phase 3 P1 |
| [`afenda-openapi` skill](../../.cursor/skills/afenda-openapi/SKILL.md) (future) | Public API & OpenAPI — may extend docs app |

**Sequence:** Docs app delivery runs as a **parallel non-blocking track**. It does not appear in Foundation Phases 0–9 exit criteria.

---

## Trade-offs

| Decision | Alternative considered | Why this choice |
|----------|------------------------|-----------------|
| Fumadocs in isolated app | Nextra, Docusaurus, plain MDX | Fumadocs aligns with Next.js 16 + App Router already used by ERP |
| Separate `apps/docs` | Docs under `apps/erp` | Avoids CSP/auth/proxy coupling; independent deploy and CI |
| Zero `@afenda/*` in Slice 1 | Immediate design-system theming | Faster scaffold; no registry or TIP-004 overhead |
| Governance docs stay at repo root | Mirror into Fumadocs | Prevents ADR-0012 drift between two sources of truth |

---

## Maintenance

Update this document when:

1. `@afenda/docs` gains approved workspace dependencies (registry PR required)
2. Content model or deploy target changes
3. TIP-031 OpenAPI integration alters docs app structure
4. TIP-032 reaches `Complete` — align runtime matrix row with evidence paths

*Architecture baseline for TIP-032 — 2026-06-24*
