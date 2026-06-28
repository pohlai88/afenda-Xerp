---
name: shadcn-studio
description: >-
  shadcn/studio MCP workflow — /cui, /rui, /iui, /ftc block generation, theme
  presets, toolbar, and install paths. Use when using shadcn/studio MCP, PAS-005A
  slices, generating blocks, or running the studio toolbar against Storybook or apps.
---

# shadcn/studio

**Authority:** [PAS-005A](../../docs/PAS/PAS-005A-SHADCN-STUDIO-PRESENTATION-STANDARD.md) · [ADR-0017](../../docs/adr/ADR-0017-shadcn-studio-ui-delivery-acceleration.md) · `.cursor/rules/shadcn-studio.instructions.mdc`

**Agent skill (boundary):** [shadcn-studio-authority](../shadcn-studio-authority/SKILL.md)

## Phase status

| Phase | Scope | Install cwd | Blocks home |
| --- | --- | --- | --- |
| **Phase 1 (delivered B38–B41)** | Standalone `@afenda/shadcn-studio` — Afenda-free | `packages/shadcn-studio` | `packages/shadcn-studio/src/blocks/` |
| **Phase 2 (B42 — next)** | Afenda integration — css-authority, ERP, metadata-ui hook, delete appshell legacy | `packages/shadcn-studio` | Governed promotion per ADR-0017 (updated on B42) |

**Do not migrate** from `packages/appshell/src/shadcn-studio/` — re-seed via MCP; delete legacy on B42 after parity.

---

## Repo wiring (current — PAS-005A Phase 1)

| Item | Path / command |
| --- | --- |
| MCP workflow rule | `.cursor/rules/shadcn-studio.instructions.mdc` |
| shadcn CLI + registry MCP | `.cursor/mcp.json` → `shadcn` (`-c packages/shadcn-studio`) |
| Studio MCP wrapper | `.cursor/mcp/shadcn-studio.mjs` |
| Studio toolbar config | `shadcn-studio.config.json` |
| **shadcn install cwd** | **`packages/shadcn-studio`** — `components.json` + `@ss-blocks` / `@ss-components` |
| Package | `@afenda/shadcn-studio` |
| Theme presets | `packages/shadcn-studio/src/theme/theme-presets.ts` |
| Primitives | `packages/shadcn-studio/src/components/ui/` |
| Blocks (seed) | `packages/shadcn-studio/src/blocks/` |
| Lab stories | `apps/storybook/stories/shadcn-studio-*.stories.tsx` |
| Legacy (delete on B42) | `packages/appshell/src/shadcn-studio/` — **do not copy** |

Toolbar:

| Command | Target |
| --- | --- |
| `pnpm studio:toolbar` | Storybook 6006 |
| `pnpm studio:toolbar:app` | ERP 3000 |
| `pnpm studio:toolbar:docs` | Docs 3001 |

Start the target dev server **before** the toolbar.

---

## MCP servers

| Server | Role |
| --- | --- |
| `shadcn` | Registry search, `shadcn add` — `-c packages/shadcn-studio` |
| `shadcn-studio` | `/cui`, `/rui`, `/iui`, `/ftc` via `.cursor/mcp/shadcn-studio.mjs` |
| `figma` / `figma-desktop` | Design context — see [figma-mcp-afenda.md](figma-mcp-afenda.md) |

---

## Pro block installation

`@ss-blocks/*` and `@ss-components/*` require `EMAIL` + `LICENSE_KEY` at install time.

Credentials: `.env.secret` → `SHADCN_STUDIO_ACCOUNT_EMAIL` / `SHADCN_STUDIO_LICENSE_KEY` (never commit).

**Install cwd:** `packages/shadcn-studio`

PowerShell:

```powershell
cd packages/shadcn-studio
$env:EMAIL="<from .env.secret>"; $env:LICENSE_KEY="<from .env.secret>"; npx shadcn@latest add @ss-components/button -y
```

Bash:

```bash
cd packages/shadcn-studio
EMAIL=<from .env.secret> LICENSE_KEY=<from .env.secret> npx shadcn@latest add @ss-blocks/<block-name> -y
```

### Install targets (`packages/shadcn-studio/components.json`)

| Artifact | Path |
| --- | --- |
| Primitives (`@ss-components`) | `src/components/ui/` |
| Blocks (`@ss-blocks`) | `src/blocks/` |
| Theme (`install-theme`) | `src/styles/shadcn-studio.css` |

**Collection rule:** collect all selected items before any install command (MCP `/cui`, `/rui`).

---

## Workflow discipline

Follow `.cursor/rules/shadcn-studio.instructions.mdc` step-by-step — no skipping collection before install.

| Command | Purpose |
| --- | --- |
| `/cui` | Customize block — collect all, install once |
| `/rui` | Refine components / theme |
| `/iui` | Inspired UI (Pro) |
| `/ftc` | Figma → code |

---

## Verification (Phase 1 lab)

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm --filter @afenda/storybook typecheck
pnpm quality:boundaries
```

Storybook: `shadcn-studio-theme-lab`, `shadcn-studio-primitives`, `shadcn-studio-block` stories.

---

## Verification (Phase 2 — B42, not yet active)

After B42 slice closes:

```txt
MCP install (packages/shadcn-studio)
  → normalize (STUDIO-PATTERN-MAP, governed @afenda/ui)
  → css-authority / ERP globals chain
  → delete packages/appshell/src/shadcn-studio/
  → pnpm ui:guard:scan → pnpm ui:guard → pnpm ui:guard:proof
```

Handoff: [`docs/PAS/slice/b42-pas005a-afenda-integration.md`](../../docs/PAS/slice/b42-pas005a-afenda-integration.md)

---

## B40 MCP follow-up

B40 used manual shadcn seed (MCP unavailable in agent env). Re-run `/rui` + `/cui` with live credentials to replace placeholders — see slice addendum in `b40-pas005a-mcp-seed.md`.

---

## Refresh upstream MCP rule

```bash
curl --create-dirs -o .cursor/rules/shadcn-studio.instructions.mdc https://cdn.shadcnstudio.com/ss-assets/mcp/instructions/shadcn-studio-cursor-instructions.mdc
```
