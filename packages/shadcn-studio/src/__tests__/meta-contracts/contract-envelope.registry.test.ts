import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  diffL1ContractEnvelopeRegistry,
  FORBIDDEN_L1_CONTRACT_PATHS,
  formatL1ContractEnvelopeInventoryDiff,
  L1_CONTRACT_ENVELOPE_FILES,
  L1_CONTRACT_ENVELOPE_MARKER,
  L1_CONTRACT_ENVELOPE_REFACTORED,
  L1_CONTRACT_ENVELOPE_REGISTRY,
  L1_CONTRACT_ENVELOPE_SERIES,
  L1_CONTRACT_REGISTRY_EXCLUDED_FILES,
} from "../../meta-contracts/_contract-envelope.registry.js";

const contractsDir = join(import.meta.dirname, "../../meta-contracts");

function discoverFlatL1ContractFiles(): string[] {
  return readdirSync(contractsDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !entry.name.startsWith("_") &&
        !L1_CONTRACT_REGISTRY_EXCLUDED_FILES.includes(
          entry.name as (typeof L1_CONTRACT_REGISTRY_EXCLUDED_FILES)[number]
        )
    )
    .map((entry) => entry.name)
    .sort();
}

describe("L1 contract envelope registry", () => {
  const discovered = discoverFlatL1ContractFiles();
  const diff = diffL1ContractEnvelopeRegistry(discovered);

  it("registry count matches total flat contracts/ files on disk", () => {
    expect(diff, formatL1ContractEnvelopeInventoryDiff(diff)).toEqual({
      registeredCount: discovered.length,
      discoveredCount: discovered.length,
      missingOnDisk: [],
      discoveredOnly: [],
    });
  });

  it("lists exact registered file set (no extras, no omissions)", () => {
    expect(L1_CONTRACT_ENVELOPE_FILES.slice().sort()).toEqual(discovered);
    expect(L1_CONTRACT_ENVELOPE_REGISTRY.length).toBe(discovered.length);
  });

  it("every registry entry maps to an on-disk file with envelope header", () => {
    for (const entry of L1_CONTRACT_ENVELOPE_REGISTRY) {
      const filePath = join(contractsDir, entry.file);
      expect(existsSync(filePath), `${entry.file} must exist`).toBe(true);

      const source = readFileSync(filePath, "utf8");
      expect(source, `${entry.file} envelope marker`).toContain(
        L1_CONTRACT_ENVELOPE_MARKER
      );
      expect(source, `${entry.file} family line`).toMatch(
        new RegExp(`Family:\\s*${entry.family}`)
      );
      expect(entry.refactored, `${entry.file} refactor date`).toBe(
        L1_CONTRACT_ENVELOPE_REFACTORED
      );
    }
  });

  it("forbidden legacy paths must not exist under contracts/", () => {
    for (const forbidden of FORBIDDEN_L1_CONTRACT_PATHS) {
      expect(
        existsSync(join(contractsDir, forbidden)),
        `forbidden path must not exist: meta-meta-contracts/${forbidden}`
      ).toBe(false);
    }
  });

  it("exports flat-L1 series metadata for envelope headers", () => {
    expect(L1_CONTRACT_ENVELOPE_SERIES).toBe("flat-L1");
    expect(L1_CONTRACT_ENVELOPE_MARKER).toBe("@afenda.l1-contract-envelope");
  });

  it("every discovered file has a unique registry family entry", () => {
    const files = L1_CONTRACT_ENVELOPE_REGISTRY.map((entry) => entry.file);
    expect(new Set(files).size).toBe(files.length);
  });
});
