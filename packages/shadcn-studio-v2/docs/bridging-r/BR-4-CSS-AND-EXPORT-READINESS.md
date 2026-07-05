# BR-4 Implementation Detail - CSS and Export Readiness

## 1) Slice identity

- Slice ID: `BR-4`
- Slice name: `CSS and export readiness`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists

- Decide and verify the real-consumer CSS loading and public-entrypoint
  contract before any consumer switch.

### Slice-level acceptance criteria

- The real-consumer CSS entrypoint strategy is explicit.
- The strategy is compatible with package exports and loading order.
- If package-exported CSS is required, the export is present and verified before
  `Phase R`.

## 3) Scope boundaries

### In scope

- CSS entrypoint decision
- export-surface decision tied to real-consumer loading
- validation plan for CSS ordering and fallback behavior

### Out of scope

- consumer runtime cutover itself
- broad design-token redesign
- ad hoc CSS injection outside governed entrypoints

### Anti-goals

- do not assume that package-local CSS proof automatically matches real-consumer
  loading behavior

## 4) Dependencies and sequence gates

- Predecessor slice: `BR-3`
- Dependencies on external teams, packages, or tasks:
  - `consumer owner / confirms import style`
- Required gates before merge:
  - chosen CSS entrypoint strategy documented
  - export contract documented if applicable
  - validation and rollback notes present

## 5) Implementation plan

### Current bridge status

| Dimension | Status | Evidence |
| --- | --- | --- |
| Documentation synchronization | `green` | bridge guide, index, and tests are aligned |
| Execution readiness | `green` | the real-consumer CSS/runtime contract is chosen, exported, and validated in a real consumer |
| Remaining gap | `none - reviewed` | CSS/export strategy is explicit and verified |

### Architecture/structure changes

- `package.json` -> update only if package-exported CSS is the approved strategy
- `docs/BRIDGING-R-PHASE-R-READINESS.md` -> keep CSS/export backlog explicit
- `docs/MIGRATION-MAP.md` -> record CSS dependency and proof fields for
  first-cutover rows

### Current repo evidence

- Legacy package export contract:
  - `@afenda/shadcn-studio/theme`
  - `@afenda/shadcn-studio/shadcn-default.css`
- Real consumer usage:
  - `apps/developer/src/app/layout.tsx`
  - `apps/developer/src/app/globals.css`
  - `apps/erp/src/app/globals.css`
- V2 export contract now includes `./theme` and `./shadcn-default.css`
- `apps/developer` now consumes the V2 CSS/runtime contract in live code

### Decision method

1. Inspect current public exports in `package.json`.
2. Determine whether the consumer will load CSS via:
   - package-exported CSS
   - consumer-owned import path
   - another explicitly governed entrypoint
3. Record the chosen strategy and reject ambiguous language.
4. Define CSS ordering proof:
   - base layer first
   - theme layer second
5. Record fallback/rollback behavior if CSS loading fails.

### Agent execution rule

- If a CSS export is required but not present, do not start `Phase R`.
- If the strategy depends on undocumented import behavior, keep this slice
  blocked.

### Decision record template

| Field | Current value |
| --- | --- |
| Chosen consumer | `@afenda/developer /dashboard/sales` |
| CSS entrypoint strategy | `package-exported CSS import in consumer globals.css` |
| Package export required | `yes` |
| Import path / entrypoint | `@afenda/shadcn-studio-v2/shadcn-default.css` |
| Theme/runtime path | `@afenda/shadcn-studio-v2/theme` |
| CSS ordering proof | `tailwindcss -> tw-animate-css -> shadcn/tailwind.css -> package CSS` |
| Rollback behavior | `bounded file-level rollback to legacy package imports, then rerun consumer gates` |

### Recommended child steps

1. `BR-4A` capture the live V1 CSS and theme contract from `apps/developer`
   and `apps/erp`.
2. `BR-4B` diff legacy and V2 `package.json` exports.
3. `BR-4C` decide whether V2 must expose `./theme` and `./shadcn-default.css`.
4. `BR-4D` keep the bridge blocked until the approved contract is verifiable.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | keep CSS governance and export tests passing | `src/__tests__/style-governance.test.ts`; `src/__tests__/public-exports.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | no declaration regressions if export metadata changes | `tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | export/build verification | `dist/`; `package.json` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | formatting and lint verification | package root |

## 7) Evidence log

- Public export source: `package.json`
- CSS authority: `docs/ROADMAP.md`; `docs/MIGRATION-MAP.md`
- CSS proof tests:
  `src/__tests__/style-governance.test.ts`;
  `src/__tests__/public-exports.test.ts`

## 8) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| consumer CSS load path differs from package-local assumptions | High / High | document exact entrypoint and validate in consumer later | V2 migration squad | Active |
| package exports remain incomplete for the chosen strategy | Medium / High | keep `Phase R` blocked until exports are explicit | V2 migration squad | Active |

## 9) Open questions / assumptions

- Assumption: real-consumer parity requires package-exported CSS, not an
  undocumented path convention.
- Decision needed: whether V2 should mirror the legacy `./theme` runtime entry
  as a first-class export or document a different governed contract.

## 10) Exit checklist

- [x] CSS entrypoint strategy is explicitly documented.
- [x] Export strategy is verified against `package.json`.
- [x] CSS ordering proof is defined.
- [x] Fallback and rollback behavior is recorded.

## 11) Handoff summary

- Completion recommendation: `go` only when consumer CSS loading can be
  described as a concrete contract.
- If `no-go`, blocker is missing export or ambiguous loading strategy.
- Next slice dependency to start: `BR-5`
