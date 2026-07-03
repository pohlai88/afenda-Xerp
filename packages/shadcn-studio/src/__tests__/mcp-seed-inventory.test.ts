import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { MCP_SEED_BLOCK_MANIFEST } from "../meta-registry/mcp-seed-block-manifest.js";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const uiDir = join(packageRoot, "src/components-ui");
const blocksDir = join(packageRoot, "src/components-layouts");
const authShellDir = join(packageRoot, "src/components-auth-shell");

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
  it("seeds at least five ui primitives under src/components-ui/", () => {
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

  it("installs live MCP auth blocks under src/components-auth-shell/", () => {
    expect(existsSync(join(authShellDir, "login-page-04.tsx"))).toBe(true);
  });

  it("installs live MCP blocks under src/components-layouts/", () => {
    const blockEntries = listBlockEntries();
    expect(blockEntries.length).toBeGreaterThanOrEqual(20);

    for (const entry of MCP_SEED_BLOCK_MANIFEST) {
      if (entry.mcpPath.includes("/components-auth-shell/")) {
        expect(
          existsSync(
            join(
              packageRoot,
              entry.mcpPath.replace("packages/shadcn-studio/", "")
            )
          )
        ).toBe(true);
        continue;
      }
      const relativePath = entry.mcpPath.replace(
        "packages/shadcn-studio/src/components-layouts/",
        ""
      );
      expect(blockEntries).toContain(relativePath.replace(/\\/g, "/"));
    }

    expect(blockEntries).toEqual(
      expect.arrayContaining([
        "account-settings-01",
        "hero-section-01",
        "menu-trigger.tsx",
        "statistics-card-01.tsx",
        "datatable-user.tsx",
        "datatable-invoice.tsx",
        "datatable-product.tsx",
      ])
    );
  });

  it("ships cn helper at src/utils/utils.ts", () => {
    expect(existsSync(join(packageRoot, "src/utils/utils.ts"))).toBe(true);
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
