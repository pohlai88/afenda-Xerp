# Lane B-13 — V1 Import Freeze And Retirement Candidate

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: Platform + presentation engineers
- Action enabled: B-14 Lane B synchronization gate

## Overview

Freeze new v1 consumption with CI governance and mark `@afenda/shadcn-studio` as
**retirement-candidate** in foundation disposition (via registry owner).

## Problem

Without a hard freeze, v1 imports can reappear during feature work after migration waves.

## Goals

- CI gate: fail on new `@afenda/shadcn-studio` imports outside `packages/shadcn-studio/**`.
- Assert B-01 baseline ratchet at 0 for all consumers.
- Registry promotion: `@afenda/shadcn-studio` → `retirement-candidate` (not yet `retired`).

## Non-goals

- Deleting v1 package directory (B-15).
- Amending ADR-0027 (B-15).

## Constraints

- Registry edits via `@foundation-registry-owner` only.
- Gate must allow v1 package self-references only.

## Proposed design

### Governance test (B-13 delegates here — do not duplicate)

Wire repo CI to:

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:v1-consumer-imports
```

At B-13, ratchet baseline to **zero** imports in the same PR as the import freeze.
Scanner SSOT: `packages/shadcn-studio-v2/scripts/scan-v1-consumer-imports.ts`.

Root `quality:boundaries` chains `pnpm check:v1-consumer-imports`. Executable proof:
`lane-b-v1-import-freeze.test.ts`.

### Disposition update

Foundation registry owner promotion:

- `@afenda/shadcn-studio` lane: `green-lane` → `amber-lane` (retirement-candidate)
- Evidence: B-12, B-07-ext, B-08, B-11, baseline 0
- Prohibited: `do-not-add-v1-consumer-imports`

## Interfaces / dependencies

- Upstream: B-12, B-11, B-07-ext, B-08 (zero consumer imports)
- Downstream: B-14, B-15

## Risks and mitigations

- Risk: hidden dynamic imports.
  - Mitigation: static scan + optional knip advisory.

## Rollout and rollback

1. Land CI gate at 0 imports.
2. Registry owner updates disposition.
3. Communicate freeze to all lanes (PAS DEVELOPMENT-LANE-BOUNDARIES note).

Rollback: gate warning-only mode if emergency; disposition unchanged.

## Required gates

```bash
pnpm check:v1-consumer-imports
pnpm --filter @afenda/shadcn-studio-v2 test -- lane-b-v1-import lane-b-v1-import-freeze
pnpm check:foundation-disposition
pnpm quality:boundaries
pnpm --filter @afenda/erp build
pnpm --filter @afenda/developer build
pnpm --filter @afenda/storybook typecheck
```

## Done definition

- [x] v1 import CI gate enforced at 0
- [x] Registry shows retirement-candidate (`amber-lane` + disposition note)
- [x] MIGRATION-MAP v1 package row updated
- [x] No consumer v1 imports
- [x] ERP `package.json` and `next.config.ts` v1-free

## Decision

**PROCEED** — import freeze enforced; v1 package retirement-candidate recorded
