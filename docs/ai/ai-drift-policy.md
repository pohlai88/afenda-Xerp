# AI Drift Policy

## Drift Indicators

| Indicator | Invariant | Detection |
|-----------|-----------|-----------|
| Unscoped file change | AI-004 | Changed file outside `allowedPaths` |
| Broad scope glob | AI-004-SCOPE | `**/*`, `packages/**`, etc. without ADR |
| Forbidden package name | AI-003 | Directory matches forbidden pattern |
| New unsafe suppression | AI-010 | Changed line adds `@ts-ignore`, `biome-ignore`, etc. |
| Contract edit without ADR | AI-007 | `*.contract.ts` changed without scope ADR |
| Missing test coverage | AI-008 | New source without test or exemption |
| Undeclared deletion | AI-009 | Deleted file not in `deletionJustifications` |
| Unapproved dependency | AI-002 | architecture-authority dependency gate |
| Private import | AI-006 | Non-export import path |

## Baseline vs Scope Mode

| Mode | Command | AI-010 |
|------|---------|--------|
| Baseline | `pnpm quality:ai-governance` | Skipped — no old-debt failures |
| Scope | `pnpm quality:ai-governance -- --scope .tip-scope.json` | Changed lines only |

## Rollback

1. Revert PR
2. Restore prior `.tip-scope.json` or remove from `main`
3. Re-run quality gates
4. Document incident if contract was broken — requires new ADR

## Prevention

- Declare scope before implementation
- Narrow `allowedPaths` — never use `**/*` without ADR
- Delegate registry truth to Foundation phase 01 — do not duplicate in ai-governance
