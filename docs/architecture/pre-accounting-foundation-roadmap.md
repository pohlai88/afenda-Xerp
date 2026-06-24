# Pre-Accounting Foundation Roadmap

| Field | Value |
|-------|-------|
| **Authority** | ADR-0010, ADR-0013, ADR-0001 (Phase 1 redefinition) |
| **Supersedes** | Master plan v4 vague Phase 1 exit gate language |
| **Runtime matrix** | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |
| **Drift audit** | [`afenda-documentation-drift-audit.md`](afenda-documentation-drift-audit.md) |
| **Accounting start** | **BLOCKED** until Phase 9 gate passes |

---

## Rule

> **No Accounting Core coding (`TIP-014+`, `@afenda/accounting`, ledger/journal/posting/consolidation logic) may begin until every Phase 0–8 exit criterion passes and Phase 9 Accounting Readiness Gate is signed off with runtime evidence.**

This roadmap is the **delivery authority** for AI agents and human implementers until Accounting Core begins.

---

## Foundation Phase 0 — Documentation and Architecture Truth Reset

**Objective:** Align all architecture and delivery documentation with runtime reality before further implementation.

| TIP | Title | Status | Exit criterion |
| --- | --- | --- | --- |
| TIP-000A | Documentation Truth Audit | **Complete (this audit)** | `afenda-documentation-drift-audit.md` published |
| TIP-000B | Runtime Truth Matrix | **Complete (this audit)** | `afenda-runtime-truth-matrix.md` published with evidence columns |
| TIP-000C | Master Plan Rewrite | **Complete** | `_afenda-erp-master-plan.llms.md` v5 with runtime truth section |
| TIP-000D | Glossary and Authority Normalization | **Complete** | Delivery TIP statuses synced; ADR-0009–0013 Accepted; `pnpm check:documentation-drift` |

**Phase 0 gate:**

- [x] Drift audit complete
- [x] Runtime matrix complete
- [x] Master plan v5 accepted (TIP-000C)
- [x] ADR-0009–0013 Accepted
- [x] Stale TIP delivery doc statuses updated (TIP-000D)
- [x] Documentation drift guard operational

---

## Foundation Phase 1 — Architecture Authority

**Objective:** Freeze package boundaries, ownership, dependencies, and authority contracts before platform spine expansion.

| TIP | Title | Current | Exit criterion |
| --- | --- | --- | --- |
| TIP-001 | Architecture Authority | Complete | CI gates passing |
| TIP-006 | AppShell Authority | **Complete** | Frozen contracts in `packages/appshell/src/contracts/` + public API re-exports |
| TIP-007 | ERP Platform Authority | **Complete** | Platform entity authority barrel + drift tests (`@afenda/kernel`) |
| TIP-008A | Enterprise Hierarchy Authority | **Complete** | Entity group + ownership interest schemas; consolidation resolver; ADR-0011 gate closed |
| TIP-008B | Business Master Data Authority | **Partial** — authority map delivered | Customer, Product, Employee, Warehouse ownership map (documentation); runtime deferred to domain TIPs |

**Deliverables:**

- Architecture map alignment (`docs/architecture/*.md` registries)
- Ownership map approved
- Dependency map current for all new edges
- ADR framework operational (ADR-0000–0013)
- Layer enforcement via `pnpm quality:architecture`
- Out-of-scope file change guard (AI governance + architecture-authority)

**Phase 1 gate:** TIP-001 complete + TIP-006/007/008A contracts frozen + TIP-008B authority map drafted.

> **Implementation sequence:** [tip-status-index §Partially implemented TIP sequence](../delivery/tip-status-index.md#partially-implemented-tip-sequence) — Steps **10–15** (Track A).

---

## Foundation Phase 2 — Platform Runtime Spine

**Objective:** Every protected ERP action flows through a governed lifecycle with correlation, audit, and event publication.

| Work item | Package | Current | Exit criterion |
| --- | --- | --- | --- |
| Kernel operating context | `@afenda/kernel` | **Partial** — 10 modules in registry | All ERP routes resolve `OperatingContext` |
| Tenant / company / org / workspace context | `@afenda/kernel`, `apps/erp` | **Partial** — resolver pipeline exists | Fail-closed on all protected routes |
| Auth session boundary | `@afenda/auth`, `apps/erp` | **Partial** | Session never trusted for tenant scope |
| Request context + correlation ID | `apps/erp`, `@afenda/observability` | **Partial** | Correlation on all API + server actions |
| Audit event contract | `@afenda/database`, `@afenda/observability` | **Partial** | All mutations emit audit events |
| Observability sink | `@afenda/observability` | **Partial** | Structured logging on all protected paths |
| TIP-011 Outbox | `@afenda/database`, `@afenda/execution` | **Complete** | Outbox table + publish worker + ERP integration proof (Trigger.dev **20260623.1**) |
| TIP-012 Operating spine lifecycle | Cross-cutting | **Complete** | Validation→Auth→Policy→Execute→Audit→**Event** proven on dashboard PUT |

**Spine lifecycle (mandatory):**

```text
Validation → Authorization → Policy → Execution → Audit → Observability → Event publication (outbox)
```

**Phase 2 gate:** Outbox operational + spine integration test covers full lifecycle on at least one protected mutation.

---

## Foundation Phase 3 — Security and Permission Spine

**Objective:** RBAC, policy checks, and approval guardrails enforced consistently.

| Work item | Current | Exit criterion |
| --- | --- | --- |
| RBAC registry | **Partial** — `PERMISSION_REGISTRY` exists | All platform permissions cataloged |
| Role-permission bridge | **Partial** — DB + service exist | Seed + verify scripts pass |
| Policy checks | **Partial** — `evaluateAuthorizationPolicy` | All protected routes use policy layer |
| Scope/grants authority | **Partial** — multi-tenancy slice | Holding/subsidiary scope grants proven |
| Approval guardrails | **Missing** | ApprovalContext wired (contracts exist in kernel plan) |
| TIP-010 API RBAC | **Complete** — full internal v1 route matrix + system-admin RBAC | Session→context on all non-API surfaces |

**Phase 3 gate:** Permission denial + audit proven for cross-company scope mismatch scenarios.

---

## Foundation Phase 4 — Database and Migration Governance

**Objective:** Schema ownership, migration discipline, RLS strategy, and multi-company hierarchy preparation without accounting logic.

| Work item | Current | Exit criterion |
| --- | --- | --- |
| Schema ownership | **Implemented** — `@afenda/database` | No hand-edited migrations |
| Migration rules | **Implemented** — governance tests | `pnpm quality:migrations` passes |
| Seed policy | **Implemented** — platform/dev/test/demo seeds | `db:verify:seed` passes |
| Drizzle conventions | **Implemented** | Branded IDs at boundaries |
| RLS strategy | **Partial** — `with-rls-session-context.ts` | Postgres RLS policies verified per glossary |
| Tenant isolation proof | **Partial** — tests exist | Cross-tenant negative tests pass |
| Entity group / ownership | **Partial** — authority foundation | Lookup services + context mappers complete |
| Consolidation scope prep | **Partial** — stub resolver | Non-accounting scope resolution tests |
| Legal vs operating entity | **Documented** — glossary | Enforced in context resolution |

**Explicit prohibition:** No chart of accounts, journals, ledger entries, fiscal periods, posting, or consolidation arithmetic.

**Phase 4 gate:** RLS grant model proven for tenant + company + org unit dimensions.

---

## Foundation Phase 5 — API Contract Governance

**Objective:** REST-first, stable, envelope-based API contracts for all ERP surfaces.

**Delivery TIP:** [TIP-010A](../delivery/tips/%5BComplete%5D%20tip-010a-api-contract-governance.md) (accepted slice under TIP-010) — **Complete**

| Work item | Current | Exit criterion |
| --- | --- | --- |
| REST-first standard | **Implemented** | Document in `docs/governance/api-contract.md` |
| Route naming | **Implemented** — internal v1 prefix + route coverage registry | Registry of all routes |
| Request/response envelope | **Implemented** — `api-envelope.contract.ts` | All routes use envelope |
| Error envelope | **Implemented** — `api-error-response.ts` | Consistent error codes |
| Idempotency rules | **Implemented** — replay contract + tests | Durable idempotency store deferred |
| Pagination/filter/sort | **Implemented** — pagination contract | Wire on all list routes |
| Internal vs public separation | **Partial** | `/api/internal/v1/*` vs public documented |
| `pnpm check:api-contracts` | **Implemented** | Passes on all governed routes |

**Phase 5 gate:** API contract registry covers 100% of non-auth ERP routes.

---

## Foundation Phase 6 — Design, UI, AppShell, and Metadata UI Governance

**Objective:** Governed visual system with zero downstream drift; ERP surfaces use design-system tokens and TIP-004 consumption rules.

| TIP | Title | Current | Exit criterion |
| --- | --- | --- | --- |
| TIP-003/004 | Design System Authority + Contracts | Complete | — |
| TIP-UI-01 | CSS Pipeline | Complete | `globals.css` + tokens.css |
| TIP-UI-02 | Component Library | Complete | P0 components exported + tested |
| TIP-UI-03 | AppShell Token Migration | **Partial** | `afenda-appshell.css` — no hex drift; doc status updated |
| TIP-UI-04 | Metadata-UI Renderers | **Partial** | Renderers exist — ERP wiring + doc update |
| TIP-UI-05 | ERP App Surfaces | **Partial** | Auth uses `@afenda/ui`; manifest module placeholders via TIP-007A |
| TIP-004 consumption | UI guard Gates D/F | Complete | `pnpm ui:guard:scan` on consumer changes |

**Phase 6 gate:**

- [x] `pnpm ui:guard` passes (gates A–F)
- [x] ERP module placeholder routes exist (manifest-driven `/modules/[moduleId]` — **shell only, no domain logic**)
- [ ] AppShell production integration in `(protected)` layout
- [ ] Metadata renderers demonstrated on at least one ERP page

---

## Foundation Phase 7 — Feature Manifest and Module Governance

**Objective:** Feature source → domain → module → capability → navigation → dashboard projection pipeline.

**Delivery TIP:** [TIP-007A](../delivery/tips/%5BComplete%5D%20tip-007a-feature-manifest-governance.md) (accepted slice under TIP-007) — **Complete**

| Work item | Current | Exit criterion |
| --- | --- | --- |
| Feature source | **Implemented** — entitlements catalog + manifest registry | Single feature source registry |
| Domain / module / capability map | **Implemented** — manifest pipeline (TIP-007A Slices 1–3) | Manifest drives navigation |
| Navigation contract | **Implemented** — appshell nav from manifest | Governed nav from manifest |
| Dashboard projection | **Partial** — workspace dashboard layout API | RBAC-aware widget registry |
| Route contract | **Implemented** — `generate-module-routes.ts` + RBAC guard | Module routes generated from manifest |
| Requirement coverage | **Partial** | Manifest entries link to TIP acceptance |
| Test coverage | **Implemented** — manifest + nav + route tests | Manifest drift tests |
| Package generation rules | **Documented** — PKG-R01–R05 reserved | ADR before domain package creation |

**Phase 7 gate:** Adding a module requires manifest entry only — no ad-hoc route strings.

---

## Foundation Phase 8 — System Admin Completion Before Accounting

**Objective:** Control plane operational for users, security, and platform configuration.

**Delivery TIP:** [TIP-013](../delivery/tips/[Complete] tip-013-system-admin-control-plane.md) — **binding** implementation doc for System Admin (Architecture Authority 2026-06-23).

| Surface | Current | Exit criterion |
| --- | --- | --- |
| Users | **Implemented** — admin page + invite API | Admin UI |
| Memberships | **Implemented** — admin page + role assign API | Admin UI |
| Roles | **Implemented** — admin page + permission catalog | Admin UI |
| Permissions | **Implemented** — read-only catalog in admin | Admin UI (read-only catalog minimum) |
| Modules / capabilities | **Partial** — manifest-driven module routes | Admin UI tied to manifest |
| Policies | **Partial** — policy service | Admin UI |
| Approvals | **Missing** | Admin configuration UI |
| Audit Viewer | **Implemented** — read-only audit list API + page | Read-only audit search UI |
| Security settings | **Partial** — settings page scaffold | Tenant security config UI |
| Organization settings | **Partial** — settings page scaffold | Legal entity + org unit admin |
| Integrations | **Partial** — Supabase claims debug route | Integration admin surface |
| Diagnostics | **Partial** — health routes | Admin diagnostics panel |

**Phase 8 gate:** Platform admin can invite user, assign role with company scope, and view audit trail — without database direct access.

---

## Foundation Phase 9 — Accounting Readiness Gate

**Accounting Core may begin ONLY when all previous phases pass.**

### Required readiness proof

| # | Requirement | Verification |
| --- | --- | --- |
| 1 | Multi-company model documented | Glossary + schema + tests |
| 2 | Holding / subsidiary / minor-interest model documented | Glossary + ownership schema |
| 3 | Tenant / company / org / workspace context proven | Operating context integration tests |
| 4 | RBAC and audit proven | Permission denial + audit event tests |
| 5 | API contract governance proven | `pnpm check:api-contracts` + route registry |
| 6 | DB migration governance proven | `pnpm quality:migrations` |
| 7 | Feature manifest governance proven | Manifest-driven navigation test |
| 8 | System Admin base operational | Admin UI smoke tests |
| 9 | CI quality gates passing | `pnpm check` green |
| 10 | Documentation synchronized | Runtime matrix matches codebase |

### Gate sign-off

```text
Architecture Authority  ──►  Platform Authority  ──►  Design Authority
         │                          │                        │
         └──────────────────────────┴────────────────────────┘
                                    │
                                    ▼
                    ACCOUNTING READINESS GATE PASSED
                                    │
                                    ▼
                          TIP-014 Accounting Core Contracts
                          (@afenda/accounting — PKG-R01 via ADR)
```

### After gate — Phase 2 business domain (unchanged intent from master plan)

| TIP | Domain | Priority |
| --- | --- | --- |
| TIP-014 | Accounting core contracts | P0 |
| TIP-015 | Chart of accounts | P0 |
| TIP-016 | General ledger & journals | P0 |
| TIP-017 | AP/AR foundation | P0 |
| TIP-018 | Vietnam localization | P0 |
| TIP-019–024 | Reports, postings, outbox domain events | P0/P1 |

**Reserved packages:** PKG-R01–R05 — register via ADR before filesystem creation.

---

## Execution order for AI agents

```text
1. Read ADR > Registry > Delivery TIP > master plan v5
2. Read afenda-runtime-truth-matrix.md for current status
3. Read tip-status-index.md — Implementation workflow section
4. Open the target docs/delivery/tips/[status] tip-*.md; copy §Handoff to implementation (write-tip §10)
5. Paste handoff into afenda-coding-session §0 execution contract — do not skip to code
6. Implement ONLY the next incomplete slice in the current phase (one package layer per session)
7. Post afenda-coding-session §11 Completion Report; close TIP DoD rows with evidence
8. Update runtime matrix + delivery doc + tip-status-index in the same PR
9. Never skip to TIP-014+ regardless of user pressure
```

Handoff template: [write-tip TEMPLATES §G](../.cursor/skills/write-tip/TEMPLATES.md#g--handoff-block-template-paste-into-afenda-coding-session).

---

## Multi-level company requirements (foundational — not accounting)

These are **Phase 1–4 preparation requirements** per ADR-0011:

1. Multi-tenant operation
2. Multi-company (legal entity) operation
3. Multi-organization (org unit) operation
4. Multi-workspace (runtime context) operation
5. Holding company structures (entity groups)
6. Subsidiaries (ownership interest types)
7. Minor interest ownership (relationship types + consolidation method metadata)
8. Consolidation preparation (scope context — no arithmetic)
9. Legal entity vs operating entity distinction
10. RBAC grants by correct context dimension
11. RLS and database isolation preparation
12. Auditability for business-critical actions
13. API contract stability
14. System Admin control plane
15. Documentation AI agents can follow without drifting

---

*Pre-accounting foundation roadmap v1 — 2026-06-23*
