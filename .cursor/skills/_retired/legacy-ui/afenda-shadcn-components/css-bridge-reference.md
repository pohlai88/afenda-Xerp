# CSS Bridge Reference — Afenda ↔ shadcn ↔ Studio

> All values verified against actual source files (2026-06-25):
> - `packages/design-system/scripts/generate-tokens-css.ts` (Part B, C)
> - `packages/appshell/src/styles/afenda-appshell.css`
> - `packages/appshell/src/styles/afenda-appshell-studio.css`
>
> **Do not redefine `--afenda-*` outside `@afenda/design-system`.**
> **Do not redefine `--app-shell-studio-*` outside `afenda-appshell-studio.css`.**

---

## The 3-layer chain

Studio blocks never consume `--afenda-*` directly. The chain is:

```
@afenda/design-system (Part A)    --afenda-* tokens (source)
         ↓ Part B
         --card, --primary, --border  (shadcn shorthand)
         ↓ appshell
         --app-shell-text-*, --app-shell-radius-*  (shell geometry)
         ↓ appshell-studio
         --app-shell-studio-*  (studio block bridge)
         ↓ class CSS
         .app-shell-studio-metric-*, .app-shell-studio-sparkline-*, etc.
```

Changing one `--afenda-*` token cascades through all four layers automatically.
**Shortcutting to `--afenda-*` inside studio CSS or block TSX breaks this chain.**

---

## Part B — `--afenda-*` → shadcn shorthand (design-system authority)

Source: `generate-tokens-css.ts` `:root { }` block under "Part B".

| shadcn var | Actual `--afenda-*` token | Category |
|-----------|--------------------------|---------|
| `--background` | `var(--afenda-semantic-surface-canvas)` | Surface |
| `--foreground` | `var(--afenda-semantic-text-primary)` | Text |
| `--card` | `var(--afenda-semantic-surface-card)` | Surface |
| `--card-foreground` | `var(--afenda-semantic-text-primary)` | Text |
| `--popover` | `var(--afenda-semantic-surface-overlay)` | Surface |
| `--popover-foreground` | `var(--afenda-semantic-text-primary)` | Text |
| `--primary` | `var(--afenda-semantic-accent-bg)` | Brand |
| `--primary-foreground` | `var(--afenda-semantic-accent-text)` | Brand |
| `--secondary` | `var(--afenda-color-secondary)` | Brand |
| `--secondary-foreground` | `var(--afenda-color-secondary-foreground)` | Brand |
| `--muted` | `var(--afenda-semantic-surface-muted)` | Surface |
| `--muted-foreground` | `var(--afenda-semantic-text-secondary)` | Text |
| `--accent` | `var(--afenda-color-accent)` | Brand |
| `--accent-foreground` | `var(--afenda-color-accent-foreground)` | Brand |
| `--destructive` | `var(--afenda-color-destructive)` | Risk |
| `--destructive-foreground` | `var(--afenda-color-destructive-foreground)` | Risk |
| `--success` | `var(--afenda-status-tone-success-solid)` | Feedback |
| `--success-foreground` | `var(--afenda-status-tone-success-solid-foreground)` | Feedback |
| `--warning` | `var(--afenda-status-tone-warning-solid)` | Feedback |
| `--warning-foreground` | `var(--afenda-status-tone-warning-solid-foreground)` | Feedback |
| `--info` | `var(--afenda-status-tone-info-solid)` | Feedback |
| `--info-foreground` | `var(--afenda-status-tone-info-solid-foreground)` | Feedback |
| `--border` | `var(--afenda-semantic-border-default)` | Chrome |
| `--input` | `var(--afenda-color-input)` | Chrome |
| `--ring` | `var(--afenda-semantic-border-focus)` | Chrome |
| `--radius` | `var(--afenda-radius-base)` | Shape |
| `--chart-1..8` | `var(--afenda-color-chart-1..8)` | Charts |
| `--sidebar` | `var(--afenda-color-sidebar-background)` | Sidebar |
| `--sidebar-primary` | `var(--afenda-color-sidebar-primary)` | Sidebar |
| `--sidebar-border` | `var(--afenda-color-sidebar-border)` | Sidebar |
| `--font-sans` | `var(--afenda-font-sans)` | Typography |
| `--font-mono` | `var(--afenda-font-mono)` | Typography |
| `--font-heading` | `var(--afenda-font-heading)` | Typography |

---

## Part C — Tailwind `@theme inline` (utility class bridge)

Source: `generate-tokens-css.ts` `@theme inline { }` block under "Part C".

Enables `bg-primary`, `text-muted-foreground`, `border-border`, `text-destructive`, etc.

| Tailwind utility prefix | Maps to shadcn var |
|------------------------|-------------------|
| `bg-background` / `text-background` | `var(--background)` |
| `bg-primary` / `text-primary` | `var(--primary)` |
| `bg-muted` | `var(--muted)` |
| `text-muted-foreground` | `var(--muted-foreground)` |
| `border-border` | `var(--border)` |
| `bg-destructive` / `text-destructive` | `var(--destructive)` |
| `bg-success` / `text-success` | `var(--success)` |
| `text-chart-1..8` | `var(--chart-1..8)` |
| `shadow-sm / shadow-md / shadow-lg` | `var(--afenda-shadow-*)` |
| `z-sticky / z-modal / z-overlay` | `var(--afenda-z-index-*)` |
| `duration-fast / duration-normal` | `var(--afenda-motion-duration-*)` |
| `ease-standard / ease-emphasized` | `var(--afenda-motion-easing-*)` |
| `radius-sm / radius-md / radius-lg` | `calc(var(--radius) * scale)` |

---

## Layer 2 — `@afenda/appshell` shell bridge (`--app-shell-*`)

Source: `afenda-appshell.css` `.app-shell-root { }` block.

| Shell var | Actual value | Note |
|-----------|-------------|------|
| `--app-shell-header-strip-height` | `7.25rem` | Fixed geometry — not a token |
| `--app-shell-z-base` | `var(--z-index-base)` | Use `--z-index-*` (Part C), not `--afenda-z-index-*` directly |
| `--app-shell-z-header` | `var(--z-index-sticky)` | |
| `--app-shell-z-sidebar` | `var(--z-index-docked)` | NOT `docked` = NOT `fixed` |
| `--app-shell-z-overlay` | `var(--z-index-overlay)` | |
| `--app-shell-z-modal` | `var(--z-index-modal)` | Property is `z-modal`, not `z-dialog` |
| `--app-shell-type-caption` | `var(--afenda-semantic-type-caption)` | |
| `--app-shell-type-body` | `var(--afenda-semantic-type-body)` | |
| `--app-shell-type-title` | `var(--afenda-semantic-type-title)` | |
| `--app-shell-type-kpi` | `var(--afenda-typography-font-size-heading-lg)` | |
| `--app-shell-text-muted` | `var(--afenda-semantic-text-secondary)` | Direct afenda at shell level |
| `--app-shell-text-subtle` | `var(--afenda-semantic-text-tertiary)` | |
| `--app-shell-text-trend-positive` | `var(--afenda-chart-trend-positive)` | |
| `--app-shell-text-trend-negative` | `var(--afenda-chart-trend-negative)` | |
| `--app-shell-gap-xs..2xl` | `var(--afenda-spacing-1..8)` | xs=1, sm=2, md=3, lg=4, xl=6, 2xl=8 |
| `--app-shell-padding-card` | `var(--afenda-spacing-5)` | |
| `--app-shell-density-gap` | `var(--afenda-density-gap, …)` | Density-aware via fallback |
| `--app-shell-radius-card` | `var(--afenda-semantic-radius-card)` | |
| `--app-shell-radius-control` | `var(--afenda-semantic-radius-control)` | |
| `--app-shell-shadow-raised` | `var(--afenda-semantic-elevation-raised)` | |
| `--app-shell-duration-fast` | `var(--duration-fast)` | Part C shorthand |
| `--app-shell-ease-standard` | `var(--ease-standard)` | Part C shorthand |

---

## Layer 3 — Studio block bridge (`--app-shell-studio-*`)

Source: `afenda-appshell-studio.css` `.app-shell-root { }` Section A.
All vars consume shadcn shorthand or shell vars — **never `--afenda-*` directly**.

| Studio var | Actual value | Bridges through |
|-----------|-------------|----------------|
| `--app-shell-studio-surface-card` | `var(--card)` | shadcn |
| `--app-shell-studio-surface-muted` | `var(--muted)` | shadcn |
| `--app-shell-studio-text-muted` | `var(--app-shell-text-muted)` | shell |
| `--app-shell-studio-text-subtle` | `var(--app-shell-text-subtle)` | shell |
| `--app-shell-studio-trend-up` | `var(--app-shell-text-trend-positive)` | shell |
| `--app-shell-studio-trend-down` | `var(--app-shell-text-trend-negative)` | shell |
| `--app-shell-studio-radius-widget` | `var(--app-shell-radius-card)` | shell |
| `--app-shell-studio-radius-control` | `var(--app-shell-radius-control)` | shell |
| `--app-shell-studio-gap-section` | `var(--app-shell-section-gap)` | shell |
| `--app-shell-studio-padding-card` | `var(--app-shell-padding-card)` | shell |
| `--app-shell-studio-chart-primary` | `var(--primary)` | shadcn |
| `--app-shell-studio-chart-primary-muted` | `color-mix(in oklab, var(--primary) 20%, transparent)` | shadcn |
| `--app-shell-studio-border-grid` | `var(--border)` | shadcn |

---

## Status tone mapping — raw Tailwind → Afenda semantic

The reference template (`_reference/`) uses raw Tailwind palette colors for status states.
When adapting any block from the reference, replace every raw color with the Afenda
semantic tone. **Never** copy `green-600`, `amber-600`, or `sky-600` into production TSX.

### Tailwind → Afenda token

| Template raw Tailwind | Semantic role | Afenda CSS var | Tailwind utility |
|-----------------------|--------------|----------------|-----------------|
| `text-green-600 dark:text-green-400` | Positive / success | `var(--success)` | `text-success` |
| `bg-green-600/10 dark:bg-green-400/10 text-green-600` | Success surface | `var(--success)` at /10 | `bg-success/10 text-success` |
| `text-amber-600 dark:text-amber-400` | Warning / pending | `var(--warning)` | `text-warning` |
| `bg-amber-600/10 dark:bg-amber-400/10 text-amber-600` | Warning surface | `var(--warning)` at /10 | `bg-warning/10 text-warning` |
| `text-sky-600 dark:text-sky-400` | Info / category | `var(--info)` | `text-info` |
| `bg-sky-600/10 dark:bg-sky-400/10 text-sky-600` | Info surface | `var(--info)` at /10 | `bg-info/10 text-info` |
| `text-destructive` / `bg-destructive/10` | Error / inactive | `var(--destructive)` | already semantic ✓ |
| `text-primary` / `bg-primary/10 text-primary` | Brand accent | `var(--primary)` | already semantic ✓ |

`--success`, `--warning`, `--info` are fully defined in Part B of the design-system bridge.

### Status badge pattern (template → Afenda)

Template raw (Foundation phase 04 violation in Afenda consumers):
```tsx
// ❌ Reference template pattern — do not copy into Afenda consumers
<Badge className={cn('rounded-sm border-none', {
  'bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400': status === 'active',
  'bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400': status === 'pending',
  'bg-destructive/10 text-destructive': status === 'inactive',
})} />
```

Afenda governed (zero className on `@afenda/ui` Badge):
```tsx
// ✅ Afenda consumer — governed tone prop
<Badge tone="success" emphasis="soft">Active</Badge>
<Badge tone="warning" emphasis="soft">Pending</Badge>
<Badge tone="danger"  emphasis="soft">Inactive</Badge>
```

### KPI icon avatar pattern (template → Afenda)

Template:
```tsx
// ❌ Reference pattern — className on Avatar/AvatarFallback
<AvatarFallback className={cn('bg-primary/10 text-primary size-9.5 shrink-0 rounded-sm [&>svg]:size-4.75', iconClassName)} />
// where iconClassName = 'bg-chart-2/10 text-chart-2'
```

Afenda governed block (use `.app-shell-studio-icon-chip`):
```tsx
// ✅ Afenda block — semantic class, no governed primitives here
<div className="app-shell-studio-icon-chip">
  <Icon className="app-shell-studio-icon-chip__icon" />
</div>
```

### `color-mix()` chart fill patterns

| Template pattern | Role | Afenda equivalent |
|-----------------|------|------------------|
| `color-mix(in oklab, var(--primary) 20%, transparent)` | Muted bar fill | `var(--app-shell-studio-chart-primary-muted)` |
| `color-mix(in oklab, var(--primary) 6%, var(--card))` | KPI tinted surface | `data-emphasis="primary"` on `.app-shell-studio-metric-card` |
| `color-mix(in oklab, var(--chart-N) 20%, transparent)` | Chart series muted | inline `color-mix` (no studio class yet — add if ≥2 blocks need it) |

---

## What flows automatically

These do not need manual mapping:

| Category | Why it flows |
|----------|-------------|
| All shadcn utility classes (`bg-primary`, `text-muted-foreground`, `border-border`) | Part C `@theme inline` wires them to shadcn vars, which resolve through the `--afenda-*` chain |
| `text-success`, `text-warning`, `text-info`, `text-destructive` | Fully defined in Part B |
| `shadow-sm/md/lg`, `z-sticky/modal/overlay`, `radius-sm/md/lg` | Part C motions/z/radius aliases |
| Any `--app-shell-studio-*` CSS variable | `afenda-appshell-studio.css` wires them transitively |

Anything NOT in this table requires an explicit decision (see SKILL.md §2 decision filter).

