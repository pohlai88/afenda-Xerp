#!/usr/bin/env tsx
/**
 * PAS-001A B72 — ERP operating-context integration spine gate.
 *
 * Verifies CONTEXT_INTEGRATION_WIRING, AUTH_SESSION_BRIDGE_WIRING, and
 * AUTH_ACTOR_BRIDGE_WIRING entries in apps/erp context-integration-registry.ts
 * resolve to live modules/delegates.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpSrcRoot = join(repoRoot, "apps/erp/src");
const registryPath = join(
  erpSrcRoot,
  "lib/context/context-integration-registry.ts"
);

const FORBIDDEN_INTEGRATION_IMPORT_PATTERNS = [
  /@afenda\/kernel\/dist\//,
  /@afenda\/kernel\/src\//,
  /@afenda\/database\/dist\//,
  /@afenda\/database\/src\//,
  /@afenda\/permissions\/(dist|src)\//,
] as const;

interface IntegrationWiringEntry {
  readonly id: string;
  readonly module: string;
  readonly delegate: string;
  readonly step: string;
}

export interface ErpOperatingContextSpineViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function extractConstArrayBody(source: string, constantName: string): string | null {
  const marker = `export const ${constantName} = [`;
  const startIndex = source.indexOf(marker);
  if (startIndex === -1) {
    return null;
  }

  const bodyStart = startIndex + marker.length;
  let depth = 1;
  let index = bodyStart;

  while (index < source.length && depth > 0) {
    const char = source[index];
    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;
    }
    index += 1;
  }

  if (depth !== 0) {
    return null;
  }

  return source.slice(bodyStart, index - 1);
}

function parseWiringEntries(
  source: string,
  constantName: string
): IntegrationWiringEntry[] {
  const arrayBody = extractConstArrayBody(source, constantName);
  if (arrayBody === null) {
    return [];
  }

  const entries: IntegrationWiringEntry[] = [];
  const objectBlocks = arrayBody.match(/\{[^{}]+\}/g) ?? [];

  for (const block of objectBlocks) {
    const id = block.match(/id:\s*"([^"]+)"/)?.[1];
    const step = block.match(/step:\s*"([^"]+)"/)?.[1];
    const module = block.match(/module:\s*"([^"]+)"/)?.[1];
    const delegate = block.match(/delegate:\s*"([^"]+)"/)?.[1];

    if (id && step && module && delegate) {
      entries.push({ id, step, module, delegate });
    }
  }

  return entries;
}

function readIntegrationRegistry(): {
  readonly contextWiring: IntegrationWiringEntry[];
  readonly authBridgeWiring: IntegrationWiringEntry[];
  readonly authActorBridgeWiring: IntegrationWiringEntry[];
} {
  if (!existsSync(registryPath)) {
    return {
      contextWiring: [],
      authBridgeWiring: [],
      authActorBridgeWiring: [],
    };
  }

  const source = readFileSync(registryPath, "utf8");
  return {
    contextWiring: parseWiringEntries(source, "CONTEXT_INTEGRATION_WIRING"),
    authBridgeWiring: parseWiringEntries(source, "AUTH_SESSION_BRIDGE_WIRING"),
    authActorBridgeWiring: parseWiringEntries(
      source,
      "AUTH_ACTOR_BRIDGE_WIRING"
    ),
  };
}

function listSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      files.push(...listSourceFiles(fullPath));
      continue;
    }

    if (
      /\.(ts|tsx|mts)$/.test(entry.name) &&
      !/\.(test|spec)\./.test(entry.name)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function collectUniqueIds(
  entries: readonly { readonly id: string }[]
): ErpOperatingContextSpineViolation[] {
  const violations: ErpOperatingContextSpineViolation[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    if (seen.has(entry.id)) {
      violations.push({
        rule: "registry-id-duplicate",
        file: registryPath,
        message: `Duplicate integration registry id: ${entry.id}`,
      });
    }
    seen.add(entry.id);
  }

  return violations;
}

function collectWiringViolations(
  wiring: readonly {
    readonly id: string;
    readonly module: string;
    readonly delegate: string;
    readonly step: string;
  }[],
  label: string
): ErpOperatingContextSpineViolation[] {
  const violations: ErpOperatingContextSpineViolation[] = [];

  for (const entry of wiring) {
    const modulePath = join(erpSrcRoot, entry.module);

    if (!modulePath.startsWith(erpSrcRoot)) {
      violations.push({
        rule: "wiring-module-outside-erp",
        file: registryPath,
        message: `${label} entry ${entry.id} module must resolve under apps/erp/src`,
      });
      continue;
    }

    if (!existsSync(modulePath)) {
      violations.push({
        rule: "wiring-module-missing",
        file: modulePath,
        message: `${label} entry ${entry.id} missing module ${entry.module}`,
      });
      continue;
    }

    const moduleSource = readFileSync(modulePath, "utf8");
    if (!moduleSource.includes(entry.delegate)) {
      violations.push({
        rule: "wiring-delegate-missing",
        file: modulePath,
        message: `${entry.module} must export or reference ${entry.delegate} (${entry.step})`,
      });
    }

    for (const pattern of FORBIDDEN_INTEGRATION_IMPORT_PATTERNS) {
      if (pattern.test(moduleSource)) {
        violations.push({
          rule: "forbidden-deep-import",
          file: modulePath,
          message: `${entry.module} must not use forbidden deep imports (${label} ${entry.id})`,
        });
      }
    }
  }

  return violations;
}

export function checkErpOperatingContextSpine(): ErpOperatingContextSpineViolation[] {
  const violations: ErpOperatingContextSpineViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "context-integration-registry.ts is required",
    });
    return violations;
  }

  const { contextWiring, authBridgeWiring, authActorBridgeWiring } =
    readIntegrationRegistry();

  if (contextWiring.length === 0) {
    violations.push({
      rule: "context-wiring-empty",
      file: registryPath,
      message: "CONTEXT_INTEGRATION_WIRING must declare integration entries",
    });
  }

  if (authBridgeWiring.length === 0) {
    violations.push({
      rule: "auth-bridge-wiring-empty",
      file: registryPath,
      message: "AUTH_SESSION_BRIDGE_WIRING must declare auth bridge entries",
    });
  }

  if (authActorBridgeWiring.length === 0) {
    violations.push({
      rule: "auth-actor-bridge-wiring-empty",
      file: registryPath,
      message: "AUTH_ACTOR_BRIDGE_WIRING must declare auth actor bridge entries",
    });
  }

  violations.push(...collectUniqueIds(contextWiring));
  violations.push(...collectUniqueIds(authBridgeWiring));
  violations.push(...collectUniqueIds(authActorBridgeWiring));
  violations.push(
    ...collectWiringViolations(contextWiring, "CONTEXT_INTEGRATION_WIRING")
  );
  violations.push(
    ...collectWiringViolations(authBridgeWiring, "AUTH_SESSION_BRIDGE_WIRING")
  );
  violations.push(
    ...collectWiringViolations(
      authActorBridgeWiring,
      "AUTH_ACTOR_BRIDGE_WIRING"
    )
  );

  return violations;
}

function main(): void {
  const violations = checkErpOperatingContextSpine();
  if (violations.length > 0) {
    for (const violation of violations) {
      process.stderr.write(
        `[${violation.rule}] ${violation.file}\n  ${violation.message}\n`
      );
    }
    process.exit(1);
  }

  process.stdout.write(
    "ERP operating-context spine gate passed (PAS-001A B72).\n"
  );
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-erp-operating-context-spine.mts")
    );
  } catch {
    return entry.endsWith("check-erp-operating-context-spine.mts");
  }
})();

if (isDirectRun) {
  main();
}
