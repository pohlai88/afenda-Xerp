import type { ZodType } from "zod";
import { z } from "zod";
import { createDocument } from "zod-openapi";
import type { ApiHttpMethod, ApiRouteContract } from "../api-contract";
import {
  isPublicAuthPolicy,
  requiresSessionAuth,
} from "../auth-policy.contract";
import { IDEMPOTENCY_KEY_HEADER } from "../idempotency.contract";
import {
  afendaOpenApiSecuritySchemes,
  apiErrorEnvelopeSchema,
  buildStandardErrorResponses,
  createSuccessEnvelopeSchema,
  sharedOpenApiComponents,
} from "./afenda-openapi.components";
import { resolveContextPolicyHeaders } from "./context-policy-openapi";

const INTERNAL_V1_PATH_PREFIX = "/api/internal/v1";

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

function buildIdempotencyHeaderParameter(): {
  readonly description: string;
  readonly in: "header";
  readonly name: string;
  readonly required: true;
  readonly schema: { readonly minLength: number; readonly type: "string" };
} {
  return {
    description: "Unique key for safe mutation retries.",
    in: "header",
    name: IDEMPOTENCY_KEY_HEADER,
    required: true,
    schema: {
      type: "string",
      minLength: 8,
      maxLength: 128,
    },
  };
}

function buildOperationObject(
  contract: ApiRouteContract<unknown, unknown>
): Record<string, unknown> {
  const { schema: successSchema } = createSuccessEnvelopeSchema(
    contract.responseSchema
  );

  const parameters = [
    ...resolveContextPolicyHeaders(contract.contextPolicy).map((header) => ({
      description: header.description,
      in: header.in,
      name: header.name,
      required: header.required,
      schema: { type: "string" },
    })),
    ...(contract.idempotency?.mode === "required"
      ? [buildIdempotencyHeaderParameter()]
      : []),
  ];

  const operation: Record<string, unknown> = {
    operationId: contractIdToOperationId(contract.id),
    summary: contract.id,
    description: `Governed ${contract.method} ${contract.path} (${contract.stability}).`,
    tags: [...contract.tags],
    parameters: parameters.length > 0 ? parameters : undefined,
    responses: {
      "200": {
        description: "Successful response wrapped in the governed envelope.",
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

export function buildAfendaOpenapiDocument(
  contracts: readonly ApiRouteContract<unknown, unknown>[]
): ReturnType<typeof createDocument> {
  return createDocument({
    openapi: "3.1.0",
    info: {
      title: "Afenda ERP Internal API",
      version: "v1",
      description:
        "Registry-driven OpenAPI document for governed /api/internal/v1 routes.",
    },
    servers: [
      {
        url: "/api/internal/v1",
        description:
          "ERP internal REST surface (relative to deployment origin).",
      },
    ],
    components: {
      ...sharedOpenApiComponents,
      securitySchemes: afendaOpenApiSecuritySchemes,
    },
    paths: buildPathsFromContracts(contracts),
  });
}
