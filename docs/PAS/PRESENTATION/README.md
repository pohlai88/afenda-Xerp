# PAS-006 Presentation — slice index

**Authority:** [PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md](PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md)  
**Constitutional ADR:** [ADR-0027](../../adr/ADR-0027-frontend-presentation-reset.md)  
**Runtime owner:** `@afenda/shadcn-studio`  
**Status index:** [pas-status-index.md](../pas-status-index.md#pas-006-shadcnstudio-frontend-standard--active)

---

## Scope (post-nuclear reset)

| In scope | Out of scope |
|----------|--------------|
| MCP → shadcn-studio → ERP/Storybook chain | Reviving `@afenda/ui`, appshell, metadata-ui |
| Block inventory + theme presets | metadata-ui workspace (greenfield later) |
| `pnpm check:downstream-integration` | Legacy `ui:guard*` / PAS-005 slice execution |

---

## Runtime evidence

- `packages/shadcn-studio/`
- `apps/erp/src/app/globals.css` (PAS-006 three-layer CSS)
- `apps/storybook/` (shadcn-studio lab only)
- `docs/NORTHSTAR/shadcn-studio-presentation-north-star.md`
- `docs/BLUEPRINT/shadcn-studio-presentation-blueprint.md`

---

## Gates

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/erp build
pnpm check:downstream-integration
pnpm sync:package-css-dist
pnpm check:package-css-dist-sync
```

---

## Agent entry

- Skill: [`.cursor/skills/shadcn-studio/SKILL.md`](../../.cursor/skills/shadcn-studio/SKILL.md)
- Bundle: `coding-consistency-bundle` (implementers only)

**Retired for ERP:** `ui-consistency-bundle`, `govern-primitive`, `css-authority` — see `.cursor/skills/_retired/legacy-ui/`.
