# ADR-0015 — Accounting Domain Contracts-Only Activation (PKG-R01)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-24 |
| **Owner** | Architecture Authority + Accounting Authority |
| **Supersedes** | — |
| **Superseded by** | — |

---

## Context

ADR-0010 prohibited Accounting Core coding until Foundation Phases 0–8 complete and Phase 9 Accounting Readiness Gate passes. Phase 9 signed off on **2026-06-24** ([`phase-9-accounting-readiness-sign-off.md`](../architecture/phase-9-accounting-readiness-sign-off.md)).

PKG-R01 (`@afenda/accounting`) remains **planned** in [`package-registry.md`](../architecture/package-registry.md) with `filesystemRequired: false`. Permission vocabulary for accounting exists only as two journal keys in `@afenda/permissions`. Kernel exposes **readiness** contracts (`accounting-readiness.contract.ts`) — not domain accounting contracts.

Starting ledger schemas, posting services, or ERP accounting UI before contract vocabulary is frozen repeats the drift ADR-0010 was written to prevent.

Related: ADR-0010, ADR-0011, ADR-0014, TIP-014, [`pre-accounting-foundation-roadmap.md`](../architecture/pre-accounting-foundation-roadmap.md).

---

## Decision

1. **Activate PKG-R01 filesystem package** `@afenda/accounting` at `packages/accounting/` with lifecycle **`contracts-only`** until a future ADR accepts runtime implementation (TIP-015+).
2. **Permitted in contracts-only phase (TIP-014):**
   - Serializable TypeScript contracts: branded IDs, closed vocabularies (`as const`), wire contexts, audit action constants
   - Authority barrel public API (`@afenda/accounting`, `@afenda/accounting/contracts`)
   - Permission key expansion in `@afenda/permissions` aligned to accounting contract vocabulary
   - Registry promotion: PKG-R01 `planned` → `active` (contracts-only) in architecture-authority + human registries
   - Contract tests proving JSON serializability and boundary rules
   - Governance prohibition tests (no Drizzle schemas, no posting arithmetic, no ERP routes)
3. **Prohibited until separate ADR (TIP-015+):**
   - Drizzle schemas / migrations for COA, journals, ledger balances, fiscal periods
   - Posting, elimination, consolidation, or report calculation services
   - ERP accounting module routes, Server Actions, or UI beyond existing manifest placeholders
   - `@afenda/database` runtime dependency in `@afenda/accounting`
   - Import of `@afenda/accounting` from `@afenda/kernel` (kernel retains readiness-only contracts)
4. **Allowed runtime dependencies for `@afenda/accounting` (contracts-only):**
   - `@afenda/kernel` — consume `AccountingReadinessContext` / platform IDs only
   - `@afenda/typescript-config` — dev tooling
5. **Bridge rule:** `toAccountingDomainContext(readiness: AccountingReadinessContext)` lives in `@afenda/accounting` and maps kernel readiness → domain wire context. Kernel does not import `@afenda/accounting`.

---

## Consequences

### Positive

- Domain vocabulary frozen before money-moving schema work (SAP/Oracle FDD equivalent).
- Permission and audit vocabulary registered before TIP-015 COA tables.
- Clear contracts-only stop rule for AI agents.

### Negative / trade-offs

- Two-step activation (contracts ADR, then runtime ADR) adds process overhead.
- `@afenda/permissions` must be touched for key expansion (cross-package coordination).

---

## Acceptance Gate

TIP-014 Slice 5 complete when all pass:

- `pnpm --filter @afenda/accounting typecheck`
- `pnpm --filter @afenda/accounting test:run`
- `pnpm --filter @afenda/permissions test:run`
- `pnpm quality:architecture` (PKG-R01 registered, no forbidden edges)
- `pnpm check:accounting-domain-contracts` (TIP-014 governance script)
- `pnpm check:documentation-drift`

---

## References

- ADR-0010 — No Accounting Before Foundation Gate
- ADR-0011 — Multi-level Company Model
- ADR-0014 — Foundation Disposition Registry
- TIP-014 — Accounting Core Contracts
- [`phase-9-accounting-readiness-sign-off.md`](../architecture/phase-9-accounting-readiness-sign-off.md)
