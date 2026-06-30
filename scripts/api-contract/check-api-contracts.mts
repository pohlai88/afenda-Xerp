import { readFileSync } from "node:fs";
import { join } from "node:path";

import type * as RouteCoverage from "../../apps/erp/src/server/api/contracts/api-route-coverage.ts";

const repoRoot = join(import.meta.dirname, "../..");
const apiRoot = join(repoRoot, "apps/erp/src/app/api");
const DIRECT_RESPONSE_JSON_PATTERN = /Response\.json\s*\(/;

function collectRouteBoundaryViolations(
  apiRootPath: string,
  routeCoverage: typeof RouteCoverage
): string[] {
  const violations: string[] = [];

  for (const filePath of routeCoverage.collectRouteFiles(apiRootPath)) {
    if (routeCoverage.isAllowlistedRoute(filePath)) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");

    if (!routeCoverage.isGovernedRouteSource(source)) {
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
  const routeCoverage = await import(
    "../../apps/erp/src/server/api/contracts/api-route-coverage.ts"
  );

  const violations = collectRouteBoundaryViolations(apiRoot, routeCoverage);

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
    ...routeCoverage.validateApiContractRegistryCoverage({
      apiRoot,
      contractExports: apiContractRegistry.GOVERNED_ROUTE_CONTRACT_EXPORTS,
      registryContracts: apiContractRegistry.API_CONTRACTS,
    })
  );

  const governanceExceptions = await import(
    "../../apps/erp/src/server/api/contracts/core/api-exception.contract.ts"
  );

  violations.push(
    ...governanceExceptions.collectGovernanceExceptionViolations(
      governanceExceptions.API_GOVERNANCE_EXCEPTION_REGISTRY
    )
  );

  const [ownershipPolicy, consumerImpactPolicy, auditReplayPolicy] =
    await Promise.all([
      import(
        "../../apps/erp/src/server/api/contracts/core/api-ownership.contract.ts"
      ),
      import(
        "../../apps/erp/src/server/api/contracts/core/api-consumer-impact.contract.ts"
      ),
      import(
        "../../apps/erp/src/server/api/contracts/core/api-audit-replay.contract.ts"
      ),
    ]);

  for (const contract of apiContractRegistry.API_CONTRACTS) {
    try {
      if (contract.lifecycle === "active" || contract.lifecycle === "planned") {
        ownershipPolicy.assertActiveOperationOwnership(contract);
      }
      consumerImpactPolicy.resolveConsumerImpactDeclaration(contract);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      violations.push(`governance metadata: ${contract.id}: ${message}`);
    }
  }

  try {
    consumerImpactPolicy.assertRegistryConsumerImpactPolicy(
      apiContractRegistry.API_CONTRACTS
    );
    auditReplayPolicy.assertRegistryCorrelationPolicy(
      apiContractRegistry.API_CONTRACTS
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    violations.push(`governance registry: ${message}`);
  }

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
