# Primitive API Consistency

This document records how `@afenda/shadcn-studio-v2` uses
`vercel-composition-patterns` to stabilize primitive APIs.

The Vercel skill is a review rubric for this package. It is not the package's
architectural authority. `shadcn-studio-v2` keeps ownership of taxonomy,
exports, runtime boundaries, and migration policy.

## Decision

Use the Vercel composition skill selectively for `src/components/ui/`.

Adopt the rules that make primitive APIs explicit and stable. Do not adopt rules
that assume stateful providers or React 19 migration policy as primitive-lane
defaults.

## Rule Matrix

| Skill rule | Decision | Package application |
| --- | --- | --- |
| `architecture-avoid-boolean-props` | `adopt with exception` | Block boolean customization props. Allow only narrow semantic flags such as `FieldLabel.required`. |
| `patterns-explicit-variants` | `adopt` | Prefer explicit string variants such as `variant`, `size`, `state`, or `orientation` over mode booleans. |
| `patterns-children-over-render-props` | `adopt` | Primitive composition uses children and exported parts, not `renderHeader`, `renderFooter`, or similar render props. |
| `architecture-compound-components` | `adapt` | Multi-part primitives may export named parts such as `CardHeader` and `TableHead`, but primitive lane does not introduce provider-owned runtime state by default. |
| `state-decouple-implementation` | `defer` | Useful for stateful composition, but primitive lane remains presentational and stateless unless a later slice proves a runtime owner. |
| `state-context-interface` | `defer` | Not needed for current primitives because state is not owned inside `components/ui/`. |
| `state-lift-state` | `defer` | Applies to runtime/composed layers, not the presentational primitive lane. |
| `react19-no-forwardref` | `reject as package rule` | Not adopted here as a primitive governance rule. Ref strategy must follow repo authority and ADR status, not the Vercel skill alone. |

## Current Evidence

- `Button`, `Badge`, `Alert`, `Field`, and `TableContainer` use explicit string
  variants or modes instead of boolean customization props.
- `Card`, `Alert`, `Field`, and `Table` expose named exported parts for
  composition.
- `components/ui/` does not expose render-prop style primitive APIs.
- Primitive runtime state remains outside `components/ui/`.

## Enforcement

`src/__tests__/primitive-api-consistency.test.ts` enforces the currently adopted
rules:

- no custom boolean customization props
- one allowed semantic boolean exception: `required`
- no render-prop shaped primitive APIs
- explicit named parts and variant maps for multi-part primitives

## Scope Boundary

This policy applies to `packages/shadcn-studio-v2/src/components/ui/` only.

It does not automatically govern:

- `components/layout/`
- `components/shared/`
- `views/`
- ERP consumer composition

Those layers may reuse the same rubric later, but they need their own decision
point and evidence.
