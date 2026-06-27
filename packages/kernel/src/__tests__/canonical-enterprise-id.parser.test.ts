import { describe, expect, it } from "vitest";

import {
  parseCustomerId,
  parseEmployeeId,
} from "../identity/families/business-reference-id.contract.js";

const VALID_CUSTOMER = "cus_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD";

describe("canonical enterprise ID parser", () => {
  it("accepts correct customer ID", () => {
    expect(() => parseCustomerId(VALID_CUSTOMER)).not.toThrow();
  });

  it("rejects wrong prefix", () => {
    expect(() => parseCustomerId("prd_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD")).toThrow();
  });

  it("rejects malformed body", () => {
    expect(() => parseCustomerId("cus_not-valid")).toThrow();
  });

  it("rejects tenant human reference as canonical ID", () => {
    expect(() => parseEmployeeId("EMP-000123")).toThrow();
  });
});
