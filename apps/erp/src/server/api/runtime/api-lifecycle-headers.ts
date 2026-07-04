import type { ApiRouteContract } from "../contracts/api-contract";
import { API_CONTRACTS } from "../contracts/api-contract-registry";

const contractPathById = new Map<string, string>(
  API_CONTRACTS.map((contract) => [contract.id, contract.path])
);

export function buildDeprecatedRouteLifecycleHeaders(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "lifecycle" | "lifecycleMigration"
  >
): Record<string, string> {
  if (contract.lifecycle !== "deprecated") {
    return {};
  }

  const headers: Record<string, string> = {
    Deprecation: "true",
  };

  const sunsetAt = contract.lifecycleMigration?.sunsetAt;
  if (sunsetAt !== undefined) {
    headers["Sunset"] = new Date(`${sunsetAt}T23:59:59.000Z`).toUTCString();
  }

  const replacementOperationId =
    contract.lifecycleMigration?.replacementOperationId;
  if (replacementOperationId !== undefined) {
    const replacementPath = contractPathById.get(replacementOperationId);
    if (replacementPath !== undefined) {
      headers["Link"] = `<${replacementPath}>; rel="successor-version"`;
    }
  }

  return headers;
}

export function applyLifecycleResponseHeaders(
  response: Response,
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "lifecycle" | "lifecycleMigration"
  >
): Response {
  const lifecycleHeaders = buildDeprecatedRouteLifecycleHeaders(contract);
  if (Object.keys(lifecycleHeaders).length === 0) {
    return response;
  }

  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(lifecycleHeaders)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
