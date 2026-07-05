# Slice 1 Implementation Detail — CSS and Theme Foundation

## 1) Slice identity

- Slice ID: `Slice 1`
- Slice name: `CSS and theme foundation`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

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
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: style governance, taxonomy, and public export tests passed | `packages/shadcn-studio-v2/src/__tests__/style-governance.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: TypeScript config resolves | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS: package build completes | `packages/shadcn-studio-v2/dist` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| Theme drift due to noncanonical token additions | Medium / High | `style-governance.test.ts` enforces theme tokens as subset of canonical default tokens | V2 migration squad | Mitigated |

## 8) Open questions / assumptions

- Theme filenames are confirmed in `TAXONOMY.md`: `shadcn-default.css`, `swiss-noir.css`, `verdant-noir.css`.
- Future theme additions require taxonomy amendment before implementation.

## 9) Exit checklist

- Verified: base and theme CSS files are established in `src/styles`.
- Verified: default layer is canonical and theme files are additive overrides.
- Verified: token governance checks block custom token families and component selector creep.
- Verified: slice row updated with gate evidence.

## 10) Taxonomy and reference alignment

### Alignment decision
- Decision: `PASS WITH CONSTRAINT`
- Constraint: `shadcn-default.css` is the canonical default token layer for V2, not the full shadcn global CSS scaffold.

### Taxonomy evidence
- `TAXONOMY.md` registers exactly three style files:
  - `shadcn-default.css`
  - `swiss-noir.css`
  - `verdant-noir.css`
- `TAXONOMY.md` defines `shadcn-default.css` as the canonical default token layer.
- `TAXONOMY.md` keeps `styles/` CSS-only and rejects parallel structural folders or copied reference-project structure.

### CreateEditorialLayout reference evidence
- `_reference/CreateEditorialLayout/reference` is reference-only and does not authorize runtime imports.
- Token doctrine keeps canonical shadcn token names stable.
- Afenda identity must live in token values, composition, density, and governed extensions, not custom token families.
- The reference runtime path includes `@theme inline` mapping, Storybook verification, and ERP consumption, but those are downstream runtime/export concerns beyond this Slice 1 token-foundation scope.

### Explicit non-claim
- This slice does not claim `shadcn-default.css` is a byte-for-byte copy of the full official shadcn `app/globals.css` scaffold.
- This slice claims only that the V2 token layer is aligned with the registered taxonomy and reference token doctrine.

## 11) Handoff summary

- Completion recommendation: `Go for Slice 2 kickoff`
- Blocker: `None`
- Next slice dependency to start: `Slice 2`
