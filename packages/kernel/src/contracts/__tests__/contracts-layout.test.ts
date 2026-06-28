import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  KERNEL_CONTRACTS_CANONICAL_PATHS,
  KERNEL_PACKAGE_LAYOUT_POLICY,
  KERNEL_PACKAGE_TARGET_PATHS,
  KERNEL_SRC_FOLDER_BOUNDARY,
  RETIRED_KERNEL_REPO_PATHS,
} from "../kernel-package-layout.contract.js";

const repoRoot = fileURLToPath(new URL("../../../../..", import.meta.url));

describe("contracts layout (PAS-001 §6.1 / §6.2)", () => {
  it("registers every canonical contracts path in layout policy", () => {
    expect(KERNEL_CONTRACTS_CANONICAL_PATHS).toHaveLength(9);
    expect(KERNEL_PACKAGE_LAYOUT_POLICY.contractsCanonicalPaths).toEqual([
      ...KERNEL_CONTRACTS_CANONICAL_PATHS,
    ]);
    expect(KERNEL_SRC_FOLDER_BOUNDARY.contracts).toBe(
      "platform-wire-vocabulary"
    );
  });

  it("lands every canonical contracts file on disk", () => {
    for (const repoRelative of KERNEL_CONTRACTS_CANONICAL_PATHS) {
      expect(existsSync(join(repoRoot, repoRelative)), repoRelative).toBe(true);
    }
  });

  it("includes every canonical contracts path in KERNEL_PACKAGE_TARGET_PATHS", () => {
    const targetPathSet = new Set<string>(KERNEL_PACKAGE_TARGET_PATHS);

    for (const repoRelative of KERNEL_CONTRACTS_CANONICAL_PATHS) {
      expect(targetPathSet.has(repoRelative), repoRelative).toBe(true);
    }
  });

  it("keeps retired contracts paths absent after relocation slices", () => {
    const retiredContracts = RETIRED_KERNEL_REPO_PATHS.filter((path) =>
      path.includes("/contracts/")
    );

    expect(retiredContracts.length).toBeGreaterThan(0);

    for (const repoRelative of retiredContracts) {
      expect(existsSync(join(repoRoot, repoRelative)), repoRelative).toBe(
        false
      );
    }
  });
});
