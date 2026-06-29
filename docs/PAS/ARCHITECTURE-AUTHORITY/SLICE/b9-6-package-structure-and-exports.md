# Slice B9 — Package Structure and Exports (PAS-002 §6)

**Prerequisite:** Slices B1–B8 Delivered · runtime §4.1–§4.12 on disk

**Status:** Delivered

**Type:** Governance

**Risk class:** Low

**Clean Core impact:** A→A (layout contract + filesystem acceptance tests — no validator behavior change)

## Purpose

Formalize PAS-002 §6 package structure and export governance:

1. Typed layout contract for §6.1 top-level folders, §6.2 target paths, §6.3 forbidden structure, and `./surface` subpath export.
2. Filesystem acceptance tests mirroring kernel Slice B16 pattern.
3. Public export of `ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_POLICY` from `@afenda/architecture-authority`.
4. Closure row in `pas-status-index.md` and PAS-002 §12 B9 **Delivered**.

## Handoff block

```
Handoff from: docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b9-6-package-structure-and-exports.md

1. Objective    — Implement PAS-002 §6 package structure governance: layout contract, package-structure tests, public layout policy export, slice doc, pas-status-index closure.
2. Allowed layer— packages/architecture-authority/src/contracts/ + packages/architecture-authority/src/__tests__/ + packages/architecture-authority/src/index.ts + docs/PAS/
3. Files        —
   packages/architecture-authority/src/contracts/architecture-authority-package-layout.contract.ts (CREATE)
   packages/architecture-authority/src/__tests__/package-structure.test.ts (CREATE)
   packages/architecture-authority/src/index.ts (MODIFY)
   docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b9-6-package-structure-and-exports.md (CREATE)
   docs/PAS/pas-status-index.md (MODIFY)
   docs/PAS/ARCHITECTURE-AUTHORITY/PAS-002-ARCHITECTURE-AUTHORITY.md (MODIFY — §12 B9 row)
   .cursor/skills/architecture-authority/reference/package-structure.md (MODIFY — layout contract source)
4. Prohibited   — new subpath exports without contract registration; forbidden §6.3 folders; apps/erp; kernel ID semantics; foundation-disposition.registry.ts edits
5. Authority    — PAS-002 §6 · architecture-authority/reference/package-structure.md · architecture-authority skill
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm check:architecture-authority-surface
   pnpm quality:architecture
7. Closes       — PAS-002 §12 B9 Target → Delivered; missing typed §6 layout contract; missing package-structure acceptance tests
8. Evidence     —
   packages/architecture-authority/src/contracts/architecture-authority-package-layout.contract.ts
   packages/architecture-authority/src/__tests__/package-structure.test.ts
   docs/PAS/pas-status-index.md (PAS-002 B9 row)
9. Attestation  — Contract · Test · Governance · Documentation
```

## Rules frozen

1. Current tree under `packages/architecture-authority/src/` is source truth; contract lists additive target paths only.
2. Approved top-level folders: `contracts`, `data`, `validators`, `surface`, `workspace`, `reports`, `__tests__`.
3. Only `index.ts` at `src/` root; subpath export `./surface` only (root `.` implicit).
4. Forbidden §6.3 folders must remain absent (`app/`, `components/`, `routes/`, `db/`, business module dirs).
5. Surface registry remains machine index for data/validator modules — layout contract does not duplicate module lists.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Layout contract exported from package root | `index.ts` + typecheck |
| 2 | All §6.1 top-level folders on disk | `package-structure.test.ts` |
| 3 | All §6.2 target paths on disk | `package-structure.test.ts` |
| 4 | All §6.3 forbidden paths absent | `package-structure.test.ts` |
| 5 | `package.json` exports match contract | `package-structure.test.ts` |
| 6 | Surface gate still green | `pnpm check:architecture-authority-surface` |

## Runtime evidence

| Surface | Path |
| --- | --- |
| Layout contract | `contracts/architecture-authority-package-layout.contract.ts` |
| Layout policy export | `ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_POLICY` via `@afenda/architecture-authority` |
| Filesystem tests | `__tests__/package-structure.test.ts` |
| Surface gate | `pnpm check:architecture-authority-surface` |
| Skill reference | `.cursor/skills/architecture-authority/reference/package-structure.md` |
