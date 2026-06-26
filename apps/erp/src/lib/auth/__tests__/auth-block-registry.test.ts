import { describe, expect, it } from "vitest";
import { AUTH_BLOCK_REGISTRY } from "../auth-block.registry";

describe("AUTH_BLOCK_REGISTRY", () => {
  const entries = Object.values(AUTH_BLOCK_REGISTRY);

  it("has no duplicate ids", () => {
    const ids = entries.map((e) => e.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("every entry has a non-empty primaryActionLabel", () => {
    for (const entry of entries) {
      expect(entry.primaryActionLabel.length).toBeGreaterThan(0);
    }
  });

  it("every entry has at least one allowed state", () => {
    for (const entry of entries) {
      expect(entry.allowedStates.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a valid intent", () => {
    const validIntents = ["access", "verify", "recover", "error"] as const;
    for (const entry of entries) {
      expect(validIntents).toContain(entry.intent);
    }
  });

  it("every id is kebab-case (no spaces, no uppercase)", () => {
    for (const entry of entries) {
      expect(entry.id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });
});
