# Afenda Repo Authority

Use this reference for work inside `C:\JackProject\afenda-bolt\afenda-Xerp`.

## Source Hierarchy

Follow this order for presentation work:

1. Root `AGENTS.md` and `.cursor/rules/afenda-coding-session.mdc`
2. `docs/adr/ADR-0027-frontend-presentation-reset.md`
3. `docs/PAS/PRESENTATION/README.md`
4. `docs/PAS/PRESENTATION/PAS-006*.md`
5. `packages/shadcn-studio/AGENTS.md`
6. `packages/shadcn-studio/docs/ARCHITECTURE.md`
7. `packages/shadcn-studio/src/components-quarantine/README.md`
8. Current code and package manifests
9. External official docs

When guidance conflicts, current package manifests and PAS-006A/current package-local docs outrank older skill prose.

## Current Repo Shape

`@afenda/shadcn-studio` is the sole ERP presentation product. `apps/erp` and `apps/storybook` consume it.

Important files:

| Surface | Current path |
| --- | --- |
| Package manifest | `packages/shadcn-studio/package.json` |
| shadcn config | `packages/shadcn-studio/components.json` |
| Package architecture map | `packages/shadcn-studio/docs/ARCHITECTURE.md` |
| Package agent guide | `packages/shadcn-studio/AGENTS.md` |
| Quarantine guide | `packages/shadcn-studio/src/components-quarantine/README.md` |
| CSS source | `packages/shadcn-studio/src/styles/shadcn-default.css` |
| CSS dist | `packages/shadcn-studio/dist/shadcn-default.css` |
| Theme manifest | `packages/shadcn-studio/src/styles/theme-manifest.json` |
| ERP CSS entry | `apps/erp/src/app/globals.css` |
| Storybook CSS entry | `apps/storybook/.storybook/preview.css` |
| Public barrel | `packages/shadcn-studio/src/index.ts` |

Current package exports include `@afenda/shadcn-studio/shadcn-default.css`, `@afenda/shadcn-studio/themes/swiss-noir.css`, and `@afenda/shadcn-studio/themes/verdant-noir.css`. Some older guidance says `shadcn-studio.css`; verify actual package exports before giving commands.

## Runtime Model

`packages/shadcn-studio/components.json` currently uses:

- `style: "base-vega"`
- Tailwind CSS source: `src/styles/shadcn-default.css`
- `cssVariables: true`
- `iconLibrary: "lucide"`
- install aliases to `@/components-quarantine/blocks` and `@/components-quarantine/components`

`apps/erp/src/app/globals.css` currently composes:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@afenda/shadcn-studio/shadcn-default.css";

@source "../**/*.{ts,tsx}";
@source "../../../../packages/shadcn-studio/src/**/*.{ts,tsx}";
```

This file currently also contains auth pixel-shell CSS. Treat that as existing state, not permission to add new bespoke app-local styling.

## Package Layers

`packages/shadcn-studio/docs/ARCHITECTURE.md` defines:

| Layer | Paths | Role |
| --- | --- | --- |
| L1 Authority | `src/meta-contracts/`, `src/meta-registry/`, `src/meta-gates/` | Wire contracts, registries, gates |
| L2 Product | `src/components-ui/`, `src/components-layouts/`, `src/components-auth-shell/`, `src/components-assets/`, `src/components-quarantine/`, `src/lib/`, `src/hooks/`, `src/theme*/`, `src/styles/` | Primitives, blocks, theme, utilities |
| L3 Surfaces | `src/components-app-shell/` | App shell composition |
| L4 Verification | `src/storybook/`, `src/__tests__/`, `src/*.stories.tsx` | Stories and tests |

Consumers may use `@afenda/shadcn-studio`, `@afenda/shadcn-studio/theme`, `@afenda/shadcn-studio/governance` for gates, `@afenda/shadcn-studio/lab` for Storybook-only lab use, and CSS exports. Consumers must not deep-import `src/**`.

## Quarantine and Promotion

Raw MCP or shadcn CLI output goes to:

```text
packages/shadcn-studio/src/components-quarantine/
  blocks/
  components/
```

Use quarantine commands from repo root:

```bash
pnpm studio:shadcn:quarantine add @ss-blocks/<registry-name> --overwrite --yes
pnpm studio:quarantine sync
pnpm studio:promote --block <blockId>
pnpm studio:promote --block <blockId> --apply
```

Run `--apply` only when the preflight verdict is `READY_TO_PROMOTE`.

Never import from quarantine in ERP, Storybook, production buckets, or public barrels.

## Theme and Typography

Theme defaults live in `packages/shadcn-studio/src/theme-config/config.defaults.ts`. The current default font is `geist`.

`packages/shadcn-studio/src/theme-runtime/theme-runtime.font-attribute.ts` maps:

- `geist` to `--font-geist-sans` and `--font-geist-mono` with fallbacks
- `inter`
- `system`

Theme CSS overlays live under `src/styles/themes/**` and must be token-only, scoped, registered in `theme-manifest.json`, and imported after `shadcn-default.css` only when approved for the target surface.

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

Choose the narrowest gates covering the change:

```bash
pnpm check:studio-install-paths
pnpm check:studio-quarantine-isolation
pnpm check:studio-tsconfig-paths
pnpm check:studio-import-zones
pnpm check:studio-paths
pnpm check:quarantine-registry-sync
pnpm check:studio-metadata-binding
pnpm check:studio-block-slot-markers
pnpm check:studio-primitive-contracts
pnpm check:studio-blocks
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/shadcn-studio build
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio
pnpm check:package-css-dist-sync
pnpm check:erp-metadata-pas006-consumer
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm storybook generate
pnpm --filter @afenda/storybook test:storybook:run
pnpm --filter @afenda/storybook test:storybook:a11y:run
```

## Known Drift to Watch

- `.cursor/skills/afenda-tailwind/SKILL.md` still mentions `shadcn-studio.css` in places. Current package/PAS-006A use `shadcn-default.css`.
- Some docs link `packages/shadcn-studio/ARCHITECTURE.md`; current observed architecture doc is `packages/shadcn-studio/docs/ARCHITECTURE.md`.
- Root worktree may be dirty. Do not revert unrelated changes.
