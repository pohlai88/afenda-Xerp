# Phase 7 - Release Cutover and Retirement Review

## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | migration |
| Audience | V2 migration engineers, reviewers, release-owners |
| Source of truth | `../COMPONENT-PRE-MIGRATION.md` |
| Input status | `enterprise-accepted` |
| Output status | `retirement-candidate` |
| Allowed authority | Approve controlled consumer cutover and retirement review only. |
| Blocked-by conditions | Missing release-owner review, missing rollback window, active V1 consumer dependency, or deep V2 import. |

## Navigation

- Previous phase: [Phase 6 - Enterprise acceptance](PHASE-6-ENTERPRISE-ACCEPTANCE.md)
- Next phase: none

## Purpose

Approve controlled production usage and decide whether V1 can become a retirement candidate.

This phase keeps production cutover and V1 retirement separate.

## Scope

Allowed work:

- switch approved consumers to enterprise-accepted V2 surfaces
- monitor import boundaries
- keep rollback path active
- classify V1 as retirement candidate after release-owner review

Forbidden work:

- deleting V1 immediately after migration
- retiring V1 from package-local proof alone
- broad consumer search-and-replace without pilot evidence
- removing rollback before release acceptance

## Procedure

1. Confirm enterprise acceptance.
2. Confirm target consumer and import path.
3. Execute controlled cutover.
4. Verify consumer import boundary.
5. Keep rollback active.
6. Monitor for CSS, runtime, metadata, visual, and accessibility regressions.
7. Record release evidence.
8. Review whether V1 may become `retirement-candidate`.
9. Defer actual retirement to a separate approved change.

## Required evidence

Every field must cite a path, reviewer, owner, artifact, command, route, or explicit `none - reviewed`.

```md
- Enterprise-accepted component:
- Consumer switched:
- Import path used:
- Cutover verifier:
- Rollback window:
- Regression checks:
- Release-owner:
- Retirement candidate decision:
- Legacy retirement plan updated:
```

## Exit gate

```txt
Enterprise-accepted components may become retirement-candidate only after release-owner review.
```

## Failure modes

- Treating `enterprise-accepted` as automatic V1 deletion.
- Cutting over consumers with deep V2 imports.
- Removing rollback too early.
- Updating many consumers before the first release surface is stable.
