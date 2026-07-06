import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type CashPositionSnapshotId = Brand<string, "CashPositionSnapshotId">;

export function brandCashPositionSnapshotId(
  value: string | CashPositionSnapshotId
): CashPositionSnapshotId {
  return brandTrimRequired(
    value,
    "cashPositionSnapshotId"
  ) as CashPositionSnapshotId;
}

export function toCashPositionSnapshotId(
  value: CashPositionSnapshotId
): string {
  return unbrand(value);
}

export type PaymentRunId = Brand<string, "PaymentRunId">;

export function brandPaymentRunId(value: string | PaymentRunId): PaymentRunId {
  return brandTrimRequired(value, "paymentRunId") as PaymentRunId;
}

export function toPaymentRunId(value: PaymentRunId): string {
  return unbrand(value);
}

export type BankStatementImportId = Brand<string, "BankStatementImportId">;

export function brandBankStatementImportId(
  value: string | BankStatementImportId
): BankStatementImportId {
  return brandTrimRequired(
    value,
    "bankStatementImportId"
  ) as BankStatementImportId;
}

export function toBankStatementImportId(value: BankStatementImportId): string {
  return unbrand(value);
}
