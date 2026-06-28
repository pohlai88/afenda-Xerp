# Performance Optimization Reference

## Phase 9 — Performance Audit

### 9.1 Rendering performance

**Server Component usage (react-best-practices: server-* rules):**

```
[ ] Data-only pages/layouts are RSC — not converted to "use client" for convenience
[ ] No useEffect for initial data fetching that could be done in RSC
[ ] React.cache() wraps expensive per-request server functions (server-cache-react)
[ ] LRU cache used for cross-request caching where appropriate (server-cache-lru)
[ ] No module-level mutable variables in server files (server-no-shared-module-state)
[ ] Data passed from RSC to client serialized efficiently — no duplicate serialization (server-dedup-props)
[ ] Static I/O (fonts, logo URLs, config) hoisted to module scope outside component body (server-hoist-static-io)
```

**RSC parallel data fetching (react-best-practices: async-parallel):**

```tsx
// ❌ Sequential — blocks each fetch on the previous
const context = await resolveOperatingContext();
const layout = await fetchDashboardLayout(context.workspaceId);

// ✅ Parallel — all start simultaneously
const [context, layout, permissions] = await Promise.all([
  resolveOperatingContext(),
  fetchDashboardLayout(workspaceId),
  fetchPermissions(userId),
]);
```

Checklist:
```
[ ] All independent RSC data fetches use Promise.all
[ ] Cheap synchronous checks happen BEFORE any await (async-cheap-condition-before-await)
[ ] await moved into branches where actually used (async-defer-await)
[ ] Suspense boundaries used to stream content incrementally (async-suspense-boundaries)
```

### 9.2 Bundle size optimization

**Dynamic imports (react-best-practices: bundle-dynamic-imports):**

```tsx
// ❌ recharts in initial bundle — adds ~200KB gzipped
import { AreaChart, ResponsiveContainer } from "recharts";

// ✅ Deferred until actually rendered
import dynamic from "next/dynamic";

const AreaChart = dynamic(
  () => import("recharts").then((m) => ({ default: m.AreaChart })),
  { ssr: false, loading: () => <div className="afenda-chart-skeleton" aria-busy="true" /> }
);
```

Apply `next/dynamic` to:
```
[ ] All recharts components (AreaChart, LineChart, BarChart, PieChart, ResponsiveContainer)
[ ] Heavy form libraries (date pickers, rich text editors, PDF viewers)
[ ] Dashboard widgets not visible on initial viewport
[ ] Modal / dialog content (load when opened)
[ ] Map components
[ ] Code editor components
```

**Barrel file elimination (react-best-practices: bundle-barrel-imports):**

```tsx
// ❌ Barrel — pulls entire appshell into bundle
import { DashboardCanvas, AppShellHeader } from "@afenda/appshell";

// ✅ Direct — only what is needed
import { ApplicationShellDashboardCanvas } from "@afenda/appshell/dashboard/app-shell-dashboard-canvas.client";
```

Checklist:
```
[ ] No barrel imports from @afenda/* packages
[ ] Lucide icons imported individually: import { ArrowRight } from "lucide-react"
[ ] No wildcard re-exports in package index files that are consumed in hot paths
[ ] Third-party analytics/logging loaded after hydration (bundle-defer-third-party)
[ ] Feature flags gate module loading — modules not loaded until feature is activated (bundle-conditional)
[ ] Preload on hover/focus for perceived speed on known next navigation (bundle-preload)
```

**Verify bundle:**
```bash
pnpm --filter app build
# With @next/bundle-analyzer: inspect .next/analyze/client.html
# Focus: recharts absent from initial bundle, @afenda/appshell tree-shaken
```

### 9.3 Re-render optimization

**Memoization (react-best-practices: rerender-* rules):**

```
[ ] No useMemo on simple primitive expressions (string template, boolean flags)
[ ] useMemo IS used for: expensive filter/sort over 1000+ rows, complex derived objects
[ ] useCallback only for stable callback identity (event handlers passed to memoized children)
[ ] Static data arrays and objects hoisted to module scope (not created inside component)
[ ] Context values memoized when context re-renders would affect many consumers
```

**State subscription discipline:**

```
[ ] Components don't subscribe to state they only use in event callbacks (rerender-defer-reads)
[ ] Derived boolean flags subscribed instead of raw value: const isReady = useSelector(s => s.status === 'ready')
[ ] Derived state computed during render — not stored in useState + useEffect
[ ] Non-urgent updates wrapped in startTransition (rerender-transitions)
[ ] Heavy renders use useDeferredValue for search/filter inputs (rerender-use-deferred-value)
```

**Component identity:**

```
[ ] No component functions defined inside other component functions (rerender-no-inline-components)
[ ] Static JSX (icons, decoration, static content) hoisted outside component (rendering-hoist-jsx)
[ ] Activity component used for show/hide instead of unmount/remount (rendering-activity)
[ ] Ternary used for conditional render instead of && (rendering-conditional-render)
```

### 9.4 Image optimization

```
[ ] All <img> tags replaced with next/image
[ ] Images have explicit width and height to prevent CLS
[ ] Priority prop set on LCP image (hero, above-fold chart image)
[ ] sizes prop set for responsive images
[ ] Placeholder="blur" used for large images with blurDataURL
[ ] SVG icons imported directly (not via <img>)
[ ] No base64-encoded images inline in JSX (move to next/image or public/)
```

### 9.5 Font optimization

```
[ ] Fonts loaded via next/font (not @import in CSS or <link> in head)
[ ] font-display: swap configured (next/font default)
[ ] Only required font weights loaded (not all 100–900)
[ ] Variable fonts used where available (reduces weight count)
[ ] Preconnect to font CDN in <head> if using external (next/font handles this automatically)
[ ] Font variables correctly threaded from next/font → CSS variables → component
```

### 9.6 CSS performance

```
[ ] No @import chains in non-entry CSS files
[ ] CSS layers properly ordered (prevents style recalculation)
[ ] content-visibility: auto applied to long virtualized lists (rendering-content-visibility)
[ ] No CSS animations on layout properties (width, height, top, left) — use transform
[ ] SVG coordinates rounded to 2 decimal places (rendering-svg-precision)
[ ] Animate wrapper div around SVG elements, not SVG directly (rendering-animate-svg-wrapper)
```

### 9.7 Core Web Vitals targets

| Metric | Target | Common causes of failure |
|--------|--------|--------------------------|
| LCP | < 2.5s | Large unoptimized hero image, server response time, render-blocking resources |
| CLS | < 0.1 | Images without dimensions, dynamic content above fold, late font load |
| INP | < 200ms | Long event handlers, synchronous state updates on every keystroke, no useDeferredValue |
| TTFB | < 800ms | Slow RSC data fetching, no parallel Promise.all |

**CLS prevention checklist:**
```
[ ] next/image with explicit dimensions for every image
[ ] Skeletons match exact dimensions of loaded content
[ ] Fonts loaded via next/font (prevents FOUT/FOIT that causes CLS)
[ ] Dynamic content inserted below fold, not above
[ ] Ads/embeds have reserved space via aspect-ratio or explicit dimensions
```

### 9.8 JavaScript performance

```
[ ] Map/Set used for O(1) lookups instead of Array.find in render paths (js-set-map-lookups)
[ ] Index maps built for repeated lookups (js-index-maps)
[ ] RegExp hoisted to module scope, not created inside render (js-hoist-regexp)
[ ] Multiple filter/map chains combined into single loop where measurable (js-flatmap-filter)
[ ] Non-critical work deferred to requestIdleCallback (js-request-idle-callback)
[ ] Early return from functions instead of deep nesting (js-early-exit)
[ ] Spread in accumulators only outside loops (js-cache-property-access)
```

### 9.9 Package CSS dist sync

After any CSS source edit in `packages/appshell`, `packages/ui`, or `packages/metadata-ui`:

```bash
pnpm sync:package-css-dist              # copy src/ CSS → dist/ (all packages)
pnpm sync:package-css-dist -- --package @afenda/appshell  # scoped
pnpm check:package-css-dist-sync        # verify gate
```

Read `.cursor/skills/package-css-dist-sync/SKILL.md` for the full protocol.
