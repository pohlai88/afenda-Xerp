# shadcn-studio-v2 Migration and Development Roadmap

## Tracking metadata

- Owner of record: V2 migration squad
- Primary status model: `not-started` → `in-progress` → `blocked` → `verified` → `retired`
- Update cadence: once per slice boundary completion or blocker change
- Canonical proof locations:
  - V2-local package gate output from each scoped package run
  - package-level tests/build logs
  - handoff artifacts under `docs/handoffs/`

## Purpose

This document defines the ordered migration and development sequence for `packages/shadcn-studio-v2`.

It exists to prevent three failure modes:

- migrating legacy code before the V2 destination is ready
- copying reference-app structure directly into V2
- letting package exports, CSS, or composition drift ahead of governance

Guiding rule:

```txt
Do not migrate code because it exists.
Migrate only when the destination taxonomy, export boundary, and proof gate are ready.
```

## Strategy

V2 uses a shadow migration strategy.

- `packages/shadcn-studio-v2` is built in parallel
- `packages/shadcn-studio` remains the active production package until V2 proves readiness
- early slices establish truth, structure, CSS, and boundary discipline before meaningful migration begins

This roadmap is sequence-based, not date-based.

## Slice Sequence

### Slice 0 — Foundation correction

Purpose: correct scaffold truth before development.

This slice is not development. This slice is truth correction.

- No component, CSS, view, metadata, or export implementation may begin until Slice 0 passes.
- Verify and correct:
  - `src/` root names
  - root public files
  - Level 2 taxonomy alignment
  - forbidden legacy names
  - `tsconfig` aliases
  - package config consistency
  - Vitest config consistency
  - taxonomy doc and test consistency
- Remove stale V2 drift such as legacy path aliases or misnamed structural stems.
- Keep the taxonomy gate under the repo-wide test convention and document `__tests__` as a test-only exception, not a taxonomy folder.

Exit condition:

- taxonomy gate passes
- config resolution is clean
- no stale alias or structural drift remains
- V2 scaffold matches its own authority docs

### Slice 0.5 — Public export scaffold

Purpose: establish the public boundary before package behavior exists.

- Keep only these root public files:
  - `index.ts`
  - `clients.ts`
  - `server.ts`
  - `metadata.ts`
- Ensure `package.json` `exports` maps to these public surfaces.
- Keep all early exports minimal.
- Do not allow any root file to become a barrel dump.

Required public interface shape:

- `@afenda/shadcn-studio-v2`
- `@afenda/shadcn-studio-v2/clients`
- `@afenda/shadcn-studio-v2/server`
- `@afenda/shadcn-studio-v2/metadata`

Exit condition:

- root boundary files exist
- package export paths resolve
- no root export file acts as a general dump

### Slice 1 — CSS and theme foundation

Purpose: define the V2 styling contract before component growth.

- Keep all styling under `src/styles/` only.
- Treat `shadcn-default.css` as the canonical base token layer.
- Treat named themes such as `swiss-noir.css` and `verdant-noir.css` as additive theme layers on top of the default.
- Lock the CSS loading order:
  - default layer first
  - theme layer second
- Do not introduce custom token names.
- Do not mix TS/TSX runtime logic into `styles/`.

Add CSS governance tests for:

- CSS-only files in `styles/`
- no TS/TSX in `styles/`
- theme files only override approved canonical shadcn tokens
- no custom token families such as `--brand-*`, `--afenda-*`, `--surface-*`, `--luxury-*`
- no component selectors or structural CSS creep

Exit condition:

- V2 has one explicit base CSS contract
- theme layering rule is documented and enforced
- CSS token drift is testable, not visual-only

### Slice 2 — Config and runtime boundary

Purpose: separate static configuration from React runtime behavior.

- Keep `configs/` environment-neutral and static unless explicitly amended later.
- Keep `contexts/` for React runtime providers and runtime state boundaries only.
- Keep `components/shared/` for reusable runtime-adjacent UI helpers.
- Keep `hooks/` for runtime access hooks.
- Translate legacy `theme-runtime` concepts into:
  - `configs/theme-config.ts`
  - `configs/studio-config.ts`
  - `contexts/ThemeProvider.tsx`
  - `components/shared/ThemeToggle.tsx`
  - `hooks/use-theme.ts`

Hard rule:

- static config must not contain runtime-aware React behavior
- React providers and runtime state must not live in `configs/`

Exit condition:

- config, provider, hook, and shared helper concerns are structurally separated
- no legacy runtime taxonomy concept survives in V2

### Slice 3A — Primitive baseline

Purpose: prove the primitive lane with the smallest safe set.

Start with:

- `Button`
- `Card`
- `Badge`

Rules:

- stable primitives go in `components/ui/`
- unstable or imported work goes in `components/quarantine/`
- `components/ui/` must not absorb page composition, view logic, or layout chrome

Exit condition:

- the first primitive batch is governed, named correctly, and export-safe

### Slice 3B — Primitive extension

Purpose: extend the primitive lane only after the baseline proves stable.

Add next:

- `Alert`
- `Field`
- `Table`

Reason:

- these are more likely to pull in accessibility, data, layout, and composition complexity

Entry condition:

- Slice 3A passes taxonomy, naming, export, and verification gates

Exit condition:

- the second primitive batch is added without collapsing V2 boundary discipline

### Slice 4 — Layout and shared package parts

Purpose: establish reusable chrome and cross-cutting React parts.

- Use `components/layout/` for reusable shell and chrome parts only.
- Use `components/shared/` for reusable non-primitive React parts.
- Use `components/assets/` for component-coupled assets.
- Do not let `components/layout/` become a page-composition dumping ground.

Quarantine rules:

- `components/quarantine/` is not public API
- root public surfaces must not export quarantine code
- every quarantined unit must record:
  - source
  - reason for quarantine
  - target destination
  - promotion condition
- promotion requires movement into registered taxonomy plus passing naming, export, and taxonomy gates

Exit condition:

- chrome and shared parts exist without page-shape confusion
- quarantine remains a controlled staging lane, not a junk drawer

### Slice 5 — First composed views

Purpose: prove the V2 composition model without importing ERP business logic into the package.

Start with:

- `views/auth`
- `views/pages`
- `views/widgets`

Use the composition law explicitly:

```txt
primitive -> multiple primitives -> composed view unit -> multiple view units -> final ERP consumer
```

Guardrails:

- `views/` composes UI; it does not own ERP domain logic
- `views/` may compose primitives, layout parts, shared parts, and metadata display helpers
- `views/` must not become a business-domain implementation layer
- keep the view taxonomy shape-based, not ERP-module-based

Translate legacy structures through taxonomy:

- `components-auth-shell -> views/auth`
- `components-layouts -> views/*`

Exit condition:

- V2 proves at least one auth surface and one generic composed surface
- composition happens in `views/`, not in legacy folder patterns

### Slice 6 — Metadata lane

Purpose: preserve Afenda metadata purpose as a first-class, isolated package lane.

Keep metadata under:

- `metadata/builders/`
- `metadata/contracts/`
- `metadata/gates/`
- `metadata/registries/`

Rules:

- metadata-only exports go through `metadata.ts`
- metadata must not become a generic utility lane
- metadata-specific contracts stay under `metadata/contracts` unless truly package-wide

Default sequencing decision:

- keep first views visual/composition-only
- do metadata after first views, not before, unless a later amendment proves those views are metadata-driven by necessity

Exit condition:

- metadata is structurally complete and export-isolated
- V2 preserves metadata purpose without bleeding it across package boundaries

### Slice 7 — Public API hardening

Purpose: convert the scaffolded boundary into a strict public package surface.

- Populate root export files by explicit boundary intent:
  - `index.ts` = neutral shared exports only
  - `clients.ts` = browser-safe exports only
  - `server.ts` = server-only exports only
  - `metadata.ts` = metadata-only exports only
- Root export files must not re-export entire folders by default.
- Export only intentional symbols, not convenience barrels.

Add export leakage tests for:

- root files exist
- package `exports` map exists and matches root boundary files
- `index.ts` does not leak client-only or server-only internals
- `clients.ts` does not export server-only code
- `server.ts` does not export client providers, hooks, or components that require client execution
- `metadata.ts` exports only the metadata lane

Exit condition:

- public import intent is explicit
- client, server, and metadata leakage is tested, not assumed

### Slice 8 — Consumer pilot and migration bridge

Purpose: prove V2 with a narrow real consumer path before broad adoption.

- Choose a small pilot surface, not a broad cutover.
- Prefer one pilot that exercises:
  - primitives
  - theme loading
  - layout and shared parts
  - at least one composed view
- Migrate by translation into V2 structure, not by copying legacy package shapes.
- Keep legacy `packages/shadcn-studio` active until the pilot proves:
  - structural clarity
  - export clarity
  - CSS clarity
  - consumer ergonomics

Use `MIGRATION-MAP.md` as the required translation record.

Exit condition:

- one real consumer path proves V2 works as designed
- migration status is tracked by evidence, not memory

### Slice 9 — Legacy retirement plan

Purpose: retire legacy intentionally only after V2 is proven.

- Build retirement from the migration map, not ad hoc cleanup.
- Mark each legacy area as:
  - `migrated`
  - `replaced`
  - `quarantined`
  - `retired`
  - `blocked`
- Remove legacy only after:
  - a V2 replacement exists
  - public exports are stable
  - pilot consumer proof exists
  - taxonomy and export gates remain clean

Hard rule:

- do not mix retirement into early V2 foundation slices

Exit condition:

- legacy retirement becomes a controlled final phase, not a live refactor hazard

### Bridging-R — Phase R readiness

Purpose: convert verified package-local slices into an explicit pre-cutover
readiness gate.

Rules:

- `Bridging-R` is documentation and readiness work only
- it must enumerate every backlog item required before real consumer cutover
- it must keep `retirement-candidate` aligned to the component authority chain:
  `enterprise-accepted` first, retirement review second
- it must name one real consumer, validation owner, rollback owner, and release
  owner before `Phase R` may start

Execution guide:

- `BRIDGING-R-PHASE-R-READINESS.md`

### Phase R — Consumer cutover and release-owner migration

Purpose: move from package-local V2 proof to one real consumer cutover without
authorizing broad deletion.

Rules:

- execute through one real consumer only
- use V2 public entrypoints only
- validate CSS, runtime, metadata, and rollback in the real consumer
- do not deep-import V2 internals
- do not treat consumer cutover as automatic legacy retirement

Authority boundary:

- Phase R is a separately authorized release/cutover phase
- it starts only after `Bridging-R` is cleared
- it is not part of the package-local slice implementation sequence
- legacy deletion still requires release-owner proof after cutover validation

Execution guide:

- `PHASE-R-CONSUMER-CUTOVER-GUIDE.md`

## Execution Tracking

Use this section as a live checkpoint. Keep only concrete proof references.

| Slice | Scope | Status | Evidence / check | Blockers | Last updated |
| --- | --- | --- | --- | --- | --- |
| Slice 0 | Foundation correction | verified | `pnpm --filter @afenda/shadcn-studio-v2 test:taxonomy`; `test`; `typecheck` | None | 2026-07-05 |
| Slice 0.5 | Public export scaffold | verified | `pnpm --filter @afenda/shadcn-studio-v2 test`; `typecheck`; `build` | None | 2026-07-05 |
| Slice 1 | CSS and theme foundation | verified | `pnpm --filter @afenda/shadcn-studio-v2 test`; `typecheck`; `build` | None | 2026-07-05 |
| Slice 2 | Config and runtime boundary | verified | `test`; `typecheck`; `build`; Biome CI; handoff report | None | 2026-07-05 |
| Slice 3A | Primitive baseline | verified | `test`; `typecheck`; `build`; Biome CI; handoff report | None | 2026-07-05 |
| Slice 3B | Primitive extension | verified | `test`; `typecheck`; `build`; Biome CI; handoff report | None | 2026-07-05 |
| Slice 4 | Layout and shared package parts | verified | `test`; `typecheck`; `build`; Biome CI; handoff report | None | 2026-07-05 |
| Slice 5 | First composed views | verified | `test`; `typecheck`; `build`; Biome CI; handoff report | None | 2026-07-05 |
| Slice 6 | Metadata lane | verified | `test`; `typecheck`; `build`; Biome CI; handoff report | None | 2026-07-05 |
| Slice 7 | Public API hardening | verified | `test`; `typecheck`; `build`; Biome CI; handoff report | None | 2026-07-05 |
| Slice 8 | Consumer pilot and migration bridge | verified | `test`; `typecheck`; `build`; Biome CI; handoff report | None | 2026-07-05 |
| Slice 9 | Legacy retirement plan | verified | `test`; `typecheck`; `build`; Biome CI; non-destructive retirement plan | None | 2026-07-05 |
| Bridging-R | Phase R readiness | verified | `BRIDGING-R-PHASE-R-READINESS.md`; `docs/bridging-r/evidence/README.md`; `pnpm --filter @afenda/developer typecheck`; `pnpm --filter @afenda/developer build`; `$env:PLAYWRIGHT_PORT='3020'; pnpm --filter @afenda/developer test:e2e:smoke` | None | 2026-07-05 |
| Phase R | Consumer cutover and release-owner migration | not-started | `PHASE-R-CONSUMER-CUTOVER-GUIDE.md` | Starts only after `Bridging-R` is cleared by concrete evidence and release-owner authorization | 2026-07-05 |

### Tracking protocol

- Set a slice to `in-progress` only after prerequisite slice is `verified`.
- Set to `verified` only when required gates pass with artifact links.
- Use `blocked` for unresolved gate failures or external dependencies.
- Fill `Blockers` with a one-line reason whenever status is `blocked`.

### Risk register

| Slice | Risk | Mitigation |
| --- | --- | --- |
| 0 | Legacy structure leaks into V2 before gate pass | keep all development after Slice 0 gate pass |
| 1 | Token drift through ad-hoc CSS additions | enforce canonical tokens and gate C checks |
| 2 | Runtime behavior appears in static config | explicit review on PRs touching config/runtime boundaries |
| 3A / 3B | Primitive growth bypasses taxonomy | require explicit review before promotion and export checks |
| 4 / 5 | `views` absorbs domain logic | enforce composition-only rule in PR checks |
| 6 | Metadata lane becomes generic utility bucket | enforce `metadata.ts` export isolation and tests |
| 7 | Export leakage between client/server/metadata surfaces | gate D + explicit surface scan before merge |
| 8 | Pilot expands into full migration too early | pilot scope freeze until verified proof is available |
| 9 | Legacy removed before replacement is stable | retire only through `MIGRATION-MAP.md` states |

## Gate Model

### Gate names

- Gate A: taxonomy
- Gate B: naming
- Gate C: CSS token governance
- Gate D: export boundary
- Gate E: typecheck and config resolution
- Gate F: build
- Gate G: pilot import check

### Minimum gate set by slice

Slice 0:

- Gate A
- Gate B
- Gate E

Slice 0.5:

- Gate A
- Gate D
- Gate E

Slice 1:

- Gate A
- Gate B
- Gate C

Slice 2:

- Gate A
- Gate B
- Gate D
- Gate E

Slice 3A-3B:

- Gate A
- Gate B
- Gate D
- Gate E
- Storybook verification if adopted for the slice

Slice 4-5:

- Gate A
- Gate B
- Gate D
- Gate E
- Storybook verification if adopted for the slice

Slice 6:

- Gate A
- Gate B
- Gate D for metadata boundary
- Gate E

Slice 7:

- Gate D
- Gate E
- Gate F if package build is wired by then

Slice 8:

- Gate D
- Gate E
- Gate G

Slice 9:

- Gate A
- Gate D
- Gate G for replacement proof

Phase R:

- Gate D in the real consumer
- Gate E in the real consumer
- Gate G with real consumer import proof
- release-owner rollback proof

Bridging-R:

- authority reconciliation proof
- first-cutover ledger coverage proof
- named real-consumer selection
- CSS/export readiness proof
- release-owner go/no-go record

## Core Acceptance

- no unregistered structural names appear in V2
- no forbidden legacy names reappear
- `__tests__` is treated only as a shared test convention
- CSS base and theme layers remain separate and token-governed
- config remains static and runtime-neutral
- runtime providers remain outside `configs/`
- quarantine remains isolated from public exports
- `views/` composes UI and does not become ERP business logic
- metadata remains isolated behind `metadata.ts`
- root export files enforce explicit public boundary intent
- consumer migration uses V2 translation, not reference-app copying
- post-slice real cutover starts only after `BRIDGING-R-PHASE-R-READINESS.md`
  is cleared, then follows `PHASE-R-CONSUMER-CUTOVER-GUIDE.md`

## Related Documents

- `TAXONOMY.md`
- `MIGRATION-MAP.md`
- `BRIDGING-R-PHASE-R-READINESS.md`
- `PHASE-R-CONSUMER-CUTOVER-GUIDE.md`
- `handoffs/`
- `../AGENTS.md`
- `slices/SLICE-IMPLEMENTATION-INDEX.md`
- `SLICE-IMPLEMENTATION-DETAIL-TEMPLATE.md`
- `SLICE-FINISHING-EVALUATION-AUDIT-HANDOFF.md`
