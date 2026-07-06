import { describe, expect, it } from "vitest";
import { createCachedLabLoader } from "@/lib/lab/create-cached-lab-loader.server";
import {
  LAB_FORBIDDEN_CACHE_DIRECTIVES,
  labCachePolicyRules,
} from "@/lib/lab/lab-cache-policy";
import { labCacheRouteRegistry } from "@/lib/lab/lab-cache-route-registry";

describe("lab cache policy", () => {
  it("keeps operator routes on request-dynamic react-cache dedupe", () => {
    const operatorEntries = labCacheRouteRegistry.filter(
      (entry) => entry.cacheKind === "operator-request-dynamic"
    );

    expect(operatorEntries.length).toBeGreaterThan(0);

    for (const entry of operatorEntries) {
      expect(labCachePolicyRules[entry.cacheKind]).toEqual(
        expect.objectContaining({
          allowsCrossRequestCache: false,
          allowsUseCacheDirective: false,
          dedupeStrategy: "react-cache",
          httpCache: "force-dynamic",
        })
      );
    }
  });

  it("documents the health handler revalidate posture", () => {
    expect(labCachePolicyRules["lab-health-revalidate"]).toEqual(
      expect.objectContaining({
        httpCache: "revalidate-30",
      })
    );
  });

  it("forbids use cache directives for route-lab operator surfaces", () => {
    expect(LAB_FORBIDDEN_CACHE_DIRECTIVES).toContain("use cache");
  });

  it("wraps loaders without changing resolved data", async () => {
    const cachedLoader = createCachedLabLoader(async () => ({
      marker: "lab-cache-proof",
    }));

    await expect(cachedLoader()).resolves.toEqual({
      marker: "lab-cache-proof",
    });
  });
});
