import { describe, expect, it } from "vitest";
import {
  TEST_CUSTOMER_ID,
  TEST_TENANT_ID,
} from "../../../__tests__/fixtures/enterprise-id.fixtures.js";
import { createTestEnterpriseId } from "../../index.js";
import {
  parseAuditEntityIdentity,
  serializeAuditEntityIdentity,
} from "../audit-event-identity.contract.js";

const TENANT_PK = "018f9f8c-9f1a-7c2b-9c20-000000000001";
const ENTITY_PK = "018f9f8c-9f1a-7c2b-9c20-000000000002";

describe("audit event identity (PAS-001 §4.1.9)", () => {
  it("accepts valid dual-field audit identity", () => {
    const identity = parseAuditEntityIdentity({
      tenantId: TEST_TENANT_ID,
      tenantPk: TENANT_PK,
      entityFamily: "customer",
      entityId: TEST_CUSTOMER_ID,
      entityPk: ENTITY_PK,
    });

    expect(serializeAuditEntityIdentity(identity)).toEqual({
      tenantId: TEST_TENANT_ID,
      tenantPk: TENANT_PK,
      entityId: TEST_CUSTOMER_ID,
      entityPk: ENTITY_PK,
    });
  });

  it("rejects wrong canonical entity prefix", () => {
    expect(() =>
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: TENANT_PK,
        entityFamily: "customer",
        entityId: createTestEnterpriseId("tenant"),
        entityPk: ENTITY_PK,
      })
    ).toThrow();
  });

  it("rejects malformed canonical entity ID", () => {
    expect(() =>
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: TENANT_PK,
        entityFamily: "customer",
        entityId: "cus_invalid",
        entityPk: ENTITY_PK,
      })
    ).toThrow();
  });

  it("rejects empty entityId", () => {
    expect(() =>
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: TENANT_PK,
        entityFamily: "customer",
        entityId: "",
        entityPk: ENTITY_PK,
      })
    ).toThrow();
  });

  it("rejects empty entityPk", () => {
    expect(() =>
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: TENANT_PK,
        entityFamily: "customer",
        entityId: TEST_CUSTOMER_ID,
        entityPk: "",
      })
    ).toThrow(/EntityPk is required/i);
  });

  it("rejects tenant human reference in entityId", () => {
    expect(() =>
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: TENANT_PK,
        entityFamily: "customer",
        entityId: "EMP-000123",
        entityPk: ENTITY_PK,
      })
    ).toThrow();
  });

  it("rejects UUID stored in entityId canonical field", () => {
    expect(() =>
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: TENANT_PK,
        entityFamily: "customer",
        entityId: ENTITY_PK,
        entityPk: ENTITY_PK,
      })
    ).toThrow();
  });

  it("rejects canonical enterprise ID stored in entityPk", () => {
    expect(() =>
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: TENANT_PK,
        entityFamily: "customer",
        entityId: TEST_CUSTOMER_ID,
        entityPk: TEST_CUSTOMER_ID,
      })
    ).toThrow(/EntityPk must not be a canonical enterprise ID/i);
  });

  it("rejects UUID v4 stored in entityPk", () => {
    expect(() =>
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: TENANT_PK,
        entityFamily: "customer",
        entityId: TEST_CUSTOMER_ID,
        entityPk: "018f9f8c-9f1a-4c2b-9c20-000000000002",
      })
    ).toThrow(/EntityPk has invalid internal entity PK format/i);
  });

  it("rejects non-UUID garbage stored in tenantPk", () => {
    expect(() =>
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: "internal-row-key",
        entityFamily: "customer",
        entityId: TEST_CUSTOMER_ID,
        entityPk: ENTITY_PK,
      })
    ).toThrow(/TenantPk has invalid internal entity PK format/i);
  });

  it("serializes trusted identity back to plain strings", () => {
    const wire = serializeAuditEntityIdentity(
      parseAuditEntityIdentity({
        tenantId: TEST_TENANT_ID,
        tenantPk: TENANT_PK,
        entityFamily: "customer",
        entityId: TEST_CUSTOMER_ID,
        entityPk: ENTITY_PK,
      })
    );

    expect(JSON.parse(JSON.stringify(wire))).toEqual(wire);
  });
});
