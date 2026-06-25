import { expect, test } from "@playwright/test";

test.describe("CSP hybrid production audit", () => {
  test("@smoke sign-in uses SRI policy without nonce when hybrid strategy is production", async ({
    request,
  }) => {
    test.skip(
      process.env.NODE_ENV === "development",
      "Hybrid dev mode intentionally uses nonce on all routes for Next.js HMR."
    );

    const response = await request.get("/sign-in");
    const policy = response.headers()["content-security-policy"] ?? "";

    expect(policy).toContain("script-src 'self'");
    expect(policy).not.toContain("'nonce-");
    expect(policy).not.toContain("'strict-dynamic'");
  });
});
