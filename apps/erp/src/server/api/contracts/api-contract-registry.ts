import type { ApiRouteContract } from "./api-contract";
import { healthGetContract } from "./health.api-contract";
import {
  dashboardLayoutDeleteContract,
  dashboardLayoutGetContract,
  dashboardLayoutPutContract,
} from "./workspace/dashboard-layout.contract";

export const API_CONTRACTS = [
  healthGetContract,
  dashboardLayoutGetContract,
  dashboardLayoutPutContract,
  dashboardLayoutDeleteContract,
] as const satisfies readonly ApiRouteContract<unknown, unknown>[];

export type ApiContractId = (typeof API_CONTRACTS)[number]["id"];

export function getApiContractById(
  id: ApiContractId
): (typeof API_CONTRACTS)[number] {
  const contract = API_CONTRACTS.find((entry) => entry.id === id);
  if (contract === undefined) {
    throw new Error(`Unknown API contract id: ${id}`);
  }
  return contract;
}
