import { describe, expect, it } from "vitest";
import { METADATA_LIFECYCLES } from "../metadata.constants.js";
import {
  METADATA_CONTRACT_GOVERNANCE_RULES,
  METADATA_CONTRACT_OWNERSHIPS,
  METADATA_CONTRACT_PROHIBITIONS,
  metadataContract,
} from "../metadata.contract.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("metadataContract", () => {
  it("declares metadata authority", () => {
    expect(metadataContract.authority).toBe("metadata");
  });

  it("uses the canonical metadata contract version", () => {
    expect(metadataContract.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("owns only canonical metadata responsibilities", () => {
    expect(metadataContract.owns).toEqual(METADATA_CONTRACT_OWNERSHIPS);
  });

  it("exposes canonical metadata lifecycles", () => {
    expect(metadataContract.lifecycle).toEqual(METADATA_LIFECYCLES);
  });

  it("declares canonical governance rules", () => {
    expect(metadataContract.governance).toEqual(
      METADATA_CONTRACT_GOVERNANCE_RULES
    );
  });

  it("declares canonical prohibitions", () => {
    expect(metadataContract.prohibits).toEqual(METADATA_CONTRACT_PROHIBITIONS);
  });

  it("does not contain duplicate contract values", () => {
    expectUniqueValues(metadataContract.owns);
    expectUniqueValues(metadataContract.lifecycle);
    expectUniqueValues(metadataContract.governance);
    expectUniqueValues(metadataContract.prohibits);
  });

  it("does not own prohibited responsibilities", () => {
    const owns = new Set(metadataContract.owns);

    for (const prohibited of metadataContract.prohibits) {
      expect(owns.has(prohibited as never)).toBe(false);
    }
  });

  it("keeps metadata package governance-only", () => {
    expect(metadataContract.prohibits).toEqual(
      expect.arrayContaining([
        "ui-implementation",
        "react-components",
        "renderers",
        "css",
        "tailwind",
        "business-logic",
        "database-access",
        "permission-execution",
      ])
    );
  });
});
