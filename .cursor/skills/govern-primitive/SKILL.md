---
name: govern-primitive
description: Audits and upgrades @afenda/ui primitive components (author layer) and consumer packages (appshell, erp wiring) to 9.5 enterprise governance quality. Covers resolvePrimitiveGovernance(), forwardRef, slot factories, GovernedXxxProps, TIP-004 className policy, shadcn-studio block integration, and static checker verification. Use when reviewing packages/ui/src/components OR when composing @afenda/ui in packages/appshell or apps/erp.
---

# govern-primitive

Applies the enterprise governance pattern established for Button / Badge / Card / Alert / Field / Table to any `@afenda/ui` primitive.

## Audit checklist (score one point per ✅, target 9.5/10)

Run this before touching code. Read the component file first, then read its registry entry in `primitive-registry.ts`.

```
[ ] 1.  resolvePrimitiveGovernance() is the ONLY class authority — no local cn(), cva(), or Tailwind
[ ] 2.  className accepted only as governed extension point — Omit<..., "className"> + readonly className?
[ ] 3.  All GovernedXxxProps own state?: GovernedState — no local state?: string anywhere
[ ] 4.  Prop spread order: {...props} first → semantic data-* middle → {...governed.dataAttributes} LAST
[ ] 5.  Root uses forwardRef + displayName
[ ] 6.  Every public slot uses forwardRef + displayName (use slot factory when ≥3 identical slots)
[ ] 7.  Every governance call includes recipeName (traceability)
[ ] 8.  Slot names and emitted data-slot DOM values match primitive-registry.ts exactly
[ ] 9.  No "use client" unless client APIs are genuinely required
[ ] 10. No raw Tailwind/class strings passed into Slot or sub-primitive className props
[ ] 11. Accessibility semantics are preserved and tested
[ ] 12. Deprecated props only bridge into canonical governed props — canonical wins
[ ] 13. Render tests prove consumer data-* cannot override governed data-*
[ ] 14. Public exports remain stable after upgrade
[ ] 15. pnpm --filter @afenda/ui check:governance passes
```

**Scoring:**

| Score | Meaning |
|-------|---------|
| 14–15 | Accepted — 9.5+ |
| 12–13 | Conditionally accepted — document the gap |
| < 12  | Not accepted — fix blockers before merge |

---

## Critical non-negotiable rules

1. **Do not invent local visual APIs.**
   Any prop that changes visual output must be owned by `GovernedXxxProps` and passed into `resolvePrimitiveGovernance()`.

2. **Do not invent local slot names.**
   Slot roles and emitted `data-slot` values must come from `primitive-registry.ts`.

3. **Do not assume internal slot role equals emitted DOM `data-slot`.**
   Tests must assert the actual emitted DOM value (e.g. `"table-cell"`, not `"cell"`).

4. **Do not let consumer props override governed attributes.**
   `{...governed.dataAttributes}` must be after `{...props}` and after semantic `data-*` attributes.

5. **Do not use raw Tailwind strings in primitives.**
   This includes sub-primitives such as Separator, Label, Slot children, wrappers, and inner spans.

6. **Do not keep `"use client"` unless required** by hooks, browser APIs, event state, or client-only dependencies.

7. **Do not migrate React ref strategy component-by-component.**
   Keep `forwardRef` until a package-wide React 19 ref-as-prop migration is approved.

8. **Do not replace static governance checks with Vitest.**
   Vitest verifies rendered behavior. The static checker verifies source architecture.

9. **Deprecated props are compatibility bridges only.**
   They must map into canonical governed props, canonical props must win, and deprecated props must not emit their own visual `data-*` API.

10. **Every fix must be covered by a Vitest render test or governance unit test.**

---

## Test-first rule

Before changing implementation, add or update failing tests for the violation.

Required sequence:

1. Add failing Vitest render test or governance unit test.
2. Run targeted test — confirm it fails.
3. Fix implementation.
4. Re-run targeted test — confirm it passes.
5. Run full `@afenda/ui` verification suite.

Never perform broad implementation rewrites without a failing or missing governance test first.

---

## Step-by-step workflow

### 1. Read sources

```
packages/ui/src/components/<name>.tsx
packages/ui/src/governance/component-props.ts       (GovernedXxxProps)
packages/ui/src/governance/primitive-registry.ts    (slots, slotClassNames, dataSlotByRole, dataSlotByKey)
packages/ui/src/governance/recipe-maps.ts           (slotClassNames, slotClassNamesByKey)
packages/ui/src/index.ts                            (public exports)
```

### 2. Score against checklist

State each item as ✅ / ❌ and give a `/15` total.
Report blockers (items that must fix before acceptance).

### 3. Add failing tests (test-first rule)

Write a Vitest render test asserting the governance violation before touching the implementation.

### 4. Fix in dependency order

```
1. component-props.ts     — add state?: GovernedState to GovernedXxxProps if missing
2. recipe-maps.ts         — add/fix SlotClassMap keys for any new slotKey entries
3. primitive-registry.ts  — align slots[], dataSlotByRole, slotClassNames, slotClassNamesByKey, dataSlotByKey
4. primitive-governance.ts — add recipe-shell guard for new component if non-root slots must not inherit recipe classes
5. component file         — apply full pattern (see canonical shape below)
6. tests                  — confirm all render/governance tests pass
7. packages/ui/src/index.ts — verify exports unchanged or update as needed
```

### 5. Verify

```bash
pnpm --filter @afenda/ui typecheck
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/ui check:governance
pnpm --filter @afenda/ui build
```

If the primitive touched public exports, also run:

```bash
pnpm quality
```

---

## Emitted data-slot rule

Do not assume the internal slot role name equals the emitted `data-slot` DOM value.

Always verify the emitted value from:

- `primitive-registry.ts` → `dataSlotByRole` / `dataSlotByKey`
- existing render tests

Known examples of role ≠ emitted value:

| Internal role | Emitted data-slot |
|---------------|-------------------|
| `"root"` (button) | `"button"` |
| `"root"` (badge) | `"badge"` |
| `"header"` (card) | `"card-header"` |
| `"title"` (alert) | `"alert-title"` |
| `"label"` (field) | `"field-label"` |
| `"cell"` (table) | `"table-cell"` |

Tests must assert the actual emitted DOM value:

```tsx
expect(element).toHaveAttribute("data-slot", "table-cell");
// NOT: "cell"
```

---

## Registry mutation rule

Do not invent new slots in component files.

If a slot is missing:

1. Check whether an existing `slotKey` or `SlotRole` should be used.
2. Check `primitive-registry.ts`.
3. Check `recipe-maps.ts`.
4. Only add a new slot after confirming the component needs a new governed DOM part.

Every new slot must update **all four** of:

- `slots[]`
- `dataSlotByRole` or `dataSlotByKey`
- `slotClassNames` or `slotClassNamesByKey`
- render tests asserting the new `data-slot` value

---

## Deprecated prop bridge rule

Deprecated props may exist only as compatibility bridges.

Rules:

- Deprecated prop must map into the canonical governed prop.
- Canonical prop always wins when both are set.
- Deprecated prop must not emit its own `data-*` visual attribute.
- New internal usage must never use the deprecated prop.
- Add a render test proving canonical prop wins.

Example (Alert `variant` → `tone`):

```tsx
// Resolved before governance call:
const resolvedTone = tone ?? (variant === "destructive" ? "danger" : undefined) ?? "neutral";
// Then: resolvePrimitiveGovernance({ ..., variant: { tone: resolvedTone } })
// No data-variant is ever emitted.
```

---

## Accessibility rule

Accessibility semantics must be preserved and tested. Key patterns:

**Button:**
- Native `<button>` defaults to `type="button"`.
- `asChild` + `disabled` uses `aria-disabled` + `tabIndex=-1` (not HTML `disabled`).
- Caller `aria-disabled` is preserved; governance does not override it.

**Alert:**
- `danger` / `warning` tones → `role="alert"` (live region, assertive).
- `neutral` / `info` / `success` tones → `role="status"` (live region, polite).
- Caller may override `role` via props (placed before `governed.dataAttributes`).

**Field:**
- `FieldLabel` must associate with its control via `htmlFor` / `id`.
- `FieldError` uses `role="alert"`.
- Empty error renders `null` — no empty alert in the DOM.

**Table:**
- Preserve native `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` semantics.
- No div-based fake table unless it is an explicitly separate, purposely presentational component.

Checklist item 11 requires at least one accessibility-focused render test per primitive.

---

## Data authority test rule

Every primitive must include at least one test proving consumer `data-*` props cannot override governed attributes:

```tsx
render(<Button data-intent="danger" intent="primary" />);
expect(screen.getByRole("button")).toHaveAttribute("data-intent", "primary");
```

This is the most important regression guard. It must exist before marking checklist item 13 ✅.

---

## Public API rule

After changing a primitive, verify exports through:

- `packages/ui/src/index.ts`
- package subpath exports if applicable
- existing import style from downstream apps (`apps/erp/src/...`)

Do not create private-only upgraded components that are not consistently exported.
Do not remove or rename exports without a deprecation plan.

---

## Static checker boundary

Vitest cannot reliably catch:

- banned imports
- raw Tailwind string literals in source
- local `cva()` usage
- deep design-system imports
- file boundary violations

After implementation, always run:

```bash
pnpm --filter @afenda/ui check:governance
```

This is checklist item 15 and is not optional.

---

## Canonical component shape

### Single-root, no slots (e.g. Input, Textarea, Label)

```tsx
export interface XxxProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "className">,
    GovernedXxxProps {
  readonly className?: string;
}

const Xxx = React.forwardRef<HTMLElement, XxxProps>(
  ({ className, state, /* governed axes */, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Xxx",
      recipeName: "xxx-recipe",
      variant: { /* axes */ },
      state,
      slot: "root",
      className,
    });

    return (
      <element
        ref={ref}
        {...props}
        data-axis={axis}          // semantic data-* before governed
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);
Xxx.displayName = "Xxx";
```

### Multi-slot with factory (e.g. Card, Alert, Table)

```tsx
const XXX_RECIPE_NAME = "xxx-recipe" as const;

// Central slot map — auditable against primitive registry
const XXX_SLOT_ROLES = {
  header: "header",
  body:   "body",
} as const satisfies Record<string, SlotRole>;

interface XxxSlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

function createXxxSlot(displayName: string, slot: keyof typeof XXX_SLOT_ROLES) {
  const XxxSlot = React.forwardRef<HTMLDivElement, XxxSlotProps>(
    ({ className, ...props }, ref) => {
      const governed = resolvePrimitiveGovernance({
        componentName: "Xxx",
        recipeName: XXX_RECIPE_NAME,
        slot: XXX_SLOT_ROLES[slot],
        className,
      });
      return (
        <div ref={ref} {...props} {...governed.dataAttributes} className={cn(governed.className)} />
      );
    }
  );
  XxxSlot.displayName = displayName;
  return XxxSlot;
}
```

### `asChild` root (e.g. Button, Badge)

```tsx
const Comp = asChild ? Slot : "button";
// ...
return (
  <Comp
    ref={ref}
    {...props}
    type={resolvedType}
    disabled={asChild ? undefined : disabled}
    aria-disabled={asChild && disabled ? true : ariaDisabled}
    tabIndex={asChild && disabled && tabIndex === undefined ? -1 : tabIndex}
    data-intent={intent}
    {...governed.dataAttributes}   // ALWAYS last
    className={cn(governed.className)}
  />
);
```

---

## Common issues by component type

| Component type | Typical blockers |
|----------------|-----------------|
| Form leaf (Input, Textarea, Checkbox) | `state?: string`, no `forwardRef`, props before `dataAttributes` |
| Overlay (Dialog, Sheet, Drawer) | Raw Tailwind in sub-components, no `recipeName` on slots |
| Navigation (Tabs, Breadcrumb) | Slot names invented locally, no slot factory |
| Feedback (Toast, Spinner) | `"use client"` without need, local state string |
| Data display (Avatar, Badge, Skeleton) | Local variant map instead of governance resolver |

---

## GovernedXxxProps state rule

`GovernedXxxProps` in `component-props.ts` must include `state`:

```ts
import type { GovernedState } from "./design-system";

export interface GovernedXxxProps {
  // ... variant axes
  readonly state?: GovernedState;   // ← required for 9.5
}
```

Never accept `state?: string` on the component interface. The governance resolver (`resolveGovernedState`) validates and narrows it.

---

## Governance data-* attribute rule

Consumer props must NEVER override governed attributes. Correct prop order:

```tsx
<element
  {...props}                    // 1. consumer (can set anything)
  data-custom={custom}          // 2. semantic component data-*
  {...governed.dataAttributes}  // 3. governance (wins — always last)
  className={cn(governed.className)}
/>
```

---

## recipeName traceability rule

All slot governance calls must specify `recipeName`:

```ts
// ✅ Traceable
resolvePrimitiveGovernance({ componentName: "Card", recipeName: "card", slot: "header", className })

// ❌ Ambiguous — do not ship
resolvePrimitiveGovernance({ componentName: "Card", slot: "header", className })
```

---

See [PATTERNS.md](PATTERNS.md) for reference implementations of every pattern.

---

## Consumer layer — `@afenda/ui` in appshell / app wiring

**Scope:** `packages/appshell/**`, `apps/erp/**` (composition only — not primitive source).

This is the gap that caused shadcn-studio debugging hell: blocks paste `className` onto governed primitives; runtime throws TIP-004 in Vitest.

### Consumer checklist (score one point per ✅, target 8/8)

```
[ ] 1.  Import @afenda/ui and @afenda/ui/governance directly — no local re-export barrels
[ ] 2.  No CSS modules for shell chrome when globals.css already @source's the package
[ ] 3.  Governed primitives use props only — zero className on Button, Dialog*, Sheet*, Dropdown*, Sidebar*, Avatar, Badge, Tabs*, Combobox*, InputGroup*, Kbd, etc.
[ ] 4.  Shell layout / studio chrome on plain HTML wrappers (div, span, header) only
[ ] 5.  shadcn-studio blocks live under packages/appshell/src/shadcn-studio/blocks/
[ ] 6.  Stock shadcn variants mapped via mapStockButtonProps from @afenda/ui/governance — no stock-props.ts, no raw variant strings
[ ] 7.  Integration render test exists (AppShell mounts without TIP-004 throw)
[ ] 8.  pnpm --filter @afenda/appshell test:run passes (includes governed-ui-consumption static test)
```

### Consumer anti-patterns (from production incidents)

| Anti-pattern | Why it breaks | Fix |
|--------------|---------------|-----|
| `<SheetContent className="gap-0 …">` | TIP-004 runtime throw | Remove className; use default recipe |
| `packages/appshell/src/governance/index.ts` re-exporting ui/governance | Confusing indirection, file sprawl | Import at call site |
| `shell-surfaces.module.css` parallel to globals.css | Duplicate token surface | Use globals.css tokens on plain divs |
| `<Button className="relative">` for badge dot | layout className blocked | Wrap in `<div className="relative">` |
| Installing @ss-blocks into packages/ui | Internal #/ imports break | Blocks in appshell; primitives from @afenda/ui |

### Consumer verification

```bash
# All four gates at once (fastest first):
pnpm ui:guard

# Shorthand variants:
pnpm ui:guard:scan          # Gate D only — in-process full-tree scan, < 2 s
pnpm ui:guard:hints         # All gates + remediation hints per violation
pnpm ui:guard --gate A      # Single gate (A = ui author, B = appshell, C = erp, D = scan)

# Individual package checks:
pnpm --filter @afenda/appshell test:run
pnpm --filter @afenda/ui check:governance
```

What `pnpm ui:guard` runs:

| Gate | Target | Command |
|------|--------|---------|
| A | `@afenda/ui` author layer | `pnpm --filter @afenda/ui check:governance` |
| B | `@afenda/appshell` consumer | `pnpm --filter @afenda/appshell check:governance` |
| C | `@afenda/erp` consumer | `pnpm --filter @afenda/erp test:run` (governed-ui subset) |
| D | Full-tree in-process scan | `scripts/governance/governed-ui-consumption.mjs` (< 2 s) |

When **only** changing primitive source (not consumer wiring), Gate A suffices.  
When installing a shadcn-studio block, run `pnpm ui:guard:scan` first to catch leftover classNames, then the full `pnpm ui:guard`.

### When to use which checklist

| Task | Checklist |
|------|-----------|
| Edit `packages/ui/src/components/*.tsx` | Author checklist (15 items) |
| Edit appshell / erp composition | Consumer checklist (8 items) |
| shadcn-studio block install | Consumer checklist first, then strip classNames |
