import { ACCOUNTING_STANDARD_REGISTRY } from "../standards/accounting-standard.registry.js";
import { ACCOUNTING_STANDARD_VERSION_REGISTRY } from "../standards/standard-version.registry.js";

export function validateAccountingStandardVersionRegistry(): readonly string[] {
  const errors: string[] = [];

  for (const entry of ACCOUNTING_STANDARD_REGISTRY) {
    if (
      !(
        entry.defaultAuthorityVersionKey in ACCOUNTING_STANDARD_VERSION_REGISTRY
      )
    ) {
      errors.push(
        `${entry.standardKey}: missing defaultAuthorityVersionKey ${entry.defaultAuthorityVersionKey}`
      );
    }
  }

  for (const [versionKey, versionRef] of Object.entries(
    ACCOUNTING_STANDARD_VERSION_REGISTRY
  )) {
    if (versionRef.sourceUrl.length === 0) {
      errors.push(`${versionKey}: missing sourceUrl`);
    }
    if (versionRef.retrievedAt.length === 0) {
      errors.push(`${versionKey}: missing retrievedAt`);
    }
    if (versionRef.effectiveForAnnualPeriodsBeginningOnOrAfter.length === 0) {
      errors.push(`${versionKey}: missing effective date`);
    }
    if (
      versionRef.supersededByVersionKey !== null &&
      versionRef.supersededByVersionKey !== undefined &&
      !(
        versionRef.supersededByVersionKey in
        ACCOUNTING_STANDARD_VERSION_REGISTRY
      )
    ) {
      errors.push(
        `${versionKey}: supersededByVersionKey ${versionRef.supersededByVersionKey} not in registry`
      );
    }
  }

  return errors;
}
