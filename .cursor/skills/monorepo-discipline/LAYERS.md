# Monorepo Layer Reference

Source of truth: [`layer-registry.data.ts`](../../../packages/architecture-authority/src/data/layer-registry.data.ts) (ADR-0027 / PAS-006).

## Full layer diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Rank 6 — Application                                           │
│  @afenda/erp  @afenda/docs  @afenda/storybook  @afenda/email    │
│  Can import from all lower layers                               │
├─────────────────────────────────────────────────────────────────┤
│  Rank 5 — Domain                                                │
│  (future domain packages)                                       │
├─────────────────────────────────────────────────────────────────┤
│  Rank 4 — ERPSpine (retired)                                    │
│  @afenda/appshell — removed per ADR-0027                        │
├─────────────────────────────────────────────────────────────────┤
│  Rank 3 — Integration                                           │
│  @afenda/entitlements  @afenda/feature-flags  @afenda/testing   │
│  Can import: Platform, Foundation                               │
├─────────────────────────────────────────────────────────────────┤
│  Rank 2 — Foundation              Rank 2 — Design               │
│  @afenda/execution                @afenda/shadcn-studio         │
│  @afenda/erp-module-foundation    Can import: Platform          │
│  @afenda/storage                                                │
│  @afenda/accounting-standards                                   │
│  Can import: Platform (same-layer ok within Foundation)         │
├─────────────────────────────────────────────────────────────────┤
│  Rank 1 — Platform (no upstream imports allowed)                │
│  @afenda/auth  @afenda/database  @afenda/observability          │
│  @afenda/permissions  @afenda/typescript-config                 │
│  @afenda/architecture-authority  @afenda/ai-governance          │
│  @afenda/kernel  @afenda/enterprise-knowledge                   │
└─────────────────────────────────────────────────────────────────┘
```

## Forbidden import table

| Package (from) | Forbidden import (to) | Reason |
|----------------|-----------------------|--------|
| `@afenda/observability` | `@afenda/erp` | Platform must not import Application |
| `@afenda/shadcn-studio` | `@afenda/erp` | Design must not import Application |
| `@afenda/kernel` | `@afenda/shadcn-studio` | Platform must not import Design (check layer-registry for current allowedTargets) |
| `@afenda/entitlements` | `@afenda/erp` | Integration must not import Application |
| Any `packages/*` | `@afenda/erp` | Packages must not import apps |

## Same-layer import rules

| Layer | Same-layer imports allowed? | Notes |
|-------|-----------------------------|-------|
| Platform | Yes | Prefer minimal coupling |
| Design | Yes | Single package currently |
| Foundation | Yes | e.g. @afenda/kernel may import @afenda/execution |
| Integration | Yes | |
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
// Package gets a dep via hoisting but it's not in package.json — fails on clean install
// Fix: add the dependency to package.json#dependencies with workspace:* for internal packages
```

### Violation: upward import

```ts
// In packages/observability/src/something.ts
import { something } from "@afenda/erp/src/lib";  // ❌ Platform importing Application

// Fix: move the shared concern to a lower-rank package or invert the dependency
```

## Known exceptions

No approved exceptions exist at this time. Document approved exceptions in `packages/architecture-authority/src/data/exception-registry.data.ts`.
