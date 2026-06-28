# AI Change Boundaries

## Allowed AI Changes

- Changes within declared `.tip-scope.json` `allowedPaths`
- Package creation only when registered in architecture authority (ADR-backed)
- Dependency additions only when approved in dependency registry
- Contract changes only when backed by scope `adr`
- Suppressions on changed lines only with TIP/ADR rationale or `testExemptions`

## Prohibited AI Changes

- Unscoped file modifications
- Broad scope globs (`**/*`, `packages/**`, `apps/**`, `.github/**`) without `scopeExpansionAdr`
- Forbidden package directory patterns
- Private `@afenda/*/src/` or `@afenda/*/dist/` imports
- Deep relative imports across package boundaries
- ERP or domain feature code during governance TIPs
- Silent linter/type/test suppressions
- Undeclared file deletions

## `.tip-scope.json` Schema

Every PR must commit `.tip-scope.json` at repo root.

```json
{
  "tip": "Foundation phase 02",
  "adr": "ADR-0007",
  "allowedPaths": [],
  "forbiddenPaths": [],
  "reason": "",
  "nonGoals": [],
  "testPlan": [],
  "deletionJustifications": [],
  "testExemptions": [],
  "scopeExpansionAdr": "ADR-0000"
}
```

| Field | Required | Purpose |
|-------|----------|---------|
| `tip` | yes | TIP identifier |
| `adr` | yes | Backing ADR for contract changes |
| `allowedPaths` | yes | Explicit allow-list globs |
| `forbiddenPaths` | yes | Explicit deny-list globs |
| `reason` | yes | Human-readable scope statement |
| `nonGoals` | yes | Declared exclusions |
| `testPlan` | yes | Verification commands |
| `deletionJustifications` | yes | `{ path, reason }[]` for deletions |
| `testExemptions` | yes | `{ path, rationale }[]` for non-tested files |
| `scopeExpansionAdr` | conditional | Required for broad globs |

## Scope Rules

```text
CI must not guess scope.
PR declares scope.
CI validates scope.
```

CI compares `git diff origin/main...HEAD` against the manifest. Branch names are labels; scope manifests are contracts.

## Broad Glob Protection

These `allowedPaths` entries fail unless `scopeExpansionAdr` references an Accepted ADR:

- `**/*`
- `packages/**`
- `apps/**`
- `.github/**`

Global files (`package.json`, `pnpm-lock.yaml`) must still be listed explicitly.
