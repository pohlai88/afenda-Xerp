# Delivery TIP Status Index

| Field | Value |
| --- | --- |
| **As-of** | 2026-06-23 |
| **Authority** | ADR-0012, ADR-0013 |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Delivery sequence** | [`pre-accounting-foundation-roadmap.md`](../architecture/pre-accounting-foundation-roadmap.md) |
| **TIP location** | [`tips/`](tips/) — filenames prefixed with `[status]` for targeting |
| **Enforcement** | `pnpm check:documentation-drift` |

> **AI agents:** Read this index before any individual TIP delivery doc under [`tips/`](tips/).  
> If a delivery doc status conflicts with this index or the runtime matrix, **runtime matrix wins**.  
> **Filename prefix** mirrors status here — when status changes, rename the file prefix in the same PR.  
> **Layout rule:** TIP delivery docs live **only** under `tips/[status] tip-*.md`. Unprefixed `docs/delivery/tip-*.md` (except this index) is legacy — drift guard fails CI.

---

## Implementation authority rule

A TIP may be implemented **only when all five** are true:

1. It exists as a standalone file under `docs/delivery/tips/[status] tip-*.md` (not a draft inside a proposal doc).
2. It has a **§Handoff to implementation** section with a paste-ready slice block.
3. It appears in **§Canonical delivery TIPs** below — not under §Proposed foundation slices.
4. [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) references it.
5. `/afenda-coding-session` Phase 0 receives **exactly one** handoff block from that doc.

**Do not paste handoffs from** [`foundation-phase-delivery-tip-proposal.md`](../architecture/foundation-phase-delivery-tip-proposal.md) — that file is not implementation authority.

---

## Implementation workflow (write-tip → handoff → coding session)

```text
1. Read this index + afenda-runtime-truth-matrix.md
2. Open target docs/delivery/tips/[status] tip-*.md (canonical section only)
3. Confirm status: Partially Implemented or Not started (not Blocked without escalation)
4. Copy ONE §Handoff slice block
5. Paste into /afenda-coding-session Phase 0
6. Implement ONE slice per session (database → platform → app)
7. Post §11 Completion Report — closes TIP DoD rows
8. Update delivery doc + rename [status] prefix + this index + runtime matrix (same PR)
9. pnpm check:documentation-drift
```

**Current runtime priority:** TIP-010A / TIP-007A (after spine proof) — see [Runtime implementation sequence](#runtime-implementation-sequence). TIP-011 **Complete**; TIP-012 Slices 1–2 delivered.

---

## Runtime implementation sequence

> **Order by dependency, not TIP number.** TIP-013 is accepted as canonical documentation but **not** the next runtime slice.  
> Foundation phase order (Phase 5 → 7 → 8) applies **after** execution spine + operating spine proof.

| Step | Slice | Package / layer | Depends on | Document |
| ---: | --- | --- | --- | --- |
| **→ 1** | **Outbox schema** | `@afenda/database` | — | [TIP-011 §Slice 1](tips/%5BComplete%5D%20tip-011-execution-foundation.md#slice-1--outbox-schema-afendadatabase) — **delivered** |
| **→ 2** | **Outbox publish worker** | `@afenda/execution` | Step 1 | [TIP-011 §Slice 2](tips/%5BComplete%5D%20tip-011-execution-foundation.md#slice-2--outbox-publish-worker-afendaexecution) — **delivered** |
| **→ 3** | **ERP outbox integration proof** | `@afenda/erp` | Steps 1–2 | [TIP-011 §Slice 3](tips/%5BComplete%5D%20tip-011-execution-foundation.md#slice-3--erp-integration-test-afendaerp) — **delivered** |
| **→ 4** | Spine contract + helper | `@afenda/erp` | Steps 1–3 | [TIP-012 §Slice 1](tips/%5BPartially%20Implemented%5D%20tip-012-erp-operating-spine.md#slice-1--spine-contract--helper-afendaerp) — **delivered** |
| **→ 5** | Handler integration + lifecycle test | `@afenda/erp` | Steps 1–4 | [TIP-012 §Slice 2](tips/%5BPartially%20Implemented%5D%20tip-012-erp-operating-spine.md#slice-2--handler-integration--lifecycle-test-afendaerp) — **delivered** |
| **→ 6** | API contract governance closeout | `@afenda/erp` (Phase 5) | Step 5 recommended | [TIP-010A](tips/%5BNot%20started%5D%20tip-010a-api-contract-governance.md) |
| 7 | Feature manifest pipeline | `@afenda/entitlements`, `@afenda/appshell` (Phase 7) | Step 5 recommended | [TIP-007A](tips/%5BNot%20started%5D%20tip-007a-feature-manifest-governance.md) |
| 8 | System Admin control plane | `@afenda/erp` (Phase 8) | Steps 5–7 partial | [TIP-013](tips/%5BNot%20started%5D%20tip-013-system-admin-control-plane.md) |

**One slice per coding session.** After each slice: §11 Completion Report → update delivery doc → this index → runtime matrix → rename `[status]` prefix if status changed.

### Do not start yet (runtime)

| Target | Reason |
| --- | --- |
| **TIP-013 System Admin** | Needs audit spine, RBAC, API contracts (TIP-010A), operating context — admin without spine creates drift |
| **TIP-010A / TIP-007A** | Doc authority accepted; runtime waits until Steps 1–5 prove event publication + spine lifecycle |
| **TIP-014+ Accounting** | ADR-0010 — Phase 9 gate not passed |
| **TIP-UI-06** | Blocked on ADR-0008 |

### Parallel work (non-spine)

These may continue **without blocking** Steps 1–5, but must not pull spine-critical packages off the sequence above:

- TIP-006 / TIP-UI-03 AppShell authority gaps
- TIP-007/012 multi-tenancy route coverage
- TIP-008A consolidation resolver
- TIP-010 RBAC wiring for remaining routes

---

## Status vocabulary

Closed set per ADR-0012 / write-tip §2 Step 4. **Do not use runtime matrix vocabulary here.**

| Status | Meaning |
| --- | --- |
| **Not started** | No runtime evidence exists |
| **Partially Implemented** | Runtime evidence exists; gaps remain |
| **Complete (authority only)** | Contracts/governance exist; no runtime implementation expected by design |
| **Complete** | Runtime evidence + all acceptance gates pass |
| **Blocked** | Upstream ADR/TIP/contract missing |
| **Superseded** | Replaced by newer ADR/TIP/roadmap — evidence retained |
| **Obsolete** | Must not guide future coding |

---

## Canonical delivery TIPs

Approved for implementation when handoff + status rules above are satisfied.  
All paths relative to `docs/delivery/`.

### Phase 0 — Documentation truth reset

| TIP | Document | Status | Evidence |
| --- | --- | --- | --- |
| TIP-000A | [`afenda-documentation-drift-audit.md`](../architecture/afenda-documentation-drift-audit.md) | Complete | Audit published |
| TIP-000B | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) | Complete | Matrix published |
| TIP-000C | [`_afenda-erp-master-plan.llms.md`](../architecture/_afenda-erp-master-plan.llms.md) v5 | Complete | v5 + stale warnings |
| TIP-000D | This index + delivery sync | Complete | ADR-0009–0013 Accepted; drift guard |

### Platform authority (TIP-001–012 + accepted slices)

| TIP | Document | Status | Evidence | Remaining gap |
| --- | --- | --- | --- | --- |
| TIP-001 | [tips/[Complete] tip-001-architecture-authority.md](tips/%5BComplete%5D%20tip-001-architecture-authority.md) | Complete | CI architecture gates | — |
| TIP-003 | [tips/[Complete (authority only)] tip-003-design-system-authority.md](tips/%5BComplete%20(authority%20only)%5D%20tip-003-design-system-authority.md) | Complete (authority only) | Contracts, token registry | No runtime UI (by design) |
| TIP-004 | [tips/[Complete (authority only)] tip-004-design-system-contracts.md](tips/%5BComplete%20(authority%20only)%5D%20tip-004-design-system-contracts.md) | Complete (authority only) | Contracts + tests | — |
| TIP-004 | [tips/[Complete] tip-004-ui-consumption.md](tips/%5BComplete%5D%20tip-004-ui-consumption.md) | Complete | ui-guard Gates D/F | Policy: governance/tip-004-policy |
| TIP-004A | [tips/[Complete] tip-004a-token-authority.md](tips/%5BComplete%5D%20tip-004a-token-authority.md) | Complete | Token registry, `--afenda-*` CSS vars | — |
| TIP-004B | [tips/[Complete] tip-004b-primitive-adapter.md](tips/%5BComplete%5D%20tip-004b-primitive-adapter.md) | Complete | `resolvePrimitiveGovernance()` | — |
| TIP-005 | [tips/[Complete (authority only)] tip-005-metadata-authority.md](tips/%5BComplete%20(authority%20only)%5D%20tip-005-metadata-authority.md) | Complete (authority only) | `@afenda/metadata` | — |
| TIP-006 | [tips/[Partially Implemented] tip-006-appshell-authority.md](tips/%5BPartially%20Implemented%5D%20tip-006-appshell-authority.md) | Partially Implemented | 92+ `.tsx`, `afenda-appshell.css` | Authority contracts missing |
| TIP-007 | [tips/[Partially Implemented] tip-007-erp-platform-authority.md](tips/%5BPartially%20Implemented%5D%20tip-007-erp-platform-authority.md) | Partially Implemented | Schemas, kernel contexts | Platform authority map |
| TIP-007A | [tips/[Not started] tip-007a-feature-manifest-governance.md](tips/%5BNot%20started%5D%20tip-007a-feature-manifest-governance.md) | Not started | `feature-manifest.ts` contract only | Manifest → nav → route pipeline |
| TIP-007/012 | [tips/[Partially Implemented] tip-007-012-enterprise-group-operating-context.md](tips/%5BPartially%20Implemented%5D%20tip-007-012-enterprise-group-operating-context.md) | Partially Implemented | Multi-tenancy slice + gates | Full route coverage |
| TIP-008A | [tips/[Partially Implemented] tip-008-master-data-authority.md](tips/%5BPartially%20Implemented%5D%20tip-008-master-data-authority.md) §008A | Partially Implemented | Entity group + ownership schemas | Consolidation resolver |
| TIP-008B | [tips/[Partially Implemented] tip-008-master-data-authority.md](tips/%5BPartially%20Implemented%5D%20tip-008-master-data-authority.md) §008B | Not started | — | Business master data map |
| TIP-009 | [tips/[Complete] tip-009-ci-cd-preview.md](tips/%5BComplete%5D%20tip-009-ci-cd-preview.md) | Complete | Turborepo, `pnpm quality` | — |
| TIP-010 | [tips/[Partially Implemented] tip-010-api-rbac-wiring.md](tips/%5BPartially%20Implemented%5D%20tip-010-api-rbac-wiring.md) | Partially Implemented | `authorizeApiRoute`, workspace API | All routes gated |
| TIP-010A | [tips/[Not started] tip-010a-api-contract-governance.md](tips/%5BNot%20started%5D%20tip-010a-api-contract-governance.md) | Not started | Partial registry + envelope | 100% routes, idempotency, pagination |
| TIP-010† | [tips/[Superseded] tip-010-observability-audit.md](tips/%5BSuperseded%5D%20tip-010-observability-audit.md) | Superseded | TIP-011 observability evidence | Misnumbered — do not use as TIP-010 |
| TIP-011 | [tips/[Complete] tip-011-execution-foundation.md](tips/%5BComplete%5D%20tip-011-execution-foundation.md) | Complete | `@afenda/execution`, Trigger.dev prod worker **20260623.1**, outbox schema + publish worker + ERP integration proof | — |
| TIP-011† | [tips/[Superseded] tip-012-execution-foundation.md](tips/%5BSuperseded%5D%20tip-012-execution-foundation.md) | Superseded | Trigger.dev slice evidence | Misnumbered — see TIP-011 |
| TIP-012 | [tips/[Partially Implemented] tip-012-erp-operating-spine.md](tips/%5BPartially%20Implemented%5D%20tip-012-erp-operating-spine.md) | Partially Implemented | Spine helper + lifecycle test + outbox on dashboard PUT; Trigger.dev deploy closed via TIP-011 Slice 4 | Delivery doc sync (verdict + `[Complete]` rename) |
| TIP-013 | [tips/[Not started] tip-013-system-admin-control-plane.md](tips/%5BNot%20started%5D%20tip-013-system-admin-control-plane.md) | Not started | DB user/membership/role schemas only | System Admin routes + UI + API contracts |

† Misnumbered evidence — audit trail only.

### UI implementation (TIP-UI)

| TIP | Document | Status | Evidence | Remaining gap |
| --- | --- | --- | --- | --- |
| TIP-UI-01 | [tips/[Complete] tip-ui-01-css-pipeline.md](tips/%5BComplete%5D%20tip-ui-01-css-pipeline.md) | Complete | `globals.css`, tokens.css | — |
| TIP-UI-02 | [tips/[Complete] tip-ui-02-component-library.md](tips/%5BComplete%5D%20tip-ui-02-component-library.md) | Complete | 58 components, 68+ tests | ADR-0008 batch deferred |
| TIP-UI-03 | [tips/[Partially Implemented] tip-ui-03-appshell-token-migration.md](tips/%5BPartially%20Implemented%5D%20tip-ui-03-appshell-token-migration.md) | Partially Implemented | `afenda-appshell.css` | TIP-006 + ERP shell |
| TIP-UI-04 | [tips/[Partially Implemented] tip-ui-04-metadata-ui-renderers.md](tips/%5BPartially%20Implemented%5D%20tip-ui-04-metadata-ui-renderers.md) | Partially Implemented | Section renderers, tests | ERP production wiring |
| TIP-UI-05 | [tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md) | Partially Implemented | `@afenda/ui` auth, globals.css | Module placeholders |
| TIP-UI-06 | [tips/[Blocked] tip-ui-06-react19-ref-as-prop.md](tips/%5BBlocked%5D%20tip-ui-06-react19-ref-as-prop.md) | Blocked | ADR-0008 Proposed | Package-wide batch not started |

### Blocked — Accounting Core (ADR-0010)

| TIP | Status | Reason |
| --- | --- | --- |
| TIP-014+ | Blocked | Phase 9 Accounting Readiness Gate not passed |
| `@afenda/accounting` | Blocked | PKG-R01 not activated |

> **TIP numbering (2026-06-23):** TIP-013 = Phase 8 System Admin (foundation). Accounting Core begins at **TIP-014+** (supersedes master plan v5 TIP-013 = accounting). ADR amendment tracked separately.

---

## Proposed foundation slices — NOT implementation authority

> **No active proposals.** TIP-010B superseded by canonical [TIP-013](tips/%5BNot%20started%5D%20tip-013-system-admin-control-plane.md).

| Superseded ID | Superseded by | Notes |
| --- | --- | --- |
| TIP-010B | **TIP-013** | Historical draft in [proposal](../architecture/foundation-phase-delivery-tip-proposal.md) only |
| TIP-030-SA | **Rejected** | Conflicts with TIP-030 Project Management |

**Promoted:** TIP-010A, TIP-007A, **TIP-013** — see §Canonical delivery TIPs.

---

## Support delivery docs (non-TIP)

Platform and security evidence lives in [`support/`](support/) — not TIP delivery authority.

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

## Maintenance

Update this index when:

1. A canonical TIP changes status (same PR as implementation or matrix update) — **rename `[status]` file prefix**
2. Runtime matrix is refreshed
3. `pnpm check:documentation-drift` fails
4. Architecture Authority accepts or rejects a proposed slice ID

*Delivery folder restructure — TIPs isolated under `tips/` with `[status]` prefixes — 2026-06-23*
