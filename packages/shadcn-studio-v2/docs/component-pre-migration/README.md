# Component Pre-Migration Phase Index

Quality bar: `Enterprise 9.5`.

This directory expands the component pre-migration roadmap into executable phase guides. Each phase is a docs-as-code guardrail for moving components from `packages/shadcn-studio` to `packages/shadcn-studio-v2`.

Use these documents in order. Do not skip a phase because a component appears small or familiar.

## Master and phase authority

- `../COMPONENT-PRE-MIGRATION.md` owns vocabulary, lifecycle, status meanings, import policy, evidence policy, and cutover rules.
- Phase documents own operational procedure, required evidence, exit gates, and failure modes for one phase.
- If this index, a phase document, and the master guide conflict, stop at Phase 0 and update documentation before migration continues.
- Phase documents must not introduce new statuses, classifications, export intents, or proof rules without updating the master guide first.

## Operating rule

```txt
No ledger row, no migration.
No approved status, no implementation.
No migrated status, no pilot import.
No pilot proof, no enterprise acceptance.
No enterprise acceptance, no V1 retirement.
```

## Phase sequence

1. [Phase 0 - Documentation authority lock](PHASE-0-DOCUMENTATION-AUTHORITY-LOCK.md)
2. [Phase 1 - Component inventory and classification](PHASE-1-COMPONENT-INVENTORY-CLASSIFICATION.md)
3. [Phase 2 - Ledger registration](PHASE-2-LEDGER-REGISTRATION.md)
4. [Phase 3 - Readiness approval](PHASE-3-READINESS-APPROVAL.md)
5. [Phase 4 - V2 implementation and package proof](PHASE-4-V2-IMPLEMENTATION-PACKAGE-PROOF.md)
6. [Phase 5 - Controlled pilot integration](PHASE-5-CONTROLLED-PILOT-INTEGRATION.md)
7. [Phase 6 - Enterprise acceptance](PHASE-6-ENTERPRISE-ACCEPTANCE.md)
8. [Phase 7 - Release cutover and retirement review](PHASE-7-RELEASE-CUTOVER-RETIREMENT-REVIEW.md)

## Phase transition table

| Phase | Input status | Output status |
| --- | --- | --- |
| Phase 0 | none | no component status change |
| Phase 1 | no classified candidate | candidate identified/classified |
| Phase 2 | candidate identified/classified | `pending` |
| Phase 3 | `pending` | `approved-for-migration` |
| Phase 4 | `approved-for-migration` | `migrated` |
| Phase 5 | `migrated` | `pilot-proven` |
| Phase 6 | `pilot-proven` | `enterprise-accepted` |
| Phase 7 | `enterprise-accepted` | `retirement-candidate` |

## Phase metadata standard

Every phase document must contain this metadata block near the top:

```md
## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | migration |
| Audience | V2 migration engineers, reviewers, release-owners |
| Source of truth | COMPONENT-PRE-MIGRATION.md |
| Input status | <status entering phase> |
| Output status | <status leaving phase> |
| Allowed authority | <what the phase may decide> |
| Blocked-by conditions | <conditions that stop the phase> |
```

## Evidence value rules

Every evidence field must cite one of these:

- command
- file path
- reviewer
- owner
- route
- artifact
- explicit `none - reviewed`

Forbidden evidence values:

```txt
TBD
later
done
passed locally
N/A
```

Use `none - reviewed` only when absence of a dependency, proof target, or impact has been reviewed.

## Vocabulary lock

Controlled statuses:

```txt
pending
approved-for-migration
migrated
pilot-proven
enterprise-accepted
retirement-candidate
```

The complete master status vocabulary also includes `quarantined`, `replaced`, `retired`, and `blocked`.

## Quality-control rules

- Link integrity: this index must link every phase file.
- Required files: all eight phase documents must exist.
- Required headings: every phase document must contain `Purpose`, `Scope`, `Procedure`, `Required evidence`, `Exit gate`, and `Failure modes`.
- Metadata consistency: every phase document must contain `Document mode`, `Audience`, `Source of truth`, `Input status`, `Output status`, `Allowed authority`, and `Blocked-by conditions`.
- Status consistency: phase input/output statuses must match the phase transition table.
- Conflict rule: if any phase contradicts the master guide, Phase 0 blocks migration until the documentation is corrected.

## Phase handoff rule

Each phase must produce concrete evidence before the next phase starts.

Acceptable evidence includes:

- updated `MIGRATION-MAP.md` row
- documented classification
- proof command and result
- Storybook or visual proof target
- pilot consumer path
- rollback note
- release-owner approval record

Do not use verbal approval as phase evidence.

## Related documents

- [Component pre-migration guide](../COMPONENT-PRE-MIGRATION.md)
- [Migration map](../MIGRATION-MAP.md)
- [Taxonomy](../TAXONOMY.md)
- [Roadmap](../ROADMAP.md)
- [Legacy retirement plan](../LEGACY-RETIREMENT-PLAN.md)
