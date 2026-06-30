# External library docs (supplement only)

Use when Afenda atlas + child skills do not answer **generic API** questions (prop names, Radix/shadcn upstream patterns, Tailwind utility syntax).

**Authority order:** PAS-006 + `@afenda/shadcn-studio` runtime **always wins** over generic docs.

---

## Context7 MCP

| Library | Context7 ID | Use for |
| --- | --- | --- |
| shadcn/ui | `/shadcn-ui/ui` | Component API, theming, CLI |
| Tailwind CSS v4 | `/tailwindlabs/tailwindcss.com` | `@theme`, `@import`, utilities |

Workflow: resolve library ID → query specific component or directive.

---

## OSS skills (optional install)

Evaluate via [vendor/EVALUATION.md](../../vendor/EVALUATION.md) before adding to `vendor/`:

| Skill | Source | Notes |
| --- | --- | --- |
| shadcn-ui | `jezweb/claude-skills@shadcn-ui` | Generic patterns — not Base UI / base-vega |
| tailwind-design-system | `giuseppe-trisciuoglio/developer-kit@tailwind-design-system` | Token architecture ideas — not Afenda CSS chain |
| storybook | `pedronauck/skills@storybook` | Story API — Afenda lab: `afenda-storybook` |

```bash
npx skills find shadcn
npx skills find tailwind
npx skills find storybook
```

---

## Do not use for Afenda ERP

- Retired `@afenda/ui` / governed-ui consumption docs
- PAS-005 css-authority token IDs (`CSS-TOKEN-*`) for ERP presentation
- Radix `asChild` patterns on Base UI triggers (use `render` props)
