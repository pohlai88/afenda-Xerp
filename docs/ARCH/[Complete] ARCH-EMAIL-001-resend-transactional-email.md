# ARCH-EMAIL-001 — Resend transactional email platform

> **Template:** [`ARCH-TEMPLATE.md`](ARCH-TEMPLATE.md) · **Index:** [`arch-status-index.md`](arch-status-index.md) · **Slices:** [`slices/ARCH-EMAIL-001/slice-index.md`](slices/ARCH-EMAIL-001/slice-index.md)

| Field | Value |
| --- | --- |
| **Document ID** | ARCH-EMAIL-001 |
| **Work ID** | ARCH-EMAIL-001 · paired [`fdr-002-email-delivery`](../delivery/FDR/[Complete]%20fdr-002-email-delivery.md) |
| **Status** | **Complete — enterprise 9.5 accepted** (29/30; DoD #20 closed 2026-06-26) — Slices 1–14 delivered |
| **Date** | 2026-06-26 |
| **Owner** | Platform Authority (`@afenda/auth` + env ops + ERP webhook ingress) |
| **Package** | PKG-002 · `@afenda/auth` · `apps/erp` (webhook route) · `scripts/` |
| **Registry entry ID** | `PKG002_AUTH` |
| **Runtime owner** | `packages/auth/src/auth.email*.ts` |
| **Lane** | amber-lane |
| **Risk class** | High (secrets, deliverability, onboarding) |
| **Change class** | Extension |
| **Clean Core target** | B — Resend is swappable transport; Afenda owns contracts |
| **Enterprise score** | **29/30 — enterprise 9.5 accepted** (DoD #20 peer review closed 2026-06-26) |

> **Scope:** Server-only **transactional** email via Resend for auth verification, password reset, and member invitations.  
> **Not in scope:** Marketing broadcasts, tenant notification prefs dispatch, per-tenant from-domains, inbound email — **P2** (separate ARCH/FDR).  
> **Identity:** [ARCH-AUTH-001](%5BComplete%5D%20ARCH-AUTH-001-enterprise-authentication.md) owns invitation gate and Better Auth hooks; this ARCH owns transport only.

---

# 1. Execution instruction

Slices **1–15 delivered**. Post-Complete backlog: `@afenda/notifications` (P2 FDR) · DMARC tighten (ops).

---

# 2. Target item

**Purpose (one sentence):** Govern Resend as Afenda's server-only transactional email transport with dev-safe no-op, invitation email delivery, production env advisories, webhook bounce/complaint audit, and explicit P2 exclusions.

---

# 3. Authority chain

```text
1. docs/ARCH/arch-status-index.md
2. packages/architecture-authority/src/data/foundation-disposition.registry.ts (PKG002_AUTH)
3. docs/architecture/afenda-runtime-truth-matrix.md
4. docs/delivery/FDR/[Complete] fdr-002-auth-disposition.md
5. docs/ARCH/[Complete] ARCH-AUTH-001-enterprise-authentication.md
6. docs/ARCH/[Complete] ARCH-EMAIL-001-resend-transactional-email.md (this document)
7. packages/auth/src/auth.email.ts · auth.email.resend.ts · auth.invitation.ts
8. Resend docs: https://resend.com/docs/llms.txt
```

| Concern | ARCH-AUTH-001 | ARCH-EMAIL-001 |
| --- | --- | --- |
| Invitation gate / token validation | Owner | Consumer |
| Better Auth plugin config | Owner (by reference) | No |
| Resend transport, env, DNS ops, webhooks | No | Owner |
| Message builders (verify / reset / invite) | Consumer | Owner |

---

# 4. Problem statement

## Current risk / gap

```text
Before ARCH-EMAIL-001: verification/reset emails existed but invitation emails were not sent;
env vars lacked doctor advisories; no bounce/complaint ingress.
After slices 1–14: full P0–P2 transport + React Email templates; SDK adapter seam;
Vercel webhook; production DNS evidence; DoD #20 closed.
```

## Business impact

```text
- P0 closed: admins no longer distribute invite links out-of-band when Resend is configured.
- Security: API key server-only; delivery failures diagnosable via messageId in audit metadata.
- Deliverability: nexuscanon.com verified in Resend; DMARC published (p=none monitoring).
```

---

# 5. Architecture requirement

## 5.1 Ownership

| Concern | Owner | Path |
| --- | --- | --- |
| Serializable email contracts | `@afenda/auth` | `auth.email.contract.ts` |
| Resend HTTP transport | `@afenda/auth` | `auth.email.resend.ts` |
| React Email templates | `@afenda/auth` | `emails/templates/` |
| Env contract | `@afenda/auth` | `auth.env.ts` |
| Message builders | `@afenda/auth` | `auth.email.ts` |
| Invitation email orchestration | `@afenda/auth` | `auth.invitation.ts` |
| Webhook ingress | `apps/erp` | `app/api/webhooks/resend/route.ts` |
| Webhook verify + audit | `@afenda/auth` | `auth.email.resend.webhook.ts` |
| Email template preview (dev) | `apps/email` | `pnpm --filter @afenda/email dev` |
| Env advisories | `scripts/` | `env-utils.mjs` · `env-doctor.mjs` |

## 5.2 Boundary rules

1. All sends via `deliverAuthTransactionalEmail` → `sendAuthEmailViaResend` (official `resend` SDK via `AuthEmailResendClient` adapter).
2. `AFENDA_AUTH_EMAIL_API_KEY` never `NEXT_PUBLIC_*`.
3. Dev no-op when API key unset — invitation persistence still succeeds.
4. Idempotency key `auth/invite/{invitationId}` on invitation sends.
5. ERP never imports Resend SDK — only `@afenda/auth` public exports (`AuthEmailResendClient` for test injection).
6. `RESEND_API_KEY` is developer MCP only; runtime uses `AFENDA_AUTH_EMAIL_*` on Vercel.

## 5.3 Prohibited actions

```text
- Marketing broadcasts / Resend Audiences (P2)
- Tenant notification email dispatch (P2 — separate FDR)
- Per-tenant custom from-domains without separate ARCH/FDR (P2)
- Cloudflare Email Service as production transport in this work item
- Duplicate RESEND_API_KEY env name alongside AFENDA_AUTH_EMAIL_* without ADR
```

## 5.4 Production classification

| Bucket | Capability | Status |
| --- | --- | --- |
| **P0** | Invitation email on register/resend; sign-up URL with `invitationToken`; `.env.example` | Delivered |
| **P1** | Idempotency, tags, env-doctor, webhook, audit messageId, DMARC evidence | Delivered |
| **P2** | React Email templates (`packages/auth/src/emails/`) | Delivered |
| **P3** | `apps/email` preview app (`pnpm --filter @afenda/email dev` · port 3003); Playwright live send | Preview **Delivered** · live send deferred |

---

# 6. Env contract

| Variable | Source | Notes |
| --- | --- | --- |
| `AFENDA_AUTH_EMAIL_API_KEY` | `.env.secret` / Vercel | Resend API key (`re_…`) |
| `AFENDA_AUTH_EMAIL_FROM` | `.env.config` or Vercel | `"Afenda ERP <auth@domain>"` — verified domain |
| `AFENDA_RESEND_WEBHOOK_SECRET` | `.env.secret` / Vercel | Svix `whsec_…` for `/api/webhooks/resend` on **Vercel** (`apps/erp`) |

**Ops runbook (Vercel — not Supabase Edge):**

1. Resend dashboard → verify domain (SPF/DKIM) → DMARC TXT  
2. `pnpm resend:validate`  
3. `pnpm resend:webhook:provision -- --origin https://www.nexuscanon.com` (skip if already registered)  
4. `pnpm resend:webhook:cleanup -- --origin https://www.nexuscanon.com` (if duplicate webhooks)  
5. `pnpm env:sync -- --overlay production` → `pnpm env:console push production --yes`

**Production DNS evidence (2026-06-26):** see [`slice-13-dod20-peer-review-evidence.md`](slices/ARCH-EMAIL-001/slice-13-dod20-peer-review-evidence.md).

**Invitation URL:** `{resolveBetterAuthBaseUrl}/sign-up?invitationToken={token}&email={encodedEmail}`

---

# 7. Enterprise acceptance criteria

```gherkin
Feature: Member invitation email via Resend

  Scenario: Admin registers invitation with email configured
    GIVEN AFENDA_AUTH_EMAIL_API_KEY and AFENDA_AUTH_EMAIL_FROM are set
    WHEN registerAuthInvitation runs
    THEN Resend API receives invite email with sign-up URL containing invitationToken
    AND auth.invitation.sent audit includes messageId when delivery succeeds

  Scenario: Dev without API key
    GIVEN AFENDA_AUTH_EMAIL_API_KEY is unset
    WHEN registerAuthInvitation runs
    THEN invitation persists without throwing

  Scenario: Webhook bounce
    GIVEN AFENDA_RESEND_WEBHOOK_SECRET is configured
    WHEN Resend posts email.bounced with valid Svix signature
    THEN auth.email.delivery_bounced audit is persisted
```

---

# 8. Required gates

```bash
pnpm --filter @afenda/auth typecheck
pnpm --filter @afenda/auth test:run
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm env:doctor --sources-only
pnpm check:documentation-drift
pnpm check:foundation-disposition
```

---

# 9. Definition of Done

| # | Criterion | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Invitation email on register/resend | `auth.invitation.test.ts` | [x] |
| 2 | Resend transport idempotency + tags | `auth.email.test.ts` | [x] |
| 3 | Webhook verify + bounce audit | `auth.email.resend.webhook.test.ts` · ERP route test | [x] |
| 4 | Env advisories | `env-utils-resend-advisory.test.ts` | [x] |
| 5 | `.env.example` documented | `.env.example` | [x] |
| 6 | ARCH + FDR + slice-index | this doc · fdr-002-email-delivery | [x] |
| 7 | Runtime matrix updated | `afenda-runtime-truth-matrix.md` | [x] |
| 8 | React Email templates | `emails/templates/` · `auth.email.contract.test.ts` | [x] |
| 20 | DoD #20 peer review | [`slice-13`](slices/ARCH-EMAIL-001/slice-13-dod20-peer-review-evidence.md) | [x] |

### DoD #20 — Architecture Authority peer review

> **Closed 2026-06-26.** Filename promoted to `[Complete]` in Slice 14.

| # | Review criterion | Evidence path | Gate |
| --- | --- | --- | --- |
| 1 | Invitation + verify + reset delivery | `auth.email.test.ts` · `auth.invitation.test.ts` | `pnpm --filter @afenda/auth test:run` |
| 2 | Serializable contracts + Resend seam | `auth.email.contract.test.ts` · `auth.email.resend.test.ts` | `pnpm --filter @afenda/auth test:run` |
| 3 | React Email templates | `packages/auth/src/emails/templates/` | `pnpm --filter @afenda/auth test:run` |
| 4 | Webhook ingress + audit | ERP `route.test.ts` · `auth.email.resend.webhook.test.ts` | `pnpm --filter @afenda/erp test:run` |
| 5 | Production DNS | Resend domain verified · DMARC TXT | `pnpm resend:validate` · DNS |
| 6 | Documentation sync | ARCH · FDR · matrix · index | `pnpm check:documentation-drift` |

**Sign-off (Architecture Authority):**

```text
DoD #20 peer review — ARCH-EMAIL-001
Reviewer: Architecture Authority
Date: 2026-06-26
PR: —
Result: Approved
Notes: Slices 1–12 reviewed; DMARC p=none published; apps/email preview deferred P3.
```

---

# 10. Promotion rule

**Status (2026-06-26):** Promoted to **Complete — enterprise 9.5 accepted** at **29/30** (Slice 14).

---

# 11. Resolved risks (Slice 12–14)

| Risk | Resolution |
| --- | --- |
| `AuthEmailDeliveryDeps.client` type narrowed | `AuthEmailResendClient` exported from `@afenda/auth`; `auth.email.resend.test.ts` proves structural mock + adapter |
| Extra adapter hop on send | Documented in `auth.email.contract.ts`; single thin boundary — no behavior change |
| Public API rename | None — export names preserved |
| Promotion blocked (DoD #20 + DMARC) | Closed Slice 13–14; DNS evidence attached |

---

# 12. Appendix — OSS resources

| Resource | Use |
| --- | --- |
| [resend/resend-skills@resend](https://skills.sh/resend/resend-skills/resend) | Agent skill — `npx skills add resend/resend-skills@resend -g -y` |
| [Resend API](https://resend.com/docs/api-reference/emails/send-email) | Send + idempotency |
| [Resend webhooks](https://resend.com/docs/webhooks/emails/bounced) | Bounce/complaint payloads |
