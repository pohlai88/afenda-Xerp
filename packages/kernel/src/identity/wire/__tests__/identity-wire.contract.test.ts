import { describe, expect, it } from "vitest";

import { InvalidCanonicalIdError } from "../../canonical/invalid-canonical-id.error.js";
import {
  parseWireCanonicalId,
  parseWireRegisteredCanonicalId,
  serializeCanonicalId,
  type WireCanonicalId,
} from "../identity-wire.contract.js";

const VALID_TENANT: WireCanonicalId = "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV";
const VALID_CUSTOMER: WireCanonicalId = "cus_01ARZ3NDEKTSV4RRFFQ69G5FAV";

describe("identity wire boundary (PAS-001 §4.1.7)", () => {
  it("parses valid wire tenant ID", () => {
    expect(() => parseWireCanonicalId(VALID_TENANT, "tenant")).not.toThrow();
  });

  it("rejects wrong family at wire boundary", () => {
    expect(() => parseWireCanonicalId(VALID_CUSTOMER, "tenant")).toThrow(
      InvalidCanonicalIdError
    );
  });

  it("rejects malformed wire ID", () => {
    expect(() => parseWireCanonicalId("tenant-001", "tenant")).toThrow(
      InvalidCanonicalIdError
    );
  });

  it("rejects empty wire ID", () => {
    expect(() => parseWireCanonicalId("", "tenant")).toThrow(
      InvalidCanonicalIdError
    );
  });

  it("serializes trusted canonical ID back to string", () => {
    const tenantId = parseWireCanonicalId(VALID_TENANT, "tenant");

    expect(serializeCanonicalId(tenantId)).toBe(VALID_TENANT);
  });

  it("parses family-unknown wire IDs via registered prefix lookup", () => {
    const parsed = parseWireRegisteredCanonicalId(VALID_TENANT);

    expect(parsed.family).toBe("tenant");
    expect(serializeCanonicalId(parsed.id)).toBe(VALID_TENANT);
  });
});
