import { spawn, spawnSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const developerRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const repoRoot = path.resolve(developerRoot, "../..");
const isWindows = process.platform === "win32";
const preferredPlaywrightPort = process.env["PLAYWRIGHT_PORT"] ?? "3002";
const explicitPlaywrightBaseUrl = process.env["PLAYWRIGHT_BASE_URL"];

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

async function isHttpResponsive(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitForDeveloperLabReady(url, timeoutMs = 120_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isDeveloperRouteLabServer(url)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for developer-route-lab health at ${url}`);
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

async function isDeveloperRouteLabServer(url) {
  try {
    const response = await fetch(`${url}/api/lab/v1/health`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return false;
    }

    const body = await response.json();
    return body?.service === "developer-route-lab" && body?.status === "ok";
  } catch {
    return false;
  }
}

function findEphemeralPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        resolve(String(address.port));
      });
    });
  });
}

function reservePort(preferredPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once("error", (error) => {
      if (error.code !== "EADDRINUSE") {
        reject(error);
        return;
      }

      findEphemeralPort().then(resolve).catch(reject);
    });

    server.listen(Number(preferredPort), "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        resolve(String(address.port));
      });
    });
  });
}

async function resolveProductionSmokeTarget() {
  if (explicitPlaywrightBaseUrl) {
    return {
      baseUrl: explicitPlaywrightBaseUrl,
      port: new URL(explicitPlaywrightBaseUrl).port || preferredPlaywrightPort,
      reuseExisting: false,
    };
  }

  const preferredBaseUrl = `http://127.0.0.1:${preferredPlaywrightPort}`;

  if (await isDeveloperRouteLabServer(preferredBaseUrl)) {
    return {
      baseUrl: preferredBaseUrl,
      port: preferredPlaywrightPort,
      reuseExisting: true,
    };
  }

  let port;

  if (await isHttpResponsive(preferredBaseUrl)) {
    port = await findEphemeralPort();
    console.log(
      `\n[route-lab greenlight] Port ${preferredPlaywrightPort} is occupied by a non-developer app; using ${port}`
    );
  } else {
    port = await reservePort(preferredPlaywrightPort);

    if (port !== preferredPlaywrightPort) {
      console.log(
        `\n[route-lab greenlight] Port ${preferredPlaywrightPort} unavailable; using ${port}`
      );
    }
  }

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    port,
    reuseExisting: false,
  };
}

async function runProductionPlaywrightSmoke() {
  const smokeTarget = await resolveProductionSmokeTarget();
  let server = null;

  if (smokeTarget.reuseExisting) {
    console.log(
      `\n[route-lab greenlight] Reusing developer route-lab server at ${smokeTarget.baseUrl}`
    );
  } else {
    console.log(
      `\n[route-lab greenlight] Production smoke server on port ${smokeTarget.port}`
    );

    server = spawn(
      appBin("next"),
      ["start", "--hostname", "127.0.0.1", "--port", smokeTarget.port],
      {
        cwd: developerRoot,
        env: {
          ...process.env,
          AFENDA_DEVELOPER_SANDBOX: "true",
          NODE_ENV: "production",
        },
        shell: isWindows,
        stdio: "inherit",
      }
    );

    await waitForDeveloperLabReady(smokeTarget.baseUrl);
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
          PLAYWRIGHT_BASE_URL: smokeTarget.baseUrl,
          PLAYWRIGHT_SKIP_WEBSERVER: "1",
        },
      }
    );
  } finally {
    if (server) {
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
