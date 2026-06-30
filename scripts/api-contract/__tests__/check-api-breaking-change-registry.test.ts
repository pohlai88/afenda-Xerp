import { describe, expect, it } from "vitest";

import {
  API_BREAKING_CHANGE_REGISTRY_DRIFT_STALE_MESSAGE,
  compareBreakingChangeRegistrySnapshot,
} from "../check-api-breaking-change-registry.mts";

describe("check-api-breaking-change-registry gate probes", () => {
  it("detects snapshot drift", () => {
    const result = compareBreakingChangeRegistrySnapshot(
      { operations: [{ id: "a" }] },
      { operations: [{ id: "b" }] }
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe(
        API_BREAKING_CHANGE_REGISTRY_DRIFT_STALE_MESSAGE
      );
    }
  });

  it("accepts matching snapshots", () => {
    const document = {
      generatedFrom: "api-contract-registry",
      schemaVersion: "1.0.0",
      operations: [],
    };

    expect(compareBreakingChangeRegistrySnapshot(document, document)).toEqual({
      ok: true,
    });
  });
});
