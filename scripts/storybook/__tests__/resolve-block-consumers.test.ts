import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  isProtectedBlockSlug,
  readMcpSeedBlockIds,
  readStudioLayoutImportSlugs,
  resolveBlockConsumerSlugs,
} from "../lib/resolve-block-consumers.mjs";

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testDir, "../../..");

describe("resolve-block-consumers", () => {
  it("includes MCP seed block ids as protected consumers", () => {
    const seedIds = readMcpSeedBlockIds(repoRoot);

    expect(seedIds.has("error-page-shell")).toBe(true);
    expect(seedIds.has("login-page-04")).toBe(true);
  });

  it("includes studio layout import paths as protected consumers", () => {
    const layoutSlugs = readStudioLayoutImportSlugs(repoRoot);

    expect(layoutSlugs.has("morphing-text")).toBe(true);
    expect(layoutSlugs.has("error-page-shell")).toBe(true);
  });

  it("protects colocated story slugs when the base block is consumed", () => {
    const consumers = resolveBlockConsumerSlugs({}, repoRoot);

    expect(isProtectedBlockSlug("morphing-text", consumers)).toBe(true);
    expect(isProtectedBlockSlug("morphing-text.stories", consumers)).toBe(true);
    expect(isProtectedBlockSlug("error-page-shell", consumers)).toBe(true);
  });
});
