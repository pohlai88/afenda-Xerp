# ERP project structure — folder layout

**Authority:** Next.js 16 [Project structure](https://nextjs.org/docs/app/getting-started/project-structure) · Afenda ADR-0027 · MCP `get_routes` on port 3000.

**MCP snapshot (2026-06-25):** `apps/erp` — 8 UI routes, 20 API routes, `(protected)` group (URL prefix omitted).

---

## Principle

`src/app/` is the **routing surface**. Everything else is **application code** stored outside `app/` (Next.js official “store project files outside of app” strategy), except optional segment-private `_folders` for colocation.

Domain business rules live in `packages/*`. `apps/erp` orchestrates: auth, tenant context, BFF, presentation wiring.

---

## Canonical tree — `apps/erp/src/`

```text
apps/erp/src/
├── app/                              # ROUTING ONLY — becomes URLs when page.tsx / route.ts exists
│   ├── layout.tsx                    # Root <html>, static metadata template, globals.css
│   ├── page.tsx                      # Public home (/)
│   ├── loading.tsx                   # Root streaming fallback (aria-busy)
│   ├── error.tsx                     # Segment error boundary ("use client", minimal deps)
│   ├── global-error.tsx              # Root layout failure boundary
│   ├── not-found.tsx                 # 404 shell
│   ├── globals.css                   # ERP CSS entry (PAS-006A AdminCN chain)
│   │
│   ├── (protected)/                  # Route group — NOT in URL
│   │   ├── layout.tsx                # Session + operating context gate (once per request)
│   │   ├── settings/
│   │   │   └── profile/page.tsx      # → /settings/profile
│   │   ├── modules/
│   │   │   ├── procurement/.../page.tsx
│   │   │   └── accounting/.../page.tsx
│   │   ├── metadata-workspace/page.tsx
│   │   ├── operator/auth/sign-in/page.tsx
│   │   └── {segment}/_components/    # OPTIONAL — private colocation (see matrix below)
│   │
│   └── api/
│       ├── health/route.ts           # Infra liveness (ungoverned)
│       ├── auth/[...all]/route.ts    # Better Auth catch-all (only UI dynamic segment today)
│       └── internal/v1/**/route.ts   # Governed BFF (createApiHandler)
│
├── components/                       # CROSS-ROUTE presentation (domain-grouped)
│   └── {domain}/{surface}-panel.tsx
│
├── lib/                              # APP ORCHESTRATION (loaders, actions, thin clients)
│   ├── context/                      # Operating context, tenant ingress
│   ├── auth/
│   ├── {domain}/
│   │   ├── load-{surface}-page.server.ts
│   │   ├── {mutation}.action.ts
│   │   └── *.client.tsx
│   └── server-actions/               # Shared action helpers (not *.action.ts entries)
│
├── server/                           # BFF DOMAIN SERVICES (backing route handlers)
│   ├── api/contracts/**              # OpenAPI + cache policy (source of truth for dynamic)
│   └── {domain}/*.server.ts
│
├── proxy.ts                          # Next.js 16 proxy (auth redirect, correlation-id)
└── instrumentation.ts                # Observability bootstrap
```

**Path alias:** `@/` → `apps/erp/src/`.

---

## File placement decision table

| You have… | Put it in… | Example |
|-----------|------------|---------|
| A URL page | `app/**/page.tsx` | `app/(protected)/settings/profile/page.tsx` |
| Segment chrome / auth gate | `app/**/layout.tsx` | `(protected)/layout.tsx` |
| Loading UI for a segment | `app/**/loading.tsx` next to `page.tsx` | `(protected)/modules/procurement/loading.tsx` |
| Error UI for a segment | `app/**/error.tsx` | root + per heavy segment |
| REST / webhook endpoint | `app/api/**/route.ts` | `api/internal/v1/inventory/products/route.ts` |
| Page data assembly | `lib/{domain}/load-*-page.server.ts` | `load-procurement-purchase-orders-page.server.ts` |
| Form / UI mutation | `lib/{domain}/*.action.ts` | `context-switch.action.ts` |
| Reusable panel (2+ routes) | `components/{domain}/*-panel.tsx` | `components/procurement/purchase-orders-panel.tsx` |
| Single-route-only UI | `app/(protected)/{segment}/_components/` | `_components/invite-wizard.tsx` |
| BFF business call | `server/{domain}/*.server.ts` | `server/inventory/inventory-products.server.ts` |
| API contract + cache | `server/api/contracts/**` | `inventory.contract.ts` |
| Browser hook / widget | `lib/**/**.client.tsx` | `workspace-scope-unavailable.client.tsx` |

---

## Route groups

| Group | URL effect | Layout responsibility | Status |
|-------|------------|----------------------|--------|
| `(protected)` | None | Session, linked auth, operating context, shell attrs | **Active** |
| `(marketing)` | None | Public marketing chrome | Planned |
| `(auth)` | None | Minimal sign-in chrome | Optional — today sign-in is `(protected)/operator/auth/sign-in` |

Route groups partition layouts without changing paths. Never nest conflicting auth gates.

---

## Private folders (`_name`)

Next.js excludes `_`-prefixed folders from routing ([private folders](https://nextjs.org/docs/app/getting-started/project-structure#private-folders)).

| Folder | Use when | Do not |
|--------|----------|--------|
| `_components/` | UI used by **one** route segment only | Put `page.tsx` inside |
| `_lib/` | Segment-specific helpers (rare) | Duplicate `src/lib/{domain}` loaders |
| `_hooks/` | Segment-specific client hooks | Import server-only modules |

**Afenda default:** prefer `src/components/{domain}/` for reuse; use `_components/` when the UI is truly segment-private and would clutter shared folders.

Official Next.js blog example uses `app/_components/` at app root for shared route-adjacent UI — Afenda instead uses `src/components/` for cross-route sharing (clearer in monorepos).

---

## `src/components/` vs `_components/` matrix

| Criterion | `src/components/{domain}/` | `app/.../segment/_components/` |
|-----------|---------------------------|--------------------------------|
| Used by 2+ routes | **Yes** | No |
| Tied to one URL segment | No | **Yes** |
| Imported from loaders | Yes (server panels) | Yes |
| Test location | `lib/**/__tests__` or colocated | colocated `__tests__` |
| Presentation source | `@afenda/shadcn-studio` blocks | same |

---

## `apps/docs` appendix (port 3001)

Docs is a **reference** for dynamic/catch-all patterns — not tenant ERP rules.

```text
apps/docs/src/
├── app/
│   ├── layout.tsx                    # next/font via docs-fonts.ts
│   └── [lang]/docs/[[...slug]]/page.tsx   # dynamic + catch-all, generateMetadata
├── middleware.ts                     # Fumadocs i18n (edge) — NOT proxy.ts
└── lib/                              # MDX, i18n, OpenAPI preload
```

| ERP | Docs |
|-----|------|
| `proxy.ts` | `middleware.ts` |
| Tenant `x-tenant-slug` | Locale `[lang]` |
| `force-dynamic` BFF default | Static/MDX + `generateStaticParams` where safe |
| `@afenda/shadcn-studio` product UI | Fumadocs UI + local `components/` |

---

## MCP verification

After structural changes:

```text
nextjs_call { port: "3000", toolName: "get_routes" }
```

Compare UI paths against this doc. Route group folders like `(protected)` must **not** appear in URLs.
