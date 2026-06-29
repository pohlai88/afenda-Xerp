# Slice B113 — Actor Kind and Integration Identity Vocabulary (PAS-001 amendment)

> **Position:** Amendment slice 6 in PAS-001 iteration 2 · Blueprint box: `Kernel Vocabulary` · Kernel NS E12

**Prerequisite:** B111 Delivered

**Status:** Delivered (2026-06-30)

**Type:** Implementation

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b113-actor-kind-integration-identity-vocabulary.md

1. Objective    — Deliver actor kind and integration identity wire vocabulary on AuthActorIdentity (E12).
2. Allowed layer— packages/kernel/src/identity/wire/** · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/identity/wire/actor-kind.contract.ts
   packages/kernel/src/identity/wire/integration-identity.contract.ts
   packages/kernel/src/identity/wire/auth-actor-identity.contract.ts
   packages/kernel/src/identity/wire/index.ts
   packages/kernel/src/identity/wire/__tests__/actor-kind-integration-identity.contract.test.ts
   packages/kernel/src/identity/wire/__tests__/auth-actor-identity.contract.test.ts
4. Prohibited   — apps/erp/** · auth session resolution · OAuth/token runtime in kernel
5. Authority    — PAS-001 §4.1.11 · Kernel NS §3.1 · E12 · kernel-authority
6. Gates        —
   pnpm check:kernel-identity-governance
   pnpm --filter @afenda/kernel test:run
   pnpm --filter @afenda/kernel typecheck
7. Closes       — Actor kind and integration identity vocabulary (E12)
8. Evidence     —
   packages/kernel/src/identity/wire/__tests__/actor-kind-integration-identity.contract.test.ts
   packages/kernel/src/identity/wire/__tests__/auth-actor-identity.contract.test.ts
9. Attestation  — Contract · Test · Governance
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | ACTOR_KINDS governed set on disk | pnpm --filter @afenda/kernel test:run | Kernel NS E12 |
| 2 | IntegrationIdentity ingress rejects canonical enterprise IDs | pnpm --filter @afenda/kernel test:run | PAS-001 §4.1.11 |
| 3 | AuthActorIdentity actorKind/integrationIdentity/userId consistency | pnpm --filter @afenda/kernel test:run | E12 bridge |
| 4 | Identity wire exports include actor/integration contracts | pnpm check:kernel-identity-governance | PAS-001 §6 |
