# Developer Route-Lab Green-Light Contract

## Status

This best-practice slice is implemented.

The route lab now has one release-grade proof path for app-local verification,
root delegation, CI, and release verification.

## Why This Slice Mattered

The next highest-ROI best practice after the bounded `/dashboard/sales` cutover proof is to make the whole `@afenda/developer` route-lab proof surface a single release-grade green-light gate.

This gives the repo one repeatable answer to a common promotion question: "Is the route lab still structurally valid, testable, and buildable?" It is higher ROI than adding another route because it protects every current and future route-lab surface from silent drift.

## Scope

This contract applies only to `@afenda/developer`.

It proves:

- route-lab code is formatted and linted,
- app-local unit and interaction tests pass,
- route-lab governance still rejects forbidden runtime authority,
- Playwright smoke coverage can boot and visit the active route set,
- the sandbox build still succeeds with `AFENDA_DEVELOPER_SANDBOX=true`.

It does not prove:

- ERP runtime cutover readiness,
- business authority,
- tenant or permission enforcement,
- API or database readiness,
- authorization for legacy deletion.

## Gate Authority

The app-owned runner is the single source of truth:

```bash
node apps/developer/scripts/verify-greenlight.mjs
```

Root and CI surfaces must delegate to that runner instead of duplicating its command sequence:

```bash
pnpm check:developer-route-lab-greenlight
pnpm quality:developer-route-lab
node scripts/governance/check-developer-route-lab-greenlight.mjs
```

The root Node wrapper exists so release and CI gates can call the same proof path even when workspace-level `pnpm` execution is blocked by dependency approval or ignored-build enforcement.

## Required Sequence

The app-owned runner must keep these checks in order:

1. Biome over `apps/developer`.
2. Vitest with `apps/developer/vitest.config.ts`.
3. Next type generation with `AFENDA_DEVELOPER_SANDBOX=true`.
4. TypeScript over `apps/developer/tsconfig.json`.
5. Route-lab governance through `apps/developer/scripts/check-route-lab-governance.mjs`.
6. Playwright smoke with the app-local Chromium smoke project.
7. Next build with `AFENDA_DEVELOPER_SANDBOX=true`.

The sequence intentionally checks fast static and unit failures before browser smoke and build work.

## CI Placement

The green-light gate belongs in:

- `.github/workflows/developer-lab.yml` as the dedicated route-lab workflow,
- `.github/workflows/ci.yml` before the general build gate,
- `.github/workflows/release-verification.yml` before the release gate self-check,
- `scripts/quality/check-release-gates.mjs` so the release meta-check fails if the gate is removed.

## Maintenance Rule

When adding a route-lab surface, update the route registry and route-lab governance first, then extend smoke or component tests as needed, then run:

```bash
pnpm check:developer-route-lab-greenlight
```

If this command fails because of workspace execution policy rather than code, use the direct wrapper:

```bash
node scripts/governance/check-developer-route-lab-greenlight.mjs
```

## Current Completion Evidence

The implemented green-light surface now exists in:

- `apps/developer/scripts/verify-greenlight.mjs`
- `scripts/governance/check-developer-route-lab-greenlight.mjs`
- root `package.json` scripts `check:developer-route-lab-greenlight` and
  `quality:developer-route-lab`
- `.github/workflows/developer-lab.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/release-verification.yml`
- `scripts/quality/check-release-gates.mjs`

The authoritative proof commands are:

```bash
node apps/developer/scripts/verify-greenlight.mjs
node scripts/governance/check-developer-route-lab-greenlight.mjs
node scripts/quality/check-release-gates.mjs
```
