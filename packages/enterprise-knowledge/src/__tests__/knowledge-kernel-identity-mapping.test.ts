import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { KnowledgeAtom } from "../contracts/knowledge-atom.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import {
  isIdentityConstitutionEvidencePath,
  isPlatformIdentityAtomId,
  isProhibitedIdentityKernelEvidencePath,
  PLATFORM_ENTITY_KERNEL_CONTRACT_PATHS,
  PLATFORM_IDENTITY_ATOM_IDS,
  REQUIRED_IDENTITY_BRANDED_IDS,
  TENANT_HIERARCHY_IDENTITY_CONTRACT_PATH,
  validateKnowledgeKernelIdentityMapping,
} from "../policy/knowledge-kernel-identity-mapping.policy.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));

describe("Knowledge kernel identity mapping (PAS-004B §4.1 · B33)", () => {
  it("defines five platform identity atom IDs", () => {
    expect(PLATFORM_IDENTITY_ATOM_IDS).toEqual([
      "tenant",
      "legal_entity",
      "organization_unit",
      "workspace",
      "surface",
    ]);
  });

  it("flags parser and assert paths as prohibited", () => {
    expect(
      isProhibitedIdentityKernelEvidencePath(
        "packages/kernel/src/identity/families/tenant-hierarchy-id.parser.ts"
      )
    ).toBe(true);
    expect(
      isProhibitedIdentityKernelEvidencePath(
        "packages/kernel/src/context/tenant-context.assert.ts"
      )
    ).toBe(true);
    expect(
      isProhibitedIdentityKernelEvidencePath(
        "packages/kernel/src/context/tenant-context.contract.ts"
      )
    ).toBe(false);
  });

  it("accepts identity and platform registry contract paths", () => {
    expect(
      isIdentityConstitutionEvidencePath(
        TENANT_HIERARCHY_IDENTITY_CONTRACT_PATH
      )
    ).toBe(true);
    expect(
      isIdentityConstitutionEvidencePath(
        PLATFORM_ENTITY_KERNEL_CONTRACT_PATHS.legal_entity
      )
    ).toBe(true);
    expect(
      isIdentityConstitutionEvidencePath(
        "packages/database/src/schema/tenant.schema.ts"
      )
    ).toBe(false);
  });

  it("live platform identity atoms pass identity mapping validation", () => {
    const identityAtoms = ENTERPRISE_KNOWLEDGE_ATOMS.filter((atom) =>
      isPlatformIdentityAtomId(atom.atomId)
    );
    expect(identityAtoms).toHaveLength(PLATFORM_IDENTITY_ATOM_IDS.length);

    const errors = validateKnowledgeKernelIdentityMapping(
      ENTERPRISE_KNOWLEDGE_ATOMS,
      { repoRoot }
    );
    expect(errors).toEqual([]);
  });

  it("requires implementationMapping.contractPath and brandedId for tenant", () => {
    const tenant = ENTERPRISE_KNOWLEDGE_ATOMS.find(
      (atom) => atom.atomId === "tenant"
    );
    expect(tenant?.implementationMapping).toBeDefined();
    expect(tenant?.implementationMapping?.contractPath).toBe(
      PLATFORM_ENTITY_KERNEL_CONTRACT_PATHS.tenant
    );
    expect(tenant?.implementationMapping?.brandedId).toBe(
      REQUIRED_IDENTITY_BRANDED_IDS.tenant
    );
  });

  it("rejects missing implementationMapping on platform identity atoms", () => {
    const tenant = ENTERPRISE_KNOWLEDGE_ATOMS.find(
      (atom) => atom.atomId === "tenant"
    );
    if (!tenant) {
      throw new Error("expected tenant atom");
    }
    const { implementationMapping: _mapping, ...withoutMapping } = tenant;
    const atom = withoutMapping as KnowledgeAtom;

    const errors = validateKnowledgeKernelIdentityMapping([atom], {
      repoRoot: process.cwd(),
      fileExists: () => true,
    });

    expect(
      errors.some((error) => error.includes("requires implementationMapping"))
    ).toBe(true);
  });

  it("rejects wrong brandedId for legal_entity", () => {
    const legalEntity = ENTERPRISE_KNOWLEDGE_ATOMS.find(
      (atom) => atom.atomId === "legal_entity"
    );
    if (!legalEntity?.implementationMapping) {
      throw new Error("expected legal_entity mapping");
    }
    const atom: KnowledgeAtom = {
      ...legalEntity,
      implementationMapping: {
        ...legalEntity.implementationMapping,
        brandedId: "LegalEntityId",
        contractPath: PLATFORM_ENTITY_KERNEL_CONTRACT_PATHS.legal_entity,
      },
    };

    const errors = validateKnowledgeKernelIdentityMapping([atom], {
      repoRoot: process.cwd(),
      fileExists: () => true,
    });

    expect(
      errors.some((error) =>
        error.includes("implementationMapping.brandedId must be CompanyId")
      )
    ).toBe(true);
  });
});
