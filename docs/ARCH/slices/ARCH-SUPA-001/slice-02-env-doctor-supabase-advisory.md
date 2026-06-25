# ARCH-SUPA-001 · Slice 2 — Supabase env advisory in env-doctor

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-SUPA-001`](../../%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) |
| **Status** | **Delivered** (2026-06-25) |
| **Prerequisite** | Slice 1 ✓ |
| **Slice type** | Implementation |
| **Classification** | **P1 — Production hardening** |
| **Runtime owner** | `scripts/` |
| **Closes** | ARCH P1 env doctor · pooler URL derivability · production promotion advisory |

---

## Design (internal-guide)

- Add `findSupabaseConnectionAdvisories(entries)` in `env-utils.mjs` — warnings only (non-blocking).
- Verify session + transaction + direct URLs derivable when Supabase config is ready.
- Emit P1 recommendation to run Supabase Dashboard advisors / MCP `get_advisors` before production 9.5 promotion.
- Wire into `env-doctor.mjs` warnings section.
- Add unit test in `scripts/governance/__tests__/`.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-SUPA-001/slice-02-env-doctor-supabase-advisory.md

1. Objective    — Extend env-doctor with Supabase connection advisories and production hardening warnings (ARCH-SUPA-001 P1).
2. Allowed layer— scripts/
3. Files        — scripts/env-utils.mjs (Modified)
                  scripts/env-doctor.mjs (Modified)
                  scripts/governance/__tests__/env-utils-supabase-advisory.test.ts (New)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-02-env-doctor-supabase-advisory.md (Modified — status)
4. Prohibited   — packages/* runtime · blocking errors for advisory-only checks · @afenda/accounting
5. Authority    — ARCH-SUPA-001 · env-workflow.mdc · supabase-postgres-best-practices skill
6. Gates        — pnpm exec vitest run scripts/governance/__tests__/env-utils-supabase-advisory.test.ts
                  pnpm env:doctor --sources-only
                  pnpm check:documentation-drift
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 8 | Env drift detection | env:doctor |
| 16 | Observability / advisory | advisory test |
