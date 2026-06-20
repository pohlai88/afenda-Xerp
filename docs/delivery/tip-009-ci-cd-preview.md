# TIP-009 — CI/CD and Preview Workflow Foundation

**Status:** Complete  
**Authority:** Delivery Governance Spine — all future TIPs must pass TIP-009 gates  
**Date:** 2026-06-20

---

## Purpose

TIP-009 establishes Afenda's delivery governance spine. It is the single authority for:

- CI execution
- quality gates
- build verification
- package boundary verification
- migration verification
- release readiness
- preview deployments

No future TIP may bypass TIP-009 gates.

---

## Architecture

TIP-009 is **workflow ownership**, not package ownership. No new packages are created.

| Owner | Responsibility |
|---|---|
| GitHub Actions | validation, quality gates, verification |
| Vercel | preview deployment |
| Turborepo | workspace execution |
| Package owners | tests, contracts, correctness |

---

## Workflows Added

### `.github/workflows/ci.yml`

Runs on every pull request and push to `main`.

**7 quality gates — all mandatory:**

| Gate | Command | What it checks |
|---|---|---|
| 1 | `pnpm typecheck` | TypeScript type safety across all packages |
| 2 | `pnpm format:check` + `pnpm lint` | Code quality and formatting via Ultracite/Biome |
| 3 | `pnpm test` | Test quality via Vitest |
| 4 | `pnpm build` | Build safety via Turborepo |
| 5 | `pnpm quality:boundaries` | Package boundary integrity |
| 6 | `pnpm quality:migrations` | Drizzle migration journal integrity |
| 7 | `pnpm quality:exports` | Public API export surface stability |
| ∞ | `pnpm quality:release-gate` | TIP-009 governance self-check |

Produces a GitHub step summary with pass/fail status and local reproduction instructions on failure.

### `.github/workflows/preview.yml`

Runs on every non-draft pull request targeting `main`.

- `preview-policy` job validates preview constraints (not production, not protected branch)
- `vercel-preview` job builds and deploys an isolated preview to Vercel
- Posts a PR comment with the preview URL on every push (updates in place)
- Produces a GitHub step summary

Preview deployments:
- are isolated per pull request
- are disposable (no production impact)
- are skipped gracefully when Vercel secrets are not configured
- map back to the originating pull request via PR comment

### `.github/workflows/release-verification.yml`

Runs on every push to `main` and on published releases.

Mirrors all 7 CI gates. Adds a release-specific step summary. No merge to `main` without this passing. Uses `cancel-in-progress: false` to never interrupt a release verification in progress.

---

## Quality Scripts

All scripts live in `scripts/quality/`. None are temporary. All are permanent infra.

### `check-package-boundaries.mjs`

Enforces package boundary rules across all `apps/` and `packages/`:

- workspace imports must be declared in `package.json`
- subpath imports must match a declared `exports` entry
- relative imports must not cross package roots
- deep internal imports are forbidden

Checks all `.js`, `.jsx`, `.mjs`, `.ts`, `.tsx` source files. Ignores `dist`, `.next`, `node_modules`, `coverage`.

### `check-public-exports.mjs`

Validates every package's export surface:

- root export (`.`) must exist
- every export must use a condition object (`{ types, import, default }`)
- all targets must point to `./dist/` not `./src/`
- every declared export must have a corresponding source file

### `check-migrations.mjs`

Validates Drizzle migration integrity:

- delegates to `db:validate-journal` (offline: no DB required)
- when `DATABASE_URL` is set, also runs `db:repair-journal:check` (live ledger check)
- fails CI on any journal integrity issue

The `@afenda/database` `journal.contract.ts` and `ledger.contract.ts` provide the typed validation contracts used by the migration scripts.

### `check-preview-policy.mjs`

Enforces preview deployment constraints:

- only `pull_request` events permitted
- `VERCEL_ENV` must never be `production`
- protected branch names (`main`, `master`, `production`) are blocked

### `check-release-gates.mjs`

TIP-009 governance self-check:

- all 3 required workflow files exist (`.node-version`, `ci.yml`, `preview.yml`, `release-verification.yml`)
- `ci.yml` contains every required command
- `release-verification.yml` contains every required gate command
- `package.json` defines all required quality scripts
- `docs/delivery/tip-009-ci-cd-preview.md` exists

---

## Package Boundary Governance

A package may only import through approved public entrypoints.

**Forbidden:**
```
@repo/database/src/internal/...   ← deep internal import
../../packages/auth/src/session   ← cross-package relative import
```

**Required:**
```
@afenda/database                  ← public entrypoint
@afenda/auth                      ← public entrypoint
@afenda/auth/client               ← declared subpath export
```

Packages with declared `exports` fields must declare every allowed entrypoint. Undeclared subpaths are blocked by `check-package-boundaries.mjs`.

---

## Export Governance

Every package owns `src/index.ts` as its primary public surface.

All public API flows through `index.ts` → `dist/index.js` → `exports["."]`.

**Forbidden:**
- `./src/` targets in package.json exports
- Missing `types`, `import`, or `default` conditions
- Exports without a matching source file

---

## Database Governance

TIP-009 verifies on every CI run:

1. **Journal integrity** — all entries have sequential idx, unique tags, and matching SQL files
2. **No orphan SQL** — every `.sql` file in migrations/ is listed in the journal
3. **Hash consistency** — SQL content hashes match between journal and live DB (when `DATABASE_URL` is available)
4. **Ledger drift detection** — `created_at` timestamps in the DB match journal expectations

**Forbidden:**
- Unreviewed migration changes
- Manual production schema drift
- Migration journal repairs without CI verification

---

## Preview Governance

| Constraint | Enforcement |
|---|---|
| Only `pull_request` events | `check-preview-policy.mjs` |
| `VERCEL_ENV` ≠ `production` | `check-preview-policy.mjs` |
| Protected branches blocked | `check-preview-policy.mjs` |
| Isolated per PR | Vercel preview environment |
| No production impact | `environment: preview` isolation |
| PR comment with URL | `actions/github-script@v7` |

---

## Release Governance

Protected branch (`main`) requires:

- `ci.yml` success on the merging PR
- `release-verification.yml` success on push to `main`
- All 7 gates passing

**No release is allowed if any gate fails.**

Protected branch policy must be configured in GitHub repository settings:

- Require status checks: `quality` (ci.yml job)
- Require branches to be up to date before merging
- Do not allow bypass for administrators

---

## Local Verification

Full gate before requesting review:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm quality
```

All-in shorthand:

```sh
pnpm run ci
```

---

## Prohibited Drift

The following are permanently forbidden:

- Bypassing CI
- Bypassing typecheck
- Bypassing lint
- Bypassing tests
- Bypassing build verification
- Bypassing migration verification
- Bypassing package boundaries
- Bypassing export governance
- Deploying directly from feature branches
- Production releases without all gates passing

---

## Completion Report

### Workflows Added

| File | Status |
|---|---|
| `.github/workflows/ci.yml` | Created — 7 gates + self-check + step summary |
| `.github/workflows/preview.yml` | Created — policy guard + Vercel deploy + PR comment |
| `.github/workflows/release-verification.yml` | Created — mirrors all 7 gates on protected branch push |

### Gates Added

| Gate | Script | Status |
|---|---|---|
| Typecheck | `pnpm typecheck` | Active in ci.yml + release-verification.yml |
| Lint | `pnpm lint` | Active in ci.yml + release-verification.yml |
| Test | `pnpm test` | Active in ci.yml + release-verification.yml |
| Build | `pnpm build` | Active in ci.yml + release-verification.yml |
| Package boundaries | `pnpm quality:boundaries` | Active |
| Migration integrity | `pnpm quality:migrations` | Active |
| Export surface | `pnpm quality:exports` | Active |
| Release self-check | `pnpm quality:release-gate` | Active |

### Boundary Checks

- Cross-package relative imports: blocked
- Undeclared workspace imports: blocked
- Deep subpath imports without declared export: blocked
- `@afenda/*` packages covered: all packages in `apps/` and `packages/`

### Migration Checks

- Journal sequential idx: verified
- Duplicate tags: detected
- Missing SQL files: detected
- Orphan SQL files: detected
- Live ledger hash drift: verified when `DATABASE_URL` is present
- Current migration count: 13 entries (idx 0–12)

### Export Checks

- Root export (`.`) presence: required
- Condition object format (`types`, `import`, `default`): required
- `./dist/` targets only: enforced
- `./src/` exposure: blocked
- Source file existence: verified

### Preview Strategy

- Isolated Vercel preview per pull request
- Preview URL posted as PR comment (updated on each push)
- Policy guard prevents production deployment from preview workflow
- Secrets-absent graceful skip

### Rollback Strategy

If a release breaks production:

1. Revert the merge commit on `main` via a new PR
2. The revert PR must pass all CI gates before merge
3. `release-verification.yml` re-runs on the reverted `main`
4. No direct push to `main` (branch protection enforces this)
5. Database migrations: use `db:repair-journal` to reconcile after rollback

### Drift Risks

| Risk | Mitigation |
|---|---|
| Developer merges with CI disabled | Branch protection rules (must configure in GitHub) |
| Secrets not provisioned in new forks | Vercel deploy steps skip gracefully; policy check still runs |
| `DATABASE_URL` not set in CI | Migration live check skipped with log message; offline check still runs |
| Package boundary rules become stale | `check-package-boundaries.mjs` auto-discovers all packages |
| New package added without exports | `check-public-exports.mjs` validates every discovered package |

### Final Verdict

**TIP-009 is complete.**

All 7 gates are active. All 3 required workflows exist. All quality scripts are wired. The delivery governance spine is in place. No future TIP may bypass these gates.

The self-referential `check-release-gates.mjs` ensures the governance structure cannot silently degrade — any drift in the workflow files or quality scripts will fail CI.
