# Delivery Evidence

TIP completion reports and implementation evidence.

> **⚠️ AI agents — read first:** [`tip-status-index.md`](tip-status-index.md) and [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md).  
> Individual `tip-*.md` files are evidence artifacts; **status authority** is the index + runtime matrix (ADR-0012, ADR-0013).

---

## Canonical status index

| Document | Purpose |
| --- | --- |
| [`tip-status-index.md`](tip-status-index.md) | **Current TIP statuses** — read before any delivery doc |
| [`pre-accounting-foundation-roadmap.md`](../architecture/pre-accounting-foundation-roadmap.md) | Delivery sequence Phases 0–9 |

---

## Phase 1 — Platform authority (TIP-001–012)

| TIP | Document | Status (index) |
| --- | --- | --- |
| TIP-001 | [tip-001-architecture-authority.md](tip-001-architecture-authority.md) | Implemented |
| TIP-003 | [tip-003-design-system-authority.md](tip-003-design-system-authority.md) | Implemented (authority) |
| TIP-004 | [tip-004-design-system-contracts.md](tip-004-design-system-contracts.md) | Implemented (authority) |
| TIP-004 | [tip-004-ui-consumption.md](tip-004-ui-consumption.md) | Implemented |
| TIP-004B | [tip-004b-primitive-adapter.md](tip-004b-primitive-adapter.md) | Implemented |
| TIP-005 | [tip-005-metadata-authority.md](tip-005-metadata-authority.md) | Implemented (authority) |
| TIP-006 | [tip-006-appshell-authority.md](tip-006-appshell-authority.md) | Partially Implemented |
| TIP-007 | [tip-007-erp-platform-authority.md](tip-007-erp-platform-authority.md) | Partially Implemented |
| TIP-007/012 | [tip-007-012-enterprise-group-operating-context.md](tip-007-012-enterprise-group-operating-context.md) | Partially Implemented |
| TIP-008A/B | [tip-008-master-data-authority.md](tip-008-master-data-authority.md) | 008A Partial / 008B Documented Only |
| TIP-009 | [tip-009-ci-cd-preview.md](tip-009-ci-cd-preview.md) | Implemented |
| TIP-010 | [tip-010-api-rbac-wiring.md](tip-010-api-rbac-wiring.md) | Partially Implemented |
| TIP-011 | [tip-011-execution-foundation.md](tip-011-execution-foundation.md) | Partially Implemented |
| TIP-012 | [tip-012-erp-operating-spine.md](tip-012-erp-operating-spine.md) | Partially Implemented |

### Misnumbered evidence (superseded — do not use as TIP ID authority)

| File | Actual scope |
| --- | --- |
| [tip-010-observability-audit.md](tip-010-observability-audit.md) | TIP-011 observability slice |
| [tip-012-execution-foundation.md](tip-012-execution-foundation.md) | TIP-011 Trigger.dev slice |

---

## Phase 1 — UI implementation track (TIP-UI)

| TIP | Document | Status (index) |
| --- | --- | --- |
| TIP-UI-01 | [tip-ui-01-css-pipeline.md](tip-ui-01-css-pipeline.md) | Implemented |
| TIP-UI-02 | [tip-ui-02-component-library.md](tip-ui-02-component-library.md) | Implemented |
| TIP-UI-03 | [tip-ui-03-appshell-token-migration.md](tip-ui-03-appshell-token-migration.md) | Partially Implemented |
| TIP-UI-04 | [tip-ui-04-metadata-ui-renderers.md](tip-ui-04-metadata-ui-renderers.md) | Partially Implemented |
| TIP-UI-05 | [tip-ui-05-erp-app-surfaces.md](tip-ui-05-erp-app-surfaces.md) | Partially Implemented |
| TIP-UI-06 | [tip-ui-06-react19-ref-as-prop.md](tip-ui-06-react19-ref-as-prop.md) | Blocked |
| — | [ui-radix-primitive-normalization.md](ui-radix-primitive-normalization.md) | Implemented (audit) |

---

## Security & platform delivery

| Topic | Document |
| --- | --- |
| CSP nonce pipeline | [nextjs-csp-nonce-pipeline.md](nextjs-csp-nonce-pipeline.md) |
| CSP third-party CI | [csp-third-party-ci-gate.md](csp-third-party-ci-gate.md) |
| CSP SRI hybrid | [csp-sri-hybrid-strategy.md](csp-sri-hybrid-strategy.md) |
| Supabase CSP origins | [csp-supabase-platform-approval.md](csp-supabase-platform-approval.md) |
| Next.js App Router hardening | [nextjs-app-router-hardening.md](nextjs-app-router-hardening.md) |
| Pino ERP logger | [pino-erp-logger.md](pino-erp-logger.md) |
| ERP → kernel approval | [architecture-erp-kernel-approval.md](architecture-erp-kernel-approval.md) |

---

## Related governance docs

UI guard gates: [`../governance/ui-guard.md`](../governance/ui-guard.md)  
Downstream composition: [`../governance/downstream-ui-composition.md`](../governance/downstream-ui-composition.md)  
Documentation drift guard: `pnpm check:documentation-drift`
