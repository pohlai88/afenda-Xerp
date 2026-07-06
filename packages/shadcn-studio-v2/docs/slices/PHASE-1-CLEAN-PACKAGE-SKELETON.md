# Phase 1 - Clean Package skeleton Technical Specification

## Overview

This slice establishes the clean package skeleton for
`packages/shadcn-studio-v2` using the active architecture and greenfield
roadmap.

It is the first implementation slice after pre-flight work because every later
token, primitive, runtime, and consumer step depends on the package shape and
public boundary being locked first.

## Problem

The package architecture requires one approved `src/` structure, four root
boundary files, and stable public entrypoints. If the package shape is not
locked early, later work can drift into reference-app naming, legacy folder
restoration, or accidental public surface growth.

## Goals

* Lock the approved `src/` directory structure.
* Lock the root boundary files:

  * `src/index.ts`
  * `src/clients.ts`
  * `src/server.ts`
  * `src/metadata.ts`
* Add package-local structural tests that reject drift.
* Keep the package ready for token, primitive, runtime, and consumer work.

## Non-goals

* Implementing full token values or theme behavior.
* Building primitives beyond the minimum structure needed for Phase 1.
* Building consumer routes.
* Broad migration or retirement work.

## Constraints

* Structure must follow `../TAXONOMY.md`.
* Public import law must follow `../DESIGN-SYSTEM-ARCHITECTURE.md`.
* The slice must stay inside `packages/shadcn-studio-v2`.
* No reference-project folder names may enter `src/`.
* No consumer app files may be touched.

## Proposed design

### Approved source shape

The slice must lock this shape:

```txt
src/
  components/
    ui/
    layout/
    shared/
    assets/
    quarantine/

  views/
    auth/
    pages/
    widgets/
    datatables/
    forms/
    dialogs/
    settings/

  configs/
  contexts/
  hooks/
  metadata/
    builders/
    contracts/
    gates/
    registries/
  styles/
  types/
  utils/
  lib/

  index.ts
  clients.ts
  server.ts
  metadata.ts
```

### Boundary law

Phase 1 must make these rules executable:

* consumers may not import from `src/*`
* consumers may not import internal folders
* root boundary files must remain explicit
* structural names outside the approved taxonomy are rejected

### Verification posture

Phase 1 is complete only when the package has:

* taxonomy enforcement
* root export drift protection
* package typecheck
* package build
* package Biome pass

The slice may create placeholder directories and root surfaces, but those
surfaces must already reflect the intended neutral/client/server/metadata split.

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * `../TAXONOMY.md`
* Downstream slices:

  * token and CSS authority
  * primitive layer
  * runtime boundary
  * layout chrome
  * consumer route proof

## Risks and mitigations

* Risk: shape is locked too loosely, allowing later drift.

  * Mitigation: enforce the tree with tests instead of prose only.
* Risk: root exports become casual barrels.

  * Mitigation: keep boundary files explicit and purpose-specific.
* Risk: reference or legacy naming leaks back in.

  * Mitigation: reject those names in taxonomy and drift tests.

## Rollout and rollback

### Rollout

1. Create or align the approved `src/` tree.
2. Create the four root boundary files.
3. Add or align structural tests for folder law and public-entry drift.
4. Run package-local proof commands.

### Rollback

If the new structure blocks a required capability, amend `TAXONOMY.md` first and
then update the tests. Do not create an undocumented exception in `src/`.

## Open questions

* Whether the `views/*` future folders should exist immediately as empty
  directories or only when each later slice begins.
* Whether a dedicated `theme` export file should be introduced in a later
  runtime-boundary slice rather than Phase 1.
