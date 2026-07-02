# Base Vega install reference (AdminCN / shadcn studio SSOT)

**Stack:** `components.json` → `style: "base-vega"` · primitives on **`@base-ui/react`** (not Radix `asChild`) · preset **`bIkeymG`** (Vega + neutral).

**Install policy (ADR-0038):** MCP/CLI writes land in **`src/components-quarantine/`** first (`components.json` install aliases). Promote to production buckets before ERP export. See [`components-quarantine/README.md`](../../../../packages/shadcn-studio/src/components-quarantine/README.md).

## Quarantine inbox (MCP / blocks / exploratory primitives)

**Credentials:** [credentials-env.md](./credentials-env.md) — `.env.secret` keys, `pnpm env:sync`, MCP vs CLI env names.

```powershell
# From repo root — allows --overwrite in quarantine only
$repoRoot = git rev-parse --show-toplevel
$secret = Join-Path $repoRoot ".env.secret"
$env:EMAIL = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_ACCOUNT_EMAIL=').Line.Split('=', 2)[1]
$env:LICENSE_KEY = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_LICENSE_KEY=').Line.Split('=', 2)[1]
pnpm studio:shadcn:quarantine add @ss-blocks/<registry-name> --overwrite --yes
pnpm studio:shadcn:quarantine add @shadcncraft/<name> --yes
```

Physical landing zone: `packages/shadcn-studio/src/components-quarantine/` (vendor layout preserved).

## Production primitives (`components-ui/`)

**Never** use `--overwrite` on existing `components-ui/*` — use the safe production wrapper:

```powershell
pnpm studio:shadcn add button --yes
cd packages/shadcn-studio
pnpm dlx shadcn@latest info   # verify style base-vega + installed component list
```

Do **not** use `--base radix` for AdminCN parity. Radix `asChild` APIs break against Base UI primitives.

For **new** primitives arriving via quarantine: split `{name}.contract.ts` + `{name}.tsx`, then move into `components-ui/` during promotion.

### Manifest blockId ≠ registry name

| Manifest `blockId` (filesystem) | `@ss-blocks` registry id |
| --- | --- |
| `statistics-card-01` | `statistics-component-01` |
| `statistics-card-02` | `statistics-component-02` |
| `chart-sales-metrics` | `chart-component-01` |
| `datatable-user` | `datatable-component-04` |
| `datatable-invoice` | `datatable-component-05` |
| `datatable-product` | `datatable-component-06` |
| `widget-total-earning` | `widget-component-01` |
| `widget-transactions` | `widget-component-03` |
| `widget-payment-history` | `widget-component-14` |
| `dropdown-*`, `dialog-search`, `menu-trigger`, `sidebar-user-dropdown` | `application-shell-02` (batch) |
| `account-settings-01` … `07`, `hero-section-01`, `login-page-04`, `error-page-02` | same id as manifest |

Search: `pnpm dlx shadcn@latest search @ss-blocks` (762+ items; paginate via registry site if needed).

## Post-promotion (mandatory for Afenda)

After promoting blocks to `components-layouts/`, studio `--overwrite` **may strip** P06-008-R2 `blockSlotDomMarkerProps` and B42k a11y hooks. Restore from last committed marker layer on the production path, then reconcile Base UI:

```powershell
cd <repo-root>
$files = (git grep -l "blockSlotDomMarkerProps" HEAD -- "packages/shadcn-studio/src/components-layouts") -replace '^HEAD:',''
git checkout HEAD -- @files
```

Then fix **Base UI** composition (no `asChild`):

| Radix pattern | Base UI (`@base-ui/react`) |
| --- | --- |
| `<DialogTrigger asChild><Button /></DialogTrigger>` | `<DialogTrigger render={<Button />}>` …children |
| `<DropdownMenuTrigger asChild><Button /></DropdownMenuTrigger>` | `<DropdownMenuTrigger render={<Button />}>` … |
| `<Button asChild><a /></Button>` | `<Button render={<a href="..." />}>` … |
| `<DialogClose asChild><Button /></DialogClose>` | `<DialogClose render={<Button />}>` … |

Gates:

```bash
pnpm check:studio-install-paths
pnpm check:studio-quarantine-isolation
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm check:studio-metadata-binding
pnpm check:studio-block-slot-markers
pnpm storybook generate
```

## AdminCN-only UI extras

Items like `kanban`, `circular-progress`, `category-bar`, `timeline` are **not** in `@shadcn add --all`. They ship with the AdminCN template bundle or arrive via specific `@ss-blocks/*` installs that pull extra `components-quarantine/ui/*` files — promote into `components-ui/` after contract split.
