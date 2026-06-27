# Next.js App Router Hardening — Delivery Evidence

**Status:** Complete (Phase 1 platform hardening)  
**Date:** 2026-06-22  
**Scope:** `apps/erp` only — no TIP-013 business domain work  
**Authority:** Master Plan v4.0.0, ADR-0001, `docs/governance/nextjs-api-hardening.md`

## Objective

Harden the Afenda ERP Next.js 16 App Router shell for production governance: routing boundaries, metadata, error/loading states, security headers, proxy auth boundary, REST handler discipline, server action validation, observability correlation, and UI foundation compliance.

## What changed

### A. Configuration (`apps/erp/next.config.ts`)

- Typed `NextConfig` with `poweredByHeader: false`
- Global security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`
- **Cache Components:** intentionally **disabled** — ERP routes are auth/session-bound and permission-sensitive; enabling `cacheComponents` would require a full cache strategy audit before Phase 2.

### B. MCP tooling (`.mcp.json`)

- Registered `next-devtools-mcp` for runtime inspection via Next.js 16 built-in `/_next/mcp` endpoint.

### C. App Router structure

| File | Purpose |
| --- | --- |
| `src/app/layout.tsx` | Root metadata + globals.css |
| `src/app/loading.tsx` | Root loading boundary |
| `src/app/error.tsx` | Root recoverable error boundary |
| `src/app/not-found.tsx` | 404 surface |
| `src/app/global-error.tsx` | Root fatal error boundary |
| `src/app/(protected)/loading.tsx` | Workspace loading state |
| `src/app/(protected)/error.tsx` | Workspace error state |
| `src/app/(dev)/layout.tsx` | Dev harness noindex metadata |

### D. Metadata

- `src/lib/metadata/site-metadata.ts` — centralized metadata contracts
- Protected ERP, auth, and dev harness routes export `robots: { index: false, follow: false }`
- No tenant/user/company identifiers in metadata

### E. Proxy / auth boundary (`src/proxy.ts`)

- Next.js 16 `proxy` convention (replaces deprecated `middleware.ts`)
- Correlation ID propagation via `x-correlation-id`
- Session cookie gate for protected routes; public route allowlist in `lib/auth/public-routes.ts`
- Added `/appshell-canvas` to public dev harness routes (layout editing + RBAC preview; protected `/` is the primary workspace dashboard)

### F. UI foundation compliance

- Removed inline styles and raw hex from auth layout, sign-in form, sign-out button
- Sign-in/sign-out now use `@afenda/ui` primitives with `mapStockButtonProps` (TIP-004)

### G. Server Actions

- `recordProtectedDemoAction` now validates input with Zod (`1..500` chars)
- Emits structured audit log (`server-action.audit`) before success response

### H. Typed runtime env

- `src/lib/env/server-env.ts` — validates `NODE_ENV` at runtime
- Supabase-specific env remains in `src/lib/supabase/env.ts` (existing governed module)

### I. Guardrail tests

- `src/__tests__/nextjs-app-router-hardening.test.ts` — metadata, proxy, config, boundaries, inline-style/hex bans

## Verification

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm --filter @afenda/erp build
pnpm quality
pnpm check:api-contracts
```

Next.js MCP (dev server running):

```bash
# Cursor / agent: nextjs_index → nextjs_call get_routes / get_errors
```

## Rollback

1. Revert this delivery commit.
2. If proxy rename causes issues, restore `middleware.ts` export name (Next.js 16 still accepts deprecated middleware with warning).
3. Remove added boundary files if they conflict with a future routing redesign.
4. Run `pnpm --filter @afenda/erp clean && pnpm dev` after rollback.

## Remaining gaps (not in scope)

| Gap | Reason |
| --- | --- |
| CSP nonce middleware | Requires nonce pipeline across App Router + third-party scripts |
| Full `@afenda/permissions` enforcement in Server Actions | TIP-010 partial — demo action uses session-only gate |
| OpenAPI generation from route contracts | REST contracts exist; codegen not yet wired |
| `forbidden.js` / `unauthorized.js` | Auth interrupt flows not yet registered in ADR delivery |
| Cache Components adoption | Deferred until stable reference-data surfaces are defined |
| Favicon asset | Cosmetic 404 only; no functional impact |

## Error handling (2026-06-22)

Aligned with `.cursor/skills/error-handling/SKILL.md`:

- `@afenda/kernel` exports `AppError` / `AppErrors` discriminated union
- Server Actions use `failServerAction` + `serverActionSuccess` (log-before-surface via `@afenda/observability`)
- Route segment `error.tsx` boundaries: root, protected, auth, dev
- User-facing surfaces never render stack traces, SQL, or digests

See `apps/erp/src/__tests__/error-handling.test.ts` for guardrails.
 — Production-ready platform shell with governed API runtime, proxy boundary, metadata/noindex, error boundaries, security headers, MCP observability, and UI compliance. Remaining 0.8 reflects permissions depth in Server Actions, CSP, and Cache Components strategy pending Phase 2 surfaces.
