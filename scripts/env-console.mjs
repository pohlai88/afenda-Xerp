#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";

import {
  loadMergedEnv,
  planVercelPush,
  probeMigrationUrlFromMerged,
  resolveRepoRoot,
  SOURCE_FILES,
} from "./env-utils.mjs";

const REPO_ROOT = resolveRepoRoot();
const LINE_SPLIT_REGEX = /\r?\n/u;

const MENU_ITEMS = [
  {
    key: "1",
    flow: "refresh",
    label: "Refresh local env (sync + doctor + probe)",
  },
  { key: "2", flow: "check", label: "Validate only (sync --check + doctor)" },
  { key: "3", flow: "probe", label: "Probe database / migration URL" },
  { key: "4", flow: "verify-db", label: "Verify DB + live RLS gate" },
  { key: "5", flow: "push preview", label: "Push to Vercel (preview)" },
  { key: "6", flow: "push production", label: "Push to Vercel (production)" },
  { key: "7", flow: "bootstrap", label: "Bootstrap checklist (new machine)" },
];

function printHelp() {
  process.stdout.write(`Usage: pnpm env:console [command] [options]

Human-facing env orchestrator. Low-level primitives remain env:sync and env:doctor.

Commands:
  (default)       Interactive menu
  refresh         sync → doctor → migration URL probe
  check           sync --check → doctor
  probe           Migration URL probe (no writes)
  verify-db       probe → check:database-tenant-rls-live
  bootstrap       Source checklist → sync → doctor → probe → next steps
  push preview    Plan → confirm → sync --vercel preview
  push production Plan → confirm → sync --overlay production --vercel production

Options:
  --strict        Fail when probe or live RLS gate skips/fails
  --yes           Skip confirmation prompts (push flows only)
  --help          Show this help text

Examples:
  pnpm env:console
  pnpm env:console refresh
  pnpm env:console check
  pnpm env:console push production
  pnpm env:console verify-db --strict

Do not use vercel env pull on generated .env.local — edit .env.config / .env.secret, then refresh.
`);
}

function parseArgs(argv) {
  const options = {
    command: null,
    strict: false,
    yes: false,
    help: false,
  };

  const positional = [];

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--strict") {
      options.strict = true;
      continue;
    }

    if (arg === "--yes") {
      options.yes = true;
      continue;
    }

    positional.push(arg);
  }

  if (positional[0] === "help" || positional[0] === "--help") {
    options.help = true;
  } else if (positional[0] === "push" && positional[1]) {
    options.command = `push ${positional[1]}`;
  } else if (positional.length > 0) {
    options.command = positional[0];
  }

  return options;
}

function printSection(title) {
  process.stdout.write(
    `\n── ${title} ${"─".repeat(Math.max(0, 54 - title.length))}\n`
  );
}

function printStepResult(label, ok, detail = "") {
  const mark = ok ? "✓" : "✗";
  process.stdout.write(`  ${mark} ${label}${detail ? `: ${detail}` : ""}\n`);
}

function runNodeScript(relativePath, args = []) {
  return spawnSync(process.execPath, [join(REPO_ROOT, relativePath), ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    env: process.env,
  });
}

function runPnpmScript(script, args = []) {
  const npmExecPath = process.env.npm_execpath;

  if (!npmExecPath) {
    return spawnSync("pnpm", [script, ...args], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: process.env,
      shell: process.platform === "win32",
    });
  }

  return spawnSync(
    process.execPath,
    [npmExecPath, "run", script, ...(args.length > 0 ? ["--", ...args] : [])],
    {
      cwd: REPO_ROOT,
      encoding: "utf8",
      env: process.env,
    }
  );
}

function runPnpmFilterDatabase(args) {
  return spawnSync("pnpm", ["--filter", "@afenda/database", ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    env: process.env,
    shell: process.platform === "win32",
  });
}

function emitCapturedOutput(result) {
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }

  if (result.stderr) {
    process.stderr.write(result.stderr);
  }
}

function runStep(label, runner) {
  printSection(label);
  const result = runner();
  emitCapturedOutput(result);
  const ok = result.status === 0;
  printStepResult(label, ok);
  return { ok, result };
}

function loadLocalMergedEnv(overlay = "local") {
  const overlays = [`.env.config.${overlay}`].filter((relativePath) =>
    existsSync(join(REPO_ROOT, relativePath))
  );

  return loadMergedEnv(REPO_ROOT, { overlays });
}

function extractLastJsonObject(text) {
  if (!text) {
    return null;
  }

  for (const line of text.trim().split(LINE_SPLIT_REGEX).reverse()) {
    const trimmed = line.trim();

    if (trimmed.startsWith("{")) {
      return JSON.parse(trimmed);
    }
  }

  return null;
}

function runMigrationProbe(options) {
  const merged = loadLocalMergedEnv();
  const artifactProbe = probeMigrationUrlFromMerged(merged.entries);

  printSection("Migration URL probe (sources)");

  if (artifactProbe.resolvable) {
    printStepResult(
      "Sources can derive migration URL",
      true,
      artifactProbe.method
    );
  } else {
    printStepResult(
      "Sources can derive migration URL",
      false,
      artifactProbe.hint
    );
  }

  const hints = runPnpmFilterDatabase(["db:url-hints"]);
  const parsed = extractLastJsonObject(hints.stdout);

  if (parsed) {
    printStepResult(
      "Runtime migration URL",
      Boolean(parsed.databaseConfigured),
      parsed.migrationUrlHost
        ? `${parsed.migrationUrlHost}:${parsed.port ?? "5432"}`
        : "unavailable — run env:console refresh after editing sources"
    );
  } else if (hints.status !== 0) {
    emitCapturedOutput(hints);
  }

  const ok =
    artifactProbe.resolvable &&
    hints.status === 0 &&
    parsed?.databaseConfigured === true;

  if (!ok && options.strict) {
    return { ok: false };
  }

  return { ok: options.strict ? ok : true };
}

async function confirmPush(environment, plan, options) {
  printSection(`Vercel push plan (${environment})`);
  process.stdout.write(`  Push ${plan.push.length} key(s)\n`);
  process.stdout.write(
    `  Skip ${plan.skip.length} key(s) (empty, local-only, vercel-managed)\n`
  );

  if (plan.push.length > 0) {
    process.stdout.write(
      `  Sample: ${plan.push.slice(0, 8).join(", ")}${plan.push.length > 8 ? "…" : ""}\n`
    );
  }

  if (options.yes) {
    return true;
  }

  const rl = createInterface({ input, output });
  const answer = await rl.question(
    `\nPush ${plan.push.length} key(s) to Vercel ${environment}? [y/N] `
  );
  await rl.close();

  return answer.trim().toLowerCase() === "y";
}

async function runPush(environment, options) {
  const overlay = environment === "production" ? "production" : "local";
  const merged = loadLocalMergedEnv(overlay);
  const plan = planVercelPush(merged);

  if (plan.push.length === 0) {
    process.stderr.write("Nothing to push — all keys skipped or empty.\n");
    return 1;
  }

  const confirmed = await confirmPush(environment, plan, options);

  if (!confirmed) {
    process.stdout.write("Push cancelled.\n");
    return 0;
  }

  const syncArgs =
    environment === "production"
      ? ["--overlay", "production", "--vercel", "--environment", "production"]
      : ["--vercel", "--environment", "preview"];

  const sync = runStep("env:sync (Vercel push)", () =>
    runNodeScript("scripts/sync-env.mjs", syncArgs)
  );

  return sync.ok ? 0 : 1;
}

function assertSourcesExist() {
  const missing = Object.values(SOURCE_FILES).filter(
    (relativePath) => !existsSync(join(REPO_ROOT, relativePath))
  );

  if (missing.length > 0) {
    process.stderr.write(
      `Missing source file(s): ${missing.join(", ")}\nCopy .env.example → ${SOURCE_FILES.config} + ${SOURCE_FILES.secret}, then re-run.\n`
    );
    return false;
  }

  return true;
}

function printBootstrapNextSteps() {
  process.stdout.write(`
Next steps:
  pnpm migrate
  pnpm db:bootstrap:local
  pnpm auth:bootstrap:dev
  pnpm dev

Do not run vercel env pull on .env.local — this repo uses .env.config + .env.secret → pnpm env:console refresh.
`);
}

function summarizeSteps(steps) {
  printSection("Summary");

  for (const step of steps) {
    if (!step.ok) {
      process.stderr.write("\nenv:console failed.\n");
      return 1;
    }
  }

  process.stdout.write("\nenv:console complete.\n");
  return 0;
}

function runRefreshFlow(options) {
  if (!assertSourcesExist()) {
    return 1;
  }

  const steps = [
    runStep("env:sync", () => runNodeScript("scripts/sync-env.mjs")),
    runStep("env:doctor", () => runNodeScript("scripts/env-doctor.mjs")),
    runMigrationProbe(options),
  ];

  return summarizeSteps(steps);
}

function runCheckFlow() {
  if (!assertSourcesExist()) {
    return 1;
  }

  return summarizeSteps([
    runStep("env:sync --check", () =>
      runNodeScript("scripts/sync-env.mjs", ["--check"])
    ),
    runStep("env:doctor", () => runNodeScript("scripts/env-doctor.mjs")),
  ]);
}

function runVerifyDbFlow(options) {
  if (!assertSourcesExist()) {
    return 1;
  }

  const probe = runMigrationProbe(options);

  if (!probe.ok) {
    return 1;
  }

  const live = runStep("check:database-tenant-rls-live", () =>
    runPnpmScript("check:database-tenant-rls-live")
  );

  if (!live.ok) {
    return 1;
  }

  const skipped =
    live.result.stdout?.includes("live gate skipped") ||
    live.result.stdout?.includes("skipped:");

  if (skipped && options.strict) {
    process.stderr.write("Live RLS gate skipped under --strict.\n");
    return 1;
  }

  return 0;
}

function runBootstrapFlow() {
  process.stdout.write(`
Afenda env bootstrap
────────────────────
Edit human-managed sources only:
  - ${SOURCE_FILES.config}
  - ${SOURCE_FILES.secret}
Optional: .env.config.local

Never edit generated targets (.env, .env.local, apps/*/ .env.local, packages/database/.env).
`);

  if (!assertSourcesExist()) {
    return 1;
  }

  const steps = [
    runStep("env:sync", () => runNodeScript("scripts/sync-env.mjs")),
    runStep("env:doctor", () => runNodeScript("scripts/env-doctor.mjs")),
  ];
  const failed = summarizeSteps(steps);

  if (failed !== 0) {
    return failed;
  }

  runMigrationProbe({ strict: false });
  printBootstrapNextSteps();
  return 0;
}

function dispatchPushFlow(command, options) {
  const environment = command.slice("push ".length).trim();

  if (environment !== "preview" && environment !== "production") {
    process.stderr.write(
      `Unknown push target "${environment}". Use preview or production.\n`
    );
    return 1;
  }

  if (!assertSourcesExist()) {
    return 1;
  }

  return runPush(environment, options);
}

function runFlow(command, options) {
  switch (command) {
    case "refresh":
      return runRefreshFlow(options);
    case "check":
      return runCheckFlow();
    case "probe": {
      if (!assertSourcesExist()) {
        return 1;
      }

      const probe = runMigrationProbe(options);
      return probe.ok ? 0 : 1;
    }
    case "verify-db":
      return runVerifyDbFlow(options);
    case "bootstrap":
      return runBootstrapFlow();
    case "push":
      process.stderr.write("Use: pnpm env:console push preview|production\n");
      return 1;
    default: {
      if (command?.startsWith("push ")) {
        return dispatchPushFlow(command, options);
      }

      process.stderr.write(`Unknown command: ${command}\n`);
      printHelp();
      return 1;
    }
  }
}

async function runInteractiveMenu(options) {
  process.stdout.write(`
Afenda env console
──────────────────
  Human sources: ${SOURCE_FILES.config} + ${SOURCE_FILES.secret}
  Generated targets: sync via refresh — do not edit directly
  Avoid: vercel env pull → .env.local (overwrites generated files)

`);

  for (const item of MENU_ITEMS) {
    process.stdout.write(`  ${item.key}  ${item.label}\n`);
  }

  process.stdout.write("  q  Quit\n");

  const rl = createInterface({ input, output });
  const choice = (await rl.question("\nSelect [1]: ")).trim() || "1";
  await rl.close();

  if (choice.toLowerCase() === "q") {
    return 0;
  }

  const item = MENU_ITEMS.find((entry) => entry.key === choice);

  if (!item) {
    process.stderr.write(`Invalid choice: ${choice}\n`);
    return 1;
  }

  return runFlow(item.flow, options);
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return Promise.resolve(0);
  }

  if (!options.command) {
    return runInteractiveMenu(options);
  }

  return Promise.resolve(runFlow(options.command, options));
}

main()
  .then((code) => {
    process.exit(code);
  })
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  });
