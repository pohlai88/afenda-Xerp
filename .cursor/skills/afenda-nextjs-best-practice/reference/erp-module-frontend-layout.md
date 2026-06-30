# ERP module frontend layout

**Authority (read first):**

- [`erp-runtime-module-foundation.template.md`](../../../../docs/PAS/ERP-MODULES/erp-runtime-module-foundation.template.md) §2, §5 — implementation SSOT
- [`erp-module-foundation-authority`](../../erp-module-foundation-authority/SKILL.md) — PAS-001C gates and hard stops
- [`erp-module-runtime-blueprint.md`](../../../../docs/BLUEPRINT/erp-module-runtime-blueprint.md) §4.5 — path law

**This document does not invent layout.** It applies Next.js App Router mechanics to the Afenda module ingress model.

---

## Principle

ERP frontend is **manifest-driven module ingress**, not a `lib/` + `components/` recycling bin.

| Layer | Owns |
| ----- | ---- |
| `packages/features/erp-modules/src/{module-slug}/` | Module identity, contracts, PAS-006 UI route declarations (no React) |
| `apps/erp/src/lib/{module}/` | Ingress orchestration only — loaders, auth, metadata binding, route policy |
| `apps/erp/src/app/(protected)/modules/` | Thin route shells + module-private `_components/` |

Domain business rules stay in `packages/features/erp-modules` and `packages/*` — never inlined in `page.tsx`.

---

## Three-layer tree (target)

```text
packages/features/erp-modules/src/{module-slug}/
  {module-slug}.module-definition.ts
  {module}.pas006-ui.contract.ts          # routePattern → pagePath → loaderPath → blockId
  {module}.metadata-binding.ts
  … per template §3

apps/erp/src/lib/{module}/
  load-{module}-runtime-context.server.ts
  authorize-{module}-action.server.ts
  {module}.server-actions.ts
  {module}.queries.ts
  {module}.metadata-binding.ts
  {module}.route-policy.ts
  load-{surface}-page.server.ts
  __tests__/

apps/erp/src/app/(protected)/
  layout.tsx                              # PAS-001A operating context (once)
  modules/
    layout.tsx                            # export const dynamic = 'force-dynamic'
    [moduleSlug]/
      layout.tsx                          # guardModuleRoute + module chrome
      page.tsx                            # hub / default surface redirect
      loading.tsx
      error.tsx
      _components/                        # module UI — default location
      _actions/
      _queries/
      [surface]/page.tsx                  # list / workspace surfaces
      [surface]/[documentId]/page.tsx     # entity detail (required for operational ERP)
```

**Template baseline (static `{module}` segment):** template §2 uses `apps/erp/src/app/(protected)/modules/{module}/` with `_components/`, `_actions/`, `_queries/`. **Target evolution:** `[moduleSlug]` dynamic segment validated against module registry — same colocation rules inside the segment.

---

## Non-module surfaces (allowlist)

These are **not** LoB modules — separate route trees, same spine rules:

| Surface | Path | Ingress |
| ------- | ---- | ------- |
| User settings | `app/(protected)/settings/**` | `apps/erp/src/lib/user-settings/` |
| System admin | `app/(protected)/system-admin/**` | `apps/erp/src/lib/system-admin/` |
| Metadata operator | `app/(protected)/metadata-workspace/` | `apps/erp/src/lib/metadata/` |
| Operator auth | `app/(protected)/operator/auth/**` | `apps/erp/src/lib/auth/` |

`apps/erp/src/components/` — **cross-cutting only** (e.g. metadata operator tools). **Not** the default home for module screens.

---

## File placement (module work)

| You are adding… | Put it in… |
| --------------- | ---------- |
| Module identity / UI contract | `packages/features/erp-modules/src/{slug}/` |
| Surface loader | `apps/erp/src/lib/{module}/load-{surface}-page.server.ts` |
| Module runtime projection | `apps/erp/src/lib/{module}/load-{module}-runtime-context.server.ts` |
| Permission + manifest policy | `apps/erp/src/lib/{module}/{module}.route-policy.ts` |
| Module presentation | `app/(protected)/modules/.../[moduleSlug]/_components/` |
| Page URL shell | `app/(protected)/modules/.../[moduleSlug]/[surface]/page.tsx` |
| BFF endpoint | `app/api/internal/v1/**/route.ts` + contract |
| Mutation (form) | `apps/erp/src/lib/{module}/{module}.server-actions.ts` or `*.action.ts` |

---

## Anti-patterns (hard stop)

| Do not | Why |
| ------ | --- |
| Drop module UI in `src/components/{module}/` by default | Template colocates under `modules/.../_components/` |
| Add `app/.../page.tsx` without `{module}.pas006-ui.contract.ts` entry | Orphan route — fails metadata/registry gates |
| Create `packages/{lob}/` without ADR + slice | Path law: `packages/features/erp-modules/src/{slug}/` |
| Put business logic in `page.tsx` | Page calls loader only |
| Use `force-static` or `generateStaticParams` on module routes | Tenant leak risk |

---

## Scaffold vs target (MCP snapshot)

**MCP `get_routes` (2026-06-25):** disk uses **static** module paths while contracts attest surfaces.

| MCP route (today) | Contract / registry | Target segment |
| ----------------- | ------------------- | -------------- |
| `/modules/procurement/requisitions` | `PROCUREMENT_REQUISITIONS_LIST_ROUTE` | `/modules/[moduleSlug]/requisitions` |
| `/modules/procurement/purchase-orders` | `PROCUREMENT_PURCHASE_ORDERS_LIST_ROUTE` | `/modules/[moduleSlug]/purchase-orders` |
| `/modules/procurement/readiness` | foundation readiness | `/modules/[moduleSlug]/readiness` |
| `/modules/accounting/standards-readiness` | accounting B20 consumer | `/modules/[moduleSlug]/standards-readiness` |
| `/modules/{id}` hub | `ERP_MODULE_MANIFEST` (`workspace`, `accounting`, …) | `/modules/[moduleSlug]` |

`procurement` is **not** in `ERP_MODULE_MANIFEST` yet (exemplar under ADR-0031) — static `procurement` folder is scaffold attestation, not final manifest shape.

Verify after changes: `nextjs_call get_routes` — compare to [module-route-surface-registry.md](module-route-surface-registry.md).
