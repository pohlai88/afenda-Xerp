import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { KNOWLEDGE_REGISTRY_LOADER_MAX_LINES } from "../constants/knowledge-json-authority.js";
import {
  validateAtomCorpus,
  validateEdgeCorpus,
} from "../data/knowledge-data.schema.js";
import {
  ENTERPRISE_KNOWLEDGE_ATOMS,
  KNOWLEDGE_ATOM_IDS,
  KNOWLEDGE_EDGES,
  KNOWLEDGE_RELATIONSHIPS,
  validateKnowledgeRegistry,
} from "../index.js";

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dataDir = join(pkgRoot, "src/data");

function dirname(p: string): string {
  return p.slice(0, Math.max(p.lastIndexOf("/"), p.lastIndexOf("\\")) + 1);
}

describe("JSON data authority — atoms.json", () => {
  it("atoms.json parses as valid JSON", () => {
    const raw = readFileSync(join(dataDir, "atoms.json"), "utf8");
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it("atoms.json round-trips through JSON.parse/stringify without data loss", () => {
    const raw = readFileSync(join(dataDir, "atoms.json"), "utf8");
    const parsed = JSON.parse(raw);
    const reparsed = JSON.parse(JSON.stringify(parsed));
    expect(reparsed).toEqual(parsed);
  });

  it("knowledge.registry.ts is a thin loader — no inline atom literals", () => {
    const loaderSrc = readFileSync(
      join(dataDir, "knowledge.registry.ts"),
      "utf8"
    );
    expect(loaderSrc).not.toMatch(/atomId:\s*["']/);
    expect(loaderSrc).not.toMatch(/acceptanceChain:/);
    expect(loaderSrc.split("\n").length).toBeLessThanOrEqual(
      KNOWLEDGE_REGISTRY_LOADER_MAX_LINES
    );
  });

  it("atoms.json contains forty-seven typed atoms with frozen B24 prefix", () => {
    const raw = JSON.parse(
      readFileSync(join(dataDir, "atoms.json"), "utf8")
    ) as unknown[];
    expect(raw).toHaveLength(47);
  });

  it("all B24 atom IDs are present in atoms.json byte-for-byte", () => {
    const ids = ENTERPRISE_KNOWLEDGE_ATOMS.map((a) => a.atomId);
    for (const expected of KNOWLEDGE_ATOM_IDS) {
      expect(ids).toContain(expected);
    }
  });

  it("loads atoms via parseAtomCorpus after JSON validation (DoD #1)", () => {
    expect(
      ENTERPRISE_KNOWLEDGE_ATOMS.every((atom) => atom.ownedByPas === "PAS-004")
    ).toBe(true);
    expect([...KNOWLEDGE_ATOM_IDS]).toEqual(
      ENTERPRISE_KNOWLEDGE_ATOMS.map((atom) => atom.atomId)
    );
  });

  it("JSON schema validation finds no errors in atoms.json", () => {
    const raw = JSON.parse(
      readFileSync(join(dataDir, "atoms.json"), "utf8")
    ) as unknown[];
    const errors = validateAtomCorpus(raw);
    expect(errors).toEqual([]);
  });

  it("constitutional policy validation passes (loaded from JSON)", () => {
    expect(validateKnowledgeRegistry()).toEqual([]);
  });
});

describe("JSON data authority — edges.json", () => {
  it("edges.json parses as valid JSON", () => {
    const raw = readFileSync(join(dataDir, "edges.json"), "utf8");
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  it("edges.json round-trips through JSON.parse/stringify without data loss", () => {
    const raw = readFileSync(join(dataDir, "edges.json"), "utf8");
    const parsed = JSON.parse(raw);
    const reparsed = JSON.parse(JSON.stringify(parsed));
    expect(reparsed).toEqual(parsed);
  });

  it("JSON schema validation finds no edge errors in edges.json", () => {
    const atomIds = new Set(KNOWLEDGE_ATOM_IDS as readonly string[]);
    const raw = JSON.parse(
      readFileSync(join(dataDir, "edges.json"), "utf8")
    ) as unknown[];
    const errors = validateEdgeCorpus(raw, atomIds);
    expect(errors).toEqual([]);
  });

  it("KNOWLEDGE_EDGES loads 13 edges from edges.json (10 legacy + 3 semantic B42)", () => {
    expect(KNOWLEDGE_EDGES).toHaveLength(13);
  });

  it("KNOWLEDGE_EDGES uses edgeId (not relationshipId)", () => {
    for (const edge of KNOWLEDGE_EDGES) {
      expect(edge).toHaveProperty("edgeId");
      expect(typeof edge.edgeId).toBe("string");
    }
  });

  it("KNOWLEDGE_RELATIONSHIPS backward-compat alias uses relationshipId", () => {
    for (const rel of KNOWLEDGE_RELATIONSHIPS) {
      expect(rel).toHaveProperty("relationshipId");
      expect(typeof rel.relationshipId).toBe("string");
    }
    expect(KNOWLEDGE_RELATIONSHIPS).toHaveLength(10);
    expect(KNOWLEDGE_RELATIONSHIPS.length).toBeLessThan(KNOWLEDGE_EDGES.length);
  });
});
