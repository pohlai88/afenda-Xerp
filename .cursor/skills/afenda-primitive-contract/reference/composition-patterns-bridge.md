# Composition patterns bridge (Vercel → Afenda primitives)

**Source validated:** vendor skill `vercel-composition-patterns` (Vercel Engineering, 2026).

**Afenda mapping:** PAS-006 primitive + contract + recipe — not monolithic `@afenda/ui` governance.

**V2 (`@afenda/shadcn-studio-v2`):** use [react-composition-patterns.md](../../afenda-erp-design-system/references/react-composition-patterns.md) — authoritative for `packages/shadcn-studio-v2/src/components/ui/**`. This bridge remains for v1 `afenda-primitive-contract` + recipes.

---

## What we adopt

| Vercel rule | Afenda application |
| --- | --- |
| **architecture-avoid-boolean-props** | No `isCard`, `isFAQ`, `isDense` on base `Accordion` / `Dialog` / `Tabs`. Visual modes → **recipe files** or explicit wrapper components. |
| **patterns-explicit-variants** | `AccordionSurface`, `AccordionFAQ` compose neutral primitive parts — do not add boolean modes to `AccordionRoot`. |
| **architecture-compound-components** | Base UI anatomy maps to **exported parts** (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`) — same compound shape, governed slots in contract. |
| **patterns-children-over-render-props** | Prefer `children` in blocks/layouts; avoid `renderTrigger` / `renderPanel` on primitives unless Base UI requires it. |
| **state-decouple-implementation** | Open/close state lives in **Base UI Root** — adapter does not mirror with parallel `useState`. |
| **react19-no-forwardref** | Adapter uses ref-as-prop (already in [SKILL.md §5](../SKILL.md)). |

---

## What we do not copy blindly

| Vercel pattern | Afenda reason |
| --- | --- |
| App-specific `Composer.Provider` context | Primitives wrap **Base UI** state; extra provider layers only in blocks/app shell. |
| Generic `state/actions/meta` context interface | ERP uses **contract metadata** (`{name}PrimitiveMetadata()`) for diagnostics, not runtime DI context on every widget. |
| Eliminating all variant props | **cva in contract** is allowed for size/intent on `button`, `toggle`, etc. — boolean *mode* props are banned, not cva axes. |

---

## Primitive vs recipe (explicit variants)

```txt
Primitive     = neutral parts + contract classes + GovernedPrimitiveProps
Recipe        = named composition + decorative surface classes
Block         = domain layout composing recipes + primitives
```

**Correct:**

```tsx
// Neutral primitive — ERP-safe everywhere
<Accordion>...</Accordion>

// Explicit recipe — marketing FAQ page only
<AccordionFAQ>...</AccordionFAQ>
```

**Incorrect:**

```tsx
<Accordion variant="faq" isCard bordered />
```

---

## Mismatch frame alignment

| Mismatch rule | Composition pattern |
| --- | --- |
| M4 primitive neutrality | `patterns-explicit-variants` |
| M9 duplicate meaning | `architecture-avoid-boolean-props` |
| M2 one state source | `state-decouple-implementation` |
| Compound anatomy | `architecture-compound-components` |

---

## When to read vendor skill

Read `vercel-composition-patterns` when:

- Adding a new **recipe** or block wrapper
- Tempted to add a boolean prop for visual mode
- Refactoring monolithic primitive into parts

Do **not** replace `afenda-primitive-contract` — use this bridge for API shape only.

**See also:** [react-best-practices-bridge.md](react-best-practices-bridge.md) (adapter P1–P8).
