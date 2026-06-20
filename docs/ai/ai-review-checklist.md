# AI Review Checklist

Complete before merging any AI-assisted PR.

## Architecture

- [ ] `pnpm quality:architecture` passes
- [ ] `pnpm quality:architecture-drift` passes
- [ ] No unregistered packages (AI-001)
- [ ] No unapproved runtime dependencies (AI-002)

## Scope

- [ ] `.tip-scope.json` present in PR
- [ ] All changed files within `allowedPaths`
- [ ] No changed files in `forbiddenPaths`
- [ ] No broad globs without `scopeExpansionAdr`
- [ ] `reason`, `nonGoals`, `testPlan` populated

## Code Quality

- [ ] New source files have tests or `testExemptions` (AI-008)
- [ ] Deletions documented in `deletionJustifications` (AI-009)
- [ ] No new unsafe suppressions on changed lines (AI-010)
- [ ] Imports use public package entrypoints only (AI-006)
- [ ] Contract edits backed by scope ADR (AI-007)

## Verification

- [ ] `pnpm quality:ai-governance -- --scope .tip-scope.json` passes
- [ ] `pnpm ci` passes

## Reviewer Sign-off

| Role | Name | Date |
|------|------|------|
| Architecture Authority | | |
| TIP Owner | | |
