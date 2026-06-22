import { describe, expect, it } from "vitest";

import { checkCspThirdPartyGovernance } from "../csp-third-party-governance.mjs";

describe("checkCspThirdPartyGovernance", () => {
  it("flags Script usage without nonce and getCspNonce import", () => {
    const source = `
      import Script from "next/script";
      export default function Page() {
        return <Script src="https://cdn.example.com/a.js" />;
      }
    `;

    const violations = checkCspThirdPartyGovernance(
      source,
      "apps/erp/src/app/page.tsx"
    );

    expect(violations.length).toBeGreaterThan(0);
    expect(violations.join(" ")).toMatch(/nonce/);
    expect(violations.join(" ")).toMatch(/getCspNonce/);
  });

  it("allows compliant Server Component script wiring", () => {
    const source = `
      import Script from "next/script";
      import { getCspNonce } from "@/lib/security/nonce.server";

      export default async function Page() {
        const nonce = await getCspNonce();
        return nonce ? <Script nonce={nonce} src="https://cdn.example.com/a.js" /> : null;
      }
    `;

    expect(
      checkCspThirdPartyGovernance(source, "apps/erp/src/app/page.tsx")
    ).toEqual([]);
  });

  it("forbids next/script on SRI public route surfaces", () => {
    const source = `
      import Script from "next/script";
      export default function Page() {
        return <Script src="https://cdn.example.com/a.js" />;
      }
    `;

    const violations = checkCspThirdPartyGovernance(
      source,
      "apps/erp/src/app/(auth)/sign-in/page.tsx"
    );

    expect(violations.join(" ")).toMatch(/forbidden on SRI/);
  });
});

describe("csp-third-party-governance script", () => {
  it("ignores csp policy implementation files", () => {
    const violations = checkCspThirdPartyGovernance(
      "connect-src 'self' http://localhost:*;",
      "apps/erp/src/lib/security/csp.ts"
    );

    expect(violations).toEqual([]);
  });
});
