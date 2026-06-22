import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = join(import.meta.dirname, "..");
const adapterFileName = "dashboard-grid-layout-adapter.client.tsx";

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "__tests__" || entry.name === "_storybook") {
        continue;
      }
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name) && !/\.stories\.tsx$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

describe("dashboard grid adapter boundary", () => {
  it("only allows react-grid-layout imports in the adapter module", () => {
    const violations: string[] = [];

    for (const filePath of collectSourceFiles(srcRoot)) {
      if (filePath.endsWith(adapterFileName)) {
        continue;
      }

      const content = readFileSync(filePath, "utf8");
      if (/from ["']react-grid-layout/.test(content)) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });

  it("imports react-grid-layout from the adapter module", () => {
    const adapterPath = join(srcRoot, "dashboard", adapterFileName);
    const content = readFileSync(adapterPath, "utf8");

    expect(content).toContain('from "react-grid-layout/legacy"');
  });
});
