# Slice B108 — Tenant Extension Boundary Wire (PAS-001 amendment)

> **Position:** Amendment slice 2 of 5 in PAS-001 · Blueprint box: `Kernel Vocabulary`

**Prerequisite:** B107 Delivered

**Status:** Delivered (2026-06-29)

**Type:** Implementation

## Handoff block

```
Handoff from: docs/PAS/KERNEL/SLICE/b108-tenant-extension-boundary-wire.md

1. Objective    — Deliver tenant extension boundary wire triad (non-authoritative extension keys).
2. Allowed layer— packages/kernel/src/context/tenant-extension-boundary.* · docs/PAS/KERNEL/**
3. Files        —
   packages/kernel/src/context/tenant-extension-boundary.contract.ts
   packages/kernel/src/context/tenant-extension-boundary.assert.ts
   packages/kernel/src/context/tenant-extension-boundary.parser.ts
4. Prohibited   — apps/erp/** · tenant configuration stores
5. Authority    — PAS-001 §4 · Kernel NS I6 · kernel-authority
6. Gates        —
   pnpm check:kernel-context-wire-triad
   pnpm --filter @afenda/kernel test:run
7. Closes       — Tenant extension boundary wire contracts
8. Evidence     — packages/kernel/src/context/__tests__/tenant-extension-boundary.test.ts
9. Attestation  — Contract · Test · Governance
```

## DoD

| # | Criterion | Gate | Traces to EFR/EAC |
| --- | --- | --- | --- |
| 1 | Extension boundary wire triad on disk | pnpm check:kernel-context-wire-triad | PAS-001 §4 extension boundary |
| 2 | Canonical ID fork rejected at assert | pnpm --filter @afenda/kernel test:run | Kernel NS I6 |
