---
name: csp-third-party
description: >-
  Full CSP architecture and third-party script governance for apps/erp. Covers nonce
  pipeline, SRI hybrid strategy, Supabase platform origins, allowlisting, directive
  editing, CSP violation diagnosis, and external script onboarding. Use when modifying
  CSP policy, adding analytics/payment/chat widgets, debugging CSP errors, or onboarding
  to the ERP security pipeline.
disable-model-invocation: true
---

# CSP — `apps/erp` (architecture + third-party)

## Quick checklist (adding external scripts)

Use when adding **any external script**, analytics tag, payment SDK, chat widget, or `@next/third-parties` integration:

```
[ ] 1. Origin added to apps/erp/src/lib/security/csp-allowlist.ts (same PR)
[ ] 2. getCspNonce() read in Server Component — not client
[ ] 3. next/script with nonce={nonce} when nonce is present
[ ] 4. No raw <script>, dangerouslySetInnerHTML, or inline eval
[ ] 5. No wildcard CSP sources (*, bare https:)
[ ] 6. pnpm check:csp-third-party passes
[ ] 7. Delivery note updated if new vendor category (analytics, payments, etc.)
```

---

## Architecture at a glance

| Layer | File | Role |
|-------|------|------|
| Policy builder | `src/lib/security/csp.ts` | Assembles directives; nonce or SRI mode |
| Strategy resolver | `src/lib/security/csp-strategy.ts` | `ERP_CSP_STRATEGY` env → per-route mode |
| Allowlist registry | `src/lib/security/csp-allowlist.ts` | Explicit third-party origins; no wildcards |
| Supabase origins | `src/lib/security/csp-supabase-connect-src.ts` | Auto-resolved from `NEXT_PUBLIC_SUPABASE_URL` |
| Nonce reader | `src/lib/security/nonce.server.ts` | `getCspNonce()` for Server Components |
| Proxy | `src/proxy.ts` | Sets nonce + CSP on every matched HTML request |
| Next config | `next.config.ts` | SRI `sha256`, global non-CSP security headers |

---

## Strategy modes

`ERP_CSP_STRATEGY` env (default: `hybrid`):

| Value | Behaviour |
|-------|-----------|
| `hybrid` | Public/auth routes → SRI (static-cacheable); protected routes → nonce (dynamic) |
| `nonce` | All routes use per-request nonce |
| `sri` | All routes use SRI hash-only CSP (no nonce) |

Route classification via `isPublicRoute(pathname)` (`src/lib/auth/public-routes.ts`).

---

## Production policy reference

```
default-src 'self';
script-src 'self' 'nonce-{N}' 'strict-dynamic';
style-src 'self' 'nonce-{N}';
img-src 'self' blob: data:;
font-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
connect-src 'self' [supabase-https] [supabase-wss] [allowlist];
worker-src 'self' blob:;
frame-src 'self' [allowlist-frameSrc];   ← only if frameSrc non-empty
upgrade-insecure-requests
```

SRI mode: `'nonce-{N}' 'strict-dynamic'` is absent; `'unsafe-eval'`/`'unsafe-inline'` absent.

### Development relaxations (isolated to `NODE_ENV=development`)

- `script-src` adds `'unsafe-eval'` (React/Next HMR debugger)
- `style-src` adds `'unsafe-inline'` (style injection)
- `connect-src` adds `ws: wss: http://127.0.0.1:* http://localhost:*`
- `upgrade-insecure-requests` is omitted

---

## Modifying the base policy

Edit `src/lib/security/csp.ts` — `createContentSecurityPolicy()`.

### Adding a new directive

```ts
const directives = [
  // ...existing
  "media-src 'self' https://cdn.example.com",
];
```

Always:

- Use explicit `https://` origins, never `*` or bare `https:`
- Mirror both `nonce` and `sri` branches if mode-specific behaviour applies
- Add a corresponding test in `src/lib/security/__tests__/csp.test.ts`

### Tightening an existing directive

```bash
pnpm --filter @afenda/erp build
pnpm --filter @afenda/erp test:run
```

Then manual browser smoke — DevTools → Console for CSP violations.

---

## Adding third-party scripts (step-by-step)

### 1. Allowlist the vendor

Edit `apps/erp/src/lib/security/csp-allowlist.ts`:

```ts
export const CSP_THIRD_PARTY_ALLOWLIST = {
  scriptSrc: ["https://www.googletagmanager.com"],
  connectSrc: ["https://www.google-analytics.com"],
  imgSrc: ["https://www.google-analytics.com"],
  fontSrc: [],
  frameSrc: [],
} as const satisfies CspThirdPartyAllowlist;
```

Rules:

- Full `https://` origins only (include path only if vendor requires it).
- List every directive the vendor needs — do not rely on `default-src` fallthrough.
- Never use `*`, `https:`, or `'unsafe-inline'` in production script directives.

### 2. Load script from a Server Component

```tsx
import Script from "next/script";
import { getCspNonce } from "@/lib/security/nonce.server";

export default async function AnalyticsScripts() {
  const nonce = await getCspNonce();
  if (nonce === null) {
    return null;
  }

  return (
    <Script
      nonce={nonce}
      src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"
      strategy="afterInteractive"
    />
  );
}
```

Wire into root or segment layout — keep `"use client"` boundaries away from nonce reads.

### 3. Verify

```bash
pnpm check:csp-third-party
pnpm --filter @afenda/erp test:run
pnpm --filter @afenda/erp build
```

Dev smoke: load page → DevTools → Network → confirm script loads → Console has no CSP violations.

---

## When to use @next/third-parties

Same rules: pass `nonce={nonce}` from `getCspNonce()` and allowlist all domains the helper loads.

---

## Supabase browser client (auto-resolved)

Do **not** add Supabase to `csp-allowlist.ts`.

When `NEXT_PUBLIC_SUPABASE_URL` and a publishable key are set, `resolveSupabaseCspPlatformOrigins()` automatically adds:

| Directive | Origin |
|-----------|--------|
| `connect-src` | `https://{ref}.supabase.co` |
| `connect-src` | `wss://{ref}.supabase.co` |
| `img-src` | `https://{ref}.supabase.co` |

Implementation: `src/lib/security/csp-supabase-connect-src.ts`. Use `createSupabaseBrowserClient()` from `@/lib/supabase/client` in Client Components.

---

## Reading the nonce in Server Components

```ts
import { getCspNonce } from "@/lib/security/nonce.server";

const nonce = await getCspNonce(); // string | null
```

- Returns `null` on SRI routes or when no nonce header is present
- Never generate a fallback nonce in components
- Never import this in `"use client"` files — it is `server-only`

---

## Debugging CSP violations

### Browser

DevTools → Console: look for `Content Security Policy: The page's settings blocked the loading of a resource…`

Note the **directive** (e.g. `script-src`) and **blocked URI**. Then:

- External URI → add to `csp-allowlist.ts` under the matching directive
- `'inline'` → find the raw `<script>` or inline handler and replace with `next/script` + nonce
- `'eval'` → production code is calling `eval()`; locate and remove

### PowerShell — inspect live policy

```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/sign-in" -UseBasicParsing).Headers["Content-Security-Policy"]
```

- Public routes → no `'nonce-`; expect `script-src 'self'`
- Protected routes → expect `'nonce-{value}'` and `'strict-dynamic'`

### `Content-Security-Policy-Report-Only`

For safe rollout, switch to report-only in `applyContentSecurityPolicy()` in `csp.ts`. Next.js reads both headers and extracts the nonce.

---

## Forbidden patterns

```tsx
// ❌ raw script tag
<script src="https://cdn.example.com/a.js" />

// ❌ next/script without nonce
<Script src="https://cdn.example.com/a.js" strategy="afterInteractive" />

// ❌ wildcard in allowlist
scriptSrc: ["https:"]

// ❌ nonce generated in a component
const nonce = crypto.randomUUID();

// ❌ nonce stored on client
localStorage.setItem("nonce", nonce);

// ❌ 'unsafe-inline' in production script-src
"script-src 'self' 'unsafe-inline'"
```

---

## Rollback a vendor

1. Remove Script / third-parties usage
2. Remove origins from `csp-allowlist.ts`
3. Re-run `pnpm check:csp-third-party`

---

## Verification commands

```bash
pnpm check:csp-third-party          # governance gate
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm --filter @afenda/erp build     # required before SRI artifact check in CI
```

### Risk mitigations (enforced)

| Risk | Gate |
|------|------|
| External callers break on CSP input shape | `ContentSecurityPolicyInput` is module-internal |
| Partial Next.js SRI coverage | `check-csp-third-party` validates sign-in.html integrity ratio when build exists |
| Third-party scripts on public SRI routes | Static scan forbids `next/script` under `(auth)/` and public `(dev)/` harness routes |
| Hybrid behavior regression | `csp-hybrid-regression.test.ts` + CSP test suite |

Tests:

- `src/lib/security/__tests__/csp.test.ts`
- `src/lib/security/__tests__/csp-strategy.test.ts`
- `src/lib/security/__tests__/csp-hybrid-regression.test.ts`
- `src/__tests__/middleware-csp.test.ts`
- `src/lib/security/__tests__/csp-supabase-connect-src.test.ts`
- `scripts/governance/__tests__/csp-sri-governance.test.ts`

---

## References

- Delivery evidence: `docs/governance/support/nextjs-csp-nonce-pipeline.md`
- Hybrid SRI strategy: `docs/governance/support/csp-sri-hybrid-strategy.md`
- CI gate: `docs/governance/support/csp-third-party-ci-gate.md`
- Cursor rule: `.cursor/rules/csp-third-party-scripts.mdc`
- Next.js CSP guide: https://nextjs.org/docs/app/guides/content-security-policy
