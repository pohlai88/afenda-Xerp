# Surface Testing (T1–T8)

| ID | Change | Proof |
| --- | --- | --- |
| T1 | v1 primitive contract | `afenda-primitive-contract` |
| T2 | V2 primitive interaction | `pnpm studio:v2:primitives` + interaction tests |
| T4 | ERP click/open/keyboard | `*.interaction.test.tsx` |
| T5 | Forms | role/label queries |
| T7 | Refactor only | existing tests pass |

```bash
pnpm studio:v2:primitives
pnpm test:interaction
```

Use `@afenda/testing/react` `setupUser` — never `fireEvent`.
