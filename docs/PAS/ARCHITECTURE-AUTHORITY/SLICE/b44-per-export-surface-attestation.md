# Slice B44 — Per-Export Surface Attestation (PAS-002 amendment)

**Prerequisite:** B43 delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A — additive export-level rows derived from package.json manifests

---

## Objective

Extend the architecture governance amendment registry with per-export consumer surface attestation rows (NS E11) — one row per `package.json` export path for every active/active-exempt governed package, inheriting package-level stability class from B43.

---

## Handoff block

```
1. Objective    — Deliver consumerExportAttestation registry rows + live package.json parity validation.
2. Allowed layer— packages/architecture-authority/src/** · scripts/governance/check-architecture-governance-amendment.mts · docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b44-*.md · docs/PAS/pas-status-index.md
3. Files        — contracts/architecture-governance-amendment.contract.ts (MODIFY — ConsumerExportAttestationEntry)
                  data/export-surface-attestation.build.ts (CREATE)
                  data/architecture-governance-amendment.registry.ts (MODIFY)
                  validators/validate-architecture-governance-amendment.ts (MODIFY)
                  __tests__/architecture-governance-amendment.registry.test.ts (MODIFY)
4. Prohibited   — apps/erp runtime · foundation-disposition.registry.ts edits (delegate registry-owner)
5. Authority    — PAS-002 amendment · Domain NS §15 E11 · architecture-authority skill
6. Gates        — pnpm --filter @afenda/architecture-authority typecheck · test:run · pnpm check:architecture-governance-amendment · pnpm quality:architecture
7. Closes       — NS E11 export-level attestation; slice catalog B44
8. Evidence     — consumerExportAttestation covers all live package.json exports; @afenda/architecture-authority attests `.` and `./surface`
9. Attestation  — Principal TypeScript Architect — Enterprise 9.5+/10
```

---

## DoD

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | Contract type for export attestation rows | `ConsumerExportAttestationEntry` |
| 2 | Builder reads live package.json exports | `export-surface-attestation.build.ts` |
| 3 | Validator enforces live/registry parity | `validate-architecture-governance-amendment.ts` |
| 4 | Tests cover multi-export packages | `architecture-governance-amendment.registry.test.ts` |
