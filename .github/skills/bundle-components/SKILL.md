---
name: bundle-components
description: Consolidates authentication surfaces into a single canonical component under components-auth-shell, removes split helper drift, and enforces stable naming/import patterns to prevent repeat refactor churn. Use for prelogin/postlogin/authentication surface cleanup, component bundling, file relocation, and auth-shell normalization.
---

# Bundle Components

## Purpose

Use this skill when auth UI gets fragmented across multiple files/folders and starts causing repeated rename/import breakage.

This skill standardizes:

1. **Ownership**: Prelogin, postlogin, and authentication surfaces are final in `packages/shadcn-studio/src/components-auth-shell/`.
2. **Bundling**: Prefer a **single canonical component** per auth surface, with internal/private helpers colocated only when truly necessary.
3. **Stability**: One export path, one canonical name, no temporary shims unless explicitly requested.

## Trigger Keywords

- `bundle component`
- `consolidate auth`
- `prelogin`
- `postlogin`
- `auth shell`
- `single component`
- `flatten`
- `rename and move`
- `remove shim`
- `import drift`
- `debugging hell`

## When To Use

Use this skill when any of the following is true:

- A feature spans multiple files like `auth-route-tabs`, `panels`, `motion`, `drawer`, `logo` and the team wants one final surface.
- Component files live outside `components-auth-shell` but represent auth UX.
- Repeated path refactors keep breaking tests/stories/imports.
- There are aliases/shims kept only for backward compatibility, and the team wants a clean API.

## Non-Goals

- Do not re-theme or redesign UI unless requested.
- Do not migrate unrelated domains.
- Do not keep compatibility shims by default.

## Canonical Rules

1. **Auth final location**
	- Final implementation path: `packages/shadcn-studio/src/components-auth-shell/`.

2. **Single-surface rule**
	- The final user-facing auth experience should be exposed by one canonical component file.
	- If internal helpers are required, keep them private in the same file or clearly internal with no separate public surface.

3. **Export rule**
	- Export the canonical component from `packages/shadcn-studio/src/index.ts` once.
	- Remove stale aliases unless explicitly requested.

4. **Reference hygiene**
	- Update all consumers in one pass: app pages, stories, tests, and auth pages.
	- Remove obsolete files after imports are migrated.

5. **Naming normalization**
	- Use consistent auth-shell style names like `*V1`, `*-page-01`, `*-form-v1`, `*-bundle-01`.
	- Fix spelling in filenames immediately (for example `buldle` -> `bundle`).

## Required Workflow

1. **Audit references first**
	- Find all imports/usages before moving files.

2. **Move + rename atomically**
	- Move file to `components-auth-shell` and rename to canonical target in the same change set.

3. **Patch imports/exports/tests/stories**
	- Update all references in `src/index.ts`, app routes, storybook stories, and tests.

4. **Delete stale split files**
	- Remove fragmented helper files once the canonical component owns the experience.

5. **Validate immediately**
	- Run error checks on touched files and grep for stale paths/symbols.

## Commands / Checks

Use these checks after bundling/move:

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio build
pnpm check:downstream-integration
```

Targeted search checks:

- grep for old path/name leftovers
- verify only canonical export remains
- confirm no stale story/test imports

## Example Pattern

Given fragmented files:

- `auth-route-tabs.ts`
- `auth-route-tabs-panels.tsx`
- `auth-surface-motion.ts`
- `drawer-15.tsx`
- `logo.tsx`
- `prelogin-bundle.tsx`

Bundle into one canonical auth-shell file:

- `components-auth-shell/prelogin-bundle-01.tsx`

Then update:

- `src/index.ts` export
- consuming auth pages
- tests
- storybook stories

Finally delete fragmented files.

## Guardrails

- No duplicate component surfaces with different names.
- No dangling empty folders after flattening/moves.
- No partial refactors that leave old imports active.
- No placeholder skill docs; every rule must be explicit and executable.

## Common Failure Cases

Use this checklist before marking a bundling task complete.

1. **Filename typo drift (`buldle` vs `bundle`)**
	- Symptom: imports compile in some files but fail in others, or duplicate rename patches appear later.
	- Prevention: run one global search for both spellings right after move/rename.

2. **Shim/alias left behind by habit**
	- Symptom: old symbol still exported and silently used by app/test/story files.
	- Prevention: remove compatibility exports unless explicitly requested.

3. **Stale Storybook composition imports**
	- Symptom: story files still import removed helper files after single-file bundling.
	- Prevention: include `src/storybook/**` in the same migration pass.

4. **Test import path lag**
	- Symptom: tests compile against old path (`drawer-15`, split panels, etc.) and break after cleanup.
	- Prevention: include `src/__tests__/**` in reference audit and patch.

5. **Export path mismatch in barrel**
	- Symptom: component works locally via relative import but package consumer fails.
	- Prevention: patch `src/index.ts` in the same commit as the move.

6. **Empty folder residue after flattening**
	- Symptom: old structure still visible (`blocks/`, `drawer/`, `shared/`) causing confusion.
	- Prevention: delete empty directories and re-list folder tree as a final check.

7. **Half-bundled surface**
	- Symptom: one canonical component exists, but old helper files still imported in one route/story/test.
	- Prevention: require grep check for old filenames and symbols before closing.

8. **Mode/API drift during consolidation**
	- Symptom: merged component compiles, but behavior changed (drawer vs card mode).
	- Prevention: keep explicit public props (`mode`, trigger props) and validate both modes.

## Done Criteria

Mark complete only when all are true:

- One canonical auth component file exists in `components-auth-shell`.
- All consumers compile against the new path.
- Old files are removed.
- No stale references found by search.
- Touched files pass error checks.