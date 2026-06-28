import { describe, expect, it } from "vitest";
import type { AcceptingAuthorityEntity } from "../contracts/accepting-authority.contract.js";
import { ENTERPRISE_KNOWLEDGE_ATOMS } from "../data/knowledge.registry.js";
import {
  ACCEPTING_AUTHORITY_ENTITIES,
  type AcceptingAuthorityId,
  getAcceptingAuthority,
  isAcceptingAuthorityId,
  isResolvableAcceptingAuthorityRef,
  resolveAcceptingAuthorityRef,
} from "../index.js";

describe("Accepting Authority Registry (PAS-004A §4.5)", () => {
  it("exports a non-empty registry of typed authority entities", () => {
    expect(ACCEPTING_AUTHORITY_ENTITIES.length).toBeGreaterThan(0);
  });

  it("every entity has required fields", () => {
    for (const entity of ACCEPTING_AUTHORITY_ENTITIES) {
      expect(typeof entity.authorityId).toBe("string");
      expect(entity.authorityId.length).toBeGreaterThan(0);
      expect(typeof entity.name).toBe("string");
      expect(entity.name.length).toBeGreaterThan(0);
      expect(typeof entity.jurisdictionScope).toBe("string");
      expect(typeof entity.classification).toBe("string");
    }
  });

  it("authority IDs are unique", () => {
    const ids = ACCEPTING_AUTHORITY_ENTITIES.map((e) => e.authorityId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getAcceptingAuthority returns correct entity", () => {
    const arch = getAcceptingAuthority("afenda_architecture_authority");
    expect(arch.jurisdictionScope).toBe("organizational");
    expect(arch.classification).toBe("architecture_committee");
  });

  it("getAcceptingAuthority throws for unknown id", () => {
    expect(() =>
      getAcceptingAuthority("unknown_authority" as AcceptingAuthorityId)
    ).toThrow(/Unknown accepting authority/);
  });

  it("isAcceptingAuthorityId correctly identifies known IDs", () => {
    expect(isAcceptingAuthorityId("afenda_architecture_authority")).toBe(true);
    expect(isAcceptingAuthorityId("iasb")).toBe(true);
    expect(isAcceptingAuthorityId("not_an_authority")).toBe(false);
  });

  it("IASB entity is classified as standards_body with global scope", () => {
    const iasb = getAcceptingAuthority("iasb");
    expect(iasb.jurisdictionScope).toBe("global");
    expect(iasb.classification).toBe("standards_body");
    expect(iasb.standardBody).toBe("IASB");
  });

  it("registry entities satisfy AcceptingAuthorityEntity contract (serializable)", () => {
    const serialized = JSON.parse(
      JSON.stringify(ACCEPTING_AUTHORITY_ENTITIES)
    ) as AcceptingAuthorityEntity[];
    expect(serialized).toHaveLength(ACCEPTING_AUTHORITY_ENTITIES.length);
    const first = serialized[0];
    const firstEntity = ACCEPTING_AUTHORITY_ENTITIES[0];
    expect(first?.authorityId).toBe(firstEntity?.authorityId);
  });

  it("resolves legacy ACCEPTING_AUTHORITIES enum refs to canonical entities", () => {
    const resolved = resolveAcceptingAuthorityRef("architecture_authority");
    expect(resolved?.authorityId).toBe("afenda_architecture_authority");
    expect(isResolvableAcceptingAuthorityRef("erp_authority")).toBe(true);
    expect(isResolvableAcceptingAuthorityRef("unknown_authority")).toBe(false);
  });

  it("every acceptanceChain.by in atoms.json resolves via registry or alias", () => {
    for (const atom of ENTERPRISE_KNOWLEDGE_ATOMS) {
      for (const entry of atom.acceptanceChain) {
        expect(
          isResolvableAcceptingAuthorityRef(entry.by),
          `${atom.atomId} chain step by=${entry.by}`
        ).toBe(true);
      }
    }
  });
});
