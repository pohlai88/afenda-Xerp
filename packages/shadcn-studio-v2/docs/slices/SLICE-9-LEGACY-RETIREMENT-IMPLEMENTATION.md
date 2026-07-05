# Slice 9 Implementation Detail — Legacy Retirement Plan

## 1) Slice identity

- Slice ID: `Slice 9`
- Slice name: `Legacy retirement plan`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists
- Retire legacy artifacts only after V2 replacement proof and migration stability.

### Slice-level acceptance criteria
- Every legacy area categorized as:
  - `migrated`, `replaced`, `quarantined`, `retired`, or `blocked`.
- No legacy removal without replacement and clean gates.

## V2-only guardrail

V2-local planning only. Do not delete legacy files, run root governance, repair ERP, touch database, or modify architecture-authority during this slice without a separate release-owner decision.
## 3) Scope boundaries

### In scope
- migration map execution and status updates
- legacy removal tasks tied to proven replacements
- taxonomy and export cleanup after retirement

### Out of scope
- premature cleanup before pilot/go-live readiness
- speculative deletion outside migration map

### Anti-goals
- Do not mix retirement with active foundation implementation.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 8`
- Dependencies:
  - Verified migration pilot proof
- Required gates before merge:
  - `Gate A: taxonomy`
  - `Gate D: export boundary`
  - `Gate G: replacement proof`

## 5) Implementation plan

### Execution model
- Use `MIGRATION-MAP.md` as authoritative retirement record.
- Update legacy status once each migration proof is captured.
- Remove/retire only areas with stable V2 alternatives.

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: retirement tests prove non-pending lane statuses, block `retired` without deletion authority, advance proven lanes to `retirement-candidate`, and keep component-ledger rows beyond pending once pilot proof exists | `packages/shadcn-studio-v2/src/__tests__/legacy-retirement.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: retirement-planning support files resolve with package-local types | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS: package emits verified retirement-planning-adjacent declarations | `packages/shadcn-studio-v2/dist` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS: retirement planning docs and tests are format/lint clean | `packages/shadcn-studio-v2` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| legacy removal occurs without replacement proof | Medium / High | Require `MIGRATION-MAP.md` status plus replacement evidence before removal | V2 migration squad | Active |
| retired terminology remains in docs after cleanup | Medium / Medium | Run legacy terminology and documentation drift gates before verification | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: every retirement candidate has a V2 replacement, quarantine disposition, or explicit blocked status before deletion.
- Decision: release-owner cutover remains the required authority before any legacy lane can advance from `retirement-candidate` to `retired`.

## 9) Implementation summary

- Advanced proven legacy lanes in `MIGRATION-MAP.md` from generic `migrated` to `retirement-candidate`.
- Kept quarantine lanes explicitly `quarantined`.
- Advanced the `Button` component ledger row to `pilot-proven` because package-local pilot proof now exists.
- Kept `retired` unused because no release-owner deletion proof exists.
- Preserved the non-destructive retirement plan in `LEGACY-RETIREMENT-PLAN.md`.

## 10) Exit checklist

- Verified: migration map reflects explicit package-local retirement planning statuses.
- Verified: legacy removals still require direct replacement and release-owner proof.
- Verified: no ad hoc deletions or cutover claims were made.

## 11) Post-verification stabilization review

- Review result: `PASS`
- Retirement planning is now serialized around explicit status vocabulary rather than generic migrated-state placeholders.
- Proven V2 replacement lanes stop at `retirement-candidate`, not `retired`.
- Component-ledger proof is aligned to current package-local pilot evidence.
- Package-local V2 migration implementation is complete; any further work is a separately authorized release/cutover phase.
