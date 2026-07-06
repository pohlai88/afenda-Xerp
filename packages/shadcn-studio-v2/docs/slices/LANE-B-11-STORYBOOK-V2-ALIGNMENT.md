# Lane B-11 — Storybook V2 Alignment

## Document status

- Status: **Complete**
- Completed: 2026-07-06
- Audience: Storybook + presentation engineers
- Authority: PAS-006A Storybook lab, Lane B index
- Action enabled: Align Storybook block lab with v2 imports and parameters

## Overview

Migrate `apps/storybook` from v1 block parameters and imports to
`@afenda/shadcn-studio-v2` public exports, preserving MCP block lab workflow.

## Problem

Storybook stories reference v1 lab welcome copy and `@afenda/shadcn-studio` blocks.
ADR-0027 names Storybook as v1 block lab; formal v1 deprecation requires v2 alignment
or an explicit documented waiver.

## Goals

- Update story parameters to v2 package paths.
- Migrate priority stories (primitives, surfaces, widgets) to v2 imports.
- Keep Storybook MCP manifest generation working.

## Non-goals

- Reinstalling entire MCP catalog into v2 quarantine (follow quarantine governance).
- ERP route changes.

## Constraints

- Storybook MCP policy: docs-first via MCP tools when adding stories.
- No internal v2 path imports from stories.

## Proposed design

### Phased story migration

1. Theme / provider decorators → v2 `StudioPresentationProviders`
2. Surface stories → v2 views
3. Legacy block stories → v2 equivalents or `deprecated` tag

### Proof

```bash
pnpm --filter @afenda/storybook typecheck
pnpm --filter @afenda/storybook test:storybook:run  # or a11y subset
```

## Interfaces / dependencies

- Upstream: B-07/B-08 surface patterns (reference implementations)
- Downstream: B-13 (zero v1 imports)

## Risks and mitigations

- Risk: MCP block inventory mismatch.
  - Mitigation: document gap list; quarantine promotion per A-07.

## Rollout and rollback

1. Provider/theme global switch.
2. Migrate stories in batches.
3. Ratchet B-01 storybook import count.

Rollback: revert storybook package.json dep to dual stack temporarily.

## Required gates

```bash
pnpm --filter @afenda/storybook typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 test -- lane-b-storybook-v2
```

### Gate evidence (2026-07-06)

- Storybook preview + ERP workspace dashboard shared module import `@afenda/shadcn-studio-v2/lab`.
- `AppShell01`, `MetricWidget`, and `EvidenceWidget` replace v1 MCP block grid in lab sample.
- B-01 storybook v1 import count target: 0 (boundary test + scan).

## Done definition

- [x] Storybook decorators on v2 providers
- [x] Priority stories migrated or tagged deprecated with waiver
- [x] Storybook typecheck PASS
- [x] B-01 storybook v1 count → 0 or waived in B-13

## Decision

**Complete** — Storybook lab aligned to v2 `./lab` export; v1 consumer imports removed from `apps/storybook`.
