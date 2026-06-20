import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
  loadAiGovernance,
  loadArchitectureAuthority,
  workspaceRoot,
} from "../ai/shared.mjs";

const args = process.argv.slice(2);
const scopeFlagIndex = args.indexOf("--scope");
const scopePath = scopeFlagIndex >= 0 ? args[scopeFlagIndex + 1] : undefined;
const mode = scopePath ? "scope" : "baseline";

const [aiGovernance, architectureAuthority] = await Promise.all([
  loadAiGovernance(),
  loadArchitectureAuthority(),
]);

const workspaces = architectureAuthority.discoverWorkspaces(workspaceRoot);
const packageExports = buildPackageExports(workspaces);

let scopeManifest = null;
let changedFiles = [];
let deletedFiles = [];
let addedFiles = [];
let changedLines = [];
const sourceFilesByPath = new Map();

if (mode === "scope") {
  if (!scopePath) {
    console.error("AI governance scope mode requires --scope <path>");
    process.exitCode = 1;
    process.exit(1);
  }

  const absoluteScopePath = resolve(workspaceRoot, scopePath);

  if (!existsSync(absoluteScopePath)) {
    console.error(`scope manifest missing: ${scopePath}`);
    process.exitCode = 1;
    process.exit(1);
  }

  scopeManifest = JSON.parse(readFileSync(absoluteScopePath, "utf8"));
  const diff = collectGitDiff();

  changedFiles = diff.changedFiles;
  deletedFiles = diff.deletedFiles;
  addedFiles = diff.addedFiles;
  changedLines = diff.changedLines;

  for (const filePath of changedFiles) {
    const absolutePath = join(workspaceRoot, filePath);
    if (existsSync(absolutePath)) {
      sourceFilesByPath.set(filePath, readFileSync(absolutePath, "utf8"));
    }
  }
} else {
  for (const workspace of workspaces) {
    for (const filePath of listSourceFiles(workspace.root)) {
      const relativePath = filePath
        .slice(workspaceRoot.length + 1)
        .replaceAll("\\", "/");
      sourceFilesByPath.set(relativePath, readFileSync(filePath, "utf8"));
    }
  }
}

const result = aiGovernance.validateAiGovernance({
  mode,
  workspaces,
  changedFiles,
  deletedFiles,
  addedFiles,
  changedLines,
  scopeManifest,
  packageExports,
  sourceFilesByPath,
});

if (result.ok) {
  console.log(
    `ai governance valid (${mode}, fingerprint ${aiGovernance.AI_GOVERNANCE_FINGERPRINT})`
  );
} else {
  console.error(`ai governance validation failed (${mode}):`);
  for (const violation of result.violations) {
    let location = "";
    if (violation.path) {
      location = violation.lineNumber
        ? `[${violation.path}:${violation.lineNumber}]`
        : `[${violation.path}]`;
    }
    console.error(
      `  - (${violation.invariant})${location ? ` ${location}` : ""} ${violation.message}`
    );
  }
  process.exitCode = 1;
}

function collectGitDiff() {
  const baseRef = resolveGitBaseRef();
  const nameOnly = execSync(`git diff --name-only ${baseRef}...HEAD`, {
    cwd: workspaceRoot,
    encoding: "utf8",
  })
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const diffOutput = execSync(`git diff -U0 ${baseRef}...HEAD`, {
    cwd: workspaceRoot,
    encoding: "utf8",
  });

  const changedLines = [];
  let currentPath = null;

  for (const line of diffOutput.split("\n")) {
    if (line.startsWith("+++ b/")) {
      currentPath = line.slice("+++ b/".length).replaceAll("\\", "/");
      continue;
    }

    if (!(currentPath && line.startsWith("+")) || line.startsWith("+++")) {
      continue;
    }

    changedLines.push({
      path: currentPath,
      lineNumber: 0,
      content: line.slice(1),
    });
  }

  const deletedFiles = execSync(
    `git diff --name-only --diff-filter=D ${baseRef}...HEAD`,
    {
      cwd: workspaceRoot,
      encoding: "utf8",
    }
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const addedFiles = execSync(
    `git diff --name-only --diff-filter=A ${baseRef}...HEAD`,
    {
      cwd: workspaceRoot,
      encoding: "utf8",
    }
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    changedFiles: nameOnly,
    deletedFiles,
    addedFiles,
    changedLines,
  };
}

function resolveGitBaseRef() {
  try {
    execSync("git merge-base origin/main HEAD", {
      cwd: workspaceRoot,
      stdio: "ignore",
    });
    return "origin/main";
  } catch {
    return "HEAD~1";
  }
}

function buildPackageExports(workspaces) {
  return workspaces.map((workspace) => {
    const raw = JSON.parse(readFileSync(workspace.packageJsonPath, "utf8"));
    const exportsField = raw.exports ?? { ".": true };

    return {
      packageName: workspace.packageJson.name,
      exportKeys: Object.keys(exportsField),
    };
  });
}

function listSourceFiles(directory) {
  const files = [];
  const ignored = new Set([
    ".next",
    ".turbo",
    "coverage",
    "dist",
    "node_modules",
    "test-results",
  ]);
  const extensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) {
      continue;
    }

    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listSourceFiles(entryPath));
      continue;
    }

    if (extensions.has(entry.name.slice(entry.name.lastIndexOf(".")))) {
      files.push(entryPath);
    }
  }

  return files;
}
