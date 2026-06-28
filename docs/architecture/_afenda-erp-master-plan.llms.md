---
title: Afenda ERP — LLM Development Master Plan
version: 5.0.0
date: 2026-06-24
role: roadmap-and-llm-operating-rules
canonical: true
supersedes:
  - v4.0.0 Section 3 "Implementation reality audit (2026-06-20)" — STALE; see Runtime Truth section
  - v4.0.0 Section 5.2 Track B status table — STALE; see Runtime Truth section
  - v4.0.0 Section 8 execution order — superseded by pre-accounting-foundation-roadmap.md
  - Platform vision authority — superseded by afenda-platform-north-star.md (ADR-0026)
  - Package/domain decomposition — superseded by afenda-architecture-blueprint.md (ADR-0026)
authority_order:
  - docs/adr/
  - docs/architecture/afenda-platform-north-star.md
  - docs/architecture/afenda-architecture-blueprint.md
  - docs/architecture/*-registry.md
  - docs/PAS/
  - docs/architecture/pre-accounting-foundation-roadmap.md
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
  consumption: Governed UI — zero className on @afenda/ui in consumers
---

# Afenda ERP — LLM Development Master Plan v5

> **Purpose:** Delivery roadmap pointer, UI foundation status, and AI implementation rules — **not** platform vision or package decomposition authority.
> **Platform vision:** [`afenda-platform-north-star.md`](afenda-platform-north-star.md) (ADR-0026)
> **Package/domain map:** [`afenda-architecture-blueprint.md`](afenda-architecture-blueprint.md) (ADR-0026)
> **Delivery authority:** [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) (ADR-0013)
> **Runtime evidence:** [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md)
> **Not authoritative for:** PAS scope, package ownership, dependency edges — use Blueprint, registries, and ADRs.

---

## ⛔ Do not use stale delivery authority

Do not use older roadmap sections as delivery authority if they conflict with:

1. **ADR-0009–0013** (Accepted — documentation and foundation gates)
2. [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) — **status source of truth**
3. [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) — **delivery sequence**
4. [`pas-status-index.md`](../PAS/pas-status-index.md) — PAS slice closure registry

Master plan v5 **supersedes** v4 Section 3, v4 Track B status table, and v4 Section 8 execution order.

**AI agents must read (in order):** [North Star](afenda-platform-north-star.md) → [Architecture Blueprint](afenda-architecture-blueprint.md) → pre-accounting roadmap → runtime truth matrix → [`docs/PAS/`](../PAS/README.md) → disposition registry.

---

## ⚠️ No Accounting Coding Before Foundation Gate

**Binding rule (ADR-0010):** Accounting Core (`Foundation phase 13+`, `@afenda/accounting`, ledger/journal/posting/consolidation logic) is **prohibited** until Foundation Phases 0–8 complete and **Phase 9 Accounting Readiness Gate** passes.

See: [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) Phase 9.

---

## LLM operating rules

1. Treat **ADR > PAS > Registry > Pre-accounting Roadmap > this plan** when they conflict.
2. Preserve identifiers: `PAS-###`, `Foundation phase 00`, `UI phase ##`, `DEC-###`, `PKG-###`, `ADR-####`.
3. **Governance contracts ≠ implementation.** Label explicitly: "Complete (authority only)" vs "Complete (runtime proven)".
4. **Runtime truth before roadmap updates** (ADR-0009). Read the runtime matrix before starting work.
5. **Evidence-backed status only** (ADR-0012). Every complete/missing claim needs file/test/script proof.
6. For coding tasks: state §0 execution contract (`.cursor/skills/afenda-coding-session/SKILL.md`); stay inside governed package boundaries.
7. Public contracts must be **serializable and boundary-safe** — no class instances, functions, or React nodes crossing package boundaries.
8. When delivery doc filenames disagree with ADR-0001, **ADR-0001 wins**.
9. **Never skip to Foundation phase 13+** because UI or governance "looks done" — pass Phase 9 gate first.

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
| `@afenda/appshell` | Hardcoded hex only | **Implemented** — governed CSS + authority contracts | `afenda-appshell.css`, 93 `.tsx`, `src/contracts/` (Foundation phase 06 Complete) |
| `apps/erp` | Minimal inline auth | **Implemented** — platform spine + System Admin MVP + UI phase 5 surfaces | 199+ TS/TSX, manifest routes, governed APIs, Slices 1–12 |
| UI phase 1/02 | Not started | **Complete** | Delivery docs + runtime |
| UI phase 3/04/05 | Not started | **Complete** | Slices 1–12 delivered; Phase 6 gate evidence |
| Foundation phase 07/012 multi-tenancy | Not started | **Complete (foundation)** | Slices A–G delivered; tenant RLS artifact + live gates |
| Kernel contexts | 6 missing | **Implemented (contracts)** | `context-registry.ts` — 10 required modules |
| Foundation phase 11 outbox | Missing | **Complete** | Outbox schema + publish worker + ERP proof |
| Foundation phase 12 spine | Partial | **Complete** | Lifecycle test + outbox on dashboard PUT |
| Foundation phase 10 API contracts | Missing | **Complete** | Registry, method policy, idempotency, pagination |
| Foundation phase 07 manifest | Missing | **Complete** | Entitlements → nav → ERP routes + guard |
| System Admin | Missing | **Complete (MVP)** | `system-admin` layout + pages + governed APIs (Foundation phase 13) |
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
| Governance contracts = done | Contracts define ownership; **PAS slices deliver working software** |
| Multi-company deferred to scale phase | **Foundational before accounting** (ADR-0011) |
| Big-bang launch | Feature flags + checkpoint gates |

---

## 2. Authority and source index

| Need | Read first |
| --- | --- |
| Constitutional decisions | [`docs/adr/README.md`](../adr/README.md) |
| Pre-accounting delivery sequence | [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md) |
| Runtime evidence | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |
| Phase 1 PAS definitions | [`ADR-0001`](../adr/ADR-0001-phase-1-foundation-redefinition.md) |
| Accounting prohibition | [`ADR-0010`](../adr/ADR-0010-no-accounting-before-foundation-gate.md) |
| Package / layer / dependency truth | [`docs/architecture/README.md`](README.md) |
| Canonical vocabulary | [`glossary.md`](glossary.md) |
| Multi-tenancy implementation | [`multi-tenancy.md`](multi-tenancy.md) |
| Completed slice evidence | [`docs/PAS/`](../PAS/README.md) |
| AI change boundaries | [`docs/ai/`](../ai/) + `@afenda/ai-governance` |
| Governed UI UI consumption | [`docs/governance/governed-ui-policy.md`](../governance/governed-ui-policy.md) |
| Machine enforcement | `@afenda/architecture-authority` |

---

## 3. Pre-accounting foundation sequence

**Delivery authority:** [`pre-accounting-foundation-roadmap.md`](pre-accounting-foundation-roadmap.md)

```text
Phase 0  Documentation truth reset (Foundation phase 00–D)     ← Complete
Phase 1  Architecture authority (Foundation phase 06, 007, 008) ← Track A closeout (008B map done)
Phase 2  Platform runtime spine (outbox, Foundation phase 12)   ← Complete
Phase 3  Security & permission spine (Foundation phase 10)      ← API RBAC Complete
Phase 4  Database & migration governance (RLS proof) ← CURRENT
Phase 5  API contract governance                    ← Complete (Foundation phase 10)
Phase 6  Design / UI / AppShell / Metadata UI       ← Complete (UI phase 3/04/05)
Phase 7  Feature manifest & module governance       ← Complete (Foundation phase 07)
Phase 8  System Admin control plane                 ← MVP Complete (Foundation phase 13)
Phase 9  ACCOUNTING READINESS GATE ──► Foundation phase 14+ only after pass
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

## 5. Foundation PAS status (evidence-backed, 2026-06-24)

### 5.1 Track A — Governance & platform

| PAS | Title | Status | Evidence | Gap |
| --- | --- | --- | --- | --- |
| Foundation phase 01 | Architecture Authority | **Complete** | CI gates, registries | — |
| Foundation phase 02 | AI Governance | **Complete** | ADR-0007 | — |
| Foundation phase 03 | Design System Authority | **Complete (authority)** | Contracts, token registry | No runtime UI (by design) |
| Governed UI | Design System Contracts + UI consumption | **Complete** | Governed UI policy, ui-guard | — |
| Foundation phase 05 | Metadata Authority | **Complete (authority)** | `@afenda/ui-composition` | — |
| Foundation phase 06 | AppShell Authority | **Complete** | 93 `.tsx`, CSS, blocks, `src/contracts/` | — |
| Foundation phase 07 | ERP Platform Authority | **Complete** | Platform entity barrel + drift tests | — |
| Foundation phase 07 | Feature Manifest Governance | **Complete** | Manifest → nav → ERP routes | — |
| Foundation phase 08 | Enterprise Hierarchy Authority | **Complete** | Entity group + ownership + consolidation resolver | Maintain only |
| Foundation phase 08 | Business Master Data Authority | **Partial** | Glossary + dependency registry map | Domain package runtime |
| Foundation phase 09 | Monorepo & CI/CD | **Complete** | Turborepo, `pnpm quality` | — |
| Foundation phase 10 | Identity & Authorization | **Complete** | Full internal v1 route matrix + system-admin RBAC | Session→context on non-API surfaces |
| Foundation phase 10 | API Contract Governance | **Complete** | Registry, method policy, idempotency, pagination | Durable idempotency store |
| Foundation phase 11 | Execution Foundation | **Complete** | Outbox schema + publish worker + Trigger.dev **20260623.1** | — |
| Foundation phase 12 | ERP Operating Spine | **Complete** | Spine helper + lifecycle test + outbox on dashboard PUT | — |
| Foundation phase 13 | System Admin Control Plane | **Complete (MVP)** | Layout + pages + governed admin APIs | Audit pagination; settings mutations |
| Foundation phase 30 | Project Membership Scope | **Complete** | `projects` + `teams` + RLS scope | PM domain logic |

### 5.2 Track B — UI implementation

| PAS | Title | Status | Evidence | Gap |
| --- | --- | --- | --- | --- |
| UI phase 1 | CSS Pipeline | **Complete** | `globals.css`, tokens.css | — |
| UI phase 2 | Component Library | **Complete** | 58 components, tests | ADR-0008 ref-as-prop deferred |
| UI phase 3 | AppShell Token Migration | **Complete** | `afenda-appshell.css`; ERP shell closeout test | — |
| UI phase 4 | Metadata-UI Renderers | **Complete** | Section renderers + `/metadata-workspace` | — |
| UI phase 5 | ERP App Surfaces | **Complete** | Slices 1–12; DoD #1–24 closed | — |
| UI phase 6 | React 19 ref-as-prop | **Blocked** | ADR-0008 Proposed | Package-wide batch not started |

### 5.3 Delivery doc hygiene (synced Foundation phase 00 — 2026-06-24; **STALE index names**)

Historical: TIP status index retired 2026-06-27. Active closure registry: [`pas-status-index.md`](../PAS/pas-status-index.md).

---

## 6. UI technology decisions (binding)

| Concern | Decision | Status |
| --- | --- | --- |
| CSS methodology | Tailwind v4 — `@import "tailwindcss"`, CSS-first `@theme` | **Live** |
| Component primitives | shadcn/ui in `packages/ui/src/components/` | **Live** |
| Token → CSS bridge | `tokenRegistry` → `tokens.css` → `--token-*` | **Live** |
| App styling entry | `apps/erp/src/app/globals.css` | **Live** |
| AppShell styling | `afenda-appshell.css` + Governed UI governed props | **Live** |
| Consumer className rule | Zero `className` on `@afenda/ui` in consumers | **Enforced** — `pnpm ui:guard` |
| Component styling | Governed props + author-layer governance | **Live** |

---

## 7. Accounting Readiness Gate (Phase 9)

Replaces v4 "Phase 1 exit gate" language. **All** must pass before **Foundation phase 14+ Accounting Core**.

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

## 8. ERP operating spine (Foundation phase 12)

Every future ERP module must execute through this lifecycle. No bypass.

```text
Validation
  → Authorization      (@afenda/permissions)
  → Policy             (policy engine)
  → Execution          (domain service)
  → Audit              (@afenda/database audit + @afenda/observability)
  → Observability      (pino + correlation ID)
  → Event publication  (outbox → @afenda/execution)   ← IMPLEMENTED (Foundation phase 11 + Foundation phase 12)
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

> v4 listed PermissionContext, AuditContext, ApprovalContext, MetadataContext, FeatureFlagContext, EntitlementContext, CorrelationContext as "Missing" — **superseded**. Audit/approval/metadata/feature/entitlement concerns are distributed across `@afenda/observability`, `@afenda/permissions`, `@afenda/ui-composition`, `@afenda/feature-flags`, `@afenda/entitlements`, and ERP runtime — not separate kernel context files.

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

1. **Update runtime matrix** when a Foundation PAS changes status.
2. **Update delivery doc** in the same PR as implementation evidence.
3. **Never mark Complete** without acceptance criteria + file paths.
4. **Re-audit master plan** when matrix age exceeds 14 days without update.
5. **Record missing directories** — do not invent `docs/tip/` or `docs/roadmap/`.
6. **Split authority-only vs runtime-complete** in all PAS statuses.
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

| PAS | Work item | Priority |
| --- | --- | --- |
| Foundation phase 13 | Accounting core contracts | P0 |
| Foundation phase 14 | Chart of accounts | P0 |
| Foundation phase 15 | General ledger & journals | P0 |
| Foundation phase 16 | AP/AR foundation | P0 |
| Foundation phase 17 | Vietnam localization package | P0 |
| Foundation phase 18 | Financial reports | P0 |
| Foundation phase 19 | Inventory → accounting posting | P0 |
| Foundation phase 20 | Sales → accounting posting | P0 |
| Foundation phase 21 | Manufacturing cost flow | P0 |
| Foundation phase 22 | Dashboard v1 | P1 |
| Foundation phase 23 | Outbox domain event pattern | P0 |

**Reserved domain packages:** `@afenda/accounting` (PKG-R01), `@afenda/inventory` (PKG-R02), `@afenda/hrm` (PKG-R03), `@afenda/crm` (PKG-R04), `@afenda/procurement` (PKG-R05). Register via ADR before filesystem creation.

---

## 13. Phase 3 — AI copilot, workflow, polish

| PAS | Work item | Priority |
| --- | --- | --- |
| Foundation phase 24 | AI copilot foundation | P1 |
| Foundation phase 25 | Permission-aware RAG | P0 |
| Foundation phase 26 | AI audit & guardrails | P0 |
| Foundation phase 27 | Predictive signals | P1 |
| Foundation phase 28 | AI draft actions | P1 |
| Foundation phase 29 | Workflow & approval engine | P0 |
| Foundation phase 30 | Project management domain | P1 |
| Foundation phase 31 | Public API & OpenAPI docs | P1 |
| Foundation phase 32 | Implementation documentation | P1 |
| Foundation phase 33 | Product hardening | P0 |

---

## 14. Phase 4 — Scale & market readiness

| PAS | Work item | Priority |
| --- | --- | --- |
| Foundation phase 34 | E-commerce connector layer | P2 |
| Foundation phase 35 | Omnichannel inventory sync | P2 |
| Foundation phase 36 | Multi-company & tenant hardening | P1 — **partially moved to foundation (ADR-0011)** |
| Foundation phase 37 | Managed cloud operations | P1 |
| Foundation phase 38 | Security & performance audit | P0 |
| Foundation phase 39 | Commercial packaging enforcement | P1 |
| Foundation phase 40 | Beta program | P1 |
| Foundation phase 41 | Go-to-market package | P1 |
| Foundation phase 42 | Support & success playbooks | P1 |

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

- Start Foundation phase 13 accounting domain packages (**ADR-0010**)
- Add ledger, journal, COA, posting, or consolidation logic
- Trust v4 Section 3 implementation audit (superseded)
- Mark UI PAS slices complete without checking runtime matrix
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
| DEC-009 | Accounting is first business domain (Foundation phase 13) — **after gate** | P0 |
| DEC-011 | Tailwind v4 + shadcn/ui for component library | P0 |
| DEC-012 | Governance complete ≠ implementation complete | P0 |
| DEC-013 | Multi-level company model is foundational (ADR-0011) | P0 |
| DEC-014 | Runtime truth before roadmap (ADR-0009) | P0 |
| DEC-015 | PAS foundation roadmap is delivery authority (ADR-0013) | P0 |

---

*End of LLM Development Master Plan v5.0.0*
