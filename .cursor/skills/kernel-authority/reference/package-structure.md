# Package Structure Reference

`@afenda/kernel` folder tree, current exports, and governance rules.

← Back to [SKILL.md](../SKILL.md) | Canonical: [PAS-001 §6](../../../../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md#6-package-structure-standard)

**Source truth order:**

1. Filesystem under `packages/kernel/src/` (wins over all prose)
2. [`kernel-package-layout.contract.ts`](../../../../packages/kernel/src/contracts/kernel-package-layout.contract.ts) — top-level folders, subpath exports, prohibited paths
3. [`context-registry.ts`](../../../../packages/kernel/src/context/context-registry.ts) — §4.4 required/support context modules
4. [`kernel-boundary-drift.registry.ts`](../../../../packages/kernel/src/governance/kernel-boundary-drift.registry.ts) — scheduled refactors (⚠️ DRIFT)
5. [`PAS-001-KERNEL-TREE.md`](../../../../packages/kernel/PAS-001-KERNEL-TREE.md) — annotated full tree (package-local)
6. This reference — skill adapter summary

**Rule:** Do not list slice targets as “future” when they are already on disk. B3–B18 delivered `identity/`, `governance/`, `permission/`, `propagation/`, `events/`, `policy/`, and the eight-key export baseline.

---

## Current package structure (summary)

See [PAS-001-KERNEL-TREE.md](../../../../packages/kernel/PAS-001-KERNEL-TREE.md) for the full annotated map.

```text
packages/kernel/
├── PAS-001-KERNEL-TREE.md
└── src/
    ├── index.ts                    # only file allowed at src root
    ├── contracts/                  # result, app-error, problem-detail, json-wire, execution-context, layout
    │   ├── platform/
    │   └── business-reference-identity/   # §4.7 (not business-master-data)
    ├── erp-domain/                 # §4.8 · PAS-001B catalog — 28/28 delivered (B76–B106)
    │   ├── erp-domain-layout.contract.ts   # 28-slug catalog; all slugs delivered
    │   ├── accounting/             # delivered — scaffold-standardized (B106)
    │   ├── inventory/              # delivered — scaffold-standardized (B106)
    │   ├── procurement/            # delivered (B80)
    │   └── … (25 additional delivered modules — see layout contract)
    ├── context/                    # §4.4 operating-context shapes + context-registry.ts
    │                               # Wire ingress: *.contract.ts + *.assert.ts + *.parser.ts (§4.4 triad)
    ├── identity/                   # §4.1 nested module (brand, canonical, families, wire, …)
    ├── governance/                 # §9 PAS self-governance (@afenda/kernel/governance)
    ├── permission/                 # §8 vocabulary (@afenda/kernel/permission)
    ├── policy/                     # policy decision vocabulary
    ├── propagation/                # kernel context frame
    ├── events/                     # domain event envelope
    └── __tests__/
```

**Top-level folders (gate-enforced):** `contracts`, `context`, `erp-domain`, `governance`, `identity`, `permission`, `propagation`, `events`, `policy`, `__tests__` — from `KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL`.

**Brand surface:** canonical `identity/brand/brand.contract.ts` only. The retired `contracts/brand.contract.ts` shim was removed (drift entry `contracts-brand-shim`, status completed).

---

## Prohibited paths (PAS §6.2)

Do not add:

```text
context/currency-context.contract.ts
context/fiscal-calendar-context.contract.ts
```

Currency code → branded primitive (`identity/primitives/currency-code.contract.ts`). Fiscal calendar → Finance / Accounting domain packages.

---

## Current exports (package.json)

Eight keys — root plus seven subpaths (PAS §6.3 / §6.4, delivered B18):

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "default": "./dist/index.js" },
    "./context": { "types": "./dist/context/index.d.ts", "import": "./dist/context/index.js", "default": "./dist/context/index.js" },
    "./erp-domain/accounting": { "types": "./dist/erp-domain/accounting/index.d.ts", "import": "./dist/erp-domain/accounting/index.js", "default": "./dist/erp-domain/accounting/index.js" },
    "./propagation": { "types": "./dist/propagation/index.d.ts", "import": "./dist/propagation/index.js", "default": "./dist/propagation/index.js" },
    "./events": { "types": "./dist/events/index.d.ts", "import": "./dist/events/index.js", "default": "./dist/events/index.js" },
    "./policy": { "types": "./dist/policy/index.d.ts", "import": "./dist/policy/index.js", "default": "./dist/policy/index.js" },
    "./permission": { "types": "./dist/permission/index.d.ts", "import": "./dist/permission/index.js", "default": "./dist/permission/index.js" },
    "./governance": { "types": "./dist/governance/index.d.ts", "import": "./dist/governance/index.js", "default": "./dist/governance/index.js" }
  }
}
```

**Not exported:** `./identity` — import enterprise ID types from root `@afenda/kernel` or identity barrel via root re-exports. Adding `./identity` requires a new serialized slice and layout-contract update.

**Additive policy:** new subpaths require slice delivery, `kernel-package-layout.contract.ts` update, `package.json` registration, tests, and `pnpm quality:boundaries`.

**Gate:** `pnpm check:kernel-subpath-exports`

---

## Subpath rules

| Rule | Reason |
|---|---|
| Root export (`.`) is stable public vocabulary | Breaking changes require a versioned kernel slice |
| Subpath exports group authority surfaces | Consumers import only what they need |
| No deep imports from consumers | `@afenda/kernel/src/contracts/...` is forbidden |
| Every new subpath requires tests | Boundary isolation must be testable |
| Every new subpath requires package export registration | Add to `package.json` before consumer import |
| Every new subpath requires boundary governance | Run `pnpm quality:boundaries` after adding |

---

## Consumer import patterns

```ts
// Correct — root import
import { TenantId, ExecutionContext, AppError } from "@afenda/kernel";

// Correct — subpath import (current)
import { OperatingContext, LocalizationContext } from "@afenda/kernel/context";
import { AccountType } from "@afenda/kernel/erp-domain/accounting";
import { kernelContext } from "@afenda/kernel/propagation";
import { DomainEvent } from "@afenda/kernel/events";
import { PolicyDecisionKind } from "@afenda/kernel/policy";
import { PermissionAction } from "@afenda/kernel/permission";
import { KERNEL_PROHIBITED_OWNERSHIP_POLICY } from "@afenda/kernel/governance";

// PROHIBITED — deep import
import { TenantId } from "@afenda/kernel/src/identity/families/tenant-hierarchy-id.contract";
```

---

## Dependency rules

Kernel `package.json` must have zero runtime `dependencies` and zero `peerDependencies`. Dev-only: TypeScript, Vitest.

---

## Pure derivation vs prohibited resolver

| Allowed in kernel | Prohibited in kernel (owner elsewhere) |
|---|---|
| `deriveConsolidationScopeContext` — pure metadata from wire input | Loading tenant/company/org from database |
| `AccountingReadinessContext` shape only | `toAccountingReadinessContext`, `resolveReportingCurrency` → `apps/erp/.../accounting-readiness.projection.ts` |
| Brand/unbrand helpers in `identity/brand/` | AppShell switch types → `@afenda/appshell` |
| Permission grant vocabulary | Permission evaluation → `@afenda/permissions` |

See `kernel-boundary-drift.registry.ts` for the full refactor lock list.

---

## Slice delivery checklist (new folders or subpaths)

1. Deliver implementation in a serialized PAS slice under `docs/PAS/slice/`
2. Update `kernel-package-layout.contract.ts` (`CURRENT_SRC_TOP_LEVEL`, `TARGET_PATHS`, or `SUBPATH_EXPORTS`)
3. Update `PAS-001-KERNEL-TREE.md` and PAS §6.1 summary if top-level layout changes
4. Register `package.json` export + add tests
5. Run `pnpm check:kernel-package-structure` · `pnpm check:kernel-subpath-exports` · `pnpm quality:boundaries`
