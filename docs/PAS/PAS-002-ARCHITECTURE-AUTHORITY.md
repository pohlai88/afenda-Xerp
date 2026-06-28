# PAS-002 — Architecture Authority Standard

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-002 |
| **Document class** | `package_authority_standard` |
| **Document role** | `architecture_registry_authority` |
| **Canonical filename** | `PAS-002-ARCHITECTURE-AUTHORITY.md` |
| **Package** | `@afenda/architecture-authority` |
| **Layer** | Platform |
| **Package role** | Defines package registry, layer authority, ownership, dependency rules, drift rules, and architecture gates |
| **Runtime stance** | `contracts-only` |
| **Registry lane** | `PKGR02_ARCHITECTURE_AUTHORITY` |
| **Package owner** | Architecture Authority |
| **Agent skill** | `architecture-authority` · `.cursor/skills/architecture-authority/SKILL.md` |
| **Maturity** | MVP Authority (`mvp_authority`) |
| **Authority status** | `accepted_for_boundary` |
| **Implementation status** | `implemented` — MVP Authority closed; Enterprise Accepted via [PAS-002A](PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) B38–B42 |
| **Evidence level** | `runtime_partial` |
| **Runtime status** | B1–B27 delivered — registries, composite gates, lifecycle enforcement, skill chain synced |
| **Remaining slices** | none |
| **Consumers** | `@afenda/kernel`, `@afenda/design-system`, `@afenda/ui`, `@afenda/appshell`, `@afenda/ui-composition`, `@afenda/metadata-ui`, `apps/erp` |
| **Change model** | `serialized-slices` |
| **Quality target** | Enterprise **9.5 / 10** |
| **Slice directory** | `docs/PAS/slice/` |
| **ADR prerequisites** | ADR-0009, ADR-0010, ADR-0011, ADR-0012, ADR-0013, ADR-0014, ADR-0020 |

#### Required gates

| # | Gate command |
| --- | --- |
| 1 | `pnpm --filter @afenda/architecture-authority typecheck` |
| 2 | `pnpm --filter @afenda/architecture-authority test:run` |
| 3 | `pnpm quality:architecture` |
| 4 | `pnpm architecture:cycles` |
| 5 | `pnpm architecture:drift` |
| 6 | `pnpm quality:boundaries` |
| 7 | `pnpm check:foundation-disposition` |

> **Maturity is part of authority.**
> PAS-002 reserves package/layer/ownership/dependency boundary and supports serialized implementation. **Enterprise Accepted** maturity on `PKGR02_ARCHITECTURE_AUTHORITY` is attested via [PAS-002A](PAS-002A-ARCHITECTURE-AUTHORITY-ENTERPRISE-STANDARD.md) B38–B42 — treat PAS-002 as MVP charter; treat PAS-002A as runtime authority for PKGR02.

> **Canonical location:** `docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY.md`
> **Package-local tree:** [`packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md`](../../packages/architecture-authority/PAS-002-ARCHITECTURE-TREE.md)
> **Package-local pointer:** `packages/architecture-authority/PAS-002-ARCHITECTURE-AUTHORITY-STANDARD.md` *(tombstone — Delivered B10)*
> **Runtime surface index:** `packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts`
> **Kernel identity boundary (do not duplicate):** [PAS-001 §4.1](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) · `.cursor/skills/kernel-authority/SKILL.md`

---

# 0. Agent Quick Path

> Read this section first for IDE/agent work. Full detail in §1–§15. Execution adapter: `.cursor/skills/architecture-authority/SKILL.md`

**Boundary:** `@afenda/architecture-authority` **owns package/layer/ownership/dependency/drift authority and architecture quality gates; it never owns runtime business behavior, UI behavior, domain rules, auth behavior, database schema behavior, or module implementation logic.**

**Hard stops summary:**

* **Prohibited imports:** application packages, UI packages, database runtime packages, auth SDKs, framework runtime adapters, business modules, infrastructure SDKs.
* **Must never own:** business master data, Kernel identity semantics, UI component behavior, database migrations, auth/session runtime behavior, ERP feature implementation.

**Required gates:** see §13.1.

**Slice entrypoint:** `docs/PAS/slice/` · Planner: `pas-slice-planner` · Session: `/afenda-coding-session`

**Registry:** `PKGR02_ARCHITECTURE_AUTHORITY` · machine authority: `packages/architecture-authority/src/data/foundation-disposition.registry.ts` · surface map: `src/surface/architecture-authority-surface-registry.ts`

**Kernel boundary (read-only):** Canonical enterprise ID families, parsers, and wire contracts live in `@afenda/kernel` ([PAS-001](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)). Architecture authority records package/layer/dependency truth only — never ID format or parser behavior.

**Enterprise knowledge boundary:** Knowledge Atoms, acceptance chains, and accepted business meaning → [PAS-004](PAS-004-ENTERPRISE-KNOWLEDGE-STANDARD.md) / `@afenda/enterprise-knowledge` / `.cursor/skills/enterprise-knowledge/SKILL.md`. List `@afenda/enterprise-knowledge` in package registries here; do **not** store atoms in this package.

---

# 1. Package Definition

`@afenda/architecture-authority` is the Foundation package that defines Afenda’s package governance model. It answers which packages exist, which layer each package belongs to, who owns them, whether they are active or deprecated, what dependency boundaries are allowed, and which architecture drift conditions are accepted, rejected, or intentionally waived.

It is a **contracts-only authority package**. It may expose typed registries, static rule data, validation helpers, and CLI gate logic. It must not become a runtime service, business module, UI kit, database package, or application composition layer.

> **This package answers:** “Is this package/layer/dependency/status allowed by Afenda architecture authority?”

> **This package must not answer:** “How does a business workflow behave at runtime?”

---

# 2. One-Sentence Boundary

`@afenda/architecture-authority` **owns architecture registries, package lifecycle truth, layer rules, dependency boundaries, ownership records, drift policy, and architecture quality gates; it never owns product behavior, business master data, Kernel identity primitives, UI behavior, database migrations, auth/session behavior, or ERP module implementation.**

---

# 3. Dependency Rules

## 3.1 Allowed

This package may import or use:

* TypeScript standard library types.
* Node.js standard library APIs required for CLI checks.
* Local static registry data inside `packages/architecture-authority/src/data/`.
* Local validation/check modules inside `packages/architecture-authority/src/`.
* Build/test tooling already approved for Foundation packages.
* `@afenda/kernel` only where architecture authority needs canonical primitive types and only if this does not create a cycle.
* No runtime framework dependency unless explicitly approved by architecture authority.

Allowed dependency direction:

```text
architecture-authority → static data / local checks / approved primitive contracts
consumer packages      → architecture-authority for validation/gates
```

Architecture authority must stay below application and UI packages.

## 3.2 Prohibited imports

This package must not import:

* `apps/erp`
* `apps/email`
* `@afenda/appshell`
* `@afenda/ui`
* `@afenda/design-system`
* `@afenda/metadata-ui`
* `@afenda/database`
* `@afenda/auth`
* `@afenda/execution`
* `@afenda/observability`
* `@afenda/email`
* Business module packages such as HRM, CRM, Inventory, Accounting, Finance, Procurement, Sales, or Manufacturing.
* Next.js, React, browser UI frameworks, auth SDKs, database clients, queue providers, or external runtime service SDKs.

## 3.3 Import rule

Architecture authority is a **governance root**, not a consumer package. If this package needs to import a high-level package to validate it, the design is wrong. Architecture authority should read static registry data and filesystem evidence through local gate code, not import runtime modules from the packages being governed.

Wrong-package signal:

```text
If architecture-authority must import a package to decide whether that package is allowed, the rule belongs in registry data or a gate, not in a runtime dependency.
```

Escalation path:

```text
PAS-002 → package registry → layer registry → ownership registry → drift registry → architecture gate
```

---

# 4. Authority Surfaces

## 4.1 Package Registry

**Authority:** PAS-002 §4.1
**Implementation:** `packages/architecture-authority/src/data/package-registry.data.ts` · `validators/validate-registry.ts`
**Slice gate:** Delivered (runtime)

The package registry is the canonical list of governed Afenda packages. It records package name, package ID, layer, lifecycle, filesystem expectation, and governance status.

The package registry answers:

* Does this package exist in architecture authority?
* Is the package active, deprecated, blocked, or planned?
* Should the package exist on disk?
* Which package ID is assigned?
* Which layer owns the package?

The package registry must not define runtime behavior.

## 4.2 Layer Registry

**Authority:** PAS-002 §4.2
**Implementation:** `packages/architecture-authority/src/data/layer-registry.data.ts` · `validators/validate-layers.ts`
**Slice gate:** Delivered (runtime)

The layer registry defines the allowed architecture layers and the dependency direction between them.

Minimum layers:

```text
Platform
Foundation
Application
UI
```

The layer registry answers:

* Which layer owns this package?
* Can package A depend on package B?
* Is a package crossing upward into application/UI runtime?
* Is the dependency direction allowed?

The layer registry must reject accidental upward imports from foundational packages into application packages.

## 4.3 Ownership Registry

**Authority:** PAS-002 §4.3
**Implementation:** `packages/architecture-authority/src/data/ownership-registry.data.ts` · `validators/validate-ownership.ts`
**Slice gate:** Delivered (runtime)

The ownership registry defines who owns each package and which authority is responsible for accepting changes.

The ownership registry answers:

* Who approves package boundary changes?
* Who owns lifecycle changes?
* Who signs off exceptions or waivers?
* Which authority must be consulted before adding imports, exports, package entries, or registry rows?

Ownership records are governance metadata, not human-resource employee master data.

## 4.4 Foundation Disposition Registry

**Authority:** PAS-002 §4.4
**Implementation:** `packages/architecture-authority/src/data/foundation-disposition.registry.ts` · `validators/validate-foundation-disposition.ts`
**Slice gate:** Delivered (runtime) · registry edits → `foundation-registry-owner` only

The foundation disposition registry tracks PAS delivery status for foundation-level architecture work.

It answers:

* Is a foundation package or delivery item not started, partially implemented, delivered, complete, waived, or blocked?
* Which architecture decision or delivery record governs the work?
* Which runtime evidence supports the status?
* Which gaps remain before enterprise acceptance?

It must not duplicate long-form delivery documents. It records status truth and pointers only.

## 4.5 Boundary Rules

**Authority:** PAS-002 §4.5 · ADR layer matrix
**Implementation:** `packages/architecture-authority/src/validators/` (`validate-dependencies.ts`, `validate-forbidden-dependencies.ts`, `validate-layers.ts`, `validate-cycles.ts`)
**Slice gate:** Delivered (runtime)

Boundary rules define allowed and prohibited package relationships.

They must detect:

* Unregistered packages.
* Wrong-layer imports.
* Application-to-foundation violations.
* Foundation-to-application violations.
* UI leakage into non-UI packages.
* Runtime SDK leakage into contracts-only packages.
* Deprecated package usage.
* Missing ownership or lifecycle records.

Boundary rules are enforced by architecture quality gates (`pnpm quality:boundaries`, `pnpm quality:architecture`).

## 4.6 Exception Registry

**Authority:** PAS-002 §4.6 · ADR exception records
**Implementation:** `packages/architecture-authority/src/data/exception-registry.data.ts` · `validators/validate-exceptions.ts`
**Slice gate:** Delivered (runtime)

The exception registry records **approved ADR-level architecture exceptions** — not general technical debt.

Each exception entry must record:

```ts
{
  readonly id: string;
  readonly status: "active" | "completed" | "waived" | "rejected";
  readonly owner: string;
  readonly evidence: readonly string[];
  readonly resolution?: string;
}
```

Documentation drift and doc/runtime parity are governed separately by `pnpm architecture:drift` and `pnpm check:documentation-drift` — not duplicated inside this registry.

## 4.7 Architecture Gates

**Authority:** PAS-002 §4.7
**Implementation:** `validators/validate-architecture.ts` (composite) · repo scripts under `scripts/quality/` and `scripts/governance/`
**Slice gate:** Delivered (runtime)

Architecture gates enforce this PAS.

Required gate categories:

* Package registration (`validate-registry.ts`).
* Layer boundary validation (`validate-layers.ts`, `validate-forbidden-dependencies.ts`).
* Dependency cycle validation (`validate-cycles.ts`).
* Architecture drift validation (`pnpm architecture:drift`).
* Foundation disposition integrity (`validate-foundation-disposition.ts` · `pnpm check:foundation-disposition`).
* Package ownership validation (`validate-ownership.ts`).
* Filesystem/package registry parity.
* Quality umbrella execution (`pnpm quality:architecture`).

The gates must be deterministic, CI-safe, and explain failures with actionable messages.

## 4.8 Dependency Registry

**Authority:** PAS-002 §4.8
**Implementation:** `packages/architecture-authority/src/data/dependency-registry.data.ts`
**Slice gate:** Delivered (runtime)

Approved runtime dependency edges between workspace packages. Consumed by `validate-dependencies.ts` and dependency snapshot reports.

## 4.9 Lifecycle Registry

**Authority:** PAS-002 §4.9
**Implementation:** `packages/architecture-authority/src/data/lifecycle-registry.data.ts`
**Slice gate:** Delivered (runtime) — `validateLifecycle()` composite gate with ADR-0006 expiry metadata and deterministic reference (Slices B15, B25, B26)

## 4.10 Business Master Data Authority

**Authority:** PAS-002 §4.10 · ADR-0020
**Implementation:** `packages/architecture-authority/src/data/business-master-data-authority.registry.ts` · import/scaffold policies under `src/data/business-master-data-*.policy.ts`
**Slice gate:** Delivered (runtime)

Records **which business entity IDs are reserved for which domain packages** and enforces import/scaffold boundaries. This is package governance metadata — not business master data runtime, not Kernel `ID_FAMILIES` semantics ([PAS-001 §4.1](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)).

## 4.11 Surface Registry

**Authority:** PAS-002 §4.11
**Implementation:** `packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts`
**Slice gate:** Delivered (runtime)

Machine-readable index of data modules, validator modules, canonical docs, and forbidden runtime edges. Single source for “what exists in this package” — agents must read this before inferring structure from PAS prose.

## 4.12 Workspace Discovery

**Authority:** PAS-002 §4.12
**Implementation:** `packages/architecture-authority/src/workspace/discover-workspaces.ts`
**Slice gate:** Delivered (runtime)

Filesystem discovery of monorepo workspaces for registry parity and dependency snapshot gates. Not an ERP runtime resolver.

---

# 5. What This Package Must Never Own

`@afenda/architecture-authority` must never own:

* Business master data such as customer, supplier, employee, product, warehouse, document, asset, chart of accounts, item, BOM, price list, or payroll records.
* Kernel canonical identity family semantics.
* Runtime ID parser/generator behavior.
* Auth/session behavior.
* RBAC permission execution behavior.
* Database schema migrations.
* RLS implementation.
* Outbox publishing runtime behavior.
* Audit event writing behavior.
* UI primitives, visual tokens, component variants, recipes, or className policy.
* AppShell layout, route behavior, command center behavior, or navigation rendering.
* ERP route implementation.
* HRM, CRM, Inventory, Accounting, Procurement, Sales, Manufacturing, Finance, or any business module behavior.
* Vendor SDK implementation.
* Environment secrets.
* Feature implementation logic.
* Long-form ADR, PAS, or legacy delivery narrative duplication.

---

# 6. Package Structure Standard

## 6.1 Current package tree

Verified against `packages/architecture-authority/src/` (2026-06-27):

```text
packages/architecture-authority/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts
│   ├── contracts/
│   │   ├── architecture-authority-version.ts
│   │   ├── architecture-authority-package-layout.contract.ts
│   │   ├── dependency.contract.ts
│   │   ├── exception.contract.ts
│   │   ├── foundation-disposition.contract.ts
│   │   ├── iso8601-utc-timestamp.ts
│   │   ├── layer.contract.ts
│   │   ├── lifecycle.contract.ts
│   │   ├── ownership.contract.ts
│   │   ├── package.contract.ts
│   │   ├── validation-result.contract.ts
│   │   └── workspace.contract.ts
│   ├── data/
│   │   ├── package-registry.data.ts
│   │   ├── layer-registry.data.ts
│   │   ├── ownership-registry.data.ts
│   │   ├── dependency-registry.data.ts
│   │   ├── lifecycle-registry.data.ts
│   │   ├── exception-registry.data.ts
│   │   ├── create-readonly-lookup-map.ts
│   │   ├── foundation-disposition.registry.ts
│   │   ├── business-master-data-authority.registry.ts
│   │   ├── business-master-data-scaffold.policy.ts
│   │   ├── business-master-data-import-boundary.policy.ts
│   │   └── business-master-data-shared-package.policy.ts
│   ├── validators/
│   │   ├── validate-architecture.ts
│   │   ├── validate-registry.ts
│   │   ├── validate-dependencies.ts
│   │   ├── validate-forbidden-dependencies.ts
│   │   ├── validate-layers.ts
│   │   ├── validate-cycles.ts
│   │   ├── validate-ownership.ts
│   │   ├── validate-exceptions.ts
│   │   ├── validate-foundation-disposition.ts
│   │   └── validate-lifecycle.ts
│   ├── surface/
│   │   ├── index.ts
│   │   └── architecture-authority-surface-registry.ts
│   ├── workspace/
│   │   └── discover-workspaces.ts
│   ├── reports/
│   │   ├── build-architecture-report.ts
│   │   ├── build-dependency-snapshot.ts
│   │   └── build-ownership-audit.ts
│   └── __tests__/
└── dist/
```

## 6.1.1 Target (not yet required)

Optional rename for clarity — do not implement without a dedicated slice:

```text
validators/ → checks/   # alias only; no behavior change
```

## 6.2 Required exports

**Authority:** `src/index.ts` and `src/surface/architecture-authority-surface-registry.ts` — not simplified stubs.

Approved export categories:

* Registry contracts (`PackageContract`, `LayerContract`, `OwnershipContract`, `FoundationDispositionEntry`, …).
* Registry readers (`packageByName`, `layerContract`, `foundationDispositionRegistry`, …).
* Validators (`validateArchitecture`, `validateFoundationDisposition`, …).
* Surface metadata (`ARCHITECTURE_AUTHORITY_DATA_MODULES`, `ARCHITECTURE_AUTHORITY_VALIDATOR_MODULES`).
* Report builders (CI/diagnostic only).

CLI-only gate internals should not be exported as public runtime API unless another package has an approved compile-time use case.

Subpath export: `@afenda/architecture-authority/surface` for surface registry consumers.

## 6.3 Forbidden structure

Forbidden:

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

Architecture authority is a governance package, not a runtime feature package.

---

# 7. Decision Matrix

| Question                                                                   | If yes →                                        | In this package? |
| -------------------------------------------------------------------------- | ----------------------------------------------- | ---------------- |
| Does the change add or rename an Afenda package?                           | Update package registry and ownership registry. | **Yes**          |
| Does the change assign a package to a layer?                               | Update layer registry.                          | **Yes**          |
| Does the change define allowed dependency direction?                       | Update layer/boundary rules.                    | **Yes**          |
| Does the change record who owns a package?                                 | Update ownership registry.                      | **Yes**          |
| Does the change record architecture drift status?                          | Update drift registry.                          | **Yes**          |
| Does the change enforce package/layer quality gates?                       | Update architecture gate code.                  | **Yes**          |
| Does the change define canonical ID format such as `ten_...` or `cus_...`? | Belongs to Kernel.                              | **No**           |
| Does the change define employee/customer/product business master data?     | Belongs to business modules.                    | **No**           |
| Does the change define UI component variants or tokens?                    | Belongs to design-system/ui authority.          | **No**           |
| Does the change define database schema or RLS policy?                      | Belongs to database authority.                  | **No**           |
| Does the change define auth sign-in/session behavior?                      | Belongs to auth authority.                      | **No**           |
| Does the change define AppShell navigation rendering?                      | Belongs to AppShell authority.                  | **No**           |
| Does the change define ERP business route behavior?                        | Belongs to Application/module authority.        | **No**           |
| Does the change define delivery status pointers for foundation packages?   | Belongs to foundation disposition registry.     | **Yes**          |
| Does the change assign a business entity to a domain package (ADR-0020)?   | Update business-master-data authority registry. | **Yes**          |
| Does the change add Kernel wire/parser behavior for an enterprise ID?      | Belongs to `@afenda/kernel` ([PAS-001 §4.1](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)). | **No**           |

---

# 8. Contract Rules

All architecture authority contracts must satisfy:

1. TypeScript strict mode.
2. `readonly` on contract properties.
3. No mutable exported registry objects.
4. Stable package IDs for registered packages.
5. Stable layer names.
6. Stable lifecycle status values.
7. JSON-serializable registry records.
8. No side effects on import.
9. No hidden business logic.
10. No framework runtime dependency.
11. No UI dependency.
12. No database client dependency.
13. No auth SDK dependency.
14. No package registry row without ownership.
15. No active package without layer assignment.
16. No layer without dependency direction semantics.
17. No drift entry without owner and status.
18. No waiver without evidence and expiry or review condition.
19. No long-form authority duplication outside PAS/ADR/PAS documents.
20. No circular dependency introduced by architecture authority.

---

# 9. Runtime Rules

`@afenda/architecture-authority` is **contracts-only**.

Approved runtime primitives are limited to:

* Static registry constants.
* Pure validation functions.
* CLI gate execution.
* Filesystem inspection inside gate scripts.
* Test helpers for architecture validation.

This package must not run inside ERP request lifecycle, UI rendering, auth request handling, database transaction execution, Trigger.dev workers, or business module workflows.

Allowed:

```text
CI gate → architecture-authority registry/check modules → pass/fail report
```

Forbidden:

```text
ERP runtime route → architecture-authority → business behavior decision
```

Architecture authority may decide whether a dependency is legal. It must not decide how a customer, supplier, employee, product, document, audit event, or transaction behaves.

---

# 10. Implementation Sequence

Recommended order for new additions:

1. Add or update ADR/PAS authority if the package boundary changes.
2. Update package registry.
3. Update layer registry.
4. Update ownership registry.
5. Update foundation disposition registry if the change affects delivery status.
6. Update drift registry if the change opens, closes, waives, or rejects known drift.
7. Update architecture checks.
8. Update tests.
9. Run required gates.
10. Update runtime truth matrix or status index where applicable.

**Do not add in this package:**

* Kernel ID families → `@afenda/kernel`
* Business master data → owning business module, such as HRM/CRM/Inventory
* UI tokens/variants/components → `@afenda/design-system` / `@afenda/ui`
* Metadata rendering → `@afenda/metadata-ui`
* AppShell behavior → `@afenda/appshell`
* Auth behavior → auth authority/package
* Database schema/RLS/migrations → database authority/package
* Execution/outbox workers → execution authority/package
* Observability logger behavior → observability authority/package

---

# 11. Enterprise Acceptance Criteria

A change is accepted only when all criteria pass.

## 11.1 Architecture

* Package registry reflects every active package.
* Layer registry reflects every active package layer.
* Ownership registry has one owner record for every active package.
* Boundary rules reject illegal dependency direction.
* Architecture drift entries are explicit and owned.
* No package is silently introduced outside registry authority.
* No package is silently removed without lifecycle status update.
* No architecture exception exists without evidence.

## 11.2 Type Safety

* Registry entries use strict TypeScript contracts.
* Registry fields are readonly.
* Registry records are immutable at import boundaries.
* Status values are closed unions, not loose strings.
* Package/layer IDs are stable and test-covered.
* Public exports expose contracts and registry constants only.
* Gate internals remain internal unless intentionally exported.

## 11.3 Governance

* ADR/PAS authority is linked where applicable.
* Runtime truth matrix is updated when status changes.
* Delivery index is updated when foundation disposition changes.
* Waivers include owner, reason, evidence, and closure path.
* Completed drift has evidence.
* Rejected drift has rationale.
* No long-form governance authority is duplicated inside source comments.

## 11.4 Runtime Safety

* No framework runtime dependency.
* No UI dependency.
* No database client dependency.
* No auth SDK dependency.
* No application package dependency.
* No business module dependency.
* No request-time side effects.
* No environment secret usage.
* CLI gates are deterministic and CI-safe.

## 11.5 ERP Readiness

* ERP packages cannot bypass architecture authority registration.
* ERP application package dependencies are validated.
* ERP module packages cannot claim Kernel/Foundation ownership without registry approval.
* New ERP module bootstraps must pass package registration, ownership, and layer gates.
* Business module packages must not be placed in Kernel or architecture authority to “share” business data.
* Foundation packages must remain reusable and business-neutral.

---

# 12. Slice Catalog

Index of implementation slices for this PAS. **Runtime for §4.1–§4.12 and §6 layout governance is delivered** in `packages/architecture-authority/src/`; slice handoffs B1–B11 are authored under `docs/PAS/slice/`.

| Slice file                                  | ID  | PAS §   | Status      | Type           | Prerequisite     |
| ------------------------------------------- | --- | ------- | ----------- | -------------- | ---------------- |
| *(runtime delivered — §4.8–§4.12 in surface registry)* | — | §4.8–§4.12 | Delivered | Implementation | PAS-002 accepted |
| `b1-4.1-package-registry.md`                | B1  | §4.1    | Delivered   | Evidence-sync  | Runtime exists   |
| `b2-4.2-layer-registry.md`                  | B2  | §4.2    | Delivered   | Evidence-sync  | Runtime exists   |
| `b3-4.3-ownership-registry.md`              | B3  | §4.3    | Delivered   | Evidence-sync  | Runtime exists   |
| `b4-4.4-foundation-disposition-registry.md` | B4  | §4.4    | Delivered   | Evidence-sync  | Runtime exists   |
| `b5-4.5-boundary-rules.md`                  | B5  | §4.5    | Delivered   | Evidence-sync  | Runtime exists   |
| `b6-4.6-exception-registry.md`              | B6  | §4.6    | Delivered   | Evidence-sync  | Runtime exists   |
| `b7-4.7-architecture-gates.md`              | B7  | §4.7    | Delivered   | Evidence-sync  | Runtime exists   |
| `b8-4.10-bmd-authority.md`                  | B8  | §4.10   | Delivered   | Evidence-sync  | ADR-0020         |
| `b9-6-package-structure-and-exports.md`     | B9  | §6      | Delivered   | Governance     | B1–B8            |
| `b10-architecture-authority-skill.md`       | B10 | §14     | Delivered   | Governance     | B9               |
| `b11-canonical-doc-registry-sync.md`        | B11 | §4.11   | Delivered   | Evidence-sync  | B10              |
| `b13-4.7-composite-gate-foundation-disposition.md` | B13 | §4.7 | Delivered | Implementation | B7 |
| `b14-4.11-validator-surface-parity.md` | B14 | §4.11 | Delivered | Implementation | B11 |
| `b22-3.3-governance-import-boundary.md` | B22 | §3.3 | Delivered | Implementation | B10 |
| `b23-4.10-bmd-authority-comment-sync.md` | B23 | §4.10 | Delivered | Evidence-sync | B8 |
| `b12-4.6-exception-contract-alignment.md` | B12 | §4.6 | Delivered | Implementation | B6 |
| `b19-4.3-ownership-registry-parity.md` | B19 | §4.3 | Delivered | Implementation | B13 |
| `b21-14-doc-runtime-parity.md` | B21 | §14 | Delivered | Evidence-sync | B14 |
| `b18-pkgr02-architecture-authority-disposition.md` | B18 | §0 | Delivered | Registry-sync | B21 |
| `b20-registry-map-immutability.md` | B20 | §6.3 | Delivered | Implementation | B18 |
| `b15-4.9-lifecycle-enforcement.md` | B15 | §4.9 | Delivered | Implementation | B7 |
| `b24-14-skill-runtime-parity.md` | B24 | §14 | Delivered | Evidence-sync | B15,B20 |
| `b25-4.9-lifecycle-expiry-metadata.md` | B25 | §4.9 | Delivered | Implementation | B15 |
| `b26-4.9-lifecycle-determinism.md` | B26 | §4.9 | Delivered | Implementation | B25 |
| `b27-4.4-disposition-coverage-gap-closure.md` | B27 | §4.4 | Delivered | Registry-sync | B18 |

Slice naming: `b<N>-<pas-section>-<slug>.md`.

Handoff format: 9 fields — see `.cursor/skills/kernel-authority/reference/pas-doc-template.md`.

---

# 13. Required Gates

## 13.1 Required

Run before accepting any `@afenda/architecture-authority` change:

```bash
pnpm --filter @afenda/architecture-authority typecheck
pnpm --filter @afenda/architecture-authority test:run
pnpm quality:architecture
pnpm architecture:cycles
pnpm architecture:drift
pnpm quality:boundaries
pnpm check:foundation-disposition
```

If package scripts differ, the package-local scripts are authoritative only after being confirmed against `package.json`.

## 13.2 Recommended

```bash
pnpm quality
pnpm check:documentation-drift
pnpm check:kernel-package-structure
```

Recommended gates become required when the slice changes files governed by those gates.

## 13.3 Promotion rules

* Recommended gates must not block CI until implemented.
* Once implemented, recommended gates become required for affected slices.
* Missing future gates must not block unrelated source-only cleanup.
* A gate that validates architecture authority itself must have deterministic output.
* A gate failure must provide an actionable file path, registry key, or package name.
* Waivers must be explicit registry records, not comments hidden inside tests.

---

# 14. Reusable Package Guardrail Template

See `docs/PAS/README.md` for how to create a new PAS.

Reusable template:

```text
.cursor/skills/kernel-authority/reference/pas-doc-template.md
```

Each package authority standard should have:

* one canonical PAS document
* one agent skill adapter: `.cursor/skills/<package-name>-authority/SKILL.md`
* one optional package-local tombstone pointer
* no duplicated long-form authority outside `docs/PAS/`
* runtime gates that prove the package boundary
* slice catalog entries for serialized delivery

For this PAS, the expected companion files are:

```text
docs/PAS/PAS-002-ARCHITECTURE-AUTHORITY-STANDARD.md
packages/architecture-authority/PAS-002-ARCHITECTURE-AUTHORITY-STANDARD.md
.cursor/skills/architecture-authority/SKILL.md
.cursor/skills/architecture-authority/reference/package-structure.md
.cursor/skills/architecture-authority/reference/authority-surfaces.md
```

The package-local file should be a pointer or tombstone, not a duplicated full authority document, unless Architecture Authority explicitly approves package-local duplication.

---

# 15. Final Doctrine

`@afenda/architecture-authority` is the package that tells Afenda whether the monorepo is structurally legal. It owns package identity, layer assignment, ownership, lifecycle, dependency direction, architecture drift, and architecture gates. It is not a runtime product package, not a UI package, not a database package, not a Kernel identity package, and not a business module.

> **May belong here:** package registry rows, ownership records, layer boundary rules, architecture drift entries, architecture gate logic.

> **Belongs outside:** business master data, runtime module behavior, UI rendering, database schema, auth sessions, outbox workers, audit writing, ERP route behavior.

Architecture Authority owns **structure**.
Kernel owns **global primitives** ([PAS-001](KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)).
Business modules own **business meaning**.
Applications own **composition and user-facing behavior**.

When in doubt, apply the kernel-authority three-question test before adding functions to any Foundation package: no data loading, no formatting/UI text, no business decision fallbacks.
