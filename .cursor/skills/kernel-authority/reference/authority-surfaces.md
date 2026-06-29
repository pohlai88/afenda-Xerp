# Authority Surfaces Reference

Detailed TypeScript shapes for all `@afenda/kernel` authority surfaces.

← Back to [SKILL.md](../SKILL.md) | Composed: [PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md](../../../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) | Archive: [PAS-001 §4+](../../../../docs/PAS/KERNEL/archive/PAS-001-KERNEL-AUTHORITY-STANDARD.md)

**Status labels used in this file:**

| Label | Meaning |
|---|---|
| `Status: Current` | Matches current source in `packages/kernel/src/` |
| `Status: Target / proposed` | Planned addition — not yet implemented, requires a dedicated kernel slice |

---

## Brand utility

Status: Current — `packages/kernel/src/identity/brand/brand.contract.ts`

```ts
declare const brandSymbol: unique symbol;

// Branded values remain plain strings at runtime and serialize as JSON strings.
// Brand only at trust boundaries (DB rows, auth session, validated input).
export type Brand<TValue, TBrand extends string> = TValue & {
  readonly [brandSymbol]: TBrand;
};

// Strip the compile-time brand — safe for logging and wire formats.
export function unbrand<TValue extends string, TBrand extends string>(
  value: Brand<TValue, TBrand>
): TValue;
```

---

## Branded IDs

Status: Current — `packages/kernel/src/contracts/platform-id.contract.ts`

All cross-package identifiers use `Brand<string, "...">`.

```ts
// Platform IDs
export type TenantId          = Brand<string, "TenantId">;
export type EntityGroupId     = Brand<string, "EntityGroupId">;
export type CompanyId         = Brand<string, "CompanyId">;
export type OrganizationId    = Brand<string, "OrganizationId">;
export type TeamId            = Brand<string, "TeamId">;
export type ProjectId         = Brand<string, "ProjectId">;

// Identity IDs
export type UserId            = Brand<string, "UserId">;
export type RoleId            = Brand<string, "RoleId">;
export type MembershipId      = Brand<string, "MembershipId">;
export type PermissionId      = Brand<string, "PermissionId">;
export type PolicyId          = Brand<string, "PolicyId">;
export type AuditEventId      = Brand<string, "AuditEventId">;
export type OwnershipInterestId = Brand<string, "OwnershipInterestId">;

// Execution IDs
export type ExecutionId       = Brand<string, "ExecutionId">;
export type CorrelationId     = Brand<string, "CorrelationId">;

// Business master data IDs
export type CustomerId        = Brand<string, "CustomerId">;
export type SupplierId        = Brand<string, "SupplierId">;
export type ProductId         = Brand<string, "ProductId">;
export type EmployeeId        = Brand<string, "EmployeeId">;
export type WarehouseId       = Brand<string, "WarehouseId">;

// Global primitive code brands — cross-package only, no business decisions
export type LocaleCode    = Brand<string, "LocaleCode">;
export type TimezoneId    = Brand<string, "TimezoneId">;
export type DateFormat    = Brand<string, "DateFormat">;
export type NumberFormat  = Brand<string, "NumberFormat">;
export type CurrencyCode  = Brand<string, "CurrencyCode">;
export type CountryCode   = Brand<string, "CountryCode">;
export type UomCode       = Brand<string, "UomCode">;
export type DocumentId    = Brand<string, "DocumentId">;
export type AssetId       = Brand<string, "AssetId">;
```

All primitive code brands above are **Status: Current** in `platform-id.contract.ts`.

**PAS §4.1 production surface (current):**

| Module | Role |
|--------|------|
| `platform-id-registry.contract.ts` | Machine authority — 29 families + forbidden fiscal IDs |
| `platform-id.contract.ts` | Brand types + symmetric `brand*` / `brandRequired*` / `to*` |
| `platform-id-boundary.contract.ts` | Wire normalizers + compile-time registry coverage guard |

Gate: `pnpm check:kernel-platform-id-surface`

`FiscalCalendarId` and `FiscalPeriodId` are **not** kernel additions. They belong to Finance / Accounting. Do not add them to kernel unless a future approved cross-package contract explicitly requires a branded reference.

---

## Result and Error Vocabulary

### Result shape

Status: Current — `packages/kernel/src/contracts/result.contract.ts`

```ts
export interface ResultSuccess<TValue> {
  readonly ok: true;
  readonly value: TValue;
}

export interface ResultFailure<E = Error> {
  readonly error: E;
  readonly ok: false;
}

export type Result<TValue, E = Error> =
  | ResultSuccess<TValue>
  | ResultFailure<E>;

// Constructors
export function ok<TValue>(value: TValue): ResultSuccess<TValue>;
export function err<E = Error>(error: E): ResultFailure<E>;
export function isOk<TValue, E>(result: Result<TValue, E>): result is ResultSuccess<TValue>;
export function isErr<TValue, E>(result: Result<TValue, E>): result is ResultFailure<E>;
```

### AppErrorCode

Status: Current — `packages/kernel/src/contracts/app-error.contract.ts`

The current kernel has **6 error codes**. Additional codes (`RATE_LIMIT_EXCEEDED`, `SERVICE_UNAVAILABLE`, `TIMEOUT`, `PAYMENT_REQUIRED`) are not yet implemented.

```ts
export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";
```

### AppError

Status: Current — `packages/kernel/src/contracts/app-error.contract.ts`

`AppError` is a **discriminated union** keyed on `code`. Each variant carries `userMessage`. Do not simplify to a generic `{ code, message, details }` shape — that loses the semantic precision.

```ts
export type ValidationFieldError = {
  readonly path: string;
  readonly message: string;
};

export type AppError =
  | {
      readonly code: "VALIDATION_ERROR";
      readonly userMessage: string;
      readonly fields?: readonly ValidationFieldError[];
    }
  | { readonly code: "UNAUTHORIZED"; readonly userMessage: string }
  | { readonly code: "FORBIDDEN"; readonly userMessage: string }
  | {
      readonly code: "NOT_FOUND";
      readonly userMessage: string;
      readonly resource?: string;
    }
  | {
      readonly code: "CONFLICT";
      readonly userMessage: string;
      readonly conflictOn?: string;
    }
  | {
      readonly code: "INTERNAL_ERROR";
      readonly userMessage: string;
      readonly cause?: unknown;
    };
```

Factory helpers exist as `AppErrors.validation()`, `AppErrors.unauthorized()`, etc. — see source for full signatures.

### ProblemDetail

Status: Current — `packages/kernel/src/contracts/problem-detail.contract.ts`

Kernel defines a `ProblemDetail` wire shape aligned with **RFC 9457**. Separate from `AppError`; HTTP status mapping owned by API governance.

```ts
interface ProblemDetail {
  readonly type: string;
  readonly title: string;
  readonly detail?: string;
  readonly instance?: string;
}
```

---

## ExecutionContext

Status: Current — `packages/kernel/src/contracts/execution-context.contract.ts`

```ts
export const EXECUTION_CONTEXT_SOURCES = [
  "api",
  "cron",
  "event",
  "manual",
  "system",
  "outbox",
  "job",
] as const;

export type ExecutionContextSource = (typeof EXECUTION_CONTEXT_SOURCES)[number];

export interface ExecutionContext {
  readonly actorId: UserId | null;
  readonly companyId: CompanyId | null;
  readonly correlationId: CorrelationId;
  readonly executionId: ExecutionId;
  readonly organizationId: OrganizationId | null;
  readonly source: ExecutionContextSource;
  readonly startedAt: string;     // ISO 8601
  readonly tenantId: TenantId | null;
  readonly traceId: string | null;
  readonly spanId: string | null;
}
```

Note: `traceId` and `spanId` fields are **not in current source**. They are a target addition (see below).

**Factory functions (current):**

```ts
export function createExecutionContext(input: ExecutionContextInput): ExecutionContext;
export function assertExecutionContext(context: ExecutionContext): ExecutionContext;
```

**Planned additions** (Status: Target / proposed — requires ExecutionContext enrichment slice):

```ts
// Fields to add in a future slice
readonly traceId?: string | null;   // plain string — kernel must not import OpenTelemetry
readonly spanId?: string | null;
```

---

## Operating Context

Status: Current (operating-context shape) — `packages/kernel/src/context/`

```text
Tenant                 ← SaaS and security boundary
└─ EntityGroup         ← corporate group boundary
   └─ LegalEntity      ← statutory boundary (alias: Company)
      └─ OwnershipInterest   ← consolidation metadata
      └─ OrganizationUnit    ← operational boundary
         └─ Team             ← execution scope
         └─ Project          ← initiative scope (planned)
            └─ Workspace     ← runtime/UI context
            └─ Surface       ← runtime string ID
            └─ Workflow      ← workflow context
               └─ PermissionScope    ← grant boundary
               └─ ConsolidationScope ← accounting readiness metadata
               └─ AccountingReadiness ← gate signal, not runtime
```

**Ownership rules:**

| Concern | Owner |
|---|---|
| Operating context shape | `@afenda/kernel` (current) |
| Operating context resolver | `apps/erp` |
| Persistence | `@afenda/database` |
| Permission evaluation | `@afenda/permissions` |
| Audit writing | `@afenda/observability` |
| Runtime execution | `@afenda/execution` |

### Wire context module triad (PAS-001 §4.4)

When a context accepts wire input (API, events, imports):

| File | Role |
| --- | --- |
| `*.contract.ts` | `FooContext` (branded) + `WireFooContext` (JSON-safe plain fields) |
| `*.assert.ts` | Block invalid wire values before any brand is applied |
| `*.parser.ts` | `parseFooContext(wire)` using identity `parse*` / `to*` only |

```text
bad data → wire → assert rejects → parser → branded context → safe downstream consumption
```

Branded context is an **output** of parsing, never assumed from untrusted input. Reference: `localization-context.{contract,assert,parser}.ts`.

---

## Localization and Global Format Vocabulary

Status: Current — `packages/kernel/src/identity/primitives/` · `packages/kernel/src/context/localization-context.{contract,assert,parser}.ts`

Kernel owns global localization and formatting vocabulary so Finance, Warehouse, HRM, Inventory, Sales, Procurement, and Reporting do not invent incompatible contracts.

**Primitive code brands** — `packages/kernel/src/identity/primitives/` (`locale-code`, `timezone-id`, `date-format`, `number-format`, `currency-code`, `country-code`, `uom-code` contracts + `primitive-reference.registry.ts`).

**Localization context wire triad** — PAS-001 §4.4:

```ts
// localization-context.contract.ts
interface LocalizationContext {
  readonly localeCode: LocaleCode;
  readonly timezoneId: TimezoneId;
  readonly dateFormat: DateFormat;
  readonly numberFormat: NumberFormat;
}

interface WireLocalizationContext {
  readonly localeCode: string;
  readonly timezoneId: string;
  readonly dateFormat: string;
  readonly numberFormat: string;
}
```

Ingress: `assertWireLocalizationContext` → `parseLocalizationContext` → branded `LocalizationContext`.

**IANA timezone rule:** `TimezoneId` values must follow the IANA Timezone Database (tzdata) identifier format — e.g. `"America/New_York"`, `"Europe/Amsterdam"`. UTC offsets such as `"+07:00"` are not timezone identifiers.

**UomCode rule:** Global primitive shared across Inventory, Procurement, Manufacturing, Finance, and Reporting (SAP `MSEHI`, Oracle `UOM_CODE`). Not inventory behavior — cross-package unit-of-measure code brand only.

**What kernel must not own:**

| Concern | Correct owner |
|---|---|
| User selected locale/timezone/format | ERP / user settings |
| Company default locale/timezone | Company/legal entity settings |
| Warehouse/location timezone | Warehouse/location master |
| Date/number formatting implementation | ERP / UI / reporting layer |
| Translation files | ERP / UI / localization package |
| Fiscal calendar, year, period | Finance / Accounting |
| Functional/base/reporting currency | Finance / legal entity / consolidation |
| Currency conversion | Finance / Accounting |
| UOM master rows and conversion rules | Inventory / reference-data owner |
| Country master data | Database / governed reference-data owner |
| Statutory country rules | Legal/compliance domain owner |

Do not create `context/currency-context.contract.ts` or `context/fiscal-calendar-context.contract.ts`.

---

## Actor Kind and Integration Identity

Status: Current — `packages/kernel/src/identity/wire/actor-kind.contract.ts` · `integration-identity.contract.ts` · `auth-actor-identity.contract.ts`

Kernel NS §3.1 · E12 — distinguishes human, service, system, and delegated-application initiators at wire boundaries. Session resolution and OAuth/token runtime live outside kernel — vocabulary and ingress validation only.

```ts
// actor-kind.contract.ts
export const ACTOR_KINDS = [
  "human",
  "service",
  "system",
  "delegated_application",
] as const;

export type ActorKind = (typeof ACTOR_KINDS)[number];

// integration-identity.contract.ts
interface IntegrationIdentity {
  readonly provider: string;
  readonly externalId: string;
}

// auth-actor-identity.contract.ts — E12 slots on auth actor bridge
interface AuthActorIdentity {
  readonly actorKind?: ActorKind;
  readonly authSubjectId: AuthSubjectId;
  readonly integrationIdentity?: IntegrationIdentity;
  readonly userPk?: InternalEntityPk;
  readonly userId?: UserId;
}
```

**Consistency rules (ingress):**

| actorKind | integrationIdentity | userId |
| --- | --- | --- |
| `human` | must be absent | optional |
| `service` / `delegated_application` | optional | must be absent |
| `system` | optional | optional |

Public API: `parseAuthActorIdentity` / `serializeAuthActorIdentity` · `parseIntegrationIdentity` / `serializeIntegrationIdentity` · `assertActorKind` / `parseOptionalActorKind`.

---

## Policy Decision Vocabulary

Status: Current — `packages/kernel/src/policy/` · export `@afenda/kernel/policy`

```ts
export type PolicyDecisionKind = "allow" | "deny" | "gate" | "defer";

export type PolicyDenialReason =
  | "unauthorized"
  | "forbidden"
  | "rate_limited"
  | "quota_exceeded"
  | "feature_disabled"
  | "plan_required"
  | "context_required"
  | "tenant_suspended"
  | "outside_scope";
```

**Planned ownership:** Kernel owns vocabulary. `@afenda/permissions` owns evaluation.

---

## Domain Event Envelope

Status: Current — `packages/kernel/src/events/` · export `@afenda/kernel/events` · root barrel re-exports wire triad

Wire triad (PAS-001 §4.4 / §9 rule 14):

```text
domain-event.contract.ts   # DomainEvent + WireDomainEvent + isDomainEvent
domain-event.assert.ts     # assertWireDomainEvent / assertDomainEvent + compile-time JSON guard
domain-event.parser.ts       # parseUnknownDomainEvent / serializeDomainEvent
```

```ts
interface DomainEvent<TPayload extends JsonObject = JsonObject> {
  readonly eventId: string;
  readonly eventName: string;
  readonly schemaVersion: number;
  readonly tenantId: TenantId | null;
  readonly tenantPk?: InternalEntityPk;   // PAS §4.1.9 dual-field — optional internal PK
  readonly correlationId: CorrelationId;
  readonly causationId: string | null;
  readonly occurredAt: string;            // ISO 8601
  readonly payload: TPayload;
}

interface WireDomainEvent<TPayload extends JsonObject = JsonObject> {
  readonly eventId: string;
  readonly eventName: string;
  readonly schemaVersion: number;
  readonly tenantId: string | null;
  readonly tenantPk?: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly occurredAt: string;
  readonly payload: TPayload;
}
```

Public API:

```ts
parseUnknownDomainEvent(value: unknown): DomainEvent;
serializeDomainEvent(value: DomainEvent): WireDomainEvent;
assertWireDomainEvent(value: unknown): asserts value is WireDomainEvent;
```

Execution consumer (`@afenda/execution`): `toDomainEventFromOutboxRecord` / `toDomainEventFromOutboxEnvelope` in `domain-event-bridge.contract.ts` — maps outbox persistence to kernel wire ingress without redefining the envelope.

Rules: Events must be JSON-serializable. Events must carry correlation context. Kernel does not own dispatch, outbox, retry, or scheduling — `@afenda/execution` owns those behaviors.

---

## Async Context Propagation

Status: Current — `packages/kernel/src/propagation/` · export `@afenda/kernel/propagation`

```ts
interface KernelContextFrame {
  readonly executionContext: ExecutionContext;
  readonly tenantId: TenantId | null;
  readonly correlationId: CorrelationId;
}

interface KernelContext {
  run<T>(frame: KernelContextFrame, fn: () => T): T;
  get(): KernelContextFrame | null;
  fork<T>(overrides: Partial<KernelContextFrame>, fn: () => T): T;
}
```

Rules (target):
- `run()` starts an isolated frame.
- `get()` returns the current frame or `null`.
- `fork()` shallow-clones the current frame and applies overrides.
- No shared mutable frame may leak across `Promise.all()`.
- Implementation will use `AsyncLocalStorage` internally.
- No database transaction, request, session, permission result, or React/Next object may enter kernel context.
- No Finance/HRM/Inventory/CRM/Procurement context may enter kernel context.

---

## Business Reference Identity Authority

Status: Current (reference IDs) — `packages/kernel/src/contracts/business-master-data/`

Kernel owns cross-package reference identity vocabulary only — not business record runtime.

| Reference ID | Kernel owns ID | Runtime owner |
|---|---|---|
| `CustomerId` | Yes | CRM/Sales when activated |
| `SupplierId` | Yes | Procurement when activated |
| `ProductId` | Yes | Inventory/Product owner |
| `EmployeeId` | Yes | HRM owner |
| `WarehouseId` | Yes | Inventory/Warehouse owner |
| `DocumentId` | Target / proposed | Document/storage/workflow owner |
| `AssetId` | Target / proposed | Fixed asset/domain owner |

Business Partner convergence (MNC ERP standard): SAP S/4HANA and Oracle EBS unify Customer and Supplier into a single Business Partner entity. Current `CustomerId` / `SupplierId` split is correct for now. When a unified business-partner domain package is activated, introduce `BusinessPartnerId` through an approved kernel slice — do not invent a third parallel pattern.

---

## Permission Model Vocabulary

Status: Current vocabulary (action/scope words) — composed: [PAS-001 §8](../../../../docs/PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) · archive: [PAS-001 §8](../../../../docs/PAS/KERNEL/archive/PAS-001-KERNEL-AUTHORITY-STANDARD.md#8-permission-model-standard)

Kernel defines the vocabulary pattern. `@afenda/permissions` owns registry and evaluation.

```text
permission = module × action × scope
```

Action vocabulary: `create`, `read`, `update`, `delete`, `approve`, `export`, `import`, `manage`, `assign`, `revoke`

Scope vocabulary: `tenant`, `entity_group`, `legal_entity`, `organization_unit`, `team`, `project`, `own_data`, `assigned`, `global`

---

## Accounting Domain Vocabulary

Status: Current (vocabulary only) — `packages/kernel/src/erp-domain/accounting/`

Kernel currently owns these vocabulary contracts:

```ts
// account-type.contract.ts — Status: Current
// fiscal-period-state.contract.ts — Status: Current
// journal-document-type.contract.ts — Status: Current
// posting-status.contract.ts — Status: Current
// accounting-permission-vocabulary.contract.ts — Status: Current
// accounting-id.contract.ts — Status: Current
// accounting-domain-wire-context.contract.ts — Status: Current
```

These are vocabulary and branded IDs only — no posting service, no ledger, no calculation logic.
