# Runtime Parity Track Completion

## Status

Complete — P1–P5 accepted; terminal authority posture in ADR-0044.

## Objective

Close the governed runtime-parity track for `apps/developer` without wiring
live auth, kernel spine, database, or platform BFF into the sandbox.

## Completed Slices

| Slice | Capability | Key evidence |
|---|---|---|
| P1 | Route Handlers | `GET /api/lab/v1/health`, `lab-api-route-registry.ts` |
| P2 | Server Actions | `save-appearance-review-note.server.ts`, `lab-action-route-registry.ts` |
| P3 | Cache strategy | `create-cached-lab-loader.server.ts`, `lab-cache-route-registry.ts` |
| P4 | Request policy | `src/proxy.ts`, `lab-request-policy-registry.ts` |
| P5 | Runtime authority | `resolve-lab-shell-operating-context.server.ts`, ADR-0044 |

## Terminal Posture (ADR-0044)

- Demo-fixture operating context only
- Empty BFF allowlist (`lab-bff-route-registry.ts`)
- No `@afenda/auth`, `@afenda/kernel`, `@afenda/database`, `@afenda/server`
- No `api/internal/v1/**`
- ERP promotion owns live spine; supersession requires a new ADR

## Post-ADR-0044 Activation (Not Sandbox Gaps)

| Track | Status | Authority |
| --- | --- | --- |
| `_queries/` seam | **Activated** on `/settings/appearance` (first governed read helper) | [ADR-0044](../../docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md) |
| ERP promotion | **Authorized** — execute in `apps/erp` per registry `promotionTarget: "erp-route"` | ADR-0044 §3 · ADR-0039 |

Live auth, kernel, and BFF remain **prohibited in the lab** (demo-fixture ceiling unchanged).

## Verification

```bash
node apps/developer/scripts/check-route-lab-governance.mjs
pnpm --dir apps/developer typecheck
pnpm --dir apps/developer verify:greenlight
```

Next.js MCP (dev port 3002): `nextjs_index` → `get_routes` → `get_errors` (P0: clean).

## Related Docs

- `docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
- `docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md`
- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
