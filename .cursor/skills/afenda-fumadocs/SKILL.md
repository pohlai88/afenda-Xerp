---
name: afenda-fumadocs
description: >
  Governs all content authoring, configuration, and code quality in the @afenda/docs
  Fumadocs app (apps/docs/). Enforces the non-drift execution contract, MDX frontmatter
  schema, navigation structure, Tailwind v4 token isolation, CI gate requirements, and
  content boundary rules defined in TIP-032 and docs-app-architecture.md. Invoke with
  /afenda-fumadocs or attach when creating MDX pages, editing source.config.ts, adding
  navigation sections, configuring Fumadocs layouts, wiring CI gates, or working within
  the @afenda/docs package on any content or code task.
disable-model-invocation: true
---

# Afenda Fumadocs Session Standards

**Core principle:** `@afenda/docs` is a read-mostly leaf application. It has zero approved `@afenda/*` workspace runtime deps in Slice 1–2. Every change must stay within its authority boundary and must not couple to ERP foundation runtime slices.

**Announce at start of every turn:** "I'm using afenda-fumadocs — stating the fumadocs execution contract before edits."

**Always-on gate:** `.cursor/rules/afenda-coding-session.mdc` applies to this package too. This skill extends that contract specifically for the Fumadocs context.

---

## When this skill triggers

| Trigger | Source |
|---------|--------|
| User invokes `/afenda-fumadocs` | Explicit slash command |
| User attaches skill manually | Composer skill picker |
| Any work in `apps/docs/**` | Fumadocs layer governance |
| TIP-032 slice implementation | `docs/PAS/slice/[Partially Implemented] tip-032-implementation-documentation.md` |
| MDX page authoring or editing | Content quality enforcement |
| `source.config.ts` or `lib/source.ts` modification | Schema authority |

---

## Session phases (do not skip)

| Phase | Action | Sections |
|-------|--------|----------|
| **0 · Contract** | State §0 six lines; paste TIP-032 handoff block if implementing a slice; check §0.1 hard stops | §0, §0.1, §0.2, §1 |
| **1 · Implement** | Edit allowed files only; follow §2 content authority, §3 source config, §4 MDX authoring, §5 navigation, §6 CSS | §2–§9 |
| **2 · Evidence** | Post §10 Completion Report with pass/fail table and gates run | §10 |

---

## 0 · Non-drift execution contract

**State all six lines before any edit.**

```
1. Objective         — exact change in one sentence
2. Allowed layer     — apps/docs/ (+ root package.json only for CI wiring in Slice 2)
3. Files to change   — explicit list
4. Prohibited        — @afenda/erp, packages/database, packages/ui, packages/appshell
                        governance markdown migration into Fumadocs (docs/architecture/** → apps/docs/content)
                        @afenda/* runtime deps without dependency-registry update + Architecture Authority approval
                        root package.json changes unrelated to docs CI (Slice 2 only)
5. Authority         — Application Authority (ADR-0001) / TIP-032 / docs-app-architecture.md
6. Acceptance gates  — pnpm --filter @afenda/docs typecheck
                        pnpm --filter @afenda/docs test:run
                        pnpm --filter @afenda/docs build
                        pnpm quality:boundaries
                        pnpm exec biome ci apps/docs
                        pnpm check:documentation-drift
```

> If a change needs a workspace dep not in the registry, **stop and report.** File a dependency-registry PR first.

---

## 0.1 · Anti-drift hard stops

Stop immediately if any of the following are true:

- Change would copy ADR, architecture registry, or delivery TIP markdown verbatim into `apps/docs/content/` — this violates ADR-0012. Cross-link instead.
- `@afenda/erp`, `packages/database`, `packages/ui`, or `packages/appshell` would be imported by `apps/docs`.
- A new `@afenda/*` workspace runtime dependency is needed — no registry update exists.
- `@afenda/ui` primitives are being added to the docs shell (deferred to Slice 3+ with TIP-004 approval).
- A CSS token override would edit the ERP `globals.css` instead of `apps/docs/src/app/globals.css`.
- Fumadocs upgrade would be applied without a `pnpm --filter @afenda/docs build` gate first.
- A change to `source.config.ts` schema would break existing MDX frontmatter without a migration plan.

---

## 0.2 · Package authority matrix (docs layer)

| Authority | Package/Path | Owns | Consumers may NOT |
|-----------|-------------|------|-------------------|
| **Application Authority** | `apps/docs/` | MDX content, routes, layouts, tests, config | Import from `@afenda/erp` or spine packages |
| **Content Authority** | `apps/docs/content/docs/` | Published MDX pages and `meta.json` | Mirror governance docs verbatim |
| **Config Authority** | `apps/docs/source.config.ts` | Zod frontmatter schema, MDX compiler options | Define schemas that conflict with Fumadocs core |
| **Dependency Registry** | `docs/architecture/dependency-registry.md` | Approved workspace deps for `@afenda/docs` | Add runtime deps without registry PR |
| **Governance Authority** | `docs/architecture/`, `docs/adr/`, `docs/PAS/slice/` | ADRs, registries, TIPs | Be edited by docs app tooling |
| **Design Authority** (Slice 3+) | `apps/docs/src/app/docs-editorial-palette.css` | Docs-owned OKLCH + fd bridge | Import `@afenda/design-system` for shell chrome |

---

## 1 · Session start checklist

```
[ ] Stated §0 six-line contract?
[ ] Checked §0.1 hard stops — none triggered, or escalated?
[ ] Read docs/architecture/docs-app-architecture.md? (if touching architecture)
[ ] TIP-032 slice consulted? (if implementing a slice — paste handoff block)
[ ] Dependency registry clean — no new @afenda/* runtime deps?
[ ] Existing tests passing? pnpm --filter @afenda/docs test:run
```

---

## 2 · Content boundary rules

### What lives in `apps/docs/content/docs/`

| Allowed | Not Allowed |
|---------|-------------|
| Engineer guides, onboarding, how-tos | ADR content (keep in `docs/adr/`) |
| Monorepo map, package descriptions | Architecture registries (keep in `docs/architecture/`) |
| Contributing workflow, dev setup | Delivery TIP specs (keep in `docs/PAS/slice/`) |
| API how-to guides (post TIP-031) | Copy-paste governance text from `docs/` |
| Component authoring guides | Operational runbooks duplicating existing docs |

### Cross-linking rule

Cross-link to governance docs via repo-relative paths or GitHub URLs. Never duplicate.

```mdx
<!-- ✅ Correct: cross-link -->
See the [Architecture Authority](https://github.com/your-org/afenda-Xerp/blob/main/docs/adr/ADR-0001.md)
for boundary rules.

<!-- ❌ Wrong: copy-paste governance content into MDX -->
## ADR-0001 Architecture Authority
[verbatim ADR content here]
```

---

## 3 · Source config & schema patterns

### Minimal valid `source.config.ts`

```ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig();
```

### Extended schema (when adding custom frontmatter)

```ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { pageSchema, metaSchema } from "fumadocs-core/source/schema";
import { z } from "zod";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({
      // Add fields here — use .optional() for non-required
      noIndex: z.boolean().default(false),
      status: z.enum(["draft", "review", "published"]).default("published"),
      version: z.string().optional(),
    }),
  },
  meta: {
    schema: metaSchema.extend({
      // meta.json extensions (rare)
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
```

**Rules:**
- Always extend `pageSchema` (not raw `z.object`) to preserve Fumadocs built-ins (`toc`, `structuredData`, `body`)
- Run `pnpm generate:source` (`fumadocs-mdx` generator) whenever `source.config.ts` changes — it regenerates `.source/`
- Schema changes that add required (non-optional, no default) fields break all existing MDX — add `.optional()` or provide `.default()`
- Do **not** import from `.source/` directly — import from the `collections/server` alias in `lib/source.ts`

### Source loader (`lib/source.ts`)

```ts
// biome-ignore lint/correctness/noUndeclaredDependencies: generated at build time
import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
```

The `collections/server` alias resolves to `.source/server.ts` (generated). Do not hand-edit `.source/`.

---

## 4 · MDX authoring standards

Full patterns → [CONTENT-PATTERNS.md](CONTENT-PATTERNS.md). Key rules:

- Every MDX page **must** have `title` in frontmatter; `description` is strongly recommended
- Start content headings at `h2` — the page `title` renders as `<h1>` via `<DocsTitle>`
- Use Fumadocs UI built-in components (`Callout`, `Tabs`, `Steps`, `Accordion`) before inventing wrappers
- Code blocks: use language identifiers (`ts`, `tsx`, `bash`, `json`) + `title=` annotation for file blocks
- Images: place in `apps/docs/public/`; reference via `/image.png` (not ERP assets)
- Internal links: use relative `/docs/...` paths (wired through `createRelativeLink` in `page.tsx`)

### Prohibited MDX patterns

| Pattern | Reason | Fix |
|---------|--------|-----|
| No `title` in frontmatter | Build type-check fails | Add `title` field |
| Verbatim ADR/architecture text | ADR-0012 drift violation | Cross-link instead |
| `import` from `@afenda/erp` or `@afenda/ui` | Boundary / deferred | Use Fumadocs UI built-ins |
| `className` on Fumadocs primitives | TIP-004 policy | Use Fumadocs layout props |
| Hardcoded localhost URLs | Breaks CI/deploy | Use plain commands |
| Orphan MDX file not in `meta.json` | Unreachable page | Add to pages array |

---

## 5 · Navigation structure (`meta.json`)

### Structure

Every content directory that appears in the sidebar must have a `meta.json`:

```json
{
  "title": "Getting Started",
  "pages": [
    "index",
    "installation",
    "dev-setup"
  ]
}
```

### Rules

- `pages` controls sidebar order — entries match MDX filenames (without `.mdx`)
- Use `"---"` as a separator item for visual grouping
- The `title` field is the sidebar section label
- Nested directories (sub-sections) are supported — add a folder with its own `meta.json`
- Do **not** leave orphan MDX files without a corresponding `meta.json` entry — they become unreachable

### Multi-section example

```json
{
  "title": "Docs",
  "pages": [
    "index",
    "---",
    "getting-started",
    "monorepo-map",
    "contributing"
  ]
}
```

### Directory tree conventions

```
content/docs/
├── meta.json          ← root navigation
├── index.mdx          ← /docs home
├── getting-started/
│   ├── meta.json      ← section navigation
│   └── index.mdx      ← /docs/getting-started
├── monorepo-map/
│   ├── meta.json
│   └── index.mdx
└── contributing/
    ├── meta.json
    └── index.mdx
```

---

## 6 · Fumadocs UI layout patterns

The canonical implementations live in the codebase — read before editing:

| File | Role |
|------|------|
| `apps/docs/src/app/layout.tsx` | Root layout with `RootProvider` |
| `apps/docs/src/app/docs/layout.tsx` | Docs layout with `DocsLayout` + page tree |
| `apps/docs/src/lib/layout.shared.ts` | `baseOptions()` — shared nav config |
| `apps/docs/src/app/docs/[[...slug]]/page.tsx` | Dynamic docs route (Server Component) |
| `apps/docs/src/components/mdx.tsx` | `getMDXComponents` merger |

**Rules:**
- `baseOptions()` lives in `lib/layout.shared.ts` — extend it there, never inline into layouts
- Page route must be a Server Component — no `"use client"` on the slug page
- Always `await params` before accessing `slug` (Next.js 16 async params)
- `getMDXComponents` must use `satisfies MDXComponents` — not `as MDXComponents`
- `DocsPage`, `DocsTitle`, `DocsDescription`, `DocsBody` come from `fumadocs-ui/layouts/docs/page`
- `createRelativeLink` from `fumadocs-ui/mdx` is wired per page — do not make it global

---

## 7 · Tailwind v4 and CSS rules

### CSS tier model (Slice 3.6 — mandatory)

| Tier | Scope | Token source |
|------|-------|--------------|
| **0 · Fumadocs shell** | Sidebar, search, TOC, theme toggle | `--color-fd-*` via `@theme inline` in `docs-editorial-palette.css` |
| **1 · Docs editorial** | Warm neutrals assigned to fd roles | `--docs-editorial-*` OKLCH literals |
| **2 · Prose content** | MDX article links, blockquotes | `--docs-editorial-prose-accent` (pinned Afenda primary OKLCH) |
| **3 · MDX components** | Callout, Tabs, Steps | Default `fumadocs-ui` — extend via `getMDXComponents` only |

**Prohibited for shell:** `@afenda/design-system` CSS import, `--afenda-*` token bridge, `className` on Fumadocs layout primitives.

### `globals.css` pattern

```css
@import "tailwindcss";
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";
@import "./docs-editorial-palette.css";
```

### `docs-editorial-palette.css` (shell authority)

- `@theme inline { --color-fd-*: var(--docs-editorial-*) }` — required for runtime-safe opacity modifiers (`bg-fd-secondary/50`).
- `--color-fd-primary` maps to **neutral shell text**, not brand accent.
- Brand accent is **prose-only** via pinned OKLCH; sidebar active uses neutral `--docs-editorial-surface-hover` only.
- Search/kbd fixes: `button[data-search-full]` and `button[data-search-full] kbd` attribute selectors.

**Rules:**
- Do **not** import ERP `globals.css` or `@afenda/design-system/css/afenda-tokens.css`
- Do **not** add raw Tailwind utilities to Fumadocs UI primitives via `className`
- Fumadocs layout variables (`--fd-layout-width`, etc.) may be overridden in `globals.css`
- Full Fumadocs CSS vendor fork is deferred — use upstream imports + docs-owned palette unless upgrade regressions force vendoring

### PostCSS config

```mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Do not add the ERP PostCSS config or shared config — docs uses its own isolated PostCSS.

---

## 8 · TypeScript rules (docs layer)

Same rules as `afenda-coding-session §3` apply here with docs-specific additions:

- `params` in App Router page components is typed as `Promise<{ slug?: string[] }>` (Next.js 16 async params)
- Return type of `generateStaticParams` must be `DocsPageParams[]`
- `getMDXComponents` must use `satisfies MDXComponents` — no `as MDXComponents` cast
- `baseOptions()` must return `BaseLayoutProps` — no `as unknown` widening

### Banned patterns in docs app

| Pattern | Fix |
|---------|-----|
| `import { anything } from "@afenda/erp"` | Not allowed — hard boundary |
| `import { anything } from "@afenda/ui"` | Deferred — Slice 3+ only |
| `import { anything } from "collections/server"` outside `lib/source.ts` | Use the `source` export instead |
| Raw `as` cast on `MDXComponents` | Use `satisfies` |
| `any` in page component types | Use `unknown` + narrowing |
| `params.slug` without awaiting `params` | Async params — always `await params` |

---

## 9 · Testing standards (`apps/docs/src/__tests__/`)

### Smoke test pattern

```ts
import { describe, expect, it } from "vitest";
import { getMDXComponents } from "@/components/mdx";
import { baseOptions } from "@/lib/layout.shared";

describe("@afenda/docs routes", () => {
  it("exposes correct branding in shared layout options", () => {
    const options = baseOptions();
    expect(options.nav?.title).toBe("Afenda Docs");
  });

  it("merges default MDX components without losing Fumadocs primitives", () => {
    const components = getMDXComponents();
    expect(components).toBeDefined();
    expect(typeof components.a).toBe("function");
  });
});
```

### What to test

| Test type | Scope |
|-----------|-------|
| Layout options smoke | `baseOptions()` returns expected nav title, links |
| MDX components merge | `getMDXComponents()` includes Fumadocs defaults |
| Schema validation | Zod schema accepts valid frontmatter; rejects missing required fields |
| Source loader smoke | `source.getPage([])` returns a page (requires `pnpm generate:source` first) |

### What NOT to test

- Fumadocs internals (page tree building, MDX compilation) — those are upstream library tests
- Next.js routing behavior — covered by `pnpm --filter @afenda/docs build`
- ERP-side behavior — the docs app has no ERP dependency

### Pre-test requirement

```bash
pnpm --filter @afenda/docs generate:source  # regenerates .source/ before test run
pnpm --filter @afenda/docs test:run
```

The `pretest:run` script in `package.json` already runs `generate:source` — this is intentional and must not be removed.

---

## 10 · Verification gates

Run the narrowest gate that covers your change. See [VERIFICATION.md](VERIFICATION.md) for the full matrix.

```bash
# After any source.config.ts or MDX change
pnpm --filter @afenda/docs generate:source  # regenerate types (prebuild/pretest handles this)
pnpm --filter @afenda/docs typecheck        # strict TypeScript

# After any content or navigation change
pnpm --filter @afenda/docs build            # verifies MDX compiles and routes resolve

# After any code change
pnpm --filter @afenda/docs test:run         # Vitest suite

# Before every PR / slice completion
pnpm quality:boundaries                     # zero unapproved @afenda/* edges from docs
pnpm exec biome ci apps/docs               # Biome format + lint
pnpm check:documentation-drift             # drift guard
```

Full pre-PR gate:

```bash
pnpm --filter @afenda/docs typecheck && \
pnpm --filter @afenda/docs test:run && \
pnpm --filter @afenda/docs build && \
pnpm quality:boundaries && \
pnpm exec biome ci apps/docs && \
pnpm check:documentation-drift
```

---

## 11 · Completion report (mandatory)

Every fumadocs session must end with this report. Content without evidence is not done.

````md
## Fumadocs Completion Report

### Objective
- <the change, one sentence>

### Files changed
| File | Reason |
|------|--------|
| ... | ... |

### Authority followed
- Application Authority (ADR-0001) / TIP-032 / docs-app-architecture.md
- <specific slice if implementing a TIP-032 slice>

### Content boundary proof
| Rule | Result |
|------|--------|
| No verbatim governance doc copied into apps/docs/content | Pass/Fail |
| No @afenda/erp import in docs app | Pass/Fail |
| No @afenda/ui import (Slice 1–2) | Pass/Fail |
| No new @afenda/* runtime dep without registry update | Pass/Fail |
| Frontmatter title present on all new MDX pages | Pass/Fail |
| No orphan MDX files missing from meta.json | Pass/Fail |
| No raw any / unsafe cast in TS files | Pass/Fail |
| No className on Fumadocs UI primitives | Pass/Fail |
| No params.slug used without await params | Pass/Fail |
| No ERP globals.css imported | Pass/Fail |
| pretest:run script kept intact (calls generate:source) | Pass/Fail |

### TIP-032 DoD rows closed (if applicable)
| # | Criterion | Gate | Status |
|---|-----------|------|--------|
| ... | ... | ... | [x]/[ ] |

### Gates run
```bash
pnpm --filter @afenda/docs typecheck
pnpm --filter @afenda/docs test:run
pnpm --filter @afenda/docs build
pnpm quality:boundaries
pnpm exec biome ci apps/docs
pnpm check:documentation-drift
```

### Known gaps
- None / <list clearly, including any deferred slice or missing upstream contract>
````

Any `Fail` row in the boundary proof table must be resolved or escalated before the session is reported complete.

---

## Extended reference

- Full gate matrix → [VERIFICATION.md](VERIFICATION.md)
- MDX authoring patterns in depth → [CONTENT-PATTERNS.md](CONTENT-PATTERNS.md)
- TIP-032 delivery authority → `docs/PAS/slice/[Partially Implemented] tip-032-implementation-documentation.md`
- Docs app architecture boundary → `docs/architecture/docs-app-architecture.md`
- Dependency registry → `docs/architecture/dependency-registry.md`
- Fumadocs UI theme → `fumadocs-ui/css/neutral.css` + `fumadocs-ui/css/preset.css`
- Afenda coding session (base contract) → `.cursor/skills/afenda-coding-session/SKILL.md`
