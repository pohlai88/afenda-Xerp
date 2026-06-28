# ADR-0021 — Canonical Enterprise ID Constitution

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Afenda `@afenda/kernel` previously exposed brand-only platform IDs (`Brand<string, "TenantId">`) with trim validation only. Cross-package identifiers need a governed enterprise contract: registered family prefix, sortable body, runtime parser, validator, generator, and wire ingress rules.

PostgreSQL persistence and tenant human reference numbers are **separate decisions** recorded in companion ADRs:

- [ADR-0022 — PostgreSQL Split-ID Persistence Model](./ADR-0022-postgres-split-id-persistence-model.md)
- [ADR-0023 — Tenant Human Reference Numbering](./ADR-0023-tenant-human-reference-numbering.md)

This ADR is the **Kernel constitution authority** for PAS §4.1. Slice B implements `packages/kernel/src/identity/` against this record. Slice C implements database persistence per ADR-0022.

---

## Decision

### Kernel owns the enterprise ID constitution

Single module authority: `packages/kernel/src/identity/` (target nested layout documented in PAS-001 §4.1.2 and kernel-authority `package-structure.md`).

Kernel owns:

- Canonical format: `<prefix>_<ulid_body>`
- `ID_FAMILIES` registry (prefix, type name, owner, `recordOwner`, `generates`) — see registry field definitions below
- Parser (`parseCanonicalId`, family `parse*`)
- Validator (`isCanonicalEnterpriseId`, non-throwing checks)
- Generator contract (`createCanonicalId`, `CanonicalIdBodyGenerator`) — **runtime minting** per [ADR-0024](./ADR-0024-canonical-id-body-generation.md)
- Wire boundary rules (parse at ingress — no unchecked casts)
- Primitive references separate from enterprise ID parser
- Governance prohibited patterns (no unregistered family, no duplicate prefix)

Domain packages own business master data and tenant human reference numbers — not canonical ID generation.

### Canonical format

```
<prefix>_<ulid_body>
```

| Part | Rule | Example |
|------|------|---------|
| `prefix` | Exactly 3 lowercase ASCII letters from `ID_FAMILIES`: `[a-z]{3}` | `emp`, `cus`, `ten` |
| `ulid_body` | 26 Crockford base32 chars | `[0-9A-HJKMNP-TV-Z]{26}` |

Example: `emp_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD`

### Registry field definitions

| Field | Definition |
|-------|------------|
| `prefix` | Exactly three lowercase ASCII letters: `[a-z]{3}`. No locale characters, digits, or symbols. |
| `owner` | Architectural authority for the ID contract itself (typically `@afenda/kernel`). |
| `recordOwner` | Package/domain that owns the lifecycle of records using this ID family. Example: Kernel governs the `EmployeeId` contract; HRM owns employee record lifecycle. |
| `generates` | When `true`, Kernel exposes `create*` for new IDs at governed write paths. |

### Brand typing (nominal only)

`Brand<T, B>` in `identity/brand/` is the lowest-level nominal mechanism — not a full ID contract.

Approved (public exports must constrain family to registered type names):

```ts
type EnterpriseIdFamily = keyof typeof ID_FAMILIES_BY_TYPE;

type CanonicalId<TFamily extends EnterpriseIdFamily> =
  Brand<`${IdPrefix}_${UlidBody}`, `CanonicalId:${TFamily}`>;
```

`TFamily` must be a registered family type name — not an arbitrary string. Low-level internal helpers may use wider branded outputs, but exported API surface must derive from `ID_FAMILIES`.

Prohibited as sole contract:

```ts
type CustomerId = Brand<string, "CustomerId">; // no prefix, parser, validator, or registry row
```

Every cross-package ID requires a registry row with `parse*` and (when `generates: true`) `create*`.

### Enterprise ID families (22)

| Category | Type names | Prefixes |
|----------|------------|----------|
| Tenant hierarchy | TenantId, EntityGroupId, CompanyId, OrganizationId, TeamId, ProjectId | `ten`, `egp`, `cmp`, `org`, `tea`, `prj` |
| Identity & access | UserId, RoleId, MembershipId, PermissionId, PolicyId | `usr`, `rol`, `mem`, `per`, `pol` |
| Audit & execution | AuditEventId, ExecutionId, CorrelationId | `aud`, `exe`, `cor` |
| Enterprise hierarchy | OwnershipInterestId | `own` |
| Business reference | CustomerId, SupplierId, ProductId, EmployeeId, WarehouseId, DocumentId, AssetId | `cus`, `sup`, `prd`, `emp`, `whs`, `doc`, `ast` |

No downstream package may invent `CustomerId`, `EmployeeId`, etc. without a registry row.

### Primitive references (7) — not enterprise IDs

Separate module: `identity/primitives/`. ISO/BCP47 patterns — not `prefix_ulid`:

`LocaleCode`, `TimezoneId`, `DateFormat`, `NumberFormat`, `CurrencyCode`, `CountryCode`, `UomCode`

Do not route primitives through the enterprise ID parser.

### Fiscal exception (forbidden platform-floor IDs)

Not approved at this stage:

- `FiscalCalendarId`
- `FiscalPeriodId`

These belong to Finance / `@afenda/accounting` unless a future ADR promotes them to Kernel.

### Trust boundaries and API ingress

Wire JSON keeps plain `string` IDs. Trust boundaries must use `parse*`:

```ts
// Approved at API ingress
const employeeId = parseEmployeeId(params.employeeId);

// Prohibited in apps/erp and domain packages
const employeeId = params.employeeId as EmployeeId;
```

Rules:

1. Parse canonical ID at route/query boundary via family `parse*`
2. Resolve tenant once: `parseTenantId(wire)` → lookup `tenants.enterprise_id` → uuid for session/RLS
3. Never use `as FamilyId` outside Kernel test fixtures — enforced by governance check (see Slice B acceptance)

### ULID generator security

Production ULID body generation is owned by `@afenda/database` per [ADR-0024](./ADR-0024-canonical-id-body-generation.md). The generator MUST use cryptographically strong randomness where available (for example `crypto.getRandomValues` in Node/browser, or equivalent OS CSPRNG APIs). It MUST NOT use `Math.random()`.

Kernel ships `createFixtureCanonicalIdBodyGenerator` for deterministic tests only — not for production composition roots.

### Legacy migration

Scattered contracts under `packages/kernel/src/contracts/platform-id*.ts` are **deprecated**. Slice B moves authority to `identity/` and retires importers.

### Prohibited in Kernel

- External `ulid` npm dependency
- Text canonical ID as database PK (see ADR-0022)
- Human number generation (see ADR-0023)
- Second branding pattern outside `identity/brand/`

---

## Consequences

### Positive

- Enterprise ID governance aligned with prefix + sortable body conventions
- Single registry prevents duplicate prefixes and orphan types
- Clear Kernel vs domain vs database ownership

### Negative / trade-offs

- Multi-slice rollout (A → B → C → D → E)
- Breaking change for tests using non-canonical strings
- Registry parity tests required across kernel, database, governance

---

## Acceptance Gate

**Slice A (this ADR + companions):**

- ADR-0021, ADR-0022, ADR-0023 status **Accepted**
- PAS-001 §4.1 updated
- Architecture docs under `docs/architecture/identity/`
- `pnpm check:documentation-drift` exit 0

**Slice B (Kernel — starts only after Slice A ADRs accepted):**

- `packages/kernel/src/identity/` nested module landed
- `pnpm check:kernel-identity-surface` exit 0
- `pnpm check:no-unsafe-id-casts` exit 0 — automated detection of prohibited enterprise ID casts outside Kernel test fixtures
- `pnpm --filter @afenda/kernel test:run` exit 0

**Slice C (Database):**

- `pnpm check:enterprise-id-db-parity` exit 0

---

## References

- [ADR-0022 — PostgreSQL Split-ID Persistence Model](./ADR-0022-postgres-split-id-persistence-model.md)
- [ADR-0023 — Tenant Human Reference Numbering](./ADR-0023-tenant-human-reference-numbering.md)
- [ADR-0024 — Canonical ID Body Generation](./ADR-0024-canonical-id-body-generation.md)
- [PAS-001 §4.1](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)
- [canonical-enterprise-id-constitution.md](../architecture/identity/canonical-enterprise-id-constitution.md)
- [identity-promotion-process.md](../architecture/identity/identity-promotion-process.md)
- RFC 9562 (UUID v7), ULID spec
