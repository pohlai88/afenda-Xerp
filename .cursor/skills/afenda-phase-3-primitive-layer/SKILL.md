---
name: afenda-phase-3-primitive-layer
description: Govern implementation and review of Phase 3 primitive UI components in packages/shadcn-studio-v2/src/components/ui. Use when Codex creates, changes, tests, or reviews Button, Badge, Card, Alert, Field, or Table primitives for typed props, explicit variants, token-safe classes, accessible semantics, runtime-light behavior, and package-local proof.
disable-model-invocation: true
paths:
  - packages/shadcn-studio-v2/src/components/ui/**
  - packages/shadcn-studio-v2/src/__tests__/**
---

# Afenda Phase 3 Primitive Layer

Use this skill to execute or review Phase 3 primitive work in `@afenda/shadcn-studio-v2`.

## Scope

Only apply this skill to:

- `packages/shadcn-studio-v2/src/components/ui/Button.tsx`
- `packages/shadcn-studio-v2/src/components/ui/Badge.tsx`
- `packages/shadcn-studio-v2/src/components/ui/Card.tsx`
- `packages/shadcn-studio-v2/src/components/ui/Alert.tsx`
- `packages/shadcn-studio-v2/src/components/ui/Field.tsx`
- `packages/shadcn-studio-v2/src/components/ui/Table.tsx`
- directly related primitive tests under `packages/shadcn-studio-v2/src/__tests__`

Do not use this skill to build runtime providers, theme providers, layout chrome, views, consumer routes, business logic, metadata registries, CSS token files, or proof routes.

## Primitive Contract

Accept a primitive only when it is small, typed, presentational, token-safe, accessible, variant-explicit, runtime-light, and test-proven.

A primitive is not accepted because it renders. Accept it only when its API, semantics, accessibility, styling, and tests are correct.

Require:

- typed props
- explicit semantic string unions for variants, sizes, and states
- stable default values
- `className` extension
- `data-slot` marker
- canonical shadcn/Tailwind token classes
- semantic HTML
- package-local tests

Reject:

- app logic, route logic, business rules, provider state, auth, permissions, tenant context, route detection, data fetching, or persistence
- raw hex colors or local token families
- copied reference CSS
- render-prop primitive APIs such as `renderHeader` or `renderFooter`
- boolean customization props such as `isDestructive`, `small`, or `loading`

Allowed narrow semantic booleans are native or accessibility-aligned props such as `required`, `disabled`, `checked`, and `open`.

## API Pattern

Prefer explicit unions:

```ts
type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";
type ButtonState = "idle" | "loading";
```

Prefer usage like:

```tsx
<Button variant="destructive" size="sm" state="loading" />
```

Reject usage like:

```tsx
<Button destructive small loading />
<Button isDestructive isSmall isLoading />
```

## Styling Rules

Use canonical token utilities such as `bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-destructive`, `text-destructive-foreground`, `bg-background`, `text-foreground`, `border-border`, `border-input`, `ring-ring`, `bg-accent`, `text-accent-foreground`, and `text-muted-foreground`.

Do not use raw hex, `bg-brand`, `text-afenda`, `bg-surface`, `shadow-luxury`, or gradient utility families such as `from-*` and `to-*` in reusable primitive TSX.

Do not add local token families, component-local color systems, copied reference CSS, or a Tailwind globals pipeline inside primitives.

## Composition Rules

Use children and stable named parts. Do not use render props.

Accepted:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

Named parts may include:

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Alert`, `AlertTitle`, `AlertDescription`
- `Field`, `FieldLabel`, `FieldControl`, `FieldDescription`, `FieldMessage`, `FieldError`
- `TableContainer`, `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`

## Runtime Rules

Primitives must not own application runtime.

Allowed:

- props
- `data-state` markers
- `data-slot` markers
- ARIA reflection when attached to the correct element
- disabled behavior
- loading behavior
- `className` extension

Rejected:

- `fetch()`
- database access
- auth checks
- permission checks
- route detection
- tenant context
- workspace context
- theme persistence
- `localStorage`
- global provider state
- consumer app imports

If a primitive seems to need app or runtime ownership, stop. It likely belongs in a view or consumer app.

## Accessibility Rules

Preserve semantic HTML first.

For `Button`:

- render a native `<button>`
- default `type="button"`
- preserve accessible name from children, `aria-label`, or `aria-labelledby`
- preserve focus-visible ring
- support disabled behavior
- support loading through `state="loading"`
- set `aria-busy` when loading unless explicitly overridden
- always disable while loading with `Boolean(disabled) || state === "loading"`
- use explicit border tokens in bordered variants, prefer `border-border` for ordinary outline buttons

For icon buttons, require visible text, `aria-label`, or `aria-labelledby` in examples and tests.

For `Alert`:

- do not infer `role="alert"` or `role="status"` from `variant`
- preserve explicit `role` passed by the consumer
- keep visual variant separate from live-region semantics
- use `border-border` in the default variant

For `Badge`:

- render a native `span`
- keep it non-interactive and runtime-free
- make the `outline` variant explicit with `border-border text-foreground`

For `Card`:

- keep `CardTitle` presentational; render a `div`, not a fixed heading element
- let consumers place `h2`, `h3`, or other heading elements inside `CardTitle` when they own hierarchy
- use explicit `border-border` in the card base class
- keep `variant="muted"` only as a stable low-emphasis supporting surface

For `Field`, preserve label, description, error association, required indication, and invalid state.

For `Field` invalid state:

- do not put `aria-invalid` on the outer `Field` wrapper by default
- expose wrapper state with `data-state={state}`
- expose invalid styling hook with `data-invalid={state === "invalid" ? "" : undefined}`
- put `aria-invalid` and `aria-describedby` on the actual control in the consumer or later form view
- add `data-required` to required labels
- keep `FieldMessage` neutral by default with `role={role}`
- keep `FieldError` assertive by default with `role={role ?? "alert"}`

For `Table`, preserve `table`, `thead`, `tbody`, `tr`, `th`, `td`, and `caption` semantics. Do not replace semantic tables with div grids in the primitive layer.

For `Table`:

- prove `TableHead` defaults to `scope="col"`
- prove `TableHead` preserves `scope="row"`
- prove every exported part renders its native element
- use explicit `border-border` on row borders when adding row border styles

## File Pattern

Use this order:

1. imports
2. type unions
3. props interfaces
4. base class constants
5. variant class maps
6. size or state class maps when needed
7. `className` helper
8. component implementation
9. named part exports
10. type exports

Name helpers like `buttonClassName`, `badgeClassName`, `cardClassName`, `alertClassName`, `fieldClassName`, and `tableClassName`.

Use `satisfies Record<Variant, string>` for class maps.

## Required Tests

Cover:

- semantic element render
- `data-slot`
- default props
- explicit variants
- size or state classes where applicable
- `className` extension
- native attribute preservation
- focus-visible class
- disabled behavior where applicable
- loading behavior where applicable
- no render-prop API
- no forbidden boolean customization props
- no raw hex
- no forbidden app, route, view, runtime, or consumer imports

Button-specific proof must include:

- default `type="button"`
- `state="loading"` sets `aria-busy`
- `state="loading"` disables the button
- `disabled={true}` remains disabled
- `disabled={false}` plus loading still disables the button
- explicit `aria-busy` override is preserved

Alert-specific proof must include:

- `Alert` renders `data-slot="alert"`
- default variant uses `border-border`, `bg-background`, and `text-foreground`
- destructive variant uses destructive tokens
- `className` extension is preserved
- no automatic `role` is rendered
- explicit `role="status"` is preserved
- explicit `role="alert"` is preserved
- `AlertTitle` and `AlertDescription` render their slots

Badge-specific proof must include:

- `Badge` renders a native `span`
- `Badge` renders `data-slot="badge"`
- every variant is supported
- `outline` includes `border-border text-foreground`
- `className` extension is preserved
- native span props are preserved

Card-specific proof must include:

- `Card` renders `data-slot="card"`
- base class includes `border-border`, `bg-card`, and `text-card-foreground`
- `variant="muted"` includes `bg-muted text-muted-foreground`
- `className` extension is preserved
- every named part renders its slot
- `CardTitle` renders a `div` and does not force a heading element

Field-specific proof must include:

- `Field` renders `data-slot="field"`
- vertical and horizontal orientation classes are supported
- default and invalid states are supported
- invalid state renders `data-state="invalid"` and `data-invalid`
- wrapper does not render `aria-invalid` by default
- `FieldLabel` requires `htmlFor`, renders an `aria-hidden` required marker, and sets `data-required`
- `FieldControl`, `FieldDescription`, `FieldMessage`, and `FieldError` render their slots
- `FieldMessage` preserves explicit `role`
- `FieldError` defaults to `role="alert"`

Table-specific proof must include:

- `TableContainer` renders a `div` and supports `overflow="auto"` and `overflow="visible"`
- `Table` renders `table`
- `TableHeader` renders `thead`
- `TableBody` renders `tbody`
- `TableFooter` renders `tfoot`
- `TableRow` renders `tr`
- `TableHead` renders `th`, defaults `scope="col"`, and preserves `scope="row"`
- `TableCell` renders `td`
- `TableCaption` renders `caption`
- all parts preserve `className` extension

## Consolidated Review Failures

Block or revise if any of these known Phase 3 drift patterns appear:

- `Button` loading can remain clickable via `disabled={false}`
- `Alert` infers live-region role from a visual variant
- `Badge` outline relies on implicit border color
- `CardTitle` hardcodes `h1`-`h6` and owns page heading hierarchy
- `Field` wrapper owns `aria-invalid` instead of using data attributes
- `FieldMessage` auto-announces validation text with `role="alert"`
- `TableHead` scope override is untested
- table parts are tested only by class strings, not native element output
- bordered primitives rely on inherited border color when a stable token is expected

## Review Checklist

Before acceptance, answer:

1. Is the file in an approved taxonomy path?
2. Is the component presentational only?
3. Are variants explicit string unions?
4. Are boolean customization props avoided?
5. Are styles token-based?
6. Is `className` layout and extension safe?
7. Is semantic HTML preserved?
8. Are accessibility states present?
9. Is loading or disabled behavior safe?
10. Are accessibility states on the correct element?
11. Are live-region roles caller-owned unless the component is specifically an error?
12. Is heading hierarchy not guessed by primitive components?
13. Are tests proving the contract?
14. Are package gates passing?
15. Was no Phase 4, 5, or 6 work started?

Reject the primitive if any answer is no.

## Command Template

Use this prompt shape when delegating or continuing Phase 3 primitive work:

```txt
You are executing Phase 3 primitive work for @afenda/shadcn-studio-v2.

Target primitive:
<PRIMITIVE_NAME>

Allowed path:
packages/shadcn-studio-v2/src/components/ui/<PRIMITIVE_NAME>.tsx

Allowed tests:
packages/shadcn-studio-v2/src/__tests__/*primitive*
packages/shadcn-studio-v2/src/__tests__/*api*
packages/shadcn-studio-v2/src/__tests__/*<primitive-name>*

Objective:
Implement or review the primitive as a small, typed, presentational, accessible, token-safe component.

Rules:
- Use explicit string variants.
- Avoid boolean customization props.
- Use native semantic HTML.
- Use canonical shadcn token classes only.
- Use data-slot markers.
- Support className extension.
- Do not own app/runtime state.
- Do not infer live-region roles from visual variants.
- Do not guess heading hierarchy.
- Do not put aria-invalid on field wrappers.
- Do not import from routes, apps, references, views, layout, runtime providers, or consumer code.
- Do not use raw hex values.
- Do not start Phase 4, Phase 5, or Phase 6 work.

Required tests:
- semantic render
- data-slot marker
- default props
- variant behavior
- className extension
- accessibility state
- disabled/loading state where applicable
- no render-prop primitive API
- no forbidden boolean customization props
- no raw hex
- no forbidden imports
- primitive-specific defect tests from this skill
```

## Commands

Run the package-local gates after changes:

```bash
pnpm --filter @afenda/shadcn-studio-v2 test:taxonomy
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2
```

## Completion Note

Return:

- primitive name
- summary
- files changed
- defects prevented
- tests added or aligned
- API contract result
- accessibility proof
- styling proof
- commands run with pass or fail result
- checklist result
- decision: `ACCEPTED`, `HOLD - PRIMITIVE INCOMPLETE`, or `REJECTED - PRIMITIVE DRIFT`

Include these proof rows when relevant:

- loading button remains clickable
- alert infers live-region role
- card title forces heading rank
- field wrapper owns `aria-invalid`
- table loses native semantics

## Rejection Triggers

Reject immediately if the primitive:

- imports app or route code
- imports consumer code
- imports reference code
- creates new token names
- uses raw hex colors
- uses boolean customization props for variants
- uses `renderHeader`, `renderFooter`, or `renderX` props
- infers alert/status live-region roles from visual variant
- forces heading rank in a neutral primitive
- places `aria-invalid` on `Field` wrapper
- allows loading button to remain clickable
- replaces table semantics with divs
- owns auth, permission, tenant, route, or data-fetching logic
- requires provider state without explicit later-phase approval
- passes visual review but lacks tests
- starts work outside `components/ui`

## Final Standard

Accept only when this statement is true:

```txt
The primitive can be imported, styled by canonical tokens, rendered accessibly, tested independently, and composed by later layout or view layers without carrying app logic, custom token drift, unstable API assumptions, incorrect ARIA ownership, or guessed document structure.
```
