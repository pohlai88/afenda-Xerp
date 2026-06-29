# Slice B11 — Canonical Doc Registry Sync (PAS-002 §4.11 / surface gate)

**Prerequisite:** Slices B1–B10 Delivered · `@afenda/email` registered (PKG-022) · `@afenda/erp` → `@afenda/storage` in `dependency-registry.data.ts`

**Status:** Delivered

**Type:** Evidence-sync

**Risk class:** Low

**Clean Core impact:** A→A — human registry docs + generated snapshots aligned with machine registry; no runtime package behavior change

## Purpose

Close architecture-authority surface gate doc/registry drift:

1. Human registries include PKG-022 `@afenda/email` and 22 active workspace count.
2. `dependency-registry.md` documents `@afenda/erp` → `@afenda/storage` and `@afenda/email` summary row.
3. `layer-registry.md` assigns `@afenda/email` to Application layer.
4. Regenerate `architecture-report.json` and `dependency-snapshot.json` so committed artifacts match live validators (`violations: []`).

## Handoff block

```
Handoff from: docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b11-canonical-doc-registry-sync.md

1. Objective    — Evidence-sync canonical architecture docs and generated snapshots with machine registry truth; verify check:architecture-authority-surface passes.
2. Allowed layer— docs/PAS/ + docs/PAS/ only
3. Files        —
   packages/architecture-authority/src/data/package-registry.data.ts (VERIFY — PKG-022, active count 22)
   packages/architecture-authority/src/data/layer-registry.data.ts (VERIFY — @afenda/email Application)
   packages/architecture-authority/src/data/dependency-registry.data.ts (VERIFY — erp→storage edge, email summary)
   packages/architecture-authority/architecture-report.json (REGENERATE)
   packages/architecture-authority/dependency-snapshot.json (REGENERATE)
   docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b11-canonical-doc-registry-sync.md (CREATE)
   docs/PAS/pas-status-index.md (MODIFY)
   docs/PAS/ARCHITECTURE-AUTHORITY/PAS-002-ARCHITECTURE-AUTHORITY.md (MODIFY — §12 B11 row)
4. Prohibited   — packages/architecture-authority/src/** edits; registry data mutations without dedicated slice; foundation-disposition.registry.ts edits
5. Authority    — PAS-002 §4.11 · ARCHITECTURE_AUTHORITY_CANONICAL_DOCS · check-architecture-authority-surface.mts
6. Gates        —
   pnpm check:architecture-authority-surface
   pnpm quality:architecture
   pnpm architecture:drift
   pnpm check:documentation-drift
7. Closes       — Surface gate doc-package-drift / doc-dependency-drift failures for @afenda/email and @afenda/erp→@afenda/storage; stale architecture-report.json violations
8. Evidence     —
   packages/architecture-authority/architecture-report.json (violations: [])
   pnpm check:architecture-authority-surface exit 0
9. Attestation  — Documentation · Governance
```

## Rules frozen

1. Fingerprint in canonical docs must match `ARCHITECTURE_BASELINE_FINGERPRINT` (`ARCH-BASELINE-2026-06-27-v2`).
2. Active workspace count in `package-registry.md` must match `packageContract` active filesystem rows.
3. Doc remediation command for dependency drift: `pnpm architecture:dependencies`.
4. Exception registry does not record doc drift — use surface gate + this slice evidence path.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | `package-registry.md` lists 22 active workspaces incl. `@afenda/email` | `check-architecture-authority-surface` |
| 2 | `layer-registry.md` assigns `@afenda/email` | `check-architecture-authority-surface` |
| 3 | `dependency-registry.md` has erp→storage edge + email summary | `check-architecture-authority-surface` |
| 4 | `architecture-report.json` has empty violations | `pnpm architecture:report` |
| 5 | Dependency snapshot matches live graph | `pnpm architecture:drift` |

## Runtime evidence

| Artifact | Path |
| --- | --- |
| Human package registry | `packages/architecture-authority/src/data/package-registry.data.ts` |
| Human layer registry | `packages/architecture-authority/src/data/layer-registry.data.ts` |
| Human dependency registry | `packages/architecture-authority/src/data/dependency-registry.data.ts` |
| Generated report | `packages/architecture-authority/architecture-report.json` |
| Dependency snapshot | `packages/architecture-authority/dependency-snapshot.json` |
| Surface gate | `scripts/governance/check-architecture-authority-surface.mts` |
