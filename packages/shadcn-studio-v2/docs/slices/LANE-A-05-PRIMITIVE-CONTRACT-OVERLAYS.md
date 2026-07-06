# Lane A-05 — Primitive Contract Overlays

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers promoting overlay/dialog primitives to contract tier
- Authority: `../PRIMITIVE-API-CONSISTENCY.md`
- Action enabled: Govern dialog, sheet, and related overlay primitives

## Overview

Second primitive promotion batch: overlay and modal-family components used by
workflow views and future proof expansions.

## Problem

Overlay primitives (`dialog`, `sheet`, `alert-dialog`) shipped for shadcn parity but
lacked the same contract enforcement as Phase 3 core six and A-04 form controls.

## Goals

- Contract-test: `dialog`, `sheet`, `alert-dialog`, `drawer`, `popover`, `tooltip`.
- Ensure focus trap / aria patterns remain in client boundary only.
- Update primitive consistency doc.

## Non-goals

- Command palette, hover-card menus (optional later batch).
- Consumer modal business logic.

## Constraints

- Overlays exported on neutral `index.ts`; excluded from `server.ts`.
- No ERP-specific copy in primitives.
- No `draggable` / `resize` on overlay primitives.

## Proposed design

### Delivered artifacts

- `src/__tests__/primitive-overlays.test.ts` — Lane A-05 contract suite
- Extended `primitive-api-consistency.test.ts` — six overlay files in scan set
- `PRIMITIVE-API-CONSISTENCY.md` — scope + variant inventories

### Per-primitive checklist (complete)

| File | Contract proof |
| --- | --- |
| `dialog.tsx` | class helpers, slots, `./button` import |
| `alert-dialog.tsx` | action/cancel slots, class helpers |
| `sheet.tsx` | side variants, drawer primitive wiring |
| `drawer.tsx` | sheet alias re-export only |
| `popover.tsx` | popover content tokens + slots |
| `tooltip.tsx` | provider, arrow slot, content tokens |

## Interfaces / dependencies

- Depends on A-04 / Phase 3 `button` class helpers.
- Upstream for confirm-dialog surface enhancements.

## Risks and mitigations

- Risk: duplicate button styling imports after kebab rename.
  - Mitigation: `./button` relative imports enforced in overlay test.

## Rollout and rollback

Completed in one batch. Rollback: revert test suite + doc rows for failing primitive only.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test:primitives
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 test src/__tests__/runtime-boundary.test.ts
```

## Done definition

- [x] Overlay primitives in consistency doc scope table.
- [x] Tests prove client/server export split.
- [x] No `draggable`/`resize` added to overlays.

## Decision

**PROCEED** — overlay family at contract tier.
