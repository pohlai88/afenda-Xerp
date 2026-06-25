# ARCH-AUTH-001 · Slice 13a-debt — Tenant SSO hardening (post-MVP)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Prerequisite** | Slice 13a ✓ · Slice 13b ✓ |
| **Slice** | 13a-debt |
| **Status** | **Delivered** |
| **Type** | Implementation |
| **Risk** | High · **Clean Core:** B |
| **Closes** | 13a known debt (tenant boundary + ops) — **not** a new FR row |

---

## Design (internal-guide)

- **C1:** Tenant-scope SSO invitation gate — resolve tenant from email domain via tenant-scoped provider lookup before `findPendingMemberInvitationForEmail({ email, tenantId })`.
- **C2:** Add `tenantId` to `getEnabledTenantSsoProviderForDomain` (rename to `getEnabledTenantSsoProviderForTenantDomain`); add `(tenant_id, domain)` unique index via drizzle-kit generate.
- **H2:** `syncTenantSsoProviderWithBetterAuth` returns structured result; ERP action surfaces skip reason (missing env secret) — no silent success.
- **M1–M4:** Discriminated metadata contract; Zod parse set/get inputs; single source for `clientSecretEnvKey`; safe `JSON.parse` in action.
- **H4:** Integrations panel — revert optimistic toggle on failure; refresh list after upsert.
- **H1:** Document SAML as deferred in slice-13a known debt; do **not** claim SAML admin UI in 13d until implemented.

**Sequence:** Run **after 13b**, **before 13c** (default sequential — integrations panel shared with 13c).

**Prerequisite evidence:** `packages/auth/` + `packages/database/` rows = `implemented` in `afenda-runtime-truth-matrix.md` (Slices 13a–13b).

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-13a-debt-tenant-sso-hardening.md

1. Objective    — Harden Slice 13a SSO for multi-tenant production: tenant-scoped invitation gate and domain lookup, observable sync failures, boundary-safe contracts, and integrations UI state correctness — without SAML admin UI.
2. Allowed layer— packages/database/src/tenant-sso/ · packages/database/src/schema/ · packages/auth/src/auth.sso-policy.ts · packages/auth/src/auth.sso-sync.ts · apps/erp/src/lib/system-admin/update-sso-provider-settings.action.ts · apps/erp/src/components/system-admin/system-admin-integrations-settings-panel.tsx
3. Files        —
                  packages/database/src/tenant-sso/tenant-sso-provider.contract.ts (Modified)
                  packages/database/src/tenant-sso/tenant-sso-provider.service.ts (Modified)
                  packages/database/src/schema/tenant-sso-provider.schema.ts (Modified)
                  packages/database/src/migrations/<generated>_tenant_sso_tenant_domain_uidx.sql (Generated — drizzle-kit generate)
                  packages/database/src/migrations/migration-governance.contract.ts (Modified)
                  packages/database/src/public-api.ts (Modified — rename export to getEnabledTenantSsoProviderForTenantDomain)
                  packages/database/src/__tests__/tenant-sso-provider.service.test.ts (Modified)
                  packages/auth/src/auth.sso-policy.ts (Modified)
                  packages/auth/src/auth.sso-sync.ts (Modified)
                  packages/auth/src/index.ts (Modified — sync result export if needed)
                  packages/auth/src/__tests__/auth.sso-policy.test.ts (Modified)
                  packages/auth/src/__tests__/auth.sso-sync.test.ts (New)
                  apps/erp/src/lib/system-admin/update-sso-provider-settings.action.ts (Modified)
                  apps/erp/src/components/system-admin/system-admin-integrations-settings-panel.tsx (Modified)
                  apps/erp/src/lib/system-admin/__tests__/update-sso-provider-settings.action.test.ts (Modified)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-13a-sso-idp-config.md (Modified — known debt closure notes)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-13a-debt-tenant-sso-hardening.md (Modified — status)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md (Modified)
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md (Modified — 13a-debt evidence)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — SSO tenant boundary note)
4. Prohibited   — packages/ui; SAML upsert UI; passkey/OAuth scope (13b/13c); hand-edited migration SQL; foundation-disposition.registry.ts; @afenda/accounting; ADR-0010 Accounting Core
5. Authority    — ARCH-AUTH-001 FR-A06.1/06.2 · multi-tenancy skill · afenda-coding-session · PKG003_DATABASE · PKG002_AUTH
6. Gates        —
                  pnpm --filter @afenda/database typecheck
                  pnpm quality:migrations
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm ci:biome
                  pnpm check:documentation-drift
7. Closes       — 13a known debt (tenant boundary + sync ops + UI state)
8. Evidence     — tenant-scoped gate tests · sync result handling · domain index migration
9. Attestation  — Security · Multi-tenancy · Test · Documentation
```

---

## DoD rows

| # | Criterion | Gate |
| --- | --- | --- |
| D1 | SSO invitation gate tenant-scoped | `@afenda/auth test:run` |
| D2 | Domain lookup tenant-scoped | `@afenda/database test:run` |
| D3 | Sync skip surfaced to admin | ERP action test |

---

## Known debt

- SAML admin UI + upsert — deferred (document in slice-13a; do not close in 13d)
- IdP secret rotation UX — follow-up
- ~~Cross-tenant domain collision prevention~~ — closed Slice 13a-debt via `(tenant_id, domain)` unique index migration `20260625155929_bitter_tyger_tiger`
