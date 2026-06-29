import { describe, expect, it } from "vitest";
import {
  resolveMetadataKnowledgeLabelFromAtomRef,
  resolveMetadataKnowledgeLabelFromFieldKey,
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

  it("returns undefined for presentation-only atom refs", () => {
    expect(
      resolveMetadataKnowledgeLabelFromAtomRef("atom.marketing.hero-title")
    ).toBeUndefined();
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
