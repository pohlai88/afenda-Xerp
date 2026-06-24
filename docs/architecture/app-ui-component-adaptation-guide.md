# Afenda App UI Component Adaptation Guide

> **This document is guidance for future implementation.**
> It does not approve direct copy-paste from shadcn/studio into runtime code.
> All implementation must pass Afenda UI governance and package-boundary gates.

| Field | Value |
|-------|-------|
| **As-of** | 2026-06-24 |
| **Author** | AI agent — UI Documentation Authoring pass |
| **Authority** | ADR-0002 · TIP-004 · TIP-006 · TIP-UI-05 |
| **Status source** | [`afenda-runtime-truth-matrix.md`](afenda-runtime-truth-matrix.md) |
| **Enforcement** | `pnpm ui:guard` · `pnpm quality:boundaries` · `pnpm check:documentation-drift` |

---

## 1. Purpose

This guide enables future AI coding agents and engineers to:

1. Identify which shadcn/studio components and blocks are suitable for Afenda ERP app adaptation.
2. Understand which layer owns each adapted pattern.
3. Apply the correct visual quality bar (9.5/10 enterprise standard) without triggering UI governance violations.
4. Execute coding quality standards that prevent `className` pollution, design-token drift, and package-boundary violations.
5. Run the correct acceptance gates before shipping any UI implementation.

---

## 2. Authority

| Document | Role |
|----------|------|
| [`ADR-0002`](../adr/ADR-0002-layer-governance.md) | Layer governance — which package owns which responsibility |
| [`ADR-0003`](../adr/ADR-0003-dependency-governance.md) | Dependency governance — new libs need registry entry |
| [`docs/governance/tip-004-policy.md`](../governance/tip-004-policy.md) | UI consumption policy — author vs consumer rules |
| [`TIP-006`](../delivery/tips/%5BComplete%5D%20tip-006-appshell-authority.md) | AppShell authority — contracts frozen, public API fixed |
| [`TIP-UI-02`](../delivery/tips/%5BComplete%5D%20tip-ui-02-component-library.md) | 58 UI primitives live in `@afenda/ui` — no new primitives without governance |
| [`TIP-UI-05`](../delivery/tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md) | ERP app surface delivery — **Complete** (Slices 1–12) |
| [`tip-status-index.md`](../delivery/tip-status-index.md) | Delivery sequence authority — Track C UI surfaces |
| [`dependency-registry.md`](dependency-registry.md) | Approved runtime dependencies |
| [`layer-registry.md`](layer-registry.md) | Approved layer assignments |

**Hard constraints inherited from authority:**

- No pattern may bypass `resolvePrimitiveGovernance()` for any `@afenda/ui` primitive.
- No `className` on governed primitives in consumer packages (`apps/erp/`, `packages/appshell/`, `packages/metadata-ui/`).
- New external libraries require a `dependency-registry.md` entry and ADR-0003 approval before use.
- AppShell shell chrome patterns (`AppShell`, `AppShellMain`, sidebar, nav) are governed by TIP-006. No direct copy of raw shell blocks from shadcn/studio without governance adaptation.

---

## 3. Source Review — shadcn/studio Candidate Evaluation

Sources reviewed via `/iui` (shadcn/studio MCP, 2026-06-24):
- Category: `dashboard-and-application` — all sub-blocks
- Category: `datatable` — all sub-blocks
- Category: `ecommerce` — announcement-banner only
- `/cui` existing appshell blocks: 39 blocks in `packages/appshell/src/shadcn-studio/blocks/`

### Candidate Decision Table

| Candidate | Source | Intended Afenda use | Visual fit | Code fit | A11y fit | Governance risk | Decision |
|-----------|--------|---------------------|:----------:|:--------:|:--------:|-----------------|----------|
| **statistics-component-07** (income/expense area chart cards) | shadcn/studio `/iui` | Workspace dashboard KPI metric cards | 9/10 | 7/10 | 8/10 | Medium — recharts is a new dependency; `className` on Card | **Approved with constraints** |
| **statistics-component-08** (5-metric grid, bar/line charts) | shadcn/studio `/iui` | Workspace KPI grid (5-wide) | 9/10 | 7/10 | 8/10 | Medium — recharts, chart tokens needed | **Approved with constraints** |
| **datatable-component-06** (product table, TanStack, CSV export) | shadcn/studio `/iui` | System Admin user table, audit log table | 9/10 | 6/10 | 8/10 | High — `@tanstack/react-table` not in dependency registry; export libs (`papaparse`, `xlsx`) not in registry | **Approved with constraints** — dependency registry entries required first |
| **empty-state-01** (card + dashed border + icon) | shadcn/studio `/iui` | Module placeholder pages, zero-data states | 9/10 | 9/10 | 9/10 | Low — uses `Card`, `lucide-react` only | **Approved for adaptation** |
| **empty-state-02** (card + action button + dialog trigger) | shadcn/studio `/iui` | System Admin pages before mutations land | 8/10 | 8/10 | 9/10 | Low | **Approved for adaptation** |
| **dashboard-dialog** (activity/invite modal) | shadcn/studio `/iui` | System Admin invite user flow | 8/10 | 7/10 | 8/10 | Medium — dialog pattern exists in AppShell; must not duplicate `AppShellActivityDialog` | **Approved with constraints** |
| **multi-step-form** (wizard pattern) | shadcn/studio `/iui` | User invite multi-step (name → role → confirm) | 8/10 | 7/10 | 8/10 | Medium — state machine must use discriminated unions; no client-only shortcuts | **Approved with constraints** |
| **account-settings** (tabs + form sections) | shadcn/studio `/iui` | System Admin settings page | 8/10 | 7/10 | 8/10 | Medium — form sections need `@afenda/ui` Field/Label primitives via governance | **Approved with constraints** |
| **form-layout** (labeled field rows) | shadcn/studio `/iui` | System Admin mutation forms (invite, role assign) | 9/10 | 8/10 | 9/10 | Low-medium — Input/Label must use governed primitives | **Approved with constraints** |
| **widgets-component** (metric widgets, progress bars) | shadcn/studio `/iui` | Workspace dashboard secondary widgets | 8/10 | 7/10 | 8/10 | Medium — animation must be disabled or made subtle | **Approved with constraints** |
| **charts-component** (area, bar, line charts) | shadcn/studio `/iui` | Dashboard revenue/activity trends | 9/10 | 7/10 | 7/10 | High — recharts dependency, chart tokens, accessibility labels needed | **Approved with constraints** |
| **card-nav** (icon + label navigation cards) | shadcn/studio `/iui` | Module section nav within a page | 8/10 | 8/10 | 8/10 | Low | **Approved for adaptation** |
| **onboarding-feed** (progressive step list) | shadcn/studio `/iui` | First-login or first-workspace onboarding | 7/10 | 7/10 | 8/10 | Medium — animation must be reduced; step state must be server-sourced | **Reference only** |
| **application-shell** (full sidebar + header shell) | shadcn/studio `/iui` | — (already owned by TIP-006 AppShell) | n/a | n/a | n/a | **High** — TIP-006 governs all shell chrome; no raw copy permitted | **Rejected** |
| **dashboard-shell** (sidebar layout variants) | shadcn/studio `/iui` | — (already owned by TIP-006 AppShell) | n/a | n/a | n/a | **High** — same as above | **Rejected** |
| **dashboard-sidebar** (nav sidebar blocks) | shadcn/studio `/iui` | — (TIP-006 `AppShell` governs sidebar) | n/a | n/a | n/a | High | **Rejected** |
| **bento-grid** (asymmetric marketing grid) | shadcn/studio `/iui` | — | 3/10 | n/a | 5/10 | Low but irrelevant — wrong product type | **Rejected** |
| **hero, features, testimonials, pricing, footer** (Marketing UI) | shadcn/studio `/iui` | — | 2/10 | n/a | n/a | None — wrong context entirely | **Rejected** |
| **shopping-cart, checkout, product-list** (eCommerce) | shadcn/studio `/iui` | — | 1/10 | n/a | n/a | None | **Rejected** |
| **social-proof, testimonials** | shadcn/studio `/iui` | — | 1/10 | n/a | n/a | None | **Rejected** |

**Existing adapted blocks (already in `packages/appshell/src/shadcn-studio/blocks/` — do not re-adapt):**

| Block | Evidence file |
|-------|--------------|
| `AppShellDashboardKpiStat` | `app-shell-dashboard-kpi-stat.tsx` |
| `AppShellDashboardRevenueChart` | `app-shell-dashboard-revenue-chart.tsx` |
| `AppShellDashboardInvoiceTable` | `app-shell-dashboard-invoice-table.tsx` |
| `AppShellNotificationDropdown` | `app-shell-notification-dropdown.tsx` |
| `AppShellSearchDialog` | `app-shell-search-dialog.tsx` |
| `AppShellActivityFeed` | `app-shell-activity-feed.tsx` |
| `AppShellContextSwitcher` | `app-shell-context-switcher.tsx` |
| `AppShellDashboardStatisticsMetrics` | `app-shell-dashboard-statistics-metrics.tsx` |
| `AppShellDashboardSparklineStat` | `app-shell-dashboard-sparkline-stat.tsx` |
| `AppShellDashboardRegionalSales` | `app-shell-dashboard-regional-sales.tsx` |
| `AppShellDashboardPaymentHistory` | `app-shell-dashboard-payment-history.tsx` |
| `AppShellDashboardModuleEarnings` | `app-shell-dashboard-module-earnings.tsx` |
| `AppShellDashboardStatisticsLineTrends` | `app-shell-dashboard-statistics-line-trends.tsx` |
| `AppShellActivityDialog` | `app-shell-activity-dialog.tsx` |

---

## 4. Approved Adaptation Patterns

### 4.1 KPI Metric Card with Sparkline

**Source:** `statistics-component-07` / `statistics-component-08`
**Pattern:** Card with metric title, large value, percentage-change badge, and inline sparkline chart (area or bar).

**Afenda synthesis:**
- Layout: `Card` → `CardContent` — two-column flex (metric text left, chart right).
- Component used: `Card` via `@afenda/ui` (governed, zero `className`).
- Chart library: `recharts` — must be added to `dependency-registry.md` and `apps/erp/package.json` only (not design-system).
- Chart colors must use `var(--primary)`, `var(--chart-1)` … `var(--chart-5)` CSS variables sourced from `@afenda/design-system` token registry. No raw OKLCH/hex values.
- Change badge: use `Badge` from `@afenda/ui`. Positive change → `bg-primary/10 text-primary`. Negative → `bg-destructive/10 text-destructive`. Implement via CSS class on outer `<div>`, not via `className` on the governed `Badge` primitive — see TIP-004 consumer rule.
- Accessibility: `<article aria-labelledby>` with stable `useId()` for title/footnote IDs. Pattern already in `AppShellDashboardKpiStat` — replicate this approach.

**Constraints:**
- Do not add new KPI card variants to `packages/appshell/` without a matching Storybook story.
- Do not hard-code colors or chart config colors with raw OKLCH literals.
- `recharts` `ChartConfig` entries must use `satisfies ChartConfig` (never `as ChartConfig`).

---

### 4.2 Data Table with TanStack React Table

**Source:** `datatable-component-06`
**Pattern:** Server-sorted, client-filtered table with column definitions, pagination, row selection, and optional CSV/JSON export.

**Afenda synthesis:**
- Use TanStack React Table (`@tanstack/react-table`) — **register in `dependency-registry.md` first**.
- Table chrome: `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` from `@afenda/ui` (governed).
- Row selection: `Checkbox` from `@afenda/ui` (governed).
- Pagination: `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationEllipsis` from `@afenda/ui` (governed). Wrap with a `usePagination` hook (pure function — no external deps beyond the hook itself).
- Export (CSV/JSON): Only add if the surface explicitly requires it. `papaparse` and `xlsx` need dependency-registry entries. Do not add export logic for read-only audit log tables.
- Status badges: Use `Badge` from `@afenda/ui`. Apply state colors via a `<div>` wrapper className, never via `className` on the governed Badge.
- Column sort: Sortable header must have `tabIndex={0}`, keyboard `Enter`/`Space` handler, visible sort icons from `lucide-react`.

**Constraints:**
- Do not build a universal "GenericTable" component. Each table block lives in its owning feature surface (`apps/erp/src/...`) unless proven reusable across 2+ surfaces with distinct API shapes.
- Server rendering is the default for initial table data. `"use client"` only for sort/filter state that cannot be expressed via URL params + Server Component re-render.
- The API contract for list endpoints must follow `TIP-010A` pagination contract before wiring a client-side paginated table.

---

### 4.3 Empty / Zero-Data State

**Source:** `empty-state-01`, `empty-state-02`
**Pattern:** Card with a dashed inner container, centered icon (lucide), a short heading, and optional sub-copy or action button.

**Afenda synthesis:**
- Use `Card`, `CardContent` from `@afenda/ui` (governed).
- Icon from `lucide-react` (already in dependency registry). Size: `size-12`, color: `text-muted-foreground`.
- Dashed border: plain HTML `<div className="rounded-md border border-dashed p-6 text-center">` — no governed primitive needed.
- Heading: `<p className="mt-2 text-sm font-medium">`.
- Action button (where present): `Button` from `@afenda/ui` (governed, zero `className` override).
- Module placeholder pages (`/modules/[moduleId]`) currently render plain paragraphs. The empty-state pattern is the correct upgrade target for TIP-UI-05 Step 22.

**Constraints:**
- Do not create a universal `EmptyState` component in `packages/ui` until 3+ surfaces use the identical markup. For now, inline the pattern at each call site.
- The message text must come from the module's feature manifest or a typed constant — no magic strings.

---

### 4.4 Settings Form Layout (Labeled Field Rows)

**Source:** `form-layout`, `account-settings`
**Pattern:** Section-divided form with `<fieldset>` or semantic `<section>` groups, `Label` + input pairs, and a primary action button.

**Afenda synthesis:**
- Use `Input`, `Label`, `Textarea`, `Select` from `@afenda/ui` (governed).
- Layout: `<section>` with `<h2>` section headings. CSS: plain `grid grid-cols-[auto_1fr]` on the fieldset, Tailwind utility on the wrapping `<div>` (consumer layer).
- Button row: `Button` from `@afenda/ui`. Destructive action (delete): separate `Button` with `variant="destructive"` via governance.
- Form state: `"use server"` action for mutations. No client-only form state for settings that can be expressed as a Server Action + redirect.

**Constraints:**
- No local form validation library beyond what `@afenda/ui`'s `Input` renders. Validate server-side via Zod in the Server Action.
- The settings page (`/system-admin/settings`) is currently a scaffold (TIP-013 gap). Apply this pattern there when TIP-UI-05 Step 21 begins.

---

### 4.5 Multi-Step Invite/Wizard Form

**Source:** `multi-step-form`
**Pattern:** Step indicator (breadcrumb or numbered progress), one step per screen section, forward/back navigation.

**Afenda synthesis:**
- Step state: discriminated union `type StepState = { step: "identity" } | { step: "role"; userId: string } | { step: "confirm"; userId: string; roleId: string }`. No boolean flags or `currentStep: number`.
- Step indicator: plain `<ol>` with `aria-current="step"` on the active item.
- Navigation buttons: `Button` from `@afenda/ui`.
- Submission: Server Action. On confirmation step, call the governed API route (`/api/internal/v1/system-admin/users/invite`).
- Container: the step form lives inside `AppShellMain` — no custom shell chrome.

**Constraints:**
- `"use client"` is required for step transitions (local state). Keep the client component as a leaf; data fetching (available roles, current memberships) happens in a parent Server Component.
- Do not build a generic `Wizard` component. The invite wizard is an `apps/erp`-specific screen.

---

### 4.6 Card Navigation Grid

**Source:** `card-nav`
**Pattern:** Icon + title + description cards arranged in a responsive grid, each card is a navigable link.

**Afenda synthesis:**
- Use `Card` from `@afenda/ui` (governed). Wrap in a plain `<a>` or Next.js `<Link>` with `rel="noopener"` for external links.
- Icon: lucide-react, `size-6`, `text-muted-foreground`.
- Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` on a plain `<div>`. No wrapper component.
- Apply to: System Admin section landing page when sections expand beyond current list.

**Constraints:**
- Navigation targets must come from `system-admin-sections.ts` constants or the feature manifest — not hardcoded string arrays.

---

## 5. Rejected Patterns and Rationale

| Pattern | Reason |
|---------|--------|
| **Raw Application Shell copy** (`application-shell`, `dashboard-shell`) | TIP-006 governs all AppShell chrome. Authority contracts are frozen. Import `AppShell` from `@afenda/appshell`. Any new shell surface needs a TIP-006 extension slice, not a raw copy. |
| **Dashboard Sidebar copy** (`dashboard-sidebar`) | Same as above — sidebar is owned by `AppShell` authority. |
| **Bento Grid** | Asymmetric marketing layout pattern. Wrong density and semantic structure for operational ERP use. Does not map to any current screen requirement. |
| **Marketing UI blocks** (hero, features, pricing, footer, testimonials) | Designed for marketing/landing pages. ERP users are authenticated internal operators, not anonymous marketing visitors. Wrong density, wrong information architecture. |
| **eCommerce blocks** (checkout, product-list, shopping-cart) | Not in Afenda's domain. No applicable ERP surface. |
| **Social proof / testimonials** | Consumer marketing pattern. Irrelevant to ERP. |
| **Onboarding Feed** (progressive reveal) | Heavy animation, client-only, no server-rendering path. Onboarding steps should be derivable from feature manifest + permission grants, not local animation state. **Reference only** — inspect for step-list layout ideas, not for direct use. |
| **Animation-heavy patterns (motion.dev)** | `motion` (previously `framer-motion`) is not in the dependency registry. ERP users are doing operational work — animation reduces perceived performance. Subtle CSS transitions (`transition`, `duration-150`) are sufficient. |
| **Local color palettes in components** | Any component that defines raw OKLCH or hex values for chart colors outside the `@afenda/design-system` token registry violates design-token governance. Use `var(--primary)`, `var(--chart-1)`…`var(--chart-5)` exclusively. |
| **Hardcoded className overrides on governed primitives** | violates TIP-004. Any `className` on `<Card className="...">`, `<Button className="...">` etc. in a consumer package will fail Gate D and Gate F of `pnpm ui:guard`. |
| **Client-only permission logic** | Permission visibility must flow through `packages/permissions/` RBAC, the operating context resolver, and feature manifest entitlements. No `if (userRole === "admin")` in component JSX. |

---

## 6. Layer Mapping

```
Do not move a pattern into `packages/ui` just because it looks reusable.
Prove reuse, governance, accessibility, and primitive ownership first.
```

| Pattern type | Correct Afenda layer | Examples |
|--------------|---------------------|---------|
| Page-level screen content | `apps/erp/src/app/(protected)/` | Users page, Settings page, Module placeholders |
| App-shell/chrome/navigation | `packages/appshell/src/` | `AppShell`, `AppShellMain`, nav, context switcher |
| Dashboard blocks (KPI, chart, activity) | `packages/appshell/src/shadcn-studio/blocks/` | `AppShellDashboardKpiStat`, revenue chart, sparkline |
| Metadata-driven section renderer | `packages/metadata-ui/src/` | Default section renderers (TIP-UI-04) |
| Reusable primitive (Button, Card, Table, etc.) | `packages/ui/src/components/` | 58 existing primitives — do not add without governance |
| Design token, recipe, variant | `packages/design-system/src/` | Token registry, `generate-tokens-css.ts`, recipes |
| Permission visibility | `packages/permissions/` + feature manifest | `PERMISSION_REGISTRY`, `evaluatePolicy()` |
| Operating context / tenant resolution | `packages/kernel/src/context/` | `context-registry.ts`, consolidation scope resolver |
| Business master data contracts | Domain packages (`PKG-R02–R05`) — **not yet activated** | Customer, Product, Employee, Warehouse (post Phase 1) |

**Rule for new blocks in `packages/appshell/src/shadcn-studio/blocks/`:**
1. Block receives typed props only — no local data fetching.
2. Block imports `@afenda/ui` via zero-`className` governed pattern.
3. Block has a matching Storybook story in `apps/storybook/`.
4. Block passes `pnpm ui:guard:scan` before merge.

**Rule for new ERP page components in `apps/erp/src/`:**
1. Page is a Server Component by default — add `"use client"` only for interactive state.
2. Data resolved from Server Components using governed resolvers (`resolveOperatingContext*`, `resolveSystemAdminSectionAccess`, etc.).
3. Never inline permission logic in JSX — use governing resolvers and `access.ok` guard pattern from TIP-013.

---

## 7. Visual Quality Standard

Target: **9.5 / 10 enterprise visual quality**. Criteria and measurable pass/fail tests:

| Criterion | Required standard | Pass/fail test |
|-----------|------------------|----------------|
| **Layout** | Clear content hierarchy. Calm spacing. Comfortable ERP density (not crowded, not airy/marketing). Section headings visible. No orphaned whitespace. | Visual inspection: no 3+ column layouts on narrow viewports; no paragraphs wider than 65ch. |
| **Typography** | Readable body at `text-sm` (14px). `font-medium` for section labels. `text-muted-foreground` for supporting copy. No more than 3 type sizes per screen. | `pnpm ui:guard` Gate D — no className on primitives that sets font-size/weight. |
| **Color** | Governed tokens only. Status colors: `--primary` (brand), `--destructive` (error/delete), `--muted-foreground` (tertiary), `--foreground` (body), `--card` / `--background` (surface). | `pnpm ui:guard:scan` Gate D — zero raw color values in consumer packages. |
| **Density** | Compact enough for daily operations. Minimum row height 40px for table rows. Card padding `p-4` or `p-6`. No hero-size headings in operational screens. | Storybook visual gate — compare with existing `AppShellDashboardKpiStat` as the density reference. |
| **Motion** | Subtle CSS transitions (`transition duration-150 ease-out`) for hover and focus-visible states only. No page-level enter animations. No auto-playing marquees or carousels. | Gate: no `motion.dev` / `framer-motion` imports in `apps/erp/` or `packages/appshell/`. |
| **States** | Every interactive component must have: `ready`, `loading` (skeleton or spinner), `empty` (zero-data pattern §4.3), `error` (ErrorBoundary), `disabled`, `forbidden` (access denied). | `pnpm --filter @afenda/erp typecheck` — missing states cause type errors on governed resolver return types. |
| **Accessibility** | WCAG 2.1 Level AA minimum. Keyboard navigation for all interactive elements. Visible focus ring. Semantic HTML (`<article>`, `<nav>`, `<main>`, `<section>`, `<h1>`…`<h3>`). ARIA labels on icon-only buttons. Alt text on all `<img>` tags. | `pnpm test:a11y` (storybook accessibility addon) |
| **Responsiveness** | Desktop-first (1200px+). Tablet (768–1199px): adjust grid columns. Mobile: no horizontal scroll. Sidebar collapses to hamburger (handled by `AppShell`). | Storybook viewport test — tablet and mobile viewports. |
| **Dark mode** | All colors via CSS variables that have `.dark` counterparts in the design system. No hardcoded `#hex` that breaks in dark mode. | Toggle Storybook theme → dark. Visual check for contrast violations. |
| **Brand fit** | Premium, calm, operational. No gradient heroism. No floating blob backgrounds. No glassmorphism. No AI-template aesthetics. Understated — let the data communicate. | Peer review: compare against `AppShellDashboardKpiStat` and `AppShellDashboardRevenueChart` as the reference bar. |

---

## 8. Coding Quality Standard

Target: **9.5 / 10 coding quality**. Every implementation task must satisfy:

### TypeScript rules

- No `any`. Use `unknown` at trust boundaries (API responses, user input).
- No unsafe casts (`as SomeType`). Use `satisfies` for registries and config objects.
- Discriminated unions for state: `type StepState = { step: "a" } | { step: "b"; data: T }` — no `currentStep: number` + boolean flags.
- Explicit return types on exported functions.
- `exactOptionalPropertyTypes: true` is enforced — conditional spread pattern for optional props: `{...(condition ? { prop: value } : {})}`.

### React / Next.js rules

- Server Components by default. `"use client"` only when local state, browser APIs, or event handlers are required at the component boundary.
- No async Client Components. Data fetching belongs in Server Components or Server Actions.
- `useId()` for all `aria-labelledby` / `aria-describedby` associations.
- `key` props must use stable IDs (database IDs or typed constants), never array indices.
- No `console.log` in production code. No `debugger`. No `alert`.

### UI governance rules (TIP-004)

- Zero `className` on `@afenda/ui` primitives in consumer packages (`apps/erp/`, `packages/appshell/`, `packages/metadata-ui/`).
- Shell chrome (`AppShell`, `AppShellMain`) receives no `className` overrides.
- All new primitive variants go through `resolvePrimitiveGovernance()` in `packages/ui/src/governance/`.
- `mapStockButtonProps` at call sites for any stock shadcn-compat wiring.
- Run `pnpm ui:guard:scan` (Gate D) after any new component that uses `@afenda/ui` primitives.

### Security rules

- No `dangerouslySetInnerHTML`.
- `rel="noopener noreferrer"` on all `target="_blank"` links.
- External script additions: follow `.cursor/skills/csp-third-party/SKILL.md` and `csp-allowlist.ts`.

### Naming and structure rules

- Files: `kebab-case.tsx`. Components: `PascalCase`. Hooks: `useKebabCase.ts`.
- No barrel files that re-export everything from a directory.
- No `any` in test files either — use `vi.fn<() => ReturnType>()`.

### Dependency rules (ADR-0003)

- No new `npm install` without a `dependency-registry.md` entry.
- For this guide's candidates: `recharts` and `@tanstack/react-table` require registry entries before use.
- `papaparse`, `xlsx` — only add if export functionality is explicitly scoped in a delivery TIP slice.

---

## 9. Implementation Handoff Template

When a future agent is authorized to implement one approved pattern, use this prompt template:

```
/afenda-coding-session

Phase 0:
1. Objective: Implement [PATTERN_NAME] for [SURFACE] in [PACKAGE].
2. Allowed layer: [e.g. apps/erp/src/app/(protected)/system-admin/ OR packages/appshell/src/shadcn-studio/blocks/]
3. Files to change:
   - [list explicitly, e.g. apps/erp/src/app/(protected)/system-admin/settings/page.tsx]
4. Prohibited:
   - packages/ui/src/components/ (no new primitives without governance)
   - packages/design-system/ (no new tokens without ADR)
   - packages/appshell/src/index.ts (no public API changes without TIP-006 slice)
5. Authority: app-ui-component-adaptation-guide.md §4.[N] [PATTERN_NAME]
6. Acceptance gates:
   - pnpm --filter @afenda/erp typecheck
   - pnpm ui:guard:scan
   - pnpm quality:boundaries
   - pnpm check:api-contracts (if new API route added)
   - pnpm --filter @afenda/storybook typecheck (if Storybook story added)

Source: docs/architecture/app-ui-component-adaptation-guide.md §4.[N]
Delivery TIP: [e.g. TIP-UI-05 §Slice 2]
Visual reference: Storybook — Afenda App Shell / [BLOCK_NAME]
```

**Per-pattern handoff notes:**

| Pattern | TIP-UI-05 slice | Storybook reference | Key constraint reminder |
|---------|-----------------|---------------------|------------------------|
| Empty State + card-nav | [§Slice 4](../delivery/tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-4--shadcnstudio-empty-state--card-nav-afendaerp) | n/a (ERP inline) | `pnpm ui:guard:scan`; zero `className` on primitives |
| Form layout + account settings | [§Slice 5](../delivery/tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-5--shadcnstudio-form-layout--account-settings-afendaerp) | n/a (ERP only) | Server Action + Zod; govern-primitive consumer 8/8 |
| Chart KPI (statistics/charts/widgets) | [§Slice 6](../delivery/tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-6--dependency-registry--chart-kpi-blocks-afendaappshell) | `AppShell / Dashboard KPI Stat` | `recharts` + registry first; `pnpm ui:guard` |
| DataTable (users/audit list) | [§Slice 7](../delivery/tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-7--shadcnstudio-datatable-afendaerp) | n/a (ERP only) | `@tanstack/react-table` in registry first |
| Multi-step invite + admin dialog | [§Slice 8](../delivery/tips/%5BComplete%5D%20tip-ui-05-erp-app-surfaces.md#slice-8--shadcnstudio-multi-step-invite--admin-dialog-afendaerp) | n/a | Discriminated union; no `AppShellActivityDialog` duplication |
| Rejected shell/marketing/eCommerce | §Rejected in TIP-UI-05 | — | **Do not implement** |
| onboarding-feed | Reference only | — | Layout ideas only — no copy |

---

## 10. Acceptance Gates

Every implementation referencing this guide must pass:

```bash
# TypeScript correctness
pnpm --filter @afenda/erp typecheck

# UI governance — zero className on governed primitives
pnpm ui:guard
# (or faster sub-2s local scan:)
pnpm ui:guard:scan

# Package boundary enforcement
pnpm quality:boundaries

# API contract coverage (if new routes added)
pnpm check:api-contracts

# Documentation drift guard
pnpm check:documentation-drift

# Storybook typecheck (if new appshell blocks added)
pnpm --filter @afenda/storybook typecheck

# Full quality matrix (pre-PR)
pnpm quality
```

**Documentation-only tasks (like this pass) additionally run:**

```bash
pnpm check:documentation-drift
pnpm quality:documentation-drift
```

If `pnpm quality` fails, identify:
1. Whether the gate failure was introduced by the current task (fix before shipping).
2. Whether it is a pre-existing failure (document in the Completion Report Known Gaps; do not ship regressions).

---

## 11. Documentation Drift Rules

This document must be updated when:

| Trigger | Action |
|---------|--------|
| A new shadcn/studio block is adapted into `packages/appshell/` | Add to §3 "Existing adapted blocks" table |
| A candidate's decision changes (e.g. dependency registered, risk resolved) | Update §3 decision; add implementation detail to §4 |
| A new UI TIP slice is started | Add entry to §9 handoff notes |
| TIP-004 policy changes (new gate, new rule) | Update §8 governance rules |
| `dependency-registry.md` gains a new entry relevant to a §4 pattern | Remove the "dependency registration required" constraint from that pattern |
| A pattern is implemented and proven stable | Move from §4 to §3 existing blocks table; add runtime evidence note |
| `pnpm check:documentation-drift` fails | Fix the drift before merging |

**Sync check command:**

```bash
pnpm check:documentation-drift
```

If the drift guard does not currently scan this file, add it to the documentation drift manifest.

---

## Appendix: Design Analysis from `/iui` Blocks

### statistics-component-07 / -08 — Design DNA

- **Layout pattern**: Responsive `grid` with `auto-fit minmax(280px, 1fr)`. Each cell is an independent `Card`.
- **Visual hierarchy**: Metric title (small, muted) → large value (`text-3xl font-semibold`) → change badge + comparison label (small, muted).
- **Chart integration**: Sparkline (area/bar) embedded in `CardContent` — takes 40–50% of card width. `ChartContainer` constrains max height (`h-21` or `max-h-26.5`).
- **Color logic**: Chart stroke uses `var(--primary)` for primary metric, `var(--chart-N)` for multi-series. Gradient fill uses `stopOpacity` fade.
- **Density**: Very suitable for ERP. Compact card. No marketing fluff.

### datatable-component-06 — Design DNA

- **Layout pattern**: Full-width card containing filter bar (above) + `Table` + pagination footer. Filter bar is collapsible or always-visible.
- **Column model**: Select checkbox (48px fixed) → data columns (flexible) → Actions column (60px fixed).
- **Status badge pattern**: Semantic badge colors per status value — map to CSS utility classes, not raw hex.
- **Sorting**: `ChevronUp`/`ChevronDown` icons on sortable headers. `tabIndex` + keyboard handler for accessibility.
- **Pagination**: "Showing N to M of T entries" label + previous/next buttons + numbered pages with ellipsis.
- **Export**: Optional dropdown with CSV/JSON/Excel. Only include when surface explicitly requires it.

### empty-state — Design DNA

- **Core pattern**: `<div className="rounded-md border border-dashed p-6 text-center">` inside `CardContent`.
- **Icon size**: `size-12` (`h-12 w-12`), `text-muted-foreground`. Centered with `mx-auto`.
- **Text**: `text-sm font-medium` heading + `text-sm text-muted-foreground` sub-copy.
- **Action**: Optional `Button` below the text. Primary action variant for create-first CTAs.
- **Variants**: No-data (metric zero), no-access (permission denied messaging should link to system-admin), loading-failed.

---

*Document generated 2026-06-24 via Afenda AI Documentation Authoring Agent.*
*Reviewed against: shadcn/studio blocks catalog (/iui), `packages/appshell/src/shadcn-studio/blocks/` (39 files), `apps/erp/src/app/(protected)/` (10 files), `afenda-runtime-truth-matrix.md`, `tip-status-index.md`.*
