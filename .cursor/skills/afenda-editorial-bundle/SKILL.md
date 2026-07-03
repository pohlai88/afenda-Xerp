---
name: afenda-editorial-bundle
description: >-
  Mandatory preflight bundle for Afenda editorial UI work — Swiss Noir, Verdant
  Milk Noir, Presentation Lab, cinematic noir, not ordinary surfaces. Use when
  attached, invoked as /afenda-editorial-bundle, or when editorial trigger terms
  appear alongside a code edit. Stacks on coding-consistency-bundle; requires
  design plan before edits and Storybook preview evidence before completion.
paths:
  - packages/shadcn-studio/docs/**
  - packages/shadcn-studio/src/storybook/**
  - packages/shadcn-studio/docs/swiss-noir.css
  - packages/shadcn-studio/docs/verdant-noir.css
  - apps/storybook/stories/presentation-lab*
  - apps/storybook/stories/erp-workspace-dashboard-*-noir*
---

# Afenda Editorial Bundle

Single entrypoint for **governed editorial UI** implementer agents. Stacks on [`coding-consistency-bundle`](../coding-consistency-bundle/SKILL.md) — run that bundle first for any repo file edit.

**Do not use** for generic Phase 1 ERP surfaces — use `afenda-presentation-quality` + `shadcn-studio` instead.

**Do not use** shadcn `/iui` or OSS `frontend-design` as aesthetic source of truth.

**Do not merge** into `afenda-presentation-quality`. **Do not modify** ERP `/sign-in` unless promotion **C-erp** + explicit user request.

## Trigger phrases

Use this bundle when the user request includes any of:

```txt
Swiss Noir
Verdant Milk Noir
editorial
cinematic
noir
control room
verification chamber
identity vault
ghost hero
floating jewel
gold hairline
Presentation Lab
Auth Login Lab
sign-in chamber
operator identity
not ordinary
login page pattern
```

If these terms appear together with a code edit request, this bundle is **mandatory** before editing.

## Conditional row decision

| Row | Required when |
| --- | --- |
| 1 afenda-editorial-lab | **Always** |
| 2 afenda-editorial-compose | **Always** |
| 3 pattern-and-doctrine | Selecting, creating, or modifying a pattern |
| 4 workflow-templates | Before first edit (implementing) |
| 5 afenda-storybook | Storybook story created, changed, or used as proof |
| 6 afenda-presentation-promotion | User explicitly asks to promote, wire into ERP, or make production |
| 7 package-css-dist-sync | `docs/swiss-noir.css` or `docs/verdant-noir.css` edited |
| 8 editorial-login-quality | Auth Login Lab, login contracts, sign-in patterns, or login quality |

## Mandatory preflight (before editorial file edit)

**When attached, invoked, or editorial code edit is required:** the **first editorial-specific line** after coding-consistency-bundle preflight must be exactly:

```txt
THE AGENT IS USING AFENDA EDITORIAL BUNDLE.
```

### Preflight order

1. Complete [`coding-consistency-bundle`](../coding-consistency-bundle/SKILL.md) steps 1–7 (announcement, reads, Phase 0).
2. Output the editorial announcement line above.
3. `Read` this file.
4. `Read` every **applicable** row from the bundle table below (see conditional row decision).
5. Post **Preflight Receipt** — [reference/preflight-receipt.md](reference/preflight-receipt.md).
6. Post **design plan** from [afenda-editorial-compose/reference/workflow-templates.md](../afenda-editorial-compose/reference/workflow-templates.md) with `Design plan: written yes` in Phase 0.

**Only then** may the agent edit editorial lab files.

### Hard stop

Stop if:

- Editorial edit before editorial bundle `Read` + design plan
- `Design plan: written yes` missing before first Write/StrReplace
- Completion report lacks **preview evidence** (Storybook URL or MCP `preview-stories` result)
- shadcn `/iui` used as final Afenda editorial pattern

Restart from step 1.

---

## Bundle table

| # | Skill / doc | Path | When required |
| --- | --- | --- | --- |
| 1 | afenda-editorial-lab | `.cursor/skills/afenda-editorial-lab/SKILL.md` | **Always** — taste + SSOT read order |
| 2 | afenda-editorial-compose | `.cursor/skills/afenda-editorial-compose/SKILL.md` | **Always** — workflow + failure modes |
| 3 | Pattern + doctrine | `.cursor/skills/afenda-editorial-lab/reference/pattern-and-doctrine.md` | Pattern/preset selection |
| 4 | Workflow templates | `.cursor/skills/afenda-editorial-compose/reference/workflow-templates.md` | Before first edit |
| 5 | afenda-storybook | `.cursor/skills/afenda-storybook/SKILL.md` | Story create/change |
| 6 | afenda-presentation-promotion | `.cursor/skills/afenda-presentation-promotion/SKILL.md` | User says promote / wire ERP sign-in |
| 7 | package-css-dist-sync | `.cursor/skills/package-css-dist-sync/SKILL.md` | `docs/swiss-noir.css` or `docs/verdant-noir.css` edited |
| 8 | Editorial login quality | `.cursor/skills/using-afenda-skills/reference/editorial-login-quality.md` | Auth Login Lab / login contract / pattern bridge |

**Promotion:** row 6 only on explicit trigger (`disable-model-invocation: true` on that skill). A-lab / B-auth-shell must not modify ERP `/sign-in`.

---

## Editorial Phase 0 extensions

Add to afenda-coding-session Phase 0 objective block:

```txt
Surface: [presentation-landing | login | dashboard | auth-block | comparison-lab]
Pattern id: [registry id or preset id]
Preset: [afenda-brand | afenda-verdant]
Promotion stage: [A-lab | B-auth-shell | C-erp | none]
Design plan: written yes
```

---

## Completion requirements

Editorial tasks are **incomplete** without:

1. **Preview evidence** in Completion Report — Storybook URL or Storybook MCP `preview-stories` result
2. Promotion stage stated (`A-lab | B-auth-shell | C-erp | none`)
3. Gates from afenda-editorial-compose Verification (when paths touched)
4. Known gaps from workflow-templates copied when applicable

Example report: [workflow-templates.md](../afenda-editorial-compose/reference/workflow-templates.md)

---

## Verification

- [ ] coding-consistency-bundle preflight completed first
- [ ] Editorial announcement + receipt before first editorial edit
- [ ] Design plan posted with `Design plan: written yes`
- [ ] Preview evidence in §11 Completion Report
- [ ] No ERP `/sign-in` change unless promotion **C-erp** + explicit user request
