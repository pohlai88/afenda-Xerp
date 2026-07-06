# React Composition Patterns (V2)

From Vercel `vercel-composition-patterns`, scoped to `packages/shadcn-studio-v2/src/components/ui/**`.

## Rules

| Priority | Pattern | V2 example |
| --- | --- | --- |
| HIGH | No behavior booleans | `DialogCloseButton`, not `showCloseButton` |
| HIGH | Compound exports | `DialogHeader`, `FieldControl`, `PaginationItem` |
| MEDIUM | Explicit variants | `PaginationLinkCurrent`, `ButtonState` union |
| MEDIUM | React 19 | No `forwardRef` |

## Allowed exceptions

`required` on `FieldLabel`; `inset` on menus; `variant`/`size` typed maps; `side` on `SheetContent`.

## Checklist

- [ ] Parts cover layout without behavior booleans
- [ ] `*ClassName()` helpers + `data-slot` on each part
- [ ] `pnpm studio:v2:primitives` passes after API changes

v1 bridge: [afenda-primitive-contract/reference/composition-patterns-bridge.md](../../afenda-primitive-contract/reference/composition-patterns-bridge.md).
