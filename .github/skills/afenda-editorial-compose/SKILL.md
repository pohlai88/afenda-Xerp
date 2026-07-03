---
name: afenda-editorial-compose
description: >-
  Implements governed Afenda editorial UI after afenda-editorial-lab. Enforces
  design-plan-first workflow, contract class names, scoped noir CSS, copy SSOT,
  and mandatory Storybook preview evidence. Use when building or editing Swiss
  Noir, Verdant Milk, Presentation Lab, login chamber, cinematic noir, or not
  ordinary surfaces.
paths:
  - packages/shadcn-studio/src/storybook/**
  - packages/shadcn-studio/docs/swiss-noir.css
  - packages/shadcn-studio/docs/verdant-noir.css
  - apps/storybook/stories/presentation-lab*
  - apps/storybook/stories/erp-workspace-dashboard-*-noir*
---

# Afenda Editorial Compose

**Prerequisite:** [afenda-editorial-lab](../afenda-editorial-lab/SKILL.md) · **Bundle attach:** [afenda-editorial-bundle](../afenda-editorial-bundle/SKILL.md) · **Templates:** [workflow-templates.md](reference/workflow-templates.md)

**Companions:** [afenda-storybook](../afenda-storybook/SKILL.md) · [package-css-dist-sync](../package-css-dist-sync/SKILL.md)

## Quick start

```txt
Preflight → Design plan → Contract-only code → Storybook preview evidence → Completion report
```

## Preflight stack (hard gate)

Missing step = stop.

1. `coding-consistency-bundle`
2. `afenda-editorial-bundle` — announcement `THE AGENT IS USING AFENDA EDITORIAL BUNDLE.` + preflight receipt
3. `afenda-coding-session` Phase 0 (+ editorial fields below)
4. `afenda-editorial-lab` Read
5. This skill Read
6. `afenda-storybook` (story changes)
7. `afenda-presentation-promotion` (promotion terms only)

**Phase 0 extensions:**

```txt
Surface: [presentation-landing | login | dashboard | auth-block | comparison-lab]
Pattern id: [registry id or preset id]
Preset: [afenda-brand | afenda-verdant]
Promotion stage: [A-lab | B-auth-shell | C-erp | none]
Design plan: [written yes/no — must be yes before first edit]
```

## Design plan hard stop

**If `Design plan: written yes` is not in Phase 0 before the first Write/StrReplace, stop.**

Use template in [workflow-templates.md](reference/workflow-templates.md).

## Workflow

| Step | Action |
| --- | --- |
| 1 | Classify surface |
| 2 | Select one pattern ([selection table](reference/workflow-templates.md)) |
| 3 | Post design plan |
| 4 | Implement: CSS = atmosphere · contract = classNames · TSX = structure |
| 5 | Copy via contract SSOT only |
| 6 | Run acceptance checklist |
| 7 | Completion report + **mandatory preview evidence** |

**Implementation rules:**

- Shared CSS only: `docs/swiss-noir.css` / `docs/verdant-noir.css` — no per-pattern `*.visual.css` unless new surface requires isolation
- CSS must be imported at the story/module boundary, not inside shared production TSX, unless the promoted package explicitly owns that CSS import
- Extend existing login files when applicable
- Storybook MCP `preview-stories` after changes

## Known gaps (scope)

Known gaps from [workflow-templates.md](reference/workflow-templates.md) must be copied into the completion report when applicable. Do not silently fix backlog items during unrelated slices.

## Failure modes

Task **fails** if:

- Inline hex/oklch/rgb in TSX
- Login uses P2–P6 as editorial source
- Login has proof strip unless requested
- **Missing preview evidence** in completion report (Storybook URL or Storybook MCP `preview-stories` result)
- Missing promotion stage in report
- ERP `/sign-in` changed in A-lab or B-auth-shell
- Copy inline in TSX (not contract)
- CSS edited without reporting `pnpm sync:package-css-dist`
- Phase 0 lacks `Design plan: written yes` before first edit

## Verification

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm test:run presentation-lab-login.contract   # or nearest matching contract test
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio   # when docs/*.css edited
pnpm check:package-css-dist-sync
```

- [ ] Design plan before first edit
- [ ] Contract classNames in TSX
- [ ] Preview evidence in completion report
- [ ] Known gaps copied when applicable
- [ ] Example format: [workflow-templates.md](reference/workflow-templates.md)
