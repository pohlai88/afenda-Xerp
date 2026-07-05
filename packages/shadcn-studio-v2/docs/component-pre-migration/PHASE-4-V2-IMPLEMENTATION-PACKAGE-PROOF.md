# Phase 4 - V2 Implementation and Package Proof

## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | migration |
| Audience | V2 migration engineers, reviewers, release-owners |
| Source of truth | `../COMPONENT-PRE-MIGRATION.md` |
| Input status | `approved-for-migration` |
| Output status | `migrated` |
| Allowed authority | Implement approved V2 component and prove package-local gates. |
| Blocked-by conditions | Failed V2 package gate, forbidden import, export drift, taxonomy drift, or API strategy mismatch. |

## Navigation

- Previous phase: [Phase 3 - Readiness approval](PHASE-3-READINESS-APPROVAL.md)
- Next phase: [Phase 5 - Controlled pilot integration](PHASE-5-CONTROLLED-PILOT-INTEGRATION.md)

## Purpose

Implement the approved component in V2 and prove the package-local boundary holds.

This phase may move a component from `approved-for-migration` to `migrated`.

## Scope

Allowed work:

- implement only in the approved V2 destination
- update intentional public exports according to export intent
- add or update package-local tests
- update package-local documentation evidence

Forbidden work:

- changing V1 source
- importing from `_reference/CreateEditorialLayout`
- importing from `packages/shadcn-studio/src`
- importing from `@afenda/shadcn-studio`
- switching ERP or production consumers
- treating package-local success as enterprise acceptance

## Procedure

1. Implement only in the approved destination recorded in `../MIGRATION-MAP.md`.
2. Preserve or change API only according to the declared API strategy.
3. Keep CSS, runtime, metadata, and export boundaries aligned to `../COMPONENT-PRE-MIGRATION.md`.
4. Add package-local proof tests or update existing tests.
5. Run package-local proof commands.
6. Record command evidence in `../MIGRATION-MAP.md`.
7. Move status to `migrated` only after package-local proof passes.

## Required evidence

Every field must cite a path, reviewer, owner, artifact, command, route, or explicit `none - reviewed`.

```md
- Implemented destination:
- Export surface changed:
- API strategy honored:
- CSS/token proof:
- Runtime boundary proof:
- Metadata safety proof:
- Forbidden import proof:
- Test command:
- Typecheck command:
- Build command:
- Biome command:
- Result:
```

## Exit gate

```txt
Package-local proof may move status from approved-for-migration to migrated.
```

## Failure modes

- Updating consumers before the component is `migrated`.
- Adding public exports because a file exists.
- Smuggling client-only runtime through neutral or server exports.
- Passing tests while leaving visual or accessibility proof undefined.
