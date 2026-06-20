import { describe, expect, it } from "vitest";
import {
  CROSS_PACKAGE_NAMES,
  crossPackageAuthority,
  layoutContract,
  metadataAiGovernanceRules,
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

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/u;

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

  it("carries version and purpose on every contract", () => {
    for (const contract of Object.values(requiredContracts)) {
      expect(
        contract.version,
        `${contract.contractId} must carry a semver version`
      ).toMatch(SEMVER_PATTERN);
      expect(
        contract.purpose.length,
        `${contract.contractId} must have a non-empty purpose`
      ).toBeGreaterThan(0);
    }
  });

  it("publishes a single metadata authority decision table", () => {
    expect(Object.keys(metadataAuthorityMap).sort()).toEqual(
      Object.keys(requiredContracts).sort()
    );

    for (const authority of Object.values(metadataAuthorityMap)) {
      expect(authority.contractFile).toBe(`${authority.authority}.contract.ts`);
      expect(authority.purpose.length).toBeGreaterThan(0);
    }
  });

  it("assigns every authority responsibility to exactly one owner", () => {
    const authorityOwners = Object.values(metadataAuthorityMap).map(
      (authority) => authority.owns
    );

    expect(authorityOwners.sort()).toEqual([...expectedAuthorityOwners].sort());
    expect(new Set(authorityOwners).size).toBe(authorityOwners.length);
  });

  it("prevents overlapping contract ownership", () => {
    const ownershipClaims = Object.values(requiredContracts).flatMap(
      (contract) => contract.owns
    );

    expect(new Set(ownershipClaims).size).toBe(ownershipClaims.length);
  });

  it("keeps prohibited responsibilities outside owned responsibilities", () => {
    for (const contract of Object.values(requiredContracts)) {
      const ownedResponsibilities = new Set<string>(contract.owns);

      for (const prohibitedResponsibility of contract.mustNotOwn) {
        expect(
          ownedResponsibilities.has(prohibitedResponsibility),
          `${contract.contractId}: prohibited responsibility "${prohibitedResponsibility}" must not appear in owns`
        ).toBe(false);
      }
    }
  });

  it("declares AI governance rules with may and mayNot lists", () => {
    expect(metadataAiGovernanceRules.may.length).toBeGreaterThan(0);
    expect(metadataAiGovernanceRules.mayNot.length).toBeGreaterThan(0);

    const mayNotJoined = metadataAiGovernanceRules.mayNot
      .join(" ")
      .toLowerCase();
    expect(mayNotJoined).toContain("invent");
    expect(
      metadataAiGovernanceRules.mayNot.some((rule) =>
        rule.includes("@afenda/metadata")
      )
    ).toBe(true);
  });

  it("declares cross-package authority for all governed packages", () => {
    expect(crossPackageAuthority.packages.length).toBe(
      CROSS_PACKAGE_NAMES.length
    );
    expect(crossPackageAuthority.noOverlapRule.length).toBeGreaterThan(0);
    expect(crossPackageAuthority.tip005IntegrationRule).toContain(
      "@afenda/metadata-ui"
    );

    for (const entry of crossPackageAuthority.packages) {
      expect(CROSS_PACKAGE_NAMES).toContain(entry.package);
      expect(entry.owns.length).toBeGreaterThan(0);
      expect(entry.mayNotOwn.length).toBeGreaterThan(0);
      expect(entry.role.length).toBeGreaterThan(0);
    }
  });

  it("prevents cross-package ownership overlap", () => {
    const ownershipMap = new Map<string, string>();

    for (const entry of crossPackageAuthority.packages) {
      for (const responsibility of entry.owns) {
        expect(
          ownershipMap.has(responsibility),
          `"${responsibility}" is claimed by both "${ownershipMap.get(responsibility)}" and "${entry.package}"`
        ).toBe(false);
        ownershipMap.set(responsibility, entry.package);
      }
    }
  });

  it("constrains RendererCompatibilityRule.sectionType to governed SectionType", () => {
    const governedSectionTypes = new Set(
      sectionContract.owns.map((own) => own.replace(" sections", ""))
    );

    for (const capability of rendererContract.owns) {
      expect(capability.length).toBeGreaterThan(0);
    }

    expect(governedSectionTypes.has("list")).toBe(true);
    expect(governedSectionTypes.has("form")).toBe(true);
    expect(governedSectionTypes.has("audit")).toBe(true);
  });

  it("constrains RegistryEntry.authority to MetadataAuthorityKey", () => {
    for (const key of Object.keys(metadataAuthorityMap)) {
      expect(
        metadataAuthorityMap[key as keyof typeof metadataAuthorityMap].authority
      ).toBe(key);
    }
  });
});
