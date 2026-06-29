#!/usr/bin/env tsx
/**
 * PAS-001A R1c — ERP metadata PAS-006 consumer gate (IS-003).
 *
 * Verifies metadata workspace consumes spine output and studio registries;
 * replaces archived check:metadata-context-authorization-bridge.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpSrcRoot = join(repoRoot, "apps/erp/src");
const registryPath = join(erpSrcRoot, "lib/context/context-integration-registry.ts");
const protectedSurfaceRegistryPath = join(
  erpSrcRoot,
  "lib/context/operating-context-protected-surface.registry.ts"
);
const metadataWorkspacePagePath = join(
  erpSrcRoot,
  "app/(protected)/metadata-workspace/page.tsx"
);

export interface ErpMetadataPas006ConsumerViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

const REQUIRED_METADATA_MODULES = [
  {
    file: "lib/metadata/metadata-ui-binding.projection.ts",
    markers: ["projectMetadataUiBindingWire", "ERP_DOMAIN_MODULES"],
  },
  {
    file: "lib/metadata/resolve-metadata-ui-render-context.server.ts",
    markers: ["resolveMetadataUiRenderContextFromTenantContext"],
  },
  {
    file: "lib/metadata/resolve-metadata-workspace-surfaces.server.ts",
    markers: ["resolveMetadataWorkspaceSurfaces", "SURFACE_TEMPLATE_REGISTRY"],
  },
  {
    file: "lib/metadata/hydrate-metadata-binding-slots.server.ts",
    markers: [
      "hydrateMetadataBindingSlots",
      "AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE",
    ],
  },
] as const;

const FORBIDDEN_METADATA_IMPORTS = [
  "@afenda/metadata-ui",
  "@afenda/ui-composition",
] as const;

function parseMetadataConsumerWiring(
  source: string
): readonly { readonly id: string; readonly module: string; readonly delegate: string }[] {
  const match = source.match(
    /export const METADATA_PAS006_CONSUMER_WIRING\s*=\s*(\[[\s\S]*?\])\s*as const;/
  );

  if (match === null) {
    return [];
  }

  const entries: { id: string; module: string; delegate: string }[] = [];
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

export function checkErpMetadataPas006Consumer(): ErpMetadataPas006ConsumerViolation[] {
  const violations: ErpMetadataPas006ConsumerViolation[] = [];

  for (const requirement of REQUIRED_METADATA_MODULES) {
    const absolutePath = join(erpSrcRoot, requirement.file);

    if (!existsSync(absolutePath)) {
      violations.push({
        rule: "required-module-missing",
        file: requirement.file,
        message: `${requirement.file} is required for PAS-001A R1c`,
      });
      continue;
    }

    const source = readFileSync(absolutePath, "utf8");

    for (const marker of requirement.markers) {
      if (!source.includes(marker)) {
        violations.push({
          rule: "required-marker-missing",
          file: requirement.file,
          message: `${requirement.file} must reference ${marker}`,
        });
      }
    }

    for (const forbiddenImport of FORBIDDEN_METADATA_IMPORTS) {
      if (source.includes(forbiddenImport)) {
        violations.push({
          rule: "forbidden-metadata-import",
          file: requirement.file,
          message: `${requirement.file} must not import ${forbiddenImport}`,
        });
      }
    }
  }

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "context-integration-registry.ts is required",
    });
  } else {
    const registrySource = readFileSync(registryPath, "utf8");
    const wiring = parseMetadataConsumerWiring(registrySource);

    if (wiring.length === 0) {
      violations.push({
        rule: "metadata-consumer-wiring-empty",
        file: registryPath,
        message: "METADATA_PAS006_CONSUMER_WIRING must declare IS-003 entries",
      });
    }

    for (const entry of wiring) {
      const modulePath = join(erpSrcRoot, entry.module);

      if (!existsSync(modulePath)) {
        violations.push({
          rule: "metadata-consumer-module-missing",
          file: modulePath,
          message: `${entry.module} declared in METADATA_PAS006_CONSUMER_WIRING is missing`,
        });
        continue;
      }

      const moduleSource = readFileSync(modulePath, "utf8");

      if (!moduleSource.includes(entry.delegate)) {
        violations.push({
          rule: "metadata-consumer-delegate-missing",
          file: modulePath,
          message: `${entry.module} must export or reference ${entry.delegate}`,
        });
      }
    }
  }

  if (!existsSync(protectedSurfaceRegistryPath)) {
    violations.push({
      rule: "protected-surface-registry-missing",
      file: protectedSurfaceRegistryPath,
      message: "operating-context-protected-surface.registry.ts is required",
    });
  } else {
    const protectedSource = readFileSync(protectedSurfaceRegistryPath, "utf8");

    if (!protectedSource.includes("protected-rsc-metadata-workspace")) {
      violations.push({
        rule: "metadata-workspace-not-protected",
        file: protectedSurfaceRegistryPath,
        message:
          "metadata-workspace must be registered in OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY (R1b)",
      });
    }
  }

  if (!existsSync(metadataWorkspacePagePath)) {
    violations.push({
      rule: "metadata-workspace-page-missing",
      file: metadataWorkspacePagePath,
      message: "metadata-workspace page is required",
    });
  } else {
    const pageSource = readFileSync(metadataWorkspacePagePath, "utf8");
    const requiredPageMarkers = [
      "loadProtectedRequestOperatingContext",
      "resolveMetadataUiRenderContextFromTenantContext",
      "resolveMetadataWorkspaceSurfaces",
      "slotHydration",
      "MetadataBindingSlotHydrationPreview",
    ] as const;

    for (const marker of requiredPageMarkers) {
      if (!pageSource.includes(marker)) {
        violations.push({
          rule: "metadata-workspace-page-marker-missing",
          file: metadataWorkspacePagePath,
          message: `metadata-workspace page must reference ${marker}`,
        });
      }
    }

    for (const forbiddenImport of FORBIDDEN_METADATA_IMPORTS) {
      if (pageSource.includes(forbiddenImport)) {
        violations.push({
          rule: "forbidden-metadata-import",
          file: metadataWorkspacePagePath,
          message: `metadata-workspace page must not import ${forbiddenImport}`,
        });
      }
    }
  }

  return violations;
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-erp-metadata-pas006-consumer.mts")
    );
  } catch {
    return entry.endsWith("check-erp-metadata-pas006-consumer.mts");
  }
})();

if (isDirectRun) {
  const violations = checkErpMetadataPas006Consumer();

  if (violations.length > 0) {
    process.stderr.write("erp metadata PAS-006 consumer: FAIL\n");
    for (const violation of violations) {
      process.stderr.write(
        `[${violation.rule}] ${violation.file}\n  ${violation.message}\n`
      );
    }
    process.exit(1);
  }

  const testRun = spawnSync(
    "pnpm",
    [
      "--filter",
      "@afenda/erp",
      "exec",
      "vitest",
      "run",
      "metadata-workspace-hydration.integration",
      "hydrate-metadata-binding-slots.server",
      "metadata-ui-binding.projection",
      "resolve-metadata-workspace-surfaces.server",
    ],
    { cwd: repoRoot, stdio: "inherit", shell: true }
  );

  if (testRun.status !== 0) {
    process.stderr.write("erp metadata PAS-006 consumer: FAIL (vitest)\n");
    process.exit(testRun.status ?? 1);
  }

  process.stdout.write(
    "erp metadata PAS-006 consumer: OK (PAS-001A R1c IS-003)\n"
  );
}
