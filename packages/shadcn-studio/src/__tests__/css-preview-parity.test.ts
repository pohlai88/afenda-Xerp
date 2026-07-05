import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testDir, "../../../..");

const STORYBOOK_PREVIEW_CSS = join(
  repoRoot,
  "apps/storybook/.storybook/preview.css"
);
const ERP_GLOBALS_CSS = join(repoRoot, "apps/erp/src/app/globals.css");

/** AdminCN import chain — must match between ERP and Storybook lab. */
const REQUIRED_CSS_IMPORTS = [
  '@import "tailwindcss";',
  '@import "tw-animate-css";',
  '@import "shadcn/tailwind.css";',
  '@import "@afenda/shadcn-studio/shadcn-default.css";',
] as const;

describe("css preview parity (AdminCN / shadcn studio SSOT)", () => {
  it("Storybook preview.css mirrors ERP globals.css import chain", () => {
    const storybookCss = readFileSync(STORYBOOK_PREVIEW_CSS, "utf8");
    const erpCss = readFileSync(ERP_GLOBALS_CSS, "utf8");

    for (const importLine of REQUIRED_CSS_IMPORTS) {
      expect(storybookCss).toContain(importLine);
      expect(erpCss).toContain(importLine);
    }
  });

  it("Storybook preview.css sources shadcn-studio package tree", () => {
    const storybookCss = readFileSync(STORYBOOK_PREVIEW_CSS, "utf8");

    expect(storybookCss).toContain(
      '@source "../../../packages/shadcn-studio/src/**/*.{ts,tsx}";'
    );
  });

  it("does not import retired presentation packages in Storybook CSS", () => {
    const storybookCss = readFileSync(STORYBOOK_PREVIEW_CSS, "utf8");

    expect(storybookCss).not.toMatch(
      /@afenda\/ui|@afenda\/appshell|css-authority/
    );
  });
});
