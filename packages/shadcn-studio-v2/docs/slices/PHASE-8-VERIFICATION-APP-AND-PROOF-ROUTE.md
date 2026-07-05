# Phase 8 - Verification App And Proof Route Technical Specification

## Overview

This slice creates one real proof route that consumes V2 only through public
package entrypoints.

## Problem

Package-local tests are necessary but insufficient. Without a real consumer
route, export safety, CSS loading, and composed runtime behavior remain
unproven.

## Goals

* Select one real consumer route.
* Render the required V2 surfaces through public imports only.
* Prove base and named-theme behavior in the consumer environment.

## Non-goals

* Broad app migration.
* Business logic rollout.
* Legacy retirement.

## Constraints

* Public package imports only.
* CSS package exports only.
* Static fixture data only.
* No internal `src/*` imports.

## Proposed design

### Proof surface

The route should render the architecture-required V2 surface mix:

* shell chrome
* page surface
* widgets
* table/form/dialog/settings compositions
* theme controls

### Verification posture

The slice must prove:

* package entrypoint-only imports
* package CSS import-only styling
* light, dark, `swiss-noir`, and `verdant-noir` support
* consumer typecheck, build, and route smoke proof

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * `../MIGRATION-MAP.md`
* Downstream slices:

  * Phase 9 enterprise acceptance
  * Closing synchronization gate

## Risks and mitigations

* Risk: the route quietly imports internals.

  * Mitigation: keep import-path checks explicit.
* Risk: route proof is too narrow to catch theme/runtime issues.

  * Mitigation: require all supported theme states in the proof route.
* Risk: consumer proof is mistaken for broad migration approval.

  * Mitigation: keep this slice scoped to one bounded route only.

## Rollout and rollback

### Rollout

1. Pick the bounded consumer route.
2. Import only public V2 entrypoints and package CSS exports.
3. Add smoke and build/typecheck proof.

### Rollback

If the route requires internal imports to render, stop and fix the package
export contract before widening consumer proof.

## Open questions

* Which app should own the first proof route if both developer and ERP surfaces
  are available.
