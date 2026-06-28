import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  accessibilityContract,
  classNamePolicyContract,
  componentContract,
  designSystemAuthorityContract,
  erpGovernedExamples,
  exampleContract,
  exportContract,
  motionContract,
  publicExportContract,
  recipeContract,
  slotContract,
  stateContract,
  tokenContract,
  variantContract,
} from "../../index";

const requiredContractFiles = [
  "token.contract.ts",
  "recipe.contract.ts",
  "component.contract.ts",
  "slot.contract.ts",
  "variant.contract.ts",
  "state.contract.ts",
  "motion.contract.ts",
  "accessibility.contract.ts",
  "export.contract.ts",
  "example.contract.ts",
  "class-name-policy.contract.ts",
] as const;

const designSystemContracts = [
  tokenContract,
  variantContract,
  recipeContract,
  componentContract,
  slotContract,
  stateContract,
  motionContract,
  accessibilityContract,
  classNamePolicyContract,
  exportContract,
  exampleContract,
] as const;

const expectedResponsibilities = [
  "value",
  "meaning",
  "styling composition",
  "behavior",
  "structure",
  "UI state",
  "movement safety",
  "interaction safety",
  "layout escape only",
  "public access",
  "AI imitation",
] as const;

const requiredProhibitions = [
  "Invent tokens",
  "Invent component behavior",
  "Define raw CSS values",
  "Define styling",
  "Invent APIs from examples",
  "Override design meaning",
  "Define business logic",
] as const;

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const CONTRACT_ID_PATTERN = /^afenda\.design-system\./u;
const erpBusinessLogicPattern = /\bERP\s+business\s+logic\b/u;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/u;

describe("Foundation phase 04 design-system contracts", () => {
  it("keeps every required contract file present", () => {
    for (const fileName of requiredContractFiles) {
      expect(
        existsSync(join(currentDirectory, "..", fileName)),
        `${fileName} is missing`
      ).toBe(true);
    }
  });

  it("defines required identity and governance metadata for every contract", () => {
    for (const contract of designSystemContracts) {
      expect(contract.contractId).toMatch(CONTRACT_ID_PATTERN);
      expect(contract.version).toMatch(SEMVER_PATTERN);
      expect(contract.owner).toContain("Governed UI");
      expect(contract.purpose.length).toBeGreaterThan(0);
      expect(contract.allowedResponsibility.length).toBeGreaterThan(0);
      expect(contract.prohibitedResponsibility.length).toBeGreaterThan(0);
      expect(contract.downstreamConsumers.length).toBeGreaterThan(0);
      expect(contract.aiGenerationRules.allowed.length).toBeGreaterThan(0);
      expect(contract.aiGenerationRules.forbidden.length).toBeGreaterThan(0);
      expect(contract.acceptanceRules.length).toBeGreaterThan(0);
    }
  });

  it("assigns every responsibility to exactly one contract owner", () => {
    const responsibilities = designSystemContracts.map(
      (contract) => contract.ownedResponsibility
    );

    expect(responsibilities).toEqual([...expectedResponsibilities]);
    expect(new Set(responsibilities).size).toBe(
      expectedResponsibilities.length
    );
  });

  it("declares prohibited responsibility overlap", () => {
    const prohibitedRules = designSystemContracts.flatMap((contract) => [
      ...contract.prohibitedResponsibility,
      ...contract.aiGenerationRules.forbidden,
    ]);

    for (const requiredRule of requiredProhibitions) {
      expect(
        prohibitedRules.some((rule) => rule.includes(requiredRule)),
        `Missing prohibited rule containing "${requiredRule}"`
      ).toBe(true);
    }
    expect(
      designSystemAuthorityContract.prohibitedOverlap.length
    ).toBeGreaterThanOrEqual(10);
  });

  it("publishes every contract through the stable root export surface", () => {
    expect(publicExportContract.stableExports).toEqual(
      expect.arrayContaining([
        "accessibilityContract",
        "classNamePolicyContract",
        "componentContract",
        "exampleContract",
        "exportContract",
        "motionContract",
        "recipeContract",
        "slotContract",
        "stateContract",
        "tokenContract",
        "variantContract",
      ])
    );
  });

  it("keeps contracts free of ERP business logic references", () => {
    for (const contract of designSystemContracts) {
      expect(JSON.stringify(contract)).not.toMatch(erpBusinessLogicPattern);
    }
  });

  it("limits className policy to layout escape only", () => {
    expect(classNamePolicyContract.ownedResponsibility).toBe(
      "layout escape only"
    );
    expect(classNamePolicyContract.allowedResponsibility).toContain(
      "Define layout escape policy"
    );
    expect(classNamePolicyContract.prohibitedResponsibility).toContain(
      "Override design meaning"
    );
  });

  it("marks examples as imitation-only, not authority", () => {
    expect(exampleContract.ownedResponsibility).toBe("AI imitation");
    expect(exampleContract.prohibitedResponsibility).toEqual(
      expect.arrayContaining(["Define public APIs", "Define business rules"])
    );

    for (const example of erpGovernedExamples) {
      expect(example.imitationOnly).toBe(true);
      expect(example.importsFrom).toBe("@afenda/design-system");
    }
  });
});
