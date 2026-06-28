import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";

function brandTrimRequired<T extends string>(
  value: string | Brand<string, T>,
  label: string
): Brand<string, T> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, T>;
}

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
