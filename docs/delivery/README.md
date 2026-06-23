# Delivery Evidence

TIP completion reports and implementation evidence.

> **AI agents — read first:** [`tip-status-index.md`](tip-status-index.md) and [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md).  
> Individual TIP files live in [`tips/`](tips/) with **`[status]` filename prefixes** — use the prefix to pick your target.  
> **Status authority** is the index + runtime matrix (ADR-0012, ADR-0013).

---

## Folder layout

| Path | Contents |
| --- | --- |
| [`tip-status-index.md`](tip-status-index.md) | **Canonical TIP statuses** — read before any TIP doc |
| [`tips/`](tips/) | TIP delivery docs — `[Status] tip-NNN-title.md` |
| [`support/`](support/) | Platform/security evidence (CSP, logging, hardening) — not TIP authority |

When a TIP status changes, rename the file prefix in the same PR as the index update.

---

## Quick target by status

| Status | Open these |
| --- | --- |
| **Not started** | TIP-007A, TIP-010A, TIP-013 |
| **Partially Implemented** | TIP-006, 007, 007/012, 008, 010, 011, 012, TIP-UI-03/04/05 |
| **Complete** | TIP-001, 004-ui, 009, TIP-UI-01/02 |
| **Blocked** | TIP-UI-06, TIP-014+ accounting |
| **Superseded** | Misnumbered `tip-010-observability`, `tip-012-execution-foundation` |

Full table: [`tip-status-index.md`](tip-status-index.md).

---

## Current runtime priority

**Step 1 of §Runtime implementation sequence:** [TIP-011 Slice 1 — Outbox schema](tips/%5BPartially%20Implemented%5D%20tip-011-execution-foundation.md#slice-1--outbox-schema-afendadatabase)

Full dependency order (not TIP number order): [`tip-status-index.md` §Runtime implementation sequence](tip-status-index.md#runtime-implementation-sequence)

---

## Support delivery (non-TIP)

| Topic | Document |
| --- | --- |
| CSP nonce pipeline | [support/nextjs-csp-nonce-pipeline.md](support/nextjs-csp-nonce-pipeline.md) |
| CSP third-party CI | [support/csp-third-party-ci-gate.md](support/csp-third-party-ci-gate.md) |
| CSP SRI hybrid | [support/csp-sri-hybrid-strategy.md](support/csp-sri-hybrid-strategy.md) |
| Supabase CSP origins | [support/csp-supabase-platform-approval.md](support/csp-supabase-platform-approval.md) |
| Next.js App Router hardening | [support/nextjs-app-router-hardening.md](support/nextjs-app-router-hardening.md) |
| Pino ERP logger | [support/pino-erp-logger.md](support/pino-erp-logger.md) |
| ERP → kernel approval | [support/architecture-erp-kernel-approval.md](support/architecture-erp-kernel-approval.md) |
| Radix primitive audit | [support/ui-radix-primitive-normalization.md](support/ui-radix-primitive-normalization.md) |

---

## Related governance

UI guard gates: [`../governance/ui-guard.md`](../governance/ui-guard.md)  
Downstream composition: [`../governance/downstream-ui-composition.md`](../governance/downstream-ui-composition.md)  
Documentation drift guard: `pnpm check:documentation-drift`
