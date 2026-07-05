import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ERP_ROOT } from "@/__tests__/support/erp-test-paths";
import { AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT } from "@/lib/auth/auth-ingress-surface.registry";
import { ERROR_PAGE_REDIRECT_ALIASES } from "@/lib/presentation/error-page-surface.registry";

const SECTION_INDEX_REDIRECTS = [
  {
    source: "/system-admin",
    destination: "/system-admin/users",
  },
] as const;

describe("@afenda/erp next.config routing", () => {
  it("keeps localhost-only allowedDevOrigins for Playwright and HMR", () => {
    const nextConfigSource = readFileSync(
      join(ERP_ROOT, "next.config.ts"),
      "utf8"
    );

    expect(nextConfigSource).toContain('allowedDevOrigins: ["127.0.0.1"]');
    expect(nextConfigSource).not.toContain("192.168");
  });

  it("configures section index redirects in next.config.ts", () => {
    const nextConfigSource = readFileSync(
      join(ERP_ROOT, "next.config.ts"),
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

  it("configures error page alias redirects in next.config.ts", () => {
    const nextConfigSource = readFileSync(
      join(ERP_ROOT, "next.config.ts"),
      "utf8"
    );

    for (const expected of ERROR_PAGE_REDIRECT_ALIASES) {
      expect(nextConfigSource).toContain(
        `source: ${JSON.stringify(expected.source)}`
      );
      expect(nextConfigSource).toContain(
        `destination: ${JSON.stringify(expected.destination)}`
      );
    }
  });

  it("redirects legacy operator sign-in preview to metadata workspace", () => {
    const nextConfigSource = readFileSync(
      join(ERP_ROOT, "next.config.ts"),
      "utf8"
    );

    expect(nextConfigSource).toContain(
      `source: ${JSON.stringify(AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT.source)}`
    );
    expect(nextConfigSource).toContain(
      `destination: ${JSON.stringify(AUTH_OPERATOR_SURFACE_PREVIEW_REDIRECT.destination)}`
    );
  });
});
