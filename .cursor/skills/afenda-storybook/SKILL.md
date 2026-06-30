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
| `pnpm storybook generate` | Block manifest + auto-stories |
| `pnpm test:storybook:run` | Vitest browser story tests |
| `pnpm --filter @afenda/storybook typecheck` | TS for lab config |

---

## 1. Story file locations

| Story kind | Path |
| --- | --- |
| **Curated blocks** (dark variants, sample data) | `packages/shadcn-studio/src/shadcn-studio-blocks.stories.tsx` |
| **Auto-discovered blocks** (codegen) | `packages/shadcn-studio/src/shadcn-studio-blocks-auto.stories.tsx` |
| **Primitives showcase** | `packages/shadcn-studio/src/shadcn-studio-primitives.stories.tsx` |
| **Theme lab / presets** | `packages/shadcn-studio/src/shadcn-studio-theme-lab.stories.tsx` |
| **Lab welcome** | `apps/storybook/stories/*.stories.tsx` |

**Discovery globs** (`apps/storybook/.storybook/main.ts`):

```text
../stories/**/*.stories.@(ts|tsx)
../../../packages/shadcn-studio/src/**/*.stories.@(ts|tsx)
```

**Helpers** live in `packages/shadcn-studio/src/_storybook/`:

```text
story-parameters.ts          ← shared layout / a11y / docs snippets
shadcn-studio-theme.decorator.tsx
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

```tsx
import type { Meta, StoryObj } from "@storybook/react";

import MyBlock from "./components/shadcn-studio/blocks/my-block/my-block.js";
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-theme.decorator.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioFullscreenLayout,
  shadcnStudioStoryA11y,
} from "./_storybook/story-parameters.js";

const meta = {
  title: "Shadcn Studio/Blocks",
  component: MyBlock,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    a11y: shadcnStudioStoryA11y,
  },
  decorators: [shadcnStudioThemeDecorator],
} satisfies Meta<typeof MyBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MyBlockLight: Story = {};

export const MyBlockDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
};

export const LoginStyleFullscreen: Story = {
  render: () => <MyBlock />,
  parameters: { ...shadcnStudioFullscreenLayout },
};
```

**Always** `satisfies Meta<typeof Component>` — not `as Meta`.

**Presentation rules (ADR-0027):** Stock shadcn `className` on studio primitives is **OK** during stabilization. Do **not** apply legacy Governed UI `@afenda/ui` rules in this lab.

---

## 3. CSS chain (must mirror ERP)

`apps/storybook/.storybook/preview.css`:

```css
@import "@afenda/shadcn-studio/shadcn-studio.css";
@import "tailwindcss";
@import "shadcn/tailwind.css";
@source "../../../packages/shadcn-studio/src/**/*.{ts,tsx}";
```

Do not import `@afenda/ui`, appshell, or retired design-system CSS.

---

## 4. Vite aliases (`main.ts`)

Install target cwd is `packages/shadcn-studio`. Storybook resolves block imports via:

| Alias | Target |
| --- | --- |
| `@/` | `packages/shadcn-studio/src` |
| `@afenda/shadcn-studio` | package entry |
| `next/link`, `next/image`, `next/dynamic` | `packages/testing/src/mocks/*` |

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

**Storybook MCP** (`@storybook/addon-mcp`): use when server is running for preview URLs and story tests.

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

**Paths:** `@/*` → studio src · `@afenda/shadcn-studio` · Next mocks.

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
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/storybook typecheck
pnpm test:storybook:run
pnpm lint
```

**Do not run:** `pnpm ui:guard*` (retired for presentation lane).

After ERP wiring of a promoted block, also run per [shadcn-studio](../shadcn-studio/SKILL.md):

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
```

---

## Verification

- [ ] Stories under `Shadcn Studio/*` titles
- [ ] `preview.css` matches ERP CSS doctrine
- [ ] Codegen run after new block install
- [ ] Gates above pass before claiming done
