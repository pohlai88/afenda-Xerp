import { describe, expect, it } from "vitest";

import {
  getPlatformEntityAuthority,
  PLATFORM_ENTITY_AUTHORITY_ENTRIES,
  PLATFORM_ENTITY_AUTHORITY_REGISTRY,
  PLATFORM_ENTITY_IDS,
  PLATFORM_ENTITY_POLICY,
  type PlatformEntityAuthorityEntry,
} from "../platform/platform-entity-authority.contract.js";

describe("platform entity registry shape (backward-compat / PAS §4.6)", () => {
  it("derives PLATFORM_ENTITY_AUTHORITY_REGISTRY from ENTRIES in PLATFORM_ENTITY_IDS order", () => {
    expect(PLATFORM_ENTITY_AUTHORITY_REGISTRY).toHaveLength(
      PLATFORM_ENTITY_IDS.length
    );

    for (const [index, entityId] of PLATFORM_ENTITY_IDS.entries()) {
      const entry = PLATFORM_ENTITY_AUTHORITY_REGISTRY[index];
      expect(entry).toBe(PLATFORM_ENTITY_AUTHORITY_ENTRIES[entityId]);
      expect(entry?.entityId).toBe(entityId);
    }
  });

  it("keeps getPlatformEntityAuthority aligned with registry rows", () => {
    for (const entityId of PLATFORM_ENTITY_IDS) {
      expect(getPlatformEntityAuthority(entityId)).toBe(
        PLATFORM_ENTITY_AUTHORITY_ENTRIES[entityId]
      );
    }
  });

  it("remains JSON-serializable for documentation and drift gates", () => {
    const serialized = JSON.parse(
      JSON.stringify({
        policy: PLATFORM_ENTITY_POLICY,
        registry: PLATFORM_ENTITY_AUTHORITY_REGISTRY,
      })
    ) as {
      policy: typeof PLATFORM_ENTITY_POLICY;
      registry: PlatformEntityAuthorityEntry[];
    };

    expect(serialized.policy.pasSection).toBe("4.6");
    expect(serialized.registry).toHaveLength(11);
    expect(serialized.registry[0]?.entityId).toBe("tenant");
  });
});
