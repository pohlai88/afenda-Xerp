import { describe, expect, it } from "vitest";

import { ACTIVE_ROUTE_PATH_HEADER } from "@/lib/context/context.constants";
import { resolveActiveRoutePathFromHeaders } from "../resolve-active-route-path-from-headers.server";

describe("resolveActiveRoutePathFromHeaders", () => {
  it("returns the routed pathname from the proxy header", () => {
    const headers = new Headers({
      [ACTIVE_ROUTE_PATH_HEADER]: "/modules/hrm",
    });

    expect(resolveActiveRoutePathFromHeaders(headers)).toBe("/modules/hrm");
  });

  it("returns undefined when the header is absent or blank", () => {
    expect(resolveActiveRoutePathFromHeaders(new Headers())).toBeUndefined();
    expect(
      resolveActiveRoutePathFromHeaders(
        new Headers({ [ACTIVE_ROUTE_PATH_HEADER]: "   " })
      )
    ).toBeUndefined();
  });
});
