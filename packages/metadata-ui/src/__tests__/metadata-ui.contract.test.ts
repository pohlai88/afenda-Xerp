import { describe, expect, it } from "vitest";

import {
  METADATA_UI_AUTHORITY,
  METADATA_UI_CONSUMES,
  METADATA_UI_CONTRACT_VERSION,
  METADATA_UI_DOES_NOT_OWN,
  METADATA_UI_OWNS,
  METADATA_UI_PACKAGE_NAME,
  METADATA_UI_PROHIBITS,
  metadataUiContract,
} from "../contracts/metadata-ui.contract.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("metadataUiContract", () => {
  it("declares the metadata-ui package authority", () => {
    expect(metadataUiContract.packageName).toBe(METADATA_UI_PACKAGE_NAME);
    expect(metadataUiContract.authority).toBe(METADATA_UI_AUTHORITY);
    expect(metadataUiContract.version).toBe(METADATA_UI_CONTRACT_VERSION);
  });

  it("consumes metadata authority without owning metadata vocabulary", () => {
    expect(metadataUiContract.consumes).toEqual(METADATA_UI_CONSUMES);
    expect(metadataUiContract.consumes).toContain("@afenda/metadata");

    expect(METADATA_UI_DOES_NOT_OWN).toContain("metadata authority");
    expect(METADATA_UI_DOES_NOT_OWN).toContain("metadata vocabulary");
    expect(METADATA_UI_DOES_NOT_OWN).toContain("surface vocabulary");
    expect(METADATA_UI_DOES_NOT_OWN).toContain("layout vocabulary");
    expect(METADATA_UI_DOES_NOT_OWN).toContain("section vocabulary");
  });

  it("owns metadata UI rendering responsibilities", () => {
    expect(metadataUiContract.owns).toEqual(METADATA_UI_OWNS);
    expect(METADATA_UI_OWNS).toContain("metadata rendering");
    expect(METADATA_UI_OWNS).toContain("surface composition");
    expect(METADATA_UI_OWNS).toContain("layout rendering");
    expect(METADATA_UI_OWNS).toContain("section rendering");
    expect(METADATA_UI_OWNS).toContain("renderer resolution");
    expect(METADATA_UI_OWNS).toContain("renderer registry");
  });

  it("prohibits authority drift", () => {
    expect(metadataUiContract.prohibits).toEqual(METADATA_UI_PROHIBITS);
    expect(METADATA_UI_PROHIBITS).toContain("defining metadata vocabulary");
    expect(METADATA_UI_PROHIBITS).toContain("defining design tokens");
    expect(METADATA_UI_PROHIBITS).toContain(
      "executing database writes directly"
    );
    expect(METADATA_UI_PROHIBITS).toContain("owning ERP business rules");
  });

  it("pins upstream metadata contract compatibility", () => {
    expect(metadataUiContract.metadataContractVersion).toBeDefined();
    expect(typeof metadataUiContract.metadataContractVersion).toBe("string");
  });

  it("does not contain duplicate values in governed arrays", () => {
    expectUniqueValues(metadataUiContract.consumes);
    expectUniqueValues(metadataUiContract.owns);
    expectUniqueValues(metadataUiContract.doesNotOwn);
    expectUniqueValues(metadataUiContract.prohibits);
  });

  it("does not own prohibited responsibilities", () => {
    const owns = new Set(metadataUiContract.owns);

    for (const prohibited of metadataUiContract.doesNotOwn) {
      expect(owns.has(prohibited as never)).toBe(false);
    }
  });
});
