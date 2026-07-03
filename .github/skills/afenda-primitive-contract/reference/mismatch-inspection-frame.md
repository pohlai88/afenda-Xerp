# UI Primitive Mismatch Inspection Frame

**Use:** E0 scan before approving or patching any governed primitive. **Report first; patch only when requested.**

**Pairs with:** [enterprise-checklist.md](enterprise-checklist.md) (E1–E12) · [composition-patterns-bridge.md](composition-patterns-bridge.md) · [react-best-practices-bridge.md](react-best-practices-bridge.md) · [react-testing-patterns-bridge.md](react-testing-patterns-bridge.md)

---

## Purpose

Catch meaningless duplication, state mismatch, dead classes, and primitive/recipe confusion — not beauty.

Every finding **must** use this shape:

```txt
Mismatch:
Expected:
Actual:
Why it matters:
Required fix:
Acceptance check:
```

---

## Pre-flight questions (ask before approving)

```txt
Does this implementation contain two ideas doing the same job?
Does the visual state have one clear source?
Does each class still have a reason to exist?
Is this primitive neutral, or accidentally becoming a recipe?
Does the adapter mirror state Base UI already owns (useEffect / duplicate useState)?
```

---

## M1 — One responsibility per visual signal

If one mechanism already communicates state, do not add another for the same state.

| Bad | Good |
| --- | --- |
| Two icons **and** rotate on the same icon | One icon + rotate **or** two icons + hide/show |

**Fast reject:** two visual mechanisms for one state.

---

## M2 — One state source rule

Do not mix state systems for the same behavior (e.g. `aria-expanded` + `data-panel-open`).

Use the **upstream primitive's documented data attribute** consistently.

**Fast reject:** mixed state sources.

---

## M3 — Class must have a job

Every contract class must answer: *What problem does this class solve?*

Suspicious: `focus-visible:after:border-ring` with no `after:` pseudo-element recipe.

**Fast reject:** dead classes / unexplained pseudo-element classes.

---

## M4 — Primitive must stay neutral

Base contract must not include card/marketing/FAQ surface styling.

| Primitive (keep) | Recipe (move out) |
| --- | --- |
| `flex w-full flex-col` | `rounded-2xl border bg-muted/50 p-6` |

Name recipes explicitly: `AccordionSurface`, `AccordionFAQ`, `AccordionSettingsGroup`.

**Fast reject:** recipe styling inside primitive.

---

## M5 — Slot identity from contract only

```tsx
// Bad
data-slot="accordion-trigger"

// Good
data-slot={ACCORDION_SLOTS.trigger}
```

**Fast reject:** hardcoded slot strings in adapter.

Maps to **E2**, **E6**.

---

## M6 — Consumer must not override governed slots

Consumers may pass layout `className` (string only); must not override `data-slot`.

Use **`GovernedPrimitiveProps<BaseUI.Part.Props>`** on public props.

**Fast reject:** consumer-overridable `data-slot`.

Maps to **E5**.

---

## M7 — Animation matches upstream library

Prefer upstream CSS variables and transition lifecycle attributes (e.g. `--accordion-panel-height`, `data-starting-style` / `data-ending-style`).

Avoid duplicate animation systems (`animate-accordion-down` when height var exists).

**Fast reject:** animation not aligned with primitive state.

---

## M8 — Base class and consumer class must not fight

Default primitive must be usable **without** consumer `className`. Repeated padding/focus/disabled fixes at call sites belong in the contract.

**Fast reject:** `className` required to make default usable.

---

## M9 — Duplicate meaning check

Search these pairs; if both sides do the same job, remove one:

```txt
two icons + rotation
aria state + data state
panel animation + manual height hacks
root border + parent card border
item background + content background
disabled prop + custom pointer blocking
slot constant + hardcoded slot string
boolean prop modes + separate recipe file missing
useEffect syncing open/selected + Base UI controlled props
inline style + contract class for same visual
rotate on lucide svg root + wrapper span missing
```

---

## M10 — Removal test

Before approval, for each non-structural line ask:

```txt
If I remove this line, what breaks?
```

| Answer | Action |
| --- | --- |
| nothing | Remove |
| only visual preference | Move to recipe |
| behavior, a11y, slot identity, structure | Keep in primitive |

---

## Required IDE output (E0)

Append after §8 tier table:

```txt
Primitive reviewed:
Files checked:

Mismatch 1:
Expected:
Actual:
Why it matters:
Required fix:
Acceptance check:

Safe to approve: Yes / No
Remaining risks:
```

---

## Fast approval bar (hard reject)

Do **not** approve if any remain:

```txt
two visual mechanisms for one state
mixed state sources
dead classes
hardcoded slot strings
consumer-overridable data-slot
recipe styling inside primitive
unexplained pseudo-element classes
animation not aligned with primitive state
className required to make default usable
useEffect mirroring upstream primitive state
inline style for visual meaning in adapter
transform/rotate applied directly to lucide svg root (single-icon strategy)
```

After M1–M10, run **P1–P8** from [react-best-practices-bridge.md](react-best-practices-bridge.md).

---

## Invoke phrase

```txt
Review this primitive using the UI Primitive Mismatch Inspection Frame.
Do not rewrite first.
Report every mismatch in Mismatch/Expected/Actual/Why/Fix/Acceptance format.
Only after reporting, propose the minimal patch.
```
