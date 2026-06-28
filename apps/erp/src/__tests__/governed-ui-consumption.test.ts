/**
 * Static Governed UI consumer-layer checks for @afenda/erp.
 * Mirrors scripts/governance/governed-ui-consumption.mjs (single policy source).
 *
 * The erp app imports @afenda/ui and @afenda/appshell. Any className passed to
 * a governed @afenda/ui primitive will throw at runtime in dev/test (Governed UI).
 * This static test surfaces violations before they reach the browser.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const srcDir = join(appRoot, "src");

const policyModuleUrl = pathToFileURL(
  join(appRoot, "../../scripts/governance/governed-ui-consumption.mjs")
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

describe("governed UI consumption — apps/erp (Governed UI)", () => {
  for (const file of sourceFiles) {
    const rel = relative(appRoot, file).replace(/\\/g, "/");

    it(`${rel} does not pass className to governed @afenda/ui primitives`, () => {
      const violations = checkGovernedUiConsumption(readFileSync(file, "utf8"));
      expect(violations, violations.join("\n")).toEqual([]);
    });
  }
});
