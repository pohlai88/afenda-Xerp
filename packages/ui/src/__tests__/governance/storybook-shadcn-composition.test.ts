/** @vitest-environment node */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const storybookRoot = join(packageRoot, "src/components/_storybook");

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

const EXCLUDED_FILES = new Set([
  "story-frame.tsx",
  "scroll-area-release-tags.tsx",
]);

function collectShadcnDemoFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectShadcnDemoFiles(full));
      continue;
    }
    if (!entry.endsWith(".tsx")) {
      continue;
    }
    if (
      entry.endsWith(".stories.tsx") ||
      entry.includes("fixtures") ||
      entry.endsWith("-compositions.tsx") ||
      EXCLUDED_FILES.has(entry)
    ) {
      continue;
    }
    files.push(full);
  }
  return files;
}

const demoFiles = collectShadcnDemoFiles(storybookRoot);

describe("storybook shadcn demos: Governed UI composition policy", () => {
  it("includes collapsible-10 normalized demo", () => {
    expect(
      demoFiles.some((file) => file.endsWith("collapsible-animated-demo.tsx"))
    ).toBe(true);
  });

  it("includes tabs-11 and tabs-29 normalized demos", () => {
    expect(demoFiles.some((file) => file.endsWith("tabs-line-demo.tsx"))).toBe(
      true
    );
    expect(
      demoFiles.some((file) =>
        file.endsWith("tabs-animated-underline-demo.tsx")
      )
    ).toBe(true);
  });

  it("includes tooltip-07 normalized demo", () => {
    expect(
      demoFiles.some((file) => file.endsWith("tooltip-content-demo.tsx"))
    ).toBe(true);
  });

  for (const absPath of demoFiles) {
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
