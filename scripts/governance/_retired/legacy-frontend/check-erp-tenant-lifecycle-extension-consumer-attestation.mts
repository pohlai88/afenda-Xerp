#!/usr/bin/env tsx
/**
 * PAS-001 amendment — tenant lifecycle & extension boundary ERP consumer attestation (B111).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpSrcRoot = join(repoRoot, "apps/erp/src");
const erpContextRoot = join(erpSrcRoot, "lib/context");
const erpMetadataRoot = join(erpSrcRoot, "lib/metadata");
const registryPath = join(erpContextRoot, "context-integration-registry.ts");

export interface TenantLifecycleExtensionAttestationViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

const REQUIRED_MARKERS: readonly {
  readonly file: string;
  readonly root: string;
  readonly markers: readonly string[];
}[] = [
  {
    root: erpContextRoot,
    file: "map-tenant-saas-lifecycle-phase.ts",
    markers: ["mapPlatformLifecycleStatusToTenantSaasLifecyclePhase"],
  },
  {
    root: erpContextRoot,
    file: "operating-context.mappers.ts",
    markers: [
      "mapPlatformLifecycleStatusToTenantSaasLifecyclePhase",
      "saasLifecyclePhase",
    ],
  },
  {
    root: erpMetadataRoot,
    file: "resolve-metadata-tenant-extension-boundary.server.ts",
    markers: [
      "assertMetadataTenantExtensionFieldKey",
      "assertTenantExtensionFieldKeyDoesNotForkKernelBrand",
    ],
  },
  {
    root: erpMetadataRoot,
    file: "resolve-metadata-ui-render-context.server.ts",
    markers: ["tenantSaasLifecyclePhase"],
  },
];

function parseTenantLifecycleBridgeWiring(
  source: string
): readonly { readonly id: string; readonly module: string; readonly delegate: string }[] {
  const match = source.match(
    /export const TENANT_LIFECYCLE_BRIDGE_WIRING\s*=\s*(\[[\s\S]*?\])\s*as const;/
  );

  if (match === null) {
    return [];
  }

  const entries: {
    id: string;
    module: string;
    delegate: string;
  }[] = [];

  const entryPattern =
    /\{\s*id:\s*"([^"]+)"[\s\S]*?module:\s*"([^"]+)"[\s\S]*?delegate:\s*"([^"]+)"/g;

  for (const entry of match[1].matchAll(entryPattern)) {
    entries.push({
      id: entry[1],
      module: entry[2],
      delegate: entry[3],
    });
  }

  return entries;
}

export function checkTenantLifecycleExtensionConsumerAttestation(): TenantLifecycleExtensionAttestationViolation[] {
  const violations: TenantLifecycleExtensionAttestationViolation[] = [];

  for (const requirement of REQUIRED_MARKERS) {
    const absolutePath = join(requirement.root, requirement.file);

    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "required-module-missing",
        file: absolutePath,
        message: `Missing module required for B111 attestation: ${requirement.file}`,
      });
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    for (const marker of requirement.markers) {
      if (!source.includes(marker)) {
        violations.push({
          rule: "required-marker-missing",
          file: absolutePath,
          message: `Missing B111 marker "${marker}" in ${requirement.file}`,
        });
      }
    }
  }

  for (const kernelPath of [
    "packages/kernel/src/context/tenant-saas-lifecycle.contract.ts",
    "packages/kernel/src/context/tenant-extension-boundary.contract.ts",
  ]) {
    const absolutePath = join(repoRoot, kernelPath);
    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "kernel-contract-missing",
        file: absolutePath,
        message: `Missing kernel vocabulary contract: ${kernelPath}`,
      });
    }
  }

  const runtimeContractPath = join(
    repoRoot,
    "packages/ui-composition/src/runtime.contract.ts"
  );
  if (!existsSync(runtimeContractPath)) {
    violations.push({
      rule: "metadata-runtime-contract-missing",
      file: runtimeContractPath,
      message: "Missing metadata runtime contract for tenant lifecycle carrier.",
    });
  } else {
    const runtimeSource = readFileSync(runtimeContractPath, "utf8");
    if (!runtimeSource.includes("tenantSaasLifecyclePhase")) {
      violations.push({
        rule: "metadata-runtime-carrier-missing",
        file: runtimeContractPath,
        message:
          "Metadata runtime contract must carry tenantSaasLifecyclePhase (B111).",
      });
    }
  }

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "context-integration-registry.ts is required.",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  const bridgeWiring = parseTenantLifecycleBridgeWiring(registrySource);

  if (bridgeWiring.length === 0) {
    violations.push({
      rule: "tenant-lifecycle-bridge-wiring-missing",
      file: registryPath,
      message: "TENANT_LIFECYCLE_BRIDGE_WIRING must declare B111 bridge entries.",
    });
    return violations;
  }

  for (const entry of bridgeWiring) {
    const modulePath = join(erpSrcRoot, entry.module);

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "tenant-lifecycle-bridge-module-missing",
        file: modulePath,
        message: `TENANT_LIFECYCLE_BRIDGE_WIRING entry ${entry.id} missing module ${entry.module}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    if (!moduleSource.includes(entry.delegate)) {
      violations.push({
        rule: "tenant-lifecycle-bridge-delegate-missing",
        file: modulePath,
        message: `${entry.module} must reference ${entry.delegate} (${entry.id}).`,
      });
    }
  }

  return violations;
}

const violations = checkTenantLifecycleExtensionConsumerAttestation();

if (violations.length > 0) {
  for (const violation of violations) {
    process.stderr.write(
      `${violation.file} [${violation.rule}]: ${violation.message}\n`
    );
  }
  process.exit(1);
}

process.stdout.write(
  "ERP tenant lifecycle & extension boundary consumer attestation gate passed (PAS-001 B111 / Blueprint §6).\n"
);
