/** @vitest-environment node */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");

const policyModuleUrl = pathToFileURL(
  join(packageRoot, "../../scripts/governance/governed-ui-consumption.mjs")
).href;

const { checkGovernedUiConsumption } = (await import(policyModuleUrl)) as {
  checkGovernedUiConsumption: (content: string) => string[];
};

function collectStoryFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "__tests__" || entry === "node_modules") {
        continue;
      }
      files.push(...collectStoryFiles(full));
    } else if (entry.endsWith(".stories.tsx")) {
      files.push(full);
    }
  }
  return files;
}

describe("story files: TIP-004 governed UI consumption", () => {
  const storyFiles = collectStoryFiles(join(packageRoot, "src"));

  it("scans all Storybook story files", () => {
    expect(storyFiles.length).toBeGreaterThan(0);
  });

  for (const absPath of storyFiles) {
    const rel = absPath.replace(`${packageRoot}\\`, "").replace(`${packageRoot}/`, "");

    it(`${rel}: no className on governed @afenda/ui primitives`, () => {
      const source = readFileSync(absPath, "utf8");
      const violations = checkGovernedUiConsumption(source);
      expect(
        violations,
        violations.length > 0
          ? `Move chrome to StoryCellChrome/StoryInset or plain HTML wrappers:\n${violations.join("\n")}`
          : undefined
      ).toEqual([]);
    });
  }
});
