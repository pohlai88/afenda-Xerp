import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  DiscoveredWorkspace,
  WorkspacePackageJson,
} from "../contracts/workspace.contract.js";

const SOURCE_ROOTS = ["apps", "packages"] as const;

interface PackageJsonShape {
  dependencies?: unknown;
  devDependencies?: unknown;
  name?: unknown;
  peerDependencies?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPackageJsonShape(value: unknown): value is PackageJsonShape {
  return isRecord(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every((entry) => typeof entry === "string");
}

export function parseWorkspacePackageJson(
  raw: unknown
): WorkspacePackageJson | null {
  if (!isPackageJsonShape(raw) || typeof raw.name !== "string") {
    return null;
  }

  let dependencies: Record<string, string> | undefined;
  let devDependencies: Record<string, string> | undefined;
  let peerDependencies: Record<string, string> | undefined;

  if (raw.dependencies !== undefined) {
    if (!isStringRecord(raw.dependencies)) {
      return null;
    }

    dependencies = raw.dependencies;
  }

  if (raw.devDependencies !== undefined) {
    if (!isStringRecord(raw.devDependencies)) {
      return null;
    }

    devDependencies = raw.devDependencies;
  }

  if (raw.peerDependencies !== undefined) {
    if (!isStringRecord(raw.peerDependencies)) {
      return null;
    }

    peerDependencies = raw.peerDependencies;
  }

  return {
    name: raw.name,
    ...(dependencies === undefined ? {} : { dependencies }),
    ...(devDependencies === undefined ? {} : { devDependencies }),
    ...(peerDependencies === undefined ? {} : { peerDependencies }),
  };
}

export function discoverWorkspaces(
  workspaceRoot: string
): DiscoveredWorkspace[] {
  const packages: DiscoveredWorkspace[] = [];

  for (const sourceRoot of SOURCE_ROOTS) {
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

      const raw: unknown = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      const packageJson = parseWorkspacePackageJson(raw);

      if (!packageJson) {
        continue;
      }

      packages.push({
        packageJson,
        packageJsonPath,
        root: packageRoot,
        directoryName: entry.name,
      });
    }
  }

  return packages;
}

export function getRuntimeWorkspaceDependencies(
  packageJson: WorkspacePackageJson
): string[] {
  const dependencies = packageJson.dependencies ?? {};
  return Object.keys(dependencies).filter((name) =>
    name.startsWith("@afenda/")
  );
}

export function getDevWorkspaceDependencies(
  packageJson: WorkspacePackageJson
): string[] {
  const devDependencies = packageJson.devDependencies ?? {};
  return Object.keys(devDependencies).filter((name) =>
    name.startsWith("@afenda/")
  );
}
