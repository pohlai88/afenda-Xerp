# Green-Light Automation Hardening

## Objective

Make the `@afenda/developer` route-lab proof surface a single governed
green-light gate that can run locally, from the workspace root, and from CI
without duplicating the verification sequence.

## Why

The route lab already proves the active Next.js route pattern in code:

- thin async route boundaries
- typed loader contracts
- route-local UI colocation
- request-dynamic operator rendering
- boundary-state hardening
- smoke and component-level proof

The next best-practice hardening move is not another route. It is making the
current proof surface reproducible everywhere that release and governance
decisions are made.

Without a single governed green-light path, the route lab risks:

- duplicated verification logic across scripts and workflows
- CI drift from app-local proof
- inconsistent answers to "is the route lab still promotion-safe?"

## Allowed Scope

- `apps/developer/**`
- `scripts/governance/**`
- `scripts/quality/check-release-gates.mjs`
- `.github/workflows/**`
- `package.json`
- `docs/architecture/DEVELOPER_ROUTE_LAB_GREENLIGHT.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

## Out of Scope

- `apps/erp/**`
- `apps/developer/src/app/api/**`
- auth
- tenant runtime
- database
- kernel imports
- mock backend infrastructure
- placeholder activation under `_actions`, `_queries`, or `modules/**`

## Constraints

- The app-owned runner remains the single source of truth.
- Root scripts and CI must delegate to the app-owned runner instead of copying
  its command list.
- This hardening must not introduce runtime authority or new route behavior.
- Workspace-level `pnpm` blockage caused by ignored-build enforcement must be
  reported separately from app-local failures.
- Documentation must preserve route-lab doctrine and audit terminology.

## Required Deliverables

- one app-owned green-light runner that owns the full verification sequence
- one root Node delegate that resolves and runs the app-owned runner
- root script aliases for route-lab verification
- CI and release workflow adoption that calls the root delegate
- release-gate self-check updates so removal of the green-light gate becomes a
  governance failure
- audit and architecture-doc evidence updates that describe the final proof path

## Verification

- `node apps/developer/scripts/verify-greenlight.mjs`
- `node scripts/governance/check-developer-route-lab-greenlight.mjs`
- `node scripts/quality/check-release-gates.mjs`
- `.\node_modules\.bin\biome ci .github/workflows/ci.yml .github/workflows/developer-lab.yml .github/workflows/release-verification.yml package.json scripts/quality/check-release-gates.mjs scripts/governance/check-developer-route-lab-greenlight.mjs apps/developer/README.md docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`

## Done Means

- the app-owned runner executes Biome, Vitest, Next type generation,
  TypeScript, route-lab governance, Playwright smoke, and sandbox build in one
  fixed order
- the workspace root can call the same proof path through a thin Node delegate
- CI and release workflows use the root delegate instead of duplicating app
  verification logic
- release-gate meta-checking fails if the route-lab green-light gate is removed
- the route lab becomes more governable and more reproducible, but not more
  powerful

## Completion Status

Current state: `Implemented`

This hardening slice is now represented in the codebase by:

- `apps/developer/scripts/verify-greenlight.mjs`
- `scripts/governance/check-developer-route-lab-greenlight.mjs`
- root `package.json` route-lab verification scripts
- `.github/workflows/developer-lab.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/release-verification.yml`
- `scripts/quality/check-release-gates.mjs`

## Related Docs

- `apps/developer/src/app/(lab)/CODEX_GOAL_TEMPLATE.md`
- `apps/developer/src/app/(lab)/ROUTE_BEST_PRACTICE_SLICE_1.md`
- `docs/architecture/DEVELOPER_ROUTE_LAB_GREENLIGHT.md`
- `docs/architecture/ROUTE_LAB_NEXTJS_VERCEL_AUDIT.md`
