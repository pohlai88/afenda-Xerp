# Dependency Registry

| Field | Value |
|-------|-------|
| **Status** | Baseline — Pending Sign-off |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **TIP** | TIP-001A — Architecture Baseline Discovery |
| **Fingerprint** | `ARCH-BASELINE-2026-06-27-v3` |
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

## Runtime Dependency Edges (41 direct edges)

| Package | Dependency | Classification | ADR | Expires |
|---------|------------|----------------|-----|---------|
| `@afenda/accounting-standards` | `@afenda/kernel` | Approved | PAS-003 | — |
| `@afenda/ai-governance` | `@afenda/architecture-authority` | Approved | ADR-0007 | — |
| `@afenda/appshell` | `@afenda/kernel` | Approved | — | — |
| `@afenda/appshell` | `@afenda/ui` | Approved | — | — |
| `@afenda/auth` | `@afenda/database` | Approved | — | — |
| `@afenda/auth` | `@afenda/kernel` | Approved | — | — |
| `@afenda/database` | `@afenda/observability` | Approved | — | — |
| `@afenda/design-system` | `@afenda/css-authority` | Approved | PAS-005 | — |
| `@afenda/docs` | `@afenda/enterprise-knowledge` | Approved | PAS-004 | — |
| `@afenda/entitlements` | `@afenda/database` | Approved | — | — |
| `@afenda/erp` | `@afenda/appshell` | Approved | — | — |
| `@afenda/erp` | `@afenda/auth` | Approved | — | — |
| `@afenda/erp` | `@afenda/database` | Approved | — | — |
| `@afenda/erp` | `@afenda/execution` | Approved | TIP-011 | — |
| `@afenda/erp` | `@afenda/feature-flags` | Approved | fdr-009-rollout-flags | — |
| `@afenda/erp` | `@afenda/design-system` | Approved | — | — |
| `@afenda/erp` | `@afenda/entitlements` | Approved | TIP-007A | — |
| `@afenda/erp` | `@afenda/enterprise-knowledge` | Approved | PAS-004 | — |
| `@afenda/erp` | `@afenda/kernel` | Approved | — | — |
| `@afenda/erp` | `@afenda/ui-composition` | Approved | — | — |
| `@afenda/erp` | `@afenda/metadata-ui` | Approved | — | — |
| `@afenda/erp` | `@afenda/observability` | Approved | — | — |
| `@afenda/erp` | `@afenda/permissions` | Approved | TIP-010 | — |
| `@afenda/erp` | `@afenda/storage` | Approved | — | — |
| `@afenda/erp` | `@afenda/ui` | Approved | — | — |
| `@afenda/execution` | `@afenda/kernel` | Approved | — | — |
| `@afenda/execution` | `@afenda/observability` | Approved | — | — |
| `@afenda/feature-flags` | `@afenda/entitlements` | Approved | — | — |
| `@afenda/metadata-ui` | `@afenda/ui-composition` | Approved | — | — |
| `@afenda/metadata-ui` | `@afenda/ui` | Approved | — | — |
| `@afenda/ui-composition` | `@afenda/enterprise-knowledge` | Approved | PAS-004 | — |
| `@afenda/permissions` | `@afenda/auth` | Approved | — | — |
| `@afenda/permissions` | `@afenda/database` | Approved | — | — |
| `@afenda/permissions` | `@afenda/kernel` | Approved | TIP-007 | — |
| `@afenda/storybook` | `@afenda/appshell` | Approved | — | — |
| `@afenda/storybook` | `@afenda/design-system` | Approved | — | — |
| `@afenda/storybook` | `@afenda/ui-composition` | Approved | — | — |
| `@afenda/storybook` | `@afenda/metadata-ui` | Approved | — | — |
| `@afenda/storybook` | `@afenda/ui` | Approved | — | — |
| `@afenda/ui` | `@afenda/css-authority` | Approved | PAS-005 | — |
| `@afenda/ui` | `@afenda/design-system` | Approved | — | — |

**Exception / deprecated runtime edges at baseline:** 0

---

## Dev-Only Workspace Links

| Package | Dependency | Classification | Purpose |
|---------|------------|----------------|---------|
| All packages | `@afenda/typescript-config` | Dev-only exempt | TypeScript presets |
| `@afenda/testing` | `@afenda/execution` | Dev-only exempt | Mock execution provider for tests |
| `@afenda/testing` | `@afenda/storage` | Dev-only exempt | Mock storage provider for tests |

`@afenda/testing` also publishes `@afenda/testing/react` (runtime npm: `@testing-library/react`, `@testing-library/user-event`; peers: `react`, `react-dom`). Those are third-party edges — not tracked as `@afenda/*` runtime links.

---

## Approved third-party runtime dependencies (ADR-0003)

| Package | Dependency | Version pin | Classification | ADR / TIP | Purpose |
|---------|------------|-------------|----------------|-----------|---------|
| `@afenda/appshell` | `recharts` | `3.8.0` | Approved | ADR-0003; TIP-UI-05 Slice 6 | Dashboard sparkline / statistics chart blocks via lazy client imports |
| `@afenda/erp` | `@tanstack/react-table` | `^8.21.3` | Approved | ADR-0003; TIP-UI-05 Slice 7 | System Admin audit DataTable column defs + `useReactTable` client hook (types-only consumer — table chrome from `@afenda/ui` `DataTable`) |
| `@afenda/ui` | `recharts` | `3.8.0` | Approved | ADR-0003 | Governed `Chart` primitive wrappers |
| `@afenda/storybook` | `recharts` | `3.8.0` | Approved | ADR-0003 | Storybook chart block previews |

Third-party npm packages are not validated by `pnpm quality:architecture` workspace-edge checks; they are documented here for ADR-0003 traceability.

---

## Approved Runtime Dependencies (by package)

| Package | Approved `@afenda/*` dependencies |
|---------|-----------------------------------|
| `@afenda/accounting-standards` | `@afenda/kernel` |
| `@afenda/appshell` | `@afenda/kernel`, `@afenda/ui` |
| `@afenda/auth` | `@afenda/database`, `@afenda/kernel` |
| `@afenda/database` | `@afenda/observability` |
| `@afenda/design-system` | `@afenda/css-authority` |
| `@afenda/docs` | `@afenda/enterprise-knowledge` |
| `@afenda/email` | *(none)* |
| `@afenda/entitlements` | `@afenda/database` |
| `@afenda/erp` | `@afenda/appshell`, `@afenda/auth`, `@afenda/database`, `@afenda/design-system`, `@afenda/entitlements`, `@afenda/enterprise-knowledge`, `@afenda/execution`, `@afenda/feature-flags`, `@afenda/kernel`, `@afenda/ui-composition`, `@afenda/metadata-ui`, `@afenda/observability`, `@afenda/permissions`, `@afenda/storage`, `@afenda/ui` |
| `@afenda/execution` | `@afenda/kernel`, `@afenda/observability` |
| `@afenda/feature-flags` | `@afenda/entitlements` |
| `@afenda/kernel` | *(none)* |
| `@afenda/ui-composition` | `@afenda/enterprise-knowledge` |
| `@afenda/metadata-ui` | `@afenda/ui-composition`, `@afenda/ui` |
| `@afenda/observability` | *(none)* |
| `@afenda/permissions` | `@afenda/auth`, `@afenda/database`, `@afenda/kernel` |
| `@afenda/storage` | *(none)* |
| `@afenda/storybook` | `@afenda/appshell`, `@afenda/design-system`, `@afenda/ui-composition`, `@afenda/metadata-ui`, `@afenda/ui` |
| `@afenda/testing` | *(none — workspace runtime)* |
| `@afenda/typescript-config` | *(none)* |
| `@afenda/ui` | `@afenda/css-authority`, `@afenda/design-system` |
| `@afenda/architecture-authority` | *(none)* |
| `@afenda/ai-governance` | `@afenda/architecture-authority` |
| `@afenda/css-authority` | *(none)* |
| `@afenda/enterprise-knowledge` | *(none)* |

---

## Dependency Matrix (visual)

```text
@afenda/erp
  → @afenda/appshell → @afenda/kernel
  → @afenda/appshell → @afenda/ui → @afenda/design-system
  → @afenda/auth → @afenda/database → @afenda/observability
  → @afenda/auth → @afenda/kernel
  → @afenda/database
  → @afenda/design-system
  → @afenda/entitlements → @afenda/database
  → @afenda/execution → @afenda/kernel
  → @afenda/feature-flags → @afenda/entitlements → @afenda/database
  → @afenda/kernel
  → @afenda/ui-composition
  → @afenda/metadata-ui → @afenda/ui-composition
  → @afenda/metadata-ui → @afenda/ui
  → @afenda/observability
  → @afenda/permissions → @afenda/auth
  → @afenda/permissions → @afenda/database
  → @afenda/permissions → @afenda/kernel
  → @afenda/ui

@afenda/storybook
  → @afenda/appshell
  → @afenda/design-system
  → @afenda/ui-composition
  → @afenda/metadata-ui
  → @afenda/ui → @afenda/design-system

@afenda/feature-flags
  → @afenda/entitlements → @afenda/database

@afenda/execution
  → @afenda/kernel
  → @afenda/observability

@afenda/ai-governance
  → @afenda/architecture-authority

Packages with no outbound runtime workspace dependencies:
  @afenda/css-authority
  @afenda/enterprise-knowledge
  @afenda/kernel
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

## Business Master Data Authority (TIP-008B)

Documentation-only ownership map through Slice 1; **kernel authority registry + wire reference contracts** from Slice 2–3 (`packages/kernel/src/contracts/business-master-data/`). **No domain package schemas** until PKG-R02–R05 domain TIPs.

| Entity | Owning domain | Persistence owner (PKG) | Identity scope | Runtime status |
| --- | --- | --- | --- | --- |
| Customer | CRM Authority | `@afenda/crm` (PKG-R04) | Tenant + company; customer code unique per company | `authority_only` — kernel wire contracts |
| Supplier | Procurement Authority | `@afenda/procurement` (PKG-R05) | Tenant + company; vendor code unique per company | `authority_only` — kernel wire contracts |
| Product | Inventory Authority | `@afenda/database` (PKG-R02 domain) | Tenant; SKU unique per tenant catalog | Implemented — database + ERP API (ADR-0020) |
| Employee | HRM Authority | `@afenda/hrm` (PKG-R03) | Tenant + company; employee number unique per company | `authority_only` — kernel wire contracts |
| Warehouse | Inventory Authority | `@afenda/database` (PKG-R02 domain) | Tenant + company; warehouse code unique per company | Implemented — database + ERP API (ADR-0020) |
| Asset | Platform / TPM | TBD via ADR | — | Not assigned |
| Document | Platform document service | TBD via ADR | — | Not assigned |
| Project | PM domain | TIP-030 | — | Partial — membership scope only |

**Authority:** `tips/[Complete] tip-008-master-data-authority.md` §008B. Cross-reference: [`package-registry.md`](package-registry.md) Domain Layer (reserved).

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
