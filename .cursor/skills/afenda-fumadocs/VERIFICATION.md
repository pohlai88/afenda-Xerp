# Afenda Fumadocs — Verification Gate Matrix

## Changed-files → gate mapping

| Changed file(s) | Minimum gates | Full pre-PR gates |
|-----------------|--------------|-------------------|
| `apps/docs/content/docs/**/*.mdx` | `build` | `build` + `biome ci` + `drift` |
| `apps/docs/content/docs/**/meta.json` | `build` | `build` + `drift` |
| `apps/docs/source.config.ts` | `generate:source` → `typecheck` + `build` | All |
| `apps/docs/src/lib/source.ts` | `typecheck` + `build` | All |
| `apps/docs/src/lib/layout.shared.ts` | `typecheck` + `test:run` | All |
| `apps/docs/src/components/mdx.tsx` | `typecheck` + `test:run` | All |
| `apps/docs/src/app/**/*.tsx` | `typecheck` + `build` | All |
| `apps/docs/src/__tests__/**/*.ts` | `typecheck` + `test:run` | All |
| `apps/docs/src/app/globals.css` | `build` | `build` + `boundaries` + `drift` |
| `apps/docs/package.json` | `boundaries` + `build` | All |
| `apps/docs/next.config.ts` | `build` | All |
| `apps/docs/tsconfig.json` | `typecheck` + `build` | All |
| `apps/docs/postcss.config.mjs` | `build` | `build` + `boundaries` |
| Root `package.json` (CI wiring — Slice 2 only) | `drift` | All |
| Any `docs/delivery/` or `docs/architecture/` file | `drift` | `drift` + `boundaries` |

---

## Gate commands

```bash
# Generate type-safe .source/ from source.config.ts (required before typecheck/test/build)
pnpm --filter @afenda/docs generate:source

# TypeScript strict mode
pnpm --filter @afenda/docs typecheck

# Vitest unit/smoke tests
pnpm --filter @afenda/docs test:run

# Next.js production build (SSG + MDX compilation)
pnpm --filter @afenda/docs build

# Verify zero unapproved @afenda/* edges from docs
pnpm quality:boundaries

# Biome format + lint (CI mode — fails on warnings)
pnpm exec biome ci apps/docs

# Documentation drift guard
pnpm check:documentation-drift

# Full pre-PR sequence
pnpm --filter @afenda/docs typecheck && \
pnpm --filter @afenda/docs test:run && \
pnpm --filter @afenda/docs build && \
pnpm quality:boundaries && \
pnpm exec biome ci apps/docs && \
pnpm check:documentation-drift
```

---

## Gate semantics

| Gate | What it catches |
|------|----------------|
| `generate:source` | Schema drift — Zod in `source.config.ts` doesn't match MDX frontmatter |
| `typecheck` | TypeScript errors in route components, source loader, MDX types |
| `test:run` | Regressions in layout options, MDX component merging |
| `build` | MDX compile errors, missing frontmatter, broken imports, route errors |
| `boundaries` | Unapproved `@afenda/*` edges from `apps/docs` |
| `biome ci` | Format drift, import order, no `any`, dead code |
| `drift` | Documentation status conflicts between TIP docs, index, and runtime matrix |

---

## When `.source/` is stale

Symptoms:
- TypeScript error: `Cannot find module 'collections/server'`
- Build error: `.source/server.ts not found`
- Tests fail with import errors

Fix:
```bash
pnpm --filter @afenda/docs generate:source
```

This runs `fumadocs-mdx` which regenerates `.source/browser.ts`, `.source/dynamic.ts`, `.source/server.ts`, and `.source/source.config.mjs`.

The `prebuild`, `pretypecheck`, and `pretest:run` scripts in `package.json` call this automatically.

---

## Slice-specific gate requirements

| TIP-032 Slice | Extra gate |
|---------------|-----------|
| Slice 1 (scaffold) | Manual smoke: `pnpm --filter @afenda/docs dev` → visit http://localhost:3001/docs |
| Slice 2 (CI automation) | Verify `quality:docs` or equivalent appears in root `package.json` |
| Slice 3 (token theming) | `pnpm quality:boundaries` must still show zero outbound workspace runtime deps unless `@afenda/design-system` was registry-approved |
| Slice 4 (seed content) | All new MDX files in `meta.json`; no orphan pages |
| Slice 5 (deploy) | Separate Vercel project configured; no shared ERP env vars |
