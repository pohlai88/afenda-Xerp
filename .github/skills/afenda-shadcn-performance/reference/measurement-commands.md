# Measurement Commands — Afenda ERP

Monorepo commands for bundle and runtime performance. **Measure before optimizing.**

## Bundle analysis (primary)

From repo root:

```bash
pnpm --filter @afenda/erp analyze
```

Sets `ANALYZE=true` and runs a **webpack** production build (`--webpack` required — Turbopack builds do not emit analyzer reports on Next.js 16). Opens an interactive treemap in the browser showing client/server chunks.

**Output:** `apps/erp/.next/analyze/client.html`, `edge.html`, `nodejs.html` (open `client.html` in a browser).

Manual equivalent:

```bash
# Unix / macOS / Git Bash
ANALYZE=true pnpm --filter @afenda/erp exec next build --webpack

# PowerShell
$env:ANALYZE = "true"; pnpm --filter @afenda/erp exec next build --webpack
```

**Note:** Default `next build` uses Turbopack on Next.js 16. The analyze script passes `--webpack` so `@next/bundle-analyzer` can emit reports. For Turbopack-native analysis, see [Next.js package bundling](https://nextjs.org/docs/app/guides/package-bundling) (`next experimental-analyze`).

## Dependency size (before adding packages)

```bash
npx bundle-phobia date-fns
npx bundle-phobia recharts
npx bundle-phobia lodash
```

Prefer native APIs or per-function imports when minified size is high.

## Build gates

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm --filter @afenda/shadcn-studio typecheck   # studio changes
pnpm check:downstream-integration               # CSS composition chain
pnpm check:package-css-dist-sync                # shadcn-studio.css edits
```

## Lighthouse (local)

1. `pnpm --filter @afenda/erp dev`
2. Chrome DevTools → Lighthouse → Mobile, throttled
3. Target route (e.g. `/modules/procurement/...`)

Record LCP, INP, CLS against [performance-checklist](../../../references/performance-checklist.md) targets.

## DevTools performance

- **Network:** throttle Fast 3G; check initial JS transfer size
- **Performance:** record interaction; flag long tasks >50ms (INP risk)
- **Coverage:** unused JS/CSS after typical user flow

## Core Web Vitals targets

| Metric | Good | Needs work | Poor |
| --- | --- | --- | --- |
| LCP | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## Initial JS budget

Target: **≤ 200KB gzipped** initial load ([performance-checklist](../../../references/performance-checklist.md)).

If over budget:

1. Run analyze — identify largest modules
2. Lazy-load heaviest on-demand chunks
3. Replace heavy deps or use tree-shakeable imports
4. Trim CVA variant strings generating unused CSS

## External tools

- [WebPageTest](https://www.webpagetest.org) — multi-location, filmstrip
- [HTTP Archive](https://httparchive.org/reports/state-of-the-web) — industry baselines
- [Core Web Vitals](https://web.dev/vitals/) — field vs lab guidance

## CI (future)

Consider Lighthouse CI or bundle size limits on `main` — not wired today. Document regressions manually until CI budget lands.
