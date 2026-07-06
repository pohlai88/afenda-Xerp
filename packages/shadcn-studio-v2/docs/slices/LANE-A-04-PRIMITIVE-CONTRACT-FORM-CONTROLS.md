# Lane A-04 — Primitive Contract Form Controls

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers promoting form-control primitives to contract tier
- Authority: `../PRIMITIVE-API-CONSISTENCY.md`, `PHASE-3-PRIMITIVE-LAYER.md`
- Action enabled: Extend contract-tested primitives beyond the Phase 3 six-pack

## Overview

Promoted six form-control primitives from MCP/shadcn parity files to the governed
contract tier with tests and documentation updates.

## Problem

Views and proof routes depend on `input`, `select`, `checkbox`, and related
primitives, but only `button`, `badge`, `card`, `alert`, `field`, and `table`
were contract-tested before this slice.

## Goals

- Add contract tests for: `input`, `label`, `textarea`, `checkbox`, `switch`, `select`.
- Update `PRIMITIVE-API-CONSISTENCY.md` scope table.
- Export stable public APIs from `index.ts`; client primitives remain off `server.ts`.

## Non-goals

- Combobox, command palette, or number-field (defer to A-05/A-06 or later batch).
- ERP form validation logic.
- TanStack Table or datatable headless engines (Lane B — see table strategy plan).

## Constraints

- No custom boolean props (except `field.required` pattern).
- Token-safe classes only; no raw hex in TSX.
- File stems remain kebab-case.

## Proposed design

### Delivered artifacts

- `src/__tests__/primitive-form-controls.test.ts` — Lane A-04 contract suite
- Extended `primitive-api-consistency.test.ts` — six new files in scan set
- `PRIMITIVE-API-CONSISTENCY.md` — scope + variant inventories

### Per-primitive checklist (complete)

| File | Contract proof |
| --- | --- |
| `input.tsx` | class helper, slot, SSR markup |
| `label.tsx` | class helper, slot, `htmlFor` |
| `textarea.tsx` | class helper, slot, SSR markup |
| `checkbox.tsx` | class helper, indicator slot, client boundary |
| `switch.tsx` | class helper, thumb slot, client boundary |
| `select.tsx` | compound parts, trigger sizes, client boundary |

## Interfaces / dependencies

- Downstream: `form-surface.tsx`, proof route form fixture.
- Table/datatable strategy unchanged — presentation-only `DataTableSurface` in V2.

## Risks and mitigations

- Risk: Base UI primitives leak client-only into server export.
  - Mitigation: `primitive-form-controls.test.ts` + `server.ts` scan.

## Rollout and rollback

Completed in one batch. Rollback: revert test suite + doc rows for failing primitive only.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test:primitives
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/developer verify:v2-proof
```

## Done definition

- [x] Six form primitives listed in `PRIMITIVE-API-CONSISTENCY.md` scope.
- [x] Contract tests cover each promoted primitive.
- [x] No new boolean prop violations.
- [x] Exports stable in `index.ts`; client primitives off `server.ts`.

## Decision

**PROCEED** — form controls at contract tier; TanStack deferred to Lane B ERP composer.
