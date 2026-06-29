# ADR-0024 — Canonical ID Body Generation (Composition-Root Minting)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

[ADR-0021](./ADR-0021-canonical-enterprise-identity.md) defines the canonical enterprise ID **constitution** (`<prefix>_<ulid_body>`, registry, parser, branded types). PAS-001 Slice B Action 6 removed in-kernel production ULID minting: `@afenda/kernel` exposes `CanonicalIdBodyGenerator` and `createCanonicalId(family, generator)` but does **not** ship a runtime CSPRNG strategy.

Without an accepted minting authority, consumers calling `createExecutionContext({ correlationId, source })` or `create*Id()` without an injected generator throw at runtime.

Requirements:

1. Production minting must use cryptographically strong randomness (ADR-0021 security rule).
2. `@afenda/kernel` must not take a dependency on `@afenda/database`.
3. `@afenda/database` must not take a dependency on `@afenda/kernel`.
4. No external `ulid` npm package on the platform floor (ADR-0021 prohibited list).
5. Format parity between kernel parser and database CHECK constraints must remain gated by `pnpm check:enterprise-id-db-parity`.

---

## Decision

### Split: constitution vs minting

| Concern | Owner | Surface |
|---------|-------|---------|
| Format, parser, branded types, `createCanonicalId(family, generator)` | `@afenda/kernel` | `CanonicalIdBodyGenerator`, `createFixtureCanonicalIdBodyGenerator` |
| Crockford ULID **body** CSPRNG (26 chars) | `@afenda/database` | `generateUlidBody()`, `createEnterpriseId(family)` |
| Production composition (wire kernel interface to database generator) | `apps/erp` | `persistenceCanonicalIdBodyGenerator` |
| Outbox rehydration when `executionRunId` is null | `@afenda/execution` + caller | `OutboxPublishServiceDependencies.canonicalIdBodyGenerator` |
| Deterministic tests | Kernel fixture helper or package-local canonical strings | `createFixtureCanonicalIdBodyGenerator`, `@afenda/testing` execution fixtures |

### Production write path

1. **`@afenda/database`** owns the zero-dependency ULID body implementation (`crypto.getRandomValues`, Crockford alphabet aligned with kernel `CANONICAL_ID_BODY_PATTERN`).
2. **`apps/erp`** is the composition root:
   - `persistenceCanonicalIdBodyGenerator` implements `CanonicalIdBodyGenerator` by delegating to `generateUlidBody()`.
   - `createServerExecutionContext()` injects that generator when `executionId` is omitted.
   - Outbox foundation registers the same generator on `createOutboxPublishService({ canonicalIdBodyGenerator, … })`.
3. **`@afenda/kernel`** never calls `generateUlidBody()` directly and never mints production IDs without an injected generator.

### Test and fixture path

1. **`createFixtureCanonicalIdBodyGenerator(body?)`** in kernel — deterministic PAS §4.1.3 bodies for unit/integration tests only.
2. **`@afenda/testing`** `createMockExecutionContext()` uses canonical enterprise ID strings and the fixture generator when `executionId` is not supplied.
3. Legacy non-canonical test strings (`actor-1`, `exec-001`, `corr-*`) are **prohibited** at execution context boundaries.

### Package dependency rules (unchanged)

```text
@afenda/kernel          → (no @afenda/database)
@afenda/database        → (no @afenda/kernel)
apps/erp                → @afenda/kernel + @afenda/database (composition only)
@afenda/execution       → @afenda/kernel (generator required at publish boundary)
```

Adapters that implement `CanonicalIdBodyGenerator` live at the **composition root** (`apps/erp`) or in **test packages** (structural fixture objects). They must not be duplicated inside domain packages.

### Security

The production ULID body generator in `@afenda/database` MUST:

- Use `crypto.getRandomValues` (or equivalent OS CSPRNG) — never `Math.random()`.
- Emit exactly 26 Crockford base32 characters matching kernel `CANONICAL_ID_BODY_PATTERN`.

Kernel fixture generators may return fixed bodies; they MUST NOT be wired in production composition roots.

---

## Consequences

### Positive

- Clear separation: kernel constitution vs database CSPRNG vs ERP wiring.
- No forbidden database→kernel package edge.
- Runtime failures from missing generators are eliminated at approved composition roots.
- Parity gate continues to enforce format alignment.

### Negative / trade-offs

- Every minting call site must inject a generator or supply an explicit parsed `executionId`.
- `createOutboxPublishService` now requires `canonicalIdBodyGenerator` (intentional breaking change vs pre–Action 6 API).
- ADR-0021 text that implied kernel-owned ULID minting is superseded by this ADR for **runtime generation** only.

---

## Acceptance Gate

| Evidence | Gate / artifact |
|----------|-----------------|
| ERP persistence adapter | `apps/erp/src/lib/identity/persistence-canonical-id-body-generator.server.ts` |
| ERP server execution helper | `apps/erp/src/lib/context/create-server-execution-context.server.ts` |
| Database public export | `generateUlidBody` on `@afenda/database` root |
| Outbox publish wiring | `canonicalIdBodyGenerator` on `OutboxPublishServiceDependencies` |
| Kernel tests | `pnpm --filter @afenda/kernel test:run` |
| Execution tests | `pnpm --filter @afenda/execution test:run` |
| Testing fixtures | `pnpm --filter @afenda/testing test:run` |
| Mock context overrides | `pnpm check:mock-execution-context-fixtures` |
| Format parity | `pnpm check:enterprise-id-db-parity` |

---

## References

- [ADR-0021 — Canonical Enterprise ID Constitution](./ADR-0021-canonical-enterprise-identity.md)
- [ADR-0022 — PostgreSQL Split-ID Persistence Model](./ADR-0022-postgres-split-id-persistence-model.md)
- [PAS-001 §4.1](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)
- [canonical-enterprise-id-constitution.md](../PAS/KERNEL/identity/canonical-enterprise-id-constitution.md)
- `packages/kernel/src/identity/canonical/canonical-id-body-generator.contract.ts`
- `packages/database/src/ids/enterprise-id-generator.ts`
- `apps/erp/src/lib/identity/persistence-canonical-id-body-generator.server.ts`
