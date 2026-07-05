# Phase 0 - Documentation Authority Lock

## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | migration |
| Audience | V2 migration engineers, reviewers, release-owners |
| Source of truth | `../COMPONENT-PRE-MIGRATION.md` |
| Input status | none |
| Output status | no component status change |
| Allowed authority | Confirm documentation authority alignment only. |
| Blocked-by conditions | Conflicting source-of-truth docs, stale reference-pack boundary, or unclear retirement authority. |

## Navigation

- Previous phase: none
- Next phase: [Phase 1 - Component inventory and classification](PHASE-1-COMPONENT-INVENTORY-CLASSIFICATION.md)

## Purpose

Confirm the migration authority chain is current, linked, and non-conflicting before any component inventory or movement begins.

This phase prevents a component migration from using stale roadmap, taxonomy, reference-pack, or retirement assumptions.

## Scope

Allowed work:

- read and compare V2 migration documents
- identify conflicts between roadmap, taxonomy, migration map, and reference guidance
- update documentation links if a source of truth moved

Forbidden work:

- moving component code
- changing V1 source
- switching consumers to V2
- treating reference-pack material as runtime source

## Procedure

1. Confirm `../ROADMAP.md` still defines shadow migration and does not authorize production cutover.
2. Confirm `../TAXONOMY.md` lists every destination needed by the candidate type.
3. Confirm `../MIGRATION-MAP.md` contains the legacy lane and component ledger vocabulary.
4. Confirm `../COMPONENT-PRE-MIGRATION.md` is the readiness and vocabulary authority.
5. Confirm `../LEGACY-RETIREMENT-PLAN.md` keeps deletion as a release-owner decision.
6. Confirm `_reference/CreateEditorialLayout` remains evidence-only.
7. Record conflicts before any candidate enters Phase 1.

## Required evidence

Every field must cite a path, reviewer, owner, artifact, command, route, or explicit `none - reviewed`.

```md
- Roadmap checked:
- Taxonomy checked:
- Migration map checked:
- Pre-migration guide checked:
- Retirement plan checked:
- Reference-pack boundary checked:
- Conflicts found:
- Conflicts resolved:
```

## Current evaluation

Reviewed on `2026-07-05` for `@afenda/shadcn-studio-v2` pre-migration readiness.

- Roadmap checked: `docs/ROADMAP.md` confirms V2 remains shadow-first and keeps `packages/shadcn-studio` as the active production package.
- Taxonomy checked: `docs/TAXONOMY.md` registers the current V2 destinations required by the package scaffold and component migration model.
- Migration map checked: `docs/MIGRATION-MAP.md` contains the legacy lane translation table and the component-ledger vocabulary required before movement.
- Pre-migration guide checked: `docs/COMPONENT-PRE-MIGRATION.md` remains the master authority for migration readiness, status vocabulary, export policy, and cutover rules.
- Retirement plan checked: `docs/LEGACY-RETIREMENT-PLAN.md` keeps deletion as a separate release-owner decision and does not authorize destructive legacy cleanup.
- Reference-pack boundary checked: `_reference/CreateEditorialLayout/reference/00-reference-sequence.md` through `_reference/CreateEditorialLayout/reference/12-studio-promotion-handoff-checklist.md` exist and remain evidence-only inputs, not runtime source.
- Conflicts found: `none - reviewed`
- Conflicts resolved: `none - reviewed`

Phase 0 verdict: the migration authority chain is current, linked, and non-conflicting for package-local pre-migration work.

## Exit gate

```txt
The migration authority chain is current, linked, and non-conflicting.
```

If this gate fails, stop. Do not classify or migrate components from stale authority.

## Failure modes

- `../MIGRATION-MAP.md` says a lane is migrated while `../TAXONOMY.md` lacks a legal destination.
- Reference-pack examples are treated as component source.
- Slice proof is treated as production cutover approval.
- V1 retirement is inferred from V2 package-local tests.
