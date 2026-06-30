# shadcn/studio credentials (`.env.secret`)

Pro blocks (`@ss-blocks/*`, `@ss-components/*`) and the Studio MCP require a shadcn/studio license.

## Source of truth

| Item | Location |
| --- | --- |
| Human-editable secrets | **repo root** `.env.secret` |
| Onboarding template | `.env.example` (placeholders only) |
| License onboarding | [shadcnstudio.com/mcp/onboarding](https://shadcnstudio.com/mcp/onboarding) |

**Keys in `.env.secret`:**

```txt
SHADCN_STUDIO_LICENSE_KEY=...
SHADCN_STUDIO_ACCOUNT_EMAIL=...
```

Never commit real values. Keys are on `VERCEL_PUSH_DENYLIST` — local / MCP / CLI only.

## After editing secrets

```bash
pnpm env:sync
```

Syncs into generated `.env` (used by Cursor MCP `envFile` in `.cursor/mcp.json`).

## MCP (Cursor)

| Server | Wiring |
| --- | --- |
| `shadcn-studio` | `.cursor/mcp/shadcn-studio.mjs` maps `SHADCN_STUDIO_*` → `EMAIL` / `API_KEY` for `shadcn-studio-mcp` |
| `shadcn` | Registry MCP; Pro installs use `components.json` `${EMAIL}` / `${LICENSE_KEY}` at CLI time |

Restart MCP or reload Cursor after `pnpm env:sync` if credentials were just added.

## CLI (`pnpm dlx shadcn@latest add @ss-blocks/...`)

`packages/shadcn-studio/components.json` expects process env **`EMAIL`** and **`LICENSE_KEY`** (not the `SHADCN_STUDIO_*` names).

**Install cwd:** `packages/shadcn-studio`

### PowerShell (repo-root safe)

```powershell
cd packages/shadcn-studio
$repoRoot = git rev-parse --show-toplevel
$secret = Join-Path $repoRoot ".env.secret"
$env:EMAIL = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_ACCOUNT_EMAIL=').Line.Split('=', 2)[1]
$env:LICENSE_KEY = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_LICENSE_KEY=').Line.Split('=', 2)[1]
pnpm dlx shadcn@latest add @ss-blocks/statistics-component-01 --overwrite --yes
```

### Bash (repo-root safe)

```bash
cd packages/shadcn-studio
repo_root="$(git rev-parse --show-toplevel)"
set -a
source <(grep -E '^SHADCN_STUDIO_(ACCOUNT_EMAIL|LICENSE_KEY)=' "$repo_root/.env.secret" | sed 's/SHADCN_STUDIO_ACCOUNT_EMAIL/EMAIL/; s/SHADCN_STUDIO_LICENSE_KEY/LICENSE_KEY/')
set +a
pnpm dlx shadcn@latest add @ss-blocks/statistics-component-01 --overwrite --yes
```

## Verify

```powershell
cd packages/shadcn-studio
pnpm dlx shadcn@latest info    # style base-vega, installed components
pnpm dlx shadcn@latest search @ss-blocks statistics
```

If Pro install returns auth/404 errors, re-check `.env.secret` values and that `EMAIL` / `LICENSE_KEY` are exported in the **same shell** as `shadcn add`.
