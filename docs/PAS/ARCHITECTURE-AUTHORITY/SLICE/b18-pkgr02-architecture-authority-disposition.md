# Slice B18 — PKGR02 Architecture Authority Disposition Row (PAS-002 §0)

**Prerequisite:** Slice B21 — doc/runtime parity (`docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b21-14-doc-runtime-parity.md`, `Status: Delivered`)

**Status:** Delivered (2026-06-27)

**Type:** Registry-sync

**Risk class:** Low

**Clean Core impact:** A→A — foundation disposition registry row only

## Purpose

PAS-002 frontmatter declares `registry_lane: PKGR02_ARCHITECTURE_AUTHORITY`. Machine authority must include a matching `foundation-disposition.registry.ts` entry so subagents and `pnpm check:foundation-disposition` can resolve `@afenda/architecture-authority` disposition.

## Handoff block

```
Handoff from: docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b18-pkgr02-architecture-authority-disposition.md

1. Objective    — Add PKGR02_ARCHITECTURE_AUTHORITY disposition entry for PKG-019 @afenda/architecture-authority; sync foundation-disposition.md view; bump registry fingerprint.
2. Allowed layer— packages/architecture-authority/src/data/foundation-disposition.registry.ts + packages/architecture-authority/src/data/foundation-disposition.registry.ts + docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/
3. Files        —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b18-pkgr02-architecture-authority-disposition.md
   docs/PAS/ARCHITECTURE-AUTHORITY/PAS-002-ARCHITECTURE-AUTHORITY.md
4. Prohibited   — apps/erp; packages/kernel; validator logic changes; non-registry package src edits
5. Authority    — PAS-002 §0 · ADR-0014 · foundation-registry-owner
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm check:foundation-disposition
   pnpm check:documentation-drift
7. Closes       — Missing PKGR02_ARCHITECTURE_AUTHORITY machine disposition row
8. Evidence     —
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
   packages/architecture-authority/src/data/foundation-disposition.registry.ts
9. Attestation  — Registry · Documentation · Governance
```

## DoD

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | Entry id `PKGR02_ARCHITECTURE_AUTHORITY` exists with packageId PKG-019 | registry row |
| 2 | Fingerprint bumped | FOUNDATION-DISPOSITION-2026-06-27-v15 |
| 3 | foundation-disposition.md synced | table row present |
| 4 | Gates pass | check:foundation-disposition ✓ |
