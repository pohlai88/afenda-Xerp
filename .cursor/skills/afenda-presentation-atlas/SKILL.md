---
name: afenda-presentation-atlas
description: >-
  Design system atlas for @afenda/shadcn-studio (PAS-006 / ADR-0027). Read-only
  inventory — 69 primitives, 41 blocks, barrel exports, Storybook sidebar map,
  CSS chain, gates, skill routing. Invoke /afenda-presentation-atlas when asking
  what components exist, how to import from @afenda/shadcn-studio, which block
  matches a UI need, or where ERP presentation truth lives. Does not replace
  shadcn-studio (install), afenda-tailwind (CSS), or afenda-presentation-quality
  (merge gates).
paths:
  - packages/shadcn-studio/**
  - apps/storybook/**
  - apps/erp/src/app/globals.css
disable-model-invocation: true
---

# Afenda Presentation Atlas

**Invoke:** `/afenda-presentation-atlas`

**Package:** `@afenda/shadcn-studio` · **Standard:** [PAS-006](../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · **Reset:** [ADR-0027](../../docs/adr/ADR-0027-frontend-presentation-reset.md)

---

## What this skill is

| | **Atlas (this skill)** | **Sibling workflows** |
| --- | --- | --- |
| Job | Answer *what exists* and *where it lives* | Answer *how to change it* |
| Examples | “Do we have `DataTable`?” · “Import for login block?” | MCP install · edit `globals.css` · run gates |
| Edit code? | **No** — read-only catalog | **Yes** — see table below |

**Not the design system:** retired `@afenda/ui`, PAS-005, `pnpm ui:guard*`, governed-ui strip pipeline.

---

## Presentation lane — read order

```
1. afenda-presentation-atlas     ← inventory (this skill)
2. afenda-presentation-quality   ← composer when editing ERP UI
3. shadcn-studio | afenda-tailwind | afenda-storybook   ← task-specific depth
```

| You need | Read | Then (if editing) |
| --- | --- | --- |
| Component / block list | [primitives-catalog.md](./reference/primitives-catalog.md) · [blocks-inventory.md](./reference/blocks-inventory.md) | — |
| Import / public API | [public-api-surfaces.md](./reference/public-api-surfaces.md) · [ARCHITECTURE.md](../../../packages/shadcn-studio/ARCHITECTURE.md) | — |
| Storybook story location | §Storybook sidebar | [`afenda-storybook`](../afenda-storybook/SKILL.md) |
| MCP block install | — | [`shadcn-studio`](../shadcn-studio/SKILL.md) |
| `globals.css` / tokens / Tailwind | §CSS chain | [`afenda-tailwind`](../afenda-tailwind/SKILL.md) |
| Pre-merge gate bundle | §Gates | [`afenda-presentation-quality`](../afenda-presentation-quality/SKILL.md) |
| Generic shadcn/Tailwind API | [external-docs.md](./reference/external-docs.md) | Context7 MCP |

---

## Sibling skills (no overlap)

| Skill | Role | Use for |
| --- | --- | --- |
| **`afenda-presentation-atlas`** | Catalog | Primitives, blocks, exports, Storybook map, retired boundary |
| **`shadcn-studio`** | MCP authority | CLI/MCP install, markers, credentials, post-install |
| **`afenda-tailwind`** | CSS authority | Import-only globals, v3 banlist, theme file location |
| **`afenda-presentation-quality`** | Composer | Ordered child reads + merged gates before merge |
| **`afenda-storybook`** | Lab workflow | Story patterns, codegen, Vite/tsconfig, a11y tests |

**Retired:** `.cursor/skills/_retired/legacy-ui/` — do not route ERP work there.

---

## Package surface

| Surface | Path |
| --- | --- |
| npm package | `@afenda/shadcn-studio` |
| Primitives (**70**) | `packages/shadcn-studio/src/components-ui/` |
| Blocks (**41** files) | `packages/shadcn-studio/src/components-layouts/` |
| Internal L2 helpers | `src/lib/` · `src/hooks/` — not barrel-exported ([public-api-surfaces.md](./reference/public-api-surfaces.md)) |
| Public barrel | `packages/shadcn-studio/src/index.ts` |
| Theme CSS (author) | `packages/shadcn-studio/src/styles/shadcn-studio.css` |
| Theme CSS (apps) | `@afenda/shadcn-studio/shadcn-studio.css` |
| Registries / contracts | `packages/shadcn-studio/src/meta-registry/` · `meta-contracts/` · `meta-gates/` |
| Block manifest | `packages/shadcn-studio/src/storybook/block-story-manifest.generated.json` |
| shadcn CLI cwd | **`packages/shadcn-studio`** (`base-vega`, Base UI) |
| ERP CSS entry | `apps/erp/src/app/globals.css` |
| Storybook lab | `http://localhost:6006` |

**Docs:** [North Star](../../docs/NORTHSTAR/shadcn-studio-presentation-north-star.md)

---

## Import patterns (ERP)

```tsx
import { Button, Card, CardHeader, CardTitle } from "@afenda/shadcn-studio";
import { StatisticsCard01Block, LoginPage04Block } from "@afenda/shadcn-studio";
```

**Barrel today:** `Button` + `Card` family + **36 block exports** + registries/theme — [public-api-surfaces.md](./reference/public-api-surfaces.md).

**Gap:** primitive on disk but not in barrel → extend `index.ts` before ERP import.

---

## Primitives (summary)

**70** in `components-ui/`. Full grouped list: [primitives-catalog.md](./reference/primitives-catalog.md).

Actions · Forms · Overlays · Navigation · Data display · Feedback · Layout · Studio extras (see reference for every filename).

---

## Blocks (summary)

| Class | Count | Storybook sidebar |
| --- | --- | --- |
| Folder (auto codegen) | 10 | `Shadcn Studio/Blocks Auto` |
| Flat (curated stories) | 31 | `Shadcn Studio/Blocks` |

Slug ↔ export map: [blocks-inventory.md](./reference/blocks-inventory.md)

---

## Storybook sidebar

| Prefix | Source |
| --- | --- |
| `Shadcn Studio/Primitives` | `shadcn-studio-primitives.stories.tsx` |
| `Shadcn Studio/Theme Lab` | `shadcn-studio-theme-lab.stories.tsx` |
| `Shadcn Studio/Blocks Auto` | `shadcn-studio-blocks-auto.stories.tsx` |
| `Shadcn Studio/Blocks` | `shadcn-studio-blocks.stories.tsx` |
| `Afenda/Lab` | `apps/storybook/stories/` |

```bash
pnpm storybook dev
pnpm storybook generate
pnpm test:storybook:run
```

---

## CSS chain (Phase 1)

```txt
globals.css / preview.css — four imports only:
  tailwindcss → tw-animate-css → shadcn/tailwind.css → @afenda/shadcn-studio/shadcn-studio.css
```

No bespoke `@layer components` in app entries. Detail: [`afenda-tailwind`](../afenda-tailwind/SKILL.md)

---

## Gates (reference — run via composer)

```bash
pnpm check:downstream-integration
pnpm --filter @afenda/shadcn-studio typecheck
pnpm check:studio-metadata-binding && pnpm check:studio-block-slot-markers
pnpm storybook generate
pnpm --filter @afenda/erp typecheck
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio && pnpm check:package-css-dist-sync
```

**Never:** `pnpm ui:guard*`, `@afenda/ui`, PAS-005 consumption gates.

---

## Stack facts

| Topic | Value |
| --- | --- |
| Primitives | **Base UI** (`@base-ui/react`) — not Radix |
| shadcn style | `base-vega` |
| Phase 1 styling | Stock shadcn + Tailwind `className` |
| MCP | `shadcn` (CLI) · `shadcn-studio` (/cui, /rui, /iui, /ftc) |

---

## Keep atlas fresh

After MCP block install:

```bash
pnpm storybook generate
```

Reconcile: `index.ts`, `block-story-manifest.generated.json`, `components-ui/*.tsx` count.

---

## Reference files

| File | Contents |
| --- | --- |
| [primitives-catalog.md](./reference/primitives-catalog.md) | All 70 primitives |
| [blocks-inventory.md](./reference/blocks-inventory.md) | Block slugs + exports |
| [public-api-surfaces.md](./reference/public-api-surfaces.md) | Barrel + registries |
| [external-docs.md](./reference/external-docs.md) | Context7 + optional OSS skills |
