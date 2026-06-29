#!/usr/bin/env node
/**
 * Non-interactive package scaffold — replaces `turbo gen workspace --copy`
 * (interactive prompts break agent/automation flows).
 */
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveRepoRoot } from "./env-utils.mjs";
import { BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS } from "./governance/business-master-data-scaffold-dirs.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = existsSync(join(dirname(SCRIPT_DIR), "pnpm-workspace.yaml"))
  ? dirname(SCRIPT_DIR)
  : resolveRepoRoot();
const TEMPLATE_ROOT = join(REPO_ROOT, "templates", "package-scaffold");

const VARIANTS = new Set(["platform-zero-deps", "foundation-with-kernel"]);
const FORBIDDEN_PACKAGE_DIRS = new Set(
  BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS
);

const DOTENV_VERSION = "^17.4.2";
const BACKSLASH_RE = /\\/g;
const TRAILING_SLASH_RE = /\/+$/;
const LEADING_EDGE_RE = /^[_-]+/;
const NON_ALNUM_UNDERSCORE_RE = /[^a-zA-Z0-9]+/g;
const TRIM_UNDERSCORE_RE = /^_+|_+$/g;
const NON_ALNUM_HYPHEN_RE = /[^a-z0-9-]+/g;
const TRIM_HYPHEN_RE = /^-+|-+$/g;

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
    verify: false,
    keepOnFailure: false,
    allowInternalName: false,
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

  if (arg === "--verify") {
    options.verify = true;
    return { indexDelta: 0 };
  }

  if (arg === "--keep-on-failure") {
    options.keepOnFailure = true;
    return { indexDelta: 0 };
  }

  if (arg === "--allow-internal-name") {
    options.allowInternalName = true;
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

  if (options.verify && options.dryRun) {
    throw new Error("--verify cannot be combined with --dry-run");
  }

  return options;
}

function printHelp() {
  process.stdout.write(`Usage: pnpm scaffold:package -- [options]

Create a new @afenda package skeleton from templates (non-interactive).

Options:
  --name <@afenda/pkg>          Required scoped package name (no leading _ unless --allow-internal-name)
  --dir <packages/foo>          Destination (default: packages/<scope-name>)
  --variant <name>              platform-zero-deps | foundation-with-kernel
                                (default: platform-zero-deps)
  --description <text>          package.json description (required with --pas)
  --pas <PAS-NNN-*.md>          PAS tombstone filename (required for real packages; placeholder if omitted)
  --with-env-scripts            Add scripts/load-env.ts, tsconfig.scripts.json, typecheck:scripts, dotenv
  --env-sync-target             Print checklist to add packages/<dir>/.env to env:sync
  --verify                      Scaffold to temp package, pnpm install + typecheck + test:run, then remove
  --keep-on-failure             With --verify: keep temp package when verification fails
  --allow-internal-name         Allow package names starting with _ (smoke/tests only)
  --dry-run                     Show planned writes without creating files
  --help                        Show this help text

Examples:
  pnpm scaffold:package -- --name @afenda/css-authority --variant platform-zero-deps \\
    --pas PAS-005-CSS-AUTHORITY-STANDARD.md --description "CSS token authority (PAS-005)"

  pnpm scaffold:package -- --verify --variant foundation-with-kernel

Env integration:
  - Vitest: monorepo env loads automatically via @afenda/testing setup (no package action).
  - Standalone scripts: pass --with-env-scripts; call loadPackageScriptEnv() before process.env.
  - CLI packages that need their own synced .env: pass --env-sync-target and follow checklist.

After scaffold (run in order):
  1. pnpm install          ← required before typecheck/test (workspace link)
  2. pnpm --filter <name> typecheck
  3. pnpm --filter <name> test:run
  4. pnpm check:business-master-data-scaffold
  Delegate registry rows to foundation-registry-owner.
  If env-sync-target: edit scripts/env-utils.mjs LOCAL_SYNC_TARGETS, then pnpm env:console refresh.

Do not use turbo gen workspace --copy — interactive prompts conflict with agent workflows.
`);
}

function toScreamingSnake(value) {
  return value
    .replace(LEADING_EDGE_RE, "")
    .replace(NON_ALNUM_UNDERSCORE_RE, "_")
    .replace(TRIM_UNDERSCORE_RE, "")
    .toUpperCase();
}

function toPasDocSlug(shortName) {
  return shortName
    .replace(LEADING_EDGE_RE, "")
    .toLowerCase()
    .replace(NON_ALNUM_HYPHEN_RE, "-")
    .replace(TRIM_HYPHEN_RE, "");
}

function resolvePasDoc(options, shortName) {
  if (options.pas) {
    return options.pas.endsWith(".md") ? options.pas : `${options.pas}.md`;
  }

  const slug = toPasDocSlug(shortName) || "package-authority";
  return `PAS-NNN-${slug}-STANDARD.md`;
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

function validateOptions(options) {
  if (!options.name?.startsWith("@afenda/")) {
    throw new Error("--name must be scoped as @afenda/<package-name>");
  }

  const shortName = options.name.slice("@afenda/".length);

  if (shortName.startsWith("_") && !options.allowInternalName) {
    throw new Error(
      `Package name "${options.name}" starts with _ — use --allow-internal-name for smoke/tests only`
    );
  }

  if (!toScreamingSnake(shortName)) {
    throw new Error(
      `--name must yield a non-empty identifier after normalizing "${shortName}"`
    );
  }

  const packageDir = resolvePackageDir(options.name, options.dir);

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

  if (
    options.pas &&
    !options.verify &&
    !options.dryRun &&
    !options.description?.trim()
  ) {
    throw new Error(
      "--description is required when --pas is set (golden-path catalog completeness)"
    );
  }

  if (existsSync(join(REPO_ROOT, packageDir))) {
    throw new Error(`Destination already exists: ${packageDir}`);
  }

  return { shortName, packageDir };
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

async function patchPackageJson(packageDir, options, dryRun) {
  if (!options.withEnvScripts) {
    return;
  }

  const relPath = `${packageDir}/package.json`;

  if (dryRun) {
    process.stdout.write(
      `  would patch ${relPath} (dotenv, typecheck:scripts, tsconfig.scripts.json)\n`
    );
    return;
  }

  const packageJsonPath = join(REPO_ROOT, packageDir, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  packageJson.scripts = packageJson.scripts ?? {};
  packageJson.scripts["typecheck:scripts"] =
    "tsc -p tsconfig.scripts.json --noEmit";
  packageJson.scripts.typecheck =
    "tsc -b --pretty false && tsc -p tsconfig.vitest.json --noEmit && pnpm typecheck:scripts";
  packageJson.devDependencies = packageJson.devDependencies ?? {};
  packageJson.devDependencies.dotenv = DOTENV_VERSION;
  await writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8"
  );
  process.stdout.write(`  updated ${relPath} (env scripts + dotenv)\n`);
}

function printChecklist(options, packageDir) {
  process.stdout.write("\nPost-scaffold checklist (run in order):\n");
  process.stdout.write(
    "  [ ] 1. pnpm install  ← required before typecheck/test (workspace linking)\n"
  );
  process.stdout.write(`  [ ] 2. pnpm --filter ${options.name} typecheck\n`);
  if (options.withEnvScripts) {
    process.stdout.write(
      `  [ ]    (includes pnpm --filter ${options.name} typecheck:scripts)\n`
    );
  }
  process.stdout.write(`  [ ] 3. pnpm --filter ${options.name} test:run\n`);
  process.stdout.write("  [ ] 4. pnpm check:business-master-data-scaffold\n");
  process.stdout.write(
    "  [ ] 5. Register package in packages/architecture-authority/src/data/package-registry.data.ts (foundation-registry-owner)\n"
  );
  process.stdout.write(
    "  [ ] 6. Delegate registry rows to foundation-registry-owner (disposition + golden-path)\n"
  );
  process.stdout.write(
    "  [ ] 7. Author PAS delivery doc under docs/PAS/ (if not exists)\n"
  );
  process.stdout.write(
    "  [ ] 8. pnpm check:architecture-golden-path-scaffold\n"
  );

  if (!options.pas) {
    process.stdout.write(
      "  [ ] Replace placeholder PAS tombstone — pass --pas PAS-NNN-…-STANDARD.md for real packages\n"
    );
  }

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
      "  [ ] Env loads from repo + packages/database/.env — add --env-sync-target if CLI needs package-local .env\n"
    );
  }

  process.stdout.write(
    "\nVitest loads monorepo env via packages/testing/src/setup/load-monorepo-env.ts.\n"
  );
}

async function scaffold(options) {
  const { shortName, packageDir } = validateOptions(options);

  if (!(options.pas || options.dryRun || options.verify)) {
    process.stderr.write(
      "Warning: no --pas provided; using placeholder tombstone. Pass --pas PAS-NNN-<slug>-STANDARD.md for real packages.\n"
    );
  }

  const fingerprintPrefix = toScreamingSnake(shortName);
  const fingerprintConst = `${fingerprintPrefix}_AUTHORITY_FINGERPRINT`;
  const versionConst = `${fingerprintPrefix}_PACKAGE_VERSION`;
  const fingerprintValue = `${fingerprintPrefix}-${new Date().toISOString().slice(0, 10)}-v1`;
  const pasDoc = resolvePasDoc(options, shortName);

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

  await copyTemplate(
    "shared/PAS-TOMBSTONE.md",
    `${packageDir}/${pasDoc}`,
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
    await copyTemplate(
      "shared/tsconfig.scripts.json",
      `${packageDir}/tsconfig.scripts.json`,
      tokens,
      options.dryRun
    );
  }

  await patchPackageJson(packageDir, options, options.dryRun);
  printChecklist(options, packageDir);

  return packageDir;
}

function runPnpm(args, label) {
  process.stdout.write(`\n→ ${label}\n`);
  const result = spawnSync("pnpm", args, {
    cwd: REPO_ROOT,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    throw new Error(`${label} failed (exit ${result.status ?? "unknown"})`);
  }
}

async function verifyScaffold(options) {
  const verifyId = randomUUID().slice(0, 8);
  const verifyName = options.name ?? `@afenda/scaffold-verify-${verifyId}`;
  const verifyOptions = {
    ...options,
    name: verifyName,
    dir: options.dir ?? `packages/scaffold-verify-${verifyId}`,
    dryRun: false,
    allowInternalName: options.allowInternalName || verifyName.includes("_"),
  };

  process.stdout.write(
    `\nVerify mode: scaffolding ${verifyName} → ${verifyOptions.dir}\n`
  );

  const targetDir = verifyOptions.dir;
  let scaffolded = false;

  try {
    await scaffold(verifyOptions);
    scaffolded = true;
    runPnpm(
      ["install"],
      "pnpm install (workspace link — required before gates)"
    );
    runPnpm(
      ["--filter", verifyName, "typecheck"],
      `pnpm --filter ${verifyName} typecheck`
    );
    runPnpm(
      ["--filter", verifyName, "test:run"],
      `pnpm --filter ${verifyName} test:run`
    );
    process.stdout.write("\nVerify passed — removing temporary package.\n");
  } catch (error) {
    process.stderr.write(
      `\nVerify failed: ${error instanceof Error ? error.message : error}\n`
    );
    if (options.keepOnFailure && scaffolded) {
      process.stderr.write(`Temporary package kept at ${targetDir}\n`);
    } else if (scaffolded && existsSync(join(REPO_ROOT, targetDir))) {
      await rm(join(REPO_ROOT, targetDir), { recursive: true, force: true });
      process.stderr.write(`Removed temporary package ${targetDir}\n`);
    }
    throw error;
  }

  if (existsSync(join(REPO_ROOT, targetDir))) {
    await rm(join(REPO_ROOT, targetDir), { recursive: true, force: true });
    process.stdout.write(`Removed temporary package ${targetDir}\n`);
  }
}

async function main() {
  let options;

  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : error}\n`);
    process.stderr.write("Run with --help for usage.\n");
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    printHelp();
    return;
  }

  if (options.verify) {
    try {
      await verifyScaffold(options);
    } catch {
      process.exitCode = 1;
    }
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
