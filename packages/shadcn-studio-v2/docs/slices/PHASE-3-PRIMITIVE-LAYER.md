# Phase 3 - Primitive Layer Technical Specification

## Overview

This slice builds the primitive UI layer in `src/components/ui`.

It is the first reusable implementation layer and must stay small,
presentational, accessible, and token-safe.

## Problem

If primitive APIs drift early, every later layout, view, and consumer route
inherits inconsistent variants, unsafe props, or runtime coupling.

## Goals

* Implement `Button`, `Badge`, `Card`, `Alert`, `Field`, and `Table`.
* Keep primitive APIs explicit and stable.
* Prove accessibility and token safety through package-local tests.

## Non-goals

* Business logic.
* App routing behavior.
* Stateful provider-owned primitive patterns.

## Constraints

* Use semantic variants rather than boolean customization props.
* Prefer children and named parts over render props.
* Keep primitives presentational unless runtime ownership is proven.
* Use canonical tokens only.

## Proposed design

### Primitive contract

Each primitive must provide:

* typed props
* stable semantic variants or sizes where needed
* accessible structure and names where applicable
* focus-visible and disabled states where applicable
* `data-slot` markers where structural proof is useful

### Test posture

The slice should align primitive tests around:

* API consistency
* token-safe class generation
* semantic render output
* no runtime-only coupling

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../PRIMITIVE-API-CONSISTENCY.md`
  * `../TAXONOMY.md`
* Downstream slices:

  * Phase 5 layout chrome
  * Phase 6 view layer

## Risks and mitigations

* Risk: primitives become mini-apps.

  * Mitigation: keep runtime state out unless explicitly proven necessary.
* Risk: API surface grows around convenience props.

  * Mitigation: treat new primitive props as contract changes requiring proof.
* Risk: visuals pass but accessibility states lag.

  * Mitigation: require state coverage in tests, not just static render proof.

## Rollout and rollback

### Rollout

1. Implement the primitive files in `components/ui`.
2. Add or align primitive API consistency tests.
3. Re-run package-local proof commands.

### Rollback

If a primitive cannot meet the quality bar without extra app assumptions, keep
it out of the public primitive layer and defer it to a later composed-view
surface.

## Open questions

* Which primitives need explicit loading-state behavior in the first release
  rather than later composed surfaces.
