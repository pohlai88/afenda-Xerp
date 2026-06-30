import { describe, expect, it } from "vitest";

import { parseListQuery } from "@/server/api/contracts/list-query.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

describe("list query contract", () => {
  it("parses pagination, q, filter, and sort from search params", () => {
    const params = new URLSearchParams({
      cursor: "prod-1",
      limit: "10",
      q: "widget",
      sort: "-updatedAt,displayName",
      "filter[status]": "active",
    });

    const query = parseListQuery(params, {
      allowedFilterFields: ["status"],
      allowedSortFields: ["displayName", "updatedAt"],
    });

    expect(query).toEqual({
      cursor: "prod-1",
      limit: 10,
      q: "widget",
      filter: { status: "active" },
      sort: [
        { direction: "desc", field: "updatedAt" },
        { direction: "asc", field: "displayName" },
      ],
    });
  });

  it("rejects undeclared filter fields", () => {
    const params = new URLSearchParams({
      "filter[sku]": "ABC",
    });

    expect(() =>
      parseListQuery(params, {
        allowedFilterFields: ["status"],
        allowedSortFields: ["displayName"],
      })
    ).toThrow(ApiRouteError);
  });

  it("rejects undeclared sort fields", () => {
    const params = new URLSearchParams({
      sort: "-sku",
    });

    expect(() =>
      parseListQuery(params, {
        allowedFilterFields: ["status"],
        allowedSortFields: ["displayName"],
      })
    ).toThrow(ApiRouteError);
  });
});
