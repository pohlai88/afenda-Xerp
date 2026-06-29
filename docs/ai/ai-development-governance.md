# AI Development Governance

| Field | Value |
|-------|-------|
| **Status** | Active |
| **Owner** | Architecture Authority |
| **TIP** | Foundation phase 02 |
| **ADR** | ADR-0007 |

## Purpose

Establish machine-enforced rules for AI-assisted development after Foundation phase 01 Architecture Authority is active. AI governance controls **how** AI may modify the repo; architecture authority controls **what** may exist.

## Invariants

| ID | Rule |
|----|------|
| AI-001 | No unregistered packages — delegates to architecture-authority |
| AI-002 | No unapproved `@afenda/*` runtime dependencies — delegates to architecture-authority |
| AI-003 | No forbidden package name patterns (`*-v2`, `*-new`, `*-temp`, `legacy-*`, etc.) |
| AI-004 | No file changes outside declared `.tip-scope.json` allowedPaths |
| AI-004-SCOPE | No broad scope globs without ADR-backed `scopeExpansionAdr` |
| AI-005 | No domain business logic in Platform, Design, Metadata, or architecture packages |
| AI-006 | No private or deep imports — public exports only |
| AI-007 | No contract edits without ADR backing |
| AI-008 | New source files require tests or documented `testExemptions` |
| AI-009 | File deletions require `deletionJustifications` |
| AI-010 | No new unsafe suppressions on changed lines |

## Definition of Done

```bash
pnpm --filter @afenda/ai-governance build
pnpm --filter @afenda/ai-governance test:run
pnpm quality:architecture
pnpm quality:architecture-drift
pnpm quality:ai-governance -- --scope .tip-scope.json
pnpm quality
pnpm ci
```

## Acceptance Criteria

- `@afenda/ai-governance` builds and tests pass
- Validators enforce AI-001 through AI-010
- ADR-0007 is Accepted
- CI blocks scope drift and AI violations on PRs
- No ERP feature code introduced
- Foundation phase 01 rules are delegated, not duplicated

## Rollback Expectations

1. Revert the PR
2. Remove or restore `.tip-scope.json`
3. Run `pnpm quality:architecture && pnpm quality:ai-governance && pnpm ci`
4. Contract-breaking rollback requires a new ADR

## References

- [docs/ai/README.md](./README.md)
- [ADR-0007](../adr/ADR-0007-ai-development-governance.md)
- [docs/PAS/README.md](../PAS/README.md)
