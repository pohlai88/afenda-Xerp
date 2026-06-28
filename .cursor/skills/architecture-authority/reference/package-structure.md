# Package Structure Reference

`@afenda/architecture-authority` folder tree, exports, and governance rules.

← Back to [SKILL.md](../SKILL.md) | Canonical: [PAS-002 §6](../../../../docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md#6-package-structure-standard)

**Source truth order:**

1. Filesystem under `packages/architecture-authority/src/` (wins over all prose)
2. [`architecture-authority-package-layout.contract.ts`](../../../../packages/architecture-authority/src/contracts/architecture-authority-package-layout.contract.ts) — §6.1 folders, §6.2 target paths, §6.3 forbidden structure, subpath exports (Slice B9)
3. [`architecture-authority-surface-registry.ts`](../../../../packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts) — data modules, validators, doc sync targets
4. [`package.json`](../../../../packages/architecture-authority/package.json) — public export keys
5. [PAS-002 §6](../../../../docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md#6-package-structure-standard) — forbidden paths and export policy
6. This reference — skill adapter summary

**Rule:** Do not list slice targets as "future" when they are already on disk. PAS-002 §4.1–§4.12 runtime is delivered.

---

## Current package structure (summary)

```text
packages/architecture-authority/
├── PAS-002-ARCHITECTURE-TREE.md               # package-local annotated tree (B9)
├── PAS-002-ARCHITECTURE-AUTHORITY-STANDARD.md # tombstone → docs/PAS
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts
    ├── contracts/          # readonly registry contract types
    ├── data/               # static registry data (source of truth for gates)
    ├── validators/         # pure validation (composite + granular)
    ├── surface/            # machine-readable surface index + /surface export
    ├── workspace/          # discover-workspaces.ts (CI parity)
    ├── reports/            # dependency snapshot / audit builders (CI)
    └── __tests__/
```

**Approved top-level folders:** `contracts`, `data`, `validators`, `surface`, `workspace`, `reports`, `__tests__` — no `app/`, `components/`, `routes/`, `db/`, or business module folders.

---

## Forbidden paths (PAS §6.3)

Do not add:

```text
packages/architecture-authority/src/app/
packages/architecture-authority/src/components/
packages/architecture-authority/src/routes/
packages/architecture-authority/src/server/
packages/architecture-authority/src/db/
packages/architecture-authority/src/business/
packages/architecture-authority/src/hrm/
packages/architecture-authority/src/crm/
packages/architecture-authority/src/inventory/
packages/architecture-authority/src/accounting/
```

---

## Current exports (package.json)

Two keys — root plus surface subpath (PAS §6.2):

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "default": "./dist/index.js" },
    "./surface": { "types": "./dist/surface/index.d.ts", "import": "./dist/surface/index.js", "default": "./dist/surface/index.js" }
  }
}
```

**Approved import suffixes for consumers:** `""` (root) and `"/surface"` only — enforced by `check-architecture-authority-surface.mts`.

**Root export categories:** registry contracts, registry readers, validators, business-master-data policy constants, report builders.

**Surface export categories:** `ARCHITECTURE_AUTHORITY_DATA_MODULES`, `ARCHITECTURE_AUTHORITY_VALIDATOR_MODULES`, multi-tenancy forbidden edges, doc sync commands.

---

## Data modules (registry source of truth)

| File | Role |
| --- | --- |
| `package-registry.data.ts` | Governed workspace packages |
| `layer-registry.data.ts` | Layer assignments + cross-layer matrix |
| `ownership-registry.data.ts` | Package ownership audit rows |
| `dependency-registry.data.ts` | Approved runtime dependency edges |
| `lifecycle-registry.data.ts` | Package lifecycle closed union |
| `exception-registry.data.ts` | ADR architecture exceptions |
| `create-readonly-lookup-map.ts` | Immutable registry lookup map factory (B20) |
| `foundation-disposition.registry.ts` | PAS disposition lanes (ADR-0014) |
| `business-master-data-authority.registry.ts` | ADR-0020 entity → domain package map |
| `business-master-data-*.policy.ts` | Scaffold/import/shared-package guards |

---

## Validator modules

| File | Role |
| --- | --- |
| `validate-architecture.ts` | Composite architecture gate |
| `validate-registry.ts` | Filesystem vs package registry |
| `validate-dependencies.ts` | Approved dependency edges |
| `validate-forbidden-dependencies.ts` | Cross-layer prohibitions |
| `validate-layers.ts` | Layer matrix enforcement |
| `validate-cycles.ts` | Dependency cycle detection |
| `validate-ownership.ts` | Ownership completeness |
| `validate-exceptions.ts` | Exception registry integrity |
| `validate-foundation-disposition.ts` | Foundation disposition integrity |
| `validate-lifecycle.ts` | Lifecycle policy + inactive lifecycle rows (ADR-0006) |

**Immutable lookups (B20):** `create-readonly-lookup-map.ts` wraps `packageByName`, `ownershipByPackage`, and internal disposition lookup maps.

---

## Registry drift remediation

When live architecture validation reports drift, update sources listed in `ARCHITECTURE_REGISTRY_DRIFT_SOURCES` inside the surface registry, then run:

```bash
pnpm architecture:dependencies   # refresh dependency-snapshot.json
pnpm quality:architecture
```
