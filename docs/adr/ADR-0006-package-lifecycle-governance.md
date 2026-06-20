# ADR-0006 — Package Lifecycle Governance

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Steady-state governance (ownership, layers, dependencies) does not govern **change** — package birth, merge, split, deprecation, retirement, and restoration. Without lifecycle governance, AI produces `database-v2`, `*-temp`, and `*-rewrite` packages.

TIP-001G documented lifecycle policy in [`package-lifecycle.md`](../architecture/package-lifecycle.md).

---

## Decision

1. **Lifecycle states** — `planned`, `experimental`, `active`, `deprecated`, `retired` as defined in the lifecycle registry document.

2. **Constitutional create flow** — ADR → registries → registration → implementation. Forbidden: `*-v2`, `*-new`, `*-temp`, `*-rewrite` without retirement ADR.

3. **`experimental`** — not production, not runtime-depended upon, no public API guarantee, must expire (90-day default), must have owner.

4. **Deprecation** — maximum 12 months without Architecture Authority review; owner remains accountable until `retired`.

5. **Retirement** — Architecture Authority sign-off; zero consumers; registry history retained.

6. **Restore** — retired packages may return only via ADR, owner confirmation, layer and dependency re-review.

7. **Audit events** — `package.created`, `.merged`, `.split`, `.deprecated`, `.retired`, `.restored` (TIP-010+ automation).

8. **Machine enforcement** — `validateLifecycle()` consumes `LifecycleContract`; registry status values (`active`, `active-exempt`, `planned`, etc.) are machine-readable per [`package-registry.md`](../architecture/package-registry.md).

---

## Consequences

### Positive

- Change governance matches steady-state governance
- Experiments cannot hide in `planned` indefinitely

### Negative

- Package creation and retirement require process

---

## Acceptance Gate

- [`package-lifecycle.md`](../architecture/package-lifecycle.md) aligned with this ADR
- [`package-registry.md`](../architecture/package-registry.md) registry IDs and status enum defined
- `LifecycleContract` implemented in TIP-001C

---

## References

- [package-lifecycle.md](../architecture/package-lifecycle.md)
- [package-registry.md](../architecture/package-registry.md)
- [ADR-0000](ADR-0000-architecture-constitution.md)
- [ADR-0004](ADR-0004-ownership-governance.md)
