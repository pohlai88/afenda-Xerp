# ADR-0005 — Exception Governance

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Architecture rules without an exception process are bypassed informally. Architecture rules with permanent exceptions become permanent debt. Enterprise platforms die from exceptions, not missing rules.

Exceptions may apply to ownership, layers, dependencies, or lifecycle — not only dependencies.

---

## Decision

1. **`ExceptionContract` is first-class** — separate from `DependencyContract` in `@afenda/architecture-authority`.

2. **No exception without ADR** — every exception references an Accepted ADR or amendment.

3. **No exception without expiry** — every exception has `expiresAt` (ISO date). Expired exceptions fail validation. **Temporary exceptions that outlive their expiry are prohibited.**

4. **Approval authority** — Architecture Authority approves all exceptions. Package owners propose; they do not self-grant exceptions.

5. **Exception record** — minimum fields:

   ```text
   packageName, subject, reason, adr, approvedBy, expiresAt, classification
   ```

   `subject` may be a dependency edge, layer assignment, ownership rule, or lifecycle gate.

6. **Baseline** — zero active exceptions at `ARCH-BASELINE-2026-06-20-v1`.

7. **Machine enforcement** — `validateExceptions()` consults `ExceptionContract` after rule validators; expired or unregistered bypass attempts fail.

---

## Consequences

### Positive

- Formal path for necessary deviations without silent drift
- Expiry prevents "temporary" becoming permanent

### Negative

- Exception paperwork overhead

---

## Acceptance Gate

- `ExceptionContract` implemented in TIP-001C (initially empty registry)
- `validateExceptions()` in TIP-001D
- CI fails on expired exceptions

---

## References

- [dependency-registry.md](../architecture/dependency-registry.md) — blocked patterns
- [ADR-0003](ADR-0003-dependency-governance.md)
- [ADR-0006](ADR-0006-package-lifecycle-governance.md)
