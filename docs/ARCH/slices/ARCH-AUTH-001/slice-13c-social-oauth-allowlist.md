# ARCH-AUTH-001 · Slice 13c — Social OAuth allowlist + tenant admin UI

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Amendment** | [`slice-13-phase3-amendment-draft.md`](./slice-13-phase3-amendment-draft.md) — **Accepted 2026-06-25** |
| **Prerequisite** | Slice 13a ✓ · Slice 13b ✓ · Slice 13a-debt ✓ (recommended) |
| **Slice** | 13c |
| **Status** | **Not started** |
| **Type** | Implementation |
| **Risk** | High · **Clean Core:** B |
| **Closes** | FR-A06.4 · partial AUTH-PHASE3-001 (OAuth leg) |

---

## Design (internal-guide)

- Persist tenant OAuth allowlist in `tenant_settings.integrations` (extend `TenantIntegrationsSettings` contract) **or** dedicated JSON section — env-backed client secrets only (same pattern as SSO `clientSecretEnvKey`).
- Enable Better Auth `socialProviders` in `auth.config.ts` for allowlisted providers only (Google, Microsoft MVP); credentials from env vars referenced by tenant config.
- **Invitation gate:** OAuth sign-up flows through existing invitation before-hook — no bypass.
- **CSP:** Add OAuth redirect/script/connect origins to `apps/erp/src/lib/security/csp-allowlist.ts`; run `pnpm check:csp-third-party`.
- **Admin UI:** Extend system-admin Integrations tab — toggle allowlisted providers per tenant (reuse `SystemAdminIntegrationsSettingsPanel` + `update-integrations-settings.action.ts` or dedicated OAuth action if cleaner).
- **Audit:** Register `AUTH_EVENT.oauthSignInSucceeded` · `oauthSignInFailed` · `oauthProviderConfigured` in `auth.contract.ts`; hooks emit via `persistAuthAuditEvent`.
- Flip `AFENDA_AUTH_EXTENSION_POINTS` OAuth/social extension (add field if missing) to `"active"` when integration test attests callback path.
- **Prohibited:** User `/settings/connections` personal OAuth (ARCH-USER-001 future); arbitrary provider plugins without allowlist.

**Prerequisite evidence:** Auth + Database rows = `implemented` in `afenda-runtime-truth-matrix.md` (Slices 13a–13b; 13a-debt recommended).

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-AUTH-001/slice-13c-social-oauth-allowlist.md

1. Objective    — Wire Better Auth social OAuth providers with tenant-scoped allowlist persistence, invitation-gated OAuth sign-up, CSP allowlist updates, system-admin configuration UI, and AUTH_EVENT audit lifecycle.
2. Allowed layer— packages/database/src/tenant-settings/ · packages/auth/src/ · apps/erp/src/lib/system-admin/ · apps/erp/src/components/system-admin/ · apps/erp/src/lib/security/csp-allowlist.ts
3. Files        —
                  packages/database/src/tenant-settings/tenant-settings.contract.ts (Modified — OAuth allowlist schema)
                  packages/database/src/tenant-settings/tenant-settings.service.ts (Modified — if validation helpers needed)
                  packages/database/src/__tests__/tenant-settings-oauth.contract.test.ts (New)
                  packages/auth/src/auth.config.ts (Modified — socialProviders from env + allowlist resolver)
                  packages/auth/src/auth.env.ts (Modified — OAuth client env helpers)
                  packages/auth/src/auth.contract.ts (Modified — AUTH_EVENT oauth + extension point)
                  packages/auth/src/auth.oauth-policy.ts (New — invitation gate helper for OAuth sign-up)
                  packages/auth/src/auth.hooks.ts (Modified — OAuth audit hooks)
                  packages/auth/src/index.ts (Modified)
                  packages/auth/src/__tests__/auth.oauth-policy.test.ts (New)
                  packages/auth/src/__tests__/auth.config.oauth.test.ts (New)
                  packages/auth/src/__tests__/auth.integration.test.ts (Modified — OAuth extension attestation)
                  apps/erp/src/lib/security/csp-allowlist.ts (Modified)
                  apps/erp/src/lib/system-admin/resolve-integrations-settings.server.ts (Modified)
                  apps/erp/src/lib/system-admin/update-oauth-provider-settings.action.ts (New)
                  apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts (Modified)
                  packages/observability/src/surface/governed-mutation-audit-registry.ts (Modified)
                  apps/erp/src/components/system-admin/system-admin-integrations-settings-panel.tsx (Modified — OAuth section)
                  apps/erp/src/lib/system-admin/__tests__/update-oauth-provider-settings.action.test.ts (New)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-13c-social-oauth-allowlist.md (Modified — status)
                  docs/ARCH/slices/ARCH-AUTH-001/slice-index.md (Modified)
                  docs/ARCH/[Partially Implemented] ARCH-AUTH-001-enterprise-authentication.md (Modified — FR-A06.4 evidence)
                  docs/architecture/afenda-runtime-truth-matrix.md (Modified — Auth OAuth note)
4. Prohibited   — packages/ui primitive edits; bypass invitation gate; @afenda/accounting; ADR-0010 Accounting Core; hand-edited migration SQL; user self-service OAuth connections; foundation-disposition.registry.ts; passkey scope (13b); SSO hardening regressions (13a-debt)
5. Authority    — ARCH-AUTH-001 Phase 3 · FR-A06.4 · PKG002_AUTH · csp-third-party skill · ADR CSP pipeline
6. Gates        —
                  pnpm --filter @afenda/database typecheck
                  pnpm --filter @afenda/database test:run
                  pnpm --filter @afenda/auth typecheck
                  pnpm --filter @afenda/auth test:run
                  pnpm --filter @afenda/erp typecheck
                  pnpm --filter @afenda/erp test:run
                  pnpm ui:guard:scan
                  pnpm ci:biome
                  pnpm check:system-admin-mutation-audit
                  pnpm check:csp-third-party
                  pnpm check:documentation-drift
7. Closes       — FR-A06.4 · AUTH-PHASE3-001 OAuth leg (partial)
8. Evidence     — tenant OAuth allowlist · auth.config socialProviders · integrations panel · AUTH_EVENT oauth rows · CSP gate
9. Attestation  — Security · CSP · Multi-tenancy · Test · Documentation
```

---

## DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| FR-A06.4 | Social OAuth allowlist + tenant admin UI | auth + ERP tests + `check:csp-third-party` |

---

## Known debt

- Personal user OAuth connections (`/settings/connections`) — ARCH-USER-001 future slice
- Additional providers beyond Google/Microsoft — follow-up
- OAuth + SSO CSP overlap documentation — 13d evidence-sync
