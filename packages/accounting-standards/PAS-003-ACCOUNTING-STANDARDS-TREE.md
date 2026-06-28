# PAS-003 — Accounting Standards Package Tree (package-local)

> **Composed PAS:** [`docs/PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md`](../docs/PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md)
>
> **Slice SSOT:** [`docs/PAS/ACCOUNTING-STANDARDS/SLICE/`](../docs/PAS/ACCOUNTING-STANDARDS/SLICE/README.md)
>
> **Gates:** `pnpm --filter @afenda/accounting-standards typecheck` · `pnpm --filter @afenda/accounting-standards test:run`

Annotated filesystem map for `@afenda/accounting-standards`. Update after serialized slice delivery.

**Legend:** ✅ delivered · 🎯 target (PAS §6.1) · 🧪 tests

```text
packages/accounting-standards/
├── PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md   # tombstone pointer → docs/PAS
├── PAS-003-ACCOUNTING-STANDARDS-TREE.md                 # this file
├── package.json
├── tsconfig.json
├── tsconfig.vitest.json
├── vitest.config.ts
└── src/
    ├── index.ts                                         # ✅ B0 — fingerprint + version export
    └── __tests__/
        └── architecture-boundary.test.ts                # ✅ B0 — boundary smoke test

Target tree (B1–B11 + B13–B16) — see PAS-003 §6.1:
    standards/          🎯 family · standard · version registries + IFRS packs
    routing/            🎯 process-routing registry (+ B13/B16 extensions)
    rules/              🎯 validation input · rule · result contracts + engine
    explanations/       🎯 B10 explanation registry
    evidence/           🎯 B11 audit evidence snapshot contract
```
