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
| `pnpm check:storybook-primitive-coverage` | Colocated primitive story coverage gate |
| `pnpm test:storybook:run` | Vitest browser story tests (`lab-smoke` only) |
| `pnpm test:storybook:coverage` | Interaction tests + V8 coverage report |
| `pnpm --filter @afenda/storybook typecheck` | TS for lab config |

---

## 1. Story file locations

| Story kind | Path |
| --- | --- |
| **Curated blocks** (dark variants, sample data) | `packages/shadcn-studio/src/stories/shadcn-studio-blocks.stories.tsx` |
| **Auto-discovered blocks** (codegen) | `packages/shadcn-studio/src/stories/shadcn-studio-blocks-auto.stories.tsx` |
| **Flat block exports** (codegen) | `packages/shadcn-studio/src/stories/shadcn-studio-blocks-flat.stories.tsx` |
| **SVG / asset gallery** (codegen) | `packages/shadcn-studio/src/stories/shadcn-studio-assets.stories.tsx` |
| **Primitive catalog** (codegen) | `packages/shadcn-studio/src/stories/shadcn-studio-primitives-catalog.stories.tsx` |
| **Colocated primitives** (codegen scaffolds) | `packages/shadcn-studio/src/components/ui/*.stories.tsx` |
| **Primitives showcase** | `packages/shadcn-studio/src/stories/shadcn-studio-primitives.stories.tsx` |
| **Theme lab / presets** | `packages/shadcn-studio/src/stories/shadcn-studio-theme-lab.stories.tsx` |
| **Lab welcome** | `apps/storybook/stories/*.stories.tsx` |

**Discovery globs** (`apps/storybook/.storybook/main.ts`):

```text
../stories/**/*.stories.@(ts|tsx)
../../../packages/shadcn-studio/src/**/*.stories.@(ts|tsx)
```

**Helpers** live in `packages/shadcn-studio/src/_storybook/`:

```text
story-parameters.ts          ← L4 source (re-exported by src/lab/index.ts)
theme.decorator.tsx          ← L4 Storybook theme wrapper (re-exported by lab subpath)
src/lab/index.ts             ← @afenda/shadcn-studio/lab public subpath (re-exports only)
shadcn-studio-theme-lab.compositions.tsx
block-story-manifest.generated.json   ← codegen manifest (do not hand-edit)
```

**Rule:** Keep `*.stories.tsx` thin — render logic in `_storybook/*.compositions.tsx`, data in fixtures when needed.

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
| `packages/shadcn-studio/src/stories/*.stories.tsx` | `./lab/index.js` or `../lab/index.js` from colocated ui |
| `packages/shadcn-studio/src/_storybook/**` | `../lab/index.js` |
| `apps/storybook/stories/**` | `@afenda/shadcn-studio/lab` (Zone C) |

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import MyBlock from "./components/shadcn-studio/blocks/my-block/my-block.js";
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
| `story` | `args`, `render`, `play`, story `parameters`, `globals`, smoke tags |

**Tag policy** (mirror constants in `@afenda/shadcn-studio/lab` — literals required in CSF files):

| Tag | Use |
| --- | --- |
| `autodocs` | Docs page from component props |
| `lab-smoke` | Vitest browser CI (`pnpm test:storybook:run`) |
| `colocated` | Args-first primitive next to source |
| `skip-test` | Exclude from Vitest (reserved) |

**Play (SB 10):** use `canvas` from play args — not `within(canvasElement)`.

```tsx
play: async ({ canvas }) => {
  await expect(canvas.getByRole("button", { name: /submit/i })).toBeVisible();
},
```

**Presentation rules (ADR-0027):** Stock shadcn `className` on studio primitives is **OK** during stabilization. Do **not** apply legacy Governed UI `@afenda/ui` rules in this lab.

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

**Story parameters:** in-package stories use `./lab/index.js` (or `../lab/index.js` from `_storybook/`). `apps/storybook/stories/**` use `@afenda/shadcn-studio/lab`. Never import lab helpers from the main barrel.

After MCP install, run `pnpm storybook generate` then add curated stories if the block needs sample data or dark variants.

---

## 5. MCP block workflow

```text
MCP collect → install once (packages/shadcn-studio cwd)
  → pnpm storybook generate          # auto-stories + manifest
  → optional curated story in shadcn-studio-blocks.stories.tsx
  → pnpm --filter @afenda/storybook typecheck
  → pnpm test:storybook:run
  → pnpm storybook dev               # visual smoke :6006
```

**shadcn-studio MCP** (`/cui`, `/rui`, …): follow `.cursor/rules/shadcn-studio.instructions.mdc` — collect all blocks before install.

**Storybook MCP** (`@storybook/addon-mcp`): dev server exposes `http://127.0.0.1:6006/mcp`. Cursor bridge: [`.cursor/mcp/storybook.mjs`](../../.cursor/mcp/storybook.mjs) (proxies via `mcp-remote`).

**Prerequisite:** start `pnpm storybook dev` before enabling the **storybook** MCP server in Cursor — otherwise catalog tools return 500.

Agent workflow ([Storybook MCP overview](https://storybook.js.org/blog/storybook-mcp-sneak-peek/)):

1. Start Storybook → enable **storybook** MCP in Cursor
2. Agent reads component metadata + story catalog (curated, not raw `node_modules`)
3. Agent writes/updates stories using CSF patterns above
4. Agent runs `pnpm test:storybook:run` — `play` functions on `lab-smoke` stories self-verify interactions

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
pnpm check:storybook-primitive-coverage
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/storybook typecheck
pnpm test:storybook:run   # lab-smoke tagged stories only (Vitest browser)
pnpm test:storybook:coverage   # optional — V8 report under apps/storybook/coverage/storybook
pnpm lint
```

**CI:** `.github/workflows/storybook-lab.yml` runs typecheck, `check:studio-import-zones`, static build, and `test:storybook:run`.

### Testing matrix

| Type | Tool | Scope |
| --- | --- | --- |
| Interaction | `play` + `@storybook/addon-vitest` | Stories tagged `lab-smoke` |
| Accessibility | `@storybook/addon-a11y` | Dev + Chromatic; **off** during Vitest |
| Visual | Chromatic (`@chromatic-com/storybook`) | Optional CI — `CHROMATIC_ENABLED=true` |
| Coverage | Vitest V8 (`test:storybook:coverage`) | Optional CI — `STORYBOOK_COVERAGE_ENABLED=true` |
| Snapshot | — | Not used in this lab |

**Vitest smoke tag:** Stories tagged `lab-smoke` run in CI browser tests. Tag curated entry points (welcome, theme lab, hero, login, metadata hydration, colocated primitives). Full catalog stays manual/a11y-warn in dev.

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
