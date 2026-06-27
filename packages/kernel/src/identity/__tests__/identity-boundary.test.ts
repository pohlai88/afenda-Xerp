import { describe, expect, it } from "vitest";

import * as identityPublic from "../index.js";
import {
  InvalidCanonicalIdError,
  isCanonicalEnterpriseId,
  parseCanonicalId,
  parseCurrencyCode,
  parseEmployeeId,
  parseEmployeeNo,
  parseLocaleCode,
  parseOptionalCanonicalId,
  parseWireCanonicalId,
  serializeCanonicalId,
} from "../index.js";

const VALID_EMPLOYEE = "emp_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD";

describe("identity boundary (PAS-001 §4.1.2)", () => {
  it("accepts valid canonical ID with correct family prefix", () => {
    expect(parseCanonicalId(VALID_EMPLOYEE, "employee")).toBe(VALID_EMPLOYEE);
  });

  it("rejects wrong family prefix", () => {
    expect(() =>
      parseCanonicalId("cus_01JZ8R4M7M7Y5E8KZ9Q9V8K2JD", "employee")
    ).toThrow(InvalidCanonicalIdError);
  });

  it("rejects malformed canonical body", () => {
    expect(() => parseEmployeeId("emp_not-valid")).toThrow(
      InvalidCanonicalIdError
    );
  });

  it("rejects empty canonical value", () => {
    expect(() => parseCanonicalId("", "employee")).toThrow(
      InvalidCanonicalIdError
    );
  });

  it("does not parse tenant human reference as EmployeeId", () => {
    expect(() => parseEmployeeId("EMP-000123")).toThrow(
      InvalidCanonicalIdError
    );
  });

  it("accepts tenant human reference via human parser", () => {
    expect(parseEmployeeNo("EMP-000123")).toBe("EMP-000123");
  });

  it("keeps LocaleCode and CurrencyCode off the enterprise ID parser", () => {
    expect(parseLocaleCode("en-US")).toBe("en-US");
    expect(parseCurrencyCode("USD")).toBe("USD");
    expect(isCanonicalEnterpriseId("en-US")).toBe(false);
    expect(isCanonicalEnterpriseId("USD")).toBe(false);
  });

  it("exports safe public contracts from the identity barrel", () => {
    expect(typeof identityPublic.parseTenantId).toBe("function");
    expect(typeof identityPublic.parseCustomerId).toBe("function");
    expect(typeof identityPublic.parseWireCanonicalId).toBe("function");
    expect(typeof identityPublic.serializeCanonicalId).toBe("function");
    expect("brandRequiredId" in identityPublic).toBe(false);
    expect("brandOptionalId" in identityPublic).toBe(false);
  });

  it("routes wire ingress through canonical parsers", () => {
    const parsed = parseWireCanonicalId(VALID_EMPLOYEE, "employee");
    expect(serializeCanonicalId(parsed)).toBe(VALID_EMPLOYEE);
    expect(parseOptionalCanonicalId(null, "employee")).toBeNull();
  });
});
