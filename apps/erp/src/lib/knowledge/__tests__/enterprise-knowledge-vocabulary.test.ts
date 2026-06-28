import { describe, expect, it } from "vitest";

import {
  getEnterpriseKnowledgePreferredWording,
  getSystemAdminSectionKnowledgeTitle,
  getSystemAdminSectionKnowledgeWording,
  isSystemAdminKnowledgeSectionId,
  listSystemAdminKnowledgeAtomIds,
  resolveKnowledgeAtomIdFromString,
} from "../enterprise-knowledge-vocabulary.server";

describe("enterprise-knowledge-vocabulary (PAS-004A B27/B32 consumer proof)", () => {
  it("imports getKnowledgeAtom via production vocabulary helper", () => {
    const wording = getEnterpriseKnowledgePreferredWording("legal_entity");
    expect(wording).toContain("Legal Entity");
  });

  it("resolves system admin section wording from authoritative atoms", () => {
    expect(getSystemAdminSectionKnowledgeWording("legal-entity")).toContain(
      "Legal Entity"
    );
    expect(getSystemAdminSectionKnowledgeWording("tenant")).toContain("Tenant");
    expect(getSystemAdminSectionKnowledgeWording("permission-scope")).toContain(
      "Permission"
    );
  });

  it("derives serializable section titles from atom business meaning", () => {
    expect(getSystemAdminSectionKnowledgeTitle("tenant")).toBe(
      "Customer account / tenant"
    );
    expect(getSystemAdminSectionKnowledgeTitle("legal-entity")).toBe(
      "A company"
    );
  });

  it("narrows system admin knowledge section ids", () => {
    expect(isSystemAdminKnowledgeSectionId("legal-entity")).toBe(true);
    expect(isSystemAdminKnowledgeSectionId("tenant")).toBe(true);
    expect(isSystemAdminKnowledgeSectionId("permission-scope")).toBe(true);
    expect(isSystemAdminKnowledgeSectionId("workspace")).toBe(false);
  });

  it("lists wired system-admin atom ids for integration surfaces", () => {
    expect(listSystemAdminKnowledgeAtomIds()).toEqual([
      "tenant",
      "legal_entity",
      "permission_scope",
    ]);
  });

  it("resolves known atom ids from strings", () => {
    expect(resolveKnowledgeAtomIdFromString("workspace")).toBe("workspace");
    expect(resolveKnowledgeAtomIdFromString("operating_context")).toBe(
      "operating_context"
    );
    expect(resolveKnowledgeAtomIdFromString("unknown")).toBeUndefined();
  });
});
