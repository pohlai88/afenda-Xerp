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

export type ServiceCaseId = Brand<string, "ServiceCaseId">;

export function brandServiceCaseId(
  value: string | ServiceCaseId
): ServiceCaseId {
  return brandTrimRequired(value, "serviceCaseId") as ServiceCaseId;
}

export function toServiceCaseId(value: ServiceCaseId): string {
  return unbrand(value);
}

export type ServiceContractId = Brand<string, "ServiceContractId">;

export function brandServiceContractId(
  value: string | ServiceContractId
): ServiceContractId {
  return brandTrimRequired(value, "serviceContractId") as ServiceContractId;
}

export function toServiceContractId(value: ServiceContractId): string {
  return unbrand(value);
}

export type ServiceVisitId = Brand<string, "ServiceVisitId">;

export function brandServiceVisitId(
  value: string | ServiceVisitId
): ServiceVisitId {
  return brandTrimRequired(value, "serviceVisitId") as ServiceVisitId;
}

export function toServiceVisitId(value: ServiceVisitId): string {
  return unbrand(value);
}
