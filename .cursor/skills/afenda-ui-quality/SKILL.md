---
name: afenda-ui-quality
description: End-to-end workflow for building, installing, normalizing, and verifying high-quality UI blocks in the Afenda ERP repo. Covers shadcn-studio /cui /rui /iui block lifecycle, TIP-004 governance normalization (strip className from @afenda/ui primitives, move styles to afenda-*.css with var(--afenda-*) tokens), govern-primitive audit (9.5/10 checklist), and ui-craft visual quality gate (9.5/10 visualization). Use when installing shadcn-studio blocks, creating new UI surfaces, auditing existing components, or running the normalization pipeline. Enforces Tailwind v4 + @afenda/design-system token authority.
disable-model-invocation: true
---

# Afenda UI Quality — Build · Normalize · Verify

> Target: **9.5/10 enterprise code quality + 9.5/10 visual quality** on every block.
>
> Stack: Tailwind v4 · shadcn/Radix · `@afenda/ui` governed primitives · `@afenda/design-system` tokens · shadcn/studio MCP · ui-craft skill.

---

## Five-phase workflow

```
Phase 1 → Discovery (token system, surface, density)
Phase 2 → Generate  (shadcn-studio /cui /rui /iui)
Phase 3 → Normalize (strip className → CSS classes → token vars)
Phase 4 → Govern    (govern-primitive 9.5/10 checklist)
Phase 5 → Visual QA (ui-craft anti-slop + accessibility)
```

Run all five in order. Never skip Phase 3 after a shadcn-studio install.

---

## Phase 1 — Discovery

### 1.1 Confirm target surface

| Surface | CSS lands in | Governed primitives from |
|---------|-------------|--------------------------|
| ERP app pages | `apps/erp/src/app/globals.css` → `@layer utilities` | `@afenda/ui` |
| AppShell chrome + blocks | `packages/appshell/src/afenda-appshell.css` | `@afenda/ui` |
| Metadata-UI renderers | `packages/metadata-ui/src/afenda-metadata-ui.css` | `@afenda/ui` |

### 1.2 Token inventory check

Before touching any CSS or component, verify which tokens are live:

```ts
import { AFENDA_TOKEN_REGISTRY } from "@afenda/design-system";
// OR read: packages/design-system/src/registries/token.registry.ts
```

Key token groups available as CSS variables:
- `--afenda-color-*` — OKLCH palette (sapphire primary, off-white canvas, forest-green success, amber warning, red danger)
- `--afenda-spacing-*` — spacing scale
- `--afenda-radius-*` — radius scale (use these; never `rounded-[...]`)
- `--afenda-shadow-*` — shadow scale
- `--afenda-motion-*` — duration + easing
- Tailwind semantic aliases: `--primary`, `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border`, etc.

### 1.3 Density context

Ask: is the UI compact dashboard (density=`compact`) or standard form (density=`default`)?

```ts
import { densityToAttribute } from "@afenda/design-system";
// Add data-density="compact" to the root container for dense surfaces
```

---

## Phase 2 — Generate with shadcn-studio

Follow `/shadcn-studio` skill rules exactly. Key constraints for this repo:

1. **Install cwd: `packages/ui`** — `components.json` lives there.
2. **Block destination after MCP install:** move to `packages/appshell/src/shadcn-studio/blocks/` (never leave in `packages/ui/src/components/shadcn-studio/`).
3. **After install, immediately go to Phase 3** — raw MCP output always has `className` on governed primitives. Do not ship until normalized.

Use `/cui` for new blocks, `/rui` for refining existing blocks, `/iui` for inspiration-driven generation.

---

## Phase 3 — Normalization (TIP-004 compliance)

This is the most critical phase. Raw shadcn-studio blocks contain `className` props on `@afenda/ui` governed primitives, which triggers the TIP-004 runtime throw and Vitest failure.

### 3.1 Identify violations fast

```bash
pnpm ui:guard:scan          # in-process scan < 2 s — Gate D only
pnpm ui:guard               # all five gates (A = ui author, B = appshell, C = erp, D = scan, E = css)
```

### 3.2 Strip `className` from governed primitives

These components MUST NOT receive `className` in consumer code:
`Button`, `Badge`, `Alert`, `Dialog*`, `Sheet*`, `DropdownMenu*`, `Sidebar*`, `Avatar`, `Tabs*`, `Combobox*`, `InputGroup*`, `Kbd`, `Card*`, `Table*`, `Field*`, `Progress`, `Separator`, `Tooltip`.

```tsx
// ❌ Raw MCP output — TIP-004 throw
<Button className="relative gap-2 bg-primary text-white rounded-lg px-4">Save</Button>

// ✅ Normalized — governed props only
<Button intent="primary" emphasis="solid" size="md">Save</Button>
```

### 3.3 Move semantic styles into CSS class

For layout and surface styling around governed primitives, use semantic CSS classes.
Add them to the package's CSS file (never inline Tailwind on the wrapper if it has visual meaning):

```tsx
// ❌ Raw MCP output — visual Tailwind in JSX
<div className="flex flex-col gap-4 bg-card rounded-xl shadow-md p-6">
  <Card>...</Card>
</div>

// ✅ Normalized — semantic class in JSX, styles in CSS
<div className="afenda-metric-panel">
  <Card>...</Card>
</div>
```

```css
/* In packages/appshell/src/afenda-appshell.css → @layer components */
@layer components {
  .afenda-metric-panel {
    display: flex;
    flex-direction: column;
    gap: var(--afenda-spacing-4);
    background-color: var(--card);
    border-radius: var(--afenda-radius-xl);
    box-shadow: var(--afenda-shadow-md);
    padding: var(--afenda-spacing-6);
  }
}
```

### 3.4 Token substitution rules

| Raw class or value | Correct CSS variable |
|--------------------|---------------------|
| `text-primary` / hardcoded color | `var(--primary)` |
| `bg-muted` | `var(--muted)` |
| `text-muted-foreground` | `var(--muted-foreground)` |
| `border-border` | `var(--border)` |
| `rounded-lg` | `var(--afenda-radius-lg)` |
| `rounded-xl` | `var(--afenda-radius-xl)` |
| `shadow-md` | `var(--afenda-shadow-md)` |
| `gap-4` / `p-6` | `var(--afenda-spacing-4)` / `var(--afenda-spacing-6)` |
| `duration-200` | `var(--afenda-motion-duration-fast)` |
| `ease-out` | `var(--afenda-motion-ease-out)` |

**Never use** in CSS classes:
- Hex literals (`#1a2b3c`)
- `oklch(...)` literals (use token vars)
- `bg-gradient-to-*`, `from-*`, `to-*` (prohibited by `class-name-guard.ts`)
- `backdrop-blur`, `glass` effects
- `shadow-[...]`, `rounded-[...]`, `text-[...]`, `bg-[...]` arbitrary values

### 3.5 mapStockButtonProps for stock shadcn variants

When a block uses stock shadcn Button variants, bridge them at the call site:

```tsx
import { mapStockButtonProps } from "@afenda/ui/governance";

// Stock block had: <Button variant="destructive" size="sm">Delete</Button>
// Governed:
<Button {...mapStockButtonProps("destructive", "sm")}>Delete</Button>
```

### 3.6 Globals.css layer integrity

The ERP `globals.css` cascade order is **non-negotiable**:

```css
@layer theme, base, components, utilities;
@import "tailwindcss";                                         /* 1 */
@import "@afenda/ui/afenda-ui.css";                           /* 2 */
@import "@afenda/appshell/afenda-appshell.css";               /* 3 */
@import "@afenda/metadata-ui/afenda-metadata-ui.css" layer(components); /* 4 */
@import "shadcn/tailwind.css";                                /* 5 */
@source "../**/*.{ts,tsx}";
```

New app-level styles go **after** line 5 in `@layer components` or `@layer utilities` — never by inserting between existing imports.

---

## Phase 4 — Govern-primitive audit

When a block introduces a **new primitive wrapper** (not just a block composition), apply the govern-primitive 9.5/10 checklist before merge. Load the `/govern-primitive` skill for the full 16-point checklist.

Critical non-negotiables:
- `resolvePrimitiveGovernance()` is the **only** class authority
- No `className` → governed primitives
- `{...governed.dataAttributes}` is always **last** in prop spread
- Every slot name registered in `primitive-registry.ts`
- `pnpm --filter @afenda/ui check:governance` passes

---

## Phase 5 — Visual QA (ui-craft)

Load the `/ui-craft` skill for the full visual review. Repo-specific gate below.

### 5.1 Anti-slop mandatory checks

Run `guardClassName()` mentally against every className string in the block:

```ts
// Repo's runtime guard — throws TIP-004 for visual slop
import { guardClassName } from "@afenda/ui/governance";
// Patterns it blocks: from-, to-, via-, backdrop-blur, glass, bg-gradient, shadow-[, rounded-[, text-[, bg-[, bg-#, text-#
```

Visual quality checklist (9.5/10 target):

```
[ ] No identical card grids — vary metric cards (primary gets accent tint, others neutral)
[ ] No ALL CAPS headings (exception: 11-13px category labels with tracking)
[ ] No purple/cyan gradients — use palette: sapphire primary + off-white + forest green
[ ] No emoji icons — use Lucide SVG (repo's consistent icon library)
[ ] `tabular-nums` on all numeric data cells
[ ] `tracking-tight` or `-0.02em` on headings ≥ 24px
[ ] One accent color (sapphire `var(--primary)`), 3-5 placements per viewport
[ ] Trend change text: plain secondary (`var(--muted-foreground)`) — not colored pill
[ ] Metric cards have sparkline or mini-chart
[ ] Exit animations ~75% of entrance duration
[ ] `prefers-reduced-motion` honored on every animated element
[ ] Area chart fill gradient: opacity 15% → 0% (never solid fill)
```

### 5.2 Accessibility mandatory checks

```
[ ] All interactive elements have visible focus-visible ring
[ ] Form inputs associated with labels via htmlFor/id
[ ] Error states use role="alert"
[ ] Images have meaningful alt text
[ ] APCA contrast ≥ 60 for body text, ≥ 75 for UI labels
[ ] Keyboard navigation works without mouse
[ ] No animation on high-frequency actions (keyboard, toggles, typing)
[ ] Dynamic content (search results, filtered tables, notifications) has aria-live region
[ ] recharts SVGs wrapped in <figure aria-label="..."> with aria-hidden on SVG
[ ] Dialog/Sheet close returns focus to trigger element
[ ] Loading states use aria-busy="true" with descriptive aria-label
```

> For the full React accessibility + hooks + composition + bundle gate, run **react-erp-quality** after this phase:
> [`.cursor/skills/react-erp-quality/SKILL.md`](../react-erp-quality/SKILL.md)

### 5.3 ERP-specific visual patterns

For ERP surfaces, always apply:
- **KPI metrics**: large undecorated number (`tabular-nums`, semibold) + small plain secondary context
- **Status cells**: dot + text (color = dot only, not background pill)
- **Charts**: area/line for time-series; horizontal bar for categorical; never pie with > 2 segments
- **Tables**: alternating row tint from `var(--muted)` at 30% opacity — not hardcoded bg
- **Sidebar**: subtle `var(--muted)` tint background — NOT dark/inverted unless explicitly dark ERP surface

---

## Verification commands

Run in order after completing all phases:

```bash
# 1. Fast structural scan (< 2 s)
pnpm ui:guard:scan

# 2. Full five-gate guard
pnpm ui:guard

# 3. TypeScript correctness
pnpm --filter @afenda/appshell typecheck    # if appshell changed
pnpm --filter @afenda/ui typecheck          # if ui primitives changed
pnpm --filter app typecheck                 # if apps/erp changed

# 4. Tests
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/appshell test:run

# 5. Biome (format + lint)
pnpm lint
pnpm format
```

All gates must pass before merging.

---

## Scoring (self-assessment before merge)

### Code quality (target 9.5/10)

| Check | Points |
|-------|--------|
| No `className` on governed primitives (`pnpm ui:guard:scan` clean) | 2.0 |
| All CSS uses `var(--afenda-*)` tokens — no raw hex, no arbitrary values | 2.0 |
| govern-primitive checklist ≥ 15/16 (if new primitive added) | 1.5 |
| TypeScript strict: no `any`, explicit return types on public fns | 1.0 |
| `prefers-reduced-motion` honored | 0.5 |
| Semantic CSS class names (BEM-adjacent, domain-namespaced) | 0.5 |
| `tabular-nums` on all numeric cells | 0.5 |
| `focus-visible` rings on all interactive elements | 0.5 |
| No visual slop guard violations | 1.0 |
| **Total** | **9.5** |

### Visual quality (target 9.5/10)

| Check | Points |
|-------|--------|
| One accent color, 3-5 placements per viewport | 1.5 |
| Typography: tight tracking on large headings, text-balance | 1.0 |
| Varied border-radius (not uniform) | 0.5 |
| Layered shadows (ambient + direct) — not flat borders | 1.0 |
| Real SVG icons (Lucide), consistent set | 1.0 |
| APCA-compliant contrast | 1.0 |
| ERP metric patterns (sparklines, plain change text, tabular nums) | 1.0 |
| Status dots + text (no filled background pills in tables) | 0.5 |
| Chart type matches data story | 0.5 |
| One signature detail (distinctive hover, subtle motif) | 0.5 |
| No anti-slop patterns (gradients, glow, glass, emoji icons) | 1.0 |
| **Total** | **9.5** |

---

## Quick-reference: common normalization failures

| Failure | Fix |
|---------|-----|
| `<Button className="gap-2 bg-primary">` | Remove `className`; use `intent="primary" emphasis="solid"` |
| `<Card className="rounded-xl shadow-lg p-6">` | Remove `className`; wrap in `<div className="my-surface-class">` |
| `<Badge className="bg-green-500">Active</Badge>` | Remove `className`; use `tone="success"` |
| `bg-gradient-to-r from-blue-500 to-purple-500` | Prohibited. Use solid `var(--primary)` with opacity |
| `text-[14px]` | Use `text-sm` (Tailwind v4 scale) or `var(--afenda-text-sm)` |
| `shadow-[0px_4px_20px_rgba(0,0,0,0.3)]` | Use `var(--afenda-shadow-md)` or `var(--afenda-shadow-lg)` |
| `rounded-[12px]` | Use `rounded-xl` → `var(--afenda-radius-xl)` |
| `color: #1a2b3c` | Use `color: var(--foreground)` |
| `variant="ghost" size="sm"` (stock shadcn) | `{...mapStockButtonProps("ghost", "sm")}` |

---

## Additional resources

- **React quality gate (run after Phase 5):** [`.cursor/skills/react-erp-quality/SKILL.md`](../react-erp-quality/SKILL.md)
- Govern-primitive checklist: [`.cursor/skills/govern-primitive/SKILL.md`](../govern-primitive/SKILL.md)
- Visual craft rules: [`.cursor/skills/ui-craft/SKILL.md`](../ui-craft/SKILL.md)
- shadcn-studio workflow: [`.cursor/skills/shadcn-studio/SKILL.md`](../shadcn-studio/SKILL.md)
- Token registry: `packages/design-system/src/registries/token.registry.ts`
- Visual slop guard: `packages/ui/src/governance/class-name-guard.ts`
- Stock shadcn bridge: `packages/ui/src/governance/stock-shadcn-compat.ts`
- CSS manifest: `packages/ui/src/styles/css-manifest.ts`
- normalization reference: [normalization.md](normalization.md)
