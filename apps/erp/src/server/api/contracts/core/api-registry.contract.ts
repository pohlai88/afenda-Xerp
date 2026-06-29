import type { ApiRouteContract } from "../api-contract";
import type { ApiOperationId } from "./api-operation-id.contract";
import {
  assertUniqueApiOperationIds,
  parseApiOperationId,
} from "./api-operation-id.contract";
import type { ApiStyleBinding } from "./api-style.contract";
import { API_STYLE_BINDINGS } from "./api-style.contract";

/**
 * Style-agnostic registry record (PAS-API-001 API-002).
 * Bindings declare which API styles expose the operation; no HTTP path fields.
 */
export interface ApiOperationRegistryEntry<
  TRequest = unknown,
  TResponse = unknown,
> {
  readonly bindings: readonly ApiStyleBinding[];
  readonly contract: ApiRouteContract<TRequest, TResponse>;
  readonly operationId: ApiOperationId;
}

/** Default MVP binding — REST only until additional style PAS activate. */
const DEFAULT_OPERATION_BINDINGS = [
  API_STYLE_BINDINGS.rest,
] as const satisfies readonly ApiStyleBinding[];

export function buildApiOperationRegistry<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): readonly ApiOperationRegistryEntry[] {
  assertUniqueApiOperationIds(contracts.map((entry) => entry.id));

  return contracts.map((contract) => ({
    bindings: DEFAULT_OPERATION_BINDINGS,
    contract,
    operationId: parseApiOperationId(contract.id),
  }));
}

export function findRegistryEntryByOperationId(
  registry: readonly ApiOperationRegistryEntry[],
  operationId: ApiOperationId
): ApiOperationRegistryEntry | undefined {
  return registry.find((entry) => entry.operationId === operationId);
}

export function getRegistryOperationIds(
  registry: readonly ApiOperationRegistryEntry[]
): readonly ApiOperationId[] {
  return registry.map((entry) => entry.operationId);
}
