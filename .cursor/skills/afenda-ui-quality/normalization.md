# UI Block Normalization — Deep Reference

> Companion to [SKILL.md](SKILL.md). Read when you need token mappings, CSS patterns, or worked examples.
>
> **Canonical TIP-004 policy:** [`docs/governance/tip-004-policy.md`](../../docs/governance/tip-004-policy.md)

---

## CSS layer architecture (full stack)

```
globals.css (apps/erp)
  @layer theme, base, components, utilities;   ← declared first, deterministic cascade
  @import "tailwindcss"                         ← Tailwind v4 base, @theme, utilities
  @import "@afenda/ui/afenda-ui.css"            ← design-system @theme bridge + primitive hooks
  @import "@afenda/appshell/afenda-appshell.css"
  @import "@afenda/metadata-ui/afenda-metadata-ui.css" layer(components)
  @import "shadcn/tailwind.css"
  @source "../**/*.{ts,tsx}"
```

**Rule:** Never insert new `@import` between existing package imports. App-level additions go after `shadcn/tailwind.css`.

```
afenda-ui.css (packages/ui)
  @layer theme, base, components, utilities;
  @import "@afenda/design-system/css/afenda-design-system.css"  ← --afenda-* vars + @theme
  @layer components {
    [data-component="Button"] { ... }           ← structural hooks only, no color
  }
```

```
afenda-appshell.css (packages/appshell)
  @layer components {
    .app-shell-*  { ... }   ← block layout/composition classes using var(--afenda-*)
  }
```

---

## Token variable reference (most-used)

### Colors (Tailwind v4 semantic → CSS var)

| Tailwind utility | CSS variable | Use for |
|-----------------|--------------|---------|
| `bg-background` | `var(--background)` | Page canvas |
| `bg-card` | `var(--card)` | Card surface |
| `bg-muted` | `var(--muted)` | Subdued surface |
| `bg-primary` | `var(--primary)` | Primary accent (sapphire) |
| `bg-secondary` | `var(--secondary)` | Secondary surface |
| `bg-destructive` | `var(--destructive)` | Danger/delete |
| `text-foreground` | `var(--foreground)` | Body text |
| `text-muted-foreground` | `var(--muted-foreground)` | Secondary/helper text |
| `text-primary-foreground` | `var(--primary-foreground)` | Text on primary bg |
| `border-border` | `var(--border)` | Dividers + outlines |
| `ring-ring` | `var(--ring)` | Focus ring |

### Afenda token extensions

| Purpose | CSS variable |
|---------|-------------|
| Forest-green success | `var(--afenda-color-success-600)` |
| Amber warning | `var(--afenda-color-warning-600)` |
| Red danger | `var(--afenda-color-danger-600)` |
| KPI positive | `var(--afenda-viz-trend-positive)` |
| KPI negative | `var(--afenda-viz-trend-negative)` |
| Chart primary line | `var(--afenda-viz-chart-1)` |
| Chart secondary | `var(--afenda-viz-chart-2)` |

### Spacing (use token vars in CSS classes)

```css
/* Map: 1 unit = 4px (rem scale) */
var(--afenda-spacing-1)   /* 4px */
var(--afenda-spacing-2)   /* 8px */
var(--afenda-spacing-3)   /* 12px */
var(--afenda-spacing-4)   /* 16px */
var(--afenda-spacing-5)   /* 20px */
var(--afenda-spacing-6)   /* 24px */
var(--afenda-spacing-8)   /* 32px */
var(--afenda-spacing-10)  /* 40px */
var(--afenda-spacing-12)  /* 48px */
var(--afenda-spacing-16)  /* 64px */
```

### Radius (never use `rounded-[...]`)

```css
var(--afenda-radius-sm)   /* inputs, tight elements */
var(--afenda-radius-md)   /* buttons, badges, chips */
var(--afenda-radius-lg)   /* cards */
var(--afenda-radius-xl)   /* modals, large panels */
var(--afenda-radius-full) /* pills, avatars */
```

Always vary radius by element type — inputs smaller than cards, cards smaller than modals.

### Shadow (never use `shadow-[...]`)

```css
var(--afenda-shadow-xs)   /* subtle hairline */
var(--afenda-shadow-sm)   /* light elevation */
var(--afenda-shadow-md)   /* cards */
var(--afenda-shadow-lg)   /* dropdowns, sheets */
var(--afenda-shadow-xl)   /* modals */
```

### Motion

```css
var(--afenda-motion-duration-instant)  /* 50ms — micro-feedback */
var(--afenda-motion-duration-fast)     /* 150ms — most UI */
var(--afenda-motion-duration-base)     /* 200ms — standard */
var(--afenda-motion-duration-slow)     /* 300ms — modals */
var(--afenda-motion-duration-slower)   /* 400ms — page transitions */
var(--afenda-motion-ease-out)
var(--afenda-motion-ease-in-out)
var(--afenda-motion-ease-spring)
```

---

## Worked normalization examples

### Example 1 — KPI stat card

**Raw MCP output (before):**

```tsx
<div className="flex flex-col gap-4 bg-card rounded-xl shadow-lg p-6">
  <Card className="border-0 shadow-none">
    <CardContent className="p-0">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Revenue</span>
        <Badge className="bg-green-500 text-white rounded-full px-2 py-0.5 text-xs">+15%</Badge>
      </div>
      <p className="text-3xl font-bold mt-2 text-foreground">$3,234</p>
    </CardContent>
  </Card>
</div>
```

**Normalized (after):**

```tsx
// packages/appshell/src/shadcn-studio/blocks/statistics-kpi-stat.tsx
<div className="afenda-kpi-card">
  <Card>
    <CardContent>
      <div className="afenda-kpi-header">
        <span className="afenda-kpi-label">Revenue</span>
        <span className="afenda-kpi-change">+15%</span>
      </div>
      <p className="afenda-kpi-value">$3,234</p>
    </CardContent>
  </Card>
</div>
```

```css
/* packages/appshell/src/afenda-appshell.css — @layer components */
@layer components {
  .afenda-kpi-card {
    display: flex;
    flex-direction: column;
    gap: var(--afenda-spacing-4);
  }

  .afenda-kpi-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .afenda-kpi-label {
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--muted-foreground);
  }

  /* Plain secondary text — NOT a colored pill */
  .afenda-kpi-change {
    font-size: var(--text-xs);
    font-variant-numeric: tabular-nums;
    color: var(--muted-foreground);
  }

  .afenda-kpi-value {
    font-size: var(--text-3xl);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
    margin-top: var(--afenda-spacing-2);
    color: var(--foreground);
  }
}
```

Note: The `Badge` with colored background was removed. Change values use plain `muted-foreground` text (plain secondary text for comparisons).

---

### Example 2 — Status table cell

**Raw (before):**

```tsx
<td>
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
    Active
  </span>
</td>
```

**Normalized (after):**

```tsx
// Use @afenda/ui Badge with tone
<td>
  <Badge tone="success" emphasis="soft">
    Active
  </Badge>
</td>
```

If `tone="success"` is not yet implemented in governed Badge, fall back to:

```tsx
<span className="afenda-status-badge afenda-status-badge--success">
  <span className="afenda-status-dot" aria-hidden="true" />
  Active
</span>
```

```css
@layer components {
  .afenda-status-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--afenda-spacing-1);
    padding: 0 var(--afenda-spacing-2);
    border-radius: var(--afenda-radius-full);
    font-size: var(--text-xs);
    font-weight: 500;
  }

  .afenda-status-badge--success {
    background-color: color-mix(in oklch, var(--afenda-color-success-600) 15%, transparent);
    color: var(--afenda-color-success-600);
  }

  .afenda-status-badge--warning {
    background-color: color-mix(in oklch, var(--afenda-color-warning-600) 15%, transparent);
    color: var(--afenda-color-warning-600);
  }

  .afenda-status-badge--danger {
    background-color: color-mix(in oklch, var(--afenda-color-danger-600) 15%, transparent);
    color: var(--afenda-color-danger-600);
  }

  .afenda-status-dot {
    width: 6px;
    height: 6px;
    border-radius: var(--afenda-radius-full);
    background-color: currentColor;
    flex-shrink: 0;
  }
}
```

---

### Example 3 — Chart area with gradient fill

**Raw (before — prohibited gradient):**

```tsx
<defs>
  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
  </linearGradient>
</defs>
<Area fill="url(#colorRevenue)" />
```

**Normalized (after — token-based):**

```tsx
<defs>
  <linearGradient id="afenda-chart-area-fill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="var(--afenda-viz-chart-1)" stopOpacity={0.15} />
    <stop offset="95%" stopColor="var(--afenda-viz-chart-1)" stopOpacity={0} />
  </linearGradient>
</defs>
<Area fill="url(#afenda-chart-area-fill)" stroke="var(--afenda-viz-chart-1)" strokeWidth={1.5} />
```

Area fill: **15% opacity → 0%**. Never solid fill. Never hardcoded hex.

---

## CSS naming convention

Block-level semantic classes follow `afenda-<surface>-<component>[-<modifier>]` pattern:

```
afenda-kpi-card               ← appshell block
afenda-kpi-header
afenda-kpi-value
afenda-kpi-change--positive
app-shell-statistics-*        ← legacy pattern (legacy blocks only)
afenda-metric-*               ← metric cards
afenda-table-*                ← table wrappers
afenda-form-*                 ← form layouts
```

New blocks should use `afenda-` prefix, not `app-shell-` (legacy appshell block name).

---

## governed-ui-consumption static gate reference

`scripts/governance/governed-ui-consumption.mjs` checks every consumer `*.tsx` file in:

- `packages/appshell/src`
- `packages/metadata-ui/src`
- `apps/erp/src`

Gate D also scans `packages/ui/src/**/*.stories.tsx`.

Checks:

1. `className` on any tag in `GOVERNED_UI_TAGS` (zero tolerance in consumer code)
2. Import discipline (`@afenda/ui/governance` required; no stock-props barrels)
3. Stock shadcn `variant` / icon sizes on `<Button>` without `mapStockButtonProps`
4. Visual slop on plain HTML wrapper `className` strings

Run: `pnpm ui:guard:scan`

---

## Metadata-UI integration

When block content is metadata-driven (tables, forms, panels driven by `MetadataSection`), the UI layer is:

```tsx
import { MetadataSurface } from "@afenda/metadata-ui";
import { MetadataSection } from "@afenda/metadata-ui";

<MetadataSurface context={runtimeContext}>
  <MetadataSection sectionId="invoice-list" />
</MetadataSurface>
```

Do not create custom table renderers when a `MetadataSection` would do the same job.
Metadata-UI uses `@layer components` from `afenda-metadata-ui.css` — do not override with `globals.css` utilities.

---

## Storybook verification

After normalizing a block, add or update a Storybook story if the block is in `packages/appshell`:

```tsx
// packages/ui/src/components/my-block.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyBlock } from "@afenda/appshell";

const meta = {
  title: "AppShell/Blocks/MyBlock",
  component: MyBlock,
} satisfies Meta<typeof MyBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Compact: Story = {
  decorators: [(Story) => <div data-density="compact"><Story /></div>],
};
```

Run Storybook after normalization: `pnpm studio:toolbar` (port 3200 → Storybook 6006).
