import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  ARCHITECTURE_AUTHORITY_CURRENT_SRC_TOP_LEVEL,
  ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_POLICY,
  ARCHITECTURE_AUTHORITY_PACKAGE_PROHIBITED_PATHS,
  ARCHITECTURE_AUTHORITY_PACKAGE_TARGET_PATHS,
  ARCHITECTURE_AUTHORITY_SRC_ROOT_BARREL,
  ARCHITECTURE_AUTHORITY_SUBPATH_EXPORTS,
  isArchitectureAuthorityCurrentSrcTopLevel,
  isArchitectureAuthoritySubpathExport,
} from "../contracts/architecture-authority-package-layout.contract.js";

const repoRoot = fileURLToPath(new URL("../../../..", import.meta.url));
const authorityRoot = join(repoRoot, "packages/architecture-authority");
const authoritySrcRoot = join(authorityRoot, "src");
const packageJsonPath = join(authorityRoot, "package.json");

describe("architecture-authority package structure (PAS-002 §6.1 / §6.2 / §6.3)", () => {
  it("exports layout policy aligned with PAS §6.1, §6.2, and §6.3", () => {
    expect(
      ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_POLICY.pasSections.current
    ).toBe("6.1");
    expect(
      ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_POLICY.pasSections.structure
    ).toBe("6.2");
    expect(
      ARCHITECTURE_AUTHORITY_PACKAGE_LAYOUT_POLICY.pasSections.exports
    ).toBe("6.3");
    expect(ARCHITECTURE_AUTHORITY_PACKAGE_TARGET_PATHS.length).toBeGreaterThan(
      0
    );
    expect(ARCHITECTURE_AUTHORITY_SUBPATH_EXPORTS).toEqual(["./surface"]);
  });

  it("narrows subpath export names at the boundary", () => {
    expect(isArchitectureAuthoritySubpathExport("./surface")).toBe(true);
    expect(isArchitectureAuthoritySubpathExport("./validators")).toBe(false);
  });

  it("narrows current src top-level folder names at the boundary", () => {
    expect(isArchitectureAuthorityCurrentSrcTopLevel("validators")).toBe(true);
    expect(isArchitectureAuthorityCurrentSrcTopLevel("app")).toBe(false);
  });

  it("keeps only the root barrel at packages/architecture-authority/src/", () => {
    const rootEntries = readdirSync(authoritySrcRoot, { withFileTypes: true });
    const rootFiles = rootEntries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);

    expect(rootFiles).toEqual([ARCHITECTURE_AUTHORITY_SRC_ROOT_BARREL]);
  });

  it("lands every PAS §6.1 current top-level folder on disk", () => {
    const directories = readdirSync(authoritySrcRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(directories).toEqual(
      [...ARCHITECTURE_AUTHORITY_CURRENT_SRC_TOP_LEVEL].sort()
    );
  });

  it("lands every PAS §6.2 target path on disk", () => {
    for (const repoRelative of ARCHITECTURE_AUTHORITY_PACKAGE_TARGET_PATHS) {
      expect(existsSync(join(repoRoot, repoRelative)), repoRelative).toBe(true);
    }
  });

  it("keeps PAS §6.3 forbidden structure paths absent", () => {
    for (const repoRelative of ARCHITECTURE_AUTHORITY_PACKAGE_PROHIBITED_PATHS) {
      expect(existsSync(join(repoRoot, repoRelative)), repoRelative).toBe(
        false
      );
    }
  });

  it("registers every subpath export in package.json", () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      exports: Record<string, unknown>;
    };

    for (const subpath of ARCHITECTURE_AUTHORITY_SUBPATH_EXPORTS) {
      expect(packageJson.exports[subpath], subpath).toBeDefined();
    }
  });
});
