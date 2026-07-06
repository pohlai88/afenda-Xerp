---
name: shadcn-studio
description: >-
  shadcn/studio MCP workflow — /cui, /rui, /iui, /ftc block generation, theme
  presets, toolbar, and install paths. Use when using shadcn/studio MCP, PAS-006
  ERP frontend work, generating blocks, or running the studio toolbar.
paths:
  - packages/shadcn-studio-v2/**
  - apps/erp/**
  - apps/storybook/**
  - apps/developer/**
---

# shadcn/studio

**Authority:** [PAS-006](../../docs/PAS/PRESENTATION/PAS-006-SHADCN-STUDIO-FRONTEND-STANDARD.md) · [ADR-0027](../../docs/adr/ADR-0027-frontend-presentation-reset.md) · [North Star](../../docs/NORTHSTAR/shadcn-studio-presentation-north-star.md) · **Lanes:** [DEVELOPMENT-LANE-BOUNDARIES](../../docs/PAS/DEVELOPMENT-LANE-BOUNDARIES.md) · `.cursor/rules/shadcn-studio.instructions.mdc`

**Retired for ERP:** PAS-005 family (historical audit only), appshell bridge, `ui:guard*`, governed-ui strip pipeline — **do not parallel** with Kernel PAS-001A work.

**Surface map:** [`afenda-presentation-atlas`](../afenda-presentation-atlas/SKILL.md) — `/afenda-presentation-atlas` · what exists in `@afenda/shadcn-studio-v2` before MCP install or ERP import.

**Source architecture:** [`packages/shadcn-studio-v2/docs/DESIGN-SYSTEM-ARCHITECTURE.md`](../../packages/shadcn-studio-v2/docs/DESIGN-SYSTEM-ARCHITECTURE.md) · [ADR-0040](../../docs/adr/ADR-0040-promote-shadcn-studio-v2-and-deprecate-legacy.md)

**Install reference:** [reference/base-vega-install.md](./reference/base-vega-install.md) · [reference/credentials-env.md](./reference/credentials-env.md)

**Figma → code (required — no Code Connect):** [figma-mcp-afenda.md](./figma-mcp-afenda.md) — registry-first, `/ftc`, MCP + skills, in-repo manifests. **Do not** use Figma Code Connect or block on Enterprise license.

---

## Doctrine (ADR-0027)

```text
MCP / CLI install (packages/shadcn-studio-v2 cwd)
  → governed package source under packages/shadcn-studio-v2/src/**
  → pnpm --filter @afenda/shadcn-studio-v2 typecheck && build && test
  → import in apps/erp | apps/storybook | apps/developer via @afenda/shadcn-studio-v2 exports only
  → pnpm check:v1-consumer-imports && pnpm check:downstream-integration
  → pnpm --filter @afenda/erp typecheck && build
```

**Quarantine inbox:** [`components/quarantine/README.md`](../../packages/shadcn-studio-v2/src/components/quarantine/README.md) — raw vendor output is **not** public API until promoted (LANE-A-07).

**Import policy (v2):**

| Zone | Paths | Allowed | Forbidden |
| --- | --- | --- | --- |
| **Package authority** | `src/metadata/**`, `src/types/**`, contract tests | Relative imports within package | Quarantine paths in public exports |
| **MCP / shadcn UI** | `src/components/ui/**`, `src/components/quarantine/**` (inbox only), `src/lib/**`, `src/hooks/**` | Relative `./` / `../` within package | `@/` aliases in shipped `dist/` |
| **Cross-package** | `apps/erp`, `apps/storybook`, `apps/developer` | `@afenda/shadcn-studio-v2` · `@afenda/shadcn-studio-v2/clients` · `@afenda/shadcn-studio-v2/lab` (Storybook only) | Deep `@afenda/shadcn-studio-v2/src/...` · quarantine imports |

**Public exports (ADR-0037):**

| Subpath | Layer | Consumer |
| --- | --- | --- |
| `@afenda/shadcn-studio-v2` | Server-safe surfaces, slot constants | ERP, metadata gates |
| `@afenda/shadcn-studio-v2/clients` | Client runtime (providers, hooks, views) | ERP client islands, Storybook |
| `@afenda/shadcn-studio-v2/shadcn-default.css` | Base theme CSS | ERP + Storybook `preview.css` |
| `@afenda/shadcn-studio-v2/themes/*` | Scoped theme overlays | Per-route or per-story |

Gate: `pnpm check:v1-consumer-imports` · dist must have no unresolved `@/` after `pnpm --filter @afenda/shadcn-studio-v2 build`.

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
  4. @afenda/shadcn-studio-v2/shadcn-default.css
  5. @afenda/shadcn-studio-v2/themes/afenda-brand.css (ERP production brand overlay)
```

Composition entries are **imports + `@source` only** in Phase 1. Detail: [`afenda-tailwind`](../afenda-tailwind/SKILL.md) · [`afenda-presentation-quality`](../afenda-presentation-quality/SKILL.md).

**Stock `className` OK** during stabilization.

---

## Repo wiring

| Item | Path / command |
| --- | --- |
| MCP workflow rule | `.cursor/rules/shadcn-studio.instructions.mdc` |
| shadcn CLI + registry MCP | `.cursor/mcp.json` → `shadcn` (`-c packages/shadcn-studio-v2`) |
| Studio MCP wrapper | `.cursor/mcp/shadcn-studio.mjs` |
| Studio toolbar config | `shadcn-studio.config.json` |
| **Install cwd** | **`packages/shadcn-studio-v2`** |
| Package | `@afenda/shadcn-studio-v2` |
| **Architecture map** | [`packages/shadcn-studio-v2/docs/DESIGN-SYSTEM-ARCHITECTURE.md`](../../packages/shadcn-studio-v2/docs/DESIGN-SYSTEM-ARCHITECTURE.md) |
| Theme CSS source | `packages/shadcn-studio-v2/src/styles/shadcn-default.css` |
| Primitives | `packages/shadcn-studio-v2/src/components/ui/` |
| Composed views | `packages/shadcn-studio-v2/src/views/` |
| Storybook lab stories | `apps/storybook/stories/` |

Toolbar:

| Command | Target |
| --- | --- |
| `pnpm studio:toolbar` | ERP 3000 |
| `pnpm studio:toolbar:docs` | Docs 3001 |

Start the target dev server **before** the toolbar.

---

## Figma design → code (no Code Connect)

Afenda does **not** use Figma Code Connect (Org/Enterprise). Agents **must** follow [figma-mcp-afenda.md](./figma-mcp-afenda.md):

| Task | Path |
| --- | --- |
| Studio block | `/ftc` or `@ss-blocks/*` install |
| shadcncraft kit frame | `registry-index.json` → `@shadcncraft/*` |
| Custom frame | Figma MCP + `shadcncraft-generate-code` + `@afenda/shadcn-studio-v2` primitives |
| Tokens | `tokens-complete.json` + optional `shadcncraft-import-variables` |
| Figma ↔ implementation QA | Storybook `addon-designs` + `STORYBOOK_FIGMA_*` |

In-repo mapping SSOT: curated package docs · presentation-lab presets · `ui-primitive-metadata.registry.ts`.

---

## MCP servers

| Server | Role |
| --- | --- |
| `shadcn` | Registry search, `shadcn add` — `-c packages/shadcn-studio-v2` |
| `shadcn-studio` | `/cui`, `/rui`, `/iui`, `/ftc` via `.cursor/mcp/shadcn-studio.mjs` |
| `figma` / `figma-desktop` | `get_design_context`, `get_variable_defs`, `get_screenshot` — **not** Code Connect |

---

## Credentials (Pro blocks + MCP)

**SSOT:** repo root `.env.secret` → `SHADCN_STUDIO_ACCOUNT_EMAIL` + `SHADCN_STUDIO_LICENSE_KEY` (see `.env.example`).

1. Add keys from [shadcnstudio.com/mcp/onboarding](https://shadcnstudio.com/mcp/onboarding)
2. `pnpm env:sync` — syncs to `.env` for Cursor MCP (`shadcn-studio` server)
3. CLI installs need **`EMAIL`** + **`LICENSE_KEY`** in the shell — map from `.env.secret` (detail: [reference/credentials-env.md](./reference/credentials-env.md))

**Never** commit credentials or hard-code them in tracked files.

---

## CLI install (primitives + blocks)

### Install layers (v2)

| Layer | SSOT | Role |
| --- | --- | --- |
| **Install** | `packages/shadcn-studio-v2/components.json` | MCP/CLI **write** targets → `src/components/quarantine/` |
| **Production** | `src/components/ui/` | Promoted primitives only — kebab-case stems |
| **Consumers** | `@afenda/shadcn-studio-v2` exports | ERP · Storybook · developer — never quarantine paths |

Rule: [`.cursor/rules/studio-import-path-aliases.mdc`](../../.cursor/rules/studio-import-path-aliases.mdc) · gate: `pnpm check:v1-consumer-imports`

### Primitives — production bucket (`components/ui/`)

**Never** use `--overwrite` on existing promoted primitives without an explicit promotion slice.

```powershell
cd packages/shadcn-studio-v2
pnpm dlx shadcn@latest add button --yes
pnpm dlx shadcn@latest info
```

Promote from quarantine per [`components/quarantine/README.md`](../../packages/shadcn-studio-v2/src/components/quarantine/README.md).

### MCP / blocks — quarantine inbox (`components/quarantine/`)

Raw vendor output lands in quarantine first. Overwrite is **allowed** in the inbox only.

```powershell
cd packages/shadcn-studio-v2
pnpm dlx shadcn@latest add @ss-blocks/statistics-component-01 --overwrite --yes
```

After install: review diff → promote per quarantine README — **do not** import from quarantine in ERP or Storybook.

Skill: [`afenda-primitive-contract`](../afenda-primitive-contract/SKILL.md) · E0: [mismatch-inspection-frame.md](../afenda-primitive-contract/reference/mismatch-inspection-frame.md)

### Pro blocks — `@ss-blocks/*` (via quarantine)

```powershell
$repoRoot = git rev-parse --show-toplevel
$secret = Join-Path $repoRoot ".env.secret"
$env:EMAIL = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_ACCOUNT_EMAIL=').Line.Split('=', 2)[1]
$env:LICENSE_KEY = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_LICENSE_KEY=').Line.Split('=', 2)[1]
cd packages/shadcn-studio-v2
pnpm dlx shadcn@latest add @ss-blocks/statistics-component-01 --overwrite --yes
```

Full env/MCP/CLI mapping: [reference/credentials-env.md](./reference/credentials-env.md).

Use **registry names** (`chart-component-01`, `application-shell-02`, …) — not always the manifest filesystem `blockId`. Full map: [reference/base-vega-install.md](./reference/base-vega-install.md).

### Post-promotion — Afenda markers (mandatory)

After promoting a block from quarantine to `components-layouts/`, `--overwrite` may have removed `blockSlotDomMarkerProps` (P06-008-R2). Restore from git on the **production** path, then fix Base UI `render` props (no `asChild`):

```powershell
cd <repo-root>
$files = (git grep -l "blockSlotDomMarkerProps" HEAD -- "packages/shadcn-studio/src/components-layouts") -replace '^HEAD:',''
git checkout HEAD -- @files
# reconcile asChild → render on Dialog/Dropdown/Button triggers — see base-vega-install.md
```

---

## Gates (creation only)

```bash
pnpm --filter @afenda/shadcn-studio-v2 typecheck
pnpm --filter @afenda/shadcn-studio-v2 test
pnpm --filter @afenda/shadcn-studio-v2 build
pnpm check:v1-consumer-imports
pnpm check:downstream-integration
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
- `pnpm check:downstream-integration` — AdminCN CSS chain, no retired package CSS
- No `@afenda/ui` / appshell CSS in ERP `globals.css`
- No bespoke `@layer components` rules in `globals.css` or `preview.css` (Phase 1)
- MCP workflow follows `.cursor/rules/shadcn-studio.instructions.mdc` (collect all → install once)
- Base UI: no `asChild` on triggers after block reinstall

```bash
pnpm check:downstream-integration
pnpm check:v1-consumer-imports
pnpm --filter @afenda/shadcn-studio-v2 typecheck && pnpm --filter @afenda/shadcn-studio-v2 build
pnpm --filter @afenda/erp typecheck && pnpm --filter @afenda/erp build
```
