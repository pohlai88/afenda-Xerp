# Slice PAS-001A-R1b — Protected App Router Shell (ADR-0027)

> **Position:** R1 slice `2 of 4` in PAS-001A skeleton rebuild · Blueprint box: `ERP Integration Spine`

**Prerequisite:** R1a Delivered

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/pas-001a-r1b-protected-app-router-shell.md

1. Objective    — Protected App Router shell consumes governed auth actor ingress on skeleton ERP.
2. Allowed layer— apps/erp/src/app/(protected)/** · apps/erp/src/lib/context/** · scripts/governance/check-erp-auth-actor-protected-path-attestation.mts
3. Files        —
   apps/erp/src/app/(protected)/layout.tsx
   apps/erp/src/lib/context/operating-context-protected-surface.registry.ts
   scripts/governance/check-erp-auth-actor-protected-path-attestation.mts
4. Prohibited   — Unauthenticated protected routes · raw identity.userId actor ingress
5. Authority    — PAS-001A §4.2 · B110 gate · ADR-0027
6. Gates        —
   pnpm check:erp-auth-actor-protected-path-attestation
   pnpm --filter @afenda/erp typecheck
7. Closes       — Protected shell actor attestation (maps to B110)
8. Evidence     —
   apps/erp/src/app/(protected)/layout.tsx
   scripts/governance/check-erp-auth-actor-protected-path-attestation.mts
9. Attestation  — Gate · Security · Integration
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Protected layout uses session actor resolver | pnpm check:erp-auth-actor-protected-path-attestation | PAS-001A §6.1 row 4 |
| 2 | Protected surface registry on disk | file read operating-context-protected-surface.registry.ts | IS-002 |
| 3 | API + server action paths use auth wire | pnpm check:erp-auth-actor-protected-path-attestation | INV-003 |
