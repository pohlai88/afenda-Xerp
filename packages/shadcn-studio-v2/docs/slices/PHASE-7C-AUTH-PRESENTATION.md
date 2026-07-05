# Phase 7C - Auth Presentation Technical Specification

## Document Status

- Status: Planned implementation slice
- Audience: Engineers implementing auth presentation surfaces
- Authority: `../DESIGN-SYSTEM-ARCHITECTURE.md` and `../TAXONOMY.md`
- Action enabled: Build auth UI presentation without owning authentication behavior

## Overview

This slice implements authentication presentation under `src/views/auth`.

## Problem

Auth screens are often treated as both UI and auth logic. In this package, auth
surfaces must stay presentational so provider choice, session state, MFA, and
route handling remain outside the design system.

## Goals

- Implement `AuthShell`.
- Provide typed props for labels, actions, and supporting content.
- Represent loading, error, unavailable, and disabled states.
- Keep auth presentation accessible and token-safe.

## Non-goals

- Authentication implementation.
- Auth provider calls.
- Session state.
- Login routes.
- MFA or policy logic.
- Consumer app edits.

## Constraints

- Auth surfaces are presentational.
- Inputs and actions must be labeled.
- State is passed in through props.
- No hardcoded provider logic.
- No route-framework dependency.

## Proposed design

### AuthShell responsibilities

- Owns auth page frame and visual hierarchy.
- Accepts title, description, form/action slots, secondary actions, and state.
- Does not validate credentials or own submission behavior.

### Verification posture

The slice must prove:

- `AuthShell` renders with accessible labels
- state variants are representable
- no auth provider dependency exists
- no app route import exists

## Interfaces / dependencies

- Source docs:
  - `../DESIGN-SYSTEM-ARCHITECTURE.md`
  - `../TAXONOMY.md`
- Source dependencies:
  - `src/components/ui/**`
  - `src/components/layout/**` only if needed for shell composition
- Downstream slices:
  - Phase 8 proof route

## Risks and mitigations

- Risk: auth presentation starts owning login behavior.
  - Mitigation: keep behavior in consumer callbacks or slots.
- Risk: provider-specific copy becomes package default.
  - Mitigation: make provider labels and actions props.
- Risk: auth errors become business-specific.
  - Mitigation: expose generic error presentation props.

## Rollout and rollback

### Rollout

1. Implement `AuthShell`.
2. Add render, state, and accessibility tests.
3. Run package gates.

### Rollback

If auth behavior or provider logic appears in the package, remove it and leave
only presentation hooks for the consumer.

## Required gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm exec biome ci packages/shadcn-studio-v2
```

## Done definition

- `AuthShell` exists.
- Typed props exist.
- Auth states are testable.
- No authentication behavior is implemented inside the package.

## Open questions

- Whether social/provider button composition belongs in `AuthShell` props or a
  later auth-extension component.
