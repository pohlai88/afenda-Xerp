import { PLATFORM_PERMISSION_CATALOG } from "@afenda/database";
import { describe, expect, it } from "vitest";

import { PERMISSION_REGISTRY } from "../permission.contract.js";

function collectRegistryKeys(
  value: unknown,
  keys = new Set<string>()
): Set<string> {
  if (typeof value === "string") {
    keys.add(value);
    return keys;
  }

  if (value && typeof value === "object") {
    for (const nested of Object.values(value)) {
      collectRegistryKeys(nested, keys);
    }
  }

  return keys;
}

describe("database seed catalog alignment", () => {
  it("matches PERMISSION_REGISTRY keys exactly", () => {
    const registryKeys = collectRegistryKeys(PERMISSION_REGISTRY);
    const catalogKeys = new Set(
      PLATFORM_PERMISSION_CATALOG.map((entry) => entry.key)
    );

    expect(catalogKeys).toEqual(registryKeys);
  });
});
