---
name: afenda-storybook
description: Authoritative workflow for writing, fixing, and running Storybook stories in the Afenda ERP monorepo. Covers story file structure, Meta/StoryObj patterns, TIP-004 governed-primitive rules in stories, _storybook/ fixture-composition pattern, tsconfig.storybook.json include rules, common recurring errors with their root causes and fixes, MCP preview workflow, and acceptance gates. Use when writing new stories, debugging Storybook build errors, adding blocks to Storybook, or running story tests.
---

# Afenda Storybook Skill

Stack: Storybook 10 · `@storybook/react-vite` · Vitest addon · `@storybook/addon-a11y` · `@storybook/addon-mcp`  
Run: `pnpm storybook:ui` (from repo root) — served at `http://localhost:6006`  
Test: `pnpm test:storybook`  
MCP preview server: `project-0-afenda-Xerp-storybook`

---

## 1. Story file locations

| Component type | Story file location |
|---|---|
| `@afenda/ui` primitives | `packages/ui/src/components/<component>.stories.tsx` |
| AppShell + dashboard blocks | `packages/appshell/src/<component>.stories.tsx` |
| Metadata-UI renderers | `packages/metadata-ui/src/<component>.stories.tsx` |
| Integration / governance stories | `apps/storybook/stories/<name>.stories.tsx` |

Stories are discovered by `apps/storybook/.storybook/main.ts` via these globs:
```
"../stories/**/*.stories.@(ts|tsx)"
"../../../packages/ui/src/**/*.stories.@(ts|tsx)"
"../../../packages/appshell/src/**/*.stories.@(ts|tsx)"
"../../../packages/metadata-ui/src/**/*.stories.@(ts|tsx)"
```

Fixture and composition helpers live in a `_storybook/` subfolder next to the component:
```
packages/ui/src/components/
  button.stories.tsx
  _storybook/
    button-story.compositions.tsx   ← render helpers that import external deps
    button-story.fixtures.ts        ← plain data: args, labels, constants
    story-frame.tsx                 ← shared StoryFrame / StoryRow / StoryStack layout
```

**Rule**: Keep `*.stories.tsx` thin. Push render logic into `_storybook/*.compositions.tsx` and raw data into `_storybook/*.fixtures.ts`.

---

## 2. Meta + StoryObj template

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./my-component";
import { MY_STORY_DEFAULT_ARGS } from "./_storybook/my-component-story.fixtures";

const meta = {
  title: "Domain/MyComponent",       // ← "Primitives/", "ERP/", "Blocks/"
  component: MyComponent,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",              // "centered" | "fullscreen" | "padded"
    docs: {
      description: {
        component:
          "Short description. Reference TIP if governed primitives are used.",
      },
    },
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  args: MY_STORY_DEFAULT_ARGS,
  argTypes: {
    intent: {
      control: "select",
      options: ["primary", "secondary", "danger"],
      description: "Visual intent.",
    },
  },
} satisfies Meta<typeof MyComponent>;   // ← always `satisfies`, not `as`

export default meta;
type Story = StoryObj<typeof meta>;     // ← type alias

export const Default: Story = {};

export const DarkTheme: Story = {
  globals: { theme: "dark" },
};
```

### Title naming convention

| Prefix | Used for |
|---|---|
| `Primitives/` | `@afenda/ui` governed components |
| `ERP/` | `@afenda/appshell` shell + blocks |
| `Blocks/` | Dashboard shadcn-studio blocks |
| `Metadata/` | `@afenda/metadata-ui` renderers |
| `Governance/` | Authority / recipe audit stories |

---

## 3. TIP-004 governed-primitive rules in stories

Stories are **consumer code** — same rules as `apps/erp`:

- **Zero `className`** on any `@afenda/ui` governed primitive
- Use `intent`, `emphasis`, `size`, `tone` props instead
- Wrap in plain HTML for layout positioning
- Use `mapStockButtonProps` for stock shadcn variant bridges at the call site

```tsx
// ❌ Forbidden in stories
<Button className="gap-2 bg-primary">Save</Button>

// ✅ Correct
<Button intent="primary" emphasis="solid" size="md">Save</Button>

// ✅ Layout wrapper (plain HTML only gets className)
<div className="flex gap-2">
  <Button intent="secondary" size="sm">Cancel</Button>
  <Button intent="primary" size="sm">Save</Button>
</div>
```

Governed tags to never add `className` to: `Button`, `Badge`, `Alert`, `Dialog*`, `Sheet*`, `DropdownMenu*`, `Sidebar*`, `Avatar`, `Tabs*`, `Combobox*`, `InputGroup*`, `Kbd`, `Card*`, `Table*`, `Field*`, `Progress`, `Separator`, `Tooltip`.

After writing a story: `pnpm ui:guard:scan` — must return clean.

---

## 4. Fixtures and compositions

### Fixture file pattern (`*.fixtures.ts`)

Pure data only — no JSX, no imports from `@storybook/react`:

```ts
// _storybook/my-component-story.fixtures.ts
import type { MyComponentProps } from "../my-component";

export const MY_STORY_DEFAULT_ARGS = {
  label: "Submit",
  intent: "primary",
} satisfies Pick<MyComponentProps, "label" | "intent">;

export const MY_STORY_DANGER_ARGS = {
  label: "Delete",
  intent: "danger",
} satisfies Pick<MyComponentProps, "label" | "intent">;
```

### Composition file pattern (`*.compositions.tsx`)

Render functions used in `render:` story fields. Can import external deps (next/link mocks, icons, etc.):

```tsx
// _storybook/my-component-story.compositions.tsx
import type { MyComponentProps } from "../my-component";
import { MyComponent } from "../my-component";
import { SomeIcon } from "lucide-react";

export function renderIconVariantStory(args: MyComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <MyComponent {...args} icon={<SomeIcon className="size-4" />} />
    </div>
  );
}
```

### Story frame helpers (`_storybook/story-frame.tsx`)

Available in `packages/ui/src/components/_storybook/story-frame.tsx` — use for organized primitive showcases:

```tsx
import {
  StoryCaption,
  StoryFrame,
  StoryRow,
  StoryStack,
} from "./_storybook/story-frame";

// Renders a labeled grid of variants
<StoryFrame>
  <StoryRow label="Default">
    <MyComponent intent="primary" />
    <MyComponent intent="secondary" />
  </StoryRow>
  <StoryStack label="Sizes">
    <MyComponent size="sm" />
    <MyComponent size="md" />
    <MyComponent size="lg" />
  </StoryStack>
  <StoryCaption>All button intents × emphases matrix</StoryCaption>
</StoryFrame>
```

---

## 5. Shell stories (`parameters.layout: "fullscreen"`)

ApplicationShell stories **must** use `layout: "fullscreen"`. The `themeDecorator` in `preview.tsx` wraps with `min-h-svh` for fullscreen, `p-4` otherwise.

```tsx
const meta = {
  title: "ERP/ApplicationShell",
  component: ApplicationShell,
  parameters: {
    layout: "fullscreen",   // ← required for shell chrome
  },
} satisfies Meta<typeof ApplicationShell>;
```

Dashboard block stories also use `layout: "fullscreen"` when they render inside the shell.

---

## 6. Governed-components traceability export

In stories that reference governed primitives in compositions, export a `StoriesGovernedComponents` type for TIP-004 traceability:

```tsx
import type { GovernedUiComponentName } from "@afenda/ui/governance";

/** Governed primitives referenced in this story's compositions (TIP-004 traceability). */
export type MyComponentStoriesGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Button"
>;
```

---

## 7. Theme and viewport globals

Theme toolbar is wired in `preview.tsx` — use in stories:

```tsx
export const DarkTheme: Story = {
  globals: { theme: "dark" },
  parameters: {
    docs: { description: { story: "Dark design tokens." } },
  },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};

export const Tablet: Story = {
  parameters: { viewport: { defaultViewport: "tablet" } },
};

export const Desktop: Story = {
  parameters: { viewport: { defaultViewport: "desktop" } },
};
```

Viewport definitions: `mobile` 375×667, `tablet` 768×1024, `desktop` 1440×900.

---

## 8. a11y parameters

The a11y addon runs `color-contrast` and `label` checks by default. Override per story only when needed:

```tsx
parameters: {
  a11y: {
    config: {
      rules: [
        { id: "color-contrast", enabled: true },
        { id: "aria-required-children", enabled: false },  // override if composing icons manually
      ],
    },
  },
},
```

---

## 9. Common recurring errors and fixes

### Error 1: `Multiple exports with the same name "APPSHELL_*"` (fatal)

```
■  Vite Pre-transform error: Transform failed with 5 errors:
   packages/appshell/src/index.ts:60:2: ERROR: Multiple exports with the same name
   "APPSHELL_APPROVED_RUNTIME_DEPENDENCIES"
```

**Root cause**: The 5 `APPSHELL_*` constants (`APPSHELL_APPROVED_RUNTIME_DEPENDENCIES`, `APPSHELL_CONTEXT_CONSUMPTION_MODULES`, `APPSHELL_CONTEXT_SURFACE_RULE`, `APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES`, `APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS`) are defined in `contracts/context.contract.ts` and exported via `contracts/index.ts` in the main barrel. Any new file in `context/` that also re-exports those same value constants causes esbuild to detect the duplicate during Vite's transform phase.

**Fix**:
1. Check `packages/appshell/src/context/index.ts` — it must export only `type` re-exports (erased at runtime). Remove any `export { APPSHELL_* }` value constants.
2. Those 5 constants route through `contracts/index.ts` only.
3. Restart Storybook: `pnpm storybook:ui` (Vite clears its transform cache on restart).

```ts
// ✅ context/index.ts — only type exports allowed
export type {
  ApplicationShellIdentity,
  ApplicationShellOperatingContext,
  AppShellContextSwitchSelection,
} from "../contracts/context.contract.js";
export type { SerializableDashboardWidgetRenderContext } from "../dashboard/dashboard-widget-render-context.js";

// ❌ Do NOT re-export value constants that are already in contracts/index.ts
// export { APPSHELL_APPROVED_RUNTIME_DEPENDENCIES, ... } ← this causes the duplicate
```

---

### Warning 2: `Skipping docgen for "…" because it is not included in the active TypeScript project`

```
▲  Vite warning: Skipping docgen for
   "packages/appshell/src/shadcn-studio/blocks/app-shell-dashboard-kpi-stat.tsx"
   because it is not included in the active TypeScript project.
   Plugin: vite:react-docgen-typescript
```

**Root cause**: `apps/storybook/tsconfig.storybook.json` `include` array does not cover all source files that Storybook loads. The `vite:react-docgen-typescript` plugin needs every file inside the active TS project to generate prop tables.

**Fix**: Add BOTH the single-star (`*.tsx`) AND double-star (`**/*.tsx`) variants for every directory in `apps/storybook/tsconfig.storybook.json`.

> **Critical**: TypeScript's glob `**/*.tsx` in `include` does NOT reliably match files directly inside a directory (zero subdirectories). You MUST also include `*.tsx` (single star) for the root of each directory to guarantee direct-child files are picked up by the docgen TypeScript program.

```json
{
  "include": [
    ".storybook/*.ts",
    ".storybook/*.tsx",
    ".storybook/**/*.ts",
    ".storybook/**/*.tsx",
    "../../packages/ui/src/components/*.tsx",
    "../../packages/ui/src/components/**/*.tsx",
    "../../packages/ui/src/governance/*.ts",
    "../../packages/ui/src/governance/**/*.ts",
    "../../packages/appshell/src/**/*.stories.tsx",
    "../../packages/appshell/src/_storybook/*.tsx",
    "../../packages/appshell/src/_storybook/**/*.tsx",
    "../../packages/appshell/src/shadcn-studio/blocks/*.tsx",
    "../../packages/appshell/src/shadcn-studio/blocks/**/*.tsx",
    "../../packages/metadata-ui/src/*.ts",
    "../../packages/metadata-ui/src/*.tsx",
    "../../packages/metadata-ui/src/**/*.ts",
    "../../packages/metadata-ui/src/**/*.tsx"
  ]
}
```

When adding a new component directory, always add BOTH `<dir>/*.tsx` and `<dir>/**/*.tsx`.

---

### Error 3: `Cannot find module '@afenda/appshell'` or alias resolution failure

**Root cause**: The `viteConfig.resolve.alias` in `main.ts` must list `@afenda/appshell` alias BEFORE `@afenda/ui`. Alias order matters in Vite — first match wins.

**Fix**: In `apps/storybook/.storybook/main.ts` `viteFinal`, aliases are in this mandatory order:
1. CSS sub-paths (`/afenda-ui.css`, `/afenda-appshell.css`, etc.)
2. Sub-paths (`@afenda/ui/governance/*`, `@afenda/ui/lib/*`)
3. Root packages (`@afenda/ui`, `@afenda/appshell`, `@afenda/metadata-ui`, `@afenda/metadata`)
4. Mocks (`next/link`, `next/image`)

Never reorder. The `@afenda/appshell` alias points to `packages/appshell/src/index.ts`.

---

### Error 4: `@afenda/appshell` HMR loop or "Failed to resolve import"

**Root cause**: `@afenda/appshell` is in `optimizeDeps.exclude`. If a new block imports something NOT in that exclude list, Vite may try to pre-bundle part of appshell, causing a loop.

**Fix**: If a block uses a heavy third-party dep, add it to `optimizeDeps.include`:
```ts
viteConfig.optimizeDeps.include = [
  "@afenda/design-system",
  "your-new-dep",   // add here
];
```

---

### Error 6: `does not provide an export named 'default'` for `next/dynamic`

```
SyntaxError: The requested module '/@fs/.../next/dynamic.js?v=...'
does not provide an export named 'default'
```

**Root cause**: A component uses `import dynamic from "next/dynamic"` (e.g., `recharts-lazy.client.tsx` uses it for lazy recharts loading). Storybook doesn't have a mock for `next/dynamic`, so Vite falls back to the real Next.js module which uses a CommonJS export that isn't compatible with Vite's ESM handling.

**Fix**: Three-part fix:

1. **Create the mock** at `packages/testing/src/mocks/next-dynamic.tsx`:

```tsx
import React from "react";

type Loader<P> = () => Promise<React.ComponentType<P> | { default: React.ComponentType<P> }>;
interface DynamicOptions<P> {
  loading?: React.ComponentType;
  ssr?: boolean;
  loader?: Loader<P>;
}

export default function dynamic<P extends Record<string, unknown>>(
  loaderOrOptions: Loader<P> | DynamicOptions<P>,
  options?: DynamicOptions<P>
): React.ComponentType<P> {
  const loader: Loader<P> = typeof loaderOrOptions === "function"
    ? loaderOrOptions
    : (loaderOrOptions.loader ?? (() => Promise.resolve({ default: () => null })));
  const opts = typeof loaderOrOptions === "function" ? (options ?? {}) : loaderOrOptions;
  const LazyComponent = React.lazy(async () => {
    const mod = await loader();
    return "default" in mod && mod.default ? { default: mod.default } : { default: mod as React.ComponentType<P> };
  });
  function DynamicMock(props: P) {
    const Loading = opts.loading;
    return <React.Suspense fallback={Loading ? <Loading /> : null}><LazyComponent {...props} /></React.Suspense>;
  }
  DynamicMock.displayName = "DynamicMock";
  return DynamicMock as React.ComponentType<P>;
}
```

2. **Add alias in `apps/storybook/.storybook/main.ts`**:

```ts
const nextDynamicMock = join(testingRoot, "src/mocks/next-dynamic.tsx");

// In storybookAliases:
{ find: "next/dynamic", replacement: nextDynamicMock },

// In optimizeDeps.exclude:
"next/dynamic",

// In optimizeDeps.esbuildOptions.alias:
"next/dynamic": nextDynamicMock,
```

3. **Add tsconfig paths entry** in `apps/storybook/tsconfig.storybook.json`:

```json
"next/dynamic": ["../../packages/testing/src/mocks/next-dynamic.tsx"]
```

---

### Error 7: `Error: React is not defined` in `withVisionSimulator` or Storybook internal chunks

```
Error: React is not defined
  at hookified (node_modules/.cache/storybook/.../storybook_internal_preview_runtime.js)
  at withVisionSimulator (@storybook/addon-a11y chunk-SL4FEFXY.js)
  at @storybook/react chunk-3HUEQMBJ.js
```

**Root cause**: `@storybook/addon-a11y`'s `withVisionSimulator` decorator (and other Storybook internal addons) are shipped as compiled JS using the **classic JSX runtime** — they call `React.createElement(...)` directly and expect `React` to be in scope. Vite's dep pre-bundler (`storybook_internal_preview_runtime.js`) does not guarantee `React` is importable by these chunks when the host project uses the automatic JSX transform (`"jsx": "react-jsx"`).

Two compounding causes:
1. Stale Storybook pre-bundled dep cache (`.cache/storybook/`) was built before the current esbuild JSX settings were applied.
2. `optimizeDeps.esbuildOptions` was not explicitly set to `jsx: "automatic"`, so esbuild defaults varied between Storybook version bumps.

**Fix**: Three-part — clears cache, pins esbuild JSX, exposes React globally.

**Part 1 — Clear the stale Storybook cache** (PowerShell):
```powershell
Remove-Item -Recurse -Force node_modules\.cache\storybook -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps\storybook\node_modules\.cache -ErrorAction SilentlyContinue
```

**Part 2 — `apps/storybook/.storybook/preview.tsx`** — expose React as a global:
```tsx
import React from "react";
// ...other imports...

// Expose React globally so Storybook addons pre-bundled with the classic JSX
// runtime (e.g. @storybook/addon-a11y withVisionSimulator) can find React even
// when they don't import it explicitly.
(globalThis as Record<string, unknown>)["React"] = React;
```

**Part 3 — `apps/storybook/.storybook/main.ts` `viteFinal`** — pin automatic JSX and pre-bundle React:
```ts
// Force automatic JSX on the dep pre-bundling phase (fixes addon-a11y chunks)
viteConfig.optimizeDeps.esbuildOptions ??= {};
viteConfig.optimizeDeps.esbuildOptions.jsx = "automatic";
viteConfig.optimizeDeps.esbuildOptions.jsxImportSource = "react";

// Ensure react runtime is always pre-bundled (not left to auto-detection)
viteConfig.optimizeDeps.include = [
  ...(viteConfig.optimizeDeps.include ?? []).filter(/* ... */),
  "@afenda/design-system",
  "react",
  "react-dom",
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
];
```

After all three parts: restart Storybook with `pnpm storybook:ui`.

---

### Error 5: `TypeError: Cannot read properties of undefined (reading 'xxx')` in story render

**Root cause**: Story `args` object is missing a required prop, or a composition function expects a specific args shape that the meta's `args` doesn't satisfy.

**Fix**: Use `satisfies` type constraint on args objects in fixtures:
```ts
export const MY_ARGS = {
  brandName: "Afenda",
} satisfies Pick<MyComponentProps, "brandName">;
```

---

---

## 10. tsconfig.storybook.json rules

`apps/storybook/tsconfig.storybook.json` controls which files get TypeScript checks AND which files get docgen prop tables.

> **Critical glob rule**: TypeScript's `**/*.tsx` in `include` does NOT reliably match files directly inside a directory. Always add BOTH `<dir>/*.tsx` (direct children) AND `<dir>/**/*.tsx` (nested) for each directory.

**Must include (both `*.tsx` and `**/*.tsx` per directory):**
- `.storybook/*.tsx` + `.storybook/**/*.tsx` — Storybook config + preview
- `stories/**/*.tsx` — integration stories
- `packages/ui/src/components/*.tsx` + `components/**/*.tsx` — ALL ui component source for docgen
- `packages/ui/src/governance/*.ts` + `governance/**/*.ts` — governance helpers
- `packages/appshell/src/**/*.stories.tsx` — appshell story files
- `packages/appshell/src/_storybook/*.tsx` + `_storybook/**/*.tsx` — appshell story helpers
- `packages/appshell/src/shadcn-studio/blocks/*.tsx` + `blocks/**/*.tsx` — shadcn-studio blocks
- `packages/metadata-ui/src/*.ts` + `src/**/*.ts` — full metadata-ui source
- `packages/metadata-ui/src/*.tsx` + `src/**/*.tsx`

**Must NOT include (excluded):**
- `packages/appshell/src/**/__tests__/**` — unit tests
- `packages/ui/src/components/shadcn-studio/**` — raw shadcn-studio install leftovers (not governed yet)
- `packages/ui/src/**/*.stories.tsx` — ui stories go through a different tsconfig path

**Add new blocks**: When a shadcn-studio block is installed in `packages/appshell/src/shadcn-studio/blocks/`, it's covered by the existing `blocks/*.tsx` + `blocks/**/*.tsx` patterns.

---

## 11. MCP preview workflow

Use the `project-0-afenda-Xerp-storybook` MCP server for visual verification:

1. `get-storybook-story-instructions` — read before writing any story
2. `preview-stories` — call after each component or story change; include the returned preview URLs in responses
3. `run-story-tests` — validate after changes; fix failing tests before reporting success
4. `list-all-documentation` (with `withStoryIds: true`) — discover component IDs
5. `get-documentation` — retrieve full props, usage examples, story variants for a component

---

## 12. Acceptance gates before merging stories

```bash
# 1. No className on governed primitives
pnpm ui:guard:scan

# 2. Story tests pass
pnpm test:storybook

# 3. TypeScript clean (scope to changed package)
pnpm --filter @afenda/ui typecheck           # if packages/ui stories changed
pnpm --filter @afenda/appshell typecheck     # if appshell stories changed

# 4. Biome format + lint
pnpm lint
pnpm format
```

All gates must pass. Do not report stories done while `run-story-tests` is failing.
