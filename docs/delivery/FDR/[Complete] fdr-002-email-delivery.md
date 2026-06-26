# FDR-002-email-delivery — Resend transactional email (PKG-002)

| Field | Value |
| --- | --- |
| **FDR ID** | fdr-002-email-delivery |
| **Package** | PKG-002 · `@afenda/auth` |
| **Registry** | PKG002_AUTH |
| **ARCH** | [ARCH-EMAIL-001](../../ARCH/[Complete]%20ARCH-EMAIL-001-resend-transactional-email.md) |
| **Status** | **Complete — enterprise 9.5 accepted** (29/30; DoD #20 closed 2026-06-26) |
| **Lane** | amber-lane |
| **Clean Core** | B |
| **Enterprise readiness** | **29/30 — enterprise 9.5 accepted** (DoD #20 peer review closed 2026-06-26) |

## Scope

Server-only Resend transport for auth verification, password reset, and member invitation emails. Paired with [fdr-002-auth-disposition](%5BComplete%5D%20fdr-002-auth-disposition.md) (identity); does not replace Better Auth.

## Runtime evidence

| Capability | Path | Gate |
| --- | --- | --- |
| Serializable email contracts | `packages/auth/src/auth.email.contract.ts` | `auth.email.contract.test.ts` |
| Resend SDK adapter seam | `packages/auth/src/auth.email.resend.ts` | `auth.email.resend.test.ts` |
| React Email templates | `packages/auth/src/emails/templates/` | `@afenda/auth` test:run |
| Message builders + delivery gate | `packages/auth/src/auth.email.ts` | `@afenda/auth` test:run |
| Invitation email on register/resend | `packages/auth/src/auth.invitation.ts` | `auth.invitation.test.ts` |
| Webhook ingress | `apps/erp/src/app/api/webhooks/resend/route.ts` | ERP test:run |
| Email preview (dev) | `apps/email/` | `pnpm --filter @afenda/email typecheck` |
| Env advisories | `scripts/env-utils.mjs` `findResendEmailAdvisories` | governance vitest |
| Production DNS | Resend `nexuscanon.com` verified · DMARC TXT | `pnpm resend:validate` · Slice 13 |

## Remaining gaps

| ID | Gap | Bucket |
| --- | --- | --- |
| EMAIL-P2-NOTIFICATIONS | User/tenant notification prefs → email dispatch | P2 — separate FDR |

## Gates

```bash
pnpm --filter @afenda/auth typecheck
pnpm --filter @afenda/auth test:run
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp test:run
pnpm env:doctor --sources-only
pnpm check:documentation-drift
pnpm check:foundation-disposition
```

## Verdict

**Complete — enterprise 9.5 accepted at 29/30 (2026-06-26).** Slices 1–15 delivered; DoD #20 closed; DMARC evidence attached; `apps/email` preview on port 3003. Post-Complete: tenant notifications (separate FDR) · DMARC policy hardening (ops).
