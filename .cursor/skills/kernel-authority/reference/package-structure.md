# Package Structure Reference

`@afenda/kernel` folder tree, current exports, and target exports.

← Back to [SKILL.md](../SKILL.md) | Canonical: [PAS-001 §6](../../../../docs/PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md#6-package-structure-standard)

**Rule:** Current tree reflects `packages/kernel/src/` as it exists today. Target tree lists approved slice additions only — not present until the named slice lands.

---

## Current package structure (source truth)

```text
packages/kernel/
├── package.json
├── tsconfig.json
├── tsconfig.vitest.json
├── vitest.config.ts
└── src/
    ├── index.ts
    ├── contracts/
    │   ├── brand.contract.ts                 ← re-exports identity/brand
    │   ├── result.contract.ts
    │   ├── app-error.contract.ts              ← AppError only
    │   ├── problem-detail.contract.ts         ← RFC 9457 (Slice 7)
    │   ├── json-wire.contract.ts              ← Slice 10
    │   ├── execution-context.contract.ts
    │   ├── platform/
    │   ├── business-master-data/
    │   └── accounting-domain/
    ├── context/
    │   ├── index.ts
    │   ├── context-registry.ts
    │   ├── tenant-context.contract.ts
    │   ├── entity-group-context.contract.ts
    │   ├── legal-entity-context.contract.ts
    │   ├── ownership-interest-context.contract.ts
    │   ├── organization-unit-context.contract.ts
    │   ├── team-context.contract.ts
    │   ├── project-context.contract.ts
    │   ├── operating-context.contract.ts
    │   ├── permission-grant-vocabulary.contract.ts   ← Slice 8 (grant scope words)
    │   ├── permission-scope-context.contract.ts      ← resolved scope shape (transitional)
    │   ├── consolidation-scope-context.contract.ts
    │   ├── consolidation-scope-resolution.ts   ← pure derivation (TIP-008A)
    │   ├── accounting-readiness.contract.ts
    │   ├── localization-context.contract.ts           ← Slice 5
    │   └── … (support modules — see context-registry.ts)
    ├── policy/                             ← Slice 9 (current)
    ├── events/                             ← Slice 10 (current)
    ├── propagation/                        ← Slice 11 (current)
    ├── identity/                           ← PAS §4.1 / ADR-0021–0023 (flat module — Slice B/E)
    │   ├── index.ts
    │   ├── families/                           # PAS §4.1.4 category contracts
    │   │   ├── index.ts
    │   │   ├── define-enterprise-family.ts
    │   │   ├── tenant-hierarchy-id.contract.ts
    │   │   ├── identity-access-id.contract.ts
    │   │   ├── audit-execution-id.contract.ts
    │   │   ├── enterprise-hierarchy-id.contract.ts
    │   │   └── business-reference-id.contract.ts
    │   ├── primitives/
    │   ├── tenant-human-reference/
    │   ├── postgres/
    │   ├── wire/
    │   └── governance/
    └── __tests__/
```

**Slice A (2026-06-27):** ADR-0021–0023 Accepted; PAS §4.1 constitution recorded; architecture docs under `docs/architecture/identity/`. No runtime exports added.

**Slice B (2026-06-27):** Flat `packages/kernel/src/identity/` module landed — registry, parser, validator, generator, family contracts, wire boundary. Legacy `contracts/platform-id*.ts` retired.

**Slice C (ADR-gated):** Database `ids/` helpers + phased migrations per ADR-0022.

**Do not add to current tree:**

```text
context/currency-context.contract.ts      ← Finance / Accounting domain
context/fiscal-calendar-context.contract.ts
context/locale-context.contract.ts      ← use localization-context.contract.ts (Slice 1)
```

---

## Target package structure (after approved slices)

Additions only — each folder/file appears after its slice is delivered:

```text
packages/kernel/src/
├── identity/                               ← Slice B (ADR-0021–0023 Accepted)
│   ├── brand/
│   ├── canonical/
│   ├── registry/
│   ├── families/
│   ├── primitives/
│   ├── tenant-human-reference/
│   ├── postgres/
│   ├── wire/
│   └── governance/
├── contracts/
│   ├── problem-detail.contract.ts          ← Slice 2
│   └── json-wire.contract.ts               ← Slice 5
├── context/
│   └── localization-context.contract.ts    ← Slice 1 (delivered)
├── propagation/                            ← Slice 6A
│   ├── index.ts
│   ├── kernel-context-frame.contract.ts
│   └── kernel-context.ts
├── events/                                 ← Slice 5
│   ├── index.ts
│   └── domain-event.contract.ts
└── policy/                                 ← Slice 4
    ├── index.ts
    ├── policy-decision.contract.ts
    └── policy-denial-reason.contract.ts
```

**Deprecated after Slice B:** `contracts/platform-id*.ts` — migrate importers to `@afenda/kernel` identity barrel.

**Database mirror (Slice C–E):** `packages/database/src/ids/` — registries, helpers, governance contract. See [ADR-0022](../../../../docs/adr/ADR-0022-postgres-split-id-persistence-model.md).

**Governance gates (Slice E):** `scripts/governance/identity/` + `pnpm check:kernel-identity-governance` — drift prevention for prefix parity, unsafe casts, FK/RLS uuid discipline, tenant human reference scope.

---

## Current exports (package.json)

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./context": {
      "types": "./dist/context/index.d.ts",
      "import": "./dist/context/index.js",
      "default": "./dist/context/index.js"
    },
    "./accounting-domain": {
      "types": "./dist/contracts/accounting-domain/index.d.ts",
      "import": "./dist/contracts/accounting-domain/index.js",
      "default": "./dist/contracts/accounting-domain/index.js"
    },
    "./propagation": {
      "types": "./dist/propagation/index.d.ts",
      "import": "./dist/propagation/index.js",
      "default": "./dist/propagation/index.js"
    },
    "./events": {
      "types": "./dist/events/index.d.ts",
      "import": "./dist/events/index.js",
      "default": "./dist/events/index.js"
    },
    "./policy": {
      "types": "./dist/policy/index.d.ts",
      "import": "./dist/policy/index.js",
      "default": "./dist/policy/index.js"
    }
  }
}
```

---

## Target exports (after approved slices)

All subpaths above are **current** as of PAS-001 kernel stabilization. Future additive exports require a new serialized slice and package.json registration before consumer import.

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
import { AccountType } from "@afenda/kernel/accounting-domain";

// Correct — subpath import (target only, after slice lands)
import { kernelContext } from "@afenda/kernel/propagation";
import { DomainEvent } from "@afenda/kernel/events";
import { PolicyDecisionKind } from "@afenda/kernel/policy";

// PROHIBITED — deep import
import { TenantId } from "@afenda/kernel/src/contracts/platform-id.contract";
```

---

## Dependency rules

Kernel `package.json` must have zero runtime `dependencies` and zero `peerDependencies`. Dev-only: TypeScript, Vitest.

---

## Pure derivation vs prohibited resolver

| Allowed in kernel | Prohibited in kernel (moved to owner) |
|---|---|
| `deriveConsolidationScopeContext` — pure metadata from wire input | Loading tenant/company/org from database |
| `AccountingReadinessContext` shape only | `toAccountingReadinessContext`, `resolveReportingCurrency` → `apps/erp/.../accounting-readiness.projection.ts` |
| Brand/unbrand helpers | `formatWorkspaceDisplayLabel`, AppShell switch types → `@afenda/appshell` |
| | Permission evaluation |

FDR `PKG010_KERNEL` prohibits **data-loading resolvers** — not pure contract derivation from already-trusted input.
