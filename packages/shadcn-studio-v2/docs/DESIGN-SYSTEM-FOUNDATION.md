# Weak CSS vs. Foundation-Layer Design System

> **Non-authoritative pedagogy.** Token law lives in `docs/slices/PHASE-2-TOKEN-AND-CSS-AUTHORITY.md`, `docs/DESIGN-SYSTEM-ARCHITECTURE.md`, and `src/styles/shadcn-default.css`. Agent operating rules live in `.cursor/skills/afenda-erp-design-system/`.

A side-by-side for vibe-coding with Tailwind v4 + shadcn in `@afenda/shadcn-studio-v2`.

The core issue with "weak" CSS is not day-one aesthetics — it is that an AI agent gets **no constraints to reason against**. Every prompt becomes a fresh guess. A foundation layer gives the agent a closed set of valid choices, so drift becomes structurally hard instead of behaviorally hoped-for.

Read each pair as: *what an agent defaults to when unconstrained* → *what forces it onto rails*.

---

## 1. Color

### Weak — ad hoc hex, no semantic layer

```css
.button-primary { background: #4f46e5; }
.button-primary:hover { background: #4338ca; }
.alert-error { background: #fee2e2; color: #b91c1c; }
```

**Why it breaks:** there is no rule the agent can infer. The next prompt invents another near-blue. Dark mode requires re-picking every value.

### Foundation — canonical shadcn semantic pairs (OKLCH)

Package CSS (`src/styles/shadcn-default.css`) owns values only — no `@theme`, no `--brand-*`:

```css
:root {
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.5 0.22 27);
  --destructive-foreground: oklch(0.985 0 0);
  --muted-foreground: oklch(0.48 0 0);
}
.dark {
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
}
```

Consuming app (`apps/erp/src/app/globals.css`) maps to utilities:

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";
@import "@afenda/shadcn-studio-v2/shadcn-default.css";

@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-destructive: var(--destructive);
  --color-muted-foreground: var(--muted-foreground);
}
```

Components use semantic utilities only: `bg-primary`, `text-muted-foreground`, `hover:bg-primary/90` — never `bg-indigo-600`, never hex, never `--brand-*`.

**Why it works:** one valid answer for "primary hover" — opacity on the semantic token. Dark mode is a `.dark` override block. `pnpm --filter @afenda/shadcn-studio-v2 check:apca` validates text pairs mechanically.

---

## 2. Typography

### Weak — sizes picked per component

```jsx
<h1 className="text-[28px] font-bold">Dashboard</h1>
<h1 className="text-[26px] font-semibold">Settings</h1>
<p className="text-[15px] text-gray-600">...</p>
```

**Why it breaks:** bracket values are one-off CSS, not tokens. Plausible numbers diverge across files.

### Foundation — Tailwind scale + semantic role table

| Role | Classes | Where |
| --- | --- | --- |
| page-title | `text-2xl font-semibold tracking-tight` | one `<h1>` per page |
| section-title | `text-lg font-semibold` | card/section headers |
| body | `text-base font-normal` | default copy |
| caption | `text-sm text-muted-foreground` | helper/meta text |
| mono-data | `font-mono text-sm tabular-nums` | IDs, amounts, timestamps |

**Why it works:** the agent picks a *role*, not a pixel size. Geist sans for UI; mono for technical evidence.

---

## 3. Spacing

### Weak — arbitrary values everywhere

```jsx
<div className="mt-[13px] px-[18px] gap-[11px]">
```

### Foundation — closed Tailwind scale

Use the default 4px-based scale (`p-1` … `p-12`, `gap-2`, `gap-4`) as the vocabulary. Document rare optical exceptions in app `@theme inline`, not inline brackets.

**Why it works:** new spacing values show up in review instead of silently drifting. (Arbitrary-value CI lint is a future enhancement; drift gates already block forbidden tokens and raw hex in components.)

---

## 4. Component variants

### Weak — inline conditional strings

```jsx
<button className={`px-4 py-2 ${variant === "danger" ? "bg-red-500" : "bg-indigo-600"}`}>
```

### Foundation — one owner file per primitive

V2 uses `src/components/ui/Button.tsx` (PascalCase per `docs/TAXONOMY.md`). Variants live in one typed map — CVA is optional, not required:

```tsx
const BUTTON_VARIANT_CLASSES = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
} satisfies Record<ButtonVariant, string>;
```

**Why it works:** `destructive` exists once. Extensions add a key to this object — never a new inline ternary in a view.

---

## 5. State coverage

### Weak — default + hover only

```jsx
<button className="bg-primary hover:bg-primary/90">Save</button>
```

### Foundation — full state contract

| State | Required | Behavior |
| --- | --- | --- |
| default | yes | `bg-primary` |
| hover | yes | `hover:bg-primary/90` |
| focus-visible | yes | `focus-visible:ring-2 focus-visible:ring-ring` |
| disabled | yes | `disabled:opacity-50 disabled:pointer-events-none` |
| loading | yes (async) | `state="loading"`, `aria-busy`, disabled while pending |

```tsx
<Button state={isPending ? "loading" : "idle"} disabled={isPending}>
  Save
</Button>
```

---

## 6. Elevation and z-index

### Weak — magic numbers

```jsx
<div className="z-[999] shadow-lg">  {/* dropdown */}
<div className="z-[50] shadow-md">   {/* modal — under dropdown! */}
```

### Foundation — named layers (recommended future)

| Layer | z-index | Shadow | Used by |
| --- | --- | --- | --- |
| raised | 10 | shadow-xs | card, focused input |
| overlay | 20 | shadow-md | dropdown, popover, tooltip |
| sticky | 30 | shadow-sm | sticky header/toolbar |
| modal | 40 | shadow-xl | dialog, sheet |
| toast | 50 | shadow-lg | notifications |

**Status:** pedagogical target — not yet a enforced V2 gate. Prefer Radix/shadcn primitives that manage stacking. Do not invent `z-[n]` in new code.

---

## 7. Enforcement

### Weak — a style guide nobody checks

Prose rules the agent forgets by turn 40.

### Foundation — machine-checkable Afenda gates

```md
# packages/shadcn-studio-v2/AGENTS.md + afenda-erp-design-system skill
- Colors: semantic utilities only — no hex, no raw palette, no --brand-* / --afenda-* / --surface-*
- Variants: one owner per primitive under src/components/ui/*.tsx
- States: default, hover, focus-visible, disabled (+ loading for actions)
- CSS split: package :root/.dark values; app @theme inline mapping
- Public imports only: @afenda/shadcn-studio-v2 barrels — never src/**
```

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift    # forbidden tokens, hex, CSS law
pnpm --filter @afenda/shadcn-studio-v2 check:apca     # contrast on semantic pairs
pnpm --filter @afenda/shadcn-studio-v2 quality        # full package gate set
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio-v2  # after CSS edits
```

---

## Summary

| | Weak / ordinary | Foundation layer |
| --- | --- | --- |
| Unit of decision | a value (`#4338ca`, `13px`) | a token + role (`bg-primary`, `text-sm caption`) |
| Where variants live | wherever someone last needed one | one `Button.tsx` (or CVA) per primitive |
| How correctness is checked | eyeballing / never | `check:drift`, `check:apca`, taxonomy tests |
| When unsure | invents a plausible value | picks from a closed, named set |
| Failure mode | silent visual entropy | loud violations at diff/CI time |

The foundation layer is not more CSS — it is the same CSS with ambiguity removed. Agents cannot feel when something is slightly off; they can only follow or violate an explicit rule.
