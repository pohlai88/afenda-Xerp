# Lane A-03 — Auth Shell Proof Integration

## Document status

- Status: **Complete** (2026-07-06)
- Audience: Engineers closing Phase 7C proof gap
- Authority: `PHASE-7C-AUTH-PRESENTATION.md`, Lane A index
- Action enabled: Prove `AuthShell` on the developer proof route (opt-in)

## Overview

`auth-shell.tsx` is implemented and exported. This slice wires it on
`/design-system/v2-proof` behind a verification toggle so the default proof route
stays quiet for day-to-day development.

## Problem

Phase 9 acceptance covers surfaces on the proof route. Auth presentation existed in
the package but lacked consumer proof, so regressions could slip through.

## Goals

- Add `AuthShell` section to v2-proof with static fixture (ready state).
- Default **hidden**; opt-in via verification panel Switch or `?verify=1` / `?surfaces=auth`.
- Extend proof route tests (default absent + verification override).
- Mark Phase 7C consumer proof as complete.

## Non-goals

- Auth providers, sessions, MFA, or login routes.
- ERP auth screens.
- Replacing developer `(lab)` v1 shell (Lane B).

## Constraints

- Imports from `@afenda/shadcn-studio-v2` / `clients` only.
- Fixture data lives in `apps/developer/src/lib/v2-proof/fixtures.ts`.
- Presentational props only.

## Proposed design

### Surface visibility module

- `apps/developer/src/lib/v2-proof/surface-visibility.ts` — keys, defaults, URL parsing.
- `apps/developer/src/lib/v2-proof/use-v2-proof-surface-visibility.client.ts` — merge URL → localStorage → defaults; test overrides for Vitest.
- Reused by Lane A-08 for additional verification surfaces.

### Proof route

- Fixture: `v2ProofAuthFixture` (title, description, email).
- `AuthShell` in contained preview (`min-h-0` override) with `data-v2-proof-surface="auth-shell"`.
- Verification panel with Switch (`data-proof="auth-shell-toggle"`).

### Tests

- `v2-proof-route.test.tsx` — auth copy absent by default.
- `v2-proof-route.verification.test.tsx` — parsing + `testSurfaceOverrides={{ authShell: true }}`.

## Interfaces / dependencies

- Package: `AuthShell`, `AUTH_SHELL_SLOTS` from public exports.
- Consumer: `apps/developer/src/app/design-system/v2-proof/**`, `lib/v2-proof/**`.

## Risks and mitigations

- Risk: auth UI smuggles provider calls.
  - Mitigation: fixture-only; import-boundary test unchanged.
- Risk: full-viewport auth chrome dominates proof route.
  - Mitigation: default off; contained preview when enabled.

## Rollout and rollback

1. Surface visibility module + proof route wiring.
2. Run `verify:v2-proof`.
3. Update migration map auth row.

Rollback: remove proof section; package export remains.

## Required gates

```bash
pnpm --filter @afenda/developer verify:v2-proof
```

## Done definition

- [x] `AuthShell` wired on v2-proof (opt-in).
- [x] Proof tests assert default hidden + verification override.
- [x] No auth runtime imports in proof route.
- [x] Phase 7C consumer proof status updated.

## Decision

Auth verification is **off by default** to avoid sign-in noise on the proof route.
Developers enable via toggle, persisted preference, or `?verify=1`.
