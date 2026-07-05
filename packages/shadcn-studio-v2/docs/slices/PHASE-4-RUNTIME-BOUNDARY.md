# Phase 4 - Runtime Boundary Technical Specification

## Overview

This slice builds the design-system runtime boundary: theme and studio runtime
providers, hooks, and runtime-safe config/type surfaces.

## Problem

Without a clear runtime boundary, client-only code can leak into neutral or
server exports, and theme/runtime ownership can spread across later views or
consumers.

## Goals

* Implement `ThemeProvider`, `StudioProvider`, `use-theme`, `use-studio`,
  `ThemeToggle`, `ThemeScript`, `theme-config.ts`, `studio-config.ts`, and the
  matching type files.
* Keep runtime ownership small and explicit.
* Separate neutral, client, and server-safe exports.

## Non-goals

* App-specific persistence rules.
* Expanding theme presets.
* Adding consumer-only runtime state.

## Constraints

* Theme runtime supports `shadcn-default`, `swiss-noir`, and `verdant-noir`.
* Client runtime exports stay out of `server.ts`.
* Neutral exports must not accidentally become client-runtime entrypoints.

## Proposed design

### Runtime surfaces

* `contexts/*` own provider boundaries
* `hooks/*` own runtime access
* `configs/*` stay static and runtime-neutral
* shared runtime components remain small and client-safe

### Verification posture

The slice must prove:

* deterministic boundary between neutral/client/server surfaces
* no server-only leakage into client exports
* no client-only leakage into server exports

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * `../TAXONOMY.md`
* Downstream slices:

  * Phase 6 view layer
  * Phase 7 public export contract
  * Phase 8 proof route

## Risks and mitigations

* Risk: runtime grows into a second app framework.

  * Mitigation: keep provider scope narrow and config-driven.
* Risk: theme runtime leaks into neutral exports.

  * Mitigation: prove export separation with tests.
* Risk: storage assumptions become consumer-breaking defaults.

  * Mitigation: keep storage behavior explicit and configurable.

## Rollout and rollback

### Rollout

1. Implement provider, hook, config, and type files.
2. Align boundary tests.
3. Verify package-local commands.

### Rollback

If runtime behavior requires app-specific assumptions, move those assumptions
out of V2 and keep the package runtime generic.

## Open questions

* Whether `ThemeScript` belongs in the first runtime slice or the later public
  export and proof-route slices.
