import { describe, expect, it } from "vitest";

import {
  getVercelPushSkipReason,
  isVercelEnvUpToDate,
  mergeVercelEnvTargets,
  planVercelPush,
  probeMigrationUrlFromMerged,
} from "../../env-utils.mjs";

describe("env-utils vercel push policy", () => {
  it("merges Vercel env targets without clobbering production on preview push", () => {
    expect(mergeVercelEnvTargets(["production"], ["preview"])).toEqual([
      "production",
      "preview",
    ]);
    expect(mergeVercelEnvTargets(["preview"], ["production"])).toEqual([
      "production",
      "preview",
    ]);
  });

  it("detects up-to-date env when push targets are already assigned", () => {
    expect(
      isVercelEnvUpToDate(
        { value: "tr_prod_x", target: ["production", "preview"] },
        "tr_prod_x",
        ["preview"]
      )
    ).toBe(true);
  });

  it("detects stale env when push target is missing", () => {
    expect(
      isVercelEnvUpToDate(
        { value: "tr_prod_x", target: ["preview"] },
        "tr_prod_x",
        ["production"]
      )
    ).toBe(false);
  });
  it("denies local-only and vercel-managed keys", () => {
    expect(getVercelPushSkipReason("TURBO_TOKEN", "secret")).toBe("local-only");
    expect(getVercelPushSkipReason("VERCEL_TOKEN", "token")).toBe("local-only");
    expect(getVercelPushSkipReason("GITHUB_TOKEN", "ghp_test")).toBe(
      "local-only"
    );
    expect(getVercelPushSkipReason("VERCEL_OIDC_TOKEN", "jwt")).toBe(
      "vercel-managed"
    );
    expect(
      getVercelPushSkipReason("NEXT_PUBLIC_SUPABASE_URL", "https://x")
    ).toBe(null);
  });

  it("plans push vs skip buckets", () => {
    const plan = planVercelPush({
      entries: new Map([
        ["NEXT_PUBLIC_SUPABASE_URL", "https://abc.supabase.co"],
        ["TURBO_TOKEN", "secret"],
        ["BETTER_AUTH_SECRET", "x".repeat(32)],
      ]),
      order: ["NEXT_PUBLIC_SUPABASE_URL", "TURBO_TOKEN", "BETTER_AUTH_SECRET"],
    });

    expect(plan.push).toEqual([
      "NEXT_PUBLIC_SUPABASE_URL",
      "BETTER_AUTH_SECRET",
    ]);
    expect(plan.skip).toEqual([{ key: "TURBO_TOKEN", reason: "local-only" }]);
  });
});

describe("env-utils migration URL probe", () => {
  it("detects explicit session URL", () => {
    expect(
      probeMigrationUrlFromMerged(
        new Map([["DATABASE_URL_SESSION", "postgresql://example"]])
      ).resolvable
    ).toBe(true);
  });

  it("detects supabase-derived config", () => {
    expect(
      probeMigrationUrlFromMerged(
        new Map([
          ["SUPABASE_DB_PASSWORD", "pw"],
          ["SUPABASE_DB_REGION", "ap-southeast-2"],
          ["NEXT_PUBLIC_SUPABASE_URL", "https://abc.supabase.co"],
        ])
      )
    ).toEqual({ resolvable: true, method: "supabase-derived" });
  });
});
