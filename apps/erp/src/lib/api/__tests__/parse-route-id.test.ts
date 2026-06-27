import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";
import {
  parseRouteCustomerId,
  parseRouteEmployeeId,
  parseRouteProductId,
  parseRouteTenantId,
} from "../parse-route-id";
import {
  API_TEST_CUSTOMER_ID,
  API_TEST_EMPLOYEE_ID,
  API_TEST_PRODUCT_ID,
  API_TEST_TENANT_ID,
} from "./api-id-test-fixtures";

describe("parseRouteTenantId", () => {
  it("accepts valid canonical tenant IDs", () => {
    expect(parseRouteTenantId(API_TEST_TENANT_ID)).toBe(API_TEST_TENANT_ID);
  });

  it("rejects wrong prefix", () => {
    expect(() => parseRouteTenantId(API_TEST_CUSTOMER_ID)).toThrow(
      ApiRouteError
    );
    try {
      parseRouteTenantId(API_TEST_CUSTOMER_ID);
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ApiRouteError);
      if (error instanceof ApiRouteError) {
        expect(error.code).toBe("validation_failed");
        expect(error.message).toContain("tenantId");
      }
    }
  });

  it("rejects malformed IDs", () => {
    expect(() => parseRouteTenantId("ten_invalid")).toThrow(ApiRouteError);
    expect(() => parseRouteTenantId("")).toThrow(ApiRouteError);
  });
});

describe("parseRouteCustomerId", () => {
  it("accepts valid canonical customer IDs", () => {
    expect(parseRouteCustomerId(API_TEST_CUSTOMER_ID)).toBe(
      API_TEST_CUSTOMER_ID
    );
  });

  it("rejects wrong prefix", () => {
    expect(() => parseRouteCustomerId(API_TEST_TENANT_ID)).toThrow(
      ApiRouteError
    );
  });

  it("rejects malformed IDs", () => {
    expect(() => parseRouteCustomerId("cus_invalid")).toThrow(ApiRouteError);
  });
});

describe("parseRouteProductId", () => {
  it("accepts valid canonical product IDs", () => {
    expect(parseRouteProductId(API_TEST_PRODUCT_ID)).toBe(API_TEST_PRODUCT_ID);
  });

  it("rejects wrong prefix", () => {
    expect(() => parseRouteProductId(API_TEST_EMPLOYEE_ID)).toThrow(
      ApiRouteError
    );
  });

  it("rejects malformed IDs", () => {
    expect(() => parseRouteProductId("prd_invalid")).toThrow(ApiRouteError);
  });
});

describe("parseRouteEmployeeId", () => {
  it("accepts valid canonical employee IDs", () => {
    expect(parseRouteEmployeeId(API_TEST_EMPLOYEE_ID)).toBe(
      API_TEST_EMPLOYEE_ID
    );
  });

  it("rejects wrong prefix", () => {
    expect(() =>
      parseRouteEmployeeId(createTestEnterpriseId("product"))
    ).toThrow(ApiRouteError);
  });

  it("rejects malformed IDs", () => {
    expect(() => parseRouteEmployeeId("emp_invalid")).toThrow(ApiRouteError);
  });
});

describe("parseRoute* ingress boundary", () => {
  it("does not expose unsafe cast paths in helpers", () => {
    const tenantId = parseRouteTenantId(API_TEST_TENANT_ID);
    expect(typeof tenantId).toBe("string");
    expect(tenantId.startsWith("ten_")).toBe(true);
  });
});
