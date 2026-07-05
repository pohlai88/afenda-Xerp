# shadcn-studio-v2 Taxonomy

## Purpose

This document is the structural authority for `packages/shadcn-studio-v2`.

It is written for maintainers who need to:

- understand the V2 package structure
- place new files in the correct structural location
- translate legacy `shadcn-studio` concepts into V2
- prevent taxonomy drift during migration

This is an internal architecture and maintenance guide. It is not an ADR, a migration checklist, or a full runtime contract, although it does define package structure and public export boundaries.

Use this document with:

- `ROADMAP.md` for slice order and gate sequencing
- `MIGRATION-MAP.md` for legacy translation tracking

## Adoption Principle

`shadcn-studio-v2` adopts the naming philosophy of the AdminCN reference and does not copy the reference app tree literally.

Adoption means:

- use simple noun folders
- use one clear naming axis per folder layer
- keep structural names explicit and stable
- translate reference concepts into package-local structure

Copying is not allowed:

- do not mirror app-only folders just because they exist in the reference
- do not import reference-project structural names directly into V2 without translation
- do not preserve legacy prefixed folder systems when a simpler structural noun already exists

## Closed Taxonomy Rule

The V2 taxonomy is closed and level-based.

Only the names listed in this document are valid structural names. Anything else requires amending `TAXONOMY.md` first.

Use this rule as the hard gate:

```txt
If a folder, subfolder, or canonical file name is not listed in this taxonomy, it does not exist for V2.
```

A path is valid only if every structural segment in that path is registered here.

Examples:

- `src/views/auth/LoginView.tsx` is valid because `views` and `auth` are registered structural segments, and `LoginView.tsx` is an implementation file inside an approved folder.
- `src/blocks/auth/LoginBlock.tsx` is invalid because `blocks` is not a registered structural segment.
- `src/features/auth/LoginView.tsx` is invalid because `features` is not a registered structural segment.
- `src/theme-runtime/ThemeProvider.tsx` is invalid because `theme-runtime` is not a registered structural segment.

Implementation files may use descriptive names only inside approved taxonomy folders.

Global repo test convention may still use `src/**/__tests__/**`. That path is a test harness convention, not a V2 taxonomy segment.

## Level 1 Taxonomy

Only these folders and root files are allowed directly under `src/`.

```txt
src/
  assets/
  components/
  configs/
  contexts/
  hooks/
  lib/
  metadata/
  storybook/
  styles/
  types/
  utils/
  views/

  clients.ts
  index.ts
  metadata.ts
  server.ts
```

No additional top-level structural names are valid unless this document is amended first.

## Level 1 Root File Authority

Root public export files are API boundary files. They are not casual implementation files.

Approved root files:

- `index.ts`
- `clients.ts`
- `server.ts`
- `metadata.ts`

Role definitions:

`index.ts`

- neutral public export surface
- may export shared, environment-neutral APIs only
- must not export server-only logic
- must not export browser-only runtime providers unless they are intentionally safe for the default package surface

`clients.ts`

- client-safe public export surface
- may export client components, client providers, hooks, and browser-safe runtime utilities
- must not export server-only helpers

`server.ts`

- server-only public export surface
- may export SSR helpers, server config access, server metadata builders, and server-safe utilities
- must not export client providers, browser runtime code, or React components that require client execution

`metadata.ts`

- metadata-specific public export surface
- may export metadata contracts, registries, gates, and builders
- must not become a general package export dump

No additional root public export files are valid unless this document is amended first.

## Level 1 Folder Roles

`assets`

- package-level icons, vectors, and brand graphics

`components`

- primitives, layout chrome, and shared reusable React parts

`configs`

- static configuration, defaults, presets, and package-level option sources

`contexts`

- React context providers and runtime state boundaries

`hooks`

- React hooks only

`lib`

- package-internal implementation helpers
- must not become a dumping ground for domain logic

`metadata`

- metadata-specific package concerns

`storybook`

- verification-only Storybook code

`styles`

- CSS only

`types`

- package-wide TypeScript type shapes

`utils`

- reusable domain-neutral utilities that may be shared across multiple package areas

`views`

- composed presentation surfaces

## Naming Conventions

Structural naming is locked to the following rules:

- folders use lowercase nouns
- structural non-React canonical package files use `kebab-case.ts`
- approved root public export files may use stable noun filenames:
  - `index.ts`
  - `server.ts`
  - `clients.ts`
  - `metadata.ts`
- React context and component files use `PascalCase.tsx`
- hook files use `use-*.ts` or `use-*.tsx`

Canonical examples:

```txt
configs/theme-config.ts
configs/studio-config.ts
```

Rejected examples:

```txt
themeConfig.ts
studioConfig.ts
```

Canonical structural file stems must stay stable once introduced. Convenience renaming is not allowed.

## Registered Taxonomy Authority

Only registered taxonomy terms may be used for:

- structural folder names
- architectural groupings
- canonical package file stems

Registered taxonomy terms are valid only when they appear in one of these places:

- the Level 1 taxonomy
- approved Level 2 taxonomy
- approved Level 3 taxonomy
- canonical naming examples in this document
- migration mapping in this document
- a later amendment to this document

This rule applies to:

- top-level folders
- second-level taxonomy folders
- deeper registered structural folders
- architecture groupings
- config file stems
- metadata file stems
- component category folders
- view category folders

This rule does not apply to:

- individual React component names
- Storybook story titles
- test names
- local implementation variables

Reference-project names are not automatically valid in V2. They must be translated into the V2 taxonomy before use.

## Level 2 Taxonomy

### `assets/`

```txt
assets/
  brand/
  icons/
  vectors/
```

`brand`

- Afenda and studio brand graphics

`icons`

- package-level icons

`vectors`

- static vector assets

### `components/`

```txt
components/
  assets/
  layout/
  quarantine/
  shared/
  ui/
```

`assets`

- component-coupled assets

`layout`

- shell, chrome, and layout React parts

`quarantine`

- imported or unstable parts under review

`shared`

- reusable non-primitive React parts

`ui`

- primitives and near-primitives

### `configs/`

```txt
configs/
  studio-config.ts
  theme-config.ts
```

`theme-config.ts`

- canonical theme configuration

`studio-config.ts`

- package-level studio defaults

Only these two canonical config stems are registered initially. Add more only by amending this document first.

### `contexts/`

```txt
contexts/
  StudioProvider.tsx
  ThemeProvider.tsx
```

`ThemeProvider.tsx`

- theme runtime boundary provider

`StudioProvider.tsx`

- studio-level runtime provider

Keep this folder for React context boundaries only.

### `hooks/`

```txt
hooks/
  use-studio.ts
  use-theme.ts
```

`use-theme.ts`

- theme access hook

`use-studio.ts`

- studio runtime access hook

### `lib/`

```txt
lib/
  cn.ts
```

`cn.ts`

- class-name merge helper

Keep `lib` extremely small.

### `metadata/`

```txt
metadata/
  builders/
  contracts/
  gates/
  registries/
```

`builders`

- metadata construction logic

`contracts`

- metadata-specific contracts

`gates`

- metadata validation and enforcement

`registries`

- metadata inventories

### `storybook/`

```txt
storybook/
  fixtures/
  stories/
```

`fixtures`

- Storybook-only sample data

`stories`

- Storybook-only stories

No runtime source should depend on `storybook`.

### `styles/`

```txt
styles/
  shadcn-default.css
  swiss-noir.css
  verdant-noir.css
```

`shadcn-default.css`

- canonical default token layer

`swiss-noir.css`

- Swiss Noir scoped theme

`verdant-noir.css`

- Verdant Noir scoped theme

CSS only. No TS. No React.

### `types/`

```txt
types/
  studio.ts
  theme.ts
```

`studio.ts`

- package-wide studio type shapes

`theme.ts`

- package-wide theme type shapes

Metadata-specific contracts stay under `metadata/contracts`.

### `utils/`

```txt
utils/
  format.ts
  invariant.ts
```

`format.ts`

- small domain-neutral formatting helpers

`invariant.ts`

- assertion helper

Use `utils` only for reusable, domain-neutral helpers.

### `views/`

```txt
views/
  auth/
  dashboards/
  datatables/
  dialogs/
  forms/
  pages/
  settings/
  widgets/
```

The composition layer is `views`.

Composition philosophy:

```txt
primitive -> multiple primitives -> composed view unit -> multiple view units -> final ERP consumer
```

`block` remains a classification concept, not a required folder name.

Approved `views` folders:

`auth`

- authentication presentation surfaces

`dashboards`

- dashboard composition surfaces

`datatables`

- table-heavy composition surfaces

`dialogs`

- composed dialog surfaces

`forms`

- composed form surfaces

`pages`

- full-page presentation surfaces

`settings`

- settings presentation surfaces

`widgets`

- compact composed view units

These names are registered taxonomy terms for future `views/` folders. They are approved but not mandatory immediate folder creation.

## Level 3 Taxonomy

Only these deeper structural names are registered initially.

### `metadata/builders/`

```txt
metadata/builders/
  metadata-builder.ts
```

### `metadata/contracts/`

```txt
metadata/contracts/
  gate-contract.ts
  metadata-contract.ts
  registry-contract.ts
```

### `metadata/gates/`

```txt
metadata/gates/
  metadata-gate.ts
```

### `metadata/registries/`

```txt
metadata/registries/
  metadata-registry.ts
```

### `components/ui/`

Approved primitive component files:

```txt
components/ui/
  Alert.tsx
  Badge.tsx
  Button.tsx
  Card.tsx
  Field.tsx
  Table.tsx
```

Add new primitive components only when they are reusable and governed.

### `components/layout/`

```txt
components/layout/
  AppShell.tsx
  Sidebar.tsx
  Topbar.tsx
```

Use this only for reusable chrome. If it becomes a composed page-like surface, move it to `views`.

### `components/shared/`

```txt
components/shared/
  ThemeScript.tsx
  ThemeToggle.tsx
```

### `components/assets/`

```txt
components/assets/
  IconMark.tsx
```

### `components/quarantine/`

```txt
components/quarantine/
  README.md
```

Everything here is temporary. Nothing here is considered stable public structure.

### `views/auth/`

```txt
views/auth/
  AuthShellView.tsx
  LoginView.tsx
```

This is the correct destination for old `components-auth-shell`.

### `views/pages/`

```txt
views/pages/
  StudioIndexView.tsx
```

### `views/widgets/`

```txt
views/widgets/
  EvidenceWidget.tsx
```

## Migration Mapping From Current Studio

Current `packages/shadcn-studio/src` structure must translate into V2 as follows:

- `components-ui -> components/ui`
- `components-assets -> assets` or `components/assets` depending on asset role
- `components-quarantine -> components/quarantine`
- `components-app-shell -> components/layout` or `views/*` when the unit is composed
- `components-auth-shell -> views/auth`
- `components-layouts -> views/*`
- `theme-config -> configs`
- `theme-runtime -> contexts`
- `meta-contracts -> metadata/contracts`
- `meta-registry -> metadata/registries`
- `meta-gates -> metadata/gates`

Migration must translate names into this taxonomy. It must not preserve legacy names by default.

## Forbidden Legacy Naming

The following structural names are explicitly prohibited:

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

These names are prohibited because they are one of the following:

- legacy prefixed structures
- copied concepts that bypass the V2 taxonomy
- unregistered convenience names
- parallel naming systems that reintroduce drift

## Decision Rules For Future Additions

- if it renders UI, it belongs in `components` or `views`
- if it is static config, it belongs in `configs`
- if it is metadata-specific classification or gate logic, it belongs under `metadata`
- if it is tiny generic logic, it belongs in `lib`
- only registered taxonomy names may be used for structural folders, architectural groupings, and canonical package files
- implementation files may use descriptive names only inside approved taxonomy folders
- reference-project names must be translated into V2 taxonomy before use
- do not create new top-level domain folders unless this taxonomy document is amended first

The taxonomy governs structure. It does not require every ordinary implementation filename to be registered here.

## Relationship To Migration

This document defines where V2 structure is allowed to exist.

`ROADMAP.md` defines when each structural lane should be implemented.

`MIGRATION-MAP.md` defines how legacy `packages/shadcn-studio` areas translate into this taxonomy.

## Enforcement

`TAXONOMY.md` defines the structural law for V2. Vitest enforces that law.

The package taxonomy gate lives in:

```txt
src/__tests__/taxonomy.test.ts
```

Its job is to enforce:

- registered top-level `src/` names
- forbidden legacy structural names
- registered second-level structural folders
- canonical hook and config naming rules
- approved root export file presence
- snapshot visibility for structural drift

This package should prefer Vitest governance tests over custom drift scripts for taxonomy enforcement.

`__tests__` is excluded from structural taxonomy enforcement because it follows the repo-wide Vitest convention and does not define package architecture.
