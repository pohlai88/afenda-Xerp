import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  analyzeSriHtmlIntegrity,
  checkCspSriBuildHtml,
  checkCspSriSurfaceGovernance,
  isCspSriSurfacePath,
} from "../csp-sri-governance.mjs";

const repoRoot = join(import.meta.dirname, "../../..");
const signInHtmlPath = join(
  repoRoot,
  "apps/erp/.next/server/app/sign-in.html"
);

describe("csp-sri-governance", () => {
  it("detects auth route trees as SRI surfaces", () => {
    expect(
      isCspSriSurfacePath("apps/erp/src/app/(auth)/sign-in/page.tsx")
    ).toBe(true);
    expect(
      isCspSriSurfacePath("apps/erp/src/app/(protected)/page.tsx")
    ).toBe(false);
  });

  it("forbids next/script on SRI surfaces", () => {
    const source = `
      import Script from "next/script";
      export default function Page() {
        return <Script src="https://cdn.example.com/a.js" />;
      }
    `;

    const violations = checkCspSriSurfaceGovernance(
      source,
      "apps/erp/src/app/(auth)/sign-in/page.tsx"
    );

    expect(violations.length).toBeGreaterThan(0);
    expect(violations.join(" ")).toMatch(/forbidden on SRI/);
  });

  it("allows protected routes to use next/script with nonce wiring", () => {
    const source = `
      import Script from "next/script";
      import { getCspNonce } from "@/lib/security/nonce.server";
      export default async function Page() {
        const nonce = await getCspNonce();
        return nonce ? <Script nonce={nonce} src="https://cdn.example.com/a.js" /> : null;
      }
    `;

    expect(
      checkCspSriSurfaceGovernance(source, "apps/erp/src/app/(protected)/page.tsx")
    ).toEqual([]);
  });

  it("validates representative static HTML integrity coverage", () => {
    const html = `
      <link rel="preload" as="script" href="/_next/static/chunks/a.js" integrity="sha256-abc="/>
      <script src="/_next/static/chunks/a.js" integrity="sha256-abc="></script>
      <script src="/_next/static/chunks/b.js"></script>
      <script src="/_next/static/chunks/c.js"></script>
      <script src="/_next/static/chunks/d.js"></script>
    `;

    const stats = analyzeSriHtmlIntegrity(html);

    expect(stats.integrityCount).toBeGreaterThan(0);
    expect(stats.staticScriptCount).toBe(4);
    expect(stats.staticScriptWithIntegrityCount).toBe(1);
    expect(checkCspSriBuildHtml(html, { minStaticScriptCoverage: 0.25 })).toEqual(
      []
    );
    expect(
      checkCspSriBuildHtml(html, { minStaticScriptCoverage: 0.5 }).length
    ).toBeGreaterThan(0);
  });

  it("passes SRI build artifact checks when sign-in.html exists", () => {
    let html = "";

    try {
      html = readFileSync(signInHtmlPath, "utf8");
    } catch {
      return;
    }

    const stats = analyzeSriHtmlIntegrity(html);

    expect(stats.integrityCount).toBeGreaterThan(0);
    expect(checkCspSriBuildHtml(html)).toEqual([]);
  });
});
