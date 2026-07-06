# Lane A-01 — Kebab Stem Normalization

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers maintaining `src/**` file stems
- Authority: `../TAXONOMY.md`, `scripts/normalize-kebab-stems.ts`
- Action enabled: Verify stem law; do not reintroduce PascalCase paths

## Overview

Deterministic rename of all implementation file stems under `src/**` to lowercase
kebab-case, with import-path rewrites only (never TypeScript export names).

## Problem

Mixed-case file stems (`Button.tsx`, `PageSurface.tsx`) conflict with taxonomy
law and make import paths unpredictable across Windows and CI.

## Goals

- Normalize 54+ implementation stems in one script pass.
- Enforce widget lane overrides (`widget-metric`, `widget-evidence`).
- Keep React export names PascalCase.

## Non-goals

- Renaming root barrels (`index.ts`, `clients.ts`, `server.ts`, `metadata.ts`).
- v1 migration or ERP changes.

## Constraints

- Script must not replace bare identifier stems globally.
- Windows case-only renames use temp-file two-step.
- `__tests__/**` excluded from stem law.

## Proposed design

### Tooling

```bash
pnpm --filter @afenda/shadcn-studio-v2 normalize:kebab-stems -- --check
pnpm --filter @afenda/shadcn-studio-v2 normalize:kebab-stems -- --write
```

### Evidence

- Taxonomy tree snapshot updated.
- 164 package tests pass post-rename.
- `MIGRATION-MAP.md` records completion.

## Interfaces / dependencies

- Upstream: Phase 1 taxonomy skeleton.
- Downstream: all Lane A slices assume kebab paths.

## Risks and mitigations

- Risk: script corrupts identifiers.
  - Mitigation: path-only rewrite; git restore + fixed script (resolved 2026-07-06).
- Risk: duplicate kebab/PascalCase files on Windows.
  - Mitigation: remove orphan kebab duplicates before `--write`.

## Rollout and rollback

### Rollout (completed)

1. Fixed `normalize-kebab-stems.ts` (path-only rewrites).
2. Ran `--write` on clean tree.
3. Updated tests and `TAXONOMY.md`.

### Rollback

Re-run from git for affected files; do not hand-rename piecemeal.

## Required gates

Standard Lane A package gates + `normalize:kebab-stems --check` clean.

## Done definition

- [x] All `src/**` stems match kebab law.
- [x] Import paths updated.
- [x] Export names unchanged.
- [x] Taxonomy snapshot aligned.

## Decision

`PROCEED` — complete.
