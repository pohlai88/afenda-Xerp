import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const packageRoots = ["apps", "packages"];
const jsExtensionPattern = /\.js$/u;
const tsExtensionPattern = /\.ts$/u;
const failures = [];
const packageNames = new Set();

for (const workspacePackage of discoverWorkspacePackages()) {
  validatePackage(workspacePackage);
}

if (failures.length > 0) {
  console.error("public export validation failed:");
  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(`public exports valid (${packageNames.size} packages checked)`);
}

function discoverWorkspacePackages() {
  const packages = [];

  for (const packageRoot of packageRoots) {
    const absolutePackageRoot = join(workspaceRoot, packageRoot);

    if (!existsSync(absolutePackageRoot)) {
      continue;
    }

    for (const entry of readdirSync(absolutePackageRoot, {
      withFileTypes: true,
    })) {
      if (!entry.isDirectory()) {
        continue;
      }

      const root = join(absolutePackageRoot, entry.name);
      const packageJsonPath = join(root, "package.json");

      if (!existsSync(packageJsonPath)) {
        continue;
      }

      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

      if (typeof packageJson.name === "string") {
        packages.push({ packageJson, packageJsonPath, root });
      }
    }
  }

  return packages;
}

function validatePackage(workspacePackage) {
  const { packageJson, packageJsonPath, root } = workspacePackage;

  if (packageNames.has(packageJson.name)) {
    failures.push(`${packageJson.name} is declared more than once`);
  }
  packageNames.add(packageJson.name);

  if (!packageJson.exports) {
    return;
  }

  if (!Object.hasOwn(packageJson.exports, ".")) {
    failures.push(`${formatPath(packageJsonPath)} exports must include "."`);
  }

  for (const [entrypoint, exportDefinition] of Object.entries(
    packageJson.exports
  )) {
    validateExportDefinition(
      root,
      packageJsonPath,
      entrypoint,
      exportDefinition
    );
  }
}

function validateExportDefinition(
  packageRoot,
  packageJsonPath,
  entrypoint,
  exportDefinition
) {
  if (!exportDefinition || typeof exportDefinition !== "object") {
    failures.push(
      `${formatPath(packageJsonPath)} export ${entrypoint} must use condition object`
    );
    return;
  }

  for (const condition of ["types", "import", "default"]) {
    const target = exportDefinition[condition];

    if (typeof target !== "string") {
      failures.push(
        `${formatPath(packageJsonPath)} export ${entrypoint} is missing ${condition}`
      );
      continue;
    }

    if (!target.startsWith("./dist/")) {
      failures.push(
        `${formatPath(packageJsonPath)} export ${entrypoint}.${condition} must point at dist`
      );
    }

    if (target.includes("/src/") || target.startsWith("./src/")) {
      failures.push(
        `${formatPath(packageJsonPath)} export ${entrypoint}.${condition} exposes src internals`
      );
    }
  }

  const sourceFile = resolveSourceFile(packageRoot, exportDefinition.import);

  if (!existsSync(sourceFile)) {
    failures.push(
      `${formatPath(packageJsonPath)} export ${entrypoint} has no matching source file ${formatPath(sourceFile)}`
    );
  }
}

function resolveSourceFile(packageRoot, importTarget) {
  const sourceTarget = importTarget
    .replace("./dist/", "./src/")
    .replace(jsExtensionPattern, ".ts");
  const sourceFile = join(packageRoot, sourceTarget);

  if (existsSync(sourceFile)) {
    return sourceFile;
  }

  return sourceFile.replace(tsExtensionPattern, ".tsx");
}

function formatPath(filePath) {
  return relative(workspaceRoot, filePath).replaceAll("\\", "/");
}
