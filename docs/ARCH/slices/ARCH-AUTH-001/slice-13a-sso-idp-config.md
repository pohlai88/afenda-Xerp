# ARCH-AUTH-001 · Slice 13a — Tenant SSO IdP config + SAML/OIDC wiring

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Amendment** | [`slice-13-phase3-amendment-draft.md`](./slice-13-phase3-amendment-draft.md) — **Accepted 2026-06-25** |
| **Slice** | 13a |
| **Status** | **Delivered** |
| **Prerequisite** | Slices 1–12 ✓ · Phase 3 amendment accepted ✓ |
| **Type** | Implementation |
| **Risk** | High · **Clean Core:** B |
| **Closes** | FR-A06.1 · FR-A06.2 · partial AUTH-PHASE3-001 (SSO leg) |

---

## Design (internal-guide)

- Add `tenant_sso_providers` Postgres table (tenant-scoped, protocol `saml` \| `oidc`, metadata JSON, enabled flag); secrets via env/KMS pattern — **never** in audit metadata.
- `@afenda/database` service: CRUD + list-by-tenant; Zod contracts in dedicated contract file (serializable, boundary-safe).
- `@afenda/auth`: enable Better Auth **SSO plugin** in `auth.config.ts`; resolve IdP config from database at runtime (no hardcoded IdP list).
- **Invitation gate:** SSO-initiated sign-up flows through existing `createAfendaAuthInvitationBeforeHook` — no bypass without ADR.
- **Audit:** Register `AUTH_EVENT.ssoSignInSucceeded` · `ssoSignInFailed` · `ssoProviderConfigured` in `auth.contract.ts`; hooks emit via `persistAuthAuditEvent`.
- **Admin UI:** Extend system-admin **Integrations** tab — IdP list + enable/disable + metadata upload (no `@afenda/ui` className pollution).
- **CSP:** IdP redirect origins documented; full CSP allowlist in Slice 13c if OAuth overlap — SSO ACS callback on same origin only for 13a.
- **Extension point:** Flip `AFENDA_AUTH_EXTENSION_POINTS.enterpriseSso` from `"planned"` → `"active"` only when integration test attests SAML/OIDC callback path.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-13a-sso-idp-config.md

1. Objective    — Implement tenant-scoped SSO IdP configuration (SAML/OIDC metadata persistence), wire Better Auth SSO plugin, enforce invitation gate on SSO sign-up, and audit SSO lifecycle via AUTH_EVENT — first Phase 3 implementation slice.
2. Allowed layer— packages/database/src/ · packages/auth/src/ · apps/erp/src/lib/system-admin/ · apps/erp/src/components/system-admin/ · apps/erp/src/app/api/auth/
3. Files        —
                  packages/database/src/schema/tenant-sso-provider.schema.ts (New)
                  packages/database/src/tenant-sso/tenant-sso-provider.contract.ts (New)
                  packages/database/src/tenant-sso/tenant-sso-provider.service.ts (New)
                  packages/database/src/schema/index.ts (Modified)
                  packages/database/src/public-api.ts (Modified)
                  packages/database/src/migrations/<generated>_tenant_sso_providers.sql (New — drizzle-kit generate)
                  packages/database/src/__tests__/tenant-sso-provider.service.test.ts (New)
                  packages/auth/src/auth.config.ts (Modified — SSO plugin)
                  packages/auth/src/auth.contract.ts (Modified — AUTH_EVENT + extension point)
                  packages/auth/src/auth.sso-policy.ts (New — invitation gate helper for SSO)
                  packages/auth/src/auth.hooks.ts (Modified — SSO audit hooks if required by plugin)
                  packages/auth/src/index.ts (Modified — exports)
                  packages/auth/src/__tests__/auth.sso-policy.test.ts (New)
                  packages/auth/src/__tests__/auth.integration.test.ts (Modified — SSO extension attestation)
                  apps/erp/src/lib/system-admin/resolve-integrations-settings.server.ts (Modified — SSO provider list)
                  apps/erp/src/lib/system-admin/update-sso-provider-settings.action.ts (New)
                  apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts (Modified)
                  apps/erp/src/components/system-admin/system-admin-integrations-settings-panel.tsx (Modified)
                  apps/erp/src/lib/system-admin/__tests__/update-sso-provider-settings.action.test.ts (New)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-13a-sso-idp-config.md (Modified — status)
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md (Modified — FR-A06 evidence)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — Auth row SSO note)
4. Prohibited   — packages/ui primitive edits; packages/appshell (unless block promotion explicitly scoped in follow-up); @afenda/accounting; bypass invitation gate; hand-edited migration SQL; local AUTH_EVENT strings; passkey/OAuth (Slices 13b/13c); foundation-disposition.registry.ts
5. Authority    — ARCH-AUTH-001 Phase 3 amendment · FR-A06 · PKG002_AUTH · PKG003_DATABASE · ADR-0014 · better-auth-erp skill · csp-third-party skill (callbacks only)
6. Gates        —
                  pnpm --filter @afenda/database typecheck
                  pnpm quality:migrations
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm check:system-admin-mutation-audit
                  pnpm check:csp-third-party
                  pnpm check:documentation-drift
7. Closes       — FR-A06.1 · FR-A06.2 · AUTH-PHASE3-001 SSO leg (partial)
8. Evidence     — tenant-sso-provider.* · auth.config SSO plugin · integrations panel · AUTH_EVENT SSO rows
9. Attestation  — Security · Multi-tenancy · Test · Documentation
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| FR-A06.1 | Tenant-scoped IdP metadata persisted | `pnpm quality:migrations` + service tests |
| FR-A06.2 | Better Auth SSO plugin wired + invitation gate | `@afenda/auth test:run` |

---

## Known debt

- SAML upsert UI — schema supports SAML metadata; MVP is OIDC-only upsert (**deferred** — no SAML admin UI until follow-up slice)
- ~~Tenant-scoped SSO invitation gate + domain lookup~~ — **Closed** Slice 13a-debt (`getEnabledTenantSsoProviderForTenantDomain`, tenant-scoped invitation gate, sync skip surfacing)
- IdP secret rotation UX — follow-up after 13a MVP
- OAuth social providers — Slice 13c
- Passkeys UI — **Delivered** Slice 13b (`/settings/security` self-service)
- ARCH `[Complete]` — Slice 13d assessment only; filename unchanged until §16 fully green
