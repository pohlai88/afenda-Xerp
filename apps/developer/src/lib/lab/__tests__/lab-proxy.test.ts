import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { LAB_CORRELATION_ID_HEADER } from "@/lib/lab/lab-request-policy";
import { proxy } from "../../../proxy";

describe("lab proxy", () => {
  it("passes through correlation id on the response", () => {
    const request = new NextRequest("http://127.0.0.1:3002/dashboard/sales", {
      headers: {
        [LAB_CORRELATION_ID_HEADER]: "route-lab-correlation-proof",
      },
    });

    const response = proxy(request);

    expect(response.headers.get(LAB_CORRELATION_ID_HEADER)).toBe(
      "route-lab-correlation-proof"
    );
  });

  it("does not redirect unauthenticated navigation", () => {
    const request = new NextRequest("http://127.0.0.1:3002/dashboard/sales");

    const response = proxy(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
