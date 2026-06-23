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
      if (entry.endsWith(".stories.tsx")) {
        continue;
      }
      files.push(full);
    }
  }
  return files;
}

const sourceFiles = collectTsxFiles(srcDir);

describe("governed UI consumption (TIP-004)", () => {
  it("policy: requires @afenda/ui/governance import when @afenda/ui is used", () => {
    const violations = checkGovernedUiConsumption(`
      import { DropdownMenu } from "@afenda/ui";
      export function X() {
        return <DropdownMenu />;
      }
    `);
    expect(violations.some((v) => v.includes("@afenda/ui/governance"))).toBe(
      true
    );
  });

  it("policy: rejects local stock-props wrapper imports", () => {
    const violations = checkGovernedUiConsumption(`
      import { Button } from "@afenda/ui";
      import { resolveStockButtonProps } from "../stock-props";
      export function X() {
        return <Button {...resolveStockButtonProps({ variant: "ghost", size: "icon-lg" })} />;
      }
    `);
    expect(violations.some((v) => v.includes("stock-props"))).toBe(true);
    expect(violations.some((v) => v.includes("resolveStockButtonProps"))).toBe(
      true
    );
  });

  it("policy: requires direct @afenda/ui/governance import for mapStockButtonProps", () => {
    const violations = checkGovernedUiConsumption(`
      import { Button } from "@afenda/ui";
      export function X() {
        return <Button {...mapStockButtonProps("ghost", "icon-lg")} />;
      }
    `);
    expect(violations.some((v) => v.includes("@afenda/ui/governance"))).toBe(
      true
    );
  });

  it("policy: accepts mapStockButtonProps with direct governance import", () => {
    const violations = checkGovernedUiConsumption(`
      import { Button } from "@afenda/ui";
      import { mapStockButtonProps } from "@afenda/ui/governance";
      export function X() {
        return <Button {...mapStockButtonProps("ghost", "icon-lg")} />;
      }
    `);
    expect(violations).toEqual([]);
  });

  for (const file of sourceFiles) {
    const rel = relative(packageRoot, file).replace(/\\/g, "/");

    it(`${rel} passes TIP-004 consumer policy (className + governance imports)`, () => {
      const violations = checkGovernedUiConsumption(readFileSync(file, "utf8"));
      expect(violations, violations.join("\n")).toEqual([]);
    });
  }
});
