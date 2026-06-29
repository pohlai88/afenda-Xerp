# PAS-003 — Accounting Standards Package Tree (package-local)

> **Composed PAS:** [`docs/PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md`](../docs/PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md)
>
> **Slice SSOT:** [`docs/PAS/ACCOUNTING-STANDARDS/SLICE/`](../docs/PAS/ACCOUNTING-STANDARDS/SLICE/README.md)
>
> **Gates:** `pnpm --filter @afenda/accounting-standards typecheck` · `pnpm --filter @afenda/accounting-standards test:run`

Annotated filesystem map for `@afenda/accounting-standards`. Update after serialized slice delivery.

**Legend:** ✅ delivered · 🧪 tests

```text
packages/accounting-standards/
├── PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md   # tombstone pointer → docs/PAS
├── PAS-003-ACCOUNTING-STANDARDS-TREE.md                 # this file
├── package.json
├── tsconfig.json
├── tsconfig.vitest.json
├── vitest.config.ts
└── src/
    ├── index.ts                                         # ✅ B0–B11 exports + validatePostingAgainstAccountingStandards
    ├── standards/
    │   ├── accounting-standard-family.registry.ts       # ✅ B1
    │   ├── accounting-standard.contract.ts              # ✅ B1 · B15 types
    │   ├── accounting-standard.registry.ts              # ✅ B2
    │   ├── standard-version.contract.ts                 # ✅ B3 · B15
    │   ├── standard-version.registry.ts                 # ✅ B3 · B15
    │   └── ifrs/                                        # ✅ B8–B9
    │       ├── ifrs-authority-version.registry.ts
    │       ├── ifrs-standard.registry.ts
    │       ├── ifrs-9-financial-instruments.registry.ts
    │       ├── ifrs-10-consolidation.registry.ts
    │       ├── ifrs-11-joint-arrangements.registry.ts
    │       ├── ifrs-12-disclosure-interests.registry.ts
    │       ├── ias-28-associates-jv.registry.ts
    │       ├── ifrs-16-leases.registry.ts
    │       └── ifrs-18-presentation-disclosure.registry.ts
    ├── routing/
    │   ├── standard-process-route.contract.ts           # ✅ B4
    │   └── standard-process-routing.registry.ts         # ✅ B4 · B13 · B16
    ├── rules/
    │   ├── posting-validation-input.contract.ts         # ✅ B5
    │   ├── posting-validation-rule.contract.ts          # ✅ B6
    │   ├── posting-validation-result.contract.ts        # ✅ B7 · B14
    │   └── posting-validation-engine.ts                 # ✅ B9 engine
    ├── explanations/
    │   ├── accounting-standard-explanation.contract.ts  # ✅ B10
    │   └── accounting-standard-explanation.registry.ts  # ✅ B10
    ├── evidence/
    │   └── accounting-standard-evidence-snapshot.contract.ts  # ✅ B11
    └── __tests__/
        ├── accounting-standard-family-registry.test.ts  # 🧪 B1
        ├── accounting-standard-registry.test.ts         # 🧪 B2
        ├── standard-version-registry.test.ts            # 🧪 B3 · B15
        ├── standard-process-routing.test.ts             # 🧪 B4 · B13 · B16
        ├── ifrs-16-lease-posting.test.ts                # 🧪 B9 · B14
        └── architecture-boundary.test.ts                # 🧪 B0
```

**Fingerprint:** `ACCOUNTING-STANDARDS-2026-06-29-v3` (policy gates + 15 rules + metadata consumer)

**Maturity:** Production Candidate — Enterprise Accepted requires consumer workflow evidence (B12 governance; not claimed).
