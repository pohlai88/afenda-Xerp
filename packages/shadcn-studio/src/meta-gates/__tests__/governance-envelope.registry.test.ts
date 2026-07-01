import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  diffGovernanceEnvelopeRegistry,
  formatGovernanceEnvelopeInventoryDiff,
  GOVERNANCE_ENVELOPE_FILES,
  GOVERNANCE_ENVELOPE_MARKER,
  GOVERNANCE_ENVELOPE_REFACTORED,
  GOVERNANCE_ENVELOPE_REGISTRY,
  GOVERNANCE_REGISTRY_EXCLUDED,
  GOVERNANCE_ENVELOPE_SERIES,
} from "../_governance.registry.js";

const governanceDir = join(import.meta.dirname, "..");

function discoverFlatGovernanceFiles(): string[] {
  return readdirSync(governanceDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        !GOVERNANCE_REGISTRY_EXCLUDED.includes(
          entry.name as (typeof GOVERNANCE_REGISTRY_EXCLUDED)[number]
        )
    )
    .map((entry) => entry.name)
    .sort();
}

describe("governance envelope registry", () => {
  const discovered = discoverFlatGovernanceFiles();
  const diff = diffGovernanceEnvelopeRegistry(discovered);

  it("registry count matches total flat meta-gates/ files on disk", () => {
    expect(
      diff,
      formatGovernanceEnvelopeInventoryDiff(diff)
    ).toEqual({
      registeredCount: discovered.length,
      discoveredCount: discovered.length,
      missingOnDisk: [],
      discoveredOnly: [],
    });
  });

  it("lists exact registered file set (no extras, no omissions)", () => {
    expect(GOVERNANCE_ENVELOPE_FILES.slice().sort()).toEqual(discovered);
    expect(GOVERNANCE_ENVELOPE_REGISTRY.length).toBe(discovered.length);
  });

  it("every registry entry maps to an on-disk file with envelope header", () => {
    for (const entry of GOVERNANCE_ENVELOPE_REGISTRY) {
      const filePath = join(governanceDir, entry.file);
      expect(existsSync(filePath), `${entry.file} must exist`).toBe(true);

      const source = readFileSync(filePath, "utf8");
      expect(source, `${entry.file} envelope marker`).toContain(
        GOVERNANCE_ENVELOPE_MARKER
      );
      expect(source, `${entry.file} family line`).toMatch(
        new RegExp(`Family:\\s*${entry.family}`)
      );
      expect(entry.refactored, `${entry.file} refactor date`).toBe(
        GOVERNANCE_ENVELOPE_REFACTORED
      );
    }
  });

  it("exports flat-governance series metadata for envelope headers", () => {
    expect(GOVERNANCE_ENVELOPE_SERIES).toBe("flat-governance");
    expect(GOVERNANCE_ENVELOPE_MARKER).toBe("@afenda.governance-envelope");
  });

  it("every discovered file has a unique registry family entry", () => {
    const files = GOVERNANCE_ENVELOPE_REGISTRY.map((entry) => entry.file);
    expect(new Set(files).size).toBe(files.length);
  });
});
