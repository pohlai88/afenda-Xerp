# ARCH-EMAIL-001 · Slice index

| Slice | Title | Priority | Status |
| ---: | --- | --- | --- |
| 1 | Author ARCH-EMAIL-001 + arch-status-index | Doc | **Delivered** (2026-06-26) |
| 2 | Invitation email delivery (register + resend) | P0 | **Delivered** (2026-06-26) |
| 3 | Env source + `.env.example` + matrix | P0 | **Delivered** (2026-06-26) |
| 4 | Idempotency + Resend tags on send | P1 | **Delivered** (2026-06-26) |
| 5 | env-doctor Resend advisories | P1 | **Delivered** (2026-06-26) |
| 6 | Webhook route bounce/complaint | P1 | **Delivered** (2026-06-26) |
| 7 | Audit `messageId` on invitation sends | P1 | **Delivered** (2026-06-26) |
| 8 | FDR evidence sync + promotion readiness | P1 | **Delivered** (2026-06-26) |
| 9 | Webhook ops tooling + verify/reset idempotency/tags | P1 | **Delivered** (2026-06-26) |
| 10 | Resend SDK + email contract normalization | P1 | **Delivered** (2026-06-26) |
| 11 | React Email templates (invite / verify / reset) | P2 | **Delivered** (2026-06-26) |
| 12 | Email contract consolidation + render DRY | P1 | **Delivered** (2026-06-26) |
| 13 | DoD #20 peer review evidence | P1 | **Delivered** (2026-06-26) |
| 14 | Complete promotion (DoD #20 closed) | P1 | **Delivered** (2026-06-26) |
| 15 | `apps/email` React Email preview (port 3003) | P3 | **Delivered** (2026-06-26) |

**Status:** **Complete — enterprise 9.5 accepted** (29/30 · 2026-06-26)

**Post-Complete:** `@afenda/notifications` (P2 separate FDR) · DMARC `p=none` → `quarantine` (ops)

**Ops (Vercel):** `pnpm resend:validate` · `pnpm resend:webhook:cleanup -- --origin https://www.nexuscanon.com` if duplicate webhooks.
