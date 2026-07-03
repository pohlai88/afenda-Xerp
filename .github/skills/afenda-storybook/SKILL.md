---
name: afenda-storybook
description: >-
  Authoritative workflow for the PAS-006 shadcn-studio Storybook lab (ADR-0027).
  Covers story locations, Meta/StoryObj patterns, CSS chain, Vite aliases, MCP
  preview, block auto-codegen, tsconfig rules, common errors, and acceptance
  gates. Use when writing studio stories, debugging Storybook, or after MCP block
  install.
disable-model-invocation: true
paths:
  - apps/storybook/**
  - packages/shadcn-studio/**/*.stories.tsx
---

# Afenda Storybook Skill

**Authority:** [PAS-006](../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · [ADR-0027](../../docs/adr/ADR-0027-frontend-presentation-reset.md) · companion: [shadcn-studio](../shadcn-studio/SKILL.md)

**Retired for this lab:** `@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui` story globs · `pnpm ui:guard*` · PAS-005 CSS gates.

Stack: Storybook **10** · `@storybook/react-vite` · Vitest browser · `@storybook/addon-a11y` · `@storybook/addon-mcp` · `@storybook/addon-docs`

| Command | Purpose |
| --- | --- |
| `pnpm storybook` / `pnpm storybook dev` | Codegen + dev server `:6006` |
| `pnpm storybook generate` | Block manifest, auto/flat/asset stories, primitive scaffolds |
| `pnpm check:storybook-block-coverage` | Flat block registry ↔ manifest gate |
| `pnpm check:storybook-primitive-coverage` | Gate A — tier rules, render/play/lab-smoke (registry-driven) |
| `pnpm check:primitive-mismatch` | Gate B — adapter+contract M1/M2/M3/M4/M6 |
| `pnpm check:storybook-evidence` | Gate C — role-first play, data-slot, interaction evidence |
| `pnpm check:storybook-primitive-evidence` | All three gates (default `STORYBOOK_EVIDENCE_ENFORCE=gold`) |
| `pnpm test:storybook:run` | Vitest browser story tests (`lab-smoke` only) |
| `pnpm test:storybook:coverage` | Interaction tests + V8 coverage report |
| `pnpm --filter @afenda/storybook typecheck` | TS for lab config |

---

## 0. `.storybook` configuration (SB 10.4)

OSS reference: [Configure Storybook](https://storybook.js.org/docs/configure) · config folder: `apps/storybook/.storybook/` (override with `-c` on CLI if needed).

| SB 10.4 element | Afenda file | Implementation |
| --- | --- | --- |
| `main.ts` — `framework` | `.storybook/main.ts` | `@storybook/react-vite` via absolute path (monorepo-safe) |
| `main.ts` — `stories` | same | Agentic pilot globs — see §1; expand after `pnpm storybook generate` |
| `main.ts` — `staticDirs` | same | `public/` + `packages/shadcn-studio/public` → `/studio-assets` |
| `main.ts` — `addons` | same | docs, a11y, designs, chromatic, MCP (Vitest addon excluded — see comment in file) |
| `main.ts` — `typescript` | same | `react-docgen-typescript` + `tsconfig.storybook.json` |
| `main.ts` — `docs` | same | `defaultName: "Documentation"` |
| `main.ts` — `viteFinal` | same | Studio Vite aliases, Next mocks, Vitest globals — §4 |
| `preview.tsx` — rendering | `.storybook/preview.tsx` | `decorators`, `parameters`, `globalTypes`, `loaders`, bundled CSS import |
| `preview.tsx` — `storySort` | same | **Inline** in `parameters.options.storySort` (SB 10 requirement) |
| `manager.ts` — UI | `.storybook/manager.ts` | Afenda lab theme, toolbar, panel position |

**Preview exports (SB 10.4):** `decorators` · `parameters` · `globalTypes` · `initialGlobals` · `loaders` · `tags` — all in `preview.tsx`.

**Not used:** `webpackFinal` (Vite builder) · async custom `stories` loader · `refs` composition · CSF Next `defineMain` / `definePreview` (alpha).

Gate: `pnpm --filter @afenda/storybook typecheck` · `pnpm --filter @afenda/storybook storybook:build`

---

## 1. Story file locations

| Story kind | Path |
| --- | --- |
| **Curated blocks** (dark variants, sample data) | `packages/shadcn-studio/src/storybook/shadcn-studio-blocks.stories.tsx` |
| **Auto-discovered blocks** (codegen) | `packages/shadcn-studio/src/storybook/shadcn-studio-blocks-auto.stories.tsx` |
| **Flat block exports** (codegen) | `packages/shadcn-studio/src/storybook/shadcn-studio-blocks-flat.stories.tsx` |
| **SVG / asset gallery** (codegen) | `packages/shadcn-studio/src/storybook/shadcn-studio-assets.stories.tsx` |
| **Primitive catalog** (codegen) | `packages/shadcn-studio/src/storybook/shadcn-studio-primitives-catalog.stories.tsx` |
| **Colocated primitives** (codegen scaffolds) | `packages/shadcn-studio/src/components-ui/*.stories.tsx` |
| **Primitives showcase** | `packages/shadcn-studio/src/storybook/shadcn-studio-primitives.stories.tsx` |
| **Theme lab / presets** | `packages/shadcn-studio/src/storybook/shadcn-studio-theme-lab.stories.tsx` |
| **Lab welcome** | `apps/storybook/stories/*.stories.tsx` |
| **Agentic pilot** (AI batches ≤10) | `packages/shadcn-studio/src/storybook/agentic/*.stories.tsx` |

**Agentic rebuild:** see [afenda-storybook-agentic-setup](../afenda-storybook-agentic-setup/SKILL.md) — builder stays `@storybook/react-vite`; tag `ai-generated` until review.

**Discovery globs** (`apps/storybook/.storybook/main.ts`) — **agentic pilot** (2026-07-03):

```text
../stories/**/*.stories.@(ts|tsx)
../../../packages/shadcn-studio/src/storybook/agentic/**/*.stories.@(ts|tsx)
```

Full catalog (blocks, primitives, colocated) re-enables when expanding globs to `../../../packages/shadcn-studio/src/**/*.stories.@(ts|tsx)` after `pnpm storybook generate` — see [afenda-storybook-agentic-setup](../afenda-storybook-agentic-setup/SKILL.md).

**Helpers** live in `packages/shadcn-studio/src/storybook/`:

```text
story-parameters.ts          ← L4 source (re-exported by src/lab/index.ts)
theme.decorator.tsx          ← L4 Storybook theme wrapper (re-exported by lab subpath)
src/lab/index.ts             ← @afenda/shadcn-studio/lab public subpath (re-exports only)
shadcn-studio-theme-lab.compositions.tsx
block-story-manifest.generated.json   ← codegen manifest (do not hand-edit)
```

**Rule:** Keep `*.stories.tsx` thin — render logic in `storybook/*.compositions.tsx`, data in fixtures when needed.

### Title naming

| Prefix | Used for |
| --- | --- |
| `Shadcn Studio/Blocks` | Curated MCP block stories |
| `Shadcn Studio/Blocks Auto` | Codegen one-story-per-block |
| `Shadcn Studio/Primitives` | Stock `@/components/ui` |
| `Shadcn Studio/Theme Lab` | ThemeCustomizer + preset matrix |
| `Afenda/Lab` | Welcome / integration notes |

---

## 2. Meta + StoryObj template

**Story parameters import rule (import zone gate):**

| Location | Import from |
| --- | --- |
| `packages/shadcn-studio/src/storybook/*.stories.tsx` | `./lab/index.js` or `../lab/index.js` from colocated ui |
| `packages/shadcn-studio/src/storybook/**` | `../lab/index.js` |
| `apps/storybook/stories/**` | `@afenda/shadcn-studio/lab` (Zone C) |

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import MyBlock from "../components-layouts/my-block.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioFigmaDesignFromEnv,
  shadcnStudioFullscreenLayout,
  shadcnStudioStoryA11y,
} from "./lab/index.js";

const meta = {
  title: "Shadcn Studio/Blocks",
  component: MyBlock,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta<typeof MyBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MyBlockLight: Story = {};

export const MyBlockDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
};

export const LoginStyleFullscreen: Story = {
  render: () => <MyBlock />,
  parameters: {
    ...shadcnStudioFullscreenLayout,
    ...shadcnStudioFigmaDesignFromEnv("STORYBOOK_FIGMA_MY_BLOCK"),
  },
};
```

**Always** `satisfies Meta<typeof Component>` — not `as Meta`.

**Theme decorator:** global in `apps/storybook/.storybook/preview.tsx` — do **not** repeat on meta unless a story needs forced context (Theme Lab preset matrix, ThemeCustomizer autodocs harness).

### CSF layers (Storybook 10)

| Layer | Owns |
| --- | --- |
| `preview.tsx` | `tags: ["autodocs"]`, `loaders: [mswLoader]`, global `decorators`, `parameters`, `storySort` (inline) |
| `meta` | `title`, `component`, `parameters`, `tags` (string literals only) |
| `story` | `args`, `render`, `play`, story `parameters`, `globals`, smoke tags | No story `loaders` in agentic pilot — use args / `parameters.msw` |

**Tag policy** (mirror constants in `@afenda/shadcn-studio/lab` — literals required in CSF files):

| Tag | Use |
| --- | --- |
| `autodocs` | Meta-level literal — docs page from component props |
| `ai-generated` | Meta-level literal — remove after human review |
| `lab-smoke` | **Story-level literal** on exports with `play` — Vitest CI (`pnpm test:storybook:run`) |
| `colocated` | Args-first primitive next to source |
| `skip-test` | Exclude from Vitest (reserved) |

**Indexer rule:** `tags` must be **string literal arrays** in CSF — do not spread imported constants (`[...agenticPilotMetaTags]` fails SB 10 indexer). Reference values in `agentic-story-parameters.ts` only.

**Play (SB 10.4):** use `canvas` from play context for in-story queries — see **Play function (SB 10.4 → Afenda)** below.

```tsx
play: async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: /submit/i })).toBeVisible();
},
```

**Presentation rules (ADR-0027):** Stock shadcn `className` on studio primitives is **OK** during stabilization. Do **not** apply legacy Governed UI `@afenda/ui` rules in this lab.

### Writing stories (SB 10.4 → Afenda)

OSS reference: [How to write stories](https://storybook.js.org/docs/writing-stories) · format: **CSF 3** only (`Meta` / `StoryObj`) — not CSF Next `preview.meta()`.

| SB 10.4 topic | Afenda pattern | Notes |
| --- | --- | --- |
| Where to put stories | `packages/shadcn-studio/src/storybook/agentic/` (pilot) · `apps/storybook/stories/` (lab shell) · future: colocated `components-ui/*.stories.tsx` after codegen | Not always adjacent to component file — render logic in `*.compositions.tsx` |
| Default export (`meta`) | `export default meta` with **static** `title` string + `component` + `satisfies Meta<typeof X>` | `title` must be literal (indexer); never import title constants |
| Named story exports | `UpperCamelCase` (`Primary`, `OpenClose`, `Welcome`) | Optional `name` for sidebar label |
| Args | Prefer `args` on `StoryObj` | Use `fn()` from `storybook/test` for callbacks (Controls + play assertions) |
| Custom `render` | Story-level or wrapper component (`DialogDemo`) | Spread `args` onto leaf components when using inline render |
| React Hooks in stories | Avoid — use args + compositions | Hooks belong in composition modules, not CSF when avoidable |
| `play` | `play: async ({ canvas, args }) => { … }` | See **Play function (SB 10.4 → Afenda)** below |
| `userEvent` / `expect` | Import from `storybook/test` | SB 10.4 also allows destructuring `userEvent` from play context — either is fine |
| Parameters | Spread lab helpers: `agenticCenteredMetaParameters`, `agenticFullscreenMetaParameters` | Global params in `preview.tsx`; **backgrounds disabled** — use theme toolbar |
| Loaders | Global `mswLoader` only in `preview.tsx` | Prefer **args** for story data; MSW routes via `parameters.msw` — see agentic-setup skill |
| Tags | Meta: `agenticPilotMetaTags`; `lab-smoke` on stories with `play` only | Global `autodocs` in preview; `ai-generated` excluded in sidebar filter — see agentic-setup skill |
| Decorators | **Global** in `preview.tsx` only | See **Decorators (SB 10.4 → Afenda)** below — no per-meta padding wrappers |
| Multi-component | `*.compositions.tsx` + thin CSF | See **Building pages (SB 10.4 → Afenda)** below |
| Autodocs | `tags: ["autodocs"]` on meta (+ `lab-smoke` for CI) | Agentic pilot adds `ai-generated` until review |

**Canonical agentic pilot:** `packages/shadcn-studio/src/storybook/agentic/button.stories.tsx`

Gate: `pnpm test:storybook:run` (stories tagged `lab-smoke`)

### CSF API (SB 10.4 → Afenda)

OSS reference: [Component Story Format (CSF)](https://storybook.js.org/docs/api/csf) · **CSF 3 only** — not CSF 2 function stories, not CSF Next `preview.meta()`.

| CSF concept | Afenda rule |
| --- | --- |
| Default export | `const meta = { … } satisfies Meta<typeof X>; export default meta;` |
| `component` | Required on meta — drives Autodocs prop tables (`react-docgen-typescript` in `main.ts`) |
| `title` | **Always set explicitly** as static string (`"Agentic/Button"`, `"Shadcn Studio/Blocks"`) — do not rely on auto-title from path |
| Named exports | **Objects** (`StoryObj`), not CSF 2 render functions — enables `{ ...Primary, globals: … }` spreads |
| Export casing | `UpperCamelCase` — matches SB `storyNameFromExport` / startCase |
| `name` | Use only for display-only renames; **export name drives story ID/URL** (Chromatic, Vitest) |
| Args | `args` on story; callbacks via `fn()` from `storybook/test` — not legacy `action()` |
| Default render | Omit `render` when meta `component` + args suffice; wrapper components when not |
| `play` | Story object field; assert with `expect` from `storybook/test` |
| Meta `decorators` | Avoid — global theme/portal in `preview.tsx` |
| Non-story exports | Prefer `*.compositions.tsx` / `*.shared.ts` beside CSF — not `excludeStories` in meta unless unavoidable |
| CSF 2 migration | If found: `pnpm exec storybook migrate csf-2-to-3 --glob="**/*.stories.tsx" --parser=tsx` then re-apply Afenda tags/parameters |

**Banned:** `as Meta` · `ComponentMeta` · `ComponentStory` · `Primary.bind({})` · `Primary.args = …` on functions.

### Decorators (SB 10.4 → Afenda)

OSS reference: [Decorators](https://storybook.js.org/docs/writing-stories/decorators) · **CSF 3** `(Story, context) => …` — not CSF Next `definePreview`.

| SB 10.4 topic | Afenda pattern | Notes |
| --- | --- | --- |
| Global decorators | `apps/storybook/.storybook/preview.tsx` → `[storybookPortalDecorator, shadcnStudioThemeDecorator]` | **Only** place for theme + portal harness in agentic pilot |
| Inheritance order | Global (array order) → meta `decorators` → story `decorators` | Outer global runs first; story decorators innermost |
| Portal harness | `portal.decorator.tsx` — `STORYBOOK_PORTAL_ROOT_ID` sibling mount | Dialog / Menu / Tooltip play tests query `canvasElement.ownerDocument.body` |
| Theme / provider context | `theme.decorator.tsx` reads `context.globals.theme`, `context.parameters.layout`, `parameters.shadcnStudioPreset` | `ThemeProvider` + `SettingsProvider` + `TooltipProvider` — **not** `@storybook/addon-themes` |
| Layout / padding | `parameters.layout` (`shadcnStudioCenteredLayout`, `shadcnStudioPaddedLayout`, `fullscreen`) | Theme decorator applies `p-4` vs `min-h-svh` from `layout` — **not** per-meta `<div style={{ margin }}>` wrappers |
| Story context fields | `args` · `argTypes` · `globals` · `parameters` · `viewMode` | Use `globals.theme` toolbar — not `backgrounds` addon |
| Storybook hooks in render | Prefer `storybook/test` in `play` | If hooks needed in decorator/render, use `storybook/preview-api` equivalents alongside React hooks |
| Component (`meta`) decorators | **Avoid** in agentic pilot | Exception: Theme Lab / brand lab preset matrix when catalog expanded |
| Story-level decorators | **Avoid** in agentic pilot | Keep story object a pure component render; harness stays global |
| Mock data / providers | MSW via `loaders: [mswLoader]` + `parameters.msw` in preview | Not decorator-wrapped fetch mocks on agentic primitives |

**Canonical files:** `apps/storybook/.storybook/preview.tsx` · `portal.decorator.tsx` · `packages/shadcn-studio/src/storybook/theme.decorator.tsx`

### Loaders (SB 10.4 → Afenda)

OSS reference: [Loaders](https://storybook.js.org/docs/writing-stories/loaders) · SB recommends **args** over loaders for story data; loaders are an escape hatch.

| SB 10.4 topic | Afenda pattern | Notes |
| --- | --- | --- |
| Global loaders | `preview.tsx` → `loaders: [mswLoader]` | MSW bootstrap before render (dev + Vitest) |
| Inheritance | Global → meta → story; parallel run; `loaded` merge (later wins) | Agentic pilot uses **global only** |
| Remote / async data | **`parameters.msw.handlers`** (+ optional story override) | Not `fetch` in story `loaders` for agentic primitives |
| Story props / fixtures | **`args`** + inline composition fixtures | Button / Input / Checkbox args-first |
| `render(_, { loaded })` | **Not used** in agentic pilot | Add only for lazy import or non-args async prefetch |

Full table: [afenda-storybook-agentic-setup](../afenda-storybook-agentic-setup/SKILL.md) · **Loaders (SB 10.4)**.

### Tags (SB 10.4 → Afenda)

OSS reference: [Tags](https://storybook.js.org/docs/writing-stories/tags)

| SB 10.4 topic | Afenda pattern | Notes |
| --- | --- | --- |
| Global tags | `preview.tsx` → `['autodocs']` | Implicit `dev`, `test`, `manifest` on all stories |
| Built-in `play-fn` | Auto on stories with `play` | Agentic pilot stories with `lab-smoke` also define `play` |
| Custom meta tags | Literals `["autodocs", "ai-generated"]` on meta | Mirror: `agenticPilotMetaTags` in `agentic-story-parameters.ts` — **not** spread in CSF |
| Vitest subset | Custom `lab-smoke` on **story** (not meta) | `vitest.storybook.config.ts` `include: ['lab-smoke']` — not built-in `test` alone |
| Remove tag | `!tag` prefix | Button `Outline` omits `lab-smoke` — variant without CI |
| `main.ts` tag config | `ai-generated.defaultFilterSelection: 'exclude'` | Sidebar filter hides agentic batches until included |
| Docs-only recipe | `['autodocs', '!dev']` | **Deferred** — not used in agentic pilot |
| Combo / `!test` recipe | Variant hidden, combo untested | **Deferred** — use story-level `lab-smoke` instead of meta-wide CI |

Full table: [afenda-storybook-agentic-setup](../afenda-storybook-agentic-setup/SKILL.md) · **Tags (SB 10.4)**.

### Play function (SB 10.4 → Afenda)

OSS reference: [Play function](https://storybook.js.org/docs/writing-stories/play-function) · [Interaction testing](https://storybook.js.org/docs/writing-tests/interaction-testing) · executed after story render via `@storybook/addon-vitest` on `lab-smoke` tags.

| SB 10.4 topic | Afenda pattern | Notes |
| --- | --- | --- |
| When to use | Stories tagged `lab-smoke` in agentic pilot | `pnpm test:storybook:run` — not every variant needs `play` |
| `canvas` | Default query scope from story root | Role-first queries (`getByRole`, `getByLabelText`) — **not** `within(canvasElement)` for in-canvas |
| Outside canvas | `within(canvasElement.ownerDocument.body)` | Dialog · Menu · Tooltip portaled content — iframe-safe vs OSS `screen` |
| OSS `screen` | Import from `storybook/test` when document-wide query is enough | Prefer `within(canvasElement.ownerDocument.body)` in lab for portal overlays |
| `userEvent` | Import from `storybook/test` in agentic pilot | SB 10.4 also allows `play: async ({ userEvent, canvas })` — either is valid |
| `expect` | Import from `storybook/test` | Assert spies via destructured `args` + `fn()` (see Button `Primary`) |
| Portal assertions | `findBy*` in body scope + `aria-expanded` on trigger when visibility flakes | Dialog · DropdownMenu — avoid `toBeVisible()` on portaled nodes when Vitest headless flakes |
| Args in play | Destructure `args` for callback verification | Pair with `fn()` on meta/story `args` |
| Composing plays | `await OtherStory.play(context)` | Rare in pilot — prefer one focused `lab-smoke` story per interaction surface |
| Debug | Storybook Interactions panel · Vitest failure URLs in CI output | OSS interaction-testing doc for step replay |

**Canonical files:**

| Pattern | File |
| --- | --- |
| Canvas + args + `fn()` | `agentic/button.stories.tsx` (`Primary`) |
| Portal open + body query | `agentic/dialog.stories.tsx` (`OpenClose`) |
| Portal menu + `aria-expanded` | `agentic/dropdown-menu.stories.tsx` (`OpenMenu`) |
| Hover + portaled content | `agentic/tooltip.stories.tsx` (`FocusReveal`) |

Gate: `pnpm test:storybook:run`

### Building pages (SB 10.4 → Afenda)

OSS reference: [Building pages with Storybook](https://storybook.js.org/docs/writing-stories/build-pages-with-storybook) · related: [args composition](https://storybook.js.org/docs/writing-stories/args#args-composition) · [mocking providers](https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-providers) · [mocking network](https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests).

| SB 10.4 topic | Afenda pattern | Notes |
| --- | --- | --- |
| Pure presentational pages | **Preferred** for PAS-006 lab | Blocks, auth-shell, layouts render in Storybook without ERP BFF/auth wiring |
| Connected logic | **`apps/erp` only** | Fetch, session, tenant, permissions stay in app wrappers — not duplicated in CSF |
| Thin CSF + compositions | `*.compositions.tsx` + optional `*.fixtures.ts` | Page shell / layout harness in compositions; CSF exports meta + args + `play` |
| Args composition (in-file) | `{ ...Primary.args, variant: "outline" }` | Agentic primitives — see Button `Outline` |
| Args composition (cross-story) | **`*.fixtures.ts`** or shared composition exports | OSS `PageLayout.Simple.args.user` import pattern — use fixtures, not cross-importing story objects in agentic pilot |
| Fullscreen page blocks | `agenticFullscreenMetaParameters` | e.g. `Agentic/AuthShell` · `login-page-04` stock block |
| Centered primitives | `agenticCenteredMetaParameters` | Dialog demos, inputs — not page-level |
| Mocking providers | Global `shadcnStudioThemeDecorator` in `preview.tsx` | `ThemeProvider` + `SettingsProvider` + `TooltipProvider` — **not** per-page `ProfilePageContext.Provider` |
| OSS container-context swap | **Not used** in agentic pilot | Tutorial `GlobalContainerContext` / story-level Provider mocks — Afenda uses global theme + args/fixtures |
| Mocking modules | `sb.mock(import("next/navigation"))` in `preview.tsx` | `@afenda/testing` Vite aliases as fallback — see Loaders / MSW sections |
| Mocking network | MSW `parameters.msw.handlers` | Global buckets in `msw-handlers.ts`; story override when page needs API fixtures |
| Editorial / Presentation Lab pages | Separate story tree + side-effect CSS | Not agentic pilot — route `afenda-editorial-bundle`; stage `A-lab` until promotion |

**Canonical files:**

| Pattern | File |
| --- | --- |
| Stock auth page (presentational) | `agentic/login-page-04.stories.tsx` |
| Page shell + fixtures | `account-settings-01.compositions.tsx` · `account-settings-01.fixtures.ts` |
| Lab welcome page | `lab-welcome.compositions.tsx` |
| Global providers + MSW | `apps/storybook/.storybook/preview.tsx` |

**Banned in agentic pilot:** ERP app shell import · kernel auth/session mocks in CSF · container-context Provider per story · undecorated fetch without MSW.

---

## 3. CSS chain (must mirror ERP)

`apps/storybook/.storybook/preview.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@afenda/shadcn-studio/shadcn-studio.css";
@source "../../../packages/shadcn-studio/src/**/*.{ts,tsx}";
```

Do not import `@afenda/ui`, appshell, or retired design-system CSS.

### Storybook Tailwind recipe (OSS → Afenda)

Authority for token/CSS edits: [afenda-tailwind](../afenda-tailwind/SKILL.md). OSS reference: [Integrate Tailwind CSS with Storybook](https://storybook.js.org/recipes/tailwindcss/).

| [Recipe step](https://storybook.js.org/recipes/tailwindcss/) | Afenda implementation | Notes |
| --- | --- | --- |
| 1. Configure PostCSS | `apps/storybook/postcss.config.mjs` (`@tailwindcss/postcss`) | Vite builder — **do not** add `@storybook/addon-styling-webpack` |
| 2. Provide Tailwind to stories | `.storybook/preview.css` → `import "./preview.css"` in `preview.tsx` | Four canonical `@import`s before any lab-only CSS |
| 3. Theme switcher | `shadcnStudioLabGlobalTypes.theme` toolbar + `shadcnStudioThemeDecorator` | `next-themes` `attribute="class"` — **not** `@storybook/addon-themes` |
| `tailwind.config.js` `darkMode` | `@custom-variant dark` in `shadcn-studio.css` | Tailwind v4 — class on `html` via ThemeProvider |

Gate: `pnpm check:downstream-integration` (ERP ↔ Storybook import parity).

### Storybook styling and CSS (SB 10.4 → Afenda)

OSS reference: [Styling and CSS](https://storybook.js.org/docs/configure/styling-and-css) · builder: `@storybook/react-vite`.

| SB 10.4 topic | Afenda implementation | Notes |
| --- | --- | --- |
| Import bundled CSS (recommended) | `import "./preview.css"` in `preview.tsx` | HMR; mirrors ERP `globals.css` chain |
| Include static CSS (`preview-head.html`) | **Not used** | Bundled import preferred; noir/lab CSS via per-story static import |
| CSS modules | Vite default | Studio uses Tailwind utilities — no `.module.css` in lab path |
| PostCSS | `apps/storybook/postcss.config.mjs` | Vite auto-applies; **no** `@storybook/addon-styling-webpack` |
| CSS pre-processors (Sass/Less) | **Not used** | Tailwind v4 + CSS `@import` only |
| CSS-in-JS context | `shadcnStudioThemeDecorator` | `ThemeProvider` + `SettingsProvider` — not `withThemeFromJSXProvider` |
| Webfonts | Token fallbacks in `shadcn-studio.css` | ERP uses `next/font`; lab relies on `"Geist"` / system stack via CSS vars |
| Static files | `main.ts` `staticDirs` | `apps/storybook/public` + `/studio-assets` |

See also: [Tailwind recipe](#storybook-tailwind-recipe-oss--afenda) subsection above.

### Per-story noir CSS (Presentation Lab login / landings)

Vitest browser (`pnpm test:storybook:run`) **cannot** resolve dynamic `loaders` that `await import()` side-effect CSS modules — use **static imports** instead.

| Pattern | Do | Don't |
| --- | --- | --- |
| Single theme (Swiss or Verdant login) | Dedicated `*-swiss.stories.tsx` / `*-verdant.stories.tsx` with `import "../../docs/*-noir.css"` at file top | `await import("./presentation-lab-login-styles/*-side-effect.js")` in loaders |
| Comparison (both themes) | Separate comparison story file; dual static import only there | Dual CSS in a shared story module used by single-theme stories |
| Stable deprecated story ids | Spread primary story; override `tags: ["skip-test"]` | Inherit `lab-smoke` on deprecated aliases (duplicate CI runs) |
| CSF meta `title` | String literal in each story file (`"Presentation Lab/Auth Login"`) | Imported title constant — Storybook CSF indexer rejects non-literals |

Gate: `pnpm check:storybook-noir-css-imports` (also runs in `check:storybook-primitive-evidence`).

Reference: `packages/shadcn-studio/src/storybook/presentation-lab-login-styles/README.md`

**Primitives:** `base-vega` / Base UI (`@base-ui/react`). Blocks use `render` on triggers — not Radix `asChild`.

---

## 4. Vite aliases (`main.ts`)

Install target cwd is `packages/shadcn-studio`. Storybook resolves block imports via:

| Alias | Target |
| --- | --- |
| `@/` | `packages/shadcn-studio/src` |
| `@afenda/shadcn-studio` | package entry (`src/index.ts`) |
| `@afenda/shadcn-studio/lab` | L4 story parameters (`src/lab/index.ts`) |
| `next/link`, `next/image`, `next/dynamic` | `packages/testing/src/mocks/*` |

**Story parameters:** in-package stories use `./lab/index.js` (or `../lab/index.js` from `storybook/`). `apps/storybook/stories/**` use `@afenda/shadcn-studio/lab`. Never import lab helpers from the main barrel.

After MCP install, run `pnpm storybook generate` then add curated stories if the block needs sample data or dark variants.

---

## 5. MCP block workflow

```text
MCP collect → pnpm studio:shadcn:quarantine (install to components-quarantine/)
  → review + promote → components-layouts/ | components-ui/
  → pnpm storybook generate          # auto-stories + manifest (production paths only)
  → optional curated story in shadcn-studio-blocks.stories.tsx
  → pnpm --filter @afenda/storybook typecheck
  → pnpm test:storybook:run
  → pnpm storybook dev               # visual smoke :6006
```

**Hard stop:** Storybook and ERP import **production** blocks from `@afenda/shadcn-studio` — never from `components-quarantine/`. Promotion checklist: [`components-quarantine/README.md`](../../../packages/shadcn-studio/src/components-quarantine/README.md).

**shadcn-studio MCP** (`/cui`, `/rui`, …): follow `.cursor/rules/shadcn-studio.instructions.mdc` — collect all blocks before install.

**Storybook MCP** (`@storybook/addon-mcp`): dev server exposes `http://127.0.0.1:6006/mcp`. Cursor bridge: [`.cursor/mcp/storybook.mjs`](../../.cursor/mcp/storybook.mjs) (proxies via `mcp-remote`).

**Prerequisite:** start `pnpm storybook dev` before enabling the **storybook** MCP server in Cursor — otherwise catalog tools return 500.

### MCP toolsets (local config — all enabled)

| Toolset | Tools | Afenda use |
| --- | --- | --- |
| **docs** | `list-all-documentation`, `get-documentation`, `get-documentation-for-story` | Prop tables + story IDs before editing primitives/blocks |
| **dev** | `get-storybook-story-instructions`, `preview-stories`, `get-changed-stories` | CSF conventions + visual preview URLs in agent responses |
| **test** | `run-story-tests` | **Prefer `pnpm test:storybook:run`** — MCP Vitest spawn is unreliable on Windows dev |

**Documentation IDs:** colocated primitives use `components-ui-{slug}` (e.g. `components-ui-button`). Stories use kebab IDs like `components-ui-button--primary`. Call `list-all-documentation` with `withStoryIds: true` once per task.

**Agent workflow** ([Storybook MCP overview](https://storybook.js.org/docs/ai/mcp/overview)):

1. Start Storybook → enable **storybook** MCP in Cursor (Settings → MCP)
2. `get-storybook-story-instructions` → CSF 10 patterns for this project
3. `list-all-documentation` / `get-documentation` → never guess props or variants
4. Write or edit stories → `preview-stories` for visual verification URLs
5. Validate with **`pnpm test:storybook:run`** (`lab-smoke` only) — not MCP `run-story-tests` until Vitest bridge is stable

**Catalog scale (typical):** ~323 stories · ~70 colocated primitives · ~73 `lab-smoke` CI subset · ~166 colocated-tagged variants.

**MSW (HTTP mocks):** global handlers in `apps/storybook/.storybook/msw-handlers.ts` (named buckets). Story-level override:

```tsx
parameters: {
  msw: {
    handlers: {
      labProfile: [http.get("/api/...", () => HttpResponse.json({ ... }))],
    },
  },
},
```

**Design links:** `@storybook/addon-designs` — optional env-driven Figma URLs:

```tsx
parameters: {
  ...shadcnStudioFigmaDesignFromEnv("STORYBOOK_FIGMA_LOGIN_PAGE_04"),
},
```

Set URLs in `.env` / `.env.local` (see `.env.example`).

---

## 6. Theme and viewport

Global light/dark toolbar: `apps/storybook/.storybook/preview.tsx` (`globals.theme`).

Per-story dark:

```tsx
export const Dark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
};
```

Preset matrix: **Shadcn Studio/Theme Lab** stories.

Viewports in preview: `mobile` 375×667 · `tablet` 768×1024 · `desktop` 1440×900.

---

## 7. tsconfig.storybook.json

Controls typecheck scope and **react-docgen-typescript** prop tables.

**Include:**

- `.storybook/**`
- `apps/storybook/stories/**`
- `packages/shadcn-studio/src/**` (stories + block sources)
- `packages/testing/src/mocks/**`

**Exclude:** `packages/shadcn-studio/src/**/__tests__/**`, `*.test.ts(x)`

**Paths:** `@/*` → studio src · `@afenda/shadcn-studio` · `@afenda/shadcn-studio/lab` · Next mocks.

---

## 8. Common errors and fixes

### `React is not defined` (addon-a11y)

**Fix:** `preview.tsx` sets `(globalThis as Record<string, unknown>)["React"] = React`. Clear cache:

```powershell
Remove-Item -Recurse -Force node_modules\.cache\storybook -ErrorAction SilentlyContinue
```

`main.ts` must set `optimizeDeps.esbuildOptions.jsx = "automatic"` and include `react`, `react-dom`, `react/jsx-runtime`.

### `next/dynamic` default export error

Mocks live in `packages/testing/src/mocks/next-dynamic.tsx` — aliased in `main.ts` and `tsconfig.storybook.json`.

### Skipping docgen — not in TypeScript project

Add the file's directory to `tsconfig.storybook.json` `include` (both `*.tsx` and `**/*.tsx` for that folder).

### Missing story after MCP install

Run `pnpm storybook generate` — check **Shadcn Studio/Blocks Auto**. Add curated entry to `shadcn-studio-blocks.stories.tsx` when the block needs fixtures.

---

## 9. Acceptance gates

```bash
pnpm storybook generate
pnpm check:storybook-block-coverage
pnpm check:storybook-primitive-evidence   # Gates A+B+C (enforce=gold default)
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/storybook typecheck
pnpm test:storybook:run   # lab-smoke tagged stories only (Vitest browser)
pnpm test:storybook:a11y:run   # a11y-smoke Gold primitives only (Vitest + axe error)
pnpm test:storybook:coverage   # optional — V8 report under apps/storybook/coverage/storybook
pnpm lint
```

**Evidence enforcement:** `STORYBOOK_EVIDENCE_ENFORCE` — `gold` (default, CI), `silver`, `all`, or `none`. Registry SSOT: `packages/shadcn-studio/src/meta-gates/primitive-evidence.registry.ts`.

**Args-first Controls (Step 8):** Gold/Silver non-compound primitives with `click-toggles` or `input-updates` require `meta.argTypes` (from `storybook/colocated-argtypes.ts`) and `fn()` on callback args. Gate A enforces under `enforce=gold`.

**A11y smoke (Step 9):** Gold colocated primitives tag **Primary** with `a11y-smoke` (see `shadcnStudioLabA11ySmokeStoryTags`). Vitest interaction runs keep a11y **off** (`lab-smoke` only); `pnpm test:storybook:a11y:run` uses `vitest.storybook-a11y.config.ts` with axe **error**. Dev Storybook stays `test: "warn"`.

**Chromatic smoke (Step 10):** Snapshots **off globally** (`chromatic.disableSnapshot: true` in preview). Gold **Primary** spreads `shadcnStudioChromaticSmokeParameters` — 21 primitives × 4 modes when `CHROMATIC_ENABLED=true`. Blocks/theme lab stay excluded despite `lab-smoke`.

**Figma design env (Step 11):** Gold **meta** spreads `shadcnStudioPrimitiveFigmaDesignFromEnv("<slug>")` — reads `STORYBOOK_FIGMA_PRIMITIVE_{SLUG}` (no-op when unset; addon-designs panel). Env naming: `shadcnStudioPrimitiveFigmaEnvKey("alert-dialog")` → `STORYBOOK_FIGMA_PRIMITIVE_ALERT_DIALOG`.

**CI:** `.github/workflows/storybook-lab.yml` runs typecheck, evidence gates, static build, `test:storybook:run`, `test:storybook:a11y:run`, and optional Chromatic.

### Testing matrix

| Type | Tool | Scope |
| --- | --- | --- |
| Interaction | `play` + `@storybook/addon-vitest` | Stories tagged `lab-smoke` |
| Accessibility | `@storybook/addon-a11y` | Dev `warn`; Vitest **error** on `a11y-smoke` only |
| Visual | Chromatic (`@chromatic-com/storybook`) | Gold Primary only × 4 modes — `CHROMATIC_ENABLED=true` |
| Coverage | Vitest V8 (`test:storybook:coverage`) | Optional CI — `STORYBOOK_COVERAGE_ENABLED=true` |
| Snapshot | — | Not used in this lab |

**Vitest smoke tag:** Stories tagged `lab-smoke` run in CI browser tests. Gold primitives also carry `a11y-smoke` for the separate a11y Vitest config. Tag curated entry points (welcome, theme lab, hero, login, metadata hydration, colocated primitives). Full catalog stays manual/a11y-warn in dev.

**Storybook 10:** `options.storySort` must be **inline** in `apps/storybook/.storybook/preview.tsx` (not an imported object reference). Keep `shadcnStudioLabStorySort` in `@afenda/shadcn-studio/lab` as documentation mirror only.

**Do not run:** `pnpm ui:guard*` (retired for presentation lane).

After ERP wiring of a promoted block, also run per [shadcn-studio](../shadcn-studio/SKILL.md):

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
```

---

## 10. Static assets, Chromatic, Pages

### staticDirs

| Mount | Source | Use |
| --- | --- | --- |
| `/` | `apps/storybook/public/` | Lab-only fixtures |
| `/studio-assets/` | `packages/shadcn-studio/public/` | Promoted block assets (replace CDN at accept time) |

Regenerate block auto-stories with `pnpm storybook generate` after MCP install.

### Chromatic (optional)

```bash
# Local — requires CHROMATIC_PROJECT_TOKEN in environment
pnpm storybook:chromatic
```

CI: `.github/workflows/storybook-lab.yml` — set repo variable `CHROMATIC_ENABLED=true` and secret `CHROMATIC_PROJECT_TOKEN`.

### GitHub Pages (optional)

Workflow **Storybook Lab** → `workflow_dispatch` → deploys artifact to `gh-pages` path `storybook-lab/`.

### Static build

```bash
pnpm storybook:build   # output: apps/storybook/storybook-static
```

### Docs (Autodocs + Code panel)

- **Autodocs:** global + per-meta `tags: ["autodocs"]`
- **Code panel:** `docs.codePanel: true` in `preview.tsx` (SB 10 replacement for storysource)
- **MDX:** not used — CSF-only lab; long-form docs live in `apps/docs`
- **Prop tables:** `react-docgen-typescript` via `main.ts` `typescript.reactDocgenTypescriptOptions`

---

## Verification

- [ ] Stories under `Shadcn Studio/*` titles
- [ ] `preview.css` matches ERP CSS doctrine
- [ ] Codegen run after new block install (`pnpm storybook generate`)
- [ ] Block + primitive coverage gates pass
- [ ] Gates above pass before claiming done
