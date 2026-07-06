# Surface Quality Scan (B / A / C / Y / T)

Consolidated ERP React review. Minimum correct effort — default **R0** for advice, **R1–R2** for fixes.

## Route

| Target | Read |
| --- | --- |
| `shadcn-studio-v2/src/components/ui/**` | [react-composition-patterns.md](react-composition-patterns.md), [react-best-practices.md](react-best-practices.md) |
| `apps/erp/**`, `apps/developer/**` | This file + [rsc-refactor-playbook.md](rsc-refactor-playbook.md) |
| v1 `components-ui/**` | `afenda-primitive-contract` |

Scan: **B → A → C → Y → T**.

## Effort

| Level | When |
| --- | --- |
| R0 | Review only |
| R1–R2 | Local fixes |
| R3 | RSC/client split (A4/A5/B8) |
| R4 | Operator-critical + a11y tests |

## B-Tier (block merge)

B1 conditional hooks · B2 stable list keys · B3 no `any` · B4 `use(promise)` misuse · B5 no mutation · B6 effect cleanup · B7 `useFormStatus` in child · B8 no server state mirror

## A-Tier

A1 `Promise.all` · A2 dynamic import · A3 narrow imports · A4 split god component · A5 leaf `"use client"` · A6 no mutable server module state · A7 derive not effect · A8 composition · A9 no inline components · A10 no `forwardRef`

## Y / T

[operator-a11y-checklist.md](operator-a11y-checklist.md) · [surface-testing.md](surface-testing.md)

## Gates

```bash
pnpm studio:v2:primitives          # ui primitive contract tests
pnpm --filter @afenda/erp typecheck
pnpm test:interaction              # when flows change
```
