# Delivery: Supabase CSP platform origins (MCP-finalized)

| Field | Value |
|-------|-------|
| **Date** | 2026-06-22 |
| **Scope** | ERP CSP platform integration — no policy weakening |
| **MCP project** | `esxjzvcfqtaxmiwjntje` |

## MCP validation

| MCP tool | Result |
|----------|--------|
| `get_project_url` | `https://esxjzvcfqtaxmiwjntje.supabase.co` |
| `get_publishable_keys` | `sb_publishable_Vdg78XqmPlLdy…` matches `.env.config` |
| `list_storage_buckets` | `[]` (no extra storage CDN host required) |
| `get_storage_config` | S3/image features on project host — same origin as API |

No additional Supabase hostnames beyond the project URL are required for browser CSP.

## CSP directives (production)

Derived at runtime from `NEXT_PUBLIC_SUPABASE_URL` via `resolveSupabaseCspPlatformOrigins()`:

| Directive | Origins | Purpose |
|-----------|---------|---------|
| `connect-src` | `https://{ref}.supabase.co` | REST, Auth, Functions, Storage API |
| `connect-src` | `wss://{ref}.supabase.co` | Realtime |
| `img-src` | `https://{ref}.supabase.co` | Public Storage object URLs |

**Not added (intentionally):** wildcards, `'unsafe-inline'`, bare `https:`, third-party Supabase CDN hosts.

**When env unset:** no Supabase origins appended (fail-closed).

## Files

| File | Role |
|------|------|
| `apps/erp/src/lib/security/csp-supabase-connect-src.ts` | Platform origin resolver |
| `apps/erp/src/lib/security/csp.ts` | Merges connect + img origins into policy |
| `apps/erp/src/lib/security/csp-allowlist.ts` | Vendor allowlist only (not Supabase) |
| `apps/erp/src/lib/security/__tests__/csp-supabase-connect-src.test.ts` | Unit + MCP ref regression |

## Verification

```bash
pnpm check:csp-third-party
pnpm --filter @afenda/erp test:run -- src/lib/security/__tests__/csp-supabase-connect-src.test.ts
pnpm --filter @afenda/erp typecheck
```

## Rollback

Revert `csp-supabase-connect-src.ts`, `csp.ts`, tests, and this doc. Production CSP returns to `connect-src 'self'` only when env is unset; with env set, Supabase browser client will be blocked again.
