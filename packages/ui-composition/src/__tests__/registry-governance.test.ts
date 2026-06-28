import { describe, expect, it } from "vitest";
import {
  createRegistryEntry,
  isMetadataAuthorityKey,
  isMetadataLifecycle,
  METADATA_AUTHORITY_KEYS,
  METADATA_LIFECYCLES,
} from "../index.js";

describe("registry governance", () => {
  it("accepts only MetadataAuthorityKey for RegistryEntry.authority", () => {
    const entry = createRegistryEntry({
      authority: "renderer",
      id: "renderer.list.v1",
      lifecycle: "active",
      version: "1.0.0",
      ownerPackage: "@afenda/metadata-ui",
    });

    expect(isMetadataAuthorityKey(entry.authority)).toBe(true);
    expect(METADATA_AUTHORITY_KEYS).toContain(entry.authority);
  });

  it("accepts only governed lifecycle values for RegistryEntry.lifecycle", () => {
    for (const lifecycle of METADATA_LIFECYCLES) {
      const entry = createRegistryEntry({
        authority: "section",
        id: `section.${lifecycle}`,
        lifecycle,
        version: "1.0.0",
        ownerPackage: "@afenda/metadata-ui",
      });
      expect(isMetadataLifecycle(entry.lifecycle)).toBe(true);
    }
  });

  it("allows optional deprecated and experimental flags as readonly", () => {
    const deprecatedEntry = createRegistryEntry({
      authority: "layout",
      id: "layout.legacy",
      lifecycle: "deprecated",
      version: "0.9.0",
      ownerPackage: "@afenda/metadata-ui",
      deprecated: true,
    });
    const experimentalEntry = createRegistryEntry({
      authority: "presentation",
      id: "presentation.preview",
      lifecycle: "draft",
      version: "0.0.1",
      ownerPackage: "@afenda/metadata-ui",
      experimental: true,
    });

    expect(deprecatedEntry.deprecated).toBe(true);
    expect(experimentalEntry.experimental).toBe(true);
  });
});
