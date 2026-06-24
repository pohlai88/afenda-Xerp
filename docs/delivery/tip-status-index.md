# Delivery TIP Archive Index

> **FDR is implementation authority (ADR-0014).** New foundation and package work uses the [Foundation Disposition Registry](../architecture/foundation-disposition.md) and [foundation-delivery-authority.md](../architecture/foundation-delivery-authority.md) — **not** new TIP docs.
>
> This index is an **archive** of delivered TIPs. Read it for audit trail and historical handoffs only.

| Field | Value |
| --- | --- |
| **As-of** | 2026-06-24 |
| **Implementation authority** | [FDR](../architecture/foundation-delivery-authority.md) (ADR-0014) |
| **Archive authority** | ADR-0012 (evidence vocabulary for completed TIPs) |
| **Status source (runtime)** | [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) |
| **Phase narrative (complete)** | [`pre-accounting-foundation-roadmap.md`](../architecture/pre-accounting-foundation-roadmap.md) |
| **TIP location** | [`tips/`](tips/) — filenames prefixed with `[status]` for historical targeting |
| **Enforcement** | `pnpm check:documentation-drift` · `pnpm check:foundation-disposition`

> **AI agents:** Read [foundation-delivery-authority.md](../architecture/foundation-delivery-authority.md) before any foundation or package work.  
> Open this index only when retrieving **completed TIP evidence** or verifying archive status.  
> If a TIP delivery doc conflicts with FDR or the runtime matrix, **FDR + matrix win**.

---

## Implementation authority rule (superseded — archive only)

> **Stopped 2026-06-24 (ADR-0014).** The five-rule TIP implementation gate below applied during Phases 0–9. Foundation delivery is now FDR-governed. Retained for audit context only.

A TIP may be referenced for **historical evidence** when all five were true at delivery time:

1. Standalone file under `docs/delivery/tips/[status] tip-*.md`
2. §Handoff to implementation with slice block
3. Listed in §Canonical delivery TIPs below
4. Referenced in runtime matrix
5. `/afenda-coding-session` Phase 0 used the handoff block

**New work:** use [FDR workflow](../architecture/foundation-delivery-authority.md) — do not author new TIP delivery docs for foundation packages.

**Do not paste handoffs from** [`foundation-phase-delivery-tip-proposal.md`](../architecture/foundation-phase-delivery-tip-proposal.md) — obsolete proposal.

---

## FDR implementation workflow (active)

```text
1. Read foundation-delivery-authority.md + foundation-disposition.registry.ts
2. Read afenda-runtime-truth-matrix.md for the target package/domain
3. Read package-registry.md for PKG-* identity
4. Read governing ADR(s) on the FDR entry
5. State afenda-coding-session §0 from FDR fields (lane, prohibited, gates, runtimeOwner)
6. Implement one bounded change; respect allowedAgents
7. Post §11 Completion Report; update runtime matrix
8. Registry lane/gap changes → foundation-registry-owner + sync foundation-disposition.md
9. pnpm check:foundation-disposition && pnpm check:documentation-drift
```

**Current priority:** Phases 0–9 and TIP-014 **Complete**. Next accounting runtime (COA/posting) = **ADR + FDR update** for `PKGR01_ACCOUNTING` — not TIP-015 markdown.

---

## Historical TIP workflow (archive — Phases 0–9)

```text
1. Read this index + afenda-runtime-truth-matrix.md
2. Open target docs/delivery/tips/[status] tip-*.md (canonical section only)
3. Confirm status: Partially Implemented or Not started — use [§Partially implemented TIP sequence](#partially-implemented-tip-sequence) for order
4. Copy ONE §Handoff slice block
5. Paste into /afenda-coding-session Phase 0
6. Implement ONE slice per session (database → platform → app)
7. Post §11 Completion Report — closes TIP DoD rows
8. Update delivery doc + rename [status] prefix + this index + runtime matrix (same PR)
9. pnpm check:documentation-drift
```

**Current runtime priority:** Foundation Phases 0–9 **Complete**. TIP-014 **Complete (authority only)**. **Next:** FDR-governed accounting runtime — ADR + `PKGR01_ACCOUNTING` gap closure (not new TIP docs).

---

## Runtime implementation sequence (delivered)

> **Order by dependency, not TIP number.** Steps 1–9 are **Complete** — retained as audit trail.  
> Do not re-run unless regression or matrix drift requires it.

| Step | Slice | Package / layer | Depends on | Document |
| ---: | --- | --- | --- | --- |
| 1 | Outbox schema | `@afenda/database` | — | [TIP-011 §Slice 1](tips/%5BComplete%5D%20tip-011-execution-foundation.md#slice-1--outbox-schema-afendadatabase) — **delivered** |
| 2 | Outbox publish worker | `@afenda/execution` | Step 1 | [TIP-011 §Slice 2](tips/%5BComplete%5D%20tip-011-execution-foundation.md#slice-2--outbox-publish-worker-afendaexecution) — **delivered** |
| 3 | ERP outbox integration proof | `@afenda/erp` | Steps 1–2 | [TIP-011 §Slice 3](tips/%5BComplete%5D%20tip-011-execution-foundation.md#slice-3--erp-integration-test-afendaerp) — **delivered** |
| 4 | Spine contract + helper | `@afenda/erp` | Steps 1–3 | [TIP-012 §Slice 1](tips/%5BComplete%5D%20tip-012-erp-operating-spine.md#slice-1--spine-contract--helper-afendaerp) — **delivered** |
| 5 | Handler integration + lifecycle test | `@afenda/erp` | Steps 1–4 | [TIP-012 §Slice 2](tips/%5BComplete%5D%20tip-012-erp-operating-spine.md#slice-2--handler-integration--lifecycle-test-afendaerp) — **delivered** |
| 6 | API contract governance — registry + method policy | `@afenda/erp` (Phase 5) | Step 5 | [TIP-010A §Slice 1](tips/%5BComplete%5D%20tip-010a-api-contract-governance.md) — **delivered** |
| 7 | API contract governance — idempotency + pagination | `@afenda/erp` (Phase 5) | Step 6 | [TIP-010A §Slice 2](tips/%5BComplete%5D%20tip-010a-api-contract-governance.md) — **delivered** |
| 8a | Feature manifest — registry + route + capability bindings | `@afenda/entitlements` (Phase 7) | Step 7 | [TIP-007A §Slice 1](tips/%5BComplete%5D%20tip-007a-feature-manifest-governance.md#slice-1--manifest--capability-registry-afendaentitlements) — **delivered** |
| 8b | Feature manifest — AppShell nav from manifest | `@afenda/appshell` (Phase 7) | Step 8a | [TIP-007A §Slice 2](tips/%5BComplete%5D%20tip-007a-feature-manifest-governance.md#slice-2--nav-from-manifest-afendaappshell) — **delivered** |
| 8c | Feature manifest — ERP module routes + guard | `@afenda/erp` (Phase 7) | Steps 8a–8b | [TIP-007A §Slice 3](tips/%5BComplete%5D%20tip-007a-feature-manifest-governance.md#slice-3--erp-module-routes--guard-afendaerp) — **delivered** |
| 9 | System Admin control plane | `@afenda/erp` (Phase 8) | Steps 7–8 | [TIP-013](tips/%5BComplete%5D%20tip-013-system-admin-control-plane.md) — **Complete** |

**One slice per coding session.** After each slice: §11 Completion Report → update delivery doc → this index → runtime matrix → rename `[status]` prefix if status changed.

---

## Partially implemented TIP sequence

> **Next coding sessions start here.** Order by dependency and foundation phase — not TIP number.  
> Copy **one** §Handoff block from the linked delivery doc per session.  
> **Parallel rule:** Tracks C and D may run alongside Track A once Step 10 is in flight; Track B Steps 14–16 should follow Track A Step 12 where noted.

### Track A — Phase 1 platform authority (gates Phase 1 exit)

| Step | TIP | Slice | Package / layer | Depends on | Handoff |
| ---: | --- | --- | --- | --- | --- |
| 10 | **TIP-006** | **1** Authority contracts freeze | `@afenda/appshell` | Steps 1–9 | [§Slice 1](tips/%5BComplete%5D%20tip-006-appshell-authority.md#slice-1--authority-contracts-freeze-afendaappshell) — **delivered** |
| 11 | **TIP-006** | **2** Contract tests | `@afenda/appshell` | Step 10 | [§Slice 2](tips/%5BComplete%5D%20tip-006-appshell-authority.md#slice-2--contract-tests-afendaappshell) — **delivered** |
| 12 | **TIP-006** | **3** Public API alignment | `@afenda/appshell` | Step 11 | [§Slice 3](tips/%5BComplete%5D%20tip-006-appshell-authority.md#slice-3--public-api-alignment-afendaappshell) — **delivered** |
| **→ 13** | **TIP-007** | **1** Platform contract barrel | `@afenda/kernel` | Step 10 (parallel OK) | [§Slice 1](tips/%5BComplete%5D%20tip-007-erp-platform-authority.md#slice-1--platform-contract-barrel-afendakernel) — **delivered** |
| 14 | **TIP-008A** | **1–6** Consolidation scope + hierarchy hardening | `@afenda/database` → `@afenda/kernel` → `@afenda/erp` | Steps 10, 13 | [§008A Slice 1–6](tips/%5BComplete%5D%20tip-008-master-data-authority.md#slice-1--consolidation-scope-resolver-008a) — **delivered** |
| 15 | **TIP-008B** | **1–7** Authority map + kernel contracts + governance guards | `@afenda/kernel` | Step 13 | [§008B Slice 1–7](tips/%5BComplete%5D%20tip-008-master-data-authority.md#slice-1--business-master-data-authority-map-008b) — **delivered** |

**Phase 1 gate closes when:** Steps 10–12 + 13 + 14 + 15 complete ([roadmap Phase 1](../architecture/pre-accounting-foundation-roadmap.md#foundation-phase-1--architecture-authority)).

### Track B — Multi-tenancy + API security follow-on (Phases 2–3)

| Step | TIP | Slice | Package / layer | Depends on | Handoff |
| ---: | --- | --- | --- | --- | --- |
| **→ 16** | **TIP-007/012** | **A** `entity_group` membership scope | `@afenda/permissions` + `@afenda/database` | Step 14 | [§Slice A](tips/%5BComplete%5D%20tip-007-012-enterprise-group-operating-context.md#slice-a--entity-group-membership-scope-entity_group--tip-008) — **delivered** |
| **→ 17** | **TIP-010** | **2** Route matrix + system-admin RBAC | `@afenda/erp` | Steps 1–9 | [§Slice 2](tips/%5BComplete%5D%20tip-010-api-rbac-wiring.md#slice-2--route-matrix--system-admin-api-rbac-afendaerp) — **delivered** |
| **→ 18** | **TIP-007/012** | **B** Governed API route coverage | `@afenda/erp` | Step 17 (parallel OK) | [§Slice B](tips/%5BComplete%5D%20tip-007-012-enterprise-group-operating-context.md#slice-b--governed-api-route-coverage--tip-010a) — **delivered** |
| **→ 19** | **TIP-030** | **1–2** Project/team tables + `project`/`team` membership scope + RLS | `@afenda/database` + `@afenda/permissions` | Step 18 | [§Slice 2](tips/%5BComplete%5D%20tip-030-project-membership-scope.md#slice-2--team-membership-scope) — **delivered** |

**Delivered in Track B (do not re-implement):** [TIP-010 §Slice 1](tips/%5BComplete%5D%20tip-010-api-rbac-wiring.md#slice-1--workspace-api-rbac-afendaerp--afendapermissions) workspace dashboard API RBAC.

### Track C — UI surfaces (Phase 4 / Phase 6 gate)

| Step | TIP | Slice | Package / layer | Depends on | Handoff |
| ---: | --- | --- | --- | --- | --- |
| **→ 19** | **TIP-UI-05** | **1** Loading + error boundaries | `@afenda/erp` | TIP-UI-02 ✅ | [§Slice 1](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-1--governed-loading-and-error-boundaries-afendaerp) — **delivered** |
| **→ 20** | **TIP-UI-04** | **2** ERP metadata production page | `@afenda/erp` | Step 19 (parallel OK) | [§Slice 2](tips/%5BComplete%5D%20tip-ui-04-metadata-ui-renderers.md#slice-2--erp-production-page-wiring-afendaerp) — **delivered** |
| 21 | **TIP-UI-05** | **2** ApplicationShell production polish | `@afenda/erp` | Steps 10–12, 19 | [§Slice 2](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-2--applicationshell-production-polish-afendaerp) — **delivered** |
| 22 | **TIP-UI-05** | **3** Metadata page + module placeholder UX | `@afenda/erp` | Step 20 | [§Slice 3](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-3--metadata-driven-page--module-placeholder-ux-afendaerp) — **delivered** |
| **→ 23** | **TIP-UI-05** | **4** Empty-state + card-nav (shadcn/studio) | `@afenda/erp` | Slice 1 | [§Slice 4](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-4--shadcnstudio-empty-state--card-nav-afendaerp) — **delivered** |
| **→ 24** | **TIP-UI-05** | **5** Form-layout + account-settings | `@afenda/erp` | Slice 4 | [§Slice 5](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-5--shadcnstudio-form-layout--account-settings-afendaerp) — **delivered** |
| 25 | **TIP-UI-05** | **6** Registry + chart KPI blocks | `@afenda/appshell` | Slice 2 | [§Slice 6](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-6--dependency-registry--chart-kpi-blocks-afendaappshell) — **delivered** |
| 26 | **TIP-UI-05** | **7** System Admin DataTable | `@afenda/erp` | Slice 6 | [§Slice 7](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-7--shadcnstudio-datatable-afendaerp) — **delivered** |
| 27 | **TIP-UI-05** | **8** Invite wizard + admin dialog | `@afenda/erp` | Slice 5 | [§Slice 8](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-8--shadcnstudio-multi-step-invite--admin-dialog-afendaerp) — **delivered** |
| **→ 28** | **TIP-UI-05** | **10** | UI Gate A stepper normalization | `@afenda/ui` | Slice 8 | [§Slice 10](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-10--ui-gate-a-stepper-storybook-normalization-afendaui) — **delivered** |
| **→ 29** | **TIP-UI-05** | **11** | ERP test suite repair | `@afenda/erp` | Slices 7–8 | [§Slice 11](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-11--erp-test-suite-repair-afendaerp) — **delivered** |
| **→ 30** | **TIP-UI-05** | **12** | Invite role radio a11y | `@afenda/erp` | Slice 8 | [§Slice 12](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-12--invite-wizard-role-radio-keyboard-association-afendaerp) — **delivered** |
| 31 | **TIP-UI-03** | **2** | Visual regression + ERP shell closeout | `@afenda/appshell` + `@afenda/erp` | Steps 12, 21–30 | [§Slice 2](tips/%5BComplete%5D%20tip-ui-03-appshell-token-migration.md#slice-2--visual-regression--erp-integration-closeout) ✅ |

**Delivered in Track C (do not re-implement):** [TIP-UI-03](tips/%5BComplete%5D%20tip-ui-03-appshell-token-migration.md) Complete (Slices 1–3); [TIP-UI-04 §Slice 1–2](tips/%5BComplete%5D%20tip-ui-04-metadata-ui-renderers.md) package renderers + production `/metadata-workspace`; manifest module placeholders via [TIP-007A](tips/%5BComplete%5D%20tip-007a-feature-manifest-governance.md) at `/modules/[moduleId]`.

### Track E — Phase 9 Accounting Readiness Gate (ADR-0010)

| Step | TIP | Slice | Package / layer | Depends on | Handoff |
| ---: | --- | --- | --- | --- | --- |
| **→ 32** | **TIP-013A** | **1** | Gate orchestrator + kernel contracts + ERP diagnostics | Steps 1–31 (TIP-013 Complete) | [§Slice 1](tips/%5BComplete%5D%20tip-013a-accounting-readiness-gate.md#slice-1--gate-automation--typescript-boundary--diagnostics-ui) — **delivered** |
| **→ 33** | **TIP-013A** | **2** | TIP-009 CI wiring + registry parity | Step 32 | [§Slice 2](tips/%5BComplete%5D%20tip-013a-accounting-readiness-gate.md#slice-2--tip-009-ci-wiring--registry-parity--handoff-repair) — **delivered** |
| 34 | **TIP-013A** | **3–4** | Live diagnostics + risk-hardened UX | Steps 32–33 | [§Slice 3–4](tips/%5BComplete%5D%20tip-013a-accounting-readiness-gate.md) — **delivered** |
| 35 | **TIP-013A** | **5** | Phase 9 sign-off + foundation disposition closure | Step 34 | [§Slice 5](tips/%5BComplete%5D%20tip-013a-accounting-readiness-gate.md#slice-5--phase-9-sign-off--foundation-disposition-closure) — **delivered** |

**Phase 9 gate passed 2026-06-24.** TIP-014 **Complete (authority only)**; ledger/posting remains prohibited until TIP-015+ ADR.

### Track F — Accounting Core Contracts (post Phase 9)

| Step | TIP | Slice | Package / layer | Depends on | Handoff |
| ---: | --- | --- | --- | --- | --- |
| **→ 36** | **TIP-014** | **1** | ADR-0015 + PKG-R01 registry promotion | Step 35 (TIP-013A Complete) | [§Slice 1](tips/%5BComplete%20(authority%20only)%5D%20tip-014-accounting-core-contracts.md#slice-1--adr-0015-acceptance--pkg-r01-registry-promotion) — **delivered** |
| **→ 37** | **TIP-014** | **2** | `@afenda/accounting` package scaffold | Step 36 | [§Slice 2](tips/%5BComplete%20(authority%20only)%5D%20tip-014-accounting-core-contracts.md#slice-2--package-scaffold--authority-contract-barrel) — **delivered** |
| **→ 38** | **TIP-014** | **3** | Domain vocabulary + kernel bridge | Step 37 | [§Slice 3](tips/%5BComplete%20(authority%20only)%5D%20tip-014-accounting-core-contracts.md#slice-3--domain-vocabulary--branded-ids--kernel-bridge) — **delivered** |
| **→ 39** | **TIP-014** | **4** | Permission + audit vocabulary | Step 38 | [§Slice 4](tips/%5BComplete%20(authority%20only)%5D%20tip-014-accounting-core-contracts.md#slice-4--permission-vocabulary--audit-actions) — **delivered** |
| 40 | **TIP-014** | **5** | Governance gate + disposition + docs | Step 39 | [§Slice 5](tips/%5BComplete%20(authority%20only)%5D%20tip-014-accounting-core-contracts.md#slice-5--governance-gate--foundation-disposition--documentation-closeout) — **delivered** |

**One slice per coding session.** No Drizzle schemas until TIP-015.

### Track D — Parallel non-blocking (master plan Phase 3)

| Step | TIP | Slice | Package / layer | Depends on | Handoff |
| ---: | --- | --- | --- | --- | --- |
| 29 | **TIP-032** | **5** MDX component library | `@afenda/ui` + Storybook | Slices 1–4 ✅ | [§Slice 5](tips/%5BComplete%5D%20tip-032-implementation-documentation.md#slice-5--afenda-docs-reference-blocks-packagesui--storybook) — **delivered** |
| 30 | **TIP-032** | **6** Deploy target | `@afenda/docs` | Step 29 | [§Slice 6](tips/%5BComplete%5D%20tip-032-implementation-documentation.md#slice-6--deploy-target-afendadocs) — **delivered** |
| 31 | **TIP-032** | **5.1** MDX blocks copy + domain doc | `@afenda/docs` | Step 30 | [§Slice 5.1](tips/%5BComplete%5D%20tip-032-implementation-documentation.md#slice-51--mdx-editorial-blocks-copy--production-domain-afendadocs) — **delivered** |

**Does not gate Foundation Phases 0–9.** Safe alongside Tracks A–C.

### Quick reference — partially implemented TIPs

| TIP | Status | Next step | Blocks |
| --- | --- | --- | --- |
| TIP-006 | Complete | — (Steps 10–12 delivered) | Phase 1 gate (with TIP-007/008) |
| TIP-007 | Complete | — (Step 13 delivered) | Phase 1 gate (with TIP-008); TIP-008B vocabulary |
| TIP-007/012 | Complete (foundation) | Slices **A–G** delivered; DoD #1–16 closed; Phase 4 RLS artifact + live gates complete | Maintain only — TIP-UI-05 Complete |
| TIP-030 | Complete | Slices 1–2 delivered (`project` + `team` scope) | — |
| TIP-008A | Complete | — (Steps 14 delivered) | Maintain only |
| TIP-008B | Complete (authority only) | Steps **15** delivered (Slices 1–7) | Domain package schemas (PKG-R02–R05) |
| TIP-010 | Complete | — (Step 17 delivered) | Phase 3 gate |
| TIP-UI-03 | Complete | — (Steps 23, 28 delivered) | — |
| TIP-UI-04 | Complete | — (Step 20 delivered) | TIP-UI-05; TIP-022 |
| TIP-UI-05 | Complete | — (Steps 19–30 delivered; DoD #1–24 closed) | — |
| TIP-032 | Complete | Steps **29–31** (Slices 5–6, 5.1) | — (parallel track) |
| TIP-013A | Complete | — (Steps 32–35 delivered; Phase 9 signed off 2026-06-24) | — |
| TIP-014 | Complete (authority only) | — (Track F Steps 36–40 delivered) | TIP-015+ (schemas/posting) |

### Do not start yet

| Target | Reason |
| --- | --- |
| **TIP-015+ ledger/posting** | ADR-0010 + ADR-0015 — COA/journal Drizzle/posting requires **new ADR** + FDR `PKGR01_ACCOUNTING` update; not a TIP doc |
| **TIP-UI-06** | Blocked on ADR-0008 |

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

| TIP | Document | Status | Evidence | Next step / gap |
| --- | --- | --- | --- | --- |
| TIP-001 | [tips/[Complete] tip-001-architecture-authority.md](tips/%5BComplete%5D%20tip-001-architecture-authority.md) | Complete | CI architecture gates | — |
| TIP-003 | [tips/[Complete (authority only)] tip-003-design-system-authority.md](tips/%5BComplete%20(authority%20only)%5D%20tip-003-design-system-authority.md) | Complete (authority only) | Contracts, token registry | No runtime UI (by design) |
| TIP-004 | [tips/[Complete (authority only)] tip-004-design-system-contracts.md](tips/%5BComplete%20(authority%20only)%5D%20tip-004-design-system-contracts.md) | Complete (authority only) | Contracts + tests | — |
| TIP-004 | [tips/[Complete] tip-004-ui-consumption.md](tips/%5BComplete%5D%20tip-004-ui-consumption.md) | Complete | ui-guard Gates D/F | Policy: governance/tip-004-policy |
| TIP-004A | [tips/[Complete] tip-004a-token-authority.md](tips/%5BComplete%5D%20tip-004a-token-authority.md) | Complete | Token registry, `--afenda-*` CSS vars | — |
| TIP-004B | [tips/[Complete] tip-004b-primitive-adapter.md](tips/%5BComplete%5D%20tip-004b-primitive-adapter.md) | Complete | `resolvePrimitiveGovernance()` | — |
| TIP-005 | [tips/[Complete (authority only)] tip-005-metadata-authority.md](tips/%5BComplete%20(authority%20only)%5D%20tip-005-metadata-authority.md) | Complete (authority only) | `@afenda/metadata` | — |
| TIP-006 | [tips/[Complete] tip-006-appshell-authority.md](tips/%5BComplete%5D%20tip-006-appshell-authority.md) | Complete | 93 `.tsx`, `afenda-appshell.css`, **`src/contracts/` + public API** | — |
| TIP-007 | [tips/[Complete] tip-007-erp-platform-authority.md](tips/%5BComplete%5D%20tip-007-erp-platform-authority.md) | Complete | Platform authority barrel + drift tests; entity ownership map frozen | — |
| TIP-007A | [tips/[Complete] tip-007a-feature-manifest-governance.md](tips/%5BComplete%5D%20tip-007a-feature-manifest-governance.md) | Complete | Manifest pipeline (Slices 1–3) | — |
| TIP-007/012 | [tips/[Complete] tip-007-012-enterprise-group-operating-context.md](tips/%5BComplete%5D%20tip-007-012-enterprise-group-operating-context.md) | Complete (foundation) | Multi-tenancy foundation + 22 gates; Slices A–G delivered; DoD #1–16 closed; tenant RLS artifact + live gates | Cross-TIP UX polish (TIP-UI-05) |
| TIP-030 | [tips/[Complete] tip-030-project-membership-scope.md](tips/%5BComplete%5D%20tip-030-project-membership-scope.md) | Complete | `projects` + `teams` tables; `project` + `team` membership scope | PM domain logic |
| TIP-008A | [tips/[Complete] tip-008-master-data-authority.md](tips/%5BComplete%5D%20tip-008-master-data-authority.md) §008A | Complete | Entity group + ownership schemas; consolidation resolver + dedup policy; ADR-0011 acceptance gate closed; API hierarchy RBAC boundary | Maintain only |
| TIP-008B | [tips/[Complete] tip-008-master-data-authority.md](tips/%5BComplete%5D%20tip-008-master-data-authority.md) §008B | Complete (authority only) | Kernel authority registry + wire reference contracts | Domain package schemas (PKG-R02–R05) |
| TIP-009 | [tips/[Complete] tip-009-ci-cd-preview.md](tips/%5BComplete%5D%20tip-009-ci-cd-preview.md) | Complete | Turborepo, `pnpm quality` | — |
| TIP-010 | [tips/[Complete] tip-010-api-rbac-wiring.md](tips/%5BComplete%5D%20tip-010-api-rbac-wiring.md) | Complete | Full internal v1 route matrix; system-admin RBAC; cross-company denial | — |
| TIP-010A | [tips/[Complete] tip-010a-api-contract-governance.md](tips/%5BComplete%5D%20tip-010a-api-contract-governance.md) | Complete | Registry, method policy, idempotency replay, pagination contract | — |
| TIP-010† | [tips/[Superseded] tip-010-observability-audit.md](tips/%5BSuperseded%5D%20tip-010-observability-audit.md) | Superseded | TIP-011 observability evidence | Misnumbered — do not use as TIP-010 |
| TIP-011 | [tips/[Complete] tip-011-execution-foundation.md](tips/%5BComplete%5D%20tip-011-execution-foundation.md) | Complete | `@afenda/execution`, Trigger.dev prod worker **20260623.1**, outbox schema + publish worker + ERP integration proof | — |
| TIP-011† | [tips/[Superseded] tip-012-execution-foundation.md](tips/%5BSuperseded%5D%20tip-012-execution-foundation.md) | Superseded | Trigger.dev slice evidence | Misnumbered — see TIP-011 |
| TIP-012 | [tips/[Complete] tip-012-erp-operating-spine.md](tips/%5BComplete%5D%20tip-012-erp-operating-spine.md) | Complete | Spine helper + lifecycle test + outbox on dashboard PUT; Trigger.dev deploy closed via TIP-011 Slice 4 | — |
| TIP-013 | [tips/[Complete] tip-013-system-admin-control-plane.md](tips/%5BComplete%5D%20tip-013-system-admin-control-plane.md) | Complete | `system-admin` layout + pages + governed API contracts; integration tests | Audit pagination; settings/org mutations |
| TIP-013A | [tips/[Complete] tip-013a-accounting-readiness-gate.md](tips/%5BComplete%5D%20tip-013a-accounting-readiness-gate.md) | Complete | Slices 1–5 delivered; Phase 9 signed off 2026-06-24; foundation disposition zero red-lane | — |
| TIP-014 | [tips/[Complete (authority only)] tip-014-accounting-core-contracts.md](tips/%5BComplete%20(authority%20only)%5D%20tip-014-accounting-core-contracts.md) | Complete (authority only) | `@afenda/accounting` contracts-only authority; all slices delivered | TIP-015+ runtime |

† Misnumbered evidence — audit trail only.

### UI implementation (TIP-UI)

| TIP | Document | Status | Evidence | Next step / gap |
| --- | --- | --- | --- | --- |
| TIP-UI-01 | [tips/[Complete] tip-ui-01-css-pipeline.md](tips/%5BComplete%5D%20tip-ui-01-css-pipeline.md) | Complete | `globals.css`, tokens.css | — |
| TIP-UI-02 | [tips/[Complete] tip-ui-02-component-library.md](tips/%5BComplete%5D%20tip-ui-02-component-library.md) | Complete | 58 components, 68+ tests | ADR-0008 batch deferred |
| TIP-UI-03 | [tips/[Complete] tip-ui-03-appshell-token-migration.md](tips/%5BComplete%5D%20tip-ui-03-appshell-token-migration.md) | Complete | `afenda-appshell.css`; compile-time contract guards; ERP closeout test | — |
| TIP-UI-04 | [tips/[Complete] tip-ui-04-metadata-ui-renderers.md](tips/%5BComplete%5D%20tip-ui-04-metadata-ui-renderers.md) | Complete | Renderers + tests (Slice 1); production `/metadata-workspace` route (Slice 2) | — |
| TIP-UI-05 | [tips/[Complete] tip-ui-05-erp-app-surfaces.md](tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md) | Complete | Slices 1–12 delivered; DoD #1–24 closed; Phase 6 gate evidence | — |
| TIP-UI-06 | [tips/[Blocked] tip-ui-06-react19-ref-as-prop.md](tips/%5BBlocked%5D%20tip-ui-06-react19-ref-as-prop.md) | Blocked | ADR-0008 Proposed | Package-wide batch not started |

### Parallel track — non-blocking (master plan Phase 3)

> **Does not gate Foundation Phases 0–9.** Safe to implement alongside foundation slices.

| TIP | Doc | Status | Runtime evidence | Next step / gap |
| --- | --- | --- | --- | --- |
| TIP-032 | [tips/[Complete] tip-032-implementation-documentation.md](tips/%5BComplete%5D%20tip-032-implementation-documentation.md) | Complete | Fumadocs + CI + seed content + deploy + MDX editorial blocks (Slices 1–6, 5.1) | Live DNS for `docs.afenda.app` (Vercel operator step) |

Architecture baseline: [`docs-app-architecture.md`](../architecture/docs-app-architecture.md)

### Accounting Core — Phase 9 passed (ADR-0010)

| TIP | Doc | Status | Reason |
| --- | --- | --- | --- |
| TIP-014 | [tips/[Complete (authority only)] tip-014-accounting-core-contracts.md](tips/%5BComplete%20(authority%20only)%5D%20tip-014-accounting-core-contracts.md) | Complete (authority only) | **Delivered** — contracts-only authority; Track F complete |
| TIP-015+ | — | Blocked | COA schemas, journal posting, ledger runtime after TIP-014 Complete (authority only) |
| `@afenda/accounting` | PKG-R01 | Active | Filesystem at `packages/accounting/` (Slice 2) |

> **TIP numbering (2026-06-23):** TIP-013 = Phase 8 System Admin (foundation). Accounting Core begins at **TIP-014+** (supersedes master plan v5 TIP-013 = accounting). ADR amendment tracked separately.

---

## Proposed foundation slices — NOT implementation authority

> **No active proposals.** TIP-010B superseded by canonical [TIP-013](tips/%5BComplete%5D%20tip-013-system-admin-control-plane.md).

| Superseded ID | Superseded by | Notes |
| --- | --- | --- |
| TIP-010B | **TIP-013** | Historical draft in [proposal](../architecture/foundation-phase-delivery-tip-proposal.md) only |
| TIP-030-SA | **Rejected** | Conflicts with TIP-030 Project Management |

**Promoted:** TIP-010A, TIP-007A, **TIP-013**, **TIP-032** — see §Canonical delivery TIPs and §Parallel track.

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

1. A **completed** TIP archive entry changes status prefix (same PR as closeout) — **no new TIP entries after 2026-06-24**
2. Runtime matrix is refreshed
3. `pnpm check:documentation-drift` fails
4. FDR entries change — sync via [`foundation-disposition.md`](../architecture/foundation-disposition.md), not this index

*2026-06-24 — TIP delivery reclassified to archive-lane; FDR is implementation authority (ADR-0014)*
