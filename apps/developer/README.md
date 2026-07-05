# Afenda Developer Route Lab

`@afenda/developer` is the UI/UX review surface for Afenda route and presentation work. It runs on port `3002` and keeps review sessions focused on layout, interaction flow, visual hierarchy, responsive behavior, and presentation quality.

Authentication is intentionally excluded from this app to avoid review noise. Do not add auth redirects, sessions, permissions, operating-context spine, BFF routes, or `@afenda/auth` imports here. Auth-governed flows should be reviewed in their own governed slice before promotion into ERP runtime surfaces.

The lab still follows ERP frontend law: App Router first, Server Components by default, route-local `_components` when UI surfaces return, client leaves only for interactivity, and no lowered presentation standard because it is a lab.

See [ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md](./ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md) for route-lab structure, placeholder intent, and Next.js/Vercel compliance.

## Run

```bash
pnpm --filter @afenda/developer dev
```

Open `http://127.0.0.1:3002`.

## Verification

```bash
pnpm exec biome ci apps/developer
pnpm --filter @afenda/developer typecheck
pnpm --filter @afenda/developer test:e2e:smoke
```

If workspace-level `pnpm` commands are blocked by dependency approval / ignored-build enforcement, app-local binary fallbacks are:

```powershell
.\node_modules\.bin\tsc -p apps\developer\tsconfig.json --noEmit
.\node_modules\.bin\biome ci apps\developer
apps\developer\node_modules\.bin\playwright test --project=chromium-smoke
```
