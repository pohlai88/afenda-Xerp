import { describe, expect, it } from "vitest";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";
import {
  createRegistryEntry,
  createRegistryEntryId,
  REGISTRY_CONTRACT_OWNERSHIPS,
  REGISTRY_CONTRACT_PROHIBITIONS,
  registryContract,
} from "../registry.contract.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("registryContract", () => {
  it("declares registry authority", () => {
    expect(registryContract.authority).toBe("registry");
  });

  it("uses the canonical metadata contract version", () => {
    expect(registryContract.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("owns only canonical registry responsibilities", () => {
    expect(registryContract.owns).toEqual(REGISTRY_CONTRACT_OWNERSHIPS);
  });

  it("declares canonical registry prohibitions", () => {
    expect(registryContract.prohibits).toEqual(REGISTRY_CONTRACT_PROHIBITIONS);
  });

  it("does not contain duplicate values", () => {
    expectUniqueValues(registryContract.owns);
    expectUniqueValues(registryContract.prohibits);
  });

  it("does not own prohibited responsibilities", () => {
    const owns = new Set(registryContract.owns);

    for (const prohibited of registryContract.prohibits) {
      expect(owns.has(prohibited as never)).toBe(false);
    }
  });

  it("keeps registry governance separate from rendering and business logic", () => {
    expect(registryContract.prohibits).toEqual(
      expect.arrayContaining([
        "rendering-implementation",
        "renderer-implementation",
        "ui-components",
        "business-logic",
        "database-access",
        "permission-execution",
      ])
    );
  });
});

describe("RegistryEntry", () => {
  it("supports a governed registry entry shape", () => {
    const entry = createRegistryEntry({
      id: "layout.dashboard",
      authority: "layout",
      ownerPackage: "@afenda/ui-composition",
      lifecycle: "active",
      version: "0.1.0",
    });

    expect(entry.id).toBe("layout.dashboard");
    expect(entry.authority).toBe("layout");
    expect(entry.lifecycle).toBe("active");
  });

  it("rejects empty registry entry identifiers", () => {
    expect(() => createRegistryEntryId("   ")).toThrow(
      /Registry entry id must not be empty/
    );
  });

  it("rejects invalid registry entry versions", () => {
    expect(() =>
      createRegistryEntry({
        id: "renderer.list",
        authority: "renderer",
        ownerPackage: "@afenda/metadata-ui",
        lifecycle: "active",
        version: "not-semver",
      })
    ).toThrow(/semver/);
  });
});
