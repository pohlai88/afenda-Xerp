import { describe, expect, it } from "vitest";

import { findSupabaseConnectionAdvisories } from "../../env-utils.mjs";

describe("findSupabaseConnectionAdvisories", () => {
  it("recommends env:sync when derived pooler URLs are missing", () => {
    const advisories = findSupabaseConnectionAdvisories(
      new Map([
        ["SUPABASE_DB_PASSWORD", "secret"],
        [
          "NEXT_PUBLIC_SUPABASE_URL",
          "https://abcdefghijklmnopqrst.supabase.co",
        ],
        ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test"],
        ["SUPABASE_DB_REGION", "ap-southeast-2"],
        ["SUPABASE_JWT_KID", "test-kid"],
      ])
    );

    expect(
      advisories.some((entry) => entry.includes("DATABASE_URL_DIRECT"))
    ).toBe(true);
  });

  it("prompts for SUPABASE_ACCESS_TOKEN when absent", () => {
    const advisories = findSupabaseConnectionAdvisories(new Map());

    expect(
      advisories.some((entry) => entry.includes("SUPABASE_ACCESS_TOKEN"))
    ).toBe(true);
  });

  it("returns no advisories when Supabase config has blocking issues", () => {
    const advisories = findSupabaseConnectionAdvisories(
      new Map([["NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co"]])
    );

    expect(advisories).toEqual([]);
  });
});
