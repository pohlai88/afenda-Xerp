import { describe, expect, it } from "vitest";
import {
  CROSS_PACKAGE_NAMES,
  CROSS_PACKAGE_RESPONSIBILITIES,
  crossPackageAuthority,
  metadataAiGovernanceRules,
  metadataUiIntegrationRule,
} from "../index.js";

function getEntry(packageName: (typeof CROSS_PACKAGE_NAMES)[number]) {
  const entry = crossPackageAuthority.packages.find(
    (candidate) => candidate.package === packageName
  );
  if (!entry) {
    throw new Error(`Missing authority entry for ${packageName}`);
  }
  return entry;
}

describe("cross-package authority contract", () => {
  it("declares version, lifecycle, and TIP-005 authority", () => {
    expect(crossPackageAuthority.version).toBe("1.0.0");
    expect(crossPackageAuthority.lifecycle).toBe("active");
    expect(crossPackageAuthority.authority).toBe("TIP-005");
    expect(crossPackageAuthority.noOverlapRule.length).toBeGreaterThan(0);
  });

  it("states metadata-ui must consume metadata contracts", () => {
    expect(metadataUiIntegrationRule).toContain(
      "@afenda/metadata-ui must depend on @afenda/metadata"
    );
    expect(crossPackageAuthority.metadataUiIntegrationRule).toBe(
      metadataUiIntegrationRule
    );
  });

  it("prohibits merging metadata and metadata-ui", () => {
    expect(metadataUiIntegrationRule).toContain("must never be merged");
    expect(metadataAiGovernanceRules.mayNot).toContain(
      "merge-metadata-with-metadata-ui"
    );
  });

  it("prohibits metadata from importing metadata-ui", () => {
    expect(metadataUiIntegrationRule).toContain(
      "@afenda/metadata must never import @afenda/metadata-ui"
    );
  });

  it("prohibits metadata-ui from redefining governed arrays", () => {
    expect(metadataUiIntegrationRule).toContain(
      "must not redefine governed metadata arrays"
    );

    const metadataUiEntry = getEntry("@afenda/metadata-ui");
    expect(metadataUiEntry.mayNotOwn).toContain("governed-metadata-arrays");
  });

  it("assigns exactly one authority entry per governed package", () => {
    expect(crossPackageAuthority.packages.length).toBe(
      CROSS_PACKAGE_NAMES.length
    );

    for (const packageName of CROSS_PACKAGE_NAMES) {
      const matches = crossPackageAuthority.packages.filter(
        (entry) => entry.package === packageName
      );
      expect(matches, `${packageName} entry count`).toHaveLength(1);
    }
  });

  it("assigns singular ownership for every responsibility", () => {
    const ownership = new Map<string, string[]>();

    for (const entry of crossPackageAuthority.packages) {
      for (const responsibility of entry.owns) {
        const owners = ownership.get(responsibility) ?? [];
        owners.push(entry.package);
        ownership.set(responsibility, owners);
      }
    }

    for (const responsibility of CROSS_PACKAGE_RESPONSIBILITIES) {
      const owners = ownership.get(responsibility) ?? [];
      expect(
        owners,
        `responsibility "${responsibility}" must have exactly one owner`
      ).toHaveLength(1);
    }
  });

  it("forbids owning responsibilities listed in mayNotOwn", () => {
    for (const entry of crossPackageAuthority.packages) {
      const forbidden = new Set(entry.mayNotOwn);
      const overlap = entry.owns.filter((responsibility) =>
        forbidden.has(responsibility)
      );
      expect(
        overlap,
        `${entry.package} owns forbidden responsibilities: ${overlap.join(", ")}`
      ).toEqual([]);
    }
  });

  it("allows metadata-ui to import metadata", () => {
    const metadataUiEntry = getEntry("@afenda/metadata-ui");
    expect(metadataUiEntry.importPolicy.mayImportFrom).toContain(
      "@afenda/metadata"
    );
  });

  it("forbids metadata from importing metadata-ui", () => {
    const metadataEntry = getEntry("@afenda/metadata");
    expect(metadataEntry.importPolicy.mayNotImportFrom).toContain(
      "@afenda/metadata-ui"
    );
    expect(metadataEntry.importPolicy.mayImportFrom).not.toContain(
      "@afenda/metadata-ui"
    );
  });

  it("keeps import allow and deny lists disjoint per package", () => {
    for (const entry of crossPackageAuthority.packages) {
      const denied = new Set(entry.importPolicy.mayNotImportFrom);
      const overlap = entry.importPolicy.mayImportFrom.filter((packageName) =>
        denied.has(packageName)
      );
      expect(
        overlap,
        `${entry.package} import policy conflict: ${overlap.join(", ")}`
      ).toEqual([]);
    }
  });

  it("restricts renderer governance to metadata and implementation to metadata-ui", () => {
    expect(getEntry("@afenda/metadata").owns).toContain("renderer-governance");
    expect(getEntry("@afenda/metadata-ui").owns).toContain(
      "renderer-implementation"
    );
    expect(getEntry("@afenda/metadata-ui").mayNotOwn).toContain(
      "renderer-governance"
    );
    expect(getEntry("@afenda/metadata").mayNotOwn).toContain(
      "renderer-implementation"
    );
  });
});
