# Base Vega install reference (AdminCN / shadcn studio SSOT)

**Stack:** `components.json` → `style: "base-vega"` · primitives on **`@base-ui/react`** (not Radix `asChild`) · preset **`bIkeymG`** (Vega + neutral).

## Primitives (`@shadcn` registry)

```powershell
cd packages/shadcn-studio
pnpm dlx shadcn@latest add --all --overwrite --yes
pnpm dlx shadcn@latest info   # verify style base-vega + installed component list
```

Do **not** use `--base radix` for AdminCN parity. Radix `asChild` APIs break against Base UI primitives.

## Pro blocks (`@ss-blocks` registry)

**Credentials:** [credentials-env.md](./credentials-env.md) — `.env.secret` keys, `pnpm env:sync`, MCP vs CLI env names.

```powershell
cd packages/shadcn-studio
$repoRoot = git rev-parse --show-toplevel
$secret = Join-Path $repoRoot ".env.secret"
$env:EMAIL = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_ACCOUNT_EMAIL=').Line.Split('=', 2)[1]
$env:LICENSE_KEY = (Select-String -Path $secret -Pattern '^SHADCN_STUDIO_LICENSE_KEY=').Line.Split('=', 2)[1]
pnpm dlx shadcn@latest add @ss-blocks/<registry-name> --overwrite --yes
```

### Manifest blockId ≠ registry name

| Manifest `blockId` (filesystem) | `@ss-blocks` registry id |
| --- | --- |
| `statistics-card-01` | `statistics-component-01` |
| `statistics-card-02` | `statistics-component-02` |
| `chart-sales-metrics` | `chart-component-01` |
| `datatable-invoice` | `datatable-component-05` |
| `widget-total-earning` | `widget-component-01` |
| `widget-transactions` | `widget-component-03` |
| `widget-payment-history` | `widget-component-14` |
| `dropdown-*`, `dialog-search`, `menu-trigger`, `sidebar-user-dropdown` | `application-shell-02` (batch) |
| `account-settings-01` … `07`, `hero-section-01`, `login-page-04`, `error-page-02` | same id as manifest |

Search: `pnpm dlx shadcn@latest search @ss-blocks` (762+ items; paginate via registry site if needed).

## Post-install (mandatory for Afenda)

Studio `--overwrite` **strips** P06-008-R2 `blockSlotDomMarkerProps` and B42k a11y hooks. Restore from last committed marker layer, then reconcile Base UI:

```powershell
cd <repo-root>
$files = (git grep -l "blockSlotDomMarkerProps" HEAD -- "packages/shadcn-studio/src/components/shadcn-studio/blocks") -replace '^HEAD:',''
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
pnpm --filter @afenda/shadcn-studio typecheck
pnpm --filter @afenda/shadcn-studio test:run
pnpm check:studio-metadata-binding
pnpm check:studio-block-slot-markers
pnpm storybook generate
```

## AdminCN-only UI extras

Items like `kanban`, `circular-progress`, `category-bar`, `timeline` are **not** in `@shadcn add --all`. They ship with the AdminCN template bundle or arrive via specific `@ss-blocks/*` installs that pull extra `components/ui/*` files.
