# ARCH-SUPA-001 · Slice 9 — Supabase advisors governance gate

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-SUPA-001`](../../%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md) |
| **Slice** | 9 |
| **Status** | **Delivered** (2026-06-25) |
| **Prerequisite** | Slice 7 ✓ · waiver SUPA-P1-ADVISORS-001 Accepted |
| **Slice type** | Implementation |
| **Classification** | **P1 hardening** |
| **Runtime owner** | `scripts/governance/` |
| **Closes** | SUPA-P1-ADVISORS-001 operator automation path |

---

## Design (internal-guide)

- `pnpm check:supabase-advisors` fetches security + performance advisors via Management API.
- Fails on ERROR/CRITICAL lints when `SUPABASE_ACCESS_TOKEN` is configured.
- `--skip-missing-token` for local dev; `--report` emits JSON for release evidence.
- Waiver **SUPA-P1-ADVISORS-001** remains **Accepted** — mandatory CI wiring is operator/release pipeline responsibility; script satisfies runbook automation path.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-SUPA-001/slice-09-supabase-advisors-governance.md

1. Objective    — Add Supabase advisor governance gate for SUPA-P1-ADVISORS-001 operator runbook (ARCH-SUPA-001 P1).
2. Allowed layer— scripts/governance/ · package.json scripts
3. Files        — scripts/governance/supabase-advisors-governance.mjs (New)
                  scripts/governance/check-supabase-advisors.mjs (New)
                  scripts/governance/__tests__/supabase-advisors-governance.test.ts (New)
                  scripts/governance/__tests__/check-supabase-advisors.test.ts (New)
                  package.json (Modified — check:supabase-advisors)
                  docs/ARCH/[Complete] ARCH-SUPA-001-supabase-platform-architecture.md (Modified — §12)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-09-supabase-advisors-governance.md (Modified — status)
                  docs/ARCH/slices/ARCH-SUPA-001/slice-index.md (Modified)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified)
4. Prohibited   — packages/* runtime · weakening ERROR gate · @afenda/accounting
5. Authority    — ARCH-SUPA-001 §12 · SUPA-P1-ADVISORS-001
6. Gates        — pnpm exec vitest run scripts/governance/__tests__/supabase-advisors-governance.test.ts
                  pnpm exec vitest run scripts/governance/__tests__/check-supabase-advisors.test.ts
                  pnpm check:documentation-drift
```

---

## Operator runbook (release)

1. Before production cutover: `pnpm check:supabase-advisors --report > release-evidence/supabase-advisors.json`
2. After migration batches: re-run gate; attach JSON to batch sign-off
3. Quarterly platform review: re-run gate; record in platform review notes
4. Local dev without secrets: `pnpm check:supabase-advisors --skip-missing-token`

---

## Completion evidence (2026-06-25)

- Unit tests for lint classification + Management API fetch
- CLI `--help` smoke test
