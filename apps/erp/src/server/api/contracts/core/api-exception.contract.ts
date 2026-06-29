/**
 * PAS-API-001 API-015 — bounded governance exceptions.
 * Defer validation or lifecycle obligations only — never registry-first bypass.
 */

/** Obligations that may be temporarily deferred (North Star §14.5). */
export const API_GOVERNANCE_EXCEPTION_DEFERRAL_KINDS = [
  "lifecycle-obligation",
  "validation-obligation",
] as const;

export type ApiGovernanceExceptionDeferralKind =
  (typeof API_GOVERNANCE_EXCEPTION_DEFERRAL_KINDS)[number];

/**
 * Time-bounded waiver record — governance identifiers only, not HR data.
 * Registry-first exposure is non-waivable.
 */
export interface ApiGovernanceExceptionRecord {
  readonly deferralKind: ApiGovernanceExceptionDeferralKind;
  readonly expiresAt: string;
  readonly followUpEvidence: string;
  readonly id: string;
  readonly operationId?: string;
  readonly owner: string;
  readonly riskReason: string;
  readonly scopeNote?: string;
}

function isDeferralKind(
  value: string
): value is ApiGovernanceExceptionDeferralKind {
  return (API_GOVERNANCE_EXCEPTION_DEFERRAL_KINDS as readonly string[]).includes(
    value
  );
}

function parseExpiryInstant(expiresAt: string): number {
  const parsed = Date.parse(expiresAt);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid governance exception expiry: ${expiresAt}`);
  }
  return parsed;
}

export function assertGovernanceExceptionRecordShape(
  record: ApiGovernanceExceptionRecord
): void {
  if (record.id.trim().length === 0) {
    throw new Error("Governance exception id is required.");
  }

  if (record.owner.trim().length === 0) {
    throw new Error(
      `Governance exception ${record.id} requires a named owner.`
    );
  }

  parseExpiryInstant(record.expiresAt);

  if (record.riskReason.trim().length === 0) {
    throw new Error(
      `Governance exception ${record.id} requires a risk reason.`
    );
  }

  if (record.followUpEvidence.trim().length === 0) {
    throw new Error(
      `Governance exception ${record.id} requires follow-up evidence obligation.`
    );
  }

  if (!isDeferralKind(record.deferralKind)) {
    throw new Error(
      `Governance exception ${record.id} has unsupported deferral kind: ${record.deferralKind}.`
    );
  }
}

export function defineGovernanceException(
  record: ApiGovernanceExceptionRecord
): ApiGovernanceExceptionRecord {
  assertGovernanceExceptionRecordShape(record);
  return record;
}

export function isGovernanceExceptionExpired(
  record: ApiGovernanceExceptionRecord,
  referenceTime: Date = new Date()
): boolean {
  assertGovernanceExceptionRecordShape(record);
  return parseExpiryInstant(record.expiresAt) < referenceTime.getTime();
}

export function assertNoExpiredGovernanceExceptions(
  records: readonly ApiGovernanceExceptionRecord[],
  referenceTime: Date = new Date()
): void {
  const violations = collectGovernanceExceptionViolations(records, referenceTime);

  if (violations.length > 0) {
    throw new Error(violations.join("\n"));
  }
}

export function collectGovernanceExceptionViolations(
  records: readonly ApiGovernanceExceptionRecord[],
  referenceTime: Date = new Date()
): readonly string[] {
  const violations: string[] = [];

  for (const record of records) {
    try {
      assertGovernanceExceptionRecordShape(record);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      violations.push(`governance exception shape: ${message}`);
      continue;
    }

    if (isGovernanceExceptionExpired(record, referenceTime)) {
      violations.push(
        `governance exception ${record.id}: expired at ${record.expiresAt} — requires registry alignment or ADR-amended extension (owner: ${record.owner})`
      );
    }
  }

  return violations;
}

/**
 * Active governance exceptions — empty at MVP; add via {@link defineGovernanceException}.
 * Expired entries fail `pnpm check:api-contracts`.
 */
export const API_GOVERNANCE_EXCEPTION_REGISTRY =
  [] as const satisfies readonly ApiGovernanceExceptionRecord[];
