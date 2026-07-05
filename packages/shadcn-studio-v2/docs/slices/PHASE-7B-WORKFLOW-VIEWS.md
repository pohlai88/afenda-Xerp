# Phase 7B - Workflow Views Technical Specification

## Document Status

- Status: Planned implementation slice
- Audience: Engineers implementing workflow presentation surfaces
- Authority: `../DESIGN-SYSTEM-ARCHITECTURE.md` and `../TAXONOMY.md`
- Action enabled: Build table, form, dialog, and settings surfaces without app logic

## Overview

This slice builds workflow-oriented composed views under `src/views`.

## Problem

Workflow surfaces are the easiest place to smuggle business rules into a shared
presentation package. Tables, forms, dialogs, and settings screens need strong
boundaries so the package owns reusable presentation, not ERP behavior.

## Goals

- Implement datatable, form, dialog, and settings presentation surfaces.
- Keep workflow views typed, accessible, and token-safe.
- Provide state coverage for empty, loading, error, unavailable, and ready
  presentation states where applicable.

## Non-goals

- ERP business rules.
- Server actions.
- Database calls.
- Auth provider calls.
- Consumer app routes.
- Real form submission behavior.

## Constraints

- Views compose primitives and layout only.
- Inputs are typed and fixture-shaped.
- State is presentational only.
- Controls must be keyboard reachable.
- Tables must expose accessible labels and empty states.

## Proposed design

### Workflow surfaces

Implement:

- `src/views/datatables/DataTableSurface.tsx`
- `src/views/forms/FormSurface.tsx`
- `src/views/dialogs/ConfirmDialogSurface.tsx`
- `src/views/settings/SettingsSurface.tsx`

### Responsibility split

- Package views own layout, labels, state visuals, and typed presentation props.
- Consumers own data loading, permissions, persistence, routing, and mutations.

### Verification posture

The slice must prove:

- workflow views render
- state variants are present
- keyboard and label semantics are covered
- no app or server dependency is introduced

## Interfaces / dependencies

- Source docs:
  - `../DESIGN-SYSTEM-ARCHITECTURE.md`
  - `../TAXONOMY.md`
- Source dependencies:
  - `src/components/ui/**`
  - `src/components/layout/**`
  - `src/views/pages/**` only if composition requires it
- Downstream slices:
  - Phase 8 proof route

## Risks and mitigations

- Risk: form surfaces become data mutation APIs.
  - Mitigation: expose callbacks and state props only; no server actions.
- Risk: table views assume ERP schemas.
  - Mitigation: keep columns and rows generic or fixture-shaped.
- Risk: settings views become configuration owners.
  - Mitigation: represent settings UI only; consumers own persistence.

## Rollout and rollback

### Rollout

1. Implement workflow view components.
2. Add render, state, and accessibility tests.
3. Run package gates.

### Rollback

If a view cannot function without ERP-specific behavior, remove that behavior
from the package and defer it to the consumer proof route.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2
```

## Done definition

- Workflow views exist.
- Typed props exist.
- State coverage exists.
- Accessibility tests pass.
- No app-specific logic is introduced.

## Open questions

- Whether the first table surface should be generic only or include a typed
  ERP-shaped fixture for proof.
