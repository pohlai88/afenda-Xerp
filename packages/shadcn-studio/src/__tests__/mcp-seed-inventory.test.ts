import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const uiDir = join(packageRoot, "src/components/ui");
const blocksDir = join(packageRoot, "src/blocks");

function listUiPrimitiveFiles(): string[] {
  return readdirSync(uiDir)
    .filter((name) => name.endsWith(".tsx") || name.endsWith(".ts"))
    .sort();
}

function listBlockDirectories(): string[] {
  return readdirSync(blocksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

describe("B40 MCP seed inventory", () => {
  it("seeds at least five ui primitives under src/components/ui/", () => {
    const uiFiles = listUiPrimitiveFiles();
    expect(uiFiles.length).toBeGreaterThanOrEqual(5);
    expect(uiFiles).toEqual(
      expect.arrayContaining([
        "button.tsx",
        "card.tsx",
        "input.tsx",
        "label.tsx",
        "select.tsx",
      ])
    );
  });

  it("seeds at least two block directories under src/blocks/", () => {
    const blockDirs = listBlockDirectories();
    expect(blockDirs.length).toBeGreaterThanOrEqual(2);
    expect(blockDirs).toEqual(
      expect.arrayContaining(["placeholder-hero", "placeholder-form"])
    );
  });

  it("ships cn helper at src/lib/utils.ts", () => {
    expect(existsSync(join(packageRoot, "src/lib/utils.ts"))).toBe(true);
  });

  it("documents manual seed provenance on installed primitives", () => {
    const buttonSource = readFileSync(join(uiDir, "button.tsx"), "utf8");
    expect(buttonSource).toContain("MCP provenance");
    expect(buttonSource).toContain("manual seed equivalent");
  });
});
