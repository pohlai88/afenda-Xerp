# ADR-0007 — AI Development Governance

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

TIP-001 established architecture authority for packages, layers, ownership, and dependencies. AI-assisted development can bypass these rules through unscoped changes, duplicate packages, private imports, unsafe suppressions, and undeclared deletions.

ADR-0001 defines TIP-002 as the AI development governance spine.

---

## Decision

1. **AI governance package** — `@afenda/ai-governance` (PKG-019) enforces AI-specific invariants.

2. **Delegation to TIP-001** — AI-001 and AI-002 delegate to `@afenda/architecture-authority`. AI governance does not maintain a parallel registry.

3. **PR scope contract** — Every PR commits `.tip-scope.json`. CI validates `git diff` against declared scope. CI must not infer scope from branch names or changed files alone.

4. **Invariants AI-001 through AI-010** — As defined in [`docs/ai/ai-development-governance.md`](../ai/ai-development-governance.md).

5. **Broad glob protection** — `allowedPaths` may not contain `**/*`, `packages/**`, `apps/**`, or `.github/**` unless `scopeExpansionAdr` references an Accepted ADR.

6. **Changed-line suppression scan** — AI-010 scans changed lines only in scope mode. Baseline mode skips AI-010 to avoid failing on historical debt.

7. **Export-aware imports** — AI-006 allows only public `package.json` export entrypoints.

8. **CI integration** — `pnpm quality:ai-governance` in quality chain, CI, preview verification, release verification, and release gate checker.

---

## Consequences

### Positive

- AI changes are bounded by explicit scope contracts
- Architecture truth remains single-sourced in TIP-001
- New suppressions and scope drift blocked at CI

### Negative / trade-offs

- Every PR requires scope manifest maintenance
- Broad changes require ADR-backed scope expansion

---

## Acceptance Gate

- [`docs/ai/README.md`](../ai/README.md) and policy documents exist
- `@afenda/ai-governance` builds and tests pass
- `pnpm quality:ai-governance` passes in CI
- PKG-019 registered in architecture registries
- ADR-0007 status Accepted

---

## References

- [`docs/ai/README.md`](../ai/README.md)
- [`docs/architecture/package-registry.md`](../architecture/package-registry.md)
- [ADR-0001](./ADR-0001-phase-1-foundation-redefinition.md)
- [ADR-0006](./ADR-0006-package-lifecycle-governance.md)
