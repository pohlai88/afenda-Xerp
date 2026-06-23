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

Related: ADR-0011 (multi-level company model), [`pre-accounting-foundation-roadmap.md`](../architecture/pre-accounting-foundation-roadmap.md).

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
4. The Accounting Readiness Gate checklist in `pre-accounting-foundation-roadmap.md` Phase 9 is **binding**.

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

## Acceptance Gate

Phase 9 gate — all items must pass:

- Multi-company / holding / subsidiary / minor-interest model documented and schema-proven
- Operating context + RBAC + audit proven on protected mutations
- Outbox + operating spine lifecycle proven
- System Admin control plane operational (minimum viable)
- Feature manifest drives navigation
- `pnpm check` green
- Runtime matrix synchronized

Only then: ADR to activate PKG-R01 and begin TIP-013.

---

## References

- ADR-0001 Phase 1 Foundation Redefinition
- [`afenda-runtime-truth-matrix.md`](../architecture/afenda-runtime-truth-matrix.md) — Accounting Core row
