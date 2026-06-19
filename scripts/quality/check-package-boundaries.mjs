import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const sourceRoots = ["apps", "packages"];
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const ignoredDirectories = new Set([
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "test-results",
]);
const importPattern =
  /\bfrom\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/gu;

const workspacePackages = discoverWorkspacePackages();
const packageByName = new Map(
  workspacePackages.map((workspacePackage) => [
    workspacePackage.packageJson.name,
    workspacePackage,
  ])
);
const failures = [];

for (const workspacePackage of workspacePackages) {
  for (const filePath of listSourceFiles(workspacePackage.root)) {
    validateImports(workspacePackage, filePath);
  }
}

if (failures.length > 0) {
  console.error("package boundary validation failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `package boundaries valid (${workspacePackages.length} workspaces checked)`
  );
}

function discoverWorkspacePackages() {
  const packages = [];

  for (const sourceRoot of sourceRoots) {
    const absoluteSourceRoot = join(workspaceRoot, sourceRoot);

    if (!existsSync(absoluteSourceRoot)) {
      continue;
    }

    for (const entry of readdirSync(absoluteSourceRoot, {
      withFileTypes: true,
    })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const packageRoot = join(absoluteSourceRoot, entry.name);
      const packageJsonPath = join(packageRoot, "package.json");

      if (!existsSync(packageJsonPath)) {
        continue;
      }

      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

      if (typeof packageJson.name !== "string") {
        continue;
      }

      packages.push({
        packageJson,
        packageJsonPath,
        root: packageRoot,
      });
    }
  }

  return packages;
}

function listSourceFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) {
      continue;
    }

    const entryPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...listSourceFiles(entryPath));
      continue;
    }

    if (entry.isFile() && sourceExtensions.has(extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

function validateImports(workspacePackage, filePath) {
  const source = readFileSync(filePath, "utf8");

  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2] ?? match[3];

    if (!specifier) {
      continue;
    }

    if (specifier.startsWith(".")) {
      validateRelativeImport(workspacePackage, filePath, specifier);
      continue;
    }

    if (specifier.startsWith("@afenda/")) {
      validateWorkspaceImport(workspacePackage, filePath, specifier);
    }
  }
}

function validateRelativeImport(workspacePackage, filePath, specifier) {
  const resolvedImport = resolve(dirname(filePath), specifier);
  const importedPackage = workspacePackages.find((candidate) =>
    isPathInside(resolvedImport, candidate.root)
  );

  if (importedPackage && importedPackage.root !== workspacePackage.root) {
    failures.push(
      `${formatPath(filePath)} deep-imports ${specifier} across package boundary into ${importedPackage.packageJson.name}`
    );
  }
}

function validateWorkspaceImport(workspacePackage, filePath, specifier) {
  const packageName = extractWorkspacePackageName(specifier);
  const importedPackage = packageByName.get(packageName);

  if (!importedPackage) {
    failures.push(
      `${formatPath(filePath)} imports unknown workspace package ${specifier}`
    );
    return;
  }

  if (importedPackage.root === workspacePackage.root) {
    return;
  }

  if (!declaresDependency(workspacePackage.packageJson, packageName)) {
    failures.push(
      `${formatPath(filePath)} imports ${packageName} without declaring it in package.json`
    );
  }

  const subpath = specifier.slice(packageName.length);

  if (!subpath) {
    return;
  }

  const exportKey = `.${subpath}`;
  const exportsField = importedPackage.packageJson.exports;

  if (!(exportsField && Object.hasOwn(exportsField, exportKey))) {
    failures.push(
      `${formatPath(filePath)} deep-imports ${specifier}; use an exported public entrypoint`
    );
  }
}

function extractWorkspacePackageName(specifier) {
  const segments = specifier.split("/");
  return `${segments[0]}/${segments[1]}`;
}

function declaresDependency(packageJson, packageName) {
  return Boolean(
    packageJson.dependencies?.[packageName] ??
      packageJson.devDependencies?.[packageName] ??
      packageJson.peerDependencies?.[packageName]
  );
}

function isPathInside(childPath, parentPath) {
  const relativePath = relative(parentPath, childPath);
  return (
    relativePath === "" ||
    !(relativePath.startsWith("..") || relativePath.startsWith(sep))
  );
}

function formatPath(filePath) {
  return relative(workspaceRoot, filePath).replaceAll("\\", "/");
}
