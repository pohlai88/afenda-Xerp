# Lane B-04 — Developer Lab Shell Cutover

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: Developer app engineers
- Authority: Lane B index, Phase 8 proof route patterns
- Action enabled: B-12 developer v1 dependency removal (lab blocks remain v1 temporarily)

## Overview

Migrated `apps/developer/src/app/(lab)/` shell from `@afenda/shadcn-studio` to
`@afenda/shadcn-studio-v2/clients` (`AppShell01`). Theme runtime remains on root
`StudioPresentationProviders` — no nested v1 `SettingsProvider`.

## Problem

Developer app ran dual stack: v2 at root layout + proof route, v1 inside `(lab)`.
Lab is the highest-traffic v1 consumer for route experiments.

## Goals

- Replace `lab-shell.client.tsx` v1 imports with v2 shell exports.
- Preserve lab navigation, settings, and module document routes.
- Add or extend interaction tests for lab shell open/close and nav.

## Non-goals

- Migrating every lab dashboard block (can remain v1 temporarily).
- ERP changes.

## Constraints

- Use public v2 entrypoints only.
- Match operating-context wire patterns from ERP (`to-shell-operating-context-wire` stays ERP-side; lab uses fixtures).

## Proposed design

### Primary files (changed)

| File | Change |
| --- | --- |
| `apps/developer/src/app/(lab)/_components/lab-shell.client.tsx` | v2 `AppShell01` |
| `apps/developer/src/config/nav-config.ts` | v2 wire types |
| `apps/developer/scripts/check-developer-presentation-runtime.mjs` | v2 shell guard |

### Proof

- `lane-b-lab-shell-cutover.test.ts`
- `lab-shell.interaction.test.tsx` (sidebar toggle, nav link render)
- `pnpm --filter @afenda/developer verify:v2-proof` (regression)
- B-01 baseline lowered by 3 (lab shell ×2, nav-config ×1)

## Interfaces / dependencies

- Upstream: B-01 baseline
- Downstream: B-12 (remove v1 dep entirely)

## Risks and mitigations

- Risk: v1 blocks inside lab look wrong on v2 shell.
  - Mitigation: acceptable short term; track block migration in B-12.

## Rollout and rollback

1. Swapped shell imports to v2 `AppShell01`.
2. Developer gates recorded below.
3. B-01 baseline ratchet: 69 → 66 v1 import statements.

Rollback: revert lab-shell to v1 import.

## Required gates

```bash
pnpm --filter @afenda/developer verify:v2-proof
pnpm --filter @afenda/developer build
pnpm --filter @afenda/developer test
pnpm exec biome ci apps/developer
```

## Done definition

- [x] Lab shell uses v2 `AppShell01`
- [x] No v1 shell imports in `(lab)/_components/lab-shell*`
- [x] Developer build + verify:v2-proof PASS
- [x] B-01 baseline ratchet updated (66 total)

## commands Run

| command | Result |
| --- | --- |
| `pnpm --filter @afenda/developer verify:v2-proof` | PASS |
| `pnpm --filter @afenda/developer build` | PASS |
| `pnpm --filter @afenda/developer test` | PASS |
| `pnpm exec biome ci apps/developer` | PASS |
| `pnpm --filter @afenda/shadcn-studio-v2 sync:v1-consumer-import-baseline --write` | PASS (66 imports) |

## Decision

**`PROCEED`** — B-12 authorized when lab blocks are migrated.
