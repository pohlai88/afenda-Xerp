---
name: afenda-storybook-agentic-setup
description: Executes Storybook 10.4 agentic setup for Afenda PAS-006 lab on @storybook/react-vite — preview hardening, MSW, portal roots, ≤10 pilot stories with ai-generated tags, and Vitest lab-smoke verification. Use when rebuilding Storybook for AI agents, closing agentic setup gaps, or authoring fresh pilot catalogs after a lab reset.
---

# Afenda Storybook Agentic Setup

**Authority:** [PAS-006](../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · [ADR-0027](../../docs/adr/ADR-0027-frontend-presentation-reset.md) · companion: [afenda-storybook](../afenda-storybook/SKILL.md)

**Builder:** `@storybook/react-vite` only — SB 10.4 agentic setup does **not** support `@storybook/nextjs-vite`. ERP App Router verification stays on `apps/erp` (`:3000`).

## When to use

- Storybook lab reset → fresh agentic pilot catalog
- Closing gaps vs [Storybook 10.4 agentic setup](https://storybook.js.org/docs/writing-stories/agentic-setup)
- AI-authored CSF batches (≤10 components per batch)

**Not for:** editorial noir login lab → [afenda-editorial-bundle](../afenda-editorial-bundle/SKILL.md) · ERP `/sign-in` promotion → [afenda-presentation-promotion](../afenda-presentation-promotion/SKILL.md)

## Bundles

1. `coding-consistency-bundle` (mandatory)
2. `afenda-presentation-quality` + `afenda-storybook` (non-editorial)

## Agentic loop (9 steps)

| Step | Afenda action |
| --- | --- |
| 1. Analyze | Read `@afenda/shadcn-studio` component + `apps/storybook/.storybook/preview.tsx` |
| 2. Preview | Portal decorator, theme decorator, global `loaders: [mswLoader]`, MSW `parameters.msw`, `sb.mock(next/navigation)` |
| 3. Portals | `#storybook-portal-root` in preview decorator + z-index in `preview.css` |
| 4. Mocks | Vite aliases (`next/*`) + MSW handlers in `msw-handlers.ts` |
| 5. Stories | ≤10 files in `packages/shadcn-studio/src/storybook/agentic/` |
| 6. Play | `play` with `canvas` from args; portal overlays → `within(canvasElement.ownerDocument.body)` |
| 7. Tags | Meta literals `["autodocs", "ai-generated"]`; story with `play`: `["lab-smoke"]` |
| 8. Verify | `pnpm --filter @afenda/storybook typecheck` · `storybook:build` · `pnpm test:storybook:run` |
| 9. MCP | Dev `:6006` → `preview-stories` URLs in completion report |

## Documenting components (SB 10.4)

**Addon:** [`@storybook/addon-docs`](https://storybook.js.org/addons/@storybook/addon-docs) · Autodocs guide: [writing-docs/autodocs](https://storybook.js.org/docs/writing-docs/autodocs)

Per [How to document components](https://storybook.js.org/docs/writing-docs) — **Autodocs from CSF only** in the agentic pilot (no MDX).

| `@storybook/addon-docs` / Autodocs requirement | Afenda lab |
| --- | --- |
| Package installed (`@storybook/addon-docs@10.4.x`) | `apps/storybook/package.json` — pinned with Storybook 10.4.6 |
| Listed in `main.ts` `addons` | ✅ `@storybook/addon-docs` (after Chromatic, before designs/a11y/MCP) |
| Autodocs via `tags: ['autodocs']` | Global in `preview.tsx` + per-meta on agentic CSF |
| `docs.defaultName` in `main.ts` | ✅ `"Documentation"` (not default `"Docs"`) |
| `docs.docsMode` | ❌ not enabled — Canvas + Docs tabs both visible (lab default) |
| Prop tables | `react-docgen-typescript` + `tsconfig.storybook.json` (not default `react-docgen`) |
| Doc Blocks Vite alias | `@storybook/addon-docs/blocks` → `dist/blocks.js` in `viteFinal` |
| Code panel | `parameters.docs.codePanel: true` in `preview.tsx` (SB 10 storysource replacement) |
| TOC + source in docs | `shadcnStudioLabDocsParameters` — `toc: true`, source open |
| Component prose | Spread `agenticCenteredMetaParameters` or `agenticFullscreenMetaParameters` from `agentic-story-parameters.ts` |
| MCP docs toolset | `@storybook/addon-mcp` with `toolsets.docs: true` — `list-all-documentation`, `get-documentation` |
| MDX / custom Doc Block template | **Deferred** — long-form PAS docs live in `apps/docs` |

**Meta requirements for Autodocs:**

- Set `component` on `meta` (primitive or composition wrapper).
- Use `satisfies Meta<typeof Component>` — not `as Meta`.
- Import shared parameters: `import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js"`.

**After human review:** remove `ai-generated` tag; optionally add `parameters.docs.description.component` per primitive.

## Args (SB 10.4)

Guide: [writing-stories/args](https://storybook.js.org/docs/writing-stories/args)

| Args requirement | Afenda agentic pilot |
| --- | --- |
| Story-level `args` on direct primitive stories | ✅ Button, Input, Checkbox — props + `fn()` on callbacks |
| Component-level `argTypes` (Controls) | ✅ Gold primitives import from `colocated-argtypes.ts` |
| Args composition (`...Primary.args`) | ✅ Button `Outline` spreads `Primary.args` |
| Global args for theme | ❌ use **`globals`** via `shadcnStudioLabInitialGlobals` in `preview.tsx` (toolbar) |
| `render` for composite / slot children | ✅ Dialog, Field, Card, NativeSelect, LoginPage04 — not args-first |
| `useArgs` for controlled state in story | **Deferred** — pilot uses uncontrolled + `play`; add when Controls-driven checkbox needed |
| URL `?args=` overrides | Supported by Storybook; no lab-specific wiring |
| Complex arg `mapping` in `argTypes` | **Deferred** — no JSX-in-args stories in pilot |

**Direct primitive pattern:**

```tsx
import { buttonStoryArgTypes } from "../colocated-argtypes.js";

const meta = {
  component: Button,
  argTypes: buttonStoryArgTypes,
} satisfies Meta<typeof Button>;

export const Primary: Story = {
  args: { children: "Continue", onClick: fn() },
};
```

**Composition stories:** keep `meta.component` as the wrapper; use `render` when children/slots cannot be JSON-serializable args.

## Parameters (SB 10.4)

Guide: [writing-stories/parameters](https://storybook.js.org/docs/writing-stories/parameters) · API: [api/parameters](https://storybook.js.org/docs/api/parameters)

**Inheritance:** global (`preview.tsx`) → component (`meta.parameters`) → story (`Story.parameters`). Keys **merge**; more specific levels override sub-keys only (never drop sibling keys).

| Parameters requirement | Afenda agentic pilot |
| --- | --- |
| Global parameters in `preview.tsx` | ✅ `shadcnStudioLabPreviewParameters` — controls, layout, backgrounds (disabled), a11y, docs, viewport |
| Global addon config | ✅ `docs.codePanel`, `msw.handlers`, `chromatic.modes`, `options.storySort` |
| Vitest parameter overrides | ✅ preview merges `a11y.test: "off"` (smoke) or `"error"` (a11y run) |
| Component-level parameters | ✅ `agenticCenteredMetaParameters` / `agenticFullscreenMetaParameters` on every agentic meta |
| Story-level parameters | ✅ Button `Outline` — `docs.description.story` merged with meta docs |
| Theme via parameters | ❌ use **`globalTypes` / `initialGlobals.theme`** (toolbar), not `parameters.backgrounds` |
| Backgrounds addon | Disabled globally — lab uses theme decorator + CSS tokens |

**Component-level pattern:**

```tsx
import {
  agenticCenteredMetaParameters,
  agenticFullscreenMetaParameters,
} from "./agentic-story-parameters.js";

const meta = {
  component: Button,
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof Button>;
```

**Story override pattern:**

```tsx
export const Outline: Story = {
  parameters: {
    docs: { description: { story: "Story-level docs — merges with meta." } },
  },
};
```

Global preview lives in `apps/storybook/.storybook/preview.tsx`; shared lab keys in `packages/shadcn-studio/src/storybook/story-parameters.ts`.

## Loaders (SB 10.4)

Guide: [writing-stories/loaders](https://storybook.js.org/docs/writing-stories/loaders)

SB treats loaders as an **escape hatch** — prefer **[args](https://storybook.js.org/docs/writing-stories/args)** for story data. Loaders run in **parallel** before render; results merge into render context `loaded` (later levels override overlapping keys: global → meta → story).

| Loaders requirement | Afenda agentic pilot |
| --- | --- |
| Global loaders in `preview.tsx` | ✅ `loaders: [mswLoader]` — MSW init before every story (dev + Vitest) |
| Mock HTTP data | ✅ `parameters.msw.handlers` in preview (`msw-handlers.ts`) — **not** fetch-in-loader |
| Story data / props | ✅ **`args`** on Button, Input, Checkbox; inline fixtures in `render` compositions |
| Story-level `loaders` + `render(_, { loaded })` | ❌ **Not used** — no remote prefetch in agentic pilot |
| Component-level loaders | ❌ None on agentic metas |
| Loader + args priority | N/A today — if added later, spread **args first** so Controls override loader defaults |

**When to add a story loader (rare):** lazy dynamic import too heavy for CSF, or one-off async asset that cannot be `args` or MSW. Otherwise use args or `parameters.msw.handlers` story overrides.

**MSW pattern (global loader + parameters):**

```tsx
// preview.tsx — global
loaders: [mswLoader],
parameters: { msw: { handlers: mswHandlers } },

// Optional story override — parameters merge, not loaders
export const WithCustomMock: Story = {
  parameters: {
    msw: { handlers: { authSession: [/* … */] } },
  },
};
```

Do **not** duplicate MSW setup in meta/story `loaders` — one global `mswLoader` is sufficient.

## Tags (SB 10.4)

Guide: [writing-stories/tags](https://storybook.js.org/docs/writing-stories/tags)

**Inheritance:** preview → meta → story. Tags **accumulate** unless removed with `!tag`. Built-in `dev`, `manifest`, and `test` apply implicitly to every story.

| Tags requirement | Afenda agentic pilot |
| --- | --- |
| Global `tags: ['autodocs']` | ✅ `preview.tsx` — docs pages for all stories |
| Built-in `dev` / `test` / `manifest` | ✅ implicit — sidebar + Vitest eligibility |
| Built-in `play-fn` | ✅ auto on stories with `play` |
| Meta custom tags | ✅ literals `["autodocs", "ai-generated"]` on meta (mirror: `agenticPilotMetaTags`) |
| Story `lab-smoke` | ✅ literal `["lab-smoke"]` on stories **with `play`** only |
| Variant without CI | ✅ Button `Outline` — no `lab-smoke` (args/docs variant, no `play`) |
| Remove inherited tag | Use `!tag` prefix when needed — e.g. `['!test']` on combo grids (deferred) |
| Custom tag in `main.ts` | ✅ `ai-generated` → `defaultFilterSelection: 'exclude'` (sidebar filter) |
| Vitest subset | ✅ `vitest.storybook.config.ts` → `include: ['lab-smoke']`, `exclude: ['skip-test']` |
| A11y Vitest subset | ✅ `vitest.storybook-a11y.config.ts` → `include: ['a11y-smoke']` (gold tier, not pilot) |
| Docs-only stories | **Deferred** — `['autodocs', '!dev']` when example grids land |
| CSF Next `_test` tag | ❌ CSF 3 only in this lab |

**Meta pattern** (tags must be **string literals** in CSF — same rule as `title`; constants in `agentic-story-parameters.ts` are mirror-only):

```tsx
const meta = {
  tags: ["autodocs", "ai-generated"],
} satisfies Meta<typeof Button>;

export const Primary: Story = {
  tags: ["lab-smoke"],
  play: async ({ canvas }) => { /* … */ },
};
```

**After human review:** remove `ai-generated` from `agenticPilotMetaTags` and drop `main.ts` filter entry if no longer needed.

## Story location + globs

`apps/storybook/.storybook/main.ts`:

```ts
stories: [
  "../stories/**/*.stories.@(ts|tsx)",
  "../../../packages/shadcn-studio/src/storybook/agentic/**/*.stories.@(ts|tsx)",
],
```

Title prefix: `Agentic/{Component}`.

Import lab helpers from `../../lab/index.js` (in-package). Never import lab from main barrel.

## Tag policy (summary)

See **Tags (SB 10.4)** above. Quick reference:

| Tag | Level | Purpose |
| --- | --- | --- |
| `autodocs` | preview + meta | Docs page generation |
| `ai-generated` | meta | Agentic batch marker — remove after review; excluded in sidebar filter by default |
| `lab-smoke` | story (with `play`) | Vitest browser CI inclusion |
| `a11y-smoke` | story (gold) | Separate a11y Vitest config — not on agentic pilot |
| `skip-test` | story | Opt out of Vitest when needed |
| `play-fn` | auto | Applied by Storybook when `play` is defined |

## Pilot interim CI

While catalog is agentic-only, disable in `.github/workflows/storybook-lab.yml`:

- `pnpm storybook:generate`
- `pnpm check:storybook-block-coverage`
- `pnpm check:storybook-primitive-evidence`

Re-enable incrementally in Phase 5 (post-review).

## Hard stops

- Do not migrate lab to `@storybook/nextjs-vite` for agentic work
- Do not import from `components-quarantine/`
- Do not restore 90+ codegen colocated stories without explicit request
- Do not wire editorial noir CSS in stock pilot
- Prefer `pnpm test:storybook:run` over MCP `run-story-tests` (Windows)

## Verification

```bash
pnpm --filter @afenda/storybook typecheck
pnpm --filter @afenda/storybook storybook:build
pnpm test:storybook:run
```

Remove `passWithNoTests: true` from `vitest.storybook.config.ts` once `lab-smoke` stories exist.
