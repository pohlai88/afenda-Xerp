# ARCH-SUPA-001 · Slice 8 — Pool routing registry wiring

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-SUPA-001`](../../%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) |
| **Slice** | 8 |
| **Status** | **Delivered** (2026-06-25) |
| **Prerequisite** | Slice 7 ✓ |
| **Slice type** | Implementation |
| **Classification** | **P1 hardening** |
| **Runtime owner** | `packages/database/src/` |
| **Closes** | Pool → `DATABASE_CONNECTION_ROUTING` enforcement |

---

## Design (internal-guide)

- `createPgPool` defaults to `resolveDatabaseUrlForConsumer("platform-db-pool")`.
- `createAuthDbClient` passes `connectionConsumer: "auth-db-pool"`.
- Optional `connectionConsumer` on `CreatePgClientOptions`; explicit `connectionString` still wins.
- Behavior unchanged (both consumers use transaction pooler); registry is now enforced at runtime.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-SUPA-001/slice-08-pool-routing-registry-wiring.md

1. Objective    — Wire governed Postgres pools to resolveDatabaseUrlForConsumer registry consumers (ARCH-SUPA-001 P1).
2. Allowed layer— packages/database/src/
3. Files        — packages/database/src/pool.ts (Modified)
                  packages/database/src/auth-db.ts (Modified)
                  packages/database/src/client.types.ts (Modified)
                  packages/database/src/__tests__/pool.test.ts (New)
                  packages/database/src/supabase/__tests__/connection-routing.contract.test.ts (Modified)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-08-pool-routing-registry-wiring.md (Modified — status)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-index.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — gap closed)
4. Prohibited   — apps/* · packages/ui · @afenda/accounting
5. Authority    — ARCH-SUPA-001 §7 · Database authority
6. Gates        — pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
```

---

## Completion evidence (2026-06-25)

- `pool.test.ts` — default `platform-db-pool`, `auth-db-pool` consumer, explicit override
- `@afenda/database` test:run — 196 pass
