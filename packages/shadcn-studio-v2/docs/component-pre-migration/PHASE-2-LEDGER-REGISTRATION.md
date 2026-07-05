# Phase 2 - Ledger Registration

## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | migration |
| Audience | V2 migration engineers, reviewers, release-owners |
| Source of truth | `../COMPONENT-PRE-MIGRATION.md` |
| Input status | candidate identified/classified |
| Output status | `pending` |
| Allowed authority | Register movement evidence in `../MIGRATION-MAP.md`; do not approve implementation. |
| Blocked-by conditions | Missing field, vague evidence, unknown API strategy, unknown export intent, or missing rollback note. |

## Navigation

- Previous phase: [Phase 1 - Component inventory and classification](PHASE-1-COMPONENT-INVENTORY-CLASSIFICATION.md)
- Next phase: [Phase 3 - Readiness approval](PHASE-3-READINESS-APPROVAL.md)

## Purpose

Create the auditable movement record in `../MIGRATION-MAP.md` before any component code moves.

This phase makes migration reviewable and prevents after-the-fact justification.

## Scope

Allowed work:

- add or update component ledger rows
- record API strategy and consumer impact
- record export intent and proof targets
- record rollback notes

Forbidden work:

- implementing the component in V2
- marking a component `migrated`
- using blank ledger fields
- using `approved-for-migration` before all readiness fields are complete

## Procedure

1. Add the candidate row to `../MIGRATION-MAP.md`.
2. Fill every field required by `../COMPONENT-PRE-MIGRATION.md`.
3. Use `none - reviewed` only for reviewed absence of a dependency or proof target.
4. Keep status as `pending` until Phase 3 approves readiness.
5. Add a blocker note if any proof target or rollback path is missing.

## Required evidence

The `../MIGRATION-MAP.md` ledger row is the evidence. It must include concrete values for all required fields and must not use vague values.

Forbidden evidence values:

```txt
TBD
later
done
passed locally
N/A
```

## Exit gate

```txt
No ledger row, no migration.
```

## Failure modes

- Creating V2 files before the ledger row exists.
- Filling proof fields with vague values such as `TBD` or `later`.
- Declaring `public-client` without confirming export boundary.
- Marking a row `approved-for-migration` before rollback is known.
