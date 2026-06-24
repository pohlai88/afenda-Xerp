import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const blocksRoot = join(import.meta.dirname, "../shadcn-studio/blocks");

const FORBIDDEN_CLASS_PREFIXES = [
  "app-shell-dashboard-kpi-",
  "app-shell-dashboard-sparkline-",
  "app-shell-dashboard-revenue-",
  "app-shell-dashboard-invoice-",
  "app-shell-activity-",
] as const;

const CLASSNAME_PATTERN =
  /className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{"([^"]*)"\})/g;

function collectBlockSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectBlockSourceFiles(absolutePath));
      continue;
    }

    if (/\.tsx$/.test(entry.name) && !/\.stories\.tsx$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function findLegacyClassNameViolations(filePath: string): string[] {
  const content = readFileSync(filePath, "utf8");
  const violations: string[] = [];

  for (const match of content.matchAll(CLASSNAME_PATTERN)) {
    const classNameValue = match[1] ?? match[2] ?? match[3] ?? match[4] ?? "";
    for (const prefix of FORBIDDEN_CLASS_PREFIXES) {
      if (classNameValue.includes(prefix)) {
        violations.push(`${filePath} uses deleted class prefix "${prefix}"`);
      }
    }
  }

  return violations;
}

describe("studio legacy class guard", () => {
  it("does not reference deleted KPI or Sparkline class prefixes in block className", () => {
    const violations = collectBlockSourceFiles(blocksRoot).flatMap(
      findLegacyClassNameViolations
    );

    expect(violations).toEqual([]);
  });
});
