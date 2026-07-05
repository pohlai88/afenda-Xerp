# Phase 7 - Public Export Contract Technical Specification

## Overview

This slice creates and hardens the public package export contract.

It turns the internal implementation layers into explicit, consumer-safe
entrypoints.

## Problem

Even well-structured package code is unsafe to consume if exports drift,
internal folders leak, or CSS and runtime paths bypass the intended boundary.

## Goals

* Lock the neutral, client, server, metadata, theme, and CSS export surfaces.
* Block forbidden deep imports and accidental export drift.
* Keep metadata and runtime boundaries isolated.

## Non-goals

* Proving a real consumer route.
* Adding new components or views beyond what earlier slices require.

## Constraints

* Consumers must never import from `src`.
* CSS must be imported from package-exported paths only.
* Metadata exports must stay metadata-only.
* Client and server exports must remain separated.

## Proposed design

### Export surfaces

Lock these package entrypoints:

* `@afenda/shadcn-studio-v2`
* `@afenda/shadcn-studio-v2/clients`
* `@afenda/shadcn-studio-v2/server`
* `@afenda/shadcn-studio-v2/metadata`
* `@afenda/shadcn-studio-v2/theme`
* exported CSS entrypoints

### Verification posture

The slice must prove:

* no wildcard or accidental boundary drift
* no consumer deep imports into internals
* CSS exports resolve from package boundary only

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * `../MIGRATION-MAP.md`
* Downstream slices:

  * Phase 8 proof route
  * Phase 9 enterprise acceptance

## Risks and mitigations

* Risk: internal implementation paths become de facto public API.

  * Mitigation: enforce forbidden import tests and package exports together.
* Risk: metadata surface becomes a general dump.

  * Mitigation: keep metadata-only tests blocking.
* Risk: client runtime leaks into server surface.

  * Mitigation: keep boundary tests part of the slice.

## Rollout and rollback

### Rollout

1. Align package export map and root boundary files.
2. Add or align export drift and deep-import tests.
3. Verify package-local commands.

### Rollback

If an export cannot be justified as stable consumer contract, keep it internal
until a later slice proves the need.

## Open questions

* Whether the `theme` surface should remain separate from `clients` long-term or
  stay as a dedicated import path for consumer clarity.
