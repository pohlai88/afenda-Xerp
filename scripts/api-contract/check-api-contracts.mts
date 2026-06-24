import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  collectRouteFiles,
  isAllowlistedRoute,
  isGovernedRouteSource,
  validateApiContractRegistryCoverage,
} from "./governed-api-routes.mts";

const repoRoot = join(import.meta.dirname, "../..");
const apiRoot = join(repoRoot, "apps/erp/src/app/api");
const DIRECT_RESPONSE_JSON_PATTERN = /Response\.json\s*\(/;

function collectRouteBoundaryViolations(apiRootPath: string): string[] {
  const violations: string[] = [];

  for (const filePath of collectRouteFiles(apiRootPath)) {
    if (isAllowlistedRoute(filePath)) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");

    if (!isGovernedRouteSource(source)) {
      violations.push(`${filePath}: missing createApiHandler`);
    }

    if (DIRECT_RESPONSE_JSON_PATTERN.test(source)) {
      violations.push(`${filePath}: direct Response.json usage`);
    }
  }

  return violations;
}

function collectContractPolicyViolations(
  contracts: readonly { readonly id: string }[],
  policies: {
    readonly assertMethodPolicy: (contract: unknown) => void;
    readonly assertIdempotencyPolicy: (contract: unknown) => void;
  }
): string[] {
  const violations: string[] = [];

  for (const contract of contracts) {
    try {
      policies.assertMethodPolicy(contract);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      violations.push(`method policy: ${contract.id}: ${message}`);
    }

    try {
      policies.assertIdempotencyPolicy(contract);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      violations.push(`idempotency policy: ${contract.id}: ${message}`);
    }
  }

  return violations;
}

async function main(): Promise<void> {
  const violations = collectRouteBoundaryViolations(apiRoot);

  const [apiContractRegistry, methodPolicy, idempotencyPolicy] =
    await Promise.all([
      import(
        "../../apps/erp/src/server/api/contracts/api-contract-registry.ts"
      ),
      import(
        "../../apps/erp/src/server/api/contracts/method-policy.contract.ts"
      ),
      import("../../apps/erp/src/server/api/contracts/idempotency.contract.ts"),
    ]);

  violations.push(
    ...collectContractPolicyViolations(apiContractRegistry.API_CONTRACTS, {
      assertIdempotencyPolicy: idempotencyPolicy.assertIdempotencyPolicy,
      assertMethodPolicy: methodPolicy.assertMethodPolicy,
    })
  );

  violations.push(
    ...validateApiContractRegistryCoverage({
      apiRoot,
      contractExports: apiContractRegistry.GOVERNED_ROUTE_CONTRACT_EXPORTS,
      registryContracts: apiContractRegistry.API_CONTRACTS,
    })
  );

  if (violations.length > 0) {
    console.error("API contract drift detected:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log("API contract drift check passed");
}

await main();
