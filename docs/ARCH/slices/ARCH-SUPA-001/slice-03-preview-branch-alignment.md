# ARCH-SUPA-001 · Slice 3 — Preview branch alignment

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-SUPA-001`](../../%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) |
| **Status** | **Delivered** (2026-06-25) |
| **Prerequisite** | Slice 1 ✓ |
| **Slice type** | Implementation |
| **Classification** | **P1 — Production hardening** |
| **Runtime owner** | `scripts/ops/` |
| **Closes** | ARCH P1 deployment discipline · Vercel preview ↔ Supabase branch ops |

---

## Design (internal-guide)

- Add `scripts/ops/supabase-preview-branch.mjs` — documents and validates preview branch workflow (read `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` from merged env).
- Does not auto-mutate production; prints MCP/CLI steps for `create_branch` / `merge_branch`.
- Add ops test for env parsing and help output.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-SUPA-001/slice-03-preview-branch-alignment.md

1. Objective    — Provide governed Supabase preview branch ops script for Vercel preview deployment discipline (ARCH-SUPA-001 P1).
2. Allowed layer— scripts/ops/
3. Files        — scripts/ops/supabase-preview-branch.mjs (New)
                  scripts/governance/__tests__/supabase-preview-branch.test.ts (New)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-03-preview-branch-alignment.md (Modified — status)
4. Prohibited   — packages/* · auto branch creation without explicit --apply flag · @afenda/accounting
5. Authority    — ARCH-SUPA-001 · Supabase MCP branch tools · env-workflow.mdc
6. Gates        — pnpm exec vitest run scripts/governance/__tests__/supabase-preview-branch.test.ts
                  pnpm check:documentation-drift
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 13 | Impact analysis / ops documented | script + test |
