# Presentation Lab Auth Login — noir CSS wiring

Per-theme **static** CSS imports live in dedicated story files (Vitest browser cannot resolve dynamic `loaders` imports for these side-effect modules).

| Story file | CSS import |
| --- | --- |
| `presentation-lab-login-swiss.stories.tsx` | `docs/swiss-noir.css` |
| `presentation-lab-login-verdant.stories.tsx` | `docs/verdant-noir.css` |
| `presentation-lab-login-comparison.stories.tsx` | both (comparison only) |

Do **not** use `await import("./presentation-lab-login-styles/*-side-effect.js")` in story loaders — blocked by `pnpm check:storybook-noir-css-imports`.

The `*-side-effect.ts` modules remain as documentation mirrors of the CSS paths; prefer static imports in story files.
