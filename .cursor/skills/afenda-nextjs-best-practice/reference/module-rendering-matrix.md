# Module rendering and caching matrix

**Authority:** Next.js 16 [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) · Afenda `ApiCachePolicy` · PAS-001A spine · template §5 protected ingress flow.

---

## A. ERP module pages (always request-dynamic)

Module surfaces are tenant-scoped, permission-gated, and manifest-registered. **Never treat them as static.**

| Segment | `export const dynamic` | Notes |
| ------- | ---------------------- | ----- |
| `(protected)/layout.tsx` | omit (`auto`) | Dynamic via `headers()` / operating context |
| **`(protected)/modules/layout.tsx`** | **`'force-dynamic'`** | Explicit enterprise bar — all module work |
| **`(protected)/modules/[moduleSlug]/**`** | **`'force-dynamic'`** | Per-module layout |
| `(protected)/settings/**` | `'force-dynamic'` or auto via spine | User-scoped |
| `(protected)/system-admin/**` | `'force-dynamic'` or auto via spine | Admin-scoped |
| Public `/` | `auto` / static OK | Rare tenant data |

**Prohibited on module segments:**

- `force-static`
- `generateStaticParams` for tenant module routes
- `'use cache'` / global `cacheTag` without tenant-isolation ADR

**Request dedup:** `React.cache()` on shared loaders (e.g. `loadProtectedRequestOperatingContext`) — per-request only, not HTTP cache.

---

## B. Dynamic URL segments

| Param | Validates against | Example |
| ----- | ----------------- | ------- |
| `moduleSlug` | `defineErpRuntimeModule` / `ErpModuleId` / module registry | `procurement`, `inventory` |
| `surface` | `{module}.pas006-ui.contract.ts` `routes[].routePattern` | `requisitions`, `purchase-orders` |
| `documentId` | Business reference / document family | `PO-8801` |

Next.js 16 — `params` is a **Promise**:

```tsx
export default async function SurfacePage({
  params,
}: {
  params: Promise<{ moduleSlug: string; surface: string }>;
}) {
  const { moduleSlug, surface } = await params;
}
```

---

## C. Route handlers (BFF) — unchanged

Governed `api/internal/v1/**` — cache on **contract**, mirror in `route.ts`:

| Contract `cache.kind` | `dynamic` | `revalidate` |
| --------------------- | --------- | ------------ |
| `no-store` | `force-dynamic` | omit |
| `revalidate` + seconds | `auto` | seconds |
| `static` | `force-static` | per policy — **not** for tenant data |

Mutations must be `no-store`. Workspace-tagged GET must be `no-store`. See `method-policy.contract.ts`.

---

## D. Streaming

| Need | Pattern | Placement |
| ---- | ------- | --------- |
| Segment loading | `loading.tsx` next to `page.tsx` | Per `[moduleSlug]` and heavy `[surface]` |
| Independent widgets | `<Suspense>` | Inside `_components/` |
| Parallel slots | `@folder` | ADR required |

---

## E. Decision flow

```text
New work?
├─ Module surface (LoB)?
│  └─ force-dynamic on modules layout + module layout
│     → guardModuleRoute → loader → _components
├─ Settings / system-admin?
│  └─ force-dynamic recommended; spine via (protected)/layout
├─ BFF route?
│  └─ contract.cache → mirror dynamic
└─ Public / docs app?
   └─ static / generateStaticParams OK (apps/docs only)
```
