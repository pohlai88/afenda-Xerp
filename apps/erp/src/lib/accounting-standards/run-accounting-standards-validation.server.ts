import {
  type AccountingStandardEvidenceSnapshot,
  type AccountingStandardValidationReport,
  normalizeCountryCodeToJurisdiction,
  type ValidationResultStatus,
  validatePostingAgainstAccountingStandards,
} from "@afenda/accounting-standards";
import type { CompanyId, TenantId } from "@afenda/kernel";

import type { AccountingReadinessContext } from "@/lib/context/accounting-readiness-context.types";

export interface AccountingStandardsWorkflowEvidenceRecord {
  readonly aggregateStatus: ValidationResultStatus;
  readonly capturedAt: string;
  readonly evidenceSnapshots: readonly AccountingStandardEvidenceSnapshot[];
  readonly fingerprint: string;
}

export interface AccountingStandardsWorkflowResult {
  readonly evidenceRecord: AccountingStandardsWorkflowEvidenceRecord;
  readonly report: AccountingStandardValidationReport;
}

export function persistAccountingStandardsEvidenceFromReport(
  report: AccountingStandardValidationReport
): AccountingStandardsWorkflowEvidenceRecord {
  const evidenceSnapshots = report.results
    .map((result) => result.evidenceSnapshot)
    .filter(
      (snapshot): snapshot is AccountingStandardEvidenceSnapshot =>
        snapshot !== null
    );

  return {
    capturedAt: new Date().toISOString(),
    evidenceSnapshots,
    aggregateStatus: report.aggregateStatus,
    fingerprint: report.fingerprint,
  };
}

export function runAccountingStandardsValidationForReadiness(params: {
  readonly readiness: AccountingReadinessContext;
  readonly tenantId: TenantId;
  readonly companyId: CompanyId;
  readonly transactionDate?: string;
}): AccountingStandardsWorkflowResult {
  const jurisdictionCode = normalizeCountryCodeToJurisdiction(
    params.readiness.legalEntity.countryCode
  );
  const transactionDate =
    params.transactionDate ?? new Date().toISOString().slice(0, 10);

  const report = validatePostingAgainstAccountingStandards({
    tenantId: params.tenantId,
    companyId: params.companyId,
    eventType: "financial_statement_presentation",
    accountingStandardFamily: "IFRS",
    reportingPurpose: "statutory",
    ...(jurisdictionCode === null ? {} : { jurisdictionCode }),
    transactionDate,
    transactionFacts: {
      countryCode: params.readiness.legalEntity.countryCode,
    },
    postingDraft: null,
  });

  return {
    report,
    evidenceRecord: persistAccountingStandardsEvidenceFromReport(report),
  };
}
