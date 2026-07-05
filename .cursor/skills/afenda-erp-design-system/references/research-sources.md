# Research Sources

Use these sources as supporting evidence. Repo PAS and package docs remain the authority for this codebase.

## Primary External Sources

| Source | Use |
| --- | --- |
| <https://ui.shadcn.com/> | shadcn/ui as an open-code foundation for building your own component library |
| <https://ui.shadcn.com/docs/theming> | semantic CSS-variable tokens such as `background`, `foreground`, `primary`, and `primary-foreground` |
| <https://ui.shadcn.com/docs/tailwind-v4> | Tailwind v4 migration guidance for shadcn, `@theme inline`, `tw-animate-css`, `size-*`, and React 19 primitive changes |
| <https://github.com/shadcn-ui/ui> | OSS repo evidence: shadcn/ui is open source/open code and covers React, Next.js, Tailwind, Base UI, Radix, TanStack |
| <https://tailwindcss.com/docs/theme> | Tailwind v4 theme variables and token-to-utility mapping |
| <https://tailwindcss.com/docs/functions-and-directives> | Tailwind directives including `@theme`, `@source`, `@custom-variant`, `@utility`, and `@reference` |
| <https://tailwindcss.com/blog/tailwindcss-v4> | Tailwind v4 CSS-first configuration, import support, automatic content detection, and modern CSS platform model |
| <https://base-ui.com/> | Base UI as unstyled accessible React primitives that work with Tailwind and follow ARIA/WCAG behavior guidance |
| <https://vercel.com/geist/introduction> | Geist design system foundations: consistent web experiences, high contrast colors, grid, icons, type |
| <https://vercel.com/font> | Geist Sans, Mono, and Pixel typography direction |
| <https://storybook.js.org/docs> | Storybook as isolated UI development/testing/documentation environment |
| <https://github.com/storybookjs/design-system> | OSS design-system repository pattern: central reusable components shared by multiple apps |

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

## Research Notes

- Context7 and GitHub MCP were requested but failed to start in the creation session; official docs and public GitHub URLs were used instead.
- Re-check docs when a task depends on library versions, current CLI behavior, browser support, or "latest" package guidance.
- Do not copy external design-system scope. Afenda's KISS path is shadcn + Tailwind v4 + PAS-006 manufacturing gates.
