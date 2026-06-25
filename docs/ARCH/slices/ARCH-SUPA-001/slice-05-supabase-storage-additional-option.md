# ARCH-SUPA-001 · Slice 5 — Supabase Storage additional option

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-SUPA-001`](../../%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) |
| **Status** | **Delivered** (2026-06-25) |
| **Prerequisite** | Slice 1 ✓ |
| **Slice type** | Governance / Evidence |
| **Classification** | **P2 — Excluded from current production release** |
| **Runtime owner** | `packages/storage/src/contracts/` |
| **Closes** | ARCH P2 storage decision · R2 remains production authority |

---

## Production scope decision

Supabase Storage is **not in current production release scope** as a deployed backend.  
**R2 via `@afenda/storage` remains the production object-binary authority.**

Supabase Storage is documented as an **additional approved backend option** — it **extends** the provider model; it **does not replace** R2.  
Implementation requires a separate storage ARCH/FDR extending `StorageProviderId` and provider adapters.

---

## Design (internal-guide)

- Add `STORAGE_PROVIDER_ADDITIONAL_OPTIONS` contract documenting approved-but-not-deployed providers (`supabase` as additional option only).
- Governance test: production `StorageProviderId` union must remain `blob | r2` until storage ARCH/FDR amends it.
- No Supabase Storage adapter runtime in this slice.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-SUPA-001/slice-05-supabase-storage-additional-option.md

1. Objective    — Document Supabase Storage as additional approved option without replacing R2; lock production provider union via contract test (ARCH-SUPA-001 P2).
2. Allowed layer— packages/storage/src/contracts/
3. Files        — packages/storage/src/contracts/storage-additional-providers.contract.ts (New)
                  packages/storage/src/__tests__/storage-additional-providers.contract.test.ts (New)
                  packages/storage/src/index.ts (Modified — export if needed)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-05-supabase-storage-additional-option.md (Modified — status)
4. Prohibited   — Replacing R2 · Supabase Storage adapter runtime · changing StorageProviderId union to include supabase · @afenda/accounting
5. Authority    — ARCH-SUPA-001 · @afenda/storage · OBJECT_STORAGE_* env spine
6. Gates        — pnpm --filter @afenda/storage typecheck
                  pnpm --filter @afenda/storage test:run
                  pnpm check:documentation-drift
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 17 | Public API compatibility | typecheck + provider union test |
