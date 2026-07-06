# CI promotion — advisory to blocking

Knip currently runs as a **non-blocking** PR signal in [`.github/workflows/housekeeping-advisory.yml`](../../../.github/workflows/housekeeping-advisory.yml) via `pnpm housekeeping:knip:advisory:turbo` with `continue-on-error: true`.

Use **promote** mode to assess readiness. All criteria must pass before moving the job into [`ci.yml`](../../../.github/workflows/ci.yml) without `continue-on-error`.

## Promotion criteria (all required)

1. **Zero findings per enabled workspace** — each package in `knip.jsonc` `workspaces` reports no unused files, exports, or deps for its configured globs
2. **Strict turbo green on main** — `pnpm housekeeping:knip:turbo` exit 0 on `main` for 2 consecutive weeks **or** 10 consecutive green PRs
3. **No open align debt** — no unresolved `registry-drift` or `catalog-drift` in enabled workspaces
4. **Storybook orphan safety** — [`quarantine-orphan-scan.test.ts`](../../../scripts/storybook/__tests__/quarantine-orphan-scan.test.ts) passing in CI
5. **Vocabulary / presentation packages export noise** — `@afenda/kernel`, `@afenda/architecture-authority`, `@afenda/enterprise-knowledge`, and `@afenda/shadcn-studio` may report unused exports/types when consumed only outside the workspace; **do not** require zero export findings — require zero **unused files** + zero **unused dependencies** instead

## promote mode output template

```markdown
## CI promotion assessment

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Zero per-workspace findings | pass/fail | knip:turbo output / date |
| Main strict green (duration) | pass/fail | N weeks / N PRs |
| Align debt cleared | pass/fail | registry/catalog items |
| Orphan script tests | pass/fail | test file in CI |

**Verdict:** GO / NO-GO

**If GO:** Move knip job from housekeeping-advisory.yml to ci.yml; remove continue-on-error; use strict `housekeeping:knip:turbo`.

**If NO-GO:** List blockers; recommend audit/align/expand slices.
```

## Current rollout status (baseline)

Enabled workspaces (waves 0–5): observability, testing, typescript-config, auth, permissions, entitlements, feature-flags.

Known deferred (not blockers for expand, blockers for strict zero):

- `@afenda/entitlements` — intentional-public service stubs
- `@afenda/feature-flags` — facade re-exports
- Root script noise when using unscoped `housekeeping:knip`

Next expand target before promotion: complete Design layer (`shadcn-studio`) at minimum for ERP presentation debt.

## Implementation note (when user approves GO)

1. Add job to `ci.yml` running `pnpm housekeeping:knip:turbo` (strict, no `--no-exit-code`)
2. Keep or retire `housekeeping-advisory.yml` — prefer single strict gate once promoted
3. Update AGENTS.md and this file with promotion date
