import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const developerRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const repoRoot = path.resolve(developerRoot, "../..");
const isWindows = process.platform === "win32";

function workspaceBin(commandName) {
  return path.join(
    repoRoot,
    "node_modules",
    ".bin",
    isWindows ? `${commandName}.CMD` : commandName
  );
}

function appBin(commandName) {
  return path.join(
    developerRoot,
    "node_modules",
    ".bin",
    isWindows ? `${commandName}.CMD` : commandName
  );
}

function runStep(stepName, command, args, options = {}) {
  console.log(`\n[route-lab greenlight] ${stepName}`);

  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repoRoot,
    env: { ...process.env, ...options.env },
    shell: isWindows,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runStep("Biome", workspaceBin("biome"), ["ci", "apps/developer"]);
runStep("Vitest", workspaceBin("vitest"), [
  "run",
  "--config",
  "apps/developer/vitest.config.ts",
]);
runStep("Next typegen", appBin("next"), ["typegen"], {
  cwd: developerRoot,
  env: {
    AFENDA_DEVELOPER_SANDBOX: "true",
  },
});
runStep("TypeScript", workspaceBin("tsc"), [
  "-p",
  "apps/developer/tsconfig.json",
  "--noEmit",
]);
runStep("Route-lab governance", process.execPath, [
  "apps/developer/scripts/check-route-lab-governance.mjs",
]);
runStep(
  "Playwright smoke",
  appBin("playwright"),
  ["test", "--config", "playwright.config.mts", "--project=chromium-smoke"],
  {
    cwd: developerRoot,
  }
);
runStep("Next build", appBin("next"), ["build"], {
  cwd: developerRoot,
  env: {
    AFENDA_DEVELOPER_SANDBOX: "true",
  },
});
