# Rendering and caching matrix

**Authority:** Next.js 16 [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) · [Caching](https://nextjs.org/docs/app/getting-started/caching) · Afenda `ApiCachePolicy` in `apps/erp/src/server/api/contracts/`.

Afenda ERP is **tenant-scoped by default**. Generic Next.js static optimization does not apply without explicit tenant isolation review.

---

## A. Route handlers (`app/api/**/route.ts`)

Governed internal v1 routes: **cache policy on the contract** drives segment exports via `resolveNextDynamic` (`api-route-policy.contract.ts`).

| Contract `cache.kind` | `export const dynamic` | `export const revalidate` | When |
|----------------------|------------------------|---------------------------|------|
| `no-store` | `force-dynamic` | omit | **Default** — mutations, workspace reads, tenant reads, auth, OpenAPI |
| `revalidate` + `seconds` | `auto` | `seconds` | Health / diagnostics only |
| `static` | `force-static` | per policy | **Prohibited** for tenant data without ADR |

### Method policy (hard rules)

From `method-policy.contract.ts`:

| HTTP | Cache rule |
|------|------------|
| POST, PUT, PATCH, DELETE | Must be `no-store` → `force-dynamic` |
| GET + `workspace` tag | Must be `no-store` |
| Protected mutations | Must declare `audit.enabled: true` |

### Handler template

```ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // mirror contract.cache via policy — do not guess

export const GET = createApiHandler({
  contract: inventoryProductsGetContract,
  async handler(context) { /* ... */ },
});
```

**Do not** hand-pick `dynamic` on governed routes — set `cache` on the contract; route file mirrors the resolved policy.

### Ungoverned routes

| Route | Pattern |
|-------|---------|
| `api/health` | `dynamic = "auto"`, `revalidate = 30` |
| `api/auth/[...all]` | Framework / Better Auth defaults |

---

## B. Pages and layouts (`app/**/page.tsx`, `layout.tsx`)

| Scenario | `dynamic` export | Why |
|----------|------------------|-----|
| `(protected)/**` with session/context | **omit** (`auto`) | Becomes dynamic when layout/loader uses `headers()` / `cookies()` |
| Public static marketing | omit or `force-static` | Rare in ERP |
| Tenant-scoped surface | **never** `force-static` | Hard stop |
| Catch accidental static | `dynamic = 'error'` | Public segments only |
| Build-time cache (Cache Components) | `'use cache'` + `cacheTag` | **ADR required** — off by default for ERP |

Next.js 16 note: when Cache Components are fully enabled, explicit `force-dynamic` on pages may become unnecessary ([migration guide](https://nextjs.org/docs/app/guides/migrating-to-cache-components)). Afenda ERP still treats tenant pages as request-time until tenant-scoped cache tags are proven.

### Request-scoped dedup (not HTTP cache)

```ts
import { cache } from "react";

export const loadProtectedRequestOperatingContext = cache(
  loadProtectedRequestOperatingContextUncached
);
```

Use `React.cache()` for **per-request deduplication** (layout + page + loader). Never use global keys that could cross tenants.

### What makes a segment dynamic automatically

Using any of these opts the segment into dynamic rendering (`dynamic = 'auto'`):

- `headers()`, `cookies()`, `draftMode()`
- `searchParams` in page (unless statically generated)
- Uncached `fetch` with `{ cache: 'no-store' }`

Protected ERP layout chain uses `headers()` via operating context — **all `(protected)` pages are dynamic without exporting `force-dynamic`**.

---

## C. Streaming matrix

| Need | Official pattern | Afenda placement |
|------|------------------|------------------|
| Whole segment loading | `loading.tsx` adjacent to `page.tsx` | Add under `(protected)/modules/**` as surfaces grow |
| Independent async regions | `<Suspense fallback={...}>` | Inside `*-panel.tsx` for slow widgets |
| Parallel views | `@folder` slots in `layout.tsx` | Only with ADR (modals, split pane) |
| Intercepted modals | `(.)segment` | Not used today |

Reference: [Loading UI](https://nextjs.org/docs/app/api-reference/file-conventions/loading) · [Streaming](https://nextjs.org/docs/app/guides/streaming).

---

## D. Decision flowchart

```text
New surface?
├─ Route handler?
│  ├─ Governed internal v1? → Set contract.cache → mirror dynamic in route.ts
│  └─ Infra/auth only? → health: revalidate 30; auth: framework default
└─ Page or layout?
   ├─ Tenant or session scoped? → Omit dynamic; never force-static; no global use cache
   └─ Public docs/marketing? → static / generateStaticParams OK (apps/docs pattern)
```

---

## E. Images and fonts

| API | ERP today | Target |
|-----|-----------|--------|
| `next/image` | Configured `remotePatterns`; little usage | Use with explicit `sizes` for operator media |
| `next/font` | Not in ERP root layout | Add when typography is product-owned (docs uses `docs-fonts.ts`) |

---

## F. Proxy and caching interaction

`proxy.ts` matcher excludes static assets (`_next/static`, `_next/image`, images). Prefetch and CDN caching of static assets are unaffected by tenant dynamic rules.

**Planned (not yet in code):** subdomain → `x-tenant-slug` header in proxy. Until implemented, tenant ingress uses API client scope headers and session-backed context resolution — document as runtime gap, not skill fiction.
