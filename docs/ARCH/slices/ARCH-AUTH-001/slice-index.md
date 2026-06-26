# ARCH-AUTH-001 — Slice catalog

> **Parent:** [`[Complete] ARCH-AUTH-001-enterprise-authentication.md`](../../%5BComplete%5D%20ARCH-AUTH-001-enterprise-authentication.md)  
> **Paired FDR:** [`fdr-002-auth-disposition`](../../../delivery/FDR/%5BComplete%5D%20fdr-002-auth-disposition.md)  
> **Executor:** `afenda-governed-implementer` or `fdr-slice-implementer` · one slice per session  
> **Handoff format:** 9-field (write-fdr-slice / ARCH Appendix A)

| Slice | File | Title | Status | Runtime owner |
| ---: | --- | --- | --- | --- |
| 1 | [slice-01-better-auth-baseline.md](./slice-01-better-auth-baseline.md) | Better Auth baseline | Delivered 2026-06-25 | `packages/auth` |
| 2 | [slice-02-canonical-mirror-sync.md](./slice-02-canonical-mirror-sync.md) | Canonical→mirror sync | Delivered 2026-06-25 | `packages/auth` |
| 3 | [slice-03-tenant-mfa-policy.md](./slice-03-tenant-mfa-policy.md) | Tenant MFA policy + session gate | Delivered 2026-06-25 | `packages/database` · `packages/auth` |
| 4 | [slice-04-invitation-gated-signup.md](./slice-04-invitation-gated-signup.md) | Invitation-gated sign-up | Delivered 2026-06-25 | `packages/auth` |
| 5 | [slice-05-admin-security-tab.md](./slice-05-admin-security-tab.md) | Admin Security (`account-settings-06`) | Delivered 2026-06-25 | `packages/appshell` · `apps/erp` |
| 6 | [slice-06-admin-members-tab.md](./slice-06-admin-members-tab.md) | Admin Members (`account-settings-05`) | Delivered 2026-06-25 | `packages/appshell` · `apps/erp` |
| 7 | [slice-07-integration-attestation.md](./slice-07-integration-attestation.md) | Integration tests + extension attestation | Delivered 2026-06-25 | `packages/auth` |
| 8 | [slice-08-workspace-auth-context.md](./slice-08-workspace-auth-context.md) | Workspace auth context (contract) | Delivered 2026-06-25 | `packages/auth` |
| 8a | [slice-08a-workspace-session-persistence.md](./slice-08a-workspace-session-persistence.md) | FR-A05.2.1 session column persistence | Delivered 2026-06-25 | `packages/database` · `packages/auth` |
| 8b | [slice-08b-erp-operating-context-wiring.md](./slice-08b-erp-operating-context-wiring.md) | FR-A05.2 ERP `resolveOperatingContext` | Delivered 2026-06-25 | `apps/erp` · `packages/auth` |
| 9 | [slice-09-evidence-sync.md](./slice-09-evidence-sync.md) | Evidence-sync + matrix closeout | Delivered 2026-06-25 | docs only |
| **10** | [slice-10-waiver-review-promotion.md](./slice-10-waiver-review-promotion.md) | Waiver review + promotion assessment | **Delivered** 2026-06-25 | docs only |
| **11** | [slice-11-member-invitations-persistence.md](./slice-11-member-invitations-persistence.md) | Close AUTH-INV-001 — durable invitations | **Delivered** 2026-06-25 | `packages/database` · `packages/auth` |
| **12** | [slice-12-mfa-user-enroll-ui.md](./slice-12-mfa-user-enroll-ui.md) | Close AUTH-MFA-UI-001 — user MFA enroll UI | **Delivered** 2026-06-25 | `packages/appshell` · `apps/erp` |
| **13** | [slice-13-phase3-amendment-draft.md](./slice-13-phase3-amendment-draft.md) | Phase 3 amendment (AUTH-PHASE3-001) | **Accepted** 2026-06-25 | docs only |
| **13a** | [slice-13a-sso-idp-config.md](./slice-13a-sso-idp-config.md) | SSO IdP config + SAML/OIDC wiring | **Delivered** | `packages/database` · `packages/auth` · `apps/erp` |
| **13b** | [slice-13b-passkey-enroll-ui.md](./slice-13b-passkey-enroll-ui.md) | Passkey enroll/authenticate UI | **Delivered** 2026-06-25 | `packages/auth` · `packages/appshell` · `apps/erp` |
| **13a-debt** | [slice-13a-debt-tenant-sso-hardening.md](./slice-13a-debt-tenant-sso-hardening.md) | SSO tenant boundary hardening | **Delivered** 2026-06-25 | `packages/database` · `packages/auth` · `apps/erp` |
| **13c** | [slice-13c-social-oauth-allowlist.md](./slice-13c-social-oauth-allowlist.md) | Social OAuth allowlist + admin UI | **Delivered** 2026-06-25 | `packages/auth` · `apps/erp` |
| **13d** | [slice-13d-phase3-evidence-sync.md](./slice-13d-phase3-evidence-sync.md) | Phase 3 evidence-sync + waiver close | **Delivered** 2026-06-26 | docs only |
| **14** | [slice-14-change-email-enabled.md](./slice-14-change-email-enabled.md) | `changeEmail` enabled + profile UI wire | **Delivered** 2026-06-25 | `packages/auth` · `apps/erp` |
| **15** | [slice-15-saml-admin-ui.md](./slice-15-saml-admin-ui.md) | SAML admin UI + upsert (FR-A06.1) | **Delivered** 2026-06-26 | `packages/database` · `packages/auth` · `apps/erp` |
| **16** | [slice-16-dod15-rbac-attestation.md](./slice-16-dod15-rbac-attestation.md) | DoD #15 RBAC attestation + invitation.sent | **Delivered** 2026-06-26 | `packages/auth` · `scripts/governance` · `apps/erp` |
| **17** | [slice-17-arch-promotion-evidence-sync.md](./slice-17-arch-promotion-evidence-sync.md) | §16 promotion evidence-sync | **Delivered** 2026-06-26 | docs only |
| **18** | [slice-18-idp-secret-rotation-ux.md](./slice-18-idp-secret-rotation-ux.md) | IdP secret rotation UX | **Delivered** 2026-06-26 | `packages/database` · `apps/erp` |
| **19** | [slice-19-sign-in-provider-polish.md](./slice-19-sign-in-provider-polish.md) | Sign-in OAuth / passkey / SSO polish | **Delivered** 2026-06-26 | `packages/auth` · `apps/erp` |
| **20** | [slice-20-deactivate-session-revoke.md](./slice-20-deactivate-session-revoke.md) | FR-A01.4 deactivate → revoke sessions | **Delivered** 2026-06-26 | `packages/auth` · `packages/database` |
| **21** | [slice-21-workspace-mfa-override.md](./slice-21-workspace-mfa-override.md) | FR-A05.3 workspace MFA override | **Delivered** 2026-06-26 | `packages/database` · `packages/auth` |

## Orchestration sequence

```text
Phase A — Slices 1–21 ✓ (2026-06-26)
ARCH-AUTH-001 — Complete — enterprise 9.5 accepted
Backlog closed: Slices 18–21 (IdP rotation · sign-in polish · FR-A01.4 · FR-A05.3)
Follow-up (non-blocking): company MFA override admin UI
```

**Waiver:** ~~AUTH-PHASE3-001~~ — **Closed** Slice 13d (2026-06-26). Amendment **Accepted** 2026-06-25: [`slice-13-phase3-amendment-draft.md`](./slice-13-phase3-amendment-draft.md).
