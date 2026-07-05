# Slice 1 Implementation Detail — CSS and Theme Foundation

## 1) Slice identity

- Slice ID: `Slice 1`
- Slice name: `CSS and theme foundation`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 0.5 verification`
- Actual completion date: `Not completed`
- Current status: `not-started`

## 2) Strategic objective

### Why this slice exists
- Define and harden the styling contract before component and view growth.

### Slice-level acceptance criteria
- Styling resides only in `src/styles`.
- Base token layer and named themes are ordered and additive.
- Token governance is explicit and enforceable.

## 3) Scope boundaries

### In scope
- `src/styles/shadcn-default.css`
- theme layer files under `src/styles`
- CSS-only governance checks and test scaffolding

### Out of scope
- runtime/component TSX imports in styles files
- component implementation in `components/`
- metadata internals

### Anti-goals
- No custom global token families (`--brand-*`, `--afenda-*`, `--surface-*`, `--luxury-*`).
- No component selectors in style foundation layer.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 0.5`
- Dependencies:
  - Export surface scaffold completed
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate B: naming`
  - `Gate C: CSS token governance`

## 5) Implementation plan

### Structure changes
- Add/confirm canonical `shadcn-default.css`.
- Add/additive theme files (e.g., `swiss-noir.css`, `verdant-noir.css`).
- Set stable load ordering:
  - default layer first
  - theme layer second

### Export and boundary work
- Keep CSS exports tied to style lane only.
- Block style leakage into runtime or configuration files.

## 6) Test and verification commands

- `pnpm quality:css`
- `pnpm check:studio-ui-gold`
- `pnpm check:studio-ui-contracts`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm quality:css` | Not run; required before verification | `packages/shadcn-studio-v2/docs/slices/SLICE-1-CSS-AND-THEME-FOUNDATION-IMPLEMENTATION.md` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Theme drift due to noncanonical token additions | Medium / High | Add token-only validation in slice gates | V2 migration squad | Active |

## 8) Open questions / assumptions

- Confirm theme filenames and any future themes in `TAXONOMY.md`.

## 9) Exit checklist

- Required before verification: base and theme CSS files are established in `src/styles`.
- Required before verification: theme load order documented and enforced.
- Required before verification: token governance checks exist for noncanonical token families.
- Required before verification: slice row updated with gate evidence.
