---
name: afenda-nextjs-best-practice
description: >-
  Afenda Next.js 16 App Router best practices for the multi-app monorepo — apps/erp as BFF,
  tenant-slug subdomain routing, operating-context multi-tenancy, Server Components/Actions,
  and runtime verification via next-devtools MCP. Use for any apps/erp or apps/docs Next.js work,
  route handlers, layouts, proxy, data fetching, caching, or when the user mentions Next.js,
  App Router, BFF, tenant URL, or frontend runtime architecture.
paths:
  - apps/erp/**
  - apps/docs/**
---

# Afenda Next.js Best Practice

**Compliance:** Mandatory for all `apps/erp/**` and `apps/docs/**` edits. Generic Next.js guidance comes from the Vercel `nextjs` plugin skill and Context7 MCP — this skill adds **Afenda runtime truth** on top.

## Runtime self-understanding (MCP first)

Before implementing or debugging `apps/erp`, query the **running** app — do not guess routes or errors from memory.

```text
1. nextjs_index                    → discover port (default 3000)
2. nextjs_call get_project_metadata → confirm projectPath = apps/erp
3. nextjs_call get_routes          → App Router inventory
4. nextjs_call get_errors          → build/runtime errors (after edits)
5. nextjs_call get_page_metadata   → active page contributors (when browser open)
```

**Dev server:** `pnpm --filter @afenda/erp dev` · MCP endpoint: `/_next/mcp` (Next.js 16+, no config).

If `nextjs_index` returns zero servers → start dev server, retry with `port: "3000"`.

Detail: [reference/runtime-mcp.md](reference/runtime-mcp.md)

---

## Multi-app monorepo map

| App | Package | Role | Next.js pattern |
| --- | --- | --- | --- |
| **ERP** | `@afenda/erp` | Product + **BFF** | App Router, `proxy.ts`, `api/internal/v1/*`, Server Actions |
| **Docs** | `@afenda/docs` | Fumadocs marketing/docs | App Router, static/MDX, no tenant context |
| **Storybook** | `@afenda/storybook` | Presentation lab | Vite — **not** Next.js |
| **Email** | `@afenda/email` | Transactional templates | React Email — **not** Next.js |

**Rule:** Domain logic lives in `packages/*`. `apps/erp` orchestrates — it does not own business rules.

Layer imports: `monorepo-discipline` · `@afenda/architecture-authority` CI gates.

---

## `apps/erp` — BFF + App Router architecture

### Request flow

```text
Browser / client
  → proxy.ts (correlation-id, protected-route redirect)
  → x-tenant-slug header (tenant subdomain resolution — tenant only, never company)
  → RSC layout tree (Server Components default)
  → Route Handler (api/internal/v1/*) OR Server Action ("use server")
  → @afenda/permissions + operating context resolver
  → packages/* domain services
```

### BFF boundaries

| Surface | Location | Use when |
| --- | --- | --- |
| **Internal REST v1** | `apps/erp/src/app/api/internal/v1/**` | Client fetch, integrations, governed OpenAPI |
| **Auth** | `apps/erp/src/app/api/auth/[...all]/route.ts` | Better Auth |
| **Server Actions** | `apps/erp/src/lib/**/**.action.ts` | Form mutations, same-origin UI |
| **Never** | Client → DB direct | Always through BFF + permissions |

New internal routes: `createApiHandler` + OpenAPI registry (`afenda-openapi`, `platform-api-contract`).

### App Router rules (Afenda binding)

1. **Server Components by default** — add `"use client"` only for interactivity, browser APIs, or hooks.
2. **No Pages Router** — no `getServerSideProps`, `getStaticProps`, `next/router`.
3. **Async Server Components** — fetch in the component or a colocated `*.server.ts`; no client-side data waterfalls for initial render.
4. **Layouts own chrome** — `(protected)/layout.tsx` resolves operating context once; pages compose, do not re-resolve tenant.
5. **Route groups** — `(auth)`, `(protected)`, `(marketing)` — never leak auth layout into public surfaces.
6. **Loading/error boundaries** — `loading.tsx` / `error.tsx` per segment that suspends or can fail; keep `error.tsx` client-safe (no Node built-ins in client graph).
7. **Metadata API** — `generateMetadata` in server files; no `next/head` in App Router.

---

## Multi-tenancy + tenant slug URLs

**Authority:** `multi-tenancy-erp` · `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md`

| Concept | Afenda rule |
| --- | --- |
| Tenant resolution | Subdomain `{tenantSlug}.{baseDomain}` → `x-tenant-slug` header via proxy |
| Never from URL | Legal entity / company — always server-verified against tenant |
| Operating context | `resolve-action-operating-context` / API scope headers — fail closed |
| Session | Better Auth user is platform-scoped; tenant injected from request, not session alone |

```text
❌  company slug in subdomain
❌  trust client-sent tenantId without server lookup
✅  resolve tenant slug → tenant row → scope all queries
```

---

## Server Actions (mutations)

Every `"use server"` file is a **public endpoint**. Mandatory: `server-action-security` checklist (8/8).

Additionally for Afenda:

- Resolve **operating context** inside the action (tenant + legal entity scope).
- Use governed action result shape `{ ok, code, userMessage }` — never throw to client.
- Audit protected mutations (`@afenda/observability`).

---

## Performance + optimization (always apply)

Measure with MCP + gates before micro-optimizing. See also Vercel `react-best-practices` plugin and `afenda-webperf`.

| Priority | Practice |
| --- | --- |
| **P0** | Fix `get_errors` build failures before shipping |
| **P0** | No `node:*` / server-only imports in client components or `error.tsx` client graph |
| **P1** | Parallel `fetch` in RSC where independent; avoid request waterfalls in layouts |
| **P1** | `next/dynamic` for heavy client-only widgets; default export for code-split boundaries |
| **P1** | Images: `next/image` with explicit `sizes`; static assets under `public/` |
| **P2** | `React.cache()` / `unstable_cache` only with tenant-scoped keys — **never** cross-tenant cache keys |
| **P2** | Prefetch: `Link` defaults OK; respect `proxy.ts` matcher exclusions for static assets |
| **P3** | Bundle: import from package barrels (`@afenda/ui`), not deep paths; audit with `next experimental-analyze` when needed |

**Caching rule:** Tenant-scoped data is **never** statically cached at build time without explicit tenant isolation review.

---

## Security (BFF)

| Area | Skill / gate |
| --- | --- |
| CSP / scripts | `csp-third-party` |
| Server Actions | `server-action-security` |
| API shape | `platform-api-contract` |
| RBAC | `rbac-erp` + `authorize-api-route` |
| Env secrets | `env-var-governance` — never `NEXT_PUBLIC_` for secrets |

---

## Verification gates (minimum)

After any `apps/erp` chunk:

```bash
pnpm --filter @afenda/erp typecheck
pnpm test:run --filter @afenda/erp    # or targeted path
```

Then **MCP:**

```text
nextjs_call port=3000 toolName=get_errors   → must be clean for touched routes
```

UI/CSS touched → add `afenda-presentation-quality` gates. Ship → `/afenda-ship`.

---

## Composition (do not duplicate)

| Need | Skill |
| --- | --- |
| Generic Next.js 16 API | Vercel plugin `nextjs` + Context7 `nextjs-docs` |
| Tenant / RLS / context | `multi-tenancy-erp` |
| API / OpenAPI | `platform-api-contract`, `afenda-openapi` |
| Auth | `better-auth-erp` |
| Monorepo imports | `monorepo-discipline` |
| UI / CSS | `afenda-presentation-quality`, `afenda-tailwind` |
| Session contract | `afenda-coding-session` Phase 0 + Phase 2 report |

**External skills (optional install):**

```bash
npx skills add vercel-labs/agent-skills@vercel-react-best-practices
npx skills add wshobson/agents@nextjs-app-router-patterns
```

Afenda rules **override** generic Next.js advice when they conflict (tenant isolation, package boundaries, governed API envelopes).

---

## Anti-patterns (hard stop)

- Business logic in `apps/erp` that belongs in `packages/*`
- `className` on `@afenda/ui` primitives (ERP presentation policy)
- Client components fetching internal v1 APIs without scope headers
- Caching tenant data with global keys
- Skipping MCP `get_errors` after App Router changes
- Importing `@afenda/database` from presentation packages (`@afenda/appshell`, `@afenda/shadcn-studio`)
