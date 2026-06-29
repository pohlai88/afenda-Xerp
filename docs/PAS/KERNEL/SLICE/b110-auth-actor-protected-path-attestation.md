# Slice B110 — Auth Actor Protected Path Attestation (PAS-001 amendment)

> **Position:** Amendment slice 4 of 5 in PAS-001 · Blueprint box: `Kernel Vocabulary` + ERP consumer proof

**Prerequisite:** B109 Delivered

**Status:** Delivered (2026-06-29)

**Type:** Evidence-sync

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b110-auth-actor-protected-path-attestation.md

1. Objective    — ERP protected-path actor ingress attestation on ADR-0027 skeleton via @afenda/auth wire.
2. Allowed layer— scripts/governance/check-erp-auth-actor-protected-path-attestation.mts · apps/erp/src/lib/context/** · apps/erp/src/lib/metadata/** · apps/erp/src/app/(protected)/**
3. Files        —
   scripts/governance/check-erp-auth-actor-protected-path-attestation.mts
   scripts/governance/__tests__/check-erp-auth-actor-protected-path-attestation.test.ts
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/metadata/resolve-metadata-auth-actor.server.ts
   apps/erp/src/app/(protected)/layout.tsx
4. Prohibited   — Kernel actor evaluation · raw session userId without auth wire ingress
5. Authority    — PAS-001 §4 actor vocabulary · PAS-001A R1b · ADR-0027 skeleton
6. Gates        —
   pnpm check:erp-auth-actor-protected-path-attestation
   pnpm --filter @afenda/erp test:run
   pnpm --filter @afenda/erp typecheck
7. Closes       — Auth actor protected-path consumer attestation (B110 / R1b gate)
8. Evidence     —
   scripts/governance/check-erp-auth-actor-protected-path-attestation.mts
   apps/erp/src/lib/context/context-integration-registry.ts
   apps/erp/src/lib/metadata/__tests__/resolve-metadata-auth-actor.server.test.ts
9. Attestation  — Gate · Integration · Security
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Protected layout resolves actor via auth wire | pnpm check:erp-auth-actor-protected-path-attestation | PAS-001A INV-003 |
| 2 | Forbidden raw identity.userId ingress rejected | pnpm check:erp-auth-actor-protected-path-attestation | ADR-0027 skeleton |
| 3 | AUTH_ACTOR_BRIDGE_WIRING registry entries verified | pnpm check:erp-auth-actor-protected-path-attestation | PAS-001A IS-002 |
