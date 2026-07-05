# Phase 5 - Layout Chrome Technical Specification

## Overview

This slice builds the reusable enterprise layout chrome in
`src/components/layout`.

## Problem

Shell and navigation surfaces are common drift points: route assumptions,
business logic, inaccessible nav state, and hardcoded visual behavior tend to
enter early if the layout layer is not bounded.

## Goals

* Implement `AppShell`, `Sidebar`, and `Topbar`.
* Keep shell components reusable, accessible, and route-framework-independent.
* Provide the structural layer required for later composed views and proof
  routes.

## Non-goals

* App route ownership.
* Business permissions or entitlements.
* Consumer-specific menu generation.

## Constraints

* Use primitives from `components/ui`.
* Use semantic HTML and accessible nav structure.
* Support active-state semantics such as `aria-current`.
* Avoid route-framework and business-logic coupling.

## Proposed design

### Layout responsibilities

* `AppShell` owns outer frame structure
* `Sidebar` owns grouped navigation chrome
* `Topbar` owns title and action areas

### Verification posture

The slice must prove:

* layout render structure
* active navigation semantics
* keyboard reachability
* token-safe class behavior

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * `../TAXONOMY.md`
* Downstream slices:

  * Phase 6 view layer
  * Phase 8 proof route

## Risks and mitigations

* Risk: shell chrome bakes in one app's route model.

  * Mitigation: keep inputs typed and generic.
* Risk: nav accessibility is deferred.

  * Mitigation: make active-state and landmark semantics part of the slice DoD.
* Risk: shell visuals start depending on non-canonical colors.

  * Mitigation: keep shell styling token-only.

## Rollout and rollback

### Rollout

1. Implement the three layout components.
2. Add or align layout tests.
3. Verify package-local commands.

### Rollback

If a shell component needs consumer-specific behavior to function, move that
behavior to the proof route or consumer app rather than into the shared layout
layer.

## Open questions

* Whether `AdmincnShell` remains part of this slice or is treated as a later
  shell-composition extension.
