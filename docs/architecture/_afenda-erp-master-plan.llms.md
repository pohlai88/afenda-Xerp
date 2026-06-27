---
title: Afenda ERP — LLM Development Master Plan
version: 5.0.0
date: 2026-06-24
role: strategic-compass-and-roadmap
canonical: true
supersedes:
  - v4.0.0 Section 3 "Implementation reality audit (2026-06-20)" — STALE; see Runtime Truth section
  - v4.0.0 Section 5.2 Track B status table — STALE; see Runtime Truth section
  - v4.0.0 Section 8 execution order — superseded by pre-accounting-foundation-roadmap.md
authority_order:
  - docs/adr/
  - docs/architecture/*-registry.md
  - docs/architecture/pre-accounting-foundation-roadmap.md
  - docs/PAS/slice/[status] tip-*.md
  - packages/architecture-authority
  - this file
phase_1_authority: ADR-0001
accounting_gate: ADR-0010
delivery_authority: ADR-0013
documentation_gate: ADR-0009
accepted_foundation_adrs: ADR-0009 through ADR-0013
ui_technology:
  css: Tailwind v4 (CSS-first)
  components: shadcn/ui on Radix UI in @afenda/ui
  tokens: "@afenda/design-system → CSS custom properties → @theme"
  consumption: TIP-004 — zero className on @afenda/ui in consumers
---

# Afenda ERP — LLM Development Master Plan v5

> **Purpose:** Strategic compass, evidence-based delivery roadmap pointer, UI foundation status, and AI implementation rules.
> **Delivery authority:** [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) (ADR-0013)
> **Runtime evidence:** [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md)
> **Not authoritative for:** TIP scope after ADR-0001, package ownership, dependency edges — use registries and ADRs.

---

## ⛔ Do not use stale delivery authority

Do not use older roadmap sections as delivery authority if they conflict with:

1. **ADR-0009–0013** (Accepted — documentation and foundation gates)
2. [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) — **status source of truth**
3. [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) — **delivery sequence**
4. [`pas-status-index.md`](../PAS/pas-status-index.md) — PAS slice closure registry

Master plan v5 **supersedes** v4 Section 3, v4 Track B status table, and v4 Section 8 execution order.

**AI agents must read (in order):** pre-accounting roadmap → runtime truth matrix → [`docs/PAS/`](../PAS/README.md) → disposition registry.

---

## ⚠️ No Accounting Coding Before Foundation Gate

**Binding rule (ADR-0010):** Accounting Core (`TIP-013+`, `@afenda/accounting`, ledger/journal/posting/consolidation logic) is **prohibited** until Foundation Phases 0–8 complete and **Phase 9 Accounting Readiness Gate** passes.

See: [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) Phase 9.

---

## LLM operating rules

1. Treat **ADR > PAS > Registry > Pre-accounting Roadmap > this plan** when they conflict.
2. Preserve identifiers: `TIP-###`, `TIP-000A`, `TIP-UI-##`, `DEC-###`, `PKG-###`, `ADR-####`.
3. **Governance contracts ≠ implementation.** Label explicitly: "Complete (authority only)" vs "Complete (runtime proven)".
4. **Runtime truth before roadmap updates** (ADR-0009). Read the runtime matrix before starting work.
5. **Evidence-backed status only** (ADR-0012). Every complete/missing claim needs file/test/script proof.
6. For coding tasks: state §0 execution contract (`.cursor/skills/afenda-coding-session/SKILL.md`); stay inside governed package boundaries.
7. Public contracts must be **serializable and boundary-safe** — no class instances, functions, or React nodes crossing package boundaries.
8. When delivery doc filenames disagree with ADR-0001, **ADR-0001 wins**.
9. **Never skip to TIP-013+** because UI or governance "looks done" — pass Phase 9 gate first.

---

## Runtime Truth as of Current Audit (2026-06-24)

> Full audit: [`afenda-documentation-drift-audit.md`](afenda-documentation-drift-audit.md)
> Matrix: [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md)

**v4.0.0 Section 3 is superseded.** The 2026-06-20 audit incorrectly described the codebase as pre-implementation. Below is evidence-backed current state.

| Area | v4 claim | Actual status (2026-06-24) | Evidence |
| --- | --- | --- | --- |
| `@afenda/design-system` | 0 CSS | **Partial** — token/CSS pipeline | `generate-tokens-css.ts`, `dist/css/tokens.css` |
| `@afenda/ui` | Placeholder | **Implemented** — 58 components | `packages/ui/src/components/*.tsx`, 68+ tests |
| `@afenda/metadata-ui` | No renderers | **Implemented** — renderers + production `/metadata-workspace` | `renderers/default-section-renderers.tsx`, 44 `.tsx`, ERP route |
| `@afenda/appshell` | Hardcoded hex only | **Implemented** — governed CSS + authority contracts | `afenda-appshell.css`, 93 `.tsx`, `src/contracts/` (TIP-006 Complete) |
| `apps/erp` | Minimal inline auth | **Implemented** — platform spine + System Admin MVP + TIP-UI-05 surfaces | 199+ TS/TSX, manifest routes, governed APIs, Slices 1–12 |
| TIP-UI-01/02 | Not started | **Complete** | Delivery docs + runtime |
| TIP-UI-03/04/05 | Not started | **Complete** | Slices 1–12 delivered; Phase 6 gate evidence |
| TIP-007/012 multi-tenancy | Not started | **Complete (foundation)** | Slices A–G delivered; tenant RLS artifact + live gates |
| Kernel contexts | 6 missing | **Implemented (contracts)** | `context-registry.ts` — 10 required modules |
| TIP-011 outbox | Missing | **Complete** | Outbox schema + publish worker + ERP proof |
| TIP-012 spine | Partial | **Complete** | Lifecycle test + outbox on dashboard PUT |
| TIP-010A API contracts | Missing | **Complete** | Registry, method policy, idempotency, pagination |
| TIP-007A manifest | Missing | **Complete** | Entitlements → nav → ERP routes + guard |
| System Admin | Missing | **Complete (MVP)** | `system-admin` layout + pages + governed APIs (TIP-013) |
| Accounting Core | Blocked (correct) | **Blocked (correct)** | No `@afenda/accounting` package |

**TypeScript baseline:** `pnpm typecheck` passes. Quality gap is **incomplete foundation gates**, not compile errors.

**Missing doc directories (not invented):** `docs/tip/`, `docs/roadmap/` do not exist.

---

## 1. Product positioning

Afenda is a **Next.js-first, TypeScript-first, AI-governed, manufacturing-focused ERP operating platform** built around accounting trust, permission control, localization, audit evidence, metadata-driven UX, and disciplined delivery gates.

**Target customer:** Manufacturing and operations-heavy enterprises (100–1,000+ employees) in Vietnam and selected regional markets.

**Strategic thesis:** Win by combining manufacturing operations, accounting trust, regional localization, enterprise governance, and safe AI assistance — not disconnected modules or ungoverned automation.

### Binding modernization corrections

| Old / risky assumption | Afenda correction |
| --- | --- |
| Keycloak, Kong, NATS as Phase 1 defaults | Better Auth, Route Handlers, REST/OpenAPI, database outbox, Trigger.dev first |
| Separate AI modules | One domain per module; governed AI assistance embedded inside domains |
| Vietnam rules hardcoded in finance core | Global accounting core + localization package (planned `@afenda/localization-vn`) |
| GraphQL / SDK as default | REST/OpenAPI first |
| AI executes high-risk actions | AI may query, explain, summarize, forecast, draft — not post journals or bypass policy |
| Governance contracts = done | Contracts define ownership; **implementation TIPs deliver working software** |
| Multi-company deferred to scale phase | **Foundational before accounting** (ADR-0011) |
| Big-bang launch | Feature flags + checkpoint gates |

---

## 2. Authority and source index

| Need | Read first |
| --- | --- |
| Constitutional decisions | [`docs/adr/README.md`](../adr/README.md) |
| Pre-accounting delivery sequence | [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) |
| Runtime evidence | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |
| Phase 1 TIP definitions | [`ADR-0001`](../adr/ADR-0001-phase-1-foundation-redefinition.md) |
| Accounting prohibition | [`ADR-0010`](../adr/ADR-0010-no-accounting-before-foundation-gate.md) |
| Package / layer / dependency truth | [`docs/architecture/README.md`](README.md) |
| Canonical vocabulary | [`glossary.md`](glossary.md) |
| Multi-tenancy implementation | [`multi-tenancy.md`](multi-tenancy.md) |
| Completed slice evidence | [`docs/PAS/`](../PAS/README.md) |
| AI change boundaries | [`docs/ai/`](../ai/) + `@afenda/ai-governance` |
| TIP-004 UI consumption | [`docs/governance/tip-004-policy.md`](../governance/tip-004-policy.md) |
| Machine enforcement | `@afenda/architecture-authority` |

---

## 3. Pre-accounting foundation sequence

**Delivery authority:** [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md)

```text
Phase 0  Documentation truth reset (TIP-000A–D)     ← Complete
Phase 1  Architecture authority (TIP-006, 007, 008) ← Track A closeout (008B map done)
Phase 2  Platform runtime spine (outbox, TIP-012)   ← Complete
Phase 3  Security & permission spine (TIP-010)      ← API RBAC Complete
Phase 4  Database & migration governance (RLS proof) ← CURRENT
Phase 5  API contract governance                    ← Complete (TIP-010A)
Phase 6  Design / UI / AppShell / Metadata UI       ← Complete (TIP-UI-03/04/05)
Phase 7  Feature manifest & module governance       ← Complete (TIP-007A)
Phase 8  System Admin control plane                 ← MVP Complete (TIP-013)
Phase 9  ACCOUNTING READINESS GATE ──► TIP-014+ only after pass
```

---

## 4. Four-phase product roadmap (unchanged intent)

| Phase | Objective | Entry requirement |
| --- | --- | --- |
| **P1 — Pre-accounting foundation** | Authority, UI stack, identity, execution, spine, System Admin | Phases 0–9 above |
| **P2 — Accounting core & operational integration** | Global accounting, Vietnam localization, operational postings | Phase 9 gate passed |
| **P3 — AI copilot, workflow, polish** | Governed copilot, approvals, PM, OpenAPI, hardening | Phase 2 gate |
| **P4 — Scale & market readiness** | Connectors, beta, GTM | Phase 3 gate |

---

## 5. Foundation TIP status (evidence-backed, 2026-06-24)

### 5.1 Track A — Governance & platform

| TIP | Title | Status | Evidence | Gap |
| --- | --- | --- | --- | --- |
| TIP-001 | Architecture Authority | **Complete** | CI gates, registries | — |
| TIP-002 | AI Governance | **Complete** | ADR-0007 | — |
| TIP-003 | Design System Authority | **Complete (authority)** | Contracts, token registry | No runtime UI (by design) |
| TIP-004 | Design System Contracts + UI consumption | **Complete** | TIP-004 policy, ui-guard | — |
| TIP-005 | Metadata Authority | **Complete (authority)** | `@afenda/metadata` | — |
| TIP-006 | AppShell Authority | **Complete** | 93 `.tsx`, CSS, blocks, `src/contracts/` | — |
| TIP-007 | ERP Platform Authority | **Complete** | Platform entity barrel + drift tests | — |
| TIP-007A | Feature Manifest Governance | **Complete** | Manifest → nav → ERP routes | — |
| TIP-008A | Enterprise Hierarchy Authority | **Complete** | Entity group + ownership + consolidation resolver | Maintain only |
| TIP-008B | Business Master Data Authority | **Partial** | Glossary + dependency registry map | Domain package runtime |
| TIP-009 | Monorepo & CI/CD | **Complete** | Turborepo, `pnpm quality` | — |
| TIP-010 | Identity & Authorization | **Complete** | Full internal v1 route matrix + system-admin RBAC | Session→context on non-API surfaces |
| TIP-010A | API Contract Governance | **Complete** | Registry, method policy, idempotency, pagination | Durable idempotency store |
| TIP-011 | Execution Foundation | **Complete** | Outbox schema + publish worker + Trigger.dev **20260623.1** | — |
| TIP-012 | ERP Operating Spine | **Complete** | Spine helper + lifecycle test + outbox on dashboard PUT | — |
| TIP-013 | System Admin Control Plane | **Complete (MVP)** | Layout + pages + governed admin APIs | Audit pagination; settings mutations |
| TIP-030 | Project Membership Scope | **Complete** | `projects` + `teams` + RLS scope | PM domain logic |

### 5.2 Track B — UI implementation

| TIP | Title | Status | Evidence | Gap |
| --- | --- | --- | --- | --- |
| TIP-UI-01 | CSS Pipeline | **Complete** | `globals.css`, tokens.css | — |
| TIP-UI-02 | Component Library | **Complete** | 58 components, tests | ADR-0008 ref-as-prop deferred |
| TIP-UI-03 | AppShell Token Migration | **Complete** | `afenda-appshell.css`; ERP shell closeout test | — |
| TIP-UI-04 | Metadata-UI Renderers | **Complete** | Section renderers + `/metadata-workspace` | — |
| TIP-UI-05 | ERP App Surfaces | **Complete** | Slices 1–12; DoD #1–24 closed | — |
| TIP-UI-06 | React 19 ref-as-prop | **Blocked** | ADR-0008 Proposed | Package-wide batch not started |

### 5.3 Delivery doc hygiene (synced TIP-000D — 2026-06-24; **STALE index names**)

Historical: TIP status index retired 2026-06-27. Active closure registry: [`pas-status-index.md`](../PAS/pas-status-index.md).

---

## 6. UI technology decisions (binding)

| Concern | Decision | Status |
| --- | --- | --- |
| CSS methodology | Tailwind v4 — `@import "tailwindcss"`, CSS-first `@theme` | **Live** |
| Component primitives | shadcn/ui in `packages/ui/src/components/` | **Live** |
| Token → CSS bridge | `tokenRegistry` → `tokens.css` → `--token-*` | **Live** |
| App styling entry | `apps/erp/src/app/globals.css` | **Live** |
| AppShell styling | `afenda-appshell.css` + TIP-004 governed props | **Live** |
| Consumer className rule | Zero `className` on `@afenda/ui` in consumers | **Enforced** — `pnpm ui:guard` |
| Component styling | Governed props + author-layer governance | **Live** |

---

## 7. Accounting Readiness Gate (Phase 9)

Replaces v4 "Phase 1 exit gate" language. **All** must pass before **TIP-014+ Accounting Core**.

| Category | Required |
| --- | --- |
| Documentation synchronized | Runtime matrix matches codebase |
| Multi-company hierarchy | Glossary + schema + context resolver proven |
| Operating spine | Full lifecycle including outbox event publication |
| RBAC + audit | Protected mutations gated and audited |
| API contracts | All routes governed |
| System Admin | Minimum viable control plane |
| Feature manifest | Navigation driven by manifest |
| CI | `pnpm check` green |

Full checklist: [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) Phase 9.

---

## 8. ERP operating spine (TIP-012)

Every future ERP module must execute through this lifecycle. No bypass.

```text
Validation
  → Authorization      (@afenda/permissions)
  → Policy             (policy engine)
  → Execution          (domain service)
  → Audit              (@afenda/database audit + @afenda/observability)
  → Observability      (pino + correlation ID)
  → Event publication  (outbox → @afenda/execution)   ← IMPLEMENTED (TIP-011 + TIP-012)
```

**Kernel operating context (`@afenda/kernel`) — registry status:**

| Context | Status | Module |
| --- | --- | --- |
| TenantContext | **Exists** | `tenant-context.contract.ts` |
| EntityGroupContext | **Exists** | `entity-group-context.contract.ts` |
| LegalEntityContext | **Exists** | `legal-entity-context.contract.ts` |
| OwnershipInterestContext | **Exists** | `ownership-interest-context.contract.ts` |
| OrganizationUnitContext | **Exists** | `organization-unit-context.contract.ts` |
| TeamContext | **Exists** | `team-context.contract.ts` |
| ProjectContext | **Exists** | `project-context.contract.ts` |
| OperatingContext | **Exists** | `operating-context.contract.ts` |
| PermissionScopeContext | **Exists** | `permission-scope-context.contract.ts` |
| ConsolidationScopeContext | **Exists** | `consolidation-scope-context.contract.ts` |
| ExecutionContext | **Exists** | `execution-context.contract.ts` |
| Consolidation resolution | **Implemented** | `consolidation-scope-resolution.server.ts` + ERP resolver |

> v4 listed PermissionContext, AuditContext, ApprovalContext, MetadataContext, FeatureFlagContext, EntitlementContext, CorrelationContext as "Missing" — **superseded**. Audit/approval/metadata/feature/entitlement concerns are distributed across `@afenda/observability`, `@afenda/permissions`, `@afenda/metadata`, `@afenda/feature-flags`, `@afenda/entitlements`, and ERP runtime — not separate kernel context files.

---

## 9. Glossary (canonical terms)

Full definitions: [`glossary.md`](glossary.md). Summary for LLM agents:

| Term | Meaning |
| --- | --- |
| **tenant** | SaaS customer isolation boundary; root security/subscription scope |
| **company** | Alias for **legal entity** in schema (`companies` table) |
| **organization** | Use **organization unit** — operational node inside a legal entity |
| **workspace** | Runtime derived operating area — not a database table |
| **holding company** | Entity group parent legal entity anchoring consolidation tree |
| **subsidiary** | Majority-owned legal entity; `relationshipType: subsidiary` |
| **minor interest** | <20% economic ownership; cost method metadata |
| **consolidation unit** | Entity in consolidation scope — scope context only pre-accounting |
| **legal entity** | Registered statutory company; owns books and tax identity |
| **operating entity** | Organization unit or branch — not a separate legal entity unless incorporated |
| **module** | ERP domain surface (e.g., inventory, accounting) — from feature manifest |
| **capability** | Commercial/entitlement gate for a module feature |
| **permission** | RBAC key (e.g., `workspace.dashboard_read`) |
| **policy** | Rule evaluated after permission check |
| **approval** | Workflow gate requiring authorized approver |
| **audit event** | Append-only record: actor, action, target, correlation, result |
| **execution context** | Branded IDs + correlation for jobs and API requests |

---

## 10. Documentation drift prevention rules

1. **Update runtime matrix** when a foundation TIP changes status.
2. **Update delivery doc** in the same PR as implementation evidence.
3. **Never mark Complete** without acceptance criteria + file paths.
4. **Re-audit master plan** when matrix age exceeds 14 days without update.
5. **Record missing directories** — do not invent `docs/tip/` or `docs/roadmap/`.
6. **Split authority-only vs runtime-complete** in all TIP statuses.
7. Run `pnpm quality:delivery-evidence-surface` before foundation phase sign-off.

---

## 11. AI coding session rules

From `.cursor/skills/afenda-coding-session/SKILL.md` — mandatory before any edit:

```text
§0 Execution contract:
1. Objective         — exact change, one sentence
2. Allowed layer     — single package/layer
3. Files to change   — explicit list
4. Prohibited        — packages/files that must NOT be touched
5. Authority         — which authority owns the change
6. Acceptance gates  — verification commands
```

**Anti-drift hard stops:**

- Do not edit `packages/ui` for app-only polish
- Do not invent local tenant resolvers, permission constants, or design tokens
- Do not start accounting schemas or `@afenda/accounting`
- Do not mark roadmap items complete without runtime evidence
- Do not create parallel registries or contracts

**Layer order:** `apps/erp` → Storybook → `@afenda/appshell` / `@afenda/metadata-ui` → `@afenda/ui` (ask first) → platform packages.

**Verification (minimum):**

```bash
pnpm --filter <pkg> typecheck
pnpm ui:guard:scan              # when touching ui/appshell/erp consumers
pnpm test:run                   # or --filter <pkg>
pnpm ci:biome
```

Completion report required per afenda-coding-session §11.

---

## 12. Phase 2 — Accounting core (BLOCKED until Phase 9)

**Blocked by Accounting Readiness Gate (ADR-0010).**

| TIP | Work item | Priority |
| --- | --- | --- |
| TIP-013 | Accounting core contracts | P0 |
| TIP-014 | Chart of accounts | P0 |
| TIP-015 | General ledger & journals | P0 |
| TIP-016 | AP/AR foundation | P0 |
| TIP-017 | Vietnam localization package | P0 |
| TIP-018 | Financial reports | P0 |
| TIP-019 | Inventory → accounting posting | P0 |
| TIP-020 | Sales → accounting posting | P0 |
| TIP-021 | Manufacturing cost flow | P0 |
| TIP-022 | Dashboard v1 | P1 |
| TIP-023 | Outbox domain event pattern | P0 |

**Reserved domain packages:** `@afenda/accounting` (PKG-R01), `@afenda/inventory` (PKG-R02), `@afenda/hrm` (PKG-R03), `@afenda/crm` (PKG-R04), `@afenda/procurement` (PKG-R05). Register via ADR before filesystem creation.

---

## 13. Phase 3 — AI copilot, workflow, polish

| TIP | Work item | Priority |
| --- | --- | --- |
| TIP-024 | AI copilot foundation | P1 |
| TIP-025 | Permission-aware RAG | P0 |
| TIP-026 | AI audit & guardrails | P0 |
| TIP-027 | Predictive signals | P1 |
| TIP-028 | AI draft actions | P1 |
| TIP-029 | Workflow & approval engine | P0 |
| TIP-030 | Project management domain | P1 |
| TIP-031 | Public API & OpenAPI docs | P1 |
| TIP-032 | Implementation documentation | P1 |
| TIP-033 | Product hardening | P0 |

---

## 14. Phase 4 — Scale & market readiness

| TIP | Work item | Priority |
| --- | --- | --- |
| TIP-034 | E-commerce connector layer | P2 |
| TIP-035 | Omnichannel inventory sync | P2 |
| TIP-036 | Multi-company & tenant hardening | P1 — **partially moved to foundation (ADR-0011)** |
| TIP-037 | Managed cloud operations | P1 |
| TIP-038 | Security & performance audit | P0 |
| TIP-039 | Commercial packaging enforcement | P1 |
| TIP-040 | Beta program | P1 |
| TIP-041 | Go-to-market package | P1 |
| TIP-042 | Support & success playbooks | P1 |

---

## 15. Technology stack (binding)

| Layer | Choice |
| --- | --- |
| App | Next.js App Router — `apps/erp` |
| Language | TypeScript strict |
| Database | Supabase Postgres + Drizzle — `@afenda/database` |
| Auth | Better Auth — `@afenda/auth` |
| Authorization | `@afenda/permissions` |
| CSS | Tailwind v4 + design-system tokens |
| Components | shadcn/ui in `@afenda/ui` |
| API | REST / OpenAPI first |
| Jobs | Trigger.dev via `@afenda/execution` |
| Storage | `@afenda/storage` |
| Observability | `@afenda/observability` |
| AI (product) | Vercel AI SDK — governed tool calls |
| AI (development) | `@afenda/ai-governance` |
| Enforcement | `@afenda/architecture-authority` + 30+ quality gates |

---

## 16. Do not do yet

- Start TIP-013 accounting domain packages (**ADR-0010**)
- Add ledger, journal, COA, posting, or consolidation logic
- Trust v4 Section 3 implementation audit (superseded)
- Mark UI TIPs complete without checking runtime matrix
- Add Keycloak, Kong, NATS, GraphQL, or public SDK by default
- Build business modules before operating spine + outbox exist
- Let AI invent packages not in [`package-registry.md`](package-registry.md)
- Use `any`, deep imports, or non-serializable types in public contracts
- Add `className` to `@afenda/ui` primitives in consumer packages

---

## Appendix A — Acceptance criteria pattern

```gherkin
GIVEN a finance manager is signed in under Company A
AND the user has permission accounting.journal.post
AND the accounting period is open
WHEN the user posts the journal
THEN the journal status becomes posted
AND ledger entries are balanced
AND an audit event records actor, company, action, target, correlation ID
```

*(Example for Phase 2 — not executable until Accounting Readiness Gate passes.)*

---

## Appendix B — Key decisions log

| ID | Decision | Priority |
| --- | --- | --- |
| DEC-001 | Target: manufacturing enterprises 100–1,000+ employees | P0 |
| DEC-002 | Open-core + Basic/Pro/Enterprise tiers | P0 |
| DEC-003 | Integrated ERP platform, not disconnected apps | P0 |
| DEC-004 | No separate AI modules | P0 |
| DEC-005 | AI cannot execute high-risk actions without approval | P0 |
| DEC-008 | Phase 1 = pre-accounting foundation (Phases 0–9) | P0 |
| DEC-009 | Accounting is first business domain (TIP-013) — **after gate** | P0 |
| DEC-011 | Tailwind v4 + shadcn/ui for component library | P0 |
| DEC-012 | Governance complete ≠ implementation complete | P0 |
| DEC-013 | Multi-level company model is foundational (ADR-0011) | P0 |
| DEC-014 | Runtime truth before roadmap (ADR-0009) | P0 |
| DEC-015 | TIP foundation roadmap is delivery authority (ADR-0013) | P0 |

---

*End of LLM Development Master Plan v5.0.0*
