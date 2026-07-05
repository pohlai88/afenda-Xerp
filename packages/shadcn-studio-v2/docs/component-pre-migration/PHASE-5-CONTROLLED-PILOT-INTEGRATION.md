# Phase 5 - Controlled Pilot Integration

## Phase metadata

| Field | Value |
| --- | --- |
| Document mode | migration |
| Audience | V2 migration engineers, reviewers, release-owners |
| Source of truth | `../COMPONENT-PRE-MIGRATION.md` |
| Input status | `migrated` |
| Output status | `pilot-proven` |
| Allowed authority | Verify one controlled consumer integration; do not approve production release. |
| Blocked-by conditions | Deep import, missing CSS proof, missing runtime proof, missing accessibility proof, missing visual proof, or missing rollback path. |

## Navigation

- Previous phase: [Phase 4 - V2 implementation and package proof](PHASE-4-V2-IMPLEMENTATION-PACKAGE-PROOF.md)
- Next phase: [Phase 6 - Enterprise acceptance](PHASE-6-ENTERPRISE-ACCEPTANCE.md)

## Purpose

Prove a migrated component works in one controlled consumer without approving a production-wide cutover.

This phase may move a component from `migrated` to `pilot-proven`.

## Scope

Allowed work:

- select one pilot consumer
- import only from approved V2 public surfaces
- verify runtime, CSS, accessibility, metadata, and visual behavior
- document rollback path

Forbidden work:

- broad search-and-replace consumer migration
- production-wide import switch
- deep imports from V2 internals
- deleting V1 source
- treating pilot proof as enterprise acceptance

## Approved public import surfaces

```txt
@afenda/shadcn-studio-v2
@afenda/shadcn-studio-v2/clients
@afenda/shadcn-studio-v2/server
@afenda/shadcn-studio-v2/metadata
```

CSS imports are allowed only through package-exported CSS entrypoints. Deep style imports are forbidden except package-exported CSS entrypoints declared in `package.json`.

## Procedure

1. Pick one pilot consumer route, page, fixture, or Storybook-integrated surface.
2. Import through approved public V2 surfaces only.
3. Verify CSS loading order.
4. Verify client/server runtime behavior.
5. Verify accessibility baseline.
6. Verify metadata safety or documented absence.
7. Verify visual behavior.
8. Confirm rollback to V1 is possible.
9. Record pilot evidence in `../MIGRATION-MAP.md`.

## Required evidence

Every field must cite a path, reviewer, owner, artifact, command, route, or explicit `none - reviewed`.

```md
- Pilot consumer:
- Pilot route/page/fixture:
- Public import path:
- CSS entrypoint order:
- Runtime proof:
- Accessibility proof:
- Metadata proof:
- Visual proof:
- Rollback path:
- Pilot result:
```

## Exit gate

```txt
Pilot proof may move status from migrated to pilot-proven.
```

## Failure modes

- Pilot imports from `components/*`, `views/*`, `contexts/*`, or internal metadata paths.
- Pilot succeeds only because it bypasses CSS entrypoint rules.
- Pilot verifies render only but skips accessibility and rollback.
- Pilot approval is mistaken for release approval.
