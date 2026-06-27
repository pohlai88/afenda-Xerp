import { describe, expect, it } from "vitest";
import { getFoundationDispositionEntry } from "../data/foundation-disposition.registry.js";
import { ownershipByPackage } from "../data/ownership-registry.data.js";
import { packageByName } from "../data/package-registry.data.js";

describe("registry lookup map immutability (PAS-002 B20)", () => {
  it("rejects mutation on packageByName", () => {
    expect(() => {
      (packageByName as Map<string, unknown>).set("@afenda/test", {});
    }).toThrow("Architecture registry lookup maps are immutable");
  });

  it("rejects mutation on ownershipByPackage", () => {
    expect(() => {
      (ownershipByPackage as Map<string, unknown>).set("@afenda/test", {});
    }).toThrow("Architecture registry lookup maps are immutable");
  });

  it("preserves read access on frozen lookup maps", () => {
    expect(packageByName.get("@afenda/kernel")?.registryId).toBe("PKG-010");
    expect(ownershipByPackage.get("@afenda/kernel")?.ownerDomain).toBe(
      "Platform Authority"
    );
    expect(
      getFoundationDispositionEntry("PKGR02_ARCHITECTURE_AUTHORITY")?.packageId
    ).toBe("PKG-019");
  });
});
