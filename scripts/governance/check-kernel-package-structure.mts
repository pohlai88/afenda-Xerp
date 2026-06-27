#!/usr/bin/env tsx
/** PAS-001 §6.1 / §6.2 / §6.4 — kernel package structure and subpath export gate. */

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL,
  KERNEL_PACKAGE_PROHIBITED_PATHS,
  KERNEL_PACKAGE_SRC_ROOT_BARREL,
  KERNEL_PACKAGE_TARGET_PATHS,
  RETIRED_KERNEL_REPO_PATHS,
} from "../../packages/kernel/src/contracts/kernel-package-layout.contract.ts";
import { RETIRED_KERNEL_PLATFORM_ID_PATHS } from "../../packages/kernel/src/identity/governance/identity-module-layout.contract.ts";
import {
  checkKernelSubpathExports,
  formatKernelSubpathExportViolations,
} from "./check-kernel-subpath-exports.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const kernelSrcRoot = join(repoRoot, "packages/kernel/src");
const violations: string[] = [];

for (const folder of KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL) {
  const folderPath = join(kernelSrcRoot, folder);
  if (!existsSync(folderPath)) {
    violations.push(
      `Missing PAS §6.1 top-level folder: packages/kernel/src/${folder}`
    );
  }
}

const rootEntries = readdirSync(kernelSrcRoot, { withFileTypes: true });
const rootFiles = rootEntries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name);

if (rootFiles.length !== 1 || rootFiles[0] !== KERNEL_PACKAGE_SRC_ROOT_BARREL) {
  violations.push(
    `packages/kernel/src must contain only ${KERNEL_PACKAGE_SRC_ROOT_BARREL} at root; found: ${rootFiles.join(", ") || "(none)"}`
  );
}

const rootDirectories = rootEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const expectedDirectories = [...KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL].sort();
if (rootDirectories.join(",") !== expectedDirectories.join(",")) {
  violations.push(
    `PAS §6.1 folder drift: expected [${expectedDirectories.join(", ")}], found [${rootDirectories.join(", ")}]`
  );
}

for (const repoRelative of KERNEL_PACKAGE_TARGET_PATHS) {
  if (!existsSync(join(repoRoot, repoRelative))) {
    violations.push(`Missing PAS §6.2 target path: ${repoRelative}`);
  }
}

for (const repoRelative of KERNEL_PACKAGE_PROHIBITED_PATHS) {
  if (existsSync(join(repoRoot, repoRelative))) {
    violations.push(`Prohibited PAS §6.2 path present: ${repoRelative}`);
  }
}

for (const repoRelative of RETIRED_KERNEL_PLATFORM_ID_PATHS) {
  if (existsSync(join(repoRoot, repoRelative))) {
    violations.push(`Retired platform-id path present: ${repoRelative}`);
  }
}

for (const repoRelative of RETIRED_KERNEL_REPO_PATHS) {
  if (existsSync(join(repoRoot, repoRelative))) {
    violations.push(`Retired kernel path present: ${repoRelative}`);
  }
}

const subpathViolations = checkKernelSubpathExports();
if (subpathViolations.length > 0) {
  violations.push(formatKernelSubpathExportViolations(subpathViolations));
}

if (violations.length > 0) {
  console.error("Kernel package structure gate failed:\n");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(
  "Kernel package structure gate passed (PAS §6.1 / §6.2 / §6.4 — layout + subpath exports)."
);
