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

**Surface map:** [`afenda-presentation-atlas`](../afenda-presentation-atlas/SKILL.md) — `/afenda-presentation-atlas` · what exists in `@afenda/shadcn-studio` before MCP install or ERP import.

**Install reference:** [reference/base-vega-install.md](./reference/base-vega-install.md) · [reference/credentials-env.md](./reference/credentials-env.md)

---

## Doctrine (ADR-0027)

```text
shadcn CLI install (packages/shadcn-studio cwd, base-vega)
  → src/components/ui/* (@base-ui/react primitives)
  → src/components/shadcn-studio/blocks/* (@ss-blocks)
  → restore P06-008-R2 DOM markers (git) + Base UI render props
  → seam imports to contracts/registry: **relative only** (never `@/contracts` or `@/registry`)
  → pnpm storybook generate
  → import in apps/erp
  → pnpm --filter @afenda/shadcn-studio typecheck
  → pnpm check:studio-import-zones && pnpm check:studio-metadata-binding && pnpm check:studio-block-slot-markers
  → pnpm --filter @afenda/erp typecheck && build
```

**Two-zone import policy (PAS-006):**

| Zone | Paths | Allowed | Forbidden |
| --- | --- | --- | --- |
| **A — Afenda authority** | `src/contracts/**`, `src/registry/**`, generators | Relative (`../contracts/...`) | `@/`, `@afenda/shadcn-studio` self-import |
| **B — MCP / shadcn UI** | `src/components/ui/**`, `blocks/**`, `lib/**`, `hooks/**` | `@/components/ui/*`, `@/lib/utils` | `@/contracts/*`, `@/registry/*` |
| **C — Cross-package** | `apps/erp`, appshell bridge | `@afenda/shadcn-studio` barrel | Deep `@afenda/shadcn-studio/src/...` |

Gate: `pnpm check:studio-import-zones` · dist must have no unresolved `@/` after `pnpm --filter @afenda/shadcn-studio build` (ERP consumer gate).

**Stack (AdminCN SSOT):**

| Layer | Value |
| --- | --- |
| `components.json` style | `base-vega` |
| Primitive library | **Base UI** (`@base-ui/react`) — **not** Radix `--base radix` |
| Preset code | `bIkeymG` (Vega + neutral) — see [shadcn presets blog](https://shadcnstudio.com/blog/how-shadcn-ui-presets-work/) |
| Primitives registry | `@shadcn` via `pnpm dlx shadcn@latest add --all` |
| Blocks registry | `@ss-blocks/*` (license) — ids often differ from manifest `blockId` |

**ERP CSS (AdminCN import order — matches `_reference` AdminCN template):**

```txt
apps/erp/src/app/globals.css
  1. tailwindcss
  2. tw-animate-css
  3. shadcn/tailwind.css
  4. @afenda/shadcn-studio/shadcn-studio.css
```

Composition entries are **imports + `@source` only** in Phase 1. Detail: [`afenda-tailwind`](../afenda-tailwind/SKILL.md) · [`afenda-presentation-quality`](../afenda-presentation-quality/SKILL.md).

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

## Credentials (Pro blocks + MCP)

**SSOT:** repo root `.env.secret` → `SHADCN_STUDIO_ACCOUNT_EMAIL` + `SHADCN_STUDIO_LICENSE_KEY` (see `.env.example`).

1. Add keys from [shadcnstudio.com/mcp/onboarding](https://shadcnstudio.com/mcp/onboarding)
2. `pnpm env:sync` — syncs to `.env` for Cursor MCP (`shadcn-studio` server)
3. CLI installs need **`EMAIL`** + **`LICENSE_KEY`** in the shell — map from `.env.secret` (detail: [reference/credentials-env.md](./reference/credentials-env.md))

**Never** commit credentials or hard-code them in tracked files.

---

## CLI install (primitives + blocks)

### Primitives — all Base UI components

```powershell
cd packages/shadcn-studio
pnpm dlx shadcn@latest add --all --overwrite --yes
pnpm dlx shadcn@latest info
```

### Pro blocks — `@ss-blocks/*`

```powershell
cd packages/shadcn-studio
$repoRoot = git rev-parse --show-toplevel
$secret = Join-Path $repoRoot ".env.secret"
$env:EMAIL = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_ACCOUNT_EMAIL=').Line.Split('=', 2)[1]
$env:LICENSE_KEY = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_LICENSE_KEY=').Line.Split('=', 2)[1]
pnpm dlx shadcn@latest add @ss-blocks/statistics-component-01 --overwrite --yes
```

Full env/MCP/CLI mapping: [reference/credentials-env.md](./reference/credentials-env.md).

Use **registry names** (`chart-component-01`, `application-shell-02`, …) — not always the manifest filesystem `blockId`. Full map: [reference/base-vega-install.md](./reference/base-vega-install.md).

### Post-install — Afenda markers (mandatory)

`--overwrite` removes `blockSlotDomMarkerProps` (P06-008-R2). Restore from git, then fix Base UI `render` props (no `asChild`):

```powershell
cd <repo-root>
$files = (git grep -l "blockSlotDomMarkerProps" HEAD -- "packages/shadcn-studio/src/components/shadcn-studio/blocks") -replace '^HEAD:',''
git checkout HEAD -- @files
# reconcile asChild → render on Dialog/Dropdown/Button triggers — see base-vega-install.md
```

---

## Gates (creation only)

```bash
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm check:studio-metadata-binding
pnpm check:studio-block-slot-markers
pnpm storybook generate
pnpm --filter @afenda/erp typecheck
pnpm --filter @afenda/erp build
pnpm check:downstream-integration
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

Browse **Shadcn Studio/Blocks Auto** for every installed block entry; add curated variants in `shadcn-studio-blocks.stories.tsx` when needed. **PAS-006C promotion checklists:** `Shadcn Studio/Promotion` (codegen MDX). Skill detail: [afenda-storybook](../afenda-storybook/SKILL.md).

**Storybook MCP:** `@storybook/addon-mcp` — preview URLs and `run-story-tests` when dev server is up.

---

## Verification

- [PAS-006](../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) §5 gates pass after ERP wiring
- `pnpm check:downstream-integration` — AdminCN CSS chain, no retired package CSS
- No `@afenda/ui` / appshell CSS in ERP `globals.css`
- No bespoke `@layer components` rules in `globals.css` or `preview.css` (Phase 1)
- MCP workflow follows `.cursor/rules/shadcn-studio.instructions.mdc` (collect all → install once)
- Base UI: no `asChild` on triggers after block reinstall

```bash
pnpm check:downstream-integration
pnpm --filter @afenda/shadcn-studio typecheck && pnpm --filter @afenda/shadcn-studio build
pnpm --filter @afenda/erp typecheck && pnpm --filter @afenda/erp build
pnpm check:studio-metadata-binding && pnpm check:studio-block-slot-markers
```
