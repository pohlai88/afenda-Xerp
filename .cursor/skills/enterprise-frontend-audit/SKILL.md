---
name: enterprise-frontend-audit
description: >
  Comprehensive end-to-end enterprise frontend audit skill for the Afenda ERP monorepo.
  Operates as Enterprise Principal Frontend Architect, Design System Architect, UX Architect,
  and Senior Staff Engineer. Reviews, audits, repairs, normalizes, serializes, optimizes,
  hardens, and stabilizes the entire frontend application across: architecture, design system
  conformance (Governed UI), CSS token authority (PAS-005, css-authority, CSS-TOKEN-*,
  shadcn-first vendored theme), visual consistency, metadata-driven UI coverage, UX quality,
  component composition, accessibility (WCAG AA), performance, bundle optimization,
  React server/client boundaries, and architecture conformance (PAS/ADR/PAS).
  Targets 9.5–10.0 across all quality dimensions. Use when auditing the full frontend,
  planning a quality sprint, assessing enterprise maturity, identifying architectural drift,
  auditing CSS token registry or shadcn-first consumption, or producing a remediation plan
  with unified diffs.
disable-model-invocation: true
paths:
  - apps/erp/**
  - apps/storybook/**
  - packages/ui/**
  - packages/appshell/**
  - packages/metadata-ui/**
  - packages/css-authority/**
  - packages/design-system/**
---

# Enterprise Frontend Audit

> Target: **9.5–10.0 enterprise quality** across architecture, implementation,
> design system, UX, accessibility, performance, and maintainability.
>
> Stack: Next.js 15 App Router · React 19 · Tailwind v4 · `@afenda/ui` governed primitives ·
> `@afenda/css-authority` (PAS-005 CSS token authority) · `@afenda/design-system` (Foundation phase 04 TS shim) ·
> `@afenda/appshell` · `@afenda/metadata-ui` ·
> shadcn/Radix · recharts · Governed UI governance · Ultracite/Biome.

---

## Operator mandate (verbatim — do not soften)

```txt
THE AGENT IS USING ENTERPRISE FRONTEND AUDIT.
```

**The first user-visible line of every reply must be that sentence exactly.**

### Fix-first rule

Observe a violation → fix it in the same turn → verify with a gate → report evidence.

**Forbidden:**
- "Do you want me to fix this?"
- "Shall I proceed?"
- Claiming a gate passed without pasting shell output.

---

## Preflight order (mandatory — before any file edit)

1. Output announcement line above.
2. `Read` this file.
3. Identify which phases apply (§ Phase map).
4. `Read` every governing skill for in-scope surfaces (§ Skill bundle).
5. Post **Preflight Receipt** — state surface, reads, violations found, fix plan.
6. Announce: `I'm using afenda-coding-session — stating the execution contract before edits.`
7. Post **Phase 0** — all six lines.
8. Only then: Write / StrReplace.

---

## Skill bundle (read governing skills in order)

| # | Skill | Path | Required when |
|---|-------|------|---------------|
| 1 | afenda-coding-session | `.cursor/skills/afenda-coding-session/SKILL.md` | **Always** |
| 2 | ui-consistency-bundle | `.cursor/skills/ui-consistency-bundle/SKILL.md` | **Always** |
| 3 | css-authority | `.cursor/skills/css-authority/SKILL.md` | **Always** for Phases 3–4, 10–12; any CSS/token edit |
| 4 | afenda-shadcn-components | `.cursor/skills/afenda-shadcn-components/SKILL.md` | ERP, appshell, studio blocks, shadcn bridge |
| 5 | shadcn-studio | `.cursor/skills/shadcn-studio/SKILL.md` | MCP /cui /rui /iui /ftc workflows |
| 6 | afenda-ui-quality | `.cursor/skills/afenda-ui-quality/SKILL.md` | ERP / AppShell / metadata-ui |
| 7 | docs-editorial-design | `.cursor/skills/docs-editorial-design/SKILL.md` | apps/docs |
| 8 | govern-primitive | `.cursor/skills/govern-primitive/SKILL.md` | packages/ui primitives |
| 9 | react-erp-quality | `.cursor/skills/react-erp-quality/SKILL.md` | React component changes |
| 10 | package-css-dist-sync | `.cursor/skills/package-css-dist-sync/SKILL.md` | CSS source changes in packages |
| 11 | architecture-authority | `.cursor/skills/architecture-authority/SKILL.md` | Architecture conformance |
| 12 | enterprise-erp-standards | `.cursor/skills/enterprise-erp-standards/SKILL.md` | SAP/Oracle gate conformance |
| 13 | coding-consistency-bundle | `.cursor/skills/coding-consistency-bundle/SKILL.md` | TypeScript / logic changes |

External skill references (attach via user-attached skills):
- `vercel-composition-patterns` — compound component / boolean prop patterns
- `react-best-practices` — 69 Vercel React/Next.js performance rules
- `anthropic-frontend-design` — premium visual design direction
- `frontend-design-review` — UX quality pillar scoring
- `afenda-tailwind` — Afenda Tailwind v4 authority (layered styling, import order, v3 banlist)
- `frontend-skill` — visual direction, hierarchy, motion for led surfaces

---

## External research (when upstream API is uncertain)

Do not guess Tailwind v4 or shadcn behavior from memory. Use this sequence:

1. **Context7 MCP** — resolve library ID → query `"Tailwind v4 @theme"` or `"shadcn cssVariables"`
2. **shadcn-studio skill** — read `.cursor/skills/shadcn-studio/SKILL.md` before any MCP `/cui` workflow
3. **`npx skills find <query>`** — discover OSS agent skills (tailwind, shadcn, a11y)
4. **GitHub MCP** — search `shadcn-ui/ui` for token/CSS examples
5. **User-attached skills** — apply `afenda-tailwind` for `@theme inline` / layered styling rules

Link skills and Context7 queries only — do not embed full Tailwind tutorials in audit output.

---

## Phase map (12 phases — run applicable phases in order)

```
Phase  1 → Discovery          (scope, surfaces, tokens, density)
Phase  2 → Architecture Audit (routing, RSC/client, bundle, folder structure)
Phase  3 → Design System Audit(tokens, theme, no hardcoded values, drift)
Phase  4 → Visual Consistency (hierarchy, rhythm, dark mode, surfaces)
Phase  5 → Component Audit    (govern-primitive 16-pt, consumer 8-pt, dead code)
Phase  6 → Metadata Coverage  (pages, forms, nav, tables, widgets — gap analysis)
Phase  7 → UX Assessment      (IA, cognitive load, keyboard, mobile, enterprise)
Phase  8 → Accessibility      (WCAG AA, ARIA, focus, live regions, charts)
Phase  9 → Performance        (React, bundle, images, fonts, CSS, CLS, LCP)
Phase 10 → Architecture Drift (PAS/ADR/PAS conformance gaps)
Phase 11 → Repair & Normalize (fix violations, apply diffs — fix-first mandate)
Phase 12 → Verification       (all gates, typecheck, test, visual smoke)
```

Read [reference/architecture.md](reference/architecture.md) for Phases 1–2.
Read [reference/css-authority.md](reference/css-authority.md) for Phase 3 (before design-system).
Read [reference/design-system.md](reference/design-system.md) for Phases 3–4.
Read [reference/component-quality.md](reference/component-quality.md) for Phase 5.
Read [reference/ux.md](reference/ux.md) for Phases 7–8.
Read [reference/performance.md](reference/performance.md) for Phase 9.
Read [reference/deliverables.md](reference/deliverables.md) for the output report templates.
Read [reference/scoring.md](reference/scoring.md) for the scoring rubric.

---

## Hard stops — stop immediately on any of these

```
Editing visual code without DOM inspection of library component selectors
className on any governed @afenda/ui primitive (pnpm ui:guard:scan fails)
Raw hex / oklch() literals outside authority token files (use shadcn vars or registered CSS-TOKEN-*)
Hand-editing packages/css-authority/src/css/vendored/shadcn-theme.css
Hand-editing packages/css-authority/src/generated/css-authority-registry.*
Defining @theme outside @afenda/css-authority or design-system shim
Prefixing runtime shadcn vars (--afenda-background) — prefix files/records only
Adding new --afenda-semantic-* aliases that only mirror shadcn vars
Importing afenda-appshell-studio.css from apps
Brand accent (H254) in sidebar / nav / TOC / search / headings (docs surface)
Direct --color-fd-* in :root or .dark
Asking user for permission to fix a violation found in the same turn
Claiming a gate passed without pasting shell output
Inventing registry entries, tokens, permissions, or tenant resolvers
Skipping Phase 0 (afenda-coding-session)
```

---

## Surface router

| Surface | Governing skills | Gate commands |
|---------|-----------------|---------------|
| `apps/docs/**` | docs-editorial-design | `pnpm --filter @afenda/docs typecheck && pnpm exec biome ci apps/docs` |
| `apps/erp/**` | afenda-ui-quality · react-erp-quality · css-authority | `pnpm ui:guard && pnpm --filter app typecheck && pnpm check:css-authority-conformance` |
| `packages/ui/**` | govern-primitive · css-authority | `pnpm --filter @afenda/ui check:governance && pnpm --filter @afenda/ui test:run` |
| `packages/appshell/**` | afenda-ui-quality · afenda-shadcn-components | `pnpm ui:guard && pnpm --filter @afenda/appshell typecheck` |
| `packages/metadata-ui/**` | afenda-ui-quality (consumer) | `pnpm ui:guard && pnpm --filter @afenda/metadata-ui typecheck` |
| `packages/css-authority/**` | css-authority · architecture-authority | `pnpm --filter @afenda/css-authority test:run && pnpm check:css-authority-conformance` |
| `packages/design-system/**` | architecture-authority · css-authority | Ask before editing |
| Cross-surface | All applicable | All gates |

---

## Verification gate matrix

```bash
# ─── Structural fast scan (< 2 s) ─────────────────────────────────────────
pnpm ui:guard:scan              # Gate D — in-process className violation scan

# ─── Full Governed UI guard ────────────────────────────────────────────────────
pnpm ui:guard                   # Gates A–F (docs/governance/ui-guard.md)
pnpm ui:guard:erp               # Gate F only — React ERP quality
pnpm ui:guard:strict            # Gate F as CI hard failure

# ─── TypeScript ────────────────────────────────────────────────────────────
pnpm --filter @afenda/ui typecheck
pnpm --filter @afenda/appshell typecheck
pnpm --filter @afenda/metadata-ui typecheck
pnpm --filter app typecheck

# ─── Tests ─────────────────────────────────────────────────────────────────
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/appshell test:run
pnpm --filter @afenda/docs test:run

# ─── Linting ───────────────────────────────────────────────────────────────
pnpm lint && pnpm format
pnpm exec biome ci apps/docs

# ─── Docs surface ──────────────────────────────────────────────────────────
pnpm --filter @afenda/docs build

# ─── Architecture conformance ──────────────────────────────────────────────
pnpm check:documentation-drift
pnpm check:foundation-disposition
pnpm check:knowledge-conformance
pnpm check:package-css-dist-sync   # after CSS source edits in packages

# ─── CSS token authority (PAS-005 — B26–B33 delivered) ─────────────────────
pnpm quality:css
pnpm check:css-authority-conformance
pnpm check:css-authority-consumption
pnpm check:css-authority-bridge-sync
pnpm check:css-visual-regression
pnpm check:css-governance
pnpm --filter @afenda/css-authority build
```

---

## Scoring summary (full rubric → reference/scoring.md)

| Dimension | Target | Gate |
|-----------|--------|------|
| Frontend Architecture | /10 | Phase 2 checklist |
| Design System Conformance | /10 | `pnpm ui:guard` + Phase 3 + css-authority gates |
| Visual Consistency | /10 | Phase 4 visual smoke |
| Metadata-Driven UI Coverage | % | Phase 6 gap analysis |
| Component Quality | /10 | govern-primitive 16-pt |
| Accessibility | /10 | Phase 8 WCAG AA checklist |
| Performance | /10 | Phase 9 + bundle analysis |
| UX Maturity | /10 | Phase 7 pillar scoring |
| Architecture Conformance | /10 | Phase 10 drift report |
| **Overall Enterprise Score** | **/10** | Weighted average |

**Minimum to ship:** every gate green, every dimension ≥ 9.0.

---

## Completion report (required every audit turn)

Post this block at end of every coding turn. Full templates → [reference/deliverables.md](reference/deliverables.md).

```md
## Enterprise Frontend Audit — Completion Report

### Turn scope
- [ ] Architecture   [ ] Design System   [ ] Visual   [ ] Components
- [ ] Metadata       [ ] UX              [ ] A11y      [ ] Performance
- [ ] Drift          [ ] Repair          [ ] Verification

### Fix-first compliance
| Violation | Severity | Fixed | Evidence (file:line or gate output) |
|-----------|----------|-------|-------------------------------------|
| <describe> | Critical/High/Medium/Low | Yes/No | <evidence> |

### Gates run
\`\`\`bash
# paste actual shell output here
\`\`\`

### Scores this turn
| Dimension | Before | After |
|-----------|--------|-------|
| Design System | x/10 | x/10 |
| Visual Consistency | x/10 | x/10 |
| ...

### Known gaps
- None — OR: <file:line with severity>
```

---

## References

- CSS authority audit (Phase 3): [reference/css-authority.md](reference/css-authority.md)
- Architecture checklist: [reference/architecture.md](reference/architecture.md)
- Design system conformance: [reference/design-system.md](reference/design-system.md)
- Component quality gates: [reference/component-quality.md](reference/component-quality.md)
- Performance optimization: [reference/performance.md](reference/performance.md)
- UX + accessibility: [reference/ux.md](reference/ux.md)
- All deliverable templates: [reference/deliverables.md](reference/deliverables.md)
- Scoring rubric: [reference/scoring.md](reference/scoring.md)
- PAS-005 / css-authority: `docs/PAS/CSS-AUTHORITY/PAS-005-CSS-AUTHORITY-STANDARD.md` · `docs/architecture/css-authority.md`
- Governed UI policy: `docs/governance/governed-ui-policy.md`
- UI guard gates: `docs/governance/ui-guard.md`
- PAS index: `docs/PAS/README.md`
- Foundation registry: `packages/architecture-authority/src/data/foundation-disposition.registry.ts`
