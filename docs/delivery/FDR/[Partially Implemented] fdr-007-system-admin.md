# fdr-007-system-admin — System Admin Control Plane

| Field | Value |
| --- | --- |
| **Status** | Partially Implemented |
| **FDR ID** | `fdr-007-system-admin` |
| **Registry entry ID** | `PKG007_ADMIN` |
| **Package** | `@afenda/erp` (PKG-007) |
| **Lane** | green-lane |
| **Gate-critical** | Yes — `requiredBeforeAccounting: true` in registry |
| **Clean Core level** | B ([enterprise-erp-standards §10](../../../.cursor/skills/enterprise-erp-standards/SKILL.md)) |
| **Change class** | Extension |
| **Risk class** | Medium |
| **BRD reference** | internal — system-admin control plane (Phase 9 prerequisite) |
| **Enterprise readiness** | **29/30 audit-adjusted** · **29/30 evidence-qualified ceiling** — Slice 4 Evidence-sync gate log attested (not final Complete; DoD #14 peer review open) |
| **Runtime evidence** | See §Runtime evidence |
| **Source of truth** | `foundation-disposition.registry.ts` |
| **Document role** | Delivery authority / evidence plan — not registry authority |
| **Status source** | [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) |
| **Index** | [`fdr-status-index.md`](../fdr-status-index.md) |
| **Enterprise controls** | SAP Auth objects + SOLMAN · Oracle Advanced Controls + FDD |
| **Archive hint** | TIP-013 Complete — archive input only; not FDR delivery status |

## §Registry link

> Read-only snapshot — authority is [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts).

| Field | Value |
| --- | --- |
| id | `PKG007_ADMIN` |
| packageId | PKG-007 |
| domain | `system-admin` |
| lane | green-lane |
| runtimeOwner | `apps/erp` |
| requiredBeforeAccounting | true |
| gates | `pnpm --filter @afenda/erp typecheck`; `pnpm --filter @afenda/erp test:run`; `pnpm check:documentation-drift`; `pnpm check:system-admin-mutation-audit` |
| prohibited | `do-not-create-accounting-package`; `do-not-edit-ui-primitives`; `do-not-add-local-permission-constants` |
| allowedAgents | `erp-app-agent`; `system-admin-agent`; `foundation-registry-owner` |
| legacyTipEvidence | [`tip-013-system-admin-control-plane.md`](../../delivery/tips/[Complete]%20tip-013-system-admin-control-plane.md) |

## Package ownership

| Package | Role | runtimeOwner path |
| --- | --- | --- |
| `@afenda/erp` (PKG-007) | System Admin layout, pages, server actions, governed API contracts | `apps/erp/src/lib/system-admin/` · `apps/erp/src/app/(protected)/system-admin/` |
| `@afenda/permissions` (PKG-014) | Section read keys via `PERMISSION_REGISTRY.systemAdmin.*` (read-only) | `packages/permissions/src/grants/` |
| `@afenda/observability` (PKG-013) | Cross-package governed mutation audit registry (read-only) | `packages/observability/src/surface/governed-mutation-audit-registry.ts` |
| Governance scripts | PKG007_ADMIN mutation audit gate enforcement | `scripts/governance/check-system-admin-mutation-audit.mts` |

## Purpose

Lock and maintain the ERP System Admin control plane — section registry, RBAC-guarded routes, governed internal v1 API mutations, server-action audit wiring, and CI-enforced mutation audit coverage — so tenant administration is permission-scoped, tenant-isolated, and audit-evidenced before Accounting Core activation.

Authority: [ADR-0014](../../adr/ADR-0014-foundation-disposition-registry.md) · [ADR-0016](../../adr/ADR-0016-fdr-delivery-authority.md).

Archive input (not implementation authority): [`tip-013-system-admin-control-plane.md`](../../delivery/tips/[Complete]%20tip-013-system-admin-control-plane.md).

## Scope

**In scope**

- `apps/erp/src/app/(protected)/system-admin/` — layout + seven section pages (users, memberships, roles, permissions, audit, settings, diagnostics)
- `apps/erp/src/lib/system-admin/system-admin-sections.ts` — canonical section registry + permission keys
- `apps/erp/src/lib/system-admin/guard-system-admin-section.server.ts` — section RBAC guard + denial audit
- `apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts` — governed mutation audit registry (API + server actions + supplementary denials)
- Governed internal v1 API contracts under `apps/erp/src/server/api/contracts/system-admin/`
- Governance gate: `pnpm check:system-admin-mutation-audit` and enforcement lib
- Cross-package observability registry entries for system-admin server actions

**Out of scope**

- Accounting Core runtime (ADR-0010)
- Operating-context resolver pipeline (`fdr-007-operating-context`)
- General API envelope governance (`fdr-007-api-governance`)
- Phase 9 readiness gate orchestrator internals (`fdr-007-accounting-readiness` — diagnostics UI consumes; gate logic owned separately)
- UI primitive authoring (`packages/ui/`)

## §Subagent concurrency rules

| Rule | Requirement |
| --- | --- |
| Registry ownership | Only `foundation-registry-owner` may edit `foundation-disposition.registry.ts` |
| Package boundary | Implementation agent may edit only `runtimeOwner` paths listed in slice Field 3 |
| Shared constants | No agent may duplicate `SYSTEM_ADMIN_SECTIONS` or mutation audit entries outside canonical registries |
| Permission keys | Section keys must come from `@afenda/permissions` `PERMISSION_REGISTRY` — no local permission constants |
| Evidence output | Agents must output file paths + gate exit 0 — not prose-only claims |
| Parallel PKG-007 | **Sequential** with sibling FDRs on different domains — same `runtimeOwner`; orchestrator serializes shared `apps/erp` edits |
| Implementation blocked until | Research Slice 1 complete with gate-backed attestation ✓ |
| Handoff authority | Executable 9-field handoff blocks authored only by `fdr-slice-author` — not in this FDR |

## §Research

> Slice 1 **Complete** (2026-06-25). Research reconciled runtime matrix **implemented** + archive tip-013 + registry `evidence[]` with FDR delivery evidence grades.

### Discovery questions — answers (Slice 1)

| Question | Answer | Evidence |
| --- | --- | --- |
| Do all seven `SYSTEM_ADMIN_SECTIONS` materialize as protected routes? | **Yes** — nav parity test asserts 7 routes | `system-admin-section-nav-parity.test.ts` — Grade A |
| Does every governed mutation emit audit evidence? | **Yes** — dual registry + governance gate exit 0 | `pnpm check:system-admin-mutation-audit` exit 0 |
| Are section denials audit-evidenced? | **Yes** — supplementary registry + guard tests | `guard-system-admin-section.server.test.ts` — Grade A |
| Does runtime matrix **implemented** align with FDR **Not started**? | **Drift closed** — FDR promoted to **Partially Implemented**; matrix row sync deferred to Evidence-sync slice | Gap `matrix-fdr-drift` closed in Slice 1 |
| Are `@afenda/observability` and PKG007 registries aligned? | **Yes** — PKG013 parity test asserts actionModule ↔ action id; all settings + invite actions `auditRequired: true` (waiver `system-admin-settings-observability-exempt` closed ARCH-ADMIN-001 Slice 5 / FDR Slice 7) | `system-admin-observability-registry-parity.test.ts` — Grade A |
| Gate-critical minimum (26/30) achievable post-Research? | **Yes** — audit-adjusted **26/30**; no dimension below 4/5 | §Enterprise readiness score |

### Baseline gate log (Research Slice 1 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm check:system-admin-mutation-audit` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |

### Files inspected

| Path | Why |
| --- | --- |
| `apps/erp/src/app/(protected)/system-admin/layout.tsx` | Admin shell layout |
| `apps/erp/src/lib/system-admin/system-admin-sections.ts` | Section + permission authority |
| `apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts` | Governed mutation audit registry |
| `apps/erp/src/lib/system-admin/guard-system-admin-section.server.ts` | RBAC guard + denial audit |
| `apps/erp/src/lib/system-admin/update-system-admin-settings.action.ts` | Server action audit wiring |
| `apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts` | Diagnostics mutation audit |
| `apps/erp/src/server/api/contracts/system-admin/system-admin.contract.ts` | Governed API mutation contracts |
| `apps/erp/src/lib/system-admin/__tests__/system-admin-mutation-audit-coverage.test.ts` | Registry ↔ source parity |
| `apps/erp/src/lib/system-admin/__tests__/guard-system-admin-section.server.test.ts` | Security negative path + audit |
| `apps/erp/src/lib/system-admin/__tests__/system-admin-section-nav-parity.test.ts` | Route materialization |
| `scripts/governance/check-system-admin-mutation-audit.mts` | PKG007_ADMIN CI gate |
| `scripts/governance/lib/system-admin-mutation-audit-enforcement.mts` | Enforcement rules |
| `scripts/governance/system-admin-mutation-audit-registry.mts` | Governance-side registry mirror |
| `packages/observability/src/surface/governed-mutation-audit-registry.ts` | PKG013 cross-package audit surface |
| [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md) | System Admin row (**implemented**; FDR was **Not started** — drift gap closed) |

## Runtime evidence (2026-06-25)

> Research Slice 1 attested — grades from registry `evidence[]`, path inspection, and baseline gate log.

| Artifact | Path | Proven |
| --- | --- | --- |
| Admin layout | `apps/erp/src/app/(protected)/system-admin/layout.tsx` | Yes — Grade B (on disk; layout not unit-tested) |
| Section registry | `apps/erp/src/lib/system-admin/system-admin-sections.ts` | Yes — Grade B (7 sections; keys from `PERMISSION_REGISTRY`) |
| Users page | `apps/erp/src/app/(protected)/system-admin/users/page.tsx` | Yes — Grade B |
| Memberships page | `apps/erp/src/app/(protected)/system-admin/memberships/page.tsx` | Yes — Grade B |
| Roles page | `apps/erp/src/app/(protected)/system-admin/roles/page.tsx` | Yes — Grade B |
| Permissions page | `apps/erp/src/app/(protected)/system-admin/permissions/page.tsx` | Yes — Grade B |
| Audit page | `apps/erp/src/app/(protected)/system-admin/audit/page.tsx` | Yes — Grade B |
| Settings page | `apps/erp/src/app/(protected)/system-admin/settings/page.tsx` | Yes — Grade B |
| Diagnostics page | `apps/erp/src/app/(protected)/system-admin/diagnostics/page.tsx` | Yes — Grade B |
| Section nav parity | `apps/erp/src/lib/system-admin/__tests__/system-admin-section-nav-parity.test.ts` | Yes — Grade A (7 routes materialized) |
| Section RBAC guard | `apps/erp/src/lib/system-admin/guard-system-admin-section.server.ts` | Yes — Grade B |
| Guard + denial audit tests | `apps/erp/src/lib/system-admin/__tests__/guard-system-admin-section.server.test.ts` | Yes — Grade A |
| ERP mutation audit registry | `apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts` | Yes — Grade B |
| Registry coverage test | `apps/erp/src/lib/system-admin/__tests__/system-admin-mutation-audit-coverage.test.ts` | Yes — Grade A (5 assertions) |
| PKG013 observability parity test | `apps/erp/src/lib/system-admin/__tests__/system-admin-observability-registry-parity.test.ts` | Yes — Grade A (3 assertions; settings waiver + refresh auditRequired) |
| Settings action + audit | `apps/erp/src/lib/system-admin/update-system-admin-settings.action.ts` | Yes — Grade B (`recordActionAudit` wired) |
| Settings action tests | `apps/erp/src/lib/system-admin/__tests__/update-system-admin-settings.action.test.ts` | Yes — Grade A |
| Readiness refresh action | `apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts` | Yes — Grade B |
| Readiness refresh tests | `apps/erp/src/lib/system-admin/__tests__/refresh-accounting-readiness-gate-full.action.test.ts` | Yes — Grade A |
| Governance gate script | `scripts/governance/check-system-admin-mutation-audit.mts` | Yes — Grade A (`pnpm check:system-admin-mutation-audit` exit 0) |
| Governance enforcement lib | `scripts/governance/lib/system-admin-mutation-audit-enforcement.mts` | Yes — Grade B |
| Governance registry mirror | `scripts/governance/system-admin-mutation-audit-registry.mts` | Yes — Grade B |
| PKG013 observability registry | `packages/observability/src/surface/governed-mutation-audit-registry.ts` | Yes — Grade B (system-admin actions listed) |
| Visible sections resolver | `apps/erp/src/lib/system-admin/list-visible-system-admin-sections.server.ts` | Yes — Grade B |
| Visible sections tests | `apps/erp/src/lib/system-admin/__tests__/list-visible-system-admin-sections.server.test.ts` | Yes — Grade A |
| Audit list server | `apps/erp/src/lib/system-admin/list-recent-audit-events.server.ts` | Yes — Grade B |
| Audit list tests | `apps/erp/src/lib/system-admin/__tests__/list-recent-audit-events.server.test.ts` | Yes — Grade A |
| ERP typecheck | `pnpm --filter @afenda/erp typecheck` | Yes — Grade A (Research baseline exit 0) |

## §Remaining gaps

> Gap tracking lives here — registry `knownGaps` is deprecated. Runtime matrix cites maintain backlog items.

| Gap ID | Description | Lane impact | Owner | Target slice | Close condition |
| --- | --- | --- | --- | --- | --- |
| `system-admin-audit-pagination` | Audit list pagination enhancement (runtime matrix maintain backlog) | blue | `erp-app-agent` | Slice 3+ | Paginated audit query + test — **deferred** (`system-admin-audit-pagination-defer`) |
| `system-admin-org-mutations` | Settings/org mutations beyond scaffold (runtime matrix) | green | `erp-app-agent` | Slice 3 / ARCH Slice 3 | Successful mutation path + audit — **closed** (ARCH-ADMIN-001 Slice 3 + invite resend/revoke Slice 7) |
| `system-admin-dod14-peer-review` | Architecture Authority peer review for Complete promotion | green | Architecture Authority | Post-Slice 4 | DoD #14 `[x]` at PR merge |

## §Enterprise readiness score

> **Enterprise 9.5 (final)** = 29/30 on this table **and** DoD #14 peer review closed **and** waivers reconfirmed at PR ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)). Until then this FDR is **gate-critical Research attested / evidence-qualified**, not final Complete.
>
> Score 0–5 per dimension (integers only in table). Every point maps to gate exit 0, test path, or explicit §Waivers row. Gate-critical rule: minimum **26/30**; no dimension below 4/5; Clean Core A or B.

| Dimension | Score | Evidence | Audit note |
| --- | ---: | --- | --- |
| Contract stability | 5/5 | `typecheck` exit 0 + `system-admin-sections.ts` + API contracts + coverage test — Grade A | Slice 4 gate log |
| Test coverage | 5/5 | `pnpm --filter @afenda/erp test:run` exit 0 — 572 tests — Grade A | Slice 4 post-hygiene gate log |
| Observability + audit | 5/5 | Dual registry + parity test + `check:system-admin-mutation-audit` exit 0 — Grade A | Settings waiver closed Slice 5; invite resend/revoke registered Slice 7 |
| Security + RBAC + RLS | 5/5 | `guard-system-admin-section.server.test.ts` denial + audit; keys from `PERMISSION_REGISTRY` — Grade A | via `test:run` exit 0 |
| Documentation + BRD traceability | 5/5 | FDR v2 + matrix/index sync + `check:documentation-drift` exit 0 — Grade A | DoD #14 peer review still `[ ]` for **Complete** promotion |
| Maintainability + Clean Core | 4/5 | typecheck, boundaries, foundation-disposition exit 0 — Grade A | `pnpm ci:biome` exit 1 (repo-wide import-order debt outside PKG007 scope) |
| **Total (audit-adjusted)** | **29/30** | **~9.7 / 10 equivalent** — gate-critical floor exceeded | Slice 4 Evidence-sync 2026-06-25 |
| **Total (evidence-qualified ceiling)** | **29/30** | Aligns with audit-adjusted; waivers reconfirmed | Not final 9.5 until DoD #14 + `[Complete]` status |

Target at Complete: **29/30** per enterprise 9.5 benchmark ([ENTERPRISE-BENCHMARK.md §3](../../../.cursor/skills/write-fdr/ENTERPRISE-BENCHMARK.md)).

## §Clean Core classification

| Level | Meaning | Allowed for gate-critical? |
| --- | --- | --- |
| A | Registry-driven, public contracts, no local authority, no private imports | Yes |
| B | Approved extension boundary, dependency registered, no duplicated constants | Yes |
| C | Tactical workaround, bounded and tracked | No, unless ADR waiver |
| D | Local hack, duplicate constants, private import, undocumented runtime behaviour | No |

**This FDR: Level B** — system-admin domain at approved `apps/erp` boundary; section IDs and permission keys owned in `system-admin-sections.ts`; mutation audit entries owned in `system-admin-mutation-audit.registry.ts` with governance mirror — no duplicated local permission constants.

**Rule: gate-critical FDRs must be Clean Core A or B.**

## §Impact analysis

| Consumer package | Import surface | Breaking change? | Clean Core impact |
| --- | --- | --- | --- |
| `apps/erp` (protected routes) | `SYSTEM_ADMIN_SECTIONS`, guard resolvers, server actions | No | B→B |
| `@afenda/permissions` | Upstream — system-admin reads `PERMISSION_REGISTRY.systemAdmin.*` | No | B→B |
| `@afenda/observability` | PKG013 governed mutation registry lists system-admin actions | No | B→B |
| `@afenda/kernel` | Operating context in guard + actions via `resolveActionOperatingContext` | No | B→B |
| Phase 9 gate | Diagnostics page consumes readiness actions | No | B→B |

**Upstream consumers scan:** System Admin is a leaf control plane — no other packages import `apps/erp/src/lib/system-admin/` except via ERP app wiring and governance scripts. Permission keys are consumed from `@afenda/permissions`; audit emission uses ERP observability helpers and PKG013 registry.

**Breaking change assessment:** Section registry is additive — new sections require `SYSTEM_ADMIN_SECTIONS` + page route + nav parity test update.

## §Enterprise acceptance

| SAP control | Oracle control | Afenda gate | DoD # |
| --- | --- | --- | --- |
| SAP Auth objects (SU01/PFCG analog) | Oracle Advanced Controls — role/permission admin | `PERMISSION_REGISTRY.systemAdmin.*` + section guard tests | 17 |
| SAP Security Audit Log (SM20 analog) | Oracle audit policy | `pnpm check:system-admin-mutation-audit` | 1 |
| SAP Solution Manager (SOLMAN) — solution documentation | Oracle FDD — testable acceptance criteria | `pnpm check:documentation-drift` | 9 |
| SAP CTS transport safety | Oracle migration / rollback discipline | §Rollback strategy + git revert procedure | 13 |
| SAP ATC — static quality | Oracle quality standards | `pnpm ci:biome` + `pnpm --filter @afenda/erp typecheck` | 4, 5 |
| SAP namespace / dependency governance | Oracle CEMLI extension registry | `pnpm quality:boundaries` | 3 |
| SAP GRC SoD | Oracle segregation of duties | §SoD evidence + guard denial audit | 17 |
| SAP AIF integration contracts | Oracle REST admin API contracts | Governed internal v1 contracts under `server/api/contracts/system-admin/` | 18 |

**SAP SOLMAN mapping:** System Admin FDR = solution documentation for the ERP administration console — section catalogue, mutation audit registry, gate commands, and runbook mirror SAP Solution Manager transport + security audit documentation for go-live.

**Oracle admin console mapping:** Section RBAC + Advanced Controls audit policy + FDD traceability chain (§BRD → Gherkin → DoD → gate) mirror Oracle Fusion administration and security audit configuration.

## §BRD traceability

> No orphan AC rows. Archive tip-013 provides historical AC; FDR owns delivery verification.

| BRD ref | Acceptance criteria | DoD # | Afenda gate |
| --- | --- | --- | --- |
| internal | Seven admin sections materialize with permission-scoped access | 1 | `system-admin-section-nav-parity.test.ts` |
| internal | Section access denial emits audit evidence | 17 | `guard-system-admin-section.server.test.ts` |
| internal | Every governed mutation registered and audit-wired | 1 | `pnpm check:system-admin-mutation-audit` |
| internal | Settings update action records audit on governed path | 2 | `update-system-admin-settings.action.test.ts` |
| internal | API invite + role assign mutations audit-enabled | 18 | `system-admin-mutation-audit-coverage.test.ts` |
| tip-013 (archive) | System Admin control plane Slices 1–4 | 1 | ERP system-admin test suite |
| internal | Diagnostics readiness refresh emits audit | 2 | `refresh-accounting-readiness-gate-full.action.test.ts` |

## §NFR

| Characteristic (ISO 25010) | Target | Verification |
| --- | --- | --- |
| Functional suitability | Admin sections match registry; mutations audit-evidenced | section nav parity + mutation audit coverage tests |
| Performance efficiency | Section guard is O(1) permission check per request | code review; guard unit tests |
| Compatibility | Section IDs stable; permission keys from central registry | `system-admin-sections.ts` + `PERMISSION_REGISTRY` |
| Security | RBAC on every section; denial audit; tenant-scoped operating context | `guard-system-admin-section.server.test.ts` |
| Reliability | Deterministic guard outcomes; idempotent audit registry checks | guard + coverage tests |
| Maintainability | Biome clean; strict typecheck; 0 local permission constants | `pnpm ci:biome`; `pnpm --filter @afenda/erp typecheck` |
| Usability | Governed admin UX (settings form, audit DataTable, invite wizard) | archive tip-013 UX slices; ERP UI tests |
| Documentation | FDR + index + matrix aligned post-Research | `pnpm check:documentation-drift` |

## §SoD evidence

| Governed mutation | Approver ≠ initiator | Evidence path |
| --- | --- | --- |
| User invite (`system_admin.user.invited`) | waived — Phase 9 gate | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |
| Role assign (`system_admin.membership.role.assigned`) | waived — Phase 9 gate | same |
| Settings update (`system_admin.settings.update`) | waived — Phase 9 gate | same |
| Section access denial (read path) | N/A — authorization denial, not approval workflow | `guard-system-admin-section.server.ts` |

## Depends on

- [`fdr-status-index.md`](../fdr-status-index.md) row **fdr-007-system-admin**
- Registry: `PKG007_ADMIN` read-only snapshot in §Registry link
- Upstream: `@afenda/permissions` (PKG-014) — permission vocabulary
- Upstream: `@afenda/observability` (PKG-013) — governed mutation audit surface
- Sibling: [`fdr-007-operating-context`](%5BNot%20started%5D%20fdr-007-operating-context.md) — operating context required by guard + actions
- Sibling: [`fdr-007-accounting-readiness`](%5BNot%20started%5D%20fdr-007-accounting-readiness.md) — diagnostics section consumes readiness gate
- Archive evidence: [`tip-013-system-admin-control-plane.md`](../../delivery/tips/[Complete]%20tip-013-system-admin-control-plane.md)

## Deliverables

| File | Package | New / Modified |
| --- | --- | --- |
| `docs/delivery/FDR/[status] fdr-007-system-admin.md` | — | Modified per slice |
| `apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts` | `@afenda/erp` | Modified (Implementation slices only) |
| `apps/erp/src/lib/system-admin/system-admin-sections.ts` | `@afenda/erp` | Modified (Implementation slices only) |
| `apps/erp/src/lib/system-admin/guard-system-admin-section.server.ts` | `@afenda/erp` | Modified (Implementation slices only) |
| `apps/erp/src/lib/system-admin/__tests__/system-admin-mutation-audit-coverage.test.ts` | `@afenda/erp` | Modified (Implementation slices only) |
| `scripts/governance/check-system-admin-mutation-audit.mts` | governance | Modified (Implementation slices only) |

## Acceptance gate

- `pnpm --filter @afenda/erp typecheck`
- `pnpm --filter @afenda/erp test:run`
- `pnpm check:system-admin-mutation-audit`
- `pnpm check:documentation-drift`
- `pnpm check:foundation-disposition`
- `pnpm quality:boundaries`
- `pnpm ci:biome`

## Acceptance criteria

```gherkin
Feature: System Admin control plane — RBAC, sections, and governed mutation audit

  Scenario: Actor with section read permission accesses admin section
    GIVEN the actor has permission from @afenda/permissions matching the section readPermissionKey
    AND operating context is resolved via resolveOperatingContext()
    WHEN guardSystemAdminSection is called for a registered sectionId
    THEN the result kind is "allowed"
    AND the section definition matches SYSTEM_ADMIN_SECTIONS

  Scenario: Actor without section permission is denied with audit evidence
    GIVEN the actor lacks the section readPermissionKey from @afenda/permissions
    AND operating context is resolved via resolveOperatingContext()
    WHEN guardSystemAdminSection is called for a protected sectionId
    THEN the result kind is "forbidden"
    AND recordErpAuditEvent emits action "system_admin.section.access_denied"
    AND the supplementary registry entry in system-admin-mutation-audit.registry.ts covers the path

  Scenario: Every registered admin section has a materialized route
    GIVEN SYSTEM_ADMIN_SECTIONS defines seven section entries
    WHEN system-admin-section-nav-parity.test.ts runs
    THEN each section href resolves to an existing page.tsx under system-admin/

  Scenario: Governed API mutations declare audit.enabled contracts
    GIVEN SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES lists invite and role-assign mutations
    AND operating context is resolved via resolveOperatingContext()
    WHEN system-admin-mutation-audit-coverage.test.ts inspects system-admin.contract.ts
    THEN each contractExport has audit enabled with the canonical auditAction
    AND the mutation emits audit evidence via @afenda/observability on success

  Scenario: Governed server actions wire recordActionAudit
    GIVEN SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES lists settings and diagnostics refresh
    AND the actor has permission from @afenda/permissions for the mutation
    AND operating context is resolved via resolveOperatingContext()
    WHEN the server action executes on a governed success path
    THEN recordActionAudit is invoked with the canonical action id
    AND the mutation emits an audit event via @afenda/observability

  Scenario: CI gate proves mutation audit registry completeness
    GIVEN scripts/governance/check-system-admin-mutation-audit.mts enforces PKG007_ADMIN
    WHEN pnpm check:system-admin-mutation-audit runs
    THEN zero violations are reported against system-admin-mutation-audit.registry.ts
```

## Definition of Done

| # | Criterion | Gate | Status |
| --- | --- | --- | --- |
| 1 | Runtime evidence at stated paths | file exists + matrix System Admin row | [x] |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run` | [x] |
| 3 | Boundaries | `pnpm quality:boundaries` | [x] |
| 4 | TypeScript strict | `pnpm --filter @afenda/erp typecheck` | [x] |
| 5 | Biome clean | `pnpm ci:biome` | [ ] |
| 6 | Registry aligned | `pnpm check:foundation-disposition` | [x] |
| 7 | Runtime matrix updated | matrix System Admin row | [x] |
| 8 | fdr-status-index updated | index row | [x] |
| 9 | Drift green | `pnpm check:documentation-drift` | [x] |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 | [x] |
| 11 | NFR baselines documented | §NFR section complete | [x] |
| 12 | Impact analysis complete | §Impact analysis table filled | [x] |
| 13 | Rollback plan present | §Rollback strategy filled | [x] |
| 14 | Peer review | PR approved by Architecture Authority member | [ ] |
| 15 | Clean Core level declared | metadata + §Registry link aligned | [x] |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` | [x] |
| 17 | Security negative path tested | `guard-system-admin-section.server.test.ts` | [x] |
| 18 | Public API compatibility verified | system-admin API contracts stable | [x] |
| 19 | E2E requirement satisfied or waived | §Waivers | [x] |
| 20 | Enterprise readiness score updated | §Enterprise readiness score ≥26 gate-critical | [x] |

## Slices

### Slice 1 — Research (system-admin)

**Status:** Complete (2026-06-25)  
**Prerequisite:** —  
**Type:** Research  
**Risk class:** Low  
**Clean Core impact:** B→B

**Purpose:** Reconcile runtime matrix **implemented** + archive tip-013 + registry `evidence[]` with FDR **Not started**; run baseline gate log; update §Runtime evidence grades, §Remaining gaps, and §Enterprise readiness score. No source edits.

**Outcomes:**

- Closed gap `system-admin-fdr-research-slice-1`
- Closed gap `matrix-fdr-drift` (FDR promoted; matrix row sync deferred to Slice 4)
- Closed gap `system-admin-gate-critical-26` (audit-adjusted **26/30**)
- Baseline gate log — all three registry Research gates exit 0
- Status promoted to **Partially Implemented**
- Slice 2 unblocked for observability alignment

### Slice 2 — Implementation (mutation audit parity + observability alignment)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 1 Complete ✓  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** B→B

**Outcomes:**

- Closed gap `system-admin-observability-alignment` — PKG007↔PKG013 parity test with waiver-documented settings exemption
- Added `system-admin-observability-registry-parity.test.ts` (3 assertions; `@afenda/observability/surface` read-only)
- Extended `system-admin-mutation-audit.registry.ts` with waiver ID + parity test path constants
- Slice 2 gates: typecheck ✓ · boundaries ✓ · foundation-disposition ✓ · documentation-drift ✓ · check:system-admin-mutation-audit ✓ · Field 3 biome ✓
- Known debt: full `test:run` (4 pre-slice failures) · repo-wide `ci:biome` (outside Field 3)

#### Design (internal-guide)

Close `system-admin-observability-alignment` within the PKG007 ERP boundary only: every `SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES` row must have a read-only parity assertion against `GOVERNED_MUTATION_SERVER_ACTION_MODULES` in `@afenda/observability` (settings action remains PKG013 `auditRequired: false` under waiver `system-admin-settings-observability-exempt`; refresh action remains `auditRequired: true`). Extend mutation-audit coverage tests — do not edit `packages/observability/` or governance scripts in this slice. Re-run full §Acceptance gate suite and update FDR §Runtime evidence + §Enterprise readiness score (Observability + Test coverage + Maintainability dimensions).

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-007-system-admin.md

1. Objective    — Prove PKG007 system-admin mutation audit registry parity with PKG013 governed-mutation registry (read-only cross-ref + failure-path audit for settings scaffold); run full PKG007 acceptance gates and attestation.
2. Allowed layer— apps/erp/src/lib/system-admin/
3. Files        —
   apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts
   apps/erp/src/lib/system-admin/__tests__/system-admin-mutation-audit-coverage.test.ts
   apps/erp/src/lib/system-admin/__tests__/system-admin-observability-registry-parity.test.ts
   docs/delivery/FDR/[Partially Implemented] fdr-007-system-admin.md
4. Prohibited   — packages/observability/ edits; scripts/governance/ edits; apps/erp/ paths outside system-admin/; packages/ui/; foundation-disposition.registry.ts; do-not-create-accounting-package; do-not-edit-ui-primitives; do-not-add-local-permission-constants
5. Authority    — ADR-0014 · ADR-0016 · PKG007_ADMIN registry snapshot (§Registry link) · waiver `system-admin-settings-observability-exempt`
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:system-admin-mutation-audit
   pnpm check:foundation-disposition
   pnpm quality:boundaries
   pnpm ci:biome
   pnpm check:documentation-drift
7. Closes       — Gap `system-admin-observability-alignment`; DoD #1 (runtime evidence attested); DoD #2 (test:run); DoD #3 (quality:boundaries); DoD #5 (ci:biome); DoD #6 (check:foundation-disposition); DoD #16 (no duplicated constants); DoD #17 (guard denial audit via test:run); DoD #18 (API contract audit.enabled via coverage test)
8. Evidence     —
   apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts
   apps/erp/src/lib/system-admin/__tests__/system-admin-mutation-audit-coverage.test.ts
   apps/erp/src/lib/system-admin/__tests__/system-admin-observability-registry-parity.test.ts
   apps/erp/src/lib/system-admin/__tests__/guard-system-admin-section.server.test.ts
   apps/erp/src/lib/system-admin/__tests__/update-system-admin-settings.action.test.ts
   apps/erp/src/lib/system-admin/__tests__/refresh-accounting-readiness-gate-full.action.test.ts
9. Attestation  — Observability + audit (PKG007↔PKG013 parity test + mutation audit gate exit 0); Test coverage (full ERP test:run attestation); Maintainability (boundaries + biome + foundation-disposition exit 0); Security (guard denial audit path in test:run)
```

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | `pnpm --filter @afenda/erp test:run` + §Runtime evidence update |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run` |
| 3 | Boundaries | `pnpm quality:boundaries` |
| 5 | Biome clean | `pnpm ci:biome` |
| 6 | Registry aligned | `pnpm check:foundation-disposition` |
| 16 | No duplicated constants / parallel authority | `pnpm check:foundation-disposition` |
| 17 | Security negative path tested | `guard-system-admin-section.server.test.ts` (via test:run) |
| 18 | Public API compatibility verified | `system-admin-mutation-audit-coverage.test.ts` (audit.enabled contracts) |

#### Known debt

- `system-admin-settings-observability-exempt` — PKG013 `auditRequired: false` on settings action remains until `system-admin-org-mutations` (Slice 3) delivers successful mutation path
- `system-admin-audit-pagination` — blue-lane defer to Slice 3+
- `system-admin-matrix-row-sync` — Evidence-sync Slice 4
- DoD #14 peer review — open until Slice 4 closeout
- **Slice 2 repo debt (outside Field 3):** `pnpm --filter @afenda/erp test:run` — 4 failures (`operating-spine-lifecycle.integration.test.ts`, `outbox-mutation.integration.test.ts`, `context-switch.action.test.ts`, `list-visible-system-admin-sections.server.test.ts`); `pnpm ci:biome` — violations in `apps/erp/src/lib/api/authorize-api-route.ts` and other pre-slice paths

### Slice 3 — Implementation (audit pagination + org mutations)

**Status:** Not started  
**Prerequisite:** Slice 2 Complete  
**Type:** Implementation  
**Risk class:** Medium  
**Clean Core impact:** B→B

**Purpose:** Close runtime matrix maintain backlog: `system-admin-audit-pagination`, `system-admin-org-mutations`.

### Slice 4 — Evidence-sync (29/30 closeout)

**Status:** Complete (2026-06-25)  
**Prerequisite:** Slice 2 Complete ✓ · Slice 3 blue-lane items waived (`system-admin-audit-pagination-defer`)  
**Type:** Evidence-sync  
**Risk class:** Low  

**Purpose:** Recalculate §Enterprise readiness to **29/30 audit-adjusted**; run full §Acceptance gate suite; sync runtime matrix System Admin row + fdr-status-index annotation; close `system-admin-29-closeout` and `system-admin-matrix-row-sync`. **Do not** promote FDR to `[Complete]` — DoD #14 peer review remains open.

**Outcomes (delivered 2026-06-25):**

- Closed gap `system-admin-29-closeout` — audit-adjusted **29/30** attested
- Closed gap `system-admin-matrix-row-sync` — matrix row + index annotation synced
- §Waivers reconfirmed (`system-admin-e2e`, `system-admin-sod-phase9`, `system-admin-audit-pagination-defer`); ~~`system-admin-settings-observability-exempt`~~ closed ARCH Slice 5 / FDR Slice 7
- FDR remains **Partially Implemented** pending DoD #14 peer review
- Post-hygiene gate log recorded below (6/7 exit 0; `ci:biome` exit 1 repo-wide debt)

#### Handoff block

```
Handoff from: docs/delivery/FDR/[Partially Implemented] fdr-007-system-admin.md

1. Objective    — Run full §Acceptance gate suite; recalculate §Enterprise readiness to 29/30 audit-adjusted; sync runtime matrix System Admin row and fdr-status-index annotation; close Evidence-sync gaps without promoting FDR to [Complete] (DoD #14 peer review open).
2. Allowed layer— docs-only
3. Files        —
   docs/delivery/FDR/[Partially Implemented] fdr-007-system-admin.md
   docs/delivery/fdr-status-index.md
   docs/architecture/afenda-runtime-truth-matrix.md
4. Prohibited   — packages/**; apps/**; foundation-disposition.registry.ts; FDR rename to [Complete]; do-not-create-accounting-package; do-not-edit-ui-primitives; do-not-add-local-permission-constants
5. Authority    — ADR-0014 · ADR-0016 · PKG007_ADMIN · ENTERPRISE-BENCHMARK §3.2
6. Gates        —
   pnpm --filter @afenda/erp typecheck
   pnpm --filter @afenda/erp test:run
   pnpm check:system-admin-mutation-audit
   pnpm check:documentation-drift
   pnpm check:foundation-disposition
   pnpm quality:boundaries
   pnpm ci:biome
7. Closes       — Gap `system-admin-29-closeout`; Gap `system-admin-matrix-row-sync`; DoD #1; DoD #2; DoD #7; DoD #10; DoD #17; DoD #18; DoD #20
8. Evidence     — Post-hygiene gate log in Slice 4 section; §Runtime evidence table; matrix System Admin row
9. Attestation  — Documentation 5/5; Test coverage 5/5; Enterprise readiness 29/30 audit-adjusted
```

#### Post-hygiene gate log (Slice 4 — 2026-06-25)

| Gate | Exit | Grade |
| --- | ---: | --- |
| `pnpm --filter @afenda/erp typecheck` | 0 | A |
| `pnpm --filter @afenda/erp test:run` | 0 | A (572 tests) |
| `pnpm check:system-admin-mutation-audit` | 0 | A |
| `pnpm check:documentation-drift` | 0 | A |
| `pnpm check:foundation-disposition` | 0 | A |
| `pnpm quality:boundaries` | 0 | A |
| `pnpm ci:biome` | 1 | B — repo-wide import-order/format debt (e.g. `operating-context-integration.test.ts`; outside Slice 4 Field 3) |

#### DoD rows this slice closes

| # | Criterion | Gate |
| --- | --- | --- |
| 1 | Runtime evidence at stated paths | §Runtime evidence + matrix row |
| 2 | Tests pass | `pnpm --filter @afenda/erp test:run` exit 0 |
| 7 | Runtime matrix updated | System Admin row → **29/30 audit-adjusted** |
| 10 | §11 + enterprise attestation | afenda-coding-session §11 Completion Report |
| 17 | Security negative path tested | `guard-system-admin-section.server.test.ts` via test:run |
| 18 | Public API compatibility verified | `system-admin-mutation-audit-coverage.test.ts` via test:run |
| 20 | Enterprise readiness score updated | §Enterprise readiness score **29/30 audit-adjusted** |

**Open after Slice 4:** DoD #5 (`ci:biome` exit 1); DoD #14 (Architecture Authority peer review); Slice 3 implementation gaps (`system-admin-org-mutations`).

## §Rollback strategy

| Slice | Rollback procedure | Upgrade path |
| --- | --- | --- |
| Research | Revert FDR doc + matrix commit | Safe — no runtime change |
| Implementation | `git revert` commits touching `apps/erp/src/lib/system-admin/` or governance scripts; re-run `pnpm check:system-admin-mutation-audit` | Quarterly-release-safe; no hand-edited registry objects |
| Evidence-sync | Revert status prefix rename + index row | Restore Partially Implemented; re-run drift guard |

SAP analog: transport rollback = git revert + gate re-run. Oracle analog: confirm upgrade-safe — mutation audit registry remains authoritative; no silent removal of audit wiring.

## §Waivers

| Waiver ID | Requirement waived | Reason | Approver | Expiry / revisit |
| --- | --- | --- | --- | --- |
| `system-admin-sod-phase9` | Approver ≠ initiator on admin mutations | Phase 9 gate defers SoD to accounting readiness sign-off | Architecture Authority | [`phase-9-accounting-readiness-sign-off.md`](../../architecture/phase-9-accounting-readiness-sign-off.md) |
| ~~`system-admin-settings-observability-exempt`~~ | ~~PKG013 `auditRequired: false` on settings action~~ | **Closed** — ARCH-ADMIN-001 Slice 5 + FDR Slice 7 evidence-sync | Architecture Authority | Closed 2026-06-25 |
| `system-admin-e2e` | Browser E2E for admin console | Unit + integration + governance gate prove control plane | Architecture Authority | External beta go-live |
| `system-admin-audit-pagination-defer` | Paginated audit list in Slice 1 | Blue-lane maintain backlog per runtime matrix | Architecture Authority | Slice 3 or Maintain Only |

## §Knowledge transfer

### Operational runbook

- Section authority: `apps/erp/src/lib/system-admin/system-admin-sections.ts` — `SYSTEM_ADMIN_SECTIONS`, `getSystemAdminSection()`
- RBAC guard entry: `apps/erp/src/lib/system-admin/guard-system-admin-section.server.ts` — `guardSystemAdminSection()`
- Visible nav: `apps/erp/src/lib/system-admin/list-visible-system-admin-sections.server.ts`
- Mutation audit registry (ERP): `apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts`
- Mutation audit registry (governance): `scripts/governance/system-admin-mutation-audit-registry.mts`
- Enforcement: `scripts/governance/lib/system-admin-mutation-audit-enforcement.mts`
- CI gate: `pnpm check:system-admin-mutation-audit`

### Observability

- Governed mutation audit surface rule: `system-admin-governed-mutations-emit-audit-evidence`
- API mutations: `SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES` → `system-admin.contract.ts` with `audit.enabled: true`
- Server actions: `SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES` → `recordActionAudit` in `*.action.ts`
- Denial paths: `SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES` → `recordErpAuditEvent`
- PKG013 cross-package registry: `packages/observability/src/surface/governed-mutation-audit-registry.ts`
- Coverage test: `apps/erp/src/lib/system-admin/__tests__/system-admin-mutation-audit-coverage.test.ts`
- Audit list (read): `apps/erp/src/lib/system-admin/list-recent-audit-events.server.ts`

### On-call escalation

- Symptom: admin section 403 but actor expects access → verify `readPermissionKey` in `SYSTEM_ADMIN_SECTIONS` vs granted keys; run `guard-system-admin-section.server.test.ts`
- Symptom: mutation audit gate fails → run `pnpm check:system-admin-mutation-audit`; inspect diff against `system-admin-mutation-audit.registry.ts`
- Symptom: section missing from nav → run `list-visible-system-admin-sections.server.test.ts` + section nav parity test
- Owner: `@afenda/erp` (PKG-007) via `system-admin-agent`

## §Enterprise benchmark qualification

This FDR is **gate-critical Evidence-sync attested at 29/30 audit-adjusted**, not final **Complete — enterprise 9.5 accepted**, because DoD #14 peer review remains open and `pnpm ci:biome` exit 1 (repo-wide hygiene debt).

The **29/30 evidence-qualified ceiling** is accepted only under these bounded assumptions:

1. Browser E2E is waived until external beta go-live (`system-admin-e2e`).
2. ~~Settings action PKG013 observability exemption~~ — **closed** (ARCH-ADMIN-001 Slice 5; invite resend/revoke registered Slice 7).
3. Phase 9 SoD deferral on admin mutations remains valid (`system-admin-sod-phase9`).
4. **Complete** status requires Architecture Authority peer review, full acceptance gate suite, and matrix/index sync at PR merge.

The **29/30 audit-adjusted** score is attested by Slice 4 post-hygiene gate log (6/7 exit 0): full ERP `test:run` (572 tests), mutation audit gate, matrix/index sync, and documentation drift green. Capped at 29/30 (not 30/30) by `ci:biome` exit 1 and open DoD #14 peer review.

Until DoD #14 and Slice 4 closeout complete, this FDR must not be represented as fully **Complete** or as final **enterprise 9.5 accepted**.

**Promotion to Complete — enterprise 9.5 accepted requires:**

1. Architecture Authority peer review approval (DoD #14).
2. All §Acceptance gate commands exit 0 (including `test:run`, `quality:boundaries`, `ci:biome`).
3. Confirmation that §Waivers remain valid at merge time.
4. FDR filename/status/index + runtime matrix row promotion to `[Complete]`.

## Verdict

**Partially Implemented — gate-critical Slice 4 Evidence-sync complete at 29/30 audit-adjusted, pending Architecture Authority peer review (DoD #14) and `ci:biome` repo hygiene before `[Complete]` promotion.**

Research Slice 1 is complete (2026-06-25). Slice 2 closed PKG007↔PKG013 observability alignment. Slice 4 ran full §Acceptance gates (6/7 exit 0), recalculated enterprise readiness to **29/30 audit-adjusted**, and synced runtime matrix + fdr-status-index annotations.

Do not represent this FDR as **enterprise 9.5 complete** or rename to `[Complete]` until DoD #14 peer review closes and `pnpm ci:biome` exit 0.
