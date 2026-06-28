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

export type IntercompanyAgreementId = Brand<string, "IntercompanyAgreementId">;

export function brandIntercompanyAgreementId(
  value: string | IntercompanyAgreementId
): IntercompanyAgreementId {
  return brandTrimRequired(
    value,
    "intercompanyAgreementId"
  ) as IntercompanyAgreementId;
}

export function toIntercompanyAgreementId(
  value: IntercompanyAgreementId
): string {
  return unbrand(value);
}

export type IcMatchingRunId = Brand<string, "IcMatchingRunId">;

export function brandIcMatchingRunId(
  value: string | IcMatchingRunId
): IcMatchingRunId {
  return brandTrimRequired(value, "icMatchingRunId") as IcMatchingRunId;
}

export function toIcMatchingRunId(value: IcMatchingRunId): string {
  return unbrand(value);
}

export type IcSettlementId = Brand<string, "IcSettlementId">;

export function brandIcSettlementId(
  value: string | IcSettlementId
): IcSettlementId {
  return brandTrimRequired(value, "icSettlementId") as IcSettlementId;
}

export function toIcSettlementId(value: IcSettlementId): string {
  return unbrand(value);
}
