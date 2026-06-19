import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { PERMISSION_REGISTRY } from "../permission.contract.js";

const catalogKeyPattern = /catalogKey\("([^"]+)",\s*"([^"]+)"\)/gu;
const currentDirectory = dirname(fileURLToPath(import.meta.url));

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

function collectCatalogKeys(): Set<string> {
  const catalogPath = join(
    currentDirectory,
    "..",
    "..",
    "..",
    "database",
    "src",
    "seeds",
    "platform-permissions.catalog.ts"
  );
  const catalogSource = readFileSync(catalogPath, "utf8");

  return new Set(
    Array.from(
      catalogSource.matchAll(catalogKeyPattern),
      ([, domain, action]) => `${domain}.${action}`
    )
  );
}

describe("database seed catalog alignment", () => {
  it("matches PERMISSION_REGISTRY keys exactly", () => {
    const registryKeys = collectRegistryKeys(PERMISSION_REGISTRY);
    const catalogKeys = collectCatalogKeys();

    expect(catalogKeys).toEqual(registryKeys);
  });
});
