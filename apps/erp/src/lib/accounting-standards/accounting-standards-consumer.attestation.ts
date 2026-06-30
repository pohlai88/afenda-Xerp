export const ACCOUNTING_STANDARDS_CONSUMER_ATTESTATION = {
  sliceId: "PAS-003-B20",
  status: "delivered",
  consumerModule: "apps/erp/src/lib/accounting-standards",
  workflowDelegate: "runAccountingStandardsValidationForReadiness",
  evidencePersistence: "persistAccountingStandardsEvidenceFromReport",
} as const;
