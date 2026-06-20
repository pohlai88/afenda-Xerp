# TIP-UI-02 — Component Library

Status: **Complete**

## Purpose

Build `@afenda/ui` as Afenda's shared component library using shadcn/ui on Radix UI. Replace the current placeholder package with importable, tested, token-aware React primitives.

**This TIP delivers the first Button, Input, and Table in the monorepo.**

## Scope

**In scope**

- shadcn/ui components scaffolded into `packages/ui/src/components/`
- `packages/ui/src/lib/utils.ts` — `cn()` helper
- P0 component set (see master plan Section 6)
- Vitest + Testing Library render tests
- Updated `package.json` exports
- Governed variant props wired to `@afenda/design-system` contracts

**Out of scope**

- ERP page wiring (TIP-UI-05)
- Metadata renderers (TIP-UI-04)
- Modifying shadcn primitives in `@afenda/design-system` (design-system is authority, not components)

## Depends on

- TIP-UI-01 CSS Pipeline

## Blocks

- TIP-UI-03, TIP-UI-04, TIP-UI-05

## P0 components

| Category | Components |
| --- | --- |
| Shell | Button, Badge, Avatar, Separator, Skeleton, Tooltip |
| Forms | Input, Label, Textarea, Select, Checkbox, RadioGroup, Switch, Form |
| Data | Table, DataTable, Card, ScrollArea |
| Feedback | Alert, AlertDialog, Dialog, Sheet, Sonner |

## Governed prop surfaces

Components with visual meaning consume `@afenda/design-system` vocabulary:

| Component | Governed props | Source contract |
| --- | --- | --- |
| Button | `intent`, `emphasis`, `size` | `VariantIntent`, `VariantEmphasis`, `GovernedSize` |
| Badge | `intent`, `emphasis` | `VariantIntent`, `VariantEmphasis` |
| Alert | `tone` | `StatusTone` |
| Card | `density` | `Density` |

CVA maps live in `packages/ui/src/lib/afenda-variants.ts`. Prop interfaces in `packages/ui/src/lib/afenda-contracts.ts`.

## TypeScript requirements

- Explicit props interfaces on every component
- Variant props via discriminated unions or CVA with typed variants
- No `any` in public API
- Export only through `package.json` export map
- Server/client components marked correctly (`"use client"` where needed)

## Package structure

```text
packages/ui/src/
  components/          ← shadcn/base-ui implementations
  lib/
    utils.ts           ← cn helper
    afenda-contracts.ts
    afenda-variants.ts
  index.ts             ← public exports
```

## Acceptance criteria

```gherkin
GIVEN TIP-UI-02 is complete
WHEN apps/erp imports Button from @afenda/ui
THEN the component renders with design-system token styling
AND pnpm --filter @afenda/ui test:run passes
AND pnpm typecheck passes
```

## Verdict

Complete — `@afenda/ui` exports P0 components with governed props wired to `@afenda/design-system`.
