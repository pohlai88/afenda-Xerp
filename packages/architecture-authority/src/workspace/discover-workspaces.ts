import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  DiscoveredWorkspace,
  WorkspacePackageJson,
} from "../contracts/workspace.contract.js";

const SOURCE_ROOTS = ["apps", "packages"] as const;

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

      const packageJson = JSON.parse(
        readFileSync(packageJsonPath, "utf8")
      ) as WorkspacePackageJson;

      if (typeof packageJson.name !== "string") {
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
