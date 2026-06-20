# ADR-0004 — Ownership Governance

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-20 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Every package must have exactly one owner (ARCH-001). Ownership without defined responsibilities is a label, not governance. Multi-owner and orphan packages prevent accountability in AI-assisted development.

TIP-001A documented ownership in [`ownership-registry.md`](../architecture/ownership-registry.md).

---

## Decision

1. **Single owner** — exactly one owner domain per package; shared ownership is forbidden.

2. **Authority levels** — `architecture`, `platform`, `design`, `metadata`, `erp-spine`, `domain`, `application` align with governance bodies, not technical layers.

3. **Responsibilities** — owners approve public API, dependencies, and deprecations for their packages.

4. **Restrictions** — owners may not change another package's ownership, override Architecture Authority, or create exceptions without ADR-0005.

5. **Escalation** — conflicts between owner domains resolve at Architecture Authority.

6. **Transfer** — ownership changes require ADR, current owner sign-off, new owner sign-off, and Architecture Authority approval.

7. **Deprecation accountability** — existing owner remains accountable until lifecycle state is `retired`.

8. **Machine enforcement** — `validateOwnership()` consumes `OwnershipContract`; audit questions table drives TIP-001F `ownership-audit.md`.

---

## Consequences

### Positive

- "Who owns this?" and "who approves API changes?" are answerable from registry
- Design vs Metadata disputes have explicit escalation

### Negative

- Ownership transfer is multi-step

---

## Acceptance Gate

- [`ownership-registry.md`](../architecture/ownership-registry.md) aligned with this ADR
- 17/17 active packages with single owner
- `OwnershipContract` implemented in TIP-001C

---

## References

- [ownership-registry.md](../architecture/ownership-registry.md)
- [ADR-0000](ADR-0000-architecture-constitution.md)
