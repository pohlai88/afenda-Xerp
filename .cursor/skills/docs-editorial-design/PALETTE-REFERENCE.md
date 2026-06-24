# Docs Editorial Palette — Complete Reference

OKLCH color model: `oklch(L C H)` — Lightness (0–1), Chroma (0–0.4), Hue (0–360).
Benefits over HSL: perceptually uniform — equal L values have equal perceived brightness.

**Intent:** porcelain editorial white (light) and graphite charcoal with rail/paper layering (dark). Not beige parchment, not flat dead-black.

---

## Material roles

| Role | Light | Dark | Use |
|------|-------|------|-----|
| `canvas` | Page background | Main content plane | `--color-fd-background` |
| `rail` | Sidebar (recessed) | Sidebar (recessed below canvas) | `#nd-sidebar` only |
| `paper` | Elevated panels | Elevated panels | cards, popovers, search |
| `surface-muted` | Quiet fills | Quiet fills | `--color-fd-muted` |
| `surface-hover` | Hover lift | Hover lift | `--color-fd-accent` |
| `surface-active` | Active nav | Active nav | `#nd-sidebar [data-active="true"]` |
| `code-surface` | Inline code bg | Inline code bg | prose `code` |
| `text-subtle` | Tertiary copy | Tertiary copy | hierarchy without accent |

---

## Light mode token table

| Token name | OKLCH value | L | C | H | Role |
|------------|------------|---|---|---|------|
| `--docs-editorial-canvas` | `oklch(0.985 0.003 95)` | 0.985 | 0.003 | 95 | Page background (porcelain) |
| `--docs-editorial-rail` | `oklch(0.972 0.004 95)` | 0.972 | 0.004 | 95 | Sidebar rail |
| `--docs-editorial-paper` | `oklch(0.998 0.001 95)` | 0.998 | 0.001 | 95 | Cards, popovers, search |
| `--docs-editorial-text` | `oklch(0.18 0.006 260)` | 0.18 | 0.006 | 260 | Primary text (cool near-black) |
| `--docs-editorial-text-muted` | `oklch(0.46 0.01 260)` | 0.46 | 0.01 | 260 | Secondary text, icons |
| `--docs-editorial-text-subtle` | `oklch(0.58 0.008 260)` | 0.58 | 0.008 | 260 | Tertiary text |
| `--docs-editorial-surface-muted` | `oklch(0.955 0.004 95)` | 0.955 | 0.004 | 95 | Muted surfaces |
| `--docs-editorial-surface-raised` | `oklch(1 0 0)` | 1 | 0 | 0 | Pure white lift |
| `--docs-editorial-surface-hover` | `oklch(0.935 0.005 95)` | 0.935 | 0.005 | 95 | Hover surfaces |
| `--docs-editorial-surface-active` | `oklch(0.925 0.006 95)` | 0.925 | 0.006 | 95 | Active nav |
| `--docs-editorial-border` | `oklch(0.88 0.006 95)` | 0.88 | 0.006 | 95 | Borders, dividers |
| `--docs-editorial-border-subtle` | `oklch(0.92 0.004 95)` | 0.92 | 0.004 | 95 | Hairline separators |
| `--docs-editorial-ring` | `oklch(0.52 0.06 255)` | 0.52 | 0.06 | 255 | Focus ring |
| `--docs-editorial-overlay` | `oklch(0.16 0.006 260 / 0.42)` | 0.16 | 0.006 | 260 | Modal backdrop (42% alpha) |
| `--docs-editorial-prose-accent` | `oklch(0.48 0.17 254)` | 0.48 | 0.17 | 254 | Afenda blue — prose links |
| `--docs-editorial-prose-accent-hover` | `oklch(0.42 0.19 254)` | 0.42 | 0.19 | 254 | Prose link hover |
| `--docs-editorial-code-surface` | `oklch(0.955 0.004 95)` | 0.955 | 0.004 | 95 | Inline code background |

---

## Dark mode token table

| Token name | OKLCH value | L | C | H | Role |
|------------|------------|---|---|---|------|
| `--docs-editorial-canvas` | `oklch(0.155 0.004 260)` | 0.155 | 0.004 | 260 | Main content plane (graphite) |
| `--docs-editorial-rail` | `oklch(0.135 0.004 260)` | 0.135 | 0.004 | 260 | Sidebar rail (recessed) |
| `--docs-editorial-paper` | `oklch(0.18 0.004 260)` | 0.18 | 0.004 | 260 | Elevated panels, search |
| `--docs-editorial-text` | `oklch(0.93 0.004 95)` | 0.93 | 0.004 | 95 | Primary text (warm off-white) |
| `--docs-editorial-text-muted` | `oklch(0.68 0.006 260)` | 0.68 | 0.006 | 260 | Secondary text, icons |
| `--docs-editorial-text-subtle` | `oklch(0.56 0.006 260)` | 0.56 | 0.006 | 260 | Tertiary text |
| `--docs-editorial-surface-muted` | `oklch(0.205 0.005 260)` | 0.205 | 0.005 | 260 | Muted surfaces |
| `--docs-editorial-surface-raised` | `oklch(0.19 0.004 260)` | 0.19 | 0.004 | 260 | Raised cards |
| `--docs-editorial-surface-hover` | `oklch(0.235 0.006 260)` | 0.235 | 0.006 | 260 | Hover surfaces |
| `--docs-editorial-surface-active` | `oklch(0.255 0.007 260)` | 0.255 | 0.007 | 260 | Active nav |
| `--docs-editorial-border` | `oklch(0.31 0.006 260)` | 0.31 | 0.006 | 260 | Borders, dividers |
| `--docs-editorial-border-subtle` | `oklch(0.25 0.005 260)` | 0.25 | 0.005 | 260 | Hairline separators |
| `--docs-editorial-ring` | `oklch(0.72 0.055 255)` | 0.72 | 0.055 | 255 | Focus ring |
| `--docs-editorial-overlay` | `oklch(0.05 0.004 260 / 0.68)` | 0.05 | 0.004 | 260 | Modal backdrop (68% alpha) |
| `--docs-editorial-prose-accent` | `oklch(0.72 0.14 254)` | 0.72 | 0.14 | 254 | Afenda blue — prose links |
| `--docs-editorial-prose-accent-hover` | `oklch(0.8 0.13 254)` | 0.8 | 0.13 | 254 | Prose link hover |
| `--docs-editorial-code-surface` | `oklch(0.205 0.005 260)` | 0.205 | 0.005 | 260 | Inline code background |

Dark prose accent uses lighter H254 values for ACPA contrast on graphite canvas.

---

## ACPA contrast requirements (approximate, OKLCH-estimated)

ACPA thresholds: body text ≥ 7:1 · muted text ≥ 4.5:1 · prose accent ≥ 4.5:1.

| Pair | Light mode | Dark mode | ACPA body (7:1) | ACPA muted (4.5:1) |
|------|-----------|-----------|-----------------|-------------------|
| text on canvas | ~15:1 | ~12:1 | ✅ Pass | ✅ Pass |
| text-muted on canvas | ~7:1 | ~6:1 | ✅ Pass | ✅ Pass |
| prose-accent on canvas | ~5.5:1 | ~5.2:1 | — | ✅ Pass |
| text on rail | ~14:1 | ~11:1 | ✅ Pass | ✅ Pass |
| text on paper | ~15:1 | ~11:1 | ✅ Pass | ✅ Pass |

Always re-check with a contrast checker (e.g., oklch.com) when changing L or C values.
Any change that drops a pair below its ACPA threshold must be escalated before merge.

---

## OKLCH manipulation rules

### Adjusting lightness (L)

Lightness is perceptually uniform — moving L by 0.05 has the same visual delta regardless of hue.

- Canvas: L between 0.96–0.99 (light) or 0.14–0.17 (dark)
- Rail: one step darker than canvas (light) or recessed below canvas (dark)
- Paper: slightly elevated above canvas for panel lift
- Text: L between 0.12–0.22 (light) or 0.88–0.96 (dark)

### Adjusting chroma (C)

Low chroma (0.003–0.008) = near-neutral porcelain/graphite. High chroma (0.14+) = saturated accent.

- Shell chrome: keep C very low — barely perceptible warmth or cool cast
- Prose accent: keep C high (0.14+) for brand legibility

### Adjusting hue (H)

| Hue | Role |
|-----|------|
| H95 | Light material (canvas, rail, paper, surfaces) — porcelain, not parchment |
| H260 | Light text + dark material — cool-neutral cast |
| H254 | Brand accent (prose only) — fixed Afenda blue |

Do not introduce a third hue into shell tokens. Do not revert to H85 ivory or H40 warm-grey.

---

## Fumadocs fd-* bridge mapping

| fd token | → editorial token | Semantic meaning |
|----------|------------------|-----------------|
| `--color-fd-background` | `--docs-editorial-canvas` | Page bg |
| `--color-fd-foreground` | `--docs-editorial-text` | Default text |
| `--color-fd-muted` | `--docs-editorial-surface-muted` | Muted surfaces |
| `--color-fd-muted-foreground` | `--docs-editorial-text-muted` | Secondary text |
| `--color-fd-popover` | `--docs-editorial-paper` | Popovers |
| `--color-fd-popover-foreground` | `--docs-editorial-text` | Popover text |
| `--color-fd-card` | `--docs-editorial-paper` | Cards |
| `--color-fd-card-foreground` | `--docs-editorial-text` | Card text |
| `--color-fd-border` | `--docs-editorial-border` | Borders |
| `--color-fd-primary` | `--docs-editorial-text` | Heaviest emphasis (NOT brand) |
| `--color-fd-primary-foreground` | `--docs-editorial-canvas` | Text on primary bg |
| `--color-fd-secondary` | `--docs-editorial-surface-muted` | Secondary surface |
| `--color-fd-secondary-foreground` | `--docs-editorial-text` | Secondary text |
| `--color-fd-accent` | `--docs-editorial-surface-hover` | Hover surface (NOT brand) |
| `--color-fd-accent-foreground` | `--docs-editorial-text` | Text on accent bg |
| `--color-fd-ring` | `--docs-editorial-ring` | Focus ring |
| `--color-fd-overlay` | `--docs-editorial-overlay` | Modal scrim |

Sidebar overrides `#nd-sidebar` to use `rail` for `--color-fd-muted`, `--color-fd-secondary`, and background.

---

## Editorial benchmark calibration

### Stripe — restrained editorial
- Background: near-white porcelain
- Text: deep warm charcoal
- Accent: signature brand indigo — appears once per view
- Rule: *Treat accent like a highlighter pen you only get to use once.*

### Vercel — high-contrast developer
- Background: soft porcelain or layered graphite
- Text: high L differential from background
- Primary blue at inline links ONLY in prose
- Material layering (rail vs canvas vs paper) for depth

### Linear — data-forward monochrome
- Default surface: dark theme with subtle plane separation
- Accent at most once per scroll viewport
- Type recedes so data foregrounds — weight hierarchy without color

### Afenda alignment
The Afenda docs palette blends editorial restraint (Stripe/Vercel) with developer legibility. Light mode uses porcelain H95 — not beige H85 parchment. Dark mode uses graphite H260 with rail/paper/canvas layering — not flat dead-black. Hierarchy comes from material roles and typography rhythm, not shell accent.

---

## Adding a new token — decision tree

```
Need a new color?
│
├─ Is it a neutral surface / text variant?
│   ✓ Add to --docs-editorial-* set
│   ✓ Mirror in contract.ts
│   ✓ Bridge via @theme inline {} if needed for fd roles
│
├─ Is it a material role (rail, paper, code-surface)?
│   ✓ Map to layout selectors (#nd-sidebar, search, prose code)
│   ✓ Do NOT use brand accent
│
├─ Is it brand accent for shell chrome?
│   ✗ STOP — shell chrome stays monochrome
│
├─ Is it a status color (success / warning / error / info)?
│   ✓ Use Fumadocs static preset: --color-fd-success, --color-fd-warning, etc.
│   ✗ Do NOT redefine these
│
└─ Is it a brand accent for prose?
    ✓ Only if it extends the existing --docs-editorial-prose-accent
    ✓ Approve with design authority first
```
