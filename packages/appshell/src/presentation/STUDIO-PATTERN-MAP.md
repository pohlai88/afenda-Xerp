# Studio Pattern Map

> **Canonical path (2026-06-28):** `packages/appshell/src/presentation/STUDIO-PATTERN-MAP.md`  
> Governed Afenda blocks: `packages/appshell/src/presentation/blocks/` · MCP product: `@afenda/shadcn-studio` · Bridge: `packages/appshell/src/shadcn-studio-bridge/` · Legacy `packages/appshell/src/shadcn-studio/` **deleted** (B42h)

> **Purpose:** Translate raw shadcn/studio MCP Tailwind output into governed
> `app-shell-studio-*` production classes. Use this lookup **before** inventing
> a new CSS selector. If a pattern already exists here, map to it — only write
> new CSS when a pattern is reusable across ≥2 blocks.
>
> **Canonical CSS file:** `packages/appshell/src/styles/afenda-appshell-studio.css`
>
> **Workflow:**
> 1. MCP install → `packages/ui/src/components/shadcn-studio/` (staging/reference)
> 2. Apply the **3-question decision filter** to every `className`:
>    - **Q1** — `@afenda/ui` governed primitive? → strip `className`; use governed props
>    - **Q2** — visual/semantic on plain HTML? → map via table below (or add studio CSS if ≥2 blocks)
>    - **Q3** — layout/structural on plain HTML wrapper? → allowed as-is (`grid`, `flex`, `col-span`)
> 3. If Q2 and no match: add to studio CSS (reusable), or use Afenda semantic Tailwind (`text-success` not `green-600`)
> 4. Strip `className` from all `@afenda/ui` governed primitives (Q1)
> 5. Move to `packages/appshell/src/presentation/blocks/` — zero raw Tailwind in production block TSX
>
> Canonical agent authority: [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../../../.cursor/skills/afenda-shadcn-components/SKILL.md)

---

## Deprecated class prefixes (enforced)

The following prefixes were removed from CSS during Foundation phase 32 Slice 3.9 extraction.
They must **not** appear in `className` on production block TSX under
`packages/appshell/src/presentation/blocks/`:

| Deprecated prefix | Replacement namespace |
|---|---|
| `app-shell-dashboard-kpi-` | `app-shell-studio-metric-*` / `app-shell-studio-icon-chip*` |
| `app-shell-dashboard-sparkline-` | `app-shell-studio-sparkline-*` |
| `app-shell-dashboard-revenue-` | `app-shell-studio-revenue-*` |
| `app-shell-dashboard-invoice-` | `app-shell-studio-invoice-*` |
| `app-shell-activity-` | `app-shell-studio-activity-*` |

Enforced by: `packages/appshell/src/__tests__/studio-legacy-class-guard.test.ts`

---

## Metric card pattern (KPI stats)

Used by: `AppShellDashboardKpiStat`, `SystemAdminReadinessGateMetrics`

| MCP Tailwind pattern | Production class | Notes |
|---|---|---|
| `<article>` root with full height, card chrome | `.app-shell-studio-metric-card` | Root article wrapper |
| `bg-primary/6 border-primary/28` emphasis tint | `data-emphasis="primary"` on root | Data attribute, CSS handles tinting |
| `flex flex-col gap-4 justify-between min-h-[8.5rem] p-5` | `.app-shell-studio-metric__body` | Inner content column |
| `flex gap-2 items-start justify-between` (header row) | `.app-shell-studio-metric__header` | Title + icon row |
| `flex flex-col gap-[var(--density-field-gap)]` | `.app-shell-studio-metric__heading` | Title + caption stack |
| `text-sm font-medium text-muted-foreground uppercase tracking-wider` | `.app-shell-studio-metric__title` | KPI label |
| `text-xs tabular-nums text-muted-foreground` | `.app-shell-studio-metric__caption` | Period badge |
| `flex shrink-0 items-center justify-center w-9 h-9 bg-muted/72 border border-border/55 rounded-md` | `.app-shell-studio-icon-chip` | Icon container |
| Icon inside chip, `w-4 h-4 text-muted-foreground` | `.app-shell-studio-icon-chip__icon` | Pass as `className` prop on icon |
| `<p>` wrapper around value (margin reset) | `.app-shell-studio-metric__value-group` | `margin: 0` wrapper |
| `flex gap-2 items-center` (value + secondary) | `.app-shell-studio-metric__value-row` | Flex row for value + chip |
| `text-2xl font-semibold tabular-nums leading-tight tracking-tight` | `.app-shell-studio-metric__value` | Large KPI number |
| `flex flex-wrap gap-1 items-baseline` (footnote `<p>`) | `.app-shell-studio-metric__footnote` | Change% + comparison |
| `text-sm tabular-nums text-muted-foreground` (delta) | `.app-shell-studio-metric__change` | "+12.4%", "-4.5%" |
| `text-sm text-muted-foreground/70` (comparison) | `.app-shell-studio-metric__comparison` | "vs last week" |

### Readiness gate metric variant

Used by: `SystemAdminReadinessGateMetrics` (composes studio metric card + block-local readiness hooks)

| Element | Production class | Notes |
|---|---|---|
| Root article | `.app-shell-dashboard-widget .app-shell-studio-metric-card .app-shell-readiness-gate-widget` | Shared widget chrome + studio metric + readiness hooks |
| Live status | `data-live-status="pass" \| "fail" \| "skipped"` | Drives status dot colour in `afenda-appshell.css` |
| Status value row | `.app-shell-readiness-gate-status-row` + `.app-shell-readiness-gate-status-dot` | Block-local; wraps `.app-shell-studio-metric__value` |
| Footnote | `.app-shell-studio-metric__footnote` + `.app-shell-studio-metric__comparison` only | No `.app-shell-studio-metric__change` (no delta %) |

Legacy mapping applied in Slice 3.9A:

| Old deleted class | New canonical class |
|---|---|
| `app-shell-dashboard-kpi-widget` | `app-shell-studio-metric-card` |
| `app-shell-dashboard-kpi-body` | `app-shell-studio-metric__body` |
| `app-shell-dashboard-kpi-header` | `app-shell-studio-metric__header` |
| `app-shell-dashboard-kpi-heading` | `app-shell-studio-metric__heading` |
| `app-shell-dashboard-kpi-title` | `app-shell-studio-metric__title` |
| `app-shell-dashboard-kpi-caption` | `app-shell-studio-metric__caption` |
| `app-shell-dashboard-kpi-icon-chip` | `app-shell-studio-icon-chip` |
| `app-shell-dashboard-kpi-icon` | `app-shell-studio-icon-chip__icon` |
| `app-shell-dashboard-kpi-metric` | `app-shell-studio-metric__value-group` |
| `app-shell-dashboard-kpi-value` | `app-shell-studio-metric__value` |
| `app-shell-dashboard-kpi-footnote` | `app-shell-studio-metric__footnote` |
| `app-shell-dashboard-kpi-comparison` | `app-shell-studio-metric__comparison` |

---

## Sparkline card pattern

Used by: `AppShellDashboardSparklineStat`

| MCP Tailwind pattern | Production class | Notes |
|---|---|---|
| `<article>` root, full height | `.app-shell-studio-sparkline-card` | Root article wrapper |
| `flex gap-4 items-center justify-between p-5` | `.app-shell-studio-sparkline__body` | Horizontal copy + chart layout |
| `flex flex-1 flex-col gap-6 min-w-0` | `.app-shell-studio-sparkline__copy` | Left column |
| `flex flex-col gap-1` (label + amount) | `.app-shell-studio-sparkline__meta` | Meta column |
| `text-sm text-muted-foreground` (title) | `.app-shell-studio-sparkline__label` | Metric title |
| `text-3xl font-semibold tabular-nums leading-display tracking-tight` | `.app-shell-studio-sparkline__amount` | Hero currency number |
| `flex flex-wrap gap-3 items-center` (change row) | `.app-shell-studio-sparkline__change-row` | Delta + trend + comparison |
| `text-sm tabular-nums text-muted-foreground` (delta) | `.app-shell-studio-sparkline__change` | Period delta |
| `inline-flex items-center` (trend icon) | `.app-shell-studio-sparkline__trend` | TrendIndicator wrapper |
| `text-sm text-muted-foreground` (comparison) | `.app-shell-studio-sparkline__comparison` | "vs last month" |
| `text-xs text-muted-foreground` (insights) | `.app-shell-studio-sparkline__insights` | "12 points · peak …" |
| `flex-1 w-full max-w-[17.5rem] min-h-[6.625rem] max-h-[6.625rem]` (chart div) | `.app-shell-studio-sparkline__chart-frame` | Chart container |
| `--revenue` modifier | `.app-shell-studio-sparkline__chart-frame--revenue` | Semantic hook, no CSS rules |
| `--expense` modifier | `.app-shell-studio-sparkline__chart-frame--expense` | Semantic hook, no CSS rules |
| `flex items-center justify-center w-full h-full text-xs text-muted` | `.app-shell-studio-sparkline__empty-chart` | No-data placeholder |

---

## Shared icon chip

Used by: KPI stat, any card with a contextual icon

| MCP Tailwind pattern | Production class |
|---|---|
| `flex shrink-0 items-center justify-center w-9 h-9 rounded-md bg-muted/72 border border-border/55` | `.app-shell-studio-icon-chip` |
| Icon inside chip | `.app-shell-studio-icon-chip__icon` (pass as `className` on SVG) |
| Primary tint (emphasis="primary" context) | Inherits from `.app-shell-studio-metric-card[data-emphasis="primary"] .app-shell-studio-icon-chip` |

---

## Common token substitutions

| Raw Tailwind class | CSS variable to use in studio CSS |
|---|---|
| `text-muted-foreground` | `var(--app-shell-studio-text-muted)` |
| `text-muted-foreground/70` | `var(--app-shell-studio-text-subtle)` |
| `bg-card` | `var(--app-shell-studio-surface-card)` |
| `bg-muted` | `var(--app-shell-studio-surface-muted)` |
| `rounded-lg` | `var(--app-shell-studio-radius-widget)` |
| `rounded-md` (control) | `var(--app-shell-studio-radius-control)` |
| Trend positive color | `var(--app-shell-studio-trend-up)` |
| Trend negative color | `var(--app-shell-studio-trend-down)` |
| `p-5` (card padding) | `var(--app-shell-studio-padding-card)` |
| Section gap | `var(--app-shell-studio-gap-section)` |

### Chart token substitutions

Used by Recharts chart config props and axis tick fill values inside statistics blocks.
Do **not** use raw design-system tokens (e.g. `var(--primary)`) in block-level chart config.

| Raw token in Recharts prop | Bridge var |
|---|---|
| `var(--primary)` in bar/area fill (highlight day) | `var(--app-shell-studio-chart-primary)` |
| `color-mix(in oklab, var(--primary) 20%, transparent)` (muted fill) | `var(--app-shell-studio-chart-primary-muted)` |
| `var(--muted-foreground)` in `XAxis` tick fill | `var(--app-shell-studio-text-muted)` |
| `var(--border)` in `CartesianGrid` stroke | `var(--app-shell-studio-border-grid)` |
| `--series-swatch-color` (inline CSS var on `.app-shell-statistics-trend-swatch`) | Block-local — no global mapping; set via `style` prop on the element |

---

---

## Revenue chart pattern

Used by: `AppShellDashboardRevenueChart`

| MCP Tailwind pattern | Production class | Notes |
|---|---|---|
| Root widget wrapper | `.app-shell-studio-revenue-widget` | Full-width chart card |
| 3fr/2fr responsive grid | `.app-shell-studio-revenue-layout` | Primary + secondary columns |
| Primary column chrome | `.app-shell-studio-revenue-primary` | Left bar chart column |
| Bar chart frame | `.app-shell-studio-revenue-bar-frame` | Fixed min-height chart area |
| Secondary column stack | `.app-shell-studio-revenue-secondary` | Growth panel + year summaries |
| Hero amount row | `.app-shell-studio-revenue-hero-amount` | Tabular-nums hero value |
| YoY delta | `.app-shell-studio-revenue-yoy-change` | Tabular-nums comparison |
| Legend row | `.app-shell-studio-revenue-legend` | Current vs prior swatches |

Legacy mapping (Slice CSS bridge hardening):

| Old deleted class prefix | New canonical prefix |
|---|---|
| `app-shell-dashboard-revenue-` | `app-shell-studio-revenue-` |

---

## Invoice table pattern

Used by: `AppShellDashboardInvoiceTable`, `app-shell-dashboard-invoice-table.columns`

| MCP Tailwind pattern | Production class | Notes |
|---|---|---|
| Root widget | `.app-shell-studio-invoice-widget` | Full-width table card |
| Header row | `.app-shell-studio-invoice-header` | Title + metrics |
| Toolbar | `.app-shell-studio-invoice-toolbar` | Filters + search |
| Table scroll region | `.app-shell-studio-invoice-table-scroll` | Horizontal overflow |
| Amount cells | `.app-shell-studio-invoice-amount` | Tabular-nums currency |
| Status dot | `.app-shell-studio-invoice-status-dot` | `[data-status]` driven |
| Row actions | `.app-shell-studio-invoice-actions` | Icon button cluster |

Legacy mapping:

| Old deleted class prefix | New canonical prefix |
|---|---|
| `app-shell-dashboard-invoice-` | `app-shell-studio-invoice-` |

---

## Activity feed pattern

Used by: `AppShellActivityFeed`, `AppShellActivityDialog`

| MCP Tailwind pattern | Production class | Notes |
|---|---|---|
| Sheet panel root | `.app-shell-studio-activity-panel` | Scroll container in sheet |
| Feed scroll body | `.app-shell-studio-activity-feed` | Overflow-y auto |
| Feed list | `.app-shell-studio-activity-feed-list` | Unstyled list |
| Row layout | `.app-shell-studio-activity-row` | Avatar + summary |
| Timestamp | `.app-shell-studio-activity-time` | Tabular-nums |
| Reply composer | `.app-shell-studio-activity-reply-group` | Input + attach |
| File attachment card | `.app-shell-studio-activity-file-card` | Muted bordered link |

Legacy mapping:

| Old deleted class prefix | New canonical prefix |
|---|---|
| `app-shell-activity-` | `app-shell-studio-activity-` |

---

## §G — Statistics metric card pattern

Used by: `StatisticsRevenueCard`, `StatisticsActivityCard`, `StatisticsLeadsCard`, `StatisticsProfileTrafficCard`

> **Namespace:** `app-shell-statistics-metric-*`
> **CSS source:** `afenda-appshell.css` (statistics-component-10 block)
> **Distinction from KPI metric cards:** KPI cards use `app-shell-studio-metric-*` (studio layer); statistics cards use this block-local namespace. The two co-exist without conflict.

| MCP Tailwind pattern | Production class | Notes |
|---|---|---|
| `<section>` page wrapper | `.app-shell-statistics-metric-section` | Max-width centred container |
| 2-col responsive grid | `.app-shell-statistics-metric-grid` | 1-col → 2-col at `lg` breakpoint |
| `<article>` card root | `.app-shell-statistics-metric-card` | Full-height card wrapper |
| Horizontal copy + chart layout | `.app-shell-statistics-metric-panel` | Column on mobile → row at `sm` |
| Copy column (label, value) | `.app-shell-statistics-metric-copy` | Fixed-width left column |
| Title + caption stack | `.app-shell-statistics-metric-heading-stack` | Column flex, `gap-xs` |
| Metric label | `.app-shell-statistics-metric-title` | `body` size, `heading-sm` weight |
| Period caption | `.app-shell-statistics-metric-caption` | `body-sm` muted |
| Value + change stack | `.app-shell-statistics-metric-value-stack` | Column flex, `gap-xs` |
| Metric value | `.app-shell-statistics-metric-amount` | `title` size, tabular-nums |
| Hero-scale value modifier | `.app-shell-statistics-metric-amount-hero` | `display` size, line-height-display |
| Delta percentage | `.app-shell-statistics-metric-change` | `body-xs` muted tabular-nums |
| Chart container (base) | `.app-shell-statistics-metric-chart` | `flex: 1 1 auto`, min-height 7rem |
| Vertical bar chart modifier | `.app-shell-statistics-metric-chart-bars` | Fixed height 8.5rem |
| Horizontal bar chart modifier | `.app-shell-statistics-metric-chart-bars-horizontal` | `max-width: 12rem`, aligned centre at `sm` |
| Area chart modifier | `.app-shell-statistics-metric-chart-area` | Fixed height 8.5rem |

---

## §H — Statistics trend card pattern

Used by: `StatisticsLineTrendsCard`

> **Namespace:** `app-shell-statistics-trend-*`
> **CSS source:** `afenda-appshell.css` (statistics-component-21 block)

| MCP Tailwind pattern | Production class | Notes |
|---|---|---|
| `<section>` page wrapper | `.app-shell-statistics-trend-section` | Max-width centred container |
| 1/2/3-col responsive grid | `.app-shell-statistics-trend-grid` | 1 → 2 at `sm` → 3 at `lg` |
| `<article>` card root | `.app-shell-statistics-trend-card` | Full-height card wrapper |
| `<CardHeader>` padded row | `.app-shell-statistics-trend-header` | Top + sides padding only |
| Card title text | `.app-shell-statistics-trend-title` | `body` size, `heading-sm` weight |
| Column/row split layout | `.app-shell-statistics-trend-layout` | Column on mobile → row at `sm` |
| Series legend container | `.app-shell-statistics-trend-metrics` | `justify-between` on mobile → column at `sm` |
| Series legend entry | `.app-shell-statistics-trend-metric` | Swatch + copy in flex row |
| Swatch indicator | `.app-shell-statistics-trend-swatch` | 4px × 36px bar; colour via `style="--series-swatch-color: …"` |
| Legend copy column | `.app-shell-statistics-trend-metric-copy` | Column flex, `gap-xs` |
| Legend label | `.app-shell-statistics-trend-metric-label` | `body-xs` muted |
| Legend value | `.app-shell-statistics-trend-metric-value` | `title` size, tabular-nums |
| Chart container | `.app-shell-statistics-trend-chart` | `flex: 1`, height 7rem |

---

## §I — Module workspace chrome

Used by: `AppShellModuleWorkspaceChrome`

> **Namespace:** `app-shell-module-workspace-*` / `app-shell-module-tab-*` / `app-shell-module-breadcrumb`
> **CSS source:** `afenda-appshell.css` (module workspace chrome block)
> **Integration:** consumes `ManifestModuleId` → `resolveManifestModuleNavIcon` → `resolveAppShellNavIcon` for icon

| Element | Production class | Notes |
|---|---|---|
| `<header>` wrapper | `.app-shell-module-workspace-header` | Flex column; padded; bottom border |
| Title row | `.app-shell-module-workspace-title-row` | Icon + heading + actions in flex row |
| Module icon container | `.app-shell-module-workspace-icon` | 2rem square, muted colour |
| `<h1>` heading | `.app-shell-module-workspace-heading` | `title` size, truncates on overflow |
| Action slot | `.app-shell-module-workspace-actions` | Right-aligned flex row; render only when prop is set |
| `<nav>` breadcrumb | `.app-shell-module-breadcrumb` | `aria-label="Breadcrumb"`; `<ol>` list with `/` separators |
| `<nav>` tab bar | `.app-shell-module-tab-bar` | `aria-label="Module navigation"`; overflow-x scroll |
| Tab link | `.app-shell-module-tab-item` | `aria-current="page"` + `data-active="true"` when active; underline indicator |
| Content body | `.app-shell-module-workspace-body` | Slot for page content |

---

## §J — Account settings pattern

Used by: `AppShellAccountSettings01`–`07`

> **Namespace:** `app-shell-studio-account-settings-*` / `app-shell-studio-account-settings-01__*`
> **CSS source:** `afenda-appshell-studio.css` Section J

| Element | Production class | Notes |
|---|---|---|
| Block root (02–07) | `.app-shell-studio-account-settings` | Column flex with section gap |
| Section card | `.app-shell-studio-account-settings__section` | Card chrome for each settings group |
| Lead copy | `.app-shell-studio-account-settings__lead` | Muted scaffold description |
| Block root (01) | `.app-shell-studio-account-settings-01` | General tab variant |
| Section (01) | `.app-shell-studio-account-settings-01__section` | Same card chrome |
| Danger section (01) | `.app-shell-studio-account-settings-01__section--danger` | Destructive border tint |
| Block root (06) | `.app-shell-studio-account-settings-06` | Security tab column layout |
| Block root (05) | `.app-shell-studio-account-settings-05` | Members tab column layout |
| Section row (06) | `.app-shell-studio-account-settings-06__row` | 1/3 + 2/3 responsive grid |
| Session list (06) | `.app-shell-studio-account-settings-06__sessions-list` | Bordered session stack |
| Block root (02 notifications) | `.app-shell-studio-account-settings-02` | Column stack + notification table |
| Save row (02–07) | `.app-shell-studio-account-settings-02__save-row` | Right-aligned save actions |
| Integration grid (04) | `.app-shell-studio-account-settings-04__grid` | Responsive integration cards |
| Members header (05) | `.app-shell-studio-account-settings-05__header` | Title + invite slot row |
| Members title (05) | `.app-shell-studio-account-settings-05__title` | Section heading |
| Members copy (05) | `.app-shell-studio-account-settings-05__description` | Muted body / email line |
| Member name (05) | `.app-shell-studio-account-settings-05__item-title` | Row primary label |
| Billing usage row (07) | `.app-shell-studio-account-settings-07__usage-row` | Plan/usage line items |

---

## §K — application-shell-02 system-admin chrome

Used by: `AppShellApplicationShell02SystemAdminChrome`

> **Namespace:** `app-shell-studio-application-shell-02-*`
> **CSS source:** `afenda-appshell-studio.css` Section K
> **Authority:** Adapts shell-02 nav grouping; does not replace Foundation phase 06 `AppShell`.

| Element | Production class | Notes |
|---|---|---|
| Chrome root | `.app-shell-studio-application-shell-02-chrome` | Profile + nav column |
| Profile row | `.app-shell-studio-application-shell-02-profile` | Avatar + identity copy |
| Profile name | `.app-shell-studio-application-shell-02-profile-name` | Display name from identity |
| Profile email | `.app-shell-studio-application-shell-02-profile-email` | Optional email line |
| Workspace label | `.app-shell-studio-application-shell-02-profile-workspace` | From `OperatingContext` |
| Nav list | `.app-shell-studio-application-shell-02-nav-list` | Horizontal flex wrap |
| Nav link | `.app-shell-studio-application-shell-02-nav-link` | `data-active="true"` when current |

---

## Patterns NOT yet in the studio layer (block-local geometry)

These stay in `afenda-appshell.css` until they appear in ≥2 blocks:

| Pattern | Block owner | Reason still local |
|---|---|---|
| Module earnings ranked list | `app-shell-dashboard-module-earnings` | Unique row structure |
| Regional sales chart combo | `app-shell-dashboard-regional-sales` | Unique |
| Payment history utilization row | `app-shell-dashboard-payment-history` | Unique |
| Recent transactions summary strip | `app-shell-dashboard-recent-transactions` | Unique |
| Shell chrome (header/sidebar/footer) | Shell chrome | Non-studio patterns |

---

## Adding a new studio pattern

1. Confirm the pattern appears in ≥2 blocks (or will).
2. Add CSS class to `afenda-appshell-studio.css` under the correct section (B or C).
3. Add a bridge var alias in Section A if a new token semantic is needed.
4. Add a row to this document under the correct pattern family.
5. Update any blocks that should use it.
6. Run `pnpm check:css-governance` and `pnpm --filter @afenda/appshell test:run`.
