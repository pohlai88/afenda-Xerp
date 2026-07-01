---
name: afenda-primitive-contract
description: >-
  PAS-006 primitive contract authority for @afenda/shadcn-studio components-ui.
  Use when scanning, splitting, editing, or upgrading Base UI widget primitives.
  Contract owns primitive identity, slots, classes, cva, metadata, and diagnostics.
  Adapter owns Base UI anatomy, rendering composition, public props, and client boundary.
  E0 scans must run M1–M10 mismatch frame + P1–P8 perf checklist before gold approval. Never shadcn --overwrite on existing primitives.
paths:
  - packages/shadcn-studio/src/components-ui/**
---

# Afenda Primitive Contract Skill

**Authority:** [PAS-006](../../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · [ADR-0027](../../../docs/adr/ADR-0027-frontend-presentation-reset.md)

**Gate:** `pnpm check:studio-primitive-contracts`

**CLI:** `pnpm studio:shadcn add <name> --yes`

**Hard rule:** Never use `--overwrite` on existing primitives under `components-ui/`.

**Physical vs virtual:** Files live in `src/components-ui/`; MCP/tsconfig alias is `@/components/ui/*`.

**Mismatch frame (E0):** [reference/mismatch-inspection-frame.md](reference/mismatch-inspection-frame.md) · **Composition:** [reference/composition-patterns-bridge.md](reference/composition-patterns-bridge.md) · **Performance:** [reference/react-best-practices-bridge.md](reference/react-best-practices-bridge.md) · **Testing:** [reference/react-testing-patterns-bridge.md](reference/react-testing-patterns-bridge.md)

**Gold examples:**

- `accordion` v1.2.0 — panel/inner split, header slot, two-icon hide/show via `data-panel-open` only (no rotate)
- `alert-dialog` v1.2.0 — Portal → Backdrop → Viewport → Popup; governed layout slots; T2 focus/Escape/close paths
- `avatar` v1.2.0 — Root → Image → Fallback; composition Badge/Group slots; static render smoke (T2 N/A)
- `button` v1.2.0 — cva in contract; `composeClassName` + governed prop order; render smoke for click/disabled
- `checkbox` v1.2.0 — Root → Indicator; icon in adapter; T2 click/disabled/Tab focus + slot governance
- `calendar` v1.2.0 — react-day-picker vendor boundary; governed Root/weekNumber slots; T2 select/nav/disabled
- `category-bar` v1.2.0 — custom visualization + Tooltip marker; governed segment/track slots; T2 render + tooltip hover
- `dialog` v1.2.0 — Portal → Backdrop → Viewport → Popup; T2 open/Escape/close + focus return
- `sheet` v1.2.0 — edge overlay anatomy; T2 open/Escape/close + focus return
- `tabs` v1.2.0 — Root → List → Trigger → Content; T2 panel switch
- `toggle` v1.2.0 — cva in contract; T2 pressed/disabled
- `input` v1.2.0 — Root input slot; T2 type/disabled
- `drawer` v1.2.0 — vaul vendor boundary; T2 open/Escape closed state
- `command` v1.2.0 — cmdk vendor boundary; T2 filter + item select
- `textarea` / `native-select` / `rating` / `pagination` / `input-otp` — composition Gold with T2

**Reference templates:** [contract-template.ts](reference/contract-template.ts) is **authoritative**. [contract-template.md](reference/contract-template.md) mirrors it — do not add icons or React to contract files.

---

## 0. Operating principle

A primitive refactor must use the **minimum correct effort** needed to reach the required quality bar.

Do not over-refactor static primitives.
Do not under-refactor interactive Base UI widgets.
Do not change behavior while only intending to extract classes.
Do not preserve incorrect anatomy for the sake of small diff.

The adapter must remain thin. The contract must become the stable source of primitive identity, slots, classes, variants, and metadata.

---

## 1. Effort ladder

| Level | Name | Use when | Required output |
| --- | --- | --- | --- |
| **E0** | Scan only | User asks evaluate/review/advice | Report only; no code patch |
| **E1** | Minimal patch | Slot name, prop order, class extraction, typo, import boundary | Smallest safe edit |
| **E2** | Enterprise upgrade | Primitive is batch 1.0.0 or lacks metadata/types | Contract + adapter + T1 test |
| **E3** | Anatomy correction | Base UI structure is incomplete or wrong | Full anatomy repair + T1 + T2 if interactive |
| **E4** | Gold promotion | Primitive becomes reference implementation | Tests, docs, barrels, checklist closure |

Default to **E0** when asked to “review,” “evaluate,” or “advise.”
Default to **E2** when asked to “upgrade to enterprise.”
Default to **E3** when Base UI anatomy is wrong, missing, or uncertain.

Detail: [reference/enterprise-checklist.md](reference/enterprise-checklist.md) · [reference/adapter-checklist.md](reference/adapter-checklist.md)

---

## 2. File model

| File | Owns | Must not own |
| --- | --- | --- |
| `{name}.contract.ts` | `PRIMITIVE_CONTRACT_VERSION`, `{NAME}_PRIMITIVE_ID`, `*_SLOTS`, slot types, class strings, `cva`, variant types, `{name}PrimitiveMetadata()` | `"use client"`, React components, Base UI imports, lucide/icons, DOM rendering |
| `{name}.tsx` | `"use client"` when required, Base UI anatomy, public prop types, `data-slot`, `composeClassName`, render composition | Duplicated Tailwind strings, primitive metadata, slot literals |
| `{name}.contract.test.ts` | T1 contract assertions | Browser interaction |
| `{name}.interaction.test.tsx` | T2 behavior tests for interactive primitives | Contract-only assertions |

Adapter target: keep each component function **≤ ~40 lines** where practical.

---

## 3. Contract tiers

| Tier | Version | Gate | Meaning |
| --- | --- | --- | --- |
| **Batch** | `1.0.0` | T1 minimum | Slots + version exist; classes may still be inline |
| **Enterprise** | `≥ 1.1.0` | T1 + types + metadata | Classes in contract, metadata id, slot types, `composeClassName`, `GovernedPrimitiveProps` |
| **Gold** | `≥ 1.2.0` | T1 + T2 + docs | Reference implementation for future primitives |

Batch primitives may pass the gate, but they are not ERP-promotion ready.

---

## 4. Enterprise contract template

Use [reference/contract-template.ts](reference/contract-template.ts) as the authoritative template.

Required exports:

```ts
import { cva, type VariantProps } from "class-variance-authority";

export const PRIMITIVE_CONTRACT_VERSION = "1.1.0" as const;

export const FOOBAR_PRIMITIVE_ID = "shadcn-studio.ui.foobar" as const;
export type FoobarPrimitiveId = typeof FOOBAR_PRIMITIVE_ID;

export const FOOBAR_SLOTS = {
  root: "foobar",
} as const;

export type FoobarSlotMap = typeof FOOBAR_SLOTS;
export type FoobarSlot = FoobarSlotMap[keyof FoobarSlotMap];

export const foobarRootClassName = "..." as const;

export const foobarVariants = cva(foobarRootClassName, {
  variants: {},
  defaultVariants: {},
});

export type FoobarVariantProps = VariantProps<typeof foobarVariants>;

export function foobarPrimitiveMetadata() {
  return {
    id: FOOBAR_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: FOOBAR_SLOTS,
  } as const;
}
```

Contract files must not import React, Base UI, or icons.

---

## 5. Adapter rules

Enterprise adapters must follow all rules below:

1. Import contract symbols from `./{name}.contract`.
2. Use Base UI `.Props` types where applicable.
3. Export public `{Name}Props` types from the adapter.
4. Wrap public Base UI props with `GovernedPrimitiveProps<BaseUI.Part.Props>` (string-only `className`; no consumer `data-slot`).
5. Use `composeClassName(contractClassName, className)` on every styled Base UI part.
6. JSX order on governed primitive parts must be:

```tsx
<Component
  {...props}
  className={composeClassName(contractClassName, className)}
  data-slot={SLOTS.part}
/>
```

7. Consumers must not be able to override governed `data-slot`.
8. No `React.FC`.
9. No `any`.
10. No `forwardRef`; use ref as prop for React 19.
11. No inline subcomponents (**P1** / `rerender-no-inline-components`).
12. Icons stay in adapter or a dedicated visual file, never in contract.
13. Full documented Base UI anatomy must be represented.
14. If a component has an outer behavior shell and inner layout shell, split props honestly:
    - `className` for Base UI outer part
    - `innerClassName` for inner layout/content wrapper
15. No `useEffect` mirroring open/selected/value state Base UI already owns (**P2** / **M2**).
16. No inline `style` for visual meaning — contract classes only (**P3** / `js-batch-dom-css`).
17. Lucide transform/rotate: wrap in `<span>` if using single-icon rotate (**P4**); prefer CSS hide/show for two-icon strategy.

Performance detail: [reference/react-best-practices-bridge.md](reference/react-best-practices-bridge.md).

Helpers:

```ts
import { composeClassName } from "@/lib/compose-class-name";
import type { GovernedPrimitiveProps } from "@/lib/governed-primitive-props";
```

---

## 5b. Primitive vs recipe (composition)

Do not add boolean visual modes (`isCard`, `isFAQ`, `variant="marketing"`) to base primitives.

| Layer | Owns |
| --- | --- |
| **Primitive** | Neutral parts, contract classes, `GovernedPrimitiveProps` |
| **Recipe** | Named wrapper (`AccordionSurface`, `AccordionFAQ`) with decorative surface classes |
| **Block** | Domain layout composing recipes + primitives |

See [composition-patterns-bridge.md](reference/composition-patterns-bridge.md) (validated against Vercel composition patterns).

---

## 6. Base UI anatomy rule

Before changing any Base UI primitive:

1. Identify the imported Base UI widget.
2. Check the documented anatomy (Base UI docs for that component).
3. Map each documented part to one of:
   - exported wrapper component
   - internal wrapper component
   - intentionally omitted with reason
4. Every rendered documented part must have a governed slot.
5. Missing structural parts are an **E3 anatomy correction**, not a style patch.

Required sequence:

```text
Read official Base UI anatomy → map every documented part → decide export/slot per part → only then refactor.
```

Examples:

```tsx
// Accordion
Root
  Item
    Header
      Trigger
    Panel
```

```tsx
// Alert Dialog
Root
  Trigger
  Portal
    Backdrop
    Viewport
      Popup
        Title
        Description
        Close
```

---

## 7. Scan / evaluation workflow

When asked to scan or evaluate a primitive:

1. Read:
   - `{name}.contract.ts`
   - `{name}.tsx`
   - `{name}.contract.test.ts`
   - `{name}.interaction.test.tsx` if present
2. Identify tier: Batch · Enterprise · Gold · Fail
3. Run E1–E12 checklist ([reference/enterprise-checklist.md](reference/enterprise-checklist.md))
4. Run M1–M10 mismatch frame ([reference/mismatch-inspection-frame.md](reference/mismatch-inspection-frame.md)) — report-first
5. Run P1–P8 adapter perf checklist ([reference/react-best-practices-bridge.md](reference/react-best-practices-bridge.md)) — report-first; N/A for static T0 primitives where noted
6. Compare against gold examples: `accordion`, `alert-dialog`
7. Decide effort level: E0 · E1 · E2 · E3 · E4
8. Output report using §8 (tier table + mismatch findings + P failures)

**Do not patch code** unless the user explicitly requests upgrade/fix beyond E0.

---

## 8. Evaluation report template

```md
## {Name} primitive evaluation

**Tier:** Batch 1.0.0 | Enterprise 1.x | Gold | Fail
**Recommended effort:** E0 | E1 | E2 | E3 | E4
**Score:** x/12 enterprise checks
**Promotion readiness:** Not ready | ERP-ready | Gold-ready

| ID | Check | Status | Notes |
| --- | --- | --- | --- |
| E1 | PRIMITIVE_ID + metadata() | ✅/❌ | |
| E2 | Slot types exported | ✅/❌ | |
| E3 | Classes in contract | ✅/❌ | |
| E4 | composeClassName in adapter | ✅/❌ | |
| E5 | GovernedPrimitiveProps | ✅/❌ | |
| E6 | Prop order: props → className → data-slot | ✅/❌ | |
| E7 | Full Base UI anatomy | ✅/❌ | |
| E8 | No icons/React/Base UI in contract | ✅/❌ | |
| E9 | T1 contract test | ✅/❌ | |
| E10 | T2 interaction test if interactive | ✅/N/A/❌ | |
| E11 | Gate passes | ✅/❌/Not run | |
| E12 | Exported adapter prop types | ✅/❌ | |

### Mismatch findings (M1–M10)

For each issue:

```txt
Mismatch:
Expected:
Actual:
Why it matters:
Required fix:
Acceptance check:
```

**Safe to approve:** Yes / No  
**Remaining risks:** …

### Required actions

| Order | Action | Effort | Reason |
| --- | --- | --- | --- |
| 1 | ... | E1/E2/E3 | ... |

### Acceptance decision

Pass / Partial / Fail

Do not promote until:
- ...
```

---

## 9. Testing tiers

| ID | File | Required when | Must assert |
| --- | --- | --- | --- |
| **T1** | `{name}.contract.test.ts` | Every primitive | Contract SSOT — see §10; **not** RTL behavior tests |
| **T2** | `{name}.interaction.test.tsx` | Interactive primitives | User-visible behavior — see §11; `@afenda/testing/react` |
| **T2g** | `{name}.interaction.test.tsx` | Governed primitives | Slot override blocked; role-first queries where possible |
| **T2a** | `{name}.interaction.test.tsx` | Gold interactive (optional) | jest-axe — repo-wide optional per Afenda testing-afenda.md |

Detail: [reference/react-testing-patterns-bridge.md](reference/react-testing-patterns-bridge.md) (resolves T1 class strings vs “don’t test CSS”).

Use `@afenda/testing/react` `setupUser`.

Do not use `fireEvent`.

Prefer `findByRole` / `findByText` after interactions that reveal content (RTL official).

Gold T1: [`accordion.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/accordion.contract.test.ts) · [`alert-dialog.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/alert-dialog.contract.test.ts) · [`avatar.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/avatar.contract.test.ts) · [`button.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/button.contract.test.ts) · [`checkbox.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/checkbox.contract.test.ts) · [`calendar.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/calendar.contract.test.ts) · [`dialog.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/dialog.contract.test.ts) · [`sheet.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/sheet.contract.test.ts) · [`tabs.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/tabs.contract.test.ts) · [`toggle.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/toggle.contract.test.ts) · [`input.contract.test.ts`](../../../packages/shadcn-studio/src/components-ui/input.contract.test.ts)

Gold T2: [`accordion.interaction.test.tsx`](../../../packages/shadcn-studio/src/components-ui/accordion.interaction.test.tsx) · [`alert-dialog.interaction.test.tsx`](../../../packages/shadcn-studio/src/components-ui/alert-dialog.interaction.test.tsx) · [`checkbox.interaction.test.tsx`](../../../packages/shadcn-studio/src/components-ui/checkbox.interaction.test.tsx) · [`calendar.interaction.test.tsx`](../../../packages/shadcn-studio/src/components-ui/calendar.interaction.test.tsx) · [`dialog.interaction.test.tsx`](../../../packages/shadcn-studio/src/components-ui/dialog.interaction.test.tsx) · [`sheet.interaction.test.tsx`](../../../packages/shadcn-studio/src/components-ui/sheet.interaction.test.tsx) · [`tabs.interaction.test.tsx`](../../../packages/shadcn-studio/src/components-ui/tabs.interaction.test.tsx) · [`toggle.interaction.test.tsx`](../../../packages/shadcn-studio/src/components-ui/toggle.interaction.test.tsx) · [`input.interaction.test.tsx`](../../../packages/shadcn-studio/src/components-ui/input.interaction.test.tsx)

Gold render smoke: [`avatar.render.test.tsx`](../../../packages/shadcn-studio/src/components-ui/__tests__/avatar.render.test.tsx) (static, T2 N/A) · [`button.render.test.tsx`](../../../packages/shadcn-studio/src/components-ui/__tests__/button.render.test.tsx) (cva + click/disabled)

---

## 10. T1 contract test requirements

A valid enterprise T1 test should check:

1. `PRIMITIVE_CONTRACT_VERSION`
2. `{NAME}_PRIMITIVE_ID`
3. `{name}PrimitiveMetadata()`
4. metadata is JSON serializable
5. slot map contains expected slot values
6. class constants are non-empty strings
7. slot type exports compile
8. `GovernedPrimitiveProps` rejects consumer `data-slot` and function `className` at type level where practical

---

## 11. T2 interaction requirements

Interactive primitives need T2 when they include any of:

- open / close
- toggle
- keyboard navigation
- focus management
- selection
- dismissal
- controlled / uncontrolled state

**T2 style (RTL + Afenda):**

- Arrange → Act (`setupUser`) → Assert on **roles/text/visibility**
- Add **keyboard** case when SKILL table says “keyboard path works”
- Use `findBy*` when content appears after interaction
- T2g: governed `data-slot` override blocked (type-level in T1 + runtime in T2g)

| Primitive | T2 required? | Minimum behavior |
| --- | --- | --- |
| Accordion | Yes | click **and** Enter/Space toggle panel; `findByText` when opening |
| Alert Dialog | Yes | trigger opens; cancel/action closes; focus returns |
| Tooltip | Yes | hover/focus opens; escape closes |
| Avatar | No | static display (image/fallback) |
| Badge | No | static display |
| Separator | No | static display |

---

## 12. Upgrade workflow

When upgrading a primitive (E2 or E3):

1. Freeze behavior first.
2. Read Base UI anatomy.
3. Extract slot map.
4. Extract all Tailwind/cva into contract.
5. Add `{NAME}_PRIMITIVE_ID`.
6. Add slot types.
7. Add metadata function.
8. Refactor adapter to `composeClassName`.
9. Apply `GovernedPrimitiveProps`.
10. Enforce prop order.
11. Add or extend T1.
12. Add T2 if interactive.
13. Run gates.
14. Report exact remaining gaps.

---

## 13. New primitive workflow

When adding from CLI:

```bash
pnpm studio:shadcn add <name> --yes
```

Immediately after generation:

1. Do not commit raw generated file.
2. Split into `{name}.contract.ts` and `{name}.tsx`.
3. Remove inline Tailwind from adapter.
4. Add slots and metadata.
5. Add T1 test.
6. Add T2 if interactive.
7. Run gates.

Never run:

```bash
pnpm dlx shadcn@latest add <name> --overwrite
```

on existing `components-ui/*`.

---

## 14. Gate commands

```bash
pnpm check:studio-primitive-contracts
pnpm check:studio-import-zones
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run -- src/components/ui
```

For one primitive:

```bash
pnpm --filter @afenda/shadcn-studio test:run -- src/components-ui/{name}.contract.test.ts
pnpm --filter @afenda/shadcn-studio test:run -- src/components-ui/{name}.interaction.test.tsx
```

---

## 15. Gate scope

In scope:

- Base UI widget primitives imported from `@base-ui/react/*`
- interactive shadcn-studio `components-ui/*`
- primitives used by ERP presentation surfaces

Excluded unless explicitly requested:

- merge-props helpers only
- static composition helpers
- `badge`, `button-group`, `bubble`, `item`, `marker`, `attachment`, `breadcrumb`, `sidebar`

Excluded files may still follow the pattern voluntarily, but they are not mandatory enterprise primitive upgrades.

---

## 16. Hard stops

Stop and report instead of patching when:

1. Base UI anatomy is unknown and cannot be verified.
2. Primitive behavior would change without explicit approval.
3. Contract imports React, Base UI, or icons.
4. Adapter contains duplicated slot strings.
5. Consumer props can override governed `data-slot`.
6. Interactive primitive has no T2 test plan.
7. `--overwrite` was used on an existing primitive.
8. A generated shadcn file is being promoted without contract split.
9. The patch would touch unrelated primitives.
10. The primitive is being used as a gold example before E1–E12 are complete.

---

## 17. Completion definition

A primitive is **enterprise-ready** only when:

- E1–E12 are complete or explicitly marked N/A.
- M1–M10 mismatch frame passes (zero fast-reject items).
- P1–P8 pass or documented N/A (static primitives: P2/P6 often N/A).
- T1 + T2 (+ T2g where governed) per [react-testing-patterns-bridge.md](reference/react-testing-patterns-bridge.md).
- Contract owns identity, slots, classes, variants, and metadata.
- Adapter owns anatomy only.
- Public props prevent governed slot override.
- Base UI anatomy is complete.
- T1 passes.
- T2 exists for interactive behavior.
- Gate commands pass.
- Remaining gaps are documented honestly.

A primitive is **gold-ready** only when it can be safely used as a future reference implementation (E4).
