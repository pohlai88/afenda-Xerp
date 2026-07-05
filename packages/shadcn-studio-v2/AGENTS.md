# shadcn-studio-v2 Local Agent Contract

This file governs work inside `packages/shadcn-studio-v2` only.

## Purpose

Use this package as the clean V2 target for structure, naming, and export-boundary discipline.

This file exists to keep V2 local decisions tight, explicit, and separate from:

- the legacy `packages/shadcn-studio` package
- generic monorepo habits
- copied reference-app folder naming

## Scope

This contract applies to:

- `src/`
- `docs/`
- `package.json`
- `tsconfig*.json`
- `vitest.config.ts`

This contract does not govern:

- `packages/shadcn-studio`
- ERP app runtime code outside this package
- `_reference/` source material except as reference evidence

## Local Authority Order

When working in this package, follow authority in this order:

1. `docs/TAXONOMY.md`
2. this `AGENTS.md`
3. repo-root `AGENTS.md`
4. active repo rules under `.cursor/rules/`
5. active repo skills under `.cursor/skills/`

If a lower source conflicts with `docs/TAXONOMY.md`, `docs/TAXONOMY.md` wins for V2 structure.

Use these local package documents together:

- `docs/TAXONOMY.md` for structure and naming authority
- `docs/ROADMAP.md` for slice sequencing and gates
- `docs/MIGRATION-MAP.md` for legacy-to-V2 translation tracking

## Structural Law

V2 uses a closed taxonomy.

Only registered structural names may be used for:

- top-level `src/` folders
- registered lower-level taxonomy folders
- canonical package file stems
- architectural groupings

If a structural name is not registered in `docs/TAXONOMY.md`, it is not valid for V2.

Do not introduce structure first and document it later.

## Test Convention Boundary

The repo-wide Vitest convention may place tests under:

- `src/**/__tests__/**`

Within V2, `__tests__` is a shared test harness convention, not an architectural taxonomy segment.

Do not treat `__tests__` as a package structure category.

## Naming Law

Use the V2 naming model exactly:

- folders: lowercase nouns
- canonical non-React package files: `kebab-case`
- React component and context files: `PascalCase.tsx`
- hooks: `use-*.ts` or `use-*.tsx`

Canonical example:

- `configs/theme-config.ts`

Rejected example:

- `configs/themeConfig.ts`

## Root Export Boundary

Only these root public export files are valid under `src/`:

- `index.ts`
- `clients.ts`
- `server.ts`
- `metadata.ts`

These are public API boundary files, not casual implementation files.

Do not add more root export files unless `docs/TAXONOMY.md` is amended first.

## Migration Discipline

V2 adopts the reference philosophy and does not copy the reference app tree literally.

Required behavior:

- translate legacy names into V2 taxonomy
- translate reference-app concepts into V2 taxonomy
- keep metadata as a package-local concern

Prohibited behavior:

- preserving legacy prefixed folder systems by habit
- introducing unregistered structural convenience names
- copying reference-app folder names directly into V2 without translation

## Legacy Naming Prohibition

Do not introduce or restore names such as:

- `components-ui`
- `components-layouts`
- `components-auth-shell`
- `theme-runtime`
- `theme-config` as a folder
- `meta-contracts`
- `meta-registry`
- `meta-gates`
- `blocks`
- `sections`
- `modules`
- `features`
- `domains`
- `shells`
- top-level `layouts`

These are taxonomy violations unless the V2 taxonomy document is explicitly amended.

## Verification Gate

The package taxonomy gate is:

```bash
pnpm --filter @afenda/shadcn-studio-v2 test:taxonomy
```

Use it to verify:

- registered top-level structure
- forbidden-name absence
- naming-law compliance
- root export file presence
- structural snapshot drift

## Editing Rule

When making V2 structural decisions:

- change the taxonomy authority first or change it in the same slice
- do not create undocumented structure
- do not clean up unrelated legacy package areas as part of V2 work

Keep V2 narrow, explicit, and migration-safe.

## Roadmap Discipline

V2 follows the ordered slice model in `docs/ROADMAP.md`.

Hard rule:

- do not start a later roadmap slice while an earlier structural prerequisite is unresolved

Migration tracking must stay current in `docs/MIGRATION-MAP.md` once Slice 8 begins.
