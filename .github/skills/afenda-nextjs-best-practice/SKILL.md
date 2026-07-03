---
name: afenda-nextjs-best-practice
description: >-
  Afenda Next.js 16 App Router for apps/erp — module-first ingress (PAS-001C template),
  force-dynamic module routes, manifest-driven surfaces, BFF, operating-context spine,
  and next-devtools MCP verification. Use for ERP module routes, layouts, proxy,
  loaders, or when the user mentions Next.js App Router with Afenda ERP modules.
paths:
  - apps/erp/**
  - apps/docs/**
  - apps/developer/**
---

# Afenda Next.js Best Practice

**For ERP module folders and routes → read [`erp-module-foundation-authority`](../erp-module-foundation-authority/SKILL.md) and [template §2/§5](../../../docs/PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) FIRST.**

This skill covers **Next.js 16 mechanics** on the Afenda ingress model — it does not invent module layout.

**Route lab (`apps/developer`):** Same frontend law as ERP production — [developer-route-lab-parity.md](reference/developer-route-lab-parity.md). **Only** auth, spine, BFF, and production deploy differ. Do not lower standards because “it’s the lab.”

---

## Agent read order

1. [`erp-module-foundation-authority`](../erp-module-foundation-authority/SKILL.md) — module identity, path law, gates
2. This file — Next.js + MCP summary
3. [reference/erp-module-frontend-layout.md](reference/erp-module-frontend-layout.md) — three-layer tree
4. [reference/module-route-surface-registry.md](reference/module-route-surface-registry.md) — contract ↔ path
5. [reference/module-rendering-matrix.md](reference/module-rendering-matrix.md) — `force-dynamic` rules
6. [reference/component-composition.md](reference/component-composition.md) — `_components/` colocation
7. [reference/runtime-mcp.md](reference/runtime-mcp.md) — verify live
8. [reference/app-router-audit.md](reference/app-router-audit.md) — scorecard

---

## Module frontend (summary)

```text
packages/features/erp-modules/src/{slug}/   # contracts + pas006-ui.contract.ts
apps/erp/src/lib/{module}/                  # loaders, route-policy, server-actions
apps/erp/src/app/(protected)/modules/
  layout.tsx                    → export const dynamic = 'force-dynamic'
  [moduleSlug]/
    _components/                → module UI (default — NOT src/components/)
    [surface]/page.tsx
    [surface]/[documentId]/page.tsx
```

| Anti-pattern | Why |
| ------------ | --- |
| Module UI in `src/components/{module}/` | Recycling bin — violates template |
| New route without UI contract row | Orphan — registry drift |
| `force-static` on modules | Tenant leak |
| `generateStaticParams` on tenant modules | Prohibited |

**Scaffold today:** static `/modules/procurement/*` paths (ERP-PROC-OP-007). **Target:** `[moduleSlug]` + manifest validation. See layout reference for MCP gap table.

---

## MCP (mandatory after App Router edits)

```text
nextjs_index → get_routes → get_errors
```

| App | Port |
| --- | ---- |
| ERP | 3000 |
| Developer route lab | **3002** |

P0: `get_errors` clean. Known: `error.tsx` must not import `@afenda/shadcn-studio`.

---

## Request flow

```text
proxy.ts → (protected)/layout (PAS-001A OperatingContext)
  → modules/layout (force-dynamic)
  → [moduleSlug]/layout (guardModuleRoute)
  → load-{surface}-page.server.ts → _components → studio blocks
```

BFF: `api/internal/v1/**` via `createApiHandler` + contract `cache: no-store` → `force-dynamic`.

---

## Multi-app map

| App | Port | Role |
| --- | ---- | ---- |
| ERP | 3000 | Module ingress + BFF |
| Docs | 3001 | `[lang]/docs/[[...slug]]` — static/MDX reference only |
| Developer (route lab) | 3002 | **ERP-parity** operator UX — same page law as production · auth/spine/BFF **only** exclusions · [ADR-0039](../../../docs/adr/ADR-0039-developer-presentation-sandbox.md) |
| Storybook (block lab) | 6006 | Single-block ACPA verification |

---

## Non-module surfaces

| Tree | Ingress lib |
| ---- | ----------- |
| `settings/**` | `lib/user-settings/` |
| `system-admin/**` | `lib/system-admin/` |
| `metadata-workspace` | `lib/metadata/` |

---

## Next.js bindings

- Server Components default; `"use client"` only for interactivity
- `params` / `searchParams` as `Promise` — always `await`
- `loading.tsx` / `error.tsx` per module segment that suspends or fails
- `error.tsx` — client-safe only (no studio barrel)
- No Pages Router

---

## Rendering summary

| Surface | `dynamic` |
| ------- | --------- |
| `modules/**` | **`force-dynamic`** |
| BFF tenant/mutation | **`force-dynamic`** (contract) |
| Health API | `auto` + `revalidate: 30` |
| Public `/` | static OK |

Full matrix: [module-rendering-matrix.md](reference/module-rendering-matrix.md)

---

## Multi-tenancy

**Authority:** `multi-tenancy-erp` · `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md`

Target: subdomain → `x-tenant-slug` via `proxy.ts`. **Today:** correlation-id + auth redirect only — planned, not implemented.

---

## Verification

```bash
pnpm --filter @afenda/erp typecheck
pnpm test:run --filter @afenda/erp
```

MCP: `get_errors` clean · UI → `afenda-presentation-quality` · Ship → `/afenda-ship`

---

## Related skills

| Need | Skill |
| ---- | ----- |
| Module scaffolding | `erp-module-foundation-authority` |
| Tenant / context | `multi-tenancy-erp` |
| API / OpenAPI | `platform-api-contract` |
| Presentation | `shadcn-studio`, `afenda-presentation-quality` |
| Generic Next.js API | Vercel `nextjs` + Context7 |

Afenda module rules **override** generic Next.js colocation advice.

---

## Hard stops

- Module UI defaulting to `src/components/`
- Routes without `pas006-ui.contract.ts` / manifest entry (ERP production; borrow-map row in route lab until promotion)
- `force-static` or cross-tenant cache on module data
- Studio import in `error.tsx` / `global-error.tsx`
- Skipping MCP `get_errors` after route changes
- Business logic in `page.tsx` or `apps/erp` that belongs in `packages/features/erp-modules`
- **Route lab:** documenting or implementing “ERP cannot, lab can” for page law, colocation, segment boundaries, or RSC-first composition — [parity reference](reference/developer-route-lab-parity.md)
