# Delivery TIP Status Index

| Field | Value |
| --- | --- |
| **As-of** | 2026-06-24 |
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
3. Confirm status: Partially Implemented or Not started — use [§Partially implemented TIP sequence](#partially-implemented-tip-sequence) for order
4. Copy ONE §Handoff slice block
5. Paste into /afenda-coding-session Phase 0
6. Implement ONE slice per session (database → platform → app)
7. Post §11 Completion Report — closes TIP DoD rows
8. Update delivery doc + rename [status] prefix + this index + runtime matrix (same PR)
9. pnpm check:documentation-drift
```

**Current runtime priority:** Spine + Phase 5–8 foundation slices **delivered** (Steps 1–9). **Next:** [Partially implemented TIP sequence](#partially-implemented-tip-sequence) — Phase 1 authority closeout, then security/UI follow-on. Phase 9 Accounting Readiness Gate remains blocked (ADR-0010).

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
| 14 | **TIP-008A** | **1–2** Consolidation scope resolver + hardening | `@afenda/database` → `@afenda/kernel` → `@afenda/erp` | Steps 10, 13 | [§008A Slice 1–2](tips/%5BPartially%20Implemented%5D%20tip-008-master-data-authority.md#slice-1--consolidation-scope-resolver-008a) — **delivered** |
| 15 | **TIP-008B** | **1** Business MD authority map (doc-only) | `docs/delivery/` | Step 13 | [§008B Slice 1](tips/%5BPartially%20Implemented%5D%20tip-008-master-data-authority.md#slice-1--business-master-data-authority-map-008b) — **delivered** |

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
| **→ 19** | **TIP-UI-05** | **1** Loading + error boundaries | `@afenda/erp` | TIP-UI-02 ✅ | [§Slice 1](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-1--governed-loading-and-error-boundaries-afendaerp) |
| **→ 20** | **TIP-UI-04** | **2** ERP metadata production page | `@afenda/erp` | Step 19 (parallel OK) | [§Slice 2](tips/%5BComplete%5D%20tip-ui-04-metadata-ui-renderers.md#slice-2--erp-production-page-wiring-afendaerp) — **delivered** |
| 21 | **TIP-UI-05** | **2** ApplicationShell production polish | `@afenda/erp` | Steps 10–12, 19 | [§Slice 2](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-2--applicationshell-production-polish-afendaerp) |
| 22 | **TIP-UI-05** | **3** Metadata page + module placeholder UX | `@afenda/erp` | Step 20 | [§Slice 3](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-3--metadata-driven-page--module-placeholder-ux-afendaerp) — **delivered** |
| **→ 23** | **TIP-UI-05** | **4** Empty-state + card-nav (shadcn/studio) | `@afenda/erp` | Slice 1 | [§Slice 4](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-4--shadcnstudio-empty-state--card-nav-afendaerp) — **delivered** |
| **→ 24** | **TIP-UI-05** | **5** Form-layout + account-settings | `@afenda/erp` | Slice 4 | [§Slice 5](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-5--shadcnstudio-form-layout--account-settings-afendaerp) — **delivered** |
| 25 | **TIP-UI-05** | **6** Registry + chart KPI blocks | `@afenda/appshell` | Slice 2 | [§Slice 6](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-6--dependency-registry--chart-kpi-blocks-afendaappshell) — **delivered** |
| 26 | **TIP-UI-05** | **7** System Admin DataTable | `@afenda/erp` | Slice 6 | [§Slice 7](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-7--shadcnstudio-datatable-afendaerp) — **delivered** |
| 27 | **TIP-UI-05** | **8** Invite wizard + admin dialog | `@afenda/erp` | Slice 5 | [§Slice 8](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-8--shadcnstudio-multi-step-invite--admin-dialog-afendaerp) — **delivered** |
| **→ 28** | **TIP-UI-05** | **10** | UI Gate A stepper normalization | `@afenda/ui` | Slice 8 | [§Slice 10](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-10--ui-gate-a-stepper-storybook-normalization-afendaui) — **delivered** |
| **→ 29** | **TIP-UI-05** | **11** | ERP test suite repair | `@afenda/erp` | Slices 7–8 | [§Slice 11](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-11--erp-test-suite-repair-afendaerp) — **delivered** |
| **→ 30** | **TIP-UI-05** | **12** | Invite role radio a11y | `@afenda/erp` | Slice 8 | [§Slice 12](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md#slice-12--invite-wizard-role-radio-keyboard-association-afendaerp) — **delivered** |
| 31 | **TIP-UI-03** | **2** | Visual regression + ERP shell closeout | `@afenda/appshell` + `@afenda/erp` | Steps 12, 21–30 | [§Slice 2](tips/%5BComplete%5D%20tip-ui-03-appshell-token-migration.md#slice-2--visual-regression--erp-integration-closeout) ✅ |

**Delivered in Track C (do not re-implement):** [TIP-UI-03](tips/%5BComplete%5D%20tip-ui-03-appshell-token-migration.md) Complete (Slices 1–3); [TIP-UI-04 §Slice 1–2](tips/%5BComplete%5D%20tip-ui-04-metadata-ui-renderers.md) package renderers + production `/metadata-workspace`; manifest module placeholders via [TIP-007A](tips/%5BComplete%5D%20tip-007a-feature-manifest-governance.md) at `/modules/[moduleId]`.

### Track D — Parallel non-blocking (master plan Phase 3)

| Step | TIP | Slice | Package / layer | Depends on | Handoff |
| ---: | --- | --- | --- | --- | --- |
| **→ 29** | **TIP-032** | **5** MDX component library | `@afenda/docs` | Slices 1–4 ✅ | [§Slice 5](tips/%5BPartially%20Implemented%5D%20tip-032-implementation-documentation.md#slice-5--mdx-component-library--editorial-blocks-afendadocs) |
| 30 | **TIP-032** | **6** Deploy target | `@afenda/docs` | Step 29 | [§Slice 6](tips/%5BPartially%20Implemented%5D%20tip-032-implementation-documentation.md#slice-6--deploy-target-afendadocs) |

**Does not gate Foundation Phases 0–9.** Safe alongside Tracks A–C.

### Quick reference — partially implemented TIPs

| TIP | Status | Next step | Blocks |
| --- | --- | --- | --- |
| TIP-006 | Complete | — (Steps 10–12 delivered) | Phase 1 gate (with TIP-007/008) |
| TIP-007 | Complete | — (Step 13 delivered) | Phase 1 gate (with TIP-008); TIP-008B vocabulary |
| TIP-007/012 | Complete (foundation) | Slices **A–G** delivered; DoD #1–16 closed; Phase 4 RLS artifact + live gates complete | Cross-TIP UX polish (TIP-UI-05) only |
| TIP-030 | Complete | Slices 1–2 delivered (`project` + `team` scope) | — |
| TIP-008A | Complete | Slices 1–5 delivered; formal sign-off | Maintain only |
| TIP-008B | Partially Implemented | Step **15** delivered (authority map) | Domain package runtime (PKG-R02–R05) |
| TIP-010 | Complete | — (Step 17 delivered) | Phase 3 gate |
| TIP-UI-03 | Complete | — (Steps 23, 28 delivered) | — |
| TIP-UI-04 | Complete | — (Step 20 delivered) | TIP-UI-05; TIP-022 |
| TIP-UI-05 | Partially Implemented | Step **19** (Slices **4–8** shadcn/studio adaptation authored) | Phase 6 gate |
| TIP-032 | Partially Implemented | Step **24** (Slices 1–4 delivered) | — (parallel track) |

### Do not start yet

| Target | Reason |
| --- | --- |
| **TIP-014+ Accounting** | ADR-0010 — Phase 9 gate not passed |
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
| TIP-008A | [tips/[Partially Implemented] tip-008-master-data-authority.md](tips/%5BPartially%20Implemented%5D%20tip-008-master-data-authority.md) §008A | Complete | Entity group + ownership schemas; consolidation resolver + dedup policy; ADR-0011 acceptance gate closed; API hierarchy RBAC boundary | Maintain only |
| TIP-008B | [tips/[Partially Implemented] tip-008-master-data-authority.md](tips/%5BPartially%20Implemented%5D%20tip-008-master-data-authority.md) §008B | Partially Implemented | Glossary + dependency registry authority map | Runtime contracts deferred to domain TIPs |
| TIP-009 | [tips/[Complete] tip-009-ci-cd-preview.md](tips/%5BComplete%5D%20tip-009-ci-cd-preview.md) | Complete | Turborepo, `pnpm quality` | — |
| TIP-010 | [tips/[Complete] tip-010-api-rbac-wiring.md](tips/%5BComplete%5D%20tip-010-api-rbac-wiring.md) | Complete | Full internal v1 route matrix; system-admin RBAC; cross-company denial | — |
| TIP-010A | [tips/[Complete] tip-010a-api-contract-governance.md](tips/%5BComplete%5D%20tip-010a-api-contract-governance.md) | Complete | Registry, method policy, idempotency replay, pagination contract | — |
| TIP-010† | [tips/[Superseded] tip-010-observability-audit.md](tips/%5BSuperseded%5D%20tip-010-observability-audit.md) | Superseded | TIP-011 observability evidence | Misnumbered — do not use as TIP-010 |
| TIP-011 | [tips/[Complete] tip-011-execution-foundation.md](tips/%5BComplete%5D%20tip-011-execution-foundation.md) | Complete | `@afenda/execution`, Trigger.dev prod worker **20260623.1**, outbox schema + publish worker + ERP integration proof | — |
| TIP-011† | [tips/[Superseded] tip-012-execution-foundation.md](tips/%5BSuperseded%5D%20tip-012-execution-foundation.md) | Superseded | Trigger.dev slice evidence | Misnumbered — see TIP-011 |
| TIP-012 | [tips/[Complete] tip-012-erp-operating-spine.md](tips/%5BComplete%5D%20tip-012-erp-operating-spine.md) | Complete | Spine helper + lifecycle test + outbox on dashboard PUT; Trigger.dev deploy closed via TIP-011 Slice 4 | — |
| TIP-013 | [tips/[Complete] tip-013-system-admin-control-plane.md](tips/%5BComplete%5D%20tip-013-system-admin-control-plane.md) | Complete | `system-admin` layout + pages + governed API contracts; integration tests | Audit pagination; settings/org mutations |

† Misnumbered evidence — audit trail only.

### UI implementation (TIP-UI)

| TIP | Document | Status | Evidence | Next step / gap |
| --- | --- | --- | --- | --- |
| TIP-UI-01 | [tips/[Complete] tip-ui-01-css-pipeline.md](tips/%5BComplete%5D%20tip-ui-01-css-pipeline.md) | Complete | `globals.css`, tokens.css | — |
| TIP-UI-02 | [tips/[Complete] tip-ui-02-component-library.md](tips/%5BComplete%5D%20tip-ui-02-component-library.md) | Complete | 58 components, 68+ tests | ADR-0008 batch deferred |
| TIP-UI-03 | [tips/[Complete] tip-ui-03-appshell-token-migration.md](tips/%5BComplete%5D%20tip-ui-03-appshell-token-migration.md) | Complete | `afenda-appshell.css`; compile-time contract guards; ERP closeout test | — |
| TIP-UI-04 | [tips/[Complete] tip-ui-04-metadata-ui-renderers.md](tips/%5BComplete%5D%20tip-ui-04-metadata-ui-renderers.md) | Complete | Renderers + tests (Slice 1); production `/metadata-workspace` route (Slice 2) | — |
| TIP-UI-05 | [tips/[Partially Implemented] tip-ui-05-erp-app-surfaces.md](tips/%5BPartially%20Implemented%5D%20tip-ui-05-erp-app-surfaces.md) | Partially Implemented | Auth, globals, manifest placeholders (TIP-007A) | **Step 19** — boundaries; **21–22** — polish + metadata UX |
| TIP-UI-06 | [tips/[Blocked] tip-ui-06-react19-ref-as-prop.md](tips/%5BBlocked%5D%20tip-ui-06-react19-ref-as-prop.md) | Blocked | ADR-0008 Proposed | Package-wide batch not started |

### Parallel track — non-blocking (master plan Phase 3)

> **Does not gate Foundation Phases 0–9.** Safe to implement alongside foundation slices.

| TIP | Doc | Status | Runtime evidence | Next step / gap |
| --- | --- | --- | --- | --- |
| TIP-032 | [tips/[Partially Implemented] tip-032-implementation-documentation.md](tips/%5BPartially%20Implemented%5D%20tip-032-implementation-documentation.md) | Partially Implemented | Fumadocs + CI + seed content (Slices 1–4 delivered) | **Step 29** — MDX blocks; **30** — deploy |

Architecture baseline: [`docs-app-architecture.md`](../architecture/docs-app-architecture.md)

### Blocked — Accounting Core (ADR-0010)

| TIP | Status | Reason |
| --- | --- | --- |
| TIP-014+ | Blocked | Phase 9 Accounting Readiness Gate not passed |
| `@afenda/accounting` | Blocked | PKG-R01 not activated |

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

1. A canonical TIP changes status (same PR as implementation or matrix update) — **rename `[status]` file prefix**
2. Runtime matrix is refreshed
3. `pnpm check:documentation-drift` fails
4. Architecture Authority accepts or rejects a proposed slice ID

*Delivery folder restructure — TIPs isolated under `tips/` with `[status]` prefixes — 2026-06-23*
