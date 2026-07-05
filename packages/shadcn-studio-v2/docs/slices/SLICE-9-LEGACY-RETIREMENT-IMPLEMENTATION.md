# Slice 9 Implementation Detail — Legacy Retirement Plan

## 1) Slice identity

- Slice ID: `Slice 9`
- Slice name: `Legacy retirement plan`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 8 verification`
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
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-9-LEGACY-RETIREMENT-HANDOFF.md` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-9-LEGACY-RETIREMENT-HANDOFF.md` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-9-LEGACY-RETIREMENT-HANDOFF.md` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-9-LEGACY-RETIREMENT-HANDOFF.md` |
## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| legacy removal occurs without replacement proof | Medium / High | Require `MIGRATION-MAP.md` status plus replacement evidence before removal | V2 migration squad | Active |
| retired terminology remains in docs after cleanup | Medium / Medium | Run legacy terminology and documentation drift gates before verification | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: every retirement candidate has a V2 replacement, quarantine disposition, or explicit blocked status before deletion.
- Decision needed before verification: confirm final retirement owner for each legacy area.

## 9) Exit checklist

- Required before verification: migration map reflects all completed statuses.
- Required before verification: legacy removals have direct V2 replacement proof.
- Required before verification: no ad-hoc deletions without evidence.
