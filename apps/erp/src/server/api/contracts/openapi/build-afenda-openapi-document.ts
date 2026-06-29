import type { ZodType } from "zod";
import { z } from "zod";
import { createDocument, createSchema } from "zod-openapi";
import type { ApiHttpMethod, ApiRouteContract } from "../api-contract";
import { API_GOVERNANCE_DOCUMENTATION_PATH } from "../api-governance.constants";
import {
  isPublicAuthPolicy,
  requiresSessionAuth,
} from "../auth-policy.contract";
import {
  acceptsIdempotencyKey,
  IDEMPOTENCY_KEY_HEADER,
} from "../idempotency.contract";
import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  paginationQuerySchema,
} from "../pagination.contract";
import {
  afendaOpenApiSecuritySchemes,
  apiErrorEnvelopeSchema,
  buildStandardErrorResponses,
  createSuccessEnvelopeSchema,
  sharedOpenApiComponents,
  TRANSPORT_RESPONSE_HEADERS,
} from "./afenda-openapi.components";
import { resolveContextPolicyHeaders } from "./context-policy-openapi";

const INTERNAL_V1_PATH_PREFIX = "/api/internal/v1";

const AFENDA_OPENAPI_DOCUMENT_TAGS = [
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
  { name: "dashboard", description: "Workspace dashboard layout preferences." },
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
  { name: "stock", description: "Stock level queries and movement mutations." },
] as const;

function isContractDeprecated(
  contract: ApiRouteContract<unknown, unknown>
): boolean {
  return (
    contract.lifecycle === "deprecated" || contract.stability === "deprecated"
  );
}

type OpenApiPathItem = Record<string, unknown>;
type OpenApiPaths = Record<string, OpenApiPathItem>;

function stripInternalV1Prefix(path: string): string {
  if (!path.startsWith(INTERNAL_V1_PATH_PREFIX)) {
    throw new Error(
      `Contract path must start with ${INTERNAL_V1_PATH_PREFIX}: ${path}`
    );
  }

  const relativePath = path.slice(INTERNAL_V1_PATH_PREFIX.length);
  return relativePath.length > 0 ? relativePath : "/";
}

export function contractIdToOperationId(contractId: string): string {
  const parts = contractId.split(".");
  return parts
    .map((part, index) =>
      index === 0 ? part : `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    )
    .join("");
}

function isUndefinedRequestSchema(schema: ZodType): boolean {
  return schema instanceof z.ZodUndefined;
}

function resolveOperationSecurity(
  authPolicy: ApiRouteContract<unknown, unknown>["authPolicy"]
): readonly Record<string, readonly string[]>[] {
  if (isPublicAuthPolicy(authPolicy)) {
    return [];
  }

  if (requiresSessionAuth(authPolicy)) {
    return [{ AfendaSession: [] }];
  }

  return [{ AfendaSession: [] }];
}

function resolveOperationSuccessStatus(method: ApiHttpMethod): 200 | 201 {
  return method === "POST" ? 201 : 200;
}

function buildIdempotencyHeaderParameter(required: boolean): {
  readonly description: string;
  readonly in: "header";
  readonly name: string;
  readonly required: boolean;
  readonly schema: {
    readonly maxLength: number;
    readonly minLength: number;
    readonly type: "string";
  };
} {
  return {
    description: required
      ? "Unique key for safe mutation retries."
      : "Optional key for safe mutation retries when the client supports idempotency.",
    in: "header",
    name: IDEMPOTENCY_KEY_HEADER,
    required,
    schema: {
      type: "string",
      minLength: 8,
      maxLength: 128,
    },
  };
}

function buildCursorPaginationQueryParameters(): Array<{
  readonly description: string;
  readonly in: "query";
  readonly name: string;
  readonly required: boolean;
  readonly schema: Record<string, unknown>;
}> {
  const cursorField = paginationQuerySchema.shape.cursor;
  const limitField = paginationQuerySchema.shape.limit;

  return [
    {
      description:
        cursorField.meta()?.description ??
        "Opaque cursor from the prior page meta.pagination.nextCursor.",
      in: "query",
      name: "cursor",
      required: false,
      schema: {
        type: "string",
        example:
          cursorField.meta()?.["example"] ??
          "8f3a2b1c-4d5e-6f70-8192-a3b4c5d6e7f8",
      },
    },
    {
      description:
        limitField.meta()?.description ??
        `Maximum number of items to return (1-${MAX_PAGE_LIMIT}).`,
      in: "query",
      name: "limit",
      required: false,
      schema: {
        type: "integer",
        minimum: 1,
        maximum: MAX_PAGE_LIMIT,
        default: DEFAULT_PAGE_LIMIT,
        example: limitField.meta()?.["example"] ?? DEFAULT_PAGE_LIMIT,
      },
    },
  ];
}

function buildOperationObject(
  contract: ApiRouteContract<unknown, unknown>
): Record<string, unknown> {
  const successStatus = resolveOperationSuccessStatus(contract.method);
  const isCursorPaginated = contract.pagination?.mode === "cursor";
  const { schema: successSchema } = createSuccessEnvelopeSchema(
    contract.responseSchema,
    { includePaginationMeta: isCursorPaginated }
  );

  const parameters = [
    ...resolveContextPolicyHeaders(contract.contextPolicy).map((header) => ({
      description: header.description,
      in: header.in,
      name: header.name,
      required: header.required,
      schema: { type: "string" },
    })),
    ...(acceptsIdempotencyKey(contract.idempotency)
      ? [
          buildIdempotencyHeaderParameter(
            contract.idempotency?.mode === "required"
          ),
        ]
      : []),
    ...(isCursorPaginated ? buildCursorPaginationQueryParameters() : []),
  ];

  const operation: Record<string, unknown> = {
    operationId: contractIdToOperationId(contract.id),
    summary: contract.summary,
    description:
      contract.description ??
      `Governed ${contract.method} ${contract.path} (${contract.stability}).`,
    tags: [...contract.tags],
    ...(isContractDeprecated(contract) ? { deprecated: true } : {}),
    parameters: parameters.length > 0 ? parameters : undefined,
    responses: {
      [String(successStatus)]: {
        description: "Successful response wrapped in the governed envelope.",
        headers: TRANSPORT_RESPONSE_HEADERS,
        content: {
          "application/json": {
            schema: successSchema,
          },
        },
      },
      ...buildStandardErrorResponses(apiErrorEnvelopeSchema),
    },
    security: resolveOperationSecurity(contract.authPolicy),
    "x-afenda-auth-policy": contract.authPolicy,
    "x-afenda-context-policy": contract.contextPolicy,
    "x-afenda-contract-id": contract.id,
    "x-afenda-lifecycle": contract.lifecycle,
    "x-afenda-permission":
      "permission" in contract && contract.permission !== undefined
        ? contract.permission.permission
        : null,
    "x-afenda-rate-limit-policy": contract.rateLimitPolicy,
  };

  if (!isUndefinedRequestSchema(contract.requestSchema)) {
    operation["requestBody"] = {
      required: true,
      content: {
        "application/json": {
          schema: contract.requestSchema,
        },
      },
    };
  }

  return operation;
}

function methodKey(method: ApiHttpMethod): Lowercase<ApiHttpMethod> {
  return method.toLowerCase() as Lowercase<ApiHttpMethod>;
}

function buildPathsFromContracts(
  contracts: readonly ApiRouteContract<unknown, unknown>[]
): OpenApiPaths {
  const paths: OpenApiPaths = {};

  for (const contract of contracts) {
    const openApiPath = stripInternalV1Prefix(contract.path);
    const operation = buildOperationObject(contract);
    const httpMethod = methodKey(contract.method);

    const existingPathItem = paths[openApiPath] ?? {};
    paths[openApiPath] = {
      ...existingPathItem,
      [httpMethod]: operation,
    };
  }

  return paths;
}

type OpenApiComponentSchemas = NonNullable<
  NonNullable<ReturnType<typeof createDocument>["components"]>["schemas"]
>;

function flattenCreateSchemaComponents(
  components: unknown
): OpenApiComponentSchemas {
  if (typeof components !== "object" || components === null) {
    return {};
  }

  const record = components as Record<string, unknown>;
  const nestedSchemas = record["schemas"];
  if (typeof nestedSchemas === "object" && nestedSchemas !== null) {
    return { ...(nestedSchemas as OpenApiComponentSchemas) };
  }

  return { ...(record as OpenApiComponentSchemas) };
}

function collectRequestSchemaComponents(
  contracts: readonly ApiRouteContract<unknown, unknown>[]
): OpenApiComponentSchemas {
  const schemas: OpenApiComponentSchemas = {};

  for (const contract of contracts) {
    if (isUndefinedRequestSchema(contract.requestSchema)) {
      continue;
    }

    Object.assign(
      schemas,
      flattenCreateSchemaComponents(
        createSchema(contract.requestSchema, { io: "input" }).components
      )
    );
  }

  return schemas;
}

function collectResponseSchemaComponents(
  contracts: readonly ApiRouteContract<unknown, unknown>[]
): OpenApiComponentSchemas {
  const schemas: OpenApiComponentSchemas = {};

  for (const contract of contracts) {
    Object.assign(
      schemas,
      flattenCreateSchemaComponents(
        createSchema(contract.responseSchema, { io: "output" }).components
      )
    );
    Object.assign(
      schemas,
      flattenCreateSchemaComponents(
        createSuccessEnvelopeSchema(contract.responseSchema, {
          includePaginationMeta: contract.pagination?.mode === "cursor",
        }).components
      )
    );
  }

  return schemas;
}

export function buildAfendaOpenapiDocument(
  contracts: readonly ApiRouteContract<unknown, unknown>[]
): ReturnType<typeof createDocument> {
  const sharedSchemas = flattenCreateSchemaComponents(sharedOpenApiComponents);
  const requestSchemas = collectRequestSchemaComponents(contracts);
  const responseSchemas = collectResponseSchemaComponents(contracts);

  const document = createDocument({
    openapi: "3.1.0",
    info: {
      title: "Afenda ERP Internal API",
      version: "v1",
      description:
        "Registry-driven OpenAPI document for governed /api/internal/v1 routes.",
      contact: {
        name: "Afenda Platform",
      },
      license: {
        name: "UNLICENSED",
      },
    },
    externalDocs: {
      description: "Afenda REST API governance and contract standards.",
      url: API_GOVERNANCE_DOCUMENTATION_PATH,
    },
    tags: [...AFENDA_OPENAPI_DOCUMENT_TAGS],
    servers: [
      {
        url: "/api/internal/v1",
        description:
          "ERP internal REST surface (relative to deployment origin).",
      },
    ],
    components: {
      schemas: {
        ...requestSchemas,
        ...responseSchemas,
        ...sharedSchemas,
      },
      securitySchemes: afendaOpenApiSecuritySchemes,
    },
    paths: buildPathsFromContracts(contracts),
  });

  const generatedSchemas = document.components?.schemas ?? {};

  return {
    ...document,
    components: {
      ...document.components,
      schemas: {
        ...requestSchemas,
        ...responseSchemas,
        ...sharedSchemas,
        ...generatedSchemas,
      },
      securitySchemes: afendaOpenApiSecuritySchemes,
    },
  };
}
