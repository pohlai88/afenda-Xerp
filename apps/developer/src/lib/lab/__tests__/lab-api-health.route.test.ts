import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/lab/v1/health/route";
import { labApiRouteRegistry } from "@/lib/lab/lab-api-route-registry";

describe("lab api health route", () => {
  it("is registered in the governed allowlist", () => {
    expect(labApiRouteRegistry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "/api/lab/v1/health",
          routeId: "lab.v1.health.get",
        }),
      ])
    );
  });

  it("returns the lab health contract", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      doctrine: "frontend-shape-only",
      service: "developer-route-lab",
      status: "ok",
    });
  });
});
