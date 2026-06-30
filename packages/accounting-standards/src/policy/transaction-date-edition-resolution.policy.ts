import type { AccountingStandardVersionRef } from "../standards/standard-version.contract.js";
import {
  ACCOUNTING_STANDARD_VERSION_REGISTRY,
  getAccountingStandardVersionRef,
} from "../standards/standard-version.registry.js";

export interface ResolvedAuthorityEdition {
  readonly edition: string;
  readonly standardCode: string;
  readonly transactionDate: string;
  readonly versionKey: string;
}

function isVersionEffectiveOnDate(
  versionRef: AccountingStandardVersionRef,
  transactionDate: string
): boolean {
  if (
    transactionDate < versionRef.effectiveForAnnualPeriodsBeginningOnOrAfter
  ) {
    return false;
  }
  if (
    versionRef.effectiveUntil !== null &&
    versionRef.effectiveUntil !== undefined &&
    transactionDate > versionRef.effectiveUntil
  ) {
    return false;
  }
  return true;
}

export function resolveAuthorityEditionForTransactionDate(
  standardCode: string,
  transactionDate: string,
  preferredVersionKey?: string
): ResolvedAuthorityEdition | null {
  const candidates: {
    versionKey: string;
    versionRef: AccountingStandardVersionRef;
  }[] = [];

  for (const [versionKey, versionRef] of Object.entries(
    ACCOUNTING_STANDARD_VERSION_REGISTRY
  )) {
    if (versionRef.standardCode !== standardCode) {
      continue;
    }
    if (!isVersionEffectiveOnDate(versionRef, transactionDate)) {
      continue;
    }
    candidates.push({ versionKey, versionRef });
  }

  if (candidates.length === 0) {
    if (preferredVersionKey === undefined) {
      return null;
    }
    const preferred = getAccountingStandardVersionRef(preferredVersionKey);
    if (preferred === undefined) {
      return null;
    }
    return {
      standardCode,
      transactionDate,
      versionKey: preferredVersionKey,
      edition: preferred.edition,
    };
  }

  candidates.sort((left, right) =>
    right.versionRef.effectiveForAnnualPeriodsBeginningOnOrAfter.localeCompare(
      left.versionRef.effectiveForAnnualPeriodsBeginningOnOrAfter
    )
  );

  const winner = candidates[0];
  if (winner === undefined) {
    return null;
  }
  return {
    standardCode,
    transactionDate,
    versionKey: winner.versionKey,
    edition: winner.versionRef.edition,
  };
}

export function resolveAuthorityEditionsForStandardCodes(
  standardCodes: readonly string[],
  transactionDate: string
): readonly ResolvedAuthorityEdition[] {
  const results: ResolvedAuthorityEdition[] = [];
  const seen = new Set<string>();

  for (const standardCode of standardCodes) {
    if (seen.has(standardCode)) {
      continue;
    }
    seen.add(standardCode);
    const resolved = resolveAuthorityEditionForTransactionDate(
      standardCode,
      transactionDate
    );
    if (resolved !== null) {
      results.push(resolved);
    }
  }

  return results;
}
