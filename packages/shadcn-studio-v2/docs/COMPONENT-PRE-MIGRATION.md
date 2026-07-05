# shadcn Studio V2 Component Pre-Migration Guide

## Purpose

This guide defines the prerequisite gate for moving components from
`packages/shadcn-studio` into `packages/shadcn-studio-v2`.

It is written for engineers migrating components, reviewers approving movement,
and release owners approving consumer cutover. It is not an implementation slice,
not a deletion plan, and not permission to switch production consumers.

Core rule:

```txt
No V1 component migrates because it exists.
A V1 component migrates only after destination, API boundary, styling authority, metadata role, and proof gate are known.
```

## Authority model

Use this operating model for every component migration decision:

```txt
TAXONOMY.md decides legal destinations.
ROADMAP.md decides legal timing.
COMPONENT-PRE-MIGRATION.md decides legal readiness.
MIGRATION-MAP.md records legal movement.
Vitest proves the movement stayed legal.
check:drift proves the design-system rulebook stayed executable.
```

The component migration path is ledger-first and proof-first:

```txt
No ledger row, no migration.
No approved status, no implementation.
No migrated status, no pilot import.
No pilot proof, no enterprise acceptance.
No enterprise acceptance, no V1 retirement.
```

## Master and phase authority

`COMPONENT-PRE-MIGRATION.md` is the master authority for component migration
vocabulary, lifecycle, status meanings, import policy, evidence policy, and
cutover rules.

`component-pre-migration/` contains the operational phase guardrails. Phase
documents own procedure, required evidence, exit gates, and failure modes for
their individual phase.

If the master guide, phase index, or a phase document conflict:

```txt
Stop at Phase 0.
Update the documentation authority chain.
Do not classify, implement, pilot, accept, cut over, or retire the component.
```

Every phase document must declare:

- `Document mode`
- `Audience`
- `Source of truth`
- `Input status`
- `Output status`
- `Allowed authority`
- `Blocked-by conditions`

The phase documents are required guardrails, not optional references.

## Non-goals

- Do not delete V1 source files.
- Do not switch ERP or production consumers to V2.
- Do not copy JSX, CSS, tokens, or folder names from reference material.
- Do not create new V2 taxonomy folders.
- Do not promote quarantine code to public API.
- Do not treat migrated package-local evidence as release-owner cutover approval.

## Pre-migration prerequisite roadmap

Use this roadmap before the first V1 component migration candidate enters V2.

The roadmap is intentionally broader than component copying. It covers the
full-stack readiness path from documentation authority through package boundary,
consumer integration, visual proof, rollback, and release control.

Detailed phase guardrails live in
[`component-pre-migration/`](component-pre-migration/README.md). The sections
below summarize the sequence; the individual phase documents are the operating
checklists.

### Phase 0 — Documentation authority lock

Purpose: confirm the documents that control migration decisions are current and
non-conflicting.

Required inputs:

- `ROADMAP.md`
- `TAXONOMY.md`
- `MIGRATION-MAP.md`
- `COMPONENT-PRE-MIGRATION.md`
- `LEGACY-RETIREMENT-PLAN.md`
- `_reference/CreateEditorialLayout/reference/*`

Completion requirements:

- `ROADMAP.md` confirms V2 remains shadow-first.
- `TAXONOMY.md` lists the intended V2 destination.
- `MIGRATION-MAP.md` has the legacy lane and component ledger row.
- `COMPONENT-PRE-MIGRATION.md` governs readiness before movement.
- Reference-pack material is treated as evidence only.
- No document authorizes V1 deletion or production cutover.

Exit gate:

```txt
The migration authority chain is current, linked, and non-conflicting.
```

### Phase 1 — Component inventory and classification

Purpose: identify candidates without letting V1 folder names decide V2 structure.

Required activity:

- list the V1 component path
- describe the V1 purpose
- classify the component
- identify whether it is primitive, layout, shared, asset, view, quarantine,
  reference-only, replaced, or retired
- reject automatic folder-name inheritance

Completion requirements:

- every candidate has a classification
- every classification maps to a registered V2 destination or no-runtime outcome
- unclear candidates remain in V1 or enter quarantine

Exit gate:

```txt
No unclassified component may proceed to ledger approval.
```

### Phase 2 — Ledger registration

Purpose: create the auditable movement record before code movement.

Required activity:

- add the component row to `MIGRATION-MAP.md`
- fill every preflight field
- declare API strategy and consumer impact
- declare export intent
- declare CSS/token, runtime, metadata, reference, and accessibility dependencies
- assign Storybook, visual, and test proof targets
- record rollback note
- keep status as `pending` until all approval conditions are satisfied

Completion requirements:

- no blank fields
- no guessed destination
- no unknown export intent
- no undocumented API compatibility decision
- no missing rollback note

Exit gate:

```txt
No ledger row, no migration.
```

### Phase 3 — Readiness approval

Purpose: decide whether implementation may begin.

Required activity:

- verify destination against `TAXONOMY.md`
- verify timing against `ROADMAP.md`
- verify reference-pack boundary
- verify no forbidden V1 runtime dependency is needed
- verify CSS/token compatibility
- verify client/server boundary
- verify metadata role
- verify accessibility concerns
- verify proof targets

Completion requirements:

- status may move from `pending` to `approved-for-migration` only when all
  readiness conditions are complete
- blocked candidates must record the blocker and remain out of V2
- quarantined candidates must not be public exports

Exit gate:

```txt
No approved status, no implementation.
```

### Phase 4 — V2 implementation and package proof

Purpose: implement the component in V2 without leaking legacy, reference, or
consumer-specific concerns.

Required activity:

- implement only in the approved V2 destination
- preserve or intentionally change API according to the declared API strategy
- use canonical shadcn token authority
- respect client/server export boundaries
- avoid ERP business logic
- avoid reference-pack runtime imports
- keep public exports aligned with export intent

Completion requirements:

- V2 package tests pass
- V2 package typecheck passes
- V2 package build passes
- V2 design-system drift guard passes
- V2 Biome gate passes
- public export path is verified
- forbidden imports are absent

Exit gate:

```txt
Package-local proof may move status from approved-for-migration to migrated.
```

### Phase 5 — Controlled pilot integration

Purpose: prove the migrated component survives real consumer usage without
approving broad production cutover.

Required activity:

- choose one controlled pilot consumer
- import only from approved public V2 surfaces
- verify CSS loading order in the pilot surface
- verify runtime client/server behavior
- verify accessibility baseline
- verify metadata safety or declared absence
- verify visual behavior through Storybook, screenshot, smoke route, or manual
  visual acceptance
- keep V1 source available for rollback

Completion requirements:

- pilot imports no deep V2 internals
- pilot imports no legacy runtime implementation
- pilot uses the documented CSS entrypoint order
- rollback path is documented and reviewable

Exit gate:

```txt
Pilot proof may move status from migrated to pilot-proven.
```

### Phase 6 — Enterprise acceptance

Purpose: separate local migration success from operational release readiness.

Required activity:

- complete the enterprise evidence record
- record package build, typecheck, test, and Biome proof
- record public export and forbidden-import proof
- record API compatibility and consumer-impact proof
- record CSS loading proof
- record runtime client/server proof
- record accessibility proof
- record Storybook or visual proof
- record metadata safety proof
- record pilot consumer and pilot route/page
- record rollback proof
- record release owner approval

Completion requirements:

- evidence is concrete and reproducible
- release owner approval is explicit
- rollback is known before production usage
- `migrated` is not treated as release approval

Exit gate:

```txt
Enterprise evidence may move status from pilot-proven to enterprise-accepted.
```

### Phase 7 — Release cutover and retirement review

Purpose: decide whether production consumers may switch and whether V1 may later
be retired.

Required activity:

- switch only approved consumers
- keep rollback path active during cutover
- monitor consumer import boundaries
- avoid broad search-and-replace migration
- keep V1 source until retirement is separately approved
- update `LEGACY-RETIREMENT-PLAN.md` only after enterprise acceptance

Completion requirements:

- production consumers import only approved public V2 surfaces
- V1 remains available until rollback risk is accepted
- retirement is a release-owner decision, not a migration side effect

Exit gate:

```txt
Enterprise-accepted components may become retirement-candidate only after release-owner review.
```

### Phase order summary

```txt
documentation authority lock
-> component inventory and classification
-> ledger registration
-> readiness approval
-> V2 implementation and package proof
-> controlled pilot integration
-> enterprise acceptance
-> release cutover and retirement review
```

## Component ledger rule

`MIGRATION-MAP.md` is the operational ledger for component migration.

A V1 component may not be copied, moved, rewritten, recreated, exported, or used
by a consumer until its migration-map row exists.

Each component row must declare:

- V1 path
- V1 purpose
- classification
- V2 destination
- migration action
- API strategy
- consumer impact
- public export intent
- CSS/token dependency
- runtime dependency
- metadata dependency
- reference-pack dependency
- accessibility concern
- Storybook target
- visual proof target
- test target
- rollback note
- enterprise evidence record
- status

Code movement before ledger registration is taxonomy drift.

## Component classification

Classification decides destination. Legacy folder names are origin evidence only.

| Classification | V2 destination | Migration rule |
| --- | --- | --- |
| `primitive` | `components/ui` | Migrate only if stable, governed, and primitive-shaped. |
| `layout` | `components/layout` | Migrate only if it is reusable shell or chrome. |
| `shared` | `components/shared` | Migrate if reusable but not primitive or page-shaped. |
| `asset` | `assets` or `components/assets` | Move based on package-level or component coupling. |
| `view` | `views/*` | Translate composition; do not treat as a primitive. |
| `quarantine` | `components/quarantine` | Stage only; no public export. |
| `reference-only` | none unless promoted | Do not migrate directly. |
| `replaced` | none | Record replacement; do not create a V2 component. |
| `retired` | none | Record retirement; do not create a V2 component. |

### No folder-name inheritance

Legacy folder names must not decide V2 placement.

- A component from `components-auth-shell` does not automatically become a component.
- A component from `components-layouts` does not automatically belong in `components/layout`.
- A component from `components-ui` does not automatically qualify as a primitive.
- A component from a reference extraction does not automatically qualify for runtime.

Classification, taxonomy, export intent, and proof target decide movement.

## Migration status model

Allowed statuses:

| Status | Meaning | Consumer import allowed |
| --- | --- | --- |
| `pending` | Ledger row exists but readiness is incomplete. | No |
| `approved-for-migration` | Preconditions are complete; implementation may begin. | No |
| `migrated` | V2 implementation exists and package-local proof gates pass. | Pilot only |
| `pilot-proven` | One controlled consumer proves integration without release approval. | Controlled pilot only |
| `enterprise-accepted` | Pilot proof, runtime proof, styling proof, accessibility proof, rollback proof, and release-owner approval exist. | Yes |
| `retirement-candidate` | V2 replacement is accepted and V1 may be reviewed for removal. | Through accepted V2 replacement |
| `quarantined` | Staged in quarantine; not public API. | No |
| `replaced` | V1 behavior is covered by another V2 unit or composition. | Only through the replacement |
| `retired` | No V2 migration is required. | No |
| `blocked` | Migration cannot proceed until the blocker is resolved. | No |

`approved-for-migration` requires:

- valid classification
- registered V2 destination
- no forbidden reference-pack dependency
- no forbidden V1 runtime dependency
- CSS/token compatibility confirmed
- client/server boundary confirmed
- metadata role declared
- public export intent declared
- proof target assigned
- rollback note recorded

Only `approved-for-migration` components may enter V2 implementation.

Only `migrated` components may be used by a controlled pilot consumer.

Only `pilot-proven` components may be considered for enterprise acceptance.

Only `enterprise-accepted` components may be used by production or ERP
consumers.

Only `enterprise-accepted` components may become `retirement-candidate`.

Components with status `pending`, `blocked`, `quarantined`, `replaced`,
`retired`, or `retirement-candidate` must not be imported directly by consumers
outside the approved replacement path.

Recommended migration maturity ladder:

```txt
registered
-> approved-for-migration
-> migrated
-> pilot-proven
-> enterprise-accepted
-> retirement-candidate
-> V1-retired
```

The ledger status values remain the controlled operating vocabulary. The ladder
above clarifies maturity expectations so `migrated` does not get overloaded as
release approval.

## Public export intent

Migration does not imply public export.

Use exactly one export intent per component row:

| Export intent | Meaning |
| --- | --- |
| `private-internal` | V2 implementation detail; no package public export. |
| `public-neutral` | Safe for the root neutral package surface. |
| `public-client` | Safe for `@afenda/shadcn-studio-v2/clients`. |
| `public-server` | Safe for `@afenda/shadcn-studio-v2/server`. |
| `public-metadata` | Safe for `@afenda/shadcn-studio-v2/metadata`. |
| `css-export` | Stable CSS entrypoint exported by `package.json`. |
| `not-exported` | Must not be publicly imported. |

Approved consumer import surfaces:

```txt
@afenda/shadcn-studio-v2
@afenda/shadcn-studio-v2/clients
@afenda/shadcn-studio-v2/server
@afenda/shadcn-studio-v2/metadata
```

Forbidden consumer deep imports:

```txt
@afenda/shadcn-studio-v2/components/*
@afenda/shadcn-studio-v2/views/*
@afenda/shadcn-studio-v2/contexts/*
@afenda/shadcn-studio-v2/styles/*
@afenda/shadcn-studio-v2/metadata/*
```

CSS exception:

```txt
Deep style imports are forbidden except package-exported CSS entrypoints.
```

CSS entrypoints are allowed only when explicitly declared in `package.json`
exports, for example:

```txt
@afenda/shadcn-studio-v2/styles/shadcn-default.css
@afenda/shadcn-studio-v2/styles/swiss-noir.css
@afenda/shadcn-studio-v2/styles/verdant-noir.css
```

## Component preflight record

Every component candidate must have this record in `MIGRATION-MAP.md` before code
movement:

```md
## Component Preflight Record

- V1 path:
- V1 purpose:
- Classification:
- V2 destination:
- Migration action:
- API strategy:
- Consumer impact:
- Public export intent:
- CSS/token dependency:
- Runtime dependency:
- Metadata dependency:
- Reference-pack dependency:
- Accessibility concern:
- Storybook target:
- Test target:
- Rollback note:
- Enterprise evidence record:
- Status:
```

Use `none` only when the absence of a dependency or target is intentional and
reviewed. Do not leave blank fields.

## API Compatibility Gate

Every migrated component must declare one API strategy before implementation.

| API strategy | Meaning |
| --- | --- |
| `preserve` | V2 keeps the V1 public prop contract. |
| `narrow` | V2 intentionally removes unsupported props. |
| `rename` | V2 changes prop names with documented mapping. |
| `replace` | V2 does not preserve API; consumers must use a replacement. |
| `new` | V2 is a new component with no V1 compatibility promise. |

The migration-map row must record:

- API strategy
- consumer impact

Component movement without declared API strategy is migration ambiguity and must
not reach `approved-for-migration`.

## Decision tree

Use this method before selecting a destination:

```txt
Does it render UI?
  No -> not a component migration.

Is it a primitive or near-primitive?
  Yes -> components/ui.

Is it reusable shell/chrome?
  Yes -> components/layout.

Is it reusable React support but not primitive?
  Yes -> components/shared.

Is it page-shaped, workflow-shaped, or composition-heavy?
  Yes -> views/*.

Is it unstable, copied, unclear, or reference-derived?
  Yes -> components/quarantine first.

Is it only a design/reference idea?
  Yes -> registry classification first; no runtime code.
```

If the decision tree cannot produce a legal destination, the component stays in
V1 or enters quarantine.

## Component-type gates

### Primitive components

Destination:

```txt
components/ui
```

Examples:

```txt
Button
Badge
Card
Alert
Field
Table
```

Gate:

- belongs in `components/ui`
- uses canonical shadcn token contract
- does not own page layout
- does not import views
- does not import ERP domain logic
- export is intentional
- Storybook or test target exists

Forbidden examples:

```txt
components/ui/AuthShell.tsx
components/ui/EvidenceChamber.tsx
components/ui/DashboardPanel.tsx
```

Those are composed surfaces, not primitives.

### Layout components

Destination:

```txt
components/layout
```

Allowed examples:

```txt
AppShell.tsx
Sidebar.tsx
Topbar.tsx
```

Gate:

- reusable chrome only
- no page-specific doctrine copy
- no auth-specific workflow logic
- no ERP module logic
- no reference-pack direct copy

If the unit becomes page-shaped, move it to:

```txt
views/pages
views/auth
views/widgets
```

### Shared components

Destination:

```txt
components/shared
```

Allowed examples:

```txt
ThemeToggle.tsx
ThemeScript.tsx
```

Gate:

- reusable across views
- not primitive enough for `components/ui`
- not page-shaped enough for `views/*`
- no deep public import requirement

### Views

Destination:

```txt
views/*
```

Allowed categories must be registered in `TAXONOMY.md`.

Current V2 categories include:

```txt
auth
pages
widgets
```

Future categories require taxonomy amendment before use.

Gate:

- composes primitives, shared parts, and layout parts
- does not own ERP business logic
- does not introduce new token families
- imports only through legal V2 internal paths
- exported only through approved public boundary if intended

`views/auth` is the correct home for old `components-auth-shell` concepts.

Forbidden destinations:

```txt
components-auth-shell
components/layout/auth
blocks/auth
features/auth
```

### Assets

Destination:

```txt
assets
components/assets
```

Gate:

- package-level visual assets go in `assets`
- component-coupled assets go in `components/assets`
- assets must not carry business logic
- asset imports must not bypass public export policy

### Quarantine

Destination:

```txt
components/quarantine
```

Gate:

- no public export
- no consumer import
- source is recorded
- reason for quarantine is recorded
- target destination is recorded
- promotion condition is recorded

Quarantine is a staging lane, not a junk drawer.

## Reference-pack boundary

`_reference/CreateEditorialLayout` is evidence only.

Reference material may influence:

- composition
- hierarchy
- visual judgment
- diagnostic language
- promotion evidence

Reference material must not provide:

- direct JSX
- direct CSS
- token names
- primitive names
- folder names
- runtime imports

A reference-derived component candidate must not enter `components/ui`,
`components/layout`, `components/shared`, or `views` unless it has:

- traceability registry entry
- candidate classification
- promotion checklist result
- V2 destination
- Storybook or consumer proof target

Current evidence:

```txt
CEL-004 = ERP-compose-only
```

Therefore, it must not become:

```txt
components/ui/EvidenceChamber.tsx
components/shared/EvidenceChamber.tsx
components/blocks/EvidenceChamber.tsx
```

If used later, the correct direction is likely:

```txt
views/widgets/*
views/pages/*
ERP consumer composition
```

That still requires traceability and proof before implementation.

## Full-stack integration gates

Component migration affects more than the component file. Review these gates
before implementation and again before pilot import.

### Package boundary

- Consumers import only approved public V2 surfaces.
- V2 root files remain intentional public boundaries.
- Quarantine and internal folders are not exported.
- Migration does not create new root public files.

### Client/server boundary

- Client-only providers, hooks, and interactive components use the client-safe surface.
- Server-safe configuration and metadata helpers avoid browser runtime dependencies.
- Neutral exports must not hide client-only behavior.
- Server exports must not include React client providers.

### CSS and theme boundary

- CSS lives under `src/styles/`.
- Canonical shadcn tokens remain the styling contract.
- Theme files layer on top of the default token layer.
- Do not introduce token families such as `--brand-*`, `--afenda-*`,
  `--surface-*`, or `--luxury-*`.
- Component JSX must not depend on raw reference colors.

### Metadata boundary

- Metadata contracts remain JSON-safe and serializable.
- Metadata registries do not import React views.
- Component migration must declare whether it has metadata dependency.
- UI behavior must not execute from metadata alone.

### Runtime state boundary

- Static configuration remains in `configs/`.
- React providers remain in `contexts/`.
- Runtime access hooks remain in `hooks/`.
- Reusable runtime-adjacent helpers remain in `components/shared/`.

### Accessibility boundary

Every component candidate must declare known accessibility concerns:

- keyboard behavior
- focus visibility
- labeling
- semantic roles
- table or form relationships
- disabled, loading, invalid, and error states

Unknown accessibility requirements block `approved-for-migration`.

### Storybook boundary

Every public component must have either:

- a named Storybook target, or
- an explicit Vitest-only exception with reviewer approval.

Reusable private components should have a named Storybook target when visual
behavior, state behavior, or accessibility behavior cannot be fully proven by
unit tests.

Storybook targets are review evidence, not runtime authority.

### ERP consumer boundary

A pilot consumer may import only from approved public V2 surfaces.

A migrated component must prove:

- CSS loading order
- runtime safety
- metadata safety, if relevant
- accessibility baseline
- rollback path

### Reference boundary

No V2 runtime component may import from:

```txt
_reference/CreateEditorialLayout
```

No V2 component may import from legacy runtime implementation paths:

```txt
packages/shadcn-studio/src
@afenda/shadcn-studio
```

## Visual Regression Gate

For visual components and views, migration proof must include at least one of:

- Storybook review state
- screenshot comparison
- Playwright visual smoke route
- documented manual visual acceptance

Visual proof must cover at minimum:

- default state
- dense or content-heavy state
- disabled, loading, or error state where applicable
- light/dark or theme-specific state where applicable

## Post-Migration Enterprise Evaluation

A component with status `migrated` is not enterprise-ready by default.

`migrated` means the V2 implementation exists and local package gates pass.
Enterprise acceptance requires end-to-end proof across package boundary,
consumer boundary, runtime boundary, styling boundary, accessibility boundary,
metadata boundary, release boundary, and rollback boundary.

A migrated component may not be marked `enterprise-accepted` until the
following evidence exists:

- V2 package build passes.
- V2 package typecheck passes.
- V2 package tests pass.
- V2 design-system drift guard passes.
- Public export path is verified.
- Forbidden deep imports are absent.
- CSS entrypoint order is verified in a real consumer.
- Runtime client/server boundary is verified.
- Storybook or visual review target is available.
- Accessibility baseline is checked.
- Metadata dependency is proven safe or declared absent.
- Pilot consumer import is verified.
- Rollback command/path is documented.
- Release owner approval is recorded.

### Enterprise evidence record

Record this evidence in `MIGRATION-MAP.md` before a component can move from
`migrated` to `pilot-proven` or `enterprise-accepted`:

```md
## Enterprise Evidence Record

- Package build proof:
- Package typecheck proof:
- Package test proof:
- Design-system drift proof:
- Biome proof:
- Public export proof:
- Forbidden import proof:
- API compatibility proof:
- Consumer impact proof:
- CSS loading proof:
- Runtime client/server proof:
- Accessibility proof:
- Storybook/visual proof:
- Metadata safety proof:
- Pilot consumer:
- Pilot route/page:
- Rollback proof:
- Release owner:
- Enterprise acceptance status:
```

The record must cite actual proof locations or commands. Do not use generic
phrases such as `passed locally` without the command or evidence source.

## Pilot and Release Cutover Rule

Pilot import proves integration.

Release cutover proves operational acceptance.

A pilot consumer may import a `migrated` component only for controlled
verification.

A production or ERP consumer may import the component only after the component
is marked `enterprise-accepted`.

Before a controlled pilot consumer imports V2:

- the consumer imports only from approved public V2 surfaces
- the migrated component has a migration-map row
- the component status is `migrated`
- V1 source remains available for rollback
- pilot proof confirms CSS loading order and runtime safety
- rollback note is recorded

Before a production or ERP consumer switches from V1 to V2:

- the component status is `enterprise-accepted`
- the enterprise evidence record is complete
- release owner approval is recorded
- rollback proof has been exercised or reviewed
- V1 retirement is still treated as a separate decision

Correct order:

```txt
migrate component to V2
prove V2 package gate
pilot consumer import
verify runtime/styling/accessibility
record enterprise evidence
record release-owner approval
record rollback
consider V1 retirement later
```

Wrong order:

```txt
move component
delete V1
fix imports everywhere
debug CSS after
```

## Migration order

Migrate by risk, not by folder.

Recommended sequence:

1. Button
2. Badge
3. Card
4. Alert
5. Theme config/helper split
6. Field
7. Table
8. Layout chrome
9. Auth view
10. One generic page/view
11. One widget/evidence view

This order keeps basic primitives first, theme boundary second, complex
primitives third, layout fourth, and views last.

Avoid starting with:

```txt
AuthShell
AppShell
EvidenceChamber
DashboardLayout
Table-heavy surfaces
```

Those are high-composition surfaces and pull too many decisions too early.

## Validation and tests

Add and maintain a V2-local test:

```txt
src/__tests__/component-migration.test.ts
```

The test should verify:

- no forbidden V1 structural names under V2
- `components/ui` contains only approved primitive files
- `components/layout` does not contain auth, page, or workflow-shaped names
- `views` contains only registered view categories
- quarantine is not exported
- no component imports from `_reference/CreateEditorialLayout`
- no component imports from `packages/shadcn-studio/src`
- no component imports from `@afenda/shadcn-studio`
- consumers use only approved V2 public surfaces
- CSS imports are limited to package-exported CSS entrypoints

Run these gates after migration work:

```bash
pnpm --filter @afenda/shadcn-studio-v2 check:drift
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm exec biome ci packages/shadcn-studio-v2
```

## Rollback

Rollback must be recorded before pilot import.

Minimum rollback note:

```md
- V1 source to keep:
- Consumer import to restore:
- CSS entrypoint to restore:
- Metadata behavior to restore:
- Verification command after rollback:
```

Rollback is valid only if V1 source remains available and consumer imports can
return to the previous public package path without deleting V2 evidence.

## Related documents

- [Documentation index](README.md)
- [Roadmap](ROADMAP.md)
- [Taxonomy](TAXONOMY.md)
- [Migration map](MIGRATION-MAP.md)
- [Legacy retirement plan](LEGACY-RETIREMENT-PLAN.md)
- [Slice implementation index](slices/SLICE-IMPLEMENTATION-INDEX.md)
