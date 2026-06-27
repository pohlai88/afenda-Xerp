# PAS-002 — Architecture Authority Package Tree (package-local)

> **Canonical PAS:** [`docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md`](../docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md)
>
> **Runtime authority (code wins over prose):**
> [`src/surface/architecture-authority-surface-registry.ts`](src/surface/architecture-authority-surface-registry.ts) ·
> [`src/data/package-registry.data.ts`](src/data/package-registry.data.ts) ·
> [`src/data/dependency-registry.data.ts`](src/data/dependency-registry.data.ts)
>
> **Gates:** `pnpm check:architecture-authority-surface` · `pnpm --filter @afenda/architecture-authority test:run`

Annotated filesystem map for `@afenda/architecture-authority`. Update after serialized slice delivery or registry mutations (`foundation-registry-owner` only for disposition).

**Runtime parity snapshot:** fingerprint `ARCH-BASELINE-2026-06-27-v2` · `ValidationGate` union = 8 values · surface registry = 9 validator modules (1 composite + 8 leaf validators) · `src/__tests__/` = 9 files on disk.

**Legend:** ✅ CANON · 📋 registry data · 🔒 validator · 🧪 tests · 🚫 forbidden path

```text
packages/architecture-authority/
├── PAS-002-ARCHITECTURE-TREE.md                      # this file — package-local tree map
├── PAS-002-ARCHITECTURE-AUTHORITY-STANDARD.md        # tombstone → docs/PAS canonical PAS
├── package.json                                      # §6.2 — two export keys: . + ./surface
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts                                      # ✅ CANON — root public barrel
    │
    ├── contracts/                                    # ✅ readonly registry contract types
    │   ├── architecture-authority-version.ts
    │   ├── dependency.contract.ts
    │   ├── exception.contract.ts
    │   ├── foundation-disposition.contract.ts
    │   ├── layer.contract.ts
    │   ├── lifecycle.contract.ts
    │   ├── ownership.contract.ts
    │   ├── package.contract.ts
    │   ├── validation-result.contract.ts
    │   └── workspace.contract.ts
    │
    ├── data/                                         # 📋 static registry source of truth
    │   ├── package-registry.data.ts                  # §4.1
    │   ├── layer-registry.data.ts                    # §4.2
    │   ├── ownership-registry.data.ts                # §4.3
    │   ├── dependency-registry.data.ts               # §4.5 edges
    │   ├── lifecycle-registry.data.ts
    │   ├── exception-registry.data.ts                # §4.6
    │   ├── foundation-disposition.registry.ts        # §4.4 (mutations → foundation-registry-owner)
    │   ├── business-master-data-authority.registry.ts    # §4.10 ADR-0020 (from kernel K2)
    │   ├── business-master-data-scaffold.policy.ts
    │   ├── business-master-data-import-boundary.policy.ts
    │   └── business-master-data-shared-package.policy.ts
    │
    ├── validators/                                   # 🔒 pure validation (CI gates; 1 composite + 8 leaf validators)
    │   ├── validate-architecture.ts                  # §4.7 composite
    │   ├── validate-registry.ts
    │   ├── validate-dependencies.ts
    │   ├── validate-forbidden-dependencies.ts
    │   ├── validate-layers.ts
    │   ├── validate-cycles.ts
    │   ├── validate-ownership.ts
    │   ├── validate-exceptions.ts
    │   └── validate-foundation-disposition.ts
    │
    ├── surface/                                      # ✅ @afenda/architecture-authority/surface
    │   ├── index.ts
    │   └── architecture-authority-surface-registry.ts # machine-readable module index
    │
    ├── workspace/
    │   └── discover-workspaces.ts                    # monorepo workspace enumeration
    │
    ├── reports/                                      # CI diagnostic builders
    │   ├── build-architecture-report.ts
    │   ├── build-dependency-snapshot.ts
    │   └── build-ownership-audit.ts
    │
    └── __tests__/                                    # 🧪 (9 files)
```

## Forbidden paths (PAS §6.3)

Do not add: `src/app/`, `src/components/`, `src/routes/`, `src/server/`, `src/db/`, `src/business/`, `src/hrm/`, `src/crm/`, `src/inventory/`, `src/accounting/`.

## Public exports

| Key | Barrel | Purpose |
| --- | --- | --- |
| `.` | `src/index.ts` | Registry contracts, data readers, validators, reports |
| `./surface` | `src/surface/index.ts` | Surface registry metadata for agents and CI |

Consumer import suffixes: root and `/surface` only — no deep `@afenda/architecture-authority/src/...` imports.

## Completed serialization (PAS-002 slices B1–B10)

| Slice | Closes |
| --- | --- |
| B1–B4 | §4.1–§4.4 registry evidence-sync |
| B5–B7 | §4.5–§4.7 boundary + gate evidence-sync |
| B8 | §4.10 BMD authority post-K2 attestation |
| B9 | §6 package tree + surface BMD rows (this file) |
| B10 | §14 skill publication |

See [`docs/PAS/pas-status-index.md`](../docs/PAS/pas-status-index.md).
