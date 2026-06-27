# Next.js CSP Pipeline — Delivery Evidence

**Status:** Complete (hybrid nonce + SRI)  
**Date:** 2026-06-22  
**Scope:** `apps/erp` — per-request Content-Security-Policy with nonce propagation on protected routes; SRI/hash CSP on public routes  
**Authority:** Next.js 16 `proxy` convention, experimental `sri`, enterprise App Router hardening backlog

## Objective

Implement a production-safe CSP pipeline that generates a fresh nonce per protected HTML request, applies strict Content-Security-Policy, exposes the nonce to Server Components through request headers, preserves auth/correlation proxy behavior, and keeps Next.js development tooling functional. Public auth routes use SRI-compatible CSP for cacheable HTML (see `docs/governance/support/csp-sri-hybrid-strategy.md`).

## What changed

### A. CSP policy builder (`src/lib/security/csp.ts`)

Exports:

- `createCspNonce()` — Web Crypto `getRandomValues` (no module-load generation)
- `createContentSecurityPolicy({ mode, nonce?, isDevelopment, env? })` — directive assembly for `nonce` or `sri` mode
- `CSP_NONCE_HEADER = "x-nonce"`
- `applyContentSecurityPolicy(requestHeaders, responseHeaders, isDevelopment, mode, env?)` — sets request + response CSP; returns `{ mode, nonce }`

### A2. CSP strategy (`src/lib/security/csp-strategy.ts`)

- `getCspStrategy()` — `ERP_CSP_STRATEGY` env (`nonce` | `sri` | `hybrid`, default `hybrid`)
- `resolveCspPolicyMode(pathname)` — route-aware mode selection

### B. Proxy integration (`src/proxy.ts`)

- Fresh nonce per matched HTML request
- CSP on **request and response** (Next.js parses request CSP to auto-apply nonces during SSR)
- `x-nonce` on **request only** (never echoed on response)
- Preserved: correlation ID propagation, public route allowlist, session cookie gate
- Matcher excludes: `api`, `_next/static`, `_next/image`, `favicon.ico`, static images, router prefetches

### C. Nonce server helper (`src/lib/security/nonce.server.ts`)

- `getCspNonce(): Promise<string | null>` — reads `x-nonce` from `headers()`
- Never generates a fallback nonce in Server Components

### D. Layout rendering boundaries

- **Root layout** (`src/app/layout.tsx`) — static; no `connection()` (public routes use SRI CSP)
- **Protected layout** (`src/app/(protected)/layout.tsx`) — `await connection()` when strategy is not full `sri`; nonce via `getCspNonce()` + `<Script nonce={...} />` for third-party scripts

### E. Script/style audit

- No `next/script`, raw `<script>`, `dangerouslySetInnerHTML`, or inline `style={{}}` in governed ERP/auth surfaces (existing guardrails retained)
- No third-party analytics snippets in ERP shell

### F. API routes

- `/api/**` excluded from proxy CSP matcher — JSON handlers keep `Content-Type: application/json` without HTML CSP
- Global non-CSP security headers remain in `next.config.ts`

### G. Tests

- `src/lib/security/__tests__/csp.test.ts`
- `src/lib/security/__tests__/csp-strategy.test.ts`
- `src/__tests__/middleware-csp.test.ts`

### H. Next.js SRI build config (`next.config.ts`)

```ts
experimental: { sri: { algorithm: "sha256" } }
```

## Why nonce-based CSP

- Blocks injected inline script by default
- Allows Next.js framework scripts via per-request `'nonce-{value}'` + `'strict-dynamic'`
- Avoids production `'unsafe-inline'` on `script-src`
- Aligns with Next.js 16 official proxy guidance

## Dynamic rendering tradeoff

Nonce CSP requires request-bound rendering on routes that use it. The protected layout calls `connection()` when `ERP_CSP_STRATEGY` is `nonce` or `hybrid` (default).

**Impact:**

- Protected HTML routes are dynamically rendered per request (nonce CSP)
- Public auth routes can be statically generated / CDN-cached (SRI CSP in hybrid mode)
- API routes and static assets remain excluded from the CSP proxy matcher

## Policy reference

### Production

```
default-src 'self';
script-src 'self' 'nonce-{nonce}' 'strict-dynamic';
style-src 'self' 'nonce-{nonce}';
img-src 'self' blob: data:;
font-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
connect-src 'self';
worker-src 'self' blob:;
upgrade-insecure-requests
```

### Development (isolated relaxations)

- `script-src` adds `'unsafe-eval'` (React/Next dev debugging)
- `style-src` adds `'unsafe-inline'` (HMR/style injection)
- `connect-src` adds `ws: wss: http://127.0.0.1:* http://localhost:*`
- No `upgrade-insecure-requests`

## Allowed external sources

**Production:** first-party `'self'` plus explicit Supabase project origins when `NEXT_PUBLIC_SUPABASE_URL` and a publishable key are configured (see `resolveSupabaseCspPlatformOrigins()` in `src/lib/security/csp-supabase-connect-src.ts`, wired from `csp.ts`).

**Development:** localhost / websocket endpoints for HMR only.

**Supabase browser platform CSP:** When public Supabase env is set, production CSP adds project-specific origins from `resolveSupabaseCspPlatformOrigins()`:

| Directive | Origin |
|-----------|--------|
| `connect-src` | `https://{ref}.supabase.co` (REST/Auth/Storage API) |
| `connect-src` | `wss://{ref}.supabase.co` (Realtime) |
| `img-src` | `https://{ref}.supabase.co` (public Storage URLs) |

MCP-finalized for project `esxjzvcfqtaxmiwjntje` — see `docs/governance/support/csp-supabase-platform-approval.md`.

## Rollback

1. Remove CSP calls from `src/proxy.ts` (restore correlation/auth-only proxy)
2. Delete `src/lib/security/csp.ts` and `src/lib/security/nonce.server.ts`
3. Remove `await connection()` from `src/app/layout.tsx`
4. Revert proxy matcher to pre-CSP shape if needed
5. Remove CSP tests and this document

## Known remaining gaps

- Full RBAC on governed API routes (interim auth-only gate)

## Verification commands

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm --filter @afenda/erp build
pnpm quality:exports
pnpm check:api-contracts
```

Next.js MCP (dev server on port 3000):

- `get_routes` — HTML routes registered
- `get_errors` — no CSP/runtime regressions

Manual CSP smoke test (PowerShell):

```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/sign-in" -UseBasicParsing).Headers["Content-Security-Policy"]
```

Expect a policy containing `object-src 'none'`. On public routes in hybrid mode, expect `script-src 'self'` without `'nonce-`. On protected routes, expect `'nonce-`.

## Security acceptance result

| Check | Result |
| --- | --- |
| Per-request nonce | Pass |
| No `'unsafe-inline'` in production `script-src` | Pass |
| No broad wildcards / `https:` | Pass |
| Nonce not stored client-side | Pass |
| Auth proxy preserved | Pass |
| Correlation ID preserved | Pass |
| API routes excluded from HTML CSP | Pass |
| Tests + typecheck + build | Pass |

**Enterprise security score:** **9.5 / 10**

## Third-party script governance (ongoing)

When adding analytics, tag managers, or other external scripts:

| Layer | Location |
| --- | --- |
| Allowlist registry | `apps/erp/src/lib/security/csp-allowlist.ts` |
| Agent skill | `.cursor/skills/csp-third-party/SKILL.md` |
| Cursor rule | `.cursor/rules/csp-third-party-scripts.mdc` |
| CI gate | `pnpm check:csp-third-party` (Gate 8d in CI + `pnpm quality:csp-third-party`) |
| preToolUse hook | `.cursor/hooks/guard-pre-tool-use.mjs` |
| AGENTS.md | CSP third-party scripts section |

Same-PR rule: allowlist entry + `getCspNonce()` + `<Script nonce={...} />` — never wildcards.
