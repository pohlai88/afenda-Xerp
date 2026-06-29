import { z } from "zod";
import { createSchema } from "zod-openapi";
import { CORRELATION_ID_HEADER } from "../../../../lib/observability/correlation-header";
import { API_ERROR_CATEGORIES, API_ERROR_CODES } from "../api-error.contract";
import { paginationMetaSchema } from "../pagination.contract";

const REQUEST_ID_HEADER = "x-request-id" as const;

export const AFENDA_SESSION_COOKIE_NAME = "better-auth.session_token";

export const apiResponseMetaSchema = z
  .object({
    correlationId: z.string().meta({
      description:
        "End-to-end correlation identifier propagated across services for this request.",
      example: "corr_01HXYZABCDEF",
    }),
    requestId: z.string().meta({
      description: "Unique identifier for this HTTP request within the ERP.",
      example: "req_01HXYZABCDEF",
    }),
    timestamp: z.string().meta({
      description: "ISO-8601 timestamp when the response was generated.",
      example: "2026-06-26T12:00:00.000Z",
    }),
  })
  .meta({
    id: "ApiResponseMeta",
    description: "Standard metadata envelope included on every API response.",
  });

export const apiErrorBodySchema = z
  .object({
    category: z.enum(API_ERROR_CATEGORIES).meta({
      description: "High-level error category for client handling.",
      example: "validation",
    }),
    code: z.enum(API_ERROR_CODES).meta({
      description: "Stable machine-readable error code.",
      example: "validation_failed",
    }),
    correlationId: z.string().meta({
      description: "Correlation identifier matching the request meta.",
      example: "corr_01HXYZABCDEF",
    }),
    details: z.unknown().optional().meta({
      description:
        "Optional structured validation or context details (shape varies by error code).",
    }),
    message: z.string().meta({
      description: "Human-readable error message safe to display to operators.",
      example: "Request validation failed.",
    }),
    retryable: z.boolean().meta({
      description: "Whether the client may safely retry the same request.",
      example: false,
    }),
  })
  .meta({
    id: "ApiErrorBody",
    description: "Governed error payload nested inside the error envelope.",
  });

export const apiErrorEnvelopeSchema = z
  .object({
    error: apiErrorBodySchema.meta({
      description: "Structured error details for failed requests.",
    }),
    meta: apiResponseMetaSchema.meta({
      description: "Response metadata for the failed request.",
    }),
    ok: z.literal(false).meta({
      description: "Discriminator indicating an error response.",
      example: false,
    }),
  })
  .meta({
    id: "ApiErrorEnvelope",
    description: "Standard error envelope for governed internal API routes.",
  });

const { components: sharedOpenApiComponents } = createSchema(
  apiErrorEnvelopeSchema,
  { io: "output" }
);

export function createSuccessEnvelopeSchema<T extends z.ZodType>(
  dataSchema: T,
  options?: { readonly includePaginationMeta?: boolean }
): ReturnType<typeof createSchema> {
  const metaSchema =
    options?.includePaginationMeta === true
      ? apiResponseMetaSchema.extend({
          pagination: paginationMetaSchema,
        })
      : apiResponseMetaSchema;

  return createSchema(
    z.object({
      data: dataSchema,
      meta: metaSchema,
      ok: z.literal(true),
    }),
    { io: "output" }
  );
}

export { sharedOpenApiComponents };

export const afendaOpenApiSecuritySchemes = {
  AfendaSession: {
    type: "apiKey" as const,
    in: "cookie" as const,
    name: AFENDA_SESSION_COOKIE_NAME,
    description: "Better Auth session cookie (default prefix).",
  },
};

export const STANDARD_ERROR_HTTP_STATUSES = [
  400, 401, 403, 404, 409, 429, 500, 503,
] as const;

export type StandardErrorHttpStatus =
  (typeof STANDARD_ERROR_HTTP_STATUSES)[number];

const STANDARD_ERROR_DESCRIPTIONS: Record<StandardErrorHttpStatus, string> = {
  400: "Bad request or validation failure.",
  401: "Authentication is required.",
  403: "The caller lacks permission for this action.",
  404: "The requested resource was not found.",
  409: "The request conflicts with the current state.",
  429: "Rate limit exceeded.",
  500: "Unexpected server error.",
  503: "Service temporarily unavailable.",
};

const RATE_LIMIT_RESPONSE_HEADERS = {
  "X-RateLimit-Limit": {
    description: "Maximum requests allowed in the current window.",
    schema: { type: "integer" as const },
  },
  "X-RateLimit-Remaining": {
    description: "Requests remaining in the current window.",
    schema: { type: "integer" as const },
  },
  "Retry-After": {
    description: "Seconds until the rate-limit window resets.",
    schema: { type: "integer" as const },
  },
} as const;

export const TRANSPORT_RESPONSE_HEADERS = {
  [CORRELATION_ID_HEADER]: {
    description:
      "End-to-end correlation identifier propagated across services for this request.",
    schema: { type: "string" as const },
  },
  [REQUEST_ID_HEADER]: {
    description: "Unique identifier for this HTTP request within the ERP.",
    schema: { type: "string" as const },
  },
  "Cache-Control": {
    description:
      "HTTP caching directive derived from the route cache policy (typically no-store for governed mutations).",
    schema: { type: "string" as const },
  },
} as const;

type OpenApiResponseHeaders = typeof TRANSPORT_RESPONSE_HEADERS &
  Partial<typeof RATE_LIMIT_RESPONSE_HEADERS>;

export function buildStandardErrorResponses(errorSchema: z.ZodType): Record<
  string,
  {
    readonly content: {
      readonly "application/json": {
        readonly schema: z.ZodType;
      };
    };
    readonly description: string;
    readonly headers: OpenApiResponseHeaders;
  }
> {
  const responses: Record<
    string,
    {
      content: { "application/json": { schema: z.ZodType } };
      description: string;
      headers: OpenApiResponseHeaders;
    }
  > = {};

  for (const status of STANDARD_ERROR_HTTP_STATUSES) {
    responses[String(status)] = {
      description: STANDARD_ERROR_DESCRIPTIONS[status],
      headers: {
        ...TRANSPORT_RESPONSE_HEADERS,
        ...(status === 429 ? RATE_LIMIT_RESPONSE_HEADERS : {}),
      },
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    };
  }

  return responses;
}
