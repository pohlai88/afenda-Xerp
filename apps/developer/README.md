# Afenda Developer Route Lab

`@afenda/developer` is the UI/UX review surface for Afenda route and presentation work. It runs on port `3002` and keeps review sessions focused on layout, interaction flow, visual hierarchy, responsive behavior, and presentation quality.

Runtime authority for the route lab is governed through P5 demo-fixture operating-context resolution (`resolveLabShellOperatingContext`), with an empty BFF allowlist and continued prohibition on `@afenda/auth`, `@afenda/kernel`, `@afenda/database`, and `@afenda/server` imports. **[ADR-0044](../../docs/adr/ADR-0044-developer-route-lab-runtime-authority-boundary.md) (Accepted)** amends ADR-0039 to make this promotion-only posture terminal unless explicitly superseded.

The lab still follows ERP frontend law: App Router first, Server Components by default, route-local `_components` when UI surfaces return, client leaves only for interactivity, and no lowered presentation standard because it is a lab.

See [ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md](../../docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md) for route-lab structure, placeholder intent, and Next.js/Vercel compliance.

See [DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md](../../docs/architecture/DEVELOPER_ROUTE_LAB_RUNTIME_PARITY_PENDING.md) for the pending implementation path for Route Handlers, live Server Actions, cache strategy, middleware/request policy, and tenant/auth/OperatingContext/BFF authority.

The current release-grade proof contract is documented in [DEVELOPER_ROUTE_LAB_GREENLIGHT.md](../../docs/architecture/DEVELOPER_ROUTE_LAB_GREENLIGHT.md).

## Run

```bash
pnpm --filter @afenda/developer dev
```

Open `http://127.0.0.1:3002`.

## Verification

```bash
pnpm --filter @afenda/developer verify:greenlight
```

Workspace-level delegate:

```bash
pnpm check:developer-route-lab-greenlight
```

Direct workspace-level fallback when root `pnpm` execution is blocked by ignored-build enforcement:

```bash
node scripts/governance/check-developer-route-lab-greenlight.mjs
```

Direct app-local fallback when workspace-level `pnpm` execution is blocked:

```bash
node apps/developer/scripts/verify-greenlight.mjs
```

Expanded app-local sequence:

```bash
pnpm --dir apps/developer check:biome
pnpm --dir apps/developer test
pnpm --dir apps/developer verify:route-lab
pnpm --dir apps/developer test:e2e:smoke
pnpm --dir apps/developer build
```

If workspace-level `pnpm` commands are blocked by dependency approval / ignored-build enforcement, app-local binary fallbacks are:

```powershell
.\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit
.\node_modules\.bin\biome ci apps\developer
.\node_modules\.bin\vitest.CMD run --config apps\developer\vitest.config.ts
apps\developer\node_modules\.bin\playwright test --project=chromium-smoke
$env:AFENDA_DEVELOPER_SANDBOX='true'; Push-Location apps\developer; node ..\..\node_modules\next\dist\bin\next build; Pop-Location
```
