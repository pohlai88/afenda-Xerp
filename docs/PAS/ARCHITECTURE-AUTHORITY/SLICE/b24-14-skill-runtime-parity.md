# Slice B24 — Skill and Reference Runtime Parity (PAS-002 §14)

**Prerequisite:** Slices B15, B18, B20 — lifecycle, disposition, map immutability (`Status: Delivered`)

**Status:** Delivered (2026-06-27)

**Type:** Evidence-sync

**Risk class:** Low

**Clean Core impact:** A→A — documentation and skill reference only; no runtime behavior change

## Purpose

Close agent-facing drift after B12–B23: skill acceptance criteria, authority-surfaces shapes, package-structure validator index, pas-status-index closure, PAS frontmatter layer parity, and tree snapshot counts must match runtime (9 ValidationGate values, 10 validator modules, 12 test files).

## Handoff block

```
1. Objective    — Sync architecture-authority skill references and PAS status index with post-B23 runtime; fix PAS-002 frontmatter layer; add lifecycle negative test.
2. Allowed layer— .cursor/skills/architecture-authority/ + docs/PAS/ + packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md + src/__tests__/validate-lifecycle.test.ts
3. Files        —
   .cursor/skills/architecture-authority/SKILL.md
   .cursor/skills/architecture-authority/reference/authority-surfaces.md
   .cursor/skills/architecture-authority/reference/package-structure.md
   docs/PAS/pas-status-index.md
   docs/PAS/ARCHITECTURE-AUTHORITY/PAS-002-ARCHITECTURE-AUTHORITY.md
   docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b24-14-skill-runtime-parity.md
   packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md
   packages/architecture-authority/src/__tests__/validate-lifecycle.test.ts
4. Prohibited   — packages/architecture-authority/src/data/*.ts registry mutations; foundation-disposition.registry.ts; apps/erp
5. Authority    — PAS-002 §14 ┬À architecture-authority skill
6. Gates        —
   pnpm --filter @afenda/architecture-authority typecheck
   pnpm --filter @afenda/architecture-authority test:run
   pnpm check:architecture-authority-surface
7. Closes       — Stale skill reference shapes; pas-status-index B1–B11-only closure; tree validator/test counts; PAS layer frontmatter drift
8. Evidence     —
   .cursor/skills/architecture-authority/reference/authority-surfaces.md
   docs/PAS/pas-status-index.md
9. Attestation  — Documentation ┬À Test ┬À Governance
```
