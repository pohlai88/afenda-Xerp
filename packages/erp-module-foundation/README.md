# @afenda/erp-module-foundation

Reusable **factories and validators** for ERP runtime module foundation — not business runtime, not kernel wire vocabulary.

Aligns with [`docs/PAS/KERNEL/template/erp-runtime-module-foundation.template.md`](../../docs/PAS/KERNEL/template/erp-runtime-module-foundation.template.md).

## Why this package exists

| Layer | Owns |
| --- | --- |
| `@afenda/kernel` | KV-* wire vocabulary only |
| `@afenda/erp-module-foundation` | Module foundation **shape** helpers |
| `@afenda/{module}` | Domain runtime behavior |
| `@afenda/database` | Persistence |
| `apps/erp` | Ingress and protected routes |

Kernel must not own runtime, DB, auth, UI, workflows, or behavior.

## Public helpers

| Helper | Purpose |
| --- | --- |
| `defineErpRuntimeModule()` | Module identity, KV ID, owners, lifecycle |
| `defineModuleOwnership()` | One owner per responsibility surface |
| `defineModuleKnowledgeMap()` | PAS-004 meaning alignment |
| `defineModulePermissionBinding()` | Kernel permission keys ↔ registry parity |
| `defineModuleAuditMap()` | Audit action vocabulary usage |
| `defineModuleEventCatalog()` | Event naming consistency |
| `defineModuleOutboxContract()` | Outbox requirement decisions |
| `defineModuleMetadataBinding()` | UI/metadata/context/permission binding |
| `defineModuleReadiness()` | Readiness matrix |
| `assertModuleReadiness()` | Gate/test assertion over full bundle |

## Usage (procurement foundation — wire phase)

```ts
import {
  assertModuleReadiness,
  defineErpRuntimeModule,
  defineModuleKnowledgeMap,
  defineModuleOwnership,
  defineModuleReadiness,
} from "@afenda/erp-module-foundation";
```

See `src/__tests__/module-foundation.test.ts` for a KV-PROC foundation bundle example.

## Gates (future)

Module-specific gates (e.g. `pnpm check:procurement-module-readiness`) should call `assertModuleReadiness()` with module bundle + evidence paths.
