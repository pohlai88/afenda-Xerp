import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import type { ApiRouteContract } from "./api-contract";

/** Canonical route-coverage utilities — re-exported by `scripts/api-contract/governed-api-routes.mts`. */

export const GOVERNED_ROUTE_ALLOWLIST = [
  "auth",
  "health",
  "integrations",
  "webhooks",
] as const;

const CONTRACT_EXPORT_PATTERN = /contract:\s*([A-Za-z0-9_]+)/g;

export function collectRouteFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "docs") {
        continue;
      }
      files.push(...collectRouteFiles(absolutePath));
      continue;
    }

    if (entry.name === "route.ts") {
      files.push(absolutePath);
    }
  }

  return files;
}

export function isAllowlistedRoute(filePath: string): boolean {
  return GOVERNED_ROUTE_ALLOWLIST.some((segment) =>
    filePath.includes(join("app", "api", segment))
  );
}

export function isGovernedRouteSource(source: string): boolean {
  if (source.includes("createApiHandler")) {
    return true;
  }

  return /export\s*\{[^}]*\}\s*from\s*["'][^"']*internal\/v1\/[^"']*["']/.test(
    source
  );
}

export function extractContractExportNames(source: string): string[] {
  const names = new Set<string>();

  for (const match of source.matchAll(CONTRACT_EXPORT_PATTERN)) {
    const exportName = match[1];
    if (exportName !== undefined) {
      names.add(exportName);
    }
  }

  return [...names];
}

export function collectGovernedRouteContractExportNames(
  apiRoot: string
): { readonly filePath: string; readonly exportNames: readonly string[] }[] {
  const bindings: { filePath: string; exportNames: string[] }[] = [];

  for (const filePath of collectRouteFiles(apiRoot)) {
    if (isAllowlistedRoute(filePath)) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");
    const exportNames = extractContractExportNames(source);

    if (exportNames.length > 0) {
      bindings.push({ exportNames, filePath });
    }
  }

  return bindings;
}

export function validateApiContractRegistryCoverage(input: {
  readonly apiRoot: string;
  readonly contractExports: Record<string, ApiRouteContract<unknown, unknown>>;
  readonly registryContracts: readonly ApiRouteContract<unknown, unknown>[];
}): string[] {
  const violations: string[] = [];
  const exportNameToId = new Map<string, string>();

  for (const [exportName, contract] of Object.entries(input.contractExports)) {
    exportNameToId.set(exportName, contract.id);
  }

  const registryIds = new Set(
    input.registryContracts.map((contract) => contract.id)
  );
  const referencedRegistryIds = new Set<string>();
  const referencedExportNames = new Set<string>();

  for (const {
    exportNames,
    filePath,
  } of collectGovernedRouteContractExportNames(input.apiRoot)) {
    for (const exportName of exportNames) {
      referencedExportNames.add(exportName);

      const contractId = exportNameToId.get(exportName);
      if (contractId === undefined) {
        violations.push(
          `${filePath}: contract export ${exportName} is not registered in api-contract-registry.ts`
        );
        continue;
      }

      if (!registryIds.has(contractId)) {
        violations.push(
          `${filePath}: contract export ${exportName} (${contractId}) missing from API_CONTRACTS`
        );
        continue;
      }

      referencedRegistryIds.add(contractId);
    }
  }

  for (const exportName of Object.keys(input.contractExports)) {
    if (!referencedExportNames.has(exportName)) {
      violations.push(
        `api-contract-registry.ts: ${exportName} (${exportNameToId.get(exportName)}) is not wired in any governed route file`
      );
    }
  }

  for (const contract of input.registryContracts) {
    if (!referencedRegistryIds.has(contract.id)) {
      violations.push(
        `API_CONTRACTS: ${contract.id} is not referenced by any governed route handler`
      );
    }
  }

  return violations;
}
