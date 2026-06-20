---
title: Afenda ERP — LLM Development Master Plan
version: 4.0.0
date: 2026-06-20
role: strategic-compass-and-roadmap
canonical: true
supersedes:
  - v3.0.0 (governance-only Phase 1; no UI implementation track)
  - Word export v2.0 (Monorepo-first Phase 1 TIP mapping)
  - _afenda-erp-master-plan.llms.txt (removed — duplicate)
authority_order:
  - docs/adr/
  - docs/architecture/*-registry.md
  - docs/delivery/tip-*.md
  - packages/architecture-authority
  - this file
phase_1_authority: ADR-0001
ui_technology:
  css: Tailwind v4 (CSS-first)
  components: shadcn/ui on Radix UI
  tokens: "@afenda/design-system → CSS custom properties → @theme"
---

# Afenda ERP — LLM Development Master Plan v4

> **Purpose:** Strategic compass, corrected delivery roadmap, UI foundation track, and AI implementation prompts.
> **Not authoritative for:** TIP scope after ADR-0001, package ownership, dependency edges — use registries and ADRs.

## LLM operating rules

1. Treat **ADR > Registry > Delivery TIP > this plan** when they conflict.
2. Preserve identifiers: `TIP-###`, `TIP-UI-##`, `DEC-###`, `PKG-###`, `ADR-####`.
3. **Governance contracts ≠ implementation.** A TIP marked "Complete (authority only)" is not a working UI, API, or domain feature.
4. Phase 1 has **two tracks** (Governance + UI Implementation). Both must pass the exit gate before `TIP-013`.
5. For coding tasks: stay inside governed package boundaries; deliver evidence — code, types, tests, audit, permissions, observability, docs, rollout, rollback.
6. Public contracts must be **serializable and boundary-safe** — no class instances, functions, or React nodes in contract types crossing package boundaries.
7. When delivery doc filenames disagree with ADR-0001, **ADR-0001 wins**.

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
| Big-bang launch | Feature flags + checkpoint gates |

---

## 2. Authority and source index

| Need | Read first |
| --- | --- |
| Constitutional decisions | [`docs/adr/README.md`](../adr/README.md) |
| Phase 1 TIP definitions | [`ADR-0001`](../adr/ADR-0001-phase-1-foundation-redefinition.md) |
| Package / layer / dependency truth | [`docs/architecture/README.md`](README.md) |
| Completed delivery evidence | [`docs/delivery/`](../delivery/) |
| AI change boundaries | [`docs/ai/`](../ai/) + `@afenda/ai-governance` |
| Machine enforcement | `@afenda/architecture-authority` |

---

## 3. Implementation reality audit (2026-06-20)

**The v3 plan failed because it conflated governance with delivery.**

| Package | Registry says | Filesystem reality |
| --- | --- | --- |
| `@afenda/design-system` | Design tokens + governance | **0 `.tsx`, 0 CSS** — contracts + token registry only |
| `@afenda/ui` | Shared UI primitives | **Placeholder** — `PACKAGE_NAME` export only |
| `@afenda/metadata-ui` | Metadata rendering | **Contracts + registry only** — no React renderers |
| `@afenda/appshell` | ERP shell | **Real UI** — CSS Modules with hardcoded hex, not design-system tokens |
| `apps/erp` | Primary ERP app | **Minimal** — inline-styled auth, no `globals.css`, no Tailwind, placeholder dashboard |

**TypeScript baseline:** `pnpm typecheck` passes (30/30 tasks). Quality gap is **missing implementation**, not compile errors.

---

## 4. Four-phase roadmap

| Phase | Objective | Exit signal |
| --- | --- | --- |
| **P1 — Platform governance + UI foundation + operating spine** | Authority, working UI stack, identity, execution, spine | Phase 1 exit gate (Section 7) |
| **P2 — Accounting core & operational integration** | Global accounting, Vietnam localization, operational postings | Accounting accuracy + advisor validation |
| **P3 — AI copilot, workflow, polish** | Governed copilot, approvals, PM, OpenAPI, hardening | AI guardrails operational |
| **P4 — Scale & market readiness** | Multi-tenant hardening, connectors, beta, GTM | 3–5 controlled beta customers |

---

## 5. Phase 1 — Two-track model

Phase 1 is split into **Track A (Governance & Platform)** and **Track B (UI Implementation Foundation)**. Both tracks must complete before `TIP-013`.

```text
Track A (Governance & Platform)          Track B (UI Implementation)
─────────────────────────────────        ─────────────────────────────
TIP-001 Architecture Authority ✅        TIP-UI-01 CSS Pipeline
TIP-002 AI Governance ✅                   TIP-UI-02 Component Library
TIP-003 Design System Authority ✅         TIP-UI-03 AppShell Token Migration
TIP-004 Design System Contracts ✅         TIP-UI-04 Metadata-UI Renderers
TIP-005 Metadata Authority ✅              TIP-UI-05 ERP App Surfaces
TIP-006 AppShell Authority ⏳
TIP-007 ERP Platform Authority ⏳
TIP-008 Master Data Authority ❌
TIP-009 CI/CD Foundation ✅
TIP-010 Identity & Authorization ⚠️
TIP-011 Execution Foundation ⚠️
TIP-012 ERP Operating Spine ❌
         │                                         │
         └──────────── Phase 1 Exit Gate ──────────┘
                              │
                              ▼
                        TIP-013 Accounting Core
```

### 5.1 Track A — Governance & platform TIPs

| TIP | Title (ADR-0001) | Status | Packages | Delivery doc | Gap |
| --- | --- | --- | --- | --- | --- |
| TIP-001 | Architecture Authority | **Complete** | `@afenda/architecture-authority` | [`tip-001`](../delivery/tip-001-architecture-authority.md) | Baseline sign-off pending |
| TIP-002 | AI Development Governance | **Complete** | `@afenda/ai-governance` | ADR-0007 | Per-PR `.tip-scope.json` |
| TIP-003 | Design System Authority | **Complete** | `@afenda/design-system` | [`tip-003`](../delivery/tip-003-design-system-authority.md) | Authority only |
| TIP-004 | Design System Contracts | **Complete** | `@afenda/design-system` | [`tip-004`](../delivery/tip-004-design-system-contracts.md) | No CSS/components yet |
| TIP-005 | Metadata Authority | **Complete** | `@afenda/metadata` | [`tip-005`](../delivery/tip-005-metadata-authority.md) | No renderers yet |
| TIP-006 | AppShell Authority | **Pending** | `@afenda/appshell` | [`tip-006`](../delivery/tip-006-appshell-authority.md) | UI exists; contracts missing |
| TIP-007 | ERP Platform Authority | **Pending** | `@afenda/database`, `@afenda/kernel` | [`tip-007`](../delivery/tip-007-erp-platform-authority.md) | Schemas exist; contract map missing |
| TIP-008 | Master Data Authority | **Not started** | — | [`tip-008`](../delivery/tip-008-master-data-authority.md) | No canonical entity contracts |
| TIP-009 | Monorepo & Delivery Foundation | **Complete** | Turborepo, CI | [`tip-009`](../delivery/tip-009-ci-cd-preview.md) | — |
| TIP-010 | Identity & Authorization | **In progress** | `@afenda/auth`, `@afenda/permissions` | *missing* | Engine exists; ERP wiring incomplete |
| TIP-011 | Execution Foundation | **Partial** | `@afenda/storage`, `@afenda/observability`, `@afenda/execution`, `@afenda/database` | *split / mislabeled* | Outbox missing; docs misnumbered |
| TIP-012 | ERP Operating Spine | **Not started** | `@afenda/kernel` | *missing* | Only `ExecutionContext`; 7 contexts missing |

### 5.2 Track B — UI implementation TIPs

| TIP | Title | Status | Packages | Delivery doc | Delivers |
| --- | --- | --- | --- | --- | --- |
| TIP-UI-01 | CSS Pipeline | **Not started** | `@afenda/design-system`, `apps/erp` | [`tip-ui-01`](../delivery/tip-ui-01-css-pipeline.md) | Tailwind v4, `globals.css`, token CSS variables |
| TIP-UI-02 | Component Library | **Not started** | `@afenda/ui` | [`tip-ui-02`](../delivery/tip-ui-02-component-library.md) | shadcn/ui P0 components on design-system tokens |
| TIP-UI-03 | AppShell Token Migration | **Not started** | `@afenda/appshell` | [`tip-ui-03`](../delivery/tip-ui-03-appshell-token-migration.md) | Replace hardcoded hex with CSS variables |
| TIP-UI-04 | Metadata-UI Renderers | **Not started** | `@afenda/metadata-ui` | [`tip-ui-04`](../delivery/tip-ui-04-metadata-ui-renderers.md) | List, Form, Panel, ActionBar React renderers |
| TIP-UI-05 | ERP App Surfaces | **Not started** | `apps/erp` | [`tip-ui-05`](../delivery/tip-ui-05-erp-app-surfaces.md) | Auth pages, module placeholders, error/loading states |

### 5.3 Delivery doc numbering drift

| File on disk | ADR-0001 correct TIP | Treatment |
| --- | --- | --- |
| `tip-010-observability-audit.md` | TIP-011 evidence | Evidence only — rename in hygiene TIP |
| `tip-012-execution-foundation.md` | TIP-011 evidence | Evidence only — rename in hygiene TIP |

---

## 6. UI technology decisions (binding for Track B)

| Concern | Decision | ADR follow-up |
| --- | --- | --- |
| CSS methodology | Tailwind v4 — `@import "tailwindcss"`, CSS-first `@theme` | ADR-0008 (planned) |
| Component primitives | shadcn/ui on Radix UI — source in `packages/ui/src/components/` | ADR-0008 (planned) |
| Token → CSS bridge | `tokenRegistry` → `packages/design-system/src/css/tokens.css` → `--token-*` vars | TIP-UI-01 |
| App styling entry | `apps/erp/src/app/globals.css` | TIP-UI-01 |
| AppShell styling | Migrate `app-shell.module.css` to design-system CSS variables | TIP-UI-03 |
| Component styling | Tailwind utility classes referencing `@theme` tokens — no raw hex in components | TIP-UI-02 |

### TIP-UI-02 component inventory (P0)

| Category | Components |
| --- | --- |
| Shell foundation | `Button`, `Badge`, `Avatar`, `Separator`, `Skeleton`, `Tooltip` |
| Forms | `Input`, `Label`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Form` |
| Data display | `Table`, `DataTable`, `Card`, `ScrollArea` |
| Feedback | `Alert`, `AlertDialog`, `Dialog`, `Sheet`, `Sonner` |

P1 (post-P0 gate): `Breadcrumb`, `Command`, `DropdownMenu`, `Tabs`, `NavigationMenu`, `Accordion`, `Collapsible`, `Popover`, `HoverCard`.

### TypeScript rules for UI packages

1. **Contract types** (`@afenda/design-system`, `@afenda/metadata`) — serializable JSON-safe shapes only.
2. **Component props** (`@afenda/ui`) — explicit interfaces; no `any`; prefer discriminated unions for variants.
3. **Public exports** — only `package.json` export map entrypoints; no deep imports.
4. **Cross-package boundaries** — `@afenda/metadata-ui` renderers depend on `@afenda/ui` + `@afenda/metadata`; never bypass design-system authority.
5. **Server/client split** — mark client components explicitly; keep server-safe types in separate modules where needed.

---

## 7. Phase 1 exit gate (v4)

`TIP-013` may not begin until **all** conditions pass.

### Track A — Governance & platform

| Condition | Required |
| --- | --- |
| TIP-001 through TIP-012 complete | Yes |
| Ownership maps approved | [`ownership-registry.md`](ownership-registry.md) |
| AppShell authority frozen | TIP-006 |
| Platform entity authority frozen | TIP-007 |
| Master data authority frozen | TIP-008 |
| Identity & authorization operational | TIP-010 — protected ERP actions enforced |
| Execution services operational | TIP-011 — Drizzle, storage, observability, Trigger.dev, **outbox** |
| ERP operating spine operational | TIP-012 — protected action lifecycle (Section 9) |

### Track B — UI implementation

| Condition | Required |
| --- | --- |
| CSS pipeline live | `globals.css`, Tailwind v4, design-system token variables |
| `@afenda/ui` P0 components built and exported | TIP-UI-02 |
| AppShell uses design-system tokens | TIP-UI-03 — no hardcoded hex |
| `@afenda/metadata-ui` renderers implemented | TIP-UI-04 — List, Form, Panel, ActionBar |
| ERP auth uses `@afenda/ui` | TIP-UI-05 — no inline styles on auth pages |
| ERP module placeholder surfaces render | TIP-UI-05 — Manufacturing, Inventory, Sales, Accounting, HRM |

---

## 8. Recommended execution order

```text
NOW (parallel governance)
  TIP-006  AppShell Authority
  TIP-007  ERP Platform Authority
  TIP-008  Master Data Authority

NEXT (UI foundation — after TIP-003/004 complete ✅)
  TIP-UI-01  CSS Pipeline
  TIP-UI-02  Component Library

THEN (integration)
  TIP-UI-03  AppShell Token Migration      (needs TIP-006 + TIP-UI-02)
  TIP-UI-04  Metadata-UI Renderers         (needs TIP-UI-02)
  TIP-010    Identity & Authorization      (needs TIP-007)
  TIP-011    Execution Foundation closeout (outbox + doc hygiene)
  TIP-UI-05  ERP App Surfaces              (needs TIP-UI-02/03/04 + TIP-010)
  TIP-012    ERP Operating Spine           (needs TIP-010 + TIP-011)

BLOCKED until exit gate
  TIP-013+   Accounting and all business domains
```

---

## 9. ERP operating spine (TIP-012)

Every future ERP module must execute through this lifecycle. No bypass.

```text
Validation
  → Authorization      (@afenda/permissions)
  → Policy             (policy engine)
  → Execution          (domain service)
  → Audit              (@afenda/observability)
  → Observability      (pino + correlation ID)
  → Event publication  (outbox → @afenda/execution)
```

**Kernel context contracts (`@afenda/kernel`):**

| Context | Status | Owns |
| --- | --- | --- |
| ExecutionContext | **Exists** | Job/request execution metadata |
| PermissionContext | Missing | Actor, tenant, company, permission decision |
| AuditContext | Missing | Actor, target, action, correlation, result |
| ApprovalContext | Missing | Pending approval, policy gate state |
| MetadataContext | Missing | Surface, layout, section resolution |
| FeatureFlagContext | Missing | Flag evaluation for action/module |
| EntitlementContext | Missing | Tier limits, commercial gates |
| CorrelationContext | Missing | Request/job correlation propagation |

---

## 10. Critical gaps (substantial missing work)

### 10.1 Governance gaps

| Gap | Risk | TIP |
| --- | --- | --- |
| AppShell authority contracts | AI invents nav/context/command behavior | TIP-006 |
| ERP platform authority map | Permission/audit boundaries drift | TIP-007 |
| Master data authority | Domains duplicate canonical entities | TIP-008 |
| Operating spine | Each module re-implements auth/audit | TIP-012 |

### 10.2 UI gaps (user-visible)

| Gap | Risk | TIP |
| --- | --- | --- |
| No CSS pipeline | No consistent styling system | TIP-UI-01 |
| No component library | Every page reinvents Button/Input/Table | TIP-UI-02 |
| AppShell hardcoded colors | Visual drift from design-system tokens | TIP-UI-03 |
| No metadata renderers | Metadata-driven ERP surfaces impossible | TIP-UI-04 |
| Inline-styled ERP auth | Unprofessional UX; no design-system compliance | TIP-UI-05 |

### 10.3 Runtime gaps

| Gap | TIP |
| --- | --- |
| Auth ↔ platform actor bridge in `apps/erp` | TIP-010 |
| Permission enforcement on protected routes | TIP-010 |
| Database outbox pattern | TIP-011 |
| Feature flags / entitlements on spine | TIP-012 |

---

## 11. Phase 2 — Accounting core & operational integration

**Blocked by Phase 1 exit gate.**

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

**Phase 2 gate:** Accounting accuracy · Vietnam advisor sign-off · traceable operational postings · complete audit trail.

---

## 12. Phase 3 — AI copilot, workflow, polish

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

## 13. Phase 4 — Scale & market readiness

| TIP | Work item | Priority |
| --- | --- | --- |
| TIP-034 | E-commerce connector layer | P2 |
| TIP-035 | Omnichannel inventory sync | P2 |
| TIP-036 | Multi-company & tenant hardening | P1 |
| TIP-037 | Managed cloud operations | P1 |
| TIP-038 | Security & performance audit | P0 |
| TIP-039 | Commercial packaging enforcement | P1 |
| TIP-040 | Beta program | P1 |
| TIP-041 | Go-to-market package | P1 |
| TIP-042 | Support & success playbooks | P1 |

---

## 14. Technology stack (binding)

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
| Enforcement | `@afenda/architecture-authority` |

---

## 15. Do not do yet

- Start TIP-013 accounting domain packages
- Add Keycloak, Kong, NATS, GraphQL, or public SDK by default
- Build business modules before TIP-012 spine exists
- Mark UI governance TIPs as "done" without Track B implementation
- Let AI invent packages not in [`package-registry.md`](package-registry.md)
- Use `any`, deep imports, or non-serializable types in public contracts

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

---

## Appendix B — Example outbox event contract

```yaml
event: inventory.movement.created
version: 1
producer: inventory-domain
deliveryPattern: outbox
payload:
  tenantId: string
  companyId: string
  movementId: string
metadata:
  actorId: string
  correlationId: string
  idempotencyKey: string
consumers:
  - accounting-posting-worker
processing:
  retryPolicy: exponential_backoff
  maxAttempts: 5
  requiresAuditLink: true
```

---

## Appendix C — Example permission contract

```typescript
export const accountingPermissions = {
  journalRead: "accounting.journal.read",
  journalPost: "accounting.journal.post",
  periodClose: "accounting.period.close",
} as const;

export type AccountingPermissionKey =
  (typeof accountingPermissions)[keyof typeof accountingPermissions];
```

---

## Appendix D — Example UI implementation prompt

```text
Start TIP-UI-02: Component Library.

Goal: Build P0 shadcn/ui components in @afenda/ui wired to design-system tokens.

Deliverables:
- packages/ui/src/components/ui/button.tsx (and P0 set)
- packages/ui/src/lib/utils.ts (cn helper)
- Export map updated in packages/ui/package.json
- Components use Tailwind @theme tokens — no raw hex
- Vitest render tests for Button, Input, Card

Constraints:
- Follow TIP-003/004 design-system authority
- Public props: explicit interfaces, no any
- Only package.json export entrypoints
- Add docs/delivery/tip-ui-02-component-library.md evidence

Expected output: Importable Button, Input, Card from @afenda/ui in apps/erp.
```

---

## Appendix E — Key decisions log

| ID | Decision | Priority |
| --- | --- | --- |
| DEC-001 | Target: manufacturing enterprises 100–1,000+ employees | P0 |
| DEC-002 | Open-core + Basic/Pro/Enterprise tiers | P0 |
| DEC-003 | Integrated ERP platform, not disconnected apps | P0 |
| DEC-004 | No separate AI modules | P0 |
| DEC-005 | AI cannot execute high-risk actions without approval | P0 |
| DEC-008 | Phase 1 = governance + UI foundation + operating spine | P0 |
| DEC-009 | Accounting is first business domain (TIP-013) | P0 |
| DEC-011 | Tailwind v4 + shadcn/ui for component library | P0 |
| DEC-012 | Governance complete ≠ implementation complete | P0 |

---

*End of LLM Development Master Plan v4.0.0*
