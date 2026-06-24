# Delivery Evidence (TIP Archive)

Historical TIP completion reports and implementation evidence. **Not implementation authority after 2026-06-24.**

> **AI agents — read first:** [foundation-delivery-authority.md](../architecture/foundation-delivery-authority.md) and [`foundation-disposition.registry.ts`](../packages/architecture-authority/src/data/foundation-disposition.registry.ts).  
> Open this folder for **completed TIP audit trail** only.  
> **Runtime status:** [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) · **FDR enforcement:** `pnpm check:foundation-disposition`

---

## Folder layout

| Path | Contents |
| --- | --- |
| [`fdr-status-index.md`](fdr-status-index.md) | **Active FDR catalog** — upgrade sequence + parallel tracks |
| [`FDR/`](FDR/) | FDR delivery docs — `[Status] fdr-NNN-title.md` |
| [`tip-status-index.md`](tip-status-index.md) | **TIP archive index** — historical only |
| [`tips/`](tips/) | TIP delivery docs — archive-lane |
| [`support/`](support/) | Platform/security evidence (CSP, logging, hardening) — operational docs |

When a **completed** TIP archive entry changes status prefix, rename the file in the same PR as the matrix update. **Do not create new TIP files** for foundation or package work.

---

## Current priority (FDR)

Foundation Phases 0–9 and TIP-014 contracts-only delivery are **Complete**. Next accounting runtime work:

1. Architecture Authority ADR (e.g. COA schema activation)
2. `foundation-registry-owner` updates `PKGR01_ACCOUNTING` in FDR
3. Implement within ADR bounds; update runtime matrix

Full workflow: [foundation-delivery-authority.md](../architecture/foundation-delivery-authority.md)

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
Foundation disposition: `pnpm check:foundation-disposition`
