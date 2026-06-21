---
name: shadcn-studio
description: >-
  shadcn/studio MCP workflow for afenda-Xforge — /cui, /rui, /iui, /ftc block
  generation, toolbar visual editing, and design-system install paths. Use when
  using shadcn/studio MCP, generating blocks, refining UI from studio blocks,
  or running the shadcn/studio toolbar against Storybook or apps.
---

# shadcn/studio (afenda-Xforge)

Authority: `.cursor/rules/shadcn-studio.instructions.mdc` (always-on MCP workflow discipline).

## Repo wiring

| Item | Path / command |
|------|----------------|
| MCP workflow rule | `.cursor/rules/shadcn-studio.instructions.mdc` |
| shadcn CLI + registry MCP | `.cursor/mcp.json` → `shadcn` (`-c packages/ui`) |
| Studio toolbar config | `shadcn-studio.config.json` |
| **shadcn install cwd** | **`packages/ui`** — `components.json` lives here with `@ss-blocks` registry |
| MCP staging (optional) | `packages/ui/src/components/shadcn-studio/` — README only; **do not keep governed blocks here** |
| Governed blocks path | `packages/appshell/src/shadcn-studio/blocks/` |
| Install artifact policy | Raw MCP output is excluded from typecheck, Biome, and governance scans — govern primitives, then move to `@afenda/appshell` |
| Toolbar (Storybook) | `pnpm studio:toolbar` → port 3200 → Storybook 6006 |
| Toolbar (app) | `pnpm studio:toolbar:app` → port 3200 → app 3000 |
| Toolbar (web) | `pnpm studio:toolbar:web` → port 3200 → web 3001 |

Start the target dev server **before** the toolbar. Do not start long-running servers unless the user asks.

## MCP servers (two roles)

| Server | Role |
|--------|------|
| `shadcn` (configured) | Registry search, `shadcn add`, audit checklist — `-c packages/ui` |
| `shadcn-studio-mcp` (upstream) | `/cui`, `/rui`, `/iui`, `/ftc` block workflows — add from [shadcn/studio onboarding](https://shadcnstudio.com/mcp/onboarding) if not enabled |

## Pro block installation (shadcn/studio license)

`@ss-blocks/*` blocks require `EMAIL` + `LICENSE_KEY` env vars at install time.
Credentials live in `.env.secret` as `SHADCN_STUDIO_ACCOUNT_EMAIL` / `SHADCN_STUDIO_LICENSE_KEY`.

**Always install from `packages/ui` (the cwd that has `components.json`).**

PowerShell (Windows):
```powershell
$env:EMAIL="<SHADCN_STUDIO_ACCOUNT_EMAIL>"; $env:LICENSE_KEY="<SHADCN_STUDIO_LICENSE_KEY>"; npx shadcn@latest add @ss-blocks/<block-name> -y
```

Bash (Linux/macOS):
```bash
EMAIL=<SHADCN_STUDIO_ACCOUNT_EMAIL> LICENSE_KEY=<SHADCN_STUDIO_LICENSE_KEY> npx shadcn@latest add @ss-blocks/<block-name> -y
```

Read the credential values from `.env.secret` before running. Do **not** hard-code them in any tracked file.

### Install target paths (set by `packages/ui/components.json` aliases)

| Block file type | Lands in |
|-----------------|----------|
| Block components (raw MCP) | `packages/ui/src/components/shadcn-studio/blocks/` — **move to** `packages/appshell/src/shadcn-studio/blocks/` after governing |
| Shared UI primitives | `packages/ui/src/components/` |
| Hooks | `packages/ui/src/hooks/` |
| Assets (SVG etc.) | `packages/ui/src/assets/svg/` |
| App page route | `packages/ui/app/<block-name>/page.tsx` — move to target app after install |

When `shadcn/studio` MCP is active, follow its step-by-step workflow exactly.

## Workflow discipline (from upstream rule)

### All workflows

- Follow MCP tool sequence in order; no skipping or reordering.
- Complete collection/analysis before install/write phases.
- Continue through the full workflow without unnecessary confirmation when the next step is defined.
- Keep commentary brief between steps.
- Stop only when: MCP needs input, a repo hook blocks action, or the action violates user instructions.

### Commands

| Command | Purpose |
|---------|---------|
| `/cui` | Customize from existing shadcn/studio block — **collect all blocks first, install last**, then customize content |
| `/rui` | Refine or edit an existing block |
| `/iui` | Generate inspired UI (Pro) |
| `/ftc` | Figma design → code (requires Figma MCP) |

### Recovery

If the workflow drifted: stop → identify last completed step → resume from the next required step → finish without unrelated detours.

## Repo compatibility

- `AGENTS.md` and `.cursor/rules/*.mdc` still apply.
- Layer order: `apps/app` → Storybook → `packages/ui` (`agent-discipline.mdc`).
- Do not edit `packages/ui/src/components/` primitives for app-only polish — hook may block.
- Add free shadcn components: `npx shadcn@latest add [component]` (cwd: `packages/ui`)
- Add Pro ss-blocks: see **Pro block installation** section above.
- Use `pnpm` for repo commands.

## Verification after generated UI lands

```bash
pnpm --filter app typecheck          # if apps/app changed
pnpm --filter @repo/design-system typecheck   # if design-system changed
pnpm --filter storybook typecheck    # if stories changed
pnpm check
```

## Refresh upstream rule

```bash
curl --create-dirs -o .cursor/rules/shadcn-studio.instructions.mdc https://cdn.shadcnstudio.com/ss-assets/mcp/instructions/shadcn-studio-cursor-instructions.mdc
```

Validate: local file size 3568 bytes and SHA-256 matches CDN download.
