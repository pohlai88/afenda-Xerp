# ADR-0011 — Multi-level Company / Holding / Subsidiary / Minor Interest Model Is Foundational

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-06-23 |
| **Owner** | Platform Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

Afenda targets manufacturing enterprises (100–1,000+ employees) in Vietnam and regional markets. These customers operate **holding structures, subsidiaries, associates, joint ventures, and minority interests** — not single-company tenants.

Deferring multi-level company modeling to "Phase 4 scale" (master plan TIP-036) or to accounting implementation causes:

- Permission scope models that assume flat company lists
- RLS policies that cannot express group CFO visibility
- Accounting schemas that require destructive migration to add consolidation dimensions

Runtime evidence (2026-06-23) shows **partial delivery** via TIP-007/012 slice: `entity_groups`, `legal_entity_ownership`, kernel context contracts, and glossary terms — but consolidation logic correctly deferred.

---

## Decision

1. **Multi-level company hierarchy is a pre-accounting foundation requirement**, not an accounting-domain afterthought.
2. **Required authority model (minimum):**
   - Tenant (SaaS isolation)
   - Entity Group (holding umbrella)
   - Legal Entity / Company (statutory books boundary)
   - Ownership Interest (parent/child, percentages, relationship types, consolidation method metadata)
   - Organization Unit (operating tree inside legal entity)
   - Workspace (runtime derived context)
   - Consolidation Scope (reporting boundary — **scope only, no arithmetic before accounting gate**)
3. Canonical vocabulary: [`docs/architecture/glossary.md`](../architecture/glossary.md)
4. Kernel contracts: `packages/kernel/src/context/` operating-context registry
5. Persistence: `packages/database/src/schema/entity-group.schema.ts`, `legal-entity-ownership.schema.ts`, `company.schema.ts`
6. **Consolidation accounting logic** (eliminations, NCI, equity method postings) remains **blocked until ADR-0010 gate passes**.

---

## Consequences

### Positive

- RBAC and RLS designed for group structures from day one.
- Accounting Core inherits correct entity dimensions without migration.
- AI agents resolve tenant/company/org/workspace with governed vocabulary.

### Negative / trade-offs

- Higher upfront platform complexity.
- Consolidation scope resolver must be completed (non-accounting) before gate.

---

## Acceptance Gate

- [ ] Glossary terms for all hierarchy levels accepted
- [ ] Kernel operating-context registry includes entity group + ownership + consolidation scope
- [ ] Database schemas for entity group + ownership interest with contract tests
- [ ] ERP operating context resolver handles multi-company selection
- [ ] Permission scope grants tested for subsidiary vs group role scenarios
- [ ] `pnpm check:multi-tenancy-enterprise-acceptance` passes

---

## References

- [`docs/architecture/multi-tenancy.md`](../architecture/multi-tenancy.md)
- [`tip-007-012-enterprise-group-operating-context.md`](../delivery/tip-007-012-enterprise-group-operating-context.md)
- ADR-0010 Accounting Readiness Gate
