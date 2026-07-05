# Slice 4 Implementation Detail — Layout and Shared Package Parts

## 1) Slice identity

- Slice ID: `Slice 4`
- Slice name: `Layout and shared package parts`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 3B verification`
- Actual completion date: `Not completed`
- Current status: `not-started`

## 2) Strategic objective

### Why this slice exists
- Build reusable shell/chrome and cross-cutting runtime parts outside of page composition.

### Slice-level acceptance criteria
- Reusable chrome in `components/layout/`.
- Non-primitive shared parts in `components/shared/`.
- Controlled `components/assets/` usage for coupled assets.

## 3) Scope boundaries

### In scope
- `components/layout/`
- `components/shared/`
- `components/assets/`
- quarantine-to-taxonomy promotion process

### Out of scope
- core primitive additions (Slice 3A/3B)
- composed view logic
- business-domain implementation

### Anti-goals
- Do not let layout contain ERP module-specific behavior.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 3B`
- Dependencies:
  - Primitive baseline and extension must be stable
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate B: naming`
  - `Gate D: export boundary`
  - `Gate E: typecheck and config resolution`

## 5) Implementation plan

### Structure changes
- Normalize folder usage and naming for all reusable non-view chrome.
- Document quarantine entries with source, reason, destination, and promotion condition.
- Restrict page composition from landing in `layout`.

## 6) Test and verification commands

- `pnpm quality:boundaries`
- `pnpm quality:exports`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm quality:boundaries` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-4-LAYOUT-AND-SHARED-PARTS-IMPLEMENTATION.md` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| `components/layout/` becomes page-composition storage | Medium / High | Require each layout item to prove reusable chrome purpose before promotion | V2 migration squad | Active |
| quarantine entries lose source or promotion context | Medium / Medium | Require source, reason, destination, and promotion condition in every quarantine record | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: layout parts are reusable chrome, not route-specific page structures.
- Decision needed before verification: confirm whether any component-coupled assets require registry entries.

## 9) Exit checklist

- Required before verification: layout/shared folders populated with taxonomy-compliant items.
- Required before verification: quarantine policy and tracking fields are complete for held units.
- Required before verification: gate evidence attached and no root exports from quarantine.
