import { describe, expect, it } from "vitest";
import {
  resolveMetadataKnowledgeHelpTextFromAtomRef,
  resolveMetadataKnowledgeLabelFromAtomRef,
  resolveMetadataKnowledgeLabelFromFieldKey,
  resolveMetadataPresentationLabelFromAtomRef,
} from "../resolve-metadata-knowledge-label.server";

describe("resolveMetadataKnowledgeLabel (PAS-004 / PAS-006D)", () => {
  it("resolves explicit platform atom refs to metadata short labels", () => {
    expect(resolveMetadataKnowledgeLabelFromAtomRef("atom.tenant.label")).toBe(
      "Tenant (SaaS customer boundary)"
    );
    expect(
      resolveMetadataKnowledgeLabelFromAtomRef("atom.legal-entity.label")
    ).toBe("Company (tenant UI)");
  });

  it("resolves direct knowledge atom ids", () => {
    expect(resolveMetadataKnowledgeLabelFromAtomRef("tenant")).toBe(
      "Tenant (SaaS customer boundary)"
    );
  });

  it("resolves studio presentation atom refs without knowledge atoms", () => {
    expect(
      resolveMetadataPresentationLabelFromAtomRef("atom.marketing.hero-title")
    ).toBe("Hero title");
    expect(resolveMetadataPresentationLabelFromAtomRef("atom.auth.email")).toBe(
      "Email field"
    );
  });

  it("returns undefined for unknown presentation atom refs", () => {
    expect(
      resolveMetadataPresentationLabelFromAtomRef("atom.unknown.ref")
    ).toBeUndefined();
  });

  it("resolves help text from knowledge atom exposure preferredWording", () => {
    expect(
      resolveMetadataKnowledgeHelpTextFromAtomRef("atom.tenant.help")
    ).toBe("Tenant (SaaS customer boundary)");
  });

  it("resolves presentation help text for auth password help atom ref", () => {
    expect(
      resolveMetadataKnowledgeHelpTextFromAtomRef("atom.auth.password.help")
    ).toBe(
      "Use the password for your Afenda account. Never share it with anyone."
    );
  });

  it("resolves field keys to platform vocabulary labels", () => {
    expect(resolveMetadataKnowledgeLabelFromFieldKey("tenantId")).toBe(
      "Tenant (SaaS customer boundary)"
    );
    expect(resolveMetadataKnowledgeLabelFromFieldKey("companyId")).toBe(
      "Company (tenant UI)"
    );
  });
});
