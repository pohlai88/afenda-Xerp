import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import { isPublicAuthPolicy } from "@/server/api/contracts/auth-policy.contract";
import { IDEMPOTENCY_KEY_HEADER } from "@/server/api/contracts/idempotency.contract";
import {
  AFENDA_SESSION_COOKIE_NAME,
  STANDARD_ERROR_HTTP_STATUSES,
} from "@/server/api/contracts/openapi/afenda-openapi.components";
import {
  buildAfendaOpenapiDocument,
  contractIdToOperationId,
} from "@/server/api/contracts/openapi/build-afenda-openapi-document";
import { resolveContextPolicyHeaders } from "@/server/api/contracts/openapi/context-policy-openapi";

const snapshotPath = join(
  import.meta.dirname,
  "../contracts/afenda-internal-v1.openapi.json"
);

describe("OpenAPI document generation", () => {
  const document = buildAfendaOpenapiDocument(API_CONTRACTS);

  it("emits OpenAPI 3.1.0 with internal v1 server url", () => {
    expect(document.openapi).toBe("3.1.0");
    expect(document.servers).toEqual([
      {
        url: "/api/internal/v1",
        description:
          "ERP internal REST surface (relative to deployment origin).",
      },
    ]);
  });

  it("registers AfendaSession cookie security scheme", () => {
    expect(document.components?.securitySchemes?.["AfendaSession"]).toEqual({
      type: "apiKey",
      in: "cookie",
      name: AFENDA_SESSION_COOKIE_NAME,
      description: "Better Auth session cookie (default prefix).",
    });
  });

  it("maps every registry contract to a relative path operation", () => {
    for (const contract of API_CONTRACTS) {
      const relativePath = contract.path.replace("/api/internal/v1", "") || "/";
      const pathItem = document.paths?.[relativePath];
      expect(pathItem, `missing path for ${contract.id}`).toBeDefined();

      const operation =
        pathItem?.[
          contract.method.toLowerCase() as "get" | "post" | "put" | "delete"
        ];
      expect(operation, `missing operation for ${contract.id}`).toBeDefined();
      expect(operation?.operationId).toBe(contractIdToOperationId(contract.id));
      expect(operation?.["x-afenda-contract-id"]).toBe(contract.id);
      expect(operation?.["x-afenda-auth-policy"]).toBe(contract.authPolicy);
      expect(operation?.["x-afenda-context-policy"]).toBe(
        contract.contextPolicy
      );
      expect(operation?.["x-afenda-rate-limit-policy"]).toBe(
        contract.rateLimitPolicy
      );
      expect(operation?.["x-afenda-lifecycle"]).toBe(contract.lifecycle);
      expect(operation?.["x-afenda-permission"]).toBe(
        "permission" in contract && contract.permission !== undefined
          ? contract.permission.permission
          : null
      );
    }
  });

  it("applies session security for non-public routes and omits it for public routes", () => {
    for (const contract of API_CONTRACTS) {
      const relativePath = contract.path.replace("/api/internal/v1", "") || "/";
      const operation =
        document.paths?.[relativePath]?.[
          contract.method.toLowerCase() as "get" | "post" | "put" | "delete"
        ];

      if (isPublicAuthPolicy(contract.authPolicy)) {
        expect(operation?.security).toEqual([]);
      } else {
        expect(operation?.security).toEqual([{ AfendaSession: [] }]);
      }
    }
  });

  it("documents standard error responses on every operation", () => {
    for (const contract of API_CONTRACTS) {
      const relativePath = contract.path.replace("/api/internal/v1", "") || "/";
      const operation =
        document.paths?.[relativePath]?.[
          contract.method.toLowerCase() as "get" | "post" | "put" | "delete"
        ];

      for (const status of STANDARD_ERROR_HTTP_STATUSES) {
        expect(
          operation?.responses?.[String(status)],
          `${contract.id} missing ${status}`
        ).toBeDefined();
      }
    }
  });

  it("omits requestBody for undefined request schemas", () => {
    const healthOperation = document.paths?.["/health"]?.get;
    expect(healthOperation?.requestBody).toBeUndefined();
  });

  it("requires idempotency header when contract policy is required", () => {
    const putOperation = document.paths?.["/workspace/dashboard-layout"]?.put;
    const parameters = putOperation?.parameters ?? [];
    const idempotencyParameter = parameters.find(
      (parameter) =>
        typeof parameter === "object" &&
        parameter !== null &&
        "name" in parameter &&
        parameter.name === IDEMPOTENCY_KEY_HEADER
    );

    expect(idempotencyParameter).toMatchObject({
      in: "header",
      required: true,
    });
  });

  it("maps context policy headers without duplicating tenant slug strings", () => {
    const tenantHeaders = resolveContextPolicyHeaders("tenant-required").map(
      (header) => header.name
    );
    expect(tenantHeaders).toContain("x-tenant-slug");

    const orgHeaders = resolveContextPolicyHeaders(
      "tenant-company-org-required"
    ).map((header) => header.name);
    expect(orgHeaders).toContain("x-afenda-company-id");
    expect(orgHeaders).toContain("x-afenda-organization-id");
  });

  it("matches the committed OpenAPI snapshot", () => {
    const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
    expect(document).toEqual(snapshot);
  });
});

describe("contractIdToOperationId", () => {
  it("converts dotted contract ids to camelCase operation ids", () => {
    expect(contractIdToOperationId("internal.v1.health.get")).toBe(
      "internalV1HealthGet"
    );
    expect(contractIdToOperationId("internal.v1.auth.memberships.get")).toBe(
      "internalV1AuthMembershipsGet"
    );
  });
});
