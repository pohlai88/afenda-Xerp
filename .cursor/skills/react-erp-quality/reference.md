# React ERP Quality — Deep Reference

> Companion to [SKILL.md](SKILL.md). Read when you need full rule explanations or worked fixes.

---

## Rule index (sourced from react-best-practices + composition-patterns)

| Rule ID | Category | ERP relevance |
|---------|----------|---------------|
| `rerender-derived-state-no-effect` | Re-render | `DashboardCanvas` layout sync bug |
| `rerender-functional-setstate` | Re-render | All toggle handlers |
| `rerender-no-inline-components` | Re-render | Widget render callbacks |
| `rerender-lazy-state-init` | Re-render | Heavy initial layout computation |
| `rerender-simple-expression-in-memo` | Re-render | Label/string memos |
| `async-parallel` | Waterfalls | RSC page data fetches |
| `bundle-dynamic-imports` | Bundle | recharts, heavy dialog content |
| `bundle-barrel-imports` | Bundle | `@afenda/*` package imports |
| `server-no-shared-module-state` | Server | Any module-level variable |
| `server-cache-react` | Server | Per-request DB calls |
| `architecture-avoid-boolean-props` | Composition | `editMode`, `showReadonlyPreviewLabel` |
| `rerender-no-inline-components` | Composition | Widget factory lambdas |

---

## Worked fixes for this repo

### Fix 1 — DashboardCanvas layout sync (rerender-derived-state-no-effect)

**Location:** `packages/appshell/src/dashboard/app-shell-dashboard-canvas.client.tsx`

**Problem:** `useEffect` that calls `setLayout` whenever `resolvedInitialLayout` changes causes a double-render on every prop change.

```tsx
// ❌ Current code
const [layout, setLayout] = useState(resolvedInitialLayout);

useEffect(() => {
  setLayout(resolvedInitialLayout);
}, [resolvedInitialLayout]);
```

**Fix A — Key reset (recommended when user edits should be discarded on preset change):**

```tsx
// Parent passes a stable key tied to the preset identity
<ApplicationShellDashboardCanvas
  key={layoutPresetId}   // when preset changes, component resets
  layout={layoutProp}
  onLayoutChange={handleChange}
/>

// Canvas itself — no useEffect needed
function ApplicationShellDashboardCanvas({ layout: layoutProp, ... }) {
  const registry = getDashboardWidgetRegistry();
  const [layout, setLayout] = useState(() =>
    resolveDashboardLayoutPreset(layoutProp, registry, DEFAULT_DASHBOARD_LAYOUT)
  );
  // layoutProp changes → key changes → state resets automatically
  ...
}
```

**Fix B — Uncontrolled + callback (user edits survive preset change):**

```tsx
function ApplicationShellDashboardCanvas({ layout: layoutProp, ... }) {
  const registry = getDashboardWidgetRegistry();
  const resolvedDefault = useMemo(
    () => resolveDashboardLayoutPreset(layoutProp, registry, DEFAULT_DASHBOARD_LAYOUT),
    // Only recompute when identity changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layoutProp?.id, registry]
  );

  const [layout, setLayout] = useState(resolvedDefault);

  // No useEffect — external changes apply via key prop in parent
  ...
}
```

---

### Fix 2 — recharts dynamic import recipe

Apply to all `shadcn-studio/blocks/*-chart.tsx` and `statistics-*-card.tsx` files.

```tsx
// Before: packages/appshell/src/shadcn-studio/blocks/app-shell-dashboard-revenue-chart.tsx
"use client";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// After:
"use client";
import dynamic from "next/dynamic";
import type { AreaChartProps } from "recharts";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => ({ default: m.ResponsiveContainer })),
  {
    ssr: false,
    loading: () => (
      <div
        aria-busy="true"
        aria-label="Chart loading"
        className="afenda-chart-skeleton"
        role="img"
      />
    ),
  }
);

const AreaChart = dynamic(
  () => import("recharts").then((m) => ({ default: m.AreaChart })),
  { ssr: false }
);

// Static imports from recharts that are just config/types remain fine
import type { TooltipProps } from "recharts";
```

Add to `afenda-appshell.css`:
```css
@layer components {
  .afenda-chart-skeleton {
    width: 100%;
    height: 100%;
    min-height: 120px;
    background-color: color-mix(in oklch, var(--muted) 60%, transparent);
    border-radius: var(--afenda-radius-md);
    animation: pulse var(--afenda-motion-duration-slower) var(--afenda-motion-ease-in-out) infinite alternate;
  }

  @media (prefers-reduced-motion: reduce) {
    .afenda-chart-skeleton {
      animation: none;
    }
  }
}
```

---

### Fix 3 — Accessible chart wrapper

Apply to every recharts chart in appshell blocks.

```tsx
// ✅ Full accessible chart pattern
function RevenueChart({ data, summary }: RevenueChartProps) {
  return (
    <figure
      aria-label={`Revenue trend chart: ${summary.label}`}
      className="afenda-chart-figure"
    >
      <ResponsiveContainer aria-hidden="true" height={200} width="100%">
        <AreaChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            dataKey="revenue"
            fill="url(#afenda-chart-area-fill)"
            stroke="var(--afenda-viz-chart-1)"
            strokeWidth={1.5}
            type="monotone"
          />
          <defs>
            <linearGradient id="afenda-chart-area-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--afenda-viz-chart-1)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--afenda-viz-chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
      <figcaption className="sr-only">{summary.description}</figcaption>
    </figure>
  );
}
```

Required `summary` shape:
```ts
interface ChartSummary {
  label: string;         // "Monthly revenue, Jan–Jun 2026"
  description: string;   // "Revenue grew from $3.2M to $4.8M (+50%)"
}
```

---

### Fix 4 — Skip-to-content link in AppShell

Add once at the top of `app-shell-main.tsx`:

```tsx
// packages/appshell/src/app-shell-main.tsx
export function AppShellMain({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="afenda-skip-link" href="#main-content">
        Skip to main content
      </a>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
```

```css
/* afenda-appshell.css */
@layer components {
  .afenda-skip-link {
    position: absolute;
    top: var(--afenda-spacing-2);
    left: var(--afenda-spacing-2);
    padding: var(--afenda-spacing-2) var(--afenda-spacing-4);
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-radius: var(--afenda-radius-md);
    font-size: var(--text-sm);
    font-weight: 600;
    z-index: 9999;
    transform: translateY(-200%);
    transition: transform var(--afenda-motion-duration-fast) var(--afenda-motion-ease-out);
  }

  .afenda-skip-link:focus-visible {
    transform: translateY(0);
  }
}
```

---

### Fix 5 — aria-live in search dialog

```tsx
// packages/appshell/src/shadcn-studio/blocks/app-shell-search-dialog.tsx
function AppShellSearchDialog() {
  const [query, setQuery] = useState("");
  const results = useSearchResults(query);

  return (
    <Dialog>
      <DialogContent>
        <input
          aria-label="Search"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commands..."
          type="search"
          value={query}
        />
        {/* Announce result count to screenreaders */}
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {results.length > 0
            ? `${results.length} result${results.length === 1 ? "" : "s"} for ${query}`
            : query.length > 0
              ? "No results found"
              : ""}
        </p>
        <ul role="listbox">
          {results.map((result) => (
            <li key={result.id} role="option">
              {result.label}
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Accessibility audit tools

```bash
# 1. axe-core via Playwright (if e2e configured)
# apps/erp/e2e/accessibility.spec.ts

# 2. Manual check with axe DevTools browser extension
# Focus on: missing labels, color contrast, keyboard traps

# 3. Lighthouse CI accessibility score (target: 95+)
# Run: pnpm --filter app build && lighthouse http://localhost:3000

# 4. NVDA/VoiceOver manual test for dynamic content:
#   - Open dashboard, filter a table, confirm screenreader announces count
#   - Open search dialog, type query, confirm result announcement
#   - Open/close a modal, confirm focus returns to trigger
```

---

## React 19 migration notes

| Old pattern | React 19 replacement |
|-------------|---------------------|
| `forwardRef((props, ref) => ...)` | `function Cmp({ ref, ...props })` |
| `useContext(Ctx)` | `use(Ctx)` (in async or conditional contexts) |
| `ReactDOM.render()` | `createRoot().render()` (already done) |
| `act()` from react-dom/test-utils | `act()` from react (already done in vitest config) |

No `forwardRef` should appear in new code. Existing governed primitives in `packages/ui` may still use it — do not touch them without running the govern-primitive checklist.
