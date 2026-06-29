# Identity Promotion Process

| Field | Value |
|-------|-------|
| **Authority** | [PAS-001 §4.1.14](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) · [ADR-0021](../adr/ADR-0021-canonical-enterprise-identity.md) |
| **Governance** | `scripts/governance/identity/` (Slice E) |
| **Status** | Accepted — architecture record (Slice A) |

---

## Purpose

Defines how a new enterprise ID family moves from proposal to platform-floor authority — without orphan types, duplicate prefixes, or consumer-local string aliases.

---

## Promotion checklist

Before a family is exported from `@afenda/kernel`:

| # | Requirement | Evidence |
|---|-------------|----------|
| 1 | ADR or PAS amendment records family, prefix, owner | ADR merged, status Accepted |
| 2 | Registry row in `ID_FAMILIES` with `prefix`, `typeName`, `owner`, `recordOwner`, and `generates` | `identity/registry/id-family.registry.ts` |
| 3 | Prefix is exactly three lowercase ASCII letters (`[a-z]{3}`) and does not collide with existing families | duplicate-prefix and prefix-format tests |
| 4 | Parser + validator | `parse*` + `is*` tests green |
| 5 | Generator (if `generates: true`) | `create*` round-trip tests |
| 6 | Wire normalizer registered | `identity/wire/` coverage |
| 7 | Kernel tests | valid, invalid, wrong-prefix, wrong-body, registry parity |
| 8 | `pnpm check:kernel-identity-surface` | exit 0 |
| 9 | Database CHECK + UNIQUE for governed entity tables that persist the family in `enterprise_id`; documented exception for non-entity/event-only families | migration + `check:enterprise-id-db-parity` |
| 10 | `pnpm check:enterprise-id-db-parity` | exit 0 |
| 11 | Public contracts remain JSON-serializable: canonical IDs cross wire boundaries as strings; branded types remain compile-time only | contract tests / type surface review |
| 12 | ERP/API ingress | `parse*` at boundary — no `as FamilyId` |
| 13 | Forbidden fiscal IDs | remain off platform floor |

---

## What is not promoted through this process

| Item | Correct path |
|------|--------------|
| Tenant human reference (`employee_no`) | Domain PAS slice + ADR-0023 |
| Fiscal calendar/period IDs | [ADR-0031](../../adr/ADR-0031-fiscal-domain-id-authority.md) — KV-ACCT only; off platform floor |
| Domain-internal surrogate keys | Owning package only — not Kernel |
| Primitive references (`CurrencyCode`) | `identity/primitives/` — separate registry |

---

## Slice ownership

| Slice | Action |
|-------|--------|
| A | Record decision (ADR + PAS + this doc) |
| B | Implement Kernel registry + parser + generator |
| C | Add database CHECK + migration helpers |
| D | Wire ERP/API `parse*` ingress |
| E | Add governance scripts (`check-id-family-registry-parity`, `check-no-unsafe-id-casts`, …) |

---

## Deprecation: legacy `platform-id*`

During Slice B:

1. Move implementations to `identity/families/` and `identity/registry/`.
2. Keep `families/platform-id.contract.ts` as thin compatibility barrel if needed.
3. Remove `contracts/platform-id*.ts` after importers updated.
4. Gate: `pnpm check:forbidden-platform-ids` (Slice E).

Do not hard-delete `contracts/platform-id*.ts` in the same slice unless all importers are migrated and tests prove it.

---

## Depromotion / removal

An exported enterprise ID family may not be removed silently.

Deprecation requires:

1. ADR/PAS amendment marking the family deprecated, replaced, or withdrawn.
2. Replacement family and migration path, if applicable.
3. Import scan proving no active runtime dependency remains.
4. Database migration plan for persisted `enterprise_id` values, if applicable.
5. Governance check updated to reject new usage while allowing approved migration exceptions.

---

## Registry row template

```ts
export const ID_FAMILIES = {
  employee: {
    typeName: "EmployeeId",
    prefix: "emp",
    owner: "@afenda/kernel",
    recordOwner: "@afenda/hrm",
    generates: true,
  },
} as const satisfies Record<string, EnterpriseIdFamilyDefinition>;
```

Every row must have unique `prefix` and unique `typeName`. Use package-style ownership strings (`@afenda/kernel`, `@afenda/hrm`, …) for architecture registry validation.

---

## Governance principle

> No enterprise ID family enters the platform floor by type export alone. It must pass decision authority, registry authority, parser authority, wire authority, and persistence/governance authority where applicable.

---

## References

- [canonical-enterprise-id-constitution.md](./canonical-enterprise-id-constitution.md)
- [PAS-001 §4.1.14](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)
- PAS companion: [`PAS-001`](../../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md) §4.1
