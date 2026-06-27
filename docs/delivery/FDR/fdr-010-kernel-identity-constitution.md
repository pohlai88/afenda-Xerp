# fdr-010-kernel-identity-constitution — Documentation Note

| Field | Value |
| --- | --- |
| **Document role** | Architecture / delivery cross-reference — **not** an FDR implementation authority |
| **Status** | Slice A–E complete (PAS §4.1 production-ready) |
| **Registry entry** | `PKG010_KERNEL` (shared with fdr-010-context-contracts, fdr-010-platform-authority, fdr-010-master-data-authority) |
| **Date** | 2026-06-27 |

---

## Purpose

Records the **PAS §4.1 Canonical Enterprise ID Constitution** delivery sequence under PKG-010 without creating a parallel FDR registry entry. Runtime implementation is gated by ADR acceptance and serialized slices B–E.

This note does **not** change `foundation-disposition.registry.ts`. Registry edits require `foundation-registry-owner`.

---

## Authority stack

| Layer | ADR | Architecture doc |
| --- | --- | --- |
| Kernel constitution | [ADR-0021](../../adr/ADR-0021-canonical-enterprise-identity.md) | [canonical-enterprise-id-constitution.md](../../architecture/identity/canonical-enterprise-id-constitution.md) |
| PostgreSQL split-ID | [ADR-0022](../../adr/ADR-0022-postgres-split-id-persistence-model.md) | [postgres-split-id-model.md](../../architecture/identity/postgres-split-id-model.md) |
| Tenant human reference | [ADR-0023](../../adr/ADR-0023-tenant-human-reference-numbering.md) | [tenant-human-reference-model.md](../../architecture/identity/tenant-human-reference-model.md) |
| Promotion process | PAS-001 §4.1.14 | [identity-promotion-process.md](../../architecture/identity/identity-promotion-process.md) |

Normative standard: [PAS-001 §4.1](../../PAS/PAS-001-KERNEL-AUTHORITY-STANDARD.md).

---

## Enterprise coding sequence (§4.1)

| Slice | Layer | Scope | Status |
| --- | --- | --- | --- |
| **A** | Architecture Authority | ADRs, PAS, architecture docs, skill reference | **Complete** (docs only · 2026-06-27) |
| **B** | Kernel | `packages/kernel/src/identity/` module | **Complete** (2026-06-27) |
| **C** | Database | `packages/database/src/ids/` + phased migrations | **Complete** (2026-06-27) |
| **D** | ERP/API | Parse-at-boundary ingress | **Complete** (2026-06-27) |
| **E** | Governance | `scripts/governance/identity/` + drift gates | **Complete** (2026-06-27) |

**Slice B may start only after ADR-0021, ADR-0022, and ADR-0023 are Accepted.**

---

## Relationship to existing PKG-010 FDRs

| FDR | Relationship |
| --- | --- |
| `fdr-010-context-contracts` | Orthogonal — operating context; shares PKG-010 package |
| `fdr-010-platform-authority` | Superseded at runtime by `identity/families/` + registry (Slice B migration) |
| `fdr-010-master-data-authority` | Wire contracts remain; business reference IDs align with `ID_FAMILIES` |

No new `knownGaps` registry row. Close runtime gaps via Slice B–E evidence in [`afenda-runtime-truth-matrix.md`](../../architecture/afenda-runtime-truth-matrix.md).

---

## Slice E acceptance (governance hardening)

```bash
pnpm check:kernel-identity-governance
pnpm check:database-enterprise-id-contract
pnpm check:foreign-key-indexes
pnpm check:rls-coverage
pnpm check:identity-boundary
pnpm quality:boundaries
pnpm check:documentation-drift
```

---

## Slice E evidence log (2026-06-27)

| Gate | Result |
| --- | --- |
| `check:kernel-identity-surface` | pass — 22 enterprise families + parser/validator/generator parity |
| `check:id-prefix-uniqueness` | pass — no duplicate kernel prefixes |
| `check:id-parser-generator-parity` | pass |
| `check:forbidden-platform-ids` | pass — fiscal IDs off platform floor |
| `check:identity-boundary` | pass — ERP ingress uses kernel parse, no local casts |
| `check:no-local-id-type-definitions` | pass |
| `check:database-enterprise-id-contract` | pass — 17 live platform tables + ids module |
| `check:tenant-human-reference-uniqueness` | pass — products/sku, warehouses/warehouse_code |
| `check:fk-uuid-only` | pass — uuid FKs only on platform entities |
| `check:rls-uuid-tenant-only` | pass |
| `check:foreign-key-indexes` | pass |
| `check:rls-coverage` | pass |
| `quality:boundaries` | pass |

**Live platform tables (17):** tenants, entity_groups, companies, organizations, teams, projects, users, roles, memberships, permissions, policies, audit_events, execution_runs, legal_entity_ownership, products, warehouses.

**Deferred (domain FDR):** customers, suppliers, employees, documents, assets — registry + promotion checklist only.

**Migrations:** `20260627120000_canonical_enterprise_id_pilot`, `20260627120100_enterprise_id_platform_rollout`, `20260627005456_luxuriant_luke_cage` (execution_runs + warehouse human ref scope).

---

## Slice B acceptance (preview)

When implementing Kernel identity constitution:

```bash
pnpm --filter @afenda/kernel typecheck
pnpm --filter @afenda/kernel test:run
pnpm check:kernel-identity-surface
pnpm quality:boundaries
```

---

## References

- [`fdr-status-index.md`](../fdr-status-index.md) — PKG-010 fleet
- [`.cursor/skills/kernel-authority/SKILL.md`](../../../.cursor/skills/kernel-authority/SKILL.md)
- [`foundation-disposition.registry.ts`](../../../packages/architecture-authority/src/data/foundation-disposition.registry.ts)
