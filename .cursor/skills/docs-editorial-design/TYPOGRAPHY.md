# Docs Editorial Typography

Typography system for `@afenda/docs`. Two-family editorial pairing: humanist sans + classical serif.

---

## Font pair

### Source Sans 3 — body / UI

- **Role:** Body copy, UI labels, nav items, sidebar, metadata
- **Variable:** `--font-docs-body` (Next.js loader `docsBodyFont`)
- **Fallback stack:** `"Source Sans 3", ui-sans-serif, system-ui, sans-serif`
- **Rationale:** Open-source humanist sans with excellent rendering at small sizes; wide language coverage; familiar in editorial contexts (used in Stripe documentation, Adobe)

### Source Serif 4 — display / headings

- **Role:** Page titles (h1 via `<DocsTitle>`), section headings (h2–h4), blockquotes
- **Variable:** `--font-docs-display` (Next.js loader `docsDisplayFont`)
- **Fallback stack:** `"Source Serif 4", ui-serif, Georgia, serif`
- **Rationale:** Optical-size aware, designed for screen rendering; paired with Source Sans by Adobe for reading-first contexts; creates clear editorial hierarchy

**Do not** pair a third typeface. Do not use Inter or Geist (those are developer-tool patterns; Afenda docs is editorial-first).

---

## Type scale

| Level | Element | Size | Line height | Weight | Family |
|-------|---------|------|-------------|--------|--------|
| Page title | `<DocsTitle>` / h1 | 2rem (32px) | 1.25 | 600 | Serif |
| Section | h2 | 1.5rem (24px) | 1.3 | 600 | Serif |
| Sub-section | h3 | 1.25rem (20px) | 1.35 | 600 | Serif |
| Detail | h4 | 1.125rem (18px) | 1.4 | 600 | Serif |
| Body | p | 1rem (16px) | 1.7 | 400 | Sans |
| Code inline | `code` | 0.875em | inherit | 400 | Mono (Fumadocs) |
| Small / meta | `.text-sm` | 0.875rem (14px) | 1.5 | 400 | Sans |
| Muted label | nav, sidebar items | 0.8125rem (13px) | 1.4 | 400 | Sans |

**Minimum body size:** 14px / 0.875rem. Never set body text below this.

---

## Optical sizing and kerning

```css
/* Applied to all headings in prose */
.nd-page .prose :is(h1, h2, h3, h4) {
  font-family: var(--font-serif);
  font-optical-sizing: auto;    /* Activates optical size axis on variable fonts */
  letter-spacing: -0.015em;    /* Tight tracking — standard for display serif */
  text-wrap: balance;          /* CSS4 — prevents short last-line orphans in headings */
}

/* Applied to prose body */
.nd-page .prose {
  font-feature-settings: "liga", "kern"; /* Ligatures + kerning */
  line-height: 1.7;                      /* Generous — 1.6–1.8 is editorial range */
  text-wrap: pretty;                     /* CSS4 — reduces widow words in paragraphs */
}
```

**`text-wrap: balance`** — headings only. Prevents `<h2>One Short<br>Word` break.
**`text-wrap: pretty`** — body paragraphs. Does not change line count, just final line distribution.

---

## Code and monospace

Fumadocs' built-in code block uses its own mono font (via Shiki). Do not override the code block font.

Inline code (`\`backtick\``) inherits from Fumadocs defaults.

When a page needs a monospace UI element outside of code blocks:

```css
font-family: ui-monospace, "Geist Mono", "JetBrains Mono", monospace;
```

Do not use `--font-mono` unless it is added to `docs-fonts.constants.ts` first.

---

## Blockquote rule

Blockquotes in prose use serif italic + left border in prose accent:

```css
.nd-page .prose blockquote {
  max-width: 55ch;                /* Narrower than body — visual distinction */
  font-family: var(--font-serif);
  font-style: italic;
  border-inline-start: 3px solid var(--docs-editorial-prose-accent);
}
```

This is the only location besides prose links where brand accent appears.

---

## Benchmark calibration

| Site | Body | Display | Prose width | Line height |
|------|------|---------|-------------|-------------|
| Stripe docs | Source Sans Pro | N/A (Söhne) | ~65ch | 1.6 |
| Vercel docs | Geist Sans | Geist Sans heavy | ~70ch | 1.6 |
| Linear | Inter | Inter heavy | ~60ch | 1.5 |
| NY Times (editorial ref) | Georgia / NYT Cheltenham | NYT Cheltenham Display | ~65ch | 1.7 |
| **Afenda docs** | **Source Sans 3** | **Source Serif 4** | **65ch** | **1.7** |

Afenda targets the editorial end of this spectrum — closer to NYT and Stripe than Linear.

---

## Forbidden typography patterns

| Pattern | Why wrong | Fix |
|---------|-----------|-----|
| `font-family: Inter` hardcoded | Bypasses font system | `var(--font-sans)` |
| `font-family: Söhne` | Not licensed in this project | Use Source Serif for display |
| `line-height: 1.4` on body | Too tight for reading comfort (ACPA) | Min 1.6 |
| Body text smaller than 14px | ACPA readability threshold | 14px minimum |
| Three font families | Visual noise | Sans + Serif only |
| Heading with `font-weight: 700` and `letter-spacing: 0` | Looks clamped | Use -0.015em tracking |
| Missing `font-optical-sizing: auto` on variable font | Loses optical refinement | Add to heading rule |
| `text-transform: uppercase` on body | Breaks readability at scale | Headers only if needed |
| Muted text below 4.5:1 contrast | ACPA muted-text threshold | Adjust L value upward |
| Prose accent below 4.5:1 on surface | ACPA link contrast | Darken accent L in light mode |

---

## Adding a new font — decision tree

```
Need a new font?
│
├─ Is it a mono font for code display?
│   ✓ Use Fumadocs Shiki default — no new loader needed
│   ✓ If must customize: add to docs-fonts.constants.ts first
│
├─ Is it a display alternative to Source Serif?
│   ✗ Requires Design Authority approval (TIP-032 Slice 3+)
│   ✓ If approved: add to docs-fonts.ts loader + docs-fonts.constants.ts
│
└─ Is it a third body font?
    ✗ STOP — two families only
```

## Next.js font loader rules

1. `variable` string must match the literal in `docs-fonts.constants.ts`
2. Next.js does not accept variable references in `variable:` — must be a string literal
3. Both fonts must be loaded in `src/lib/docs-fonts.ts` and applied in `src/app/layout.tsx`
4. Font class names are composed via `docsFontClassNames` from `docs-fonts.ts`
