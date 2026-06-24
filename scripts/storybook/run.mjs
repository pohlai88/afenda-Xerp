import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = join(scriptDir, "../..");

const HELP = `Afenda Storybook CLI

Usage:
  pnpm storybook              Start dev server (port 6006) after codegen
  pnpm storybook dev          Same as above
  pnpm storybook generate     Run Storybook codegen (docs CSS sync, etc.)
  pnpm storybook build        Production Storybook build after codegen

Legacy aliases: pnpm storybook:ui, pnpm storybook:build
`;

function runPnpm(args) {
  const result = spawnSync("pnpm", args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runGenerate() {
  const result = spawnSync(
    process.execPath,
    [join(scriptDir, "generate.mjs")],
    {
      cwd: root,
      stdio: "inherit",
    }
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const command = process.argv[2] ?? "dev";

switch (command) {
  case "dev":
    runPnpm(["--filter", "@afenda/storybook", "storybook"]);
    break;
  case "generate":
    runGenerate();
    break;
  case "build":
    runPnpm(["--filter", "@afenda/storybook", "storybook:build"]);
    break;
  case "help":
  case "--help":
  case "-h":
    console.log(HELP);
    break;
  default:
    console.error(`Unknown storybook command: ${command}\n`);
    console.error(HELP);
    process.exit(1);
}
