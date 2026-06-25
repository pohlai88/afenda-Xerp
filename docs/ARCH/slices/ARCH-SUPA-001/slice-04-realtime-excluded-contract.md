# ARCH-SUPA-001 · Slice 4 — Realtime excluded contract

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-SUPA-001`](../../%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) |
| **Status** | **Delivered** (2026-06-25) |
| **Prerequisite** | Slice 1 ✓ |
| **Slice type** | Governance / Evidence |
| **Classification** | **P2 — Excluded from current production release** |
| **Runtime owner** | `packages/database/src/supabase/` |
| **Closes** | ARCH P2 Realtime exclusion · accidental adoption gate |

---

## Production scope decision

Supabase Realtime is **not in current production release scope**.  
Requires separate ARCH/FDR approval before implementation.  
No Realtime runtime code may be added in this work item.

Reason: No approved live-update ERP workload requires Supabase Realtime. Server-rendered state, outbox evidence, and approved notification infrastructure remain authoritative.

---

## Design (internal-guide)

- Add `SUPABASE_EXCLUDED_PRODUCTION_CAPABILITIES` registry including `realtime`, `edge_functions`, `database_webhooks`, `gotrue_identity`.
- Governance test scans `apps/erp/src` for forbidden `@supabase/realtime-js` / Realtime channel imports in production paths.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-SUPA-001/slice-04-realtime-excluded-contract.md

1. Objective    — Lock P2 exclusion registry for Supabase Realtime and related excluded capabilities with governance scan (ARCH-SUPA-001 P2 — no Realtime runtime).
2. Allowed layer— packages/database/src/supabase/
3. Files        — packages/database/src/supabase/excluded-production-capabilities.contract.ts (New)
                  packages/database/src/supabase/__tests__/excluded-production-capabilities.contract.test.ts (New)
                  packages/database/src/public-api.ts (Modified)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-04-realtime-excluded-contract.md (Modified — status)
4. Prohibited   — Implementing Realtime channels · apps/erp Realtime wiring · @afenda/accounting
5. Authority    — ARCH-SUPA-001 §Production release scope decision
6. Gates        — pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm check:documentation-drift
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 15 | Security / exclusion verified | contract test |
