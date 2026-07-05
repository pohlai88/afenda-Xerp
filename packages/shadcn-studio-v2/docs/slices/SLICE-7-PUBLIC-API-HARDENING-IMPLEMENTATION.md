# Slice 7 Implementation Detail — Public API Hardening

## 1) Slice identity

- Slice ID: `Slice 7`
- Slice name: `Public API hardening`
- Tracking owner: `V2 migration squad`
- Slice start date: `2026-07-05`
- Planned completion date: `2026-07-05`
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
| `pnpm --filter @afenda/shadcn-studio-v2 test` | PASS: boundary tests prove no wildcard re-exports, client boundary independence, server config/type-only exports, and metadata surface isolation | `packages/shadcn-studio-v2/src/__tests__/public-api-hardening.test.ts` |
| `pnpm --filter @afenda/shadcn-studio-v2 typecheck` | PASS: public entrypoint contracts resolve by surface | `packages/shadcn-studio-v2/tsconfig.json` |
| `pnpm --filter @afenda/shadcn-studio-v2 build` | PASS: package emits verified boundary declarations | `packages/shadcn-studio-v2/dist` |
| `pnpm exec biome ci packages/shadcn-studio-v2` | PASS: boundary implementation, tests, and docs are format/lint clean | `packages/shadcn-studio-v2` |

## 7) Risk register

| Risk | Probability / impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- |
| client surface exports server-only code | Medium / High | Add leakage tests for `clients.ts` before promotion | V2 migration squad | Active |
| metadata exports leak through neutral root surface | Medium / Medium | Require each `index.ts` export to have neutral shared intent | V2 migration squad | Active |

## 8) Open questions / assumptions

- Assumption: package build is available by the time this slice is executed; if not, Gate F remains explicitly deferred with owner approval.
- Decision: root, client, server, and metadata surfaces stay explicit and symbol-level rather than folder-level.

## 9) Implementation summary

- Kept all public boundary files free of wildcard re-exports.
- Kept `clients.ts` independent from `index.ts`, `server.ts`, and `metadata.ts`.
- Kept `server.ts` config/type-only and free of components, views, hooks, contexts, and metadata React surfaces.
- Kept `metadata.ts` isolated from root/client/server React surfaces.

## 10) Exit checklist

- Verified: export maps are strict by surface.
- Verified: leakage tests exist for client/server/metadata boundaries.
- Verified: Gate D/E/F evidence is captured with no deferral required.

## 11) Post-verification stabilization review

- Review result: `PASS`
- Public surfaces remain explicit and auditable.
- Client, server, and metadata boundaries remain independently owned.
- No convenience-barrel behavior re-entered the package boundary.
- Slice 8 entry condition is satisfied from verified public API hardening.

## 12) Slice 8 Preparation Note

- Slice 8 may prove one package-local consumer pilot through public V2 entrypoints only.
- Slice 8 must not deep-import components, views, contexts, or metadata internals.
- Legacy studio and ERP remain out of scope for this package-local pilot proof.
