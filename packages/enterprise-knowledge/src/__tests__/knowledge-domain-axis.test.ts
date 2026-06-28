import { describe, expect, it } from "vitest";
import { KNOWLEDGE_DOMAINS } from "../contracts/knowledge-atom.contract.js";
import type { KnowledgeDomainEntry } from "../contracts/knowledge-domain-registry.contract.js";
import {
  getKnowledgeDomainClass,
  getKnowledgeDomainEntry,
  KNOWLEDGE_DOMAIN_ENTRIES,
} from "../data/domains.registry.js";
import {
  ARCHITECTURE_KNOWLEDGE_DOMAINS,
  BUSINESS_KNOWLEDGE_DOMAINS,
  filterByDomainClass,
  getKnowledgeDomainsByClass,
  validateKnowledgeDomainAxis,
} from "../policy/knowledge-domain-axis.policy.js";

describe("PAS-004C §4.5 — domain axis split (B40)", () => {
  it("registers domainClass for all 17 KNOWLEDGE_DOMAINS", () => {
    expect(KNOWLEDGE_DOMAIN_ENTRIES).toHaveLength(KNOWLEDGE_DOMAINS.length);
    for (const domain of KNOWLEDGE_DOMAINS) {
      expect(() => getKnowledgeDomainEntry(domain)).not.toThrow();
    }
    expect(validateKnowledgeDomainAxis()).toEqual([]);
  });

  it("classifies platform, architecture, engineering, api as architecture", () => {
    for (const domain of ARCHITECTURE_KNOWLEDGE_DOMAINS) {
      expect(getKnowledgeDomainClass(domain)).toBe("architecture");
    }
  });

  it("classifies accounting, hr, finance as business", () => {
    for (const domain of BUSINESS_KNOWLEDGE_DOMAINS) {
      expect(getKnowledgeDomainClass(domain)).toBe("business");
    }
  });

  it("filterByDomainClass returns only matching entries", () => {
    const architectureEntries = filterByDomainClass("architecture");
    expect(architectureEntries.length).toBeGreaterThan(0);
    for (const entry of architectureEntries) {
      expect(entry.domainClass).toBe("architecture");
    }

    const businessEntries = filterByDomainClass("business");
    expect(businessEntries.length).toBeGreaterThan(0);
    for (const entry of businessEntries) {
      expect(entry.domainClass).toBe("business");
    }

    expect(filterByDomainClass("knowledge")).toEqual([]);
  });

  it("getKnowledgeDomainsByClass returns domain tags only", () => {
    const architectureDomains = getKnowledgeDomainsByClass("architecture");
    expect(architectureDomains).toContain("platform");
    expect(architectureDomains).toContain("engineering");
    expect(architectureDomains).not.toContain("accounting");
  });

  it("every entry satisfies KnowledgeDomainEntry shape", () => {
    for (const entry of KNOWLEDGE_DOMAIN_ENTRIES) {
      const shaped: KnowledgeDomainEntry = entry;
      expect(shaped.domain.length).toBeGreaterThan(0);
      expect(shaped.label.length).toBeGreaterThan(0);
      expect(["business", "architecture", "knowledge"]).toContain(
        shaped.domainClass
      );
    }
  });
});
