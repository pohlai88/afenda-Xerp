# TIP-UI-02 — Component Library

Status: **Not started**

## Purpose

Build `@afenda/ui` as Afenda's shared component library using shadcn/ui on Radix UI. Replace the current placeholder package with importable, tested, token-aware React primitives.

**This TIP delivers the first Button, Input, and Table in the monorepo.**

## Scope

**In scope**

- shadcn/ui components scaffolded into `packages/ui/src/components/ui/`
- `packages/ui/src/lib/utils.ts` — `cn()` helper
- P0 component set (see master plan Section 6)
- Vitest + Testing Library render tests
- Updated `package.json` exports

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

## TypeScript requirements

- Explicit props interfaces on every component
- Variant props via discriminated unions or CVA with typed variants
- No `any` in public API
- Export only through `package.json` export map
- Server/client components marked correctly (`"use client"` where needed)

## Package structure (planned)

```text
packages/ui/src/
  components/ui/     ← shadcn components
  lib/utils.ts       ← cn helper
  index.ts           ← public exports
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

Not started — `@afenda/ui` is currently a placeholder.
