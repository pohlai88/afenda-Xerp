# Pre-Flight 0 - Documentation Baseline Lock Technical Specification

## Overview

This pre-flight slice locks the minimum documentation baseline required before
Phase 1 implementation continues.

It translates the architecture rule "documentation is only allowed when it
directly protects code execution, migration, or deletion safety" into a bounded
documentation cleanup and authority pass.

## Problem

The package currently has multiple documentation surfaces with overlapping or
historically expanded intent:

* `DESIGN-SYSTEM-ARCHITECTURE.md`
* `DEVELOPMENT-ROADMAP.md`
* `TAXONOMY.md`
* restored legacy governance documents under `archive/`
* newly restored runtime-facing docs such as `README.md`, `MIGRATION-MAP.md`,
  `DESIGN-SYSTEM-GUIDELINE.md`, `PRIMITIVE-API-CONSISTENCY.md`, and
  `LEGACY-RETIREMENT-PLAN.md`

Without a baseline lock, contributors can keep adding or editing docs without a
clear rule about which documents remain active, which are archive-only, and
which docs must be converted into executable gates.

## Goals

* Name the active documentation set required to execute the package safely.
* Mark which docs are active authority versus historical archive.
* Stop new narrative-doc expansion inside `packages/shadcn-studio-v2/docs`.
* Align the docs index to the current active set.

## Non-goals

* Rewriting the entire document set in this slice.
* Designing new package architecture.
* Implementing code, tests, exports, or consumer routes.
* Deleting archive material.

## Constraints

* `DESIGN-SYSTEM-ARCHITECTURE.md` is the active architecture boundary.
* `DEVELOPMENT-ROADMAP.md` is the active greenfield execution sequence.
* `TAXONOMY.md` remains the structural law for `src/`.
* Archive documents may remain on disk, but they must not compete with the
  current active set.
* The surviving active docs must remain small, code-adjacent, and
  implementation-facing.

## Proposed design

### Active authority set

Keep these documents active:

* `README.md`
* `TAXONOMY.md`
* `DESIGN-SYSTEM-ARCHITECTURE.md`
* `DEVELOPMENT-ROADMAP.md`
* `MIGRATION-MAP.md`
* `DESIGN-SYSTEM-GUIDELINE.md`
* `PRIMITIVE-API-CONSISTENCY.md`
* `LEGACY-RETIREMENT-PLAN.md`
* `docs/slices/*`

### Archive rule

Treat `docs/archive/**` as historical input only. It may inform migration or
recovery work, but it is not current implementation authority unless a current
active document explicitly pulls a rule forward.

### Documentation reduction rule

Any future narrative doc must satisfy one of these conditions:

* it defines a bounded implementation slice
* it removes ambiguity from migration or retirement safety
* it documents an active public contract that cannot be enforced elsewhere

Otherwise, the content should become one of:

* a Vitest test
* a drift guard rule
* a Biome/lint rule
* Storybook proof
* consumer route proof
* a migration ledger row

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * `../TAXONOMY.md`
  * `../README.md`
* Dependent future work:

  * Pre-Flight 1 executable gate alignment
  * Phase 1 package skeleton work

## Risks and mitigations

* Risk: contributors keep using archive docs as equal authority.

  * Mitigation: explicitly mark archive scope in the docs index and slice set.
* Risk: documentation reduction becomes silent deletion.

  * Mitigation: convert durable operational or migration rules into tests or
    ledger rows before removal.
* Risk: architecture and roadmap drift apart.

  * Mitigation: each active slice must cite both current source documents.

## Rollout and rollback

### Rollout

1. Confirm the active documentation set in `docs/README.md`.
2. Add slice docs that cite only the active architecture and roadmap.
3. Route future implementation work through `docs/slices/*`.

### Rollback

If the reduced active set removes necessary implementation guidance, restore the
missing rule from archive into one active document or an executable gate. Do not
re-expand the entire archive as live authority.

## Open questions

* Whether `DESIGN-SYSTEM-GUIDELINE.md` should remain active long-term or be
  reduced further after token, export, and cutover gates exist in code.
* Whether a dedicated docs test should enforce the active-vs-archive boundary.
