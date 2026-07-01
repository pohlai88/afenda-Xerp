# Contract template

**Authoritative source:** [contract-template.ts](contract-template.ts) — copy that file when scaffolding a new primitive contract.

This markdown file is a readable summary only. If this doc and the `.ts` template diverge, **follow `contract-template.ts`**.

## Required exports

```ts
import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.1.0" as const;

export const WIDGET_PRIMITIVE_ID = "shadcn-studio.ui.widget" as const;
export type WidgetPrimitiveId = typeof WIDGET_PRIMITIVE_ID;

export const WIDGET_SLOTS = {
  root: "widget",
  trigger: "widget-trigger",
} as const;

export type WidgetSlotMap = typeof WIDGET_SLOTS;
export type WidgetSlot = WidgetSlotMap[keyof WidgetSlotMap];

export const widgetRootClassName = "..." as const;

export const widgetVariants = cva(widgetRootClassName, {
  variants: { /* ... */ },
  defaultVariants: { /* ... */ },
});

export type WidgetVariantProps = VariantProps<typeof widgetVariants>;

export function widgetPrimitiveMetadata() {
  return {
    id: WIDGET_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: WIDGET_SLOTS,
  } as const;
}
```

## Rules

- No boolean visual modes on primitives — use explicit recipe wrappers ([composition-patterns-bridge.md](composition-patterns-bridge.md))
- Visual styling via contract class strings only — no inline `style` in adapters ([react-best-practices-bridge.md](react-best-practices-bridge.md) P3)
- `as const` on slot maps and class string exports
- No `any`; explicit Base UI `.Props` in adapter only
- DRY — class strings live once in contract
- **No React, Base UI, or lucide imports** — icons belong in the adapter only
