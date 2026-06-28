---
name: ui-consistency-bundle
description: >
  Project-wide UI consistency enforcement for Afenda ERP.
  Single entrypoint that routes to the correct visual authority skill based on
  the surface being edited: docs editorial (apps/docs) or ERP governed primitives
  (apps/erp, packages/ui, packages/appshell, packages/metadata-ui).
  Mandates fix-first policy — agent inspects DOM, finds violation, fixes it before
  any turn ends. No permission asking. No "do you want me to apply that fix?".
  Includes visual conformance checklist, hard stops, and completion scoring.
  Use whenever touching CSS, component visual props, tokens, or any UI surface.
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

<!--
Operator mandate (verbatim — recorded 2026-06-28 — do not paraphrase or soften):

im not only demaing for docs, am demading for a ui conssintency as the project...
u son of bith agent, u shold hvae done the fix ebfore i told u so
-->

# UI Consistency Bundle

Single entrypoint for all visual / UI work across the Afenda ERP monorepo.

---

## Mandatory preflight (first — before any file edit)

**When this skill is attached, invoked, or named:** The **first user-visible line** of the agent reply must be exactly (operator mandate — same words, same order):

```txt
THE AGENT IS USING UI CONSISTENCY BUNDLE..
```

No preamble. No edits before this line and the preflight receipt.

### Fix-first mandate (operator mandate — do not soften)

> *"u son of bith agent, u shold hvae done the fix ebfore i told u so"*

**The agent must:**

1. Find the visual violation.
2. Inspect the actual rendered markup or real CSS (not assume from memory).
3. Fix it in the same turn.
4. Verify it passes gates.
5. Only then end the turn.

**Forbidden:**
- "Do you want me to apply that fix?"
- "Should I proceed with the correction?"
- "Let me know if you'd like me to update this."
- Claiming something is fixed without running a gate or reading the changed file.

If the agent cannot fix (blocked by authority boundary or missing handoff): post a **Blocker Report** — never an open-ended question.

---

## Preflight order

1. Output the announcement line above.
2. `Read` this file (`.cursor/skills/ui-consistency-bundle/SKILL.md`).
3. Identify the surface (§ Surface router below) — `Read` the governing skill.
4. `Read` every skill the user **attached or named** in the message.
5. Post **Preflight Receipt** — [reference/preflight-receipt.md](reference/preflight-receipt.md).
6. Announce: `I'm using afenda-coding-session — stating the execution contract before edits.`
7. Post **Phase 0** — all six lines from afenda-coding-session §0.
8. Run **DOM inspection** before writing any CSS override (§ DOM-first rule).

Only then: Write / StrReplace / EditNotebook / Delete.

### Hard stop

If the agent edited files, claimed a gate, or skipped preflight: stop immediately, paste [reference/hard-stop.md](reference/hard-stop.md), restart in next reply.

---

## Surface router

Read the **correct governing skill** based on what files change:

| Surface | Files | Governing skill | Required reads |
|---------|-------|-----------------|---------------|
| **Docs editorial** | `apps/docs/**` | `docs-editorial-design` | `.cursor/skills/docs-editorial-design/SKILL.md` |
| **ERP app UI** | `apps/erp/**` | `afenda-ui-quality` + `react-erp-quality` + `afenda-tailwind` | `.cursor/skills/afenda-ui-quality/SKILL.md` + `.cursor/skills/afenda-tailwind/SKILL.md` |
| **UI primitives** | `packages/ui/**` | `govern-primitive` + `afenda-tailwind` | `.cursor/skills/govern-primitive/SKILL.md` + `.cursor/skills/afenda-tailwind/SKILL.md` |
| **AppShell chrome** | `packages/appshell/**` | `afenda-ui-quality` + `afenda-shadcn-components` + `afenda-tailwind` | `.cursor/skills/afenda-ui-quality/SKILL.md` + `.cursor/skills/afenda-tailwind/SKILL.md` |
| **Studio / shadcn blocks** | `packages/appshell/src/shadcn-studio/**` | `afenda-shadcn-components` + `shadcn-studio` | both SKILL.md files |
| **Metadata UI** | `packages/metadata-ui/**` | `afenda-ui-quality` (consumer layer) | `.cursor/skills/afenda-ui-quality/SKILL.md` |
| **CSS authority** | `packages/css-authority/**` | `css-authority` + `afenda-tailwind` | `.cursor/skills/css-authority/SKILL.md` + `.cursor/skills/afenda-tailwind/SKILL.md` |
| **Design tokens (shim)** | `packages/design-system/**` | `architecture-authority` + `css-authority` + `afenda-tailwind` | `.cursor/skills/architecture-authority/SKILL.md` + `.cursor/skills/afenda-tailwind/SKILL.md` |
| **Accessibility pass** | Any interactive UI, MCP blocks, stories | `afenda-accessibility` | `.cursor/skills/afenda-accessibility/SKILL.md` |
| **Cross-surface** | Multiple packages | All applicable skills above | Read all |

**Unknown surface** → stop with Blocker Report. Do not guess.

---

## DOM-first rule

Before writing any CSS selector or className override for a library component (Fumadocs, Radix, shadcn):

1. Read the library's compiled dist file to find **actual class names and data attributes** in the rendered markup.
2. State which dist file was read and what the real selector is.
3. Only then write the CSS.

**Evidence from this repo's history — selectors that were wrong without DOM inspection:**

| Assumed | Real (Fumadocs 16) | Consequence |
|---------|-------------------|-------------|
| `.nd-card` | `[data-card]` | Card underlines survived for 3 turns |
| `.prose a` (no exclusion) | needed `:where(:not([data-card]))` | Every card link became underlined |

Dist file to check: `apps/docs/node_modules/fumadocs-ui/dist/components/<name>.js`

---

## Visual conformance checks (run after every edit)

Full checklist: [reference/visual-checks.md](reference/visual-checks.md)

### Critical checks by surface

**Docs (`apps/docs/`)**

```
[ ] No underline on card link title or description — only on inline prose <a>
[ ] No brand accent (H254) on card title/hover background/sidebar/TOC/nav
[ ] h2 is sans-serif, no border-bottom (border-bottom reads as underline)
[ ] Page title (DocsTitle) is one serif H1 — breadcrumb excludes current page
[ ] Dark mode: deep graphite canvas, warm ivory text, hairline borders
[ ] No solid primary block on feedback highlight selection
[ ] Fumadocs fd-* bridge uses @theme inline (not @theme)
[ ] No direct --color-fd-* literals in :root or .dark
```

**ERP / AppShell (`apps/erp/`, `packages/appshell/`)**

```
[ ] No className on governed @afenda/ui primitives (pnpm ui:guard:scan)
[ ] Semantic colors use shadcn vars (var(--foreground), var(--muted-foreground), var(--border))
[ ] Layout/spacing may use var(--afenda-spacing-*) until extension cutover
[ ] No raw hex/oklch outside authority token files
[ ] One accent color (var(--primary)), 3-5 placements per viewport
[ ] No purple/cyan gradients, no glass/blur effects, no emoji icons
[ ] tabular-nums on all numeric data cells
[ ] Status cells: dot + text — no filled color pill backgrounds
[ ] focus-visible ring on all interactive elements
```

**Primitives (`packages/ui/`)**

```
[ ] resolvePrimitiveGovernance() is the ONLY class authority
[ ] {…governed.dataAttributes} is always last in prop spread
[ ] pnpm --filter @afenda/ui check:governance passes
[ ] No "use client" unless client APIs genuinely required
```

---

## Bundle table

Read applicable rows **before** any file edit:

| # | Skill | Path | When required |
|---|-------|------|---------------|
| 1 | afenda-coding-session | `.cursor/skills/afenda-coding-session/SKILL.md` | **Always** |
| 2 | Verification gates | `.cursor/skills/afenda-coding-session/VERIFICATION.md` | **Always** |
| 3 | AGENTS.md (Ultracite) | `AGENTS.md` | **Always** |
| 4 | docs-editorial-design | `.cursor/skills/docs-editorial-design/SKILL.md` | `apps/docs/**` |
| 5 | afenda-ui-quality | `.cursor/skills/afenda-ui-quality/SKILL.md` | `apps/erp/**`, `packages/appshell/**`, `packages/metadata-ui/**` |
| 6 | govern-primitive | `.cursor/skills/govern-primitive/SKILL.md` | `packages/ui/**` or new primitive |
| 7 | react-erp-quality | `.cursor/skills/react-erp-quality/SKILL.md` | React component changes in erp/appshell |
| 8 | package-css-dist-sync | `.cursor/skills/package-css-dist-sync/SKILL.md` | Any `src/` CSS in `packages/appshell`, `packages/ui`, `packages/metadata-ui` |
| 9 | coding-consistency-bundle | `.cursor/skills/coding-consistency-bundle/SKILL.md` | When TypeScript or logic changes accompany visual work |
| 10 | css-authority | `.cursor/skills/css-authority/SKILL.md` | Any CSS token, custom property, or vendored theme work |
| 11 | afenda-shadcn-components | `.cursor/skills/afenda-shadcn-components/SKILL.md` | Studio blocks, bridge vars, promotion pipeline |
| 12 | shadcn-studio | `.cursor/skills/shadcn-studio/SKILL.md` | MCP /cui /rui /iui /ftc workflows only |
| 13 | afenda-accessibility | `.cursor/skills/afenda-accessibility/SKILL.md` | Interactive UI, MCP blocks, a11y tests, Storybook stories |

---

## Hard stops — stop immediately if any of these appear

**Docs surface:**

```
Brand accent (H254/blue) in sidebar / nav / TOC / search / card hover titles / headings
Direct --color-fd-* in :root or .dark (bypass @theme inline bridge)
Underline on card link body text or description
CSS selector that assumes library internals without reading dist file first
Asking permission to fix a visual violation found in the same turn
```

**ERP / AppShell surface:**

```
className on any governed @afenda/ui primitive
Raw hex or oklch() literals outside authority token files
Hand-editing packages/css-authority/src/css/vendored/shadcn-theme.css
Hand-editing packages/css-authority/src/generated/css-authority-registry.*
Defining @theme outside @afenda/css-authority or design-system shim
Prefixing runtime shadcn vars (--afenda-background) — prefix files/records only
Adding new --afenda-semantic-* aliases that only mirror shadcn vars
Importing afenda-appshell-studio.css from apps
gradient / glass / blur / emoji icon introduced
pnpm ui:guard:scan fails after claiming "done"
Claiming a gate passed without pasting Shell output
```

**Any surface:**

```
Editing visual code without running the surface's verification gate
Ending a turn with known visual violations found but not fixed
"Do you want me to fix this?" after observing a violation
```

---

## Verification gates by surface

**Docs:**

```bash
pnpm --filter @afenda/docs test:run
pnpm --filter @afenda/docs test:visual   # computed-style gate in Chromium
pnpm exec biome ci apps/docs
# Visual smoke: hard refresh dark + light mode
```

**ERP / AppShell:**

```bash
pnpm ui:guard:scan              # < 2s fast check
pnpm ui:guard                   # all six gates A–F
pnpm check:css-authority-conformance
pnpm check:css-authority-consumption
pnpm check:css-authority-bridge-sync
pnpm check:css-visual-regression
pnpm quality:css
pnpm check:css-governance
pnpm check:package-css-dist-sync   # after package CSS src edits
pnpm --filter app typecheck     # if apps/erp changed
pnpm --filter @afenda/appshell typecheck
pnpm lint && pnpm format
```

**Primitives:**

```bash
pnpm --filter @afenda/ui check:governance
pnpm --filter @afenda/ui typecheck
pnpm --filter @afenda/ui test:run
pnpm --filter @afenda/ui build
```

---

## Completion report (required every turn)

Post after every coding turn that touches UI:

```md
## UI Consistency Completion Report

### Surface
- [ ] Docs editorial (apps/docs)
- [ ] ERP / AppShell
- [ ] UI primitives

### Fix-first compliance
| Violation found | Fixed in this turn | Evidence |
|----------------|--------------------|----------|
| <describe> | Yes/No | <file:line or gate output> |

### Visual conformance
| Check | Result |
|-------|--------|
| No brand accent in shell chrome | Pass/Fail |
| No underlines on card/nav/chrome links | Pass/Fail |
| Hover uses neutral surface-hover only | Pass/Fail |
| Dark mode: graphite + ivory, no neon | Pass/Fail |
| DOM inspected before selector written | Pass/Fail |
| No permission asked for found violations | Pass/Fail |

### Gates run
```bash
# paste actual shell output
```

### Known gaps
- None / <list with file:line>
```

---

## References

- Shared CSS authority contract: `.cursor/skills/enterprise-frontend-audit/reference/css-authority.md`
- Preflight receipt template: [reference/preflight-receipt.md](reference/preflight-receipt.md)
- Hard-stop script: [reference/hard-stop.md](reference/hard-stop.md)
- Full visual checks: [reference/visual-checks.md](reference/visual-checks.md)
- DOM inspection guide: [reference/dom-inspector.md](reference/dom-inspector.md)
- **Visual verification gate (run this):** [reference/visual-verification.md](reference/visual-verification.md)
- Docs editorial authority: `.cursor/skills/docs-editorial-design/SKILL.md`
- ERP/AppShell authority: `.cursor/skills/afenda-ui-quality/SKILL.md`
- Primitive authority: `.cursor/skills/govern-primitive/SKILL.md`

---

## Verification

Turn is complete only when:

1. Preflight announcement + receipt posted before first edit
2. Phase 0 and UI Consistency Completion Report posted
3. Surface gate commands run — output pasted (see **Verification gates by surface** above)
4. Fix-first: every violation found in-turn is fixed or escalated via Blocker Report

Hard fail: `className` on governed primitive after claim of done; gate claimed without Shell output; permission asked for a found violation.
