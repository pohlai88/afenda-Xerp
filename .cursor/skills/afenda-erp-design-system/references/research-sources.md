# Research Sources

Use these sources as supporting evidence. Repo PAS and `@afenda/shadcn-studio-v2` package docs remain the authority for this codebase.

## Research Tools

| Tool | Use |
| --- | --- |
| Context7 MCP (`plugin-context7-plugin-context7`) | Current shadcn/ui and Tailwind v4 docs — resolve library ID first, then `query-docs` |
| GitHub MCP | OSS repo evidence, issue history, upstream component source |
| Storybook MCP | Component props, stories, and manifest docs for existing Afenda surfaces |
| `npx skills find <query>` | Discover open agent skills at <https://skills.sh/> |

Context7 library IDs confirmed for this repo:

| Library | Context7 ID |
| --- | --- |
| shadcn/ui (GitHub) | `/shadcn-ui/ui` |
| shadcn/ui (docs site) | `/websites/ui_shadcn` |
| Tailwind CSS v4 docs | `/tailwindlabs/tailwindcss.com` |

Re-check docs when a task depends on library versions, CLI behavior, browser support, or "latest" package guidance.

## Primary External Sources

| Source | Use |
| --- | --- |
| <https://ui.shadcn.com/> | shadcn/ui as an open-code foundation for building your own component library |
| <https://ui.shadcn.com/docs/theming> | semantic CSS-variable tokens such as `background`, `foreground`, `primary`, and `primary-foreground` |
| <https://ui.shadcn.com/docs/tailwind-v4> | Tailwind v4 migration: `@theme inline`, `tw-animate-css`, `size-*`, React 19 primitive changes |
| <https://ui.shadcn.com/docs/components-json> | `components.json` schema; `tailwind.cssVariables: true` for semantic tokens |
| <https://github.com/shadcn-ui/ui> | OSS repo: open code, React, Next.js, Tailwind, Base UI, Radix |
| <https://tailwindcss.com/docs/theme> | Tailwind v4 theme variables and token-to-utility mapping |
| <https://tailwindcss.com/docs/functions-and-directives> | `@theme`, `@theme inline`, `@source`, `@custom-variant`, `@utility`, `@reference` |
| <https://tailwindcss.com/docs/adding-custom-styles> | CSS-first `@theme` customization and custom design tokens |
| <https://tailwindcss.com/blog/tailwindcss-v4> | Tailwind v4 CSS-first configuration, import support, automatic content detection |
| <https://base-ui.com/> | Base UI as unstyled accessible React primitives for Tailwind composition |
| <https://vercel.com/geist/introduction> | Geist design system: high contrast, grid, icons, type |
| <https://vercel.com/font> | Geist Sans, Mono, and Pixel typography direction |
| <https://storybook.js.org/docs> | Storybook as isolated UI development/testing/documentation environment |
| <https://github.com/storybookjs/design-system> | OSS design-system repository pattern: central reusable components shared by multiple apps |
| Vercel `vercel-composition-patterns` agent skill | Compound components, avoid boolean behavior props, explicit variants, React 19 — adapted in `references/react-composition-patterns.md` |
| Vercel `react-best-practices` / `vercel-react-best-practices` | P1–P8 primitive perf, ERP async/bundle rules — adapted in `references/react-best-practices.md` |
| Agent skills `frontend-ui-engineering` | Operator composition, states, anti-AI aesthetic, a11y baseline — adapted in `references/operator-ui-quality.md` |
| Former `afenda-react-surface-quality` | B/A/C/Y/T scan, RSC playbook, surface testing — consolidated in `references/surface-quality-scan.md` and siblings |

## Mature Design-System Benchmarks

Use these as pattern references, not as scope templates:

| System | Useful lesson |
| --- | --- |
| <https://primer.style/> | GitHub Primer separates product UI, brand UI, icons, and accessibility guidance. |
| <https://github.com/primer> | Primer maintains primitives, CSS, React, and tooling as separate OSS artifacts. |
| <https://carbondesignsystem.com/> | Carbon combines working code, design tools, human interface guidelines, accessibility, and community contribution. |
| <https://carbondesignsystem.com/patterns/overview/> | Patterns are reusable combinations of components and templates for common user goals. |
| <https://polaris-react.shopify.com/> | Polaris organizes foundations, patterns, components, tokens, icons, contribution rules, and version guides. |
| <https://spectrum.adobe.com/page/design-tokens/> | Spectrum frames design tokens as design decisions translated into data and source-of-truth assets. |
| <https://github.com/adobe/spectrum-design-data> | Spectrum keeps design data, token schemas, component schemas, and tooling as code. |

## Afenda Internal Sources

| Source | Use |
| --- | --- |
| `packages/shadcn-studio-v2/docs/DESIGN-SYSTEM-ARCHITECTURE.md` | V2 code-first architecture, quality bar, export law |
| `packages/shadcn-studio-v2/docs/TAXONOMY.md` | Structural naming law and forbidden folders |
| `packages/shadcn-studio-v2/AGENTS.md` | Local agent contract for V2 package work |
| `docs/PAS/PRESENTATION/PAS-006*.md` | ERP presentation standard family |
| `docs/adr/ADR-0027-frontend-presentation-reset.md` | Constitutional presentation chain |

## Research Notes

- Context7 MCP is available in Cursor via the context7 plugin; prefer it over training-data defaults for shadcn/ui and Tailwind v4 behavior.
- Do not copy external design-system scope. Afenda's KISS path is shadcn + Tailwind v4 + `@afenda/shadcn-studio-v2` + PAS-006 manufacturing gates.
- Legacy `@afenda/shadcn-studio` (v1) docs and Figma rules may cite old paths; verify against V2 manifests when implementing.
