import { describe, expect, it } from "vitest";
import type { JsonObject } from "../contracts/json-wire.contract.js";

describe("json wire contract", () => {
  it("accepts nested readonly JsonObject payloads", () => {
    const payload = {
      count: 1,
      enabled: true,
      label: "tenant",
      nested: { key: "value" },
      tags: ["a", "b"],
      empty: null,
    } satisfies JsonObject;

    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });
});
