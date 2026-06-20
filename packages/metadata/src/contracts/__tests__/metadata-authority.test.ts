import { describe, expect, it } from "vitest";
import {
  layoutContract,
  metadataAuthorityMap,
  metadataContract,
  presentationContract,
  registryContract,
  rendererContract,
  runtimeContract,
  sectionContract,
  surfaceContract,
} from "../index.js";

const requiredContracts = {
  layout: layoutContract,
  metadata: metadataContract,
  presentation: presentationContract,
  registry: registryContract,
  renderer: rendererContract,
  runtime: runtimeContract,
  section: sectionContract,
  surface: surfaceContract,
} as const;

const expectedAuthorityOwners = [
  "vocabulary",
  "surface definitions",
  "arrangement",
  "content zones",
  "resolution",
  "registration",
  "viewing modes",
  "execution context",
] as const;

describe("metadata authority contracts", () => {
  it("exports every TIP-005 contract", () => {
    expect(Object.keys(requiredContracts).sort()).toEqual([
      "layout",
      "metadata",
      "presentation",
      "registry",
      "renderer",
      "runtime",
      "section",
      "surface",
    ]);

    for (const [contractId, contract] of Object.entries(requiredContracts)) {
      expect(contract.contractId).toBe(contractId);
      expect(contract.owner).toBe("Metadata");
      expect(contract.owns.length).toBeGreaterThan(0);
      expect(contract.mustNotOwn.length).toBeGreaterThan(0);
    }
  });

  it("publishes a single metadata authority decision table", () => {
    expect(Object.keys(metadataAuthorityMap).sort()).toEqual(
      Object.keys(requiredContracts).sort(),
    );

    for (const authority of Object.values(metadataAuthorityMap)) {
      expect(authority.contractFile).toBe(`${authority.authority}.contract.ts`);
      expect(authority.purpose.length).toBeGreaterThan(0);
    }
  });

  it("assigns every authority responsibility to exactly one owner", () => {
    const authorityOwners = Object.values(metadataAuthorityMap).map(
      (authority) => authority.owns,
    );

    expect(authorityOwners.sort()).toEqual([...expectedAuthorityOwners].sort());
    expect(new Set(authorityOwners).size).toBe(authorityOwners.length);
  });

  it("prevents overlapping contract ownership", () => {
    const ownershipClaims = Object.values(requiredContracts).flatMap(
      (contract) => contract.owns,
    );

    expect(new Set(ownershipClaims).size).toBe(ownershipClaims.length);
  });

  it("keeps prohibited responsibilities outside owned responsibilities", () => {
    for (const contract of Object.values(requiredContracts)) {
      const ownedResponsibilities = new Set<string>(contract.owns);

      for (const prohibitedResponsibility of contract.mustNotOwn) {
        expect(ownedResponsibilities.has(prohibitedResponsibility)).toBe(false);
      }
    }
  });
});
