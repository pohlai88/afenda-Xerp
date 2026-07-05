# Phase 7A - Page And Widget Views Technical Specification

## Document Status

- Status: Planned implementation slice
- Audience: Engineers implementing first composed views
- Authority: `../DESIGN-SYSTEM-ARCHITECTURE.md` and `../TAXONOMY.md`
- Action enabled: Build page and widget surfaces without workflow or auth scope

## Overview

This slice builds the first composed presentation surfaces under `src/views`.

## Problem

The view layer is where primitive composition becomes product-shaped. Without a
bounded first view slice, business logic, app routes, and data fetching can leak
into package presentation components.

## Goals

- Implement `PageSurface`.
- Implement `MetricWidget`.
- Implement accepted page/widget blocks needed by package proof.
- Prove empty, loading, error, and unavailable states where applicable.

## Non-goals

- Workflow views such as forms, tables, dialogs, or settings.
- Auth presentation.
- Consumer app integration.
- Database, auth, permission, or route logic.

## Constraints

- Views compose primitives and layout only.
- Views expose typed props.
- Views do not own ERP business logic.
- Views do not call databases, auth services, or app routes.
- Views remain token-safe and accessible.

## Proposed design

### View responsibilities

- `PageSurface` owns page-level presentation structure.
- `MetricWidget` owns compact metric presentation.
- Additional widget blocks may be included only if already accepted by taxonomy
  and needed for proof.

### State posture

Data-driven views must represent:

- loading
- empty
- error
- unavailable
- ready

### Verification posture

The slice must prove:

- views render with typed props
- state variants are accessible
- no business logic exists in views
- no raw hex or forbidden imports exist

## Interfaces / dependencies

- Source docs:
  - `../DESIGN-SYSTEM-ARCHITECTURE.md`
  - `../TAXONOMY.md`
- Source dependencies:
  - `src/components/ui/**`
  - `src/components/layout/**`
- Downstream slices:
  - Phase 8 proof route

## Risks and mitigations

- Risk: views become ERP business components.
  - Mitigation: accept data through typed props only.
- Risk: state coverage is deferred.
  - Mitigation: make state variants part of render tests.
- Risk: widgets hardcode visual values.
  - Mitigation: enforce drift guard and token-only styling.

## Rollout and rollback

### Rollout

1. Implement page and widget views.
2. Add view render and state tests.
3. Run package gates.

### Rollback

If a view requires app data or business logic to work, remove that logic from
the package view and expose a typed prop instead.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2
```

## Done definition

- Page and widget views exist.
- Typed props exist.
- State coverage exists.
- Accessibility labels exist where needed.
- Views contain no business logic.

## Open questions

- Whether revenue/statistics blocks remain separate widgets or fold into a
  generic metric composition.
