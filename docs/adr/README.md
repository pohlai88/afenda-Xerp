# Architecture Decision Records (ADR)

Constitutional decisions for the Afenda ERP platform. ADRs sit between human registries and machine enforcement.

## Hierarchy

```text
ADR  >  Registry  >  Machine Contract  >  Validator  >  CI Gate
```

See [`docs/architecture/README.md`](../architecture/README.md).

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-0000](ADR-0000-architecture-constitution.md) | Architecture Constitution | Accepted |
| [ADR-0001](ADR-0001-phase-1-foundation-redefinition.md) | Phase 1 Foundation Redefinition | Accepted |
| [ADR-0002](ADR-0002-layer-governance.md) | Layer Governance | Accepted |
| [ADR-0003](ADR-0003-dependency-governance.md) | Dependency Governance | Accepted |
| [ADR-0004](ADR-0004-ownership-governance.md) | Ownership Governance | Accepted |
| [ADR-0005](ADR-0005-exception-governance.md) | Exception Governance | Accepted |
| [ADR-0006](ADR-0006-package-lifecycle-governance.md) | Package Lifecycle Governance | Accepted |

## Process

1. **Propose** — draft ADR from [ADR-template.md](ADR-template.md)
2. **Review** — Architecture Authority + affected owner domains
3. **Accept** — status → Accepted; update registries if material
4. **Implement** — machine contracts and validators (TIP-001C+)
5. **Enforce** — CI gates (TIP-001E+)

## Rules

- New architectural patterns require an Accepted ADR (ARCH-009).
- Registry changes for material governance require ADR backing.
- Exceptions require ADR-0005 and an entry in `ExceptionContract` (TIP-001C).
- No exception may exist without expiry.

## Related

- Baseline: [`docs/architecture/architecture-authority-baseline.md`](../architecture/architecture-authority-baseline.md)
- Fingerprint: `ARCH-BASELINE-2026-06-20-v1`
