# Visual conformance checks

Full reference for the `ui-consistency-bundle`. Run the appropriate section after every UI change.

---

## Docs editorial — apps/docs/**

Authority skill: `.cursor/skills/docs-editorial-design/SKILL.md`

### Typography

```
[ ] Page title (DocsTitle): Source Serif 4, H1, one per page
[ ] h2 / h3: Source Sans 3, no border-bottom, not serif (border-bottom reads as underline)
[ ] Breadcrumb: current page NOT in breadcrumb (set includePage: false in DocsPage)
[ ] Breadcrumb: uppercase overline style, muted color, not link-colored
[ ] Body: 14–16px, line-height ≥ 1.65, max-width 60–72ch
[ ] Prose link: underline only on inline <a> in .prose (not cards, not nav, not TOC)
[ ] No third typeface — only Source Sans 3, Source Serif 4, monospace
```

### Color — single-accent rule

```
[ ] Brand accent (H254 oklch blue) only in: .prose a, .prose blockquote border-rule
[ ] Brand accent NOT in: sidebar, TOC, search, nav, breadcrumbs, headings, cards, callouts
[ ] Card hover: neutral surface-hover background elevation only — no accent on title
[ ] TOC active indicator: hairline accent-mix, not solid brand
[ ] Sidebar active: font-weight 500, heading color — not brand accent
[ ] fd-primary = heaviest neutral text (not brand blue)
[ ] fd-accent = neutral hover surface (not brand blue)
```

### Fumadocs bridge

```
[ ] @theme inline used (not @theme) — enables .dark override cascade
[ ] No --color-fd-* literals in :root or .dark
[ ] Dark mode changes flow through --docs-editorial-* → bridge resolves automatically
[ ] Selectors use stable data-* and id attributes — not fragile DOM structure
```

### DOM selectors (verified from dist)

Known Fumadocs 16 real selectors:
```css
[data-card]        /* card link wrapper — NOT .nd-card */
#nd-sidebar        /* sidebar root */
#nd-toc            /* TOC root */
#nd-page           /* content pane */
button[data-search-full]  /* search trigger */
[data-active="true"]      /* active nav item */
.dark              /* dark mode class on <html> */
```

Before writing any selector: `Read` the relevant component from `node_modules/fumadocs-ui/dist/`.

### Dark mode quality

```
[ ] Canvas: deep graphite (L ≈ 0.155, H260)
[ ] Rail (sidebar): darker than canvas (L ≈ 0.135)
[ ] Paper (cards, search): elevated above canvas (L ≈ 0.18)
[ ] Text: warm off-white (H95, L ≈ 0.93)
[ ] Muted text: (L ≈ 0.62–0.68)
[ ] Borders: hairline opacity (≤ 0.25 alpha)
[ ] No neon, no high-chroma accents, no heavy glow
[ ] Feedback highlight: color-mix wash (≤ 16% opacity) — not solid primary block
```

### Accessibility

```
[ ] Body text contrast ≥ 7:1 against canvas (WCAG AAA)
[ ] Muted text contrast ≥ 4.5:1
[ ] Prose accent link contrast ≥ 4.5:1
[ ] Focus-visible ring visible on all interactive elements
[ ] prefers-reduced-motion: transition: none on all transitions
[ ] No color-only state indicator
[ ] Hover uses non-color signal (transform, shadow, border change)
```

### Verification gates

```bash
pnpm --filter @afenda/docs typecheck
pnpm --filter @afenda/docs test:run          # includes docs-theme.test.ts
pnpm exec biome ci apps/docs
```

---

## ERP app UI — apps/erp/**, packages/appshell/**

Authority skill: `.cursor/skills/afenda-ui-quality/SKILL.md`

### Governed UI governance

```
[ ] No className on governed @afenda/ui primitives (Button, Badge, Card, Alert, Dialog*, Sheet*, DropdownMenu*, Sidebar*, Avatar, Tabs*, etc.)
[ ] Wrapper divs / plain HTML elements: className allowed for layout
[ ] Governed Button props: intent + emphasis + size (NOT variant="ghost"/shadcn stock)
[ ] No stock-props.ts wrappers, no mapStockButtonProps
[ ] pnpm ui:guard:scan clean (< 2 s)
[ ] pnpm ui:guard all six gates A–F pass
```

### CSS token rules (shadcn-first)

```
[ ] Semantic colors use shadcn vars: var(--foreground), var(--muted-foreground), var(--border), var(--card)
[ ] Layout/spacing may use var(--afenda-spacing-*) until extension cutover
[ ] No raw hex literals (#1a2b3c) in consumer CSS
[ ] No oklch() literals outside authority token files
[ ] No arbitrary Tailwind values: shadow-[...], rounded-[...], text-[...], bg-[...]
[ ] No gradients (bg-gradient-to-*, from-*, to-*, via-*)
[ ] No glass / backdrop-blur effects
[ ] No emoji icons — Lucide SVG only
```

### CSS authority (PAS-005)

```
[ ] Vendored shadcn theme immutable — never hand-edit shadcn-theme.css
[ ] Registry row required for new --* vars in packages (CSS-TOKEN-*)
[ ] Prefer text-muted-foreground over custom bridge classes where Gate D allows
[ ] Do not import afenda-appshell-studio.css from apps
[ ] pnpm check:css-visual-regression passes after CSS import chain changes
```

Full checklist: `.cursor/skills/enterprise-frontend-audit/reference/css-authority.md`

### Visual design

```
[ ] One accent color: sapphire var(--primary), 3–5 placements per viewport
[ ] KPI metrics: large tabular-nums number + small plain muted-foreground context
[ ] Status cells: color dot + text (no filled background pills)
[ ] Tables: alternating row tint from var(--muted) at 30% opacity
[ ] Charts: area/line for time-series; horizontal bar for categorical
[ ] Headings ≥ 24px: tracking-tight or -0.02em, text-balance
[ ] Exit animations ≈ 75% of entrance duration
[ ] prefers-reduced-motion honored on every animated element
```

### Accessibility

```
[ ] APCA contrast ≥ 60 for body text, ≥ 75 for UI labels
[ ] All interactive elements: focus-visible ring
[ ] Form inputs associated with labels via htmlFor/id
[ ] Error states: role="alert"
[ ] recharts SVGs: <figure aria-label="…"> + aria-hidden on <svg>
[ ] Dialog/Sheet close returns focus to trigger
[ ] Loading states: aria-busy="true" + aria-label
[ ] Dynamic content (search, filter, notifications): aria-live region
```

### Package CSS dist sync (if packages/appshell or packages/ui CSS edited)

```bash
pnpm sync:package-css-dist
pnpm check:package-css-dist-sync
```

---

## UI primitives — packages/ui/**

Authority skill: `.cursor/skills/govern-primitive/SKILL.md`

### Governance checklist (must score ≥ 15/16)

```
[ ] resolvePrimitiveGovernance() is the ONLY class authority
[ ] className accepted as governed extension point only
[ ] GovernedXxxProps has state?: GovernedState (not state?: string)
[ ] Prop spread order: {...props} → semantic data-* → {...governed.dataAttributes} LAST
[ ] Root uses forwardRef + displayName
[ ] Every public slot uses forwardRef + displayName
[ ] Every governance call includes recipeName
[ ] Slot names match primitive-registry.ts exactly
[ ] pnpm --filter @afenda/ui check:governance passes
[ ] No "use client" unless genuinely required
[ ] No raw Tailwind in any slot or sub-primitive
[ ] Accessibility semantics preserved and tested
```

---

## Common failure patterns (from production incidents)

| What was wrong | What it looked like | Fix |
|---------------|---------------------|-----|
| `.nd-card` selector (Fumadocs 15) | Card links had underlines after Fumadocs 16 upgrade | Use `[data-card]` — read dist first |
| Brand accent on card hover title | Blue text on hover = accent in card (forbidden) | Hover: neutral color only, no accent on title |
| `.prose a` without `:not([data-card])` | All card descriptions underlined | `:where(:not([data-card]):not(.nd-card))` exclusion |
| h2 with `border-bottom` | Heading looked like a clickable link | Remove border-bottom, use font-weight hierarchy |
| Direct `--color-fd-*` in `:root` | Dark mode breaks because @theme inline cascade bypassed | Use `--docs-editorial-*` primitives only |
| Solid primary on `::highlight(fd-feedback-text)` | Selection looks like neon block | `color-mix(in oklch, var(--docs-editorial-prose-accent) 12%, transparent)` |
| `<Button className="gap-2">` | Governed UI runtime throw in Vitest | Remove className; use governed props |
| `oklch(0.46 0.08 254)` in component CSS | Bypasses token system | Use `var(--docs-editorial-prose-accent)` |
