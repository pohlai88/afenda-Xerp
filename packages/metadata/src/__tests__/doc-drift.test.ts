import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const packageRoot = join(fileURLToPath(new URL("../..", import.meta.url)));

const metadataDocPaths = [
  join(packageRoot, "README.md"),
  join(packageRoot, "doc/TIP-005.md"),
  join(
    packageRoot,
    "../../docs/PAS/slice/[Complete (authority only)] tip-005-metadata-authority.md"
  ),
  join(packageRoot, "../metadata-ui/README.md"),
];

const forbiddenDocPatterns = [
  {
    name: "tip005IntegrationRule",
    pattern: /\btip005IntegrationRule\b/g,
  },
  {
    name: "canRenderList",
    pattern: /\bcanRenderList\b/g,
  },
  {
    name: "canRenderStat",
    pattern: /\bcanRenderStat\b/g,
  },
  {
    name: "legacy metadata contracts path",
    pattern: /packages\/metadata\/src\/contracts\//g,
  },
] as const;

function isMigrationTableLine(line: string): boolean {
  return (
    line.includes("| `tip005IntegrationRule`") ||
    line.includes("→ `metadataUiIntegrationRule`") ||
    line.includes("not `canRenderList`") ||
    line.includes("| `canRender") ||
    line.includes("| `MetadataRuntimeContext.readonly`") ||
    line.includes("| `src/contracts/*`")
  );
}

function collectMarkdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectMarkdownFiles(fullPath);
    }

    return entry.name.endsWith(".md") ? [fullPath] : [];
  });
}

describe("metadata documentation drift", () => {
  it("does not reference retired metadata API names in governed docs", () => {
    for (const docPath of metadataDocPaths) {
      const contents = readFileSync(docPath, "utf8");
      const lines = contents.split(/\r?\n/);

      for (const { name, pattern } of forbiddenDocPatterns) {
        for (const [index, line] of lines.entries()) {
          if (isMigrationTableLine(line)) {
            continue;
          }

          pattern.lastIndex = 0;
          expect(
            pattern.test(line),
            `${docPath}:${index + 1} must not reference retired ${name}`
          ).toBe(false);
        }
      }
    }
  });

  it("does not keep a legacy src/contracts tree under packages/metadata", () => {
    const legacyContractsDirectory = join(packageRoot, "src/contracts");

    expect(() => readdirSync(legacyContractsDirectory)).toThrow();
  });
});

describe("metadata-ui documentation drift", () => {
  it("does not reference camelCase renderer capabilities in metadata-ui docs", () => {
    const docsDirectory = join(packageRoot, "../metadata-ui/docs");
    const docFiles = collectMarkdownFiles(docsDirectory);

    for (const docPath of docFiles) {
      const contents = readFileSync(docPath, "utf8");
      const lines = contents.split(/\r?\n/);

      for (const [index, line] of lines.entries()) {
        if (isMigrationTableLine(line)) {
          continue;
        }

        expect(
          /\bcanRender[A-Z][a-zA-Z]+\b/.test(line),
          `${docPath}:${index + 1} must use render-* capability keys`
        ).toBe(false);
      }
    }
  });
});
