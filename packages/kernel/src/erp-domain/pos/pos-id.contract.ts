import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type PosSessionId = Brand<string, "PosSessionId">;

export function brandPosSessionId(value: string | PosSessionId): PosSessionId {
  return brandTrimRequired(value, "posSessionId") as PosSessionId;
}

export function toPosSessionId(value: PosSessionId): string {
  return unbrand(value);
}

export type PosTransactionId = Brand<string, "PosTransactionId">;

export function brandPosTransactionId(
  value: string | PosTransactionId
): PosTransactionId {
  return brandTrimRequired(value, "posTransactionId") as PosTransactionId;
}

export function toPosTransactionId(value: PosTransactionId): string {
  return unbrand(value);
}

export type CashDrawerShiftId = Brand<string, "CashDrawerShiftId">;

export function brandCashDrawerShiftId(
  value: string | CashDrawerShiftId
): CashDrawerShiftId {
  return brandTrimRequired(value, "cashDrawerShiftId") as CashDrawerShiftId;
}

export function toCashDrawerShiftId(value: CashDrawerShiftId): string {
  return unbrand(value);
}
