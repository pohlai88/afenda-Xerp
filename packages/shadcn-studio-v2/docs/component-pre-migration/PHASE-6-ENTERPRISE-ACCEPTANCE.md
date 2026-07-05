# Phase 6 - Enterprise Acceptance

## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | migration |
| Audience | V2 migration engineers, reviewers, release-owners |
| Source of truth | `../COMPONENT-PRE-MIGRATION.md` |
| Input status | `pilot-proven` |
| Output status | `enterprise-accepted` |
| Allowed authority | Accept full enterprise evidence for controlled production eligibility. |
| Blocked-by conditions | Missing visual proof, accessibility proof, API compatibility proof, rollback proof, public export proof, or release-owner record. |

## Navigation

- Previous phase: [Phase 5 - Controlled pilot integration](PHASE-5-CONTROLLED-PILOT-INTEGRATION.md)
- Next phase: [Phase 7 - Release cutover and retirement review](PHASE-7-RELEASE-CUTOVER-RETIREMENT-REVIEW.md)

## Purpose

Separate local migration success and pilot integration from operational release readiness.

This phase may move a component from `pilot-proven` to `enterprise-accepted`.

## Scope

Allowed work:

- complete enterprise evidence record
- review package, consumer, CSS, runtime, metadata, visual, accessibility, and rollback proof
- record release-owner approval

Forbidden work:

- approving based only on package tests
- approving without visual proof
- approving without accessibility proof
- approving without API compatibility proof
- approving without rollback proof
- approving without public export proof
- approving without release-owner record
- deleting V1 source

## Procedure

1. Confirm Phase 4 package proof is complete.
2. Confirm Phase 5 pilot proof is complete.
3. Confirm API compatibility strategy matched the implementation.
4. Confirm consumer impact is documented.
5. Confirm public export path is stable.
6. Confirm forbidden imports are absent.
7. Confirm visual and accessibility evidence is reviewable.
8. Confirm rollback proof exists.
9. Record release-owner approval.
10. Move status to `enterprise-accepted` only after evidence is complete.

## Required evidence

Complete this record in `../MIGRATION-MAP.md`. Every field must contain a specific command, path, reviewer, owner, route, artifact, or explicit `none - reviewed`.

```md
## Enterprise Evidence Record

- Package build proof:
- Package typecheck proof:
- Package test proof:
- Biome proof:
- Public export proof:
- Forbidden import proof:
- API compatibility proof:
- Consumer impact proof:
- CSS loading proof:
- Runtime client/server proof:
- Accessibility proof:
- Storybook/visual proof:
- Metadata safety proof:
- Pilot consumer:
- Pilot route/page:
- Rollback proof:
- Release-owner:
- Enterprise acceptance status:
```

## Exit gate

```txt
Enterprise evidence may move status from pilot-proven to enterprise-accepted.
```

## Failure modes

- Marking a component `enterprise-accepted` while evidence fields are generic.
- Using `migrated` as a shortcut for production readiness.
- Accepting visual components without visual review evidence.
- Accepting a component whose rollback path is theoretical.
