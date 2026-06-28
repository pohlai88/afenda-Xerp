# UX + Accessibility Reference

## Phase 7 — UX Assessment

### 7.1 UX quality pillars (frontend-design-review framework)

Score each pillar 0–10. Target: ≥ 8.5 per pillar, ≥ 9.0 overall.

#### Pillar 1 — Frictionless Insight to Action

```
[ ] Primary action obvious without scanning — one CTA per section
[ ] Task completable in minimum steps — no extra confirmation dialogs for low-risk actions
[ ] Next action and outcome clear before clicking
[ ] Navigation, back, and cancel paths always visible
[ ] No dead ends — every error state has a recovery path
[ ] Progressive disclosure: details revealed on demand, not all upfront
```

Red flags:
- > 3 clicks to complete a common workflow
- Multiple competing primary actions (two filled buttons)
- Critical actions buried below the fold or in obscure menu paths
- Dead-end error pages with no link back

#### Pillar 2 — Quality Craft (visual design-review)

Apply the **anthropic-frontend-design** visual thesis to ERP context:
- **Visual thesis**: enterprise calm — restrained, precise, trustworthy
- **Content plan**: primary workspace → KPI context → detail → action
- **Interaction thesis**: purposeful entrance reveals, hover state depth, focus affordance

```
[ ] Design system compliance — no custom one-off styles
[ ] Typography hierarchy is clear — H1 unmistakable, body readable
[ ] Spacing rhythm consistent — shared 4px/8px baseline
[ ] One dominant visual anchor per viewport
[ ] White space used intentionally, not accidentally
[ ] Cards only when card IS the interaction (not as decorative wrapper)
[ ] Dark mode equivalent quality to light mode
[ ] Mobile layout readable and functional (not just "works")
```

Red flags:
- Generic dashboard-card mosaics with no hierarchy
- Every region boxed with border (should use whitespace/background instead)
- Multiple competing accent colors
- No clear primary action per section

#### Pillar 3 — Trustworthy Building (enterprise UX)

```
[ ] AI-generated content disclosed with appropriate framing
[ ] Errors clear, actionable, and honest — not "Something went wrong"
[ ] Loading states always present — no raw white flash
[ ] Destructive actions require explicit confirmation
[ ] Data freshness surfaced where relevant (last synced, as of date)
[ ] Form validation happens before submission, not only on submit
[ ] Success feedback clear and transient (not persistent success banners)
```

### 7.2 Information architecture

```
[ ] Navigation hierarchy matches user mental model for ERP workflows
[ ] Module groupings logical (Finance, HRM, Inventory, Manufacturing, etc.)
[ ] Command palette provides global search across all entities
[ ] Breadcrumb trail accurate at every level
[ ] URL structure mirrors navigation hierarchy (deep-linkable)
[ ] Workspace switching (tenant / legal entity / consolidation scope) obvious and recoverable
```

### 7.3 Cognitive load reduction

```
[ ] Jargon-free labels — use domain language users recognize, not tech speak
[ ] Related actions grouped (not scattered across page)
[ ] Confirmation dialogs only for irreversible or high-risk actions
[ ] Defaults sensible — forms start pre-filled where appropriate
[ ] Input validation inline and immediate (not only on submit)
[ ] No walls of text — bullets, headings, and progressive reveal preferred
[ ] Help text appears on focus, not permanently (reduces clutter)
```

### 7.4 Keyboard and power-user workflow

```
[ ] All interactive elements reachable via Tab / Shift+Tab
[ ] Keyboard shortcut for command palette (Cmd+K / Ctrl+K)
[ ] Table rows navigable with arrow keys
[ ] Dialogs closeable with Escape
[ ] Dropdowns navigable with arrow keys, confirmed with Enter
[ ] Power users can complete common workflows keyboard-only
[ ] Skip-to-content link at AppShell top for keyboard users
[ ] No tabIndex > 0 (breaks natural tab order)
```

### 7.5 Responsive and multi-screen design

**Mobile (< 640px):**
```
[ ] All text legible — min 14px body
[ ] Touch targets ≥ 44×44px (buttons, links, icons)
[ ] Horizontal scroll eliminated (or explicitly intentional for tables)
[ ] Sidebar collapses to slide-over drawer
[ ] No hover-dependent information (hover doesn't exist on mobile)
[ ] Forms single-column layout
[ ] Date pickers, dropdowns, dialogs work on touch
```

**Tablet (640px–1024px):**
```
[ ] Sidebar visible but narrowed or collapsible
[ ] Two-column grid for KPI cards
[ ] Tables show key columns, secondary columns hidden via column visibility toggle
[ ] Modals sized correctly (not 100vw on tablet)
```

**Large screen (≥ 1440px):**
```
[ ] Max-width container prevents overly wide content (max-w-7xl or max-w-screen-xl)
[ ] Dashboard uses wider grid (4-column KPI cards)
[ ] Multi-panel layouts (main + context panel) used when space allows
[ ] No massive empty whitespace on sides of content
```

**Multi-monitor / wide viewport:**
```
[ ] Side panels (inspector, detail panel) open alongside main content — not overlay
[ ] Content columns have max-width caps (not full viewport width)
[ ] Dense mode available for power users who prefer more data per screen
```

---

## Phase 8 — Accessibility Audit (WCAG AA)

### 8.1 ARIA live regions (critical for ERP dynamic data)

Every dynamic update must announce itself to screenreaders:

```tsx
// Search result count
<p aria-live="polite" aria-atomic="true" className="sr-only">
  {count} results for "{query}"
</p>

// Error feedback
<div aria-live="assertive" role="alert">
  {errorMessage}
</div>

// Loading state
<div aria-busy={isLoading} aria-label="Dashboard data loading">
  {isLoading ? <Skeleton /> : <Content />}
</div>
```

Checklist:
```
[ ] Search dialogs announce result count via aria-live="polite"
[ ] Error states use role="alert" (assertive by default)
[ ] Table filter changes announce updated row count
[ ] Toast/notification uses role="status" or role="alert"
[ ] Loading spinners have aria-busy + descriptive aria-label
[ ] Data tables with live filtering announce row count changes
```

### 8.2 Chart and data visualization accessibility

```tsx
// ❌ Raw recharts — invisible to screenreaders
<ResponsiveContainer width="100%" height={200}>
  <AreaChart data={data}>...</AreaChart>
</ResponsiveContainer>

// ✅ Accessible chart
<figure aria-label="Monthly revenue trend, January to June">
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart data={data} aria-hidden="true">...</AreaChart>
  </ResponsiveContainer>
  <figcaption className="sr-only">
    Revenue grew from $3.2M in January to $4.8M in June, a 50% increase.
  </figcaption>
</figure>

// KPI sparkline pattern
<div
  aria-label={`${metric.label} trend: ${metric.trendDescription}`}
  role="img"
>
  <SparklineChart data={metric.series} aria-hidden="true" />
</div>
```

Checklist:
```
[ ] Every ResponsiveContainer wrapped in <figure aria-label="...">
[ ] recharts SVG elements have aria-hidden="true"
[ ] figcaption describes the data story (not just "Revenue chart")
[ ] Tooltip content announced via aria-live for keyboard users
[ ] Color is not the only differentiator in charts (add patterns or labels)
[ ] Data tables provide an alternative view to charts where possible
```

### 8.3 Focus management

```
[ ] Dialog/Sheet close returns focus to the trigger element
[ ] DropdownMenu: Escape closes and returns focus to trigger
[ ] Combobox: announces number of options with aria-live
[ ] Modal focus trap: focus does not escape to page body
[ ] Page navigation: focus reset to main content landmark on route change
[ ] No focus trap on non-modal overlays (tooltips, popovers)
```

```tsx
// Return focus to trigger on Dialog close
const triggerRef = useRef<HTMLButtonElement>(null);

<Dialog onOpenChange={(open) => {
  if (!open) triggerRef.current?.focus();
}}>
  <DialogTrigger ref={triggerRef} asChild>
    <Button intent="quiet" emphasis="ghost">Open</Button>
  </DialogTrigger>
</Dialog>
```

### 8.4 Semantic HTML and ARIA

```
[ ] <button> for actions, <a> for navigation — no div onClick
[ ] Heading hierarchy: one <h1> per page, logical h2→h3→h4 nesting
[ ] <table> with <thead>, <tbody>, <th scope="col"> for data tables
[ ] <form> with fieldset/legend for related form groups
[ ] <nav> with aria-label for every navigation landmark
[ ] <main> present and unique per page
[ ] Skip-to-content link at AppShell top
[ ] Images: meaningful alt text (not filename), decorative images alt=""
[ ] Icon-only buttons: aria-label describing the action
[ ] Status badges: sufficient color contrast + text (not color alone)
```

### 8.5 Keyboard navigation completeness

```
[ ] Tab order follows visual/logical reading order
[ ] No tabIndex > 0
[ ] Click-only divs have role="button" + onKeyDown (Enter/Space)
[ ] Drag handles in dashboard edit mode have keyboard alternative
[ ] All dropdowns/comboboxes navigable with arrow keys
[ ] All modals closeable with Escape
[ ] Table row actions accessible without mouse
[ ] Command palette accessible from anywhere via keyboard shortcut
[ ] Date picker navigable with keyboard (arrow keys, month/year navigation)
```

### 8.6 Color and contrast (WCAG AA / APCA)

```
[ ] Body text: ≥ 7:1 contrast ratio (AAA preferred for ERP readability)
[ ] UI labels: ≥ 4.5:1 contrast ratio (WCAG AA minimum)
[ ] Large text (≥ 18px): ≥ 3:1 contrast ratio
[ ] Muted / secondary text: ≥ 4.5:1 (check var(--muted-foreground))
[ ] Focus ring visible against all backgrounds
[ ] Status indicators use both color AND icon/text (not color alone)
[ ] Dark mode contrast equivalent to light mode
[ ] Link text distinguishable from surrounding body text without relying on color
```

**APCA targets:**
- Body text on canvas: Lc ≥ 60
- UI labels: Lc ≥ 75
- Placeholder text: Lc ≥ 30

### 8.7 Motion and prefers-reduced-motion

```
[ ] Every CSS transition has a prefers-reduced-motion override:
    @media (prefers-reduced-motion: reduce) { transition: none; }
[ ] Every Framer Motion animation has a reducedMotion prop or conditional
[ ] No animation on high-frequency interactions (typing, toggling, scrolling)
[ ] Loading spinners (continuous motion) have static fallback
[ ] Page transition animations honoring prefers-reduced-motion
[ ] Exit animation ~75% of entrance duration (prevent over-motion)
```

### 8.8 Forms and inputs

```
[ ] Every input has an associated <label> via htmlFor/id or aria-label
[ ] Required fields marked with aria-required="true" AND visual indicator
[ ] Error messages associated with their input via aria-describedby
[ ] Error messages use role="alert" for immediate announcement
[ ] Field descriptions associated via aria-describedby
[ ] No placeholder-only labels (placeholder disappears on input — not a label)
[ ] Submit button disabled state uses aria-disabled + clear visual treatment
[ ] Validation on blur, not only on submit
[ ] Success feedback: positive role="status" message after form submit
```
