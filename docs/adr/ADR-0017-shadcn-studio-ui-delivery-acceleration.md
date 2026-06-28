# ADR-0017 — shadcn/studio UI Delivery Acceleration

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-25 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Afenda ERP must ship enterprise-grade UI surfaces (workspace dashboards, system-admin tables and forms, shell chrome widgets) at a pace that matches FDR delivery without sacrificing TIP-004 governance, ADR-0002 layer boundaries, or ADR-0003 dependency discipline.

**shadcn/studio** is an approved external source of copy-and-paste shadcn blocks, templates, and MCP-driven UI generation. The monorepo already integrates it operationally:

- **47** `.tsx` files under `packages/appshell/src/shadcn-studio/blocks/` (29 production block components, plus stories, column defs, and shared utils)
- MCP wrapper at `.cursor/mcp/shadcn-studio.mjs` (upstream `shadcn-studio-mcp@latest`)
- Install registry in `packages/ui/components.json` (`@ss-blocks`, `@ss-components`, `@shadcn-studio`)
- Normalization pipeline via `STUDIO-PATTERN-MAP.md` and `afenda-appshell-studio.css`
- Enforcement via `pnpm ui:guard` (Gates A–G)

However, **no ADR** currently authorizes shadcn/studio as a constitutional delivery acceleration strategy. Authority is fragmented across TIP-004, TIP-006 (AppShell), FDR-001, and the operational guide [`app-ui-component-adaptation-guide.md`](../architecture/app-ui-component-adaptation-guide.md). AI agents (ADR-0007) lack a single inventory of what is available, what is already adapted, and what is prohibited.

A **local reference mirror** exists at `_reference/shadcn-nextjs-admincn-admin-template-1.0.0/` — the shadcn/studio **Next.js Admin Dashboard template v1.0.0** (~639 files, 56 App Router routes). It is **gitignored** (`.gitignore` L75) and must never be imported into runtime code; it serves as an offline visual and route catalog for engineers and agents.

**Risk without this ADR:** teams or agents copy raw Tailwind/className-polluted blocks into `apps/erp`, bypass AppShell authority (TIP-006), or add unregistered dependencies from the reference template stack (`recharts`, `@tanstack/react-table`, `papaparse`, `xlsx`, etc.).

---

## Decision

### 1. Approved acceleration sources

The following sources are **Approved** for Afenda UI delivery acceleration when the mandatory pipeline (§2) is followed:

| Source | Role | Runtime use |
|--------|------|-------------|
| **shadcn/studio MCP** (`shadcn-studio` server) | `/cui`, `/rui`, `/iui`, `/ftc` block discovery and generation | Staging install only → governed promotion |
| **shadcn CLI** (`@ss-blocks/*`, `@ss-components/*`) | Pro block install from `packages/shadcn-studio` cwd | Staging install only → governed promotion |
| **`_reference/` template** | Local offline catalog of Admin Dashboard v1.0.0 | **Read-only** — never import into runtime |
| **shadcnstudio.com** | Online block/template catalog | Discovery; install via MCP or CLI |

Pro license credentials live in `.env.secret` as `SHADCN_STUDIO_ACCOUNT_EMAIL` and `SHADCN_STUDIO_LICENSE_KEY`. They must **never** be committed to tracked files.

### 2. Mandatory promotion pipeline (no bypass)

Every block that reaches production must pass this pipeline in order:

```txt
Discover (_reference catalog / MCP /iui or /cui / adaptation guide §3)
  → Install (packages/shadcn-studio cwd; LICENSE_KEY from .env.secret for Pro blocks)
  → Stage (packages/shadcn-studio/src/blocks/ — raw MCP output; govern before ERP wiring)
  → Normalize (3-question decision filter — see §2.1; STUDIO-PATTERN-MAP lookup)
  → Promote CSS (packages/appshell/src/styles/afenda-appshell-studio.css — reusable patterns only, ≥2 blocks; migrate to css-authority on cutover)
  → Govern block under PAS-005A (@afenda/shadcn-studio inventory)
  → Storybook story + test (*.stories.tsx; *.test.tsx or *.interaction.test.tsx)
  → Wire in apps/erp via @afenda/appshell exports until legacy delete (PAS-005A B42+)
  → pnpm ui:guard:scan → pnpm ui:guard → pnpm ui:guard:proof
```

**Canonical install cwd:** `packages/shadcn-studio` (per `shadcn-studio.config.json` and `packages/shadcn-studio/components.json` — PAS-005A B38+).  
**Legacy cwd:** `packages/ui` — deprecated; do not use for new installs.

### 3. CSS token chain (automatic flow)

Studio blocks consume shadcn and shell intermediaries — not raw `--afenda-*` directly:

```txt
@afenda/design-system (Part A)   → --afenda-*  (source tokens)
@afenda/design-system (Part B)   → --card, --primary, --border, etc.  (shadcn shorthand)
@afenda/appshell                 → --app-shell-*  (shell geometry)
@afenda/appshell-studio          → --app-shell-studio-*  (studio block bridge)
```

**Flows automatically** (no manual per-utility mapping): Part C shadcn utilities, semantic tones
(`text-success`, `text-warning`, `text-info`, `text-destructive`), shadow/z/radius aliases,
and all `--app-shell-studio-*` variables. Detail: [css-bridge-reference.md](../../.cursor/skills/afenda-shadcn-components/css-bridge-reference.md).

Apps import `@afenda/appshell/afenda-appshell.css` only — never `afenda-appshell-studio.css` directly.

### 4. MCP block normalization — 3-question decision filter

For every `className` in MCP-installed block TSX:

1. **Q1 — `@afenda/ui` governed primitive?** → Strip `className`; use governed props.
2. **Q2 — Visual/semantic on plain HTML?** → STUDIO-PATTERN-MAP first; studio CSS if ≥2 blocks; else Afenda semantic Tailwind.
3. **Q3 — Layout/structural on plain HTML wrapper?** → Allowed as-is (`grid`, `flex`, `col-span`).

Canonical detail: [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../.cursor/skills/afenda-shadcn-components/SKILL.md) §2.

### 5. Layer order (ADR-0002)

When adapting studio output, edit in this order:

1. **`apps/erp/`** — route wiring and data fetching only
2. **`apps/storybook/`** — visual verification stories
3. **`packages/appshell/src/shadcn-studio/blocks/`** — governed block components
4. **`packages/ui/`** — primitives only with explicit approval; never keep governed blocks in `packages/ui/src/components/shadcn-studio/blocks/`

### 6. Prohibited (unless ADR-0005 exception)

| Prohibition | Reason |
|-------------|--------|
| Direct copy from `_reference/` or raw MCP output into `apps/erp/` or any runtime path | Bypasses TIP-004 governance |
| Replacing TIP-006 AppShell chrome (`application-shell`, `dashboard-shell`, `dashboard-sidebar` blocks) | Shell authority is frozen |
| Marketing, landing, pricing, eCommerce template pages as ERP surfaces | Wrong product context |
| Auth page variants from template (`login-v*`, `register-v*`, etc.) | Better Auth owns authentication |
| New npm dependencies without ADR-0003 / `dependency-registry.md` entry | Dependency governance |
| `className` on `@afenda/ui` primitives in consumer packages | TIP-004 consumer rule |
| Keeping production governed blocks in `packages/ui/src/components/shadcn-studio/blocks/` | Install artifact policy |

### 7. FDR coupling

| Work type | Owning FDR | Registry entry |
|-----------|------------|----------------|
| Shell chrome, dashboard widgets, search, notifications | FDR-001 shell-composition | `PKG001_APPSHELL` |
| System admin surfaces | FDR-007 system-admin | Per FDR scope |
| RBAC / roles UI | FDR-014 rbac | Per FDR scope |
| Feature-domain surfaces | Owning domain FDR | Per registry |

Studio block slices must copy one §Handoff block from the target FDR into afenda-coding-session Phase 0 before editing.

### 8. Agent execution contract (ADR-0007 + afenda-coding-session)

Every shadcn/studio adaptation coding turn must:

1. Announce afenda-coding-session and state Phase 0 six lines (see Appendix E)
2. Follow `.cursor/rules/shadcn-studio.instructions.mdc` MCP step sequence when MCP is active
3. End with §11 Completion Report including `pnpm ui:guard` evidence when blocks change

Operational detail (candidate tables, pattern recipes): [`app-ui-component-adaptation-guide.md`](../architecture/app-ui-component-adaptation-guide.md).  
**Agent operational authority:** [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../.cursor/skills/afenda-shadcn-components/SKILL.md) (token chain, decision filter, promotion pipeline).  
MCP wiring and toolbar: [`.cursor/skills/shadcn-studio/SKILL.md`](../../.cursor/skills/shadcn-studio/SKILL.md).

---

## Consequences

### Positive

- Single constitutional authority for shadcn/studio acceleration — agents and engineers share one inventory (this ADR + appendices)
- Faster UI iteration via MCP discovery and pre-built Admin Dashboard patterns
- Reuse of 29+ already-governed appshell blocks and `STUDIO-PATTERN-MAP` vocabulary
- Clear rejection rules prevent AppShell and auth authority drift

### Negative / trade-offs

- Pro license cost and credential management (`.env.secret`)
- Normalization labor: **per new block only** — 3-question decision filter + STUDIO-PATTERN-MAP (not bulk migration across existing blocks)
- Dependency registration overhead before datatable/chart blocks (`recharts`, `@tanstack/react-table`, export libs)
- `_reference/` is gitignored — each developer must obtain the template locally; online catalog is the portable source of truth

---

## Acceptance Gate

This ADR is satisfied when:

- [ ] ADR-0017 status is **Accepted** after Architecture Authority review
- [ ] [`docs/adr/README.md`](README.md) index lists ADR-0017
- [ ] Cross-links exist in [`AGENTS.md`](../../AGENTS.md), [`app-ui-component-adaptation-guide.md`](../architecture/app-ui-component-adaptation-guide.md), [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../.cursor/skills/afenda-shadcn-components/SKILL.md), [`.cursor/skills/shadcn-studio/SKILL.md`](../../.cursor/skills/shadcn-studio/SKILL.md)
- [ ] `pnpm check:documentation-drift` passes
- [ ] Any new block adaptation in production passes `pnpm ui:guard` (Gates A–G) per this ADR pipeline

---

## References

- Operational guide: [`docs/architecture/app-ui-component-adaptation-guide.md`](../architecture/app-ui-component-adaptation-guide.md)
- Agent operational authority: [`.cursor/skills/afenda-shadcn-components/SKILL.md`](../../.cursor/skills/afenda-shadcn-components/SKILL.md)
- MCP wiring: [`.cursor/skills/shadcn-studio/SKILL.md`](../../.cursor/skills/shadcn-studio/SKILL.md)
- UI enforcement: [`docs/governance/ui-guard.md`](../governance/ui-guard.md) · [`docs/governance/tip-004-policy.md`](../governance/tip-004-policy.md)
- Pattern map: [`packages/appshell/src/shadcn-studio/STUDIO-PATTERN-MAP.md`](../../packages/appshell/src/shadcn-studio/STUDIO-PATTERN-MAP.md)
- FDR shell: [`docs/PAS/[Partially Implemented] fdr-001-shell-composition.md`](../delivery/FDR/[Partially%20Implemented]%20fdr-001-shell-composition.md)
- Related ADRs: [ADR-0002](./ADR-0002-layer-governance.md) · [ADR-0003](./ADR-0003-dependency-governance.md) · [ADR-0007](./ADR-0007-ai-development-governance.md) · [ADR-0014](./ADR-0014-foundation-disposition-registry.md)
- shadcn/studio docs: https://shadcnstudio.com/docs/getting-started/shadcn-studio-template-nextjs
- MCP onboarding: https://shadcnstudio.com/mcp

---

## Appendix A — `_reference` template route inventory

**Template:** `shadcn-nextjs-admincn-admin-template` v1.0.0  
**Path:** `_reference/shadcn-nextjs-admincn-admin-template-1.0.0/shadcn-nextjs-admincn-admin-template-1.0.0/`  
**Routes:** 56 App Router pages (gitignored local mirror)

| Route | Group | Afenda decision | Notes |
|-------|-------|-----------------|-------|
| `/dashboard/sales` | Dashboard | **Adapt** | KPI cards, charts — partial blocks exist |
| `/dashboard/finance` | Dashboard | **Adapt** | Revenue/metrics patterns |
| `/dashboard/logistics` | Dashboard | **Adapt** | Operational KPI grid |
| `/dashboard/productivity` | Dashboard | **Adapt** | Widget/statistics patterns |
| `/dashboard/campaign` | Dashboard | Reference | Marketing-adjacent; low ERP priority |
| `/dashboard/analytics` | Dashboard | **Adapt** | Chart-heavy; `recharts` dep gate |
| `/dashboard/payments` | Dashboard | **Adapt** | Payment history block exists |
| `/dashboard/ecommerce` | Dashboard | **Rejected** | eCommerce context |
| `/dashboard/orders` | Dashboard | Reference | Order table patterns; domain-specific |
| `/apps/mail` | Apps | Reference | Not core ERP v1 |
| `/apps/chat` | Apps | Reference | Not core ERP v1 |
| `/apps/kanban` | Apps | Reference | `@dnd-kit` dep gate if adapted |
| `/apps/calendar` | Apps | Reference | Scheduling; future module |
| `/apps/contact` | Apps | Reference | CRM-adjacent |
| `/apps/users/list` | Apps | **Adapt** | FDR-007 system-admin user table |
| `/apps/users/view/[id]` | Apps | **Adapt** | FDR-007 user detail tabs |
| `/apps/roles` | Apps | **Adapt** | FDR-014 RBAC |
| `/apps/permissions` | Apps | **Adapt** | FDR-014 RBAC |
| `/pages/user-settings` | Pages | **Adapt** | Settings tabs; form-layout patterns |
| `/pages/user-profile` | Pages | Reference | Profile chrome; lower priority |
| `/pages/empty-state-v1` | Pages | **Adapt** | Zero-data states |
| `/pages/empty-state-v2` | Pages | **Adapt** | Zero-data + CTA |
| `/pages/faq` | Pages | Reference | Help content; not shell block |
| `/pages/pricing` | Pages | **Rejected** | Marketing |
| `/pages/auth/login-v1` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/login-v2` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/login-v3` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/register-v1` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/register-v2` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/register-v3` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/forgot-password-v1` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/forgot-password-v2` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/forgot-password-v3` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/verify-email-v1` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/verify-email-v2` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/verify-email-v3` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/reset-password-v1` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/reset-password-v2` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/reset-password-v3` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/two-steps-v1` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/two-steps-v2` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/auth/two-steps-v3` | Auth | **Rejected** | Better Auth owns auth |
| `/pages/onboarding-v1` | Onboarding | Reference | First-login flows; server-sourced state required |
| `/pages/onboarding-v2` | Onboarding | Reference | Same |
| `/pages/misc/error-page-404` | Error | Reference | ERP error surfaces; wire via apps/erp |
| `/pages/misc/unauthorized-access-401` | Error | Reference | Permission denied UX |
| `/pages/misc/forbidden-403` | Error | Reference | Permission denied UX |
| `/pages/misc/server-error-500` | Error | Reference | Error boundary UX |
| `/pages/misc/maintenance-page` | Error | Reference | Maintenance mode |
| `/datatable` | Forms & Tables | **Adapt** | `@tanstack/react-table` dep gate |
| `/forms/form-layouts/vertical` | Forms & Tables | **Adapt** | System-admin forms |
| `/forms/form-layouts/horizontal` | Forms & Tables | **Adapt** | System-admin forms |
| `/forms/form-layouts/sticky-actions` | Forms & Tables | **Adapt** | Mutation forms |
| `/forms/form-validation` | Forms & Tables | **Adapt** | Zod + RHF patterns |
| `/forms/form-wizard/numbered` | Forms & Tables | **Adapt** | Multi-step invite/role flows |
| `/forms/form-wizard/icons` | Forms & Tables | **Adapt** | Wizard variant |
| `application-shell` / `dashboard-shell` / `dashboard-sidebar` | Layout (MCP blocks) | **Rejected** | TIP-006 AppShell authority |

**Reference template stack** (requires dependency-registry entries before Afenda use): Next 16, React 19, Tailwind v4, `@tanstack/react-table`, `recharts`, `react-hook-form`, `zod`, `motion`, `@dnd-kit/*`, `papaparse`, `xlsx`.

---

## Appendix B — MCP workflow quick reference

| Command | Use when | Afenda constraint |
|---------|----------|-------------------|
| `/iui` | Discover blocks for a new ERP surface | Cross-check adaptation guide §3; collect candidates before install |
| `/cui` | Customize from an existing shadcn/studio block | **Collect all blocks first; install last**; then normalize |
| `/rui` | Refine an existing appshell block | Stay in `packages/appshell/src/shadcn-studio/blocks/` |
| `/ftc` | Figma design → code | Requires Figma MCP; same govern pipeline as `/cui` |

**MCP servers (two roles):**

| Server | Config | Role |
|--------|--------|------|
| `shadcn-studio` | `.cursor/mcp/shadcn-studio.mjs` | Upstream workflows (`/cui`, `/rui`, `/iui`, `/ftc`) |
| `shadcn` | `.cursor/mcp.json` | Registry search, `shadcn add`, audit checklist |

**Toolbar (visual edit):** `pnpm studio:toolbar` (Storybook 6006), `pnpm studio:toolbar:app` (ERP 3000). Start target dev server before toolbar.

**Workflow discipline:** Follow `.cursor/rules/shadcn-studio.instructions.mdc` step sequence without skipping. Complete collection/analysis before install/write phases.

---

## Appendix C — Already-adapted blocks registry

Production block components under `packages/appshell/src/shadcn-studio/blocks/` (as of 2026-06-25). Excludes `*.stories.tsx`, `*.columns.tsx`, `*.utils.tsx`, and shared `.ts` helpers.

| Component | File | Likely MCP / template source |
|-----------|------|------------------------------|
| `AppShellDashboardKpiStat` | `app-shell-dashboard-kpi-stat.tsx` | statistics-component-07 / -08 |
| `AppShellDashboardSparklineStat` | `app-shell-dashboard-sparkline-stat.tsx` | statistics-component-07 |
| `AppShellDashboardRevenueChart` | `app-shell-dashboard-revenue-chart.tsx` | charts-component |
| `AppShellDashboardStatisticsMetrics` | `app-shell-dashboard-statistics-metrics.tsx` | statistics-component-08 |
| `AppShellDashboardStatisticsIncomeCard` | `app-shell-dashboard-statistics-income-card.tsx` | statistics-component-07 |
| `AppShellDashboardStatisticsExpenseCard` | `app-shell-dashboard-statistics-expense-card.tsx` | statistics-component-07 |
| `AppShellDashboardStatisticsLineTrends` | `app-shell-dashboard-statistics-line-trends.tsx` | statistics-component-08 |
| `AppShellDashboardRegionalSales` | `app-shell-dashboard-regional-sales.tsx` | dashboard widgets |
| `AppShellDashboardPaymentHistory` | `app-shell-dashboard-payment-history.tsx` | dashboard/payments view |
| `AppShellDashboardModuleEarnings` | `app-shell-dashboard-module-earnings.tsx` | widgets-component |
| `AppShellDashboardRecentTransactions` | `app-shell-dashboard-recent-transactions.tsx` | dashboard widgets |
| `AppShellDashboardInvoiceTable` | `app-shell-dashboard-invoice-table.tsx` | datatable-component-06 |
| `AppShellDashboardOverflowMenu` | `app-shell-dashboard-overflow-menu.tsx` | dashboard chrome |
| `StatisticsActivityCard` | `statistics-activity-card.tsx` | statistics-component |
| `StatisticsLeadsCard` | `statistics-leads-card.tsx` | statistics-component |
| `StatisticsLineTrendsCard` | `statistics-line-trends-card.tsx` | statistics-component |
| `StatisticsProfileTrafficCard` | `statistics-profile-traffic-card.tsx` | statistics-component |
| `StatisticsRevenueCard` | `statistics-revenue-card.tsx` | statistics-component |
| `AppShellActivityFeed` | `app-shell-activity-feed.tsx` | dashboard-dialog / activity |
| `AppShellActivityDialog` | `app-shell-activity-dialog.tsx` | dashboard-dialog |
| `AppShellSearchDialog` | `app-shell-search-dialog.tsx` | command palette block |
| `AppShellNotificationDropdown` | `app-shell-notification-dropdown.tsx` | shell header block |
| `AppShellContextSwitcher` | `app-shell-context-switcher.tsx` | shell header block |
| `AppShellLanguageDropdown` | `app-shell-language-dropdown.tsx` | shell header block |
| `AppShellProfileDropdown` | `app-shell-profile-dropdown.tsx` | shell header block |
| `AppShellSidebarUserDropdown` | `app-shell-sidebar-user-dropdown.tsx` | shell sidebar block |
| `AppShellMenuTrigger` | `app-shell-menu-trigger.tsx` | shell sidebar block |
| `AppShellModuleWorkspaceChrome` | `app-shell-module-workspace-chrome.tsx` | module workspace layout |
| `SystemAdminReadinessGateMetrics` | `system-admin-readiness-gate-metrics.tsx` | Afenda-native (TIP-013A) |

**Do not re-adapt** blocks listed above. Extend via `/rui` or new sibling blocks when requirements diverge.

---

## Appendix D — Afenda surface → template / MCP mapping

Priority matrix for delivery acceleration. Status reflects runtime evidence as of 2026-06-25.

| Afenda surface | FDR | Template / MCP source | MCP category | Status |
|----------------|-----|----------------------|--------------|--------|
| Workspace dashboard KPIs | FDR-001 | `/dashboard/*` views | `statistics-component` | **Partial** — KpiStat, sparkline, metrics exist |
| Dashboard charts / trends | FDR-001 | `/dashboard/analytics`, `/dashboard/finance` | `charts-component` | **Partial** — revenue chart, line trends exist |
| Dashboard tables | FDR-001 | `/datatable` | `datatable-component` | **Partial** — invoice table exists |
| Shell search / notifications | FDR-001 | template header blocks | `application-shell` sub-blocks | **Delivered** — search, notification, context switcher |
| System admin readiness gate | FDR-007 | Afenda-native | — | **Delivered** — readiness gate metrics |
| System admin user table | FDR-007 | `/apps/users/list` | `datatable-component` | **Candidate** — dep registry for TanStack Table |
| System admin settings / forms | FDR-007 | `/pages/user-settings`, `/forms/*` | `form-layout`, `multi-step-form` | **Candidate** — admin tabs under ARCH-ADMIN-001 |
| User settings self-service | FDR-007 · ARCH-USER-001 | `/pages/user-settings` (split) | `account-settings-01/02`, block 06 user | **Delivered** — `/settings/**` Slices 1–12 ✓ · ARCH-USER-001 **Complete** (2026-06-25); email change UI deferred ARCH-AUTH-001 (§15 v2 gap) |
| RBAC roles / permissions UI | FDR-014 | `/apps/roles`, `/apps/permissions` | `datatable-component` | **Candidate** |
| Empty / zero-data states | FDR-007 / feature FDRs | `/pages/empty-state-v*` | `empty-state` | **Candidate** |
| Module workspace chrome | FDR-001 | dashboard layout patterns | `widgets-component` | **Partial** — workspace chrome block |
| Shell sidebar / header / nav | TIP-006 | template `layout/*` | `application-shell`, `dashboard-sidebar` | **Rejected** — AppShell owns chrome |
| Auth pages | — | `/pages/auth/*` | — | **Rejected** — Better Auth |
| Marketing / pricing / eCommerce | — | `/pages/pricing`, `/dashboard/ecommerce` | marketing / ecommerce blocks | **Rejected** |

---

## Appendix E — afenda-coding-session Phase 0 template (studio work)

Copy and fill before any shadcn/studio block edit. Do not start Write/StrReplace until all six lines are answered.

```txt
1. Objective         — <exact block or surface change, one sentence>
2. Allowed layer     — packages/appshell/src/shadcn-studio/blocks/ | apps/erp/src/... | apps/storybook/...
3. Files to change   — <explicit list>
4. Prohibited        — packages/ui/components/ui/* (unless approved); direct _reference import;
                       className on @afenda/ui; unregistered npm deps; AppShell shell replacement
5. Authority         — ADR-0017 · TIP-004 · STUDIO-PATTERN-MAP · FDR-001 (or owning FDR §Handoff)
6. Acceptance gates  — pnpm ui:guard:scan; pnpm ui:guard; pnpm --filter @afenda/appshell test:run;
                       pnpm --filter @afenda/storybook typecheck (if stories added)
```

**After MCP install (before moving to appshell):**

1. Inspect raw output in `packages/ui/src/components/shadcn-studio/`
2. Apply the **3-question decision filter** (Decision §4) to every `className`
3. Map visual patterns → `.app-shell-studio-*` via `STUDIO-PATTERN-MAP.md`
4. Strip all `className` from `@afenda/ui` primitives (Q1)
5. Add Storybook story
6. Run gates above

**Completion Report (Phase 2):** Required per `.cursor/skills/afenda-coding-session/SKILL.md` §11. Include ui:guard pass/fail in drift-prevention table.
