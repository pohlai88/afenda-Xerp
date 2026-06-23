import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = join(fileURLToPath(import.meta.url), "..", "..");

const PROHIBITED_IMPORTS = [
  '"react"',
  "'react'",
  '"@afenda/metadata-ui"',
  "'@afenda/metadata-ui'",
  '"@afenda/appshell"',
  "'@afenda/appshell'",
  '"@afenda/erp"',
  "'@afenda/erp'",
];

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

describe("design-system boundary", () => {
  it("has no .tsx implementation files outside __tests__", () => {
    const tsxFiles = walk(srcDir).filter(
      (f) => extname(f) === ".tsx" && !relative(srcDir, f).includes("__tests__")
    );
    expect(tsxFiles).toEqual([]);
  });

  it("has no prohibited downstream or React imports in src", () => {
    const errors: string[] = [];
    for (const file of walk(srcDir)) {
      if (!file.endsWith(".ts") || file.includes("__tests__")) {
        continue;
      }
      const rel = relative(srcDir, file);
      const content = readFileSync(file, "utf8");
      for (const imp of PROHIBITED_IMPORTS) {
        if (content.includes(`from ${imp}`)) {
          errors.push(`${rel}: ${imp}`);
        }
      }
    }
    expect(errors).toEqual([]);
  });
});
