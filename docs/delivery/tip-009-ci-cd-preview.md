# TIP-009 CI/CD and Preview Workflow

TIP-009 standardizes Afenda delivery gates for pull requests, protected branches, and Vercel previews. The pipeline blocks drift by requiring format checks, lint, typecheck, tests, builds, migration checks, package-boundary checks, and public export checks before release.

## Pull Request Gates

Every pull request to `main` runs `.github/workflows/ci.yml`.

Required gates:

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm quality:boundaries`
- `pnpm quality:exports`
- `pnpm quality:migrations`
- `pnpm quality:release-gate`

Merges must remain blocked when any required gate fails.

## Package Boundary Rules

`pnpm quality:boundaries` prevents cross-package drift:

- workspace package imports must be declared in `package.json`
- internal package files must not be imported through unexported subpaths
- relative imports must not cross app or package boundaries
- public imports must use declared package export entries

## Public Export Rules

`pnpm quality:exports` validates package export surfaces:

- exported package entrypoints must use condition objects
- `types`, `import`, and `default` targets must point to `dist`
- exports must not expose `src`
- root package exports must include `.`
- exported dist files must map to real source files

## Drizzle Migration Rules

`pnpm quality:migrations` always runs the offline Drizzle journal check.

When `DATABASE_URL` is available, it also runs the live ledger check. Migration changes are not mergeable unless journal validation passes. Unsafe or unchecked migration edits must be repaired before review.

## Preview Deployment Policy

`.github/workflows/preview.yml` runs only for pull requests targeting `main`.

Preview deployment rules:

- preview runs use `VERCEL_ENV=preview`
- production deployment is never allowed from the preview workflow
- protected branch names must not be deployed by the preview workflow
- Vercel deployment runs only when `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are configured
- previews are tied to the pull request and must not affect production

## Release Gates

Protected branches require:

- successful CI
- reviewed migration changes when migrations are touched
- package-boundary and export checks passing
- feature release behavior controlled through TIP-008 entitlements or feature flags
- no direct production release from unverified branches

Release owners must not bypass CI for production releases.

## Local Verification

Run the full local gate before requesting review:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm quality
```

The short all-in command is:

```sh
pnpm run ci
```

## Completion Report Requirement

Every TIP completion report must include:

- CI status
- checked commands
- migration result
- boundary result
- export-surface result
- preview status
- risks
- rollback
- verdict
