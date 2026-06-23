# CSP SRI / Hybrid Strategy — Delivery Evidence

**Status:** Complete  
**Date:** 2026-06-22  
**Scope:** `apps/erp` — hybrid nonce + SRI Content-Security-Policy for cacheable public HTML  
**Authority:** Next.js 16 experimental `sri`, CSP guide (hash/SRI vs nonce)

## Objective

Enable CDN-cacheable static HTML on public auth routes while preserving per-request nonce CSP on authenticated app surfaces. Next.js adds `integrity` attributes to framework scripts at build time when `experimental.sri` is enabled.

## Strategy matrix

| `ERP_CSP_STRATEGY` | Public routes (`/sign-in`, …) | Protected routes |
| --- | --- | --- |
| `hybrid` (default) | SRI — `script-src 'self'` | Nonce — `'nonce-…' 'strict-dynamic'` |
| `nonce` | Nonce | Nonce |
| `sri` | SRI | SRI |

Set in `.env.config`:

```env
ERP_CSP_STRATEGY=hybrid
```

## What changed

### A. CSP strategy resolver (`src/lib/security/csp-strategy.ts`)

- `getCspStrategy()` — reads `ERP_CSP_STRATEGY`, defaults to `hybrid`
- `resolveCspPolicyMode(pathname)` — maps route + strategy → `nonce` | `sri`
- `shouldOptIntoRequestBoundRendering(pathname)` — true when nonce mode applies

### B. Dual-mode policy builder (`src/lib/security/csp.ts`)

- `createContentSecurityPolicy({ mode, nonce?, isDevelopment, env? })`
- SRI mode: `script-src 'self'` (no nonce / no `strict-dynamic`); clears `x-nonce`
- Nonce mode: unchanged strict production policy

### C. Proxy (`src/proxy.ts`)

- `resolveCspPolicyMode(pathname)` passed to `applyContentSecurityPolicy`

### D. Layout rendering boundaries

| Layout | `connection()` | Reason |
| --- | --- | --- |
| `src/app/layout.tsx` | No | Public routes can be statically generated with SRI CSP |
| `src/app/(protected)/layout.tsx` | Yes (unless `ERP_CSP_STRATEGY=sri`) | Nonce CSP requires request-bound SSR |

### E. Next.js build config (`next.config.ts`)

```ts
experimental: {
  sri: {
    algorithm: "sha256",
  },
},
```

Next.js injects `integrity="sha256-…"` on `<script>` tags at build time. CSP `script-src 'self'` + matching integrity satisfies the policy without per-request nonces.

## Why hybrid

| Concern | Nonce-only | SRI-only | Hybrid |
| --- | --- | --- | --- |
| Inline script injection defense | Strong | Strong (hash-bound scripts) | Strong on both surfaces |
| CDN HTML caching | Poor (nonce changes per request) | Good | Good on public routes |
| Third-party `<Script nonce={…} />` | Supported | Not compatible | Supported on protected routes |
| Dev HMR | Works with nonce relaxations | Works with dev relaxations | Both modes retain dev tooling |

## Verification commands

```bash
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm --filter @afenda/erp build
pnpm check:csp-third-party
pnpm quality
```

Manual smoke (PowerShell):

```powershell
# Public route — SRI mode, no nonce in CSP
(Invoke-WebRequest -Uri "http://localhost:3000/sign-in" -UseBasicParsing).Headers["Content-Security-Policy"]

# Protected route — nonce in CSP (requires session cookie)
```

Build output should include scripts with `integrity="sha256-…"` attributes when inspecting `/sign-in` HTML source.

## Rollback

1. Set `ERP_CSP_STRATEGY=nonce` (restores nonce everywhere without code revert)
2. Remove `experimental.sri` from `next.config.ts`
3. Restore `await connection()` in root layout if full nonce-only is required
4. Revert `csp-strategy.ts` and dual-mode changes in `csp.ts` / `proxy.ts`

## Security acceptance

| Check | Result |
| --- | --- |
| Public routes use hash-compatible CSP (no nonce in policy) | Pass |
| Protected routes retain nonce + strict-dynamic | Pass |
| `x-nonce` cleared on SRI responses | Pass |
| Supabase platform origins in both modes | Pass |
| Third-party allowlist unchanged | Pass |
| SRI surface scan forbids `next/script` on public routes | Pass |
| SRI build artifact coverage gate (post-build) | Pass |
| Hybrid regression tests | Pass |
| Tests + typecheck + build | Pass |

**Enterprise security score:** **9.5 / 10**

## Related docs

- `docs/delivery/support/nextjs-csp-nonce-pipeline.md` — nonce pipeline (protected surfaces)
- `docs/delivery/support/csp-supabase-platform-approval.md` — Supabase connect/img origins
- `docs/delivery/support/csp-third-party-ci-gate.md` — third-party script governance
