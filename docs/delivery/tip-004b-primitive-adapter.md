# TIP-004B — Governed UI Primitive Adapter Layer

Status: **Complete (Phase 1–3)** · `STOCK_SHADCN_PENDING` is empty

## Purpose

Introduce a single governed primitive adapter in `@afenda/ui` so Radix/shadcn behavior stays implementation-only while all presentation resolves through one pipeline:

```txt
recipe → variant → state → slot → accessibility → motion → className policy
```

Phase 1 wired **Button**, **Badge**, **Card**, **Alert**, **Field**, and **Table**. Phase 2 added the **form-control leaf family** and overlay/navigation primitives. Phase 3 completed the remaining stock shadcn composite components (**InputGroup**, **InputOTP**, **NativeSelect**, **Command**, **Combobox**, **Carousel**, **Calendar**, **Chart**, **Resizable**, **Sidebar**) — `STOCK_SHADCN_PENDING` is now `[]`.

## Architecture

```mermaid
flowchart TD
  DS["@afenda/design-system"]
  Bridge["governance/design-system.ts"]
  Adapter["primitive-governance.ts"]
  Registry["primitive-registry.ts"]
  Recipe["governance/recipe.ts"]
  Components["components/*.tsx"]
  Apps["apps/*"]

  DS --> Bridge
  Bridge --> Recipe
  Bridge --> Adapter
  Registry --> Adapter
  Recipe --> Adapter
  Adapter --> Components
  Components --> Apps
```

| Layer | Owns |
| --- | --- |
| `@afenda/design-system` | Tokens, variants, recipes (metadata), states, motion, accessibility, className policy |
| `@afenda/ui/governance` | Bridge, registry, recipe runtime, `resolvePrimitiveGovernance()` |
| `@afenda/ui/components` | Radix behavior + governed presentation |
| Apps | Page wiring only |

## New modules

| Module | Responsibility |
| --- | --- |
| [`primitive-contract.ts`](../packages/ui/src/governance/primitive-contract.ts) | `PrimitiveGovernanceInput`, `PrimitiveGovernanceResult`, `GovernedPrimitiveDefinition` |
| [`primitive-registry.ts`](../packages/ui/src/governance/primitive-registry.ts) | `GOVERNED_PRIMITIVE_REGISTRY`, `STOCK_SHADCN_PENDING`, `PRIMARY_UI_EXPORTS` |
| [`primitive-governance.ts`](../packages/ui/src/governance/primitive-governance.ts) | `resolvePrimitiveGovernance()` |
| [`stock-shadcn-compat.ts`](../packages/ui/src/governance/stock-shadcn-compat.ts) | Temporary shadcn→governed Button mapping for stock pending components |

## Governed component API (Phase 1)

| Component | Governed props | Recipe |
| --- | --- | --- |
| `Button` | `intent`, `emphasis`, `size`, `density?`, `presentation?` | `button` |
| `Badge` | `tone`, `emphasis?`, `density?`, `size?` | `badge` |
| `Card` | `density`, `radius`, `shadow` | `card` |
| `Alert` | `tone`, `density?`, `radius?` | `status` |
| `Field` | `density?`, `size?`, `orientation?` | `form-control` |
| `Table` | `density?`, `size?` | `table` |
| `Input` | `density?`, `size?` | `form-control` (leaf) |
| `Label` | — | `form-control` (leaf) |
| `Textarea` | `density?`, `size?` | `form-control` (leaf) |
| `Checkbox` | — | `form-control` (leaf) |
| `Switch` | `size?` (`sm` \| `md`) | `form-control` (leaf) |

## Usage pattern

```tsx
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

const governed = resolvePrimitiveGovernance({
  componentName: "Button",
  recipeName: "button",
  variant: { intent: "primary", emphasis: "solid", size: "md" },
  slot: "root",
  className: "w-full",
});

return (
  <button {...governed.dataAttributes} className={governed.className}>
    Save
  </button>
);
```

## CI enforcement

[`scripts/check-design-system-consumption.ts`](../packages/ui/scripts/check-design-system-consumption.ts) blocks:

1. Direct `@afenda/design-system` imports in `src/components/**`
2. Local `cva()` in governed component files
3. Governed files missing `resolvePrimitiveGovernance()`
4. Raw semantic Tailwind classes in governed component source
5. Missing `PRIMARY_UI_EXPORTS` registry coverage

Run locally:

```bash
pnpm --filter @afenda/ui check:governance
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/ui typecheck
```

## Stock pending components

`STOCK_SHADCN_PENDING` is empty — all exported and composite shadcn components are governed or internal-only.

Do **not** run `shadcn add --all -o` on governed files without re-applying the adapter layer afterward.

## Depends on

- [TIP-004 — UI Consumption](./tip-004-ui-consumption.md)
- [TIP-004 — Design System Contracts](./tip-004-design-system-contracts.md)
- [TIP-004 Policy (canonical)](../governance/tip-004-policy.md)

## Next phases

- Phase 4: Any newly added shadcn components must register in `GOVERNED_PRIMITIVE_REGISTRY` on introduction

## Verdict

Phases 1–3 complete — governed adapter layer, full primary export coverage, CI guards, and tests are in place. `STOCK_SHADCN_PENDING` is empty.
