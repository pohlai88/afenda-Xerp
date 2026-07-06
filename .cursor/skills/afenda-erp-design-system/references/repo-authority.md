# Afenda Repo Authority

Use this reference for work inside this monorepo (afenda-Xerp).

## Source Hierarchy

Follow this order for presentation work:

1. Root `AGENTS.md` and `.cursor/rules/afenda-coding-session.mdc`
2. `docs/adr/ADR-0027-frontend-presentation-reset.md`
3. `docs/PAS/PRESENTATION/README.md`
4. `docs/PAS/PRESENTATION/PAS-006*.md`
5. `packages/shadcn-studio-v2/AGENTS.md` and `packages/shadcn-studio-v2/docs/TAXONOMY.md`
6. `packages/shadcn-studio-v2/docs/DESIGN-SYSTEM-ARCHITECTURE.md`
7. Legacy `packages/shadcn-studio/**` (migration source only — do not extend)
8. Current code and package manifests
9. External official docs (Context7 MCP or primary URLs)

When guidance conflicts, current V2 package manifests and PAS-006 docs outrank older skill prose or legacy v1 paths.

## Current Repo Shape

**V2 target:** `@afenda/shadcn-studio-v2` — governed presentation package with closed taxonomy, explicit export boundaries, and executable gates.

**Legacy v1:** `@afenda/shadcn-studio` — migration source; do not add new features unless a slice explicitly requires it.

Consumers: `apps/erp`, `apps/developer`, `apps/storybook`.

### V2 Important Files

| Surface | Path |
| --- | --- |
| Package manifest | `packages/shadcn-studio-v2/package.json` |
| shadcn config | `packages/shadcn-studio-v2/components.json` |
| Architecture | `packages/shadcn-studio-v2/docs/DESIGN-SYSTEM-ARCHITECTURE.md` |
| Taxonomy law | `packages/shadcn-studio-v2/docs/TAXONOMY.md` |
| Package agent guide | `packages/shadcn-studio-v2/AGENTS.md` |
| Quarantine guide | `packages/shadcn-studio-v2/src/components/quarantine/README.md` |
| CSS source | `packages/shadcn-studio-v2/src/styles/shadcn-default.css` |
| CSS dist | `packages/shadcn-studio-v2/dist/shadcn-default.css` |
| Theme overlays | `packages/shadcn-studio-v2/src/styles/swiss-noir.css`, `verdant-noir.css` |
| Theme config | `packages/shadcn-studio-v2/src/configs/theme-config.ts` |
| ERP CSS entry | `apps/erp/src/app/globals.css` |
| Developer lab CSS | `apps/developer/src/app/globals.css` |
| Storybook CSS entry | `apps/storybook/.storybook/preview.css` |
| Public barrels | `src/index.ts`, `clients.ts`, `server.ts`, `metadata.ts` |

### V2 Package Exports

| Export path | Purpose |
| --- | --- |
| `@afenda/shadcn-studio-v2` | Full public API (primitives, views, types, configs) |
| `@afenda/shadcn-studio-v2/clients` | Client-safe React (`ThemeProvider`, `ThemeToggle`, `ThemeScript`, `ThemeCustomizer`) |
| `@afenda/shadcn-studio-v2/server` | Server-safe config and theme types only |
| `@afenda/shadcn-studio-v2/metadata` | View metadata contracts, builders, gates, registries |
| `@afenda/shadcn-studio-v2/theme` | Theme boundary re-exports |
| `@afenda/shadcn-studio-v2/shadcn-default.css` | Canonical OKLCH token sheet |
| `@afenda/shadcn-studio-v2/themes/swiss-noir.css` | Swiss Noir theme overlay |
| `@afenda/shadcn-studio-v2/themes/verdant-noir.css` | Verdant Noir theme overlay |

### V2 Public Import Law

```ts
import { Button, PageSurface, DataTableSurface } from "@afenda/shadcn-studio-v2";
import { ThemeProvider } from "@afenda/shadcn-studio-v2/clients";
import { studioThemeConfig } from "@afenda/shadcn-studio-v2/server";
import type { ViewMetadata } from "@afenda/shadcn-studio-v2/metadata";
```

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@afenda/shadcn-studio-v2/shadcn-default.css";
/* optional theme overlay after default */
@import "@afenda/shadcn-studio-v2/themes/swiss-noir.css";

@source "../**/*.{ts,tsx}";
@source "../../../../packages/shadcn-studio-v2/src/**/*.{ts,tsx}";
```

Forbidden imports:

```ts
@afenda/shadcn-studio-v2/src/*
@afenda/shadcn-studio-v2/components/*
@afenda/shadcn-studio-v2/views/*
packages/shadcn-studio-v2/src/components/quarantine/*
packages/shadcn-studio/src/*   // legacy internals
```

### V2 Runtime Layers

| Layer | Paths | Role |
| --- | --- | --- |
| L1 Primitives | `src/components/ui/` | 40 Base UI–style components; token-only styling |
| L2 Layout chrome | `src/components/layout/` | AppShell, Sidebar, Topbar |
| L3 Shared runtime | `src/components/shared/`, `src/contexts/` | ThemeProvider, ThemeToggle, ThemeScript |
| L4 Views | `src/views/` | AuthShell, PageSurface, DataTableSurface, FormSurface, etc. |
| L5 Metadata | `src/metadata/` | Contracts, registries, gates, builders |
| L6 Verification | `src/__tests__/`, Storybook | Tests, taxonomy, drift, APCA |

Only four root export boundary files under `src/`: `index.ts`, `clients.ts`, `server.ts`, `metadata.ts`.

## Legacy V1 Reference (Migration Only)

Use when tracing migration rows in `docs/MIGRATION-MAP.md` or promoting legacy blocks. Do not add new v1 features.

| Surface | Legacy path |
| --- | --- |
| Package manifest | `packages/shadcn-studio/package.json` |
| Architecture | `packages/shadcn-studio/docs/ARCHITECTURE.md` |
| Quarantine | `packages/shadcn-studio/src/components-quarantine/` |
| CSS source | `packages/shadcn-studio/src/styles/shadcn-default.css` |
| Public barrel | `packages/shadcn-studio/src/index.ts` |

Legacy quarantine commands (v1 only):

```bash
pnpm studio:shadcn:quarantine add @ss-blocks/<registry-name> --overwrite --yes
pnpm studio:quarantine sync
pnpm studio:promote --block <blockId>
pnpm studio:promote --block <blockId> --apply
```

Run `--apply` only when preflight verdict is `READY_TO_PROMOTE`.

## CSS Composition Model

Package CSS (`shadcn-default.css`) owns `:root` / `.dark` OKLCH variables only — no Tailwind directives.

App CSS owns Tailwind entry, `@source`, and optional `@theme inline` mapping. See [shadcn-tailwind-v4.md](shadcn-tailwind-v4.md).

After editing V2 package CSS:

```bash
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm check:package-css-dist-sync
```

## Theme System (V2)

- **14 theme IDs**: `shadcn-default` + 11 AdminCN presets + `swiss-noir` + `verdant-noir`
- **32 canonical tokens**: `CANONICAL_THEME_TOKEN_NAMES` in `theme-config.ts`
- **Runtime**: `ThemeProvider` toggles `.dark`, injects inline tokens for non-default themes
- **Storage key**: `afenda-studio-v2-theme`
- **Contrast gate**: `pnpm --filter @afenda/shadcn-studio-v2 check:apca` (APCA-W3)

Forbidden token families in any CSS: `--brand-*`, `--afenda-*`, `--surface-*`, `--luxury-*`.

## PAS-006 Work Type Picker

| Work type | Authority |
| --- | --- |
| Theme, CSS, MCP install, package exports | PAS-006A |
| Inventory, slots, lifecycle, block data contracts | PAS-006B |
| Acceptance Record, ACPA, auth WCAG AA | PAS-006C |
| Metadata binding and surface templates | PAS-006D |
| Developer route lab | PAS-006E |

Do not implement from Blueprint prose alone. Read target PAS and slice handoff where present.

## Gate Menu

Choose the narrowest gates covering the change.

### V2 package gates

```bash
pnpm studio:v2:primitives   # primitive baseline + API consistency + extension (preferred for ui/**)
pnpm --filter @afenda/shadcn-studio-v2 test:primitives
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 test:taxonomy
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 check:apca
pnpm --filter @afenda/shadcn-studio-v2 quality   # drift + apca + test + typecheck + build
pnpm studio:v2:check-biome
pnpm studio:v2:normalize-biome   # after MCP bulk ui imports
pnpm exec biome ci packages/shadcn-studio-v2
```

### CSS sync

```bash
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio-v2
pnpm check:package-css-dist-sync
```

### Consumer gates

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm --filter @afenda/developer typecheck
pnpm check:erp-metadata-pas006-consumer
pnpm storybook generate
pnpm --filter @afenda/storybook test:storybook:run
pnpm --filter @afenda/storybook test:storybook:a11y:run
```

### Legacy v1 gates (when touching migration source)

```bash
pnpm check:studio-install-paths
pnpm check:studio-quarantine-isolation
pnpm check:studio-import-zones
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/shadcn-studio build
```

## Known Drift to Watch

- Some docs and skills still reference `@afenda/shadcn-studio` as the active package; V2 is `@afenda/shadcn-studio-v2`.
- Older guidance may say `shadcn-studio.css`; current export is `shadcn-default.css`.
- Figma rules (`.cursor/rules/figma-design-system-rules.mdc`) still cite v1 paths — verify against V2 manifests when implementing.
- Root worktree may be dirty. Do not revert unrelated changes.
