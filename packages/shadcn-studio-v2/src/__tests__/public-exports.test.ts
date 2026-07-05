import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(TEST_DIR, "..", "..");
const SRC_ROOT = path.join(PACKAGE_ROOT, "src");
const PACKAGE_JSON_PATH = path.join(PACKAGE_ROOT, "package.json");
const TSCONFIG_PATH = path.join(PACKAGE_ROOT, "tsconfig.json");
const COMPONENTS_JSON_PATH = path.join(PACKAGE_ROOT, "components.json");

const EXPECTED_EXPORTS = {
  ".": {
    types: "./dist/index.d.ts",
    import: "./dist/index.js",
    default: "./dist/index.js",
  },
  "./clients": {
    types: "./dist/clients.d.ts",
    import: "./dist/clients.js",
    default: "./dist/clients.js",
  },
  "./server": {
    types: "./dist/server.d.ts",
    import: "./dist/server.js",
    default: "./dist/server.js",
  },
  "./metadata": {
    types: "./dist/metadata.d.ts",
    import: "./dist/metadata.js",
    default: "./dist/metadata.js",
  },
  "./theme": {
    types: "./dist/contexts/theme-boundary.d.ts",
    import: "./dist/contexts/theme-boundary.js",
    default: "./dist/contexts/theme-boundary.js",
  },
  "./shadcn-default.css": {
    types: "./dist/shadcn-default.css.d.ts",
    import: "./dist/shadcn-default.css",
    default: "./dist/shadcn-default.css",
  },
  "./themes/swiss-noir.css": {
    types: "./dist/themes/swiss-noir.css.d.ts",
    import: "./dist/themes/swiss-noir.css",
    default: "./dist/themes/swiss-noir.css",
  },
  "./themes/verdant-noir.css": {
    types: "./dist/themes/verdant-noir.css.d.ts",
    import: "./dist/themes/verdant-noir.css",
    default: "./dist/themes/verdant-noir.css",
  },
} as const;

const ROOT_PUBLIC_FILES = [
  "index.ts",
  "clients.ts",
  "server.ts",
  "metadata.ts",
] as const;

interface PackageJson {
  exports?: unknown;
  scripts?: Record<string, string>;
}

interface TsConfigJson {
  compilerOptions?: {
    paths?: Record<string, string[]>;
  };
}

interface ComponentsJson {
  aliases?: Record<string, string>;
}

describe("shadcn-studio-v2 public export scaffold", () => {
  it("uses only the sanctioned package export entries", () => {
    const packageJson = JSON.parse(
      readFileSync(PACKAGE_JSON_PATH, "utf8")
    ) as PackageJson;

    expect(packageJson.exports).toEqual(EXPECTED_EXPORTS);
  });

  it("keeps package build and typecheck scripts wired for export resolution", () => {
    const packageJson = JSON.parse(
      readFileSync(PACKAGE_JSON_PATH, "utf8")
    ) as PackageJson;

    expect(packageJson.scripts?.build).toBe(
      `tsc -p tsconfig.json && node --input-type=module -e "import { copyFileSync, mkdirSync } from 'node:fs'; mkdirSync('dist/themes', { recursive: true }); copyFileSync('src/styles/shadcn-default.css', 'dist/shadcn-default.css'); copyFileSync('src/types/css-export.d.ts', 'dist/shadcn-default.css.d.ts'); copyFileSync('src/styles/swiss-noir.css', 'dist/themes/swiss-noir.css'); copyFileSync('src/types/css-export.d.ts', 'dist/themes/swiss-noir.css.d.ts'); copyFileSync('src/styles/verdant-noir.css', 'dist/themes/verdant-noir.css'); copyFileSync('src/types/css-export.d.ts', 'dist/themes/verdant-noir.css.d.ts');"`
    );
    expect(packageJson.scripts?.typecheck).toBe(
      "tsc -p tsconfig.json --noEmit"
    );
  });

  it("keeps each root boundary file explicit without wildcard barrels", () => {
    for (const fileName of ROOT_PUBLIC_FILES) {
      const filePath = path.join(SRC_ROOT, fileName);

      expect(existsSync(filePath)).toBe(true);

      const source = readFileSync(filePath, "utf8").trim();

      expect(source).not.toContain("export *");
    }
  });

  it("keeps V2 package aliases aligned to registered taxonomy roots", () => {
    const tsconfig = JSON.parse(
      readFileSync(TSCONFIG_PATH, "utf8")
    ) as TsConfigJson;
    const componentsJson = JSON.parse(
      readFileSync(COMPONENTS_JSON_PATH, "utf8")
    ) as ComponentsJson;

    expect(tsconfig.compilerOptions?.paths?.["@/assets/*"]).toBeUndefined();
    expect(componentsJson.aliases?.utils).toBe("@/lib/cn");
  });
});
