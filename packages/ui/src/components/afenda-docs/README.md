# Afenda Docs reference blocks

Reference-only compositions for the Fumadocs docs site (`@afenda/docs`). **Not exported** from the main `@afenda/ui` barrel.

## Storybook catalog (Afenda-owned)

Category: **Afenda Docs / …** — stable editorial blocks with porcelain preview tokens. No `fumadocs-ui` imports in Storybook.

| Storybook title | Component | Variants | Fumadocs UI equivalent |
| --------------- | --------- | -------- | ---------------------- |
| **Block Catalog** | `docs-block-catalog` | SelectionBoard | — |
| Guide Card Grid | `docs-guide-card-grid` | grid · compact · featured | Card / Cards |
| Feature Strip | `docs-feature-strip` | bordered · plain · dense | Features section |
| Steps Panel | `docs-steps-panel` | numbered · timeline · compact | Steps |
| Callout | `docs-callout` | rail · soft · banner · note / info / warn / success tones | Banner / Callout |
| Announcement Bar | `docs-announcement-bar` | accent · neutral · warn | Announcement |
| Accordion Panel | `docs-accordion-panel` | contained · separated · flush · plus-minus / chevron icons | Accordion |
| Code Panel | `docs-code-panel` | panel · inline | Code Block |
| File Tree | `docs-file-tree` | default · compact | Files |
| Inline TOC | `docs-inline-toc` | card · rail · minimal | Inline TOC |
| Tabbed Panel | `docs-tabbed-panel` | default · line tabs | Tabs |
| Prop Table | `docs-prop-table` | default · compact | Type Table |

Each block story includes a **VariantMatrix** export for primitive-style side-by-side comparison.

Live `@afenda/docs` still uses upstream `fumadocs-ui` via `mdx.tsx`. Storybook previews Afenda blocks for copy/adopt only.

## shadcn/studio lineage

| Block | Inspiration source |
| ----- | ------------------ |
| `docs-guide-card-grid` | `/iui` features-section + card grid patterns |
| `docs-feature-strip` | `/iui` features-section horizontal strip |
| `docs-steps-panel` | `/iui` multi-step-form step rhythm (static, no stepper) |
| `docs-announcement-bar` | `/iui` announcement-banner (dismissible, no motion) |

Raw MCP output is **not** installed to `packages/appshell/` for docs delivery.

## Copy workflow (manual adoption)

1. Open Storybook → **Afenda Docs** → choose a variant.
2. Copy component file(s) to `apps/docs/src/components/blocks/`.
3. Run `pnpm storybook generate` (or start Storybook — codegen runs automatically) to sync CSS into `apps/docs/src/app/docs-editorial-blocks.css` using `--docs-editorial-*` tokens from `docs-editorial-palette.css`.
4. Register components in `apps/docs/src/components/mdx.tsx` (or use upstream fumadocs-ui for MDX primitives).
5. Verify `@afenda/docs` still has **zero** `@afenda/*` runtime deps: `pnpm quality:boundaries`.

## Token swap map

| Preview (Storybook) | Docs site |
| ------------------- | --------- |
| `--docs-preview-canvas` | `--docs-editorial-canvas` |
| `--docs-preview-paper` | `--docs-editorial-paper` |
| `--docs-preview-text` | `--docs-editorial-text` |
| `--docs-preview-text-muted` | `--docs-editorial-text-muted` |
| `--docs-preview-border` | `--docs-editorial-border` |
| `--docs-preview-accent` | `--docs-editorial-prose-accent` (prose/blocks only) |

## Governance

- Zero `className` on governed `@afenda/ui` primitives (Card, Badge, Button, Accordion, Tabs, …).
- Layout and surface chrome on plain HTML wrappers with semantic `afenda-docs-*` classes.
- Gates: `pnpm ui:guard:scan`, `pnpm --filter @afenda/ui test:run`.
