---
name: afenda-shadcn-performance
description: >-
  Synergistic shadcn, Tailwind v4, and React performance for PAS-006 ERP —
  tree shaking, code splitting, CSS JIT, RSC boundaries, and measurement.
  Use when adding studio blocks, optimizing bundles, lazy-loading heavy UI,
  or keeping @afenda/shadcn-studio components at optimum condition.
paths:
  - apps/erp/**
  - packages/shadcn-studio/**
  - apps/storybook/**
---

# Afenda shadcn Performance (PAS-006)

**Authority:** [PAS-006](../../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · [ADR-0027](../../../docs/adr/ADR-0027-frontend-presentation-reset.md)

**Source:** [shadcn/studio — How To Optimize Shadcn Performance](https://shadcnstudio.com/blog/how-to-optimize-shadcn-performance/)

Implementation guide for keeping the **shadcn + Tailwind v4 + React** stack fast in Afenda. Three layers work together — optimize one in isolation and you miss the win.

| Layer | Lever | Detail |
| --- | --- | --- |
| JavaScript | Tree shaking + code splitting | [Pillar 1](#pillar-1--tree-shaking-js) · [Pillar 2](#pillar-2--code-splitting) |
| CSS | Tailwind v4 JIT + static classes | [Pillar 3](#pillar-3--tailwind-v4-css) |
| React | RSC boundaries + profiled memo | [Pillar 4](#pillar-4--react-rendering) |

Deep checklists: [reference/synergy-checklist.md](reference/synergy-checklist.md) · Commands: [reference/measurement-commands.md](reference/measurement-commands.md) · Patterns: [reference/code-patterns.md](reference/code-patterns.md)

---

## When to use / defer

| Task | Skill |
| --- | --- |
| MCP block install, import zones, studio gates | [`shadcn-studio`](../shadcn-studio/SKILL.md) |
| `globals.css`, `@source`, theme tokens, Phase 1 CSS doctrine | [`afenda-tailwind`](../afenda-tailwind/SKILL.md) |
| Full presentation gate bundle | [`afenda-presentation-quality`](../afenda-presentation-quality/SKILL.md) |
| Module routing, `force-dynamic`, `_components/` layout | [`afenda-nextjs-best-practice`](../afenda-nextjs-best-practice/SKILL.md) |
| Pre-merge CWV / bundle **audit** (readonly) | [`/afenda-webperf`](../afenda-webperf/SKILL.md) |
| Bundle size, lazy-load, CVA, dynamic imports, perf regression fix | **this skill** |

**Phase 1 boundary:** Performance work must **not** violate [`afenda-tailwind`](../afenda-tailwind/SKILL.md) — no bespoke rules in `globals.css`, no theme token refactors without measured CSS bloat. CSS wins come from static class strings, lean CVA variants, and correct `@source` — not new composition layers.

---

## Measure-first workflow

1. **Baseline** — `pnpm --filter @afenda/erp analyze` or Lighthouse on target route
2. **Change** — one optimization at a time
3. **Re-measure** — same tool, same route
4. **Stop** when initial JS ≤ 200KB gzipped (target from [performance-checklist](../../references/performance-checklist.md)) or improvement no longer justifies complexity

No speculative `React.memo`, no drive-by lazy-load of small components.

---

## Pillar 1 — Tree shaking (JS)

Shadcn components live in your repo (`packages/shadcn-studio/src/components/ui/`), so bundlers can trace usage — unlike opaque `node_modules` UI libraries.

**Rules:**

- Named imports only — never `import * as X`
- ERP imports from `@afenda/shadcn-studio` barrel (zone C) — never deep `@afenda/shadcn-studio/src/...`
- Icons: prefer named lucide imports; `optimizePackageImports: ["lucide-react"]` is already wired in [`apps/erp/next.config.ts`](../../../apps/erp/next.config.ts)
- Before adding a dependency: `npx bundle-phobia <package>`
- **CVA:** Tailwind scans **all** variant class strings in source. Remove unused variants from `cva(...)` in primitives — JS tree shaking does not remove unused CSS from CVA strings

```typescript
// Bad — unused variant strings still generate CSS
const buttonVariants = cva("base", { variants: { size: { sm: "...", xl: "..." } } });

// Good — only variants you ship
const buttonVariants = cva("base", { variants: { size: { sm: "...", default: "..." } } });
```

---

## Pillar 2 — Code splitting

Next.js splits at the route level automatically. Add **component-level** splits for heavy, on-demand UI.

**Lazy-load candidates (>50KB or below-the-fold):**

- Modals and dialogs (especially with heavy deps: charts, croppers, PDF)
- Charts and data visualizations
- Admin-only panels
- Rich text editors

**Do not lazy-load:**

- Navigation, headers, shell chrome
- Above-the-fold content
- Components under ~50KB on every page

**Patterns:**

- Use `next/dynamic` with `Skeleton` from `@afenda/shadcn-studio` for loading states
- Default `ssr: true`; use `ssr: false` only for browser-only APIs (`window`, `canvas`, `localStorage`)
- Heavy module UI stays in `_components/` per module layout — lazy-load inside the module, not the shell

See [reference/code-patterns.md](reference/code-patterns.md).

---

## Pillar 3 — Tailwind v4 CSS

Tailwind generates CSS from **static class strings** found during content scanning — not runtime usage.

**Rules (detail in [`afenda-tailwind`](../afenda-tailwind/SKILL.md)):**

- Composition entries: four `@import`s + `@source` globs only — no bespoke rules in `globals.css`
- Static class maps — never `` className={`bg-${color}-500`} ``
- Semantic tokens (`bg-primary`, `text-muted-foreground`) over raw palette in ERP TSX
- Theme authority: `packages/shadcn-studio/src/styles/shadcn-studio.css` — sync dist after edits

```typescript
// Bad — Tailwind cannot detect dynamic segments
const color = "blue";
<div className={`bg-${color}-500`} />;

// Good — explicit static strings
const colorClass = color === "blue" ? "bg-blue-500" : "bg-red-500";
<div className={colorClass} />;
```

---

## Pillar 4 — React rendering

- **Server Components default** — `"use client"` only for interactivity (events, hooks, browser APIs)
- **`error.tsx` / `global-error.tsx` must not import `@afenda/shadcn-studio`** — client-safe retry only
- `React.memo` / `useMemo` / `useCallback` **only after profiling** shows wasted re-renders
- INP: defer analytics/logging out of click handlers; break long tasks (>50ms) — see [performance-checklist](../../references/performance-checklist.md)

---

## MCP / block install checklist

After MCP block install or new studio component:

- [ ] Import zones pass: `pnpm check:studio-import-zones`
- [ ] No dynamic Tailwind class construction in new block TSX
- [ ] Named imports from barrel in ERP consumers
- [ ] If block pulls heavy deps (charts, editors): wrap consumer with `next/dynamic`
- [ ] CVA variants lean — remove unused size/variant strings
- [ ] Re-run analyze if bundle size is a concern

---

## Common pitfalls

| Pitfall | Fix |
| --- | --- |
| Over-lazy-loading | Each split adds a network request — reserve for >50KB or below-fold |
| Dynamic class names | Use explicit static maps (Pillar 3) |
| Desktop-only testing | Throttle 3G in DevTools; test mid-range Android |
| Skipping measurement | Always baseline before/after |
| Full lodash import | Native JS or `lodash-es` per-function imports |
| Theme refactor “for perf” in Phase 1 | Measure CSS first; defer token slimming without evidence |

---

## Resources

### Official documentation

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs) — JIT compiler and CSS-first config
- [shadcn/ui](https://ui.shadcn.com) — Component documentation and CLI
- [React Performance](https://react.dev/learn/render-and-commit) — Rendering and commit phases

### Performance tools

- [Lighthouse](https://developer.chrome.com/docs/lighthouse) — Automated auditing
- [WebPageTest](https://www.webpagetest.org) — Advanced performance testing
- [Bundle Phobia](https://bundlephobia.com) — Check package sizes before install
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) — Visualize bundles (via `@next/bundle-analyzer`)

### Learning resources

- [HTTP Archive Reports](https://httparchive.org/reports/state-of-the-web) — Real-world performance data
- [Core Web Vitals](https://web.dev/vitals/) — Google's performance metrics

### Source article

- [How To Optimize Shadcn Performance — shadcn/studio blog](https://shadcnstudio.com/blog/how-to-optimize-shadcn-performance/)

---

## Verification

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm --filter @afenda/erp analyze          # opens bundle treemap when ANALYZE=true
pnpm check:downstream-integration          # when CSS / @source touched
pnpm check:package-css-dist-sync           # when shadcn-studio.css touched
pnpm --filter @afenda/shadcn-studio typecheck   # when studio package touched
```

Skill complete when:

1. Change follows at least one pillar with evidence (measurement or checklist)
2. Phase 1 CSS doctrine not violated
3. Gates above pass for touched surfaces
