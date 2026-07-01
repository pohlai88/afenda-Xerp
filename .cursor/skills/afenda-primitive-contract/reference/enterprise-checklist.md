# Enterprise primitive checklist (E1–E12)

Use when scanning (E0) or upgrading a primitive from batch (1.0.0) to enterprise (≥ 1.1.0).

**Effort ladder:** [SKILL.md §1](../SKILL.md) — default E0 for evaluate/review; E2 for enterprise upgrade; E3 when E7 fails (anatomy).

**Semantic pass:** Always run [mismatch-inspection-frame.md](mismatch-inspection-frame.md) (M1–M10) in E0 before approval.

## Contract file

- [ ] **E1** `{NAME}_PRIMITIVE_ID` constant + `{name}PrimitiveMetadata()` returning `{ id, version, slots }`
- [ ] **E2** `{Name}SlotMap` and `{Name}Slot` type exports
- [ ] **E3** All Tailwind class strings as `{name}{Part}ClassName` exports (or `cva` in contract)
- [ ] **E8** No React, lucide, or Base UI imports in contract

## Adapter file

- [ ] **E4** Uses `composeClassName(baseFromContract, className)` on every styled part
- [ ] **E5** Public props use `GovernedPrimitiveProps<BaseUI.Part.Props>` (string `className`; no consumer `data-slot`)
- [ ] **E6** JSX order: `{...props}` then `className` then `data-slot` on Base UI parts
- [ ] **E7** Full Base UI anatomy — every documented part exported with a slot
- [ ] **E12** Exported `{Name}Props` types from adapter (re-export slot types from contract)

## Tests & gates

- [ ] **E9** T1 test asserts metadata, slot map, class constants, `GovernedPrimitiveProps` (type-level)
- [ ] **E10** T2 interaction test when interactive — click + keyboard where applicable; `findBy*` after reveal; no `fireEvent`
- [ ] **E10g** T2g slot governance runtime test when governed slots exist
- [ ] **E11** `pnpm check:studio-primitive-contracts` passes

## E ↔ M crosswalk

| E check | Mismatch rules |
| --- | --- |
| E3 classes in contract | M3 dead classes, M4 primitive neutrality |
| E5 GovernedPrimitiveProps | M6 consumer slot override |
| E6 prop order + slots | M5 hardcoded slot strings |
| E7 anatomy | M2 one state source, M7 animation alignment |
| E4 composeClassName | M8 default usable without consumer className |
| Adapter perf | P1–P8 ([react-best-practices-bridge.md](react-best-practices-bridge.md)) |
| Tests | T1/T2/T2g ([react-testing-patterns-bridge.md](react-testing-patterns-bridge.md)) |

## P1–P8 adapter performance (Vercel react-best-practices)

| ID | Check |
| --- | --- |
| **P1** | No inline subcomponents in adapter |
| **P2** | No `useEffect` mirroring Base UI open/selected/value |
| **P3** | No inline `style` for visual meaning — contract classes only |
| **P4** | SVG rotate/transform on wrapper span if single-icon strategy |
| **P5** | Lucide named imports; ERP avoids hot-path full barrel |
| **P6** | Explicit ternary when falsy `0`/`NaN`; CSS hide/show for icons OK |
| **P7** | Default non-primitive props hoisted to module constants |
| **P8** | Static JSX hoisted only when profiler proves need (optional) |

## Reference implementations

| Primitive | Version | Notable patterns |
| --- | --- | --- |
| accordion | 1.2.0 | Header slot, Panel vs inner div, two-icon hide/show via `data-panel-open`, `innerClassName` |
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
- No `composeClassName` or `GovernedPrimitiveProps`
- Prop order: `className` before `{...props}`
- T1 test only checks version + JSON slots (no metadata/types)
- M1–M10 failures (mixed state, dead classes, recipe leakage)
