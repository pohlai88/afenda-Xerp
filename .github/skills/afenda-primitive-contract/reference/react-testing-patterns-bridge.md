# React testing patterns bridge (vendor → Afenda primitives)

**Source validated:** vendor skill `react-testing-patterns` + Context7 `/testing-library/testing-library-docs` + `/testing-library/user-event` (official).

**Afenda authority:** `AGENTS.md` · `@afenda/testing/react` · [afenda-react-surface-quality/reference/testing-afenda.md](../../afenda-react-surface-quality/reference/testing-afenda.md)

**Scope:** `src/__tests__/components-ui/{name}.contract.test.ts` (T1) · `{name}.interaction.test.tsx` (T2) — not ERP MSW suites.

---

## Validation summary

| Topic | react-testing-patterns | Official RTL / user-event | Afenda primitive skill | Verdict |
| --- | --- | --- | --- | --- |
| `userEvent` over `fireEvent` | Yes | `userEvent.setup()` recommended | `setupUser` from `@afenda/testing/react` | **Adopt** — already in SKILL §9 |
| Query `getByRole` first | Yes | Guiding principle: resemble users | Accordion T2 uses `getByRole("button")` | **Adopt** |
| `findBy*` for async UI | Yes | Example uses `findByRole` after click | T2 should prefer `findByText` / `findByRole` after open | **Harden** |
| Don't test CSS classes | Yes | Test behavior not implementation | T1 asserts **contract strings** only | **Split tier** — not a dispute |
| Don't test implementation details | Yes | Same | T2 `data-slot` governance tests | **Exception** — documented below |
| jest-axe every file | Yes | — | Afenda: deferred v2 in testing-afenda.md | **T2a optional** for gold interactive |
| MSW in component tests | Yes | — | Primitives: no network; ERP routes only | **Out of scope** for T2 |
| Keyboard interaction | Implied via userEvent | `user.keyboard`, click+keyboard | SKILL §11 requires keyboard for accordion | **Harden** — add T2 keyboard cases |

---

## Test tier split (resolves “don’t test CSS” dispute)

| Tier | File | Philosophy | What to assert |
| --- | --- | --- | --- |
| **T1** | `*.contract.test.ts` | **Contract SSOT** — not RTL component behavior | Version, metadata JSON, slot map, class **constant strings**, `expectTypeOf` for `GovernedPrimitiveProps` |
| **T2** | `*.interaction.test.tsx` | **RTL behavior** — user-visible outcomes | open/close, keyboard, focus, disabled; `getByRole` / `findByRole` / `findByText` |
| **T2g** | same file, named tests | **Governance behavior** | Governed `data-slot` cannot be overridden; prefer role-first queries + `toHaveAttribute` |
| **T2a** | optional | **A11y** (gold interactive) | axe scan — optional until Afenda enables jest-axe repo-wide |

**Rule:** T1 class string checks are **not** “testing CSS in components.” They lock the **contract file** — aligned with PAS-006. react-testing-patterns “don’t test CSS” applies to **T2 only**.

---

## T2 rules (borrowed + official)

### Interaction API

```tsx
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";

const user = setupUser();
await user.click(screen.getByRole("button", { name: /section/i }));
await expect(screen.findByText("Panel body")).resolves.toBeVisible();
```

- **Never** `fireEvent` (Afenda + user-event docs: use `setup()` instance).
- Prefer **`findBy*`** after interactions that reveal content (RTL intro example).

### Query priority (T2)

1. `getByRole` / `findByRole` — triggers, tabs, dialogs
2. `getByLabelText` — form controls
3. `getByText` / `findByText` — panel content
4. `container.querySelector('[data-slot=…]')` — **T2g only** when role path is impractical; document why

### Keyboard (interactive primitives)

SKILL §11 requires keyboard paths for accordion, tabs, dialog, etc.

```tsx
await user.keyboard("{Enter}"); // or Space on focused trigger
```

Official: `@testing-library/user-event` `keyboard()` after focus/click.

### What T2 must not assert (react-testing-patterns)

- Internal React state / hook call counts
- Snapshot of full DOM for dynamic widgets
- Decorative Tailwind on primitive **unless** testing a **documented** consumer escape hatch (`innerClassName` merge) — prefer asserting **visible layout outcome** or move constant to T1

### `innerClassName` / consumer layout (narrow exception)

Testing that `innerClassName` reaches the inner wrapper is a **governance merge** test, not marketing CSS.

Preferred:

```tsx
await user.click(screen.getByRole("button", { name: /section/i }));
const inner = await screen.findByText("Panel body");
expect(inner).toHaveAttribute("data-slot", "accordion-content-inner");
expect(inner).toHaveClass("custom-inner-padding"); // OK — proves consumer layout prop merged
```

Document in test name: `consumer innerClassName merges to content inner slot`.

---

## T1 rules (contract — not RTL dispute)

From SKILL §10:

1. `PRIMITIVE_CONTRACT_VERSION`, `{NAME}_PRIMITIVE_ID`
2. `{name}PrimitiveMetadata()` JSON-serializable
3. Slot map exact match
4. Class constants non-empty; semantic guards (no rotate + two-icon, etc.)
5. `expectTypeOf` — no consumer `data-slot`; string-only `className`

No `render()` required in T1 unless testing adapter export smoke (separate render smoke tier).

---

## T2 minimum matrix (gold)

| Primitive | T2 behavior | T2 keyboard | T2g slot |
| --- | --- | --- | --- |
| Accordion | click toggles panel | Enter/Space on trigger | root/item slot override blocked |
| Dialog / Sheet | open, Escape closes | Escape, Tab focus | — |
| Tabs | panel switch on trigger | Arrow keys where applicable | — |
| Checkbox / Toggle | checked state | Space | — |
| Input | type, disabled | — | — |
| Avatar / Separator | render smoke only | N/A | — |

---

## Dispute resolutions (official-backed)

### 1. “Don’t test CSS” vs T1 class constants

**Resolution:** T1 tests the **contract module**, not rendered components. RTL guiding principles target **component** tests (T2).

### 2. jest-axe on every file

**Resolution:** Follow Afenda `testing-afenda.md` — **deferred v2** repo-wide. Gold interactive primitives may add **optional T2a** axe test; not a gate failure until platform enables it.

### 3. `querySelector` for `data-slot`

**Resolution:** T2g governance tests may use `querySelector` when verifying **governed identity** that users do not perceive via role alone. Prefer `getByRole` → `toHaveAttribute("data-slot", ACCORDION_SLOTS.root)` when feasible.

### 4. MSW in primitive tests

**Resolution:** **No** — primitives have no fetch. MSW stays in ERP / block integration tests (`afenda-react-surface-quality`).

### 5. Accordion keyboard gap

**Resolution:** SKILL §11 requires keyboard — T2 must add Enter/Space case (see gold accordion).

---

## E0 invoke (testing add-on)

```txt
After E/P passes, verify T1/T2/T2g matrix in react-testing-patterns-bridge.md.
Report T2 gaps (keyboard, findBy, fireEvent, query anti-patterns) using mismatch format.
```

---

## When to read vendor skill

Read `react-testing-patterns` when writing or reviewing `{name}.interaction.test.tsx`.

Read **this bridge first** to know which vendor rules apply to T1 vs T2.

Do not replace `afenda-primitive-contract` §9–11 or `@afenda/testing/react`.
