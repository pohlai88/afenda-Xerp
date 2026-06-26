import { expect, test } from "@afenda/testing/e2e/playwright-base";

test.describe("CSP hybrid production audit", () => {
  test("@smoke sign-in uses SRI policy without nonce when hybrid strategy is production", async ({
    request,
  }) => {
    test.skip(
      process.env.PLAYWRIGHT_CSP_PRODUCTION_AUDIT !== "true",
      "CSP hybrid production audit runs against next start (CI production build)."
    );

    const response = await request.get("/sign-in");
    const policy = response.headers()["content-security-policy"] ?? "";

    expect(policy).toContain("script-src 'self'");
    expect(policy).not.toContain("'nonce-");
    expect(policy).not.toContain("'strict-dynamic'");
  });
});
