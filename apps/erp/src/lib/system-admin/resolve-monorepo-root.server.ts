import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function resolveMonorepoRoot(startDir = process.cwd()): string {
  let current = startDir;

  while (true) {
    const packageJsonPath = join(current, "package.json");
    if (existsSync(packageJsonPath)) {
      try {
        const parsed = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
          readonly name?: string;
        };
        if (parsed.name === "afenda") {
          return current;
        }
      } catch {
        // Continue walking up the tree.
      }
    }

    const parent = dirname(current);
    if (parent === current) {
      break;
    }

    current = parent;
  }

  return startDir;
}
