import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const requiredFiles = [
  ".github/workflows/ci.yml",
  "docs/delivery/tip-009-ci-cd-preview.md",
];
const requiredCiCommands = [
  "pnpm format:check",
  "pnpm lint",
  "pnpm typecheck",
  "pnpm test",
  "pnpm build",
  "pnpm quality:boundaries",
  "pnpm quality:exports",
  "pnpm quality:migrations",
];
const failures = [];

for (const filePath of requiredFiles) {
  if (!existsSync(join(workspaceRoot, filePath))) {
    failures.push(`${filePath} is required`);
  }
}

const ciPath = join(workspaceRoot, ".github/workflows/ci.yml");

if (existsSync(ciPath)) {
  const ci = readFileSync(ciPath, "utf8");

  for (const command of requiredCiCommands) {
    if (!ci.includes(command)) {
      failures.push(`ci.yml must run "${command}"`);
    }
  }
}

const packageJson = JSON.parse(
  readFileSync(join(workspaceRoot, "package.json"), "utf8")
);

for (const scriptName of [
  "quality",
  "quality:boundaries",
  "quality:exports",
  "quality:migrations",
  "quality:release-gate",
]) {
  if (!packageJson.scripts?.[scriptName]) {
    failures.push(`package.json must define ${scriptName}`);
  }
}

if (failures.length > 0) {
  console.error("release gate validation failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log("release gates valid");
}
