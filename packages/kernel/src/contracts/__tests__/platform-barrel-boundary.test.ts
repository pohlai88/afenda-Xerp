import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const platformBarrelPath = join(
  fileURLToPath(new URL("..", import.meta.url)),
  "platform",
  "index.ts"
);

describe("platform barrel boundary (TIP-007 — type-only context/identity re-exports)", () => {
  it("re-exports context and identity symbols as types only", () => {
    const source = readFileSync(platformBarrelPath, "utf8");

    expect(source).toMatch(
      /export type \{[\s\S]*?\} from "\.\.\/\.\.\/context\/index\.js";/
    );
    expect(source).toMatch(
      /export type \{[\s\S]*?\} from "\.\.\/\.\.\/identity\/index\.js";/
    );
    expect(source).not.toMatch(
      /export \{[\s\S]*?\} from "\.\.\/\.\.\/context\/index\.js";/
    );
    expect(source).not.toMatch(
      /export \{[\s\S]*?\} from "\.\.\/\.\.\/identity\/index\.js";/
    );
  });

  it("sources runtime registry exports from platform-entity-authority.contract only", () => {
    const source = readFileSync(platformBarrelPath, "utf8");

    expect(source).toContain('from "./platform-entity-authority.contract.js"');
    expect(source).toContain("PLATFORM_ENTITY_AUTHORITY_REGISTRY");
    expect(source).toContain("getPlatformEntityAuthority");
  });
});
