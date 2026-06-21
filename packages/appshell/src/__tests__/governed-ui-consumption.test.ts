/**
 * Static TIP-004 consumer-layer checks for @afenda/appshell.
 * Mirrors scripts/governance/governed-ui-consumption.mjs (single policy source).
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const srcDir = join(packageRoot, "src");

const policyModuleUrl = pathToFileURL(
  join(packageRoot, "../../scripts/governance/governed-ui-consumption.mjs")
).href;

const { checkGovernedUiConsumption } = (await import(policyModuleUrl)) as {
  checkGovernedUiConsumption: (content: string) => string[];
};

function collectTsxFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "__tests__") {
        continue;
      }
      files.push(...collectTsxFiles(full));
    } else if (entry.endsWith(".tsx")) {
      files.push(full);
    }
  }
  return files;
}

const sourceFiles = collectTsxFiles(srcDir);

describe("governed UI consumption (TIP-004)", () => {
  for (const file of sourceFiles) {
    const rel = relative(packageRoot, file).replace(/\\/g, "/");

    it(`${rel} does not pass className to governed @afenda/ui primitives`, () => {
      const violations = checkGovernedUiConsumption(readFileSync(file, "utf8"));
      expect(violations, violations.join("\n")).toEqual([]);
    });
  }
});
