# Primitive adapter checklist

Before completing a primitive split or upgrade, classify effort per [SKILL.md §1](../SKILL.md):

| Effort | When | Scope |
| --- | --- | --- |
| **E0** | evaluate/review/advise | Report only — E1–E12 + **M1–M10** ([mismatch-inspection-frame.md](mismatch-inspection-frame.md)) |
| **E1** | slot typo, prop order, single class move | Minimal patch |
| **E2** | batch 1.0.0 → enterprise | Contract + adapter + T1 |
| **E3** | wrong/missing Base UI anatomy | Full anatomy + T1 + T2 |
| **E4** | gold reference | Tests, docs, barrels, checklist closure |

Do not apply E2/E3 steps when E0 or E1 is sufficient.

---

## Gate minimum (batch — E1 at most unless upgrading)

- [ ] `{name}.contract.ts` exports `PRIMITIVE_CONTRACT_VERSION`
- [ ] `{name}.contract.ts` exports `*_SLOTS` with `as const`
- [ ] `{name}.tsx` imports from `./{name}.contract` (relative)
- [ ] `data-slot={SLOTS.*}` on every primitive part (no hardcoded strings — **M5**)
- [ ] `{name}.contract.test.ts` asserts slots + version + JSON serializable
- [ ] `pnpm check:studio-primitive-contracts` passes

## Enterprise bar (E2 — target ≥ 9.5/10)

- [ ] Base UI anatomy verified before refactor ([SKILL.md §6](../SKILL.md))
- [ ] `{NAME}_PRIMITIVE_ID` + `{name}PrimitiveMetadata()` in contract
- [ ] `{Name}Slot` / `{Name}SlotMap` types exported
- [ ] All Tailwind in contract — adapter uses `composeClassName` only
- [ ] `GovernedPrimitiveProps` on all public Base UI props (**M6**)
- [ ] Prop order: `{...props}` → `className` → `data-slot`
- [ ] Base UI `.Props` — no `any`, no `React.FC`
- [ ] `"use client"` only when hooks/events required
- [ ] T1 extended: metadata, class constants, type assertions (see accordion T1)
- [ ] T2 interaction test — click + keyboard; `setupUser`; `findBy*`; no `fireEvent` ([react-testing-patterns-bridge.md](react-testing-patterns-bridge.md))
- [ ] T2g slot override runtime test when applicable
- [ ] Export `{Name}Props` types from adapter
- [ ] M1–M10 mismatch frame clean (no fast-reject items)
- [ ] P1–P8 pass or documented N/A ([react-best-practices-bridge.md](react-best-practices-bridge.md))
- [ ] No boolean visual modes on primitive — recipes per [composition-patterns-bridge.md](composition-patterns-bridge.md)

## Gold bar (E4)

- [ ] E1–E12 complete per [enterprise-checklist.md](enterprise-checklist.md)
- [ ] M1–M10 passes with documented N/A where justified
- [ ] T2 passes for interactive primitives
- [ ] Listed as gold example in SKILL.md or presentation docs
- [ ] Contract version bumped to `≥ 1.2.0`

**Gold references:** `accordion` (panel/inner + two-icon state) · `alert-dialog` (modal anatomy + operator a11y T2) · `avatar` (static composition + render smoke) · `button` (cva + composeClassName + render smoke) · `checkbox` (form toggle T2) · `calendar` (vendor DayPicker + T2) · `category-bar` (custom viz + marker tooltip T2)
