#!/usr/bin/env node
/**
 * Fail when package CSS src/ and dist/ copies are out of sync.
 *
 * Usage:
 *   node scripts/governance/check-package-css-dist-sync.mjs
 *   node scripts/governance/check-package-css-dist-sync.mjs --package @afenda/appshell
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkPackageCssDistSync } from "./package-css-dist-policy.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

function readPackageArg() {
  const idx = process.argv.indexOf("--package");
  if (idx === -1) {
    return;
  }

  const value = process.argv[idx + 1];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

const packageName = readPackageArg();
const result = checkPackageCssDistSync(repoRoot, packageName);

if (result.ok) {
  process.stdout.write("package CSS dist sync: OK\n");
  process.exit(0);
}

process.stderr.write("package CSS dist sync: FAIL\n");
for (const violation of result.violations) {
  process.stderr.write(`- ${violation}\n`);
}
process.stderr.write(
  "\nFix: pnpm sync:package-css-dist (or the package build command listed above).\n"
);
process.exit(1);
