# Slice B21 — Doc Runtime Parity (PAS-002 §14 / §6.1)

**Prerequisite:** Slice B14 — validator surface parity (`docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b14-4.11-validator-surface-parity.md`, `Status: Delivered`)

**Status:** Delivered (2026-06-27)

**Type:** Evidence-sync

**Risk class:** Low

**Clean Core impact:** A→A — documentation only

## Purpose

Sync README, PAS-002-ARCHITECTURE-TREE.md, and skill reference (non-exception sections if B12 parallel) with runtime: fingerprint, validator/gate counts, test file count, package count.

## Handoff block

```
Handoff from: docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b21-14-doc-runtime-parity.md

1. Objective    — Sync packages/architecture-authority/README.md and PAS-002-ARCHITECTURE-TREE.md with runtime fingerprint, 8-gate composite, 9 validator modules, current test file count; do not change src/.
2. Allowed layer— packages/architecture-authority/README.md, packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md, docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b21-14-doc-runtime-parity.md
3. Files        —
   packages/architecture-authority/README.md
   packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md
   docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b21-14-doc-runtime-parity.md
4. Prohibited   — packages/architecture-authority/src/**; exception.contract.ts; foundation-disposition.registry.ts
5. Authority    — PAS-002 §6.1 · §14 · architecture-authority skill
6. Gates        —
   pnpm check:architecture-authority-surface
   pnpm check:documentation-drift
7. Closes       — README fingerprint/count drift; TREE test count and layout contract drift
8. Evidence     — README.md ARCH-BASELINE fingerprint matches architecture-authority-version.ts
9. Attestation  — Documentation · Maintainability
```

## Rules frozen

1. Docs-only — no runtime behavior changes.
2. Counts must be derived from disk (grep/list), not guessed.

## DoD

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | README fingerprint matches `ARCHITECTURE_BASELINE_FINGERPRINT` | file read |
| 2 | Surface gate passes | `pnpm check:architecture-authority-surface` |
