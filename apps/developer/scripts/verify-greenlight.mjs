import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const developerRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const repoRoot = path.resolve(developerRoot, "../..");
const isWindows = process.platform === "win32";
const playwrightPort = process.env["PLAYWRIGHT_PORT"] ?? "3002";
const playwrightBaseUrl =
  process.env["PLAYWRIGHT_BASE_URL"] ?? `http://127.0.0.1:${playwrightPort}`;

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
    if (options.exitOnFailure === false) {
      throw new Error(
        `${stepName} failed with exit code ${result.status ?? 1}`
      );
    }

    process.exit(result.status ?? 1);
  }
}

async function waitForHttpReady(url, timeoutMs = 120_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);

      if (response.ok || response.status < 500) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function stopProcessTree(child) {
  if (child.pid === undefined) {
    return;
  }

  if (isWindows) {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
    return;
  }

  child.kill("SIGTERM");
}

async function isHttpResponsive(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function runProductionPlaywrightSmoke() {
  const alreadyServing = await isHttpResponsive(playwrightBaseUrl);
  let server = null;
  let ownsServer = false;

  if (alreadyServing) {
    console.log(
      `\n[route-lab greenlight] Reusing server at ${playwrightBaseUrl} (port ${playwrightPort} already in use)`
    );
  } else {
    console.log("\n[route-lab greenlight] Production smoke server");

    server = spawn(appBin("next"), ["start", "--port", playwrightPort], {
      cwd: developerRoot,
      env: {
        ...process.env,
        AFENDA_DEVELOPER_SANDBOX: "true",
        NODE_ENV: "production",
      },
      shell: isWindows,
      stdio: "inherit",
    });
    ownsServer = true;
    await waitForHttpReady(playwrightBaseUrl);
  }

  try {
    runStep(
      "Playwright smoke",
      appBin("playwright"),
      ["test", "--config", "playwright.config.mts", "--project=chromium-smoke"],
      {
        cwd: developerRoot,
        exitOnFailure: false,
        env: {
          PLAYWRIGHT_BASE_URL: playwrightBaseUrl,
          PLAYWRIGHT_SKIP_WEBSERVER: "1",
        },
      }
    );
  } finally {
    if (ownsServer && server) {
      stopProcessTree(server);
    }
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
runStep("Presentation runtime boundary", process.execPath, [
  "apps/developer/scripts/check-developer-presentation-runtime.mjs",
]);
runStep("Hydration governance", process.execPath, [
  "apps/developer/scripts/check-developer-hydration-governance.mjs",
]);
runStep("Next build", appBin("next"), ["build"], {
  cwd: developerRoot,
  env: {
    AFENDA_DEVELOPER_SANDBOX: "true",
  },
});
await runProductionPlaywrightSmoke();
