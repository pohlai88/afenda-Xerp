# DOM inspector — read before writing selectors

The root cause of the longest visual bug loop in this repo was writing CSS selectors
from memory instead of inspecting the rendered markup. This file encodes the mandatory
DOM inspection step.

---

## Rule

Before writing **any** CSS selector or className override that targets a library component
(Fumadocs, Radix, shadcn, Lucide, Recharts), you must:

1. Identify which npm package owns the component.
2. Read the dist file (Shell or Read tool — NOT memory).
3. State which real class names, data attributes, or IDs are emitted.
4. Only then write the selector.

This takes < 30 seconds. It saved 3 turns on the `.nd-card` vs `[data-card]` incident.

---

## Fumadocs 16 — confirmed real selectors

These were verified from dist. Use them directly:

```css
/* Card link wrapper */
[data-card]                         /* NOT .nd-card */

/* Content pane */
#nd-page
#nd-page .prose

/* Sidebar */
#nd-sidebar
#nd-sidebar [data-active="true"]

/* TOC */
#nd-toc
#nd-toc a[data-active="true"]

/* Search trigger */
button[data-search-full]
button[data-search-full] kbd

/* Dark mode */
.dark
:is(.dark, [data-theme="dark"])

/* Inline toc */
.nd-inline-toc a
```

When unsure, check the dist:

```bash
# PowerShell / bash — search for real class names
Select-String -Path "apps/docs/node_modules/fumadocs-ui/dist/components/card.js" -Pattern "data-" | Select-Object -First 20
```

---

## Radix UI — confirmed real selectors

Radix uses `data-state`, `data-orientation`, `data-side`, `data-align`, `data-highlighted` etc:

```css
[data-state="open"]
[data-state="closed"]
[data-highlighted]
[data-disabled]
[data-orientation="horizontal"]
```

Radix does NOT use meaningful class names — always use `data-*` attributes.

---

## shadcn/ui — confirmed real patterns

shadcn copies source and wraps Radix. Real selectors come from:
1. The pasted component source in `packages/ui/src/components/`
2. The Radix dist attributes above

Do not rely on shadcn's own docs for class names — the repo may have modified them.

---

## How to inspect when in doubt

### Option A: Read the dist file directly

```bash
# Read first 60 lines of a Fumadocs component dist
Get-Content "apps/docs/node_modules/fumadocs-ui/dist/components/card.js" | Select-Object -First 60
```

### Option B: grep for data-* attributes

```powershell
Select-String -Path "apps/docs/node_modules/fumadocs-ui/dist/**/*.js" -Pattern 'data-[a-z]' -Recurse | Select-Object -First 30
```

### Option C: use the browser DevTools inspector

If the dev server is running: open DevTools → inspect the element → copy the real attribute.

---

## Documenting what you found

In the Preflight Receipt, fill the DOM inspection table:

```
| Component | Dist file read | Real selector confirmed |
|-----------|---------------|------------------------|
| Card | apps/docs/node_modules/fumadocs-ui/dist/components/card.js | [data-card] |
| Sidebar | apps/docs/node_modules/fumadocs-ui/dist/components/sidebar.js | #nd-sidebar |
```

Undocumented selectors → hard stop.
