/** @vitest-environment node */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const afendaDocsDir = join(packageRoot, "src/components/afenda-docs");

const policyModuleUrl = pathToFileURL(
  join(packageRoot, "../../scripts/governance/governed-ui-consumption.mjs")
).href;

const { checkGovernedUiConsumption } = (await import(policyModuleUrl)) as {
  checkGovernedUiConsumption: (content: string) => string[];
};

const GOVERNANCE_SCAN_PREFIX = [
  'import { Badge, Button, Card } from "@afenda/ui";',
  'import { mapStockButtonProps } from "@afenda/ui/governance";',
  "",
].join("\n");

function collectCompositionFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      continue;
    }
    if (/\.tsx$/u.test(entry) && !entry.endsWith(".stories.tsx")) {
      files.push(full);
    }
  }
  return files;
}

const compositionFiles = collectCompositionFiles(afendaDocsDir);

describe("afenda-docs: TIP-004 composition policy", () => {
  it("includes reference block implementations", () => {
    expect(compositionFiles.length).toBeGreaterThanOrEqual(3);
  });

  for (const absPath of compositionFiles) {
    const rel = absPath
      .replace(`${packageRoot}\\`, "")
      .replace(`${packageRoot}/`, "");

    it(`${rel}: no className on governed primitives`, () => {
      const source = readFileSync(absPath, "utf8");
      const violations = checkGovernedUiConsumption(
        `${GOVERNANCE_SCAN_PREFIX}${source}`
      );
      expect(
        violations,
        violations.length > 0
          ? `Use governed props only; move chrome to plain HTML wrappers:\n${violations.join("\n")}`
          : undefined
      ).toEqual([]);
    });
  }
});

describe("afenda-docs: public API boundary", () => {
  it("is not exported from packages/ui/src/index.ts", () => {
    const barrel = readFileSync(join(packageRoot, "src/index.ts"), "utf8");
    expect(barrel).not.toContain("afenda-docs");
  });
});
