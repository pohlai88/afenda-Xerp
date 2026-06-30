import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type {
  ApiIdempotencyPolicy,
  ApiRouteContract,
} from "@/server/api/contracts/api-contract";
import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import { API_GOVERNANCE_DOCUMENTATION_PATH } from "@/server/api/contracts/api-governance.constants";
import { isPublicAuthPolicy } from "@/server/api/contracts/auth-policy.contract";
import {
  acceptsIdempotencyKey,
  IDEMPOTENCY_KEY_HEADER,
} from "@/server/api/contracts/idempotency.contract";
import {
  AFENDA_SESSION_COOKIE_NAME,
  STANDARD_ERROR_HTTP_STATUSES,
  TRANSPORT_RESPONSE_HEADERS,
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

function resolveExpectedOperationDescription(
  contract: ApiRouteContract<unknown, unknown>
): string {
  return (
    contract.description ??
    `Governed ${contract.method} ${contract.path} (${contract.stability}).`
  );
}

type ApiContractWithIdempotency = ApiRouteContract<unknown, unknown> & {
  readonly idempotency: ApiIdempotencyPolicy;
};

function hasIdempotencyPolicy(
  contract: ApiRouteContract<unknown, unknown>
): contract is ApiContractWithIdempotency {
  return contract.idempotency !== undefined;
}

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

  it("declares document-level info, tags, and externalDocs metadata", () => {
    expect(document.info).toMatchObject({
      title: "Afenda ERP Internal API",
      version: "v1",
      contact: { name: "Afenda Platform" },
      license: { name: "UNLICENSED" },
    });
    expect(document.externalDocs).toEqual({
      description: "Afenda REST API governance and contract standards.",
      url: API_GOVERNANCE_DOCUMENTATION_PATH,
    });
    expect(document.tags).toEqual([
      { name: "health", description: "Service health and diagnostics." },
      {
        name: "auth",
        description: "Session authentication and membership resolution.",
      },
      { name: "workspace", description: "Workspace-scoped resources." },
      {
        name: "system-admin",
        description: "System administration — tenant management.",
      },
      { name: "storage", description: "Binary asset storage operations." },
      {
        name: "observability",
        description: "Client-side telemetry and error ingestion.",
      },
      {
        name: "public",
        description: "Routes callable without an authenticated session.",
      },
      {
        name: "memberships",
        description: "Tenant membership resolution and post-auth entry paths.",
      },
      {
        name: "service-actor",
        description: "Verified service-actor S2S bearer authentication probes.",
      },
      {
        name: "dashboard",
        description: "Workspace dashboard layout preferences.",
      },
      { name: "users", description: "System-admin user lifecycle operations." },
      { name: "audit", description: "System-admin audit event queries." },
      { name: "telemetry", description: "Client-side telemetry ingestion." },
      {
        name: "appearance",
        description: "Tenant branding and appearance asset management.",
      },
      {
        name: "inventory",
        description:
          "Inventory domain — products, warehouses, stock levels, and movements.",
      },
      { name: "products", description: "Product master data operations." },
      { name: "warehouses", description: "Warehouse master data operations." },
      {
        name: "stock",
        description: "Stock level queries and movement mutations.",
      },
      {
        name: "docs",
        description: "OpenAPI reference and generated specification.",
      },
    ]);
  });

  it("declares every operation tag at document level (PAS-001A R3c)", () => {
    const declaredTagNames = new Set(
      (document.tags ?? []).map((tag) => tag.name)
    );

    for (const contract of API_CONTRACTS) {
      for (const tag of contract.tags) {
        expect(declaredTagNames.has(tag)).toBe(true);
      }
    }

    for (const pathItem of Object.values(document.paths ?? {})) {
      for (const operation of Object.values(pathItem ?? {})) {
        if (
          typeof operation !== "object" ||
          operation === null ||
          !("tags" in operation)
        ) {
          continue;
        }

        for (const tag of (operation as { tags?: string[] }).tags ?? []) {
          expect(declaredTagNames.has(tag)).toBe(true);
        }
      }
    }
  });

  it("documents transport headers on success and standard error responses", () => {
    const healthOperation = document.paths?.["/health"]?.get;
    const successResponse = healthOperation?.responses?.["200"];
    const errorResponse = healthOperation?.responses?.["400"];

    expect(successResponse?.headers).toEqual(TRANSPORT_RESPONSE_HEADERS);
    expect(errorResponse?.headers).toMatchObject(TRANSPORT_RESPONSE_HEADERS);
  });

  it("documents POST success as 201 and non-POST success as 200", () => {
    for (const contract of API_CONTRACTS) {
      const relativePath = contract.path.replace("/api/internal/v1", "") || "/";
      const operation =
        document.paths?.[relativePath]?.[
          contract.method.toLowerCase() as "get" | "post" | "put" | "delete"
        ];

      if (contract.method === "POST") {
        expect(
          operation?.responses?.["201"],
          `${contract.id} missing 201`
        ).toBeDefined();
        expect(
          operation?.responses?.["200"],
          `${contract.id} should not document 200 when success is 201`
        ).toBeUndefined();
        continue;
      }

      expect(
        operation?.responses?.["200"],
        `${contract.id} missing 200`
      ).toBeDefined();
    }
  });

  it("documents rate-limit and transport headers on 429 standard error responses", () => {
    const healthOperation = document.paths?.["/health"]?.get;
    const rateLimitedResponse = healthOperation?.responses?.["429"];

    expect(rateLimitedResponse).toMatchObject({
      description: "Rate limit exceeded.",
      headers: {
        ...TRANSPORT_RESPONSE_HEADERS,
        "X-RateLimit-Limit": {
          description: "Maximum requests allowed in the current window.",
          schema: { type: "integer" },
        },
        "X-RateLimit-Remaining": {
          description: "Requests remaining in the current window.",
          schema: { type: "integer" },
        },
        "Retry-After": {
          description: "Seconds until the rate-limit window resets.",
          schema: { type: "integer" },
        },
      },
    });
  });

  it("sets deprecated on operations when lifecycle or stability is deprecated", () => {
    const baseContract = API_CONTRACTS[0];
    const deprecatedByLifecycle = buildAfendaOpenapiDocument([
      { ...baseContract, lifecycle: "deprecated" },
    ]);
    const deprecatedByStability = buildAfendaOpenapiDocument([
      { ...baseContract, stability: "deprecated" },
    ]);

    const lifecycleOperation =
      deprecatedByLifecycle.paths?.["/health"]?.get ??
      Object.values(deprecatedByLifecycle.paths ?? {})[0]?.get;
    const stabilityOperation =
      deprecatedByStability.paths?.["/health"]?.get ??
      Object.values(deprecatedByStability.paths ?? {})[0]?.get;

    expect(lifecycleOperation?.deprecated).toBe(true);
    expect(stabilityOperation?.deprecated).toBe(true);
  });

  it("omits deprecated flag for active internal-stable contracts", () => {
    for (const contract of API_CONTRACTS) {
      if (
        contract.lifecycle !== "active" ||
        contract.stability !== "internal-stable"
      ) {
        continue;
      }

      const relativePath = contract.path.replace("/api/internal/v1", "") || "/";
      const operation =
        document.paths?.[relativePath]?.[
          contract.method.toLowerCase() as "get" | "post" | "put" | "delete"
        ];

      expect(operation?.deprecated).toBeUndefined();
    }
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

  it("projects contract summary and description on every operation", () => {
    for (const contract of API_CONTRACTS) {
      const relativePath = contract.path.replace("/api/internal/v1", "") || "/";
      const operation =
        document.paths?.[relativePath]?.[
          contract.method.toLowerCase() as "get" | "post" | "put" | "delete"
        ];

      const expectedDescription = resolveExpectedOperationDescription(contract);

      expect(operation?.summary, `${contract.id} summary`).toBe(
        contract.summary
      );
      expect(operation?.description, `${contract.id} description`).toBe(
        expectedDescription
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

  it("documents optional idempotency header when contract policy is optional", () => {
    for (const contract of API_CONTRACTS) {
      if (!hasIdempotencyPolicy(contract)) {
        continue;
      }

      if (contract.idempotency.mode !== "optional") {
        continue;
      }

      const relativePath = contract.path.replace("/api/internal/v1", "") || "/";
      const operation =
        document.paths?.[relativePath]?.[
          contract.method.toLowerCase() as "get" | "post" | "put" | "delete"
        ];
      const parameters = operation?.parameters ?? [];
      const idempotencyParameter = parameters.find(
        (parameter) =>
          typeof parameter === "object" &&
          parameter !== null &&
          "name" in parameter &&
          parameter.name === IDEMPOTENCY_KEY_HEADER
      );

      expect(
        idempotencyParameter,
        `${contract.id} missing optional idempotency header`
      ).toMatchObject({
        in: "header",
        required: false,
      });
      expect(acceptsIdempotencyKey(contract.idempotency)).toBe(true);
    }
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

  it("projects Zod field descriptions from domain schemas into success response bodies", () => {
    const healthSuccessSchema =
      document.paths?.["/health"]?.get?.responses?.["200"]?.content?.[
        "application/json"
      ]?.schema;

    const healthStatusDescription = findSchemaPropertyDescription(
      document,
      healthSuccessSchema,
      ["data", "status"]
    );
    expect(healthStatusDescription).toBe(
      "Overall ERP health status derived from execution spine diagnostics."
    );

    const authSuccessSchema =
      document.paths?.["/auth/memberships"]?.get?.responses?.["200"]?.content?.[
        "application/json"
      ]?.schema;

    const authEntryPathDescription = findSchemaPropertyDescription(
      document,
      authSuccessSchema,
      ["data", "entryPath"]
    );
    expect(authEntryPathDescription).toBe(
      "Relative post-auth path the client should navigate to after membership resolution."
    );
  });

  it("projects cursor pagination query parameters on paginated operations", () => {
    const auditEventsOperation =
      document.paths?.["/system-admin/audit-events"]?.get;
    const parameters = auditEventsOperation?.parameters ?? [];

    const cursorParameter = parameters.find(
      (parameter) =>
        typeof parameter === "object" &&
        parameter !== null &&
        "name" in parameter &&
        parameter.name === "cursor"
    );
    const limitParameter = parameters.find(
      (parameter) =>
        typeof parameter === "object" &&
        parameter !== null &&
        "name" in parameter &&
        parameter.name === "limit"
    );

    expect(cursorParameter).toMatchObject({
      in: "query",
      required: false,
    });
    expect(limitParameter).toMatchObject({
      in: "query",
      required: false,
      schema: {
        type: "integer",
        default: 20,
        maximum: 100,
      },
    });
  });

  it("documents pagination meta on paginated GET success response schemas", () => {
    const auditEventsSuccessSchema =
      document.paths?.["/system-admin/audit-events"]?.get?.responses?.["200"]
        ?.content?.["application/json"]?.schema;

    const paginationDescription = findSchemaPropertyDescription(
      document,
      auditEventsSuccessSchema,
      ["meta", "pagination", "hasMore"]
    );
    expect(paginationDescription).toBe(
      "Whether additional items exist beyond this page."
    );

    const nextCursorDescription = findSchemaPropertyDescription(
      document,
      auditEventsSuccessSchema,
      ["meta", "pagination", "nextCursor"]
    );
    expect(nextCursorDescription).toBe(
      "Opaque cursor for the next page, or null when hasMore is false."
    );
  });

  it("matches the committed OpenAPI snapshot", () => {
    const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
    expect(document).toEqual(snapshot);
  });
});

function findSchemaPropertyDescription(
  document: ReturnType<typeof buildAfendaOpenapiDocument>,
  schema: unknown,
  path: readonly string[]
): string | undefined {
  let current: unknown = schema;

  for (const segment of path) {
    current = resolveOpenApiSchemaNode(document, current);
    if (current === undefined) {
      return;
    }

    if (
      typeof current !== "object" ||
      current === null ||
      !("properties" in current)
    ) {
      return;
    }

    const properties = (current as { properties?: Record<string, unknown> })
      .properties;
    current = properties?.[segment];
  }

  current = resolveOpenApiSchemaNode(document, current);

  if (
    typeof current !== "object" ||
    current === null ||
    !("description" in current)
  ) {
    return;
  }

  const description = (current as { description?: unknown }).description;
  return typeof description === "string" ? description : undefined;
}

function resolveOpenApiSchemaNode(
  document: ReturnType<typeof buildAfendaOpenapiDocument>,
  schema: unknown
): unknown {
  if (
    typeof schema !== "object" ||
    schema === null ||
    !("$ref" in schema) ||
    typeof (schema as { $ref?: unknown }).$ref !== "string"
  ) {
    return schema;
  }

  const ref = (schema as { $ref: string }).$ref;
  const refPrefix = "#/components/schemas/";
  if (!ref.startsWith(refPrefix)) {
    return schema;
  }

  const componentName = ref.slice(refPrefix.length);
  return document.components?.schemas?.[componentName];
}

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
