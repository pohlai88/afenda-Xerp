# Phase 3 - Readiness Approval

## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | migration |
| Audience | V2 migration engineers, reviewers, release-owners |
| Source of truth | `../COMPONENT-PRE-MIGRATION.md` |
| Input status | `pending` |
| Output status | `approved-for-migration` |
| Allowed authority | Approve implementation readiness only. |
| Blocked-by conditions | Incomplete ledger row, invalid taxonomy destination, unresolved dependency, missing proof target, or missing rollback note. |

## Navigation

- Previous phase: [Phase 2 - Ledger registration](PHASE-2-LEDGER-REGISTRATION.md)
- Next phase: [Phase 4 - V2 implementation and package proof](PHASE-4-V2-IMPLEMENTATION-PACKAGE-PROOF.md)

## Purpose

Decide whether a registered component may enter V2 implementation.

This phase turns a complete ledger row into a controlled implementation approval.

## Scope

Allowed work:

- review ledger completeness
- verify destination, timing, dependencies, and proof targets
- move status from `pending` to `approved-for-migration`

Forbidden work:

- implementing before approval
- approving components with unknown API strategy
- approving components with unresolved CSS, runtime, metadata, reference, or accessibility questions
- approving components without rollback note

## Procedure

1. Review the `../MIGRATION-MAP.md` row field by field.
2. Reject incomplete rows.
3. Confirm no forbidden dependency is required.
4. Confirm proof targets are concrete.
5. Confirm rollback can restore the previous consumer path.
6. Update status to `approved-for-migration` only after all checks pass.

## Required evidence

Every field must cite a path, reviewer, owner, artifact, command, route, or explicit `none - reviewed`.

```md
- Ledger row reviewed:
- Taxonomy destination verified:
- Roadmap timing verified:
- API strategy reviewed:
- Export intent reviewed:
- CSS/token compatibility reviewed:
- Runtime boundary reviewed:
- Metadata role reviewed:
- Reference boundary reviewed:
- Accessibility concerns reviewed:
- Proof targets reviewed:
- Rollback note reviewed:
- Approval status:
```

## Exit gate

```txt
No approved status, no implementation.
```

## Failure modes

- Treating a completed ledger row as implementation approval.
- Approving visual components without visual proof target.
- Approving public components without Storybook target or reviewed Vitest-only exception.
- Approving components that require deep imports.
