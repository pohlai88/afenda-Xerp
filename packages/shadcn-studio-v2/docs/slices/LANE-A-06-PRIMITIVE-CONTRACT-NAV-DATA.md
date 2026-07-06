# Lane A-06 — Primitive Contract Navigation And Data Chrome

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers promoting navigation/data primitives to contract tier
- Authority: `../PRIMITIVE-API-CONSISTENCY.md`, `PHASE-5-LAYOUT-CHROME.md`
- Action enabled: Govern tabs, breadcrumb, pagination, and related chrome primitives

## Overview

Third primitive promotion batch: navigation and data-display helpers that support
layout chrome and data-table surfaces.

## Problem

Layout and table views compose tabs, breadcrumbs, and pagination without contract
tests on those underlying primitives.

## Goals

- Contract-test: `tabs`, `breadcrumb`, `pagination`, `separator`, `scroll-area`.
- Document variant and slot conventions.

## Non-goals

- Full data-table business logic.
- Sidebar/topbar changes (Phase 5 complete).
- `navigation-menu`, `menubar` (deferred optional batch).

## Constraints

- Tabs expose keyboard-focusable trigger styling in contract tests.
- Pagination uses plain anchors — no Next.js router coupling.

## Proposed design

### Delivered artifacts

- `src/__tests__/primitive-nav-data.test.ts` — Lane A-06 contract suite
- Extended `primitive-api-consistency.test.ts` — five nav/data files in scan set
- `PRIMITIVE-API-CONSISTENCY.md` — scope + variant inventories

### Per-primitive checklist (complete)

| File | Contract proof |
| --- | --- |
| `tabs.tsx` | list variants, trigger focus ring, client boundary |
| `breadcrumb.tsx` | nav/ol semantics, SSR markup |
| `pagination.tsx` | anchor links, button class composition, no router |
| `separator.tsx` | orientation class helper, client boundary |
| `scroll-area.tsx` | viewport/scrollbar/thumb slots |

## Interfaces / dependencies

- Depends on A-04/A-05 `button` helpers (pagination links).
- Supports `data-table-surface.tsx`, `AppShell01` navigation regions.

## Risks and mitigations

- Risk: scope creep into full shadcn catalog.
  - Mitigation: five required files only; menubar/navigation-menu deferred.

## Rollout and rollback

Completed in one batch. Rollback: revert test suite + doc rows for failing primitive only.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test:primitives
pnpm --filter @afenda/shadcn-studio-v2 test src/__tests__/layout-shared.test.tsx
```

## Done definition

- [x] Minimum five nav/data primitives in consistency doc.
- [x] Contract tests pass.
- [x] Layout tests still green.

## Decision

**PROCEED** — nav/data chrome at contract tier.
