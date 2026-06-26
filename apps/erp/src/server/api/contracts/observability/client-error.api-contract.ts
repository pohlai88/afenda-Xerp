import { z } from "zod";

const clientErrorSlugSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[\w.-]+$/u)
  .meta({
    description:
      "Route or UI segment slug where the client error occurred (alphanumeric, dots, hyphens).",
    example: "dashboard",
  });

const clientErrorDigestSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[\w.-]+$/u)
  .meta({
    description:
      "Stable digest identifying the error class for deduplication and aggregation.",
    example: "chunk-load-error.abc123",
  });

export const clientErrorPostRequestSchema = z
  .object({
    digest: clientErrorDigestSchema.meta({
      description: "Error digest emitted by the client runtime.",
    }),
    segment: clientErrorSlugSchema.meta({
      description: "Application segment or route associated with the error.",
    }),
  })
  .meta({
    id: "ClientErrorPostRequest",
    description:
      "Client-reported error payload for observability ingestion (fire-and-forget).",
  });

export type ClientErrorPostRequestDto = z.infer<
  typeof clientErrorPostRequestSchema
>;

export const clientErrorPostResponseSchema = z
  .object({
    accepted: z.literal(true).meta({
      description:
        "Acknowledgement that the error report was accepted for processing.",
      example: true,
    }),
  })
  .meta({
    id: "ClientErrorPostResponse",
    description: "Acknowledgement response for client error ingestion.",
  });

export type ClientErrorPostResponseDto = z.infer<
  typeof clientErrorPostResponseSchema
>;
