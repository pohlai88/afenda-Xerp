import type { CompanyId, JsonValue, TenantId } from "@afenda/kernel";
import type {
  AccountingStandardFamily,
  ReportingPurpose,
} from "../standards/accounting-standard.contract.js";

export interface AccountingStandardPostingValidationInput {
  readonly accountingStandardFamily: AccountingStandardFamily;
  readonly companyId: CompanyId;
  readonly crossRepresentationTransition?: string;
  readonly eventType: string;
  readonly jurisdictionCode?: string;
  readonly postingDraft: {
    readonly debitAccountKeys: readonly string[];
    readonly creditAccountKeys: readonly string[];
    readonly amountCurrency: string;
  } | null;
  readonly reportingPurpose?: ReportingPurpose;
  readonly tenantId: TenantId;
  readonly transactionDate?: string;
  readonly transactionFacts: Readonly<Record<string, JsonValue>>;
}
