#!/usr/bin/env node
/**
 * PAS-006 — ui primitive metadata inventory gate.
 * Fails on add/delete without updating _governance.registry.ts
 * and ui-primitive-metadata.registry.ts factory imports.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const uiDir = join(repoRoot, "packages/shadcn-studio/src/components-ui");
const governanceDir = join(repoRoot, "packages/shadcn-studio/src/meta-gates");
const inventoryPath = join(governanceDir, "_governance.registry.ts");
const aggregatorPath = join(
  governanceDir,
  "ui-primitive-metadata.registry.ts"
);
const inventoryMarker = "@afenda.governance-envelope";
const goldVersion = "1.2.0";

const violations = [];

const inventorySource = readFileSync(inventoryPath, "utf8");
const aggregatorSource = readFileSync(aggregatorPath, "utf8");

const registeredSlugs = [
  ...inventorySource.matchAll(/^\s*"([a-z0-9-]+)",\s*$/gm),
].map((match) => match[1]);

if (registeredSlugs.length === 0) {
  violations.push(
    "_governance.registry.ts: no registered slugs found"
  );
}

const discoveredSlugs = readdirSync(uiDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".contract.ts") &&
      !entry.name.includes(".test.")
  )
  .map((entry) => entry.name.replace(".contract.ts", ""))
  .sort();

const registeredSet = new Set(registeredSlugs);
const discoveredSet = new Set(discoveredSlugs);

for (const slug of registeredSlugs) {
  if (!discoveredSet.has(slug)) {
    violations.push(
      `inventory lists missing contract: components-ui/${slug}.contract.ts`
    );
  }
}

for (const slug of discoveredSlugs) {
  if (!registeredSet.has(slug)) {
    violations.push(
      `unregistered components-ui/${slug}.contract.ts — add slug to _governance.registry.ts + factory import in ui-primitive-metadata.registry.ts`
    );
  }
}

for (const slug of registeredSlugs) {
  const contractPath = join(uiDir, `${slug}.contract.ts`);

  if (!existsSync(contractPath)) {
    continue;
  }

  const contractSource = readFileSync(contractPath, "utf8");

  if (!contractSource.includes("PRIMITIVE_CONTRACT_VERSION")) {
    violations.push(`${slug}.contract.ts: missing PRIMITIVE_CONTRACT_VERSION`);
  }

  if (
    !new RegExp(
      `PRIMITIVE_CONTRACT_VERSION\\s*=\\s*["']${goldVersion}["']`
    ).test(contractSource)
  ) {
    violations.push(
      `${slug}.contract.ts: PRIMITIVE_CONTRACT_VERSION must be ${goldVersion}`
    );
  }

  if (!/export function \w+PrimitiveMetadata\(\)/.test(contractSource)) {
    violations.push(`${slug}.contract.ts: missing PrimitiveMetadata factory`);
  }

  const importPattern = new RegExp(
    `from\\s+["']\\.\\./components-ui/${slug}\\.contract`
  );

  if (!importPattern.test(aggregatorSource)) {
    violations.push(
      `ui-primitive-metadata.registry.ts: missing import for ${slug}.contract.ts`
    );
  }
}

if (!inventorySource.includes(inventoryMarker)) {
  violations.push(
    `_governance.registry.ts: missing ${inventoryMarker} marker`
  );
}

if (violations.length > 0) {
  process.stderr.write("studio ui primitive metadata: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

const testRun = spawnSync(
  "pnpm",
  [
    "--filter",
    "@afenda/shadcn-studio",
    "exec",
    "vitest",
    "run",
    "ui-primitive-metadata.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio ui primitive metadata: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write(
  `studio ui primitive metadata: OK (${discoveredSlugs.length} contracts, series flat-L2-contract)\n`
);
process.exit(0);
