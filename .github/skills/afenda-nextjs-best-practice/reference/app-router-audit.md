# App Router audit — ERP module scorecard

Run after App Router or module ingress changes. **MCP required** — filesystem alone is insufficient.

```text
nextjs_index → get_routes → get_errors
```

**MCP snapshot (2026-06-25):** 8+ module/admin UI routes; config warning `turbopack.extensionAlias`; `/` build error via `error.tsx` → `@afenda/shadcn-studio`.

---

## Module-first scorecard

| # | Topic | Target | Status |
|---|--------|--------|--------|
| 1 | Module layout authority | `erp-module-foundation-authority` + template §2/§5 | **PASS** (docs) |
| 2 | Three-layer tree | features → lib/{module} → app/modules | **PARTIAL** (scaffold paths) |
| 3 | `_components/` colocation | Inside module route, not `src/components/` bin | **PARTIAL** |
| 4 | UI contract per surface | `{module}.pas006-ui.contract.ts` | **PASS** (procurement exemplar) |
| 5 | Manifest registry | `ERP_MODULE_MANIFEST` + route manifest | **PARTIAL** (procurement not in union) |
| 6 | `modules/layout` force-dynamic | Explicit export | **GAP** (not on disk yet) |
| 7 | `[moduleSlug]` dynamic segment | Validated module param | **GAP** (static folders today) |
| 8 | `[documentId]` detail routes | Entity detail | **GAP** |
| 9 | PAS-001A spine | `loadProtectedRequestOperatingContext` | **PASS** |
| 10 | guardModuleRoute | Manifest enforcement | **PARTIAL** (stub) |
| 11 | BFF force-dynamic | Contract `no-store` | **PASS** |
| 12 | error.tsx client-safe | No studio import | **FAIL** (MCP `/`) |
| 13 | Segment loading | `loading.tsx` per module/surface | **GAP** |
| 14 | generateMetadata | Per surface | **PARTIAL** |
| 15 | Proxy tenant header | `x-tenant-slug` | **GAP** (planned) |
| 16 | Orphan routes | MCP path ↔ contract row | **PARTIAL** (readiness routes) |
| 17 | system-admin / settings trees | Separate ingress libs | **PASS** (routes restored) |
| 18 | Next.js 16 params Promise | await params | **PASS** (where dynamic) |
| 19 | Streaming Suspense | Heavy widgets | **GAP** |
| 20 | docs app catch-all | `[lang]/docs/[[...slug]]` | **PASS** (port 3001) |

---

## P0 (blocks MCP clean gate)

| Issue | Fix |
|-------|-----|
| `error.tsx` / `global-error.tsx` studio import | Native `<button>` only |
| `turbopack.extensionAlias` in next.config | Remove or gate until Next supports it |

---

## P1 (module architecture migration)

| Issue | Fix |
|-------|-----|
| Add `modules/layout.tsx` with `force-dynamic` | Slice |
| Migrate static `procurement/*` → `[moduleSlug]/[surface]` | Slice + update contracts |
| Wire `guardModuleRoute` to manifest | `lib/modules/guard-module-route.server.ts` |
| Add `loading.tsx` under module segments | Per surface |
| Proxy `x-tenant-slug` | `proxy.ts` + `tenant-domain.ts` |

---

## Re-run

1. `pnpm --filter @afenda/erp dev`
2. `nextjs_call get_routes` — compare [module-route-surface-registry.md](module-route-surface-registry.md)
3. `nextjs_call get_errors` — zero on touched routes
