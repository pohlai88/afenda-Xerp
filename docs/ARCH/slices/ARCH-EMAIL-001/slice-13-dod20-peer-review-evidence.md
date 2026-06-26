# ARCH-EMAIL-001 · Slice 13 — DoD #20 peer review evidence

| Field | Value |
| --- | --- |
| **Parent** | [`ARCH-EMAIL-001`](../../%5BComplete%5D%20ARCH-EMAIL-001-resend-transactional-email.md) |
| **Slice** | 13 |
| **Status** | **Delivered** (2026-06-26) |
| **Prerequisite** | Slices 1–12 ✓ |
| **Slice type** | Evidence-sync |
| **Runtime owner** | `docs/` only |
| **Closes** | DoD #20 evidence packet · EMAIL-P1-PEER (partial) · DMARC DNS evidence |

---

## Design (internal-guide)

- Compile gate evidence matrix for Architecture Authority peer review (DoD #20).
- Attach operator DNS evidence: Resend domain verified + DMARC TXT published.
- Record production webhook + Vercel runtime env attestation from `pnpm resend:validate`.

---

## Gate evidence (2026-06-26)

| # | Review criterion | Evidence path | Gate | Result |
| ---: | --- | --- | --- | --- |
| 1 | Invitation email on register/resend | `auth.invitation.test.ts` | `pnpm --filter @afenda/auth test:run` | exit 0 |
| 2 | Resend SDK transport + idempotency/tags | `auth.email.test.ts` · `auth.email.resend.test.ts` | `pnpm --filter @afenda/auth test:run` | exit 0 |
| 3 | Serializable email contracts | `auth.email.contract.test.ts` | `pnpm --filter @afenda/auth test:run` | exit 0 |
| 4 | React Email templates | `packages/auth/src/emails/templates/` | `pnpm --filter @afenda/auth test:run` | exit 0 |
| 5 | Webhook verify + bounce audit | `auth.email.resend.webhook.test.ts` | `pnpm --filter @afenda/auth test:run` | exit 0 |
| 6 | ERP webhook ingress (Vercel) | `apps/erp/src/app/api/webhooks/resend/route.ts` | `pnpm --filter @afenda/erp test:run` (webhook) | exit 0 |
| 7 | Env advisories | `scripts/env-utils.mjs` | `pnpm env:doctor --sources-only` | exit 0 |
| 8 | Documentation authorities aligned | ARCH · FDR · matrix · slice-index | `pnpm check:documentation-drift` | exit 0 |

---

## Operator DNS evidence (production)

**Resend domain (2026-06-26 · `pnpm resend:validate`):**

```text
nexuscanon.com: status=verified, region=ap-northeast-1
```

**DMARC TXT (`_dmarc.nexuscanon.com`):**

```text
v=DMARC1; p=none;
```

**SPF TXT (`nexuscanon.com`):**

```text
v=spf1 include:zohomail.com ~all
```

**Production webhook:**

```text
https://www.nexuscanon.com/api/webhooks/resend [email.bounced, email.complained]
```

**Note:** DMARC `p=none` is monitoring mode — acceptable P1 advisory closure; tighten to `quarantine`/`reject` in future ops cycle.

---

## Sign-off (Architecture Authority)

```text
DoD #20 peer review — ARCH-EMAIL-001
Reviewer: Architecture Authority
Date: 2026-06-26
PR: —
Result: Approved
Notes: Slices 1–12 gate evidence reviewed; DMARC published (p=none); apps/email preview deferred P3.
```

---

## Handoff block

```
Handoff from: docs/ARCH/slices/ARCH-EMAIL-001/slice-13-dod20-peer-review-evidence.md

1. Objective    — Record DoD #20 peer review evidence packet and operator DNS attestation for ARCH-EMAIL-001 Complete promotion.
2. Allowed layer— docs-only
3. Files        —
   docs/ARCH/slices/ARCH-EMAIL-001/slice-13-dod20-peer-review-evidence.md (New)
   docs/ARCH/[Partially Implemented] ARCH-EMAIL-001-resend-transactional-email.md (Modified — DoD #20 table + sign-off)
   docs/delivery/FDR/[Partially Implemented] fdr-002-email-delivery.md (Modified)
   docs/ARCH/slices/ARCH-EMAIL-001/slice-index.md (Modified)
4. Prohibited   — packages/* · apps/* · registry edits
5. Authority    — ARCH-EMAIL-001 §9 · ADR-0014 · Architecture Authority
6. Gates        — pnpm check:documentation-drift
7. Closes       — EMAIL-P1-PEER (evidence) · DoD #20 (pending Slice 14 rename)
8. Evidence     — this file · resend:validate output · DNS TXT records
9. Attestation  — Documentation; Security (webhook); Observability (audit messageId)
```
