import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SECTION_INDEX_REDIRECTS = [
  {
    source: "/system-admin",
    destination: "/system-admin/users",
  },
] as const;

describe("@afenda/erp next.config routing", () => {
  it("keeps localhost-only allowedDevOrigins for Playwright and HMR", () => {
    const nextConfigSource = readFileSync(
      join(process.cwd(), "next.config.ts"),
      "utf8"
    );

    expect(nextConfigSource).toContain('allowedDevOrigins: ["127.0.0.1"]');
    expect(nextConfigSource).not.toContain("192.168");
  });

  it("configures section index redirects in next.config.ts", () => {
    const nextConfigSource = readFileSync(
      join(process.cwd(), "next.config.ts"),
      "utf8"
    );

    expect(nextConfigSource).toContain("async redirects()");
    expect(nextConfigSource).toContain("permanent: true");

    for (const expected of SECTION_INDEX_REDIRECTS) {
      expect(nextConfigSource).toContain(
        `source: ${JSON.stringify(expected.source)}`
      );
      expect(nextConfigSource).toContain(
        `destination: ${JSON.stringify(expected.destination)}`
      );
    }
  });
});
