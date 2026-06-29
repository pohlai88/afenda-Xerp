---
name: kernel-authority
description: Enforces the @afenda/kernel boundary: zero-dependency platform vocabulary, branded IDs, operating context contracts, execution context, authority registries, and guarded runtime exceptions only.
paths:
  - packages/kernel/**
  - docs/PAS/KERNEL/**
  - docs/NORTHSTAR/kernel-north-star.md
  - docs/BLUEPRINT/kernel-blueprint.md
---

# @afenda/kernel — Authority Skill (PAS-001)

## PAS rollout status (mirror header — sync on slice close)

| Field | Value |
| --- | --- |
| **Runtime status** | Enterprise Accepted — kernel contracts, B49–B70 + B107–B113 amendment closed (B112 rounding/precision · B113 E12 actor/integration identity), runtime gates operational |
| **Remaining slices** | none — B113 Delivered ([`KERNEL/SLICE/b113-actor-kind-integration-identity-vocabulary.md`](../../../docs/PAS/KERNEL/SLICE/b113-actor-kind-integration-identity-vocabulary.md)) |

### PAS-001A — ERP Integration Spine (derived; does not reopen PAS-001)

| Field | Value |
| --- | --- |
| **Runtime status** | `integration-proven` (IS-001/IS-002/IS-003/IS-004) · R1a–R1d Delivered · R2 S2S attestation Delivered · B112-ERP format precision ingress Delivered · **R3 API contract runtime Delivered** (R3a–R3d) · `check:erp-metadata-pas006-consumer` · `check:erp-service-actor-s2s-attestation` · `check:erp-format-precision-ingress-attestation` · R3 gates `check:api-contracts` · `check:openapi-drift` · `check:api-route-catalog` · `lint:openapi` active |
| **Remaining slices** | none — R3a–R3d Delivered — [`pas-001a-r3-api-contract-runtime.md`](../../../docs/PAS/API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md) · PAS-API-001 S-track S1–S9 Delivered |
| **Canonical** | [`PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md`](../../../docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) · [`PAS-API-001`](../../../docs/PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [`PAS-API-REST-001`](../../../docs/PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) |

> PAS-001: [`KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md`](../../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) · Slices: [`KERNEL/SLICE/`](../../../docs/PAS/KERNEL/SLICE/README.md) · Index: [`pas-status-index.md`](../../../docs/PAS/pas-status-index.md) · **Lanes:** [`DEVELOPMENT-LANE-BOUNDARIES.md`](../../../docs/PAS/DEVELOPMENT-LANE-BOUNDARIES.md) (do not parallel PAS-005 CSS)

**Doctrine:** Kernel is not ERP runtime — kernel is the accepted vocabulary consumed by ERP runtime. Load PAS-001A §0 + §3 Context Map + §4 Governance Rules when touching `apps/erp/src/lib/context/**`, permission-scope wiring, or `CONTEXT_INTEGRATION_WIRING`. Pair with `multi-tenancy-erp`. **API contract (R3 Delivered):** [api-contract North Star](../../../docs/NORTHSTAR/api-contract-north-star.md) · [PAS-API-001](../../../docs/PAS/API-CONTRACT/PAS-API-001-PLATFORM-API-CONTRACT-AUTHORITY-STANDARD.md) · [PAS-API-REST-001](../../../docs/PAS/API-CONTRACT/REST/PAS-API-REST-001-REST-OPENAPI-BINDING-STANDARD.md) · [PAS-001A-API-BINDING](../../../docs/PAS/KERNEL/PAS-001A-API-BINDING-ERP-INTEGRATION-SPINE-CONSUMPTION.md) · [R3 handoff](../../../docs/PAS/API-CONTRACT/REST/SLICE/pas-001a-r3-api-contract-runtime.md).

### PAS-001B — ERP Wire Vocabulary Catalog Standard (derived from PAS-001 §4.8)

| Field | Value |
| --- | --- |
| **PAS ID** | PAS-001B |
| **Document title** | ERP Wire Vocabulary Catalog Standard |
| **Authority role** | `catalog_authority` |
| **Registry lane** | `PKGR01B_ERP_DOMAIN_CATALOG` |
| **Primary owner** | `packages/kernel/src/erp-domain/` |
| **Runtime status** | Catalog Authority — B76–B106 + KV1–KV3 closed; 28/28 modules; layout gate **12/12**; `./erp-domain/catalog`; per-module `*_MODULE_KV_ID` barrels |
| **Remaining slices** | none — consumer metadata spine = PAS-001A-R1 (not PAS-001B) |
| **Canonical** | [`PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md`](../../../docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) |

**Doctrine:** PAS-001B defines the **ERP wire vocabulary catalog map** — wire shapes in kernel; meaning in Enterprise Knowledge; runtime in domain packages. Rule 1: no filesystem folders for `catalog-only` modules. Load PAS-001B §0 hard rules when touching `packages/kernel/src/erp-domain/**`.

---

## Boundary (one sentence)

The kernel defines **cross-package facts, branded vocabulary, wire-safe contracts, and execution context primitives**; it never implements business behavior, persistence, transport, rendering, formatting, authorization evaluation, accounting logic, or external integration.

---

## When to use this skill

Apply this skill when touching:

- `packages/kernel/**`
- any `@afenda/kernel` import
- `ExecutionContext`, `OperatingContext`, `KernelContextFrame`
- `packages/kernel/src/identity/` — canonical enterprise ID constitution (PAS §4.1 / ADR-0021)
- `ExecutionContext`, `OperatingContext`, `KernelContextFrame`
- `identity/enterprise-id.contract.ts`, `app-error.contract.ts`, `execution-context.contract.ts`
- `context-registry.ts`, `erp-domain/accounting`, `propagation`, `events`, `policy`
- any cross-package branded ID question

---

## Decision matrix

> Can this belong in kernel?

| Question | If yes → | In kernel? |
|---|---|---|
| Is it an ID crossing package boundaries? | Branded ID | **Yes** |
| Is it a primitive localization/format code crossing packages? | Branded primitive or `LocalizationContext` shape | **Yes** |
| Is it a UOM code crossing packages? | Branded `UomCode` primitive | **Yes** |
| Is it a lifecycle state used across packages? | Shared vocabulary | **Yes** |
| Is it a permission decision word? | Shared vocabulary | **Yes** |
| Is it a wire-safe event envelope? | Shared integration vocabulary | **Yes** |
| Is it accounting vocabulary (not runtime)? | Cross-domain contract | **Yes** |
| Is it date/number formatting implementation? | Rendering/application behavior | **No** |
| Is it selected locale/timezone/date-format value? | User/company/location setting | **No** |
| Is it functional/base/reporting currency decision? | Finance/accounting configuration | **No** |
| Is it fiscal calendar or fiscal period behavior? | Finance/accounting configuration | **No** |
| Is it a database table or query? | Persistence | **No** |
| Is it a resolver that loads real data? | App/database behavior | **No** |
| Is it actual permission evaluation? | Runtime logic | **No** |
| Is it event dispatch or retry? | Execution runtime | **No** |
| Is it ledger/posting/calculation? | Accounting runtime | **No** |
| Is it country/UOM master-row ownership? | Reference-data/domain persistence | **No** |
| Is it a cross-package business record reference ID? | Business reference identity | **Yes, as ID only** |
| Is it required by only one package? | Not shared vocabulary | **No** |

---

## Hard stops

### Prohibited imports — never add these to kernel

```
@afenda/database  @afenda/auth  @afenda/permissions  @afenda/execution
@afenda/observability  @afenda/appshell  apps/erp
Drizzle  Better Auth  Next.js  React  Zod
HTTP clients  Database clients  Cloud SDKs  External runtime libraries
```

### Kernel must never own

```
Database schema / migrations / clients / RLS policies
Auth sessions / cookies / providers
Permission evaluation / feature flag evaluation / entitlement evaluation
API route handlers / server actions
React components / UI primitives / app shell navigation
Domain workflows / business services / integration SDKs
Cron jobs / queue workers / outbox publishing
Accounting posting / ledger calculation / consolidation elimination
Inventory stock movement / HRM payroll / CRM pipeline / Procurement approval
```

### Documentation-only slices

When the current task is **explicitly documentation or skill maintenance only**, add:

```
Do not modify packages/kernel/src/**
Do not implement propagation/events/policy contracts
Do not change package exports
Do not mark any runtime capability complete
```

For implementation slices, the Phase 0 contract governs scope — not this list.

---

## Phase 0 — kernel change contract

Before editing any kernel file, state these six lines:

```
1. Objective       — the exact change, in one sentence
2. Allowed layer   — packages/kernel only
3. Files to change — explicit list
4. Prohibited      — packages/apps that must not be touched
5. Authority       — Platform Authority (PAS-001)
6. Gates           — pnpm --filter @afenda/kernel typecheck
                     pnpm --filter @afenda/kernel test:run
                     pnpm quality:boundaries
                     (+ relevant gates from §Required gates below)
```

---

## Required read order

For new kernel slices, read in this order:

1. This file (SKILL.md) — boundary, hard stops, Phase 0
2. [authority-surfaces.md](reference/authority-surfaces.md) — TypeScript shapes, operating context hierarchy
3. [package-structure.md](reference/package-structure.md) — folder tree summary, exports, gates
4. [packages/kernel/PAS-001-KERNEL-TREE.md](../../../packages/kernel/PAS-001-KERNEL-TREE.md) — annotated package-local filesystem map (drift markers)
5. [docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md](../../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) — composed governance SSOT (§0 Agent Quick Path)
6. [docs/PAS/KERNEL/SLICE/](../../../docs/PAS/KERNEL/SLICE/README.md) — paste 9-field handoff into Phase 0 before implementation
7. Archive [PAS-001 §4–§16](../../../docs/PAS/KERNEL/archive/PAS-001-KERNEL-AUTHORITY-STANDARD.md) — contract detail when implementing a cited surface
8. **Identity constitution (PAS §4.1):** [ADR-0021](../../../docs/adr/ADR-0021-canonical-enterprise-identity.md) · [ADR-0022](../../../docs/adr/ADR-0022-postgres-split-id-persistence-model.md) · [ADR-0023](../../../docs/adr/ADR-0023-tenant-human-reference-numbering.md) · [architecture/identity/](../../../docs/PAS/KERNEL/identity/canonical-enterprise-id-constitution.md)

**Slice gate:** Kernel identity runtime work (Slice B) starts only after ADR-0021, ADR-0022, and ADR-0023 are **Accepted**.

---

## Authority surface summary

| Surface | Kernel owns | Kernel does not own |
|---|---|---|
| Branded IDs | All cross-package IDs | Domain-internal IDs, FiscalCalendarId, FiscalPeriodId |
| Localization vocabulary | `LocaleCode`, `TimezoneId`, `DateFormat`, `NumberFormat`, `LocalizationContext` shape | Selected values, formatting implementation, translation files |
| Global primitive codes | `CurrencyCode`, `CountryCode`, `UomCode` | Currency decisions, UOM master rows, conversion rules |
| Result/Error | `Result<T,E>`, `AppError` (discriminated union), `AppErrorCode` (6 codes) | HTTP status mapping |
| ExecutionContext | Shape + `ExecutionContextSource` const | Loading, resolving |
| OperatingContext | Hierarchy shape | Resolver, persistence |
| Platform entity registry | ID + owning contract path | DB queries, migrations |
| Business reference IDs | Cross-package reference identity vocabulary | Business behavior, CRUD, persistence |
| Accounting vocabulary | Vocabulary + branded IDs | Posting, ledger, calculation |
| Policy vocabulary | `PolicyDecisionKind`, `PolicyDenialReason` | Evaluation logic |
| Domain event envelope | Envelope + metadata shape | Dispatch, outbox, retry |
| Async context propagation | `run()`, `get()`, `fork()` | DB transactions, HTTP context, domain context |

Full TypeScript shapes → [reference/authority-surfaces.md](reference/authority-surfaces.md)

---

## Contract rules (checklist)

Before any kernel contract is merged:

- [ ] TypeScript strict mode
- [ ] No external imports (only within kernel)
- [ ] JSON-serializable where used across boundaries
- [ ] Branded IDs for all cross-package identifiers
- [ ] All object properties are `readonly`
- [ ] Explicit `null` for absent runtime context — no silent fallback
- [ ] No untyped `string` for governed IDs
- [ ] No hidden business logic
- [ ] No side effects during import
- [ ] No duplicated current-source contract pattern (extend existing `brand.contract.ts` / `platform-id.contract.ts` style)
- [ ] No greenfield replacement of existing brand or `AppErrors.*` helpers without a dedicated migration slice
- [ ] No source-incompatible example stubs in canonical docs or reference files
- [ ] **Wire context triad** (when context accepts wire input): `*.contract.ts` + `*.assert.ts` + `*.parser.ts` — branded context only after `parse*` validation (PAS-001 §4.4, §9 rule 14)

### Wire context module triad (PAS-001 §4.4)

Every context with wire input must have three sibling modules:

```text
<name>-context.contract.ts   # branded internal + Wire* types
<name>-context.assert.ts     # reject invalid wire before branding
<name>-context.parser.ts     # wire → branded via identity parse* only
```

```text
bad data enters wire → assert rejects → parser applies parse* → branded context
```

No silent `as TenantId` casts. No default tenant/company/org fallback. Downstream code must never receive unvalidated wire shapes as branded context.

**Reference:** `localization-context.{contract,assert,parser}.ts` · `hierarchy-id-boundary.{contract,assert,parser}.ts` (B68 wire triad).

### Pure derivation (allowed in kernel)

Kernel may export **pure** functions that derive contract shapes from already-trusted wire input (e.g. `deriveConsolidationScopeContext`, `isOwnershipInterestEffectiveAt`). These are not ERP/database resolvers.

**Moved out of kernel (do not re-add):**
- `toAccountingReadinessContext`, `resolveReportingCurrency`, `isCostCenterOrganizationUnit` → `apps/erp/src/lib/context/accounting-readiness.projection.ts`
- `formatWorkspaceDisplayLabel`, AppShell switch-target types → `@afenda/appshell`
- Gate live snapshot types → `apps/erp/src/lib/system-admin/accounting-readiness-gate-live-status.contract.ts`

**Prohibited:** loading data from database, HTTP, session, or auth at resolver sites in kernel.

---

## Surface anti-patterns (what the import gate misses)

The boundary gate blocks cross-package prohibited imports. It does **not** catch locally defined functions and types that encode forbidden behavior. Flag these as `BLOCK` or `WARN` when found in kernel source.

| Anti-pattern | Example | Violation | Correct home |
|---|---|---|---|
| **Presentation helper** | `formatWorkspaceDisplayLabel()` | Formats UI label strings — PAS §4.5 no formatting | `@afenda/appshell` |
| **Currency decision function** | `resolveReportingCurrency()` | Encodes `reportingCurrency ?? baseCurrency` fallback — PAS §4.5/§7 no currency decisions | Finance / `@afenda/accounting` |
| **Forbidden ID through sub-domain** | `FiscalPeriodId` inside `erp-domain/accounting/` | PAS §4.1.6 forbidden platform floor — KV-ACCT only | `@afenda/kernel/erp-domain/accounting` ([ADR-0032](../../docs/adr/ADR-0032-fiscal-domain-id-authority.md)) |
| **Operational/diagnostic snapshot type** | `AccountingReadinessGateLiveSnapshot` | Gate telemetry is not cross-package vocabulary | ERP system-admin or `@afenda/observability` |
| **Self-import via package name** | `from "@afenda/kernel"` inside `packages/kernel/src/**` | Hides intra-package dependency graph — always use relative path | `./brand.contract.js` |
| **Repo governance in source** | `BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS` | Directory scaffold policy belongs in `scripts/governance/` | `scripts/governance/` or `packages/architecture-authority` |
| **Resolved permission record** | `PermissionScopeContext` with `membershipId`, `roleId` | Resolved scope, not permission vocabulary — PAS §8 | `@afenda/permissions` (vocabulary split to `permission-grant-vocabulary.contract.ts` in Slice 8; resolved shape remains transitional on kernel barrel) |
| **Live timestamp in contracts layer** | `new Date()` inside a context derivation function | Decides "now" at call time — contracts must not have live side effects | Caller supplies date |
| **Business classification rule** | `isCostCenterOrganizationUnit()` | Encodes Finance/org domain rule, not platform vocabulary | Finance domain or ERP context layer |

### Quick decision test

Before adding a function to kernel, pass it through all three:

```
1. Does it load, fetch, or resolve data?         → No  (data loading is prohibited)
2. Does it format, render, or compose UI text?   → No  (presentation is prohibited)
3. Does it make a business decision or fallback? → No  (decisions belong to the domain owner)
```

If any answer is Yes → the function does not belong in kernel, regardless of whether it has prohibited imports.

### Gate coverage reminder

| Violation | `quality:boundaries` catches it? |
|---|:---:|
| Prohibited cross-package import | Yes |
| Presentation helper in source | No |
| Currency decision function | No |
| Forbidden ID in allowed sub-folder | No |
| Self-import via package name | No |
| Repo scaffold policy in source | No |

Use `/pas-prohibited-surface-scan` when you need to audit these blind spots.

---

## Runtime rules

Kernel runtime code is only allowed when **all** are true:

1. Zero external dependencies
2. No access to database, HTTP, filesystem, auth, or environment secrets
3. Supports cross-package execution safety
4. Tested for isolation
5. Fails closed
6. No application-specific behavior

**Currently approved runtime primitive:** Async context propagation only.

---

## Implementation sequence

When adding new kernel content, follow this order:

```
1. Add primitive brands: LocaleCode, TimezoneId, DateFormat, NumberFormat, CurrencyCode, CountryCode, DocumentId, AssetId
2. Add LocalizationContext shape
3. Enrich AppError through current AppError / AppErrors.* style
4. Add RFC 9457-aligned ProblemDetail wire contract
5. Add optional traceId/spanId to ExecutionContext (Slice 3A — kernel only)
6. Add generic lifecycle/approval/document-state vocabulary (cross-package only)
7. Add policy decision vocabulary
8. Add strict JSON-safe wire utility types
9. Add async context propagation (Slice 6A)
10. Add domain event envelope
11. Add governance scripts (Slice 6B)
```

`UomCode` is **Slice 1B** — conditional on explicit PAS approval. Not in Slice 1.

Do not add FiscalCalendarContext, CurrencyContext, locale resolver, or formatting implementation in kernel.

---

## Required gates

```bash
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm quality:kernel-context-surface
pnpm check:kernel-platform-id-surface
pnpm check:accounting-domain-contracts
pnpm check:foundation-disposition
pnpm quality:boundaries
pnpm architecture:cycles
pnpm architecture:drift
```

Recommended (when adding propagation or events):

```bash
pnpm check:kernel-propagation-isolation
pnpm check:kernel-events-wire-serializable
pnpm check:kernel-zero-runtime-deps
```

---

## Acceptance criteria

### Current (must pass today)

| Category | Check | Required |
|---|---|---|
| Architecture | Kernel remains Platform layer | Pass |
| Architecture | Zero runtime package dependencies | Pass |
| Architecture | No database/auth/permissions/execution imports | Pass |
| Type safety | Existing IDs are branded | Pass |
| Type safety | Primitive brands + LocalizationContext | Pass |
| Type safety | ProblemDetail + json-wire + DomainEvent envelopes | Pass |
| Type safety | ExecutionContext traceId/spanId optional fields | Pass |
| Type safety | Existing contracts use `readonly` | Pass |
| Runtime safety | Propagation run/get/fork isolation | Pass |
| Governance | Boundary checks pass | Pass |
| Governance | `check:kernel-propagation-isolation` | Pass |
| Governance | `check:kernel-events-wire-serializable` | Pass |
| Governance | `check:kernel-zero-runtime-deps` | Pass |
| ERP readiness | Multi-tenant context remains explicit | Pass |
| ERP readiness | Accounting vocabulary remains contracts only | Pass |

### Target (slice-gated — not enforced until implemented)

| Category | Check | Slice |
|---|---|---|
| Type safety | UomCode primitive brand | 6 (blocked) |
| Integration | LegalEntity currency/country brand migration | 13 |
| Maintainability | consolidation-scope file rename | 4 (optional) |

---

## Doctrine

The kernel is not a dumping ground for shared code. It is the smallest possible stable language that lets Afenda ERP agree on identity, hierarchy, localization vocabulary, execution context, correlation, errors, lifecycle, policy vocabulary, event envelope, and cross-package references.

> If it describes a cross-package fact or primitive vocabulary, it may belong in kernel.
> If it decides, loads, calculates, formats, evaluates, renders, persists, or executes, it belongs outside kernel.

The kernel owns the words.
The owner package owns the decision.
The runtime layer owns the behavior.

---

## Sync checksum

| Source | Last synced |
| --- | --- |
| [KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md](../../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) | 2026-06-29 |
| [KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md](../../../docs/PAS/KERNEL/PAS-001A-ERP-INTEGRATION-SPINE-STANDARD.md) | 2026-06-29 |
| [KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md](../../../docs/PAS/KERNEL/PAS-001B-ERP-WIRE-VOCABULARY-CATALOG-STANDARD.md) | 2026-06-29 |
| [KERNEL/SLICE/kernel-slice-catalog.md](../../../docs/PAS/KERNEL/SLICE/kernel-slice-catalog.md) | 2026-06-29 |
