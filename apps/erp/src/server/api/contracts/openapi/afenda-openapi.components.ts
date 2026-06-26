import { z } from "zod";
import { createSchema } from "zod-openapi";

import { API_ERROR_CATEGORIES, API_ERROR_CODES } from "../api-error.contract";

export const AFENDA_SESSION_COOKIE_NAME = "better-auth.session_token";

export const apiResponseMetaSchema = z
  .object({
    correlationId: z.string(),
    requestId: z.string(),
    timestamp: z.string(),
  })
  .meta({ id: "ApiResponseMeta" });

export const apiErrorBodySchema = z
  .object({
    category: z.enum(API_ERROR_CATEGORIES),
    code: z.enum(API_ERROR_CODES),
    correlationId: z.string(),
    details: z.unknown().optional(),
    message: z.string(),
    retryable: z.boolean(),
  })
  .meta({ id: "ApiErrorBody" });

export const apiErrorEnvelopeSchema = z
  .object({
    error: apiErrorBodySchema,
    meta: apiResponseMetaSchema,
    ok: z.literal(false),
  })
  .meta({ id: "ApiErrorEnvelope" });

const { components: sharedOpenApiComponents } = createSchema(
  apiErrorEnvelopeSchema,
  { io: "output" }
);

export function createSuccessEnvelopeSchema<T extends z.ZodType>(
  dataSchema: T
): ReturnType<typeof createSchema> {
  return createSchema(
    z.object({
      data: dataSchema,
      meta: apiResponseMetaSchema,
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

export function buildStandardErrorResponses(errorSchema: z.ZodType): Record<
  string,
  {
    readonly content: {
      readonly "application/json": {
        readonly schema: z.ZodType;
      };
    };
    readonly description: string;
  }
> {
  const responses: Record<
    string,
    {
      content: { "application/json": { schema: z.ZodType } };
      description: string;
    }
  > = {};

  for (const status of STANDARD_ERROR_HTTP_STATUSES) {
    responses[String(status)] = {
      description: STANDARD_ERROR_DESCRIPTIONS[status],
      content: {
        "application/json": {
          schema: errorSchema,
        },
      },
    };
  }

  return responses;
}
