# ARCH-SUPA-001 · Slice 1 — Connection routing registry

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-SUPA-001`](../../%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) |
| **Status** | **Delivered** (2026-06-25) |
| **Prerequisite** | ARCH-SUPA-001 authority doc authored |
| **Slice type** | Implementation |
| **Classification** | **P0 — Production mandatory** |
| **Runtime owner** | `packages/database/src/supabase/` |
| **Closes** | ARCH §Production release scope · connection routing contract · DoD #1–6 |

---

## Design (internal-guide)

- Add canonical `DATABASE_CONNECTION_ROUTING` registry mapping `DatabaseConnectionConsumer` → `SupabaseConnectionMethod`.
- Export `resolveConnectionMethodForConsumer` and `resolveDatabaseUrlForConsumer` — no duplicated URL builders outside `env.ts`.
- Document current runtime: `platform-db-pool` and `auth-db-pool` use **transaction** pooler (Vercel/serverless default via `getDatabaseUrl()`).
- Migrations and live RLS probes use **direct** connection.
- Add contract tests; export from `public-api.ts`.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-SUPA-001/slice-01-connection-routing-registry.md

1. Objective    — Lock typed Supabase Postgres connection routing registry for every Afenda database consumer (ARCH-SUPA-001 P0).
2. Allowed layer— packages/database/src/supabase/
3. Files        — packages/database/src/supabase/connection-routing.contract.ts (New)
                  packages/database/src/supabase/__tests__/connection-routing.contract.test.ts (New)
                  packages/database/src/public-api.ts (Modified)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-01-connection-routing-registry.md (Modified — status)
                  docs/ARCH/[Complete] ARCH-SUPA-001-supabase-platform-architecture.md (Modified — Slice 1 evidence)
4. Prohibited   — packages/auth identity changes · PostgREST · Supabase Auth · hand-edited migrations · @afenda/accounting · any
5. Authority    — ARCH-SUPA-001 · fdr-003-persistence · fdr-003-tenant-rls · packages/database/src/env.ts
6. Gates        — pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm exec biome check packages/database/src/supabase
                  pnpm check:documentation-drift
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | contract + tests |
| 5 | TypeScript strict passes | typecheck |
| 6 | Package tests pass | test:run |
