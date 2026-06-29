# Reference Patterns

Canonical accepted implementations from the first six governed primitives.

## Button (9.5) — asChild root, forwardRef, aria-disabled bridge
- `src/components/button.tsx`
- Key: `@radix-ui/react-slot`, `aria-disabled` caller preservation, `type="button"` default

## Badge (9.5) — asChild span, presentation intentionally excluded
- `src/components/badge.tsx`
- Key: `presentation` excluded with documented reason in `GovernedBadgeProps`

## Card (9.5) — slot factory, layoutSize as structural dimension
- `src/components/card.tsx`
- Key: `CARD_SLOT_ROLES` mapping, `GovernedCardLayoutSize` via `layoutSize` in `PrimitiveGovernanceInput`

## Alert (9.5) — tone-aware role policy, slot factory with recipeName
- `src/components/alert.tsx`
- Key: `resolveAlertRole()` — `danger`/`warning` → `role="alert"`, others → `role="status"`, caller override

## Field (9.5) — complex multi-slot, slotKey for sub-parts, no raw Tailwind
- `src/components/field.tsx`
- Key: `FIELD_SLOT_ROLES` map, `resolveFieldGovernance()` helper, `FieldSeparator` line via governed `slotKey`

## Table (9.5) — semantic slotKey vocabulary, containerClassName split
- `src/components/table.tsx`
- Key: `TABLE_SLOT_TARGETS` map, `slotKey` for row/head/cell/caption (not in global SlotRole), `containerClassName`

## governance changes made during hardening

| File | Change |
|------|--------|
| `component-props.ts` | Added `state?: GovernedState` to all `Governed*Props` |
| `component-props.ts` | Added `GovernedCardLayoutSize` type |
| `recipe-maps.ts` | Added `separatorLine` to `fieldSlotClassNamesByKey` |
| `recipe-maps.ts` | Added `tableSlotClassNamesByKey` (container/row/head/cell/caption) |
| `recipe-maps.ts` | Rewrote `TableSlotRoleKey` to exclude borrowed slots |
| `primitive-registry.ts` | Added `separatorLine` to Field `dataSlotByKey` |
| `primitive-registry.ts` | Rewrote Table registry to use `slotKey` vocabulary |
| `primitive-contract.ts` | Added `layoutSize?: GovernedCardLayoutSize` |
| `primitive-governance.ts` | Added Card `data-size` emission in `buildDataAttributes` |
| `primitive-governance.ts` | Added recipe-shell guards for Card/Alert/Field/Table non-root slots |
