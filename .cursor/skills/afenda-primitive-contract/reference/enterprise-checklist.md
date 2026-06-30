# Enterprise primitive checklist (E1–E12)

Use when scanning (E0) or upgrading a primitive from batch (1.0.0) to enterprise (≥ 1.1.0).

**Effort ladder:** [SKILL.md §1](../SKILL.md) — default E0 for evaluate/review; E2 for enterprise upgrade; E3 when E7 fails (anatomy).

## Contract file

- [ ] **E1** `{NAME}_PRIMITIVE_ID` constant + `{name}PrimitiveMetadata()` returning `{ id, version, slots }`
- [ ] **E2** `{Name}SlotMap` and `{Name}Slot` type exports
- [ ] **E3** All Tailwind class strings as `{name}{Part}ClassName` exports (or `cva` in contract)
- [ ] **E8** No React, lucide, or Base UI imports in contract

## Adapter file

- [ ] **E4** Uses `composeClassName(baseFromContract, className)` on every styled part
- [ ] **E5** Public props use `WithoutGovernedDataSlot<BaseUI.Part.Props>`
- [ ] **E6** JSX order: `{...props}` then `className` then `data-slot` on Base UI parts
- [ ] **E7** Full Base UI anatomy — every documented part exported with a slot
- [ ] **E12** Exported `{Name}Props` types from adapter (re-export slot types from contract)

## Tests & gates

- [ ] **E9** T1 test asserts metadata, slot map, class constants, `WithoutGovernedDataSlot` (type-level)
- [ ] **E10** T2 interaction test when primitive has open/close, toggle, or keyboard behavior (N/A for static display)
- [ ] **E11** `pnpm check:studio-primitive-contracts` passes

## Reference implementations

| Primitive | Version | Notable patterns |
| --- | --- | --- |
| accordion | 1.2.0 | Header slot, Panel vs inner div, rotating icon slot, `innerClassName` |
| alert-dialog | 1.2.0 | Viewport layer, Portal→Backdrop→Viewport→Popup, governed layout slot props, T2 focus/Escape/close |
| avatar | 1.2.0 | Root/Image/Fallback anatomy, Badge/Group composition slots, `AvatarSize`, render smoke (T2 N/A) |
| button | 1.2.0 | cva in contract, `ButtonVariantProps`, composeClassName adapter, render smoke click/disabled |
| checkbox | 1.2.0 | Root/Indicator anatomy, icon in adapter, T2 click/disabled/Tab focus/slot governance |
| calendar | 1.2.0 | react-day-picker vendor boundary, Root/weekNumber slots, T2 select/nav/disabled |
| category-bar | 1.2.0 | Custom visualization + Tooltip marker, segment math guard, T2 slots + tooltip hover |

## Batch-only gaps (typical 1.0.0)

These pass the gate but fail enterprise:

- Classes inline in `.tsx` with `cn("...", className)`
- No `PRIMITIVE_ID` / metadata
- No `composeClassName` or `WithoutGovernedDataSlot`
- Prop order: `className` before `{...props}`
- T1 test only checks version + JSON slots (no metadata/types)
