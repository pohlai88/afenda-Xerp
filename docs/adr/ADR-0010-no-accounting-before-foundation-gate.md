# ADR-0010 — No Accounting Coding Before Pre-accounting Foundation Gate

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-23 |
| **Owner** | Architecture Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

ADR-0001 defines Phase 1 foundation before business domains. The master plan v4 listed `TIP-013` (Accounting Core) as the first business domain after a Phase 1 exit gate, but the exit gate criteria were **insufficiently specified** for multi-company enterprise structures, System Admin, outbox/event spine, and feature manifest governance.

Starting accounting implementation before these foundations creates **irreversible schema and permission drift** — especially for holding/subsidiary/minor-interest models that must be structural, not retrofitted.

Related: ADR-0011 (multi-level company model), [`_afenda-erp-master-plan.llms.md`](../architecture/_afenda-erp-master-plan.llms.md) Foundation Phase 9.

---

## Decision

1. **Accounting Core coding is prohibited** until Foundation Phases 0–8 complete and **Phase 9 Accounting Readiness Gate** passes with documented evidence.
2. **Prohibited before gate:**
   - Creating `@afenda/accounting` or PKG-R01 filesystem package
   - Chart of accounts, journal, ledger, fiscal period, posting, consolidation arithmetic schemas or services
   - Financial report implementations
   - Vietnam localization accounting rules in domain code
3. **Permitted before gate (foundation only):**
   - Enterprise hierarchy schemas (entity group, ownership interest) — authority foundation
   - Consolidation **scope context** contracts — no arithmetic
   - Glossary and ADR documentation for accounting **requirements**
   - Module placeholder routes labeled "Accounting" with **no domain logic**
4. The Accounting Readiness Gate checklist in the master plan Foundation Phase 9 section is **binding**.

---

## Consequences

### Positive

- Multi-company RBAC, RLS, and audit patterns established before money-moving code.
- Prevents partial accounting prototypes that bypass operating spine.
- Clear stop rule for AI agents under delivery pressure.

### Negative / trade-offs

- Delays first demo of real accounting features.
- Requires explicit gate sign-off process.

---

## Foundation Phase 9 — Accounting Readiness Gate

**Gate surface rule:** `accounting-readiness-gate-is-canonical-phase-9-matrix`

**Signed off:** 2026-06-24 (automated evidence + agent execution contract)

Accounting Core may begin **only** when all previous foundation phases pass.

| # | Requirement | Verification |
| --- | --- | --- |
| 1 | Multi-company model documented | Glossary + schema + tests |
| 2 | Holding / subsidiary / minor-interest model documented | Glossary + ownership schema |
| 3 | Tenant / company / org / workspace context proven | Operating context integration tests |
| 4 | RBAC and audit proven | Permission denial + audit event tests |
| 5 | API contract governance proven | `pnpm check:api-contracts` + route registry |
| 6 | DB migration governance proven | `pnpm quality:migrations` |
| 7 | Feature manifest governance proven | Manifest-driven navigation test |
| 8 | System Admin base operational | Admin UI smoke tests |
| 9 | CI quality gates passing | `pnpm check` green |
| 10 | Documentation synchronized | Runtime matrix matches codebase |

Orchestrator: `scripts/governance/check-accounting-readiness-gate.mts` · `pnpm check:accounting-readiness-gate`

---

## Acceptance Gate

Phase 9 gate — all items must pass:

- Multi-company model documented
- Holding / subsidiary / minor-interest model documented
- Tenant / company / org / workspace context proven
- RBAC and audit proven
- API contract governance proven
- DB migration governance proven
- Feature manifest governance proven
- System Admin base operational
- CI quality gates passing
- Documentation synchronized

Only then: ADR to activate PKG-R01 and begin Accounting Core contracts.

---

## References

- ADR-0001 Phase 1 Foundation Redefinition
- [`pas-status-index.md`](../PAS/pas-status-index.md) — runtime closure registry
- [`_afenda-erp-master-plan.llms.md`](../architecture/_afenda-erp-master-plan.llms.md) — LLM roadmap and Phase 9 record
