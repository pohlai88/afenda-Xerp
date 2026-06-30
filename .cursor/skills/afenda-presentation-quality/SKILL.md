---
name: afenda-presentation-quality
description: ERP presentation quality composer for PAS-006 work. Use when touching apps/erp UI, packages/shadcn-studio blocks, Storybook presentation stories, or metadata operator surfaces. Composes shadcn-studio authority with review and performance skills — replaces retired ui-consistency-bundle and ui:guard for ERP.
paths:
  - apps/erp/**
  - packages/shadcn-studio/**
  - apps/storybook/**
---

# Afenda Presentation Quality (PAS-006)

Thin composer — **does not duplicate** PAS-006 authority. Read child skills in order when doing ERP presentation work.

## When to use

| Trigger | Read first |
| --- | --- |
| MCP block install / studio package edit | `shadcn-studio/SKILL.md` |
| ERP metadata operator route | `shadcn-studio/SKILL.md` + IS-003 consumer gate |
| Storybook presentation lab | `afenda-storybook/SKILL.md` |
| Component structure review | `vercel-composition-patterns` (vendor) |
| React/TS review before merge | `typescript-react-reviewer` (vendor) |
| RSC performance | `vercel-react-best-practices/react-best-practices` (vendor) |

## Mandatory gates (ERP — ADR-0027)

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/erp typecheck
pnpm check:studio-metadata-binding      # block registry / binding changes
pnpm check:studio-block-slot-markers    # data-afenda-slot markers
pnpm check:erp-metadata-pas006-consumer # ERP operator surface parity
pnpm sync:package-css-dist -- --package @afenda/shadcn-studio  # after CSS src edits
pnpm check:package-css-dist-sync
```

## Retired — do not run for ERP

| Retired | Replacement |
| --- | --- |
| `pnpm ui:guard*` | PAS-006 gates above |
| `ui-consistency-bundle` | This skill + `shadcn-studio` |
| `govern-primitive` | N/A — `@afenda/ui` removed (ADR-0027) |
| `css-authority` / PAS-005 slices | `shadcn-studio` CSS chain |

## Layer order

1. `packages/shadcn-studio` — manufacturing (blocks, binding, CSS)
2. `apps/erp/src/lib/metadata` — consumer hydration (IS-003)
3. `apps/erp` route pages — compose templates only
4. `apps/storybook` — presentation lab (optional verify)

## Hard stops

- No `@afenda/kernel` imports in `@afenda/shadcn-studio`
- No parallel metadata binding registries in ERP
- No restoration of `@afenda/ui` / appshell without new ADR

## References

- North star: `docs/NORTHSTAR/shadcn-studio-presentation-north-star.md`
- Blueprint: `docs/BLUEPRINT/shadcn-studio-presentation-blueprint.md`
- PAS-006: `docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md`
- Lane boundaries: `docs/PAS/DEVELOPMENT-LANE-BOUNDARIES.md`
