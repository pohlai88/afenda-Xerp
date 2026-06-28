# Design System Conformance Reference

## Phase 3 — Design System Audit

Read [css-authority.md](css-authority.md) first for PAS-005 inventory and shadcn-first rules.

### 3.1 Token system inventory

**Dual authority model** — do not treat `token.registry.ts` as the sole CSS source of truth:

| Concern | Authority | Path |
|---------|-----------|------|
| CSS tokens (runtime) | `@afenda/css-authority` | `src/authorities/`, `src/css/vendored/shadcn-theme.css` |
| CSS registry IDs | Generated | `CSS-TOKEN-*` in `css-authority-registry.ts` |
| TIP-004 variants/recipes | `@afenda/design-system` (v1) | TS registries only — not new CSS palette |
| Docs editorial | `apps/docs` | `--docs-editorial-*` (separate stack) |

Before any CSS edit, verify which token groups are live:

| Group | CSS variable prefix | Owner | Usage |
|-------|--------------------|-------|----|
| shadcn semantic | `--background`, `--foreground`, `--primary`, `--muted`, `--muted-foreground`, `--border`, `--card`, … | css-authority (vendored) | **Preferred** in new ERP consumer CSS |
| Chart (shadcn) | `--chart-1` … `--chart-5` | css-authority (vendored) | Data visualization base palette |
| Chart (extensions) | `--chart-6` … `--chart-8` | css-authority (extensions) | When registered in authorities JSON |
| Spacing (shim) | `--afenda-spacing-*` | design-system shim | Layout until extension cutover |
| Radius (shim) | `--afenda-radius-*` | design-system shim | Border-radius — never `rounded-[...]` |
| Shadow (shim) | `--afenda-shadow-*` | design-system shim | Box-shadow |
| Motion (shim) | `--afenda-motion-duration-*`, `--afenda-motion-ease-*` | design-system shim | Transitions, animations |
| Typography (shim) | `--afenda-text-*`, `--font-*` | design-system shim | Font size, line height |
| Shell geometry | `--app-shell-*`, `.app-shell-studio-*` | appshell | Layout only — prefer shadcn utilities |
| Legacy semantic | `--afenda-semantic-*`, `--afenda-color-*` | design-system shim | **Do not add** — migrate to shadcn vars |

### 3.2 No hardcoded visual values — comprehensive check

**Forbidden patterns (flag every occurrence):**

```css
/* Hardcoded hex */
color: #1a2b3c;
background: #0ea5e9;

/* OKLCH literals outside token files */
color: oklch(0.48 0.17 254);

/* Arbitrary Tailwind values */
className="text-[14px] rounded-[12px] shadow-[0px_4px_20px_rgba(0,0,0,0.3)] bg-[#1a2b3c]"

/* Gradient classes (prohibited by class-name-guard.ts) */
className="bg-gradient-to-r from-blue-500 to-purple-500"
className="from-primary to-secondary"

/* Glass / blur effects */
className="backdrop-blur-md bg-white/10"

/* Raw pixel sizes when tokens exist */
gap: 16px;   /* should be var(--afenda-spacing-4) */
padding: 24px; /* should be var(--afenda-spacing-6) */
```

**Correct substitutions:**

| Hardcoded | Correct (shadcn-first) |
|-----------|------------------------|
| `color: #1a2b3c` | `color: var(--foreground)` |
| `var(--afenda-semantic-text-secondary)` | `var(--muted-foreground)` in new ERP code |
| `var(--afenda-semantic-border-default)` | `var(--border)` |
| `var(--afenda-semantic-surface-card)` | `var(--card)` |
| `rounded-lg` | Tailwind `rounded-lg` or `var(--afenda-radius-lg)` in CSS |
| `rounded-[12px]` | `var(--afenda-radius-xl)` |
| `shadow-md` | `var(--afenda-shadow-md)` |
| `gap-4` in CSS | `var(--afenda-spacing-4)` until extension cutover |
| `duration-200` | `var(--afenda-motion-duration-fast)` |
| Gradient classes | Solid `var(--primary)` with opacity |
| `text-[14px]` | `text-sm` (Tailwind scale) |

### 3.3 Theme architecture

**`@afenda/ui/afenda-ui.css` composition (PAS-005 B29):**

```css
@import "@afenda/design-system/css/afenda-tokens.css";          /* --afenda-* shim */
@import "@afenda/css-authority/css/afenda-css-authority.css";  /* vendored shadcn + bridge */
/* primitive structural hooks in @layer components */
```

**ERP app (apps/erp) globals.css cascade — non-negotiable order:**

```css
@layer theme, base, components, utilities;
@import "tailwindcss";                                           /* 1 */
@import "@afenda/ui/afenda-ui.css";                             /* 2 — tokens + css-authority */
@import "@afenda/appshell/afenda-appshell.css";                 /* 3 */
@import "@afenda/metadata-ui/afenda-metadata-ui.css" layer(components); /* 4 */
@import "shadcn/tailwind.css";                                  /* 5 */
@source "../**/*.{ts,tsx}";
```

New ERP styles go AFTER line 5 in `@layer components` or `@layer utilities`.
Do **not** import `afenda-appshell-studio.css` from apps.

**Docs app (apps/docs) palette authority:**

```
apps/docs/src/app/docs-editorial-palette.css    ← all OKLCH literals
apps/docs/src/lib/docs-editorial-palette.contract.ts  ← TypeScript mirror
```

CSS ↔ TypeScript must stay in sync. Adding a `--docs-editorial-*` token without mirroring it in the contract is a **Hard Stop**.

### 3.4 Typography audit

**ERP surface:**

```
[ ] Heading sizes use Tailwind v4 type scale (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl)
[ ] No arbitrary font sizes (text-[22px])
[ ] tracking-tight applied to headings ≥ 24px (tracking-tight = -0.025em)
[ ] text-balance applied to short headings, text-pretty to body copy
[ ] tabular-nums applied to ALL numeric data cells in tables and KPI cards
[ ] No ALL_CAPS headings except category labels ≤ 13px with letter-spacing
[ ] Font family never overridden outside of docs editorial palette or design-system
```

**Docs surface:**

```
[ ] Source Sans 3 for body/UI copy (--font-docs-body)
[ ] Source Serif 4 for display/headings (--font-docs-display)
[ ] No third typeface introduced
[ ] Prose width 60–70ch (max-width: 65ch)
[ ] Line-height ≥ 1.7 for prose
[ ] font-feature-settings: "liga", "kern" on prose
```

### 3.5 Color system — single accent discipline

**ERP surfaces:**

```
[ ] One accent color: sapphire var(--primary) — 3–5 placements per viewport maximum
[ ] No purple/cyan gradients anywhere
[ ] No filled color pill backgrounds for status (use dot + text pattern)
[ ] Success/warning/danger expressed through @afenda/ui tone prop, not className
[ ] Chart colors from var(--chart-1..5) (shadcn) + var(--chart-6..8) when registered — not hardcoded hex
```

**Docs surface:**

```
[ ] Brand accent (H254) ONLY in .nd-page .prose a and .nd-page .prose blockquote
[ ] Sidebar, nav, TOC, search, breadcrumbs are monochrome (H95/H260 neutrals)
[ ] fd-primary maps to neutral text (NOT brand accent)
[ ] fd-accent maps to surface-hover (NOT brand accent)
```

### 3.6 Dark mode

**ERP surface:**

```
[ ] Dark mode implemented via .dark class on <html> (next-themes)
[ ] All colors reference semantic tokens that have dark variants
[ ] No hardcoded colors that break in dark mode
[ ] Test all surfaces in dark mode before closing the turn
```

**Docs surface:**

```
[ ] Dark canvas = graphite (oklch ~0.155 0.004 H260)
[ ] Dark rail = recessed below canvas
[ ] Dark text = warm ivory (oklch ~0.93 0.004 H95)
[ ] Dark mode flows through editorial primitives → @theme inline bridge → fd-* aliases
[ ] No direct --color-fd-* overrides in .dark
```

### 3.7 Motion / animation system

```
[ ] All transition durations use var(--afenda-motion-duration-*)
[ ] All easing functions use var(--afenda-motion-ease-*)
[ ] Exit animations ~75% of entrance duration
[ ] prefers-reduced-motion respected on every animated element:
    @media (prefers-reduced-motion: reduce) { /* disable or minimize */ }
[ ] No animation on high-frequency actions (keyboard press, typing, toggle)
[ ] Area chart fills: opacity 15%→0% gradient (never solid fill)
```

### 3.8 Spacing and density

```
[ ] Spacing values from var(--afenda-spacing-*)
[ ] Dense surfaces use data-density="compact" attribute (densityToAttribute from @afenda/design-system)
[ ] Density context applied at container level, inherited by children
[ ] No mixed density within the same logical surface
[ ] Form layouts use consistent gap (var(--afenda-spacing-4) or --afenda-spacing-6)
```

### 3.9 Iconography

```
[ ] All icons from Lucide React — imported individually
[ ] No emoji icons in production UI
[ ] Icon size consistent with context: 16px text-inline, 20px button, 24px heading
[ ] Icon + text alignment: items-center, gap-2 pattern
[ ] Decorative icons have aria-hidden="true"
[ ] Functional icons have aria-label or paired visible text
```

### 3.10 Elevation / shadow

```
[ ] Box shadows from var(--afenda-shadow-*): none, sm, md, lg, xl
[ ] No arbitrary shadow values shadow-[...]
[ ] No glass/blur effects
[ ] Elevation hierarchy: 0=flat surface, sm=card, md=dropdown, lg=modal/dialog, xl=notification
[ ] Dark mode shadows: slightly more subtle (system handles via token)
```

---

## Phase 4 — Visual Consistency Audit

### 4.1 Visual hierarchy across screens

For every screen, verify:

```
[ ] One dominant visual anchor per viewport
[ ] Clear H1 → H2 → H3 hierarchy (no heading levels skipped)
[ ] Primary action is unmistakable (one CTA per section)
[ ] Supporting information is visually subordinate (muted text, smaller scale)
[ ] No visual competition between equal-weight elements
```

### 4.2 Layout rhythm

```
[ ] Consistent vertical rhythm: elements share a 4px or 8px baseline grid
[ ] Section spacing: var(--afenda-spacing-8) or --afenda-spacing-12 between major sections
[ ] Card padding: var(--afenda-spacing-6) default, --afenda-spacing-4 compact
[ ] Table cell padding consistent across all tables in the app
[ ] Form field gaps consistent: var(--afenda-spacing-4) within group, --afenda-spacing-6 between groups
```

### 4.3 Information density

```
[ ] Dashboard: metric cards show number + label + optional sparkline (no prose paragraphs)
[ ] Tables: max 8 columns visible without horizontal scroll
[ ] Forms: one logical group per visual section
[ ] Sidebars: max 3 nesting levels for navigation
[ ] No screen with > 3 competing primary actions
```

### 4.4 Empty, loading, error states

Every data surface must have all three states implemented:

```
[ ] Empty state: illustration or icon + message + primary action
[ ] Loading state: skeleton that matches the loaded layout dimensions
[ ] Error state: role="alert" + clear message + retry action
[ ] Partial data: graceful degradation (no partially broken UI)
```

**Skeleton rules:**
```
[ ] Skeleton uses var(--muted) background with pulse animation
[ ] Skeleton matches the exact layout of loaded content (same height/width)
[ ] Skeleton has aria-busy="true" on container
[ ] Text skeletons use rounded height matching font line-height
```

### 4.5 Unified surface patterns

```
[ ] Cards: consistent border var(--border), background var(--card), radius var(--afenda-radius-xl)
[ ] KPI metrics: large tabular-nums number + small muted label (no decorative backgrounds)
[ ] Status indicators: colored dot (8px) + status text — no filled pill backgrounds in tables
[ ] Badges: @afenda/ui Badge with tone prop — no custom className
[ ] Tooltips: @afenda/ui Tooltip — consistent delay and positioning
[ ] Dialogs: @afenda/ui Dialog — no custom width overrides via className
[ ] Drawers: @afenda/ui Sheet — consistent sizing
```
