# Slice P06-009 — Surface Template Registry (PAS-006D)

> **Position:** Slice `9 of 10` · Blueprint box: **shadcn/studio Presentation**

**Prerequisite:** P06-008 Delivered

**Status:** Delivered

**Type:** Implementation

## Handoff block

```
Handoff from: docs/PAS/PRESENTATION/SLICE/p06-009-surface-template-registry.md

1. Objective    — Surface template registry composing Accepted blocks + metadata binding refs.
2. Allowed layer— packages/shadcn-studio only
3. Files        —
   packages/shadcn-studio/src/registry/surface-template.registry.ts
   packages/shadcn-studio/src/contracts/surface-template.contract.ts
   packages/shadcn-studio/src/__tests__/surface-template.registry.test.ts
   packages/shadcn-studio/src/index.ts
4. Prohibited   — ERP route handlers · metadata DB schema · un-Accepted blocks in templates
5. Authority    — PAS-006D §3
6. Gates        —
   pnpm --filter @afenda/shadcn-studio typecheck
   pnpm --filter @afenda/shadcn-studio test:run
7. Closes       — Closes DoD #1–#2
8. Evidence     —
   packages/shadcn-studio/src/registry/surface-template.registry.ts
   packages/shadcn-studio/src/contracts/surface-template.contract.ts
9. Attestation  — Contract · Test
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Surface template wire contract serializable | `surface-template.registry.test.ts` |
| 2 | Templates reference metadata binding id | `surface-template.registry.test.ts` |
