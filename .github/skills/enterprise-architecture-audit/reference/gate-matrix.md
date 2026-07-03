# Gate Matrix — Assessment Areas

Map key `pnpm` commands to audit phases. Orchestrator runs scoped subset and pastes output.

---

## Architecture and boundaries

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm quality:architecture` | 1, 2, 8 | Package/layer governance |
| `pnpm quality:boundaries` | 1, 14 | Dependency direction |
| `pnpm architecture:cycles` | 1, 14 | Circular dependencies |
| `pnpm check:foundation-disposition` | 1, 8 | Registry sync |
| `pnpm check:architecture-authority-surface` | 2, 8 | PAS-002 surface |
| `pnpm check:architecture-kernel-non-duplication` | 1, 8 | Kernel vs arch-authority |
| `pnpm check:architecture-ownership-signoff` | 2 | Ownership |
| `pnpm check:architecture-disposition-completeness` | 8 | Disposition rows |

---

## Kernel and identity

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm quality:kernel-context-surface` | 1, 3, 13 | Execution context |
| `pnpm check:kernel-identity-governance` | 1, 3, 13 | Enterprise IDs |
| `pnpm check:kernel-zero-runtime-deps` | 1, 14 | Kernel purity |
| `pnpm check:kernel-contract-rules` | 2, 13 | Wire contracts |
| `pnpm check:enterprise-id-db-parity` | 3, 13 | ID DB parity |

---

## Multi-tenancy and context

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm check:multi-tenancy-enterprise-acceptance` | 1, 5 | Tenancy readiness |
| `pnpm check:multi-tenancy-operating-context-resolver` | 1, 3 | Context resolver |
| `pnpm check:erp-context-surface` | 3 | ERP context wiring |
| `pnpm check:appshell-context-surface` | 3 | Shell context |

---

## Security and auth

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm check:auth-user-id-rbac-boundary` | 3, 9 | Auth/RBAC split |
| `pnpm check:auth-shell-boundary` | 3 | Auth shell |
| `pnpm check:csp-third-party` | 3, 9 | CSP allowlist |
| `pnpm check:permissions-scope-grants-surface` | 3 | RBAC surface |
| `pnpm check:database-tenant-rls-coverage` | 3, 5, 9 | RLS |

---

## API and contracts

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm check:api-contracts` | 2, 3, 8 | API governance |
| `pnpm check:openapi-drift` | 3, 8 | OpenAPI sync |

---

## Data and migrations

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm quality:migrations` | 3, 5 | Migration governance |
| `pnpm check:migration-governance` | 3 | DDL policy |
| `pnpm check:foreign-key-indexes` | 3 | DB performance |

---

## Observability and audit

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm quality:erp-observability` | 2, 3, 5 | Audit mutations |
| `pnpm check:observability-surface` | 2, 3 | Logging surface |
| `pnpm check:system-admin-mutation-audit` | 3 | Admin audit |

---

## UI and CSS (Phase 3 frontend slice)

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm ui:guard:scan` | 3 | Governed UI consumption |
| `pnpm ui:guard` | 3 | Full UI guard |
| `pnpm check:css-authority-conformance` | 3, 8 | PAS-005 |

---

## Documentation and knowledge

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm check:documentation-drift` | 1, 2, 8, 11, 12 | Runtime vs docs |
| `pnpm check:knowledge-conformance` | 8 | PAS-004 |

---

## CI hygiene (wide audit)

| Gate | Phase | Area |
| --- | --- | --- |
| `pnpm ci:biome` | 2, 3 | Lint/format |
| `pnpm typecheck` | 2, 3 | Type safety |
| `pnpm check` | final | Aggregator |
| `pnpm quality` | final | Full composite (schedule; long-running) |

---

## Scoped gate bundles

### `packages/kernel` Phase 1 dry-run

```bash
pnpm check:kernel-package-structure
pnpm check:kernel-context-surface
pnpm check:kernel-identity-surface
pnpm check:kernel-zero-runtime-deps
pnpm --filter @afenda/kernel test:run
```

### `apps/erp` slice

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm check:erp-context-surface
pnpm check:api-contracts
pnpm ui:guard:scan
```

### Governance pre-merge subset (reference)

```bash
pnpm quality:boundaries
pnpm check:foundation-disposition
pnpm check:documentation-drift
```

---

## Gate evidence format

When pasting in checkpoint:

```text
pnpm <gate> → PASS (exit 0) | FAIL (exit N)
<relevant output lines, max 20>
```

If gate not run: **"Not evidenced."**
