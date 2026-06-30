# Afenda testing rules (T1–T8)

Map to [SKILL.md §8](../SKILL.md). Test proof must match **change type**, not generic coverage.

## File naming

| Pattern | Purpose |
| --- | --- |
| `*.test.ts(x)` | Render, governance, unit |
| `*.interaction.test.tsx` | Click, open menu, keyboard flows |
| `*.contract.test.ts` | Primitive/block contract SSOT |

## T-tier by change type

| ID | Change | Required |
| --- | --- | --- |
| **T1** | Primitive contract edit | Route to `afenda-primitive-contract`; update `*.contract.test.ts` |
| **T2** | Primitive interaction edit | Route to primitive skill; update `*.interaction.test.tsx` |
| **T3** | Block contract / metadata | Block contract test |
| **T4** | ERP click/open/keyboard flow | `*.interaction.test.tsx` |
| **T5** | Forms / operator surfaces | `getByRole` / `getByLabelText` first |
| **T6** | A11y contract (Y-tier) | Assert wrapper, label, live region, table/chart semantics |
| **T7** | Refactor only | Existing tests pass — no new tests |
| **T8** | Loader `Promise.all` only | Test only if output/behavior changed |

## Interaction tests

```tsx
import { setupUser } from "@afenda/testing/react";
import { render, screen } from "@testing-library/react";

const user = setupUser();
await user.click(await screen.findByRole("button", { name: /save/i }));
```

**Never** use `fireEvent`.

Prefer `findByRole` over `waitFor` + `getByRole`.

## Effort mapping

| Effort | Typical T-tier |
| --- | --- |
| R0 scan | Report T gaps only |
| R1/R2 | T7 if refactor-only; T4 if flow touched |
| R3 split | T7 + loader tests if behavior changed (T8) |
| R4 operator | T4 + T5 + T6 as applicable |

## Deferred (v2)

- MSW for ERP API routes
- jest-axe on every component file
