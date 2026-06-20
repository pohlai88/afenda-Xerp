# ADR-0003 — Dependency Governance

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Every runtime `@afenda/*` dependency must be declared and approved (ARCH-003). Undeclared workspace dependencies and circular graphs cause monorepo entropy.

TIP-001A mapped 14 approved runtime edges in [`dependency-registry.md`](../architecture/dependency-registry.md).

---

## Decision

1. **Registry-first dependencies** — live `package.json` `dependencies` must match approved edges in the dependency registry.

2. **Classification** — every edge is `Approved`, `Dev-only exempt`, `Exception`, `Deprecated`, or `Blocked`.

3. **Blocked patterns** — Design→Application, Design→Domain, Metadata→Domain, Foundation→Domain, Platform tooling→Application, Application sibling without ADR — are forbidden unless ADR-0005 exception.

4. **No circular dependencies** — runtime workspace graph must remain acyclic (ARCH-004).

5. **Drift detection** — committed `dependency-snapshot.json` (TIP-001F); unapproved diffs fail `architecture:drift`.

6. **Machine enforcement** — `validateDependencies()`, `validateForbiddenDependencies()`, `validateCycles()` consume `DependencyContract`.

Exceptions are **not** embedded in `DependencyContract`; they live in `ExceptionContract` (ADR-0005).

---

## Consequences

### Positive

- AI cannot add undeclared `@afenda/*` runtime deps without CI failure
- Snapshot provides audit trail without Git archaeology

### Negative

- Dependency changes require registry update before merge

---

## Acceptance Gate

- [`dependency-registry.md`](../architecture/dependency-registry.md) aligned with this ADR
- 14/14 baseline edges classified `Approved`
- `DependencyContract` implemented in TIP-001C

---

## References

- [dependency-registry.md](../architecture/dependency-registry.md)
- [ADR-0002](ADR-0002-layer-governance.md)
- [ADR-0005](ADR-0005-exception-governance.md)
