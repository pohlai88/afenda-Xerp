# shadcn/studio staging

Reference-only files fetched via `/rui` + `get-component-content`.

**Do not import these files from any consumer package.**
**Do not ship these files to production.**
**Do not add className to governed primitives when adapting patterns.**

## Import policy (within `@afenda/ui`)

Staging files live inside `packages/ui/src/components/`. They must **not** use the shadcn MCP alias (`@/components/ui/...`) — that alias is for external MCP installs only and breaks internal package resolution.

| Target | Import style | Example (from `shadcn-studio/dialog/`) |
|--------|--------------|----------------------------------------|
| Governed primitives | Relative to `components/` | `../../button`, `../../dialog` |
| Storybook-only helpers | Relative to `_storybook/` | `../../_storybook/stepper/stepper` |
| External libs | Package name | `lucide-react`, `motion/react` |

**Already correct:** `accordion-04`, `alert-11`, `tabs-11`, `tabs-29`, `tooltip-07`, `toggle-13`.

**Demo string literals** inside `code-block-05.tsx` may still show `@/components/ui/*` — that is intentional MCP sample code, not a runtime import.

## Contents

| File | Source | Patterns extracted to |
|------|--------|----------------------|
| `accordion/accordion-04.tsx` | @ss-components/accordion-04 | `docs-accordion-panel` — accent tint, plus/minus icon, muted content |
| `alert/alert-11.tsx` | @ss-components/alert-11 | `afenda-docs-callout` — 4px left border, tone-tinted bg, icon-first layout |
| `tabs/tabs-11.tsx` | @ss-components/tabs-11 | `docs-tabbed-panel` + `_storybook/tabs/tabs-line-demo` — static line tabs |
| `tabs/tabs-29.tsx` | @ss-components/tabs-29 | `_storybook/tabs/tabs-animated-underline-demo` — spring motion underline |
| `code-block/code-block-05.tsx` | @ss-components/code-block-05 | `_storybook/code-block` — Shiki + tabs-11 + copy (preview only) |
| `collapsible/collapsible-10.tsx` | @ss-components/collapsible-10 | `_storybook/collapsible` — height animation, ghost icon trigger, repo rows |
| `command/command-11.tsx` | @ss-components/command-11 | `_storybook/command` — filter dialog, RadioGroup sections, checkbox rows |
| `dialog/dialog-09.tsx` | @ss-components/dialog-09 | `_storybook/dialog` — subscribe form, centered header, inline email row |
| `dialog/dialog-11.tsx` | @ss-components/dialog-11 | `_storybook/dialog` — Lucide mood rating, textarea, consent footer |
| `list/list-02.tsx` | @ss-components/list-02 | `_storybook/list` — outline Item rows + Switch notification settings (preview only) |
| `scroll-area/scroll-area-01.tsx` | @ss-components/scroll-area-01 | `_storybook/scroll-area` — fixed panel + paragraph body scroll (preview only) |
| `stepper/stepper-09.tsx` | @ss-components/stepper-09 | `_storybook/stepper` — vertical nav + panel swap + Back/Next (preview only) |
| `toggle/toggle-13.tsx` | @ss-components/toggle-13 | `_storybook/toggle` — motion particle burst bookmark toggle (preview only) |
| `tooltip/tooltip-07.tsx` | @ss-components/tooltip-07 | `_storybook/tooltip/tooltip-content-demo` — icon + title + body rich content |

## Normalization (Phase 3 per afenda-ui-quality)

All className patterns from these files have been translated to:
- BEM CSS classes in `_storybook/afenda-docs/afenda-docs-preview.css` (Afenda Docs blocks) or `_storybook/*-preview.css` (Storybook demos)
- Scoped bridge vars (`var(--docs-preview-*)` / `var(--afenda-spacing-*)`) — no raw hex, no arbitrary values
- Zero className on governed `@afenda/ui` primitives in consumer blocks
