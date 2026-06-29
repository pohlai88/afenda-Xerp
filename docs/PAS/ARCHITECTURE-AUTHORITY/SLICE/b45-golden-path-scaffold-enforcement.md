# Slice B45 — Golden-Path Scaffold CLI Enforcement (PAS-002 amendment)

**Prerequisite:** B43 delivered · B44 delivered

**Status:** Delivered

**Type:** Implementation

**Risk class:** Low

**Clean Core impact:** A→A — scaffold CLI policy + CI gate; no runtime ERP changes

---

## Objective

Enforce golden-path scaffold policy (NS E12): require `--description` when `--pas` is set, document package-registry registration in scaffold checklist, and wire `pnpm check:architecture-golden-path-scaffold` validating scaffold markers + amendment catalog completeness.

---

## Handoff block

```
1. Objective    — Golden-path scaffold CLI enforcement + CI gate hook.
2. Allowed layer— scripts/scaffold-package.mjs · packages/architecture-authority/src/validators/** · scripts/governance/check-architecture-golden-path-scaffold.mts · package.json · docs/PAS/ARCHITECTURE-AUTHORITY/SLICE/b45-*.md · docs/PAS/pas-status-index.md
3. Files        — validators/validate-golden-path-scaffold-policy.ts (CREATE)
                  __tests__/golden-path-scaffold-policy.test.ts (CREATE)
                  scripts/governance/check-architecture-golden-path-scaffold.mts (CREATE)
                  scripts/scaffold-package.mjs (MODIFY)
4. Prohibited   — turbo gen workspace · apps/erp runtime · foundation-disposition.registry.ts edits
5. Authority    — PAS-002 amendment · Domain NS §15 E12 · monorepo-discipline skill
6. Gates        — pnpm check:architecture-golden-path-scaffold · pnpm --filter @afenda/architecture-authority test:run · pnpm quality:architecture
7. Closes       — NS E12 scaffold enforcement; slice catalog B45
8. Evidence     — scaffold checklist references package-registry.data.ts; --description required with --pas
9. Attestation  — Principal TypeScript Architect — Enterprise 9.5+/10
```

---

## DoD

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | Scaffold requires description when --pas set | `validateOptions` in `scaffold-package.mjs` |
| 2 | Checklist documents registry registration | `printChecklist` step 5–8 |
| 3 | CI gate validates scaffold markers | `check-architecture-golden-path-scaffold.mts` |
| 4 | Tests pass | `golden-path-scaffold-policy.test.ts` |
