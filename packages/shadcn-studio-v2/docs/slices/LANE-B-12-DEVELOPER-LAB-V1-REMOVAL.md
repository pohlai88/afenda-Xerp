# Lane B-12 — Developer Lab V1 Dependency Removal

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: Developer app engineers
- Authority: Lane B index, B-04 shell cutover
- Action enabled: B-13 v1 import freeze and retirement candidate review

## Overview

After B-04 shell cutover, migrated remaining `(lab)` dashboard blocks, settings panels,
and module document routes to v2 — then removed `@afenda/shadcn-studio` from
`apps/developer/package.json`.

## Problem

Developer app is the intentional route lab; it cannot retire v1 while lab routes still
import v1 blocks (`StatisticsRevenueCardBlock`, `SystemAdminUsersTableBlock`, etc.).

## Goals

- Zero `@afenda/shadcn-studio` imports under `apps/developer/src/**`.
- Remove v1 workspace dependency from developer `package.json`.
- Preserve `/design-system/v2-proof` and lab e2e smoke.

## Non-goals

- ERP migration (already B-07/B-08).
- Deleting v1 package from monorepo (B-15).

## Constraints

- Each lab route migration should prefer v2 surfaces over copying v1 block TSX.
- Appearance settings already partial v2 — complete the panel set.

## Proposed design

### Route migration order (suggested)

1. `(lab)/settings/appearance` — complete v2 theme panel
2. `(lab)/admin/users` — `DataTableSurface` with lab fixtures
3. `(lab)/dashboard/*` — `MetricWidget` / evidence-style panels
4. `(lab)/modules/**` — document state panels on v2 `Card` primitives

### Proof

```bash
pnpm --filter @afenda/developer build
pnpm --filter @afenda/developer verify:v2-proof
pnpm --filter @afenda/developer test:e2e:smoke  # when server available
```

B-01 baseline: developer v1 count = 0.

## Interfaces / dependencies

- Upstream: B-04, B-05 patterns for tables
- Downstream: B-13

## Risks and mitigations

- Risk: lab routes lose demo data richness.
  - Mitigation: fixtures in developer lib mirroring v2-proof patterns.

## Rollout and rollback

1. Migrate routes in sub-slices (one PR per route group).
2. Remove v1 dependency when import scan clean.
3. Update migration map developer row → `migrated` (parent evidence-sync after Wave 1 merge).

Rollback: re-add v1 dependency for single route if blocker found.

## Required gates

```bash
pnpm --filter @afenda/developer typecheck
pnpm --filter @afenda/developer build
pnpm --filter @afenda/developer verify:v2-proof
pnpm exec biome ci apps/developer
```

## Done definition

- [x] Zero v1 imports in developer src
- [x] v1 removed from developer package.json
- [x] All developer gates PASS
- [ ] Migration map developer → `migrated` (deferred — parent Wave 1 evidence-sync)

## Decision

**COMPLETE** — developer lab is v2-only; v1 dependency removed from `@afenda/developer`.
