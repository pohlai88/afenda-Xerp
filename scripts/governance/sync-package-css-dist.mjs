#!/usr/bin/env node
/**
 * Copy package CSS sources into dist/ without a full TypeScript build.
 *
 * Usage:
 *   pnpm sync:package-css-dist
 *   pnpm sync:package-css-dist -- --package @afenda/appshell
 *   node scripts/governance/sync-package-css-dist.mjs packages/appshell/src/styles/afenda-appshell.css
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  findPackageForSourcePath,
  syncPackageCssDist,
} from "./package-css-dist-policy.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function readPackageArg() {
  const idx = process.argv.indexOf("--package");
  if (idx === -1) {
    return;
  }

  const value = process.argv[idx + 1];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function packagesFromStagedArgs(args) {
  /** @type {Set<string>} */
  const names = new Set();

  for (const arg of args) {
    const pkg = findPackageForSourcePath(arg);
    if (pkg) {
      names.add(pkg.name);
    }
  }

  return [...names];
}

const explicitPackage = readPackageArg();
const stagedPaths = process.argv
  .slice(2)
  .filter((arg) => !arg.startsWith("--") && arg.endsWith(".css"));

/** @type {string[]} */
let copied = [];

if (explicitPackage) {
  copied = syncPackageCssDist(repoRoot, explicitPackage);
} else if (stagedPaths.length > 0) {
  const names = packagesFromStagedArgs(stagedPaths);
  for (const name of names) {
    copied.push(...syncPackageCssDist(repoRoot, name));
  }
} else {
  copied = syncPackageCssDist(repoRoot);
}

if (copied.length === 0) {
  process.stdout.write("package CSS dist sync: nothing to copy\n");
  process.exit(0);
}

process.stdout.write(
  `package CSS dist sync: copied ${copied.length} file(s)\n${copied.map((file) => `- ${file}`).join("\n")}\n`
);
