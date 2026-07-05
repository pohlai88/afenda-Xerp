# Phase 1 - Component Inventory and Classification

## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | migration |
| Audience | V2 migration engineers, reviewers, release-owners |
| Source of truth | `../COMPONENT-PRE-MIGRATION.md` |
| Input status | no classified candidate |
| Output status | candidate identified/classified |
| Allowed authority | Identify candidates and classify shape; do not approve implementation. |
| Blocked-by conditions | Unknown component purpose, illegal destination, missing taxonomy entry, or reference-only source without registry classification. |

## Navigation

- Previous phase: [Phase 0 - Documentation authority lock](PHASE-0-DOCUMENTATION-AUTHORITY-LOCK.md)
- Next phase: [Phase 2 - Ledger registration](PHASE-2-LEDGER-REGISTRATION.md)

## Purpose

Create a component inventory and classify each candidate before selecting a V2 destination.

This phase prevents legacy folder names from becoming V2 architecture.

## Scope

Allowed work:

- list candidate V1 paths
- describe component purpose
- classify candidate shape
- identify unknowns and blockers

Forbidden work:

- creating V2 component files
- exporting candidates
- importing candidates into consumers
- using V1 folder names as destination proof

## Procedure

1. List the V1 path exactly as it exists.
2. State the user-facing or package-facing purpose.
3. Determine whether the unit renders UI.
4. Apply the decision tree in `../COMPONENT-PRE-MIGRATION.md`.
5. Choose one classification from the master vocabulary.
6. Choose a candidate V2 destination only if `../TAXONOMY.md` permits it.
7. Record uncertainty as `blocked` or `quarantine`; do not guess.

## Required evidence

Every field must cite a path, reviewer, owner, artifact, command, route, or explicit `none - reviewed`.

```md
- V1 path:
- V1 purpose:
- Renders UI:
- Classification:
- Candidate V2 destination:
- Destination exists in TAXONOMY.md:
- Reason legacy folder name was not used as authority:
- Blockers:
```

## Exit gate

```txt
No unclassified component may proceed to ledger approval.
```

## Failure modes

- `components-auth-shell` becomes `components/ui/AuthShell.tsx`.
- `components-layouts` becomes `components/layout` without checking whether it is page-shaped.
- `components-ui` is accepted as primitive without reviewing actual behavior.
- A reference-derived idea bypasses the traceability registry.
