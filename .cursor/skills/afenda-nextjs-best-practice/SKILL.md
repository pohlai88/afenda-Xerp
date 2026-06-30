---
name: afenda-nextjs-best-practice
description: >-
  Afenda Next.js 16 App Router best practices for the multi-app monorepo — apps/erp as BFF,
  tenant-slug subdomain routing, operating-context multi-tenancy, Server Components/Actions,
  folder layout, rendering/caching matrices, and runtime verification via next-devtools MCP.
  Use for any apps/erp or apps/docs Next.js work, route handlers, layouts, proxy, data fetching,
  caching, component structure, or when the user mentions Next.js, App Router, BFF, tenant URL,
  or frontend runtime architecture.
paths:
  - apps/erp/**
  - apps/docs/**
---

# Afenda Next.js Best Practice

**Compliance:** Mandatory for all `apps/erp/**` and `apps/docs/**` edits. Generic Next.js guidance comes from the Vercel `nextjs` plugin skill and Context7 MCP — this skill adds **Afenda runtime truth** on top.

## Agent read order

1. This file (summary)
2. [reference/project-structure.md](reference/project-structure.md) — where files go
3. [reference/component-composition.md](reference/component-composition.md) — how files compose
4. [reference/rendering-caching-matrix.md](reference/rendering-caching-matrix.md) — `dynamic` / caching decisions
5. [reference/runtime-mcp.md](reference/runtime-mcp.md) — verify live
6. [reference/app-router-audit.md](reference/app-router-audit.md) — periodic 24-topic check

---

## Runtime self-understanding (MCP first)

Before implementing or debugging `apps/erp`, query the **running** app — do not guess routes or errors from memory.

```text
1. nextjs_index                    → discover port (default 3000 = ERP, 3001 = docs)
2. nextjs_call get_project_metadata → confirm projectPath = apps/erp
3. nextjs_call get_routes          → App Router inventory
4. nextjs_call get_errors          → build/runtime errors (after edits)
5. nextjs_call get_page_metadata   → active page contributors (when browser open)
```

**Dev server:** `pnpm --filter @afenda/erp dev` · MCP endpoint: `/_next/mcp` (Next.js 16+, no config).

If `nextjs_index` returns zero servers → start dev server, retry with `port: "3000"`.

**MCP P0 (verify on every session):** `get_errors` must be clean before claiming done. Known failures documented in [app-router-audit.md](reference/app-router-audit.md).

---

## Multi-app monorepo map

| App | Package | Port | Role |
| --- | --- | --- | --- |
| **ERP** | `@afenda/erp` | 3000 | Product + **BFF** |
| **Docs** | `@afenda/docs` | 3001 | Fumadocs — dynamic/catch-all reference |
| **Storybook** | `@afenda/storybook` | — | Vite, not Next.js |
| **Email** | `@afenda/email` | — | React Email, not Next.js |

**Rule:** Domain logic lives in `packages/*`. `apps/erp` orchestrates — it does not own business rules.

---

## Folder layout (summary)

`src/app/` = routing only. Loaders in `src/lib/{domain}/`. BFF services in `src/server/{domain}/`. Shared UI in `src/components/{domain}/`. Segment-private UI in `app/(protected)/{segment}/_components/`.

| I need to add… | Location |
| --- | --- |
| A page URL | `app/(protected)/.../page.tsx` |
| Page data | `lib/{domain}/load-*-page.server.ts` |
| Mutation | `lib/{domain}/*.action.ts` or `app/api/internal/v1/**/route.ts` |
| Reusable panel | `components/{domain}/*-panel.tsx` |
| Single-route UI | `app/.../segment/_components/` |

Full tree: [project-structure.md](reference/project-structure.md)

---

## Request flow

```text
Browser / client
  → proxy.ts (correlation-id, protected-route redirect)
  → [PLANNED] x-tenant-slug header from subdomain resolution
  → RSC layout tree (Server Components default)
  → Route Handler (api/internal/v1/*) OR Server Action ("use server")
  → operating context resolver + permissions
  → packages/* domain services
```

**Runtime truth:** `proxy.ts` today sets correlation-id and auth redirect only. Tenant subdomain → `x-tenant-slug` is **planned** — see `tenant-domain.ts` resolvers. Do not document as implemented until MCP + code match.

---

## BFF boundaries

| Surface | Location | Use when |
| --- | --- | --- |
| **Internal REST v1** | `apps/erp/src/app/api/internal/v1/**` | Client fetch, integrations, governed OpenAPI |
| **Auth** | `apps/erp/src/app/api/auth/[...all]/route.ts` | Better Auth |
| **Server Actions** | `apps/erp/src/lib/**/**.action.ts` | Form mutations, same-origin UI |
| **Never** | Client → DB direct | Always through BFF + permissions |

New internal routes: `createApiHandler` + OpenAPI registry (`afenda-openapi`, `platform-api-contract`).

---

## Rendering and caching (summary)

| Layer | Rule |
| --- | --- |
| **Route handlers** | `contract.cache` → `force-dynamic` for `no-store` (default tenant/mutation) |
| **Protected pages** | Omit `dynamic` — auto-dynamic via `headers()` / context chain |
| **Tenant pages** | Never `force-static`; no cross-tenant cache keys |
| **Request dedup** | `React.cache()` on shared loaders (e.g. operating context) |
| **Streaming** | `loading.tsx` per segment + `<Suspense>` for independent async UI |

Full matrix: [rendering-caching-matrix.md](reference/rendering-caching-matrix.md)

---

## Component composition (summary)

1. **Thin `page.tsx`** — call loader, branch error/ready, delegate to panel.
2. **Loaders** — `load-*-page.server.ts` in `lib/{domain}/`.
3. **Presentation** — `@afenda/shadcn-studio` via panels in `components/` or `_components/`.
4. **`"use client"`** — only for interactivity; never on pages.
5. **`error.tsx`** — client-safe only; no `@afenda/shadcn-studio` (MCP: `node:fs` failure).

Full contracts: [component-composition.md](reference/component-composition.md)

---

## App Router rules (Afenda binding)

1. **Server Components by default** — add `"use client"` only for interactivity, browser APIs, or hooks.
2. **No Pages Router** — no `getServerSideProps`, `getStaticProps`, `next/router`.
3. **Async Server Components** — fetch in loader or colocated `*.server.ts`.
4. **Layouts own chrome** — `(protected)/layout.tsx` resolves operating context once.
5. **Route groups** — `(protected)`, `(marketing)`, `(auth)` — never leak auth layout into public surfaces.
6. **Loading/error boundaries** — per segment that suspends or can fail.
7. **Metadata API** — `metadata` or `generateMetadata`; `params` as `Promise` — always `await`.
8. **Private folders** — `_components/` for segment-only UI; see project-structure doc.

---

## Multi-tenancy + tenant slug URLs

**Authority:** `multi-tenancy-erp` · `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md`

| Concept | Afenda rule |
| --- | --- |
| Tenant resolution (target) | Subdomain `{tenantSlug}.{baseDomain}` → `x-tenant-slug` via proxy |
| Never from URL | Legal entity / company — server-verified against tenant |
| Operating context | `resolve-action-operating-context` / API scope headers — fail closed |
| Session | Better Auth user is platform-scoped; tenant from request, not session alone |

---

## Server Actions (mutations)

Every `"use server"` file is a **public endpoint**. Mandatory: `server-action-security` checklist (8/8).

- Resolve **operating context** inside the action.
- Governed result shape `{ ok, code, userMessage }` — never throw to client.
- Audit protected mutations (`@afenda/observability`).

---

## Performance + optimization

| Priority | Practice |
| --- | --- |
| **P0** | Fix `get_errors` build failures before shipping |
| **P0** | No `node:*` / server-only imports in `error.tsx` client graph |
| **P1** | Parallel fetch in RSC; segment `loading.tsx` + `Suspense` |
| **P1** | `next/dynamic` for heavy client widgets; `next/image` with `sizes` |
| **P2** | `React.cache()` only for request dedup — tenant-scoped if using HTTP cache |
| **P3** | Import from `@afenda/shadcn-studio` barrels; avoid deep paths |

---

## Security (BFF)

| Area | Skill / gate |
| --- | --- |
| CSP / scripts | `csp-third-party` |
| Server Actions | `server-action-security` |
| API shape | `platform-api-contract` |
| RBAC | `rbac-erp` + `authorize-api-route` |
| Env secrets | `env-var-governance` |

---

## Verification gates

```bash
pnpm --filter @afenda/erp typecheck
pnpm test:run --filter @afenda/erp    # or targeted path
```

Then MCP: `nextjs_call port=3000 toolName=get_errors` → clean for touched routes.

UI/CSS → `afenda-presentation-quality`. Ship → `/afenda-ship`.

---

## Composition (do not duplicate)

| Need | Skill |
| --- | --- |
| Generic Next.js 16 API | Vercel plugin `nextjs` + Context7 |
| Tenant / RLS / context | `multi-tenancy-erp` |
| API / OpenAPI | `platform-api-contract`, `afenda-openapi` |
| Auth | `better-auth-erp` |
| Monorepo imports | `monorepo-discipline` |
| UI / CSS | `afenda-presentation-quality`, `afenda-tailwind`, `shadcn-studio` |
| Session contract | `afenda-coding-session` |

Afenda rules **override** generic Next.js advice when they conflict (tenant isolation, package boundaries, governed API envelopes).

---

## Anti-patterns (hard stop)

- Business logic in `apps/erp` that belongs in `packages/*`
- `className` hacks on governed studio primitives against PAS-006 policy
- Client components fetching internal v1 APIs without scope headers
- Caching tenant data with global keys
- Skipping MCP `get_errors` after App Router changes
- Importing `@afenda/database` from `@afenda/shadcn-studio` or client components
- Importing `@afenda/shadcn-studio` in `error.tsx` / `global-error.tsx`
