# Slice B43 — Architecture Governance Amendment Registry (PAS-002 amendment)

**Prerequisite:** PAS-002 B1–B27 · PAS-002A B38–B42 delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Medium

**Clean Core impact:** A→A — additive registry classes derived from package-registry SSOT

---

## Objective

Implement Domain NS §15 Production track capabilities as machine registries: extension boundary, surface stability attestation, golden-path catalog, target-state membership, architecture system membership, and reference pattern catalog — derived from package-registry to prevent drift.

---

## Handoff block

```
1. Objective    — Deliver architecture-governance-amendment registry + validator + CI gate for NS E10–E15 surfaces.
2. Allowed layer— packages/architecture-authority/src/** · scripts/governance/check-architecture-governance-amendment.mts · package.json (check script) · docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b43-*.md · docs/PAS/pas-status-index.md
3. Files        — contracts/architecture-governance-amendment.contract.ts (CREATE)
                  data/architecture-governance-amendment.registry.ts (CREATE)
                  validators/validate-architecture-governance-amendment.ts (CREATE)
                  __tests__/architecture-governance-amendment.registry.test.ts (CREATE)
                  index.ts · surface-registry · validate-architecture.ts (MODIFY)
                  scripts/governance/check-architecture-governance-amendment.mts (CREATE)
4. Prohibited   — apps/erp runtime · packages/metadata-ui behavior changes · foundation-disposition.registry.ts edits
5. Authority    — PAS-002 amendment · Domain NS §3.2 · §3.3 · §15 · architecture-authority skill
6. Gates        — pnpm --filter @afenda/architecture-authority typecheck · test:run · pnpm check:architecture-governance-amendment · pnpm quality:architecture
7. Closes       — NS E11–E15 △ → runtime registry operational; slice catalog B43
8. Evidence     — architectureGovernanceAmendmentRegistry covers all active/active-exempt packages; referencePatterns length 5
9. Attestation  — Principal TypeScript Architect — Enterprise 9.5+/10
```

---

## DoD

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | Contract types for six amendment registry classes | `architecture-governance-amendment.contract.ts` |
| 2 | Registry derived from package-registry SSOT | `architecture-governance-amendment.registry.ts` |
| 3 | Validator + composite architecture gate | `validate-architecture-governance-amendment.ts` |
| 4 | CI gate wired | `pnpm check:architecture-governance-amendment` |
| 5 | Tests pass | `architecture-governance-amendment.registry.test.ts` |
