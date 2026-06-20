# Dependency Registry

| Field | Value |
|-------|-------|
| **Status** | Baseline — Pending Sign-off |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **TIP** | TIP-001A — Architecture Baseline Discovery |
| **Fingerprint** | `ARCH-BASELINE-2026-06-20-v1` |
| **Invariant** | ARCH-003 — every runtime `@afenda/*` dependency must be declared and approved |

This registry documents **approved runtime workspace dependencies** (`dependencies` in `package.json`). Dev-only links are classified separately and do not require runtime registry declaration.

Validation at baseline is against the **proposed model** pending ADR-0003 acceptance.

---

## Dependency Authority Classification

| Classification | Meaning |
|----------------|---------|
| `Approved` | Declared runtime edge; permitted under proposed layer model |
| `Dev-only exempt` | `devDependencies` only; permitted without runtime registry entry |
| `Exception` | Permitted by ADR-0005 exception registry (requires ADR + optional expiry) |
| `Deprecated` | Still present; consumers must migrate; documented removal date |
| `Blocked` | Explicitly forbidden; CI must fail if introduced |

---

## Runtime Dependency Edges (16 direct edges)

| Package | Dependency | Classification | ADR | Expires |
|---------|------------|----------------|-----|---------|
| `@afenda/auth` | `@afenda/database` | Approved | — | — |
| `@afenda/database` | `@afenda/observability` | Approved | — | — |
| `@afenda/entitlements` | `@afenda/database` | Approved | — | — |
| `@afenda/erp` | `@afenda/appshell` | Approved | — | — |
| `@afenda/erp` | `@afenda/auth` | Approved | — | — |
| `@afenda/erp` | `@afenda/database` | Approved | — | — |
| `@afenda/erp` | `@afenda/design-system` | Approved | — | — |
| `@afenda/erp` | `@afenda/observability` | Approved | — | — |
| `@afenda/execution` | `@afenda/kernel` | Approved | — | — |
| `@afenda/execution` | `@afenda/observability` | Approved | — | — |
| `@afenda/feature-flags` | `@afenda/entitlements` | Approved | — | — |
| `@afenda/metadata-ui` | `@afenda/design-system` | Approved | — | — |
| `@afenda/metadata-ui` | `@afenda/permissions` | Approved | — | — |
| `@afenda/permissions` | `@afenda/auth` | Approved | — | — |
| `@afenda/permissions` | `@afenda/database` | Approved | — | — |
| `@afenda/ai-governance` | `@afenda/architecture-authority` | Approved | ADR-0007 | — |

**Exception / deprecated runtime edges at baseline:** 0

---

## Dev-Only Workspace Links

| Package | Dependency | Classification | Purpose |
|---------|------------|----------------|---------|
| All packages | `@afenda/typescript-config` | Dev-only exempt | TypeScript presets |
| `@afenda/testing` | `@afenda/execution` | Dev-only exempt | Mock execution provider for tests |
| `@afenda/testing` | `@afenda/storage` | Dev-only exempt | Mock storage provider for tests |

---

## Approved Runtime Dependencies (by package)

| Package | Approved `@afenda/*` dependencies |
|---------|-----------------------------------|
| `@afenda/appshell` | *(none)* |
| `@afenda/auth` | `@afenda/database` |
| `@afenda/database` | `@afenda/observability` |
| `@afenda/design-system` | *(none)* |
| `@afenda/docs` | *(none)* |
| `@afenda/entitlements` | `@afenda/database` |
| `@afenda/erp` | `@afenda/appshell`, `@afenda/auth`, `@afenda/database`, `@afenda/design-system`, `@afenda/observability` |
| `@afenda/execution` | `@afenda/kernel`, `@afenda/observability` |
| `@afenda/feature-flags` | `@afenda/entitlements` |
| `@afenda/kernel` | *(none)* |
| `@afenda/metadata` | *(none)* |
| `@afenda/metadata-ui` | `@afenda/design-system`, `@afenda/permissions` |
| `@afenda/observability` | *(none)* |
| `@afenda/permissions` | `@afenda/auth`, `@afenda/database` |
| `@afenda/storage` | *(none)* |
| `@afenda/testing` | *(none — devDependencies only)* |
| `@afenda/typescript-config` | *(none)* |
| `@afenda/ui` | `@afenda/design-system` |
| `@afenda/architecture-authority` | *(none)* |
| `@afenda/ai-governance` | `@afenda/architecture-authority` |

---

## Dependency Matrix (visual)

```text
@afenda/erp
  → @afenda/appshell
  → @afenda/auth → @afenda/database → @afenda/observability
  → @afenda/database
  → @afenda/observability

@afenda/permissions
  → @afenda/auth
  → @afenda/database

@afenda/metadata-ui
  → @afenda/design-system
  → @afenda/permissions

@afenda/metadata
  *(no outbound runtime dependencies — authority consumed when implementation wires in)*

@afenda/feature-flags
  → @afenda/entitlements → @afenda/database

@afenda/execution
  → @afenda/kernel
  → @afenda/observability

@afenda/ai-governance
  → @afenda/architecture-authority

Packages with no outbound runtime workspace dependencies:
  @afenda/appshell
  @afenda/design-system
  @afenda/docs
  @afenda/kernel
  @afenda/metadata
  @afenda/observability
  @afenda/storage
  @afenda/testing
  @afenda/typescript-config
  @afenda/architecture-authority
```

---

## Explicitly Blocked Runtime Dependency Patterns

The following cross-layer runtime dependency patterns are **Blocked** unless an ADR-0005 exception is granted:

- Design → Application
- Design → Domain
- Metadata → Domain
- Foundation → Domain
- Platform tooling → Application
- Application → Application sibling without ADR

Inbound dependencies on leaf packages (e.g. `observability` ← `database`) are permitted when the edge is **Approved** above.

---

## Snapshot Intent (TIP-001F)

This registry is the human source of truth for [`dependency-snapshot.json`](dependency-snapshot.json), generated automatically in TIP-001F.

```text
pnpm architecture:dependencies  →  writes dependency-snapshot.json
pnpm architecture:drift         →  fails on unapproved runtime dependency diff
```

Any unapproved runtime dependency diff against the committed snapshot must fail `architecture:drift`.

---

## Circular Dependency Check

| Result | Detail |
|--------|--------|
| **PASS** | No cycles detected in runtime workspace dependency graph against proposed model |

---

## Acceptance

- [x] 100% runtime `@afenda/*` dependencies mapped
- [x] 100% edges classified (Approved / Dev-only exempt / Exception / Deprecated / Blocked)
- [x] 0 undeclared runtime workspace dependencies (verified against live `package.json`)
- [x] 0 circular dependencies
- [x] Blocked dependency patterns documented
- [x] Snapshot intent documented for TIP-001F
- [ ] Baseline signed off by Architecture Authority
