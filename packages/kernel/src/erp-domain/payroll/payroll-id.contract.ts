import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type PayrollRunId = Brand<string, "PayrollRunId">;

export function brandPayrollRunId(value: string | PayrollRunId): PayrollRunId {
  return brandTrimRequired(value, "payrollRunId") as PayrollRunId;
}

export function toPayrollRunId(value: PayrollRunId): string {
  return unbrand(value);
}

export type PayslipId = Brand<string, "PayslipId">;

export function brandPayslipId(value: string | PayslipId): PayslipId {
  return brandTrimRequired(value, "payslipId") as PayslipId;
}

export function toPayslipId(value: PayslipId): string {
  return unbrand(value);
}

export type TaxWithholdingAdjustmentId = Brand<
  string,
  "TaxWithholdingAdjustmentId"
>;

export function brandTaxWithholdingAdjustmentId(
  value: string | TaxWithholdingAdjustmentId
): TaxWithholdingAdjustmentId {
  return brandTrimRequired(
    value,
    "taxWithholdingAdjustmentId"
  ) as TaxWithholdingAdjustmentId;
}

export function toTaxWithholdingAdjustmentId(
  value: TaxWithholdingAdjustmentId
): string {
  return unbrand(value);
}
