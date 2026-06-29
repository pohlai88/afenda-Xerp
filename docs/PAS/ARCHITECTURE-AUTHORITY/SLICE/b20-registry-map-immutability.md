# Slice B20 — Registry Lookup Map Immutability (PAS-002 §6.3)

**Prerequisite:** Slice B18 — disposition row (`docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b18-pkgr02-architecture-authority-disposition.md`, `Status: Delivered`)

**Status:** Delivered (2026-06-27)

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A — immutability wrapper on public lookup maps only

## Purpose

Public registry exports `packageByName` and `ownershipByPackage` were mutable `Map` instances. Freeze runtime mutation while preserving read-only lookup semantics per enterprise registry discipline.

## Handoff block

```
Handoff from: docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b20-registry-map-immutability.md

1. Objective    — Wrap public registry lookup maps with createReadonlyLookupMap; export ReadonlyMap types; add immutability tests.
2. Allowed layer— packages/architecture-authority/src/data/ (+ __tests__/)
3. Files        —
   packages/architecture-authority/src/data/create-readonly-lookup-map.ts
   packages/architecture-authority/src/data/package-registry.data.ts
   packages/architecture-authority/src/data/ownership-registry.data.ts
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   packages/architecture-authority/src/__tests__/registry-lookup-map.test.ts
   docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b20-registry-map-immutability.md
4. Prohibited   — foundation-disposition.registry.ts entry mutations (B18 only); apps/erp; packages/kernel
5. Authority    — PAS-002 §6.3 · architecture-authority skill
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm quality:architecture
7. Closes       — Mutable public Map exports on package/ownership/disposition lookups
8. Evidence     —
   packages/architecture-authority/src/__tests__/registry-lookup-map.test.ts
9. Attestation  — Contract · Test
```

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | `.set()` throws on packageByName | test:run |
| 2 | `.set()` throws on ownershipByPackage | test:run |
| 3 | Read lookups unchanged | test:run |
