import { describe, expect, it } from "vitest";
import {
  metadataAiGovernanceRules,
  metadataAuthorityMap,
} from "../governance/metadata-authority-map.contract.js";
import { METADATA_AUTHORITY_KEYS } from "../metadata.constants.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";

describe("metadataAuthorityMap", () => {
  it("declares every metadata authority key exactly once", () => {
    expect(Object.keys(metadataAuthorityMap).sort()).toEqual(
      [...METADATA_AUTHORITY_KEYS].sort()
    );
  });

  it("keeps authority values aligned with their object keys", () => {
    for (const [key, entry] of Object.entries(metadataAuthorityMap)) {
      expect(entry.authority).toBe(key);
    }
  });

  it("does not allow an authority to own what it prohibits", () => {
    for (const entry of Object.values(metadataAuthorityMap)) {
      const owns = new Set(entry.owns);

      for (const prohibition of entry.doesNotOwn) {
        expect(owns.has(prohibition as never)).toBe(false);
      }
    }
  });

  it("uses metadata-ui as the downstream consumer for all authorities", () => {
    for (const entry of Object.values(metadataAuthorityMap)) {
      expect(entry.downstreamConsumer).toBe("@afenda/metadata-ui");
    }
  });
});

describe("metadataAiGovernanceRules", () => {
  it("uses the metadata contract version", () => {
    expect(metadataAiGovernanceRules.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("prohibits merging metadata and metadata-ui", () => {
    expect(metadataAiGovernanceRules.mayNot).toContain(
      "merge-metadata-with-metadata-ui"
    );
  });

  it("requires contract version updates when authority changes", () => {
    expect(metadataAiGovernanceRules.must).toContain(
      "update-contract-version-when-authority-changes"
    );
  });
});
