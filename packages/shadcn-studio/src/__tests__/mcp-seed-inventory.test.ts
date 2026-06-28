import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const uiDir = join(packageRoot, "src/components/ui");
const blocksDir = join(packageRoot, "src/components/shadcn-studio/blocks");

function listUiPrimitiveFiles(): string[] {
  return readdirSync(uiDir)
    .filter((name) => name.endsWith(".tsx") || name.endsWith(".ts"))
    .sort();
}

function listBlockEntries(): string[] {
  return readdirSync(blocksDir, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.isDirectory()) {
        return [entry.name];
      }
      if (entry.isFile() && entry.name.endsWith(".tsx")) {
        return [entry.name];
      }
      return [];
    })
    .sort();
}

describe("MCP live seed inventory (B42c + B42e + B42f + B42g)", () => {
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
        "table.tsx",
        "chart.tsx",
      ])
    );
  });

  it("installs live MCP blocks under src/components/shadcn-studio/blocks/", () => {
    const blockEntries = listBlockEntries();
    expect(blockEntries.length).toBeGreaterThanOrEqual(20);
    expect(blockEntries).toEqual(
      expect.arrayContaining([
        "account-settings-01",
        "account-settings-07",
        "error-page-02",
        "hero-section-01",
        "login-page-04",
        "menu-trigger.tsx",
        "sidebar-user-dropdown.tsx",
        "statistics-card-01.tsx",
        "statistics-card-03.tsx",
        "statistics-trend-card.tsx",
        "datatable-invoice.tsx",
        "widget-sales-by-countries.tsx",
        "widget-total-earning.tsx",
      ])
    );
  });

  it("ships cn helper at src/lib/utils.ts", () => {
    expect(existsSync(join(packageRoot, "src/lib/utils.ts"))).toBe(true);
  });

  it("documents MCP live provenance on installed hero block", () => {
    const heroSource = readFileSync(
      join(blocksDir, "hero-section-01/hero-section-01.tsx"),
      "utf8"
    );
    expect(heroSource).toContain("cdn.shadcnstudio.com");
    expect(heroSource).not.toContain("manual seed equivalent");
  });

  it("does not retain B40 placeholder block directories", () => {
    expect(existsSync(join(packageRoot, "src/blocks/placeholder-hero"))).toBe(
      false
    );
    expect(existsSync(join(packageRoot, "src/blocks/placeholder-form"))).toBe(
      false
    );
  });
});
