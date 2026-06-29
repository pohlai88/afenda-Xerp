import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

import {
  parseRouteAssetId,
  parseRouteCustomerId,
  parseRouteDocumentId,
  parseRouteEmployeeId,
  parseRouteProductId,
  parseRouteSupplierId,
  parseRouteTenantId,
  parseRouteWarehouseId,
} from "../parse-route-id";
import {
  API_TEST_ASSET_ID,
  API_TEST_CUSTOMER_ID,
  API_TEST_DOCUMENT_ID,
  API_TEST_EMPLOYEE_ID,
  API_TEST_PRODUCT_ID,
  API_TEST_SUPPLIER_ID,
  API_TEST_TENANT_ID,
  API_TEST_WAREHOUSE_ID,
} from "./api-id-test-fixtures";

describe("parseRouteTenantId", () => {
  it("accepts valid tenant ids", () => {
    expect(parseRouteTenantId(API_TEST_TENANT_ID)).toBe(API_TEST_TENANT_ID);
  });

  it("rejects invalid tenant ids", () => {
    expect(() => parseRouteTenantId("ten_invalid")).toThrow(ApiRouteError);
    expect(() => parseRouteTenantId("")).toThrow(ApiRouteError);
  });
});

describe("parseRouteCustomerId", () => {
  it("accepts valid customer ids", () => {
    expect(parseRouteCustomerId(API_TEST_CUSTOMER_ID)).toBe(
      API_TEST_CUSTOMER_ID
    );
  });

  it("rejects wrong-family and malformed ids", () => {
    expect(() => parseRouteCustomerId(API_TEST_TENANT_ID)).toThrow(
      ApiRouteError
    );
    expect(() => parseRouteCustomerId("cus_invalid")).toThrow(ApiRouteError);
  });
});

describe("parseRouteSupplierId", () => {
  it("accepts valid supplier ids", () => {
    expect(parseRouteSupplierId(API_TEST_SUPPLIER_ID)).toBe(
      API_TEST_SUPPLIER_ID
    );
  });

  it("rejects wrong-family ids", () => {
    expect(() => parseRouteSupplierId(API_TEST_PRODUCT_ID)).toThrow(
      ApiRouteError
    );
  });
});

describe("parseRouteProductId", () => {
  it("accepts valid product ids", () => {
    expect(parseRouteProductId(API_TEST_PRODUCT_ID)).toBe(API_TEST_PRODUCT_ID);
  });

  it("rejects wrong-family and malformed ids", () => {
    expect(() => parseRouteProductId(API_TEST_EMPLOYEE_ID)).toThrow(
      ApiRouteError
    );
    expect(() => parseRouteProductId("prd_invalid")).toThrow(ApiRouteError);
  });
});

describe("parseRouteEmployeeId", () => {
  it("accepts valid employee ids", () => {
    expect(parseRouteEmployeeId(API_TEST_EMPLOYEE_ID)).toBe(
      API_TEST_EMPLOYEE_ID
    );
  });

  it("rejects malformed ids", () => {
    expect(() => parseRouteEmployeeId("emp_invalid")).toThrow(ApiRouteError);
  });
});

describe("parseRouteWarehouseId", () => {
  it("accepts valid warehouse ids", () => {
    expect(parseRouteWarehouseId(API_TEST_WAREHOUSE_ID)).toBe(
      API_TEST_WAREHOUSE_ID
    );
  });

  it("rejects wrong-family ids", () => {
    expect(() => parseRouteWarehouseId(API_TEST_PRODUCT_ID)).toThrow(
      ApiRouteError
    );
  });
});

describe("parseRouteDocumentId", () => {
  it("accepts valid document ids", () => {
    expect(parseRouteDocumentId(API_TEST_DOCUMENT_ID)).toBe(
      API_TEST_DOCUMENT_ID
    );
  });

  it("rejects wrong-family ids", () => {
    expect(() => parseRouteDocumentId(API_TEST_CUSTOMER_ID)).toThrow(
      ApiRouteError
    );
  });
});

describe("parseRouteAssetId", () => {
  it("accepts valid asset ids", () => {
    expect(parseRouteAssetId(API_TEST_ASSET_ID)).toBe(API_TEST_ASSET_ID);
  });

  it("rejects wrong-family ids", () => {
    expect(() => parseRouteAssetId(API_TEST_WAREHOUSE_ID)).toThrow(
      ApiRouteError
    );
  });
});
