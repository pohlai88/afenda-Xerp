# DSS-6 — Forms, Dialogs, Settings, and Auth Presentation

## Slice metadata

| Field | Value |
| --- | --- |
| Slice ID | `DSS-6` |
| Name | Forms, dialogs, settings, and auth presentation |
| Primary owner | V2 workflow-surface maintainer |
| Claim target | `component-ready` for reusable workflow surfaces |
| Depends on | `DSS-3`, `DSS-4`, `COMPONENT-PRE-MIGRATION.md` |
| Output status | workflow-shaped surfaces are presentational and accessible |

## Purpose

Implement high-friction ERP workflow surfaces with production-grade labels, validation, focus management, destructive-action safety, grouped settings, and visual-only auth presentation.

This slice prevents form/dialog/settings/auth work from becoming local app policy.

## In scope

- `views/forms/*` after taxonomy-confirmed implementation need.
- `views/dialogs/*` after taxonomy-confirmed implementation need.
- `views/settings/*` after taxonomy-confirmed implementation need.
- `views/auth/*`
- Supporting primitives when they block accessibility or state completeness.

## Out of scope

- Authentication authority.
- Permission policy.
- Settings persistence.
- Validation schemas owned by app/domain packages.
- New token families for settings or auth surfaces.

## Required inputs

- `docs/TAXONOMY.md`
- `docs/DESIGN-SYSTEM-GUIDELINE.md`
- `docs/COMPONENT-PRE-MIGRATION.md`
- Existing auth/form/dialog/settings candidates in `MIGRATION-MAP.md` when migrating from V1.

## Implementation tasks

1. Confirm the destination folder is registered before adding a workflow surface.
2. Confirm labels are visible for form controls.
3. Confirm validation, invalid, disabled, loading, and error states are represented.
4. Confirm dialog focus management, escape route, and destructive confirmation behavior.
5. Confirm settings surfaces group state without owning persistence.
6. Confirm auth surfaces remain presentation only.
7. Confirm public export intent before consumer use.

## Evidence required

- Form accessibility proof.
- Dialog focus/escape proof.
- Settings grouping proof.
- Auth presentation boundary proof.
- No app policy, auth authority, permission constant, or persistence logic in V2.

## Acceptance gates

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

## Failure modes

- Auth view imports auth/session runtime.
- Dialog closes without accessible escape/focus behavior.
- Form validation text is not associated with fields.
- Settings view stores state or writes persistence.
- A consumer deep-imports a workflow surface.

## Completion handoff

Record:

- Workflow surfaces reviewed:
- Taxonomy destinations:
- Accessibility proof:
- Runtime authority boundary:
- Export proof:
- Story/test proof:
- Commands run:
- Claim level reached:
- Remaining blockers:
