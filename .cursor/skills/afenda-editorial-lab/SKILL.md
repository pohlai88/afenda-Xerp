---
name: afenda-editorial-lab
description: >-
  Defines Afenda editorial visual authority for Swiss Noir, Verdant Milk Noir,
  Presentation Lab, verification chamber, identity vault, control room, ghost hero,
  floating jewel, gold hairline, cinematic noir, and not ordinary interface design.
  Use before any editorial UI work — routes taste and pattern selection; not generic
  SaaS, OSS frontend-design, or shadcn /iui as aesthetic source of truth.
paths:
  - packages/shadcn-studio/docs/**
  - packages/shadcn-studio/src/storybook/**
  - packages/shadcn-studio/src/styles/themes/**
  - apps/storybook/stories/presentation-lab*
  - apps/storybook/stories/erp-workspace-dashboard-*-noir*
---

# Afenda Editorial Lab

Taste constitution layer. Standard: **taste constitution + pattern router + contract implementation + visual proof gate.**

**Companion:** [afenda-editorial-compose](../afenda-editorial-compose/SKILL.md) (implement) · [pattern-and-doctrine.md](reference/pattern-and-doctrine.md) (detail)

**Do not merge** with `afenda-presentation-quality` (Phase 1 stock-shadcn only).

## Invocation boundary

This skill is normally read through [afenda-editorial-bundle](../afenda-editorial-bundle/SKILL.md).

For repo file edits, do not use this skill alone. The required path is:

```txt
coding-consistency-bundle
→ afenda-editorial-bundle
→ afenda-editorial-lab
→ afenda-editorial-compose
```

Use this skill directly only for analysis, review, or doctrine clarification without file edits.

## Quick start

1. Classify surface → select pattern/preset ([reference](reference/pattern-and-doctrine.md))
2. Read SSOT sources below (in order)
3. Post design plan + promotion stage (`A-lab | B-auth-shell | C-erp | none`)
4. Hand off to [afenda-editorial-compose](../afenda-editorial-compose/SKILL.md) before edits

## Decision path (verbatim)

```txt
Before code, classify the surface.
Before layout, select the editorial doctrine.
Before styling, read the registry and contract.
Before completion, produce Storybook proof.
If no proof, the task is incomplete.
```

Do **not** say: "Make it beautiful" / "Use Swiss Noir" / "Make it editorial" / "Make it premium."

## Mandatory read order

Stop and report if any source is missing — do not invent doctrine.

1. `packages/shadcn-studio/src/storybook/auth-pattern-lab.registry.ts`
2. `packages/shadcn-studio/docs/swiss.noir.md`
3. `packages/shadcn-studio/docs/verdant.noir.md`
4. `packages/shadcn-studio/docs/auth-ingress-ecosystem.md`
5. `packages/shadcn-studio/src/styles/themes/swiss-noir.css`
6. `packages/shadcn-studio/src/styles/themes/verdant-noir.css`
7. `packages/shadcn-studio/src/storybook/presentation-lab/presentation-lab.noir.contract.ts`
8. `packages/shadcn-studio/src/storybook/presentation-lab/presentation-lab.contract.ts`
9. `packages/shadcn-studio/src/storybook/presentation-lab/presentation-lab-login.contract.ts`

## Hard stops

- No pattern/preset selected for editorial work
- TSX color invention (hex, oklch, rgb)
- Global `:root` / `.dark` CSS without approval ([figma-design-system-rules.mdc](../../rules/figma-design-system-rules.mdc))
- ERP `/sign-in` change without [afenda-presentation-promotion](../afenda-presentation-promotion/SKILL.md) **C-erp** + explicit user request
- shadcn `/iui` as final editorial pattern
- P2–P6 as editorial source (contrast baselines only)
- `@afenda/auth` inside `@afenda/shadcn-studio`
- Blending Swiss Noir and Verdant Milk Noir on one surface unless comparison story or explicit design exploration ([primary pattern rule](reference/pattern-and-doctrine.md))

## Output (task incomplete without all)

1. Pattern + preset id (registry IDs, not story export names)
2. Selection reason
3. Design plan (before code)
4. Files changed
5. **Preview evidence:** Storybook URL or Storybook MCP `preview-stories` result
6. Acceptance checklist
7. Risks + promotion stage (`A-lab | B-auth-shell | C-erp | none`)

## Verification

- [ ] SSOT sources read
- [ ] Pattern/preset id from [reference table](reference/pattern-and-doctrine.md)
- [ ] Storybook target named
- [ ] Preview evidence captured
- [ ] Promotion stage declared (`A-lab | B-auth-shell | C-erp | none`)
