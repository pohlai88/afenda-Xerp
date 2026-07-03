# React best practices bridge (Vercel → Afenda primitives)

**Source validated:** vendor skill `react-best-practices` / `vercel-react-best-practices` (Vercel Engineering, 2026).

**Scope:** `@afenda/shadcn-studio` **adapter** files (`components-ui/{name}.tsx`) and **ERP consumers** of primitives — not RSC loaders or kernel.

**Pairs with:** [mismatch-inspection-frame.md](mismatch-inspection-frame.md) (M1–M10) · [composition-patterns-bridge.md](composition-patterns-bridge.md)

---

## Validation summary

| Afenda pattern | Vercel rule | Verdict |
| --- | --- | --- |
| Tailwind in `.contract.ts`, not inline styles | `js-batch-dom-css` | **Strong match** — contract classes = batched CSS class toggles |
| Base UI owns open/selected state | `rerender-derived-state-no-effect` | **Strong match** — aligns with **M2** |
| Compound exported parts | `architecture-compound-components` (composition skill) | **Match** |
| No inline subcomponents in adapter | `rerender-no-inline-components` | **Match** — already SKILL §5 rule 11 |
| `GovernedPrimitiveProps` string `className` | `js-batch-dom-css` + consumer layout-only | **Match** — consumers don't thrash styles |
| Two-icon CSS hide/show (accordion) | `rendering-animate-svg-wrapper` | **Better than rotate-on-SVG** for lucide |
| Recipe wrappers not boolean modes | `patterns-explicit-variants` | **Match** (composition bridge) |
| `composeClassName` in adapter | `js-batch-dom-css` | **Target** — prefer over raw `cn(base, className)` in adapters |

---

## P1–P8 adapter performance checklist (E0 optional pass)

Run on interactive primitives during E0 or gold promotion.

| ID | Vercel rule | Adapter check | Mismatch link |
| --- | --- | --- | --- |
| **P1** | `rerender-no-inline-components` | No `function Sub()` inside `AccordionTrigger` etc. | — |
| **P2** | `rerender-derived-state-no-effect` | No `useEffect` syncing open/selected/value Base UI already owns | **M2** |
| **P3** | `js-batch-dom-css` | No `style={{}}` for visual meaning; contract classes only | **M3**, **M8** |
| **P4** | `rendering-animate-svg-wrapper` | If **one icon + rotate**, wrap lucide in `<span className="…">` — never `rotate` on `<svg>` root | **M1** |
| **P5** | `bundle-barrel-imports` | Adapters: named `lucide-react` imports (OK with Next `optimizePackageImports`). ERP hot paths: narrow imports from `@afenda/shadcn-studio`, not accidental full barrel | — |
| **P6** | `rendering-conditional-render` | Numeric/`0` conditions: ternary not `&&`. Icon open/closed: prefer CSS `hidden`/`inline` (both mounted) or explicit ternary | **M1** |
| **P7** | `rerender-memo-with-default-value` | Default non-primitive props (`[]`, `{}`, `() => {}`) hoisted to module constants | — |
| **P8** | `rendering-hoist-jsx` | Optional: module-scope static decorative nodes if profiling shows cost — not required for gold | — |

**Not in scope for primitive adapters:** `async-*`, `server-*`, `client-swr-*` — route to `afenda-react-surface-quality` for ERP pages.

---

## What we adopt

### Contract = batched CSS (P3)

Vercel prefers class toggles over interleaved style writes. Afenda **requires** visual meaning in `{name}.contract.ts`:

```ts
// Correct — single class recipe, browser batches
export const accordionTriggerClassName = "… focus-visible:ring-[3px] …" as const;
```

```tsx
// Incorrect — inline style or effect-driven style writes
useEffect(() => { ref.current!.style.height = "…" }, [open])
```

Height animation must use upstream vars (`--accordion-panel-height`) + data attributes (**M7**), not JS layout reads.

### One state source, no effect mirror (P2 + M2)

```tsx
// Incorrect
const [open, setOpen] = useState(false)
useEffect(() => { setOpen(props.value) }, [props.value])
```

Base UI Root / Item owns state — adapter passes controlled props through only.

### Icon animation strategy (P4 + M1)

| Strategy | Vercel guidance |
| --- | --- |
| Two icons + CSS hide/show | OK — no SVG transform needed (accordion gold) |
| One icon + rotate | Wrap icon: `<span className="transition-transform group-data-[open]:rotate-180"><ChevronDown /></span>` |

Never combine rotate + two icons (**M1**).

### No inline components (P1)

Already SKILL §5 rule 11. Symptoms if violated: focus loss, animation restart, spurious effect runs.

### Lucide / barrel imports (P5)

Primitive adapters may use:

```tsx
import { ChevronDownIcon } from "lucide-react";
```

ERP apps should import primitives from `@afenda/shadcn-studio` public exports; avoid deep paths. Next.js ERP should keep `optimizePackageImports` for `lucide-react` (see `apps/erp/next.config.ts`).

---

## What we do not copy blindly

| Vercel rule | Afenda reason |
| --- | --- |
| `rerender-memo` on every part | Primitives are thin; memo only when profiler proves need |
| `bundle-dynamic-imports` inside adapter | Heavy splits belong in **blocks/ERP routes**, not base button/accordion |
| `rendering-hoist-jsx` mandatory | Contract + small adapters usually sufficient |
| `composeClassName` supports function `className` | **Consumers** use `GovernedPrimitiveProps` (string only); function support is adapter-internal if Base UI requires it — do not expose to ERP |
| React Compiler auto-hoist | Document only — do not skip P1/P2 checks because compiler may exist |

---

## Mismatch frame crosswalk

| M rule | P rule |
| --- | --- |
| M1 one visual mechanism | P4, P6 |
| M2 one state source | P2 |
| M3 class must have a job | P3 |
| M7 animation = upstream | P3, P4 |
| M8 default usable without className | P3 |

---

## E0 invoke (performance add-on)

```txt
After M1–M10, run P1–P8 adapter performance checklist from react-best-practices-bridge.md.
Report failures using the same Mismatch/Expected/Actual/Why/Fix/Acceptance format.
```

---

## When to read vendor skill

Read `react-best-practices` when:

- Adapter adds `useEffect`, `useState`, or `memo`
- Icon animation uses transform on lucide SVG directly
- Inline styles appear in primitive TSX
- ERP bundle audit flags `@afenda/shadcn-studio` barrel on hot routes

Do **not** replace `afenda-primitive-contract` or `afenda-react-surface-quality` — this bridge covers **adapter micro-patterns** only.
