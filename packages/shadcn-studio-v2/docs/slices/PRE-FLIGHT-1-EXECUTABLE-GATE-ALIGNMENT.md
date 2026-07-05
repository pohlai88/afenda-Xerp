# Pre-Flight 1 - Executable Gate Alignment Technical Specification

## Overview

This pre-flight slice aligns the package verification surface with the active
greenfield architecture and removes dependence on obsolete or non-existent
documentation trees.

## Problem

The package test surface currently mixes useful executable rules with checks for
older documentation structures and migration tracks that do not match the active
greenfield architecture.

That leaves the package in a split state:

* code-oriented gates can pass
* documentation-oriented tests can fail for the wrong reasons
* implementation status becomes ambiguous because the verification surface is
  not aligned to the current architecture

## Goals

* Define the minimum executable gate set that matches the current architecture.
* Identify which existing tests remain valid, which should be rewritten, and
  which should stop blocking greenfield implementation.
* Require every future slice to name the exact package-level proof commands.

## Non-goals

* Implementing the gate rewrites in this slice.
* Relaxing quality standards.
* Declaring enterprise acceptance.

## Constraints

* The required package gates from the active architecture are:

  * `pnpm --filter @afenda/shadcn-studio-v2 test`
  * `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
  * `pnpm --filter @afenda/shadcn-studio-v2 build`
  * `pnpm --filter @afenda/shadcn-studio-v2 check:drift`
  * `pnpm exec biome ci packages/shadcn-studio-v2`
* Production claims require one real consumer route and public-import proof.
* Verification must stay code-first and must not require broad narrative doc
  scaffolds to exist just to make the test suite green.

## Proposed design

### Gate classes

Keep four gate classes explicit:

1. Structural gates

   * taxonomy and folder law
   * root export boundary
2. Style and token gates

   * CSS token families
   * forbidden deep imports
   * no raw hex in reusable TSX
3. Implementation gates

   * primitive API consistency
   * runtime client/server separation
   * composed view and layout proof
4. Consumer proof gates

   * one real consumer route
   * package CSS import proof
   * no deep internal imports

### Rewrite targets

The current verification surface should be reviewed against these rules:

* keep tests that enforce live structure, exports, token safety, and runtime
  boundaries
* rewrite tests that depend on removed slice trees, broad Bridging-R docs, or
  obsolete migration workflows
* move narrative-only requirements out of blocking tests unless they protect an
  active public or migration contract

### Slice gate contract

Every future slice must list:

* exact commands to run
* what pass/fail means
* which assertions are package-local only
* which assertions require real consumer proof

## Interfaces / dependencies

* Source docs:

  * `../DESIGN-SYSTEM-ARCHITECTURE.md`
  * `../DEVELOPMENT-ROADMAP.md`
  * `../DESIGN-SYSTEM-GUIDELINE.md`
  * `../PRIMITIVE-API-CONSISTENCY.md`
  * `../MIGRATION-MAP.md`
* Primary code surfaces likely affected after approval:

  * `src/__tests__/**`
  * `scripts/check-design-system-drift.ts`
  * package verification commands in `package.json`

## Risks and mitigations

* Risk: gate alignment is mistaken for lowering the bar.

  * Mitigation: keep architecture-required proof commands unchanged.
* Risk: obsolete tests keep blocking valid greenfield work.

  * Mitigation: classify tests by active architecture fit before rewriting.
* Risk: consumer-proof requirements get deferred too long.

  * Mitigation: keep consumer proof as an explicit gate class, not an optional
    later task.

## Rollout and rollback

### Rollout

1. Audit current tests against the active architecture.
2. Mark obsolete documentation-coupled blockers.
3. Rewrite the failing blockers to assert current architecture and active docs.
4. Re-run the package gate set.

### Rollback

If a rewritten gate stops protecting a real contract, restore the contract as an
executable test immediately. Do not compensate by writing more narrative docs.

## Open questions

* Whether documentation-boundary checks belong in one dedicated docs test or in
  smaller package-specific tests.
* Which current migration-status assertions should remain blocking before a real
  consumer route exists.
