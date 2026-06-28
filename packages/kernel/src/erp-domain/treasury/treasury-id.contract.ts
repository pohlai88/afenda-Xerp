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
