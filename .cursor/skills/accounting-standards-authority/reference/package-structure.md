# Package Structure Reference

`@afenda/accounting-standards` folder tree, exports, and governance rules.

← Back to [SKILL.md](../SKILL.md) | Canonical: [PAS-003 §6](../../../../docs/PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md#6-package-structure-standard)

**Source truth order:**

1. Filesystem under `packages/accounting-standards/src/`
2. [`package.json`](../../../../packages/accounting-standards/package.json)
3. PAS-003 §6 — forbidden paths and export policy
4. This reference — skill adapter summary

---

## Current package structure (B0 skeleton)

```text
packages/accounting-standards/
├── PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md   # tombstone → docs/PAS
├── package.json
├── tsconfig.json
├── tsconfig.vitest.json
├── vitest.config.ts
└── src/
    ├── index.ts                                         # fingerprint + version
    └── __tests__/
        └── architecture-boundary.test.ts
```

---

## Target structure (B1–B11)

See PAS-003 §6.1 for full `standards/`, `routing/`, `rules/`, `explanations/`, `evidence/` tree.

Do not list target files as **Current** until the delivering slice lands.

---

## Forbidden paths (PAS §6.3)

```text
packages/accounting-standards/src/ledger/
packages/accounting-standards/src/journal-posting/
packages/accounting-standards/src/database/
packages/accounting-standards/src/ui/
packages/accounting-standards/src/tax-filing/
packages/accounting-standards/src/consolidation-calculation/
packages/accounting-standards/src/intercompany-pricing/
packages/accounting-standards/src/ai-advice/
```

---

## Current exports (package.json)

Root only:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

**Runtime dependency:** `@afenda/kernel` only — enforced by `architecture-boundary.test.ts`.

---

## Registry

| Field | Value |
| --- | --- |
| Registry ID | `PKG-023` |
| Disposition | `PKGR03_ACCOUNTING_STANDARDS` |
| Layer | Foundation |
| PAS maturity | Production Candidate |
