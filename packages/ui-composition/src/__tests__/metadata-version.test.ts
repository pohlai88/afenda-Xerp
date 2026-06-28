import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  METADATA_CONTRACT_VERSION,
  METADATA_PACKAGE_VERSION,
  metadataContract,
} from "../index.js";

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/u;

describe("metadata version", () => {
  it("exports governed package and contract versions", () => {
    expect(METADATA_PACKAGE_VERSION).toMatch(SEMVER_PATTERN);
    expect(METADATA_CONTRACT_VERSION).toMatch(SEMVER_PATTERN);
  });

  it("aligns package version with package.json", () => {
    const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    ) as { version: string };

    expect(METADATA_PACKAGE_VERSION).toBe(packageJson.version);
  });

  it("aligns metadataContract.version with METADATA_CONTRACT_VERSION", () => {
    expect(metadataContract.version).toBe(METADATA_CONTRACT_VERSION);
  });
});
