# fdr-007-tenant-auth-branding — Tenant Auth Shell Branding

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-007-tenant-auth-branding` |
| **ARCH pairing** | [`ARCH-AUTH-003`](../../ARCH/ARCH-AUTH-003-tenant-auth-branding.md) |
| **Packages** | `@afenda/database` · `@afenda/storage` · `@afenda/appshell` · `apps/erp` |
| **Lane** | amber-lane |
| **Runtime owner** | `apps/erp/src/lib/auth` · `packages/appshell/src/auth-shell` |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |

## Purpose

Deliver end-to-end per-tenant auth shell branding: admin configures logo (R2), copy, and colors; persisted in `tenant_settings.appearance`; resolved server-side from `x-tenant-slug`; rendered via `@afenda/appshell/auth-shell` `visual` slot on `(auth)` routes.

> **Consolidation (2026-06-26):** Branding applies to canonical `(auth)` layout. Legacy `(auth-v2)` / `/v2/*` paths decommissioned.

## Scope

**In scope**

- `tenant_settings.appearance` jsonb + Zod contract + `upsertTenantSettingsSection`
- First ERP `@afenda/storage` consumer: signed upload at `/api/internal/v1/storage/tenant-brand-logo`
- `resolveTenantAuthBrand.server.ts` with `cache()` + active-tenant checks
- `AuthShellBrandPanel` extensions (`logoUrl`, `brandColor`, `AuthShellBrandCopy`)
- Async `(auth)/layout.tsx` + `AuthEntryPage` visual forwarding
- System Admin Appearance panel at `/system-admin/settings/appearance`
- CSP `img-src` for R2 signed URL origin
- Gates: database/appshell/erp tests, `check:auth-shell-boundary`, `ui:guard:scan`, `check:package-css-dist-sync`

**Out of scope**

- Protected ApplicationShell sidebar branding
- Hand-edited SQL migrations
- `packages/ui` primitive edits

## Persistence

| Column | Type | Contract |
| --- | --- | --- |
| `tenant_settings.appearance` | jsonb | `tenantAppearanceSettingsSchema` |

Fields: `enabled`, `productLabel`, `headline`, `supportingText`, `primaryColor`, `logoObjectId`.

## Storage pipeline

| Piece | Path |
| --- | --- |
| Bucket path | `tenants/{tenantId}/brand/logo.{ext}` |
| Upload API | `apps/erp/src/app/api/internal/v1/storage/tenant-brand-logo/route.ts` |
| Service factory | `apps/erp/src/lib/storage/resolve-object-storage-service.server.ts` |
| Env | `OBJECT_STORAGE_*` per `.env.example` |

Upload guards: system-admin permission, MIME allowlist (`image/png`, `image/jpeg`, `image/webp`), max 512KB, audit on upload + save.

## Resolver

`resolveTenantAuthBrand()` — read slug from routing headers; `findTenantBySlug`; load appearance; resolve `logoUrl` via storage; return `null` for apex/unknown/disabled (caller uses defaults).

## Admin mutation

| Piece | Path |
| --- | --- |
| Panel | `system-admin-appearance-settings-panel.tsx` |
| Loader | `resolve-appearance-settings.server.ts` |
| Save | `update-appearance-settings.action.ts` |
| Audit | `system-admin-mutation-audit.registry.ts` |

## Gates

```bash
pnpm --filter @afenda/database test:run
pnpm --filter @afenda/appshell test:run -- auth-shell
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp exec vitest run src/lib/auth
pnpm check:auth-shell-boundary
pnpm ui:guard:scan
pnpm sync:package-css-dist -- --package @afenda/appshell
pnpm check:package-css-dist-sync
```

## Remaining gaps

- Registry promotion for touched packages (delegate `foundation-registry-owner` when lane promotion required)
- Live R2 integration smoke in deployed preview (env-dependent)
