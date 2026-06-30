---
name: shadcn-studio
description: >-
  shadcn/studio MCP workflow — /cui, /rui, /iui, /ftc block generation, theme
  presets, toolbar, and install paths. Use when using shadcn/studio MCP, PAS-006
  ERP frontend work, generating blocks, or running the studio toolbar.
paths:
  - packages/shadcn-studio/**
  - apps/erp/**
  - apps/storybook/**
---

# shadcn/studio

**Authority:** [PAS-006](../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · [ADR-0027](../../docs/adr/ADR-0027-frontend-presentation-reset.md) · [North Star](../../docs/NORTHSTAR/shadcn-studio-presentation-north-star.md) · **Lanes:** [DEVELOPMENT-LANE-BOUNDARIES](../../docs/PAS/DEVELOPMENT-LANE-BOUNDARIES.md) · `.cursor/rules/shadcn-studio.instructions.mdc`

**Retired for ERP:** PAS-005 family (historical audit only), appshell bridge, `ui:guard*`, governed-ui strip pipeline — **do not parallel** with Kernel PAS-001A work.

---

## Doctrine (ADR-0027)

```text
MCP install (packages/shadcn-studio cwd)
  → @afenda/shadcn-studio/src/components/ui/ + src/components/shadcn-studio/blocks/
  → pnpm storybook generate (auto block stories)
  → import in apps/erp
  → pnpm --filter @afenda/shadcn-studio typecheck
  → pnpm --filter @afenda/erp typecheck && build
```

**ERP CSS:** `apps/erp/src/app/globals.css` = `tailwindcss` + `@afenda/shadcn-studio/shadcn-studio.css` + `shadcn/tailwind.css` only.

**Stock `className` OK** during stabilization.

---

## Repo wiring

| Item | Path / command |
| --- | --- |
| MCP workflow rule | `.cursor/rules/shadcn-studio.instructions.mdc` |
| shadcn CLI + registry MCP | `.cursor/mcp.json` → `shadcn` (`-c packages/shadcn-studio`) |
| Studio MCP wrapper | `.cursor/mcp/shadcn-studio.mjs` |
| Studio toolbar config | `shadcn-studio.config.json` |
| **Install cwd** | **`packages/shadcn-studio`** |
| Package | `@afenda/shadcn-studio` |
| Theme presets | `packages/shadcn-studio/src/theme/theme-presets.ts` |
| Primitives | `packages/shadcn-studio/src/components/ui/` |
| Blocks | `packages/shadcn-studio/src/components/shadcn-studio/blocks/` |
| Curated lab stories | `packages/shadcn-studio/src/shadcn-studio-blocks.stories.tsx` |
| Auto block stories | `packages/shadcn-studio/src/shadcn-studio-blocks-auto.stories.tsx` (codegen) |
| Theme / primitive stories | `packages/shadcn-studio/src/shadcn-studio-{theme-lab,primitives}.stories.tsx` |
| Lab welcome | `apps/storybook/stories/` |

Toolbar:

| Command | Target |
| --- | --- |
| `pnpm studio:toolbar` | ERP 3000 |
| `pnpm studio:toolbar:docs` | Docs 3001 |

Start the target dev server **before** the toolbar.

---

## MCP servers

| Server | Role |
| --- | --- |
| `shadcn` | Registry search, `shadcn add` — `-c packages/shadcn-studio` |
| `shadcn-studio` | `/cui`, `/rui`, `/iui`, `/ftc` via `.cursor/mcp/shadcn-studio.mjs` |

---

## Pro block installation

`@ss-blocks/*` and `@ss-components/*` require `EMAIL` + `LICENSE_KEY` at install time.

Credentials: `.env.secret` → `SHADCN_STUDIO_ACCOUNT_EMAIL` / `SHADCN_STUDIO_LICENSE_KEY` (never commit).

**Install cwd:** `packages/shadcn-studio`

PowerShell:

```powershell
cd packages/shadcn-studio
$env:EMAIL = (Get-Content ..\.env.secret | Select-String 'SHADCN_STUDIO_ACCOUNT_EMAIL=').ToString().Split('=')[1]
$env:LICENSE_KEY = (Get-Content ..\.env.secret | Select-String 'SHADCN_STUDIO_LICENSE_KEY=').ToString().Split('=')[1]
pnpm dlx shadcn@latest add @ss-blocks/<block-name>
```

---

## Gates (creation only)

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
```

**Do not run:** `pnpm ui:guard*`, PAS-005 slice gates, css-authority consumption gates.

---

## Storybook lab (after MCP install)

| Step | Command |
| --- | --- |
| Regenerate auto block stories | `pnpm storybook generate` |
| Dev lab | `pnpm storybook dev` → `http://localhost:6006` |
| Story tests | `pnpm test:storybook:run` |
| Lab typecheck | `pnpm --filter @afenda/storybook typecheck` |

Browse **Shadcn Studio/Blocks Auto** for every installed block entry; add curated variants in `shadcn-studio-blocks.stories.tsx` when needed. Skill detail: [afenda-storybook](../afenda-storybook/SKILL.md).

**Storybook MCP:** `@storybook/addon-mcp` — preview URLs and `run-story-tests` when dev server is up.

---

## Verification

- [PAS-006](../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) §5 gates pass after ERP wiring
- No `@afenda/ui` / appshell CSS in ERP `globals.css`
- MCP workflow follows `.cursor/rules/shadcn-studio.instructions.mdc` (collect all → install once)
