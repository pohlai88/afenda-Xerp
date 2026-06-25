# ARCH-AUTH-001 · Slice 13 — Phase 3 amendment draft (AUTH-PHASE3-001)

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-AUTH-001`](../../%5BPartially%20Implemented%5D%20ARCH-AUTH-001-enterprise-authentication.md) |
| **Slice** | 13 (amendment — **accepted 2026-06-25**) |
| **Status** | **Accepted** — implementation slices 13a–13d authorized |
| **Type** | Architecture amendment + future implementation slices |
| **Closes waiver** | AUTH-PHASE3-001 (when all Phase 3 slices delivered) |
| **Risk** | High · **Clean Core:** B (replaceable auth engine preserved) |

---

## Purpose

ARCH-AUTH-001 §5.3 explicitly excludes Phase 3 capabilities from v1 scope. This document is the **amendment proposal** to extend ARCH-AUTH-001 with enterprise SSO, passkeys/WebAuthn, and social OAuth — without breaking v1 contracts (`AfendaAuthSession`, mirror sync, invitation gate, MFA policy).

**Do not implement code from this draft until:**

1. Architecture Authority accepts this amendment (sign-off block below).
2. Parent ARCH §5.3 / §13 updated to reference accepted Phase 3 scope.
3. Individual implementation slices (13a–13c) are authored via `write-fdr-slice` / ARCH Appendix A.

---

## Amendment scope

| Capability | Better Auth surface | Afenda ownership |
| --- | --- | --- |
| Enterprise SSO (SAML 2.0 / OIDC) | `sso()` plugin + IdP metadata | Tenant-scoped IdP config in `@afenda/database`; audit via `AUTH_EVENT` |
| Passkeys / WebAuthn | `passkey()` plugin | User self-service enroll on `/settings/security` (ARCH-USER-001) + admin policy |
| Social OAuth (Google, Microsoft, etc.) | `socialProviders` + OAuth callbacks | Allowlist in tenant settings; CSP third-party origins |

**Out of amendment (unchanged):** Accounting identity, RBAC in session, local permission constants, `@afenda/accounting`.

---

## Proposed implementation sequence (post-acceptance)

```text
Slice 13a — SSO IdP config + SAML/OIDC callback wiring (packages/auth · apps/erp)
Slice 13b — Passkey enroll/authenticate UI (packages/auth/client · apps/erp/settings)
Slice 13c — Social OAuth provider allowlist + tenant admin UI (system-admin integrations tab)
Slice 13d — Evidence-sync: close AUTH-PHASE3-001 · ARCH Complete promotion assessment
```

Each slice gets its own handoff file under `docs/ARCH/slices/ARCH-AUTH-001/` before `afenda-governed-implementer` execution.

---

## Design constraints (non-negotiable)

- **Golden rule preserved:** `users.id` remains canonical actor; Better Auth remains mirror only.
- **Session contract:** No tenant/role fields on `AfendaAuthSession`; operating context unchanged.
- **Invitation gate:** SSO/OAuth sign-up must still respect invitation policy unless explicit waiver per tenant.
- **CSP:** New OAuth/SSO origins → `csp-allowlist.ts` + nonce pipeline (ADR + csp-third-party skill).
- **Audit:** All Phase 3 lifecycle events register in `AUTH_EVENT` before UI ships.
- **TIP-004:** Zero `className` on `@afenda/ui` in ERP/appshell consumers.

---

## Handoff block (Slice 13a — executable)

**Authoritative handoff:** [`slice-13a-sso-idp-config.md`](./slice-13a-sso-idp-config.md) (9-field block — copy from that file per coding session).

---

## Waiver closure path

| Waiver | Current state | Closes when |
| --- | --- | --- |
| AUTH-PHASE3-001 | Open — explicit §5.3 exclusion | Slices 13a–13c delivered + 13d evidence-sync |

Until closure, ARCH-AUTH-001 filename remains **`[Partially Implemented]`** even if v1 slices 1–12 are complete.

---

## Amendment acceptance (Architecture Authority)

```text
Phase 3 amendment — ARCH-AUTH-001
Reviewer: Architecture Authority (user-authorized proceed)
Date: 2026-06-25
Decision: Accepted with conditions
Conditions: Implementation sequence 13a → 13b → 13c → 13d; ARCH filename stays [Partially Implemented] until 13d; one slice per session via 9-field handoff
Notes: Slice 13a handoff authored; SSO leg first; passkeys and OAuth deferred to 13b/13c
```

**Acceptance status:** **ACCEPTED** (2026-06-25) — Slice **13a** implementation authorized; 13b–13d remain Not started until prior slice delivered.

---

## Parent ARCH edits required on acceptance

1. §5.3 — move SSO/passkey/OAuth from prohibited to phased in-scope.
2. §13 — mark AUTH-PHASE3-001 as **In progress** with slice 13a–13d plan.
3. Add FR-A06.x requirement rows (SSO, passkey, OAuth) with acceptance criteria.
4. Update mermaid diagram — remove "in-memory debt" invitation note (already closed Slice 11).
5. `slice-index.md` — add rows 13a–13d with **Not started** status.

---

## Known debt (v1 — unchanged)

- Profile `changeEmail` — ARCH-AUTH-001 v2 gap; blocks ARCH-USER-001 email UI only.
- TOTP QR rendering — optional polish; not Phase 3.
