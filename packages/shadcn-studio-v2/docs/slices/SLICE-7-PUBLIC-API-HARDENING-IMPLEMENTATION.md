# Slice 7 Implementation Detail — Public API Hardening

## 1) Slice identity

- Slice ID: `Slice 7`
- Slice name: `Public API hardening`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `Set during slice kickoff after Slice 6 verification`
- Actual completion date: `2026-07-05`
- Current status: `verified`

## 2) Strategic objective

### Why this slice exists
- Convert scaffold into strict, audited package surface across client/server/metadata boundaries.

### Slice-level acceptance criteria
- `index.ts`, `clients.ts`, `server.ts`, `metadata.ts` explicit and intentional.
- No folder-wide re-exports by default.

## V2-only guardrail

V2-local verification only. Do not run or repair root governance, legacy studio, ERP, database, or architecture-authority gates during this slice.
## 3) Scope boundaries

### In scope
- Root boundary files and package export map
- explicit leakage tests for each surface
- boundary documentation updates

### Out of scope
- migration pilot execution
- new feature component additions

### Anti-goals
- Avoid exposing server-side internals from client surface.

## 4) Dependencies and sequence gates

- Predecessor slice: `Slice 6`
- Dependencies:
  - metadata lane complete and isolated
- Required gates before merge:
  - `Gate D: export boundary`
  - `Gate E: typecheck and config resolution`
  - `Gate F: build` (if package build wired)

## 5) Implementation plan

### Export and boundary work
- Ensure each root file has single-purpose export intent.
- Add explicit test cases for:
  - client-only leakage prevention
  - server-only leakage prevention
  - metadata isolation

## 6) Test and verification commands

- `pnpm --filter @afenda/shadcn-studio-v2 test`
- `pnpm --filter @afenda/shadcn-studio-v2 typecheck`
- `pnpm --filter @afenda/shadcn-studio-v2 build`
- `pnpm exec biome ci packages/shadcn-studio-v2`

### Evidence log

| Command | Result | Evidence path |
| --- | --- | --- |
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-7-PUBLIC-API-HARDENING-HANDOFF.md` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-7-PUBLIC-API-HARDENING-HANDOFF.md` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-7-PUBLIC-API-HARDENING-HANDOFF.md` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS | `packages/shadcn-studio-v2/docs/handoffs/SLICE-7-PUBLIC-API-HARDENING-HANDOFF.md` |
## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| client surface exports server-only code | Medium / High | Add leakage tests for `clients.ts` before promotion | V2 migration squad | Active |
| metadata exports leak through neutral root surface | Medium / Medium | Require each `index.ts` export to have neutral shared intent | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: package build is available by the time this slice is executed; if not, Gate F remains explicitly deferred with owner approval.
- Decision needed before verification: confirm exact public symbol list for each root surface.

## 9) Exit checklist

- Required before verification: export maps are strict by surface.
- Required before verification: leakage tests present for client/server/metadata.
- Required before verification: Gate D/E/F evidence captured or Gate F deferral is explicitly approved.
