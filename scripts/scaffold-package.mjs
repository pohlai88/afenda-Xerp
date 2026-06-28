#!/usr/bin/env node
/**
 * Non-interactive package scaffold — replaces `turbo gen workspace --copy`
 * (interactive prompts break agent/automation flows).
 */
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveRepoRoot } from "./env-utils.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = existsSync(join(dirname(SCRIPT_DIR), "pnpm-workspace.yaml"))
  ? dirname(SCRIPT_DIR)
  : resolveRepoRoot();
const TEMPLATE_ROOT = join(REPO_ROOT, "templates", "package-scaffold");

const VARIANTS = new Set(["platform-zero-deps", "foundation-with-kernel"]);

/** Keep in sync with business-master-data-scaffold.policy.ts */
const FORBIDDEN_PACKAGE_DIRS = new Set([
  "packages/crm",
  "packages/inventory",
  "packages/hrm",
  "packages/procurement",
]);

const DOTENV_VERSION = "^17.4.2";
const BACKSLASH_RE = /\\/g;
const TRAILING_SLASH_RE = /\/+$/;

function createDefaultOptions() {
  return {
    name: null,
    dir: null,
    variant: "platform-zero-deps",
    description: "",
    pas: null,
    withEnvScripts: false,
    envSyncTarget: false,
    dryRun: false,
    help: false,
  };
}

function readFlagValue(arg, argv, index, flag) {
  if (arg.startsWith(`${flag}=`)) {
    return { value: arg.slice(flag.length + 1), indexDelta: 0 };
  }

  return { value: argv[index + 1] ?? null, indexDelta: 1 };
}

function applyValueFlag(options, arg, argv, index, flag, field) {
  const { value, indexDelta } = readFlagValue(arg, argv, index, flag);
  options[field] = value;
  return indexDelta;
}

const VALUE_FLAG_FIELDS = {
  "--name": "name",
  "--dir": "dir",
  "--variant": "variant",
  "--description": "description",
  "--pas": "pas",
};

function parseSingleArg(options, arg, argv, index) {
  if (arg === "--") {
    return { indexDelta: 0 };
  }

  if (arg === "--help" || arg === "-h") {
    options.help = true;
    return { indexDelta: 0 };
  }

  if (arg === "--dry-run") {
    options.dryRun = true;
    return { indexDelta: 0 };
  }

  if (arg === "--with-env-scripts") {
    options.withEnvScripts = true;
    return { indexDelta: 0 };
  }

  if (arg === "--env-sync-target") {
    options.envSyncTarget = true;
    return { indexDelta: 0 };
  }

  for (const [flag, field] of Object.entries(VALUE_FLAG_FIELDS)) {
    if (arg === flag || arg.startsWith(`${flag}=`)) {
      const indexDelta = applyValueFlag(options, arg, argv, index, flag, field);
      if (field === "description" && options.description === null) {
        options.description = "";
      }
      return { indexDelta };
    }
  }

  process.stderr.write(`Unknown argument: ${arg}\n`);
  options.help = true;
  return { indexDelta: 0, stop: true };
}

function parseArgs(argv) {
  const options = createDefaultOptions();

  for (let index = 0; index < argv.length; index += 1) {
    const { indexDelta, stop } = parseSingleArg(
      options,
      argv[index],
      argv,
      index
    );
    index += indexDelta;
    if (stop) {
      break;
    }
  }

  return options;
}

function printHelp() {
  process.stdout.write(`Usage: pnpm scaffold:package -- [options]

Create a new @afenda package skeleton from templates (non-interactive).

Options:
  --name <@afenda/pkg>          Required scoped package name
  --dir <packages/foo>          Destination (default: packages/<scope-name>)
  --variant <name>              platform-zero-deps | foundation-with-kernel
                                (default: platform-zero-deps)
  --description <text>          package.json description
  --pas <PAS-NNN-*.md>          PAS tombstone filename (optional)
  --with-env-scripts            Add scripts/load-env.ts + dotenv devDependency
  --env-sync-target             Print checklist to add packages/<dir>/.env to env:sync
  --dry-run                     Show planned writes without creating files
  --help                        Show this help text

Examples:
  pnpm scaffold:package -- --name @afenda/css-authority --variant platform-zero-deps \\
    --pas PAS-005-CSS-AUTHORITY-STANDARD.md --description "CSS token authority (PAS-005)"

  pnpm scaffold:package -- --name @afenda/foo-authority --variant foundation-with-kernel \\
    --with-env-scripts --env-sync-target

Env integration:
  - Vitest: monorepo env loads automatically via @afenda/testing setup (no package action).
  - Standalone scripts: pass --with-env-scripts; call loadPackageScriptEnv() before process.env.
  - CLI packages that need their own synced .env: pass --env-sync-target and follow checklist.

After scaffold:
  pnpm install
  pnpm --filter <name> typecheck
  pnpm --filter <name> test:run
  pnpm check:business-master-data-scaffold
  Delegate registry rows to foundation-registry-owner.
  If env-sync-target: edit scripts/env-utils.mjs LOCAL_SYNC_TARGETS, then pnpm env:console refresh.

Do not use turbo gen workspace --copy — interactive prompts conflict with agent workflows.
`);
}

function toScreamingSnake(value) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

function substitute(content, tokens) {
  let result = content;

  for (const [key, value] of Object.entries(tokens)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }

  return result;
}

function resolvePackageDir(name, explicitDir) {
  if (explicitDir) {
    return explicitDir
      .replace(BACKSLASH_RE, "/")
      .replace(TRAILING_SLASH_RE, "");
  }

  if (!name?.startsWith("@afenda/")) {
    return null;
  }

  const shortName = name.slice("@afenda/".length);
  return `packages/${shortName}`;
}

async function copyTemplate(relativePath, destination, tokens, dryRun) {
  const sourcePath = join(TEMPLATE_ROOT, relativePath);
  const targetPath = join(REPO_ROOT, destination);

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing template: ${relativePath}`);
  }

  const content = substitute(readFileSync(sourcePath, "utf8"), tokens);

  if (dryRun) {
    process.stdout.write(`  would write ${destination}\n`);
    return;
  }

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, content, "utf8");
  process.stdout.write(`  wrote ${destination}\n`);
}

async function scaffold(options) {
  const packageDir = resolvePackageDir(options.name, options.dir);

  if (!options.name?.startsWith("@afenda/")) {
    throw new Error("--name must be scoped as @afenda/<package-name>");
  }

  if (!packageDir?.startsWith("packages/")) {
    throw new Error("--dir must live under packages/");
  }

  if (!VARIANTS.has(options.variant)) {
    throw new Error(`--variant must be one of: ${[...VARIANTS].join(", ")}`);
  }

  if (FORBIDDEN_PACKAGE_DIRS.has(packageDir)) {
    throw new Error(
      `${packageDir} is blocked by business-master-data-scaffold policy`
    );
  }

  const absoluteDestination = join(REPO_ROOT, packageDir);

  if (existsSync(absoluteDestination)) {
    throw new Error(`Destination already exists: ${packageDir}`);
  }

  const shortName = options.name.slice("@afenda/".length);
  const fingerprintConst = `${toScreamingSnake(shortName)}_AUTHORITY_FINGERPRINT`;
  const versionConst = `${toScreamingSnake(shortName)}_PACKAGE_VERSION`;
  const fingerprintValue = `${toScreamingSnake(shortName)}-${new Date().toISOString().slice(0, 10)}-v1`;
  const pasDoc =
    options.pas ?? `PAS-NNN-${toScreamingSnake(shortName)}-STANDARD.md`;

  const tokens = {
    PACKAGE_NAME: options.name,
    DESCRIPTION:
      options.description ||
      `${shortName} package authority — update description after PAS charter`,
    FINGERPRINT_CONST: fingerprintConst,
    VERSION_CONST: versionConst,
    FINGERPRINT_VALUE: fingerprintValue,
    PAS_DOC: pasDoc,
  };

  process.stdout.write(
    `\nScaffolding ${options.name} → ${packageDir} (${options.variant})\n`
  );

  await copyTemplate(
    `${options.variant}/package.json`,
    `${packageDir}/package.json`,
    tokens,
    options.dryRun
  );

  const tsconfigTemplate =
    options.variant === "foundation-with-kernel"
      ? `${options.variant}/tsconfig.json`
      : "shared/tsconfig.json";

  await copyTemplate(
    tsconfigTemplate,
    `${packageDir}/tsconfig.json`,
    tokens,
    options.dryRun
  );

  await copyTemplate(
    "shared/tsconfig.vitest.json",
    `${packageDir}/tsconfig.vitest.json`,
    tokens,
    options.dryRun
  );

  await copyTemplate(
    "shared/vitest.config.ts",
    `${packageDir}/vitest.config.ts`,
    tokens,
    options.dryRun
  );

  await copyTemplate(
    "shared/src/index.ts",
    `${packageDir}/src/index.ts`,
    tokens,
    options.dryRun
  );

  await copyTemplate(
    `${options.variant}/src/__tests__/architecture-boundary.test.ts`,
    `${packageDir}/src/__tests__/architecture-boundary.test.ts`,
    tokens,
    options.dryRun
  );

  const tombstoneName = pasDoc.endsWith(".md") ? pasDoc : `${pasDoc}.md`;
  await copyTemplate(
    "shared/PAS-TOMBSTONE.md",
    `${packageDir}/${tombstoneName}`,
    tokens,
    options.dryRun
  );

  if (options.withEnvScripts) {
    await copyTemplate(
      "shared/scripts/load-env.ts",
      `${packageDir}/scripts/load-env.ts`,
      tokens,
      options.dryRun
    );

    if (options.dryRun) {
      process.stdout.write(
        `  would add dotenv devDependency to ${packageDir}/package.json\n`
      );
    } else {
      const packageJsonPath = join(REPO_ROOT, packageDir, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      packageJson.devDependencies = packageJson.devDependencies ?? {};
      packageJson.devDependencies.dotenv = DOTENV_VERSION;
      await writeFile(
        packageJsonPath,
        `${JSON.stringify(packageJson, null, 2)}\n`,
        "utf8"
      );
      process.stdout.write(
        `  updated ${packageDir}/package.json (dotenv devDependency)\n`
      );
    }
  }

  process.stdout.write("\nPost-scaffold checklist:\n");
  process.stdout.write("  [ ] pnpm install\n");
  process.stdout.write(`  [ ] pnpm --filter ${options.name} typecheck\n`);
  process.stdout.write(`  [ ] pnpm --filter ${options.name} test:run\n`);
  process.stdout.write("  [ ] pnpm check:business-master-data-scaffold\n");
  process.stdout.write(
    "  [ ] Delegate registry rows to foundation-registry-owner\n"
  );
  process.stdout.write(
    "  [ ] Author PAS delivery doc under docs/PAS/ (if not exists)\n"
  );

  if (options.withEnvScripts) {
    process.stdout.write(
      "  [ ] Import loadPackageScriptEnv() at top of standalone tsx scripts\n"
    );
  }

  if (options.envSyncTarget) {
    process.stdout.write(
      `  [ ] Add "${packageDir}/.env" to LOCAL_SYNC_TARGETS in scripts/env-utils.mjs\n`
    );
    process.stdout.write("  [ ] Run pnpm env:console refresh\n");
    process.stdout.write(
      "  [ ] Document new vars in .env.example (.env.config / .env.secret)\n"
    );
  } else if (options.withEnvScripts) {
    process.stdout.write(
      "  [ ] Env loads from repo + packages/database/.env — no new sync target unless CLI needs package-local .env\n"
    );
  }

  process.stdout.write(
    "\nVitest already loads monorepo env via packages/testing/src/setup/load-monorepo-env.ts.\n"
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (!options.name) {
    process.stderr.write(
      "Missing required option: --name @afenda/<package-name>\n"
    );
    process.stderr.write("Run with --help for usage.\n");
    process.exitCode = 1;
    return;
  }

  try {
    await scaffold(options);
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.stderr.write("Run with --help for usage.\n");
    process.exitCode = 1;
  }
}

await main();
