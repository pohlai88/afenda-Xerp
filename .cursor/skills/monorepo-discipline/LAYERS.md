# Monorepo Layer Reference

## Full layer diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Rank 6 — Application                                           │
│  @afenda/erp   @afenda/docs                                     │
│  Can import from all lower layers                               │
├─────────────────────────────────────────────────────────────────┤
│  Rank 5 — Domain                                                │
│  (future domain packages)                                       │
│  Can import: Platform, Design, Foundation, Integration, Metadata│
├─────────────────────────────────────────────────────────────────┤
│  Rank 4 — ERPSpine                                              │
│  @afenda/appshell                                               │
│  Can import: Platform, Design, Foundation, Integration, Metadata│
├─────────────────────────────────────────────────────────────────┤
│  Rank 3 — Metadata                  Rank 3 — Integration        │
│  @afenda/ui-composition                   @afenda/entitlements        │
│  @afenda/ui-composition-ui                @afenda/feature-flags       │
│  Can import: Platform, Design       @afenda/testing             │
│                                     Can import: Platform, Foundation
├─────────────────────────────────────────────────────────────────┤
│  Rank 2 — Foundation                Rank 2 — Design             │
│  @afenda/execution                  @afenda/design-system       │
│  @afenda/kernel                     @afenda/ui                  │
│  @afenda/storage                    Can import: Platform         │
│  Can import: Platform (same-layer ok within Foundation)         │
├─────────────────────────────────────────────────────────────────┤
│  Rank 1 — Platform (no upstream imports allowed)                │
│  @afenda/auth        @afenda/database     @afenda/observability  │
│  @afenda/permissions @afenda/typescript-config                  │
│  @afenda/architecture-authority          @afenda/ai-governance  │
└─────────────────────────────────────────────────────────────────┘
```

## Forbidden import table

| Package (from) | Forbidden import (to) | Reason |
|----------------|-----------------------|--------|
| `@afenda/observability` | `@afenda/erp` | Platform must not import Application |
| `@afenda/ui` | `@afenda/appshell` | Design must not import ERPSpine |
| `@afenda/kernel` | `@afenda/ui-composition` | Foundation must not import Metadata |
| `@afenda/entitlements` | `@afenda/appshell` | Integration must not import ERPSpine |
| Any `packages/*` | `@afenda/erp` | Packages must not import apps |
| `@afenda/auth` | `@afenda/database` | Platform same-layer: allowed, but creates tight coupling |

## Same-layer import rules

| Layer | Same-layer imports allowed? | Notes |
|-------|-----------------------------|-------|
| Platform | Yes | e.g. @afenda/auth may import @afenda/database |
| Design | Yes | e.g. @afenda/ui may import @afenda/design-system |
| Foundation | Yes | e.g. @afenda/kernel may import @afenda/execution |
| Integration | Yes | e.g. @afenda/entitlements may import @afenda/feature-flags |
| Metadata | No | @afenda/ui-composition and @afenda/ui-composition-ui must not cross-import |
| ERPSpine | No | (single package currently) |
| Domain | No | Domain packages must not import each other |
| Application | No | Apps must not import each other |

## Common violations and fixes

### Violation: deep import

```ts
// ❌ Deep internal import — breaks if the file is moved or renamed
import { buildAuditEventRow } from "@afenda/observability/src/audit-event.builder.js";

// ✅ Public surface only
import { buildAuditEventRow } from "@afenda/observability";
```

### Violation: relative cross-package import

```ts
// ❌ Relative path across package boundary
import { createLogger } from "../../../observability/src/index.js";

// ✅ Package name
import { createLogger } from "@afenda/observability";
```

### Violation: phantom dependency

```ts
// @afenda/kernel imports zod but it's only in @afenda/database/package.json
// Package A gets it for free via hoisting — but this will break on clean install

// Fix: add zod to @afenda/kernel/package.json#dependencies
```

### Violation: upward import

```ts
// In packages/observability/src/something.ts
import { something } from "@afenda/erp/src/lib";  // ❌ Platform importing Application

// Fix: move the shared concern to a lower-rank package or invert the dependency
```

## Known exceptions

No approved exceptions exist at this time. If a proposed import violates the layer rules, raise it for architecture review before adding it. Document approved exceptions in the exception registry (`packages/architecture-authority/src/data/exception-registry.data.ts`).
