import { describe, expect, it } from "vitest";
import {
  METADATA_AUTHORITY_OWNERSHIPS,
  metadataAuthorityMap,
} from "../governance/metadata-authority-map.contract.js";
import { LAYOUT_CONTRACT_OWNERSHIPS } from "../layout.contract.js";
import { METADATA_CONTRACT_OWNERSHIPS } from "../metadata.contract.js";
import { PRESENTATION_CONTRACT_OWNERSHIPS } from "../presentation.contract.js";
import { REGISTRY_CONTRACT_OWNERSHIPS } from "../registry.contract.js";
import { RENDERER_CONTRACT_OWNERSHIPS } from "../renderer.contract.js";
import { RUNTIME_CONTRACT_OWNERSHIPS } from "../runtime.contract.js";
import { SECTION_CONTRACT_OWNERSHIPS } from "../section.contract.js";
import { SURFACE_CONTRACT_OWNERSHIPS } from "../surface.contract.js";

const domainOwnershipSources = [
  ["metadata", METADATA_CONTRACT_OWNERSHIPS],
  ["surface", SURFACE_CONTRACT_OWNERSHIPS],
  ["layout", LAYOUT_CONTRACT_OWNERSHIPS],
  ["section", SECTION_CONTRACT_OWNERSHIPS],
  ["renderer", RENDERER_CONTRACT_OWNERSHIPS],
  ["registry", REGISTRY_CONTRACT_OWNERSHIPS],
  ["presentation", PRESENTATION_CONTRACT_OWNERSHIPS],
  ["runtime", RUNTIME_CONTRACT_OWNERSHIPS],
] as const;

describe("authority ownership alignment", () => {
  it("derives METADATA_AUTHORITY_OWNERSHIPS from domain contracts without duplicates", () => {
    const flattened = domainOwnershipSources.flatMap(([, owns]) => [...owns]);

    expect(METADATA_AUTHORITY_OWNERSHIPS).toEqual(flattened);
    expect(new Set(METADATA_AUTHORITY_OWNERSHIPS).size).toBe(flattened.length);
  });

  it("keeps metadataAuthorityMap owns aligned with each domain contract", () => {
    for (const [authority, domainOwns] of domainOwnershipSources) {
      expect(metadataAuthorityMap[authority].owns).toEqual(domainOwns);
    }
  });

  it("places every domain ownership key in the global vocabulary", () => {
    const vocabulary = new Set(METADATA_AUTHORITY_OWNERSHIPS);

    for (const [, domainOwns] of domainOwnershipSources) {
      for (const key of domainOwns) {
        expect(vocabulary.has(key)).toBe(true);
      }
    }
  });
});
