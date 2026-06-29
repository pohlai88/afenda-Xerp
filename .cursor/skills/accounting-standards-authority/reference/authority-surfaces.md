# Authority Surfaces Reference

`@afenda/accounting-standards` contract shapes — skill adapter for PAS-003 §4.

← Back to [SKILL.md](../SKILL.md) | Canonical: [PAS-003 §4](../../../../docs/PAS/ACCOUNTING-STANDARDS/PAS-003-ACCOUNTING-STANDARDS-AUTHORITY-STANDARD.md#4-authority-surfaces)

**Status legend:** `Current` = on disk · `Target` = PAS slice not yet delivered

---

## 4.1 Accounting Standard Family Registry — **Target** (B1)

```ts
export const ACCOUNTING_STANDARD_FAMILIES = [
  "IFRS",
  "MFRS",
  "SFRS",
  "US_GAAP",
  "LOCAL_POLICY",
] as const;
```

---

## 4.2 Accounting Standard Registry — **Target** (B2)

```ts
export interface AccountingStandardRegistryEntry {
  readonly standardKey: string;
  readonly family: AccountingStandardFamily;
  readonly standardCode: string;
  readonly standardTitle: string;
  readonly scopeSummary: string;
  readonly lifecycleStatus:
    | "current"
    | "future_effective"
    | "superseded"
    | "amended"
    | "pending_review";
  readonly defaultAuthorityVersionKey: string;
}
```

---

## 4.3 Standard Version Registry — **Target** (B3)

```ts
export interface AccountingStandardVersionRef {
  readonly standardFamily: AccountingStandardFamily;
  readonly standardCode: string;
  readonly standardTitle: string;
  readonly edition: string;
  readonly issuedAsOf: string;
  readonly effectiveForAnnualPeriodsBeginningOnOrAfter: string;
  readonly retrievedAt: string;
  readonly authorityStatus:
    | "current"
    | "future_effective"
    | "superseded"
    | "amended"
    | "pending_review";
  readonly sourceName: string;
  readonly sourceUrl: string;
}
```

Initial IFRS anchor: `IFRS_AUTHORITY_VERSION_2026` — Required IFRS Accounting Standards 2026, effective 2026-01-01.

---

## 4.5 Posting Validation Input — **Target** (B5)

Use `JsonValue` from `@afenda/kernel` for `transactionFacts` — not `unknown`.

```ts
export interface AccountingStandardPostingValidationInput {
  readonly tenantId: string;
  readonly companyId: string;
  readonly eventType: string;
  readonly accountingStandardFamily: AccountingStandardFamily;
  readonly transactionFacts: Readonly<Record<string, JsonValue>>;
  readonly postingDraft:
    | {
        readonly debitAccountKeys: readonly string[];
        readonly creditAccountKeys: readonly string[];
        readonly amountCurrency: string;
      }
    | null;
}
```

---

## 4.7 Validation Result — **Target** (B7)

```ts
export interface AccountingStandardValidationResult {
  readonly status: "pass" | "info" | "warning" | "blocked";
  readonly ruleId: string | null;
  readonly standardCode: string | null;
  readonly message: string;
  readonly recommendedAction: string | null;
  readonly authorityRefs: readonly AccountingStandardVersionRef[];
  readonly evidenceSnapshot: AccountingStandardEvidenceSnapshot | null;
}
```

Consumers decide workflow action; only explicit `blocking` rules may hard-stop.

---

## ERP-parity extensions (B13–B16) — **Target**

| Slice | Surface | Adds |
| --- | --- | --- |
| B13 | §4.4 routing | Reporting context profile keys on process routing |
| B14 | §4.7 result | Scope-gate and judgment-escalation outcome fields (P12) |
| B15 | §4.3 version | Authority instrument and supersession metadata |
| B16 | §4.4 routing | Cross-representation routing keys (parallel books) |

Canonical contract detail: PAS-003 §4 · Domain NS §3.4–§3.7 · slice handoffs in `docs/PAS/ACCOUNTING-STANDARDS/SLICE/`.

---

## Package fingerprint — **Current** (B0)

```ts
export const ACCOUNTING_STANDARDS_AUTHORITY_FINGERPRINT =
  "ACCOUNTING-STANDARDS-2026-06-27-v1" as const;
```
