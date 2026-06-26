# ARCH-AUTH-001 · Slice 18 — IdP secret rotation UX

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BComplete%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Prerequisite** | Slice 17 ✓ · Slice 15 ✓ |
| **Slice** | 18 |
| **Status** | **Delivered** 2026-06-26 |
| **Type** | Implementation |
| **Risk** | High · **Clean Core:** B |
| **Closes** | IdP secret rotation UX carry-forward debt |

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-18-idp-secret-rotation-ux.md

1. Objective    — Add tenant-admin IdP credential rotation (OIDC clientSecretEnvKey + SAML cert) via governed SSO rotate mode, Better Auth sync, and integrations panel UX without secrets in audit metadata.
2. Allowed layer— packages/database/src/tenant-sso/ · apps/erp/src/lib/system-admin/ · apps/erp/src/components/system-admin/
3. Files        —
                  packages/database/src/tenant-sso/tenant-sso-provider.contract.ts
                  packages/database/src/tenant-sso/tenant-sso-provider.service.ts
                  packages/database/src/public-api.ts
                  packages/database/src/__tests__/tenant-sso-provider.service.test.ts
                  apps/erp/src/lib/system-admin/update-sso-provider-settings.action.ts
                  apps/erp/src/lib/system-admin/__tests__/update-sso-provider-settings.action.test.ts
                  apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts
                  apps/erp/src/components/system-admin/system-admin-integrations-settings-panel.tsx
                  apps/erp/src/app/globals.css
                  docs/ARCH/slices/ARCH-AUTH-001/slice-18-idp-secret-rotation-ux.md
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md
                  docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/ui primitives; tenant JSON private keys; IdP secrets in audit metadata; @afenda/accounting
5. Authority    — ARCH-AUTH-001 Slice 15 §Known debt · FR-A06.1 · TIP-004 consumer
6. Gates        —
                  pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm check:system-admin-mutation-audit
                  pnpm check:documentation-drift
7. Closes       — IdP secret rotation UX carry-forward debt
8. Evidence     — rotateTenantSso* service · update-sso rotate mode · integrations panel rotate UI
9. Attestation  — Security · UI governance · Test
```

---

## Delivery evidence (2026-06-26)

- `rotateTenantSsoOidcClientSecretEnvKey` / `rotateTenantSsoSamlCertificate` in `tenant-sso-provider.service.ts` with contract schemas; env-key rotation only (no secret values in DB or audit).
- `updateSsoProviderSettingsAction` `mode: "rotate"` path syncs enabled providers via Better Auth.
- Integrations panel `<details className="erp-system-admin-sso-form__rotate">` for OIDC env-key and SAML cert rotation.
- Tests: `tenant-sso-provider.service.test.ts` (rotate OIDC/SAML + protocol mismatch); `update-sso-provider-settings.action.test.ts` (rotate modes).
