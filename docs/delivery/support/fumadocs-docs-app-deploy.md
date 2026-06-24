# Fumadocs docs app deploy — `@afenda/docs`

| Field | Value |
| --- | --- |
| **Package** | `@afenda/docs` (PKG-005) |
| **App path** | `apps/docs/` |
| **Delivery** | [TIP-032 Slice 6](../tips/[Complete]%20tip-032-implementation-documentation.md#slice-6--deploy-target-afendadocs) |
| **Architecture** | [`docs-app-architecture.md`](../../architecture/docs-app-architecture.md) |

## Summary

The Fumadocs documentation site deploys as a **separate Vercel project** from `@afenda/erp`. It has **zero runtime `@afenda/*` workspace dependencies** and requires **no ERP auth, database, or CSP secrets**.

## Vercel project setup

| Setting | Value |
| --- | --- |
| **Root Directory** | `apps/docs` |
| **Framework** | Next.js |
| **Production branch** | `main` |
| **Install command** | `cd ../.. && pnpm install --frozen-lockfile` |
| **Build command** | `cd ../.. && pnpm --filter @afenda/docs build` |

Monorepo install/build commands are also declared in [`apps/docs/vercel.json`](../../../apps/docs/vercel.json).

[`apps/docs/next.config.ts`](../../../apps/docs/next.config.ts) sets `outputFileTracingRoot` to the monorepo root so Next.js file tracing resolves workspace dependencies during Vercel builds.

## Environment variables

**None required** for the current static Fumadocs site.

| Rule | Detail |
| --- | --- |
| **Do not attach ERP secrets** | Do not copy `apps/erp/.env.local` values (Supabase, Better Auth, Trigger.dev, etc.) to the docs Vercel project |
| **Local dev** | `pnpm --filter @afenda/docs dev` on port **3001** — see [`apps/docs/.env.example`](../../../apps/docs/.env.example) |
| **Optional future** | Analytics or search API keys may be added in a registry PR — document here when approved |

## GitHub Actions preview (optional)

When Vercel secrets for a **docs-only project** are configured:

| Secret | Purpose |
| --- | --- |
| `VERCEL_ORG_ID` | Shared org (same as ERP preview) |
| `VERCEL_TOKEN` | Shared deploy token |
| `VERCEL_PROJECT_ID_DOCS` | **Separate** Vercel project ID for `@afenda/docs` |

Workflow: [`.github/workflows/preview-docs.yml`](../../.github/workflows/preview-docs.yml)

The workflow runs `pnpm --filter @afenda/docs build` before deploy and skips gracefully when docs secrets are absent.

## Production domain

| Field | Value |
| --- | --- |
| **Canonical hostname** | `docs.afenda.app` |
| **Vercel project** | Separate from `@afenda/erp` — Root Directory `apps/docs` |
| **Status** | Documented — assign custom domain in Vercel dashboard when ready |

### Operator checklist

1. Create or open the **@afenda/docs** Vercel project (Root Directory `apps/docs`).
2. Deploy from `main` — verify `pnpm --filter @afenda/docs build` succeeds in project settings.
3. **Settings → Domains → Add** — enter `docs.afenda.app` (or your chosen hostname).
4. Add the DNS records Vercel displays (typically `CNAME` to `cname.vercel-dns.com` or apex `A` records).
5. Wait for SSL provisioning — Vercel issues the certificate automatically.
6. Record the live URL below once DNS resolves.

| Environment | URL |
| --- | --- |
| **Production** | `https://docs.afenda.app` (pending DNS — update when live) |
| **Preview** | Vercel preview URLs from `preview-docs.yml` when `VERCEL_PROJECT_ID_DOCS` is set |

**Rules:** Do not attach ERP auth, Supabase, or Better Auth env vars to the docs project. The site is static Fumadocs MDX with zero `@afenda/*` runtime workspace dependencies.

## Verification gates

```bash
pnpm --filter @afenda/docs typecheck
pnpm --filter @afenda/docs test:run
pnpm --filter @afenda/docs build
pnpm quality:boundaries
pnpm check:documentation-drift
```

## Related

- ERP preview policy: TIP-009 — [`.github/workflows/preview.yml`](../../.github/workflows/preview.yml)
- CI build gate: root `quality:docs` / CI Gate 4c
