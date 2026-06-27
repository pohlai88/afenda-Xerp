# csp-third-party

Use when adding **any external script**, analytics tag, payment SDK, chat widget, or `@next/third-parties` integration to `apps/erp`.

## Quick checklist

```
[ ] 1. Origin added to apps/erp/src/lib/security/csp-allowlist.ts (same PR)
[ ] 2. getCspNonce() read in Server Component — not client
[ ] 3. next/script with nonce={nonce} when nonce is present
[ ] 4. No raw <script>, dangerouslySetInnerHTML, or inline eval
[ ] 5. No wildcard CSP sources (*, bare https:)
[ ] 6. pnpm check:csp-third-party passes
[ ] 7. Delivery note updated if new vendor category (analytics, payments, etc.)
```

## Step-by-step

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

## When to use @next/third-parties

Same rules: pass `nonce={nonce}` from `getCspNonce()` and allowlist all domains the helper loads.

## Supabase browser client (platform integration)

Do **not** add Supabase to `csp-allowlist.ts`. When `NEXT_PUBLIC_SUPABASE_URL` and a publishable key are set, CSP adds explicit project origins automatically via `resolveSupabaseCspPlatformOrigins()`:

| Directive | Origin |
|-----------|--------|
| `connect-src` | `https://{project-ref}.supabase.co` — REST / Auth / Storage API |
| `connect-src` | `wss://{project-ref}.supabase.co` — Realtime |
| `img-src` | `https://{project-ref}.supabase.co` — public Storage object URLs |

Implementation: `apps/erp/src/lib/security/csp-supabase-connect-src.ts`. Use `createSupabaseBrowserClient()` from `@/lib/supabase/client` in Client Components.

## Rollback a vendor

1. Remove Script / third-parties usage
2. Remove origins from `csp-allowlist.ts`
3. Re-run `pnpm check:csp-third-party`

## References

- Policy builder: `apps/erp/src/lib/security/csp.ts`
- Supabase connect-src: `apps/erp/src/lib/security/csp-supabase-connect-src.ts`
- Delivery evidence: `docs/governance/support/nextjs-csp-nonce-pipeline.md`
- Cursor rule: `.cursor/rules/csp-third-party-scripts.mdc`
