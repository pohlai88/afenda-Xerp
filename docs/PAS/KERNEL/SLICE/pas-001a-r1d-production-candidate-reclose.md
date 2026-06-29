# Slice PAS-001A-R1d — Production Candidate Re-close (ADR-0027)

> **Position:** R1 slice `4 of 4` in PAS-001A skeleton rebuild · Blueprint box: `ERP Integration Spine`

**Prerequisite:** R1a–R1c Delivered

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-r1d-production-candidate-reclose.md

1. Objective    — Re-close PAS-001A Production Candidate at 10/10 on ADR-0027 skeleton; sync pas-status-index and PAS-001A §6.1.
2. Allowed layer— docs/PAS/** · .cursor/skills/kernel-authority/SKILL.md · scripts/governance/**
3. Files        —
   docs/PAS/pas-status-index.md
   docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md
   docs/PAS/KERNEL/SLICE/pas-001a-r1d-production-candidate-reclose.md
   .cursor/skills/kernel-authority/SKILL.md
4. Prohibited   — Reopening PAS-001 vocabulary · kernel contract expansion
5. Authority    — PAS-001A §6 · §6.1 · documentation-drift
6. Gates        —
   Full PAS-001A §6.1 skeleton gate bundle (below)
   pnpm check:documentation-drift
   pnpm check:kernel-slice-catalog-consistency
7. Closes       — PAS-001A R1 family · IS-002 + IS-003 integration-proven on skeleton
8. Evidence     —
   docs/PAS/pas-status-index.md
   PAS-001A §6.1 scorecard (10/10)
   R1d attestation appendix gate output
9. Attestation  — Governance · Documentation · Observability
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | §6.1 skeleton matrix 10/10 green | Gate bundle below | PAS-001A §6.1 |
| 2 | pas-status-index R1 family closed | pnpm check:documentation-drift | Header sync rule |
| 3 | Slice catalog ↔ status index aligned | pnpm check:kernel-slice-catalog-consistency | PAS-001 audit |

## R1d attestation appendix (archived gate bundle 2026-06-29)

| # | Gate | Purpose |
| --- | --- | --- |
| 1 | `pnpm check:permission-scope-permissions-surface` | IS-001 permission wire triad |
| 2 | `pnpm quality:kernel-context-surface` | Kernel no permission-scope parser |
| 3 | `pnpm check:erp-operating-context-spine` | IS-002 spine wiring |
| 4 | `pnpm check:erp-auth-actor-protected-path-attestation` | Runtime ingress / actor |
| 5 | `pnpm quality:boundaries` | Anti-corruption |
| 6 | `pnpm --filter @afenda/erp test:run` | Integration tests |
| 7 | `pnpm check:erp-metadata-pas006-consumer` | IS-003 metadata consumer |
| 8 | `pnpm check:erp-tenant-lifecycle-extension-consumer-attestation` | B111 consumer |
| 9 | `pnpm check:metadata-permission-model-parity` | Kernel ↔ ERP metadata permission vocabulary |
| 10 | `pnpm check:metadata-policy-parity` | Kernel ↔ ERP metadata policy vocabulary |
| 11 | `pnpm check:documentation-drift` | Doc drift |
| 12 | `pnpm check:kernel-slice-catalog-consistency` | Slice catalog SSOT |

**Score:** 10/10 acceptance criteria green on ADR-0027 skeleton (rows 1–10 map to PAS-001A §6.1; rows 11–12 are governance closure).
