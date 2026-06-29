---
name: docs-editorial-design
description: >
  Editorial design authority for the @afenda/docs Fumadocs application.
  Use when designing or changing the docs color palette, Fumadocs fd-* bridge,
  typography, prose layout, sidebar/search/TOC chrome, dark mode, visual rhythm,
  or any CSS/TS design contract inside apps/docs. Enforces OKLCH editorial
  primitives, single-accent discipline, prose-vs-shell separation, Fumadocs
  upgrade-safe selectors, Tailwind v4 @theme usage, ACPA accessibility checks,
  and CSS ↔ TypeScript contract parity. Calibrated against Fumadocs OSS,
  Tailwind v4, Vercel Geist, Stripe-style editorial restraint, and Linear-style
  quiet interface discipline. Target: 9.5 / 10 on visual scoring rubric.
disable-model-invocation: true
paths:
  - apps/docs/**
---

# docs-editorial-design

## Mission

Design Afenda docs like a serious editorial product:

```txt
Financial Times warmth
Vercel discipline
Stripe documentation clarity
Linear restraint
Fumadocs-native implementation
```

Not like:
```txt
neon SaaS dashboard   generic shadcn clone   AI landing page
over-colored developer portal   ERP product screen
```

**Core rule:** The shell should disappear. The prose should guide. The accent should be rare.

This skill governs **visual authority only** for `apps/docs/`. It does **not** govern ERP app UI, AppShell, shadcn primitives, metadata-ui, or product screens.

**Entry point:** Always enter through [`ui-consistency-bundle`](../ui-consistency-bundle/SKILL.md) — it routes here for `apps/docs/**` changes. Do not invoke this skill standalone without completing the bundle preflight first.

---

## Opening statement

Before any visual change, say:

```txt
I'm using docs-editorial-design — locking the editorial contract before changing visuals.
```

Then state the full design contract:

```md
| Item | Decision |
|------|----------|
| Intent | <one sentence> |
| Scope | Shell chrome / Prose / Both |
| Files | <explicit list> |
| Token strategy | <which --docs-editorial-* change> |
| Fumadocs bridge | <fd-* affected or none> |
| Typography impact | <font/scale/line-height or none> |
| ACPA impact | <contrast/focus/motion or none> |
| Verification | typecheck / build / biome / visual smoke |
```

No visual edit is allowed before this contract is stated.

---

## 1 · Authority files

### Primary (twin sources of truth)

```txt
apps/docs/src/app/docs-editorial-palette.css
apps/docs/src/lib/docs-editorial-palette.contract.ts
```

Any primitive token added, removed, or changed in CSS must be mirrored in TypeScript. No exceptions.

### Secondary

```txt
apps/docs/src/app/globals.css
apps/docs/src/lib/docs-fonts.ts
apps/docs/src/lib/docs-fonts.constants.ts
apps/docs/src/lib/layout.shared.ts
```

### Never treat as authority

```txt
node_modules/fumadocs-ui/*   random copied shadcn themes
ERP design-system tokens     inline className hacks
one-off OKLCH values in components
```

---

## 2 · Color architecture

### Two-layer model

```
Layer 1 — docs editorial material primitives (all OKLCH literals live here)
  Page material:  canvas, rail, paper
  Text:           text, text-muted, text-subtle
  Surfaces:       surface-muted, surface-raised, surface-hover, surface-active
  Lines:          border, border-subtle
  Interaction:    ring, overlay
  Prose-only:     prose-accent, prose-accent-hover
  Code:           code-surface

Layer 2 — Fumadocs fd-* bridge (semantic role mapping via @theme inline)
  --color-fd-background → --docs-editorial-canvas
  --color-fd-foreground → --docs-editorial-text
  ... (full table → PALETTE-REFERENCE.md)
```

### `@theme inline` bridge pattern

```css
@theme inline {
  --color-fd-background:           var(--docs-editorial-canvas);
  --color-fd-foreground:           var(--docs-editorial-text);
  --color-fd-muted:                var(--docs-editorial-surface-muted);
  --color-fd-muted-foreground:     var(--docs-editorial-text-muted);
  --color-fd-popover:              var(--docs-editorial-paper);
  --color-fd-popover-foreground:   var(--docs-editorial-text);
  --color-fd-card:                 var(--docs-editorial-paper);
  --color-fd-card-foreground:      var(--docs-editorial-text);
  --color-fd-border:               var(--docs-editorial-border);
  --color-fd-primary:              var(--docs-editorial-text);
  --color-fd-primary-foreground:   var(--docs-editorial-canvas);
  --color-fd-secondary:            var(--docs-editorial-surface-muted);
  --color-fd-secondary-foreground: var(--docs-editorial-text);
  --color-fd-accent:               var(--docs-editorial-surface-hover);
  --color-fd-accent-foreground:    var(--docs-editorial-text);
  --color-fd-ring:                 var(--docs-editorial-ring);
  --color-fd-overlay:              var(--docs-editorial-overlay);
}
```

Use **`@theme inline`** (not `@theme`) — enables `.dark` override cascade. `fd-primary` = heaviest neutral text, **not** brand accent. `fd-accent` = hover surface, **not** brand accent.

### OKLCH hue strategy

| Mode | Hue | Role |
|------|-----|------|
| Light canvas (porcelain) | H95 | Page bg — slight warmth, not parchment |
| Light rail | H95 | Sidebar — one step darker than canvas |
| Light paper | H95 | Cards, popovers, search surface |
| Light text | H260 | Near-black with cool-neutral cast |
| Dark canvas (graphite) | H260 | Main content plane |
| Dark rail | H260 | Sidebar — recessed below canvas |
| Dark paper | H260 | Elevated panels, search, code blocks |
| Dark text | H95 | Warm off-white body copy |
| Brand accent (prose only) | H254 | Links, blockquote rule |

**Hierarchy without accent:** use text → text-muted → text-subtle, plus canvas / rail / paper layering — never brand color in shell.

### Pinned baseline — full OKLCH values

```css
:root {
  --docs-editorial-canvas:              oklch(0.985 0.003 95);
  --docs-editorial-rail:                oklch(0.972 0.004 95);
  --docs-editorial-paper:               oklch(0.998 0.001 95);
  --docs-editorial-text:                oklch(0.18 0.006 260);
  --docs-editorial-text-muted:          oklch(0.46 0.01 260);
  --docs-editorial-text-subtle:         oklch(0.58 0.008 260);
  --docs-editorial-surface-muted:       oklch(0.955 0.004 95);
  --docs-editorial-surface-raised:      oklch(1 0 0);
  --docs-editorial-surface-hover:       oklch(0.935 0.005 95);
  --docs-editorial-surface-active:      oklch(0.925 0.006 95);
  --docs-editorial-border:              oklch(0.88 0.006 95);
  --docs-editorial-border-subtle:       oklch(0.92 0.004 95);
  --docs-editorial-ring:                oklch(0.52 0.06 255);
  --docs-editorial-overlay:             oklch(0.16 0.006 260 / 0.42);
  --docs-editorial-prose-accent:        oklch(0.48 0.17 254);
  --docs-editorial-prose-accent-hover:  oklch(0.42 0.19 254);
  --docs-editorial-code-surface:        oklch(0.955 0.004 95);
}

.dark {
  --docs-editorial-canvas:              oklch(0.155 0.004 260);
  --docs-editorial-rail:                oklch(0.135 0.004 260);
  --docs-editorial-paper:               oklch(0.18 0.004 260);
  --docs-editorial-text:                oklch(0.93 0.004 95);
  --docs-editorial-text-muted:          oklch(0.68 0.006 260);
  --docs-editorial-text-subtle:         oklch(0.56 0.006 260);
  --docs-editorial-surface-muted:       oklch(0.205 0.005 260);
  --docs-editorial-surface-raised:      oklch(0.19 0.004 260);
  --docs-editorial-surface-hover:       oklch(0.235 0.006 260);
  --docs-editorial-surface-active:      oklch(0.255 0.007 260);
  --docs-editorial-border:              oklch(0.31 0.006 260);
  --docs-editorial-border-subtle:       oklch(0.25 0.005 260);
  --docs-editorial-ring:                oklch(0.72 0.055 255);
  --docs-editorial-overlay:             oklch(0.05 0.004 260 / 0.68);
  --docs-editorial-prose-accent:        oklch(0.72 0.14 254);
  --docs-editorial-prose-accent-hover:  oklch(0.8 0.13 254);
  --docs-editorial-code-surface:        oklch(0.205 0.005 260);
}
```

### Color hard stops

Stop immediately if the proposed change introduces any of these:

```txt
Brand accent in sidebar / nav / TOC / search / breadcrumbs
A second accent color
Direct --color-fd-* values in :root or .dark
ERP token usage inside docs editorial palette
Raw OKLCH inside component className
```

---

## 3 · Single-accent rule

Afenda blue (H254) is allowed **only** in:

```txt
.nd-page .prose a
.nd-page .prose blockquote (border-inline-start only)
.nd-page .prose mark (requires explicit approval)
```

Forbidden everywhere else:
```txt
sidebar  navbar  TOC  search  tabs  buttons  cards
breadcrumbs  active nav  hover backgrounds  headings  callouts
```

Decision tree:

```
Is target inside .nd-page .prose?
  Yes → Is it a link or blockquote rule?
          Yes → accent allowed
          No  → neutral only
  No  → neutral only
```

---

## 4 · Typography

Full reference → [TYPOGRAPHY.md](TYPOGRAPHY.md)

### Approved pairing

| Role | Family | Variable |
|------|--------|----------|
| Body / UI | Source Sans 3 | `--font-docs-body` |
| Display / headings | Source Serif 4 | `--font-docs-display` |
| Code / mono | Fumadocs default | — |

### Key prose rules

```css
.nd-page .prose {
  max-width: 65ch;
  line-height: 1.7;
  font-feature-settings: "liga", "kern";
  text-wrap: pretty;
}
.nd-page .prose :is(h1, h2, h3, h4) {
  font-family: var(--font-serif);
  font-optical-sizing: auto;
  letter-spacing: -0.015em;
  text-wrap: balance;
}
```

### Typography hard stops

```txt
Body text below 14px
Hardcoded Inter or any third typeface
Letter-spacing on body copy
Prose line-height below 1.55
Font variable changed without docs-fonts.constants.ts update
```

---

## 5 · Layout

```css
:root { --fd-layout-width: 1400px; }    /* Fumadocs official override */
.nd-page .prose { max-width: 65ch; }    /* 60–70ch range */
```

### Layout hard stops

```txt
Prose wider than 72ch
Docs max-width above 1480px without explicit reason
Sidebar active state using brand color
Search button using brand color
Multiple nested bordered boxes / heavy shadows
```

---

## 6 · Fumadocs-safe selectors

Prefer stable `id` + `data-*` selectors:

```css
button[data-search-full] { }
button[data-search-full] kbd { }
#nd-sidebar [data-active="true"] { }
.dark #nd-sidebar { }
.nd-page .prose { }
```

Avoid fragile DOM selectors — they break on Fumadocs upgrades:

```css
/* FORBIDDEN */
[data-toc-popover] > div
#nd-sidebar > div > div > a
main > div:nth-child(2)
```

---

## 7 · Dark mode

Dark mode flows exclusively through editorial primitives:

```css
/* ✅ Correct */
.dark { --docs-editorial-canvas: oklch(0.13 0.008 40); }

/* ❌ Wrong — bypasses bridge */
.dark { --color-fd-background: oklch(0.13 0.008 40); }
```

The `@theme inline` block resolves automatically. Do not invent a parallel theme toggle — Fumadocs `RootProvider` + `next-themes` handles it.

---

## 8 · ACPA accessibility checks

Every visual change must verify:

```txt
Text contrast on canvas (target: ≥ 7:1 for body text)
Muted text contrast (target: ≥ 4.5:1)
Prose accent on canvas (target: ≥ 4.5:1)
Focus-visible ring — keyboard navigable
Dark mode contrast equivalent to light mode
Hover state visible without color-only signaling
Reduced-motion guard on all transitions
```

Required patterns:

```css
:focus-visible {
  outline-color: var(--docs-editorial-ring);
}

@media (prefers-reduced-motion: reduce) {
  .nd-page .prose a { transition: none; }
}
```

Forbidden:

```txt
transition: all
outline: none
opacity-only disabled state
shadow-only elevation
color-only state indicator
```

---

## 9 · TypeScript contract parity

```ts
/* docs-editorial-palette.contract.ts — required shape */
export const docsEditorialPrimitiveNames = [
  "canvas", "rail", "paper",
  "text", "text-muted", "text-subtle",
  "surface-muted", "surface-raised", "surface-hover", "surface-active",
  "border", "border-subtle", "ring", "overlay",
  "prose-accent", "prose-accent-hover", "code-surface",
] as const;

export type DocsEditorialPrimitiveName =
  (typeof docsEditorialPrimitiveNames)[number];
```

Add a test that fails if a `--docs-editorial-*` CSS variable exists without a matching contract entry.

---

## 10 · Visual scoring rubric

Score every docs visual change before closing the session.

| Area | Points |
|------|-------:|
| Editorial restraint (shell monochrome, accent discipline) | 1.5 |
| Fumadocs-native implementation (`@theme inline`, safe selectors) | 1.5 |
| Token architecture (two-layer, no bypass) | 1.5 |
| Typography / readability (pairing, scale, prose rules) | 1.25 |
| Dark mode quality (contrast, bridge, no drift) | 1.0 |
| ACPA accessibility (contrast, focus, motion) | 1.0 |
| Contract parity (CSS ↔ TypeScript mirror) | 1.0 |
| Fumadocs upgrade-safe selectors | 0.75 |
| Verification report completeness | 0.5 |
| **Target** | **≥ 9.5** |

**Automatic fail (score → 0):**

```txt
Brand accent in shell chrome
Direct fd-* hardcoding in :root or .dark
No CSS ↔ TS parity
Unreadable dark mode
Fragile DOM selector override
```

---

## 11 · Verification gates

```bash
pnpm --filter @afenda/docs typecheck
pnpm --filter @afenda/docs build
pnpm exec biome ci apps/docs
```

Manual visual smoke — expected results:

```txt
Light mode:  porcelain canvas (H95), cool near-black text (H260)
Dark mode:   graphite canvas with rail/paper layering (H260), warm off-white text
Shell chrome: monochrome only — sidebar uses rail, not canvas
Prose links:  one Afenda blue (H254) per surface
Headings:    editorial serif with clamp rhythm
Body:        readable sans, 66ch max, lead paragraph muted
Search / Sidebar / TOC: no brand accent anywhere
Keyboard focus: ring visible on all interactive elements
```

---

## 12 · Completion report

````md
## Docs Editorial Design Completion Report

### Score: <x>/10

### Design intent
- <one sentence>

### Scope
- [ ] Shell chrome only
- [ ] Prose only
- [ ] Both — justified: <reason>

### Files changed
| File | Reason |
|------|--------|
| docs-editorial-palette.css | ... |
| docs-editorial-palette.contract.ts | mirror |
| globals.css | ... |

### Accent discipline
| Rule | Result |
|------|--------|
| Brand accent absent from shell chrome | Pass/Fail |
| Brand accent only in prose links/blockquotes | Pass/Fail |
| No second accent introduced | Pass/Fail |
| fd-primary = neutral text, not brand | Pass/Fail |
| fd-accent = neutral hover surface, not brand | Pass/Fail |

### Fumadocs bridge
| Rule | Result |
|------|--------|
| @theme inline used (not @theme) | Pass/Fail |
| No direct fd-* in :root or .dark | Pass/Fail |
| Dark mode flows through editorial primitives | Pass/Fail |
| Stable selectors only | Pass/Fail |

### ACPA accessibility
| Rule | Result |
|------|--------|
| Body text contrast ≥ 7:1 | Pass/Fail |
| Muted text contrast ≥ 4.5:1 | Pass/Fail |
| Prose accent contrast ≥ 4.5:1 | Pass/Fail |
| Focus-visible ring present | Pass/Fail |
| Reduced motion respected | Pass/Fail |
| No color-only state | Pass/Fail |

### Typography
| Rule | Result |
|------|--------|
| Source Sans 3 body/UI | Pass/Fail |
| Source Serif 4 headings | Pass/Fail |
| No third typeface | Pass/Fail |
| Prose width 60–70ch | Pass/Fail |

### Contract parity
| Rule | Result |
|------|--------|
| CSS ↔ TS contract in sync | Pass/Fail |
| Font variables match constants file | Pass/Fail |

### Gates run
```bash
pnpm --filter @afenda/docs typecheck
pnpm --filter @afenda/docs build
pnpm exec biome ci apps/docs
```

### Manual smoke
- Light mode: Pass/Fail
- Dark mode: Pass/Fail
- Sidebar: Pass/Fail
- Search: Pass/Fail
- TOC: Pass/Fail
- Mobile: Pass/Fail

### Known gaps
- None / <list>
````

---

## Extended reference

- Full OKLCH token table, fd-* mapping, color decision tree → [PALETTE-REFERENCE.md](PALETTE-REFERENCE.md)
- Type scale, optical sizing, font loader rules → [TYPOGRAPHY.md](TYPOGRAPHY.md)
- Fumadocs theme CSS presets (OSS reference) → `node_modules/fumadocs-ui/css/`
- Foundation phase 32 Slice 3 authority → `docs/PAS/CSS-AUTHORITY/SLICE/[Partially Implemented] tip-032-implementation-documentation.md`
