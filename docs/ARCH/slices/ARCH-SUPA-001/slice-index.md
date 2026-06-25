# ARCH-SUPA-001 — Slice index

> Parent authority: [`ARCH-SUPA-001`](../../%5BComplete%5D%20ARCH-SUPA-001-supabase-platform-architecture.md)  
> Paired FDR: [`fdr-003-persistence`](../../../delivery/FDR/%5BPartially%20Implemented%5D%20fdr-003-persistence.md) · [`fdr-003-tenant-rls`](../../../delivery/FDR/%5BComplete%5D%20fdr-003-tenant-rls.md)

## Status

**Complete — enterprise 9.5 accepted** (29/30) · DoD #20 closed 2026-06-25 · Slices 1–9 delivered

## Production closeout path (P0 + P1)

| Slice | Title | Classification | Status |
| ---: | --- | --- | --- |
| 1 | Connection routing registry | **P0 mandatory** | **Delivered** (2026-06-25) |
| 2 | Supabase env advisory in env-doctor | **P1 hardening** | **Delivered** (2026-06-25) |
| 3 | Preview branch alignment | **P1 hardening** | **Delivered** (2026-06-25) |
| 6 | Legacy Supabase Auth ops cleanup | **P1 hardening** | **Delivered** (2026-06-25) |
| 7 | Complete promotion (DoD #20) | Evidence-sync | **Delivered** (2026-06-25) |
| 8 | Pool routing registry wiring | **P1 hardening** | **Delivered** (2026-06-25) |
| 9 | Supabase advisors governance gate | **P1 hardening** | **Delivered** (2026-06-25) |

## P2 — Excluded from current production release (governance delivered)

| Slice | Title | Classification | Status |
| ---: | --- | --- | --- |
| 4 | Realtime excluded contract | **P2 excluded** | **Delivered** (2026-06-25) |
| 5 | Supabase Storage additional option | **P2 excluded** | **Delivered** (2026-06-25) |

## Slice files

| Slice | Handoff file |
| ---: | --- |
| 1 | [`slice-01-connection-routing-registry.md`](slice-01-connection-routing-registry.md) |
| 2 | [`slice-02-env-doctor-supabase-advisory.md`](slice-02-env-doctor-supabase-advisory.md) |
| 3 | [`slice-03-preview-branch-alignment.md`](slice-03-preview-branch-alignment.md) |
| 4 | [`slice-04-realtime-excluded-contract.md`](slice-04-realtime-excluded-contract.md) |
| 5 | [`slice-05-supabase-storage-additional-option.md`](slice-05-supabase-storage-additional-option.md) |
| 6 | [`slice-06-legacy-supabase-auth-cleanup.md`](slice-06-legacy-supabase-auth-cleanup.md) |
| 7 | [`slice-07-complete-promotion.md`](slice-07-complete-promotion.md) |
| 8 | [`slice-08-pool-routing-registry-wiring.md`](slice-08-pool-routing-registry-wiring.md) |
| 9 | [`slice-09-supabase-advisors-governance.md`](slice-09-supabase-advisors-governance.md) |

## Next step

**None** — ARCH-SUPA-001 Complete. Revisit waiver **SUPA-P1-ADVISORS-001** at external beta go-live (wire `check:supabase-advisors` into release CI with secrets).
