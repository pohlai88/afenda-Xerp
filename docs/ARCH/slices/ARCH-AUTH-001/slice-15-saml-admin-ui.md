# ARCH-AUTH-001 · Slice 15 — SAML admin UI + upsert

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Prerequisite** | Slice 13d ✓ · Slice 13a schema supports SAML metadata |
| **Slice** | 15 |
| **Status** | **Delivered** 2026-06-26 |
| **Type** | Implementation |
| **Risk** | High · **Clean Core:** B |
| **Closes** | FR-A06.1 SAML leg · slice-13d known debt (SAML admin UI) |

---

## Design (internal-guide)

- Add `upsertTenantSsoSamlProvider` + `upsertTenantSsoSamlProviderInputSchema` mirroring OIDC upsert pattern; secrets/certs in metadata JSON only — never audit metadata.
- Extend `syncTenantSsoProviderWithBetterAuth` to register SAML via Better Auth `registerSSOProvider` `samlConfig` (entryPoint · cert · optional idpMetadataXml).
- Extend `updateSsoProviderSettingsAction` upsert payload as protocol-discriminated union (`oidc` \| `saml`).
- **Admin UI:** Extend Integrations SSO section — protocol selector (RadioGroup) · SAML fields (entry point · IdP cert · optional metadata XML) · list shows protocol badge; layout via `erp-system-admin-form-section` CSS tokens (no `@afenda/ui` className pollution).
- **Prohibited:** IdP private keys in tenant metadata (MVP: cert + entryPoint only); packages/ui primitive edits; new shadcn block promotion without ui:guard.

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-15-saml-admin-ui.md

1. Objective    — Close FR-A06.1 SAML leg: tenant-scoped SAML provider upsert in system-admin Integrations, Better Auth SAML sync, and governed admin UI with Afenda CSS token layout.
2. Allowed layer— packages/database/src/tenant-sso/ · packages/auth/src/auth.sso-sync.ts · apps/erp/src/lib/system-admin/update-sso-provider-settings.action.ts · apps/erp/src/components/system-admin/system-admin-integrations-settings-panel.tsx · apps/erp/src/app/globals.css (SSO form section tokens only)
3. Files        —
                  packages/database/src/tenant-sso/tenant-sso-provider.contract.ts (Modified — SAML upsert schema + parseTenantSsoSamlMetadata)
                  packages/database/src/tenant-sso/tenant-sso-provider.service.ts (Modified — upsertTenantSsoSamlProvider)
                  packages/database/src/public-api.ts (Modified — exports)
                  packages/database/src/__tests__/tenant-sso-provider.service.test.ts (Modified — SAML upsert test)
                  packages/auth/src/auth.sso-sync.ts (Modified — SAML sync path)
                  packages/auth/src/__tests__/auth.sso-sync.test.ts (Modified — SAML sync test)
                  apps/erp/src/lib/system-admin/update-sso-provider-settings.action.ts (Modified — protocol-discriminated upsert)
                  apps/erp/src/lib/system-admin/__tests__/update-sso-provider-settings.action.test.ts (Modified — SAML upsert test)
                  apps/erp/src/components/system-admin/system-admin-integrations-settings-panel.tsx (Modified — SAML admin UI)
                  apps/erp/src/app/globals.css (Modified — erp-system-admin-sso-form section tokens)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-15-saml-admin-ui.md (Modified — status)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md (Modified)
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md (Modified — FR-A06.1 SAML evidence)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — SAML admin note)
4. Prohibited   — packages/ui primitive edits; packages/appshell block promotion; IdP private keys in DB metadata; @afenda/accounting; ADR-0010 Accounting Core; hand-edited migration SQL; foundation-disposition.registry.ts
5. Authority    — ARCH-AUTH-001 Slice 15 · FR-A06.1 · PKG002_AUTH · PKG003_DATABASE · better-auth-erp skill · TIP-004 consumer governance
6. Gates        —
                  pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm check:system-admin-mutation-audit
                  pnpm check:documentation-drift
7. Closes       — FR-A06.1 SAML leg · slice-13d SAML admin UI debt
8. Evidence     — upsertTenantSsoSamlProvider · auth.sso-sync SAML path · integrations panel SAML form · action + service tests
9. Attestation  — Security · Multi-tenancy · Test · Documentation · UI governance
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| FR-A06.1 | Tenant-scoped IdP metadata (SAML) admin upsert | `@afenda/database test:run` + `@afenda/erp test:run` |

---

## Known debt

- IdP secret rotation UX — follow-up slice
- SAML SP private keys / encrypted assertions — env/KMS follow-up (not tenant JSON)
- Sign-in page SAML/OAuth buttons — optional polish slice

---

## Gate log (2026-06-26)

| Gate | Exit | Result |
| --- | ---: | --- |
| `pnpm --filter @afenda/database test:run` | 0 | SAML upsert service test |
| `pnpm --filter @afenda/auth test:run` | 0 | 133/133 pass · SAML sync test |
| `pnpm --filter @afenda/erp test:run` | 0 | SAML action test |
| `pnpm ui:guard:scan` | 0 | Pass |
| `pnpm check:system-admin-mutation-audit` | 0 | Pass |
| `pnpm check:documentation-drift` | 0 | Pass |
