# App Router audit — 24-topic scorecard

Run this checklist after major App Router work. **Verify with MCP** — filesystem alone is insufficient.

**MCP baseline (2026-06-25, port 3000):**

- Project: `apps/erp`
- UI routes: 8 · API routes: 20
- `configErrors`: `turbopack.extensionAlias` unrecognized in `next.config.ts`
- `sessionErrors`: `/` build error — `error.tsx` → `@afenda/shadcn-studio` → `node:fs`

```text
nextjs_index → nextjs_call get_routes → nextjs_call get_errors
```

---

## Scorecard

| # | Topic | Status | Evidence / gap |
|---|--------|--------|----------------|
| 1 | App Router only | **PASS** | No `pages/` router; MCP `appRouter` only |
| 2 | Project structure | **PASS** | `src/app` routing + `src/lib` + `src/server` — see `project-structure.md` |
| 3 | Routing files | **PASS** | `layout`, `page`, `loading`, `error`, `route.ts` conventions present |
| 4 | Nested routes | **PARTIAL** | `(protected)/modules/**` nested; shallow UI surface (8 pages) |
| 5 | Dynamic routes | **PARTIAL** | API: `[...all]` auth; UI static paths only |
| 6 | Route groups | **PASS** | `(protected)` active; groups omitted from URLs |
| 7 | Private folders | **N/A** | No `_components` yet; convention documented |
| 8 | Parallel / intercepted | **N/A** | Not required for current skeleton |
| 9 | Metadata | **PARTIAL** | Root template + per-page `metadata`; no `generateMetadata` on ERP pages |
| 10 | Component hierarchy | **PASS** | Thin pages + loaders + studio; see `component-composition.md` |
| 11 | Accessibility | **PARTIAL** | Root `loading.tsx` a11y attrs; segment coverage incomplete |
| 12 | Error resilience | **FAIL** | `error.tsx` / `global-error.tsx` break `/` via studio import |
| 13 | Route props (`params`) | **PASS** | Docs uses `Promise` params; ERP static pages N/A |
| 14 | Dynamic segments | **PARTIAL** | BFF dynamic; UI detail `[id]` routes not yet |
| 15 | SSR | **PASS** | Async RSC + protected layout context |
| 16 | RSC streaming | **GAP** | No `Suspense`; no segment `loading.tsx` under `(protected)` |
| 17 | Mutating data | **PASS** | `createApiHandler` + `*.action.ts` pattern |
| 18 | Caching | **PASS** | Contract-driven `force-dynamic`; `React.cache` for context |
| 19 | Error handling | **PARTIAL** | API envelopes strong; UI error boundaries broken at build |
| 20 | Image / font optimization | **GAP** | `remotePatterns` set; no `next/image` / `next/font` in ERP |
| 21 | Route handlers | **PASS** | Governed BFF + OpenAPI |
| 22 | Proxy | **PARTIAL** | `proxy.ts` exists; **no `x-tenant-slug` injection yet** |
| 23 | Server Actions | **PARTIAL** | Pattern correct; minimal surface (1 action file) |
| 24 | Adapter / deploy | **PASS** | `apps/erp/vercel.json`, turbo monorepo build |

**Summary:** ~12 PASS · ~9 PARTIAL · ~2 GAP · ~1 FAIL · ~2 N/A → **not production-best-practice until P0 gaps closed**.

---

## P0 remediation (blocks MCP clean gate)

| # | Issue | Fix |
|---|-------|-----|
| 1 | `error.tsx` studio import | Native `<button>` or client-safe primitive only |
| 2 | `global-error.tsx` same | Same as above |
| 3 | `turbopack.extensionAlias` | Remove from `turbopack` block or gate behind Next version that supports it; dev uses `--webpack` today |

---

## P1 remediation (structure / best practice)

| # | Issue | Fix |
|---|-------|-----|
| 4 | Proxy tenant header | Wire `resolveTenantSlugFromHostname` → `x-tenant-slug` in `proxy.ts` |
| 5 | Segment loading | Add `loading.tsx` under heavy `(protected)/modules/**` segments |
| 6 | `generateMetadata` | Per module page when title/branding is dynamic |
| 7 | Panel extraction | Move inline page JSX to `components/{domain}/*-panel.tsx` |

---

## Official references (Context7 / Next.js 16.2.9)

- [Project structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [Dynamic Routes](https://nextjs.org/docs/app/getting-started/layouts-and-pages#dynamic-routes)
- [Loading UI](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- [Error handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [Proxy (middleware migration)](https://nextjs.org/docs/app/guides/upgrading/version-16#middleware-to-proxy)

---

## Re-run procedure

1. `pnpm --filter @afenda/erp dev`
2. `nextjs_call get_routes` — compare to `project-structure.md`
3. `nextjs_call get_errors` — must be zero on touched routes
4. Update this scorecard date and status columns
