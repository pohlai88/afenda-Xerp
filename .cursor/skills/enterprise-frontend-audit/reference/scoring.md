# Enterprise Frontend Scoring Rubric

Target: **9.5–10.0 overall** across all nine dimensions.

---

## Dimension 1 — Frontend Architecture (/10)

| Check | Points |
|-------|--------|
| RSC/client boundary discipline (no "use client" on layouts, boundaries minimal) | 1.5 |
| Parallel data fetching (Promise.all in all RSC pages) | 1.0 |
| Suspense boundaries present for all data-dependent subtrees | 1.0 |
| No module-level mutable state in RSC | 1.0 |
| Lazy loading: recharts + heavy deps via next/dynamic | 1.0 |
| No barrel imports from @afenda/* | 1.0 |
| Folder structure conforms to established conventions | 0.5 |
| No circular dependencies between packages | 0.5 |
| Feature boundaries respected (no cross-feature imports) | 0.5 |
| Server Actions used for mutations (not client-side fetch to API) | 1.0 |
| **Maximum** | **10.0** |

**Automatic deductions:**
- `"use client"` on a root layout: -3.0
- Module-level mutable variable in RSC: -2.0
- recharts in initial bundle (missing next/dynamic): -1.5

---

## Dimension 2 — Design System Conformance (/10)

| Check | Points |
|-------|--------|
| Zero hardcoded hex/oklch in consumer CSS | 1.5 |
| Zero arbitrary Tailwind values ([...]) in consumer code | 1.0 |
| Zero gradient/glass/blur violations | 0.5 |
| globals.css cascade order correct | 0.5 |
| Vendored shadcn theme unmodified (checksum / governance test) | 1.0 |
| No unregistered custom properties in consumer CSS | 1.0 |
| shadcn-first consumption in new ERP CSS (no new semantic re-aliases) | 1.0 |
| CSS ↔ TypeScript contract in sync (docs surface) | 0.5 |
| @theme inline bridge correct (docs surface) | 0.5 |
| Single accent color discipline (ERP surface) | 0.5 |
| Brand accent only in prose (docs surface) | 0.5 |
| Dark mode equivalent quality (visual smoke pass) | 1.0 |
| **Maximum** | **10.0** |

**Automatic deductions:**
- Hand-edited `vendored/shadcn-theme.css`: -3.0
- `@theme` defined outside css-authority/design-system shim: -2.0
- Direct studio CSS import from app: -2.0
- Direct `--color-fd-*` in `:root` or `.dark`: -2.0
- Brand accent in shell chrome: -2.0
- CSS/TS contract out of sync: -1.5

---

## Dimension 3 — Visual Consistency (/10)

| Check | Points |
|-------|--------|
| Heading hierarchy clear and consistent across screens | 1.0 |
| Layout rhythm (4/8px baseline) consistent | 1.0 |
| Card patterns unified (radius, shadow, padding) | 1.0 |
| KPI presentation (tabular-nums, plain muted change text) | 1.0 |
| Status cells use dot+text pattern (not filled pills) | 0.5 |
| Empty states: all surfaces have illustration+message+CTA | 1.0 |
| Loading states: skeletons match layout of loaded content | 1.0 |
| Error states: role="alert" + actionable message | 0.5 |
| Dark mode: consistent visual quality (graphite+ivory) | 1.0 |
| Mobile layout readable and functional | 1.0 |
| **Maximum** | **10.0** |

---

## Dimension 4 — Metadata-Driven UI Coverage (%)

```
Score = (fully_metadata_driven + 0.5 × partial) / total_surfaces × 100

Surfaces counted: pages, forms, tables, navigation, commands,
                  toolbars, status badges, empty states, detail panels,
                  widget configuration (10 surfaces minimum)
```

| Coverage | Enterprise Maturity Level |
|----------|--------------------------|
| ≥ 85% | 10/10 — Fully metadata-driven ERP |
| 70–84% | 8.0–9.5 — Mature metadata-driven |
| 50–69% | 6.0–7.5 — Partial metadata adoption |
| < 50% | < 6.0 — Primarily imperative UI |

---

## Dimension 5 — Component Quality (/10)

| Metric | Weight | Scoring |
|--------|--------|---------|
| govern-primitive checklist avg (packages/ui) | 40% | score/16 × 10 |
| Consumer checklist avg (appshell/metadata-ui/erp) | 30% | score/8 × 10 |
| React-erp-quality gates (Gate F pass rate) | 20% | pass% × 10 |
| Duplication: zero duplicate component patterns | 10% | binary |

**Example:** 15/16 primitive + 8/8 consumer + Gate F 90% + no duplicates
= 0.4 × 9.375 + 0.3 × 10.0 + 0.2 × 9.0 + 0.1 × 10.0 = **9.55/10**

---

## Dimension 6 — Accessibility (/10)

| Check | Points |
|-------|--------|
| All dynamic data has aria-live regions | 1.5 |
| All charts wrapped in figure + figcaption + aria-hidden on SVG | 1.5 |
| Focus management correct (dialog close → trigger) | 1.0 |
| Keyboard navigation complete (all interactive elements) | 1.5 |
| Color contrast WCAG AA on all text (body ≥ 4.5:1) | 1.5 |
| prefers-reduced-motion respected on all animations | 0.5 |
| Semantic HTML (headings, landmarks, tables) | 1.0 |
| Forms: labels, error messages, aria-describedby | 1.0 |
| pnpm ui:guard Gate F passes (React accessibility rules) | 0.5 |
| **Maximum** | **10.0** |

**Automatic deductions:**
- Missing aria-live on ANY table with live filtering: -1.0
- Charts without figure/figcaption: -0.5 per chart (max -2.0)
- Color as only status differentiator: -1.0

---

## Dimension 7 — Performance (/10)

| Check | Points |
|-------|--------|
| recharts via next/dynamic (not in initial bundle) | 1.5 |
| All RSC data fetches use Promise.all | 1.5 |
| No barrel imports from @afenda/* | 1.0 |
| next/image for all images | 1.0 |
| LCP < 2.5s | 1.5 |
| CLS < 0.1 | 1.0 |
| INP < 200ms | 1.0 |
| Static data hoisted to module scope | 0.5 |
| next/font used for all fonts | 0.5 |
| **Maximum** | **10.0** |

**Automatic deductions:**
- recharts in initial bundle: -2.0
- LCP > 4.0s: -2.0
- CLS > 0.25: -1.5

---

## Dimension 8 — UX Maturity (/10)

| Pillar | Max | Scoring guide |
|--------|-----|---------------|
| Frictionless Insight to Action | 3.5 | 3.5=exceptional, 3=good, 2=functional, 1=friction |
| Quality Craft (visual + responsive) | 3.5 | 3.5=premium, 3=polished, 2=adequate, 1=inconsistent |
| Trustworthy Building (trust + error UX) | 3.0 | 3=all states handled, 2=partial, 1=missing |
| **Maximum** | **10.0** | |

**Scoring guide for each pillar:**
- All checklist items pass + no red flags: pillar max
- 1–2 checklist fails: pillar max - 0.5
- 3–5 checklist fails: pillar max - 1.0
- Red flag present: pillar max - 1.5

---

## Dimension 9 — Architecture Conformance (/10)

| Metric | Points |
|--------|--------|
| Zero Critical drift deviations | 3.0 |
| Zero High drift deviations | 2.5 |
| Zero Medium drift deviations | 2.0 |
| PAS/ADR/FDR fully referenced in implementation decisions | 1.5 |
| Foundation registry lanes correct | 1.0 |
| **Maximum** | **10.0** |

**Scoring:**
- Each Critical deviation: -1.0 (minimum 0)
- Each High deviation: -0.5 (minimum 0)
- Each Medium deviation: -0.25 (minimum 0)

---

## Overall Enterprise Score

```
Overall = (
  Architecture × 0.15 +
  DesignSystem × 0.15 +
  VisualConsistency × 0.10 +
  MetadataCoverage_normalized × 0.05 +
  ComponentQuality × 0.15 +
  Accessibility × 0.15 +
  Performance × 0.10 +
  UXMaturity × 0.10 +
  ArchConformance × 0.05
)

MetadataCoverage_normalized = MetadataCoverage% / 10
  (70% → 7.0, 85% → 8.5, 100% → 10.0)
```

| Score | Enterprise Maturity Level |
|-------|--------------------------|
| 9.5–10.0 | Exceptional — flagship enterprise quality |
| 9.0–9.4 | Strong — production-ready enterprise frontend |
| 8.0–8.9 | Good — most standards met, focused gaps |
| 7.0–7.9 | Adequate — functional but notable gaps |
| < 7.0 | Needs remediation — significant technical debt |

**Minimum acceptable for enterprise production:** **9.0 overall, no dimension below 8.0**

---

## Severity classification for findings

| Severity | Definition | SLA |
|----------|-----------|-----|
| **Critical** | Breaks governance, production failure, or PAS hard stop | Fix before this PR merges |
| **High** | TIP-004 violation, major a11y gap, architecture boundary breach | Fix within current sprint |
| **Medium** | Anti-pattern accumulating debt, moderate a11y gap | Fix within next sprint |
| **Low** | Style inconsistency, improvement opportunity, naming drift | Backlog with priority |
