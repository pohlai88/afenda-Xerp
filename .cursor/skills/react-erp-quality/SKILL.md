---
name: react-erp-quality
description: React quality gate for Afenda ERP — accessibility (ARIA live regions, chart labels, focus management), hooks discipline (no useEffect for derived state, stable deps), RSC vs client boundaries, composition patterns (no boolean-prop explosion), and bundle/waterfall prevention. Use after every UI block install, when writing new components, or when fixing accessibility warnings. Companion to afenda-ui-quality (run after Phase 5). Enforces react-best-practices, react-hooks, and vercel-composition-patterns rules scoped to this monorepo.
disable-model-invocation: true
---

# React ERP Quality — Accessibility · Hooks · Composition · Performance

> Companion gate to **afenda-ui-quality Phase 5**. Run this checklist after TIP-004 normalization is clean.
>
> Stack: React 19 · Next.js App Router · `@afenda/ui` Radix primitives · recharts · `"use client"` boundary discipline.

---

## Critical gaps this skill closes

| Gap | Where it shows up | Rule source |
|-----|-------------------|-------------|
| Missing `aria-live` on dynamic ERP data | Notifications, search, status cells | `accessibility-live-regions` |
| Unlabeled recharts SVGs | All dashboard charts | `accessibility-chart-labels` |
| `useEffect` to sync derived state | `app-shell-dashboard-canvas.client.tsx` | `rerender-derived-state-no-effect` |
| No `"use client"` decision boundary | Every new block | `server-client-boundary` |
| Boolean prop explosion | `editMode` / `showReadonlyPreviewLabel` | `architecture-avoid-boolean-props` |
| Heavy chart bundles loaded eagerly | recharts in dashboard blocks | `bundle-dynamic-imports` |
| No `Promise.all` in RSC data fetches | Server page components | `async-parallel` |

---

## Gate 1 — Accessibility (CRITICAL)

Run after Phase 5.2 of `afenda-ui-quality`. All items must pass.

### 1.1 ARIA live regions

ERP surfaces update dynamically (filtered tables, search results, notifications). Screenreaders must announce changes.

```tsx
// ✅ Search result count update
<p aria-live="polite" aria-atomic="true" className="sr-only">
  {count} results for "{query}"
</p>

// ✅ Async status feedback
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>

// ✅ Loading state
<div aria-busy={isLoading} aria-label="Dashboard data loading">
  {isLoading ? <Skeleton /> : <Content />}
</div>
```

Checklist:
```
[ ] Search dialogs announce result count via aria-live="polite"
[ ] Error states use role="alert" (assertive by default)
[ ] Table filters announce row count change
[ ] Toast/notification uses role="status" or role="alert"
[ ] Loading spinners have aria-busy + descriptive aria-label
```

### 1.2 Chart and data visualization labels

Recharts renders bare SVGs — they are invisible to screenreaders without explicit labeling.

```tsx
// ❌ Raw recharts — no accessible label
<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={data}>...</AreaChart>
</ResponsiveContainer>

// ✅ Labeled chart wrapper
<figure aria-label="Monthly revenue trend, January to June">
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart data={data} aria-hidden="true">...</AreaChart>
  </ResponsiveContainer>
  <figcaption className="sr-only">
    Revenue grew from $3.2M in January to $4.8M in June (+50%).
  </figcaption>
</figure>
```

Pattern for KPI sparklines:
```tsx
<div
  aria-label={`${metric.label} trend: ${metric.trendDescription}`}
  role="img"
>
  <SparklineChart data={metric.series} aria-hidden="true" />
</div>
```

```
[ ] Every <ResponsiveContainer> is wrapped in <figure> with aria-label
[ ] AreaChart / LineChart / BarChart has aria-hidden="true" on SVG
[ ] figcaption describes the data story (not just "Revenue chart")
[ ] Tooltip content is also announced via aria-live for keyboard users
```

### 1.3 Focus management in dialogs and sheets

Radix handles focus trap — but reset focus on close is the app's responsibility.

```tsx
// ✅ Return focus to trigger on Dialog close
const triggerRef = useRef<HTMLButtonElement>(null);

<Dialog onOpenChange={(open) => {
  if (!open) triggerRef.current?.focus();
}}>
  <DialogTrigger ref={triggerRef} asChild>
    <Button>Open</Button>
  </DialogTrigger>
  ...
</Dialog>
```

```
[ ] Dialog/Sheet close returns focus to the trigger element
[ ] DropdownMenu keyboard: Escape closes and returns focus to trigger
[ ] Combobox: announcing number of options with aria-live
[ ] No focus trap escapes to page body unexpectedly
```

### 1.4 Keyboard-only navigation

```
[ ] All interactive elements reachable via Tab / Shift+Tab
[ ] No tabIndex > 0 (breaks natural tab order)
[ ] Click-only divs either replaced with <button> or have role + onKeyDown
[ ] Drag handles in dashboard edit mode have keyboard alternative (arrow key resize)
[ ] Skip-to-content link present at top of AppShell for keyboard users
```

---

## Gate 2 — Hooks Discipline

### 2.1 Never use useEffect to sync derived state

The most common ERP bug: `useEffect` that immediately calls `setState` when a prop changes.

```tsx
// ❌ Violation — rerender-derived-state-no-effect
// Found in: app-shell-dashboard-canvas.client.tsx
useEffect(() => {
  setLayout(resolvedInitialLayout);
}, [resolvedInitialLayout]);

// ✅ Fix A — derive during render
const layout = resolvedInitialLayout; // no state needed if no local mutation

// ✅ Fix B — if local edits are needed, use key reset
// Parent resets component state by changing the key
<DashboardCanvas key={layoutPresetId} layout={layoutProp} />

// ✅ Fix C — store only the divergence
const [userEdits, setUserEdits] = useState<Partial<DashboardLayoutPreset>>({});
const layout = { ...resolvedInitialLayout, ...userEdits };
```

### 2.2 Stable dependencies — avoid object/array literals in deps

```tsx
// ❌ New object every render — effect fires on every render
useEffect(() => {
  track({ page: 'dashboard', userId });
}, [{ page: 'dashboard', userId }]);  // object literal is always new

// ✅ Use primitive deps
useEffect(() => {
  track({ page: 'dashboard', userId });
}, [userId]);
```

### 2.3 useMemo / useCallback — only where measurable

```tsx
// ❌ Over-memo of primitive — rerender-simple-expression-in-memo
const label = useMemo(() => `${count} items`, [count]);

// ✅ Just compute it
const label = `${count} items`;

// ✅ Memo IS correct here — expensive filter + sort over 1000+ rows
const sortedRows = useMemo(
  () => rows.filter(isVisible).sort(byDate),
  [rows, isVisible, byDate]
);
```

### 2.4 Functional setState for toggling

```tsx
// ❌ Stale closure — rerender-functional-setstate violation
const toggle = useCallback(() => {
  setOpen(!open);  // captures stale `open`
}, [open]);

// ✅ Functional update — no stale capture
const toggle = useCallback(() => {
  setOpen((prev) => !prev);
}, []);
```

### 2.5 useEffect cleanup

```tsx
// ❌ Missing cleanup — subscription leak
useEffect(() => {
  const sub = eventBus.subscribe('layout-change', handler);
  // no return
}, [handler]);

// ✅ Always return cleanup
useEffect(() => {
  const sub = eventBus.subscribe('layout-change', handler);
  return () => sub.unsubscribe();
}, [handler]);
```

Checklist:
```
[ ] No useEffect that only calls setState from a prop (derive instead)
[ ] All deps arrays contain only primitives or stable refs
[ ] useMemo/useCallback only on expensive ops or stable callback identity
[ ] Functional setState for all toggle/increment/append operations
[ ] All subscriptions / listeners return cleanup functions
```

---

## Gate 3 — Server vs Client Boundaries

### 3.1 Decision framework

```
Question: Does this component...
  ├─ use useState / useEffect / event handlers?  → "use client"
  ├─ use browser APIs (localStorage, window)?    → "use client"
  ├─ use a context with useContext?              → "use client"
  └─ only render static markup / fetch data?    → Server Component (no directive)
```

**ERP rule:** Push `"use client"` as far down the tree as possible. The shell layout, sidebar, header can all be RSC — only the interactive widgets need the boundary.

```tsx
// ✅ RSC page — no "use client", fetches data
// apps/erp/src/app/(protected)/page.tsx
export default async function DashboardPage() {
  const [context, layout] = await Promise.all([
    resolveOperatingContext(),
    fetchDashboardLayout(),
  ]);
  return <ProtectedWorkspaceDashboard context={context} layout={layout} />;
}

// ✅ Thin client island — only the interactive canvas
// packages/appshell/src/dashboard/app-shell-dashboard-canvas.client.tsx
"use client";
export function ApplicationShellDashboardCanvas({ layout, ... }) { ... }
```

### 3.2 No shared mutable module state in RSC

```tsx
// ❌ Module-level mutable state — shared across all requests (server-no-shared-module-state)
let cachedLayout: DashboardLayout | null = null;  // NEVER do this in RSC

// ✅ Per-request cache via React.cache()
import { cache } from "react";

export const fetchDashboardLayout = cache(async (workspaceId: string) => {
  return db.dashboardLayouts.findUnique({ where: { workspaceId } });
});
```

### 3.3 Parallel data fetching in RSC

```tsx
// ❌ Sequential waterfall — each await blocks the next
const context = await resolveOperatingContext();
const layout = await fetchDashboardLayout(context.workspaceId);
const permissions = await fetchPermissions(context.userId);

// ✅ Parallel — async-parallel rule
const [context, layout, permissions] = await Promise.all([
  resolveOperatingContext(),
  fetchDashboardLayout(workspaceId),
  fetchPermissions(userId),
]);
```

Checklist:
```
[ ] Pages and layouts are RSC unless they use hooks/events
[ ] "use client" is on the smallest possible subtree
[ ] No module-level mutable variables in server-executed files
[ ] RSC data fetches use Promise.all for independent queries
[ ] React.cache() wraps per-request server functions used in multiple places
```

---

## Gate 4 — Composition Patterns

### 4.1 No boolean prop explosion

When a component accumulates multiple boolean mode flags, split it into variants.

```tsx
// ❌ Boolean props accumulate — architecture-avoid-boolean-props
<DashboardCanvas
  editMode={true}
  showReadonlyPreviewLabel={false}
  isLoading={false}
  isError={false}
  showEmptyState={true}
/>

// ✅ Render-state composition
<DashboardCanvas layout={layout} onLayoutChange={handleChange}>
  {/* Consumer controls what renders, not the canvas */}
</DashboardCanvas>

// ✅ Explicit mode variants when behavior genuinely differs
<DashboardCanvasEditMode layout={layout} onLayoutChange={handleChange} />
<DashboardCanvasReadonlyMode layout={layout} previewLabel="Q2 Layout" />
```

### 4.2 No inline component definitions

```tsx
// ❌ New component identity on every render — rerender-no-inline-components
function DashboardPage() {
  const WidgetWrapper = ({ children }) => (  // redefined on every render
    <div className="afenda-widget">{children}</div>
  );
  return <DashboardGrid renderItem={(item) => <WidgetWrapper>{...}</WidgetWrapper>} />;
}

// ✅ Extracted to module scope
function WidgetWrapper({ children }: { children: React.ReactNode }) {
  return <div className="afenda-widget">{children}</div>;
}

function DashboardPage() {
  return <DashboardGrid renderItem={(item) => <WidgetWrapper>{...}</WidgetWrapper>} />;
}
```

### 4.3 Children over renderX props

```tsx
// ❌ Render prop for static composition
<DashboardWidget
  renderHeader={() => <span>Revenue</span>}
  renderFooter={() => <span>Last 30 days</span>}
/>

// ✅ Compound children
<DashboardWidget>
  <DashboardWidget.Header>Revenue</DashboardWidget.Header>
  <DashboardWidget.Body>...</DashboardWidget.Body>
  <DashboardWidget.Footer>Last 30 days</DashboardWidget.Footer>
</DashboardWidget>
```

### 4.4 React 19 — no forwardRef

React 19 passes `ref` as a plain prop. Remove all `forwardRef` wrappers.

```tsx
// ❌ React 18 pattern — react19-no-forwardref
const Field = forwardRef<HTMLInputElement, FieldProps>((props, ref) => (
  <input {...props} ref={ref} />
));

// ✅ React 19
function Field({ ref, ...props }: FieldProps & { ref?: React.Ref<HTMLInputElement> }) {
  return <input {...props} ref={ref} />;
}
```

Checklist:
```
[ ] No component with > 3 boolean mode flags — split into variants
[ ] No component functions defined inside other component functions
[ ] renderX props replaced with children or compound-component slots
[ ] No React.forwardRef() — use ref as a plain prop (React 19)
[ ] Context interface follows: { state, actions, meta } shape
```

---

## Gate 5 — Bundle / Performance

### 5.1 Dynamic import for heavy chart bundles

Recharts is large (~200 KB gzipped). Never import it statically in dashboard blocks.

```tsx
// ❌ Static import — recharts loaded in initial bundle
import { AreaChart, ResponsiveContainer } from "recharts";

// ✅ Dynamic import — bundle-dynamic-imports rule
import dynamic from "next/dynamic";

const AreaChart = dynamic(
  () => import("recharts").then((m) => ({ default: m.AreaChart })),
  { ssr: false }
);
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => ({ default: m.ResponsiveContainer })),
  { ssr: false, loading: () => <div className="afenda-chart-skeleton" aria-busy="true" /> }
);
```

> Apply to: `app-shell-dashboard-revenue-chart.tsx`, `app-shell-dashboard-module-earnings.tsx`, `app-shell-dashboard-regional-sales.tsx`, all `statistics-*-card.tsx` with charts.

### 5.2 No barrel file imports

```tsx
// ❌ Barrel import — loads entire appshell on every import
import { DashboardCanvas, AppShellHeader, AppShellSidebar } from "@afenda/appshell";

// ✅ Direct path import — bundle-barrel-imports rule
import { ApplicationShellDashboardCanvas } from "@afenda/appshell/dashboard/app-shell-dashboard-canvas.client";
```

### 5.3 Hoist static data outside components

```tsx
// ❌ New object on every render — server-hoist-static-io
function RegionalSalesChart() {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];  // recreated each render
  ...
}

// ✅ Module-level constant
const CHART_COLORS = [
  "var(--afenda-viz-chart-1)",
  "var(--afenda-viz-chart-2)",
  "var(--afenda-viz-chart-3)",
] as const;

function RegionalSalesChart() { ... }
```

Checklist:
```
[ ] recharts components use next/dynamic with ssr: false
[ ] Dynamic import loading state uses afenda-chart-skeleton class + aria-busy
[ ] No barrel file imports from @afenda/* packages
[ ] Static data arrays/objects hoisted to module scope
[ ] next/image used for all <img> tags (not raw <img>)
```

---

## Verification commands

```bash
# Biome catches inline components, hook rule violations
pnpm lint

# TypeScript — catches derived state bugs, missing return types
pnpm --filter @afenda/appshell typecheck
pnpm --filter app typecheck

# Bundle analysis — verify recharts is not in initial bundle
pnpm --filter app build
# Then inspect .next/analyze/client.html (requires @next/bundle-analyzer)

# Accessibility audit (axe)
pnpm --filter app test:a11y   # if configured
```

---

## Additional resources

- afenda-ui-quality (runs first): [`.cursor/skills/afenda-ui-quality/SKILL.md`](../afenda-ui-quality/SKILL.md)
- govern-primitive checklist: [`.cursor/skills/govern-primitive/SKILL.md`](../govern-primitive/SKILL.md)
- Detailed hook patterns: [`reference.md`](reference.md)
- Vercel react-best-practices rules: `rerender-derived-state-no-effect`, `bundle-barrel-imports`, `async-parallel`, `server-no-shared-module-state`
- Vercel composition-patterns rules: `architecture-avoid-boolean-props`, `rerender-no-inline-components`
