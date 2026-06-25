import { describe, expect, it, vi } from "vitest";

import {
  collectBlockingAdvisorLints,
  fetchSupabaseAdvisors,
  resolveSupabaseProjectRef,
  resolveSupabaseProjectRefFromPublicUrl,
  summarizeAdvisorScan,
} from "../supabase-advisors-governance.mjs";

describe("supabase-advisors-governance", () => {
  it("resolves project ref from public Supabase URL", () => {
    expect(
      resolveSupabaseProjectRefFromPublicUrl(
        "https://abcdefghijklmnopqrst.supabase.co"
      )
    ).toBe("abcdefghijklmnopqrst");
  });

  it("prefers explicit SUPABASE_PROJECT_REF", () => {
    expect(
      resolveSupabaseProjectRef(
        new Map([
          ["SUPABASE_PROJECT_REF", "explicit-ref"],
          ["NEXT_PUBLIC_SUPABASE_URL", "https://other.supabase.co"],
        ])
      )
    ).toBe("explicit-ref");
  });

  it("collects ERROR and CRITICAL advisor lints only", () => {
    const blocking = collectBlockingAdvisorLints([
      { level: "WARN", title: "warn" },
      { level: "ERROR", title: "error" },
      { level: "critical", title: "critical" },
      { level: "INFO", title: "info" },
    ]);

    expect(blocking.map((lint) => lint.title)).toEqual(["error", "critical"]);
  });

  it("summarizes blocking findings across advisor kinds", () => {
    const summary = summarizeAdvisorScan({
      security: [{ level: "ERROR", title: "rls disabled" }],
      performance: [{ level: "WARN", title: "missing index" }],
    });

    expect(summary.ok).toBe(false);
    expect(summary.blocking).toHaveLength(1);
    expect(summary.warnCount).toBe(1);
  });

  it("fetches security and performance advisors from Management API", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          lints: [{ level: "WARN", title: "security-warn" }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ lints: [] }),
      });

    const advisors = await fetchSupabaseAdvisors({
      projectRef: "test-ref",
      token: "token",
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(advisors.security).toHaveLength(1);
    expect(advisors.performance).toEqual([]);
  });
});
