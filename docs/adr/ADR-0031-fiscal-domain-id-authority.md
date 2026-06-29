# ADR-0031 — Fiscal Domain ID Authority (Calendar and Period)

| Field | Value |
| --- | --- |
| **Status** | Accepted |
| **Date** | 2026-06-30 |
| **Owner** | Architecture Authority · Accounting / Finance vocabulary |
| **Supersedes** | — |
| **Superseded by** | — |
| **Amends** | [ADR-0021 §Fiscal exception](ADR-0021-canonical-enterprise-identity.md#fiscal-exception-forbidden-platform-floor-ids) · [ADR-0020 §Domain Configuration Data](ADR-0020-master-data-authority-consolidation.md) |

---

## Context

`FiscalCalendarId` and `FiscalPeriodId` were introduced as branded string references on `@afenda/kernel/erp-domain/accounting` while PAS-001 §4.1.6 and [ADR-0021](ADR-0021-canonical-enterprise-identity.md) explicitly forbid them on the **platform floor** (`ID_FAMILIES`, main `@afenda/kernel` barrel).

Kernel boundary drift entry `accounting-id-forbidden-floor-symbols` recorded these symbols as **pending** until a Finance ADR decided their long-term authority. That state blocked closure of scheduled kernel drift item 4 and left ambiguous whether fiscal IDs would:

1. join platform-floor enterprise ID families,
2. relocate to `@afenda/accounting` filesystem package, or
3. remain domain-scoped vocabulary on KV-ACCT.

Evidence as of 2026-06-30:

| Artifact | State |
| --- | --- |
| `packages/kernel/src/erp-domain/accounting/accounting-id.contract.ts` | Exports `FiscalCalendarId`, `FiscalPeriodId` with `brand*` / `to*` helpers |
| `FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS` | Includes both type names |
| `pnpm check:forbidden-platform-ids` | Enforces exclusion from main kernel + platform-floor family barrels |
| Drift registry `accounting-id-forbidden-floor-symbols` | `quarantine_subpath_only` · `refactorStatus: pending` |
| `@afenda/accounting` filesystem package | Contracts-only · no runtime consumers ([ADR-0020](ADR-0020-master-data-authority-consolidation.md)) |

Fiscal calendar and period identifiers are **accounting domain configuration references**, not cross-platform enterprise ID families. They do not require `prefix_ulid` registry rows, platform-floor `parse*` ingress, or database `enterprise_id` CHECK parity at this stage.

Related: ADR-0010 (accounting runtime block), ADR-0015 (contracts-only), ADR-0020 (KV-ACCT consolidation), ADR-0021 (identity constitution), PAS-001 §4.1.6, [identity-promotion-process.md](../PAS/KERNEL/identity/identity-promotion-process.md).

---

## Decision

### 1. Canonical authority (permanent)

| Type | Authority | Import path |
| --- | --- | --- |
| `FiscalCalendarId` | Accounting domain vocabulary (KV-ACCT) | `@afenda/kernel/erp-domain/accounting` |
| `FiscalPeriodId` | Accounting domain vocabulary (KV-ACCT) | `@afenda/kernel/erp-domain/accounting` |

Cross-domain accounting **words** remain on `@afenda/kernel/erp-domain/accounting` per ADR-0020. Fiscal IDs do **not** relocate to `@afenda/accounting` filesystem package unless a future ADR amends ADR-0020 consolidation.

### 2. Permanent platform-floor exclusion

- `FiscalCalendarId` and `FiscalPeriodId` must **never** appear in `ID_FAMILIES`, `ENTERPRISE_ID_FAMILIES`, or the main `@afenda/kernel` public barrel.
- They are **not** enterprise ID families and must not receive three-letter prefix registry rows through the identity promotion process.
- `FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS` remains frozen with both type names.

### 3. Trust boundary (domain-scoped)

At accounting trust boundaries, use `brandFiscalCalendarId` / `brandFiscalPeriodId` and `toFiscalCalendarId` / `toFiscalPeriodId` from KV-ACCT. Platform-floor `parse*` ingress rules from ADR-0021 do **not** apply — fiscal IDs are domain-branded trim-required strings, not canonical ULID families.

### 4. Prohibited without a new ADR

- Adding fiscal type names to platform-floor exports or `ID_FAMILIES`
- Exporting fiscal IDs from `@afenda/kernel` root index
- Treating fiscal IDs as enterprise ID families in database CHECK / `enterprise_id` parity gates
- Relocating fiscal branded types to `@afenda/accounting` without amending ADR-0020

### 5. Drift registry closure

Kernel boundary drift entry `accounting-id-forbidden-floor-symbols` closes as **`refactorStatus: completed`** with disposition **`quarantine_subpath_only`** — permanent intentional quarantine, not a pending relocation.

### 6. Gates (unchanged enforcement)

- `pnpm check:forbidden-platform-ids`
- `pnpm check:kernel-identity-governance` (bundle includes forbidden-platform-ids)
- `pnpm --filter @afenda/kernel test:run`

---

## Consequences

### Positive

- Scheduled kernel drift item 4 closes with explicit Finance/accounting authority — no longer a pending waiver.
- Agents stop waiting for an undecided "Finance ADR" before treating fiscal ID placement as intentional.
- KV-ACCT remains the single import path for cross-module accounting vocabulary including fiscal references.

### Negative / trade-offs

- Fiscal IDs lack platform-floor `parse*` and prefix governance until a future ADR explicitly promotes a different model.
- Accounting runtime (post ADR-0010 gate) must import fiscal types from KV-ACCT subpath, not from `@afenda/kernel` root.

---

## Acceptance Gate

- [x] ADR-0031 status **Accepted**
- [x] Drift registry `accounting-id-forbidden-floor-symbols` → `refactorStatus: completed`
- [x] ADR-0021 fiscal exception cross-references ADR-0031
- [x] `pnpm check:forbidden-platform-ids` exit 0
- [x] `pnpm --filter @afenda/kernel test:run` exit 0 (drift registry + forbidden-floor tests)

---

## References

- [ADR-0020 — Master Data Authority Consolidation](ADR-0020-master-data-authority-consolidation.md)
- [ADR-0021 — Canonical Enterprise ID Constitution](ADR-0021-canonical-enterprise-identity.md)
- [PAS-001 §4.1.6](../PAS/KERNEL/PAS-001-KERNEL-VOCABULARY-AUTHORITY-STANDARD.md)
- [identity-promotion-process.md](../PAS/KERNEL/identity/identity-promotion-process.md)
- Drift registry: `packages/kernel/src/governance/kernel-boundary-drift.registry.ts`
