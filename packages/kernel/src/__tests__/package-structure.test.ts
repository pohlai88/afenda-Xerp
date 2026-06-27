import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  isKernelPackageCurrentSrcTopLevel,
  isKernelPackageSubpathExport,
  KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL,
  KERNEL_PACKAGE_LAYOUT_POLICY,
  KERNEL_PACKAGE_PROHIBITED_PATHS,
  KERNEL_PACKAGE_SRC_ROOT_BARREL,
  KERNEL_PACKAGE_SUBPATH_EXPORTS,
  KERNEL_PACKAGE_TARGET_PATHS,
} from "../contracts/kernel-package-layout.contract.js";
import { RETIRED_KERNEL_PLATFORM_ID_PATHS } from "../identity/governance/identity-module-layout.contract.js";

const repoRoot = fileURLToPath(new URL("../../../..", import.meta.url));
const kernelRoot = join(repoRoot, "packages/kernel");
const kernelSrcRoot = join(kernelRoot, "src");
const packageJsonPath = join(kernelRoot, "package.json");

describe("kernel package structure (PAS-001 §6.1 / §6.2 / §6.4)", () => {
  it("exports layout policy aligned with PAS §6.1, §6.2, and §6.4", () => {
    expect(KERNEL_PACKAGE_LAYOUT_POLICY.pasSections.current).toBe("6.1");
    expect(KERNEL_PACKAGE_LAYOUT_POLICY.pasSections.structure).toBe("6.2");
    expect(KERNEL_PACKAGE_LAYOUT_POLICY.pasSections.exports).toBe("6.4");
    expect(KERNEL_PACKAGE_TARGET_PATHS.length).toBeGreaterThan(0);
    expect(KERNEL_PACKAGE_SUBPATH_EXPORTS).toContain("./propagation");
  });

  it("narrows subpath export names at the boundary", () => {
    expect(isKernelPackageSubpathExport("./policy")).toBe(true);
    expect(isKernelPackageSubpathExport("./identity")).toBe(false);
  });

  it("narrows current src top-level folder names at the boundary", () => {
    expect(isKernelPackageCurrentSrcTopLevel("governance")).toBe(true);
    expect(isKernelPackageCurrentSrcTopLevel("src")).toBe(false);
  });

  it("keeps only the root barrel at packages/kernel/src/", () => {
    const rootEntries = readdirSync(kernelSrcRoot, { withFileTypes: true });
    const rootFiles = rootEntries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);

    expect(rootFiles).toEqual([KERNEL_PACKAGE_SRC_ROOT_BARREL]);
  });

  it("lands every PAS §6.1 current top-level folder on disk", () => {
    const directories = readdirSync(kernelSrcRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(directories).toEqual(
      [...KERNEL_PACKAGE_CURRENT_SRC_TOP_LEVEL].sort()
    );
  });

  it("lands every PAS §6.2 target path on disk", () => {
    for (const repoRelative of KERNEL_PACKAGE_TARGET_PATHS) {
      expect(existsSync(join(repoRoot, repoRelative)), repoRelative).toBe(true);
    }
  });

  it("keeps PAS §6.2 prohibited context paths absent", () => {
    for (const repoRelative of KERNEL_PACKAGE_PROHIBITED_PATHS) {
      expect(existsSync(join(repoRoot, repoRelative)), repoRelative).toBe(
        false
      );
    }
  });

  it("keeps retired platform-id paths absent", () => {
    for (const repoRelative of RETIRED_KERNEL_PLATFORM_ID_PATHS) {
      expect(existsSync(join(repoRoot, repoRelative)), repoRelative).toBe(
        false
      );
    }
  });

  it("registers every subpath export in package.json", () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      exports: Record<string, unknown>;
    };

    for (const subpath of KERNEL_PACKAGE_SUBPATH_EXPORTS) {
      expect(packageJson.exports[subpath], subpath).toBeDefined();
    }
  });
});
