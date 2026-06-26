# ARCH-AUTH-003 — Tenant Auth Shell Branding

> **Template:** [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · **Index:** [`arch-status-index.md`](arch-status-index.md) · **Paired FDR:** [`fdr-007-tenant-auth-branding`](../delivery/FDR/[Partially%20Implemented]%20fdr-007-tenant-auth-branding.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-AUTH-003 |
| **Work ID** | ARCH-AUTH-003 · paired `fdr-007-tenant-auth-branding` |
| **Status** | **Complete — 29/30** — end-to-end delivery 2026-06-26 |
| **Date** | 2026-06-26 |
| **Owner** | Platform Authority (`@afenda/database` · `@afenda/storage` · `@afenda/appshell` · `apps/erp`) |
| **Package** | PKG-003 · PKG-015 · PKG-001 · PKG-007 |
| **Lane** | amber-lane |
| **Risk class** | Medium (white-label on tenant host, storage first ERP consumer) |
| **Change class** | Extension |
| **Clean Core target** | B — auth shell presentation; persistence via tenant_settings |

> **Scope:** Per-tenant **auth shell only** branding — logo, copy, primary color on `(auth)` routes when tenant context is present and appearance is enabled.  
> **Not in scope:** Protected `ApplicationShell` sidebar branding, auth URL prefix generation, email template branding, custom CSS injection.

> **Consolidation (2026-06-26):** Runtime paths use canonical `(auth)` segment and flat URLs (`/sign-in`, …). Historical `(auth-v2)` and `/v2/*` references in slice evidence are superseded.

---

## 1. Decisions locked

| Decision | Choice |
| --- | --- |
| Logo delivery | Full R2 upload via `@afenda/storage` signed upload |
| Apex / no slug | Afenda package defaults only |
| URL model | Flat `/sign-in`, `/mfa`, …; tenant from `x-tenant-slug` proxy header |
| Form copy | Route registry platform copy unchanged; brand panel only |

---

## 2. Authority chain

```text
1. docs/ARCH/arch-status-index.md
2. docs/delivery/fdr-status-index.md
3. docs/ARCH/[Complete] ARCH-AUTH-002-auth-shell.md (consumer shell)
4. docs/ARCH/[Complete] ARCH-ADMIN-001 (Appearance settings scaffold)
5. docs/delivery/FDR/[Partially Implemented] fdr-007-tenant-auth-branding.md
6. docs/delivery/FDR/[Partially Implemented] fdr-015-tenant-storage.md
7. packages/database/src/tenant-settings/tenant-settings.contract.ts
8. apps/erp/src/lib/auth/resolve-tenant-auth-brand.server.ts
```

---

## 3. Resolution rules

| Request context | Brand source |
| --- | --- |
| `{slug}.afenda.app/sign-in` | Tenant appearance when `enabled` + tenant `active` |
| `/t/{slug}/sign-in` (rewritten) | Same |
| Dev default slug | Same |
| Production apex, no slug | Package defaults (`AUTH_SHELL_BRAND_*`) |
| Unknown / suspended / archived slug | Afenda default — no tenant-not-found UI on auth |

**Security:** Tenant name/logo on tenant subdomain is intentional white-labeling, not membership enumeration. Apex stays platform-branded.

---

## 4. Serializable contracts

### Persistence (`tenant_settings.appearance`)

See `tenantAppearanceSettingsSchema` in `@afenda/database`.

### Public read (ERP-owned)

`TenantAuthBrand` in `apps/erp/src/lib/auth/tenant-auth-brand.contract.ts` — server-resolved `logoUrl`, no raw `logoObjectId` at render boundary.

### Shell copy (`AuthShellBrandCopy`)

String fields only in `@afenda/appshell/auth-shell` — separate from `ReactNode` props.

---

## 5. Slice index

| Slice | Deliverable | Status |
| ---: | --- | --- |
| 1 | `tenant_settings.appearance` + service | Delivered |
| 2 | ERP storage upload API + env wiring | Delivered |
| 3 | `resolveTenantAuthBrand` + tests | Delivered |
| 4 | `AuthShellBrandPanel` logo/color + CSS | Delivered |
| 5 | Async `(auth)/layout` + entry page visual | Delivered |
| 6 | System Admin Appearance panel + save | Delivered |
| 7 | Gates + runtime matrix sync | Delivered |

---

## 6. Explicit non-goals

- ApplicationShell sidebar / protected app chrome branding
- `buildAuthPath()` tenant-prefixed URLs
- Auth shell i18n
- Per-tenant custom CSS injection
- Email template branding (ARCH-EMAIL-001 P2)

---

## 7. ARCH-AUTH-002 exception

ARCH-AUTH-002 defers tenant signals on auth routes. **Exception (this ARCH):** white-label brand panel on tenant-scoped host only; apex remains Afenda defaults.
