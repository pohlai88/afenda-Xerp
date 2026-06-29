# @afenda/erp-module-foundation

Reusable **factories and validators** for ERP runtime module foundation — not business runtime, not kernel wire vocabulary.

**Authority:** [PAS-001C — ERP Module Foundation Standard](../../docs/PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md)  
**Slice:** ERP-MOD-FDN-003 — Enterprise acceptance (honest ~8.6–8.8/10 helper package; 9.5 requires live domain adoption)  
**Fingerprint:** `ERP_MODULE_FOUNDATION-2026-06-30-v3`

## Why this package exists

| Layer | Owns |
| --- | --- |
| `@afenda/kernel` | KV-* wire vocabulary only |
| `@afenda/erp-module-foundation` | Module foundation **shape** helpers |
| `@afenda/{module}` | Domain runtime behavior |
| `@afenda/database` | Persistence |
| `apps/erp` | Ingress and protected routes |

## Status ladder (PAS-001C)

```text
wire_only → foundation_authorized → foundation_verified → runtime_authorized → runtime_verified
(+ blocked, deprecated, contracts_only, foundation_planned)
```

Enforced by `assertModuleStatusRequirements()`.

## Public helpers

| Helper | Purpose |
| --- | --- |
| `defineErpRuntimeModule()` | Module identity + optional KV catalog parity |
| `defineErpRuntimeModuleRegistry()` | Cross-module registry |
| `assertErpRuntimeModuleRegistry()` | Duplicate slug/KV/package/wire/permission/route/audit/event/operation enforcement |
| `defineModuleRuntimeContract()` | Lifecycle, document families, gates |
| `defineModulePolicy()` | Create/approve/post rules |
| `defineModuleContextSpineConsumer()` | PAS-001A spine contract |
| `defineModuleDatabaseBoundary()` | Table scope, RLS, migration |
| `defineModuleOperationCatalog()` | Operation ↔ permission/audit/outbox linkage |
| `defineModulePermissionBinding()` | `exact` \| `subset_allowed` \| `deferred` parity |
| `assertModuleReadiness()` | Full bundle non-omission |
| `assertModuleRuntimeCompleteness()` | Operation catalog completeness |
| `renderModuleReadinessReport()` | Markdown readiness table (template §7) |

## Governance gates (all must exit 0)

```bash
pnpm check:erp-module-foundation          # composite
pnpm check:erp-module-ownership
pnpm check:erp-module-knowledge-alignment
pnpm check:erp-module-context-spine-consumer
pnpm check:erp-module-permission-binding
pnpm check:erp-module-audit-outbox
pnpm check:erp-module-metadata-binding
pnpm check:erp-module-database-boundary
pnpm check:erp-module-no-kernel-runtime-leak
pnpm check:erp-module-readiness
pnpm quality:erp-module-foundation        # typecheck + test:run + composite gate
```

## Reference bundle

`PROCUREMENT_FOUNDATION_BUNDLE` — KV-PROC wire-phase golden bundle used by gates and tests.

See `src/__tests__/` for Prove-It coverage (49+ tests).
