# Deliverable Templates

Use these templates when producing the full enterprise frontend audit report.
Each section maps to one of the 15 required deliverables.

---

## Deliverable 1 — Executive Summary

```md
## Executive Summary

**Audit date:** YYYY-MM-DD
**Auditor persona:** Enterprise Principal Frontend Architect / Design System Architect / UX Architect / Senior Staff Engineer
**Surfaces audited:** apps/erp | apps/docs | packages/appshell | packages/metadata-ui | packages/ui

### Overall Enterprise Frontend Score: X.X / 10

| Dimension | Score | Trend |
|-----------|-------|-------|
| Frontend Architecture | X.X/10 | — |
| Design System Conformance | X.X/10 | — |
| Visual Consistency | X.X/10 | — |
| Metadata-Driven UI Coverage | XX% | — |
| Component Quality | X.X/10 | — |
| Accessibility | X.X/10 | — |
| Performance | X.X/10 | — |
| UX Maturity | X.X/10 | — |
| Architecture Conformance | X.X/10 | — |

### Top 3 critical issues
1. <Severity> — <one-sentence description> — <architectural reference>
2. <Severity> — <one-sentence description> — <architectural reference>
3. <Severity> — <one-sentence description> — <architectural reference>

### Recommended immediate actions
1. ...
2. ...
3. ...
```

---

## Deliverable 2 — Frontend Architecture Assessment

```md
## Frontend Architecture Assessment

### App Router composition
| Check | Status | Evidence | Severity |
|-------|--------|----------|----------|
| RSC / client boundary discipline | Pass/Fail | <file:line> | Critical/High/Medium/Low |
| Streaming / Suspense coverage | Pass/Fail | ... | ... |
| Parallel data fetching (Promise.all) | Pass/Fail | ... | ... |
| No module-level mutable state in RSC | Pass/Fail | ... | ... |
| Lazy loading of heavy libraries | Pass/Fail | ... | ... |
| No barrel file imports | Pass/Fail | ... | ... |

### App Shell
| Check | Status | Evidence | Severity |
|-------|--------|----------|----------|
| Shell layouts are RSC | Pass/Fail | ... | ... |
| Workspace context server-resolved | Pass/Fail | ... | ... |
| Client boundary at minimum subtree | Pass/Fail | ... | ... |

### Code organization
| Package | Structure conformant | Deviations |
|---------|---------------------|------------|
| apps/erp | Yes/No | <list> |
| packages/appshell | Yes/No | <list> |
| packages/ui | Yes/No | <list> |

### Dependency graph
| Issue | Packages | Severity |
|-------|---------|----------|
| Circular dependency | A → B → A | Critical |
| Wrong layer import | X imports Y (lower → higher) | High |
```

---

## Deliverable 3 — UI/UX Assessment

```md
## UI/UX Assessment

### UX Quality Pillars

| Pillar | Score | Top issue | Evidence |
|--------|-------|-----------|---------|
| Frictionless Insight to Action | X.X/10 | <description> | <screen or file> |
| Quality Craft | X.X/10 | ... | ... |
| Trustworthy Building | X.X/10 | ... | ... |

### Information Architecture
<Narrative: navigation model, module groupings, command palette coverage>

### Workflow Efficiency
<3–5 key workflows evaluated with step counts and friction points>

### Responsive Behavior
| Breakpoint | Status | Issues |
|------------|--------|--------|
| Mobile < 640px | Pass/Fail | <list> |
| Tablet 640–1024px | Pass/Fail | <list> |
| Desktop 1024–1440px | Pass/Fail | <list> |
| Large ≥ 1440px | Pass/Fail | <list> |
```

---

## Deliverable 4 — Metadata-Driven UI Coverage Assessment

```md
## Metadata-Driven UI Coverage

### Coverage by surface

| Surface | Status | Metadata source | Gap |
|---------|--------|-----------------|-----|
| Page layouts | Metadata-driven / Partial / Hardcoded | <source> | <gap description> |
| Form fields | ... | ... | ... |
| Table columns | ... | ... | ... |
| Navigation items | ... | ... | ... |
| Command palette | ... | ... | ... |
| Status badges | ... | ... | ... |
| Empty states | ... | ... | ... |
| Detail panels | ... | ... | ... |
| Toolbars / actions | ... | ... | ... |
| Widget configuration | ... | ... | ... |

**Overall metadata coverage: XX%** (target ≥ 70%)

### Top gaps requiring metadata migration
1. <Surface> — <current implementation> → <metadata approach> — <estimated effort>
2. ...
```

---

## Deliverable 5 — Design System Conformance

```md
## Design System Conformance

### Token usage
| Category | Violations | Files | Severity |
|----------|-----------|-------|----------|
| Hardcoded hex colors | N | <files> | High |
| Arbitrary radius values | N | <files> | Medium |
| Hardcoded shadows | N | <files> | Medium |
| Raw pixel spacing | N | <files> | Low |
| Gradient / glass / blur | N | <files> | High |

### Theme architecture
| Check | Status | Evidence |
|-------|--------|----------|
| globals.css cascade order correct | Pass/Fail | apps/erp/src/app/globals.css |
| CSS ↔ TS contract in sync (docs) | Pass/Fail | docs-editorial-palette.contract.ts |
| @theme inline bridge used (docs) | Pass/Fail | globals.css |

### Color discipline
| Rule | Status | Evidence |
|------|--------|----------|
| Single accent color (ERP) | Pass/Fail | ... |
| Brand accent only in prose links (docs) | Pass/Fail | ... |
| No fd-* hardcoded in :root/.dark | Pass/Fail | ... |
| Status as dot+text (not filled pill) | Pass/Fail | ... |

### Dark mode quality
| Surface | Light | Dark | Delta |
|---------|-------|------|-------|
| ERP app | X.X/10 | X.X/10 | X |
| Docs | X.X/10 | X.X/10 | X |
```

---

## Deliverable 6 — Component Quality Assessment

```md
## Component Quality Assessment

### govern-primitive scores (packages/ui)

| Component | Score (/16) | Critical blockers |
|-----------|------------|-------------------|
| Button | X/16 | <list> |
| Badge | X/16 | ... |
| Card | X/16 | ... |
| Alert | X/16 | ... |
| ... | ... | ... |

**Average: X.X/16** (target ≥ 15/16 = 9.5/10)

### Consumer-layer scores

| Package | Score (/8) | Critical violations |
|---------|-----------|---------------------|
| @afenda/appshell | X/8 | <list> |
| @afenda/metadata-ui | X/8 | ... |
| apps/erp | X/8 | ... |

### Duplication report
| Duplication | Files | Lines | Recommended action |
|-------------|-------|-------|--------------------|
| <pattern> | <file1>, <file2> | Nx, Ny | Merge into <target> |
| ... | ... | ... | ... |

### Dead components
| Component | File | Last imported | Recommended action |
|-----------|------|---------------|-------------------|
| <name> | <path> | <date or never> | Delete / Document |
```

---

## Deliverable 7 — Accessibility Assessment

```md
## Accessibility Assessment (WCAG AA)

### Gate results (pnpm ui:guard — Gate F)
\`\`\`bash
# paste actual output
\`\`\`

### Manual audit findings

| Check | Status | Evidence | Severity |
|-------|--------|----------|----------|
| Live regions on dynamic data | Pass/Fail | <component:line> | Critical |
| Chart aria-labels (figure + figcaption) | Pass/Fail | ... | High |
| Focus management (dialog return) | Pass/Fail | ... | High |
| Keyboard navigation complete | Pass/Fail | ... | High |
| Color contrast WCAG AA | Pass/Fail | ... | High |
| prefers-reduced-motion honored | Pass/Fail | ... | Medium |
| Semantic HTML structure | Pass/Fail | ... | Medium |
| Form labels and associations | Pass/Fail | ... | High |

**Accessibility Score: X.X/10**
```

---

## Deliverable 8 — Performance Assessment

```md
## Performance Assessment

### Bundle analysis
| Bundle | Current size | Target | Issues |
|--------|-------------|--------|--------|
| Initial JS | X KB | < 200KB | <list> |
| recharts in initial bundle | Yes/No | No | ... |
| Barrel imports detected | N | 0 | <files> |

### Core Web Vitals (measured or estimated)
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| LCP | Xs | < 2.5s | Pass/Fail |
| CLS | X | < 0.1 | Pass/Fail |
| INP | Xms | < 200ms | Pass/Fail |
| TTFB | Xms | < 800ms | Pass/Fail |

### RSC / waterfall analysis
| Page | Parallel fetches | Sequential fetches | Action required |
|------|-----------------|-------------------|-----------------|
| /dashboard | X | X (violation) | Wrap in Promise.all |
| ... | ... | ... | ... |

**Performance Score: X.X/10**
```

---

## Deliverable 9 — Architecture Drift Report

```md
## Architecture Drift Report

### Deviations by severity

#### Critical
| ID | File | Deviation | PAS/ADR ref | Root cause | Fix |
|----|------|-----------|-------------|------------|-----|
| D-001 | <path:line> | <description> | PAS-001 §X | <cause> | <fix> |

#### High
| ID | File | Deviation | Ref | Fix |
|----|------|-----------|-----|-----|
| D-00N | ... | ... | ... | ... |

#### Medium
...

#### Low
...

**Total deviations:** Critical: N, High: N, Medium: N, Low: N
```

---

## Deliverable 10 — Implementation Gap Analysis

```md
## Implementation Gap Analysis

### Gaps by surface

| Feature / Contract | Intended | Implemented | Gap | Priority |
|--------------------|---------|-------------|-----|----------|
| Workspace context RSC resolution | Server-only | Partial (some client fetches) | High | P1 |
| Metadata-driven forms | Full metadata | Hardcoded fields | Medium | P2 |
| ... | ... | ... | ... | ... |
```

---

## Deliverable 11 — Code Duplication Report

```md
## Code Duplication Report

| Pattern | Occurrences | Files | Lines | Action |
|---------|-------------|-------|-------|--------|
| Metric card layout | 5 | <files> | ~200 | Extract to MetricCard component |
| Loading skeleton shape | 8 | ... | ~150 | Standardize to SkeletonCard |
| Table empty state | 4 | ... | ~80 | Extract to TableEmptyState |
| ... | ... | ... | ... | ... |

**Estimated duplication reduction:** ~NNN lines
```

---

## Deliverable 12 — Visual Consistency Report

```md
## Visual Consistency Report

### Audit by surface

| Surface | Consistency score | Issues |
|---------|------------------|--------|
| Dashboard | X.X/10 | <list> |
| Forms | X.X/10 | ... |
| Tables | X.X/10 | ... |
| Empty states | X.X/10 | ... |
| Error states | X.X/10 | ... |
| Loading states | X.X/10 | ... |
| Dialogs | X.X/10 | ... |
| Drawers | X.X/10 | ... |
| Navigation | X.X/10 | ... |

**Overall visual consistency: X.X/10**

### Specific inconsistencies
| Inconsistency | Location A | Location B | Fix |
|---------------|-----------|-----------|-----|
| Card border-radius differs | appshell card | erp module card | Unify to var(--afenda-radius-xl) |
| ... | ... | ... | ... |
```

---

## Deliverable 13 — Technical Debt Report

```md
## Technical Debt Report

| Debt item | Location | Severity | Estimated effort | Blocks what |
|-----------|---------|---------|-----------------|-------------|
| Static recharts imports | <N files> | High | 2h | Performance score |
| Boolean prop explosion | <N components> | Medium | 4h | Maintainability |
| Missing Suspense boundaries | <N pages> | Medium | 3h | Streaming / UX |
| ... | ... | ... | ... | ... |

**Total estimated remediation effort:** ~Xh
```

---

## Deliverable 14 — Prioritized Remediation Plan

```md
## Prioritized Remediation Plan

### P0 — Ship blockers (fix before next deploy)
| # | Issue | File | Fix | Expected impact |
|---|-------|------|-----|-----------------|
| 1 | className on governed primitive causing TIP-004 throw | <path:line> | Remove className; use intent prop | Gate D clean |
| 2 | ... | ... | ... | ... |

### P1 — Sprint 1 (this sprint)
| # | Issue | Effort | Impact |
|---|-------|--------|--------|
| 1 | recharts static imports → next/dynamic | 2h | -200KB initial bundle |
| 2 | ... | ... | ... |

### P2 — Sprint 2
...

### P3 — Backlog
...
```

---

## Deliverable 15 — Implementation Diff

For every proposed change, provide a unified diff:

```diff
--- a/packages/appshell/src/dashboard/app-shell-dashboard-revenue-chart.tsx
+++ b/packages/appshell/src/dashboard/app-shell-dashboard-revenue-chart.tsx
@@ -1,5 +1,8 @@
-import { AreaChart, ResponsiveContainer } from "recharts";
+import dynamic from "next/dynamic";
+
+const AreaChart = dynamic(
+  () => import("recharts").then((m) => ({ default: m.AreaChart })),
+  { ssr: false, loading: () => <div className="afenda-chart-skeleton" aria-busy="true" /> }
+);
+const ResponsiveContainer = dynamic(
+  () => import("recharts").then((m) => ({ default: m.ResponsiveContainer })),
+  { ssr: false }
+);
```
