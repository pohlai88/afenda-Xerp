# DSS-3 — Primitive Component Completeness

## Slice metadata

| Field | Value |
| --- | --- |
| Slice ID | `DSS-3` |
| Name | Primitive component completeness |
| Primary owner | V2 primitive maintainer |
| Claim target | `component-ready` for each primitive |
| Depends on | `DSS-1`, `DSS-2`, `COMPONENT-PRE-MIGRATION.md` |
| Output status | reusable primitives pass completeness gate |

## Purpose

Bring every reusable primitive to the same enterprise quality bar so future views do not compensate for missing primitive behavior.

This slice is where default, hover, focus-visible, disabled, loading, empty, error, and named-theme behavior becomes proof rather than intention.

## In scope

- `components/ui/Alert.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/Field.tsx`
- `components/ui/Table.tsx`
- Primitive tests and stories where required.

## Out of scope

- Page-shaped surfaces.
- ERP business behavior.
- Domain-specific variants.
- New primitives not registered in `TAXONOMY.md`.
- Reference JSX or CSS.

## Required inputs

- `docs/TAXONOMY.md`
- `docs/DESIGN-SYSTEM-GUIDELINE.md`
- `docs/COMPONENT-PRE-MIGRATION.md`
- Current primitive source files and primitive tests.

## Implementation tasks

1. Confirm every primitive belongs in `components/ui`.
2. Confirm typed props and stable public API intent.
3. Confirm semantic variants only.
4. Confirm accessible names, roles, labels, and focus-visible behavior where applicable.
5. Confirm disabled and loading states for action primitives.
6. Confirm empty, error, invalid, or unavailable states for data/form primitives where applicable.
7. Confirm no hardcoded hex, no reference CSS, and no app-specific behavior.
8. Add or update tests/stories for missing proof.

## Evidence required

- Primitive-by-primitive checklist.
- Test or story target for each public primitive.
- Public export proof when a primitive is exported.
- `check:drift` proof for no tokens, hardcoded hex, or forbidden imports.

## Acceptance gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

## Failure modes

- Treating a screenshot as state proof.
- Adding local visual variants to satisfy one consumer.
- Exporting a primitive before prop API review.
- Moving composed view behavior into a primitive.
- Skipping keyboard and focus proof.

## Completion handoff

Record:

- Primitive list:
- API changes:
- State proof:
- Accessibility proof:
- Story/test proof:
- Export proof:
- Commands run:
- Claim level reached:
- Remaining blockers:
