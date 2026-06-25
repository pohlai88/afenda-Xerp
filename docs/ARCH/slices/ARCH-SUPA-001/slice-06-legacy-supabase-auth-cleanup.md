# ARCH-SUPA-001 · Slice 6 — Legacy Supabase Auth ops cleanup

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-SUPA-001`](../../%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) |
| **Status** | **Delivered** (2026-06-25) |
| **Prerequisite** | Slice 1 ✓ |
| **Slice type** | Implementation |
| **Classification** | **P1 — Production hardening** |
| **Runtime owner** | `scripts/ops/` |
| **Closes** | ARCH P1 GoTrue ambiguity · ops-only redirect script boundary |

---

## Design (internal-guide)

- Refactor `supabase-auth-redirects.mjs`: derive `PROJECT_REF` from `SUPABASE_PROJECT_REF` / env-utils — remove hardcoded project ref.
- Add header: **ops-only** — Better Auth is ERP identity (ADR-004); script mutates Supabase GoTrue redirect allowlist for infrastructure only.
- Add `--dry-run` flag; default documents patch without applying unless `--apply`.
- Add governance test for env parsing.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-SUPA-001/slice-06-legacy-supabase-auth-cleanup.md

1. Objective    — Bound legacy Supabase Auth redirect ops script as infrastructure-only; remove hardcoded project ref (ARCH-SUPA-001 P1).
2. Allowed layer— scripts/ops/
3. Files        — scripts/ops/supabase-auth-redirects.mjs (Modified)
                  scripts/governance/__tests__/supabase-auth-redirects.test.ts (New)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-06-legacy-supabase-auth-cleanup.md (Modified — status)
4. Prohibited   — Using GoTrue as ERP identity · apps/erp auth changes · @afenda/accounting
5. Authority    — ARCH-SUPA-001 · packages/auth/docs/auth-provider-decision.md (ADR-004)
6. Gates        — pnpm exec vitest run scripts/governance/__tests__/supabase-auth-redirects.test.ts
                  pnpm check:documentation-drift
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 15 | Identity boundary documented | script header + test |
| 14 | Rollback safe | dry-run default |
