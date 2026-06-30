import type {
  AccountingStandardValidationResult,
  ScopeGateStatus,
} from "../rules/posting-validation-result.contract.js";
import type { AuthoritySourceType } from "../standards/accounting-standard.contract.js";
import type { AccountingStandardVersionRef } from "../standards/standard-version.contract.js";

const PRECEDENCE_RANK_BY_SOURCE_TYPE: Readonly<
  Record<AuthoritySourceType, number>
> = {
  regulatory_rule: 1,
  external_standard: 2,
  national_standard: 2,
  company_policy: 4,
  project_policy: 5,
};

export interface AuthorityPrecedenceConflict {
  readonly higherPrecedenceSource: AuthoritySourceType;
  readonly lowerPrecedenceSource: AuthoritySourceType;
  readonly message: string;
  readonly standardCode: string;
}

function resolvePrecedenceRank(
  authorityRef: AccountingStandardVersionRef
): number {
  const sourceType = authorityRef.authoritySourceType ?? "external_standard";
  return PRECEDENCE_RANK_BY_SOURCE_TYPE[sourceType];
}

export function detectAuthorityPrecedenceConflicts(
  authorityRefs: readonly AccountingStandardVersionRef[]
): readonly AuthorityPrecedenceConflict[] {
  if (authorityRefs.length < 2) {
    return [];
  }

  const conflicts: AuthorityPrecedenceConflict[] = [];

  for (let index = 0; index < authorityRefs.length; index += 1) {
    for (
      let otherIndex = index + 1;
      otherIndex < authorityRefs.length;
      otherIndex += 1
    ) {
      const left = authorityRefs[index];
      const right = authorityRefs[otherIndex];
      if (left === undefined || right === undefined) {
        continue;
      }
      if (left.standardCode !== right.standardCode) {
        continue;
      }

      const leftRank = resolvePrecedenceRank(left);
      const rightRank = resolvePrecedenceRank(right);
      if (leftRank === rightRank) {
        continue;
      }

      const higher = leftRank < rightRank ? left : right;
      const lower = leftRank < rightRank ? right : left;
      const lowerRank = Math.max(leftRank, rightRank);

      if (lowerRank >= 4) {
        conflicts.push({
          standardCode: left.standardCode,
          higherPrecedenceSource:
            higher.authoritySourceType ?? "external_standard",
          lowerPrecedenceSource: lower.authoritySourceType ?? "company_policy",
          message: `Authority precedence conflict: ${lower.authoritySourceType ?? "company_policy"} cannot override ${higher.authoritySourceType ?? "external_standard"} for ${left.standardCode}.`,
        });
      }
    }
  }

  return conflicts;
}

export function buildPrecedenceConflictValidationResult(
  conflict: AuthorityPrecedenceConflict,
  scopeGateStatus: ScopeGateStatus
): AccountingStandardValidationResult {
  return {
    status: "warning",
    ruleId: "PRECEDENCE-CONFLICT-001",
    standardCode: conflict.standardCode,
    message: conflict.message,
    recommendedAction:
      "Escalate to accounting policy owner — lower-precedence authority cannot override mandatory standard.",
    authorityRefs: [],
    evidenceSnapshot: null,
    scopeGateStatus,
    judgmentEscalationRequired: true,
    escalationReasonKey: "authority-precedence-conflict",
  };
}
